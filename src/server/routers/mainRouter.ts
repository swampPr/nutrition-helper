import { Hono } from 'hono';
import { Middlewares } from '../middlewares/middlewares.ts';
import LoginHandler from '../handlers/loginHandler.ts';
import RegisterHandler from '../handlers/registerHandler.ts';

const app = new Hono();

// app.use(Middlewares.checkSession);
app.post('/login', LoginHandler);
app.post('/register', RegisterHandler);

export default app;
