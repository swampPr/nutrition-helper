import type { Context } from 'hono';
import RedisClient from '../utils/redis.ts';
import { findEmail, findUserID } from '../models/userModel.ts';
import { Logger, type SessionID, type NewUser } from '../utils/utils.ts';
import { setCookie } from 'hono/cookie';
import { insertNewUser } from '../models/userModel.ts';

export default async function RegisterHandler(c: Context) {
    const registerInfo = (await c.req.json()) as NewUser;
    const userCheck = findUserID(registerInfo.username);
    if (userCheck !== null) {
        return c.json(
            {
                error: 'Username already in use',
            },
            400
        );
    }

    const emailCheck = findEmail(registerInfo.email);
    if (emailCheck !== null) {
        return c.json(
            {
                error: 'Email already in use',
            },
            400
        );
    }

    try {
        insertNewUser(registerInfo);
    } catch (err) {
        Logger.Error(err);
        return c.json(
            {
                error: 'Error inserting user into database',
                message: 'Something went wrong please try again...',
            },
            500
        );
    }
    const sessionID: SessionID = crypto.randomUUID();
    const sessionData = {
        password: registerInfo.password,
        username: registerInfo.username,
        userID: findUserID(registerInfo.username),
        sessionID,
    };
    await RedisClient.set(`session:${sessionID}`, JSON.stringify(sessionData));
    await RedisClient.expire(`session:${sessionID}`, 86400);
    setCookie(c, 'session_id', sessionID);

    //TODO: Send dashboard page
    return c.redirect('/dashboard');
    // return c.text('REGISTERED AND LOGGED IN', 201);
}
