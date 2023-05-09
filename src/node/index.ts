import { ObjectUtils } from 'yayaluoya-tool/dist/obj/ObjectUtils';
import { TConfig } from '../config/IConfig';
import { start } from '../index';
import { defaultConfig as defaultConfig_ } from '../config/getConfig';

/**
 * 获取配置
 * 主要是为外界提供ts的能力
 * @returns
 * @param f
 */
export function getConfig(f: () => TConfig | Promise<TConfig>) {
    return f();
}

/**
 * 开始同步
 * TODO 配置信息中有多少就传多少
 * TODO 注意配置中的地址要为绝对地址哦
 * @param config
 * @param keys
 * @param demo
 */
export async function startSync(
    config: TConfig | Promise<TConfig>,
    keys?: string | string[],
    demo = false,
) {
    /** 一个克隆的默认配置 */
    const defaultConfig = ObjectUtils.clone2(await defaultConfig_);
    //
    start(ObjectUtils.merge(defaultConfig, await config), keys, demo);
}
