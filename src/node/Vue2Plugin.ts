import { startSync } from ".";
import { TConfig } from "../config/IConfig";

/**
 * vue2上传插件
 */
export class Vue2Plugin {
    constructor(
        private config: TConfig,
        private keys?: string[],
        private demo = false
    ) { }

    apply(compiler: any) {
        // 编译完成后的回调
        compiler.plugin('done', () => {
            startSync(this.config, this.keys, this.demo);
        });
    }
}