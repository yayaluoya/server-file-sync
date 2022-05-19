import { IConfig } from "./config";
import ssh2, { SFTPWrapper } from "ssh2";
import fs from "fs";
import path from "path";
import chalk from "chalk";

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
            //
            for (let { title, local, remote } of config.syncList) {
                console.log(chalk.yellow(`开始同步@${title}${local}-->${remote}\n`));
                await syncDF(sftp, local, remote);
            }
            //关闭连接
            console.log(chalk.blue('\n同步完成'));
            conn.end();
        });
    }).connect({
        host: config.host,
        port: config.port,
        username: config.username,
        privateKey: config.privateKey,
        passphrase: config.passphrase,
    });
}



/**
 * 同步目录和文件
 * @param sftp 操作句柄
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 * @param _f 是否强制同步
 */
async function syncDF(sftp: SFTPWrapper, localDir: string, remoteDir: string, _f = false) {
    let stat = fs.statSync(localDir);
    if (stat.isFile()) {
        await new Promise<void>((r, e) => {
            //转成目标平台的路径分隔符
            remoteDir = remoteDir.replace(/\\/g, '/');
            //上传
            sftp.fastPut(localDir, remoteDir, (err) => {
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
            sftp.mkdir(remoteDir.replace(/\\/g, '/'), () => {
                r();
            });
        });
        //
        await Promise.all(fs.readdirSync(localDir).map((o) => {
            return syncDF(sftp, path.join(localDir, o), path.join(remoteDir, o));
        }));
    }
}