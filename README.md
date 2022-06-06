# server-file-sync
把本地文件夹下的文件同步到服务器指定目录下，方便前端更新代码

#### 使用方法

- npm i server-file-sync -g 全局安装

- 在项目目录下执行 sfs -i 生成配置文件，然后按照里面的选项配置

- 然后就能执行 sfs 同步文件了

#### 命令介绍
sfs -h 查看所有命令和使用方式

#### 连接方式
- 本工具只支持ssh的连接方式，因为这个是最安全的。

- 首先在某个目录下执行 ssh-keygen -f <fileName>生成一对密钥（期间会提示你输密码），不带pub的是私钥带pub的是公共密钥，你要把公钥的内容添加到服务器的/root/.ssh/authorized_keys文件中，然后把私钥和对应的密码添加进本工具的配置文件中（具体字段见配置文件），这时就能连接到服务器并同步文件了。

#### 注意事项
- 最好在项目中把密钥从版本控制系统中忽略，防止被人连接到这台服务器造成无法控制的影响

#### 配置文件格式
``` ts
/**
 * 配置文件类型
 */
import { type Matcher } from 'anymatch';
export interface IConfig {
    /** 配置名字 */
    name: string;
    /** 主机地址 */
    host: string,
    /** 端口号 */
    port: number,
    /** 用户名 */
    username: string,
    /** 私钥密码 */
    passphrase: string;
    /** 私钥字符串 */
    privateKey: string;
    /** 同步列表 */
    syncList: {
        /** key */
        key: string;
        /** 标题 */
        title: string;
        /** 路径列表 */
        paths: {
            /** 本地地址 */
            local: string;
            /** 远程地址 */
            remote: string;
            /** 文件忽略，请注意不支持 Windows 样式的反斜杠作为分隔符*/
            ignored?: Matcher;
        }[],
    }[];
    /** 是否监听 */
    watch: boolean;
    /** 更新回调 */
    updateF?: (conn: Client, key: string) => Promise<any>;
}
```