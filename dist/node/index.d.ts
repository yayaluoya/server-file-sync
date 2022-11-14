import { TConfig } from "../config/IConfig";
/**
 * 获取配置
 * 主要是为外界提供ts的能力
 * @param c
 * @returns
 */
export declare function getConfig(f: () => TConfig | Promise<TConfig>): TConfig | Promise<TConfig>;
/**
 * 开始同步
 * TODO 配置信息中有多少就传多少
 * TODO 注意配置中的地址要为绝对地址哦
 * @param config
 */
export declare function startSync(config: TConfig, keys?: string[], demo?: boolean): Promise<void>;
//# sourceMappingURL=index.d.ts.map