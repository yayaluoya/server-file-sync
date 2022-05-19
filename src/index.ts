import { IConfig } from "./config";
import ssh2, { SFTPWrapper } from "ssh2";
import chalk from "chalk";
import { syncDF } from "./syncDF";
import { getAbsolute } from "./utils/getAbsolute";
import { watchDf } from "./watchDf";
import { getComPath } from "./utils/getComPath";

const conn = new ssh2.Client();

/**
 * 开始服务
 */
export function start(config: IConfig) {
    conn.on('ready', () => {
        console.log(chalk.blue('连接成功...'));
        conn.sftp(async (err, sftp) => {
            if (err) {
                console.log(chalk.red('启动sftp失败'), err);
                return;
            }
            //查看是否监听
            if (config.watch) {
                for (let { title, local, remote } of config.syncList) {
                    console.log(chalk.yellow(`开始监听@${title}${local}-->${remote}\n`));
                    await watchDf(sftp, getAbsolute(local), getComPath(remote));
                }
            }
            //直接上传
            else {
                for (let { title, local, remote } of config.syncList) {
                    console.log(chalk.yellow(`开始同步@${title}${local}-->${remote}\n`));
                    await syncDF(sftp, getAbsolute(local), getComPath(remote));
                }
                //关闭连接
                console.log(chalk.blue('\n同步完成'));
                conn.end();
            }
        });
    }).connect({
        host: config.host,
        port: config.port,
        username: config.username,
        privateKey: config.privateKey,
        passphrase: config.passphrase,
    });
}