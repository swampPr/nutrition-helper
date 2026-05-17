import { Hono } from 'hono';
import { logger } from 'hono/logger';
import MainRouter from './server/routers/mainRouter.ts';
import RedisClient from './server/utils/redis.ts';
import { Logger } from './server/utils/utils.ts';
import { serveStatic } from 'hono/bun';

const app = new Hono();
await RedisClient.connect()
    .catch((err) => Logger.Error(`Redis Client Error: ${err}`))
    .then(() => Logger.Info('Redis connected successfully'));

app.use(logger());

app.use('/dashboard', serveStatic({ root: './src/public/' }));
app.use('/meal-planner', serveStatic({ root: './src/public/' }));

app.route('/api', MainRouter);

export default {
    port: 8080,
    fetch: app.fetch,
};
