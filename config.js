/**
 * 带代码提示的获取config的方法
 * module.exports = getConfig({...});
 */
// const { getConfig } = require("server-file-sync");

/**
 * server-file-sync 的默认配置文件
 */
module.exports = {
    /** 主机地址 */
    host: '',
    /** 端口号 */
    port: 22,
    /** 用户名 */
    username: 'root',
    /** 私钥密码 */
    passphrase: '',
    /** 私钥字符串 */
    privateKey: '',
    /** 同步列表 */
    syncList: [],
    /** ssh2的连接配置 */
    connectConfig: {},
    /** 是否监听 */
    watch: false,
}