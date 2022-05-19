/**
 * 对象工具
 */
export class ObjectUtils {
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