import { ObjectUtils } from '../../yayaluoya-tool/obj/ObjectUtils';
import { getDefConfig } from '../config';
import { TConfig } from '../config/TConfig';
import { start } from '../index';

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
  start(ObjectUtils.merge(getDefConfig(), await config), keys, demo);
}
