import chokidar from 'chokidar';
import path from 'path';
import { getComPath } from './utils/getComPath';
import { Manager } from './Manager';
import { type Matcher } from 'anymatch';
import { SFTPWrapper } from 'ssh2';

/**
 * 监听目录和文件，并同步
 * @param key 唯一键值
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 * @param op 选项
 * @param sftp
 */
export async function watchDf(
  key: string,
  localDir: string,
  remoteDir: string,
  op: {
    /** 忽略配置 */
    ignored: Matcher;
  },
  sftp: SFTPWrapper,
) {
  chokidar
    .watch(localDir, {
      ignored: op.ignored || [],
    })
    .on('all', async (event, _path) => {
      if (event == 'add' || event == 'change') {
        let relativePath = path.relative(localDir, _path);
        //转成通用平台的路径分隔符
        let onRemotePath = path.join(remoteDir, relativePath);
        //创建目录
        await mkDir(remoteDir, path.dirname(relativePath), sftp);
        //同步
        Manager.fastPut(_path, getComPath(onRemotePath), sftp).then(() => {
          Manager.execItemF(key, 'laterF');
        });
      }
    });
}

/**
 * 创建目录
 * @param rootPath 相对目录
 * @param _path
 * @param sftp
 */
async function mkDir(rootPath: string, _path: string, sftp: SFTPWrapper) {
  let _paths = getComPath(_path).split('/');
  for (let i = 0, len = _paths.length; i < len; i++) {
    let dir = path.join(rootPath, ..._paths.slice(0, i + 1));
    //
    if (getComPath(dir) == getComPath(rootPath)) {
      continue;
    }
    //
    await Manager.mkdir(getComPath(dir), sftp);
  }
}
