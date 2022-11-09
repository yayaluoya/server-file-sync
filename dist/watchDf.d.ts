import { type Matcher } from 'anymatch';
import { SFTPWrapper } from "ssh2";
/**
 * 同步目录和文件
 * @param key 唯一键值
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 * @param op 选项
 */
export declare function watchDf(key: string, localDir: string, remoteDir: string, op: {
    /** 忽略配置 */
    ignored: Matcher;
}, sftp: SFTPWrapper): Promise<void>;
//# sourceMappingURL=watchDf.d.ts.map