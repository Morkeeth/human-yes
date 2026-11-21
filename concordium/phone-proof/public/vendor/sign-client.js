var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn3, res) => function __init() {
  return fn3 && (res = (0, fn3[__getOwnPropNames(fn3)[0]])(fn3 = 0)), res;
};
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to4, from8, except, desc) => {
  if (from8 && typeof from8 === "object" || typeof from8 === "function") {
    for (let key of __getOwnPropNames(from8))
      if (!__hasOwnProp.call(to4, key) && key !== except)
        __defProp(to4, key, { get: () => from8[key], enumerable: !(desc = __getOwnPropDesc(from8, key)) || desc.enumerable });
  }
  return to4;
};
var __reExport = (target, mod2, secondTarget) => (__copyProps(target, mod2, "default"), secondTarget && __copyProps(secondTarget, mod2, "default"));
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// node_modules/events/events.js
var require_events = __commonJS({
  "node_modules/events/events.js"(exports, module) {
    "use strict";
    var R4 = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R4 && typeof R4.apply === "function" ? R4.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R4 && typeof R4.ownKeys === "function") {
      ReflectOwnKeys = R4.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    module.exports = EventEmitter;
    module.exports.once = once;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n5) {
      if (typeof n5 !== "number" || n5 < 0 || NumberIsNaN(n5)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n5 + ".");
      }
      this._maxListeners = n5;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i3 = 1; i3 < arguments.length; i3++) args.push(arguments[i3]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er3;
        if (args.length > 0)
          er3 = args[0];
        if (er3 instanceof Error) {
          throw er3;
        }
        var err = new Error("Unhandled error." + (er3 ? " (" + er3.message + ")" : ""));
        err.context = er3;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i3 = 0; i3 < len; ++i3)
          ReflectApply(listeners[i3], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m3;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m3 = _getMaxListeners(target);
        if (m3 > 0 && existing.length > m3 && !existing.warned) {
          existing.warned = true;
          var w3 = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w3.name = "MaxListenersExceededWarning";
          w3.emitter = target;
          w3.type = type;
          w3.count = existing.length;
          ProcessEmitWarning(w3);
        }
      }
      return target;
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i3, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i3 = list.length - 1; i3 >= 0; i3--) {
          if (list[i3] === listener || list[i3].listener === listener) {
            originalListener = list[i3].listener;
            position = i3;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i3;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys2 = Object.keys(events);
        var key;
        for (i3 = 0; i3 < keys2.length; ++i3) {
          key = keys2[i3];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i3 = listeners.length - 1; i3 >= 0; i3--) {
          this.removeListener(type, listeners[i3]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n5) {
      var copy = new Array(n5);
      for (var i3 = 0; i3 < n5; ++i3)
        copy[i3] = arr[i3];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i3 = 0; i3 < ret.length; ++i3) {
        ret[i3] = arr[i3].listener || arr[i3];
      }
      return ret;
    }
    function once(emitter, name2) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name2, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name2, resolver, { once: true });
        if (name2 !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name2, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name2, listener);
        } else {
          emitter.on(name2, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name2, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name2, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// node_modules/tslib/tslib.es6.js
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __read: () => __read,
  __rest: () => __rest,
  __spread: () => __spread,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values
});
function __extends(d4, b5) {
  extendStatics(d4, b5);
  function __() {
    this.constructor = d4;
  }
  d4.prototype = b5 === null ? Object.create(b5) : (__.prototype = b5.prototype, new __());
}
function __rest(s2, e2) {
  var t = {};
  for (var p3 in s2) if (Object.prototype.hasOwnProperty.call(s2, p3) && e2.indexOf(p3) < 0)
    t[p3] = s2[p3];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i3 = 0, p3 = Object.getOwnPropertySymbols(s2); i3 < p3.length; i3++) {
      if (e2.indexOf(p3[i3]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p3[i3]))
        t[p3[i3]] = s2[p3[i3]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c5 = arguments.length, r3 = c5 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d4;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r3 = Reflect.decorate(decorators, target, key, desc);
  else for (var i3 = decorators.length - 1; i3 >= 0; i3--) if (d4 = decorators[i3]) r3 = (c5 < 3 ? d4(r3) : c5 > 3 ? d4(target, key, r3) : d4(target, key)) || r3;
  return c5 > 3 && r3 && Object.defineProperty(target, key, r3), r3;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P5, generator) {
  function adopt(value) {
    return value instanceof P5 ? value : new P5(function(resolve) {
      resolve(value);
    });
  }
  return new (P5 || (P5 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e2) {
        reject(e2);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _3 = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f4, y4, t, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n5) {
    return function(v5) {
      return step([n5, v5]);
    };
  }
  function step(op) {
    if (f4) throw new TypeError("Generator is already executing.");
    while (_3) try {
      if (f4 = 1, y4 && (t = op[0] & 2 ? y4["return"] : op[0] ? y4["throw"] || ((t = y4["return"]) && t.call(y4), 0) : y4.next) && !(t = t.call(y4, op[1])).done) return t;
      if (y4 = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _3.label++;
          return { value: op[1], done: false };
        case 5:
          _3.label++;
          y4 = op[1];
          op = [0];
          continue;
        case 7:
          op = _3.ops.pop();
          _3.trys.pop();
          continue;
        default:
          if (!(t = _3.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _3 = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _3.label = op[1];
            break;
          }
          if (op[0] === 6 && _3.label < t[1]) {
            _3.label = t[1];
            t = op;
            break;
          }
          if (t && _3.label < t[2]) {
            _3.label = t[2];
            _3.ops.push(op);
            break;
          }
          if (t[2]) _3.ops.pop();
          _3.trys.pop();
          continue;
      }
      op = body.call(thisArg, _3);
    } catch (e2) {
      op = [6, e2];
      y4 = 0;
    } finally {
      f4 = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding(o4, m3, k4, k22) {
  if (k22 === void 0) k22 = k4;
  o4[k22] = m3[k4];
}
function __exportStar(m3, exports) {
  for (var p3 in m3) if (p3 !== "default" && !exports.hasOwnProperty(p3)) exports[p3] = m3[p3];
}
function __values(o4) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m3 = s2 && o4[s2], i3 = 0;
  if (m3) return m3.call(o4);
  if (o4 && typeof o4.length === "number") return {
    next: function() {
      if (o4 && i3 >= o4.length) o4 = void 0;
      return { value: o4 && o4[i3++], done: !o4 };
    }
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o4, n5) {
  var m3 = typeof Symbol === "function" && o4[Symbol.iterator];
  if (!m3) return o4;
  var i3 = m3.call(o4), r3, ar4 = [], e2;
  try {
    while ((n5 === void 0 || n5-- > 0) && !(r3 = i3.next()).done) ar4.push(r3.value);
  } catch (error) {
    e2 = { error };
  } finally {
    try {
      if (r3 && !r3.done && (m3 = i3["return"])) m3.call(i3);
    } finally {
      if (e2) throw e2.error;
    }
  }
  return ar4;
}
function __spread() {
  for (var ar4 = [], i3 = 0; i3 < arguments.length; i3++)
    ar4 = ar4.concat(__read(arguments[i3]));
  return ar4;
}
function __spreadArrays() {
  for (var s2 = 0, i3 = 0, il = arguments.length; i3 < il; i3++) s2 += arguments[i3].length;
  for (var r3 = Array(s2), k4 = 0, i3 = 0; i3 < il; i3++)
    for (var a3 = arguments[i3], j6 = 0, jl = a3.length; j6 < jl; j6++, k4++)
      r3[k4] = a3[j6];
  return r3;
}
function __await(v5) {
  return this instanceof __await ? (this.v = v5, this) : new __await(v5);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g2 = generator.apply(thisArg, _arguments || []), i3, q3 = [];
  return i3 = {}, verb("next"), verb("throw"), verb("return"), i3[Symbol.asyncIterator] = function() {
    return this;
  }, i3;
  function verb(n5) {
    if (g2[n5]) i3[n5] = function(v5) {
      return new Promise(function(a3, b5) {
        q3.push([n5, v5, a3, b5]) > 1 || resume(n5, v5);
      });
    };
  }
  function resume(n5, v5) {
    try {
      step(g2[n5](v5));
    } catch (e2) {
      settle(q3[0][3], e2);
    }
  }
  function step(r3) {
    r3.value instanceof __await ? Promise.resolve(r3.value.v).then(fulfill, reject) : settle(q3[0][2], r3);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f4, v5) {
    if (f4(v5), q3.shift(), q3.length) resume(q3[0][0], q3[0][1]);
  }
}
function __asyncDelegator(o4) {
  var i3, p3;
  return i3 = {}, verb("next"), verb("throw", function(e2) {
    throw e2;
  }), verb("return"), i3[Symbol.iterator] = function() {
    return this;
  }, i3;
  function verb(n5, f4) {
    i3[n5] = o4[n5] ? function(v5) {
      return (p3 = !p3) ? { value: __await(o4[n5](v5)), done: n5 === "return" } : f4 ? f4(v5) : v5;
    } : f4;
  }
}
function __asyncValues(o4) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m3 = o4[Symbol.asyncIterator], i3;
  return m3 ? m3.call(o4) : (o4 = typeof __values === "function" ? __values(o4) : o4[Symbol.iterator](), i3 = {}, verb("next"), verb("throw"), verb("return"), i3[Symbol.asyncIterator] = function() {
    return this;
  }, i3);
  function verb(n5) {
    i3[n5] = o4[n5] && function(v5) {
      return new Promise(function(resolve, reject) {
        v5 = o4[n5](v5), settle(resolve, reject, v5.done, v5.value);
      });
    };
  }
  function settle(resolve, reject, d4, v5) {
    Promise.resolve(v5).then(function(v6) {
      resolve({ value: v6, done: d4 });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod2) {
  if (mod2 && mod2.__esModule) return mod2;
  var result = {};
  if (mod2 != null) {
    for (var k4 in mod2) if (Object.hasOwnProperty.call(mod2, k4)) result[k4] = mod2[k4];
  }
  result.default = mod2;
  return result;
}
function __importDefault(mod2) {
  return mod2 && mod2.__esModule ? mod2 : { default: mod2 };
}
function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
var extendStatics, __assign;
var init_tslib_es6 = __esm({
  "node_modules/tslib/tslib.es6.js"() {
    extendStatics = function(d4, b5) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d5, b6) {
        d5.__proto__ = b6;
      } || function(d5, b6) {
        for (var p3 in b6) if (b6.hasOwnProperty(p3)) d5[p3] = b6[p3];
      };
      return extendStatics(d4, b5);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s2, i3 = 1, n5 = arguments.length; i3 < n5; i3++) {
          s2 = arguments[i3];
          for (var p3 in s2) if (Object.prototype.hasOwnProperty.call(s2, p3)) t[p3] = s2[p3];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
  }
});

// node_modules/@walletconnect/time/dist/cjs/utils/delay.js
var require_delay = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/utils/delay.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.delay = void 0;
    function delay(timeout) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, timeout);
      });
    }
    exports.delay = delay;
  }
});

// node_modules/@walletconnect/time/dist/cjs/constants/misc.js
var require_misc = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/constants/misc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ONE_THOUSAND = exports.ONE_HUNDRED = void 0;
    exports.ONE_HUNDRED = 100;
    exports.ONE_THOUSAND = 1e3;
  }
});

// node_modules/@walletconnect/time/dist/cjs/constants/time.js
var require_time = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/constants/time.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ONE_YEAR = exports.FOUR_WEEKS = exports.THREE_WEEKS = exports.TWO_WEEKS = exports.ONE_WEEK = exports.THIRTY_DAYS = exports.SEVEN_DAYS = exports.FIVE_DAYS = exports.THREE_DAYS = exports.ONE_DAY = exports.TWENTY_FOUR_HOURS = exports.TWELVE_HOURS = exports.SIX_HOURS = exports.THREE_HOURS = exports.ONE_HOUR = exports.SIXTY_MINUTES = exports.THIRTY_MINUTES = exports.TEN_MINUTES = exports.FIVE_MINUTES = exports.ONE_MINUTE = exports.SIXTY_SECONDS = exports.THIRTY_SECONDS = exports.TEN_SECONDS = exports.FIVE_SECONDS = exports.ONE_SECOND = void 0;
    exports.ONE_SECOND = 1;
    exports.FIVE_SECONDS = 5;
    exports.TEN_SECONDS = 10;
    exports.THIRTY_SECONDS = 30;
    exports.SIXTY_SECONDS = 60;
    exports.ONE_MINUTE = exports.SIXTY_SECONDS;
    exports.FIVE_MINUTES = exports.ONE_MINUTE * 5;
    exports.TEN_MINUTES = exports.ONE_MINUTE * 10;
    exports.THIRTY_MINUTES = exports.ONE_MINUTE * 30;
    exports.SIXTY_MINUTES = exports.ONE_MINUTE * 60;
    exports.ONE_HOUR = exports.SIXTY_MINUTES;
    exports.THREE_HOURS = exports.ONE_HOUR * 3;
    exports.SIX_HOURS = exports.ONE_HOUR * 6;
    exports.TWELVE_HOURS = exports.ONE_HOUR * 12;
    exports.TWENTY_FOUR_HOURS = exports.ONE_HOUR * 24;
    exports.ONE_DAY = exports.TWENTY_FOUR_HOURS;
    exports.THREE_DAYS = exports.ONE_DAY * 3;
    exports.FIVE_DAYS = exports.ONE_DAY * 5;
    exports.SEVEN_DAYS = exports.ONE_DAY * 7;
    exports.THIRTY_DAYS = exports.ONE_DAY * 30;
    exports.ONE_WEEK = exports.SEVEN_DAYS;
    exports.TWO_WEEKS = exports.ONE_WEEK * 2;
    exports.THREE_WEEKS = exports.ONE_WEEK * 3;
    exports.FOUR_WEEKS = exports.ONE_WEEK * 4;
    exports.ONE_YEAR = exports.ONE_DAY * 365;
  }
});

// node_modules/@walletconnect/time/dist/cjs/constants/index.js
var require_constants = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/constants/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_misc(), exports);
    tslib_1.__exportStar(require_time(), exports);
  }
});

// node_modules/@walletconnect/time/dist/cjs/utils/convert.js
var require_convert = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/utils/convert.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromMiliseconds = exports.toMiliseconds = void 0;
    var constants_1 = require_constants();
    function toMiliseconds(seconds) {
      return seconds * constants_1.ONE_THOUSAND;
    }
    exports.toMiliseconds = toMiliseconds;
    function fromMiliseconds(miliseconds) {
      return Math.floor(miliseconds / constants_1.ONE_THOUSAND);
    }
    exports.fromMiliseconds = fromMiliseconds;
  }
});

// node_modules/@walletconnect/time/dist/cjs/utils/index.js
var require_utils = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/utils/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_delay(), exports);
    tslib_1.__exportStar(require_convert(), exports);
  }
});

// node_modules/@walletconnect/time/dist/cjs/watch.js
var require_watch = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/watch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Watch = void 0;
    var Watch = class {
      constructor() {
        this.timestamps = /* @__PURE__ */ new Map();
      }
      start(label) {
        if (this.timestamps.has(label)) {
          throw new Error(`Watch already started for label: ${label}`);
        }
        this.timestamps.set(label, { started: Date.now() });
      }
      stop(label) {
        const timestamp = this.get(label);
        if (typeof timestamp.elapsed !== "undefined") {
          throw new Error(`Watch already stopped for label: ${label}`);
        }
        const elapsed = Date.now() - timestamp.started;
        this.timestamps.set(label, { started: timestamp.started, elapsed });
      }
      get(label) {
        const timestamp = this.timestamps.get(label);
        if (typeof timestamp === "undefined") {
          throw new Error(`No timestamp found for label: ${label}`);
        }
        return timestamp;
      }
      elapsed(label) {
        const timestamp = this.get(label);
        const elapsed = timestamp.elapsed || Date.now() - timestamp.started;
        return elapsed;
      }
    };
    exports.Watch = Watch;
    exports.default = Watch;
  }
});

// node_modules/@walletconnect/time/dist/cjs/types/watch.js
var require_watch2 = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/types/watch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IWatch = void 0;
    var IWatch = class {
    };
    exports.IWatch = IWatch;
  }
});

// node_modules/@walletconnect/time/dist/cjs/types/index.js
var require_types = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/types/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_watch2(), exports);
  }
});

// node_modules/@walletconnect/time/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/@walletconnect/time/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_utils(), exports);
    tslib_1.__exportStar(require_watch(), exports);
    tslib_1.__exportStar(require_types(), exports);
    tslib_1.__exportStar(require_constants(), exports);
  }
});

// node_modules/@walletconnect/window-getters/dist/cjs/index.js
var require_cjs2 = __commonJS({
  "node_modules/@walletconnect/window-getters/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLocalStorage = exports.getLocalStorageOrThrow = exports.getCrypto = exports.getCryptoOrThrow = exports.getLocation = exports.getLocationOrThrow = exports.getNavigator = exports.getNavigatorOrThrow = exports.getDocument = exports.getDocumentOrThrow = exports.getFromWindowOrThrow = exports.getFromWindow = void 0;
    function getFromWindow(name2) {
      let res = void 0;
      if (typeof window !== "undefined" && typeof window[name2] !== "undefined") {
        res = window[name2];
      }
      return res;
    }
    exports.getFromWindow = getFromWindow;
    function getFromWindowOrThrow(name2) {
      const res = getFromWindow(name2);
      if (!res) {
        throw new Error(`${name2} is not defined in Window`);
      }
      return res;
    }
    exports.getFromWindowOrThrow = getFromWindowOrThrow;
    function getDocumentOrThrow() {
      return getFromWindowOrThrow("document");
    }
    exports.getDocumentOrThrow = getDocumentOrThrow;
    function getDocument() {
      return getFromWindow("document");
    }
    exports.getDocument = getDocument;
    function getNavigatorOrThrow() {
      return getFromWindowOrThrow("navigator");
    }
    exports.getNavigatorOrThrow = getNavigatorOrThrow;
    function getNavigator() {
      return getFromWindow("navigator");
    }
    exports.getNavigator = getNavigator;
    function getLocationOrThrow() {
      return getFromWindowOrThrow("location");
    }
    exports.getLocationOrThrow = getLocationOrThrow;
    function getLocation() {
      return getFromWindow("location");
    }
    exports.getLocation = getLocation;
    function getCryptoOrThrow() {
      return getFromWindowOrThrow("crypto");
    }
    exports.getCryptoOrThrow = getCryptoOrThrow;
    function getCrypto() {
      return getFromWindow("crypto");
    }
    exports.getCrypto = getCrypto;
    function getLocalStorageOrThrow() {
      return getFromWindowOrThrow("localStorage");
    }
    exports.getLocalStorageOrThrow = getLocalStorageOrThrow;
    function getLocalStorage() {
      return getFromWindow("localStorage");
    }
    exports.getLocalStorage = getLocalStorage;
  }
});

// node_modules/@walletconnect/window-metadata/dist/cjs/index.js
var require_cjs3 = __commonJS({
  "node_modules/@walletconnect/window-metadata/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getWindowMetadata = void 0;
    var window_getters_1 = require_cjs2();
    function getWindowMetadata() {
      let doc;
      let loc;
      try {
        doc = window_getters_1.getDocumentOrThrow();
        loc = window_getters_1.getLocationOrThrow();
      } catch (e2) {
        return null;
      }
      function getIcons() {
        const links = doc.getElementsByTagName("link");
        const icons2 = [];
        for (let i3 = 0; i3 < links.length; i3++) {
          const link = links[i3];
          const rel = link.getAttribute("rel");
          if (rel) {
            if (rel.toLowerCase().indexOf("icon") > -1) {
              const href = link.getAttribute("href");
              if (href) {
                if (href.toLowerCase().indexOf("https:") === -1 && href.toLowerCase().indexOf("http:") === -1 && href.indexOf("//") !== 0) {
                  let absoluteHref = loc.protocol + "//" + loc.host;
                  if (href.indexOf("/") === 0) {
                    absoluteHref += href;
                  } else {
                    const path = loc.pathname.split("/");
                    path.pop();
                    const finalPath = path.join("/");
                    absoluteHref += finalPath + "/" + href;
                  }
                  icons2.push(absoluteHref);
                } else if (href.indexOf("//") === 0) {
                  const absoluteUrl = loc.protocol + href;
                  icons2.push(absoluteUrl);
                } else {
                  icons2.push(href);
                }
              }
            }
          }
        }
        return icons2;
      }
      function getWindowMetadataOfAny(...args) {
        const metaTags = doc.getElementsByTagName("meta");
        for (let i3 = 0; i3 < metaTags.length; i3++) {
          const tag = metaTags[i3];
          const attributes = ["itemprop", "property", "name"].map((target) => tag.getAttribute(target)).filter((attr) => {
            if (attr) {
              return args.includes(attr);
            }
            return false;
          });
          if (attributes.length && attributes) {
            const content = tag.getAttribute("content");
            if (content) {
              return content;
            }
          }
        }
        return "";
      }
      function getName() {
        let name3 = getWindowMetadataOfAny("name", "og:site_name", "og:title", "twitter:title");
        if (!name3) {
          name3 = doc.title;
        }
        return name3;
      }
      function getDescription() {
        const description2 = getWindowMetadataOfAny("description", "og:description", "twitter:description", "keywords");
        return description2;
      }
      const name2 = getName();
      const description = getDescription();
      const url = loc.origin;
      const icons = getIcons();
      const meta = {
        description,
        url,
        icons,
        name: name2
      };
      return meta;
    }
    exports.getWindowMetadata = getWindowMetadata;
  }
});

// node_modules/blakejs/util.js
var require_util = __commonJS({
  "node_modules/blakejs/util.js"(exports, module) {
    var ERROR_MSG_INPUT = "Input must be an string, Buffer or Uint8Array";
    function normalizeInput(input) {
      let ret;
      if (input instanceof Uint8Array) {
        ret = input;
      } else if (typeof input === "string") {
        const encoder2 = new TextEncoder();
        ret = encoder2.encode(input);
      } else {
        throw new Error(ERROR_MSG_INPUT);
      }
      return ret;
    }
    function toHex3(bytes) {
      return Array.prototype.map.call(bytes, function(n5) {
        return (n5 < 16 ? "0" : "") + n5.toString(16);
      }).join("");
    }
    function uint32ToHex(val) {
      return (4294967296 + val).toString(16).substring(1);
    }
    function debugPrint(label, arr, size3) {
      let msg = "\n" + label + " = ";
      for (let i3 = 0; i3 < arr.length; i3 += 2) {
        if (size3 === 32) {
          msg += uint32ToHex(arr[i3]).toUpperCase();
          msg += " ";
          msg += uint32ToHex(arr[i3 + 1]).toUpperCase();
        } else if (size3 === 64) {
          msg += uint32ToHex(arr[i3 + 1]).toUpperCase();
          msg += uint32ToHex(arr[i3]).toUpperCase();
        } else throw new Error("Invalid size " + size3);
        if (i3 % 6 === 4) {
          msg += "\n" + new Array(label.length + 4).join(" ");
        } else if (i3 < arr.length - 2) {
          msg += " ";
        }
      }
      console.log(msg);
    }
    function testSpeed(hashFn, N12, M4) {
      let startMs = (/* @__PURE__ */ new Date()).getTime();
      const input = new Uint8Array(N12);
      for (let i3 = 0; i3 < N12; i3++) {
        input[i3] = i3 % 256;
      }
      const genMs = (/* @__PURE__ */ new Date()).getTime();
      console.log("Generated random input in " + (genMs - startMs) + "ms");
      startMs = genMs;
      for (let i3 = 0; i3 < M4; i3++) {
        const hashHex = hashFn(input);
        const hashMs = (/* @__PURE__ */ new Date()).getTime();
        const ms2 = hashMs - startMs;
        startMs = hashMs;
        console.log("Hashed in " + ms2 + "ms: " + hashHex.substring(0, 20) + "...");
        console.log(
          Math.round(N12 / (1 << 20) / (ms2 / 1e3) * 100) / 100 + " MB PER SECOND"
        );
      }
    }
    module.exports = {
      normalizeInput,
      toHex: toHex3,
      debugPrint,
      testSpeed
    };
  }
});

// node_modules/blakejs/blake2b.js
var require_blake2b = __commonJS({
  "node_modules/blakejs/blake2b.js"(exports, module) {
    var util = require_util();
    function ADD64AA(v6, a3, b5) {
      const o0 = v6[a3] + v6[b5];
      let o1 = v6[a3 + 1] + v6[b5 + 1];
      if (o0 >= 4294967296) {
        o1++;
      }
      v6[a3] = o0;
      v6[a3 + 1] = o1;
    }
    function ADD64AC(v6, a3, b0, b1) {
      let o0 = v6[a3] + b0;
      if (b0 < 0) {
        o0 += 4294967296;
      }
      let o1 = v6[a3 + 1] + b1;
      if (o0 >= 4294967296) {
        o1++;
      }
      v6[a3] = o0;
      v6[a3 + 1] = o1;
    }
    function B2B_GET32(arr, i3) {
      return arr[i3] ^ arr[i3 + 1] << 8 ^ arr[i3 + 2] << 16 ^ arr[i3 + 3] << 24;
    }
    function B2B_G(a3, b5, c5, d4, ix, iy) {
      const x0 = m3[ix];
      const x1 = m3[ix + 1];
      const y0 = m3[iy];
      const y1 = m3[iy + 1];
      ADD64AA(v5, a3, b5);
      ADD64AC(v5, a3, x0, x1);
      let xor0 = v5[d4] ^ v5[a3];
      let xor1 = v5[d4 + 1] ^ v5[a3 + 1];
      v5[d4] = xor1;
      v5[d4 + 1] = xor0;
      ADD64AA(v5, c5, d4);
      xor0 = v5[b5] ^ v5[c5];
      xor1 = v5[b5 + 1] ^ v5[c5 + 1];
      v5[b5] = xor0 >>> 24 ^ xor1 << 8;
      v5[b5 + 1] = xor1 >>> 24 ^ xor0 << 8;
      ADD64AA(v5, a3, b5);
      ADD64AC(v5, a3, y0, y1);
      xor0 = v5[d4] ^ v5[a3];
      xor1 = v5[d4 + 1] ^ v5[a3 + 1];
      v5[d4] = xor0 >>> 16 ^ xor1 << 16;
      v5[d4 + 1] = xor1 >>> 16 ^ xor0 << 16;
      ADD64AA(v5, c5, d4);
      xor0 = v5[b5] ^ v5[c5];
      xor1 = v5[b5 + 1] ^ v5[c5 + 1];
      v5[b5] = xor1 >>> 31 ^ xor0 << 1;
      v5[b5 + 1] = xor0 >>> 31 ^ xor1 << 1;
    }
    var BLAKE2B_IV32 = new Uint32Array([
      4089235720,
      1779033703,
      2227873595,
      3144134277,
      4271175723,
      1013904242,
      1595750129,
      2773480762,
      2917565137,
      1359893119,
      725511199,
      2600822924,
      4215389547,
      528734635,
      327033209,
      1541459225
    ]);
    var SIGMA8 = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3
    ];
    var SIGMA82 = new Uint8Array(
      SIGMA8.map(function(x5) {
        return x5 * 2;
      })
    );
    var v5 = new Uint32Array(32);
    var m3 = new Uint32Array(32);
    function blake2bCompress(ctx, last) {
      let i3 = 0;
      for (i3 = 0; i3 < 16; i3++) {
        v5[i3] = ctx.h[i3];
        v5[i3 + 16] = BLAKE2B_IV32[i3];
      }
      v5[24] = v5[24] ^ ctx.t;
      v5[25] = v5[25] ^ ctx.t / 4294967296;
      if (last) {
        v5[28] = ~v5[28];
        v5[29] = ~v5[29];
      }
      for (i3 = 0; i3 < 32; i3++) {
        m3[i3] = B2B_GET32(ctx.b, 4 * i3);
      }
      for (i3 = 0; i3 < 12; i3++) {
        B2B_G(0, 8, 16, 24, SIGMA82[i3 * 16 + 0], SIGMA82[i3 * 16 + 1]);
        B2B_G(2, 10, 18, 26, SIGMA82[i3 * 16 + 2], SIGMA82[i3 * 16 + 3]);
        B2B_G(4, 12, 20, 28, SIGMA82[i3 * 16 + 4], SIGMA82[i3 * 16 + 5]);
        B2B_G(6, 14, 22, 30, SIGMA82[i3 * 16 + 6], SIGMA82[i3 * 16 + 7]);
        B2B_G(0, 10, 20, 30, SIGMA82[i3 * 16 + 8], SIGMA82[i3 * 16 + 9]);
        B2B_G(2, 12, 22, 24, SIGMA82[i3 * 16 + 10], SIGMA82[i3 * 16 + 11]);
        B2B_G(4, 14, 16, 26, SIGMA82[i3 * 16 + 12], SIGMA82[i3 * 16 + 13]);
        B2B_G(6, 8, 18, 28, SIGMA82[i3 * 16 + 14], SIGMA82[i3 * 16 + 15]);
      }
      for (i3 = 0; i3 < 16; i3++) {
        ctx.h[i3] = ctx.h[i3] ^ v5[i3] ^ v5[i3 + 16];
      }
    }
    var parameterBlock = new Uint8Array([
      0,
      0,
      0,
      0,
      //  0: outlen, keylen, fanout, depth
      0,
      0,
      0,
      0,
      //  4: leaf length, sequential mode
      0,
      0,
      0,
      0,
      //  8: node offset
      0,
      0,
      0,
      0,
      // 12: node offset
      0,
      0,
      0,
      0,
      // 16: node depth, inner length, rfu
      0,
      0,
      0,
      0,
      // 20: rfu
      0,
      0,
      0,
      0,
      // 24: rfu
      0,
      0,
      0,
      0,
      // 28: rfu
      0,
      0,
      0,
      0,
      // 32: salt
      0,
      0,
      0,
      0,
      // 36: salt
      0,
      0,
      0,
      0,
      // 40: salt
      0,
      0,
      0,
      0,
      // 44: salt
      0,
      0,
      0,
      0,
      // 48: personal
      0,
      0,
      0,
      0,
      // 52: personal
      0,
      0,
      0,
      0,
      // 56: personal
      0,
      0,
      0,
      0
      // 60: personal
    ]);
    function blake2bInit(outlen, key, salt, personal) {
      if (outlen === 0 || outlen > 64) {
        throw new Error("Illegal output length, expected 0 < length <= 64");
      }
      if (key && key.length > 64) {
        throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
      }
      if (salt && salt.length !== 16) {
        throw new Error("Illegal salt, expected Uint8Array with length is 16");
      }
      if (personal && personal.length !== 16) {
        throw new Error("Illegal personal, expected Uint8Array with length is 16");
      }
      const ctx = {
        b: new Uint8Array(128),
        h: new Uint32Array(16),
        t: 0,
        // input count
        c: 0,
        // pointer within buffer
        outlen
        // output length in bytes
      };
      parameterBlock.fill(0);
      parameterBlock[0] = outlen;
      if (key) parameterBlock[1] = key.length;
      parameterBlock[2] = 1;
      parameterBlock[3] = 1;
      if (salt) parameterBlock.set(salt, 32);
      if (personal) parameterBlock.set(personal, 48);
      for (let i3 = 0; i3 < 16; i3++) {
        ctx.h[i3] = BLAKE2B_IV32[i3] ^ B2B_GET32(parameterBlock, i3 * 4);
      }
      if (key) {
        blake2bUpdate(ctx, key);
        ctx.c = 128;
      }
      return ctx;
    }
    function blake2bUpdate(ctx, input) {
      for (let i3 = 0; i3 < input.length; i3++) {
        if (ctx.c === 128) {
          ctx.t += ctx.c;
          blake2bCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i3];
      }
    }
    function blake2bFinal(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 128) {
        ctx.b[ctx.c++] = 0;
      }
      blake2bCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i3 = 0; i3 < ctx.outlen; i3++) {
        out[i3] = ctx.h[i3 >> 2] >> 8 * (i3 & 3);
      }
      return out;
    }
    function blake2b(input, key, outlen, salt, personal) {
      outlen = outlen || 64;
      input = util.normalizeInput(input);
      if (salt) {
        salt = util.normalizeInput(salt);
      }
      if (personal) {
        personal = util.normalizeInput(personal);
      }
      const ctx = blake2bInit(outlen, key, salt, personal);
      blake2bUpdate(ctx, input);
      return blake2bFinal(ctx);
    }
    function blake2bHex(input, key, outlen, salt, personal) {
      const output = blake2b(input, key, outlen, salt, personal);
      return util.toHex(output);
    }
    module.exports = {
      blake2b,
      blake2bHex,
      blake2bInit,
      blake2bUpdate,
      blake2bFinal
    };
  }
});

// node_modules/blakejs/blake2s.js
var require_blake2s = __commonJS({
  "node_modules/blakejs/blake2s.js"(exports, module) {
    var util = require_util();
    function B2S_GET32(v6, i3) {
      return v6[i3] ^ v6[i3 + 1] << 8 ^ v6[i3 + 2] << 16 ^ v6[i3 + 3] << 24;
    }
    function B2S_G(a3, b5, c5, d4, x5, y4) {
      v5[a3] = v5[a3] + v5[b5] + x5;
      v5[d4] = ROTR32(v5[d4] ^ v5[a3], 16);
      v5[c5] = v5[c5] + v5[d4];
      v5[b5] = ROTR32(v5[b5] ^ v5[c5], 12);
      v5[a3] = v5[a3] + v5[b5] + y4;
      v5[d4] = ROTR32(v5[d4] ^ v5[a3], 8);
      v5[c5] = v5[c5] + v5[d4];
      v5[b5] = ROTR32(v5[b5] ^ v5[c5], 7);
    }
    function ROTR32(x5, y4) {
      return x5 >>> y4 ^ x5 << 32 - y4;
    }
    var BLAKE2S_IV = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    var SIGMA = new Uint8Array([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0
    ]);
    var v5 = new Uint32Array(16);
    var m3 = new Uint32Array(16);
    function blake2sCompress(ctx, last) {
      let i3 = 0;
      for (i3 = 0; i3 < 8; i3++) {
        v5[i3] = ctx.h[i3];
        v5[i3 + 8] = BLAKE2S_IV[i3];
      }
      v5[12] ^= ctx.t;
      v5[13] ^= ctx.t / 4294967296;
      if (last) {
        v5[14] = ~v5[14];
      }
      for (i3 = 0; i3 < 16; i3++) {
        m3[i3] = B2S_GET32(ctx.b, 4 * i3);
      }
      for (i3 = 0; i3 < 10; i3++) {
        B2S_G(0, 4, 8, 12, m3[SIGMA[i3 * 16 + 0]], m3[SIGMA[i3 * 16 + 1]]);
        B2S_G(1, 5, 9, 13, m3[SIGMA[i3 * 16 + 2]], m3[SIGMA[i3 * 16 + 3]]);
        B2S_G(2, 6, 10, 14, m3[SIGMA[i3 * 16 + 4]], m3[SIGMA[i3 * 16 + 5]]);
        B2S_G(3, 7, 11, 15, m3[SIGMA[i3 * 16 + 6]], m3[SIGMA[i3 * 16 + 7]]);
        B2S_G(0, 5, 10, 15, m3[SIGMA[i3 * 16 + 8]], m3[SIGMA[i3 * 16 + 9]]);
        B2S_G(1, 6, 11, 12, m3[SIGMA[i3 * 16 + 10]], m3[SIGMA[i3 * 16 + 11]]);
        B2S_G(2, 7, 8, 13, m3[SIGMA[i3 * 16 + 12]], m3[SIGMA[i3 * 16 + 13]]);
        B2S_G(3, 4, 9, 14, m3[SIGMA[i3 * 16 + 14]], m3[SIGMA[i3 * 16 + 15]]);
      }
      for (i3 = 0; i3 < 8; i3++) {
        ctx.h[i3] ^= v5[i3] ^ v5[i3 + 8];
      }
    }
    function blake2sInit(outlen, key) {
      if (!(outlen > 0 && outlen <= 32)) {
        throw new Error("Incorrect output length, should be in [1, 32]");
      }
      const keylen = key ? key.length : 0;
      if (key && !(keylen > 0 && keylen <= 32)) {
        throw new Error("Incorrect key length, should be in [1, 32]");
      }
      const ctx = {
        h: new Uint32Array(BLAKE2S_IV),
        // hash state
        b: new Uint8Array(64),
        // input block
        c: 0,
        // pointer within block
        t: 0,
        // input count
        outlen
        // output length in bytes
      };
      ctx.h[0] ^= 16842752 ^ keylen << 8 ^ outlen;
      if (keylen > 0) {
        blake2sUpdate(ctx, key);
        ctx.c = 64;
      }
      return ctx;
    }
    function blake2sUpdate(ctx, input) {
      for (let i3 = 0; i3 < input.length; i3++) {
        if (ctx.c === 64) {
          ctx.t += ctx.c;
          blake2sCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i3];
      }
    }
    function blake2sFinal(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 64) {
        ctx.b[ctx.c++] = 0;
      }
      blake2sCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i3 = 0; i3 < ctx.outlen; i3++) {
        out[i3] = ctx.h[i3 >> 2] >> 8 * (i3 & 3) & 255;
      }
      return out;
    }
    function blake2s(input, key, outlen) {
      outlen = outlen || 32;
      input = util.normalizeInput(input);
      const ctx = blake2sInit(outlen, key);
      blake2sUpdate(ctx, input);
      return blake2sFinal(ctx);
    }
    function blake2sHex(input, key, outlen) {
      const output = blake2s(input, key, outlen);
      return util.toHex(output);
    }
    module.exports = {
      blake2s,
      blake2sHex,
      blake2sInit,
      blake2sUpdate,
      blake2sFinal
    };
  }
});

// node_modules/blakejs/index.js
var require_blakejs = __commonJS({
  "node_modules/blakejs/index.js"(exports, module) {
    var b2b = require_blake2b();
    var b2s = require_blake2s();
    module.exports = {
      blake2b: b2b.blake2b,
      blake2bHex: b2b.blake2bHex,
      blake2bInit: b2b.blake2bInit,
      blake2bUpdate: b2b.blake2bUpdate,
      blake2bFinal: b2b.blake2bFinal,
      blake2s: b2s.blake2s,
      blake2sHex: b2s.blake2sHex,
      blake2sInit: b2s.blake2sInit,
      blake2sUpdate: b2s.blake2sUpdate,
      blake2sFinal: b2s.blake2sFinal
    };
  }
});

// node_modules/@walletconnect/environment/dist/cjs/crypto.js
var require_crypto = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBrowserCryptoAvailable = exports.getSubtleCrypto = exports.getBrowerCrypto = void 0;
    function getBrowerCrypto() {
      return (global === null || global === void 0 ? void 0 : global.crypto) || (global === null || global === void 0 ? void 0 : global.msCrypto) || {};
    }
    exports.getBrowerCrypto = getBrowerCrypto;
    function getSubtleCrypto() {
      const browserCrypto = getBrowerCrypto();
      return browserCrypto.subtle || browserCrypto.webkitSubtle;
    }
    exports.getSubtleCrypto = getSubtleCrypto;
    function isBrowserCryptoAvailable() {
      return !!getBrowerCrypto() && !!getSubtleCrypto();
    }
    exports.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
  }
});

// node_modules/@walletconnect/environment/dist/cjs/env.js
var require_env = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/env.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBrowser = exports.isNode = exports.isReactNative = void 0;
    function isReactNative() {
      return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
    }
    exports.isReactNative = isReactNative;
    function isNode2() {
      return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
    }
    exports.isNode = isNode2;
    function isBrowser() {
      return !isReactNative() && !isNode2();
    }
    exports.isBrowser = isBrowser;
  }
});

// node_modules/@walletconnect/environment/dist/cjs/index.js
var require_cjs4 = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_crypto(), exports);
    tslib_1.__exportStar(require_env(), exports);
  }
});

// node_modules/ws/browser.js
var require_browser = __commonJS({
  "node_modules/ws/browser.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error(
        "ws does not work in the browser. Browser clients must use the native WebSocket object"
      );
    };
  }
});

// node_modules/@walletconnect/sign-client/dist/index.js
var import_events10 = __toESM(require_events(), 1);

// node_modules/@walletconnect/core/dist/index.js
var import_events7 = __toESM(require_events(), 1);

// node_modules/@walletconnect/heartbeat/dist/index.es.js
var import_events = __toESM(require_events());
var import_time = __toESM(require_cjs());

// node_modules/@walletconnect/events/dist/esm/events.js
var IEvents = class {
};

// node_modules/@walletconnect/heartbeat/dist/index.es.js
var n = class extends IEvents {
  constructor(e2) {
    super();
  }
};
var s = import_time.FIVE_SECONDS;
var r = { pulse: "heartbeat_pulse" };
var i = class _i3 extends n {
  constructor(e2) {
    super(e2), this.events = new import_events.EventEmitter(), this.interval = s, this.interval = e2?.interval || s;
  }
  static async init(e2) {
    const t = new _i3(e2);
    return await t.init(), t;
  }
  async init() {
    await this.initialize();
  }
  stop() {
    clearInterval(this.intervalRef);
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async initialize() {
    this.intervalRef = setInterval(() => this.pulse(), (0, import_time.toMiliseconds)(this.interval));
  }
  pulse() {
    this.events.emit(r.pulse);
  }
};

// node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

// node_modules/@walletconnect/keyvaluestorage/node_modules/unstorage/dist/shared/unstorage.lWbgcyKt.mjs
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
var BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c5) => c5.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function hasDotSegment(key) {
  return key.split(":").some((segment) => segment === "." || segment === "..");
}
function joinKeys(...keys2) {
  return normalizeKey(keys2.join(":"));
}
function normalizeBaseKey(base3) {
  base3 = normalizeKey(base3);
  return base3 ? base3 + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base3) {
  if (base3) {
    return key.startsWith(base3) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

// node_modules/@walletconnect/keyvaluestorage/node_modules/unstorage/dist/index.mjs
function defineDriver(factory) {
  return factory;
}
var DRIVER_NAME = "memory";
var memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const normalizeItemKey = (key) => {
    const normalizedKey = normalizeKey(key);
    if (!normalizedKey || hasDotSegment(normalizedKey)) {
      throw new Error(`[unstorage] Invalid key: ${JSON.stringify(key)}`);
    }
    return normalizedKey;
  };
  const normalizeBase = (base3) => {
    const normalizedBase = normalizeBaseKey(base3);
    if (hasDotSegment(normalizedBase)) {
      throw new Error(`[unstorage] Invalid base: ${JSON.stringify(base3)}`);
    }
    return normalizedBase;
  };
  const getMount = (key) => {
    for (const base3 of context.mountpoints) {
      if (key.startsWith(base3)) {
        return {
          base: base3,
          relativeKey: key.slice(base3.length),
          driver: context.mounts[base3]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base3, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base3) || includeParent && base3.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base3.length > mountpoint.length ? base3.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeItemKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r3) => r3.flat()
    );
  };
  const storage = {
    // Item
    async hasItem(key, opts = {}) {
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    async getItem(key, opts = {}) {
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    async getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r3) => r3.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    async getItemRaw(key, opts = {}) {
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeItemKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    async setMeta(key, value, opts = {}) {
      return this.setItem(normalizeItemKey(key) + "$", value, opts);
    },
    async removeMeta(key, opts = {}) {
      return this.removeItem(normalizeItemKey(key) + "$", opts);
    },
    // Keys
    async getKeys(base3, opts = {}) {
      base3 = normalizeBase(base3);
      const mounts = getMounts(base3, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p3) => fullKey.startsWith(p3))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p3) => !p3.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base3)
      );
    },
    // Utils
    async clear(base3, opts = {}) {
      base3 = normalizeBase(base3);
      await Promise.all(
        getMounts(base3, false).map(async (m3) => {
          if (m3.driver.clear) {
            return asyncCall(m3.driver.clear, m3.relativeBase, opts);
          }
          if (m3.driver.removeItem) {
            const keys2 = await m3.driver.getKeys(m3.relativeBase || "", opts);
            return Promise.all(
              keys2.map((key) => m3.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base3, driver) {
      base3 = normalizeBase(base3);
      if (base3 && context.mounts[base3]) {
        throw new Error(`already mounted at ${base3}`);
      }
      if (base3) {
        context.mountpoints.push(base3);
        context.mountpoints.sort((a3, b5) => b5.length - a3.length);
      }
      context.mounts[base3] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base3)).then((unwatcher) => {
          context.unwatch[base3] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base3, _dispose = true) {
      base3 = normalizeBaseKey(base3);
      if (!base3 || !context.mounts[base3]) {
        return;
      }
      if (context.watching && base3 in context.unwatch) {
        context.unwatch[base3]?.();
        delete context.unwatch[base3];
      }
      if (_dispose) {
        await dispose(context.mounts[base3]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base3);
      delete context.mounts[base3];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m3 = getMount(key);
      return {
        driver: m3.driver,
        base: m3.base
      };
    },
    getMounts(base3 = "", opts = {}) {
      base3 = normalizeKey(base3);
      const mounts = getMounts(base3, opts.parents);
      return mounts.map((m3) => ({
        driver: m3.driver,
        base: m3.mountpoint
      }));
    },
    // Aliases
    keys: (base3, opts = {}) => storage.getKeys(base3, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base3) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base3 + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

// node_modules/idb-keyval/dist/index.js
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  let dbp;
  const getDB = () => {
    if (dbp)
      return dbp;
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    dbp = promisifyRequest(request);
    dbp.then((db) => {
      db.onclose = () => dbp = void 0;
    }, () => {
      dbp = void 0;
    });
    return dbp;
  };
  return (txMode, callback) => getDB().then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
var defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
function del(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}
function clear(customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}
function eachCursor(store, callback) {
  store.openCursor().onsuccess = function() {
    if (!this.result)
      return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyRequest(store.transaction);
}
function keys(customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    if (store.getAllKeys) {
      return promisifyRequest(store.getAllKeys());
    }
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
  });
}

// node_modules/@walletconnect/safe-json/dist/esm/index.js
var JSONStringify = (data) => JSON.stringify(data, (_3, value) => typeof value === "bigint" ? value.toString() + "n" : value);
var JSONParse = (json) => {
  const numbersBiggerThanMaxInt = /([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g;
  const serializedData = json.replace(numbersBiggerThanMaxInt, '$1"$2n"$3');
  return JSON.parse(serializedData, (_3, value) => {
    const isCustomFormatBigInt = typeof value === "string" && value.match(/^\d+n$/);
    if (isCustomFormatBigInt)
      return BigInt(value.substring(0, value.length - 1));
    return value;
  });
};
function safeJsonParse(value) {
  if (typeof value !== "string") {
    throw new Error(`Cannot safe json parse value of type ${typeof value}`);
  }
  try {
    return JSONParse(value);
  } catch (_a2) {
    return value;
  }
}
function safeJsonStringify(value) {
  return typeof value === "string" ? value : JSONStringify(value) || "";
}

// node_modules/@walletconnect/keyvaluestorage/dist/index.es.js
var x = "idb-keyval";
var z = (i3 = {}) => {
  const t = i3.base && i3.base.length > 0 ? `${i3.base}:` : "", e2 = (s2) => t + s2;
  let n5;
  return i3.dbName && i3.storeName && (n5 = createStore(i3.dbName, i3.storeName)), { name: x, options: i3, async hasItem(s2) {
    return !(typeof await get(e2(s2), n5) > "u");
  }, async getItem(s2) {
    return await get(e2(s2), n5) ?? null;
  }, setItem(s2, a3) {
    return set(e2(s2), a3, n5);
  }, removeItem(s2) {
    return del(e2(s2), n5);
  }, getKeys() {
    return keys(n5);
  }, clear() {
    return clear(n5);
  } };
};
var D = "WALLET_CONNECT_V2_INDEXED_DB";
var E = "keyvaluestorage";
var _ = class {
  constructor() {
    this.indexedDb = createStorage({ driver: z({ dbName: D, storeName: E }) });
  }
  async getKeys() {
    return this.indexedDb.getKeys();
  }
  async getEntries() {
    return (await this.indexedDb.getItems(await this.indexedDb.getKeys())).map((t) => [t.key, t.value]);
  }
  async getItem(t) {
    const e2 = await this.indexedDb.getItem(t);
    if (e2 !== null) return e2;
  }
  async setItem(t, e2) {
    await this.indexedDb.setItem(t, safeJsonStringify(e2));
  }
  async removeItem(t) {
    await this.indexedDb.removeItem(t);
  }
};
var l2 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var c = { exports: {} };
(function() {
  let i3;
  function t() {
  }
  i3 = t, i3.prototype.getItem = function(e2) {
    return this.hasOwnProperty(e2) ? String(this[e2]) : null;
  }, i3.prototype.setItem = function(e2, n5) {
    this[e2] = String(n5);
  }, i3.prototype.removeItem = function(e2) {
    delete this[e2];
  }, i3.prototype.clear = function() {
    const e2 = this;
    Object.keys(e2).forEach(function(n5) {
      e2[n5] = void 0, delete e2[n5];
    });
  }, i3.prototype.key = function(e2) {
    return e2 = e2 || 0, Object.keys(this)[e2];
  }, i3.prototype.__defineGetter__("length", function() {
    return Object.keys(this).length;
  }), typeof l2 < "u" && l2.localStorage ? c.exports = l2.localStorage : typeof window < "u" && window.localStorage ? c.exports = window.localStorage : c.exports = new t();
})();
function k(i3) {
  var t;
  return [i3[0], safeJsonParse((t = i3[1]) != null ? t : "")];
}
var K = class {
  constructor() {
    this.localStorage = c.exports;
  }
  async getKeys() {
    return Object.keys(this.localStorage);
  }
  async getEntries() {
    return Object.entries(this.localStorage).map(k);
  }
  async getItem(t) {
    const e2 = this.localStorage.getItem(t);
    if (e2 !== null) return safeJsonParse(e2);
  }
  async setItem(t, e2) {
    this.localStorage.setItem(t, safeJsonStringify(e2));
  }
  async removeItem(t) {
    this.localStorage.removeItem(t);
  }
};
var N = "wc_storage_version";
var y = 1;
var O = async (i3, t, e2) => {
  const n5 = N, s2 = await t.getItem(n5);
  if (s2 && s2 >= y) {
    e2(t);
    return;
  }
  const a3 = await i3.getKeys();
  if (!a3.length) {
    e2(t);
    return;
  }
  const m3 = [];
  for (; a3.length; ) {
    const r3 = a3.shift();
    if (!r3) continue;
    const o4 = r3.toLowerCase();
    if (o4.includes("wc@") || o4.includes("walletconnect") || o4.includes("wc_") || o4.includes("wallet_connect")) {
      const f4 = await i3.getItem(r3);
      await t.setItem(r3, f4), m3.push(r3);
    }
  }
  await t.setItem(n5, y), e2(t), j(i3, m3);
};
var j = async (i3, t) => {
  t.length && t.forEach(async (e2) => {
    await i3.removeItem(e2);
  });
};
var h = class {
  constructor() {
    this.initialized = false, this.setInitialized = (e2) => {
      this.storage = e2, this.initialized = true;
    };
    const t = new K();
    this.storage = t;
    try {
      const e2 = new _();
      O(t, e2, this.setInitialized);
    } catch {
      this.initialized = true;
    }
  }
  async getKeys() {
    return await this.initialize(), this.storage.getKeys();
  }
  async getEntries() {
    return await this.initialize(), this.storage.getEntries();
  }
  async getItem(t) {
    return await this.initialize(), this.storage.getItem(t);
  }
  async setItem(t, e2) {
    return await this.initialize(), this.storage.setItem(t, e2);
  }
  async removeItem(t) {
    return await this.initialize(), this.storage.removeItem(t);
  }
  async initialize() {
    this.initialized || await new Promise((t) => {
      const e2 = setInterval(() => {
        this.initialized && (clearInterval(e2), t());
      }, 20);
    });
  }
};

// node_modules/@walletconnect/logger/dist/index.es.js
var b = { exports: {} };
function se(e2) {
  try {
    return JSON.stringify(e2);
  } catch {
    return '"[Circular]"';
  }
}
var ie = oe;
function oe(e2, t, r3) {
  var s2 = r3 && r3.stringify || se, i3 = 1;
  if (typeof e2 == "object" && e2 !== null) {
    var h4 = t.length + i3;
    if (h4 === 1) return e2;
    var f4 = new Array(h4);
    f4[0] = s2(e2);
    for (var u2 = 1; u2 < h4; u2++) f4[u2] = s2(t[u2]);
    return f4.join(" ");
  }
  if (typeof e2 != "string") return e2;
  var c5 = t.length;
  if (c5 === 0) return e2;
  for (var n5 = "", o4 = 1 - i3, l6 = -1, p3 = e2 && e2.length || 0, a3 = 0; a3 < p3; ) {
    if (e2.charCodeAt(a3) === 37 && a3 + 1 < p3) {
      switch (l6 = l6 > -1 ? l6 : 0, e2.charCodeAt(a3 + 1)) {
        case 100:
        case 102:
          if (o4 >= c5 || t[o4] == null) break;
          l6 < a3 && (n5 += e2.slice(l6, a3)), n5 += Number(t[o4]), l6 = a3 + 2, a3++;
          break;
        case 105:
          if (o4 >= c5 || t[o4] == null) break;
          l6 < a3 && (n5 += e2.slice(l6, a3)), n5 += Math.floor(Number(t[o4])), l6 = a3 + 2, a3++;
          break;
        case 79:
        case 111:
        case 106:
          if (o4 >= c5 || t[o4] === void 0) break;
          l6 < a3 && (n5 += e2.slice(l6, a3));
          var O4 = typeof t[o4];
          if (O4 === "string") {
            n5 += "'" + t[o4] + "'", l6 = a3 + 2, a3++;
            break;
          }
          if (O4 === "function") {
            n5 += t[o4].name || "<anonymous>", l6 = a3 + 2, a3++;
            break;
          }
          n5 += s2(t[o4]), l6 = a3 + 2, a3++;
          break;
        case 115:
          if (o4 >= c5) break;
          l6 < a3 && (n5 += e2.slice(l6, a3)), n5 += String(t[o4]), l6 = a3 + 2, a3++;
          break;
        case 37:
          l6 < a3 && (n5 += e2.slice(l6, a3)), n5 += "%", l6 = a3 + 2, a3++, o4--;
          break;
      }
      ++o4;
    }
    ++a3;
  }
  return l6 === -1 ? e2 : (l6 < p3 && (n5 += e2.slice(l6)), n5);
}
var G = ie;
b.exports = v;
var j2 = we().console || {};
var le = { mapHttpRequest: C, mapHttpResponse: C, wrapRequestSerializer: $, wrapResponseSerializer: $, wrapErrorSerializer: $, req: C, res: C, err: U, errWithCause: U };
function m(e2, t) {
  return e2 === "silent" ? 1 / 0 : t.levels.values[e2];
}
var A = Symbol("pino.logFuncs");
var P = Symbol("pino.hierarchy");
var ae = { error: "log", fatal: "error", warn: "error", info: "log", debug: "log", trace: "log" };
function R(e2, t) {
  const r3 = { logger: t, parent: e2[P] };
  t[P] = r3;
}
function ue(e2, t, r3) {
  const s2 = {};
  t.forEach((i3) => {
    s2[i3] = r3[i3] ? r3[i3] : j2[i3] || j2[ae[i3] || "log"] || w;
  }), e2[A] = s2;
}
function ce(e2, t) {
  return Array.isArray(e2) ? e2.filter(function(s2) {
    return s2 !== "!stdSerializers.err";
  }) : e2 === true ? Object.keys(t) : false;
}
function v(e2) {
  e2 = e2 || {}, e2.browser = e2.browser || {};
  const t = e2.browser.transmit;
  if (t && typeof t.send != "function") throw Error("pino: transmit option must have a send function");
  const r3 = e2.browser.write || j2;
  e2.browser.write && (e2.browser.asObject = true);
  const s2 = e2.serializers || {}, i3 = ce(e2.browser.serialize, s2);
  let h4 = e2.browser.serialize;
  Array.isArray(e2.browser.serialize) && e2.browser.serialize.indexOf("!stdSerializers.err") > -1 && (h4 = false);
  const f4 = Object.keys(e2.customLevels || {}), u2 = ["error", "fatal", "warn", "info", "debug", "trace"].concat(f4);
  typeof r3 == "function" && u2.forEach(function(g2) {
    r3[g2] = r3;
  }), (e2.enabled === false || e2.browser.disabled) && (e2.level = "silent");
  const c5 = e2.level || "info", n5 = Object.create(r3);
  n5.log || (n5.log = w), ue(n5, u2, r3), R({}, n5), Object.defineProperty(n5, "levelVal", { get: l6 }), Object.defineProperty(n5, "level", { get: p3, set: a3 });
  const o4 = { transmit: t, serialize: i3, asObject: e2.browser.asObject, asObjectBindingsOnly: e2.browser.asObjectBindingsOnly, formatters: e2.browser.formatters, levels: u2, timestamp: ye(e2), messageKey: e2.messageKey || "msg", onChild: e2.onChild || w };
  n5.levels = he(e2), n5.level = c5, n5.isLevelEnabled = function(g2) {
    return this.levels.values[g2] ? this.levels.values[g2] >= this.levels.values[this.level] : false;
  }, n5.setMaxListeners = n5.getMaxListeners = n5.emit = n5.addListener = n5.on = n5.prependListener = n5.once = n5.prependOnceListener = n5.removeListener = n5.removeAllListeners = n5.listeners = n5.listenerCount = n5.eventNames = n5.write = n5.flush = w, n5.serializers = s2, n5._serialize = i3, n5._stdErrSerialize = h4, n5.child = function(...g2) {
    return O4.call(this, o4, ...g2);
  }, t && (n5._logEvent = N2());
  function l6() {
    return m(this.level, this);
  }
  function p3() {
    return this._level;
  }
  function a3(g2) {
    if (g2 !== "silent" && !this.levels.values[g2]) throw Error("unknown level " + g2);
    this._level = g2, L(this, o4, n5, "error"), L(this, o4, n5, "fatal"), L(this, o4, n5, "warn"), L(this, o4, n5, "info"), L(this, o4, n5, "debug"), L(this, o4, n5, "trace"), f4.forEach((d4) => {
      L(this, o4, n5, d4);
    });
  }
  function O4(g2, d4, z4) {
    if (!d4) throw new Error("missing bindings for child Pino");
    z4 = z4 || {}, i3 && d4.serializers && (z4.serializers = d4.serializers);
    const F = z4.serializers;
    if (i3 && F) {
      var E3 = Object.assign({}, s2, F), M4 = e2.browser.serialize === true ? Object.keys(E3) : i3;
      delete d4.serializers, V([d4], M4, E3, this._stdErrSerialize);
    }
    function D2(k4) {
      this._childLevel = (k4._childLevel | 0) + 1, this.bindings = d4, E3 && (this.serializers = E3, this._serialize = M4), t && (this._logEvent = N2([].concat(k4._logEvent.bindings, d4)));
    }
    D2.prototype = this;
    const _3 = new D2(this);
    return R(this, _3), _3.child = function(...k4) {
      return O4.call(this, g2, ...k4);
    }, _3.level = z4.level || this.level, g2.onChild(_3), _3;
  }
  return n5;
}
function he(e2) {
  const t = e2.customLevels || {}, r3 = Object.assign({}, v.levels.values, t), s2 = Object.assign({}, v.levels.labels, fe(t));
  return { values: r3, labels: s2 };
}
function fe(e2) {
  const t = {};
  return Object.keys(e2).forEach(function(r3) {
    t[e2[r3]] = r3;
  }), t;
}
v.levels = { values: { fatal: 60, error: 50, warn: 40, info: 30, debug: 20, trace: 10 }, labels: { 10: "trace", 20: "debug", 30: "info", 40: "warn", 50: "error", 60: "fatal" } }, v.stdSerializers = le, v.stdTimeFunctions = Object.assign({}, { nullTime: X, epochTime: Y, unixTime: pe, isoTime: Le });
function ge(e2) {
  const t = [];
  e2.bindings && t.push(e2.bindings);
  let r3 = e2[P];
  for (; r3.parent; ) r3 = r3.parent, r3.logger.bindings && t.push(r3.logger.bindings);
  return t.reverse();
}
function L(e2, t, r3, s2) {
  if (Object.defineProperty(e2, s2, { value: m(e2.level, r3) > m(s2, r3) ? w : r3[A][s2], writable: true, enumerable: true, configurable: true }), e2[s2] === w) {
    if (!t.transmit) return;
    const h4 = t.transmit.level || e2.level, f4 = m(h4, r3);
    if (m(s2, r3) < f4) return;
  }
  e2[s2] = de(e2, t, r3, s2);
  const i3 = ge(e2);
  i3.length !== 0 && (e2[s2] = be(i3, e2[s2]));
}
function be(e2, t) {
  return function() {
    return t.apply(this, [...e2, ...arguments]);
  };
}
function de(e2, t, r3, s2) {
  return /* @__PURE__ */ (function(i3) {
    return function() {
      const f4 = t.timestamp(), u2 = new Array(arguments.length), c5 = Object.getPrototypeOf && Object.getPrototypeOf(this) === j2 ? j2 : this;
      for (var n5 = 0; n5 < u2.length; n5++) u2[n5] = arguments[n5];
      var o4 = false;
      if (t.serialize && (V(u2, this._serialize, this.serializers, this._stdErrSerialize), o4 = true), t.asObject || t.formatters ? i3.call(c5, ...ve(this, s2, u2, f4, t)) : i3.apply(c5, u2), t.transmit) {
        const l6 = t.transmit.level || e2._level, p3 = m(l6, r3), a3 = m(s2, r3);
        if (a3 < p3) return;
        me(this, { ts: f4, methodLevel: s2, methodValue: a3, transmitLevel: l6, transmitValue: r3.levels.values[t.transmit.level || e2._level], send: t.transmit.send, val: m(e2._level, r3) }, u2, o4);
      }
    };
  })(e2[A][s2]);
}
function ve(e2, t, r3, s2, i3) {
  const { level: h4, log: f4 = (l6) => l6 } = i3.formatters || {}, u2 = r3.slice();
  let c5 = u2[0];
  const n5 = {};
  let o4 = (e2._childLevel | 0) + 1;
  if (o4 < 1 && (o4 = 1), s2 && (n5.time = s2), h4) {
    const l6 = h4(t, e2.levels.values[t]);
    Object.assign(n5, l6);
  } else n5.level = e2.levels.values[t];
  if (i3.asObjectBindingsOnly) {
    if (c5 !== null && typeof c5 == "object") for (; o4-- && typeof u2[0] == "object"; ) Object.assign(n5, u2.shift());
    return [f4(n5), ...u2];
  } else {
    if (c5 !== null && typeof c5 == "object") {
      for (; o4-- && typeof u2[0] == "object"; ) Object.assign(n5, u2.shift());
      c5 = u2.length ? G(u2.shift(), u2) : void 0;
    } else typeof c5 == "string" && (c5 = G(u2.shift(), u2));
    return c5 !== void 0 && (n5[i3.messageKey] = c5), [f4(n5)];
  }
}
function V(e2, t, r3, s2) {
  for (const i3 in e2) if (s2 && e2[i3] instanceof Error) e2[i3] = v.stdSerializers.err(e2[i3]);
  else if (typeof e2[i3] == "object" && !Array.isArray(e2[i3]) && t) for (const h4 in e2[i3]) t.indexOf(h4) > -1 && h4 in r3 && (e2[i3][h4] = r3[h4](e2[i3][h4]));
}
function me(e2, t, r3, s2 = false) {
  const i3 = t.send, h4 = t.ts, f4 = t.methodLevel, u2 = t.methodValue, c5 = t.val, n5 = e2._logEvent.bindings;
  s2 || V(r3, e2._serialize || Object.keys(e2.serializers), e2.serializers, e2._stdErrSerialize === void 0 ? true : e2._stdErrSerialize), e2._logEvent.ts = h4, e2._logEvent.messages = r3.filter(function(o4) {
    return n5.indexOf(o4) === -1;
  }), e2._logEvent.level.label = f4, e2._logEvent.level.value = u2, i3(f4, e2._logEvent, c5), e2._logEvent = N2(n5);
}
function N2(e2) {
  return { ts: 0, messages: [], bindings: e2 || [], level: { label: "", value: 0 } };
}
function U(e2) {
  const t = { type: e2.constructor.name, msg: e2.message, stack: e2.stack };
  for (const r3 in e2) t[r3] === void 0 && (t[r3] = e2[r3]);
  return t;
}
function ye(e2) {
  return typeof e2.timestamp == "function" ? e2.timestamp : e2.timestamp === false ? X : Y;
}
function C() {
  return {};
}
function $(e2) {
  return e2;
}
function w() {
}
function X() {
  return false;
}
function Y() {
  return Date.now();
}
function pe() {
  return Math.round(Date.now() / 1e3);
}
function Le() {
  return new Date(Date.now()).toISOString();
}
function we() {
  function e2(t) {
    return typeof t < "u" && t;
  }
  try {
    return typeof globalThis < "u" || Object.defineProperty(Object.prototype, "globalThis", { get: function() {
      return delete Object.prototype.globalThis, this.globalThis = this;
    }, configurable: true }), globalThis;
  } catch {
    return e2(self) || e2(window) || e2(this) || {};
  }
}
b.exports.default = v;
var Oe = b.exports.pino = v;
var Z = { level: "info" };
var S = "custom_context";
var I = 1e3 * 1024;
var ze = Object.defineProperty;
var _e = (e2, t, r3) => t in e2 ? ze(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var y2 = (e2, t, r3) => _e(e2, typeof t != "symbol" ? t + "" : t, r3);
var je = class {
  constructor(t) {
    y2(this, "nodeValue"), y2(this, "sizeInBytes"), y2(this, "next"), this.nodeValue = t, this.sizeInBytes = new TextEncoder().encode(this.nodeValue).length, this.next = null;
  }
  get value() {
    return this.nodeValue;
  }
  get size() {
    return this.sizeInBytes;
  }
};
var q = class {
  constructor(t) {
    y2(this, "lengthInNodes"), y2(this, "sizeInBytes"), y2(this, "head"), y2(this, "tail"), y2(this, "maxSizeInBytes"), this.head = null, this.tail = null, this.lengthInNodes = 0, this.maxSizeInBytes = t, this.sizeInBytes = 0;
  }
  append(t) {
    const r3 = new je(t);
    if (r3.size > this.maxSizeInBytes) throw new Error(`[LinkedList] Value too big to insert into list: ${t} with size ${r3.size}`);
    for (; this.size + r3.size > this.maxSizeInBytes; ) this.shift();
    this.head ? (this.tail && (this.tail.next = r3), this.tail = r3) : (this.head = r3, this.tail = r3), this.lengthInNodes++, this.sizeInBytes += r3.size;
  }
  shift() {
    if (!this.head) return;
    const t = this.head;
    this.head = this.head.next, this.head || (this.tail = null), this.lengthInNodes--, this.sizeInBytes -= t.size;
  }
  toArray() {
    const t = [];
    let r3 = this.head;
    for (; r3 !== null; ) t.push(r3.value), r3 = r3.next;
    return t;
  }
  get length() {
    return this.lengthInNodes;
  }
  get size() {
    return this.sizeInBytes;
  }
  toOrderedArray() {
    return Array.from(this);
  }
  [Symbol.iterator]() {
    let t = this.head;
    return { next: () => {
      if (!t) return { done: true, value: null };
      const r3 = t.value;
      return t = t.next, { done: false, value: r3 };
    } };
  }
};
var Se = (e2) => JSON.stringify(e2, (t, r3) => typeof r3 == "bigint" ? r3.toString() + "n" : r3);
function K2(e2) {
  return typeof e2 == "string" ? e2 : Se(e2) || "";
}
var Ee = Object.defineProperty;
var ke = (e2, t, r3) => t in e2 ? Ee(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var T = (e2, t, r3) => ke(e2, typeof t != "symbol" ? t + "" : t, r3);
var J = class {
  constructor(t, r3 = I) {
    T(this, "logs"), T(this, "level"), T(this, "levelValue"), T(this, "MAX_LOG_SIZE_IN_BYTES"), this.level = t ?? "error", this.levelValue = b.exports.levels.values[this.level], this.MAX_LOG_SIZE_IN_BYTES = r3, this.logs = new q(this.MAX_LOG_SIZE_IN_BYTES);
  }
  forwardToConsole(t, r3) {
    r3 === b.exports.levels.values.error ? console.error(t) : r3 === b.exports.levels.values.warn ? console.warn(t) : r3 === b.exports.levels.values.debug ? console.debug(t) : r3 === b.exports.levels.values.trace ? console.trace(t) : console.log(t);
  }
  appendToLogs(t) {
    this.logs.append(K2({ timestamp: (/* @__PURE__ */ new Date()).toISOString(), log: t }));
    const r3 = typeof t == "string" ? JSON.parse(t).level : t.level;
    r3 >= this.levelValue && this.forwardToConsole(t, r3);
  }
  getLogs() {
    return this.logs;
  }
  clearLogs() {
    this.logs = new q(this.MAX_LOG_SIZE_IN_BYTES);
  }
  getLogArray() {
    return Array.from(this.logs);
  }
  logsToBlob(t) {
    const r3 = this.getLogArray();
    return r3.push(K2({ extraMetadata: t })), new Blob(r3, { type: "application/json" });
  }
};
var Ce = Object.defineProperty;
var Ie = (e2, t, r3) => t in e2 ? Ce(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var Te = (e2, t, r3) => Ie(e2, typeof t != "symbol" ? t + "" : t, r3);
var xe = class {
  constructor(t, r3 = I) {
    Te(this, "baseChunkLogger"), this.baseChunkLogger = new J(t, r3);
  }
  write(t) {
    this.baseChunkLogger.appendToLogs(t);
  }
  getLogs() {
    return this.baseChunkLogger.getLogs();
  }
  clearLogs() {
    this.baseChunkLogger.clearLogs();
  }
  getLogArray() {
    return this.baseChunkLogger.getLogArray();
  }
  logsToBlob(t) {
    return this.baseChunkLogger.logsToBlob(t);
  }
  downloadLogsBlobInBrowser(t) {
    const r3 = URL.createObjectURL(this.logsToBlob(t)), s2 = document.createElement("a");
    s2.href = r3, s2.download = `walletconnect-logs-${(/* @__PURE__ */ new Date()).toISOString()}.txt`, document.body.appendChild(s2), s2.click(), document.body.removeChild(s2), URL.revokeObjectURL(r3);
  }
};
var Be = Object.defineProperty;
var Ae = (e2, t, r3) => t in e2 ? Be(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var Pe = (e2, t, r3) => Ae(e2, typeof t != "symbol" ? t + "" : t, r3);
var Ve = class {
  constructor(t, r3 = I) {
    Pe(this, "baseChunkLogger"), this.baseChunkLogger = new J(t, r3);
  }
  write(t) {
    this.baseChunkLogger.appendToLogs(t);
  }
  getLogs() {
    return this.baseChunkLogger.getLogs();
  }
  clearLogs() {
    this.baseChunkLogger.clearLogs();
  }
  getLogArray() {
    return this.baseChunkLogger.getLogArray();
  }
  logsToBlob(t) {
    return this.baseChunkLogger.logsToBlob(t);
  }
};
var Ne = Object.defineProperty;
var $e = Object.defineProperties;
var Fe = Object.getOwnPropertyDescriptors;
var H = Object.getOwnPropertySymbols;
var Me = Object.prototype.hasOwnProperty;
var De = Object.prototype.propertyIsEnumerable;
var W = (e2, t, r3) => t in e2 ? Ne(e2, t, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[t] = r3;
var x2 = (e2, t) => {
  for (var r3 in t || (t = {})) Me.call(t, r3) && W(e2, r3, t[r3]);
  if (H) for (var r3 of H(t)) De.call(t, r3) && W(e2, r3, t[r3]);
  return e2;
};
var B = (e2, t) => $e(e2, Fe(t));
function Ge(e2) {
  return B(x2({}, e2), { level: e2?.level || Z.level });
}
function Q(e2, t, r3 = S) {
  return e2[r3] = t, e2;
}
function ee(e2, t = S) {
  return e2[t] || "";
}
function te(e2, t, r3 = S) {
  const s2 = ee(e2, r3);
  return s2.trim() ? `${s2}/${t}` : t;
}
function Re(e2, t, r3 = S) {
  const s2 = te(e2, t, r3), i3 = e2.child({ context: s2 });
  return Q(i3, s2, r3);
}
function re(e2) {
  var t, r3;
  const s2 = new xe((t = e2.opts) == null ? void 0 : t.level, e2.maxSizeInBytes);
  return { logger: b.exports(B(x2({}, e2.opts), { level: "trace", browser: B(x2({}, (r3 = e2.opts) == null ? void 0 : r3.browser), { write: (i3) => s2.write(i3) }) })), chunkLoggerController: s2 };
}
function ne(e2) {
  var t;
  const r3 = new Ve((t = e2.opts) == null ? void 0 : t.level, e2.maxSizeInBytes);
  return { logger: b.exports(B(x2({}, e2.opts), { level: "trace" }), r3), chunkLoggerController: r3 };
}
function Ue(e2) {
  return typeof e2.loggerOverride < "u" && typeof e2.loggerOverride != "string" ? { logger: e2.loggerOverride, chunkLoggerController: null } : typeof window < "u" ? re(e2) : ne(e2);
}

// node_modules/@walletconnect/core/node_modules/@walletconnect/types/dist/index.js
var import_events4 = __toESM(require_events());
var a2 = Object.defineProperty;
var u = (e2, s2, r3) => s2 in e2 ? a2(e2, s2, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[s2] = r3;
var c2 = (e2, s2, r3) => u(e2, typeof s2 != "symbol" ? s2 + "" : s2, r3);
var h2 = class extends IEvents {
  constructor(s2) {
    super(), this.opts = s2, c2(this, "protocol", "wc"), c2(this, "version", 2);
  }
};
var p = Object.defineProperty;
var b2 = (e2, s2, r3) => s2 in e2 ? p(e2, s2, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[s2] = r3;
var v2 = (e2, s2, r3) => b2(e2, typeof s2 != "symbol" ? s2 + "" : s2, r3);
var I2 = class extends IEvents {
  constructor(s2, r3) {
    super(), this.core = s2, this.logger = r3, v2(this, "records", /* @__PURE__ */ new Map());
  }
};
var y3 = class {
  constructor(s2, r3) {
    this.logger = s2, this.core = r3;
  }
};
var m2 = class extends IEvents {
  constructor(s2, r3) {
    super(), this.relayer = s2, this.logger = r3;
  }
};
var d = class extends IEvents {
  constructor(s2) {
    super();
  }
};
var f = class {
  constructor(s2, r3, t, q3) {
    this.core = s2, this.logger = r3, this.name = t;
  }
};
var P2 = class extends IEvents {
  constructor(s2, r3) {
    super(), this.relayer = s2, this.logger = r3;
  }
};
var S2 = class extends IEvents {
  constructor(s2, r3) {
    super(), this.core = s2, this.logger = r3;
  }
};
var M = class {
  constructor(s2, r3, t) {
    this.core = s2, this.logger = r3, this.store = t;
  }
};
var O2 = class {
  constructor(s2, r3) {
    this.projectId = s2, this.logger = r3;
  }
};
var R2 = class {
  constructor(s2, r3, t) {
    this.core = s2, this.logger = r3, this.telemetryEnabled = t;
  }
};

// node_modules/@walletconnect/core/dist/index.js
var import_time4 = __toESM(require_cjs(), 1);

// node_modules/@walletconnect/relay-auth/dist/index.es.js
var import_time2 = __toESM(require_cjs());
function En(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function fe2(t, ...e2) {
  if (!En(t)) throw new Error("Uint8Array expected");
  if (e2.length > 0 && !e2.includes(t.length)) throw new Error("Uint8Array expected of length " + e2 + ", got length=" + t.length);
}
function De2(t, e2 = true) {
  if (t.destroyed) throw new Error("Hash instance has been destroyed");
  if (e2 && t.finished) throw new Error("Hash#digest() has already been called");
}
function gn(t, e2) {
  fe2(t);
  const n5 = e2.outputLen;
  if (t.length < n5) throw new Error("digestInto() expects output buffer of length at least " + n5);
}
var it = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
var _t = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength);
function yn(t) {
  if (typeof t != "string") throw new Error("utf8ToBytes expected string, got " + typeof t);
  return new Uint8Array(new TextEncoder().encode(t));
}
function de2(t) {
  return typeof t == "string" && (t = yn(t)), fe2(t), t;
}
var xn = class {
  clone() {
    return this._cloneInto();
  }
};
function Bn(t) {
  const e2 = (r3) => t().update(de2(r3)).digest(), n5 = t();
  return e2.outputLen = n5.outputLen, e2.blockLen = n5.blockLen, e2.create = () => t(), e2;
}
function he2(t = 32) {
  if (it && typeof it.getRandomValues == "function") return it.getRandomValues(new Uint8Array(t));
  if (it && typeof it.randomBytes == "function") return it.randomBytes(t);
  throw new Error("crypto.getRandomValues must be defined");
}
function Cn(t, e2, n5, r3) {
  if (typeof t.setBigUint64 == "function") return t.setBigUint64(e2, n5, r3);
  const o4 = BigInt(32), s2 = BigInt(4294967295), a3 = Number(n5 >> o4 & s2), u2 = Number(n5 & s2), i3 = r3 ? 4 : 0, D2 = r3 ? 0 : 4;
  t.setUint32(e2 + i3, a3, r3), t.setUint32(e2 + D2, u2, r3);
}
var An = class extends xn {
  constructor(e2, n5, r3, o4) {
    super(), this.blockLen = e2, this.outputLen = n5, this.padOffset = r3, this.isLE = o4, this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.buffer = new Uint8Array(e2), this.view = _t(this.buffer);
  }
  update(e2) {
    De2(this);
    const { view: n5, buffer: r3, blockLen: o4 } = this;
    e2 = de2(e2);
    const s2 = e2.length;
    for (let a3 = 0; a3 < s2; ) {
      const u2 = Math.min(o4 - this.pos, s2 - a3);
      if (u2 === o4) {
        const i3 = _t(e2);
        for (; o4 <= s2 - a3; a3 += o4) this.process(i3, a3);
        continue;
      }
      r3.set(e2.subarray(a3, a3 + u2), this.pos), this.pos += u2, a3 += u2, this.pos === o4 && (this.process(n5, 0), this.pos = 0);
    }
    return this.length += e2.length, this.roundClean(), this;
  }
  digestInto(e2) {
    De2(this), gn(e2, this), this.finished = true;
    const { buffer: n5, view: r3, blockLen: o4, isLE: s2 } = this;
    let { pos: a3 } = this;
    n5[a3++] = 128, this.buffer.subarray(a3).fill(0), this.padOffset > o4 - a3 && (this.process(r3, 0), a3 = 0);
    for (let l6 = a3; l6 < o4; l6++) n5[l6] = 0;
    Cn(r3, o4 - 8, BigInt(this.length * 8), s2), this.process(r3, 0);
    const u2 = _t(e2), i3 = this.outputLen;
    if (i3 % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const D2 = i3 / 4, c5 = this.get();
    if (D2 > c5.length) throw new Error("_sha2: outputLen bigger than state");
    for (let l6 = 0; l6 < D2; l6++) u2.setUint32(4 * l6, c5[l6], s2);
  }
  digest() {
    const { buffer: e2, outputLen: n5 } = this;
    this.digestInto(e2);
    const r3 = e2.slice(0, n5);
    return this.destroy(), r3;
  }
  _cloneInto(e2) {
    e2 || (e2 = new this.constructor()), e2.set(...this.get());
    const { blockLen: n5, buffer: r3, length: o4, finished: s2, destroyed: a3, pos: u2 } = this;
    return e2.length = o4, e2.pos = u2, e2.finished = s2, e2.destroyed = a3, o4 % n5 && e2.buffer.set(r3), e2;
  }
};
var wt = BigInt(2 ** 32 - 1);
var St = BigInt(32);
function le2(t, e2 = false) {
  return e2 ? { h: Number(t & wt), l: Number(t >> St & wt) } : { h: Number(t >> St & wt) | 0, l: Number(t & wt) | 0 };
}
function mn(t, e2 = false) {
  let n5 = new Uint32Array(t.length), r3 = new Uint32Array(t.length);
  for (let o4 = 0; o4 < t.length; o4++) {
    const { h: s2, l: a3 } = le2(t[o4], e2);
    [n5[o4], r3[o4]] = [s2, a3];
  }
  return [n5, r3];
}
var _n = (t, e2) => BigInt(t >>> 0) << St | BigInt(e2 >>> 0);
var Sn = (t, e2, n5) => t >>> n5;
var vn = (t, e2, n5) => t << 32 - n5 | e2 >>> n5;
var In = (t, e2, n5) => t >>> n5 | e2 << 32 - n5;
var Un = (t, e2, n5) => t << 32 - n5 | e2 >>> n5;
var Tn = (t, e2, n5) => t << 64 - n5 | e2 >>> n5 - 32;
var Fn = (t, e2, n5) => t >>> n5 - 32 | e2 << 64 - n5;
var Nn = (t, e2) => e2;
var Ln = (t, e2) => t;
var On = (t, e2, n5) => t << n5 | e2 >>> 32 - n5;
var Hn = (t, e2, n5) => e2 << n5 | t >>> 32 - n5;
var zn = (t, e2, n5) => e2 << n5 - 32 | t >>> 64 - n5;
var Mn = (t, e2, n5) => t << n5 - 32 | e2 >>> 64 - n5;
function qn(t, e2, n5, r3) {
  const o4 = (e2 >>> 0) + (r3 >>> 0);
  return { h: t + n5 + (o4 / 2 ** 32 | 0) | 0, l: o4 | 0 };
}
var $n = (t, e2, n5) => (t >>> 0) + (e2 >>> 0) + (n5 >>> 0);
var kn = (t, e2, n5, r3) => e2 + n5 + r3 + (t / 2 ** 32 | 0) | 0;
var Rn = (t, e2, n5, r3) => (t >>> 0) + (e2 >>> 0) + (n5 >>> 0) + (r3 >>> 0);
var jn = (t, e2, n5, r3, o4) => e2 + n5 + r3 + o4 + (t / 2 ** 32 | 0) | 0;
var Zn = (t, e2, n5, r3, o4) => (t >>> 0) + (e2 >>> 0) + (n5 >>> 0) + (r3 >>> 0) + (o4 >>> 0);
var Gn = (t, e2, n5, r3, o4, s2) => e2 + n5 + r3 + o4 + s2 + (t / 2 ** 32 | 0) | 0;
var x3 = { fromBig: le2, split: mn, toBig: _n, shrSH: Sn, shrSL: vn, rotrSH: In, rotrSL: Un, rotrBH: Tn, rotrBL: Fn, rotr32H: Nn, rotr32L: Ln, rotlSH: On, rotlSL: Hn, rotlBH: zn, rotlBL: Mn, add: qn, add3L: $n, add3H: kn, add4L: Rn, add4H: jn, add5H: Gn, add5L: Zn };
var [Vn, Yn] = (() => x3.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((t) => BigInt(t))))();
var P3 = new Uint32Array(80);
var Q2 = new Uint32Array(80);
var Jn = class extends An {
  constructor() {
    super(128, 64, 16, false), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  get() {
    const { Ah: e2, Al: n5, Bh: r3, Bl: o4, Ch: s2, Cl: a3, Dh: u2, Dl: i3, Eh: D2, El: c5, Fh: l6, Fl: p3, Gh: w3, Gl: h4, Hh: g2, Hl: S4 } = this;
    return [e2, n5, r3, o4, s2, a3, u2, i3, D2, c5, l6, p3, w3, h4, g2, S4];
  }
  set(e2, n5, r3, o4, s2, a3, u2, i3, D2, c5, l6, p3, w3, h4, g2, S4) {
    this.Ah = e2 | 0, this.Al = n5 | 0, this.Bh = r3 | 0, this.Bl = o4 | 0, this.Ch = s2 | 0, this.Cl = a3 | 0, this.Dh = u2 | 0, this.Dl = i3 | 0, this.Eh = D2 | 0, this.El = c5 | 0, this.Fh = l6 | 0, this.Fl = p3 | 0, this.Gh = w3 | 0, this.Gl = h4 | 0, this.Hh = g2 | 0, this.Hl = S4 | 0;
  }
  process(e2, n5) {
    for (let d4 = 0; d4 < 16; d4++, n5 += 4) P3[d4] = e2.getUint32(n5), Q2[d4] = e2.getUint32(n5 += 4);
    for (let d4 = 16; d4 < 80; d4++) {
      const m3 = P3[d4 - 15] | 0, F = Q2[d4 - 15] | 0, q3 = x3.rotrSH(m3, F, 1) ^ x3.rotrSH(m3, F, 8) ^ x3.shrSH(m3, F, 7), z4 = x3.rotrSL(m3, F, 1) ^ x3.rotrSL(m3, F, 8) ^ x3.shrSL(m3, F, 7), I3 = P3[d4 - 2] | 0, O4 = Q2[d4 - 2] | 0, ot2 = x3.rotrSH(I3, O4, 19) ^ x3.rotrBH(I3, O4, 61) ^ x3.shrSH(I3, O4, 6), tt3 = x3.rotrSL(I3, O4, 19) ^ x3.rotrBL(I3, O4, 61) ^ x3.shrSL(I3, O4, 6), st3 = x3.add4L(z4, tt3, Q2[d4 - 7], Q2[d4 - 16]), at = x3.add4H(st3, q3, ot2, P3[d4 - 7], P3[d4 - 16]);
      P3[d4] = at | 0, Q2[d4] = st3 | 0;
    }
    let { Ah: r3, Al: o4, Bh: s2, Bl: a3, Ch: u2, Cl: i3, Dh: D2, Dl: c5, Eh: l6, El: p3, Fh: w3, Fl: h4, Gh: g2, Gl: S4, Hh: v5, Hl: L2 } = this;
    for (let d4 = 0; d4 < 80; d4++) {
      const m3 = x3.rotrSH(l6, p3, 14) ^ x3.rotrSH(l6, p3, 18) ^ x3.rotrBH(l6, p3, 41), F = x3.rotrSL(l6, p3, 14) ^ x3.rotrSL(l6, p3, 18) ^ x3.rotrBL(l6, p3, 41), q3 = l6 & w3 ^ ~l6 & g2, z4 = p3 & h4 ^ ~p3 & S4, I3 = x3.add5L(L2, F, z4, Yn[d4], Q2[d4]), O4 = x3.add5H(I3, v5, m3, q3, Vn[d4], P3[d4]), ot2 = I3 | 0, tt3 = x3.rotrSH(r3, o4, 28) ^ x3.rotrBH(r3, o4, 34) ^ x3.rotrBH(r3, o4, 39), st3 = x3.rotrSL(r3, o4, 28) ^ x3.rotrBL(r3, o4, 34) ^ x3.rotrBL(r3, o4, 39), at = r3 & s2 ^ r3 & u2 ^ s2 & u2, Ct3 = o4 & a3 ^ o4 & i3 ^ a3 & i3;
      v5 = g2 | 0, L2 = S4 | 0, g2 = w3 | 0, S4 = h4 | 0, w3 = l6 | 0, h4 = p3 | 0, { h: l6, l: p3 } = x3.add(D2 | 0, c5 | 0, O4 | 0, ot2 | 0), D2 = u2 | 0, c5 = i3 | 0, u2 = s2 | 0, i3 = a3 | 0, s2 = r3 | 0, a3 = o4 | 0;
      const At3 = x3.add3L(ot2, st3, Ct3);
      r3 = x3.add3H(At3, O4, tt3, at), o4 = At3 | 0;
    }
    ({ h: r3, l: o4 } = x3.add(this.Ah | 0, this.Al | 0, r3 | 0, o4 | 0)), { h: s2, l: a3 } = x3.add(this.Bh | 0, this.Bl | 0, s2 | 0, a3 | 0), { h: u2, l: i3 } = x3.add(this.Ch | 0, this.Cl | 0, u2 | 0, i3 | 0), { h: D2, l: c5 } = x3.add(this.Dh | 0, this.Dl | 0, D2 | 0, c5 | 0), { h: l6, l: p3 } = x3.add(this.Eh | 0, this.El | 0, l6 | 0, p3 | 0), { h: w3, l: h4 } = x3.add(this.Fh | 0, this.Fl | 0, w3 | 0, h4 | 0), { h: g2, l: S4 } = x3.add(this.Gh | 0, this.Gl | 0, g2 | 0, S4 | 0), { h: v5, l: L2 } = x3.add(this.Hh | 0, this.Hl | 0, v5 | 0, L2 | 0), this.set(r3, o4, s2, a3, u2, i3, D2, c5, l6, p3, w3, h4, g2, S4, v5, L2);
  }
  roundClean() {
    P3.fill(0), Q2.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var Kn = Bn(() => new Jn());
var vt = BigInt(0);
var be2 = BigInt(1);
var Wn = BigInt(2);
function It(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ut(t) {
  if (!It(t)) throw new Error("Uint8Array expected");
}
function Tt(t, e2) {
  if (typeof e2 != "boolean") throw new Error(t + " boolean expected, got " + e2);
}
var Xn = Array.from({ length: 256 }, (t, e2) => e2.toString(16).padStart(2, "0"));
function Ft(t) {
  Ut(t);
  let e2 = "";
  for (let n5 = 0; n5 < t.length; n5++) e2 += Xn[t[n5]];
  return e2;
}
function pe2(t) {
  if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
  return t === "" ? vt : BigInt("0x" + t);
}
var K3 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function we2(t) {
  if (t >= K3._0 && t <= K3._9) return t - K3._0;
  if (t >= K3.A && t <= K3.F) return t - (K3.A - 10);
  if (t >= K3.a && t <= K3.f) return t - (K3.a - 10);
}
function Ee2(t) {
  if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
  const e2 = t.length, n5 = e2 / 2;
  if (e2 % 2) throw new Error("hex string expected, got unpadded hex of length " + e2);
  const r3 = new Uint8Array(n5);
  for (let o4 = 0, s2 = 0; o4 < n5; o4++, s2 += 2) {
    const a3 = we2(t.charCodeAt(s2)), u2 = we2(t.charCodeAt(s2 + 1));
    if (a3 === void 0 || u2 === void 0) {
      const i3 = t[s2] + t[s2 + 1];
      throw new Error('hex string expected, got non-hex character "' + i3 + '" at index ' + s2);
    }
    r3[o4] = a3 * 16 + u2;
  }
  return r3;
}
function Pn(t) {
  return pe2(Ft(t));
}
function Et(t) {
  return Ut(t), pe2(Ft(Uint8Array.from(t).reverse()));
}
function ge2(t, e2) {
  return Ee2(t.toString(16).padStart(e2 * 2, "0"));
}
function Nt(t, e2) {
  return ge2(t, e2).reverse();
}
function W2(t, e2, n5) {
  let r3;
  if (typeof e2 == "string") try {
    r3 = Ee2(e2);
  } catch (s2) {
    throw new Error(t + " must be hex string or Uint8Array, cause: " + s2);
  }
  else if (It(e2)) r3 = Uint8Array.from(e2);
  else throw new Error(t + " must be hex string or Uint8Array");
  const o4 = r3.length;
  if (typeof n5 == "number" && o4 !== n5) throw new Error(t + " of length " + n5 + " expected, got " + o4);
  return r3;
}
function ye2(...t) {
  let e2 = 0;
  for (let r3 = 0; r3 < t.length; r3++) {
    const o4 = t[r3];
    Ut(o4), e2 += o4.length;
  }
  const n5 = new Uint8Array(e2);
  for (let r3 = 0, o4 = 0; r3 < t.length; r3++) {
    const s2 = t[r3];
    n5.set(s2, o4), o4 += s2.length;
  }
  return n5;
}
var Lt = (t) => typeof t == "bigint" && vt <= t;
function Qn(t, e2, n5) {
  return Lt(t) && Lt(e2) && Lt(n5) && e2 <= t && t < n5;
}
function ft(t, e2, n5, r3) {
  if (!Qn(e2, n5, r3)) throw new Error("expected valid " + t + ": " + n5 + " <= n < " + r3 + ", got " + e2);
}
function tr(t) {
  let e2;
  for (e2 = 0; t > vt; t >>= be2, e2 += 1) ;
  return e2;
}
var er = (t) => (Wn << BigInt(t - 1)) - be2;
var nr = { bigint: (t) => typeof t == "bigint", function: (t) => typeof t == "function", boolean: (t) => typeof t == "boolean", string: (t) => typeof t == "string", stringOrUint8Array: (t) => typeof t == "string" || It(t), isSafeInteger: (t) => Number.isSafeInteger(t), array: (t) => Array.isArray(t), field: (t, e2) => e2.Fp.isValid(t), hash: (t) => typeof t == "function" && Number.isSafeInteger(t.outputLen) };
function Ot(t, e2, n5 = {}) {
  const r3 = (o4, s2, a3) => {
    const u2 = nr[s2];
    if (typeof u2 != "function") throw new Error("invalid validator function");
    const i3 = t[o4];
    if (!(a3 && i3 === void 0) && !u2(i3, t)) throw new Error("param " + String(o4) + " is invalid. Expected " + s2 + ", got " + i3);
  };
  for (const [o4, s2] of Object.entries(e2)) r3(o4, s2, false);
  for (const [o4, s2] of Object.entries(n5)) r3(o4, s2, true);
  return t;
}
function xe2(t) {
  const e2 = /* @__PURE__ */ new WeakMap();
  return (n5, ...r3) => {
    const o4 = e2.get(n5);
    if (o4 !== void 0) return o4;
    const s2 = t(n5, ...r3);
    return e2.set(n5, s2), s2;
  };
}
var M2 = BigInt(0);
var N3 = BigInt(1);
var nt = BigInt(2);
var rr = BigInt(3);
var Ht = BigInt(4);
var Be2 = BigInt(5);
var Ce2 = BigInt(8);
function H2(t, e2) {
  const n5 = t % e2;
  return n5 >= M2 ? n5 : e2 + n5;
}
function or(t, e2, n5) {
  if (e2 < M2) throw new Error("invalid exponent, negatives unsupported");
  if (n5 <= M2) throw new Error("invalid modulus");
  if (n5 === N3) return M2;
  let r3 = N3;
  for (; e2 > M2; ) e2 & N3 && (r3 = r3 * t % n5), t = t * t % n5, e2 >>= N3;
  return r3;
}
function J2(t, e2, n5) {
  let r3 = t;
  for (; e2-- > M2; ) r3 *= r3, r3 %= n5;
  return r3;
}
function Ae2(t, e2) {
  if (t === M2) throw new Error("invert: expected non-zero number");
  if (e2 <= M2) throw new Error("invert: expected positive modulus, got " + e2);
  let n5 = H2(t, e2), r3 = e2, o4 = M2, s2 = N3;
  for (; n5 !== M2; ) {
    const u2 = r3 / n5, i3 = r3 % n5, D2 = o4 - s2 * u2;
    r3 = n5, n5 = i3, o4 = s2, s2 = D2;
  }
  if (r3 !== N3) throw new Error("invert: does not exist");
  return H2(o4, e2);
}
function sr(t) {
  const e2 = (t - N3) / nt;
  let n5, r3, o4;
  for (n5 = t - N3, r3 = 0; n5 % nt === M2; n5 /= nt, r3++) ;
  for (o4 = nt; o4 < t && or(o4, e2, t) !== t - N3; o4++) if (o4 > 1e3) throw new Error("Cannot find square root: likely non-prime P");
  if (r3 === 1) {
    const a3 = (t + N3) / Ht;
    return function(i3, D2) {
      const c5 = i3.pow(D2, a3);
      if (!i3.eql(i3.sqr(c5), D2)) throw new Error("Cannot find square root");
      return c5;
    };
  }
  const s2 = (n5 + N3) / nt;
  return function(u2, i3) {
    if (u2.pow(i3, e2) === u2.neg(u2.ONE)) throw new Error("Cannot find square root");
    let D2 = r3, c5 = u2.pow(u2.mul(u2.ONE, o4), n5), l6 = u2.pow(i3, s2), p3 = u2.pow(i3, n5);
    for (; !u2.eql(p3, u2.ONE); ) {
      if (u2.eql(p3, u2.ZERO)) return u2.ZERO;
      let w3 = 1;
      for (let g2 = u2.sqr(p3); w3 < D2 && !u2.eql(g2, u2.ONE); w3++) g2 = u2.sqr(g2);
      const h4 = u2.pow(c5, N3 << BigInt(D2 - w3 - 1));
      c5 = u2.sqr(h4), l6 = u2.mul(l6, h4), p3 = u2.mul(p3, c5), D2 = w3;
    }
    return l6;
  };
}
function ir(t) {
  if (t % Ht === rr) {
    const e2 = (t + N3) / Ht;
    return function(r3, o4) {
      const s2 = r3.pow(o4, e2);
      if (!r3.eql(r3.sqr(s2), o4)) throw new Error("Cannot find square root");
      return s2;
    };
  }
  if (t % Ce2 === Be2) {
    const e2 = (t - Be2) / Ce2;
    return function(r3, o4) {
      const s2 = r3.mul(o4, nt), a3 = r3.pow(s2, e2), u2 = r3.mul(o4, a3), i3 = r3.mul(r3.mul(u2, nt), a3), D2 = r3.mul(u2, r3.sub(i3, r3.ONE));
      if (!r3.eql(r3.sqr(D2), o4)) throw new Error("Cannot find square root");
      return D2;
    };
  }
  return sr(t);
}
var ur = (t, e2) => (H2(t, e2) & N3) === N3;
var cr = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
function ar(t) {
  const e2 = { ORDER: "bigint", MASK: "bigint", BYTES: "isSafeInteger", BITS: "isSafeInteger" }, n5 = cr.reduce((r3, o4) => (r3[o4] = "function", r3), e2);
  return Ot(t, n5);
}
function fr(t, e2, n5) {
  if (n5 < M2) throw new Error("invalid exponent, negatives unsupported");
  if (n5 === M2) return t.ONE;
  if (n5 === N3) return e2;
  let r3 = t.ONE, o4 = e2;
  for (; n5 > M2; ) n5 & N3 && (r3 = t.mul(r3, o4)), o4 = t.sqr(o4), n5 >>= N3;
  return r3;
}
function Dr(t, e2) {
  const n5 = new Array(e2.length), r3 = e2.reduce((s2, a3, u2) => t.is0(a3) ? s2 : (n5[u2] = s2, t.mul(s2, a3)), t.ONE), o4 = t.inv(r3);
  return e2.reduceRight((s2, a3, u2) => t.is0(a3) ? s2 : (n5[u2] = t.mul(s2, n5[u2]), t.mul(s2, a3)), o4), n5;
}
function me2(t, e2) {
  const n5 = e2 !== void 0 ? e2 : t.toString(2).length, r3 = Math.ceil(n5 / 8);
  return { nBitLength: n5, nByteLength: r3 };
}
function _e2(t, e2, n5 = false, r3 = {}) {
  if (t <= M2) throw new Error("invalid field: expected ORDER > 0, got " + t);
  const { nBitLength: o4, nByteLength: s2 } = me2(t, e2);
  if (s2 > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let a3;
  const u2 = Object.freeze({ ORDER: t, isLE: n5, BITS: o4, BYTES: s2, MASK: er(o4), ZERO: M2, ONE: N3, create: (i3) => H2(i3, t), isValid: (i3) => {
    if (typeof i3 != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof i3);
    return M2 <= i3 && i3 < t;
  }, is0: (i3) => i3 === M2, isOdd: (i3) => (i3 & N3) === N3, neg: (i3) => H2(-i3, t), eql: (i3, D2) => i3 === D2, sqr: (i3) => H2(i3 * i3, t), add: (i3, D2) => H2(i3 + D2, t), sub: (i3, D2) => H2(i3 - D2, t), mul: (i3, D2) => H2(i3 * D2, t), pow: (i3, D2) => fr(u2, i3, D2), div: (i3, D2) => H2(i3 * Ae2(D2, t), t), sqrN: (i3) => i3 * i3, addN: (i3, D2) => i3 + D2, subN: (i3, D2) => i3 - D2, mulN: (i3, D2) => i3 * D2, inv: (i3) => Ae2(i3, t), sqrt: r3.sqrt || ((i3) => (a3 || (a3 = ir(t)), a3(u2, i3))), invertBatch: (i3) => Dr(u2, i3), cmov: (i3, D2, c5) => c5 ? D2 : i3, toBytes: (i3) => n5 ? Nt(i3, s2) : ge2(i3, s2), fromBytes: (i3) => {
    if (i3.length !== s2) throw new Error("Field.fromBytes: expected " + s2 + " bytes, got " + i3.length);
    return n5 ? Et(i3) : Pn(i3);
  } });
  return Object.freeze(u2);
}
var Se2 = BigInt(0);
var gt = BigInt(1);
function zt(t, e2) {
  const n5 = e2.negate();
  return t ? n5 : e2;
}
function ve2(t, e2) {
  if (!Number.isSafeInteger(t) || t <= 0 || t > e2) throw new Error("invalid window size, expected [1.." + e2 + "], got W=" + t);
}
function Mt(t, e2) {
  ve2(t, e2);
  const n5 = Math.ceil(e2 / t) + 1, r3 = 2 ** (t - 1);
  return { windows: n5, windowSize: r3 };
}
function dr(t, e2) {
  if (!Array.isArray(t)) throw new Error("array expected");
  t.forEach((n5, r3) => {
    if (!(n5 instanceof e2)) throw new Error("invalid point at index " + r3);
  });
}
function hr(t, e2) {
  if (!Array.isArray(t)) throw new Error("array of scalars expected");
  t.forEach((n5, r3) => {
    if (!e2.isValid(n5)) throw new Error("invalid scalar at index " + r3);
  });
}
var qt = /* @__PURE__ */ new WeakMap();
var Ie2 = /* @__PURE__ */ new WeakMap();
function $t(t) {
  return Ie2.get(t) || 1;
}
function lr(t, e2) {
  return { constTimeNegate: zt, hasPrecomputes(n5) {
    return $t(n5) !== 1;
  }, unsafeLadder(n5, r3, o4 = t.ZERO) {
    let s2 = n5;
    for (; r3 > Se2; ) r3 & gt && (o4 = o4.add(s2)), s2 = s2.double(), r3 >>= gt;
    return o4;
  }, precomputeWindow(n5, r3) {
    const { windows: o4, windowSize: s2 } = Mt(r3, e2), a3 = [];
    let u2 = n5, i3 = u2;
    for (let D2 = 0; D2 < o4; D2++) {
      i3 = u2, a3.push(i3);
      for (let c5 = 1; c5 < s2; c5++) i3 = i3.add(u2), a3.push(i3);
      u2 = i3.double();
    }
    return a3;
  }, wNAF(n5, r3, o4) {
    const { windows: s2, windowSize: a3 } = Mt(n5, e2);
    let u2 = t.ZERO, i3 = t.BASE;
    const D2 = BigInt(2 ** n5 - 1), c5 = 2 ** n5, l6 = BigInt(n5);
    for (let p3 = 0; p3 < s2; p3++) {
      const w3 = p3 * a3;
      let h4 = Number(o4 & D2);
      o4 >>= l6, h4 > a3 && (h4 -= c5, o4 += gt);
      const g2 = w3, S4 = w3 + Math.abs(h4) - 1, v5 = p3 % 2 !== 0, L2 = h4 < 0;
      h4 === 0 ? i3 = i3.add(zt(v5, r3[g2])) : u2 = u2.add(zt(L2, r3[S4]));
    }
    return { p: u2, f: i3 };
  }, wNAFUnsafe(n5, r3, o4, s2 = t.ZERO) {
    const { windows: a3, windowSize: u2 } = Mt(n5, e2), i3 = BigInt(2 ** n5 - 1), D2 = 2 ** n5, c5 = BigInt(n5);
    for (let l6 = 0; l6 < a3; l6++) {
      const p3 = l6 * u2;
      if (o4 === Se2) break;
      let w3 = Number(o4 & i3);
      if (o4 >>= c5, w3 > u2 && (w3 -= D2, o4 += gt), w3 === 0) continue;
      let h4 = r3[p3 + Math.abs(w3) - 1];
      w3 < 0 && (h4 = h4.negate()), s2 = s2.add(h4);
    }
    return s2;
  }, getPrecomputes(n5, r3, o4) {
    let s2 = qt.get(r3);
    return s2 || (s2 = this.precomputeWindow(r3, n5), n5 !== 1 && qt.set(r3, o4(s2))), s2;
  }, wNAFCached(n5, r3, o4) {
    const s2 = $t(n5);
    return this.wNAF(s2, this.getPrecomputes(s2, n5, o4), r3);
  }, wNAFCachedUnsafe(n5, r3, o4, s2) {
    const a3 = $t(n5);
    return a3 === 1 ? this.unsafeLadder(n5, r3, s2) : this.wNAFUnsafe(a3, this.getPrecomputes(a3, n5, o4), r3, s2);
  }, setWindowSize(n5, r3) {
    ve2(r3, e2), Ie2.set(n5, r3), qt.delete(n5);
  } };
}
function br(t, e2, n5, r3) {
  if (dr(n5, t), hr(r3, e2), n5.length !== r3.length) throw new Error("arrays of points and scalars must have equal length");
  const o4 = t.ZERO, s2 = tr(BigInt(n5.length)), a3 = s2 > 12 ? s2 - 3 : s2 > 4 ? s2 - 2 : s2 ? 2 : 1, u2 = (1 << a3) - 1, i3 = new Array(u2 + 1).fill(o4), D2 = Math.floor((e2.BITS - 1) / a3) * a3;
  let c5 = o4;
  for (let l6 = D2; l6 >= 0; l6 -= a3) {
    i3.fill(o4);
    for (let w3 = 0; w3 < r3.length; w3++) {
      const h4 = r3[w3], g2 = Number(h4 >> BigInt(l6) & BigInt(u2));
      i3[g2] = i3[g2].add(n5[w3]);
    }
    let p3 = o4;
    for (let w3 = i3.length - 1, h4 = o4; w3 > 0; w3--) h4 = h4.add(i3[w3]), p3 = p3.add(h4);
    if (c5 = c5.add(p3), l6 !== 0) for (let w3 = 0; w3 < a3; w3++) c5 = c5.double();
  }
  return c5;
}
function pr(t) {
  return ar(t.Fp), Ot(t, { n: "bigint", h: "bigint", Gx: "field", Gy: "field" }, { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" }), Object.freeze({ ...me2(t.n, t.nBitLength), ...t, p: t.Fp.ORDER });
}
var G2 = BigInt(0);
var j3 = BigInt(1);
var yt = BigInt(2);
var wr = BigInt(8);
var Er = { zip215: true };
function gr(t) {
  const e2 = pr(t);
  return Ot(t, { hash: "function", a: "bigint", d: "bigint", randomBytes: "function" }, { adjustScalarBytes: "function", domain: "function", uvRatio: "function", mapToCurve: "function" }), Object.freeze({ ...e2 });
}
function yr(t) {
  const e2 = gr(t), { Fp: n5, n: r3, prehash: o4, hash: s2, randomBytes: a3, nByteLength: u2, h: i3 } = e2, D2 = yt << BigInt(u2 * 8) - j3, c5 = n5.create, l6 = _e2(e2.n, e2.nBitLength), p3 = e2.uvRatio || ((y4, f4) => {
    try {
      return { isValid: true, value: n5.sqrt(y4 * n5.inv(f4)) };
    } catch {
      return { isValid: false, value: G2 };
    }
  }), w3 = e2.adjustScalarBytes || ((y4) => y4), h4 = e2.domain || ((y4, f4, b5) => {
    if (Tt("phflag", b5), f4.length || b5) throw new Error("Contexts/pre-hash are not supported");
    return y4;
  });
  function g2(y4, f4) {
    ft("coordinate " + y4, f4, G2, D2);
  }
  function S4(y4) {
    if (!(y4 instanceof d4)) throw new Error("ExtendedPoint expected");
  }
  const v5 = xe2((y4, f4) => {
    const { ex: b5, ey: E3, ez: B2 } = y4, C4 = y4.is0();
    f4 == null && (f4 = C4 ? wr : n5.inv(B2));
    const A3 = c5(b5 * f4), U3 = c5(E3 * f4), _3 = c5(B2 * f4);
    if (C4) return { x: G2, y: j3 };
    if (_3 !== j3) throw new Error("invZ was invalid");
    return { x: A3, y: U3 };
  }), L2 = xe2((y4) => {
    const { a: f4, d: b5 } = e2;
    if (y4.is0()) throw new Error("bad point: ZERO");
    const { ex: E3, ey: B2, ez: C4, et: A3 } = y4, U3 = c5(E3 * E3), _3 = c5(B2 * B2), T3 = c5(C4 * C4), $3 = c5(T3 * T3), R4 = c5(U3 * f4), V4 = c5(T3 * c5(R4 + _3)), Y3 = c5($3 + c5(b5 * c5(U3 * _3)));
    if (V4 !== Y3) throw new Error("bad point: equation left != right (1)");
    const Z2 = c5(E3 * B2), X4 = c5(C4 * A3);
    if (Z2 !== X4) throw new Error("bad point: equation left != right (2)");
    return true;
  });
  class d4 {
    constructor(f4, b5, E3, B2) {
      this.ex = f4, this.ey = b5, this.ez = E3, this.et = B2, g2("x", f4), g2("y", b5), g2("z", E3), g2("t", B2), Object.freeze(this);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static fromAffine(f4) {
      if (f4 instanceof d4) throw new Error("extended point not allowed");
      const { x: b5, y: E3 } = f4 || {};
      return g2("x", b5), g2("y", E3), new d4(b5, E3, j3, c5(b5 * E3));
    }
    static normalizeZ(f4) {
      const b5 = n5.invertBatch(f4.map((E3) => E3.ez));
      return f4.map((E3, B2) => E3.toAffine(b5[B2])).map(d4.fromAffine);
    }
    static msm(f4, b5) {
      return br(d4, l6, f4, b5);
    }
    _setWindowSize(f4) {
      q3.setWindowSize(this, f4);
    }
    assertValidity() {
      L2(this);
    }
    equals(f4) {
      S4(f4);
      const { ex: b5, ey: E3, ez: B2 } = this, { ex: C4, ey: A3, ez: U3 } = f4, _3 = c5(b5 * U3), T3 = c5(C4 * B2), $3 = c5(E3 * U3), R4 = c5(A3 * B2);
      return _3 === T3 && $3 === R4;
    }
    is0() {
      return this.equals(d4.ZERO);
    }
    negate() {
      return new d4(c5(-this.ex), this.ey, this.ez, c5(-this.et));
    }
    double() {
      const { a: f4 } = e2, { ex: b5, ey: E3, ez: B2 } = this, C4 = c5(b5 * b5), A3 = c5(E3 * E3), U3 = c5(yt * c5(B2 * B2)), _3 = c5(f4 * C4), T3 = b5 + E3, $3 = c5(c5(T3 * T3) - C4 - A3), R4 = _3 + A3, V4 = R4 - U3, Y3 = _3 - A3, Z2 = c5($3 * V4), X4 = c5(R4 * Y3), et3 = c5($3 * Y3), pt3 = c5(V4 * R4);
      return new d4(Z2, X4, pt3, et3);
    }
    add(f4) {
      S4(f4);
      const { a: b5, d: E3 } = e2, { ex: B2, ey: C4, ez: A3, et: U3 } = this, { ex: _3, ey: T3, ez: $3, et: R4 } = f4;
      if (b5 === BigInt(-1)) {
        const re4 = c5((C4 - B2) * (T3 + _3)), oe4 = c5((C4 + B2) * (T3 - _3)), mt3 = c5(oe4 - re4);
        if (mt3 === G2) return this.double();
        const se4 = c5(A3 * yt * R4), ie4 = c5(U3 * yt * $3), ue2 = ie4 + se4, ce3 = oe4 + re4, ae4 = ie4 - se4, Dn3 = c5(ue2 * mt3), dn3 = c5(ce3 * ae4), hn3 = c5(ue2 * ae4), ln3 = c5(mt3 * ce3);
        return new d4(Dn3, dn3, ln3, hn3);
      }
      const V4 = c5(B2 * _3), Y3 = c5(C4 * T3), Z2 = c5(U3 * E3 * R4), X4 = c5(A3 * $3), et3 = c5((B2 + C4) * (_3 + T3) - V4 - Y3), pt3 = X4 - Z2, ee4 = X4 + Z2, ne3 = c5(Y3 - b5 * V4), un3 = c5(et3 * pt3), cn3 = c5(ee4 * ne3), an3 = c5(et3 * ne3), fn3 = c5(pt3 * ee4);
      return new d4(un3, cn3, fn3, an3);
    }
    subtract(f4) {
      return this.add(f4.negate());
    }
    wNAF(f4) {
      return q3.wNAFCached(this, f4, d4.normalizeZ);
    }
    multiply(f4) {
      const b5 = f4;
      ft("scalar", b5, j3, r3);
      const { p: E3, f: B2 } = this.wNAF(b5);
      return d4.normalizeZ([E3, B2])[0];
    }
    multiplyUnsafe(f4, b5 = d4.ZERO) {
      const E3 = f4;
      return ft("scalar", E3, G2, r3), E3 === G2 ? F : this.is0() || E3 === j3 ? this : q3.wNAFCachedUnsafe(this, E3, d4.normalizeZ, b5);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(i3).is0();
    }
    isTorsionFree() {
      return q3.unsafeLadder(this, r3).is0();
    }
    toAffine(f4) {
      return v5(this, f4);
    }
    clearCofactor() {
      const { h: f4 } = e2;
      return f4 === j3 ? this : this.multiplyUnsafe(f4);
    }
    static fromHex(f4, b5 = false) {
      const { d: E3, a: B2 } = e2, C4 = n5.BYTES;
      f4 = W2("pointHex", f4, C4), Tt("zip215", b5);
      const A3 = f4.slice(), U3 = f4[C4 - 1];
      A3[C4 - 1] = U3 & -129;
      const _3 = Et(A3), T3 = b5 ? D2 : n5.ORDER;
      ft("pointHex.y", _3, G2, T3);
      const $3 = c5(_3 * _3), R4 = c5($3 - j3), V4 = c5(E3 * $3 - B2);
      let { isValid: Y3, value: Z2 } = p3(R4, V4);
      if (!Y3) throw new Error("Point.fromHex: invalid y coordinate");
      const X4 = (Z2 & j3) === j3, et3 = (U3 & 128) !== 0;
      if (!b5 && Z2 === G2 && et3) throw new Error("Point.fromHex: x=0 and x_0=1");
      return et3 !== X4 && (Z2 = c5(-Z2)), d4.fromAffine({ x: Z2, y: _3 });
    }
    static fromPrivateKey(f4) {
      return O4(f4).point;
    }
    toRawBytes() {
      const { x: f4, y: b5 } = this.toAffine(), E3 = Nt(b5, n5.BYTES);
      return E3[E3.length - 1] |= f4 & j3 ? 128 : 0, E3;
    }
    toHex() {
      return Ft(this.toRawBytes());
    }
  }
  d4.BASE = new d4(e2.Gx, e2.Gy, j3, c5(e2.Gx * e2.Gy)), d4.ZERO = new d4(G2, j3, j3, G2);
  const { BASE: m3, ZERO: F } = d4, q3 = lr(d4, u2 * 8);
  function z4(y4) {
    return H2(y4, r3);
  }
  function I3(y4) {
    return z4(Et(y4));
  }
  function O4(y4) {
    const f4 = n5.BYTES;
    y4 = W2("private key", y4, f4);
    const b5 = W2("hashed private key", s2(y4), 2 * f4), E3 = w3(b5.slice(0, f4)), B2 = b5.slice(f4, 2 * f4), C4 = I3(E3), A3 = m3.multiply(C4), U3 = A3.toRawBytes();
    return { head: E3, prefix: B2, scalar: C4, point: A3, pointBytes: U3 };
  }
  function ot2(y4) {
    return O4(y4).pointBytes;
  }
  function tt3(y4 = new Uint8Array(), ...f4) {
    const b5 = ye2(...f4);
    return I3(s2(h4(b5, W2("context", y4), !!o4)));
  }
  function st3(y4, f4, b5 = {}) {
    y4 = W2("message", y4), o4 && (y4 = o4(y4));
    const { prefix: E3, scalar: B2, pointBytes: C4 } = O4(f4), A3 = tt3(b5.context, E3, y4), U3 = m3.multiply(A3).toRawBytes(), _3 = tt3(b5.context, U3, C4, y4), T3 = z4(A3 + _3 * B2);
    ft("signature.s", T3, G2, r3);
    const $3 = ye2(U3, Nt(T3, n5.BYTES));
    return W2("result", $3, n5.BYTES * 2);
  }
  const at = Er;
  function Ct3(y4, f4, b5, E3 = at) {
    const { context: B2, zip215: C4 } = E3, A3 = n5.BYTES;
    y4 = W2("signature", y4, 2 * A3), f4 = W2("message", f4), b5 = W2("publicKey", b5, A3), C4 !== void 0 && Tt("zip215", C4), o4 && (f4 = o4(f4));
    const U3 = Et(y4.slice(A3, 2 * A3));
    let _3, T3, $3;
    try {
      _3 = d4.fromHex(b5, C4), T3 = d4.fromHex(y4.slice(0, A3), C4), $3 = m3.multiplyUnsafe(U3);
    } catch {
      return false;
    }
    if (!C4 && _3.isSmallOrder()) return false;
    const R4 = tt3(B2, T3.toRawBytes(), _3.toRawBytes(), f4);
    return T3.add(_3.multiplyUnsafe(R4)).subtract($3).clearCofactor().equals(d4.ZERO);
  }
  return m3._setWindowSize(8), { CURVE: e2, getPublicKey: ot2, sign: st3, verify: Ct3, ExtendedPoint: d4, utils: { getExtendedPublicKey: O4, randomPrivateKey: () => a3(n5.BYTES), precompute(y4 = 8, f4 = d4.BASE) {
    return f4._setWindowSize(y4), f4.multiply(BigInt(3)), f4;
  } } };
}
BigInt(0), BigInt(1);
var kt = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
var Ue2 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
BigInt(0);
var xr = BigInt(1);
var Te2 = BigInt(2);
BigInt(3);
var Br = BigInt(5);
var Cr = BigInt(8);
function Ar(t) {
  const e2 = BigInt(10), n5 = BigInt(20), r3 = BigInt(40), o4 = BigInt(80), s2 = kt, u2 = t * t % s2 * t % s2, i3 = J2(u2, Te2, s2) * u2 % s2, D2 = J2(i3, xr, s2) * t % s2, c5 = J2(D2, Br, s2) * D2 % s2, l6 = J2(c5, e2, s2) * c5 % s2, p3 = J2(l6, n5, s2) * l6 % s2, w3 = J2(p3, r3, s2) * p3 % s2, h4 = J2(w3, o4, s2) * w3 % s2, g2 = J2(h4, o4, s2) * w3 % s2, S4 = J2(g2, e2, s2) * c5 % s2;
  return { pow_p_5_8: J2(S4, Te2, s2) * t % s2, b2: u2 };
}
function mr(t) {
  return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
function _r(t, e2) {
  const n5 = kt, r3 = H2(e2 * e2 * e2, n5), o4 = H2(r3 * r3 * e2, n5), s2 = Ar(t * o4).pow_p_5_8;
  let a3 = H2(t * r3 * s2, n5);
  const u2 = H2(e2 * a3 * a3, n5), i3 = a3, D2 = H2(a3 * Ue2, n5), c5 = u2 === t, l6 = u2 === H2(-t, n5), p3 = u2 === H2(-t * Ue2, n5);
  return c5 && (a3 = i3), (l6 || p3) && (a3 = D2), ur(a3, n5) && (a3 = H2(-a3, n5)), { isValid: c5 || l6, value: a3 };
}
var Sr = (() => _e2(kt, void 0, true))();
var vr = (() => ({ a: BigInt(-1), d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"), Fp: Sr, n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"), h: Cr, Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"), Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"), hash: Kn, randomBytes: he2, adjustScalarBytes: mr, uvRatio: _r }))();
var Rt = (() => yr(vr))();
var jt = "EdDSA";
var Zt = "JWT";
var ut = ".";
var Dt = "base64url";
var Gt = "utf8";
var xt = "utf8";
var Vt = ":";
var Yt = "did";
var Jt = "key";
var dt = "base58btc";
var Kt = "z";
var Wt = "K36";
var Ne2 = 32;
function Xt(t) {
  return globalThis.Buffer != null ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t;
}
function Le2(t = 0) {
  return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? Xt(globalThis.Buffer.allocUnsafe(t)) : new Uint8Array(t);
}
function Oe2(t, e2) {
  e2 || (e2 = t.reduce((o4, s2) => o4 + s2.length, 0));
  const n5 = Le2(e2);
  let r3 = 0;
  for (const o4 of t) n5.set(o4, r3), r3 += o4.length;
  return Xt(n5);
}
function Ir(t, e2) {
  if (t.length >= 255) throw new TypeError("Alphabet too long");
  for (var n5 = new Uint8Array(256), r3 = 0; r3 < n5.length; r3++) n5[r3] = 255;
  for (var o4 = 0; o4 < t.length; o4++) {
    var s2 = t.charAt(o4), a3 = s2.charCodeAt(0);
    if (n5[a3] !== 255) throw new TypeError(s2 + " is ambiguous");
    n5[a3] = o4;
  }
  var u2 = t.length, i3 = t.charAt(0), D2 = Math.log(u2) / Math.log(256), c5 = Math.log(256) / Math.log(u2);
  function l6(h4) {
    if (h4 instanceof Uint8Array || (ArrayBuffer.isView(h4) ? h4 = new Uint8Array(h4.buffer, h4.byteOffset, h4.byteLength) : Array.isArray(h4) && (h4 = Uint8Array.from(h4))), !(h4 instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (h4.length === 0) return "";
    for (var g2 = 0, S4 = 0, v5 = 0, L2 = h4.length; v5 !== L2 && h4[v5] === 0; ) v5++, g2++;
    for (var d4 = (L2 - v5) * c5 + 1 >>> 0, m3 = new Uint8Array(d4); v5 !== L2; ) {
      for (var F = h4[v5], q3 = 0, z4 = d4 - 1; (F !== 0 || q3 < S4) && z4 !== -1; z4--, q3++) F += 256 * m3[z4] >>> 0, m3[z4] = F % u2 >>> 0, F = F / u2 >>> 0;
      if (F !== 0) throw new Error("Non-zero carry");
      S4 = q3, v5++;
    }
    for (var I3 = d4 - S4; I3 !== d4 && m3[I3] === 0; ) I3++;
    for (var O4 = i3.repeat(g2); I3 < d4; ++I3) O4 += t.charAt(m3[I3]);
    return O4;
  }
  function p3(h4) {
    if (typeof h4 != "string") throw new TypeError("Expected String");
    if (h4.length === 0) return new Uint8Array();
    var g2 = 0;
    if (h4[g2] !== " ") {
      for (var S4 = 0, v5 = 0; h4[g2] === i3; ) S4++, g2++;
      for (var L2 = (h4.length - g2) * D2 + 1 >>> 0, d4 = new Uint8Array(L2); h4[g2]; ) {
        var m3 = n5[h4.charCodeAt(g2)];
        if (m3 === 255) return;
        for (var F = 0, q3 = L2 - 1; (m3 !== 0 || F < v5) && q3 !== -1; q3--, F++) m3 += u2 * d4[q3] >>> 0, d4[q3] = m3 % 256 >>> 0, m3 = m3 / 256 >>> 0;
        if (m3 !== 0) throw new Error("Non-zero carry");
        v5 = F, g2++;
      }
      if (h4[g2] !== " ") {
        for (var z4 = L2 - v5; z4 !== L2 && d4[z4] === 0; ) z4++;
        for (var I3 = new Uint8Array(S4 + (L2 - z4)), O4 = S4; z4 !== L2; ) I3[O4++] = d4[z4++];
        return I3;
      }
    }
  }
  function w3(h4) {
    var g2 = p3(h4);
    if (g2) return g2;
    throw new Error(`Non-${e2} character`);
  }
  return { encode: l6, decodeUnsafe: p3, decode: w3 };
}
var Ur = Ir;
var Tr = Ur;
var He = (t) => {
  if (t instanceof Uint8Array && t.constructor.name === "Uint8Array") return t;
  if (t instanceof ArrayBuffer) return new Uint8Array(t);
  if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
  throw new Error("Unknown type, must be binary type");
};
var Fr = (t) => new TextEncoder().encode(t);
var Nr = (t) => new TextDecoder().decode(t);
var Lr = class {
  constructor(e2, n5, r3) {
    this.name = e2, this.prefix = n5, this.baseEncode = r3;
  }
  encode(e2) {
    if (e2 instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e2)}`;
    throw Error("Unknown type, must be binary type");
  }
};
var Or = class {
  constructor(e2, n5, r3) {
    if (this.name = e2, this.prefix = n5, n5.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
    this.prefixCodePoint = n5.codePointAt(0), this.baseDecode = r3;
  }
  decode(e2) {
    if (typeof e2 == "string") {
      if (e2.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e2)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      return this.baseDecode(e2.slice(this.prefix.length));
    } else throw Error("Can only multibase decode strings");
  }
  or(e2) {
    return ze2(this, e2);
  }
};
var Hr = class {
  constructor(e2) {
    this.decoders = e2;
  }
  or(e2) {
    return ze2(this, e2);
  }
  decode(e2) {
    const n5 = e2[0], r3 = this.decoders[n5];
    if (r3) return r3.decode(e2);
    throw RangeError(`Unable to decode multibase string ${JSON.stringify(e2)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
  }
};
var ze2 = (t, e2) => new Hr({ ...t.decoders || { [t.prefix]: t }, ...e2.decoders || { [e2.prefix]: e2 } });
var zr = class {
  constructor(e2, n5, r3, o4) {
    this.name = e2, this.prefix = n5, this.baseEncode = r3, this.baseDecode = o4, this.encoder = new Lr(e2, n5, r3), this.decoder = new Or(e2, n5, o4);
  }
  encode(e2) {
    return this.encoder.encode(e2);
  }
  decode(e2) {
    return this.decoder.decode(e2);
  }
};
var Bt = ({ name: t, prefix: e2, encode: n5, decode: r3 }) => new zr(t, e2, n5, r3);
var ht = ({ prefix: t, name: e2, alphabet: n5 }) => {
  const { encode: r3, decode: o4 } = Tr(n5, e2);
  return Bt({ prefix: t, name: e2, encode: r3, decode: (s2) => He(o4(s2)) });
};
var Mr = (t, e2, n5, r3) => {
  const o4 = {};
  for (let c5 = 0; c5 < e2.length; ++c5) o4[e2[c5]] = c5;
  let s2 = t.length;
  for (; t[s2 - 1] === "="; ) --s2;
  const a3 = new Uint8Array(s2 * n5 / 8 | 0);
  let u2 = 0, i3 = 0, D2 = 0;
  for (let c5 = 0; c5 < s2; ++c5) {
    const l6 = o4[t[c5]];
    if (l6 === void 0) throw new SyntaxError(`Non-${r3} character`);
    i3 = i3 << n5 | l6, u2 += n5, u2 >= 8 && (u2 -= 8, a3[D2++] = 255 & i3 >> u2);
  }
  if (u2 >= n5 || 255 & i3 << 8 - u2) throw new SyntaxError("Unexpected end of data");
  return a3;
};
var qr = (t, e2, n5) => {
  const r3 = e2[e2.length - 1] === "=", o4 = (1 << n5) - 1;
  let s2 = "", a3 = 0, u2 = 0;
  for (let i3 = 0; i3 < t.length; ++i3) for (u2 = u2 << 8 | t[i3], a3 += 8; a3 > n5; ) a3 -= n5, s2 += e2[o4 & u2 >> a3];
  if (a3 && (s2 += e2[o4 & u2 << n5 - a3]), r3) for (; s2.length * n5 & 7; ) s2 += "=";
  return s2;
};
var k2 = ({ name: t, prefix: e2, bitsPerChar: n5, alphabet: r3 }) => Bt({ prefix: e2, name: t, encode(o4) {
  return qr(o4, r3, n5);
}, decode(o4) {
  return Mr(o4, r3, n5, t);
} });
var $r = Bt({ prefix: "\0", name: "identity", encode: (t) => Nr(t), decode: (t) => Fr(t) });
var kr = Object.freeze({ __proto__: null, identity: $r });
var Rr = k2({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 });
var jr = Object.freeze({ __proto__: null, base2: Rr });
var Zr = k2({ prefix: "7", name: "base8", alphabet: "01234567", bitsPerChar: 3 });
var Gr = Object.freeze({ __proto__: null, base8: Zr });
var Vr = ht({ prefix: "9", name: "base10", alphabet: "0123456789" });
var Yr = Object.freeze({ __proto__: null, base10: Vr });
var Jr = k2({ prefix: "f", name: "base16", alphabet: "0123456789abcdef", bitsPerChar: 4 });
var Kr = k2({ prefix: "F", name: "base16upper", alphabet: "0123456789ABCDEF", bitsPerChar: 4 });
var Wr = Object.freeze({ __proto__: null, base16: Jr, base16upper: Kr });
var Xr = k2({ prefix: "b", name: "base32", alphabet: "abcdefghijklmnopqrstuvwxyz234567", bitsPerChar: 5 });
var Pr = k2({ prefix: "B", name: "base32upper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bitsPerChar: 5 });
var Qr = k2({ prefix: "c", name: "base32pad", alphabet: "abcdefghijklmnopqrstuvwxyz234567=", bitsPerChar: 5 });
var to = k2({ prefix: "C", name: "base32padupper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=", bitsPerChar: 5 });
var eo = k2({ prefix: "v", name: "base32hex", alphabet: "0123456789abcdefghijklmnopqrstuv", bitsPerChar: 5 });
var no = k2({ prefix: "V", name: "base32hexupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", bitsPerChar: 5 });
var ro = k2({ prefix: "t", name: "base32hexpad", alphabet: "0123456789abcdefghijklmnopqrstuv=", bitsPerChar: 5 });
var oo = k2({ prefix: "T", name: "base32hexpadupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=", bitsPerChar: 5 });
var so = k2({ prefix: "h", name: "base32z", alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769", bitsPerChar: 5 });
var io = Object.freeze({ __proto__: null, base32: Xr, base32upper: Pr, base32pad: Qr, base32padupper: to, base32hex: eo, base32hexupper: no, base32hexpad: ro, base32hexpadupper: oo, base32z: so });
var uo = ht({ prefix: "k", name: "base36", alphabet: "0123456789abcdefghijklmnopqrstuvwxyz" });
var co = ht({ prefix: "K", name: "base36upper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
var ao = Object.freeze({ __proto__: null, base36: uo, base36upper: co });
var fo = ht({ name: "base58btc", prefix: "z", alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" });
var Do = ht({ name: "base58flickr", prefix: "Z", alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" });
var ho = Object.freeze({ __proto__: null, base58btc: fo, base58flickr: Do });
var lo = k2({ prefix: "m", name: "base64", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bitsPerChar: 6 });
var bo = k2({ prefix: "M", name: "base64pad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", bitsPerChar: 6 });
var po = k2({ prefix: "u", name: "base64url", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bitsPerChar: 6 });
var wo = k2({ prefix: "U", name: "base64urlpad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=", bitsPerChar: 6 });
var Eo = Object.freeze({ __proto__: null, base64: lo, base64pad: bo, base64url: po, base64urlpad: wo });
var Me2 = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var go = Me2.reduce((t, e2, n5) => (t[n5] = e2, t), []);
var yo = Me2.reduce((t, e2, n5) => (t[e2.codePointAt(0)] = n5, t), []);
function xo(t) {
  return t.reduce((e2, n5) => (e2 += go[n5], e2), "");
}
function Bo(t) {
  const e2 = [];
  for (const n5 of t) {
    const r3 = yo[n5.codePointAt(0)];
    if (r3 === void 0) throw new Error(`Non-base256emoji character: ${n5}`);
    e2.push(r3);
  }
  return new Uint8Array(e2);
}
var Co = Bt({ prefix: "\u{1F680}", name: "base256emoji", encode: xo, decode: Bo });
var Ao = Object.freeze({ __proto__: null, base256emoji: Co });
var mo = $e2;
var qe = 128;
var _o = 127;
var So = ~_o;
var vo = Math.pow(2, 31);
function $e2(t, e2, n5) {
  e2 = e2 || [], n5 = n5 || 0;
  for (var r3 = n5; t >= vo; ) e2[n5++] = t & 255 | qe, t /= 128;
  for (; t & So; ) e2[n5++] = t & 255 | qe, t >>>= 7;
  return e2[n5] = t | 0, $e2.bytes = n5 - r3 + 1, e2;
}
var Io = Pt;
var Uo = 128;
var ke2 = 127;
function Pt(t, r3) {
  var n5 = 0, r3 = r3 || 0, o4 = 0, s2 = r3, a3, u2 = t.length;
  do {
    if (s2 >= u2) throw Pt.bytes = 0, new RangeError("Could not decode varint");
    a3 = t[s2++], n5 += o4 < 28 ? (a3 & ke2) << o4 : (a3 & ke2) * Math.pow(2, o4), o4 += 7;
  } while (a3 >= Uo);
  return Pt.bytes = s2 - r3, n5;
}
var To = Math.pow(2, 7);
var Fo = Math.pow(2, 14);
var No = Math.pow(2, 21);
var Lo = Math.pow(2, 28);
var Oo = Math.pow(2, 35);
var Ho = Math.pow(2, 42);
var zo = Math.pow(2, 49);
var Mo = Math.pow(2, 56);
var qo = Math.pow(2, 63);
var $o = function(t) {
  return t < To ? 1 : t < Fo ? 2 : t < No ? 3 : t < Lo ? 4 : t < Oo ? 5 : t < Ho ? 6 : t < zo ? 7 : t < Mo ? 8 : t < qo ? 9 : 10;
};
var ko = { encode: mo, decode: Io, encodingLength: $o };
var Re2 = ko;
var je2 = (t, e2, n5 = 0) => (Re2.encode(t, e2, n5), e2);
var Ze = (t) => Re2.encodingLength(t);
var Qt = (t, e2) => {
  const n5 = e2.byteLength, r3 = Ze(t), o4 = r3 + Ze(n5), s2 = new Uint8Array(o4 + n5);
  return je2(t, s2, 0), je2(n5, s2, r3), s2.set(e2, o4), new Ro(t, n5, e2, s2);
};
var Ro = class {
  constructor(e2, n5, r3, o4) {
    this.code = e2, this.size = n5, this.digest = r3, this.bytes = o4;
  }
};
var Ge2 = ({ name: t, code: e2, encode: n5 }) => new jo(t, e2, n5);
var jo = class {
  constructor(e2, n5, r3) {
    this.name = e2, this.code = n5, this.encode = r3;
  }
  digest(e2) {
    if (e2 instanceof Uint8Array) {
      const n5 = this.encode(e2);
      return n5 instanceof Uint8Array ? Qt(this.code, n5) : n5.then((r3) => Qt(this.code, r3));
    } else throw Error("Unknown type, must be binary type");
  }
};
var Ve2 = (t) => async (e2) => new Uint8Array(await crypto.subtle.digest(t, e2));
var Zo = Ge2({ name: "sha2-256", code: 18, encode: Ve2("SHA-256") });
var Go = Ge2({ name: "sha2-512", code: 19, encode: Ve2("SHA-512") });
var Vo = Object.freeze({ __proto__: null, sha256: Zo, sha512: Go });
var Ye = 0;
var Yo = "identity";
var Je = He;
var Jo = (t) => Qt(Ye, Je(t));
var Ko = { code: Ye, name: Yo, encode: Je, digest: Jo };
var Wo = Object.freeze({ __proto__: null, identity: Ko });
new TextEncoder(), new TextDecoder();
var Ke = { ...kr, ...jr, ...Gr, ...Yr, ...Wr, ...io, ...ao, ...ho, ...Eo, ...Ao };
({ ...Vo, ...Wo });
function We(t, e2, n5, r3) {
  return { name: t, prefix: e2, encoder: { name: t, prefix: e2, encode: n5 }, decoder: { decode: r3 } };
}
var Xe = We("utf8", "u", (t) => "u" + new TextDecoder("utf8").decode(t), (t) => new TextEncoder().encode(t.substring(1)));
var te2 = We("ascii", "a", (t) => {
  let e2 = "a";
  for (let n5 = 0; n5 < t.length; n5++) e2 += String.fromCharCode(t[n5]);
  return e2;
}, (t) => {
  t = t.substring(1);
  const e2 = Le2(t.length);
  for (let n5 = 0; n5 < t.length; n5++) e2[n5] = t.charCodeAt(n5);
  return e2;
});
var Pe2 = { utf8: Xe, "utf-8": Xe, hex: Ke.base16, latin1: te2, ascii: te2, binary: te2, ...Ke };
function ct(t, e2 = "utf8") {
  const n5 = Pe2[e2];
  if (!n5) throw new Error(`Unsupported encoding "${e2}"`);
  return (e2 === "utf8" || e2 === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? globalThis.Buffer.from(t.buffer, t.byteOffset, t.byteLength).toString("utf8") : n5.encoder.encode(t).substring(1);
}
function rt(t, e2 = "utf8") {
  const n5 = Pe2[e2];
  if (!n5) throw new Error(`Unsupported encoding "${e2}"`);
  return (e2 === "utf8" || e2 === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? Xt(globalThis.Buffer.from(t, "utf-8")) : n5.decoder.decode(`${n5.prefix}${t}`);
}
function lt(t) {
  return safeJsonParse(ct(rt(t, Dt), Gt));
}
function bt(t) {
  return ct(rt(safeJsonStringify(t), Gt), Dt);
}
function Qe(t) {
  const e2 = rt(Wt, dt), n5 = Kt + ct(Oe2([e2, t]), dt);
  return [Yt, Jt, n5].join(Vt);
}
function en(t) {
  return ct(t, Dt);
}
function nn(t) {
  return rt(t, Dt);
}
function rn(t) {
  return rt([bt(t.header), bt(t.payload)].join(ut), xt);
}
function on(t) {
  return [bt(t.header), bt(t.payload), en(t.signature)].join(ut);
}
function sn(t) {
  const e2 = t.split(ut), n5 = lt(e2[0]), r3 = lt(e2[1]), o4 = nn(e2[2]), s2 = rt(e2.slice(0, 2).join(ut), xt);
  return { header: n5, payload: r3, signature: o4, data: s2 };
}
function Po(t = he2(Ne2)) {
  const e2 = Rt.getPublicKey(t);
  return { secretKey: Oe2([t, e2]), publicKey: e2 };
}
async function Qo(t, e2, n5, r3, o4 = (0, import_time2.fromMiliseconds)(Date.now())) {
  const s2 = { alg: jt, typ: Zt }, a3 = Qe(r3.publicKey), u2 = o4 + n5, i3 = { iss: a3, sub: t, aud: e2, iat: o4, exp: u2 }, D2 = rn({ header: s2, payload: i3 }), c5 = Rt.sign(D2, r3.secretKey.slice(0, 32));
  return on({ header: s2, payload: i3, signature: c5 });
}

// node_modules/detect-browser/es/index.js
var __spreadArray = function(to4, from8, pack) {
  if (pack || arguments.length === 2) for (var i3 = 0, l6 = from8.length, ar4; i3 < l6; i3++) {
    if (ar4 || !(i3 in from8)) {
      if (!ar4) ar4 = Array.prototype.slice.call(from8, 0, i3);
      ar4[i3] = from8[i3];
    }
  }
  return to4.concat(ar4 || Array.prototype.slice.call(from8));
};
var BrowserInfo = (
  /** @class */
  /* @__PURE__ */ (function() {
    function BrowserInfo2(name2, version3, os2) {
      this.name = name2;
      this.version = version3;
      this.os = os2;
      this.type = "browser";
    }
    return BrowserInfo2;
  })()
);
var NodeInfo = (
  /** @class */
  /* @__PURE__ */ (function() {
    function NodeInfo2(version3) {
      this.version = version3;
      this.type = "node";
      this.name = "node";
      this.os = process.platform;
    }
    return NodeInfo2;
  })()
);
var SearchBotDeviceInfo = (
  /** @class */
  /* @__PURE__ */ (function() {
    function SearchBotDeviceInfo2(name2, version3, os2, bot) {
      this.name = name2;
      this.version = version3;
      this.os = os2;
      this.bot = bot;
      this.type = "bot-device";
    }
    return SearchBotDeviceInfo2;
  })()
);
var BotInfo = (
  /** @class */
  /* @__PURE__ */ (function() {
    function BotInfo2() {
      this.type = "bot";
      this.bot = true;
      this.name = "bot";
      this.version = null;
      this.os = null;
    }
    return BotInfo2;
  })()
);
var ReactNativeInfo = (
  /** @class */
  /* @__PURE__ */ (function() {
    function ReactNativeInfo2() {
      this.type = "react-native";
      this.name = "react-native";
      this.version = null;
      this.os = null;
    }
    return ReactNativeInfo2;
  })()
);
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
  ["aol", /AOLShield\/([0-9\._]+)/],
  ["edge", /Edge\/([0-9\._]+)/],
  ["edge-ios", /EdgiOS\/([0-9\._]+)/],
  ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
  ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
  ["samsung", /SamsungBrowser\/([0-9\.]+)/],
  ["silk", /\bSilk\/([0-9._-]+)\b/],
  ["miui", /MiuiBrowser\/([0-9\.]+)$/],
  ["beaker", /BeakerBrowser\/([0-9\.]+)/],
  ["edge-chromium", /EdgA?\/([0-9\.]+)/],
  [
    "chromium-webview",
    /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/
  ],
  ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
  ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
  ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
  ["fxios", /FxiOS\/([0-9\.]+)/],
  ["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
  ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
  ["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
  ["pie", /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
  ["pie", /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
  ["netfront", /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
  ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
  ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ["ie", /MSIE\s(7\.0)/],
  ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
  ["android", /Android\s([0-9\.]+)/],
  ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  ["safari", /Version\/([0-9\._]+).*Safari/],
  ["facebook", /FB[AS]V\/([0-9\.]+)/],
  ["instagram", /Instagram\s([0-9\.]+)/],
  ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
  ["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
  ["curl", /^curl\/([0-9\.]+)$/],
  ["searchbot", SEARCHBOX_UA_REGEX]
];
var operatingSystemRules = [
  ["iOS", /iP(hone|od|ad)/],
  ["Android OS", /Android/],
  ["BlackBerry OS", /BlackBerry|BB10/],
  ["Windows Mobile", /IEMobile/],
  ["Amazon OS", /Kindle/],
  ["Windows 3.11", /Win16/],
  ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
  ["Windows 98", /(Windows 98)|(Win98)/],
  ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
  ["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
  ["Windows Server 2003", /(Windows NT 5.2)/],
  ["Windows Vista", /(Windows NT 6.0)/],
  ["Windows 7", /(Windows NT 6.1)/],
  ["Windows 8", /(Windows NT 6.2)/],
  ["Windows 8.1", /(Windows NT 6.3)/],
  ["Windows 10", /(Windows NT 10.0)/],
  ["Windows ME", /Windows ME/],
  ["Windows CE", /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
  ["Open BSD", /OpenBSD/],
  ["Sun OS", /SunOS/],
  ["Chrome OS", /CrOS/],
  ["Linux", /(Linux)|(X11)/],
  ["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
  ["QNX", /QNX/],
  ["BeOS", /BeOS/],
  ["OS/2", /OS\/2/]
];
function detect(userAgent) {
  if (!!userAgent) {
    return parseUserAgent(userAgent);
  }
  if (typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return new ReactNativeInfo();
  }
  if (typeof navigator !== "undefined") {
    return parseUserAgent(navigator.userAgent);
  }
  return getNodeVersion();
}
function matchUserAgent(ua2) {
  return ua2 !== "" && userAgentRules.reduce(function(matched, _a2) {
    var browser = _a2[0], regex = _a2[1];
    if (matched) {
      return matched;
    }
    var uaMatch = regex.exec(ua2);
    return !!uaMatch && [browser, uaMatch];
  }, false);
}
function parseUserAgent(ua2) {
  var matchedRule = matchUserAgent(ua2);
  if (!matchedRule) {
    return null;
  }
  var name2 = matchedRule[0], match = matchedRule[1];
  if (name2 === "searchbot") {
    return new BotInfo();
  }
  var versionParts = match[1] && match[1].split(".").join("_").split("_").slice(0, 3);
  if (versionParts) {
    if (versionParts.length < REQUIRED_VERSION_PARTS) {
      versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
    }
  } else {
    versionParts = [];
  }
  var version3 = versionParts.join(".");
  var os2 = detectOS(ua2);
  var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua2);
  if (searchBotMatch && searchBotMatch[1]) {
    return new SearchBotDeviceInfo(name2, version3, os2, searchBotMatch[1]);
  }
  return new BrowserInfo(name2, version3, os2);
}
function detectOS(ua2) {
  for (var ii3 = 0, count = operatingSystemRules.length; ii3 < count; ii3++) {
    var _a2 = operatingSystemRules[ii3], os2 = _a2[0], regex = _a2[1];
    var match = regex.exec(ua2);
    if (match) {
      return os2;
    }
  }
  return null;
}
function getNodeVersion() {
  var isNode2 = typeof process !== "undefined" && process.version;
  return isNode2 ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
  var output = [];
  for (var ii3 = 0; ii3 < count; ii3++) {
    output.push("0");
  }
  return output;
}

// node_modules/@walletconnect/utils/dist/index.js
var import_time3 = __toESM(require_cjs(), 1);
var import_window_getters = __toESM(require_cjs2(), 1);
var import_window_metadata = __toESM(require_cjs3(), 1);

// node_modules/ox/_esm/core/version.js
var version = "0.1.1";

// node_modules/ox/_esm/core/internal/errors.js
function getVersion() {
  return version;
}

// node_modules/ox/_esm/core/Errors.js
var BaseError = class _BaseError extends Error {
  constructor(shortMessage, options = {}) {
    const details = (() => {
      if (options.cause instanceof _BaseError) {
        if (options.cause.details)
          return options.cause.details;
        if (options.cause.shortMessage)
          return options.cause.shortMessage;
      }
      if (options.cause && "details" in options.cause && typeof options.cause.details === "string")
        return options.cause.details;
      if (options.cause?.message)
        return options.cause.message;
      return options.details;
    })();
    const docsPath = (() => {
      if (options.cause instanceof _BaseError)
        return options.cause.docsPath || options.docsPath;
      return options.docsPath;
    })();
    const docsBaseUrl = "https://oxlib.sh";
    const docs = `${docsBaseUrl}${docsPath ?? ""}`;
    const message = [
      shortMessage || "An error occurred.",
      ...options.metaMessages ? ["", ...options.metaMessages] : [],
      ...details || docsPath ? [
        "",
        details ? `Details: ${details}` : void 0,
        docsPath ? `See: ${docs}` : void 0
      ] : []
    ].filter((x5) => typeof x5 === "string").join("\n");
    super(message, options.cause ? { cause: options.cause } : void 0);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "BaseError"
    });
    Object.defineProperty(this, "version", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: `ox@${getVersion()}`
    });
    this.cause = options.cause;
    this.details = details;
    this.docs = docs;
    this.docsPath = docsPath;
    this.shortMessage = shortMessage;
  }
  walk(fn3) {
    return walk(this, fn3);
  }
};
function walk(err, fn3) {
  if (fn3?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause)
    return walk(err.cause, fn3);
  return fn3 ? null : err;
}

// node_modules/@noble/hashes/esm/crypto.js
var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// node_modules/@noble/hashes/esm/utils.js
function isBytes(a3) {
  return a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
}
function anumber(n5) {
  if (!Number.isSafeInteger(n5) || n5 < 0)
    throw new Error("positive integer expected, got " + n5);
}
function abytes(b5, ...lengths) {
  if (!isBytes(b5))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b5.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b5.length);
}
function ahash(h4) {
  if (typeof h4 !== "function" || typeof h4.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber(h4.outputLen);
  anumber(h4.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i3 = 0; i3 < arrays.length; i3++) {
    arrays[i3].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i3 = 0; i3 < arr.length; i3++) {
    arr[i3] = byteSwap(arr[i3]);
  }
  return arr;
}
var swap32IfBE = isLE ? (u2) => u2 : byteSwap32;
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i3 = 0; i3 < arrays.length; i3++) {
    const a3 = arrays[i3];
    abytes(a3);
    sum += a3.length;
  }
  const res = new Uint8Array(sum);
  for (let i3 = 0, pad3 = 0; i3 < arrays.length; i3++) {
    const a3 = arrays[i3];
    res.set(a3, pad3);
    pad3 += a3.length;
  }
  return res;
}
var Hash = class {
};
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return Uint8Array.from(crypto2.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h4 = isLE2 ? 4 : 0;
  const l6 = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h4, wh, isLE2);
  view.setUint32(byteOffset + l6, wl, isLE2);
}
function Chi(a3, b5, c5) {
  return a3 & b5 ^ ~a3 & c5;
}
function Maj(a3, b5, c5) {
  return a3 & b5 ^ a3 & c5 ^ b5 & c5;
}
var HashMD = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i3 = pos; i3 < blockLen; i3++)
      buffer[i3] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i3 = 0; i3 < outLen; i3++)
      oview.setUint32(4 * i3, state[i3], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to4) {
    to4 || (to4 = new this.constructor());
    to4.set(...this.get());
    const { blockLen, buffer, length: length2, finished, destroyed, pos } = this;
    to4.destroyed = destroyed;
    to4.finished = finished;
    to4.length = length2;
    to4.pos = pos;
    if (length2 % blockLen)
      to4.buffer.set(buffer);
    return to4;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);

// node_modules/@noble/hashes/esm/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n5, le4 = false) {
  if (le4)
    return { h: Number(n5 & U32_MASK64), l: Number(n5 >> _32n & U32_MASK64) };
  return { h: Number(n5 >> _32n & U32_MASK64) | 0, l: Number(n5 & U32_MASK64) | 0 };
}
function split(lst, le4 = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i3 = 0; i3 < len; i3++) {
    const { h: h4, l: l6 } = fromBig(lst[i3], le4);
    [Ah[i3], Al[i3]] = [h4, l6];
  }
  return [Ah, Al];
}
var rotlSH = (h4, l6, s2) => h4 << s2 | l6 >>> 32 - s2;
var rotlSL = (h4, l6, s2) => l6 << s2 | h4 >>> 32 - s2;
var rotlBH = (h4, l6, s2) => l6 << s2 - 32 | h4 >>> 64 - s2;
var rotlBL = (h4, l6, s2) => h4 << s2 - 32 | l6 >>> 64 - s2;

// node_modules/@noble/hashes/esm/sha3.js
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _7n = BigInt(7);
var _256n = BigInt(256);
var _0x71n = BigInt(113);
var SHA3_PI = [];
var SHA3_ROTL = [];
var _SHA3_IOTA = [];
for (let round = 0, R4 = _1n, x5 = 1, y4 = 0; round < 24; round++) {
  [x5, y4] = [y4, (2 * x5 + 3 * y4) % 5];
  SHA3_PI.push(2 * (5 * y4 + x5));
  SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
  let t = _0n;
  for (let j6 = 0; j6 < 7; j6++) {
    R4 = (R4 << _1n ^ (R4 >> _7n) * _0x71n) % _256n;
    if (R4 & _2n)
      t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j6)) - _1n;
  }
  _SHA3_IOTA.push(t);
}
var IOTAS = split(_SHA3_IOTA, true);
var SHA3_IOTA_H = IOTAS[0];
var SHA3_IOTA_L = IOTAS[1];
var rotlH = (h4, l6, s2) => s2 > 32 ? rotlBH(h4, l6, s2) : rotlSH(h4, l6, s2);
var rotlL = (h4, l6, s2) => s2 > 32 ? rotlBL(h4, l6, s2) : rotlSL(h4, l6, s2);
function keccakP(s2, rounds = 24) {
  const B2 = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x5 = 0; x5 < 10; x5++)
      B2[x5] = s2[x5] ^ s2[x5 + 10] ^ s2[x5 + 20] ^ s2[x5 + 30] ^ s2[x5 + 40];
    for (let x5 = 0; x5 < 10; x5 += 2) {
      const idx1 = (x5 + 8) % 10;
      const idx0 = (x5 + 2) % 10;
      const B0 = B2[idx0];
      const B1 = B2[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B2[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B2[idx1 + 1];
      for (let y4 = 0; y4 < 50; y4 += 10) {
        s2[x5 + y4] ^= Th;
        s2[x5 + y4 + 1] ^= Tl;
      }
    }
    let curH = s2[2];
    let curL = s2[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s2[PI];
      curL = s2[PI + 1];
      s2[PI] = Th;
      s2[PI + 1] = Tl;
    }
    for (let y4 = 0; y4 < 50; y4 += 10) {
      for (let x5 = 0; x5 < 10; x5++)
        B2[x5] = s2[y4 + x5];
      for (let x5 = 0; x5 < 10; x5++)
        s2[y4 + x5] ^= ~B2[(x5 + 2) % 10] & B2[(x5 + 4) % 10];
    }
    s2[0] ^= SHA3_IOTA_H[round];
    s2[1] ^= SHA3_IOTA_L[round];
  }
  clean(B2);
}
var Keccak = class _Keccak extends Hash {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
    super();
    this.pos = 0;
    this.posOut = 0;
    this.finished = false;
    this.destroyed = false;
    this.enableXOF = false;
    this.blockLen = blockLen;
    this.suffix = suffix;
    this.outputLen = outputLen;
    this.enableXOF = enableXOF;
    this.rounds = rounds;
    anumber(outputLen);
    if (!(0 < blockLen && blockLen < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200);
    this.state32 = u32(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    swap32IfBE(this.state32);
    keccakP(this.state32, this.rounds);
    swap32IfBE(this.state32);
    this.posOut = 0;
    this.pos = 0;
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { blockLen, state } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      for (let i3 = 0; i3 < take; i3++)
        state[this.pos++] ^= data[pos++];
      if (this.pos === blockLen)
        this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = true;
    const { state, suffix, pos, blockLen } = this;
    state[pos] ^= suffix;
    if ((suffix & 128) !== 0 && pos === blockLen - 1)
      this.keccak();
    state[blockLen - 1] ^= 128;
    this.keccak();
  }
  writeInto(out) {
    aexists(this, false);
    abytes(out);
    this.finish();
    const bufferOut = this.state;
    const { blockLen } = this;
    for (let pos = 0, len = out.length; pos < len; ) {
      if (this.posOut >= blockLen)
        this.keccak();
      const take = Math.min(blockLen - this.posOut, len - pos);
      out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
      this.posOut += take;
      pos += take;
    }
    return out;
  }
  xofInto(out) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(out);
  }
  xof(bytes) {
    anumber(bytes);
    return this.xofInto(new Uint8Array(bytes));
  }
  digestInto(out) {
    aoutput(out, this);
    if (this.finished)
      throw new Error("digest() was already called");
    this.writeInto(out);
    this.destroy();
    return out;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true;
    clean(this.state);
  }
  _cloneInto(to4) {
    const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
    to4 || (to4 = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
    to4.state32.set(this.state32);
    to4.pos = this.pos;
    to4.posOut = this.posOut;
    to4.finished = this.finished;
    to4.rounds = rounds;
    to4.suffix = suffix;
    to4.outputLen = outputLen;
    to4.enableXOF = enableXOF;
    to4.destroyed = this.destroyed;
    return to4;
  }
};
var gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
var keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();

// node_modules/@noble/hashes/esm/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
  constructor(outputLen = 32) {
    super(64, outputLen, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A: A3, B: B2, C: C4, D: D2, E: E3, F, G: G4, H: H3 } = this;
    return [A3, B2, C4, D2, E3, F, G4, H3];
  }
  // prettier-ignore
  set(A3, B2, C4, D2, E3, F, G4, H3) {
    this.A = A3 | 0;
    this.B = B2 | 0;
    this.C = C4 | 0;
    this.D = D2 | 0;
    this.E = E3 | 0;
    this.F = F | 0;
    this.G = G4 | 0;
    this.H = H3 | 0;
  }
  process(view, offset) {
    for (let i3 = 0; i3 < 16; i3++, offset += 4)
      SHA256_W[i3] = view.getUint32(offset, false);
    for (let i3 = 16; i3 < 64; i3++) {
      const W15 = SHA256_W[i3 - 15];
      const W22 = SHA256_W[i3 - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W22, 17) ^ rotr(W22, 19) ^ W22 >>> 10;
      SHA256_W[i3] = s1 + SHA256_W[i3 - 7] + s0 + SHA256_W[i3 - 16] | 0;
    }
    let { A: A3, B: B2, C: C4, D: D2, E: E3, F, G: G4, H: H3 } = this;
    for (let i3 = 0; i3 < 64; i3++) {
      const sigma1 = rotr(E3, 6) ^ rotr(E3, 11) ^ rotr(E3, 25);
      const T1 = H3 + sigma1 + Chi(E3, F, G4) + SHA256_K[i3] + SHA256_W[i3] | 0;
      const sigma0 = rotr(A3, 2) ^ rotr(A3, 13) ^ rotr(A3, 22);
      const T22 = sigma0 + Maj(A3, B2, C4) | 0;
      H3 = G4;
      G4 = F;
      F = E3;
      E3 = D2 + T1 | 0;
      D2 = C4;
      C4 = B2;
      B2 = A3;
      A3 = T1 + T22 | 0;
    }
    A3 = A3 + this.A | 0;
    B2 = B2 + this.B | 0;
    C4 = C4 + this.C | 0;
    D2 = D2 + this.D | 0;
    E3 = E3 + this.E | 0;
    F = F + this.F | 0;
    G4 = G4 + this.G | 0;
    H3 = H3 + this.H | 0;
    this.set(A3, B2, C4, D2, E3, F, G4, H3);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());

// node_modules/ox/node_modules/@noble/curves/esm/abstract/utils.js
var _0n2 = /* @__PURE__ */ BigInt(0);
var _1n2 = /* @__PURE__ */ BigInt(1);
function isBytes2(a3) {
  return a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
}
function abytes2(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(title + " boolean expected, got " + value);
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n2 : BigInt("0x" + hex);
}
var hasHexBuiltin = (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
);
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_3, i3) => i3.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes2(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i3 = 0; i3 < bytes.length; i3++) {
    hex += hexes[bytes[i3]];
  }
  return hex;
}
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai2 = 0, hi3 = 0; ai2 < al; ai2++, hi3 += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi3));
    const n22 = asciiToBase16(hex.charCodeAt(hi3 + 1));
    if (n1 === void 0 || n22 === void 0) {
      const char = hex[hi3] + hex[hi3 + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi3);
    }
    array[ai2] = n1 * 16 + n22;
  }
  return array;
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  abytes2(bytes);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n5, len) {
  return hexToBytes(n5.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n5, len) {
  return numberToBytesBE(n5, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e2) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e2);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i3 = 0; i3 < arrays.length; i3++) {
    const a3 = arrays[i3];
    abytes2(a3);
    sum += a3.length;
  }
  const res = new Uint8Array(sum);
  for (let i3 = 0, pad3 = 0; i3 < arrays.length; i3++) {
    const a3 = arrays[i3];
    res.set(a3, pad3);
    pad3 += a3.length;
  }
  return res;
}
var isPosBig = (n5) => typeof n5 === "bigint" && _0n2 <= n5;
function inRange(n5, min, max) {
  return isPosBig(n5) && isPosBig(min) && isPosBig(max) && min <= n5 && n5 < max;
}
function aInRange(title, n5, min, max) {
  if (!inRange(n5, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n5);
}
function bitLen(n5) {
  let len;
  for (len = 0; n5 > _0n2; n5 >>= _1n2, len += 1)
    ;
  return len;
}
var bitMask = (n5) => (_1n2 << BigInt(n5)) - _1n2;
var u8n = (len) => new Uint8Array(len);
var u8fr = (arr) => Uint8Array.from(arr);
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v5 = u8n(hashLen);
  let k4 = u8n(hashLen);
  let i3 = 0;
  const reset = () => {
    v5.fill(1);
    k4.fill(0);
    i3 = 0;
  };
  const h4 = (...b5) => hmacFn(k4, v5, ...b5);
  const reseed = (seed = u8n(0)) => {
    k4 = h4(u8fr([0]), seed);
    v5 = h4();
    if (seed.length === 0)
      return;
    k4 = h4(u8fr([1]), seed);
    v5 = h4();
  };
  const gen2 = () => {
    if (i3++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v5 = h4();
      const sl = v5.slice();
      out.push(sl);
      len += v5.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen2())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
var validatorFns = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
  isSafeInteger: (val) => Number.isSafeInteger(val),
  array: (val) => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error("invalid validator function");
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
function memoized(fn3) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn3(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}

// node_modules/ox/_esm/core/internal/bytes.js
function assertSize(bytes, size_) {
  if (size(bytes) > size_)
    throw new SizeOverflowError({
      givenSize: size(bytes),
      maxSize: size_
    });
}
var charCodeMap = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function pad(bytes, options = {}) {
  const { dir, size: size3 = 32 } = options;
  if (size3 === 0)
    return bytes;
  if (bytes.length > size3)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size3,
      type: "Bytes"
    });
  const paddedBytes = new Uint8Array(size3);
  for (let i3 = 0; i3 < size3; i3++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i3 : size3 - i3 - 1] = bytes[padEnd ? i3 : bytes.length - i3 - 1];
  }
  return paddedBytes;
}

// node_modules/ox/_esm/core/internal/hex.js
function assertSize2(hex, size_) {
  if (size2(hex) > size_)
    throw new SizeOverflowError2({
      givenSize: size2(hex),
      maxSize: size_
    });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size2(value) - 1)
    throw new SliceOffsetOutOfBoundsError2({
      offset: start,
      position: "start",
      size: size2(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size2(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError2({
      offset: end,
      position: "end",
      size: size2(value)
    });
  }
}
function pad2(hex_, options = {}) {
  const { dir, size: size3 = 32 } = options;
  if (size3 === 0)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size3 * 2)
    throw new SizeExceedsPaddingSizeError2({
      size: Math.ceil(hex.length / 2),
      targetSize: size3,
      type: "Hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size3 * 2, "0")}`;
}
function trim(value, options = {}) {
  const { dir = "left" } = options;
  let data = value.replace("0x", "");
  let sliceLength = 0;
  for (let i3 = 0; i3 < data.length - 1; i3++) {
    if (data[dir === "left" ? i3 : data.length - i3 - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (data === "0")
    return "0x";
  if (dir === "right" && data.length % 2 === 1)
    return `0x${data}0`;
  return `0x${data}`;
}

// node_modules/ox/_esm/core/Json.js
var bigIntSuffix = "#__bigint";
function stringify2(value, replacer, space) {
  return JSON.stringify(value, (key, value2) => {
    if (typeof replacer === "function")
      return replacer(key, value2);
    if (typeof value2 === "bigint")
      return value2.toString() + bigIntSuffix;
    return value2;
  }, space);
}

// node_modules/ox/_esm/core/Hex.js
var hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i3) => i3.toString(16).padStart(2, "0"));
function assert(value, options = {}) {
  const { strict = false } = options;
  if (!value)
    throw new InvalidHexTypeError(value);
  if (typeof value !== "string")
    throw new InvalidHexTypeError(value);
  if (strict) {
    if (!/^0x[0-9a-fA-F]*$/.test(value))
      throw new InvalidHexValueError(value);
  }
  if (!value.startsWith("0x"))
    throw new InvalidHexValueError(value);
}
function concat(...values) {
  return `0x${values.reduce((acc, x5) => acc + x5.replace("0x", ""), "")}`;
}
function from(value) {
  if (value instanceof Uint8Array)
    return fromBytes(value);
  if (Array.isArray(value))
    return fromBytes(new Uint8Array(value));
  return value;
}
function fromBytes(value, options = {}) {
  let string2 = "";
  for (let i3 = 0; i3 < value.length; i3++)
    string2 += hexes2[value[i3]];
  const hex = `0x${string2}`;
  if (typeof options.size === "number") {
    assertSize2(hex, options.size);
    return padRight(hex, options.size);
  }
  return hex;
}
function fromNumber(value, options = {}) {
  const { signed, size: size3 } = options;
  const value_ = BigInt(value);
  let maxValue;
  if (size3) {
    if (signed)
      maxValue = (1n << BigInt(size3) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size3) * 8n) - 1n;
  } else if (typeof value === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value_ > maxValue || value_ < minValue) {
    const suffix = typeof value === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size3,
      value: `${value}${suffix}`
    });
  }
  const stringValue = (signed && value_ < 0 ? (1n << BigInt(size3 * 8)) + BigInt(value_) : value_).toString(16);
  const hex = `0x${stringValue}`;
  if (size3)
    return padLeft(hex, size3);
  return hex;
}
function padLeft(value, size3) {
  return pad2(value, { dir: "left", size: size3 });
}
function padRight(value, size3) {
  return pad2(value, { dir: "right", size: size3 });
}
function slice(value, start, end, options = {}) {
  const { strict } = options;
  assertStartOffset(value, start);
  const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
  if (strict)
    assertEndOffset(value_, start, end);
  return value_;
}
function size2(value) {
  return Math.ceil((value.length - 2) / 2);
}
function trimLeft(value) {
  return trim(value, { dir: "left" });
}
function validate(value, options = {}) {
  const { strict = false } = options;
  try {
    assert(value, { strict });
    return true;
  } catch {
    return false;
  }
}
var IntegerOutOfRangeError = class extends BaseError {
  constructor({ max, min, signed, size: size3, value }) {
    super(`Number \`${value}\` is not in safe${size3 ? ` ${size3 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.IntegerOutOfRangeError"
    });
  }
};
var InvalidHexTypeError = class extends BaseError {
  constructor(value) {
    super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, {
      metaMessages: ['Hex types must be represented as `"0x${string}"`.']
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.InvalidHexTypeError"
    });
  }
};
var InvalidHexValueError = class extends BaseError {
  constructor(value) {
    super(`Value \`${value}\` is an invalid hex value.`, {
      metaMessages: [
        'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).'
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.InvalidHexValueError"
    });
  }
};
var SizeOverflowError2 = class extends BaseError {
  constructor({ givenSize, maxSize }) {
    super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.SizeOverflowError"
    });
  }
};
var SliceOffsetOutOfBoundsError2 = class extends BaseError {
  constructor({ offset, position, size: size3 }) {
    super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size3}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.SliceOffsetOutOfBoundsError"
    });
  }
};
var SizeExceedsPaddingSizeError2 = class extends BaseError {
  constructor({ size: size3, targetSize, type }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size3}\`) exceeds padding size (\`${targetSize}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Hex.SizeExceedsPaddingSizeError"
    });
  }
};

// node_modules/ox/_esm/core/Bytes.js
var encoder = /* @__PURE__ */ new TextEncoder();
function assert2(value) {
  if (value instanceof Uint8Array)
    return;
  if (!value)
    throw new InvalidBytesTypeError(value);
  if (typeof value !== "object")
    throw new InvalidBytesTypeError(value);
  if (!("BYTES_PER_ELEMENT" in value))
    throw new InvalidBytesTypeError(value);
  if (value.BYTES_PER_ELEMENT !== 1 || value.constructor.name !== "Uint8Array")
    throw new InvalidBytesTypeError(value);
}
function from2(value) {
  if (value instanceof Uint8Array)
    return value;
  if (typeof value === "string")
    return fromHex(value);
  return fromArray(value);
}
function fromArray(value) {
  return value instanceof Uint8Array ? value : new Uint8Array(value);
}
function fromHex(value, options = {}) {
  const { size: size3 } = options;
  let hex = value;
  if (size3) {
    assertSize2(value, size3);
    hex = padRight(value, size3);
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length2 = hexString.length / 2;
  const bytes = new Uint8Array(length2);
  for (let index = 0, j6 = 0; index < length2; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j6++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j6++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError(`Invalid byte sequence ("${hexString[j6 - 2]}${hexString[j6 - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function fromString(value, options = {}) {
  const { size: size3 } = options;
  const bytes = encoder.encode(value);
  if (typeof size3 === "number") {
    assertSize(bytes, size3);
    return padRight2(bytes, size3);
  }
  return bytes;
}
function padRight2(value, size3) {
  return pad(value, { dir: "right", size: size3 });
}
function size(value) {
  return value.length;
}
function validate2(value) {
  try {
    assert2(value);
    return true;
  } catch {
    return false;
  }
}
var InvalidBytesTypeError = class extends BaseError {
  constructor(value) {
    super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid Bytes value.`, {
      metaMessages: ["Bytes values must be of type `Bytes`."]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Bytes.InvalidBytesTypeError"
    });
  }
};
var SizeOverflowError = class extends BaseError {
  constructor({ givenSize, maxSize }) {
    super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Bytes.SizeOverflowError"
    });
  }
};
var SizeExceedsPaddingSizeError = class extends BaseError {
  constructor({ size: size3, targetSize, type }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size3}\`) exceeds padding size (\`${targetSize}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Bytes.SizeExceedsPaddingSizeError"
    });
  }
};

// node_modules/ox/_esm/core/Hash.js
function keccak256(value, options = {}) {
  const { as: as2 = typeof value === "string" ? "Hex" : "Bytes" } = options;
  const bytes = keccak_256(from2(value));
  if (as2 === "Bytes")
    return bytes;
  return fromBytes(bytes);
}

// node_modules/ox/_esm/core/internal/lru.js
var LruMap = class extends Map {
  constructor(size3) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxSize = size3;
  }
  get(key) {
    const value = super.get(key);
    if (super.has(key) && value !== void 0) {
      this.delete(key);
      super.set(key, value);
    }
    return value;
  }
  set(key, value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize) {
      const firstKey = this.keys().next().value;
      if (firstKey)
        this.delete(firstKey);
    }
    return this;
  }
};

// node_modules/ox/_esm/core/Caches.js
var caches = {
  checksum: /* @__PURE__ */ new LruMap(8192)
};
var checksum = caches.checksum;

// node_modules/ox/_esm/core/PublicKey.js
function assert3(publicKey, options = {}) {
  const { compressed } = options;
  const { prefix, x: x5, y: y4 } = publicKey;
  if (compressed === false || typeof x5 === "bigint" && typeof y4 === "bigint") {
    if (prefix !== 4)
      throw new InvalidPrefixError({
        prefix,
        cause: new InvalidUncompressedPrefixError()
      });
    return;
  }
  if (compressed === true || typeof x5 === "bigint" && typeof y4 === "undefined") {
    if (prefix !== 3 && prefix !== 2)
      throw new InvalidPrefixError({
        prefix,
        cause: new InvalidCompressedPrefixError()
      });
    return;
  }
  throw new InvalidError({ publicKey });
}
function from3(value) {
  const publicKey = (() => {
    if (validate(value))
      return fromHex2(value);
    if (validate2(value))
      return fromBytes2(value);
    const { prefix, x: x5, y: y4 } = value;
    if (typeof x5 === "bigint" && typeof y4 === "bigint")
      return { prefix: prefix ?? 4, x: x5, y: y4 };
    return { prefix, x: x5 };
  })();
  assert3(publicKey);
  return publicKey;
}
function fromBytes2(publicKey) {
  return fromHex2(fromBytes(publicKey));
}
function fromHex2(publicKey) {
  if (publicKey.length !== 132 && publicKey.length !== 130 && publicKey.length !== 68)
    throw new InvalidSerializedSizeError({ publicKey });
  if (publicKey.length === 130) {
    const x6 = BigInt(slice(publicKey, 0, 32));
    const y4 = BigInt(slice(publicKey, 32, 64));
    return {
      prefix: 4,
      x: x6,
      y: y4
    };
  }
  if (publicKey.length === 132) {
    const prefix2 = Number(slice(publicKey, 0, 1));
    const x6 = BigInt(slice(publicKey, 1, 33));
    const y4 = BigInt(slice(publicKey, 33, 65));
    return {
      prefix: prefix2,
      x: x6,
      y: y4
    };
  }
  const prefix = Number(slice(publicKey, 0, 1));
  const x5 = BigInt(slice(publicKey, 1, 33));
  return {
    prefix,
    x: x5
  };
}
function toBytes2(publicKey, options = {}) {
  return fromHex(toHex(publicKey, options));
}
function toHex(publicKey, options = {}) {
  assert3(publicKey);
  const { prefix, x: x5, y: y4 } = publicKey;
  const { includePrefix = true } = options;
  const publicKey_ = concat(
    includePrefix ? fromNumber(prefix, { size: 1 }) : "0x",
    fromNumber(x5, { size: 32 }),
    // If the public key is not compressed, add the y coordinate.
    typeof y4 === "bigint" ? fromNumber(y4, { size: 32 }) : "0x"
  );
  return publicKey_;
}
var InvalidError = class extends BaseError {
  constructor({ publicKey }) {
    super(`Value \`${stringify2(publicKey)}\` is not a valid public key.`, {
      metaMessages: [
        "Public key must contain:",
        "- an `x` and `prefix` value (compressed)",
        "- an `x`, `y`, and `prefix` value (uncompressed)"
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidError"
    });
  }
};
var InvalidPrefixError = class extends BaseError {
  constructor({ prefix, cause }) {
    super(`Prefix "${prefix}" is invalid.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidPrefixError"
    });
  }
};
var InvalidCompressedPrefixError = class extends BaseError {
  constructor() {
    super("Prefix must be 2 or 3 for compressed public keys.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidCompressedPrefixError"
    });
  }
};
var InvalidUncompressedPrefixError = class extends BaseError {
  constructor() {
    super("Prefix must be 4 for uncompressed public keys.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidUncompressedPrefixError"
    });
  }
};
var InvalidSerializedSizeError = class extends BaseError {
  constructor({ publicKey }) {
    super(`Value \`${publicKey}\` is an invalid public key size.`, {
      metaMessages: [
        "Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).",
        `Received ${size2(from(publicKey))} bytes.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidSerializedSizeError"
    });
  }
};

// node_modules/ox/_esm/core/Address.js
var addressRegex = /^0x[a-fA-F0-9]{40}$/;
function assert4(value, options = {}) {
  const { strict = true } = options;
  if (!addressRegex.test(value))
    throw new InvalidAddressError({
      address: value,
      cause: new InvalidInputError()
    });
  if (strict) {
    if (value.toLowerCase() === value)
      return;
    if (checksum2(value) !== value)
      throw new InvalidAddressError({
        address: value,
        cause: new InvalidChecksumError()
      });
  }
}
function checksum2(address) {
  if (checksum.has(address))
    return checksum.get(address);
  assert4(address, { strict: false });
  const hexAddress = address.substring(2).toLowerCase();
  const hash = keccak256(fromString(hexAddress), { as: "Bytes" });
  const characters = hexAddress.split("");
  for (let i3 = 0; i3 < 40; i3 += 2) {
    if (hash[i3 >> 1] >> 4 >= 8 && characters[i3]) {
      characters[i3] = characters[i3].toUpperCase();
    }
    if ((hash[i3 >> 1] & 15) >= 8 && characters[i3 + 1]) {
      characters[i3 + 1] = characters[i3 + 1].toUpperCase();
    }
  }
  const result = `0x${characters.join("")}`;
  checksum.set(address, result);
  return result;
}
function from4(address, options = {}) {
  const { checksum: checksumVal = false } = options;
  assert4(address);
  if (checksumVal)
    return checksum2(address);
  return address;
}
function fromPublicKey(publicKey, options = {}) {
  const address = keccak256(`0x${toHex(publicKey).slice(4)}`).substring(26);
  return from4(`0x${address}`, options);
}
function isEqual(addressA, addressB) {
  assert4(addressA, { strict: false });
  assert4(addressB, { strict: false });
  return addressA.toLowerCase() === addressB.toLowerCase();
}
var InvalidAddressError = class extends BaseError {
  constructor({ address, cause }) {
    super(`Address "${address}" is invalid.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidAddressError"
    });
  }
};
var InvalidInputError = class extends BaseError {
  constructor() {
    super("Address is not a 20 byte (40 hexadecimal character) value.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidInputError"
    });
  }
};
var InvalidChecksumError = class extends BaseError {
  constructor() {
    super("Address does not match its checksum counterpart.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidChecksumError"
    });
  }
};

// node_modules/ox/_esm/core/Solidity.js
var maxInt8 = 2n ** (8n - 1n) - 1n;
var maxInt16 = 2n ** (16n - 1n) - 1n;
var maxInt24 = 2n ** (24n - 1n) - 1n;
var maxInt32 = 2n ** (32n - 1n) - 1n;
var maxInt40 = 2n ** (40n - 1n) - 1n;
var maxInt48 = 2n ** (48n - 1n) - 1n;
var maxInt56 = 2n ** (56n - 1n) - 1n;
var maxInt64 = 2n ** (64n - 1n) - 1n;
var maxInt72 = 2n ** (72n - 1n) - 1n;
var maxInt80 = 2n ** (80n - 1n) - 1n;
var maxInt88 = 2n ** (88n - 1n) - 1n;
var maxInt96 = 2n ** (96n - 1n) - 1n;
var maxInt104 = 2n ** (104n - 1n) - 1n;
var maxInt112 = 2n ** (112n - 1n) - 1n;
var maxInt120 = 2n ** (120n - 1n) - 1n;
var maxInt128 = 2n ** (128n - 1n) - 1n;
var maxInt136 = 2n ** (136n - 1n) - 1n;
var maxInt144 = 2n ** (144n - 1n) - 1n;
var maxInt152 = 2n ** (152n - 1n) - 1n;
var maxInt160 = 2n ** (160n - 1n) - 1n;
var maxInt168 = 2n ** (168n - 1n) - 1n;
var maxInt176 = 2n ** (176n - 1n) - 1n;
var maxInt184 = 2n ** (184n - 1n) - 1n;
var maxInt192 = 2n ** (192n - 1n) - 1n;
var maxInt200 = 2n ** (200n - 1n) - 1n;
var maxInt208 = 2n ** (208n - 1n) - 1n;
var maxInt216 = 2n ** (216n - 1n) - 1n;
var maxInt224 = 2n ** (224n - 1n) - 1n;
var maxInt232 = 2n ** (232n - 1n) - 1n;
var maxInt240 = 2n ** (240n - 1n) - 1n;
var maxInt248 = 2n ** (248n - 1n) - 1n;
var maxInt256 = 2n ** (256n - 1n) - 1n;
var minInt8 = -(2n ** (8n - 1n));
var minInt16 = -(2n ** (16n - 1n));
var minInt24 = -(2n ** (24n - 1n));
var minInt32 = -(2n ** (32n - 1n));
var minInt40 = -(2n ** (40n - 1n));
var minInt48 = -(2n ** (48n - 1n));
var minInt56 = -(2n ** (56n - 1n));
var minInt64 = -(2n ** (64n - 1n));
var minInt72 = -(2n ** (72n - 1n));
var minInt80 = -(2n ** (80n - 1n));
var minInt88 = -(2n ** (88n - 1n));
var minInt96 = -(2n ** (96n - 1n));
var minInt104 = -(2n ** (104n - 1n));
var minInt112 = -(2n ** (112n - 1n));
var minInt120 = -(2n ** (120n - 1n));
var minInt128 = -(2n ** (128n - 1n));
var minInt136 = -(2n ** (136n - 1n));
var minInt144 = -(2n ** (144n - 1n));
var minInt152 = -(2n ** (152n - 1n));
var minInt160 = -(2n ** (160n - 1n));
var minInt168 = -(2n ** (168n - 1n));
var minInt176 = -(2n ** (176n - 1n));
var minInt184 = -(2n ** (184n - 1n));
var minInt192 = -(2n ** (192n - 1n));
var minInt200 = -(2n ** (200n - 1n));
var minInt208 = -(2n ** (208n - 1n));
var minInt216 = -(2n ** (216n - 1n));
var minInt224 = -(2n ** (224n - 1n));
var minInt232 = -(2n ** (232n - 1n));
var minInt240 = -(2n ** (240n - 1n));
var minInt248 = -(2n ** (248n - 1n));
var minInt256 = -(2n ** (256n - 1n));
var maxUint8 = 2n ** 8n - 1n;
var maxUint16 = 2n ** 16n - 1n;
var maxUint24 = 2n ** 24n - 1n;
var maxUint32 = 2n ** 32n - 1n;
var maxUint40 = 2n ** 40n - 1n;
var maxUint48 = 2n ** 48n - 1n;
var maxUint56 = 2n ** 56n - 1n;
var maxUint64 = 2n ** 64n - 1n;
var maxUint72 = 2n ** 72n - 1n;
var maxUint80 = 2n ** 80n - 1n;
var maxUint88 = 2n ** 88n - 1n;
var maxUint96 = 2n ** 96n - 1n;
var maxUint104 = 2n ** 104n - 1n;
var maxUint112 = 2n ** 112n - 1n;
var maxUint120 = 2n ** 120n - 1n;
var maxUint128 = 2n ** 128n - 1n;
var maxUint136 = 2n ** 136n - 1n;
var maxUint144 = 2n ** 144n - 1n;
var maxUint152 = 2n ** 152n - 1n;
var maxUint160 = 2n ** 160n - 1n;
var maxUint168 = 2n ** 168n - 1n;
var maxUint176 = 2n ** 176n - 1n;
var maxUint184 = 2n ** 184n - 1n;
var maxUint192 = 2n ** 192n - 1n;
var maxUint200 = 2n ** 200n - 1n;
var maxUint208 = 2n ** 208n - 1n;
var maxUint216 = 2n ** 216n - 1n;
var maxUint224 = 2n ** 224n - 1n;
var maxUint232 = 2n ** 232n - 1n;
var maxUint240 = 2n ** 240n - 1n;
var maxUint248 = 2n ** 248n - 1n;
var maxUint256 = 2n ** 256n - 1n;

// node_modules/ox/_esm/core/Signature.js
var Signature_exports = {};
__export(Signature_exports, {
  InvalidRError: () => InvalidRError,
  InvalidSError: () => InvalidSError,
  InvalidSerializedSizeError: () => InvalidSerializedSizeError2,
  InvalidVError: () => InvalidVError,
  InvalidYParityError: () => InvalidYParityError,
  MissingPropertiesError: () => MissingPropertiesError,
  assert: () => assert5,
  extract: () => extract,
  from: () => from5,
  fromBytes: () => fromBytes3,
  fromDerBytes: () => fromDerBytes,
  fromDerHex: () => fromDerHex,
  fromHex: () => fromHex3,
  fromLegacy: () => fromLegacy,
  fromRpc: () => fromRpc,
  fromTuple: () => fromTuple,
  toBytes: () => toBytes3,
  toDerBytes: () => toDerBytes,
  toDerHex: () => toDerHex,
  toHex: () => toHex2,
  toLegacy: () => toLegacy,
  toRpc: () => toRpc,
  toTuple: () => toTuple,
  vToYParity: () => vToYParity,
  validate: () => validate3,
  yParityToV: () => yParityToV
});

// node_modules/@noble/hashes/esm/hmac.js
var HMAC = class extends Hash {
  constructor(hash, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    ahash(hash);
    const key = toBytes(_key);
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad3 = new Uint8Array(blockLen);
    pad3.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i3 = 0; i3 < pad3.length; i3++)
      pad3[i3] ^= 54;
    this.iHash.update(pad3);
    this.oHash = hash.create();
    for (let i3 = 0; i3 < pad3.length; i3++)
      pad3[i3] ^= 54 ^ 92;
    this.oHash.update(pad3);
    clean(pad3);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    abytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to4) {
    to4 || (to4 = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to4 = to4;
    to4.finished = finished;
    to4.destroyed = destroyed;
    to4.blockLen = blockLen;
    to4.outputLen = outputLen;
    to4.oHash = oHash._cloneInto(to4.oHash);
    to4.iHash = iHash._cloneInto(to4.iHash);
    return to4;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);

// node_modules/ox/node_modules/@noble/curves/esm/abstract/modular.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
var _2n2 = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _8n = /* @__PURE__ */ BigInt(8);
function mod(a3, b5) {
  const result = a3 % b5;
  return result >= _0n3 ? result : b5 + result;
}
function pow2(x5, power, modulo) {
  let res = x5;
  while (power-- > _0n3) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n3)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n3)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a3 = mod(number, modulo);
  let b5 = modulo;
  let x5 = _0n3, y4 = _1n3, u2 = _1n3, v5 = _0n3;
  while (a3 !== _0n3) {
    const q3 = b5 / a3;
    const r3 = b5 % a3;
    const m3 = x5 - u2 * q3;
    const n5 = y4 - v5 * q3;
    b5 = a3, a3 = r3, x5 = u2, y4 = v5, u2 = m3, v5 = n5;
  }
  const gcd2 = b5;
  if (gcd2 !== _1n3)
    throw new Error("invert: does not exist");
  return mod(x5, modulo);
}
function sqrt3mod4(Fp, n5) {
  const p1div4 = (Fp.ORDER + _1n3) / _4n;
  const root = Fp.pow(n5, p1div4);
  if (!Fp.eql(Fp.sqr(root), n5))
    throw new Error("Cannot find square root");
  return root;
}
function sqrt5mod8(Fp, n5) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n22 = Fp.mul(n5, _2n2);
  const v5 = Fp.pow(n22, p5div8);
  const nv = Fp.mul(n5, v5);
  const i3 = Fp.mul(Fp.mul(nv, _2n2), v5);
  const root = Fp.mul(nv, Fp.sub(i3, Fp.ONE));
  if (!Fp.eql(Fp.sqr(root), n5))
    throw new Error("Cannot find square root");
  return root;
}
function tonelliShanks(P5) {
  if (P5 < BigInt(3))
    throw new Error("sqrt is not defined for small field");
  let Q5 = P5 - _1n3;
  let S4 = 0;
  while (Q5 % _2n2 === _0n3) {
    Q5 /= _2n2;
    S4++;
  }
  let Z2 = _2n2;
  const _Fp = Field(P5);
  while (FpLegendre(_Fp, Z2) === 1) {
    if (Z2++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S4 === 1)
    return sqrt3mod4;
  let cc2 = _Fp.pow(Z2, Q5);
  const Q1div2 = (Q5 + _1n3) / _2n2;
  return function tonelliSlow(Fp, n5) {
    if (Fp.is0(n5))
      return n5;
    if (FpLegendre(Fp, n5) !== 1)
      throw new Error("Cannot find square root");
    let M4 = S4;
    let c5 = Fp.mul(Fp.ONE, cc2);
    let t = Fp.pow(n5, Q5);
    let R4 = Fp.pow(n5, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i3 = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i3++;
        t_tmp = Fp.sqr(t_tmp);
        if (i3 === M4)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n3 << BigInt(M4 - i3 - 1);
      const b5 = Fp.pow(c5, exponent);
      M4 = i3;
      c5 = Fp.sqr(b5);
      t = Fp.mul(t, c5);
      R4 = Fp.mul(R4, b5);
    }
    return R4;
  };
}
function FpSqrt(P5) {
  if (P5 % _4n === _3n)
    return sqrt3mod4;
  if (P5 % _8n === _5n)
    return sqrt5mod8;
  return tonelliShanks(P5);
}
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(Fp, num, power) {
  if (power < _0n3)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n3)
    return Fp.ONE;
  if (power === _1n3)
    return num;
  let p3 = Fp.ONE;
  let d4 = num;
  while (power > _0n3) {
    if (power & _1n3)
      p3 = Fp.mul(p3, d4);
    d4 = Fp.sqr(d4);
    power >>= _1n3;
  }
  return p3;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i3) => {
    if (Fp.is0(num))
      return acc;
    inverted[i3] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i3) => {
    if (Fp.is0(num))
      return acc;
    inverted[i3] = Fp.mul(acc, inverted[i3]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n5) {
  const p1mod2 = (Fp.ORDER - _1n3) / _2n2;
  const powered = Fp.pow(n5, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no4 = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no4)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n5, nBitLength) {
  if (nBitLength !== void 0)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n5.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n3)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f4 = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n3,
    ONE: _1n3,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n3 <= num && num < ORDER;
    },
    is0: (num) => num === _0n3,
    isOdd: (num) => (num & _1n3) === _1n3,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f4, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n5) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f4, n5);
    }),
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes) => {
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      return isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (lst) => FpInvertBatch(f4, lst),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (a3, b5, c5) => c5 ? b5 : a3
  });
  return Object.freeze(f4);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length2 = getFieldBytesLength(fieldOrder);
  return length2 + Math.ceil(length2 / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n3) + _1n3;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

// node_modules/ox/node_modules/@noble/curves/esm/abstract/curve.js
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function validateW(W5, bits) {
  if (!Number.isSafeInteger(W5) || W5 <= 0 || W5 > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W5);
}
function calcWOpts(W5, scalarBits) {
  validateW(W5, scalarBits);
  const windows = Math.ceil(scalarBits / W5) + 1;
  const windowSize = 2 ** (W5 - 1);
  const maxNumber = 2 ** W5;
  const mask = bitMask(W5);
  const shiftBy = BigInt(W5);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n5, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n5 & mask);
  let nextN = n5 >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n4;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c5) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p3, i3) => {
    if (!(p3 instanceof c5))
      throw new Error("invalid point at index " + i3);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s2, i3) => {
    if (!field.isValid(s2))
      throw new Error("invalid scalar at index " + i3);
  });
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P5) {
  return pointWindowSizes.get(P5) || 1;
}
function wNAF(c5, bits) {
  return {
    constTimeNegate,
    hasPrecomputes(elm) {
      return getW(elm) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(elm, n5, p3 = c5.ZERO) {
      let d4 = elm;
      while (n5 > _0n4) {
        if (n5 & _1n4)
          p3 = p3.add(d4);
        d4 = d4.double();
        n5 >>= _1n4;
      }
      return p3;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W5) {
      const { windows, windowSize } = calcWOpts(W5, bits);
      const points = [];
      let p3 = elm;
      let base3 = p3;
      for (let window2 = 0; window2 < windows; window2++) {
        base3 = p3;
        points.push(base3);
        for (let i3 = 1; i3 < windowSize; i3++) {
          base3 = base3.add(p3);
          points.push(base3);
        }
        p3 = base3.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W5, precomputes, n5) {
      let p3 = c5.ZERO;
      let f4 = c5.BASE;
      const wo4 = calcWOpts(W5, bits);
      for (let window2 = 0; window2 < wo4.windows; window2++) {
        const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n5, window2, wo4);
        n5 = nextN;
        if (isZero) {
          f4 = f4.add(constTimeNegate(isNegF, precomputes[offsetF]));
        } else {
          p3 = p3.add(constTimeNegate(isNeg, precomputes[offset]));
        }
      }
      return { p: p3, f: f4 };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W5, precomputes, n5, acc = c5.ZERO) {
      const wo4 = calcWOpts(W5, bits);
      for (let window2 = 0; window2 < wo4.windows; window2++) {
        if (n5 === _0n4)
          break;
        const { nextN, offset, isZero, isNeg } = calcOffsets(n5, window2, wo4);
        n5 = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      return acc;
    },
    getPrecomputes(W5, P5, transform) {
      let comp = pointPrecomputes.get(P5);
      if (!comp) {
        comp = this.precomputeWindow(P5, W5);
        if (W5 !== 1)
          pointPrecomputes.set(P5, transform(comp));
      }
      return comp;
    },
    wNAFCached(P5, n5, transform) {
      const W5 = getW(P5);
      return this.wNAF(W5, this.getPrecomputes(W5, P5, transform), n5);
    },
    wNAFCachedUnsafe(P5, n5, transform, prev) {
      const W5 = getW(P5);
      if (W5 === 1)
        return this.unsafeLadder(P5, n5, prev);
      return this.wNAFUnsafe(W5, this.getPrecomputes(W5, P5, transform), n5, prev);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P5, W5) {
      validateW(W5, bits);
      pointWindowSizes.set(P5, W5);
      pointPrecomputes.delete(P5);
    }
  };
}
function pippenger(c5, fieldN, points, scalars) {
  validateMSMPoints(points, c5);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c5.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i3 = lastBits; i3 >= 0; i3 -= windowSize) {
    buckets.fill(zero);
    for (let j6 = 0; j6 < slength; j6++) {
      const scalar = scalars[j6];
      const wbits2 = Number(scalar >> BigInt(i3) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j6]);
    }
    let resI = zero;
    for (let j6 = buckets.length - 1, sumI = zero; j6 > 0; j6--) {
      sumI = sumI.add(buckets[j6]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i3 !== 0)
      for (let j6 = 0; j6 < windowSize; j6++)
        sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}

// node_modules/ox/node_modules/@noble/curves/esm/abstract/weierstrass.js
function validateSigVerOpts(opts) {
  if (opts.lowS !== void 0)
    abool("lowS", opts.lowS);
  if (opts.prehash !== void 0)
    abool("prehash", opts.prehash);
}
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowInfinityPoint: "boolean",
    allowedPrivateKeyLengths: "array",
    clearCofactor: "function",
    fromBytes: "function",
    isTorsionFree: "function",
    toBytes: "function",
    wrapPrivateKey: "boolean"
  });
  const { endo, Fp, a: a3 } = opts;
  if (endo) {
    if (!Fp.eql(a3, Fp.ZERO)) {
      throw new Error("invalid endo: CURVE.a must be 0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
    }
  }
  return Object.freeze({ ...opts });
}
var DERErr = class extends Error {
  constructor(m3 = "") {
    super(m3);
  }
};
var DER = {
  // asn.1 DER encoding utils
  Err: DERErr,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag, data) => {
      const { Err: E3 } = DER;
      if (tag < 0 || tag > 256)
        throw new E3("tlv.encode: wrong tag");
      if (data.length & 1)
        throw new E3("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128)
        throw new E3("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded(tag);
      return t + lenLen + len + data;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const { Err: E3 } = DER;
      let pos = 0;
      if (tag < 0 || tag > 256)
        throw new E3("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag)
        throw new E3("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length2 = 0;
      if (!isLong)
        length2 = first;
      else {
        const lenLen = first & 127;
        if (!lenLen)
          throw new E3("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4)
          throw new E3("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen)
          throw new E3("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0)
          throw new E3("tlv.decode(long): zero leftmost byte");
        for (const b5 of lengthBytes)
          length2 = length2 << 8 | b5;
        pos += lenLen;
        if (length2 < 128)
          throw new E3("tlv.decode(long): not minimal encoding");
      }
      const v5 = data.subarray(pos, pos + length2);
      if (v5.length !== length2)
        throw new E3("tlv.decode: wrong value length");
      return { v: v5, l: data.subarray(pos + length2) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num) {
      const { Err: E3 } = DER;
      if (num < _0n5)
        throw new E3("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded(num);
      if (Number.parseInt(hex[0], 16) & 8)
        hex = "00" + hex;
      if (hex.length & 1)
        throw new E3("unexpected DER parsing assertion: unpadded hex");
      return hex;
    },
    decode(data) {
      const { Err: E3 } = DER;
      if (data[0] & 128)
        throw new E3("invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128))
        throw new E3("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    }
  },
  toSig(hex) {
    const { Err: E3, _int: int, _tlv: tlv } = DER;
    const data = ensureBytes("signature", hex);
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E3("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E3("invalid signature: left bytes after parsing");
    return { r: int.decode(rBytes), s: int.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER;
    const rs2 = tlv.encode(2, int.encode(sig.r));
    const ss2 = tlv.encode(2, int.encode(sig.s));
    const seq = rs2 + ss2;
    return tlv.encode(48, seq);
  }
};
function numToSizedHex(num, size3) {
  return bytesToHex(numberToBytesBE(num, size3));
}
var _0n5 = BigInt(0);
var _1n5 = BigInt(1);
var _2n3 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp } = CURVE;
  const Fn4 = Field(CURVE.n, CURVE.nBitLength);
  const toBytes4 = CURVE.toBytes || ((_c2, point, _isCompressed) => {
    const a3 = point.toAffine();
    return concatBytes2(Uint8Array.from([4]), Fp.toBytes(a3.x), Fp.toBytes(a3.y));
  });
  const fromBytes4 = CURVE.fromBytes || ((bytes) => {
    const tail = bytes.subarray(1);
    const x5 = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
    const y4 = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
    return { x: x5, y: y4 };
  });
  function weierstrassEquation(x5) {
    const { a: a3, b: b5 } = CURVE;
    const x22 = Fp.sqr(x5);
    const x32 = Fp.mul(x22, x5);
    return Fp.add(Fp.add(x32, Fp.mul(x5, a3)), b5);
  }
  function isValidXY(x5, y4) {
    const left = Fp.sqr(y4);
    const right = weierstrassEquation(x5);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function isWithinCurveOrder(num) {
    return inRange(num, _1n5, CURVE.n);
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N12 } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes2(key))
        key = bytesToHex(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("invalid private key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
    }
    if (wrapPrivateKey)
      num = mod(num, N12);
    aInRange("private key", num, _1n5, N12);
    return num;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }
  const toAffineMemo = memoized((p3, iz) => {
    const { px: x5, py: y4, pz: z4 } = p3;
    if (Fp.eql(z4, Fp.ONE))
      return { x: x5, y: y4 };
    const is0 = p3.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(z4);
    const ax = Fp.mul(x5, iz);
    const ay = Fp.mul(y4, iz);
    const zz = Fp.mul(z4, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p3) => {
    if (p3.is0()) {
      if (CURVE.allowInfinityPoint && !Fp.is0(p3.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: x5, y: y4 } = p3.toAffine();
    if (!Fp.isValid(x5) || !Fp.isValid(y4))
      throw new Error("bad point: x or y not FE");
    if (!isValidXY(x5, y4))
      throw new Error("bad point: equation left != right");
    if (!p3.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  class Point {
    constructor(px, py, pz) {
      if (px == null || !Fp.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp.isValid(py) || Fp.is0(py))
        throw new Error("y required");
      if (pz == null || !Fp.isValid(pz))
        throw new Error("z required");
      this.px = px;
      this.py = py;
      this.pz = pz;
      Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p3) {
      const { x: x5, y: y4 } = p3 || {};
      if (!p3 || !Fp.isValid(x5) || !Fp.isValid(y4))
        throw new Error("invalid affine point");
      if (p3 instanceof Point)
        throw new Error("projective point not allowed");
      const is0 = (i3) => Fp.eql(i3, Fp.ZERO);
      if (is0(x5) && is0(y4))
        return Point.ZERO;
      return new Point(x5, y4, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = FpInvertBatch(Fp, points.map((p3) => p3.pz));
      return points.map((p3, i3) => p3.toAffine(toInv[i3])).map(Point.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P5 = Point.fromAffine(fromBytes4(ensureBytes("pointHex", hex)));
      P5.assertValidity();
      return P5;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn4, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y: y4 } = this.toAffine();
      if (Fp.isOdd)
        return !Fp.isOdd(y4);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X22, py: Y22, pz: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X22, Z1));
      const U22 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y22, Z1));
      return U1 && U22;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point(this.px, Fp.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: a3, b: b5 } = CURVE;
      const b32 = Fp.mul(b5, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X32 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X32 = Fp.mul(a3, Z3);
      Y3 = Fp.mul(b32, t2);
      Y3 = Fp.add(X32, Y3);
      X32 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X32, Y3);
      X32 = Fp.mul(t3, X32);
      Z3 = Fp.mul(b32, Z3);
      t2 = Fp.mul(a3, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a3, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X32 = Fp.sub(X32, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X32, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X22, py: Y22, pz: Z2 } = other;
      let X32 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a3 = CURVE.a;
      const b32 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X22);
      let t1 = Fp.mul(Y1, Y22);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X22, Y22);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X22, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X32 = Fp.add(Y22, Z2);
      t5 = Fp.mul(t5, X32);
      X32 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X32);
      Z3 = Fp.mul(a3, t4);
      X32 = Fp.mul(b32, t2);
      Z3 = Fp.add(X32, Z3);
      X32 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X32, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a3, t2);
      t4 = Fp.mul(b32, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a3, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X32 = Fp.mul(t3, X32);
      X32 = Fp.sub(X32, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X32, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n5) {
      return wnaf.wNAFCached(this, n5, Point.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc2) {
      const { endo: endo2, n: N12 } = CURVE;
      aInRange("scalar", sc2, _0n5, N12);
      const I3 = Point.ZERO;
      if (sc2 === _0n5)
        return I3;
      if (this.is0() || sc2 === _1n5)
        return this;
      if (!endo2 || wnaf.hasPrecomputes(this))
        return wnaf.wNAFCachedUnsafe(this, sc2, Point.normalizeZ);
      let { k1neg, k1, k2neg, k2: k22 } = endo2.splitScalar(sc2);
      let k1p = I3;
      let k2p = I3;
      let d4 = this;
      while (k1 > _0n5 || k22 > _0n5) {
        if (k1 & _1n5)
          k1p = k1p.add(d4);
        if (k22 & _1n5)
          k2p = k2p.add(d4);
        d4 = d4.double();
        k1 >>= _1n5;
        k22 >>= _1n5;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2, n: N12 } = CURVE;
      aInRange("scalar", scalar, _1n5, N12);
      let point, fake;
      if (endo2) {
        const { k1neg, k1, k2neg, k2: k22 } = endo2.splitScalar(scalar);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k22);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p: p3, f: f4 } = this.wNAF(scalar);
        point = p3;
        fake = f4;
      }
      return Point.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q5, a3, b5) {
      const G4 = Point.BASE;
      const mul = (P5, a4) => a4 === _0n5 || a4 === _1n5 || !P5.equals(G4) ? P5.multiplyUnsafe(a4) : P5.multiply(a4);
      const sum = mul(this, a3).add(mul(Q5, b5));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n5)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n5)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool("isCompressed", isCompressed);
      this.assertValidity();
      return toBytes4(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool("isCompressed", isCompressed);
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
  const { endo, nBitLength } = CURVE;
  const wnaf = wNAF(Point, endo ? Math.ceil(nBitLength / 2) : nBitLength);
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp, n: CURVE_ORDER, nByteLength, nBitLength } = CURVE;
  const compressedLen = Fp.BYTES + 1;
  const uncompressedLen = 2 * Fp.BYTES + 1;
  function modN(a3) {
    return mod(a3, CURVE_ORDER);
  }
  function invN(a3) {
    return invert(a3, CURVE_ORDER);
  }
  const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c2, point, isCompressed) {
      const a3 = point.toAffine();
      const x5 = Fp.toBytes(a3.x);
      const cat = concatBytes2;
      abool("isCompressed", isCompressed);
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x5);
      } else {
        return cat(Uint8Array.from([4]), x5, Fp.toBytes(a3.y));
      }
    },
    fromBytes(bytes) {
      const len = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x5 = bytesToNumberBE(tail);
        if (!inRange(x5, _1n5, Fp.ORDER))
          throw new Error("Point is not on curve");
        const y22 = weierstrassEquation(x5);
        let y4;
        try {
          y4 = Fp.sqrt(y22);
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("Point is not on curve" + suffix);
        }
        const isYOdd = (y4 & _1n5) === _1n5;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y4 = Fp.neg(y4);
        return { x: x5, y: y4 };
      } else if (len === uncompressedLen && head === 4) {
        const x5 = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y4 = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x: x5, y: y4 };
      } else {
        const cl = compressedLen;
        const ul = uncompressedLen;
        throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
      }
    }
  });
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n5;
    return number > HALF;
  }
  function normalizeS(s2) {
    return isBiggerThanHalfOrder(s2) ? modN(-s2) : s2;
  }
  const slcNum = (b5, from8, to4) => bytesToNumberBE(b5.slice(from8, to4));
  class Signature {
    constructor(r3, s2, recovery) {
      aInRange("r", r3, _1n5, CURVE_ORDER);
      aInRange("s", s2, _1n5, CURVE_ORDER);
      this.r = r3;
      this.s = s2;
      if (recovery != null)
        this.recovery = recovery;
      Object.freeze(this);
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const l6 = nByteLength;
      hex = ensureBytes("compactSignature", hex, l6 * 2);
      return new Signature(slcNum(hex, 0, l6), slcNum(hex, l6, 2 * l6));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const { r: r3, s: s2 } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r3, s2);
    }
    /**
     * @todo remove
     * @deprecated
     */
    assertValidity() {
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r: r3, s: s2, recovery: rec } = this;
      const h4 = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r3 + CURVE.n : r3;
      if (radj >= Fp.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R4 = Point.fromHex(prefix + numToSizedHex(radj, Fp.BYTES));
      const ir3 = invN(radj);
      const u1 = modN(-h4 * ir3);
      const u2 = modN(s2 * ir3);
      const Q5 = Point.BASE.multiplyAndAddUnsafe(R4, u1, u2);
      if (!Q5)
        throw new Error("point at infinify");
      Q5.assertValidity();
      return Q5;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig(this);
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
      const l6 = nByteLength;
      return numToSizedHex(this.r, l6) + numToSizedHex(this.s, l6);
    }
  }
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const length2 = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length2), CURVE.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey2(privateKey, isCompressed = true) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    if (typeof item === "bigint")
      return false;
    if (item instanceof Point)
      return true;
    const arr = ensureBytes("key", item);
    const len = arr.length;
    const fpl = Fp.BYTES;
    const compLen = fpl + 1;
    const uncompLen = 2 * fpl + 1;
    if (CURVE.allowedPrivateKeyLengths || nByteLength === compLen) {
      return void 0;
    } else {
      return len === compLen || len === uncompLen;
    }
  }
  function getSharedSecret2(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicB) === false)
      throw new Error("second arg must be public key");
    const b5 = Point.fromHex(publicB);
    return b5.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
    return modN(bits2int(bytes));
  };
  const ORDER_MASK = bitMask(nBitLength);
  function int2octets(num) {
    aInRange("num < 2^" + nBitLength, num, _0n5, ORDER_MASK);
    return numberToBytesBE(num, nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k4) => k4 in opts))
      throw new Error("sign() legacy options not supported");
    const { hash, randomBytes: randomBytes2 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    validateSigVerOpts(opts);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d4 = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d4), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e2 = ent === true ? randomBytes2(Fp.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e2));
    }
    const seed = concatBytes2(...seedArgs);
    const m3 = h1int;
    function k2sig(kBytes) {
      const k4 = bits2int(kBytes);
      if (!isWithinCurveOrder(k4))
        return;
      const ik = invN(k4);
      const q3 = Point.BASE.multiply(k4).toAffine();
      const r3 = modN(q3.x);
      if (r3 === _0n5)
        return;
      const s2 = modN(ik * modN(m3 + r3 * d4));
      if (s2 === _0n5)
        return;
      let recovery = (q3.x === r3 ? 0 : 2) | Number(q3.y & _1n5);
      let normS = s2;
      if (lowS && isBiggerThanHalfOrder(s2)) {
        normS = normalizeS(s2);
        recovery ^= 1;
      }
      return new Signature(r3, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign2(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C4 = CURVE;
    const drbg = createHmacDrbg(C4.hash.outputLen, C4.nByteLength, C4.hmac);
    return drbg(seed, k2sig);
  }
  Point.BASE._setWindowSize(8);
  function verify2(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    const { lowS, prehash, format } = opts;
    validateSigVerOpts(opts);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    if (format !== void 0 && format !== "compact" && format !== "der")
      throw new Error("format must be compact or der");
    const isHex = typeof sg === "string" || isBytes2(sg);
    const isObj = !isHex && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
    if (!isHex && !isObj)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    let _sig = void 0;
    let P5;
    try {
      if (isObj)
        _sig = new Signature(sg.r, sg.s);
      if (isHex) {
        try {
          if (format !== "compact")
            _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
        }
        if (!_sig && format !== "der")
          _sig = Signature.fromCompact(sg);
      }
      P5 = Point.fromHex(publicKey);
    } catch (error) {
      return false;
    }
    if (!_sig)
      return false;
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r: r3, s: s2 } = _sig;
    const h4 = bits2int_modN(msgHash);
    const is2 = invN(s2);
    const u1 = modN(h4 * is2);
    const u2 = modN(r3 * is2);
    const R4 = Point.BASE.multiplyAndAddUnsafe(P5, u1, u2)?.toAffine();
    if (!R4)
      return false;
    const v5 = modN(R4.x);
    return v5 === r3;
  }
  return {
    CURVE,
    getPublicKey: getPublicKey2,
    getSharedSecret: getSharedSecret2,
    sign: sign2,
    verify: verify2,
    ProjectivePoint: Point,
    Signature,
    utils
  };
}

// node_modules/ox/node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash) {
  return {
    hash,
    hmac: (key, ...msgs) => hmac(hash, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create2 = (hash) => weierstrass({ ...curveDef, ...getHash(hash) });
  return { ...create2(defHash), create: create2 };
}

// node_modules/ox/node_modules/@noble/curves/esm/secp256k1.js
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _0n6 = BigInt(0);
var _1n6 = BigInt(1);
var _2n4 = BigInt(2);
var divNearest = (a3, b5) => (a3 + b5 / _2n4) / b5;
function sqrtMod(y4) {
  const P5 = secp256k1P;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b22 = y4 * y4 * y4 % P5;
  const b32 = b22 * b22 * y4 % P5;
  const b6 = pow2(b32, _3n3, P5) * b32 % P5;
  const b9 = pow2(b6, _3n3, P5) * b32 % P5;
  const b11 = pow2(b9, _2n4, P5) * b22 % P5;
  const b222 = pow2(b11, _11n, P5) * b11 % P5;
  const b44 = pow2(b222, _22n, P5) * b222 % P5;
  const b88 = pow2(b44, _44n, P5) * b44 % P5;
  const b176 = pow2(b88, _88n, P5) * b88 % P5;
  const b220 = pow2(b176, _44n, P5) * b44 % P5;
  const b223 = pow2(b220, _3n3, P5) * b32 % P5;
  const t1 = pow2(b223, _23n, P5) * b222 % P5;
  const t2 = pow2(t1, _6n, P5) * b22 % P5;
  const root = pow2(t2, _2n4, P5);
  if (!Fpk1.eql(Fpk1.sqr(root), y4))
    throw new Error("Cannot find square root");
  return root;
}
var Fpk1 = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
var secp256k1 = createCurve({
  a: _0n6,
  b: BigInt(7),
  Fp: Fpk1,
  n: secp256k1N,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  lowS: true,
  // Allow only low-S signatures by default in sign() and verify()
  endo: {
    // Endomorphism, see above
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (k4) => {
      const n5 = secp256k1N;
      const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
      const b1 = -_1n6 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
      const a22 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
      const b22 = a1;
      const POW_2_128 = BigInt("0x100000000000000000000000000000000");
      const c1 = divNearest(b22 * k4, n5);
      const c22 = divNearest(-b1 * k4, n5);
      let k1 = mod(k4 - c1 * a1 - c22 * a22, n5);
      let k22 = mod(-c1 * b1 - c22 * b22, n5);
      const k1neg = k1 > POW_2_128;
      const k2neg = k22 > POW_2_128;
      if (k1neg)
        k1 = n5 - k1;
      if (k2neg)
        k22 = n5 - k22;
      if (k1 > POW_2_128 || k22 > POW_2_128) {
        throw new Error("splitScalar: Endomorphism failed, k=" + k4);
      }
      return { k1neg, k1, k2neg, k2: k22 };
    }
  }
}, sha256);

// node_modules/ox/_esm/core/Signature.js
function assert5(signature, options = {}) {
  const { recovered } = options;
  if (typeof signature.r === "undefined")
    throw new MissingPropertiesError({ signature });
  if (typeof signature.s === "undefined")
    throw new MissingPropertiesError({ signature });
  if (recovered && typeof signature.yParity === "undefined")
    throw new MissingPropertiesError({ signature });
  if (signature.r < 0n || signature.r > maxUint256)
    throw new InvalidRError({ value: signature.r });
  if (signature.s < 0n || signature.s > maxUint256)
    throw new InvalidSError({ value: signature.s });
  if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1)
    throw new InvalidYParityError({ value: signature.yParity });
}
function fromBytes3(signature) {
  return fromHex3(fromBytes(signature));
}
function fromHex3(signature) {
  if (signature.length !== 130 && signature.length !== 132)
    throw new InvalidSerializedSizeError2({ signature });
  const r3 = BigInt(slice(signature, 0, 32));
  const s2 = BigInt(slice(signature, 32, 64));
  const yParity = (() => {
    const yParity2 = Number(`0x${signature.slice(130)}`);
    if (Number.isNaN(yParity2))
      return void 0;
    try {
      return vToYParity(yParity2);
    } catch {
      throw new InvalidYParityError({ value: yParity2 });
    }
  })();
  if (typeof yParity === "undefined")
    return {
      r: r3,
      s: s2
    };
  return {
    r: r3,
    s: s2,
    yParity
  };
}
function extract(value) {
  if (typeof value.r === "undefined")
    return void 0;
  if (typeof value.s === "undefined")
    return void 0;
  return from5(value);
}
function from5(signature) {
  const signature_ = (() => {
    if (typeof signature === "string")
      return fromHex3(signature);
    if (signature instanceof Uint8Array)
      return fromBytes3(signature);
    if (typeof signature.r === "string")
      return fromRpc(signature);
    if (signature.v)
      return fromLegacy(signature);
    return {
      r: signature.r,
      s: signature.s,
      ...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
    };
  })();
  assert5(signature_);
  return signature_;
}
function fromDerBytes(signature) {
  return fromDerHex(fromBytes(signature));
}
function fromDerHex(signature) {
  const { r: r3, s: s2 } = secp256k1.Signature.fromDER(from(signature).slice(2));
  return { r: r3, s: s2 };
}
function fromLegacy(signature) {
  return {
    r: signature.r,
    s: signature.s,
    yParity: vToYParity(signature.v)
  };
}
function fromRpc(signature) {
  const yParity = (() => {
    const v5 = signature.v ? Number(signature.v) : void 0;
    let yParity2 = signature.yParity ? Number(signature.yParity) : void 0;
    if (typeof v5 === "number" && typeof yParity2 !== "number")
      yParity2 = vToYParity(v5);
    if (typeof yParity2 !== "number")
      throw new InvalidYParityError({ value: signature.yParity });
    return yParity2;
  })();
  return {
    r: BigInt(signature.r),
    s: BigInt(signature.s),
    yParity
  };
}
function fromTuple(tuple) {
  const [yParity, r3, s2] = tuple;
  return from5({
    r: r3 === "0x" ? 0n : BigInt(r3),
    s: s2 === "0x" ? 0n : BigInt(s2),
    yParity: yParity === "0x" ? 0 : Number(yParity)
  });
}
function toBytes3(signature) {
  return fromHex(toHex2(signature));
}
function toHex2(signature) {
  assert5(signature);
  const r3 = signature.r;
  const s2 = signature.s;
  const signature_ = concat(
    fromNumber(r3, { size: 32 }),
    fromNumber(s2, { size: 32 }),
    // If the signature is recovered, add the recovery byte to the signature.
    typeof signature.yParity === "number" ? fromNumber(yParityToV(signature.yParity), { size: 1 }) : "0x"
  );
  return signature_;
}
function toDerBytes(signature) {
  const sig = new secp256k1.Signature(signature.r, signature.s);
  return sig.toDERRawBytes();
}
function toDerHex(signature) {
  const sig = new secp256k1.Signature(signature.r, signature.s);
  return `0x${sig.toDERHex()}`;
}
function toLegacy(signature) {
  return {
    r: signature.r,
    s: signature.s,
    v: yParityToV(signature.yParity)
  };
}
function toRpc(signature) {
  const { r: r3, s: s2, yParity } = signature;
  return {
    r: fromNumber(r3, { size: 32 }),
    s: fromNumber(s2, { size: 32 }),
    yParity: yParity === 0 ? "0x0" : "0x1"
  };
}
function toTuple(signature) {
  const { r: r3, s: s2, yParity } = signature;
  return [
    yParity ? "0x01" : "0x",
    r3 === 0n ? "0x" : trimLeft(fromNumber(r3)),
    s2 === 0n ? "0x" : trimLeft(fromNumber(s2))
  ];
}
function validate3(signature, options = {}) {
  try {
    assert5(signature, options);
    return true;
  } catch {
    return false;
  }
}
function vToYParity(v5) {
  if (v5 === 0 || v5 === 27)
    return 0;
  if (v5 === 1 || v5 === 28)
    return 1;
  if (v5 >= 35)
    return v5 % 2 === 0 ? 1 : 0;
  throw new InvalidVError({ value: v5 });
}
function yParityToV(yParity) {
  if (yParity === 0)
    return 27;
  if (yParity === 1)
    return 28;
  throw new InvalidYParityError({ value: yParity });
}
var InvalidSerializedSizeError2 = class extends BaseError {
  constructor({ signature }) {
    super(`Value \`${signature}\` is an invalid signature size.`, {
      metaMessages: [
        "Expected: 64 bytes or 65 bytes.",
        `Received ${size2(from(signature))} bytes.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSerializedSizeError"
    });
  }
};
var MissingPropertiesError = class extends BaseError {
  constructor({ signature }) {
    super(`Signature \`${stringify2(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.MissingPropertiesError"
    });
  }
};
var InvalidRError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidRError"
    });
  }
};
var InvalidSError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSError"
    });
  }
};
var InvalidYParityError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidYParityError"
    });
  }
};
var InvalidVError = class extends BaseError {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidVError"
    });
  }
};

// node_modules/@scure/base/lib/esm/index.js
function isBytes3(a3) {
  return a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new Error(`${label}: string expected`);
  return true;
}
function anumber2(n5) {
  if (!Number.isSafeInteger(n5))
    throw new Error(`invalid integer: ${n5}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new Error(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a3) => a3;
  const wrap = (a3, b5) => (c5) => a3(b5(c5));
  const encode6 = args.map((x5) => x5.encode).reduceRight(wrap, id);
  const decode7 = args.map((x5) => x5.decode).reduce(wrap, id);
  return { encode: encode6, decode: decode7 };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l6, i3) => [l6, i3]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i3) => {
        if (!Number.isSafeInteger(i3) || i3 < 0 || i3 >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i3}". Allowed: ${letters}`);
        return lettersA[i3];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i3 = indexes.get(letter);
        if (i3 === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i3;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from8) => {
      astrArr("join.decode", from8);
      return from8.join(separator);
    },
    decode: (to4) => {
      astr("join.decode", to4);
      return to4.split(separator);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function padding(bits, chr = "=") {
  anumber2(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
var gcd = (a3, b5) => b5 === 0 ? a3 : gcd(b5, a3 % b5);
var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from8, to4) => from8 + (to4 - gcd(from8, to4));
var powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i3 = 0; i3 < 40; i3++)
    res.push(2 ** i3);
  return res;
})();
function convertRadix2(data, from8, to4, padding2) {
  aArr(data);
  if (from8 <= 0 || from8 > 32)
    throw new Error(`convertRadix2: wrong from=${from8}`);
  if (to4 <= 0 || to4 > 32)
    throw new Error(`convertRadix2: wrong to=${to4}`);
  if (/* @__PURE__ */ radix2carry(from8, to4) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from8} to=${to4} carryBits=${/* @__PURE__ */ radix2carry(from8, to4)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from8];
  const mask = powers[to4] - 1;
  const res = [];
  for (const n5 of data) {
    anumber2(n5);
    if (n5 >= max)
      throw new Error(`convertRadix2: invalid data word=${n5} from=${from8}`);
    carry = carry << from8 | n5;
    if (pos + from8 > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from8}`);
    pos += from8;
    for (; pos >= to4; pos -= to4)
      res.push((carry >> pos - to4 & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0)
      throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to4 - pos & mask;
  if (!padding2 && pos >= from8)
    throw new Error("Excess padding");
  if (!padding2 && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
// @__NO_SIDE_EFFECTS__
function radix2(bits, revPadding = false) {
  anumber2(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes3(bytes))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
var base32 = /* @__PURE__ */ chain(/* @__PURE__ */ radix2(5), /* @__PURE__ */ alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), /* @__PURE__ */ padding(5), /* @__PURE__ */ join(""));

// node_modules/ox/_esm/core/Secp256k1.js
var Secp256k1_exports = {};
__export(Secp256k1_exports, {
  createKeyPair: () => createKeyPair,
  getPublicKey: () => getPublicKey,
  getSharedSecret: () => getSharedSecret,
  noble: () => noble,
  randomPrivateKey: () => randomPrivateKey,
  recoverAddress: () => recoverAddress,
  recoverPublicKey: () => recoverPublicKey,
  sign: () => sign,
  verify: () => verify
});

// node_modules/ox/_esm/core/internal/entropy.js
var extraEntropy = false;

// node_modules/ox/_esm/core/Secp256k1.js
var noble = secp256k1;
function createKeyPair(options = {}) {
  const { as: as2 = "Hex" } = options;
  const privateKey = randomPrivateKey({ as: as2 });
  const publicKey = getPublicKey({ privateKey });
  return {
    privateKey,
    publicKey
  };
}
function getPublicKey(options) {
  const { privateKey } = options;
  const point = secp256k1.ProjectivePoint.fromPrivateKey(from(privateKey).slice(2));
  return from3(point);
}
function getSharedSecret(options) {
  const { as: as2 = "Hex", privateKey, publicKey } = options;
  const point = secp256k1.ProjectivePoint.fromHex(toHex(publicKey).slice(2));
  const sharedPoint = point.multiply(secp256k1.utils.normPrivateKeyToScalar(from(privateKey).slice(2)));
  const sharedSecret = sharedPoint.toRawBytes(true);
  if (as2 === "Hex")
    return fromBytes(sharedSecret);
  return sharedSecret;
}
function randomPrivateKey(options = {}) {
  const { as: as2 = "Hex" } = options;
  const bytes = secp256k1.utils.randomPrivateKey();
  if (as2 === "Hex")
    return fromBytes(bytes);
  return bytes;
}
function recoverAddress(options) {
  return fromPublicKey(recoverPublicKey(options));
}
function recoverPublicKey(options) {
  const { payload, signature } = options;
  const { r: r3, s: s2, yParity } = signature;
  const signature_ = new secp256k1.Signature(BigInt(r3), BigInt(s2)).addRecoveryBit(yParity);
  const point = signature_.recoverPublicKey(from(payload).substring(2));
  return from3(point);
}
function sign(options) {
  const { extraEntropy: extraEntropy2 = extraEntropy, hash, payload, privateKey } = options;
  const { r: r3, s: s2, recovery } = secp256k1.sign(from2(payload), from2(privateKey), {
    extraEntropy: typeof extraEntropy2 === "boolean" ? extraEntropy2 : from(extraEntropy2).slice(2),
    lowS: true,
    ...hash ? { prehash: true } : {}
  });
  return {
    r: r3,
    s: s2,
    yParity: recovery
  };
}
function verify(options) {
  const { address, hash, payload, publicKey, signature } = options;
  if (address)
    return isEqual(address, recoverAddress({ payload, signature }));
  return secp256k1.verify(signature, from2(payload), toBytes2(publicKey), ...hash ? [{ prehash: true, lowS: true }] : []);
}

// node_modules/@walletconnect/utils/node_modules/base-x/src/esm/index.js
function base(ALPHABET2) {
  if (ALPHABET2.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  const BASE_MAP = new Uint8Array(256);
  for (let j6 = 0; j6 < BASE_MAP.length; j6++) {
    BASE_MAP[j6] = 255;
  }
  for (let i3 = 0; i3 < ALPHABET2.length; i3++) {
    const x5 = ALPHABET2.charAt(i3);
    const xc2 = x5.charCodeAt(0);
    if (BASE_MAP[xc2] !== 255) {
      throw new TypeError(x5 + " is ambiguous");
    }
    BASE_MAP[xc2] = i3;
  }
  const BASE = ALPHABET2.length;
  const LEADER = ALPHABET2.charAt(0);
  const FACTOR = Math.log(BASE) / Math.log(256);
  const iFACTOR = Math.log(256) / Math.log(BASE);
  function encode6(source) {
    if (source instanceof Uint8Array) {
    } else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    let zeroes = 0;
    let length2 = 0;
    let pbegin = 0;
    const pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    const size3 = (pend - pbegin) * iFACTOR + 1 >>> 0;
    const b58 = new Uint8Array(size3);
    while (pbegin !== pend) {
      let carry = source[pbegin];
      let i3 = 0;
      for (let it1 = size3 - 1; (carry !== 0 || i3 < length2) && it1 !== -1; it1--, i3++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i3;
      pbegin++;
    }
    let it22 = size3 - length2;
    while (it22 !== size3 && b58[it22] === 0) {
      it22++;
    }
    let str = LEADER.repeat(zeroes);
    for (; it22 < size3; ++it22) {
      str += ALPHABET2.charAt(b58[it22]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    let psz = 0;
    let zeroes = 0;
    let length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    const size3 = (source.length - psz) * FACTOR + 1 >>> 0;
    const b256 = new Uint8Array(size3);
    while (psz < source.length) {
      const charCode = source.charCodeAt(psz);
      if (charCode > 255) {
        return;
      }
      let carry = BASE_MAP[charCode];
      if (carry === 255) {
        return;
      }
      let i3 = 0;
      for (let it3 = size3 - 1; (carry !== 0 || i3 < length2) && it3 !== -1; it3--, i3++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i3;
      psz++;
    }
    let it4 = size3 - length2;
    while (it4 !== size3 && b256[it4] === 0) {
      it4++;
    }
    const vch = new Uint8Array(zeroes + (size3 - it4));
    let j6 = zeroes;
    while (it4 !== size3) {
      vch[j6++] = b256[it4++];
    }
    return vch;
  }
  function decode7(string2) {
    const buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error("Non-base" + BASE + " character");
  }
  return {
    encode: encode6,
    decodeUnsafe,
    decode: decode7
  };
}
var esm_default = base;

// node_modules/@walletconnect/utils/node_modules/bs58/src/esm/index.js
var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var esm_default2 = esm_default(ALPHABET);

// node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs
function utf8Count(str) {
  const strLength = str.length;
  let byteLength = 0;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      byteLength++;
      continue;
    } else if ((value & 4294965248) === 0) {
      byteLength += 2;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        byteLength += 3;
      } else {
        byteLength += 4;
      }
    }
  }
  return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
  const strLength = str.length;
  let offset = outputOffset;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);
    if ((value & 4294967168) === 0) {
      output[offset++] = value;
      continue;
    } else if ((value & 4294965248) === 0) {
      output[offset++] = value >> 6 & 31 | 192;
    } else {
      if (value >= 55296 && value <= 56319) {
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 64512) === 56320) {
            ++pos;
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          }
        }
      }
      if ((value & 4294901760) === 0) {
        output[offset++] = value >> 12 & 15 | 224;
        output[offset++] = value >> 6 & 63 | 128;
      } else {
        output[offset++] = value >> 18 & 7 | 240;
        output[offset++] = value >> 12 & 63 | 128;
        output[offset++] = value >> 6 & 63 | 128;
      }
    }
    output[offset++] = value & 63 | 128;
  }
}
var sharedTextEncoder = new TextEncoder();
var TEXT_ENCODER_THRESHOLD = 50;
function utf8EncodeTE(str, output, outputOffset) {
  sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8Encode(str, output, outputOffset) {
  if (str.length > TEXT_ENCODER_THRESHOLD) {
    utf8EncodeTE(str, output, outputOffset);
  } else {
    utf8EncodeJs(str, output, outputOffset);
  }
}
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
  let offset = inputOffset;
  const end = offset + byteLength;
  const units = [];
  let result = "";
  while (offset < end) {
    const byte1 = bytes[offset++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      const byte2 = bytes[offset++] & 63;
      const byte3 = bytes[offset++] & 63;
      const byte4 = bytes[offset++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode(...units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += String.fromCharCode(...units);
  }
  return result;
}
var sharedTextDecoder = new TextDecoder();
var TEXT_DECODER_THRESHOLD = 200;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
  const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
  if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}

// node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs
var ExtData = class {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs
var DecodeError = class _DecodeError extends Error {
  constructor(message) {
    super(message);
    const proto = Object.create(_DecodeError.prototype);
    Object.setPrototypeOf(this, proto);
    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: _DecodeError.name
    });
  }
};

// node_modules/@msgpack/msgpack/dist.esm/utils/int.mjs
var UINT32_MAX = 4294967295;
function setUint64(view, offset, value) {
  const high = value / 4294967296;
  const low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
  const high = Math.floor(value / 4294967296);
  const low = value;
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
  const high = view.getInt32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}
function getUint64(view, offset) {
  const high = view.getUint32(offset);
  const low = view.getUint32(offset + 4);
  return high * 4294967296 + low;
}

// node_modules/@msgpack/msgpack/dist.esm/timestamp.mjs
var EXT_TIMESTAMP = -1;
var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
function encodeTimeSpecToTimestamp({ sec, nsec }) {
  if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
    if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
      const rv = new Uint8Array(4);
      const view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
    } else {
      const secHigh = sec / 4294967296;
      const secLow = sec & 4294967295;
      const rv = new Uint8Array(8);
      const view = new DataView(rv.buffer);
      view.setUint32(0, nsec << 2 | secHigh & 3);
      view.setUint32(4, secLow);
      return rv;
    }
  } else {
    const rv = new Uint8Array(12);
    const view = new DataView(rv.buffer);
    view.setUint32(0, nsec);
    setInt64(view, 4, sec);
    return rv;
  }
}
function encodeDateToTimeSpec(date) {
  const msec = date.getTime();
  const sec = Math.floor(msec / 1e3);
  const nsec = (msec - sec * 1e3) * 1e6;
  const nsecInSec = Math.floor(nsec / 1e9);
  return {
    sec: sec + nsecInSec,
    nsec: nsec - nsecInSec * 1e9
  };
}
function encodeTimestampExtension(object) {
  if (object instanceof Date) {
    const timeSpec = encodeDateToTimeSpec(object);
    return encodeTimeSpecToTimestamp(timeSpec);
  } else {
    return null;
  }
}
function decodeTimestampToTimeSpec(data) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  switch (data.byteLength) {
    case 4: {
      const sec = view.getUint32(0);
      const nsec = 0;
      return { sec, nsec };
    }
    case 8: {
      const nsec30AndSecHigh2 = view.getUint32(0);
      const secLow32 = view.getUint32(4);
      const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
      const nsec = nsec30AndSecHigh2 >>> 2;
      return { sec, nsec };
    }
    case 12: {
      const sec = getInt64(view, 4);
      const nsec = view.getUint32(0);
      return { sec, nsec };
    }
    default:
      throw new DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
  }
}
function decodeTimestampExtension(data) {
  const timeSpec = decodeTimestampToTimeSpec(data);
  return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
  type: EXT_TIMESTAMP,
  encode: encodeTimestampExtension,
  decode: decodeTimestampExtension
};

// node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs
var ExtensionCodec = class {
  constructor() {
    this.builtInEncoders = [];
    this.builtInDecoders = [];
    this.encoders = [];
    this.decoders = [];
    this.register(timestampExtension);
  }
  register({ type, encode: encode6, decode: decode7 }) {
    if (type >= 0) {
      this.encoders[type] = encode6;
      this.decoders[type] = decode7;
    } else {
      const index = -1 - type;
      this.builtInEncoders[index] = encode6;
      this.builtInDecoders[index] = decode7;
    }
  }
  tryToEncode(object, context) {
    for (let i3 = 0; i3 < this.builtInEncoders.length; i3++) {
      const encodeExt = this.builtInEncoders[i3];
      if (encodeExt != null) {
        const data = encodeExt(object, context);
        if (data != null) {
          const type = -1 - i3;
          return new ExtData(type, data);
        }
      }
    }
    for (let i3 = 0; i3 < this.encoders.length; i3++) {
      const encodeExt = this.encoders[i3];
      if (encodeExt != null) {
        const data = encodeExt(object, context);
        if (data != null) {
          const type = i3;
          return new ExtData(type, data);
        }
      }
    }
    if (object instanceof ExtData) {
      return object;
    }
    return null;
  }
  decode(data, type, context) {
    const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decodeExt) {
      return decodeExt(data, type, context);
    } else {
      return new ExtData(type, data);
    }
  }
};
ExtensionCodec.defaultCodec = new ExtensionCodec();

// node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs
function isArrayBufferLike(buffer) {
  return buffer instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer;
}
function ensureUint8Array(buffer) {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer)) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else if (isArrayBufferLike(buffer)) {
    return new Uint8Array(buffer);
  } else {
    return Uint8Array.from(buffer);
  }
}

// node_modules/@msgpack/msgpack/dist.esm/Encoder.mjs
var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = class _Encoder {
  constructor(options) {
    this.entered = false;
    this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
    this.context = options?.context;
    this.useBigInt64 = options?.useBigInt64 ?? false;
    this.maxDepth = options?.maxDepth ?? DEFAULT_MAX_DEPTH;
    this.initialBufferSize = options?.initialBufferSize ?? DEFAULT_INITIAL_BUFFER_SIZE;
    this.sortKeys = options?.sortKeys ?? false;
    this.forceFloat32 = options?.forceFloat32 ?? false;
    this.ignoreUndefined = options?.ignoreUndefined ?? false;
    this.forceIntegerToFloat = options?.forceIntegerToFloat ?? false;
    this.pos = 0;
    this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
    this.bytes = new Uint8Array(this.view.buffer);
  }
  clone() {
    return new _Encoder({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      maxDepth: this.maxDepth,
      initialBufferSize: this.initialBufferSize,
      sortKeys: this.sortKeys,
      forceFloat32: this.forceFloat32,
      ignoreUndefined: this.ignoreUndefined,
      forceIntegerToFloat: this.forceIntegerToFloat
    });
  }
  reinitializeState() {
    this.pos = 0;
  }
  /**
   * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
   *
   * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
   */
  encodeSharedRef(object) {
    if (this.entered) {
      const instance = this.clone();
      return instance.encodeSharedRef(object);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.doEncode(object, 1);
      return this.bytes.subarray(0, this.pos);
    } finally {
      this.entered = false;
    }
  }
  /**
   * @returns Encodes the object and returns a copy of the encoder's internal buffer.
   */
  encode(object) {
    if (this.entered) {
      const instance = this.clone();
      return instance.encode(object);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.doEncode(object, 1);
      return this.bytes.slice(0, this.pos);
    } finally {
      this.entered = false;
    }
  }
  doEncode(object, depth) {
    if (depth > this.maxDepth) {
      throw new Error(`Too deep objects in depth ${depth}`);
    }
    if (object == null) {
      this.encodeNil();
    } else if (typeof object === "boolean") {
      this.encodeBoolean(object);
    } else if (typeof object === "number") {
      if (!this.forceIntegerToFloat) {
        this.encodeNumber(object);
      } else {
        this.encodeNumberAsFloat(object);
      }
    } else if (typeof object === "string") {
      this.encodeString(object);
    } else if (this.useBigInt64 && typeof object === "bigint") {
      this.encodeBigInt64(object);
    } else {
      this.encodeObject(object, depth);
    }
  }
  ensureBufferSizeToWrite(sizeToWrite) {
    const requiredSize = this.pos + sizeToWrite;
    if (this.view.byteLength < requiredSize) {
      this.resizeBuffer(requiredSize * 2);
    }
  }
  resizeBuffer(newSize) {
    const newBuffer = new ArrayBuffer(newSize);
    const newBytes = new Uint8Array(newBuffer);
    const newView = new DataView(newBuffer);
    newBytes.set(this.bytes);
    this.view = newView;
    this.bytes = newBytes;
  }
  encodeNil() {
    this.writeU8(192);
  }
  encodeBoolean(object) {
    if (object === false) {
      this.writeU8(194);
    } else {
      this.writeU8(195);
    }
  }
  encodeNumber(object) {
    if (!this.forceIntegerToFloat && Number.isSafeInteger(object)) {
      if (object >= 0) {
        if (object < 128) {
          this.writeU8(object);
        } else if (object < 256) {
          this.writeU8(204);
          this.writeU8(object);
        } else if (object < 65536) {
          this.writeU8(205);
          this.writeU16(object);
        } else if (object < 4294967296) {
          this.writeU8(206);
          this.writeU32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(207);
          this.writeU64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      } else {
        if (object >= -32) {
          this.writeU8(224 | object + 32);
        } else if (object >= -128) {
          this.writeU8(208);
          this.writeI8(object);
        } else if (object >= -32768) {
          this.writeU8(209);
          this.writeI16(object);
        } else if (object >= -2147483648) {
          this.writeU8(210);
          this.writeI32(object);
        } else if (!this.useBigInt64) {
          this.writeU8(211);
          this.writeI64(object);
        } else {
          this.encodeNumberAsFloat(object);
        }
      }
    } else {
      this.encodeNumberAsFloat(object);
    }
  }
  encodeNumberAsFloat(object) {
    if (this.forceFloat32) {
      this.writeU8(202);
      this.writeF32(object);
    } else {
      this.writeU8(203);
      this.writeF64(object);
    }
  }
  encodeBigInt64(object) {
    if (object >= BigInt(0)) {
      this.writeU8(207);
      this.writeBigUint64(object);
    } else {
      this.writeU8(211);
      this.writeBigInt64(object);
    }
  }
  writeStringHeader(byteLength) {
    if (byteLength < 32) {
      this.writeU8(160 + byteLength);
    } else if (byteLength < 256) {
      this.writeU8(217);
      this.writeU8(byteLength);
    } else if (byteLength < 65536) {
      this.writeU8(218);
      this.writeU16(byteLength);
    } else if (byteLength < 4294967296) {
      this.writeU8(219);
      this.writeU32(byteLength);
    } else {
      throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
    }
  }
  encodeString(object) {
    const maxHeaderSize = 1 + 4;
    const byteLength = utf8Count(object);
    this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
    this.writeStringHeader(byteLength);
    utf8Encode(object, this.bytes, this.pos);
    this.pos += byteLength;
  }
  encodeObject(object, depth) {
    const ext = this.extensionCodec.tryToEncode(object, this.context);
    if (ext != null) {
      this.encodeExtension(ext);
    } else if (Array.isArray(object)) {
      this.encodeArray(object, depth);
    } else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(object);
    } else if (typeof object === "object") {
      this.encodeMap(object, depth);
    } else {
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
    }
  }
  encodeBinary(object) {
    const size3 = object.byteLength;
    if (size3 < 256) {
      this.writeU8(196);
      this.writeU8(size3);
    } else if (size3 < 65536) {
      this.writeU8(197);
      this.writeU16(size3);
    } else if (size3 < 4294967296) {
      this.writeU8(198);
      this.writeU32(size3);
    } else {
      throw new Error(`Too large binary: ${size3}`);
    }
    const bytes = ensureUint8Array(object);
    this.writeU8a(bytes);
  }
  encodeArray(object, depth) {
    const size3 = object.length;
    if (size3 < 16) {
      this.writeU8(144 + size3);
    } else if (size3 < 65536) {
      this.writeU8(220);
      this.writeU16(size3);
    } else if (size3 < 4294967296) {
      this.writeU8(221);
      this.writeU32(size3);
    } else {
      throw new Error(`Too large array: ${size3}`);
    }
    for (const item of object) {
      this.doEncode(item, depth + 1);
    }
  }
  countWithoutUndefined(object, keys2) {
    let count = 0;
    for (const key of keys2) {
      if (object[key] !== void 0) {
        count++;
      }
    }
    return count;
  }
  encodeMap(object, depth) {
    const keys2 = Object.keys(object);
    if (this.sortKeys) {
      keys2.sort();
    }
    const size3 = this.ignoreUndefined ? this.countWithoutUndefined(object, keys2) : keys2.length;
    if (size3 < 16) {
      this.writeU8(128 + size3);
    } else if (size3 < 65536) {
      this.writeU8(222);
      this.writeU16(size3);
    } else if (size3 < 4294967296) {
      this.writeU8(223);
      this.writeU32(size3);
    } else {
      throw new Error(`Too large map object: ${size3}`);
    }
    for (const key of keys2) {
      const value = object[key];
      if (!(this.ignoreUndefined && value === void 0)) {
        this.encodeString(key);
        this.doEncode(value, depth + 1);
      }
    }
  }
  encodeExtension(ext) {
    if (typeof ext.data === "function") {
      const data = ext.data(this.pos + 6);
      const size4 = data.length;
      if (size4 >= 4294967296) {
        throw new Error(`Too large extension object: ${size4}`);
      }
      this.writeU8(201);
      this.writeU32(size4);
      this.writeI8(ext.type);
      this.writeU8a(data);
      return;
    }
    const size3 = ext.data.length;
    if (size3 === 1) {
      this.writeU8(212);
    } else if (size3 === 2) {
      this.writeU8(213);
    } else if (size3 === 4) {
      this.writeU8(214);
    } else if (size3 === 8) {
      this.writeU8(215);
    } else if (size3 === 16) {
      this.writeU8(216);
    } else if (size3 < 256) {
      this.writeU8(199);
      this.writeU8(size3);
    } else if (size3 < 65536) {
      this.writeU8(200);
      this.writeU16(size3);
    } else if (size3 < 4294967296) {
      this.writeU8(201);
      this.writeU32(size3);
    } else {
      throw new Error(`Too large extension object: ${size3}`);
    }
    this.writeI8(ext.type);
    this.writeU8a(ext.data);
  }
  writeU8(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setUint8(this.pos, value);
    this.pos++;
  }
  writeU8a(values) {
    const size3 = values.length;
    this.ensureBufferSizeToWrite(size3);
    this.bytes.set(values, this.pos);
    this.pos += size3;
  }
  writeI8(value) {
    this.ensureBufferSizeToWrite(1);
    this.view.setInt8(this.pos, value);
    this.pos++;
  }
  writeU16(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setUint16(this.pos, value);
    this.pos += 2;
  }
  writeI16(value) {
    this.ensureBufferSizeToWrite(2);
    this.view.setInt16(this.pos, value);
    this.pos += 2;
  }
  writeU32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setUint32(this.pos, value);
    this.pos += 4;
  }
  writeI32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setInt32(this.pos, value);
    this.pos += 4;
  }
  writeF32(value) {
    this.ensureBufferSizeToWrite(4);
    this.view.setFloat32(this.pos, value);
    this.pos += 4;
  }
  writeF64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setFloat64(this.pos, value);
    this.pos += 8;
  }
  writeU64(value) {
    this.ensureBufferSizeToWrite(8);
    setUint64(this.view, this.pos, value);
    this.pos += 8;
  }
  writeI64(value) {
    this.ensureBufferSizeToWrite(8);
    setInt64(this.view, this.pos, value);
    this.pos += 8;
  }
  writeBigUint64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigUint64(this.pos, value);
    this.pos += 8;
  }
  writeBigInt64(value) {
    this.ensureBufferSizeToWrite(8);
    this.view.setBigInt64(this.pos, value);
    this.pos += 8;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/encode.mjs
function encode(value, options) {
  const encoder2 = new Encoder(options);
  return encoder2.encodeSharedRef(value);
}

// node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs
function prettyByte(byte) {
  return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
}

// node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = class {
  constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
    this.hit = 0;
    this.miss = 0;
    this.maxKeyLength = maxKeyLength;
    this.maxLengthPerKey = maxLengthPerKey;
    this.caches = [];
    for (let i3 = 0; i3 < this.maxKeyLength; i3++) {
      this.caches.push([]);
    }
  }
  canBeCached(byteLength) {
    return byteLength > 0 && byteLength <= this.maxKeyLength;
  }
  find(bytes, inputOffset, byteLength) {
    const records = this.caches[byteLength - 1];
    FIND_CHUNK: for (const record of records) {
      const recordBytes = record.bytes;
      for (let j6 = 0; j6 < byteLength; j6++) {
        if (recordBytes[j6] !== bytes[inputOffset + j6]) {
          continue FIND_CHUNK;
        }
      }
      return record.str;
    }
    return null;
  }
  store(bytes, value) {
    const records = this.caches[bytes.length - 1];
    const record = { bytes, str: value };
    if (records.length >= this.maxLengthPerKey) {
      records[Math.random() * records.length | 0] = record;
    } else {
      records.push(record);
    }
  }
  decode(bytes, inputOffset, byteLength) {
    const cachedValue = this.find(bytes, inputOffset, byteLength);
    if (cachedValue != null) {
      this.hit++;
      return cachedValue;
    }
    this.miss++;
    const str = utf8DecodeJs(bytes, inputOffset, byteLength);
    const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
    this.store(slicedCopyOfBytes, str);
    return str;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs
var STATE_ARRAY = "array";
var STATE_MAP_KEY = "map_key";
var STATE_MAP_VALUE = "map_value";
var mapKeyConverter = (key) => {
  if (typeof key === "string" || typeof key === "number") {
    return key;
  }
  throw new DecodeError("The type of key must be string or number but " + typeof key);
};
var StackPool = class {
  constructor() {
    this.stack = [];
    this.stackHeadPosition = -1;
  }
  get length() {
    return this.stackHeadPosition + 1;
  }
  top() {
    return this.stack[this.stackHeadPosition];
  }
  pushArrayState(size3) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_ARRAY;
    state.position = 0;
    state.size = size3;
    state.array = new Array(size3);
  }
  pushMapState(size3) {
    const state = this.getUninitializedStateFromPool();
    state.type = STATE_MAP_KEY;
    state.readCount = 0;
    state.size = size3;
    state.map = {};
  }
  getUninitializedStateFromPool() {
    this.stackHeadPosition++;
    if (this.stackHeadPosition === this.stack.length) {
      const partialState = {
        type: void 0,
        size: 0,
        array: void 0,
        position: 0,
        readCount: 0,
        map: void 0,
        key: null
      };
      this.stack.push(partialState);
    }
    return this.stack[this.stackHeadPosition];
  }
  release(state) {
    const topStackState = this.stack[this.stackHeadPosition];
    if (topStackState !== state) {
      throw new Error("Invalid stack state. Released state is not on top of the stack.");
    }
    if (state.type === STATE_ARRAY) {
      const partialState = state;
      partialState.size = 0;
      partialState.array = void 0;
      partialState.position = 0;
      partialState.type = void 0;
    }
    if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
      const partialState = state;
      partialState.size = 0;
      partialState.map = void 0;
      partialState.readCount = 0;
      partialState.type = void 0;
    }
    this.stackHeadPosition--;
  }
  reset() {
    this.stack.length = 0;
    this.stackHeadPosition = -1;
  }
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
  EMPTY_VIEW.getInt8(0);
} catch (e2) {
  if (!(e2 instanceof RangeError)) {
    throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
  }
}
var MORE_DATA = new RangeError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder = class _Decoder {
  constructor(options) {
    this.totalPos = 0;
    this.pos = 0;
    this.view = EMPTY_VIEW;
    this.bytes = EMPTY_BYTES;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack = new StackPool();
    this.entered = false;
    this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
    this.context = options?.context;
    this.useBigInt64 = options?.useBigInt64 ?? false;
    this.rawStrings = options?.rawStrings ?? false;
    this.maxStrLength = options?.maxStrLength ?? UINT32_MAX;
    this.maxBinLength = options?.maxBinLength ?? UINT32_MAX;
    this.maxArrayLength = options?.maxArrayLength ?? UINT32_MAX;
    this.maxMapLength = options?.maxMapLength ?? UINT32_MAX;
    this.maxExtLength = options?.maxExtLength ?? UINT32_MAX;
    this.keyDecoder = options?.keyDecoder !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
    this.mapKeyConverter = options?.mapKeyConverter ?? mapKeyConverter;
  }
  clone() {
    return new _Decoder({
      extensionCodec: this.extensionCodec,
      context: this.context,
      useBigInt64: this.useBigInt64,
      rawStrings: this.rawStrings,
      maxStrLength: this.maxStrLength,
      maxBinLength: this.maxBinLength,
      maxArrayLength: this.maxArrayLength,
      maxMapLength: this.maxMapLength,
      maxExtLength: this.maxExtLength,
      keyDecoder: this.keyDecoder
    });
  }
  reinitializeState() {
    this.totalPos = 0;
    this.headByte = HEAD_BYTE_REQUIRED;
    this.stack.reset();
  }
  setBuffer(buffer) {
    const bytes = ensureUint8Array(buffer);
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.pos = 0;
  }
  appendBuffer(buffer) {
    if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
      this.setBuffer(buffer);
    } else {
      const remainingData = this.bytes.subarray(this.pos);
      const newData = ensureUint8Array(buffer);
      const newBuffer = new Uint8Array(remainingData.length + newData.length);
      newBuffer.set(remainingData);
      newBuffer.set(newData, remainingData.length);
      this.setBuffer(newBuffer);
    }
  }
  hasRemaining(size3) {
    return this.view.byteLength - this.pos >= size3;
  }
  createExtraByteError(posToShow) {
    const { view, pos } = this;
    return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
  }
  /**
   * @throws {@link DecodeError}
   * @throws {@link RangeError}
   */
  decode(buffer) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decode(buffer);
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      const object = this.doDecodeSync();
      if (this.hasRemaining(1)) {
        throw this.createExtraByteError(this.pos);
      }
      return object;
    } finally {
      this.entered = false;
    }
  }
  *decodeMulti(buffer) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMulti(buffer);
      return;
    }
    try {
      this.entered = true;
      this.reinitializeState();
      this.setBuffer(buffer);
      while (this.hasRemaining(1)) {
        yield this.doDecodeSync();
      }
    } finally {
      this.entered = false;
    }
  }
  async decodeAsync(stream) {
    if (this.entered) {
      const instance = this.clone();
      return instance.decodeAsync(stream);
    }
    try {
      this.entered = true;
      let decoded = false;
      let object;
      for await (const buffer of stream) {
        if (decoded) {
          this.entered = false;
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        try {
          object = this.doDecodeSync();
          decoded = true;
        } catch (e2) {
          if (!(e2 instanceof RangeError)) {
            throw e2;
          }
        }
        this.totalPos += this.pos;
      }
      if (decoded) {
        if (this.hasRemaining(1)) {
          throw this.createExtraByteError(this.totalPos);
        }
        return object;
      }
      const { headByte, pos, totalPos } = this;
      throw new RangeError(`Insufficient data in parsing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
    } finally {
      this.entered = false;
    }
  }
  decodeArrayStream(stream) {
    return this.decodeMultiAsync(stream, true);
  }
  decodeStream(stream) {
    return this.decodeMultiAsync(stream, false);
  }
  async *decodeMultiAsync(stream, isArray) {
    if (this.entered) {
      const instance = this.clone();
      yield* instance.decodeMultiAsync(stream, isArray);
      return;
    }
    try {
      this.entered = true;
      let isArrayHeaderRequired = isArray;
      let arrayItemsLeft = -1;
      for await (const buffer of stream) {
        if (isArray && arrayItemsLeft === 0) {
          throw this.createExtraByteError(this.totalPos);
        }
        this.appendBuffer(buffer);
        if (isArrayHeaderRequired) {
          arrayItemsLeft = this.readArraySize();
          isArrayHeaderRequired = false;
          this.complete();
        }
        try {
          while (true) {
            yield this.doDecodeSync();
            if (--arrayItemsLeft === 0) {
              break;
            }
          }
        } catch (e2) {
          if (!(e2 instanceof RangeError)) {
            throw e2;
          }
        }
        this.totalPos += this.pos;
      }
    } finally {
      this.entered = false;
    }
  }
  doDecodeSync() {
    DECODE: while (true) {
      const headByte = this.readHeadByte();
      let object;
      if (headByte >= 224) {
        object = headByte - 256;
      } else if (headByte < 192) {
        if (headByte < 128) {
          object = headByte;
        } else if (headByte < 144) {
          const size3 = headByte - 128;
          if (size3 !== 0) {
            this.pushMapState(size3);
            this.complete();
            continue DECODE;
          } else {
            object = {};
          }
        } else if (headByte < 160) {
          const size3 = headByte - 144;
          if (size3 !== 0) {
            this.pushArrayState(size3);
            this.complete();
            continue DECODE;
          } else {
            object = [];
          }
        } else {
          const byteLength = headByte - 160;
          object = this.decodeString(byteLength, 0);
        }
      } else if (headByte === 192) {
        object = null;
      } else if (headByte === 194) {
        object = false;
      } else if (headByte === 195) {
        object = true;
      } else if (headByte === 202) {
        object = this.readF32();
      } else if (headByte === 203) {
        object = this.readF64();
      } else if (headByte === 204) {
        object = this.readU8();
      } else if (headByte === 205) {
        object = this.readU16();
      } else if (headByte === 206) {
        object = this.readU32();
      } else if (headByte === 207) {
        if (this.useBigInt64) {
          object = this.readU64AsBigInt();
        } else {
          object = this.readU64();
        }
      } else if (headByte === 208) {
        object = this.readI8();
      } else if (headByte === 209) {
        object = this.readI16();
      } else if (headByte === 210) {
        object = this.readI32();
      } else if (headByte === 211) {
        if (this.useBigInt64) {
          object = this.readI64AsBigInt();
        } else {
          object = this.readI64();
        }
      } else if (headByte === 217) {
        const byteLength = this.lookU8();
        object = this.decodeString(byteLength, 1);
      } else if (headByte === 218) {
        const byteLength = this.lookU16();
        object = this.decodeString(byteLength, 2);
      } else if (headByte === 219) {
        const byteLength = this.lookU32();
        object = this.decodeString(byteLength, 4);
      } else if (headByte === 220) {
        const size3 = this.readU16();
        if (size3 !== 0) {
          this.pushArrayState(size3);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 221) {
        const size3 = this.readU32();
        if (size3 !== 0) {
          this.pushArrayState(size3);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 222) {
        const size3 = this.readU16();
        if (size3 !== 0) {
          this.pushMapState(size3);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 223) {
        const size3 = this.readU32();
        if (size3 !== 0) {
          this.pushMapState(size3);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 196) {
        const size3 = this.lookU8();
        object = this.decodeBinary(size3, 1);
      } else if (headByte === 197) {
        const size3 = this.lookU16();
        object = this.decodeBinary(size3, 2);
      } else if (headByte === 198) {
        const size3 = this.lookU32();
        object = this.decodeBinary(size3, 4);
      } else if (headByte === 212) {
        object = this.decodeExtension(1, 0);
      } else if (headByte === 213) {
        object = this.decodeExtension(2, 0);
      } else if (headByte === 214) {
        object = this.decodeExtension(4, 0);
      } else if (headByte === 215) {
        object = this.decodeExtension(8, 0);
      } else if (headByte === 216) {
        object = this.decodeExtension(16, 0);
      } else if (headByte === 199) {
        const size3 = this.lookU8();
        object = this.decodeExtension(size3, 1);
      } else if (headByte === 200) {
        const size3 = this.lookU16();
        object = this.decodeExtension(size3, 2);
      } else if (headByte === 201) {
        const size3 = this.lookU32();
        object = this.decodeExtension(size3, 4);
      } else {
        throw new DecodeError(`Unrecognized type byte: ${prettyByte(headByte)}`);
      }
      this.complete();
      const stack = this.stack;
      while (stack.length > 0) {
        const state = stack.top();
        if (state.type === STATE_ARRAY) {
          state.array[state.position] = object;
          state.position++;
          if (state.position === state.size) {
            object = state.array;
            stack.release(state);
          } else {
            continue DECODE;
          }
        } else if (state.type === STATE_MAP_KEY) {
          if (object === "__proto__") {
            throw new DecodeError("The key __proto__ is not allowed");
          }
          state.key = this.mapKeyConverter(object);
          state.type = STATE_MAP_VALUE;
          continue DECODE;
        } else {
          state.map[state.key] = object;
          state.readCount++;
          if (state.readCount === state.size) {
            object = state.map;
            stack.release(state);
          } else {
            state.key = null;
            state.type = STATE_MAP_KEY;
            continue DECODE;
          }
        }
      }
      return object;
    }
  }
  readHeadByte() {
    if (this.headByte === HEAD_BYTE_REQUIRED) {
      this.headByte = this.readU8();
    }
    return this.headByte;
  }
  complete() {
    this.headByte = HEAD_BYTE_REQUIRED;
  }
  readArraySize() {
    const headByte = this.readHeadByte();
    switch (headByte) {
      case 220:
        return this.readU16();
      case 221:
        return this.readU32();
      default: {
        if (headByte < 160) {
          return headByte - 144;
        } else {
          throw new DecodeError(`Unrecognized array type byte: ${prettyByte(headByte)}`);
        }
      }
    }
  }
  pushMapState(size3) {
    if (size3 > this.maxMapLength) {
      throw new DecodeError(`Max length exceeded: map length (${size3}) > maxMapLengthLength (${this.maxMapLength})`);
    }
    this.stack.pushMapState(size3);
  }
  pushArrayState(size3) {
    if (size3 > this.maxArrayLength) {
      throw new DecodeError(`Max length exceeded: array length (${size3}) > maxArrayLength (${this.maxArrayLength})`);
    }
    this.stack.pushArrayState(size3);
  }
  decodeString(byteLength, headerOffset) {
    if (!this.rawStrings || this.stateIsMapKey()) {
      return this.decodeUtf8String(byteLength, headerOffset);
    }
    return this.decodeBinary(byteLength, headerOffset);
  }
  /**
   * @throws {@link RangeError}
   */
  decodeUtf8String(byteLength, headerOffset) {
    if (byteLength > this.maxStrLength) {
      throw new DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
    }
    if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
      throw MORE_DATA;
    }
    const offset = this.pos + headerOffset;
    let object;
    if (this.stateIsMapKey() && this.keyDecoder?.canBeCached(byteLength)) {
      object = this.keyDecoder.decode(this.bytes, offset, byteLength);
    } else {
      object = utf8Decode(this.bytes, offset, byteLength);
    }
    this.pos += headerOffset + byteLength;
    return object;
  }
  stateIsMapKey() {
    if (this.stack.length > 0) {
      const state = this.stack.top();
      return state.type === STATE_MAP_KEY;
    }
    return false;
  }
  /**
   * @throws {@link RangeError}
   */
  decodeBinary(byteLength, headOffset) {
    if (byteLength > this.maxBinLength) {
      throw new DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
    }
    if (!this.hasRemaining(byteLength + headOffset)) {
      throw MORE_DATA;
    }
    const offset = this.pos + headOffset;
    const object = this.bytes.subarray(offset, offset + byteLength);
    this.pos += headOffset + byteLength;
    return object;
  }
  decodeExtension(size3, headOffset) {
    if (size3 > this.maxExtLength) {
      throw new DecodeError(`Max length exceeded: ext length (${size3}) > maxExtLength (${this.maxExtLength})`);
    }
    const extType = this.view.getInt8(this.pos + headOffset);
    const data = this.decodeBinary(
      size3,
      headOffset + 1
      /* extType */
    );
    return this.extensionCodec.decode(data, extType, this.context);
  }
  lookU8() {
    return this.view.getUint8(this.pos);
  }
  lookU16() {
    return this.view.getUint16(this.pos);
  }
  lookU32() {
    return this.view.getUint32(this.pos);
  }
  readU8() {
    const value = this.view.getUint8(this.pos);
    this.pos++;
    return value;
  }
  readI8() {
    const value = this.view.getInt8(this.pos);
    this.pos++;
    return value;
  }
  readU16() {
    const value = this.view.getUint16(this.pos);
    this.pos += 2;
    return value;
  }
  readI16() {
    const value = this.view.getInt16(this.pos);
    this.pos += 2;
    return value;
  }
  readU32() {
    const value = this.view.getUint32(this.pos);
    this.pos += 4;
    return value;
  }
  readI32() {
    const value = this.view.getInt32(this.pos);
    this.pos += 4;
    return value;
  }
  readU64() {
    const value = getUint64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readI64() {
    const value = getInt64(this.view, this.pos);
    this.pos += 8;
    return value;
  }
  readU64AsBigInt() {
    const value = this.view.getBigUint64(this.pos);
    this.pos += 8;
    return value;
  }
  readI64AsBigInt() {
    const value = this.view.getBigInt64(this.pos);
    this.pos += 8;
    return value;
  }
  readF32() {
    const value = this.view.getFloat32(this.pos);
    this.pos += 4;
    return value;
  }
  readF64() {
    const value = this.view.getFloat64(this.pos);
    this.pos += 8;
    return value;
  }
};

// node_modules/@msgpack/msgpack/dist.esm/decode.mjs
function decode(buffer, options) {
  const decoder = new Decoder(options);
  return decoder.decode(buffer);
}

// node_modules/uint8arrays/esm/src/util/as-uint8array.js
function asUint8Array(buf) {
  if (globalThis.Buffer != null) {
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  return buf;
}

// node_modules/uint8arrays/esm/src/alloc.js
function allocUnsafe(size3 = 0) {
  if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) {
    return asUint8Array(globalThis.Buffer.allocUnsafe(size3));
  }
  return new Uint8Array(size3);
}

// node_modules/uint8arrays/esm/src/concat.js
function concat2(arrays, length2) {
  if (!length2) {
    length2 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe(length2);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output);
}

// node_modules/multiformats/esm/src/bases/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});

// node_modules/multiformats/esm/vendor/base-x.js
function base2(ALPHABET2, name2) {
  if (ALPHABET2.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j6 = 0; j6 < BASE_MAP.length; j6++) {
    BASE_MAP[j6] = 255;
  }
  for (var i3 = 0; i3 < ALPHABET2.length; i3++) {
    var x5 = ALPHABET2.charAt(i3);
    var xc2 = x5.charCodeAt(0);
    if (BASE_MAP[xc2] !== 255) {
      throw new TypeError(x5 + " is ambiguous");
    }
    BASE_MAP[xc2] = i3;
  }
  var BASE = ALPHABET2.length;
  var LEADER = ALPHABET2.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode6(source) {
    if (source instanceof Uint8Array) ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length2 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size3 = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size3);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i4 = 0;
      for (var it1 = size3 - 1; (carry !== 0 || i4 < length2) && it1 !== -1; it1--, i4++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i4;
      pbegin++;
    }
    var it22 = size3 - length2;
    while (it22 !== size3 && b58[it22] === 0) {
      it22++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it22 < size3; ++it22) {
      str += ALPHABET2.charAt(b58[it22]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size3 = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size3);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i4 = 0;
      for (var it3 = size3 - 1; (carry !== 0 || i4 < length2) && it3 !== -1; it3--, i4++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i4;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size3 - length2;
    while (it4 !== size3 && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size3 - it4));
    var j7 = zeroes;
    while (it4 !== size3) {
      vch[j7++] = b256[it4++];
    }
    return vch;
  }
  function decode7(string2) {
    var buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name2} character`);
  }
  return {
    encode: encode6,
    decodeUnsafe,
    decode: decode7
  };
}
var src = base2;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/multiformats/esm/src/bytes.js
var empty = new Uint8Array(0);
var equals = (aa2, bb) => {
  if (aa2 === bb)
    return true;
  if (aa2.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii3 = 0; ii3 < aa2.byteLength; ii3++) {
    if (aa2[ii3] !== bb[ii3]) {
      return false;
    }
  }
  return true;
};
var coerce = (o4) => {
  if (o4 instanceof Uint8Array && o4.constructor.name === "Uint8Array")
    return o4;
  if (o4 instanceof ArrayBuffer)
    return new Uint8Array(o4);
  if (ArrayBuffer.isView(o4)) {
    return new Uint8Array(o4.buffer, o4.byteOffset, o4.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
};
var fromString2 = (str) => new TextEncoder().encode(str);
var toString = (b5) => new TextDecoder().decode(b5);

// node_modules/multiformats/esm/src/bases/base.js
var Encoder2 = class {
  constructor(name2, prefix, baseEncode) {
    this.name = name2;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder2 = class {
  constructor(name2, prefix, baseDecode) {
    this.name = name2;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }
  decode(text) {
    if (typeof text === "string") {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  or(decoder) {
    return or2(this, decoder);
  }
};
var ComposedDecoder = class {
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or2(this, decoder);
  }
  decode(input) {
    const prefix = input[0];
    const decoder = this.decoders[prefix];
    if (decoder) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
var or2 = (left, right) => new ComposedDecoder({
  ...left.decoders || { [left.prefix]: left },
  ...right.decoders || { [right.prefix]: right }
});
var Codec = class {
  constructor(name2, prefix, baseEncode, baseDecode) {
    this.name = name2;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder2(name2, prefix, baseEncode);
    this.decoder = new Decoder2(name2, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
var from6 = ({ name: name2, prefix, encode: encode6, decode: decode7 }) => new Codec(name2, prefix, encode6, decode7);
var baseX = ({ prefix, name: name2, alphabet: alphabet3 }) => {
  const { encode: encode6, decode: decode7 } = base_x_default(alphabet3, name2);
  return from6({
    prefix,
    name: name2,
    encode: encode6,
    decode: (text) => coerce(decode7(text))
  });
};
var decode2 = (string2, alphabet3, bitsPerChar, name2) => {
  const codes = {};
  for (let i3 = 0; i3 < alphabet3.length; ++i3) {
    codes[alphabet3[i3]] = i3;
  }
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i3 = 0; i3 < end; ++i3) {
    const value = codes[string2[i3]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name2} character`);
    }
    buffer = buffer << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= bitsPerChar || 255 & buffer << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
};
var encode2 = (data, alphabet3, bitsPerChar) => {
  const pad3 = alphabet3[alphabet3.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i3 = 0; i3 < data.length; ++i3) {
    buffer = buffer << 8 | data[i3];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet3[mask & buffer >> bits];
    }
  }
  if (bits) {
    out += alphabet3[mask & buffer << bitsPerChar - bits];
  }
  if (pad3) {
    while (out.length * bitsPerChar & 7) {
      out += "=";
    }
  }
  return out;
};
var rfc4648 = ({ name: name2, prefix, bitsPerChar, alphabet: alphabet3 }) => {
  return from6({
    prefix,
    name: name2,
    encode(input) {
      return encode2(input, alphabet3, bitsPerChar);
    },
    decode(input) {
      return decode2(input, alphabet3, bitsPerChar, name2);
    }
  });
};

// node_modules/multiformats/esm/src/bases/identity.js
var identity = from6({
  prefix: "\0",
  name: "identity",
  encode: (buf) => toString(buf),
  decode: (str) => fromString2(str)
});

// node_modules/multiformats/esm/src/bases/base2.js
var base2_exports = {};
__export(base2_exports, {
  base2: () => base22
});
var base22 = rfc4648({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/multiformats/esm/src/bases/base8.js
var base8_exports = {};
__export(base8_exports, {
  base8: () => base8
});
var base8 = rfc4648({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/multiformats/esm/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
});
var base10 = baseX({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/multiformats/esm/src/bases/base16.js
var base16_exports = {};
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper
});
var base16 = rfc4648({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper = rfc4648({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/multiformats/esm/src/bases/base32.js
var base32_exports = {};
__export(base32_exports, {
  base32: () => base322,
  base32hex: () => base32hex,
  base32hexpad: () => base32hexpad,
  base32hexpadupper: () => base32hexpadupper,
  base32hexupper: () => base32hexupper,
  base32pad: () => base32pad,
  base32padupper: () => base32padupper,
  base32upper: () => base32upper,
  base32z: () => base32z
});
var base322 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/multiformats/esm/src/bases/base36.js
var base36_exports = {};
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper
});
var base36 = baseX({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/multiformats/esm/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr
});
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/multiformats/esm/src/bases/base64.js
var base64_exports = {};
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad
});
var base64 = rfc4648({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc4648({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc4648({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc4648({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/multiformats/esm/src/bases/base256emoji.js
var base256emoji_exports = {};
__export(base256emoji_exports, {
  base256emoji: () => base256emoji
});
var alphabet2 = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var alphabetBytesToChars = alphabet2.reduce((p3, c5, i3) => {
  p3[i3] = c5;
  return p3;
}, []);
var alphabetCharsToBytes = alphabet2.reduce((p3, c5, i3) => {
  p3[c5.codePointAt(0)] = i3;
  return p3;
}, []);
function encode3(data) {
  return data.reduce((p3, c5) => {
    p3 += alphabetBytesToChars[c5];
    return p3;
  }, "");
}
function decode3(str) {
  const byts = [];
  for (const char of str) {
    const byt = alphabetCharsToBytes[char.codePointAt(0)];
    if (byt === void 0) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
var base256emoji = from6({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode3,
  decode: decode3
});

// node_modules/multiformats/esm/src/hashes/sha2-browser.js
var sha2_browser_exports = {};
__export(sha2_browser_exports, {
  sha256: () => sha2562,
  sha512: () => sha512
});

// node_modules/multiformats/esm/vendor/varint.js
var encode_1 = encode4;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode4(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode4.bytes = offset - oldOffset + 1;
  return out;
}
var decode4 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b5, l6 = buf.length;
  do {
    if (counter >= l6) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b5 = buf[counter++];
    res += shift < 28 ? (b5 & REST$1) << shift : (b5 & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b5 >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N22 = Math.pow(2, 14);
var N32 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N22 ? 2 : value < N32 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode: decode4,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/multiformats/esm/src/varint.js
var decode5 = (data, offset = 0) => {
  const code2 = varint_default.decode(data, offset);
  return [
    code2,
    varint_default.decode.bytes
  ];
};
var encodeTo = (int, target, offset = 0) => {
  varint_default.encode(int, target, offset);
  return target;
};
var encodingLength = (int) => {
  return varint_default.encodingLength(int);
};

// node_modules/multiformats/esm/src/hashes/digest.js
var create = (code2, digest2) => {
  const size3 = digest2.byteLength;
  const sizeOffset = encodingLength(code2);
  const digestOffset = sizeOffset + encodingLength(size3);
  const bytes = new Uint8Array(digestOffset + size3);
  encodeTo(code2, bytes, 0);
  encodeTo(size3, bytes, sizeOffset);
  bytes.set(digest2, digestOffset);
  return new Digest(code2, size3, digest2, bytes);
};
var decode6 = (multihash) => {
  const bytes = coerce(multihash);
  const [code2, sizeOffset] = decode5(bytes);
  const [size3, digestOffset] = decode5(bytes.subarray(sizeOffset));
  const digest2 = bytes.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size3) {
    throw new Error("Incorrect length");
  }
  return new Digest(code2, size3, digest2, bytes);
};
var equals2 = (a3, b5) => {
  if (a3 === b5) {
    return true;
  } else {
    return a3.code === b5.code && a3.size === b5.size && equals(a3.bytes, b5.bytes);
  }
};
var Digest = class {
  constructor(code2, size3, digest2, bytes) {
    this.code = code2;
    this.size = size3;
    this.digest = digest2;
    this.bytes = bytes;
  }
};

// node_modules/multiformats/esm/src/hashes/hasher.js
var from7 = ({ name: name2, code: code2, encode: encode6 }) => new Hasher(name2, code2, encode6);
var Hasher = class {
  constructor(name2, code2, encode6) {
    this.name = name2;
    this.code = code2;
    this.encode = encode6;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create(this.code, result) : result.then((digest2) => create(this.code, digest2));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/multiformats/esm/src/hashes/sha2-browser.js
var sha = (name2) => async (data) => new Uint8Array(await crypto.subtle.digest(name2, data));
var sha2562 = from7({
  name: "sha2-256",
  code: 18,
  encode: sha("SHA-256")
});
var sha512 = from7({
  name: "sha2-512",
  code: 19,
  encode: sha("SHA-512")
});

// node_modules/multiformats/esm/src/hashes/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});
var code = 0;
var name = "identity";
var encode5 = coerce;
var digest = (input) => create(code, encode5(input));
var identity2 = {
  code,
  name,
  encode: encode5,
  digest
};

// node_modules/multiformats/esm/src/codecs/json.js
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();

// node_modules/multiformats/esm/src/cid.js
var CID = class _CID {
  constructor(version3, code2, multihash, bytes) {
    this.code = code2;
    this.version = version3;
    this.multihash = multihash;
    this.bytes = bytes;
    this.byteOffset = bytes.byteOffset;
    this.byteLength = bytes.byteLength;
    this.asCID = this;
    this._baseCache = /* @__PURE__ */ new Map();
    Object.defineProperties(this, {
      byteOffset: hidden,
      byteLength: hidden,
      code: readonly,
      version: readonly,
      multihash: readonly,
      bytes: readonly,
      _baseCache: hidden,
      asCID: hidden
    });
  }
  toV0() {
    switch (this.version) {
      case 0: {
        return this;
      }
      default: {
        const { code: code2, multihash } = this;
        if (code2 !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return _CID.createV0(multihash);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code2, digest: digest2 } = this.multihash;
        const multihash = create(code2, digest2);
        return _CID.createV1(this.code, multihash);
      }
      case 1: {
        return this;
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
      }
    }
  }
  equals(other) {
    return other && this.code === other.code && this.version === other.version && equals2(this.multihash, other.multihash);
  }
  toString(base3) {
    const { bytes, version: version3, _baseCache } = this;
    switch (version3) {
      case 0:
        return toStringV0(bytes, _baseCache, base3 || base58btc.encoder);
      default:
        return toStringV1(bytes, _baseCache, base3 || base322.encoder);
    }
  }
  toJSON() {
    return {
      code: this.code,
      version: this.version,
      hash: this.multihash.bytes
    };
  }
  get [Symbol.toStringTag]() {
    return "CID";
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return "CID(" + this.toString() + ")";
  }
  static isCID(value) {
    deprecate(/^0\.0/, IS_CID_DEPRECATION);
    return !!(value && (value[cidSymbol] || value.asCID === value));
  }
  get toBaseEncodedString() {
    throw new Error("Deprecated, use .toString()");
  }
  get codec() {
    throw new Error('"codec" property is deprecated, use integer "code" property instead');
  }
  get buffer() {
    throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead");
  }
  get multibaseName() {
    throw new Error('"multibaseName" property is deprecated');
  }
  get prefix() {
    throw new Error('"prefix" property is deprecated');
  }
  static asCID(value) {
    if (value instanceof _CID) {
      return value;
    } else if (value != null && value.asCID === value) {
      const { version: version3, code: code2, multihash, bytes } = value;
      return new _CID(version3, code2, multihash, bytes || encodeCID(version3, code2, multihash.bytes));
    } else if (value != null && value[cidSymbol] === true) {
      const { version: version3, multihash, code: code2 } = value;
      const digest2 = decode6(multihash);
      return _CID.create(version3, code2, digest2);
    } else {
      return null;
    }
  }
  static create(version3, code2, digest2) {
    if (typeof code2 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    switch (version3) {
      case 0: {
        if (code2 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version3, code2, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version3, code2, digest2.bytes);
        return new _CID(version3, code2, digest2, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  static createV0(digest2) {
    return _CID.create(0, DAG_PB_CODE, digest2);
  }
  static createV1(code2, digest2) {
    return _CID.create(1, code2, digest2);
  }
  static decode(bytes) {
    const [cid, remainder] = _CID.decodeFirst(bytes);
    if (remainder.length) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  static decodeFirst(bytes) {
    const specs = _CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest2) : _CID.createV1(specs.codec, digest2);
    return [
      cid,
      bytes.subarray(specs.size)
    ];
  }
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i3, length2] = decode5(initialBytes.subarray(offset));
      offset += length2;
      return i3;
    };
    let version3 = next();
    let codec = DAG_PB_CODE;
    if (version3 === 18) {
      version3 = 0;
      offset = 0;
    } else if (version3 === 1) {
      codec = next();
    }
    if (version3 !== 0 && version3 !== 1) {
      throw new RangeError(`Invalid CID version ${version3}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size3 = offset + digestSize;
    const multihashSize = size3 - prefixSize;
    return {
      version: version3,
      codec,
      multihashCode,
      digestSize,
      multihashSize,
      size: size3
    };
  }
  static parse(source, base3) {
    const [prefix, bytes] = parseCIDtoBytes(source, base3);
    const cid = _CID.decode(bytes);
    cid._baseCache.set(prefix, source);
    return cid;
  }
};
var parseCIDtoBytes = (source, base3) => {
  switch (source[0]) {
    case "Q": {
      const decoder = base3 || base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base3 || base58btc;
      return [
        base58btc.prefix,
        decoder.decode(source)
      ];
    }
    case base322.prefix: {
      const decoder = base3 || base322;
      return [
        base322.prefix,
        decoder.decode(source)
      ];
    }
    default: {
      if (base3 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [
        source[0],
        base3.decode(source)
      ];
    }
  }
};
var toStringV0 = (bytes, cache, base3) => {
  const { prefix } = base3;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes).slice(1);
    cache.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var toStringV1 = (bytes, cache, base3) => {
  const { prefix } = base3;
  const cid = cache.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes);
    cache.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
var encodeCID = (version3, code2, multihash) => {
  const codeOffset = encodingLength(version3);
  const hashOffset = codeOffset + encodingLength(code2);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version3, bytes, 0);
  encodeTo(code2, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
};
var cidSymbol = Symbol.for("@ipld/js-cid/CID");
var readonly = {
  writable: false,
  configurable: false,
  enumerable: true
};
var hidden = {
  writable: false,
  enumerable: false,
  configurable: false
};
var version2 = "0.0.0-dev";
var deprecate = (range, message) => {
  if (range.test(version2)) {
    console.warn(message);
  } else {
    throw new Error(message);
  }
};
var IS_CID_DEPRECATION = `CID.isCID(v) is deprecated and will be removed in the next major release.
Following code pattern:

if (CID.isCID(value)) {
  doSomethingWithCID(value)
}

Is replaced with:

const cid = CID.asCID(value)
if (cid) {
  // Make sure to use cid instead of value
  doSomethingWithCID(cid)
}
`;

// node_modules/multiformats/esm/src/basics.js
var bases = {
  ...identity_exports,
  ...base2_exports,
  ...base8_exports,
  ...base10_exports,
  ...base16_exports,
  ...base32_exports,
  ...base36_exports,
  ...base58_exports,
  ...base64_exports,
  ...base256emoji_exports
};
var hashes = {
  ...sha2_browser_exports,
  ...identity_exports2
};

// node_modules/uint8arrays/esm/src/util/bases.js
function createCodec(name2, prefix, encode6, decode7) {
  return {
    name: name2,
    prefix,
    encoder: {
      name: name2,
      prefix,
      encode: encode6
    },
    decoder: { decode: decode7 }
  };
}
var string = createCodec("utf8", "u", (buf) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf);
}, (str) => {
  const encoder2 = new TextEncoder();
  return encoder2.encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf) => {
  let string2 = "a";
  for (let i3 = 0; i3 < buf.length; i3++) {
    string2 += String.fromCharCode(buf[i3]);
  }
  return string2;
}, (str) => {
  str = str.substring(1);
  const buf = allocUnsafe(str.length);
  for (let i3 = 0; i3 < str.length; i3++) {
    buf[i3] = str.charCodeAt(i3);
  }
  return buf;
});
var BASES = {
  utf8: string,
  "utf-8": string,
  hex: bases.base16,
  latin1: ascii,
  ascii,
  binary: ascii,
  ...bases
};
var bases_default = BASES;

// node_modules/uint8arrays/esm/src/from-string.js
function fromString3(string2, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (!base3) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return asUint8Array(globalThis.Buffer.from(string2, "utf-8"));
  }
  return base3.decoder.decode(`${base3.prefix}${string2}`);
}

// node_modules/uint8arrays/esm/src/to-string.js
function toString2(array, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (!base3) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
  }
  return base3.encoder.encode(array).substring(1);
}

// node_modules/@walletconnect/relay-api/dist/index.es.js
var C2 = { waku: { publish: "waku_publish", batchPublish: "waku_batchPublish", subscribe: "waku_subscribe", batchSubscribe: "waku_batchSubscribe", subscription: "waku_subscription", unsubscribe: "waku_unsubscribe", batchUnsubscribe: "waku_batchUnsubscribe", batchFetchMessages: "waku_batchFetchMessages" }, irn: { publish: "irn_publish", batchPublish: "irn_batchPublish", subscribe: "irn_subscribe", batchSubscribe: "irn_batchSubscribe", subscription: "irn_subscription", unsubscribe: "irn_unsubscribe", batchUnsubscribe: "irn_batchUnsubscribe", batchFetchMessages: "irn_batchFetchMessages" }, iridium: { publish: "iridium_publish", batchPublish: "iridium_batchPublish", subscribe: "iridium_subscribe", batchSubscribe: "iridium_batchSubscribe", subscription: "iridium_subscription", unsubscribe: "iridium_unsubscribe", batchUnsubscribe: "iridium_batchUnsubscribe", batchFetchMessages: "iridium_batchFetchMessages" } };

// node_modules/@walletconnect/utils/dist/index.js
var import_blakejs = __toESM(require_blakejs(), 1);
var Ae3 = ":";
function Je2(t) {
  const [e2, n5] = t.split(Ae3);
  return { namespace: e2, reference: n5 };
}
function Se3(t, e2) {
  return t.includes(":") ? [t] : e2.chains || [];
}
var ri = Object.defineProperty;
var oi = Object.defineProperties;
var si = Object.getOwnPropertyDescriptors;
var ar2 = Object.getOwnPropertySymbols;
var ii = Object.prototype.hasOwnProperty;
var ci = Object.prototype.propertyIsEnumerable;
var en2 = (t, e2, n5) => e2 in t ? ri(t, e2, { enumerable: true, configurable: true, writable: true, value: n5 }) : t[e2] = n5;
var ur2 = (t, e2) => {
  for (var n5 in e2 || (e2 = {})) ii.call(e2, n5) && en2(t, n5, e2[n5]);
  if (ar2) for (var n5 of ar2(e2)) ci.call(e2, n5) && en2(t, n5, e2[n5]);
  return t;
};
var fi = (t, e2) => oi(t, si(e2));
var lr2 = (t, e2, n5) => en2(t, typeof e2 != "symbol" ? e2 + "" : e2, n5);
var dr2 = "ReactNative";
var et = { reactNative: "react-native", node: "node", browser: "browser", unknown: "unknown" };
var pr2 = "js";
function rn2() {
  return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function It2() {
  return !(0, import_window_getters.getDocument)() && !!(0, import_window_getters.getNavigator)() && navigator.product === dr2;
}
function li() {
  return It2() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "android";
}
function di() {
  return It2() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "ios";
}
function Wt2() {
  return !rn2() && !!(0, import_window_getters.getNavigator)() && !!(0, import_window_getters.getDocument)();
}
function Vt2() {
  return It2() ? et.reactNative : rn2() ? et.node : Wt2() ? et.browser : et.unknown;
}
function hi() {
  var t;
  try {
    return It2() && typeof global < "u" && typeof (global == null ? void 0 : global.Application) < "u" ? (t = global.Application) == null ? void 0 : t.applicationId : void 0;
  } catch {
    return;
  }
}
function gr2(t, e2) {
  const n5 = new URLSearchParams(t);
  return Object.entries(e2).sort(([r3], [o4]) => r3.localeCompare(o4)).forEach(([r3, o4]) => {
    o4 != null && n5.set(r3, String(o4));
  }), n5.toString();
}
function pi(t) {
  var e2, n5;
  const r3 = br2();
  try {
    return t != null && t.url && r3.url && new URL(t.url).host !== new URL(r3.url).host && (console.warn(`The configured WalletConnect 'metadata.url':${t.url} differs from the actual page url:${r3.url}. This is probably unintended and can lead to issues.`), t.url = r3.url), (e2 = t?.icons) != null && e2.length && t.icons.length > 0 && (t.icons = t.icons.filter((o4) => o4 !== "")), fi(ur2(ur2({}, r3), t), { url: t?.url || r3.url, name: t?.name || r3.name, description: t?.description || r3.description, icons: (n5 = t?.icons) != null && n5.length && t.icons.length > 0 ? t.icons : r3.icons });
  } catch (o4) {
    return console.warn("Error populating app metadata", o4), t || r3;
  }
}
function br2() {
  return (0, import_window_metadata.getWindowMetadata)() || { name: "", description: "", url: "", icons: [""] };
}
function yr2() {
  if (Vt2() === et.reactNative && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u") {
    const { OS: n5, Version: r3 } = global.Platform;
    return [n5, r3].join("-");
  }
  const t = detect();
  if (t === null) return "unknown";
  const e2 = t.os ? t.os.replace(" ", "").toLowerCase() : "unknown";
  return t.type === "browser" ? [e2, t.name, t.version].join("-") : [e2, t.version].join("-");
}
function mr2() {
  var t;
  const e2 = Vt2();
  return e2 === et.browser ? [e2, ((t = (0, import_window_getters.getLocation)()) == null ? void 0 : t.host) || "unknown"].join(":") : e2;
}
function wr2(t, e2, n5) {
  const r3 = yr2(), o4 = mr2();
  return [[t, e2].join("-"), [pr2, n5].join("-"), r3, o4].join("/");
}
function bi({ protocol: t, version: e2, relayUrl: n5, sdkVersion: r3, auth: o4, projectId: s2, useOnCloseEvent: i3, bundleId: c5, packageName: f4 }) {
  const u2 = n5.split("?"), a3 = wr2(t, e2, r3), l6 = { auth: o4, ua: a3, projectId: s2, useOnCloseEvent: i3 || void 0, packageName: f4 || void 0, bundleId: c5 || void 0 }, d4 = gr2(u2[1] || "", l6);
  return u2[0] + "?" + d4;
}
function At(t, e2) {
  return t.filter((n5) => e2.includes(n5)).length === t.length;
}
function vi(t) {
  return Object.fromEntries(t.entries());
}
function xi(t) {
  return new Map(Object.entries(t));
}
function Ai(t = import_time3.FIVE_MINUTES, e2) {
  const n5 = (0, import_time3.toMiliseconds)(t || import_time3.FIVE_MINUTES);
  let r3, o4, s2, i3;
  return { resolve: (c5) => {
    s2 && r3 && (clearTimeout(s2), r3(c5), i3 = Promise.resolve(c5));
  }, reject: (c5) => {
    s2 && o4 && (clearTimeout(s2), o4(c5));
  }, done: () => new Promise((c5, f4) => {
    if (i3) return c5(i3);
    s2 = setTimeout(() => {
      const u2 = new Error(e2);
      i3 = Promise.reject(u2), f4(u2);
    }, n5), r3 = c5, o4 = f4;
  }) };
}
function Si(t, e2, n5) {
  return new Promise(async (r3, o4) => {
    const s2 = setTimeout(() => o4(new Error(n5)), e2);
    try {
      const i3 = await t;
      r3(i3);
    } catch (i3) {
      o4(i3);
    }
    clearTimeout(s2);
  });
}
function on2(t, e2) {
  if (typeof e2 == "string" && e2.startsWith(`${t}:`)) return e2;
  if (t.toLowerCase() === "topic") {
    if (typeof e2 != "string") throw new Error('Value must be "string" for expirer target type: topic');
    return `topic:${e2}`;
  } else if (t.toLowerCase() === "id") {
    if (typeof e2 != "number") throw new Error('Value must be "number" for expirer target type: id');
    return `id:${e2}`;
  }
  throw new Error(`Unknown expirer target type: ${t}`);
}
function Oi(t) {
  return on2("topic", t);
}
function Ni(t) {
  return on2("id", t);
}
function Ui(t) {
  const [e2, n5] = t.split(":"), r3 = { id: void 0, topic: void 0 };
  if (e2 === "topic" && typeof n5 == "string") r3.topic = n5;
  else if (e2 === "id" && Number.isInteger(Number(n5))) r3.id = Number(n5);
  else throw new Error(`Invalid target, expected id:number or topic:string, got ${e2}:${n5}`);
  return r3;
}
function _i(t, e2) {
  return (0, import_time3.fromMiliseconds)((e2 || Date.now()) + (0, import_time3.toMiliseconds)(t));
}
function Ri(t) {
  return Date.now() >= (0, import_time3.toMiliseconds)(t);
}
function $i(t, e2) {
  return `${t}${e2 ? `:${e2}` : ""}`;
}
function ut2(t = [], e2 = []) {
  return [.../* @__PURE__ */ new Set([...t, ...e2])];
}
async function Ti({ id: t, topic: e2, wcDeepLink: n5 }) {
  var r3;
  try {
    if (!n5) return;
    const o4 = typeof n5 == "string" ? JSON.parse(n5) : n5, s2 = o4?.href;
    if (typeof s2 != "string") return;
    const i3 = Br2(s2, t, e2), c5 = Vt2();
    if (c5 === et.browser) {
      if (!((r3 = (0, import_window_getters.getDocument)()) != null && r3.hasFocus())) {
        console.warn("Document does not have focus, skipping deeplink.");
        return;
      }
      Ir2(i3);
    } else c5 === et.reactNative && typeof (global == null ? void 0 : global.Linking) < "u" && await global.Linking.openURL(i3);
  } catch (o4) {
    console.error(o4);
  }
}
function Br2(t, e2, n5) {
  const r3 = `requestId=${e2}&sessionTopic=${n5}`;
  t.endsWith("/") && (t = t.slice(0, -1));
  let o4 = `${t}`;
  if (t.startsWith("https://t.me")) {
    const s2 = t.includes("?") ? "&startapp=" : "?startapp=";
    o4 = `${o4}${s2}${Or2(r3, true)}`;
  } else o4 = `${o4}/wc?${r3}`;
  return o4;
}
function Ir2(t) {
  let e2 = "_self";
  Sr2() ? e2 = "_top" : (Ar2() || t.startsWith("https://") || t.startsWith("http://")) && (e2 = "_blank"), window.open(t, e2, "noreferrer noopener");
}
async function Ci(t, e2) {
  let n5 = "";
  try {
    if (Wt2() && (n5 = localStorage.getItem(e2), n5)) return n5;
    n5 = await t.getItem(e2);
  } catch (r3) {
    console.error(r3);
  }
  return n5;
}
function ji(t, e2) {
  if (!t.includes(e2)) return null;
  const n5 = t.split(/([&,?,=])/), r3 = n5.indexOf(e2);
  return n5[r3 + 2];
}
function Li() {
  return typeof crypto < "u" && crypto != null && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu, (t) => {
    const e2 = Math.random() * 16 | 0;
    return (t === "x" ? e2 : e2 & 3 | 8).toString(16);
  });
}
function ki() {
  return typeof process < "u" && process.env.IS_VITEST === "true";
}
function Ar2() {
  return typeof window < "u" && (!!window.TelegramWebviewProxy || !!window.Telegram || !!window.TelegramWebviewProxyProto);
}
function Sr2() {
  try {
    return window.self !== window.top;
  } catch {
    return false;
  }
}
function Or2(t, e2 = false) {
  const n5 = Buffer.from(t).toString("base64");
  return e2 ? n5.replace(/[=]/g, "") : n5;
}
function cn(t) {
  return Buffer.from(t, "base64").toString("utf-8");
}
function Pi(t) {
  return new Promise((e2) => setTimeout(e2, t));
}
var Hi = class {
  constructor({ limit: e2 }) {
    lr2(this, "limit"), lr2(this, "set"), this.limit = e2, this.set = /* @__PURE__ */ new Set();
  }
  add(e2) {
    if (!this.set.has(e2)) {
      if (this.set.size >= this.limit) {
        const n5 = this.set.values().next().value;
        n5 && this.set.delete(n5);
      }
      this.set.add(e2);
    }
  }
  has(e2) {
    return this.set.has(e2);
  }
};
var Ne3 = BigInt(2 ** 32 - 1);
var Nr2 = BigInt(32);
function Ur2(t, e2 = false) {
  return e2 ? { h: Number(t & Ne3), l: Number(t >> Nr2 & Ne3) } : { h: Number(t >> Nr2 & Ne3) | 0, l: Number(t & Ne3) | 0 };
}
function _r2(t, e2 = false) {
  const n5 = t.length;
  let r3 = new Uint32Array(n5), o4 = new Uint32Array(n5);
  for (let s2 = 0; s2 < n5; s2++) {
    const { h: i3, l: c5 } = Ur2(t[s2], e2);
    [r3[s2], o4[s2]] = [i3, c5];
  }
  return [r3, o4];
}
var Rr2 = (t, e2, n5) => t >>> n5;
var $r2 = (t, e2, n5) => t << 32 - n5 | e2 >>> n5;
var St2 = (t, e2, n5) => t >>> n5 | e2 << 32 - n5;
var Ot2 = (t, e2, n5) => t << 32 - n5 | e2 >>> n5;
var de3 = (t, e2, n5) => t << 64 - n5 | e2 >>> n5 - 32;
var he3 = (t, e2, n5) => t >>> n5 - 32 | e2 << 64 - n5;
var Di = (t, e2) => e2;
var Vi = (t, e2) => t;
var Mi = (t, e2, n5) => t << n5 | e2 >>> 32 - n5;
var Ki = (t, e2, n5) => e2 << n5 | t >>> 32 - n5;
var qi = (t, e2, n5) => e2 << n5 - 32 | t >>> 64 - n5;
var Fi = (t, e2, n5) => t << n5 - 32 | e2 >>> 64 - n5;
function dt2(t, e2, n5, r3) {
  const o4 = (e2 >>> 0) + (r3 >>> 0);
  return { h: t + n5 + (o4 / 2 ** 32 | 0) | 0, l: o4 | 0 };
}
var fn = (t, e2, n5) => (t >>> 0) + (e2 >>> 0) + (n5 >>> 0);
var an = (t, e2, n5, r3) => e2 + n5 + r3 + (t / 2 ** 32 | 0) | 0;
var Zi = (t, e2, n5, r3) => (t >>> 0) + (e2 >>> 0) + (n5 >>> 0) + (r3 >>> 0);
var Gi = (t, e2, n5, r3, o4) => e2 + n5 + r3 + o4 + (t / 2 ** 32 | 0) | 0;
var zi = (t, e2, n5, r3, o4) => (t >>> 0) + (e2 >>> 0) + (n5 >>> 0) + (r3 >>> 0) + (o4 >>> 0);
var Yi = (t, e2, n5, r3, o4, s2) => e2 + n5 + r3 + o4 + s2 + (t / 2 ** 32 | 0) | 0;
var Xt2 = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
function Ue3(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function mt(t) {
  if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function ht2(t, ...e2) {
  if (!Ue3(t)) throw new Error("Uint8Array expected");
  if (e2.length > 0 && !e2.includes(t.length)) throw new Error("Uint8Array expected of length " + e2 + ", got length=" + t.length);
}
function _e3(t) {
  if (typeof t != "function" || typeof t.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
  mt(t.outputLen), mt(t.blockLen);
}
function Nt2(t, e2 = true) {
  if (t.destroyed) throw new Error("Hash instance has been destroyed");
  if (e2 && t.finished) throw new Error("Hash#digest() has already been called");
}
function un(t, e2) {
  ht2(t);
  const n5 = e2.outputLen;
  if (t.length < n5) throw new Error("digestInto() expects output buffer of length at least " + n5);
}
function pe3(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function lt2(...t) {
  for (let e2 = 0; e2 < t.length; e2++) t[e2].fill(0);
}
function ln(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function bt2(t, e2) {
  return t << 32 - e2 | t >>> e2;
}
var Tr2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Cr2(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
var wt2 = Tr2 ? (t) => t : (t) => Cr2(t);
function Wi(t) {
  for (let e2 = 0; e2 < t.length; e2++) t[e2] = Cr2(t[e2]);
  return t;
}
var Ut2 = Tr2 ? (t) => t : Wi;
var jr2 = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function";
var Xi = Array.from({ length: 256 }, (t, e2) => e2.toString(16).padStart(2, "0"));
function Jt2(t) {
  if (ht2(t), jr2) return t.toHex();
  let e2 = "";
  for (let n5 = 0; n5 < t.length; n5++) e2 += Xi[t[n5]];
  return e2;
}
var vt2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Lr2(t) {
  if (t >= vt2._0 && t <= vt2._9) return t - vt2._0;
  if (t >= vt2.A && t <= vt2.F) return t - (vt2.A - 10);
  if (t >= vt2.a && t <= vt2.f) return t - (vt2.a - 10);
}
function Re3(t) {
  if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
  if (jr2) return Uint8Array.fromHex(t);
  const e2 = t.length, n5 = e2 / 2;
  if (e2 % 2) throw new Error("hex string expected, got unpadded hex of length " + e2);
  const r3 = new Uint8Array(n5);
  for (let o4 = 0, s2 = 0; o4 < n5; o4++, s2 += 2) {
    const i3 = Lr2(t.charCodeAt(s2)), c5 = Lr2(t.charCodeAt(s2 + 1));
    if (i3 === void 0 || c5 === void 0) {
      const f4 = t[s2] + t[s2 + 1];
      throw new Error('hex string expected, got non-hex character "' + f4 + '" at index ' + s2);
    }
    r3[o4] = i3 * 16 + c5;
  }
  return r3;
}
function kr2(t) {
  if (typeof t != "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function pt(t) {
  return typeof t == "string" && (t = kr2(t)), ht2(t), t;
}
function _t2(...t) {
  let e2 = 0;
  for (let r3 = 0; r3 < t.length; r3++) {
    const o4 = t[r3];
    ht2(o4), e2 += o4.length;
  }
  const n5 = new Uint8Array(e2);
  for (let r3 = 0, o4 = 0; r3 < t.length; r3++) {
    const s2 = t[r3];
    n5.set(s2, o4), o4 += s2.length;
  }
  return n5;
}
var $e3 = class {
};
function ge3(t) {
  const e2 = (r3) => t().update(pt(r3)).digest(), n5 = t();
  return e2.outputLen = n5.outputLen, e2.blockLen = n5.blockLen, e2.create = () => t(), e2;
}
function Ji(t) {
  const e2 = (r3, o4) => t(o4).update(pt(r3)).digest(), n5 = t({});
  return e2.outputLen = n5.outputLen, e2.blockLen = n5.blockLen, e2.create = (r3) => t(r3), e2;
}
function Mt2(t = 32) {
  if (Xt2 && typeof Xt2.getRandomValues == "function") return Xt2.getRandomValues(new Uint8Array(t));
  if (Xt2 && typeof Xt2.randomBytes == "function") return Uint8Array.from(Xt2.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
var Qi = BigInt(0);
var be3 = BigInt(1);
var tc = BigInt(2);
var ec = BigInt(7);
var nc = BigInt(256);
var rc = BigInt(113);
var Pr2 = [];
var Hr2 = [];
var Dr2 = [];
for (let t = 0, e2 = be3, n5 = 1, r3 = 0; t < 24; t++) {
  [n5, r3] = [r3, (2 * n5 + 3 * r3) % 5], Pr2.push(2 * (5 * r3 + n5)), Hr2.push((t + 1) * (t + 2) / 2 % 64);
  let o4 = Qi;
  for (let s2 = 0; s2 < 7; s2++) e2 = (e2 << be3 ^ (e2 >> ec) * rc) % nc, e2 & tc && (o4 ^= be3 << (be3 << BigInt(s2)) - be3);
  Dr2.push(o4);
}
var Vr2 = _r2(Dr2, true);
var oc = Vr2[0];
var sc = Vr2[1];
var Mr2 = (t, e2, n5) => n5 > 32 ? qi(t, e2, n5) : Mi(t, e2, n5);
var Kr2 = (t, e2, n5) => n5 > 32 ? Fi(t, e2, n5) : Ki(t, e2, n5);
function ic(t, e2 = 24) {
  const n5 = new Uint32Array(10);
  for (let r3 = 24 - e2; r3 < 24; r3++) {
    for (let i3 = 0; i3 < 10; i3++) n5[i3] = t[i3] ^ t[i3 + 10] ^ t[i3 + 20] ^ t[i3 + 30] ^ t[i3 + 40];
    for (let i3 = 0; i3 < 10; i3 += 2) {
      const c5 = (i3 + 8) % 10, f4 = (i3 + 2) % 10, u2 = n5[f4], a3 = n5[f4 + 1], l6 = Mr2(u2, a3, 1) ^ n5[c5], d4 = Kr2(u2, a3, 1) ^ n5[c5 + 1];
      for (let h4 = 0; h4 < 50; h4 += 10) t[i3 + h4] ^= l6, t[i3 + h4 + 1] ^= d4;
    }
    let o4 = t[2], s2 = t[3];
    for (let i3 = 0; i3 < 24; i3++) {
      const c5 = Hr2[i3], f4 = Mr2(o4, s2, c5), u2 = Kr2(o4, s2, c5), a3 = Pr2[i3];
      o4 = t[a3], s2 = t[a3 + 1], t[a3] = f4, t[a3 + 1] = u2;
    }
    for (let i3 = 0; i3 < 50; i3 += 10) {
      for (let c5 = 0; c5 < 10; c5++) n5[c5] = t[i3 + c5];
      for (let c5 = 0; c5 < 10; c5++) t[i3 + c5] ^= ~n5[(c5 + 2) % 10] & n5[(c5 + 4) % 10];
    }
    t[0] ^= oc[r3], t[1] ^= sc[r3];
  }
  lt2(n5);
}
var Jn2 = class _Jn extends $e3 {
  constructor(e2, n5, r3, o4 = false, s2 = 24) {
    if (super(), this.pos = 0, this.posOut = 0, this.finished = false, this.destroyed = false, this.enableXOF = false, this.blockLen = e2, this.suffix = n5, this.outputLen = r3, this.enableXOF = o4, this.rounds = s2, mt(r3), !(0 < e2 && e2 < 200)) throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200), this.state32 = pe3(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    Ut2(this.state32), ic(this.state32, this.rounds), Ut2(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e2) {
    Nt2(this), e2 = pt(e2), ht2(e2);
    const { blockLen: n5, state: r3 } = this, o4 = e2.length;
    for (let s2 = 0; s2 < o4; ) {
      const i3 = Math.min(n5 - this.pos, o4 - s2);
      for (let c5 = 0; c5 < i3; c5++) r3[this.pos++] ^= e2[s2++];
      this.pos === n5 && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = true;
    const { state: e2, suffix: n5, pos: r3, blockLen: o4 } = this;
    e2[r3] ^= n5, (n5 & 128) !== 0 && r3 === o4 - 1 && this.keccak(), e2[o4 - 1] ^= 128, this.keccak();
  }
  writeInto(e2) {
    Nt2(this, false), ht2(e2), this.finish();
    const n5 = this.state, { blockLen: r3 } = this;
    for (let o4 = 0, s2 = e2.length; o4 < s2; ) {
      this.posOut >= r3 && this.keccak();
      const i3 = Math.min(r3 - this.posOut, s2 - o4);
      e2.set(n5.subarray(this.posOut, this.posOut + i3), o4), this.posOut += i3, o4 += i3;
    }
    return e2;
  }
  xofInto(e2) {
    if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
    return this.writeInto(e2);
  }
  xof(e2) {
    return mt(e2), this.xofInto(new Uint8Array(e2));
  }
  digestInto(e2) {
    if (un(e2, this), this.finished) throw new Error("digest() was already called");
    return this.writeInto(e2), this.destroy(), e2;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true, lt2(this.state);
  }
  _cloneInto(e2) {
    const { blockLen: n5, suffix: r3, outputLen: o4, rounds: s2, enableXOF: i3 } = this;
    return e2 || (e2 = new _Jn(n5, r3, o4, i3, s2)), e2.state32.set(this.state32), e2.pos = this.pos, e2.posOut = this.posOut, e2.finished = this.finished, e2.rounds = s2, e2.suffix = r3, e2.outputLen = o4, e2.enableXOF = i3, e2.destroyed = this.destroyed, e2;
  }
};
var cc = (t, e2, n5) => ge3(() => new Jn2(e2, t, n5));
var fc = cc(1, 136, 256 / 8);
function ac(t, e2, n5, r3) {
  if (typeof t.setBigUint64 == "function") return t.setBigUint64(e2, n5, r3);
  const o4 = BigInt(32), s2 = BigInt(4294967295), i3 = Number(n5 >> o4 & s2), c5 = Number(n5 & s2), f4 = r3 ? 4 : 0, u2 = r3 ? 0 : 4;
  t.setUint32(e2 + f4, i3, r3), t.setUint32(e2 + u2, c5, r3);
}
function uc(t, e2, n5) {
  return t & e2 ^ ~t & n5;
}
function lc(t, e2, n5) {
  return t & e2 ^ t & n5 ^ e2 & n5;
}
var qr2 = class extends $e3 {
  constructor(e2, n5, r3, o4) {
    super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = e2, this.outputLen = n5, this.padOffset = r3, this.isLE = o4, this.buffer = new Uint8Array(e2), this.view = ln(this.buffer);
  }
  update(e2) {
    Nt2(this), e2 = pt(e2), ht2(e2);
    const { view: n5, buffer: r3, blockLen: o4 } = this, s2 = e2.length;
    for (let i3 = 0; i3 < s2; ) {
      const c5 = Math.min(o4 - this.pos, s2 - i3);
      if (c5 === o4) {
        const f4 = ln(e2);
        for (; o4 <= s2 - i3; i3 += o4) this.process(f4, i3);
        continue;
      }
      r3.set(e2.subarray(i3, i3 + c5), this.pos), this.pos += c5, i3 += c5, this.pos === o4 && (this.process(n5, 0), this.pos = 0);
    }
    return this.length += e2.length, this.roundClean(), this;
  }
  digestInto(e2) {
    Nt2(this), un(e2, this), this.finished = true;
    const { buffer: n5, view: r3, blockLen: o4, isLE: s2 } = this;
    let { pos: i3 } = this;
    n5[i3++] = 128, lt2(this.buffer.subarray(i3)), this.padOffset > o4 - i3 && (this.process(r3, 0), i3 = 0);
    for (let l6 = i3; l6 < o4; l6++) n5[l6] = 0;
    ac(r3, o4 - 8, BigInt(this.length * 8), s2), this.process(r3, 0);
    const c5 = ln(e2), f4 = this.outputLen;
    if (f4 % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u2 = f4 / 4, a3 = this.get();
    if (u2 > a3.length) throw new Error("_sha2: outputLen bigger than state");
    for (let l6 = 0; l6 < u2; l6++) c5.setUint32(4 * l6, a3[l6], s2);
  }
  digest() {
    const { buffer: e2, outputLen: n5 } = this;
    this.digestInto(e2);
    const r3 = e2.slice(0, n5);
    return this.destroy(), r3;
  }
  _cloneInto(e2) {
    e2 || (e2 = new this.constructor()), e2.set(...this.get());
    const { blockLen: n5, buffer: r3, length: o4, finished: s2, destroyed: i3, pos: c5 } = this;
    return e2.destroyed = i3, e2.finished = s2, e2.length = o4, e2.pos = c5, o4 % n5 && e2.buffer.set(r3), e2;
  }
  clone() {
    return this._cloneInto();
  }
};
var Rt2 = Uint32Array.from([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]);
var X2 = Uint32Array.from([3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428]);
var J3 = Uint32Array.from([1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209]);
var dc = Uint32Array.from([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
var $t2 = new Uint32Array(64);
var hc = class extends qr2 {
  constructor(e2 = 32) {
    super(64, e2, 8, false), this.A = Rt2[0] | 0, this.B = Rt2[1] | 0, this.C = Rt2[2] | 0, this.D = Rt2[3] | 0, this.E = Rt2[4] | 0, this.F = Rt2[5] | 0, this.G = Rt2[6] | 0, this.H = Rt2[7] | 0;
  }
  get() {
    const { A: e2, B: n5, C: r3, D: o4, E: s2, F: i3, G: c5, H: f4 } = this;
    return [e2, n5, r3, o4, s2, i3, c5, f4];
  }
  set(e2, n5, r3, o4, s2, i3, c5, f4) {
    this.A = e2 | 0, this.B = n5 | 0, this.C = r3 | 0, this.D = o4 | 0, this.E = s2 | 0, this.F = i3 | 0, this.G = c5 | 0, this.H = f4 | 0;
  }
  process(e2, n5) {
    for (let l6 = 0; l6 < 16; l6++, n5 += 4) $t2[l6] = e2.getUint32(n5, false);
    for (let l6 = 16; l6 < 64; l6++) {
      const d4 = $t2[l6 - 15], h4 = $t2[l6 - 2], y4 = bt2(d4, 7) ^ bt2(d4, 18) ^ d4 >>> 3, m3 = bt2(h4, 17) ^ bt2(h4, 19) ^ h4 >>> 10;
      $t2[l6] = m3 + $t2[l6 - 7] + y4 + $t2[l6 - 16] | 0;
    }
    let { A: r3, B: o4, C: s2, D: i3, E: c5, F: f4, G: u2, H: a3 } = this;
    for (let l6 = 0; l6 < 64; l6++) {
      const d4 = bt2(c5, 6) ^ bt2(c5, 11) ^ bt2(c5, 25), h4 = a3 + d4 + uc(c5, f4, u2) + dc[l6] + $t2[l6] | 0, m3 = (bt2(r3, 2) ^ bt2(r3, 13) ^ bt2(r3, 22)) + lc(r3, o4, s2) | 0;
      a3 = u2, u2 = f4, f4 = c5, c5 = i3 + h4 | 0, i3 = s2, s2 = o4, o4 = r3, r3 = h4 + m3 | 0;
    }
    r3 = r3 + this.A | 0, o4 = o4 + this.B | 0, s2 = s2 + this.C | 0, i3 = i3 + this.D | 0, c5 = c5 + this.E | 0, f4 = f4 + this.F | 0, u2 = u2 + this.G | 0, a3 = a3 + this.H | 0, this.set(r3, o4, s2, i3, c5, f4, u2, a3);
  }
  roundClean() {
    lt2($t2);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), lt2(this.buffer);
  }
};
var Fr2 = _r2(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((t) => BigInt(t)));
var pc = Fr2[0];
var gc = Fr2[1];
var Tt2 = new Uint32Array(80);
var Ct = new Uint32Array(80);
var dn = class extends qr2 {
  constructor(e2 = 64) {
    super(128, e2, 16, false), this.Ah = J3[0] | 0, this.Al = J3[1] | 0, this.Bh = J3[2] | 0, this.Bl = J3[3] | 0, this.Ch = J3[4] | 0, this.Cl = J3[5] | 0, this.Dh = J3[6] | 0, this.Dl = J3[7] | 0, this.Eh = J3[8] | 0, this.El = J3[9] | 0, this.Fh = J3[10] | 0, this.Fl = J3[11] | 0, this.Gh = J3[12] | 0, this.Gl = J3[13] | 0, this.Hh = J3[14] | 0, this.Hl = J3[15] | 0;
  }
  get() {
    const { Ah: e2, Al: n5, Bh: r3, Bl: o4, Ch: s2, Cl: i3, Dh: c5, Dl: f4, Eh: u2, El: a3, Fh: l6, Fl: d4, Gh: h4, Gl: y4, Hh: m3, Hl: w3 } = this;
    return [e2, n5, r3, o4, s2, i3, c5, f4, u2, a3, l6, d4, h4, y4, m3, w3];
  }
  set(e2, n5, r3, o4, s2, i3, c5, f4, u2, a3, l6, d4, h4, y4, m3, w3) {
    this.Ah = e2 | 0, this.Al = n5 | 0, this.Bh = r3 | 0, this.Bl = o4 | 0, this.Ch = s2 | 0, this.Cl = i3 | 0, this.Dh = c5 | 0, this.Dl = f4 | 0, this.Eh = u2 | 0, this.El = a3 | 0, this.Fh = l6 | 0, this.Fl = d4 | 0, this.Gh = h4 | 0, this.Gl = y4 | 0, this.Hh = m3 | 0, this.Hl = w3 | 0;
  }
  process(e2, n5) {
    for (let R4 = 0; R4 < 16; R4++, n5 += 4) Tt2[R4] = e2.getUint32(n5), Ct[R4] = e2.getUint32(n5 += 4);
    for (let R4 = 16; R4 < 80; R4++) {
      const Z2 = Tt2[R4 - 15] | 0, H3 = Ct[R4 - 15] | 0, j6 = St2(Z2, H3, 1) ^ St2(Z2, H3, 8) ^ Rr2(Z2, H3, 7), L2 = Ot2(Z2, H3, 1) ^ Ot2(Z2, H3, 8) ^ $r2(Z2, H3, 7), k4 = Tt2[R4 - 2] | 0, O4 = Ct[R4 - 2] | 0, T3 = St2(k4, O4, 19) ^ de3(k4, O4, 61) ^ Rr2(k4, O4, 6), C4 = Ot2(k4, O4, 19) ^ he3(k4, O4, 61) ^ $r2(k4, O4, 6), _3 = Zi(L2, C4, Ct[R4 - 7], Ct[R4 - 16]), p3 = Gi(_3, j6, T3, Tt2[R4 - 7], Tt2[R4 - 16]);
      Tt2[R4] = p3 | 0, Ct[R4] = _3 | 0;
    }
    let { Ah: r3, Al: o4, Bh: s2, Bl: i3, Ch: c5, Cl: f4, Dh: u2, Dl: a3, Eh: l6, El: d4, Fh: h4, Fl: y4, Gh: m3, Gl: w3, Hh: U3, Hl: F } = this;
    for (let R4 = 0; R4 < 80; R4++) {
      const Z2 = St2(l6, d4, 14) ^ St2(l6, d4, 18) ^ de3(l6, d4, 41), H3 = Ot2(l6, d4, 14) ^ Ot2(l6, d4, 18) ^ he3(l6, d4, 41), j6 = l6 & h4 ^ ~l6 & m3, L2 = d4 & y4 ^ ~d4 & w3, k4 = zi(F, H3, L2, gc[R4], Ct[R4]), O4 = Yi(k4, U3, Z2, j6, pc[R4], Tt2[R4]), T3 = k4 | 0, C4 = St2(r3, o4, 28) ^ de3(r3, o4, 34) ^ de3(r3, o4, 39), _3 = Ot2(r3, o4, 28) ^ he3(r3, o4, 34) ^ he3(r3, o4, 39), p3 = r3 & s2 ^ r3 & c5 ^ s2 & c5, b5 = o4 & i3 ^ o4 & f4 ^ i3 & f4;
      U3 = m3 | 0, F = w3 | 0, m3 = h4 | 0, w3 = y4 | 0, h4 = l6 | 0, y4 = d4 | 0, { h: l6, l: d4 } = dt2(u2 | 0, a3 | 0, O4 | 0, T3 | 0), u2 = c5 | 0, a3 = f4 | 0, c5 = s2 | 0, f4 = i3 | 0, s2 = r3 | 0, i3 = o4 | 0;
      const g2 = fn(T3, _3, b5);
      r3 = an(g2, O4, C4, p3), o4 = g2 | 0;
    }
    ({ h: r3, l: o4 } = dt2(this.Ah | 0, this.Al | 0, r3 | 0, o4 | 0)), { h: s2, l: i3 } = dt2(this.Bh | 0, this.Bl | 0, s2 | 0, i3 | 0), { h: c5, l: f4 } = dt2(this.Ch | 0, this.Cl | 0, c5 | 0, f4 | 0), { h: u2, l: a3 } = dt2(this.Dh | 0, this.Dl | 0, u2 | 0, a3 | 0), { h: l6, l: d4 } = dt2(this.Eh | 0, this.El | 0, l6 | 0, d4 | 0), { h: h4, l: y4 } = dt2(this.Fh | 0, this.Fl | 0, h4 | 0, y4 | 0), { h: m3, l: w3 } = dt2(this.Gh | 0, this.Gl | 0, m3 | 0, w3 | 0), { h: U3, l: F } = dt2(this.Hh | 0, this.Hl | 0, U3 | 0, F | 0), this.set(r3, o4, s2, i3, c5, f4, u2, a3, l6, d4, h4, y4, m3, w3, U3, F);
  }
  roundClean() {
    lt2(Tt2, Ct);
  }
  destroy() {
    lt2(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var bc = class extends dn {
  constructor() {
    super(48), this.Ah = X2[0] | 0, this.Al = X2[1] | 0, this.Bh = X2[2] | 0, this.Bl = X2[3] | 0, this.Ch = X2[4] | 0, this.Cl = X2[5] | 0, this.Dh = X2[6] | 0, this.Dl = X2[7] | 0, this.Eh = X2[8] | 0, this.El = X2[9] | 0, this.Fh = X2[10] | 0, this.Fl = X2[11] | 0, this.Gh = X2[12] | 0, this.Gl = X2[13] | 0, this.Hh = X2[14] | 0, this.Hl = X2[15] | 0;
  }
};
var Q3 = Uint32Array.from([573645204, 4230739756, 2673172387, 3360449730, 596883563, 1867755857, 2520282905, 1497426621, 2519219938, 2827943907, 3193839141, 1401305490, 721525244, 746961066, 246885852, 2177182882]);
var yc = class extends dn {
  constructor() {
    super(32), this.Ah = Q3[0] | 0, this.Al = Q3[1] | 0, this.Bh = Q3[2] | 0, this.Bl = Q3[3] | 0, this.Ch = Q3[4] | 0, this.Cl = Q3[5] | 0, this.Dh = Q3[6] | 0, this.Dl = Q3[7] | 0, this.Eh = Q3[8] | 0, this.El = Q3[9] | 0, this.Fh = Q3[10] | 0, this.Fl = Q3[11] | 0, this.Gh = Q3[12] | 0, this.Gl = Q3[13] | 0, this.Hh = Q3[14] | 0, this.Hl = Q3[15] | 0;
  }
};
var Te3 = ge3(() => new hc());
var mc = ge3(() => new dn());
var wc = ge3(() => new bc());
var vc = ge3(() => new yc());
var xc = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9]);
var z2 = Uint32Array.from([4089235720, 1779033703, 2227873595, 3144134277, 4271175723, 1013904242, 1595750129, 2773480762, 2917565137, 1359893119, 725511199, 2600822924, 4215389547, 528734635, 327033209, 1541459225]);
var S3 = new Uint32Array(32);
function jt2(t, e2, n5, r3, o4, s2) {
  const i3 = o4[s2], c5 = o4[s2 + 1];
  let f4 = S3[2 * t], u2 = S3[2 * t + 1], a3 = S3[2 * e2], l6 = S3[2 * e2 + 1], d4 = S3[2 * n5], h4 = S3[2 * n5 + 1], y4 = S3[2 * r3], m3 = S3[2 * r3 + 1], w3 = fn(f4, a3, i3);
  u2 = an(w3, u2, l6, c5), f4 = w3 | 0, { Dh: m3, Dl: y4 } = { Dh: m3 ^ u2, Dl: y4 ^ f4 }, { Dh: m3, Dl: y4 } = { Dh: Di(m3, y4), Dl: Vi(m3) }, { h: h4, l: d4 } = dt2(h4, d4, m3, y4), { Bh: l6, Bl: a3 } = { Bh: l6 ^ h4, Bl: a3 ^ d4 }, { Bh: l6, Bl: a3 } = { Bh: St2(l6, a3, 24), Bl: Ot2(l6, a3, 24) }, S3[2 * t] = f4, S3[2 * t + 1] = u2, S3[2 * e2] = a3, S3[2 * e2 + 1] = l6, S3[2 * n5] = d4, S3[2 * n5 + 1] = h4, S3[2 * r3] = y4, S3[2 * r3 + 1] = m3;
}
function Lt2(t, e2, n5, r3, o4, s2) {
  const i3 = o4[s2], c5 = o4[s2 + 1];
  let f4 = S3[2 * t], u2 = S3[2 * t + 1], a3 = S3[2 * e2], l6 = S3[2 * e2 + 1], d4 = S3[2 * n5], h4 = S3[2 * n5 + 1], y4 = S3[2 * r3], m3 = S3[2 * r3 + 1], w3 = fn(f4, a3, i3);
  u2 = an(w3, u2, l6, c5), f4 = w3 | 0, { Dh: m3, Dl: y4 } = { Dh: m3 ^ u2, Dl: y4 ^ f4 }, { Dh: m3, Dl: y4 } = { Dh: St2(m3, y4, 16), Dl: Ot2(m3, y4, 16) }, { h: h4, l: d4 } = dt2(h4, d4, m3, y4), { Bh: l6, Bl: a3 } = { Bh: l6 ^ h4, Bl: a3 ^ d4 }, { Bh: l6, Bl: a3 } = { Bh: de3(l6, a3, 63), Bl: he3(l6, a3, 63) }, S3[2 * t] = f4, S3[2 * t + 1] = u2, S3[2 * e2] = a3, S3[2 * e2 + 1] = l6, S3[2 * n5] = d4, S3[2 * n5 + 1] = h4, S3[2 * r3] = y4, S3[2 * r3 + 1] = m3;
}
function Ec(t, e2 = {}, n5, r3, o4) {
  if (mt(n5), t < 0 || t > n5) throw new Error("outputLen bigger than keyLen");
  const { key: s2, salt: i3, personalization: c5 } = e2;
  if (s2 !== void 0 && (s2.length < 1 || s2.length > n5)) throw new Error("key length must be undefined or 1.." + n5);
  if (i3 !== void 0 && i3.length !== r3) throw new Error("salt must be undefined or " + r3);
  if (c5 !== void 0 && c5.length !== o4) throw new Error("personalization must be undefined or " + o4);
}
var Bc = class extends $e3 {
  constructor(e2, n5) {
    super(), this.finished = false, this.destroyed = false, this.length = 0, this.pos = 0, mt(e2), mt(n5), this.blockLen = e2, this.outputLen = n5, this.buffer = new Uint8Array(e2), this.buffer32 = pe3(this.buffer);
  }
  update(e2) {
    Nt2(this), e2 = pt(e2), ht2(e2);
    const { blockLen: n5, buffer: r3, buffer32: o4 } = this, s2 = e2.length, i3 = e2.byteOffset, c5 = e2.buffer;
    for (let f4 = 0; f4 < s2; ) {
      this.pos === n5 && (Ut2(o4), this.compress(o4, 0, false), Ut2(o4), this.pos = 0);
      const u2 = Math.min(n5 - this.pos, s2 - f4), a3 = i3 + f4;
      if (u2 === n5 && !(a3 % 4) && f4 + u2 < s2) {
        const l6 = new Uint32Array(c5, a3, Math.floor((s2 - f4) / 4));
        Ut2(l6);
        for (let d4 = 0; f4 + n5 < s2; d4 += o4.length, f4 += n5) this.length += n5, this.compress(l6, d4, false);
        Ut2(l6);
        continue;
      }
      r3.set(e2.subarray(f4, f4 + u2), this.pos), this.pos += u2, this.length += u2, f4 += u2;
    }
    return this;
  }
  digestInto(e2) {
    Nt2(this), un(e2, this);
    const { pos: n5, buffer32: r3 } = this;
    this.finished = true, lt2(this.buffer.subarray(n5)), Ut2(r3), this.compress(r3, 0, true), Ut2(r3);
    const o4 = pe3(e2);
    this.get().forEach((s2, i3) => o4[i3] = wt2(s2));
  }
  digest() {
    const { buffer: e2, outputLen: n5 } = this;
    this.digestInto(e2);
    const r3 = e2.slice(0, n5);
    return this.destroy(), r3;
  }
  _cloneInto(e2) {
    const { buffer: n5, length: r3, finished: o4, destroyed: s2, outputLen: i3, pos: c5 } = this;
    return e2 || (e2 = new this.constructor({ dkLen: i3 })), e2.set(...this.get()), e2.buffer.set(n5), e2.destroyed = s2, e2.finished = o4, e2.length = r3, e2.pos = c5, e2.outputLen = i3, e2;
  }
  clone() {
    return this._cloneInto();
  }
};
var Ic = class extends Bc {
  constructor(e2 = {}) {
    const n5 = e2.dkLen === void 0 ? 64 : e2.dkLen;
    super(128, n5), this.v0l = z2[0] | 0, this.v0h = z2[1] | 0, this.v1l = z2[2] | 0, this.v1h = z2[3] | 0, this.v2l = z2[4] | 0, this.v2h = z2[5] | 0, this.v3l = z2[6] | 0, this.v3h = z2[7] | 0, this.v4l = z2[8] | 0, this.v4h = z2[9] | 0, this.v5l = z2[10] | 0, this.v5h = z2[11] | 0, this.v6l = z2[12] | 0, this.v6h = z2[13] | 0, this.v7l = z2[14] | 0, this.v7h = z2[15] | 0, Ec(n5, e2, 64, 16, 16);
    let { key: r3, personalization: o4, salt: s2 } = e2, i3 = 0;
    if (r3 !== void 0 && (r3 = pt(r3), i3 = r3.length), this.v0l ^= this.outputLen | i3 << 8 | 65536 | 1 << 24, s2 !== void 0) {
      s2 = pt(s2);
      const c5 = pe3(s2);
      this.v4l ^= wt2(c5[0]), this.v4h ^= wt2(c5[1]), this.v5l ^= wt2(c5[2]), this.v5h ^= wt2(c5[3]);
    }
    if (o4 !== void 0) {
      o4 = pt(o4);
      const c5 = pe3(o4);
      this.v6l ^= wt2(c5[0]), this.v6h ^= wt2(c5[1]), this.v7l ^= wt2(c5[2]), this.v7h ^= wt2(c5[3]);
    }
    if (r3 !== void 0) {
      const c5 = new Uint8Array(this.blockLen);
      c5.set(r3), this.update(c5);
    }
  }
  get() {
    let { v0l: e2, v0h: n5, v1l: r3, v1h: o4, v2l: s2, v2h: i3, v3l: c5, v3h: f4, v4l: u2, v4h: a3, v5l: l6, v5h: d4, v6l: h4, v6h: y4, v7l: m3, v7h: w3 } = this;
    return [e2, n5, r3, o4, s2, i3, c5, f4, u2, a3, l6, d4, h4, y4, m3, w3];
  }
  set(e2, n5, r3, o4, s2, i3, c5, f4, u2, a3, l6, d4, h4, y4, m3, w3) {
    this.v0l = e2 | 0, this.v0h = n5 | 0, this.v1l = r3 | 0, this.v1h = o4 | 0, this.v2l = s2 | 0, this.v2h = i3 | 0, this.v3l = c5 | 0, this.v3h = f4 | 0, this.v4l = u2 | 0, this.v4h = a3 | 0, this.v5l = l6 | 0, this.v5h = d4 | 0, this.v6l = h4 | 0, this.v6h = y4 | 0, this.v7l = m3 | 0, this.v7h = w3 | 0;
  }
  compress(e2, n5, r3) {
    this.get().forEach((f4, u2) => S3[u2] = f4), S3.set(z2, 16);
    let { h: o4, l: s2 } = Ur2(BigInt(this.length));
    S3[24] = z2[8] ^ s2, S3[25] = z2[9] ^ o4, r3 && (S3[28] = ~S3[28], S3[29] = ~S3[29]);
    let i3 = 0;
    const c5 = xc;
    for (let f4 = 0; f4 < 12; f4++) jt2(0, 4, 8, 12, e2, n5 + 2 * c5[i3++]), Lt2(0, 4, 8, 12, e2, n5 + 2 * c5[i3++]), jt2(1, 5, 9, 13, e2, n5 + 2 * c5[i3++]), Lt2(1, 5, 9, 13, e2, n5 + 2 * c5[i3++]), jt2(2, 6, 10, 14, e2, n5 + 2 * c5[i3++]), Lt2(2, 6, 10, 14, e2, n5 + 2 * c5[i3++]), jt2(3, 7, 11, 15, e2, n5 + 2 * c5[i3++]), Lt2(3, 7, 11, 15, e2, n5 + 2 * c5[i3++]), jt2(0, 5, 10, 15, e2, n5 + 2 * c5[i3++]), Lt2(0, 5, 10, 15, e2, n5 + 2 * c5[i3++]), jt2(1, 6, 11, 12, e2, n5 + 2 * c5[i3++]), Lt2(1, 6, 11, 12, e2, n5 + 2 * c5[i3++]), jt2(2, 7, 8, 13, e2, n5 + 2 * c5[i3++]), Lt2(2, 7, 8, 13, e2, n5 + 2 * c5[i3++]), jt2(3, 4, 9, 14, e2, n5 + 2 * c5[i3++]), Lt2(3, 4, 9, 14, e2, n5 + 2 * c5[i3++]);
    this.v0l ^= S3[0] ^ S3[16], this.v0h ^= S3[1] ^ S3[17], this.v1l ^= S3[2] ^ S3[18], this.v1h ^= S3[3] ^ S3[19], this.v2l ^= S3[4] ^ S3[20], this.v2h ^= S3[5] ^ S3[21], this.v3l ^= S3[6] ^ S3[22], this.v3h ^= S3[7] ^ S3[23], this.v4l ^= S3[8] ^ S3[24], this.v4h ^= S3[9] ^ S3[25], this.v5l ^= S3[10] ^ S3[26], this.v5h ^= S3[11] ^ S3[27], this.v6l ^= S3[12] ^ S3[28], this.v6h ^= S3[13] ^ S3[29], this.v7l ^= S3[14] ^ S3[30], this.v7h ^= S3[15] ^ S3[31], lt2(S3);
  }
  destroy() {
    this.destroyed = true, lt2(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var Ac = Ji((t) => new Ic(t));
var Sc = "https://rpc.walletconnect.org/v1";
function hn(t) {
  const e2 = `Ethereum Signed Message:
${t.length}`, n5 = new TextEncoder().encode(e2 + t);
  return "0x" + Buffer.from(fc(n5)).toString("hex");
}
async function Zr2(t, e2, n5, r3, o4, s2) {
  switch (n5.t) {
    case "eip191":
      return await Gr2(t, e2, n5.s);
    case "eip1271":
      return await zr2(t, e2, n5.s, r3, o4, s2);
    default:
      throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${n5.t}`);
  }
}
function Gr2(t, e2, n5) {
  const r3 = Signature_exports.fromHex(n5);
  return Secp256k1_exports.recoverAddress({ payload: hn(e2), signature: r3 }).toLowerCase() === t.toLowerCase();
}
async function zr2(t, e2, n5, r3, o4, s2) {
  const i3 = Je2(r3);
  if (!i3.namespace || !i3.reference) throw new Error(`isValidEip1271Signature failed: chainId must be in CAIP-2 format, received: ${r3}`);
  try {
    const c5 = "0x1626ba7e", f4 = "0000000000000000000000000000000000000000000000000000000000000040", u2 = n5.substring(2), a3 = (u2.length / 2).toString(16).padStart(64, "0"), l6 = (e2.startsWith("0x") ? e2 : hn(e2)).substring(2), d4 = c5 + l6 + f4 + a3 + u2, h4 = await fetch(`${s2 || Sc}/?chainId=${r3}&projectId=${o4}`, { headers: { "Content-Type": "application/json" }, method: "POST", body: JSON.stringify({ id: Oc(), jsonrpc: "2.0", method: "eth_call", params: [{ to: t, data: d4 }, "latest"] }) }), { result: y4 } = await h4.json();
    return y4 ? y4.slice(0, c5.length).toLowerCase() === c5.toLowerCase() : false;
  } catch (c5) {
    return console.error("isValidEip1271Signature: ", c5), false;
  }
}
function Oc() {
  return Date.now() + Math.floor(Math.random() * 1e3);
}
function Nc(t) {
  const e2 = atob(t), n5 = new Uint8Array(e2.length);
  for (let i3 = 0; i3 < e2.length; i3++) n5[i3] = e2.charCodeAt(i3);
  const r3 = n5[0];
  if (r3 === 0) throw new Error("No signatures found");
  const o4 = 1 + r3 * 64;
  if (n5.length < o4) throw new Error("Transaction data too short for claimed signature count");
  if (n5.length < 100) throw new Error("Transaction too short");
  const s2 = Buffer.from(t, "base64").slice(1, 65);
  return esm_default2.encode(s2);
}
function Uc(t) {
  const e2 = new Uint8Array(Buffer.from(t, "base64")), n5 = Array.from("TransactionData::").map((s2) => s2.charCodeAt(0)), r3 = new Uint8Array(n5.length + e2.length);
  r3.set(n5), r3.set(e2, n5.length);
  const o4 = Ac(r3, { dkLen: 32 });
  return esm_default2.encode(o4);
}
function _c(t) {
  const e2 = new Uint8Array(Te3(Yr2(t)));
  return esm_default2.encode(e2);
}
function Yr2(t) {
  if (t instanceof Uint8Array) return t;
  if (Array.isArray(t)) return new Uint8Array(t);
  if (typeof t == "object" && t != null && t.data) return new Uint8Array(Object.values(t.data));
  if (typeof t == "object" && t) return new Uint8Array(Object.values(t));
  throw new Error("getNearUint8ArrayFromBytes: Unexpected result type from bytes array");
}
function Rc(t) {
  const e2 = Buffer.from(t, "base64"), n5 = decode(e2).txn;
  if (!n5) throw new Error("Invalid signed transaction: missing 'txn' field");
  const r3 = encode(n5), o4 = Buffer.from("TX"), s2 = Buffer.concat([o4, Buffer.from(r3)]), i3 = vc(s2);
  return base32.encode(i3).replace(/=+$/, "");
}
function pn(t) {
  const e2 = [];
  let n5 = BigInt(t);
  for (; n5 >= BigInt(128); ) e2.push(Number(n5 & BigInt(127) | BigInt(128))), n5 >>= BigInt(7);
  return e2.push(Number(n5)), Buffer.from(e2);
}
function $c(t) {
  const e2 = Buffer.from(t.signed.bodyBytes, "base64"), n5 = Buffer.from(t.signed.authInfoBytes, "base64"), r3 = Buffer.from(t.signature.signature, "base64"), o4 = [];
  o4.push(Buffer.from([10])), o4.push(pn(e2.length)), o4.push(e2), o4.push(Buffer.from([18])), o4.push(pn(n5.length)), o4.push(n5), o4.push(Buffer.from([26])), o4.push(pn(r3.length)), o4.push(r3);
  const s2 = Buffer.concat(o4), i3 = Te3(s2);
  return Buffer.from(i3).toString("hex").toUpperCase();
}
function Tc(t) {
  var e2, n5;
  const r3 = [];
  try {
    if (typeof t == "string") return r3.push(t), r3;
    if (typeof t != "object") return r3;
    t != null && t.id && r3.push(t.id);
    const o4 = (n5 = (e2 = t?.capabilities) == null ? void 0 : e2.caip345) == null ? void 0 : n5.transactionHashes;
    o4 && r3.push(...o4);
  } catch (o4) {
    console.warn("getWalletSendCallsHashes failed: ", o4);
  }
  return r3;
}
var Cc = Object.defineProperty;
var jc = Object.defineProperties;
var Lc = Object.getOwnPropertyDescriptors;
var Wr2 = Object.getOwnPropertySymbols;
var kc = Object.prototype.hasOwnProperty;
var Pc = Object.prototype.propertyIsEnumerable;
var Xr2 = (t, e2, n5) => e2 in t ? Cc(t, e2, { enumerable: true, configurable: true, writable: true, value: n5 }) : t[e2] = n5;
var gn2 = (t, e2) => {
  for (var n5 in e2 || (e2 = {})) kc.call(e2, n5) && Xr2(t, n5, e2[n5]);
  if (Wr2) for (var n5 of Wr2(e2)) Pc.call(e2, n5) && Xr2(t, n5, e2[n5]);
  return t;
};
var Jr2 = (t, e2) => jc(t, Lc(e2));
var Qr2 = "did:pkh:";
var Hc = { eip155: "Ethereum", solana: "Solana", bip122: "Bitcoin" };
var Dc = (t) => t ? Hc[t] || t : "";
var ye3 = (t) => t?.split(":");
var to2 = (t) => {
  const e2 = t && ye3(t);
  if (e2) return t.includes(Qr2) ? e2[3] : e2[1];
};
var eo2 = (t) => {
  const e2 = t && ye3(t);
  if (e2) return t.includes(Qr2) ? e2[2] : e2[0];
};
var no2 = (t) => {
  const e2 = t && ye3(t);
  if (e2) return e2[2] + ":" + e2[3];
};
var bn2 = (t) => {
  const e2 = t && ye3(t);
  if (e2) return e2.pop();
};
async function Vc(t) {
  const { cacao: e2, projectId: n5 } = t, { s: r3, p: o4 } = e2, s2 = ro2(o4, o4.iss), i3 = bn2(o4.iss);
  return await Zr2(i3, s2, r3, no2(o4.iss), n5);
}
var ro2 = (t, e2) => {
  const n5 = eo2(e2);
  if (!n5) throw new Error("Invalid issuer: " + e2);
  const r3 = `${t.domain} wants you to sign in with your ${Dc(n5)} account:`, o4 = bn2(e2);
  if (!t.aud && !t.uri) throw new Error("Either `aud` or `uri` is required to construct the message");
  let s2 = t.statement || void 0;
  const i3 = `URI: ${t.aud || t.uri}`, c5 = `Version: ${t.version}`, f4 = `Chain ID: ${to2(e2)}`, u2 = `Nonce: ${t.nonce}`, a3 = `Issued At: ${t.iat}`, l6 = t.exp ? `Expiration Time: ${t.exp}` : void 0, d4 = t.nbf ? `Not Before: ${t.nbf}` : void 0, h4 = t.requestId ? `Request ID: ${t.requestId}` : void 0, y4 = t.resources ? `Resources:${t.resources.map((w3) => `
- ${w3}`).join("")}` : void 0, m3 = je3(t.resources);
  if (m3) {
    const w3 = kt2(m3);
    s2 = wn(s2, w3);
  }
  return [r3, o4, "", s2, "", i3, c5, f4, u2, a3, l6, d4, h4, y4].filter((w3) => w3 != null).join(`
`);
};
function co2(t) {
  return Buffer.from(JSON.stringify(t)).toString("base64");
}
function fo2(t) {
  return JSON.parse(Buffer.from(t, "base64").toString("utf-8"));
}
function yt2(t) {
  if (!t) throw new Error("No recap provided, value is undefined");
  if (!t.att) throw new Error("No `att` property found");
  const e2 = Object.keys(t.att);
  if (!(e2 != null && e2.length)) throw new Error("No resources found in `att` property");
  e2.forEach((n5) => {
    const r3 = t.att[n5];
    if (Array.isArray(r3)) throw new Error(`Resource must be an object: ${n5}`);
    if (typeof r3 != "object") throw new Error(`Resource must be an object: ${n5}`);
    if (!Object.keys(r3).length) throw new Error(`Resource object is empty: ${n5}`);
    Object.keys(r3).forEach((o4) => {
      const s2 = r3[o4];
      if (!Array.isArray(s2)) throw new Error(`Ability limits ${o4} must be an array of objects, found: ${s2}`);
      if (!s2.length) throw new Error(`Value of ${o4} is empty array, must be an array with objects`);
      s2.forEach((i3) => {
        if (typeof i3 != "object") throw new Error(`Ability limits (${o4}) must be an array of objects, found: ${i3}`);
      });
    });
  });
}
function ao2(t, e2, n5, r3 = {}) {
  return n5?.sort((o4, s2) => o4.localeCompare(s2)), { att: { [t]: yn2(e2, n5, r3) } };
}
function yn2(t, e2, n5 = {}) {
  e2 = e2?.sort((o4, s2) => o4.localeCompare(s2));
  const r3 = e2.map((o4) => ({ [`${t}/${o4}`]: [n5] }));
  return Object.assign({}, ...r3);
}
function Ce3(t) {
  return yt2(t), `urn:recap:${co2(t).replace(/=/g, "")}`;
}
function kt2(t) {
  const e2 = fo2(t.replace("urn:recap:", ""));
  return yt2(e2), e2;
}
function Zc(t, e2, n5) {
  const r3 = ao2(t, e2, n5);
  return Ce3(r3);
}
function mn2(t) {
  return t && t.includes("urn:recap:");
}
function Gc(t, e2) {
  const n5 = kt2(t), r3 = kt2(e2), o4 = lo2(n5, r3);
  return Ce3(o4);
}
function lo2(t, e2) {
  yt2(t), yt2(e2);
  const n5 = Object.keys(t.att).concat(Object.keys(e2.att)).sort((o4, s2) => o4.localeCompare(s2)), r3 = { att: {} };
  return n5.forEach((o4) => {
    var s2, i3;
    Object.keys(((s2 = t.att) == null ? void 0 : s2[o4]) || {}).concat(Object.keys(((i3 = e2.att) == null ? void 0 : i3[o4]) || {})).sort((c5, f4) => c5.localeCompare(f4)).forEach((c5) => {
      var f4, u2;
      r3.att[o4] = Jr2(gn2({}, r3.att[o4]), { [c5]: ((f4 = t.att[o4]) == null ? void 0 : f4[c5]) || ((u2 = e2.att[o4]) == null ? void 0 : u2[c5]) });
    });
  }), r3;
}
function wn(t = "", e2) {
  yt2(e2);
  const n5 = "I further authorize the stated URI to perform the following actions on my behalf: ";
  if (t.includes(n5)) return t;
  const r3 = [];
  let o4 = 0;
  Object.keys(e2.att).forEach((c5) => {
    const f4 = Object.keys(e2.att[c5]).map((l6) => ({ ability: l6.split("/")[0], action: l6.split("/")[1] }));
    f4.sort((l6, d4) => l6.action.localeCompare(d4.action));
    const u2 = {};
    f4.forEach((l6) => {
      u2[l6.ability] || (u2[l6.ability] = []), u2[l6.ability].push(l6.action);
    });
    const a3 = Object.keys(u2).map((l6) => (o4++, `(${o4}) '${l6}': '${u2[l6].join("', '")}' for '${c5}'.`));
    r3.push(a3.join(", ").replace(".,", "."));
  });
  const s2 = r3.join(" "), i3 = `${n5}${s2}`;
  return `${t ? t + " " : ""}${i3}`;
}
function zc(t) {
  var e2;
  const n5 = kt2(t);
  yt2(n5);
  const r3 = (e2 = n5.att) == null ? void 0 : e2.eip155;
  return r3 ? Object.keys(r3).map((o4) => o4.split("/")[1]) : [];
}
function Yc(t) {
  const e2 = kt2(t);
  yt2(e2);
  const n5 = [];
  return Object.values(e2.att).forEach((r3) => {
    Object.values(r3).forEach((o4) => {
      var s2;
      (s2 = o4?.[0]) != null && s2.chains && n5.push(o4[0].chains);
    });
  }), [...new Set(n5.flat())];
}
function je3(t) {
  if (!t) return;
  const e2 = t?.[t.length - 1];
  return mn2(e2) ? e2 : void 0;
}
function po2(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function vn2(t) {
  if (typeof t != "boolean") throw new Error(`boolean expected, not ${t}`);
}
function xn2(t) {
  if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function ot(t, ...e2) {
  if (!po2(t)) throw new Error("Uint8Array expected");
  if (e2.length > 0 && !e2.includes(t.length)) throw new Error("Uint8Array expected of length " + e2 + ", got length=" + t.length);
}
function go2(t, e2 = true) {
  if (t.destroyed) throw new Error("Hash instance has been destroyed");
  if (e2 && t.finished) throw new Error("Hash#digest() has already been called");
}
function Wc(t, e2) {
  ot(t);
  const n5 = e2.outputLen;
  if (t.length < n5) throw new Error("digestInto() expects output buffer of length at least " + n5);
}
function Pt2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Qt2(...t) {
  for (let e2 = 0; e2 < t.length; e2++) t[e2].fill(0);
}
function Xc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
var Jc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Qc(t) {
  if (typeof t != "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function En2(t) {
  if (typeof t == "string") t = Qc(t);
  else if (po2(t)) t = Bn2(t);
  else throw new Error("Uint8Array expected, got " + typeof t);
  return t;
}
function tf(t, e2) {
  if (e2 == null || typeof e2 != "object") throw new Error("options must be defined");
  return Object.assign(t, e2);
}
function ef(t, e2) {
  if (t.length !== e2.length) return false;
  let n5 = 0;
  for (let r3 = 0; r3 < t.length; r3++) n5 |= t[r3] ^ e2[r3];
  return n5 === 0;
}
var nf = (t, e2) => {
  function n5(r3, ...o4) {
    if (ot(r3), !Jc) throw new Error("Non little-endian hardware is not yet supported");
    if (t.nonceLength !== void 0) {
      const a3 = o4[0];
      if (!a3) throw new Error("nonce / iv required");
      t.varSizeNonce ? ot(a3) : ot(a3, t.nonceLength);
    }
    const s2 = t.tagLength;
    s2 && o4[1] !== void 0 && ot(o4[1]);
    const i3 = e2(r3, ...o4), c5 = (a3, l6) => {
      if (l6 !== void 0) {
        if (a3 !== 2) throw new Error("cipher output not supported");
        ot(l6);
      }
    };
    let f4 = false;
    return { encrypt(a3, l6) {
      if (f4) throw new Error("cannot encrypt() twice with same key + nonce");
      return f4 = true, ot(a3), c5(i3.encrypt.length, l6), i3.encrypt(a3, l6);
    }, decrypt(a3, l6) {
      if (ot(a3), s2 && a3.length < s2) throw new Error("invalid ciphertext length: smaller than tagLength=" + s2);
      return c5(i3.decrypt.length, l6), i3.decrypt(a3, l6);
    } };
  }
  return Object.assign(n5, t), n5;
};
function bo2(t, e2, n5 = true) {
  if (e2 === void 0) return new Uint8Array(t);
  if (e2.length !== t) throw new Error("invalid output length, expected " + t + ", got: " + e2.length);
  if (n5 && !of(e2)) throw new Error("invalid output, must be aligned");
  return e2;
}
function yo2(t, e2, n5, r3) {
  if (typeof t.setBigUint64 == "function") return t.setBigUint64(e2, n5, r3);
  const o4 = BigInt(32), s2 = BigInt(4294967295), i3 = Number(n5 >> o4 & s2), c5 = Number(n5 & s2), f4 = r3 ? 4 : 0, u2 = r3 ? 0 : 4;
  t.setUint32(e2 + f4, i3, r3), t.setUint32(e2 + u2, c5, r3);
}
function rf(t, e2, n5) {
  vn2(n5);
  const r3 = new Uint8Array(16), o4 = Xc(r3);
  return yo2(o4, 0, BigInt(e2), n5), yo2(o4, 8, BigInt(t), n5), r3;
}
function of(t) {
  return t.byteOffset % 4 === 0;
}
function Bn2(t) {
  return Uint8Array.from(t);
}
var mo2 = (t) => Uint8Array.from(t.split("").map((e2) => e2.charCodeAt(0)));
var sf = mo2("expand 16-byte k");
var cf = mo2("expand 32-byte k");
var ff = Pt2(sf);
var af = Pt2(cf);
function K4(t, e2) {
  return t << e2 | t >>> 32 - e2;
}
function In2(t) {
  return t.byteOffset % 4 === 0;
}
var Le3 = 64;
var uf = 16;
var wo2 = 2 ** 32 - 1;
var vo2 = new Uint32Array();
function lf(t, e2, n5, r3, o4, s2, i3, c5) {
  const f4 = o4.length, u2 = new Uint8Array(Le3), a3 = Pt2(u2), l6 = In2(o4) && In2(s2), d4 = l6 ? Pt2(o4) : vo2, h4 = l6 ? Pt2(s2) : vo2;
  for (let y4 = 0; y4 < f4; i3++) {
    if (t(e2, n5, r3, a3, i3, c5), i3 >= wo2) throw new Error("arx: counter overflow");
    const m3 = Math.min(Le3, f4 - y4);
    if (l6 && m3 === Le3) {
      const w3 = y4 / 4;
      if (y4 % 4 !== 0) throw new Error("arx: invalid block position");
      for (let U3 = 0, F; U3 < uf; U3++) F = w3 + U3, h4[F] = d4[F] ^ a3[U3];
      y4 += Le3;
      continue;
    }
    for (let w3 = 0, U3; w3 < m3; w3++) U3 = y4 + w3, s2[U3] = o4[U3] ^ u2[w3];
    y4 += m3;
  }
}
function df(t, e2) {
  const { allowShortKeys: n5, extendNonceFn: r3, counterLength: o4, counterRight: s2, rounds: i3 } = tf({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, e2);
  if (typeof t != "function") throw new Error("core must be a function");
  return xn2(o4), xn2(i3), vn2(s2), vn2(n5), (c5, f4, u2, a3, l6 = 0) => {
    ot(c5), ot(f4), ot(u2);
    const d4 = u2.length;
    if (a3 === void 0 && (a3 = new Uint8Array(d4)), ot(a3), xn2(l6), l6 < 0 || l6 >= wo2) throw new Error("arx: counter overflow");
    if (a3.length < d4) throw new Error(`arx: output (${a3.length}) is shorter than data (${d4})`);
    const h4 = [];
    let y4 = c5.length, m3, w3;
    if (y4 === 32) h4.push(m3 = Bn2(c5)), w3 = af;
    else if (y4 === 16 && n5) m3 = new Uint8Array(32), m3.set(c5), m3.set(c5, 16), w3 = ff, h4.push(m3);
    else throw new Error(`arx: invalid 32-byte key, got length=${y4}`);
    In2(f4) || h4.push(f4 = Bn2(f4));
    const U3 = Pt2(m3);
    if (r3) {
      if (f4.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
      r3(w3, U3, Pt2(f4.subarray(0, 16)), U3), f4 = f4.subarray(16);
    }
    const F = 16 - o4;
    if (F !== f4.length) throw new Error(`arx: nonce must be ${F} or 16 bytes`);
    if (F !== 12) {
      const Z2 = new Uint8Array(12);
      Z2.set(f4, s2 ? 0 : 12 - f4.length), f4 = Z2, h4.push(f4);
    }
    const R4 = Pt2(f4);
    return lf(t, w3, U3, R4, u2, a3, l6, i3), Qt2(...h4), a3;
  };
}
var W3 = (t, e2) => t[e2++] & 255 | (t[e2++] & 255) << 8;
var hf = class {
  constructor(e2) {
    this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = false, e2 = En2(e2), ot(e2, 32);
    const n5 = W3(e2, 0), r3 = W3(e2, 2), o4 = W3(e2, 4), s2 = W3(e2, 6), i3 = W3(e2, 8), c5 = W3(e2, 10), f4 = W3(e2, 12), u2 = W3(e2, 14);
    this.r[0] = n5 & 8191, this.r[1] = (n5 >>> 13 | r3 << 3) & 8191, this.r[2] = (r3 >>> 10 | o4 << 6) & 7939, this.r[3] = (o4 >>> 7 | s2 << 9) & 8191, this.r[4] = (s2 >>> 4 | i3 << 12) & 255, this.r[5] = i3 >>> 1 & 8190, this.r[6] = (i3 >>> 14 | c5 << 2) & 8191, this.r[7] = (c5 >>> 11 | f4 << 5) & 8065, this.r[8] = (f4 >>> 8 | u2 << 8) & 8191, this.r[9] = u2 >>> 5 & 127;
    for (let a3 = 0; a3 < 8; a3++) this.pad[a3] = W3(e2, 16 + 2 * a3);
  }
  process(e2, n5, r3 = false) {
    const o4 = r3 ? 0 : 2048, { h: s2, r: i3 } = this, c5 = i3[0], f4 = i3[1], u2 = i3[2], a3 = i3[3], l6 = i3[4], d4 = i3[5], h4 = i3[6], y4 = i3[7], m3 = i3[8], w3 = i3[9], U3 = W3(e2, n5 + 0), F = W3(e2, n5 + 2), R4 = W3(e2, n5 + 4), Z2 = W3(e2, n5 + 6), H3 = W3(e2, n5 + 8), j6 = W3(e2, n5 + 10), L2 = W3(e2, n5 + 12), k4 = W3(e2, n5 + 14);
    let O4 = s2[0] + (U3 & 8191), T3 = s2[1] + ((U3 >>> 13 | F << 3) & 8191), C4 = s2[2] + ((F >>> 10 | R4 << 6) & 8191), _3 = s2[3] + ((R4 >>> 7 | Z2 << 9) & 8191), p3 = s2[4] + ((Z2 >>> 4 | H3 << 12) & 8191), b5 = s2[5] + (H3 >>> 1 & 8191), g2 = s2[6] + ((H3 >>> 14 | j6 << 2) & 8191), x5 = s2[7] + ((j6 >>> 11 | L2 << 5) & 8191), E3 = s2[8] + ((L2 >>> 8 | k4 << 8) & 8191), I3 = s2[9] + (k4 >>> 5 | o4), v5 = 0, B2 = v5 + O4 * c5 + T3 * (5 * w3) + C4 * (5 * m3) + _3 * (5 * y4) + p3 * (5 * h4);
    v5 = B2 >>> 13, B2 &= 8191, B2 += b5 * (5 * d4) + g2 * (5 * l6) + x5 * (5 * a3) + E3 * (5 * u2) + I3 * (5 * f4), v5 += B2 >>> 13, B2 &= 8191;
    let A3 = v5 + O4 * f4 + T3 * c5 + C4 * (5 * w3) + _3 * (5 * m3) + p3 * (5 * y4);
    v5 = A3 >>> 13, A3 &= 8191, A3 += b5 * (5 * h4) + g2 * (5 * d4) + x5 * (5 * l6) + E3 * (5 * a3) + I3 * (5 * u2), v5 += A3 >>> 13, A3 &= 8191;
    let N12 = v5 + O4 * u2 + T3 * f4 + C4 * c5 + _3 * (5 * w3) + p3 * (5 * m3);
    v5 = N12 >>> 13, N12 &= 8191, N12 += b5 * (5 * y4) + g2 * (5 * h4) + x5 * (5 * d4) + E3 * (5 * l6) + I3 * (5 * a3), v5 += N12 >>> 13, N12 &= 8191;
    let D2 = v5 + O4 * a3 + T3 * u2 + C4 * f4 + _3 * c5 + p3 * (5 * w3);
    v5 = D2 >>> 13, D2 &= 8191, D2 += b5 * (5 * m3) + g2 * (5 * y4) + x5 * (5 * h4) + E3 * (5 * d4) + I3 * (5 * l6), v5 += D2 >>> 13, D2 &= 8191;
    let P5 = v5 + O4 * l6 + T3 * a3 + C4 * u2 + _3 * f4 + p3 * c5;
    v5 = P5 >>> 13, P5 &= 8191, P5 += b5 * (5 * w3) + g2 * (5 * m3) + x5 * (5 * y4) + E3 * (5 * h4) + I3 * (5 * d4), v5 += P5 >>> 13, P5 &= 8191;
    let $3 = v5 + O4 * d4 + T3 * l6 + C4 * a3 + _3 * u2 + p3 * f4;
    v5 = $3 >>> 13, $3 &= 8191, $3 += b5 * c5 + g2 * (5 * w3) + x5 * (5 * m3) + E3 * (5 * y4) + I3 * (5 * h4), v5 += $3 >>> 13, $3 &= 8191;
    let V4 = v5 + O4 * h4 + T3 * d4 + C4 * l6 + _3 * a3 + p3 * u2;
    v5 = V4 >>> 13, V4 &= 8191, V4 += b5 * f4 + g2 * c5 + x5 * (5 * w3) + E3 * (5 * m3) + I3 * (5 * y4), v5 += V4 >>> 13, V4 &= 8191;
    let q3 = v5 + O4 * y4 + T3 * h4 + C4 * d4 + _3 * l6 + p3 * a3;
    v5 = q3 >>> 13, q3 &= 8191, q3 += b5 * u2 + g2 * f4 + x5 * c5 + E3 * (5 * w3) + I3 * (5 * m3), v5 += q3 >>> 13, q3 &= 8191;
    let G4 = v5 + O4 * m3 + T3 * y4 + C4 * h4 + _3 * d4 + p3 * l6;
    v5 = G4 >>> 13, G4 &= 8191, G4 += b5 * a3 + g2 * u2 + x5 * f4 + E3 * c5 + I3 * (5 * w3), v5 += G4 >>> 13, G4 &= 8191;
    let M4 = v5 + O4 * w3 + T3 * m3 + C4 * y4 + _3 * h4 + p3 * d4;
    v5 = M4 >>> 13, M4 &= 8191, M4 += b5 * l6 + g2 * a3 + x5 * u2 + E3 * f4 + I3 * c5, v5 += M4 >>> 13, M4 &= 8191, v5 = (v5 << 2) + v5 | 0, v5 = v5 + B2 | 0, B2 = v5 & 8191, v5 = v5 >>> 13, A3 += v5, s2[0] = B2, s2[1] = A3, s2[2] = N12, s2[3] = D2, s2[4] = P5, s2[5] = $3, s2[6] = V4, s2[7] = q3, s2[8] = G4, s2[9] = M4;
  }
  finalize() {
    const { h: e2, pad: n5 } = this, r3 = new Uint16Array(10);
    let o4 = e2[1] >>> 13;
    e2[1] &= 8191;
    for (let c5 = 2; c5 < 10; c5++) e2[c5] += o4, o4 = e2[c5] >>> 13, e2[c5] &= 8191;
    e2[0] += o4 * 5, o4 = e2[0] >>> 13, e2[0] &= 8191, e2[1] += o4, o4 = e2[1] >>> 13, e2[1] &= 8191, e2[2] += o4, r3[0] = e2[0] + 5, o4 = r3[0] >>> 13, r3[0] &= 8191;
    for (let c5 = 1; c5 < 10; c5++) r3[c5] = e2[c5] + o4, o4 = r3[c5] >>> 13, r3[c5] &= 8191;
    r3[9] -= 8192;
    let s2 = (o4 ^ 1) - 1;
    for (let c5 = 0; c5 < 10; c5++) r3[c5] &= s2;
    s2 = ~s2;
    for (let c5 = 0; c5 < 10; c5++) e2[c5] = e2[c5] & s2 | r3[c5];
    e2[0] = (e2[0] | e2[1] << 13) & 65535, e2[1] = (e2[1] >>> 3 | e2[2] << 10) & 65535, e2[2] = (e2[2] >>> 6 | e2[3] << 7) & 65535, e2[3] = (e2[3] >>> 9 | e2[4] << 4) & 65535, e2[4] = (e2[4] >>> 12 | e2[5] << 1 | e2[6] << 14) & 65535, e2[5] = (e2[6] >>> 2 | e2[7] << 11) & 65535, e2[6] = (e2[7] >>> 5 | e2[8] << 8) & 65535, e2[7] = (e2[8] >>> 8 | e2[9] << 5) & 65535;
    let i3 = e2[0] + n5[0];
    e2[0] = i3 & 65535;
    for (let c5 = 1; c5 < 8; c5++) i3 = (e2[c5] + n5[c5] | 0) + (i3 >>> 16) | 0, e2[c5] = i3 & 65535;
    Qt2(r3);
  }
  update(e2) {
    go2(this), e2 = En2(e2), ot(e2);
    const { buffer: n5, blockLen: r3 } = this, o4 = e2.length;
    for (let s2 = 0; s2 < o4; ) {
      const i3 = Math.min(r3 - this.pos, o4 - s2);
      if (i3 === r3) {
        for (; r3 <= o4 - s2; s2 += r3) this.process(e2, s2);
        continue;
      }
      n5.set(e2.subarray(s2, s2 + i3), this.pos), this.pos += i3, s2 += i3, this.pos === r3 && (this.process(n5, 0, false), this.pos = 0);
    }
    return this;
  }
  destroy() {
    Qt2(this.h, this.r, this.buffer, this.pad);
  }
  digestInto(e2) {
    go2(this), Wc(e2, this), this.finished = true;
    const { buffer: n5, h: r3 } = this;
    let { pos: o4 } = this;
    if (o4) {
      for (n5[o4++] = 1; o4 < 16; o4++) n5[o4] = 0;
      this.process(n5, 0, true);
    }
    this.finalize();
    let s2 = 0;
    for (let i3 = 0; i3 < 8; i3++) e2[s2++] = r3[i3] >>> 0, e2[s2++] = r3[i3] >>> 8;
    return e2;
  }
  digest() {
    const { buffer: e2, outputLen: n5 } = this;
    this.digestInto(e2);
    const r3 = e2.slice(0, n5);
    return this.destroy(), r3;
  }
};
function pf(t) {
  const e2 = (r3, o4) => t(o4).update(En2(r3)).digest(), n5 = t(new Uint8Array(32));
  return e2.outputLen = n5.outputLen, e2.blockLen = n5.blockLen, e2.create = (r3) => t(r3), e2;
}
var gf = pf((t) => new hf(t));
function bf(t, e2, n5, r3, o4, s2 = 20) {
  let i3 = t[0], c5 = t[1], f4 = t[2], u2 = t[3], a3 = e2[0], l6 = e2[1], d4 = e2[2], h4 = e2[3], y4 = e2[4], m3 = e2[5], w3 = e2[6], U3 = e2[7], F = o4, R4 = n5[0], Z2 = n5[1], H3 = n5[2], j6 = i3, L2 = c5, k4 = f4, O4 = u2, T3 = a3, C4 = l6, _3 = d4, p3 = h4, b5 = y4, g2 = m3, x5 = w3, E3 = U3, I3 = F, v5 = R4, B2 = Z2, A3 = H3;
  for (let D2 = 0; D2 < s2; D2 += 2) j6 = j6 + T3 | 0, I3 = K4(I3 ^ j6, 16), b5 = b5 + I3 | 0, T3 = K4(T3 ^ b5, 12), j6 = j6 + T3 | 0, I3 = K4(I3 ^ j6, 8), b5 = b5 + I3 | 0, T3 = K4(T3 ^ b5, 7), L2 = L2 + C4 | 0, v5 = K4(v5 ^ L2, 16), g2 = g2 + v5 | 0, C4 = K4(C4 ^ g2, 12), L2 = L2 + C4 | 0, v5 = K4(v5 ^ L2, 8), g2 = g2 + v5 | 0, C4 = K4(C4 ^ g2, 7), k4 = k4 + _3 | 0, B2 = K4(B2 ^ k4, 16), x5 = x5 + B2 | 0, _3 = K4(_3 ^ x5, 12), k4 = k4 + _3 | 0, B2 = K4(B2 ^ k4, 8), x5 = x5 + B2 | 0, _3 = K4(_3 ^ x5, 7), O4 = O4 + p3 | 0, A3 = K4(A3 ^ O4, 16), E3 = E3 + A3 | 0, p3 = K4(p3 ^ E3, 12), O4 = O4 + p3 | 0, A3 = K4(A3 ^ O4, 8), E3 = E3 + A3 | 0, p3 = K4(p3 ^ E3, 7), j6 = j6 + C4 | 0, A3 = K4(A3 ^ j6, 16), x5 = x5 + A3 | 0, C4 = K4(C4 ^ x5, 12), j6 = j6 + C4 | 0, A3 = K4(A3 ^ j6, 8), x5 = x5 + A3 | 0, C4 = K4(C4 ^ x5, 7), L2 = L2 + _3 | 0, I3 = K4(I3 ^ L2, 16), E3 = E3 + I3 | 0, _3 = K4(_3 ^ E3, 12), L2 = L2 + _3 | 0, I3 = K4(I3 ^ L2, 8), E3 = E3 + I3 | 0, _3 = K4(_3 ^ E3, 7), k4 = k4 + p3 | 0, v5 = K4(v5 ^ k4, 16), b5 = b5 + v5 | 0, p3 = K4(p3 ^ b5, 12), k4 = k4 + p3 | 0, v5 = K4(v5 ^ k4, 8), b5 = b5 + v5 | 0, p3 = K4(p3 ^ b5, 7), O4 = O4 + T3 | 0, B2 = K4(B2 ^ O4, 16), g2 = g2 + B2 | 0, T3 = K4(T3 ^ g2, 12), O4 = O4 + T3 | 0, B2 = K4(B2 ^ O4, 8), g2 = g2 + B2 | 0, T3 = K4(T3 ^ g2, 7);
  let N12 = 0;
  r3[N12++] = i3 + j6 | 0, r3[N12++] = c5 + L2 | 0, r3[N12++] = f4 + k4 | 0, r3[N12++] = u2 + O4 | 0, r3[N12++] = a3 + T3 | 0, r3[N12++] = l6 + C4 | 0, r3[N12++] = d4 + _3 | 0, r3[N12++] = h4 + p3 | 0, r3[N12++] = y4 + b5 | 0, r3[N12++] = m3 + g2 | 0, r3[N12++] = w3 + x5 | 0, r3[N12++] = U3 + E3 | 0, r3[N12++] = F + I3 | 0, r3[N12++] = R4 + v5 | 0, r3[N12++] = Z2 + B2 | 0, r3[N12++] = H3 + A3 | 0;
}
var yf = df(bf, { counterRight: false, counterLength: 4, allowShortKeys: false });
var mf = new Uint8Array(16);
var xo2 = (t, e2) => {
  t.update(e2);
  const n5 = e2.length % 16;
  n5 && t.update(mf.subarray(n5));
};
var wf = new Uint8Array(32);
function Eo2(t, e2, n5, r3, o4) {
  const s2 = t(e2, n5, wf), i3 = gf.create(s2);
  o4 && xo2(i3, o4), xo2(i3, r3);
  const c5 = rf(r3.length, o4 ? o4.length : 0, true);
  i3.update(c5);
  const f4 = i3.digest();
  return Qt2(s2, c5), f4;
}
var vf = (t) => (e2, n5, r3) => ({ encrypt(s2, i3) {
  const c5 = s2.length;
  i3 = bo2(c5 + 16, i3, false), i3.set(s2);
  const f4 = i3.subarray(0, -16);
  t(e2, n5, f4, f4, 1);
  const u2 = Eo2(t, e2, n5, f4, r3);
  return i3.set(u2, c5), Qt2(u2), i3;
}, decrypt(s2, i3) {
  i3 = bo2(s2.length - 16, i3, false);
  const c5 = s2.subarray(0, -16), f4 = s2.subarray(-16), u2 = Eo2(t, e2, n5, c5, r3);
  if (!ef(f4, u2)) throw new Error("invalid tag");
  return i3.set(s2.subarray(0, -16)), t(e2, n5, i3, i3, 1), Qt2(u2), i3;
} });
var Bo2 = nf({ blockSize: 64, nonceLength: 12, tagLength: 16 }, vf(yf));
var Io2 = class extends $e3 {
  constructor(e2, n5) {
    super(), this.finished = false, this.destroyed = false, _e3(e2);
    const r3 = pt(n5);
    if (this.iHash = e2.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o4 = this.blockLen, s2 = new Uint8Array(o4);
    s2.set(r3.length > o4 ? e2.create().update(r3).digest() : r3);
    for (let i3 = 0; i3 < s2.length; i3++) s2[i3] ^= 54;
    this.iHash.update(s2), this.oHash = e2.create();
    for (let i3 = 0; i3 < s2.length; i3++) s2[i3] ^= 106;
    this.oHash.update(s2), lt2(s2);
  }
  update(e2) {
    return Nt2(this), this.iHash.update(e2), this;
  }
  digestInto(e2) {
    Nt2(this), ht2(e2, this.outputLen), this.finished = true, this.iHash.digestInto(e2), this.oHash.update(e2), this.oHash.digestInto(e2), this.destroy();
  }
  digest() {
    const e2 = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e2), e2;
  }
  _cloneInto(e2) {
    e2 || (e2 = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n5, iHash: r3, finished: o4, destroyed: s2, blockLen: i3, outputLen: c5 } = this;
    return e2 = e2, e2.finished = o4, e2.destroyed = s2, e2.blockLen = i3, e2.outputLen = c5, e2.oHash = n5._cloneInto(e2.oHash), e2.iHash = r3._cloneInto(e2.iHash), e2;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
  }
};
var ke3 = (t, e2, n5) => new Io2(t, e2).update(n5).digest();
ke3.create = (t, e2) => new Io2(t, e2);
function xf(t, e2, n5) {
  return _e3(t), n5 === void 0 && (n5 = new Uint8Array(t.outputLen)), ke3(t, pt(n5), pt(e2));
}
var An2 = Uint8Array.from([0]);
var Ao2 = Uint8Array.of();
function Ef(t, e2, n5, r3 = 32) {
  _e3(t), mt(r3);
  const o4 = t.outputLen;
  if (r3 > 255 * o4) throw new Error("Length should be <= 255*HashLen");
  const s2 = Math.ceil(r3 / o4);
  n5 === void 0 && (n5 = Ao2);
  const i3 = new Uint8Array(s2 * o4), c5 = ke3.create(t, e2), f4 = c5._cloneInto(), u2 = new Uint8Array(c5.outputLen);
  for (let a3 = 0; a3 < s2; a3++) An2[0] = a3 + 1, f4.update(a3 === 0 ? Ao2 : u2).update(n5).update(An2).digestInto(u2), i3.set(u2, o4 * a3), c5._cloneInto(f4);
  return c5.destroy(), f4.destroy(), lt2(u2, An2), i3.slice(0, r3);
}
var Bf = (t, e2, n5, r3, o4) => Ef(t, xf(t, e2, n5), r3, o4);
var Pe3 = Te3;
var Sn2 = BigInt(0);
var On2 = BigInt(1);
function He2(t, e2 = "") {
  if (typeof t != "boolean") {
    const n5 = e2 && `"${e2}"`;
    throw new Error(n5 + "expected boolean, got type=" + typeof t);
  }
  return t;
}
function Kt2(t, e2, n5 = "") {
  const r3 = Ue3(t), o4 = t?.length, s2 = e2 !== void 0;
  if (!r3 || s2 && o4 !== e2) {
    const i3 = n5 && `"${n5}" `, c5 = s2 ? ` of length ${e2}` : "", f4 = r3 ? `length=${o4}` : `type=${typeof t}`;
    throw new Error(i3 + "expected Uint8Array" + c5 + ", got " + f4);
  }
  return t;
}
function De3(t) {
  const e2 = t.toString(16);
  return e2.length & 1 ? "0" + e2 : e2;
}
function So2(t) {
  if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
  return t === "" ? Sn2 : BigInt("0x" + t);
}
function Ve3(t) {
  return So2(Jt2(t));
}
function Me3(t) {
  return ht2(t), So2(Jt2(Uint8Array.from(t).reverse()));
}
function Nn2(t, e2) {
  return Re3(t.toString(16).padStart(e2 * 2, "0"));
}
function Un2(t, e2) {
  return Nn2(t, e2).reverse();
}
function tt(t, e2, n5) {
  let r3;
  if (typeof e2 == "string") try {
    r3 = Re3(e2);
  } catch (s2) {
    throw new Error(t + " must be hex string or Uint8Array, cause: " + s2);
  }
  else if (Ue3(e2)) r3 = Uint8Array.from(e2);
  else throw new Error(t + " must be hex string or Uint8Array");
  const o4 = r3.length;
  if (typeof n5 == "number" && o4 !== n5) throw new Error(t + " of length " + n5 + " expected, got " + o4);
  return r3;
}
var _n2 = (t) => typeof t == "bigint" && Sn2 <= t;
function If(t, e2, n5) {
  return _n2(t) && _n2(e2) && _n2(n5) && e2 <= t && t < n5;
}
function Rn2(t, e2, n5, r3) {
  if (!If(e2, n5, r3)) throw new Error("expected valid " + t + ": " + n5 + " <= n < " + r3 + ", got " + e2);
}
function Oo2(t) {
  let e2;
  for (e2 = 0; t > Sn2; t >>= On2, e2 += 1) ;
  return e2;
}
var me3 = (t) => (On2 << BigInt(t)) - On2;
function Af(t, e2, n5) {
  if (typeof t != "number" || t < 2) throw new Error("hashLen must be a number");
  if (typeof e2 != "number" || e2 < 2) throw new Error("qByteLen must be a number");
  if (typeof n5 != "function") throw new Error("hmacFn must be a function");
  const r3 = (h4) => new Uint8Array(h4), o4 = (h4) => Uint8Array.of(h4);
  let s2 = r3(t), i3 = r3(t), c5 = 0;
  const f4 = () => {
    s2.fill(1), i3.fill(0), c5 = 0;
  }, u2 = (...h4) => n5(i3, s2, ...h4), a3 = (h4 = r3(0)) => {
    i3 = u2(o4(0), h4), s2 = u2(), h4.length !== 0 && (i3 = u2(o4(1), h4), s2 = u2());
  }, l6 = () => {
    if (c5++ >= 1e3) throw new Error("drbg: tried 1000 values");
    let h4 = 0;
    const y4 = [];
    for (; h4 < e2; ) {
      s2 = u2();
      const m3 = s2.slice();
      y4.push(m3), h4 += s2.length;
    }
    return _t2(...y4);
  };
  return (h4, y4) => {
    f4(), a3(h4);
    let m3;
    for (; !(m3 = y4(l6())); ) a3();
    return f4(), m3;
  };
}
function Ke2(t, e2, n5 = {}) {
  if (!t || typeof t != "object") throw new Error("expected valid options object");
  function r3(o4, s2, i3) {
    const c5 = t[o4];
    if (i3 && c5 === void 0) return;
    const f4 = typeof c5;
    if (f4 !== s2 || c5 === null) throw new Error(`param "${o4}" is invalid: expected ${s2}, got ${f4}`);
  }
  Object.entries(e2).forEach(([o4, s2]) => r3(o4, s2, false)), Object.entries(n5).forEach(([o4, s2]) => r3(o4, s2, true));
}
function No2(t) {
  const e2 = /* @__PURE__ */ new WeakMap();
  return (n5, ...r3) => {
    const o4 = e2.get(n5);
    if (o4 !== void 0) return o4;
    const s2 = t(n5, ...r3);
    return e2.set(n5, s2), s2;
  };
}
var st = BigInt(0);
var nt2 = BigInt(1);
var qt2 = BigInt(2);
var Uo2 = BigInt(3);
var _o2 = BigInt(4);
var Ro2 = BigInt(5);
var Sf = BigInt(7);
var $o2 = BigInt(8);
var Of = BigInt(9);
var To2 = BigInt(16);
function ct2(t, e2) {
  const n5 = t % e2;
  return n5 >= st ? n5 : e2 + n5;
}
function gt2(t, e2, n5) {
  let r3 = t;
  for (; e2-- > st; ) r3 *= r3, r3 %= n5;
  return r3;
}
function Co2(t, e2) {
  if (t === st) throw new Error("invert: expected non-zero number");
  if (e2 <= st) throw new Error("invert: expected positive modulus, got " + e2);
  let n5 = ct2(t, e2), r3 = e2, o4 = st, s2 = nt2;
  for (; n5 !== st; ) {
    const c5 = r3 / n5, f4 = r3 % n5, u2 = o4 - s2 * c5;
    r3 = n5, n5 = f4, o4 = s2, s2 = u2;
  }
  if (r3 !== nt2) throw new Error("invert: does not exist");
  return ct2(o4, e2);
}
function $n2(t, e2, n5) {
  if (!t.eql(t.sqr(e2), n5)) throw new Error("Cannot find square root");
}
function jo2(t, e2) {
  const n5 = (t.ORDER + nt2) / _o2, r3 = t.pow(e2, n5);
  return $n2(t, r3, e2), r3;
}
function Nf(t, e2) {
  const n5 = (t.ORDER - Ro2) / $o2, r3 = t.mul(e2, qt2), o4 = t.pow(r3, n5), s2 = t.mul(e2, o4), i3 = t.mul(t.mul(s2, qt2), o4), c5 = t.mul(s2, t.sub(i3, t.ONE));
  return $n2(t, c5, e2), c5;
}
function Uf(t) {
  const e2 = Ht2(t), n5 = Lo2(t), r3 = n5(e2, e2.neg(e2.ONE)), o4 = n5(e2, r3), s2 = n5(e2, e2.neg(r3)), i3 = (t + Sf) / To2;
  return (c5, f4) => {
    let u2 = c5.pow(f4, i3), a3 = c5.mul(u2, r3);
    const l6 = c5.mul(u2, o4), d4 = c5.mul(u2, s2), h4 = c5.eql(c5.sqr(a3), f4), y4 = c5.eql(c5.sqr(l6), f4);
    u2 = c5.cmov(u2, a3, h4), a3 = c5.cmov(d4, l6, y4);
    const m3 = c5.eql(c5.sqr(a3), f4), w3 = c5.cmov(u2, a3, m3);
    return $n2(c5, w3, f4), w3;
  };
}
function Lo2(t) {
  if (t < Uo2) throw new Error("sqrt is not defined for small field");
  let e2 = t - nt2, n5 = 0;
  for (; e2 % qt2 === st; ) e2 /= qt2, n5++;
  let r3 = qt2;
  const o4 = Ht2(t);
  for (; Po2(o4, r3) === 1; ) if (r3++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
  if (n5 === 1) return jo2;
  let s2 = o4.pow(r3, e2);
  const i3 = (e2 + nt2) / qt2;
  return function(f4, u2) {
    if (f4.is0(u2)) return u2;
    if (Po2(f4, u2) !== 1) throw new Error("Cannot find square root");
    let a3 = n5, l6 = f4.mul(f4.ONE, s2), d4 = f4.pow(u2, e2), h4 = f4.pow(u2, i3);
    for (; !f4.eql(d4, f4.ONE); ) {
      if (f4.is0(d4)) return f4.ZERO;
      let y4 = 1, m3 = f4.sqr(d4);
      for (; !f4.eql(m3, f4.ONE); ) if (y4++, m3 = f4.sqr(m3), y4 === a3) throw new Error("Cannot find square root");
      const w3 = nt2 << BigInt(a3 - y4 - 1), U3 = f4.pow(l6, w3);
      a3 = y4, l6 = f4.sqr(U3), d4 = f4.mul(d4, l6), h4 = f4.mul(h4, U3);
    }
    return h4;
  };
}
function _f(t) {
  return t % _o2 === Uo2 ? jo2 : t % $o2 === Ro2 ? Nf : t % To2 === Of ? Uf(t) : Lo2(t);
}
var Rf = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
function $f(t) {
  const e2 = { ORDER: "bigint", MASK: "bigint", BYTES: "number", BITS: "number" }, n5 = Rf.reduce((r3, o4) => (r3[o4] = "function", r3), e2);
  return Ke2(t, n5), t;
}
function Tf(t, e2, n5) {
  if (n5 < st) throw new Error("invalid exponent, negatives unsupported");
  if (n5 === st) return t.ONE;
  if (n5 === nt2) return e2;
  let r3 = t.ONE, o4 = e2;
  for (; n5 > st; ) n5 & nt2 && (r3 = t.mul(r3, o4)), o4 = t.sqr(o4), n5 >>= nt2;
  return r3;
}
function ko2(t, e2, n5 = false) {
  const r3 = new Array(e2.length).fill(n5 ? t.ZERO : void 0), o4 = e2.reduce((i3, c5, f4) => t.is0(c5) ? i3 : (r3[f4] = i3, t.mul(i3, c5)), t.ONE), s2 = t.inv(o4);
  return e2.reduceRight((i3, c5, f4) => t.is0(c5) ? i3 : (r3[f4] = t.mul(i3, r3[f4]), t.mul(i3, c5)), s2), r3;
}
function Po2(t, e2) {
  const n5 = (t.ORDER - nt2) / qt2, r3 = t.pow(e2, n5), o4 = t.eql(r3, t.ONE), s2 = t.eql(r3, t.ZERO), i3 = t.eql(r3, t.neg(t.ONE));
  if (!o4 && !s2 && !i3) throw new Error("invalid Legendre symbol result");
  return o4 ? 1 : s2 ? 0 : -1;
}
function Ho2(t, e2) {
  e2 !== void 0 && mt(e2);
  const n5 = e2 !== void 0 ? e2 : t.toString(2).length, r3 = Math.ceil(n5 / 8);
  return { nBitLength: n5, nByteLength: r3 };
}
function Ht2(t, e2, n5 = false, r3 = {}) {
  if (t <= st) throw new Error("invalid field: expected ORDER > 0, got " + t);
  let o4, s2, i3 = false, c5;
  if (typeof e2 == "object" && e2 != null) {
    if (r3.sqrt || n5) throw new Error("cannot specify opts in two arguments");
    const d4 = e2;
    d4.BITS && (o4 = d4.BITS), d4.sqrt && (s2 = d4.sqrt), typeof d4.isLE == "boolean" && (n5 = d4.isLE), typeof d4.modFromBytes == "boolean" && (i3 = d4.modFromBytes), c5 = d4.allowedLengths;
  } else typeof e2 == "number" && (o4 = e2), r3.sqrt && (s2 = r3.sqrt);
  const { nBitLength: f4, nByteLength: u2 } = Ho2(t, o4);
  if (u2 > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let a3;
  const l6 = Object.freeze({ ORDER: t, isLE: n5, BITS: f4, BYTES: u2, MASK: me3(f4), ZERO: st, ONE: nt2, allowedLengths: c5, create: (d4) => ct2(d4, t), isValid: (d4) => {
    if (typeof d4 != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof d4);
    return st <= d4 && d4 < t;
  }, is0: (d4) => d4 === st, isValidNot0: (d4) => !l6.is0(d4) && l6.isValid(d4), isOdd: (d4) => (d4 & nt2) === nt2, neg: (d4) => ct2(-d4, t), eql: (d4, h4) => d4 === h4, sqr: (d4) => ct2(d4 * d4, t), add: (d4, h4) => ct2(d4 + h4, t), sub: (d4, h4) => ct2(d4 - h4, t), mul: (d4, h4) => ct2(d4 * h4, t), pow: (d4, h4) => Tf(l6, d4, h4), div: (d4, h4) => ct2(d4 * Co2(h4, t), t), sqrN: (d4) => d4 * d4, addN: (d4, h4) => d4 + h4, subN: (d4, h4) => d4 - h4, mulN: (d4, h4) => d4 * h4, inv: (d4) => Co2(d4, t), sqrt: s2 || ((d4) => (a3 || (a3 = _f(t)), a3(l6, d4))), toBytes: (d4) => n5 ? Un2(d4, u2) : Nn2(d4, u2), fromBytes: (d4, h4 = true) => {
    if (c5) {
      if (!c5.includes(d4.length) || d4.length > u2) throw new Error("Field.fromBytes: expected " + c5 + " bytes, got " + d4.length);
      const m3 = new Uint8Array(u2);
      m3.set(d4, n5 ? 0 : m3.length - d4.length), d4 = m3;
    }
    if (d4.length !== u2) throw new Error("Field.fromBytes: expected " + u2 + " bytes, got " + d4.length);
    let y4 = n5 ? Me3(d4) : Ve3(d4);
    if (i3 && (y4 = ct2(y4, t)), !h4 && !l6.isValid(y4)) throw new Error("invalid field element: outside of range 0..ORDER");
    return y4;
  }, invertBatch: (d4) => ko2(l6, d4), cmov: (d4, h4, y4) => y4 ? h4 : d4 });
  return Object.freeze(l6);
}
function Do2(t) {
  if (typeof t != "bigint") throw new Error("field order must be bigint");
  const e2 = t.toString(2).length;
  return Math.ceil(e2 / 8);
}
function Vo2(t) {
  const e2 = Do2(t);
  return e2 + Math.ceil(e2 / 2);
}
function Cf(t, e2, n5 = false) {
  const r3 = t.length, o4 = Do2(e2), s2 = Vo2(e2);
  if (r3 < 16 || r3 < s2 || r3 > 1024) throw new Error("expected " + s2 + "-1024 bytes of input, got " + r3);
  const i3 = n5 ? Me3(t) : Ve3(t), c5 = ct2(i3, e2 - nt2) + nt2;
  return n5 ? Un2(c5, o4) : Nn2(c5, o4);
}
var te3 = BigInt(0);
var Ft2 = BigInt(1);
function qe2(t, e2) {
  const n5 = e2.negate();
  return t ? n5 : e2;
}
function Tn2(t, e2) {
  const n5 = ko2(t.Fp, e2.map((r3) => r3.Z));
  return e2.map((r3, o4) => t.fromAffine(r3.toAffine(n5[o4])));
}
function Mo2(t, e2) {
  if (!Number.isSafeInteger(t) || t <= 0 || t > e2) throw new Error("invalid window size, expected [1.." + e2 + "], got W=" + t);
}
function Cn2(t, e2) {
  Mo2(t, e2);
  const n5 = Math.ceil(e2 / t) + 1, r3 = 2 ** (t - 1), o4 = 2 ** t, s2 = me3(t), i3 = BigInt(t);
  return { windows: n5, windowSize: r3, mask: s2, maxNumber: o4, shiftBy: i3 };
}
function Ko2(t, e2, n5) {
  const { windowSize: r3, mask: o4, maxNumber: s2, shiftBy: i3 } = n5;
  let c5 = Number(t & o4), f4 = t >> i3;
  c5 > r3 && (c5 -= s2, f4 += Ft2);
  const u2 = e2 * r3, a3 = u2 + Math.abs(c5) - 1, l6 = c5 === 0, d4 = c5 < 0, h4 = e2 % 2 !== 0;
  return { nextN: f4, offset: a3, isZero: l6, isNeg: d4, isNegF: h4, offsetF: u2 };
}
function jf(t, e2) {
  if (!Array.isArray(t)) throw new Error("array expected");
  t.forEach((n5, r3) => {
    if (!(n5 instanceof e2)) throw new Error("invalid point at index " + r3);
  });
}
function Lf(t, e2) {
  if (!Array.isArray(t)) throw new Error("array of scalars expected");
  t.forEach((n5, r3) => {
    if (!e2.isValid(n5)) throw new Error("invalid scalar at index " + r3);
  });
}
var jn2 = /* @__PURE__ */ new WeakMap();
var qo2 = /* @__PURE__ */ new WeakMap();
function Ln2(t) {
  return qo2.get(t) || 1;
}
function Fo2(t) {
  if (t !== te3) throw new Error("invalid wNAF");
}
var kf = class {
  constructor(e2, n5) {
    this.BASE = e2.BASE, this.ZERO = e2.ZERO, this.Fn = e2.Fn, this.bits = n5;
  }
  _unsafeLadder(e2, n5, r3 = this.ZERO) {
    let o4 = e2;
    for (; n5 > te3; ) n5 & Ft2 && (r3 = r3.add(o4)), o4 = o4.double(), n5 >>= Ft2;
    return r3;
  }
  precomputeWindow(e2, n5) {
    const { windows: r3, windowSize: o4 } = Cn2(n5, this.bits), s2 = [];
    let i3 = e2, c5 = i3;
    for (let f4 = 0; f4 < r3; f4++) {
      c5 = i3, s2.push(c5);
      for (let u2 = 1; u2 < o4; u2++) c5 = c5.add(i3), s2.push(c5);
      i3 = c5.double();
    }
    return s2;
  }
  wNAF(e2, n5, r3) {
    if (!this.Fn.isValid(r3)) throw new Error("invalid scalar");
    let o4 = this.ZERO, s2 = this.BASE;
    const i3 = Cn2(e2, this.bits);
    for (let c5 = 0; c5 < i3.windows; c5++) {
      const { nextN: f4, offset: u2, isZero: a3, isNeg: l6, isNegF: d4, offsetF: h4 } = Ko2(r3, c5, i3);
      r3 = f4, a3 ? s2 = s2.add(qe2(d4, n5[h4])) : o4 = o4.add(qe2(l6, n5[u2]));
    }
    return Fo2(r3), { p: o4, f: s2 };
  }
  wNAFUnsafe(e2, n5, r3, o4 = this.ZERO) {
    const s2 = Cn2(e2, this.bits);
    for (let i3 = 0; i3 < s2.windows && r3 !== te3; i3++) {
      const { nextN: c5, offset: f4, isZero: u2, isNeg: a3 } = Ko2(r3, i3, s2);
      if (r3 = c5, !u2) {
        const l6 = n5[f4];
        o4 = o4.add(a3 ? l6.negate() : l6);
      }
    }
    return Fo2(r3), o4;
  }
  getPrecomputes(e2, n5, r3) {
    let o4 = jn2.get(n5);
    return o4 || (o4 = this.precomputeWindow(n5, e2), e2 !== 1 && (typeof r3 == "function" && (o4 = r3(o4)), jn2.set(n5, o4))), o4;
  }
  cached(e2, n5, r3) {
    const o4 = Ln2(e2);
    return this.wNAF(o4, this.getPrecomputes(o4, e2, r3), n5);
  }
  unsafe(e2, n5, r3, o4) {
    const s2 = Ln2(e2);
    return s2 === 1 ? this._unsafeLadder(e2, n5, o4) : this.wNAFUnsafe(s2, this.getPrecomputes(s2, e2, r3), n5, o4);
  }
  createCache(e2, n5) {
    Mo2(n5, this.bits), qo2.set(e2, n5), jn2.delete(e2);
  }
  hasCache(e2) {
    return Ln2(e2) !== 1;
  }
};
function Pf(t, e2, n5, r3) {
  let o4 = e2, s2 = t.ZERO, i3 = t.ZERO;
  for (; n5 > te3 || r3 > te3; ) n5 & Ft2 && (s2 = s2.add(o4)), r3 & Ft2 && (i3 = i3.add(o4)), o4 = o4.double(), n5 >>= Ft2, r3 >>= Ft2;
  return { p1: s2, p2: i3 };
}
function Hf(t, e2, n5, r3) {
  jf(n5, t), Lf(r3, e2);
  const o4 = n5.length, s2 = r3.length;
  if (o4 !== s2) throw new Error("arrays of points and scalars must have equal length");
  const i3 = t.ZERO, c5 = Oo2(BigInt(o4));
  let f4 = 1;
  c5 > 12 ? f4 = c5 - 3 : c5 > 4 ? f4 = c5 - 2 : c5 > 0 && (f4 = 2);
  const u2 = me3(f4), a3 = new Array(Number(u2) + 1).fill(i3), l6 = Math.floor((e2.BITS - 1) / f4) * f4;
  let d4 = i3;
  for (let h4 = l6; h4 >= 0; h4 -= f4) {
    a3.fill(i3);
    for (let m3 = 0; m3 < s2; m3++) {
      const w3 = r3[m3], U3 = Number(w3 >> BigInt(h4) & u2);
      a3[U3] = a3[U3].add(n5[m3]);
    }
    let y4 = i3;
    for (let m3 = a3.length - 1, w3 = i3; m3 > 0; m3--) w3 = w3.add(a3[m3]), y4 = y4.add(w3);
    if (d4 = d4.add(y4), h4 !== 0) for (let m3 = 0; m3 < f4; m3++) d4 = d4.double();
  }
  return d4;
}
function Zo2(t, e2, n5) {
  if (e2) {
    if (e2.ORDER !== t) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return $f(e2), e2;
  } else return Ht2(t, { isLE: n5 });
}
function Df(t, e2, n5 = {}, r3) {
  if (r3 === void 0 && (r3 = t === "edwards"), !e2 || typeof e2 != "object") throw new Error(`expected valid ${t} CURVE object`);
  for (const f4 of ["p", "n", "h"]) {
    const u2 = e2[f4];
    if (!(typeof u2 == "bigint" && u2 > te3)) throw new Error(`CURVE.${f4} must be positive bigint`);
  }
  const o4 = Zo2(e2.p, n5.Fp, r3), s2 = Zo2(e2.n, n5.Fn, r3), c5 = ["Gx", "Gy", "a", t === "weierstrass" ? "b" : "d"];
  for (const f4 of c5) if (!o4.isValid(e2[f4])) throw new Error(`CURVE.${f4} must be valid field element of CURVE.Fp`);
  return e2 = Object.freeze(Object.assign({}, e2)), { CURVE: e2, Fp: o4, Fn: s2 };
}
BigInt(0), BigInt(1), BigInt(2), BigInt(8), kr2("HashToScalar-");
var we3 = BigInt(0);
var ee2 = BigInt(1);
var Fe2 = BigInt(2);
function Vf(t) {
  return Ke2(t, { adjustScalarBytes: "function", powPminus2: "function" }), Object.freeze({ ...t });
}
function Mf(t) {
  const e2 = Vf(t), { P: n5, type: r3, adjustScalarBytes: o4, powPminus2: s2, randomBytes: i3 } = e2, c5 = r3 === "x25519";
  if (!c5 && r3 !== "x448") throw new Error("invalid type");
  const f4 = i3 || Mt2, u2 = c5 ? 255 : 448, a3 = c5 ? 32 : 56, l6 = BigInt(c5 ? 9 : 5), d4 = BigInt(c5 ? 121665 : 39081), h4 = c5 ? Fe2 ** BigInt(254) : Fe2 ** BigInt(447), y4 = c5 ? BigInt(8) * Fe2 ** BigInt(251) - ee2 : BigInt(4) * Fe2 ** BigInt(445) - ee2, m3 = h4 + y4 + ee2, w3 = (p3) => ct2(p3, n5), U3 = F(l6);
  function F(p3) {
    return Un2(w3(p3), a3);
  }
  function R4(p3) {
    const b5 = tt("u coordinate", p3, a3);
    return c5 && (b5[31] &= 127), w3(Me3(b5));
  }
  function Z2(p3) {
    return Me3(o4(tt("scalar", p3, a3)));
  }
  function H3(p3, b5) {
    const g2 = k4(R4(b5), Z2(p3));
    if (g2 === we3) throw new Error("invalid private or public key received");
    return F(g2);
  }
  function j6(p3) {
    return H3(p3, U3);
  }
  function L2(p3, b5, g2) {
    const x5 = w3(p3 * (b5 - g2));
    return b5 = w3(b5 - x5), g2 = w3(g2 + x5), { x_2: b5, x_3: g2 };
  }
  function k4(p3, b5) {
    Rn2("u", p3, we3, n5), Rn2("scalar", b5, h4, m3);
    const g2 = b5, x5 = p3;
    let E3 = ee2, I3 = we3, v5 = p3, B2 = ee2, A3 = we3;
    for (let D2 = BigInt(u2 - 1); D2 >= we3; D2--) {
      const P5 = g2 >> D2 & ee2;
      A3 ^= P5, { x_2: E3, x_3: v5 } = L2(A3, E3, v5), { x_2: I3, x_3: B2 } = L2(A3, I3, B2), A3 = P5;
      const $3 = E3 + I3, V4 = w3($3 * $3), q3 = E3 - I3, G4 = w3(q3 * q3), M4 = V4 - G4, Y3 = v5 + B2, Yt3 = v5 - B2, ce3 = w3(Yt3 * $3), fe4 = w3(Y3 * q3), Qn3 = ce3 + fe4, tr2 = ce3 - fe4;
      v5 = w3(Qn3 * Qn3), B2 = w3(x5 * w3(tr2 * tr2)), E3 = w3(V4 * G4), I3 = w3(M4 * (V4 + w3(d4 * M4)));
    }
    ({ x_2: E3, x_3: v5 } = L2(A3, E3, v5)), { x_2: I3, x_3: B2 } = L2(A3, I3, B2);
    const N12 = s2(I3);
    return w3(E3 * N12);
  }
  const O4 = { secretKey: a3, publicKey: a3, seed: a3 }, T3 = (p3 = f4(a3)) => (ht2(p3, O4.seed), p3);
  function C4(p3) {
    const b5 = T3(p3);
    return { secretKey: b5, publicKey: j6(b5) };
  }
  return { keygen: C4, getSharedSecret: (p3, b5) => H3(p3, b5), getPublicKey: (p3) => j6(p3), scalarMult: H3, scalarMultBase: j6, utils: { randomSecretKey: T3, randomPrivateKey: T3 }, GuBytes: U3.slice(), lengths: O4 };
}
var Kf = BigInt(1);
var Go2 = BigInt(2);
var qf = BigInt(3);
var Ff = BigInt(5);
var Zf = BigInt(8);
var zo2 = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
var Gf = { p: zo2, n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"), h: Zf, a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"), d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"), Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"), Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658") };
function zf(t) {
  const e2 = BigInt(10), n5 = BigInt(20), r3 = BigInt(40), o4 = BigInt(80), s2 = zo2, c5 = t * t % s2 * t % s2, f4 = gt2(c5, Go2, s2) * c5 % s2, u2 = gt2(f4, Kf, s2) * t % s2, a3 = gt2(u2, Ff, s2) * u2 % s2, l6 = gt2(a3, e2, s2) * a3 % s2, d4 = gt2(l6, n5, s2) * l6 % s2, h4 = gt2(d4, r3, s2) * d4 % s2, y4 = gt2(h4, o4, s2) * h4 % s2, m3 = gt2(y4, o4, s2) * h4 % s2, w3 = gt2(m3, e2, s2) * a3 % s2;
  return { pow_p_5_8: gt2(w3, Go2, s2) * t % s2, b2: c5 };
}
function Yf(t) {
  return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
var Wf = Ht2(Gf.p, { isLE: true });
var kn2 = (() => {
  const t = Wf.ORDER;
  return Mf({ P: t, type: "x25519", powPminus2: (e2) => {
    const { pow_p_5_8: n5, b2: r3 } = zf(e2);
    return ct2(gt2(n5, qf, t) * r3, t);
  }, adjustScalarBytes: Yf });
})();
var Yo2 = (t, e2) => (t + (t >= 0 ? e2 : -e2) / Wo2) / e2;
function Xf(t, e2, n5) {
  const [[r3, o4], [s2, i3]] = e2, c5 = Yo2(i3 * t, n5), f4 = Yo2(-o4 * t, n5);
  let u2 = t - c5 * r3 - f4 * s2, a3 = -c5 * o4 - f4 * i3;
  const l6 = u2 < Et2, d4 = a3 < Et2;
  l6 && (u2 = -u2), d4 && (a3 = -a3);
  const h4 = me3(Math.ceil(Oo2(n5) / 2)) + ne2;
  if (u2 < Et2 || u2 >= h4 || a3 < Et2 || a3 >= h4) throw new Error("splitScalar (endomorphism): failed, k=" + t);
  return { k1neg: l6, k1: u2, k2neg: d4, k2: a3 };
}
function Pn2(t) {
  if (!["compact", "recovered", "der"].includes(t)) throw new Error('Signature format must be "compact", "recovered", or "der"');
  return t;
}
function Hn2(t, e2) {
  const n5 = {};
  for (let r3 of Object.keys(e2)) n5[r3] = t[r3] === void 0 ? e2[r3] : t[r3];
  return He2(n5.lowS, "lowS"), He2(n5.prehash, "prehash"), n5.format !== void 0 && Pn2(n5.format), n5;
}
var Jf = class extends Error {
  constructor(e2 = "") {
    super(e2);
  }
};
var xt2 = { Err: Jf, _tlv: { encode: (t, e2) => {
  const { Err: n5 } = xt2;
  if (t < 0 || t > 256) throw new n5("tlv.encode: wrong tag");
  if (e2.length & 1) throw new n5("tlv.encode: unpadded data");
  const r3 = e2.length / 2, o4 = De3(r3);
  if (o4.length / 2 & 128) throw new n5("tlv.encode: long form length too big");
  const s2 = r3 > 127 ? De3(o4.length / 2 | 128) : "";
  return De3(t) + s2 + o4 + e2;
}, decode(t, e2) {
  const { Err: n5 } = xt2;
  let r3 = 0;
  if (t < 0 || t > 256) throw new n5("tlv.encode: wrong tag");
  if (e2.length < 2 || e2[r3++] !== t) throw new n5("tlv.decode: wrong tlv");
  const o4 = e2[r3++], s2 = !!(o4 & 128);
  let i3 = 0;
  if (!s2) i3 = o4;
  else {
    const f4 = o4 & 127;
    if (!f4) throw new n5("tlv.decode(long): indefinite length not supported");
    if (f4 > 4) throw new n5("tlv.decode(long): byte length is too big");
    const u2 = e2.subarray(r3, r3 + f4);
    if (u2.length !== f4) throw new n5("tlv.decode: length bytes not complete");
    if (u2[0] === 0) throw new n5("tlv.decode(long): zero leftmost byte");
    for (const a3 of u2) i3 = i3 << 8 | a3;
    if (r3 += f4, i3 < 128) throw new n5("tlv.decode(long): not minimal encoding");
  }
  const c5 = e2.subarray(r3, r3 + i3);
  if (c5.length !== i3) throw new n5("tlv.decode: wrong value length");
  return { v: c5, l: e2.subarray(r3 + i3) };
} }, _int: { encode(t) {
  const { Err: e2 } = xt2;
  if (t < Et2) throw new e2("integer: negative integers are not allowed");
  let n5 = De3(t);
  if (Number.parseInt(n5[0], 16) & 8 && (n5 = "00" + n5), n5.length & 1) throw new e2("unexpected DER parsing assertion: unpadded hex");
  return n5;
}, decode(t) {
  const { Err: e2 } = xt2;
  if (t[0] & 128) throw new e2("invalid signature integer: negative");
  if (t[0] === 0 && !(t[1] & 128)) throw new e2("invalid signature integer: unnecessary leading zero");
  return Ve3(t);
} }, toSig(t) {
  const { Err: e2, _int: n5, _tlv: r3 } = xt2, o4 = tt("signature", t), { v: s2, l: i3 } = r3.decode(48, o4);
  if (i3.length) throw new e2("invalid signature: left bytes after parsing");
  const { v: c5, l: f4 } = r3.decode(2, s2), { v: u2, l: a3 } = r3.decode(2, f4);
  if (a3.length) throw new e2("invalid signature: left bytes after parsing");
  return { r: n5.decode(c5), s: n5.decode(u2) };
}, hexFromSig(t) {
  const { _tlv: e2, _int: n5 } = xt2, r3 = e2.encode(2, n5.encode(t.r)), o4 = e2.encode(2, n5.encode(t.s)), s2 = r3 + o4;
  return e2.encode(48, s2);
} };
var Et2 = BigInt(0);
var ne2 = BigInt(1);
var Wo2 = BigInt(2);
var Ze2 = BigInt(3);
var Qf = BigInt(4);
function re2(t, e2) {
  const { BYTES: n5 } = t;
  let r3;
  if (typeof e2 == "bigint") r3 = e2;
  else {
    let o4 = tt("private key", e2);
    try {
      r3 = t.fromBytes(o4);
    } catch {
      throw new Error(`invalid private key: expected ui8a of size ${n5}, got ${typeof e2}`);
    }
  }
  if (!t.isValidNot0(r3)) throw new Error("invalid private key: out of range [1..N-1]");
  return r3;
}
function ta(t, e2 = {}) {
  const n5 = Df("weierstrass", t, e2), { Fp: r3, Fn: o4 } = n5;
  let s2 = n5.CURVE;
  const { h: i3, n: c5 } = s2;
  Ke2(e2, {}, { allowInfinityPoint: "boolean", clearCofactor: "function", isTorsionFree: "function", fromBytes: "function", toBytes: "function", endo: "object", wrapPrivateKey: "boolean" });
  const { endo: f4 } = e2;
  if (f4 && (!r3.is0(s2.a) || typeof f4.beta != "bigint" || !Array.isArray(f4.basises))) throw new Error('invalid endo: expected "beta": bigint and "basises": array');
  const u2 = Jo2(r3, o4);
  function a3() {
    if (!r3.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function l6(_3, p3, b5) {
    const { x: g2, y: x5 } = p3.toAffine(), E3 = r3.toBytes(g2);
    if (He2(b5, "isCompressed"), b5) {
      a3();
      const I3 = !r3.isOdd(x5);
      return _t2(Xo(I3), E3);
    } else return _t2(Uint8Array.of(4), E3, r3.toBytes(x5));
  }
  function d4(_3) {
    Kt2(_3, void 0, "Point");
    const { publicKey: p3, publicKeyUncompressed: b5 } = u2, g2 = _3.length, x5 = _3[0], E3 = _3.subarray(1);
    if (g2 === p3 && (x5 === 2 || x5 === 3)) {
      const I3 = r3.fromBytes(E3);
      if (!r3.isValid(I3)) throw new Error("bad point: is not on curve, wrong x");
      const v5 = m3(I3);
      let B2;
      try {
        B2 = r3.sqrt(v5);
      } catch (D2) {
        const P5 = D2 instanceof Error ? ": " + D2.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + P5);
      }
      a3();
      const A3 = r3.isOdd(B2);
      return (x5 & 1) === 1 !== A3 && (B2 = r3.neg(B2)), { x: I3, y: B2 };
    } else if (g2 === b5 && x5 === 4) {
      const I3 = r3.BYTES, v5 = r3.fromBytes(E3.subarray(0, I3)), B2 = r3.fromBytes(E3.subarray(I3, I3 * 2));
      if (!w3(v5, B2)) throw new Error("bad point: is not on curve");
      return { x: v5, y: B2 };
    } else throw new Error(`bad point: got length ${g2}, expected compressed=${p3} or uncompressed=${b5}`);
  }
  const h4 = e2.toBytes || l6, y4 = e2.fromBytes || d4;
  function m3(_3) {
    const p3 = r3.sqr(_3), b5 = r3.mul(p3, _3);
    return r3.add(r3.add(b5, r3.mul(_3, s2.a)), s2.b);
  }
  function w3(_3, p3) {
    const b5 = r3.sqr(p3), g2 = m3(_3);
    return r3.eql(b5, g2);
  }
  if (!w3(s2.Gx, s2.Gy)) throw new Error("bad curve params: generator point");
  const U3 = r3.mul(r3.pow(s2.a, Ze2), Qf), F = r3.mul(r3.sqr(s2.b), BigInt(27));
  if (r3.is0(r3.add(U3, F))) throw new Error("bad curve params: a or b");
  function R4(_3, p3, b5 = false) {
    if (!r3.isValid(p3) || b5 && r3.is0(p3)) throw new Error(`bad point coordinate ${_3}`);
    return p3;
  }
  function Z2(_3) {
    if (!(_3 instanceof O4)) throw new Error("ProjectivePoint expected");
  }
  function H3(_3) {
    if (!f4 || !f4.basises) throw new Error("no endo");
    return Xf(_3, f4.basises, o4.ORDER);
  }
  const j6 = No2((_3, p3) => {
    const { X: b5, Y: g2, Z: x5 } = _3;
    if (r3.eql(x5, r3.ONE)) return { x: b5, y: g2 };
    const E3 = _3.is0();
    p3 == null && (p3 = E3 ? r3.ONE : r3.inv(x5));
    const I3 = r3.mul(b5, p3), v5 = r3.mul(g2, p3), B2 = r3.mul(x5, p3);
    if (E3) return { x: r3.ZERO, y: r3.ZERO };
    if (!r3.eql(B2, r3.ONE)) throw new Error("invZ was invalid");
    return { x: I3, y: v5 };
  }), L2 = No2((_3) => {
    if (_3.is0()) {
      if (e2.allowInfinityPoint && !r3.is0(_3.Y)) return;
      throw new Error("bad point: ZERO");
    }
    const { x: p3, y: b5 } = _3.toAffine();
    if (!r3.isValid(p3) || !r3.isValid(b5)) throw new Error("bad point: x or y not field elements");
    if (!w3(p3, b5)) throw new Error("bad point: equation left != right");
    if (!_3.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function k4(_3, p3, b5, g2, x5) {
    return b5 = new O4(r3.mul(b5.X, _3), b5.Y, b5.Z), p3 = qe2(g2, p3), b5 = qe2(x5, b5), p3.add(b5);
  }
  class O4 {
    constructor(p3, b5, g2) {
      this.X = R4("x", p3), this.Y = R4("y", b5, true), this.Z = R4("z", g2), Object.freeze(this);
    }
    static CURVE() {
      return s2;
    }
    static fromAffine(p3) {
      const { x: b5, y: g2 } = p3 || {};
      if (!p3 || !r3.isValid(b5) || !r3.isValid(g2)) throw new Error("invalid affine point");
      if (p3 instanceof O4) throw new Error("projective point not allowed");
      return r3.is0(b5) && r3.is0(g2) ? O4.ZERO : new O4(b5, g2, r3.ONE);
    }
    static fromBytes(p3) {
      const b5 = O4.fromAffine(y4(Kt2(p3, void 0, "point")));
      return b5.assertValidity(), b5;
    }
    static fromHex(p3) {
      return O4.fromBytes(tt("pointHex", p3));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(p3 = 8, b5 = true) {
      return C4.createCache(this, p3), b5 || this.multiply(Ze2), this;
    }
    assertValidity() {
      L2(this);
    }
    hasEvenY() {
      const { y: p3 } = this.toAffine();
      if (!r3.isOdd) throw new Error("Field doesn't support isOdd");
      return !r3.isOdd(p3);
    }
    equals(p3) {
      Z2(p3);
      const { X: b5, Y: g2, Z: x5 } = this, { X: E3, Y: I3, Z: v5 } = p3, B2 = r3.eql(r3.mul(b5, v5), r3.mul(E3, x5)), A3 = r3.eql(r3.mul(g2, v5), r3.mul(I3, x5));
      return B2 && A3;
    }
    negate() {
      return new O4(this.X, r3.neg(this.Y), this.Z);
    }
    double() {
      const { a: p3, b: b5 } = s2, g2 = r3.mul(b5, Ze2), { X: x5, Y: E3, Z: I3 } = this;
      let v5 = r3.ZERO, B2 = r3.ZERO, A3 = r3.ZERO, N12 = r3.mul(x5, x5), D2 = r3.mul(E3, E3), P5 = r3.mul(I3, I3), $3 = r3.mul(x5, E3);
      return $3 = r3.add($3, $3), A3 = r3.mul(x5, I3), A3 = r3.add(A3, A3), v5 = r3.mul(p3, A3), B2 = r3.mul(g2, P5), B2 = r3.add(v5, B2), v5 = r3.sub(D2, B2), B2 = r3.add(D2, B2), B2 = r3.mul(v5, B2), v5 = r3.mul($3, v5), A3 = r3.mul(g2, A3), P5 = r3.mul(p3, P5), $3 = r3.sub(N12, P5), $3 = r3.mul(p3, $3), $3 = r3.add($3, A3), A3 = r3.add(N12, N12), N12 = r3.add(A3, N12), N12 = r3.add(N12, P5), N12 = r3.mul(N12, $3), B2 = r3.add(B2, N12), P5 = r3.mul(E3, I3), P5 = r3.add(P5, P5), N12 = r3.mul(P5, $3), v5 = r3.sub(v5, N12), A3 = r3.mul(P5, D2), A3 = r3.add(A3, A3), A3 = r3.add(A3, A3), new O4(v5, B2, A3);
    }
    add(p3) {
      Z2(p3);
      const { X: b5, Y: g2, Z: x5 } = this, { X: E3, Y: I3, Z: v5 } = p3;
      let B2 = r3.ZERO, A3 = r3.ZERO, N12 = r3.ZERO;
      const D2 = s2.a, P5 = r3.mul(s2.b, Ze2);
      let $3 = r3.mul(b5, E3), V4 = r3.mul(g2, I3), q3 = r3.mul(x5, v5), G4 = r3.add(b5, g2), M4 = r3.add(E3, I3);
      G4 = r3.mul(G4, M4), M4 = r3.add($3, V4), G4 = r3.sub(G4, M4), M4 = r3.add(b5, x5);
      let Y3 = r3.add(E3, v5);
      return M4 = r3.mul(M4, Y3), Y3 = r3.add($3, q3), M4 = r3.sub(M4, Y3), Y3 = r3.add(g2, x5), B2 = r3.add(I3, v5), Y3 = r3.mul(Y3, B2), B2 = r3.add(V4, q3), Y3 = r3.sub(Y3, B2), N12 = r3.mul(D2, M4), B2 = r3.mul(P5, q3), N12 = r3.add(B2, N12), B2 = r3.sub(V4, N12), N12 = r3.add(V4, N12), A3 = r3.mul(B2, N12), V4 = r3.add($3, $3), V4 = r3.add(V4, $3), q3 = r3.mul(D2, q3), M4 = r3.mul(P5, M4), V4 = r3.add(V4, q3), q3 = r3.sub($3, q3), q3 = r3.mul(D2, q3), M4 = r3.add(M4, q3), $3 = r3.mul(V4, M4), A3 = r3.add(A3, $3), $3 = r3.mul(Y3, M4), B2 = r3.mul(G4, B2), B2 = r3.sub(B2, $3), $3 = r3.mul(G4, V4), N12 = r3.mul(Y3, N12), N12 = r3.add(N12, $3), new O4(B2, A3, N12);
    }
    subtract(p3) {
      return this.add(p3.negate());
    }
    is0() {
      return this.equals(O4.ZERO);
    }
    multiply(p3) {
      const { endo: b5 } = e2;
      if (!o4.isValidNot0(p3)) throw new Error("invalid scalar: out of range");
      let g2, x5;
      const E3 = (I3) => C4.cached(this, I3, (v5) => Tn2(O4, v5));
      if (b5) {
        const { k1neg: I3, k1: v5, k2neg: B2, k2: A3 } = H3(p3), { p: N12, f: D2 } = E3(v5), { p: P5, f: $3 } = E3(A3);
        x5 = D2.add($3), g2 = k4(b5.beta, N12, P5, I3, B2);
      } else {
        const { p: I3, f: v5 } = E3(p3);
        g2 = I3, x5 = v5;
      }
      return Tn2(O4, [g2, x5])[0];
    }
    multiplyUnsafe(p3) {
      const { endo: b5 } = e2, g2 = this;
      if (!o4.isValid(p3)) throw new Error("invalid scalar: out of range");
      if (p3 === Et2 || g2.is0()) return O4.ZERO;
      if (p3 === ne2) return g2;
      if (C4.hasCache(this)) return this.multiply(p3);
      if (b5) {
        const { k1neg: x5, k1: E3, k2neg: I3, k2: v5 } = H3(p3), { p1: B2, p2: A3 } = Pf(O4, g2, E3, v5);
        return k4(b5.beta, B2, A3, x5, I3);
      } else return C4.unsafe(g2, p3);
    }
    multiplyAndAddUnsafe(p3, b5, g2) {
      const x5 = this.multiplyUnsafe(b5).add(p3.multiplyUnsafe(g2));
      return x5.is0() ? void 0 : x5;
    }
    toAffine(p3) {
      return j6(this, p3);
    }
    isTorsionFree() {
      const { isTorsionFree: p3 } = e2;
      return i3 === ne2 ? true : p3 ? p3(O4, this) : C4.unsafe(this, c5).is0();
    }
    clearCofactor() {
      const { clearCofactor: p3 } = e2;
      return i3 === ne2 ? this : p3 ? p3(O4, this) : this.multiplyUnsafe(i3);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(i3).is0();
    }
    toBytes(p3 = true) {
      return He2(p3, "isCompressed"), this.assertValidity(), h4(O4, this, p3);
    }
    toHex(p3 = true) {
      return Jt2(this.toBytes(p3));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
    get px() {
      return this.X;
    }
    get py() {
      return this.X;
    }
    get pz() {
      return this.Z;
    }
    toRawBytes(p3 = true) {
      return this.toBytes(p3);
    }
    _setWindowSize(p3) {
      this.precompute(p3);
    }
    static normalizeZ(p3) {
      return Tn2(O4, p3);
    }
    static msm(p3, b5) {
      return Hf(O4, o4, p3, b5);
    }
    static fromPrivateKey(p3) {
      return O4.BASE.multiply(re2(o4, p3));
    }
  }
  O4.BASE = new O4(s2.Gx, s2.Gy, r3.ONE), O4.ZERO = new O4(r3.ZERO, r3.ONE, r3.ZERO), O4.Fp = r3, O4.Fn = o4;
  const T3 = o4.BITS, C4 = new kf(O4, e2.endo ? Math.ceil(T3 / 2) : T3);
  return O4.BASE.precompute(8), O4;
}
function Xo(t) {
  return Uint8Array.of(t ? 2 : 3);
}
function Jo2(t, e2) {
  return { secretKey: e2.BYTES, publicKey: 1 + t.BYTES, publicKeyUncompressed: 1 + 2 * t.BYTES, publicKeyHasPrefix: true, signature: 2 * e2.BYTES };
}
function ea(t, e2 = {}) {
  const { Fn: n5 } = t, r3 = e2.randomBytes || Mt2, o4 = Object.assign(Jo2(t.Fp, n5), { seed: Vo2(n5.ORDER) });
  function s2(h4) {
    try {
      return !!re2(n5, h4);
    } catch {
      return false;
    }
  }
  function i3(h4, y4) {
    const { publicKey: m3, publicKeyUncompressed: w3 } = o4;
    try {
      const U3 = h4.length;
      return y4 === true && U3 !== m3 || y4 === false && U3 !== w3 ? false : !!t.fromBytes(h4);
    } catch {
      return false;
    }
  }
  function c5(h4 = r3(o4.seed)) {
    return Cf(Kt2(h4, o4.seed, "seed"), n5.ORDER);
  }
  function f4(h4, y4 = true) {
    return t.BASE.multiply(re2(n5, h4)).toBytes(y4);
  }
  function u2(h4) {
    const y4 = c5(h4);
    return { secretKey: y4, publicKey: f4(y4) };
  }
  function a3(h4) {
    if (typeof h4 == "bigint") return false;
    if (h4 instanceof t) return true;
    const { secretKey: y4, publicKey: m3, publicKeyUncompressed: w3 } = o4;
    if (n5.allowedLengths || y4 === m3) return;
    const U3 = tt("key", h4).length;
    return U3 === m3 || U3 === w3;
  }
  function l6(h4, y4, m3 = true) {
    if (a3(h4) === true) throw new Error("first arg must be private key");
    if (a3(y4) === false) throw new Error("second arg must be public key");
    const w3 = re2(n5, h4);
    return t.fromHex(y4).multiply(w3).toBytes(m3);
  }
  return Object.freeze({ getPublicKey: f4, getSharedSecret: l6, keygen: u2, Point: t, utils: { isValidSecretKey: s2, isValidPublicKey: i3, randomSecretKey: c5, isValidPrivateKey: s2, randomPrivateKey: c5, normPrivateKeyToScalar: (h4) => re2(n5, h4), precompute(h4 = 8, y4 = t.BASE) {
    return y4.precompute(h4, false);
  } }, lengths: o4 });
}
function na(t, e2, n5 = {}) {
  _e3(e2), Ke2(n5, {}, { hmac: "function", lowS: "boolean", randomBytes: "function", bits2int: "function", bits2int_modN: "function" });
  const r3 = n5.randomBytes || Mt2, o4 = n5.hmac || ((b5, ...g2) => ke3(e2, b5, _t2(...g2))), { Fp: s2, Fn: i3 } = t, { ORDER: c5, BITS: f4 } = i3, { keygen: u2, getPublicKey: a3, getSharedSecret: l6, utils: d4, lengths: h4 } = ea(t, n5), y4 = { prehash: false, lowS: typeof n5.lowS == "boolean" ? n5.lowS : false, format: void 0, extraEntropy: false }, m3 = "compact";
  function w3(b5) {
    const g2 = c5 >> ne2;
    return b5 > g2;
  }
  function U3(b5, g2) {
    if (!i3.isValidNot0(g2)) throw new Error(`invalid signature ${b5}: out of range 1..Point.Fn.ORDER`);
    return g2;
  }
  function F(b5, g2) {
    Pn2(g2);
    const x5 = h4.signature, E3 = g2 === "compact" ? x5 : g2 === "recovered" ? x5 + 1 : void 0;
    return Kt2(b5, E3, `${g2} signature`);
  }
  class R4 {
    constructor(g2, x5, E3) {
      this.r = U3("r", g2), this.s = U3("s", x5), E3 != null && (this.recovery = E3), Object.freeze(this);
    }
    static fromBytes(g2, x5 = m3) {
      F(g2, x5);
      let E3;
      if (x5 === "der") {
        const { r: A3, s: N12 } = xt2.toSig(Kt2(g2));
        return new R4(A3, N12);
      }
      x5 === "recovered" && (E3 = g2[0], x5 = "compact", g2 = g2.subarray(1));
      const I3 = i3.BYTES, v5 = g2.subarray(0, I3), B2 = g2.subarray(I3, I3 * 2);
      return new R4(i3.fromBytes(v5), i3.fromBytes(B2), E3);
    }
    static fromHex(g2, x5) {
      return this.fromBytes(Re3(g2), x5);
    }
    addRecoveryBit(g2) {
      return new R4(this.r, this.s, g2);
    }
    recoverPublicKey(g2) {
      const x5 = s2.ORDER, { r: E3, s: I3, recovery: v5 } = this;
      if (v5 == null || ![0, 1, 2, 3].includes(v5)) throw new Error("recovery id invalid");
      if (c5 * Wo2 < x5 && v5 > 1) throw new Error("recovery id is ambiguous for h>1 curve");
      const A3 = v5 === 2 || v5 === 3 ? E3 + c5 : E3;
      if (!s2.isValid(A3)) throw new Error("recovery id 2 or 3 invalid");
      const N12 = s2.toBytes(A3), D2 = t.fromBytes(_t2(Xo((v5 & 1) === 0), N12)), P5 = i3.inv(A3), $3 = H3(tt("msgHash", g2)), V4 = i3.create(-$3 * P5), q3 = i3.create(I3 * P5), G4 = t.BASE.multiplyUnsafe(V4).add(D2.multiplyUnsafe(q3));
      if (G4.is0()) throw new Error("point at infinify");
      return G4.assertValidity(), G4;
    }
    hasHighS() {
      return w3(this.s);
    }
    toBytes(g2 = m3) {
      if (Pn2(g2), g2 === "der") return Re3(xt2.hexFromSig(this));
      const x5 = i3.toBytes(this.r), E3 = i3.toBytes(this.s);
      if (g2 === "recovered") {
        if (this.recovery == null) throw new Error("recovery bit must be present");
        return _t2(Uint8Array.of(this.recovery), x5, E3);
      }
      return _t2(x5, E3);
    }
    toHex(g2) {
      return Jt2(this.toBytes(g2));
    }
    assertValidity() {
    }
    static fromCompact(g2) {
      return R4.fromBytes(tt("sig", g2), "compact");
    }
    static fromDER(g2) {
      return R4.fromBytes(tt("sig", g2), "der");
    }
    normalizeS() {
      return this.hasHighS() ? new R4(this.r, i3.neg(this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return this.toBytes("der");
    }
    toDERHex() {
      return Jt2(this.toBytes("der"));
    }
    toCompactRawBytes() {
      return this.toBytes("compact");
    }
    toCompactHex() {
      return Jt2(this.toBytes("compact"));
    }
  }
  const Z2 = n5.bits2int || function(g2) {
    if (g2.length > 8192) throw new Error("input is too large");
    const x5 = Ve3(g2), E3 = g2.length * 8 - f4;
    return E3 > 0 ? x5 >> BigInt(E3) : x5;
  }, H3 = n5.bits2int_modN || function(g2) {
    return i3.create(Z2(g2));
  }, j6 = me3(f4);
  function L2(b5) {
    return Rn2("num < 2^" + f4, b5, Et2, j6), i3.toBytes(b5);
  }
  function k4(b5, g2) {
    return Kt2(b5, void 0, "message"), g2 ? Kt2(e2(b5), void 0, "prehashed message") : b5;
  }
  function O4(b5, g2, x5) {
    if (["recovered", "canonical"].some((V4) => V4 in x5)) throw new Error("sign() legacy options not supported");
    const { lowS: E3, prehash: I3, extraEntropy: v5 } = Hn2(x5, y4);
    b5 = k4(b5, I3);
    const B2 = H3(b5), A3 = re2(i3, g2), N12 = [L2(A3), L2(B2)];
    if (v5 != null && v5 !== false) {
      const V4 = v5 === true ? r3(h4.secretKey) : v5;
      N12.push(tt("extraEntropy", V4));
    }
    const D2 = _t2(...N12), P5 = B2;
    function $3(V4) {
      const q3 = Z2(V4);
      if (!i3.isValidNot0(q3)) return;
      const G4 = i3.inv(q3), M4 = t.BASE.multiply(q3).toAffine(), Y3 = i3.create(M4.x);
      if (Y3 === Et2) return;
      const Yt3 = i3.create(G4 * i3.create(P5 + Y3 * A3));
      if (Yt3 === Et2) return;
      let ce3 = (M4.x === Y3 ? 0 : 2) | Number(M4.y & ne2), fe4 = Yt3;
      return E3 && w3(Yt3) && (fe4 = i3.neg(Yt3), ce3 ^= 1), new R4(Y3, fe4, ce3);
    }
    return { seed: D2, k2sig: $3 };
  }
  function T3(b5, g2, x5 = {}) {
    b5 = tt("message", b5);
    const { seed: E3, k2sig: I3 } = O4(b5, g2, x5);
    return Af(e2.outputLen, i3.BYTES, o4)(E3, I3);
  }
  function C4(b5) {
    let g2;
    const x5 = typeof b5 == "string" || Ue3(b5), E3 = !x5 && b5 !== null && typeof b5 == "object" && typeof b5.r == "bigint" && typeof b5.s == "bigint";
    if (!x5 && !E3) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    if (E3) g2 = new R4(b5.r, b5.s);
    else if (x5) {
      try {
        g2 = R4.fromBytes(tt("sig", b5), "der");
      } catch (I3) {
        if (!(I3 instanceof xt2.Err)) throw I3;
      }
      if (!g2) try {
        g2 = R4.fromBytes(tt("sig", b5), "compact");
      } catch {
        return false;
      }
    }
    return g2 || false;
  }
  function _3(b5, g2, x5, E3 = {}) {
    const { lowS: I3, prehash: v5, format: B2 } = Hn2(E3, y4);
    if (x5 = tt("publicKey", x5), g2 = k4(tt("message", g2), v5), "strict" in E3) throw new Error("options.strict was renamed to lowS");
    const A3 = B2 === void 0 ? C4(b5) : R4.fromBytes(tt("sig", b5), B2);
    if (A3 === false) return false;
    try {
      const N12 = t.fromBytes(x5);
      if (I3 && A3.hasHighS()) return false;
      const { r: D2, s: P5 } = A3, $3 = H3(g2), V4 = i3.inv(P5), q3 = i3.create($3 * V4), G4 = i3.create(D2 * V4), M4 = t.BASE.multiplyUnsafe(q3).add(N12.multiplyUnsafe(G4));
      return M4.is0() ? false : i3.create(M4.x) === D2;
    } catch {
      return false;
    }
  }
  function p3(b5, g2, x5 = {}) {
    const { prehash: E3 } = Hn2(x5, y4);
    return g2 = k4(g2, E3), R4.fromBytes(b5, "recovered").recoverPublicKey(g2).toBytes();
  }
  return Object.freeze({ keygen: u2, getPublicKey: a3, getSharedSecret: l6, utils: d4, lengths: h4, Point: t, sign: T3, verify: _3, recoverPublicKey: p3, Signature: R4, hash: e2 });
}
function ra(t) {
  const e2 = { a: t.a, b: t.b, p: t.Fp.ORDER, n: t.n, h: t.h, Gx: t.Gx, Gy: t.Gy }, n5 = t.Fp;
  let r3 = t.allowedPrivateKeyLengths ? Array.from(new Set(t.allowedPrivateKeyLengths.map((i3) => Math.ceil(i3 / 2)))) : void 0;
  const o4 = Ht2(e2.n, { BITS: t.nBitLength, allowedLengths: r3, modFromBytes: t.wrapPrivateKey }), s2 = { Fp: n5, Fn: o4, allowInfinityPoint: t.allowInfinityPoint, endo: t.endo, isTorsionFree: t.isTorsionFree, clearCofactor: t.clearCofactor, fromBytes: t.fromBytes, toBytes: t.toBytes };
  return { CURVE: e2, curveOpts: s2 };
}
function oa(t) {
  const { CURVE: e2, curveOpts: n5 } = ra(t), r3 = { hmac: t.hmac, randomBytes: t.randomBytes, lowS: t.lowS, bits2int: t.bits2int, bits2int_modN: t.bits2int_modN };
  return { CURVE: e2, curveOpts: n5, hash: t.hash, ecdsaOpts: r3 };
}
function sa(t, e2) {
  const n5 = e2.Point;
  return Object.assign({}, e2, { ProjectivePoint: n5, CURVE: Object.assign({}, t, Ho2(n5.Fn.ORDER, n5.Fn.BITS)) });
}
function ia(t) {
  const { CURVE: e2, curveOpts: n5, hash: r3, ecdsaOpts: o4 } = oa(t), s2 = ta(e2, n5), i3 = na(s2, r3, o4);
  return sa(t, i3);
}
function Dn(t, e2) {
  const n5 = (r3) => ia({ ...t, hash: r3 });
  return { ...n5(e2), create: n5 };
}
var Qo2 = { p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"), n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"), h: BigInt(1), a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"), b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"), Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"), Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5") };
var ts = { p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"), n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"), h: BigInt(1), a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"), b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"), Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"), Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f") };
var es = { p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"), h: BigInt(1), a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"), b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"), Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"), Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650") };
var ca = Ht2(Qo2.p);
var fa = Ht2(ts.p);
var aa = Ht2(es.p);
var ua = Dn({ ...Qo2, Fp: ca, lowS: false }, Te3);
Dn({ ...ts, Fp: fa, lowS: false }, wc), Dn({ ...es, Fp: aa, lowS: false, allowedPrivateKeyLengths: [130, 131, 132] }, mc);
var la = ua;
var Vn2 = "base10";
var rt2 = "base16";
var oe2 = "base64pad";
var Ge3 = "base64url";
var se2 = "utf8";
var Mn2 = 0;
var ie2 = 1;
var ve3 = 2;
var da = 0;
var ns = 1;
var xe3 = 12;
var Kn2 = 32;
function ha() {
  const t = kn2.utils.randomPrivateKey(), e2 = kn2.getPublicKey(t);
  return { privateKey: toString2(t, rt2), publicKey: toString2(e2, rt2) };
}
function pa() {
  const t = Mt2(Kn2);
  return toString2(t, rt2);
}
function ga(t, e2) {
  const n5 = kn2.getSharedSecret(fromString3(t, rt2), fromString3(e2, rt2)), r3 = Bf(Pe3, n5, void 0, void 0, Kn2);
  return toString2(r3, rt2);
}
function ba(t) {
  const e2 = Pe3(fromString3(t, rt2));
  return toString2(e2, rt2);
}
function ya(t) {
  const e2 = Pe3(fromString3(t, se2));
  return toString2(e2, rt2);
}
function qn2(t) {
  return fromString3(`${t}`, Vn2);
}
function Zt2(t) {
  return Number(toString2(t, Vn2));
}
function rs(t) {
  return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function os(t) {
  const e2 = t.replace(/-/g, "+").replace(/_/g, "/"), n5 = (4 - e2.length % 4) % 4;
  return e2 + "=".repeat(n5);
}
function ma(t) {
  const e2 = qn2(typeof t.type < "u" ? t.type : Mn2);
  if (Zt2(e2) === ie2 && typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
  const n5 = typeof t.senderPublicKey < "u" ? fromString3(t.senderPublicKey, rt2) : void 0, r3 = typeof t.iv < "u" ? fromString3(t.iv, rt2) : Mt2(xe3), o4 = fromString3(t.symKey, rt2), s2 = Bo2(o4, r3).encrypt(fromString3(t.message, se2)), i3 = Fn2({ type: e2, sealed: s2, iv: r3, senderPublicKey: n5 });
  return t.encoding === Ge3 ? rs(i3) : i3;
}
function wa(t) {
  const e2 = fromString3(t.symKey, rt2), { sealed: n5, iv: r3 } = ze3({ encoded: t.encoded, encoding: t.encoding }), o4 = Bo2(e2, r3).decrypt(n5);
  if (o4 === null) throw new Error("Failed to decrypt");
  return toString2(o4, se2);
}
function va(t, e2) {
  const n5 = qn2(ve3), r3 = Mt2(xe3), o4 = fromString3(t, se2), s2 = Fn2({ type: n5, sealed: o4, iv: r3 });
  return e2 === Ge3 ? rs(s2) : s2;
}
function xa(t, e2) {
  const { sealed: n5 } = ze3({ encoded: t, encoding: e2 });
  return toString2(n5, se2);
}
function Fn2(t) {
  if (Zt2(t.type) === ve3) return toString2(concat2([t.type, t.sealed]), oe2);
  if (Zt2(t.type) === ie2) {
    if (typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
    return toString2(concat2([t.type, t.senderPublicKey, t.iv, t.sealed]), oe2);
  }
  return toString2(concat2([t.type, t.iv, t.sealed]), oe2);
}
function ze3(t) {
  const e2 = (t.encoding || oe2) === Ge3 ? os(t.encoded) : t.encoded, n5 = fromString3(e2, oe2), r3 = n5.slice(da, ns), o4 = ns;
  if (Zt2(r3) === ie2) {
    const f4 = o4 + Kn2, u2 = f4 + xe3, a3 = n5.slice(o4, f4), l6 = n5.slice(f4, u2), d4 = n5.slice(u2);
    return { type: r3, sealed: d4, iv: l6, senderPublicKey: a3 };
  }
  if (Zt2(r3) === ve3) {
    const f4 = n5.slice(o4), u2 = Mt2(xe3);
    return { type: r3, sealed: f4, iv: u2 };
  }
  const s2 = o4 + xe3, i3 = n5.slice(o4, s2), c5 = n5.slice(s2);
  return { type: r3, sealed: c5, iv: i3 };
}
function Ea(t, e2) {
  const n5 = ze3({ encoded: t, encoding: e2?.encoding });
  return ss({ type: Zt2(n5.type), senderPublicKey: typeof n5.senderPublicKey < "u" ? toString2(n5.senderPublicKey, rt2) : void 0, receiverPublicKey: e2?.receiverPublicKey });
}
function ss(t) {
  const e2 = t?.type || Mn2;
  if (e2 === ie2) {
    if (typeof t?.senderPublicKey > "u") throw new Error("missing sender public key");
    if (typeof t?.receiverPublicKey > "u") throw new Error("missing receiver public key");
  }
  return { type: e2, senderPublicKey: t?.senderPublicKey, receiverPublicKey: t?.receiverPublicKey };
}
function Ba(t) {
  return t.type === ie2 && typeof t.senderPublicKey == "string" && typeof t.receiverPublicKey == "string";
}
function Ia(t) {
  return t.type === ve3;
}
function is(t) {
  const e2 = Buffer.from(t.x, "base64"), n5 = Buffer.from(t.y, "base64");
  return concat2([new Uint8Array([4]), e2, n5]);
}
function Aa(t, e2) {
  const [n5, r3, o4] = t.split("."), s2 = Buffer.from(os(o4), "base64");
  if (s2.length !== 64) throw new Error("Invalid signature length");
  const i3 = s2.slice(0, 32), c5 = s2.slice(32, 64), f4 = `${n5}.${r3}`, u2 = Pe3(f4), a3 = is(e2);
  if (!la.verify(concat2([i3, c5]), u2, a3)) throw new Error("Invalid signature");
  return sn(t).payload;
}
var cs = "irn";
function Sa(t) {
  return t?.relay || { protocol: cs };
}
function Oa(t) {
  const e2 = C2[t];
  if (typeof e2 > "u") throw new Error(`Relay Protocol not supported: ${t}`);
  return e2;
}
var Na = Object.defineProperty;
var Ua = Object.defineProperties;
var _a = Object.getOwnPropertyDescriptors;
var fs = Object.getOwnPropertySymbols;
var Ra = Object.prototype.hasOwnProperty;
var $a = Object.prototype.propertyIsEnumerable;
var as = (t, e2, n5) => e2 in t ? Na(t, e2, { enumerable: true, configurable: true, writable: true, value: n5 }) : t[e2] = n5;
var Zn2 = (t, e2) => {
  for (var n5 in e2 || (e2 = {})) Ra.call(e2, n5) && as(t, n5, e2[n5]);
  if (fs) for (var n5 of fs(e2)) $a.call(e2, n5) && as(t, n5, e2[n5]);
  return t;
};
var Ta = (t, e2) => Ua(t, _a(e2));
function us(t, e2 = "-") {
  const n5 = {}, r3 = "relay" + e2;
  return Object.keys(t).forEach((o4) => {
    if (o4.startsWith(r3)) {
      const s2 = o4.replace(r3, ""), i3 = t[o4];
      n5[s2] = i3;
    }
  }), n5;
}
function Ca(t) {
  if (!t.includes("wc:")) {
    const u2 = cn(t);
    u2 != null && u2.includes("wc:") && (t = u2);
  }
  t = t.includes("wc://") ? t.replace("wc://", "") : t, t = t.includes("wc:") ? t.replace("wc:", "") : t;
  const e2 = t.indexOf(":"), n5 = t.indexOf("?") !== -1 ? t.indexOf("?") : void 0, r3 = t.substring(0, e2), o4 = t.substring(e2 + 1, n5).split("@"), s2 = typeof n5 < "u" ? t.substring(n5) : "", i3 = new URLSearchParams(s2), c5 = Object.fromEntries(i3.entries()), f4 = typeof c5.methods == "string" ? c5.methods.split(",") : void 0;
  return { protocol: r3, topic: ls(o4[0]), version: parseInt(o4[1], 10), symKey: c5.symKey, relay: us(c5), methods: f4, expiryTimestamp: c5.expiryTimestamp ? parseInt(c5.expiryTimestamp, 10) : void 0 };
}
function ls(t) {
  return t.startsWith("//") ? t.substring(2) : t;
}
function ds(t, e2 = "-") {
  const n5 = "relay", r3 = {};
  return Object.keys(t).forEach((o4) => {
    const s2 = o4, i3 = n5 + e2 + s2;
    t[s2] && (r3[i3] = t[s2]);
  }), r3;
}
function ja(t) {
  const e2 = new URLSearchParams(), n5 = Zn2(Zn2(Ta(Zn2({}, ds(t.relay)), { symKey: t.symKey }), t.expiryTimestamp && { expiryTimestamp: t.expiryTimestamp.toString() }), t.methods && { methods: t.methods.join(",") });
  return Object.entries(n5).sort(([r3], [o4]) => r3.localeCompare(o4)).forEach(([r3, o4]) => {
    o4 !== void 0 && e2.append(r3, String(o4));
  }), `${t.protocol}:${t.topic}@${t.version}?${e2}`;
}
function La(t, e2, n5) {
  return `${t}?wc_ev=${n5}&topic=${e2}`;
}
var ka = Object.defineProperty;
var Pa = Object.defineProperties;
var Ha = Object.getOwnPropertyDescriptors;
var hs = Object.getOwnPropertySymbols;
var Da = Object.prototype.hasOwnProperty;
var Va = Object.prototype.propertyIsEnumerable;
var ps = (t, e2, n5) => e2 in t ? ka(t, e2, { enumerable: true, configurable: true, writable: true, value: n5 }) : t[e2] = n5;
var Ma = (t, e2) => {
  for (var n5 in e2 || (e2 = {})) Da.call(e2, n5) && ps(t, n5, e2[n5]);
  if (hs) for (var n5 of hs(e2)) Va.call(e2, n5) && ps(t, n5, e2[n5]);
  return t;
};
var Ka = (t, e2) => Pa(t, Ha(e2));
function Gt2(t) {
  const e2 = [];
  return t.forEach((n5) => {
    const [r3, o4] = n5.split(":");
    e2.push(`${r3}:${o4}`);
  }), e2;
}
function gs(t) {
  const e2 = [];
  return Object.values(t).forEach((n5) => {
    e2.push(...Gt2(n5.accounts));
  }), [...new Set(e2)];
}
function qa(t) {
  const e2 = [];
  return Object.values(t).forEach((n5) => {
    e2.push(...n5.methods);
  }), [...new Set(e2)];
}
function Fa(t) {
  const e2 = [];
  return Object.values(t).forEach((n5) => {
    e2.push(...n5.events);
  }), [...new Set(e2)];
}
function bs(t, e2) {
  const n5 = [];
  return Object.values(t).forEach((r3) => {
    Gt2(r3.accounts).includes(e2) && n5.push(...r3.methods);
  }), n5;
}
function ys(t, e2) {
  const n5 = [];
  return Object.values(t).forEach((r3) => {
    Gt2(r3.accounts).includes(e2) && n5.push(...r3.events);
  }), n5;
}
function Gn2(t) {
  return t.includes(":");
}
function ms(t) {
  return Gn2(t) ? t.split(":")[0] : t;
}
function Ee3(t) {
  var e2, n5, r3;
  const o4 = {};
  if (!Ye2(t)) return o4;
  for (const [s2, i3] of Object.entries(t)) {
    const c5 = Gn2(s2) ? [s2] : i3.chains, f4 = i3.methods || [], u2 = i3.events || [], a3 = ms(s2);
    o4[a3] = Ka(Ma({}, o4[a3]), { chains: ut2(c5, (e2 = o4[a3]) == null ? void 0 : e2.chains), methods: ut2(f4, (n5 = o4[a3]) == null ? void 0 : n5.methods), events: ut2(u2, (r3 = o4[a3]) == null ? void 0 : r3.events) });
  }
  return o4;
}
function ws(t) {
  const e2 = {};
  return t?.forEach((n5) => {
    var r3;
    const [o4, s2] = n5.split(":");
    e2[o4] || (e2[o4] = { accounts: [], chains: [], events: [], methods: [] }), e2[o4].accounts.push(n5), (r3 = e2[o4].chains) == null || r3.push(`${o4}:${s2}`);
  }), e2;
}
function za(t, e2) {
  e2 = e2.map((r3) => r3.replace("did:pkh:", ""));
  const n5 = ws(e2);
  for (const [r3, o4] of Object.entries(n5)) o4.methods ? o4.methods = ut2(o4.methods, t) : o4.methods = t, o4.events = ["chainChanged", "accountsChanged"];
  return n5;
}
function Ya(t, e2) {
  var n5, r3, o4, s2, i3, c5;
  const f4 = Ee3(t), u2 = Ee3(e2), a3 = {}, l6 = Object.keys(f4).concat(Object.keys(u2));
  for (const d4 of l6) a3[d4] = { chains: ut2((n5 = f4[d4]) == null ? void 0 : n5.chains, (r3 = u2[d4]) == null ? void 0 : r3.chains), methods: ut2((o4 = f4[d4]) == null ? void 0 : o4.methods, (s2 = u2[d4]) == null ? void 0 : s2.methods), events: ut2((i3 = f4[d4]) == null ? void 0 : i3.events, (c5 = u2[d4]) == null ? void 0 : c5.events) };
  return a3;
}
var vs = { INVALID_METHOD: { message: "Invalid method.", code: 1001 }, INVALID_EVENT: { message: "Invalid event.", code: 1002 }, INVALID_UPDATE_REQUEST: { message: "Invalid update request.", code: 1003 }, INVALID_EXTEND_REQUEST: { message: "Invalid extend request.", code: 1004 }, INVALID_SESSION_SETTLE_REQUEST: { message: "Invalid session settle request.", code: 1005 }, UNAUTHORIZED_METHOD: { message: "Unauthorized method.", code: 3001 }, UNAUTHORIZED_EVENT: { message: "Unauthorized event.", code: 3002 }, UNAUTHORIZED_UPDATE_REQUEST: { message: "Unauthorized update request.", code: 3003 }, UNAUTHORIZED_EXTEND_REQUEST: { message: "Unauthorized extend request.", code: 3004 }, USER_REJECTED: { message: "User rejected.", code: 5e3 }, USER_REJECTED_CHAINS: { message: "User rejected chains.", code: 5001 }, USER_REJECTED_METHODS: { message: "User rejected methods.", code: 5002 }, USER_REJECTED_EVENTS: { message: "User rejected events.", code: 5003 }, UNSUPPORTED_CHAINS: { message: "Unsupported chains.", code: 5100 }, UNSUPPORTED_METHODS: { message: "Unsupported methods.", code: 5101 }, UNSUPPORTED_EVENTS: { message: "Unsupported events.", code: 5102 }, UNSUPPORTED_ACCOUNTS: { message: "Unsupported accounts.", code: 5103 }, UNSUPPORTED_NAMESPACE_KEY: { message: "Unsupported namespace key.", code: 5104 }, USER_DISCONNECTED: { message: "User disconnected.", code: 6e3 }, SESSION_SETTLEMENT_FAILED: { message: "Session settlement failed.", code: 7e3 }, WC_METHOD_UNSUPPORTED: { message: "Unsupported wc_ method.", code: 10001 } };
var xs = { NOT_INITIALIZED: { message: "Not initialized.", code: 1 }, NO_MATCHING_KEY: { message: "No matching key.", code: 2 }, RESTORE_WILL_OVERRIDE: { message: "Restore will override.", code: 3 }, RESUBSCRIBED: { message: "Resubscribed.", code: 4 }, MISSING_OR_INVALID: { message: "Missing or invalid.", code: 5 }, EXPIRED: { message: "Expired.", code: 6 }, UNKNOWN_TYPE: { message: "Unknown type.", code: 7 }, MISMATCHED_TOPIC: { message: "Mismatched topic.", code: 8 }, NON_CONFORMING_NAMESPACES: { message: "Non conforming namespaces.", code: 9 } };
function Bt2(t, e2) {
  const { message: n5, code: r3 } = xs[t];
  return { message: e2 ? `${n5} ${e2}` : n5, code: r3 };
}
function zt2(t, e2) {
  const { message: n5, code: r3 } = vs[t];
  return { message: e2 ? `${n5} ${e2}` : n5, code: r3 };
}
function Be3(t, e2) {
  return Array.isArray(t) ? typeof e2 < "u" && t.length ? t.every(e2) : true : false;
}
function Ye2(t) {
  return Object.getPrototypeOf(t) === Object.prototype && Object.keys(t).length;
}
function Dt2(t) {
  return typeof t > "u";
}
function ft2(t, e2) {
  return e2 && Dt2(t) ? true : typeof t == "string" && !!t.trim().length;
}
function We2(t, e2) {
  return e2 && Dt2(t) ? true : typeof t == "number" && !isNaN(t);
}
function Wa(t, e2) {
  const { requiredNamespaces: n5 } = e2, r3 = Object.keys(t.namespaces), o4 = Object.keys(n5);
  let s2 = true;
  return At(o4, r3) ? (r3.forEach((i3) => {
    const { accounts: c5, methods: f4, events: u2 } = t.namespaces[i3], a3 = Gt2(c5), l6 = n5[i3];
    (!At(Se3(i3, l6), a3) || !At(l6.methods, f4) || !At(l6.events, u2)) && (s2 = false);
  }), s2) : false;
}
function Ie3(t) {
  return ft2(t, false) && t.includes(":") ? t.split(":").length === 2 : false;
}
function Es(t) {
  if (ft2(t, false) && t.includes(":")) {
    const e2 = t.split(":");
    if (e2.length === 3) {
      const n5 = e2[0] + ":" + e2[1];
      return !!e2[2] && Ie3(n5);
    }
  }
  return false;
}
function Xa(t) {
  function e2(n5) {
    try {
      return typeof new URL(n5) < "u";
    } catch {
      return false;
    }
  }
  try {
    if (ft2(t, false)) {
      if (e2(t)) return true;
      const n5 = cn(t);
      return e2(n5);
    }
  } catch {
  }
  return false;
}
function Ja(t) {
  var e2;
  return (e2 = t?.proposer) == null ? void 0 : e2.publicKey;
}
function Qa(t) {
  return t?.topic;
}
function tu(t, e2) {
  let n5 = null;
  return ft2(t?.publicKey, false) || (n5 = Bt2("MISSING_OR_INVALID", `${e2} controller public key should be a string`)), n5;
}
function zn2(t) {
  let e2 = true;
  return Be3(t) ? t.length && (e2 = t.every((n5) => ft2(n5, false))) : e2 = false, e2;
}
function Bs(t, e2, n5) {
  let r3 = null;
  return Be3(e2) && e2.length ? e2.forEach((o4) => {
    r3 || Ie3(o4) || (r3 = zt2("UNSUPPORTED_CHAINS", `${n5}, chain ${o4} should be a string and conform to "namespace:chainId" format`));
  }) : Ie3(t) || (r3 = zt2("UNSUPPORTED_CHAINS", `${n5}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), r3;
}
function Is(t, e2, n5) {
  let r3 = null;
  return Object.entries(t).forEach(([o4, s2]) => {
    if (r3) return;
    const i3 = Bs(o4, Se3(o4, s2), `${e2} ${n5}`);
    i3 && (r3 = i3);
  }), r3;
}
function As(t, e2) {
  let n5 = null;
  return Be3(t) ? t.forEach((r3) => {
    n5 || Es(r3) || (n5 = zt2("UNSUPPORTED_ACCOUNTS", `${e2}, account ${r3} should be a string and conform to "namespace:chainId:address" format`));
  }) : n5 = zt2("UNSUPPORTED_ACCOUNTS", `${e2}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), n5;
}
function Ss(t, e2) {
  let n5 = null;
  return Object.values(t).forEach((r3) => {
    if (n5) return;
    const o4 = As(r3?.accounts, `${e2} namespace`);
    o4 && (n5 = o4);
  }), n5;
}
function Os(t, e2) {
  let n5 = null;
  return zn2(t?.methods) ? zn2(t?.events) || (n5 = zt2("UNSUPPORTED_EVENTS", `${e2}, events should be an array of strings or empty array for no events`)) : n5 = zt2("UNSUPPORTED_METHODS", `${e2}, methods should be an array of strings or empty array for no methods`), n5;
}
function Yn2(t, e2) {
  let n5 = null;
  return Object.values(t).forEach((r3) => {
    if (n5) return;
    const o4 = Os(r3, `${e2}, namespace`);
    o4 && (n5 = o4);
  }), n5;
}
function eu(t, e2, n5) {
  let r3 = null;
  if (t && Ye2(t)) {
    const o4 = Yn2(t, e2);
    o4 && (r3 = o4);
    const s2 = Is(t, e2, n5);
    s2 && (r3 = s2);
  } else r3 = Bt2("MISSING_OR_INVALID", `${e2}, ${n5} should be an object with data`);
  return r3;
}
function Ns(t, e2) {
  let n5 = null;
  if (t && Ye2(t)) {
    const r3 = Yn2(t, e2);
    r3 && (n5 = r3);
    const o4 = Ss(t, e2);
    o4 && (n5 = o4);
  } else n5 = Bt2("MISSING_OR_INVALID", `${e2}, namespaces should be an object with data`);
  return n5;
}
function Us(t) {
  return ft2(t.protocol, true);
}
function nu(t, e2) {
  let n5 = false;
  return e2 && !t ? n5 = true : t && Be3(t) && t.length && t.forEach((r3) => {
    n5 = Us(r3);
  }), n5;
}
function ru(t) {
  return typeof t == "number";
}
function ou(t) {
  return typeof t < "u" && typeof t !== null;
}
function su(t) {
  return !(!t || typeof t != "object" || !t.code || !We2(t.code, false) || !t.message || !ft2(t.message, false));
}
function iu(t) {
  return !(Dt2(t) || !ft2(t.method, false));
}
function cu(t) {
  return !(Dt2(t) || Dt2(t.result) && Dt2(t.error) || !We2(t.id, false) || !ft2(t.jsonrpc, false));
}
function fu(t) {
  return !(Dt2(t) || !ft2(t.name, false));
}
function au(t, e2) {
  return !(!Ie3(e2) || !gs(t).includes(e2));
}
function uu(t, e2, n5) {
  return ft2(n5, false) ? bs(t, e2).includes(n5) : false;
}
function lu(t, e2, n5) {
  return ft2(n5, false) ? ys(t, e2).includes(n5) : false;
}
function _s(t, e2, n5) {
  let r3 = null;
  const o4 = du(t), s2 = hu(e2), i3 = Object.keys(o4), c5 = Object.keys(s2), f4 = Rs(Object.keys(t)), u2 = Rs(Object.keys(e2)), a3 = f4.filter((l6) => !u2.includes(l6));
  return a3.length && (r3 = Bt2("NON_CONFORMING_NAMESPACES", `${n5} namespaces keys don't satisfy requiredNamespaces.
      Required: ${a3.toString()}
      Received: ${Object.keys(e2).toString()}`)), At(i3, c5) || (r3 = Bt2("NON_CONFORMING_NAMESPACES", `${n5} namespaces chains don't satisfy required namespaces.
      Required: ${i3.toString()}
      Approved: ${c5.toString()}`)), Object.keys(e2).forEach((l6) => {
    if (!l6.includes(":") || r3) return;
    const d4 = Gt2(e2[l6].accounts);
    d4.includes(l6) || (r3 = Bt2("NON_CONFORMING_NAMESPACES", `${n5} namespaces accounts don't satisfy namespace accounts for ${l6}
        Required: ${l6}
        Approved: ${d4.toString()}`));
  }), i3.forEach((l6) => {
    r3 || (At(o4[l6].methods, s2[l6].methods) ? At(o4[l6].events, s2[l6].events) || (r3 = Bt2("NON_CONFORMING_NAMESPACES", `${n5} namespaces events don't satisfy namespace events for ${l6}`)) : r3 = Bt2("NON_CONFORMING_NAMESPACES", `${n5} namespaces methods don't satisfy namespace methods for ${l6}`));
  }), r3;
}
function du(t) {
  const e2 = {};
  return Object.keys(t).forEach((n5) => {
    var r3;
    n5.includes(":") ? e2[n5] = t[n5] : (r3 = t[n5].chains) == null || r3.forEach((o4) => {
      e2[o4] = { methods: t[n5].methods, events: t[n5].events };
    });
  }), e2;
}
function Rs(t) {
  return [...new Set(t.map((e2) => e2.includes(":") ? e2.split(":")[0] : e2))];
}
function hu(t) {
  const e2 = {};
  return Object.keys(t).forEach((n5) => {
    if (n5.includes(":")) e2[n5] = t[n5];
    else {
      const r3 = Gt2(t[n5].accounts);
      r3?.forEach((o4) => {
        e2[o4] = { accounts: t[n5].accounts.filter((s2) => s2.includes(`${o4}:`)), methods: t[n5].methods, events: t[n5].events };
      });
    }
  }), e2;
}
function pu(t, e2) {
  return We2(t, false) && t <= e2.max && t >= e2.min;
}
function gu() {
  const t = Vt2();
  return new Promise((e2) => {
    switch (t) {
      case et.browser:
        e2($s());
        break;
      case et.reactNative:
        e2(Ts());
        break;
      case et.node:
        e2(Cs());
        break;
      default:
        e2(true);
    }
  });
}
function $s() {
  return Wt2() && navigator?.onLine;
}
async function Ts() {
  if (It2() && typeof global < "u" && global != null && global.NetInfo) {
    const t = await (global == null ? void 0 : global.NetInfo.fetch());
    return t?.isConnected;
  }
  return true;
}
function Cs() {
  return true;
}
function bu(t) {
  switch (Vt2()) {
    case et.browser:
      js(t);
      break;
    case et.reactNative:
      Ls(t);
      break;
    case et.node:
      break;
  }
}
function js(t) {
  !It2() && Wt2() && (window.addEventListener("online", () => t(true)), window.addEventListener("offline", () => t(false)));
}
function Ls(t) {
  It2() && typeof global < "u" && global != null && global.NetInfo && global?.NetInfo.addEventListener((e2) => t(e2?.isConnected));
}
function yu() {
  var t;
  return Wt2() && (0, import_window_getters.getDocument)() ? ((t = (0, import_window_getters.getDocument)()) == null ? void 0 : t.visibilityState) === "visible" : true;
}
var Wn2 = {};
var mu = class {
  static get(e2) {
    return Wn2[e2];
  }
  static set(e2, n5) {
    Wn2[e2] = n5;
  }
  static delete(e2) {
    delete Wn2[e2];
  }
};
function ks(t) {
  const e2 = esm_default2.decode(t);
  if (e2.length < 33) throw new Error("Too short to contain a public key");
  return e2.slice(1, 33);
}
function Ps({ publicKey: t, signature: e2, payload: n5 }) {
  var r3;
  const o4 = Xn2(n5.method), s2 = 128 | parseInt(((r3 = n5.version) == null ? void 0 : r3.toString()) || "4"), i3 = vu(n5.address), c5 = n5.era === "00" ? new Uint8Array([0]) : Xn2(n5.era);
  if (c5.length !== 1 && c5.length !== 2) throw new Error("Invalid era length");
  const f4 = parseInt(n5.nonce, 16), u2 = new Uint8Array([f4 & 255, f4 >> 8 & 255]), a3 = BigInt(`0x${wu(n5.tip)}`), l6 = Eu(a3), d4 = new Uint8Array([0, ...t, i3, ...e2, ...c5, ...u2, ...l6, ...o4]), h4 = xu(d4.length + 1);
  return new Uint8Array([...h4, s2, ...d4]);
}
function Hs(t) {
  const e2 = Xn2(t), n5 = (0, import_blakejs.blake2b)(e2, void 0, 32);
  return "0x" + Buffer.from(n5).toString("hex");
}
function Xn2(t) {
  return new Uint8Array(t.replace(/^0x/, "").match(/.{1,2}/g).map((e2) => parseInt(e2, 16)));
}
function wu(t) {
  return t.startsWith("0x") ? t.slice(2) : t;
}
function vu(t) {
  const e2 = esm_default2.decode(t)[0];
  return e2 === 42 ? 0 : e2 === 60 ? 2 : 1;
}
function xu(t) {
  if (t < 64) return new Uint8Array([t << 2]);
  if (t < 16384) {
    const e2 = t << 2 | 1;
    return new Uint8Array([e2 & 255, e2 >> 8 & 255]);
  } else if (t < 1 << 30) {
    const e2 = t << 2 | 2;
    return new Uint8Array([e2 & 255, e2 >> 8 & 255, e2 >> 16 & 255, e2 >> 24 & 255]);
  } else throw new Error("Compact encoding > 2^30 not supported");
}
function Eu(t) {
  if (t < BigInt(1) << BigInt(6)) return new Uint8Array([Number(t << BigInt(2))]);
  if (t < BigInt(1) << BigInt(14)) {
    const e2 = t << BigInt(2) | BigInt(1);
    return new Uint8Array([Number(e2 & BigInt(255)), Number(e2 >> BigInt(8) & BigInt(255))]);
  } else if (t < BigInt(1) << BigInt(30)) {
    const e2 = t << BigInt(2) | BigInt(2);
    return new Uint8Array([Number(e2 & BigInt(255)), Number(e2 >> BigInt(8) & BigInt(255)), Number(e2 >> BigInt(16) & BigInt(255)), Number(e2 >> BigInt(24) & BigInt(255))]);
  } else throw new Error("BigInt compact encoding not supported > 2^30");
}
function Bu(t) {
  const e2 = Uint8Array.from(Buffer.from(t.signature, "hex")), n5 = ks(t.transaction.address), r3 = Ps({ publicKey: n5, signature: e2, payload: t.transaction }), o4 = Buffer.from(r3).toString("hex");
  return Hs(o4);
}
function Iu({ logger: t, name: e2 }) {
  const n5 = typeof t == "string" ? Ue({ opts: { level: t, name: e2 } }).logger : t;
  return n5.level = typeof t == "string" ? t : t.level, n5;
}

// node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
var import_events5 = __toESM(require_events());

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  DEFAULT_ERROR: () => DEFAULT_ERROR,
  IBaseJsonRpcProvider: () => n3,
  IEvents: () => e,
  IJsonRpcConnection: () => o2,
  IJsonRpcProvider: () => r2,
  INTERNAL_ERROR: () => INTERNAL_ERROR,
  INVALID_PARAMS: () => INVALID_PARAMS,
  INVALID_REQUEST: () => INVALID_REQUEST,
  METHOD_NOT_FOUND: () => METHOD_NOT_FOUND,
  PARSE_ERROR: () => PARSE_ERROR,
  RESERVED_ERROR_CODES: () => RESERVED_ERROR_CODES,
  SERVER_ERROR: () => SERVER_ERROR,
  SERVER_ERROR_CODE_RANGE: () => SERVER_ERROR_CODE_RANGE,
  STANDARD_ERROR_MAP: () => STANDARD_ERROR_MAP,
  formatErrorMessage: () => formatErrorMessage,
  formatJsonRpcError: () => formatJsonRpcError,
  formatJsonRpcRequest: () => formatJsonRpcRequest,
  formatJsonRpcResult: () => formatJsonRpcResult,
  getBigIntRpcId: () => getBigIntRpcId,
  getError: () => getError,
  getErrorByCode: () => getErrorByCode,
  isHttpUrl: () => isHttpUrl,
  isJsonRpcError: () => isJsonRpcError,
  isJsonRpcPayload: () => isJsonRpcPayload,
  isJsonRpcRequest: () => isJsonRpcRequest,
  isJsonRpcResponse: () => isJsonRpcResponse,
  isJsonRpcResult: () => isJsonRpcResult,
  isJsonRpcValidationInvalid: () => isJsonRpcValidationInvalid,
  isLocalhostUrl: () => isLocalhostUrl,
  isNodeJs: () => isNodeJs,
  isReservedErrorCode: () => isReservedErrorCode,
  isServerErrorCode: () => isServerErrorCode,
  isValidDefaultRoute: () => isValidDefaultRoute,
  isValidErrorCode: () => isValidErrorCode,
  isValidLeadingWildcardRoute: () => isValidLeadingWildcardRoute,
  isValidRoute: () => isValidRoute,
  isValidTrailingWildcardRoute: () => isValidTrailingWildcardRoute,
  isValidWildcardRoute: () => isValidWildcardRoute,
  isWsUrl: () => isWsUrl,
  parseConnectionError: () => parseConnectionError,
  payloadId: () => payloadId,
  validateJsonRpcError: () => validateJsonRpcError
});

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/constants.js
var PARSE_ERROR = "PARSE_ERROR";
var INVALID_REQUEST = "INVALID_REQUEST";
var METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
var INVALID_PARAMS = "INVALID_PARAMS";
var INTERNAL_ERROR = "INTERNAL_ERROR";
var SERVER_ERROR = "SERVER_ERROR";
var RESERVED_ERROR_CODES = [-32700, -32600, -32601, -32602, -32603];
var SERVER_ERROR_CODE_RANGE = [-32e3, -32099];
var STANDARD_ERROR_MAP = {
  [PARSE_ERROR]: { code: -32700, message: "Parse error" },
  [INVALID_REQUEST]: { code: -32600, message: "Invalid Request" },
  [METHOD_NOT_FOUND]: { code: -32601, message: "Method not found" },
  [INVALID_PARAMS]: { code: -32602, message: "Invalid params" },
  [INTERNAL_ERROR]: { code: -32603, message: "Internal error" },
  [SERVER_ERROR]: { code: -32e3, message: "Server error" }
};
var DEFAULT_ERROR = SERVER_ERROR;

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/error.js
function isServerErrorCode(code2) {
  return code2 <= SERVER_ERROR_CODE_RANGE[0] && code2 >= SERVER_ERROR_CODE_RANGE[1];
}
function isReservedErrorCode(code2) {
  return RESERVED_ERROR_CODES.includes(code2);
}
function isValidErrorCode(code2) {
  return typeof code2 === "number";
}
function getError(type) {
  if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code2) {
  const match = Object.values(STANDARD_ERROR_MAP).find((e2) => e2.code === code2);
  if (!match) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return match;
}
function validateJsonRpcError(response) {
  if (typeof response.error.code === "undefined") {
    return { valid: false, error: "Missing code for JSON-RPC error" };
  }
  if (typeof response.error.message === "undefined") {
    return { valid: false, error: "Missing message for JSON-RPC error" };
  }
  if (!isValidErrorCode(response.error.code)) {
    return {
      valid: false,
      error: `Invalid error code type for JSON-RPC: ${response.error.code}`
    };
  }
  if (isReservedErrorCode(response.error.code)) {
    const error = getErrorByCode(response.error.code);
    if (error.message !== STANDARD_ERROR_MAP[DEFAULT_ERROR].message && response.error.message === error.message) {
      return {
        valid: false,
        error: `Invalid error code message for JSON-RPC: ${response.error.code}`
      };
    }
  }
  return { valid: true };
}
function parseConnectionError(e2, url, type) {
  return e2.message.includes("getaddrinfo ENOTFOUND") || e2.message.includes("connect ECONNREFUSED") ? new Error(`Unavailable ${type} RPC url at ${url}`) : e2;
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/env.js
var env_exports = {};
__export(env_exports, {
  isNodeJs: () => isNodeJs
});
var import_environment = __toESM(require_cjs4());
__reExport(env_exports, __toESM(require_cjs4()));
var isNodeJs = import_environment.isNode;

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
__reExport(esm_exports, env_exports);

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/format.js
function payloadId(entropy = 3) {
  const date = Date.now() * Math.pow(10, entropy);
  const extra = Math.floor(Math.random() * Math.pow(10, entropy));
  return date + extra;
}
function getBigIntRpcId(entropy = 6) {
  return BigInt(payloadId(entropy));
}
function formatJsonRpcRequest(method, params, id) {
  return {
    id: id || payloadId(),
    jsonrpc: "2.0",
    method,
    params
  };
}
function formatJsonRpcResult(id, result) {
  return {
    id,
    jsonrpc: "2.0",
    result
  };
}
function formatJsonRpcError(id, error, data) {
  return {
    id,
    jsonrpc: "2.0",
    error: formatErrorMessage(error, data)
  };
}
function formatErrorMessage(error, data) {
  if (typeof error === "undefined") {
    return getError(INTERNAL_ERROR);
  }
  if (typeof error === "string") {
    error = Object.assign(Object.assign({}, getError(SERVER_ERROR)), { message: error });
  }
  if (typeof data !== "undefined") {
    error.data = data;
  }
  if (isReservedErrorCode(error.code)) {
    error = getErrorByCode(error.code);
  }
  return error;
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/routing.js
function isValidRoute(route) {
  if (route.includes("*")) {
    return isValidWildcardRoute(route);
  }
  if (/\W/g.test(route)) {
    return false;
  }
  return true;
}
function isValidDefaultRoute(route) {
  return route === "*";
}
function isValidWildcardRoute(route) {
  if (isValidDefaultRoute(route)) {
    return true;
  }
  if (!route.includes("*")) {
    return false;
  }
  if (route.split("*").length !== 2) {
    return false;
  }
  if (route.split("*").filter((x5) => x5.trim() === "").length !== 1) {
    return false;
  }
  return true;
}
function isValidLeadingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[0].trim();
}
function isValidTrailingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[1].trim();
}

// node_modules/@walletconnect/jsonrpc-types/dist/index.es.js
var e = class {
};
var o2 = class extends e {
  constructor(c5) {
    super();
  }
};
var n3 = class extends e {
  constructor() {
    super();
  }
};
var r2 = class extends n3 {
  constructor(c5) {
    super();
  }
};

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/url.js
var HTTP_REGEX = "^https?:";
var WS_REGEX = "^wss?:";
function getUrlProtocol(url) {
  const matches = url.match(new RegExp(/^\w+:/, "gi"));
  if (!matches || !matches.length)
    return;
  return matches[0];
}
function matchRegexProtocol(url, regex) {
  const protocol = getUrlProtocol(url);
  if (typeof protocol === "undefined")
    return false;
  return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
  return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
  return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
  return new RegExp("wss?://localhost(:d{2,5})?").test(url);
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/validators.js
function isJsonRpcPayload(payload) {
  return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest(payload) {
  return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
  return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
  return "result" in payload;
}
function isJsonRpcError(payload) {
  return "error" in payload;
}
function isJsonRpcValidationInvalid(validation) {
  return "error" in validation && validation.valid === false;
}

// node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
var o3 = class extends r2 {
  constructor(t) {
    super(t), this.events = new import_events5.EventEmitter(), this.hasRegisteredEventListeners = false, this.connection = this.setConnection(t), this.connection.connected && this.registerEventListeners();
  }
  async connect(t = this.connection) {
    await this.open(t);
  }
  async disconnect() {
    await this.close();
  }
  on(t, e2) {
    this.events.on(t, e2);
  }
  once(t, e2) {
    this.events.once(t, e2);
  }
  off(t, e2) {
    this.events.off(t, e2);
  }
  removeListener(t, e2) {
    this.events.removeListener(t, e2);
  }
  async request(t, e2) {
    return this.requestStrict(formatJsonRpcRequest(t.method, t.params || [], t.id || getBigIntRpcId().toString()), e2);
  }
  async requestStrict(t, e2) {
    return new Promise(async (i3, s2) => {
      if (!this.connection.connected) try {
        await this.open();
      } catch (n5) {
        s2(n5);
      }
      this.events.on(`${t.id}`, (n5) => {
        isJsonRpcError(n5) ? s2(n5.error) : i3(n5.result);
      });
      try {
        await this.connection.send(t, e2);
      } catch (n5) {
        s2(n5);
      }
    });
  }
  setConnection(t = this.connection) {
    return t;
  }
  onPayload(t) {
    this.events.emit("payload", t), isJsonRpcResponse(t) ? this.events.emit(`${t.id}`, t) : this.events.emit("message", { type: t.method, data: t.params });
  }
  onClose(t) {
    t && t.code === 3e3 && this.events.emit("error", new Error(`WebSocket connection closed abnormally with code: ${t.code} ${t.reason ? `(${t.reason})` : ""}`)), this.events.emit("disconnect");
  }
  async open(t = this.connection) {
    this.connection === t && this.connection.connected || (this.connection.connected && this.close(), typeof t == "string" && (await this.connection.open(t), t = this.connection), this.connection = this.setConnection(t), await this.connection.open(), this.registerEventListeners(), this.events.emit("connect"));
  }
  async close() {
    await this.connection.close();
  }
  registerEventListeners() {
    this.hasRegisteredEventListeners || (this.connection.on("payload", (t) => this.onPayload(t)), this.connection.on("close", (t) => this.onClose(t)), this.connection.on("error", (t) => this.events.emit("error", t)), this.connection.on("register_error", (t) => this.onClose()), this.hasRegisteredEventListeners = true);
  }
};

// node_modules/@walletconnect/jsonrpc-ws-connection/dist/index.es.js
var import_events6 = __toESM(require_events());
var v3 = () => typeof WebSocket < "u" ? WebSocket : typeof global < "u" && typeof global.WebSocket < "u" ? global.WebSocket : typeof window < "u" && typeof window.WebSocket < "u" ? window.WebSocket : typeof self < "u" && typeof self.WebSocket < "u" ? self.WebSocket : require_browser();
var w2 = () => typeof WebSocket < "u" || typeof global < "u" && typeof global.WebSocket < "u" || typeof window < "u" && typeof window.WebSocket < "u" || typeof self < "u" && typeof self.WebSocket < "u";
var d2 = (r3) => r3.split("?")[0];
var h3 = 10;
var b3 = v3();
var f2 = class {
  constructor(e2) {
    if (this.url = e2, this.events = new import_events6.EventEmitter(), this.registering = false, !isWsUrl(e2)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e2}`);
    this.url = e2;
  }
  get connected() {
    return typeof this.socket < "u";
  }
  get connecting() {
    return this.registering;
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async open(e2 = this.url) {
    await this.register(e2);
  }
  async close() {
    return new Promise((e2, t) => {
      if (typeof this.socket > "u") {
        t(new Error("Connection already closed"));
        return;
      }
      this.socket.onclose = (n5) => {
        this.onClose(n5), e2();
      }, this.socket.close();
    });
  }
  async send(e2) {
    typeof this.socket > "u" && (this.socket = await this.register());
    try {
      this.socket.send(safeJsonStringify(e2));
    } catch (t) {
      this.onError(e2.id, t);
    }
  }
  register(e2 = this.url) {
    if (!isWsUrl(e2)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e2}`);
    if (this.registering) {
      const t = this.events.getMaxListeners();
      return (this.events.listenerCount("register_error") >= t || this.events.listenerCount("open") >= t) && this.events.setMaxListeners(t + 1), new Promise((n5, s2) => {
        this.events.once("register_error", (o4) => {
          this.resetMaxListeners(), s2(o4);
        }), this.events.once("open", () => {
          if (this.resetMaxListeners(), typeof this.socket > "u") return s2(new Error("WebSocket connection is missing or invalid"));
          n5(this.socket);
        });
      });
    }
    return this.url = e2, this.registering = true, new Promise((t, n5) => {
      const s2 = (0, esm_exports.isReactNative)() ? void 0 : { rejectUnauthorized: !isLocalhostUrl(e2) }, o4 = new b3(e2, [], s2);
      w2() ? o4.onerror = (i3) => {
        const a3 = i3;
        n5(this.emitError(a3.error));
      } : o4.on("error", (i3) => {
        n5(this.emitError(i3));
      }), o4.onopen = () => {
        this.onOpen(o4), t(o4);
      };
    });
  }
  onOpen(e2) {
    e2.onmessage = (t) => this.onPayload(t), e2.onclose = (t) => this.onClose(t), this.socket = e2, this.registering = false, this.events.emit("open");
  }
  onClose(e2) {
    this.socket = void 0, this.registering = false, this.events.emit("close", e2);
  }
  onPayload(e2) {
    if (typeof e2.data > "u") return;
    const t = typeof e2.data == "string" ? safeJsonParse(e2.data) : e2.data;
    this.events.emit("payload", t);
  }
  onError(e2, t) {
    const n5 = this.parseError(t), s2 = n5.message || n5.toString(), o4 = formatJsonRpcError(e2, s2);
    this.events.emit("payload", o4);
  }
  parseError(e2, t = this.url) {
    return parseConnectionError(e2, d2(t), "WS");
  }
  resetMaxListeners() {
    this.events.getMaxListeners() > h3 && this.events.setMaxListeners(h3);
  }
  emitError(e2) {
    const t = this.parseError(new Error(e2?.message || `WebSocket connection failed for host: ${d2(this.url)}`));
    return this.events.emit("register_error", t), t;
  }
};

// node_modules/@walletconnect/core/dist/index.js
var import_window_getters2 = __toESM(require_cjs2(), 1);
var Ue4 = "wc";
var Fe3 = 2;
var ge4 = "core";
var W4 = `${Ue4}@2:${ge4}:`;
var Et3 = { name: ge4, logger: "error" };
var It3 = { database: ":memory:" };
var Tt3 = "crypto";
var Me4 = "client_ed25519_seed";
var Ct2 = import_time4.ONE_DAY;
var Pt3 = "keychain";
var St3 = "0.3";
var Ot3 = "messages";
var Rt3 = "0.3";
var At2 = import_time4.SIX_HOURS;
var xt3 = "publisher";
var Nt3 = "irn";
var $t3 = "error";
var Ke3 = "wss://relay.walletconnect.org";
var zt3 = "relayer";
var C3 = { message: "relayer_message", message_ack: "relayer_message_ack", connect: "relayer_connect", disconnect: "relayer_disconnect", error: "relayer_error", connection_stalled: "relayer_connection_stalled", transport_closed: "relayer_transport_closed", publish: "relayer_publish" };
var Lt3 = "_subscription";
var M3 = { payload: "payload", connect: "connect", disconnect: "disconnect", error: "error" };
var kt3 = 0.1;
var Pe4 = "2.23.1";
var ee3 = { link_mode: "link_mode", relay: "relay" };
var ye4 = { inbound: "inbound", outbound: "outbound" };
var jt3 = "0.3";
var Ut3 = "WALLETCONNECT_CLIENT_ID";
var Be4 = "WALLETCONNECT_LINK_MODE_APPS";
var j4 = { created: "subscription_created", deleted: "subscription_deleted", expired: "subscription_expired", disabled: "subscription_disabled", sync: "subscription_sync", resubscribed: "subscription_resubscribed" };
var Ft3 = "subscription";
var Mt3 = "0.3";
var Qs = import_time4.FIVE_SECONDS * 1e3;
var Kt3 = "pairing";
var Bt3 = "0.3";
var oe3 = { wc_pairingDelete: { req: { ttl: import_time4.ONE_DAY, prompt: false, tag: 1e3 }, res: { ttl: import_time4.ONE_DAY, prompt: false, tag: 1001 } }, wc_pairingPing: { req: { ttl: import_time4.THIRTY_SECONDS, prompt: false, tag: 1002 }, res: { ttl: import_time4.THIRTY_SECONDS, prompt: false, tag: 1003 } }, unregistered_method: { req: { ttl: import_time4.ONE_DAY, prompt: false, tag: 0 }, res: { ttl: import_time4.ONE_DAY, prompt: false, tag: 0 } } };
var ae3 = { create: "pairing_create", expire: "pairing_expire", delete: "pairing_delete", ping: "pairing_ping" };
var V2 = { created: "history_created", updated: "history_updated", deleted: "history_deleted", sync: "history_sync" };
var Vt3 = "history";
var qt3 = "0.3";
var Gt3 = "expirer";
var q2 = { created: "expirer_created", deleted: "expirer_deleted", expired: "expirer_expired", sync: "expirer_sync" };
var Wt3 = "0.3";
var Ht3 = "verify-api";
var ir2 = "https://verify.walletconnect.com";
var Yt2 = "https://verify.walletconnect.org";
var be4 = Yt2;
var Jt3 = `${be4}/v3`;
var Xt3 = [ir2, Yt2];
var Zt3 = "echo";
var Qt3 = "https://echo.walletconnect.com";
var Y2 = { pairing_started: "pairing_started", pairing_uri_validation_success: "pairing_uri_validation_success", pairing_uri_not_expired: "pairing_uri_not_expired", store_new_pairing: "store_new_pairing", subscribing_pairing_topic: "subscribing_pairing_topic", subscribe_pairing_topic_success: "subscribe_pairing_topic_success", existing_pairing: "existing_pairing", pairing_not_expired: "pairing_not_expired", emit_inactive_pairing: "emit_inactive_pairing", emit_session_proposal: "emit_session_proposal", subscribing_to_pairing_topic: "subscribing_to_pairing_topic" };
var X3 = { no_wss_connection: "no_wss_connection", no_internet_connection: "no_internet_connection", malformed_pairing_uri: "malformed_pairing_uri", active_pairing_already_exists: "active_pairing_already_exists", subscribe_pairing_topic_failure: "subscribe_pairing_topic_failure", pairing_expired: "pairing_expired", proposal_expired: "proposal_expired", proposal_listener_not_found: "proposal_listener_not_found" };
var rr3 = { session_approve_started: "session_approve_started", proposal_not_expired: "proposal_not_expired", session_namespaces_validation_success: "session_namespaces_validation_success", create_session_topic: "create_session_topic", subscribing_session_topic: "subscribing_session_topic", subscribe_session_topic_success: "subscribe_session_topic_success", publishing_session_approve: "publishing_session_approve", session_approve_publish_success: "session_approve_publish_success", store_session: "store_session", publishing_session_settle: "publishing_session_settle", session_settle_publish_success: "session_settle_publish_success", session_request_response_started: "session_request_response_started", session_request_response_validation_success: "session_request_response_validation_success", session_request_response_publish_started: "session_request_response_publish_started" };
var nr3 = { no_internet_connection: "no_internet_connection", no_wss_connection: "no_wss_connection", proposal_expired: "proposal_expired", subscribe_session_topic_failure: "subscribe_session_topic_failure", session_approve_publish_failure: "session_approve_publish_failure", session_settle_publish_failure: "session_settle_publish_failure", session_approve_namespace_validation_failure: "session_approve_namespace_validation_failure", proposal_not_found: "proposal_not_found", session_request_response_validation_failure: "session_request_response_validation_failure", session_request_response_publish_failure: "session_request_response_publish_failure" };
var or3 = { authenticated_session_approve_started: "authenticated_session_approve_started", authenticated_session_not_expired: "authenticated_session_not_expired", chains_caip2_compliant: "chains_caip2_compliant", chains_evm_compliant: "chains_evm_compliant", create_authenticated_session_topic: "create_authenticated_session_topic", cacaos_verified: "cacaos_verified", store_authenticated_session: "store_authenticated_session", subscribing_authenticated_session_topic: "subscribing_authenticated_session_topic", subscribe_authenticated_session_topic_success: "subscribe_authenticated_session_topic_success", publishing_authenticated_session_approve: "publishing_authenticated_session_approve", authenticated_session_approve_publish_success: "authenticated_session_approve_publish_success" };
var ar3 = { no_internet_connection: "no_internet_connection", no_wss_connection: "no_wss_connection", missing_session_authenticate_request: "missing_session_authenticate_request", session_authenticate_request_expired: "session_authenticate_request_expired", chains_caip2_compliant_failure: "chains_caip2_compliant_failure", chains_evm_compliant_failure: "chains_evm_compliant_failure", invalid_cacao: "invalid_cacao", subscribe_authenticated_session_topic_failure: "subscribe_authenticated_session_topic_failure", authenticated_session_approve_publish_failure: "authenticated_session_approve_publish_failure", authenticated_session_pending_request_not_found: "authenticated_session_pending_request_not_found" };
var ei = 0.1;
var ti = "event-client";
var ii2 = 86400;
var si2 = "https://pulse.walletconnect.org/batch";
function cr2(r3, e2) {
  if (r3.length >= 255) throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), i3 = 0; i3 < t.length; i3++) t[i3] = 255;
  for (var s2 = 0; s2 < r3.length; s2++) {
    var n5 = r3.charAt(s2), o4 = n5.charCodeAt(0);
    if (t[o4] !== 255) throw new TypeError(n5 + " is ambiguous");
    t[o4] = s2;
  }
  var a3 = r3.length, c5 = r3.charAt(0), h4 = Math.log(a3) / Math.log(256), l6 = Math.log(256) / Math.log(a3);
  function g2(u2) {
    if (u2 instanceof Uint8Array || (ArrayBuffer.isView(u2) ? u2 = new Uint8Array(u2.buffer, u2.byteOffset, u2.byteLength) : Array.isArray(u2) && (u2 = Uint8Array.from(u2))), !(u2 instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (u2.length === 0) return "";
    for (var m3 = 0, D2 = 0, w3 = 0, E3 = u2.length; w3 !== E3 && u2[w3] === 0; ) w3++, m3++;
    for (var L2 = (E3 - w3) * l6 + 1 >>> 0, I3 = new Uint8Array(L2); w3 !== E3; ) {
      for (var k4 = u2[w3], T3 = 0, S4 = L2 - 1; (k4 !== 0 || T3 < D2) && S4 !== -1; S4--, T3++) k4 += 256 * I3[S4] >>> 0, I3[S4] = k4 % a3 >>> 0, k4 = k4 / a3 >>> 0;
      if (k4 !== 0) throw new Error("Non-zero carry");
      D2 = T3, w3++;
    }
    for (var O4 = L2 - D2; O4 !== L2 && I3[O4] === 0; ) O4++;
    for (var te4 = c5.repeat(m3); O4 < L2; ++O4) te4 += r3.charAt(I3[O4]);
    return te4;
  }
  function y4(u2) {
    if (typeof u2 != "string") throw new TypeError("Expected String");
    if (u2.length === 0) return new Uint8Array();
    var m3 = 0;
    if (u2[m3] !== " ") {
      for (var D2 = 0, w3 = 0; u2[m3] === c5; ) D2++, m3++;
      for (var E3 = (u2.length - m3) * h4 + 1 >>> 0, L2 = new Uint8Array(E3); u2[m3]; ) {
        var I3 = t[u2.charCodeAt(m3)];
        if (I3 === 255) return;
        for (var k4 = 0, T3 = E3 - 1; (I3 !== 0 || k4 < w3) && T3 !== -1; T3--, k4++) I3 += a3 * L2[T3] >>> 0, L2[T3] = I3 % 256 >>> 0, I3 = I3 / 256 >>> 0;
        if (I3 !== 0) throw new Error("Non-zero carry");
        w3 = k4, m3++;
      }
      if (u2[m3] !== " ") {
        for (var S4 = E3 - w3; S4 !== E3 && L2[S4] === 0; ) S4++;
        for (var O4 = new Uint8Array(D2 + (E3 - S4)), te4 = D2; S4 !== E3; ) O4[te4++] = L2[S4++];
        return O4;
      }
    }
  }
  function _3(u2) {
    var m3 = y4(u2);
    if (m3) return m3;
    throw new Error(`Non-${e2} character`);
  }
  return { encode: g2, decodeUnsafe: y4, decode: _3 };
}
var hr2 = cr2;
var lr3 = hr2;
var ri2 = (r3) => {
  if (r3 instanceof Uint8Array && r3.constructor.name === "Uint8Array") return r3;
  if (r3 instanceof ArrayBuffer) return new Uint8Array(r3);
  if (ArrayBuffer.isView(r3)) return new Uint8Array(r3.buffer, r3.byteOffset, r3.byteLength);
  throw new Error("Unknown type, must be binary type");
};
var ur3 = (r3) => new TextEncoder().encode(r3);
var dr3 = (r3) => new TextDecoder().decode(r3);
var pr3 = class {
  constructor(e2, t, i3) {
    this.name = e2, this.prefix = t, this.baseEncode = i3;
  }
  encode(e2) {
    if (e2 instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e2)}`;
    throw Error("Unknown type, must be binary type");
  }
};
var gr3 = class {
  constructor(e2, t, i3) {
    if (this.name = e2, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
    this.prefixCodePoint = t.codePointAt(0), this.baseDecode = i3;
  }
  decode(e2) {
    if (typeof e2 == "string") {
      if (e2.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e2)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      return this.baseDecode(e2.slice(this.prefix.length));
    } else throw Error("Can only multibase decode strings");
  }
  or(e2) {
    return ni(this, e2);
  }
};
var yr3 = class {
  constructor(e2) {
    this.decoders = e2;
  }
  or(e2) {
    return ni(this, e2);
  }
  decode(e2) {
    const t = e2[0], i3 = this.decoders[t];
    if (i3) return i3.decode(e2);
    throw RangeError(`Unable to decode multibase string ${JSON.stringify(e2)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
  }
};
var ni = (r3, e2) => new yr3({ ...r3.decoders || { [r3.prefix]: r3 }, ...e2.decoders || { [e2.prefix]: e2 } });
var br3 = class {
  constructor(e2, t, i3, s2) {
    this.name = e2, this.prefix = t, this.baseEncode = i3, this.baseDecode = s2, this.encoder = new pr3(e2, t, i3), this.decoder = new gr3(e2, t, s2);
  }
  encode(e2) {
    return this.encoder.encode(e2);
  }
  decode(e2) {
    return this.decoder.decode(e2);
  }
};
var Se4 = ({ name: r3, prefix: e2, encode: t, decode: i3 }) => new br3(r3, e2, t, i3);
var me4 = ({ prefix: r3, name: e2, alphabet: t }) => {
  const { encode: i3, decode: s2 } = lr3(t, e2);
  return Se4({ prefix: r3, name: e2, encode: i3, decode: (n5) => ri2(s2(n5)) });
};
var mr3 = (r3, e2, t, i3) => {
  const s2 = {};
  for (let l6 = 0; l6 < e2.length; ++l6) s2[e2[l6]] = l6;
  let n5 = r3.length;
  for (; r3[n5 - 1] === "="; ) --n5;
  const o4 = new Uint8Array(n5 * t / 8 | 0);
  let a3 = 0, c5 = 0, h4 = 0;
  for (let l6 = 0; l6 < n5; ++l6) {
    const g2 = s2[r3[l6]];
    if (g2 === void 0) throw new SyntaxError(`Non-${i3} character`);
    c5 = c5 << t | g2, a3 += t, a3 >= 8 && (a3 -= 8, o4[h4++] = 255 & c5 >> a3);
  }
  if (a3 >= t || 255 & c5 << 8 - a3) throw new SyntaxError("Unexpected end of data");
  return o4;
};
var fr2 = (r3, e2, t) => {
  const i3 = e2[e2.length - 1] === "=", s2 = (1 << t) - 1;
  let n5 = "", o4 = 0, a3 = 0;
  for (let c5 = 0; c5 < r3.length; ++c5) for (a3 = a3 << 8 | r3[c5], o4 += 8; o4 > t; ) o4 -= t, n5 += e2[s2 & a3 >> o4];
  if (o4 && (n5 += e2[s2 & a3 << t - o4]), i3) for (; n5.length * t & 7; ) n5 += "=";
  return n5;
};
var x4 = ({ name: r3, prefix: e2, bitsPerChar: t, alphabet: i3 }) => Se4({ prefix: e2, name: r3, encode(s2) {
  return fr2(s2, i3, t);
}, decode(s2) {
  return mr3(s2, i3, t, r3);
} });
var Dr3 = Se4({ prefix: "\0", name: "identity", encode: (r3) => dr3(r3), decode: (r3) => ur3(r3) });
var vr2 = Object.freeze({ __proto__: null, identity: Dr3 });
var _r3 = x4({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 });
var wr3 = Object.freeze({ __proto__: null, base2: _r3 });
var Er2 = x4({ prefix: "7", name: "base8", alphabet: "01234567", bitsPerChar: 3 });
var Ir3 = Object.freeze({ __proto__: null, base8: Er2 });
var Tr3 = me4({ prefix: "9", name: "base10", alphabet: "0123456789" });
var Cr3 = Object.freeze({ __proto__: null, base10: Tr3 });
var Pr3 = x4({ prefix: "f", name: "base16", alphabet: "0123456789abcdef", bitsPerChar: 4 });
var Sr3 = x4({ prefix: "F", name: "base16upper", alphabet: "0123456789ABCDEF", bitsPerChar: 4 });
var Or3 = Object.freeze({ __proto__: null, base16: Pr3, base16upper: Sr3 });
var Rr3 = x4({ prefix: "b", name: "base32", alphabet: "abcdefghijklmnopqrstuvwxyz234567", bitsPerChar: 5 });
var Ar3 = x4({ prefix: "B", name: "base32upper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bitsPerChar: 5 });
var xr2 = x4({ prefix: "c", name: "base32pad", alphabet: "abcdefghijklmnopqrstuvwxyz234567=", bitsPerChar: 5 });
var Nr3 = x4({ prefix: "C", name: "base32padupper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=", bitsPerChar: 5 });
var $r3 = x4({ prefix: "v", name: "base32hex", alphabet: "0123456789abcdefghijklmnopqrstuv", bitsPerChar: 5 });
var zr3 = x4({ prefix: "V", name: "base32hexupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", bitsPerChar: 5 });
var Lr3 = x4({ prefix: "t", name: "base32hexpad", alphabet: "0123456789abcdefghijklmnopqrstuv=", bitsPerChar: 5 });
var kr3 = x4({ prefix: "T", name: "base32hexpadupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=", bitsPerChar: 5 });
var jr3 = x4({ prefix: "h", name: "base32z", alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769", bitsPerChar: 5 });
var Ur3 = Object.freeze({ __proto__: null, base32: Rr3, base32upper: Ar3, base32pad: xr2, base32padupper: Nr3, base32hex: $r3, base32hexupper: zr3, base32hexpad: Lr3, base32hexpadupper: kr3, base32z: jr3 });
var Fr3 = me4({ prefix: "k", name: "base36", alphabet: "0123456789abcdefghijklmnopqrstuvwxyz" });
var Mr3 = me4({ prefix: "K", name: "base36upper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
var Kr3 = Object.freeze({ __proto__: null, base36: Fr3, base36upper: Mr3 });
var Br3 = me4({ name: "base58btc", prefix: "z", alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" });
var Vr3 = me4({ name: "base58flickr", prefix: "Z", alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" });
var qr3 = Object.freeze({ __proto__: null, base58btc: Br3, base58flickr: Vr3 });
var Gr3 = x4({ prefix: "m", name: "base64", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bitsPerChar: 6 });
var Wr3 = x4({ prefix: "M", name: "base64pad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", bitsPerChar: 6 });
var Hr3 = x4({ prefix: "u", name: "base64url", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bitsPerChar: 6 });
var Yr3 = x4({ prefix: "U", name: "base64urlpad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=", bitsPerChar: 6 });
var Jr3 = Object.freeze({ __proto__: null, base64: Gr3, base64pad: Wr3, base64url: Hr3, base64urlpad: Yr3 });
var oi2 = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var Xr3 = oi2.reduce((r3, e2, t) => (r3[t] = e2, r3), []);
var Zr3 = oi2.reduce((r3, e2, t) => (r3[e2.codePointAt(0)] = t, r3), []);
function Qr3(r3) {
  return r3.reduce((e2, t) => (e2 += Xr3[t], e2), "");
}
function en3(r3) {
  const e2 = [];
  for (const t of r3) {
    const i3 = Zr3[t.codePointAt(0)];
    if (i3 === void 0) throw new Error(`Non-base256emoji character: ${t}`);
    e2.push(i3);
  }
  return new Uint8Array(e2);
}
var tn = Se4({ prefix: "\u{1F680}", name: "base256emoji", encode: Qr3, decode: en3 });
var sn2 = Object.freeze({ __proto__: null, base256emoji: tn });
var rn3 = ci2;
var ai = 128;
var nn2 = 127;
var on3 = ~nn2;
var an2 = Math.pow(2, 31);
function ci2(r3, e2, t) {
  e2 = e2 || [], t = t || 0;
  for (var i3 = t; r3 >= an2; ) e2[t++] = r3 & 255 | ai, r3 /= 128;
  for (; r3 & on3; ) e2[t++] = r3 & 255 | ai, r3 >>>= 7;
  return e2[t] = r3 | 0, ci2.bytes = t - i3 + 1, e2;
}
var cn2 = Ve4;
var hn2 = 128;
var hi2 = 127;
function Ve4(r3, i3) {
  var t = 0, i3 = i3 || 0, s2 = 0, n5 = i3, o4, a3 = r3.length;
  do {
    if (n5 >= a3) throw Ve4.bytes = 0, new RangeError("Could not decode varint");
    o4 = r3[n5++], t += s2 < 28 ? (o4 & hi2) << s2 : (o4 & hi2) * Math.pow(2, s2), s2 += 7;
  } while (o4 >= hn2);
  return Ve4.bytes = n5 - i3, t;
}
var ln2 = Math.pow(2, 7);
var un2 = Math.pow(2, 14);
var dn2 = Math.pow(2, 21);
var pn2 = Math.pow(2, 28);
var gn3 = Math.pow(2, 35);
var yn3 = Math.pow(2, 42);
var bn3 = Math.pow(2, 49);
var mn3 = Math.pow(2, 56);
var fn2 = Math.pow(2, 63);
var Dn2 = function(r3) {
  return r3 < ln2 ? 1 : r3 < un2 ? 2 : r3 < dn2 ? 3 : r3 < pn2 ? 4 : r3 < gn3 ? 5 : r3 < yn3 ? 6 : r3 < bn3 ? 7 : r3 < mn3 ? 8 : r3 < fn2 ? 9 : 10;
};
var vn3 = { encode: rn3, decode: cn2, encodingLength: Dn2 };
var li2 = vn3;
var ui = (r3, e2, t = 0) => (li2.encode(r3, e2, t), e2);
var di2 = (r3) => li2.encodingLength(r3);
var qe3 = (r3, e2) => {
  const t = e2.byteLength, i3 = di2(r3), s2 = i3 + di2(t), n5 = new Uint8Array(s2 + t);
  return ui(r3, n5, 0), ui(t, n5, i3), n5.set(e2, s2), new _n3(r3, t, e2, n5);
};
var _n3 = class {
  constructor(e2, t, i3, s2) {
    this.code = e2, this.size = t, this.digest = i3, this.bytes = s2;
  }
};
var pi2 = ({ name: r3, code: e2, encode: t }) => new wn2(r3, e2, t);
var wn2 = class {
  constructor(e2, t, i3) {
    this.name = e2, this.code = t, this.encode = i3;
  }
  digest(e2) {
    if (e2 instanceof Uint8Array) {
      const t = this.encode(e2);
      return t instanceof Uint8Array ? qe3(this.code, t) : t.then((i3) => qe3(this.code, i3));
    } else throw Error("Unknown type, must be binary type");
  }
};
var gi = (r3) => async (e2) => new Uint8Array(await crypto.subtle.digest(r3, e2));
var En3 = pi2({ name: "sha2-256", code: 18, encode: gi("SHA-256") });
var In3 = pi2({ name: "sha2-512", code: 19, encode: gi("SHA-512") });
var Tn3 = Object.freeze({ __proto__: null, sha256: En3, sha512: In3 });
var yi = 0;
var Cn3 = "identity";
var bi2 = ri2;
var Pn3 = (r3) => qe3(yi, bi2(r3));
var Sn3 = { code: yi, name: Cn3, encode: bi2, digest: Pn3 };
var On3 = Object.freeze({ __proto__: null, identity: Sn3 });
new TextEncoder(), new TextDecoder();
var mi = { ...vr2, ...wr3, ...Ir3, ...Cr3, ...Or3, ...Ur3, ...Kr3, ...qr3, ...Jr3, ...sn2 };
({ ...Tn3, ...On3 });
function fi2(r3) {
  return globalThis.Buffer != null ? new Uint8Array(r3.buffer, r3.byteOffset, r3.byteLength) : r3;
}
function Rn3(r3 = 0) {
  return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? fi2(globalThis.Buffer.allocUnsafe(r3)) : new Uint8Array(r3);
}
function Di2(r3, e2, t, i3) {
  return { name: r3, prefix: e2, encoder: { name: r3, prefix: e2, encode: t }, decoder: { decode: i3 } };
}
var vi2 = Di2("utf8", "u", (r3) => "u" + new TextDecoder("utf8").decode(r3), (r3) => new TextEncoder().encode(r3.substring(1)));
var Ge4 = Di2("ascii", "a", (r3) => {
  let e2 = "a";
  for (let t = 0; t < r3.length; t++) e2 += String.fromCharCode(r3[t]);
  return e2;
}, (r3) => {
  r3 = r3.substring(1);
  const e2 = Rn3(r3.length);
  for (let t = 0; t < r3.length; t++) e2[t] = r3.charCodeAt(t);
  return e2;
});
var An3 = { utf8: vi2, "utf-8": vi2, hex: mi.base16, latin1: Ge4, ascii: Ge4, binary: Ge4, ...mi };
function xn3(r3, e2 = "utf8") {
  const t = An3[e2];
  if (!t) throw new Error(`Unsupported encoding "${e2}"`);
  return (e2 === "utf8" || e2 === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? fi2(globalThis.Buffer.from(r3, "utf-8")) : t.decoder.decode(`${t.prefix}${r3}`);
}
var Nn3 = Object.defineProperty;
var $n3 = (r3, e2, t) => e2 in r3 ? Nn3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var J4 = (r3, e2, t) => $n3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var _i2 = class {
  constructor(e2, t) {
    this.core = e2, this.logger = t, J4(this, "keychain", /* @__PURE__ */ new Map()), J4(this, "name", Pt3), J4(this, "version", St3), J4(this, "initialized", false), J4(this, "storagePrefix", W4), J4(this, "init", async () => {
      if (!this.initialized) {
        const i3 = await this.getKeyChain();
        typeof i3 < "u" && (this.keychain = i3), this.initialized = true;
      }
    }), J4(this, "has", (i3) => (this.isInitialized(), this.keychain.has(i3))), J4(this, "set", async (i3, s2) => {
      this.isInitialized(), this.keychain.set(i3, s2), await this.persist();
    }), J4(this, "get", (i3) => {
      this.isInitialized();
      const s2 = this.keychain.get(i3);
      if (typeof s2 > "u") {
        const { message: n5 } = Bt2("NO_MATCHING_KEY", `${this.name}: ${i3}`);
        throw new Error(n5);
      }
      return s2;
    }), J4(this, "del", async (i3) => {
      this.isInitialized(), this.keychain.delete(i3), await this.persist();
    }), this.core = e2, this.logger = Re(t, this.name);
  }
  get context() {
    return ee(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setKeyChain(e2) {
    await this.core.storage.setItem(this.storageKey, vi(e2));
  }
  async getKeyChain() {
    const e2 = await this.core.storage.getItem(this.storageKey);
    return typeof e2 < "u" ? xi(e2) : void 0;
  }
  async persist() {
    await this.setKeyChain(this.keychain);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var zn3 = Object.defineProperty;
var Ln3 = (r3, e2, t) => e2 in r3 ? zn3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var R3 = (r3, e2, t) => Ln3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var wi = class {
  constructor(e2, t, i3) {
    this.core = e2, this.logger = t, R3(this, "name", Tt3), R3(this, "keychain"), R3(this, "randomSessionIdentifier", pa()), R3(this, "initialized", false), R3(this, "clientId"), R3(this, "init", async () => {
      this.initialized || (await this.keychain.init(), this.initialized = true);
    }), R3(this, "hasKeys", (s2) => (this.isInitialized(), this.keychain.has(s2))), R3(this, "getClientId", async () => {
      if (this.isInitialized(), this.clientId) return this.clientId;
      const s2 = await this.getClientSeed(), n5 = Po(s2), o4 = Qe(n5.publicKey);
      return this.clientId = o4, o4;
    }), R3(this, "generateKeyPair", () => {
      this.isInitialized();
      const s2 = ha();
      return this.setPrivateKey(s2.publicKey, s2.privateKey);
    }), R3(this, "signJWT", async (s2) => {
      this.isInitialized();
      const n5 = await this.getClientSeed(), o4 = Po(n5), a3 = this.randomSessionIdentifier, c5 = Ct2;
      return await Qo(a3, s2, c5, o4);
    }), R3(this, "generateSharedKey", (s2, n5, o4) => {
      this.isInitialized();
      const a3 = this.getPrivateKey(s2), c5 = ga(a3, n5);
      return this.setSymKey(c5, o4);
    }), R3(this, "setSymKey", async (s2, n5) => {
      this.isInitialized();
      const o4 = n5 || ba(s2);
      return await this.keychain.set(o4, s2), o4;
    }), R3(this, "deleteKeyPair", async (s2) => {
      this.isInitialized(), await this.keychain.del(s2);
    }), R3(this, "deleteSymKey", async (s2) => {
      this.isInitialized(), await this.keychain.del(s2);
    }), R3(this, "encode", async (s2, n5, o4) => {
      this.isInitialized();
      const a3 = ss(o4), c5 = safeJsonStringify(n5);
      if (Ia(a3)) return va(c5, o4?.encoding);
      if (Ba(a3)) {
        const y4 = a3.senderPublicKey, _3 = a3.receiverPublicKey;
        s2 = await this.generateSharedKey(y4, _3);
      }
      const h4 = this.getSymKey(s2), { type: l6, senderPublicKey: g2 } = a3;
      return ma({ type: l6, symKey: h4, message: c5, senderPublicKey: g2, encoding: o4?.encoding });
    }), R3(this, "decode", async (s2, n5, o4) => {
      this.isInitialized();
      const a3 = Ea(n5, o4);
      if (Ia(a3)) {
        const c5 = xa(n5, o4?.encoding);
        return safeJsonParse(c5);
      }
      if (Ba(a3)) {
        const c5 = a3.receiverPublicKey, h4 = a3.senderPublicKey;
        s2 = await this.generateSharedKey(c5, h4);
      }
      try {
        const c5 = this.getSymKey(s2), h4 = wa({ symKey: c5, encoded: n5, encoding: o4?.encoding });
        return safeJsonParse(h4);
      } catch (c5) {
        this.logger.error(`Failed to decode message from topic: '${s2}', clientId: '${await this.getClientId()}'`), this.logger.error(c5);
      }
    }), R3(this, "getPayloadType", (s2, n5 = oe2) => {
      const o4 = ze3({ encoded: s2, encoding: n5 });
      return Zt2(o4.type);
    }), R3(this, "getPayloadSenderPublicKey", (s2, n5 = oe2) => {
      const o4 = ze3({ encoded: s2, encoding: n5 });
      return o4.senderPublicKey ? toString2(o4.senderPublicKey, rt2) : void 0;
    }), this.core = e2, this.logger = Re(t, this.name), this.keychain = i3 || new _i2(this.core, this.logger);
  }
  get context() {
    return ee(this.logger);
  }
  async setPrivateKey(e2, t) {
    return await this.keychain.set(e2, t), e2;
  }
  getPrivateKey(e2) {
    return this.keychain.get(e2);
  }
  async getClientSeed() {
    let e2 = "";
    try {
      e2 = this.keychain.get(Me4);
    } catch {
      e2 = pa(), await this.keychain.set(Me4, e2);
    }
    return xn3(e2, "base16");
  }
  getSymKey(e2) {
    return this.keychain.get(e2);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var kn3 = Object.defineProperty;
var jn3 = Object.defineProperties;
var Un3 = Object.getOwnPropertyDescriptors;
var Ei = Object.getOwnPropertySymbols;
var Fn3 = Object.prototype.hasOwnProperty;
var Mn3 = Object.prototype.propertyIsEnumerable;
var We3 = (r3, e2, t) => e2 in r3 ? kn3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var Kn3 = (r3, e2) => {
  for (var t in e2 || (e2 = {})) Fn3.call(e2, t) && We3(r3, t, e2[t]);
  if (Ei) for (var t of Ei(e2)) Mn3.call(e2, t) && We3(r3, t, e2[t]);
  return r3;
};
var Bn3 = (r3, e2) => jn3(r3, Un3(e2));
var K5 = (r3, e2, t) => We3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Ii = class extends y3 {
  constructor(e2, t) {
    super(e2, t), this.logger = e2, this.core = t, K5(this, "messages", /* @__PURE__ */ new Map()), K5(this, "messagesWithoutClientAck", /* @__PURE__ */ new Map()), K5(this, "name", Ot3), K5(this, "version", Rt3), K5(this, "initialized", false), K5(this, "storagePrefix", W4), K5(this, "init", async () => {
      if (!this.initialized) {
        this.logger.trace("Initialized");
        try {
          const i3 = await this.getRelayerMessages();
          typeof i3 < "u" && (this.messages = i3);
          const s2 = await this.getRelayerMessagesWithoutClientAck();
          typeof s2 < "u" && (this.messagesWithoutClientAck = s2), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", size: this.messages.size });
        } catch (i3) {
          this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(i3);
        } finally {
          this.initialized = true;
        }
      }
    }), K5(this, "set", async (i3, s2, n5) => {
      this.isInitialized();
      const o4 = ya(s2);
      let a3 = this.messages.get(i3);
      if (typeof a3 > "u" && (a3 = {}), typeof a3[o4] < "u") return o4;
      if (a3[o4] = s2, this.messages.set(i3, a3), n5 === ye4.inbound) {
        const c5 = this.messagesWithoutClientAck.get(i3) || {};
        this.messagesWithoutClientAck.set(i3, Bn3(Kn3({}, c5), { [o4]: s2 }));
      }
      return await this.persist(), o4;
    }), K5(this, "get", (i3) => {
      this.isInitialized();
      let s2 = this.messages.get(i3);
      return typeof s2 > "u" && (s2 = {}), s2;
    }), K5(this, "getWithoutAck", (i3) => {
      this.isInitialized();
      const s2 = {};
      for (const n5 of i3) {
        const o4 = this.messagesWithoutClientAck.get(n5) || {};
        s2[n5] = Object.values(o4);
      }
      return s2;
    }), K5(this, "has", (i3, s2) => {
      this.isInitialized();
      const n5 = this.get(i3), o4 = ya(s2);
      return typeof n5[o4] < "u";
    }), K5(this, "ack", async (i3, s2) => {
      this.isInitialized();
      const n5 = this.messagesWithoutClientAck.get(i3);
      if (typeof n5 > "u") return;
      const o4 = ya(s2);
      delete n5[o4], Object.keys(n5).length === 0 ? this.messagesWithoutClientAck.delete(i3) : this.messagesWithoutClientAck.set(i3, n5), await this.persist();
    }), K5(this, "del", async (i3) => {
      this.isInitialized(), this.messages.delete(i3), this.messagesWithoutClientAck.delete(i3), await this.persist();
    }), this.logger = Re(e2, this.name), this.core = t;
  }
  get context() {
    return ee(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get storageKeyWithoutClientAck() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name + "_withoutClientAck";
  }
  async setRelayerMessages(e2) {
    await this.core.storage.setItem(this.storageKey, vi(e2));
  }
  async setRelayerMessagesWithoutClientAck(e2) {
    await this.core.storage.setItem(this.storageKeyWithoutClientAck, vi(e2));
  }
  async getRelayerMessages() {
    const e2 = await this.core.storage.getItem(this.storageKey);
    return typeof e2 < "u" ? xi(e2) : void 0;
  }
  async getRelayerMessagesWithoutClientAck() {
    const e2 = await this.core.storage.getItem(this.storageKeyWithoutClientAck);
    return typeof e2 < "u" ? xi(e2) : void 0;
  }
  async persist() {
    await this.setRelayerMessages(this.messages), await this.setRelayerMessagesWithoutClientAck(this.messagesWithoutClientAck);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Vn3 = Object.defineProperty;
var qn3 = Object.defineProperties;
var Gn3 = Object.getOwnPropertyDescriptors;
var Ti2 = Object.getOwnPropertySymbols;
var Wn3 = Object.prototype.hasOwnProperty;
var Hn3 = Object.prototype.propertyIsEnumerable;
var He3 = (r3, e2, t) => e2 in r3 ? Vn3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var ce2 = (r3, e2) => {
  for (var t in e2 || (e2 = {})) Wn3.call(e2, t) && He3(r3, t, e2[t]);
  if (Ti2) for (var t of Ti2(e2)) Hn3.call(e2, t) && He3(r3, t, e2[t]);
  return r3;
};
var Ci2 = (r3, e2) => qn3(r3, Gn3(e2));
var G3 = (r3, e2, t) => He3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Yn3 = class extends m2 {
  constructor(e2, t) {
    super(e2, t), this.relayer = e2, this.logger = t, G3(this, "events", new import_events7.EventEmitter()), G3(this, "name", xt3), G3(this, "queue", /* @__PURE__ */ new Map()), G3(this, "publishTimeout", (0, import_time4.toMiliseconds)(import_time4.ONE_MINUTE)), G3(this, "initialPublishTimeout", (0, import_time4.toMiliseconds)(import_time4.ONE_SECOND * 15)), G3(this, "needsTransportRestart", false), G3(this, "publish", async (i3, s2, n5) => {
      var o4, a3, c5, h4, l6;
      this.logger.debug("Publishing Payload"), this.logger.trace({ type: "method", method: "publish", params: { topic: i3, message: s2, opts: n5 } });
      const g2 = n5?.ttl || At2, y4 = n5?.prompt || false, _3 = n5?.tag || 0, u2 = n5?.id || getBigIntRpcId().toString(), m3 = Oa(Sa().protocol), D2 = { id: u2, method: n5?.publishMethod || m3.publish, params: ce2({ topic: i3, message: s2, ttl: g2, prompt: y4, tag: _3, attestation: n5?.attestation }, n5?.tvf) }, w3 = `Failed to publish payload, please try again. id:${u2} tag:${_3}`;
      try {
        Dt2((o4 = D2.params) == null ? void 0 : o4.prompt) && ((a3 = D2.params) == null || delete a3.prompt), Dt2((c5 = D2.params) == null ? void 0 : c5.tag) && ((h4 = D2.params) == null || delete h4.tag);
        const E3 = new Promise(async (L2) => {
          const I3 = ({ id: T3 }) => {
            var S4;
            ((S4 = D2.id) == null ? void 0 : S4.toString()) === T3.toString() && (this.removeRequestFromQueue(T3), this.relayer.events.removeListener(C3.publish, I3), L2());
          };
          this.relayer.events.on(C3.publish, I3);
          const k4 = Si(new Promise((T3, S4) => {
            this.rpcPublish(D2, n5).then(T3).catch((O4) => {
              this.logger.warn(O4, O4?.message), S4(O4);
            });
          }), this.initialPublishTimeout, `Failed initial publish, retrying.... id:${u2} tag:${_3}`);
          try {
            await k4, this.events.removeListener(C3.publish, I3);
          } catch (T3) {
            this.queue.set(u2, { request: D2, opts: n5, attempt: 1 }), this.logger.warn(T3, T3?.message);
          }
        });
        this.logger.trace({ type: "method", method: "publish", params: { id: u2, topic: i3, message: s2, opts: n5 } }), await Si(E3, this.publishTimeout, w3);
      } catch (E3) {
        if (this.logger.debug("Failed to Publish Payload"), this.logger.error(E3), (l6 = n5?.internal) != null && l6.throwOnFailedPublish) throw E3;
      } finally {
        this.queue.delete(u2);
      }
    }), G3(this, "publishCustom", async (i3) => {
      var s2, n5, o4, a3, c5;
      this.logger.debug("Publishing custom payload"), this.logger.trace({ type: "method", method: "publishCustom", params: i3 });
      const { payload: h4, opts: l6 = {} } = i3, { attestation: g2, tvf: y4, publishMethod: _3, prompt: u2, tag: m3, ttl: D2 = import_time4.FIVE_MINUTES } = l6, w3 = l6.id || getBigIntRpcId().toString(), E3 = Oa(Sa().protocol), L2 = _3 || E3.publish, I3 = { id: w3, method: L2, params: ce2(Ci2(ce2({}, h4), { ttl: D2, prompt: u2, tag: m3, attestation: g2 }), y4) }, k4 = `Failed to publish custom payload, please try again. id:${w3} tag:${m3}`;
      try {
        Dt2((s2 = I3.params) == null ? void 0 : s2.prompt) && ((n5 = I3.params) == null || delete n5.prompt), Dt2((o4 = I3.params) == null ? void 0 : o4.tag) && ((a3 = I3.params) == null || delete a3.tag);
        const T3 = new Promise(async (S4) => {
          const O4 = ({ id: Z2 }) => {
            var we5;
            ((we5 = I3.id) == null ? void 0 : we5.toString()) === Z2.toString() && (this.removeRequestFromQueue(Z2), this.relayer.events.removeListener(C3.publish, O4), S4());
          };
          this.relayer.events.on(C3.publish, O4);
          const te4 = Si(new Promise((Z2, we5) => {
            this.rpcPublish(I3, l6).then(Z2).catch((Ee4) => {
              this.logger.warn(Ee4, Ee4?.message), we5(Ee4);
            });
          }), this.initialPublishTimeout, `Failed initial custom payload publish, retrying.... method:${L2} id:${w3} tag:${m3}`);
          try {
            await te4, this.events.removeListener(C3.publish, O4);
          } catch (Z2) {
            this.queue.set(w3, { request: I3, opts: l6, attempt: 1 }), this.logger.warn(Z2, Z2?.message);
          }
        });
        this.logger.trace({ type: "method", method: "publish", params: { id: w3, payload: h4, opts: l6 } }), await Si(T3, this.publishTimeout, k4);
      } catch (T3) {
        if (this.logger.debug("Failed to Publish Payload"), this.logger.error(T3), (c5 = l6?.internal) != null && c5.throwOnFailedPublish) throw T3;
      } finally {
        this.queue.delete(w3);
      }
    }), G3(this, "on", (i3, s2) => {
      this.events.on(i3, s2);
    }), G3(this, "once", (i3, s2) => {
      this.events.once(i3, s2);
    }), G3(this, "off", (i3, s2) => {
      this.events.off(i3, s2);
    }), G3(this, "removeListener", (i3, s2) => {
      this.events.removeListener(i3, s2);
    }), this.relayer = e2, this.logger = Re(t, this.name), this.registerEventListeners();
  }
  get context() {
    return ee(this.logger);
  }
  async rpcPublish(e2, t) {
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "message", direction: "outgoing", request: e2 });
    const i3 = await this.relayer.request(e2);
    return this.relayer.events.emit(C3.publish, ce2(ce2({}, e2), t)), this.logger.debug("Successfully Published Payload"), i3;
  }
  removeRequestFromQueue(e2) {
    this.queue.delete(e2);
  }
  checkQueue() {
    this.queue.forEach(async (e2, t) => {
      var i3;
      const s2 = e2.attempt + 1;
      this.queue.set(t, Ci2(ce2({}, e2), { attempt: s2 })), this.logger.warn({}, `Publisher: queue->publishing: ${e2.request.id}, tag: ${(i3 = e2.request.params) == null ? void 0 : i3.tag}, attempt: ${s2}`), await this.rpcPublish(e2.request, e2.opts), this.logger.warn({}, `Publisher: queue->published: ${e2.request.id}`);
    });
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(r.pulse, () => {
      if (this.needsTransportRestart) {
        this.needsTransportRestart = false, this.relayer.events.emit(C3.connection_stalled);
        return;
      }
      this.checkQueue();
    }), this.relayer.on(C3.message_ack, (e2) => {
      this.removeRequestFromQueue(e2.id.toString());
    });
  }
};
var Jn3 = Object.defineProperty;
var Xn3 = (r3, e2, t) => e2 in r3 ? Jn3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var he4 = (r3, e2, t) => Xn3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Zn3 = class {
  constructor() {
    he4(this, "map", /* @__PURE__ */ new Map()), he4(this, "set", (e2, t) => {
      const i3 = this.get(e2);
      this.exists(e2, t) || this.map.set(e2, [...i3, t]);
    }), he4(this, "get", (e2) => this.map.get(e2) || []), he4(this, "exists", (e2, t) => this.get(e2).includes(t)), he4(this, "delete", (e2, t) => {
      if (typeof t > "u") {
        this.map.delete(e2);
        return;
      }
      if (!this.map.has(e2)) return;
      const i3 = this.get(e2);
      if (!this.exists(e2, t)) return;
      const s2 = i3.filter((n5) => n5 !== t);
      if (!s2.length) {
        this.map.delete(e2);
        return;
      }
      this.map.set(e2, s2);
    }), he4(this, "clear", () => {
      this.map.clear();
    });
  }
  get topics() {
    return Array.from(this.map.keys());
  }
};
var Qn2 = Object.defineProperty;
var eo3 = Object.defineProperties;
var to3 = Object.getOwnPropertyDescriptors;
var Pi2 = Object.getOwnPropertySymbols;
var io2 = Object.prototype.hasOwnProperty;
var so2 = Object.prototype.propertyIsEnumerable;
var Ye3 = (r3, e2, t) => e2 in r3 ? Qn2(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var fe3 = (r3, e2) => {
  for (var t in e2 || (e2 = {})) io2.call(e2, t) && Ye3(r3, t, e2[t]);
  if (Pi2) for (var t of Pi2(e2)) so2.call(e2, t) && Ye3(r3, t, e2[t]);
  return r3;
};
var Je3 = (r3, e2) => eo3(r3, to3(e2));
var f3 = (r3, e2, t) => Ye3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Si2 = class extends P2 {
  constructor(e2, t) {
    super(e2, t), this.relayer = e2, this.logger = t, f3(this, "subscriptions", /* @__PURE__ */ new Map()), f3(this, "topicMap", new Zn3()), f3(this, "events", new import_events7.EventEmitter()), f3(this, "name", Ft3), f3(this, "version", Mt3), f3(this, "pending", /* @__PURE__ */ new Map()), f3(this, "cached", []), f3(this, "initialized", false), f3(this, "storagePrefix", W4), f3(this, "subscribeTimeout", (0, import_time4.toMiliseconds)(import_time4.ONE_MINUTE)), f3(this, "initialSubscribeTimeout", (0, import_time4.toMiliseconds)(import_time4.ONE_SECOND * 15)), f3(this, "clientId"), f3(this, "batchSubscribeTopicsLimit", 500), f3(this, "init", async () => {
      this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), await this.restore()), this.initialized = true;
    }), f3(this, "subscribe", async (i3, s2) => {
      var n5;
      this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i3, opts: s2 } });
      try {
        const o4 = Sa(s2), a3 = { topic: i3, relay: o4, transportType: s2?.transportType };
        (n5 = s2?.internal) != null && n5.skipSubscribe || this.pending.set(i3, a3);
        const c5 = await this.rpcSubscribe(i3, o4, s2);
        return typeof c5 == "string" && (this.onSubscribe(c5, a3), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i3, opts: s2 } })), c5;
      } catch (o4) {
        throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(o4), o4;
      }
    }), f3(this, "unsubscribe", async (i3, s2) => {
      this.isInitialized(), typeof s2?.id < "u" ? await this.unsubscribeById(i3, s2.id, s2) : await this.unsubscribeByTopic(i3, s2);
    }), f3(this, "isSubscribed", (i3) => new Promise((s2) => {
      s2(this.topicMap.topics.includes(i3));
    })), f3(this, "isKnownTopic", (i3) => new Promise((s2) => {
      s2(this.topicMap.topics.includes(i3) || this.pending.has(i3) || this.cached.some((n5) => n5.topic === i3));
    })), f3(this, "on", (i3, s2) => {
      this.events.on(i3, s2);
    }), f3(this, "once", (i3, s2) => {
      this.events.once(i3, s2);
    }), f3(this, "off", (i3, s2) => {
      this.events.off(i3, s2);
    }), f3(this, "removeListener", (i3, s2) => {
      this.events.removeListener(i3, s2);
    }), f3(this, "start", async () => {
      await this.onConnect();
    }), f3(this, "stop", async () => {
      await this.onDisconnect();
    }), f3(this, "restart", async () => {
      await this.restore(), await this.onRestart();
    }), f3(this, "checkPending", async () => {
      if (this.pending.size === 0 && (!this.initialized || !this.relayer.connected)) return;
      const i3 = [];
      this.pending.forEach((s2) => {
        i3.push(s2);
      }), await this.batchSubscribe(i3);
    }), f3(this, "registerEventListeners", () => {
      this.relayer.core.heartbeat.on(r.pulse, async () => {
        await this.checkPending();
      }), this.events.on(j4.created, async (i3) => {
        const s2 = j4.created;
        this.logger.info(`Emitting ${s2}`), this.logger.debug({ type: "event", event: s2, data: i3 }), await this.persist();
      }), this.events.on(j4.deleted, async (i3) => {
        const s2 = j4.deleted;
        this.logger.info(`Emitting ${s2}`), this.logger.debug({ type: "event", event: s2, data: i3 }), await this.persist();
      });
    }), this.relayer = e2, this.logger = Re(t, this.name), this.clientId = "";
  }
  get context() {
    return ee(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.subscriptions.size;
  }
  get ids() {
    return Array.from(this.subscriptions.keys());
  }
  get values() {
    return Array.from(this.subscriptions.values());
  }
  get topics() {
    return this.topicMap.topics;
  }
  get hasAnyTopics() {
    return this.topicMap.topics.length > 0 || this.pending.size > 0 || this.cached.length > 0 || this.subscriptions.size > 0;
  }
  hasSubscription(e2, t) {
    let i3 = false;
    try {
      i3 = this.getSubscription(e2).topic === t;
    } catch {
    }
    return i3;
  }
  reset() {
    this.cached = [], this.initialized = true;
  }
  onDisable() {
    this.values.length > 0 && (this.cached = this.values), this.subscriptions.clear(), this.topicMap.clear();
  }
  async unsubscribeByTopic(e2, t) {
    const i3 = this.topicMap.get(e2);
    await Promise.all(i3.map(async (s2) => await this.unsubscribeById(e2, s2, t)));
  }
  async unsubscribeById(e2, t, i3) {
    this.logger.debug("Unsubscribing Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e2, id: t, opts: i3 } });
    try {
      const s2 = Sa(i3);
      await this.restartToComplete({ topic: e2, id: t, relay: s2 }), await this.rpcUnsubscribe(e2, t, s2);
      const n5 = zt2("USER_DISCONNECTED", `${this.name}, ${e2}`);
      await this.onUnsubscribe(e2, t, n5), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e2, id: t, opts: i3 } });
    } catch (s2) {
      throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(s2), s2;
    }
  }
  async rpcSubscribe(e2, t, i3) {
    var s2, n5;
    const o4 = await this.getSubscriptionId(e2);
    if ((s2 = i3?.internal) != null && s2.skipSubscribe) return o4;
    (!i3 || i3?.transportType === ee3.relay) && await this.restartToComplete({ topic: e2, id: e2, relay: t });
    const a3 = { method: Oa(t.protocol).subscribe, params: { topic: e2 } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: a3 });
    const c5 = (n5 = i3?.internal) == null ? void 0 : n5.throwOnFailedPublish;
    try {
      if (i3?.transportType === ee3.link_mode) return setTimeout(() => {
        (this.relayer.connected || this.relayer.connecting) && this.relayer.request(a3).catch((g2) => this.logger.warn(g2));
      }, (0, import_time4.toMiliseconds)(import_time4.ONE_SECOND)), o4;
      const h4 = new Promise(async (g2) => {
        const y4 = (_3) => {
          _3.topic === e2 && (this.events.removeListener(j4.created, y4), g2(_3.id));
        };
        this.events.on(j4.created, y4);
        try {
          const _3 = await Si(new Promise((u2, m3) => {
            this.relayer.request(a3).catch((D2) => {
              this.logger.warn(D2, D2?.message), m3(D2);
            }).then(u2);
          }), this.initialSubscribeTimeout, `Subscribing to ${e2} failed, please try again`);
          this.events.removeListener(j4.created, y4), g2(_3);
        } catch {
        }
      }), l6 = await Si(h4, this.subscribeTimeout, `Subscribing to ${e2} failed, please try again`);
      if (!l6 && c5) throw new Error(`Subscribing to ${e2} failed, please try again`);
      return l6 ? o4 : null;
    } catch (h4) {
      if (this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(C3.connection_stalled), c5) throw h4;
    }
    return null;
  }
  async rpcBatchSubscribe(e2) {
    if (!e2.length) return;
    const t = e2[0].relay, i3 = { method: Oa(t.protocol).batchSubscribe, params: { topics: e2.map((s2) => s2.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i3 });
    try {
      await await Si(new Promise((s2) => {
        this.relayer.request(i3).catch((n5) => this.logger.warn(n5)).then(s2);
      }), this.subscribeTimeout, "rpcBatchSubscribe failed, please try again");
    } catch {
      this.relayer.events.emit(C3.connection_stalled);
    }
  }
  async rpcBatchFetchMessages(e2) {
    if (!e2.length) return;
    const t = e2[0].relay, i3 = { method: Oa(t.protocol).batchFetchMessages, params: { topics: e2.map((n5) => n5.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i3 });
    let s2;
    try {
      s2 = await await Si(new Promise((n5, o4) => {
        this.relayer.request(i3).catch((a3) => {
          this.logger.warn(a3), o4(a3);
        }).then(n5);
      }), this.subscribeTimeout, "rpcBatchFetchMessages failed, please try again");
    } catch {
      this.relayer.events.emit(C3.connection_stalled);
    }
    return s2;
  }
  rpcUnsubscribe(e2, t, i3) {
    const s2 = { method: Oa(i3.protocol).unsubscribe, params: { topic: e2, id: t } };
    return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: s2 }), this.relayer.request(s2);
  }
  onSubscribe(e2, t) {
    this.setSubscription(e2, Je3(fe3({}, t), { id: e2 })), this.pending.delete(t.topic);
  }
  onBatchSubscribe(e2) {
    e2.length && e2.forEach((t) => {
      this.setSubscription(t.id, fe3({}, t)), this.pending.delete(t.topic);
    });
  }
  async onUnsubscribe(e2, t, i3) {
    this.events.removeAllListeners(t), this.hasSubscription(t, e2) && this.deleteSubscription(t, i3), await this.relayer.messages.del(e2);
  }
  async setRelayerSubscriptions(e2) {
    await this.relayer.core.storage.setItem(this.storageKey, e2);
  }
  async getRelayerSubscriptions() {
    return await this.relayer.core.storage.getItem(this.storageKey);
  }
  setSubscription(e2, t) {
    this.logger.debug("Setting subscription"), this.logger.trace({ type: "method", method: "setSubscription", id: e2, subscription: t }), this.addSubscription(e2, t);
  }
  addSubscription(e2, t) {
    this.subscriptions.set(e2, fe3({}, t)), this.topicMap.set(t.topic, e2), this.events.emit(j4.created, t);
  }
  getSubscription(e2) {
    this.logger.debug("Getting subscription"), this.logger.trace({ type: "method", method: "getSubscription", id: e2 });
    const t = this.subscriptions.get(e2);
    if (!t) {
      const { message: i3 } = Bt2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw new Error(i3);
    }
    return t;
  }
  deleteSubscription(e2, t) {
    this.logger.debug("Deleting subscription"), this.logger.trace({ type: "method", method: "deleteSubscription", id: e2, reason: t });
    const i3 = this.getSubscription(e2);
    this.subscriptions.delete(e2), this.topicMap.delete(i3.topic, e2), this.events.emit(j4.deleted, Je3(fe3({}, i3), { reason: t }));
  }
  async persist() {
    await this.setRelayerSubscriptions(this.values), this.events.emit(j4.sync);
  }
  async onRestart() {
    if (this.cached.length) {
      const e2 = [...this.cached], t = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
      for (let i3 = 0; i3 < t; i3++) {
        const s2 = e2.splice(0, this.batchSubscribeTopicsLimit);
        await this.batchSubscribe(s2);
      }
    }
    this.events.emit(j4.resubscribed);
  }
  async restore() {
    try {
      const e2 = await this.getRelayerSubscriptions();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.subscriptions.size && !e2.every((t) => {
        var i3;
        return t.topic === ((i3 = this.subscriptions.get(t.id)) == null ? void 0 : i3.topic);
      })) {
        const { message: t } = Bt2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({ type: "method", method: "restore", subscriptions: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e2);
    }
  }
  async batchSubscribe(e2) {
    e2.length && (await this.rpcBatchSubscribe(e2), this.onBatchSubscribe(await Promise.all(e2.map(async (t) => Je3(fe3({}, t), { id: await this.getSubscriptionId(t.topic) })))));
  }
  async batchFetchMessages(e2) {
    if (!e2.length) return;
    this.logger.trace(`Fetching batch messages for ${e2.length} subscriptions`);
    const t = await this.rpcBatchFetchMessages(e2);
    t && t.messages && (await Pi((0, import_time4.toMiliseconds)(import_time4.ONE_SECOND)), await this.relayer.handleBatchMessageEvents(t.messages));
  }
  async onConnect() {
    await this.restart(), this.reset();
  }
  onDisconnect() {
    this.onDisable();
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  async restartToComplete(e2) {
    !this.relayer.connected && !this.relayer.connecting && (this.cached.push(e2), await this.relayer.transportOpen());
  }
  async getClientId() {
    return this.clientId || (this.clientId = await this.relayer.core.crypto.getClientId()), this.clientId;
  }
  async getSubscriptionId(e2) {
    return ya(e2 + await this.getClientId());
  }
};
var ro3 = Object.defineProperty;
var Oi2 = Object.getOwnPropertySymbols;
var no3 = Object.prototype.hasOwnProperty;
var oo2 = Object.prototype.propertyIsEnumerable;
var Xe3 = (r3, e2, t) => e2 in r3 ? ro3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var Ri2 = (r3, e2) => {
  for (var t in e2 || (e2 = {})) no3.call(e2, t) && Xe3(r3, t, e2[t]);
  if (Oi2) for (var t of Oi2(e2)) oo2.call(e2, t) && Xe3(r3, t, e2[t]);
  return r3;
};
var p2 = (r3, e2, t) => Xe3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Ai2 = class extends d {
  constructor(e2) {
    var t;
    super(e2), p2(this, "protocol", "wc"), p2(this, "version", 2), p2(this, "core"), p2(this, "logger"), p2(this, "events", new import_events7.EventEmitter()), p2(this, "provider"), p2(this, "messages"), p2(this, "subscriber"), p2(this, "publisher"), p2(this, "name", zt3), p2(this, "transportExplicitlyClosed", false), p2(this, "initialized", false), p2(this, "connectionAttemptInProgress", false), p2(this, "relayUrl"), p2(this, "projectId"), p2(this, "packageName"), p2(this, "bundleId"), p2(this, "hasExperiencedNetworkDisruption", false), p2(this, "pingTimeout"), p2(this, "heartBeatTimeout", (0, import_time4.toMiliseconds)(import_time4.THIRTY_SECONDS + import_time4.FIVE_SECONDS)), p2(this, "reconnectTimeout"), p2(this, "connectPromise"), p2(this, "reconnectInProgress", false), p2(this, "requestsInFlight", []), p2(this, "connectTimeout", (0, import_time4.toMiliseconds)(import_time4.ONE_SECOND * 15)), p2(this, "request", async (i3) => {
      var s2, n5;
      this.logger.debug("Publishing Request Payload");
      const o4 = i3.id || getBigIntRpcId().toString();
      await this.toEstablishConnection();
      try {
        this.logger.trace({ id: o4, method: i3.method, topic: (s2 = i3.params) == null ? void 0 : s2.topic }, "relayer.request - publishing...");
        const a3 = `${o4}:${((n5 = i3.params) == null ? void 0 : n5.tag) || ""}`;
        this.requestsInFlight.push(a3);
        const c5 = await this.provider.request(i3);
        return this.requestsInFlight = this.requestsInFlight.filter((h4) => h4 !== a3), c5;
      } catch (a3) {
        throw this.logger.debug(`Failed to Publish Request: ${o4}`), a3;
      }
    }), p2(this, "resetPingTimeout", () => {
      rn2() && (clearTimeout(this.pingTimeout), this.pingTimeout = setTimeout(() => {
        var i3, s2, n5, o4;
        try {
          this.logger.debug({}, "pingTimeout: Connection stalled, terminating..."), (o4 = (n5 = (s2 = (i3 = this.provider) == null ? void 0 : i3.connection) == null ? void 0 : s2.socket) == null ? void 0 : n5.terminate) == null || o4.call(n5);
        } catch (a3) {
          this.logger.warn(a3, a3?.message);
        }
      }, this.heartBeatTimeout));
    }), p2(this, "onPayloadHandler", (i3) => {
      this.onProviderPayload(i3), this.resetPingTimeout();
    }), p2(this, "onConnectHandler", () => {
      this.logger.warn({}, "Relayer connected \u{1F6DC}"), this.startPingTimeout(), this.events.emit(C3.connect);
    }), p2(this, "onDisconnectHandler", () => {
      this.logger.warn({}, "Relayer disconnected \u{1F6D1}"), this.requestsInFlight = [], this.onProviderDisconnect();
    }), p2(this, "onProviderErrorHandler", (i3) => {
      this.logger.fatal(`Fatal socket error: ${i3.message}`), this.events.emit(C3.error, i3), this.logger.fatal("Fatal socket error received, closing transport"), this.transportClose();
    }), p2(this, "registerProviderListeners", () => {
      this.provider.on(M3.payload, this.onPayloadHandler), this.provider.on(M3.connect, this.onConnectHandler), this.provider.on(M3.disconnect, this.onDisconnectHandler), this.provider.on(M3.error, this.onProviderErrorHandler);
    }), this.core = e2.core, this.logger = Iu({ logger: (t = e2.logger) != null ? t : $t3, name: this.name }), this.messages = new Ii(this.logger, e2.core), this.subscriber = new Si2(this, this.logger), this.publisher = new Yn3(this, this.logger), this.projectId = e2?.projectId, this.relayUrl = e2?.relayUrl || Ke3, li() ? this.packageName = hi() : di() && (this.bundleId = hi()), this.provider = {};
  }
  async init() {
    this.logger.trace("Initialized"), this.registerEventListeners(), await Promise.all([this.messages.init(), this.subscriber.init()]), this.initialized = true, this.transportOpen().catch((e2) => this.logger.warn(e2, e2?.message));
  }
  get context() {
    return ee(this.logger);
  }
  get connected() {
    var e2, t, i3;
    return ((i3 = (t = (e2 = this.provider) == null ? void 0 : e2.connection) == null ? void 0 : t.socket) == null ? void 0 : i3.readyState) === 1 || false;
  }
  get connecting() {
    var e2, t, i3;
    return ((i3 = (t = (e2 = this.provider) == null ? void 0 : e2.connection) == null ? void 0 : t.socket) == null ? void 0 : i3.readyState) === 0 || this.connectPromise !== void 0 || false;
  }
  async publish(e2, t, i3) {
    this.isInitialized(), await this.publisher.publish(e2, t, i3), await this.recordMessageEvent({ topic: e2, message: t, publishedAt: Date.now(), transportType: ee3.relay }, ye4.outbound);
  }
  async publishCustom(e2) {
    this.isInitialized(), await this.publisher.publishCustom(e2);
  }
  async subscribe(e2, t) {
    var i3, s2, n5;
    this.isInitialized(), (!(t != null && t.transportType) || t?.transportType === "relay") && await this.toEstablishConnection();
    const o4 = typeof ((i3 = t?.internal) == null ? void 0 : i3.throwOnFailedPublish) > "u" ? true : (s2 = t?.internal) == null ? void 0 : s2.throwOnFailedPublish;
    let a3 = ((n5 = this.subscriber.topicMap.get(e2)) == null ? void 0 : n5[0]) || "", c5;
    const h4 = (l6) => {
      l6.topic === e2 && (this.subscriber.off(j4.created, h4), c5());
    };
    return await Promise.all([new Promise((l6) => {
      c5 = l6, this.subscriber.on(j4.created, h4);
    }), new Promise(async (l6, g2) => {
      a3 = await this.subscriber.subscribe(e2, Ri2({ internal: { throwOnFailedPublish: o4 } }, t)).catch((y4) => {
        o4 && g2(y4);
      }) || a3, l6();
    })]), a3;
  }
  async unsubscribe(e2, t) {
    this.isInitialized(), await this.subscriber.unsubscribe(e2, t);
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async transportDisconnect() {
    this.provider.disconnect && (this.hasExperiencedNetworkDisruption || this.connected) ? await Si(this.provider.disconnect(), 2e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.onProviderDisconnect();
  }
  async transportClose() {
    this.transportExplicitlyClosed = true, await this.transportDisconnect();
  }
  async transportOpen(e2) {
    if (!this.subscriber.hasAnyTopics) {
      this.logger.info("Starting WS connection skipped because the client has no topics to work with.");
      return;
    }
    if (this.connectPromise ? (this.logger.debug({}, "Waiting for existing connection attempt to resolve..."), await this.connectPromise, this.logger.debug({}, "Existing connection attempt resolved")) : (this.connectPromise = new Promise(async (t, i3) => {
      await this.connect(e2).then(t).catch(i3).finally(() => {
        this.connectPromise = void 0;
      });
    }), await this.connectPromise), !this.connected) throw new Error(`Couldn't establish socket connection to the relay server: ${this.relayUrl}`);
  }
  async restartTransport(e2) {
    this.logger.debug({}, "Restarting transport..."), !this.connectionAttemptInProgress && (this.relayUrl = e2 || this.relayUrl, await this.confirmOnlineStateOrThrow(), await this.transportClose(), await this.transportOpen());
  }
  async confirmOnlineStateOrThrow() {
    if (!await gu()) throw new Error("No internet connection detected. Please restart your network and try again.");
  }
  async handleBatchMessageEvents(e2) {
    if (e2?.length === 0) {
      this.logger.trace("Batch message events is empty. Ignoring...");
      return;
    }
    const t = e2.sort((i3, s2) => i3.publishedAt - s2.publishedAt);
    this.logger.debug(`Batch of ${t.length} message events sorted`);
    for (const i3 of t) try {
      await this.onMessageEvent(i3);
    } catch (s2) {
      this.logger.warn(s2, "Error while processing batch message event: " + s2?.message);
    }
    this.logger.trace(`Batch of ${t.length} message events processed`);
  }
  async onLinkMessageEvent(e2, t) {
    const { topic: i3 } = e2;
    if (!t.sessionExists) {
      const s2 = _i(import_time4.FIVE_MINUTES), n5 = { topic: i3, expiry: s2, relay: { protocol: "irn" }, active: false };
      await this.core.pairing.pairings.set(i3, n5);
    }
    this.events.emit(C3.message, e2), await this.recordMessageEvent(e2, ye4.inbound);
  }
  async connect(e2) {
    await this.confirmOnlineStateOrThrow(), e2 && e2 !== this.relayUrl && (this.relayUrl = e2, await this.transportDisconnect()), this.connectionAttemptInProgress = true, this.transportExplicitlyClosed = false;
    let t = 1;
    for (; t < 6; ) {
      try {
        if (this.transportExplicitlyClosed) break;
        this.logger.debug({}, `Connecting to ${this.relayUrl}, attempt: ${t}...`), await this.createProvider(), await new Promise(async (i3, s2) => {
          const n5 = () => {
            s2(new Error("Connection interrupted while trying to connect"));
          };
          this.provider.once(M3.disconnect, n5), await Si(new Promise((o4, a3) => {
            this.provider.connect().then(o4).catch(a3);
          }), this.connectTimeout, `Socket stalled when trying to connect to ${this.relayUrl}`).catch((o4) => {
            s2(o4);
          }).finally(() => {
            this.provider.off(M3.disconnect, n5), clearTimeout(this.reconnectTimeout);
          }), await new Promise(async (o4, a3) => {
            const c5 = () => {
              s2(new Error("Connection interrupted while trying to subscribe"));
            };
            this.provider.once(M3.disconnect, c5), await this.subscriber.start().then(o4).catch(a3).finally(() => {
              this.provider.off(M3.disconnect, c5);
            });
          }), this.hasExperiencedNetworkDisruption = false, i3();
        });
      } catch (i3) {
        await this.subscriber.stop();
        const s2 = i3;
        this.logger.warn({}, s2.message), this.hasExperiencedNetworkDisruption = true;
      } finally {
        this.connectionAttemptInProgress = false;
      }
      if (this.connected) {
        this.logger.debug({}, `Connected to ${this.relayUrl} successfully on attempt: ${t}`);
        break;
      }
      await new Promise((i3) => setTimeout(i3, (0, import_time4.toMiliseconds)(t * 1))), t++;
    }
  }
  startPingTimeout() {
    var e2, t, i3, s2, n5;
    if (rn2()) try {
      (t = (e2 = this.provider) == null ? void 0 : e2.connection) != null && t.socket && ((n5 = (s2 = (i3 = this.provider) == null ? void 0 : i3.connection) == null ? void 0 : s2.socket) == null || n5.on("ping", () => {
        this.resetPingTimeout();
      })), this.resetPingTimeout();
    } catch (o4) {
      this.logger.warn(o4, o4?.message);
    }
  }
  async createProvider() {
    this.provider.connection && this.unregisterProviderListeners();
    const e2 = await this.core.crypto.signJWT(this.relayUrl);
    this.provider = new o3(new f2(bi({ sdkVersion: Pe4, protocol: this.protocol, version: this.version, relayUrl: this.relayUrl, projectId: this.projectId, auth: e2, useOnCloseEvent: true, bundleId: this.bundleId, packageName: this.packageName }))), this.registerProviderListeners();
  }
  async recordMessageEvent(e2, t) {
    const { topic: i3, message: s2 } = e2;
    await this.messages.set(i3, s2, t);
  }
  async shouldIgnoreMessageEvent(e2) {
    const { topic: t, message: i3 } = e2;
    if (!i3 || i3.length === 0) return this.logger.warn(`Ignoring invalid/empty message: ${i3}`), true;
    if (!await this.subscriber.isKnownTopic(t)) return this.logger.warn(`Ignoring message for unknown topic ${t}`), true;
    const s2 = this.messages.has(t, i3);
    return s2 && this.logger.warn(`Ignoring duplicate message: ${i3}`), s2;
  }
  async onProviderPayload(e2) {
    if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({ type: "payload", direction: "incoming", payload: e2 }), isJsonRpcRequest(e2)) {
      if (!e2.method.endsWith(Lt3)) return;
      const t = e2.params, { topic: i3, message: s2, publishedAt: n5, attestation: o4 } = t.data, a3 = { topic: i3, message: s2, publishedAt: n5, transportType: ee3.relay, attestation: o4 };
      this.logger.debug("Emitting Relayer Payload"), this.logger.trace(Ri2({ type: "event", event: t.id }, a3)), this.events.emit(t.id, a3), await this.acknowledgePayload(e2), await this.onMessageEvent(a3);
    } else isJsonRpcResponse(e2) && this.events.emit(C3.message_ack, e2);
  }
  async onMessageEvent(e2) {
    await this.shouldIgnoreMessageEvent(e2) || (await this.recordMessageEvent(e2, ye4.inbound), this.events.emit(C3.message, e2));
  }
  async acknowledgePayload(e2) {
    const t = formatJsonRpcResult(e2.id, true);
    await this.provider.connection.send(t);
  }
  unregisterProviderListeners() {
    this.provider.off(M3.payload, this.onPayloadHandler), this.provider.off(M3.connect, this.onConnectHandler), this.provider.off(M3.disconnect, this.onDisconnectHandler), this.provider.off(M3.error, this.onProviderErrorHandler), clearTimeout(this.pingTimeout);
  }
  async registerEventListeners() {
    let e2 = await gu();
    bu(async (t) => {
      e2 !== t && (e2 = t, t ? await this.transportOpen().catch((i3) => this.logger.error(i3, i3?.message)) : (this.hasExperiencedNetworkDisruption = true, await this.transportDisconnect(), this.transportExplicitlyClosed = false));
    }), this.core.heartbeat.on(r.pulse, async () => {
      if (!this.transportExplicitlyClosed && !this.connected && yu()) try {
        await this.confirmOnlineStateOrThrow(), await this.transportOpen();
      } catch (t) {
        this.logger.warn(t, t?.message);
      }
    });
  }
  async onProviderDisconnect() {
    clearTimeout(this.pingTimeout), this.events.emit(C3.disconnect), this.connectionAttemptInProgress = false, !this.reconnectInProgress && (this.reconnectInProgress = true, await this.subscriber.stop(), this.subscriber.hasAnyTopics && (this.transportExplicitlyClosed || (this.reconnectTimeout = setTimeout(async () => {
      await this.transportOpen().catch((e2) => this.logger.error(e2, e2?.message)), this.reconnectTimeout = void 0, this.reconnectInProgress = false;
    }, (0, import_time4.toMiliseconds)(kt3)))));
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  async toEstablishConnection() {
    if (await this.confirmOnlineStateOrThrow(), !this.connected) {
      if (this.connectPromise) {
        await this.connectPromise;
        return;
      }
      await this.connect();
    }
  }
};
function ao3(r3, e2) {
  return r3 === e2 || Number.isNaN(r3) && Number.isNaN(e2);
}
function xi2(r3) {
  return Object.getOwnPropertySymbols(r3).filter((e2) => Object.prototype.propertyIsEnumerable.call(r3, e2));
}
function Ni2(r3) {
  return r3 == null ? r3 === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(r3);
}
var co3 = "[object RegExp]";
var ho2 = "[object String]";
var lo3 = "[object Number]";
var uo2 = "[object Boolean]";
var $i2 = "[object Arguments]";
var po3 = "[object Symbol]";
var go3 = "[object Date]";
var yo3 = "[object Map]";
var bo3 = "[object Set]";
var mo3 = "[object Array]";
var fo3 = "[object Function]";
var Do3 = "[object ArrayBuffer]";
var Ze3 = "[object Object]";
var vo3 = "[object Error]";
var _o3 = "[object DataView]";
var wo3 = "[object Uint8Array]";
var Eo3 = "[object Uint8ClampedArray]";
var Io3 = "[object Uint16Array]";
var To3 = "[object Uint32Array]";
var Co3 = "[object BigUint64Array]";
var Po3 = "[object Int8Array]";
var So3 = "[object Int16Array]";
var Oo3 = "[object Int32Array]";
var Ro3 = "[object BigInt64Array]";
var Ao3 = "[object Float32Array]";
var xo3 = "[object Float64Array]";
function No3() {
}
function zi2(r3) {
  if (!r3 || typeof r3 != "object") return false;
  const e2 = Object.getPrototypeOf(r3);
  return e2 === null || e2 === Object.prototype || Object.getPrototypeOf(e2) === null ? Object.prototype.toString.call(r3) === "[object Object]" : false;
}
function $o3(r3, e2, t) {
  return De4(r3, e2, void 0, void 0, void 0, void 0, t);
}
function De4(r3, e2, t, i3, s2, n5, o4) {
  const a3 = o4(r3, e2, t, i3, s2, n5);
  if (a3 !== void 0) return a3;
  if (typeof r3 == typeof e2) switch (typeof r3) {
    case "bigint":
    case "string":
    case "boolean":
    case "symbol":
    case "undefined":
      return r3 === e2;
    case "number":
      return r3 === e2 || Object.is(r3, e2);
    case "function":
      return r3 === e2;
    case "object":
      return ve4(r3, e2, n5, o4);
  }
  return ve4(r3, e2, n5, o4);
}
function ve4(r3, e2, t, i3) {
  if (Object.is(r3, e2)) return true;
  let s2 = Ni2(r3), n5 = Ni2(e2);
  if (s2 === $i2 && (s2 = Ze3), n5 === $i2 && (n5 = Ze3), s2 !== n5) return false;
  switch (s2) {
    case ho2:
      return r3.toString() === e2.toString();
    case lo3: {
      const c5 = r3.valueOf(), h4 = e2.valueOf();
      return ao3(c5, h4);
    }
    case uo2:
    case go3:
    case po3:
      return Object.is(r3.valueOf(), e2.valueOf());
    case co3:
      return r3.source === e2.source && r3.flags === e2.flags;
    case fo3:
      return r3 === e2;
  }
  t = t ?? /* @__PURE__ */ new Map();
  const o4 = t.get(r3), a3 = t.get(e2);
  if (o4 != null && a3 != null) return o4 === e2;
  t.set(r3, e2), t.set(e2, r3);
  try {
    switch (s2) {
      case yo3: {
        if (r3.size !== e2.size) return false;
        for (const [c5, h4] of r3.entries()) if (!e2.has(c5) || !De4(h4, e2.get(c5), c5, r3, e2, t, i3)) return false;
        return true;
      }
      case bo3: {
        if (r3.size !== e2.size) return false;
        const c5 = Array.from(r3.values()), h4 = Array.from(e2.values());
        for (let l6 = 0; l6 < c5.length; l6++) {
          const g2 = c5[l6], y4 = h4.findIndex((_3) => De4(g2, _3, void 0, r3, e2, t, i3));
          if (y4 === -1) return false;
          h4.splice(y4, 1);
        }
        return true;
      }
      case mo3:
      case wo3:
      case Eo3:
      case Io3:
      case To3:
      case Co3:
      case Po3:
      case So3:
      case Oo3:
      case Ro3:
      case Ao3:
      case xo3: {
        if (typeof Buffer < "u" && Buffer.isBuffer(r3) !== Buffer.isBuffer(e2) || r3.length !== e2.length) return false;
        for (let c5 = 0; c5 < r3.length; c5++) if (!De4(r3[c5], e2[c5], c5, r3, e2, t, i3)) return false;
        return true;
      }
      case Do3:
        return r3.byteLength !== e2.byteLength ? false : ve4(new Uint8Array(r3), new Uint8Array(e2), t, i3);
      case _o3:
        return r3.byteLength !== e2.byteLength || r3.byteOffset !== e2.byteOffset ? false : ve4(new Uint8Array(r3), new Uint8Array(e2), t, i3);
      case vo3:
        return r3.name === e2.name && r3.message === e2.message;
      case Ze3: {
        if (!(ve4(r3.constructor, e2.constructor, t, i3) || zi2(r3) && zi2(e2))) return false;
        const h4 = [...Object.keys(r3), ...xi2(r3)], l6 = [...Object.keys(e2), ...xi2(e2)];
        if (h4.length !== l6.length) return false;
        for (let g2 = 0; g2 < h4.length; g2++) {
          const y4 = h4[g2], _3 = r3[y4];
          if (!Object.hasOwn(e2, y4)) return false;
          const u2 = e2[y4];
          if (!De4(_3, u2, y4, r3, e2, t, i3)) return false;
        }
        return true;
      }
      default:
        return false;
    }
  } finally {
    t.delete(r3), t.delete(e2);
  }
}
function zo3(r3, e2) {
  return $o3(r3, e2, No3);
}
var Lo3 = Object.defineProperty;
var Li2 = Object.getOwnPropertySymbols;
var ko3 = Object.prototype.hasOwnProperty;
var jo3 = Object.prototype.propertyIsEnumerable;
var Qe2 = (r3, e2, t) => e2 in r3 ? Lo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var ki2 = (r3, e2) => {
  for (var t in e2 || (e2 = {})) ko3.call(e2, t) && Qe2(r3, t, e2[t]);
  if (Li2) for (var t of Li2(e2)) jo3.call(e2, t) && Qe2(r3, t, e2[t]);
  return r3;
};
var U2 = (r3, e2, t) => Qe2(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var ji2 = class extends f {
  constructor(e2, t, i3, s2 = W4, n5 = void 0) {
    super(e2, t, i3, s2), this.core = e2, this.logger = t, this.name = i3, U2(this, "map", /* @__PURE__ */ new Map()), U2(this, "version", jt3), U2(this, "cached", []), U2(this, "initialized", false), U2(this, "getKey"), U2(this, "storagePrefix", W4), U2(this, "recentlyDeleted", []), U2(this, "recentlyDeletedLimit", 200), U2(this, "init", async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((o4) => {
        this.getKey && o4 !== null && !Dt2(o4) ? this.map.set(this.getKey(o4), o4) : Ja(o4) ? this.map.set(o4.id, o4) : Qa(o4) && this.map.set(o4.topic, o4);
      }), this.cached = [], this.initialized = true);
    }), U2(this, "set", async (o4, a3) => {
      this.isInitialized(), this.map.has(o4) ? await this.update(o4, a3) : (this.logger.debug("Setting value"), this.logger.trace({ type: "method", method: "set", key: o4, value: a3 }), this.map.set(o4, a3), await this.persist());
    }), U2(this, "get", (o4) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({ type: "method", method: "get", key: o4 }), this.getData(o4))), U2(this, "getAll", (o4) => (this.isInitialized(), o4 ? this.values.filter((a3) => Object.keys(o4).every((c5) => zo3(a3[c5], o4[c5]))) : this.values)), U2(this, "update", async (o4, a3) => {
      this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({ type: "method", method: "update", key: o4, update: a3 });
      const c5 = ki2(ki2({}, this.getData(o4)), a3);
      this.map.set(o4, c5), await this.persist();
    }), U2(this, "delete", async (o4, a3) => {
      this.isInitialized(), this.map.has(o4) && (this.logger.debug("Deleting value"), this.logger.trace({ type: "method", method: "delete", key: o4, reason: a3 }), this.map.delete(o4), this.addToRecentlyDeleted(o4), await this.persist());
    }), this.logger = Re(t, this.name), this.storagePrefix = s2, this.getKey = n5;
  }
  get context() {
    return ee(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.map.size;
  }
  get keys() {
    return Array.from(this.map.keys());
  }
  get values() {
    return Array.from(this.map.values());
  }
  addToRecentlyDeleted(e2) {
    this.recentlyDeleted.push(e2), this.recentlyDeleted.length >= this.recentlyDeletedLimit && this.recentlyDeleted.splice(0, this.recentlyDeletedLimit / 2);
  }
  async setDataStore(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getDataStore() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getData(e2) {
    const t = this.map.get(e2);
    if (!t) {
      if (this.recentlyDeleted.includes(e2)) {
        const { message: s2 } = Bt2("MISSING_OR_INVALID", `Record was recently deleted - ${this.name}: ${e2}`);
        throw this.logger.error(s2), new Error(s2);
      }
      const { message: i3 } = Bt2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw this.logger.error(i3), new Error(i3);
    }
    return t;
  }
  async persist() {
    await this.setDataStore(this.values);
  }
  async restore() {
    try {
      const e2 = await this.getDataStore();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.map.size) {
        const { message: t } = Bt2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({ type: "method", method: "restore", value: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e2);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Uo3 = Object.defineProperty;
var Fo3 = (r3, e2, t) => e2 in r3 ? Uo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var d3 = (r3, e2, t) => Fo3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Ui2 = class {
  constructor(e2, t) {
    this.core = e2, this.logger = t, d3(this, "name", Kt3), d3(this, "version", Bt3), d3(this, "events", new import_events7.default()), d3(this, "pairings"), d3(this, "initialized", false), d3(this, "storagePrefix", W4), d3(this, "ignoredPayloadTypes", [ie2]), d3(this, "registeredMethods", []), d3(this, "init", async () => {
      this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = true, this.logger.trace("Initialized"));
    }), d3(this, "register", ({ methods: i3 }) => {
      this.isInitialized(), this.registeredMethods = [.../* @__PURE__ */ new Set([...this.registeredMethods, ...i3])];
    }), d3(this, "create", async (i3) => {
      this.isInitialized();
      const s2 = pa(), n5 = await this.core.crypto.setSymKey(s2), o4 = _i(import_time4.FIVE_MINUTES), a3 = { protocol: Nt3 }, c5 = { topic: n5, expiry: o4, relay: a3, active: false, methods: i3?.methods }, h4 = ja({ protocol: this.core.protocol, version: this.core.version, topic: n5, symKey: s2, relay: a3, expiryTimestamp: o4, methods: i3?.methods });
      return this.events.emit(ae3.create, c5), this.core.expirer.set(n5, o4), await this.pairings.set(n5, c5), await this.core.relayer.subscribe(n5, { transportType: i3?.transportType, internal: i3?.internal }), { topic: n5, uri: h4 };
    }), d3(this, "pair", async (i3) => {
      this.isInitialized();
      const s2 = this.core.eventClient.createEvent({ properties: { topic: i3?.uri, trace: [Y2.pairing_started] } });
      this.isValidPair(i3, s2);
      const { topic: n5, symKey: o4, relay: a3, expiryTimestamp: c5, methods: h4 } = Ca(i3.uri);
      s2.props.properties.topic = n5, s2.addTrace(Y2.pairing_uri_validation_success), s2.addTrace(Y2.pairing_uri_not_expired);
      let l6;
      if (this.pairings.keys.includes(n5)) {
        if (l6 = this.pairings.get(n5), s2.addTrace(Y2.existing_pairing), l6.active) throw s2.setError(X3.active_pairing_already_exists), new Error(`Pairing already exists: ${n5}. Please try again with a new connection URI.`);
        s2.addTrace(Y2.pairing_not_expired);
      }
      const g2 = c5 || _i(import_time4.FIVE_MINUTES), y4 = { topic: n5, relay: a3, expiry: g2, active: false, methods: h4 };
      this.core.expirer.set(n5, g2), await this.pairings.set(n5, y4), s2.addTrace(Y2.store_new_pairing), i3.activatePairing && await this.activate({ topic: n5 }), this.events.emit(ae3.create, y4), s2.addTrace(Y2.emit_inactive_pairing), this.core.crypto.keychain.has(n5) || await this.core.crypto.setSymKey(o4, n5), s2.addTrace(Y2.subscribing_pairing_topic);
      try {
        await this.core.relayer.confirmOnlineStateOrThrow();
      } catch {
        s2.setError(X3.no_internet_connection);
      }
      try {
        await this.core.relayer.subscribe(n5, { relay: a3 });
      } catch (_3) {
        throw s2.setError(X3.subscribe_pairing_topic_failure), _3;
      }
      return s2.addTrace(Y2.subscribe_pairing_topic_success), y4;
    }), d3(this, "activate", async ({ topic: i3 }) => {
      this.isInitialized();
      const s2 = _i(import_time4.FIVE_MINUTES);
      this.core.expirer.set(i3, s2), await this.pairings.update(i3, { active: true, expiry: s2 });
    }), d3(this, "ping", async (i3) => {
      this.isInitialized(), await this.isValidPing(i3), this.logger.warn("ping() is deprecated and will be removed in the next major release.");
      const { topic: s2 } = i3;
      if (this.pairings.keys.includes(s2)) {
        const n5 = await this.sendRequest(s2, "wc_pairingPing", {}), { done: o4, resolve: a3, reject: c5 } = Ai();
        this.events.once($i("pairing_ping", n5), ({ error: h4 }) => {
          h4 ? c5(h4) : a3();
        }), await o4();
      }
    }), d3(this, "updateExpiry", async ({ topic: i3, expiry: s2 }) => {
      this.isInitialized(), await this.pairings.update(i3, { expiry: s2 });
    }), d3(this, "updateMetadata", async ({ topic: i3, metadata: s2 }) => {
      this.isInitialized(), await this.pairings.update(i3, { peerMetadata: s2 });
    }), d3(this, "getPairings", () => (this.isInitialized(), this.pairings.values)), d3(this, "disconnect", async (i3) => {
      this.isInitialized(), await this.isValidDisconnect(i3);
      const { topic: s2 } = i3;
      this.pairings.keys.includes(s2) && (await this.sendRequest(s2, "wc_pairingDelete", zt2("USER_DISCONNECTED")), await this.deletePairing(s2));
    }), d3(this, "formatUriFromPairing", (i3) => {
      this.isInitialized();
      const { topic: s2, relay: n5, expiry: o4, methods: a3 } = i3, c5 = this.core.crypto.keychain.get(s2);
      return ja({ protocol: this.core.protocol, version: this.core.version, topic: s2, symKey: c5, relay: n5, expiryTimestamp: o4, methods: a3 });
    }), d3(this, "sendRequest", async (i3, s2, n5) => {
      const o4 = formatJsonRpcRequest(s2, n5), a3 = await this.core.crypto.encode(i3, o4), c5 = oe3[s2].req;
      return this.core.history.set(i3, o4), this.core.relayer.publish(i3, a3, c5), o4.id;
    }), d3(this, "sendResult", async (i3, s2, n5) => {
      const o4 = formatJsonRpcResult(i3, n5), a3 = await this.core.crypto.encode(s2, o4), c5 = (await this.core.history.get(s2, i3)).request.method, h4 = oe3[c5].res;
      await this.core.relayer.publish(s2, a3, h4), await this.core.history.resolve(o4);
    }), d3(this, "sendError", async (i3, s2, n5) => {
      const o4 = formatJsonRpcError(i3, n5), a3 = await this.core.crypto.encode(s2, o4), c5 = (await this.core.history.get(s2, i3)).request.method, h4 = oe3[c5] ? oe3[c5].res : oe3.unregistered_method.res;
      await this.core.relayer.publish(s2, a3, h4), await this.core.history.resolve(o4);
    }), d3(this, "deletePairing", async (i3, s2) => {
      await this.core.relayer.unsubscribe(i3), await Promise.all([this.pairings.delete(i3, zt2("USER_DISCONNECTED")), this.core.crypto.deleteSymKey(i3), s2 ? Promise.resolve() : this.core.expirer.del(i3)]);
    }), d3(this, "cleanup", async () => {
      const i3 = this.pairings.getAll().filter((s2) => Ri(s2.expiry));
      await Promise.all(i3.map((s2) => this.deletePairing(s2.topic)));
    }), d3(this, "onRelayEventRequest", async (i3) => {
      const { topic: s2, payload: n5 } = i3;
      switch (n5.method) {
        case "wc_pairingPing":
          return await this.onPairingPingRequest(s2, n5);
        case "wc_pairingDelete":
          return await this.onPairingDeleteRequest(s2, n5);
        default:
          return await this.onUnknownRpcMethodRequest(s2, n5);
      }
    }), d3(this, "onRelayEventResponse", async (i3) => {
      const { topic: s2, payload: n5 } = i3, o4 = (await this.core.history.get(s2, n5.id)).request.method;
      switch (o4) {
        case "wc_pairingPing":
          return this.onPairingPingResponse(s2, n5);
        default:
          return this.onUnknownRpcMethodResponse(o4);
      }
    }), d3(this, "onPairingPingRequest", async (i3, s2) => {
      const { id: n5 } = s2;
      try {
        this.isValidPing({ topic: i3 }), await this.sendResult(n5, i3, true), this.events.emit(ae3.ping, { id: n5, topic: i3 });
      } catch (o4) {
        await this.sendError(n5, i3, o4), this.logger.error(o4);
      }
    }), d3(this, "onPairingPingResponse", (i3, s2) => {
      const { id: n5 } = s2;
      setTimeout(() => {
        isJsonRpcResult(s2) ? this.events.emit($i("pairing_ping", n5), {}) : isJsonRpcError(s2) && this.events.emit($i("pairing_ping", n5), { error: s2.error });
      }, 500);
    }), d3(this, "onPairingDeleteRequest", async (i3, s2) => {
      const { id: n5 } = s2;
      try {
        this.isValidDisconnect({ topic: i3 }), await this.deletePairing(i3), this.events.emit(ae3.delete, { id: n5, topic: i3 });
      } catch (o4) {
        await this.sendError(n5, i3, o4), this.logger.error(o4);
      }
    }), d3(this, "onUnknownRpcMethodRequest", async (i3, s2) => {
      const { id: n5, method: o4 } = s2;
      try {
        if (this.registeredMethods.includes(o4)) return;
        const a3 = zt2("WC_METHOD_UNSUPPORTED", o4);
        await this.sendError(n5, i3, a3), this.logger.error(a3);
      } catch (a3) {
        await this.sendError(n5, i3, a3), this.logger.error(a3);
      }
    }), d3(this, "onUnknownRpcMethodResponse", (i3) => {
      this.registeredMethods.includes(i3) || this.logger.error(zt2("WC_METHOD_UNSUPPORTED", i3));
    }), d3(this, "isValidPair", (i3, s2) => {
      var n5;
      if (!ou(i3)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", `pair() params: ${i3}`);
        throw s2.setError(X3.malformed_pairing_uri), new Error(a3);
      }
      if (!Xa(i3.uri)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", `pair() uri: ${i3.uri}`);
        throw s2.setError(X3.malformed_pairing_uri), new Error(a3);
      }
      const o4 = Ca(i3?.uri);
      if (!((n5 = o4?.relay) != null && n5.protocol)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", "pair() uri#relay-protocol");
        throw s2.setError(X3.malformed_pairing_uri), new Error(a3);
      }
      if (!(o4 != null && o4.symKey)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", "pair() uri#symKey");
        throw s2.setError(X3.malformed_pairing_uri), new Error(a3);
      }
      if (o4 != null && o4.expiryTimestamp && (0, import_time4.toMiliseconds)(o4?.expiryTimestamp) < Date.now()) {
        s2.setError(X3.pairing_expired);
        const { message: a3 } = Bt2("EXPIRED", "pair() URI has expired. Please try again with a new connection URI.");
        throw new Error(a3);
      }
    }), d3(this, "isValidPing", async (i3) => {
      if (!ou(i3)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `ping() params: ${i3}`);
        throw new Error(n5);
      }
      const { topic: s2 } = i3;
      await this.isValidPairingTopic(s2);
    }), d3(this, "isValidDisconnect", async (i3) => {
      if (!ou(i3)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `disconnect() params: ${i3}`);
        throw new Error(n5);
      }
      const { topic: s2 } = i3;
      await this.isValidPairingTopic(s2);
    }), d3(this, "isValidPairingTopic", async (i3) => {
      if (!ft2(i3, false)) {
        const { message: s2 } = Bt2("MISSING_OR_INVALID", `pairing topic should be a string: ${i3}`);
        throw new Error(s2);
      }
      if (!this.pairings.keys.includes(i3)) {
        const { message: s2 } = Bt2("NO_MATCHING_KEY", `pairing topic doesn't exist: ${i3}`);
        throw new Error(s2);
      }
      if (Ri(this.pairings.get(i3).expiry)) {
        await this.deletePairing(i3);
        const { message: s2 } = Bt2("EXPIRED", `pairing topic: ${i3}`);
        throw new Error(s2);
      }
    }), this.core = e2, this.logger = Re(t, this.name), this.pairings = new ji2(this.core, this.logger, this.name, this.storagePrefix);
  }
  get context() {
    return ee(this.logger);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  registerRelayerEvents() {
    this.core.relayer.on(C3.message, async (e2) => {
      const { topic: t, message: i3, transportType: s2 } = e2;
      if (this.pairings.keys.includes(t) && s2 !== ee3.link_mode && !this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i3))) try {
        const n5 = await this.core.crypto.decode(t, i3);
        isJsonRpcRequest(n5) ? (this.core.history.set(t, n5), await this.onRelayEventRequest({ topic: t, payload: n5 })) : isJsonRpcResponse(n5) && (await this.core.history.resolve(n5), await this.onRelayEventResponse({ topic: t, payload: n5 }), this.core.history.delete(t, n5.id)), await this.core.relayer.messages.ack(t, i3);
      } catch (n5) {
        this.logger.error(n5);
      }
    });
  }
  registerExpirerEvents() {
    this.core.expirer.on(q2.expired, async (e2) => {
      const { topic: t } = Ui(e2.target);
      t && this.pairings.keys.includes(t) && (await this.deletePairing(t, true), this.events.emit(ae3.expire, { topic: t }));
    });
  }
};
var Mo3 = Object.defineProperty;
var Ko3 = (r3, e2, t) => e2 in r3 ? Mo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var N10 = (r3, e2, t) => Ko3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Fi2 = class extends I2 {
  constructor(e2, t) {
    super(e2, t), this.core = e2, this.logger = t, N10(this, "records", /* @__PURE__ */ new Map()), N10(this, "events", new import_events7.EventEmitter()), N10(this, "name", Vt3), N10(this, "version", qt3), N10(this, "cached", []), N10(this, "initialized", false), N10(this, "storagePrefix", W4), N10(this, "init", async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i3) => this.records.set(i3.id, i3)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }), N10(this, "set", (i3, s2, n5) => {
      if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({ type: "method", method: "set", topic: i3, request: s2, chainId: n5 }), this.records.has(s2.id)) return;
      const o4 = { id: s2.id, topic: i3, request: { method: s2.method, params: s2.params || null }, chainId: n5, expiry: _i(import_time4.THIRTY_DAYS) };
      this.records.set(o4.id, o4), this.persist(), this.events.emit(V2.created, o4);
    }), N10(this, "resolve", async (i3) => {
      if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({ type: "method", method: "update", response: i3 }), !this.records.has(i3.id)) return;
      const s2 = await this.getRecord(i3.id);
      typeof s2.response > "u" && (s2.response = isJsonRpcError(i3) ? { error: i3.error } : { result: i3.result }, this.records.set(s2.id, s2), this.persist(), this.events.emit(V2.updated, s2));
    }), N10(this, "get", async (i3, s2) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({ type: "method", method: "get", topic: i3, id: s2 }), await this.getRecord(s2))), N10(this, "delete", (i3, s2) => {
      this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({ type: "method", method: "delete", id: s2 }), this.values.forEach((n5) => {
        if (n5.topic === i3) {
          if (typeof s2 < "u" && n5.id !== s2) return;
          this.records.delete(n5.id), this.events.emit(V2.deleted, n5);
        }
      }), this.persist();
    }), N10(this, "exists", async (i3, s2) => (this.isInitialized(), this.records.has(s2) ? (await this.getRecord(s2)).topic === i3 : false)), N10(this, "on", (i3, s2) => {
      this.events.on(i3, s2);
    }), N10(this, "once", (i3, s2) => {
      this.events.once(i3, s2);
    }), N10(this, "off", (i3, s2) => {
      this.events.off(i3, s2);
    }), N10(this, "removeListener", (i3, s2) => {
      this.events.removeListener(i3, s2);
    }), this.logger = Re(t, this.name);
  }
  get context() {
    return ee(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get size() {
    return this.records.size;
  }
  get keys() {
    return Array.from(this.records.keys());
  }
  get values() {
    return Array.from(this.records.values());
  }
  get pending() {
    const e2 = [];
    return this.values.forEach((t) => {
      if (typeof t.response < "u") return;
      const i3 = { topic: t.topic, request: formatJsonRpcRequest(t.request.method, t.request.params, t.id), chainId: t.chainId };
      return e2.push(i3);
    }), e2;
  }
  async setJsonRpcRecords(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getJsonRpcRecords() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getRecord(e2) {
    this.isInitialized();
    const t = this.records.get(e2);
    if (!t) {
      const { message: i3 } = Bt2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw new Error(i3);
    }
    return t;
  }
  async persist() {
    await this.setJsonRpcRecords(this.values), this.events.emit(V2.sync);
  }
  async restore() {
    try {
      const e2 = await this.getJsonRpcRecords();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.records.size) {
        const { message: t } = Bt2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", records: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e2);
    }
  }
  registerEventListeners() {
    this.events.on(V2.created, (e2) => {
      const t = V2.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 });
    }), this.events.on(V2.updated, (e2) => {
      const t = V2.updated;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 });
    }), this.events.on(V2.deleted, (e2) => {
      const t = V2.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 });
    }), this.core.heartbeat.on(r.pulse, () => {
      this.cleanup();
    });
  }
  cleanup() {
    try {
      this.isInitialized();
      let e2 = false;
      this.records.forEach((t) => {
        (0, import_time4.toMiliseconds)(t.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${t.id}`), this.records.delete(t.id), this.events.emit(V2.deleted, t, false), e2 = true);
      }), e2 && this.persist();
    } catch (e2) {
      this.logger.warn(e2);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Bo3 = Object.defineProperty;
var Vo3 = (r3, e2, t) => e2 in r3 ? Bo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var z3 = (r3, e2, t) => Vo3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Mi2 = class extends S2 {
  constructor(e2, t) {
    super(e2, t), this.core = e2, this.logger = t, z3(this, "expirations", /* @__PURE__ */ new Map()), z3(this, "events", new import_events7.EventEmitter()), z3(this, "name", Gt3), z3(this, "version", Wt3), z3(this, "cached", []), z3(this, "initialized", false), z3(this, "storagePrefix", W4), z3(this, "init", async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i3) => this.expirations.set(i3.target, i3)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }), z3(this, "has", (i3) => {
      try {
        const s2 = this.formatTarget(i3);
        return typeof this.getExpiration(s2) < "u";
      } catch {
        return false;
      }
    }), z3(this, "set", (i3, s2) => {
      this.isInitialized();
      const n5 = this.formatTarget(i3), o4 = { target: n5, expiry: s2 };
      this.expirations.set(n5, o4), this.checkExpiry(n5, o4), this.events.emit(q2.created, { target: n5, expiration: o4 });
    }), z3(this, "get", (i3) => {
      this.isInitialized();
      const s2 = this.formatTarget(i3);
      return this.getExpiration(s2);
    }), z3(this, "del", (i3) => {
      if (this.isInitialized(), this.has(i3)) {
        const s2 = this.formatTarget(i3), n5 = this.getExpiration(s2);
        this.expirations.delete(s2), this.events.emit(q2.deleted, { target: s2, expiration: n5 });
      }
    }), z3(this, "on", (i3, s2) => {
      this.events.on(i3, s2);
    }), z3(this, "once", (i3, s2) => {
      this.events.once(i3, s2);
    }), z3(this, "off", (i3, s2) => {
      this.events.off(i3, s2);
    }), z3(this, "removeListener", (i3, s2) => {
      this.events.removeListener(i3, s2);
    }), this.logger = Re(t, this.name);
  }
  get context() {
    return ee(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.expirations.size;
  }
  get keys() {
    return Array.from(this.expirations.keys());
  }
  get values() {
    return Array.from(this.expirations.values());
  }
  formatTarget(e2) {
    if (typeof e2 == "string") return Oi(e2);
    if (typeof e2 == "number") return Ni(e2);
    const { message: t } = Bt2("UNKNOWN_TYPE", `Target type: ${typeof e2}`);
    throw new Error(t);
  }
  async setExpirations(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getExpirations() {
    return await this.core.storage.getItem(this.storageKey);
  }
  async persist() {
    await this.setExpirations(this.values), this.events.emit(q2.sync);
  }
  async restore() {
    try {
      const e2 = await this.getExpirations();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.expirations.size) {
        const { message: t } = Bt2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({ type: "method", method: "restore", expirations: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e2);
    }
  }
  getExpiration(e2) {
    const t = this.expirations.get(e2);
    if (!t) {
      const { message: i3 } = Bt2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw this.logger.warn(i3), new Error(i3);
    }
    return t;
  }
  checkExpiry(e2, t) {
    const { expiry: i3 } = t;
    (0, import_time4.toMiliseconds)(i3) - Date.now() <= 0 && this.expire(e2, t);
  }
  expire(e2, t) {
    this.expirations.delete(e2), this.events.emit(q2.expired, { target: e2, expiration: t });
  }
  checkExpirations() {
    this.core.relayer.connected && this.expirations.forEach((e2, t) => this.checkExpiry(t, e2));
  }
  registerEventListeners() {
    this.core.heartbeat.on(r.pulse, () => this.checkExpirations()), this.events.on(q2.created, (e2) => {
      const t = q2.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    }), this.events.on(q2.expired, (e2) => {
      const t = q2.expired;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    }), this.events.on(q2.deleted, (e2) => {
      const t = q2.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var qo3 = Object.defineProperty;
var Go3 = (r3, e2, t) => e2 in r3 ? qo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var P4 = (r3, e2, t) => Go3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Ki2 = class extends M {
  constructor(e2, t, i3) {
    super(e2, t, i3), this.core = e2, this.logger = t, this.store = i3, P4(this, "name", Ht3), P4(this, "abortController"), P4(this, "isDevEnv"), P4(this, "verifyUrlV3", Jt3), P4(this, "storagePrefix", W4), P4(this, "version", Fe3), P4(this, "publicKey"), P4(this, "fetchPromise"), P4(this, "init", async () => {
      var s2;
      this.isDevEnv || (this.publicKey = await this.store.getItem(this.storeKey), this.publicKey && (0, import_time4.toMiliseconds)((s2 = this.publicKey) == null ? void 0 : s2.expiresAt) < Date.now() && (this.logger.debug("verify v2 public key expired"), await this.removePublicKey()));
    }), P4(this, "register", async (s2) => {
      if (!Wt2() || this.isDevEnv) return;
      const n5 = window.location.origin, { id: o4, decryptedId: a3 } = s2, c5 = `${this.verifyUrlV3}/attestation?projectId=${this.core.projectId}&origin=${n5}&id=${o4}&decryptedId=${a3}`;
      try {
        const h4 = (0, import_window_getters2.getDocument)(), l6 = this.startAbortTimer(import_time4.ONE_SECOND * 5), g2 = await new Promise((y4, _3) => {
          const u2 = () => {
            window.removeEventListener("message", D2), h4.body.removeChild(m3), _3("attestation aborted");
          };
          this.abortController.signal.addEventListener("abort", u2);
          const m3 = h4.createElement("iframe");
          m3.src = c5, m3.style.display = "none", m3.addEventListener("error", u2, { signal: this.abortController.signal });
          const D2 = (w3) => {
            if (w3.data && typeof w3.data == "string") try {
              const E3 = JSON.parse(w3.data);
              if (E3.type === "verify_attestation") {
                if (sn(E3.attestation).payload.id !== o4) return;
                clearInterval(l6), h4.body.removeChild(m3), this.abortController.signal.removeEventListener("abort", u2), window.removeEventListener("message", D2), y4(E3.attestation === null ? "" : E3.attestation);
              }
            } catch (E3) {
              this.logger.warn(E3);
            }
          };
          h4.body.appendChild(m3), window.addEventListener("message", D2, { signal: this.abortController.signal });
        });
        return this.logger.debug(g2, "jwt attestation"), g2;
      } catch (h4) {
        this.logger.warn(h4);
      }
      return "";
    }), P4(this, "resolve", async (s2) => {
      if (this.isDevEnv) return "";
      const { attestationId: n5, hash: o4, encryptedId: a3 } = s2;
      if (n5 === "") {
        this.logger.debug("resolve: attestationId is empty, skipping");
        return;
      }
      if (n5) {
        if (sn(n5).payload.id !== a3) return;
        const h4 = await this.isValidJwtAttestation(n5);
        if (h4) {
          if (!h4.isVerified) {
            this.logger.warn("resolve: jwt attestation: origin url not verified");
            return;
          }
          return h4;
        }
      }
      if (!o4) return;
      const c5 = this.getVerifyUrl(s2?.verifyUrl);
      return this.fetchAttestation(o4, c5);
    }), P4(this, "fetchAttestation", async (s2, n5) => {
      this.logger.debug(`resolving attestation: ${s2} from url: ${n5}`);
      const o4 = this.startAbortTimer(import_time4.ONE_SECOND * 5), a3 = await fetch(`${n5}/attestation/${s2}?v2Supported=true`, { signal: this.abortController.signal });
      return clearTimeout(o4), a3.status === 200 ? await a3.json() : void 0;
    }), P4(this, "getVerifyUrl", (s2) => {
      let n5 = s2 || be4;
      return Xt3.includes(n5) || (this.logger.info(`verify url: ${n5}, not included in trusted list, assigning default: ${be4}`), n5 = be4), n5;
    }), P4(this, "fetchPublicKey", async () => {
      try {
        this.logger.debug(`fetching public key from: ${this.verifyUrlV3}`);
        const s2 = this.startAbortTimer(import_time4.FIVE_SECONDS), n5 = await fetch(`${this.verifyUrlV3}/public-key`, { signal: this.abortController.signal });
        return clearTimeout(s2), await n5.json();
      } catch (s2) {
        this.logger.warn(s2);
      }
    }), P4(this, "persistPublicKey", async (s2) => {
      this.logger.debug(s2, "persisting public key to local storage"), await this.store.setItem(this.storeKey, s2), this.publicKey = s2;
    }), P4(this, "removePublicKey", async () => {
      this.logger.debug("removing verify v2 public key from storage"), await this.store.removeItem(this.storeKey), this.publicKey = void 0;
    }), P4(this, "isValidJwtAttestation", async (s2) => {
      const n5 = await this.getPublicKey();
      try {
        if (n5) return this.validateAttestation(s2, n5);
      } catch (a3) {
        this.logger.error(a3), this.logger.warn("error validating attestation");
      }
      const o4 = await this.fetchAndPersistPublicKey();
      try {
        if (o4) return this.validateAttestation(s2, o4);
      } catch (a3) {
        this.logger.error(a3), this.logger.warn("error validating attestation");
      }
    }), P4(this, "getPublicKey", async () => this.publicKey ? this.publicKey : await this.fetchAndPersistPublicKey()), P4(this, "fetchAndPersistPublicKey", async () => {
      if (this.fetchPromise) return await this.fetchPromise, this.publicKey;
      this.fetchPromise = new Promise(async (n5) => {
        const o4 = await this.fetchPublicKey();
        o4 && (await this.persistPublicKey(o4), n5(o4));
      });
      const s2 = await this.fetchPromise;
      return this.fetchPromise = void 0, s2;
    }), P4(this, "validateAttestation", (s2, n5) => {
      const o4 = Aa(s2, n5.publicKey), a3 = { hasExpired: (0, import_time4.toMiliseconds)(o4.exp) < Date.now(), payload: o4 };
      if (a3.hasExpired) throw this.logger.warn("resolve: jwt attestation expired"), new Error("JWT attestation expired");
      return { origin: a3.payload.origin, isScam: a3.payload.isScam, isVerified: a3.payload.isVerified };
    }), this.logger = Re(t, this.name), this.abortController = new AbortController(), this.isDevEnv = ki(), this.init();
  }
  get storeKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//verify:public:key";
  }
  get context() {
    return ee(this.logger);
  }
  startAbortTimer(e2) {
    return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), (0, import_time4.toMiliseconds)(e2));
  }
};
var Wo3 = Object.defineProperty;
var Ho3 = (r3, e2, t) => e2 in r3 ? Wo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var Bi = (r3, e2, t) => Ho3(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Vi2 = class extends O2 {
  constructor(e2, t) {
    super(e2, t), this.projectId = e2, this.logger = t, Bi(this, "context", Zt3), Bi(this, "registerDeviceToken", async (i3) => {
      const { clientId: s2, token: n5, notificationType: o4, enableEncrypted: a3 = false } = i3, c5 = `${Qt3}/${this.projectId}/clients`;
      await fetch(c5, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: s2, type: o4, token: n5, always_raw: a3 }) });
    }), this.logger = Re(t, this.context);
  }
};
var Yo3 = Object.defineProperty;
var qi2 = Object.getOwnPropertySymbols;
var Jo3 = Object.prototype.hasOwnProperty;
var Xo2 = Object.prototype.propertyIsEnumerable;
var et2 = (r3, e2, t) => e2 in r3 ? Yo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var _e4 = (r3, e2) => {
  for (var t in e2 || (e2 = {})) Jo3.call(e2, t) && et2(r3, t, e2[t]);
  if (qi2) for (var t of qi2(e2)) Xo2.call(e2, t) && et2(r3, t, e2[t]);
  return r3;
};
var A2 = (r3, e2, t) => et2(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Gi2 = class extends R2 {
  constructor(e2, t, i3 = true) {
    super(e2, t, i3), this.core = e2, this.logger = t, A2(this, "context", ti), A2(this, "storagePrefix", W4), A2(this, "storageVersion", ei), A2(this, "events", /* @__PURE__ */ new Map()), A2(this, "shouldPersist", false), A2(this, "init", async () => {
      if (!ki()) try {
        const s2 = { eventId: Li(), timestamp: Date.now(), domain: this.getAppDomain(), props: { event: "INIT", type: "", properties: { client_id: await this.core.crypto.getClientId(), user_agent: wr2(this.core.relayer.protocol, this.core.relayer.version, Pe4) } } };
        await this.sendEvent([s2]);
      } catch (s2) {
        this.logger.warn(s2);
      }
    }), A2(this, "createEvent", (s2) => {
      const { event: n5 = "ERROR", type: o4 = "", properties: { topic: a3, trace: c5 } } = s2, h4 = Li(), l6 = this.core.projectId || "", g2 = Date.now(), y4 = _e4({ eventId: h4, timestamp: g2, props: { event: n5, type: o4, properties: { topic: a3, trace: c5 } }, bundleId: l6, domain: this.getAppDomain() }, this.setMethods(h4));
      return this.telemetryEnabled && (this.events.set(h4, y4), this.shouldPersist = true), y4;
    }), A2(this, "getEvent", (s2) => {
      const { eventId: n5, topic: o4 } = s2;
      if (n5) return this.events.get(n5);
      const a3 = Array.from(this.events.values()).find((c5) => c5.props.properties.topic === o4);
      if (a3) return _e4(_e4({}, a3), this.setMethods(a3.eventId));
    }), A2(this, "deleteEvent", (s2) => {
      const { eventId: n5 } = s2;
      this.events.delete(n5), this.shouldPersist = true;
    }), A2(this, "setEventListeners", () => {
      this.core.heartbeat.on(r.pulse, async () => {
        this.shouldPersist && await this.persist(), this.events.forEach((s2) => {
          (0, import_time4.fromMiliseconds)(Date.now()) - (0, import_time4.fromMiliseconds)(s2.timestamp) > ii2 && (this.events.delete(s2.eventId), this.shouldPersist = true);
        });
      });
    }), A2(this, "setMethods", (s2) => ({ addTrace: (n5) => this.addTrace(s2, n5), setError: (n5) => this.setError(s2, n5) })), A2(this, "addTrace", (s2, n5) => {
      const o4 = this.events.get(s2);
      o4 && (o4.props.properties.trace.push(n5), this.events.set(s2, o4), this.shouldPersist = true);
    }), A2(this, "setError", (s2, n5) => {
      const o4 = this.events.get(s2);
      o4 && (o4.props.type = n5, o4.timestamp = Date.now(), this.events.set(s2, o4), this.shouldPersist = true);
    }), A2(this, "persist", async () => {
      await this.core.storage.setItem(this.storageKey, Array.from(this.events.values())), this.shouldPersist = false;
    }), A2(this, "restore", async () => {
      try {
        const s2 = await this.core.storage.getItem(this.storageKey) || [];
        if (!s2.length) return;
        s2.forEach((n5) => {
          this.events.set(n5.eventId, _e4(_e4({}, n5), this.setMethods(n5.eventId)));
        });
      } catch (s2) {
        this.logger.warn(s2);
      }
    }), A2(this, "submit", async () => {
      if (!this.telemetryEnabled || this.events.size === 0) return;
      const s2 = [];
      for (const [n5, o4] of this.events) o4.props.type && s2.push(o4);
      if (s2.length !== 0) try {
        if ((await this.sendEvent(s2)).ok) for (const n5 of s2) this.events.delete(n5.eventId), this.shouldPersist = true;
      } catch (n5) {
        this.logger.warn(n5);
      }
    }), A2(this, "sendEvent", async (s2) => {
      const n5 = this.getAppDomain() ? "" : "&sp=desktop";
      return await fetch(`${si2}?projectId=${this.core.projectId}&st=events_sdk&sv=js-${Pe4}${n5}`, { method: "POST", body: JSON.stringify(s2) });
    }), A2(this, "getAppDomain", () => br2().url), this.logger = Re(t, this.context), this.telemetryEnabled = i3, i3 ? this.restore().then(async () => {
      await this.submit(), this.setEventListeners();
    }) : this.persist();
  }
  get storageKey() {
    return this.storagePrefix + this.storageVersion + this.core.customStoragePrefix + "//" + this.context;
  }
};
var Zo3 = Object.defineProperty;
var Wi2 = Object.getOwnPropertySymbols;
var Qo3 = Object.prototype.hasOwnProperty;
var ea2 = Object.prototype.propertyIsEnumerable;
var tt2 = (r3, e2, t) => e2 in r3 ? Zo3(r3, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r3[e2] = t;
var Hi2 = (r3, e2) => {
  for (var t in e2 || (e2 = {})) Qo3.call(e2, t) && tt2(r3, t, e2[t]);
  if (Wi2) for (var t of Wi2(e2)) ea2.call(e2, t) && tt2(r3, t, e2[t]);
  return r3;
};
var v4 = (r3, e2, t) => tt2(r3, typeof e2 != "symbol" ? e2 + "" : e2, t);
var Oe3 = class _Oe extends h2 {
  constructor(e2) {
    var t;
    super(e2), v4(this, "protocol", Ue4), v4(this, "version", Fe3), v4(this, "name", ge4), v4(this, "relayUrl"), v4(this, "projectId"), v4(this, "customStoragePrefix"), v4(this, "events", new import_events7.EventEmitter()), v4(this, "logger"), v4(this, "heartbeat"), v4(this, "relayer"), v4(this, "crypto"), v4(this, "storage"), v4(this, "history"), v4(this, "expirer"), v4(this, "pairing"), v4(this, "verify"), v4(this, "echoClient"), v4(this, "linkModeSupportedApps"), v4(this, "eventClient"), v4(this, "initialized", false), v4(this, "logChunkController"), v4(this, "on", (a3, c5) => this.events.on(a3, c5)), v4(this, "once", (a3, c5) => this.events.once(a3, c5)), v4(this, "off", (a3, c5) => this.events.off(a3, c5)), v4(this, "removeListener", (a3, c5) => this.events.removeListener(a3, c5)), v4(this, "dispatchEnvelope", ({ topic: a3, message: c5, sessionExists: h4 }) => {
      if (!a3 || !c5) return;
      const l6 = { topic: a3, message: c5, publishedAt: Date.now(), transportType: ee3.link_mode };
      this.relayer.onLinkMessageEvent(l6, { sessionExists: h4 });
    });
    const i3 = this.getGlobalCore(e2?.customStoragePrefix);
    if (i3) try {
      return this.customStoragePrefix = i3.customStoragePrefix, this.logger = i3.logger, this.heartbeat = i3.heartbeat, this.crypto = i3.crypto, this.history = i3.history, this.expirer = i3.expirer, this.storage = i3.storage, this.relayer = i3.relayer, this.pairing = i3.pairing, this.verify = i3.verify, this.echoClient = i3.echoClient, this.linkModeSupportedApps = i3.linkModeSupportedApps, this.eventClient = i3.eventClient, this.initialized = i3.initialized, this.logChunkController = i3.logChunkController, i3;
    } catch (a3) {
      console.warn("Failed to copy global core", a3);
    }
    this.projectId = e2?.projectId, this.relayUrl = e2?.relayUrl || Ke3, this.customStoragePrefix = e2 != null && e2.customStoragePrefix ? `:${e2.customStoragePrefix}` : "";
    const s2 = Ge({ level: typeof e2?.logger == "string" && e2.logger ? e2.logger : Et3.logger, name: ge4 }), { logger: n5, chunkLoggerController: o4 } = Ue({ opts: s2, maxSizeInBytes: e2?.maxLogBlobSizeInBytes, loggerOverride: e2?.logger });
    this.logChunkController = o4, (t = this.logChunkController) != null && t.downloadLogsBlobInBrowser && (window.downloadLogsBlobInBrowser = async () => {
      var a3, c5;
      (a3 = this.logChunkController) != null && a3.downloadLogsBlobInBrowser && ((c5 = this.logChunkController) == null || c5.downloadLogsBlobInBrowser({ clientId: await this.crypto.getClientId() }));
    }), this.logger = Re(n5, this.name), this.heartbeat = new i(), this.crypto = new wi(this, this.logger, e2?.keychain), this.history = new Fi2(this, this.logger), this.expirer = new Mi2(this, this.logger), this.storage = e2 != null && e2.storage ? e2.storage : new h(Hi2(Hi2({}, It3), e2?.storageOptions)), this.relayer = new Ai2({ core: this, logger: this.logger, relayUrl: this.relayUrl, projectId: this.projectId }), this.pairing = new Ui2(this, this.logger), this.verify = new Ki2(this, this.logger, this.storage), this.echoClient = new Vi2(this.projectId || "", this.logger), this.linkModeSupportedApps = [], this.eventClient = new Gi2(this, this.logger, e2?.telemetryEnabled), this.setGlobalCore(this);
  }
  static async init(e2) {
    const t = new _Oe(e2);
    await t.initialize();
    const i3 = await t.crypto.getClientId();
    return await t.storage.setItem(Ut3, i3), t;
  }
  get context() {
    return ee(this.logger);
  }
  async start() {
    this.initialized || await this.initialize();
  }
  async getLogsBlob() {
    var e2;
    return (e2 = this.logChunkController) == null ? void 0 : e2.logsToBlob({ clientId: await this.crypto.getClientId() });
  }
  async addLinkModeSupportedApp(e2) {
    this.linkModeSupportedApps.includes(e2) || (this.linkModeSupportedApps.push(e2), await this.storage.setItem(Be4, this.linkModeSupportedApps));
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.linkModeSupportedApps = await this.storage.getItem(Be4) || [], this.initialized = true, this.logger.info("Core Initialization Success");
    } catch (e2) {
      throw this.logger.warn(e2, `Core Initialization Failure at epoch ${Date.now()}`), this.logger.error(e2.message), e2;
    }
  }
  getGlobalCore(e2 = "") {
    try {
      if (this.isGlobalCoreDisabled()) return;
      const t = `_walletConnectCore_${e2}`, i3 = `${t}_count`;
      return globalThis[i3] = (globalThis[i3] || 0) + 1, globalThis[i3] > 1 && console.warn(`WalletConnect Core is already initialized. This is probably a mistake and can lead to unexpected behavior. Init() was called ${globalThis[i3]} times.`), globalThis[t];
    } catch (t) {
      console.warn("Failed to get global WalletConnect core", t);
      return;
    }
  }
  setGlobalCore(e2) {
    var t;
    try {
      if (this.isGlobalCoreDisabled()) return;
      const i3 = `_walletConnectCore_${((t = e2.opts) == null ? void 0 : t.customStoragePrefix) || ""}`;
      globalThis[i3] = e2;
    } catch (i3) {
      console.warn("Failed to set global WalletConnect core", i3);
    }
  }
  isGlobalCoreDisabled() {
    try {
      return typeof process < "u" && process.env.DISABLE_GLOBAL_CORE === "true";
    } catch {
      return true;
    }
  }
};
var ta2 = Oe3;

// node_modules/@walletconnect/sign-client/node_modules/@walletconnect/types/dist/index.js
var import_events9 = __toESM(require_events());
var T2 = Object.defineProperty;
var k3 = (e2, s2, r3) => s2 in e2 ? T2(e2, s2, { enumerable: true, configurable: true, writable: true, value: r3 }) : e2[s2] = r3;
var i2 = (e2, s2, r3) => k3(e2, typeof s2 != "symbol" ? s2 + "" : s2, r3);
var J5 = class {
  constructor(s2) {
    this.opts = s2, i2(this, "protocol", "wc"), i2(this, "version", 2);
  }
};
var V3 = class {
  constructor(s2) {
    this.client = s2;
  }
};

// node_modules/@walletconnect/sign-client/dist/index.js
var import_time5 = __toESM(require_cjs(), 1);
var De5 = "wc";
var Le4 = 2;
var Me5 = "client";
var Re5 = `${De5}@${Le4}:${Me5}:`;
var Ie4 = { name: Me5, logger: "error", controller: false, relayUrl: "wss://relay.walletconnect.org" };
var Is2 = { session_proposal: "session_proposal", session_update: "session_update", session_extend: "session_extend", session_ping: "session_ping", session_delete: "session_delete", session_expire: "session_expire", session_request: "session_request", session_request_sent: "session_request_sent", session_event: "session_event", proposal_expire: "proposal_expire", session_authenticate: "session_authenticate", session_request_expire: "session_request_expire", session_connect: "session_connect" };
var Ts2 = { database: ":memory:" };
var $e4 = "WALLETCONNECT_DEEPLINK_CHOICE";
var qs = { created: "history_created", updated: "history_updated", deleted: "history_deleted", sync: "history_sync" };
var Ps2 = "history";
var Ns2 = "0.3";
var dt3 = "proposal";
var Os2 = import_time5.THIRTY_DAYS;
var Ke4 = "Proposal expired";
var ut3 = "session";
var se3 = import_time5.SEVEN_DAYS;
var gt3 = "engine";
var N11 = { wc_sessionPropose: { req: { ttl: import_time5.FIVE_MINUTES, prompt: true, tag: 1100 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1101 }, reject: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1120 }, autoReject: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1121 } }, wc_sessionSettle: { req: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1102 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1103 } }, wc_sessionUpdate: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1104 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1105 } }, wc_sessionExtend: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1106 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1107 } }, wc_sessionRequest: { req: { ttl: import_time5.FIVE_MINUTES, prompt: true, tag: 1108 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1109 } }, wc_sessionEvent: { req: { ttl: import_time5.FIVE_MINUTES, prompt: true, tag: 1110 }, res: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1111 } }, wc_sessionDelete: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1112 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1113 } }, wc_sessionPing: { req: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1114 }, res: { ttl: import_time5.ONE_DAY, prompt: false, tag: 1115 } }, wc_sessionAuthenticate: { req: { ttl: import_time5.ONE_HOUR, prompt: true, tag: 1116 }, res: { ttl: import_time5.ONE_HOUR, prompt: false, tag: 1117 }, reject: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1118 }, autoReject: { ttl: import_time5.FIVE_MINUTES, prompt: false, tag: 1119 } } };
var Te4 = { min: import_time5.FIVE_MINUTES, max: import_time5.SEVEN_DAYS };
var K6 = { idle: "IDLE", active: "ACTIVE" };
var yt3 = { eth_sendTransaction: { key: "" }, eth_sendRawTransaction: { key: "" }, wallet_sendCalls: { key: "" }, solana_signTransaction: { key: "signature" }, solana_signAllTransactions: { key: "transactions" }, solana_signAndSendTransaction: { key: "signature" }, sui_signAndExecuteTransaction: { key: "digest" }, sui_signTransaction: { key: "" }, hedera_signAndExecuteTransaction: { key: "transactionId" }, hedera_executeTransaction: { key: "transactionId" }, near_signTransaction: { key: "" }, near_signTransactions: { key: "" }, tron_signTransaction: { key: "txID" }, xrpl_signTransaction: { key: "" }, xrpl_signTransactionFor: { key: "" }, algo_signTxn: { key: "" }, sendTransfer: { key: "txid" }, stacks_stxTransfer: { key: "txId" }, polkadot_signTransaction: { key: "" }, cosmos_signDirect: { key: "" } };
var mt2 = "request";
var wt3 = ["wc_sessionPropose", "wc_sessionRequest", "wc_authRequest", "wc_sessionAuthenticate"];
var _t3 = "wc";
var bs2 = 1.5;
var vt3 = "auth";
var St4 = "authKeys";
var Et4 = "pairingTopics";
var ft3 = "requests";
var we4 = `${_t3}@${1.5}:${vt3}:`;
var _e5 = `${we4}:PUB_KEY`;
var As2 = Object.defineProperty;
var xs2 = Object.defineProperties;
var Cs2 = Object.getOwnPropertyDescriptors;
var Rt4 = Object.getOwnPropertySymbols;
var Vs2 = Object.prototype.hasOwnProperty;
var ks2 = Object.prototype.propertyIsEnumerable;
var Ue5 = (S4, o4, e2) => o4 in S4 ? As2(S4, o4, { enumerable: true, configurable: true, writable: true, value: e2 }) : S4[o4] = e2;
var E2 = (S4, o4) => {
  for (var e2 in o4 || (o4 = {})) Vs2.call(o4, e2) && Ue5(S4, e2, o4[e2]);
  if (Rt4) for (var e2 of Rt4(o4)) ks2.call(o4, e2) && Ue5(S4, e2, o4[e2]);
  return S4;
};
var b4 = (S4, o4) => xs2(S4, Cs2(o4));
var c4 = (S4, o4, e2) => Ue5(S4, typeof o4 != "symbol" ? o4 + "" : o4, e2);
var Ds = class extends V3 {
  constructor(o4) {
    super(o4), c4(this, "name", gt3), c4(this, "events", new import_events10.default()), c4(this, "initialized", false), c4(this, "requestQueue", { state: K6.idle, queue: [] }), c4(this, "sessionRequestQueue", { state: K6.idle, queue: [] }), c4(this, "emittedSessionRequests", new Hi({ limit: 500 })), c4(this, "requestQueueDelay", import_time5.ONE_SECOND), c4(this, "expectedPairingMethodMap", /* @__PURE__ */ new Map()), c4(this, "recentlyDeletedMap", /* @__PURE__ */ new Map()), c4(this, "recentlyDeletedLimit", 200), c4(this, "relayMessageCache", []), c4(this, "pendingSessions", /* @__PURE__ */ new Map()), c4(this, "init", async () => {
      this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), await this.registerLinkModeListeners(), this.client.core.pairing.register({ methods: Object.keys(N11) }), this.initialized = true, setTimeout(async () => {
        await this.processPendingMessageEvents(), this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
      }, (0, import_time5.toMiliseconds)(this.requestQueueDelay)));
    }), c4(this, "connect", async (e2) => {
      var t;
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      const s2 = b4(E2({}, e2), { requiredNamespaces: e2.requiredNamespaces || {}, optionalNamespaces: e2.optionalNamespaces || {} });
      await this.isValidConnect(s2), s2.optionalNamespaces = Ya(s2.requiredNamespaces, s2.optionalNamespaces), s2.requiredNamespaces = {};
      const { pairingTopic: i3, requiredNamespaces: r3, optionalNamespaces: n5, sessionProperties: a3, scopedProperties: l6, relays: h4, authentication: p3, walletPay: y4 } = s2, d4 = ((t = p3?.[0]) == null ? void 0 : t.ttl) || N11.wc_sessionPropose.req.ttl || import_time5.FIVE_MINUTES;
      this.validateRequestExpiry(d4);
      let u2 = i3, w3, g2 = false;
      try {
        if (u2) {
          const R4 = this.client.core.pairing.pairings.get(u2);
          this.client.logger.warn("connect() with existing pairing topic is deprecated and will be removed in the next major release."), g2 = R4.active;
        }
      } catch (R4) {
        throw this.client.logger.error(`connect() -> pairing.get(${u2}) failed`), R4;
      }
      if (!u2 || !g2) {
        const { topic: R4, uri: q3 } = await this.client.core.pairing.create({ internal: { skipSubscribe: true } });
        u2 = R4, w3 = q3;
      }
      if (!u2) {
        const { message: R4 } = Bt2("NO_MATCHING_KEY", `connect() pairing topic: ${u2}`);
        throw new Error(R4);
      }
      const f4 = await this.client.core.crypto.generateKeyPair(), v5 = _i(d4), T3 = E2(b4(E2(E2({ requiredNamespaces: r3, optionalNamespaces: n5, relays: h4 ?? [{ protocol: Nt3 }], proposer: { publicKey: f4, metadata: this.client.metadata }, expiryTimestamp: v5, pairingTopic: u2 }, a3 && { sessionProperties: a3 }), l6 && { scopedProperties: l6 }), { id: payloadId() }), (p3 || y4) && { requests: { authentication: p3?.map((R4) => {
        const { domain: q3, chains: ve5, nonce: ce3, uri: Y3, exp: ie4, nbf: le4, type: J6, statement: pe4, requestId: he5, resources: C4, signatureTypes: D2 } = R4;
        return { domain: q3, chains: ve5, nonce: ce3, type: J6 ?? "caip122", aud: Y3, version: "1", iat: (/* @__PURE__ */ new Date()).toISOString(), exp: ie4, nbf: le4, statement: pe4, requestId: he5, resources: C4, signatureTypes: D2 };
      }), walletPay: y4 } }), A3 = $i("session_connect", T3.id), { reject: V4, resolve: x5, done: U3 } = Ai(d4, Ke4), z4 = ({ id: R4 }) => {
        R4 === T3.id && (this.client.events.off("proposal_expire", z4), this.pendingSessions.delete(T3.id), this.events.emit(A3, { error: { message: Ke4, code: 0 } }));
      };
      return this.client.events.on("proposal_expire", z4), this.events.once(A3, ({ error: R4, session: q3 }) => {
        this.client.events.off("proposal_expire", z4), R4 ? V4(R4) : q3 && x5(q3);
      }), await this.setProposal(T3.id, T3), await this.sendProposeSession({ proposal: T3, publishOpts: { internal: { throwOnFailedPublish: true }, tvf: { correlationId: T3.id } } }).catch((R4) => {
        throw this.deleteProposal(T3.id), R4;
      }), { uri: w3, approval: U3 };
    }), c4(this, "pair", async (e2) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        return await this.client.core.pairing.pair(e2);
      } catch (t) {
        throw this.client.logger.error("pair() failed"), t;
      }
    }), c4(this, "approve", async (e2) => {
      var t, s2, i3;
      const r3 = this.client.core.eventClient.createEvent({ properties: { topic: (t = e2?.id) == null ? void 0 : t.toString(), trace: [rr3.session_approve_started] } });
      try {
        this.isInitialized(), await this.confirmOnlineStateOrThrow();
      } catch (q3) {
        throw r3.setError(nr3.no_internet_connection), q3;
      }
      try {
        await this.isValidProposalId(e2?.id);
      } catch (q3) {
        throw this.client.logger.error(`approve() -> proposal.get(${e2?.id}) failed`), r3.setError(nr3.proposal_not_found), q3;
      }
      try {
        await this.isValidApprove(e2);
      } catch (q3) {
        throw this.client.logger.error("approve() -> isValidApprove() failed"), r3.setError(nr3.session_approve_namespace_validation_failure), q3;
      }
      const { id: n5, relayProtocol: a3, namespaces: l6, sessionProperties: h4, scopedProperties: p3, sessionConfig: y4, proposalRequestsResponses: d4 } = e2, u2 = this.client.proposal.get(n5);
      this.client.core.eventClient.deleteEvent({ eventId: r3.eventId });
      const { pairingTopic: w3, proposer: g2, requiredNamespaces: f4, optionalNamespaces: v5 } = u2;
      let T3 = (s2 = this.client.core.eventClient) == null ? void 0 : s2.getEvent({ topic: w3 });
      T3 || (T3 = (i3 = this.client.core.eventClient) == null ? void 0 : i3.createEvent({ type: rr3.session_approve_started, properties: { topic: w3, trace: [rr3.session_approve_started, rr3.session_namespaces_validation_success] } }));
      const A3 = await this.client.core.crypto.generateKeyPair(), V4 = g2.publicKey, x5 = await this.client.core.crypto.generateSharedKey(A3, V4), U3 = b4(E2(E2(E2({ relay: { protocol: a3 ?? "irn" }, namespaces: l6, controller: { publicKey: A3, metadata: this.client.metadata }, expiry: _i(se3) }, h4 && { sessionProperties: h4 }), p3 && { scopedProperties: p3 }), y4 && { sessionConfig: y4 }), { proposalRequestsResponses: d4 }), z4 = ee3.relay;
      T3.addTrace(rr3.subscribing_session_topic);
      try {
        await this.client.core.relayer.subscribe(x5, { transportType: z4, internal: { skipSubscribe: true } });
      } catch (q3) {
        throw T3.setError(nr3.subscribe_session_topic_failure), q3;
      }
      T3.addTrace(rr3.subscribe_session_topic_success);
      const R4 = b4(E2({}, U3), { topic: x5, requiredNamespaces: f4, optionalNamespaces: v5, pairingTopic: w3, acknowledged: false, self: U3.controller, peer: { publicKey: g2.publicKey, metadata: g2.metadata }, controller: A3, transportType: ee3.relay, authentication: d4?.authentication, walletPayResult: d4?.walletPay });
      await this.client.session.set(x5, R4), T3.addTrace(rr3.store_session);
      try {
        await this.sendApproveSession({ sessionTopic: x5, proposal: u2, pairingProposalResponse: { relay: { protocol: a3 ?? "irn" }, responderPublicKey: A3 }, sessionSettleRequest: U3, publishOpts: { internal: { throwOnFailedPublish: true }, tvf: E2({ correlationId: n5 }, this.getTVFApproveParams(R4)) } }), T3.addTrace(rr3.session_approve_publish_success);
      } catch (q3) {
        throw this.client.logger.error(q3), this.client.session.delete(x5, zt2("USER_DISCONNECTED")), await this.client.core.relayer.unsubscribe(x5), q3;
      }
      return this.client.core.eventClient.deleteEvent({ eventId: T3.eventId }), await this.client.core.pairing.updateMetadata({ topic: w3, metadata: g2.metadata }), await this.deleteProposal(n5), await this.client.core.pairing.activate({ topic: w3 }), await this.setExpiry(x5, _i(se3)), { topic: x5, acknowledged: () => Promise.resolve(this.client.session.get(x5)) };
    }), c4(this, "reject", async (e2) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidReject(e2);
      } catch (r3) {
        throw this.client.logger.error("reject() -> isValidReject() failed"), r3;
      }
      const { id: t, reason: s2 } = e2;
      let i3;
      try {
        i3 = this.client.proposal.get(t).pairingTopic;
      } catch (r3) {
        throw this.client.logger.error(`reject() -> proposal.get(${t}) failed`), r3;
      }
      i3 && await this.sendError({ id: t, topic: i3, error: s2, rpcOpts: N11.wc_sessionPropose.reject }), await this.deleteProposal(t);
    }), c4(this, "update", async (e2) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidUpdate(e2);
      } catch (p3) {
        throw this.client.logger.error("update() -> isValidUpdate() failed"), p3;
      }
      const { topic: t, namespaces: s2 } = e2, { done: i3, resolve: r3, reject: n5 } = Ai(import_time5.FIVE_MINUTES, "Session update request expired without receiving any acknowledgement"), a3 = payloadId(), l6 = getBigIntRpcId().toString(), h4 = this.client.session.get(t).namespaces;
      return this.events.once($i("session_update", a3), ({ error: p3 }) => {
        p3 ? n5(p3) : r3();
      }), await this.client.session.update(t, { namespaces: s2 }), await this.sendRequest({ topic: t, method: "wc_sessionUpdate", params: { namespaces: s2 }, throwOnFailedPublish: true, clientRpcId: a3, relayRpcId: l6 }).catch((p3) => {
        this.client.logger.error(p3), this.client.session.update(t, { namespaces: h4 }), n5(p3);
      }), { acknowledged: i3 };
    }), c4(this, "extend", async (e2) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidExtend(e2);
      } catch (a3) {
        throw this.client.logger.error("extend() -> isValidExtend() failed"), a3;
      }
      const { topic: t } = e2, s2 = payloadId(), { done: i3, resolve: r3, reject: n5 } = Ai(import_time5.FIVE_MINUTES, "Session extend request expired without receiving any acknowledgement");
      return this.events.once($i("session_extend", s2), ({ error: a3 }) => {
        a3 ? n5(a3) : r3();
      }), await this.setExpiry(t, _i(se3)), this.sendRequest({ topic: t, method: "wc_sessionExtend", params: {}, clientRpcId: s2, throwOnFailedPublish: true }).catch((a3) => {
        n5(a3);
      }), { acknowledged: i3 };
    }), c4(this, "request", async (e2) => {
      this.isInitialized();
      try {
        await this.isValidRequest(e2);
      } catch (g2) {
        throw this.client.logger.error("request() -> isValidRequest() failed"), g2;
      }
      const { chainId: t, request: s2, topic: i3, expiry: r3 = N11.wc_sessionRequest.req.ttl } = e2, n5 = this.client.session.get(i3);
      n5?.transportType === ee3.relay && await this.confirmOnlineStateOrThrow();
      const a3 = payloadId(), l6 = getBigIntRpcId().toString(), { done: h4, resolve: p3, reject: y4 } = Ai(r3, "Request expired. Please try again.");
      this.events.once($i("session_request", a3), ({ error: g2, result: f4 }) => {
        g2 ? y4(g2) : p3(f4);
      });
      const d4 = "wc_sessionRequest", u2 = this.getAppLinkIfEnabled(n5.peer.metadata, n5.transportType);
      if (u2) return await this.sendRequest({ clientRpcId: a3, relayRpcId: l6, topic: i3, method: d4, params: { request: b4(E2({}, s2), { expiryTimestamp: _i(r3) }), chainId: t }, expiry: r3, throwOnFailedPublish: true, appLink: u2 }).catch((g2) => y4(g2)), this.client.events.emit("session_request_sent", { topic: i3, request: s2, chainId: t, id: a3 }), await h4();
      const w3 = { request: b4(E2({}, s2), { expiryTimestamp: _i(r3) }), chainId: t };
      return await Promise.all([new Promise(async (g2) => {
        await this.sendRequest({ clientRpcId: a3, relayRpcId: l6, topic: i3, method: d4, params: w3, expiry: r3, throwOnFailedPublish: true, tvf: this.getTVFParams(a3, w3) }).catch((f4) => y4(f4)), this.client.events.emit("session_request_sent", { topic: i3, request: s2, chainId: t, id: a3 }), g2();
      }), new Promise(async (g2) => {
        var f4;
        if (!((f4 = n5.sessionConfig) != null && f4.disableDeepLink)) {
          const v5 = await Ci(this.client.core.storage, $e4);
          await Ti({ id: a3, topic: i3, wcDeepLink: v5 });
        }
        g2();
      }), h4()]).then((g2) => g2[2]);
    }), c4(this, "respond", async (e2) => {
      var t, s2;
      this.isInitialized();
      const i3 = this.client.core.eventClient.createEvent({ properties: { topic: e2?.topic || ((s2 = (t = e2?.response) == null ? void 0 : t.id) == null ? void 0 : s2.toString()), trace: [rr3.session_request_response_started] } });
      try {
        await this.isValidRespond(e2);
      } catch (p3) {
        throw i3.addTrace(p3?.message), i3.setError(nr3.session_request_response_validation_failure), p3;
      }
      i3.addTrace(rr3.session_request_response_validation_success);
      const { topic: r3, response: n5 } = e2, { id: a3 } = n5, l6 = this.client.session.get(r3);
      l6.transportType === ee3.relay && await this.confirmOnlineStateOrThrow();
      const h4 = this.getAppLinkIfEnabled(l6.peer.metadata, l6.transportType);
      try {
        i3.addTrace(rr3.session_request_response_publish_started), isJsonRpcResult(n5) ? await this.sendResult({ id: a3, topic: r3, result: n5.result, throwOnFailedPublish: true, appLink: h4 }) : isJsonRpcError(n5) && await this.sendError({ id: a3, topic: r3, error: n5.error, appLink: h4 }), this.cleanupAfterResponse(e2);
      } catch (p3) {
        throw i3.addTrace(p3?.message), i3.setError(nr3.session_request_response_publish_failure), p3;
      }
    }), c4(this, "ping", async (e2) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow();
      try {
        await this.isValidPing(e2);
      } catch (s2) {
        throw this.client.logger.error("ping() -> isValidPing() failed"), s2;
      }
      const { topic: t } = e2;
      if (this.client.session.keys.includes(t)) {
        const s2 = payloadId(), i3 = getBigIntRpcId().toString(), { done: r3, resolve: n5, reject: a3 } = Ai(import_time5.FIVE_MINUTES, "Ping request expired without receiving any acknowledgement");
        this.events.once($i("session_ping", s2), ({ error: l6 }) => {
          l6 ? a3(l6) : n5();
        }), await Promise.all([this.sendRequest({ topic: t, method: "wc_sessionPing", params: {}, throwOnFailedPublish: true, clientRpcId: s2, relayRpcId: i3 }), r3()]);
      } else this.client.core.pairing.pairings.keys.includes(t) && (this.client.logger.warn("ping() on pairing topic is deprecated and will be removed in the next major release."), await this.client.core.pairing.ping({ topic: t }));
    }), c4(this, "emit", async (e2) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidEmit(e2);
      const { topic: t, event: s2, chainId: i3 } = e2, r3 = getBigIntRpcId().toString(), n5 = payloadId();
      await this.sendRequest({ topic: t, method: "wc_sessionEvent", params: { event: s2, chainId: i3 }, throwOnFailedPublish: true, relayRpcId: r3, clientRpcId: n5 });
    }), c4(this, "disconnect", async (e2) => {
      this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidDisconnect(e2);
      const { topic: t } = e2;
      if (this.client.session.keys.includes(t)) await this.sendRequest({ topic: t, method: "wc_sessionDelete", params: zt2("USER_DISCONNECTED"), throwOnFailedPublish: true }), await this.deleteSession({ topic: t, emitEvent: false });
      else if (this.client.core.pairing.pairings.keys.includes(t)) await this.client.core.pairing.disconnect({ topic: t });
      else {
        const { message: s2 } = Bt2("MISMATCHED_TOPIC", `Session or pairing topic not found: ${t}`);
        throw new Error(s2);
      }
    }), c4(this, "find", (e2) => (this.isInitialized(), this.client.session.getAll().filter((t) => Wa(t, e2)))), c4(this, "getPendingSessionRequests", () => this.client.pendingRequest.getAll()), c4(this, "authenticate", async (e2, t) => {
      var s2;
      this.isInitialized(), this.isValidAuthenticate(e2);
      const i3 = t && this.client.core.linkModeSupportedApps.includes(t) && ((s2 = this.client.metadata.redirect) == null ? void 0 : s2.linkMode), r3 = i3 ? ee3.link_mode : ee3.relay;
      r3 === ee3.relay && await this.confirmOnlineStateOrThrow();
      const { chains: n5, statement: a3 = "", uri: l6, domain: h4, nonce: p3, type: y4, exp: d4, nbf: u2, methods: w3 = [], expiry: g2 } = e2, f4 = [...e2.resources || []], { topic: v5, uri: T3 } = await this.client.core.pairing.create({ methods: ["wc_sessionAuthenticate"], transportType: r3 });
      this.client.logger.info({ message: "Generated new pairing", pairing: { topic: v5, uri: T3 } });
      const A3 = await this.client.core.crypto.generateKeyPair(), V4 = ba(A3);
      if (await Promise.all([this.client.auth.authKeys.set(_e5, { responseTopic: V4, publicKey: A3 }), this.client.auth.pairingTopics.set(V4, { topic: V4, pairingTopic: v5 })]), await this.client.core.relayer.subscribe(V4, { transportType: r3 }), this.client.logger.info(`sending request to new pairing topic: ${v5}`), w3.length > 0) {
        const { namespace: C4 } = Je2(n5[0]);
        let D2 = Zc(C4, "request", w3);
        je3(f4) && (D2 = Gc(D2, f4.pop())), f4.push(D2);
      }
      const x5 = g2 && g2 > N11.wc_sessionAuthenticate.req.ttl ? g2 : N11.wc_sessionAuthenticate.req.ttl, U3 = { authPayload: { type: y4 ?? "caip122", chains: n5, statement: a3, aud: l6, domain: h4, version: "1", nonce: p3, iat: (/* @__PURE__ */ new Date()).toISOString(), exp: d4, nbf: u2, resources: f4 }, requester: { publicKey: A3, metadata: this.client.metadata }, expiryTimestamp: _i(x5) }, z4 = { eip155: { chains: n5, methods: [.../* @__PURE__ */ new Set(["personal_sign", ...w3])], events: ["chainChanged", "accountsChanged"] } }, R4 = { requiredNamespaces: {}, optionalNamespaces: z4, relays: [{ protocol: "irn" }], pairingTopic: v5, proposer: { publicKey: A3, metadata: this.client.metadata }, expiryTimestamp: _i(N11.wc_sessionPropose.req.ttl), id: payloadId() }, { done: q3, resolve: ve5, reject: ce3 } = Ai(x5, "Request expired"), Y3 = payloadId(), ie4 = $i("session_connect", R4.id), le4 = $i("session_request", Y3), J6 = async ({ error: C4, session: D2 }) => {
        this.events.off(le4, pe4), C4 ? ce3(C4) : D2 && ve5({ session: D2 });
      }, pe4 = async (C4) => {
        var D2, je4, Fe4;
        if (await this.deletePendingAuthRequest(Y3, { message: "fulfilled", code: 0 }), C4.error) {
          const ue2 = zt2("WC_METHOD_UNSUPPORTED", "wc_sessionAuthenticate");
          return C4.error.code === ue2.code ? void 0 : (this.events.off(ie4, J6), ce3(C4.error.message));
        }
        await this.deleteProposal(R4.id), this.events.off(ie4, J6);
        const { cacaos: He4, responder: X4 } = C4.result, Pe5 = [], Qe3 = [];
        for (const ue2 of He4) {
          await Vc({ cacao: ue2, projectId: this.client.core.projectId }) || (this.client.logger.error(ue2, "Signature verification failed"), ce3(zt2("SESSION_SETTLEMENT_FAILED", "Signature verification failed")));
          const { p: Ne4 } = ue2, Oe4 = je3(Ne4.resources), ze4 = [no2(Ne4.iss)], Tt4 = bn2(Ne4.iss);
          if (Oe4) {
            const be5 = zc(Oe4), qt4 = Yc(Oe4);
            Pe5.push(...be5), ze4.push(...qt4);
          }
          for (const be5 of ze4) Qe3.push(`${be5}:${Tt4}`);
        }
        const de4 = await this.client.core.crypto.generateSharedKey(A3, X4.publicKey);
        let Se5;
        Pe5.length > 0 && (Se5 = { topic: de4, acknowledged: true, self: { publicKey: A3, metadata: this.client.metadata }, peer: X4, controller: X4.publicKey, expiry: _i(se3), requiredNamespaces: {}, optionalNamespaces: {}, relay: { protocol: "irn" }, pairingTopic: v5, namespaces: za([...new Set(Pe5)], [...new Set(Qe3)]), transportType: r3 }, await this.client.core.relayer.subscribe(de4, { transportType: r3 }), await this.client.session.set(de4, Se5), v5 && await this.client.core.pairing.updateMetadata({ topic: v5, metadata: X4.metadata }), Se5 = this.client.session.get(de4)), (D2 = this.client.metadata.redirect) != null && D2.linkMode && (je4 = X4.metadata.redirect) != null && je4.linkMode && (Fe4 = X4.metadata.redirect) != null && Fe4.universal && t && (this.client.core.addLinkModeSupportedApp(X4.metadata.redirect.universal), this.client.session.update(de4, { transportType: ee3.link_mode })), ve5({ auths: He4, session: Se5 });
      };
      this.events.once(ie4, J6), this.events.once(le4, pe4);
      let he5;
      try {
        if (i3) {
          const C4 = formatJsonRpcRequest("wc_sessionAuthenticate", U3, Y3);
          this.client.core.history.set(v5, C4);
          const D2 = await this.client.core.crypto.encode("", C4, { type: ve3, encoding: Ge3 });
          he5 = La(t, v5, D2);
        } else await Promise.all([this.sendRequest({ topic: v5, method: "wc_sessionAuthenticate", params: U3, expiry: e2.expiry, throwOnFailedPublish: true, clientRpcId: Y3 }), this.sendRequest({ topic: v5, method: "wc_sessionPropose", params: R4, expiry: N11.wc_sessionPropose.req.ttl, throwOnFailedPublish: true, clientRpcId: R4.id })]);
      } catch (C4) {
        throw this.events.off(ie4, J6), this.events.off(le4, pe4), C4;
      }
      return await this.setProposal(R4.id, R4), await this.setAuthRequest(Y3, { request: b4(E2({}, U3), { verifyContext: {} }), pairingTopic: v5, transportType: r3 }), { uri: he5 ?? T3, response: q3 };
    }), c4(this, "approveSessionAuthenticate", async (e2) => {
      const { id: t, auths: s2 } = e2, i3 = this.client.core.eventClient.createEvent({ properties: { topic: t.toString(), trace: [or3.authenticated_session_approve_started] } });
      try {
        this.isInitialized();
      } catch (g2) {
        throw i3.setError(ar3.no_internet_connection), g2;
      }
      const r3 = this.getPendingAuthRequest(t);
      if (!r3) throw i3.setError(ar3.authenticated_session_pending_request_not_found), new Error(`Could not find pending auth request with id ${t}`);
      const n5 = r3.transportType || ee3.relay;
      n5 === ee3.relay && await this.confirmOnlineStateOrThrow();
      const a3 = r3.requester.publicKey, l6 = await this.client.core.crypto.generateKeyPair(), h4 = ba(a3), p3 = { type: ie2, receiverPublicKey: a3, senderPublicKey: l6 }, y4 = [], d4 = [];
      for (const g2 of s2) {
        if (!await Vc({ cacao: g2, projectId: this.client.core.projectId })) {
          i3.setError(ar3.invalid_cacao);
          const V4 = zt2("SESSION_SETTLEMENT_FAILED", "Signature verification failed");
          throw await this.sendError({ id: t, topic: h4, error: V4, encodeOpts: p3 }), new Error(V4.message);
        }
        i3.addTrace(or3.cacaos_verified);
        const { p: f4 } = g2, v5 = je3(f4.resources), T3 = [no2(f4.iss)], A3 = bn2(f4.iss);
        if (v5) {
          const V4 = zc(v5), x5 = Yc(v5);
          y4.push(...V4), T3.push(...x5);
        }
        for (const V4 of T3) d4.push(`${V4}:${A3}`);
      }
      const u2 = await this.client.core.crypto.generateSharedKey(l6, a3);
      i3.addTrace(or3.create_authenticated_session_topic);
      let w3;
      if (y4?.length > 0) {
        w3 = { topic: u2, acknowledged: true, self: { publicKey: l6, metadata: this.client.metadata }, peer: { publicKey: a3, metadata: r3.requester.metadata }, controller: a3, expiry: _i(se3), authentication: s2, requiredNamespaces: {}, optionalNamespaces: {}, relay: { protocol: "irn" }, pairingTopic: r3.pairingTopic, namespaces: za([...new Set(y4)], [...new Set(d4)]), transportType: n5 }, i3.addTrace(or3.subscribing_authenticated_session_topic);
        try {
          await this.client.core.relayer.subscribe(u2, { transportType: n5 });
        } catch (g2) {
          throw i3.setError(ar3.subscribe_authenticated_session_topic_failure), g2;
        }
        i3.addTrace(or3.subscribe_authenticated_session_topic_success), await this.client.session.set(u2, w3), i3.addTrace(or3.store_authenticated_session), await this.client.core.pairing.updateMetadata({ topic: r3.pairingTopic, metadata: r3.requester.metadata });
      }
      i3.addTrace(or3.publishing_authenticated_session_approve);
      try {
        await this.sendResult({ topic: h4, id: t, result: { cacaos: s2, responder: { publicKey: l6, metadata: this.client.metadata } }, encodeOpts: p3, throwOnFailedPublish: true, appLink: this.getAppLinkIfEnabled(r3.requester.metadata, n5) });
      } catch (g2) {
        throw i3.setError(ar3.authenticated_session_approve_publish_failure), g2;
      }
      return await this.client.auth.requests.delete(t, { message: "fulfilled", code: 0 }), await this.client.core.pairing.activate({ topic: r3.pairingTopic }), this.client.core.eventClient.deleteEvent({ eventId: i3.eventId }), { session: w3 };
    }), c4(this, "rejectSessionAuthenticate", async (e2) => {
      this.isInitialized();
      const { id: t, reason: s2 } = e2, i3 = this.getPendingAuthRequest(t);
      if (!i3) throw new Error(`Could not find pending auth request with id ${t}`);
      i3.transportType === ee3.relay && await this.confirmOnlineStateOrThrow();
      const r3 = i3.requester.publicKey, n5 = await this.client.core.crypto.generateKeyPair(), a3 = ba(r3), l6 = { type: ie2, receiverPublicKey: r3, senderPublicKey: n5 };
      await this.sendError({ id: t, topic: a3, error: s2, encodeOpts: l6, rpcOpts: N11.wc_sessionAuthenticate.reject, appLink: this.getAppLinkIfEnabled(i3.requester.metadata, i3.transportType) }), await this.client.auth.requests.delete(t, { message: "rejected", code: 0 }), await this.deleteProposal(t);
    }), c4(this, "formatAuthMessage", (e2) => {
      this.isInitialized();
      const { request: t, iss: s2 } = e2;
      return ro2(t, s2);
    }), c4(this, "processRelayMessageCache", () => {
      setTimeout(async () => {
        if (this.relayMessageCache.length !== 0) for (; this.relayMessageCache.length > 0; ) try {
          const e2 = this.relayMessageCache.shift();
          e2 && await this.onRelayMessage(e2);
        } catch (e2) {
          this.client.logger.error(e2);
        }
      }, 50);
    }), c4(this, "cleanupDuplicatePairings", async (e2) => {
      if (e2.pairingTopic) try {
        const t = this.client.core.pairing.pairings.get(e2.pairingTopic), s2 = this.client.core.pairing.pairings.getAll().filter((i3) => {
          var r3, n5;
          return ((r3 = i3.peerMetadata) == null ? void 0 : r3.url) && ((n5 = i3.peerMetadata) == null ? void 0 : n5.url) === e2.peer.metadata.url && i3.topic && i3.topic !== t.topic;
        });
        if (s2.length === 0) return;
        this.client.logger.info(`Cleaning up ${s2.length} duplicate pairing(s)`), await Promise.all(s2.map((i3) => this.client.core.pairing.disconnect({ topic: i3.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
      } catch (t) {
        this.client.logger.error(t);
      }
    }), c4(this, "deleteSession", async (e2) => {
      var t;
      const { topic: s2, expirerHasDeleted: i3 = false, emitEvent: r3 = true, id: n5 = 0 } = e2, { self: a3 } = this.client.session.get(s2);
      await this.client.core.relayer.unsubscribe(s2), await this.client.session.delete(s2, zt2("USER_DISCONNECTED")), this.addToRecentlyDeleted(s2, "session"), this.client.core.crypto.keychain.has(a3.publicKey) && await this.client.core.crypto.deleteKeyPair(a3.publicKey), this.client.core.crypto.keychain.has(s2) && await this.client.core.crypto.deleteSymKey(s2), i3 || this.client.core.expirer.del(s2), this.client.core.storage.removeItem($e4).catch((l6) => this.client.logger.warn(l6)), s2 === ((t = this.sessionRequestQueue.queue[0]) == null ? void 0 : t.topic) && (this.sessionRequestQueue.state = K6.idle), await Promise.all(this.getPendingSessionRequests().filter((l6) => l6.topic === s2).map((l6) => this.deletePendingSessionRequest(l6.id, zt2("USER_DISCONNECTED")))), r3 && this.client.events.emit("session_delete", { id: n5, topic: s2 });
    }), c4(this, "deleteProposal", async (e2, t) => {
      if (t) try {
        const s2 = this.client.proposal.get(e2), i3 = this.client.core.eventClient.getEvent({ topic: s2.pairingTopic });
        i3?.setError(nr3.proposal_expired);
      } catch {
      }
      await Promise.all([this.client.proposal.delete(e2, zt2("USER_DISCONNECTED")), t ? Promise.resolve() : this.client.core.expirer.del(e2)]), this.addToRecentlyDeleted(e2, "proposal");
    }), c4(this, "deletePendingSessionRequest", async (e2, t, s2 = false) => {
      await Promise.all([this.client.pendingRequest.delete(e2, t), s2 ? Promise.resolve() : this.client.core.expirer.del(e2)]), this.addToRecentlyDeleted(e2, "request"), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i3) => i3.id !== e2), s2 && (this.sessionRequestQueue.state = K6.idle, this.client.events.emit("session_request_expire", { id: e2 }));
    }), c4(this, "deletePendingAuthRequest", async (e2, t, s2 = false) => {
      await Promise.all([this.client.auth.requests.delete(e2, t), s2 ? Promise.resolve() : this.client.core.expirer.del(e2)]);
    }), c4(this, "setExpiry", async (e2, t) => {
      this.client.session.keys.includes(e2) && (this.client.core.expirer.set(e2, t), await this.client.session.update(e2, { expiry: t }));
    }), c4(this, "setProposal", async (e2, t) => {
      this.client.core.expirer.set(e2, _i(N11.wc_sessionPropose.req.ttl)), await this.client.proposal.set(e2, t);
    }), c4(this, "setAuthRequest", async (e2, t) => {
      const { request: s2, pairingTopic: i3, transportType: r3 = ee3.relay } = t;
      this.client.core.expirer.set(e2, s2.expiryTimestamp), await this.client.auth.requests.set(e2, { authPayload: s2.authPayload, requester: s2.requester, expiryTimestamp: s2.expiryTimestamp, id: e2, pairingTopic: i3, verifyContext: s2.verifyContext, transportType: r3 });
    }), c4(this, "setPendingSessionRequest", async (e2) => {
      const { id: t, topic: s2, params: i3, verifyContext: r3 } = e2, n5 = i3.request.expiryTimestamp || _i(N11.wc_sessionRequest.req.ttl);
      this.client.core.expirer.set(t, n5), await this.client.pendingRequest.set(t, { id: t, topic: s2, params: i3, verifyContext: r3 });
    }), c4(this, "sendRequest", async (e2) => {
      const { topic: t, method: s2, params: i3, expiry: r3, relayRpcId: n5, clientRpcId: a3, throwOnFailedPublish: l6, appLink: h4, tvf: p3, publishOpts: y4 = {} } = e2, d4 = formatJsonRpcRequest(s2, i3, a3);
      let u2;
      const w3 = !!h4;
      try {
        const v5 = w3 ? Ge3 : oe2;
        u2 = await this.client.core.crypto.encode(t, d4, { encoding: v5 });
      } catch (v5) {
        throw await this.cleanup(), this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${t} failed`), v5;
      }
      let g2;
      if (wt3.includes(s2)) {
        const v5 = ya(JSON.stringify(d4)), T3 = ya(u2);
        g2 = await this.client.core.verify.register({ id: T3, decryptedId: v5 });
      }
      const f4 = E2(E2({}, N11[s2].req), y4);
      if (f4.attestation = g2, r3 && (f4.ttl = r3), n5 && (f4.id = n5), this.client.core.history.set(t, d4), w3) {
        const v5 = La(h4, t, u2);
        await global.Linking.openURL(v5, this.client.name);
      } else f4.tvf = b4(E2({}, p3), { correlationId: d4.id }), l6 ? (f4.internal = b4(E2({}, f4.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(t, u2, f4)) : this.client.core.relayer.publish(t, u2, f4).catch((v5) => this.client.logger.error(v5));
      return d4.id;
    }), c4(this, "sendProposeSession", async (e2) => {
      const { proposal: t, publishOpts: s2 } = e2, i3 = formatJsonRpcRequest("wc_sessionPropose", t, t.id);
      this.client.core.history.set(t.pairingTopic, i3);
      const r3 = await this.client.core.crypto.encode(t.pairingTopic, i3, { encoding: oe2 }), n5 = ya(JSON.stringify(i3)), a3 = ya(r3), l6 = await this.client.core.verify.register({ id: a3, decryptedId: n5 });
      await this.client.core.relayer.publishCustom({ payload: { pairingTopic: t.pairingTopic, sessionProposal: r3 }, opts: b4(E2({}, s2), { publishMethod: "wc_proposeSession", attestation: l6 }) });
    }), c4(this, "sendApproveSession", async (e2) => {
      const { sessionTopic: t, pairingProposalResponse: s2, proposal: i3, sessionSettleRequest: r3, publishOpts: n5 } = e2, a3 = formatJsonRpcResult(i3.id, s2), l6 = await this.client.core.crypto.encode(i3.pairingTopic, a3, { encoding: oe2 }), h4 = formatJsonRpcRequest("wc_sessionSettle", r3, n5?.id), p3 = await this.client.core.crypto.encode(t, h4, { encoding: oe2 });
      this.client.core.history.set(t, h4), await this.client.core.relayer.publishCustom({ payload: { sessionTopic: t, pairingTopic: i3.pairingTopic, sessionProposalResponse: l6, sessionSettlementRequest: p3 }, opts: b4(E2({}, n5), { publishMethod: "wc_approveSession" }) });
    }), c4(this, "sendResult", async (e2) => {
      const { id: t, topic: s2, result: i3, throwOnFailedPublish: r3, encodeOpts: n5, appLink: a3 } = e2, l6 = formatJsonRpcResult(t, i3);
      let h4;
      const p3 = a3 && typeof (global == null ? void 0 : global.Linking) < "u";
      try {
        const u2 = p3 ? Ge3 : oe2;
        h4 = await this.client.core.crypto.encode(s2, l6, b4(E2({}, n5 || {}), { encoding: u2 }));
      } catch (u2) {
        throw await this.cleanup(), this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${s2} failed`), u2;
      }
      let y4, d4;
      try {
        y4 = await this.client.core.history.get(s2, t);
        const u2 = y4.request;
        try {
          d4 = this.getTVFParams(t, u2.params, i3);
        } catch (w3) {
          this.client.logger.warn(`sendResult() -> getTVFParams() failed: ${w3?.message}`);
        }
      } catch (u2) {
        throw this.client.logger.error(`sendResult() -> history.get(${s2}, ${t}) failed`), u2;
      }
      if (p3) {
        const u2 = La(a3, s2, h4);
        await global.Linking.openURL(u2, this.client.name);
      } else {
        const u2 = y4.request.method, w3 = N11[u2].res;
        w3.tvf = b4(E2({}, d4), { correlationId: t }), r3 ? (w3.internal = b4(E2({}, w3.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(s2, h4, w3)) : this.client.core.relayer.publish(s2, h4, w3).catch((g2) => this.client.logger.error(g2));
      }
      await this.client.core.history.resolve(l6);
    }), c4(this, "sendError", async (e2) => {
      const { id: t, topic: s2, error: i3, encodeOpts: r3, rpcOpts: n5, appLink: a3 } = e2, l6 = formatJsonRpcError(t, i3);
      let h4;
      const p3 = a3 && typeof (global == null ? void 0 : global.Linking) < "u";
      try {
        const d4 = p3 ? Ge3 : oe2;
        h4 = await this.client.core.crypto.encode(s2, l6, b4(E2({}, r3 || {}), { encoding: d4 }));
      } catch (d4) {
        throw await this.cleanup(), this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${s2} failed`), d4;
      }
      let y4;
      try {
        y4 = await this.client.core.history.get(s2, t);
      } catch (d4) {
        throw this.client.logger.error(`sendError() -> history.get(${s2}, ${t}) failed`), d4;
      }
      if (p3) {
        const d4 = La(a3, s2, h4);
        await global.Linking.openURL(d4, this.client.name);
      } else {
        const d4 = y4.request.method, u2 = n5 || N11[d4].res;
        this.client.core.relayer.publish(s2, h4, u2);
      }
      await this.client.core.history.resolve(l6);
    }), c4(this, "cleanup", async () => {
      const e2 = [], t = [];
      this.client.session.getAll().forEach((s2) => {
        let i3 = false;
        Ri(s2.expiry) && (i3 = true), this.client.core.crypto.keychain.has(s2.topic) || (i3 = true), i3 && e2.push(s2.topic);
      }), this.client.proposal.getAll().forEach((s2) => {
        Ri(s2.expiryTimestamp) && t.push(s2.id);
      }), await Promise.all([...e2.map((s2) => this.deleteSession({ topic: s2 })), ...t.map((s2) => this.deleteProposal(s2))]);
    }), c4(this, "onProviderMessageEvent", async (e2) => {
      !this.initialized || this.relayMessageCache.length > 0 ? this.relayMessageCache.push(e2) : await this.onRelayMessage(e2);
    }), c4(this, "onRelayEventRequest", async (e2) => {
      this.requestQueue.queue.push(e2), await this.processRequestsQueue();
    }), c4(this, "processRequestsQueue", async () => {
      if (this.requestQueue.state === K6.active) {
        this.client.logger.info("Request queue already active, skipping...");
        return;
      }
      for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0; ) {
        this.requestQueue.state = K6.active;
        const e2 = this.requestQueue.queue.shift();
        if (e2) try {
          await this.processRequest(e2);
        } catch (t) {
          this.client.logger.warn(t);
        }
      }
      this.requestQueue.state = K6.idle;
    }), c4(this, "processRequest", async (e2) => {
      const { topic: t, payload: s2, attestation: i3, transportType: r3, encryptedId: n5 } = e2, a3 = s2.method;
      if (!this.shouldIgnorePairingRequest({ topic: t, requestMethod: a3 })) switch (a3) {
        case "wc_sessionPropose":
          return await this.onSessionProposeRequest({ topic: t, payload: s2, attestation: i3, encryptedId: n5 });
        case "wc_sessionSettle":
          return await this.onSessionSettleRequest(t, s2);
        case "wc_sessionUpdate":
          return await this.onSessionUpdateRequest(t, s2);
        case "wc_sessionExtend":
          return await this.onSessionExtendRequest(t, s2);
        case "wc_sessionPing":
          return await this.onSessionPingRequest(t, s2);
        case "wc_sessionDelete":
          return await this.onSessionDeleteRequest(t, s2);
        case "wc_sessionRequest":
          return await this.onSessionRequest({ topic: t, payload: s2, attestation: i3, encryptedId: n5, transportType: r3 });
        case "wc_sessionEvent":
          return await this.onSessionEventRequest(t, s2);
        case "wc_sessionAuthenticate":
          return await this.onSessionAuthenticateRequest({ topic: t, payload: s2, attestation: i3, encryptedId: n5, transportType: r3 });
        default:
          return this.client.logger.info(`Unsupported request method ${a3}`);
      }
    }), c4(this, "onRelayEventResponse", async (e2) => {
      const { topic: t, payload: s2, transportType: i3 } = e2, r3 = (await this.client.core.history.get(t, s2.id)).request.method;
      switch (r3) {
        case "wc_sessionPropose":
          return this.onSessionProposeResponse(t, s2, i3);
        case "wc_sessionSettle":
          return this.onSessionSettleResponse(t, s2);
        case "wc_sessionUpdate":
          return this.onSessionUpdateResponse(t, s2);
        case "wc_sessionExtend":
          return this.onSessionExtendResponse(t, s2);
        case "wc_sessionPing":
          return this.onSessionPingResponse(t, s2);
        case "wc_sessionRequest":
          return this.onSessionRequestResponse(t, s2);
        case "wc_sessionAuthenticate":
          return this.onSessionAuthenticateResponse(t, s2);
        default:
          return this.client.logger.info(`Unsupported response method ${r3}`);
      }
    }), c4(this, "onRelayEventUnknownPayload", (e2) => {
      const { topic: t } = e2, { message: s2 } = Bt2("MISSING_OR_INVALID", `Decoded payload on topic ${t} is not identifiable as a JSON-RPC request or a response.`);
      throw new Error(s2);
    }), c4(this, "shouldIgnorePairingRequest", (e2) => {
      const { topic: t, requestMethod: s2 } = e2, i3 = this.expectedPairingMethodMap.get(t);
      return !i3 || i3.includes(s2) ? false : !!(i3.includes("wc_sessionAuthenticate") && this.client.events.listenerCount("session_authenticate") > 0);
    }), c4(this, "onSessionProposeRequest", async (e2) => {
      const { topic: t, payload: s2, attestation: i3, encryptedId: r3 } = e2, { params: n5, id: a3 } = s2;
      try {
        const l6 = this.client.core.eventClient.getEvent({ topic: t });
        this.client.events.listenerCount("session_proposal") === 0 && (console.warn("No listener for session_proposal event"), l6?.setError(X3.proposal_listener_not_found)), this.isValidConnect(E2({}, s2.params));
        const h4 = n5.expiryTimestamp || _i(N11.wc_sessionPropose.req.ttl), p3 = E2({ id: a3, pairingTopic: t, expiryTimestamp: h4, attestation: i3, encryptedId: r3 }, n5);
        await this.setProposal(a3, p3);
        const y4 = await this.getVerifyContext({ attestationId: i3, hash: ya(JSON.stringify(s2)), encryptedId: r3, metadata: p3.proposer.metadata });
        l6?.addTrace(Y2.emit_session_proposal), this.client.events.emit("session_proposal", { id: a3, params: p3, verifyContext: y4 });
      } catch (l6) {
        await this.sendError({ id: a3, topic: t, error: l6, rpcOpts: N11.wc_sessionPropose.autoReject }), this.client.logger.error(l6);
      }
    }), c4(this, "onSessionProposeResponse", async (e2, t, s2) => {
      const { id: i3 } = t;
      if (isJsonRpcResult(t)) {
        const { result: r3 } = t;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", result: r3 });
        const n5 = this.client.proposal.get(i3);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", proposal: n5 });
        const a3 = n5.proposer.publicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", selfPublicKey: a3 });
        const l6 = r3.responderPublicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", peerPublicKey: l6 });
        const h4 = await this.client.core.crypto.generateSharedKey(a3, l6);
        this.pendingSessions.set(i3, { sessionTopic: h4, pairingTopic: e2, proposalId: i3, publicKey: a3 });
        const p3 = await this.client.core.relayer.subscribe(h4, { transportType: s2 });
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", subscriptionId: p3 }), await this.client.core.pairing.activate({ topic: e2 });
      } else if (isJsonRpcError(t)) {
        await this.deleteProposal(i3);
        const r3 = $i("session_connect", i3);
        if (this.events.listenerCount(r3) === 0) throw new Error(`emitting ${r3} without any listeners, 954`);
        this.events.emit(r3, { error: t.error });
      }
    }), c4(this, "onSessionSettleRequest", async (e2, t) => {
      const { id: s2, params: i3 } = t;
      try {
        this.isValidSessionSettleRequest(i3);
        const { relay: r3, controller: n5, expiry: a3, namespaces: l6, sessionProperties: h4, scopedProperties: p3, sessionConfig: y4, proposalRequestsResponses: d4 } = t.params, u2 = [...this.pendingSessions.values()].find((f4) => f4.sessionTopic === e2);
        if (!u2) return this.client.logger.error(`Pending session not found for topic ${e2}`);
        const w3 = this.client.proposal.get(u2.proposalId), g2 = b4(E2(E2(E2({ topic: e2, relay: r3, expiry: a3, namespaces: l6, acknowledged: true, pairingTopic: u2.pairingTopic, requiredNamespaces: w3.requiredNamespaces, optionalNamespaces: w3.optionalNamespaces, controller: n5.publicKey, self: { publicKey: u2.publicKey, metadata: this.client.metadata }, peer: { publicKey: n5.publicKey, metadata: n5.metadata } }, h4 && { sessionProperties: h4 }), p3 && { scopedProperties: p3 }), y4 && { sessionConfig: y4 }), { transportType: ee3.relay, authentication: d4?.authentication, walletPayResult: d4?.walletPay });
        await this.client.session.set(g2.topic, g2), await this.setExpiry(g2.topic, g2.expiry), await this.client.core.pairing.updateMetadata({ topic: u2.pairingTopic, metadata: g2.peer.metadata }), this.pendingSessions.delete(u2.proposalId), this.deleteProposal(u2.proposalId, false), this.cleanupDuplicatePairings(g2), await this.sendResult({ id: t.id, topic: e2, throwOnFailedPublish: true, result: true }), this.client.events.emit("session_connect", { session: g2 }), this.events.emit($i("session_connect", u2.proposalId), { session: g2 });
      } catch (r3) {
        await this.sendError({ id: s2, topic: e2, error: r3 }), this.client.logger.error(r3);
      }
    }), c4(this, "onSessionSettleResponse", async (e2, t) => {
      const { id: s2 } = t;
      isJsonRpcResult(t) ? (await this.client.session.update(e2, { acknowledged: true }), this.events.emit($i("session_approve", s2), {})) : isJsonRpcError(t) && (await this.client.session.delete(e2, zt2("USER_DISCONNECTED")), this.events.emit($i("session_approve", s2), { error: t.error }));
    }), c4(this, "onSessionUpdateRequest", async (e2, t) => {
      const { params: s2, id: i3 } = t;
      try {
        const r3 = `${e2}_session_update`, n5 = mu.get(r3);
        if (n5 && this.isRequestOutOfSync(n5, i3)) {
          this.client.logger.warn(`Discarding out of sync request - ${i3}`), this.sendError({ id: i3, topic: e2, error: zt2("INVALID_UPDATE_REQUEST") });
          return;
        }
        this.isValidUpdate(E2({ topic: e2 }, s2));
        try {
          mu.set(r3, i3), await this.client.session.update(e2, { namespaces: s2.namespaces }), await this.sendResult({ id: i3, topic: e2, result: true });
        } catch (a3) {
          throw mu.delete(r3), a3;
        }
        this.client.events.emit("session_update", { id: i3, topic: e2, params: s2 });
      } catch (r3) {
        await this.sendError({ id: i3, topic: e2, error: r3 }), this.client.logger.error(r3);
      }
    }), c4(this, "isRequestOutOfSync", (e2, t) => t.toString().slice(0, -3) < e2.toString().slice(0, -3)), c4(this, "onSessionUpdateResponse", (e2, t) => {
      const { id: s2 } = t, i3 = $i("session_update", s2);
      if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners`);
      isJsonRpcResult(t) ? this.events.emit($i("session_update", s2), {}) : isJsonRpcError(t) && this.events.emit($i("session_update", s2), { error: t.error });
    }), c4(this, "onSessionExtendRequest", async (e2, t) => {
      const { id: s2 } = t;
      try {
        this.isValidExtend({ topic: e2 }), await this.setExpiry(e2, _i(se3)), await this.sendResult({ id: s2, topic: e2, result: true }), this.client.events.emit("session_extend", { id: s2, topic: e2 });
      } catch (i3) {
        await this.sendError({ id: s2, topic: e2, error: i3 }), this.client.logger.error(i3);
      }
    }), c4(this, "onSessionExtendResponse", (e2, t) => {
      const { id: s2 } = t, i3 = $i("session_extend", s2);
      if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners`);
      isJsonRpcResult(t) ? this.events.emit($i("session_extend", s2), {}) : isJsonRpcError(t) && this.events.emit($i("session_extend", s2), { error: t.error });
    }), c4(this, "onSessionPingRequest", async (e2, t) => {
      const { id: s2 } = t;
      try {
        this.isValidPing({ topic: e2 }), await this.sendResult({ id: s2, topic: e2, result: true, throwOnFailedPublish: true }), this.client.events.emit("session_ping", { id: s2, topic: e2 });
      } catch (i3) {
        await this.sendError({ id: s2, topic: e2, error: i3 }), this.client.logger.error(i3);
      }
    }), c4(this, "onSessionPingResponse", (e2, t) => {
      const { id: s2 } = t, i3 = $i("session_ping", s2);
      setTimeout(() => {
        if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners 2176`);
        isJsonRpcResult(t) ? this.events.emit($i("session_ping", s2), {}) : isJsonRpcError(t) && this.events.emit($i("session_ping", s2), { error: t.error });
      }, 500);
    }), c4(this, "onSessionDeleteRequest", async (e2, t) => {
      const { id: s2 } = t;
      try {
        await this.isValidDisconnect({ topic: e2, reason: t.params }), this.cleanupPendingSentRequestsForTopic({ topic: e2, error: zt2("USER_DISCONNECTED") }), await this.deleteSession({ topic: e2, id: s2 });
      } catch (i3) {
        this.client.logger.error(i3);
      }
    }), c4(this, "onSessionRequest", async (e2) => {
      var t, s2, i3;
      const { topic: r3, payload: n5, attestation: a3, encryptedId: l6, transportType: h4 } = e2, { id: p3, params: y4 } = n5;
      try {
        await this.isValidRequest(E2({ topic: r3 }, y4));
        const d4 = this.client.session.get(r3), u2 = await this.getVerifyContext({ attestationId: a3, hash: ya(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", y4, p3))), encryptedId: l6, metadata: d4.peer.metadata, transportType: h4 }), w3 = { id: p3, topic: r3, params: y4, verifyContext: u2 };
        await this.setPendingSessionRequest(w3), h4 === ee3.link_mode && (t = d4.peer.metadata.redirect) != null && t.universal && this.client.core.addLinkModeSupportedApp((s2 = d4.peer.metadata.redirect) == null ? void 0 : s2.universal), (i3 = this.client.signConfig) != null && i3.disableRequestQueue ? this.emitSessionRequest(w3) : (this.addSessionRequestToSessionRequestQueue(w3), this.processSessionRequestQueue());
      } catch (d4) {
        await this.sendError({ id: p3, topic: r3, error: d4 }), this.client.logger.error(d4);
      }
    }), c4(this, "onSessionRequestResponse", (e2, t) => {
      const { id: s2 } = t, i3 = $i("session_request", s2);
      if (this.events.listenerCount(i3) === 0) throw new Error(`emitting ${i3} without any listeners`);
      isJsonRpcResult(t) ? this.events.emit($i("session_request", s2), { result: t.result }) : isJsonRpcError(t) && this.events.emit($i("session_request", s2), { error: t.error });
    }), c4(this, "onSessionEventRequest", async (e2, t) => {
      const { id: s2, params: i3 } = t;
      try {
        const r3 = `${e2}_session_event_${i3.event.name}`, n5 = mu.get(r3);
        if (n5 && this.isRequestOutOfSync(n5, s2)) {
          this.client.logger.info(`Discarding out of sync request - ${s2}`);
          return;
        }
        this.isValidEmit(E2({ topic: e2 }, i3)), this.client.events.emit("session_event", { id: s2, topic: e2, params: i3 }), mu.set(r3, s2);
      } catch (r3) {
        await this.sendError({ id: s2, topic: e2, error: r3 }), this.client.logger.error(r3);
      }
    }), c4(this, "onSessionAuthenticateResponse", (e2, t) => {
      const { id: s2 } = t;
      this.client.logger.trace({ type: "method", method: "onSessionAuthenticateResponse", topic: e2, payload: t }), isJsonRpcResult(t) ? this.events.emit($i("session_request", s2), { result: t.result }) : isJsonRpcError(t) && this.events.emit($i("session_request", s2), { error: t.error });
    }), c4(this, "onSessionAuthenticateRequest", async (e2) => {
      var t;
      const { topic: s2, payload: i3, attestation: r3, encryptedId: n5, transportType: a3 } = e2;
      try {
        const { requester: l6, authPayload: h4, expiryTimestamp: p3 } = i3.params, y4 = await this.getVerifyContext({ attestationId: r3, hash: ya(JSON.stringify(i3)), encryptedId: n5, metadata: l6.metadata, transportType: a3 }), d4 = { requester: l6, pairingTopic: s2, id: i3.id, authPayload: h4, verifyContext: y4, expiryTimestamp: p3 };
        await this.setAuthRequest(i3.id, { request: d4, pairingTopic: s2, transportType: a3 }), a3 === ee3.link_mode && (t = l6.metadata.redirect) != null && t.universal && this.client.core.addLinkModeSupportedApp(l6.metadata.redirect.universal), this.client.events.emit("session_authenticate", { topic: s2, params: i3.params, id: i3.id, verifyContext: y4 });
      } catch (l6) {
        this.client.logger.error(l6);
        const h4 = i3.params.requester.publicKey, p3 = await this.client.core.crypto.generateKeyPair(), y4 = this.getAppLinkIfEnabled(i3.params.requester.metadata, a3), d4 = { type: ie2, receiverPublicKey: h4, senderPublicKey: p3 };
        await this.sendError({ id: i3.id, topic: s2, error: l6, encodeOpts: d4, rpcOpts: N11.wc_sessionAuthenticate.autoReject, appLink: y4 });
      }
    }), c4(this, "addSessionRequestToSessionRequestQueue", (e2) => {
      this.sessionRequestQueue.queue.push(e2);
    }), c4(this, "cleanupAfterResponse", (e2) => {
      this.deletePendingSessionRequest(e2.response.id, { message: "fulfilled", code: 0 }), setTimeout(() => {
        this.sessionRequestQueue.state = K6.idle, this.processSessionRequestQueue();
      }, (0, import_time5.toMiliseconds)(this.requestQueueDelay));
    }), c4(this, "cleanupPendingSentRequestsForTopic", ({ topic: e2, error: t }) => {
      const s2 = this.client.core.history.pending;
      s2.length > 0 && s2.filter((i3) => i3.topic === e2 && i3.request.method === "wc_sessionRequest").forEach((i3) => {
        this.events.emit($i("session_request", i3.request.id), { error: t });
      });
    }), c4(this, "processSessionRequestQueue", () => {
      if (this.sessionRequestQueue.state === K6.active) {
        this.client.logger.info("session request queue is already active.");
        return;
      }
      const e2 = this.sessionRequestQueue.queue[0];
      if (!e2) {
        this.client.logger.info("session request queue is empty.");
        return;
      }
      try {
        this.emitSessionRequest(e2);
      } catch (t) {
        this.client.logger.error(t);
      }
    }), c4(this, "emitSessionRequest", (e2) => {
      if (this.emittedSessionRequests.has(e2.id)) {
        this.client.logger.warn({ id: e2.id }, `Skipping emitting \`session_request\` event for duplicate request. id: ${e2.id}`);
        return;
      }
      this.sessionRequestQueue.state = K6.active, this.emittedSessionRequests.add(e2.id), this.client.events.emit("session_request", e2);
    }), c4(this, "onPairingCreated", (e2) => {
      if (e2.methods && this.expectedPairingMethodMap.set(e2.topic, e2.methods), e2.active) return;
      const t = this.client.proposal.getAll().find((s2) => s2.pairingTopic === e2.topic);
      t && this.onSessionProposeRequest({ topic: e2.topic, payload: formatJsonRpcRequest("wc_sessionPropose", b4(E2({}, t), { requiredNamespaces: t.requiredNamespaces, optionalNamespaces: t.optionalNamespaces, relays: t.relays, proposer: t.proposer, sessionProperties: t.sessionProperties, scopedProperties: t.scopedProperties }), t.id), attestation: t.attestation, encryptedId: t.encryptedId });
    }), c4(this, "isValidConnect", async (e2) => {
      if (!ou(e2)) {
        const { message: l6 } = Bt2("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(e2)}`);
        throw new Error(l6);
      }
      const { pairingTopic: t, requiredNamespaces: s2, optionalNamespaces: i3, sessionProperties: r3, scopedProperties: n5, relays: a3 } = e2;
      if (Dt2(t) || await this.isValidPairingTopic(t), !nu(a3, true)) {
        const { message: l6 } = Bt2("MISSING_OR_INVALID", `connect() relays: ${a3}`);
        throw new Error(l6);
      }
      if (s2 && !Dt2(s2) && Ye2(s2) !== 0) {
        const l6 = "requiredNamespaces are deprecated and are automatically assigned to optionalNamespaces";
        ["fatal", "error", "silent"].includes(this.client.logger.level) ? console.warn(l6) : this.client.logger.warn(l6), this.validateNamespaces(s2, "requiredNamespaces");
      }
      if (i3 && !Dt2(i3) && Ye2(i3) !== 0 && this.validateNamespaces(i3, "optionalNamespaces"), r3 && !Dt2(r3) && this.validateSessionProps(r3, "sessionProperties"), n5 && !Dt2(n5)) {
        this.validateSessionProps(n5, "scopedProperties");
        const l6 = Object.keys(s2 || {}).concat(Object.keys(i3 || {}));
        if (!Object.keys(n5).every((h4) => l6.includes(h4.split(":")[0]))) throw new Error(`Scoped properties must be a subset of required/optional namespaces, received: ${JSON.stringify(n5)}, required/optional namespaces: ${JSON.stringify(l6)}`);
      }
    }), c4(this, "validateNamespaces", (e2, t) => {
      const s2 = eu(e2, "connect()", t);
      if (s2) throw new Error(s2.message);
    }), c4(this, "isValidApprove", async (e2) => {
      if (!ou(e2)) throw new Error(Bt2("MISSING_OR_INVALID", `approve() params: ${e2}`).message);
      const { id: t, namespaces: s2, relayProtocol: i3, sessionProperties: r3, scopedProperties: n5 } = e2;
      this.checkRecentlyDeleted(t), await this.isValidProposalId(t);
      const a3 = this.client.proposal.get(t), l6 = Ns(s2, "approve()");
      if (l6) throw new Error(l6.message);
      const h4 = _s(a3.requiredNamespaces, s2, "approve()");
      if (h4) throw new Error(h4.message);
      if (!ft2(i3, true)) {
        const { message: p3 } = Bt2("MISSING_OR_INVALID", `approve() relayProtocol: ${i3}`);
        throw new Error(p3);
      }
      if (r3 && !Dt2(r3) && this.validateSessionProps(r3, "sessionProperties"), n5 && !Dt2(n5)) {
        this.validateSessionProps(n5, "scopedProperties");
        const p3 = new Set(Object.keys(s2));
        if (!Object.keys(n5).every((y4) => p3.has(y4.split(":")[0]))) throw new Error(`Scoped properties must be a subset of approved namespaces, received: ${JSON.stringify(n5)}, approved namespaces: ${Array.from(p3).join(", ")}`);
      }
    }), c4(this, "isValidReject", async (e2) => {
      if (!ou(e2)) {
        const { message: i3 } = Bt2("MISSING_OR_INVALID", `reject() params: ${e2}`);
        throw new Error(i3);
      }
      const { id: t, reason: s2 } = e2;
      if (this.checkRecentlyDeleted(t), await this.isValidProposalId(t), !su(s2)) {
        const { message: i3 } = Bt2("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(s2)}`);
        throw new Error(i3);
      }
    }), c4(this, "isValidSessionSettleRequest", (e2) => {
      if (!ou(e2)) {
        const { message: l6 } = Bt2("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${e2}`);
        throw new Error(l6);
      }
      const { relay: t, controller: s2, namespaces: i3, expiry: r3 } = e2;
      if (!Us(t)) {
        const { message: l6 } = Bt2("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
        throw new Error(l6);
      }
      const n5 = tu(s2, "onSessionSettleRequest()");
      if (n5) throw new Error(n5.message);
      const a3 = Ns(i3, "onSessionSettleRequest()");
      if (a3) throw new Error(a3.message);
      if (Ri(r3)) {
        const { message: l6 } = Bt2("EXPIRED", "onSessionSettleRequest()");
        throw new Error(l6);
      }
    }), c4(this, "isValidUpdate", async (e2) => {
      if (!ou(e2)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", `update() params: ${e2}`);
        throw new Error(a3);
      }
      const { topic: t, namespaces: s2 } = e2;
      this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
      const i3 = this.client.session.get(t), r3 = Ns(s2, "update()");
      if (r3) throw new Error(r3.message);
      const n5 = _s(i3.requiredNamespaces, s2, "update()");
      if (n5) throw new Error(n5.message);
    }), c4(this, "isValidExtend", async (e2) => {
      if (!ou(e2)) {
        const { message: s2 } = Bt2("MISSING_OR_INVALID", `extend() params: ${e2}`);
        throw new Error(s2);
      }
      const { topic: t } = e2;
      this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
    }), c4(this, "isValidRequest", async (e2) => {
      if (!ou(e2)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", `request() params: ${e2}`);
        throw new Error(a3);
      }
      const { topic: t, request: s2, chainId: i3, expiry: r3 } = e2;
      this.checkRecentlyDeleted(t), await this.isValidSessionTopic(t);
      const { namespaces: n5 } = this.client.session.get(t);
      if (!au(n5, i3)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", `request() chainId: ${i3}`);
        throw new Error(a3);
      }
      if (!iu(s2)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", `request() ${JSON.stringify(s2)}`);
        throw new Error(a3);
      }
      if (!uu(n5, i3, s2.method)) {
        const { message: a3 } = Bt2("MISSING_OR_INVALID", `request() method: ${s2.method}`);
        throw new Error(a3);
      }
      this.validateRequestExpiry(r3);
    }), c4(this, "isValidRespond", async (e2) => {
      var t;
      if (!ou(e2)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `respond() params: ${e2}`);
        throw new Error(n5);
      }
      const { topic: s2, response: i3 } = e2;
      try {
        await this.isValidSessionTopic(s2);
      } catch (n5) {
        throw (t = e2?.response) != null && t.id && this.cleanupAfterResponse(e2), n5;
      }
      if (!cu(i3)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(i3)}`);
        throw new Error(n5);
      }
      const r3 = this.client.pendingRequest.get(i3.id);
      if (r3.topic !== s2) {
        const { message: n5 } = Bt2("MISMATCHED_TOPIC", `Request response topic mismatch. reqId: ${i3.id}, expected topic: ${r3.topic}, received topic: ${s2}`);
        throw new Error(n5);
      }
    }), c4(this, "isValidPing", async (e2) => {
      if (!ou(e2)) {
        const { message: s2 } = Bt2("MISSING_OR_INVALID", `ping() params: ${e2}`);
        throw new Error(s2);
      }
      const { topic: t } = e2;
      await this.isValidSessionOrPairingTopic(t);
    }), c4(this, "isValidEmit", async (e2) => {
      if (!ou(e2)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `emit() params: ${e2}`);
        throw new Error(n5);
      }
      const { topic: t, event: s2, chainId: i3 } = e2;
      await this.isValidSessionTopic(t);
      const { namespaces: r3 } = this.client.session.get(t);
      if (!au(r3, i3)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `emit() chainId: ${i3}`);
        throw new Error(n5);
      }
      if (!fu(s2)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s2)}`);
        throw new Error(n5);
      }
      if (!lu(r3, i3, s2.name)) {
        const { message: n5 } = Bt2("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s2)}`);
        throw new Error(n5);
      }
    }), c4(this, "isValidDisconnect", async (e2) => {
      if (!ou(e2)) {
        const { message: s2 } = Bt2("MISSING_OR_INVALID", `disconnect() params: ${e2}`);
        throw new Error(s2);
      }
      const { topic: t } = e2;
      await this.isValidSessionOrPairingTopic(t);
    }), c4(this, "isValidAuthenticate", (e2) => {
      const { chains: t, uri: s2, domain: i3, nonce: r3 } = e2;
      if (!Array.isArray(t) || t.length === 0) throw new Error("chains is required and must be a non-empty array");
      if (!ft2(s2, false)) throw new Error("uri is required parameter");
      if (!ft2(i3, false)) throw new Error("domain is required parameter");
      if (!ft2(r3, false)) throw new Error("nonce is required parameter");
      if ([...new Set(t.map((a3) => Je2(a3).namespace))].length > 1) throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");
      const { namespace: n5 } = Je2(t[0]);
      if (n5 !== "eip155") throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.");
    }), c4(this, "getVerifyContext", async (e2) => {
      const { attestationId: t, hash: s2, encryptedId: i3, metadata: r3, transportType: n5 } = e2, a3 = { verified: { verifyUrl: r3.verifyUrl || be4, validation: "UNKNOWN", origin: r3.url || "" } };
      try {
        if (n5 === ee3.link_mode) {
          const h4 = this.getAppLinkIfEnabled(r3, n5);
          return a3.verified.validation = h4 && new URL(h4).origin === new URL(r3.url).origin ? "VALID" : "INVALID", a3;
        }
        const l6 = await this.client.core.verify.resolve({ attestationId: t, hash: s2, encryptedId: i3, verifyUrl: r3.verifyUrl });
        l6 && (a3.verified.origin = l6.origin, a3.verified.isScam = l6.isScam, a3.verified.validation = l6.origin === new URL(r3.url).origin ? "VALID" : "INVALID");
      } catch (l6) {
        this.client.logger.warn(l6);
      }
      return this.client.logger.debug(`Verify context: ${JSON.stringify(a3)}`), a3;
    }), c4(this, "validateSessionProps", (e2, t) => {
      Object.values(e2).forEach((s2, i3) => {
        if (s2 == null) {
          const { message: r3 } = Bt2("MISSING_OR_INVALID", `${t} must contain an existing value for each key. Received: ${s2} for key ${Object.keys(e2)[i3]}`);
          throw new Error(r3);
        }
      });
    }), c4(this, "getPendingAuthRequest", (e2) => {
      const t = this.client.auth.requests.get(e2);
      return typeof t == "object" ? t : void 0;
    }), c4(this, "addToRecentlyDeleted", (e2, t) => {
      if (this.recentlyDeletedMap.set(e2, t), this.recentlyDeletedMap.size >= this.recentlyDeletedLimit) {
        let s2 = 0;
        const i3 = this.recentlyDeletedLimit / 2;
        for (const r3 of this.recentlyDeletedMap.keys()) {
          if (s2++ >= i3) break;
          this.recentlyDeletedMap.delete(r3);
        }
      }
    }), c4(this, "checkRecentlyDeleted", (e2) => {
      const t = this.recentlyDeletedMap.get(e2);
      if (t) {
        const { message: s2 } = Bt2("MISSING_OR_INVALID", `Record was recently deleted - ${t}: ${e2}`);
        throw new Error(s2);
      }
    }), c4(this, "isLinkModeEnabled", (e2, t) => {
      var s2, i3, r3, n5, a3, l6, h4, p3, y4;
      return !e2 || t !== ee3.link_mode ? false : ((i3 = (s2 = this.client.metadata) == null ? void 0 : s2.redirect) == null ? void 0 : i3.linkMode) === true && ((n5 = (r3 = this.client.metadata) == null ? void 0 : r3.redirect) == null ? void 0 : n5.universal) !== void 0 && ((l6 = (a3 = this.client.metadata) == null ? void 0 : a3.redirect) == null ? void 0 : l6.universal) !== "" && ((h4 = e2?.redirect) == null ? void 0 : h4.universal) !== void 0 && ((p3 = e2?.redirect) == null ? void 0 : p3.universal) !== "" && ((y4 = e2?.redirect) == null ? void 0 : y4.linkMode) === true && this.client.core.linkModeSupportedApps.includes(e2.redirect.universal) && typeof (global == null ? void 0 : global.Linking) < "u";
    }), c4(this, "getAppLinkIfEnabled", (e2, t) => {
      var s2;
      return this.isLinkModeEnabled(e2, t) ? (s2 = e2?.redirect) == null ? void 0 : s2.universal : void 0;
    }), c4(this, "handleLinkModeMessage", ({ url: e2 }) => {
      if (!e2 || !e2.includes("wc_ev") || !e2.includes("topic")) return;
      const t = ji(e2, "topic") || "", s2 = decodeURIComponent(ji(e2, "wc_ev") || ""), i3 = this.client.session.keys.includes(t);
      i3 && this.client.session.update(t, { transportType: ee3.link_mode }), this.client.core.dispatchEnvelope({ topic: t, message: s2, sessionExists: i3 });
    }), c4(this, "registerLinkModeListeners", async () => {
      var e2;
      if (ki() || It2() && (e2 = this.client.metadata.redirect) != null && e2.linkMode) {
        const t = global == null ? void 0 : global.Linking;
        if (typeof t < "u") {
          t.addEventListener("url", this.handleLinkModeMessage, this.client.name);
          const s2 = await t.getInitialURL();
          s2 && setTimeout(() => {
            this.handleLinkModeMessage({ url: s2 });
          }, 50);
        }
      }
    }), c4(this, "getTVFApproveParams", (e2) => {
      try {
        const t = gs(e2.namespaces), s2 = qa(e2.namespaces), i3 = Fa(e2.namespaces), r3 = e2.sessionProperties, n5 = e2.scopedProperties;
        return { approvedChains: t, approvedMethods: s2, approvedEvents: i3, sessionProperties: r3, scopedProperties: n5 };
      } catch (t) {
        return this.client.logger.warn(t, "Error getting TVF approve params"), {};
      }
    }), c4(this, "getTVFParams", (e2, t, s2) => {
      var i3, r3, n5;
      if (!((i3 = t.request) != null && i3.method)) return {};
      const a3 = { correlationId: e2, rpcMethods: [t.request.method], chainId: t.chainId };
      try {
        const l6 = this.extractTxHashesFromResult(t.request, s2);
        a3.txHashes = l6, a3.contractAddresses = this.isValidContractData(t.request.params) ? [(n5 = (r3 = t.request.params) == null ? void 0 : r3[0]) == null ? void 0 : n5.to] : [];
      } catch (l6) {
        this.client.logger.warn(l6, "Error getting TVF params");
      }
      return a3;
    }), c4(this, "isValidContractData", (e2) => {
      var t;
      if (!e2) return false;
      try {
        const s2 = e2?.data || ((t = e2?.[0]) == null ? void 0 : t.data);
        if (!s2.startsWith("0x")) return false;
        const i3 = s2.slice(2);
        return /^[0-9a-fA-F]*$/.test(i3) ? i3.length % 2 === 0 : false;
      } catch {
      }
      return false;
    }), c4(this, "extractTxHashesFromResult", (e2, t) => {
      var s2;
      try {
        if (!t) return [];
        const i3 = e2.method, r3 = yt3[i3];
        if (i3 === "sui_signTransaction") return [Uc(t.transactionBytes)];
        if (i3 === "near_signTransaction") return [_c(t)];
        if (i3 === "near_signTransactions") return t.map((a3) => _c(a3));
        if (i3 === "xrpl_signTransactionFor" || i3 === "xrpl_signTransaction") return [(s2 = t.tx_json) == null ? void 0 : s2.hash];
        if (i3 === "polkadot_signTransaction") return [Bu({ transaction: e2.params.transactionPayload, signature: t.signature })];
        if (i3 === "algo_signTxn") return Be3(t) ? t.map((a3) => Rc(a3)) : [Rc(t)];
        if (i3 === "cosmos_signDirect") return [$c(t)];
        if (i3 === "wallet_sendCalls") return Tc(t);
        if (typeof t == "string") return [t];
        const n5 = t[r3.key];
        if (Be3(n5)) return i3 === "solana_signAllTransactions" ? n5.map((a3) => Nc(a3)) : n5;
        if (typeof n5 == "string") return [n5];
      } catch (i3) {
        this.client.logger.warn(i3, "Error extracting tx hashes from result");
      }
      return [];
    });
  }
  async processPendingMessageEvents() {
    try {
      const o4 = this.client.session.keys, e2 = this.client.core.relayer.messages.getWithoutAck(o4);
      for (const [t, s2] of Object.entries(e2)) for (const i3 of s2) try {
        await this.onProviderMessageEvent({ topic: t, message: i3, publishedAt: Date.now() });
      } catch {
        this.client.logger.warn(`Error processing pending message event for topic: ${t}, message: ${i3}`);
      }
    } catch (o4) {
      this.client.logger.warn(o4, "processPendingMessageEvents failed");
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: o4 } = Bt2("NOT_INITIALIZED", this.name);
      throw new Error(o4);
    }
  }
  async confirmOnlineStateOrThrow() {
    await this.client.core.relayer.confirmOnlineStateOrThrow();
  }
  registerRelayerEvents() {
    this.client.core.relayer.on(C3.message, (o4) => {
      this.onProviderMessageEvent(o4);
    });
  }
  async onRelayMessage(o4) {
    const { topic: e2, message: t, attestation: s2, transportType: i3 } = o4, { publicKey: r3 } = this.client.auth.authKeys.keys.includes(_e5) ? this.client.auth.authKeys.get(_e5) : { responseTopic: void 0, publicKey: void 0 };
    try {
      const n5 = await this.client.core.crypto.decode(e2, t, { receiverPublicKey: r3, encoding: i3 === ee3.link_mode ? Ge3 : oe2 });
      isJsonRpcRequest(n5) ? (this.client.core.history.set(e2, n5), await this.onRelayEventRequest({ topic: e2, payload: n5, attestation: s2, transportType: i3, encryptedId: ya(t) })) : isJsonRpcResponse(n5) ? (await this.client.core.history.resolve(n5), await this.onRelayEventResponse({ topic: e2, payload: n5, transportType: i3 }), this.client.core.history.delete(e2, n5.id)) : (this.client.logger.error(`onRelayMessage() -> unknown payload: ${JSON.stringify(n5)}`), await this.onRelayEventUnknownPayload({ topic: e2, payload: n5, transportType: i3 })), await this.client.core.relayer.messages.ack(e2, t);
    } catch (n5) {
      this.client.logger.error(`onRelayMessage() -> failed to process an inbound message: ${t}`), this.client.logger.error(n5);
    }
  }
  registerExpirerEvents() {
    this.client.core.expirer.on(q2.expired, async (o4) => {
      const { topic: e2, id: t } = Ui(o4.target);
      if (t && this.client.pendingRequest.keys.includes(t)) return await this.deletePendingSessionRequest(t, Bt2("EXPIRED"), true);
      if (t && this.client.auth.requests.keys.includes(t)) return await this.deletePendingAuthRequest(t, Bt2("EXPIRED"), true);
      e2 ? this.client.session.keys.includes(e2) && (await this.deleteSession({ topic: e2, expirerHasDeleted: true }), this.client.events.emit("session_expire", { topic: e2 })) : t && (await this.deleteProposal(t, true), this.client.events.emit("proposal_expire", { id: t }));
    });
  }
  registerPairingEvents() {
    this.client.core.pairing.events.on(ae3.create, (o4) => this.onPairingCreated(o4)), this.client.core.pairing.events.on(ae3.delete, (o4) => {
      this.addToRecentlyDeleted(o4.topic, "pairing");
    });
  }
  isValidPairingTopic(o4) {
    if (!ft2(o4, false)) {
      const { message: e2 } = Bt2("MISSING_OR_INVALID", `pairing topic should be a string: ${o4}`);
      throw new Error(e2);
    }
    if (!this.client.core.pairing.pairings.keys.includes(o4)) {
      const { message: e2 } = Bt2("NO_MATCHING_KEY", `pairing topic doesn't exist: ${o4}`);
      throw new Error(e2);
    }
    if (Ri(this.client.core.pairing.pairings.get(o4).expiry)) {
      const { message: e2 } = Bt2("EXPIRED", `pairing topic: ${o4}`);
      throw new Error(e2);
    }
  }
  async isValidSessionTopic(o4) {
    if (!ft2(o4, false)) {
      const { message: e2 } = Bt2("MISSING_OR_INVALID", `session topic should be a string: ${o4}`);
      throw new Error(e2);
    }
    if (this.checkRecentlyDeleted(o4), !this.client.session.keys.includes(o4)) {
      const { message: e2 } = Bt2("NO_MATCHING_KEY", `session topic doesn't exist: ${o4}`);
      throw new Error(e2);
    }
    if (Ri(this.client.session.get(o4).expiry)) {
      await this.deleteSession({ topic: o4 });
      const { message: e2 } = Bt2("EXPIRED", `session topic: ${o4}`);
      throw new Error(e2);
    }
    if (!this.client.core.crypto.keychain.has(o4)) {
      const { message: e2 } = Bt2("MISSING_OR_INVALID", `session topic does not exist in keychain: ${o4}`);
      throw await this.deleteSession({ topic: o4 }), new Error(e2);
    }
  }
  async isValidSessionOrPairingTopic(o4) {
    if (this.checkRecentlyDeleted(o4), this.client.session.keys.includes(o4)) await this.isValidSessionTopic(o4);
    else if (this.client.core.pairing.pairings.keys.includes(o4)) this.isValidPairingTopic(o4);
    else if (ft2(o4, false)) {
      const { message: e2 } = Bt2("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${o4}`);
      throw new Error(e2);
    } else {
      const { message: e2 } = Bt2("MISSING_OR_INVALID", `session or pairing topic should be a string: ${o4}`);
      throw new Error(e2);
    }
  }
  async isValidProposalId(o4) {
    if (!ru(o4)) {
      const { message: e2 } = Bt2("MISSING_OR_INVALID", `proposal id should be a number: ${o4}`);
      throw new Error(e2);
    }
    if (!this.client.proposal.keys.includes(o4)) {
      const { message: e2 } = Bt2("NO_MATCHING_KEY", `proposal id doesn't exist: ${o4}`);
      throw new Error(e2);
    }
    if (Ri(this.client.proposal.get(o4).expiryTimestamp)) {
      await this.deleteProposal(o4);
      const { message: e2 } = Bt2("EXPIRED", `proposal id: ${o4}`);
      throw new Error(e2);
    }
  }
  validateRequestExpiry(o4) {
    if (o4 && !pu(o4, Te4)) {
      const { message: e2 } = Bt2("MISSING_OR_INVALID", `request() expiry: ${o4}. Expiry must be a number (in seconds) between ${Te4.min} and ${Te4.max}`);
      throw new Error(e2);
    }
  }
};
var Ls2 = class extends ji2 {
  constructor(o4, e2) {
    super(o4, e2, dt3, Re5), this.core = o4, this.logger = e2;
  }
};
var It4 = class extends ji2 {
  constructor(o4, e2) {
    super(o4, e2, ut3, Re5), this.core = o4, this.logger = e2;
  }
};
var Ms2 = class extends ji2 {
  constructor(o4, e2) {
    super(o4, e2, mt2, Re5, (t) => t.id), this.core = o4, this.logger = e2;
  }
};
var $s2 = class extends ji2 {
  constructor(o4, e2) {
    super(o4, e2, St4, we4, () => _e5), this.core = o4, this.logger = e2;
  }
};
var Ks = class extends ji2 {
  constructor(o4, e2) {
    super(o4, e2, Et4, we4), this.core = o4, this.logger = e2;
  }
};
var Us2 = class extends ji2 {
  constructor(o4, e2) {
    super(o4, e2, ft3, we4, (t) => t.id), this.core = o4, this.logger = e2;
  }
};
var Gs = Object.defineProperty;
var js2 = (S4, o4, e2) => o4 in S4 ? Gs(S4, o4, { enumerable: true, configurable: true, writable: true, value: e2 }) : S4[o4] = e2;
var Ge5 = (S4, o4, e2) => js2(S4, typeof o4 != "symbol" ? o4 + "" : o4, e2);
var Fs = class {
  constructor(o4, e2) {
    this.core = o4, this.logger = e2, Ge5(this, "authKeys"), Ge5(this, "pairingTopics"), Ge5(this, "requests"), this.authKeys = new $s2(this.core, this.logger), this.pairingTopics = new Ks(this.core, this.logger), this.requests = new Us2(this.core, this.logger);
  }
  async init() {
    await this.authKeys.init(), await this.pairingTopics.init(), await this.requests.init();
  }
};
var Hs2 = Object.defineProperty;
var Qs2 = (S4, o4, e2) => o4 in S4 ? Hs2(S4, o4, { enumerable: true, configurable: true, writable: true, value: e2 }) : S4[o4] = e2;
var _2 = (S4, o4, e2) => Qs2(S4, typeof o4 != "symbol" ? o4 + "" : o4, e2);
var qe4 = class _qe extends J5 {
  constructor(o4) {
    super(o4), _2(this, "protocol", De5), _2(this, "version", Le4), _2(this, "name", Ie4.name), _2(this, "metadata"), _2(this, "core"), _2(this, "logger"), _2(this, "events", new import_events10.EventEmitter()), _2(this, "engine"), _2(this, "session"), _2(this, "proposal"), _2(this, "pendingRequest"), _2(this, "auth"), _2(this, "signConfig"), _2(this, "on", (t, s2) => this.events.on(t, s2)), _2(this, "once", (t, s2) => this.events.once(t, s2)), _2(this, "off", (t, s2) => this.events.off(t, s2)), _2(this, "removeListener", (t, s2) => this.events.removeListener(t, s2)), _2(this, "removeAllListeners", (t) => this.events.removeAllListeners(t)), _2(this, "connect", async (t) => {
      try {
        return await this.engine.connect(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "pair", async (t) => {
      try {
        return await this.engine.pair(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "approve", async (t) => {
      try {
        return await this.engine.approve(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "reject", async (t) => {
      try {
        return await this.engine.reject(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "update", async (t) => {
      try {
        return await this.engine.update(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "extend", async (t) => {
      try {
        return await this.engine.extend(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "request", async (t) => {
      try {
        return await this.engine.request(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "respond", async (t) => {
      try {
        return await this.engine.respond(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "ping", async (t) => {
      try {
        return await this.engine.ping(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "emit", async (t) => {
      try {
        return await this.engine.emit(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "disconnect", async (t) => {
      try {
        return await this.engine.disconnect(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "find", (t) => {
      try {
        return this.engine.find(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "getPendingSessionRequests", () => {
      try {
        return this.engine.getPendingSessionRequests();
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }), _2(this, "authenticate", async (t, s2) => {
      try {
        return await this.engine.authenticate(t, s2);
      } catch (i3) {
        throw this.logger.error(i3.message), i3;
      }
    }), _2(this, "formatAuthMessage", (t) => {
      try {
        return this.engine.formatAuthMessage(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "approveSessionAuthenticate", async (t) => {
      try {
        return await this.engine.approveSessionAuthenticate(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), _2(this, "rejectSessionAuthenticate", async (t) => {
      try {
        return await this.engine.rejectSessionAuthenticate(t);
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }), this.name = o4?.name || Ie4.name, this.metadata = pi(o4?.metadata), this.signConfig = o4?.signConfig;
    const e2 = Iu({ logger: o4?.logger || Ie4.logger, name: this.name });
    this.logger = e2, this.core = o4?.core || new ta2(o4), this.session = new It4(this.core, this.logger), this.proposal = new Ls2(this.core, this.logger), this.pendingRequest = new Ms2(this.core, this.logger), this.engine = new Ds(this), this.auth = new Fs(this.core, this.logger);
  }
  static async init(o4) {
    const e2 = new _qe(o4);
    return await e2.initialize(), e2;
  }
  get context() {
    return ee(this.logger);
  }
  get pairing() {
    return this.core.pairing.pairings;
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.auth.init(), await this.engine.init(), this.logger.info("SignClient Initialization Success");
    } catch (o4) {
      throw this.logger.info("SignClient Initialization Failure"), this.logger.error(o4.message), o4;
    }
  }
};
var zs = It4;
var Ys2 = qe4;
export {
  vt3 as AUTH_CONTEXT,
  St4 as AUTH_KEYS_CONTEXT,
  Et4 as AUTH_PAIRING_TOPIC_CONTEXT,
  _t3 as AUTH_PROTOCOL,
  _e5 as AUTH_PUBLIC_KEY_NAME,
  ft3 as AUTH_REQUEST_CONTEXT,
  we4 as AUTH_STORAGE_PREFIX,
  bs2 as AUTH_VERSION,
  gt3 as ENGINE_CONTEXT,
  K6 as ENGINE_QUEUE_STATES,
  N11 as ENGINE_RPC_OPTS,
  Ps2 as HISTORY_CONTEXT,
  qs as HISTORY_EVENTS,
  Ns2 as HISTORY_STORAGE_VERSION,
  wt3 as METHODS_TO_VERIFY,
  dt3 as PROPOSAL_CONTEXT,
  Os2 as PROPOSAL_EXPIRY,
  Ke4 as PROPOSAL_EXPIRY_MESSAGE,
  mt2 as REQUEST_CONTEXT,
  ut3 as SESSION_CONTEXT,
  se3 as SESSION_EXPIRY,
  Te4 as SESSION_REQUEST_EXPIRY_BOUNDARIES,
  Me5 as SIGN_CLIENT_CONTEXT,
  Ie4 as SIGN_CLIENT_DEFAULT,
  Is2 as SIGN_CLIENT_EVENTS,
  De5 as SIGN_CLIENT_PROTOCOL,
  Ts2 as SIGN_CLIENT_STORAGE_OPTIONS,
  Re5 as SIGN_CLIENT_STORAGE_PREFIX,
  Le4 as SIGN_CLIENT_VERSION,
  zs as SessionStore,
  Ys2 as SignClient,
  yt3 as TVF_METHODS,
  $e4 as WALLETCONNECT_DEEPLINK_CHOICE,
  qe4 as default
};
/*! Bundled license information:

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

@walletconnect/relay-auth/dist/index.es.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/_shortw_utils.js:
@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@walletconnect/utils/dist/index.js:
  (*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) *)
*/
