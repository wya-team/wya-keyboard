const localeBuilder = (ctx) => {
	let { platform, userAgent } = window.navigator;

	// general
	ctx.bindKeyCode(3, ['cancel']);
	ctx.bindKeyCode(8, ['backspace']);
	ctx.bindKeyCode(9, ['tab']);
	ctx.bindKeyCode(12, ['clear']);
	ctx.bindKeyCode(13, ['enter']);
	ctx.bindKeyCode(16, ['shift']);
	ctx.bindKeyCode(17, ['ctrl']);
	ctx.bindKeyCode(18, ['alt', 'menu']);
	ctx.bindKeyCode(19, ['pause', 'break']);
	ctx.bindKeyCode(20, ['capslock']);
	ctx.bindKeyCode(27, ['escape', 'esc']);
	ctx.bindKeyCode(32, ['space', 'spacebar']);
	ctx.bindKeyCode(33, ['pageup']);
	ctx.bindKeyCode(34, ['pagedown']);
	ctx.bindKeyCode(35, ['end']);
	ctx.bindKeyCode(36, ['home']);
	ctx.bindKeyCode(37, ['left']);
	ctx.bindKeyCode(38, ['up']);
	ctx.bindKeyCode(39, ['right']);
	ctx.bindKeyCode(40, ['down']);
	ctx.bindKeyCode(41, ['select']);
	ctx.bindKeyCode(42, ['printscreen']);
	ctx.bindKeyCode(43, ['execute']);
	ctx.bindKeyCode(44, ['snapshot']);
	ctx.bindKeyCode(45, ['insert', 'ins']);
	ctx.bindKeyCode(46, ['delete', 'del']);
	ctx.bindKeyCode(47, ['help']);
	ctx.bindKeyCode(145, ['scrolllock', 'scroll']);
	ctx.bindKeyCode(188, ['comma', ',']);
	ctx.bindKeyCode(190, ['period', '.']);
	ctx.bindKeyCode(191, ['slash', 'forwardslash', '/']);
	ctx.bindKeyCode(192, ['graveaccent', '`']);
	ctx.bindKeyCode(219, ['openbracket', '[']);
	ctx.bindKeyCode(220, ['backslash', '\\']);
	ctx.bindKeyCode(221, ['closebracket', ']']);
	ctx.bindKeyCode(222, ['apostrophe', '\'']);

	// 0-9
	ctx.bindKeyCode(48, ['zero', '0']);
	ctx.bindKeyCode(49, ['one', '1']);
	ctx.bindKeyCode(50, ['two', '2']);
	ctx.bindKeyCode(51, ['three', '3']);
	ctx.bindKeyCode(52, ['four', '4']);
	ctx.bindKeyCode(53, ['five', '5']);
	ctx.bindKeyCode(54, ['six', '6']);
	ctx.bindKeyCode(55, ['seven', '7']);
	ctx.bindKeyCode(56, ['eight', '8']);
	ctx.bindKeyCode(57, ['nine', '9']);

	// numpad
	ctx.bindKeyCode(96, ['numzero', 'num0']);
	ctx.bindKeyCode(97, ['numone', 'num1']);
	ctx.bindKeyCode(98, ['numtwo', 'num2']);
	ctx.bindKeyCode(99, ['numthree', 'num3']);
	ctx.bindKeyCode(100, ['numfour', 'num4']);
	ctx.bindKeyCode(101, ['numfive', 'num5']);
	ctx.bindKeyCode(102, ['numsix', 'num6']);
	ctx.bindKeyCode(103, ['numseven', 'num7']);
	ctx.bindKeyCode(104, ['numeight', 'num8']);
	ctx.bindKeyCode(105, ['numnine', 'num9']);
	ctx.bindKeyCode(106, ['nummultiply', 'num*']);
	ctx.bindKeyCode(107, ['numadd', 'num+']);
	ctx.bindKeyCode(108, ['numenter']);
	ctx.bindKeyCode(109, ['numsubtract', 'num-']);
	ctx.bindKeyCode(110, ['numdecimal', 'num.']);
	ctx.bindKeyCode(111, ['numdivide', 'num/']);
	ctx.bindKeyCode(144, ['numlock', 'num']);

	// function keys
	ctx.bindKeyCode(112, ['f1']);
	ctx.bindKeyCode(113, ['f2']);
	ctx.bindKeyCode(114, ['f3']);
	ctx.bindKeyCode(115, ['f4']);
	ctx.bindKeyCode(116, ['f5']);
	ctx.bindKeyCode(117, ['f6']);
	ctx.bindKeyCode(118, ['f7']);
	ctx.bindKeyCode(119, ['f8']);
	ctx.bindKeyCode(120, ['f9']);
	ctx.bindKeyCode(121, ['f10']);
	ctx.bindKeyCode(122, ['f11']);
	ctx.bindKeyCode(123, ['f12']);

	// secondary key symbols
	ctx.bindMacro('shift + `', ['tilde', '~']);
	ctx.bindMacro('shift + 1', ['exclamation', 'exclamationpoint', '!']);
	ctx.bindMacro('shift + 2', ['at', '@']);
	ctx.bindMacro('shift + 3', ['number', '#']);
	ctx.bindMacro('shift + 4', ['dollar', 'dollars', 'dollarsign', '$']);
	ctx.bindMacro('shift + 5', ['percent', '%']);
	ctx.bindMacro('shift + 6', ['caret', '^']);
	ctx.bindMacro('shift + 7', ['ampersand', 'and', '&']);
	ctx.bindMacro('shift + 8', ['asterisk', '*']);
	ctx.bindMacro('shift + 9', ['openparen', '(']);
	ctx.bindMacro('shift + 0', ['closeparen', ')']);
	ctx.bindMacro('shift + -', ['underscore', '_']);
	ctx.bindMacro('shift + =', ['plus', '+']);
	ctx.bindMacro('shift + [', ['opencurlybrace', 'opencurlybracket', '{']);
	ctx.bindMacro('shift + ]', ['closecurlybrace', 'closecurlybracket', '}']);
	ctx.bindMacro('shift + \\', ['verticalbar', '|']);
	ctx.bindMacro('shift + ;', ['colon', ':']);
	ctx.bindMacro('shift + \'', ['quotationmark', '\'']);
	ctx.bindMacro('shift + !,', ['openanglebracket', '<']);
	ctx.bindMacro('shift + .', ['closeanglebracket', '>']);
	ctx.bindMacro('shift + /', ['questionmark', '?']);
	
	let isMac = platform.match('Mac');
	let isFirefox = userAgent.match('Firefox');
	let isChrome = userAgent.match('Chrome');
	let isSafari = userAgent.match('Safari');
	let isOpera = userAgent.match('Opera');

	if (isMac) {
		ctx.bindMacro('command', ['mod', 'modifier']);
	} else {
		ctx.bindMacro('ctrl', ['mod', 'modifier']);
	}

	// a-z and A-Z
	for (let keyCode = 65; keyCode <= 90; keyCode += 1) {
		let keyName = String.fromCharCode(keyCode + 32);
		let capitalKeyName = String.fromCharCode(keyCode);
		ctx.bindKeyCode(keyCode, keyName);
		ctx.bindMacro('shift + ' + keyName, capitalKeyName);
		ctx.bindMacro('capslock + ' + keyName, capitalKeyName);
	}

	// browser caveats
	let semicolonKeyCode = isFirefox ? 59 : 186;
	let dashKeyCode = isFirefox ? 173 : 189;
	let equalKeyCode = isFirefox ? 61 : 187;

	let leftCommandKeyCode = 91;
	let rightCommandKeyCode = 93;
	
	if (isMac) {
		if (isOpera) {
			leftCommandKeyCode = 17;
			rightCommandKeyCode = 17;
		} else if (isFirefox) {
			leftCommandKeyCode = 224;
			rightCommandKeyCode = 224;
		}
	}

	ctx.bindKeyCode(semicolonKeyCode, ['semicolon', ';']);
	ctx.bindKeyCode(dashKeyCode, ['dash', '-']);
	ctx.bindKeyCode(equalKeyCode, ['equal', 'equalsign', '=']);
	ctx.bindKeyCode(leftCommandKeyCode, ['command', 'windows', 'win', 'super', 'leftcommand', 'leftwindows', 'leftwin', 'leftsuper']);
	ctx.bindKeyCode(rightCommandKeyCode, ['command', 'windows', 'win', 'super', 'rightcommand', 'rightwindows', 'rightwin', 'rightsuper']);

	// kill keys
	ctx.setKillKey('command');
};

export default localeBuilder;
