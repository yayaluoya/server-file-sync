import { Manager, IConfig } from "./Manager";
import ssh2, { SFTPWrapper } from "ssh2";
import chalk from "chalk";
import { syncDF } from "./syncDF";
import { getAbsolute } from "./utils/getAbsolute";
import { watchDf } from "./watchDf";
import { getComPath } from "./utils/getComPath";

const conn = new ssh2.Client();

Manager.conn = conn;

/**
 * 开始服务
 */
export function start(config: IConfig) {
    Manager.mainConfig = config;
    //连接
    conn.on('ready', () => {
        console.log(chalk.red('连接成功...\n'));
        conn.sftp(async (err, sftp) => {
            Manager.sftp = sftp;
            if (err) {
                console.log(chalk.red('启动sftp失败'), err);
                return;
            }
            //查看是否监听
            if (config.watch) {
                for (let { key, title, local, remote } of config.syncList) {
                    console.log(chalk.yellow(`开始监听${title}: ${getAbsolute(local)} -> ${getComPath(remote)}\n`));
                    await watchDf(key, getAbsolute(local), getComPath(remote));
                }
            }
            //直接上传
            else {
                for (let { key, title, local, remote } of config.syncList) {
                    console.log(chalk.yellow(`开始同步${title}: ${getAbsolute(local)} -> ${getComPath(remote)}\n`));
                    //同步
                    await syncDF(getAbsolute(local), getComPath(remote));
                    //触发更新回调
                    await Manager.mainConfig.updateF?.(Manager.conn, key);
                }
                //关闭连接
                console.log(chalk.red('\n同步完成'));
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