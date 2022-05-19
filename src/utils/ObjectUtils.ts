/**
 * 对象工具
 */
export class ObjectUtils {
    /**
     * 获取一个对象的属性
     * @param obj
     * @param key 目标属性，可以是字符串，方法，正则表达式
     */
    static getPro(obj, key) {
        if (typeof obj != 'object') {
            return;
        }
        let is;
        for (let i in obj) {
            is = false;
            switch (true) {
                case typeof key == 'function':
                    is = key(i);
                    break;
                case key instanceof RegExp:
                    is = key.test(i);
                    break;
                default:
                    is = i == key;
                    break;
            }
            //
            if (is) {
                return obj[i];
            }
        }
    }
    /**
     * 克隆一个对象
     * 采用序列化和反序列化的方式，function不会被克隆
     * @param _O 该对象
     */
    static clone(_data) {
        return JSON.parse(JSON.stringify(_data));
    }

    /**
     * 克隆一个对象
     * 递归克隆，包括原型链上的东西
     */
    static clone_(data) {
        if (typeof data == 'object' && data) {
            if (Array.isArray(data)) {
                return data.reduce((a, b) => {
                    a.push(this.clone_(b));
                    return a;
                }, []);
            }
            let _data = {};
            Object.keys(data).forEach((key) => {
                _data[key] = this.clone_(data[key]);
            });
            //直接赋值原型
            Object.setPrototypeOf(_data, Object.getPrototypeOf(data));
            //
            return _data;
        }
        return data;
    }

    /**
     * 属性提取
     * @param {*} obj 
     * @param {*} props 
     */
    static propGet(obj, props) {
        if (!Array.isArray(props)) {
            props = [props];
        }
        let o = {};
        for (let key of props) {
            o[key] = obj[key];
        }
        return o;
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