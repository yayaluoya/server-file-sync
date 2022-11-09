import { Manager } from "./Manager";
import chalk from "chalk";
import { syncDF } from "./syncDF";
import { getAbsolute } from "./utils/getAbsolute";
import { watchDf } from "./watchDf";
import { getComPath } from "./utils/getComPath";
import { ArrayUtils } from "yayaluoya-tool/dist/ArrayUtils";
import { getConnectConfig, TConfig } from "./config/IConfig";
import { cmdSecondCom } from "yayaluoya-tool/dist/node/cmdSecondCom";

/**
 * 开始
 */
export function start(config: TConfig, keys?: string[], demo = false) {
    //TODO 防😳
    config.syncList = ArrayUtils.arraify(config.syncList || []);
    config.syncList.forEach(_ => {
        _.paths = ArrayUtils.arraify(_.paths);
    });

    //对config中的列表做判断
    if (keys && keys.length > 0) {
        config.syncList = config.syncList.filter((_) => {
            return keys.includes(_.key);
        });
    }
    if (config.syncList.length <= 0) {
        console.log(chalk.red('没有需要同步的内容，请在配置syncList中添加需要同步的列表，或者 -s 的参数没传对'));
        return;
    }

    console.log('需要同步的列表:');
    console.dir(config.syncList.map(_ => {
        let { key, title, paths } = _;
        return {
            key,
            title,
            pathLenth: paths.length,
        };
    }), {
        depth: null,
    });

    //如果是演示的话需要再次确定
    if (demo) {
        for (let { key, title, paths } of config.syncList) {
            for (let { local, remote } of paths) {
                console.log(chalk.yellow(`同步演示->${title}@${key}: ${getAbsolute(local)} -> ${getComPath(remote)}`));
            }
        }
        cmdSecondCom('上传:y/Y,演示:d/D 输入其它字符取消: ').then((name) => {
            switch (true) {
                /** 上传 */
                case /^y$/i.test(name):
                    upload(config);
                    break;
                /** 演示 */
                case /^d$/i.test(name):
                    upload(config, true);
            }
        });
        return;
    }
    if (!config.privateKey) {
        console.log('⚠️ ', chalk.yellow('建议通过配置ssh私钥的方式来连接服务器!'));
        console.log(chalk.gray('配置ssh的方法：'));
        console.log(chalk.gray('1.命令行执行 ssh-keygen -f <文件名> 然后按照提示输入<密码>，完成后会在当前执行目录生成两个文件，不带.pub的是<私钥>，带.pub的是<公钥>'));
        console.log(chalk.gray('2.把<公钥>中的内容追加到服务器的/root/.ssh/authorized_keys文件中'));
        console.log(chalk.gray('3.把<密码>和<私钥>的内容分别添加到配置文件的字段passphrase和privateKey中就行了'));
        console.log(chalk.red('注意：私钥不要加到项目的版本控制系统中，防止泄露'));
    }
    //
    upload(config);
}

/**
 * 上传
 * @param config 配置信息
 * @param _false 是否假传
 */
export async function upload(config: TConfig, _false = false) {
    Manager.start(config, _false);
    //查看是否监听
    if (config.watch) {
        for (let { key, title, paths, ...connectConfig } of config.syncList) {
            Manager.getSftp(undefined, getConnectConfig(connectConfig)).then(async ({
                conn,
                sftp,
            }) => {
                for (let { local, remote, ignored } of paths) {
                    console.log(chalk.hex('#fddb3a')(`监听->${title}@${key}: ${getAbsolute(local)} --> ${getComPath(remote)}`));
                    console.log(chalk.gray('---->'));
                    watchDf(key, getAbsolute(local), getComPath(remote), {
                        ignored,
                    }, sftp);
                }
            });
        }
    }
    //直接上传
    else {
        let allP = [];
        for (let { key, title, paths, ...connectConfig } of config.syncList) {
            allP.push(
                Manager.getSftp(undefined, getConnectConfig(connectConfig)).then(async ({
                    conn,
                    sftp,
                }) => {
                    for (let { local, remote, ignored } of paths) {
                        console.log(chalk.hex('#fddb3a')(`同步->${title}@${key}: ${getAbsolute(local)} --> ${getComPath(remote)}`));
                        console.log(chalk.gray('---->'));
                        //同步
                        await syncDF(getAbsolute(local), getComPath(remote), sftp, ignored);
                    }
                    //触发更新回调
                    await Manager.updateF(key);
                    //关闭连接
                    conn.end();
                })
            );
        }
        await Promise.all(allP);
        //
        console.log(chalk.hex('#81b214')('\n同步完成'));
    }
}