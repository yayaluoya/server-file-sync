import chalk from 'chalk';
import Vorpal from 'vorpal';
import readline from 'readline';

const vorpal = Vorpal();

const op = {
    message: '上传/1,演示/3',
    time: 5,
    list: [
        {
            name: '上传',
            value: 'y',
            result: '上传',
        },
        {
            name: '取消-什么也不做',
            value: '',
            result: '已取消',
        },
        {
            name: '演示-演示一下有哪些文件会上传，但不会真的上传',
            value: 'd',
            result: '演示',
        },
    ],
    com: false,
    onIndex: 1,
};

/**
 *  监听命令行的键盘事件
 */
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    let keyName = key.name;
    switch (keyName) {
        case 'up':
            op.onIndex--;
            op.onIndex < 0 && (op.onIndex = op.list.length - 1);
            break;
        case 'down':
            op.onIndex++;
            op.onIndex > op.list.length - 1 && (op.onIndex = 0);
            break;
        case 'return':
            com();
            break;
    }
    redraw();
});

/**
 * com
 */
function com() {
    op.com = true;
    setTimeout(() => {
        process.send(op.list[op.onIndex].value);
    }, 0);
}

/** 计时器 */
function timeT() {
    redraw();
    op.time--;
    if (op.time < 0) {
        com();
        redraw();
    } else {
        setTimeout(() => {
            timeT();
        }, 1000);
    }
}

timeT();

/**
 * 绘制
 */
function redraw() {
    if (op.com) {
        let strs = [
            chalk.bold(`${op.message} `),
            chalk.greenBright(op.list[op.onIndex].result),
        ];
        vorpal.ui.redraw(strs.join(''));
    } else {
        let strs = [
            chalk.green('? ') + chalk.bold(`${op.message} ${op.time}秒后自动确定:`),
            ...op.list.map((_, i) => {
                if (i == op.onIndex) {
                    return chalk.blueBright(` ${i + 1}) ` + _.name);
                } else {
                    return chalk.gray(` ${i + 1}) ` + _.name);
                }
            }),
        ];
        vorpal.ui.redraw(strs.join('\n'));
    }
}
