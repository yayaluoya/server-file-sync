import path from 'path';

/**
 * 地址管理器
 */
export class PathManger {
  /** cwd路径 */
  private static _cwd = '';

  /** cwd路径 */
  static set cwd(_: string) {
    if (this._cwd) {
      console.error('已经设置了cwd了');
      return;
    }
    this._cwd = _;
  }
  static get cwd() {
    return PathManger._cwd || process.cwd();
  }

  /** 工具根路径 */
  static get toolRootPath() {
    return path.join(__dirname, '../../');
  }
}
