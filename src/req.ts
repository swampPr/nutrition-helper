async function tryUSDA() {
    const response = await fetch('https://api.nal.usda.gov/fdc/v1/foods/search?query=Cheddar%20Cheese', {
        headers: {
            'X-Api-Key': process.env.USDA_KEY as string,
        },
    });

    console.log(await response.json());
}

async function trySpoon() {
    const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=${process.env.SPOONACULAR_KEY}&targetCalories=2000`, {
        headers: {
            Accept: 'application/json',
        },
    });

    console.log(await response.json());
}

trySpoon();
