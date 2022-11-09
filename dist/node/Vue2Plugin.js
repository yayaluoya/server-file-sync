"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vue2Plugin = void 0;
var _1 = require(".");
/**
 * vue2上传插件
 */
var Vue2Plugin = /** @class */ (function () {
    function Vue2Plugin(config, keys, demo) {
        if (demo === void 0) { demo = false; }
        this.config = config;
        this.keys = keys;
        this.demo = demo;
    }
    Vue2Plugin.prototype.apply = function (compiler) {
        var _this = this;
        // 编译完成后的回调
        compiler.plugin('done', function () {
            (0, _1.startSync)(_this.config, _this.keys, _this.demo);
        });
    };
    return Vue2Plugin;
}());
exports.Vue2Plugin = Vue2Plugin;
//# sourceMappingURL=Vue2Plugin.js.map