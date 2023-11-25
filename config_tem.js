/** @type {()=>import('server-file-sync/dist/config/TConfig').TConfig} */
module.exports = async function () {
  /**
   * 返回配置信息
   */
  return {
    host: '',
    port: 22,
    username: 'root',
    passphrase: '',
    privateKey: '',
    syncList: [],
    connectConfig: {},
    watch: false,
  };
};
