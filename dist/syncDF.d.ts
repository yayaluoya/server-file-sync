import { type Matcher } from "anymatch";
import { SFTPWrapper } from "ssh2";
/**
 * 同步目录和文件
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 */
export declare function syncDF(localDir: string, remoteDir: string, sftp: SFTPWrapper, ignored?: Matcher): Promise<void>;
//# sourceMappingURL=syncDF.d.ts.map