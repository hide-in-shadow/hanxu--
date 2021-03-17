/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validmobile(str) {
  return /^1[3-9]\d{9}$/.test(str) // 校验手机号
}
// export function validmobile(str) {
//   const valid_map = ['13800000002']
//   return valid_map.indexOf(str.trim()) >= 0
// }
