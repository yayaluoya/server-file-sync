import { Client, ConnectConfig, SFTPWrapper } from "ssh2";
import { type Matcher } from 'anymatch';
import ssh2 from "ssh2";
import chalk from "chalk";
import { getComPath } from "./utils/getComPath";
import moment from "moment";

/**
 * 配置文件类型
 */
export interface IConfig {
    /** 配置名字 */
    name: string;
    /** 主机地址 */
    host?: string,
    /** 端口号 */
    port?: number,
    /** 用户名 */
    username?: string,
    /** 私钥密码 */
    passphrase?: string;
    /** 私钥字符串 */
    privateKey?: string;
    /** 同步列表 */
    syncList: {
        /** key */
        key: string;
        /** 标题 */
        title: string;
        /** 路径列表 */
        paths: {
            /** 本地地址 */
            local: string;
            /** 远程地址 */
            remote: string;
            /** 文件忽略，请注意不支持 Windows 样式的反斜杠作为分隔符*/
            ignored?: Matcher;
        }[],
    }[];
    /** ssh2的连接配置 */
    connectConfig?: ConnectConfig,
    /** 是否监听 */
    watch: boolean;
    /** 更新回调 */
    updateF?: (op: {
        connF: () => Promise<Client>;
        sftp: SFTPWrapper;
    }, key: string) => Promise<any>;
}

/**
 * 管理器
 */
export class Manager {
    /** 主配置文件 */
    static mainConfig: IConfig;
    /** sftp句柄 */
    static sftp: SFTPWrapper;
    /** 是否是假连接，如果是的话就不会真传文件 */
    private static _false: boolean;

    /** 
     * 连接服务器
     */
    static connect(config: IConfig, _false = false) {
        this._false = _false;
        this.mainConfig = config;
        //
        return this.getConn().then((conn) => {
            return new Promise<{
                conn: Client;
                sftp: SFTPWrapper;
            }>((r, e) => {
                //建立sftp连接
                conn.sftp((err, sftp) => {
                    this.sftp = sftp;
                    if (err) {
                        console.log(chalk.red('sftp连接失败!'), err);
                        e();
                        return;
                    }
                    r({
                        conn,
                        sftp,
                    });
                });
            })
        });
    }

    /**
     * 获取一个连接实例
     * @returns 
     */
    static getConn(alert = '') {
        return new Promise<Client>((r) => {
            const conn = new ssh2.Client();
            //连接
            conn.on('ready', () => {
                console.log(chalk.blue(`\n服务器连接成功${alert ? '@' + alert : ''}\n`));
                r(conn);
            }).connect({
                host: this.mainConfig.host,
                port: this.mainConfig.port,
                username: this.mainConfig.username,
                privateKey: this.mainConfig.privateKey,
                passphrase: this.mainConfig.passphrase,
                ...this.mainConfig.connectConfig,
            });
        })
    }

    /** 
     * 更新回调
     */
    static async updateF(key: string) {
        await (this._false || this.mainConfig.updateF?.({
            connF: () => {
                return this.getConn('更新回调');
            },
            sftp: this.sftp,
        }, key).catch((e) => {
            console.log(chalk.red('执行更新回调出错:'), e);
        }));
    }

    /**
     * 同步文件
     */
    static fastPut(_path: string, _remotePath: string) {
        return new Promise<void>((r, e) => {
            //假连接就不传
            if (this._false) {
                console.log(chalk.magenta('同步演示'), _path, chalk.gray('->'), chalk.green(getComPath(_remotePath)), chalk.gray(moment().format('HH:mm:ss')));
                r();
                return;
            }
            //同步
            this.sftp.fastPut(_path, _remotePath, async (err) => {
                if (err) {
                    console.log(chalk.red('同步失败!', _path, _remotePath), err);
                    e(err);
                    return;
                }
                console.log(chalk.gray('同步成功'), _path, chalk.gray('->'), chalk.green(getComPath(_remotePath)), chalk.gray(moment().format('HH:mm:ss')));
                r();
            });
        })
    }

    /** 
     * 创建目录
     * 不管成功失败，都返回的成功解决的promise
     */
    static mkdir(dir: string) {
        return new Promise<void>((r, e) => {
            //假连接不做操作
            if (this._false) {
                r();
                return;
            }
            this.sftp.mkdir(dir, (err) => {
                r();
            });
        })
    }
}