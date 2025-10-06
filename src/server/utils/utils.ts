import chalk from 'chalk';

export type SessionID = string | undefined;

export type User = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    id: number;
    created_at: Date;
};

export type NewUser = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
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
