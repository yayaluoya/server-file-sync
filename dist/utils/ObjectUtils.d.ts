/**
 * 对象工具
 */
export declare class ObjectUtils {
    /**
    * 克隆一个对象
    * 采用序列化和反序列化的方式，function不会被克隆
    * @param _O 该对象
    */
    static clone(_data: any): any;
    /**
     * 在a对象上合并b对象的值
     * 类型以b对象上的为准
     * @param a
     * @param bs
     */
    static merge<T>(a: T, ...bs: T[]): T;
}
//# sourceMappingURL=ObjectUtils.d.ts.map