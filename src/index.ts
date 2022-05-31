import { Manager, IConfig } from "./Manager";
import ssh2 from "ssh2";
import chalk from "chalk";
import { syncDF } from "./syncDF";
import { getAbsolute } from "./utils/getAbsolute";
import { watchDf } from "./watchDf";
import { getComPath } from "./utils/getComPath";
const readline = require('readline');

/**
 * 开始服务
 */
export function start(config: IConfig, keys?: string[], demo = false) {
    //对config中的列表做判断
    if (keys && keys.length > 0) {
        config.syncList = config.syncList.filter((_) => {
            return keys.includes(_.key);
        });
    }
    if (!config.syncList || config.syncList.length == 0) {
        console.log(chalk.red('没有需要同步的内容，请在配置syncList中添加需要同步的列表'));
        return;
    }
    //如果是演示的话需要再次确定
    if (demo) {
        for (let { key, title, local, remote } of config.syncList) {
            console.log(chalk.yellow(`同步->${title}@${key}: ${getAbsolute(local)} -> ${getComPath(remote)}\n`));
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // ask user for the anme input
        rl.question('是否开始(y/n)? ', (name) => {
            rl.close();
            /^y$/i.test(name) && start_(config);
        });
        return;
    }
    start_(config);
}

/**
 * 正式启动
 * @param config 
 */
function start_(config: IConfig) {
    const conn = new ssh2.Client();
    //
    Manager.conn = conn;
    //
    Manager.mainConfig = config;
    //连接
    conn.on('ready', () => {
        console.log(chalk.blue('\n服务器连接成功...\n'));
        conn.sftp(async (err, sftp) => {
            Manager.sftp = sftp;
            if (err) {
                console.log(chalk.red('启动sftp失败'), err);
                return;
            }
            //查看是否监听
            if (config.watch) {
                for (let { key, title, local, remote } of config.syncList) {
                    console.log(chalk.yellow(`开始监听->${title}@${key}: ${getAbsolute(local)} -> ${getComPath(remote)}\n`));
                    await watchDf(key, getAbsolute(local), getComPath(remote));
                }
            }
            //直接上传
            else {
                for (let { key, title, local, remote } of config.syncList) {
                    console.log(chalk.yellow(`开始同步->${title}@${key}: ${getAbsolute(local)} -> ${getComPath(remote)}\n`));
                    //同步
                    await syncDF(getAbsolute(local), getComPath(remote));
                    //触发更新回调
                    await Manager.mainConfig.updateF?.(Manager.conn, key);
                }
                //关闭连接
                console.log(chalk.green('\n同步完成'));
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