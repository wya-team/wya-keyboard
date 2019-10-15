import Keyboard from '../keyboard';
import KeyCombo from '../key-combo';
import Locale from '../locale';

describe('browser.js', () => {
	test('验证方法', () => {
		expect(typeof Keyboard === 'function').toBe(true);
		expect(typeof KeyCombo === 'function').toBe(true);
		expect(typeof Locale === 'function').toBe(true);
	});

	test('验证: KeyCombo', () => {
		let AOnly = new KeyCombo('a');
		let AAndB = new KeyCombo('a + b');
		let AThenB = new KeyCombo('a > b');
		let AAndBThenC = new KeyCombo('a + b > c');
		let AAndBThenCThenDAndEThenF = new KeyCombo('a + b > c > d + e > f');

		// sourceStr
		expect(AOnly.sourceStr).toBe('a');
		expect(AAndB.sourceStr).toBe('a + b');
		expect(AThenB.sourceStr).toBe('a > b');
		expect(AAndBThenC.sourceStr).toBe('a + b > c');
		expect(AAndBThenCThenDAndEThenF.sourceStr).toBe('a + b > c > d + e > f');

		// subCombos
		expect(AOnly.subCombos).toEqual([ [ 'a' ] ]);
		expect(AAndB.subCombos).toEqual([ [ 'a', 'b' ] ]);
		expect(AThenB.subCombos).toEqual([ [ 'a' ], [ 'b' ] ]);
		expect(AAndBThenC.subCombos).toEqual([ [ 'a', 'b' ], [ 'c' ] ]);
		expect(AAndBThenCThenDAndEThenF.subCombos).toEqual([ [ 'a', 'b' ], [ 'c' ], [ 'd', 'e' ], [ 'f' ] ]);

		// keyNames
		expect(AOnly.keyNames).toEqual([ 'a' ]);
		expect(AAndB.keyNames).toEqual([ 'a', 'b' ]);
		expect(AThenB.keyNames).toEqual([ 'a', 'b' ]);
		expect(AAndBThenC.keyNames).toEqual([ 'a', 'b', 'c' ]);
		expect(AAndBThenCThenDAndEThenF.keyNames).toEqual([ 'a', 'b', 'c', 'd', 'e', 'f' ]);


		// check
		expect(AOnly.check(['a'])).toBe(true);
		expect(AAndB.check(['a'])).toBe(false); // ['a', 'b']
		expect(AThenB.check(['a', 'd'])).toBe(false); // ['a', 'b']
		expect(AAndBThenC.check(['fake', 'a', 'fake', 'b', 'fake', 'c'])).toBe(true);
		expect(AAndBThenCThenDAndEThenF.check(['fake', 'a', 'fake', 'b', 'fake', 'c', 'd', 'e', 'f'])).toBe(true);


		// isEqual
		expect(AOnly.isEqual('a')).toBe(true);
		expect(AAndB.isEqual(new KeyCombo('a + b'))).toBe(true);
		expect(AThenB.isEqual('a>b')).toBe(true); // ['a', 'b']
		expect(AAndBThenC.isEqual('b+a > c')).toBe(true);
		expect(AAndBThenCThenDAndEThenF.isEqual('b+a> c > e+d > f')).toBe(true);

	});

	test('验证: KeyCombo.js -> 特殊字符', () => {
		let AOnly = new KeyCombo('a > \\');

		// sourceStr
		expect(AOnly.sourceStr).toBe('a > \\');

		// subCombos
		expect(AOnly.subCombos).toEqual([ [ 'a' ], [ '\\' ] ]);

		// keyNames
		expect(AOnly.keyNames).toEqual([ 'a', '\\' ]);

		// check
		expect(AOnly.check(['a', '\\'])).toBe(true);

		// isEqual
		expect(AOnly.isEqual('a>\\')).toBe(true);

	});

	test('验证: KeyCombo.js -> shift', () => {
		let AOnly = new KeyCombo('shift + a');

		// sourceStr
		expect(AOnly.sourceStr).toBe('shift + a');

		// subCombos
		expect(AOnly.subCombos).toEqual([ [ 'shift', 'a' ] ]);

		// keyNames
		expect(AOnly.keyNames).toEqual([ 'shift', 'a' ]);

		// check
		expect(AOnly.check(['a'])).toBe(false);
		expect(AOnly.check(['shift', 'a'])).toBe(true);

		// isEqual
		expect(AOnly.isEqual('shift + a')).toBe(true);

	});

	test('验证: Locale.js', () => {
		let locale = new Locale();

		// 按下a
		locale.pressKey(65);
		expect(locale.pressedKeys).toEqual(['a']);
		expect(locale._appliedMacros).toEqual([]);

		// 按下shift
		locale.pressKey(16);
		expect(locale.pressedKeys).toEqual(['a', 'shift', 'A']);
		expect(locale._appliedMacros[0].keyNames).toEqual(['A']);

		// 按下b
		locale.pressKey(66);
		expect(locale.pressedKeys).toEqual(['a', 'shift', 'A', 'b', 'B']);
		expect(locale._appliedMacros[1].keyNames).toEqual(['B']);

		// 松开b
		locale.releaseKey(66);
		expect(locale.pressedKeys).toEqual(['a', 'shift', 'A']);
		expect(locale._appliedMacros[0].keyNames).toEqual(['A']);

		// 松开shift
		locale.releaseKey(16);
		expect(locale.pressedKeys).toEqual(['a']);
		expect(locale._appliedMacros).toEqual([]);

		// 松开a
		locale.releaseKey(65);
		expect(locale.pressedKeys).toEqual([]);
		expect(locale._appliedMacros).toEqual([]);
	});

	test('验证: Locale.js -> command', () => {
		let locale = new Locale();

		// 按下command
		locale.pressKey(91);
		expect(locale.pressedKeys).toEqual(['command', 'windows', 'win', 'super', 'leftcommand', 'leftwindows', 'leftwin', 'leftsuper']);
		expect(locale._appliedMacros).toEqual([]);

		// 按下a
		locale.pressKey(65);
		expect(locale.pressedKeys).toEqual(['command', 'windows', 'win', 'super', 'leftcommand', 'leftwindows', 'leftwin', 'leftsuper', 'a']);
		expect(locale._appliedMacros).toEqual([]);

		// 松开command, 全部释放
		locale.releaseKey(91);
		expect(locale.pressedKeys).toEqual([]);
		expect(locale._appliedMacros).toEqual([]);
	});

	test('验证: keyboard.js', () => {
		const trigger = () => {
			let eventA = new KeyboardEvent('keydown', { 'keyCode': 65 });
			let eventB = new KeyboardEvent('keydown', { 'keyCode': 66 });
			let eventC = new KeyboardEvent('keydown', { 'keyCode': 67 });
			document.dispatchEvent(eventA);
			document.dispatchEvent(eventB);
			document.dispatchEvent(eventC);
		};
		let keyboard = new Keyboard();

		keyboard.on('a + b', (e) => {
			console.log(1);
		});

		keyboard.on('b + a', (e) => {
			console.log(2);
		});

		keyboard.on('a + b > c', (e) => {
			console.log(3);
		});

		trigger();
	});
});
