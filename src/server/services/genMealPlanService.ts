import type { WeekMeals, WeekMealsResponse, Nutrients, DayMealsResponse, DayMeals, UserMealOpts, Meal } from '../utils/utils.ts';

export async function genMealPlan(userMealOpts: Required<UserMealOpts>): Promise<(DayMeals | WeekMeals)[]> {
    const mealPromises = [];
    for (let i = 0; i < userMealOpts.numOfMeals; i++) {
        mealPromises.push(getMealPlan(userMealOpts));
    }
    const userMealPlan = await Promise.all(mealPromises);

    return userMealPlan;
}

async function getMealPlan(userMealOpts: UserMealOpts): Promise<DayMeals | WeekMeals> {
    const baseUrl = 'https://api.spoonacular.com/mealplanner/generate';
    const params = new URLSearchParams();

    if (userMealOpts.diet) params.set('diet', userMealOpts.diet);
    if (userMealOpts.exclude) params.set('exclude', userMealOpts.exclude);
    params.set('targetCalories', userMealOpts.targetCalories.toString());
    params.set('timeFrame', userMealOpts.timeFrame);
    params.set('apiKey', process.env.SPOONACULAR_KEY!);

    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    const mealsObj: DayMealsResponse | WeekMealsResponse = (await response.json()) as DayMealsResponse | WeekMealsResponse;
    if (userMealOpts.timeFrame === 'day') return parseDayMeals(mealsObj as DayMealsResponse);
    return parseWeekMeals(mealsObj as WeekMealsResponse);
}

function parseWeekMeals(mealsObj: WeekMealsResponse): WeekMeals {
    const userWeekMeals = {
        monday: {
            nutrients: {} as Nutrients,
            meals: [{} as Meal, {} as Meal, {} as Meal],
        },
        tuesday: {
            nutrients: {} as Nutrients,
            meals: [{} as Meal, {} as Meal, {} as Meal],
        },
        wednesday: {
            nutrients: {} as Nutrients,
            meals: [{} as Meal, {} as Meal, {} as Meal],
        },
        thursday: {
            nutrients: {} as Nutrients,
            meals: [{} as Meal, {} as Meal, {} as Meal],
        },
        friday: {
            nutrients: {} as Nutrients,
            meals: [{} as Meal, {} as Meal, {} as Meal],
        },
        saturday: {
            nutrients: {} as Nutrients,
            meals: [{} as Meal, {} as Meal, {} as Meal],
        },
        sunday: {
            nutrients: {} as Nutrients,
            meals: [{} as Meal, {} as Meal, {} as Meal],
        },
    };

    for (const day in userWeekMeals) {
        const key = day as keyof WeekMeals;

        for (let i = 0; i < mealsObj.week[key].meals.length; i++) {
            userWeekMeals[key].meals[i]!.id = mealsObj.week[key].meals[i]!.id;
            userWeekMeals[key].meals[i]!.readyInMinutes = mealsObj.week[key].meals[i]!.readyInMinutes;
            userWeekMeals[key].meals[i]!.servings = mealsObj.week[key].meals[i]!.servings;
            userWeekMeals[key].meals[i]!.sourceUrl = mealsObj.week[key].meals[i]!.sourceUrl;
            userWeekMeals[key].meals[i]!.title = mealsObj.week[key].meals[i]!.title;
        }
        userWeekMeals[key].nutrients = mealsObj.week[key].nutrients;
    }

    return userWeekMeals;
}

function parseDayMeals(mealsObj: DayMealsResponse): DayMeals {
    const userDayMeals = {
        meal1: {} as Meal,
        meal2: {} as Meal,
        meal3: {} as Meal,
        nutrients: {} as Nutrients,
    };

    for (let i = 0; i < mealsObj.meals.length; i++) {
        let meal = mealsObj.meals[i];
        const key = `meal${i + 1}` as keyof DayMeals;

        if (key === 'nutrients') continue;

        userDayMeals[key].id = meal!.id;
        userDayMeals[key].readyInMinutes = meal!.readyInMinutes;
        userDayMeals[key].servings = meal!.servings;
        userDayMeals[key].sourceUrl = meal!.sourceUrl;
        userDayMeals[key].title = meal!.title;
    }

    userDayMeals.nutrients = mealsObj.nutrients;

    return userDayMeals;
}
