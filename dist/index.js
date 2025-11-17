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
var _a, _b, _c, _value, _space, _theme, _open, _anchor, _error, _contrast, _gamut, _previewEffectCleanup, _colorSchemeEffectCleanup, _errorEffectCleanup, _controlsEffectCleanup, _root, _panel, _controls, _spaceSelect, _output, _chip, _internalTrigger, _textInput, _errorMessage, _lastInvoker, _ColorInput_instances, emitChange_fn, validateAndSetColor_fn, _lastPlacement, _lastPanelSize, _cleanup, _rafId, startReposition_fn, stopReposition_fn, scheduleReposition_fn, positionNow_fn, getAnchorRect_fn, measurePanel_fn, renderControls_fn;
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
        if (!(8 & r.f) && c$1(r)) try {
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
function n$2(i2) {
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
    else n$2(function() {
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
      if (void 0 === o2) n$2(function() {
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
function c$1(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
  return false;
}
function a$1(i2) {
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
  if (this.i > 0 && !c$1(this)) {
    this.f &= -2;
    return true;
  }
  var i2 = o;
  try {
    a$1(this);
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
      b$2(i2);
      throw t2;
    } finally {
      o = n2;
      t();
    }
  }
}
function b$2(i2) {
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
  if (8 & this.f) b$2(this);
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
  a$1(this);
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
  if (!(1 & this.f)) b$2(this);
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
function multiplyMatrices(A, B) {
  let m3 = A.length;
  if (!Array.isArray(A[0])) {
    A = [A];
  }
  if (!Array.isArray(B[0])) {
    B = B.map((x) => [x]);
  }
  let p2 = B[0].length;
  let B_cols = B[0].map((_2, i2) => B.map((x) => x[i2]));
  let product = A.map((row) => B_cols.map((col) => {
    let ret = 0;
    if (!Array.isArray(row)) {
      for (let c4 of col) {
        ret += row * c4;
      }
      return ret;
    }
    for (let i2 = 0; i2 < row.length; i2++) {
      ret += row[i2] * (col[i2] || 0);
    }
    return ret;
  }));
  if (m3 === 1) {
    product = product[0];
  }
  if (p2 === 1) {
    return product.map((x) => x[0]);
  }
  return product;
}
function isString(str) {
  return type(str) === "string";
}
function type(o2) {
  let str = Object.prototype.toString.call(o2);
  return (str.match(/^\[object\s+(.*?)\]$/)[1] || "").toLowerCase();
}
function serializeNumber(n2, { precision, unit }) {
  if (isNone(n2)) {
    return "none";
  }
  return toPrecision(n2, precision) + (unit != null ? unit : "");
}
function isNone(n2) {
  return Number.isNaN(n2) || n2 instanceof Number && (n2 == null ? void 0 : n2.none);
}
function skipNone(n2) {
  return isNone(n2) ? 0 : n2;
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
const angleFactor = {
  deg: 1,
  grad: 0.9,
  rad: 180 / Math.PI,
  turn: 360
};
function parseFunction(str) {
  if (!str) {
    return;
  }
  str = str.trim();
  const isFunctionRegex = /^([a-z]+)\((.+?)\)$/i;
  const isNumberRegex = /^-?[\d.]+$/;
  const unitValueRegex = /%|deg|g?rad|turn$/;
  const singleArgument = /\/?\s*(none|[-\w.]+(?:%|deg|g?rad|turn)?)/g;
  let parts = str.match(isFunctionRegex);
  if (parts) {
    let args = [];
    parts[2].replace(singleArgument, ($0, rawArg) => {
      let match = rawArg.match(unitValueRegex);
      let arg = rawArg;
      if (match) {
        let unit = match[0];
        let unitlessArg = arg.slice(0, -unit.length);
        if (unit === "%") {
          arg = new Number(unitlessArg / 100);
          arg.type = "<percentage>";
        } else {
          arg = new Number(unitlessArg * angleFactor[unit]);
          arg.type = "<angle>";
          arg.unit = unit;
        }
      } else if (isNumberRegex.test(arg)) {
        arg = new Number(arg);
        arg.type = "<number>";
      } else if (arg === "none") {
        arg = new Number(NaN);
        arg.none = true;
      }
      if ($0.startsWith("/")) {
        arg = arg instanceof Number ? arg : new Number(arg);
        arg.alpha = true;
      }
      if (typeof arg === "object" && arg instanceof Number) {
        arg.raw = rawArg;
      }
      args.push(arg);
    });
    return {
      name: parts[1].toLowerCase(),
      rawName: parts[1],
      rawArgs: parts[2],
      // An argument could be (as of css-color-4):
      // a number, percentage, degrees (hue), ident (in color())
      args
    };
  }
}
function last(arr) {
  return arr[arr.length - 1];
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
  return interpolate(to2[0], to2[1], interpolateInv(from[0], from[1], value));
}
function parseCoordGrammar(coordGrammars) {
  return coordGrammars.map((coordGrammar2) => {
    return coordGrammar2.split("|").map((type2) => {
      type2 = type2.trim();
      let range2 = type2.match(/^(<[a-z]+>)\[(-?[.\d]+),\s*(-?[.\d]+)\]?$/);
      if (range2) {
        let ret = new String(range2[1]);
        ret.range = [+range2[2], +range2[3]];
        return ret;
      }
      return type2;
    });
  });
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
var util = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  bisectLeft,
  clamp,
  copySign,
  interpolate,
  interpolateInv,
  isNone,
  isString,
  last,
  mapRange,
  multiplyMatrices,
  parseCoordGrammar,
  parseFunction,
  serializeNumber,
  skipNone,
  spow,
  toPrecision,
  type,
  zdiv
});
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
var defaults = {
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
function adapt$2(W1, W2, XYZ, options = {}) {
  W1 = getWhite(W1);
  W2 = getWhite(W2);
  if (!W1 || !W2) {
    throw new TypeError(`Missing white point to convert ${!W1 ? "from" : ""}${!W1 && !W2 ? "/" : ""}${!W2 ? "to" : ""}`);
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
    return multiplyMatrices(env.M, env.XYZ);
  } else {
    throw new TypeError("Only Bradford CAT with white points D50 and D65 supported for now.");
  }
}
const noneTypes = /* @__PURE__ */ new Set(["<number>", "<percentage>", "<angle>"]);
function coerceCoords(space, format, name, coords) {
  let types = Object.entries(space.coords).map(([id, coordMeta], i2) => {
    let coordGrammar2 = format.coordGrammar[i2];
    let arg = coords[i2];
    let providedType = arg == null ? void 0 : arg.type;
    let type2;
    if (arg.none) {
      type2 = coordGrammar2.find((c4) => noneTypes.has(c4));
    } else {
      type2 = coordGrammar2.find((c4) => c4 == providedType);
    }
    if (!type2) {
      let coordName = coordMeta.name || id;
      throw new TypeError(`${providedType != null ? providedType : arg.raw} not allowed for ${coordName} in ${name}()`);
    }
    let fromRange = type2.range;
    if (providedType === "<percentage>") {
      fromRange || (fromRange = [0, 1]);
    }
    let toRange = coordMeta.range || coordMeta.refRange;
    if (fromRange && toRange) {
      coords[i2] = mapRange(fromRange, toRange, coords[i2]);
    }
    return type2;
  });
  return types;
}
function parse(str, { meta } = {}) {
  var _a2, _b2, _c2, _d, _e;
  let env = { "str": (_a2 = String(str)) == null ? void 0 : _a2.trim() };
  hooks.run("parse-start", env);
  if (env.color) {
    return env.color;
  }
  env.parsed = parseFunction(env.str);
  if (env.parsed) {
    let name = env.parsed.name;
    if (name === "color") {
      let id = env.parsed.args.shift();
      let alternateId = id.startsWith("--") ? id.substring(2) : `--${id}`;
      let ids = [id, alternateId];
      let alpha = env.parsed.rawArgs.indexOf("/") > 0 ? env.parsed.args.pop() : 1;
      for (let space of ColorSpace.all) {
        let colorSpec = space.getFormat("color");
        if (colorSpec) {
          if (ids.includes(colorSpec.id) || ((_b2 = colorSpec.ids) == null ? void 0 : _b2.filter((specId) => ids.includes(specId)).length)) {
            const coords = Object.keys(space.coords).map((_2, i2) => env.parsed.args[i2] || 0);
            let types;
            if (colorSpec.coordGrammar) {
              types = coerceCoords(space, colorSpec, "color", coords);
            }
            if (meta) {
              Object.assign(meta, { formatId: "color", types });
            }
            if (colorSpec.id.startsWith("--") && !id.startsWith("--")) {
              defaults.warn(`${space.name} is a non-standard space and not currently supported in the CSS spec. Use prefixed color(${colorSpec.id}) instead of color(${id}).`);
            }
            if (id.startsWith("--") && !colorSpec.id.startsWith("--")) {
              defaults.warn(`${space.name} is a standard space and supported in the CSS spec. Use color(${colorSpec.id}) instead of prefixed color(${id}).`);
            }
            return { spaceId: space.id, coords, alpha };
          }
        }
      }
      let didYouMean = "";
      let registryId = id in ColorSpace.registry ? id : alternateId;
      if (registryId in ColorSpace.registry) {
        let cssId = (_d = (_c2 = ColorSpace.registry[registryId].formats) == null ? void 0 : _c2.color) == null ? void 0 : _d.id;
        if (cssId) {
          didYouMean = `Did you mean color(${cssId})?`;
        }
      }
      throw new TypeError(`Cannot parse color(${id}). ` + (didYouMean || "Missing a plugin?"));
    } else {
      for (let space of ColorSpace.all) {
        let format = space.getFormat(name);
        if (format && format.type === "function") {
          let alpha = 1;
          if (format.lastAlpha || last(env.parsed.args).alpha) {
            alpha = env.parsed.args.pop();
          }
          let coords = env.parsed.args;
          let types;
          if (format.coordGrammar) {
            types = coerceCoords(space, format, name, coords);
          }
          if (meta) {
            Object.assign(meta, { formatId: format.name, types });
          }
          return {
            spaceId: space.id,
            coords,
            alpha
          };
        }
      }
    }
  } else {
    for (let space of ColorSpace.all) {
      for (let formatId in space.formats) {
        let format = space.formats[formatId];
        if (format.type !== "custom") {
          continue;
        }
        if (format.test && !format.test(env.str)) {
          continue;
        }
        let color = format.parse(env.str);
        if (color) {
          (_e = color.alpha) != null ? _e : color.alpha = 1;
          if (meta) {
            meta.formatId = formatId;
          }
          return color;
        }
      }
    }
  }
  throw new TypeError(`Could not parse ${str} as a color. Missing a plugin?`);
}
function getColor(color) {
  if (Array.isArray(color)) {
    return color.map(getColor);
  }
  if (!color) {
    throw new TypeError("Empty color reference");
  }
  if (isString(color)) {
    color = parse(color);
  }
  let space = color.space || color.spaceId;
  if (!(space instanceof ColorSpace)) {
    color.space = ColorSpace.get(space);
  }
  if (color.alpha === void 0) {
    color.alpha = 1;
  }
  return color;
}
const ε$7 = 75e-6;
const _ColorSpace = class _ColorSpace {
  constructor(options) {
    var _a2, _b2, _c2, _d, _e, _f;
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
    this.formats = (_d = options.formats) != null ? _d : {};
    for (let name in this.formats) {
      let format = this.formats[name];
      format.type || (format.type = "function");
      format.name || (format.name = name);
    }
    if (!((_e = this.formats.color) == null ? void 0 : _e.id)) {
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
  inGamut(coords, { epsilon = ε$7 } = {}) {
    if (!this.equals(this.gamutSpace)) {
      coords = this.to(this.gamutSpace, coords);
      return this.gamutSpace.inGamut(coords, { epsilon });
    }
    let coordMeta = Object.values(this.coords);
    return coords.every((c4, i2) => {
      let meta = coordMeta[i2];
      if (meta.type !== "angle" && meta.range) {
        if (Number.isNaN(c4)) {
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
  getFormat(format) {
    if (typeof format === "object") {
      format = processFormat(format, this);
      return format;
    }
    let ret;
    if (format === "default") {
      ret = Object.values(this.formats)[0];
    } else {
      ret = this.formats[format];
    }
    if (ret) {
      ret = processFormat(ret, this);
      return ret;
    }
    return null;
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
    coords = coords.map((c4) => Number.isNaN(c4) ? 0 : c4);
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
      throw new Error(`Cannot convert between color spaces ${this} and ${space}: no connection space was found`);
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
      let range2 = meta.range || meta.refRange;
      ret.push((_a2 = range2 == null ? void 0 : range2.min) != null ? _a2 : 0);
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
    if (!space || space instanceof _ColorSpace) {
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
      throw new TypeError(`Cannot resolve coordinate reference ${ref}: No color space specified and relative references are not allowed here`);
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
    throw new TypeError(`No "${coord}" coordinate found in ${space.name}. Its coordinates are: ${Object.keys(space.coords).join(", ")}`);
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
function processFormat(format, { coords } = {}) {
  if (format.coords && !format.coordGrammar) {
    format.type || (format.type = "function");
    format.name || (format.name = "color");
    format.coordGrammar = parseCoordGrammar(format.coords);
    let coordFormats = Object.entries(coords).map(([id, coordMeta], i2) => {
      let outputType = format.coordGrammar[i2][0];
      let fromRange = coordMeta.range || coordMeta.refRange;
      let toRange = outputType.range, suffix = "";
      if (outputType == "<percentage>") {
        toRange = [0, 100];
        suffix = "%";
      } else if (outputType == "<angle>") {
        suffix = "deg";
      }
      return { fromRange, toRange, suffix };
    });
    format.serializeCoords = (coords2, precision) => {
      return coords2.map((c4, i2) => {
        let { fromRange, toRange, suffix } = coordFormats[i2];
        if (fromRange && toRange) {
          c4 = mapRange(fromRange, toRange, c4);
        }
        c4 = serializeNumber(c4, { precision, unit: suffix });
        return c4;
      });
    };
  }
  return format;
}
var xyz_d65 = new ColorSpace({
  id: "xyz-d65",
  name: "XYZ D65",
  coords: {
    x: { name: "X" },
    y: { name: "Y" },
    z: { name: "Z" }
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
   * @param {*} options - Same options as {@link ColorSpace} plus:
   * @param {number[][]} options.toXYZ_M - Matrix to convert to XYZ
   * @param {number[][]} options.fromXYZ_M - Matrix to convert from XYZ
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
        let xyz = multiplyMatrices(options.toXYZ_M, rgb);
        if (this.white !== this.base.white) {
          xyz = adapt$2(this.white, this.base.white, xyz);
        }
        return xyz;
      };
      (_b2 = options.fromBase) != null ? _b2 : options.fromBase = (xyz) => {
        xyz = adapt$2(this.base.white, this.white, xyz);
        return multiplyMatrices(options.fromXYZ_M, xyz);
      };
    }
    (_c2 = options.referred) != null ? _c2 : options.referred = "display";
    super(options);
  }
}
function getAll(color, space) {
  color = getColor(color);
  if (!space || color.space.equals(space)) {
    return color.coords.slice();
  }
  space = ColorSpace.get(space);
  return space.from(color);
}
function get(color, prop) {
  color = getColor(color);
  let { space, index } = ColorSpace.resolveCoord(prop, color.space);
  let coords = getAll(color, space);
  return coords[index];
}
function setAll(color, space, coords) {
  color = getColor(color);
  space = ColorSpace.get(space);
  color.coords = space.to(color.space, coords);
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
    let { space, index } = ColorSpace.resolveCoord(prop, color.space);
    let coords = getAll(color, space);
    coords[index] = value;
    setAll(color, space, coords);
  }
  return color;
}
set.returns = "color";
var XYZ_D50 = new ColorSpace({
  id: "xyz-d50",
  name: "XYZ D50",
  white: "D50",
  base: xyz_d65,
  fromBase: (coords) => adapt$2(xyz_d65.white, "D50", coords),
  toBase: (coords) => adapt$2("D50", xyz_d65.white, coords)
});
const ε$6 = 216 / 24389;
const ε3$1 = 24 / 116;
const κ$4 = 24389 / 27;
let white$4 = WHITES.D50;
var lab = new ColorSpace({
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
  white: white$4,
  base: XYZ_D50,
  // Convert D50-adapted XYX to Lab
  //  CIE 15.3:2004 section 8.2.1.1
  fromBase(XYZ) {
    let xyz = XYZ.map((value, i2) => value / white$4[i2]);
    let f2 = xyz.map((value) => value > ε$6 ? Math.cbrt(value) : (κ$4 * value + 16) / 116);
    return [
      116 * f2[1] - 16,
      // L
      500 * (f2[0] - f2[1]),
      // a
      200 * (f2[1] - f2[2])
      // b
    ];
  },
  // Convert Lab to D50-adapted XYZ
  // Same result as CIE 15.3:2004 Appendix D although the derivation is different
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  toBase(Lab) {
    let f2 = [];
    f2[1] = (Lab[0] + 16) / 116;
    f2[0] = Lab[1] / 500 + f2[1];
    f2[2] = f2[1] - Lab[2] / 200;
    let xyz = [
      f2[0] > ε3$1 ? Math.pow(f2[0], 3) : (116 * f2[0] - 16) / κ$4,
      Lab[0] > 8 ? Math.pow((Lab[0] + 16) / 116, 3) : Lab[0] / κ$4,
      f2[2] > ε3$1 ? Math.pow(f2[2], 3) : (116 * f2[2] - 16) / κ$4
    ];
    return xyz.map((value, i2) => value * white$4[i2]);
  },
  formats: {
    "lab": {
      coords: ["<number> | <percentage>", "<number> | <percentage>[-1,1]", "<number> | <percentage>[-1,1]"]
    }
  }
});
function constrain(angle) {
  return (angle % 360 + 360) % 360;
}
function adjust(arc, angles) {
  if (arc === "raw") {
    return angles;
  }
  let [a1, a2] = angles.map(constrain);
  let angleDiff = a2 - a1;
  if (arc === "increasing") {
    if (angleDiff < 0) {
      a2 += 360;
    }
  } else if (arc === "decreasing") {
    if (angleDiff > 0) {
      a1 += 360;
    }
  } else if (arc === "longer") {
    if (-180 < angleDiff && angleDiff < 180) {
      if (angleDiff > 0) {
        a1 += 360;
      } else {
        a2 += 360;
      }
    }
  } else if (arc === "shorter") {
    if (angleDiff > 180) {
      a1 += 360;
    } else if (angleDiff < -180) {
      a2 += 360;
    }
  }
  return [a1, a2];
}
var lch = new ColorSpace({
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
    let [L, a2, b2] = Lab;
    let hue;
    const ε2 = 0.02;
    if (Math.abs(a2) < ε2 && Math.abs(b2) < ε2) {
      hue = NaN;
    } else {
      hue = Math.atan2(b2, a2) * 180 / Math.PI;
    }
    return [
      L,
      // L is still L
      Math.sqrt(a2 ** 2 + b2 ** 2),
      // Chroma
      constrain(hue)
      // Hue, in degrees [0 to 360)
    ];
  },
  toBase(LCH) {
    let [Lightness, Chroma, Hue] = LCH;
    if (Chroma < 0) {
      Chroma = 0;
    }
    if (isNaN(Hue)) {
      Hue = 0;
    }
    return [
      Lightness,
      // L is still L
      Chroma * Math.cos(Hue * Math.PI / 180),
      // a
      Chroma * Math.sin(Hue * Math.PI / 180)
      // b
    ];
  },
  formats: {
    "lch": {
      coords: ["<number> | <percentage>", "<number> | <percentage>", "<number> | <angle>"]
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
var OKLab = new ColorSpace({
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
    let LMS = multiplyMatrices(XYZtoLMS_M$1, XYZ);
    let LMSg = LMS.map((val) => Math.cbrt(val));
    return multiplyMatrices(LMStoLab_M, LMSg);
  },
  toBase(OKLab2) {
    let LMSg = multiplyMatrices(LabtoLMS_M, OKLab2);
    let LMS = LMSg.map((val) => val ** 3);
    return multiplyMatrices(LMStoXYZ_M$1, LMS);
  },
  formats: {
    "oklab": {
      coords: ["<percentage> | <number>", "<number> | <percentage>[-1,1]", "<number> | <percentage>[-1,1]"]
    }
  }
});
function deltaEOK(color, sample) {
  [color, sample] = getColor([color, sample]);
  let [L1, a1, b1] = OKLab.from(color);
  let [L2, a2, b2] = OKLab.from(sample);
  let ΔL = L1 - L2;
  let Δa = a1 - a2;
  let Δb = b1 - b2;
  return Math.sqrt(ΔL ** 2 + Δa ** 2 + Δb ** 2);
}
const ε$5 = 75e-6;
function inGamut(color, space, { epsilon = ε$5 } = {}) {
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
    coords: color.coords.slice(),
    alpha: color.alpha
  };
}
function distance(color1, color2, space = "lab") {
  space = ColorSpace.get(space);
  let coords1 = space.from(color1);
  let coords2 = space.from(color2);
  return Math.sqrt(coords1.reduce((acc, c12, i2) => {
    let c22 = coords2[i2];
    if (isNaN(c12) || isNaN(c22)) {
      return acc;
    }
    return acc + (c22 - c12) ** 2;
  }, 0));
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
  if (Number.isNaN(H1)) {
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
const Yw$1 = 203;
var XYZ_Abs_D65 = new ColorSpace({
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
    return XYZ.map((v2) => Math.max(v2 * Yw$1, 0));
  },
  toBase(AbsXYZ) {
    return AbsXYZ.map((v2) => Math.max(v2 / Yw$1, 0));
  }
});
const b$1 = 1.15;
const g = 0.66;
const n$1 = 2610 / 2 ** 14;
const ninv$1 = 2 ** 14 / 2610;
const c1$2 = 3424 / 2 ** 12;
const c2$2 = 2413 / 2 ** 7;
const c3$2 = 2392 / 2 ** 7;
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
  [1, 0.1386050432715393, 0.05804731615611886],
  [0.9999999999999999, -0.1386050432715393, -0.05804731615611886],
  [0.9999999999999998, -0.09601924202631895, -0.8118918960560388]
];
var Jzazbz = new ColorSpace({
  id: "jzazbz",
  name: "Jzazbz",
  coords: {
    jz: {
      refRange: [0, 1],
      name: "Jz"
    },
    az: {
      refRange: [-0.5, 0.5]
    },
    bz: {
      refRange: [-0.5, 0.5]
    }
  },
  base: XYZ_Abs_D65,
  fromBase(XYZ) {
    let [Xa, Ya, Za] = XYZ;
    let Xm = b$1 * Xa - (b$1 - 1) * Za;
    let Ym = g * Ya - (g - 1) * Xa;
    let LMS = multiplyMatrices(XYZtoCone_M, [Xm, Ym, Za]);
    let PQLMS = LMS.map(function(val) {
      let num = c1$2 + c2$2 * (val / 1e4) ** n$1;
      let denom = 1 + c3$2 * (val / 1e4) ** n$1;
      return (num / denom) ** p;
    });
    let [Iz, az, bz] = multiplyMatrices(ConetoIab_M, PQLMS);
    let Jz = (1 + d) * Iz / (1 + d * Iz) - d0;
    return [Jz, az, bz];
  },
  toBase(Jzazbz2) {
    let [Jz, az, bz] = Jzazbz2;
    let Iz = (Jz + d0) / (1 + d - d * (Jz + d0));
    let PQLMS = multiplyMatrices(IabtoCone_M, [Iz, az, bz]);
    let LMS = PQLMS.map(function(val) {
      let num = c1$2 - val ** pinv;
      let denom = c3$2 * val ** pinv - c2$2;
      let x = 1e4 * (num / denom) ** ninv$1;
      return x;
    });
    let [Xm, Ym, Za] = multiplyMatrices(ConetoXYZ_M, LMS);
    let Xa = (Xm + (b$1 - 1) * Za) / b$1;
    let Ya = (Ym + (g - 1) * Xa) / g;
    return [Xa, Ya, Za];
  },
  formats: {
    // https://drafts.csswg.org/css-color-hdr/#Jzazbz
    "color": {
      coords: ["<number> | <percentage>", "<number> | <percentage>[-1,1]", "<number> | <percentage>[-1,1]"]
    }
  }
});
var jzczhz = new ColorSpace({
  id: "jzczhz",
  name: "JzCzHz",
  coords: {
    jz: {
      refRange: [0, 1],
      name: "Jz"
    },
    cz: {
      refRange: [0, 1],
      name: "Chroma"
    },
    hz: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    }
  },
  base: Jzazbz,
  fromBase(jzazbz) {
    let [Jz, az, bz] = jzazbz;
    let hue;
    const ε2 = 2e-4;
    if (Math.abs(az) < ε2 && Math.abs(bz) < ε2) {
      hue = NaN;
    } else {
      hue = Math.atan2(bz, az) * 180 / Math.PI;
    }
    return [
      Jz,
      // Jz is still Jz
      Math.sqrt(az ** 2 + bz ** 2),
      // Chroma
      constrain(hue)
      // Hue, in degrees [0 to 360)
    ];
  },
  toBase(jzczhz2) {
    return [
      jzczhz2[0],
      // Jz is still Jz
      jzczhz2[1] * Math.cos(jzczhz2[2] * Math.PI / 180),
      // az
      jzczhz2[1] * Math.sin(jzczhz2[2] * Math.PI / 180)
      // bz
    ];
  }
});
function deltaEJz(color, sample) {
  [color, sample] = getColor([color, sample]);
  let [Jz1, Cz1, Hz1] = jzczhz.from(color);
  let [Jz2, Cz2, Hz2] = jzczhz.from(sample);
  let ΔJ = Jz1 - Jz2;
  let ΔC = Cz1 - Cz2;
  if (Number.isNaN(Hz1) && Number.isNaN(Hz2)) {
    Hz1 = 0;
    Hz2 = 0;
  } else if (Number.isNaN(Hz1)) {
    Hz1 = Hz2;
  } else if (Number.isNaN(Hz2)) {
    Hz2 = Hz1;
  }
  let Δh = Hz1 - Hz2;
  let ΔH = 2 * Math.sqrt(Cz1 * Cz2) * Math.sin(Δh / 2 * (Math.PI / 180));
  return Math.sqrt(ΔJ ** 2 + ΔC ** 2 + ΔH ** 2);
}
const c1$1 = 3424 / 4096;
const c2$1 = 2413 / 128;
const c3$1 = 2392 / 128;
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
var ictcp = new ColorSpace({
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
    let LMS = multiplyMatrices(XYZtoLMS_M, XYZ);
    return LMStoICtCp(LMS);
  },
  toBase(ICtCp) {
    let LMS = ICtCptoLMS(ICtCp);
    return multiplyMatrices(LMStoXYZ_M, LMS);
  }
});
function LMStoICtCp(LMS) {
  let PQLMS = LMS.map(function(val) {
    let num = c1$1 + c2$1 * (val / 1e4) ** m1$1;
    let denom = 1 + c3$1 * (val / 1e4) ** m1$1;
    return (num / denom) ** m2;
  });
  return multiplyMatrices(LMStoIPT_M, PQLMS);
}
function ICtCptoLMS(ICtCp) {
  let PQLMS = multiplyMatrices(IPTtoLMS_M, ICtCp);
  let LMS = PQLMS.map(function(val) {
    let num = Math.max(val ** im2 - c1$1, 0);
    let denom = c2$1 - c3$1 * val ** im2;
    return 1e4 * (num / denom) ** im1;
  });
  return LMS;
}
function deltaEITP(color, sample) {
  [color, sample] = getColor([color, sample]);
  let [I1, T1, P1] = ictcp.from(color);
  let [I2, T2, P2] = ictcp.from(sample);
  return 720 * Math.sqrt((I1 - I2) ** 2 + 0.25 * (T1 - T2) ** 2 + (P1 - P2) ** 2);
}
const white$3 = WHITES.D65;
const adaptedCoef = 0.42;
const adaptedCoefInv = 1 / adaptedCoef;
const tau = 2 * Math.PI;
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
function adapt$1(coords, fl) {
  const temp = coords.map((c4) => {
    const x = spow(fl * Math.abs(c4) * 0.01, adaptedCoef);
    return 400 * copySign(x, c4) / (x + 27.13);
  });
  return temp;
}
function unadapt(adapted, fl) {
  const constant = 100 / fl * 27.13 ** adaptedCoefInv;
  return adapted.map((c4) => {
    const cabs = Math.abs(c4);
    return copySign(constant * spow(cabs / (400 - cabs), adaptedCoefInv), c4);
  });
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
  return constrain(
    (Hp * (eii * hi - ei * hii) - 100 * hi * eii) / (Hp * (eii - ei) - 100 * eii)
  );
}
function environment(refWhite, adaptingLuminance, backgroundLuminance, surround, discounting) {
  const env = {};
  env.discounting = discounting;
  env.refWhite = refWhite;
  env.surround = surround;
  const xyzW = refWhite.map((c4) => {
    return c4 * 100;
  });
  env.la = adaptingLuminance;
  env.yb = backgroundLuminance;
  const yw = xyzW[1];
  const rgbW = multiplyMatrices(cat16, xyzW);
  surround = surroundMap[env.surround];
  const f2 = surround[0];
  env.c = surround[1];
  env.nc = surround[2];
  const k = 1 / (5 * env.la + 1);
  const k4 = k ** 4;
  env.fl = k4 * env.la + 0.1 * (1 - k4) * (1 - k4) * Math.cbrt(5 * env.la);
  env.flRoot = env.fl ** 0.25;
  env.n = env.yb / yw;
  env.z = 1.48 + Math.sqrt(env.n);
  env.nbb = 0.725 * env.n ** -0.2;
  env.ncb = env.nbb;
  const d2 = Math.max(
    Math.min(f2 * (1 - 1 / 3.6 * Math.exp((-env.la - 42) / 92)), 1),
    0
  );
  env.dRgb = rgbW.map((c4) => {
    return interpolate(1, yw / c4, d2);
  });
  env.dRgbInv = env.dRgb.map((c4) => {
    return 1 / c4;
  });
  const rgbCW = rgbW.map((c4, i2) => {
    return c4 * env.dRgb[i2];
  });
  const rgbAW = adapt$1(rgbCW, env.fl);
  env.aW = env.nbb * (2 * rgbAW[0] + rgbAW[1] + 0.05 * rgbAW[2]);
  return env;
}
const viewingConditions$1 = environment(
  white$3,
  64 / Math.PI * 0.2,
  20,
  "average",
  false
);
function fromCam16(cam162, env) {
  if (!(cam162.J !== void 0 ^ cam162.Q !== void 0)) {
    throw new Error("Conversion requires one and only one: 'J' or 'Q'");
  }
  if (!(cam162.C !== void 0 ^ cam162.M !== void 0 ^ cam162.s !== void 0)) {
    throw new Error("Conversion requires one and only one: 'C', 'M' or 's'");
  }
  if (!(cam162.h !== void 0 ^ cam162.H !== void 0)) {
    throw new Error("Conversion requires one and only one: 'h' or 'H'");
  }
  if (cam162.J === 0 || cam162.Q === 0) {
    return [0, 0, 0];
  }
  let hRad = 0;
  if (cam162.h !== void 0) {
    hRad = constrain(cam162.h) * deg2rad$1;
  } else {
    hRad = invHueQuadrature(cam162.H) * deg2rad$1;
  }
  const cosh = Math.cos(hRad);
  const sinh = Math.sin(hRad);
  let Jroot = 0;
  if (cam162.J !== void 0) {
    Jroot = spow(cam162.J, 1 / 2) * 0.1;
  } else if (cam162.Q !== void 0) {
    Jroot = 0.25 * env.c * cam162.Q / ((env.aW + 4) * env.flRoot);
  }
  let alpha = 0;
  if (cam162.C !== void 0) {
    alpha = cam162.C / Jroot;
  } else if (cam162.M !== void 0) {
    alpha = cam162.M / env.flRoot / Jroot;
  } else if (cam162.s !== void 0) {
    alpha = 4e-4 * cam162.s ** 2 * (env.aW + 4) / env.c;
  }
  const t2 = spow(
    alpha * Math.pow(1.64 - Math.pow(0.29, env.n), -0.73),
    10 / 9
  );
  const et = 0.25 * (Math.cos(hRad + 2) + 3.8);
  const A = env.aW * spow(Jroot, 2 / env.c / env.z);
  const p1 = 5e4 / 13 * env.nc * env.ncb * et;
  const p2 = A / env.nbb;
  const r = 23 * (p2 + 0.305) * zdiv(t2, 23 * p1 + t2 * (11 * cosh + 108 * sinh));
  const a2 = r * cosh;
  const b2 = r * sinh;
  const rgb_c = unadapt(
    multiplyMatrices(m1, [p2, a2, b2]).map((c4) => {
      return c4 * 1 / 1403;
    }),
    env.fl
  );
  return multiplyMatrices(
    cat16Inv,
    rgb_c.map((c4, i2) => {
      return c4 * env.dRgbInv[i2];
    })
  ).map((c4) => {
    return c4 / 100;
  });
}
function toCam16(xyzd65, env) {
  const xyz100 = xyzd65.map((c4) => {
    return c4 * 100;
  });
  const rgbA = adapt$1(
    multiplyMatrices(cat16, xyz100).map((c4, i2) => {
      return c4 * env.dRgb[i2];
    }),
    env.fl
  );
  const a2 = rgbA[0] + (-12 * rgbA[1] + rgbA[2]) / 11;
  const b2 = (rgbA[0] + rgbA[1] - 2 * rgbA[2]) / 9;
  const hRad = (Math.atan2(b2, a2) % tau + tau) % tau;
  const et = 0.25 * (Math.cos(hRad + 2) + 3.8);
  const t2 = 5e4 / 13 * env.nc * env.ncb * zdiv(
    et * Math.sqrt(a2 ** 2 + b2 ** 2),
    rgbA[0] + rgbA[1] + 1.05 * rgbA[2] + 0.305
  );
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
var cam16 = new ColorSpace({
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
    const cam162 = toCam16(xyz, viewingConditions$1);
    return [cam162.J, cam162.M, cam162.h];
  },
  toBase(cam162) {
    return fromCam16(
      { J: cam162[0], M: cam162[1], h: cam162[2] },
      viewingConditions$1
    );
  }
});
const white$2 = WHITES.D65;
const ε$4 = 216 / 24389;
const κ$3 = 24389 / 27;
function toLstar(y2) {
  const fy = y2 > ε$4 ? Math.cbrt(y2) : (κ$3 * y2 + 16) / 116;
  return 116 * fy - 16;
}
function fromLstar(lstar) {
  return lstar > 8 ? Math.pow((lstar + 16) / 116, 3) : lstar / κ$3;
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
  let last2 = Infinity;
  while (attempt <= max_attempts) {
    xyz = fromCam16({ J: j, C: c4, h: h2 }, env);
    const delta = Math.abs(xyz[1] - y2);
    if (delta < last2) {
      if (delta <= threshold) {
        return xyz;
      }
      last2 = delta;
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
  const cam162 = toCam16(xyz, viewingConditions);
  return [constrain(cam162.h), cam162.C, t2];
}
const viewingConditions = environment(
  white$2,
  200 / Math.PI * fromLstar(50),
  fromLstar(50) * 100,
  "average",
  false
);
var hct = new ColorSpace({
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
    return toHct(xyz);
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
var deltaEMethods = {
  deltaE76,
  deltaECMC,
  deltaE2000,
  deltaEJz,
  deltaEITP,
  deltaEOK,
  deltaEHCT
};
function calcEpsilon(jnd) {
  const order = !jnd ? 0 : Math.floor(Math.log10(Math.abs(jnd)));
  return Math.max(parseFloat(`1e${order - 2}`), 1e-6);
}
const GMAPPRESET = {
  "hct": {
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
  blackWhiteClamp = {}
} = {}) {
  color = getColor(color);
  if (isString(arguments[1])) {
    space = arguments[1];
  } else if (!space) {
    space = color.space;
  }
  space = ColorSpace.get(space);
  if (inGamut(color, space, { epsilon: 0 })) {
    return color;
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
        for (let m3 in deltaEMethods) {
          if ("deltae" + deltaEMethod.toLowerCase() === m3.toLowerCase()) {
            de = deltaEMethods[m3];
            break;
          }
        }
      }
      let clipped = toGamut(to(color, space), { method: "clip", space });
      if (de(color, clipped) > jnd) {
        if (Object.keys(blackWhiteClamp).length === 3) {
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
          let deltaE2 = de(mappedColor, clipped2);
          if (deltaE2 - jnd < ε2) {
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
    if (method === "clip" || !inGamut(spaceColor, space, { epsilon: 0 })) {
      let bounds = Object.values(space.coords).map((c4) => c4.range || []);
      spaceColor.coords = spaceColor.coords.map((c4, i2) => {
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
  return color;
}
toGamut.returns = "color";
const COLORS = {
  WHITE: { space: OKLab, coords: [1, 0, 0] },
  BLACK: { space: OKLab, coords: [0, 0, 0] }
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
  function clip(_color) {
    const destColor = to(_color, space);
    const spaceCoords = Object.values(space.coords);
    destColor.coords = destColor.coords.map((coord, index) => {
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
function serialize(color, {
  precision = defaults.precision,
  format = "default",
  inGamut: inGamut$1 = true,
  ...customOptions
} = {}) {
  var _a2, _b2, _c2;
  let ret;
  color = getColor(color);
  let formatId = format;
  format = (_b2 = (_a2 = color.space.getFormat(format)) != null ? _a2 : color.space.getFormat("default")) != null ? _b2 : ColorSpace.DEFAULT_FORMAT;
  let coords = color.coords.slice();
  inGamut$1 || (inGamut$1 = format.toGamut);
  if (inGamut$1 && !inGamut(color)) {
    coords = toGamut(clone(color), inGamut$1 === true ? void 0 : inGamut$1).coords;
  }
  if (format.type === "custom") {
    customOptions.precision = precision;
    if (format.serialize) {
      ret = format.serialize(coords, color.alpha, customOptions);
    } else {
      throw new TypeError(`format ${formatId} can only be used to parse colors, not for serialization`);
    }
  } else {
    let name = format.name || "color";
    if (format.serializeCoords) {
      coords = format.serializeCoords(coords, precision);
    } else {
      if (precision !== null) {
        coords = coords.map((c4) => {
          return serializeNumber(c4, { precision });
        });
      }
    }
    let args = [...coords];
    if (name === "color") {
      let cssId = format.id || ((_c2 = format.ids) == null ? void 0 : _c2[0]) || color.space.id;
      args.unshift(cssId);
    }
    let alpha = color.alpha;
    if (precision !== null) {
      alpha = serializeNumber(alpha, { precision });
    }
    let strAlpha = color.alpha >= 1 || format.noAlpha ? "" : `${format.commas ? "," : " /"} ${alpha}`;
    ret = `${name}(${args.join(format.commas ? ", " : " ")}${strAlpha})`;
  }
  return ret;
}
const toXYZ_M$5 = [
  [0.6369580483012914, 0.14461690358620832, 0.1688809751641721],
  [0.2627002120112671, 0.6779980715188708, 0.05930171646986196],
  [0, 0.028072693049087428, 1.060985057710791]
];
const fromXYZ_M$5 = [
  [1.716651187971268, -0.355670783776392, -0.25336628137366],
  [-0.666684351832489, 1.616481236634939, 0.0157685458139111],
  [0.017639857445311, -0.042770613257809, 0.942103121235474]
];
var REC2020Linear = new RGBColorSpace({
  id: "rec2020-linear",
  cssId: "--rec2020-linear",
  name: "Linear REC.2020",
  white: "D65",
  toXYZ_M: toXYZ_M$5,
  fromXYZ_M: fromXYZ_M$5
});
const α = 1.09929682680944;
const β = 0.018053968510807;
var REC2020 = new RGBColorSpace({
  id: "rec2020",
  name: "REC.2020",
  base: REC2020Linear,
  // Non-linear transfer function from Rec. ITU-R BT.2020-2 table 4
  toBase(RGB) {
    return RGB.map(function(val) {
      if (val < β * 4.5) {
        return val / 4.5;
      }
      return Math.pow((val + α - 1) / α, 1 / 0.45);
    });
  },
  fromBase(RGB) {
    return RGB.map(function(val) {
      if (val >= β) {
        return α * Math.pow(val, 0.45) - (α - 1);
      }
      return 4.5 * val;
    });
  }
});
const toXYZ_M$4 = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0, 0.04511338185890264, 1.043944368900976]
];
const fromXYZ_M$4 = [
  [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
  [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
  [0.03584583024378447, -0.07617238926804182, 0.9568845240076872]
];
var P3Linear = new RGBColorSpace({
  id: "p3-linear",
  cssId: "--display-p3-linear",
  name: "Linear P3",
  white: "D65",
  toXYZ_M: toXYZ_M$4,
  fromXYZ_M: fromXYZ_M$4
});
const toXYZ_M$3 = [
  [0.41239079926595934, 0.357584339383878, 0.1804807884018343],
  [0.21263900587151027, 0.715168678767756, 0.07219231536073371],
  [0.01933081871559182, 0.11919477979462598, 0.9505321522496607]
];
const fromXYZ_M$3 = [
  [3.2409699419045226, -1.537383177570094, -0.4986107602930034],
  [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559],
  [0.05563007969699366, -0.20397695888897652, 1.0569715142428786]
];
var sRGBLinear = new RGBColorSpace({
  id: "srgb-linear",
  name: "Linear sRGB",
  white: "D65",
  toXYZ_M: toXYZ_M$3,
  fromXYZ_M: fromXYZ_M$3
});
var KEYWORDS = {
  "aliceblue": [240 / 255, 248 / 255, 1],
  "antiquewhite": [250 / 255, 235 / 255, 215 / 255],
  "aqua": [0, 1, 1],
  "aquamarine": [127 / 255, 1, 212 / 255],
  "azure": [240 / 255, 1, 1],
  "beige": [245 / 255, 245 / 255, 220 / 255],
  "bisque": [1, 228 / 255, 196 / 255],
  "black": [0, 0, 0],
  "blanchedalmond": [1, 235 / 255, 205 / 255],
  "blue": [0, 0, 1],
  "blueviolet": [138 / 255, 43 / 255, 226 / 255],
  "brown": [165 / 255, 42 / 255, 42 / 255],
  "burlywood": [222 / 255, 184 / 255, 135 / 255],
  "cadetblue": [95 / 255, 158 / 255, 160 / 255],
  "chartreuse": [127 / 255, 1, 0],
  "chocolate": [210 / 255, 105 / 255, 30 / 255],
  "coral": [1, 127 / 255, 80 / 255],
  "cornflowerblue": [100 / 255, 149 / 255, 237 / 255],
  "cornsilk": [1, 248 / 255, 220 / 255],
  "crimson": [220 / 255, 20 / 255, 60 / 255],
  "cyan": [0, 1, 1],
  "darkblue": [0, 0, 139 / 255],
  "darkcyan": [0, 139 / 255, 139 / 255],
  "darkgoldenrod": [184 / 255, 134 / 255, 11 / 255],
  "darkgray": [169 / 255, 169 / 255, 169 / 255],
  "darkgreen": [0, 100 / 255, 0],
  "darkgrey": [169 / 255, 169 / 255, 169 / 255],
  "darkkhaki": [189 / 255, 183 / 255, 107 / 255],
  "darkmagenta": [139 / 255, 0, 139 / 255],
  "darkolivegreen": [85 / 255, 107 / 255, 47 / 255],
  "darkorange": [1, 140 / 255, 0],
  "darkorchid": [153 / 255, 50 / 255, 204 / 255],
  "darkred": [139 / 255, 0, 0],
  "darksalmon": [233 / 255, 150 / 255, 122 / 255],
  "darkseagreen": [143 / 255, 188 / 255, 143 / 255],
  "darkslateblue": [72 / 255, 61 / 255, 139 / 255],
  "darkslategray": [47 / 255, 79 / 255, 79 / 255],
  "darkslategrey": [47 / 255, 79 / 255, 79 / 255],
  "darkturquoise": [0, 206 / 255, 209 / 255],
  "darkviolet": [148 / 255, 0, 211 / 255],
  "deeppink": [1, 20 / 255, 147 / 255],
  "deepskyblue": [0, 191 / 255, 1],
  "dimgray": [105 / 255, 105 / 255, 105 / 255],
  "dimgrey": [105 / 255, 105 / 255, 105 / 255],
  "dodgerblue": [30 / 255, 144 / 255, 1],
  "firebrick": [178 / 255, 34 / 255, 34 / 255],
  "floralwhite": [1, 250 / 255, 240 / 255],
  "forestgreen": [34 / 255, 139 / 255, 34 / 255],
  "fuchsia": [1, 0, 1],
  "gainsboro": [220 / 255, 220 / 255, 220 / 255],
  "ghostwhite": [248 / 255, 248 / 255, 1],
  "gold": [1, 215 / 255, 0],
  "goldenrod": [218 / 255, 165 / 255, 32 / 255],
  "gray": [128 / 255, 128 / 255, 128 / 255],
  "green": [0, 128 / 255, 0],
  "greenyellow": [173 / 255, 1, 47 / 255],
  "grey": [128 / 255, 128 / 255, 128 / 255],
  "honeydew": [240 / 255, 1, 240 / 255],
  "hotpink": [1, 105 / 255, 180 / 255],
  "indianred": [205 / 255, 92 / 255, 92 / 255],
  "indigo": [75 / 255, 0, 130 / 255],
  "ivory": [1, 1, 240 / 255],
  "khaki": [240 / 255, 230 / 255, 140 / 255],
  "lavender": [230 / 255, 230 / 255, 250 / 255],
  "lavenderblush": [1, 240 / 255, 245 / 255],
  "lawngreen": [124 / 255, 252 / 255, 0],
  "lemonchiffon": [1, 250 / 255, 205 / 255],
  "lightblue": [173 / 255, 216 / 255, 230 / 255],
  "lightcoral": [240 / 255, 128 / 255, 128 / 255],
  "lightcyan": [224 / 255, 1, 1],
  "lightgoldenrodyellow": [250 / 255, 250 / 255, 210 / 255],
  "lightgray": [211 / 255, 211 / 255, 211 / 255],
  "lightgreen": [144 / 255, 238 / 255, 144 / 255],
  "lightgrey": [211 / 255, 211 / 255, 211 / 255],
  "lightpink": [1, 182 / 255, 193 / 255],
  "lightsalmon": [1, 160 / 255, 122 / 255],
  "lightseagreen": [32 / 255, 178 / 255, 170 / 255],
  "lightskyblue": [135 / 255, 206 / 255, 250 / 255],
  "lightslategray": [119 / 255, 136 / 255, 153 / 255],
  "lightslategrey": [119 / 255, 136 / 255, 153 / 255],
  "lightsteelblue": [176 / 255, 196 / 255, 222 / 255],
  "lightyellow": [1, 1, 224 / 255],
  "lime": [0, 1, 0],
  "limegreen": [50 / 255, 205 / 255, 50 / 255],
  "linen": [250 / 255, 240 / 255, 230 / 255],
  "magenta": [1, 0, 1],
  "maroon": [128 / 255, 0, 0],
  "mediumaquamarine": [102 / 255, 205 / 255, 170 / 255],
  "mediumblue": [0, 0, 205 / 255],
  "mediumorchid": [186 / 255, 85 / 255, 211 / 255],
  "mediumpurple": [147 / 255, 112 / 255, 219 / 255],
  "mediumseagreen": [60 / 255, 179 / 255, 113 / 255],
  "mediumslateblue": [123 / 255, 104 / 255, 238 / 255],
  "mediumspringgreen": [0, 250 / 255, 154 / 255],
  "mediumturquoise": [72 / 255, 209 / 255, 204 / 255],
  "mediumvioletred": [199 / 255, 21 / 255, 133 / 255],
  "midnightblue": [25 / 255, 25 / 255, 112 / 255],
  "mintcream": [245 / 255, 1, 250 / 255],
  "mistyrose": [1, 228 / 255, 225 / 255],
  "moccasin": [1, 228 / 255, 181 / 255],
  "navajowhite": [1, 222 / 255, 173 / 255],
  "navy": [0, 0, 128 / 255],
  "oldlace": [253 / 255, 245 / 255, 230 / 255],
  "olive": [128 / 255, 128 / 255, 0],
  "olivedrab": [107 / 255, 142 / 255, 35 / 255],
  "orange": [1, 165 / 255, 0],
  "orangered": [1, 69 / 255, 0],
  "orchid": [218 / 255, 112 / 255, 214 / 255],
  "palegoldenrod": [238 / 255, 232 / 255, 170 / 255],
  "palegreen": [152 / 255, 251 / 255, 152 / 255],
  "paleturquoise": [175 / 255, 238 / 255, 238 / 255],
  "palevioletred": [219 / 255, 112 / 255, 147 / 255],
  "papayawhip": [1, 239 / 255, 213 / 255],
  "peachpuff": [1, 218 / 255, 185 / 255],
  "peru": [205 / 255, 133 / 255, 63 / 255],
  "pink": [1, 192 / 255, 203 / 255],
  "plum": [221 / 255, 160 / 255, 221 / 255],
  "powderblue": [176 / 255, 224 / 255, 230 / 255],
  "purple": [128 / 255, 0, 128 / 255],
  "rebeccapurple": [102 / 255, 51 / 255, 153 / 255],
  "red": [1, 0, 0],
  "rosybrown": [188 / 255, 143 / 255, 143 / 255],
  "royalblue": [65 / 255, 105 / 255, 225 / 255],
  "saddlebrown": [139 / 255, 69 / 255, 19 / 255],
  "salmon": [250 / 255, 128 / 255, 114 / 255],
  "sandybrown": [244 / 255, 164 / 255, 96 / 255],
  "seagreen": [46 / 255, 139 / 255, 87 / 255],
  "seashell": [1, 245 / 255, 238 / 255],
  "sienna": [160 / 255, 82 / 255, 45 / 255],
  "silver": [192 / 255, 192 / 255, 192 / 255],
  "skyblue": [135 / 255, 206 / 255, 235 / 255],
  "slateblue": [106 / 255, 90 / 255, 205 / 255],
  "slategray": [112 / 255, 128 / 255, 144 / 255],
  "slategrey": [112 / 255, 128 / 255, 144 / 255],
  "snow": [1, 250 / 255, 250 / 255],
  "springgreen": [0, 1, 127 / 255],
  "steelblue": [70 / 255, 130 / 255, 180 / 255],
  "tan": [210 / 255, 180 / 255, 140 / 255],
  "teal": [0, 128 / 255, 128 / 255],
  "thistle": [216 / 255, 191 / 255, 216 / 255],
  "tomato": [1, 99 / 255, 71 / 255],
  "turquoise": [64 / 255, 224 / 255, 208 / 255],
  "violet": [238 / 255, 130 / 255, 238 / 255],
  "wheat": [245 / 255, 222 / 255, 179 / 255],
  "white": [1, 1, 1],
  "whitesmoke": [245 / 255, 245 / 255, 245 / 255],
  "yellow": [1, 1, 0],
  "yellowgreen": [154 / 255, 205 / 255, 50 / 255]
};
let coordGrammar = Array(3).fill("<percentage> | <number>[0, 255]");
let coordGrammarNumber = Array(3).fill("<number>[0, 255]");
var sRGB = new RGBColorSpace({
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
    "rgb": {
      coords: coordGrammar
    },
    "rgb_number": {
      name: "rgb",
      commas: true,
      coords: coordGrammarNumber,
      noAlpha: true
    },
    "color": {
      /* use defaults */
    },
    "rgba": {
      coords: coordGrammar,
      commas: true,
      lastAlpha: true
    },
    "rgba_number": {
      name: "rgba",
      commas: true,
      coords: coordGrammarNumber
    },
    "hex": {
      type: "custom",
      toGamut: true,
      test: (str) => /^#([a-f0-9]{3,4}){1,2}$/i.test(str),
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
          coords: rgba.slice(0, 3),
          alpha: rgba.slice(3)[0]
        };
      },
      serialize: (coords, alpha, {
        collapse = true
        // collapse to 3-4 digit hex when possible?
      } = {}) => {
        if (alpha < 1) {
          coords.push(alpha);
        }
        coords = coords.map((c4) => Math.round(c4 * 255));
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
    "keyword": {
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
var P3 = new RGBColorSpace({
  id: "p3",
  cssId: "display-p3",
  name: "P3",
  base: P3Linear,
  // Gamma encoding/decoding is the same as sRGB
  fromBase: sRGB.fromBase,
  toBase: sRGB.toBase
});
defaults.display_space = sRGB;
let supportsNone;
if (typeof CSS !== "undefined" && CSS.supports) {
  for (let space of [lab, REC2020, P3]) {
    let coords = space.getMinCoords();
    let color = { space, coords, alpha: 1 };
    let str = serialize(color);
    if (CSS.supports("color", str)) {
      defaults.display_space = space;
      break;
    }
  }
}
function display(color, { space = defaults.display_space, ...options } = {}) {
  let ret = serialize(color, options);
  if (typeof CSS === "undefined" || CSS.supports("color", ret) || !defaults.display_space) {
    ret = new String(ret);
    ret.color = color;
  } else {
    let fallbackColor = color;
    let hasNone = color.coords.some(isNone) || isNone(color.alpha);
    if (hasNone) {
      if (!(supportsNone != null ? supportsNone : supportsNone = CSS.supports("color", "hsl(none 50% 50%)"))) {
        fallbackColor = clone(color);
        fallbackColor.coords = fallbackColor.coords.map(skipNone);
        fallbackColor.alpha = skipNone(fallbackColor.alpha);
        ret = serialize(fallbackColor, options);
        if (CSS.supports("color", ret)) {
          ret = new String(ret);
          ret.color = fallbackColor;
          return ret;
        }
      }
    }
    fallbackColor = to(fallbackColor, space);
    ret = new String(serialize(fallbackColor, options));
    ret.color = fallbackColor;
  }
  return ret;
}
function equals(color1, color2) {
  color1 = getColor(color1);
  color2 = getColor(color2);
  return color1.space === color2.space && color1.alpha === color2.alpha && color1.coords.every((c4, i2) => c4 === color2.coords[i2]);
}
function getLuminance(color) {
  return get(color, [xyz_d65, "y"]);
}
function setLuminance(color, value) {
  set(color, [xyz_d65, "y"], value);
}
function register$2(Color2) {
  Object.defineProperty(Color2.prototype, "luminance", {
    get() {
      return getLuminance(this);
    },
    set(value) {
      setLuminance(this, value);
    }
  });
}
var luminance = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getLuminance,
  register: register$2,
  setLuminance
});
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
  [R, G, B] = foreground.coords;
  let lumTxt = linearize(R) * 0.2126729 + linearize(G) * 0.7151522 + linearize(B) * 0.072175;
  background = to(background, "srgb");
  [R, G, B] = background.coords;
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
const ε$3 = 216 / 24389;
const ε3 = 24 / 116;
const κ$2 = 24389 / 27;
let white$1 = WHITES.D65;
var lab_d65 = new ColorSpace({
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
  white: white$1,
  base: xyz_d65,
  // Convert D65-adapted XYZ to Lab
  //  CIE 15.3:2004 section 8.2.1.1
  fromBase(XYZ) {
    let xyz = XYZ.map((value, i2) => value / white$1[i2]);
    let f2 = xyz.map((value) => value > ε$3 ? Math.cbrt(value) : (κ$2 * value + 16) / 116);
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
      f2[0] > ε3 ? Math.pow(f2[0], 3) : (116 * f2[0] - 16) / κ$2,
      Lab[0] > 8 ? Math.pow((Lab[0] + 16) / 116, 3) : Lab[0] / κ$2,
      f2[2] > ε3 ? Math.pow(f2[2], 3) : (116 * f2[2] - 16) / κ$2
    ];
    return xyz.map((value, i2) => value * white$1[i2]);
  },
  formats: {
    "lab-d65": {
      coords: ["<number> | <percentage>", "<number> | <percentage>[-1,1]", "<number> | <percentage>[-1,1]"]
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
var contrastMethods = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  contrastAPCA,
  contrastDeltaPhi,
  contrastLstar,
  contrastMichelson,
  contrastWCAG21,
  contrastWeber
});
function contrast(background, foreground, o2 = {}) {
  if (isString(o2)) {
    o2 = { algorithm: o2 };
  }
  let { algorithm, ...rest } = o2;
  if (!algorithm) {
    let algorithms = Object.keys(contrastMethods).map((a2) => a2.replace(/^contrast/, "")).join(", ");
    throw new TypeError(`contrast() function needs a contrast algorithm. Please specify one of: ${algorithms}`);
  }
  background = getColor(background);
  foreground = getColor(foreground);
  for (let a2 in contrastMethods) {
    if ("contrast" + algorithm.toLowerCase() === a2.toLowerCase()) {
      return contrastMethods[a2](background, foreground, rest);
    }
  }
  throw new TypeError(`Unknown contrast algorithm: ${algorithm}`);
}
function uv(color) {
  let [X, Y, Z] = getAll(color, xyz_d65);
  let denom = X + 15 * Y + 3 * Z;
  return [4 * X / denom, 9 * Y / denom];
}
function xy(color) {
  let [X, Y, Z] = getAll(color, xyz_d65);
  let sum = X + Y + Z;
  return [X / sum, Y / sum];
}
function register$1(Color2) {
  Object.defineProperty(Color2.prototype, "uv", {
    get() {
      return uv(this);
    }
  });
  Object.defineProperty(Color2.prototype, "xy", {
    get() {
      return xy(this);
    }
  });
}
var chromaticity = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  register: register$1,
  uv,
  xy
});
function deltaE(c12, c22, o2 = {}) {
  if (isString(o2)) {
    o2 = { method: o2 };
  }
  let { method = defaults.deltaE, ...rest } = o2;
  for (let m3 in deltaEMethods) {
    if ("deltae" + method.toLowerCase() === m3.toLowerCase()) {
      return deltaEMethods[m3](c12, c22, rest);
    }
  }
  throw new TypeError(`Unknown deltaE method: ${method}`);
}
function lighten(color, amount = 0.25) {
  let space = ColorSpace.get("oklch", "lch");
  let lightness = [space, "l"];
  return set(color, lightness, (l2) => l2 * (1 + amount));
}
function darken(color, amount = 0.25) {
  let space = ColorSpace.get("oklch", "lch");
  let lightness = [space, "l"];
  return set(color, lightness, (l2) => l2 * (1 - amount));
}
var variations = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  darken,
  lighten
});
function mix(c12, c22, p2 = 0.5, o2 = {}) {
  [c12, c22] = [getColor(c12), getColor(c22)];
  if (type(p2) === "object") {
    [p2, o2] = [0.5, p2];
  }
  let r = range(c12, c22, o2);
  return r(p2);
}
function steps(c12, c22, options = {}) {
  let colorRange;
  if (isRange(c12)) {
    [colorRange, options] = [c12, c22];
    [c12, c22] = colorRange.rangeArgs.colors;
  }
  let {
    maxDeltaE,
    deltaEMethod,
    steps: steps2 = 2,
    maxSteps = 1e3,
    ...rangeOptions
  } = options;
  if (!colorRange) {
    [c12, c22] = [getColor(c12), getColor(c22)];
    colorRange = range(c12, c22, rangeOptions);
  }
  let totalDelta = deltaE(c12, c22);
  let actualSteps = maxDeltaE > 0 ? Math.max(steps2, Math.ceil(totalDelta / maxDeltaE) + 1) : steps2;
  let ret = [];
  if (maxSteps !== void 0) {
    actualSteps = Math.min(actualSteps, maxSteps);
  }
  if (actualSteps === 1) {
    ret = [{ p: 0.5, color: colorRange(0.5) }];
  } else {
    let step = 1 / (actualSteps - 1);
    ret = Array.from({ length: actualSteps }, (_2, i2) => {
      let p2 = i2 * step;
      return { p: p2, color: colorRange(p2) };
    });
  }
  if (maxDeltaE > 0) {
    let maxDelta = ret.reduce((acc, cur, i2) => {
      if (i2 === 0) {
        return 0;
      }
      let ΔΕ = deltaE(cur.color, ret[i2 - 1].color, deltaEMethod);
      return Math.max(acc, ΔΕ);
    }, 0);
    while (maxDelta > maxDeltaE) {
      maxDelta = 0;
      for (let i2 = 1; i2 < ret.length && ret.length < maxSteps; i2++) {
        let prev = ret[i2 - 1];
        let cur = ret[i2];
        let p2 = (cur.p + prev.p) / 2;
        let color = colorRange(p2);
        maxDelta = Math.max(maxDelta, deltaE(color, prev.color), deltaE(color, cur.color));
        ret.splice(i2, 0, { p: p2, color: colorRange(p2) });
        i2++;
      }
    }
  }
  ret = ret.map((a2) => a2.color);
  return ret;
}
function range(color1, color2, options = {}) {
  if (isRange(color1)) {
    let [r, options2] = [color1, color2];
    return range(...r.rangeArgs.colors, { ...r.rangeArgs.options, ...options2 });
  }
  let { space, outputSpace, progression, premultiplied } = options;
  color1 = getColor(color1);
  color2 = getColor(color2);
  color1 = clone(color1);
  color2 = clone(color2);
  let rangeArgs = { colors: [color1, color2], options };
  if (space) {
    space = ColorSpace.get(space);
  } else {
    space = ColorSpace.registry[defaults.interpolationSpace] || color1.space;
  }
  outputSpace = outputSpace ? ColorSpace.get(outputSpace) : space;
  color1 = to(color1, space);
  color2 = to(color2, space);
  color1 = toGamut(color1);
  color2 = toGamut(color2);
  if (space.coords.h && space.coords.h.type === "angle") {
    let arc = options.hue = options.hue || "shorter";
    let hue = [space, "h"];
    let [θ1, θ2] = [get(color1, hue), get(color2, hue)];
    if (isNaN(θ1) && !isNaN(θ2)) {
      θ1 = θ2;
    } else if (isNaN(θ2) && !isNaN(θ1)) {
      θ2 = θ1;
    }
    [θ1, θ2] = adjust(arc, [θ1, θ2]);
    set(color1, hue, θ1);
    set(color2, hue, θ2);
  }
  if (premultiplied) {
    color1.coords = color1.coords.map((c4) => c4 * color1.alpha);
    color2.coords = color2.coords.map((c4) => c4 * color2.alpha);
  }
  return Object.assign((p2) => {
    p2 = progression ? progression(p2) : p2;
    let coords = color1.coords.map((start, i2) => {
      let end = color2.coords[i2];
      return interpolate(start, end, p2);
    });
    let alpha = interpolate(color1.alpha, color2.alpha, p2);
    let ret = { space, coords, alpha };
    if (premultiplied) {
      ret.coords = ret.coords.map((c4) => c4 / alpha);
    }
    if (outputSpace !== space) {
      ret = to(ret, outputSpace);
    }
    return ret;
  }, {
    rangeArgs
  });
}
function isRange(val) {
  return type(val) === "function" && !!val.rangeArgs;
}
defaults.interpolationSpace = "lab";
function register(Color2) {
  Color2.defineFunction("mix", mix, { returns: "color" });
  Color2.defineFunction("range", range, { returns: "function<color>" });
  Color2.defineFunction("steps", steps, { returns: "array<color>" });
}
var interpolation = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  isRange,
  mix,
  range,
  register,
  steps
});
var HSL = new ColorSpace({
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
    let [h2, s2, l2] = [NaN, 0, (min + max2) / 2];
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
  toBase: (hsl) => {
    let [h2, s2, l2] = hsl;
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
    "hsl": {
      coords: ["<number> | <angle>", "<percentage>", "<percentage>"]
    },
    "hsla": {
      coords: ["<number> | <angle>", "<percentage>", "<percentage>"],
      commas: true,
      lastAlpha: true
    }
  }
});
var HSV = new ColorSpace({
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
  base: HSL,
  // https://en.wikipedia.org/wiki/HSL_and_HSV#Interconversion
  fromBase(hsl) {
    let [h2, s2, l2] = hsl;
    s2 /= 100;
    l2 /= 100;
    let v2 = l2 + s2 * Math.min(l2, 1 - l2);
    return [
      h2,
      // h is the same
      v2 === 0 ? 0 : 200 * (1 - l2 / v2),
      // s
      100 * v2
    ];
  },
  // https://en.wikipedia.org/wiki/HSL_and_HSV#Interconversion
  toBase(hsv) {
    let [h2, s2, v2] = hsv;
    s2 /= 100;
    v2 /= 100;
    let l2 = v2 * (1 - s2 / 2);
    return [
      h2,
      // h is the same
      l2 === 0 || l2 === 1 ? 0 : (v2 - l2) / Math.min(l2, 1 - l2) * 100,
      l2 * 100
    ];
  },
  formats: {
    color: {
      id: "--hsv",
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
var hwb = new ColorSpace({
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
    "hwb": {
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
const toXYZ_M$2 = [
  [0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
  [0.29734497525053605, 0.6273635662554661, 0.07529145849399788],
  [0.02703136138641234, 0.07068885253582723, 0.9913375368376388]
];
const fromXYZ_M$2 = [
  [2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
  [-0.9692436362808795, 1.8759675015077202, 0.04155505740717557],
  [0.013444280632031142, -0.11836239223101838, 1.0151749943912054]
];
var A98Linear = new RGBColorSpace({
  id: "a98rgb-linear",
  cssId: "--a98-rgb-linear",
  name: "Linear Adobe® 98 RGB compatible",
  white: "D65",
  toXYZ_M: toXYZ_M$2,
  fromXYZ_M: fromXYZ_M$2
});
var a98rgb = new RGBColorSpace({
  id: "a98rgb",
  cssId: "a98-rgb",
  name: "Adobe® 98 RGB compatible",
  base: A98Linear,
  toBase: (RGB) => RGB.map((val) => Math.pow(Math.abs(val), 563 / 256) * Math.sign(val)),
  fromBase: (RGB) => RGB.map((val) => Math.pow(Math.abs(val), 256 / 563) * Math.sign(val))
});
const toXYZ_M$1 = [
  [0.7977666449006423, 0.13518129740053308, 0.0313477341283922],
  [0.2880748288194013, 0.711835234241873, 8993693872564e-17],
  [0, 0, 0.8251046025104602]
];
const fromXYZ_M$1 = [
  [1.3457868816471583, -0.25557208737979464, -0.05110186497554526],
  [-0.5446307051249019, 1.5082477428451468, 0.02052744743642139],
  [0, 0, 1.2119675456389452]
];
var ProPhotoLinear = new RGBColorSpace({
  id: "prophoto-linear",
  cssId: "--prophoto-rgb-linear",
  name: "Linear ProPhoto",
  white: "D50",
  base: XYZ_D50,
  toXYZ_M: toXYZ_M$1,
  fromXYZ_M: fromXYZ_M$1
});
const Et = 1 / 512;
const Et2 = 16 / 512;
var prophoto = new RGBColorSpace({
  id: "prophoto",
  cssId: "prophoto-rgb",
  name: "ProPhoto",
  base: ProPhotoLinear,
  toBase(RGB) {
    return RGB.map((v2) => v2 < Et2 ? v2 / 16 : v2 ** 1.8);
  },
  fromBase(RGB) {
    return RGB.map((v2) => v2 >= Et ? v2 ** (1 / 1.8) : 16 * v2);
  }
});
var oklch = new ColorSpace({
  id: "oklch",
  name: "Oklch",
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
  base: OKLab,
  fromBase(oklab) {
    let [L, a2, b2] = oklab;
    let h2;
    const ε2 = 2e-4;
    if (Math.abs(a2) < ε2 && Math.abs(b2) < ε2) {
      h2 = NaN;
    } else {
      h2 = Math.atan2(b2, a2) * 180 / Math.PI;
    }
    return [
      L,
      // OKLab L is still L
      Math.sqrt(a2 ** 2 + b2 ** 2),
      // Chroma
      constrain(h2)
      // Hue, in degrees [0 to 360)
    ];
  },
  // Convert from polar form
  toBase(oklch2) {
    let [L, C, h2] = oklch2;
    let a2, b2;
    if (isNaN(h2)) {
      a2 = 0;
      b2 = 0;
    } else {
      a2 = C * Math.cos(h2 * Math.PI / 180);
      b2 = C * Math.sin(h2 * Math.PI / 180);
    }
    return [L, a2, b2];
  },
  formats: {
    "oklch": {
      coords: ["<percentage> | <number>", "<number> | <percentage>[0,1]", "<number> | <angle>"]
    }
  }
});
let white = WHITES.D65;
const ε$2 = 216 / 24389;
const κ$1 = 24389 / 27;
const [U_PRIME_WHITE, V_PRIME_WHITE] = uv({ space: xyz_d65, coords: white });
var Luv = new ColorSpace({
  id: "luv",
  name: "Luv",
  coords: {
    l: {
      refRange: [0, 100],
      name: "Lightness"
    },
    // Reference ranges from https://facelessuser.github.io/coloraide/colors/luv/
    u: {
      refRange: [-215, 215]
    },
    v: {
      refRange: [-215, 215]
    }
  },
  white,
  base: xyz_d65,
  // Convert D65-adapted XYZ to Luv
  // https://en.wikipedia.org/wiki/CIELUV#The_forward_transformation
  fromBase(XYZ) {
    let xyz = [skipNone(XYZ[0]), skipNone(XYZ[1]), skipNone(XYZ[2])];
    let y2 = xyz[1];
    let [up, vp] = uv({ space: xyz_d65, coords: xyz });
    if (!Number.isFinite(up) || !Number.isFinite(vp)) {
      return [0, 0, 0];
    }
    let L = y2 <= ε$2 ? κ$1 * y2 : 116 * Math.cbrt(y2) - 16;
    return [
      L,
      13 * L * (up - U_PRIME_WHITE),
      13 * L * (vp - V_PRIME_WHITE)
    ];
  },
  // Convert Luv to D65-adapted XYZ
  // https://en.wikipedia.org/wiki/CIELUV#The_reverse_transformation
  toBase(Luv2) {
    let [L, u2, v2] = Luv2;
    if (L === 0 || isNone(L)) {
      return [0, 0, 0];
    }
    u2 = skipNone(u2);
    v2 = skipNone(v2);
    let up = u2 / (13 * L) + U_PRIME_WHITE;
    let vp = v2 / (13 * L) + V_PRIME_WHITE;
    let y2 = L <= 8 ? L / κ$1 : Math.pow((L + 16) / 116, 3);
    return [
      y2 * (9 * up / (4 * vp)),
      y2,
      y2 * ((12 - 3 * up - 20 * vp) / (4 * vp))
    ];
  },
  formats: {
    color: {
      id: "--luv",
      coords: ["<number> | <percentage>", "<number> | <percentage>[-1,1]", "<number> | <percentage>[-1,1]"]
    }
  }
});
var LCHuv = new ColorSpace({
  id: "lchuv",
  name: "LChuv",
  coords: {
    l: {
      refRange: [0, 100],
      name: "Lightness"
    },
    c: {
      refRange: [0, 220],
      name: "Chroma"
    },
    h: {
      refRange: [0, 360],
      type: "angle",
      name: "Hue"
    }
  },
  base: Luv,
  fromBase(Luv2) {
    let [L, u2, v2] = Luv2;
    let hue;
    const ε2 = 0.02;
    if (Math.abs(u2) < ε2 && Math.abs(v2) < ε2) {
      hue = NaN;
    } else {
      hue = Math.atan2(v2, u2) * 180 / Math.PI;
    }
    return [
      L,
      // L is still L
      Math.sqrt(u2 ** 2 + v2 ** 2),
      // Chroma
      constrain(hue)
      // Hue, in degrees [0 to 360)
    ];
  },
  toBase(LCH) {
    let [Lightness, Chroma, Hue] = LCH;
    if (Chroma < 0) {
      Chroma = 0;
    }
    if (isNaN(Hue)) {
      Hue = 0;
    }
    return [
      Lightness,
      // L is still L
      Chroma * Math.cos(Hue * Math.PI / 180),
      // u
      Chroma * Math.sin(Hue * Math.PI / 180)
      // v
    ];
  },
  formats: {
    color: {
      id: "--lchuv",
      coords: ["<number> | <percentage>", "<number> | <percentage>", "<number> | <angle>"]
    }
  }
});
const ε$1 = 216 / 24389;
const κ = 24389 / 27;
const m_r0 = fromXYZ_M$3[0][0];
const m_r1 = fromXYZ_M$3[0][1];
const m_r2 = fromXYZ_M$3[0][2];
const m_g0 = fromXYZ_M$3[1][0];
const m_g1 = fromXYZ_M$3[1][1];
const m_g2 = fromXYZ_M$3[1][2];
const m_b0 = fromXYZ_M$3[2][0];
const m_b1 = fromXYZ_M$3[2][1];
const m_b2 = fromXYZ_M$3[2][2];
function distanceFromOriginAngle(slope, intercept, angle) {
  const d2 = intercept / (Math.sin(angle) - slope * Math.cos(angle));
  return d2 < 0 ? Infinity : d2;
}
function calculateBoundingLines(l2) {
  const sub1 = Math.pow(l2 + 16, 3) / 1560896;
  const sub2 = sub1 > ε$1 ? sub1 : l2 / κ;
  const s1r = sub2 * (284517 * m_r0 - 94839 * m_r2);
  const s2r = sub2 * (838422 * m_r2 + 769860 * m_r1 + 731718 * m_r0);
  const s3r = sub2 * (632260 * m_r2 - 126452 * m_r1);
  const s1g = sub2 * (284517 * m_g0 - 94839 * m_g2);
  const s2g = sub2 * (838422 * m_g2 + 769860 * m_g1 + 731718 * m_g0);
  const s3g = sub2 * (632260 * m_g2 - 126452 * m_g1);
  const s1b = sub2 * (284517 * m_b0 - 94839 * m_b2);
  const s2b = sub2 * (838422 * m_b2 + 769860 * m_b1 + 731718 * m_b0);
  const s3b = sub2 * (632260 * m_b2 - 126452 * m_b1);
  return {
    r0s: s1r / s3r,
    r0i: s2r * l2 / s3r,
    r1s: s1r / (s3r + 126452),
    r1i: (s2r - 769860) * l2 / (s3r + 126452),
    g0s: s1g / s3g,
    g0i: s2g * l2 / s3g,
    g1s: s1g / (s3g + 126452),
    g1i: (s2g - 769860) * l2 / (s3g + 126452),
    b0s: s1b / s3b,
    b0i: s2b * l2 / s3b,
    b1s: s1b / (s3b + 126452),
    b1i: (s2b - 769860) * l2 / (s3b + 126452)
  };
}
function calcMaxChromaHsluv(lines, h2) {
  const hueRad = h2 / 360 * Math.PI * 2;
  const r0 = distanceFromOriginAngle(lines.r0s, lines.r0i, hueRad);
  const r1 = distanceFromOriginAngle(lines.r1s, lines.r1i, hueRad);
  const g0 = distanceFromOriginAngle(lines.g0s, lines.g0i, hueRad);
  const g1 = distanceFromOriginAngle(lines.g1s, lines.g1i, hueRad);
  const b0 = distanceFromOriginAngle(lines.b0s, lines.b0i, hueRad);
  const b1 = distanceFromOriginAngle(lines.b1s, lines.b1i, hueRad);
  return Math.min(r0, r1, g0, g1, b0, b1);
}
var hsluv = new ColorSpace({
  id: "hsluv",
  name: "HSLuv",
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
  base: LCHuv,
  gamutSpace: sRGB,
  // Convert LCHuv to HSLuv
  fromBase(lch2) {
    let [l2, c4, h2] = [skipNone(lch2[0]), skipNone(lch2[1]), skipNone(lch2[2])];
    let s2;
    if (l2 > 99.9999999) {
      s2 = 0;
      l2 = 100;
    } else if (l2 < 1e-8) {
      s2 = 0;
      l2 = 0;
    } else {
      let lines = calculateBoundingLines(l2);
      let max2 = calcMaxChromaHsluv(lines, h2);
      s2 = c4 / max2 * 100;
    }
    return [h2, s2, l2];
  },
  // Convert HSLuv to LCHuv
  toBase(hsl) {
    let [h2, s2, l2] = [skipNone(hsl[0]), skipNone(hsl[1]), skipNone(hsl[2])];
    let c4;
    if (l2 > 99.9999999) {
      l2 = 100;
      c4 = 0;
    } else if (l2 < 1e-8) {
      l2 = 0;
      c4 = 0;
    } else {
      let lines = calculateBoundingLines(l2);
      let max2 = calcMaxChromaHsluv(lines, h2);
      c4 = max2 / 100 * s2;
    }
    return [l2, c4, h2];
  },
  formats: {
    color: {
      id: "--hsluv",
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
fromXYZ_M$3[0][0];
fromXYZ_M$3[0][1];
fromXYZ_M$3[0][2];
fromXYZ_M$3[1][0];
fromXYZ_M$3[1][1];
fromXYZ_M$3[1][2];
fromXYZ_M$3[2][0];
fromXYZ_M$3[2][1];
fromXYZ_M$3[2][2];
function distanceFromOrigin(slope, intercept) {
  return Math.abs(intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
}
function calcMaxChromaHpluv(lines) {
  let r0 = distanceFromOrigin(lines.r0s, lines.r0i);
  let r1 = distanceFromOrigin(lines.r1s, lines.r1i);
  let g0 = distanceFromOrigin(lines.g0s, lines.g0i);
  let g1 = distanceFromOrigin(lines.g1s, lines.g1i);
  let b0 = distanceFromOrigin(lines.b0s, lines.b0i);
  let b1 = distanceFromOrigin(lines.b1s, lines.b1i);
  return Math.min(r0, r1, g0, g1, b0, b1);
}
var hpluv = new ColorSpace({
  id: "hpluv",
  name: "HPLuv",
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
  base: LCHuv,
  gamutSpace: "self",
  // Convert LCHuv to HPLuv
  fromBase(lch2) {
    let [l2, c4, h2] = [skipNone(lch2[0]), skipNone(lch2[1]), skipNone(lch2[2])];
    let s2;
    if (l2 > 99.9999999) {
      s2 = 0;
      l2 = 100;
    } else if (l2 < 1e-8) {
      s2 = 0;
      l2 = 0;
    } else {
      let lines = calculateBoundingLines(l2);
      let max2 = calcMaxChromaHpluv(lines);
      s2 = c4 / max2 * 100;
    }
    return [h2, s2, l2];
  },
  // Convert HPLuv to LCHuv
  toBase(hsl) {
    let [h2, s2, l2] = [skipNone(hsl[0]), skipNone(hsl[1]), skipNone(hsl[2])];
    let c4;
    if (l2 > 99.9999999) {
      l2 = 100;
      c4 = 0;
    } else if (l2 < 1e-8) {
      l2 = 0;
      c4 = 0;
    } else {
      let lines = calculateBoundingLines(l2);
      let max2 = calcMaxChromaHpluv(lines);
      c4 = max2 / 100 * s2;
    }
    return [l2, c4, h2];
  },
  formats: {
    color: {
      id: "--hpluv",
      coords: ["<number> | <angle>", "<percentage> | <number>", "<percentage> | <number>"]
    }
  }
});
const Yw = 203;
const n = 2610 / 2 ** 14;
const ninv = 2 ** 14 / 2610;
const m = 2523 / 2 ** 5;
const minv = 2 ** 5 / 2523;
const c1 = 3424 / 2 ** 12;
const c2 = 2413 / 2 ** 7;
const c3 = 2392 / 2 ** 7;
var rec2100Pq = new RGBColorSpace({
  id: "rec2100pq",
  cssId: "rec2100-pq",
  name: "REC.2100-PQ",
  base: REC2020Linear,
  toBase(RGB) {
    return RGB.map(function(val) {
      let x = (Math.max(val ** minv - c1, 0) / (c2 - c3 * val ** minv)) ** ninv;
      return x * 1e4 / Yw;
    });
  },
  fromBase(RGB) {
    return RGB.map(function(val) {
      let x = Math.max(val * Yw / 1e4, 0);
      let num = c1 + c2 * x ** n;
      let denom = 1 + c3 * x ** n;
      return (num / denom) ** m;
    });
  }
});
const a = 0.17883277;
const b = 0.28466892;
const c = 0.55991073;
const scale = 3.7743;
var rec2100Hlg = new RGBColorSpace({
  id: "rec2100hlg",
  cssId: "rec2100-hlg",
  name: "REC.2100-HLG",
  referred: "scene",
  base: REC2020Linear,
  toBase(RGB) {
    return RGB.map(function(val) {
      if (val <= 0.5) {
        return val ** 2 / 3 * scale;
      }
      return (Math.exp((val - c) / a) + b) / 12 * scale;
    });
  },
  fromBase(RGB) {
    return RGB.map(function(val) {
      val /= scale;
      if (val <= 1 / 12) {
        return Math.sqrt(3 * val);
      }
      return a * Math.log(12 * val - b) + c;
    });
  }
});
const CATs = {};
hooks.add("chromatic-adaptation-start", (env) => {
  if (env.options.method) {
    env.M = adapt(env.W1, env.W2, env.options.method);
  }
});
hooks.add("chromatic-adaptation-end", (env) => {
  if (!env.M) {
    env.M = adapt(env.W1, env.W2, env.options.method);
  }
});
function defineCAT({ id, toCone_M, fromCone_M }) {
  CATs[id] = arguments[0];
}
function adapt(W1, W2, id = "Bradford") {
  let method = CATs[id];
  let [ρs, γs, βs] = multiplyMatrices(method.toCone_M, W1);
  let [ρd, γd, βd] = multiplyMatrices(method.toCone_M, W2);
  let scale2 = [
    [ρd / ρs, 0, 0],
    [0, γd / γs, 0],
    [0, 0, βd / βs]
  ];
  let scaled_cone_M = multiplyMatrices(scale2, method.toCone_M);
  let adapt_M = multiplyMatrices(method.fromCone_M, scaled_cone_M);
  return adapt_M;
}
defineCAT({
  id: "von Kries",
  toCone_M: [
    [0.40024, 0.7076, -0.08081],
    [-0.2263, 1.16532, 0.0457],
    [0, 0, 0.91822]
  ],
  fromCone_M: [
    [1.8599363874558397, -1.1293816185800916, 0.21989740959619328],
    [0.3611914362417676, 0.6388124632850422, -6370596838649899e-21],
    [0, 0, 1.0890636230968613]
  ]
});
defineCAT({
  id: "Bradford",
  // Convert an array of XYZ values in the range 0.0 - 1.0
  // to cone fundamentals
  toCone_M: [
    [0.8951, 0.2664, -0.1614],
    [-0.7502, 1.7135, 0.0367],
    [0.0389, -0.0685, 1.0296]
  ],
  // and back
  fromCone_M: [
    [0.9869929054667121, -0.14705425642099013, 0.15996265166373122],
    [0.4323052697233945, 0.5183602715367774, 0.049291228212855594],
    [-0.00852866457517732, 0.04004282165408486, 0.96848669578755]
  ]
});
defineCAT({
  id: "CAT02",
  // with complete chromatic adaptation to W2, so D = 1.0
  toCone_M: [
    [0.7328, 0.4296, -0.1624],
    [-0.7036, 1.6975, 61e-4],
    [3e-3, 0.0136, 0.9834]
  ],
  fromCone_M: [
    [1.0961238208355142, -0.27886900021828726, 0.18274517938277307],
    [0.4543690419753592, 0.4735331543074117, 0.07209780371722911],
    [-0.009627608738429355, -0.00569803121611342, 1.0153256399545427]
  ]
});
defineCAT({
  id: "CAT16",
  toCone_M: [
    [0.401288, 0.650173, -0.051461],
    [-0.250268, 1.204414, 0.045854],
    [-2079e-6, 0.048952, 0.953127]
  ],
  // the extra precision is needed to avoid roundtripping errors
  fromCone_M: [
    [1.862067855087233, -1.0112546305316845, 0.14918677544445172],
    [0.3875265432361372, 0.6214474419314753, -0.008973985167612521],
    [-0.01584149884933386, -0.03412293802851557, 1.0499644368778496]
  ]
});
Object.assign(WHITES, {
  // whitepoint values from ASTM E308-01 with 10nm spacing, 1931 2 degree observer
  // all normalized to Y (luminance) = 1.00000
  // Illuminant A is a tungsten electric light, giving a very warm, orange light.
  A: [1.0985, 1, 0.35585],
  // Illuminant C was an early approximation to daylight: illuminant A with a blue filter.
  C: [0.98074, 1, 1.18232],
  // The daylight series of illuminants simulate natural daylight.
  // The color temperature (in degrees Kelvin/100) ranges from
  // cool, overcast daylight (D50) to bright, direct sunlight (D65).
  D55: [0.95682, 1, 0.92149],
  D75: [0.94972, 1, 1.22638],
  // Equal-energy illuminant, used in two-stage CAT16
  E: [1, 1, 1],
  // The F series of illuminants represent fluorescent lights
  F2: [0.99186, 1, 0.67393],
  F7: [0.95041, 1, 1.08747],
  F11: [1.00962, 1, 0.6435]
});
WHITES.ACES = [0.32168 / 0.33767, 1, (1 - 0.32168 - 0.33767) / 0.33767];
const toXYZ_M = [
  [0.6624541811085053, 0.13400420645643313, 0.1561876870049078],
  [0.27222871678091454, 0.6740817658111484, 0.05368951740793705],
  [-0.005574649490394108, 0.004060733528982826, 1.0103391003129971]
];
const fromXYZ_M = [
  [1.6410233796943257, -0.32480329418479, -0.23642469523761225],
  [-0.6636628587229829, 1.6153315916573379, 0.016756347685530137],
  [0.011721894328375376, -0.008284441996237409, 0.9883948585390215]
];
var ACEScg = new RGBColorSpace({
  id: "acescg",
  cssId: "--acescg",
  name: "ACEScg",
  // ACEScg – A scene-referred, linear-light encoding of ACES Data
  // https://docs.acescentral.com/specifications/acescg/
  // uses the AP1 primaries, see section 4.3.1 Color primaries
  coords: {
    r: {
      range: [0, 65504],
      name: "Red"
    },
    g: {
      range: [0, 65504],
      name: "Green"
    },
    b: {
      range: [0, 65504],
      name: "Blue"
    }
  },
  referred: "scene",
  white: WHITES.ACES,
  toXYZ_M,
  fromXYZ_M
});
const ε = 2 ** -16;
const ACES_min_nonzero = -0.35828683;
const ACES_cc_max = (Math.log2(65504) + 9.72) / 17.52;
var acescc = new RGBColorSpace({
  id: "acescc",
  cssId: "--acescc",
  name: "ACEScc",
  // see S-2014-003 ACEScc – A Logarithmic Encoding of ACES Data
  // https://docs.acescentral.com/specifications/acescc/
  // uses the AP1 primaries, see section 4.3.1 Color primaries
  // Appendix A: "Very small ACES scene referred values below 7 1/4 stops
  // below 18% middle gray are encoded as negative ACEScc values.
  // These values should be preserved per the encoding in Section 4.4
  // so that all positive ACES values are maintained."
  coords: {
    r: {
      range: [ACES_min_nonzero, ACES_cc_max],
      name: "Red"
    },
    g: {
      range: [ACES_min_nonzero, ACES_cc_max],
      name: "Green"
    },
    b: {
      range: [ACES_min_nonzero, ACES_cc_max],
      name: "Blue"
    }
  },
  referred: "scene",
  base: ACEScg,
  // from section 4.4.2 Decoding Function
  toBase(RGB) {
    const low = (9.72 - 15) / 17.52;
    return RGB.map(function(val) {
      if (val <= low) {
        return (2 ** (val * 17.52 - 9.72) - ε) * 2;
      } else if (val < ACES_cc_max) {
        return 2 ** (val * 17.52 - 9.72);
      } else {
        return 65504;
      }
    });
  },
  // Non-linear encoding function from S-2014-003, section 4.4.1 Encoding Function
  fromBase(RGB) {
    return RGB.map(function(val) {
      if (val <= 0) {
        return (Math.log2(ε) + 9.72) / 17.52;
      } else if (val < ε) {
        return (Math.log2(ε + val * 0.5) + 9.72) / 17.52;
      } else {
        return (Math.log2(val) + 9.72) / 17.52;
      }
    });
  }
  // encoded media white (rgb 1,1,1) => linear  [ 222.861, 222.861, 222.861 ]
  // encoded media black (rgb 0,0,0) => linear [ 0.0011857, 0.0011857, 0.0011857]
});
var spaces = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  A98RGB: a98rgb,
  A98RGB_Linear: A98Linear,
  ACEScc: acescc,
  ACEScg,
  CAM16_JMh: cam16,
  HCT: hct,
  HPLuv: hpluv,
  HSL,
  HSLuv: hsluv,
  HSV,
  HWB: hwb,
  ICTCP: ictcp,
  JzCzHz: jzczhz,
  Jzazbz,
  LCH: lch,
  LCHuv,
  Lab: lab,
  Lab_D65: lab_d65,
  Luv,
  OKLCH: oklch,
  OKLab,
  P3,
  P3_Linear: P3Linear,
  ProPhoto: prophoto,
  ProPhoto_Linear: ProPhotoLinear,
  REC_2020: REC2020,
  REC_2020_Linear: REC2020Linear,
  REC_2100_HLG: rec2100Hlg,
  REC_2100_PQ: rec2100Pq,
  XYZ_ABS_D65: XYZ_Abs_D65,
  XYZ_D50,
  XYZ_D65: xyz_d65,
  sRGB,
  sRGB_Linear: sRGBLinear
});
class Color {
  /**
   * Creates an instance of Color.
   * Signatures:
   * - `new Color(stringToParse)`
   * - `new Color(otherColor)`
   * - `new Color({space, coords, alpha})`
   * - `new Color(space, coords, alpha)`
   * - `new Color(spaceId, coords, alpha)`
   */
  constructor(...args) {
    let color;
    if (args.length === 1) {
      color = getColor(args[0]);
    }
    let space, coords, alpha;
    if (color) {
      space = color.space || color.spaceId;
      coords = color.coords;
      alpha = color.alpha;
    } else {
      [space, coords, alpha] = args;
    }
    Object.defineProperty(this, "space", {
      value: ColorSpace.get(space),
      writable: false,
      enumerable: true,
      configurable: true
      // see note in https://262.ecma-international.org/8.0/#sec-proxy-object-internal-methods-and-internal-slots-get-p-receiver
    });
    this.coords = coords ? coords.slice() : [0, 0, 0];
    this.alpha = alpha > 1 || alpha === void 0 ? 1 : alpha < 0 ? 0 : alpha;
    for (let i2 = 0; i2 < this.coords.length; i2++) {
      if (this.coords[i2] === "NaN") {
        this.coords[i2] = NaN;
      }
    }
    for (let id in this.space.coords) {
      Object.defineProperty(this, id, {
        get: () => this.get(id),
        set: (value) => this.set(id, value)
      });
    }
  }
  get spaceId() {
    return this.space.id;
  }
  clone() {
    return new Color(this.space, this.coords, this.alpha);
  }
  toJSON() {
    return {
      spaceId: this.spaceId,
      coords: this.coords,
      alpha: this.alpha
    };
  }
  display(...args) {
    let ret = display(this, ...args);
    ret.color = new Color(ret.color);
    return ret;
  }
  /**
   * Get a color from the argument passed
   * Basically gets us the same result as new Color(color) but doesn't clone an existing color object
   */
  static get(color, ...args) {
    if (color instanceof Color) {
      return color;
    }
    return new Color(color, ...args);
  }
  static defineFunction(name, code, o2 = code) {
    let { instance = true, returns } = o2;
    let func = function(...args) {
      let ret = code(...args);
      if (returns === "color") {
        ret = Color.get(ret);
      } else if (returns === "function<color>") {
        let f2 = ret;
        ret = function(...args2) {
          let ret2 = f2(...args2);
          return Color.get(ret2);
        };
        Object.assign(ret, f2);
      } else if (returns === "array<color>") {
        ret = ret.map((c4) => Color.get(c4));
      }
      return ret;
    };
    if (!(name in Color)) {
      Color[name] = func;
    }
    if (instance) {
      Color.prototype[name] = function(...args) {
        return func(this, ...args);
      };
    }
  }
  static defineFunctions(o2) {
    for (let name in o2) {
      Color.defineFunction(name, o2[name], o2[name]);
    }
  }
  static extend(exports) {
    if (exports.register) {
      exports.register(Color);
    } else {
      for (let name in exports) {
        Color.defineFunction(name, exports[name]);
      }
    }
  }
}
Color.defineFunctions({
  get,
  getAll,
  set,
  setAll,
  to,
  equals,
  inGamut,
  toGamut,
  distance,
  toString: serialize
});
Object.assign(Color, {
  util,
  hooks,
  WHITES,
  Space: ColorSpace,
  spaces: ColorSpace.registry,
  parse,
  // Global defaults one may want to configure
  defaults
});
for (let key of Object.keys(spaces)) {
  ColorSpace.register(spaces[key]);
}
for (let id in ColorSpace.registry) {
  addSpaceAccessors(id, ColorSpace.registry[id]);
}
hooks.add("colorspace-init-end", (space) => {
  var _a2;
  addSpaceAccessors(space.id, space);
  (_a2 = space.aliases) == null ? void 0 : _a2.forEach((alias) => {
    addSpaceAccessors(alias, space);
  });
});
function addSpaceAccessors(id, space) {
  let propId = id.replace(/-/g, "_");
  Object.defineProperty(Color.prototype, propId, {
    // Convert coords to coords in another colorspace and return them
    // Source colorspace: this.spaceId
    // Target colorspace: id
    get() {
      let ret = this.getAll(id);
      if (typeof Proxy === "undefined") {
        return ret;
      }
      return new Proxy(ret, {
        has: (obj, property) => {
          try {
            ColorSpace.resolveCoord([space, property]);
            return true;
          } catch (e2) {
          }
          return Reflect.has(obj, property);
        },
        get: (obj, property, receiver) => {
          if (property && typeof property !== "symbol" && !(property in obj)) {
            let { index } = ColorSpace.resolveCoord([space, property]);
            if (index >= 0) {
              return obj[index];
            }
          }
          return Reflect.get(obj, property, receiver);
        },
        set: (obj, property, value, receiver) => {
          if (property && typeof property !== "symbol" && !(property in obj) || property >= 0) {
            let { index } = ColorSpace.resolveCoord([space, property]);
            if (index >= 0) {
              obj[index] = value;
              this.setAll(id, obj);
              return true;
            }
          }
          return Reflect.set(obj, property, value, receiver);
        }
      });
    },
    // Convert coords in another colorspace to internal coords and set them
    // Target colorspace: this.spaceId
    // Source colorspace: id
    set(coords) {
      this.setAll(id, coords);
    },
    configurable: true,
    enumerable: true
  });
}
Color.extend(deltaEMethods);
Color.extend({ deltaE });
Object.assign(Color, { deltaEMethods });
Color.extend(variations);
Color.extend({ contrast });
Color.extend(chromaticity);
Color.extend(luminance);
Color.extend(interpolation);
Color.extend(contrastMethods);
function contrastColor(c4) {
  var _a2, _b2;
  try {
    const color = new Color(c4);
    let wh;
    let bl;
    try {
      wh = (_a2 = color.contrast("white", "WCAG21")) != null ? _a2 : color.contrastLstar("white");
      bl = (_b2 = color.contrast("black", "WCAG21")) != null ? _b2 : color.contrastLstar("black");
    } catch {
      wh = color.contrastLstar("white");
      bl = color.contrastLstar("black");
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
    const c4 = new Color(colorStr);
    const srgb = new Color("srgb", c4.to("srgb").coords);
    const p3 = new Color("p3", c4.to("p3").coords);
    const rec2020 = new Color("rec2020", c4.to("rec2020").coords);
    const xyz = new Color("xyz", c4.to("xyz").coords);
    if (xyz.inGamut()) gamut = "xyz";
    if (rec2020.inGamut()) gamut = "rec2020";
    if (p3.inGamut()) gamut = "p3";
    if (srgb.inGamut()) gamut = "srgb";
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
function gencolor(space, ch) {
  var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j;
  const L = (_a2 = ch.L) != null ? _a2 : 50;
  const A = (_b2 = ch.A) != null ? _b2 : 0;
  const B = (_c2 = ch.B) != null ? _c2 : 0;
  const C = (_d = ch.C) != null ? _d : 0;
  const H = (_e = ch.H) != null ? _e : 0;
  const S = (_f = ch.S) != null ? _f : 0;
  const W = (_g = ch.W) != null ? _g : 0;
  const R = (_h = ch.R) != null ? _h : 0;
  const G = (_i = ch.G) != null ? _i : 0;
  const ALP = (_j = ch.ALP) != null ? _j : 100;
  switch (space) {
    case "oklab":
      return `oklab(${L}% ${A} ${B}${alphaToString(ALP)})`;
    case "oklch":
      return `oklch(${L}% ${C}% ${H}${alphaToString(ALP)})`;
    case "lab":
      return `lab(${L}% ${A} ${B}${alphaToString(ALP)})`;
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
  let c4 = new Color(colorStr);
  const actualSpace = space === "hex" ? "srgb" : space;
  const targetId = getColorJSSpaceID(actualSpace);
  if (c4.space.id !== targetId) {
    c4 = c4.to(targetId);
  }
  const id = reverseColorJSSpaceID(c4.space.id);
  const s2 = id === "rgb" ? "srgb" : id;
  const ch = {};
  if (s2 === "oklab") {
    const [l2, a2, b2] = c4.coords;
    ch.L = toFixed(l2 * 100);
    ch.A = toFixed(a2, 2);
    ch.B = toFixed(b2, 2);
    ch.ALP = toFixed(c4.alpha * 100);
  } else if (s2 === "oklch") {
    const [l2, cc, h2] = c4.coords;
    ch.L = toFixed(l2 * 100);
    ch.C = toFixed(Math.min(100, cc * 100), 0);
    ch.H = isNaN(h2) ? "0" : toFixed(h2);
    ch.ALP = toFixed(c4.alpha * 100);
  } else if (s2 === "lab") {
    const [l2, a2, b2] = c4.coords;
    ch.L = toFixed(l2);
    ch.A = toFixed(a2);
    ch.B = toFixed(b2);
    ch.ALP = toFixed(c4.alpha * 100);
  } else if (s2 === "lch") {
    const [l2, cc, h2] = c4.coords;
    ch.L = toFixed(l2);
    ch.C = toFixed(Math.min(100, cc / 1.5), 0);
    ch.H = toFixed(h2);
    ch.ALP = toFixed(c4.alpha * 100);
  } else if (s2 === "hsl") {
    const [h2, s22, l2] = c4.coords;
    ch.H = toFixed(h2);
    ch.S = toFixed(s22 > 1 ? s22 : s22 * 100);
    ch.L = toFixed(l2 > 1 ? l2 : l2 * 100);
    ch.ALP = toFixed(c4.alpha * 100);
  } else if (s2 === "hwb") {
    const [h2, w2, b2] = c4.coords;
    ch.H = toFixed(h2);
    ch.W = toFixed(w2 > 1 ? w2 : w2 * 100);
    ch.B = toFixed(b2 > 1 ? b2 : b2 * 100);
    ch.ALP = toFixed(c4.alpha * 100);
  } else if (s2 === "srgb" || s2 === "hex") {
    const [r, g2, b2] = c4.toGamut({ space: "srgb", method: "clip" }).coords;
    ch.R = toFixed(r * 100);
    ch.G = toFixed(g2 * 100);
    ch.B = toFixed(b2 * 100);
    ch.ALP = toFixed(c4.alpha * 100);
  } else if (isRGBLike(s2)) {
    const [r, g2, b2] = c4.coords;
    ch.R = toFixed(Number(r) * 100);
    ch.G = toFixed(Number(g2) * 100);
    ch.B = toFixed(Number(b2) * 100);
    ch.ALP = toFixed(c4.alpha * 100);
  }
  return { space: s2, ch };
}
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
  var _a2, _b2, _c2, _d;
  const vw = (_b2 = (_a2 = window.visualViewport) == null ? void 0 : _a2.width) != null ? _b2 : window.innerWidth;
  const vh = (_d = (_c2 = window.visualViewport) == null ? void 0 : _c2.height) != null ? _d : window.innerHeight;
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  const left = insets.left + VIEWPORT_MARGIN + scrollX;
  const top = insets.top + VIEWPORT_MARGIN + scrollY;
  const right = vw - insets.right - VIEWPORT_MARGIN + scrollX;
  const bottom = vh - insets.bottom - VIEWPORT_MARGIN + scrollY;
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
      placement: "bottom-center",
      left: anchor.left + anchor.width / 2 - w2 / 2,
      top: anchor.bottom + GUTTER,
      right: 0,
      bottom: 0
    },
    {
      placement: "top-center",
      left: anchor.left + anchor.width / 2 - w2 / 2,
      top: anchor.top - GUTTER - h2,
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
    const last2 = candidates.find((c4) => c4.placement === lastPlacement);
    if (last2 && fitsInside(last2, viewport)) {
      return last2;
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
    <span class="error-message" role="alert" aria-live="polite"></span>
    <input type="text" class="text-input" part="input" aria-label="Color value" title="Color value" aria-invalid="false" spellcheck="false" />
  </div>
  <div class="panel" popover="auto" part="panel">
    <div class="preview">
      <div class="copy-wrap">
        <button class="copy-btn">
          <span class="visually-hidden">Copy color</span>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><title>Copy color</title><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Z"/></svg>
        </button>
        <span class="copy-message" aria-hidden="true">Copied!</span>
        <span class="copy-message-live-region visually-hidden" role="status"></span>
      </div>
      <select class="space" title="Colorspace"></select>
      <output class="info" part="output"></output>
      <span class="gamut" title="Color's gamut" part="gamut"></span>
    </div>
    <div class="controls" part="controls"></div>
  </div>
  `;
  return template;
}
const styles = ':root{--radius-round: 1e5px;--radius-2: 5px;--radius-3: 1rem}:host{--canvas: Canvas;--canvas-text: CanvasText;--radius-2: .5rem;--radius-3: .75rem;--radius-round: 1e4px;--shadow-elev: #0305081f 0px -1px 2px 0px, #03050821 0px 2px 1px -2px, #03050821 0px 5px 5px -2px, #03050824 0px 10px 10px -2px, #03050826 0px 20px 20px -2px, #0305082b 0px 40px 40px -2px;--shadow-inner: inset 0 0 0 1px color-mix(in oklab, var(--canvas-text), transparent 94%);--checker: repeating-conic-gradient(color-mix(in oklab, var(--canvas-text), transparent 90%) 0% 25%, transparent 0% 50%) 50%/1rem 1rem;color-scheme:light dark;display:flex;align-items:center;gap:10px;position:relative;@media (width < 350px){overflow:hidden}}:host([hidden]){display:none}button{border:1px solid color-mix(in oklab,var(--canvas-text),var(--canvas) 80%);outline-offset:5px;&.trigger{flex-shrink:0;background:none;padding:0;border:none;display:inline-flex;place-content:center;border-radius:var(--radius-round);.chip{display:inline-block;inline-size:1.25rem;block-size:1.25rem;border-radius:var(--radius-round);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--canvas-text),transparent 92%);background:linear-gradient(var(--value) 0 0),var(--checker);forced-color-adjust:none}}}.input-wrapper{position:relative;display:flex;flex-direction:column;flex:1;min-width:0}.text-input{field-sizing:content;font-family:inherit;padding:1ch 1.5ch;border:1px solid color-mix(in oklab,var(--canvas-text),var(--canvas) 80%);border-radius:var(--radius-2);background:color-mix(in oklab,var(--canvas-text),var(--canvas) 92%);color:var(--canvas-text);box-shadow:var(--shadow-inner);outline-offset:5px;&[aria-invalid=true]{outline-color:red}}.error-message{position:absolute;top:-1.5rem;left:0;font-size:12px;color:#ef4444;font-weight:500;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s ease}.error-message:not(:empty){opacity:1}.panel{margin:0;max-inline-size:min(92vw,560px);background:var(--canvas);color:var(--canvas-text);box-shadow:var(--shadow-elev);border-radius:var(--radius-3);padding:0;border:1px solid #0000;overflow:hidden}.preview{position:relative;aspect-ratio:16 / 9;min-inline-size:28ch;display:grid;align-content:end;justify-items:start;padding:.75rem;gap:.25lh;box-shadow:var(--shadow-inner);background:linear-gradient(var(--value) 0 0),var(--checker);forced-color-adjust:none;&:hover .copy-btn,&:focus-within .copy-btn{opacity:1}>*:not(:hover){opacity:.8}.copy-wrap{position:absolute;top:.5rem;right:.5rem;display:flex;flex-direction:column;align-items:flex-end;gap:.25rem}.copy-btn{color:var(--contrast);background:none;border:1px solid #0000;border-radius:0;padding:0;cursor:pointer;opacity:0;transition:opacity .2s ease;display:inline-flex;align-items:center}.copy-btn svg{display:block}.copy-message{color:var(--contrast);font-size:14px;font-weight:500;opacity:0;pointer-events:none;transition:opacity .2s ease;white-space:nowrap}.copy-message.show{opacity:1}.visually-hidden:not(:focus):not(:active){clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}}.space{-webkit-appearance:base-select;-moz-appearance:base-select;appearance:base-select;min-block-size:1lh;line-height:1.1;font-size:12px;font-weight:700;margin:0;padding:0;color:var(--contrast);background:transparent;border-radius:0;border:none;&::picker-icon{content:"›";-webkit-appearance:none;transform:rotate(90deg) scale(1.5)}}@supports not selector(::picker-icon){.space{background-image:url(https://api.iconify.design/basil:caret-down-solid.svg);background-size:1rem;background-position:right .5rem center;background-repeat:no-repeat}}.gamut,.info{line-height:1.1;text-box:cap alphabetic;display:block;color:var(--contrast);background:transparent}.gamut{font-size:12px;text-box:ex alphabetic}.controls{display:grid;gap:.5rem;padding:.75rem;border-radius:0 0 var(--radius-3) var(--radius-3);.control{display:grid;grid-template-columns:min-content 1fr 4ch;align-items:center;gap:.5rem}.control .num-wrapper{position:relative;display:flex;align-items:center}.control .num-wrapper sup{opacity:.5;font-size:10px;place-self:start}.control label{font:500 12px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,Liberation Mono,monospace}.control input[type=number]{text-align:end;font-size:12px;padding:0;background:none;border:1px solid var(--canvas);border-radius:.25rem;-moz-appearance:textfield;font-variant:tabular-nums;font-family:monospace;&::-webkit-outer-spin-button,&::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}}.control input[type=range]{width:100%;height:1rem;border-radius:999px;border:1px solid var(--canvas);background:var(--canvas);box-shadow:var(--shadow-inner);-webkit-appearance:none;-moz-appearance:none;appearance:none;forced-color-adjust:none}.control input[type=range].alpha{background:linear-gradient(to right,#0000,#000),var(--checker)}.control input[type=range]::-webkit-slider-thumb{cursor:grab;-webkit-appearance:none;appearance:none;border:4px solid white;height:calc(1rem + 8px);aspect-ratio:1;border-radius:var(--radius-round);box-shadow:0 0 1px 1px #00000040,inset 0 1px 2px #00000026}.control input[type=range]:active::-webkit-slider-thumb{cursor:grabbing}.control input[type=range]::-moz-range-thumb{cursor:grab;-moz-appearance:none;appearance:none;border:4px solid white;height:calc(1rem + 8px);aspect-ratio:1;border-radius:var(--radius-round);box-shadow:0 0 1px 1px #00000040,inset 0 1px 2px #00000026;width:calc(8px + 1rem);background:none;box-sizing:border-box}.control input[type=range]:active::-moz-range-thumb{cursor:grabbing}}';
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
    __privateAdd(this, _space, d$1(DEFAULT_SPACE));
    __privateAdd(this, _theme, d$1("auto"));
    __privateAdd(this, _open, d$1(false));
    __privateAdd(this, _anchor, d$1(null));
    __privateAdd(this, _error, d$1(null));
    __privateAdd(this, _contrast, w(() => contrastColor(__privateGet(this, _value).value)));
    __privateAdd(this, _gamut, w(() => detectGamut(__privateGet(this, _value).value)));
    __privateAdd(this, _previewEffectCleanup, null);
    __privateAdd(this, _colorSchemeEffectCleanup, null);
    __privateAdd(this, _errorEffectCleanup, null);
    __privateAdd(this, _controlsEffectCleanup, null);
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
    __privateSet(this, _root, this.attachShadow({ mode: "open", delegatesFocus: true }));
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
    return ["value", "colorspace", "theme"];
  }
  get value() {
    return __privateGet(this, _value).value;
  }
  set value(v2) {
    if (typeof v2 !== "string" || !v2) return;
    try {
      const parsed = new Color(v2);
      const sid = reverseColorJSSpaceID(parsed.space.id);
      const isHex = typeof v2 === "string" && v2.trim().startsWith("#");
      __privateGet(this, _space).value = isHex ? "hex" : sid === "rgb" ? "srgb" : sid;
      __privateGet(this, _value).value = v2;
      this.setAttribute("value", v2);
      this.setAttribute("colorspace", __privateGet(this, _space).value);
      __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
    } catch {
    }
  }
  get colorspace() {
    return __privateGet(this, _space).value;
  }
  set colorspace(s2) {
    const next = s2 || DEFAULT_SPACE;
    __privateGet(this, _space).value = next;
    this.setAttribute("colorspace", next);
    try {
      const current = new Color(__privateGet(this, _value).value);
      const targetSpace = next === "hex" ? "srgb" : next;
      const converted = current.to(getColorJSSpaceID(targetSpace)).toGamut();
      const tempStr = converted.toString({ precision: 12 });
      const parsed = parseIntoChannels(next, tempStr);
      const newValue = gencolor(next, parsed.ch);
      __privateGet(this, _value).value = newValue;
      this.setAttribute("value", newValue);
      __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
    } catch {
    }
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
      var _a3, _b2;
      const el = __privateGet(this, _panel);
      let isOpen = false;
      try {
        isOpen = (_b2 = (_a3 = el.matches) == null ? void 0 : _a3.call(el, ":popover-open")) != null ? _b2 : false;
      } catch {
      }
      isOpen = isOpen || !el.hasAttribute("hidden");
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
      const contrast2 = __privateGet(this, _contrast).value;
      if (__privateGet(this, _output)) __privateGet(this, _output).value = v2;
      if (__privateGet(this, _chip)) __privateGet(this, _chip).style.setProperty("--value", v2);
      if (__privateGet(this, _textInput) && __privateGet(this, _textInput).value !== v2) {
        __privateGet(this, _textInput).value = v2;
      }
      this.style.setProperty("--contrast", contrast2);
      this.style.setProperty("--counter", contrast2 === "white" ? "black" : "white");
      const gamutEl = __privateGet(this, _root).querySelector(".gamut");
      if (gamutEl) gamutEl.textContent = gamut;
      const preview = __privateGet(this, _root).querySelector(".preview");
      if (preview) preview.style.setProperty("--value", v2);
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
      this.setAttribute("colorspace", __privateGet(this, _space).value);
    }
    __privateGet(this, _spaceSelect).value = __privateGet(this, _space).value;
    __privateMethod(this, _ColorInput_instances, renderControls_fn).call(this);
  }
  disconnectedCallback() {
    if (__privateGet(this, _colorSchemeEffectCleanup)) __privateGet(this, _colorSchemeEffectCleanup).call(this);
    if (__privateGet(this, _previewEffectCleanup)) __privateGet(this, _previewEffectCleanup).call(this);
    if (__privateGet(this, _errorEffectCleanup)) __privateGet(this, _errorEffectCleanup).call(this);
  }
  attributeChangedCallback(name, _old, value) {
    if (value === _old) return;
    if (name === "value" && typeof value === "string") {
      try {
        const parsed = new Color(value);
        const sid = reverseColorJSSpaceID(parsed.space.id);
        const isHex = typeof value === "string" && value.trim().startsWith("#");
        __privateGet(this, _value).value = value;
        __privateGet(this, _space).value = isHex ? "hex" : sid === "rgb" ? "srgb" : sid;
        if (__privateGet(this, _spaceSelect)) __privateGet(this, _spaceSelect).value = __privateGet(this, _space).value;
      } catch {
      }
    }
    if (name === "colorspace" && value) {
      __privateGet(this, _space).value = value;
      if (__privateGet(this, _spaceSelect)) __privateGet(this, _spaceSelect).value = value;
    }
    if (name === "theme") {
      __privateGet(this, _theme).value = value || "auto";
    }
  }
}
_value = new WeakMap();
_space = new WeakMap();
_theme = new WeakMap();
_open = new WeakMap();
_anchor = new WeakMap();
_error = new WeakMap();
_contrast = new WeakMap();
_gamut = new WeakMap();
_previewEffectCleanup = new WeakMap();
_colorSchemeEffectCleanup = new WeakMap();
_errorEffectCleanup = new WeakMap();
_controlsEffectCleanup = new WeakMap();
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
  const detail = { value: __privateGet(this, _value).value, colorspace: __privateGet(this, _space).value, gamut: __privateGet(this, _gamut).value };
  this.dispatchEvent(new CustomEvent("change", { detail, bubbles: true }));
};
validateAndSetColor_fn = function(inputValue) {
  if (!inputValue || !inputValue.trim()) {
    __privateGet(this, _error).value = "Invalid color format";
    return;
  }
  try {
    const parsed = new Color(inputValue);
    const sid = reverseColorJSSpaceID(parsed.space.id);
    const isHex = typeof inputValue === "string" && inputValue.trim().startsWith("#");
    __privateGet(this, _error).value = null;
    __privateGet(this, _space).value = isHex ? "hex" : sid === "rgb" ? "srgb" : sid;
    __privateGet(this, _value).value = inputValue;
    this.setAttribute("value", inputValue);
    this.setAttribute("colorspace", __privateGet(this, _space).value);
    if (__privateGet(this, _spaceSelect)) __privateGet(this, _spaceSelect).value = __privateGet(this, _space).value;
    __privateMethod(this, _ColorInput_instances, emitChange_fn).call(this);
  } catch (error) {
    __privateGet(this, _error).value = "Invalid color format";
  }
};
_lastPlacement = new WeakMap();
_lastPanelSize = new WeakMap();
_cleanup = new WeakMap();
_rafId = new WeakMap();
startReposition_fn = function() {
  var _a2, _b2;
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
  const panel = __privateGet(this, _panel);
  const anchorRect = __privateMethod(this, _ColorInput_instances, getAnchorRect_fn).call(this);
  const insets = getSafeAreaInsets();
  const viewport = getViewportClampRect(insets);
  const size = __privateMethod(this, _ColorInput_instances, measurePanel_fn).call(this, panel);
  const candidates = computeCandidates(anchorRect, size);
  const pick = findFirstFitOrMaxArea(candidates, viewport, __privateGet(this, _lastPlacement));
  __privateSet(this, _lastPlacement, pick.placement);
  const left = Math.round(Math.min(Math.max(pick.left, viewport.left), viewport.right - size.width));
  const top = Math.round(Math.min(Math.max(pick.top, viewport.top), viewport.bottom - size.height));
  const maxPanelHeight = viewport.bottom - viewport.top;
  if (size.height > maxPanelHeight) {
    panel.style.maxHeight = `${maxPanelHeight}px`;
    panel.style.overflow = "auto";
  } else if (panel.style.maxHeight) {
    panel.style.maxHeight = "";
    panel.style.overflow = "";
  }
  panel.style.position = "absolute";
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.setProperty("--ci-panel-placement", pick.placement);
  panel.dataset.placement = pick.placement;
};
getAnchorRect_fn = function() {
  var _a2, _b2, _c2, _d, _e, _f, _g;
  const anchor = (_c2 = (_b2 = (_a2 = __privateGet(this, _anchor).value) != null ? _a2 : __privateGet(this, _lastInvoker)) != null ? _b2 : __privateGet(this, _internalTrigger)) != null ? _c2 : this;
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  if (!anchor.isConnected) {
    const vw = (_e = (_d = window.visualViewport) == null ? void 0 : _d.width) != null ? _e : window.innerWidth;
    const vh = (_g = (_f = window.visualViewport) == null ? void 0 : _f.height) != null ? _g : window.innerHeight;
    const cx = vw / 2 + scrollX;
    const cy = vh / 2 + scrollY;
    return { left: cx, top: cy, right: cx, bottom: cy, width: 0, height: 0 };
  }
  const rect = anchor.getBoundingClientRect();
  return {
    left: rect.left + scrollX,
    top: rect.top + scrollY,
    right: rect.right + scrollX,
    bottom: rect.bottom + scrollY,
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
  panel.style.position = "absolute";
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
  var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  if (__privateGet(this, _controlsEffectCleanup)) __privateGet(this, _controlsEffectCleanup).call(this);
  const space = __privateGet(this, _space).value;
  if (!__privateGet(this, _controls)) return;
  const current = parseIntoChannels(space, __privateGet(this, _value).value);
  const ch = current.ch;
  const channelSignals = {};
  Object.keys(ch).forEach((key) => {
    channelSignals[key] = d$1(String(ch[key]));
  });
  const make = (label, key, min, max2, step = 1, bg, bgColor) => {
    var _a3, _b3;
    const wrapHue = key === "H";
    const isPercentage = ["L", "S", "C", "W", "B", "R", "G", "ALP"].includes(key);
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
    const range2 = document.createElement("input");
    range2.type = "range";
    range2.min = String(min);
    range2.max = String(max2);
    range2.step = String(step);
    range2.classList.add(`ch-${key.toLowerCase()}`);
    if (bg) range2.style.backgroundImage = bg;
    if (bgColor) range2.style.backgroundColor = bgColor;
    range2.value = String((_a3 = ch[key]) != null ? _a3 : 0);
    if (key === "ALP") {
      range2.classList.add("alpha");
      try {
        const c0 = gencolor(space, { ...ch, ALP: "0" });
        const c12 = gencolor(space, { ...ch, ALP: "100" });
        const interpSpace = space === "hsl" ? "hsl" : space === "lch" ? "lch" : space === "oklch" ? "oklch" : "oklab";
        range2.style.background = `linear-gradient(to right in ${interpSpace}, ${c0}, ${c12}), var(--checker)`;
      } catch {
      }
    }
    const num = document.createElement("input");
    num.type = "number";
    num.min = String(min);
    num.max = String(max2);
    num.step = String(step);
    num.classList.add(`ch-${key.toLowerCase()}`);
    num.value = String((_b3 = ch[key]) != null ? _b3 : 0);
    const numWrapper = document.createElement("div");
    numWrapper.className = "num-wrapper";
    numWrapper.appendChild(num);
    if (isPercentage || isAngle) {
      const unit = document.createElement("sup");
      unit.textContent = isAngle ? "°" : "%";
      numWrapper.appendChild(unit);
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
      if (wrapHue) {
        val = (val % 360 + 360) % 360;
      } else {
        val = Math.max(min, Math.min(max2, val));
      }
      const formatted = formatChannel(space, key, val);
      ch[key] = formatted;
      channelSignals[key].value = formatted;
      range2.value = String(ch[key]);
      num.value = String(ch[key]);
      apply();
    };
    range2.addEventListener("input", onInput);
    num.addEventListener("input", onInput);
    group.append(lab2, range2, numWrapper);
    return group;
  };
  __privateGet(this, _controls).innerHTML = "";
  if (space === "oklab") {
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in oklab to right, black, white)"),
      make("A", "A", -0.5, 0.5, 0.01, "linear-gradient(to right in oklab, oklab(65% -.5 .5), oklab(65% .5 .5))"),
      make("B", "B", -0.5, 0.5, 0.01, "linear-gradient(to right in oklab, oklab(47% -.03 -.32), oklab(96% 0 .25))"),
      make("A", "ALP", 0, 100, 1)
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
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in oklab to right, black, white)"),
      make("C", "C", 0, 100, 1, `linear-gradient(in oklch to right, oklch(${(_a2 = ch.L) != null ? _a2 : 0}% 1% ${(_b2 = ch.H) != null ? _b2 : 0}), oklch(${(_c2 = ch.L) != null ? _c2 : 0}% 100% ${(_d = ch.H) != null ? _d : 0}))`),
      make("H", "H", 0, 359, 1, "linear-gradient(to right in oklch longer hue, oklch(90% 75% 0), oklch(90% 75% 0))"),
      make("A", "ALP", 0, 100, 1)
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
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in lab to right, black, white)"),
      make("A", "A", -160, 160, 1, "linear-gradient(to right in oklab, lab(85% -100 100), lab(55% 100 100))"),
      make("B", "B", -160, 160, 1, "linear-gradient(to right in oklab, lab(31% 70 -120), lab(96% 0 120))"),
      make("A", "ALP", 0, 100, 1)
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
    __privateGet(this, _controls).append(
      make("L", "L", 0, 100, 1, "linear-gradient(in lab to right, black, white)"),
      make("C", "C", 0, 100, 1, `linear-gradient(in lch to right, lch(${(_e = ch.L) != null ? _e : 0}% 1% ${(_f = ch.H) != null ? _f : 0}), lch(${(_g = ch.L) != null ? _g : 0}% 100% ${(_h = ch.H) != null ? _h : 0}))`),
      make("H", "H", 0, 359, 1, "linear-gradient(to right in lch longer hue, lch(90% 75% 0), lch(90% 75% 0))"),
      make("A", "ALP", 0, 100, 1)
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
    __privateGet(this, _controls).append(
      make("H", "H", 0, 359, 1, "linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))"),
      make("S", "S", 0, 100, 1, `linear-gradient(in hsl to right, hsl(${(_i = ch.H) != null ? _i : 0} 0% ${(_j = ch.L) != null ? _j : 50}% / 100%), hsl(${(_k = ch.H) != null ? _k : 0} 100% ${(_l = ch.L) != null ? _l : 50}% / 100%))`),
      make("L", "L", 0, 100, 1, `linear-gradient(in oklab to right, hsl(${(_m = ch.H) != null ? _m : 0} ${(_n = ch.S) != null ? _n : 100}% 0%), hsl(${(_o = ch.H) != null ? _o : 0} ${(_p = ch.S) != null ? _p : 100}% 100%))`),
      make("A", "ALP", 0, 100, 1)
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
    __privateGet(this, _controls).append(
      make("H", "H", 0, 359, 1, "linear-gradient(to right in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))"),
      make("W", "W", 0, 100, 1, "linear-gradient(to right in oklab, #fff0, #fff)", "black"),
      make("B", "B", 0, 100, 1, "linear-gradient(to right in oklab, #0000, #000)", "white"),
      make("A", "ALP", 0, 100, 1)
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
    __privateGet(this, _controls).append(
      make("R", "R", 0, 100, 1, "linear-gradient(to right in oklab, #f000, #f00)", "black"),
      make("G", "G", 0, 100, 1, "linear-gradient(to right in oklab, #0f00, #0f0)", "black"),
      make("B", "B", 0, 100, 1, "linear-gradient(to right in oklab, #00f0, #00f)", "black"),
      make("A", "ALP", 0, 100, 1)
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
    __privateGet(this, _controls).append(
      make("R", "R", 0, 100, 1, "linear-gradient(to right in oklab, #f000, #f00)", "black"),
      make("G", "G", 0, 100, 1, "linear-gradient(to right in oklab, #0f00, #0f0)", "black"),
      make("B", "B", 0, 100, 1, "linear-gradient(to right in oklab, #00f0, #00f)", "black"),
      make("A", "ALP", 0, 100, 1)
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
