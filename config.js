/**
 * server-file-sync 的默认配置文件
 */
module.exports = {
    /** 配置名字 */
    name: '默认配置',
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
    /** 是否监听 */
    watch: false,
}

// /** 同步列表 */
// syncList: {
//     /** key */
//     key: string;
//     /** 标题 */
//     title: string;
//     /** 本地地址 */
//     local: string;
//     /** 远程地址 */
//     remote: string;
// }[];