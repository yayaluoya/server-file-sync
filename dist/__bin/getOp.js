"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOp = void 0;
var getCmdOp_1 = require("yayaluoya-tool/dist/node/getCmdOp");
/**
 * 获取命令行选项
 */
function getOp() {
    return (0, getCmdOp_1.getCmdOp)(function (program) {
        program.option('-h --help')
            .option('-i --init')
            .option('-c --config <path>')
            .option('-dc --debug-config [path]')
            .option('-k --keys <keys>')
            .option('-d --demo');
    });
}
exports.getOp = getOp;
//# sourceMappingURL=getOp.js.map