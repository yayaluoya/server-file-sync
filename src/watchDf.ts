import { SFTPWrapper } from "ssh2";
import chokidar from "chokidar";
import path from "path";
import chalk from "chalk";
import { getComPath } from "./utils/getComPath";
import moment from "moment";
import { Manager } from "./Manager";
import { type Matcher } from 'anymatch';

/**
 * 同步目录和文件
 * @param key 唯一键值
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 * @param op 选项
 */
export async function watchDf(key: string, localDir: string, remoteDir: string, op: {
    /** 忽略配置 */
    ignored: Matcher;
}) {
    chokidar.watch(localDir, {
        ignored: op.ignored || [],
    }).on('all', async (event, _path) => {
        if (event == 'add' || event == 'change') {
            let relativePath = path.relative(localDir, _path);
            //转成通用平台的路径分隔符
            let onRemotePath = path.join(remoteDir, relativePath);
            //创建目录
            await mkDir(Manager.sftp, remoteDir, path.dirname(relativePath));
            //同步
            Manager.sftp.fastPut(_path, getComPath(onRemotePath), (err) => {
                if (err) {
                    console.log(chalk.red('同步失败!', _path, onRemotePath));
                    return;
                }
                //触发更新回调
                Manager.mainConfig.updateF?.(Manager.conn, key);
                //
                console.log(chalk.gray('同步成功'), _path, chalk.gray('->'), chalk.green(getComPath(onRemotePath)), chalk.gray(moment().format('HH:mm:ss')));
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