const { readFileSync } = require('fs');
const path = require('path');
const { join } = require('path');

const { getConfig } = require('server-file-sync');

/**
 * server-file-sync 的默认配置文件
 */
module.exports = getConfig(async () => {
  //等一会儿
  console.log('异步加载配置sfs.config.js...');
  await new Promise((r, e) => {
    setTimeout(() => {
      r();
    }, 1000);
  });
  return {
    /** 主机地址 */
    host: '47.94.233.236',
    /** 端口号 */
    port: 22,
    /** 用户名 */
    username: 'root',
    /** 私钥字符串 */
    privateKey: readFileSync(join(__dirname, './.ssh/asdf')),
    /** 同步列表 */
    syncList: [
      {
        /** 主机地址 */
        host: '47.94.233.236',
        /** 端口号 */
        port: 22,
        /** 用户名 */
        username: 'root',
        /** 私钥字符串 */
        privateKey: readFileSync(join(__dirname, './.ssh/asdf')),
        //
        key: 'hh',
        title: '测试项目',
        paths: [
          {
            local: join(__dirname, './dist'),
            remote: '/www/test/sfs-test',
            ignored: path.join(__dirname, './dist/a/**').replace(/\\+/g, '/'),
          },
          {
            local: join(__dirname, './dist/hh.html'),
            remote: '/www/test/sfs-test2/hh.html',
          },
        ],
        beforeF() {
          console.log(this.key, '同步开始');
          return new Promise((r, e) => {
            setTimeout(() => {
              r();
            }, 1000);
          });
        },
        laterF() {
          console.log(this.key, '同步完成');
        },
      },
      {
        key: 'hh2',
        title: '测试项目2',
        paths: [
          {
            local: join(__dirname, './dist'),
            remote: '/www/test/sfs-test',
            ignored: path.join(__dirname, './dist/a/**').replace(/\\+/g, '/'),
          },
        ],
      },
    ],
    /** 是否监听 */
    watch: false,
    beforeF(connF) {
      console.log('主回调-同步之前');
      return new Promise((r, e) => {
        setTimeout(() => {
          r();
        }, 1000);
      });
    },
    laterF(connF) {
      console.log('主回调-同步完成');
      return connF().then((conn) => {
        return new Promise((r, e) => {
          conn.exec('uptime', (err, stream) => {
            if (err) {
              e(err);
              throw err;
            }
            stream
              .on('close', (code, signal) => {
                console.log('关闭连接');
                conn.end();
                r();
              })
              .on('data', (data) => {
                console.log('STDOUT: ' + data);
              });
          });
        });
      });
    },
  };
});

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
