/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/renderer.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/renderer.ts":
/*!******************************!*\
  !*** ./frontend/renderer.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var randomstring__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! randomstring */ \"./node_modules/randomstring/index.js\");\n/* harmony import */ var randomstring__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(randomstring__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst handles = document.querySelectorAll(\".handle\");\nconst handleWrapper = document.getElementById(\"handle-wrapper\");\nconst mainImageContainer = (document.getElementById(\"main-image\"));\nconst stage = document.getElementById(\"stage\");\nconst canvas = document.getElementById(\"lines\");\nconst ctx = canvas.getContext(\"2d\");\nstage.addEventListener(\"dragover\", e => {\n    if (e.target !== stage)\n        return;\n    e.preventDefault();\n    const file = e.dataTransfer.items[0];\n    if ([\"image/jpeg\"].includes(file.type)) {\n        stage.classList.add(\"drag\");\n    }\n    else {\n        stage.classList.add(\"error\");\n    }\n});\nstage.addEventListener(\"dragleave\", e => {\n    stage.classList.remove(\"drag\");\n    stage.classList.remove(\"error\");\n});\nstage.addEventListener(\"dragend\", e => {\n    stage.classList.remove(\"drag\");\n    stage.classList.remove(\"error\");\n});\nstage.addEventListener(\"drop\", e => {\n    const file = e.dataTransfer.files[0];\n    if ([\"image/jpeg\"].includes(file.type)) {\n        electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcRenderer\"].send(\"open-file\", file.path);\n    }\n    else {\n        alert(\"No bueno!\");\n    }\n    stage.classList.remove(\"drag\");\n    stage.classList.remove(\"error\");\n    e.preventDefault();\n});\nfunction convertCurrentSelection() {\n    const nw = document.getElementById(\"main-image\")\n        .naturalWidth;\n    const nh = document.getElementById(\"main-image\")\n        .naturalHeight;\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcRenderer\"].send(\"convert-full\", getSkewCoordinates(1), nw, nh);\n}\nfunction previewCurrentSelection() {\n    document.getElementById(\"preview-image\").src = \"\";\n    document.getElementById(\"preview-image\").classList.add(\"pending\");\n    document.getElementById(\"preview-spinner\").classList.add(\"active\");\n    const nw = document.getElementById(\"main-image\")\n        .naturalWidth;\n    const nh = document.getElementById(\"main-image\")\n        .naturalHeight;\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcRenderer\"].send(\"convert-preview\", `skewbacca_${randomstring__WEBPACK_IMPORTED_MODULE_1___default.a.generate(8)}.jpg`, getSkewCoordinates(0.2), nw * 0.2, nh * 0.2);\n}\nfunction openFile(file) {\n    mainImageContainer.src = file;\n    mainImageContainer.addEventListener(\"dragstart\", e => {\n        e.preventDefault();\n    });\n    handleWrapper.style.opacity = \"1\";\n    setTimeout(() => {\n        canvas.setAttribute(\"width\", `${handleWrapper.offsetWidth}`);\n        canvas.setAttribute(\"height\", `${handleWrapper.offsetHeight}`);\n        drawLines();\n    }, 10);\n}\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcRenderer\"].on(\"log\", (_, log, __) => {\n    console.log(log);\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcRenderer\"].on(\"file-opened\", (_event, file, _content) => {\n    openFile(file);\n});\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcRenderer\"].on(\"save-intent\", convertCurrentSelection);\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"ipcRenderer\"].on(\"file-saved\", (event, targetFileName) => {\n    console.log(targetFileName);\n    (document.getElementById(\"preview-image\")).src = targetFileName;\n    document.getElementById(\"preview-image\").classList.remove(\"pending\");\n    document.getElementById(\"preview-spinner\").classList.remove(\"active\");\n});\nhandles.forEach(handle => {\n    handle.addEventListener(\"dragend\", (e) => {\n        if (!e.pageX && !e.pageY)\n            return;\n        e.target.style.left =\n            e.pageX - handleWrapper.offsetLeft + \"px\";\n        e.target.style.top =\n            e.pageY - handleWrapper.offsetTop + \"px\";\n        e.target.classList.remove(\"dragged\");\n        previewCurrentSelection();\n    });\n    handle.addEventListener(\"drag\", (e) => {\n        if (!e.pageX && !e.pageY)\n            return;\n        e.target.style.left =\n            e.pageX - handleWrapper.offsetLeft + \"px\";\n        e.target.style.top =\n            e.pageY - handleWrapper.offsetTop + \"px\";\n        drawLines();\n    });\n    handle.addEventListener(\"dragstart\", (e) => {\n        const img = document.createElement(\"span\");\n        img.style.display = \"none\";\n        e.dataTransfer.setDragImage(img, 0, 0);\n        e.target.classList.add(\"dragged\");\n    });\n});\nfunction getSkewCoordinates(scale) {\n    const TLX = percX(document.getElementById(\"topleft\").offsetLeft, scale);\n    const TLY = percY(document.getElementById(\"topleft\").offsetTop, scale);\n    const TRX = percX(document.getElementById(\"topright\").offsetLeft, scale);\n    const TRY = percY(document.getElementById(\"topright\").offsetTop, scale);\n    const BRX = percX(document.getElementById(\"bottomright\").offsetLeft, scale);\n    const BRY = percY(document.getElementById(\"bottomright\").offsetTop, scale);\n    const BLX = percX(document.getElementById(\"bottomleft\").offsetLeft, scale);\n    const BLY = percY(document.getElementById(\"bottomleft\").offsetTop, scale);\n    return { TLX, TLY, TRX, TRY, BRX, BRY, BLX, BLY };\n}\nfunction percX(n, scale) {\n    const nat = document.getElementById(\"main-image\")\n        .naturalWidth;\n    return (n / handleWrapper.getBoundingClientRect().width) * (nat * scale);\n}\nfunction percY(n, scale) {\n    const nat = document.getElementById(\"main-image\")\n        .naturalHeight;\n    return (n / handleWrapper.getBoundingClientRect().height) * (nat * scale);\n}\nfunction drawLines() {\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    ctx.strokeStyle = \"#FF0000\";\n    ctx.lineWidth = 1;\n    const TLX = document.getElementById(\"topleft\").offsetLeft;\n    const TLY = document.getElementById(\"topleft\").offsetTop;\n    const TRX = document.getElementById(\"topright\").offsetLeft;\n    const TRY = document.getElementById(\"topright\").offsetTop;\n    const BRX = document.getElementById(\"bottomright\").offsetLeft;\n    const BRY = document.getElementById(\"bottomright\").offsetTop;\n    const BLX = document.getElementById(\"bottomleft\").offsetLeft;\n    const BLY = document.getElementById(\"bottomleft\").offsetTop;\n    ctx.beginPath();\n    ctx.lineTo(TLX, TLY);\n    ctx.lineTo(TRX, TRY);\n    ctx.lineTo(BRX, BRY);\n    ctx.lineTo(BLX, BLY);\n    ctx.lineTo(TLX, TLY);\n    ctx.stroke();\n}\n\n\n//# sourceURL=webpack:///./frontend/renderer.ts?");

