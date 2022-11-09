"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectConfig = void 0;
/**
 * 从一个对象中提取ssh2的连接配置
 * @param obj
 * @returns
 */
function getConnectConfig(obj) {
    var o = {};
    obj.host && (o.host = obj.host);
    obj.port && (o.port = obj.port);
    obj.username && (o.username = obj.username);
    obj.passphrase && (o.passphrase = obj.passphrase);
    obj.privateKey && (o.privateKey = obj.privateKey);
    return o;
}
exports.getConnectConfig = getConnectConfig;
//# sourceMappingURL=IConfig.js.map