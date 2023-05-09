/** 获取数组元素类型 */
type getArrayT<T> = T extends Array<infer A> ? A : any;
