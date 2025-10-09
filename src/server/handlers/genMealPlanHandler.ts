import type { Context } from 'hono';
import { genMealPlan } from '../services/genMealPlanService.ts';
import { Logger, type UserMealOpts } from '../utils/utils.ts';

export default async function GenMealPlanHandler(c: Context) {
    try {
        const userMealOpts: Required<UserMealOpts> = await c.req.json();
        const userMeals = await genMealPlan(userMealOpts);

        return c.json(userMeals);
    } catch (err) {
        Logger.Error(err);
        return c.json(
            {
                error: 'Something went wrong...',
            },
            500
        );
    }
}
