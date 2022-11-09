import { TConfig } from "../config/IConfig";
/**
 * vue2上传插件
 */
export declare class Vue2Plugin {
    private config;
    private keys?;
    private demo;
    constructor(config: TConfig, keys?: string[], demo?: boolean);
    apply(compiler: any): void;
}
//# sourceMappingURL=Vue2Plugin.d.ts.map