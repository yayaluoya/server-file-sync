import { ArrayUtils } from '../yayaluoya-tool/ArrayUtils';
import { Manager } from './Manager';
import chalk from 'chalk';
import { syncDF } from './syncDF';
import { getAbsolute } from './utils/getAbsolute';
import { watchDf } from './watchDf';
import { getComPath } from './utils/getComPath';
import child_process from 'child_process';
import path from 'path';
import { TConfig } from './config/TConfig';
import { getConnectConfig } from './config';
import { Client, SFTPWrapper } from 'ssh2';

/**
 * 开始
 */
export function start(config: TConfig, keys?: string | string[], demo = false) {
  //TODO 防😳
  config.syncList = ArrayUtils.arraify(config.syncList || []);
  config.syncList.forEach((_) => {
    _.paths = ArrayUtils.arraify(_.paths);
  });
  config.syncList = config.syncList.filter((_) => _.paths.length > 0);

  // 数组化
  keys = ArrayUtils.arraify(keys).filter(Boolean);

  //对config中的列表做判断
  if (keys && keys.length > 0) {
    config.syncList = config.syncList.filter((_) => {
      return keys.includes(_.key);
    });
  }
  if (config.syncList.length <= 0) {
    console.log(
      chalk.red(
        '没有需要同步的内容，请在配置syncList中添加需要同步的列表，或者指定正确的 --keys 参数',
      ),
    );
    return;
  }

  console.log(chalk.bold(chalk.green('当前需要同步的项目列表:')));
  config.syncList.forEach(({ key, title, paths }, index) => {
    console.log(`  ${index + 1}.`, chalk.yellow(`${title} [${key}]`));
    for (let path of paths) {
      console.log(
        '    -',
        chalk.gray(`${path.local}`, chalk.gray('->'), chalk.blue(`${path.remote}`)),
      );
    }
  });

  //如果是演示的话需要再次确定
  if (demo) {
    new Promise<'y' | 'd' | ''>((r, e) => {
      let childPro = child_process.fork(path.join(__dirname, 'demoConfirm'));
      childPro.on('message', (msg) => {
        r(msg.toString() as any);
        childPro.kill();
      });
      childPro.on('exit', () => {
        r('');
      });
      childPro.on('error', e);
    })
      .then((select) => {
        switch (select) {
          case 'y':
            upload(config);
            break;
          case 'd':
            upload(config, true);
            break;
        }
      })
      .catch((error) => {
        console.log(chalk.red('出错了'), error);
      });
    return;
  } else {
    upload(config);
  }
}

/**
 * 上传
 * @param config 配置信息
 * @param _false 是否假传
 */
export async function upload(config: TConfig, _false = false) {
  Manager.start(config, _false);
  //
  await Manager.beforeF();
  //查看是否监听
  if (config.watch) {
    let watchs: {
      key: string;
      title: string;
      paths: getArrayT<TConfig['syncList']>['paths'];
      conn: Client;
      sftp: SFTPWrapper;
    }[] = [];
    for (let { key, title, paths, ...connectConfig } of config.syncList) {
      await Manager.execItemF(key, 'beforeF');
      watchs.push({
        key,
        title,
        paths,
        ...(await Manager.getSftp(`${title} [${key}]`, getConnectConfig(connectConfig))),
      });
      for (let { local, remote, ignored } of paths) {
        console.log(
          chalk.hex('#fddb3a')(
            `开始监听 -> ${title} [${key}]: ${getAbsolute(local)} -> ${getComPath(
              remote,
            )}`,
          ),
        );
      }
    }
    watchs.forEach(({ conn, sftp, key, title, paths }) => {
      for (let { local, remote, ignored } of paths) {
        watchDf(
          key,
          getAbsolute(local),
          getComPath(remote),
          {
            ignored,
          },
          sftp,
        );
      }
    });
  }
  //直接上传
  else {
    for (let { key, title, paths, ...connectConfig } of config.syncList) {
      await Manager.execItemF(key, 'beforeF');
      await Manager.getSftp(`${title} [${key}]`, getConnectConfig(connectConfig)).then(
        async ({ conn, sftp }) => {
          for (let { local, remote, ignored } of paths) {
            console.log(
              chalk.bold(
                chalk.hex('#fddb3a')(
                  `开始同步 -> ${title} [${key}]: ${getAbsolute(local)} -> ${getComPath(
                    remote,
                  )}`,
                ),
              ),
            );
            //同步
            await syncDF(getAbsolute(local), getComPath(remote), sftp, ignored);
          }
          //关闭连接
          conn.end();
          //
          await Manager.execItemF(key, 'laterF');
        },
      );
    }
    //
    await Manager.laterF();
    //
    console.log(chalk.bold(chalk.hex('#81b214')('同步完成')));
  }
}
