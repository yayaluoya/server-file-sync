import { ObjectUtils } from "yayaluoya-tool/dist/obj/ObjectUtils";
import { TConfig } from "../config/IConfig";
import { start } from "../index";
import { defaultConfig as defaultConfig_ } from "../config/getConfig";

/**
 * 获取配置
 * 主要是为外界提供ts的能力
 * @param c 
 * @returns 
 */
export function getConfig(c: TConfig): TConfig | Promise<TConfig> {
    return c;
}

/**
 * 开始同步
 * TODO 配置信息中有多少就传多少
 * TODO 注意配置中的地址要为绝对地址哦
 * @param config 
 */
export async function startSync(config: TConfig, keys?: string[], demo = false) {
    /** 一个克隆的默认配置 */
    const defaultConfig = ObjectUtils.clone2(await defaultConfig_);
    //
    start(ObjectUtils.merge(defaultConfig, config), keys, demo);
}