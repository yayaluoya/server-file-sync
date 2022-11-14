import { Matcher } from "anymatch";
import { Client, ConnectConfig } from "ssh2";
/** 基础连接配置 */
export declare type TConnectConfig = Pick<ConnectConfig, 'host' | 'port' | 'username' | 'passphrase' | 'privateKey'>;
/**
 * 配置文件类型
 * TODO 关于ssh2配置信息的合并顺序是先connectConfig中的字段，再是配置文件中的字段，，再是syncList中的字段
 */
export declare type TConfig = TConnectConfig & {
    /** 同步列表 */
    syncList?: ({
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
    } & TConnectConfig)[];
    /** ssh2的连接配置 */
    connectConfig?: ConnectConfig;
    /** 是否监听 */
    watch?: boolean;
    /** 开始同步之前的回调 */
    beforeF?: (connF: (op?: TConnectConfig) => Promise<Client>, key: string) => Promise<void>;
    /** 更新回调 */
    updateF?: (connF: (op?: TConnectConfig) => Promise<Client>, key: string) => Promise<void>;
};
/**
 * 从一个对象中提取ssh2的连接配置
 * @param obj
 * @returns
 */
export declare function getConnectConfig(obj: TConnectConfig & Record<string, any>): TConnectConfig;
//# sourceMappingURL=IConfig.d.ts.map