# server-file-sync
把本地文件夹下的文件同步到服务器指定目录下，方便前端更新代码

#### 使用方法

- npm i server-file-sync -g 全局安装

- 在项目目录下执行 sfs -i 生成配置文件，然后按照里面的选项配置

- 然后就能执行 sfs 同步文件了

#### 命令介绍
sfs -h 查看所有命令和使用方式

#### 连接方式
- 建议通过ssh密钥的连接方式，因为这个是最安全的，如果直接用密码连接万一泄露了就麻烦了。

- 首先在某个目录下执行 ssh-keygen -f <fileName>生成一对密钥（期间会提示你输密码），不带pub的是私钥带pub的是公共密钥，你要把公钥的内容添加到服务器的/root/.ssh/authorized_keys文件中，然后把私钥和对应的密码添加进本工具的配置文件中（具体字段见配置文件），这时就能连接到服务器并同步文件了。

#### 注意事项
- 最好在项目中把密钥从版本控制系统中忽略，防止被人连接到这台服务器造成无法控制的影响

#### 配置文件格式
``` ts
/**
 * 配置文件类型
 */
import { Matcher } from "anymatch";
import { Client, ConnectConfig } from "ssh2";

/** 基础连接配置 */
export type TConnectConfig = Pick<ConnectConfig, 'host' | 'port' | 'username' | 'passphrase' | 'privateKey'>

/**
 * 配置文件类型
 * TODO 关于ssh2配置信息的合并顺序是先connectConfig中的字段，再是配置文件中的字段，，再是syncList中的字段
 */
export type TConfig = TConnectConfig & {
    /** 同步列表 */
    syncList?: ({
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
        /** 开始同步之前的回调 */
        beforeF?: (connF: () => Promise<Client>) => Promise<void>;
        /** 同步之后的回调 */
        laterF?: (connF: () => Promise<Client>) => Promise<void>;
    } & TConnectConfig)[];
    /** ssh2的连接配置 */
    connectConfig?: ConnectConfig,
    /** 是否监听 */
    watch?: boolean;
    /** 开始同步之前的回调 */
    beforeF?: (connF: (op?: TConnectConfig) => Promise<Client>) => Promise<void>;
    /** 同步之后的回调 */
    laterF?: (connF: (op?: TConnectConfig) => Promise<Client>) => Promise<void>;
}
```

建议使用方法getConfig获取config，这样就有全类型提示了，该方法的声明如下

```ts
function getConfig(f: () => TConfig | Promise<TConfig>);
```

使用方法如下

```ts
const { getConfig } = require("server-file-sync");

/**
 * server-file-sync 的默认配置文件
 */
module.exports = getConfig(() => {
    // 可以是异步的
    return {
        ...
    };
});
```