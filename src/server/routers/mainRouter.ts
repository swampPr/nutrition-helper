import { Hono } from 'hono';
import { Middlewares } from '../middlewares/middlewares.ts';
import LoginHandler from '../handlers/loginHandler.ts';
import RegisterHandler from '../handlers/registerHandler.ts';
import GenMealPlanHandler from '../handlers/genMealPlanHandler.ts';

const app = new Hono();

app.use('/meal', Middlewares.checkSession);
app.post('/login', LoginHandler);
app.post('/register', RegisterHandler);
app.post('/meal', GenMealPlanHandler);

export default app;
