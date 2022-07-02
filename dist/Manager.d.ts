import { Client, ConnectConfig, SFTPWrapper } from "ssh2";
import { type Matcher } from 'anymatch';
/**
 * 配置文件类型
 */
export interface IConfig {
    /** 配置名字 */
    name: string;
    /** 主机地址 */
    host?: string;
    /** 端口号 */
    port?: number;
    /** 用户名 */
    username?: string;
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
        }[];
    }[];
    /** ssh2的连接配置 */
    connectConfig?: ConnectConfig;
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
export declare class Manager {
    /** 主配置文件 */
    static mainConfig: IConfig;
    /** sftp句柄 */
    static sftp: SFTPWrapper;
    /** 是否是假连接，如果是的话就不会真传文件 */
    private static _false;
    /**
     * 连接服务器
     */
    static connect(config: IConfig, _false?: boolean): Promise<{
        conn: Client;
        sftp: SFTPWrapper;
    }>;
    /**
     * 获取一个连接实例
     * @returns
     */
    static getConn(alert?: string): Promise<Client>;
    /**
     * 更新回调
     */
    static updateF(key: string): Promise<void>;
    /**
     * 同步文件
     */
    static fastPut(_path: string, _remotePath: string): Promise<void>;
    /**
     * 创建目录
     * 不管成功失败，都返回的成功解决的promise
     */
    static mkdir(dir: string): Promise<void>;
}
//# sourceMappingURL=Manager.d.ts.map