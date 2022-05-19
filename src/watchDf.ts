import { SFTPWrapper } from "ssh2";
import chokidar from "chokidar";
import path from "path";
import chalk from "chalk";
import { getComPath } from "./utils/getComPath";
import moment from "moment";

/**
 * 同步目录和文件
 * @param sftp 操作句柄
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 */
export async function watchDf(sftp: SFTPWrapper, localDir: string, remoteDir: string) {
    chokidar.watch(localDir).on('all', async (event, _path) => {
        if (event == 'add' || event == 'change') {
            let relativePath = path.relative(localDir, _path);
            //转成通用平台的路径分隔符
            let onRemotePath = path.join(remoteDir, relativePath);
            //创建目录
            await mkDir(sftp, remoteDir, path.dirname(relativePath));
            //同步
            sftp.fastPut(_path, getComPath(onRemotePath), (err) => {
                if (err) {
                    console.log(chalk.red('同步失败!', _path, onRemotePath));
                    return;
                }
                console.log(chalk.gray('同步'), _path, chalk.gray('-->'), chalk.green(onRemotePath), chalk.gray(moment().format('HH:mm:ss')));
            });
        }
    });
}

/**
 * 创建目录
 * @param rootPath 相对目录
 * @param _path 
 */
async function mkDir(sftp: SFTPWrapper, rootPath: string, _path: string) {
    let _paths = getComPath(_path).split('/');
    for (let i = 0, len = _paths.length; i < len; i++) {
        let dir = path.join(rootPath, ..._paths.slice(0, i + 1));
        //如果就是相对目录的话就跳过
        if (getComPath(dir) == getComPath(rootPath)) {
            continue;
        }
        //
        await new Promise<void>((r) => {
            sftp.mkdir(getComPath(dir), () => {
                r();
            });
        });
    }
}