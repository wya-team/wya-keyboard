let comboDeliminator = '>';
let keyDeliminator = '+';

// TODO: 序列支持，'a >> b >> a >> b >> a'
let sequenceDeliminator = '>>'; // 或其他字符

class KeyCombo {
	constructor(eventName) {
		// TODO: 可修改
		this.sourceStr = eventName;
		// 如：a + b > c -> [ [ 'a', 'b' ], [ 'c' ] ]
		this.subCombos = this.parseComboStr(eventName);

		// 如：[ [ 'a', 'b' ], [ 'c' ] ] -> ['a', 'b', 'c']
		this.keyNames  = this.subCombos.reduce(
			(pre, cur) => pre.concat(cur), []
		);
	}

	/**
	 * a + b > c -> [ [ 'a', 'b' ], [ 'c' ] ]
	 */
	parseComboStr(eventName) {
		let subComboStrs = this._splitStr(eventName, comboDeliminator);
		let combo = [];

		subComboStrs.forEach((str, index) => {
			combo.push(this._splitStr(str, keyDeliminator));
		});
		return combo;
	}

	/**
	 * a + b > c 与 >,  -> [ 'a + b', 'c' ]
	 * a + b 与 +,  -> [ 'a', 'b' ]
	 */
	_splitStr(str, deliminator) {
		return str.split(deliminator).map(i => i.trim());
	}

	/**
	 * 是否可触发当前事件
	 * ['a', 'b', 'c'] -> true | false
	 */
	check(pressedKeyNames) {
		let startingKeyNameIndex = 0;
		for (let i = 0; i < this.subCombos.length; i++) {
			startingKeyNameIndex = this._checkSubCombo(
				this.subCombos[i],
				startingKeyNameIndex,
				pressedKeyNames
			);
			if (startingKeyNameIndex === -1) return false;
		}
		return true;
	}

	/**
	 * 如: 
	 * 	pressedKeyNames -> ['fake', 'a', 'fake', 'b', 'fake', 'c'], 
	 * 	subCombos -> [['a', 'b'], ['c']]
	 * 	
	 *  1. ['a', 'b'], 0, ['fake', 'a', 'fake', 'b', 'fake', 'c'] -> 3
	 *  2. ['c'], 3, ['fake', 'a', 'fake', 'b', 'fake', 'c']
	 *  
	 *  @return {Number} 
	 *  -1: 未找到，
	 *  [index]: pressedKeyNames下一个组合（subCombo）开始的地方
	 */
	_checkSubCombo(subCombo, startingKeyNameIndex, pressedKeyNames) {
		subCombo = subCombo.slice(0);
		pressedKeyNames = pressedKeyNames.slice(startingKeyNameIndex);
		let startIndex = startingKeyNameIndex;
		for (let i = 0; i < subCombo.length; i++) {
			let keyName = subCombo[i];
			let index = pressedKeyNames.indexOf(keyName);
			if (index > -1) {
				subCombo.splice(i, 1);
				i--;
				if (index > startIndex) {
					startIndex = index + 1; // 从后一位开始
				}
				if (subCombo.length === 0) {
					return startIndex;
				}
			}
		}

		return -1;
	}

	/**
	 * @param  [KeyCombo | String]  instance
	 * @return [Boolean]
	 */
	isEqual(instance) {
		if (
			!instance 
			|| typeof instance !== 'string' 
			&& typeof instance !== 'object'
		) { return false; }

		if (typeof instance === 'string') {
			instance = new KeyCombo(instance);
		}

		return this.subCombos.every((subCombo, index) => {
			return instance.subCombos[index]
				&& subCombo.length === instance.subCombos[index].length 
				&& subCombo.every((keyName) => instance.subCombos[index].includes(keyName));
		});
	}
}

export default KeyCombo;