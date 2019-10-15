import defaultBuilder from './locales/us';
import KeyCombo from './key-combo';

class Locale {
	constructor(opts = {}) {
		const { name = 'us', builder = defaultBuilder } = opts;

		this.localeName = name;

		// 键盘上按住的事件
		this.pressedKeys = [];

		// 键盘上按住的功能键（如shift）,产出新的keys
		this._appliedMacros = [];

		// [keyCode]: [keyName]
		this._keyMap = {};

		// 清除键（松开时，置空pressedKeys）
		this._killKeyCodes = [];

		// 所有功能键产出的keys
		this._macros = [];

		builder(this);
	}

	/**
	 * 绑定键位映射
	 * [keyCode]: keyNames
	 */
	bindKeyCode(keyCode, keyNames) {
		if (typeof keyNames === 'string') {
			keyNames = [keyNames];
		}

		this._keyMap[keyCode] = keyNames;
	}

	/**
	 * 功能键，如shift/capslock/command/ctrl
	 */
	bindMacro(keyComboStr, keyNames) {
		if (typeof keyNames === 'string') {
			keyNames = [keyNames];
		}

		let handler = null;
		if (typeof keyNames === 'function') {
			handler = keyNames;
			keyNames = null;
		}

		let macro = {
			keyCombo: new KeyCombo(keyComboStr),
			keyNames,
		};

		this._macros.push(macro);
	}

	/**
	 * 用于释放时，清除pressedKeys
	 * 如松开command时，pressedKeys -> []
	 */
	setKillKey(keyCode) {
		if (typeof keyCode === 'string') {
			let keyCodes = this.getKeyCodes(keyCode);
			keyCodes.forEach(item => this.setKillKey(item));
			return;
		}

		this._killKeyCodes.push(keyCode);
	}

	/**
	 * 由keyName获取对应的keyCodes
	 */
	getKeyCodes(keyName) {
		let keyCodes = [];
		for (let keyCode in this._keyMap) {
			this._keyMap[keyCode].includes(keyName) && keyCodes.push(keyCode | 0);
		}
		return keyCodes;
	}
	
	/**
	 * 由keyCode获取对应的KeyNames
	 */
	getKeyNames(keyCode) {
		return this._keyMap[keyCode] || [];
	}

	/**
	 * 键位按住触发
	 * 修改pressedKeys与_appliedMacros
	 */
	pressKey(keyCode) {
		if (typeof keyCode === 'string') {
			let keyCodes = this.getKeyCodes(keyCode);
			keyCodes.forEach(item => this.pressKey(item));
			return;
		}

		let keyNames = this.getKeyNames(keyCode);

		keyNames.forEach((keyName) => {
			!this.pressedKeys.includes(keyName) && this.pressedKeys.push(keyName);
		});

		// 添加组合键情况 如shift
		const { appliedMacros, pressedKeys } = this._applyMacros({
			macros: this._macros.slice(0),
			appliedMacros: this._appliedMacros.slice(0),
			pressedKeys: this.pressedKeys.slice(0)
		});

		// 重置
		this.pressedKeys = pressedKeys;
		this._appliedMacros = appliedMacros;
	}

	/**
	 * 修改 pressedKeys， 如按住shift + a, -> ['shift', 'a', 'A'] 
	 * 修改 _applyMacros -> 
	 */
	_applyMacros({ macros, appliedMacros, pressedKeys }) {
		macros.forEach((macro) => {
			if (appliedMacros.findIndex(i => i.keyCombo.sourceStr === macro.keyCombo.sourceStr) > -1) return;
			if (macro.keyCombo.check(pressedKeys)) {
				if (macro.handler) {
					macro.keyNames = macro.handler(pressedKeys);
				}

				macro.keyNames.forEach((keyName) => {
					!pressedKeys.includes(keyName) && pressedKeys.push(keyName);
				});
				appliedMacros.push(macro);
			}
		});

		return {
			appliedMacros,
			pressedKeys
		};
	}

	/**
	 * 释放按钮
	 */
	releaseKey(keyCode) {
		if (typeof keyCode === 'string') {
			let keyCodes = this.getKeyCodes(keyCode);
			keyCodes.forEach(item => this.releaseKey(item));
			return;
		}
		
		if (this._killKeyCodes.includes(keyCode)) {
			this.pressedKeys = [];
			return;
		}

		let keyNames = this.getKeyNames(keyCode);

		keyNames.forEach((keyName) => {
			let index = this.pressedKeys.indexOf(keyName);
			index > -1 && this.pressedKeys.splice(index, 1);
		});

		// 移除组合键情况 如shift
		const { appliedMacros, pressedKeys } = this._clearMacros({
			appliedMacros: this._appliedMacros.slice(0),
			pressedKeys: this.pressedKeys.slice(0)
		});

		// 重置
		this.pressedKeys = pressedKeys;
		this._appliedMacros = appliedMacros;
	}

	_clearMacros({ appliedMacros, pressedKeys }) {
		appliedMacros = appliedMacros.filter((macro) => {
			if (!macro.keyCombo.check(pressedKeys)) {
				macro.keyNames.forEach((keyName) => {
					let index = pressedKeys.indexOf(keyName);
					index > -1 && pressedKeys.splice(index, 1);
				});
				if (macro.handler) {
					macro.keyNames = null;
				}
				return false;
			}
			return true;
		});

		return {
			appliedMacros,
			pressedKeys
		};
	}

	releaseAllKeys() {
		this.pressedKeys = [];
	}
}

export default Locale;