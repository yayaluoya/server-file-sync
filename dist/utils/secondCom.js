"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondCom = void 0;
var chalk_1 = __importDefault(require("chalk"));
var readline_1 = __importDefault(require("readline"));
/**
 * 二次确定
 */
function secondCom(title) {
    return new Promise(function (r, e) {
        var rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        //
        rl.question(chalk_1.default.cyan(title), function (input) {
            rl.close();
            r(input);
        });
    });
}
exports.secondCom = secondCom;
//# sourceMappingURL=secondCom.js.map