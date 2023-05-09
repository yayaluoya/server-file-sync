import fs from 'fs';
import path from 'path';
import { Manager } from './Manager';
import { getComPath } from './utils/getComPath';
import anymatch, { type Matcher } from 'anymatch';
import { SFTPWrapper } from 'ssh2';

/**
 * 同步目录和文件
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 * @param sftp
 * @param ignored
 */
export async function syncDF(
    localDir: string,
    remoteDir: string,
    sftp: SFTPWrapper,
    ignored?: Matcher,
) {
    //忽略
    if (ignored && anymatch(ignored, getComPath(localDir))) {
        return;
    }
    let stat = fs.statSync(localDir, {
        throwIfNoEntry: false,
    });
    if (stat?.isFile()) {
        //创建目录
        await Manager.mkdir(getComPath(remoteDir.replace(/[^/]+$/, '')), sftp);
        //
        await Manager.fastPut(localDir, getComPath(remoteDir), sftp);
    } else if (stat?.isDirectory()) {
        //创建目录
        await Manager.mkdir(getComPath(remoteDir), sftp);
        //
        await Promise.all(
            fs.readdirSync(localDir).map((o) => {
                return syncDF(
                    path.join(localDir, o),
                    path.join(remoteDir, o),
                    sftp,
                    ignored,
                );
            }),
        );
    }
}