/***/ }),

/***/ "./node_modules/array-uniq/index.js":
/*!******************************************!*\
  !*** ./node_modules/array-uniq/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// there's 3 implementations written in increasing order of efficiency\n\n// 1 - no Set type is defined\nfunction uniqNoSet(arr) {\n\tvar ret = [];\n\n\tfor (var i = 0; i < arr.length; i++) {\n\t\tif (ret.indexOf(arr[i]) === -1) {\n\t\t\tret.push(arr[i]);\n\t\t}\n\t}\n\n\treturn ret;\n}\n\n// 2 - a simple Set type is defined\nfunction uniqSet(arr) {\n\tvar seen = new Set();\n\treturn arr.filter(function (el) {\n\t\tif (!seen.has(el)) {\n\t\t\tseen.add(el);\n\t\t\treturn true;\n\t\t}\n\t});\n}\n\n// 3 - a standard Set type is defined and it has a forEach method\nfunction uniqSetWithForEach(arr) {\n\tvar ret = [];\n\n\t(new Set(arr)).forEach(function (el) {\n\t\tret.push(el);\n\t});\n\n\treturn ret;\n}\n\n// V8 currently has a broken implementation\n// https://github.com/joyent/node/issues/8449\nfunction doesForEachActuallyWork() {\n\tvar ret = false;\n\n\t(new Set([true])).forEach(function (el) {\n\t\tret = el;\n\t});\n\n\treturn ret === true;\n}\n\nif ('Set' in global) {\n\tif (typeof Set.prototype.forEach === 'function' && doesForEachActuallyWork()) {\n\t\tmodule.exports = uniqSetWithForEach;\n\t} else {\n\t\tmodule.exports = uniqSet;\n\t}\n} else {\n\tmodule.exports = uniqNoSet;\n}\n\n\n//# sourceURL=webpack:///./node_modules/array-uniq/index.js?");

/***/ }),

