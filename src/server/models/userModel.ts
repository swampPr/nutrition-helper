import { Database } from 'bun:sqlite';
import type { User } from '../utils/utils.ts';
import type { NewUser } from '../utils/utils.ts';

const userDB = new Database('./src/server/db/users.db', { create: true });
userDB
    .query(
        `
    CREATE TABLE IF NOT EXISTS users(
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT UNIQUE,
     first_name TEXT,
     last_name TEXT,
     email TEXT UNIQUE,
     password TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `
    )
    .run();

userDB
    .query(
        `
    CREATE TABLE IF NOT EXISTS user_calorie_log(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date DATE NOT NULL,
        total_calories INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, date)
    )

    `
    )
    .run();

userDB
    .query(
        `
CREATE TABLE IF NOT EXISTS user_water_log(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    total_ml INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
)

`
    )
    .run();

export const findUser = (userID: number): User | null => userDB.query(`select * from users where id = ?`).get(userID) as User | null;

export const findEmail = (userEmail: string): string | null => userDB.query(`select email from users where email = ?`).get(userEmail) as string | null;

export function insertNewUser(userInfo: NewUser) {
    userDB.query(`insert into users (username, password, first_name, last_name, email) values(?, ?, ?, ?, ?)`).run(userInfo.username, userInfo.password, userInfo.firstName, userInfo.lastName, userInfo.email);
}

export function findUserID(userName: string): number | null {
    const userObj = userDB.query(`select id from users where username = ?`).get(userName) as { id: number } | null;
    if (userObj === null) return null;
    return userObj.id;
}
