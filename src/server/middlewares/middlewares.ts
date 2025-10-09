import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import RedisClient from '../utils/redis.ts';
import type { SessionID } from '../utils/utils.ts';

export abstract class Middlewares {
    static checkSession = async (c: Context, next: Next) => {
        const sessionID: SessionID = getCookie(c, 'session_id') as string;
        if (!sessionID)
            return c.json(
                {
                    error: 'Not logged in',
                },
                401
            );

        const sessionCheck = await RedisClient.exists(`session:${sessionID}`);
        if (!sessionCheck)
            return c.json(
                {
                    error: 'Session expired',
                },
                401
            );

        const sessionData = JSON.parse((await RedisClient.get(`session:${sessionID}`)) as string);
        c.set('SessionData', sessionData);

        await next();
    };
}
