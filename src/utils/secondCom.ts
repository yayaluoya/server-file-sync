import chalk from "chalk";
import readline from "readline";

/**
 * 二次确定
 */
export function secondCom(title) {
    return new Promise<string>((r, e) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        //
        rl.question(chalk.cyan(title), (input) => {
            rl.close();
            r(input);
        });
    });
}