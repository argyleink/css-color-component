var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _a, _b, _c, _area, _controller, _color, _space, _draggingColor, _effectiveConfig, _chromaLUT, _polarLUT, _worker, _renderSeqId, _lastRenderedId, _workerBusy, _pendingWorkerMsg, _d, _e, _value, _space2, _theme, _open, _anchor, _error, _noAlpha, _contrast, _gamut, _previewEffectCleanup, _colorSchemeEffectCleanup, _errorEffectCleanup, _controlsEffectCleanup, _areaPickerEffectCleanup, _areaPicker, _programmaticUpdate, _root, _panel, _controls, _spaceSelect, _output, _chip, _internalTrigger, _textInput, _errorMessage, _lastInvoker, _ColorInput_instances, emitChange_fn, validateAndSetColor_fn, _lastPlacement, _lastPanelSize, _cleanup, _rafId, usingCSSAnchor_fn, startReposition_fn, stopReposition_fn, scheduleReposition_fn, positionNow_fn, getAnchorRect_fn, measurePanel_fn, renderControls_fn;
var i = Symbol.for("preact-signals");
function t() {
  if (!(s > 1)) {
    var i2, t2 = false;
    while (void 0 !== h) {
      var r = h;
      h = void 0;
      f++;
      while (void 0 !== r) {
        var o2 = r.o;
        r.o = void 0;
        r.f &= -3;
        if (!(8 & r.f) && c(r)) try {
          r.c();
        } catch (r2) {
          if (!t2) {
            i2 = r2;
            t2 = true;
          }
        }
        r = o2;
      }
    }
    f = 0;
    s--;
    if (t2) throw i2;
  } else s--;
}
var o = void 0;
function n$1(i2) {
  var t2 = o;
  o = void 0;
  try {
    return i2();
  } finally {
    o = t2;
  }
}
var h = void 0, s = 0, f = 0, v = 0;
function e(i2) {
  if (void 0 !== o) {
    var t2 = i2.n;
    if (void 0 === t2 || t2.t !== o) {
      t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
      if (void 0 !== o.s) o.s.n = t2;
      o.s = t2;
      i2.n = t2;
      if (32 & o.f) i2.S(t2);
      return t2;
    } else if (-1 === t2.i) {
      t2.i = 0;
      if (void 0 !== t2.n) {
        t2.n.p = t2.p;
        if (void 0 !== t2.p) t2.p.n = t2.n;
        t2.p = o.s;
        t2.n = void 0;
        o.s.n = t2;
        o.s = t2;
      }
      return t2;
    }
  }
}
function u(i2, t2) {
  this.v = i2;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
u.prototype.brand = i;
u.prototype.h = function() {
  return true;
};
u.prototype.S = function(i2) {
  var t2 = this, r = this.t;
  if (r !== i2 && void 0 === i2.e) {
    i2.x = r;
    this.t = i2;
    if (void 0 !== r) r.e = i2;
    else n$1(function() {
      var i3;
      null == (i3 = t2.W) || i3.call(t2);
    });
  }
};
u.prototype.U = function(i2) {
  var t2 = this;
  if (void 0 !== this.t) {
    var r = i2.e, o2 = i2.x;
    if (void 0 !== r) {
      r.x = o2;
      i2.e = void 0;
    }
    if (void 0 !== o2) {
      o2.e = r;
      i2.x = void 0;
    }
    if (i2 === this.t) {
      this.t = o2;
      if (void 0 === o2) n$1(function() {
        var i3;
        null == (i3 = t2.Z) || i3.call(t2);
      });
    }
  }
};
u.prototype.subscribe = function(i2) {
  var t2 = this;
  return E(function() {
    var r = t2.value, n2 = o;
    o = void 0;
    try {
      i2(r);
    } finally {
      o = n2;
    }
  }, { name: "sub" });
};
u.prototype.valueOf = function() {
  return this.value;
};
u.prototype.toString = function() {
  return this.value + "";
};
u.prototype.toJSON = function() {
  return this.value;
};
u.prototype.peek = function() {
  var i2 = o;
  o = void 0;
  try {
    return this.value;
  } finally {
    o = i2;
  }
};
Object.defineProperty(u.prototype, "value", { get: function() {
  var i2 = e(this);
  if (void 0 !== i2) i2.i = this.i;
  return this.v;
}, set: function(i2) {
  if (i2 !== this.v) {
    if (f > 100) throw new Error("Cycle detected");
    this.v = i2;
    this.i++;
    v++;
    s++;
    try {
      for (var r = this.t; void 0 !== r; r = r.x) r.t.N();
    } finally {
      t();
    }
  }
} });
function d$1(i2, t2) {
  return new u(i2, t2);
}
function c(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
  return false;
}
function a(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
    var r = t2.S.n;
    if (void 0 !== r) t2.r = r;
    t2.S.n = t2;
    t2.i = -1;
    if (void 0 === t2.n) {
      i2.s = t2;
      break;
    }
  }
}
function l(i2) {
  var t2 = i2.s, r = void 0;
  while (void 0 !== t2) {
    var o2 = t2.p;
    if (-1 === t2.i) {
      t2.S.U(t2);
      if (void 0 !== o2) o2.n = t2.n;
      if (void 0 !== t2.n) t2.n.p = o2;
    } else r = t2;
    t2.S.n = t2.r;
    if (void 0 !== t2.r) t2.r = void 0;
    t2 = o2;
  }
  i2.s = r;
}
function y(i2, t2) {
  u.call(this, void 0);
  this.x = i2;
  this.s = void 0;
  this.g = v - 1;
  this.f = 4;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
y.prototype = new u();
y.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === v) return true;
  this.g = v;
  this.f |= 1;
  if (this.i > 0 && !c(this)) {
    this.f &= -2;
    return true;
  }
  var i2 = o;
  try {
    a(this);
    o = this;
    var t2 = this.x();
    if (16 & this.f || this.v !== t2 || 0 === this.i) {
      this.v = t2;
      this.f &= -17;
      this.i++;
    }
  } catch (i3) {
    this.v = i3;
    this.f |= 16;
    this.i++;
  }
  o = i2;
  l(this);
  this.f &= -2;
  return true;
};
y.prototype.S = function(i2) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
  }
  u.prototype.S.call(this, i2);
};
y.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    u.prototype.U.call(this, i2);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    }
  }
};
y.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
  }
};
Object.defineProperty(y.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i2 = e(this);
  this.h();
  if (void 0 !== i2) i2.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function w(i2, t2) {
  return new y(i2, t2);
}
function _(i2) {
  var r = i2.u;
  i2.u = void 0;
  if ("function" == typeof r) {
    s++;
    var n2 = o;
    o = void 0;
    try {
      r();
    } catch (t2) {
      i2.f &= -2;
      i2.f |= 8;
      b$1(i2);
      throw t2;
    } finally {
      o = n2;
      t();
    }
  }
}
function b$1(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
  i2.x = void 0;
  i2.s = void 0;
  _(i2);
}
function g$1(i2) {
  if (o !== this) throw new Error("Out-of-order effect");
  l(this);
  o = i2;
  this.f &= -2;
  if (8 & this.f) b$1(this);
  t();
}
function p$1(i2, t2) {
  this.x = i2;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
  this.name = null == t2 ? void 0 : t2.name;
}
p$1.prototype.c = function() {
  var i2 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t2 = this.x();
    if ("function" == typeof t2) this.u = t2;
  } finally {
    i2();
  }
};
p$1.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _(this);
  a(this);
  s++;
  var i2 = o;
  o = this;
  return g$1.bind(this, i2);
};
p$1.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h;
    h = this;
  }
};
p$1.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) b$1(this);
};
p$1.prototype.dispose = function() {
  this.d();
};
function E(i2, t2) {
  var r = new p$1(i2, t2);
  try {
    r.c();
  } catch (i3) {
    r.d();
    throw i3;
  }
  var o2 = r.d.bind(r);
  o2[Symbol.dispose] = o2;
  return o2;
}
function dot3(a2, b2) {
  return a2[0] * b2[0] + a2[1] * b2[1] + a2[2] * b2[2];
}
function multiply_v3_m3x3(input, matrix, out = [0, 0, 0]) {
  const x = dot3(input, matrix[0]);
  const y2 = dot3(input, matrix[1]);
  const z = dot3(input, matrix[2]);
  out[0] = x;
  out[1] = y2;
  out[2] = z;
  return out;
}
function isString(str) {
  return type(str) === "string";
}
function type(o2) {
  let str = Object.prototype.toString.call(o2);
  return (str.match(/^\[object\s+(.*?)\]$/)[1] || "").toLowerCase();
}
function serializeNumber(n2, { precision = 16, unit }) {
  if (isNone(n2)) {
    return "none";
  }
  n2 = +toPrecision(n2, precision);
  return n2 + (unit != null ? unit : "");
}
function isNone(n2) {
  return n2 === null;
}
function toPrecision(n2, precision) {
  if (n2 === 0) {
    return 0;
  }
  let integer = ~~n2;
  let digits = 0;
  if (integer && precision) {
    digits = ~~Math.log10(Math.abs(integer)) + 1;
  }
  const multiplier = 10 ** (precision - digits);
  return Math.floor(n2 * multiplier + 0.5) / multiplier;
}
function interpolate(start, end, p2) {
  if (isNaN(start)) {
    return end;
  }
  if (isNaN(end)) {
    return start;
  }
  return start + (end - start) * p2;
}
function interpolateInv(start, end, value) {
  return (value - start) / (end - start);
}
function mapRange(from, to2, value) {
  if (!from || !to2 || from === to2 || from[0] === to2[0] && from[1] === to2[1] || isNaN(value) || value === null) {
    return value;
  }
  return interpolate(to2[0], to2[1], interpolateInv(from[0], from[1], value));
}
function clamp(min, val, max2) {
  return Math.max(Math.min(max2, val), min);
}
function copySign(to2, from) {
  return Math.sign(to2) === Math.sign(from) ? to2 : -to2;
}
function spow(base, exp) {
  return copySign(Math.abs(base) ** exp, base);
}
function zdiv(n2, d2) {
  return d2 === 0 ? 0 : n2 / d2;
}
function bisectLeft(arr, value, lo = 0, hi = arr.length) {
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (arr[mid] < value) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}
function isInstance(arg, constructor) {
  var _a2;
  if (arg instanceof constructor) {
    return true;
  }
  const targetName = constructor.name;
  while (arg) {
    const proto = Object.getPrototypeOf(arg);
    const constructorName = (_a2 = proto == null ? void 0 : proto.constructor) == null ? void 0 : _a2.name;
    if (constructorName === targetName) {
      return true;
    }
    if (!constructorName || constructorName === "Object") {
      return false;
    }
    arg = proto;
  }
  return false;
}
class Type {
  /**
   * @param {any} type
   * @param {import("./types.js").CoordMeta} coordMeta
   */
  constructor(type2, coordMeta) {
    // Class properties - declared here so that type inference works
    __publicField(this, "type");
    __publicField(this, "coordMeta");
    __publicField(this, "coordRange");
    /** @type {[number, number]} */
    __publicField(this, "range");
    var _a2;
    if (typeof type2 === "object") {
      this.coordMeta = type2;
    }
    if (coordMeta) {
      this.coordMeta = coordMeta;
      this.coordRange = (_a2 = coordMeta.range) != null ? _a2 : coordMeta.refRange;
    }
    if (typeof type2 === "string") {
      let params = type2.trim().match(/^(?<type><[a-z]+>)(\[(?<min>-?[.\d]+),\s*(?<max>-?[.\d]+)\])?$/);
      if (!params) {
        throw new TypeError(`Cannot parse ${type2} as a type definition.`);
      }
      this.type = params.groups.type;
      let { min, max: max2 } = params.groups;
      if (min || max2) {
        this.range = [+min, +max2];
      }
    }
  }
  /** @returns {[number, number]} */
  get computedRange() {
    if (this.range) {
      return this.range;
    }
    if (this.type === "<percentage>") {
      return this.percentageRange();
    } else if (this.type === "<angle>") {
      return [0, 360];
    }
    return null;
  }
  get unit() {
    if (this.type === "<percentage>") {
      return "%";
    } else if (this.type === "<angle>") {
      return "deg";
    }
    return "";
  }
  /**
   * Map a number to the internal representation
   * @param {number} number
   */
  resolve(number) {
    if (this.type === "<angle>") {
      return number;
    }
    let fromRange = this.computedRange;
    let toRange = this.coordRange;
    if (this.type === "<percentage>") {
      toRange != null ? toRange : toRange = this.percentageRange();
    }
    return mapRange(fromRange, toRange, number);
  }
  /**
   * Serialize a number from the internal representation to a string
   * @param {number} number
   * @param {number} [precision]
   */
  serialize(number, precision) {
    let toRange = this.type === "<percentage>" ? this.percentageRange(100) : this.computedRange;
    let unit = this.unit;
    number = mapRange(this.coordRange, toRange, number);
    return serializeNumber(number, { unit, precision });
  }
  toString() {
    let ret = this.type;
    if (this.range) {
      let [min = "", max2 = ""] = this.range;
      ret += `[${min},${max2}]`;
    }
    return ret;
  }
  /**
   * Returns a percentage range for values of this type
   * @param {number} scale
   * @returns {[number, number]}
   */
  percentageRange(scale = 1) {
    let range;
    if (this.coordMeta && this.coordMeta.range || this.coordRange && this.coordRange[0] >= 0) {
      range = [0, 1];
    } else {
      range = [-1, 1];
    }
    return [range[0] * scale, range[1] * scale];
  }
  static get(type2, coordMeta) {
    if (isInstance(type2, this)) {
      return type2;
    }
    return new this(type2, coordMeta);
  }
}
const instance = Symbol("instance");
class Format {
  /**
   * @param {FormatInterface} format
   * @param {ColorSpace} space
   */
  constructor(format, space = format.space) {
    // Class properties - declared here so that type inference works
    __publicField(this, "type");
    __publicField(this, "name");
    __publicField(this, "spaceCoords");
    /** @type {Type[][]} */
    __publicField(this, "coords");
    /** @type {string | undefined} */
    __publicField(this, "id");
    /** @type {boolean | undefined} */
    __publicField(this, "alpha");
    format[instance] = this;
    this.type = "function";
    this.name = "color";
    Object.assign(this, format);
    this.space = space;
    if (this.type === "custom") {
      return;
    }
    this.spaceCoords = Object.values(space.coords);
    if (!this.coords) {
      this.coords = this.spaceCoords.map((coordMeta) => {
        let ret = ["<number>", "<percentage>"];
        if (coordMeta.type === "angle") {
          ret.push("<angle>");
        }
        return ret;
      });
    }
    this.coords = this.coords.map(
      /** @param {string | string[] | Type[]} types */
      (types, i2) => {
        let coordMeta = this.spaceCoords[i2];
        if (typeof types === "string") {
          types = types.trim().split(/\s*\|\s*/);
        }
        return types.map((type2) => Type.get(type2, coordMeta));
      }
    );
  }
  /**
   * @param {Coords} coords
   * @param {number} precision
   * @param {Type[]} types
   */
  serializeCoords(coords, precision, types) {
    types = coords.map((_2, i2) => {
      var _a2;
      return Type.get((_a2 = types == null ? void 0 : types[i2]) != null ? _a2 : this.coords[i2][0], this.spaceCoords[i2]);
    });
    return coords.map((c4, i2) => types[i2].serialize(c4, precision));
  }
  /**
   * Validates the coordinates of a color against a format's coord grammar and
   * maps the coordinates to the range or refRange of the coordinates.
   * @param {Coords} coords
   * @param {[string, string, string]} types
   */
  coerceCoords(coords, types) {
    return Object.entries(this.space.coords).map(([id, coordMeta], i2) => {
      var _a2;
      let arg = coords[i2];
      if (isNone(arg) || isNaN(arg)) {
        return arg;
      }
      let providedType = types[i2];
      let type2 = this.coords[i2].find((c4) => c4.type == providedType);
      if (!type2) {
        let coordName = coordMeta.name || id;
        throw new TypeError(
          `${(_a2 = providedType != null ? providedType : (
            /** @type {any} */
            arg == null ? void 0 : arg.raw
          )) != null ? _a2 : arg} not allowed for ${coordName} in ${this.name}()`
        );
      }
      arg = type2.resolve(arg);
      if (type2.range) {
        types[i2] = type2.toString();
      }
      return arg;
    });
  }
  /**
   * @returns {boolean | Required<FormatInterface>["serialize"]}
   */
  canSerialize() {
    return this.type === "function" || /** @type {any} */
    this.serialize;
  }
  /**
   * @param {string} str
   * @returns {(import("./types.js").ColorConstructor) | undefined | null}
   */
  parse(str) {
    return null;
  }
  /**
   * @param {Format | FormatInterface} format
   * @param {RemoveFirstElement<ConstructorParameters<typeof Format>>} args
   * @returns {Format}
   */
  static get(format, ...args) {
    if (!format || isInstance(format, this)) {
      return (
        /** @type {Format} */
        format
      );
    }
    if (format[instance]) {
      return format[instance];
    }
    return new Format(format, ...args);
  }
}
class Hooks {
  add(name, callback, first) {
    if (typeof arguments[0] != "string") {
      for (var name in arguments[0]) {
        this.add(name, arguments[0][name], arguments[1]);
      }
      return;
    }
    (Array.isArray(name) ? name : [name]).forEach(function(name2) {
      this[name2] = this[name2] || [];
      if (callback) {
        this[name2][first ? "unshift" : "push"](callback);
      }
    }, this);
  }
  run(name, env) {
    this[name] = this[name] || [];
    this[name].forEach(function(callback) {
      callback.call(env && env.context ? env.context : env, env);
    });
  }
}
const hooks = new Hooks();
const WHITES = {
  // for compatibility, the four-digit chromaticity-derived ones everyone else uses
  D50: [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585],
  D65: [0.3127 / 0.329, 1, (1 - 0.3127 - 0.329) / 0.329]
};
function getWhite(name) {
  if (Array.isArray(name)) {
    return name;
  }
  return WHITES[name];
}
function adapt$1(W1, W2, XYZ, options = {}) {
  W1 = getWhite(W1);
  W2 = getWhite(W2);
  if (!W1 || !W2) {
    throw new TypeError(
      `Missing white point to convert ${!W1 ? "from" : ""}${!W1 && !W2 ? "/" : ""}${!W2 ? "to" : ""}`
    );
  }
  if (W1 === W2) {
    return XYZ;
  }
  let env = { W1, W2, XYZ, options };
  hooks.run("chromatic-adaptation-start", env);
  if (!env.M) {
    if (env.W1 === WHITES.D65 && env.W2 === WHITES.D50) {
      env.M = [
        [1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
        [0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
        [-0.009243040646204504, 0.015055191490298152, 0.7518742814281371]
      ];
    } else if (env.W1 === WHITES.D50 && env.W2 === WHITES.D65) {
      env.M = [
        [0.955473421488075, -0.02309845494876471, 0.06325924320057072],
        [-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
        [0.012314014864481998, -0.020507649298898964, 1.330365926242124]
      ];
    }
  }
  hooks.run("chromatic-adaptation-end", env);
  if (env.M) {
    return multiply_v3_m3x3(env.XYZ, env.M);
  } else {
    throw new TypeError("Only Bradford CAT with white points D50 and D65 supported for now.");
  }
}
const defaults = {
  gamut_mapping: "css",
  precision: 5,
  deltaE: "76",
  // Default deltaE method
  verbose: ((_c = (_b = (_a = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : _a.env) == null ? void 0 : _b.NODE_ENV) == null ? void 0 : _c.toLowerCase()) !== "test",
  warn: function warn(msg) {
    var _a2, _b2;
    if (this.verbose) {
      (_b2 = (_a2 = globalThis == null ? void 0 : globalThis.console) == null ? void 0 : _a2.warn) == null ? void 0 : _b2.call(_a2, msg);
    }
  }
};
function parse(str, options) {
  var _a2, _b2, _c2, _d2;
  let env = {
    str: (_a2 = String(str)) == null ? void 0 : _a2.trim(),
    options
  };
  hooks.run("parse-start", env);
  if (env.color) {
    return env.color;
  }
  env.parsed = parseFunction(env.str);
  let ret;
  let meta = env.options ? (_b2 = env.options.parseMeta) != null ? _b2 : env.options.meta : null;
  if (env.parsed) {
    let name = env.parsed.name;
    let format;
    let space;
    let coords = env.parsed.args;
    let types = coords.map((c4, i2) => {
      var _a3;
      return (_a3 = env.parsed.argMeta[i2]) == null ? void 0 : _a3.type;
    });
    if (name === "color") {
      let id = coords.shift();
      types.shift();
      let alternateId = id.startsWith("--") ? id.substring(2) : `--${id}`;
      let ids = [id, alternateId];
      format = ColorSpace.findFormat({ name, id: ids, type: "function" });
      if (!format) {
        let didYouMean;
        let registryId = id in ColorSpace.registry ? id : alternateId;
        if (registryId in ColorSpace.registry) {
          let cssId = (_d2 = (_c2 = ColorSpace.registry[registryId].formats) == null ? void 0 : _c2.color) == null ? void 0 : _d2.id;
          if (cssId) {
            let altColor = str.replace("color(" + id, "color(" + cssId);
            didYouMean = `Did you mean ${altColor}?`;
          }
        }
        throw new TypeError(
          `Cannot parse ${env.str}. ` + (didYouMean != null ? didYouMean : "Missing a plugin?")
        );
      }
      space = format.space;
      if (format.id.startsWith("--") && !id.startsWith("--")) {
        defaults.warn(
          `${space.name} is a non-standard space and not currently supported in the CSS spec. Use prefixed color(${format.id}) instead of color(${id}).`
        );
      }
      if (id.startsWith("--") && !format.id.startsWith("--")) {
        defaults.warn(
          `${space.name} is a standard space and supported in the CSS spec. Use color(${format.id}) instead of prefixed color(${id}).`
        );
      }
    } else {
      format = ColorSpace.findFormat({ name, type: "function" });
      space = format.space;
    }
    if (meta) {
      Object.assign(meta, {
        format,
        formatId: format.name,
        types,
        commas: env.parsed.commas
      });
    }
    let alpha = 1;
    if (env.parsed.lastAlpha) {
      alpha = env.parsed.args.pop();
      if (meta) {
        meta.alphaType = types.pop();
      }
    }
    let coordCount = format.coords.length;
    if (coords.length !== coordCount) {
      throw new TypeError(
        `Expected ${coordCount} coordinates for ${space.id} in ${env.str}), got ${coords.length}`
      );
    }
    coords = format.coerceCoords(coords, types);
    ret = { spaceId: space.id, coords, alpha };
  } else {
    spaceloop: for (let space of ColorSpace.all) {
      for (let formatId in space.formats) {
        let format = space.formats[formatId];
        if (format.type !== "custom") {
          continue;
        }
        if (format.test && !format.test(env.str)) {
          continue;
        }
        let formatObject = space.getFormat(format);
        let color = formatObject.parse(env.str);
        if (color) {
          if (meta) {
            Object.assign(meta, { format: formatObject, formatId });
          }
          ret = color;
          break spaceloop;
        }
      }
    }
  }
  if (!ret) {
    throw new TypeError(`Could not parse ${str} as a color. Missing a plugin?`);
  }
  ret.alpha = isNone(ret.alpha) ? ret.alpha : ret.alpha === void 0 ? 1 : clamp(0, ret.alpha, 1);
  return ret;
}
const units = {
  "%": 0.01,
  deg: 1,
  grad: 0.9,
  rad: 180 / Math.PI,
  turn: 360
};
const regex = {
  // Need to list calc(NaN) explicitly as otherwise its ending paren would terminate the function call
  function: /^([a-z]+)\(((?:calc\(NaN\)|.)+?)\)$/i,
  number: /^([-+]?(?:[0-9]*\.)?[0-9]+(e[-+]?[0-9]+)?)$/i,
  unitValue: RegExp(`(${Object.keys(units).join("|")})$`),
  // NOTE The -+ are not just for prefix, but also for idents, and e+N notation!
  singleArgument: /\/?\s*(none|NaN|calc\(NaN\)|[-+\w.]+(?:%|deg|g?rad|turn)?)/g
};
function parseArgument(rawArg) {
  var _a2;
  let meta = {};
  let unit = (_a2 = rawArg.match(regex.unitValue)) == null ? void 0 : _a2[0];
  let value = meta.raw = rawArg;
  if (unit) {
    meta.type = unit === "%" ? "<percentage>" : "<angle>";
    meta.unit = unit;
    meta.unitless = Number(value.slice(0, -unit.length));
    value = meta.unitless * units[unit];
  } else if (regex.number.test(value)) {
    value = Number(value);
    meta.type = "<number>";
  } else if (value === "none") {
    value = null;
  } else if (value === "NaN" || value === "calc(NaN)") {
    value = NaN;
    meta.type = "<number>";
  } else {
    meta.type = "<ident>";
  }
  return { value: (
    /** @type {number} */
    value
  ), meta: (
    /** @type {ArgumentMeta} */
    meta
  ) };
}
function parseFunction(str) {
  if (!str) {
    return;
  }
  str = str.trim();
  let parts = str.match(regex.function);
  if (parts) {
    let args = [];
    let argMeta = [];
    let lastAlpha = false;
    let name = parts[1].toLowerCase();
    let separators = parts[2].replace(regex.singleArgument, ($0, rawArg) => {
      let { value, meta } = parseArgument(rawArg);
      if (
        // If there's a slash here, it's modern syntax
        $0.startsWith("/") || // If there's still elements to process after there's already 3 in `args` (and the we're not dealing with "color()"), it's likely to be a legacy color like "hsl(0, 0%, 0%, 0.5)"
        name !== "color" && args.length === 3
      ) {
        lastAlpha = true;
      }
      args.push(value);
      argMeta.push(meta);
      return "";
    });
    return {
      name,
      args,
      argMeta,
      lastAlpha,
      commas: separators.includes(","),
      rawName: parts[1],
      rawArgs: parts[2]
    };
  }
}
function getColor(color, options) {
  if (Array.isArray(color)) {
    return color.map((c4) => getColor(c4, options));
  }
  if (!color) {
    throw new TypeError("Empty color reference");
  }
  if (isString(color)) {
    color = parse(color, options);
  }
  let space = color.space || color.spaceId;
  if (typeof space === "string") {
    color.space = ColorSpace.get(space);
  }
  if (color.alpha === void 0) {
    color.alpha = 1;
  }
  return color;
}
const ε$4 = 75e-6;
const _ColorSpace = class _ColorSpace {
  constructor(options) {
    var _a2, _b2, _c2, _d2, _e2, _f;
    this.id = options.id;
    this.name = options.name;
    this.base = options.base ? _ColorSpace.get(options.base) : null;
    this.aliases = options.aliases;
    if (this.base) {
      this.fromBase = options.fromBase;
      this.toBase = options.toBase;
    }
    let coords = (_a2 = options.coords) != null ? _a2 : this.base.coords;
    for (let name in coords) {
      if (!("name" in coords[name])) {
        coords[name].name = name;
      }
    }
    this.coords = coords;
    let white2 = (_c2 = (_b2 = options.white) != null ? _b2 : this.base.white) != null ? _c2 : "D65";
    this.white = getWhite(white2);
    this.formats = (_d2 = options.formats) != null ? _d2 : {};
    for (let name in this.formats) {
      let format = this.formats[name];
      format.type || (format.type = "function");
      format.name || (format.name = name);
    }
    if (!((_e2 = this.formats.color) == null ? void 0 : _e2.id)) {
      this.formats.color = {
        ...(_f = this.formats.color) != null ? _f : {},
        id: options.cssId || this.id
      };
    }
    if (options.gamutSpace) {
      this.gamutSpace = options.gamutSpace === "self" ? this : _ColorSpace.get(options.gamutSpace);
    } else {
      if (this.isPolar) {
        this.gamutSpace = this.base;
      } else {
        this.gamutSpace = this;
      }
    }
    if (this.gamutSpace.isUnbounded) {
      this.inGamut = (coords2, options2) => {
        return true;
      };
    }
    this.referred = options.referred;
    Object.defineProperty(this, "path", {
      value: getPath(this).reverse(),
      writable: false,
      enumerable: true,
      configurable: true
    });
    hooks.run("colorspace-init-end", this);
  }
  inGamut(coords, { epsilon = ε$4 } = {}) {
    if (!this.equals(this.gamutSpace)) {
      coords = this.to(this.gamutSpace, coords);
      return this.gamutSpace.inGamut(coords, { epsilon });
    }
    let coordMeta = Object.values(this.coords);
    return coords.every((c4, i2) => {
      let meta = coordMeta[i2];
      if (meta.type !== "angle" && meta.range) {
        if (isNone(c4)) {
          return true;
        }
        let [min, max2] = meta.range;
        return (min === void 0 || c4 >= min - epsilon) && (max2 === void 0 || c4 <= max2 + epsilon);
      }
      return true;
    });
  }
  get isUnbounded() {
    return Object.values(this.coords).every((coord) => !("range" in coord));
  }
  get cssId() {
    var _a2, _b2;
    return ((_b2 = (_a2 = this.formats) == null ? void 0 : _a2.color) == null ? void 0 : _b2.id) || this.id;
  }
  get isPolar() {
    for (let id in this.coords) {
      if (this.coords[id].type === "angle") {
        return true;
      }
    }
    return false;
  }
  /**
   * Lookup a format in this color space
   * @param {string | object | Format} format - Format id if string. If object, it's converted to a `Format` object and returned.
   * @returns {Format}
   */
  getFormat(format) {
    if (!format) {
      return null;
    }
    if (format === "default") {
      format = Object.values(this.formats)[0];
    } else if (typeof format === "string") {
      format = this.formats[format];
    }
    let ret = Format.get(format, this);
    if (ret !== format && format.name in this.formats) {
      this.formats[format.name] = ret;
    }
    return ret;
  }
  /**
   * Check if this color space is the same as another color space reference.
   * Allows proxying color space objects and comparing color spaces with ids.
   * @param {string | ColorSpace} space ColorSpace object or id to compare to
   * @returns {boolean}
   */
  equals(space) {
    if (!space) {
      return false;
    }
    return this === space || this.id === space || this.id === space.id;
  }
  to(space, coords) {
    if (arguments.length === 1) {
      const color = getColor(space);
      [space, coords] = [color.space, color.coords];
    }
    space = _ColorSpace.get(space);
    if (this.equals(space)) {
      return coords;
    }
    coords = coords.map((c4) => isNone(c4) ? 0 : c4);
    let myPath = this.path;
    let otherPath = space.path;
    let connectionSpace, connectionSpaceIndex;
    for (let i2 = 0; i2 < myPath.length; i2++) {
      if (myPath[i2].equals(otherPath[i2])) {
        connectionSpace = myPath[i2];
        connectionSpaceIndex = i2;
      } else {
        break;
      }
    }
    if (!connectionSpace) {
      throw new Error(
        `Cannot convert between color spaces ${this} and ${space}: no connection space was found`
      );
    }
    for (let i2 = myPath.length - 1; i2 > connectionSpaceIndex; i2--) {
      coords = myPath[i2].toBase(coords);
    }
    for (let i2 = connectionSpaceIndex + 1; i2 < otherPath.length; i2++) {
      coords = otherPath[i2].fromBase(coords);
    }
    return coords;
  }
  from(space, coords) {
    if (arguments.length === 1) {
      const color = getColor(space);
      [space, coords] = [color.space, color.coords];
    }
    space = _ColorSpace.get(space);
    return space.to(this, coords);
  }
  toString() {
    return `${this.name} (${this.id})`;
  }
  getMinCoords() {
    var _a2;
    let ret = [];
    for (let id in this.coords) {
      let meta = this.coords[id];
      let range = meta.range || meta.refRange;
      ret.push((_a2 = range == null ? void 0 : range.min) != null ? _a2 : 0);
    }
    return ret;
  }
  // Returns array of unique color spaces
  static get all() {
    return [...new Set(Object.values(_ColorSpace.registry))];
  }
  static register(id, space) {
    if (arguments.length === 1) {
      space = arguments[0];
      id = space.id;
    }
    space = this.get(space);
    if (this.registry[id] && this.registry[id] !== space) {
      throw new Error(`Duplicate color space registration: '${id}'`);
    }
    this.registry[id] = space;
    if (arguments.length === 1 && space.aliases) {
      for (let alias of space.aliases) {
        this.register(alias, space);
      }
    }
    return space;
  }
  /**
   * Lookup ColorSpace object by name
   * @param {ColorSpace | string} name
   */
  static get(space, ...alternatives) {
    if (!space || isInstance(space, this)) {
      return space;
    }
    let argType = type(space);
    if (argType === "string") {
      let ret = _ColorSpace.registry[space.toLowerCase()];
      if (!ret) {
        throw new TypeError(`No color space found with id = "${space}"`);
      }
      return ret;
    }
    if (alternatives.length) {
      return _ColorSpace.get(...alternatives);
    }
    throw new TypeError(`${space} is not a valid color space`);
  }
  /**
   * Look up all color spaces for a format that matches certain criteria
   * @param {object | string} filters
   * @param {Array<ColorSpace>} [spaces=ColorSpace.all]
   * @returns {Format | null}
   */
  static findFormat(filters, spaces = _ColorSpace.all) {
    var _a2, _b2;
    if (!filters) {
      return null;
    }
    if (typeof filters === "string") {
      filters = { name: filters };
    }
    for (let space of spaces) {
      for (let [name, format] of Object.entries(space.formats)) {
        (_a2 = format.name) != null ? _a2 : format.name = name;
        (_b2 = format.type) != null ? _b2 : format.type = "function";
        let matches = (!filters.name || format.name === filters.name) && (!filters.type || format.type === filters.type);
        if (filters.id) {
          let ids = format.ids || [format.id];
          let filterIds = Array.isArray(filters.id) ? filters.id : [filters.id];
          matches && (matches = filterIds.some((id) => ids.includes(id)));
        }
        if (matches) {
          let ret = Format.get(format, space);
          if (ret !== format) {
            space.formats[format.name] = ret;
          }
          return ret;
        }
      }
    }
    return null;
  }
  /**
   * Get metadata about a coordinate of a color space
   *
   * @static
   * @param {Array | string} ref
   * @param {ColorSpace | string} [workingSpace]
   * @return {Object}
   */
  static resolveCoord(ref, workingSpace) {
    var _a2;
    let coordType = type(ref);
    let space, coord;
    if (coordType === "string") {
      if (ref.includes(".")) {
        [space, coord] = ref.split(".");
      } else {
        [space, coord] = [, ref];
      }
    } else if (Array.isArray(ref)) {
      [space, coord] = ref;
    } else {
      space = ref.space;
      coord = ref.coordId;
    }
    space = _ColorSpace.get(space);
    if (!space) {
      space = workingSpace;
    }
    if (!space) {
      throw new TypeError(
        `Cannot resolve coordinate reference ${ref}: No color space specified and relative references are not allowed here`
      );
    }
    coordType = type(coord);
    if (coordType === "number" || coordType === "string" && coord >= 0) {
      let meta = Object.entries(space.coords)[coord];
      if (meta) {
        return { space, id: meta[0], index: coord, ...meta[1] };
      }
    }
    space = _ColorSpace.get(space);
    let normalizedCoord = coord.toLowerCase();
    let i2 = 0;
    for (let id in space.coords) {
      let meta = space.coords[id];
      if (id.toLowerCase() === normalizedCoord || ((_a2 = meta.name) == null ? void 0 : _a2.toLowerCase()) === normalizedCoord) {
        return { space, id, index: i2, ...meta };
      }
      i2++;
    }
    throw new TypeError(
      `No "${coord}" coordinate found in ${space.name}. Its coordinates are: ${Object.keys(space.coords).join(", ")}`
    );
  }
};
__publicField(_ColorSpace, "registry", {});
__publicField(_ColorSpace, "DEFAULT_FORMAT", {
  type: "functions",
  name: "color"
});
let ColorSpace = _ColorSpace;
function getPath(space) {
  let ret = [space];
  for (let s2 = space; s2 = s2.base; ) {
    ret.push(s2);
  }
  return ret;
}
const xyz_d65 = new ColorSpace({
  id: "xyz-d65",
  name: "XYZ D65",
  coords: {
    x: {
      refRange: [0, 1],
      name: "X"
    },
    y: {
      refRange: [0, 1],
      name: "Y"
    },
    z: {
      refRange: [0, 1],
      name: "Z"
    }
  },
  white: "D65",
  formats: {
    color: {
      ids: ["xyz-d65", "xyz"]
    }
  },
  aliases: ["xyz"]
});
class RGBColorSpace extends ColorSpace {
  /**
   * Creates a new RGB ColorSpace.
   * If coords are not specified, they will use the default RGB coords.
   * Instead of `fromBase()` and `toBase()` functions,
   * you can specify to/from XYZ matrices and have `toBase()` and `fromBase()` automatically generated.
   * @param {RGBOptions} options
   */
  constructor(options) {
    var _a2, _b2, _c2;
    if (!options.coords) {
      options.coords = {
        r: {
          range: [0, 1],
          name: "Red"
        },
        g: {
          range: [0, 1],
          name: "Green"
        },
        b: {
          range: [0, 1],
          name: "Blue"
        }
      };
    }
    if (!options.base) {
      options.base = xyz_d65;
    }
    if (options.toXYZ_M && options.fromXYZ_M) {
      (_a2 = options.toBase) != null ? _a2 : options.toBase = (rgb) => {
        let xyz = multiply_v3_m3x3(rgb, options.toXYZ_M);
        if (this.white !== this.base.white) {
          xyz = adapt$1(this.white, this.base.white, xyz);
        }
        return xyz;
      };
      (_b2 = options.fromBase) != null ? _b2 : options.fromBase = (xyz) => {
        xyz = adapt$1(this.base.white, this.white, xyz);
        return multiply_v3_m3x3(xyz, options.fromXYZ_M);
      };
    }
    (_c2 = options.referred) != null ? _c2 : options.referred = "display";
    super(options);
  }
}
function getAll(color, options) {
  color = getColor(color);
  let space = ColorSpace.get(options, options == null ? void 0 : options.space);
  let precision = options == null ? void 0 : options.precision;
  let coords;
  if (!space || color.space.equals(space)) {
    coords = color.coords.slice();
  } else {
    coords = space.from(color);
  }
  return precision === void 0 ? coords : coords.map((coord) => toPrecision(coord, precision));
}
function get(color, prop) {
  var _a2;
  color = getColor(color);
  if (prop === "alpha") {
    return (_a2 = color.alpha) != null ? _a2 : 1;
  }
  let { space, index } = ColorSpace.resolveCoord(prop, color.space);
  let coords = getAll(color, space);
  return coords[index];
}
function setAll(color, space, coords, alpha) {
  color = getColor(color);
  if (Array.isArray(space)) {
    [space, coords, alpha] = [color.space, space, coords];
  }
  space = ColorSpace.get(space);
  color.coords = space === color.space ? coords.slice() : space.to(color.space, coords);
  if (alpha !== void 0) {
    color.alpha = alpha;
  }
  return color;
}
setAll.returns = "color";
function set(color, prop, value) {
  color = getColor(color);
  if (arguments.length === 2 && type(arguments[1]) === "object") {
    let object = arguments[1];
    for (let p2 in object) {
      set(color, p2, object[p2]);
    }
  } else {
    if (typeof value === "function") {
      value = value(get(color, prop));
    }
    if (prop === "alpha") {
      color.alpha = value;
    } else {
      let { space, index } = ColorSpace.resolveCoord(prop, color.space);
      let coords = getAll(color, space);
      coords[index] = value;
      setAll(color, space, coords);
    }
  }
  return color;
}
set.returns = "color";
const XYZ_D50 = new ColorSpace({
  id: "xyz-d50",
  name: "XYZ D50",
  white: "D50",
  base: xyz_d65,
  fromBase: (coords) => adapt$1(xyz_d65.white, "D50", coords),
  toBase: (coords) => adapt$1("D50", xyz_d65.white, coords)
});
const ε$3 = 216 / 24389;
const ε3$1 = 24 / 116;
const κ$2 = 24389 / 27;
let white$3 = WHITES.D50;
const lab = new ColorSpace({
  id: "lab",
  name: "Lab",
  coords: {
    l: {
      refRange: [0, 100],
      name: "Lightness"
    },
    a: {
      refRange: [-125, 125]
    },
    b: {
      refRange: [-125, 125]
    }
  },
  // Assuming XYZ is relative to D50, convert to CIE Lab
  // from CIE standard, which now defines these as a rational fraction
  white: white$3,
  base: XYZ_D50,
  // Convert D50-adapted XYX to Lab
  // CIE 15.3:2004 section 8.2.1.1
  fromBase(XYZ) {
    let xyz = XYZ.map((value, i2) => value / white$3[i2]);
    let f2 = xyz.map((value) => value > ε$3 ? Math.cbrt(value) : (κ$2 * value + 16) / 116);
    let L = 116 * f2[1] - 16;
    let a2 = 500 * (f2[0] - f2[1]);
    let b2 = 200 * (f2[1] - f2[2]);
    return [L, a2, b2];
  },
  // Convert Lab to D50-adapted XYZ
  // Same result as CIE 15.3:2004 Appendix D although the derivation is different
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  toBase(Lab) {
    let [L, a2, b2] = Lab;
    let f2 = [];
    f2[1] = (L + 16) / 116;
    f2[0] = a2 / 500 + f2[1];
    f2[2] = f2[1] - b2 / 200;
    let xyz = [
      f2[0] > ε3$1 ? Math.pow(f2[0], 3) : (116 * f2[0] - 16) / κ$2,
      Lab[0] > 8 ? Math.pow((Lab[0] + 16) / 116, 3) : Lab[0] / κ$2,
      f2[2] > ε3$1 ? Math.pow(f2[2], 3) : (116 * f2[2] - 16) / κ$2
    ];
    return xyz.map((value, i2) => value * white$3[i2]);
  },
  formats: {
    lab: {
      coords: [
        "<percentage> | <number>",
        "<number> | <percentage>",
        "<number> | <percentage>"
      ]
    }
  }
});
function constrain(angle) {
  if (typeof angle !== "number") {
    return angle;
  }
  return (angle % 360 + 360) % 360;
}
const lch = new ColorSpace({
  id: "lch",
  name: "LCH",
  coords: {
    l: {
      refRange: [0, 100],
      name: "Lightness"
    },
    c: {
      refRange: [0, 150],
      name: "Chroma"
    },
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    }
  },
  base: lab,
  fromBase(Lab) {
    if (this.ε === void 0) {
      let range = Object.values(this.base.coords)[1].refRange;
      let extent = range[1] - range[0];
      this.ε = extent / 1e5;
    }
    let [L, a2, b2] = Lab;
    let isAchromatic = Math.abs(a2) < this.ε && Math.abs(b2) < this.ε;
    let h2 = isAchromatic ? null : constrain(Math.atan2(b2, a2) * 180 / Math.PI);
    let C = isAchromatic ? 0 : Math.sqrt(a2 ** 2 + b2 ** 2);
    return [L, C, h2];
  },
  toBase(lch2) {
    let [L, C, h2] = lch2;
    let a2 = null, b2 = null;
    if (!isNone(h2)) {
      C = C < 0 ? 0 : C;
      a2 = C * Math.cos(h2 * Math.PI / 180);
      b2 = C * Math.sin(h2 * Math.PI / 180);
    }
    return [L, a2, b2];
  },
  formats: {
    lch: {
      coords: ["<percentage> | <number>", "<number> | <percentage>", "<number> | <angle>"]
    }
  }
});
const Gfactor = 25 ** 7;
const π$1 = Math.PI;
const r2d = 180 / π$1;
const d2r$1 = π$1 / 180;
function pow7(x) {
  const x2 = x * x;
  const x7 = x2 * x2 * x2 * x;
  return x7;
}
function deltaE2000(color, sample, { kL = 1, kC = 1, kH = 1 } = {}) {
  [color, sample] = getColor([color, sample]);
  let [L1, a1, b1] = lab.from(color);
  let C1 = lch.from(lab, [L1, a1, b1])[1];
  let [L2, a2, b2] = lab.from(sample);
  let C2 = lch.from(lab, [L2, a2, b2])[1];
  if (C1 < 0) {
    C1 = 0;
  }
  if (C2 < 0) {
    C2 = 0;
  }
  let Cbar = (C1 + C2) / 2;
  let C7 = pow7(Cbar);
  let G = 0.5 * (1 - Math.sqrt(C7 / (C7 + Gfactor)));
  let adash1 = (1 + G) * a1;
  let adash2 = (1 + G) * a2;
  let Cdash1 = Math.sqrt(adash1 ** 2 + b1 ** 2);
  let Cdash2 = Math.sqrt(adash2 ** 2 + b2 ** 2);
  let h1 = adash1 === 0 && b1 === 0 ? 0 : Math.atan2(b1, adash1);
  let h2 = adash2 === 0 && b2 === 0 ? 0 : Math.atan2(b2, adash2);
  if (h1 < 0) {
    h1 += 2 * π$1;
  }
  if (h2 < 0) {
    h2 += 2 * π$1;
  }
  h1 *= r2d;
  h2 *= r2d;
  let ΔL = L2 - L1;
  let ΔC = Cdash2 - Cdash1;
  let hdiff = h2 - h1;
  let hsum = h1 + h2;
  let habs = Math.abs(hdiff);
  let Δh;
  if (Cdash1 * Cdash2 === 0) {
    Δh = 0;
  } else if (habs <= 180) {
    Δh = hdiff;
  } else if (hdiff > 180) {
    Δh = hdiff - 360;
  } else if (hdiff < -180) {
    Δh = hdiff + 360;
  } else {
    defaults.warn("the unthinkable has happened");
  }
  let ΔH = 2 * Math.sqrt(Cdash2 * Cdash1) * Math.sin(Δh * d2r$1 / 2);
  let Ldash = (L1 + L2) / 2;
  let Cdash = (Cdash1 + Cdash2) / 2;
  let Cdash7 = pow7(Cdash);
  let hdash;
  if (Cdash1 * Cdash2 === 0) {
    hdash = hsum;
  } else if (habs <= 180) {
    hdash = hsum / 2;
  } else if (hsum < 360) {
    hdash = (hsum + 360) / 2;
  } else {
    hdash = (hsum - 360) / 2;
  }
  let lsq = (Ldash - 50) ** 2;
  let SL = 1 + 0.015 * lsq / Math.sqrt(20 + lsq);
  let SC = 1 + 0.045 * Cdash;
  let T = 1;
  T -= 0.17 * Math.cos((hdash - 30) * d2r$1);
  T += 0.24 * Math.cos(2 * hdash * d2r$1);
  T += 0.32 * Math.cos((3 * hdash + 6) * d2r$1);
  T -= 0.2 * Math.cos((4 * hdash - 63) * d2r$1);
  let SH = 1 + 0.015 * Cdash * T;
  let Δθ = 30 * Math.exp(-1 * ((hdash - 275) / 25) ** 2);
  let RC = 2 * Math.sqrt(Cdash7 / (Cdash7 + Gfactor));
  let RT = -1 * Math.sin(2 * Δθ * d2r$1) * RC;
  let dE = (ΔL / (kL * SL)) ** 2;
  dE += (ΔC / (kC * SC)) ** 2;
  dE += (ΔH / (kH * SH)) ** 2;
  dE += RT * (ΔC / (kC * SC)) * (ΔH / (kH * SH));
  return Math.sqrt(dE);
}
const XYZtoLMS_M$1 = [
  [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309]
];
const LMStoXYZ_M$1 = [
  [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
  [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
  [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816]
];
const LMStoLab_M = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.42859224204858, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774]
];
const LabtoLMS_M = [
  [1, 0.3963377773761749, 0.2158037573099136],
  [1, -0.1055613458156586, -0.0638541728258133],
  [1, -0.0894841775298119, -1.2914855480194092]
];
const Oklab = new ColorSpace({
  id: "oklab",
  name: "Oklab",
  coords: {
    l: {
      refRange: [0, 1],
      name: "Lightness"
    },
    a: {
      refRange: [-0.4, 0.4]
    },
    b: {
      refRange: [-0.4, 0.4]
    }
  },
  // Note that XYZ is relative to D65
  white: "D65",
  base: xyz_d65,
  fromBase(XYZ) {
    let LMS = multiply_v3_m3x3(XYZ, XYZtoLMS_M$1);
    LMS[0] = Math.cbrt(LMS[0]);
    LMS[1] = Math.cbrt(LMS[1]);
    LMS[2] = Math.cbrt(LMS[2]);
    return multiply_v3_m3x3(LMS, LMStoLab_M, LMS);
  },
  toBase(OKLab) {
    let LMSg = multiply_v3_m3x3(OKLab, LabtoLMS_M);
    LMSg[0] = LMSg[0] ** 3;
    LMSg[1] = LMSg[1] ** 3;
    LMSg[2] = LMSg[2] ** 3;
    return multiply_v3_m3x3(LMSg, LMStoXYZ_M$1, LMSg);
  },
  formats: {
    oklab: {
      coords: [
        "<percentage> | <number>",
        "<number> | <percentage>",
        "<number> | <percentage>"
      ]
    }
  }
});
function deltaEOK(color, sample) {
  [color, sample] = getColor([color, sample]);
  let [L1, a1, b1] = Oklab.from(color);
  let [L2, a2, b2] = Oklab.from(sample);
  let ΔL = L1 - L2;
  let Δa = a1 - a2;
  let Δb = b1 - b2;
  return Math.sqrt(ΔL ** 2 + Δa ** 2 + Δb ** 2);
}
const ε$2 = 75e-6;
function inGamut(color, space, { epsilon = ε$2 } = {}) {
  color = getColor(color);
  if (!space) {
    space = color.space;
  }
  space = ColorSpace.get(space);
  let coords = color.coords;
  if (space !== color.space) {
    coords = space.from(color);
  }
  return space.inGamut(coords, { epsilon });
}
function clone(color) {
  return {
    space: color.space,
    coords: (
      /** @type {Coords} */
      color.coords.slice()
    ),
    alpha: color.alpha
  };
}
function distance(color1, color2, space = "lab") {
  space = ColorSpace.get(space);
  let coords1 = space.from(color1);
  let coords2 = space.from(color2);
  return Math.sqrt(
    coords1.reduce((acc, c12, i2) => {
      let c22 = coords2[i2];
      if (isNone(c12) || isNone(c22)) {
        return acc;
      }
      return acc + (c22 - c12) ** 2;
    }, 0)
  );
}
function deltaE76(color, sample) {
  return distance(color, sample, "lab");
}
const π = Math.PI;
const d2r = π / 180;
function deltaECMC(color, sample, { l: l2 = 2, c: c4 = 1 } = {}) {
  [color, sample] = getColor([color, sample]);
  let [L1, a1, b1] = lab.from(color);
  let [, C1, H1] = lch.from(lab, [L1, a1, b1]);
  let [L2, a2, b2] = lab.from(sample);
  let C2 = lch.from(lab, [L2, a2, b2])[1];
  if (C1 < 0) {
    C1 = 0;
  }
  if (C2 < 0) {
    C2 = 0;
  }
  let ΔL = L1 - L2;
  let ΔC = C1 - C2;
  let Δa = a1 - a2;
  let Δb = b1 - b2;
  let H2 = Δa ** 2 + Δb ** 2 - ΔC ** 2;
  let SL = 0.511;
  if (L1 >= 16) {
    SL = 0.040975 * L1 / (1 + 0.01765 * L1);
  }
  let SC = 0.0638 * C1 / (1 + 0.0131 * C1) + 0.638;
  let T;
  if (isNone(H1)) {
    H1 = 0;
  }
  if (H1 >= 164 && H1 <= 345) {
    T = 0.56 + Math.abs(0.2 * Math.cos((H1 + 168) * d2r));
  } else {
    T = 0.36 + Math.abs(0.4 * Math.cos((H1 + 35) * d2r));
  }
  let C4 = Math.pow(C1, 4);
  let F = Math.sqrt(C4 / (C4 + 1900));
  let SH = SC * (F * T + 1 - F);
  let dE = (ΔL / (l2 * SL)) ** 2;
  dE += (ΔC / (c4 * SC)) ** 2;
  dE += H2 / SH ** 2;
  return Math.sqrt(dE);
}
const Yw = 203;
const XYZ_Abs_D65 = new ColorSpace({
  // Absolute CIE XYZ, with a D65 whitepoint,
  // as used in most HDR colorspaces as a starting point.
  // SDR spaces are converted per BT.2048
  // so that diffuse, media white is 203 cd/m²
  id: "xyz-abs-d65",
  cssId: "--xyz-abs-d65",
  name: "Absolute XYZ D65",
  coords: {
    x: {
      refRange: [0, 9504.7],
      name: "Xa"
    },
    y: {
      refRange: [0, 1e4],
      name: "Ya"
    },
    z: {
      refRange: [0, 10888.3],
      name: "Za"
    }
  },
  base: xyz_d65,
  fromBase(XYZ) {
    return XYZ.map((v2) => v2 * Yw);
  },
  toBase(AbsXYZ) {
    return AbsXYZ.map((v2) => v2 / Yw);
  }
});
const b = 1.15;
const g = 0.66;
const n = 2610 / 2 ** 14;
const ninv = 2 ** 14 / 2610;
const c1$1 = 3424 / 2 ** 12;
const c2$1 = 2413 / 2 ** 7;
const c3$1 = 2392 / 2 ** 7;
const p = 1.7 * 2523 / 2 ** 5;
const pinv = 2 ** 5 / (1.7 * 2523);
const d = -0.56;
const d0 = 16295499532821565e-27;
const XYZtoCone_M = [
  [0.41478972, 0.579999, 0.014648],
  [-0.20151, 1.120649, 0.0531008],
  [-0.0166008, 0.2648, 0.6684799]
];
const ConetoXYZ_M = [
  [1.9242264357876067, -1.0047923125953657, 0.037651404030618],
  [0.35031676209499907, 0.7264811939316552, -0.06538442294808501],
  [-0.09098281098284752, -0.3127282905230739, 1.5227665613052603]
];
const ConetoIab_M = [
  [0.5, 0.5, 0],
  [3.524, -4.066708, 0.542708],
  [0.199076, 1.096799, -1.295875]
];
const IabtoCone_M = [
  [1, 0.13860504327153927, 0.05804731615611883],
  [1, -0.1386050432715393, -0.058047316156118904],
  [1, -0.09601924202631895, -0.811891896056039]
];
const Jzazbz = new ColorSpace({
  id: "jzazbz",
  name: "Jzazbz",
  coords: {
    jz: {
      refRange: [0, 1],
      name: "Jz"
    },
    az: {
      refRange: [-0.21, 0.21]
    },
    bz: {
      refRange: [-0.21, 0.21]
    }
  },
  base: XYZ_Abs_D65,
  fromBase(XYZ) {
    let [Xa, Ya, Za] = XYZ;
    let Xm = b * Xa - (b - 1) * Za;
    let Ym = g * Ya - (g - 1) * Xa;
    let LMS = multiply_v3_m3x3([Xm, Ym, Za], XYZtoCone_M);
    let PQLMS = (
      /** @type {Vector3} } */
      LMS.map(function(val) {
        let num = c1$1 + c2$1 * spow(val / 1e4, n);
        let denom = 1 + c3$1 * spow(val / 1e4, n);
        return spow(num / denom, p);
      })
    );
    let [Iz, az, bz] = multiply_v3_m3x3(PQLMS, ConetoIab_M);
    let Jz = (1 + d) * Iz / (1 + d * Iz) - d0;
    return [Jz, az, bz];
  },
  toBase(Jzazbz2) {
    let [Jz, az, bz] = Jzazbz2;
    let Iz = (Jz + d0) / (1 + d - d * (Jz + d0));
    let PQLMS = multiply_v3_m3x3([Iz, az, bz], IabtoCone_M);
    let LMS = (
      /** @type {Vector3} } */
      PQLMS.map(function(val) {
        let num = c1$1 - spow(val, pinv);
        let denom = c3$1 * spow(val, pinv) - c2$1;
        let x = 1e4 * spow(num / denom, ninv);
        return x;
      })
    );
    let [Xm, Ym, Za] = multiply_v3_m3x3(LMS, ConetoXYZ_M);
    let Xa = (Xm + (b - 1) * Za) / b;
    let Ya = (Ym + (g - 1) * Xa) / g;
    return [Xa, Ya, Za];
  },
  formats: {
    // https://drafts.csswg.org/css-color-hdr/#Jzazbz
    jzazbz: {
      coords: [
        "<percentage> | <number>",
        "<number> | <percentage>",
        "<number> | <percentage>"
      ]
    }
  }
});
const jzczhz = new ColorSpace({
  id: "jzczhz",
  name: "JzCzHz",
  coords: {
    jz: {
      refRange: [0, 1],
      name: "Jz"
    },
    cz: {
      refRange: [0, 0.26],
      name: "Chroma"
    },
    hz: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    }
  },
  base: Jzazbz,
  fromBase: lch.fromBase,
  toBase: lch.toBase,
  formats: {
    // https://drafts.csswg.org/css-color-hdr/#JzCzhz
    jzczhz: {
      coords: ["<percentage> | <number>", "<number> | <percentage>", "<number> | <angle>"]
    }
  }
});
function deltaEJz(color, sample) {
  [color, sample] = getColor([color, sample]);
  let [Jz1, Cz1, Hz1] = jzczhz.from(color);
  let [Jz2, Cz2, Hz2] = jzczhz.from(sample);
  let ΔJ = Jz1 - Jz2;
  let ΔC = Cz1 - Cz2;
  if (isNone(Hz1) && isNone(Hz2)) {
    Hz1 = 0;
    Hz2 = 0;
  } else if (isNone(Hz1)) {
    Hz1 = Hz2;
  } else if (isNone(Hz2)) {
    Hz2 = Hz1;
  }
  let Δh = Hz1 - Hz2;
  let ΔH = 2 * Math.sqrt(Cz1 * Cz2) * Math.sin(Δh / 2 * (Math.PI / 180));
  return Math.sqrt(ΔJ ** 2 + ΔC ** 2 + ΔH ** 2);
}
const c1 = 3424 / 4096;
const c2 = 2413 / 128;
const c3 = 2392 / 128;
const m1$1 = 2610 / 16384;
const m2 = 2523 / 32;
const im1 = 16384 / 2610;
const im2 = 32 / 2523;
const XYZtoLMS_M = [
  [0.3592832590121217, 0.6976051147779502, -0.035891593232029],
  [-0.1920808463704993, 1.100476797037432, 0.0753748658519118],
  [0.0070797844607479, 0.0748396662186362, 0.8433265453898765]
];
const LMStoIPT_M = [
  [2048 / 4096, 2048 / 4096, 0],
  [6610 / 4096, -13613 / 4096, 7003 / 4096],
  [17933 / 4096, -17390 / 4096, -543 / 4096]
];
const IPTtoLMS_M = [
  [0.9999999999999998, 0.0086090370379328, 0.111029625003026],
  [0.9999999999999998, -0.0086090370379328, -0.1110296250030259],
  [0.9999999999999998, 0.5600313357106791, -0.3206271749873188]
];
const LMStoXYZ_M = [
  [2.0701522183894223, -1.3263473389671563, 0.2066510476294053],
  [0.3647385209748072, 0.6805660249472273, -0.0453045459220347],
  [-0.0497472075358123, -0.0492609666966131, 1.1880659249923042]
];
const ictcp = new ColorSpace({
  id: "ictcp",
  name: "ICTCP",
  // From BT.2100-2 page 7:
  // During production, signal values are expected to exceed the
  // range E′ = [0.0 : 1.0]. This provides processing headroom and avoids
  // signal degradation during cascaded processing. Such values of E′,
  // below 0.0 or exceeding 1.0, should not be clipped during production
  // and exchange.
  // Values below 0.0 should not be clipped in reference displays (even
  // though they represent “negative” light) to allow the black level of
  // the signal (LB) to be properly set using test signals known as “PLUGE”
  coords: {
    i: {
      refRange: [0, 1],
      // Constant luminance,
      name: "I"
    },
    ct: {
      refRange: [-0.5, 0.5],
      // Full BT.2020 gamut in range [-0.5, 0.5]
      name: "CT"
    },
    cp: {
      refRange: [-0.5, 0.5],
      name: "CP"
    }
  },
  base: XYZ_Abs_D65,
  fromBase(XYZ) {
    let LMS = multiply_v3_m3x3(XYZ, XYZtoLMS_M);
    return LMStoICtCp(LMS);
  },
  toBase(ICtCp) {
    let LMS = ICtCptoLMS(ICtCp);
    return multiply_v3_m3x3(LMS, LMStoXYZ_M);
  },
  formats: {
    ictcp: {
      coords: [
        "<percentage> | <number>",
        "<number> | <percentage>",
        "<number> | <percentage>"
      ]
    }
  }
});
function LMStoICtCp(LMS) {
  let PQLMS = (
    /** @type {Vector3} */
    LMS.map(function(val) {
      let num = c1 + c2 * (val / 1e4) ** m1$1;
      let denom = 1 + c3 * (val / 1e4) ** m1$1;
      return (num / denom) ** m2;
    })
  );
  return multiply_v3_m3x3(PQLMS, LMStoIPT_M);
}
function ICtCptoLMS(ICtCp) {
  let PQLMS = multiply_v3_m3x3(ICtCp, IPTtoLMS_M);
  let LMS = (
    /** @type {Vector3} */
    PQLMS.map(function(val) {
      let num = Math.max(val ** im2 - c1, 0);
      let denom = c2 - c3 * val ** im2;
      return 1e4 * (num / denom) ** im1;
    })
  );
  return LMS;
}
function deltaEITP(color, sample) {
  [color, sample] = getColor([color, sample]);
  let [I1, T1, P1] = ictcp.from(color);
  let [I2, T2, P2] = ictcp.from(sample);
  return 720 * Math.sqrt((I1 - I2) ** 2 + 0.25 * (T1 - T2) ** 2 + (P1 - P2) ** 2);
}
function deltaEOK2(color, sample) {
  [color, sample] = getColor([color, sample]);
  let abscale = 2;
  let [L1, a1, b1] = Oklab.from(color);
  let [L2, a2, b2] = Oklab.from(sample);
  let ΔL = L1 - L2;
  let Δa = abscale * (a1 - a2);
  let Δb = abscale * (b1 - b2);
  return Math.sqrt(ΔL ** 2 + Δa ** 2 + Δb ** 2);
}
const white$2 = WHITES.D65;
const adaptedCoef = 0.42;
const adaptedCoefInv = 1 / adaptedCoef;
const tau$1 = 2 * Math.PI;
const cat16 = [
  [0.401288, 0.650173, -0.051461],
  [-0.250268, 1.204414, 0.045854],
  [-2079e-6, 0.048952, 0.953127]
];
const cat16Inv = [
  [1.8620678550872327, -1.0112546305316843, 0.14918677544445175],
  [0.38752654323613717, 0.6214474419314753, -0.008973985167612518],
  [-0.015841498849333856, -0.03412293802851557, 1.0499644368778496]
];
const m1 = [
  [460, 451, 288],
  [460, -891, -261],
  [460, -220, -6300]
];
const surroundMap = {
  dark: [0.8, 0.525, 0.8],
  dim: [0.9, 0.59, 0.9],
  average: [1, 0.69, 1]
};
const hueQuadMap = {
  // Red, Yellow, Green, Blue, Red
  h: [20.14, 90, 164.25, 237.53, 380.14],
  e: [0.8, 0.7, 1, 1.2, 0.8],
  H: [0, 100, 200, 300, 400]
};
const rad2deg = 180 / Math.PI;
const deg2rad$1 = Math.PI / 180;
function adapt(coords, fl) {
  const temp = (
    /** @type {[number, number, number]} */
    coords.map((c4) => {
      const x = spow(fl * Math.abs(c4) * 0.01, adaptedCoef);
      return 400 * copySign(x, c4) / (x + 27.13);
    })
  );
  return temp;
}
function unadapt(adapted, fl) {
  const constant = 100 / fl * 27.13 ** adaptedCoefInv;
  return (
    /** @type {[number, number, number]} */
    adapted.map((c4) => {
      const cabs = Math.abs(c4);
      return copySign(constant * spow(cabs / (400 - cabs), adaptedCoefInv), c4);
    })
  );
}
function hueQuadrature(h2) {
  let hp = constrain(h2);
  if (hp <= hueQuadMap.h[0]) {
    hp += 360;
  }
  const i2 = bisectLeft(hueQuadMap.h, hp) - 1;
  const [hi, hii] = hueQuadMap.h.slice(i2, i2 + 2);
  const [ei, eii] = hueQuadMap.e.slice(i2, i2 + 2);
  const Hi = hueQuadMap.H[i2];
  const t2 = (hp - hi) / ei;
  return Hi + 100 * t2 / (t2 + (hii - hp) / eii);
}
function invHueQuadrature(H) {
  let Hp = (H % 400 + 400) % 400;
  const i2 = Math.floor(0.01 * Hp);
  Hp = Hp % 100;
  const [hi, hii] = hueQuadMap.h.slice(i2, i2 + 2);
  const [ei, eii] = hueQuadMap.e.slice(i2, i2 + 2);
  return constrain((Hp * (eii * hi - ei * hii) - 100 * hi * eii) / (Hp * (eii - ei) - 100 * eii));
}
function environment(refWhite, adaptingLuminance, backgroundLuminance, surround, discounting) {
  const env = {};
  env.discounting = discounting;
  env.refWhite = refWhite;
  env.surround = surround;
  const xyzW = (
    /** @type {Vector3} */
    refWhite.map((c4) => {
      return c4 * 100;
    })
  );
  env.la = adaptingLuminance;
  env.yb = backgroundLuminance;
  const yw = xyzW[1];
  const rgbW = multiply_v3_m3x3(xyzW, cat16);
  let values = surroundMap[env.surround];
  const f2 = values[0];
  env.c = values[1];
  env.nc = values[2];
  const k = 1 / (5 * env.la + 1);
  const k4 = k ** 4;
  env.fl = k4 * env.la + 0.1 * (1 - k4) * (1 - k4) * Math.cbrt(5 * env.la);
  env.flRoot = env.fl ** 0.25;
  env.n = env.yb / yw;
  env.z = 1.48 + Math.sqrt(env.n);
  env.nbb = 0.725 * env.n ** -0.2;
  env.ncb = env.nbb;
  const d2 = Math.max(Math.min(f2 * (1 - 1 / 3.6 * Math.exp((-env.la - 42) / 92)), 1), 0);
  env.dRgb = /** @type {[number, number, number]} */
  rgbW.map((c4) => {
    return interpolate(1, yw / c4, d2);
  });
  env.dRgbInv = /** @type {[number, number, number]} */
  env.dRgb.map((c4) => {
    return 1 / c4;
  });
  const rgbCW = (
    /** @type {[number, number, number]} */
    rgbW.map((c4, i2) => {
      return c4 * env.dRgb[i2];
    })
  );
  const rgbAW = adapt(rgbCW, env.fl);
  env.aW = env.nbb * (2 * rgbAW[0] + rgbAW[1] + 0.05 * rgbAW[2]);
  return env;
}
const viewingConditions$1 = environment(white$2, 64 / Math.PI * 0.2, 20, "average", false);
function fromCam16(cam16, env) {
  if (!(cam16.J !== void 0 ^ cam16.Q !== void 0)) {
    throw new Error("Conversion requires one and only one: 'J' or 'Q'");
  }
  if (!(cam16.C !== void 0 ^ cam16.M !== void 0 ^ cam16.s !== void 0)) {
    throw new Error("Conversion requires one and only one: 'C', 'M' or 's'");
  }
  if (!(cam16.h !== void 0 ^ cam16.H !== void 0)) {
    throw new Error("Conversion requires one and only one: 'h' or 'H'");
  }
  if (cam16.J === 0 || cam16.Q === 0) {
    return [0, 0, 0];
  }
  let hRad = 0;
  if (cam16.h !== void 0) {
    hRad = constrain(cam16.h) * deg2rad$1;
  } else {
    hRad = invHueQuadrature(cam16.H) * deg2rad$1;
  }
  const cosh = Math.cos(hRad);
  const sinh = Math.sin(hRad);
  let Jroot = 0;
  if (cam16.J !== void 0) {
    Jroot = spow(cam16.J, 1 / 2) * 0.1;
  } else if (cam16.Q !== void 0) {
    Jroot = 0.25 * env.c * cam16.Q / ((env.aW + 4) * env.flRoot);
  }
  let alpha = 0;
  if (cam16.C !== void 0) {
    alpha = cam16.C / Jroot;
  } else if (cam16.M !== void 0) {
    alpha = cam16.M / env.flRoot / Jroot;
  } else if (cam16.s !== void 0) {
    alpha = 4e-4 * cam16.s ** 2 * (env.aW + 4) / env.c;
  }
  const t2 = spow(alpha * Math.pow(1.64 - Math.pow(0.29, env.n), -0.73), 10 / 9);
  const et = 0.25 * (Math.cos(hRad + 2) + 3.8);
  const A = env.aW * spow(Jroot, 2 / env.c / env.z);
  const p1 = 5e4 / 13 * env.nc * env.ncb * et;
  const p2 = A / env.nbb;
  const r = 23 * (p2 + 0.305) * zdiv(t2, 23 * p1 + t2 * (11 * cosh + 108 * sinh));
  const a2 = r * cosh;
  const b2 = r * sinh;
  const rgb_c = unadapt(
    /** @type {Vector3} */
    multiply_v3_m3x3([p2, a2, b2], m1).map((c4) => {
      return c4 * 1 / 1403;
    }),
    env.fl
  );
  return (
    /** @type {Vector3} */
    multiply_v3_m3x3(
      /** @type {Vector3} */
      rgb_c.map((c4, i2) => {
        return c4 * env.dRgbInv[i2];
      }),
      cat16Inv
    ).map((c4) => {
      return c4 / 100;
    })
  );
}
function toCam16(xyzd65, env) {
  const xyz100 = (
    /** @type {Vector3} */
    xyzd65.map((c4) => {
      return c4 * 100;
    })
  );
  const rgbA = adapt(
    /** @type {[number, number, number]} */
    multiply_v3_m3x3(xyz100, cat16).map((c4, i2) => {
      return c4 * env.dRgb[i2];
    }),
    env.fl
  );
  const a2 = rgbA[0] + (-12 * rgbA[1] + rgbA[2]) / 11;
  const b2 = (rgbA[0] + rgbA[1] - 2 * rgbA[2]) / 9;
  const hRad = (Math.atan2(b2, a2) % tau$1 + tau$1) % tau$1;
  const et = 0.25 * (Math.cos(hRad + 2) + 3.8);
  const t2 = 5e4 / 13 * env.nc * env.ncb * zdiv(et * Math.sqrt(a2 ** 2 + b2 ** 2), rgbA[0] + rgbA[1] + 1.05 * rgbA[2] + 0.305);
  const alpha = spow(t2, 0.9) * Math.pow(1.64 - Math.pow(0.29, env.n), 0.73);
  const A = env.nbb * (2 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]);
  const Jroot = spow(A / env.aW, 0.5 * env.c * env.z);
  const J = 100 * spow(Jroot, 2);
  const Q = 4 / env.c * Jroot * (env.aW + 4) * env.flRoot;
  const C = alpha * Jroot;
  const M = C * env.flRoot;
  const h2 = constrain(hRad * rad2deg);
  const H = hueQuadrature(h2);
  const s2 = 50 * spow(env.c * alpha / (env.aW + 4), 1 / 2);
  return { J, C, h: h2, s: s2, Q, M, H };
}
new ColorSpace({
  id: "cam16-jmh",
  cssId: "--cam16-jmh",
  name: "CAM16-JMh",
  coords: {
    j: {
      refRange: [0, 100],
      name: "J"
    },
    m: {
      refRange: [0, 105],
      name: "Colorfulness"
    },
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    }
  },
  base: xyz_d65,
  fromBase(xyz) {
    if (this.ε === void 0) {
      this.ε = Object.values(this.coords)[1].refRange[1] / 1e5;
    }
    const cam16 = toCam16(xyz, viewingConditions$1);
    const isAchromatic = Math.abs(cam16.M) < this.ε;
    return [cam16.J, isAchromatic ? 0 : cam16.M, isAchromatic ? null : cam16.h];
  },
  toBase(cam16) {
    return fromCam16({ J: cam16[0], M: cam16[1], h: cam16[2] }, viewingConditions$1);
  }
});
const white$1 = WHITES.D65;
const ε$1 = 216 / 24389;
const κ$1 = 24389 / 27;
function toLstar(y2) {
  const fy = y2 > ε$1 ? Math.cbrt(y2) : (κ$1 * y2 + 16) / 116;
  return 116 * fy - 16;
}
function fromLstar(lstar) {
  return lstar > 8 ? Math.pow((lstar + 16) / 116, 3) : lstar / κ$1;
}
function fromHct(coords, env) {
  let [h2, c4, t2] = coords;
  let xyz = [];
  let j = 0;
  if (t2 === 0) {
    return [0, 0, 0];
  }
  let y2 = fromLstar(t2);
  if (t2 > 0) {
    j = 0.00379058511492914 * t2 ** 2 + 0.608983189401032 * t2 + 0.9155088574762233;
  } else {
    j = 9514440756550361e-21 * t2 ** 2 + 0.08693057439788597 * t2 - 21.928975842194614;
  }
  const threshold = 2e-12;
  const max_attempts = 15;
  let attempt = 0;
  let last = Infinity;
  while (attempt <= max_attempts) {
    xyz = fromCam16({ J: j, C: c4, h: h2 }, env);
    const delta = Math.abs(xyz[1] - y2);
    if (delta < last) {
      if (delta <= threshold) {
        return xyz;
      }
      last = delta;
    }
    j = j - (xyz[1] - y2) * j / (2 * xyz[1]);
    attempt += 1;
  }
  return fromCam16({ J: j, C: c4, h: h2 }, env);
}
function toHct(xyz, env) {
  const t2 = toLstar(xyz[1]);
  if (t2 === 0) {
    return [0, 0, 0];
  }
  const cam16 = toCam16(xyz, viewingConditions);
  return [constrain(cam16.h), cam16.C, t2];
}
const viewingConditions = environment(
  white$1,
  200 / Math.PI * fromLstar(50),
  fromLstar(50) * 100,
  "average",
  false
);
const hct = new ColorSpace({
  id: "hct",
  name: "HCT",
  coords: {
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    },
    c: {
      refRange: [0, 145],
      name: "Colorfulness"
    },
    t: {
      refRange: [0, 100],
      name: "Tone"
    }
  },
  base: xyz_d65,
  fromBase(xyz) {
    if (this.ε === void 0) {
      this.ε = Object.values(this.coords)[1].refRange[1] / 1e5;
    }
    let hct2 = toHct(xyz);
    if (hct2[1] < this.ε) {
      hct2[1] = 0;
      hct2[0] = null;
    }
    return hct2;
  },
  toBase(hct2) {
    return fromHct(hct2, viewingConditions);
  },
  formats: {
    color: {
      id: "--hct",
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
const deg2rad = Math.PI / 180;
const ucsCoeff = [1, 7e-3, 0.0228];
function convertUcsAb(coords) {
  if (coords[1] < 0) {
    coords = hct.fromBase(hct.toBase(coords));
  }
  const M = Math.log(Math.max(1 + ucsCoeff[2] * coords[1] * viewingConditions.flRoot, 1)) / ucsCoeff[2];
  const hrad = coords[0] * deg2rad;
  const a2 = M * Math.cos(hrad);
  const b2 = M * Math.sin(hrad);
  return [coords[2], a2, b2];
}
function deltaEHCT(color, sample) {
  [color, sample] = getColor([color, sample]);
  let [t1, a1, b1] = convertUcsAb(hct.from(color));
  let [t2, a2, b2] = convertUcsAb(hct.from(sample));
  return Math.sqrt((t1 - t2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}
const deltaEMethods = {
  deltaE76,
  deltaECMC,
  deltaE2000,
  deltaEJz,
  deltaEITP,
  deltaEOK,
  deltaEOK2,
  deltaEHCT
};
function calcEpsilon(jnd) {
  const order = !jnd ? 0 : Math.floor(Math.log10(Math.abs(jnd)));
  return Math.max(parseFloat(`1e${order - 2}`), 1e-6);
}
const GMAPPRESET = {
  hct: {
    method: "hct.c",
    jnd: 2,
    deltaEMethod: "hct",
    blackWhiteClamp: {}
  },
  "hct-tonal": {
    method: "hct.c",
    jnd: 0,
    deltaEMethod: "hct",
    blackWhiteClamp: { channel: "hct.t", min: 0, max: 100 }
  }
};
function toGamut(color, {
  method = defaults.gamut_mapping,
  space = void 0,
  deltaEMethod = "",
  jnd = 2,
  blackWhiteClamp = void 0
} = {}) {
  color = getColor(color);
  if (isString(arguments[1])) {
    space = arguments[1];
  } else if (!space) {
    space = color.space;
  }
  space = ColorSpace.get(space);
  if (inGamut(color, space, { epsilon: 0 })) {
    return (
      /** @type {PlainColorObject} */
      color
    );
  }
  let spaceColor;
  if (method === "css") {
    spaceColor = toGamutCSS(color, { space });
  } else {
    if (method !== "clip" && !inGamut(color, space)) {
      if (Object.prototype.hasOwnProperty.call(GMAPPRESET, method)) {
        ({ method, jnd, deltaEMethod, blackWhiteClamp } = GMAPPRESET[method]);
      }
      let de = deltaE2000;
      if (deltaEMethod !== "") {
        for (let m in deltaEMethods) {
          if ("deltae" + deltaEMethod.toLowerCase() === m.toLowerCase()) {
            de = deltaEMethods[m];
            break;
          }
        }
      }
      if (jnd === 0) {
        jnd = 1e-16;
      }
      let clipped = toGamut(to(color, space), { method: "clip", space });
      if (de(color, clipped) > jnd) {
        if (blackWhiteClamp && Object.keys(blackWhiteClamp).length === 3) {
          let channelMeta = ColorSpace.resolveCoord(blackWhiteClamp.channel);
          let channel = get(to(color, channelMeta.space), channelMeta.id);
          if (isNone(channel)) {
            channel = 0;
          }
          if (channel >= blackWhiteClamp.max) {
            return to({ space: "xyz-d65", coords: WHITES["D65"] }, color.space);
          } else if (channel <= blackWhiteClamp.min) {
            return to({ space: "xyz-d65", coords: [0, 0, 0] }, color.space);
          }
        }
        let coordMeta = ColorSpace.resolveCoord(method);
        let mapSpace = coordMeta.space;
        let coordId = coordMeta.id;
        let mappedColor = to(color, mapSpace);
        mappedColor.coords.forEach((c4, i2) => {
          if (isNone(c4)) {
            mappedColor.coords[i2] = 0;
          }
        });
        let bounds = coordMeta.range || coordMeta.refRange;
        let min = bounds[0];
        let ε2 = calcEpsilon(jnd);
        let low = min;
        let high = get(mappedColor, coordId);
        while (high - low > ε2) {
          let clipped2 = clone(mappedColor);
          clipped2 = toGamut(clipped2, { space, method: "clip" });
          let deltaE = de(mappedColor, clipped2);
          if (deltaE - jnd < ε2) {
            low = get(mappedColor, coordId);
          } else {
            high = get(mappedColor, coordId);
          }
          set(mappedColor, coordId, (low + high) / 2);
        }
        spaceColor = to(mappedColor, space);
      } else {
        spaceColor = clipped;
      }
    } else {
      spaceColor = to(color, space);
    }
    if (method === "clip" || // Dumb coord clipping
    // finish off smarter gamut mapping with clip to get rid of ε, see #17
    !inGamut(spaceColor, space, { epsilon: 0 })) {
      let bounds = Object.values(space.coords).map((c4) => c4.range || []);
      spaceColor.coords = /** @type {[number, number, number]} */
      spaceColor.coords.map((c4, i2) => {
        let [min, max2] = bounds[i2];
        if (min !== void 0) {
          c4 = Math.max(min, c4);
        }
        if (max2 !== void 0) {
          c4 = Math.min(c4, max2);
        }
        return c4;
      });
    }
  }
  if (space !== color.space) {
    spaceColor = to(spaceColor, color.space);
  }
  color.coords = spaceColor.coords;
  return (
    /** @type {PlainColorObject} */
    color
  );
}
toGamut.returns = "color";
const COLORS = {
  WHITE: { space: Oklab, coords: [1, 0, 0], alpha: 1 },
  BLACK: { space: Oklab, coords: [0, 0, 0], alpha: 1 }
};
function toGamutCSS(origin, { space } = {}) {
  const JND = 0.02;
  const ε2 = 1e-4;
  origin = getColor(origin);
  if (!space) {
    space = origin.space;
  }
  space = ColorSpace.get(space);
  const oklchSpace = ColorSpace.get("oklch");
  if (space.isUnbounded) {
    return to(origin, space);
  }
  const origin_OKLCH = to(origin, oklchSpace);
  let L = origin_OKLCH.coords[0];
  if (L >= 1) {
    const white2 = to(COLORS.WHITE, space);
    white2.alpha = origin.alpha;
    return to(white2, space);
  }
  if (L <= 0) {
    const black = to(COLORS.BLACK, space);
    black.alpha = origin.alpha;
    return to(black, space);
  }
  if (inGamut(origin_OKLCH, space, { epsilon: 0 })) {
    return to(origin_OKLCH, space);
  }
  function clip(_color2) {
    const destColor = to(_color2, space);
    const spaceCoords = Object.values(
      /** @type {ColorSpace} */
      space.coords
    );
    destColor.coords = /** @type {[number, number, number]} */
    destColor.coords.map((coord, index) => {
      if ("range" in spaceCoords[index]) {
        const [min2, max3] = spaceCoords[index].range;
        return clamp(min2, coord, max3);
      }
      return coord;
    });
    return destColor;
  }
  let min = 0;
  let max2 = origin_OKLCH.coords[1];
  let min_inGamut = true;
  let current = clone(origin_OKLCH);
  let clipped = clip(current);
  let E2 = deltaEOK(clipped, current);
  if (E2 < JND) {
    return clipped;
  }
  while (max2 - min > ε2) {
    const chroma = (min + max2) / 2;
    current.coords[1] = chroma;
    if (min_inGamut && inGamut(current, space, { epsilon: 0 })) {
      min = chroma;
    } else {
      clipped = clip(current);
      E2 = deltaEOK(clipped, current);
      if (E2 < JND) {
        if (JND - E2 < ε2) {
          break;
        } else {
          min_inGamut = false;
          min = chroma;
        }
      } else {
        max2 = chroma;
      }
    }
  }
  return clipped;
}
function to(color, space, { inGamut: inGamut2 } = {}) {
  color = getColor(color);
  space = ColorSpace.get(space);
  let coords = space.from(color);
  let ret = { space, coords, alpha: color.alpha };
  if (inGamut2) {
    ret = toGamut(ret, inGamut2 === true ? void 0 : inGamut2);
  }
  return ret;
}
to.returns = "color";
function serialize(color, options = {}) {
  var _a2, _b2, _c2, _d2;
  let {
    precision = defaults.precision,
    format,
    inGamut: inGamut$1 = true,
    coords: coordFormat,
    alpha: alphaFormat,
    commas
  } = options;
  let ret;
  let colorWithMeta = (
    /** @type {PlainColorObject & ParseOptions} */
    getColor(color)
  );
  let formatId = format;
  let parseMeta = colorWithMeta.parseMeta;
  if (parseMeta && !format) {
    if (parseMeta.format.canSerialize()) {
      format = parseMeta.format;
      formatId = parseMeta.formatId;
    }
    coordFormat != null ? coordFormat : coordFormat = parseMeta.types;
    alphaFormat != null ? alphaFormat : alphaFormat = parseMeta.alphaType;
    commas != null ? commas : commas = parseMeta.commas;
  }
  if (formatId) {
    format = (_a2 = colorWithMeta.space.getFormat(format)) != null ? _a2 : ColorSpace.findFormat(formatId);
  }
  if (!format) {
    format = (_b2 = colorWithMeta.space.getFormat("default")) != null ? _b2 : ColorSpace.DEFAULT_FORMAT;
    formatId = format.name;
  }
  if (format && format.space && format.space !== colorWithMeta.space) {
    colorWithMeta = to(colorWithMeta, format.space);
  }
  let coords = colorWithMeta.coords.slice();
  inGamut$1 || (inGamut$1 = format.toGamut);
  if (inGamut$1 && !inGamut(colorWithMeta)) {
    coords = toGamut(clone(colorWithMeta), inGamut$1 === true ? void 0 : inGamut$1).coords;
  }
  if (format.type === "custom") {
    if (format.serialize) {
      ret = format.serialize(coords, colorWithMeta.alpha, options);
    } else {
      throw new TypeError(
        `format ${formatId} can only be used to parse colors, not for serialization`
      );
    }
  } else {
    let name = format.name || "color";
    let args = format.serializeCoords(coords, precision, coordFormat);
    if (name === "color") {
      let cssId = format.id || ((_c2 = format.ids) == null ? void 0 : _c2[0]) || colorWithMeta.space.cssId || colorWithMeta.space.id;
      args.unshift(cssId);
    }
    let alpha = colorWithMeta.alpha;
    if (alphaFormat !== void 0 && !(typeof alphaFormat === "object")) {
      alphaFormat = typeof alphaFormat === "string" ? { type: alphaFormat } : { include: alphaFormat };
    }
    let alphaType = (_d2 = alphaFormat == null ? void 0 : alphaFormat.type) != null ? _d2 : "<number>";
    let serializeAlpha = (alphaFormat == null ? void 0 : alphaFormat.include) === true || format.alpha === true || (alphaFormat == null ? void 0 : alphaFormat.include) !== false && format.alpha !== false && alpha < 1;
    let strAlpha = "";
    commas != null ? commas : commas = format.commas;
    if (serializeAlpha) {
      if (precision !== null) {
        let unit;
        if (alphaType === "<percentage>") {
          unit = "%";
          alpha *= 100;
        }
        alpha = serializeNumber(alpha, { precision, unit });
      }
      strAlpha = `${commas ? "," : " /"} ${alpha}`;
    }
    ret = `${name}(${args.join(commas ? ", " : " ")}${strAlpha})`;
  }
  return ret;
}
const toXYZ_M$4 = [
  [0.6369580483012914, 0.14461690358620832, 0.1688809751641721],
  [0.2627002120112671, 0.6779980715188708, 0.05930171646986196],
  [0, 0.028072693049087428, 1.060985057710791]
];
const fromXYZ_M$4 = [
  [1.716651187971268, -0.355670783776392, -0.25336628137366],
  [-0.666684351832489, 1.616481236634939, 0.0157685458139111],
  [0.017639857445311, -0.042770613257809, 0.942103121235474]
];
const REC_2020_Linear = new RGBColorSpace({
  id: "rec2020-linear",
  cssId: "--rec2020-linear",
  name: "Linear REC.2020",
  white: "D65",
  toXYZ_M: toXYZ_M$4,
  fromXYZ_M: fromXYZ_M$4
});
const REC2020 = new RGBColorSpace({
  id: "rec2020",
  name: "REC.2020",
  base: REC_2020_Linear,
  //  Reference electro-optical transfer function from Rec. ITU-R BT.1886 Annex 1
  //  with b (black lift) = 0 and a (user gain) = 1
  //  defined over the extended range, not clamped
  toBase(RGB) {
    return RGB.map(function(val) {
      let sign = val < 0 ? -1 : 1;
      let abs = val * sign;
      return sign * Math.pow(abs, 2.4);
    });
  },
  fromBase(RGB) {
    return RGB.map(function(val) {
      let sign = val < 0 ? -1 : 1;
      let abs = val * sign;
      return sign * Math.pow(abs, 1 / 2.4);
    });
  }
});
const toXYZ_M$3 = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0, 0.04511338185890264, 1.043944368900976]
];
const fromXYZ_M$3 = [
  [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
  [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
  [0.03584583024378447, -0.07617238926804182, 0.9568845240076872]
];
const P3Linear = new RGBColorSpace({
  id: "p3-linear",
  cssId: "display-p3-linear",
  name: "Linear P3",
  white: "D65",
  toXYZ_M: toXYZ_M$3,
  fromXYZ_M: fromXYZ_M$3
});
const toXYZ_M$2 = [
  [0.41239079926595934, 0.357584339383878, 0.1804807884018343],
  [0.21263900587151027, 0.715168678767756, 0.07219231536073371],
  [0.01933081871559182, 0.11919477979462598, 0.9505321522496607]
];
const fromXYZ_M$2 = [
  [3.2409699419045226, -1.537383177570094, -0.4986107602930034],
  [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
  [0.05563007969699366, -0.20397695888897652, 1.0569715142428786]
];
const sRGBLinear = new RGBColorSpace({
  id: "srgb-linear",
  name: "Linear sRGB",
  white: "D65",
  toXYZ_M: toXYZ_M$2,
  fromXYZ_M: fromXYZ_M$2
});
const KEYWORDS = {
  aliceblue: [240 / 255, 248 / 255, 1],
  antiquewhite: [250 / 255, 235 / 255, 215 / 255],
  aqua: [0, 1, 1],
  aquamarine: [127 / 255, 1, 212 / 255],
  azure: [240 / 255, 1, 1],
  beige: [245 / 255, 245 / 255, 220 / 255],
  bisque: [1, 228 / 255, 196 / 255],
  black: [0, 0, 0],
  blanchedalmond: [1, 235 / 255, 205 / 255],
  blue: [0, 0, 1],
  blueviolet: [138 / 255, 43 / 255, 226 / 255],
  brown: [165 / 255, 42 / 255, 42 / 255],
  burlywood: [222 / 255, 184 / 255, 135 / 255],
  cadetblue: [95 / 255, 158 / 255, 160 / 255],
  chartreuse: [127 / 255, 1, 0],
  chocolate: [210 / 255, 105 / 255, 30 / 255],
  coral: [1, 127 / 255, 80 / 255],
  cornflowerblue: [100 / 255, 149 / 255, 237 / 255],
  cornsilk: [1, 248 / 255, 220 / 255],
  crimson: [220 / 255, 20 / 255, 60 / 255],
  cyan: [0, 1, 1],
  darkblue: [0, 0, 139 / 255],
  darkcyan: [0, 139 / 255, 139 / 255],
  darkgoldenrod: [184 / 255, 134 / 255, 11 / 255],
  darkgray: [169 / 255, 169 / 255, 169 / 255],
  darkgreen: [0, 100 / 255, 0],
  darkgrey: [169 / 255, 169 / 255, 169 / 255],
  darkkhaki: [189 / 255, 183 / 255, 107 / 255],
  darkmagenta: [139 / 255, 0, 139 / 255],
  darkolivegreen: [85 / 255, 107 / 255, 47 / 255],
  darkorange: [1, 140 / 255, 0],
  darkorchid: [153 / 255, 50 / 255, 204 / 255],
  darkred: [139 / 255, 0, 0],
  darksalmon: [233 / 255, 150 / 255, 122 / 255],
  darkseagreen: [143 / 255, 188 / 255, 143 / 255],
  darkslateblue: [72 / 255, 61 / 255, 139 / 255],
  darkslategray: [47 / 255, 79 / 255, 79 / 255],
  darkslategrey: [47 / 255, 79 / 255, 79 / 255],
  darkturquoise: [0, 206 / 255, 209 / 255],
  darkviolet: [148 / 255, 0, 211 / 255],
  deeppink: [1, 20 / 255, 147 / 255],
  deepskyblue: [0, 191 / 255, 1],
  dimgray: [105 / 255, 105 / 255, 105 / 255],
  dimgrey: [105 / 255, 105 / 255, 105 / 255],
  dodgerblue: [30 / 255, 144 / 255, 1],
  firebrick: [178 / 255, 34 / 255, 34 / 255],
  floralwhite: [1, 250 / 255, 240 / 255],
  forestgreen: [34 / 255, 139 / 255, 34 / 255],
  fuchsia: [1, 0, 1],
  gainsboro: [220 / 255, 220 / 255, 220 / 255],
  ghostwhite: [248 / 255, 248 / 255, 1],
  gold: [1, 215 / 255, 0],
  goldenrod: [218 / 255, 165 / 255, 32 / 255],
  gray: [128 / 255, 128 / 255, 128 / 255],
  green: [0, 128 / 255, 0],
  greenyellow: [173 / 255, 1, 47 / 255],
  grey: [128 / 255, 128 / 255, 128 / 255],
  honeydew: [240 / 255, 1, 240 / 255],
  hotpink: [1, 105 / 255, 180 / 255],
  indianred: [205 / 255, 92 / 255, 92 / 255],
  indigo: [75 / 255, 0, 130 / 255],
  ivory: [1, 1, 240 / 255],
  khaki: [240 / 255, 230 / 255, 140 / 255],
  lavender: [230 / 255, 230 / 255, 250 / 255],
  lavenderblush: [1, 240 / 255, 245 / 255],
  lawngreen: [124 / 255, 252 / 255, 0],
  lemonchiffon: [1, 250 / 255, 205 / 255],
  lightblue: [173 / 255, 216 / 255, 230 / 255],
  lightcoral: [240 / 255, 128 / 255, 128 / 255],
  lightcyan: [224 / 255, 1, 1],
  lightgoldenrodyellow: [250 / 255, 250 / 255, 210 / 255],
  lightgray: [211 / 255, 211 / 255, 211 / 255],
  lightgreen: [144 / 255, 238 / 255, 144 / 255],
  lightgrey: [211 / 255, 211 / 255, 211 / 255],
  lightpink: [1, 182 / 255, 193 / 255],
  lightsalmon: [1, 160 / 255, 122 / 255],
  lightseagreen: [32 / 255, 178 / 255, 170 / 255],
  lightskyblue: [135 / 255, 206 / 255, 250 / 255],
  lightslategray: [119 / 255, 136 / 255, 153 / 255],
  lightslategrey: [119 / 255, 136 / 255, 153 / 255],
  lightsteelblue: [176 / 255, 196 / 255, 222 / 255],
  lightyellow: [1, 1, 224 / 255],
  lime: [0, 1, 0],
  limegreen: [50 / 255, 205 / 255, 50 / 255],
  linen: [250 / 255, 240 / 255, 230 / 255],
  magenta: [1, 0, 1],
  maroon: [128 / 255, 0, 0],
  mediumaquamarine: [102 / 255, 205 / 255, 170 / 255],
  mediumblue: [0, 0, 205 / 255],
  mediumorchid: [186 / 255, 85 / 255, 211 / 255],
  mediumpurple: [147 / 255, 112 / 255, 219 / 255],
  mediumseagreen: [60 / 255, 179 / 255, 113 / 255],
  mediumslateblue: [123 / 255, 104 / 255, 238 / 255],
  mediumspringgreen: [0, 250 / 255, 154 / 255],
  mediumturquoise: [72 / 255, 209 / 255, 204 / 255],
  mediumvioletred: [199 / 255, 21 / 255, 133 / 255],
  midnightblue: [25 / 255, 25 / 255, 112 / 255],
  mintcream: [245 / 255, 1, 250 / 255],
  mistyrose: [1, 228 / 255, 225 / 255],
  moccasin: [1, 228 / 255, 181 / 255],
  navajowhite: [1, 222 / 255, 173 / 255],
  navy: [0, 0, 128 / 255],
  oldlace: [253 / 255, 245 / 255, 230 / 255],
  olive: [128 / 255, 128 / 255, 0],
  olivedrab: [107 / 255, 142 / 255, 35 / 255],
  orange: [1, 165 / 255, 0],
  orangered: [1, 69 / 255, 0],
  orchid: [218 / 255, 112 / 255, 214 / 255],
  palegoldenrod: [238 / 255, 232 / 255, 170 / 255],
  palegreen: [152 / 255, 251 / 255, 152 / 255],
  paleturquoise: [175 / 255, 238 / 255, 238 / 255],
  palevioletred: [219 / 255, 112 / 255, 147 / 255],
  papayawhip: [1, 239 / 255, 213 / 255],
  peachpuff: [1, 218 / 255, 185 / 255],
  peru: [205 / 255, 133 / 255, 63 / 255],
  pink: [1, 192 / 255, 203 / 255],
  plum: [221 / 255, 160 / 255, 221 / 255],
  powderblue: [176 / 255, 224 / 255, 230 / 255],
  purple: [128 / 255, 0, 128 / 255],
  rebeccapurple: [102 / 255, 51 / 255, 153 / 255],
  red: [1, 0, 0],
  rosybrown: [188 / 255, 143 / 255, 143 / 255],
  royalblue: [65 / 255, 105 / 255, 225 / 255],
  saddlebrown: [139 / 255, 69 / 255, 19 / 255],
  salmon: [250 / 255, 128 / 255, 114 / 255],
  sandybrown: [244 / 255, 164 / 255, 96 / 255],
  seagreen: [46 / 255, 139 / 255, 87 / 255],
  seashell: [1, 245 / 255, 238 / 255],
  sienna: [160 / 255, 82 / 255, 45 / 255],
  silver: [192 / 255, 192 / 255, 192 / 255],
  skyblue: [135 / 255, 206 / 255, 235 / 255],
  slateblue: [106 / 255, 90 / 255, 205 / 255],
  slategray: [112 / 255, 128 / 255, 144 / 255],
  slategrey: [112 / 255, 128 / 255, 144 / 255],
  snow: [1, 250 / 255, 250 / 255],
  springgreen: [0, 1, 127 / 255],
  steelblue: [70 / 255, 130 / 255, 180 / 255],
  tan: [210 / 255, 180 / 255, 140 / 255],
  teal: [0, 128 / 255, 128 / 255],
  thistle: [216 / 255, 191 / 255, 216 / 255],
  tomato: [1, 99 / 255, 71 / 255],
  turquoise: [64 / 255, 224 / 255, 208 / 255],
  violet: [238 / 255, 130 / 255, 238 / 255],
  wheat: [245 / 255, 222 / 255, 179 / 255],
  white: [1, 1, 1],
  whitesmoke: [245 / 255, 245 / 255, 245 / 255],
  yellow: [1, 1, 0],
  yellowgreen: [154 / 255, 205 / 255, 50 / 255]
};
let coordGrammar = Array(3).fill("<percentage> | <number>[0, 255]");
let coordGrammarNumber = Array(3).fill("<number>[0, 255]");
const sRGB = new RGBColorSpace({
  id: "srgb",
  name: "sRGB",
  base: sRGBLinear,
  fromBase: (rgb) => {
    return rgb.map((val) => {
      let sign = val < 0 ? -1 : 1;
      let abs = val * sign;
      if (abs > 31308e-7) {
        return sign * (1.055 * abs ** (1 / 2.4) - 0.055);
      }
      return 12.92 * val;
    });
  },
  toBase: (rgb) => {
    return rgb.map((val) => {
      let sign = val < 0 ? -1 : 1;
      let abs = val * sign;
      if (abs <= 0.04045) {
        return val / 12.92;
      }
      return sign * ((abs + 0.055) / 1.055) ** 2.4;
    });
  },
  formats: {
    rgb: {
      coords: coordGrammar
    },
    rgb_number: {
      name: "rgb",
      commas: true,
      coords: coordGrammarNumber,
      alpha: false
    },
    color: {
      /* use defaults */
    },
    rgba: {
      coords: coordGrammar,
      commas: true,
      alpha: true
    },
    rgba_number: {
      name: "rgba",
      commas: true,
      coords: coordGrammarNumber
    },
    hex: {
      type: "custom",
      toGamut: true,
      test: (str) => /^#(([a-f0-9]{2}){3,4}|[a-f0-9]{3,4})$/i.test(str),
      parse(str) {
        if (str.length <= 5) {
          str = str.replace(/[a-f0-9]/gi, "$&$&");
        }
        let rgba = [];
        str.replace(/[a-f0-9]{2}/gi, (component) => {
          rgba.push(parseInt(component, 16) / 255);
        });
        return {
          spaceId: "srgb",
          coords: (
            /** @type {Coords} */
            rgba.slice(0, 3)
          ),
          alpha: (
            /** @type {number} */
            rgba.slice(3)[0]
          )
        };
      },
      serialize: (coords, alpha, {
        collapse = true,
        // collapse to 3-4 digit hex when possible?
        alpha: alphaFormat
      } = {}) => {
        if (alphaFormat !== false && alpha < 1 || alphaFormat === true) {
          coords.push(alpha);
        }
        coords = /** @type {[number, number, number]} */
        coords.map((c4) => Math.round(c4 * 255));
        let collapsible = collapse && coords.every((c4) => c4 % 17 === 0);
        let hex = coords.map((c4) => {
          if (collapsible) {
            return (c4 / 17).toString(16);
          }
          return c4.toString(16).padStart(2, "0");
        }).join("");
        return "#" + hex;
      }
    },
    keyword: {
      type: "custom",
      test: (str) => /^[a-z]+$/i.test(str),
      parse(str) {
        str = str.toLowerCase();
        let ret = { spaceId: "srgb", coords: null, alpha: 1 };
        if (str === "transparent") {
          ret.coords = KEYWORDS.black;
          ret.alpha = 0;
        } else {
          ret.coords = KEYWORDS[str];
        }
        if (ret.coords) {
          return ret;
        }
      }
    }
  }
});
const P3 = new RGBColorSpace({
  id: "p3",
  cssId: "display-p3",
  name: "P3",
  base: P3Linear,
  // Gamma encoding/decoding is the same as sRGB
  fromBase: sRGB.fromBase,
  toBase: sRGB.toBase
});
function getLuminance(color) {
  return get(color, [xyz_d65, "y"]);
}
function contrastWCAG21(color1, color2) {
  color1 = getColor(color1);
  color2 = getColor(color2);
  let Y1 = Math.max(getLuminance(color1), 0);
  let Y2 = Math.max(getLuminance(color2), 0);
  if (Y2 > Y1) {
    [Y1, Y2] = [Y2, Y1];
  }
  return (Y1 + 0.05) / (Y2 + 0.05);
}
const normBG = 0.56;
const normTXT = 0.57;
const revTXT = 0.62;
const revBG = 0.65;
const blkThrs = 0.022;
const blkClmp = 1.414;
const loClip = 0.1;
const deltaYmin = 5e-4;
const scaleBoW = 1.14;
const loBoWoffset = 0.027;
const scaleWoB = 1.14;
function fclamp(Y) {
  if (Y >= blkThrs) {
    return Y;
  }
  return Y + (blkThrs - Y) ** blkClmp;
}
function linearize(val) {
  let sign = val < 0 ? -1 : 1;
  let abs = Math.abs(val);
  return sign * Math.pow(abs, 2.4);
}
function contrastAPCA(background, foreground) {
  foreground = getColor(foreground);
  background = getColor(background);
  let S;
  let C;
  let Sapc;
  let R, G, B;
  foreground = to(foreground, "srgb");
  [R, G, B] = foreground.coords.map((c4) => {
    return isNone(c4) ? 0 : c4;
  });
  let lumTxt = linearize(R) * 0.2126729 + linearize(G) * 0.7151522 + linearize(B) * 0.072175;
  background = to(background, "srgb");
  [R, G, B] = background.coords.map((c4) => {
    return isNone(c4) ? 0 : c4;
  });
  let lumBg = linearize(R) * 0.2126729 + linearize(G) * 0.7151522 + linearize(B) * 0.072175;
  let Ytxt = fclamp(lumTxt);
  let Ybg = fclamp(lumBg);
  let BoW = Ybg > Ytxt;
  if (Math.abs(Ybg - Ytxt) < deltaYmin) {
    C = 0;
  } else {
    if (BoW) {
      S = Ybg ** normBG - Ytxt ** normTXT;
      C = S * scaleBoW;
    } else {
      S = Ybg ** revBG - Ytxt ** revTXT;
      C = S * scaleWoB;
    }
  }
  if (Math.abs(C) < loClip) {
    Sapc = 0;
  } else if (C > 0) {
    Sapc = C - loBoWoffset;
  } else {
    Sapc = C + loBoWoffset;
  }
  return Sapc * 100;
}
function contrastMichelson(color1, color2) {
  color1 = getColor(color1);
  color2 = getColor(color2);
  let Y1 = Math.max(getLuminance(color1), 0);
  let Y2 = Math.max(getLuminance(color2), 0);
  if (Y2 > Y1) {
    [Y1, Y2] = [Y2, Y1];
  }
  let denom = Y1 + Y2;
  return denom === 0 ? 0 : (Y1 - Y2) / denom;
}
const max = 5e4;
function contrastWeber(color1, color2) {
  color1 = getColor(color1);
  color2 = getColor(color2);
  let Y1 = Math.max(getLuminance(color1), 0);
  let Y2 = Math.max(getLuminance(color2), 0);
  if (Y2 > Y1) {
    [Y1, Y2] = [Y2, Y1];
  }
  return Y2 === 0 ? max : (Y1 - Y2) / Y2;
}
function contrastLstar(color1, color2) {
  color1 = getColor(color1);
  color2 = getColor(color2);
  let L1 = get(color1, [lab, "l"]);
  let L2 = get(color2, [lab, "l"]);
  return Math.abs(L1 - L2);
}
const ε = 216 / 24389;
const ε3 = 24 / 116;
const κ = 24389 / 27;
let white = WHITES.D65;
const lab_d65 = new ColorSpace({
  id: "lab-d65",
  name: "Lab D65",
  coords: {
    l: {
      refRange: [0, 100],
      name: "Lightness"
    },
    a: {
      refRange: [-125, 125]
    },
    b: {
      refRange: [-125, 125]
    }
  },
  // Assuming XYZ is relative to D65, convert to CIE Lab
  // from CIE standard, which now defines these as a rational fraction
  white,
  base: xyz_d65,
  // Convert D65-adapted XYZ to Lab
  //  CIE 15.3:2004 section 8.2.1.1
  fromBase(XYZ) {
    let xyz = XYZ.map((value, i2) => value / white[i2]);
    let f2 = xyz.map((value) => value > ε ? Math.cbrt(value) : (κ * value + 16) / 116);
    return [
      116 * f2[1] - 16,
      // L
      500 * (f2[0] - f2[1]),
      // a
      200 * (f2[1] - f2[2])
      // b
    ];
  },
  // Convert Lab to D65-adapted XYZ
  // Same result as CIE 15.3:2004 Appendix D although the derivation is different
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  toBase(Lab) {
    let f2 = [];
    f2[1] = (Lab[0] + 16) / 116;
    f2[0] = Lab[1] / 500 + f2[1];
    f2[2] = f2[1] - Lab[2] / 200;
    let xyz = [
      f2[0] > ε3 ? Math.pow(f2[0], 3) : (116 * f2[0] - 16) / κ,
      Lab[0] > 8 ? Math.pow((Lab[0] + 16) / 116, 3) : Lab[0] / κ,
      f2[2] > ε3 ? Math.pow(f2[2], 3) : (116 * f2[2] - 16) / κ
    ];
    return xyz.map((value, i2) => value * white[i2]);
  },
  formats: {
    "lab-d65": {
      coords: [
        "<number> | <percentage>",
        "<number> | <percentage>",
        "<number> | <percentage>"
      ]
    }
  }
});
const phi = Math.pow(5, 0.5) * 0.5 + 0.5;
function contrastDeltaPhi(color1, color2) {
  color1 = getColor(color1);
  color2 = getColor(color2);
  let Lstr1 = get(color1, [lab_d65, "l"]);
  let Lstr2 = get(color2, [lab_d65, "l"]);
  let deltaPhiStar = Math.abs(Math.pow(Lstr1, phi) - Math.pow(Lstr2, phi));
  let contrast2 = Math.pow(deltaPhiStar, 1 / phi) * Math.SQRT2 - 40;
  return contrast2 < 7.5 ? 0 : contrast2;
}
const contrastAlgorithms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  contrastAPCA,
  contrastDeltaPhi,
  contrastLstar,
  contrastMichelson,
  contrastWCAG21,
  contrastWeber
}, Symbol.toStringTag, { value: "Module" }));
function contrast(background, foreground, o2) {
  if (isString(o2)) {
    o2 = { algorithm: o2 };
  }
  let { algorithm, ...rest } = o2 || {};
  if (!algorithm) {
    let algorithms = Object.keys(contrastAlgorithms).map((a2) => a2.replace(/^contrast/, "")).join(", ");
    throw new TypeError(
      `contrast() function needs a contrast algorithm. Please specify one of: ${algorithms}`
    );
  }
  background = getColor(background);
  foreground = getColor(foreground);
  for (let a2 in contrastAlgorithms) {
    if ("contrast" + algorithm.toLowerCase() === a2.toLowerCase()) {
      return contrastAlgorithms[a2](background, foreground, rest);
    }
  }
  throw new TypeError(`Unknown contrast algorithm: ${algorithm}`);
}
const hsl = new ColorSpace({
  id: "hsl",
  name: "HSL",
  coords: {
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    },
    s: {
      range: [0, 100],
      name: "Saturation"
    },
    l: {
      range: [0, 100],
      name: "Lightness"
    }
  },
  base: sRGB,
  // Adapted from https://drafts.csswg.org/css-color-4/better-rgbToHsl.js
  fromBase: (rgb) => {
    let max2 = Math.max(...rgb);
    let min = Math.min(...rgb);
    let [r, g2, b2] = rgb;
    let [h2, s2, l2] = [null, 0, (min + max2) / 2];
    let d2 = max2 - min;
    if (d2 !== 0) {
      s2 = l2 === 0 || l2 === 1 ? 0 : (max2 - l2) / Math.min(l2, 1 - l2);
      switch (max2) {
        case r:
          h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
          break;
        case g2:
          h2 = (b2 - r) / d2 + 2;
          break;
        case b2:
          h2 = (r - g2) / d2 + 4;
      }
      h2 = h2 * 60;
    }
    if (s2 < 0) {
      h2 += 180;
      s2 = Math.abs(s2);
    }
    if (h2 >= 360) {
      h2 -= 360;
    }
    return [h2, s2 * 100, l2 * 100];
  },
  // Adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
  toBase: (hsl2) => {
    let [h2, s2, l2] = hsl2;
    h2 = h2 % 360;
    if (h2 < 0) {
      h2 += 360;
    }
    s2 /= 100;
    l2 /= 100;
    function f2(n2) {
      let k = (n2 + h2 / 30) % 12;
      let a2 = s2 * Math.min(l2, 1 - l2);
      return l2 - a2 * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    }
    return [f2(0), f2(8), f2(4)];
  },
  formats: {
    hsl: {
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    },
    hsla: {
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"],
      commas: true,
      alpha: true
    }
  }
});
const HSV = new ColorSpace({
  id: "hsv",
  name: "HSV",
  coords: {
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    },
    s: {
      range: [0, 100],
      name: "Saturation"
    },
    v: {
      range: [0, 100],
      name: "Value"
    }
  },
  base: sRGB,
  // https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation
  fromBase(rgb) {
    let max2 = Math.max(...rgb);
    let min = Math.min(...rgb);
    let [r, g2, b2] = rgb;
    let [h2, s2, v2] = [null, 0, max2];
    let d2 = max2 - min;
    if (d2 !== 0) {
      switch (max2) {
        case r:
          h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
          break;
        case g2:
          h2 = (b2 - r) / d2 + 2;
          break;
        case b2:
          h2 = (r - g2) / d2 + 4;
      }
      h2 = h2 * 60;
    }
    if (v2) {
      s2 = d2 / v2;
    }
    if (h2 >= 360) {
      h2 -= 360;
    }
    return [h2, s2 * 100, v2 * 100];
  },
  // Adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB_alternative
  toBase(hsv) {
    let [h2, s2, v2] = hsv;
    h2 = h2 % 360;
    if (h2 < 0) {
      h2 += 360;
    }
    s2 /= 100;
    v2 /= 100;
    function f2(n2) {
      let k = (n2 + h2 / 60) % 6;
      return v2 - v2 * s2 * Math.max(0, Math.min(k, 4 - k, 1));
    }
    return [f2(5), f2(3), f2(1)];
  },
  formats: {
    color: {
      id: "--hsv",
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
const hwb = new ColorSpace({
  id: "hwb",
  name: "HWB",
  coords: {
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    },
    w: {
      range: [0, 100],
      name: "Whiteness"
    },
    b: {
      range: [0, 100],
      name: "Blackness"
    }
  },
  base: HSV,
  fromBase(hsv) {
    let [h2, s2, v2] = hsv;
    return [h2, v2 * (100 - s2) / 100, 100 - v2];
  },
  toBase(hwb2) {
    let [h2, w2, b2] = hwb2;
    w2 /= 100;
    b2 /= 100;
    let sum = w2 + b2;
    if (sum >= 1) {
      let gray = w2 / sum;
      return [h2, 0, gray * 100];
    }
    let v2 = 1 - b2;
    let s2 = v2 === 0 ? 0 : 1 - w2 / v2;
    return [h2, s2 * 100, v2 * 100];
  },
  formats: {
    hwb: {
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
const toXYZ_M$1 = [
  [0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
  [0.29734497525053605, 0.6273635662554661, 0.07529145849399788],
  [0.02703136138641234, 0.07068885253582723, 0.9913375368376388]
];
const fromXYZ_M$1 = [
  [2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
  [-0.9692436362808795, 1.8759675015077202, 0.04155505740717557],
  [0.013444280632031142, -0.11836239223101838, 1.0151749943912054]
];
const A98Linear = new RGBColorSpace({
  id: "a98rgb-linear",
  cssId: "--a98-rgb-linear",
  name: "Linear Adobe® 98 RGB compatible",
  white: "D65",
  toXYZ_M: toXYZ_M$1,
  fromXYZ_M: fromXYZ_M$1
});
const a98rgb = new RGBColorSpace({
  id: "a98rgb",
  cssId: "a98-rgb",
  name: "Adobe® 98 RGB compatible",
  base: A98Linear,
  toBase: (RGB) => RGB.map((val) => Math.pow(Math.abs(val), 563 / 256) * Math.sign(val)),
  fromBase: (RGB) => RGB.map((val) => Math.pow(Math.abs(val), 256 / 563) * Math.sign(val))
});
const toXYZ_M = [
  [0.7977666449006423, 0.13518129740053308, 0.0313477341283922],
  [0.2880748288194013, 0.711835234241873, 8993693872564e-17],
  [0, 0, 0.8251046025104602]
];
const fromXYZ_M = [
  [1.3457868816471583, -0.25557208737979464, -0.05110186497554526],
  [-0.5446307051249019, 1.5082477428451468, 0.02052744743642139],
  [0, 0, 1.2119675456389452]
];
const ProPhotoLinear = new RGBColorSpace({
  id: "prophoto-linear",
  cssId: "--prophoto-rgb-linear",
  name: "Linear ProPhoto",
  white: "D50",
  base: XYZ_D50,
  toXYZ_M,
  fromXYZ_M
});
const Et = 1 / 512;
const Et2 = 16 / 512;
const prophoto = new RGBColorSpace({
  id: "prophoto",
  cssId: "prophoto-rgb",
  name: "ProPhoto",
  base: ProPhotoLinear,
  toBase(RGB) {
    return RGB.map((v2) => {
      let sign = v2 < 0 ? -1 : 1;
      let abs = v2 * sign;
      if (abs < Et2) {
        return v2 / 16;
      }
      return sign * abs ** 1.8;
    });
  },
  fromBase(RGB) {
    return RGB.map((v2) => {
      let sign = v2 < 0 ? -1 : 1;
      let abs = v2 * sign;
      if (abs >= Et) {
        return sign * abs ** (1 / 1.8);
      }
      return 16 * v2;
    });
  }
});
const OKLCH = new ColorSpace({
  id: "oklch",
  name: "OkLCh",
  coords: {
    l: {
      refRange: [0, 1],
      name: "Lightness"
    },
    c: {
      refRange: [0, 0.4],
      name: "Chroma"
    },
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    }
  },
  white: "D65",
  base: Oklab,
  fromBase: lch.fromBase,
  toBase: lch.toBase,
  formats: {
    oklch: {
      coords: ["<percentage> | <number>", "<number> | <percentage>", "<number> | <angle>"]
    }
  }
});
const tau = 2 * Math.PI;
const toSRGBLinear = [
  [4.076741636075958, -3.307711539258063, 0.2309699031821043],
  [-1.2684379732850315, 2.609757349287688, -0.341319376002657],
  [-0.0041960761386756, -0.7034186179359362, 1.7076146940746117]
];
const RGBCoeff = [
  // Red
  [
    // Limit
    [-1.8817031, -0.80936501],
    // `Kn` coefficients
    [1.19086277, 1.76576728, 0.59662641, 0.75515197, 0.56771245]
  ],
  // Green
  [
    // Limit
    [1.8144408, -1.19445267],
    // `Kn` coefficients
    [0.73956515, -0.45954404, 0.08285427, 0.12541073, -0.14503204]
  ],
  // Blue
  [
    // Limit
    [0.13110758, 1.81333971],
    // `Kn` coefficients
    [1.35733652, -915799e-8, -1.1513021, -0.50559606, 692167e-8]
  ]
];
const floatMax = Number.MAX_VALUE;
const K1 = 0.206;
const K2 = 0.03;
const K3 = (1 + K1) / (1 + K2);
function vdot(a2, b2) {
  let l2 = a2.length;
  if (l2 !== b2.length) {
    throw new Error(`Vectors of size ${l2} and ${b2.length} are not aligned`);
  }
  let s2 = 0;
  a2.forEach((c4, i2) => {
    s2 += c4 * b2[i2];
  });
  return s2;
}
function toe(x) {
  return 0.5 * (K3 * x - K1 + Math.sqrt((K3 * x - K1) * (K3 * x - K1) + 4 * K2 * K3 * x));
}
function toeInv(x) {
  return (x ** 2 + K1 * x) / (K3 * (x + K2));
}
function toSt(cusp) {
  let [l2, c4] = cusp;
  return [c4 / l2, c4 / (1 - l2)];
}
function getStMid(a2, b2) {
  let s2 = 0.11516993 + 1 / (7.4477897 + 4.1590124 * b2 + a2 * (-2.19557347 + 1.75198401 * b2 + a2 * (-2.13704948 - 10.02301043 * b2 + a2 * (-4.24894561 + 5.38770819 * b2 + 4.69891013 * a2))));
  let t2 = 0.11239642 + 1 / (1.6132032 - 0.68124379 * b2 + a2 * (0.40370612 + 0.90148123 * b2 + a2 * (-0.27087943 + 0.6122399 * b2 + a2 * (299215e-8 - 0.45399568 * b2 - 0.14661872 * a2))));
  return [s2, t2];
}
function oklabToLinearRGB(lab2, lmsToRgb) {
  let lms = multiply_v3_m3x3(lab2, LabtoLMS_M);
  lms[0] = lms[0] ** 3;
  lms[1] = lms[1] ** 3;
  lms[2] = lms[2] ** 3;
  return multiply_v3_m3x3(lms, lmsToRgb, lms);
}
function findCusp(a2, b2, lmsToRgb, okCoeff) {
  let sCusp = computeMaxSaturation(a2, b2, lmsToRgb, okCoeff);
  let rgb = oklabToLinearRGB([1, sCusp * a2, sCusp * b2], lmsToRgb);
  let lCusp = spow(1 / Math.max(...rgb), 1 / 3);
  let cCusp = lCusp * sCusp;
  return [lCusp, cCusp];
}
function findGamutIntersection(a2, b2, l1, c12, l0, lmsToRgb, okCoeff, cusp) {
  let t2;
  if (cusp === void 0) {
    cusp = findCusp(a2, b2, lmsToRgb, okCoeff);
  }
  if ((l1 - l0) * cusp[1] - (cusp[0] - l0) * c12 <= 0) {
    t2 = cusp[1] * l0 / (c12 * cusp[0] + cusp[1] * (l0 - l1));
  } else {
    t2 = cusp[1] * (l0 - 1) / (c12 * (cusp[0] - 1) + cusp[1] * (l0 - l1));
    let dl = l1 - l0;
    let dc = c12;
    let kl = vdot(LabtoLMS_M[0].slice(1), [a2, b2]);
    let km = vdot(LabtoLMS_M[1].slice(1), [a2, b2]);
    let ks = vdot(LabtoLMS_M[2].slice(1), [a2, b2]);
    let ldt_ = dl + dc * kl;
    let mdt_ = dl + dc * km;
    let sdt_ = dl + dc * ks;
    let L = l0 * (1 - t2) + t2 * l1;
    let C = t2 * c12;
    let l_ = L + C * kl;
    let m_ = L + C * km;
    let s_ = L + C * ks;
    let l2 = l_ ** 3;
    let m = m_ ** 3;
    let s2 = s_ ** 3;
    let ldt = 3 * ldt_ * l_ ** 2;
    let mdt = 3 * mdt_ * m_ ** 2;
    let sdt = 3 * sdt_ * s_ ** 2;
    let ldt2 = 6 * ldt_ ** 2 * l_;
    let mdt2 = 6 * mdt_ ** 2 * m_;
    let sdt2 = 6 * sdt_ ** 2 * s_;
    let r_ = vdot(lmsToRgb[0], [l2, m, s2]) - 1;
    let r1 = vdot(lmsToRgb[0], [ldt, mdt, sdt]);
    let r2 = vdot(lmsToRgb[0], [ldt2, mdt2, sdt2]);
    let ur = r1 / (r1 * r1 - 0.5 * r_ * r2);
    let tr = -r_ * ur;
    let g_ = vdot(lmsToRgb[1], [l2, m, s2]) - 1;
    let g1 = vdot(lmsToRgb[1], [ldt, mdt, sdt]);
    let g2 = vdot(lmsToRgb[1], [ldt2, mdt2, sdt2]);
    let ug = g1 / (g1 * g1 - 0.5 * g_ * g2);
    let tg = -g_ * ug;
    let b_ = vdot(lmsToRgb[2], [l2, m, s2]) - 1;
    let b1 = vdot(lmsToRgb[2], [ldt, mdt, sdt]);
    let b22 = vdot(lmsToRgb[2], [ldt2, mdt2, sdt2]);
    let ub = b1 / (b1 * b1 - 0.5 * b_ * b22);
    let tb = -b_ * ub;
    tr = ur >= 0 ? tr : floatMax;
    tg = ug >= 0 ? tg : floatMax;
    tb = ub >= 0 ? tb : floatMax;
    t2 += Math.min(tr, Math.min(tg, tb));
  }
  return t2;
}
function getCs(lab2, lmsToRgb, okCoeff) {
  let [l2, a2, b2] = lab2;
  let cusp = findCusp(a2, b2, lmsToRgb, okCoeff);
  let cMax = findGamutIntersection(a2, b2, l2, 1, l2, lmsToRgb, okCoeff, cusp);
  let stMax = toSt(cusp);
  let k = cMax / Math.min(l2 * stMax[0], (1 - l2) * stMax[1]);
  let stMid = getStMid(a2, b2);
  let ca = l2 * stMid[0];
  let cb = (1 - l2) * stMid[1];
  let cMid = 0.9 * k * Math.sqrt(Math.sqrt(1 / (1 / ca ** 4 + 1 / cb ** 4)));
  ca = l2 * 0.4;
  cb = (1 - l2) * 0.8;
  let c0 = Math.sqrt(1 / (1 / ca ** 2 + 1 / cb ** 2));
  return [c0, cMid, cMax];
}
function computeMaxSaturation(a2, b2, lmsToRgb, okCoeff) {
  let k0, k1, k2, k3, k4, wl, wm, ws;
  if (vdot(okCoeff[0][0], [a2, b2]) > 1) {
    [k0, k1, k2, k3, k4] = okCoeff[0][1];
    [wl, wm, ws] = lmsToRgb[0];
  } else if (vdot(okCoeff[1][0], [a2, b2]) > 1) {
    [k0, k1, k2, k3, k4] = okCoeff[1][1];
    [wl, wm, ws] = lmsToRgb[1];
  } else {
    [k0, k1, k2, k3, k4] = okCoeff[2][1];
    [wl, wm, ws] = lmsToRgb[2];
  }
  let sat = k0 + k1 * a2 + k2 * b2 + k3 * a2 ** 2 + k4 * a2 * b2;
  let kl = vdot(LabtoLMS_M[0].slice(1), [a2, b2]);
  let km = vdot(LabtoLMS_M[1].slice(1), [a2, b2]);
  let ks = vdot(LabtoLMS_M[2].slice(1), [a2, b2]);
  let l_ = 1 + sat * kl;
  let m_ = 1 + sat * km;
  let s_ = 1 + sat * ks;
  let l2 = l_ ** 3;
  let m = m_ ** 3;
  let s2 = s_ ** 3;
  let lds = 3 * kl * l_ ** 2;
  let mds = 3 * km * m_ ** 2;
  let sds = 3 * ks * s_ ** 2;
  let lds2 = 6 * kl ** 2 * l_;
  let mds2 = 6 * km ** 2 * m_;
  let sds2 = 6 * ks ** 2 * s_;
  let f2 = wl * l2 + wm * m + ws * s2;
  let f1 = wl * lds + wm * mds + ws * sds;
  let f22 = wl * lds2 + wm * mds2 + ws * sds2;
  sat = sat - f2 * f1 / (f1 ** 2 - 0.5 * f2 * f22);
  return sat;
}
function okhslToOklab(hsl2, lmsToRgb, okCoeff) {
  let [h2, s2, l2] = hsl2;
  let L = toeInv(l2);
  let a2 = null;
  let b2 = null;
  h2 = constrain(h2) / 360;
  if (L !== 0 && L !== 1 && s2 !== 0) {
    let a_ = Math.cos(tau * h2);
    let b_ = Math.sin(tau * h2);
    let [c0, cMid, cMax] = getCs([L, a_, b_], lmsToRgb, okCoeff);
    let mid = 0.8;
    let midInv = 1.25;
    let t2, k0, k1, k2;
    if (s2 < mid) {
      t2 = midInv * s2;
      k0 = 0;
      k1 = mid * c0;
      k2 = 1 - k1 / cMid;
    } else {
      t2 = 5 * (s2 - 0.8);
      k0 = cMid;
      k1 = 0.2 * cMid ** 2 * 1.25 ** 2 / c0;
      k2 = 1 - k1 / (cMax - cMid);
    }
    let c4 = k0 + t2 * k1 / (1 - k2 * t2);
    a2 = c4 * a_;
    b2 = c4 * b_;
  }
  return [L, a2, b2];
}
function oklabToOkhsl(lab2, lmsToRgb, okCoeff) {
  let εL = 1e-7;
  let εS = 1e-4;
  let L = lab2[0];
  let s2 = 0;
  let l2 = toe(L);
  let c4 = Math.sqrt(lab2[1] ** 2 + lab2[2] ** 2);
  let h2 = 0.5 + Math.atan2(-lab2[2], -lab2[1]) / tau;
  if (l2 !== 0 && l2 !== 1 && c4 !== 0) {
    let a_ = lab2[1] / c4;
    let b_ = lab2[2] / c4;
    let [c0, cMid, cMax] = getCs([L, a_, b_], lmsToRgb, okCoeff);
    let mid = 0.8;
    let midInv = 1.25;
    let k0, k1, k2, t2;
    if (c4 < cMid) {
      k1 = mid * c0;
      k2 = 1 - k1 / cMid;
      t2 = c4 / (k1 + k2 * c4);
      s2 = t2 * mid;
    } else {
      k0 = cMid;
      k1 = 0.2 * cMid ** 2 * midInv ** 2 / c0;
      k2 = 1 - k1 / (cMax - cMid);
      t2 = (c4 - k0) / (k1 + k2 * (c4 - k0));
      s2 = mid + 0.2 * t2;
    }
  }
  const achromatic = Math.abs(s2) < εS;
  if (achromatic || l2 === 0 || Math.abs(1 - l2) < εL) {
    h2 = null;
    if (!achromatic) {
      s2 = 0;
    }
  } else {
    h2 = constrain(h2 * 360);
  }
  return [h2, s2, l2];
}
new ColorSpace({
  id: "okhsl",
  name: "Okhsl",
  coords: {
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    },
    s: {
      range: [0, 1],
      name: "Saturation"
    },
    l: {
      range: [0, 1],
      name: "Lightness"
    }
  },
  base: Oklab,
  gamutSpace: "self",
  // Convert Oklab to Okhsl
  fromBase(lab2) {
    return oklabToOkhsl(lab2, toSRGBLinear, RGBCoeff);
  },
  // Convert Okhsl to Oklab
  toBase(hsl2) {
    return okhslToOklab(hsl2, toSRGBLinear, RGBCoeff);
  },
  formats: {
    color: {
      id: "--okhsl",
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
function okhsvToOklab(hsv, lmsToRgb, okCoeff) {
  let [h2, s2, v2] = hsv;
  h2 = constrain(h2) / 360;
  let l2 = toeInv(v2);
  let a2 = null;
  let b2 = null;
  if (l2 !== 0 && s2 !== 0) {
    let a_ = Math.cos(tau * h2);
    let b_ = Math.sin(tau * h2);
    let cusp = findCusp(a_, b_, lmsToRgb, okCoeff);
    let [sMax, tMax] = toSt(cusp);
    let s0 = 0.5;
    let k = 1 - s0 / sMax;
    let lv = 1 - s2 * s0 / (s0 + tMax - tMax * k * s2);
    let cv = s2 * tMax * s0 / (s0 + tMax - tMax * k * s2);
    l2 = v2 * lv;
    let c4 = v2 * cv;
    let lvt = toeInv(lv);
    let cvt = cv * lvt / lv;
    let lNew = toeInv(l2);
    c4 = c4 * lNew / l2;
    l2 = lNew;
    let [rs, gs, bs] = oklabToLinearRGB([lvt, a_ * cvt, b_ * cvt], lmsToRgb);
    let scaleL = spow(1 / Math.max(Math.max(rs, gs), Math.max(bs, 0)), 1 / 3);
    l2 = l2 * scaleL;
    c4 = c4 * scaleL;
    a2 = c4 * a_;
    b2 = c4 * b_;
  }
  return [l2, a2, b2];
}
function oklabToOkhsv(lab2, lmsToRgb, okCoeff) {
  let ε2 = 1e-4;
  let l2 = lab2[0];
  let s2 = 0;
  let v2 = toe(l2);
  let c4 = Math.sqrt(lab2[1] ** 2 + lab2[2] ** 2);
  let h2 = 0.5 + Math.atan2(-lab2[2], -lab2[1]) / tau;
  if (l2 !== 0 && l2 !== 1 && c4 !== 0) {
    let a_ = lab2[1] / c4;
    let b_ = lab2[2] / c4;
    let cusp = findCusp(a_, b_, lmsToRgb, okCoeff);
    let [sMax, tMax] = toSt(cusp);
    let s0 = 0.5;
    let k = 1 - s0 / sMax;
    let t2 = tMax / (c4 + l2 * tMax);
    let lv = t2 * l2;
    let cv = t2 * c4;
    let lvt = toeInv(lv);
    let cvt = cv * lvt / lv;
    let [rs, gs, bs] = oklabToLinearRGB([lvt, a_ * cvt, b_ * cvt], lmsToRgb);
    let scaleL = spow(1 / Math.max(Math.max(rs, gs), Math.max(bs, 0)), 1 / 3);
    l2 = l2 / scaleL;
    c4 = c4 / scaleL;
    c4 = c4 * toe(l2) / l2;
    l2 = toe(l2);
    v2 = l2 / lv;
    s2 = (s0 + tMax) * cv / (tMax * s0 + tMax * k * cv);
  }
  if (Math.abs(s2) < ε2 || v2 === 0) {
    h2 = null;
  } else {
    h2 = constrain(h2 * 360);
  }
  return [h2, s2, v2];
}
const okhsv = new ColorSpace({
  id: "okhsv",
  name: "Okhsv",
  coords: {
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    },
    s: {
      range: [0, 1],
      name: "Saturation"
    },
    v: {
      range: [0, 1],
      name: "Value"
    }
  },
  base: Oklab,
  gamutSpace: "self",
  // Convert Oklab to Okhsl
  fromBase(lab2) {
    return oklabToOkhsv(lab2, toSRGBLinear, RGBCoeff);
  },
  // Convert Okhsl to Oklab
  toBase(hsl2) {
    return okhsvToOklab(hsl2, toSRGBLinear, RGBCoeff);
  },
  formats: {
    color: {
      id: "--okhsv",
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
ColorSpace.register(sRGB);
ColorSpace.register(sRGBLinear);
ColorSpace.register(hsl);
ColorSpace.register(hwb);
ColorSpace.register(lab);
ColorSpace.register(lch);
ColorSpace.register(Oklab);
ColorSpace.register(OKLCH);
ColorSpace.register(P3);
ColorSpace.register(a98rgb);
ColorSpace.register(prophoto);
ColorSpace.register(REC2020);
ColorSpace.register(xyz_d65);
ColorSpace.register(XYZ_D50);
ColorSpace.register(okhsv);
function contrastColor(c4) {
  var _a2, _b2;
  try {
    const color = parse(c4);
    let wh;
    let bl;
    try {
      wh = (_a2 = contrast(color, "white", "WCAG21")) != null ? _a2 : contrastLstar(color, "white");
      bl = (_b2 = contrast(color, "black", "WCAG21")) != null ? _b2 : contrastLstar(color, "black");
    } catch {
      wh = contrastLstar(color, "white");
      bl = contrastLstar(color, "black");
    }
    return wh > bl ? "white" : "black";
  } catch {
    return "black";
  }
}
function detectGamut(colorStr) {
  let gamut = "srgb";
  if (!colorStr || colorStr.startsWith("#")) return gamut;
  try {
    const c4 = parse(colorStr);
    const srgb = { spaceId: "srgb", coords: to(c4, "srgb").coords, alpha: null };
    const p3 = { spaceId: "p3", coords: to(c4, "p3").coords, alpha: null };
    const rec2020 = { spaceId: "rec2020", coords: to(c4, "rec2020").coords, alpha: null };
    const xyz = { spaceId: "xyz", coords: to(c4, "xyz").coords, alpha: null };
    if (inGamut(xyz)) gamut = "xyz";
    if (inGamut(rec2020)) gamut = "rec2020";
    if (inGamut(p3)) gamut = "p3";
    if (inGamut(srgb)) gamut = "srgb";
  } catch {
  }
  return gamut;
}
function getColorJSSpaceID(space) {
  if (space === "display-p3") return "p3";
  if (space === "a98-rgb") return "a98rgb";
  return space;
}
function reverseColorJSSpaceID(space) {
  if (space === "p3") return "display-p3";
  if (space === "a98rgb") return "a98-rgb";
  return space;
}
function alphaToString(alpha) {
  return alpha === "100" || alpha === 100 ? "" : ` / ${alpha}%`;
}
function isRGBLike(space) {
  return [
    "srgb-linear",
    "display-p3",
    "rec2020",
    "a98-rgb",
    "prophoto",
    "xyz",
    "xyz-d50",
    "xyz-d65"
  ].includes(space);
}
function rgbColor(space, r, g2, b2, a2) {
  const s2 = space === "prophoto" ? "prophoto-rgb" : space;
  return `color(${s2} ${r}% ${g2}% ${b2}%${alphaToString(a2)})`;
}
function toFixed(n2, digits = 0) {
  if (n2 == null) {
    return "0";
  }
  return Number(n2.toFixed(digits)).toString();
}
function formatChannel(space, key, val) {
  const round = (n2, d2 = 0) => Number(n2.toFixed(d2));
  if (space === "oklab") {
    if (key === "L") return String(round(val, 0));
    if (key === "A" || key === "B") return String(round(val, 2));
  } else if (space === "oklch") {
    if (key === "L") return String(round(val, 0));
    if (key === "C") return String(round(val, 0));
    if (key === "H") return String(round(val, 0));
  } else if (space === "lab") {
    if (key === "L") return String(round(val, 0));
    if (key === "A" || key === "B") return String(round(val, 0));
  } else if (space === "lch") {
    if (key === "L" || key === "C" || key === "H") return String(round(val, 0));
  } else if (space === "hsl" || space === "hwb") {
    if (key === "H") return String(round(val, 0));
    if (key === "S" || key === "L" || key === "W" || key === "B") return String(round(val, 0));
  } else if (space === "srgb" || space === "hex") {
    if (key === "R" || key === "G" || key === "B") return String(round(val, 0));
  } else {
    const rgbLike = [
      "srgb-linear",
      "display-p3",
      "rec2020",
      "a98-rgb",
      "prophoto",
      "xyz",
      "xyz-d50",
      "xyz-d65"
    ];
    if (rgbLike.includes(space) && (key === "R" || key === "G" || key === "B")) {
      return String(round(val, 0));
    }
  }
  if (key === "ALP") return String(round(val, 0));
  return String(round(val, 2));
}
const noLeadZero = (v2) => String(v2).replace(/^(-?)0\./, "$1.");
function gencolor(space, ch) {
  var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j;
  const L = (_a2 = ch.L) != null ? _a2 : 50;
  const A = (_b2 = ch.A) != null ? _b2 : 0;
  const B = (_c2 = ch.B) != null ? _c2 : 0;
  const C = (_d2 = ch.C) != null ? _d2 : 0;
  const H = (_e2 = ch.H) != null ? _e2 : 0;
  const S = (_f = ch.S) != null ? _f : 0;
  const W = (_g = ch.W) != null ? _g : 0;
  const R = (_h = ch.R) != null ? _h : 0;
  const G = (_i = ch.G) != null ? _i : 0;
  const ALP = (_j = ch.ALP) != null ? _j : 100;
  switch (space) {
    case "oklab":
      return `oklab(${L}% ${noLeadZero(A)} ${noLeadZero(B)}${alphaToString(ALP)})`;
    case "oklch":
      return `oklch(${L}% ${C}% ${H}${alphaToString(ALP)})`;
    case "lab":
      return `lab(${L}% ${noLeadZero(A)} ${noLeadZero(B)}${alphaToString(ALP)})`;
    case "lch":
      return `lch(${L}% ${C}% ${H}${alphaToString(ALP)})`;
    case "hsl":
      return `hsl(${H} ${S}% ${L}%${alphaToString(ALP)})`;
    case "hwb":
      return `hwb(${H} ${W}% ${B}%${alphaToString(ALP)})`;
    case "srgb":
      return `rgb(${R}% ${G}% ${B}%${alphaToString(ALP)})`;
    case "hex": {
      const r = Math.round(Number(R) * 2.55);
      const g2 = Math.round(Number(G) * 2.55);
      const b2 = Math.round(Number(B) * 2.55);
      const a2 = Number(ALP);
      const rh = r.toString(16).padStart(2, "0");
      const gh = g2.toString(16).padStart(2, "0");
      const bh = b2.toString(16).padStart(2, "0");
      const canShorten = rh[0] === rh[1] && gh[0] === gh[1] && bh[0] === bh[1];
      if (a2 < 100) {
        const alpha = Math.round(a2 / 100 * 255);
        const ah = alpha.toString(16).padStart(2, "0");
        if (canShorten && ah[0] === ah[1]) {
          return `#${rh[0]}${gh[0]}${bh[0]}${ah[0]}`;
        }
        return `#${rh}${gh}${bh}${ah}`;
      }
      if (canShorten) {
        return `#${rh[0]}${gh[0]}${bh[0]}`;
      }
      return `#${rh}${gh}${bh}`;
    }
    default:
      if (isRGBLike(space)) return rgbColor(space, R, G, B, ALP);
      return "oklch(75% 75% 180)";
  }
}
function parseIntoChannels(space, colorStr) {
  var _a2, _b2, _c2, _d2, _e2, _f;
  let c4 = getColor(parse(colorStr));
  const actualSpace = space === "hex" ? "srgb" : space;
  const targetId = getColorJSSpaceID(actualSpace);
  if (c4.space.id !== targetId) {
    c4 = to(c4, targetId);
  }
  const id = reverseColorJSSpaceID(c4.space.id);
  const s2 = id === "rgb" ? "srgb" : id;
  const ch = {};
  const alpha = (_a2 = c4.alpha) != null ? _a2 : 1;
  if (s2 === "oklab") {
    const [l2, a2, b2] = c4.coords;
    ch.L = toFixed((l2 != null ? l2 : 0) * 100);
    ch.A = toFixed(a2, 2);
    ch.B = toFixed(b2, 2);
    ch.ALP = toFixed(alpha * 100);
  } else if (s2 === "oklch") {
    const [minChroma, maxChroma] = (_b2 = OKLCH.coords.c.refRange) != null ? _b2 : [0, 1];
    const [l2, cc, h2] = c4.coords;
    const chromaPercentage = (cc != null ? cc : 0 - minChroma) / (maxChroma - minChroma) * 100;
    ch.L = toFixed((l2 != null ? l2 : 0) * 100);
    ch.C = toFixed(Math.min(100, chromaPercentage), 0);
    ch.H = toFixed(h2);
    ch.ALP = toFixed(alpha * 100);
  } else if (s2 === "lab") {
    const [l2, a2, b2] = c4.coords;
    ch.L = toFixed(l2);
    ch.A = toFixed(a2);
    ch.B = toFixed(b2);
    ch.ALP = toFixed(alpha * 100);
  } else if (s2 === "lch") {
    const [l2, cc, h2] = c4.coords;
    ch.L = toFixed(l2);
    ch.C = toFixed(Math.min(100, (cc != null ? cc : 0) / 1.5), 0);
    ch.H = toFixed(h2);
    ch.ALP = toFixed(alpha * 100);
  } else if (s2 === "hsl") {
    const h2 = c4.coords[0];
    const s22 = (_c2 = c4.coords[1]) != null ? _c2 : 0;
    const l2 = (_d2 = c4.coords[2]) != null ? _d2 : 0;
    ch.H = toFixed(h2);
    ch.S = toFixed(s22 > 1 ? s22 : s22 * 100);
    ch.L = toFixed(l2 > 1 ? l2 : l2 * 100);
    ch.ALP = toFixed(alpha * 100);
  } else if (s2 === "hwb") {
    const h2 = c4.coords[0];
    const w2 = (_e2 = c4.coords[1]) != null ? _e2 : 0;
    const b2 = (_f = c4.coords[2]) != null ? _f : 0;
    ch.H = toFixed(h2);
    ch.W = toFixed(w2 > 1 ? w2 : w2 * 100);
    ch.B = toFixed(b2 > 1 ? b2 : b2 * 100);
    ch.ALP = toFixed(alpha * 100);
  } else if (s2 === "srgb" || s2 === "hex") {
    const [r, g2, b2] = toGamut(c4, { space: "srgb", method: "clip" }).coords;
    ch.R = toFixed((r != null ? r : 0) * 100);
    ch.G = toFixed((g2 != null ? g2 : 0) * 100);
    ch.B = toFixed((b2 != null ? b2 : 0) * 100);
    ch.ALP = toFixed(alpha * 100);
  } else if (isRGBLike(s2)) {
    const [r, g2, b2] = c4.coords;
    ch.R = toFixed((r != null ? r : 0) * 100);
    ch.G = toFixed((g2 != null ? g2 : 0) * 100);
    ch.B = toFixed((b2 != null ? b2 : 0) * 100);
    ch.ALP = toFixed(alpha * 100);
  }
  return { space: s2, ch };
}
const encodedJs = "LyogY29sb3ItaW5wdXQgd2ViIGNvbXBvbmVudCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BzL2Nzcy1jb2xvci1jb21wb25lbnQgKi8KdmFyIF9fZGVmUHJvcD1PYmplY3QuZGVmaW5lUHJvcGVydHksX19kZWZOb3JtYWxQcm9wPShlLHQscik9PnQgaW4gZT9fX2RlZlByb3AoZSx0LHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTpyfSk6ZVt0XT1yLF9fcHVibGljRmllbGQ9KGUsdCxyKT0+X19kZWZOb3JtYWxQcm9wKGUsInN5bWJvbCIhPXR5cGVvZiB0P3QrIiI6dCxyKTshZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7dmFyIGUsdCxyO2Z1bmN0aW9uIGEoZSx0KXtyZXR1cm4gZVswXSp0WzBdK2VbMV0qdFsxXStlWzJdKnRbMl19ZnVuY3Rpb24gbihlLHQscj1bMCwwLDBdKXtjb25zdCBuPWEoZSx0WzBdKSxvPWEoZSx0WzFdKSxzPWEoZSx0WzJdKTtyZXR1cm4gclswXT1uLHJbMV09byxyWzJdPXMscn1mdW5jdGlvbiBvKGUpe3JldHVybiJzdHJpbmciPT09cyhlKX1mdW5jdGlvbiBzKGUpe3JldHVybihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkubWF0Y2goL15cW29iamVjdFxzKyguKj8pXF0kLylbMV18fCIiKS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIGkoZSl7cmV0dXJuIG51bGw9PT1lfWZ1bmN0aW9uIGwoZSx0KXtpZigwPT09ZSlyZXR1cm4gMDtsZXQgcj1+fmUsYT0wO3ImJnQmJihhPTErfn5NYXRoLmxvZzEwKE1hdGguYWJzKHIpKSk7Y29uc3Qgbj0xMCoqKHQtYSk7cmV0dXJuIE1hdGguZmxvb3IoZSpuKy41KS9ufWZ1bmN0aW9uIGMoZSx0LHIpe3JldHVybiBpc05hTihlKT90OmlzTmFOKHQpP2U6ZSsodC1lKSpyfWZ1bmN0aW9uIHUoZSx0LHIpe3JldHVybiFlfHwhdHx8ZT09PXR8fGVbMF09PT10WzBdJiZlWzFdPT09dFsxXXx8aXNOYU4ocil8fG51bGw9PT1yP3I6Yyh0WzBdLHRbMV0sZnVuY3Rpb24oZSx0LHIpe3JldHVybihyLWUpLyh0LWUpfShlWzBdLGVbMV0scikpfWZ1bmN0aW9uIGgoZSx0LHIpe3JldHVybiBNYXRoLm1heChNYXRoLm1pbihyLHQpLGUpfWZ1bmN0aW9uIGQoZSx0KXtyZXR1cm4gTWF0aC5zaWduKGUpPT09TWF0aC5zaWduKHQpP2U6LWV9ZnVuY3Rpb24gcChlLHQpe3JldHVybiBkKE1hdGguYWJzKGUpKip0LGUpfWZ1bmN0aW9uIGYoZSx0KXtyZXR1cm4gMD09PXQ/MDplL3R9ZnVuY3Rpb24gbShlLHQpe3ZhciByO2lmKGUgaW5zdGFuY2VvZiB0KXJldHVybiEwO2NvbnN0IGE9dC5uYW1lO2Zvcig7ZTspe2NvbnN0IHQ9T2JqZWN0LmdldFByb3RvdHlwZU9mKGUpLG49bnVsbD09KHI9bnVsbD09dD92b2lkIDA6dC5jb25zdHJ1Y3Rvcik/dm9pZCAwOnIubmFtZTtpZihuPT09YSlyZXR1cm4hMDtpZighbnx8Ik9iamVjdCI9PT1uKXJldHVybiExO2U9dH1yZXR1cm4hMX1jbGFzcyBne2NvbnN0cnVjdG9yKGUsdCl7dmFyIHI7aWYoX19wdWJsaWNGaWVsZCh0aGlzLCJ0eXBlIiksX19wdWJsaWNGaWVsZCh0aGlzLCJjb29yZE1ldGEiKSxfX3B1YmxpY0ZpZWxkKHRoaXMsImNvb3JkUmFuZ2UiKSxfX3B1YmxpY0ZpZWxkKHRoaXMsInJhbmdlIiksIm9iamVjdCI9PXR5cGVvZiBlJiYodGhpcy5jb29yZE1ldGE9ZSksdCYmKHRoaXMuY29vcmRNZXRhPXQsdGhpcy5jb29yZFJhbmdlPW51bGwhPShyPXQucmFuZ2UpP3I6dC5yZWZSYW5nZSksInN0cmluZyI9PXR5cGVvZiBlKXtsZXQgdD1lLnRyaW0oKS5tYXRjaCgvXig/PHR5cGU+PFthLXpdKz4pKFxbKD88bWluPi0/Wy5cZF0rKSxccyooPzxtYXg+LT9bLlxkXSspXF0pPyQvKTtpZighdCl0aHJvdyBuZXcgVHlwZUVycm9yKGBDYW5ub3QgcGFyc2UgJHtlfSBhcyBhIHR5cGUgZGVmaW5pdGlvbi5gKTt0aGlzLnR5cGU9dC5ncm91cHMudHlwZTtsZXR7bWluOnIsbWF4OmF9PXQuZ3JvdXBzOyhyfHxhKSYmKHRoaXMucmFuZ2U9WytyLCthXSl9fWdldCBjb21wdXRlZFJhbmdlKCl7cmV0dXJuIHRoaXMucmFuZ2U/dGhpcy5yYW5nZToiPHBlcmNlbnRhZ2U+Ij09PXRoaXMudHlwZT90aGlzLnBlcmNlbnRhZ2VSYW5nZSgpOiI8YW5nbGU+Ij09PXRoaXMudHlwZT9bMCwzNjBdOm51bGx9Z2V0IHVuaXQoKXtyZXR1cm4iPHBlcmNlbnRhZ2U+Ij09PXRoaXMudHlwZT8iJSI6IjxhbmdsZT4iPT09dGhpcy50eXBlPyJkZWciOiIifXJlc29sdmUoZSl7aWYoIjxhbmdsZT4iPT09dGhpcy50eXBlKXJldHVybiBlO2xldCB0PXRoaXMuY29tcHV0ZWRSYW5nZSxyPXRoaXMuY29vcmRSYW5nZTtyZXR1cm4iPHBlcmNlbnRhZ2U+Ij09PXRoaXMudHlwZSYmKG51bGwhPXJ8fChyPXRoaXMucGVyY2VudGFnZVJhbmdlKCkpKSx1KHQscixlKX1zZXJpYWxpemUoZSx0KXtsZXQgcj0iPHBlcmNlbnRhZ2U+Ij09PXRoaXMudHlwZT90aGlzLnBlcmNlbnRhZ2VSYW5nZSgxMDApOnRoaXMuY29tcHV0ZWRSYW5nZSxhPXRoaXMudW5pdDtyZXR1cm4gZnVuY3Rpb24oZSx7cHJlY2lzaW9uOnQ9MTYsdW5pdDpyfSl7cmV0dXJuIGkoZSk/Im5vbmUiOihlPStsKGUsdCkpKyhudWxsIT1yP3I6IiIpfShlPXUodGhpcy5jb29yZFJhbmdlLHIsZSkse3VuaXQ6YSxwcmVjaXNpb246dH0pfXRvU3RyaW5nKCl7bGV0IGU9dGhpcy50eXBlO2lmKHRoaXMucmFuZ2Upe2xldFt0PSIiLHI9IiJdPXRoaXMucmFuZ2U7ZSs9YFske3R9LCR7cn1dYH1yZXR1cm4gZX1wZXJjZW50YWdlUmFuZ2UoZT0xKXtsZXQgdDtyZXR1cm4gdD10aGlzLmNvb3JkTWV0YSYmdGhpcy5jb29yZE1ldGEucmFuZ2V8fHRoaXMuY29vcmRSYW5nZSYmdGhpcy5jb29yZFJhbmdlWzBdPj0wP1swLDFdOlstMSwxXSxbdFswXSplLHRbMV0qZV19c3RhdGljIGdldChlLHQpe3JldHVybiBtKGUsdGhpcyk/ZTpuZXcgdGhpcyhlLHQpfX1jb25zdCBiPVN5bWJvbCgiaW5zdGFuY2UiKTtjbGFzcyBNe2NvbnN0cnVjdG9yKGUsdD1lLnNwYWNlKXtfX3B1YmxpY0ZpZWxkKHRoaXMsInR5cGUiKSxfX3B1YmxpY0ZpZWxkKHRoaXMsIm5hbWUiKSxfX3B1YmxpY0ZpZWxkKHRoaXMsInNwYWNlQ29vcmRzIiksX19wdWJsaWNGaWVsZCh0aGlzLCJjb29yZHMiKSxfX3B1YmxpY0ZpZWxkKHRoaXMsImlkIiksX19wdWJsaWNGaWVsZCh0aGlzLCJhbHBoYSIpLGVbYl09dGhpcyx0aGlzLnR5cGU9ImZ1bmN0aW9uIix0aGlzLm5hbWU9ImNvbG9yIixPYmplY3QuYXNzaWduKHRoaXMsZSksdGhpcy5zcGFjZT10LCJjdXN0b20iIT09dGhpcy50eXBlJiYodGhpcy5zcGFjZUNvb3Jkcz1PYmplY3QudmFsdWVzKHQuY29vcmRzKSx0aGlzLmNvb3Jkc3x8KHRoaXMuY29vcmRzPXRoaXMuc3BhY2VDb29yZHMubWFwKGU9PntsZXQgdD1bIjxudW1iZXI+IiwiPHBlcmNlbnRhZ2U+Il07cmV0dXJuImFuZ2xlIj09PWUudHlwZSYmdC5wdXNoKCI8YW5nbGU+IiksdH0pKSx0aGlzLmNvb3Jkcz10aGlzLmNvb3Jkcy5tYXAoKGUsdCk9PntsZXQgcj10aGlzLnNwYWNlQ29vcmRzW3RdO3JldHVybiJzdHJpbmciPT10eXBlb2YgZSYmKGU9ZS50cmltKCkuc3BsaXQoL1xzKlx8XHMqLykpLGUubWFwKGU9PmcuZ2V0KGUscikpfSkpfXNlcmlhbGl6ZUNvb3JkcyhlLHQscil7cmV0dXJuIHI9ZS5tYXAoKGUsdCk9Pnt2YXIgYTtyZXR1cm4gZy5nZXQobnVsbCE9KGE9bnVsbD09cj92b2lkIDA6clt0XSk/YTp0aGlzLmNvb3Jkc1t0XVswXSx0aGlzLnNwYWNlQ29vcmRzW3RdKX0pLGUubWFwKChlLGEpPT5yW2FdLnNlcmlhbGl6ZShlLHQpKX1jb2VyY2VDb29yZHMoZSx0KXtyZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5zcGFjZS5jb29yZHMpLm1hcCgoW3IsYV0sbik9Pnt2YXIgbztsZXQgcz1lW25dO2lmKGkocyl8fGlzTmFOKHMpKXJldHVybiBzO2xldCBsPXRbbl0sYz10aGlzLmNvb3Jkc1tuXS5maW5kKGU9PmUudHlwZT09bCk7aWYoIWMpe2xldCBlPWEubmFtZXx8cjt0aHJvdyBuZXcgVHlwZUVycm9yKGAke251bGwhPShvPW51bGwhPWw/bDpudWxsPT1zP3ZvaWQgMDpzLnJhdyk/bzpzfSBub3QgYWxsb3dlZCBmb3IgJHtlfSBpbiAke3RoaXMubmFtZX0oKWApfXJldHVybiBzPWMucmVzb2x2ZShzKSxjLnJhbmdlJiYodFtuXT1jLnRvU3RyaW5nKCkpLHN9KX1jYW5TZXJpYWxpemUoKXtyZXR1cm4iZnVuY3Rpb24iPT09dGhpcy50eXBlfHx0aGlzLnNlcmlhbGl6ZX1wYXJzZShlKXtyZXR1cm4gbnVsbH1zdGF0aWMgZ2V0KGUsLi4udCl7cmV0dXJuIWV8fG0oZSx0aGlzKT9lOmVbYl0/ZVtiXTpuZXcgTShlLC4uLnQpfX1jb25zdCB5PW5ldyBjbGFzc3thZGQoZSx0LHIpe2lmKCJzdHJpbmciPT10eXBlb2YgYXJndW1lbnRzWzBdKShBcnJheS5pc0FycmF5KGUpP2U6W2VdKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3RoaXNbZV09dGhpc1tlXXx8W10sdCYmdGhpc1tlXVtyPyJ1bnNoaWZ0IjoicHVzaCJdKHQpfSx0aGlzKTtlbHNlIGZvcih2YXIgZSBpbiBhcmd1bWVudHNbMF0pdGhpcy5hZGQoZSxhcmd1bWVudHNbMF1bZV0sYXJndW1lbnRzWzFdKX1ydW4oZSx0KXt0aGlzW2VdPXRoaXNbZV18fFtdLHRoaXNbZV0uZm9yRWFjaChmdW5jdGlvbihlKXtlLmNhbGwodCYmdC5jb250ZXh0P3QuY29udGV4dDp0LHQpfSl9fSx4PXtENTA6Wy4zNDU3Ly4zNTg1LDEsLjI5NTgvLjM1ODVdLEQ2NTpbLjMxMjcvLjMyOSwxLC4zNTgzLy4zMjldfTtmdW5jdGlvbiB3KGUpe3JldHVybiBBcnJheS5pc0FycmF5KGUpP2U6eFtlXX1mdW5jdGlvbiB2KGUsdCxyLGE9e30pe2lmKGU9dyhlKSx0PXcodCksIWV8fCF0KXRocm93IG5ldyBUeXBlRXJyb3IoYE1pc3Npbmcgd2hpdGUgcG9pbnQgdG8gY29udmVydCAke2U/IiI6ImZyb20ifSR7ZXx8dD8iIjoiLyJ9JHt0PyIiOiJ0byJ9YCk7aWYoZT09PXQpcmV0dXJuIHI7bGV0IG89e1cxOmUsVzI6dCxYWVo6cixvcHRpb25zOmF9O2lmKHkucnVuKCJjaHJvbWF0aWMtYWRhcHRhdGlvbi1zdGFydCIsbyksby5NfHwoby5XMT09PXguRDY1JiZvLlcyPT09eC5ENTA/by5NPVtbMS4wNDc5Mjk3OTI1NDQ5OTY5LC4wMjI5NDY4NzA2MDE2MDk2NTIsLS4wNTAxOTIyNjYyODkyMDUyNF0sWy4wMjk2Mjc4MDg3NzAwNTU5OSwuOTkwNDM0NDI2NzUzODc5OSwtLjAxNzA3Mzc5OTA2MzQxODgyNl0sWy0uMDA5MjQzMDQwNjQ2MjA0NTA0LC4wMTUwNTUxOTE0OTAyOTgxNTIsLjc1MTg3NDI4MTQyODEzNzFdXTpvLlcxPT09eC5ENTAmJm8uVzI9PT14LkQ2NSYmKG8uTT1bWy45NTU0NzM0MjE0ODgwNzUsLS4wMjMwOTg0NTQ5NDg3NjQ3MSwuMDYzMjU5MjQzMjAwNTcwNzJdLFstLjAyODM2OTcwOTMzMzg2MzcsMS4wMDk5OTUzOTgwODEzMDQxLC4wMjEwNDE0NDExOTE5MTczMjNdLFsuMDEyMzE0MDE0ODY0NDgxOTk4LC0uMDIwNTA3NjQ5Mjk4ODk4OTY0LDEuMzMwMzY1OTI2MjQyMTI0XV0pKSx5LnJ1bigiY2hyb21hdGljLWFkYXB0YXRpb24tZW5kIixvKSxvLk0pcmV0dXJuIG4oby5YWVosby5NKTt0aHJvdyBuZXcgVHlwZUVycm9yKCJPbmx5IEJyYWRmb3JkIENBVCB3aXRoIHdoaXRlIHBvaW50cyBENTAgYW5kIEQ2NSBzdXBwb3J0ZWQgZm9yIG5vdy4iKX12YXIgST17Z2FtdXRfbWFwcGluZzoiY3NzIixwcmVjaXNpb246NSxkZWx0YUU6Ijc2Iix2ZXJib3NlOiJ0ZXN0IiE9PShudWxsPT0ocj1udWxsPT0odD1udWxsPT0oZT1udWxsPT1nbG9iYWxUaGlzP3ZvaWQgMDpnbG9iYWxUaGlzLnByb2Nlc3MpP3ZvaWQgMDplLmVudik/dm9pZCAwOnQuTk9ERV9FTlYpP3ZvaWQgMDpyLnRvTG93ZXJDYXNlKCkpLHdhcm46ZnVuY3Rpb24oZSl7dmFyIHQscjt0aGlzLnZlcmJvc2UmJihudWxsPT0ocj1udWxsPT0odD1udWxsPT1nbG9iYWxUaGlzP3ZvaWQgMDpnbG9iYWxUaGlzLmNvbnNvbGUpP3ZvaWQgMDp0Lndhcm4pfHxyLmNhbGwodCxlKSl9fTtjb25zdCBCPXsiJSI6LjAxLGRlZzoxLGdyYWQ6LjkscmFkOjE4MC9NYXRoLlBJLHR1cm46MzYwfSxSPXtmdW5jdGlvbjovXihbYS16XSspXCgoKD86Y2FsY1woTmFOXCl8LikrPylcKSQvaSxudW1iZXI6L14oWy0rXT8oPzpbMC05XSpcLik/WzAtOV0rKGVbLStdP1swLTldKyk/KSQvaSx1bml0VmFsdWU6UmVnRXhwKGAoJHtPYmplY3Qua2V5cyhCKS5qb2luKCJ8Iil9KSRgKSxzaW5nbGVBcmd1bWVudDovXC8/XHMqKG5vbmV8TmFOfGNhbGNcKE5hTlwpfFstK1x3Ll0rKD86JXxkZWd8Zz9yYWR8dHVybik/KS9nfTtmdW5jdGlvbiBrKGUsdCl7aWYoQXJyYXkuaXNBcnJheShlKSlyZXR1cm4gZS5tYXAoZT0+ayhlLHQpKTtpZighZSl0aHJvdyBuZXcgVHlwZUVycm9yKCJFbXB0eSBjb2xvciByZWZlcmVuY2UiKTtvKGUpJiYoZT1mdW5jdGlvbihlLHQpe3ZhciByLGEsbixvO2xldCBzLGw9e3N0cjpudWxsPT0ocj1TdHJpbmcoZSkpP3ZvaWQgMDpyLnRyaW0oKSxvcHRpb25zOnR9O2lmKHkucnVuKCJwYXJzZS1zdGFydCIsbCksbC5jb2xvcilyZXR1cm4gbC5jb2xvcjtsLnBhcnNlZD1mdW5jdGlvbihlKXtpZighZSlyZXR1cm47bGV0IHQ9KGU9ZS50cmltKCkpLm1hdGNoKFIuZnVuY3Rpb24pO2lmKHQpe2xldCBlPVtdLHI9W10sYT0hMSxuPXRbMV0udG9Mb3dlckNhc2UoKSxvPXRbMl0ucmVwbGFjZShSLnNpbmdsZUFyZ3VtZW50LCh0LG8pPT57bGV0e3ZhbHVlOnMsbWV0YTppfT1mdW5jdGlvbihlKXt2YXIgdDtsZXQgcj17fSxhPW51bGw9PSh0PWUubWF0Y2goUi51bml0VmFsdWUpKT92b2lkIDA6dFswXSxuPXIucmF3PWU7cmV0dXJuIGE/KHIudHlwZT0iJSI9PT1hPyI8cGVyY2VudGFnZT4iOiI8YW5nbGU+IixyLnVuaXQ9YSxyLnVuaXRsZXNzPU51bWJlcihuLnNsaWNlKDAsLWEubGVuZ3RoKSksbj1yLnVuaXRsZXNzKkJbYV0pOlIubnVtYmVyLnRlc3Qobik/KG49TnVtYmVyKG4pLHIudHlwZT0iPG51bWJlcj4iKToibm9uZSI9PT1uP249bnVsbDoiTmFOIj09PW58fCJjYWxjKE5hTikiPT09bj8obj1OYU4sci50eXBlPSI8bnVtYmVyPiIpOnIudHlwZT0iPGlkZW50PiIse3ZhbHVlOm4sbWV0YTpyfX0obyk7cmV0dXJuKHQuc3RhcnRzV2l0aCgiLyIpfHwiY29sb3IiIT09biYmMz09PWUubGVuZ3RoKSYmKGE9ITApLGUucHVzaChzKSxyLnB1c2goaSksIiJ9KTtyZXR1cm57bmFtZTpuLGFyZ3M6ZSxhcmdNZXRhOnIsbGFzdEFscGhhOmEsY29tbWFzOm8uaW5jbHVkZXMoIiwiKSxyYXdOYW1lOnRbMV0scmF3QXJnczp0WzJdfX19KGwuc3RyKTtsZXQgYz1sLm9wdGlvbnM/bnVsbCE9KGE9bC5vcHRpb25zLnBhcnNlTWV0YSk/YTpsLm9wdGlvbnMubWV0YTpudWxsO2lmKGwucGFyc2VkKXtsZXQgdCxyLGE9bC5wYXJzZWQubmFtZSxpPWwucGFyc2VkLmFyZ3MsdT1pLm1hcCgoZSx0KT0+e3ZhciByO3JldHVybiBudWxsPT0ocj1sLnBhcnNlZC5hcmdNZXRhW3RdKT92b2lkIDA6ci50eXBlfSk7aWYoImNvbG9yIj09PWEpe2xldCBzPWkuc2hpZnQoKTt1LnNoaWZ0KCk7bGV0IGM9cy5zdGFydHNXaXRoKCItLSIpP3Muc3Vic3RyaW5nKDIpOmAtLSR7c31gLGg9W3MsY107aWYodD1fLmZpbmRGb3JtYXQoe25hbWU6YSxpZDpoLHR5cGU6ImZ1bmN0aW9uIn0pLCF0KXtsZXQgdCxyPXMgaW4gXy5yZWdpc3RyeT9zOmM7aWYociBpbiBfLnJlZ2lzdHJ5KXtsZXQgYT1udWxsPT0obz1udWxsPT0obj1fLnJlZ2lzdHJ5W3JdLmZvcm1hdHMpP3ZvaWQgMDpuLmNvbG9yKT92b2lkIDA6by5pZDthJiYodD1gRGlkIHlvdSBtZWFuICR7ZS5yZXBsYWNlKCJjb2xvcigiK3MsImNvbG9yKCIrYSl9P2ApfXRocm93IG5ldyBUeXBlRXJyb3IoYENhbm5vdCBwYXJzZSAke2wuc3RyfS4gYCsobnVsbCE9dD90OiJNaXNzaW5nIGEgcGx1Z2luPyIpKX1yPXQuc3BhY2UsdC5pZC5zdGFydHNXaXRoKCItLSIpJiYhcy5zdGFydHNXaXRoKCItLSIpJiZJLndhcm4oYCR7ci5uYW1lfSBpcyBhIG5vbi1zdGFuZGFyZCBzcGFjZSBhbmQgbm90IGN1cnJlbnRseSBzdXBwb3J0ZWQgaW4gdGhlIENTUyBzcGVjLiBVc2UgcHJlZml4ZWQgY29sb3IoJHt0LmlkfSkgaW5zdGVhZCBvZiBjb2xvcigke3N9KS5gKSxzLnN0YXJ0c1dpdGgoIi0tIikmJiF0LmlkLnN0YXJ0c1dpdGgoIi0tIikmJkkud2FybihgJHtyLm5hbWV9IGlzIGEgc3RhbmRhcmQgc3BhY2UgYW5kIHN1cHBvcnRlZCBpbiB0aGUgQ1NTIHNwZWMuIFVzZSBjb2xvcigke3QuaWR9KSBpbnN0ZWFkIG9mIHByZWZpeGVkIGNvbG9yKCR7c30pLmApfWVsc2UgdD1fLmZpbmRGb3JtYXQoe25hbWU6YSx0eXBlOiJmdW5jdGlvbiJ9KSxyPXQuc3BhY2U7YyYmT2JqZWN0LmFzc2lnbihjLHtmb3JtYXQ6dCxmb3JtYXRJZDp0Lm5hbWUsdHlwZXM6dSxjb21tYXM6bC5wYXJzZWQuY29tbWFzfSk7bGV0IGg9MTtsLnBhcnNlZC5sYXN0QWxwaGEmJihoPWwucGFyc2VkLmFyZ3MucG9wKCksYyYmKGMuYWxwaGFUeXBlPXUucG9wKCkpKTtsZXQgZD10LmNvb3Jkcy5sZW5ndGg7aWYoaS5sZW5ndGghPT1kKXRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkICR7ZH0gY29vcmRpbmF0ZXMgZm9yICR7ci5pZH0gaW4gJHtsLnN0cn0pLCBnb3QgJHtpLmxlbmd0aH1gKTtpPXQuY29lcmNlQ29vcmRzKGksdSkscz17c3BhY2VJZDpyLmlkLGNvb3JkczppLGFscGhhOmh9fWVsc2UgZTpmb3IobGV0IGkgb2YgXy5hbGwpZm9yKGxldCBlIGluIGkuZm9ybWF0cyl7bGV0IHQ9aS5mb3JtYXRzW2VdO2lmKCJjdXN0b20iIT09dC50eXBlKWNvbnRpbnVlO2lmKHQudGVzdCYmIXQudGVzdChsLnN0cikpY29udGludWU7bGV0IHI9aS5nZXRGb3JtYXQodCksYT1yLnBhcnNlKGwuc3RyKTtpZihhKXtjJiZPYmplY3QuYXNzaWduKGMse2Zvcm1hdDpyLGZvcm1hdElkOmV9KSxzPWE7YnJlYWsgZX19aWYoIXMpdGhyb3cgbmV3IFR5cGVFcnJvcihgQ291bGQgbm90IHBhcnNlICR7ZX0gYXMgYSBjb2xvci4gTWlzc2luZyBhIHBsdWdpbj9gKTtyZXR1cm4gcy5hbHBoYT1pKHMuYWxwaGEpP3MuYWxwaGE6dm9pZCAwPT09cy5hbHBoYT8xOmgoMCxzLmFscGhhLDEpLHN9KGUsdCkpO2xldCByPWUuc3BhY2V8fGUuc3BhY2VJZDtyZXR1cm4ic3RyaW5nIj09dHlwZW9mIHImJihlLnNwYWNlPV8uZ2V0KHIpKSx2b2lkIDA9PT1lLmFscGhhJiYoZS5hbHBoYT0xKSxlfWNvbnN0IEM9Y2xhc3MgZXtjb25zdHJ1Y3Rvcih0KXt2YXIgcixhLG4sbyxzLGk7dGhpcy5pZD10LmlkLHRoaXMubmFtZT10Lm5hbWUsdGhpcy5iYXNlPXQuYmFzZT9lLmdldCh0LmJhc2UpOm51bGwsdGhpcy5hbGlhc2VzPXQuYWxpYXNlcyx0aGlzLmJhc2UmJih0aGlzLmZyb21CYXNlPXQuZnJvbUJhc2UsdGhpcy50b0Jhc2U9dC50b0Jhc2UpO2xldCBsPW51bGwhPShyPXQuY29vcmRzKT9yOnRoaXMuYmFzZS5jb29yZHM7Zm9yKGxldCBlIGluIGwpIm5hbWUiaW4gbFtlXXx8KGxbZV0ubmFtZT1lKTt0aGlzLmNvb3Jkcz1sO2xldCBjPW51bGwhPShuPW51bGwhPShhPXQud2hpdGUpP2E6dGhpcy5iYXNlLndoaXRlKT9uOiJENjUiO3RoaXMud2hpdGU9dyhjKSx0aGlzLmZvcm1hdHM9bnVsbCE9KG89dC5mb3JtYXRzKT9vOnt9O2ZvcihsZXQgZSBpbiB0aGlzLmZvcm1hdHMpe2xldCB0PXRoaXMuZm9ybWF0c1tlXTt0LnR5cGV8fCh0LnR5cGU9ImZ1bmN0aW9uIiksdC5uYW1lfHwodC5uYW1lPWUpfShudWxsPT0ocz10aGlzLmZvcm1hdHMuY29sb3IpP3ZvaWQgMDpzLmlkKXx8KHRoaXMuZm9ybWF0cy5jb2xvcj17Li4ubnVsbCE9KGk9dGhpcy5mb3JtYXRzLmNvbG9yKT9pOnt9LGlkOnQuY3NzSWR8fHRoaXMuaWR9KSx0LmdhbXV0U3BhY2U/dGhpcy5nYW11dFNwYWNlPSJzZWxmIj09PXQuZ2FtdXRTcGFjZT90aGlzOmUuZ2V0KHQuZ2FtdXRTcGFjZSk6dGhpcy5pc1BvbGFyP3RoaXMuZ2FtdXRTcGFjZT10aGlzLmJhc2U6dGhpcy5nYW11dFNwYWNlPXRoaXMsdGhpcy5nYW11dFNwYWNlLmlzVW5ib3VuZGVkJiYodGhpcy5pbkdhbXV0PShlLHQpPT4hMCksdGhpcy5yZWZlcnJlZD10LnJlZmVycmVkLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJwYXRoIix7dmFsdWU6eih0aGlzKS5yZXZlcnNlKCksd3JpdGFibGU6ITEsZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITB9KSx5LnJ1bigiY29sb3JzcGFjZS1pbml0LWVuZCIsdGhpcyl9aW5HYW11dChlLHtlcHNpbG9uOnQ9NzVlLTZ9PXt9KXtpZighdGhpcy5lcXVhbHModGhpcy5nYW11dFNwYWNlKSlyZXR1cm4gZT10aGlzLnRvKHRoaXMuZ2FtdXRTcGFjZSxlKSx0aGlzLmdhbXV0U3BhY2UuaW5HYW11dChlLHtlcHNpbG9uOnR9KTtsZXQgcj1PYmplY3QudmFsdWVzKHRoaXMuY29vcmRzKTtyZXR1cm4gZS5ldmVyeSgoZSxhKT0+e2xldCBuPXJbYV07aWYoImFuZ2xlIiE9PW4udHlwZSYmbi5yYW5nZSl7aWYoaShlKSlyZXR1cm4hMDtsZXRbcixhXT1uLnJhbmdlO3JldHVybih2b2lkIDA9PT1yfHxlPj1yLXQpJiYodm9pZCAwPT09YXx8ZTw9YSt0KX1yZXR1cm4hMH0pfWdldCBpc1VuYm91bmRlZCgpe3JldHVybiBPYmplY3QudmFsdWVzKHRoaXMuY29vcmRzKS5ldmVyeShlPT4hKCJyYW5nZSJpbiBlKSl9Z2V0IGNzc0lkKCl7dmFyIGUsdDtyZXR1cm4obnVsbD09KHQ9bnVsbD09KGU9dGhpcy5mb3JtYXRzKT92b2lkIDA6ZS5jb2xvcik/dm9pZCAwOnQuaWQpfHx0aGlzLmlkfWdldCBpc1BvbGFyKCl7Zm9yKGxldCBlIGluIHRoaXMuY29vcmRzKWlmKCJhbmdsZSI9PT10aGlzLmNvb3Jkc1tlXS50eXBlKXJldHVybiEwO3JldHVybiExfWdldEZvcm1hdChlKXtpZighZSlyZXR1cm4gbnVsbDsiZGVmYXVsdCI9PT1lP2U9T2JqZWN0LnZhbHVlcyh0aGlzLmZvcm1hdHMpWzBdOiJzdHJpbmciPT10eXBlb2YgZSYmKGU9dGhpcy5mb3JtYXRzW2VdKTtsZXQgdD1NLmdldChlLHRoaXMpO3JldHVybiB0IT09ZSYmZS5uYW1lIGluIHRoaXMuZm9ybWF0cyYmKHRoaXMuZm9ybWF0c1tlLm5hbWVdPXQpLHR9ZXF1YWxzKGUpe3JldHVybiEhZSYmKHRoaXM9PT1lfHx0aGlzLmlkPT09ZXx8dGhpcy5pZD09PWUuaWQpfXRvKHQscil7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgpe2NvbnN0IGU9ayh0KTtbdCxyXT1bZS5zcGFjZSxlLmNvb3Jkc119aWYodD1lLmdldCh0KSx0aGlzLmVxdWFscyh0KSlyZXR1cm4gcjtyPXIubWFwKGU9PmkoZSk/MDplKTtsZXQgYSxuLG89dGhpcy5wYXRoLHM9dC5wYXRoO2ZvcihsZXQgZT0wO2U8by5sZW5ndGgmJm9bZV0uZXF1YWxzKHNbZV0pO2UrKylhPW9bZV0sbj1lO2lmKCFhKXRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNvbnZlcnQgYmV0d2VlbiBjb2xvciBzcGFjZXMgJHt0aGlzfSBhbmQgJHt0fTogbm8gY29ubmVjdGlvbiBzcGFjZSB3YXMgZm91bmRgKTtmb3IobGV0IGU9by5sZW5ndGgtMTtlPm47ZS0tKXI9b1tlXS50b0Jhc2Uocik7Zm9yKGxldCBlPW4rMTtlPHMubGVuZ3RoO2UrKylyPXNbZV0uZnJvbUJhc2Uocik7cmV0dXJuIHJ9ZnJvbSh0LHIpe2lmKDE9PT1hcmd1bWVudHMubGVuZ3RoKXtjb25zdCBlPWsodCk7W3Qscl09W2Uuc3BhY2UsZS5jb29yZHNdfXJldHVybih0PWUuZ2V0KHQpKS50byh0aGlzLHIpfXRvU3RyaW5nKCl7cmV0dXJuYCR7dGhpcy5uYW1lfSAoJHt0aGlzLmlkfSlgfWdldE1pbkNvb3Jkcygpe3ZhciBlO2xldCB0PVtdO2ZvcihsZXQgciBpbiB0aGlzLmNvb3Jkcyl7bGV0IGE9dGhpcy5jb29yZHNbcl0sbj1hLnJhbmdlfHxhLnJlZlJhbmdlO3QucHVzaChudWxsIT0oZT1udWxsPT1uP3ZvaWQgMDpuLm1pbik/ZTowKX1yZXR1cm4gdH1zdGF0aWMgZ2V0IGFsbCgpe3JldHVyblsuLi5uZXcgU2V0KE9iamVjdC52YWx1ZXMoZS5yZWdpc3RyeSkpXX1zdGF0aWMgcmVnaXN0ZXIoZSx0KXtpZigxPT09YXJndW1lbnRzLmxlbmd0aCYmKGU9KHQ9YXJndW1lbnRzWzBdKS5pZCksdD10aGlzLmdldCh0KSx0aGlzLnJlZ2lzdHJ5W2VdJiZ0aGlzLnJlZ2lzdHJ5W2VdIT09dCl0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZSBjb2xvciBzcGFjZSByZWdpc3RyYXRpb246ICcke2V9J2ApO2lmKHRoaXMucmVnaXN0cnlbZV09dCwxPT09YXJndW1lbnRzLmxlbmd0aCYmdC5hbGlhc2VzKWZvcihsZXQgciBvZiB0LmFsaWFzZXMpdGhpcy5yZWdpc3RlcihyLHQpO3JldHVybiB0fXN0YXRpYyBnZXQodCwuLi5yKXtpZighdHx8bSh0LHRoaXMpKXJldHVybiB0O2lmKCJzdHJpbmciPT09cyh0KSl7bGV0IHI9ZS5yZWdpc3RyeVt0LnRvTG93ZXJDYXNlKCldO2lmKCFyKXRocm93IG5ldyBUeXBlRXJyb3IoYE5vIGNvbG9yIHNwYWNlIGZvdW5kIHdpdGggaWQgPSAiJHt0fSJgKTtyZXR1cm4gcn1pZihyLmxlbmd0aClyZXR1cm4gZS5nZXQoLi4ucik7dGhyb3cgbmV3IFR5cGVFcnJvcihgJHt0fSBpcyBub3QgYSB2YWxpZCBjb2xvciBzcGFjZWApfXN0YXRpYyBmaW5kRm9ybWF0KHQscj1lLmFsbCl7aWYoIXQpcmV0dXJuIG51bGw7InN0cmluZyI9PXR5cGVvZiB0JiYodD17bmFtZTp0fSk7Zm9yKGxldCBlIG9mIHIpZm9yKGxldFtyLGFdb2YgT2JqZWN0LmVudHJpZXMoZS5mb3JtYXRzKSl7bnVsbCE9YS5uYW1lfHwoYS5uYW1lPXIpLG51bGwhPWEudHlwZXx8KGEudHlwZT0iZnVuY3Rpb24iKTtsZXQgbj0hKHQubmFtZSYmYS5uYW1lIT09dC5uYW1lfHx0LnR5cGUmJmEudHlwZSE9PXQudHlwZSk7aWYodC5pZCl7bGV0IGU9YS5pZHN8fFthLmlkXSxyPUFycmF5LmlzQXJyYXkodC5pZCk/dC5pZDpbdC5pZF07biYmKG49ci5zb21lKHQ9PmUuaW5jbHVkZXModCkpKX1pZihuKXtsZXQgdD1NLmdldChhLGUpO3JldHVybiB0IT09YSYmKGUuZm9ybWF0c1thLm5hbWVdPXQpLHR9fXJldHVybiBudWxsfXN0YXRpYyByZXNvbHZlQ29vcmQodCxyKXt2YXIgYTtsZXQgbixvLGk9cyh0KTtpZigic3RyaW5nIj09PWk/dC5pbmNsdWRlcygiLiIpP1tuLG9dPXQuc3BsaXQoIi4iKTpbbixvXT1bLHRdOkFycmF5LmlzQXJyYXkodCk/W24sb109dDoobj10LnNwYWNlLG89dC5jb29yZElkKSxuPWUuZ2V0KG4pLG58fChuPXIpLCFuKXRocm93IG5ldyBUeXBlRXJyb3IoYENhbm5vdCByZXNvbHZlIGNvb3JkaW5hdGUgcmVmZXJlbmNlICR7dH06IE5vIGNvbG9yIHNwYWNlIHNwZWNpZmllZCBhbmQgcmVsYXRpdmUgcmVmZXJlbmNlcyBhcmUgbm90IGFsbG93ZWQgaGVyZWApO2lmKGk9cyhvKSwibnVtYmVyIj09PWl8fCJzdHJpbmciPT09aSYmbz49MCl7bGV0IGU9T2JqZWN0LmVudHJpZXMobi5jb29yZHMpW29dO2lmKGUpcmV0dXJue3NwYWNlOm4saWQ6ZVswXSxpbmRleDpvLC4uLmVbMV19fW49ZS5nZXQobik7bGV0IGw9by50b0xvd2VyQ2FzZSgpLGM9MDtmb3IobGV0IGUgaW4gbi5jb29yZHMpe2xldCB0PW4uY29vcmRzW2VdO2lmKGUudG9Mb3dlckNhc2UoKT09PWx8fChudWxsPT0oYT10Lm5hbWUpP3ZvaWQgMDphLnRvTG93ZXJDYXNlKCkpPT09bClyZXR1cm57c3BhY2U6bixpZDplLGluZGV4OmMsLi4udH07YysrfXRocm93IG5ldyBUeXBlRXJyb3IoYE5vICIke299IiBjb29yZGluYXRlIGZvdW5kIGluICR7bi5uYW1lfS4gSXRzIGNvb3JkaW5hdGVzIGFyZTogJHtPYmplY3Qua2V5cyhuLmNvb3Jkcykuam9pbigiLCAiKX1gKX19O19fcHVibGljRmllbGQoQywicmVnaXN0cnkiLHt9KSxfX3B1YmxpY0ZpZWxkKEMsIkRFRkFVTFRfRk9STUFUIix7dHlwZToiZnVuY3Rpb25zIixuYW1lOiJjb2xvciJ9KTtsZXQgXz1DO2Z1bmN0aW9uIHooZSl7bGV0IHQ9W2VdO2ZvcihsZXQgcj1lO3I9ci5iYXNlOyl0LnB1c2gocik7cmV0dXJuIHR9dmFyIFc9bmV3IF8oe2lkOiJ4eXotZDY1IixuYW1lOiJYWVogRDY1Iixjb29yZHM6e3g6e3JlZlJhbmdlOlswLDFdLG5hbWU6IlgifSx5OntyZWZSYW5nZTpbMCwxXSxuYW1lOiJZIn0sejp7cmVmUmFuZ2U6WzAsMV0sbmFtZToiWiJ9fSx3aGl0ZToiRDY1Iixmb3JtYXRzOntjb2xvcjp7aWRzOlsieHl6LWQ2NSIsInh5eiJdfX0sYWxpYXNlczpbInh5eiJdfSk7Y2xhc3MgRSBleHRlbmRzIF97Y29uc3RydWN0b3IoZSl7ZS5jb29yZHN8fChlLmNvb3Jkcz17cjp7cmFuZ2U6WzAsMV0sbmFtZToiUmVkIn0sZzp7cmFuZ2U6WzAsMV0sbmFtZToiR3JlZW4ifSxiOntyYW5nZTpbMCwxXSxuYW1lOiJCbHVlIn19KSxlLmJhc2V8fChlLmJhc2U9VyksZS50b1hZWl9NJiZlLmZyb21YWVpfTSYmKG51bGwhPWUudG9CYXNlfHwoZS50b0Jhc2U9dD0+e2xldCByPW4odCxlLnRvWFlaX00pO3JldHVybiB0aGlzLndoaXRlIT09dGhpcy5iYXNlLndoaXRlJiYocj12KHRoaXMud2hpdGUsdGhpcy5iYXNlLndoaXRlLHIpKSxyfSksbnVsbCE9ZS5mcm9tQmFzZXx8KGUuZnJvbUJhc2U9dD0+bih0PXYodGhpcy5iYXNlLndoaXRlLHRoaXMud2hpdGUsdCksZS5mcm9tWFlaX00pKSksbnVsbCE9ZS5yZWZlcnJlZHx8KGUucmVmZXJyZWQ9ImRpc3BsYXkiKSxzdXBlcihlKX19ZnVuY3Rpb24gUyhlLHQpe2U9ayhlKTtsZXQgcixhPV8uZ2V0KHQsbnVsbD09dD92b2lkIDA6dC5zcGFjZSksbj1udWxsPT10P3ZvaWQgMDp0LnByZWNpc2lvbjtyZXR1cm4gcj0hYXx8ZS5zcGFjZS5lcXVhbHMoYSk/ZS5jb29yZHMuc2xpY2UoKTphLmZyb20oZSksdm9pZCAwPT09bj9yOnIubWFwKGU9PmwoZSxuKSl9ZnVuY3Rpb24gJChlLHQpe3ZhciByO2lmKGU9ayhlKSwiYWxwaGEiPT09dClyZXR1cm4gbnVsbCE9KHI9ZS5hbHBoYSk/cjoxO2xldHtzcGFjZTphLGluZGV4Om59PV8ucmVzb2x2ZUNvb3JkKHQsZS5zcGFjZSk7cmV0dXJuIFMoZSxhKVtuXX1mdW5jdGlvbiBqKGUsdCxyLGEpe3JldHVybiBlPWsoZSksQXJyYXkuaXNBcnJheSh0KSYmKFt0LHIsYV09W2Uuc3BhY2UsdCxyXSksdD1fLmdldCh0KSxlLmNvb3Jkcz10PT09ZS5zcGFjZT9yLnNsaWNlKCk6dC50byhlLnNwYWNlLHIpLHZvaWQgMCE9PWEmJihlLmFscGhhPWEpLGV9ZnVuY3Rpb24gcShlLHQscil7aWYoZT1rKGUpLDI9PT1hcmd1bWVudHMubGVuZ3RoJiYib2JqZWN0Ij09PXMoYXJndW1lbnRzWzFdKSl7bGV0IHQ9YXJndW1lbnRzWzFdO2ZvcihsZXQgciBpbiB0KXEoZSxyLHRbcl0pfWVsc2UgaWYoImZ1bmN0aW9uIj09dHlwZW9mIHImJihyPXIoJChlLHQpKSksImFscGhhIj09PXQpZS5hbHBoYT1yO2Vsc2V7bGV0e3NwYWNlOmEsaW5kZXg6bn09Xy5yZXNvbHZlQ29vcmQodCxlLnNwYWNlKSxvPVMoZSxhKTtvW25dPXIsaihlLGEsbyl9cmV0dXJuIGV9ai5yZXR1cm5zPSJjb2xvciIscS5yZXR1cm5zPSJjb2xvciI7dmFyIFA9bmV3IF8oe2lkOiJ4eXotZDUwIixuYW1lOiJYWVogRDUwIix3aGl0ZToiRDUwIixiYXNlOlcsZnJvbUJhc2U6ZT0+dihXLndoaXRlLCJENTAiLGUpLHRvQmFzZTplPT52KCJENTAiLFcud2hpdGUsZSl9KTtjb25zdCBPPTIxNi8yNDM4OSxBPTI0LzExNixMPTI0Mzg5LzI3O2xldCBEPXguRDUwO3ZhciBOPW5ldyBfKHtpZDoibGFiIixuYW1lOiJMYWIiLGNvb3Jkczp7bDp7cmVmUmFuZ2U6WzAsMTAwXSxuYW1lOiJMaWdodG5lc3MifSxhOntyZWZSYW5nZTpbLTEyNSwxMjVdfSxiOntyZWZSYW5nZTpbLTEyNSwxMjVdfX0sd2hpdGU6RCxiYXNlOlAsZnJvbUJhc2UoZSl7bGV0IHQ9ZS5tYXAoKGUsdCk9PmUvRFt0XSkubWFwKGU9PmU+Tz9NYXRoLmNicnQoZSk6KEwqZSsxNikvMTE2KTtyZXR1cm5bMTE2KnRbMV0tMTYsNTAwKih0WzBdLXRbMV0pLDIwMCoodFsxXS10WzJdKV19LHRvQmFzZShlKXtsZXRbdCxyLGFdPWUsbj1bXTtyZXR1cm4gblsxXT0odCsxNikvMTE2LG5bMF09ci81MDArblsxXSxuWzJdPW5bMV0tYS8yMDAsW25bMF0+QT9NYXRoLnBvdyhuWzBdLDMpOigxMTYqblswXS0xNikvTCxlWzBdPjg/TWF0aC5wb3coKGVbMF0rMTYpLzExNiwzKTplWzBdL0wsblsyXT5BP01hdGgucG93KG5bMl0sMyk6KDExNipuWzJdLTE2KS9MXS5tYXAoKGUsdCk9PmUqRFt0XSl9LGZvcm1hdHM6e2xhYjp7Y29vcmRzOlsiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iLCI8bnVtYmVyPiB8IDxwZXJjZW50YWdlPiIsIjxudW1iZXI+IHwgPHBlcmNlbnRhZ2U+Il19fX0pO2Z1bmN0aW9uIFQoZSl7cmV0dXJuIm51bWJlciIhPXR5cGVvZiBlP2U6KGUlMzYwKzM2MCklMzYwfXZhciBIPW5ldyBfKHtpZDoibGNoIixuYW1lOiJMQ0giLGNvb3Jkczp7bDp7cmVmUmFuZ2U6WzAsMTAwXSxuYW1lOiJMaWdodG5lc3MifSxjOntyZWZSYW5nZTpbMCwxNTBdLG5hbWU6IkNocm9tYSJ9LGg6e3JlZlJhbmdlOlswLDM2MF0sdHlwZToiYW5nbGUiLG5hbWU6Ikh1ZSJ9fSxiYXNlOk4sZnJvbUJhc2UoZSl7aWYodm9pZCAwPT09dGhpcy7OtSl7bGV0IGU9T2JqZWN0LnZhbHVlcyh0aGlzLmJhc2UuY29vcmRzKVsxXS5yZWZSYW5nZSx0PWVbMV0tZVswXTt0aGlzLs61PXQvMWU1fWxldFt0LHIsYV09ZSxuPU1hdGguYWJzKHIpPHRoaXMuzrUmJk1hdGguYWJzKGEpPHRoaXMuzrUsbz1uP251bGw6VCgxODAqTWF0aC5hdGFuMihhLHIpL01hdGguUEkpO3JldHVyblt0LG4/MDpNYXRoLnNxcnQocioqMithKioyKSxvXX0sdG9CYXNlKGUpe2xldFt0LHIsYV09ZSxuPW51bGwsbz1udWxsO3JldHVybiBpKGEpfHwocj1yPDA/MDpyLG49cipNYXRoLmNvcyhhKk1hdGguUEkvMTgwKSxvPXIqTWF0aC5zaW4oYSpNYXRoLlBJLzE4MCkpLFt0LG4sb119LGZvcm1hdHM6e2xjaDp7Y29vcmRzOlsiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iLCI8bnVtYmVyPiB8IDxwZXJjZW50YWdlPiIsIjxudW1iZXI+IHwgPGFuZ2xlPiJdfX19KTtjb25zdCBGPTI1Kio3LFg9TWF0aC5QSSxZPTE4MC9YLFo9WC8xODA7ZnVuY3Rpb24gSihlKXtjb25zdCB0PWUqZTtyZXR1cm4gdCp0KnQqZX1mdW5jdGlvbiBHKGUsdCx7a0w6cj0xLGtDOmE9MSxrSDpuPTF9PXt9KXtbZSx0XT1rKFtlLHRdKTtsZXRbbyxzLGldPU4uZnJvbShlKSxsPUguZnJvbShOLFtvLHMsaV0pWzFdLFtjLHUsaF09Ti5mcm9tKHQpLGQ9SC5mcm9tKE4sW2MsdSxoXSlbMV07bDwwJiYobD0wKSxkPDAmJihkPTApO2xldCBwPUooKGwrZCkvMiksZj0uNSooMS1NYXRoLnNxcnQocC8ocCtGKSkpLG09KDErZikqcyxnPSgxK2YpKnUsYj1NYXRoLnNxcnQobSoqMitpKioyKSxNPU1hdGguc3FydChnKioyK2gqKjIpLHk9MD09PW0mJjA9PT1pPzA6TWF0aC5hdGFuMihpLG0pLHg9MD09PWcmJjA9PT1oPzA6TWF0aC5hdGFuMihoLGcpO3k8MCYmKHkrPTIqWCkseDwwJiYoeCs9MipYKSx5Kj1ZLHgqPVk7bGV0IHcsdj1jLW8sQj1NLWIsUj14LXksQz15K3gsXz1NYXRoLmFicyhSKTtiKk09PT0wP3c9MDpfPD0xODA/dz1SOlI+MTgwP3c9Ui0zNjA6UjwtMTgwP3c9UiszNjA6SS53YXJuKCJ0aGUgdW50aGlua2FibGUgaGFzIGhhcHBlbmVkIik7bGV0IHosVz0yKk1hdGguc3FydChNKmIpKk1hdGguc2luKHcqWi8yKSxFPShvK2MpLzIsUz0oYitNKS8yLCQ9SihTKTt6PWIqTT09PTA/QzpfPD0xODA/Qy8yOkM8MzYwPyhDKzM2MCkvMjooQy0zNjApLzI7bGV0IGo9KEUtNTApKioyLHE9MSsuMDE1KmovTWF0aC5zcXJ0KDIwK2opLFA9MSsuMDQ1KlMsTz0xO08tPS4xNypNYXRoLmNvcygoei0zMCkqWiksTys9LjI0Kk1hdGguY29zKDIqeipaKSxPKz0uMzIqTWF0aC5jb3MoKDMqeis2KSpaKSxPLT0uMipNYXRoLmNvcygoNCp6LTYzKSpaKTtsZXQgQT0xKy4wMTUqUypPLEw9MzAqTWF0aC5leHAoLTEqKCh6LTI3NSkvMjUpKioyKSxEPTIqTWF0aC5zcXJ0KCQvKCQrRikpLFQ9KHYvKHIqcSkpKioyO3JldHVybiBUKz0oQi8oYSpQKSkqKjIsVCs9KFcvKG4qQSkpKioyLFQrPS0xKk1hdGguc2luKDIqTCpaKSpEKihCLyhhKlApKSooVy8obipBKSksTWF0aC5zcXJ0KFQpfWNvbnN0IFU9W1suODE5MDIyNDM3OTk2NzAzLC4zNjE5MDYyNjAwNTI4OTA0LC0uMTI4ODczNzgxNTIwOTg3OV0sWy4wMzI5ODM2NTM5MzIzODg1LC45MjkyODY4NjE1ODYzNDM0LC4wMzYxNDQ2NjYzNTA2NDI0XSxbLjA0ODE3NzE4OTM1OTYyNDIsLjI2NDIzOTUzMTc1MjczMDgsLjYzMzU0NzgyODQ2OTQzMDldXSxWPVtbMS4yMjY4Nzk4NzU4NDU5MjQzLC0uNTU3ODE0OTk0NDYwMjE3MSwuMjgxMzkxMDQ1NjY1OTY0N10sWy0uMDQwNTc1NzQ1MjE0ODAwOCwxLjExMjI4NjgwMzI4MDMxNywtLjA3MTcxMTA1ODA2NTUxNjRdLFstLjA3NjM3MjkzNjY3NDY2MDEsLS40MjE0OTMzMzI0MDIyNDMyLDEuNTg2OTI0MDE5ODM2NzgxNl1dLFE9W1suMjEwNDU0MjY4MzA5MzE0LC43OTM2MTc3NzQ3MDIzMDU0LC0uMDA0MDcyMDQzMDExNjE5M10sWzEuOTc3OTk4NTMyNDMxMTY4NCwtMi40Mjg1OTIyNDIwNDg1OCwuNDUwNTkzNzA5NjE3NDExXSxbLjAyNTkwNDA0MjQ2NTU0NzgsLjc4Mjc3MTcxMjQ1NzUyOTYsLS44MDg2NzU3NTQ5MjMwNzc0XV0sSz1bWzEsLjM5NjMzNzc3NzM3NjE3NDksLjIxNTgwMzc1NzMwOTkxMzZdLFsxLC0uMTA1NTYxMzQ1ODE1NjU4NiwtLjA2Mzg1NDE3MjgyNTgxMzNdLFsxLC0uMDg5NDg0MTc3NTI5ODExOSwtMS4yOTE0ODU1NDgwMTk0MDkyXV07dmFyIGVlPW5ldyBfKHtpZDoib2tsYWIiLG5hbWU6Ik9rbGFiIixjb29yZHM6e2w6e3JlZlJhbmdlOlswLDFdLG5hbWU6IkxpZ2h0bmVzcyJ9LGE6e3JlZlJhbmdlOlstLjQsLjRdfSxiOntyZWZSYW5nZTpbLS40LC40XX19LHdoaXRlOiJENjUiLGJhc2U6Vyxmcm9tQmFzZShlKXtsZXQgdD1uKGUsVSk7cmV0dXJuIHRbMF09TWF0aC5jYnJ0KHRbMF0pLHRbMV09TWF0aC5jYnJ0KHRbMV0pLHRbMl09TWF0aC5jYnJ0KHRbMl0pLG4odCxRLHQpfSx0b0Jhc2UoZSl7bGV0IHQ9bihlLEspO3JldHVybiB0WzBdPXRbMF0qKjMsdFsxXT10WzFdKiozLHRbMl09dFsyXSoqMyxuKHQsVix0KX0sZm9ybWF0czp7b2tsYWI6e2Nvb3JkczpbIjxwZXJjZW50YWdlPiB8IDxudW1iZXI+IiwiPG51bWJlcj4gfCA8cGVyY2VudGFnZT4iLCI8bnVtYmVyPiB8IDxwZXJjZW50YWdlPiJdfX19KTtmdW5jdGlvbiB0ZShlLHQpe1tlLHRdPWsoW2UsdF0pO2xldFtyLGEsbl09ZWUuZnJvbShlKSxbbyxzLGldPWVlLmZyb20odCksbD1yLW8sYz1hLXMsdT1uLWk7cmV0dXJuIE1hdGguc3FydChsKioyK2MqKjIrdSoqMil9ZnVuY3Rpb24gcmUoZSx0LHtlcHNpbG9uOnI9NzVlLTZ9PXt9KXtlPWsoZSksdHx8KHQ9ZS5zcGFjZSksdD1fLmdldCh0KTtsZXQgYT1lLmNvb3JkcztyZXR1cm4gdCE9PWUuc3BhY2UmJihhPXQuZnJvbShlKSksdC5pbkdhbXV0KGEse2Vwc2lsb246cn0pfWZ1bmN0aW9uIGFlKGUpe3JldHVybntzcGFjZTplLnNwYWNlLGNvb3JkczplLmNvb3Jkcy5zbGljZSgpLGFscGhhOmUuYWxwaGF9fWNvbnN0IG5lPU1hdGguUEkvMTgwO3ZhciBvZT1uZXcgXyh7aWQ6Inh5ei1hYnMtZDY1Iixjc3NJZDoiLS14eXotYWJzLWQ2NSIsbmFtZToiQWJzb2x1dGUgWFlaIEQ2NSIsY29vcmRzOnt4OntyZWZSYW5nZTpbMCw5NTA0LjddLG5hbWU6IlhhIn0seTp7cmVmUmFuZ2U6WzAsMWU0XSxuYW1lOiJZYSJ9LHo6e3JlZlJhbmdlOlswLDEwODg4LjNdLG5hbWU6IlphIn19LGJhc2U6Vyxmcm9tQmFzZTplPT5lLm1hcChlPT4yMDMqZSksdG9CYXNlOmU9PmUubWFwKGU9PmUvMjAzKX0pO2NvbnN0IHNlPTEuMTUsaWU9LjY2LGxlPTI2MTAvMTYzODQsY2U9MTYzODQvMjYxMCx1ZT0uODM1OTM3NSxoZT0yNDEzLzEyOCxkZT0xOC42ODc1LHBlPTEuNyoyNTIzLzMyLGZlPTMyLygxLjcqMjUyMyksbWU9LS41NixnZT0xNjI5NTQ5OTUzMjgyMTU2NWUtMjcsYmU9W1suNDE0Nzg5NzIsLjU3OTk5OSwuMDE0NjQ4XSxbLS4yMDE1MSwxLjEyMDY0OSwuMDUzMTAwOF0sWy0uMDE2NjAwOCwuMjY0OCwuNjY4NDc5OV1dLE1lPVtbMS45MjQyMjY0MzU3ODc2MDY3LC0xLjAwNDc5MjMxMjU5NTM2NTcsLjAzNzY1MTQwNDAzMDYxOF0sWy4zNTAzMTY3NjIwOTQ5OTkwNywuNzI2NDgxMTkzOTMxNjU1MiwtLjA2NTM4NDQyMjk0ODA4NTAxXSxbLS4wOTA5ODI4MTA5ODI4NDc1MiwtLjMxMjcyODI5MDUyMzA3MzksMS41MjI3NjY1NjEzMDUyNjAzXV0seWU9W1suNSwuNSwwXSxbMy41MjQsLTQuMDY2NzA4LC41NDI3MDhdLFsuMTk5MDc2LDEuMDk2Nzk5LC0xLjI5NTg3NV1dLHhlPVtbMSwuMTM4NjA1MDQzMjcxNTM5MjcsLjA1ODA0NzMxNjE1NjExODgzXSxbMSwtLjEzODYwNTA0MzI3MTUzOTMsLS4wNTgwNDczMTYxNTYxMTg5MDRdLFsxLC0uMDk2MDE5MjQyMDI2MzE4OTUsLS44MTE4OTE4OTYwNTYwMzldXTt2YXIgd2U9bmV3IF8oe2lkOiJqemF6YnoiLG5hbWU6Ikp6YXpieiIsY29vcmRzOntqejp7cmVmUmFuZ2U6WzAsMV0sbmFtZToiSnoifSxhejp7cmVmUmFuZ2U6Wy0uMjEsLjIxXX0sYno6e3JlZlJhbmdlOlstLjIxLC4yMV19fSxiYXNlOm9lLGZyb21CYXNlKGUpe2xldFt0LHIsYV09ZSxvPW4oW3NlKnQtKHNlLTEpKmEsaWUqci0oaWUtMSkqdCxhXSxiZSkubWFwKGZ1bmN0aW9uKGUpe2xldCB0PXVlK2hlKnAoZS8xZTQsbGUpLHI9MStkZSpwKGUvMWU0LGxlKTtyZXR1cm4gcCh0L3IscGUpfSksW3MsaSxsXT1uKG8seWUpO3JldHVyblsoMSttZSkqcy8oMSttZSpzKS1nZSxpLGxdfSx0b0Jhc2UoZSl7bGV0W3QscixhXT1lLG89bihbKHQrZ2UpLygxK21lLW1lKih0K2dlKSkscixhXSx4ZSkubWFwKGZ1bmN0aW9uKGUpe2xldCB0PXVlLXAoZSxmZSkscj1kZSpwKGUsZmUpLWhlO3JldHVybiAxZTQqcCh0L3IsY2UpfSksW3MsaSxsXT1uKG8sTWUpLGM9KHMrKHNlLTEpKmwpL3NlO3JldHVybltjLChpKyhpZS0xKSpjKS9pZSxsXX0sZm9ybWF0czp7anphemJ6Ontjb29yZHM6WyI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiIsIjxudW1iZXI+IHwgPHBlcmNlbnRhZ2U+IiwiPG51bWJlcj4gfCA8cGVyY2VudGFnZT4iXX19fSksdmU9bmV3IF8oe2lkOiJqemN6aHoiLG5hbWU6Ikp6Q3pIeiIsY29vcmRzOntqejp7cmVmUmFuZ2U6WzAsMV0sbmFtZToiSnoifSxjejp7cmVmUmFuZ2U6WzAsLjI2XSxuYW1lOiJDaHJvbWEifSxoejp7cmVmUmFuZ2U6WzAsMzYwXSx0eXBlOiJhbmdsZSIsbmFtZToiSHVlIn19LGJhc2U6d2UsZnJvbUJhc2U6SC5mcm9tQmFzZSx0b0Jhc2U6SC50b0Jhc2UsZm9ybWF0czp7anpjemh6Ontjb29yZHM6WyI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiIsIjxudW1iZXI+IHwgPHBlcmNlbnRhZ2U+IiwiPG51bWJlcj4gfCA8YW5nbGU+Il19fX0pO2NvbnN0IEllPS44MzU5Mzc1LEJlPTI0MTMvMTI4LFJlPTE4LjY4NzUsa2U9MjYxMC8xNjM4NCxDZT0xNjM4NC8yNjEwLF9lPTMyLzI1MjMsemU9W1suMzU5MjgzMjU5MDEyMTIxNywuNjk3NjA1MTE0Nzc3OTUwMiwtLjAzNTg5MTU5MzIzMjAyOV0sWy0uMTkyMDgwODQ2MzcwNDk5MywxLjEwMDQ3Njc5NzAzNzQzMiwuMDc1Mzc0ODY1ODUxOTExOF0sWy4wMDcwNzk3ODQ0NjA3NDc5LC4wNzQ4Mzk2NjYyMTg2MzYyLC44NDMzMjY1NDUzODk4NzY1XV0sV2U9W1suNSwuNSwwXSxbNjYxMC80MDk2LC0xMzYxMy80MDk2LDcwMDMvNDA5Nl0sWzE3OTMzLzQwOTYsLTE3MzkwLzQwOTYsLTU0My80MDk2XV0sRWU9W1suOTk5OTk5OTk5OTk5OTk5OCwuMDA4NjA5MDM3MDM3OTMyOCwuMTExMDI5NjI1MDAzMDI2XSxbLjk5OTk5OTk5OTk5OTk5OTgsLS4wMDg2MDkwMzcwMzc5MzI4LC0uMTExMDI5NjI1MDAzMDI1OV0sWy45OTk5OTk5OTk5OTk5OTk4LC41NjAwMzEzMzU3MTA2NzkxLC0uMzIwNjI3MTc0OTg3MzE4OF1dLFNlPVtbMi4wNzAxNTIyMTgzODk0MjIzLC0xLjMyNjM0NzMzODk2NzE1NjMsLjIwNjY1MTA0NzYyOTQwNTNdLFsuMzY0NzM4NTIwOTc0ODA3MiwuNjgwNTY2MDI0OTQ3MjI3MywtLjA0NTMwNDU0NTkyMjAzNDddLFstLjA0OTc0NzIwNzUzNTgxMjMsLS4wNDkyNjA5NjY2OTY2MTMxLDEuMTg4MDY1OTI0OTkyMzA0Ml1dO3ZhciAkZT1uZXcgXyh7aWQ6ImljdGNwIixuYW1lOiJJQ1RDUCIsY29vcmRzOntpOntyZWZSYW5nZTpbMCwxXSxuYW1lOiJJIn0sY3Q6e3JlZlJhbmdlOlstLjUsLjVdLG5hbWU6IkNUIn0sY3A6e3JlZlJhbmdlOlstLjUsLjVdLG5hbWU6IkNQIn19LGJhc2U6b2UsZnJvbUJhc2U6ZT0+e3JldHVybiB0PW4oZSx6ZSksbih0Lm1hcChmdW5jdGlvbihlKXtyZXR1cm4oKEllK0JlKihlLzFlNCkqKmtlKS8oMStSZSooZS8xZTQpKiprZSkpKio3OC44NDM3NX0pLFdlKTt2YXIgdH0sdG9CYXNlKGUpe2xldCB0PWZ1bmN0aW9uKGUpe3JldHVybiBuKGUsRWUpLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gMWU0KihNYXRoLm1heChlKipfZS1JZSwwKS8oQmUtUmUqZSoqX2UpKSoqQ2V9KX0oZSk7cmV0dXJuIG4odCxTZSl9LGZvcm1hdHM6e2ljdGNwOntjb29yZHM6WyI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiIsIjxudW1iZXI+IHwgPHBlcmNlbnRhZ2U+IiwiPG51bWJlcj4gfCA8cGVyY2VudGFnZT4iXX19fSk7Y29uc3QgamU9eC5ENjUscWU9MS8uNDIsUGU9MipNYXRoLlBJLE9lPVtbLjQwMTI4OCwuNjUwMTczLC0uMDUxNDYxXSxbLS4yNTAyNjgsMS4yMDQ0MTQsLjA0NTg1NF0sWy0uMDAyMDc5LC4wNDg5NTIsLjk1MzEyN11dLEFlPVtbMS44NjIwNjc4NTUwODcyMzI3LC0xLjAxMTI1NDYzMDUzMTY4NDMsLjE0OTE4Njc3NTQ0NDQ1MTc1XSxbLjM4NzUyNjU0MzIzNjEzNzE3LC42MjE0NDc0NDE5MzE0NzUzLC0uMDA4OTczOTg1MTY3NjEyNTE4XSxbLS4wMTU4NDE0OTg4NDkzMzM4NTYsLS4wMzQxMjI5MzgwMjg1MTU1NywxLjA0OTk2NDQzNjg3Nzg0OTZdXSxMZT1bWzQ2MCw0NTEsMjg4XSxbNDYwLC04OTEsLTI2MV0sWzQ2MCwtMjIwLC02MzAwXV0sRGU9e2Rhcms6Wy44LC41MjUsLjhdLGRpbTpbLjksLjU5LC45XSxhdmVyYWdlOlsxLC42OSwxXX0sTmU9e2g6WzIwLjE0LDkwLDE2NC4yNSwyMzcuNTMsMzgwLjE0XSxlOlsuOCwuNywxLDEuMiwuOF0sSDpbMCwxMDAsMjAwLDMwMCw0MDBdfSxUZT0xODAvTWF0aC5QSSxIZT1NYXRoLlBJLzE4MDtmdW5jdGlvbiBGZShlLHQpe3JldHVybiBlLm1hcChlPT57Y29uc3Qgcj1wKHQqTWF0aC5hYnMoZSkqLjAxLC40Mik7cmV0dXJuIDQwMCpkKHIsZSkvKHIrMjcuMTMpfSl9ZnVuY3Rpb24gWGUoZSx0LHIsYSxvKXtjb25zdCBzPXt9O3MuZGlzY291bnRpbmc9byxzLnJlZldoaXRlPWUscy5zdXJyb3VuZD1hO2NvbnN0IGk9ZS5tYXAoZT0+MTAwKmUpO3MubGE9dCxzLnliPXI7Y29uc3QgbD1pWzFdLHU9bihpLE9lKTtsZXQgaD1EZVtzLnN1cnJvdW5kXTtjb25zdCBkPWhbMF07cy5jPWhbMV0scy5uYz1oWzJdO2NvbnN0IHA9KDEvKDUqcy5sYSsxKSkqKjQ7cy5mbD1wKnMubGErLjEqKDEtcCkqKDEtcCkqTWF0aC5jYnJ0KDUqcy5sYSkscy5mbFJvb3Q9cy5mbCoqLjI1LHMubj1zLnliL2wscy56PTEuNDgrTWF0aC5zcXJ0KHMubikscy5uYmI9LjcyNSpzLm4qKi0uMixzLm5jYj1zLm5iYjtjb25zdCBmPU1hdGgubWF4KE1hdGgubWluKGQqKDEtMS8zLjYqTWF0aC5leHAoKC1zLmxhLTQyKS85MikpLDEpLDApO3MuZFJnYj11Lm1hcChlPT5jKDEsbC9lLGYpKSxzLmRSZ2JJbnY9cy5kUmdiLm1hcChlPT4xL2UpO2NvbnN0IG09RmUodS5tYXAoKGUsdCk9PmUqcy5kUmdiW3RdKSxzLmZsKTtyZXR1cm4gcy5hVz1zLm5iYiooMiptWzBdK21bMV0rLjA1Km1bMl0pLHN9Y29uc3QgWWU9WGUoamUsNjQvTWF0aC5QSSouMiwyMCwiYXZlcmFnZSIsITEpO2Z1bmN0aW9uIFplKGUsdCl7aWYoISh2b2lkIDAhPT1lLkpedm9pZCAwIT09ZS5RKSl0aHJvdyBuZXcgRXJyb3IoIkNvbnZlcnNpb24gcmVxdWlyZXMgb25lIGFuZCBvbmx5IG9uZTogJ0onIG9yICdRJyIpO2lmKCEodm9pZCAwIT09ZS5DXnZvaWQgMCE9PWUuTV52b2lkIDAhPT1lLnMpKXRocm93IG5ldyBFcnJvcigiQ29udmVyc2lvbiByZXF1aXJlcyBvbmUgYW5kIG9ubHkgb25lOiAnQycsICdNJyBvciAncyciKTtpZighKHZvaWQgMCE9PWUuaF52b2lkIDAhPT1lLkgpKXRocm93IG5ldyBFcnJvcigiQ29udmVyc2lvbiByZXF1aXJlcyBvbmUgYW5kIG9ubHkgb25lOiAnaCcgb3IgJ0gnIik7aWYoMD09PWUuSnx8MD09PWUuUSlyZXR1cm5bMCwwLDBdO2xldCByPTA7cj12b2lkIDAhPT1lLmg/VChlLmgpKkhlOmZ1bmN0aW9uKGUpe2xldCB0PShlJTQwMCs0MDApJTQwMDtjb25zdCByPU1hdGguZmxvb3IoLjAxKnQpO3QlPTEwMDtjb25zdFthLG5dPU5lLmguc2xpY2UocixyKzIpLFtvLHNdPU5lLmUuc2xpY2UocixyKzIpO3JldHVybiBUKCh0KihzKmEtbypuKS0xMDAqYSpzKS8odCoocy1vKS0xMDAqcykpfShlLkgpKkhlO2NvbnN0IGE9TWF0aC5jb3Mociksbz1NYXRoLnNpbihyKTtsZXQgcz0wO3ZvaWQgMCE9PWUuSj9zPS4xKnAoZS5KLC41KTp2b2lkIDAhPT1lLlEmJihzPS4yNSp0LmMqZS5RLygodC5hVys0KSp0LmZsUm9vdCkpO2xldCBpPTA7dm9pZCAwIT09ZS5DP2k9ZS5DL3M6dm9pZCAwIT09ZS5NP2k9ZS5NL3QuZmxSb290L3M6dm9pZCAwIT09ZS5zJiYoaT00ZS00KmUucyoqMioodC5hVys0KS90LmMpO2NvbnN0IGw9cChpKk1hdGgucG93KDEuNjQtTWF0aC5wb3coLjI5LHQubiksLS43MyksMTAvOSksYz0uMjUqKE1hdGguY29zKHIrMikrMy44KSx1PXQuYVcqcChzLDIvdC5jL3QueiksaD01ZTQvMTMqdC5uYyp0Lm5jYipjLG09dS90Lm5iYixnPTIzKihtKy4zMDUpKmYobCwyMypoK2wqKDExKmErMTA4Km8pKSxiPWZ1bmN0aW9uKGUsdCl7Y29uc3Qgcj0xMDAvdCoyNTg4LjA2ODA5ODAxNjI5NTtyZXR1cm4gZS5tYXAoZT0+e2NvbnN0IHQ9TWF0aC5hYnMoZSk7cmV0dXJuIGQocipwKHQvKDQwMC10KSxxZSksZSl9KX0obihbbSxnKmEsZypvXSxMZSkubWFwKGU9PjEqZS8xNDAzKSx0LmZsKTtyZXR1cm4gbihiLm1hcCgoZSxyKT0+ZSp0LmRSZ2JJbnZbcl0pLEFlKS5tYXAoZT0+ZS8xMDApfWZ1bmN0aW9uIEplKGUsdCl7Y29uc3Qgcj1GZShuKGUubWFwKGU9PjEwMCplKSxPZSkubWFwKChlLHIpPT5lKnQuZFJnYltyXSksdC5mbCksYT1yWzBdKygtMTIqclsxXStyWzJdKS8xMSxvPShyWzBdK3JbMV0tMipyWzJdKS85LHM9KE1hdGguYXRhbjIobyxhKSVQZStQZSklUGUsaT0uMjUqKE1hdGguY29zKHMrMikrMy44KSxsPXAoNWU0LzEzKnQubmMqdC5uY2IqZihpKk1hdGguc3FydChhKioyK28qKjIpLHJbMF0rclsxXSsxLjA1KnJbMl0rLjMwNSksLjkpKk1hdGgucG93KDEuNjQtTWF0aC5wb3coLjI5LHQubiksLjczKSxjPXAodC5uYmIqKDIqclswXStyWzFdKy4wNSpyWzJdKS90LmFXLC41KnQuYyp0LnopLHU9MTAwKnAoYywyKSxoPTQvdC5jKmMqKHQuYVcrNCkqdC5mbFJvb3QsZD1sKmMsbT1kKnQuZmxSb290LGc9VChzKlRlKSxiPWZ1bmN0aW9uKGUpe2xldCB0PVQoZSk7dDw9TmUuaFswXSYmKHQrPTM2MCk7Y29uc3Qgcj1mdW5jdGlvbihlLHQscj0wLGE9ZS5sZW5ndGgpe2Zvcig7cjxhOyl7Y29uc3Qgbj1yK2E+PjE7ZVtuXTx0P3I9bisxOmE9bn1yZXR1cm4gcn0oTmUuaCx0KS0xLFthLG5dPU5lLmguc2xpY2UocixyKzIpLFtvLHNdPU5lLmUuc2xpY2UocixyKzIpLGk9KHQtYSkvbztyZXR1cm4gTmUuSFtyXSsxMDAqaS8oaSsobi10KS9zKX0oZyk7cmV0dXJue0o6dSxDOmQsaDpnLHM6NTAqcCh0LmMqbC8odC5hVys0KSwuNSksUTpoLE06bSxIOmJ9fW5ldyBfKHtpZDoiY2FtMTYtam1oIixjc3NJZDoiLS1jYW0xNi1qbWgiLG5hbWU6IkNBTTE2LUpNaCIsY29vcmRzOntqOntyZWZSYW5nZTpbMCwxMDBdLG5hbWU6IkoifSxtOntyZWZSYW5nZTpbMCwxMDVdLG5hbWU6IkNvbG9yZnVsbmVzcyJ9LGg6e3JlZlJhbmdlOlswLDM2MF0sdHlwZToiYW5nbGUiLG5hbWU6Ikh1ZSJ9fSxiYXNlOlcsZnJvbUJhc2UoZSl7dm9pZCAwPT09dGhpcy7OtSYmKHRoaXMuzrU9T2JqZWN0LnZhbHVlcyh0aGlzLmNvb3JkcylbMV0ucmVmUmFuZ2VbMV0vMWU1KTtjb25zdCB0PUplKGUsWWUpLHI9TWF0aC5hYnModC5NKTx0aGlzLs61O3JldHVyblt0Lkoscj8wOnQuTSxyP251bGw6dC5oXX0sdG9CYXNlOmU9PlplKHtKOmVbMF0sTTplWzFdLGg6ZVsyXX0sWWUpfSk7Y29uc3QgR2U9MjE2LzI0Mzg5LFVlPTI0Mzg5LzI3O2Z1bmN0aW9uIFZlKGUpe3JldHVybiBlPjg/TWF0aC5wb3coKGUrMTYpLzExNiwzKTplL1VlfWNvbnN0IFFlPVhlKHguRDY1LDIwMC9NYXRoLlBJKlZlKDUwKSwxMDAqVmUoNTApLCJhdmVyYWdlIiwhMSk7dmFyIEtlPW5ldyBfKHtpZDoiaGN0IixuYW1lOiJIQ1QiLGNvb3Jkczp7aDp7cmVmUmFuZ2U6WzAsMzYwXSx0eXBlOiJhbmdsZSIsbmFtZToiSHVlIn0sYzp7cmVmUmFuZ2U6WzAsMTQ1XSxuYW1lOiJDb2xvcmZ1bG5lc3MifSx0OntyZWZSYW5nZTpbMCwxMDBdLG5hbWU6IlRvbmUifX0sYmFzZTpXLGZyb21CYXNlKGUpe3ZvaWQgMD09PXRoaXMuzrUmJih0aGlzLs61PU9iamVjdC52YWx1ZXModGhpcy5jb29yZHMpWzFdLnJlZlJhbmdlWzFdLzFlNSk7bGV0IHQ9ZnVuY3Rpb24oZSl7Y29uc3QgdD0xMTYqKChyPWVbMV0pPkdlP01hdGguY2JydChyKTooVWUqcisxNikvMTE2KS0xNjt2YXIgcjtpZigwPT09dClyZXR1cm5bMCwwLDBdO2NvbnN0IGE9SmUoZSxRZSk7cmV0dXJuW1QoYS5oKSxhLkMsdF19KGUpO3JldHVybiB0WzFdPHRoaXMuzrUmJih0WzFdPTAsdFswXT1udWxsKSx0fSx0b0Jhc2U6ZT0+ZnVuY3Rpb24oZSx0KXtsZXRbcixhLG5dPWUsbz1bXSxzPTA7aWYoMD09PW4pcmV0dXJuWzAsMCwwXTtsZXQgaT1WZShuKTtzPW4+MD8uMDAzNzkwNTg1MTE0OTI5MTQqbioqMisuNjA4OTgzMTg5NDAxMDMyKm4rLjkxNTUwODg1NzQ3NjIyMzM6OTUxNDQ0MDc1NjU1MDM2MWUtMjEqbioqMisuMDg2OTMwNTc0Mzk3ODg1OTcqbi0yMS45Mjg5NzU4NDIxOTQ2MTQ7bGV0IGw9MCxjPTEvMDtmb3IoO2w8PTE1Oyl7bz1aZSh7SjpzLEM6YSxoOnJ9LHQpO2NvbnN0IGU9TWF0aC5hYnMob1sxXS1pKTtpZihlPGMpe2lmKGU8PTJlLTEyKXJldHVybiBvO2M9ZX1zLT0ob1sxXS1pKSpzLygyKm9bMV0pLGwrPTF9cmV0dXJuIFplKHtKOnMsQzphLGg6cn0sdCl9KGUsUWUpLGZvcm1hdHM6e2NvbG9yOntpZDoiLS1oY3QiLGNvb3JkczpbIjxudW1iZXI+IHwgPGFuZ2xlPiIsIjxwZXJjZW50YWdlPiB8IDxudW1iZXI+IiwiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iXX19fSk7Y29uc3QgZXQ9TWF0aC5QSS8xODAsdHQ9WzEsLjAwNywuMDIyOF07ZnVuY3Rpb24gcnQoZSl7ZVsxXTwwJiYoZT1LZS5mcm9tQmFzZShLZS50b0Jhc2UoZSkpKTtjb25zdCB0PU1hdGgubG9nKE1hdGgubWF4KDErdHRbMl0qZVsxXSpRZS5mbFJvb3QsMSkpL3R0WzJdLHI9ZVswXSpldCxhPXQqTWF0aC5jb3Mociksbj10Kk1hdGguc2luKHIpO3JldHVybltlWzJdLGEsbl19dmFyIGF0PXtkZWx0YUU3NjpmdW5jdGlvbihlLHQpe3JldHVybiBmdW5jdGlvbihlLHQscj0ibGFiIil7bGV0IGE9KHI9Xy5nZXQocikpLmZyb20oZSksbj1yLmZyb20odCk7cmV0dXJuIE1hdGguc3FydChhLnJlZHVjZSgoZSx0LHIpPT57bGV0IGE9bltyXTtyZXR1cm4gaSh0KXx8aShhKT9lOmUrKGEtdCkqKjJ9LDApKX0oZSx0LCJsYWIiKX0sZGVsdGFFQ01DOmZ1bmN0aW9uKGUsdCx7bDpyPTIsYzphPTF9PXt9KXtbZSx0XT1rKFtlLHRdKTtsZXRbbixvLHNdPU4uZnJvbShlKSxbLGwsY109SC5mcm9tKE4sW24sbyxzXSksW3UsaCxkXT1OLmZyb20odCkscD1ILmZyb20oTixbdSxoLGRdKVsxXTtsPDAmJihsPTApLHA8MCYmKHA9MCk7bGV0IGY9bi11LG09bC1wLGc9KG8taCkqKjIrKHMtZCkqKjItbSoqMixiPS41MTE7bj49MTYmJihiPS4wNDA5NzUqbi8oMSsuMDE3NjUqbikpO2xldCBNLHk9LjA2MzgqbC8oMSsuMDEzMSpsKSsuNjM4O2koYykmJihjPTApLE09Yz49MTY0JiZjPD0zNDU/LjU2K01hdGguYWJzKC4yKk1hdGguY29zKChjKzE2OCkqbmUpKTouMzYrTWF0aC5hYnMoLjQqTWF0aC5jb3MoKGMrMzUpKm5lKSk7bGV0IHg9TWF0aC5wb3cobCw0KSx3PU1hdGguc3FydCh4Lyh4KzE5MDApKSx2PShmLyhyKmIpKSoqMjtyZXR1cm4gdis9KG0vKGEqeSkpKioyLHYrPWcvKHkqKHcqTSsxLXcpKSoqMixNYXRoLnNxcnQodil9LGRlbHRhRTIwMDA6RyxkZWx0YUVKejpmdW5jdGlvbihlLHQpe1tlLHRdPWsoW2UsdF0pO2xldFtyLGEsbl09dmUuZnJvbShlKSxbbyxzLGxdPXZlLmZyb20odCksYz1yLW8sdT1hLXM7aShuKSYmaShsKT8obj0wLGw9MCk6aShuKT9uPWw6aShsKSYmKGw9bik7bGV0IGg9bi1sLGQ9MipNYXRoLnNxcnQoYSpzKSpNYXRoLnNpbihoLzIqKE1hdGguUEkvMTgwKSk7cmV0dXJuIE1hdGguc3FydChjKioyK3UqKjIrZCoqMil9LGRlbHRhRUlUUDpmdW5jdGlvbihlLHQpe1tlLHRdPWsoW2UsdF0pO2xldFtyLGEsbl09JGUuZnJvbShlKSxbbyxzLGldPSRlLmZyb20odCk7cmV0dXJuIDcyMCpNYXRoLnNxcnQoKHItbykqKjIrLjI1KihhLXMpKioyKyhuLWkpKioyKX0sZGVsdGFFT0s6dGUsZGVsdGFFT0syOmZ1bmN0aW9uKGUsdCl7W2UsdF09ayhbZSx0XSk7bGV0W3IsYSxuXT1lZS5mcm9tKGUpLFtvLHMsaV09ZWUuZnJvbSh0KSxsPXItbyxjPTIqKGEtcyksdT0yKihuLWkpO3JldHVybiBNYXRoLnNxcnQobCoqMitjKioyK3UqKjIpfSxkZWx0YUVIQ1Q6ZnVuY3Rpb24oZSx0KXtbZSx0XT1rKFtlLHRdKTtsZXRbcixhLG5dPXJ0KEtlLmZyb20oZSkpLFtvLHMsaV09cnQoS2UuZnJvbSh0KSk7cmV0dXJuIE1hdGguc3FydCgoci1vKSoqMisoYS1zKSoqMisobi1pKSoqMil9fTtjb25zdCBudD17aGN0OnttZXRob2Q6ImhjdC5jIixqbmQ6MixkZWx0YUVNZXRob2Q6ImhjdCIsYmxhY2tXaGl0ZUNsYW1wOnt9fSwiaGN0LXRvbmFsIjp7bWV0aG9kOiJoY3QuYyIsam5kOjAsZGVsdGFFTWV0aG9kOiJoY3QiLGJsYWNrV2hpdGVDbGFtcDp7Y2hhbm5lbDoiaGN0LnQiLG1pbjowLG1heDoxMDB9fX07ZnVuY3Rpb24gb3QoZSx7bWV0aG9kOnQ9SS5nYW11dF9tYXBwaW5nLHNwYWNlOnIsZGVsdGFFTWV0aG9kOmE9IiIsam5kOm49MixibGFja1doaXRlQ2xhbXA6c309e30pe2lmKGU9ayhlKSxvKGFyZ3VtZW50c1sxXSk/cj1hcmd1bWVudHNbMV06cnx8KHI9ZS5zcGFjZSkscmUoZSxyPV8uZ2V0KHIpLHtlcHNpbG9uOjB9KSlyZXR1cm4gZTtsZXQgbDtpZigiY3NzIj09PXQpbD1mdW5jdGlvbihlLHtzcGFjZTp0fT17fSl7Y29uc3Qgcj0uMDIsYT0xZS00O2U9ayhlKSx0fHwodD1lLnNwYWNlKSx0PV8uZ2V0KHQpO2NvbnN0IG49Xy5nZXQoIm9rbGNoIik7aWYodC5pc1VuYm91bmRlZClyZXR1cm4gaXQoZSx0KTtjb25zdCBvPWl0KGUsbik7bGV0IHM9by5jb29yZHNbMF07aWYocz49MSl7Y29uc3Qgcj1pdChzdC5XSElURSx0KTtyZXR1cm4gci5hbHBoYT1lLmFscGhhLGl0KHIsdCl9aWYoczw9MCl7Y29uc3Qgcj1pdChzdC5CTEFDSyx0KTtyZXR1cm4gci5hbHBoYT1lLmFscGhhLGl0KHIsdCl9aWYocmUobyx0LHtlcHNpbG9uOjB9KSlyZXR1cm4gaXQobyx0KTtmdW5jdGlvbiBpKGUpe2NvbnN0IHI9aXQoZSx0KSxhPU9iamVjdC52YWx1ZXModC5jb29yZHMpO3JldHVybiByLmNvb3Jkcz1yLmNvb3Jkcy5tYXAoKGUsdCk9PntpZigicmFuZ2UiaW4gYVt0XSl7Y29uc3RbcixuXT1hW3RdLnJhbmdlO3JldHVybiBoKHIsZSxuKX1yZXR1cm4gZX0pLHJ9bGV0IGw9MCxjPW8uY29vcmRzWzFdLHU9ITAsZD1hZShvKSxwPWkoZCksZj10ZShwLGQpO2lmKGY8cilyZXR1cm4gcDtmb3IoO2MtbD5hOyl7Y29uc3QgZT0obCtjKS8yO2lmKGQuY29vcmRzWzFdPWUsdSYmcmUoZCx0LHtlcHNpbG9uOjB9KSlsPWU7ZWxzZSBpZihwPWkoZCksZj10ZShwLGQpLGY8cil7aWYoci1mPGEpYnJlYWs7dT0hMSxsPWV9ZWxzZSBjPWV9cmV0dXJuIHB9KGUse3NwYWNlOnJ9KTtlbHNle2lmKCJjbGlwIj09PXR8fHJlKGUscikpbD1pdChlLHIpO2Vsc2V7T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG50LHQpJiYoe21ldGhvZDp0LGpuZDpuLGRlbHRhRU1ldGhvZDphLGJsYWNrV2hpdGVDbGFtcDpzfT1udFt0XSk7bGV0IG89RztpZigiIiE9PWEpZm9yKGxldCBlIGluIGF0KWlmKCJkZWx0YWUiK2EudG9Mb3dlckNhc2UoKT09PWUudG9Mb3dlckNhc2UoKSl7bz1hdFtlXTticmVha30wPT09biYmKG49MWUtMTYpO2xldCBjPW90KGl0KGUscikse21ldGhvZDoiY2xpcCIsc3BhY2U6cn0pO2lmKG8oZSxjKT5uKXtpZihzJiYzPT09T2JqZWN0LmtleXMocykubGVuZ3RoKXtsZXQgdD1fLnJlc29sdmVDb29yZChzLmNoYW5uZWwpLHI9JChpdChlLHQuc3BhY2UpLHQuaWQpO2lmKGkocikmJihyPTApLHI+PXMubWF4KXJldHVybiBpdCh7c3BhY2U6Inh5ei1kNjUiLGNvb3Jkczp4LkQ2NX0sZS5zcGFjZSk7aWYocjw9cy5taW4pcmV0dXJuIGl0KHtzcGFjZToieHl6LWQ2NSIsY29vcmRzOlswLDAsMF19LGUuc3BhY2UpfWxldCBhPV8ucmVzb2x2ZUNvb3JkKHQpLGM9YS5zcGFjZSx1PWEuaWQsaD1pdChlLGMpO2guY29vcmRzLmZvckVhY2goKGUsdCk9PntpKGUpJiYoaC5jb29yZHNbdF09MCl9KTtsZXQgZD0oYS5yYW5nZXx8YS5yZWZSYW5nZSlbMF0scD1mdW5jdGlvbihlKXtjb25zdCB0PWU/TWF0aC5mbG9vcihNYXRoLmxvZzEwKE1hdGguYWJzKGUpKSk6MDtyZXR1cm4gTWF0aC5tYXgocGFyc2VGbG9hdCgiMWUiKyh0LTIpKSwxZS02KX0obiksZj1kLG09JChoLHUpO2Zvcig7bS1mPnA7KXtsZXQgZT1hZShoKTtlPW90KGUse3NwYWNlOnIsbWV0aG9kOiJjbGlwIn0pLG8oaCxlKS1uPHA/Zj0kKGgsdSk6bT0kKGgsdSkscShoLHUsKGYrbSkvMil9bD1pdChoLHIpfWVsc2UgbD1jfWlmKCJjbGlwIj09PXR8fCFyZShsLHIse2Vwc2lsb246MH0pKXtsZXQgZT1PYmplY3QudmFsdWVzKHIuY29vcmRzKS5tYXAoZT0+ZS5yYW5nZXx8W10pO2wuY29vcmRzPWwuY29vcmRzLm1hcCgodCxyKT0+e2xldFthLG5dPWVbcl07cmV0dXJuIHZvaWQgMCE9PWEmJih0PU1hdGgubWF4KGEsdCkpLHZvaWQgMCE9PW4mJih0PU1hdGgubWluKHQsbikpLHR9KX19cmV0dXJuIHIhPT1lLnNwYWNlJiYobD1pdChsLGUuc3BhY2UpKSxlLmNvb3Jkcz1sLmNvb3JkcyxlfW90LnJldHVybnM9ImNvbG9yIjtjb25zdCBzdD17V0hJVEU6e3NwYWNlOmVlLGNvb3JkczpbMSwwLDBdLGFscGhhOjF9LEJMQUNLOntzcGFjZTplZSxjb29yZHM6WzAsMCwwXSxhbHBoYToxfX07ZnVuY3Rpb24gaXQoZSx0LHtpbkdhbXV0OnJ9PXt9KXtlPWsoZSk7bGV0IGE9KHQ9Xy5nZXQodCkpLmZyb20oZSksbj17c3BhY2U6dCxjb29yZHM6YSxhbHBoYTplLmFscGhhfTtyZXR1cm4gciYmKG49b3QobiwhMD09PXI/dm9pZCAwOnIpKSxufWl0LnJldHVybnM9ImNvbG9yIjt2YXIgbHQ9bmV3IEUoe2lkOiJyZWMyMDIwLWxpbmVhciIsY3NzSWQ6Ii0tcmVjMjAyMC1saW5lYXIiLG5hbWU6IkxpbmVhciBSRUMuMjAyMCIsd2hpdGU6IkQ2NSIsdG9YWVpfTTpbWy42MzY5NTgwNDgzMDEyOTE0LC4xNDQ2MTY5MDM1ODYyMDgzMiwuMTY4ODgwOTc1MTY0MTcyMV0sWy4yNjI3MDAyMTIwMTEyNjcxLC42Nzc5OTgwNzE1MTg4NzA4LC4wNTkzMDE3MTY0Njk4NjE5Nl0sWzAsLjAyODA3MjY5MzA0OTA4NzQyOCwxLjA2MDk4NTA1NzcxMDc5MV1dLGZyb21YWVpfTTpbWzEuNzE2NjUxMTg3OTcxMjY4LC0uMzU1NjcwNzgzNzc2MzkyLC0uMjUzMzY2MjgxMzczNjZdLFstLjY2NjY4NDM1MTgzMjQ4OSwxLjYxNjQ4MTIzNjYzNDkzOSwuMDE1NzY4NTQ1ODEzOTExMV0sWy4wMTc2Mzk4NTc0NDUzMTEsLS4wNDI3NzA2MTMyNTc4MDksLjk0MjEwMzEyMTIzNTQ3NF1dfSksY3Q9bmV3IEUoe2lkOiJyZWMyMDIwIixuYW1lOiJSRUMuMjAyMCIsYmFzZTpsdCx0b0Jhc2U6ZT0+ZS5tYXAoZnVuY3Rpb24oZSl7bGV0IHQ9ZTwwPy0xOjEscj1lKnQ7cmV0dXJuIHQqTWF0aC5wb3cociwyLjQpfSksZnJvbUJhc2U6ZT0+ZS5tYXAoZnVuY3Rpb24oZSl7bGV0IHQ9ZTwwPy0xOjEscj1lKnQ7cmV0dXJuIHQqTWF0aC5wb3cociwxLzIuNCl9KX0pLHV0PW5ldyBFKHtpZDoicDMtbGluZWFyIixjc3NJZDoiZGlzcGxheS1wMy1saW5lYXIiLG5hbWU6IkxpbmVhciBQMyIsd2hpdGU6IkQ2NSIsdG9YWVpfTTpbWy40ODY1NzA5NDg2NDgyMTYyLC4yNjU2Njc2OTMxNjkwOTMwNiwuMTk4MjE3Mjg1MjM0MzYyNV0sWy4yMjg5NzQ1NjQwNjk3NDg4LC42OTE3Mzg1MjE4MzY1MDY0LC4wNzkyODY5MTQwOTM3NDVdLFswLC4wNDUxMTMzODE4NTg5MDI2NCwxLjA0Mzk0NDM2ODkwMDk3Nl1dLGZyb21YWVpfTTpbWzIuNDkzNDk2OTExOTQxNDI1LC0uOTMxMzgzNjE3OTE5MTIzOSwtLjQwMjcxMDc4NDQ1MDcxNjg0XSxbLS44Mjk0ODg5Njk1NjE1NzQ3LDEuNzYyNjY0MDYwMzE4MzQ2MywuMDIzNjI0Njg1ODQxOTQzNTc3XSxbLjAzNTg0NTgzMDI0Mzc4NDQ3LC0uMDc2MTcyMzg5MjY4MDQxODIsLjk1Njg4NDUyNDAwNzY4NzJdXX0pLGh0PW5ldyBFKHtpZDoic3JnYi1saW5lYXIiLG5hbWU6IkxpbmVhciBzUkdCIix3aGl0ZToiRDY1Iix0b1hZWl9NOltbLjQxMjM5MDc5OTI2NTk1OTM0LC4zNTc1ODQzMzkzODM4NzgsLjE4MDQ4MDc4ODQwMTgzNDNdLFsuMjEyNjM5MDA1ODcxNTEwMjcsLjcxNTE2ODY3ODc2Nzc1NiwuMDcyMTkyMzE1MzYwNzMzNzFdLFsuMDE5MzMwODE4NzE1NTkxODIsLjExOTE5NDc3OTc5NDYyNTk4LC45NTA1MzIxNTIyNDk2NjA3XV0sZnJvbVhZWl9NOltbMy4yNDA5Njk5NDE5MDQ1MjI2LC0xLjUzNzM4MzE3NzU3MDA5NCwtLjQ5ODYxMDc2MDI5MzAwMzRdLFstLjk2OTI0MzYzNjI4MDg3OTYsMS44NzU5Njc1MDE1MDc3MjAyLC4wNDE1NTUwNTc0MDcxNzU1OV0sWy4wNTU2MzAwNzk2OTY5OTM2NiwtLjIwMzk3Njk1ODg4ODk3NjUyLDEuMDU2OTcxNTE0MjQyODc4Nl1dfSksZHQ9e2FsaWNlYmx1ZTpbMjQwLzI1NSwyNDgvMjU1LDFdLGFudGlxdWV3aGl0ZTpbMjUwLzI1NSwyMzUvMjU1LDIxNS8yNTVdLGFxdWE6WzAsMSwxXSxhcXVhbWFyaW5lOlsxMjcvMjU1LDEsMjEyLzI1NV0sYXp1cmU6WzI0MC8yNTUsMSwxXSxiZWlnZTpbMjQ1LzI1NSwyNDUvMjU1LDIyMC8yNTVdLGJpc3F1ZTpbMSwyMjgvMjU1LDE5Ni8yNTVdLGJsYWNrOlswLDAsMF0sYmxhbmNoZWRhbG1vbmQ6WzEsMjM1LzI1NSwyMDUvMjU1XSxibHVlOlswLDAsMV0sYmx1ZXZpb2xldDpbMTM4LzI1NSw0My8yNTUsMjI2LzI1NV0sYnJvd246WzE2NS8yNTUsNDIvMjU1LDQyLzI1NV0sYnVybHl3b29kOlsyMjIvMjU1LDE4NC8yNTUsMTM1LzI1NV0sY2FkZXRibHVlOls5NS8yNTUsMTU4LzI1NSwxNjAvMjU1XSxjaGFydHJldXNlOlsxMjcvMjU1LDEsMF0sY2hvY29sYXRlOlsyMTAvMjU1LDEwNS8yNTUsMzAvMjU1XSxjb3JhbDpbMSwxMjcvMjU1LDgwLzI1NV0sY29ybmZsb3dlcmJsdWU6WzEwMC8yNTUsMTQ5LzI1NSwyMzcvMjU1XSxjb3Juc2lsazpbMSwyNDgvMjU1LDIyMC8yNTVdLGNyaW1zb246WzIyMC8yNTUsMjAvMjU1LDYwLzI1NV0sY3lhbjpbMCwxLDFdLGRhcmtibHVlOlswLDAsMTM5LzI1NV0sZGFya2N5YW46WzAsMTM5LzI1NSwxMzkvMjU1XSxkYXJrZ29sZGVucm9kOlsxODQvMjU1LDEzNC8yNTUsMTEvMjU1XSxkYXJrZ3JheTpbMTY5LzI1NSwxNjkvMjU1LDE2OS8yNTVdLGRhcmtncmVlbjpbMCwxMDAvMjU1LDBdLGRhcmtncmV5OlsxNjkvMjU1LDE2OS8yNTUsMTY5LzI1NV0sZGFya2toYWtpOlsxODkvMjU1LDE4My8yNTUsMTA3LzI1NV0sZGFya21hZ2VudGE6WzEzOS8yNTUsMCwxMzkvMjU1XSxkYXJrb2xpdmVncmVlbjpbODUvMjU1LDEwNy8yNTUsNDcvMjU1XSxkYXJrb3JhbmdlOlsxLDE0MC8yNTUsMF0sZGFya29yY2hpZDpbLjYsNTAvMjU1LC44XSxkYXJrcmVkOlsxMzkvMjU1LDAsMF0sZGFya3NhbG1vbjpbMjMzLzI1NSwxNTAvMjU1LDEyMi8yNTVdLGRhcmtzZWFncmVlbjpbMTQzLzI1NSwxODgvMjU1LDE0My8yNTVdLGRhcmtzbGF0ZWJsdWU6WzcyLzI1NSw2MS8yNTUsMTM5LzI1NV0sZGFya3NsYXRlZ3JheTpbNDcvMjU1LDc5LzI1NSw3OS8yNTVdLGRhcmtzbGF0ZWdyZXk6WzQ3LzI1NSw3OS8yNTUsNzkvMjU1XSxkYXJrdHVycXVvaXNlOlswLDIwNi8yNTUsMjA5LzI1NV0sZGFya3Zpb2xldDpbMTQ4LzI1NSwwLDIxMS8yNTVdLGRlZXBwaW5rOlsxLDIwLzI1NSwxNDcvMjU1XSxkZWVwc2t5Ymx1ZTpbMCwxOTEvMjU1LDFdLGRpbWdyYXk6WzEwNS8yNTUsMTA1LzI1NSwxMDUvMjU1XSxkaW1ncmV5OlsxMDUvMjU1LDEwNS8yNTUsMTA1LzI1NV0sZG9kZ2VyYmx1ZTpbMzAvMjU1LDE0NC8yNTUsMV0sZmlyZWJyaWNrOlsxNzgvMjU1LDM0LzI1NSwzNC8yNTVdLGZsb3JhbHdoaXRlOlsxLDI1MC8yNTUsMjQwLzI1NV0sZm9yZXN0Z3JlZW46WzM0LzI1NSwxMzkvMjU1LDM0LzI1NV0sZnVjaHNpYTpbMSwwLDFdLGdhaW5zYm9ybzpbMjIwLzI1NSwyMjAvMjU1LDIyMC8yNTVdLGdob3N0d2hpdGU6WzI0OC8yNTUsMjQ4LzI1NSwxXSxnb2xkOlsxLDIxNS8yNTUsMF0sZ29sZGVucm9kOlsyMTgvMjU1LDE2NS8yNTUsMzIvMjU1XSxncmF5OlsxMjgvMjU1LDEyOC8yNTUsMTI4LzI1NV0sZ3JlZW46WzAsMTI4LzI1NSwwXSxncmVlbnllbGxvdzpbMTczLzI1NSwxLDQ3LzI1NV0sZ3JleTpbMTI4LzI1NSwxMjgvMjU1LDEyOC8yNTVdLGhvbmV5ZGV3OlsyNDAvMjU1LDEsMjQwLzI1NV0saG90cGluazpbMSwxMDUvMjU1LDE4MC8yNTVdLGluZGlhbnJlZDpbMjA1LzI1NSw5Mi8yNTUsOTIvMjU1XSxpbmRpZ286Wzc1LzI1NSwwLDEzMC8yNTVdLGl2b3J5OlsxLDEsMjQwLzI1NV0sa2hha2k6WzI0MC8yNTUsMjMwLzI1NSwxNDAvMjU1XSxsYXZlbmRlcjpbMjMwLzI1NSwyMzAvMjU1LDI1MC8yNTVdLGxhdmVuZGVyYmx1c2g6WzEsMjQwLzI1NSwyNDUvMjU1XSxsYXduZ3JlZW46WzEyNC8yNTUsMjUyLzI1NSwwXSxsZW1vbmNoaWZmb246WzEsMjUwLzI1NSwyMDUvMjU1XSxsaWdodGJsdWU6WzE3My8yNTUsMjE2LzI1NSwyMzAvMjU1XSxsaWdodGNvcmFsOlsyNDAvMjU1LDEyOC8yNTUsMTI4LzI1NV0sbGlnaHRjeWFuOlsyMjQvMjU1LDEsMV0sbGlnaHRnb2xkZW5yb2R5ZWxsb3c6WzI1MC8yNTUsMjUwLzI1NSwyMTAvMjU1XSxsaWdodGdyYXk6WzIxMS8yNTUsMjExLzI1NSwyMTEvMjU1XSxsaWdodGdyZWVuOlsxNDQvMjU1LDIzOC8yNTUsMTQ0LzI1NV0sbGlnaHRncmV5OlsyMTEvMjU1LDIxMS8yNTUsMjExLzI1NV0sbGlnaHRwaW5rOlsxLDE4Mi8yNTUsMTkzLzI1NV0sbGlnaHRzYWxtb246WzEsMTYwLzI1NSwxMjIvMjU1XSxsaWdodHNlYWdyZWVuOlszMi8yNTUsMTc4LzI1NSwxNzAvMjU1XSxsaWdodHNreWJsdWU6WzEzNS8yNTUsMjA2LzI1NSwyNTAvMjU1XSxsaWdodHNsYXRlZ3JheTpbMTE5LzI1NSwxMzYvMjU1LC42XSxsaWdodHNsYXRlZ3JleTpbMTE5LzI1NSwxMzYvMjU1LC42XSxsaWdodHN0ZWVsYmx1ZTpbMTc2LzI1NSwxOTYvMjU1LDIyMi8yNTVdLGxpZ2h0eWVsbG93OlsxLDEsMjI0LzI1NV0sbGltZTpbMCwxLDBdLGxpbWVncmVlbjpbNTAvMjU1LDIwNS8yNTUsNTAvMjU1XSxsaW5lbjpbMjUwLzI1NSwyNDAvMjU1LDIzMC8yNTVdLG1hZ2VudGE6WzEsMCwxXSxtYXJvb246WzEyOC8yNTUsMCwwXSxtZWRpdW1hcXVhbWFyaW5lOlsuNCwyMDUvMjU1LDE3MC8yNTVdLG1lZGl1bWJsdWU6WzAsMCwyMDUvMjU1XSxtZWRpdW1vcmNoaWQ6WzE4Ni8yNTUsODUvMjU1LDIxMS8yNTVdLG1lZGl1bXB1cnBsZTpbMTQ3LzI1NSwxMTIvMjU1LDIxOS8yNTVdLG1lZGl1bXNlYWdyZWVuOls2MC8yNTUsMTc5LzI1NSwxMTMvMjU1XSxtZWRpdW1zbGF0ZWJsdWU6WzEyMy8yNTUsMTA0LzI1NSwyMzgvMjU1XSxtZWRpdW1zcHJpbmdncmVlbjpbMCwyNTAvMjU1LDE1NC8yNTVdLG1lZGl1bXR1cnF1b2lzZTpbNzIvMjU1LDIwOS8yNTUsLjhdLG1lZGl1bXZpb2xldHJlZDpbMTk5LzI1NSwyMS8yNTUsMTMzLzI1NV0sbWlkbmlnaHRibHVlOlsyNS8yNTUsMjUvMjU1LDExMi8yNTVdLG1pbnRjcmVhbTpbMjQ1LzI1NSwxLDI1MC8yNTVdLG1pc3R5cm9zZTpbMSwyMjgvMjU1LDIyNS8yNTVdLG1vY2Nhc2luOlsxLDIyOC8yNTUsMTgxLzI1NV0sbmF2YWpvd2hpdGU6WzEsMjIyLzI1NSwxNzMvMjU1XSxuYXZ5OlswLDAsMTI4LzI1NV0sb2xkbGFjZTpbMjUzLzI1NSwyNDUvMjU1LDIzMC8yNTVdLG9saXZlOlsxMjgvMjU1LDEyOC8yNTUsMF0sb2xpdmVkcmFiOlsxMDcvMjU1LDE0Mi8yNTUsMzUvMjU1XSxvcmFuZ2U6WzEsMTY1LzI1NSwwXSxvcmFuZ2VyZWQ6WzEsNjkvMjU1LDBdLG9yY2hpZDpbMjE4LzI1NSwxMTIvMjU1LDIxNC8yNTVdLHBhbGVnb2xkZW5yb2Q6WzIzOC8yNTUsMjMyLzI1NSwxNzAvMjU1XSxwYWxlZ3JlZW46WzE1Mi8yNTUsMjUxLzI1NSwxNTIvMjU1XSxwYWxldHVycXVvaXNlOlsxNzUvMjU1LDIzOC8yNTUsMjM4LzI1NV0scGFsZXZpb2xldHJlZDpbMjE5LzI1NSwxMTIvMjU1LDE0Ny8yNTVdLHBhcGF5YXdoaXA6WzEsMjM5LzI1NSwyMTMvMjU1XSxwZWFjaHB1ZmY6WzEsMjE4LzI1NSwxODUvMjU1XSxwZXJ1OlsyMDUvMjU1LDEzMy8yNTUsNjMvMjU1XSxwaW5rOlsxLDE5Mi8yNTUsMjAzLzI1NV0scGx1bTpbMjIxLzI1NSwxNjAvMjU1LDIyMS8yNTVdLHBvd2RlcmJsdWU6WzE3Ni8yNTUsMjI0LzI1NSwyMzAvMjU1XSxwdXJwbGU6WzEyOC8yNTUsMCwxMjgvMjU1XSxyZWJlY2NhcHVycGxlOlsuNCwuMiwuNl0scmVkOlsxLDAsMF0scm9zeWJyb3duOlsxODgvMjU1LDE0My8yNTUsMTQzLzI1NV0scm95YWxibHVlOls2NS8yNTUsMTA1LzI1NSwyMjUvMjU1XSxzYWRkbGVicm93bjpbMTM5LzI1NSw2OS8yNTUsMTkvMjU1XSxzYWxtb246WzI1MC8yNTUsMTI4LzI1NSwxMTQvMjU1XSxzYW5keWJyb3duOlsyNDQvMjU1LDE2NC8yNTUsOTYvMjU1XSxzZWFncmVlbjpbNDYvMjU1LDEzOS8yNTUsODcvMjU1XSxzZWFzaGVsbDpbMSwyNDUvMjU1LDIzOC8yNTVdLHNpZW5uYTpbMTYwLzI1NSw4Mi8yNTUsNDUvMjU1XSxzaWx2ZXI6WzE5Mi8yNTUsMTkyLzI1NSwxOTIvMjU1XSxza3libHVlOlsxMzUvMjU1LDIwNi8yNTUsMjM1LzI1NV0sc2xhdGVibHVlOlsxMDYvMjU1LDkwLzI1NSwyMDUvMjU1XSxzbGF0ZWdyYXk6WzExMi8yNTUsMTI4LzI1NSwxNDQvMjU1XSxzbGF0ZWdyZXk6WzExMi8yNTUsMTI4LzI1NSwxNDQvMjU1XSxzbm93OlsxLDI1MC8yNTUsMjUwLzI1NV0sc3ByaW5nZ3JlZW46WzAsMSwxMjcvMjU1XSxzdGVlbGJsdWU6WzcwLzI1NSwxMzAvMjU1LDE4MC8yNTVdLHRhbjpbMjEwLzI1NSwxODAvMjU1LDE0MC8yNTVdLHRlYWw6WzAsMTI4LzI1NSwxMjgvMjU1XSx0aGlzdGxlOlsyMTYvMjU1LDE5MS8yNTUsMjE2LzI1NV0sdG9tYXRvOlsxLDk5LzI1NSw3MS8yNTVdLHR1cnF1b2lzZTpbNjQvMjU1LDIyNC8yNTUsMjA4LzI1NV0sdmlvbGV0OlsyMzgvMjU1LDEzMC8yNTUsMjM4LzI1NV0sd2hlYXQ6WzI0NS8yNTUsMjIyLzI1NSwxNzkvMjU1XSx3aGl0ZTpbMSwxLDFdLHdoaXRlc21va2U6WzI0NS8yNTUsMjQ1LzI1NSwyNDUvMjU1XSx5ZWxsb3c6WzEsMSwwXSx5ZWxsb3dncmVlbjpbMTU0LzI1NSwyMDUvMjU1LDUwLzI1NV19O2xldCBwdD1BcnJheSgzKS5maWxsKCI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPlswLCAyNTVdIiksZnQ9QXJyYXkoMykuZmlsbCgiPG51bWJlcj5bMCwgMjU1XSIpO3ZhciBtdD1uZXcgRSh7aWQ6InNyZ2IiLG5hbWU6InNSR0IiLGJhc2U6aHQsZnJvbUJhc2U6ZT0+ZS5tYXAoZT0+e2xldCB0PWU8MD8tMToxLHI9ZSp0O3JldHVybiByPi4wMDMxMzA4P3QqKDEuMDU1KnIqKigxLzIuNCktLjA1NSk6MTIuOTIqZX0pLHRvQmFzZTplPT5lLm1hcChlPT57bGV0IHQ9ZTwwPy0xOjEscj1lKnQ7cmV0dXJuIHI8PS4wNDA0NT9lLzEyLjkyOnQqKChyKy4wNTUpLzEuMDU1KSoqMi40fSksZm9ybWF0czp7cmdiOntjb29yZHM6cHR9LHJnYl9udW1iZXI6e25hbWU6InJnYiIsY29tbWFzOiEwLGNvb3JkczpmdCxhbHBoYTohMX0sY29sb3I6e30scmdiYTp7Y29vcmRzOnB0LGNvbW1hczohMCxhbHBoYTohMH0scmdiYV9udW1iZXI6e25hbWU6InJnYmEiLGNvbW1hczohMCxjb29yZHM6ZnR9LGhleDp7dHlwZToiY3VzdG9tIix0b0dhbXV0OiEwLHRlc3Q6ZT0+L14jKChbYS1mMC05XXsyfSl7Myw0fXxbYS1mMC05XXszLDR9KSQvaS50ZXN0KGUpLHBhcnNlKGUpe2UubGVuZ3RoPD01JiYoZT1lLnJlcGxhY2UoL1thLWYwLTldL2dpLCIkJiQmIikpO2xldCB0PVtdO3JldHVybiBlLnJlcGxhY2UoL1thLWYwLTldezJ9L2dpLGU9Pnt0LnB1c2gocGFyc2VJbnQoZSwxNikvMjU1KX0pLHtzcGFjZUlkOiJzcmdiIixjb29yZHM6dC5zbGljZSgwLDMpLGFscGhhOnQuc2xpY2UoMylbMF19fSxzZXJpYWxpemU6KGUsdCx7Y29sbGFwc2U6cj0hMCxhbHBoYTphfT17fSk9PnsoITEhPT1hJiZ0PDF8fCEwPT09YSkmJmUucHVzaCh0KSxlPWUubWFwKGU9Pk1hdGgucm91bmQoMjU1KmUpKTtsZXQgbj1yJiZlLmV2ZXJ5KGU9PmUlMTc9PTApO3JldHVybiIjIitlLm1hcChlPT5uPyhlLzE3KS50b1N0cmluZygxNik6ZS50b1N0cmluZygxNikucGFkU3RhcnQoMiwiMCIpKS5qb2luKCIiKX19LGtleXdvcmQ6e3R5cGU6ImN1c3RvbSIsdGVzdDplPT4vXlthLXpdKyQvaS50ZXN0KGUpLHBhcnNlKGUpe2xldCB0PXtzcGFjZUlkOiJzcmdiIixjb29yZHM6bnVsbCxhbHBoYToxfTtpZigidHJhbnNwYXJlbnQiPT09KGU9ZS50b0xvd2VyQ2FzZSgpKT8odC5jb29yZHM9ZHQuYmxhY2ssdC5hbHBoYT0wKTp0LmNvb3Jkcz1kdFtlXSx0LmNvb3JkcylyZXR1cm4gdH19fX0pLGd0PW5ldyBFKHtpZDoicDMiLGNzc0lkOiJkaXNwbGF5LXAzIixuYW1lOiJQMyIsYmFzZTp1dCxmcm9tQmFzZTptdC5mcm9tQmFzZSx0b0Jhc2U6bXQudG9CYXNlfSksYnQ9bmV3IF8oe2lkOiJoc2wiLG5hbWU6IkhTTCIsY29vcmRzOntoOntyZWZSYW5nZTpbMCwzNjBdLHR5cGU6ImFuZ2xlIixuYW1lOiJIdWUifSxzOntyYW5nZTpbMCwxMDBdLG5hbWU6IlNhdHVyYXRpb24ifSxsOntyYW5nZTpbMCwxMDBdLG5hbWU6IkxpZ2h0bmVzcyJ9fSxiYXNlOm10LGZyb21CYXNlOmU9PntsZXQgdD1NYXRoLm1heCguLi5lKSxyPU1hdGgubWluKC4uLmUpLFthLG4sb109ZSxbcyxpLGxdPVtudWxsLDAsKHIrdCkvMl0sYz10LXI7aWYoMCE9PWMpe3N3aXRjaChpPTA9PT1sfHwxPT09bD8wOih0LWwpL01hdGgubWluKGwsMS1sKSx0KXtjYXNlIGE6cz0obi1vKS9jKyhuPG8/NjowKTticmVhaztjYXNlIG46cz0oby1hKS9jKzI7YnJlYWs7Y2FzZSBvOnM9KGEtbikvYys0fXMqPTYwfXJldHVybiBpPDAmJihzKz0xODAsaT1NYXRoLmFicyhpKSkscz49MzYwJiYocy09MzYwKSxbcywxMDAqaSwxMDAqbF19LHRvQmFzZTplPT57bGV0W3QscixhXT1lO2Z1bmN0aW9uIG4oZSl7bGV0IG49KGUrdC8zMCklMTIsbz1yKk1hdGgubWluKGEsMS1hKTtyZXR1cm4gYS1vKk1hdGgubWF4KC0xLE1hdGgubWluKG4tMyw5LW4sMSkpfXJldHVybiB0JT0zNjAsdDwwJiYodCs9MzYwKSxyLz0xMDAsYS89MTAwLFtuKDApLG4oOCksbig0KV19LGZvcm1hdHM6e2hzbDp7Y29vcmRzOlsiPG51bWJlcj4gfCA8YW5nbGU+IiwiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iLCI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiJdfSxoc2xhOntjb29yZHM6WyI8bnVtYmVyPiB8IDxhbmdsZT4iLCI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiIsIjxwZXJjZW50YWdlPiB8IDxudW1iZXI+Il0sY29tbWFzOiEwLGFscGhhOiEwfX19KSxNdD1uZXcgXyh7aWQ6ImhzdiIsbmFtZToiSFNWIixjb29yZHM6e2g6e3JlZlJhbmdlOlswLDM2MF0sdHlwZToiYW5nbGUiLG5hbWU6Ikh1ZSJ9LHM6e3JhbmdlOlswLDEwMF0sbmFtZToiU2F0dXJhdGlvbiJ9LHY6e3JhbmdlOlswLDEwMF0sbmFtZToiVmFsdWUifX0sYmFzZTptdCxmcm9tQmFzZShlKXtsZXQgdD1NYXRoLm1heCguLi5lKSxyPU1hdGgubWluKC4uLmUpLFthLG4sb109ZSxbcyxpLGxdPVtudWxsLDAsdF0sYz10LXI7aWYoMCE9PWMpe3N3aXRjaCh0KXtjYXNlIGE6cz0obi1vKS9jKyhuPG8/NjowKTticmVhaztjYXNlIG46cz0oby1hKS9jKzI7YnJlYWs7Y2FzZSBvOnM9KGEtbikvYys0fXMqPTYwfXJldHVybiBsJiYoaT1jL2wpLHM+PTM2MCYmKHMtPTM2MCksW3MsMTAwKmksMTAwKmxdfSx0b0Jhc2UoZSl7bGV0W3QscixhXT1lO2Z1bmN0aW9uIG4oZSl7bGV0IG49KGUrdC82MCklNjtyZXR1cm4gYS1hKnIqTWF0aC5tYXgoMCxNYXRoLm1pbihuLDQtbiwxKSl9cmV0dXJuIHQlPTM2MCx0PDAmJih0Kz0zNjApLHIvPTEwMCxhLz0xMDAsW24oNSksbigzKSxuKDEpXX0sZm9ybWF0czp7Y29sb3I6e2lkOiItLWhzdiIsY29vcmRzOlsiPG51bWJlcj4gfCA8YW5nbGU+IiwiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iLCI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiJdfX19KSx5dD1uZXcgXyh7aWQ6Imh3YiIsbmFtZToiSFdCIixjb29yZHM6e2g6e3JlZlJhbmdlOlswLDM2MF0sdHlwZToiYW5nbGUiLG5hbWU6Ikh1ZSJ9LHc6e3JhbmdlOlswLDEwMF0sbmFtZToiV2hpdGVuZXNzIn0sYjp7cmFuZ2U6WzAsMTAwXSxuYW1lOiJCbGFja25lc3MifX0sYmFzZTpNdCxmcm9tQmFzZShlKXtsZXRbdCxyLGFdPWU7cmV0dXJuW3QsYSooMTAwLXIpLzEwMCwxMDAtYV19LHRvQmFzZShlKXtsZXRbdCxyLGFdPWU7ci89MTAwLGEvPTEwMDtsZXQgbj1yK2E7aWYobj49MSlyZXR1cm5bdCwwLHIvbioxMDBdO2xldCBvPTEtYTtyZXR1cm5bdCwxMDAqKDA9PT1vPzA6MS1yL28pLDEwMCpvXX0sZm9ybWF0czp7aHdiOntjb29yZHM6WyI8bnVtYmVyPiB8IDxhbmdsZT4iLCI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiIsIjxwZXJjZW50YWdlPiB8IDxudW1iZXI+Il19fX0pLHh0PW5ldyBFKHtpZDoiYTk4cmdiLWxpbmVhciIsY3NzSWQ6Ii0tYTk4LXJnYi1saW5lYXIiLG5hbWU6IkxpbmVhciBBZG9iZcKuIDk4IFJHQiBjb21wYXRpYmxlIix3aGl0ZToiRDY1Iix0b1hZWl9NOltbLjU3NjY2OTA0MjkxMDEzMDUsLjE4NTU1ODIzNzkwNjU0NjMsLjE4ODIyODY0NjIzNDk5NDddLFsuMjk3MzQ0OTc1MjUwNTM2MDUsLjYyNzM2MzU2NjI1NTQ2NjEsLjA3NTI5MTQ1ODQ5Mzk5Nzg4XSxbLjAyNzAzMTM2MTM4NjQxMjM0LC4wNzA2ODg4NTI1MzU4MjcyMywuOTkxMzM3NTM2ODM3NjM4OF1dLGZyb21YWVpfTTpbWzIuMDQxNTg3OTAzODEwNzQ2NSwtLjU2NTAwNjk3NDI3ODg1OTYsLS4zNDQ3MzEzNTA3NzgzMjk1Nl0sWy0uOTY5MjQzNjM2MjgwODc5NSwxLjg3NTk2NzUwMTUwNzcyMDIsLjA0MTU1NTA1NzQwNzE3NTU3XSxbLjAxMzQ0NDI4MDYzMjAzMTE0MiwtLjExODM2MjM5MjIzMTAxODM4LDEuMDE1MTc0OTk0MzkxMjA1NF1dfSksd3Q9bmV3IEUoe2lkOiJhOThyZ2IiLGNzc0lkOiJhOTgtcmdiIixuYW1lOiJBZG9iZcKuIDk4IFJHQiBjb21wYXRpYmxlIixiYXNlOnh0LHRvQmFzZTplPT5lLm1hcChlPT5NYXRoLnBvdyhNYXRoLmFicyhlKSw1NjMvMjU2KSpNYXRoLnNpZ24oZSkpLGZyb21CYXNlOmU9PmUubWFwKGU9Pk1hdGgucG93KE1hdGguYWJzKGUpLDI1Ni81NjMpKk1hdGguc2lnbihlKSl9KSx2dD1uZXcgRSh7aWQ6InByb3Bob3RvLWxpbmVhciIsY3NzSWQ6Ii0tcHJvcGhvdG8tcmdiLWxpbmVhciIsbmFtZToiTGluZWFyIFByb1Bob3RvIix3aGl0ZToiRDUwIixiYXNlOlAsdG9YWVpfTTpbWy43OTc3NjY2NDQ5MDA2NDIzLC4xMzUxODEyOTc0MDA1MzMwOCwuMDMxMzQ3NzM0MTI4MzkyMl0sWy4yODgwNzQ4Mjg4MTk0MDEzLC43MTE4MzUyMzQyNDE4NzMsODk5MzY5Mzg3MjU2NGUtMTddLFswLDAsLjgyNTEwNDYwMjUxMDQ2MDJdXSxmcm9tWFlaX006W1sxLjM0NTc4Njg4MTY0NzE1ODMsLS4yNTU1NzIwODczNzk3OTQ2NCwtLjA1MTEwMTg2NDk3NTU0NTI2XSxbLS41NDQ2MzA3MDUxMjQ5MDE5LDEuNTA4MjQ3NzQyODQ1MTQ2OCwuMDIwNTI3NDQ3NDM2NDIxMzldLFswLDAsMS4yMTE5Njc1NDU2Mzg5NDUyXV19KTtjb25zdCBJdD0xLzUxMjt2YXIgQnQ9bmV3IEUoe2lkOiJwcm9waG90byIsY3NzSWQ6InByb3Bob3RvLXJnYiIsbmFtZToiUHJvUGhvdG8iLGJhc2U6dnQsdG9CYXNlOmU9PmUubWFwKGU9PntsZXQgdD1lPDA/LTE6MSxyPWUqdDtyZXR1cm4gcjwuMDMxMjU/ZS8xNjp0KnIqKjEuOH0pLGZyb21CYXNlOmU9PmUubWFwKGU9PntsZXQgdD1lPDA/LTE6MSxyPWUqdDtyZXR1cm4gcj49SXQ/dCpyKiooMS8xLjgpOjE2KmV9KX0pLFJ0PW5ldyBfKHtpZDoib2tsY2giLG5hbWU6Ik9rTENoIixjb29yZHM6e2w6e3JlZlJhbmdlOlswLDFdLG5hbWU6IkxpZ2h0bmVzcyJ9LGM6e3JlZlJhbmdlOlswLC40XSxuYW1lOiJDaHJvbWEifSxoOntyZWZSYW5nZTpbMCwzNjBdLHR5cGU6ImFuZ2xlIixuYW1lOiJIdWUifX0sd2hpdGU6IkQ2NSIsYmFzZTplZSxmcm9tQmFzZTpILmZyb21CYXNlLHRvQmFzZTpILnRvQmFzZSxmb3JtYXRzOntva2xjaDp7Y29vcmRzOlsiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iLCI8bnVtYmVyPiB8IDxwZXJjZW50YWdlPiIsIjxudW1iZXI+IHwgPGFuZ2xlPiJdfX19KTtjb25zdCBrdD0yKk1hdGguUEksQ3Q9W1s0LjA3Njc0MTYzNjA3NTk1OCwtMy4zMDc3MTE1MzkyNTgwNjMsLjIzMDk2OTkwMzE4MjEwNDNdLFstMS4yNjg0Mzc5NzMyODUwMzE1LDIuNjA5NzU3MzQ5Mjg3Njg4LC0uMzQxMzE5Mzc2MDAyNjU3XSxbLS4wMDQxOTYwNzYxMzg2NzU2LC0uNzAzNDE4NjE3OTM1OTM2MiwxLjcwNzYxNDY5NDA3NDYxMTddXSxfdD1bW1stMS44ODE3MDMxLC0uODA5MzY1MDFdLFsxLjE5MDg2Mjc3LDEuNzY1NzY3MjgsLjU5NjYyNjQxLC43NTUxNTE5NywuNTY3NzEyNDVdXSxbWzEuODE0NDQwOCwtMS4xOTQ0NTI2N10sWy43Mzk1NjUxNSwtLjQ1OTU0NDA0LC4wODI4NTQyNywuMTI1NDEwNzMsLS4xNDUwMzIwNF1dLFtbLjEzMTEwNzU4LDEuODEzMzM5NzFdLFsxLjM1NzMzNjUyLC0uMDA5MTU3OTksLTEuMTUxMzAyMSwtLjUwNTU5NjA2LC4wMDY5MjE2N11dXSx6dD1OdW1iZXIuTUFYX1ZBTFVFLFd0PS4yMDYsRXQ9KDErV3QpLzEuMDM7ZnVuY3Rpb24gU3QoZSx0KXtsZXQgcj1lLmxlbmd0aDtpZihyIT09dC5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKGBWZWN0b3JzIG9mIHNpemUgJHtyfSBhbmQgJHt0Lmxlbmd0aH0gYXJlIG5vdCBhbGlnbmVkYCk7bGV0IGE9MDtyZXR1cm4gZS5mb3JFYWNoKChlLHIpPT57YSs9ZSp0W3JdfSksYX1mdW5jdGlvbiAkdChlKXtyZXR1cm4uNSooRXQqZS1XdCtNYXRoLnNxcnQoKEV0KmUtV3QpKihFdCplLVd0KSsuMTIqRXQqZSkpfWZ1bmN0aW9uIGp0KGUpe3JldHVybihlKioyK1d0KmUpLyhFdCooZSsuMDMpKX1mdW5jdGlvbiBxdChlKXtsZXRbdCxyXT1lO3JldHVybltyL3Qsci8oMS10KV19ZnVuY3Rpb24gUHQoZSx0KXtsZXQgcj1uKGUsSyk7cmV0dXJuIHJbMF09clswXSoqMyxyWzFdPXJbMV0qKjMsclsyXT1yWzJdKiozLG4ocix0LHIpfWZ1bmN0aW9uIE90KGUsdCxyLGEpe2xldCBuPWZ1bmN0aW9uKGUsdCxyLGEpe2xldCBuLG8scyxpLGwsYyx1LGg7U3QoYVswXVswXSxbZSx0XSk+MT8oW24sbyxzLGksbF09YVswXVsxXSxbYyx1LGhdPXJbMF0pOlN0KGFbMV1bMF0sW2UsdF0pPjE/KFtuLG8scyxpLGxdPWFbMV1bMV0sW2MsdSxoXT1yWzFdKTooW24sbyxzLGksbF09YVsyXVsxXSxbYyx1LGhdPXJbMl0pO2xldCBkPW4rbyplK3MqdCtpKmUqKjIrbCplKnQscD1TdChLWzBdLnNsaWNlKDEpLFtlLHRdKSxmPVN0KEtbMV0uc2xpY2UoMSksW2UsdF0pLG09U3QoS1syXS5zbGljZSgxKSxbZSx0XSksZz0xK2QqcCxiPTErZCpmLE09MStkKm0seT1jKmcqKjMrdSpiKiozK2gqTSoqMyx4PWMqKDMqcCpnKioyKSt1KigzKmYqYioqMikraCooMyptKk0qKjIpO3JldHVybiBkLT15KngvKHgqKjItLjUqeSooYyooNipwKioyKmcpK3UqKDYqZioqMipiKStoKig2Km0qKjIqTSkpKSxkfShlLHQscixhKSxvPVB0KFsxLG4qZSxuKnRdLHIpLHM9cCgxL01hdGgubWF4KC4uLm8pLDEvMyk7cmV0dXJuW3MscypuXX1mdW5jdGlvbiBBdChlLHQscil7bGV0W2EsbixvXT1lLHM9T3QobixvLHQsciksaT1mdW5jdGlvbihlLHQscixhLG4sbyxzLGkpe2xldCBsO2lmKHZvaWQgMD09PWkmJihpPU90KGUsdCxvLHMpKSwoci1uKSppWzFdLTEqKGlbMF0tbik8PTApbD1pWzFdKm4vKDEqaVswXStpWzFdKihuLXIpKTtlbHNle2w9aVsxXSoobi0xKS8oMSooaVswXS0xKStpWzFdKihuLXIpKTtsZXQgYT1yLW4scz0xLGM9U3QoS1swXS5zbGljZSgxKSxbZSx0XSksdT1TdChLWzFdLnNsaWNlKDEpLFtlLHRdKSxoPVN0KEtbMl0uc2xpY2UoMSksW2UsdF0pLGQ9YStzKmMscD1hK3MqdSxmPWErcypoLG09biooMS1sKStsKnIsZz0xKmwsYj1tK2cqYyxNPW0rZyp1LHk9bStnKmgseD1iKiozLHc9TSoqMyx2PXkqKjMsST0zKmQqYioqMixCPTMqcCpNKioyLFI9MypmKnkqKjIsaz02KmQqKjIqYixDPTYqcCoqMipNLF89NipmKioyKnksej1TdChvWzBdLFt4LHcsdl0pLTEsVz1TdChvWzBdLFtJLEIsUl0pLEU9Vy8oVypXLS41KnoqU3Qob1swXSxbayxDLF9dKSksUz0teipFLCQ9U3Qob1sxXSxbeCx3LHZdKS0xLGo9U3Qob1sxXSxbSSxCLFJdKSxxPWovKGoqai0uNSokKlN0KG9bMV0sW2ssQyxfXSkpLFA9LSQqcSxPPVN0KG9bMl0sW3gsdyx2XSktMSxBPVN0KG9bMl0sW0ksQixSXSksTD1BLyhBKkEtLjUqTypTdChvWzJdLFtrLEMsX10pKSxEPS1PKkw7Uz1FPj0wP1M6enQsUD1xPj0wP1A6enQsRD1MPj0wP0Q6enQsbCs9TWF0aC5taW4oUyxNYXRoLm1pbihQLEQpKX1yZXR1cm4gbH0obixvLGEsMCxhLHQscixzKSxsPXF0KHMpLGM9aS9NYXRoLm1pbihhKmxbMF0sKDEtYSkqbFsxXSksdT1mdW5jdGlvbihlLHQpe3JldHVyblsuMTE1MTY5OTMrMS8oNy40NDc3ODk3KzQuMTU5MDEyNCp0K2UqKDEuNzUxOTg0MDEqdC0yLjE5NTU3MzQ3K2UqKC0yLjEzNzA0OTQ4LTEwLjAyMzAxMDQzKnQrZSooNS4zODc3MDgxOSp0LTQuMjQ4OTQ1NjErNC42OTg5MTAxMyplKSkpKSwuMTEyMzk2NDIrMS8oMS42MTMyMDMyLS42ODEyNDM3OSp0K2UqKC40MDM3MDYxMisuOTAxNDgxMjMqdCtlKiguNjEyMjM5OSp0LS4yNzA4Nzk0MytlKiguMDAyOTkyMTUtLjQ1Mzk5NTY4KnQtLjE0NjYxODcyKmUpKSkpXX0obixvKSxoPWEqdVswXSxkPSgxLWEpKnVbMV0scD0uOSpjKk1hdGguc3FydChNYXRoLnNxcnQoMS8oMS9oKio0KzEvZCoqNCkpKTtyZXR1cm4gaD0uNCphLGQ9LjgqKDEtYSksW01hdGguc3FydCgxLygxL2gqKjIrMS9kKioyKSkscCxpXX1uZXcgXyh7aWQ6Im9raHNsIixuYW1lOiJPa2hzbCIsY29vcmRzOntoOntyZWZSYW5nZTpbMCwzNjBdLHR5cGU6ImFuZ2xlIixuYW1lOiJIdWUifSxzOntyYW5nZTpbMCwxXSxuYW1lOiJTYXR1cmF0aW9uIn0sbDp7cmFuZ2U6WzAsMV0sbmFtZToiTGlnaHRuZXNzIn19LGJhc2U6ZWUsZ2FtdXRTcGFjZToic2VsZiIsZnJvbUJhc2U6ZT0+ZnVuY3Rpb24oZSx0LHIpe2xldCBhPWVbMF0sbj0wLG89JHQoYSkscz1NYXRoLnNxcnQoZVsxXSoqMitlWzJdKioyKSxpPS41K01hdGguYXRhbjIoLWVbMl0sLWVbMV0pL2t0O2lmKDAhPT1vJiYxIT09byYmMCE9PXMpe2xldCBvLGksbCxjLHU9ZVsxXS9zLGg9ZVsyXS9zLFtkLHAsZl09QXQoW2EsdSxoXSx0LHIpLG09Ljg7czxwPyhpPW0qZCxsPTEtaS9wLGM9cy8oaStsKnMpLG49YyptKToobz1wLGk9LjIqcCoqMioxLjU2MjUvZCxsPTEtaS8oZi1wKSxjPShzLW8pLyhpK2wqKHMtbykpLG49bSsuMipjKX1jb25zdCBsPU1hdGguYWJzKG4pPDFlLTQ7cmV0dXJuIGx8fDA9PT1vfHxNYXRoLmFicygxLW8pPDFlLTc/KGk9bnVsbCxsfHwobj0wKSk6aT1UKDM2MCppKSxbaSxuLG9dfShlLEN0LF90KSx0b0Jhc2U6ZT0+ZnVuY3Rpb24oZSx0LHIpe2xldFthLG4sb109ZSxzPWp0KG8pLGk9bnVsbCxsPW51bGw7aWYoYT1UKGEpLzM2MCwwIT09cyYmMSE9PXMmJjAhPT1uKXtsZXQgZSxvLGMsdSxoPU1hdGguY29zKGt0KmEpLGQ9TWF0aC5zaW4oa3QqYSksW3AsZixtXT1BdChbcyxoLGRdLHQsciksZz0uODtuPGc/KGU9MS4yNSpuLG89MCxjPWcqcCx1PTEtYy9mKTooZT01KihuLS44KSxvPWYsYz0uMipmKioyKjEuNTYyNS9wLHU9MS1jLyhtLWYpKTtsZXQgYj1vK2UqYy8oMS11KmUpO2k9YipoLGw9YipkfXJldHVybltzLGksbF19KGUsQ3QsX3QpLGZvcm1hdHM6e2NvbG9yOntpZDoiLS1va2hzbCIsY29vcmRzOlsiPG51bWJlcj4gfCA8YW5nbGU+IiwiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iLCI8cGVyY2VudGFnZT4gfCA8bnVtYmVyPiJdfX19KTt2YXIgTHQ9bmV3IF8oe2lkOiJva2hzdiIsbmFtZToiT2toc3YiLGNvb3Jkczp7aDp7cmVmUmFuZ2U6WzAsMzYwXSx0eXBlOiJhbmdsZSIsbmFtZToiSHVlIn0sczp7cmFuZ2U6WzAsMV0sbmFtZToiU2F0dXJhdGlvbiJ9LHY6e3JhbmdlOlswLDFdLG5hbWU6IlZhbHVlIn19LGJhc2U6ZWUsZ2FtdXRTcGFjZToic2VsZiIsZnJvbUJhc2U6ZT0+ZnVuY3Rpb24oZSx0LHIpe2xldCBhPWVbMF0sbj0wLG89JHQoYSkscz1NYXRoLnNxcnQoZVsxXSoqMitlWzJdKioyKSxpPS41K01hdGguYXRhbjIoLWVbMl0sLWVbMV0pL2t0O2lmKDAhPT1hJiYxIT09YSYmMCE9PXMpe2xldCBpPWVbMV0vcyxsPWVbMl0vcyxjPU90KGksbCx0LHIpLFt1LGhdPXF0KGMpLGQ9LjUsZj0xLWQvdSxtPWgvKHMrYSpoKSxnPW0qYSxiPW0qcyxNPWp0KGcpLHk9YipNL2csW3gsdyx2XT1QdChbTSxpKnksbCp5XSx0KSxJPXAoMS9NYXRoLm1heChNYXRoLm1heCh4LHcpLE1hdGgubWF4KHYsMCkpLDEvMyk7YS89SSxzLz1JLHM9cyokdChhKS9hLGE9JHQoYSksbz1hL2csbj0oZCtoKSpiLyhoKmQraCpmKmIpfXJldHVybiBpPU1hdGguYWJzKG4pPDFlLTR8fDA9PT1vP251bGw6VCgzNjAqaSksW2ksbixvXX0oZSxDdCxfdCksdG9CYXNlOmU9PmZ1bmN0aW9uKGUsdCxyKXtsZXRbYSxuLG9dPWU7YT1UKGEpLzM2MDtsZXQgcz1qdChvKSxpPW51bGwsbD1udWxsO2lmKDAhPT1zJiYwIT09bil7bGV0IGU9TWF0aC5jb3Moa3QqYSksYz1NYXRoLnNpbihrdCphKSx1PU90KGUsYyx0LHIpLFtoLGRdPXF0KHUpLGY9LjUsbT0xLWYvaCxnPTEtbipmLyhmK2QtZCptKm4pLGI9bipkKmYvKGYrZC1kKm0qbik7cz1vKmc7bGV0IE09bypiLHk9anQoZykseD1iKnkvZyx3PWp0KHMpO009TSp3L3Mscz13O2xldFt2LEksQl09UHQoW3ksZSp4LGMqeF0sdCksUj1wKDEvTWF0aC5tYXgoTWF0aC5tYXgodixJKSxNYXRoLm1heChCLDApKSwxLzMpO3MqPVIsTSo9UixpPU0qZSxsPU0qY31yZXR1cm5bcyxpLGxdfShlLEN0LF90KSxmb3JtYXRzOntjb2xvcjp7aWQ6Ii0tb2toc3YiLGNvb3JkczpbIjxudW1iZXI+IHwgPGFuZ2xlPiIsIjxwZXJjZW50YWdlPiB8IDxudW1iZXI+IiwiPHBlcmNlbnRhZ2U+IHwgPG51bWJlcj4iXX19fSk7Xy5yZWdpc3RlcihtdCksXy5yZWdpc3RlcihodCksXy5yZWdpc3RlcihidCksXy5yZWdpc3Rlcih5dCksXy5yZWdpc3RlcihOKSxfLnJlZ2lzdGVyKEgpLF8ucmVnaXN0ZXIoZWUpLF8ucmVnaXN0ZXIoUnQpLF8ucmVnaXN0ZXIoZ3QpLF8ucmVnaXN0ZXIod3QpLF8ucmVnaXN0ZXIoQnQpLF8ucmVnaXN0ZXIoY3QpLF8ucmVnaXN0ZXIoVyksXy5yZWdpc3RlcihQKSxfLnJlZ2lzdGVyKEx0KTtjb25zdCBEdD1lPT57dmFyIHQ7cmV0dXJuIG51bGwhPSh0PWUueE1pbik/dDowfSxOdD1lPT57dmFyIHQ7cmV0dXJuIG51bGwhPSh0PWUueU1pbik/dDowfSxUdD1lPT5lLnhNYXgtRHQoZSksSHQ9ZT0+ZS55TWF4LU50KGUpO2Z1bmN0aW9uIEZ0KGUsdCl7Y29uc3Qgcj1lLmxlbmd0aC0xLGE9TWF0aC5tYXgoMCxNYXRoLm1pbihyLHQqcikpLG49TWF0aC5mbG9vcihhKSxvPU1hdGgubWluKG4rMSxyKSxzPWEtbjtyZXR1cm4gZVtuXSooMS1zKStlW29dKnN9ZnVuY3Rpb24gWHQoZSx0KXtjb25zdCByPWUubGVuZ3RoLGE9KHQlKDIqTWF0aC5QSSkrMipNYXRoLlBJKSUoMipNYXRoLlBJKS8oMipNYXRoLlBJKSpyLG49TWF0aC5mbG9vcihhKSVyLG89KG4rMSklcixzPWEtTWF0aC5mbG9vcihhKTtyZXR1cm4gZVtuXSooMS1zKStlW29dKnN9ZnVuY3Rpb24gWXQoZSx0LHIpe2NvbnN0IGE9TWF0aC5zcXJ0KGUqZSt0KnQpO2lmKGE8MWUtMTApcmV0dXJuWzAsMF07Y29uc3Qgbj1NYXRoLmF0YW4yKHQsZSksbz0xL01hdGgubWF4KE1hdGguYWJzKE1hdGguY29zKG4pKSxNYXRoLmFicyhNYXRoLnNpbihuKSkpLHM9TWF0aC5taW4oMSxhL28pKlh0KHIsbik7cmV0dXJuW3MqTWF0aC5jb3MobikscypNYXRoLnNpbihuKV19Y29uc3QgWnQ9e29raHN2OntmaXhlZEluZGV4OjAseEluZGV4OjEseE1heDoxLHhTdGVwOi4wMSx5SW5kZXg6Mix5TWF4OjEseVN0ZXA6LjAxfSxva2xjaDp7Zml4ZWRJbmRleDoyLHhJbmRleDoxLHhNYXg6LjM3LHhTdGVwOi4wMDM3LHlJbmRleDowLHlNYXg6MSx5U3RlcDouMDEsZ2FtdXRCb3VuZGFyeToicm93LXNjYW4ifSxoc2w6e2ZpeGVkSW5kZXg6MCx4SW5kZXg6MSx4TWF4OjEwMCx4U3RlcDoxLHlJbmRleDoyLHlNYXg6MTAwLHlTdGVwOjF9LG9rbGFiOntmaXhlZEluZGV4OjAseEluZGV4OjEseE1pbjotLjMzLHhNYXg6LjMzLHhTdGVwOi4wMDY2LHlJbmRleDoyLHlNaW46LS4zMyx5TWF4Oi4zMyx5U3RlcDouMDA2NixnYW11dEJvdW5kYXJ5OiJwb2xhci1zY2FuIn0sbGFiOntmaXhlZEluZGV4OjAseEluZGV4OjEseE1pbjotMTEwLHhNYXg6MTEwLHhTdGVwOjIuMix5SW5kZXg6Mix5TWluOi0xMTAseU1heDoxMTAseVN0ZXA6Mi4yLGdhbXV0Qm91bmRhcnk6InBvbGFyLXNjYW4ifSxod2I6e2ZpeGVkSW5kZXg6MCx4SW5kZXg6MSx4TWF4OjEwMCx4U3RlcDoxLHlJbmRleDoyLHlNYXg6MTAwLHlTdGVwOjEsZ2FtdXRCb3VuZGFyeToiZGlhZ29uYWwiLHhJbnZlcnQ6ITAseUludmVydDohMH19O2Z1bmN0aW9uIEp0KGUsdCxyKXtyZXR1cm4gcmUoe3NwYWNlSWQ6cixjb29yZHM6aXQoe3NwYWNlSWQ6ZSxjb29yZHM6dCxhbHBoYToxfSxyKS5jb29yZHMsYWxwaGE6bnVsbH0pfWZ1bmN0aW9uIEd0KGUpe3N3aXRjaChlKXtjYXNlInAzIjpkZWZhdWx0OnJldHVybiJwMyI7Y2FzZSJhOThyZ2IiOnJldHVybiJhOThyZ2IiO2Nhc2UicmVjMjAyMCI6cmV0dXJuInJlYzIwMjAiO2Nhc2UicHJvcGhvdG8tcmdiIjpyZXR1cm4icHJvcGhvdG8tcmdiIn19c2VsZi5vbm1lc3NhZ2U9ZT0+e2NvbnN0e2lkOnQsc3BhY2VJZDpyLGZpeGVkVmFsdWU6YSx1c2VyU3BhY2VJZDpuLGNzc1c6byxjc3NIOnMsZHByOmksc3VwcG9ydHNQMzpsfT1lLmRhdGEsYz1adFtyXTtpZighYylyZXR1cm47Y29uc3QgdT1sPyJwMyI6InNyZ2IiLGg9TWF0aC5yb3VuZChvKmkpLGQ9TWF0aC5yb3VuZChzKmkpLHA9TWF0aC5yb3VuZChoLzQpLGY9TWF0aC5yb3VuZChkLzQpO2xldCBtLGc9YyxiPW51bGwsTT1udWxsO2lmKCJyb3ctc2NhbiI9PT1jLmdhbXV0Qm91bmRhcnkpe209R3Qobik7dHJ5e2I9ZnVuY3Rpb24oZSx0LHIsYSl7Y29uc3Qgbj1uZXcgRmxvYXQ2NEFycmF5KDEyOCk7Zm9yKGxldCBvPTA7bzwxMjg7bysrKXtjb25zdCBzPW8vMTI3LGk9TnQoZSkrcypIdChlKSxsPVswLDAsMF07aWYobFtlLmZpeGVkSW5kZXhdPXIsbFtlLnlJbmRleF09aSxsW2UueEluZGV4XT0wLCFKdCh0LGwsYSkpe25bb109MDtjb250aW51ZX1sZXQgYz0wLHU9LjU7Zm9yKGxldCBuPTA7bjwxNjtuKyspe2NvbnN0IG49KGMrdSkvMixvPVswLDAsMF07b1tlLmZpeGVkSW5kZXhdPXIsb1tlLnhJbmRleF09bixvW2UueUluZGV4XT1pLEp0KHQsbyxhKT9jPW46dT1ufW5bb109Y31yZXR1cm4gbn0oYyxyLGEsbSl9Y2F0Y2h7fX1lbHNlIGlmKCJwb2xhci1zY2FuIj09PWMuZ2FtdXRCb3VuZGFyeSl7bT1HdChuKTt0cnl7TT1mdW5jdGlvbihlLHQscixhKXtjb25zdCBuPW5ldyBGbG9hdDY0QXJyYXkoMTgwKSxvPVR0KGUpLzIscz1IdChlKS8yLGk9MS41Kk1hdGguc3FydChvKm8rcypzKTtmb3IobGV0IGw9MDtsPDE4MDtsKyspe2NvbnN0IG89bC8xODAqTWF0aC5QSSoyLHM9TWF0aC5jb3MobyksYz1NYXRoLnNpbihvKTtsZXQgdT0wLGg9aTtmb3IobGV0IG49MDtuPDE2O24rKyl7Y29uc3Qgbj0odStoKS8yLG89WzAsMCwwXTtvW2UuZml4ZWRJbmRleF09cixvW2UueEluZGV4XT1uKnMsb1tlLnlJbmRleF09bipjLEp0KHQsbyxhKT91PW46aD1ufW5bbF09dX1yZXR1cm4gbn0oYyxyLGEsbSl9Y2F0Y2h7fX1jb25zdCB5PWZ1bmN0aW9uKGUsdCxyLGEsbixvLHMsaSl7Y29uc3QgbD1uZXcgVWludDhDbGFtcGVkQXJyYXkoYSpuKjQpO2ZvcihsZXQgYz0wO2M8bjtjKyspe2NvbnN0IHU9MS1jLyhuLTEpO2ZvcihsZXQgbj0wO248YTtuKyspe2NvbnN0IGg9bi8oYS0xKSxkPVswLDAsMF07ZFtlLmZpeGVkSW5kZXhdPXI7Y29uc3QgcD1lLnhJbnZlcnQ/MS1oOmgsZj1lLnlJbnZlcnQ/MS11OnU7aWYoaSl7Y29uc3QgdD0yKnAtMSxyPTIqZi0xLFthLG5dPVl0KHQscixpKTtkW2UueEluZGV4XT1hLGRbZS55SW5kZXhdPW59ZWxzZSBzPyhkW2UueEluZGV4XT1wKkZ0KHMsZiksZFtlLnlJbmRleF09TnQoZSkrZipIdChlKSk6KGRbZS54SW5kZXhdPUR0KGUpK3AqVHQoZSksZFtlLnlJbmRleF09TnQoZSkrZipIdChlKSk7Y29uc3RbbSxnLGJdPWl0KHtzcGFjZUlkOnQsY29vcmRzOmQsYWxwaGE6bnVsbH0sbykuY29vcmRzLE09NCooYyphK24pO2xbTV09TWF0aC5yb3VuZCgyNTUqTWF0aC5tYXgoMCxNYXRoLm1pbigxLG51bGwhPW0/bTowKSkpLGxbTSsxXT1NYXRoLnJvdW5kKDI1NSpNYXRoLm1heCgwLE1hdGgubWluKDEsbnVsbCE9Zz9nOjApKSksbFtNKzJdPU1hdGgucm91bmQoMjU1Kk1hdGgubWF4KDAsTWF0aC5taW4oMSxudWxsIT1iP2I6MCkpKSxsW00rM109MjU1fX1yZXR1cm4gbH0oZyxyLGEscCxmLHUsYixNKSx4PWMuZ2FtdXRCb3VuZGFyeT9mdW5jdGlvbihlLHQscixhLG4sbyxzLGksbCxjKXt2YXIgdTtjb25zdCBoPVtdO2lmKCJkaWFnb25hbCI9PT1lLmdhbXV0Qm91bmRhcnkpcmV0dXJuIGg7Y29uc3QgZD1udWxsIT0odT17YTk4cmdiOlt7c3BhY2U6ImE5OHJnYiIsY29sb3I6InJnYmEoMjU1LDI1NSwyNTUsMC41NSkiLGxpbmVXaWR0aDoxLjI1KnMsZGFzaDpbNipzLDQqc119LHtzcGFjZToic3JnYiIsY29sb3I6InJnYmEoMjU1LDI1NSwyNTUsMC43KSIsbGluZVdpZHRoOjEuNSpzLGRhc2g6W119XSwicHJvcGhvdG8tcmdiIjpbe3NwYWNlOiJwcm9waG90by1yZ2IiLGNvbG9yOiJyZ2JhKDI1NSwyNTUsMjU1LDAuNTUpIixsaW5lV2lkdGg6MS4yNSpzLGRhc2g6WzYqcyw0KnNdfSx7c3BhY2U6InNyZ2IiLGNvbG9yOiJyZ2JhKDI1NSwyNTUsMjU1LDAuNykiLGxpbmVXaWR0aDoxLjUqcyxkYXNoOltdfV0scmVjMjAyMDpbe3NwYWNlOiJyZWMyMDIwIixjb2xvcjoicmdiYSgyNTUsMjU1LDI1NSwwLjU1KSIsbGluZVdpZHRoOjEuMjUqcyxkYXNoOls2KnMsNCpzXX0se3NwYWNlOiJzcmdiIixjb2xvcjoicmdiYSgyNTUsMjU1LDI1NSwwLjcpIixsaW5lV2lkdGg6MS41KnMsZGFzaDpbXX1dLHAzOlt7c3BhY2U6InAzIixjb2xvcjoicmdiYSgyNTUsMjU1LDI1NSwwLjU1KSIsbGluZVdpZHRoOjEuMjUqcyxkYXNoOls2KnMsNCpzXX0se3NwYWNlOiJzcmdiIixjb2xvcjoicmdiYSgyNTUsMjU1LDI1NSwwLjcpIixsaW5lV2lkdGg6MS41KnMsZGFzaDpbXX1dfVtyXSk/dTpbe3NwYWNlOiJwcm9waG90by1yZ2IiLGNvbG9yOiJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiLGxpbmVXaWR0aDouNzUqcyxkYXNoOlsyKnMsMypzXX0se3NwYWNlOiJyZWMyMDIwIixjb2xvcjoicmdiYSgyNTUsMjU1LDI1NSwwLjQpIixsaW5lV2lkdGg6MSpzLGRhc2g6WzMqcywzKnNdfSx7c3BhY2U6InAzIixjb2xvcjoicmdiYSgyNTUsMjU1LDI1NSwwLjU1KSIsbGluZVdpZHRoOjEuMjUqcyxkYXNoOls2KnMsNCpzXX0se3NwYWNlOiJzcmdiIixjb2xvcjoicmdiYSgyNTUsMjU1LDI1NSwwLjcpIixsaW5lV2lkdGg6MS41KnMsZGFzaDpbXX1dO2lmKCJyb3ctc2NhbiI9PT1lLmdhbXV0Qm91bmRhcnkpe2NvbnN0IHI9MTAwO2Zvcihjb25zdCBzIG9mIGQpaWYoIWl8fCFsfHxzLnNwYWNlIT09bCl0cnl7Y29uc3QgbD1bXTtmb3IobGV0IGM9MDtjPD1yO2MrKyl7Y29uc3QgdT1jL3IsaD1OdChlKSt1Kkh0KGUpLGQ9WzAsMCwwXTtpZihkW2UuZml4ZWRJbmRleF09YSxkW2UueUluZGV4XT1oLGRbZS54SW5kZXhdPTAsSnQodCxkLHMuc3BhY2UpKWlmKGkpe2NvbnN0IHI9RnQoaSx1KTtpZihyPD0wKWNvbnRpbnVlO2xldCBjPTAsZD1yO2ZvcihsZXQgbj0wO248MTA7bisrKXtjb25zdCByPShjK2QpLzIsbj1bMCwwLDBdO25bZS5maXhlZEluZGV4XT1hLG5bZS54SW5kZXhdPXIsbltlLnlJbmRleF09aCxKdCh0LG4scy5zcGFjZSk/Yz1yOmQ9cn1jb25zdCBwPWMvcipuLGY9KDEtdSkqbztsLnB1c2goe3g6cCx5OmZ9KX1lbHNle2xldCByPTAsaT0xO2ZvcihsZXQgbj0wO248MTA7bisrKXtjb25zdCBuPShyK2kpLzIsbz1EdChlKStuKlR0KGUpLGw9WzAsMCwwXTtsW2UuZml4ZWRJbmRleF09YSxsW2UueEluZGV4XT1vLGxbZS55SW5kZXhdPWgsSnQodCxsLHMuc3BhY2UpP3I9bjppPW59Y29uc3QgYz1yKm4sZD0oMS11KSpvO2wucHVzaCh7eDpjLHk6ZH0pfX1oLnB1c2goe3BvaW50czpsLGNsb3NlZDohMSxjb2xvcjpzLmNvbG9yLGxpbmVXaWR0aDpzLmxpbmVXaWR0aCxkYXNoOnMuZGFzaH0pfWNhdGNoe319ZWxzZSBpZigicG9sYXItc2NhbiI9PT1lLmdhbXV0Qm91bmRhcnkpe2NvbnN0IHI9MTgwO2Zvcihjb25zdCBzIG9mIGQpaWYoIWN8fCFsfHxzLnNwYWNlIT09bCl0cnl7Y29uc3QgaT1bXTtmb3IobGV0IGw9MDtsPD1yO2wrKyl7Y29uc3QgdT1sL3IqTWF0aC5QSSoyLGg9TWF0aC5jb3ModSksZD1NYXRoLnNpbih1KTtpZihjKXtjb25zdCByPVh0KGMsdSk7aWYocjw9MCljb250aW51ZTtsZXQgbD0wLHA9cjtmb3IobGV0IG49MDtuPDEwO24rKyl7Y29uc3Qgcj0obCtwKS8yLG49WzAsMCwwXTtuW2UuZml4ZWRJbmRleF09YSxuW2UueEluZGV4XT1yKmgsbltlLnlJbmRleF09cipkLEp0KHQsbixzLnNwYWNlKT9sPXI6cD1yfWNvbnN0IGY9bC9yKigxL01hdGgubWF4KE1hdGguYWJzKGgpLE1hdGguYWJzKGQpKSksbT0oZipoKzEpLzIqbixnPSgxLShmKmQrMSkvMikqbztpLnB1c2goe3g6bSx5Omd9KX1lbHNle2xldCByPTAsbD0xO2ZvcihsZXQgbj0wO248MTA7bisrKXtjb25zdCBuPShyK2wpLzIsbz1uKmgqVHQoZSkvMixpPW4qZCpIdChlKS8yLGM9WzAsMCwwXTtjW2UuZml4ZWRJbmRleF09YSxjW2UueEluZGV4XT1vLGNbZS55SW5kZXhdPWksSnQodCxjLHMuc3BhY2UpP3I9bjpsPW59Y29uc3QgYz1yKmgqVHQoZSkvMix1PXIqZCpIdChlKS8yLHA9KGMtRHQoZSkpL1R0KGUpLGY9KHUtTnQoZSkpL0h0KGUpLG09cCpuLGc9KDEtZikqbztpLnB1c2goe3g6bSx5Omd9KX19aC5wdXNoKHtwb2ludHM6aSxjbG9zZWQ6ITAsY29sb3I6cy5jb2xvcixsaW5lV2lkdGg6cy5saW5lV2lkdGgsZGFzaDpzLmRhc2h9KX1jYXRjaHt9fXJldHVybiBofShnLHIsbixhLGgsZCxpLGIsbSxNKTpbXTtzZWxmLnBvc3RNZXNzYWdlKHtpZDp0LHBpeGVsczp5LmJ1ZmZlcixXOnAsSDpmLGJhY2tpbmdXOmgsYmFja2luZ0g6ZCxlZmZDb25maWc6ZyxjaHJvbWFMVVQ6Yixwb2xhckxVVDpNLGJvdW5kYXJpZXM6eH0sW3kuYnVmZmVyXSl9fSgpOwovLyMgc291cmNlTWFwcGluZ1VSTD1hcmVhLXBpY2tlci53b3JrZXItQ2tsOUNKeHcuanMubWFwCg==";
const decodeBase64 = (base64) => Uint8Array.from(atob(base64), (c4) => c4.charCodeAt(0));
const blob = typeof self !== "undefined" && self.Blob && new Blob([decodeBase64(encodedJs)], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper(options) {
  let objURL;
  try {
    objURL = blob && (self.URL || self.webkitURL).createObjectURL(blob);
    if (!objURL) throw "";
    const worker = new Worker(objURL, {
      name: options == null ? void 0 : options.name
    });
    worker.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(objURL);
    });
    return worker;
  } catch (e2) {
    return new Worker(
      "data:text/javascript;base64," + encodedJs,
      {
        name: options == null ? void 0 : options.name
      }
    );
  } finally {
    objURL && (self.URL || self.webkitURL).revokeObjectURL(objURL);
  }
}
const cfgXMin = (c4) => {
  var _a2;
  return (_a2 = c4.xMin) != null ? _a2 : 0;
};
const cfgYMin = (c4) => {
  var _a2;
  return (_a2 = c4.yMin) != null ? _a2 : 0;
};
const cfgXRange = (c4) => c4.xMax - cfgXMin(c4);
const cfgYRange = (c4) => c4.yMax - cfgYMin(c4);
function lerpLUT(lut, t2) {
  const n2 = lut.length - 1;
  const i2 = Math.max(0, Math.min(n2, t2 * n2));
  const lo = Math.floor(i2);
  const hi = Math.min(lo + 1, n2);
  const f2 = i2 - lo;
  return lut[lo] * (1 - f2) + lut[hi] * f2;
}
const AREA_CONFIGS = {
  okhsv: {
    fixedIndex: 0,
    xIndex: 1,
    xMax: 1,
    xStep: 1 / 100,
    yIndex: 2,
    yMax: 1,
    yStep: 1 / 100
  },
  oklch: {
    fixedIndex: 2,
    xIndex: 1,
    xMax: 0.37,
    xStep: 0.37 / 100,
    yIndex: 0,
    yMax: 1,
    yStep: 1 / 100,
    gamutBoundary: "row-scan"
  },
  hsl: {
    fixedIndex: 0,
    xIndex: 1,
    xMax: 100,
    xStep: 1,
    yIndex: 2,
    yMax: 100,
    yStep: 1
  },
  oklab: {
    fixedIndex: 0,
    xIndex: 1,
    xMin: -0.33,
    xMax: 0.33,
    xStep: 0.66 / 100,
    yIndex: 2,
    yMin: -0.33,
    yMax: 0.33,
    yStep: 0.66 / 100,
    gamutBoundary: "polar-scan"
  },
  lab: {
    fixedIndex: 0,
    xIndex: 1,
    xMin: -110,
    xMax: 110,
    xStep: 220 / 100,
    yIndex: 2,
    yMin: -110,
    yMax: 110,
    yStep: 220 / 100,
    gamutBoundary: "polar-scan"
  },
  hwb: {
    fixedIndex: 0,
    xIndex: 1,
    xMax: 100,
    xStep: 1,
    yIndex: 2,
    yMax: 100,
    yStep: 1,
    gamutBoundary: "diagonal",
    xInvert: true,
    yInvert: true
  }
};
const getAreaConfig = (color) => {
  if (color) {
    return AREA_CONFIGS[color.spaceId];
  }
};
const supportsP3Canvas = (() => {
  var _a2, _b2;
  try {
    const c4 = document.createElement("canvas");
    c4.width = 1;
    c4.height = 1;
    const ctx = c4.getContext("2d", { colorSpace: "display-p3" });
    return ((_b2 = (_a2 = ctx == null ? void 0 : ctx.getContextAttributes) == null ? void 0 : _a2.call(ctx)) == null ? void 0 : _b2.colorSpace) === "display-p3";
  } catch {
    return false;
  }
})();
function renderAreaGradient(canvas, getColor2, dpr) {
  const cssW = canvas.clientWidth || 320;
  const cssH = canvas.clientHeight || 200;
  const backingW = Math.round(cssW * dpr);
  const backingH = Math.round(cssH * dpr);
  const canvasColorSpace = supportsP3Canvas ? "display-p3" : "srgb";
  const targetSpace = supportsP3Canvas ? "p3" : "srgb";
  const W = Math.round(backingW / 2);
  const H = Math.round(backingH / 2);
  const offscreen = document.createElement("canvas");
  offscreen.width = W;
  offscreen.height = H;
  const offCtx = offscreen.getContext("2d", { colorSpace: canvasColorSpace });
  if (!offCtx) {
    return;
  }
  const img = offCtx.createImageData(W, H);
  const d2 = img.data;
  for (let y2 = 0; y2 < H; y2++) {
    const Y = 1 - y2 / (H - 1);
    for (let x = 0; x < W; x++) {
      const X = x / (W - 1);
      const [r, g2, b2] = to(getColor2(X, Y), targetSpace).coords;
      const i2 = (y2 * W + x) * 4;
      d2[i2] = Math.round(Math.max(0, Math.min(1, r != null ? r : 0)) * 255);
      d2[i2 + 1] = Math.round(Math.max(0, Math.min(1, g2 != null ? g2 : 0)) * 255);
      d2[i2 + 2] = Math.round(Math.max(0, Math.min(1, b2 != null ? b2 : 0)) * 255);
      d2[i2 + 3] = 255;
    }
  }
  offCtx.putImageData(img, 0, 0);
  canvas.width = backingW;
  canvas.height = backingH;
  const ctx = canvas.getContext("2d", { colorSpace: canvasColorSpace });
  if (!ctx) {
    return;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(offscreen, 0, 0, backingW, backingH);
  return ctx;
}
function isInGamut(spaceId, coords, gamutSpace) {
  const converted = to({ spaceId, coords, alpha: 1 }, gamutSpace);
  return inGamut({ spaceId: gamutSpace, coords: converted.coords, alpha: null });
}
function getStretchGamut(userSpaceId) {
  switch (userSpaceId) {
    case "p3":
      return "p3";
    case "a98rgb":
      return "a98rgb";
    case "rec2020":
      return "rec2020";
    case "prophoto-rgb":
      return "prophoto-rgb";
    default:
      return "p3";
  }
}
function computeChromaLUT(config, spaceId, fixedValue, gamutSpace, size) {
  const lut = new Float64Array(size);
  const maxSearch = 0.5;
  for (let i2 = 0; i2 < size; i2++) {
    const yNorm = i2 / (size - 1);
    const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
    const coords = [0, 0, 0];
    coords[config.fixedIndex] = fixedValue;
    coords[config.yIndex] = yVal;
    coords[config.xIndex] = 0;
    if (!isInGamut(spaceId, coords, gamutSpace)) {
      lut[i2] = 0;
      continue;
    }
    let lo = 0, hi = maxSearch;
    for (let j = 0; j < 16; j++) {
      const mid = (lo + hi) / 2;
      const c4 = [0, 0, 0];
      c4[config.fixedIndex] = fixedValue;
      c4[config.xIndex] = mid;
      c4[config.yIndex] = yVal;
      if (isInGamut(spaceId, c4, gamutSpace)) lo = mid;
      else hi = mid;
    }
    lut[i2] = lo;
  }
  return lut;
}
function computePolarLUT(config, spaceId, fixedValue, gamutSpace, size) {
  const lut = new Float64Array(size);
  const halfX = cfgXRange(config) / 2;
  const halfY = cfgYRange(config) / 2;
  const maxSearch = Math.sqrt(halfX * halfX + halfY * halfY) * 1.5;
  for (let i2 = 0; i2 < size; i2++) {
    const angle = i2 / size * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let lo = 0, hi = maxSearch;
    for (let j = 0; j < 16; j++) {
      const mid = (lo + hi) / 2;
      const coords = [0, 0, 0];
      coords[config.fixedIndex] = fixedValue;
      coords[config.xIndex] = mid * dx;
      coords[config.yIndex] = mid * dy;
      if (isInGamut(spaceId, coords, gamutSpace)) lo = mid;
      else hi = mid;
    }
    lut[i2] = lo;
  }
  return lut;
}
function lerpAngleLUT(lut, angle) {
  const n2 = lut.length;
  const a2 = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  const idx = a2 / (Math.PI * 2) * n2;
  const lo = Math.floor(idx) % n2;
  const hi = (lo + 1) % n2;
  const f2 = idx - Math.floor(idx);
  return lut[lo] * (1 - f2) + lut[hi] * f2;
}
function polarStretchToColor(cx, cy, polarLUT) {
  const dist = Math.sqrt(cx * cx + cy * cy);
  if (dist < 1e-10) return [0, 0];
  const angle = Math.atan2(cy, cx);
  const edgeDist = 1 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
  const t2 = Math.min(1, dist / edgeDist);
  const maxR = lerpAngleLUT(polarLUT, angle);
  const r = t2 * maxR;
  return [r * Math.cos(angle), r * Math.sin(angle)];
}
function colorToPolarStretch(a2, b2, polarLUT) {
  const r = Math.sqrt(a2 * a2 + b2 * b2);
  if (r < 1e-10) return [0, 0];
  const angle = Math.atan2(b2, a2);
  const maxR = lerpAngleLUT(polarLUT, angle);
  const t2 = maxR > 0 ? Math.min(1, r / maxR) : 0;
  const edgeDist = 1 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
  const canvasDist = t2 * edgeDist;
  return [canvasDist * Math.cos(angle), canvasDist * Math.sin(angle)];
}
function drawBoundaryLine(ctx, points, closed, color, lineWidth, dash) {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i2 = 1; i2 < points.length; i2++) {
    ctx.lineTo(points[i2].x, points[i2].y);
  }
  if (closed) ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
function renderGamutBoundaries(ctx, config, spaceId, userSpaceId, fixedValue, dpr, chromaLUT, stretchGamut, polarLUT) {
  var _a2;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  if (config.gamutBoundary === "diagonal") {
    return;
  }
  const defaultGamuts = [
    { space: "prophoto-rgb", color: "rgba(255,255,255,0.3)", lineWidth: 0.75 * dpr, dash: [2 * dpr, 3 * dpr] },
    { space: "rec2020", color: "rgba(255,255,255,0.4)", lineWidth: 1 * dpr, dash: [3 * dpr, 3 * dpr] },
    { space: "p3", color: "rgba(255,255,255,0.55)", lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
    { space: "srgb", color: "rgba(255,255,255,0.7)", lineWidth: 1.5 * dpr, dash: [] }
  ];
  const focusedBoundaries = {
    "a98rgb": [
      { space: "a98rgb", color: "rgba(255,255,255,0.55)", lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: "srgb", color: "rgba(255,255,255,0.7)", lineWidth: 1.5 * dpr, dash: [] }
    ],
    "prophoto-rgb": [
      { space: "prophoto-rgb", color: "rgba(255,255,255,0.55)", lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: "srgb", color: "rgba(255,255,255,0.7)", lineWidth: 1.5 * dpr, dash: [] }
    ],
    "rec2020": [
      { space: "rec2020", color: "rgba(255,255,255,0.55)", lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: "srgb", color: "rgba(255,255,255,0.7)", lineWidth: 1.5 * dpr, dash: [] }
    ],
    "p3": [
      { space: "p3", color: "rgba(255,255,255,0.55)", lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: "srgb", color: "rgba(255,255,255,0.7)", lineWidth: 1.5 * dpr, dash: [] }
    ]
  };
  const gamuts = (_a2 = focusedBoundaries[userSpaceId]) != null ? _a2 : defaultGamuts;
  if (config.gamutBoundary === "row-scan") {
    const ROWS = 100;
    for (const gamut of gamuts) {
      if (chromaLUT && stretchGamut && gamut.space === stretchGamut) continue;
      try {
        const points = [];
        for (let row = 0; row <= ROWS; row++) {
          const yNorm = row / ROWS;
          const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
          const coords = [0, 0, 0];
          coords[config.fixedIndex] = fixedValue;
          coords[config.yIndex] = yVal;
          coords[config.xIndex] = 0;
          if (!isInGamut(spaceId, coords, gamut.space)) continue;
          if (chromaLUT) {
            const maxChromaOuter = lerpLUT(chromaLUT, yNorm);
            if (maxChromaOuter <= 0) continue;
            let lo = 0, hi = maxChromaOuter;
            for (let i2 = 0; i2 < 10; i2++) {
              const mid = (lo + hi) / 2;
              const c4 = [0, 0, 0];
              c4[config.fixedIndex] = fixedValue;
              c4[config.xIndex] = mid;
              c4[config.yIndex] = yVal;
              if (isInGamut(spaceId, c4, gamut.space)) lo = mid;
              else hi = mid;
            }
            const xCanvas = lo / maxChromaOuter * W;
            const yCanvas = (1 - yNorm) * H;
            points.push({ x: xCanvas, y: yCanvas });
          } else {
            let lo = 0, hi = 1;
            for (let i2 = 0; i2 < 10; i2++) {
              const mid = (lo + hi) / 2;
              const xVal = cfgXMin(config) + mid * cfgXRange(config);
              const c4 = [0, 0, 0];
              c4[config.fixedIndex] = fixedValue;
              c4[config.xIndex] = xVal;
              c4[config.yIndex] = yVal;
              if (isInGamut(spaceId, c4, gamut.space)) lo = mid;
              else hi = mid;
            }
            const xCanvas = lo * W;
            const yCanvas = (1 - yNorm) * H;
            points.push({ x: xCanvas, y: yCanvas });
          }
        }
        drawBoundaryLine(ctx, points, false, gamut.color, gamut.lineWidth, gamut.dash);
      } catch {
      }
    }
  } else if (config.gamutBoundary === "polar-scan") {
    const ANGLES = 180;
    for (const gamut of gamuts) {
      if (polarLUT && stretchGamut && gamut.space === stretchGamut) continue;
      try {
        const points = [];
        for (let i2 = 0; i2 <= ANGLES; i2++) {
          const angle = i2 / ANGLES * Math.PI * 2;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);
          if (polarLUT) {
            const maxROuter = lerpAngleLUT(polarLUT, angle);
            if (maxROuter <= 0) continue;
            let lo = 0, hi = maxROuter;
            for (let j = 0; j < 10; j++) {
              const mid = (lo + hi) / 2;
              const coords = [0, 0, 0];
              coords[config.fixedIndex] = fixedValue;
              coords[config.xIndex] = mid * dx;
              coords[config.yIndex] = mid * dy;
              if (isInGamut(spaceId, coords, gamut.space)) lo = mid;
              else hi = mid;
            }
            const t2 = lo / maxROuter;
            const edgeDist = 1 / Math.max(Math.abs(dx), Math.abs(dy));
            const canvasDist = t2 * edgeDist;
            const cx = canvasDist * dx;
            const cy = canvasDist * dy;
            const xCanvas = (cx + 1) / 2 * W;
            const yCanvas = (1 - (cy + 1) / 2) * H;
            points.push({ x: xCanvas, y: yCanvas });
          } else {
            let lo = 0, hi = 1;
            for (let j = 0; j < 10; j++) {
              const mid = (lo + hi) / 2;
              const xVal2 = mid * dx * cfgXRange(config) / 2;
              const yVal2 = mid * dy * cfgYRange(config) / 2;
              const coords = [0, 0, 0];
              coords[config.fixedIndex] = fixedValue;
              coords[config.xIndex] = xVal2;
              coords[config.yIndex] = yVal2;
              if (isInGamut(spaceId, coords, gamut.space)) lo = mid;
              else hi = mid;
            }
            const xVal = lo * dx * cfgXRange(config) / 2;
            const yVal = lo * dy * cfgYRange(config) / 2;
            const xNorm = (xVal - cfgXMin(config)) / cfgXRange(config);
            const yNorm = (yVal - cfgYMin(config)) / cfgYRange(config);
            const xCanvas = xNorm * W;
            const yCanvas = (1 - yNorm) * H;
            points.push({ x: xCanvas, y: yCanvas });
          }
        }
        drawBoundaryLine(ctx, points, true, gamut.color, gamut.lineWidth, gamut.dash);
      } catch {
      }
    }
  }
}
class AreaPicker {
  constructor(element, onChange) {
    __privateAdd(this, _area);
    __privateAdd(this, _controller, new AbortController());
    __privateAdd(this, _color, d$1(null));
    __privateAdd(this, _space, d$1(null));
    // store color during drag to prevent jitter from conversions
    __privateAdd(this, _draggingColor, d$1(null));
    __privateAdd(this, _effectiveConfig, d$1(null));
    __privateAdd(this, _chromaLUT, d$1(null));
    __privateAdd(this, _polarLUT, d$1(null));
    __privateAdd(this, _worker, null);
    __privateAdd(this, _renderSeqId, 0);
    __privateAdd(this, _lastRenderedId, 0);
    __privateAdd(this, _workerBusy, false);
    __privateAdd(this, _pendingWorkerMsg, null);
    __privateSet(this, _area, element);
    const canvas = element == null ? void 0 : element.querySelector(".area-canvas");
    if (!element || !canvas) {
      return;
    }
    try {
      __privateSet(this, _worker, new WorkerWrapper());
      __privateGet(this, _worker).onmessage = (e2) => {
        const result = e2.data;
        if (result.id < __privateGet(this, _lastRenderedId)) return;
        __privateSet(this, _lastRenderedId, result.id);
        __privateGet(this, _effectiveConfig).value = result.effConfig;
        __privateGet(this, _chromaLUT).value = result.chromaLUT;
        __privateGet(this, _polarLUT).value = result.polarLUT;
        const canvasColorSpace = supportsP3Canvas ? "display-p3" : "srgb";
        const offscreen = document.createElement("canvas");
        offscreen.width = result.W;
        offscreen.height = result.H;
        const offCtx = offscreen.getContext("2d", { colorSpace: canvasColorSpace });
        if (!offCtx) return;
        const img = offCtx.createImageData(result.W, result.H);
        img.data.set(new Uint8ClampedArray(result.pixels));
        offCtx.putImageData(img, 0, 0);
        canvas.width = result.backingW;
        canvas.height = result.backingH;
        const ctx = canvas.getContext("2d", { colorSpace: canvasColorSpace });
        if (!ctx) return;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(offscreen, 0, 0, result.backingW, result.backingH);
        for (const b2 of result.boundaries) {
          drawBoundaryLine(ctx, b2.points, b2.closed, b2.color, b2.lineWidth, b2.dash);
        }
        __privateSet(this, _workerBusy, false);
        if (__privateGet(this, _pendingWorkerMsg)) {
          const msg = __privateGet(this, _pendingWorkerMsg);
          __privateSet(this, _pendingWorkerMsg, null);
          __privateSet(this, _workerBusy, true);
          __privateGet(this, _worker).postMessage(msg);
        }
      };
      __privateGet(this, _worker).onerror = () => {
        var _a2;
        __privateSet(this, _workerBusy, false);
        __privateSet(this, _pendingWorkerMsg, null);
        (_a2 = __privateGet(this, _worker)) == null ? void 0 : _a2.terminate();
        __privateSet(this, _worker, null);
      };
    } catch {
      __privateSet(this, _worker, null);
    }
    const handleChange = (newColor, isDragging = false) => {
      if (!__privateGet(this, _space).value) {
        return;
      }
      const space = __privateGet(this, _space).value;
      const targetSpace = getColorJSSpaceID(
        space === "hex" ? "srgb" : space
      );
      const targetColor = to(newColor, targetSpace, { inGamut: true });
      const serialized = serialize(targetColor, {
        format: space === "hex" ? "hex" : void 0
      });
      onChange(
        // reformat color
        gencolor(space, parseIntoChannels(space, serialized).ch),
        isDragging
      );
    };
    const thumb = element.querySelector(".area-thumb");
    let pointerOffset = { x: 0, y: 0 };
    let cachedRect = null;
    const handleMove = (event) => {
      var _a2, _b2, _c2, _d2, _e2;
      const color = (_a2 = __privateGet(this, _draggingColor).value) != null ? _a2 : __privateGet(this, _color).value;
      const config = (_b2 = __privateGet(this, _effectiveConfig).value) != null ? _b2 : getAreaConfig(color);
      if (!color || !config) {
        return;
      }
      const rect = cachedRect != null ? cachedRect : element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width - pointerOffset.x));
      const y2 = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height - pointerOffset.y));
      const newCoords = [(_c2 = color.coords[0]) != null ? _c2 : 0, (_d2 = color.coords[1]) != null ? _d2 : 0, (_e2 = color.coords[2]) != null ? _e2 : 0];
      const xN = config.xInvert ? 1 - x : x;
      const yN = config.yInvert ? 1 - y2 : y2;
      const chromaLUT = __privateGet(this, _chromaLUT).value;
      const polarLUT = __privateGet(this, _polarLUT).value;
      if (polarLUT) {
        const cx = xN * 2 - 1;
        const cy = yN * 2 - 1;
        const [a2, b2] = polarStretchToColor(cx, cy, polarLUT);
        newCoords[config.xIndex] = a2;
        newCoords[config.yIndex] = b2;
      } else if (chromaLUT) {
        newCoords[config.xIndex] = xN * lerpLUT(chromaLUT, yN);
        newCoords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
      } else {
        newCoords[config.xIndex] = cfgXMin(config) + xN * cfgXRange(config);
        newCoords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
      }
      __privateGet(this, _draggingColor).value = { ...color, coords: newCoords };
      handleChange(__privateGet(this, _draggingColor).value, true);
    };
    element.addEventListener(
      "pointerdown",
      (event) => {
        var _a2;
        element.setPointerCapture(event.pointerId);
        cachedRect = element.getBoundingClientRect();
        if (thumb && (event.target === thumb || thumb.contains(event.target))) {
          const rect = element.getBoundingClientRect();
          const thumbRect = thumb.getBoundingClientRect();
          const thumbCenterX = (thumbRect.left + thumbRect.width / 2 - rect.left) / rect.width;
          const thumbCenterY = 1 - (thumbRect.top + thumbRect.height / 2 - rect.top) / rect.height;
          const pointerX = (event.clientX - rect.left) / rect.width;
          const pointerY = 1 - (event.clientY - rect.top) / rect.height;
          pointerOffset = { x: pointerX - thumbCenterX, y: pointerY - thumbCenterY };
          const color = (_a2 = __privateGet(this, _draggingColor).value) != null ? _a2 : __privateGet(this, _color).value;
          if (color) {
            __privateGet(this, _draggingColor).value = { ...color, coords: structuredClone(color.coords) };
          }
        } else {
          pointerOffset = { x: 0, y: 0 };
          handleMove(event);
        }
      },
      { signal: __privateGet(this, _controller).signal }
    );
    element.addEventListener(
      "pointermove",
      (event) => {
        if (__privateGet(this, _draggingColor).value) {
          event.preventDefault();
          handleMove(event);
        }
      },
      { signal: __privateGet(this, _controller).signal }
    );
    element.addEventListener(
      "pointerup",
      (event) => {
        element.releasePointerCapture(event.pointerId);
        const color = __privateGet(this, _draggingColor).value;
        if (color) {
          handleChange(color, false);
        }
        __privateGet(this, _draggingColor).value = null;
        pointerOffset = { x: 0, y: 0 };
        cachedRect = null;
      },
      { signal: __privateGet(this, _controller).signal }
    );
    element.addEventListener(
      "pointercancel",
      () => {
        __privateGet(this, _draggingColor).value = null;
        pointerOffset = { x: 0, y: 0 };
        cachedRect = null;
      },
      { signal: __privateGet(this, _controller).signal }
    );
    element.addEventListener(
      "keydown",
      (event) => {
        var _a2, _b2, _c2, _d2, _e2, _f;
        const color = __privateGet(this, _color).value;
        const config = (_a2 = __privateGet(this, _effectiveConfig).value) != null ? _a2 : getAreaConfig(color);
        if (!color || !config) {
          return;
        }
        let xDelta = 0;
        let yDelta = 0;
        switch (event.key) {
          case "ArrowRight":
            xDelta = 1;
            break;
          case "ArrowLeft":
            xDelta = -1;
            break;
          case "ArrowUp":
            yDelta = 1;
            break;
          case "ArrowDown":
            yDelta = -1;
            break;
          default:
            return;
        }
        event.preventDefault();
        const prevX = (_b2 = color.coords[config.xIndex]) != null ? _b2 : 0;
        const prevY = (_c2 = color.coords[config.yIndex]) != null ? _c2 : 0;
        const effXDelta = config.xInvert ? -xDelta : xDelta;
        const effYDelta = config.yInvert ? -yDelta : yDelta;
        const newCoords = [(_d2 = color.coords[0]) != null ? _d2 : 0, (_e2 = color.coords[1]) != null ? _e2 : 0, (_f = color.coords[2]) != null ? _f : 0];
        const chromaLUT = __privateGet(this, _chromaLUT).value;
        const polarLUT = __privateGet(this, _polarLUT).value;
        if (polarLUT) {
          const xMaxR = lerpAngleLUT(polarLUT, 0);
          const yMaxR = lerpAngleLUT(polarLUT, Math.PI / 2);
          const xStep = xMaxR / 50;
          const yStep = yMaxR / 50;
          newCoords[config.xIndex] = prevX + effXDelta * xStep;
          newCoords[config.yIndex] = prevY + effYDelta * yStep;
        } else if (chromaLUT) {
          const yNorm = (prevY - cfgYMin(config)) / cfgYRange(config);
          const maxChroma = lerpLUT(chromaLUT, yNorm);
          const xStep = maxChroma / 100;
          newCoords[config.xIndex] = Math.max(0, Math.min(maxChroma, prevX + effXDelta * xStep));
          newCoords[config.yIndex] = Math.max(cfgYMin(config), Math.min(config.yMax, prevY + effYDelta * config.yStep));
        } else {
          newCoords[config.xIndex] = Math.max(cfgXMin(config), Math.min(config.xMax, prevX + effXDelta * config.xStep));
          newCoords[config.yIndex] = Math.max(cfgYMin(config), Math.min(config.yMax, prevY + effYDelta * config.yStep));
        }
        handleChange({ ...color, coords: newCoords });
      },
      { signal: __privateGet(this, _controller).signal }
    );
    const cleanupDragging = E(() => {
      const isDragging = __privateGet(this, _draggingColor).value != null;
      element.classList.toggle("dragging", isDragging);
      document.body.inert = isDragging;
    });
    const cleanupColor = E(() => {
      var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j;
      const color = (_a2 = __privateGet(this, _draggingColor).value) != null ? _a2 : __privateGet(this, _color).value;
      const config = (_b2 = __privateGet(this, _effectiveConfig).value) != null ? _b2 : getAreaConfig(color);
      if (!color || !config) {
        return;
      }
      const chromaLUT = __privateGet(this, _chromaLUT).value;
      const polarLUT = __privateGet(this, _polarLUT).value;
      let x, y2;
      if (polarLUT) {
        const a2 = (_c2 = color.coords[config.xIndex]) != null ? _c2 : 0;
        const b2 = (_d2 = color.coords[config.yIndex]) != null ? _d2 : 0;
        const [cx, cy] = colorToPolarStretch(a2, b2, polarLUT);
        x = (cx + 1) / 2 * 100;
        y2 = (cy + 1) / 2 * 100;
      } else if (chromaLUT) {
        const yNorm = (((_e2 = color.coords[config.yIndex]) != null ? _e2 : 0) - cfgYMin(config)) / cfgYRange(config);
        const maxChroma = lerpLUT(chromaLUT, yNorm);
        x = maxChroma > 0 ? Math.min(100, ((_f = color.coords[config.xIndex]) != null ? _f : 0) / maxChroma * 100) : 0;
        y2 = yNorm * 100;
      } else {
        x = (((_g = color.coords[config.xIndex]) != null ? _g : 0) - cfgXMin(config)) / cfgXRange(config) * 100;
        y2 = (((_h = color.coords[config.yIndex]) != null ? _h : 0) - cfgYMin(config)) / cfgYRange(config) * 100;
      }
      (_i = __privateGet(this, _area)) == null ? void 0 : _i.style.setProperty("--thumb-x", `${config.xInvert ? 100 - x : x}%`);
      (_j = __privateGet(this, _area)) == null ? void 0 : _j.style.setProperty("--thumb-y", `${config.yInvert ? y2 : 100 - y2}%`);
    });
    let animationId = null;
    let pendingHue = null;
    const hue = w(() => {
      var _a2, _b2;
      const color = (_a2 = __privateGet(this, _draggingColor).value) != null ? _a2 : __privateGet(this, _color).value;
      const config = getAreaConfig(color);
      if (!config) {
        return 0;
      }
      return (_b2 = color == null ? void 0 : color.coords[config.fixedIndex]) != null ? _b2 : 0;
    });
    const cleanupHue = E(() => {
      pendingHue = hue.value;
      __privateGet(this, _space).value;
      if (animationId === null) {
        animationId = requestAnimationFrame(() => {
          try {
            if (canvas && pendingHue !== null && __privateGet(this, _space).value) {
              const color = __privateGet(this, _color).value;
              const config = getAreaConfig(color);
              if (!color || !config) {
                return;
              }
              const dpr = window.devicePixelRatio || 1;
              const userSpaceId = config.gamutBoundary ? getColorJSSpaceID(__privateGet(this, _space).value === "hex" ? "srgb" : __privateGet(this, _space).value) : "";
              if (__privateGet(this, _worker)) {
                const msg = {
                  id: ++__privateWrapper(this, _renderSeqId)._,
                  spaceId: color.spaceId,
                  fixedValue: pendingHue != null ? pendingHue : 0,
                  userSpaceId,
                  cssW: canvas.clientWidth || 320,
                  cssH: canvas.clientHeight || 200,
                  dpr,
                  supportsP3: supportsP3Canvas
                };
                if (__privateGet(this, _workerBusy)) {
                  __privateSet(this, _pendingWorkerMsg, msg);
                } else {
                  __privateSet(this, _workerBusy, true);
                  __privateGet(this, _worker).postMessage(msg);
                }
              } else {
                let effCfg = config;
                let chromaLUT = null;
                let polarLUT = null;
                let stretchGamut;
                if (config.gamutBoundary === "row-scan") {
                  stretchGamut = getStretchGamut(userSpaceId);
                  try {
                    chromaLUT = computeChromaLUT(config, color.spaceId, pendingHue != null ? pendingHue : 0, stretchGamut, 128);
                  } catch {
                  }
                } else if (config.gamutBoundary === "polar-scan") {
                  stretchGamut = getStretchGamut(userSpaceId);
                  try {
                    polarLUT = computePolarLUT(config, color.spaceId, pendingHue != null ? pendingHue : 0, stretchGamut, 180);
                  } catch {
                  }
                }
                __privateGet(this, _effectiveConfig).value = effCfg;
                __privateGet(this, _chromaLUT).value = chromaLUT;
                __privateGet(this, _polarLUT).value = polarLUT;
                const ctx = renderAreaGradient(canvas, (x, y2) => {
                  const coords = [0, 0, 0];
                  coords[effCfg.fixedIndex] = pendingHue != null ? pendingHue : 0;
                  const xN = effCfg.xInvert ? 1 - x : x;
                  const yN = effCfg.yInvert ? 1 - y2 : y2;
                  if (polarLUT) {
                    const cx = xN * 2 - 1;
                    const cy = yN * 2 - 1;
                    const [a2, b2] = polarStretchToColor(cx, cy, polarLUT);
                    coords[effCfg.xIndex] = a2;
                    coords[effCfg.yIndex] = b2;
                  } else if (chromaLUT) {
                    coords[effCfg.xIndex] = xN * lerpLUT(chromaLUT, yN);
                    coords[effCfg.yIndex] = cfgYMin(effCfg) + yN * cfgYRange(effCfg);
                  } else {
                    coords[effCfg.xIndex] = cfgXMin(effCfg) + xN * cfgXRange(effCfg);
                    coords[effCfg.yIndex] = cfgYMin(effCfg) + yN * cfgYRange(effCfg);
                  }
                  return { spaceId: color.spaceId, coords, alpha: null };
                }, dpr);
                if (ctx && config.gamutBoundary) {
                  renderGamutBoundaries(ctx, effCfg, color.spaceId, userSpaceId, pendingHue != null ? pendingHue : 0, dpr, chromaLUT, stretchGamut, polarLUT);
                }
              }
            }
          } finally {
            animationId = null;
            pendingHue = null;
          }
        });
      }
    });
    __privateGet(this, _controller).signal.addEventListener("abort", () => {
      cleanupDragging();
      cleanupColor();
      cleanupHue();
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  }
  setValue(color, space) {
    __privateGet(this, _space).value = space;
    try {
      let colorObject;
      if (space === "oklch" || space === "lch") {
        colorObject = to(color, "oklch");
      } else if (space === "hsl") {
        colorObject = to(color, "hsl");
      } else if (space === "oklab") {
        colorObject = to(color, "oklab");
      } else if (space === "lab") {
        colorObject = to(color, "lab");
      } else if (space === "hwb") {
        colorObject = to(color, "hwb");
      } else if (isRGBLike(space)) {
        colorObject = to(color, "oklch");
      } else {
        colorObject = to(color, "okhsv");
      }
      __privateGet(this, _color).value = {
        spaceId: colorObject.space.id,
        coords: colorObject.coords,
        alpha: colorObject.alpha
      };
    } catch {
      __privateGet(this, _color).value = null;
    }
  }
  unmount() {
    var _a2;
    __privateGet(this, _controller).abort();
    (_a2 = __privateGet(this, _worker)) == null ? void 0 : _a2.terminate();
    __privateSet(this, _worker, null);
  }
}
_area = new WeakMap();
_controller = new WeakMap();
_color = new WeakMap();
_space = new WeakMap();
_draggingColor = new WeakMap();
_effectiveConfig = new WeakMap();
_chromaLUT = new WeakMap();
_polarLUT = new WeakMap();
_worker = new WeakMap();
_renderSeqId = new WeakMap();
_lastRenderedId = new WeakMap();
_workerBusy = new WeakMap();
_pendingWorkerMsg = new WeakMap();
const VIEWPORT_MARGIN = 8;
const GUTTER = 8;
let cachedInsets = null;
function getSafeAreaInsets() {
  if (cachedInsets) return cachedInsets;
  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.left = "-9999px";
  probe.style.top = "0";
  probe.style.paddingTop = "env(safe-area-inset-top)";
  probe.style.paddingRight = "env(safe-area-inset-right)";
  probe.style.paddingBottom = "env(safe-area-inset-bottom)";
  probe.style.paddingLeft = "env(safe-area-inset-left)";
  document.documentElement.appendChild(probe);
  const computed = getComputedStyle(probe);
  const top = parseFloat(computed.paddingTop) || 0;
  const right = parseFloat(computed.paddingRight) || 0;
  const bottom = parseFloat(computed.paddingBottom) || 0;
  const left = parseFloat(computed.paddingLeft) || 0;
  document.documentElement.removeChild(probe);
  cachedInsets = { top, right, bottom, left };
  return cachedInsets;
}
function getViewportClampRect(insets) {
  var _a2, _b2, _c2, _d2;
  const vw = (_b2 = (_a2 = window.visualViewport) == null ? void 0 : _a2.width) != null ? _b2 : window.innerWidth;
  const vh = (_d2 = (_c2 = window.visualViewport) == null ? void 0 : _c2.height) != null ? _d2 : window.innerHeight;
  const left = insets.left + VIEWPORT_MARGIN;
  const top = insets.top + VIEWPORT_MARGIN;
  const right = vw - insets.right - VIEWPORT_MARGIN;
  const bottom = vh - insets.bottom - VIEWPORT_MARGIN;
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top
  };
}
function computeCandidates(anchor, size) {
  const { width: w2, height: h2 } = size;
  const placements = [
    {
      placement: "top-center",
      left: anchor.left + anchor.width / 2 - w2 / 2,
      top: anchor.top - GUTTER - h2,
      right: 0,
      bottom: 0
    },
    {
      placement: "top-left",
      left: anchor.left,
      top: anchor.top - GUTTER - h2,
      right: 0,
      bottom: 0
    },
    {
      placement: "top-right",
      left: anchor.right - w2,
      top: anchor.top - GUTTER - h2,
      right: 0,
      bottom: 0
    },
    {
      placement: "bottom-center",
      left: anchor.left + anchor.width / 2 - w2 / 2,
      top: anchor.bottom + GUTTER,
      right: 0,
      bottom: 0
    },
    {
      placement: "bottom-left",
      left: anchor.left,
      top: anchor.bottom + GUTTER,
      right: 0,
      bottom: 0
    },
    {
      placement: "bottom-right",
      left: anchor.right - w2,
      top: anchor.bottom + GUTTER,
      right: 0,
      bottom: 0
    },
    {
      placement: "right-start",
      left: anchor.right + GUTTER,
      top: anchor.top,
      right: 0,
      bottom: 0
    },
    {
      placement: "left-start",
      left: anchor.left - GUTTER - w2,
      top: anchor.top,
      right: 0,
      bottom: 0
    }
  ];
  placements.forEach((p2) => {
    p2.right = p2.left + w2;
    p2.bottom = p2.top + h2;
  });
  return placements;
}
function findFirstFitOrMaxArea(candidates, viewport, lastPlacement) {
  if (lastPlacement) {
    const last = candidates.find((c4) => c4.placement === lastPlacement);
    if (last && fitsInside(last, viewport)) {
      return last;
    }
  }
  for (const c4 of candidates) {
    if (fitsInside(c4, viewport)) {
      return c4;
    }
  }
  let best = candidates[0];
  let maxArea = visibleArea(best, viewport);
  for (let i2 = 1; i2 < candidates.length; i2++) {
    const area = visibleArea(candidates[i2], viewport);
    if (area > maxArea) {
      maxArea = area;
      best = candidates[i2];
    }
  }
  return best;
}
function fitsInside(candidate, viewport) {
  return candidate.left >= viewport.left && candidate.top >= viewport.top && candidate.right <= viewport.right && candidate.bottom <= viewport.bottom;
}
function visibleArea(candidate, viewport) {
  const left = Math.max(candidate.left, viewport.left);
  const top = Math.max(candidate.top, viewport.top);
  const right = Math.min(candidate.right, viewport.right);
  const bottom = Math.min(candidate.bottom, viewport.bottom);
  if (right <= left || bottom <= top) return 0;
  return (right - left) * (bottom - top);
}
function getScrollParents(el) {
  const parents = [];
  let current = el.parentElement;
  while (current && current !== document.documentElement) {
    const style = getComputedStyle(current);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    if ((overflowY === "auto" || overflowY === "scroll" || overflowX === "auto" || overflowX === "scroll") && (current.scrollHeight > current.clientHeight || current.scrollWidth > current.clientWidth)) {
      parents.push(current);
    }
    current = current.parentElement;
  }
  if (document.scrollingElement) {
    parents.push(document.scrollingElement);
  }
  return parents;
}
function createTemplate() {
  const template = document.createElement("template");
  template.innerHTML = `
  <button class="trigger" part="trigger" aria-haspopup="dialog" aria-label="Open color picker" title="Open color picker">
    <span class="chip" part="chip"></span>
  </button>
  <div class="input-wrapper">
    <span class="error-message" part="error" role="alert" aria-live="polite"></span>
    <input type="text" class="text-input" part="input" aria-label="Color value" title="Color value" aria-invalid="false" spellcheck="false" />
  </div>
  <div class="panel" popover="auto" part="panel">
    <div class="area-picker" part="area" role="slider" aria-label="Color area picker" tabindex="0">
      <canvas class="area-canvas"></canvas>
      <div class="area-thumb"></div>
    </div>
    <div class="controls" part="controls"></div>
    <div class="preview">
      <div class="tools">
        <div class="copy-wrap">
          <button class="copy-btn">
            <span class="visually-hidden">Copy color</span>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><title>Copy color</title><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Z"/></svg>
          </button>
          <span class="copy-message" aria-hidden="true">Copied!</span>
          <span class="copy-message-live-region visually-hidden" role="status"></span>
        </div>
        <button class="eyedropper-btn" title="Pick color from screen">
          <span class="visually-hidden">Pick color from screen</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pipette-icon lucide-pipette"><path d="m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"/><path d="m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"/><path d="m2 22 .414-.414"/></svg>
        </button>
      </div>
      <select class="space" title="Colorspace"></select>
      <output class="info" part="output"></output>
      <span class="gamut" title="Color's gamut" part="gamut"><span class="gamut-track"><span>srgb</span><span>p3</span><span>rec2020</span><span>xyz</span></span></span>
      <div class="contrast-scores">
        <span class="cr-w" title="WCAG 2.1 contrast ratio vs white"></span>
        <span class="cr-b" title="WCAG 2.1 contrast ratio vs black"></span>
      </div>
    </div>
  </div>
  `;
  return template;
}
const styles = ':root{--radius-round: 1e5px;--radius-2: 5px;--radius-3: 1rem}:host{--canvas: Canvas;--canvas-text: CanvasText;--radius-2: .5rem;--radius-3: .75rem;--radius-round: 1e4px;--shadow-elev: #0305081f 0px -1px 2px 0px, #03050821 0px 2px 1px -2px, #03050821 0px 5px 5px -2px, #03050824 0px 10px 10px -2px, #03050826 0px 20px 20px -2px, #0305082b 0px 40px 40px -2px;--shadow-inner: inset 0 0 0 1px color-mix(in oklab, var(--canvas-text), transparent 94%);--checker: repeating-conic-gradient(color-mix(in oklab, var(--canvas-text), transparent 90%) 0% 25%, transparent 0% 50%) 50%/1rem 1rem;--ease: cubic-bezier(.25, 1, .5, 1);--duration-fast: .15s;--duration-normal: .2s;color-scheme:light dark;display:flex;align-items:center;gap:.625rem;position:relative;@media (width < 350px){overflow:hidden}}:host([hidden]){display:none}button{border:1px solid color-mix(in oklab,var(--canvas-text),var(--canvas) 80%);outline-offset:2px;&.trigger{flex-shrink:0;background:none;padding:0;border:none;display:inline-flex;place-content:center;border-radius:var(--radius-round);cursor:pointer;anchor-name:--trigger;.chip{display:inline-block;inline-size:1.25rem;block-size:1.25rem;border-radius:var(--radius-round);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--canvas-text),transparent 92%);background:linear-gradient(var(--value) 0 0),var(--checker);forced-color-adjust:none;transition:scale var(--duration-fast) var(--ease)}&:hover .chip{scale:1.1}&:active .chip{scale:.95}}}.input-wrapper{position:relative;display:flex;flex-direction:column;flex:1;min-width:0}.text-input{field-sizing:content;font-family:inherit;padding:1ch 1.5ch;border:1px solid color-mix(in oklab,var(--canvas-text),var(--canvas) 80%);border-radius:var(--radius-2);background:color-mix(in oklab,var(--canvas-text),var(--canvas) 92%);color:var(--canvas-text);box-shadow:var(--shadow-inner);outline-offset:2px;transition:border-color var(--duration-fast) var(--ease),box-shadow var(--duration-fast) var(--ease);&:focus{border-color:color-mix(in oklab,var(--canvas-text),var(--canvas) 50%)}&[aria-invalid=true]{outline-color:red}}.error-message{position:absolute;bottom:-1.5rem;left:0;font-size:.75rem;color:#ef4444;font-weight:500;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity var(--duration-normal) var(--ease)}.error-message:not(:empty){opacity:1}.panel{margin:0;inset:unset;position-area:block-start span-inline-end;max-inline-size:min(92vw,560px);background:var(--canvas);color:var(--canvas-text);box-shadow:var(--shadow-elev);border-radius:var(--radius-3);padding:0;border:none;overflow:hidden;@media (forced-colors: active){border:1px solid transparent}opacity:1;scale:1;transition:opacity var(--duration-normal) var(--ease),scale var(--duration-normal) var(--ease),display var(--duration-normal) allow-discrete,overlay var(--duration-normal) allow-discrete}@supports (anchor-name: --a){.panel{position-anchor:--trigger;position-area:block-start span-inline-end;align-self:block-end;justify-self:self-start;margin:0;margin-block-end:12px;position-try-fallbacks:flip-block,flip-inline,flip-block flip-inline;position-try-order:most-block-size;inset:auto;transform-origin:block-end inline-start}}.panel[data-placement^=top]{transform-origin:bottom center}.panel[data-placement^=bottom]{transform-origin:top center}.panel:not(:popover-open){opacity:0;scale:.97}@starting-style{.panel:popover-open{opacity:0;scale:.97}}.area-picker{position:relative;width:100%;aspect-ratio:16 / 9;overflow:hidden;touch-action:none;box-shadow:var(--shadow-inner)}.area-picker:focus-visible{outline-offset:0px}.area-canvas{position:absolute;inset:0;width:100%;height:100%}.area-thumb{position:absolute;box-sizing:border-box;height:calc(1rem + 8px);aspect-ratio:1;margin-left:calc(-.5rem - 4px);margin-top:calc(-.5rem - 4px);border-radius:var(--radius-round);border:4px solid white;box-shadow:0 0 1px 1px #00000040;left:var(--thumb-x, 50%);top:var(--thumb-y, 50%);z-index:1;cursor:grab;transform:scale(.2);transition:transform var(--duration-fast) var(--ease),box-shadow var(--duration-fast) var(--ease),background var(--duration-fast) var(--ease);background:#fff}.area-picker:hover .area-thumb,.area-picker:focus-visible .area-thumb{transform:scale(1);background:none;box-shadow:0 0 1px 1px #00000040,inset 0 1px 2px #00000026}.area-picker.dragging .area-thumb{cursor:grabbing;transform:scale(1);background:none;box-shadow:0 0 1px 1px #00000040,inset 0 1px 2px #00000026}.preview{position:relative;min-inline-size:35ch;container-type:inline-size;display:grid;align-content:end;justify-items:start;padding:.75rem;gap:.375rem;box-shadow:var(--shadow-inner);background:linear-gradient(var(--value) 0 0),var(--checker);forced-color-adjust:none;&:hover .eyedropper-btn,&:focus-within .eyedropper-btn,&:hover .copy-btn,&:focus-within .copy-btn{opacity:.75}.eyedropper-btn[hidden]{display:none}>*:not(:hover){opacity:.9}.tools{position:absolute;top:2px;right:2px;display:flex;align-items:flex-start;gap:0}.copy-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:.25rem}.eyedropper-btn,.copy-btn{color:var(--contrast);background:none;border:1px solid transparent;border-radius:0;padding:5px;cursor:pointer;opacity:0;transition:opacity var(--duration-normal) var(--ease),scale var(--duration-fast) var(--ease);display:inline-flex;align-items:center}.eyedropper-btn:hover,.copy-btn:hover,.eyedropper-btn:focus-visible,.copy-btn:focus-visible{opacity:1;scale:1.1}.eyedropper-btn:active,.copy-btn:active{scale:.9}.eyedropper-btn svg,.copy-btn svg{display:block;width:18px;height:18px}.copy-message{color:var(--contrast);font-size:.8rem;font-weight:500;opacity:0;pointer-events:none;transition:opacity var(--duration-normal) var(--ease),translate var(--duration-normal) var(--ease);white-space:nowrap;translate:0 -4px}.copy-message.show{opacity:1;translate:0 0}.visually-hidden:not(:focus):not(:active){clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}}.space{-webkit-appearance:base-select;-moz-appearance:base-select;appearance:base-select;min-block-size:1lh;line-height:1.1;font-weight:700;margin:0;padding:0;cursor:pointer;color:var(--contrast);background:transparent;border-radius:0;border:none;&::picker-icon{content:"▾";-webkit-appearance:none;transform:scale(1.5) translateY(-.2ex);transition:translate .15s ease}&:hover::picker-icon{translate:0 1px}}.space{font-size:.8125rem;letter-spacing:.01em}.info{font-size:1.25rem;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,Liberation Mono,monospace;font-variant:tabular-nums;letter-spacing:-.01em;line-height:1.1;text-box:cap alphabetic;display:block;color:var(--contrast);background:transparent}:host([colorspace="srgb-linear"]) .info,:host([colorspace="display-p3"]) .info,:host([colorspace="a98-rgb"]) .info,:host([colorspace="rec2020"]) .info,:host([colorspace="prophoto"]) .info,:host([colorspace="xyz"]) .info,:host([colorspace="xyz-d50"]) .info,:host([colorspace="xyz-d65"]) .info{font-size:clamp(.875rem,4.4cqi,1.25rem)}.gamut{font:450 .6875rem/1.1 ui-monospace,SFMono-Regular,Menlo,Consolas,Liberation Mono,monospace;letter-spacing:.03em;opacity:.7;display:block;color:var(--contrast);background:transparent;overflow:hidden;height:1lh}.gamut-track{display:flex;flex-direction:column;translate:0 calc(var(--gamut-index, 0) * -1lh);transition:translate var(--duration-normal) var(--ease)}.contrast-scores{position:absolute;bottom:.75rem;right:.75rem;display:flex;gap:.5rem;font:450 .6875rem/1.1 ui-monospace,SFMono-Regular,Menlo,Consolas,Liberation Mono,monospace;font-variant:tabular-nums;letter-spacing:.03em;color:var(--contrast);opacity:.7}.cr-w:before,.cr-b:before{content:"";display:inline-block;width:.5em;height:.5em;border-radius:1.5px;margin-right:.25em;vertical-align:.0125em}.cr-w:before{background:#fff;box-shadow:inset 0 0 0 .5px #00000026}.cr-b:before{background:#000;box-shadow:inset 0 0 0 .5px #ffffff26}.controls{display:grid;gap:.5rem;padding:.75rem;.control{display:grid;grid-template-columns:min-content 1fr 4ch;align-items:center;gap:.5rem}.control .num-wrapper{position:relative;display:flex;align-items:center}.control .num-wrapper sup{opacity:.5;font-size:.5em;place-self:start}.control label{font:500 .75rem/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,Liberation Mono,monospace}.control input[type=number]{text-align:end;font-size:.75rem;max-inline-size:4ch;padding:.125rem .25rem;background:transparent;border:1px solid transparent;border-radius:.25rem;outline:none;-moz-appearance:textfield;font-variant:tabular-nums;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,Liberation Mono,monospace;transition:border-color var(--duration-fast) var(--ease),background var(--duration-fast) var(--ease),box-shadow var(--duration-fast) var(--ease);&:hover{background:color-mix(in oklab,var(--canvas-text),var(--canvas) 94%)}&:focus-visible{border-color:color-mix(in oklab,var(--canvas-text),var(--canvas) 60%);background:color-mix(in oklab,var(--canvas-text),var(--canvas) 96%);box-shadow:0 0 0 2px color-mix(in oklab,var(--canvas-text),transparent 92%)}&::-webkit-outer-spin-button,&::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}}.control input[type=range]{width:100%;height:1rem;border-radius:999px;border:1px solid var(--canvas);background:var(--canvas);box-shadow:var(--shadow-inner);-webkit-appearance:none;-moz-appearance:none;appearance:none;forced-color-adjust:none}.control input[type=range].alpha{background:linear-gradient(to right,#0000,#000),var(--checker)}.control input[type=range]::-webkit-slider-thumb{cursor:grab;-webkit-appearance:none;appearance:none;height:calc(1rem + 8px);width:calc(1rem + 8px);border-radius:var(--radius-round);background:#fff;border:4px solid white;box-shadow:0 0 1px 1px #00000040;transform:scale(.2);-webkit-transition:transform .15s ease,box-shadow .15s ease,background .15s ease;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}.control input[type=range]:hover::-webkit-slider-thumb,.control input[type=range]:focus::-webkit-slider-thumb{transform:scale(1);background:none;box-shadow:0 0 1px 1px #00000040,inset 0 1px 2px #00000026}.control input[type=range]:active::-webkit-slider-thumb{cursor:grabbing}.control input[type=range]::-moz-range-thumb{cursor:grab;-moz-appearance:none;appearance:none;height:calc(1rem + 8px);width:calc(1rem + 8px);border-radius:var(--radius-round);background:#fff;border:4px solid white;box-shadow:0 0 1px 1px #00000040;box-sizing:border-box;transform:scale(.2);-moz-transition:transform .15s ease,box-shadow .15s ease,background .15s ease;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}.control input[type=range]:hover::-moz-range-thumb,.control input[type=range]:focus::-moz-range-thumb{transform:scale(1);background:none;box-shadow:0 0 1px 1px #00000040,inset 0 1px 2px #00000026}.control input[type=range]:active::-moz-range-thumb{cursor:grabbing}}@media (prefers-reduced-motion: reduce){:host{--duration-fast: 0ms;--duration-normal: 0ms}.panel{transition:none}}';
const supportsAnchor = (_e = (_d = CSS.supports) == null ? void 0 : _d.call(CSS, "anchor-name: --a")) != null ? _e : false;
const DEFAULT_VALUE = "oklch(75% 75% 180)";
const DEFAULT_SPACE = "oklch";
const sheet = new CSSStyleSheet();
if (typeof sheet.replaceSync === "function") {
  sheet.replaceSync(styles);
}
class ColorInput extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _ColorInput_instances);
    // ──────────────────────────────────────────────────────────────────────────────
    // State: Reactive signals (Preact Signals Core)
    // ──────────────────────────────────────────────────────────────────────────────
    __privateAdd(this, _value, d$1(DEFAULT_VALUE));
    __privateAdd(this, _space2, d$1(DEFAULT_SPACE));
    __privateAdd(this, _theme, d$1("auto"));
    __privateAdd(this, _open, d$1(false));
    __privateAdd(this, _anchor, d$1(null));
    __privateAdd(this, _error, d$1(null));
    __privateAdd(this, _noAlpha, d$1(false));
    __privateAdd(this, _contrast, w(() => contrastColor(__privateGet(this, _value).value)));
    __privateAdd(this, _gamut, w(() => detectGamut(__privateGet(this, _value).value)));
    __privateAdd(this, _previewEffectCleanup, null);
    __privateAdd(this, _colorSchemeEffectCleanup, null);
    __privateAdd(this, _errorEffectCleanup, null);
    __privateAdd(this, _controlsEffectCleanup, null);
    __privateAdd(this, _areaPickerEffectCleanup, null);
    __privateAdd(this, _areaPicker);
    __privateAdd(this, _programmaticUpdate, false);
    // ──────────────────────────────────────────────────────────────────────────────
    // DOM references
    // ──────────────────────────────────────────────────────────────────────────────
    __privateAdd(this, _root);
    __privateAdd(this, _panel);
    __privateAdd(this, _controls);
    __privateAdd(this, _spaceSelect);
    __privateAdd(this, _output);
    __privateAdd(this, _chip);
    __privateAdd(this, _internalTrigger);
    __privateAdd(this, _textInput);
    __privateAdd(this, _errorMessage);
    __privateAdd(this, _lastInvoker, null);
    // ──────────────────────────────────────────────────────────────────────────────
    // Positioning system
    // ──────────────────────────────────────────────────────────────────────────────
    __privateAdd(this, _lastPlacement, null);
    __privateAdd(this, _lastPanelSize, null);
    __privateAdd(this, _cleanup, []);
    __privateAdd(this, _rafId, null);
    __privateSet(this, _root, this.attachShadow({ mode: "open" }));
    if ("adoptedStyleSheets" in __privateGet(this, _root) && typeof sheet.replaceSync === "function") {
      __privateGet(this, _root).adoptedStyleSheets = [sheet];
    } else {
      const styleEl = document.createElement("style");
      styleEl.textContent = styles;
      __privateGet(this, _root).appendChild(styleEl);
    }
    const template = createTemplate();
    __privateGet(this, _root).appendChild(template.content.cloneNode(true));
  }
  static get observedAttributes() {
    return ["value", "colorspace", "theme", "no-alpha"];
  }
  get value() {
    return __privateGet(this, _value).value;
  }
  set value(v2) {
    if (typeof v2 !== "string" || !v2) return;
    try {
      const parsed = parse(v2);
      const sid = reverseColorJSSpaceID(parsed.spaceId);
      const isHex = typeof v2 === "string" && v2.trim().startsWith("#");
      __privateGet(this, _space2).value = isHex ? "hex" : sid === "rgb" ? "srgb" : sid;
      __privateGet(this, _value).value = v2;
      __privateSet(this, _programmaticUpdate, true);
      this.setAttribute("value", v2);
      this.setAttribute("colorspace", __privateGet(this, _space2).value);
      __privateSet(this, _programmaticUpdate, false);
      __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
    } catch {
    }
  }
  get colorspace() {
    return __privateGet(this, _space2).value;
  }
  set colorspace(s2) {
    const next = s2 || DEFAULT_SPACE;
    __privateGet(this, _space2).value = next;
    __privateSet(this, _programmaticUpdate, true);
    this.setAttribute("colorspace", next);
    try {
      const current = parse(__privateGet(this, _value).value);
      const targetSpace = next === "hex" ? "srgb" : next;
      const converted = toGamut(to(current, getColorJSSpaceID(targetSpace)));
      const tempStr = serialize(converted, { precision: 12 });
      const parsed = parseIntoChannels(next, tempStr);
      const newValue = gencolor(next, parsed.ch);
      __privateGet(this, _value).value = newValue;
      this.setAttribute("value", newValue);
      __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
    } catch {
    }
    __privateSet(this, _programmaticUpdate, false);
    if (__privateGet(this, _controls)) __privateMethod(this, _ColorInput_instances, renderControls_fn).call(this);
  }
  get theme() {
    return __privateGet(this, _theme).value;
  }
  set theme(t2) {
    const next = t2 === "light" || t2 === "dark" ? t2 : "auto";
    __privateGet(this, _theme).value = next;
    if (next === "auto") this.removeAttribute("theme");
    else this.setAttribute("theme", next);
  }
  get noAlpha() {
    return __privateGet(this, _noAlpha).value;
  }
  set noAlpha(v2) {
    __privateGet(this, _noAlpha).value = !!v2;
    if (v2) this.setAttribute("no-alpha", "");
    else this.removeAttribute("no-alpha");
  }
  get gamut() {
    return __privateGet(this, _gamut).value;
  }
  get contrastColor() {
    return __privateGet(this, _contrast).value;
  }
  show(anchor) {
    var _a2, _b2;
    if (anchor) __privateGet(this, _anchor).value = anchor;
    (_b2 = (_a2 = __privateGet(this, _panel)) == null ? void 0 : _a2.showPopover) == null ? void 0 : _b2.call(_a2);
    __privateMethod(this, _ColorInput_instances, startReposition_fn).call(this);
  }
  close() {
    var _a2, _b2;
    (_b2 = (_a2 = __privateGet(this, _panel)) == null ? void 0 : _a2.hidePopover) == null ? void 0 : _b2.call(_a2);
    __privateMethod(this, _ColorInput_instances, stopReposition_fn).call(this);
  }
  showPicker() {
    this.show();
  }
  setAnchor(el) {
    __privateGet(this, _anchor).value = el;
  }
  set setColor(v2) {
    this.value = v2;
  }
  set setAnchorElement(el) {
    this.setAnchor(el);
  }
  // Delegate focus to the text input (replaces delegatesFocus behavior
  // without the sticky side-effect of auto-focusing on every click)
  focus(options) {
    var _a2, _b2;
    (_b2 = (_a2 = __privateGet(this, _textInput)) != null ? _a2 : __privateGet(this, _internalTrigger)) == null ? void 0 : _b2.focus(options);
  }
  connectedCallback() {
    var _a2;
    const btn = __privateGet(this, _root).querySelector("button.trigger");
    __privateSet(this, _internalTrigger, btn != null ? btn : void 0);
    __privateSet(this, _panel, __privateGet(this, _root).querySelector(".panel"));
    __privateSet(this, _controls, __privateGet(this, _root).querySelector(".controls"));
    __privateSet(this, _spaceSelect, __privateGet(this, _root).querySelector(".space"));
    __privateSet(this, _output, __privateGet(this, _root).querySelector("output.info"));
    __privateSet(this, _chip, __privateGet(this, _root).querySelector(".chip"));
    __privateSet(this, _textInput, __privateGet(this, _root).querySelector(".text-input"));
    __privateSet(this, _errorMessage, __privateGet(this, _root).querySelector(".error-message"));
    const areaPickerEl = __privateGet(this, _root).querySelector(".area-picker");
    if (areaPickerEl && getComputedStyle(areaPickerEl).display !== "none") {
      __privateSet(this, _areaPicker, new AreaPicker(areaPickerEl, (color, isDragging) => {
        __privateGet(this, _value).value = color;
        __privateSet(this, _programmaticUpdate, true);
        this.setAttribute("value", color);
        __privateSet(this, _programmaticUpdate, false);
        __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
        __privateMethod(this, _ColorInput_instances, renderControls_fn).call(this);
      }));
      __privateSet(this, _areaPickerEffectCleanup, E(() => {
        var _a3;
        const v2 = __privateGet(this, _value).value;
        const space = __privateGet(this, _space2).value;
        (_a3 = __privateGet(this, _areaPicker)) == null ? void 0 : _a3.setValue(v2, space);
      }));
    }
    const eyedropperBtn = __privateGet(this, _root).querySelector("button.eyedropper-btn");
    if (eyedropperBtn) {
      if ("EyeDropper" in window) {
        eyedropperBtn.addEventListener("click", async () => {
          try {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            if (result && result.sRGBHex) {
              const space = __privateGet(this, _space2).value;
              const converted = to(result.sRGBHex, space === "hex" ? "srgb" : space);
              const serialized = serialize(converted, {
                format: space === "hex" ? "hex" : void 0
              });
              const color = gencolor(space, parseIntoChannels(space, serialized).ch);
              __privateGet(this, _value).value = color;
              this.setAttribute("value", color);
              __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
              __privateMethod(this, _ColorInput_instances, renderControls_fn).call(this);
            }
          } catch {
          }
        });
      } else {
        eyedropperBtn.hidden = true;
      }
    }
    const copyBtn = __privateGet(this, _root).querySelector("button.copy-btn");
    const copyMessage = __privateGet(this, _root).querySelector(".copy-message");
    const copyMessageLiveRegion = __privateGet(this, _root).querySelector(".copy-message-live-region");
    if (copyBtn && copyMessage && copyMessageLiveRegion) {
      let copyTimeout = null;
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(__privateGet(this, _value).value);
          copyMessage.classList.add("show");
          copyMessageLiveRegion.innerText = copyMessage.innerText;
          if (copyTimeout !== null) clearTimeout(copyTimeout);
          copyTimeout = window.setTimeout(() => {
            copyMessage.classList.remove("show");
            copyMessageLiveRegion.innerText = "";
            copyTimeout = null;
          }, 3e3);
        } catch {
        }
      });
    }
    __privateGet(this, _spaceSelect).innerHTML = `
      <optgroup label="Standard">
        <option value="hex">hex</option>
        <option value="srgb">rgb</option>
        <option value="srgb-linear">srgb-linear</option>
        <option value="hsl">hsl</option>
        <option value="hwb">hwb</option>
      </optgroup>
      <optgroup label="HDR">
        <option value="display-p3">display-p3</option>
        <option value="a98-rgb">a98-rgb</option>
      </optgroup>
      <optgroup label="Ultra HDR">
        <option value="lab">lab</option>
        <option value="lch">lch</option>
        <option value="oklch">oklch</option>
        <option value="oklab">oklab</option>
        <option value="rec2020">rec2020</option>
        <option value="prophoto">prophoto</option>
        <option value="xyz">xyz</option>
        <option value="xyz-d50">xyz-d50</option>
        <option value="xyz-d65">xyz-d65</option>
      </optgroup>
    `;
    if (btn) btn.addEventListener("click", () => this.show(btn));
    if (__privateGet(this, _textInput)) {
      __privateGet(this, _textInput).value = __privateGet(this, _value).value;
      __privateGet(this, _textInput).addEventListener("input", (e2) => {
        const inputValue = e2.target.value;
        __privateMethod(this, _ColorInput_instances, validateAndSetColor_fn).call(this, inputValue);
      });
      __privateGet(this, _textInput).addEventListener("paste", (e2) => {
      });
    }
    this.addEventListener("command", (ev) => {
      const command = ev.command;
      if (!command) return;
      const possibleInvoker = ev.source || ev.invoker || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      if (possibleInvoker) {
        __privateSet(this, _lastInvoker, possibleInvoker);
        this.setAnchor(possibleInvoker);
      }
      if (command === "show-popover" || command === "show") this.show(__privateGet(this, _lastInvoker));
      else if (command === "hide-popover" || command === "close") this.close();
      else if (command === "toggle-popover" || command === "toggle") {
        if (__privateGet(this, _open).value) this.close();
        else this.show(__privateGet(this, _lastInvoker));
      }
    });
    (_a2 = __privateGet(this, _panel)) == null ? void 0 : _a2.addEventListener("toggle", () => {
      var _a3;
      const el = __privateGet(this, _panel);
      let isOpen = !el.hasAttribute("hidden");
      try {
        isOpen = (_a3 = el.matches(":popover-open")) != null ? _a3 : false;
      } catch {
      }
      __privateGet(this, _open).value = isOpen;
      if (isOpen) {
        __privateMethod(this, _ColorInput_instances, startReposition_fn).call(this);
      } else {
        __privateMethod(this, _ColorInput_instances, stopReposition_fn).call(this);
      }
      this.dispatchEvent(new CustomEvent(isOpen ? "open" : "close", { bubbles: true }));
    });
    __privateGet(this, _spaceSelect).addEventListener("change", () => {
      this.colorspace = __privateGet(this, _spaceSelect).value;
      __privateMethod(this, _ColorInput_instances, renderControls_fn).call(this);
    });
    __privateSet(this, _previewEffectCleanup, E(() => {
      const v2 = __privateGet(this, _value).value;
      const gamut = __privateGet(this, _gamut).value;
      const contrast$1 = __privateGet(this, _contrast).value;
      if (__privateGet(this, _output)) __privateGet(this, _output).value = v2;
      if (__privateGet(this, _chip)) __privateGet(this, _chip).style.setProperty("--value", v2);
      if (__privateGet(this, _textInput) && __privateGet(this, _textInput).value !== v2) {
        __privateGet(this, _textInput).value = v2;
      }
      this.style.setProperty("--contrast", contrast$1);
      this.style.setProperty("--counter", contrast$1 === "white" ? "black" : "white");
      const gamutEl = __privateGet(this, _root).querySelector(".gamut");
      if (gamutEl) {
        const gamutOrder = ["srgb", "p3", "rec2020", "xyz"];
        const idx = gamutOrder.indexOf(gamut);
        gamutEl.style.setProperty("--gamut-index", String(idx >= 0 ? idx : 0));
      }
      const preview = __privateGet(this, _root).querySelector(".preview");
      if (preview) preview.style.setProperty("--value", v2);
      const crW = __privateGet(this, _root).querySelector(".cr-w");
      const crB = __privateGet(this, _root).querySelector(".cr-b");
      if (crW && crB) {
        try {
          const parsed = parse(v2);
          const cw = contrast(parsed, "white", "WCAG21");
          const cb = contrast(parsed, "black", "WCAG21");
          crW.textContent = `${cw.toFixed(1)}:1`;
          crB.textContent = `${cb.toFixed(1)}:1`;
        } catch {
        }
      }
    }));
    __privateSet(this, _errorEffectCleanup, E(() => {
      const error = __privateGet(this, _error).value;
      if (error) {
        this.setAttribute("data-error", "");
        if (__privateGet(this, _errorMessage)) __privateGet(this, _errorMessage).textContent = error;
        if (__privateGet(this, _textInput)) __privateGet(this, _textInput).setAttribute("aria-invalid", "true");
      } else {
        this.removeAttribute("data-error");
        if (__privateGet(this, _errorMessage)) __privateGet(this, _errorMessage).textContent = "";
        if (__privateGet(this, _textInput)) __privateGet(this, _textInput).setAttribute("aria-invalid", "false");
      }
    }));
    __privateSet(this, _colorSchemeEffectCleanup, E(() => {
      const theme = __privateGet(this, _theme).value;
      const colorScheme = theme === "auto" ? "light dark" : theme;
      this.style.setProperty("color-scheme", colorScheme);
    }));
    if (!this.hasAttribute("value")) this.setAttribute("value", DEFAULT_VALUE);
    if (!this.hasAttribute("colorspace")) {
      this.setAttribute("colorspace", __privateGet(this, _space2).value);
    }
    __privateGet(this, _spaceSelect).value = __privateGet(this, _space2).value;
    try {
      const { ch } = parseIntoChannels(__privateGet(this, _space2).value, __privateGet(this, _value).value);
      __privateGet(this, _value).value = gencolor(__privateGet(this, _space2).value, ch);
    } catch {
    }
    __privateMethod(this, _ColorInput_instances, renderControls_fn).call(this);
  }
  disconnectedCallback() {
    var _a2, _b2, _c2, _d2, _e2;
    (_a2 = __privateGet(this, _colorSchemeEffectCleanup)) == null ? void 0 : _a2.call(this);
    (_b2 = __privateGet(this, _previewEffectCleanup)) == null ? void 0 : _b2.call(this);
    (_c2 = __privateGet(this, _errorEffectCleanup)) == null ? void 0 : _c2.call(this);
    (_d2 = __privateGet(this, _areaPickerEffectCleanup)) == null ? void 0 : _d2.call(this);
    (_e2 = __privateGet(this, _areaPicker)) == null ? void 0 : _e2.unmount();
  }
  attributeChangedCallback(name, _old, value) {
    if (value === _old) return;
    if (__privateGet(this, _programmaticUpdate)) return;
    if (name === "value" && typeof value === "string") {
      try {
        const parsed = parse(value);
        const sid = reverseColorJSSpaceID(parsed.spaceId);
        const isHex = typeof value === "string" && value.trim().startsWith("#");
        __privateGet(this, _value).value = value;
        __privateGet(this, _space2).value = isHex ? "hex" : sid === "rgb" ? "srgb" : sid;
        if (__privateGet(this, _spaceSelect)) __privateGet(this, _spaceSelect).value = __privateGet(this, _space2).value;
      } catch {
      }
    }
    if (name === "colorspace" && value) {
      __privateGet(this, _space2).value = value;
      if (__privateGet(this, _spaceSelect)) __privateGet(this, _spaceSelect).value = value;
    }
    if (name === "theme") {
      __privateGet(this, _theme).value = value || "auto";
    }
    if (name === "no-alpha") {
      __privateGet(this, _noAlpha).value = value !== null;
      if (__privateGet(this, _controls)) __privateMethod(this, _ColorInput_instances, renderControls_fn).call(this);
    }
  }
}
_value = new WeakMap();
_space2 = new WeakMap();
_theme = new WeakMap();
_open = new WeakMap();
_anchor = new WeakMap();
_error = new WeakMap();
_noAlpha = new WeakMap();
_contrast = new WeakMap();
_gamut = new WeakMap();
_previewEffectCleanup = new WeakMap();
_colorSchemeEffectCleanup = new WeakMap();
_errorEffectCleanup = new WeakMap();
_controlsEffectCleanup = new WeakMap();
_areaPickerEffectCleanup = new WeakMap();
_areaPicker = new WeakMap();
_programmaticUpdate = new WeakMap();
_root = new WeakMap();
_panel = new WeakMap();
_controls = new WeakMap();
_spaceSelect = new WeakMap();
_output = new WeakMap();
_chip = new WeakMap();
_internalTrigger = new WeakMap();
_textInput = new WeakMap();
_errorMessage = new WeakMap();
_lastInvoker = new WeakMap();
_ColorInput_instances = new WeakSet();
emitChange_fn = function() {
  const detail = { value: __privateGet(this, _value).value, colorspace: __privateGet(this, _space2).value, gamut: __privateGet(this, _gamut).value };
  this.dispatchEvent(new CustomEvent("change", { detail, bubbles: true }));
};
validateAndSetColor_fn = function(inputValue) {
  if (!inputValue || !inputValue.trim()) {
    __privateGet(this, _error).value = "Invalid color format";
    return;
  }
  try {
    const parsed = parse(inputValue);
    const sid = reverseColorJSSpaceID(parsed.spaceId);
    const isHex = typeof inputValue === "string" && inputValue.trim().startsWith("#");
    __privateGet(this, _error).value = null;
    __privateGet(this, _space2).value = isHex ? "hex" : sid === "rgb" ? "srgb" : sid;
    __privateGet(this, _value).value = inputValue;
    this.setAttribute("value", inputValue);
    this.setAttribute("colorspace", __privateGet(this, _space2).value);
    if (__privateGet(this, _spaceSelect)) __privateGet(this, _spaceSelect).value = __privateGet(this, _space2).value;
    __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
  } catch (error) {
    __privateGet(this, _error).value = "Invalid color format";
  }
};
_lastPlacement = new WeakMap();
_lastPanelSize = new WeakMap();
_cleanup = new WeakMap();
_rafId = new WeakMap();
usingCSSAnchor_fn = function() {
  const anchor = __privateGet(this, _anchor).value;
  const isInternal = !anchor || anchor === __privateGet(this, _internalTrigger);
  return supportsAnchor && isInternal && !__privateGet(this, _lastInvoker);
};
startReposition_fn = function() {
  var _a2, _b2;
  if (__privateMethod(this, _ColorInput_instances, usingCSSAnchor_fn).call(this)) return;
  if (__privateGet(this, _cleanup).length) return;
  __privateMethod(this, _ColorInput_instances, scheduleReposition_fn).call(this);
  const anchor = (_b2 = (_a2 = __privateGet(this, _anchor).value) != null ? _a2 : __privateGet(this, _lastInvoker)) != null ? _b2 : __privateGet(this, _internalTrigger);
  if (!anchor || !__privateGet(this, _panel)) return;
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => __privateMethod(this, _ColorInput_instances, scheduleReposition_fn).call(this));
    ro.observe(anchor);
    ro.observe(__privateGet(this, _panel));
    ro.observe(document.documentElement);
    __privateGet(this, _cleanup).push(() => ro.disconnect());
  } else {
    const onResize = () => __privateMethod(this, _ColorInput_instances, scheduleReposition_fn).call(this);
    window.addEventListener("resize", onResize);
    __privateGet(this, _cleanup).push(() => window.removeEventListener("resize", onResize));
  }
  if (window.visualViewport) {
    const onVV = () => __privateMethod(this, _ColorInput_instances, scheduleReposition_fn).call(this);
    window.visualViewport.addEventListener("resize", onVV);
    window.visualViewport.addEventListener("scroll", onVV);
    __privateGet(this, _cleanup).push(() => {
      var _a3, _b3;
      (_a3 = window.visualViewport) == null ? void 0 : _a3.removeEventListener("resize", onVV);
      (_b3 = window.visualViewport) == null ? void 0 : _b3.removeEventListener("scroll", onVV);
    });
  }
  const scrollParents = getScrollParents(anchor);
  scrollParents.forEach((sp) => {
    const onScroll = () => __privateMethod(this, _ColorInput_instances, scheduleReposition_fn).call(this);
    sp.addEventListener("scroll", onScroll, { passive: true });
    __privateGet(this, _cleanup).push(() => sp.removeEventListener("scroll", onScroll));
  });
  if (typeof IntersectionObserver !== "undefined") {
    const io = new IntersectionObserver(() => __privateMethod(this, _ColorInput_instances, scheduleReposition_fn).call(this), { threshold: 0 });
    io.observe(anchor);
    __privateGet(this, _cleanup).push(() => io.disconnect());
  }
};
stopReposition_fn = function() {
  __privateGet(this, _cleanup).forEach((fn) => fn());
  __privateSet(this, _cleanup, []);
  if (__privateGet(this, _rafId) !== null) {
    cancelAnimationFrame(__privateGet(this, _rafId));
    __privateSet(this, _rafId, null);
  }
};
scheduleReposition_fn = function() {
  if (__privateGet(this, _rafId) !== null) return;
  __privateSet(this, _rafId, requestAnimationFrame(() => {
    __privateSet(this, _rafId, null);
    __privateMethod(this, _ColorInput_instances, positionNow_fn).call(this);
  }));
};
positionNow_fn = function() {
  if (!__privateGet(this, _panel)) return;
  if (__privateMethod(this, _ColorInput_instances, usingCSSAnchor_fn).call(this)) return;
  const panel = __privateGet(this, _panel);
  const anchorRect = __privateMethod(this, _ColorInput_instances, getAnchorRect_fn).call(this);
  const insets = getSafeAreaInsets();
  const viewport = getViewportClampRect(insets);
  const size = __privateMethod(this, _ColorInput_instances, measurePanel_fn).call(this, panel);
  const candidates = computeCandidates(anchorRect, size);
  const pick = findFirstFitOrMaxArea(candidates, viewport, __privateGet(this, _lastPlacement));
  __privateSet(this, _lastPlacement, pick.placement);
  const left = Math.round(Math.min(Math.max(pick.left, viewport.left), viewport.right - size.width));
  let top = Math.round(Math.min(Math.max(pick.top, viewport.top), viewport.bottom - size.height));
  if (pick.placement.startsWith("top") && top + size.height > anchorRect.top - GUTTER) {
    top = Math.round(anchorRect.bottom + GUTTER);
    pick.placement = pick.placement.replace("top", "bottom");
  }
  const maxPanelHeight = viewport.bottom - viewport.top;
  if (size.height > maxPanelHeight) {
    panel.style.maxHeight = `${maxPanelHeight}px`;
    panel.style.overflow = "auto";
  } else if (panel.style.maxHeight) {
    panel.style.maxHeight = "";
    panel.style.overflow = "";
  }
  panel.style.position = "fixed";
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.dataset.placement = pick.placement;
};
getAnchorRect_fn = function() {
  var _a2, _b2, _c2, _d2, _e2, _f, _g;
  const anchor = (_c2 = (_b2 = (_a2 = __privateGet(this, _anchor).value) != null ? _a2 : __privateGet(this, _lastInvoker)) != null ? _b2 : __privateGet(this, _internalTrigger)) != null ? _c2 : this;
  if (!anchor.isConnected) {
    const vw = (_e2 = (_d2 = window.visualViewport) == null ? void 0 : _d2.width) != null ? _e2 : window.innerWidth;
    const vh = (_g = (_f = window.visualViewport) == null ? void 0 : _f.height) != null ? _g : window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;
    return { left: cx, top: cy, right: cx, bottom: cy, width: 0, height: 0 };
  }
  const rect = anchor.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height
  };
};
measurePanel_fn = function(panel) {
  var _a2;
  const rect = panel.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    __privateSet(this, _lastPanelSize, { width: rect.width, height: rect.height });
    return __privateGet(this, _lastPanelSize);
  }
  const saved = {
    display: panel.style.display,
    position: panel.style.position,
    left: panel.style.left,
    top: panel.style.top,
    visibility: panel.style.visibility,
    maxHeight: panel.style.maxHeight
  };
  panel.style.display = "block";
  panel.style.position = "fixed";
  panel.style.left = "-99999px";
  panel.style.top = "0";
  panel.style.visibility = "hidden";
  panel.style.maxHeight = "none";
  const rect2 = panel.getBoundingClientRect();
  panel.style.display = saved.display;
  panel.style.position = saved.position;
  panel.style.left = saved.left;
  panel.style.top = saved.top;
  panel.style.visibility = saved.visibility;
  panel.style.maxHeight = saved.maxHeight;
  if (rect2.width > 0 && rect2.height > 0) {
    __privateSet(this, _lastPanelSize, { width: rect2.width, height: rect2.height });
    return __privateGet(this, _lastPanelSize);
  }
  return (_a2 = __privateGet(this, _lastPanelSize)) != null ? _a2 : { width: 560, height: 400 };
};
// ──────────────────────────────────────────────────────────────────────────────
// Control rendering
// ──────────────────────────────────────────────────────────────────────────────
renderControls_fn = function() {
  var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  if (__privateGet(this, _controlsEffectCleanup)) __privateGet(this, _controlsEffectCleanup).call(this);
  const space = __privateGet(this, _space2).value;
  if (!__privateGet(this, _controls)) return;
  const current = parseIntoChannels(space, __privateGet(this, _value).value);
  const ch = current.ch;
  const channelSignals = {};
  Object.keys(ch).forEach((key) => {
    channelSignals[key] = d$1(String(ch[key]));
  });
  let rafId = null;
  let pendingApply = null;
  const stripLeadingZeros = (s2) => s2.replace(/^0+(\d)/, "$1").replace(/^0\./, ".");
  const make = (label, key, min, max2, step = 1, bg, bgColor) => {
    var _a3, _b3, _c3, _d3;
    const wrapHue = key === "H";
    const isLabAB = (key === "A" || key === "B") && (space === "lab" || space === "oklab");
    const isPercentage = !isLabAB && ["L", "S", "C", "W", "B", "R", "G", "ALP"].includes(key);
    const isAngle = key === "H";
    const group = document.createElement("div");
    group.className = "control";
    const lab2 = document.createElement("label");
    lab2.textContent = label;
    const titleMap = {
      "L": "Lightness",
      "C": "Chroma",
      "H": "Hue",
      "S": "Saturation",
      "A": "A (green-red axis)",
      "W": "Whiteness",
      "R": "Red",
      "G": "Green",
      "ALP": "Alpha"
    };
    if (key === "B") {
      if (space === "oklab" || space === "lab") {
        lab2.title = "B (blue-yellow axis)";
      } else if (space === "hwb") {
        lab2.title = "Blackness";
      } else {
        lab2.title = "Blue";
      }
    } else if (titleMap[key]) {
      lab2.title = titleMap[key];
    }
    const range = document.createElement("input");
    range.type = "range";
    range.min = String(min);
    range.max = String(max2);
    range.step = String(step);
    range.classList.add(`ch-${key.toLowerCase()}`);
    if (bg) range.style.backgroundImage = bg;
    if (bgColor) range.style.backgroundColor = bgColor;
    range.value = String((_a3 = ch[key]) != null ? _a3 : 0);
    if (key === "ALP") {
      range.classList.add("alpha");
      try {
        const c0 = gencolor(space, { ...ch, ALP: "0" });
        const c12 = gencolor(space, { ...ch, ALP: "100" });
        const interpSpace = space === "hsl" ? "hsl" : space === "lch" ? "lch" : space === "oklch" ? "oklch" : "oklab";
        range.style.background = `linear-gradient(to right in ${interpSpace}, ${c0}, ${c12}), var(--checker)`;
      } catch {
      }
    }
    const num = document.createElement("input");
    num.type = "number";
    num.min = isLabAB ? "0" : String(min);
    num.max = isLabAB ? String(Math.max(Math.abs(min), Math.abs(max2))) : String(max2);
    num.step = String(step);
    num.classList.add(`ch-${key.toLowerCase()}`);
    num.value = isLabAB ? String(Math.abs(Number((_b3 = ch[key]) != null ? _b3 : 0))) : String((_c3 = ch[key]) != null ? _c3 : 0);
    const numWrapper = document.createElement("div");
    numWrapper.className = "num-wrapper";
    numWrapper.appendChild(num);
    if (isPercentage || isAngle) {
      const unit = document.createElement("sup");
      unit.textContent = isAngle ? "°" : "%";
      numWrapper.appendChild(unit);
    }
    let signSup = null;
    if (isLabAB) {
      signSup = document.createElement("sup");
      const val = Number((_d3 = ch[key]) != null ? _d3 : 0);
      signSup.textContent = val < 0 ? "−" : "+";
      numWrapper.appendChild(signSup);
      num.value = stripLeadingZeros(String(Math.abs(val)));
    }
    const apply = () => {
      const next = gencolor(space, ch);
      __privateGet(this, _value).value = next;
      this.setAttribute("value", next);
      __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
    };
    const onInput = (ev) => {
      const target = ev.target;
      let val = Number(target.value);
      if (!Number.isFinite(val)) return;
      if (isLabAB && target === num) {
        val = Math.abs(val) * (signSup && signSup.textContent === "−" ? -1 : 1);
      }
      if (wrapHue) {
        val = (val % 360 + 360) % 360;
      } else {
        val = Math.max(min, Math.min(max2, val));
      }
      const formatted = formatChannel(space, key, val);
      ch[key] = formatted;
      channelSignals[key].value = formatted;
      range.value = String(ch[key]);
      if (isLabAB) {
        const n2 = Number(ch[key]);
        if (signSup) signSup.textContent = n2 < 0 ? "−" : "+";
        num.value = stripLeadingZeros(String(Math.abs(n2)));
      } else {
        num.value = String(ch[key]);
      }
      pendingApply = apply;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (pendingApply) {
            pendingApply();
            pendingApply = null;
          }
        });
      }
    };
    num.addEventListener("keydown", (ev) => {
      if (ev.key !== "ArrowUp" && ev.key !== "ArrowDown") return;
      if (!ev.shiftKey && !ev.altKey) return;
      ev.preventDefault();
      const dir = ev.key === "ArrowUp" ? 1 : -1;
      const delta = ev.shiftKey ? step * 10 : ev.altKey ? step * 0.1 : step;
      let val = Number(num.value) * (isLabAB && (signSup == null ? void 0 : signSup.textContent) === "−" ? -1 : 1);
      val += dir * delta;
      if (wrapHue) {
        val = (val % 360 + 360) % 360;
      } else {
        val = Math.max(min, Math.min(max2, val));
      }
      const formatted = formatChannel(space, key, val);
      ch[key] = formatted;
      channelSignals[key].value = formatted;
      range.value = String(ch[key]);
      if (isLabAB) {
        const n2 = Number(ch[key]);
        if (signSup) signSup.textContent = n2 < 0 ? "−" : "+";
        num.value = stripLeadingZeros(String(Math.abs(n2)));
      } else {
        num.value = String(ch[key]);
      }
      pendingApply = apply;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (pendingApply) {
            pendingApply();
            pendingApply = null;
          }
        });
      }
    });
    range.addEventListener("input", onInput);
    num.addEventListener("input", onInput);
    group.append(lab2, range, numWrapper);
    return group;
  };
  __privateGet(this, _controls).innerHTML = "";
  if (space === "oklab") {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in oklab to right, black, white)"),
      make("A", "A", -0.5, 0.5, 0.01, "linear-gradient(to right in oklab, oklab(65% -.5 .5), oklab(65% .5 .5))"),
      make("B", "B", -0.5, 0.5, 0.01, "linear-gradient(to right in oklab, oklab(47% -.03 -.32), oklab(96% 0 .25))"),
      alphaControl
    );
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const L = channelSignals.L.value || "50";
      const A = channelSignals.A.value || "0";
      const B = channelSignals.B.value || "0";
      if (alphaRange) {
        alphaRange.style.background = `linear-gradient(to right in oklab, oklab(${L}% ${A} ${B} / 0%), oklab(${L}% ${A} ${B} / 100%)), var(--checker)`;
      }
    }));
  } else if (space === "oklch") {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in oklab to right, black, white)"),
      make("C", "C", 0, 100, 1, `linear-gradient(in oklch to right, oklch(${(_a2 = ch.L) != null ? _a2 : 0}% 1% ${(_b2 = ch.H) != null ? _b2 : 0}), oklch(${(_c2 = ch.L) != null ? _c2 : 0}% 100% ${(_d2 = ch.H) != null ? _d2 : 0}))`),
      make("H", "H", 0, 359, 1, "linear-gradient(to right in oklch longer hue, oklch(90% 75% 0), oklch(90% 75% 0))"),
      alphaControl
    );
    const cRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-c');
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const L = channelSignals.L.value || "0";
      const C = channelSignals.C.value || "0";
      const H = channelSignals.H.value || "0";
      if (cRange) {
        cRange.style.backgroundImage = `linear-gradient(in oklch to right, oklch(${L}% 1% ${H}deg), oklch(${L}% 100% ${H}deg))`;
      }
      if (alphaRange) {
        alphaRange.style.background = `linear-gradient(to right in oklch, oklch(${L}% ${C}% ${H} / 0%), oklch(${L}% ${C}% ${H} / 100%)), var(--checker)`;
      }
    }));
  } else if (space === "lab") {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in lab to right, black, white)"),
      make("A", "A", -160, 160, 1, "linear-gradient(to right in oklab, lab(85% -100 100), lab(55% 100 100))"),
      make("B", "B", -160, 160, 1, "linear-gradient(to right in oklab, lab(31% 70 -120), lab(96% 0 120))"),
      alphaControl
    );
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const L = channelSignals.L.value || "50";
      const A = channelSignals.A.value || "0";
      const B = channelSignals.B.value || "0";
      if (alphaRange) {
        alphaRange.style.background = `linear-gradient(to right in lab, lab(${L}% ${A} ${B} / 0%), lab(${L}% ${A} ${B} / 100%)), var(--checker)`;
      }
    }));
  } else if (space === "lch") {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in lab to right, black, white)"),
      make("C", "C", 0, 100, 1, `linear-gradient(in lch to right, lch(${(_e2 = ch.L) != null ? _e2 : 0}% 1% ${(_f = ch.H) != null ? _f : 0}), lch(${(_g = ch.L) != null ? _g : 0}% 100% ${(_h = ch.H) != null ? _h : 0}))`),
      make("H", "H", 0, 359, 1, "linear-gradient(to right in lch longer hue, lch(90% 75% 0), lch(90% 75% 0))"),
      alphaControl
    );
    const cRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-c');
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const L = channelSignals.L.value || "50";
      const C = channelSignals.C.value || "0";
      const H = channelSignals.H.value || "0";
      if (cRange) {
        cRange.style.backgroundImage = `linear-gradient(in lch to right, lch(${L}% 1% ${H}), lch(${L}% 100% ${H}))`;
      }
      if (alphaRange) {
        alphaRange.style.background = `linear-gradient(to right in lch, lch(${L}% ${C}% ${H} / 0%), lch(${L}% ${C}% ${H} / 100%)), var(--checker)`;
      }
    }));
  } else if (space === "hsl") {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("H", "H", 0, 359, 1, "linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))"),
      make("S", "S", 0, 100, 1, `linear-gradient(in hsl to right, hsl(${(_i = ch.H) != null ? _i : 0} 0% ${(_j = ch.L) != null ? _j : 50}% / 100%), hsl(${(_k = ch.H) != null ? _k : 0} 100% ${(_l = ch.L) != null ? _l : 50}% / 100%))`),
      make("L", "L", 0, 100, 1, `linear-gradient(in oklab to right, hsl(${(_m = ch.H) != null ? _m : 0} ${(_n = ch.S) != null ? _n : 100}% 0%), hsl(${(_o = ch.H) != null ? _o : 0} ${(_p = ch.S) != null ? _p : 100}% 100%))`),
      alphaControl
    );
    const sRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-s');
    const lRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-l');
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const H = channelSignals.H.value || "0";
      const S = channelSignals.S.value || "100";
      const L = channelSignals.L.value || "50";
      if (sRange) {
        sRange.style.backgroundImage = `linear-gradient(in hsl to right, hsl(${H} 0% ${L}% / 100%), hsl(${H} 100% ${L}% / 100%))`;
      }
      if (lRange) {
        lRange.style.backgroundImage = `linear-gradient(in oklab to right, hsl(${H} ${S}% 0%), hsl(${H} ${S}% 100%))`;
      }
      if (alphaRange) {
        alphaRange.style.background = `linear-gradient(to right in hsl, hsl(${H} ${S}% ${L}% / 0%), hsl(${H} ${S}% ${L}% / 100%)), var(--checker)`;
      }
    }));
  } else if (space === "hwb") {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("H", "H", 0, 359, 1, "linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))"),
      make("W", "W", 0, 100, 1, "linear-gradient(to right in oklab, #fff0, #fff)", "black"),
      make("B", "B", 0, 100, 1, "linear-gradient(to right in oklab, #0000, #000)", "white"),
      alphaControl
    );
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const H = channelSignals.H.value || "0";
      const W = channelSignals.W.value || "0";
      const B = channelSignals.B.value || "0";
      if (alphaRange) {
        alphaRange.style.background = `linear-gradient(to right in hwb, hwb(${H} ${W}% ${B}% / 0%), hwb(${H} ${W}% ${B}% / 100%)), var(--checker)`;
      }
    }));
  } else if (space === "srgb" || space === "hex") {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("R", "R", 0, 100, 1, "linear-gradient(to right in oklab, #f000, #f00)", "black"),
      make("G", "G", 0, 100, 1, "linear-gradient(to right in oklab, #0f00, #0f0)", "black"),
      make("B", "B", 0, 100, 1, "linear-gradient(to right in oklab, #00f0, #00f)", "black"),
      alphaControl
    );
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const R = channelSignals.R.value || "0";
      const G = channelSignals.G.value || "0";
      const B = channelSignals.B.value || "0";
      if (alphaRange) {
        alphaRange.style.background = `linear-gradient(to right in srgb, rgb(${R}% ${G}% ${B}% / 0%), rgb(${R}% ${G}% ${B}% / 100%)), var(--checker)`;
      }
    }));
  } else if (isRGBLike(space)) {
    const alphaControl = make("A", "ALP", 0, 100, 1);
    if (__privateGet(this, _noAlpha).value) alphaControl.style.display = "none";
    __privateGet(this, _controls).append(
      make("R", "R", 0, 100, 1, "linear-gradient(to right in oklab, #f000, #f00)", "black"),
      make("G", "G", 0, 100, 1, "linear-gradient(to right in oklab, #0f00, #0f0)", "black"),
      make("B", "B", 0, 100, 1, "linear-gradient(to right in oklab, #00f0, #00f)", "black"),
      alphaControl
    );
    const alphaRange = __privateGet(this, _controls).querySelector('input[type="range"].ch-alp');
    __privateSet(this, _controlsEffectCleanup, E(() => {
      const R = channelSignals.R.value || "0";
      const G = channelSignals.G.value || "0";
      const B = channelSignals.B.value || "0";
      if (alphaRange) {
        const c0 = gencolor(space, { ...ch, R, G, B, ALP: "0" });
        const c12 = gencolor(space, { ...ch, R, G, B, ALP: "100" });
        alphaRange.style.background = `linear-gradient(to right, ${c0}, ${c12}), var(--checker)`;
      }
    }));
  }
};
customElements.define("color-input", ColorInput);
export {
  ColorInput
};
//# sourceMappingURL=index.js.map
