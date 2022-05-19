import chalk from "chalk";
import fs from "fs";
import path from "path";
import { SFTPWrapper } from "ssh2";
import { getComPath } from "./utils/getComPath";

/**
 * 同步目录和文件
 * @param sftp 操作句柄
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 */
export async function syncDF(sftp: SFTPWrapper, localDir: string, remoteDir: string) {
    let stat = fs.statSync(localDir);
    if (stat.isFile()) {
        await new Promise<void>((r, e) => {
            //上传
            sftp.fastPut(localDir, getComPath(remoteDir), (err) => {
                if (err) {
                    console.log(chalk.red('上传失败!', localDir, remoteDir));
                    e();
                    return;
                }
                console.log(chalk.gray('上传'), localDir, chalk.gray('-->'), chalk.green(remoteDir));
                r();
            });
        });
    } else if (stat.isDirectory()) {
        //创建目录
        await new Promise<void>((r) => {
            sftp.mkdir(getComPath(remoteDir), () => {
                r();
            });
        });
        //
        await Promise.all(fs.readdirSync(localDir).map((o) => {
            return syncDF(sftp, path.join(localDir, o), path.join(remoteDir, o));
        }));
    }
}