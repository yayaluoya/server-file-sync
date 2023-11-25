import { startSync } from '.';
import { TConfig } from '../config/TConfig';

/**
 * vue2上传插件
 */
export class Vue2Plugin {
  constructor(
    private config: TConfig | Promise<TConfig>,
    private keys: string | string[],
    private demo = false,
  ) {}

  apply(compiler: any) {
    // 编译完成后的回调
    compiler.plugin('done', () => {
      if (this.keys.length <= 0) {
        return;
      }
      startSync(this.config, this.keys, this.demo);
    });
  }
}
