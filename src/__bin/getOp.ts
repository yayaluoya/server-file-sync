import { IOp as IOp_, getCmdOp } from '@T/node/getCmdOp';

/**
 * 命令行选项
 */
export interface IOp extends IOp_ {
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
  /** 选择 */
  select: boolean;
  /** 演示 */
  demo: boolean;
}

/**
 * 获取命令行选项
 */
export function getOp() {
  return getCmdOp<IOp>((program) => {
    program
      .option('-h --help')
      .option('-i --init')
      .option('-c --config <path>')
      .option('-dc --debug-config [path]')
      .option('-k --keys <keys>')
      .option('-s --select')
      .option('-d --demo');
  });
}
