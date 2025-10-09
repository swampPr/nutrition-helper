import chalk from 'chalk';

export type SessionID = string;

export type User = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    id: number;
    created_at: Date;
};

export type UserMealOpts = {
    numOfMeals?: number;
    timeFrame: 'day' | 'week';
    targetCalories: number;
    diet: string;
    exclude: string;
};

export type NewUser = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
};

export type Nutrients = {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
};

export type DayMeals = {
    meal1: Meal;
    meal2: Meal;
    meal3: Meal;
    nutrients: Nutrients;
};

export type WeekMeals = {
    monday: {
        nutrients: Nutrients;
        meals: Meal[];
    };
    tuesday: {
        nutrients: Nutrients;
        meals: Meal[];
    };
    wednesday: {
        nutrients: Nutrients;
        meals: Meal[];
    };
    thursday: {
        nutrients: Nutrients;
        meals: Meal[];
    };
    friday: {
        nutrients: Nutrients;
        meals: Meal[];
    };
    saturday: {
        nutrients: Nutrients;
        meals: Meal[];
    };
    sunday: {
        nutrients: Nutrients;
        meals: Meal[];
    };
};

export type Meal = Omit<DayMealsResponseMeal, 'image' | 'imageType'>;

export type DayMealsResponseMeal = {
    id: number;
    image: string;
    imageType: string;
    title: string;
    readyInMinutes: number;
    servings: number;
    sourceUrl: string;
    nutrients: Nutrients;
};

export type WeekMealsResponse = {
    week: {
        monday: DayMealsResponse;
        tuesday: DayMealsResponse;
        wednesday: DayMealsResponse;
        thursday: DayMealsResponse;
        friday: DayMealsResponse;
        saturday: DayMealsResponse;
        sunday: DayMealsResponse;
    };
};

export type DayMealsResponse = {
    meals: [DayMealsResponseMeal, DayMealsResponseMeal, DayMealsResponseMeal];
    nutrients: Nutrients;
};

export abstract class Logger {
    static Warning(str: string) {
        console.log(chalk.rgb(255, 165, 0).bold(`[WARNING]: ${str}`));
    }

    static Error(str: unknown) {
        console.log(chalk.redBright.bold(`[ERROR]: ${str}`));
    }

    static Info(str: string) {
        console.log(chalk.greenBright.bold(`[INFO]: ${str}`));
    }
}
