import path from 'path';
import { PathManger } from '../manager/PathManger';

/**
 * 获取绝对地址
 * @param _path
 * @returns
 */
export function getAbsolute(_path: string) {
  if (path.isAbsolute(_path)) {
    return _path;
  } else {
    return path.join(PathManger.cwd, _path);
  }
}
