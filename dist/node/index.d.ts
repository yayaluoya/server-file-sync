import { TConfig } from "../config/IConfig";
/**
 * 获取配置
 * 主要是为外界提供ts的能力
 * @param c
 * @returns
 */
export declare function getConfig(c: TConfig): TConfig | Promise<TConfig>;
/**
 * 上传
 * TODO 配置信息中有多少就传多少
 * @param config
 */
export declare function upload(config: TConfig): Promise<void>;
//# sourceMappingURL=index.d.ts.map