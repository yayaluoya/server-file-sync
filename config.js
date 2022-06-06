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
    syncList: [
        // /** key */
        // key: string;
        // /** 标题 */
        // title: string;
        // /** 路径列表 */
        // paths: {
        //     /** 本地地址 */
        //     local: string;
        //     /** 远程地址 */
        //     remote: string;
        //     /** 文件忽略，请注意不支持 Windows 样式的反斜杠作为分隔符*/
        //     /** import { type Matcher } from 'anymatch'; */
        //     ignored: Matcher;
        // }[],
    ],
    /** 是否监听 */
    watch: false,
}