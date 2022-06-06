import chalk from "chalk";
import fs from "fs";
import path from "path";
import { Manager } from "./Manager";
import { getComPath } from "./utils/getComPath";
import anymatch, { type Matcher } from "anymatch";

/**
 * 同步目录和文件
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 */
export async function syncDF(localDir: string, remoteDir: string, ignored?: Matcher) {
    //忽略
    if (ignored && anymatch(ignored, getComPath(localDir))) {
        return;
    }
    let stat = fs.statSync(localDir);
    if (stat.isFile()) {
        await new Promise<void>((r, e) => {
            //上传
            Manager.sftp.fastPut(localDir, getComPath(remoteDir), (err) => {
                if (err) {
                    console.log(chalk.red('同步失败!', localDir, remoteDir));
                    e();
                    return;
                }
                console.log(chalk.gray('同步成功'), localDir, chalk.gray('->'), chalk.green(getComPath(remoteDir)));
                r();
            });
        });
    } else if (stat.isDirectory()) {
        //创建目录
        await new Promise<void>((r) => {
            Manager.sftp.mkdir(getComPath(remoteDir), () => {
                r();
            });
        });
        //
        await Promise.all(fs.readdirSync(localDir).map((o) => {
            return syncDF(path.join(localDir, o), path.join(remoteDir, o), ignored);
        }));
    }
}