/***/ "./node_modules/randomstring/index.js":
/*!********************************************!*\
  !*** ./node_modules/randomstring/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./lib/randomstring */ \"./node_modules/randomstring/lib/randomstring.js\");\n\n//# sourceURL=webpack:///./node_modules/randomstring/index.js?");

/***/ }),

/***/ "./node_modules/randomstring/lib/charset.js":
/*!**************************************************!*\
  !*** ./node_modules/randomstring/lib/charset.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var arrayUniq = __webpack_require__(/*! array-uniq */ \"./node_modules/array-uniq/index.js\");\n\nfunction Charset() {\n  this.chars = '';\n}\n\nCharset.prototype.setType = function(type) {\n  var chars;\n  \n  var numbers    = '0123456789';\n  var charsLower = 'abcdefghijklmnopqrstuvwxyz';\n  var charsUpper = charsLower.toUpperCase();\n  var hexChars   = 'abcdef';\n  \n  if (type === 'alphanumeric') {\n    chars = numbers + charsLower + charsUpper;\n  }\n  else if (type === 'numeric') {\n    chars = numbers;\n  }\n  else if (type === 'alphabetic') {\n    chars = charsLower + charsUpper;\n  }\n  else if (type === 'hex') {\n    chars = numbers + hexChars;\n  }\n  else {\n    chars = type;\n  }\n  \n  this.chars = chars;\n}\n\nCharset.prototype.removeUnreadable = function() {\n  var unreadableChars = /[0OIl]/g;\n  this.chars = this.chars.replace(unreadableChars, '');\n}\n\nCharset.prototype.setcapitalization = function(capitalization) {\n  if (capitalization === 'uppercase') {\n    this.chars = this.chars.toUpperCase();\n  }\n  else if (capitalization === 'lowercase') {\n    this.chars = this.chars.toLowerCase();\n  }\n}\n\nCharset.prototype.removeDuplicates = function() {\n  var charMap = this.chars.split('');\n  charMap = arrayUniq(charMap);\n  this.chars = charMap.join('');\n}\n\nmodule.exports = exports = Charset;\n\n//# sourceURL=webpack:///./node_modules/randomstring/lib/charset.js?");

/***/ }),

/***/ "./node_modules/randomstring/lib/randomstring.js":
/*!*******************************************************!*\
  !*** ./node_modules/randomstring/lib/randomstring.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar crypto  = __webpack_require__(/*! crypto */ \"crypto\");\nvar Charset = __webpack_require__(/*! ./charset.js */ \"./node_modules/randomstring/lib/charset.js\");\n\nfunction safeRandomBytes(length) {\n  while (true) {\n    try {\n      return crypto.randomBytes(length);\n    } catch(e) {\n      continue;\n    }\n  }\n}\n\nexports.generate = function(options) {\n  \n  var charset = new Charset();\n  \n  var length, chars, capitalization, string = '';\n  \n  // Handle options\n  if (typeof options === 'object') {\n    length = options.length || 32;\n    \n    if (options.charset) {\n      charset.setType(options.charset);\n    }\n    else {\n      charset.setType('alphanumeric');\n    }\n    \n    if (options.capitalization) {\n      charset.setcapitalization(options.capitalization);\n    }\n    \n    if (options.readable) {\n      charset.removeUnreadable();\n    }\n    \n    charset.removeDuplicates();\n  }\n  else if (typeof options === 'number') {\n    length = options;\n    charset.setType('alphanumeric');\n  }\n  else {\n    length = 32;\n    charset.setType('alphanumeric');\n  }\n  \n  // Generate the string\n  var charsLen = charset.chars.length;\n  var maxByte = 256 - (256 % charsLen);\n  while (length > 0) {\n    var buf = safeRandomBytes(Math.ceil(length * 256 / maxByte));\n    for (var i = 0; i < buf.length && length > 0; i++) {\n      var randomByte = buf.readUInt8(i);\n      if (randomByte < maxByte) {\n        string += charset.chars.charAt(randomByte % charsLen);\n        length--;\n      }\n    }\n  }\n\n  return string;\n};\n\n\n//# sourceURL=webpack:///./node_modules/randomstring/lib/randomstring.js?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ })

/******/ });