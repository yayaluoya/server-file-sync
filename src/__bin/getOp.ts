import { Command } from 'commander';

/** 
 * 命令行选项
 */
export interface IOp {
    /** 查看版本 */
    version: boolean;
    /** 帮助 */
    help: boolean;
    /** 初始化 */
    init: boolean;
    /** 配置文件 */
    config: string;
    /** 测试配置文件 */
    debugConfig: string;
    /** 项目key列表 */
    keys: string;
    /** 演示 */
    demo: boolean;
}

/**
 * 获取命令行选项
 */
export function getOp(): IOp {
    const program = new Command();

    program.option('-v --version')
        .option('-h --help')
        .option('-i --init')
        .option('-c --config <path>')
        .option('-dc --debug-config [path]')
        .option('-k --keys <keys>')
        .option('-d --demo');

    program.parse(process.argv);

    return program.opts<IOp>();
}