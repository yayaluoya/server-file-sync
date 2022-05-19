const { readFileSync } = require("fs");
const { join } = require("path");

/**
 * server-file-sync 的默认配置文件
 */
module.exports = {
    name: '自定义配置',
    /** 主机地址 */
    host: '',
    /** 端口号 */
    port: 22,
    /** 用户名 */
    username: 'root',
    /** 私钥密码 */
    passphrase: 'asdf',
    /** 私钥字符串 */
    privateKey: readFileSync(join(__dirname, './.ssh/asdf')).toString(),
    /** 同步列表 */
    syncList: [
        {
            title: 'hh',
            local: './dist',
            remote: '/www/test/sfs-test',
        },
    ],
    /** 是否监听 */
    watch: true,
}

// /** 同步列表类型 */
// syncList: {
//     /** 标题 */
//     title: string;
//     /** 本地地址 */
//     local: string;
//     /** 远程地址 */
//     remote: string;
// }[];