/**
 * 对象工具
 */
export class ObjectUtils {
    /**
    * 克隆一个对象
    * 采用序列化和反序列化的方式，function不会被克隆
    * @param _O 该对象
    */
    static clone(_data) {
        return JSON.parse(JSON.stringify(_data));
    }

    /**
     * 在a对象上合并b对象的值
     * 类型以b对象上的为准
     * @param a 
     * @param bs
     */
    static merge<T>(a: T, ...bs: T[]): T {
        for (let b of bs) {
            for (let i in b) {
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
    }
}