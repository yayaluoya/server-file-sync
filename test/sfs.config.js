const { readFileSync } = require("fs");
const path = require("path");
const { join } = require("path");

/**
 * server-file-sync 的默认配置文件
 */
module.exports = {
    name: '自定义配置',
    /** 主机地址 */
    host: '47.94.233.236',
    /** 端口号 */
    port: 22,
    /** 用户名 */
    username: 'root',
    /** 私钥密码 */
    passphrase: 'asdf',
    /** 私钥字符串 */
    privateKey: readFileSync(join(__dirname, './.ssh/asdf')),
    /** 同步列表 */
    syncList: [
        {
            key: 'hh',
            title: '测试的项目',
            paths: [
                {
                    local: './dist',
                    remote: '/www/test/sfs-test',
                    ignored: path.join(__dirname, './dist/a/**').replace(/\\+/g, '/'),
                },
                {
                    local: './dist/hh.html',
                    remote: '/www/test/sfs-test2/hh.html',
                },
            ],
        },
    ],
    /** 是否监听 */
    watch: false,
    async updateF({
        connF,
        sftp,
    }, key) {
        // console.log('更新', key);
        connF().then((conn) => {
            conn.exec('uptime', (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    conn.end();
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                })
            });
        })
    }
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