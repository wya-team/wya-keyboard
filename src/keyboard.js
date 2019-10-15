import Locale from './locale';
import KeyCombo from './key-combo';
import { EventStore } from '@wya/ps';

class Keyboard extends EventStore {
	/**
	 * opts: {
	 * 	locale: {
	 * 		name: 'us',
	 * 		builder() {}
	 * 	}
	 * }
	 */
	constructor(opts = {}) {
		super();

		this.locale = new Locale(opts.locale);
		this.el = opts.el || window.document;
		this.global = opts.global || window;

		// 开启事件
		this.operateDOMEvents('add');
	}

	operateDOMEvents = (type) => {
		let key = type === 'add' 
			? 'addEventListener' 
			: 'removeEventListener';

		this.el[key]('keydown', this.handleKeydown);
		this.el[key]('keyup', this.handleKeyup);
		this.global[key]('focus', this.releaseAllKeys);
		this.global[key]('blur', this.releaseAllKeys);
	}

	handleKeydown = (e) => {
		this.locale.pressKey(e.keyCode);

		let preventRepeat = false;
		let pressedKeys = this.locale.pressedKeys.slice(0);

		e.preventRepeat = () => (preventRepeat = true);
		e.pressedKeys = pressedKeys.slice(0);
		let events = this.__events__;
		Object.keys(events).filter(eventName => {
			let allowEmit = new KeyCombo(eventName).check(pressedKeys);
			events[eventName] 
				&& events[eventName].length > 0
				&& allowEmit
				&& this.emit(eventName, e);
		});
	}

	handleKeyup = (e) => {
		this.locale.releaseKey(e.keyCode);
	}

	releaseAllKeys = (e) => {
		this.locale.releaseAllKeys();
	}

	/**
	 * 重置，需要重新注册
	 */
	reset() {
		this.destroy();
		this.operateDOMEvents('add');
	}

	destroy() {
		this.operateDOMEvents('remove');
		this.releaseAllKeys();
		this.off();
	}

	/**
	 * 暂停，不需要重新注册
	 */
	pause() {
		this.operateDOMEvents('remove');
	}

	/**
	 * 恢复
	 */
	resume() {
		this.operateDOMEvents('add');
	}
}

export default Keyboard;