"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOp = void 0;
var commander_1 = require("commander");
/**
 * 获取命令行选项
 */
function getOp() {
    var program = new commander_1.Command();
    program.option('-v --version')
        .option('-h --help')
        .option('-i --init')
        .option('-c --config <path>')
        .option('-dc --debug-config [path]')
        .option('-k --keys <keys>')
        .option('-d --demo');
    program.parse(process.argv);
    return program.opts();
}
exports.getOp = getOp;
//# sourceMappingURL=getOp.js.map