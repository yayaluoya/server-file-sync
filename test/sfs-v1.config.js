const { readFileSync } = require('fs');
const path = require('path');
const { join } = require('path');

/** @type {()=>import('server-file-sync/dist/config/TConfig').TConfig} */
module.exports = async function () {
  //等一会儿
  console.log('异步加载配置sfs-v1.config.js...');
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
    ],
    /** 是否监听 */
    watch: true,
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
};

/**
 * name: server-file-sync
 * version: 1.7.0
 * description: 把本地文件同步到服务器指定目录，方便前端更新代码到服务器
 * author: yayaluoya <yayaluoya@sina.com>
 * homepage: https://github.com/yayaluoya/server-file-sync#readme
 * issues: https://github.com/yayaluoya/server-file-sync/issues
 */
