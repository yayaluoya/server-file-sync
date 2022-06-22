"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtils = void 0;
/**
 * 对象工具
 */
var ObjectUtils = /** @class */ (function () {
    function ObjectUtils() {
    }
    /**
    * 克隆一个对象
    * 采用序列化和反序列化的方式，function不会被克隆
    * @param _O 该对象
    */
    ObjectUtils.clone = function (_data) {
        return JSON.parse(JSON.stringify(_data));
    };
    /**
     * 在a对象上合并b对象的值
     * 类型以b对象上的为准
     * @param a
     * @param bs
     */
    ObjectUtils.merge = function (a) {
        var bs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            bs[_i - 1] = arguments[_i];
        }
        for (var _a = 0, bs_1 = bs; _a < bs_1.length; _a++) {
            var b = bs_1[_a];
            for (var i in b) {
                if (Array.isArray(a[i])) {
                    ObjectUtils.merge(a[i], b[i] || []);
                    continue;
                }
                if (a[i] && typeof a[i] == 'object') {
                    ObjectUtils.merge(a[i], b[i] || {});
                    continue;
                }
                //
                a[i] = b[i];
            }
        }
        return a;
    };
    return ObjectUtils;
}());
exports.ObjectUtils = ObjectUtils;
//# sourceMappingURL=ObjectUtils.js.map