import { Client, SFTPWrapper } from "ssh2";
import ssh2 from "ssh2";
import chalk from "chalk";
import { getComPath } from "./utils/getComPath";
import moment from "moment";
import fs from "fs";
import { getConnectConfig, TConfig, TConnectConfig } from "./config/IConfig";

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
        if (this.start_) { return; }
        this.start_ = true;
        this._false = _false;
        this.mainConfig = config;
        return this;
    }

    /**
     * 获取一个连接实例
     * @param title 
     * @param connectConfig 
     * @returns 
     */
    static getConn(title = '', connectConfig?: TConnectConfig) {
        return new Promise<Client>((r) => {
            const conn = new ssh2.Client();
            //连接
            let op = {
                ...this.mainConfig.connectConfig,
                ...getConnectConfig(this.mainConfig),
                ...connectConfig,
            };
            let errF = (err) => {
                console.log(chalk.red('服务器连接错误\n'), err);
                console.log(chalk.red('错误配置'));
                console.dir(
                    op,
                    { depth: null }
                );
            }
            try {
                conn.connect(op).on('ready', () => {
                    title && console.log(chalk.blue(`\n服务器连接成功${title ? ':' + title : ''}\n`));
                    r(conn);
                }).on('error', errF);
            } catch (err) {
                errF(err);
            }
        })
    }

    /**
     * 获取一个sftp实例
     * @param title 
     * @param connectConfig 
     */
    static getSftp(title = '', connectConfig?: TConnectConfig) {
        return this.getConn(title, connectConfig).then(conn => {
            return new Promise<{
                conn: Client;
                sftp: SFTPWrapper;
            }>((r, e) => {
                //建立sftp连接
                conn.sftp((err, sftp) => {
                    if (err) {
                        title && console.log(chalk.red(`sftp连接失败!${title ? ':' + title : ''}\n`), err);
                        e();
                        return;
                    }
                    r({
                        conn,
                        sftp,
                    });
                });
            })
        })
    }

    /** 
     * 同步之前的回调
     */
    static async beforeF(key: string) {
        await (
            this._false ||
            Promise.resolve(this.mainConfig.beforeF?.((op) => {
                return this.getConn('beforeF', op);
            }, key))
                .catch((e) => {
                    console.log(chalk.red('执行beforeF出错:'), e);
                })
        );
    }
    /** 
     * 更新回调
     */
    static async updateF(key: string) {
        await (
            this._false ||
            Promise.resolve(this.mainConfig.updateF?.((op) => {
                return this.getConn('updateF', op);
            }, key))
                .catch((e) => {
                    console.log(chalk.red('执行updateF出错:'), e);
                })
        );
    }

    /**
     * 同步文件
     */
    static fastPut(_path: string, _remotePath: string, sftp: SFTPWrapper) {
        return new Promise<void>((r, e) => {
            //假连接就不传
            if (this._false) {
                let fileState = fs.statSync(_path);
                console.log(chalk.hex('#eebb4d')('同步演示'), _path, fileState.size / 1000 + 'KB', chalk.gray('-->'), chalk.green(getComPath(_remotePath)), chalk.gray(moment().format('HH:mm:ss')));
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
                console.log(chalk.gray('同步成功'), _path, chalk.gray('-->'), chalk.green(getComPath(_remotePath)), chalk.gray(moment().format('HH:mm:ss')));
                r();
            });
        })
    }

    /** 
     * 创建目录
     * 不管成功失败，都返回的成功解决的promise
     */
    static mkdir(dir: string, sftp: SFTPWrapper) {
        return new Promise<void>((r, e) => {
            //假连接不做操作
            if (this._false) {
                r();
                return;
            }
            sftp.mkdir(dir, (err) => {
                r();
            });
        })
    }
}