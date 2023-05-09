import { Client, SFTPWrapper } from 'ssh2';
import ssh2 from 'ssh2';
import chalk from 'chalk';
import { getComPath } from './utils/getComPath';
import moment from 'moment';
import fs from 'fs';
import { getConnectConfig, TConfig, TConnectConfig } from './config/IConfig';
import inquirer from 'inquirer';

/** 密钥密码映射 */
const privateKey_passphrase_map = new Map<string, string>();

/**
 * 管理器
 */
export class Manager {
    static start_ = false;
    /** 主配置文件 */
    static mainConfig: TConfig;
    /** 是否是假连接，如果是的话就不会真传文件 */
    private static _false: boolean;

    /**
     * 开始
     */
    static start(config: TConfig, _false = false): typeof Manager {
        if (this.start_) {
            return;
        }
        this.start_ = true;
        this._false = _false;
        this.mainConfig = config;
        return this;
    }

    /**
     * 通过key获取配置
     * @param key
     */
    static byKeyGetConfig(key: string) {
        return this.mainConfig.syncList.find((_) => {
            return _.key == key;
        });
    }

    /**
     * 执行某一个同步项的某一个回调
     * @param key
     * @param fKey
     */
    static execItemF(
        key: string,
        fKey: Extract<keyof getArrayT<TConfig['syncList']>, 'beforeF' | 'laterF'>,
    ) {
        let onItem = this.byKeyGetConfig(key);
        if (onItem) {
            return Promise.resolve(
                (onItem[fKey] as (connF: () => Promise<Client>) => Promise<void>)?.call(
                    onItem,
                    () => {
                        return this.getConn(fKey, getConnectConfig(onItem));
                    },
                ),
            );
        }
    }

    /**
     * 获取一个连接实例
     * @param title
     * @param connectConfig
     * @returns
     */
    static getConn(title = '', connectConfig?: TConnectConfig) {
        return new Promise<Client>(async (r) => {
            const conn = new ssh2.Client();
            //连接
            let op = {
                ...this.mainConfig.connectConfig,
                ...getConnectConfig(this.mainConfig),
                ...connectConfig,
            };
            // 如果有密钥却没有输入密钥密码的话就提示输入一次
            if (op.privateKey && !op.passphrase) {
                //先从映射中找密钥密码
                op.passphrase = privateKey_passphrase_map.get(op.privateKey.toString());
                if (!op.passphrase) {
                    op.passphrase = await inquirer
                        .prompt([
                            {
                                type: 'password', // 交互类型 -- 密码
                                message: `请输入${title ? ` ${title} 的` : ''}密钥密码:`, // 引导词
                                name: 'passphrase', // 自定义的字段名
                                mask: '*',
                            },
                        ])
                        .then(({ passphrase }) => {
                            return passphrase as string;
                        });
                    //
                    privateKey_passphrase_map.set(
                        op.privateKey.toString(),
                        op.passphrase,
                    );
                }
            }
            let errF = (err) => {
                console.log(chalk.red('服务器连接错误:\n'), err);
                console.log(chalk.red('错误配置:'));
                console.dir(op, { depth: null });
            };
            try {
                conn.connect(op)
                    .on('ready', () => {
                        title &&
                            console.log(
                                chalk.greenBright(
                                    `\n服务器连接成功${title ? ':' + title : ''}\n`,
                                ),
                            );
                        r(conn);
                    })
                    .on('error', errF);
            } catch (err) {
                errF(err);
            }
        });
    }

    /**
     * 获取一个sftp实例
     * @param title
     * @param connectConfig
     */
    static getSftp(title = '', connectConfig?: TConnectConfig) {
        return this.getConn(title, connectConfig).then((conn) => {
            return new Promise<{
                conn: Client;
                sftp: SFTPWrapper;
            }>((r, e) => {
                //建立sftp连接
                conn.sftp((err, sftp) => {
                    if (err) {
                        title &&
                            console.log(
                                chalk.red(`sftp连接失败!${title ? ':' + title : ''}\n`),
                                err,
                            );
                        e();
                        return;
                    }
                    r({
                        conn,
                        sftp,
                    });
                });
            });
        });
    }

    /**
     * 同步之前的回调
     */
    static async beforeF() {
        await (this._false ||
            Promise.resolve(
                this.mainConfig.beforeF?.((op) => {
                    return this.getConn('beforeF', op);
                }),
            ).catch((e) => {
                console.log(chalk.red('执行beforeF出错:'), e);
            }));
    }
    /**
     * 完成的回调
     */
    static async laterF() {
        await (this._false ||
            Promise.resolve(
                this.mainConfig.laterF?.((op) => {
                    return this.getConn('laterF', op);
                }),
            ).catch((e) => {
                console.log(chalk.red('执行laterF出错:'), e);
            }));
    }

    /**
     * 同步文件
     */
    static fastPut(_path: string, _remotePath: string, sftp: SFTPWrapper) {
        return new Promise<void>((r, e) => {
            //假连接就不传
            if (this._false) {
                let fileState = fs.statSync(_path);
                console.log(
                    chalk.gray('同步演示'),
                    _path,
                    fileState.size / 1000 + 'KB',
                    chalk.gray('->'),
                    chalk.green(getComPath(_remotePath)),
                    chalk.gray(moment().format('HH:mm:ss')),
                );
                r();
                return;
            }
            //同步
            sftp.fastPut(_path, _remotePath, async (err) => {
                if (err) {
                    console.log(chalk.red('同步失败!', _path, _remotePath), err);
                    e(err);
                    return;
                }
                console.log(
                    chalk.gray('同步成功'),
                    _path,
                    chalk.gray('->'),
                    chalk.blue(getComPath(_remotePath)),
                    chalk.gray(moment().format('HH:mm:ss')),
                );
                r();
            });
        });
    }

    /**
     * 创建目录，会递归创建完整的目录
     * 不管成功失败，都返回的成功解决的promise
     */
    static mkdir(dir: string, sftp: SFTPWrapper) {
        return new Promise<void>((r, e) => {
            //假连接不做操作
            if (this._false) {
                r();
                return;
            }
            // 递归创建目录
            let f = (targetDirs: string[], upDirs: string[]) => {
                if (targetDirs.length <= 0) {
                    r();
                    return;
                }
                let onDirs = [...upDirs, targetDirs.shift() + '/'];
                let targetDir = onDirs.join('');
                sftp.stat(targetDir, (err, stat) => {
                    if (!err && stat.isDirectory()) {
                        f(targetDirs, onDirs);
                    } else {
                        sftp.mkdir(targetDir, (err) => {
                            f(targetDirs, onDirs);
                        });
                    }
                });
            };
            f(dir.replace(/\//g, '/').split('/').filter(Boolean), ['/']);
        });
    }
}
