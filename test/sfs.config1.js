/**
 * 配置文件
 * 详细配置项见说明，或者直接看类型声明
 */
let getConfig;
try {
  getConfig = require('server-file-sync').getConfig;
} catch {
  getConfig = (_) => _();
}

module.exports = getConfig(() => {
  console.log('获取配置sfs.config1.js');
  /**
   * 返回配置信息
   * TODO 可以是Promise
   */
  return {
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
  };
});
