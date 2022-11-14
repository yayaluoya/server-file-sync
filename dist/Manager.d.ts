import { Client, SFTPWrapper } from "ssh2";
import { TConfig, TConnectConfig } from "./config/IConfig";
/**
 * 管理器
 */
export declare class Manager {
    static start_: boolean;
    /** 主配置文件 */
    static mainConfig: TConfig;
    /** 是否是假连接，如果是的话就不会真传文件 */
    private static _false;
    /**
     * 开始
     */
    static start(config: TConfig, _false?: boolean): typeof Manager;
    /**
     * 获取一个连接实例
     * @param title
     * @param connectConfig
     * @returns
     */
    static getConn(title?: string, connectConfig?: TConnectConfig): Promise<Client>;
    /**
     * 获取一个sftp实例
     * @param title
     * @param connectConfig
     */
    static getSftp(title?: string, connectConfig?: TConnectConfig): Promise<{
        conn: Client;
        sftp: SFTPWrapper;
    }>;
    /**
     * 同步之前的回调
     */
    static beforeF(key: string): Promise<void>;
    /**
     * 更新回调
     */
    static updateF(key: string): Promise<void>;
    /**
     * 同步文件
     */
    static fastPut(_path: string, _remotePath: string, sftp: SFTPWrapper): Promise<void>;
    /**
     * 创建目录
     * 不管成功失败，都返回的成功解决的promise
     */
    static mkdir(dir: string, sftp: SFTPWrapper): Promise<void>;
}
//# sourceMappingURL=Manager.d.ts.map