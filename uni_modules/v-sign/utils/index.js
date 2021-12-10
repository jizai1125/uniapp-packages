/**
 * 判断是否未数值
 * @param {Object} val
 */
export function isNumber(val) {
	return !isNaN(Number(val))
}

/**
 * 处理大小单位
 * @param {Object} val
 */
export function formatSize(val) {
	return isNumber(val) ? `${val}rpx` : val
}
