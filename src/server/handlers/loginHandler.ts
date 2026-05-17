import type { Context } from 'hono';
import RedisClient from '../utils/redis.ts';
import { findUser, findUserID } from '../models/userModel.ts';
import type { SessionID } from '../utils/utils.ts';
import { setCookie } from 'hono/cookie';
import type { User } from '../utils/utils.ts';

export default async function LoginHandler(c: Context) {
    const loginInfo = await c.req.json();
    const userID = findUserID(loginInfo.username);
    if (userID === null) {
        return c.json(
            {
                error: 'Invalid username',
            },
            404
        );
    }

    const userInfo = findUser(userID) as User;
    if (userInfo.password !== loginInfo.password) {
        return c.json(
            {
                error: 'Invalid password',
            },
            401
        );
    }

    const sessionID: SessionID = crypto.randomUUID();
    const sessionData = {
        userID,
        username: loginInfo.username,
        password: loginInfo.password,
        sessionID,
    };

    await RedisClient.set(`session:${sessionID}`, JSON.stringify(sessionData));
    await RedisClient.expire(`session:${sessionID}`, 86400);
    setCookie(c, 'session_id', sessionID);

    //TODO: Send dashboard page
    return c.redirect('/dashboard');
}
