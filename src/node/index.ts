import { ObjectUtils } from "yayaluoya-tool/dist/obj/ObjectUtils";
import { TConfig } from "../config/IConfig";
import { upload as upload_ } from "../index";
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
 * 上传
 * TODO 配置信息中有多少就传多少
 * @param config 
 */
export async function upload(config: TConfig) {
    /** 一个克隆的默认配置 */
    const defaultConfig = ObjectUtils.clone2(await defaultConfig_);
    //
    upload_(ObjectUtils.merge(defaultConfig, config));
}