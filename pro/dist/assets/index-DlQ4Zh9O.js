var e = Object.create,
  t = Object.defineProperty,
  n = Object.getOwnPropertyDescriptor,
  r = Object.getOwnPropertyNames,
  i = Object.getPrototypeOf,
  a = Object.prototype.hasOwnProperty,
  o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), (e = null)), t.exports),
  s = (e, n) => {
    let r = {};
    for (var i in e) t(r, i, { get: e[i], enumerable: !0 });
    return (n || t(r, Symbol.toStringTag, { value: `Module` }), r);
  },
  c = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        ((d = c[l]),
          !a.call(e, d) &&
            d !== o &&
            t(e, d, { get: ((e) => i[e]).bind(null, d), enumerable: !(s = n(i, d)) || s.enumerable }));
    return e;
  },
  l = (n, r, a) => (
    (a = n == null ? {} : e(i(n))),
    c(r || !n || !n.__esModule ? t(a, `default`, { value: n, enumerable: !0 }) : a, n)
  );
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`) for (let e of t.addedNodes) e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var u = o((e) => {
    var t = Symbol.for(`react.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.provider`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      f = Symbol.iterator;
    function p(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (f && e[f]) || e[`@@iterator`]), typeof e == `function` ? e : null);
    }
    var m = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      h = Object.assign,
      g = {};
    function _(e, t, n) {
      ((this.props = e), (this.context = t), (this.refs = g), (this.updater = n || m));
    }
    ((_.prototype.isReactComponent = {}),
      (_.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(
            `setState(...): takes an object of state variables to update or a function which returns an object of state variables.`,
          );
        this.updater.enqueueSetState(this, e, t, `setState`);
      }),
      (_.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
      }));
    function v() {}
    v.prototype = _.prototype;
    function y(e, t, n) {
      ((this.props = e), (this.context = t), (this.refs = g), (this.updater = n || m));
    }
    var b = (y.prototype = new v());
    ((b.constructor = y), h(b, _.prototype), (b.isPureReactComponent = !0));
    var x = Array.isArray,
      S = Object.prototype.hasOwnProperty,
      C = { current: null },
      w = { key: !0, ref: !0, __self: !0, __source: !0 };
    function T(e, n, r) {
      var i,
        a = {},
        o = null,
        s = null;
      if (n != null)
        for (i in (n.ref !== void 0 && (s = n.ref), n.key !== void 0 && (o = `` + n.key), n))
          S.call(n, i) && !w.hasOwnProperty(i) && (a[i] = n[i]);
      var c = arguments.length - 2;
      if (c === 1) a.children = r;
      else if (1 < c) {
        for (var l = Array(c), u = 0; u < c; u++) l[u] = arguments[u + 2];
        a.children = l;
      }
      if (e && e.defaultProps) for (i in ((c = e.defaultProps), c)) a[i] === void 0 && (a[i] = c[i]);
      return { $$typeof: t, type: e, key: o, ref: s, props: a, _owner: C.current };
    }
    function E(e, n) {
      return { $$typeof: t, type: e.type, key: n, ref: e.ref, props: e.props, _owner: e._owner };
    }
    function D(e) {
      return typeof e == `object` && !!e && e.$$typeof === t;
    }
    function O(e) {
      var t = { '=': `=0`, ':': `=2` };
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e];
        })
      );
    }
    var k = /\/+/g;
    function A(e, t) {
      return typeof e == `object` && e && e.key != null ? O(`` + e.key) : t.toString(36);
    }
    function j(e, r, i, a, o) {
      var s = typeof e;
      (s === `undefined` || s === `boolean`) && (e = null);
      var c = !1;
      if (e === null) c = !0;
      else
        switch (s) {
          case `string`:
          case `number`:
            c = !0;
            break;
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0;
            }
        }
      if (c)
        return (
          (c = e),
          (o = o(c)),
          (e = a === `` ? `.` + A(c, 0) : a),
          x(o)
            ? ((i = ``),
              e != null && (i = e.replace(k, `$&/`) + `/`),
              j(o, r, i, ``, function (e) {
                return e;
              }))
            : o != null &&
              (D(o) &&
                (o = E(o, i + (!o.key || (c && c.key === o.key) ? `` : (`` + o.key).replace(k, `$&/`) + `/`) + e)),
              r.push(o)),
          1
        );
      if (((c = 0), (a = a === `` ? `.` : a + `:`), x(e)))
        for (var l = 0; l < e.length; l++) {
          s = e[l];
          var u = a + A(s, l);
          c += j(s, r, i, u, o);
        }
      else if (((u = p(e)), typeof u == `function`))
        for (e = u.call(e), l = 0; !(s = e.next()).done; )
          ((s = s.value), (u = a + A(s, l++)), (c += j(s, r, i, u, o)));
      else if (s === `object`)
        throw (
          (r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]` ? `object with keys {` + Object.keys(e).join(`, `) + `}` : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          )
        );
      return c;
    }
    function M(e, t, n) {
      if (e == null) return e;
      var r = [],
        i = 0;
      return (
        j(e, r, ``, ``, function (e) {
          return t.call(n, e, i++);
        }),
        r
      );
    }
    function ee(e) {
      if (e._status === -1) {
        var t = e._result;
        ((t = t()),
          t.then(
            function (t) {
              (e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = t));
            },
            function (t) {
              (e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = t));
            },
          ),
          e._status === -1 && ((e._status = 0), (e._result = t)));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var N = { current: null },
      P = { transition: null },
      te = { ReactCurrentDispatcher: N, ReactCurrentBatchConfig: P, ReactCurrentOwner: C };
    function ne() {
      throw Error(`act(...) is not supported in production builds of React.`);
    }
    ((e.Children = {
      map: M,
      forEach: function (e, t, n) {
        M(
          e,
          function () {
            t.apply(this, arguments);
          },
          n,
        );
      },
      count: function (e) {
        var t = 0;
        return (
          M(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          M(e, function (e) {
            return e;
          }) || []
        );
      },
      only: function (e) {
        if (!D(e)) throw Error(`React.Children.only expected to receive a single React element child.`);
        return e;
      },
    }),
      (e.Component = _),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = y),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = te),
      (e.act = ne),
      (e.cloneElement = function (e, n, r) {
        if (e == null)
          throw Error(`React.cloneElement(...): The argument must be a React element, but you passed ` + e + `.`);
        var i = h({}, e.props),
          a = e.key,
          o = e.ref,
          s = e._owner;
        if (n != null) {
          if (
            (n.ref !== void 0 && ((o = n.ref), (s = C.current)),
            n.key !== void 0 && (a = `` + n.key),
            e.type && e.type.defaultProps)
          )
            var c = e.type.defaultProps;
          for (l in n) S.call(n, l) && !w.hasOwnProperty(l) && (i[l] = n[l] === void 0 && c !== void 0 ? c[l] : n[l]);
        }
        var l = arguments.length - 2;
        if (l === 1) i.children = r;
        else if (1 < l) {
          c = Array(l);
          for (var u = 0; u < l; u++) c[u] = arguments[u + 2];
          i.children = c;
        }
        return { $$typeof: t, type: e.type, key: a, ref: o, props: i, _owner: s };
      }),
      (e.createContext = function (e) {
        return (
          (e = {
            $$typeof: s,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null,
          }),
          (e.Provider = { $$typeof: o, _context: e }),
          (e.Consumer = e)
        );
      }),
      (e.createElement = T),
      (e.createFactory = function (e) {
        var t = T.bind(null, e);
        return ((t.type = e), t);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e };
      }),
      (e.isValidElement = D),
      (e.lazy = function (e) {
        return { $$typeof: d, _payload: { _status: -1, _result: e }, _init: ee };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
      }),
      (e.startTransition = function (e) {
        var t = P.transition;
        P.transition = {};
        try {
          e();
        } finally {
          P.transition = t;
        }
      }),
      (e.unstable_act = ne),
      (e.useCallback = function (e, t) {
        return N.current.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return N.current.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e) {
        return N.current.useDeferredValue(e);
      }),
      (e.useEffect = function (e, t) {
        return N.current.useEffect(e, t);
      }),
      (e.useId = function () {
        return N.current.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return N.current.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return N.current.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return N.current.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return N.current.useMemo(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return N.current.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return N.current.useRef(e);
      }),
      (e.useState = function (e) {
        return N.current.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return N.current.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return N.current.useTransition();
      }),
      (e.version = `18.3.1`));
  }),
  d = o((e, t) => {
    t.exports = u();
  }),
  f = o((e) => {
    function t(e, t) {
      var n = e.length;
      e.push(t);
      a: for (; 0 < n; ) {
        var r = (n - 1) >>> 1,
          a = e[r];
        if (0 < i(a, t)) ((e[r] = t), (e[n] = a), (n = r));
        else break a;
      }
    }
    function n(e) {
      return e.length === 0 ? null : e[0];
    }
    function r(e) {
      if (e.length === 0) return null;
      var t = e[0],
        n = e.pop();
      if (n !== t) {
        e[0] = n;
        a: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
          var s = 2 * (r + 1) - 1,
            c = e[s],
            l = s + 1,
            u = e[l];
          if (0 > i(c, n)) l < a && 0 > i(u, c) ? ((e[r] = u), (e[l] = n), (r = l)) : ((e[r] = c), (e[s] = n), (r = s));
          else if (l < a && 0 > i(u, n)) ((e[r] = u), (e[l] = n), (r = l));
          else break a;
        }
      }
      return t;
    }
    function i(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return n === 0 ? e.id - t.id : n;
    }
    if (typeof performance == `object` && typeof performance.now == `function`) {
      var a = performance;
      e.unstable_now = function () {
        return a.now();
      };
    } else {
      var o = Date,
        s = o.now();
      e.unstable_now = function () {
        return o.now() - s;
      };
    }
    var c = [],
      l = [],
      u = 1,
      d = null,
      f = 3,
      p = !1,
      m = !1,
      h = !1,
      g = typeof setTimeout == `function` ? setTimeout : null,
      _ = typeof clearTimeout == `function` ? clearTimeout : null,
      v = typeof setImmediate < `u` ? setImmediate : null;
    typeof navigator < `u` &&
      navigator.scheduling !== void 0 &&
      navigator.scheduling.isInputPending !== void 0 &&
      navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function y(e) {
      for (var i = n(l); i !== null; ) {
        if (i.callback === null) r(l);
        else if (i.startTime <= e) (r(l), (i.sortIndex = i.expirationTime), t(c, i));
        else break;
        i = n(l);
      }
    }
    function b(e) {
      if (((h = !1), y(e), !m))
        if (n(c) !== null) ((m = !0), M(x));
        else {
          var t = n(l);
          t !== null && ee(b, t.startTime - e);
        }
    }
    function x(t, i) {
      ((m = !1), h && ((h = !1), _(w), (w = -1)), (p = !0));
      var a = f;
      try {
        for (y(i), d = n(c); d !== null && (!(d.expirationTime > i) || (t && !D())); ) {
          var o = d.callback;
          if (typeof o == `function`) {
            ((d.callback = null), (f = d.priorityLevel));
            var s = o(d.expirationTime <= i);
            ((i = e.unstable_now()), typeof s == `function` ? (d.callback = s) : d === n(c) && r(c), y(i));
          } else r(c);
          d = n(c);
        }
        if (d !== null) var u = !0;
        else {
          var g = n(l);
          (g !== null && ee(b, g.startTime - i), (u = !1));
        }
        return u;
      } finally {
        ((d = null), (f = a), (p = !1));
      }
    }
    var S = !1,
      C = null,
      w = -1,
      T = 5,
      E = -1;
    function D() {
      return !(e.unstable_now() - E < T);
    }
    function O() {
      if (C !== null) {
        var t = e.unstable_now();
        E = t;
        var n = !0;
        try {
          n = C(!0, t);
        } finally {
          n ? k() : ((S = !1), (C = null));
        }
      } else S = !1;
    }
    var k;
    if (typeof v == `function`)
      k = function () {
        v(O);
      };
    else if (typeof MessageChannel < `u`) {
      var A = new MessageChannel(),
        j = A.port2;
      ((A.port1.onmessage = O),
        (k = function () {
          j.postMessage(null);
        }));
    } else
      k = function () {
        g(O, 0);
      };
    function M(e) {
      ((C = e), S || ((S = !0), k()));
    }
    function ee(t, n) {
      w = g(function () {
        t(e.unstable_now());
      }, n);
    }
    ((e.unstable_IdlePriority = 5),
      (e.unstable_ImmediatePriority = 1),
      (e.unstable_LowPriority = 4),
      (e.unstable_NormalPriority = 3),
      (e.unstable_Profiling = null),
      (e.unstable_UserBlockingPriority = 2),
      (e.unstable_cancelCallback = function (e) {
        e.callback = null;
      }),
      (e.unstable_continueExecution = function () {
        m || p || ((m = !0), M(x));
      }),
      (e.unstable_forceFrameRate = function (e) {
        0 > e || 125 < e
          ? console.error(
              `forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
            )
          : (T = 0 < e ? Math.floor(1e3 / e) : 5);
      }),
      (e.unstable_getCurrentPriorityLevel = function () {
        return f;
      }),
      (e.unstable_getFirstCallbackNode = function () {
        return n(c);
      }),
      (e.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      }),
      (e.unstable_pauseExecution = function () {}),
      (e.unstable_requestPaint = function () {}),
      (e.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      }),
      (e.unstable_scheduleCallback = function (r, i, a) {
        var o = e.unstable_now();
        switch (
          (typeof a == `object` && a ? ((a = a.delay), (a = typeof a == `number` && 0 < a ? o + a : o)) : (a = o), r)
        ) {
          case 1:
            var s = -1;
            break;
          case 2:
            s = 250;
            break;
          case 5:
            s = 1073741823;
            break;
          case 4:
            s = 1e4;
            break;
          default:
            s = 5e3;
        }
        return (
          (s = a + s),
          (r = { id: u++, callback: i, priorityLevel: r, startTime: a, expirationTime: s, sortIndex: -1 }),
          a > o
            ? ((r.sortIndex = a),
              t(l, r),
              n(c) === null && r === n(l) && (h ? (_(w), (w = -1)) : (h = !0), ee(b, a - o)))
            : ((r.sortIndex = s), t(c, r), m || p || ((m = !0), M(x))),
          r
        );
      }),
      (e.unstable_shouldYield = D),
      (e.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      }));
  }),
  p = o((e, t) => {
    t.exports = f();
  }),
  m = o((e) => {
    var t = d(),
      n = p();
    function r(e) {
      for (var t = `https://reactjs.org/docs/error-decoder.html?invariant=` + e, n = 1; n < arguments.length; n++)
        t += `&args[]=` + encodeURIComponent(arguments[n]);
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    var i = new Set(),
      a = {};
    function o(e, t) {
      (s(e, t), s(e + `Capture`, t));
    }
    function s(e, t) {
      for (a[e] = t, e = 0; e < t.length; e++) i.add(t[e]);
    }
    var c = !(typeof window > `u` || window.document === void 0 || window.document.createElement === void 0),
      l = Object.prototype.hasOwnProperty,
      u =
        /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
      f = {},
      m = {};
    function h(e) {
      return l.call(m, e) ? !0 : l.call(f, e) ? !1 : u.test(e) ? (m[e] = !0) : ((f[e] = !0), !1);
    }
    function g(e, t, n, r) {
      if (n !== null && n.type === 0) return !1;
      switch (typeof t) {
        case `function`:
        case `symbol`:
          return !0;
        case `boolean`:
          return r
            ? !1
            : n === null
              ? ((e = e.toLowerCase().slice(0, 5)), e !== `data-` && e !== `aria-`)
              : !n.acceptsBooleans;
        default:
          return !1;
      }
    }
    function _(e, t, n, r) {
      if (t == null || g(e, t, n, r)) return !0;
      if (r) return !1;
      if (n !== null)
        switch (n.type) {
          case 3:
            return !t;
          case 4:
            return !1 === t;
          case 5:
            return isNaN(t);
          case 6:
            return isNaN(t) || 1 > t;
        }
      return !1;
    }
    function v(e, t, n, r, i, a, o) {
      ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
        (this.attributeName = r),
        (this.attributeNamespace = i),
        (this.mustUseProperty = n),
        (this.propertyName = e),
        (this.type = t),
        (this.sanitizeURL = a),
        (this.removeEmptyString = o));
    }
    var y = {};
    (`children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style`
      .split(` `)
      .forEach(function (e) {
        y[e] = new v(e, 0, !1, e, null, !1, !1);
      }),
      [
        [`acceptCharset`, `accept-charset`],
        [`className`, `class`],
        [`htmlFor`, `for`],
        [`httpEquiv`, `http-equiv`],
      ].forEach(function (e) {
        var t = e[0];
        y[t] = new v(t, 1, !1, e[1], null, !1, !1);
      }),
      [`contentEditable`, `draggable`, `spellCheck`, `value`].forEach(function (e) {
        y[e] = new v(e, 2, !1, e.toLowerCase(), null, !1, !1);
      }),
      [`autoReverse`, `externalResourcesRequired`, `focusable`, `preserveAlpha`].forEach(function (e) {
        y[e] = new v(e, 2, !1, e, null, !1, !1);
      }),
      `allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope`
        .split(` `)
        .forEach(function (e) {
          y[e] = new v(e, 3, !1, e.toLowerCase(), null, !1, !1);
        }),
      [`checked`, `multiple`, `muted`, `selected`].forEach(function (e) {
        y[e] = new v(e, 3, !0, e, null, !1, !1);
      }),
      [`capture`, `download`].forEach(function (e) {
        y[e] = new v(e, 4, !1, e, null, !1, !1);
      }),
      [`cols`, `rows`, `size`, `span`].forEach(function (e) {
        y[e] = new v(e, 6, !1, e, null, !1, !1);
      }),
      [`rowSpan`, `start`].forEach(function (e) {
        y[e] = new v(e, 5, !1, e.toLowerCase(), null, !1, !1);
      }));
    var b = /[\-:]([a-z])/g;
    function x(e) {
      return e[1].toUpperCase();
    }
    (`accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height`
      .split(` `)
      .forEach(function (e) {
        var t = e.replace(b, x);
        y[t] = new v(t, 1, !1, e, null, !1, !1);
      }),
      `xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type`.split(` `).forEach(function (e) {
        var t = e.replace(b, x);
        y[t] = new v(t, 1, !1, e, `http://www.w3.org/1999/xlink`, !1, !1);
      }),
      [`xml:base`, `xml:lang`, `xml:space`].forEach(function (e) {
        var t = e.replace(b, x);
        y[t] = new v(t, 1, !1, e, `http://www.w3.org/XML/1998/namespace`, !1, !1);
      }),
      [`tabIndex`, `crossOrigin`].forEach(function (e) {
        y[e] = new v(e, 1, !1, e.toLowerCase(), null, !1, !1);
      }),
      (y.xlinkHref = new v(`xlinkHref`, 1, !1, `xlink:href`, `http://www.w3.org/1999/xlink`, !0, !1)),
      [`src`, `href`, `action`, `formAction`].forEach(function (e) {
        y[e] = new v(e, 1, !1, e.toLowerCase(), null, !0, !0);
      }));
    function S(e, t, n, r) {
      var i = y.hasOwnProperty(t) ? y[t] : null;
      (i === null
        ? r || !(2 < t.length) || (t[0] !== `o` && t[0] !== `O`) || (t[1] !== `n` && t[1] !== `N`)
        : i.type !== 0) &&
        (_(t, n, i, r) && (n = null),
        r || i === null
          ? h(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, `` + n))
          : i.mustUseProperty
            ? (e[i.propertyName] = n === null ? (i.type === 3 ? !1 : ``) : n)
            : ((t = i.attributeName),
              (r = i.attributeNamespace),
              n === null
                ? e.removeAttribute(t)
                : ((i = i.type),
                  (n = i === 3 || (i === 4 && !0 === n) ? `` : `` + n),
                  r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
    }
    var C = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
      w = Symbol.for(`react.element`),
      T = Symbol.for(`react.portal`),
      E = Symbol.for(`react.fragment`),
      D = Symbol.for(`react.strict_mode`),
      O = Symbol.for(`react.profiler`),
      k = Symbol.for(`react.provider`),
      A = Symbol.for(`react.context`),
      j = Symbol.for(`react.forward_ref`),
      M = Symbol.for(`react.suspense`),
      ee = Symbol.for(`react.suspense_list`),
      N = Symbol.for(`react.memo`),
      P = Symbol.for(`react.lazy`),
      te = Symbol.for(`react.offscreen`),
      ne = Symbol.iterator;
    function re(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (ne && e[ne]) || e[`@@iterator`]), typeof e == `function` ? e : null);
    }
    var F = Object.assign,
      ie;
    function ae(e) {
      if (ie === void 0)
        try {
          throw Error();
        } catch (e) {
          var t = e.stack.trim().match(/\n( *(at )?)/);
          ie = (t && t[1]) || ``;
        }
      return (
        `
` +
        ie +
        e
      );
    }
    var oe = !1;
    function se(e, t) {
      if (!e || oe) return ``;
      oe = !0;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        if (t)
          if (
            ((t = function () {
              throw Error();
            }),
            Object.defineProperty(t.prototype, `props`, {
              set: function () {
                throw Error();
              },
            }),
            typeof Reflect == `object` && Reflect.construct)
          ) {
            try {
              Reflect.construct(t, []);
            } catch (e) {
              var r = e;
            }
            Reflect.construct(e, [], t);
          } else {
            try {
              t.call();
            } catch (e) {
              r = e;
            }
            e.call(t.prototype);
          }
        else {
          try {
            throw Error();
          } catch (e) {
            r = e;
          }
          e();
        }
      } catch (t) {
        if (t && r && typeof t.stack == `string`) {
          for (
            var i = t.stack.split(`
`),
              a = r.stack.split(`
`),
              o = i.length - 1,
              s = a.length - 1;
            1 <= o && 0 <= s && i[o] !== a[s];
          )
            s--;
          for (; 1 <= o && 0 <= s; o--, s--)
            if (i[o] !== a[s]) {
              if (o !== 1 || s !== 1)
                do
                  if ((o--, s--, 0 > s || i[o] !== a[s])) {
                    var c =
                      `
` + i[o].replace(` at new `, ` at `);
                    return (
                      e.displayName && c.includes(`<anonymous>`) && (c = c.replace(`<anonymous>`, e.displayName)),
                      c
                    );
                  }
                while (1 <= o && 0 <= s);
              break;
            }
        }
      } finally {
        ((oe = !1), (Error.prepareStackTrace = n));
      }
      return (e = e ? e.displayName || e.name : ``) ? ae(e) : ``;
    }
    function ce(e) {
      switch (e.tag) {
        case 5:
          return ae(e.type);
        case 16:
          return ae(`Lazy`);
        case 13:
          return ae(`Suspense`);
        case 19:
          return ae(`SuspenseList`);
        case 0:
        case 2:
        case 15:
          return ((e = se(e.type, !1)), e);
        case 11:
          return ((e = se(e.type.render, !1)), e);
        case 1:
          return ((e = se(e.type, !0)), e);
        default:
          return ``;
      }
    }
    function le(e) {
      if (e == null) return null;
      if (typeof e == `function`) return e.displayName || e.name || null;
      if (typeof e == `string`) return e;
      switch (e) {
        case E:
          return `Fragment`;
        case T:
          return `Portal`;
        case O:
          return `Profiler`;
        case D:
          return `StrictMode`;
        case M:
          return `Suspense`;
        case ee:
          return `SuspenseList`;
      }
      if (typeof e == `object`)
        switch (e.$$typeof) {
          case A:
            return (e.displayName || `Context`) + `.Consumer`;
          case k:
            return (e._context.displayName || `Context`) + `.Provider`;
          case j:
            var t = e.render;
            return (
              (e = e.displayName),
              (e ||= ((e = t.displayName || t.name || ``), e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)),
              e
            );
          case N:
            return ((t = e.displayName || null), t === null ? le(e.type) || `Memo` : t);
          case P:
            ((t = e._payload), (e = e._init));
            try {
              return le(e(t));
            } catch {}
        }
      return null;
    }
    function ue(e) {
      var t = e.type;
      switch (e.tag) {
        case 24:
          return `Cache`;
        case 9:
          return (t.displayName || `Context`) + `.Consumer`;
        case 10:
          return (t._context.displayName || `Context`) + `.Provider`;
        case 18:
          return `DehydratedFragment`;
        case 11:
          return (
            (e = t.render),
            (e = e.displayName || e.name || ``),
            t.displayName || (e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)
          );
        case 7:
          return `Fragment`;
        case 5:
          return t;
        case 4:
          return `Portal`;
        case 3:
          return `Root`;
        case 6:
          return `Text`;
        case 16:
          return le(t);
        case 8:
          return t === D ? `StrictMode` : `Mode`;
        case 22:
          return `Offscreen`;
        case 12:
          return `Profiler`;
        case 21:
          return `Scope`;
        case 13:
          return `Suspense`;
        case 19:
          return `SuspenseList`;
        case 25:
          return `TracingMarker`;
        case 1:
        case 0:
        case 17:
        case 2:
        case 14:
        case 15:
          if (typeof t == `function`) return t.displayName || t.name || null;
          if (typeof t == `string`) return t;
      }
      return null;
    }
    function I(e) {
      switch (typeof e) {
        case `boolean`:
        case `number`:
        case `string`:
        case `undefined`:
          return e;
        case `object`:
          return e;
        default:
          return ``;
      }
    }
    function de(e) {
      var t = e.type;
      return (e = e.nodeName) && e.toLowerCase() === `input` && (t === `checkbox` || t === `radio`);
    }
    function fe(e) {
      var t = de(e) ? `checked` : `value`,
        n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
        r = `` + e[t];
      if (!e.hasOwnProperty(t) && n !== void 0 && typeof n.get == `function` && typeof n.set == `function`) {
        var i = n.get,
          a = n.set;
        return (
          Object.defineProperty(e, t, {
            configurable: !0,
            get: function () {
              return i.call(this);
            },
            set: function (e) {
              ((r = `` + e), a.call(this, e));
            },
          }),
          Object.defineProperty(e, t, { enumerable: n.enumerable }),
          {
            getValue: function () {
              return r;
            },
            setValue: function (e) {
              r = `` + e;
            },
            stopTracking: function () {
              ((e._valueTracker = null), delete e[t]);
            },
          }
        );
      }
    }
    function L(e) {
      e._valueTracker ||= fe(e);
    }
    function pe(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var n = t.getValue(),
        r = ``;
      return (e && (r = de(e) ? (e.checked ? `true` : `false`) : e.value), (e = r), e === n ? !1 : (t.setValue(e), !0));
    }
    function me(e) {
      if (((e ||= typeof document < `u` ? document : void 0), e === void 0)) return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    function he(e, t) {
      var n = t.checked;
      return F({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: n ?? e._wrapperState.initialChecked,
      });
    }
    function R(e, t) {
      var n = t.defaultValue == null ? `` : t.defaultValue,
        r = t.checked == null ? t.defaultChecked : t.checked;
      ((n = I(t.value == null ? n : t.value)),
        (e._wrapperState = {
          initialChecked: r,
          initialValue: n,
          controlled: t.type === `checkbox` || t.type === `radio` ? t.checked != null : t.value != null,
        }));
    }
    function ge(e, t) {
      ((t = t.checked), t != null && S(e, `checked`, t, !1));
    }
    function _e(e, t) {
      ge(e, t);
      var n = I(t.value),
        r = t.type;
      if (n != null)
        r === `number`
          ? ((n === 0 && e.value === ``) || e.value != n) && (e.value = `` + n)
          : e.value !== `` + n && (e.value = `` + n);
      else if (r === `submit` || r === `reset`) {
        e.removeAttribute(`value`);
        return;
      }
      (t.hasOwnProperty(`value`)
        ? ye(e, t.type, n)
        : t.hasOwnProperty(`defaultValue`) && ye(e, t.type, I(t.defaultValue)),
        t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked));
    }
    function ve(e, t, n) {
      if (t.hasOwnProperty(`value`) || t.hasOwnProperty(`defaultValue`)) {
        var r = t.type;
        if (!((r !== `submit` && r !== `reset`) || (t.value !== void 0 && t.value !== null))) return;
        ((t = `` + e._wrapperState.initialValue), n || t === e.value || (e.value = t), (e.defaultValue = t));
      }
      ((n = e.name),
        n !== `` && (e.name = ``),
        (e.defaultChecked = !!e._wrapperState.initialChecked),
        n !== `` && (e.name = n));
    }
    function ye(e, t, n) {
      (t !== `number` || me(e.ownerDocument) !== e) &&
        (n == null
          ? (e.defaultValue = `` + e._wrapperState.initialValue)
          : e.defaultValue !== `` + n && (e.defaultValue = `` + n));
    }
    var be = Array.isArray;
    function xe(e, t, n, r) {
      if (((e = e.options), t)) {
        t = {};
        for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
        for (n = 0; n < e.length; n++)
          ((i = t.hasOwnProperty(`$` + e[n].value)),
            e[n].selected !== i && (e[n].selected = i),
            i && r && (e[n].defaultSelected = !0));
      } else {
        for (n = `` + I(n), t = null, i = 0; i < e.length; i++) {
          if (e[i].value === n) {
            ((e[i].selected = !0), r && (e[i].defaultSelected = !0));
            return;
          }
          t !== null || e[i].disabled || (t = e[i]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function Se(e, t) {
      if (t.dangerouslySetInnerHTML != null) throw Error(r(91));
      return F({}, t, { value: void 0, defaultValue: void 0, children: `` + e._wrapperState.initialValue });
    }
    function Ce(e, t) {
      var n = t.value;
      if (n == null) {
        if (((n = t.children), (t = t.defaultValue), n != null)) {
          if (t != null) throw Error(r(92));
          if (be(n)) {
            if (1 < n.length) throw Error(r(93));
            n = n[0];
          }
          t = n;
        }
        ((t ??= ``), (n = t));
      }
      e._wrapperState = { initialValue: I(n) };
    }
    function we(e, t) {
      var n = I(t.value),
        r = I(t.defaultValue);
      (n != null &&
        ((n = `` + n),
        n !== e.value && (e.value = n),
        t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
        r != null && (e.defaultValue = `` + r));
    }
    function Te(e) {
      var t = e.textContent;
      t === e._wrapperState.initialValue && t !== `` && t !== null && (e.value = t);
    }
    function Ee(e) {
      switch (e) {
        case `svg`:
          return `http://www.w3.org/2000/svg`;
        case `math`:
          return `http://www.w3.org/1998/Math/MathML`;
        default:
          return `http://www.w3.org/1999/xhtml`;
      }
    }
    function De(e, t) {
      return e == null || e === `http://www.w3.org/1999/xhtml`
        ? Ee(t)
        : e === `http://www.w3.org/2000/svg` && t === `foreignObject`
          ? `http://www.w3.org/1999/xhtml`
          : e;
    }
    var Oe,
      ke = (function (e) {
        return typeof MSApp < `u` && MSApp.execUnsafeLocalFunction
          ? function (t, n, r, i) {
              MSApp.execUnsafeLocalFunction(function () {
                return e(t, n, r, i);
              });
            }
          : e;
      })(function (e, t) {
        if (e.namespaceURI !== `http://www.w3.org/2000/svg` || `innerHTML` in e) e.innerHTML = t;
        else {
          for (
            Oe ||= document.createElement(`div`),
              Oe.innerHTML = `<svg>` + t.valueOf().toString() + `</svg>`,
              t = Oe.firstChild;
            e.firstChild;
          )
            e.removeChild(e.firstChild);
          for (; t.firstChild; ) e.appendChild(t.firstChild);
        }
      });
    function Ae(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
          n.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var je = {
        animationIterationCount: !0,
        aspectRatio: !0,
        borderImageOutset: !0,
        borderImageSlice: !0,
        borderImageWidth: !0,
        boxFlex: !0,
        boxFlexGroup: !0,
        boxOrdinalGroup: !0,
        columnCount: !0,
        columns: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        flexOrder: !0,
        gridArea: !0,
        gridRow: !0,
        gridRowEnd: !0,
        gridRowSpan: !0,
        gridRowStart: !0,
        gridColumn: !0,
        gridColumnEnd: !0,
        gridColumnSpan: !0,
        gridColumnStart: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        floodOpacity: !0,
        stopOpacity: !0,
        strokeDasharray: !0,
        strokeDashoffset: !0,
        strokeMiterlimit: !0,
        strokeOpacity: !0,
        strokeWidth: !0,
      },
      Me = [`Webkit`, `ms`, `Moz`, `O`];
    Object.keys(je).forEach(function (e) {
      Me.forEach(function (t) {
        ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (je[t] = je[e]));
      });
    });
    function Ne(e, t, n) {
      return t == null || typeof t == `boolean` || t === ``
        ? ``
        : n || typeof t != `number` || t === 0 || (je.hasOwnProperty(e) && je[e])
          ? (`` + t).trim()
          : t + `px`;
    }
    function Pe(e, t) {
      for (var n in ((e = e.style), t))
        if (t.hasOwnProperty(n)) {
          var r = n.indexOf(`--`) === 0,
            i = Ne(n, t[n], r);
          (n === `float` && (n = `cssFloat`), r ? e.setProperty(n, i) : (e[n] = i));
        }
    }
    var Fe = F(
      { menuitem: !0 },
      {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0,
      },
    );
    function Ie(e, t) {
      if (t) {
        if (Fe[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(r(137, e));
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null) throw Error(r(60));
          if (typeof t.dangerouslySetInnerHTML != `object` || !(`__html` in t.dangerouslySetInnerHTML))
            throw Error(r(61));
        }
        if (t.style != null && typeof t.style != `object`) throw Error(r(62));
      }
    }
    function Le(e, t) {
      if (e.indexOf(`-`) === -1) return typeof t.is == `string`;
      switch (e) {
        case `annotation-xml`:
        case `color-profile`:
        case `font-face`:
        case `font-face-src`:
        case `font-face-uri`:
        case `font-face-format`:
        case `font-face-name`:
        case `missing-glyph`:
          return !1;
        default:
          return !0;
      }
    }
    var Re = null;
    function ze(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var Be = null,
      Ve = null,
      He = null;
    function Ue(e) {
      if ((e = q(e))) {
        if (typeof Be != `function`) throw Error(r(280));
        var t = e.stateNode;
        t && ((t = J(t)), Be(e.stateNode, e.type, t));
      }
    }
    function We(e) {
      Ve ? (He ? He.push(e) : (He = [e])) : (Ve = e);
    }
    function Ge() {
      if (Ve) {
        var e = Ve,
          t = He;
        if (((He = Ve = null), Ue(e), t)) for (e = 0; e < t.length; e++) Ue(t[e]);
      }
    }
    function Ke(e, t) {
      return e(t);
    }
    function qe() {}
    var Je = !1;
    function Ye(e, t, n) {
      if (Je) return e(t, n);
      Je = !0;
      try {
        return Ke(e, t, n);
      } finally {
        ((Je = !1), (Ve !== null || He !== null) && (qe(), Ge()));
      }
    }
    function Xe(e, t) {
      var n = e.stateNode;
      if (n === null) return null;
      var i = J(n);
      if (i === null) return null;
      n = i[t];
      a: switch (t) {
        case `onClick`:
        case `onClickCapture`:
        case `onDoubleClick`:
        case `onDoubleClickCapture`:
        case `onMouseDown`:
        case `onMouseDownCapture`:
        case `onMouseMove`:
        case `onMouseMoveCapture`:
        case `onMouseUp`:
        case `onMouseUpCapture`:
        case `onMouseEnter`:
          ((i = !i.disabled) ||
            ((e = e.type), (i = !(e === `button` || e === `input` || e === `select` || e === `textarea`))),
            (e = !i));
          break a;
        default:
          e = !1;
      }
      if (e) return null;
      if (n && typeof n != `function`) throw Error(r(231, t, typeof n));
      return n;
    }
    var Ze = !1;
    if (c)
      try {
        var Qe = {};
        (Object.defineProperty(Qe, `passive`, {
          get: function () {
            Ze = !0;
          },
        }),
          window.addEventListener(`test`, Qe, Qe),
          window.removeEventListener(`test`, Qe, Qe));
      } catch {
        Ze = !1;
      }
    function z(e, t, n, r, i, a, o, s, c) {
      var l = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(n, l);
      } catch (e) {
        this.onError(e);
      }
    }
    var $e = !1,
      et = null,
      tt = !1,
      nt = null,
      rt = {
        onError: function (e) {
          (($e = !0), (et = e));
        },
      };
    function it(e, t, n, r, i, a, o, s, c) {
      (($e = !1), (et = null), z.apply(rt, arguments));
    }
    function at(e, t, n, i, a, o, s, c, l) {
      if ((it.apply(this, arguments), $e)) {
        if ($e) {
          var u = et;
          (($e = !1), (et = null));
        } else throw Error(r(198));
        tt || ((tt = !0), (nt = u));
      }
    }
    function ot(e) {
      var t = e,
        n = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
        while (e);
      }
      return t.tag === 3 ? n : null;
    }
    function st(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null)) return t.dehydrated;
      }
      return null;
    }
    function ct(e) {
      if (ot(e) !== e) throw Error(r(188));
    }
    function lt(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = ot(e)), t === null)) throw Error(r(188));
        return t === e ? e : null;
      }
      for (var n = e, i = t; ; ) {
        var a = n.return;
        if (a === null) break;
        var o = a.alternate;
        if (o === null) {
          if (((i = a.return), i !== null)) {
            n = i;
            continue;
          }
          break;
        }
        if (a.child === o.child) {
          for (o = a.child; o; ) {
            if (o === n) return (ct(a), e);
            if (o === i) return (ct(a), t);
            o = o.sibling;
          }
          throw Error(r(188));
        }
        if (n.return !== i.return) ((n = a), (i = o));
        else {
          for (var s = !1, c = a.child; c; ) {
            if (c === n) {
              ((s = !0), (n = a), (i = o));
              break;
            }
            if (c === i) {
              ((s = !0), (i = a), (n = o));
              break;
            }
            c = c.sibling;
          }
          if (!s) {
            for (c = o.child; c; ) {
              if (c === n) {
                ((s = !0), (n = o), (i = a));
                break;
              }
              if (c === i) {
                ((s = !0), (i = o), (n = a));
                break;
              }
              c = c.sibling;
            }
            if (!s) throw Error(r(189));
          }
        }
        if (n.alternate !== i) throw Error(r(190));
      }
      if (n.tag !== 3) throw Error(r(188));
      return n.stateNode.current === n ? e : t;
    }
    function ut(e) {
      return ((e = lt(e)), e === null ? null : dt(e));
    }
    function dt(e) {
      if (e.tag === 5 || e.tag === 6) return e;
      for (e = e.child; e !== null; ) {
        var t = dt(e);
        if (t !== null) return t;
        e = e.sibling;
      }
      return null;
    }
    var ft = n.unstable_scheduleCallback,
      pt = n.unstable_cancelCallback,
      mt = n.unstable_shouldYield,
      ht = n.unstable_requestPaint,
      gt = n.unstable_now,
      _t = n.unstable_getCurrentPriorityLevel,
      vt = n.unstable_ImmediatePriority,
      yt = n.unstable_UserBlockingPriority,
      bt = n.unstable_NormalPriority,
      xt = n.unstable_LowPriority,
      St = n.unstable_IdlePriority,
      Ct = null,
      wt = null;
    function Tt(e) {
      if (wt && typeof wt.onCommitFiberRoot == `function`)
        try {
          wt.onCommitFiberRoot(Ct, e, void 0, (e.current.flags & 128) == 128);
        } catch {}
    }
    var Et = Math.clz32 ? Math.clz32 : kt,
      Dt = Math.log,
      Ot = Math.LN2;
    function kt(e) {
      return ((e >>>= 0), e === 0 ? 32 : (31 - ((Dt(e) / Ot) | 0)) | 0);
    }
    var At = 64,
      jt = 4194304;
    function Mt(e) {
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 4194240;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return e & 130023424;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 1073741824;
        default:
          return e;
      }
    }
    function Nt(e, t) {
      var n = e.pendingLanes;
      if (n === 0) return 0;
      var r = 0,
        i = e.suspendedLanes,
        a = e.pingedLanes,
        o = n & 268435455;
      if (o !== 0) {
        var s = o & ~i;
        s === 0 ? ((a &= o), a !== 0 && (r = Mt(a))) : (r = Mt(s));
      } else ((o = n & ~i), o === 0 ? a !== 0 && (r = Mt(a)) : (r = Mt(o)));
      if (r === 0) return 0;
      if (t !== 0 && t !== r && (t & i) === 0 && ((i = r & -r), (a = t & -t), i >= a || (i === 16 && a & 4194240)))
        return t;
      if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
        for (e = e.entanglements, t &= r; 0 < t; ) ((n = 31 - Et(t)), (i = 1 << n), (r |= e[n]), (t &= ~i));
      return r;
    }
    function Pt(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
          return t + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          return -1;
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function Ft(e, t) {
      for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes; 0 < a; ) {
        var o = 31 - Et(a),
          s = 1 << o,
          c = i[o];
        (c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Pt(s, t)) : c <= t && (e.expiredLanes |= s), (a &= ~s));
      }
    }
    function It(e) {
      return ((e = e.pendingLanes & -1073741825), e === 0 ? (e & 1073741824 ? 1073741824 : 0) : e);
    }
    function Lt() {
      var e = At;
      return ((At <<= 1), !(At & 4194240) && (At = 64), e);
    }
    function Rt(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function zt(e, t, n) {
      ((e.pendingLanes |= t),
        t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
        (e = e.eventTimes),
        (t = 31 - Et(t)),
        (e[t] = n));
    }
    function Bt(e, t) {
      var n = e.pendingLanes & ~t;
      ((e.pendingLanes = t),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.expiredLanes &= t),
        (e.mutableReadLanes &= t),
        (e.entangledLanes &= t),
        (t = e.entanglements));
      var r = e.eventTimes;
      for (e = e.expirationTimes; 0 < n; ) {
        var i = 31 - Et(n),
          a = 1 << i;
        ((t[i] = 0), (r[i] = -1), (e[i] = -1), (n &= ~a));
      }
    }
    function Vt(e, t) {
      var n = (e.entangledLanes |= t);
      for (e = e.entanglements; n; ) {
        var r = 31 - Et(n),
          i = 1 << r;
        ((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i));
      }
    }
    var B = 0;
    function Ht(e) {
      return ((e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1);
    }
    var Ut,
      Wt,
      Gt,
      Kt,
      qt,
      Jt = !1,
      Yt = [],
      Xt = null,
      Zt = null,
      Qt = null,
      $t = new Map(),
      en = new Map(),
      tn = [],
      nn =
        `mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit`.split(
          ` `,
        );
    function rn(e, t) {
      switch (e) {
        case `focusin`:
        case `focusout`:
          Xt = null;
          break;
        case `dragenter`:
        case `dragleave`:
          Zt = null;
          break;
        case `mouseover`:
        case `mouseout`:
          Qt = null;
          break;
        case `pointerover`:
        case `pointerout`:
          $t.delete(t.pointerId);
          break;
        case `gotpointercapture`:
        case `lostpointercapture`:
          en.delete(t.pointerId);
      }
    }
    function an(e, t, n, r, i, a) {
      return e === null || e.nativeEvent !== a
        ? ((e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: a, targetContainers: [i] }),
          t !== null && ((t = q(t)), t !== null && Wt(t)),
          e)
        : ((e.eventSystemFlags |= r), (t = e.targetContainers), i !== null && t.indexOf(i) === -1 && t.push(i), e);
    }
    function on(e, t, n, r, i) {
      switch (t) {
        case `focusin`:
          return ((Xt = an(Xt, e, t, n, r, i)), !0);
        case `dragenter`:
          return ((Zt = an(Zt, e, t, n, r, i)), !0);
        case `mouseover`:
          return ((Qt = an(Qt, e, t, n, r, i)), !0);
        case `pointerover`:
          var a = i.pointerId;
          return ($t.set(a, an($t.get(a) || null, e, t, n, r, i)), !0);
        case `gotpointercapture`:
          return ((a = i.pointerId), en.set(a, an(en.get(a) || null, e, t, n, r, i)), !0);
      }
      return !1;
    }
    function sn(e) {
      var t = Fi(e.target);
      if (t !== null) {
        var n = ot(t);
        if (n !== null) {
          if (((t = n.tag), t === 13)) {
            if (((t = st(n)), t !== null)) {
              ((e.blockedOn = t),
                qt(e.priority, function () {
                  Gt(n);
                }));
              return;
            }
          } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
            e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function cn(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var n = yn(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
        if (n === null) {
          n = e.nativeEvent;
          var r = new n.constructor(n.type, n);
          ((Re = r), n.target.dispatchEvent(r), (Re = null));
        } else return ((t = q(n)), t !== null && Wt(t), (e.blockedOn = n), !1);
        t.shift();
      }
      return !0;
    }
    function ln(e, t, n) {
      cn(e) && n.delete(t);
    }
    function un() {
      ((Jt = !1),
        Xt !== null && cn(Xt) && (Xt = null),
        Zt !== null && cn(Zt) && (Zt = null),
        Qt !== null && cn(Qt) && (Qt = null),
        $t.forEach(ln),
        en.forEach(ln));
    }
    function dn(e, t) {
      e.blockedOn === t &&
        ((e.blockedOn = null), Jt || ((Jt = !0), n.unstable_scheduleCallback(n.unstable_NormalPriority, un)));
    }
    function fn(e) {
      function t(t) {
        return dn(t, e);
      }
      if (0 < Yt.length) {
        dn(Yt[0], e);
        for (var n = 1; n < Yt.length; n++) {
          var r = Yt[n];
          r.blockedOn === e && (r.blockedOn = null);
        }
      }
      for (
        Xt !== null && dn(Xt, e),
          Zt !== null && dn(Zt, e),
          Qt !== null && dn(Qt, e),
          $t.forEach(t),
          en.forEach(t),
          n = 0;
        n < tn.length;
        n++
      )
        ((r = tn[n]), r.blockedOn === e && (r.blockedOn = null));
      for (; 0 < tn.length && ((n = tn[0]), n.blockedOn === null); ) (sn(n), n.blockedOn === null && tn.shift());
    }
    var pn = C.ReactCurrentBatchConfig,
      mn = !0;
    function hn(e, t, n, r) {
      var i = B,
        a = pn.transition;
      pn.transition = null;
      try {
        ((B = 1), _n(e, t, n, r));
      } finally {
        ((B = i), (pn.transition = a));
      }
    }
    function gn(e, t, n, r) {
      var i = B,
        a = pn.transition;
      pn.transition = null;
      try {
        ((B = 4), _n(e, t, n, r));
      } finally {
        ((B = i), (pn.transition = a));
      }
    }
    function _n(e, t, n, r) {
      if (mn) {
        var i = yn(e, t, n, r);
        if (i === null) (ci(e, t, r, vn, n), rn(e, r));
        else if (on(i, e, t, n, r)) r.stopPropagation();
        else if ((rn(e, r), t & 4 && -1 < nn.indexOf(e))) {
          for (; i !== null; ) {
            var a = q(i);
            if ((a !== null && Ut(a), (a = yn(e, t, n, r)), a === null && ci(e, t, r, vn, n), a === i)) break;
            i = a;
          }
          i !== null && r.stopPropagation();
        } else ci(e, t, r, null, n);
      }
    }
    var vn = null;
    function yn(e, t, n, r) {
      if (((vn = null), (e = ze(r)), (e = Fi(e)), e !== null))
        if (((t = ot(e)), t === null)) e = null;
        else if (((n = t.tag), n === 13)) {
          if (((e = st(t)), e !== null)) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      return ((vn = e), null);
    }
    function bn(e) {
      switch (e) {
        case `cancel`:
        case `click`:
        case `close`:
        case `contextmenu`:
        case `copy`:
        case `cut`:
        case `auxclick`:
        case `dblclick`:
        case `dragend`:
        case `dragstart`:
        case `drop`:
        case `focusin`:
        case `focusout`:
        case `input`:
        case `invalid`:
        case `keydown`:
        case `keypress`:
        case `keyup`:
        case `mousedown`:
        case `mouseup`:
        case `paste`:
        case `pause`:
        case `play`:
        case `pointercancel`:
        case `pointerdown`:
        case `pointerup`:
        case `ratechange`:
        case `reset`:
        case `resize`:
        case `seeked`:
        case `submit`:
        case `touchcancel`:
        case `touchend`:
        case `touchstart`:
        case `volumechange`:
        case `change`:
        case `selectionchange`:
        case `textInput`:
        case `compositionstart`:
        case `compositionend`:
        case `compositionupdate`:
        case `beforeblur`:
        case `afterblur`:
        case `beforeinput`:
        case `blur`:
        case `fullscreenchange`:
        case `focus`:
        case `hashchange`:
        case `popstate`:
        case `select`:
        case `selectstart`:
          return 1;
        case `drag`:
        case `dragenter`:
        case `dragexit`:
        case `dragleave`:
        case `dragover`:
        case `mousemove`:
        case `mouseout`:
        case `mouseover`:
        case `pointermove`:
        case `pointerout`:
        case `pointerover`:
        case `scroll`:
        case `toggle`:
        case `touchmove`:
        case `wheel`:
        case `mouseenter`:
        case `mouseleave`:
        case `pointerenter`:
        case `pointerleave`:
          return 4;
        case `message`:
          switch (_t()) {
            case vt:
              return 1;
            case yt:
              return 4;
            case bt:
            case xt:
              return 16;
            case St:
              return 536870912;
            default:
              return 16;
          }
        default:
          return 16;
      }
    }
    var xn = null,
      Sn = null,
      Cn = null;
    function wn() {
      if (Cn) return Cn;
      var e,
        t = Sn,
        n = t.length,
        r,
        i = `value` in xn ? xn.value : xn.textContent,
        a = i.length;
      for (e = 0; e < n && t[e] === i[e]; e++);
      var o = n - e;
      for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
      return (Cn = i.slice(e, 1 < r ? 1 - r : void 0));
    }
    function Tn(e) {
      var t = e.keyCode;
      return (
        `charCode` in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function En() {
      return !0;
    }
    function Dn() {
      return !1;
    }
    function On(e) {
      function t(t, n, r, i, a) {
        for (var o in ((this._reactName = t),
        (this._targetInst = r),
        (this.type = n),
        (this.nativeEvent = i),
        (this.target = a),
        (this.currentTarget = null),
        e))
          e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(i) : i[o]));
        return (
          (this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented)
            ? En
            : Dn),
          (this.isPropagationStopped = Dn),
          this
        );
      }
      return (
        F(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var e = this.nativeEvent;
            e &&
              (e.preventDefault ? e.preventDefault() : typeof e.returnValue != `unknown` && (e.returnValue = !1),
              (this.isDefaultPrevented = En));
          },
          stopPropagation: function () {
            var e = this.nativeEvent;
            e &&
              (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != `unknown` && (e.cancelBubble = !0),
              (this.isPropagationStopped = En));
          },
          persist: function () {},
          isPersistent: En,
        }),
        t
      );
    }
    var kn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      An = On(kn),
      jn = F({}, kn, { view: 0, detail: 0 }),
      Mn = On(jn),
      Nn,
      Pn,
      Fn,
      In = F({}, jn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Kn,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return e.relatedTarget === void 0
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return `movementX` in e
            ? e.movementX
            : (e !== Fn &&
                (Fn && e.type === `mousemove`
                  ? ((Nn = e.screenX - Fn.screenX), (Pn = e.screenY - Fn.screenY))
                  : (Pn = Nn = 0),
                (Fn = e)),
              Nn);
        },
        movementY: function (e) {
          return `movementY` in e ? e.movementY : Pn;
        },
      }),
      Ln = On(In),
      Rn = On(F({}, In, { dataTransfer: 0 })),
      zn = On(F({}, jn, { relatedTarget: 0 })),
      Bn = On(F({}, kn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 })),
      V = On(
        F({}, kn, {
          clipboardData: function (e) {
            return `clipboardData` in e ? e.clipboardData : window.clipboardData;
          },
        }),
      ),
      Vn = On(F({}, kn, { data: 0 })),
      Hn = {
        Esc: `Escape`,
        Spacebar: ` `,
        Left: `ArrowLeft`,
        Up: `ArrowUp`,
        Right: `ArrowRight`,
        Down: `ArrowDown`,
        Del: `Delete`,
        Win: `OS`,
        Menu: `ContextMenu`,
        Apps: `ContextMenu`,
        Scroll: `ScrollLock`,
        MozPrintableKey: `Unidentified`,
      },
      Un = {
        8: `Backspace`,
        9: `Tab`,
        12: `Clear`,
        13: `Enter`,
        16: `Shift`,
        17: `Control`,
        18: `Alt`,
        19: `Pause`,
        20: `CapsLock`,
        27: `Escape`,
        32: ` `,
        33: `PageUp`,
        34: `PageDown`,
        35: `End`,
        36: `Home`,
        37: `ArrowLeft`,
        38: `ArrowUp`,
        39: `ArrowRight`,
        40: `ArrowDown`,
        45: `Insert`,
        46: `Delete`,
        112: `F1`,
        113: `F2`,
        114: `F3`,
        115: `F4`,
        116: `F5`,
        117: `F6`,
        118: `F7`,
        119: `F8`,
        120: `F9`,
        121: `F10`,
        122: `F11`,
        123: `F12`,
        144: `NumLock`,
        145: `ScrollLock`,
        224: `Meta`,
      },
      Wn = { Alt: `altKey`, Control: `ctrlKey`, Meta: `metaKey`, Shift: `shiftKey` };
    function Gn(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : (e = Wn[e]) ? !!t[e] : !1;
    }
    function Kn() {
      return Gn;
    }
    var qn = On(
        F({}, jn, {
          key: function (e) {
            if (e.key) {
              var t = Hn[e.key] || e.key;
              if (t !== `Unidentified`) return t;
            }
            return e.type === `keypress`
              ? ((e = Tn(e)), e === 13 ? `Enter` : String.fromCharCode(e))
              : e.type === `keydown` || e.type === `keyup`
                ? Un[e.keyCode] || `Unidentified`
                : ``;
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: Kn,
          charCode: function (e) {
            return e.type === `keypress` ? Tn(e) : 0;
          },
          keyCode: function (e) {
            return e.type === `keydown` || e.type === `keyup` ? e.keyCode : 0;
          },
          which: function (e) {
            return e.type === `keypress` ? Tn(e) : e.type === `keydown` || e.type === `keyup` ? e.keyCode : 0;
          },
        }),
      ),
      Jn = On(
        F({}, In, {
          pointerId: 0,
          width: 0,
          height: 0,
          pressure: 0,
          tangentialPressure: 0,
          tiltX: 0,
          tiltY: 0,
          twist: 0,
          pointerType: 0,
          isPrimary: 0,
        }),
      ),
      Yn = On(
        F({}, jn, {
          touches: 0,
          targetTouches: 0,
          changedTouches: 0,
          altKey: 0,
          metaKey: 0,
          ctrlKey: 0,
          shiftKey: 0,
          getModifierState: Kn,
        }),
      ),
      Xn = On(F({}, kn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
      Zn = On(
        F({}, In, {
          deltaX: function (e) {
            return `deltaX` in e ? e.deltaX : `wheelDeltaX` in e ? -e.wheelDeltaX : 0;
          },
          deltaY: function (e) {
            return `deltaY` in e
              ? e.deltaY
              : `wheelDeltaY` in e
                ? -e.wheelDeltaY
                : `wheelDelta` in e
                  ? -e.wheelDelta
                  : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
        }),
      ),
      Qn = [9, 13, 27, 32],
      $n = c && `CompositionEvent` in window,
      er = null;
    c && `documentMode` in document && (er = document.documentMode);
    var tr = c && `TextEvent` in window && !er,
      H = c && (!$n || (er && 8 < er && 11 >= er)),
      nr = ` `,
      rr = !1;
    function ir(e, t) {
      switch (e) {
        case `keyup`:
          return Qn.indexOf(t.keyCode) !== -1;
        case `keydown`:
          return t.keyCode !== 229;
        case `keypress`:
        case `mousedown`:
        case `focusout`:
          return !0;
        default:
          return !1;
      }
    }
    function ar(e) {
      return ((e = e.detail), typeof e == `object` && `data` in e ? e.data : null);
    }
    var or = !1;
    function sr(e, t) {
      switch (e) {
        case `compositionend`:
          return ar(t);
        case `keypress`:
          return t.which === 32 ? ((rr = !0), nr) : null;
        case `textInput`:
          return ((e = t.data), e === nr && rr ? null : e);
        default:
          return null;
      }
    }
    function cr(e, t) {
      if (or)
        return e === `compositionend` || (!$n && ir(e, t)) ? ((e = wn()), (Cn = Sn = xn = null), (or = !1), e) : null;
      switch (e) {
        case `paste`:
          return null;
        case `keypress`:
          if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case `compositionend`:
          return H && t.locale !== `ko` ? null : t.data;
        default:
          return null;
      }
    }
    var lr = {
      color: !0,
      date: !0,
      datetime: !0,
      'datetime-local': !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function ur(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === `input` ? !!lr[e.type] : t === `textarea`;
    }
    function dr(e, t, n, r) {
      (We(r),
        (t = ui(t, `onChange`)),
        0 < t.length && ((n = new An(`onChange`, `change`, null, n, r)), e.push({ event: n, listeners: t })));
    }
    var fr = null,
      pr = null;
    function mr(e) {
      ri(e, 0);
    }
    function hr(e) {
      if (pe(Ii(e))) return e;
    }
    function gr(e, t) {
      if (e === `change`) return t;
    }
    var _r = !1;
    if (c) {
      var vr;
      if (c) {
        var yr = `oninput` in document;
        if (!yr) {
          var br = document.createElement(`div`);
          (br.setAttribute(`oninput`, `return;`), (yr = typeof br.oninput == `function`));
        }
        vr = yr;
      } else vr = !1;
      _r = vr && (!document.documentMode || 9 < document.documentMode);
    }
    function xr() {
      fr && (fr.detachEvent(`onpropertychange`, Sr), (pr = fr = null));
    }
    function Sr(e) {
      if (e.propertyName === `value` && hr(pr)) {
        var t = [];
        (dr(t, pr, e, ze(e)), Ye(mr, t));
      }
    }
    function Cr(e, t, n) {
      e === `focusin` ? (xr(), (fr = t), (pr = n), fr.attachEvent(`onpropertychange`, Sr)) : e === `focusout` && xr();
    }
    function wr(e) {
      if (e === `selectionchange` || e === `keyup` || e === `keydown`) return hr(pr);
    }
    function Tr(e, t) {
      if (e === `click`) return hr(t);
    }
    function Er(e, t) {
      if (e === `input` || e === `change`) return hr(t);
    }
    function Dr(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var Or = typeof Object.is == `function` ? Object.is : Dr;
    function kr(e, t) {
      if (Or(e, t)) return !0;
      if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
      var n = Object.keys(e),
        r = Object.keys(t);
      if (n.length !== r.length) return !1;
      for (r = 0; r < n.length; r++) {
        var i = n[r];
        if (!l.call(t, i) || !Or(e[i], t[i])) return !1;
      }
      return !0;
    }
    function Ar(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function jr(e, t) {
      var n = Ar(e);
      e = 0;
      for (var r; n; ) {
        if (n.nodeType === 3) {
          if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e };
          e = r;
        }
        a: {
          for (; n; ) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break a;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = Ar(n);
      }
    }
    function Mr(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? Mr(e, t.parentNode)
              : `contains` in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Nr() {
      for (var e = window, t = me(); t instanceof e.HTMLIFrameElement; ) {
        try {
          var n = typeof t.contentWindow.location.href == `string`;
        } catch {
          n = !1;
        }
        if (n) e = t.contentWindow;
        else break;
        t = me(e.document);
      }
      return t;
    }
    function Pr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        ((t === `input` &&
          (e.type === `text` ||
            e.type === `search` ||
            e.type === `tel` ||
            e.type === `url` ||
            e.type === `password`)) ||
          t === `textarea` ||
          e.contentEditable === `true`)
      );
    }
    function Fr(e) {
      var t = Nr(),
        n = e.focusedElem,
        r = e.selectionRange;
      if (t !== n && n && n.ownerDocument && Mr(n.ownerDocument.documentElement, n)) {
        if (r !== null && Pr(n)) {
          if (((t = r.start), (e = r.end), e === void 0 && (e = t), `selectionStart` in n))
            ((n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length)));
          else if (((e = ((t = n.ownerDocument || document) && t.defaultView) || window), e.getSelection)) {
            e = e.getSelection();
            var i = n.textContent.length,
              a = Math.min(r.start, i);
            ((r = r.end === void 0 ? a : Math.min(r.end, i)),
              !e.extend && a > r && ((i = r), (r = a), (a = i)),
              (i = jr(n, a)));
            var o = jr(n, r);
            i &&
              o &&
              (e.rangeCount !== 1 ||
                e.anchorNode !== i.node ||
                e.anchorOffset !== i.offset ||
                e.focusNode !== o.node ||
                e.focusOffset !== o.offset) &&
              ((t = t.createRange()),
              t.setStart(i.node, i.offset),
              e.removeAllRanges(),
              a > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
          }
        }
        for (t = [], e = n; (e = e.parentNode); )
          e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
        for (typeof n.focus == `function` && n.focus(), n = 0; n < t.length; n++)
          ((e = t[n]), (e.element.scrollLeft = e.left), (e.element.scrollTop = e.top));
      }
    }
    var U = c && `documentMode` in document && 11 >= document.documentMode,
      Ir = null,
      Lr = null,
      Rr = null,
      zr = !1;
    function Br(e, t, n) {
      var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
      zr ||
        Ir == null ||
        Ir !== me(r) ||
        ((r = Ir),
        `selectionStart` in r && Pr(r)
          ? (r = { start: r.selectionStart, end: r.selectionEnd })
          : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
            (r = {
              anchorNode: r.anchorNode,
              anchorOffset: r.anchorOffset,
              focusNode: r.focusNode,
              focusOffset: r.focusOffset,
            })),
        (Rr && kr(Rr, r)) ||
          ((Rr = r),
          (r = ui(Lr, `onSelect`)),
          0 < r.length &&
            ((t = new An(`onSelect`, `select`, null, t, n)), e.push({ event: t, listeners: r }), (t.target = Ir))));
    }
    function Vr(e, t) {
      var n = {};
      return ((n[e.toLowerCase()] = t.toLowerCase()), (n[`Webkit` + e] = `webkit` + t), (n[`Moz` + e] = `moz` + t), n);
    }
    var Hr = {
        animationend: Vr(`Animation`, `AnimationEnd`),
        animationiteration: Vr(`Animation`, `AnimationIteration`),
        animationstart: Vr(`Animation`, `AnimationStart`),
        transitionend: Vr(`Transition`, `TransitionEnd`),
      },
      Ur = {},
      Wr = {};
    c &&
      ((Wr = document.createElement(`div`).style),
      `AnimationEvent` in window ||
        (delete Hr.animationend.animation, delete Hr.animationiteration.animation, delete Hr.animationstart.animation),
      `TransitionEvent` in window || delete Hr.transitionend.transition);
    function Gr(e) {
      if (Ur[e]) return Ur[e];
      if (!Hr[e]) return e;
      var t = Hr[e],
        n;
      for (n in t) if (t.hasOwnProperty(n) && n in Wr) return (Ur[e] = t[n]);
      return e;
    }
    var Kr = Gr(`animationend`),
      qr = Gr(`animationiteration`),
      Jr = Gr(`animationstart`),
      W = Gr(`transitionend`),
      Yr = new Map(),
      Xr =
        `abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
          ` `,
        );
    function Zr(e, t) {
      (Yr.set(e, t), o(t, [e]));
    }
    for (var Qr = 0; Qr < Xr.length; Qr++) {
      var $r = Xr[Qr];
      Zr($r.toLowerCase(), `on` + ($r[0].toUpperCase() + $r.slice(1)));
    }
    (Zr(Kr, `onAnimationEnd`),
      Zr(qr, `onAnimationIteration`),
      Zr(Jr, `onAnimationStart`),
      Zr(`dblclick`, `onDoubleClick`),
      Zr(`focusin`, `onFocus`),
      Zr(`focusout`, `onBlur`),
      Zr(W, `onTransitionEnd`),
      s(`onMouseEnter`, [`mouseout`, `mouseover`]),
      s(`onMouseLeave`, [`mouseout`, `mouseover`]),
      s(`onPointerEnter`, [`pointerout`, `pointerover`]),
      s(`onPointerLeave`, [`pointerout`, `pointerover`]),
      o(`onChange`, `change click focusin focusout input keydown keyup selectionchange`.split(` `)),
      o(`onSelect`, `focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),
      o(`onBeforeInput`, [`compositionend`, `keypress`, `textInput`, `paste`]),
      o(`onCompositionEnd`, `compositionend focusout keydown keypress keyup mousedown`.split(` `)),
      o(`onCompositionStart`, `compositionstart focusout keydown keypress keyup mousedown`.split(` `)),
      o(`onCompositionUpdate`, `compositionupdate focusout keydown keypress keyup mousedown`.split(` `)));
    var ei =
        `abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
          ` `,
        ),
      ti = new Set(`cancel close invalid load scroll toggle`.split(` `).concat(ei));
    function ni(e, t, n) {
      var r = e.type || `unknown-event`;
      ((e.currentTarget = n), at(r, t, void 0, e), (e.currentTarget = null));
    }
    function ri(e, t) {
      t = (t & 4) != 0;
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          i = r.event;
        r = r.listeners;
        a: {
          var a = void 0;
          if (t)
            for (var o = r.length - 1; 0 <= o; o--) {
              var s = r[o],
                c = s.instance,
                l = s.currentTarget;
              if (((s = s.listener), c !== a && i.isPropagationStopped())) break a;
              (ni(i, s, l), (a = c));
            }
          else
            for (o = 0; o < r.length; o++) {
              if (
                ((s = r[o]),
                (c = s.instance),
                (l = s.currentTarget),
                (s = s.listener),
                c !== a && i.isPropagationStopped())
              )
                break a;
              (ni(i, s, l), (a = c));
            }
        }
      }
      if (tt) throw ((e = nt), (tt = !1), (nt = null), e);
    }
    function G(e, t) {
      var n = t[Mi];
      n === void 0 && (n = t[Mi] = new Set());
      var r = e + `__bubble`;
      n.has(r) || (si(t, e, 2, !1), n.add(r));
    }
    function ii(e, t, n) {
      var r = 0;
      (t && (r |= 4), si(n, e, r, t));
    }
    var ai = `_reactListening` + Math.random().toString(36).slice(2);
    function oi(e) {
      if (!e[ai]) {
        ((e[ai] = !0),
          i.forEach(function (t) {
            t !== `selectionchange` && (ti.has(t) || ii(t, !1, e), ii(t, !0, e));
          }));
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[ai] || ((t[ai] = !0), ii(`selectionchange`, !1, t));
      }
    }
    function si(e, t, n, r) {
      switch (bn(t)) {
        case 1:
          var i = hn;
          break;
        case 4:
          i = gn;
          break;
        default:
          i = _n;
      }
      ((n = i.bind(null, t, n, e)),
        (i = void 0),
        !Ze || (t !== `touchstart` && t !== `touchmove` && t !== `wheel`) || (i = !0),
        r
          ? i === void 0
            ? e.addEventListener(t, n, !0)
            : e.addEventListener(t, n, { capture: !0, passive: i })
          : i === void 0
            ? e.addEventListener(t, n, !1)
            : e.addEventListener(t, n, { passive: i }));
    }
    function ci(e, t, n, r, i) {
      var a = r;
      if (!(t & 1) && !(t & 2) && r !== null)
        a: for (;;) {
          if (r === null) return;
          var o = r.tag;
          if (o === 3 || o === 4) {
            var s = r.stateNode.containerInfo;
            if (s === i || (s.nodeType === 8 && s.parentNode === i)) break;
            if (o === 4)
              for (o = r.return; o !== null; ) {
                var c = o.tag;
                if (
                  (c === 3 || c === 4) &&
                  ((c = o.stateNode.containerInfo), c === i || (c.nodeType === 8 && c.parentNode === i))
                )
                  return;
                o = o.return;
              }
            for (; s !== null; ) {
              if (((o = Fi(s)), o === null)) return;
              if (((c = o.tag), c === 5 || c === 6)) {
                r = a = o;
                continue a;
              }
              s = s.parentNode;
            }
          }
          r = r.return;
        }
      Ye(function () {
        var r = a,
          i = ze(n),
          o = [];
        a: {
          var s = Yr.get(e);
          if (s !== void 0) {
            var c = An,
              l = e;
            switch (e) {
              case `keypress`:
                if (Tn(n) === 0) break a;
              case `keydown`:
              case `keyup`:
                c = qn;
                break;
              case `focusin`:
                ((l = `focus`), (c = zn));
                break;
              case `focusout`:
                ((l = `blur`), (c = zn));
                break;
              case `beforeblur`:
              case `afterblur`:
                c = zn;
                break;
              case `click`:
                if (n.button === 2) break a;
              case `auxclick`:
              case `dblclick`:
              case `mousedown`:
              case `mousemove`:
              case `mouseup`:
              case `mouseout`:
              case `mouseover`:
              case `contextmenu`:
                c = Ln;
                break;
              case `drag`:
              case `dragend`:
              case `dragenter`:
              case `dragexit`:
              case `dragleave`:
              case `dragover`:
              case `dragstart`:
              case `drop`:
                c = Rn;
                break;
              case `touchcancel`:
              case `touchend`:
              case `touchmove`:
              case `touchstart`:
                c = Yn;
                break;
              case Kr:
              case qr:
              case Jr:
                c = Bn;
                break;
              case W:
                c = Xn;
                break;
              case `scroll`:
                c = Mn;
                break;
              case `wheel`:
                c = Zn;
                break;
              case `copy`:
              case `cut`:
              case `paste`:
                c = V;
                break;
              case `gotpointercapture`:
              case `lostpointercapture`:
              case `pointercancel`:
              case `pointerdown`:
              case `pointermove`:
              case `pointerout`:
              case `pointerover`:
              case `pointerup`:
                c = Jn;
            }
            var u = (t & 4) != 0,
              d = !u && e === `scroll`,
              f = u ? (s === null ? null : s + `Capture`) : s;
            u = [];
            for (var p = r, m; p !== null; ) {
              m = p;
              var h = m.stateNode;
              if (
                (m.tag === 5 &&
                  h !== null &&
                  ((m = h), f !== null && ((h = Xe(p, f)), h != null && u.push(li(p, h, m)))),
                d)
              )
                break;
              p = p.return;
            }
            0 < u.length && ((s = new c(s, l, null, n, i)), o.push({ event: s, listeners: u }));
          }
        }
        if (!(t & 7)) {
          a: {
            if (
              ((s = e === `mouseover` || e === `pointerover`),
              (c = e === `mouseout` || e === `pointerout`),
              s && n !== Re && (l = n.relatedTarget || n.fromElement) && (Fi(l) || l[ji]))
            )
              break a;
            if (
              (c || s) &&
              ((s = i.window === i ? i : (s = i.ownerDocument) ? s.defaultView || s.parentWindow : window),
              c
                ? ((l = n.relatedTarget || n.toElement),
                  (c = r),
                  (l = l ? Fi(l) : null),
                  l !== null && ((d = ot(l)), l !== d || (l.tag !== 5 && l.tag !== 6)) && (l = null))
                : ((c = null), (l = r)),
              c !== l)
            ) {
              if (
                ((u = Ln),
                (h = `onMouseLeave`),
                (f = `onMouseEnter`),
                (p = `mouse`),
                (e === `pointerout` || e === `pointerover`) &&
                  ((u = Jn), (h = `onPointerLeave`), (f = `onPointerEnter`), (p = `pointer`)),
                (d = c == null ? s : Ii(c)),
                (m = l == null ? s : Ii(l)),
                (s = new u(h, p + `leave`, c, n, i)),
                (s.target = d),
                (s.relatedTarget = m),
                (h = null),
                Fi(i) === r && ((u = new u(f, p + `enter`, l, n, i)), (u.target = m), (u.relatedTarget = d), (h = u)),
                (d = h),
                c && l)
              )
                b: {
                  for (u = c, f = l, p = 0, m = u; m; m = di(m)) p++;
                  for (m = 0, h = f; h; h = di(h)) m++;
                  for (; 0 < p - m; ) ((u = di(u)), p--);
                  for (; 0 < m - p; ) ((f = di(f)), m--);
                  for (; p--; ) {
                    if (u === f || (f !== null && u === f.alternate)) break b;
                    ((u = di(u)), (f = di(f)));
                  }
                  u = null;
                }
              else u = null;
              (c !== null && fi(o, s, c, u, !1), l !== null && d !== null && fi(o, d, l, u, !0));
            }
          }
          a: {
            if (
              ((s = r ? Ii(r) : window),
              (c = s.nodeName && s.nodeName.toLowerCase()),
              c === `select` || (c === `input` && s.type === `file`))
            )
              var g = gr;
            else if (ur(s))
              if (_r) g = Er;
              else {
                g = wr;
                var _ = Cr;
              }
            else
              (c = s.nodeName) &&
                c.toLowerCase() === `input` &&
                (s.type === `checkbox` || s.type === `radio`) &&
                (g = Tr);
            if ((g &&= g(e, r))) {
              dr(o, g, n, i);
              break a;
            }
            (_ && _(e, s, r),
              e === `focusout` &&
                (_ = s._wrapperState) &&
                _.controlled &&
                s.type === `number` &&
                ye(s, `number`, s.value));
          }
          switch (((_ = r ? Ii(r) : window), e)) {
            case `focusin`:
              (ur(_) || _.contentEditable === `true`) && ((Ir = _), (Lr = r), (Rr = null));
              break;
            case `focusout`:
              Rr = Lr = Ir = null;
              break;
            case `mousedown`:
              zr = !0;
              break;
            case `contextmenu`:
            case `mouseup`:
            case `dragend`:
              ((zr = !1), Br(o, n, i));
              break;
            case `selectionchange`:
              if (U) break;
            case `keydown`:
            case `keyup`:
              Br(o, n, i);
          }
          var v;
          if ($n)
            b: {
              switch (e) {
                case `compositionstart`:
                  var y = `onCompositionStart`;
                  break b;
                case `compositionend`:
                  y = `onCompositionEnd`;
                  break b;
                case `compositionupdate`:
                  y = `onCompositionUpdate`;
                  break b;
              }
              y = void 0;
            }
          else
            or
              ? ir(e, n) && (y = `onCompositionEnd`)
              : e === `keydown` && n.keyCode === 229 && (y = `onCompositionStart`);
          (y &&
            (H &&
              n.locale !== `ko` &&
              (or || y !== `onCompositionStart`
                ? y === `onCompositionEnd` && or && (v = wn())
                : ((xn = i), (Sn = `value` in xn ? xn.value : xn.textContent), (or = !0))),
            (_ = ui(r, y)),
            0 < _.length &&
              ((y = new Vn(y, e, null, n, i)),
              o.push({ event: y, listeners: _ }),
              v ? (y.data = v) : ((v = ar(n)), v !== null && (y.data = v)))),
            (v = tr ? sr(e, n) : cr(e, n)) &&
              ((r = ui(r, `onBeforeInput`)),
              0 < r.length &&
                ((i = new Vn(`onBeforeInput`, `beforeinput`, null, n, i)),
                o.push({ event: i, listeners: r }),
                (i.data = v))));
        }
        ri(o, t);
      });
    }
    function li(e, t, n) {
      return { instance: e, listener: t, currentTarget: n };
    }
    function ui(e, t) {
      for (var n = t + `Capture`, r = []; e !== null; ) {
        var i = e,
          a = i.stateNode;
        (i.tag === 5 &&
          a !== null &&
          ((i = a),
          (a = Xe(e, n)),
          a != null && r.unshift(li(e, a, i)),
          (a = Xe(e, t)),
          a != null && r.push(li(e, a, i))),
          (e = e.return));
      }
      return r;
    }
    function di(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5);
      return e || null;
    }
    function fi(e, t, n, r, i) {
      for (var a = t._reactName, o = []; n !== null && n !== r; ) {
        var s = n,
          c = s.alternate,
          l = s.stateNode;
        if (c !== null && c === r) break;
        (s.tag === 5 &&
          l !== null &&
          ((s = l),
          i
            ? ((c = Xe(n, a)), c != null && o.unshift(li(n, c, s)))
            : i || ((c = Xe(n, a)), c != null && o.push(li(n, c, s)))),
          (n = n.return));
      }
      o.length !== 0 && e.push({ event: t, listeners: o });
    }
    var pi = /\r\n?/g,
      mi = /\u0000|\uFFFD/g;
    function hi(e) {
      return (typeof e == `string` ? e : `` + e)
        .replace(
          pi,
          `
`,
        )
        .replace(mi, ``);
    }
    function gi(e, t, n) {
      if (((t = hi(t)), hi(e) !== t && n)) throw Error(r(425));
    }
    function _i() {}
    var vi = null,
      yi = null;
    function bi(e, t) {
      return (
        e === `textarea` ||
        e === `noscript` ||
        typeof t.children == `string` ||
        typeof t.children == `number` ||
        (typeof t.dangerouslySetInnerHTML == `object` &&
          t.dangerouslySetInnerHTML !== null &&
          t.dangerouslySetInnerHTML.__html != null)
      );
    }
    var xi = typeof setTimeout == `function` ? setTimeout : void 0,
      Si = typeof clearTimeout == `function` ? clearTimeout : void 0,
      Ci = typeof Promise == `function` ? Promise : void 0,
      wi =
        typeof queueMicrotask == `function`
          ? queueMicrotask
          : Ci === void 0
            ? xi
            : function (e) {
                return Ci.resolve(null).then(e).catch(Ti);
              };
    function Ti(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function Ei(e, t) {
      var n = t,
        r = 0;
      do {
        var i = n.nextSibling;
        if ((e.removeChild(n), i && i.nodeType === 8))
          if (((n = i.data), n === `/$`)) {
            if (r === 0) {
              (e.removeChild(i), fn(t));
              return;
            }
            r--;
          } else (n !== `$` && n !== `$?` && n !== `$!`) || r++;
        n = i;
      } while (n);
      fn(t);
    }
    function Di(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (((t = e.data), t === `$` || t === `$!` || t === `$?`)) break;
          if (t === `/$`) return null;
        }
      }
      return e;
    }
    function K(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === `$` || n === `$!` || n === `$?`) {
            if (t === 0) return e;
            t--;
          } else n === `/$` && t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    var Oi = Math.random().toString(36).slice(2),
      ki = `__reactFiber$` + Oi,
      Ai = `__reactProps$` + Oi,
      ji = `__reactContainer$` + Oi,
      Mi = `__reactEvents$` + Oi,
      Ni = `__reactListeners$` + Oi,
      Pi = `__reactHandles$` + Oi;
    function Fi(e) {
      var t = e[ki];
      if (t) return t;
      for (var n = e.parentNode; n; ) {
        if ((t = n[ji] || n[ki])) {
          if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
            for (e = K(e); e !== null; ) {
              if ((n = e[ki])) return n;
              e = K(e);
            }
          return t;
        }
        ((e = n), (n = e.parentNode));
      }
      return null;
    }
    function q(e) {
      return ((e = e[ki] || e[ji]), !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e);
    }
    function Ii(e) {
      if (e.tag === 5 || e.tag === 6) return e.stateNode;
      throw Error(r(33));
    }
    function J(e) {
      return e[Ai] || null;
    }
    var Li = [],
      Ri = -1;
    function zi(e) {
      return { current: e };
    }
    function Bi(e) {
      0 > Ri || ((e.current = Li[Ri]), (Li[Ri] = null), Ri--);
    }
    function Y(e, t) {
      (Ri++, (Li[Ri] = e.current), (e.current = t));
    }
    var Vi = {},
      Hi = zi(Vi),
      Ui = zi(!1),
      Wi = Vi;
    function Gi(e, t) {
      var n = e.type.contextTypes;
      if (!n) return Vi;
      var r = e.stateNode;
      if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
      var i = {},
        a;
      for (a in n) i[a] = t[a];
      return (
        r &&
          ((e = e.stateNode),
          (e.__reactInternalMemoizedUnmaskedChildContext = t),
          (e.__reactInternalMemoizedMaskedChildContext = i)),
        i
      );
    }
    function Ki(e) {
      return ((e = e.childContextTypes), e != null);
    }
    function qi() {
      (Bi(Ui), Bi(Hi));
    }
    function Ji(e, t, n) {
      if (Hi.current !== Vi) throw Error(r(168));
      (Y(Hi, t), Y(Ui, n));
    }
    function Yi(e, t, n) {
      var i = e.stateNode;
      if (((t = t.childContextTypes), typeof i.getChildContext != `function`)) return n;
      for (var a in ((i = i.getChildContext()), i)) if (!(a in t)) throw Error(r(108, ue(e) || `Unknown`, a));
      return F({}, n, i);
    }
    function Xi(e) {
      return (
        (e = ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Vi),
        (Wi = Hi.current),
        Y(Hi, e),
        Y(Ui, Ui.current),
        !0
      );
    }
    function Zi(e, t, n) {
      var i = e.stateNode;
      if (!i) throw Error(r(169));
      (n ? ((e = Yi(e, t, Wi)), (i.__reactInternalMemoizedMergedChildContext = e), Bi(Ui), Bi(Hi), Y(Hi, e)) : Bi(Ui),
        Y(Ui, n));
    }
    var Qi = null,
      $i = !1,
      ea = !1;
    function ta(e) {
      Qi === null ? (Qi = [e]) : Qi.push(e);
    }
    function na(e) {
      (($i = !0), ta(e));
    }
    function ra() {
      if (!ea && Qi !== null) {
        ea = !0;
        var e = 0,
          t = B;
        try {
          var n = Qi;
          for (B = 1; e < n.length; e++) {
            var r = n[e];
            do r = r(!0);
            while (r !== null);
          }
          ((Qi = null), ($i = !1));
        } catch (t) {
          throw (Qi !== null && (Qi = Qi.slice(e + 1)), ft(vt, ra), t);
        } finally {
          ((B = t), (ea = !1));
        }
      }
      return null;
    }
    var ia = [],
      aa = 0,
      oa = null,
      sa = 0,
      ca = [],
      la = 0,
      ua = null,
      da = 1,
      fa = ``;
    function pa(e, t) {
      ((ia[aa++] = sa), (ia[aa++] = oa), (oa = e), (sa = t));
    }
    function ma(e, t, n) {
      ((ca[la++] = da), (ca[la++] = fa), (ca[la++] = ua), (ua = e));
      var r = da;
      e = fa;
      var i = 32 - Et(r) - 1;
      ((r &= ~(1 << i)), (n += 1));
      var a = 32 - Et(t) + i;
      if (30 < a) {
        var o = i - (i % 5);
        ((a = (r & ((1 << o) - 1)).toString(32)),
          (r >>= o),
          (i -= o),
          (da = (1 << (32 - Et(t) + i)) | (n << i) | r),
          (fa = a + e));
      } else ((da = (1 << a) | (n << i) | r), (fa = e));
    }
    function ha(e) {
      e.return !== null && (pa(e, 1), ma(e, 1, 0));
    }
    function ga(e) {
      for (; e === oa; ) ((oa = ia[--aa]), (ia[aa] = null), (sa = ia[--aa]), (ia[aa] = null));
      for (; e === ua; )
        ((ua = ca[--la]), (ca[la] = null), (fa = ca[--la]), (ca[la] = null), (da = ca[--la]), (ca[la] = null));
    }
    var _a = null,
      va = null,
      ya = !1,
      ba = null;
    function xa(e, t) {
      var n = Kl(5, null, null, 0);
      ((n.elementType = `DELETED`),
        (n.stateNode = t),
        (n.return = e),
        (t = e.deletions),
        t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
    }
    function Sa(e, t) {
      switch (e.tag) {
        case 5:
          var n = e.type;
          return (
            (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t),
            t === null ? !1 : ((e.stateNode = t), (_a = e), (va = Di(t.firstChild)), !0)
          );
        case 6:
          return (
            (t = e.pendingProps === `` || t.nodeType !== 3 ? null : t),
            t === null ? !1 : ((e.stateNode = t), (_a = e), (va = null), !0)
          );
        case 13:
          return (
            (t = t.nodeType === 8 ? t : null),
            t === null
              ? !1
              : ((n = ua === null ? null : { id: da, overflow: fa }),
                (e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }),
                (n = Kl(18, null, null, 0)),
                (n.stateNode = t),
                (n.return = e),
                (e.child = n),
                (_a = e),
                (va = null),
                !0)
          );
        default:
          return !1;
      }
    }
    function Ca(e) {
      return (e.mode & 1) != 0 && (e.flags & 128) == 0;
    }
    function wa(e) {
      if (ya) {
        var t = va;
        if (t) {
          var n = t;
          if (!Sa(e, t)) {
            if (Ca(e)) throw Error(r(418));
            t = Di(n.nextSibling);
            var i = _a;
            t && Sa(e, t) ? xa(i, n) : ((e.flags = (e.flags & -4097) | 2), (ya = !1), (_a = e));
          }
        } else {
          if (Ca(e)) throw Error(r(418));
          ((e.flags = (e.flags & -4097) | 2), (ya = !1), (_a = e));
        }
      }
    }
    function Ta(e) {
      for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
      _a = e;
    }
    function Ea(e) {
      if (e !== _a) return !1;
      if (!ya) return (Ta(e), (ya = !0), !1);
      var t;
      if (
        ((t = e.tag !== 3) &&
          !(t = e.tag !== 5) &&
          ((t = e.type), (t = t !== `head` && t !== `body` && !bi(e.type, e.memoizedProps))),
        (t &&= va))
      ) {
        if (Ca(e)) throw (X(), Error(r(418)));
        for (; t; ) (xa(e, t), (t = Di(t.nextSibling)));
      }
      if ((Ta(e), e.tag === 13)) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e)) throw Error(r(317));
        a: {
          for (e = e.nextSibling, t = 0; e; ) {
            if (e.nodeType === 8) {
              var n = e.data;
              if (n === `/$`) {
                if (t === 0) {
                  va = Di(e.nextSibling);
                  break a;
                }
                t--;
              } else (n !== `$` && n !== `$!` && n !== `$?`) || t++;
            }
            e = e.nextSibling;
          }
          va = null;
        }
      } else va = _a ? Di(e.stateNode.nextSibling) : null;
      return !0;
    }
    function X() {
      for (var e = va; e; ) e = Di(e.nextSibling);
    }
    function Da() {
      ((va = _a = null), (ya = !1));
    }
    function Oa(e) {
      ba === null ? (ba = [e]) : ba.push(e);
    }
    var ka = C.ReactCurrentBatchConfig;
    function Aa(e, t, n) {
      if (((e = n.ref), e !== null && typeof e != `function` && typeof e != `object`)) {
        if (n._owner) {
          if (((n = n._owner), n)) {
            if (n.tag !== 1) throw Error(r(309));
            var i = n.stateNode;
          }
          if (!i) throw Error(r(147, e));
          var a = i,
            o = `` + e;
          return t !== null && t.ref !== null && typeof t.ref == `function` && t.ref._stringRef === o
            ? t.ref
            : ((t = function (e) {
                var t = a.refs;
                e === null ? delete t[o] : (t[o] = e);
              }),
              (t._stringRef = o),
              t);
        }
        if (typeof e != `string`) throw Error(r(284));
        if (!n._owner) throw Error(r(290, e));
      }
      return e;
    }
    function ja(e, t) {
      throw (
        (e = Object.prototype.toString.call(t)),
        Error(r(31, e === `[object Object]` ? `object with keys {` + Object.keys(t).join(`, `) + `}` : e))
      );
    }
    function Ma(e) {
      var t = e._init;
      return t(e._payload);
    }
    function Na(e) {
      function t(t, n) {
        if (e) {
          var r = t.deletions;
          r === null ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
        }
      }
      function n(n, r) {
        if (!e) return null;
        for (; r !== null; ) (t(n, r), (r = r.sibling));
        return null;
      }
      function i(e, t) {
        for (e = new Map(); t !== null; ) (t.key === null ? e.set(t.index, t) : e.set(t.key, t), (t = t.sibling));
        return e;
      }
      function a(e, t) {
        return ((e = Yl(e, t)), (e.index = 0), (e.sibling = null), e);
      }
      function o(t, n, r) {
        return (
          (t.index = r),
          e
            ? ((r = t.alternate), r === null ? ((t.flags |= 2), n) : ((r = r.index), r < n ? ((t.flags |= 2), n) : r))
            : ((t.flags |= 1048576), n)
        );
      }
      function s(t) {
        return (e && t.alternate === null && (t.flags |= 2), t);
      }
      function c(e, t, n, r) {
        return t === null || t.tag !== 6
          ? ((t = $l(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function l(e, t, n, r) {
        var i = n.type;
        return i === E
          ? d(e, t, n.props.children, r, n.key)
          : t !== null && (t.elementType === i || (typeof i == `object` && i && i.$$typeof === P && Ma(i) === t.type))
            ? ((r = a(t, n.props)), (r.ref = Aa(e, t, n)), (r.return = e), r)
            : ((r = Xl(n.type, n.key, n.props, null, e.mode, r)), (r.ref = Aa(e, t, n)), (r.return = e), r);
      }
      function u(e, t, n, r) {
        return t === null ||
          t.tag !== 4 ||
          t.stateNode.containerInfo !== n.containerInfo ||
          t.stateNode.implementation !== n.implementation
          ? ((t = eu(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n.children || [])), (t.return = e), t);
      }
      function d(e, t, n, r, i) {
        return t === null || t.tag !== 7
          ? ((t = Zl(n, e.mode, r, i)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function f(e, t, n) {
        if ((typeof t == `string` && t !== ``) || typeof t == `number`)
          return ((t = $l(`` + t, e.mode, n)), (t.return = e), t);
        if (typeof t == `object` && t) {
          switch (t.$$typeof) {
            case w:
              return ((n = Xl(t.type, t.key, t.props, null, e.mode, n)), (n.ref = Aa(e, null, t)), (n.return = e), n);
            case T:
              return ((t = eu(t, e.mode, n)), (t.return = e), t);
            case P:
              var r = t._init;
              return f(e, r(t._payload), n);
          }
          if (be(t) || re(t)) return ((t = Zl(t, e.mode, n, null)), (t.return = e), t);
          ja(e, t);
        }
        return null;
      }
      function p(e, t, n, r) {
        var i = t === null ? null : t.key;
        if ((typeof n == `string` && n !== ``) || typeof n == `number`) return i === null ? c(e, t, `` + n, r) : null;
        if (typeof n == `object` && n) {
          switch (n.$$typeof) {
            case w:
              return n.key === i ? l(e, t, n, r) : null;
            case T:
              return n.key === i ? u(e, t, n, r) : null;
            case P:
              return ((i = n._init), p(e, t, i(n._payload), r));
          }
          if (be(n) || re(n)) return i === null ? d(e, t, n, r, null) : null;
          ja(e, n);
        }
        return null;
      }
      function m(e, t, n, r, i) {
        if ((typeof r == `string` && r !== ``) || typeof r == `number`)
          return ((e = e.get(n) || null), c(t, e, `` + r, i));
        if (typeof r == `object` && r) {
          switch (r.$$typeof) {
            case w:
              return ((e = e.get(r.key === null ? n : r.key) || null), l(t, e, r, i));
            case T:
              return ((e = e.get(r.key === null ? n : r.key) || null), u(t, e, r, i));
            case P:
              var a = r._init;
              return m(e, t, n, a(r._payload), i);
          }
          if (be(r) || re(r)) return ((e = e.get(n) || null), d(t, e, r, i, null));
          ja(t, r);
        }
        return null;
      }
      function h(r, a, s, c) {
        for (var l = null, u = null, d = a, h = (a = 0), g = null; d !== null && h < s.length; h++) {
          d.index > h ? ((g = d), (d = null)) : (g = d.sibling);
          var _ = p(r, d, s[h], c);
          if (_ === null) {
            d === null && (d = g);
            break;
          }
          (e && d && _.alternate === null && t(r, d),
            (a = o(_, a, h)),
            u === null ? (l = _) : (u.sibling = _),
            (u = _),
            (d = g));
        }
        if (h === s.length) return (n(r, d), ya && pa(r, h), l);
        if (d === null) {
          for (; h < s.length; h++)
            ((d = f(r, s[h], c)), d !== null && ((a = o(d, a, h)), u === null ? (l = d) : (u.sibling = d), (u = d)));
          return (ya && pa(r, h), l);
        }
        for (d = i(r, d); h < s.length; h++)
          ((g = m(d, r, h, s[h], c)),
            g !== null &&
              (e && g.alternate !== null && d.delete(g.key === null ? h : g.key),
              (a = o(g, a, h)),
              u === null ? (l = g) : (u.sibling = g),
              (u = g)));
        return (
          e &&
            d.forEach(function (e) {
              return t(r, e);
            }),
          ya && pa(r, h),
          l
        );
      }
      function g(a, s, c, l) {
        var u = re(c);
        if (typeof u != `function`) throw Error(r(150));
        if (((c = u.call(c)), c == null)) throw Error(r(151));
        for (var d = (u = null), h = s, g = (s = 0), _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
          h.index > g ? ((_ = h), (h = null)) : (_ = h.sibling);
          var y = p(a, h, v.value, l);
          if (y === null) {
            h === null && (h = _);
            break;
          }
          (e && h && y.alternate === null && t(a, h),
            (s = o(y, s, g)),
            d === null ? (u = y) : (d.sibling = y),
            (d = y),
            (h = _));
        }
        if (v.done) return (n(a, h), ya && pa(a, g), u);
        if (h === null) {
          for (; !v.done; g++, v = c.next())
            ((v = f(a, v.value, l)), v !== null && ((s = o(v, s, g)), d === null ? (u = v) : (d.sibling = v), (d = v)));
          return (ya && pa(a, g), u);
        }
        for (h = i(a, h); !v.done; g++, v = c.next())
          ((v = m(h, a, g, v.value, l)),
            v !== null &&
              (e && v.alternate !== null && h.delete(v.key === null ? g : v.key),
              (s = o(v, s, g)),
              d === null ? (u = v) : (d.sibling = v),
              (d = v)));
        return (
          e &&
            h.forEach(function (e) {
              return t(a, e);
            }),
          ya && pa(a, g),
          u
        );
      }
      function _(e, r, i, o) {
        if (
          (typeof i == `object` && i && i.type === E && i.key === null && (i = i.props.children),
          typeof i == `object` && i)
        ) {
          switch (i.$$typeof) {
            case w:
              a: {
                for (var c = i.key, l = r; l !== null; ) {
                  if (l.key === c) {
                    if (((c = i.type), c === E)) {
                      if (l.tag === 7) {
                        (n(e, l.sibling), (r = a(l, i.props.children)), (r.return = e), (e = r));
                        break a;
                      }
                    } else if (
                      l.elementType === c ||
                      (typeof c == `object` && c && c.$$typeof === P && Ma(c) === l.type)
                    ) {
                      (n(e, l.sibling), (r = a(l, i.props)), (r.ref = Aa(e, l, i)), (r.return = e), (e = r));
                      break a;
                    }
                    n(e, l);
                    break;
                  } else t(e, l);
                  l = l.sibling;
                }
                i.type === E
                  ? ((r = Zl(i.props.children, e.mode, o, i.key)), (r.return = e), (e = r))
                  : ((o = Xl(i.type, i.key, i.props, null, e.mode, o)), (o.ref = Aa(e, r, i)), (o.return = e), (e = o));
              }
              return s(e);
            case T:
              a: {
                for (l = i.key; r !== null; ) {
                  if (r.key === l)
                    if (
                      r.tag === 4 &&
                      r.stateNode.containerInfo === i.containerInfo &&
                      r.stateNode.implementation === i.implementation
                    ) {
                      (n(e, r.sibling), (r = a(r, i.children || [])), (r.return = e), (e = r));
                      break a;
                    } else {
                      n(e, r);
                      break;
                    }
                  else t(e, r);
                  r = r.sibling;
                }
                ((r = eu(i, e.mode, o)), (r.return = e), (e = r));
              }
              return s(e);
            case P:
              return ((l = i._init), _(e, r, l(i._payload), o));
          }
          if (be(i)) return h(e, r, i, o);
          if (re(i)) return g(e, r, i, o);
          ja(e, i);
        }
        return (typeof i == `string` && i !== ``) || typeof i == `number`
          ? ((i = `` + i),
            r !== null && r.tag === 6
              ? (n(e, r.sibling), (r = a(r, i)), (r.return = e), (e = r))
              : (n(e, r), (r = $l(i, e.mode, o)), (r.return = e), (e = r)),
            s(e))
          : n(e, r);
      }
      return _;
    }
    var Pa = Na(!0),
      Fa = Na(!1),
      Ia = zi(null),
      La = null,
      Ra = null,
      za = null;
    function Ba() {
      za = Ra = La = null;
    }
    function Va(e) {
      var t = Ia.current;
      (Bi(Ia), (e._currentValue = t));
    }
    function Ha(e, t, n) {
      for (; e !== null; ) {
        var r = e.alternate;
        if (
          ((e.childLanes & t) === t
            ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t)
            : ((e.childLanes |= t), r !== null && (r.childLanes |= t)),
          e === n)
        )
          break;
        e = e.return;
      }
    }
    function Ua(e, t) {
      ((La = e),
        (za = Ra = null),
        (e = e.dependencies),
        e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ms = !0), (e.firstContext = null)));
    }
    function Wa(e) {
      var t = e._currentValue;
      if (za !== e)
        if (((e = { context: e, memoizedValue: t, next: null }), Ra === null)) {
          if (La === null) throw Error(r(308));
          ((Ra = e), (La.dependencies = { lanes: 0, firstContext: e }));
        } else Ra = Ra.next = e;
      return t;
    }
    var Ga = null;
    function Ka(e) {
      Ga === null ? (Ga = [e]) : Ga.push(e);
    }
    function qa(e, t, n, r) {
      var i = t.interleaved;
      return (i === null ? ((n.next = n), Ka(t)) : ((n.next = i.next), (i.next = n)), (t.interleaved = n), Ja(e, r));
    }
    function Ja(e, t) {
      e.lanes |= t;
      var n = e.alternate;
      for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
        ((e.childLanes |= t), (n = e.alternate), n !== null && (n.childLanes |= t), (n = e), (e = e.return));
      return n.tag === 3 ? n.stateNode : null;
    }
    var Ya = !1;
    function Xa(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, interleaved: null, lanes: 0 },
        effects: null,
      };
    }
    function Za(e, t) {
      ((e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            effects: e.effects,
          }));
    }
    function Qa(e, t) {
      return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
    }
    function $a(e, t, n) {
      var r = e.updateQueue;
      if (r === null) return null;
      if (((r = r.shared), $ & 2)) {
        var i = r.pending;
        return (i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)), (r.pending = t), Ja(e, n));
      }
      return (
        (i = r.interleaved),
        i === null ? ((t.next = t), Ka(r)) : ((t.next = i.next), (i.next = t)),
        (r.interleaved = t),
        Ja(e, n)
      );
    }
    function eo(e, t, n) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), n & 4194240))) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Vt(e, n));
      }
    }
    function to(e, t) {
      var n = e.updateQueue,
        r = e.alternate;
      if (r !== null && ((r = r.updateQueue), n === r)) {
        var i = null,
          a = null;
        if (((n = n.firstBaseUpdate), n !== null)) {
          do {
            var o = {
              eventTime: n.eventTime,
              lane: n.lane,
              tag: n.tag,
              payload: n.payload,
              callback: n.callback,
              next: null,
            };
            (a === null ? (i = a = o) : (a = a.next = o), (n = n.next));
          } while (n !== null);
          a === null ? (i = a = t) : (a = a.next = t);
        } else i = a = t;
        ((n = { baseState: r.baseState, firstBaseUpdate: i, lastBaseUpdate: a, shared: r.shared, effects: r.effects }),
          (e.updateQueue = n));
        return;
      }
      ((e = n.lastBaseUpdate), e === null ? (n.firstBaseUpdate = t) : (e.next = t), (n.lastBaseUpdate = t));
    }
    function no(e, t, n, r) {
      var i = e.updateQueue;
      Ya = !1;
      var a = i.firstBaseUpdate,
        o = i.lastBaseUpdate,
        s = i.shared.pending;
      if (s !== null) {
        i.shared.pending = null;
        var c = s,
          l = c.next;
        ((c.next = null), o === null ? (a = l) : (o.next = l), (o = c));
        var u = e.alternate;
        u !== null &&
          ((u = u.updateQueue),
          (s = u.lastBaseUpdate),
          s !== o && (s === null ? (u.firstBaseUpdate = l) : (s.next = l), (u.lastBaseUpdate = c)));
      }
      if (a !== null) {
        var d = i.baseState;
        ((o = 0), (u = l = c = null), (s = a));
        do {
          var f = s.lane,
            p = s.eventTime;
          if ((r & f) === f) {
            u !== null &&
              (u = u.next =
                { eventTime: p, lane: 0, tag: s.tag, payload: s.payload, callback: s.callback, next: null });
            a: {
              var m = e,
                h = s;
              switch (((f = t), (p = n), h.tag)) {
                case 1:
                  if (((m = h.payload), typeof m == `function`)) {
                    d = m.call(p, d, f);
                    break a;
                  }
                  d = m;
                  break a;
                case 3:
                  m.flags = (m.flags & -65537) | 128;
                case 0:
                  if (((m = h.payload), (f = typeof m == `function` ? m.call(p, d, f) : m), f == null)) break a;
                  d = F({}, d, f);
                  break a;
                case 2:
                  Ya = !0;
              }
            }
            s.callback !== null &&
              s.lane !== 0 &&
              ((e.flags |= 64), (f = i.effects), f === null ? (i.effects = [s]) : f.push(s));
          } else
            ((p = { eventTime: p, lane: f, tag: s.tag, payload: s.payload, callback: s.callback, next: null }),
              u === null ? ((l = u = p), (c = d)) : (u = u.next = p),
              (o |= f));
          if (((s = s.next), s === null)) {
            if (((s = i.shared.pending), s === null)) break;
            ((f = s), (s = f.next), (f.next = null), (i.lastBaseUpdate = f), (i.shared.pending = null));
          }
        } while (1);
        if (
          (u === null && (c = d),
          (i.baseState = c),
          (i.firstBaseUpdate = l),
          (i.lastBaseUpdate = u),
          (t = i.shared.interleaved),
          t !== null)
        ) {
          i = t;
          do ((o |= i.lane), (i = i.next));
          while (i !== t);
        } else a === null && (i.shared.lanes = 0);
        ((Jc |= o), (e.lanes = o), (e.memoizedState = d));
      }
    }
    function ro(e, t, n) {
      if (((e = t.effects), (t.effects = null), e !== null))
        for (t = 0; t < e.length; t++) {
          var i = e[t],
            a = i.callback;
          if (a !== null) {
            if (((i.callback = null), (i = n), typeof a != `function`)) throw Error(r(191, a));
            a.call(i);
          }
        }
    }
    var io = {},
      ao = zi(io),
      oo = zi(io),
      so = zi(io);
    function co(e) {
      if (e === io) throw Error(r(174));
      return e;
    }
    function lo(e, t) {
      switch ((Y(so, t), Y(oo, e), Y(ao, io), (e = t.nodeType), e)) {
        case 9:
        case 11:
          t = (t = t.documentElement) ? t.namespaceURI : De(null, ``);
          break;
        default:
          ((e = e === 8 ? t.parentNode : t), (t = e.namespaceURI || null), (e = e.tagName), (t = De(t, e)));
      }
      (Bi(ao), Y(ao, t));
    }
    function uo() {
      (Bi(ao), Bi(oo), Bi(so));
    }
    function fo(e) {
      co(so.current);
      var t = co(ao.current),
        n = De(t, e.type);
      t !== n && (Y(oo, e), Y(ao, n));
    }
    function po(e) {
      oo.current === e && (Bi(ao), Bi(oo));
    }
    var mo = zi(0);
    function ho(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var n = t.memoizedState;
          if (n !== null && ((n = n.dehydrated), n === null || n.data === `$?` || n.data === `$!`)) return t;
        } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
          if (t.flags & 128) return t;
        } else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
      return null;
    }
    var go = [];
    function _o() {
      for (var e = 0; e < go.length; e++) go[e]._workInProgressVersionPrimary = null;
      go.length = 0;
    }
    var vo = C.ReactCurrentDispatcher,
      yo = C.ReactCurrentBatchConfig,
      bo = 0,
      xo = null,
      So = null,
      Co = null,
      wo = !1,
      To = !1,
      Eo = 0,
      Do = 0;
    function Oo() {
      throw Error(r(321));
    }
    function ko(e, t) {
      if (t === null) return !1;
      for (var n = 0; n < t.length && n < e.length; n++) if (!Or(e[n], t[n])) return !1;
      return !0;
    }
    function Ao(e, t, n, i, a, o) {
      if (
        ((bo = o),
        (xo = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (vo.current = e === null || e.memoizedState === null ? fs : ps),
        (e = n(i, a)),
        To)
      ) {
        o = 0;
        do {
          if (((To = !1), (Eo = 0), 25 <= o)) throw Error(r(301));
          ((o += 1), (Co = So = null), (t.updateQueue = null), (vo.current = ms), (e = n(i, a)));
        } while (To);
      }
      if (((vo.current = ds), (t = So !== null && So.next !== null), (bo = 0), (Co = So = xo = null), (wo = !1), t))
        throw Error(r(300));
      return e;
    }
    function jo() {
      var e = Eo !== 0;
      return ((Eo = 0), e);
    }
    function Z() {
      var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return (Co === null ? (xo.memoizedState = Co = e) : (Co = Co.next = e), Co);
    }
    function Mo() {
      if (So === null) {
        var e = xo.alternate;
        e = e === null ? null : e.memoizedState;
      } else e = So.next;
      var t = Co === null ? xo.memoizedState : Co.next;
      if (t !== null) ((Co = t), (So = e));
      else {
        if (e === null) throw Error(r(310));
        ((So = e),
          (e = {
            memoizedState: So.memoizedState,
            baseState: So.baseState,
            baseQueue: So.baseQueue,
            queue: So.queue,
            next: null,
          }),
          Co === null ? (xo.memoizedState = Co = e) : (Co = Co.next = e));
      }
      return Co;
    }
    function No(e, t) {
      return typeof t == `function` ? t(e) : t;
    }
    function Po(e) {
      var t = Mo(),
        n = t.queue;
      if (n === null) throw Error(r(311));
      n.lastRenderedReducer = e;
      var i = So,
        a = i.baseQueue,
        o = n.pending;
      if (o !== null) {
        if (a !== null) {
          var s = a.next;
          ((a.next = o.next), (o.next = s));
        }
        ((i.baseQueue = a = o), (n.pending = null));
      }
      if (a !== null) {
        ((o = a.next), (i = i.baseState));
        var c = (s = null),
          l = null,
          u = o;
        do {
          var d = u.lane;
          if ((bo & d) === d)
            (l !== null &&
              (l = l.next =
                { lane: 0, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }),
              (i = u.hasEagerState ? u.eagerState : e(i, u.action)));
          else {
            var f = { lane: d, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null };
            (l === null ? ((c = l = f), (s = i)) : (l = l.next = f), (xo.lanes |= d), (Jc |= d));
          }
          u = u.next;
        } while (u !== null && u !== o);
        (l === null ? (s = i) : (l.next = c),
          Or(i, t.memoizedState) || (Ms = !0),
          (t.memoizedState = i),
          (t.baseState = s),
          (t.baseQueue = l),
          (n.lastRenderedState = i));
      }
      if (((e = n.interleaved), e !== null)) {
        a = e;
        do ((o = a.lane), (xo.lanes |= o), (Jc |= o), (a = a.next));
        while (a !== e);
      } else a === null && (n.lanes = 0);
      return [t.memoizedState, n.dispatch];
    }
    function Fo(e) {
      var t = Mo(),
        n = t.queue;
      if (n === null) throw Error(r(311));
      n.lastRenderedReducer = e;
      var i = n.dispatch,
        a = n.pending,
        o = t.memoizedState;
      if (a !== null) {
        n.pending = null;
        var s = (a = a.next);
        do ((o = e(o, s.action)), (s = s.next));
        while (s !== a);
        (Or(o, t.memoizedState) || (Ms = !0),
          (t.memoizedState = o),
          t.baseQueue === null && (t.baseState = o),
          (n.lastRenderedState = o));
      }
      return [o, i];
    }
    function Io() {}
    function Lo(e, t) {
      var n = xo,
        i = Mo(),
        a = t(),
        o = !Or(i.memoizedState, a);
      if (
        (o && ((i.memoizedState = a), (Ms = !0)),
        (i = i.queue),
        Yo(Bo.bind(null, n, i, e), [e]),
        i.getSnapshot !== t || o || (Co !== null && Co.memoizedState.tag & 1))
      ) {
        if (((n.flags |= 2048), Wo(9, zo.bind(null, n, i, a, t), void 0, null), Vc === null)) throw Error(r(349));
        bo & 30 || Ro(n, t, a);
      }
      return a;
    }
    function Ro(e, t, n) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        (t = xo.updateQueue),
        t === null
          ? ((t = { lastEffect: null, stores: null }), (xo.updateQueue = t), (t.stores = [e]))
          : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
    }
    function zo(e, t, n, r) {
      ((t.value = n), (t.getSnapshot = r), Vo(t) && Ho(e));
    }
    function Bo(e, t, n) {
      return n(function () {
        Vo(t) && Ho(e);
      });
    }
    function Vo(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !Or(e, n);
      } catch {
        return !0;
      }
    }
    function Ho(e) {
      var t = Ja(e, 1);
      t !== null && ml(t, e, 1, -1);
    }
    function Uo(e) {
      var t = Z();
      return (
        typeof e == `function` && (e = e()),
        (t.memoizedState = t.baseState = e),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: No,
          lastRenderedState: e,
        }),
        (t.queue = e),
        (e = e.dispatch = ss.bind(null, xo, e)),
        [t.memoizedState, e]
      );
    }
    function Wo(e, t, n, r) {
      return (
        (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
        (t = xo.updateQueue),
        t === null
          ? ((t = { lastEffect: null, stores: null }), (xo.updateQueue = t), (t.lastEffect = e.next = e))
          : ((n = t.lastEffect),
            n === null ? (t.lastEffect = e.next = e) : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
        e
      );
    }
    function Go() {
      return Mo().memoizedState;
    }
    function Ko(e, t, n, r) {
      var i = Z();
      ((xo.flags |= e), (i.memoizedState = Wo(1 | t, n, void 0, r === void 0 ? null : r)));
    }
    function qo(e, t, n, r) {
      var i = Mo();
      r = r === void 0 ? null : r;
      var a = void 0;
      if (So !== null) {
        var o = So.memoizedState;
        if (((a = o.destroy), r !== null && ko(r, o.deps))) {
          i.memoizedState = Wo(t, n, a, r);
          return;
        }
      }
      ((xo.flags |= e), (i.memoizedState = Wo(1 | t, n, a, r)));
    }
    function Jo(e, t) {
      return Ko(8390656, 8, e, t);
    }
    function Yo(e, t) {
      return qo(2048, 8, e, t);
    }
    function Xo(e, t) {
      return qo(4, 2, e, t);
    }
    function Zo(e, t) {
      return qo(4, 4, e, t);
    }
    function Qo(e, t) {
      if (typeof t == `function`)
        return (
          (e = e()),
          t(e),
          function () {
            t(null);
          }
        );
      if (t != null)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function $o(e, t, n) {
      return ((n = n == null ? null : n.concat([e])), qo(4, 4, Qo.bind(null, t, e), n));
    }
    function es() {}
    function ts(e, t) {
      var n = Mo();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      return r !== null && t !== null && ko(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
    }
    function ns(e, t) {
      var n = Mo();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      return r !== null && t !== null && ko(t, r[1]) ? r[0] : ((e = e()), (n.memoizedState = [e, t]), e);
    }
    function rs(e, t, n) {
      return bo & 21
        ? (Or(n, t) || ((n = Lt()), (xo.lanes |= n), (Jc |= n), (e.baseState = !0)), t)
        : (e.baseState && ((e.baseState = !1), (Ms = !0)), (e.memoizedState = n));
    }
    function is(e, t) {
      var n = B;
      ((B = n !== 0 && 4 > n ? n : 4), e(!0));
      var r = yo.transition;
      yo.transition = {};
      try {
        (e(!1), t());
      } finally {
        ((B = n), (yo.transition = r));
      }
    }
    function as() {
      return Mo().memoizedState;
    }
    function os(e, t, n) {
      var r = pl(e);
      if (((n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }), cs(e))) ls(t, n);
      else if (((n = qa(e, t, n, r)), n !== null)) {
        var i = fl();
        (ml(n, e, r, i), us(n, t, r));
      }
    }
    function ss(e, t, n) {
      var r = pl(e),
        i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
      if (cs(e)) ls(t, i);
      else {
        var a = e.alternate;
        if (e.lanes === 0 && (a === null || a.lanes === 0) && ((a = t.lastRenderedReducer), a !== null))
          try {
            var o = t.lastRenderedState,
              s = a(o, n);
            if (((i.hasEagerState = !0), (i.eagerState = s), Or(s, o))) {
              var c = t.interleaved;
              (c === null ? ((i.next = i), Ka(t)) : ((i.next = c.next), (c.next = i)), (t.interleaved = i));
              return;
            }
          } catch {}
        ((n = qa(e, t, i, r)), n !== null && ((i = fl()), ml(n, e, r, i), us(n, t, r)));
      }
    }
    function cs(e) {
      var t = e.alternate;
      return e === xo || (t !== null && t === xo);
    }
    function ls(e, t) {
      To = wo = !0;
      var n = e.pending;
      (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
    }
    function us(e, t, n) {
      if (n & 4194240) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Vt(e, n));
      }
    }
    var ds = {
        readContext: Wa,
        useCallback: Oo,
        useContext: Oo,
        useEffect: Oo,
        useImperativeHandle: Oo,
        useInsertionEffect: Oo,
        useLayoutEffect: Oo,
        useMemo: Oo,
        useReducer: Oo,
        useRef: Oo,
        useState: Oo,
        useDebugValue: Oo,
        useDeferredValue: Oo,
        useTransition: Oo,
        useMutableSource: Oo,
        useSyncExternalStore: Oo,
        useId: Oo,
        unstable_isNewReconciler: !1,
      },
      fs = {
        readContext: Wa,
        useCallback: function (e, t) {
          return ((Z().memoizedState = [e, t === void 0 ? null : t]), e);
        },
        useContext: Wa,
        useEffect: Jo,
        useImperativeHandle: function (e, t, n) {
          return ((n = n == null ? null : n.concat([e])), Ko(4194308, 4, Qo.bind(null, t, e), n));
        },
        useLayoutEffect: function (e, t) {
          return Ko(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          return Ko(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var n = Z();
          return ((t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e);
        },
        useReducer: function (e, t, n) {
          var r = Z();
          return (
            (t = n === void 0 ? t : n(t)),
            (r.memoizedState = r.baseState = t),
            (e = {
              pending: null,
              interleaved: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: t,
            }),
            (r.queue = e),
            (e = e.dispatch = os.bind(null, xo, e)),
            [r.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = Z();
          return ((e = { current: e }), (t.memoizedState = e));
        },
        useState: Uo,
        useDebugValue: es,
        useDeferredValue: function (e) {
          return (Z().memoizedState = e);
        },
        useTransition: function () {
          var e = Uo(!1),
            t = e[0];
          return ((e = is.bind(null, e[1])), (Z().memoizedState = e), [t, e]);
        },
        useMutableSource: function () {},
        useSyncExternalStore: function (e, t, n) {
          var i = xo,
            a = Z();
          if (ya) {
            if (n === void 0) throw Error(r(407));
            n = n();
          } else {
            if (((n = t()), Vc === null)) throw Error(r(349));
            bo & 30 || Ro(i, t, n);
          }
          a.memoizedState = n;
          var o = { value: n, getSnapshot: t };
          return (
            (a.queue = o),
            Jo(Bo.bind(null, i, o, e), [e]),
            (i.flags |= 2048),
            Wo(9, zo.bind(null, i, o, n, t), void 0, null),
            n
          );
        },
        useId: function () {
          var e = Z(),
            t = Vc.identifierPrefix;
          if (ya) {
            var n = fa,
              r = da;
            ((n = (r & ~(1 << (32 - Et(r) - 1))).toString(32) + n),
              (t = `:` + t + `R` + n),
              (n = Eo++),
              0 < n && (t += `H` + n.toString(32)),
              (t += `:`));
          } else ((n = Do++), (t = `:` + t + `r` + n.toString(32) + `:`));
          return (e.memoizedState = t);
        },
        unstable_isNewReconciler: !1,
      },
      ps = {
        readContext: Wa,
        useCallback: ts,
        useContext: Wa,
        useEffect: Yo,
        useImperativeHandle: $o,
        useInsertionEffect: Xo,
        useLayoutEffect: Zo,
        useMemo: ns,
        useReducer: Po,
        useRef: Go,
        useState: function () {
          return Po(No);
        },
        useDebugValue: es,
        useDeferredValue: function (e) {
          return rs(Mo(), So.memoizedState, e);
        },
        useTransition: function () {
          return [Po(No)[0], Mo().memoizedState];
        },
        useMutableSource: Io,
        useSyncExternalStore: Lo,
        useId: as,
        unstable_isNewReconciler: !1,
      },
      ms = {
        readContext: Wa,
        useCallback: ts,
        useContext: Wa,
        useEffect: Yo,
        useImperativeHandle: $o,
        useInsertionEffect: Xo,
        useLayoutEffect: Zo,
        useMemo: ns,
        useReducer: Fo,
        useRef: Go,
        useState: function () {
          return Fo(No);
        },
        useDebugValue: es,
        useDeferredValue: function (e) {
          var t = Mo();
          return So === null ? (t.memoizedState = e) : rs(t, So.memoizedState, e);
        },
        useTransition: function () {
          return [Fo(No)[0], Mo().memoizedState];
        },
        useMutableSource: Io,
        useSyncExternalStore: Lo,
        useId: as,
        unstable_isNewReconciler: !1,
      };
    function hs(e, t) {
      if (e && e.defaultProps) {
        for (var n in ((t = F({}, t)), (e = e.defaultProps), e)) t[n] === void 0 && (t[n] = e[n]);
        return t;
      }
      return t;
    }
    function gs(e, t, n, r) {
      ((t = e.memoizedState),
        (n = n(r, t)),
        (n = n == null ? t : F({}, t, n)),
        (e.memoizedState = n),
        e.lanes === 0 && (e.updateQueue.baseState = n));
    }
    var _s = {
      isMounted: function (e) {
        return (e = e._reactInternals) ? ot(e) === e : !1;
      },
      enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = fl(),
          i = pl(e),
          a = Qa(r, i);
        ((a.payload = t),
          n != null && (a.callback = n),
          (t = $a(e, a, i)),
          t !== null && (ml(t, e, i, r), eo(t, e, i)));
      },
      enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = fl(),
          i = pl(e),
          a = Qa(r, i);
        ((a.tag = 1),
          (a.payload = t),
          n != null && (a.callback = n),
          (t = $a(e, a, i)),
          t !== null && (ml(t, e, i, r), eo(t, e, i)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = fl(),
          r = pl(e),
          i = Qa(n, r);
        ((i.tag = 2), t != null && (i.callback = t), (t = $a(e, i, r)), t !== null && (ml(t, e, r, n), eo(t, e, r)));
      },
    };
    function vs(e, t, n, r, i, a, o) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == `function`
          ? e.shouldComponentUpdate(r, a, o)
          : t.prototype && t.prototype.isPureReactComponent
            ? !kr(n, r) || !kr(i, a)
            : !0
      );
    }
    function ys(e, t, n) {
      var r = !1,
        i = Vi,
        a = t.contextType;
      return (
        typeof a == `object` && a
          ? (a = Wa(a))
          : ((i = Ki(t) ? Wi : Hi.current), (r = t.contextTypes), (a = (r = r != null) ? Gi(e, i) : Vi)),
        (t = new t(n, a)),
        (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
        (t.updater = _s),
        (e.stateNode = t),
        (t._reactInternals = e),
        r &&
          ((e = e.stateNode),
          (e.__reactInternalMemoizedUnmaskedChildContext = i),
          (e.__reactInternalMemoizedMaskedChildContext = a)),
        t
      );
    }
    function bs(e, t, n, r) {
      ((e = t.state),
        typeof t.componentWillReceiveProps == `function` && t.componentWillReceiveProps(n, r),
        typeof t.UNSAFE_componentWillReceiveProps == `function` && t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && _s.enqueueReplaceState(t, t.state, null));
    }
    function xs(e, t, n, r) {
      var i = e.stateNode;
      ((i.props = n), (i.state = e.memoizedState), (i.refs = {}), Xa(e));
      var a = t.contextType;
      (typeof a == `object` && a ? (i.context = Wa(a)) : ((a = Ki(t) ? Wi : Hi.current), (i.context = Gi(e, a))),
        (i.state = e.memoizedState),
        (a = t.getDerivedStateFromProps),
        typeof a == `function` && (gs(e, t, a, n), (i.state = e.memoizedState)),
        typeof t.getDerivedStateFromProps == `function` ||
          typeof i.getSnapshotBeforeUpdate == `function` ||
          (typeof i.UNSAFE_componentWillMount != `function` && typeof i.componentWillMount != `function`) ||
          ((t = i.state),
          typeof i.componentWillMount == `function` && i.componentWillMount(),
          typeof i.UNSAFE_componentWillMount == `function` && i.UNSAFE_componentWillMount(),
          t !== i.state && _s.enqueueReplaceState(i, i.state, null),
          no(e, n, i, r),
          (i.state = e.memoizedState)),
        typeof i.componentDidMount == `function` && (e.flags |= 4194308));
    }
    function Ss(e, t) {
      try {
        var n = ``,
          r = t;
        do ((n += ce(r)), (r = r.return));
        while (r);
        var i = n;
      } catch (e) {
        i =
          `
Error generating stack: ` +
          e.message +
          `
` +
          e.stack;
      }
      return { value: e, source: t, stack: i, digest: null };
    }
    function Cs(e, t, n) {
      return { value: e, source: null, stack: n ?? null, digest: t ?? null };
    }
    function ws(e, t) {
      try {
        console.error(t.value);
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    var Ts = typeof WeakMap == `function` ? WeakMap : Map;
    function Es(e, t, n) {
      ((n = Qa(-1, n)), (n.tag = 3), (n.payload = { element: null }));
      var r = t.value;
      return (
        (n.callback = function () {
          (nl || ((nl = !0), (rl = r)), ws(e, t));
        }),
        n
      );
    }
    function Ds(e, t, n) {
      ((n = Qa(-1, n)), (n.tag = 3));
      var r = e.type.getDerivedStateFromError;
      if (typeof r == `function`) {
        var i = t.value;
        ((n.payload = function () {
          return r(i);
        }),
          (n.callback = function () {
            ws(e, t);
          }));
      }
      var a = e.stateNode;
      return (
        a !== null &&
          typeof a.componentDidCatch == `function` &&
          (n.callback = function () {
            (ws(e, t), typeof r != `function` && (il === null ? (il = new Set([this])) : il.add(this)));
            var n = t.stack;
            this.componentDidCatch(t.value, { componentStack: n === null ? `` : n });
          }),
        n
      );
    }
    function Os(e, t, n) {
      var r = e.pingCache;
      if (r === null) {
        r = e.pingCache = new Ts();
        var i = new Set();
        r.set(t, i);
      } else ((i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i)));
      i.has(n) || (i.add(n), (e = zl.bind(null, e, t, n)), t.then(e, e));
    }
    function ks(e) {
      do {
        var t;
        if (((t = e.tag === 13) && ((t = e.memoizedState), (t = t === null ? !0 : t.dehydrated !== null)), t)) return e;
        e = e.return;
      } while (e !== null);
      return null;
    }
    function As(e, t, n, r, i) {
      return e.mode & 1
        ? ((e.flags |= 65536), (e.lanes = i), e)
        : (e === t
            ? (e.flags |= 65536)
            : ((e.flags |= 128),
              (n.flags |= 131072),
              (n.flags &= -52805),
              n.tag === 1 && (n.alternate === null ? (n.tag = 17) : ((t = Qa(-1, 1)), (t.tag = 2), $a(n, t, 1))),
              (n.lanes |= 1)),
          e);
    }
    var js = C.ReactCurrentOwner,
      Ms = !1;
    function Ns(e, t, n, r) {
      t.child = e === null ? Fa(t, null, n, r) : Pa(t, e.child, n, r);
    }
    function Ps(e, t, n, r, i) {
      n = n.render;
      var a = t.ref;
      return (
        Ua(t, i),
        (r = Ao(e, t, n, r, a, i)),
        (n = jo()),
        e !== null && !Ms
          ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), ec(e, t, i))
          : (ya && n && ha(t), (t.flags |= 1), Ns(e, t, r, i), t.child)
      );
    }
    function Fs(e, t, n, r, i) {
      if (e === null) {
        var a = n.type;
        return typeof a == `function` &&
          !ql(a) &&
          a.defaultProps === void 0 &&
          n.compare === null &&
          n.defaultProps === void 0
          ? ((t.tag = 15), (t.type = a), Is(e, t, a, r, i))
          : ((e = Xl(n.type, null, r, t, t.mode, i)), (e.ref = t.ref), (e.return = t), (t.child = e));
      }
      if (((a = e.child), (e.lanes & i) === 0)) {
        var o = a.memoizedProps;
        if (((n = n.compare), (n = n === null ? kr : n), n(o, r) && e.ref === t.ref)) return ec(e, t, i);
      }
      return ((t.flags |= 1), (e = Yl(a, r)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    function Is(e, t, n, r, i) {
      if (e !== null) {
        var a = e.memoizedProps;
        if (kr(a, r) && e.ref === t.ref)
          if (((Ms = !1), (t.pendingProps = r = a), (e.lanes & i) !== 0)) e.flags & 131072 && (Ms = !0);
          else return ((t.lanes = e.lanes), ec(e, t, i));
      }
      return zs(e, t, n, r, i);
    }
    function Ls(e, t, n) {
      var r = t.pendingProps,
        i = r.children,
        a = e === null ? null : e.memoizedState;
      if (r.mode === `hidden`)
        if (!(t.mode & 1))
          ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }), Y(Gc, Wc), (Wc |= n));
        else {
          if (!(n & 1073741824))
            return (
              (e = a === null ? n : a.baseLanes | n),
              (t.lanes = t.childLanes = 1073741824),
              (t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }),
              (t.updateQueue = null),
              Y(Gc, Wc),
              (Wc |= e),
              null
            );
          ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
            (r = a === null ? n : a.baseLanes),
            Y(Gc, Wc),
            (Wc |= r));
        }
      else (a === null ? (r = n) : ((r = a.baseLanes | n), (t.memoizedState = null)), Y(Gc, Wc), (Wc |= r));
      return (Ns(e, t, i, n), t.child);
    }
    function Rs(e, t) {
      var n = t.ref;
      ((e === null && n !== null) || (e !== null && e.ref !== n)) && ((t.flags |= 512), (t.flags |= 2097152));
    }
    function zs(e, t, n, r, i) {
      var a = Ki(n) ? Wi : Hi.current;
      return (
        (a = Gi(t, a)),
        Ua(t, i),
        (n = Ao(e, t, n, r, a, i)),
        (r = jo()),
        e !== null && !Ms
          ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), ec(e, t, i))
          : (ya && r && ha(t), (t.flags |= 1), Ns(e, t, n, i), t.child)
      );
    }
    function Bs(e, t, n, r, i) {
      if (Ki(n)) {
        var a = !0;
        Xi(t);
      } else a = !1;
      if ((Ua(t, i), t.stateNode === null)) ($s(e, t), ys(t, n, r), xs(t, n, r, i), (r = !0));
      else if (e === null) {
        var o = t.stateNode,
          s = t.memoizedProps;
        o.props = s;
        var c = o.context,
          l = n.contextType;
        typeof l == `object` && l ? (l = Wa(l)) : ((l = Ki(n) ? Wi : Hi.current), (l = Gi(t, l)));
        var u = n.getDerivedStateFromProps,
          d = typeof u == `function` || typeof o.getSnapshotBeforeUpdate == `function`;
        (d ||
          (typeof o.UNSAFE_componentWillReceiveProps != `function` &&
            typeof o.componentWillReceiveProps != `function`) ||
          ((s !== r || c !== l) && bs(t, o, r, l)),
          (Ya = !1));
        var f = t.memoizedState;
        ((o.state = f),
          no(t, r, o, i),
          (c = t.memoizedState),
          s !== r || f !== c || Ui.current || Ya
            ? (typeof u == `function` && (gs(t, n, u, r), (c = t.memoizedState)),
              (s = Ya || vs(t, n, s, r, f, c, l))
                ? (d ||
                    (typeof o.UNSAFE_componentWillMount != `function` && typeof o.componentWillMount != `function`) ||
                    (typeof o.componentWillMount == `function` && o.componentWillMount(),
                    typeof o.UNSAFE_componentWillMount == `function` && o.UNSAFE_componentWillMount()),
                  typeof o.componentDidMount == `function` && (t.flags |= 4194308))
                : (typeof o.componentDidMount == `function` && (t.flags |= 4194308),
                  (t.memoizedProps = r),
                  (t.memoizedState = c)),
              (o.props = r),
              (o.state = c),
              (o.context = l),
              (r = s))
            : (typeof o.componentDidMount == `function` && (t.flags |= 4194308), (r = !1)));
      } else {
        ((o = t.stateNode),
          Za(e, t),
          (s = t.memoizedProps),
          (l = t.type === t.elementType ? s : hs(t.type, s)),
          (o.props = l),
          (d = t.pendingProps),
          (f = o.context),
          (c = n.contextType),
          typeof c == `object` && c ? (c = Wa(c)) : ((c = Ki(n) ? Wi : Hi.current), (c = Gi(t, c))));
        var p = n.getDerivedStateFromProps;
        ((u = typeof p == `function` || typeof o.getSnapshotBeforeUpdate == `function`) ||
          (typeof o.UNSAFE_componentWillReceiveProps != `function` &&
            typeof o.componentWillReceiveProps != `function`) ||
          ((s !== d || f !== c) && bs(t, o, r, c)),
          (Ya = !1),
          (f = t.memoizedState),
          (o.state = f),
          no(t, r, o, i));
        var m = t.memoizedState;
        s !== d || f !== m || Ui.current || Ya
          ? (typeof p == `function` && (gs(t, n, p, r), (m = t.memoizedState)),
            (l = Ya || vs(t, n, l, r, f, m, c) || !1)
              ? (u ||
                  (typeof o.UNSAFE_componentWillUpdate != `function` && typeof o.componentWillUpdate != `function`) ||
                  (typeof o.componentWillUpdate == `function` && o.componentWillUpdate(r, m, c),
                  typeof o.UNSAFE_componentWillUpdate == `function` && o.UNSAFE_componentWillUpdate(r, m, c)),
                typeof o.componentDidUpdate == `function` && (t.flags |= 4),
                typeof o.getSnapshotBeforeUpdate == `function` && (t.flags |= 1024))
              : (typeof o.componentDidUpdate != `function` ||
                  (s === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                typeof o.getSnapshotBeforeUpdate != `function` ||
                  (s === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = r),
                (t.memoizedState = m)),
            (o.props = r),
            (o.state = m),
            (o.context = c),
            (r = l))
          : (typeof o.componentDidUpdate != `function` ||
              (s === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != `function` ||
              (s === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (r = !1));
      }
      return Vs(e, t, n, r, a, i);
    }
    function Vs(e, t, n, r, i, a) {
      Rs(e, t);
      var o = (t.flags & 128) != 0;
      if (!r && !o) return (i && Zi(t, n, !1), ec(e, t, a));
      ((r = t.stateNode), (js.current = t));
      var s = o && typeof n.getDerivedStateFromError != `function` ? null : r.render();
      return (
        (t.flags |= 1),
        e !== null && o ? ((t.child = Pa(t, e.child, null, a)), (t.child = Pa(t, null, s, a))) : Ns(e, t, s, a),
        (t.memoizedState = r.state),
        i && Zi(t, n, !0),
        t.child
      );
    }
    function Hs(e) {
      var t = e.stateNode;
      (t.pendingContext ? Ji(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Ji(e, t.context, !1),
        lo(e, t.containerInfo));
    }
    function Us(e, t, n, r, i) {
      return (Da(), Oa(i), (t.flags |= 256), Ns(e, t, n, r), t.child);
    }
    var Ws = { dehydrated: null, treeContext: null, retryLane: 0 };
    function Gs(e) {
      return { baseLanes: e, cachePool: null, transitions: null };
    }
    function Ks(e, t, n) {
      var r = t.pendingProps,
        i = mo.current,
        a = !1,
        o = (t.flags & 128) != 0,
        s;
      if (
        ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (i & 2) != 0),
        s ? ((a = !0), (t.flags &= -129)) : (e === null || e.memoizedState !== null) && (i |= 1),
        Y(mo, i & 1),
        e === null)
      )
        return (
          wa(t),
          (e = t.memoizedState),
          e !== null && ((e = e.dehydrated), e !== null)
            ? (t.mode & 1 ? (e.data === `$!` ? (t.lanes = 8) : (t.lanes = 1073741824)) : (t.lanes = 1), null)
            : ((o = r.children),
              (e = r.fallback),
              a
                ? ((r = t.mode),
                  (a = t.child),
                  (o = { mode: `hidden`, children: o }),
                  !(r & 1) && a !== null ? ((a.childLanes = 0), (a.pendingProps = o)) : (a = Ql(o, r, 0, null)),
                  (e = Zl(e, r, n, null)),
                  (a.return = t),
                  (e.return = t),
                  (a.sibling = e),
                  (t.child = a),
                  (t.child.memoizedState = Gs(n)),
                  (t.memoizedState = Ws),
                  e)
                : qs(t, o))
        );
      if (((i = e.memoizedState), i !== null && ((s = i.dehydrated), s !== null))) return Ys(e, t, o, r, s, i, n);
      if (a) {
        ((a = r.fallback), (o = t.mode), (i = e.child), (s = i.sibling));
        var c = { mode: `hidden`, children: r.children };
        return (
          !(o & 1) && t.child !== i
            ? ((r = t.child), (r.childLanes = 0), (r.pendingProps = c), (t.deletions = null))
            : ((r = Yl(i, c)), (r.subtreeFlags = i.subtreeFlags & 14680064)),
          s === null ? ((a = Zl(a, o, n, null)), (a.flags |= 2)) : (a = Yl(s, a)),
          (a.return = t),
          (r.return = t),
          (r.sibling = a),
          (t.child = r),
          (r = a),
          (a = t.child),
          (o = e.child.memoizedState),
          (o = o === null ? Gs(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }),
          (a.memoizedState = o),
          (a.childLanes = e.childLanes & ~n),
          (t.memoizedState = Ws),
          r
        );
      }
      return (
        (a = e.child),
        (e = a.sibling),
        (r = Yl(a, { mode: `visible`, children: r.children })),
        !(t.mode & 1) && (r.lanes = n),
        (r.return = t),
        (r.sibling = null),
        e !== null && ((n = t.deletions), n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
        (t.child = r),
        (t.memoizedState = null),
        r
      );
    }
    function qs(e, t) {
      return ((t = Ql({ mode: `visible`, children: t }, e.mode, 0, null)), (t.return = e), (e.child = t));
    }
    function Js(e, t, n, r) {
      return (
        r !== null && Oa(r),
        Pa(t, e.child, null, n),
        (e = qs(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function Ys(e, t, n, i, a, o, s) {
      if (n)
        return t.flags & 256
          ? ((t.flags &= -257), (i = Cs(Error(r(422)))), Js(e, t, s, i))
          : t.memoizedState === null
            ? ((o = i.fallback),
              (a = t.mode),
              (i = Ql({ mode: `visible`, children: i.children }, a, 0, null)),
              (o = Zl(o, a, s, null)),
              (o.flags |= 2),
              (i.return = t),
              (o.return = t),
              (i.sibling = o),
              (t.child = i),
              t.mode & 1 && Pa(t, e.child, null, s),
              (t.child.memoizedState = Gs(s)),
              (t.memoizedState = Ws),
              o)
            : ((t.child = e.child), (t.flags |= 128), null);
      if (!(t.mode & 1)) return Js(e, t, s, null);
      if (a.data === `$!`) {
        if (((i = a.nextSibling && a.nextSibling.dataset), i)) var c = i.dgst;
        return ((i = c), (o = Error(r(419))), (i = Cs(o, i, void 0)), Js(e, t, s, i));
      }
      if (((c = (s & e.childLanes) !== 0), Ms || c)) {
        if (((i = Vc), i !== null)) {
          switch (s & -s) {
            case 4:
              a = 2;
              break;
            case 16:
              a = 8;
              break;
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              a = 32;
              break;
            case 536870912:
              a = 268435456;
              break;
            default:
              a = 0;
          }
          ((a = (a & (i.suspendedLanes | s)) === 0 ? a : 0),
            a !== 0 && a !== o.retryLane && ((o.retryLane = a), Ja(e, a), ml(i, e, a, -1)));
        }
        return (Ol(), (i = Cs(Error(r(421)))), Js(e, t, s, i));
      }
      return a.data === `$?`
        ? ((t.flags |= 128), (t.child = e.child), (t = Vl.bind(null, e)), (a._reactRetry = t), null)
        : ((e = o.treeContext),
          (va = Di(a.nextSibling)),
          (_a = t),
          (ya = !0),
          (ba = null),
          e !== null && ((ca[la++] = da), (ca[la++] = fa), (ca[la++] = ua), (da = e.id), (fa = e.overflow), (ua = t)),
          (t = qs(t, i.children)),
          (t.flags |= 4096),
          t);
    }
    function Xs(e, t, n) {
      e.lanes |= t;
      var r = e.alternate;
      (r !== null && (r.lanes |= t), Ha(e.return, t, n));
    }
    function Zs(e, t, n, r, i) {
      var a = e.memoizedState;
      a === null
        ? (e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: i })
        : ((a.isBackwards = t),
          (a.rendering = null),
          (a.renderingStartTime = 0),
          (a.last = r),
          (a.tail = n),
          (a.tailMode = i));
    }
    function Qs(e, t, n) {
      var r = t.pendingProps,
        i = r.revealOrder,
        a = r.tail;
      if ((Ns(e, t, r.children, n), (r = mo.current), r & 2)) ((r = (r & 1) | 2), (t.flags |= 128));
      else {
        if (e !== null && e.flags & 128)
          a: for (e = t.child; e !== null; ) {
            if (e.tag === 13) e.memoizedState !== null && Xs(e, n, t);
            else if (e.tag === 19) Xs(e, n, t);
            else if (e.child !== null) {
              ((e.child.return = e), (e = e.child));
              continue;
            }
            if (e === t) break a;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break a;
              e = e.return;
            }
            ((e.sibling.return = e.return), (e = e.sibling));
          }
        r &= 1;
      }
      if ((Y(mo, r), !(t.mode & 1))) t.memoizedState = null;
      else
        switch (i) {
          case `forwards`:
            for (n = t.child, i = null; n !== null; )
              ((e = n.alternate), e !== null && ho(e) === null && (i = n), (n = n.sibling));
            ((n = i),
              n === null ? ((i = t.child), (t.child = null)) : ((i = n.sibling), (n.sibling = null)),
              Zs(t, !1, i, n, a));
            break;
          case `backwards`:
            for (n = null, i = t.child, t.child = null; i !== null; ) {
              if (((e = i.alternate), e !== null && ho(e) === null)) {
                t.child = i;
                break;
              }
              ((e = i.sibling), (i.sibling = n), (n = i), (i = e));
            }
            Zs(t, !0, n, null, a);
            break;
          case `together`:
            Zs(t, !1, null, null, void 0);
            break;
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function $s(e, t) {
      !(t.mode & 1) && e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
    }
    function ec(e, t, n) {
      if ((e !== null && (t.dependencies = e.dependencies), (Jc |= t.lanes), (n & t.childLanes) === 0)) return null;
      if (e !== null && t.child !== e.child) throw Error(r(153));
      if (t.child !== null) {
        for (e = t.child, n = Yl(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
          ((e = e.sibling), (n = n.sibling = Yl(e, e.pendingProps)), (n.return = t));
        n.sibling = null;
      }
      return t.child;
    }
    function tc(e, t, n) {
      switch (t.tag) {
        case 3:
          (Hs(t), Da());
          break;
        case 5:
          fo(t);
          break;
        case 1:
          Ki(t.type) && Xi(t);
          break;
        case 4:
          lo(t, t.stateNode.containerInfo);
          break;
        case 10:
          var r = t.type._context,
            i = t.memoizedProps.value;
          (Y(Ia, r._currentValue), (r._currentValue = i));
          break;
        case 13:
          if (((r = t.memoizedState), r !== null))
            return r.dehydrated === null
              ? (n & t.child.childLanes) === 0
                ? (Y(mo, mo.current & 1), (e = ec(e, t, n)), e === null ? null : e.sibling)
                : Ks(e, t, n)
              : (Y(mo, mo.current & 1), (t.flags |= 128), null);
          Y(mo, mo.current & 1);
          break;
        case 19:
          if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
            if (r) return Qs(e, t, n);
            t.flags |= 128;
          }
          if (
            ((i = t.memoizedState),
            i !== null && ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
            Y(mo, mo.current),
            r)
          )
            break;
          return null;
        case 22:
        case 23:
          return ((t.lanes = 0), Ls(e, t, n));
      }
      return ec(e, t, n);
    }
    var nc = function (e, t) {
        for (var n = t.child; n !== null; ) {
          if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
          else if (n.tag !== 4 && n.child !== null) {
            ((n.child.return = n), (n = n.child));
            continue;
          }
          if (n === t) break;
          for (; n.sibling === null; ) {
            if (n.return === null || n.return === t) return;
            n = n.return;
          }
          ((n.sibling.return = n.return), (n = n.sibling));
        }
      },
      rc = function (e, t, n, r) {
        var i = e.memoizedProps;
        if (i !== r) {
          ((e = t.stateNode), co(ao.current));
          var o = null;
          switch (n) {
            case `input`:
              ((i = he(e, i)), (r = he(e, r)), (o = []));
              break;
            case `select`:
              ((i = F({}, i, { value: void 0 })), (r = F({}, r, { value: void 0 })), (o = []));
              break;
            case `textarea`:
              ((i = Se(e, i)), (r = Se(e, r)), (o = []));
              break;
            default:
              typeof i.onClick != `function` && typeof r.onClick == `function` && (e.onclick = _i);
          }
          Ie(n, r);
          var s;
          for (u in ((n = null), i))
            if (!r.hasOwnProperty(u) && i.hasOwnProperty(u) && i[u] != null)
              if (u === `style`) {
                var c = i[u];
                for (s in c) c.hasOwnProperty(s) && ((n ||= {}), (n[s] = ``));
              } else
                u !== `dangerouslySetInnerHTML` &&
                  u !== `children` &&
                  u !== `suppressContentEditableWarning` &&
                  u !== `suppressHydrationWarning` &&
                  u !== `autoFocus` &&
                  (a.hasOwnProperty(u) ? (o ||= []) : (o ||= []).push(u, null));
          for (u in r) {
            var l = r[u];
            if (((c = i?.[u]), r.hasOwnProperty(u) && l !== c && (l != null || c != null)))
              if (u === `style`)
                if (c) {
                  for (s in c) !c.hasOwnProperty(s) || (l && l.hasOwnProperty(s)) || ((n ||= {}), (n[s] = ``));
                  for (s in l) l.hasOwnProperty(s) && c[s] !== l[s] && ((n ||= {}), (n[s] = l[s]));
                } else (n || ((o ||= []), o.push(u, n)), (n = l));
              else
                u === `dangerouslySetInnerHTML`
                  ? ((l = l ? l.__html : void 0),
                    (c = c ? c.__html : void 0),
                    l != null && c !== l && (o ||= []).push(u, l))
                  : u === `children`
                    ? (typeof l != `string` && typeof l != `number`) || (o ||= []).push(u, `` + l)
                    : u !== `suppressContentEditableWarning` &&
                      u !== `suppressHydrationWarning` &&
                      (a.hasOwnProperty(u)
                        ? (l != null && u === `onScroll` && G(`scroll`, e), o || c === l || (o = []))
                        : (o ||= []).push(u, l));
          }
          n && (o ||= []).push(`style`, n);
          var u = o;
          (t.updateQueue = u) && (t.flags |= 4);
        }
      },
      ic = function (e, t, n, r) {
        n !== r && (t.flags |= 4);
      };
    function ac(e, t) {
      if (!ya)
        switch (e.tailMode) {
          case `hidden`:
            t = e.tail;
            for (var n = null; t !== null; ) (t.alternate !== null && (n = t), (t = t.sibling));
            n === null ? (e.tail = null) : (n.sibling = null);
            break;
          case `collapsed`:
            n = e.tail;
            for (var r = null; n !== null; ) (n.alternate !== null && (r = n), (n = n.sibling));
            r === null ? (t || e.tail === null ? (e.tail = null) : (e.tail.sibling = null)) : (r.sibling = null);
        }
    }
    function oc(e) {
      var t = e.alternate !== null && e.alternate.child === e.child,
        n = 0,
        r = 0;
      if (t)
        for (var i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags & 14680064),
            (r |= i.flags & 14680064),
            (i.return = e),
            (i = i.sibling));
      else
        for (i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes), (r |= i.subtreeFlags), (r |= i.flags), (i.return = e), (i = i.sibling));
      return ((e.subtreeFlags |= r), (e.childLanes = n), t);
    }
    function sc(e, t, n) {
      var i = t.pendingProps;
      switch ((ga(t), t.tag)) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (oc(t), null);
        case 1:
          return (Ki(t.type) && qi(), oc(t), null);
        case 3:
          return (
            (i = t.stateNode),
            uo(),
            Bi(Ui),
            Bi(Hi),
            _o(),
            i.pendingContext && ((i.context = i.pendingContext), (i.pendingContext = null)),
            (e === null || e.child === null) &&
              (Ea(t)
                ? (t.flags |= 4)
                : e === null ||
                  (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                  ((t.flags |= 1024), ba !== null && (vl(ba), (ba = null)))),
            oc(t),
            null
          );
        case 5:
          po(t);
          var o = co(so.current);
          if (((n = t.type), e !== null && t.stateNode != null))
            (rc(e, t, n, i, o), e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
          else {
            if (!i) {
              if (t.stateNode === null) throw Error(r(166));
              return (oc(t), null);
            }
            if (((e = co(ao.current)), Ea(t))) {
              ((i = t.stateNode), (n = t.type));
              var s = t.memoizedProps;
              switch (((i[ki] = t), (i[Ai] = s), (e = (t.mode & 1) != 0), n)) {
                case `dialog`:
                  (G(`cancel`, i), G(`close`, i));
                  break;
                case `iframe`:
                case `object`:
                case `embed`:
                  G(`load`, i);
                  break;
                case `video`:
                case `audio`:
                  for (o = 0; o < ei.length; o++) G(ei[o], i);
                  break;
                case `source`:
                  G(`error`, i);
                  break;
                case `img`:
                case `image`:
                case `link`:
                  (G(`error`, i), G(`load`, i));
                  break;
                case `details`:
                  G(`toggle`, i);
                  break;
                case `input`:
                  (R(i, s), G(`invalid`, i));
                  break;
                case `select`:
                  ((i._wrapperState = { wasMultiple: !!s.multiple }), G(`invalid`, i));
                  break;
                case `textarea`:
                  (Ce(i, s), G(`invalid`, i));
              }
              for (var c in (Ie(n, s), (o = null), s))
                if (s.hasOwnProperty(c)) {
                  var l = s[c];
                  c === `children`
                    ? typeof l == `string`
                      ? i.textContent !== l &&
                        (!0 !== s.suppressHydrationWarning && gi(i.textContent, l, e), (o = [`children`, l]))
                      : typeof l == `number` &&
                        i.textContent !== `` + l &&
                        (!0 !== s.suppressHydrationWarning && gi(i.textContent, l, e), (o = [`children`, `` + l]))
                    : a.hasOwnProperty(c) && l != null && c === `onScroll` && G(`scroll`, i);
                }
              switch (n) {
                case `input`:
                  (L(i), ve(i, s, !0));
                  break;
                case `textarea`:
                  (L(i), Te(i));
                  break;
                case `select`:
                case `option`:
                  break;
                default:
                  typeof s.onClick == `function` && (i.onclick = _i);
              }
              ((i = o), (t.updateQueue = i), i !== null && (t.flags |= 4));
            } else {
              ((c = o.nodeType === 9 ? o : o.ownerDocument),
                e === `http://www.w3.org/1999/xhtml` && (e = Ee(n)),
                e === `http://www.w3.org/1999/xhtml`
                  ? n === `script`
                    ? ((e = c.createElement(`div`)),
                      (e.innerHTML = `<script><\/script>`),
                      (e = e.removeChild(e.firstChild)))
                    : typeof i.is == `string`
                      ? (e = c.createElement(n, { is: i.is }))
                      : ((e = c.createElement(n)),
                        n === `select` && ((c = e), i.multiple ? (c.multiple = !0) : i.size && (c.size = i.size)))
                  : (e = c.createElementNS(e, n)),
                (e[ki] = t),
                (e[Ai] = i),
                nc(e, t, !1, !1),
                (t.stateNode = e));
              a: {
                switch (((c = Le(n, i)), n)) {
                  case `dialog`:
                    (G(`cancel`, e), G(`close`, e), (o = i));
                    break;
                  case `iframe`:
                  case `object`:
                  case `embed`:
                    (G(`load`, e), (o = i));
                    break;
                  case `video`:
                  case `audio`:
                    for (o = 0; o < ei.length; o++) G(ei[o], e);
                    o = i;
                    break;
                  case `source`:
                    (G(`error`, e), (o = i));
                    break;
                  case `img`:
                  case `image`:
                  case `link`:
                    (G(`error`, e), G(`load`, e), (o = i));
                    break;
                  case `details`:
                    (G(`toggle`, e), (o = i));
                    break;
                  case `input`:
                    (R(e, i), (o = he(e, i)), G(`invalid`, e));
                    break;
                  case `option`:
                    o = i;
                    break;
                  case `select`:
                    ((e._wrapperState = { wasMultiple: !!i.multiple }),
                      (o = F({}, i, { value: void 0 })),
                      G(`invalid`, e));
                    break;
                  case `textarea`:
                    (Ce(e, i), (o = Se(e, i)), G(`invalid`, e));
                    break;
                  default:
                    o = i;
                }
                for (s in (Ie(n, o), (l = o), l))
                  if (l.hasOwnProperty(s)) {
                    var u = l[s];
                    s === `style`
                      ? Pe(e, u)
                      : s === `dangerouslySetInnerHTML`
                        ? ((u = u ? u.__html : void 0), u != null && ke(e, u))
                        : s === `children`
                          ? typeof u == `string`
                            ? (n !== `textarea` || u !== ``) && Ae(e, u)
                            : typeof u == `number` && Ae(e, `` + u)
                          : s !== `suppressContentEditableWarning` &&
                            s !== `suppressHydrationWarning` &&
                            s !== `autoFocus` &&
                            (a.hasOwnProperty(s)
                              ? u != null && s === `onScroll` && G(`scroll`, e)
                              : u != null && S(e, s, u, c));
                  }
                switch (n) {
                  case `input`:
                    (L(e), ve(e, i, !1));
                    break;
                  case `textarea`:
                    (L(e), Te(e));
                    break;
                  case `option`:
                    i.value != null && e.setAttribute(`value`, `` + I(i.value));
                    break;
                  case `select`:
                    ((e.multiple = !!i.multiple),
                      (s = i.value),
                      s == null
                        ? i.defaultValue != null && xe(e, !!i.multiple, i.defaultValue, !0)
                        : xe(e, !!i.multiple, s, !1));
                    break;
                  default:
                    typeof o.onClick == `function` && (e.onclick = _i);
                }
                switch (n) {
                  case `button`:
                  case `input`:
                  case `select`:
                  case `textarea`:
                    i = !!i.autoFocus;
                    break a;
                  case `img`:
                    i = !0;
                    break a;
                  default:
                    i = !1;
                }
              }
              i && (t.flags |= 4);
            }
            t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
          }
          return (oc(t), null);
        case 6:
          if (e && t.stateNode != null) ic(e, t, e.memoizedProps, i);
          else {
            if (typeof i != `string` && t.stateNode === null) throw Error(r(166));
            if (((n = co(so.current)), co(ao.current), Ea(t))) {
              if (
                ((i = t.stateNode),
                (n = t.memoizedProps),
                (i[ki] = t),
                (s = i.nodeValue !== n) && ((e = _a), e !== null))
              )
                switch (e.tag) {
                  case 3:
                    gi(i.nodeValue, n, (e.mode & 1) != 0);
                    break;
                  case 5:
                    !0 !== e.memoizedProps.suppressHydrationWarning && gi(i.nodeValue, n, (e.mode & 1) != 0);
                }
              s && (t.flags |= 4);
            } else ((i = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(i)), (i[ki] = t), (t.stateNode = i));
          }
          return (oc(t), null);
        case 13:
          if (
            (Bi(mo),
            (i = t.memoizedState),
            e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (ya && va !== null && t.mode & 1 && !(t.flags & 128)) (X(), Da(), (t.flags |= 98560), (s = !1));
            else if (((s = Ea(t)), i !== null && i.dehydrated !== null)) {
              if (e === null) {
                if (!s) throw Error(r(318));
                if (((s = t.memoizedState), (s = s === null ? null : s.dehydrated), !s)) throw Error(r(317));
                s[ki] = t;
              } else (Da(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4));
              (oc(t), (s = !1));
            } else (ba !== null && (vl(ba), (ba = null)), (s = !0));
            if (!s) return t.flags & 65536 ? t : null;
          }
          return t.flags & 128
            ? ((t.lanes = n), t)
            : ((i = i !== null),
              i !== (e !== null && e.memoizedState !== null) &&
                i &&
                ((t.child.flags |= 8192), t.mode & 1 && (e === null || mo.current & 1 ? Kc === 0 && (Kc = 3) : Ol())),
              t.updateQueue !== null && (t.flags |= 4),
              oc(t),
              null);
        case 4:
          return (uo(), e === null && oi(t.stateNode.containerInfo), oc(t), null);
        case 10:
          return (Va(t.type._context), oc(t), null);
        case 17:
          return (Ki(t.type) && qi(), oc(t), null);
        case 19:
          if ((Bi(mo), (s = t.memoizedState), s === null)) return (oc(t), null);
          if (((i = (t.flags & 128) != 0), (c = s.rendering), c === null))
            if (i) ac(s, !1);
            else {
              if (Kc !== 0 || (e !== null && e.flags & 128))
                for (e = t.child; e !== null; ) {
                  if (((c = ho(e)), c !== null)) {
                    for (
                      t.flags |= 128,
                        ac(s, !1),
                        i = c.updateQueue,
                        i !== null && ((t.updateQueue = i), (t.flags |= 4)),
                        t.subtreeFlags = 0,
                        i = n,
                        n = t.child;
                      n !== null;
                    )
                      ((s = n),
                        (e = i),
                        (s.flags &= 14680066),
                        (c = s.alternate),
                        c === null
                          ? ((s.childLanes = 0),
                            (s.lanes = e),
                            (s.child = null),
                            (s.subtreeFlags = 0),
                            (s.memoizedProps = null),
                            (s.memoizedState = null),
                            (s.updateQueue = null),
                            (s.dependencies = null),
                            (s.stateNode = null))
                          : ((s.childLanes = c.childLanes),
                            (s.lanes = c.lanes),
                            (s.child = c.child),
                            (s.subtreeFlags = 0),
                            (s.deletions = null),
                            (s.memoizedProps = c.memoizedProps),
                            (s.memoizedState = c.memoizedState),
                            (s.updateQueue = c.updateQueue),
                            (s.type = c.type),
                            (e = c.dependencies),
                            (s.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
                        (n = n.sibling));
                    return (Y(mo, (mo.current & 1) | 2), t.child);
                  }
                  e = e.sibling;
                }
              s.tail !== null && gt() > el && ((t.flags |= 128), (i = !0), ac(s, !1), (t.lanes = 4194304));
            }
          else {
            if (!i)
              if (((e = ho(c)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (i = !0),
                  (n = e.updateQueue),
                  n !== null && ((t.updateQueue = n), (t.flags |= 4)),
                  ac(s, !0),
                  s.tail === null && s.tailMode === `hidden` && !c.alternate && !ya)
                )
                  return (oc(t), null);
              } else
                2 * gt() - s.renderingStartTime > el &&
                  n !== 1073741824 &&
                  ((t.flags |= 128), (i = !0), ac(s, !1), (t.lanes = 4194304));
            s.isBackwards
              ? ((c.sibling = t.child), (t.child = c))
              : ((n = s.last), n === null ? (t.child = c) : (n.sibling = c), (s.last = c));
          }
          return s.tail === null
            ? (oc(t), null)
            : ((t = s.tail),
              (s.rendering = t),
              (s.tail = t.sibling),
              (s.renderingStartTime = gt()),
              (t.sibling = null),
              (n = mo.current),
              Y(mo, i ? (n & 1) | 2 : n & 1),
              t);
        case 22:
        case 23:
          return (
            wl(),
            (i = t.memoizedState !== null),
            e !== null && (e.memoizedState !== null) !== i && (t.flags |= 8192),
            i && t.mode & 1 ? Wc & 1073741824 && (oc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : oc(t),
            null
          );
        case 24:
          return null;
        case 25:
          return null;
      }
      throw Error(r(156, t.tag));
    }
    function cc(e, t) {
      switch ((ga(t), t.tag)) {
        case 1:
          return (Ki(t.type) && qi(), (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 3:
          return (
            uo(),
            Bi(Ui),
            Bi(Hi),
            _o(),
            (e = t.flags),
            e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 5:
          return (po(t), null);
        case 13:
          if ((Bi(mo), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
            if (t.alternate === null) throw Error(r(340));
            Da();
          }
          return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
        case 19:
          return (Bi(mo), null);
        case 4:
          return (uo(), null);
        case 10:
          return (Va(t.type._context), null);
        case 22:
        case 23:
          return (wl(), null);
        case 24:
          return null;
        default:
          return null;
      }
    }
    var lc = !1,
      uc = !1,
      dc = typeof WeakSet == `function` ? WeakSet : Set,
      Q = null;
    function fc(e, t) {
      var n = e.ref;
      if (n !== null)
        if (typeof n == `function`)
          try {
            n(null);
          } catch (n) {
            Rl(e, t, n);
          }
        else n.current = null;
    }
    function pc(e, t, n) {
      try {
        n();
      } catch (n) {
        Rl(e, t, n);
      }
    }
    var mc = !1;
    function hc(e, t) {
      if (((vi = mn), (e = Nr()), Pr(e))) {
        if (`selectionStart` in e) var n = { start: e.selectionStart, end: e.selectionEnd };
        else
          a: {
            n = ((n = e.ownerDocument) && n.defaultView) || window;
            var i = n.getSelection && n.getSelection();
            if (i && i.rangeCount !== 0) {
              n = i.anchorNode;
              var a = i.anchorOffset,
                o = i.focusNode;
              i = i.focusOffset;
              try {
                (n.nodeType, o.nodeType);
              } catch {
                n = null;
                break a;
              }
              var s = 0,
                c = -1,
                l = -1,
                u = 0,
                d = 0,
                f = e,
                p = null;
              b: for (;;) {
                for (
                  var m;
                  f !== n || (a !== 0 && f.nodeType !== 3) || (c = s + a),
                    f !== o || (i !== 0 && f.nodeType !== 3) || (l = s + i),
                    f.nodeType === 3 && (s += f.nodeValue.length),
                    (m = f.firstChild) !== null;
                )
                  ((p = f), (f = m));
                for (;;) {
                  if (f === e) break b;
                  if ((p === n && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null))
                    break;
                  ((f = p), (p = f.parentNode));
                }
                f = m;
              }
              n = c === -1 || l === -1 ? null : { start: c, end: l };
            } else n = null;
          }
        n ||= { start: 0, end: 0 };
      } else n = null;
      for (yi = { focusedElem: e, selectionRange: n }, mn = !1, Q = t; Q !== null; )
        if (((t = Q), (e = t.child), t.subtreeFlags & 1028 && e !== null)) ((e.return = t), (Q = e));
        else
          for (; Q !== null; ) {
            t = Q;
            try {
              var h = t.alternate;
              if (t.flags & 1024)
                switch (t.tag) {
                  case 0:
                  case 11:
                  case 15:
                    break;
                  case 1:
                    if (h !== null) {
                      var g = h.memoizedProps,
                        _ = h.memoizedState,
                        v = t.stateNode;
                      v.__reactInternalSnapshotBeforeUpdate = v.getSnapshotBeforeUpdate(
                        t.elementType === t.type ? g : hs(t.type, g),
                        _,
                      );
                    }
                    break;
                  case 3:
                    var y = t.stateNode.containerInfo;
                    y.nodeType === 1
                      ? (y.textContent = ``)
                      : y.nodeType === 9 && y.documentElement && y.removeChild(y.documentElement);
                    break;
                  case 5:
                  case 6:
                  case 4:
                  case 17:
                    break;
                  default:
                    throw Error(r(163));
                }
            } catch (e) {
              Rl(t, t.return, e);
            }
            if (((e = t.sibling), e !== null)) {
              ((e.return = t.return), (Q = e));
              break;
            }
            Q = t.return;
          }
      return ((h = mc), (mc = !1), h);
    }
    function gc(e, t, n) {
      var r = t.updateQueue;
      if (((r = r === null ? null : r.lastEffect), r !== null)) {
        var i = (r = r.next);
        do {
          if ((i.tag & e) === e) {
            var a = i.destroy;
            ((i.destroy = void 0), a !== void 0 && pc(t, n, a));
          }
          i = i.next;
        } while (i !== r);
      }
    }
    function _c(e, t) {
      if (((t = t.updateQueue), (t = t === null ? null : t.lastEffect), t !== null)) {
        var n = (t = t.next);
        do {
          if ((n.tag & e) === e) {
            var r = n.create;
            n.destroy = r();
          }
          n = n.next;
        } while (n !== t);
      }
    }
    function vc(e) {
      var t = e.ref;
      if (t !== null) {
        var n = e.stateNode;
        switch (e.tag) {
          case 5:
            e = n;
            break;
          default:
            e = n;
        }
        typeof t == `function` ? t(e) : (t.current = e);
      }
    }
    function yc(e) {
      var t = e.alternate;
      (t !== null && ((e.alternate = null), yc(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 &&
          ((t = e.stateNode), t !== null && (delete t[ki], delete t[Ai], delete t[Mi], delete t[Ni], delete t[Pi])),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    function bc(e) {
      return e.tag === 5 || e.tag === 3 || e.tag === 4;
    }
    function xc(e) {
      a: for (;;) {
        for (; e.sibling === null; ) {
          if (e.return === null || bc(e.return)) return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.flags & 2 || e.child === null || e.tag === 4) continue a;
          ((e.child.return = e), (e = e.child));
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Sc(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        ((e = e.stateNode),
          t
            ? n.nodeType === 8
              ? n.parentNode.insertBefore(e, t)
              : n.insertBefore(e, t)
            : (n.nodeType === 8 ? ((t = n.parentNode), t.insertBefore(e, n)) : ((t = n), t.appendChild(e)),
              (n = n._reactRootContainer),
              n != null || t.onclick !== null || (t.onclick = _i)));
      else if (r !== 4 && ((e = e.child), e !== null))
        for (Sc(e, t, n), e = e.sibling; e !== null; ) (Sc(e, t, n), (e = e.sibling));
    }
    function Cc(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
      else if (r !== 4 && ((e = e.child), e !== null))
        for (Cc(e, t, n), e = e.sibling; e !== null; ) (Cc(e, t, n), (e = e.sibling));
    }
    var wc = null,
      Tc = !1;
    function Ec(e, t, n) {
      for (n = n.child; n !== null; ) (Dc(e, t, n), (n = n.sibling));
    }
    function Dc(e, t, n) {
      if (wt && typeof wt.onCommitFiberUnmount == `function`)
        try {
          wt.onCommitFiberUnmount(Ct, n);
        } catch {}
      switch (n.tag) {
        case 5:
          uc || fc(n, t);
        case 6:
          var r = wc,
            i = Tc;
          ((wc = null),
            Ec(e, t, n),
            (wc = r),
            (Tc = i),
            wc !== null &&
              (Tc
                ? ((e = wc), (n = n.stateNode), e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
                : wc.removeChild(n.stateNode)));
          break;
        case 18:
          wc !== null &&
            (Tc
              ? ((e = wc),
                (n = n.stateNode),
                e.nodeType === 8 ? Ei(e.parentNode, n) : e.nodeType === 1 && Ei(e, n),
                fn(e))
              : Ei(wc, n.stateNode));
          break;
        case 4:
          ((r = wc), (i = Tc), (wc = n.stateNode.containerInfo), (Tc = !0), Ec(e, t, n), (wc = r), (Tc = i));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          if (!uc && ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))) {
            i = r = r.next;
            do {
              var a = i,
                o = a.destroy;
              ((a = a.tag), o !== void 0 && (a & 2 || a & 4) && pc(n, t, o), (i = i.next));
            } while (i !== r);
          }
          Ec(e, t, n);
          break;
        case 1:
          if (!uc && (fc(n, t), (r = n.stateNode), typeof r.componentWillUnmount == `function`))
            try {
              ((r.props = n.memoizedProps), (r.state = n.memoizedState), r.componentWillUnmount());
            } catch (e) {
              Rl(n, t, e);
            }
          Ec(e, t, n);
          break;
        case 21:
          Ec(e, t, n);
          break;
        case 22:
          n.mode & 1 ? ((uc = (r = uc) || n.memoizedState !== null), Ec(e, t, n), (uc = r)) : Ec(e, t, n);
          break;
        default:
          Ec(e, t, n);
      }
    }
    function Oc(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var n = e.stateNode;
        (n === null && (n = e.stateNode = new dc()),
          t.forEach(function (t) {
            var r = Hl.bind(null, e, t);
            n.has(t) || (n.add(t), t.then(r, r));
          }));
      }
    }
    function kc(e, t) {
      var n = t.deletions;
      if (n !== null)
        for (var i = 0; i < n.length; i++) {
          var a = n[i];
          try {
            var o = e,
              s = t,
              c = s;
            a: for (; c !== null; ) {
              switch (c.tag) {
                case 5:
                  ((wc = c.stateNode), (Tc = !1));
                  break a;
                case 3:
                  ((wc = c.stateNode.containerInfo), (Tc = !0));
                  break a;
                case 4:
                  ((wc = c.stateNode.containerInfo), (Tc = !0));
                  break a;
              }
              c = c.return;
            }
            if (wc === null) throw Error(r(160));
            (Dc(o, s, a), (wc = null), (Tc = !1));
            var l = a.alternate;
            (l !== null && (l.return = null), (a.return = null));
          } catch (e) {
            Rl(a, t, e);
          }
        }
      if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) (Ac(t, e), (t = t.sibling));
    }
    function Ac(e, t) {
      var n = e.alternate,
        i = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          if ((kc(t, e), jc(e), i & 4)) {
            try {
              (gc(3, e, e.return), _c(3, e));
            } catch (t) {
              Rl(e, e.return, t);
            }
            try {
              gc(5, e, e.return);
            } catch (t) {
              Rl(e, e.return, t);
            }
          }
          break;
        case 1:
          (kc(t, e), jc(e), i & 512 && n !== null && fc(n, n.return));
          break;
        case 5:
          if ((kc(t, e), jc(e), i & 512 && n !== null && fc(n, n.return), e.flags & 32)) {
            var a = e.stateNode;
            try {
              Ae(a, ``);
            } catch (t) {
              Rl(e, e.return, t);
            }
          }
          if (i & 4 && ((a = e.stateNode), a != null)) {
            var o = e.memoizedProps,
              s = n === null ? o : n.memoizedProps,
              c = e.type,
              l = e.updateQueue;
            if (((e.updateQueue = null), l !== null))
              try {
                (c === `input` && o.type === `radio` && o.name != null && ge(a, o), Le(c, s));
                var u = Le(c, o);
                for (s = 0; s < l.length; s += 2) {
                  var d = l[s],
                    f = l[s + 1];
                  d === `style`
                    ? Pe(a, f)
                    : d === `dangerouslySetInnerHTML`
                      ? ke(a, f)
                      : d === `children`
                        ? Ae(a, f)
                        : S(a, d, f, u);
                }
                switch (c) {
                  case `input`:
                    _e(a, o);
                    break;
                  case `textarea`:
                    we(a, o);
                    break;
                  case `select`:
                    var p = a._wrapperState.wasMultiple;
                    a._wrapperState.wasMultiple = !!o.multiple;
                    var m = o.value;
                    m == null
                      ? p !== !!o.multiple &&
                        (o.defaultValue == null
                          ? xe(a, !!o.multiple, o.multiple ? [] : ``, !1)
                          : xe(a, !!o.multiple, o.defaultValue, !0))
                      : xe(a, !!o.multiple, m, !1);
                }
                a[Ai] = o;
              } catch (t) {
                Rl(e, e.return, t);
              }
          }
          break;
        case 6:
          if ((kc(t, e), jc(e), i & 4)) {
            if (e.stateNode === null) throw Error(r(162));
            ((a = e.stateNode), (o = e.memoizedProps));
            try {
              a.nodeValue = o;
            } catch (t) {
              Rl(e, e.return, t);
            }
          }
          break;
        case 3:
          if ((kc(t, e), jc(e), i & 4 && n !== null && n.memoizedState.isDehydrated))
            try {
              fn(t.containerInfo);
            } catch (t) {
              Rl(e, e.return, t);
            }
          break;
        case 4:
          (kc(t, e), jc(e));
          break;
        case 13:
          (kc(t, e),
            jc(e),
            (a = e.child),
            a.flags & 8192 &&
              ((o = a.memoizedState !== null),
              (a.stateNode.isHidden = o),
              !o || (a.alternate !== null && a.alternate.memoizedState !== null) || ($c = gt())),
            i & 4 && Oc(e));
          break;
        case 22:
          if (
            ((d = n !== null && n.memoizedState !== null),
            e.mode & 1 ? ((uc = (u = uc) || d), kc(t, e), (uc = u)) : kc(t, e),
            jc(e),
            i & 8192)
          ) {
            if (((u = e.memoizedState !== null), (e.stateNode.isHidden = u) && !d && e.mode & 1))
              for (Q = e, d = e.child; d !== null; ) {
                for (f = Q = d; Q !== null; ) {
                  switch (((p = Q), (m = p.child), p.tag)) {
                    case 0:
                    case 11:
                    case 14:
                    case 15:
                      gc(4, p, p.return);
                      break;
                    case 1:
                      fc(p, p.return);
                      var h = p.stateNode;
                      if (typeof h.componentWillUnmount == `function`) {
                        ((i = p), (n = p.return));
                        try {
                          ((t = i), (h.props = t.memoizedProps), (h.state = t.memoizedState), h.componentWillUnmount());
                        } catch (e) {
                          Rl(i, n, e);
                        }
                      }
                      break;
                    case 5:
                      fc(p, p.return);
                      break;
                    case 22:
                      if (p.memoizedState !== null) {
                        Fc(f);
                        continue;
                      }
                  }
                  m === null ? Fc(f) : ((m.return = p), (Q = m));
                }
                d = d.sibling;
              }
            a: for (d = null, f = e; ; ) {
              if (f.tag === 5) {
                if (d === null) {
                  d = f;
                  try {
                    ((a = f.stateNode),
                      u
                        ? ((o = a.style),
                          typeof o.setProperty == `function`
                            ? o.setProperty(`display`, `none`, `important`)
                            : (o.display = `none`))
                        : ((c = f.stateNode),
                          (l = f.memoizedProps.style),
                          (s = l != null && l.hasOwnProperty(`display`) ? l.display : null),
                          (c.style.display = Ne(`display`, s))));
                  } catch (t) {
                    Rl(e, e.return, t);
                  }
                }
              } else if (f.tag === 6) {
                if (d === null)
                  try {
                    f.stateNode.nodeValue = u ? `` : f.memoizedProps;
                  } catch (t) {
                    Rl(e, e.return, t);
                  }
              } else if (((f.tag !== 22 && f.tag !== 23) || f.memoizedState === null || f === e) && f.child !== null) {
                ((f.child.return = f), (f = f.child));
                continue;
              }
              if (f === e) break a;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === e) break a;
                (d === f && (d = null), (f = f.return));
              }
              (d === f && (d = null), (f.sibling.return = f.return), (f = f.sibling));
            }
          }
          break;
        case 19:
          (kc(t, e), jc(e), i & 4 && Oc(e));
          break;
        case 21:
          break;
        default:
          (kc(t, e), jc(e));
      }
    }
    function jc(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          a: {
            for (var n = e.return; n !== null; ) {
              if (bc(n)) {
                var i = n;
                break a;
              }
              n = n.return;
            }
            throw Error(r(160));
          }
          switch (i.tag) {
            case 5:
              var a = i.stateNode;
              (i.flags & 32 && (Ae(a, ``), (i.flags &= -33)), Cc(e, xc(e), a));
              break;
            case 3:
            case 4:
              var o = i.stateNode.containerInfo;
              Sc(e, xc(e), o);
              break;
            default:
              throw Error(r(161));
          }
        } catch (t) {
          Rl(e, e.return, t);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function Mc(e, t, n) {
      ((Q = e), Nc(e, t, n));
    }
    function Nc(e, t, n) {
      for (var r = (e.mode & 1) != 0; Q !== null; ) {
        var i = Q,
          a = i.child;
        if (i.tag === 22 && r) {
          var o = i.memoizedState !== null || lc;
          if (!o) {
            var s = i.alternate,
              c = (s !== null && s.memoizedState !== null) || uc;
            s = lc;
            var l = uc;
            if (((lc = o), (uc = c) && !l))
              for (Q = i; Q !== null; )
                ((o = Q),
                  (c = o.child),
                  (o.tag === 22 && o.memoizedState !== null) || c === null ? Ic(i) : ((c.return = o), (Q = c)));
            for (; a !== null; ) ((Q = a), Nc(a, t, n), (a = a.sibling));
            ((Q = i), (lc = s), (uc = l));
          }
          Pc(e, t, n);
        } else i.subtreeFlags & 8772 && a !== null ? ((a.return = i), (Q = a)) : Pc(e, t, n);
      }
    }
    function Pc(e) {
      for (; Q !== null; ) {
        var t = Q;
        if (t.flags & 8772) {
          var n = t.alternate;
          try {
            if (t.flags & 8772)
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  uc || _c(5, t);
                  break;
                case 1:
                  var i = t.stateNode;
                  if (t.flags & 4 && !uc)
                    if (n === null) i.componentDidMount();
                    else {
                      var a = t.elementType === t.type ? n.memoizedProps : hs(t.type, n.memoizedProps);
                      i.componentDidUpdate(a, n.memoizedState, i.__reactInternalSnapshotBeforeUpdate);
                    }
                  var o = t.updateQueue;
                  o !== null && ro(t, o, i);
                  break;
                case 3:
                  var s = t.updateQueue;
                  if (s !== null) {
                    if (((n = null), t.child !== null))
                      switch (t.child.tag) {
                        case 5:
                          n = t.child.stateNode;
                          break;
                        case 1:
                          n = t.child.stateNode;
                      }
                    ro(t, s, n);
                  }
                  break;
                case 5:
                  var c = t.stateNode;
                  if (n === null && t.flags & 4) {
                    n = c;
                    var l = t.memoizedProps;
                    switch (t.type) {
                      case `button`:
                      case `input`:
                      case `select`:
                      case `textarea`:
                        l.autoFocus && n.focus();
                        break;
                      case `img`:
                        l.src && (n.src = l.src);
                    }
                  }
                  break;
                case 6:
                  break;
                case 4:
                  break;
                case 12:
                  break;
                case 13:
                  if (t.memoizedState === null) {
                    var u = t.alternate;
                    if (u !== null) {
                      var d = u.memoizedState;
                      if (d !== null) {
                        var f = d.dehydrated;
                        f !== null && fn(f);
                      }
                    }
                  }
                  break;
                case 19:
                case 17:
                case 21:
                case 22:
                case 23:
                case 25:
                  break;
                default:
                  throw Error(r(163));
              }
            uc || (t.flags & 512 && vc(t));
          } catch (e) {
            Rl(t, t.return, e);
          }
        }
        if (t === e) {
          Q = null;
          break;
        }
        if (((n = t.sibling), n !== null)) {
          ((n.return = t.return), (Q = n));
          break;
        }
        Q = t.return;
      }
    }
    function Fc(e) {
      for (; Q !== null; ) {
        var t = Q;
        if (t === e) {
          Q = null;
          break;
        }
        var n = t.sibling;
        if (n !== null) {
          ((n.return = t.return), (Q = n));
          break;
        }
        Q = t.return;
      }
    }
    function Ic(e) {
      for (; Q !== null; ) {
        var t = Q;
        try {
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              var n = t.return;
              try {
                _c(4, t);
              } catch (e) {
                Rl(t, n, e);
              }
              break;
            case 1:
              var r = t.stateNode;
              if (typeof r.componentDidMount == `function`) {
                var i = t.return;
                try {
                  r.componentDidMount();
                } catch (e) {
                  Rl(t, i, e);
                }
              }
              var a = t.return;
              try {
                vc(t);
              } catch (e) {
                Rl(t, a, e);
              }
              break;
            case 5:
              var o = t.return;
              try {
                vc(t);
              } catch (e) {
                Rl(t, o, e);
              }
          }
        } catch (e) {
          Rl(t, t.return, e);
        }
        if (t === e) {
          Q = null;
          break;
        }
        var s = t.sibling;
        if (s !== null) {
          ((s.return = t.return), (Q = s));
          break;
        }
        Q = t.return;
      }
    }
    var Lc = Math.ceil,
      Rc = C.ReactCurrentDispatcher,
      zc = C.ReactCurrentOwner,
      Bc = C.ReactCurrentBatchConfig,
      $ = 0,
      Vc = null,
      Hc = null,
      Uc = 0,
      Wc = 0,
      Gc = zi(0),
      Kc = 0,
      qc = null,
      Jc = 0,
      Yc = 0,
      Xc = 0,
      Zc = null,
      Qc = null,
      $c = 0,
      el = 1 / 0,
      tl = null,
      nl = !1,
      rl = null,
      il = null,
      al = !1,
      ol = null,
      sl = 0,
      cl = 0,
      ll = null,
      ul = -1,
      dl = 0;
    function fl() {
      return $ & 6 ? gt() : ul === -1 ? (ul = gt()) : ul;
    }
    function pl(e) {
      return e.mode & 1
        ? $ & 2 && Uc !== 0
          ? Uc & -Uc
          : ka.transition === null
            ? ((e = B), e === 0 ? ((e = window.event), (e = e === void 0 ? 16 : bn(e.type)), e) : e)
            : (dl === 0 && (dl = Lt()), dl)
        : 1;
    }
    function ml(e, t, n, i) {
      if (50 < cl) throw ((cl = 0), (ll = null), Error(r(185)));
      (zt(e, n, i),
        (!($ & 2) || e !== Vc) &&
          (e === Vc && (!($ & 2) && (Yc |= n), Kc === 4 && bl(e, Uc)),
          hl(e, i),
          n === 1 && $ === 0 && !(t.mode & 1) && ((el = gt() + 500), $i && ra())));
    }
    function hl(e, t) {
      var n = e.callbackNode;
      Ft(e, t);
      var r = Nt(e, e === Vc ? Uc : 0);
      if (r === 0) (n !== null && pt(n), (e.callbackNode = null), (e.callbackPriority = 0));
      else if (((t = r & -r), e.callbackPriority !== t)) {
        if ((n != null && pt(n), t === 1))
          (e.tag === 0 ? na(xl.bind(null, e)) : ta(xl.bind(null, e)),
            wi(function () {
              !($ & 6) && ra();
            }),
            (n = null));
        else {
          switch (Ht(r)) {
            case 1:
              n = vt;
              break;
            case 4:
              n = yt;
              break;
            case 16:
              n = bt;
              break;
            case 536870912:
              n = St;
              break;
            default:
              n = bt;
          }
          n = Wl(n, gl.bind(null, e));
        }
        ((e.callbackPriority = t), (e.callbackNode = n));
      }
    }
    function gl(e, t) {
      if (((ul = -1), (dl = 0), $ & 6)) throw Error(r(327));
      var n = e.callbackNode;
      if (Il() && e.callbackNode !== n) return null;
      var i = Nt(e, e === Vc ? Uc : 0);
      if (i === 0) return null;
      if (i & 30 || (i & e.expiredLanes) !== 0 || t) t = kl(e, i);
      else {
        t = i;
        var a = $;
        $ |= 2;
        var o = Dl();
        (Vc !== e || Uc !== t) && ((tl = null), (el = gt() + 500), Tl(e, t));
        do
          try {
            jl();
            break;
          } catch (t) {
            El(e, t);
          }
        while (1);
        (Ba(), (Rc.current = o), ($ = a), Hc === null ? ((Vc = null), (Uc = 0), (t = Kc)) : (t = 0));
      }
      if (t !== 0) {
        if ((t === 2 && ((a = It(e)), a !== 0 && ((i = a), (t = _l(e, a)))), t === 1))
          throw ((n = qc), Tl(e, 0), bl(e, i), hl(e, gt()), n);
        if (t === 6) bl(e, i);
        else {
          if (
            ((a = e.current.alternate),
            !(i & 30) &&
              !yl(a) &&
              ((t = kl(e, i)), t === 2 && ((o = It(e)), o !== 0 && ((i = o), (t = _l(e, o)))), t === 1))
          )
            throw ((n = qc), Tl(e, 0), bl(e, i), hl(e, gt()), n);
          switch (((e.finishedWork = a), (e.finishedLanes = i), t)) {
            case 0:
            case 1:
              throw Error(r(345));
            case 2:
              Pl(e, Qc, tl);
              break;
            case 3:
              if ((bl(e, i), (i & 130023424) === i && ((t = $c + 500 - gt()), 10 < t))) {
                if (Nt(e, 0) !== 0) break;
                if (((a = e.suspendedLanes), (a & i) !== i)) {
                  (fl(), (e.pingedLanes |= e.suspendedLanes & a));
                  break;
                }
                e.timeoutHandle = xi(Pl.bind(null, e, Qc, tl), t);
                break;
              }
              Pl(e, Qc, tl);
              break;
            case 4:
              if ((bl(e, i), (i & 4194240) === i)) break;
              for (t = e.eventTimes, a = -1; 0 < i; ) {
                var s = 31 - Et(i);
                ((o = 1 << s), (s = t[s]), s > a && (a = s), (i &= ~o));
              }
              if (
                ((i = a),
                (i = gt() - i),
                (i =
                  (120 > i
                    ? 120
                    : 480 > i
                      ? 480
                      : 1080 > i
                        ? 1080
                        : 1920 > i
                          ? 1920
                          : 3e3 > i
                            ? 3e3
                            : 4320 > i
                              ? 4320
                              : 1960 * Lc(i / 1960)) - i),
                10 < i)
              ) {
                e.timeoutHandle = xi(Pl.bind(null, e, Qc, tl), i);
                break;
              }
              Pl(e, Qc, tl);
              break;
            case 5:
              Pl(e, Qc, tl);
              break;
            default:
              throw Error(r(329));
          }
        }
      }
      return (hl(e, gt()), e.callbackNode === n ? gl.bind(null, e) : null);
    }
    function _l(e, t) {
      var n = Zc;
      return (
        e.current.memoizedState.isDehydrated && (Tl(e, t).flags |= 256),
        (e = kl(e, t)),
        e !== 2 && ((t = Qc), (Qc = n), t !== null && vl(t)),
        e
      );
    }
    function vl(e) {
      Qc === null ? (Qc = e) : Qc.push.apply(Qc, e);
    }
    function yl(e) {
      for (var t = e; ; ) {
        if (t.flags & 16384) {
          var n = t.updateQueue;
          if (n !== null && ((n = n.stores), n !== null))
            for (var r = 0; r < n.length; r++) {
              var i = n[r],
                a = i.getSnapshot;
              i = i.value;
              try {
                if (!Or(a(), i)) return !1;
              } catch {
                return !1;
              }
            }
        }
        if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n));
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      }
      return !0;
    }
    function bl(e, t) {
      for (t &= ~Xc, t &= ~Yc, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
        var n = 31 - Et(t),
          r = 1 << n;
        ((e[n] = -1), (t &= ~r));
      }
    }
    function xl(e) {
      if ($ & 6) throw Error(r(327));
      Il();
      var t = Nt(e, 0);
      if (!(t & 1)) return (hl(e, gt()), null);
      var n = kl(e, t);
      if (e.tag !== 0 && n === 2) {
        var i = It(e);
        i !== 0 && ((t = i), (n = _l(e, i)));
      }
      if (n === 1) throw ((n = qc), Tl(e, 0), bl(e, t), hl(e, gt()), n);
      if (n === 6) throw Error(r(345));
      return ((e.finishedWork = e.current.alternate), (e.finishedLanes = t), Pl(e, Qc, tl), hl(e, gt()), null);
    }
    function Sl(e, t) {
      var n = $;
      $ |= 1;
      try {
        return e(t);
      } finally {
        (($ = n), $ === 0 && ((el = gt() + 500), $i && ra()));
      }
    }
    function Cl(e) {
      ol !== null && ol.tag === 0 && !($ & 6) && Il();
      var t = $;
      $ |= 1;
      var n = Bc.transition,
        r = B;
      try {
        if (((Bc.transition = null), (B = 1), e)) return e();
      } finally {
        ((B = r), (Bc.transition = n), ($ = t), !($ & 6) && ra());
      }
    }
    function wl() {
      ((Wc = Gc.current), Bi(Gc));
    }
    function Tl(e, t) {
      ((e.finishedWork = null), (e.finishedLanes = 0));
      var n = e.timeoutHandle;
      if ((n !== -1 && ((e.timeoutHandle = -1), Si(n)), Hc !== null))
        for (n = Hc.return; n !== null; ) {
          var r = n;
          switch ((ga(r), r.tag)) {
            case 1:
              ((r = r.type.childContextTypes), r != null && qi());
              break;
            case 3:
              (uo(), Bi(Ui), Bi(Hi), _o());
              break;
            case 5:
              po(r);
              break;
            case 4:
              uo();
              break;
            case 13:
              Bi(mo);
              break;
            case 19:
              Bi(mo);
              break;
            case 10:
              Va(r.type._context);
              break;
            case 22:
            case 23:
              wl();
          }
          n = n.return;
        }
      if (
        ((Vc = e),
        (Hc = e = Yl(e.current, null)),
        (Uc = Wc = t),
        (Kc = 0),
        (qc = null),
        (Xc = Yc = Jc = 0),
        (Qc = Zc = null),
        Ga !== null)
      ) {
        for (t = 0; t < Ga.length; t++)
          if (((n = Ga[t]), (r = n.interleaved), r !== null)) {
            n.interleaved = null;
            var i = r.next,
              a = n.pending;
            if (a !== null) {
              var o = a.next;
              ((a.next = i), (r.next = o));
            }
            n.pending = r;
          }
        Ga = null;
      }
      return e;
    }
    function El(e, t) {
      do {
        var n = Hc;
        try {
          if ((Ba(), (vo.current = ds), wo)) {
            for (var i = xo.memoizedState; i !== null; ) {
              var a = i.queue;
              (a !== null && (a.pending = null), (i = i.next));
            }
            wo = !1;
          }
          if (
            ((bo = 0), (Co = So = xo = null), (To = !1), (Eo = 0), (zc.current = null), n === null || n.return === null)
          ) {
            ((Kc = 1), (qc = t), (Hc = null));
            break;
          }
          a: {
            var o = e,
              s = n.return,
              c = n,
              l = t;
            if (((t = Uc), (c.flags |= 32768), typeof l == `object` && l && typeof l.then == `function`)) {
              var u = l,
                d = c,
                f = d.tag;
              if (!(d.mode & 1) && (f === 0 || f === 11 || f === 15)) {
                var p = d.alternate;
                p
                  ? ((d.updateQueue = p.updateQueue), (d.memoizedState = p.memoizedState), (d.lanes = p.lanes))
                  : ((d.updateQueue = null), (d.memoizedState = null));
              }
              var m = ks(s);
              if (m !== null) {
                ((m.flags &= -257), As(m, s, c, o, t), m.mode & 1 && Os(o, u, t), (t = m), (l = u));
                var h = t.updateQueue;
                if (h === null) {
                  var g = new Set();
                  (g.add(l), (t.updateQueue = g));
                } else h.add(l);
                break a;
              } else {
                if (!(t & 1)) {
                  (Os(o, u, t), Ol());
                  break a;
                }
                l = Error(r(426));
              }
            } else if (ya && c.mode & 1) {
              var _ = ks(s);
              if (_ !== null) {
                (!(_.flags & 65536) && (_.flags |= 256), As(_, s, c, o, t), Oa(Ss(l, c)));
                break a;
              }
            }
            ((o = l = Ss(l, c)), Kc !== 4 && (Kc = 2), Zc === null ? (Zc = [o]) : Zc.push(o), (o = s));
            do {
              switch (o.tag) {
                case 3:
                  ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
                  var v = Es(o, l, t);
                  to(o, v);
                  break a;
                case 1:
                  c = l;
                  var y = o.type,
                    b = o.stateNode;
                  if (
                    !(o.flags & 128) &&
                    (typeof y.getDerivedStateFromError == `function` ||
                      (b !== null && typeof b.componentDidCatch == `function` && (il === null || !il.has(b))))
                  ) {
                    ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
                    var x = Ds(o, c, t);
                    to(o, x);
                    break a;
                  }
              }
              o = o.return;
            } while (o !== null);
          }
          Nl(n);
        } catch (e) {
          ((t = e), Hc === n && n !== null && (Hc = n = n.return));
          continue;
        }
        break;
      } while (1);
    }
    function Dl() {
      var e = Rc.current;
      return ((Rc.current = ds), e === null ? ds : e);
    }
    function Ol() {
      ((Kc === 0 || Kc === 3 || Kc === 2) && (Kc = 4),
        Vc === null || (!(Jc & 268435455) && !(Yc & 268435455)) || bl(Vc, Uc));
    }
    function kl(e, t) {
      var n = $;
      $ |= 2;
      var i = Dl();
      (Vc !== e || Uc !== t) && ((tl = null), Tl(e, t));
      do
        try {
          Al();
          break;
        } catch (t) {
          El(e, t);
        }
      while (1);
      if ((Ba(), ($ = n), (Rc.current = i), Hc !== null)) throw Error(r(261));
      return ((Vc = null), (Uc = 0), Kc);
    }
    function Al() {
      for (; Hc !== null; ) Ml(Hc);
    }
    function jl() {
      for (; Hc !== null && !mt(); ) Ml(Hc);
    }
    function Ml(e) {
      var t = Ul(e.alternate, e, Wc);
      ((e.memoizedProps = e.pendingProps), t === null ? Nl(e) : (Hc = t), (zc.current = null));
    }
    function Nl(e) {
      var t = e;
      do {
        var n = t.alternate;
        if (((e = t.return), t.flags & 32768)) {
          if (((n = cc(n, t)), n !== null)) {
            ((n.flags &= 32767), (Hc = n));
            return;
          }
          if (e !== null) ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
          else {
            ((Kc = 6), (Hc = null));
            return;
          }
        } else if (((n = sc(n, t, Wc)), n !== null)) {
          Hc = n;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          Hc = t;
          return;
        }
        Hc = t = e;
      } while (t !== null);
      Kc === 0 && (Kc = 5);
    }
    function Pl(e, t, n) {
      var r = B,
        i = Bc.transition;
      try {
        ((Bc.transition = null), (B = 1), Fl(e, t, n, r));
      } finally {
        ((Bc.transition = i), (B = r));
      }
      return null;
    }
    function Fl(e, t, n, i) {
      do Il();
      while (ol !== null);
      if ($ & 6) throw Error(r(327));
      n = e.finishedWork;
      var a = e.finishedLanes;
      if (n === null) return null;
      if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current)) throw Error(r(177));
      ((e.callbackNode = null), (e.callbackPriority = 0));
      var o = n.lanes | n.childLanes;
      if (
        (Bt(e, o),
        e === Vc && ((Hc = Vc = null), (Uc = 0)),
        (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
          al ||
          ((al = !0),
          Wl(bt, function () {
            return (Il(), null);
          })),
        (o = (n.flags & 15990) != 0),
        n.subtreeFlags & 15990 || o)
      ) {
        ((o = Bc.transition), (Bc.transition = null));
        var s = B;
        B = 1;
        var c = $;
        (($ |= 4),
          (zc.current = null),
          hc(e, n),
          Ac(n, e),
          Fr(yi),
          (mn = !!vi),
          (yi = vi = null),
          (e.current = n),
          Mc(n, e, a),
          ht(),
          ($ = c),
          (B = s),
          (Bc.transition = o));
      } else e.current = n;
      if (
        (al && ((al = !1), (ol = e), (sl = a)),
        (o = e.pendingLanes),
        o === 0 && (il = null),
        Tt(n.stateNode, i),
        hl(e, gt()),
        t !== null)
      )
        for (i = e.onRecoverableError, n = 0; n < t.length; n++)
          ((a = t[n]), i(a.value, { componentStack: a.stack, digest: a.digest }));
      if (nl) throw ((nl = !1), (e = rl), (rl = null), e);
      return (
        sl & 1 && e.tag !== 0 && Il(),
        (o = e.pendingLanes),
        o & 1 ? (e === ll ? cl++ : ((cl = 0), (ll = e))) : (cl = 0),
        ra(),
        null
      );
    }
    function Il() {
      if (ol !== null) {
        var e = Ht(sl),
          t = Bc.transition,
          n = B;
        try {
          if (((Bc.transition = null), (B = 16 > e ? 16 : e), ol === null)) var i = !1;
          else {
            if (((e = ol), (ol = null), (sl = 0), $ & 6)) throw Error(r(331));
            var a = $;
            for ($ |= 4, Q = e.current; Q !== null; ) {
              var o = Q,
                s = o.child;
              if (Q.flags & 16) {
                var c = o.deletions;
                if (c !== null) {
                  for (var l = 0; l < c.length; l++) {
                    var u = c[l];
                    for (Q = u; Q !== null; ) {
                      var d = Q;
                      switch (d.tag) {
                        case 0:
                        case 11:
                        case 15:
                          gc(8, d, o);
                      }
                      var f = d.child;
                      if (f !== null) ((f.return = d), (Q = f));
                      else
                        for (; Q !== null; ) {
                          d = Q;
                          var p = d.sibling,
                            m = d.return;
                          if ((yc(d), d === u)) {
                            Q = null;
                            break;
                          }
                          if (p !== null) {
                            ((p.return = m), (Q = p));
                            break;
                          }
                          Q = m;
                        }
                    }
                  }
                  var h = o.alternate;
                  if (h !== null) {
                    var g = h.child;
                    if (g !== null) {
                      h.child = null;
                      do {
                        var _ = g.sibling;
                        ((g.sibling = null), (g = _));
                      } while (g !== null);
                    }
                  }
                  Q = o;
                }
              }
              if (o.subtreeFlags & 2064 && s !== null) ((s.return = o), (Q = s));
              else
                b: for (; Q !== null; ) {
                  if (((o = Q), o.flags & 2048))
                    switch (o.tag) {
                      case 0:
                      case 11:
                      case 15:
                        gc(9, o, o.return);
                    }
                  var v = o.sibling;
                  if (v !== null) {
                    ((v.return = o.return), (Q = v));
                    break b;
                  }
                  Q = o.return;
                }
            }
            var y = e.current;
            for (Q = y; Q !== null; ) {
              s = Q;
              var b = s.child;
              if (s.subtreeFlags & 2064 && b !== null) ((b.return = s), (Q = b));
              else
                b: for (s = y; Q !== null; ) {
                  if (((c = Q), c.flags & 2048))
                    try {
                      switch (c.tag) {
                        case 0:
                        case 11:
                        case 15:
                          _c(9, c);
                      }
                    } catch (e) {
                      Rl(c, c.return, e);
                    }
                  if (c === s) {
                    Q = null;
                    break b;
                  }
                  var x = c.sibling;
                  if (x !== null) {
                    ((x.return = c.return), (Q = x));
                    break b;
                  }
                  Q = c.return;
                }
            }
            if ((($ = a), ra(), wt && typeof wt.onPostCommitFiberRoot == `function`))
              try {
                wt.onPostCommitFiberRoot(Ct, e);
              } catch {}
            i = !0;
          }
          return i;
        } finally {
          ((B = n), (Bc.transition = t));
        }
      }
      return !1;
    }
    function Ll(e, t, n) {
      ((t = Ss(n, t)), (t = Es(e, t, 1)), (e = $a(e, t, 1)), (t = fl()), e !== null && (zt(e, 1, t), hl(e, t)));
    }
    function Rl(e, t, n) {
      if (e.tag === 3) Ll(e, e, n);
      else
        for (; t !== null; ) {
          if (t.tag === 3) {
            Ll(t, e, n);
            break;
          } else if (t.tag === 1) {
            var r = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == `function` ||
              (typeof r.componentDidCatch == `function` && (il === null || !il.has(r)))
            ) {
              ((e = Ss(n, e)), (e = Ds(t, e, 1)), (t = $a(t, e, 1)), (e = fl()), t !== null && (zt(t, 1, e), hl(t, e)));
              break;
            }
          }
          t = t.return;
        }
    }
    function zl(e, t, n) {
      var r = e.pingCache;
      (r !== null && r.delete(t),
        (t = fl()),
        (e.pingedLanes |= e.suspendedLanes & n),
        Vc === e &&
          (Uc & n) === n &&
          (Kc === 4 || (Kc === 3 && (Uc & 130023424) === Uc && 500 > gt() - $c) ? Tl(e, 0) : (Xc |= n)),
        hl(e, t));
    }
    function Bl(e, t) {
      t === 0 && (e.mode & 1 ? ((t = jt), (jt <<= 1), !(jt & 130023424) && (jt = 4194304)) : (t = 1));
      var n = fl();
      ((e = Ja(e, t)), e !== null && (zt(e, t, n), hl(e, n)));
    }
    function Vl(e) {
      var t = e.memoizedState,
        n = 0;
      (t !== null && (n = t.retryLane), Bl(e, n));
    }
    function Hl(e, t) {
      var n = 0;
      switch (e.tag) {
        case 13:
          var i = e.stateNode,
            a = e.memoizedState;
          a !== null && (n = a.retryLane);
          break;
        case 19:
          i = e.stateNode;
          break;
        default:
          throw Error(r(314));
      }
      (i !== null && i.delete(t), Bl(e, n));
    }
    var Ul = function (e, t, n) {
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps || Ui.current) Ms = !0;
        else {
          if ((e.lanes & n) === 0 && !(t.flags & 128)) return ((Ms = !1), tc(e, t, n));
          Ms = !!(e.flags & 131072);
        }
      else ((Ms = !1), ya && t.flags & 1048576 && ma(t, sa, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 2:
          var i = t.type;
          ($s(e, t), (e = t.pendingProps));
          var a = Gi(t, Hi.current);
          (Ua(t, n), (a = Ao(null, t, i, e, a, n)));
          var o = jo();
          return (
            (t.flags |= 1),
            typeof a == `object` && a && typeof a.render == `function` && a.$$typeof === void 0
              ? ((t.tag = 1),
                (t.memoizedState = null),
                (t.updateQueue = null),
                Ki(i) ? ((o = !0), Xi(t)) : (o = !1),
                (t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null),
                Xa(t),
                (a.updater = _s),
                (t.stateNode = a),
                (a._reactInternals = t),
                xs(t, i, e, n),
                (t = Vs(null, t, i, !0, o, n)))
              : ((t.tag = 0), ya && o && ha(t), Ns(null, t, a, n), (t = t.child)),
            t
          );
        case 16:
          i = t.elementType;
          a: {
            switch (
              ($s(e, t),
              (e = t.pendingProps),
              (a = i._init),
              (i = a(i._payload)),
              (t.type = i),
              (a = t.tag = Jl(i)),
              (e = hs(i, e)),
              a)
            ) {
              case 0:
                t = zs(null, t, i, e, n);
                break a;
              case 1:
                t = Bs(null, t, i, e, n);
                break a;
              case 11:
                t = Ps(null, t, i, e, n);
                break a;
              case 14:
                t = Fs(null, t, i, hs(i.type, e), n);
                break a;
            }
            throw Error(r(306, i, ``));
          }
          return t;
        case 0:
          return ((i = t.type), (a = t.pendingProps), (a = t.elementType === i ? a : hs(i, a)), zs(e, t, i, a, n));
        case 1:
          return ((i = t.type), (a = t.pendingProps), (a = t.elementType === i ? a : hs(i, a)), Bs(e, t, i, a, n));
        case 3:
          a: {
            if ((Hs(t), e === null)) throw Error(r(387));
            ((i = t.pendingProps), (o = t.memoizedState), (a = o.element), Za(e, t), no(t, i, null, n));
            var s = t.memoizedState;
            if (((i = s.element), o.isDehydrated))
              if (
                ((o = {
                  element: i,
                  isDehydrated: !1,
                  cache: s.cache,
                  pendingSuspenseBoundaries: s.pendingSuspenseBoundaries,
                  transitions: s.transitions,
                }),
                (t.updateQueue.baseState = o),
                (t.memoizedState = o),
                t.flags & 256)
              ) {
                ((a = Ss(Error(r(423)), t)), (t = Us(e, t, i, n, a)));
                break a;
              } else if (i !== a) {
                ((a = Ss(Error(r(424)), t)), (t = Us(e, t, i, n, a)));
                break a;
              } else
                for (
                  va = Di(t.stateNode.containerInfo.firstChild),
                    _a = t,
                    ya = !0,
                    ba = null,
                    n = Fa(t, null, i, n),
                    t.child = n;
                  n;
                )
                  ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
            else {
              if ((Da(), i === a)) {
                t = ec(e, t, n);
                break a;
              }
              Ns(e, t, i, n);
            }
            t = t.child;
          }
          return t;
        case 5:
          return (
            fo(t),
            e === null && wa(t),
            (i = t.type),
            (a = t.pendingProps),
            (o = e === null ? null : e.memoizedProps),
            (s = a.children),
            bi(i, a) ? (s = null) : o !== null && bi(i, o) && (t.flags |= 32),
            Rs(e, t),
            Ns(e, t, s, n),
            t.child
          );
        case 6:
          return (e === null && wa(t), null);
        case 13:
          return Ks(e, t, n);
        case 4:
          return (
            lo(t, t.stateNode.containerInfo),
            (i = t.pendingProps),
            e === null ? (t.child = Pa(t, null, i, n)) : Ns(e, t, i, n),
            t.child
          );
        case 11:
          return ((i = t.type), (a = t.pendingProps), (a = t.elementType === i ? a : hs(i, a)), Ps(e, t, i, a, n));
        case 7:
          return (Ns(e, t, t.pendingProps, n), t.child);
        case 8:
          return (Ns(e, t, t.pendingProps.children, n), t.child);
        case 12:
          return (Ns(e, t, t.pendingProps.children, n), t.child);
        case 10:
          a: {
            if (
              ((i = t.type._context),
              (a = t.pendingProps),
              (o = t.memoizedProps),
              (s = a.value),
              Y(Ia, i._currentValue),
              (i._currentValue = s),
              o !== null)
            )
              if (Or(o.value, s)) {
                if (o.children === a.children && !Ui.current) {
                  t = ec(e, t, n);
                  break a;
                }
              } else
                for (o = t.child, o !== null && (o.return = t); o !== null; ) {
                  var c = o.dependencies;
                  if (c !== null) {
                    s = o.child;
                    for (var l = c.firstContext; l !== null; ) {
                      if (l.context === i) {
                        if (o.tag === 1) {
                          ((l = Qa(-1, n & -n)), (l.tag = 2));
                          var u = o.updateQueue;
                          if (u !== null) {
                            u = u.shared;
                            var d = u.pending;
                            (d === null ? (l.next = l) : ((l.next = d.next), (d.next = l)), (u.pending = l));
                          }
                        }
                        ((o.lanes |= n),
                          (l = o.alternate),
                          l !== null && (l.lanes |= n),
                          Ha(o.return, n, t),
                          (c.lanes |= n));
                        break;
                      }
                      l = l.next;
                    }
                  } else if (o.tag === 10) s = o.type === t.type ? null : o.child;
                  else if (o.tag === 18) {
                    if (((s = o.return), s === null)) throw Error(r(341));
                    ((s.lanes |= n), (c = s.alternate), c !== null && (c.lanes |= n), Ha(s, n, t), (s = o.sibling));
                  } else s = o.child;
                  if (s !== null) s.return = o;
                  else
                    for (s = o; s !== null; ) {
                      if (s === t) {
                        s = null;
                        break;
                      }
                      if (((o = s.sibling), o !== null)) {
                        ((o.return = s.return), (s = o));
                        break;
                      }
                      s = s.return;
                    }
                  o = s;
                }
            (Ns(e, t, a.children, n), (t = t.child));
          }
          return t;
        case 9:
          return (
            (a = t.type),
            (i = t.pendingProps.children),
            Ua(t, n),
            (a = Wa(a)),
            (i = i(a)),
            (t.flags |= 1),
            Ns(e, t, i, n),
            t.child
          );
        case 14:
          return ((i = t.type), (a = hs(i, t.pendingProps)), (a = hs(i.type, a)), Fs(e, t, i, a, n));
        case 15:
          return Is(e, t, t.type, t.pendingProps, n);
        case 17:
          return (
            (i = t.type),
            (a = t.pendingProps),
            (a = t.elementType === i ? a : hs(i, a)),
            $s(e, t),
            (t.tag = 1),
            Ki(i) ? ((e = !0), Xi(t)) : (e = !1),
            Ua(t, n),
            ys(t, i, a),
            xs(t, i, a, n),
            Vs(null, t, i, !0, e, n)
          );
        case 19:
          return Qs(e, t, n);
        case 22:
          return Ls(e, t, n);
      }
      throw Error(r(156, t.tag));
    };
    function Wl(e, t) {
      return ft(e, t);
    }
    function Gl(e, t, n, r) {
      ((this.tag = e),
        (this.key = n),
        (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
        (this.index = 0),
        (this.ref = null),
        (this.pendingProps = t),
        (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function Kl(e, t, n, r) {
      return new Gl(e, t, n, r);
    }
    function ql(e) {
      return ((e = e.prototype), !(!e || !e.isReactComponent));
    }
    function Jl(e) {
      if (typeof e == `function`) return +!!ql(e);
      if (e != null) {
        if (((e = e.$$typeof), e === j)) return 11;
        if (e === N) return 14;
      }
      return 2;
    }
    function Yl(e, t) {
      var n = e.alternate;
      return (
        n === null
          ? ((n = Kl(e.tag, t, e.key, e.mode)),
            (n.elementType = e.elementType),
            (n.type = e.type),
            (n.stateNode = e.stateNode),
            (n.alternate = e),
            (e.alternate = n))
          : ((n.pendingProps = t), (n.type = e.type), (n.flags = 0), (n.subtreeFlags = 0), (n.deletions = null)),
        (n.flags = e.flags & 14680064),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        n
      );
    }
    function Xl(e, t, n, i, a, o) {
      var s = 2;
      if (((i = e), typeof e == `function`)) ql(e) && (s = 1);
      else if (typeof e == `string`) s = 5;
      else
        a: switch (e) {
          case E:
            return Zl(n.children, a, o, t);
          case D:
            ((s = 8), (a |= 8));
            break;
          case O:
            return ((e = Kl(12, n, t, a | 2)), (e.elementType = O), (e.lanes = o), e);
          case M:
            return ((e = Kl(13, n, t, a)), (e.elementType = M), (e.lanes = o), e);
          case ee:
            return ((e = Kl(19, n, t, a)), (e.elementType = ee), (e.lanes = o), e);
          case te:
            return Ql(n, a, o, t);
          default:
            if (typeof e == `object` && e)
              switch (e.$$typeof) {
                case k:
                  s = 10;
                  break a;
                case A:
                  s = 9;
                  break a;
                case j:
                  s = 11;
                  break a;
                case N:
                  s = 14;
                  break a;
                case P:
                  ((s = 16), (i = null));
                  break a;
              }
            throw Error(r(130, e == null ? e : typeof e, ``));
        }
      return ((t = Kl(s, n, t, a)), (t.elementType = e), (t.type = i), (t.lanes = o), t);
    }
    function Zl(e, t, n, r) {
      return ((e = Kl(7, e, r, t)), (e.lanes = n), e);
    }
    function Ql(e, t, n, r) {
      return ((e = Kl(22, e, r, t)), (e.elementType = te), (e.lanes = n), (e.stateNode = { isHidden: !1 }), e);
    }
    function $l(e, t, n) {
      return ((e = Kl(6, e, null, t)), (e.lanes = n), e);
    }
    function eu(e, t, n) {
      return (
        (t = Kl(4, e.children === null ? [] : e.children, e.key, t)),
        (t.lanes = n),
        (t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }),
        t
      );
    }
    function tu(e, t, n, r, i) {
      ((this.tag = t),
        (this.containerInfo = e),
        (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode = this.pendingContext = this.context = null),
        (this.callbackPriority = 0),
        (this.eventTimes = Rt(0)),
        (this.expirationTimes = Rt(-1)),
        (this.entangledLanes =
          this.finishedLanes =
          this.mutableReadLanes =
          this.expiredLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = Rt(0)),
        (this.identifierPrefix = r),
        (this.onRecoverableError = i),
        (this.mutableSourceEagerHydrationData = null));
    }
    function nu(e, t, n, r, i, a, o, s, c) {
      return (
        (e = new tu(e, t, n, s, c)),
        t === 1 ? ((t = 1), !0 === a && (t |= 8)) : (t = 0),
        (a = Kl(3, null, null, t)),
        (e.current = a),
        (a.stateNode = e),
        (a.memoizedState = {
          element: r,
          isDehydrated: n,
          cache: null,
          transitions: null,
          pendingSuspenseBoundaries: null,
        }),
        Xa(a),
        e
      );
    }
    function ru(e, t, n) {
      var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return { $$typeof: T, key: r == null ? null : `` + r, children: e, containerInfo: t, implementation: n };
    }
    function iu(e) {
      if (!e) return Vi;
      e = e._reactInternals;
      a: {
        if (ot(e) !== e || e.tag !== 1) throw Error(r(170));
        var t = e;
        do {
          switch (t.tag) {
            case 3:
              t = t.stateNode.context;
              break a;
            case 1:
              if (Ki(t.type)) {
                t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                break a;
              }
          }
          t = t.return;
        } while (t !== null);
        throw Error(r(171));
      }
      if (e.tag === 1) {
        var n = e.type;
        if (Ki(n)) return Yi(e, n, t);
      }
      return t;
    }
    function au(e, t, n, r, i, a, o, s, c) {
      return (
        (e = nu(n, r, !0, e, i, a, o, s, c)),
        (e.context = iu(null)),
        (n = e.current),
        (r = fl()),
        (i = pl(n)),
        (a = Qa(r, i)),
        (a.callback = t ?? null),
        $a(n, a, i),
        (e.current.lanes = i),
        zt(e, i, r),
        hl(e, r),
        e
      );
    }
    function ou(e, t, n, r) {
      var i = t.current,
        a = fl(),
        o = pl(i);
      return (
        (n = iu(n)),
        t.context === null ? (t.context = n) : (t.pendingContext = n),
        (t = Qa(a, o)),
        (t.payload = { element: e }),
        (r = r === void 0 ? null : r),
        r !== null && (t.callback = r),
        (e = $a(i, t, o)),
        e !== null && (ml(e, i, o, a), eo(e, i, o)),
        o
      );
    }
    function su(e) {
      if (((e = e.current), !e.child)) return null;
      switch (e.child.tag) {
        case 5:
          return e.child.stateNode;
        default:
          return e.child.stateNode;
      }
    }
    function cu(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t;
      }
    }
    function lu(e, t) {
      (cu(e, t), (e = e.alternate) && cu(e, t));
    }
    function uu() {
      return null;
    }
    var du =
      typeof reportError == `function`
        ? reportError
        : function (e) {
            console.error(e);
          };
    function fu(e) {
      this._internalRoot = e;
    }
    ((pu.prototype.render = fu.prototype.render =
      function (e) {
        var t = this._internalRoot;
        if (t === null) throw Error(r(409));
        ou(e, t, null, null);
      }),
      (pu.prototype.unmount = fu.prototype.unmount =
        function () {
          var e = this._internalRoot;
          if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            (Cl(function () {
              ou(null, e, null, null);
            }),
              (t[ji] = null));
          }
        }));
    function pu(e) {
      this._internalRoot = e;
    }
    pu.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = Kt();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < tn.length && t !== 0 && t < tn[n].priority; n++);
        (tn.splice(n, 0, e), n === 0 && sn(e));
      }
    };
    function mu(e) {
      return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
    }
    function hu(e) {
      return !(
        !e ||
        (e.nodeType !== 1 &&
          e.nodeType !== 9 &&
          e.nodeType !== 11 &&
          (e.nodeType !== 8 || e.nodeValue !== ` react-mount-point-unstable `))
      );
    }
    function gu() {}
    function _u(e, t, n, r, i) {
      if (i) {
        if (typeof r == `function`) {
          var a = r;
          r = function () {
            var e = su(o);
            a.call(e);
          };
        }
        var o = au(t, r, e, 0, null, !1, !1, ``, gu);
        return ((e._reactRootContainer = o), (e[ji] = o.current), oi(e.nodeType === 8 ? e.parentNode : e), Cl(), o);
      }
      for (; (i = e.lastChild); ) e.removeChild(i);
      if (typeof r == `function`) {
        var s = r;
        r = function () {
          var e = su(c);
          s.call(e);
        };
      }
      var c = nu(e, 0, !1, null, null, !1, !1, ``, gu);
      return (
        (e._reactRootContainer = c),
        (e[ji] = c.current),
        oi(e.nodeType === 8 ? e.parentNode : e),
        Cl(function () {
          ou(t, c, n, r);
        }),
        c
      );
    }
    function vu(e, t, n, r, i) {
      var a = n._reactRootContainer;
      if (a) {
        var o = a;
        if (typeof i == `function`) {
          var s = i;
          i = function () {
            var e = su(o);
            s.call(e);
          };
        }
        ou(t, o, e, i);
      } else o = _u(n, t, e, i, r);
      return su(o);
    }
    ((Ut = function (e) {
      switch (e.tag) {
        case 3:
          var t = e.stateNode;
          if (t.current.memoizedState.isDehydrated) {
            var n = Mt(t.pendingLanes);
            n !== 0 && (Vt(t, n | 1), hl(t, gt()), !($ & 6) && ((el = gt() + 500), ra()));
          }
          break;
        case 13:
          (Cl(function () {
            var t = Ja(e, 1);
            t !== null && ml(t, e, 1, fl());
          }),
            lu(e, 1));
      }
    }),
      (Wt = function (e) {
        if (e.tag === 13) {
          var t = Ja(e, 134217728);
          (t !== null && ml(t, e, 134217728, fl()), lu(e, 134217728));
        }
      }),
      (Gt = function (e) {
        if (e.tag === 13) {
          var t = pl(e),
            n = Ja(e, t);
          (n !== null && ml(n, e, t, fl()), lu(e, t));
        }
      }),
      (Kt = function () {
        return B;
      }),
      (qt = function (e, t) {
        var n = B;
        try {
          return ((B = e), t());
        } finally {
          B = n;
        }
      }),
      (Be = function (e, t, n) {
        switch (t) {
          case `input`:
            if ((_e(e, n), (t = n.name), n.type === `radio` && t != null)) {
              for (n = e; n.parentNode; ) n = n.parentNode;
              for (
                n = n.querySelectorAll(`input[name=` + JSON.stringify(`` + t) + `][type="radio"]`), t = 0;
                t < n.length;
                t++
              ) {
                var i = n[t];
                if (i !== e && i.form === e.form) {
                  var a = J(i);
                  if (!a) throw Error(r(90));
                  (pe(i), _e(i, a));
                }
              }
            }
            break;
          case `textarea`:
            we(e, n);
            break;
          case `select`:
            ((t = n.value), t != null && xe(e, !!n.multiple, t, !1));
        }
      }),
      (Ke = Sl),
      (qe = Cl));
    var yu = { usingClientEntryPoint: !1, Events: [q, Ii, J, We, Ge, Sl] },
      bu = { findFiberByHostInstance: Fi, bundleType: 0, version: `18.3.1`, rendererPackageName: `react-dom` },
      xu = {
        bundleType: bu.bundleType,
        version: bu.version,
        rendererPackageName: bu.rendererPackageName,
        rendererConfig: bu.rendererConfig,
        overrideHookState: null,
        overrideHookStateDeletePath: null,
        overrideHookStateRenamePath: null,
        overrideProps: null,
        overridePropsDeletePath: null,
        overridePropsRenamePath: null,
        setErrorHandler: null,
        setSuspenseHandler: null,
        scheduleUpdate: null,
        currentDispatcherRef: C.ReactCurrentDispatcher,
        findHostInstanceByFiber: function (e) {
          return ((e = ut(e)), e === null ? null : e.stateNode);
        },
        findFiberByHostInstance: bu.findFiberByHostInstance || uu,
        findHostInstancesForRefresh: null,
        scheduleRefresh: null,
        scheduleRoot: null,
        setRefreshHandler: null,
        getCurrentFiber: null,
        reconcilerVersion: `18.3.1-next-f1338f8080-20240426`,
      };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
      var Su = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Su.isDisabled && Su.supportsFiber)
        try {
          ((Ct = Su.inject(xu)), (wt = Su));
        } catch {}
    }
    ((e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = yu),
      (e.createPortal = function (e, t) {
        var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!mu(t)) throw Error(r(200));
        return ru(e, t, null, n);
      }),
      (e.createRoot = function (e, t) {
        if (!mu(e)) throw Error(r(299));
        var n = !1,
          i = ``,
          a = du;
        return (
          t != null &&
            (!0 === t.unstable_strictMode && (n = !0),
            t.identifierPrefix !== void 0 && (i = t.identifierPrefix),
            t.onRecoverableError !== void 0 && (a = t.onRecoverableError)),
          (t = nu(e, 1, !1, null, null, n, !1, i, a)),
          (e[ji] = t.current),
          oi(e.nodeType === 8 ? e.parentNode : e),
          new fu(t)
        );
      }),
      (e.findDOMNode = function (e) {
        if (e == null) return null;
        if (e.nodeType === 1) return e;
        var t = e._reactInternals;
        if (t === void 0)
          throw typeof e.render == `function` ? Error(r(188)) : ((e = Object.keys(e).join(`,`)), Error(r(268, e)));
        return ((e = ut(t)), (e = e === null ? null : e.stateNode), e);
      }),
      (e.flushSync = function (e) {
        return Cl(e);
      }),
      (e.hydrate = function (e, t, n) {
        if (!hu(t)) throw Error(r(200));
        return vu(null, e, t, !0, n);
      }),
      (e.hydrateRoot = function (e, t, n) {
        if (!mu(e)) throw Error(r(405));
        var i = (n != null && n.hydratedSources) || null,
          a = !1,
          o = ``,
          s = du;
        if (
          (n != null &&
            (!0 === n.unstable_strictMode && (a = !0),
            n.identifierPrefix !== void 0 && (o = n.identifierPrefix),
            n.onRecoverableError !== void 0 && (s = n.onRecoverableError)),
          (t = au(t, null, e, 1, n ?? null, a, !1, o, s)),
          (e[ji] = t.current),
          oi(e),
          i)
        )
          for (e = 0; e < i.length; e++)
            ((n = i[e]),
              (a = n._getVersion),
              (a = a(n._source)),
              t.mutableSourceEagerHydrationData == null
                ? (t.mutableSourceEagerHydrationData = [n, a])
                : t.mutableSourceEagerHydrationData.push(n, a));
        return new pu(t);
      }),
      (e.render = function (e, t, n) {
        if (!hu(t)) throw Error(r(200));
        return vu(null, e, t, !1, n);
      }),
      (e.unmountComponentAtNode = function (e) {
        if (!hu(e)) throw Error(r(40));
        return e._reactRootContainer
          ? (Cl(function () {
              vu(null, null, e, !1, function () {
                ((e._reactRootContainer = null), (e[ji] = null));
              });
            }),
            !0)
          : !1;
      }),
      (e.unstable_batchedUpdates = Sl),
      (e.unstable_renderSubtreeIntoContainer = function (e, t, n, i) {
        if (!hu(n)) throw Error(r(200));
        if (e == null || e._reactInternals === void 0) throw Error(r(38));
        return vu(e, t, n, !1, i);
      }),
      (e.version = `18.3.1-next-f1338f8080-20240426`));
  }),
  h = o((e, t) => {
    function n() {
      if (
        !(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`)
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = m()));
  }),
  g = o((e) => {
    var t = h();
    ((e.createRoot = t.createRoot), (e.hydrateRoot = t.hydrateRoot));
  }),
  _ = l(d()),
  v = l(g()),
  y = l(h());
function b() {
  return (
    (b = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    b.apply(this, arguments)
  );
}
var x;
(function (e) {
  ((e.Pop = `POP`), (e.Push = `PUSH`), (e.Replace = `REPLACE`));
})((x ||= {}));
var S = `popstate`;
function C(e) {
  e === void 0 && (e = {});
  function t(e, t) {
    let { pathname: n, search: r, hash: i } = e.location;
    return O(
      ``,
      { pathname: n, search: r, hash: i },
      (t.state && t.state.usr) || null,
      (t.state && t.state.key) || `default`,
    );
  }
  function n(e, t) {
    return typeof t == `string` ? t : k(t);
  }
  return j(t, n, null, e);
}
function w(e, t) {
  if (e === !1 || e == null) throw Error(t);
}
function T(e, t) {
  if (!e) {
    typeof console < `u` && console.warn(t);
    try {
      throw Error(t);
    } catch {}
  }
}
function E() {
  return Math.random().toString(36).substr(2, 8);
}
function D(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function O(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    b({ pathname: typeof e == `string` ? e : e.pathname, search: ``, hash: `` }, typeof t == `string` ? A(t) : t, {
      state: n,
      key: (t && t.key) || r || E(),
    })
  );
}
function k(e) {
  let { pathname: t = `/`, search: n = ``, hash: r = `` } = e;
  return (
    n && n !== `?` && (t += n.charAt(0) === `?` ? n : `?` + n),
    r && r !== `#` && (t += r.charAt(0) === `#` ? r : `#` + r),
    t
  );
}
function A(e) {
  let t = {};
  if (e) {
    let n = e.indexOf(`#`);
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf(`?`);
    (r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))), e && (t.pathname = e));
  }
  return t;
}
function j(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: i = document.defaultView, v5Compat: a = !1 } = r,
    o = i.history,
    s = x.Pop,
    c = null,
    l = u();
  l ?? ((l = 0), o.replaceState(b({}, o.state, { idx: l }), ``));
  function u() {
    return (o.state || { idx: null }).idx;
  }
  function d() {
    s = x.Pop;
    let e = u(),
      t = e == null ? null : e - l;
    ((l = e), c && c({ action: s, location: h.location, delta: t }));
  }
  function f(e, t) {
    s = x.Push;
    let r = O(h.location, e, t);
    (n && n(r, e), (l = u() + 1));
    let d = D(r, l),
      f = h.createHref(r);
    try {
      o.pushState(d, ``, f);
    } catch (e) {
      if (e instanceof DOMException && e.name === `DataCloneError`) throw e;
      i.location.assign(f);
    }
    a && c && c({ action: s, location: h.location, delta: 1 });
  }
  function p(e, t) {
    s = x.Replace;
    let r = O(h.location, e, t);
    (n && n(r, e), (l = u()));
    let i = D(r, l),
      d = h.createHref(r);
    (o.replaceState(i, ``, d), a && c && c({ action: s, location: h.location, delta: 0 }));
  }
  function m(e) {
    let t = i.location.origin === `null` ? i.location.href : i.location.origin,
      n = typeof e == `string` ? e : k(e);
    return (
      (n = n.replace(/ $/, `%20`)),
      w(t, `No window.location.(origin|href) available to create URL for href: ` + n),
      new URL(n, t)
    );
  }
  let h = {
    get action() {
      return s;
    },
    get location() {
      return e(i, o);
    },
    listen(e) {
      if (c) throw Error(`A history only accepts one active listener`);
      return (
        i.addEventListener(S, d),
        (c = e),
        () => {
          (i.removeEventListener(S, d), (c = null));
        }
      );
    },
    createHref(e) {
      return t(i, e);
    },
    createURL: m,
    encodeLocation(e) {
      let t = m(e);
      return { pathname: t.pathname, search: t.search, hash: t.hash };
    },
    push: f,
    replace: p,
    go(e) {
      return o.go(e);
    },
  };
  return h;
}
var M;
(function (e) {
  ((e.data = `data`), (e.deferred = `deferred`), (e.redirect = `redirect`), (e.error = `error`));
})((M ||= {}));
function ee(e, t, n) {
  return (n === void 0 && (n = `/`), N(e, t, n, !1));
}
function N(e, t, n, r) {
  let i = pe((typeof t == `string` ? A(t) : t).pathname || `/`, n);
  if (i == null) return null;
  let a = P(e);
  ne(a);
  let o = null;
  for (let e = 0; o == null && e < a.length; ++e) {
    let t = L(i);
    o = I(a[e], t, r);
  }
  return o;
}
function P(e, t, n, r) {
  (t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = ``));
  let i = (e, i, a) => {
    let o = {
      relativePath: a === void 0 ? e.path || `` : a,
      caseSensitive: e.caseSensitive === !0,
      childrenIndex: i,
      route: e,
    };
    o.relativePath.startsWith(`/`) &&
      (w(
        o.relativePath.startsWith(r),
        `Absolute route path "` +
          o.relativePath +
          `" nested under path ` +
          (`"` + r + `" is not valid. An absolute child route path `) +
          `must start with the combined path of all its parent routes.`,
      ),
      (o.relativePath = o.relativePath.slice(r.length)));
    let s = xe([r, o.relativePath]),
      c = n.concat(o);
    (e.children &&
      e.children.length > 0 &&
      (w(
        e.index !== !0,
        `Index routes must not have child routes. Please remove ` + (`all child routes from route path "` + s + `".`),
      ),
      P(e.children, t, c, s)),
      !(e.path == null && !e.index) && t.push({ path: s, score: le(s, e.index), routesMeta: c }));
  };
  return (
    e.forEach((e, t) => {
      var n;
      if (e.path === `` || !((n = e.path) != null && n.includes(`?`))) i(e, t);
      else for (let n of te(e.path)) i(e, t, n);
    }),
    t
  );
}
function te(e) {
  let t = e.split(`/`);
  if (t.length === 0) return [];
  let [n, ...r] = t,
    i = n.endsWith(`?`),
    a = n.replace(/\?$/, ``);
  if (r.length === 0) return i ? [a, ``] : [a];
  let o = te(r.join(`/`)),
    s = [];
  return (
    s.push(...o.map((e) => (e === `` ? a : [a, e].join(`/`)))),
    i && s.push(...o),
    s.map((t) => (e.startsWith(`/`) && t === `` ? `/` : t))
  );
}
function ne(e) {
  e.sort((e, t) =>
    e.score === t.score
      ? ue(
          e.routesMeta.map((e) => e.childrenIndex),
          t.routesMeta.map((e) => e.childrenIndex),
        )
      : t.score - e.score,
  );
}
var re = /^:[\w-]+$/,
  F = 3,
  ie = 2,
  ae = 1,
  oe = 10,
  se = -2,
  ce = (e) => e === `*`;
function le(e, t) {
  let n = e.split(`/`),
    r = n.length;
  return (
    n.some(ce) && (r += se),
    t && (r += ie),
    n.filter((e) => !ce(e)).reduce((e, t) => e + (re.test(t) ? F : t === `` ? ae : oe), r)
  );
}
function ue(e, t) {
  return e.length === t.length && e.slice(0, -1).every((e, n) => e === t[n]) ? e[e.length - 1] - t[t.length - 1] : 0;
}
function I(e, t, n) {
  n === void 0 && (n = !1);
  let { routesMeta: r } = e,
    i = {},
    a = `/`,
    o = [];
  for (let e = 0; e < r.length; ++e) {
    let s = r[e],
      c = e === r.length - 1,
      l = a === `/` ? t : t.slice(a.length) || `/`,
      u = de({ path: s.relativePath, caseSensitive: s.caseSensitive, end: c }, l),
      d = s.route;
    if (
      (!u &&
        c &&
        n &&
        !r[r.length - 1].route.index &&
        (u = de({ path: s.relativePath, caseSensitive: s.caseSensitive, end: !1 }, l)),
      !u)
    )
      return null;
    (Object.assign(i, u.params),
      o.push({ params: i, pathname: xe([a, u.pathname]), pathnameBase: Se(xe([a, u.pathnameBase])), route: d }),
      u.pathnameBase !== `/` && (a = xe([a, u.pathnameBase])));
  }
  return o;
}
function de(e, t) {
  typeof e == `string` && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = fe(e.path, e.caseSensitive, e.end),
    i = t.match(n);
  if (!i) return null;
  let a = i[0],
    o = a.replace(/(.)\/+$/, `$1`),
    s = i.slice(1);
  return {
    params: r.reduce((e, t, n) => {
      let { paramName: r, isOptional: i } = t;
      if (r === `*`) {
        let e = s[n] || ``;
        o = a.slice(0, a.length - e.length).replace(/(.)\/+$/, `$1`);
      }
      let c = s[n];
      return (i && !c ? (e[r] = void 0) : (e[r] = (c || ``).replace(/%2F/g, `/`)), e);
    }, {}),
    pathname: a,
    pathnameBase: o,
    pattern: e,
  };
}
function fe(e, t, n) {
  (t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    T(
      e === `*` || !e.endsWith(`*`) || e.endsWith(`/*`),
      `Route path "` +
        e +
        `" will be treated as if it were ` +
        (`"` + e.replace(/\*$/, `/*`) + '" because the `*` character must ') +
        'always follow a `/` in the pattern. To get rid of this warning, ' +
        (`please change the route path to "` + e.replace(/\*$/, `/*`) + `".`),
    ));
  let r = [],
    i =
      `^` +
      e
        .replace(/\/*\*?$/, ``)
        .replace(/^\/*/, `/`)
        .replace(/[\\.*+^${}|()[\]]/g, `\\$&`)
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (e, t, n) => (r.push({ paramName: t, isOptional: n != null }), n ? `/?([^\\/]+)?` : `/([^\\/]+)`),
        );
  return (
    e.endsWith(`*`)
      ? (r.push({ paramName: `*` }), (i += e === `*` || e === `/*` ? `(.*)$` : `(?:\\/(.+)|\\/*)$`))
      : n
        ? (i += `\\/*$`)
        : e !== `` && e !== `/` && (i += `(?:(?=\\/|$))`),
    [new RegExp(i, t ? void 0 : `i`), r]
  );
}
function L(e) {
  try {
    return e
      .split(`/`)
      .map((e) => decodeURIComponent(e).replace(/\//g, `%2F`))
      .join(`/`);
  } catch (t) {
    return (
      T(
        !1,
        `The URL path "` +
          e +
          `" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ` +
          (`encoding (` + t + `).`),
      ),
      e
    );
  }
}
function pe(e, t) {
  if (t === `/`) return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith(`/`) ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== `/` ? null : e.slice(n) || `/`;
}
var me = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  he = (e) => me.test(e);
function R(e, t) {
  t === void 0 && (t = `/`);
  let { pathname: n, search: r = ``, hash: i = `` } = typeof e == `string` ? A(e) : e,
    a;
  if (n)
    if (he(n)) a = n;
    else {
      if (n.includes(`//`)) {
        let e = n;
        ((n = n.replace(/\/\/+/g, `/`)),
          T(!1, `Pathnames cannot have embedded double slashes - normalizing ` + (e + ` -> ` + n)));
      }
      a = n.startsWith(`/`) ? ge(n.substring(1), `/`) : ge(n, t);
    }
  else a = t;
  return { pathname: a, search: Ce(r), hash: we(i) };
}
function ge(e, t) {
  let n = t.replace(/\/+$/, ``).split(`/`);
  return (
    e.split(`/`).forEach((e) => {
      e === `..` ? n.length > 1 && n.pop() : e !== `.` && n.push(e);
    }),
    n.length > 1 ? n.join(`/`) : `/`
  );
}
function _e(e, t, n, r) {
  return (
    `Cannot include a '` +
    e +
    `' character in a manually specified ` +
    ('`to.' + t + '` field [' + JSON.stringify(r) + `].  Please separate it out to the `) +
    ('`to.' + n + '` field. Alternatively you may provide the full path as ') +
    `a string in <Link to="..."> and the router will parse it for you.`
  );
}
function ve(e) {
  return e.filter((e, t) => t === 0 || (e.route.path && e.route.path.length > 0));
}
function ye(e, t) {
  let n = ve(e);
  return t ? n.map((e, t) => (t === n.length - 1 ? e.pathname : e.pathnameBase)) : n.map((e) => e.pathnameBase);
}
function be(e, t, n, r) {
  r === void 0 && (r = !1);
  let i;
  typeof e == `string`
    ? (i = A(e))
    : ((i = b({}, e)),
      w(!i.pathname || !i.pathname.includes(`?`), _e(`?`, `pathname`, `search`, i)),
      w(!i.pathname || !i.pathname.includes(`#`), _e(`#`, `pathname`, `hash`, i)),
      w(!i.search || !i.search.includes(`#`), _e(`#`, `search`, `hash`, i)));
  let a = e === `` || i.pathname === ``,
    o = a ? `/` : i.pathname,
    s;
  if (o == null) s = n;
  else {
    let e = t.length - 1;
    if (!r && o.startsWith(`..`)) {
      let t = o.split(`/`);
      for (; t[0] === `..`; ) (t.shift(), --e);
      i.pathname = t.join(`/`);
    }
    s = e >= 0 ? t[e] : `/`;
  }
  let c = R(i, s),
    l = o && o !== `/` && o.endsWith(`/`),
    u = (a || o === `.`) && n.endsWith(`/`);
  return (!c.pathname.endsWith(`/`) && (l || u) && (c.pathname += `/`), c);
}
var xe = (e) => e.join(`/`).replace(/\/\/+/g, `/`),
  Se = (e) => e.replace(/\/+$/, ``).replace(/^\/*/, `/`),
  Ce = (e) => (!e || e === `?` ? `` : e.startsWith(`?`) ? e : `?` + e),
  we = (e) => (!e || e === `#` ? `` : e.startsWith(`#`) ? e : `#` + e);
function Te(e) {
  return (
    e != null &&
    typeof e.status == `number` &&
    typeof e.statusText == `string` &&
    typeof e.internal == `boolean` &&
    `data` in e
  );
}
var Ee = [`post`, `put`, `patch`, `delete`];
new Set(Ee);
var De = [`get`, ...Ee];
new Set(De);
function Oe() {
  return (
    (Oe = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Oe.apply(this, arguments)
  );
}
var ke = _.createContext(null),
  Ae = _.createContext(null),
  je = _.createContext(null),
  Me = _.createContext(null),
  Ne = _.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  Pe = _.createContext(null);
function Fe() {
  return _.useContext(Me) != null;
}
function Ie() {
  return (!Fe() && w(!1), _.useContext(Me).location);
}
function Le(e) {
  _.useContext(je).static || _.useLayoutEffect(e);
}
function Re() {
  let { isDataRoute: e } = _.useContext(Ne);
  return e ? $e() : ze();
}
function ze() {
  !Fe() && w(!1);
  let e = _.useContext(ke),
    { basename: t, future: n, navigator: r } = _.useContext(je),
    { matches: i } = _.useContext(Ne),
    { pathname: a } = Ie(),
    o = JSON.stringify(ye(i, n.v7_relativeSplatPath)),
    s = _.useRef(!1);
  return (
    Le(() => {
      s.current = !0;
    }),
    _.useCallback(
      function (n, i) {
        if ((i === void 0 && (i = {}), !s.current)) return;
        if (typeof n == `number`) {
          r.go(n);
          return;
        }
        let c = be(n, JSON.parse(o), a, i.relative === `path`);
        (e == null && t !== `/` && (c.pathname = c.pathname === `/` ? t : xe([t, c.pathname])),
          (i.replace ? r.replace : r.push)(c, i.state, i));
      },
      [t, r, o, a, e],
    )
  );
}
function Be(e, t) {
  return Ve(e, t);
}
function Ve(e, t, n, r) {
  !Fe() && w(!1);
  let { navigator: i } = _.useContext(je),
    { matches: a } = _.useContext(Ne),
    o = a[a.length - 1],
    s = o ? o.params : {};
  o && o.pathname;
  let c = o ? o.pathnameBase : `/`;
  o && o.route;
  let l = Ie(),
    u;
  if (t) {
    let e = typeof t == `string` ? A(t) : t;
    (!(c === `/` || e.pathname?.startsWith(c)) && w(!1), (u = e));
  } else u = l;
  let d = u.pathname || `/`,
    f = d;
  if (c !== `/`) {
    let e = c.replace(/^\//, ``).split(`/`);
    f = `/` + d.replace(/^\//, ``).split(`/`).slice(e.length).join(`/`);
  }
  let p = ee(e, { pathname: f }),
    m = Ke(
      p &&
        p.map((e) =>
          Object.assign({}, e, {
            params: Object.assign({}, s, e.params),
            pathname: xe([c, i.encodeLocation ? i.encodeLocation(e.pathname).pathname : e.pathname]),
            pathnameBase:
              e.pathnameBase === `/`
                ? c
                : xe([c, i.encodeLocation ? i.encodeLocation(e.pathnameBase).pathname : e.pathnameBase]),
          }),
        ),
      a,
      n,
      r,
    );
  return t && m
    ? _.createElement(
        Me.Provider,
        {
          value: {
            location: Oe({ pathname: `/`, search: ``, hash: ``, state: null, key: `default` }, u),
            navigationType: x.Pop,
          },
        },
        m,
      )
    : m;
}
function He() {
  let e = z(),
    t = Te(e) ? e.status + ` ` + e.statusText : e instanceof Error ? e.message : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null;
  return _.createElement(
    _.Fragment,
    null,
    _.createElement(`h2`, null, `Unexpected Application Error!`),
    _.createElement(`h3`, { style: { fontStyle: `italic` } }, t),
    n ? _.createElement(`pre`, { style: { padding: `0.5rem`, backgroundColor: `rgba(200,200,200, 0.5)` } }, n) : null,
    null,
  );
}
var Ue = _.createElement(He, null),
  We = class extends _.Component {
    constructor(e) {
      (super(e), (this.state = { location: e.location, revalidation: e.revalidation, error: e.error }));
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      return t.location !== e.location || (t.revalidation !== `idle` && e.revalidation === `idle`)
        ? { error: e.error, location: e.location, revalidation: e.revalidation }
        : {
            error: e.error === void 0 ? t.error : e.error,
            location: t.location,
            revalidation: e.revalidation || t.revalidation,
          };
    }
    componentDidCatch(e, t) {
      console.error(`React Router caught the following error during render`, e, t);
    }
    render() {
      return this.state.error === void 0
        ? this.props.children
        : _.createElement(
            Ne.Provider,
            { value: this.props.routeContext },
            _.createElement(Pe.Provider, { value: this.state.error, children: this.props.component }),
          );
    }
  };
function Ge(e) {
  let { routeContext: t, match: n, children: r } = e,
    i = _.useContext(ke);
  return (
    i &&
      i.static &&
      i.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (i.staticContext._deepestRenderedBoundaryId = n.route.id),
    _.createElement(Ne.Provider, { value: t }, r)
  );
}
function Ke(e, t, n, r) {
  if ((t === void 0 && (t = []), n === void 0 && (n = null), r === void 0 && (r = null), e == null)) {
    var i;
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if ((i = r) != null && i.v7_partialHydration && t.length === 0 && !n.initialized && n.matches.length > 0)
      e = n.matches;
    else return null;
  }
  let a = e,
    o = n?.errors;
  if (o != null) {
    let e = a.findIndex((e) => e.route.id && o?.[e.route.id] !== void 0);
    (!(e >= 0) && w(!1), (a = a.slice(0, Math.min(a.length, e + 1))));
  }
  let s = !1,
    c = -1;
  if (n && r && r.v7_partialHydration)
    for (let e = 0; e < a.length; e++) {
      let t = a[e];
      if (((t.route.HydrateFallback || t.route.hydrateFallbackElement) && (c = e), t.route.id)) {
        let { loaderData: e, errors: r } = n,
          i = t.route.loader && e[t.route.id] === void 0 && (!r || r[t.route.id] === void 0);
        if (t.route.lazy || i) {
          ((s = !0), (a = c >= 0 ? a.slice(0, c + 1) : [a[0]]));
          break;
        }
      }
    }
  return a.reduceRight((e, r, i) => {
    let l,
      u = !1,
      d = null,
      f = null;
    n &&
      ((l = o && r.route.id ? o[r.route.id] : void 0),
      (d = r.route.errorElement || Ue),
      s &&
        (c < 0 && i === 0
          ? (tt(`route-fallback`, !1, 'No `HydrateFallback` element provided to render during initial hydration'),
            (u = !0),
            (f = null))
          : c === i && ((u = !0), (f = r.route.hydrateFallbackElement || null))));
    let p = t.concat(a.slice(0, i + 1)),
      m = () => {
        let t;
        return (
          (t = l
            ? d
            : u
              ? f
              : r.route.Component
                ? _.createElement(r.route.Component, null)
                : r.route.element
                  ? r.route.element
                  : e),
          _.createElement(Ge, {
            match: r,
            routeContext: { outlet: e, matches: p, isDataRoute: n != null },
            children: t,
          })
        );
      };
    return n && (r.route.ErrorBoundary || r.route.errorElement || i === 0)
      ? _.createElement(We, {
          location: n.location,
          revalidation: n.revalidation,
          component: d,
          error: l,
          children: m(),
          routeContext: { outlet: null, matches: p, isDataRoute: !0 },
        })
      : m();
  }, null);
}
var qe = (function (e) {
    return (
      (e.UseBlocker = `useBlocker`),
      (e.UseRevalidator = `useRevalidator`),
      (e.UseNavigateStable = `useNavigate`),
      e
    );
  })(qe || {}),
  Je = (function (e) {
    return (
      (e.UseBlocker = `useBlocker`),
      (e.UseLoaderData = `useLoaderData`),
      (e.UseActionData = `useActionData`),
      (e.UseRouteError = `useRouteError`),
      (e.UseNavigation = `useNavigation`),
      (e.UseRouteLoaderData = `useRouteLoaderData`),
      (e.UseMatches = `useMatches`),
      (e.UseRevalidator = `useRevalidator`),
      (e.UseNavigateStable = `useNavigate`),
      (e.UseRouteId = `useRouteId`),
      e
    );
  })(Je || {});
function Ye(e) {
  let t = _.useContext(ke);
  return (!t && w(!1), t);
}
function Xe(e) {
  let t = _.useContext(Ae);
  return (!t && w(!1), t);
}
function Ze(e) {
  let t = _.useContext(Ne);
  return (!t && w(!1), t);
}
function Qe(e) {
  let t = Ze(e),
    n = t.matches[t.matches.length - 1];
  return (!n.route.id && w(!1), n.route.id);
}
function z() {
  let e = _.useContext(Pe),
    t = Xe(Je.UseRouteError),
    n = Qe(Je.UseRouteError);
  return e === void 0 ? t.errors?.[n] : e;
}
function $e() {
  let { router: e } = Ye(qe.UseNavigateStable),
    t = Qe(Je.UseNavigateStable),
    n = _.useRef(!1);
  return (
    Le(() => {
      n.current = !0;
    }),
    _.useCallback(
      function (r, i) {
        (i === void 0 && (i = {}),
          n.current && (typeof r == `number` ? e.navigate(r) : e.navigate(r, Oe({ fromRouteId: t }, i))));
      },
      [e, t],
    )
  );
}
var et = {};
function tt(e, t, n) {
  !t && !et[e] && (et[e] = !0);
}
var nt = (e, t, n) => (
  `` + t + ('You can use the `' + e + '` future flag to opt-in early. ') + (`For more information, see ` + n + `.`),
  void 0
);
function rt(e, t) {
  (e?.v7_startTransition === void 0 &&
    nt(
      `v7_startTransition`,
      'React Router will begin wrapping state updates in `React.startTransition` in v7',
      `https://reactrouter.com/v6/upgrading/future#v7_starttransition`,
    ),
    e?.v7_relativeSplatPath === void 0 &&
      (!t || t.v7_relativeSplatPath === void 0) &&
      nt(
        `v7_relativeSplatPath`,
        `Relative route resolution within Splat routes is changing in v7`,
        `https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath`,
      ),
    t &&
      (t.v7_fetcherPersist === void 0 &&
        nt(
          `v7_fetcherPersist`,
          `The persistence behavior of fetchers is changing in v7`,
          `https://reactrouter.com/v6/upgrading/future#v7_fetcherpersist`,
        ),
      t.v7_normalizeFormMethod === void 0 &&
        nt(
          `v7_normalizeFormMethod`,
          'Casing of `formMethod` fields is being normalized to uppercase in v7',
          `https://reactrouter.com/v6/upgrading/future#v7_normalizeformmethod`,
        ),
      t.v7_partialHydration === void 0 &&
        nt(
          `v7_partialHydration`,
          '`RouterProvider` hydration behavior is changing in v7',
          `https://reactrouter.com/v6/upgrading/future#v7_partialhydration`,
        ),
      t.v7_skipActionErrorRevalidation === void 0 &&
        nt(
          `v7_skipActionErrorRevalidation`,
          'The revalidation behavior after 4xx/5xx `action` responses is changing in v7',
          `https://reactrouter.com/v6/upgrading/future#v7_skipactionerrorrevalidation`,
        )));
}
function it(e) {
  w(!1);
}
function at(e) {
  let {
    basename: t = `/`,
    children: n = null,
    location: r,
    navigationType: i = x.Pop,
    navigator: a,
    static: o = !1,
    future: s,
  } = e;
  Fe() && w(!1);
  let c = t.replace(/^\/*/, `/`),
    l = _.useMemo(
      () => ({ basename: c, navigator: a, static: o, future: Oe({ v7_relativeSplatPath: !1 }, s) }),
      [c, s, a, o],
    );
  typeof r == `string` && (r = A(r));
  let { pathname: u = `/`, search: d = ``, hash: f = ``, state: p = null, key: m = `default` } = r,
    h = _.useMemo(() => {
      let e = pe(u, c);
      return e == null ? null : { location: { pathname: e, search: d, hash: f, state: p, key: m }, navigationType: i };
    }, [c, u, d, f, p, m, i]);
  return h == null
    ? null
    : _.createElement(je.Provider, { value: l }, _.createElement(Me.Provider, { children: n, value: h }));
}
function ot(e) {
  let { children: t, location: n } = e;
  return Be(ct(t), n);
}
var st = (function (e) {
  return ((e[(e.pending = 0)] = `pending`), (e[(e.success = 1)] = `success`), (e[(e.error = 2)] = `error`), e);
})(st || {});
(new Promise(() => {}), _.Component);
function ct(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    _.Children.forEach(e, (e, r) => {
      if (!_.isValidElement(e)) return;
      let i = [...t, r];
      if (e.type === _.Fragment) {
        n.push.apply(n, ct(e.props.children, i));
        return;
      }
      (e.type !== it && w(!1), !(!e.props.index || !e.props.children) && w(!1));
      let a = {
        id: e.props.id || i.join(`-`),
        caseSensitive: e.props.caseSensitive,
        element: e.props.element,
        Component: e.props.Component,
        index: e.props.index,
        path: e.props.path,
        loader: e.props.loader,
        action: e.props.action,
        errorElement: e.props.errorElement,
        ErrorBoundary: e.props.ErrorBoundary,
        hasErrorBoundary: e.props.ErrorBoundary != null || e.props.errorElement != null,
        shouldRevalidate: e.props.shouldRevalidate,
        handle: e.props.handle,
        lazy: e.props.lazy,
      };
      (e.props.children && (a.children = ct(e.props.children, i)), n.push(a));
    }),
    n
  );
}
var lt = `6`;
try {
  window.__reactRouterVersion = lt;
} catch {}
var ut = _.startTransition;
function dt(e) {
  let { basename: t, children: n, future: r, window: i } = e,
    a = _.useRef();
  a.current ??= C({ window: i, v5Compat: !0 });
  let o = a.current,
    [s, c] = _.useState({ action: o.action, location: o.location }),
    { v7_startTransition: l } = r || {},
    u = _.useCallback(
      (e) => {
        l && ut ? ut(() => c(e)) : c(e);
      },
      [c, l],
    );
  return (
    _.useLayoutEffect(() => o.listen(u), [o, u]),
    _.useEffect(() => rt(r), [r]),
    _.createElement(at, {
      basename: t,
      children: n,
      location: s.location,
      navigationType: s.action,
      navigator: o,
      future: r,
    })
  );
}
typeof window < `u` && window.document !== void 0 && window.document.createElement;
var ft;
(function (e) {
  ((e.UseScrollRestoration = `useScrollRestoration`),
    (e.UseSubmit = `useSubmit`),
    (e.UseSubmitFetcher = `useSubmitFetcher`),
    (e.UseFetcher = `useFetcher`),
    (e.useViewTransitionState = `useViewTransitionState`));
})((ft ||= {}));
var pt;
(function (e) {
  ((e.UseFetcher = `useFetcher`), (e.UseFetchers = `useFetchers`), (e.UseScrollRestoration = `useScrollRestoration`));
})((pt ||= {}));
var mt = Object.create(null);
((mt.open = `0`),
  (mt.close = `1`),
  (mt.ping = `2`),
  (mt.pong = `3`),
  (mt.message = `4`),
  (mt.upgrade = `5`),
  (mt.noop = `6`));
var ht = Object.create(null);
Object.keys(mt).forEach((e) => {
  ht[mt[e]] = e;
});
var gt = { type: `error`, data: `parser error` },
  _t =
    typeof Blob == `function` ||
    (typeof Blob < `u` && Object.prototype.toString.call(Blob) === `[object BlobConstructor]`),
  vt = typeof ArrayBuffer == `function`,
  yt = (e) => (typeof ArrayBuffer.isView == `function` ? ArrayBuffer.isView(e) : e && e.buffer instanceof ArrayBuffer),
  bt = ({ type: e, data: t }, n, r) =>
    _t && t instanceof Blob
      ? n
        ? r(t)
        : xt(t, r)
      : vt && (t instanceof ArrayBuffer || yt(t))
        ? n
          ? r(t)
          : xt(new Blob([t]), r)
        : r(mt[e] + (t || ``)),
  xt = (e, t) => {
    let n = new FileReader();
    return (
      (n.onload = function () {
        let e = n.result.split(`,`)[1];
        t(`b` + (e || ``));
      }),
      n.readAsDataURL(e)
    );
  };
function St(e) {
  return e instanceof Uint8Array
    ? e
    : e instanceof ArrayBuffer
      ? new Uint8Array(e)
      : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
var Ct;
function wt(e, t) {
  if (_t && e.data instanceof Blob) return e.data.arrayBuffer().then(St).then(t);
  if (vt && (e.data instanceof ArrayBuffer || yt(e.data))) return t(St(e.data));
  bt(e, !1, (e) => {
    ((Ct ||= new TextEncoder()), t(Ct.encode(e)));
  });
}
var Tt = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`,
  Et = typeof Uint8Array > `u` ? [] : new Uint8Array(256);
for (let e = 0; e < 64; e++) Et[Tt.charCodeAt(e)] = e;
var Dt = (e) => {
    let t = e.length * 0.75,
      n = e.length,
      r,
      i = 0,
      a,
      o,
      s,
      c;
    e[e.length - 1] === `=` && (t--, e[e.length - 2] === `=` && t--);
    let l = new ArrayBuffer(t),
      u = new Uint8Array(l);
    for (r = 0; r < n; r += 4)
      ((a = Et[e.charCodeAt(r)]),
        (o = Et[e.charCodeAt(r + 1)]),
        (s = Et[e.charCodeAt(r + 2)]),
        (c = Et[e.charCodeAt(r + 3)]),
        (u[i++] = (a << 2) | (o >> 4)),
        (u[i++] = ((o & 15) << 4) | (s >> 2)),
        (u[i++] = ((s & 3) << 6) | (c & 63)));
    return l;
  },
  Ot = typeof ArrayBuffer == `function`,
  kt = (e, t) => {
    if (typeof e != `string`) return { type: `message`, data: jt(e, t) };
    let n = e.charAt(0);
    return n === `b`
      ? { type: `message`, data: At(e.substring(1), t) }
      : ht[n]
        ? e.length > 1
          ? { type: ht[n], data: e.substring(1) }
          : { type: ht[n] }
        : gt;
  },
  At = (e, t) => (Ot ? jt(Dt(e), t) : { base64: !0, data: e }),
  jt = (e, t) => {
    switch (t) {
      case `blob`:
        return e instanceof Blob ? e : new Blob([e]);
      default:
        return e instanceof ArrayBuffer ? e : e.buffer;
    }
  },
  Mt = ``,
  Nt = (e, t) => {
    let n = e.length,
      r = Array(n),
      i = 0;
    e.forEach((e, a) => {
      bt(e, !1, (e) => {
        ((r[a] = e), ++i === n && t(r.join(Mt)));
      });
    });
  },
  Pt = (e, t) => {
    let n = e.split(Mt),
      r = [];
    for (let e = 0; e < n.length; e++) {
      let i = kt(n[e], t);
      if ((r.push(i), i.type === `error`)) break;
    }
    return r;
  };
function Ft() {
  return new TransformStream({
    transform(e, t) {
      wt(e, (n) => {
        let r = n.length,
          i;
        if (r < 126) ((i = new Uint8Array(1)), new DataView(i.buffer).setUint8(0, r));
        else if (r < 65536) {
          i = new Uint8Array(3);
          let e = new DataView(i.buffer);
          (e.setUint8(0, 126), e.setUint16(1, r));
        } else {
          i = new Uint8Array(9);
          let e = new DataView(i.buffer);
          (e.setUint8(0, 127), e.setBigUint64(1, BigInt(r)));
        }
        (e.data && typeof e.data != `string` && (i[0] |= 128), t.enqueue(i), t.enqueue(n));
      });
    },
  });
}
var It;
function Lt(e) {
  return e.reduce((e, t) => e + t.length, 0);
}
function Rt(e, t) {
  if (e[0].length === t) return e.shift();
  let n = new Uint8Array(t),
    r = 0;
  for (let i = 0; i < t; i++) ((n[i] = e[0][r++]), r === e[0].length && (e.shift(), (r = 0)));
  return (e.length && r < e[0].length && (e[0] = e[0].slice(r)), n);
}
function zt(e, t) {
  It ||= new TextDecoder();
  let n = [],
    r = 0,
    i = -1,
    a = !1;
  return new TransformStream({
    transform(o, s) {
      for (n.push(o); ; ) {
        if (r === 0) {
          if (Lt(n) < 1) break;
          let e = Rt(n, 1);
          ((a = (e[0] & 128) == 128), (i = e[0] & 127), (r = i < 126 ? 3 : i === 126 ? 1 : 2));
        } else if (r === 1) {
          if (Lt(n) < 2) break;
          let e = Rt(n, 2);
          ((i = new DataView(e.buffer, e.byteOffset, e.length).getUint16(0)), (r = 3));
        } else if (r === 2) {
          if (Lt(n) < 8) break;
          let e = Rt(n, 8),
            t = new DataView(e.buffer, e.byteOffset, e.length),
            a = t.getUint32(0);
          if (a > 2 ** 21 - 1) {
            s.enqueue(gt);
            break;
          }
          ((i = a * 2 ** 32 + t.getUint32(4)), (r = 3));
        } else {
          if (Lt(n) < i) break;
          let e = Rt(n, i);
          (s.enqueue(kt(a ? e : It.decode(e), t)), (r = 0));
        }
        if (i === 0 || i > e) {
          s.enqueue(gt);
          break;
        }
      }
    },
  });
}
function Bt(e) {
  if (e) return Vt(e);
}
function Vt(e) {
  for (var t in Bt.prototype) e[t] = Bt.prototype[t];
  return e;
}
((Bt.prototype.on = Bt.prototype.addEventListener =
  function (e, t) {
    return (
      (this._callbacks = this._callbacks || {}),
      (this._callbacks[`$` + e] = this._callbacks[`$` + e] || []).push(t),
      this
    );
  }),
  (Bt.prototype.once = function (e, t) {
    function n() {
      (this.off(e, n), t.apply(this, arguments));
    }
    return ((n.fn = t), this.on(e, n), this);
  }),
  (Bt.prototype.off =
    Bt.prototype.removeListener =
    Bt.prototype.removeAllListeners =
    Bt.prototype.removeEventListener =
      function (e, t) {
        if (((this._callbacks = this._callbacks || {}), arguments.length == 0)) return ((this._callbacks = {}), this);
        var n = this._callbacks[`$` + e];
        if (!n) return this;
        if (arguments.length == 1) return (delete this._callbacks[`$` + e], this);
        for (var r, i = 0; i < n.length; i++)
          if (((r = n[i]), r === t || r.fn === t)) {
            n.splice(i, 1);
            break;
          }
        return (n.length === 0 && delete this._callbacks[`$` + e], this);
      }),
  (Bt.prototype.emit = function (e) {
    this._callbacks = this._callbacks || {};
    for (var t = Array(arguments.length - 1), n = this._callbacks[`$` + e], r = 1; r < arguments.length; r++)
      t[r - 1] = arguments[r];
    if (n) {
      n = n.slice(0);
      for (var r = 0, i = n.length; r < i; ++r) n[r].apply(this, t);
    }
    return this;
  }),
  (Bt.prototype.emitReserved = Bt.prototype.emit),
  (Bt.prototype.listeners = function (e) {
    return ((this._callbacks = this._callbacks || {}), this._callbacks[`$` + e] || []);
  }),
  (Bt.prototype.hasListeners = function (e) {
    return !!this.listeners(e).length;
  }));
var B =
    typeof Promise == `function` && typeof Promise.resolve == `function`
      ? (e) => Promise.resolve().then(e)
      : (e, t) => t(e, 0),
  Ht = typeof self < `u` ? self : typeof window < `u` ? window : Function(`return this`)(),
  Ut = `arraybuffer`;
function Wt(e, ...t) {
  return t.reduce((t, n) => (e.hasOwnProperty(n) && (t[n] = e[n]), t), {});
}
var Gt = Ht.setTimeout,
  Kt = Ht.clearTimeout;
function qt(e, t) {
  t.useNativeTimers
    ? ((e.setTimeoutFn = Gt.bind(Ht)), (e.clearTimeoutFn = Kt.bind(Ht)))
    : ((e.setTimeoutFn = Ht.setTimeout.bind(Ht)), (e.clearTimeoutFn = Ht.clearTimeout.bind(Ht)));
}
var Jt = 1.33;
function Yt(e) {
  return typeof e == `string` ? Xt(e) : Math.ceil((e.byteLength || e.size) * Jt);
}
function Xt(e) {
  let t = 0,
    n = 0;
  for (let r = 0, i = e.length; r < i; r++)
    ((t = e.charCodeAt(r)),
      t < 128 ? (n += 1) : t < 2048 ? (n += 2) : t < 55296 || t >= 57344 ? (n += 3) : (r++, (n += 4)));
  return n;
}
function Zt() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Qt(e) {
  let t = ``;
  for (let n in e)
    e.hasOwnProperty(n) && (t.length && (t += `&`), (t += encodeURIComponent(n) + `=` + encodeURIComponent(e[n])));
  return t;
}
function $t(e) {
  let t = {},
    n = e.split(`&`);
  for (let e = 0, r = n.length; e < r; e++) {
    let r = n[e].split(`=`);
    t[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return t;
}
var en = class extends Error {
    constructor(e, t, n) {
      (super(e), (this.description = t), (this.context = n), (this.type = `TransportError`));
    }
  },
  tn = class extends Bt {
    constructor(e) {
      (super(),
        (this.writable = !1),
        qt(this, e),
        (this.opts = e),
        (this.query = e.query),
        (this.socket = e.socket),
        (this.supportsBinary = !e.forceBase64));
    }
    onError(e, t, n) {
      return (super.emitReserved(`error`, new en(e, t, n)), this);
    }
    open() {
      return ((this.readyState = `opening`), this.doOpen(), this);
    }
    close() {
      return ((this.readyState === `opening` || this.readyState === `open`) && (this.doClose(), this.onClose()), this);
    }
    send(e) {
      this.readyState === `open` && this.write(e);
    }
    onOpen() {
      ((this.readyState = `open`), (this.writable = !0), super.emitReserved(`open`));
    }
    onData(e) {
      let t = kt(e, this.socket.binaryType);
      this.onPacket(t);
    }
    onPacket(e) {
      super.emitReserved(`packet`, e);
    }
    onClose(e) {
      ((this.readyState = `closed`), super.emitReserved(`close`, e));
    }
    pause(e) {}
    createUri(e, t = {}) {
      return e + `://` + this._hostname() + this._port() + this.opts.path + this._query(t);
    }
    _hostname() {
      let e = this.opts.hostname;
      return e.indexOf(`:`) === -1 ? e : `[` + e + `]`;
    }
    _port() {
      return this.opts.port &&
        ((this.opts.secure && Number(this.opts.port) !== 443) || (!this.opts.secure && Number(this.opts.port) !== 80))
        ? `:` + this.opts.port
        : ``;
    }
    _query(e) {
      let t = Qt(e);
      return t.length ? `?` + t : ``;
    }
  },
  nn = class extends tn {
    constructor() {
      (super(...arguments), (this._polling = !1));
    }
    get name() {
      return `polling`;
    }
    doOpen() {
      this._poll();
    }
    pause(e) {
      this.readyState = `pausing`;
      let t = () => {
        ((this.readyState = `paused`), e());
      };
      if (this._polling || !this.writable) {
        let e = 0;
        (this._polling &&
          (e++,
          this.once(`pollComplete`, function () {
            --e || t();
          })),
          this.writable ||
            (e++,
            this.once(`drain`, function () {
              --e || t();
            })));
      } else t();
    }
    _poll() {
      ((this._polling = !0), this.doPoll(), this.emitReserved(`poll`));
    }
    onData(e) {
      (Pt(e, this.socket.binaryType).forEach((e) => {
        if ((this.readyState === `opening` && e.type === `open` && this.onOpen(), e.type === `close`))
          return (this.onClose({ description: `transport closed by the server` }), !1);
        this.onPacket(e);
      }),
        this.readyState !== `closed` &&
          ((this._polling = !1), this.emitReserved(`pollComplete`), this.readyState === `open` && this._poll()));
    }
    doClose() {
      let e = () => {
        this.write([{ type: `close` }]);
      };
      this.readyState === `open` ? e() : this.once(`open`, e);
    }
    write(e) {
      ((this.writable = !1),
        Nt(e, (e) => {
          this.doWrite(e, () => {
            ((this.writable = !0), this.emitReserved(`drain`));
          });
        }));
    }
    uri() {
      let e = this.opts.secure ? `https` : `http`,
        t = this.query || {};
      return (
        !1 !== this.opts.timestampRequests && (t[this.opts.timestampParam] = Zt()),
        !this.supportsBinary && !t.sid && (t.b64 = 1),
        this.createUri(e, t)
      );
    }
  },
  rn = !1;
try {
  rn = typeof XMLHttpRequest < `u` && `withCredentials` in new XMLHttpRequest();
} catch {}
var an = rn;
function on() {}
var sn = class extends nn {
    constructor(e) {
      if ((super(e), typeof location < `u`)) {
        let t = location.protocol === `https:`,
          n = location.port;
        ((n ||= t ? `443` : `80`),
          (this.xd = (typeof location < `u` && e.hostname !== location.hostname) || n !== e.port));
      }
    }
    doWrite(e, t) {
      let n = this.request({ method: `POST`, data: e });
      (n.on(`success`, t),
        n.on(`error`, (e, t) => {
          this.onError(`xhr post error`, e, t);
        }));
    }
    doPoll() {
      let e = this.request();
      (e.on(`data`, this.onData.bind(this)),
        e.on(`error`, (e, t) => {
          this.onError(`xhr poll error`, e, t);
        }),
        (this.pollXhr = e));
    }
  },
  cn = class e extends Bt {
    constructor(e, t, n) {
      (super(),
        (this.createRequest = e),
        qt(this, n),
        (this._opts = n),
        (this._method = n.method || `GET`),
        (this._uri = t),
        (this._data = n.data === void 0 ? null : n.data),
        this._create());
    }
    _create() {
      var t;
      let n = Wt(
        this._opts,
        `agent`,
        `pfx`,
        `key`,
        `passphrase`,
        `cert`,
        `ca`,
        `ciphers`,
        `rejectUnauthorized`,
        `autoUnref`,
      );
      n.xdomain = !!this._opts.xd;
      let r = (this._xhr = this.createRequest(n));
      try {
        r.open(this._method, this._uri, !0);
        try {
          if (this._opts.extraHeaders) {
            r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0);
            for (let e in this._opts.extraHeaders)
              this._opts.extraHeaders.hasOwnProperty(e) && r.setRequestHeader(e, this._opts.extraHeaders[e]);
          }
        } catch {}
        if (this._method === `POST`)
          try {
            r.setRequestHeader(`Content-type`, `text/plain;charset=UTF-8`);
          } catch {}
        try {
          r.setRequestHeader(`Accept`, `*/*`);
        } catch {}
        ((t = this._opts.cookieJar) == null || t.addCookies(r),
          `withCredentials` in r && (r.withCredentials = this._opts.withCredentials),
          this._opts.requestTimeout && (r.timeout = this._opts.requestTimeout),
          (r.onreadystatechange = () => {
            var e;
            (r.readyState === 3 &&
              ((e = this._opts.cookieJar) == null || e.parseCookies(r.getResponseHeader(`set-cookie`))),
              r.readyState === 4 &&
                (r.status === 200 || r.status === 1223
                  ? this._onLoad()
                  : this.setTimeoutFn(() => {
                      this._onError(typeof r.status == `number` ? r.status : 0);
                    }, 0)));
          }),
          r.send(this._data));
      } catch (e) {
        this.setTimeoutFn(() => {
          this._onError(e);
        }, 0);
        return;
      }
      typeof document < `u` && ((this._index = e.requestsCount++), (e.requests[this._index] = this));
    }
    _onError(e) {
      (this.emitReserved(`error`, e, this._xhr), this._cleanup(!0));
    }
    _cleanup(t) {
      if (!(this._xhr === void 0 || this._xhr === null)) {
        if (((this._xhr.onreadystatechange = on), t))
          try {
            this._xhr.abort();
          } catch {}
        (typeof document < `u` && delete e.requests[this._index], (this._xhr = null));
      }
    }
    _onLoad() {
      let e = this._xhr.responseText;
      e !== null && (this.emitReserved(`data`, e), this.emitReserved(`success`), this._cleanup());
    }
    abort() {
      this._cleanup();
    }
  };
if (((cn.requestsCount = 0), (cn.requests = {}), typeof document < `u`)) {
  if (typeof attachEvent == `function`) attachEvent(`onunload`, ln);
  else if (typeof addEventListener == `function`) {
    let e = `onpagehide` in Ht ? `pagehide` : `unload`;
    addEventListener(e, ln, !1);
  }
}
function ln() {
  for (let e in cn.requests) cn.requests.hasOwnProperty(e) && cn.requests[e].abort();
}
var un = (function () {
    let e = fn({ xdomain: !1 });
    return e && e.responseType !== null;
  })(),
  dn = class extends sn {
    constructor(e) {
      super(e);
      let t = e && e.forceBase64;
      this.supportsBinary = un && !t;
    }
    request(e = {}) {
      return (Object.assign(e, { xd: this.xd }, this.opts), new cn(fn, this.uri(), e));
    }
  };
function fn(e) {
  let t = e.xdomain;
  try {
    if (typeof XMLHttpRequest < `u` && (!t || an)) return new XMLHttpRequest();
  } catch {}
  if (!t)
    try {
      return new Ht[[`Active`, `Object`].join(`X`)](`Microsoft.XMLHTTP`);
    } catch {}
}
var pn =
    typeof navigator < `u` && typeof navigator.product == `string` && navigator.product.toLowerCase() === `reactnative`,
  mn = class extends tn {
    get name() {
      return `websocket`;
    }
    doOpen() {
      let e = this.uri(),
        t = this.opts.protocols,
        n = pn
          ? {}
          : Wt(
              this.opts,
              `agent`,
              `perMessageDeflate`,
              `pfx`,
              `key`,
              `passphrase`,
              `cert`,
              `ca`,
              `ciphers`,
              `rejectUnauthorized`,
              `localAddress`,
              `protocolVersion`,
              `origin`,
              `maxPayload`,
              `family`,
              `checkServerIdentity`,
            );
      this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
      try {
        this.ws = this.createSocket(e, t, n);
      } catch (e) {
        return this.emitReserved(`error`, e);
      }
      ((this.ws.binaryType = this.socket.binaryType), this.addEventListeners());
    }
    addEventListeners() {
      ((this.ws.onopen = () => {
        (this.opts.autoUnref && this.ws._socket.unref(), this.onOpen());
      }),
        (this.ws.onclose = (e) => this.onClose({ description: `websocket connection closed`, context: e })),
        (this.ws.onmessage = (e) => this.onData(e.data)),
        (this.ws.onerror = (e) => this.onError(`websocket error`, e)));
    }
    write(e) {
      this.writable = !1;
      for (let t = 0; t < e.length; t++) {
        let n = e[t],
          r = t === e.length - 1;
        bt(n, this.supportsBinary, (e) => {
          try {
            this.doWrite(n, e);
          } catch {}
          r &&
            B(() => {
              ((this.writable = !0), this.emitReserved(`drain`));
            }, this.setTimeoutFn);
        });
      }
    }
    doClose() {
      this.ws !== void 0 && ((this.ws.onerror = () => {}), this.ws.close(), (this.ws = null));
    }
    uri() {
      let e = this.opts.secure ? `wss` : `ws`,
        t = this.query || {};
      return (
        this.opts.timestampRequests && (t[this.opts.timestampParam] = Zt()),
        this.supportsBinary || (t.b64 = 1),
        this.createUri(e, t)
      );
    }
  },
  hn = Ht.WebSocket || Ht.MozWebSocket,
  gn = {
    websocket: class extends mn {
      createSocket(e, t, n) {
        return pn ? new hn(e, t, n) : t ? new hn(e, t) : new hn(e);
      }
      doWrite(e, t) {
        this.ws.send(t);
      }
    },
    webtransport: class extends tn {
      get name() {
        return `webtransport`;
      }
      doOpen() {
        try {
          this._transport = new WebTransport(this.createUri(`https`), this.opts.transportOptions[this.name]);
        } catch (e) {
          return this.emitReserved(`error`, e);
        }
        (this._transport.closed
          .then(() => {
            this.onClose();
          })
          .catch((e) => {
            this.onError(`webtransport error`, e);
          }),
          this._transport.ready.then(() => {
            this._transport.createBidirectionalStream().then((e) => {
              let t = zt(2 ** 53 - 1, this.socket.binaryType),
                n = e.readable.pipeThrough(t).getReader(),
                r = Ft();
              (r.readable.pipeTo(e.writable), (this._writer = r.writable.getWriter()));
              let i = () => {
                n.read()
                  .then(({ done: e, value: t }) => {
                    e || (this.onPacket(t), i());
                  })
                  .catch((e) => {});
              };
              i();
              let a = { type: `open` };
              (this.query.sid && (a.data = `{"sid":"${this.query.sid}"}`),
                this._writer.write(a).then(() => this.onOpen()));
            });
          }));
      }
      write(e) {
        this.writable = !1;
        for (let t = 0; t < e.length; t++) {
          let n = e[t],
            r = t === e.length - 1;
          this._writer.write(n).then(() => {
            r &&
              B(() => {
                ((this.writable = !0), this.emitReserved(`drain`));
              }, this.setTimeoutFn);
          });
        }
      }
      doClose() {
        var e;
        (e = this._transport) == null || e.close();
      }
    },
    polling: dn,
  },
  _n =
    /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  vn = [
    `source`,
    `protocol`,
    `authority`,
    `userInfo`,
    `user`,
    `password`,
    `host`,
    `port`,
    `relative`,
    `path`,
    `directory`,
    `file`,
    `query`,
    `anchor`,
  ];
function yn(e) {
  if (e.length > 8e3) throw `URI too long`;
  let t = e,
    n = e.indexOf(`[`),
    r = e.indexOf(`]`);
  n != -1 && r != -1 && (e = e.substring(0, n) + e.substring(n, r).replace(/:/g, `;`) + e.substring(r, e.length));
  let i = _n.exec(e || ``),
    a = {},
    o = 14;
  for (; o--; ) a[vn[o]] = i[o] || ``;
  return (
    n != -1 &&
      r != -1 &&
      ((a.source = t),
      (a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, `:`)),
      (a.authority = a.authority.replace(`[`, ``).replace(`]`, ``).replace(/;/g, `:`)),
      (a.ipv6uri = !0)),
    (a.pathNames = bn(a, a.path)),
    (a.queryKey = xn(a, a.query)),
    a
  );
}
function bn(e, t) {
  let n = t.replace(/\/{2,9}/g, `/`).split(`/`);
  return (
    (t.slice(0, 1) == `/` || t.length === 0) && n.splice(0, 1),
    t.slice(-1) == `/` && n.splice(n.length - 1, 1),
    n
  );
}
function xn(e, t) {
  let n = {};
  return (
    t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (e, t, r) {
      t && (n[t] = r);
    }),
    n
  );
}
var Sn = typeof addEventListener == `function` && typeof removeEventListener == `function`,
  Cn = [];
Sn &&
  addEventListener(
    `offline`,
    () => {
      Cn.forEach((e) => e());
    },
    !1,
  );
var wn = class e extends Bt {
  constructor(e, t) {
    if (
      (super(),
      (this.binaryType = Ut),
      (this.writeBuffer = []),
      (this._prevBufferLen = 0),
      (this._pingInterval = -1),
      (this._pingTimeout = -1),
      (this._maxPayload = -1),
      (this._pingTimeoutTime = 1 / 0),
      e && typeof e == `object` && ((t = e), (e = null)),
      e)
    ) {
      let n = yn(e);
      ((t.hostname = n.host),
        (t.secure = n.protocol === `https` || n.protocol === `wss`),
        (t.port = n.port),
        n.query && (t.query = n.query));
    } else t.host && (t.hostname = yn(t.host).host);
    (qt(this, t),
      (this.secure = t.secure == null ? typeof location < `u` && location.protocol === `https:` : t.secure),
      t.hostname && !t.port && (t.port = this.secure ? `443` : `80`),
      (this.hostname = t.hostname || (typeof location < `u` ? location.hostname : `localhost`)),
      (this.port = t.port || (typeof location < `u` && location.port ? location.port : this.secure ? `443` : `80`)),
      (this.transports = []),
      (this._transportsByName = {}),
      t.transports.forEach((e) => {
        let t = e.prototype.name;
        (this.transports.push(t), (this._transportsByName[t] = e));
      }),
      (this.opts = Object.assign(
        {
          path: `/engine.io`,
          agent: !1,
          withCredentials: !1,
          upgrade: !0,
          timestampParam: `t`,
          rememberUpgrade: !1,
          addTrailingSlash: !0,
          rejectUnauthorized: !0,
          perMessageDeflate: { threshold: 1024 },
          transportOptions: {},
          closeOnBeforeunload: !1,
        },
        t,
      )),
      (this.opts.path = this.opts.path.replace(/\/$/, ``) + (this.opts.addTrailingSlash ? `/` : ``)),
      typeof this.opts.query == `string` && (this.opts.query = $t(this.opts.query)),
      Sn &&
        (this.opts.closeOnBeforeunload &&
          ((this._beforeunloadEventListener = () => {
            this.transport && (this.transport.removeAllListeners(), this.transport.close());
          }),
          addEventListener(`beforeunload`, this._beforeunloadEventListener, !1)),
        this.hostname !== `localhost` &&
          ((this._offlineEventListener = () => {
            this._onClose(`transport close`, { description: `network connection lost` });
          }),
          Cn.push(this._offlineEventListener))),
      this.opts.withCredentials && (this._cookieJar = void 0),
      this._open());
  }
  createTransport(e) {
    let t = Object.assign({}, this.opts.query);
    ((t.EIO = 4), (t.transport = e), this.id && (t.sid = this.id));
    let n = Object.assign(
      {},
      this.opts,
      { query: t, socket: this, hostname: this.hostname, secure: this.secure, port: this.port },
      this.opts.transportOptions[e],
    );
    return new this._transportsByName[e](n);
  }
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved(`error`, `No transports available`);
      }, 0);
      return;
    }
    let t =
      this.opts.rememberUpgrade && e.priorWebsocketSuccess && this.transports.indexOf(`websocket`) !== -1
        ? `websocket`
        : this.transports[0];
    this.readyState = `opening`;
    let n = this.createTransport(t);
    (n.open(), this.setTransport(n));
  }
  setTransport(e) {
    (this.transport && this.transport.removeAllListeners(),
      (this.transport = e),
      e
        .on(`drain`, this._onDrain.bind(this))
        .on(`packet`, this._onPacket.bind(this))
        .on(`error`, this._onError.bind(this))
        .on(`close`, (e) => this._onClose(`transport close`, e)));
  }
  onOpen() {
    ((this.readyState = `open`),
      (e.priorWebsocketSuccess = this.transport.name === `websocket`),
      this.emitReserved(`open`),
      this.flush());
  }
  _onPacket(e) {
    if (this.readyState === `opening` || this.readyState === `open` || this.readyState === `closing`)
      switch ((this.emitReserved(`packet`, e), this.emitReserved(`heartbeat`), e.type)) {
        case `open`:
          this.onHandshake(JSON.parse(e.data));
          break;
        case `ping`:
          (this._sendPacket(`pong`), this.emitReserved(`ping`), this.emitReserved(`pong`), this._resetPingTimeout());
          break;
        case `error`:
          let t = Error(`server error`);
          ((t.code = e.data), this._onError(t));
          break;
        case `message`:
          (this.emitReserved(`data`, e.data), this.emitReserved(`message`, e.data));
          break;
      }
  }
  onHandshake(e) {
    (this.emitReserved(`handshake`, e),
      (this.id = e.sid),
      (this.transport.query.sid = e.sid),
      (this._pingInterval = e.pingInterval),
      (this._pingTimeout = e.pingTimeout),
      (this._maxPayload = e.maxPayload),
      this.onOpen(),
      this.readyState !== `closed` && this._resetPingTimeout());
  }
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    let e = this._pingInterval + this._pingTimeout;
    ((this._pingTimeoutTime = Date.now() + e),
      (this._pingTimeoutTimer = this.setTimeoutFn(() => {
        this._onClose(`ping timeout`);
      }, e)),
      this.opts.autoUnref && this._pingTimeoutTimer.unref());
  }
  _onDrain() {
    (this.writeBuffer.splice(0, this._prevBufferLen),
      (this._prevBufferLen = 0),
      this.writeBuffer.length === 0 ? this.emitReserved(`drain`) : this.flush());
  }
  flush() {
    if (this.readyState !== `closed` && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      let e = this._getWritablePackets();
      (this.transport.send(e), (this._prevBufferLen = e.length), this.emitReserved(`flush`));
    }
  }
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === `polling` && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let e = 1;
    for (let t = 0; t < this.writeBuffer.length; t++) {
      let n = this.writeBuffer[t].data;
      if ((n && (e += Yt(n)), t > 0 && e > this._maxPayload)) return this.writeBuffer.slice(0, t);
      e += 2;
    }
    return this.writeBuffer;
  }
  _hasPingExpired() {
    if (!this._pingTimeoutTime) return !0;
    let e = Date.now() > this._pingTimeoutTime;
    return (
      e &&
        ((this._pingTimeoutTime = 0),
        B(() => {
          this._onClose(`ping timeout`);
        }, this.setTimeoutFn)),
      e
    );
  }
  write(e, t, n) {
    return (this._sendPacket(`message`, e, t, n), this);
  }
  send(e, t, n) {
    return (this._sendPacket(`message`, e, t, n), this);
  }
  _sendPacket(e, t, n, r) {
    if (
      (typeof t == `function` && ((r = t), (t = void 0)),
      typeof n == `function` && ((r = n), (n = null)),
      this.readyState === `closing` || this.readyState === `closed`)
    )
      return;
    ((n ||= {}), (n.compress = !1 !== n.compress));
    let i = { type: e, data: t, options: n };
    (this.emitReserved(`packetCreate`, i), this.writeBuffer.push(i), r && this.once(`flush`, r), this.flush());
  }
  close() {
    let e = () => {
        (this._onClose(`forced close`), this.transport.close());
      },
      t = () => {
        (this.off(`upgrade`, t), this.off(`upgradeError`, t), e());
      },
      n = () => {
        (this.once(`upgrade`, t), this.once(`upgradeError`, t));
      };
    return (
      (this.readyState === `opening` || this.readyState === `open`) &&
        ((this.readyState = `closing`),
        this.writeBuffer.length
          ? this.once(`drain`, () => {
              this.upgrading ? n() : e();
            })
          : this.upgrading
            ? n()
            : e()),
      this
    );
  }
  _onError(t) {
    if (
      ((e.priorWebsocketSuccess = !1),
      this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === `opening`)
    )
      return (this.transports.shift(), this._open());
    (this.emitReserved(`error`, t), this._onClose(`transport error`, t));
  }
  _onClose(e, t) {
    if (this.readyState === `opening` || this.readyState === `open` || this.readyState === `closing`) {
      if (
        (this.clearTimeoutFn(this._pingTimeoutTimer),
        this.transport.removeAllListeners(`close`),
        this.transport.close(),
        this.transport.removeAllListeners(),
        Sn &&
          (this._beforeunloadEventListener && removeEventListener(`beforeunload`, this._beforeunloadEventListener, !1),
          this._offlineEventListener))
      ) {
        let e = Cn.indexOf(this._offlineEventListener);
        e !== -1 && Cn.splice(e, 1);
      }
      ((this.readyState = `closed`),
        (this.id = null),
        this.emitReserved(`close`, e, t),
        (this.writeBuffer = []),
        (this._prevBufferLen = 0));
    }
  }
};
wn.protocol = 4;
var Tn = class extends wn {
    constructor() {
      (super(...arguments), (this._upgrades = []));
    }
    onOpen() {
      if ((super.onOpen(), this.readyState === `open` && this.opts.upgrade))
        for (let e = 0; e < this._upgrades.length; e++) this._probe(this._upgrades[e]);
    }
    _probe(e) {
      let t = this.createTransport(e),
        n = !1;
      wn.priorWebsocketSuccess = !1;
      let r = () => {
        n ||
          (t.send([{ type: `ping`, data: `probe` }]),
          t.once(`packet`, (e) => {
            if (!n)
              if (e.type === `pong` && e.data === `probe`) {
                if (((this.upgrading = !0), this.emitReserved(`upgrading`, t), !t)) return;
                ((wn.priorWebsocketSuccess = t.name === `websocket`),
                  this.transport.pause(() => {
                    n ||
                      (this.readyState !== `closed` &&
                        (l(),
                        this.setTransport(t),
                        t.send([{ type: `upgrade` }]),
                        this.emitReserved(`upgrade`, t),
                        (t = null),
                        (this.upgrading = !1),
                        this.flush()));
                  }));
              } else {
                let e = Error(`probe error`);
                ((e.transport = t.name), this.emitReserved(`upgradeError`, e));
              }
          }));
      };
      function i() {
        n || ((n = !0), l(), t.close(), (t = null));
      }
      let a = (e) => {
        let n = Error(`probe error: ` + e);
        ((n.transport = t.name), i(), this.emitReserved(`upgradeError`, n));
      };
      function o() {
        a(`transport closed`);
      }
      function s() {
        a(`socket closed`);
      }
      function c(e) {
        t && e.name !== t.name && i();
      }
      let l = () => {
        (t.removeListener(`open`, r),
          t.removeListener(`error`, a),
          t.removeListener(`close`, o),
          this.off(`close`, s),
          this.off(`upgrading`, c));
      };
      (t.once(`open`, r),
        t.once(`error`, a),
        t.once(`close`, o),
        this.once(`close`, s),
        this.once(`upgrading`, c),
        this._upgrades.indexOf(`webtransport`) !== -1 && e !== `webtransport`
          ? this.setTimeoutFn(() => {
              n || t.open();
            }, 200)
          : t.open());
    }
    onHandshake(e) {
      ((this._upgrades = this._filterUpgrades(e.upgrades)), super.onHandshake(e));
    }
    _filterUpgrades(e) {
      let t = [];
      for (let n = 0; n < e.length; n++) ~this.transports.indexOf(e[n]) && t.push(e[n]);
      return t;
    }
  },
  En = class extends Tn {
    constructor(e, t = {}) {
      let n = typeof e == `object` ? e : t;
      ((!n.transports || (n.transports && typeof n.transports[0] == `string`)) &&
        (n.transports = (n.transports || [`polling`, `websocket`, `webtransport`])
          .map((e) => gn[e])
          .filter((e) => !!e)),
        super(e, n));
    }
  };
En.protocol;
function Dn(e, t = ``, n) {
  let r = e;
  ((n ||= typeof location < `u` && location),
    (e ??= n.protocol + `//` + n.host),
    typeof e == `string` &&
      (e.charAt(0) === `/` && (e = e.charAt(1) === `/` ? n.protocol + e : n.host + e),
      /^(https?|wss?):\/\//.test(e) || (e = n === void 0 ? `https://` + e : n.protocol + `//` + e),
      (r = yn(e))),
    r.port || (/^(http|ws)$/.test(r.protocol) ? (r.port = `80`) : /^(http|ws)s$/.test(r.protocol) && (r.port = `443`)),
    (r.path = r.path || `/`));
  let i = r.host.indexOf(`:`) === -1 ? r.host : `[` + r.host + `]`;
  return (
    (r.id = r.protocol + `://` + i + `:` + r.port + t),
    (r.href = r.protocol + `://` + i + (n && n.port === r.port ? `` : `:` + r.port)),
    r
  );
}
var On = typeof ArrayBuffer == `function`,
  kn = (e) => (typeof ArrayBuffer.isView == `function` ? ArrayBuffer.isView(e) : e.buffer instanceof ArrayBuffer),
  An = Object.prototype.toString,
  jn = typeof Blob == `function` || (typeof Blob < `u` && An.call(Blob) === `[object BlobConstructor]`),
  Mn = typeof File == `function` || (typeof File < `u` && An.call(File) === `[object FileConstructor]`);
function Nn(e) {
  return (On && (e instanceof ArrayBuffer || kn(e))) || (jn && e instanceof Blob) || (Mn && e instanceof File);
}
function Pn(e, t) {
  if (!e || typeof e != `object`) return !1;
  if (Array.isArray(e)) {
    for (let t = 0, n = e.length; t < n; t++) if (Pn(e[t])) return !0;
    return !1;
  }
  if (Nn(e)) return !0;
  if (e.toJSON && typeof e.toJSON == `function` && arguments.length === 1) return Pn(e.toJSON(), !0);
  for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t) && Pn(e[t])) return !0;
  return !1;
}
function Fn(e) {
  let t = [],
    n = e.data,
    r = e;
  return ((r.data = In(n, t)), (r.attachments = t.length), { packet: r, buffers: t });
}
function In(e, t) {
  if (!e) return e;
  if (Nn(e)) {
    let n = { _placeholder: !0, num: t.length };
    return (t.push(e), n);
  } else if (Array.isArray(e)) {
    let n = Array(e.length);
    for (let r = 0; r < e.length; r++) n[r] = In(e[r], t);
    return n;
  } else if (typeof e == `object` && !(e instanceof Date)) {
    let n = {};
    for (let r in e) Object.prototype.hasOwnProperty.call(e, r) && (n[r] = In(e[r], t));
    return n;
  }
  return e;
}
function Ln(e, t) {
  return ((e.data = Rn(e.data, t)), delete e.attachments, e);
}
function Rn(e, t) {
  if (!e) return e;
  if (e && e._placeholder === !0) {
    if (typeof e.num == `number` && e.num >= 0 && e.num < t.length) return t[e.num];
    throw Error(`illegal attachments`);
  } else if (Array.isArray(e)) for (let n = 0; n < e.length; n++) e[n] = Rn(e[n], t);
  else if (typeof e == `object`) for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && (e[n] = Rn(e[n], t));
  return e;
}
var zn = s({ Decoder: () => Un, Encoder: () => Vn, PacketType: () => V, protocol: () => 5 }),
  Bn = [`connect`, `connect_error`, `disconnect`, `disconnecting`, `newListener`, `removeListener`],
  V;
(function (e) {
  ((e[(e.CONNECT = 0)] = `CONNECT`),
    (e[(e.DISCONNECT = 1)] = `DISCONNECT`),
    (e[(e.EVENT = 2)] = `EVENT`),
    (e[(e.ACK = 3)] = `ACK`),
    (e[(e.CONNECT_ERROR = 4)] = `CONNECT_ERROR`),
    (e[(e.BINARY_EVENT = 5)] = `BINARY_EVENT`),
    (e[(e.BINARY_ACK = 6)] = `BINARY_ACK`));
})((V ||= {}));
var Vn = class {
  constructor(e) {
    this.replacer = e;
  }
  encode(e) {
    return (e.type === V.EVENT || e.type === V.ACK) && Pn(e)
      ? this.encodeAsBinary({
          type: e.type === V.EVENT ? V.BINARY_EVENT : V.BINARY_ACK,
          nsp: e.nsp,
          data: e.data,
          id: e.id,
        })
      : [this.encodeAsString(e)];
  }
  encodeAsString(e) {
    let t = `` + e.type;
    return (
      (e.type === V.BINARY_EVENT || e.type === V.BINARY_ACK) && (t += e.attachments + `-`),
      e.nsp && e.nsp !== `/` && (t += e.nsp + `,`),
      e.id != null && (t += e.id),
      e.data != null && (t += JSON.stringify(e.data, this.replacer)),
      t
    );
  }
  encodeAsBinary(e) {
    let t = Fn(e),
      n = this.encodeAsString(t.packet),
      r = t.buffers;
    return (r.unshift(n), r);
  }
};
function Hn(e) {
  return Object.prototype.toString.call(e) === `[object Object]`;
}
var Un = class e extends Bt {
    constructor(e) {
      (super(), (this.reviver = e));
    }
    add(e) {
      let t;
      if (typeof e == `string`) {
        if (this.reconstructor) throw Error(`got plaintext data when reconstructing a packet`);
        t = this.decodeString(e);
        let n = t.type === V.BINARY_EVENT;
        n || t.type === V.BINARY_ACK
          ? ((t.type = n ? V.EVENT : V.ACK),
            (this.reconstructor = new Wn(t)),
            t.attachments === 0 && super.emitReserved(`decoded`, t))
          : super.emitReserved(`decoded`, t);
      } else if (Nn(e) || e.base64)
        if (this.reconstructor)
          ((t = this.reconstructor.takeBinaryData(e)),
            t && ((this.reconstructor = null), super.emitReserved(`decoded`, t)));
        else throw Error(`got binary data when not reconstructing a packet`);
      else throw Error(`Unknown type: ` + e);
    }
    decodeString(t) {
      let n = 0,
        r = { type: Number(t.charAt(0)) };
      if (V[r.type] === void 0) throw Error(`unknown packet type ` + r.type);
      if (r.type === V.BINARY_EVENT || r.type === V.BINARY_ACK) {
        let e = n + 1;
        for (; t.charAt(++n) !== `-` && n != t.length; );
        let i = t.substring(e, n);
        if (i != Number(i) || t.charAt(n) !== `-`) throw Error(`Illegal attachments`);
        r.attachments = Number(i);
      }
      if (t.charAt(n + 1) === `/`) {
        let e = n + 1;
        for (; ++n && !(t.charAt(n) === `,` || n === t.length); );
        r.nsp = t.substring(e, n);
      } else r.nsp = `/`;
      let i = t.charAt(n + 1);
      if (i !== `` && Number(i) == i) {
        let e = n + 1;
        for (; ++n; ) {
          let e = t.charAt(n);
          if (e == null || Number(e) != e) {
            --n;
            break;
          }
          if (n === t.length) break;
        }
        r.id = Number(t.substring(e, n + 1));
      }
      if (t.charAt(++n)) {
        let i = this.tryParse(t.substr(n));
        if (e.isPayloadValid(r.type, i)) r.data = i;
        else throw Error(`invalid payload`);
      }
      return r;
    }
    tryParse(e) {
      try {
        return JSON.parse(e, this.reviver);
      } catch {
        return !1;
      }
    }
    static isPayloadValid(e, t) {
      switch (e) {
        case V.CONNECT:
          return Hn(t);
        case V.DISCONNECT:
          return t === void 0;
        case V.CONNECT_ERROR:
          return typeof t == `string` || Hn(t);
        case V.EVENT:
        case V.BINARY_EVENT:
          return Array.isArray(t) && (typeof t[0] == `number` || (typeof t[0] == `string` && Bn.indexOf(t[0]) === -1));
        case V.ACK:
        case V.BINARY_ACK:
          return Array.isArray(t);
      }
    }
    destroy() {
      this.reconstructor &&= (this.reconstructor.finishedReconstruction(), null);
    }
  },
  Wn = class {
    constructor(e) {
      ((this.packet = e), (this.buffers = []), (this.reconPack = e));
    }
    takeBinaryData(e) {
      if ((this.buffers.push(e), this.buffers.length === this.reconPack.attachments)) {
        let e = Ln(this.reconPack, this.buffers);
        return (this.finishedReconstruction(), e);
      }
      return null;
    }
    finishedReconstruction() {
      ((this.reconPack = null), (this.buffers = []));
    }
  };
function Gn(e, t, n) {
  return (
    e.on(t, n),
    function () {
      e.off(t, n);
    }
  );
}
var Kn = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    newListener: 1,
    removeListener: 1,
  }),
  qn = class extends Bt {
    constructor(e, t, n) {
      (super(),
        (this.connected = !1),
        (this.recovered = !1),
        (this.receiveBuffer = []),
        (this.sendBuffer = []),
        (this._queue = []),
        (this._queueSeq = 0),
        (this.ids = 0),
        (this.acks = {}),
        (this.flags = {}),
        (this.io = e),
        (this.nsp = t),
        n && n.auth && (this.auth = n.auth),
        (this._opts = Object.assign({}, n)),
        this.io._autoConnect && this.open());
    }
    get disconnected() {
      return !this.connected;
    }
    subEvents() {
      if (this.subs) return;
      let e = this.io;
      this.subs = [
        Gn(e, `open`, this.onopen.bind(this)),
        Gn(e, `packet`, this.onpacket.bind(this)),
        Gn(e, `error`, this.onerror.bind(this)),
        Gn(e, `close`, this.onclose.bind(this)),
      ];
    }
    get active() {
      return !!this.subs;
    }
    connect() {
      return this.connected
        ? this
        : (this.subEvents(),
          this.io._reconnecting || this.io.open(),
          this.io._readyState === `open` && this.onopen(),
          this);
    }
    open() {
      return this.connect();
    }
    send(...e) {
      return (e.unshift(`message`), this.emit.apply(this, e), this);
    }
    emit(e, ...t) {
      if (Kn.hasOwnProperty(e)) throw Error(`"` + e.toString() + `" is a reserved event name`);
      if ((t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile))
        return (this._addToQueue(t), this);
      let n = { type: V.EVENT, data: t };
      if (((n.options = {}), (n.options.compress = this.flags.compress !== !1), typeof t[t.length - 1] == `function`)) {
        let e = this.ids++,
          r = t.pop();
        (this._registerAckCallback(e, r), (n.id = e));
      }
      let r = this.io.engine?.transport?.writable,
        i = this.connected && !this.io.engine?._hasPingExpired();
      return (
        (this.flags.volatile && !r) ||
          (i ? (this.notifyOutgoingListeners(n), this.packet(n)) : this.sendBuffer.push(n)),
        (this.flags = {}),
        this
      );
    }
    _registerAckCallback(e, t) {
      let n = this.flags.timeout ?? this._opts.ackTimeout;
      if (n === void 0) {
        this.acks[e] = t;
        return;
      }
      let r = this.io.setTimeoutFn(() => {
          delete this.acks[e];
          for (let t = 0; t < this.sendBuffer.length; t++) this.sendBuffer[t].id === e && this.sendBuffer.splice(t, 1);
          t.call(this, Error(`operation has timed out`));
        }, n),
        i = (...e) => {
          (this.io.clearTimeoutFn(r), t.apply(this, e));
        };
      ((i.withError = !0), (this.acks[e] = i));
    }
    emitWithAck(e, ...t) {
      return new Promise((n, r) => {
        let i = (e, t) => (e ? r(e) : n(t));
        ((i.withError = !0), t.push(i), this.emit(e, ...t));
      });
    }
    _addToQueue(e) {
      let t;
      typeof e[e.length - 1] == `function` && (t = e.pop());
      let n = {
        id: this._queueSeq++,
        tryCount: 0,
        pending: !1,
        args: e,
        flags: Object.assign({ fromQueue: !0 }, this.flags),
      };
      (e.push(
        (e, ...r) => (
          this._queue[0],
          e === null
            ? (this._queue.shift(), t && t(null, ...r))
            : n.tryCount > this._opts.retries && (this._queue.shift(), t && t(e)),
          (n.pending = !1),
          this._drainQueue()
        ),
      ),
        this._queue.push(n),
        this._drainQueue());
    }
    _drainQueue(e = !1) {
      if (!this.connected || this._queue.length === 0) return;
      let t = this._queue[0];
      (t.pending && !e) || ((t.pending = !0), t.tryCount++, (this.flags = t.flags), this.emit.apply(this, t.args));
    }
    packet(e) {
      ((e.nsp = this.nsp), this.io._packet(e));
    }
    onopen() {
      typeof this.auth == `function`
        ? this.auth((e) => {
            this._sendConnectPacket(e);
          })
        : this._sendConnectPacket(this.auth);
    }
    _sendConnectPacket(e) {
      this.packet({
        type: V.CONNECT,
        data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e,
      });
    }
    onerror(e) {
      this.connected || this.emitReserved(`connect_error`, e);
    }
    onclose(e, t) {
      ((this.connected = !1), delete this.id, this.emitReserved(`disconnect`, e, t), this._clearAcks());
    }
    _clearAcks() {
      Object.keys(this.acks).forEach((e) => {
        if (!this.sendBuffer.some((t) => String(t.id) === e)) {
          let t = this.acks[e];
          (delete this.acks[e], t.withError && t.call(this, Error(`socket has been disconnected`)));
        }
      });
    }
    onpacket(e) {
      if (e.nsp === this.nsp)
        switch (e.type) {
          case V.CONNECT:
            e.data && e.data.sid
              ? this.onconnect(e.data.sid, e.data.pid)
              : this.emitReserved(
                  `connect_error`,
                  Error(
                    `It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)`,
                  ),
                );
            break;
          case V.EVENT:
          case V.BINARY_EVENT:
            this.onevent(e);
            break;
          case V.ACK:
          case V.BINARY_ACK:
            this.onack(e);
            break;
          case V.DISCONNECT:
            this.ondisconnect();
            break;
          case V.CONNECT_ERROR:
            this.destroy();
            let t = Error(e.data.message);
            ((t.data = e.data.data), this.emitReserved(`connect_error`, t));
            break;
        }
    }
    onevent(e) {
      let t = e.data || [];
      (e.id != null && t.push(this.ack(e.id)),
        this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t)));
    }
    emitEvent(e) {
      if (this._anyListeners && this._anyListeners.length) {
        let t = this._anyListeners.slice();
        for (let n of t) n.apply(this, e);
      }
      (super.emit.apply(this, e),
        this._pid && e.length && typeof e[e.length - 1] == `string` && (this._lastOffset = e[e.length - 1]));
    }
    ack(e) {
      let t = this,
        n = !1;
      return function (...r) {
        n || ((n = !0), t.packet({ type: V.ACK, id: e, data: r }));
      };
    }
    onack(e) {
      let t = this.acks[e.id];
      typeof t == `function` && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data));
    }
    onconnect(e, t) {
      ((this.id = e),
        (this.recovered = t && this._pid === t),
        (this._pid = t),
        (this.connected = !0),
        this.emitBuffered(),
        this._drainQueue(!0),
        this.emitReserved(`connect`));
    }
    emitBuffered() {
      (this.receiveBuffer.forEach((e) => this.emitEvent(e)),
        (this.receiveBuffer = []),
        this.sendBuffer.forEach((e) => {
          (this.notifyOutgoingListeners(e), this.packet(e));
        }),
        (this.sendBuffer = []));
    }
    ondisconnect() {
      (this.destroy(), this.onclose(`io server disconnect`));
    }
    destroy() {
      ((this.subs &&= (this.subs.forEach((e) => e()), void 0)), this.io._destroy(this));
    }
    disconnect() {
      return (
        this.connected && this.packet({ type: V.DISCONNECT }),
        this.destroy(),
        this.connected && this.onclose(`io client disconnect`),
        this
      );
    }
    close() {
      return this.disconnect();
    }
    compress(e) {
      return ((this.flags.compress = e), this);
    }
    get volatile() {
      return ((this.flags.volatile = !0), this);
    }
    timeout(e) {
      return ((this.flags.timeout = e), this);
    }
    onAny(e) {
      return ((this._anyListeners = this._anyListeners || []), this._anyListeners.push(e), this);
    }
    prependAny(e) {
      return ((this._anyListeners = this._anyListeners || []), this._anyListeners.unshift(e), this);
    }
    offAny(e) {
      if (!this._anyListeners) return this;
      if (e) {
        let t = this._anyListeners;
        for (let n = 0; n < t.length; n++) if (e === t[n]) return (t.splice(n, 1), this);
      } else this._anyListeners = [];
      return this;
    }
    listenersAny() {
      return this._anyListeners || [];
    }
    onAnyOutgoing(e) {
      return (
        (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
        this._anyOutgoingListeners.push(e),
        this
      );
    }
    prependAnyOutgoing(e) {
      return (
        (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
        this._anyOutgoingListeners.unshift(e),
        this
      );
    }
    offAnyOutgoing(e) {
      if (!this._anyOutgoingListeners) return this;
      if (e) {
        let t = this._anyOutgoingListeners;
        for (let n = 0; n < t.length; n++) if (e === t[n]) return (t.splice(n, 1), this);
      } else this._anyOutgoingListeners = [];
      return this;
    }
    listenersAnyOutgoing() {
      return this._anyOutgoingListeners || [];
    }
    notifyOutgoingListeners(e) {
      if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
        let t = this._anyOutgoingListeners.slice();
        for (let n of t) n.apply(this, e.data);
      }
    }
  };
function Jn(e) {
  ((e ||= {}),
    (this.ms = e.min || 100),
    (this.max = e.max || 1e4),
    (this.factor = e.factor || 2),
    (this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0),
    (this.attempts = 0));
}
((Jn.prototype.duration = function () {
  var e = this.ms * this.factor ** +this.attempts++;
  if (this.jitter) {
    var t = Math.random(),
      n = Math.floor(t * this.jitter * e);
    e = Math.floor(t * 10) & 1 ? e + n : e - n;
  }
  return Math.min(e, this.max) | 0;
}),
  (Jn.prototype.reset = function () {
    this.attempts = 0;
  }),
  (Jn.prototype.setMin = function (e) {
    this.ms = e;
  }),
  (Jn.prototype.setMax = function (e) {
    this.max = e;
  }),
  (Jn.prototype.setJitter = function (e) {
    this.jitter = e;
  }));
var Yn = class extends Bt {
    constructor(e, t) {
      (super(),
        (this.nsps = {}),
        (this.subs = []),
        e && typeof e == `object` && ((t = e), (e = void 0)),
        (t ||= {}),
        (t.path = t.path || `/socket.io`),
        (this.opts = t),
        qt(this, t),
        this.reconnection(t.reconnection !== !1),
        this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0),
        this.reconnectionDelay(t.reconnectionDelay || 1e3),
        this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3),
        this.randomizationFactor(t.randomizationFactor ?? 0.5),
        (this.backoff = new Jn({
          min: this.reconnectionDelay(),
          max: this.reconnectionDelayMax(),
          jitter: this.randomizationFactor(),
        })),
        this.timeout(t.timeout == null ? 2e4 : t.timeout),
        (this._readyState = `closed`),
        (this.uri = e));
      let n = t.parser || zn;
      ((this.encoder = new n.Encoder()),
        (this.decoder = new n.Decoder()),
        (this._autoConnect = t.autoConnect !== !1),
        this._autoConnect && this.open());
    }
    reconnection(e) {
      return arguments.length ? ((this._reconnection = !!e), e || (this.skipReconnect = !0), this) : this._reconnection;
    }
    reconnectionAttempts(e) {
      return e === void 0 ? this._reconnectionAttempts : ((this._reconnectionAttempts = e), this);
    }
    reconnectionDelay(e) {
      var t;
      return e === void 0
        ? this._reconnectionDelay
        : ((this._reconnectionDelay = e), (t = this.backoff) == null || t.setMin(e), this);
    }
    randomizationFactor(e) {
      var t;
      return e === void 0
        ? this._randomizationFactor
        : ((this._randomizationFactor = e), (t = this.backoff) == null || t.setJitter(e), this);
    }
    reconnectionDelayMax(e) {
      var t;
      return e === void 0
        ? this._reconnectionDelayMax
        : ((this._reconnectionDelayMax = e), (t = this.backoff) == null || t.setMax(e), this);
    }
    timeout(e) {
      return arguments.length ? ((this._timeout = e), this) : this._timeout;
    }
    maybeReconnectOnOpen() {
      !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
    }
    open(e) {
      if (~this._readyState.indexOf(`open`)) return this;
      this.engine = new En(this.uri, this.opts);
      let t = this.engine,
        n = this;
      ((this._readyState = `opening`), (this.skipReconnect = !1));
      let r = Gn(t, `open`, function () {
          (n.onopen(), e && e());
        }),
        i = (t) => {
          (this.cleanup(),
            (this._readyState = `closed`),
            this.emitReserved(`error`, t),
            e ? e(t) : this.maybeReconnectOnOpen());
        },
        a = Gn(t, `error`, i);
      if (!1 !== this._timeout) {
        let e = this._timeout,
          n = this.setTimeoutFn(() => {
            (r(), i(Error(`timeout`)), t.close());
          }, e);
        (this.opts.autoUnref && n.unref(),
          this.subs.push(() => {
            this.clearTimeoutFn(n);
          }));
      }
      return (this.subs.push(r), this.subs.push(a), this);
    }
    connect(e) {
      return this.open(e);
    }
    onopen() {
      (this.cleanup(), (this._readyState = `open`), this.emitReserved(`open`));
      let e = this.engine;
      this.subs.push(
        Gn(e, `ping`, this.onping.bind(this)),
        Gn(e, `data`, this.ondata.bind(this)),
        Gn(e, `error`, this.onerror.bind(this)),
        Gn(e, `close`, this.onclose.bind(this)),
        Gn(this.decoder, `decoded`, this.ondecoded.bind(this)),
      );
    }
    onping() {
      this.emitReserved(`ping`);
    }
    ondata(e) {
      try {
        this.decoder.add(e);
      } catch (e) {
        this.onclose(`parse error`, e);
      }
    }
    ondecoded(e) {
      B(() => {
        this.emitReserved(`packet`, e);
      }, this.setTimeoutFn);
    }
    onerror(e) {
      this.emitReserved(`error`, e);
    }
    socket(e, t) {
      let n = this.nsps[e];
      return (n ? this._autoConnect && !n.active && n.connect() : ((n = new qn(this, e, t)), (this.nsps[e] = n)), n);
    }
    _destroy(e) {
      let t = Object.keys(this.nsps);
      for (let e of t) if (this.nsps[e].active) return;
      this._close();
    }
    _packet(e) {
      let t = this.encoder.encode(e);
      for (let n = 0; n < t.length; n++) this.engine.write(t[n], e.options);
    }
    cleanup() {
      (this.subs.forEach((e) => e()), (this.subs.length = 0), this.decoder.destroy());
    }
    _close() {
      ((this.skipReconnect = !0), (this._reconnecting = !1), this.onclose(`forced close`));
    }
    disconnect() {
      return this._close();
    }
    onclose(e, t) {
      var n;
      (this.cleanup(),
        (n = this.engine) == null || n.close(),
        this.backoff.reset(),
        (this._readyState = `closed`),
        this.emitReserved(`close`, e, t),
        this._reconnection && !this.skipReconnect && this.reconnect());
    }
    reconnect() {
      if (this._reconnecting || this.skipReconnect) return this;
      let e = this;
      if (this.backoff.attempts >= this._reconnectionAttempts)
        (this.backoff.reset(), this.emitReserved(`reconnect_failed`), (this._reconnecting = !1));
      else {
        let t = this.backoff.duration();
        this._reconnecting = !0;
        let n = this.setTimeoutFn(() => {
          e.skipReconnect ||
            (this.emitReserved(`reconnect_attempt`, e.backoff.attempts),
            !e.skipReconnect &&
              e.open((t) => {
                t ? ((e._reconnecting = !1), e.reconnect(), this.emitReserved(`reconnect_error`, t)) : e.onreconnect();
              }));
        }, t);
        (this.opts.autoUnref && n.unref(),
          this.subs.push(() => {
            this.clearTimeoutFn(n);
          }));
      }
    }
    onreconnect() {
      let e = this.backoff.attempts;
      ((this._reconnecting = !1), this.backoff.reset(), this.emitReserved(`reconnect`, e));
    }
  },
  Xn = {};
function Zn(e, t) {
  (typeof e == `object` && ((t = e), (e = void 0)), (t ||= {}));
  let n = Dn(e, t.path || `/socket.io`),
    r = n.source,
    i = n.id,
    a = n.path,
    o = Xn[i] && a in Xn[i].nsps,
    s = t.forceNew || t[`force new connection`] || !1 === t.multiplex || o,
    c;
  return (
    s ? (c = new Yn(r, t)) : (Xn[i] || (Xn[i] = new Yn(r, t)), (c = Xn[i])),
    n.query && !t.query && (t.query = n.queryKey),
    c.socket(n.path, t)
  );
}
Object.assign(Zn, { Manager: Yn, Socket: qn, io: Zn, connect: Zn });
var Qn = { debug: 0, info: 1, warn: 2, error: 3 },
  $n = Qn.info,
  er = () => new Date().toLocaleTimeString(),
  tr = {
    reset: `\x1B[0m`,
    blue: `\x1B[34m`,
    cyan: `\x1B[36m`,
    green: `\x1B[32m`,
    yellow: `\x1B[33m`,
    red: `\x1B[31m`,
    magenta: `\x1B[35m`,
    gray: `\x1B[90m`,
  },
  H = {
    debug: (e, t, n) => {
      $n <= Qn.debug && console.log(`${tr.blue}[${er()}]${tr.reset} ${tr.gray}[${e}]${tr.reset} ${t}`, n || ``);
    },
    info: (e, t, n) => {
      $n <= Qn.info && console.log(`${tr.blue}[${er()}]${tr.reset} ${tr.cyan}[${e}]${tr.reset} ${t}`, n || ``);
    },
    warn: (e, t, n) => {
      $n <= Qn.warn && console.warn(`${tr.blue}[${er()}]${tr.reset} ${tr.yellow}[${e}]${tr.reset} ${t}`, n || ``);
    },
    error: (e, t, n) => {
      $n <= Qn.error && console.error(`${tr.blue}[${er()}]${tr.reset} ${tr.red}[${e}]${tr.reset} ${t}`, n || ``);
    },
    socket: (e, t, n) => {
      let r = e === `⬅️` ? tr.yellow : tr.green,
        i = e === `⬅️` ? tr.cyan : tr.magenta;
      console.log(`${tr.blue}[${er()}]${tr.reset} ${r}[${e}]${tr.reset} ${i}[${t}]${tr.reset}`, n || ``);
    },
  };
function nr(e) {
  if (!e || typeof document > `u`) return;
  let t = document.head || document.getElementsByTagName(`head`)[0],
    n = document.createElement(`style`);
  ((n.type = `text/css`),
    t.appendChild(n),
    n.styleSheet ? (n.styleSheet.cssText = e) : n.appendChild(document.createTextNode(e)));
}
var rr = (e) => {
    switch (e) {
      case `success`:
        return or;
      case `info`:
        return cr;
      case `warning`:
        return sr;
      case `error`:
        return lr;
      default:
        return null;
    }
  },
  ir = Array(12).fill(0),
  ar = ({ visible: e, className: t }) =>
    _.createElement(
      `div`,
      { className: [`sonner-loading-wrapper`, t].filter(Boolean).join(` `), 'data-visible': e },
      _.createElement(
        `div`,
        { className: `sonner-spinner` },
        ir.map((e, t) => _.createElement(`div`, { className: `sonner-loading-bar`, key: `spinner-bar-${t}` })),
      ),
    ),
  or = _.createElement(
    `svg`,
    { xmlns: `http://www.w3.org/2000/svg`, viewBox: `0 0 20 20`, fill: `currentColor`, height: `20`, width: `20` },
    _.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z`,
      clipRule: `evenodd`,
    }),
  ),
  sr = _.createElement(
    `svg`,
    { xmlns: `http://www.w3.org/2000/svg`, viewBox: `0 0 24 24`, fill: `currentColor`, height: `20`, width: `20` },
    _.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z`,
      clipRule: `evenodd`,
    }),
  ),
  cr = _.createElement(
    `svg`,
    { xmlns: `http://www.w3.org/2000/svg`, viewBox: `0 0 20 20`, fill: `currentColor`, height: `20`, width: `20` },
    _.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z`,
      clipRule: `evenodd`,
    }),
  ),
  lr = _.createElement(
    `svg`,
    { xmlns: `http://www.w3.org/2000/svg`, viewBox: `0 0 20 20`, fill: `currentColor`, height: `20`, width: `20` },
    _.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z`,
      clipRule: `evenodd`,
    }),
  ),
  ur = _.createElement(
    `svg`,
    {
      xmlns: `http://www.w3.org/2000/svg`,
      width: `12`,
      height: `12`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.5`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
    },
    _.createElement(`line`, { x1: `18`, y1: `6`, x2: `6`, y2: `18` }),
    _.createElement(`line`, { x1: `6`, y1: `6`, x2: `18`, y2: `18` }),
  ),
  dr = () => {
    let [e, t] = _.useState(document.hidden);
    return (
      _.useEffect(() => {
        let e = () => {
          t(document.hidden);
        };
        return (
          document.addEventListener(`visibilitychange`, e),
          () => window.removeEventListener(`visibilitychange`, e)
        );
      }, []),
      e
    );
  },
  fr = 1,
  pr = new (class {
    constructor() {
      ((this.subscribe = (e) => (
        this.subscribers.push(e),
        () => {
          let t = this.subscribers.indexOf(e);
          this.subscribers.splice(t, 1);
        }
      )),
        (this.publish = (e) => {
          this.subscribers.forEach((t) => t(e));
        }),
        (this.addToast = (e) => {
          (this.publish(e), (this.toasts = [...this.toasts, e]));
        }),
        (this.create = (e) => {
          let { message: t, ...n } = e,
            r = typeof e?.id == `number` || e.id?.length > 0 ? e.id : fr++,
            i = this.toasts.find((e) => e.id === r),
            a = e.dismissible === void 0 ? !0 : e.dismissible;
          return (
            this.dismissedToasts.has(r) && this.dismissedToasts.delete(r),
            i
              ? (this.toasts = this.toasts.map((n) =>
                  n.id === r
                    ? (this.publish({ ...n, ...e, id: r, title: t }), { ...n, ...e, id: r, dismissible: a, title: t })
                    : n,
                ))
              : this.addToast({ title: t, ...n, dismissible: a, id: r }),
            r
          );
        }),
        (this.dismiss = (e) => (
          e
            ? (this.dismissedToasts.add(e),
              requestAnimationFrame(() => this.subscribers.forEach((t) => t({ id: e, dismiss: !0 }))))
            : this.toasts.forEach((e) => {
                this.subscribers.forEach((t) => t({ id: e.id, dismiss: !0 }));
              }),
          e
        )),
        (this.message = (e, t) => this.create({ ...t, message: e })),
        (this.error = (e, t) => this.create({ ...t, message: e, type: `error` })),
        (this.success = (e, t) => this.create({ ...t, type: `success`, message: e })),
        (this.info = (e, t) => this.create({ ...t, type: `info`, message: e })),
        (this.warning = (e, t) => this.create({ ...t, type: `warning`, message: e })),
        (this.loading = (e, t) => this.create({ ...t, type: `loading`, message: e })),
        (this.promise = (e, t) => {
          if (!t) return;
          let n;
          t.loading !== void 0 &&
            (n = this.create({
              ...t,
              promise: e,
              type: `loading`,
              message: t.loading,
              description: typeof t.description == `function` ? void 0 : t.description,
            }));
          let r = Promise.resolve(e instanceof Function ? e() : e),
            i = n !== void 0,
            a,
            o = r
              .then(async (e) => {
                if (((a = [`resolve`, e]), _.isValidElement(e)))
                  ((i = !1), this.create({ id: n, type: `default`, message: e }));
                else if (hr(e) && !e.ok) {
                  i = !1;
                  let r = typeof t.error == `function` ? await t.error(`HTTP error! status: ${e.status}`) : t.error,
                    a =
                      typeof t.description == `function`
                        ? await t.description(`HTTP error! status: ${e.status}`)
                        : t.description,
                    o = typeof r == `object` && !_.isValidElement(r) ? r : { message: r };
                  this.create({ id: n, type: `error`, description: a, ...o });
                } else if (e instanceof Error) {
                  i = !1;
                  let r = typeof t.error == `function` ? await t.error(e) : t.error,
                    a = typeof t.description == `function` ? await t.description(e) : t.description,
                    o = typeof r == `object` && !_.isValidElement(r) ? r : { message: r };
                  this.create({ id: n, type: `error`, description: a, ...o });
                } else if (t.success !== void 0) {
                  i = !1;
                  let r = typeof t.success == `function` ? await t.success(e) : t.success,
                    a = typeof t.description == `function` ? await t.description(e) : t.description,
                    o = typeof r == `object` && !_.isValidElement(r) ? r : { message: r };
                  this.create({ id: n, type: `success`, description: a, ...o });
                }
              })
              .catch(async (e) => {
                if (((a = [`reject`, e]), t.error !== void 0)) {
                  i = !1;
                  let r = typeof t.error == `function` ? await t.error(e) : t.error,
                    a = typeof t.description == `function` ? await t.description(e) : t.description,
                    o = typeof r == `object` && !_.isValidElement(r) ? r : { message: r };
                  this.create({ id: n, type: `error`, description: a, ...o });
                }
              })
              .finally(() => {
                (i && (this.dismiss(n), (n = void 0)), t.finally == null || t.finally.call(t));
              }),
            s = () => new Promise((e, t) => o.then(() => (a[0] === `reject` ? t(a[1]) : e(a[1]))).catch(t));
          return typeof n != `string` && typeof n != `number` ? { unwrap: s } : Object.assign(n, { unwrap: s });
        }),
        (this.custom = (e, t) => {
          let n = t?.id || fr++;
          return (this.create({ jsx: e(n), id: n, ...t }), n);
        }),
        (this.getActiveToasts = () => this.toasts.filter((e) => !this.dismissedToasts.has(e.id))),
        (this.subscribers = []),
        (this.toasts = []),
        (this.dismissedToasts = new Set()));
    }
  })(),
  mr = (e, t) => {
    let n = t?.id || fr++;
    return (pr.addToast({ title: e, ...t, id: n }), n);
  },
  hr = (e) =>
    e && typeof e == `object` && `ok` in e && typeof e.ok == `boolean` && `status` in e && typeof e.status == `number`,
  gr = Object.assign(
    mr,
    {
      success: pr.success,
      info: pr.info,
      warning: pr.warning,
      error: pr.error,
      custom: pr.custom,
      message: pr.message,
      promise: pr.promise,
      dismiss: pr.dismiss,
      loading: pr.loading,
    },
    { getHistory: () => pr.toasts, getToasts: () => pr.getActiveToasts() },
  );
nr(
  `[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}`,
);
function _r(e) {
  return e.label !== void 0;
}
var vr = 3,
  yr = `24px`,
  br = `16px`,
  xr = 4e3,
  Sr = 356,
  Cr = 14,
  wr = 45,
  Tr = 200;
function Er(...e) {
  return e.filter(Boolean).join(` `);
}
function Dr(e) {
  let [t, n] = e.split(`-`),
    r = [];
  return (t && r.push(t), n && r.push(n), r);
}
var Or = (e) => {
  let {
      invert: t,
      toast: n,
      unstyled: r,
      interacting: i,
      setHeights: a,
      visibleToasts: o,
      heights: s,
      index: c,
      toasts: l,
      expanded: u,
      removeToast: d,
      defaultRichColors: f,
      closeButton: p,
      style: m,
      cancelButtonStyle: h,
      actionButtonStyle: g,
      className: v = ``,
      descriptionClassName: y = ``,
      duration: b,
      position: x,
      gap: S,
      expandByDefault: C,
      classNames: w,
      icons: T,
      closeButtonAriaLabel: E = `Close toast`,
    } = e,
    [D, O] = _.useState(null),
    [k, A] = _.useState(null),
    [j, M] = _.useState(!1),
    [ee, N] = _.useState(!1),
    [P, te] = _.useState(!1),
    [ne, re] = _.useState(!1),
    [F, ie] = _.useState(!1),
    [ae, oe] = _.useState(0),
    [se, ce] = _.useState(0),
    le = _.useRef(n.duration || b || xr),
    ue = _.useRef(null),
    I = _.useRef(null),
    de = c === 0,
    fe = c + 1 <= o,
    L = n.type,
    pe = n.dismissible !== !1,
    me = n.className || ``,
    he = n.descriptionClassName || ``,
    R = _.useMemo(() => s.findIndex((e) => e.toastId === n.id) || 0, [s, n.id]),
    ge = _.useMemo(() => n.closeButton ?? p, [n.closeButton, p]),
    _e = _.useMemo(() => n.duration || b || xr, [n.duration, b]),
    ve = _.useRef(0),
    ye = _.useRef(0),
    be = _.useRef(0),
    xe = _.useRef(null),
    [Se, Ce] = x.split(`-`),
    we = _.useMemo(() => s.reduce((e, t, n) => (n >= R ? e : e + t.height), 0), [s, R]),
    Te = dr(),
    Ee = n.invert || t,
    De = L === `loading`;
  ((ye.current = _.useMemo(() => R * S + we, [R, we])),
    _.useEffect(() => {
      le.current = _e;
    }, [_e]),
    _.useEffect(() => {
      M(!0);
    }, []),
    _.useEffect(() => {
      let e = I.current;
      if (e) {
        let t = e.getBoundingClientRect().height;
        return (
          ce(t),
          a((e) => [{ toastId: n.id, height: t, position: n.position }, ...e]),
          () => a((e) => e.filter((e) => e.toastId !== n.id))
        );
      }
    }, [a, n.id]),
    _.useLayoutEffect(() => {
      if (!j) return;
      let e = I.current,
        t = e.style.height;
      e.style.height = `auto`;
      let r = e.getBoundingClientRect().height;
      ((e.style.height = t),
        ce(r),
        a((e) =>
          e.find((e) => e.toastId === n.id)
            ? e.map((e) => (e.toastId === n.id ? { ...e, height: r } : e))
            : [{ toastId: n.id, height: r, position: n.position }, ...e],
        ));
    }, [j, n.title, n.description, a, n.id, n.jsx, n.action, n.cancel]));
  let Oe = _.useCallback(() => {
    (N(!0),
      oe(ye.current),
      a((e) => e.filter((e) => e.toastId !== n.id)),
      setTimeout(() => {
        d(n);
      }, Tr));
  }, [n, d, a, ye]);
  (_.useEffect(() => {
    if ((n.promise && L === `loading`) || n.duration === 1 / 0 || n.type === `loading`) return;
    let e;
    return (
      u || i || Te
        ? (() => {
            if (be.current < ve.current) {
              let e = new Date().getTime() - ve.current;
              le.current -= e;
            }
            be.current = new Date().getTime();
          })()
        : le.current !== 1 / 0 &&
          ((ve.current = new Date().getTime()),
          (e = setTimeout(() => {
            (n.onAutoClose == null || n.onAutoClose.call(n, n), Oe());
          }, le.current))),
      () => clearTimeout(e)
    );
  }, [u, i, n, L, Te, Oe]),
    _.useEffect(() => {
      n.delete && (Oe(), n.onDismiss == null || n.onDismiss.call(n, n));
    }, [Oe, n.delete]));
  function ke() {
    return T?.loading
      ? _.createElement(
          `div`,
          { className: Er(w?.loader, n?.classNames?.loader, `sonner-loader`), 'data-visible': L === `loading` },
          T.loading,
        )
      : _.createElement(ar, { className: Er(w?.loader, n?.classNames?.loader), visible: L === `loading` });
  }
  let Ae = n.icon || T?.[L] || rr(L);
  return _.createElement(
    `li`,
    {
      tabIndex: 0,
      ref: I,
      className: Er(v, me, w?.toast, n?.classNames?.toast, w?.default, w?.[L], n?.classNames?.[L]),
      'data-sonner-toast': ``,
      'data-rich-colors': n.richColors ?? f,
      'data-styled': !(n.jsx || n.unstyled || r),
      'data-mounted': j,
      'data-promise': !!n.promise,
      'data-swiped': F,
      'data-removed': ee,
      'data-visible': fe,
      'data-y-position': Se,
      'data-x-position': Ce,
      'data-index': c,
      'data-front': de,
      'data-swiping': P,
      'data-dismissible': pe,
      'data-type': L,
      'data-invert': Ee,
      'data-swipe-out': ne,
      'data-swipe-direction': k,
      'data-expanded': !!(u || (C && j)),
      'data-testid': n.testId,
      style: {
        '--index': c,
        '--toasts-before': c,
        '--z-index': l.length - c,
        '--offset': `${ee ? ae : ye.current}px`,
        '--initial-height': C ? `auto` : `${se}px`,
        ...m,
        ...n.style,
      },
      onDragEnd: () => {
        (te(!1), O(null), (xe.current = null));
      },
      onPointerDown: (e) => {
        e.button !== 2 &&
          (De ||
            !pe ||
            ((ue.current = new Date()),
            oe(ye.current),
            e.target.setPointerCapture(e.pointerId),
            e.target.tagName !== `BUTTON` && (te(!0), (xe.current = { x: e.clientX, y: e.clientY }))));
      },
      onPointerUp: () => {
        if (ne || !pe) return;
        xe.current = null;
        let e = Number(I.current?.style.getPropertyValue(`--swipe-amount-x`).replace(`px`, ``) || 0),
          t = Number(I.current?.style.getPropertyValue(`--swipe-amount-y`).replace(`px`, ``) || 0),
          r = new Date().getTime() - ue.current?.getTime(),
          i = D === `x` ? e : t,
          a = Math.abs(i) / r;
        if (Math.abs(i) >= wr || a > 0.11) {
          (oe(ye.current),
            n.onDismiss == null || n.onDismiss.call(n, n),
            A(D === `x` ? (e > 0 ? `right` : `left`) : t > 0 ? `down` : `up`),
            Oe(),
            re(!0));
          return;
        } else {
          var o, s;
          ((o = I.current) == null || o.style.setProperty(`--swipe-amount-x`, `0px`),
            (s = I.current) == null || s.style.setProperty(`--swipe-amount-y`, `0px`));
        }
        (ie(!1), te(!1), O(null));
      },
      onPointerMove: (t) => {
        var n, r;
        if (!xe.current || !pe || window.getSelection()?.toString().length > 0) return;
        let i = t.clientY - xe.current.y,
          a = t.clientX - xe.current.x,
          o = e.swipeDirections ?? Dr(x);
        !D && (Math.abs(a) > 1 || Math.abs(i) > 1) && O(Math.abs(a) > Math.abs(i) ? `x` : `y`);
        let s = { x: 0, y: 0 },
          c = (e) => 1 / (1.5 + Math.abs(e) / 20);
        if (D === `y`) {
          if (o.includes(`top`) || o.includes(`bottom`))
            if ((o.includes(`top`) && i < 0) || (o.includes(`bottom`) && i > 0)) s.y = i;
            else {
              let e = i * c(i);
              s.y = Math.abs(e) < Math.abs(i) ? e : i;
            }
        } else if (D === `x` && (o.includes(`left`) || o.includes(`right`)))
          if ((o.includes(`left`) && a < 0) || (o.includes(`right`) && a > 0)) s.x = a;
          else {
            let e = a * c(a);
            s.x = Math.abs(e) < Math.abs(a) ? e : a;
          }
        ((Math.abs(s.x) > 0 || Math.abs(s.y) > 0) && ie(!0),
          (n = I.current) == null || n.style.setProperty(`--swipe-amount-x`, `${s.x}px`),
          (r = I.current) == null || r.style.setProperty(`--swipe-amount-y`, `${s.y}px`));
      },
    },
    ge && !n.jsx && L !== `loading`
      ? _.createElement(
          `button`,
          {
            'aria-label': E,
            'data-disabled': De,
            'data-close-button': !0,
            onClick:
              De || !pe
                ? () => {}
                : () => {
                    (Oe(), n.onDismiss == null || n.onDismiss.call(n, n));
                  },
            className: Er(w?.closeButton, n?.classNames?.closeButton),
          },
          T?.close ?? ur,
        )
      : null,
    (L || n.icon || n.promise) && n.icon !== null && (T?.[L] !== null || n.icon)
      ? _.createElement(
          `div`,
          { 'data-icon': ``, className: Er(w?.icon, n?.classNames?.icon) },
          n.promise || (n.type === `loading` && !n.icon) ? n.icon || ke() : null,
          n.type === `loading` ? null : Ae,
        )
      : null,
    _.createElement(
      `div`,
      { 'data-content': ``, className: Er(w?.content, n?.classNames?.content) },
      _.createElement(
        `div`,
        { 'data-title': ``, className: Er(w?.title, n?.classNames?.title) },
        n.jsx ? n.jsx : typeof n.title == `function` ? n.title() : n.title,
      ),
      n.description
        ? _.createElement(
            `div`,
            { 'data-description': ``, className: Er(y, he, w?.description, n?.classNames?.description) },
            typeof n.description == `function` ? n.description() : n.description,
          )
        : null,
    ),
    _.isValidElement(n.cancel)
      ? n.cancel
      : n.cancel && _r(n.cancel)
        ? _.createElement(
            `button`,
            {
              'data-button': !0,
              'data-cancel': !0,
              style: n.cancelButtonStyle || h,
              onClick: (e) => {
                _r(n.cancel) && pe && (n.cancel.onClick == null || n.cancel.onClick.call(n.cancel, e), Oe());
              },
              className: Er(w?.cancelButton, n?.classNames?.cancelButton),
            },
            n.cancel.label,
          )
        : null,
    _.isValidElement(n.action)
      ? n.action
      : n.action && _r(n.action)
        ? _.createElement(
            `button`,
            {
              'data-button': !0,
              'data-action': !0,
              style: n.actionButtonStyle || g,
              onClick: (e) => {
                _r(n.action) &&
                  (n.action.onClick == null || n.action.onClick.call(n.action, e), !e.defaultPrevented && Oe());
              },
              className: Er(w?.actionButton, n?.classNames?.actionButton),
            },
            n.action.label,
          )
        : null,
  );
};
function kr() {
  if (typeof window > `u` || typeof document > `u`) return `ltr`;
  let e = document.documentElement.getAttribute(`dir`);
  return e === `auto` || !e ? window.getComputedStyle(document.documentElement).direction : e;
}
function Ar(e, t) {
  let n = {};
  return (
    [e, t].forEach((e, t) => {
      let r = t === 1,
        i = r ? `--mobile-offset` : `--offset`,
        a = r ? br : yr;
      function o(e) {
        [`top`, `right`, `bottom`, `left`].forEach((t) => {
          n[`${i}-${t}`] = typeof e == `number` ? `${e}px` : e;
        });
      }
      typeof e == `number` || typeof e == `string`
        ? o(e)
        : typeof e == `object`
          ? [`top`, `right`, `bottom`, `left`].forEach((t) => {
              e[t] === void 0 ? (n[`${i}-${t}`] = a) : (n[`${i}-${t}`] = typeof e[t] == `number` ? `${e[t]}px` : e[t]);
            })
          : o(a);
    }),
    n
  );
}
var jr = _.forwardRef(function (e, t) {
    let {
        id: n,
        invert: r,
        position: i = `bottom-right`,
        hotkey: a = [`altKey`, `KeyT`],
        expand: o,
        closeButton: s,
        className: c,
        offset: l,
        mobileOffset: u,
        theme: d = `light`,
        richColors: f,
        duration: p,
        style: m,
        visibleToasts: h = vr,
        toastOptions: g,
        dir: v = kr(),
        gap: b = Cr,
        icons: x,
        containerAriaLabel: S = `Notifications`,
      } = e,
      [C, w] = _.useState([]),
      T = _.useMemo(() => (n ? C.filter((e) => e.toasterId === n) : C.filter((e) => !e.toasterId)), [C, n]),
      E = _.useMemo(() => Array.from(new Set([i].concat(T.filter((e) => e.position).map((e) => e.position)))), [T, i]),
      [D, O] = _.useState([]),
      [k, A] = _.useState(!1),
      [j, M] = _.useState(!1),
      [ee, N] = _.useState(
        d === `system`
          ? typeof window < `u` && window.matchMedia && window.matchMedia(`(prefers-color-scheme: dark)`).matches
            ? `dark`
            : `light`
          : d,
      ),
      P = _.useRef(null),
      te = a.join(`+`).replace(/Key/g, ``).replace(/Digit/g, ``),
      ne = _.useRef(null),
      re = _.useRef(!1),
      F = _.useCallback((e) => {
        w((t) => (t.find((t) => t.id === e.id)?.delete || pr.dismiss(e.id), t.filter(({ id: t }) => t !== e.id)));
      }, []);
    return (
      _.useEffect(
        () =>
          pr.subscribe((e) => {
            if (e.dismiss) {
              requestAnimationFrame(() => {
                w((t) => t.map((t) => (t.id === e.id ? { ...t, delete: !0 } : t)));
              });
              return;
            }
            setTimeout(() => {
              y.flushSync(() => {
                w((t) => {
                  let n = t.findIndex((t) => t.id === e.id);
                  return n === -1 ? [e, ...t] : [...t.slice(0, n), { ...t[n], ...e }, ...t.slice(n + 1)];
                });
              });
            });
          }),
        [C],
      ),
      _.useEffect(() => {
        if (d !== `system`) {
          N(d);
          return;
        }
        if (
          (d === `system` &&
            (window.matchMedia && window.matchMedia(`(prefers-color-scheme: dark)`).matches ? N(`dark`) : N(`light`)),
          typeof window > `u`)
        )
          return;
        let e = window.matchMedia(`(prefers-color-scheme: dark)`);
        try {
          e.addEventListener(`change`, ({ matches: e }) => {
            N(e ? `dark` : `light`);
          });
        } catch {
          e.addListener(({ matches: e }) => {
            try {
              N(e ? `dark` : `light`);
            } catch (e) {
              console.error(e);
            }
          });
        }
      }, [d]),
      _.useEffect(() => {
        C.length <= 1 && A(!1);
      }, [C]),
      _.useEffect(() => {
        let e = (e) => {
          if (a.every((t) => e[t] || e.code === t)) {
            var t;
            (A(!0), (t = P.current) == null || t.focus());
          }
          e.code === `Escape` &&
            (document.activeElement === P.current || P.current?.contains(document.activeElement)) &&
            A(!1);
        };
        return (document.addEventListener(`keydown`, e), () => document.removeEventListener(`keydown`, e));
      }, [a]),
      _.useEffect(() => {
        if (P.current)
          return () => {
            ne.current && (ne.current.focus({ preventScroll: !0 }), (ne.current = null), (re.current = !1));
          };
      }, [P.current]),
      _.createElement(
        `section`,
        {
          ref: t,
          'aria-label': `${S} ${te}`,
          tabIndex: -1,
          'aria-live': `polite`,
          'aria-relevant': `additions text`,
          'aria-atomic': `false`,
          suppressHydrationWarning: !0,
        },
        E.map((t, n) => {
          let [i, a] = t.split(`-`);
          return T.length
            ? _.createElement(
                `ol`,
                {
                  key: t,
                  dir: v === `auto` ? kr() : v,
                  tabIndex: -1,
                  ref: P,
                  className: c,
                  'data-sonner-toaster': !0,
                  'data-sonner-theme': ee,
                  'data-y-position': i,
                  'data-x-position': a,
                  style: {
                    '--front-toast-height': `${D[0]?.height || 0}px`,
                    '--width': `${Sr}px`,
                    '--gap': `${b}px`,
                    ...m,
                    ...Ar(l, u),
                  },
                  onBlur: (e) => {
                    re.current &&
                      !e.currentTarget.contains(e.relatedTarget) &&
                      ((re.current = !1), (ne.current &&= (ne.current.focus({ preventScroll: !0 }), null)));
                  },
                  onFocus: (e) => {
                    (e.target instanceof HTMLElement && e.target.dataset.dismissible === `false`) ||
                      re.current ||
                      ((re.current = !0), (ne.current = e.relatedTarget));
                  },
                  onMouseEnter: () => A(!0),
                  onMouseMove: () => A(!0),
                  onMouseLeave: () => {
                    j || A(!1);
                  },
                  onDragEnd: () => A(!1),
                  onPointerDown: (e) => {
                    (e.target instanceof HTMLElement && e.target.dataset.dismissible === `false`) || M(!0);
                  },
                  onPointerUp: () => M(!1),
                },
                T.filter((e) => (!e.position && n === 0) || e.position === t).map((n, i) =>
                  _.createElement(Or, {
                    key: n.id,
                    icons: x,
                    index: i,
                    toast: n,
                    defaultRichColors: f,
                    duration: g?.duration ?? p,
                    className: g?.className,
                    descriptionClassName: g?.descriptionClassName,
                    invert: r,
                    visibleToasts: h,
                    closeButton: g?.closeButton ?? s,
                    interacting: j,
                    position: t,
                    style: g?.style,
                    unstyled: g?.unstyled,
                    classNames: g?.classNames,
                    cancelButtonStyle: g?.cancelButtonStyle,
                    actionButtonStyle: g?.actionButtonStyle,
                    closeButtonAriaLabel: g?.closeButtonAriaLabel,
                    removeToast: F,
                    toasts: T.filter((e) => e.position == n.position),
                    heights: D.filter((e) => e.position == n.position),
                    setHeights: O,
                    expandByDefault: o,
                    gap: b,
                    expanded: k,
                    swipeDirections: e.swipeDirections,
                  }),
                ),
              )
            : null;
        }),
      )
    );
  }),
  Mr = new Set(),
  Nr = (e) => (e instanceof Error ? e.message : typeof e == `string` ? e : `Unknown runtime error`),
  Pr = (e, t) => {
    let n = Nr(t),
      r = t instanceof Error ? t.stack : null,
      i = `${n}:${r || ``}`;
    Mr.has(i) ||
      (Mr.add(i),
      Mr.size > 25 && Mr.clear(),
      H.error(`APP`, `${e}: ${n}`, r ? { stack: r } : void 0),
      gr.error(`Something went wrong`, { description: `${e}: ${n}` }));
  },
  Fr = o((e) => {
    var t = d(),
      n = Symbol.for(`react.element`),
      r = Symbol.for(`react.fragment`),
      i = Object.prototype.hasOwnProperty,
      a = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
      o = { key: !0, ref: !0, __self: !0, __source: !0 };
    function s(e, t, r) {
      var s,
        c = {},
        l = null,
        u = null;
      for (s in (r !== void 0 && (l = `` + r),
      t.key !== void 0 && (l = `` + t.key),
      t.ref !== void 0 && (u = t.ref),
      t))
        i.call(t, s) && !o.hasOwnProperty(s) && (c[s] = t[s]);
      if (e && e.defaultProps) for (s in ((t = e.defaultProps), t)) c[s] === void 0 && (c[s] = t[s]);
      return { $$typeof: n, type: e, key: l, ref: u, props: c, _owner: a.current };
    }
    ((e.Fragment = r), (e.jsx = s), (e.jsxs = s));
  }),
  U = o((e, t) => {
    t.exports = Fr();
  })(),
  Ir = (0, _.createContext)(),
  Lr = () => {
    let e = (0, _.useContext)(Ir);
    if (!e) throw Error(`useGameContext must be used within a GameProvider`);
    return e;
  },
  Rr = ({ children: e }) => {
    let [t, n] = (0, _.useState)(() => {
        let e = localStorage.getItem(`playerProfile`);
        return e ? JSON.parse(e) : { name: ``, avatarIcon: `cat`, color: `#2a2a3e` };
      }),
      [r, i] = (0, _.useState)(null),
      [a, o] = (0, _.useState)(null),
      [s, c] = (0, _.useState)(null),
      l = (0, _.useRef)(null);
    ((0, _.useEffect)(() => {
      localStorage.setItem(`playerProfile`, JSON.stringify(t));
    }, [t]),
      (0, _.useEffect)(() => {
        let e = window.location.hostname || `localhost`,
          t = Zn(`${window.location.protocol === `https:` ? `wss:` : `ws:`}//${e}:4000`);
        return (
          (l.current = t),
          c(t),
          t.on(`connect`, () => {
            H.info(`SOCKET`, `Connected with ID: ${t.id}`);
          }),
          t.on(`disconnect`, (e) => {
            H.warn(`SOCKET`, `Disconnected: ${e}`);
          }),
          t.on(`connect_error`, (e) => {
            (H.error(`SOCKET`, `Connection error: ${e.message}`), Pr(`Socket connection error`, e));
          }),
          t.on(`error`, (e) => {
            (H.error(`SOCKET`, `Socket error: ${e?.message || e}`), Pr(`Socket error`, e));
          }),
          H.info(`SOCKET`, `Initializing socket connection...`),
          () => {
            (H.info(`SOCKET`, `Cleaning up socket connection`), t.disconnect());
          }
        );
      }, []));
    let u = (0, _.useRef)(r);
    (0, _.useEffect)(() => {
      u.current = r;
    }, [r]);
    let d = (e) => {
        u.current === e && i(null);
      },
      f = (e) => {
        sessionStorage.removeItem(`${e}_reconnect`);
      },
      p = {
        playerName: t.name,
        setPlayerName: (e) => {
          n((t) => ({ ...t, name: e }));
        },
        profile: t,
        setProfile: n,
        roomId: r,
        setRoomId: i,
        clearRoomId: d,
        socket: s,
        gamePrefix: a,
        setGamePrefix: o,
        leaveRoom: (e, t) => {
          (s?.emit(`${e}_leaveRoom`, t), f(e), d(t));
        },
        clearReconnect: f,
      };
    return (0, U.jsx)(Ir.Provider, { value: p, children: e });
  },
  zr = o((e, t) => {
    ((function (n, r) {
      typeof e == `object` && t !== void 0
        ? (t.exports = r())
        : typeof define == `function` && define.amd
          ? define(r)
          : ((n = typeof globalThis < `u` ? globalThis : n || self), (n.Sweetalert2 = r()));
    })(e, function () {
      function e(e, t, n) {
        if (typeof e == `function` ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
        throw TypeError(`Private element is not present on this object`);
      }
      function t(e, t) {
        if (t.has(e)) throw TypeError(`Cannot initialize the same private elements twice on an object`);
      }
      function n(t, n) {
        return t.get(e(t, n));
      }
      function r(e, n, r) {
        (t(e, n), n.set(e, r));
      }
      function i(t, n, r) {
        return (t.set(e(t, n), r), r);
      }
      let a = {},
        o = () => {
          a.previousActiveElement instanceof HTMLElement
            ? (a.previousActiveElement.focus(), (a.previousActiveElement = null))
            : document.body && document.body.focus();
        },
        s = (e) =>
          new Promise((t) => {
            if (!e) return t();
            let n = window.scrollX,
              r = window.scrollY;
            ((a.restoreFocusTimeout = setTimeout(() => {
              (o(), t());
            }, 100)),
              window.scrollTo(n, r));
          }),
        c = `swal2-`,
        l =
          `container.shown.height-auto.iosfix.popup.modal.no-backdrop.no-transition.toast.toast-shown.show.hide.close.title.html-container.actions.confirm.deny.cancel.footer.icon.icon-content.image.input.file.range.select.radio.checkbox.label.textarea.inputerror.input-label.validation-message.progress-steps.active-progress-step.progress-step.progress-step-line.loader.loading.styled.top.top-start.top-end.top-left.top-right.center.center-start.center-end.center-left.center-right.bottom.bottom-start.bottom-end.bottom-left.bottom-right.grow-row.grow-column.grow-fullscreen.rtl.timer-progress-bar.timer-progress-bar-container.scrollbar-measure.icon-success.icon-warning.icon-info.icon-question.icon-error.draggable.dragging`
            .split(`.`)
            .reduce((e, t) => ((e[t] = c + t), e), {}),
        u = [`success`, `warning`, `info`, `question`, `error`].reduce((e, t) => ((e[t] = c + t), e), {}),
        d = `SweetAlert2:`,
        f = (e) => e.charAt(0).toUpperCase() + e.slice(1),
        p = (e) => {
          console.warn(`${d} ${typeof e == `object` ? e.join(` `) : e}`);
        },
        m = (e) => {
          console.error(`${d} ${e}`);
        },
        h = [],
        g = (e) => {
          h.includes(e) || (h.push(e), p(e));
        },
        _ = (e, t = null) => {
          g(`"${e}" is deprecated and will be removed in the next major release.${t ? ` Use "${t}" instead.` : ``}`);
        },
        v = (e) => (typeof e == `function` ? e() : e),
        y = (e) => e && typeof e.toPromise == `function`,
        b = (e) => (y(e) ? e.toPromise() : Promise.resolve(e)),
        x = (e) => e && Promise.resolve(e) === e,
        S = () => navigator.userAgent.includes(`Firefox`),
        C = () => document.body.querySelector(`.${l.container}`),
        w = (e) => {
          let t = C();
          return t ? t.querySelector(e) : null;
        },
        T = (e) => w(`.${e}`),
        E = () => T(l.popup),
        D = () => T(l.icon),
        O = () => T(l[`icon-content`]),
        k = () => T(l.title),
        A = () => T(l[`html-container`]),
        j = () => T(l.image),
        M = () => T(l[`progress-steps`]),
        ee = () => T(l[`validation-message`]),
        N = () => w(`.${l.actions} .${l.confirm}`),
        P = () => w(`.${l.actions} .${l.cancel}`),
        te = () => w(`.${l.actions} .${l.deny}`),
        ne = () => T(l[`input-label`]),
        re = () => w(`.${l.loader}`),
        F = () => T(l.actions),
        ie = () => T(l.footer),
        ae = () => T(l[`timer-progress-bar`]),
        oe = () => T(l.close),
        se = () => {
          let e = E();
          if (!e) return [];
          let t = e.querySelectorAll(`[tabindex]:not([tabindex="-1"]):not([tabindex="0"])`),
            n = Array.from(t).sort((e, t) => {
              let n = parseInt(e.getAttribute(`tabindex`) || `0`),
                r = parseInt(t.getAttribute(`tabindex`) || `0`);
              return n > r ? 1 : n < r ? -1 : 0;
            }),
            r = e.querySelectorAll(`
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`),
            i = Array.from(r).filter((e) => e.getAttribute(`tabindex`) !== `-1`);
          return [...new Set(n.concat(i))].filter((e) => we(e));
        },
        ce = () =>
          de(document.body, l.shown) && !de(document.body, l[`toast-shown`]) && !de(document.body, l[`no-backdrop`]),
        le = () => {
          let e = E();
          return e ? de(e, l.toast) : !1;
        },
        ue = () => {
          let e = E();
          return e ? e.hasAttribute(`data-loading`) : !1;
        },
        I = (e, t) => {
          if (((e.textContent = ``), t)) {
            let n = new DOMParser().parseFromString(t, `text/html`),
              r = n.querySelector(`head`);
            r &&
              Array.from(r.childNodes).forEach((t) => {
                e.appendChild(t);
              });
            let i = n.querySelector(`body`);
            i &&
              Array.from(i.childNodes).forEach((t) => {
                t instanceof HTMLVideoElement || t instanceof HTMLAudioElement
                  ? e.appendChild(t.cloneNode(!0))
                  : e.appendChild(t);
              });
          }
        },
        de = (e, t) => {
          if (!t) return !1;
          let n = t.split(/\s+/);
          for (let t = 0; t < n.length; t++) if (!e.classList.contains(n[t])) return !1;
          return !0;
        },
        fe = (e, t) => {
          Array.from(e.classList).forEach((n) => {
            !Object.values(l).includes(n) &&
              !Object.values(u).includes(n) &&
              !Object.values(t.showClass || {}).includes(n) &&
              e.classList.remove(n);
          });
        },
        L = (e, t, n) => {
          if ((fe(e, t), !t.customClass)) return;
          let r = t.customClass[n];
          if (r) {
            if (typeof r != `string` && !r.forEach) {
              p(`Invalid type of customClass.${n}! Expected string or iterable object, got "${typeof r}"`);
              return;
            }
            R(e, r);
          }
        },
        pe = (e, t) => {
          if (!t) return null;
          switch (t) {
            case `select`:
            case `textarea`:
            case `file`:
              return e.querySelector(`.${l.popup} > .${l[t]}`);
            case `checkbox`:
              return e.querySelector(`.${l.popup} > .${l.checkbox} input`);
            case `radio`:
              return (
                e.querySelector(`.${l.popup} > .${l.radio} input:checked`) ||
                e.querySelector(`.${l.popup} > .${l.radio} input:first-child`)
              );
            case `range`:
              return e.querySelector(`.${l.popup} > .${l.range} input`);
            default:
              return e.querySelector(`.${l.popup} > .${l.input}`);
          }
        },
        me = (e) => {
          if ((e.focus(), e.type !== `file`)) {
            let t = e.value;
            ((e.value = ``), (e.value = t));
          }
        },
        he = (e, t, n) => {
          if (!e || !t) return;
          let r = typeof t == `string` ? t.split(/\s+/).filter(Boolean) : t;
          (Array.isArray(e) ? e : [e]).forEach((e) => {
            r.forEach((t) => {
              n ? e.classList.add(t) : e.classList.remove(t);
            });
          });
        },
        R = (e, t) => {
          he(e, t, !0);
        },
        ge = (e, t) => {
          he(e, t, !1);
        },
        _e = (e, t) => {
          let n = Array.from(e.children);
          for (let e = 0; e < n.length; e++) {
            let r = n[e];
            if (r instanceof HTMLElement && de(r, t)) return r;
          }
        },
        ve = (e, t, n) => {
          (n === `${parseInt(`${n}`)}` && (n = parseInt(n)),
            n || n === 0 ? e.style.setProperty(t, typeof n == `number` ? `${n}px` : n) : e.style.removeProperty(t));
        },
        ye = (e, t = `flex`) => {
          e && (e.style.display = t);
        },
        be = (e) => {
          e && (e.style.display = `none`);
        },
        xe = (e, t = `block`) => {
          e &&
            new MutationObserver(() => {
              Ce(e, e.innerHTML, t);
            }).observe(e, { childList: !0, subtree: !0 });
        },
        Se = (e, t, n, r) => {
          let i = e.querySelector(t);
          i && i.style.setProperty(n, r);
        },
        Ce = (e, t, n = `flex`) => {
          t ? ye(e, n) : be(e);
        },
        we = (e) => !!(e && (e.offsetWidth || e.offsetHeight || e.getClientRects().length)),
        Te = () => !we(N()) && !we(te()) && !we(P()),
        Ee = (e) => e.scrollHeight > e.clientHeight,
        De = (e, t) => {
          let n = e;
          for (; n && n !== t; ) {
            if (Ee(n)) return !0;
            n = n.parentElement;
          }
          return !1;
        },
        Oe = (e) => {
          let t = window.getComputedStyle(e),
            n = parseFloat(t.getPropertyValue(`animation-duration`) || `0`),
            r = parseFloat(t.getPropertyValue(`transition-duration`) || `0`);
          return n > 0 || r > 0;
        },
        ke = (e, t = !1) => {
          let n = ae();
          n &&
            we(n) &&
            (t && ((n.style.transition = `none`), (n.style.width = `100%`)),
            setTimeout(() => {
              ((n.style.transition = `width ${e / 1e3}s linear`), (n.style.width = `0%`));
            }, 10));
        },
        Ae = () => {
          let e = ae();
          if (!e) return;
          let t = parseInt(window.getComputedStyle(e).width);
          (e.style.removeProperty(`transition`), (e.style.width = `100%`));
          let n = (t / parseInt(window.getComputedStyle(e).width)) * 100;
          e.style.width = `${n}%`;
        },
        je = () => typeof window > `u` || typeof document > `u`,
        Me = `
 <div aria-labelledby="${l.title}" aria-describedby="${l[`html-container`]}" class="${l.popup}" tabindex="-1">
   <button type="button" class="${l.close}"></button>
   <ul class="${l[`progress-steps`]}"></ul>
   <div class="${l.icon}"></div>
   <img class="${l.image}" />
   <h2 class="${l.title}" id="${l.title}"></h2>
   <div class="${l[`html-container`]}" id="${l[`html-container`]}"></div>
   <input class="${l.input}" id="${l.input}" />
   <input type="file" class="${l.file}" />
   <div class="${l.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${l.select}" id="${l.select}"></select>
   <div class="${l.radio}"></div>
   <label class="${l.checkbox}">
     <input type="checkbox" id="${l.checkbox}" />
     <span class="${l.label}"></span>
   </label>
   <textarea class="${l.textarea}" id="${l.textarea}"></textarea>
   <div class="${l[`validation-message`]}" id="${l[`validation-message`]}"></div>
   <div class="${l.actions}">
     <div class="${l.loader}"></div>
     <button type="button" class="${l.confirm}"></button>
     <button type="button" class="${l.deny}"></button>
     <button type="button" class="${l.cancel}"></button>
   </div>
   <div class="${l.footer}"></div>
   <div class="${l[`timer-progress-bar-container`]}">
     <div class="${l[`timer-progress-bar`]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, ``),
        Ne = () => {
          let e = C();
          return e
            ? (e.remove(),
              ge([document.documentElement, document.body], [l[`no-backdrop`], l[`toast-shown`], l[`has-column`]]),
              !0)
            : !1;
        },
        Pe = () => {
          a.currentInstance && a.currentInstance.resetValidationMessage();
        },
        Fe = () => {
          let e = E();
          if (!e) return;
          let t = _e(e, l.input),
            n = _e(e, l.file),
            r = e.querySelector(`.${l.range} input`),
            i = e.querySelector(`.${l.range} output`),
            a = _e(e, l.select),
            o = e.querySelector(`.${l.checkbox} input`),
            s = _e(e, l.textarea);
          (t && (t.oninput = Pe),
            n && (n.onchange = Pe),
            a && (a.onchange = Pe),
            o && (o.onchange = Pe),
            s && (s.oninput = Pe),
            r &&
              i &&
              ((r.oninput = () => {
                (Pe(), (i.value = r.value));
              }),
              (r.onchange = () => {
                (Pe(), (i.value = r.value));
              })));
        },
        Ie = (e) => {
          if (typeof e == `string`) {
            let t = document.querySelector(e);
            if (!t) throw Error(`Target element "${e}" not found`);
            return t;
          }
          return e;
        },
        Le = (e) => {
          let t = E();
          t &&
            (t.setAttribute(`role`, e.toast ? `alert` : `dialog`),
            t.setAttribute(`aria-live`, e.toast ? `polite` : `assertive`),
            e.toast || t.setAttribute(`aria-modal`, `true`));
        },
        Re = (e) => {
          window.getComputedStyle(e).direction === `rtl` && (R(C(), l.rtl), (a.isRTL = !0));
        },
        ze = (e) => {
          let t = Ne();
          if (je()) {
            m(`SweetAlert2 requires document to initialize`);
            return;
          }
          let n = document.createElement(`div`);
          ((n.className = l.container), t && R(n, l[`no-transition`]), I(n, Me), (n.dataset.swal2Theme = e.theme));
          let r = Ie(e.target || `body`);
          (r.appendChild(n), e.topLayer && (n.setAttribute(`popover`, ``), n.showPopover()), Le(e), Re(r), Fe());
        },
        Be = (e, t) => {
          e instanceof HTMLElement ? t.appendChild(e) : typeof e == `object` ? Ve(e, t) : e && I(t, e);
        },
        Ve = (e, t) => {
          `jquery` in e ? He(t, e) : I(t, e.toString());
        },
        He = (e, t) => {
          if (((e.textContent = ``), 0 in t)) for (let n = 0; n in t; n++) e.appendChild(t[n].cloneNode(!0));
          else e.appendChild(t.cloneNode(!0));
        },
        Ue = (e, t) => {
          let n = F(),
            r = re();
          !n ||
            !r ||
            (!t.showConfirmButton && !t.showDenyButton && !t.showCancelButton ? be(n) : ye(n),
            L(n, t, `actions`),
            We(n, r, t),
            I(r, t.loaderHtml || ``),
            L(r, t, `loader`));
        };
      function We(e, t, n) {
        let r = N(),
          i = te(),
          a = P();
        !r ||
          !i ||
          !a ||
          (qe(r, `confirm`, n),
          qe(i, `deny`, n),
          qe(a, `cancel`, n),
          Ge(r, i, a, n),
          n.reverseButtons &&
            (n.toast
              ? (e.insertBefore(a, r), e.insertBefore(i, r))
              : (e.insertBefore(a, t), e.insertBefore(i, t), e.insertBefore(r, t))));
      }
      function Ge(e, t, n, r) {
        if (!r.buttonsStyling) {
          ge([e, t, n], l.styled);
          return;
        }
        (R([e, t, n], l.styled),
          [
            [e, `confirm`, r.confirmButtonColor],
            [t, `deny`, r.denyButtonColor],
            [n, `cancel`, r.cancelButtonColor],
          ].forEach(([e, t, n]) => {
            (n && e.style.setProperty(`--swal2-${t}-button-background-color`, n), Ke(e));
          }));
      }
      function Ke(e) {
        let t = window.getComputedStyle(e);
        if (t.getPropertyValue(`--swal2-action-button-focus-box-shadow`)) return;
        let n = t.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, `rgba($1, $2, $3, 0.5)`);
        e.style.setProperty(
          `--swal2-action-button-focus-box-shadow`,
          t.getPropertyValue(`--swal2-outline`).replace(/ rgba\(.*/, ` ${n}`),
        );
      }
      function qe(e, t, n) {
        (Ce(e, n[`show${f(t)}Button`], `inline-block`),
          I(e, n[`${t}ButtonText`] || ``),
          e.setAttribute(`aria-label`, n[`${t}ButtonAriaLabel`] || ``),
          (e.className = l[t]),
          L(e, n, `${t}Button`));
      }
      let Je = (e, t) => {
          let n = oe();
          n &&
            (I(n, t.closeButtonHtml || ``),
            L(n, t, `closeButton`),
            Ce(n, t.showCloseButton),
            n.setAttribute(`aria-label`, t.closeButtonAriaLabel || ``));
        },
        Ye = (e, t) => {
          let n = C();
          n && (Xe(n, t.backdrop), Ze(n, t.position), Qe(n, t.grow), L(n, t, `container`));
        };
      function Xe(e, t) {
        typeof t == `string`
          ? (e.style.background = t)
          : t || R([document.documentElement, document.body], l[`no-backdrop`]);
      }
      function Ze(e, t) {
        t &&
          (t in l ? R(e, l[t]) : (p(`The "position" parameter is not valid, defaulting to "center"`), R(e, l.center)));
      }
      function Qe(e, t) {
        t && R(e, l[`grow-${t}`]);
      }
      var z = { innerParams: new WeakMap(), domCache: new WeakMap(), focusedElement: new WeakMap() };
      let $e = [`input`, `file`, `range`, `select`, `radio`, `checkbox`, `textarea`],
        et = (e, t) => {
          let n = E();
          if (!n) return;
          let r = z.innerParams.get(e),
            i = !r || t.input !== r.input;
          ($e.forEach((e) => {
            let r = _e(n, l[e]);
            r && (rt(e, t.inputAttributes), (r.className = l[e]), i && be(r));
          }),
            t.input && (i && tt(t), it(t)));
        },
        tt = (e) => {
          if (!e.input) return;
          if (!lt[e.input]) {
            m(`Unexpected type of input! Expected ${Object.keys(lt).join(` | `)}, got "${e.input}"`);
            return;
          }
          let t = st(e.input);
          if (!t) return;
          let n = lt[e.input](t, e);
          (ye(t),
            e.inputAutoFocus &&
              setTimeout(() => {
                me(n);
              }));
        },
        nt = (e) => {
          for (let t = 0; t < e.attributes.length; t++) {
            let n = e.attributes[t].name;
            [`id`, `type`, `value`, `style`].includes(n) || e.removeAttribute(n);
          }
        },
        rt = (e, t) => {
          let n = E();
          if (!n) return;
          let r = pe(n, e);
          if (r) {
            nt(r);
            for (let e in t) r.setAttribute(e, t[e]);
          }
        },
        it = (e) => {
          if (!e.input) return;
          let t = st(e.input);
          t && L(t, e, `input`);
        },
        at = (e, t) => {
          !e.placeholder && t.inputPlaceholder && (e.placeholder = t.inputPlaceholder);
        },
        ot = (e, t, n) => {
          if (n.inputLabel) {
            let r = document.createElement(`label`),
              i = l[`input-label`];
            (r.setAttribute(`for`, e.id),
              (r.className = i),
              typeof n.customClass == `object` && R(r, n.customClass.inputLabel),
              (r.innerText = n.inputLabel),
              t.insertAdjacentElement(`beforebegin`, r));
          }
        },
        st = (e) => {
          let t = E();
          if (t) return _e(t, l[e] || l.input);
        },
        ct = (e, t) => {
          [`string`, `number`].includes(typeof t)
            ? (e.value = `${t}`)
            : x(t) || p(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof t}"`);
        },
        lt = {};
      ((lt.text =
        lt.email =
        lt.password =
        lt.number =
        lt.tel =
        lt.url =
        lt.search =
        lt.date =
        lt[`datetime-local`] =
        lt.time =
        lt.week =
        lt.month =
          (e, t) => {
            let n = e;
            return (ct(n, t.inputValue), ot(n, n, t), at(n, t), (n.type = t.input), n);
          }),
        (lt.file = (e, t) => {
          let n = e;
          return (ot(n, n, t), at(n, t), n);
        }),
        (lt.range = (e, t) => {
          let n = e,
            r = n.querySelector(`input`),
            i = n.querySelector(`output`);
          return (r && (ct(r, t.inputValue), (r.type = t.input), ot(r, e, t)), i && ct(i, t.inputValue), e);
        }),
        (lt.select = (e, t) => {
          let n = e;
          if (((n.textContent = ``), t.inputPlaceholder)) {
            let e = document.createElement(`option`);
            (I(e, t.inputPlaceholder), (e.value = ``), (e.disabled = !0), (e.selected = !0), n.appendChild(e));
          }
          return (ot(n, n, t), n);
        }),
        (lt.radio = (e) => {
          let t = e;
          return ((t.textContent = ``), e);
        }),
        (lt.checkbox = (e, t) => {
          let n = E();
          if (!n) throw Error(`Popup not found`);
          let r = pe(n, `checkbox`);
          if (!r) throw Error(`Checkbox input not found`);
          ((r.value = `1`), (r.checked = !!t.inputValue));
          let i = e.querySelector(`span`);
          if (i) {
            let e = t.inputPlaceholder || t.inputLabel;
            e && I(i, e);
          }
          return r;
        }),
        (lt.textarea = (e, t) => {
          let n = e;
          (ct(n, t.inputValue), at(n, t), ot(n, n, t));
          let r = (e) =>
            parseInt(window.getComputedStyle(e).marginLeft) + parseInt(window.getComputedStyle(e).marginRight);
          return (
            setTimeout(() => {
              if (`MutationObserver` in window) {
                let e = E();
                if (!e) return;
                let i = parseInt(window.getComputedStyle(e).width);
                new MutationObserver(() => {
                  if (!document.body.contains(n)) return;
                  let e = n.offsetWidth + r(n),
                    a = E();
                  a && (e > i ? (a.style.width = `${e}px`) : ve(a, `width`, t.width));
                }).observe(n, { attributes: !0, attributeFilter: [`style`] });
              }
            }),
            n
          );
        }));
      let ut = (e, t) => {
          let n = A();
          n &&
            (xe(n),
            L(n, t, `htmlContainer`),
            t.html ? (Be(t.html, n), ye(n, `block`)) : t.text ? ((n.textContent = t.text), ye(n, `block`)) : be(n),
            et(e, t));
        },
        dt = (e, t) => {
          let n = ie();
          n && (xe(n), Ce(n, !!t.footer, `block`), t.footer && Be(t.footer, n), L(n, t, `footer`));
        },
        ft = (e, t) => {
          let n = z.innerParams.get(e),
            r = D();
          if (r) {
            if (n && t.icon === n.icon) {
              (gt(r, t), pt(r, t));
              return;
            }
            if (!t.icon && !t.iconHtml) {
              be(r);
              return;
            }
            if (t.icon && Object.keys(u).indexOf(t.icon) === -1) {
              (m(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${t.icon}"`), be(r));
              return;
            }
            (ye(r),
              gt(r, t),
              pt(r, t),
              R(r, t.showClass && t.showClass.icon),
              window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`, mt));
          }
        },
        pt = (e, t) => {
          for (let [n, r] of Object.entries(u)) t.icon !== n && ge(e, r);
          (R(e, t.icon && u[t.icon]), _t(e, t), mt(), L(e, t, `icon`));
        },
        mt = () => {
          let e = E();
          if (!e) return;
          let t = window.getComputedStyle(e).getPropertyValue(`background-color`),
            n = e.querySelectorAll(`[class^=swal2-success-circular-line], .swal2-success-fix`);
          for (let e = 0; e < n.length; e++) n[e].style.backgroundColor = t;
        },
        ht = (e) => `
  ${e.animation ? `<div class="swal2-success-circular-line-left"></div>` : ``}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${e.animation ? `<div class="swal2-success-fix"></div>` : ``}
  ${e.animation ? `<div class="swal2-success-circular-line-right"></div>` : ``}
`,
        gt = (e, t) => {
          if (!t.icon && !t.iconHtml) return;
          let n = e.innerHTML,
            r = ``;
          (t.iconHtml
            ? (r = vt(t.iconHtml))
            : t.icon === `success`
              ? ((r = ht(t)), (n = n.replace(/ style=".*?"/g, ``)))
              : t.icon === `error`
                ? (r = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`)
                : t.icon && (r = vt({ question: `?`, warning: `!`, info: `i` }[t.icon])),
            n.trim() !== r.trim() && I(e, r));
        },
        _t = (e, t) => {
          if (t.iconColor) {
            ((e.style.color = t.iconColor), (e.style.borderColor = t.iconColor));
            for (let n of [
              `.swal2-success-line-tip`,
              `.swal2-success-line-long`,
              `.swal2-x-mark-line-left`,
              `.swal2-x-mark-line-right`,
            ])
              Se(e, n, `background-color`, t.iconColor);
            Se(e, `.swal2-success-ring`, `border-color`, t.iconColor);
          }
        },
        vt = (e) => `<div class="${l[`icon-content`]}">${e}</div>`,
        yt = (e, t) => {
          let n = j();
          if (n) {
            if (!t.imageUrl) {
              be(n);
              return;
            }
            (ye(n, ``),
              n.setAttribute(`src`, t.imageUrl),
              n.setAttribute(`alt`, t.imageAlt || ``),
              ve(n, `width`, t.imageWidth),
              ve(n, `height`, t.imageHeight),
              (n.className = l.image),
              L(n, t, `image`));
          }
        },
        bt = !1,
        xt = 0,
        St = 0,
        Ct = 0,
        wt = 0,
        Tt = (e) => {
          (e.addEventListener(`mousedown`, Dt),
            document.body.addEventListener(`mousemove`, Ot),
            e.addEventListener(`mouseup`, kt),
            e.addEventListener(`touchstart`, Dt),
            document.body.addEventListener(`touchmove`, Ot),
            e.addEventListener(`touchend`, kt));
        },
        Et = (e) => {
          (e.removeEventListener(`mousedown`, Dt),
            document.body.removeEventListener(`mousemove`, Ot),
            e.removeEventListener(`mouseup`, kt),
            e.removeEventListener(`touchstart`, Dt),
            document.body.removeEventListener(`touchmove`, Ot),
            e.removeEventListener(`touchend`, kt));
        },
        Dt = (e) => {
          let t = E();
          if (!t) return;
          let n = D();
          if (e.target === t || (n && n.contains(e.target))) {
            bt = !0;
            let n = At(e);
            ((xt = n.clientX),
              (St = n.clientY),
              (Ct = parseInt(t.style.insetInlineStart) || 0),
              (wt = parseInt(t.style.insetBlockStart) || 0),
              R(t, `swal2-dragging`));
          }
        },
        Ot = (e) => {
          let t = E();
          if (t && bt) {
            let { clientX: n, clientY: r } = At(e),
              i = n - xt;
            ((t.style.insetInlineStart = `${Ct + (a.isRTL ? -i : i)}px`),
              (t.style.insetBlockStart = `${wt + (r - St)}px`));
          }
        },
        kt = () => {
          let e = E();
          ((bt = !1), ge(e, `swal2-dragging`));
        },
        At = (e) => {
          let t = e.type.startsWith(`touch`) ? e.touches[0] : e;
          return { clientX: t.clientX, clientY: t.clientY };
        },
        jt = (e, t) => {
          let n = C(),
            r = E();
          if (!(!n || !r)) {
            if (t.toast) {
              (ve(n, `width`, t.width), (r.style.width = `100%`));
              let e = re();
              e && r.insertBefore(e, D());
            } else ve(r, `width`, t.width);
            (ve(r, `padding`, t.padding),
              t.color && (r.style.color = t.color),
              t.background && (r.style.background = t.background),
              be(ee()),
              Mt(r, t),
              t.draggable && !t.toast ? (R(r, l.draggable), Tt(r)) : (ge(r, l.draggable), Et(r)));
          }
        },
        Mt = (e, t) => {
          let n = t.showClass || {};
          ((e.className = `${l.popup} ${we(e) ? n.popup : ``}`),
            t.toast ? (R([document.documentElement, document.body], l[`toast-shown`]), R(e, l.toast)) : R(e, l.modal),
            L(e, t, `popup`),
            typeof t.customClass == `string` && R(e, t.customClass),
            t.icon && R(e, l[`icon-${t.icon}`]));
        },
        Nt = (e, t) => {
          let n = M();
          if (!n) return;
          let { progressSteps: r, currentProgressStep: i } = t;
          if (!r || r.length === 0 || i === void 0) {
            be(n);
            return;
          }
          (ye(n),
            (n.textContent = ``),
            i >= r.length &&
              p(
                `Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)`,
              ),
            r.forEach((e, a) => {
              let o = Pt(e);
              if ((n.appendChild(o), a === i && R(o, l[`active-progress-step`]), a !== r.length - 1)) {
                let e = Ft(t);
                n.appendChild(e);
              }
            }));
        },
        Pt = (e) => {
          let t = document.createElement(`li`);
          return (R(t, l[`progress-step`]), I(t, e), t);
        },
        Ft = (e) => {
          let t = document.createElement(`li`);
          return (R(t, l[`progress-step-line`]), e.progressStepsDistance && ve(t, `width`, e.progressStepsDistance), t);
        },
        It = (e, t) => {
          let n = k();
          n &&
            (xe(n),
            Ce(n, !!(t.title || t.titleText), `block`),
            t.title && Be(t.title, n),
            t.titleText && (n.innerText = t.titleText),
            L(n, t, `title`));
        },
        Lt = (e, t) => {
          var n;
          (jt(e, t), Ye(e, t), Nt(e, t), ft(e, t), yt(e, t), It(e, t), Je(e, t), ut(e, t), Ue(e, t), dt(e, t));
          let r = E();
          (typeof t.didRender == `function` && r && t.didRender(r),
            (n = a.eventEmitter) == null || n.emit(`didRender`, r));
        },
        Rt = () => we(E()),
        zt = () => N()?.click(),
        Bt = () => te()?.click(),
        Vt = () => P()?.click(),
        B = Object.freeze({ cancel: `cancel`, backdrop: `backdrop`, close: `close`, esc: `esc`, timer: `timer` }),
        Ht = (e) => {
          if (e.keydownTarget && e.keydownHandlerAdded && e.keydownHandler) {
            let t = e.keydownHandler;
            (e.keydownTarget.removeEventListener(`keydown`, t, { capture: e.keydownListenerCapture }),
              (e.keydownHandlerAdded = !1));
          }
        },
        Ut = (e, t, n) => {
          if ((Ht(e), !t.toast)) {
            let r = (e) => qt(t, e, n);
            e.keydownHandler = r;
            let i = t.keydownListenerCapture ? window : E();
            if (i) {
              ((e.keydownTarget = i), (e.keydownListenerCapture = t.keydownListenerCapture));
              let n = r;
              (e.keydownTarget.addEventListener(`keydown`, n, { capture: e.keydownListenerCapture }),
                (e.keydownHandlerAdded = !0));
            }
          }
        },
        Wt = (e, t) => {
          var n;
          let r = se();
          return r.length
            ? ((e += t),
              e === -2 && (e = r.length - 1),
              e === r.length ? (e = 0) : e === -1 && (e = r.length - 1),
              r[e].focus(),
              !(S() && r[e] instanceof HTMLIFrameElement))
            : ((n = E()) == null || n.focus(), !0);
        },
        Gt = [`ArrowRight`, `ArrowDown`],
        Kt = [`ArrowLeft`, `ArrowUp`],
        qt = (e, t, n) => {
          e &&
            (t.isComposing ||
              t.keyCode === 229 ||
              (e.stopKeydownPropagation && t.stopPropagation(),
              t.key === `Enter`
                ? Jt(t, e)
                : t.key === `Tab`
                  ? Yt(t)
                  : [...Gt, ...Kt].includes(t.key)
                    ? Xt(t.key)
                    : t.key === `Escape` && Zt(t, e, n)));
        },
        Jt = (e, t) => {
          if (!v(t.allowEnterKey)) return;
          let n = E();
          if (!n || !t.input) return;
          let r = pe(n, t.input);
          if (e.target && r && e.target instanceof HTMLElement && e.target.outerHTML === r.outerHTML) {
            if ([`textarea`, `file`].includes(t.input)) return;
            (zt(), e.preventDefault());
          }
        },
        Yt = (e) => {
          let t = e.target,
            n = se(),
            r = -1;
          for (let e = 0; e < n.length; e++)
            if (t === n[e]) {
              r = e;
              break;
            }
          let i = !0;
          ((i = e.shiftKey ? Wt(r, -1) : Wt(r, 1)), e.stopPropagation(), i && e.preventDefault());
        },
        Xt = (e) => {
          let t = F(),
            n = N(),
            r = te(),
            i = P();
          if (!t || !n || !r || !i) return;
          let a = [n, r, i];
          if (document.activeElement instanceof HTMLElement && !a.includes(document.activeElement)) return;
          let o = Gt.includes(e) ? `nextElementSibling` : `previousElementSibling`,
            s = document.activeElement;
          if (s) {
            for (let e = 0; e < t.children.length; e++) {
              if (((s = s[o]), !s)) return;
              if (s instanceof HTMLButtonElement && we(s)) break;
            }
            s instanceof HTMLButtonElement && s.focus();
          }
        },
        Zt = (e, t, n) => {
          (e.preventDefault(), v(t.allowEscapeKey) && n(B.esc));
        };
      var Qt = { swalPromiseResolve: new WeakMap(), swalPromiseReject: new WeakMap() };
      let $t = () => {
          let e = C();
          Array.from(document.body.children).forEach((t) => {
            t.contains(e) ||
              (t.hasAttribute(`aria-hidden`) &&
                t.setAttribute(`data-previous-aria-hidden`, t.getAttribute(`aria-hidden`) || ``),
              t.setAttribute(`aria-hidden`, `true`));
          });
        },
        en = () => {
          Array.from(document.body.children).forEach((e) => {
            e.hasAttribute(`data-previous-aria-hidden`)
              ? (e.setAttribute(`aria-hidden`, e.getAttribute(`data-previous-aria-hidden`) || ``),
                e.removeAttribute(`data-previous-aria-hidden`))
              : e.removeAttribute(`aria-hidden`);
          });
        },
        tn = typeof window < `u` && !!window.GestureEvent,
        nn = tn && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        rn = () => {
          if (tn && !de(document.body, l.iosfix)) {
            let e = document.body.scrollTop;
            ((document.body.style.top = `${e * -1}px`), R(document.body, l.iosfix), an());
          }
        },
        an = () => {
          let e = C();
          if (!e) return;
          let t;
          ((e.ontouchstart = (e) => {
            t = on(e);
          }),
            (e.ontouchmove = (e) => {
              t && (e.preventDefault(), e.stopPropagation());
            }));
        },
        on = (e) => {
          let t = e.target,
            n = C(),
            r = A();
          return !n || !r || sn(e) || cn(e)
            ? !1
            : t === n ||
                (!Ee(n) &&
                  t instanceof HTMLElement &&
                  !De(t, r) &&
                  t.tagName !== `INPUT` &&
                  t.tagName !== `TEXTAREA` &&
                  !(Ee(r) && r.contains(t)));
        },
        sn = (e) => !!(e.touches && e.touches.length && e.touches[0].touchType === `stylus`),
        cn = (e) => e.touches && e.touches.length > 1,
        ln = () => {
          if (de(document.body, l.iosfix)) {
            let e = parseInt(document.body.style.top, 10);
            (ge(document.body, l.iosfix), (document.body.style.top = ``), (document.body.scrollTop = e * -1));
          }
        },
        un = () => {
          let e = document.createElement(`div`);
          ((e.className = l[`scrollbar-measure`]), document.body.appendChild(e));
          let t = e.getBoundingClientRect().width - e.clientWidth;
          return (document.body.removeChild(e), t);
        },
        dn = null,
        fn = (e) => {
          dn === null &&
            (document.body.scrollHeight > window.innerHeight || e === `scroll`) &&
            ((dn = parseInt(window.getComputedStyle(document.body).getPropertyValue(`padding-right`))),
            (document.body.style.paddingRight = `${dn + un()}px`));
        },
        pn = () => {
          dn !== null && ((document.body.style.paddingRight = `${dn}px`), (dn = null));
        };
      function mn(e, t, n, r) {
        (le() ? Cn(e, r) : (s(n).then(() => Cn(e, r)), Ht(a)),
          tn
            ? (t.setAttribute(`style`, `display:none !important`), t.removeAttribute(`class`), (t.innerHTML = ``))
            : t.remove(),
          ce() && (pn(), ln(), en()),
          hn());
      }
      function hn() {
        ge([document.documentElement, document.body], [l.shown, l[`height-auto`], l[`no-backdrop`], l[`toast-shown`]]);
      }
      function gn(e) {
        e = bn(e);
        let t = Qt.swalPromiseResolve.get(this),
          n = _n(this);
        this.isAwaitingPromise ? e.isDismissed || (yn(this), t(e)) : n && t(e);
      }
      let _n = (e) => {
        let t = E();
        if (!t) return !1;
        let n = z.innerParams.get(e);
        if (!n || de(t, n.hideClass.popup)) return !1;
        (ge(t, n.showClass.popup), R(t, n.hideClass.popup));
        let r = C();
        return (ge(r, n.showClass.backdrop), R(r, n.hideClass.backdrop), xn(e, t, n), !0);
      };
      function vn(e) {
        let t = Qt.swalPromiseReject.get(this);
        (yn(this), t && t(e));
      }
      let yn = (e) => {
          e.isAwaitingPromise && (delete e.isAwaitingPromise, z.innerParams.get(e) || e._destroy());
        },
        bn = (e) =>
          e === void 0
            ? { isConfirmed: !1, isDenied: !1, isDismissed: !0 }
            : Object.assign({ isConfirmed: !1, isDenied: !1, isDismissed: !1 }, e),
        xn = (e, t, n) => {
          var r;
          let i = C(),
            o = Oe(t);
          (typeof n.willClose == `function` && n.willClose(t),
            (r = a.eventEmitter) == null || r.emit(`willClose`, t),
            o && i ? Sn(e, t, i, !!n.returnFocus, n.didClose) : i && mn(e, i, !!n.returnFocus, n.didClose));
        },
        Sn = (e, t, n, r, i) => {
          a.swalCloseEventFinishedCallback = mn.bind(null, e, n, r, i);
          let o = function (e) {
            if (e.target === t) {
              var n;
              ((n = a.swalCloseEventFinishedCallback) == null || n.call(a),
                delete a.swalCloseEventFinishedCallback,
                t.removeEventListener(`animationend`, o),
                t.removeEventListener(`transitionend`, o));
            }
          };
          (t.addEventListener(`animationend`, o), t.addEventListener(`transitionend`, o));
        },
        Cn = (e, t) => {
          setTimeout(() => {
            var n;
            (typeof t == `function` && t.bind(e.params)(),
              (n = a.eventEmitter) == null || n.emit(`didClose`),
              e._destroy && e._destroy());
          });
        },
        wn = (e) => {
          let t = E();
          if ((t || new _i(), (t = E()), !t)) return;
          let n = re();
          (le() ? be(D()) : Tn(t, e),
            ye(n),
            t.setAttribute(`data-loading`, `true`),
            t.setAttribute(`aria-busy`, `true`),
            t.focus());
        },
        Tn = (e, t) => {
          let n = F(),
            r = re();
          !n ||
            !r ||
            (!t && we(N()) && (t = N()),
            ye(n),
            t && (be(t), r.setAttribute(`data-button-to-replace`, t.className), n.insertBefore(r, t)),
            R([e, n], l.loading));
        },
        En = (e, t) => {
          t.input === `select` || t.input === `radio`
            ? jn(e, t)
            : [`text`, `email`, `number`, `tel`, `textarea`].some((e) => e === t.input) &&
              (y(t.inputValue) || x(t.inputValue)) &&
              (wn(N()), Mn(e, t));
        },
        Dn = (e, t) => {
          let n = e.getInput();
          if (!n) return null;
          switch (t.input) {
            case `checkbox`:
              return On(n);
            case `radio`:
              return kn(n);
            case `file`:
              return An(n);
            default:
              return t.inputAutoTrim ? n.value.trim() : n.value;
          }
        },
        On = (e) => +!!e.checked,
        kn = (e) => (e.checked ? e.value : null),
        An = (e) => (e.files && e.files.length ? (e.getAttribute(`multiple`) === null ? e.files[0] : e.files) : null),
        jn = (e, t) => {
          let n = E();
          if (!n) return;
          let r = (e) => {
            t.input === `select` ? Nn(n, Fn(e), t) : t.input === `radio` && Pn(n, Fn(e), t);
          };
          y(t.inputOptions) || x(t.inputOptions)
            ? (wn(N()),
              b(t.inputOptions).then((t) => {
                (e.hideLoading(), r(t));
              }))
            : typeof t.inputOptions == `object`
              ? r(t.inputOptions)
              : m(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof t.inputOptions}`);
        },
        Mn = (e, t) => {
          let n = e.getInput();
          n &&
            (be(n),
            b(t.inputValue)
              .then((r) => {
                ((n.value = t.input === `number` ? `${parseFloat(r) || 0}` : `${r}`),
                  ye(n),
                  n.focus(),
                  e.hideLoading());
              })
              .catch((t) => {
                (m(`Error in inputValue promise: ${t}`), (n.value = ``), ye(n), n.focus(), e.hideLoading());
              }));
        };
      function Nn(e, t, n) {
        let r = _e(e, l.select);
        if (!r) return;
        let i = (e, t, r) => {
          let i = document.createElement(`option`);
          ((i.value = r), I(i, t), (i.selected = In(r, n.inputValue)), e.appendChild(i));
        };
        (t.forEach((e) => {
          let t = e[0],
            n = e[1];
          if (Array.isArray(n)) {
            let e = document.createElement(`optgroup`);
            ((e.label = t), (e.disabled = !1), r.appendChild(e), n.forEach((t) => i(e, t[1], t[0])));
          } else i(r, n, t);
        }),
          r.focus());
      }
      function Pn(e, t, n) {
        let r = _e(e, l.radio);
        if (!r) return;
        t.forEach((e) => {
          let t = e[0],
            i = e[1],
            a = document.createElement(`input`),
            o = document.createElement(`label`);
          ((a.type = `radio`), (a.name = l.radio), (a.value = t), In(t, n.inputValue) && (a.checked = !0));
          let s = document.createElement(`span`);
          (I(s, i), (s.className = l.label), o.appendChild(a), o.appendChild(s), r.appendChild(o));
        });
        let i = r.querySelectorAll(`input`);
        i.length && i[0].focus();
      }
      let Fn = (e) =>
          (e instanceof Map ? Array.from(e) : Object.entries(e)).map(([e, t]) => [e, typeof t == `object` ? Fn(t) : t]),
        In = (e, t) => !!t && t != null && t.toString() === e.toString(),
        Ln = (e) => {
          let t = z.innerParams.get(e);
          (e.disableButtons(), t.input ? Bn(e, `confirm`) : Wn(e, !0));
        },
        Rn = (e) => {
          let t = z.innerParams.get(e);
          (e.disableButtons(), t.returnInputValueOnDeny ? Bn(e, `deny`) : Vn(e, !1));
        },
        zn = (e, t) => {
          (e.disableButtons(), t(B.cancel));
        },
        Bn = (e, t) => {
          let n = z.innerParams.get(e);
          if (!n.input) {
            m(`The "input" parameter is needed to be set when using returnInputValueOn${f(t)}`);
            return;
          }
          let r = e.getInput(),
            i = Dn(e, n);
          n.inputValidator
            ? V(e, i, t)
            : r && !r.checkValidity()
              ? (e.enableButtons(), e.showValidationMessage(n.validationMessage || r.validationMessage))
              : t === `deny`
                ? Vn(e, i)
                : Wn(e, i);
        },
        V = (e, t, n) => {
          let r = z.innerParams.get(e);
          (e.disableInput(),
            Promise.resolve()
              .then(() => b(r.inputValidator(t, r.validationMessage)))
              .then((r) => {
                (e.enableButtons(),
                  e.enableInput(),
                  r ? e.showValidationMessage(r) : n === `deny` ? Vn(e, t) : Wn(e, t));
              }));
        },
        Vn = (e, t) => {
          let n = z.innerParams.get(e);
          (n.showLoaderOnDeny && wn(te()),
            n.preDeny
              ? ((e.isAwaitingPromise = !0),
                Promise.resolve()
                  .then(() => b(n.preDeny(t, n.validationMessage)))
                  .then((n) => {
                    n === !1 ? (e.hideLoading(), yn(e)) : e.close({ isDenied: !0, value: n === void 0 ? t : n });
                  })
                  .catch((t) => Un(e, t)))
              : e.close({ isDenied: !0, value: t }));
        },
        Hn = (e, t) => {
          e.close({ isConfirmed: !0, value: t });
        },
        Un = (e, t) => {
          e.rejectPromise(t);
        },
        Wn = (e, t) => {
          let n = z.innerParams.get(e);
          (n.showLoaderOnConfirm && wn(),
            n.preConfirm
              ? (e.resetValidationMessage(),
                (e.isAwaitingPromise = !0),
                Promise.resolve()
                  .then(() => b(n.preConfirm(t, n.validationMessage)))
                  .then((n) => {
                    we(ee()) || n === !1 ? (e.hideLoading(), yn(e)) : Hn(e, n === void 0 ? t : n);
                  })
                  .catch((t) => Un(e, t)))
              : Hn(e, t));
        };
      function Gn() {
        let e = z.innerParams.get(this);
        if (!e) return;
        let t = z.domCache.get(this);
        (be(t.loader),
          le() ? e.icon && ye(D()) : Kn(t),
          ge([t.popup, t.actions], l.loading),
          t.popup.removeAttribute(`aria-busy`),
          t.popup.removeAttribute(`data-loading`),
          (t.confirmButton.disabled = !1),
          (t.denyButton.disabled = !1),
          (t.cancelButton.disabled = !1));
        let n = z.focusedElement.get(this);
        (n instanceof HTMLElement && document.activeElement === document.body && n.focus(),
          z.focusedElement.delete(this));
      }
      let Kn = (e) => {
        let t = e.loader.getAttribute(`data-button-to-replace`),
          n = t ? e.popup.getElementsByClassName(t) : [];
        n.length ? ye(n[0], `inline-block`) : Te() && be(e.actions);
      };
      function qn() {
        let e = z.innerParams.get(this),
          t = z.domCache.get(this);
        return t ? pe(t.popup, e.input) : null;
      }
      function Jn(e, t, n) {
        let r = z.domCache.get(e);
        t.forEach((e) => {
          r[e].disabled = n;
        });
      }
      function Yn(e, t) {
        let n = E();
        if (!(!n || !e))
          if (e.type === `radio`) {
            let e = n.querySelectorAll(`[name="${l.radio}"]`);
            for (let n = 0; n < e.length; n++) e[n].disabled = t;
          } else e.disabled = t;
      }
      function Xn() {
        Jn(this, [`confirmButton`, `denyButton`, `cancelButton`], !1);
        let e = z.focusedElement.get(this);
        (e instanceof HTMLElement && document.activeElement === document.body && e.focus(),
          z.focusedElement.delete(this));
      }
      function Zn() {
        (z.focusedElement.set(this, document.activeElement),
          Jn(this, [`confirmButton`, `denyButton`, `cancelButton`], !0));
      }
      function Qn() {
        Yn(this.getInput(), !1);
      }
      function $n() {
        Yn(this.getInput(), !0);
      }
      function er(e) {
        let t = z.domCache.get(this),
          n = z.innerParams.get(this);
        (I(t.validationMessage, e),
          (t.validationMessage.className = l[`validation-message`]),
          n.customClass && n.customClass.validationMessage && R(t.validationMessage, n.customClass.validationMessage),
          ye(t.validationMessage));
        let r = this.getInput();
        r &&
          (r.setAttribute(`aria-invalid`, `true`),
          r.setAttribute(`aria-describedby`, l[`validation-message`]),
          me(r),
          R(r, l.inputerror));
      }
      function tr() {
        let e = z.domCache.get(this);
        e.validationMessage && be(e.validationMessage);
        let t = this.getInput();
        t && (t.removeAttribute(`aria-invalid`), t.removeAttribute(`aria-describedby`), ge(t, l.inputerror));
      }
      let H = {
          title: ``,
          titleText: ``,
          text: ``,
          html: ``,
          footer: ``,
          icon: void 0,
          iconColor: void 0,
          iconHtml: void 0,
          template: void 0,
          toast: !1,
          draggable: !1,
          animation: !0,
          theme: `light`,
          showClass: { popup: `swal2-show`, backdrop: `swal2-backdrop-show`, icon: `swal2-icon-show` },
          hideClass: { popup: `swal2-hide`, backdrop: `swal2-backdrop-hide`, icon: `swal2-icon-hide` },
          customClass: {},
          target: `body`,
          color: void 0,
          backdrop: !0,
          heightAuto: !0,
          allowOutsideClick: !0,
          allowEscapeKey: !0,
          allowEnterKey: !0,
          stopKeydownPropagation: !0,
          keydownListenerCapture: !1,
          showConfirmButton: !0,
          showDenyButton: !1,
          showCancelButton: !1,
          preConfirm: void 0,
          preDeny: void 0,
          confirmButtonText: `OK`,
          confirmButtonAriaLabel: ``,
          confirmButtonColor: void 0,
          denyButtonText: `No`,
          denyButtonAriaLabel: ``,
          denyButtonColor: void 0,
          cancelButtonText: `Cancel`,
          cancelButtonAriaLabel: ``,
          cancelButtonColor: void 0,
          buttonsStyling: !0,
          reverseButtons: !1,
          focusConfirm: !0,
          focusDeny: !1,
          focusCancel: !1,
          returnFocus: !0,
          showCloseButton: !1,
          closeButtonHtml: `&times;`,
          closeButtonAriaLabel: `Close this dialog`,
          loaderHtml: ``,
          showLoaderOnConfirm: !1,
          showLoaderOnDeny: !1,
          imageUrl: void 0,
          imageWidth: void 0,
          imageHeight: void 0,
          imageAlt: ``,
          timer: void 0,
          timerProgressBar: !1,
          width: void 0,
          padding: void 0,
          background: void 0,
          input: void 0,
          inputPlaceholder: ``,
          inputLabel: ``,
          inputValue: ``,
          inputOptions: {},
          inputAutoFocus: !0,
          inputAutoTrim: !0,
          inputAttributes: {},
          inputValidator: void 0,
          returnInputValueOnDeny: !1,
          validationMessage: void 0,
          grow: !1,
          position: `center`,
          progressSteps: [],
          currentProgressStep: void 0,
          progressStepsDistance: void 0,
          willOpen: void 0,
          didOpen: void 0,
          didRender: void 0,
          willClose: void 0,
          didClose: void 0,
          didDestroy: void 0,
          scrollbarPadding: !0,
          topLayer: !1,
        },
        nr =
          `allowEscapeKey.allowOutsideClick.background.buttonsStyling.cancelButtonAriaLabel.cancelButtonColor.cancelButtonText.closeButtonAriaLabel.closeButtonHtml.color.confirmButtonAriaLabel.confirmButtonColor.confirmButtonText.currentProgressStep.customClass.denyButtonAriaLabel.denyButtonColor.denyButtonText.didClose.didDestroy.draggable.footer.hideClass.html.icon.iconColor.iconHtml.imageAlt.imageHeight.imageUrl.imageWidth.preConfirm.preDeny.progressSteps.returnFocus.reverseButtons.showCancelButton.showCloseButton.showConfirmButton.showDenyButton.text.title.titleText.theme.willClose`.split(
            `.`,
          ),
        rr = { allowEnterKey: void 0 },
        ir = [
          `allowOutsideClick`,
          `allowEnterKey`,
          `backdrop`,
          `draggable`,
          `focusConfirm`,
          `focusDeny`,
          `focusCancel`,
          `returnFocus`,
          `heightAuto`,
          `keydownListenerCapture`,
        ],
        ar = (e) => Object.prototype.hasOwnProperty.call(H, e),
        or = (e) => nr.indexOf(e) !== -1,
        sr = (e) => rr[e],
        cr = (e) => {
          ar(e) || p(`Unknown parameter "${e}"`);
        },
        lr = (e) => {
          ir.includes(e) && p(`The parameter "${e}" is incompatible with toasts`);
        },
        ur = (e) => {
          let t = sr(e);
          t && _(e, t);
        },
        dr = (e) => {
          (e.backdrop === !1 &&
            e.allowOutsideClick &&
            p('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'),
            e.theme &&
              ![
                `light`,
                `dark`,
                `auto`,
                `minimal`,
                `borderless`,
                `bootstrap-4`,
                `bootstrap-4-light`,
                `bootstrap-4-dark`,
                `bootstrap-5`,
                `bootstrap-5-light`,
                `bootstrap-5-dark`,
                `material-ui`,
                `material-ui-light`,
                `material-ui-dark`,
                `embed-iframe`,
                `bulma`,
                `bulma-light`,
                `bulma-dark`,
              ].includes(e.theme) &&
              p(`Invalid theme "${e.theme}"`));
          for (let t in e) (cr(t), e.toast && lr(t), ur(t));
        };
      function fr(e) {
        let t = C(),
          n = E(),
          r = z.innerParams.get(this);
        if (!n || de(n, r.hideClass.popup)) {
          p(
            `You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`,
          );
          return;
        }
        let i = pr(e),
          a = Object.assign({}, r, i);
        (dr(a),
          t && (t.dataset.swal2Theme = a.theme),
          Lt(this, a),
          z.innerParams.set(this, a),
          Object.defineProperties(this, {
            params: { value: Object.assign({}, this.params, e), writable: !1, enumerable: !0 },
          }));
      }
      let pr = (e) => {
        let t = {};
        return (
          Object.keys(e).forEach((n) => {
            or(n) ? (t[n] = e[n]) : p(`Invalid parameter to update: ${n}`);
          }),
          t
        );
      };
      function mr() {
        var e;
        let t = z.domCache.get(this),
          n = z.innerParams.get(this);
        if (!n) {
          gr(this);
          return;
        }
        (t.popup &&
          a.swalCloseEventFinishedCallback &&
          (a.swalCloseEventFinishedCallback(), delete a.swalCloseEventFinishedCallback),
          typeof n.didDestroy == `function` && n.didDestroy(),
          (e = a.eventEmitter) == null || e.emit(`didDestroy`),
          hr(this));
      }
      let hr = (e) => {
          (gr(e), delete e.params, delete a.keydownHandler, delete a.keydownTarget, delete a.currentInstance);
        },
        gr = (e) => {
          e.isAwaitingPromise
            ? (_r(z, e), (e.isAwaitingPromise = !0))
            : (_r(Qt, e),
              _r(z, e),
              delete e.isAwaitingPromise,
              delete e.disableButtons,
              delete e.enableButtons,
              delete e.getInput,
              delete e.disableInput,
              delete e.enableInput,
              delete e.hideLoading,
              delete e.disableLoading,
              delete e.showValidationMessage,
              delete e.resetValidationMessage,
              delete e.close,
              delete e.closePopup,
              delete e.closeModal,
              delete e.closeToast,
              delete e.rejectPromise,
              delete e.update,
              delete e._destroy);
        },
        _r = (e, t) => {
          for (let n in e) e[n].delete(t);
        };
      var vr = Object.freeze({
        __proto__: null,
        _destroy: mr,
        close: gn,
        closeModal: gn,
        closePopup: gn,
        closeToast: gn,
        disableButtons: Zn,
        disableInput: $n,
        disableLoading: Gn,
        enableButtons: Xn,
        enableInput: Qn,
        getInput: qn,
        handleAwaitingPromise: yn,
        hideLoading: Gn,
        rejectPromise: vn,
        resetValidationMessage: tr,
        showValidationMessage: er,
        update: fr,
      });
      let yr = (e, t, n) => {
          e.toast ? br(e, t, n) : (Cr(t), wr(t), Tr(e, t, n));
        },
        br = (e, t, n) => {
          t.popup.onclick = () => {
            (e && (xr(e) || e.timer || e.input)) || n(B.close);
          };
        },
        xr = (e) => !!(e.showConfirmButton || e.showDenyButton || e.showCancelButton || e.showCloseButton),
        Sr = !1,
        Cr = (e) => {
          e.popup.onmousedown = () => {
            e.container.onmouseup = function (t) {
              ((e.container.onmouseup = () => {}), t.target === e.container && (Sr = !0));
            };
          };
        },
        wr = (e) => {
          e.container.onmousedown = (t) => {
            (t.target === e.container && t.preventDefault(),
              (e.popup.onmouseup = function (t) {
                ((e.popup.onmouseup = () => {}),
                  (t.target === e.popup || (t.target instanceof HTMLElement && e.popup.contains(t.target))) &&
                    (Sr = !0));
              }));
          };
        },
        Tr = (e, t, n) => {
          t.container.onclick = (r) => {
            if (Sr) {
              Sr = !1;
              return;
            }
            r.target === t.container && v(e.allowOutsideClick) && n(B.backdrop);
          };
        },
        Er = (e) => typeof e == `object` && !!e && `jquery` in e,
        Dr = (e) => e instanceof Element || Er(e),
        Or = (e) => {
          let t = {};
          return (
            typeof e[0] == `object` && !Dr(e[0])
              ? Object.assign(t, e[0])
              : [`title`, `html`, `icon`].forEach((n, r) => {
                  let i = e[r];
                  typeof i == `string` || Dr(i)
                    ? (t[n] = i)
                    : i !== void 0 && m(`Unexpected type of ${n}! Expected "string" or "Element", got ${typeof i}`);
                }),
            t
          );
        };
      function kr(...e) {
        return new this(...e);
      }
      function Ar(e) {
        class t extends this {
          _main(t, n) {
            return super._main(t, Object.assign({}, e, n));
          }
        }
        return t;
      }
      let jr = () => a.timeout && a.timeout.getTimerLeft(),
        Mr = () => {
          if (a.timeout) return (Ae(), a.timeout.stop());
        },
        Nr = () => {
          if (a.timeout) {
            let e = a.timeout.start();
            return (ke(e), e);
          }
        },
        Pr = () => {
          let e = a.timeout;
          return e && (e.running ? Mr() : Nr());
        },
        Fr = (e) => {
          if (a.timeout) {
            let t = a.timeout.increase(e);
            return (ke(t, !0), t);
          }
        },
        U = () => !!(a.timeout && a.timeout.isRunning()),
        Ir = !1,
        Lr = {};
      function Rr(e = `data-swal-template`) {
        ((Lr[e] = this), (Ir ||= (document.body.addEventListener(`click`, zr), !0)));
      }
      let zr = (e) => {
        for (let t = e.target; t && t !== document; t = t.parentNode)
          for (let e in Lr) {
            let n = t.getAttribute && t.getAttribute(e);
            if (n) {
              Lr[e].fire({ template: n });
              return;
            }
          }
      };
      class Br {
        constructor() {
          this.events = {};
        }
        _getHandlersByEventName(e) {
          return (this.events[e] === void 0 && (this.events[e] = []), this.events[e]);
        }
        on(e, t) {
          let n = this._getHandlersByEventName(e);
          n.includes(t) || n.push(t);
        }
        once(e, t) {
          let n = (...r) => {
            (this.removeListener(e, n), t.apply(this, r));
          };
          this.on(e, n);
        }
        emit(e, ...t) {
          this._getHandlersByEventName(e).forEach((e) => {
            try {
              e.apply(this, t);
            } catch (e) {
              console.error(e);
            }
          });
        }
        removeListener(e, t) {
          let n = this._getHandlersByEventName(e),
            r = n.indexOf(t);
          r > -1 && n.splice(r, 1);
        }
        removeAllListeners(e) {
          this.events[e] !== void 0 && (this.events[e].length = 0);
        }
        reset() {
          this.events = {};
        }
      }
      a.eventEmitter = new Br();
      var Vr = Object.freeze({
        __proto__: null,
        argsToParams: Or,
        bindClickHandler: Rr,
        clickCancel: Vt,
        clickConfirm: zt,
        clickDeny: Bt,
        enableLoading: wn,
        fire: kr,
        getActions: F,
        getCancelButton: P,
        getCloseButton: oe,
        getConfirmButton: N,
        getContainer: C,
        getDenyButton: te,
        getFocusableElements: se,
        getFooter: ie,
        getHtmlContainer: A,
        getIcon: D,
        getIconContent: O,
        getImage: j,
        getInputLabel: ne,
        getLoader: re,
        getPopup: E,
        getProgressSteps: M,
        getTimerLeft: jr,
        getTimerProgressBar: ae,
        getTitle: k,
        getValidationMessage: ee,
        increaseTimer: Fr,
        isDeprecatedParameter: sr,
        isLoading: ue,
        isTimerRunning: U,
        isUpdatableParameter: or,
        isValidParameter: ar,
        isVisible: Rt,
        mixin: Ar,
        off: (e, t) => {
          if (a.eventEmitter) {
            if (!e) {
              a.eventEmitter.reset();
              return;
            }
            t ? a.eventEmitter.removeListener(e, t) : a.eventEmitter.removeAllListeners(e);
          }
        },
        on: (e, t) => {
          a.eventEmitter && a.eventEmitter.on(e, t);
        },
        once: (e, t) => {
          a.eventEmitter && a.eventEmitter.once(e, t);
        },
        resumeTimer: Nr,
        showLoading: wn,
        stopTimer: Mr,
        toggleTimer: Pr,
      });
      class Hr {
        constructor(e, t) {
          ((this.callback = e), (this.remaining = t), (this.running = !1), this.start());
        }
        start() {
          return (
            this.running ||
              ((this.running = !0), (this.started = new Date()), (this.id = setTimeout(this.callback, this.remaining))),
            this.remaining
          );
        }
        stop() {
          return (
            this.started &&
              this.running &&
              ((this.running = !1),
              clearTimeout(this.id),
              (this.remaining -= new Date().getTime() - this.started.getTime())),
            this.remaining
          );
        }
        increase(e) {
          let t = this.running;
          return (t && this.stop(), (this.remaining += e), t && this.start(), this.remaining);
        }
        getTimerLeft() {
          return (this.running && (this.stop(), this.start()), this.remaining);
        }
        isRunning() {
          return this.running;
        }
      }
      let Ur = [`swal-title`, `swal-html`, `swal-footer`],
        Wr = (e) => {
          let t = typeof e.template == `string` ? document.querySelector(e.template) : e.template;
          if (!t) return {};
          let n = t.content;
          return (Zr(n), Object.assign(Gr(n), Kr(n), qr(n), Jr(n), W(n), Yr(n), Xr(n, Ur)));
        },
        Gr = (e) => {
          let t = {};
          return (
            Array.from(e.querySelectorAll(`swal-param`)).forEach((e) => {
              Qr(e, [`name`, `value`]);
              let n = e.getAttribute(`name`),
                r = e.getAttribute(`value`);
              !n ||
                !r ||
                (n in H && typeof H[n] == `boolean`
                  ? (t[n] = r !== `false`)
                  : n in H && typeof H[n] == `object`
                    ? (t[n] = JSON.parse(r))
                    : (t[n] = r));
            }),
            t
          );
        },
        Kr = (e) => {
          let t = {};
          return (
            Array.from(e.querySelectorAll(`swal-function-param`)).forEach((e) => {
              let n = e.getAttribute(`name`),
                r = e.getAttribute(`value`);
              !n || !r || (t[n] = Function(`return ${r}`)());
            }),
            t
          );
        },
        qr = (e) => {
          let t = {};
          return (
            Array.from(e.querySelectorAll(`swal-button`)).forEach((e) => {
              Qr(e, [`type`, `color`, `aria-label`]);
              let n = e.getAttribute(`type`);
              if (!n || ![`confirm`, `cancel`, `deny`].includes(n)) return;
              ((t[`${n}ButtonText`] = e.innerHTML), (t[`show${f(n)}Button`] = !0));
              let r = e.getAttribute(`color`);
              r !== null && (t[`${n}ButtonColor`] = r);
              let i = e.getAttribute(`aria-label`);
              i !== null && (t[`${n}ButtonAriaLabel`] = i);
            }),
            t
          );
        },
        Jr = (e) => {
          let t = {},
            n = e.querySelector(`swal-image`);
          if (n) {
            Qr(n, [`src`, `width`, `height`, `alt`]);
            let e = n.getAttribute(`src`);
            e !== null && (t.imageUrl = e || void 0);
            let r = n.getAttribute(`width`);
            r !== null && (t.imageWidth = r || void 0);
            let i = n.getAttribute(`height`);
            i !== null && (t.imageHeight = i || void 0);
            let a = n.getAttribute(`alt`);
            a !== null && (t.imageAlt = a || void 0);
          }
          return t;
        },
        W = (e) => {
          let t = {},
            n = e.querySelector(`swal-icon`);
          return (
            n &&
              (Qr(n, [`type`, `color`]),
              n.hasAttribute(`type`) && (t.icon = n.getAttribute(`type`)),
              n.hasAttribute(`color`) && (t.iconColor = n.getAttribute(`color`)),
              (t.iconHtml = n.innerHTML)),
            t
          );
        },
        Yr = (e) => {
          let t = {},
            n = e.querySelector(`swal-input`);
          n &&
            (Qr(n, [`type`, `label`, `placeholder`, `value`]),
            (t.input = n.getAttribute(`type`) || `text`),
            n.hasAttribute(`label`) && (t.inputLabel = n.getAttribute(`label`)),
            n.hasAttribute(`placeholder`) && (t.inputPlaceholder = n.getAttribute(`placeholder`)),
            n.hasAttribute(`value`) && (t.inputValue = n.getAttribute(`value`)));
          let r = Array.from(e.querySelectorAll(`swal-input-option`));
          return (
            r.length &&
              ((t.inputOptions = {}),
              r.forEach((e) => {
                Qr(e, [`value`]);
                let n = e.getAttribute(`value`);
                if (!n) return;
                let r = e.innerHTML;
                t.inputOptions[n] = r;
              })),
            t
          );
        },
        Xr = (e, t) => {
          let n = {};
          for (let r in t) {
            let i = t[r],
              a = e.querySelector(i);
            a && (Qr(a, []), (n[i.replace(/^swal-/, ``)] = a.innerHTML.trim()));
          }
          return n;
        },
        Zr = (e) => {
          let t = Ur.concat([
            `swal-param`,
            `swal-function-param`,
            `swal-button`,
            `swal-image`,
            `swal-icon`,
            `swal-input`,
            `swal-input-option`,
          ]);
          Array.from(e.children).forEach((e) => {
            let n = e.tagName.toLowerCase();
            t.includes(n) || p(`Unrecognized element <${n}>`);
          });
        },
        Qr = (e, t) => {
          Array.from(e.attributes).forEach((n) => {
            t.indexOf(n.name) === -1 &&
              p([
                `Unrecognized attribute "${n.name}" on <${e.tagName.toLowerCase()}>.`,
                `${t.length ? `Allowed attributes are: ${t.join(`, `)}` : `To set the value, use HTML within the element.`}`,
              ]);
          });
        },
        $r = (e) => {
          var t, n;
          let r = C(),
            i = E();
          if (!r || !i) return;
          (typeof e.willOpen == `function` && e.willOpen(i), (t = a.eventEmitter) == null || t.emit(`willOpen`, i));
          let o = window.getComputedStyle(document.body).overflowY;
          if (
            (ri(r, i, e),
            setTimeout(() => {
              ti(r, i);
            }, 10),
            ce() && (ni(r, e.scrollbarPadding === void 0 ? !1 : e.scrollbarPadding, o), $t()),
            nn && e.backdrop === !1 && i.scrollHeight > r.clientHeight && (r.style.pointerEvents = `auto`),
            !le() && !a.previousActiveElement && (a.previousActiveElement = document.activeElement),
            typeof e.didOpen == `function`)
          ) {
            let t = e.didOpen;
            setTimeout(() => t(i));
          }
          (n = a.eventEmitter) == null || n.emit(`didOpen`, i);
        },
        ei = (e) => {
          let t = E();
          if (!t || e.target !== t) return;
          let n = C();
          n &&
            (t.removeEventListener(`animationend`, ei),
            t.removeEventListener(`transitionend`, ei),
            (n.style.overflowY = `auto`),
            ge(n, l[`no-transition`]));
        },
        ti = (e, t) => {
          Oe(t)
            ? ((e.style.overflowY = `hidden`),
              t.addEventListener(`animationend`, ei),
              t.addEventListener(`transitionend`, ei))
            : (e.style.overflowY = `auto`);
        },
        ni = (e, t, n) => {
          (rn(),
            t && n !== `hidden` && fn(n),
            setTimeout(() => {
              e.scrollTop = 0;
            }));
        },
        ri = (e, t, n) => {
          var r;
          ((r = n.showClass) != null && r.backdrop && R(e, n.showClass.backdrop),
            n.animation
              ? (t.style.setProperty(`opacity`, `0`, `important`),
                ye(t, `grid`),
                setTimeout(() => {
                  var e;
                  ((e = n.showClass) != null && e.popup && R(t, n.showClass.popup), t.style.removeProperty(`opacity`));
                }, 10))
              : ye(t, `grid`),
            R([document.documentElement, document.body], l.shown),
            n.heightAuto && n.backdrop && !n.toast && R([document.documentElement, document.body], l[`height-auto`]));
        };
      var G = {
        email: (e, t) =>
          /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(e)
            ? Promise.resolve()
            : Promise.resolve(t || `Invalid email address`),
        url: (e, t) =>
          /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(e)
            ? Promise.resolve()
            : Promise.resolve(t || `Invalid URL`),
      };
      function ii(e) {
        e.inputValidator ||
          (e.input === `email` && (e.inputValidator = G.email), e.input === `url` && (e.inputValidator = G.url));
      }
      function ai(e) {
        (!e.target ||
          (typeof e.target == `string` && !document.querySelector(e.target)) ||
          (typeof e.target != `string` && !e.target.appendChild)) &&
          (p(`Target parameter is not valid, defaulting to "body"`), (e.target = `body`));
      }
      function oi(e) {
        (ii(e),
          e.showLoaderOnConfirm &&
            !e.preConfirm &&
            p(`showLoaderOnConfirm is set to true, but preConfirm is not defined.
showLoaderOnConfirm should be used together with preConfirm, see usage example:
https://sweetalert2.github.io/#ajax-request`),
          ai(e),
          typeof e.title == `string` &&
            (e.title = e.title
              .split(
                `
`,
              )
              .join(`<br />`)),
          ze(e));
      }
      let si;
      var ci = new WeakMap();
      class li {
        constructor(...e) {
          if ((r(this, ci, Promise.resolve({ isConfirmed: !1, isDenied: !1, isDismissed: !0 })), typeof window > `u`))
            return;
          si = this;
          let t = Object.freeze(this.constructor.argsToParams(e));
          ((this.params = t), (this.isAwaitingPromise = !1), i(ci, this, this._main(si.params)));
        }
        _main(e, t = {}) {
          if ((dr(Object.assign({}, t, e)), a.currentInstance)) {
            let e = Qt.swalPromiseResolve.get(a.currentInstance),
              { isAwaitingPromise: t } = a.currentInstance;
            (a.currentInstance._destroy(), t || e({ isDismissed: !0 }), ce() && en());
          }
          a.currentInstance = si;
          let n = di(e, t);
          (oi(n),
            Object.freeze(n),
            a.timeout && (a.timeout.stop(), delete a.timeout),
            clearTimeout(a.restoreFocusTimeout));
          let r = fi(si);
          return (Lt(si, n), z.innerParams.set(si, n), ui(si, r, n));
        }
        then(e) {
          return n(ci, this).then(e);
        }
        finally(e) {
          return n(ci, this).finally(e);
        }
      }
      let ui = (e, t, n) =>
          new Promise((r, i) => {
            let o = (t) => {
              e.close({ isDismissed: !0, dismiss: t, isConfirmed: !1, isDenied: !1 });
            };
            (Qt.swalPromiseResolve.set(e, r),
              Qt.swalPromiseReject.set(e, i),
              (t.confirmButton.onclick = () => {
                Ln(e);
              }),
              (t.denyButton.onclick = () => {
                Rn(e);
              }),
              (t.cancelButton.onclick = () => {
                zn(e, o);
              }),
              (t.closeButton.onclick = () => {
                o(B.close);
              }),
              yr(n, t, o),
              Ut(a, n, o),
              En(e, n),
              $r(n),
              pi(a, n, o),
              mi(t, n),
              setTimeout(() => {
                t.container.scrollTop = 0;
              }));
          }),
        di = (e, t) => {
          let n = Wr(e),
            r = Object.assign({}, H, t, n, e);
          return (
            (r.showClass = Object.assign({}, H.showClass, r.showClass)),
            (r.hideClass = Object.assign({}, H.hideClass, r.hideClass)),
            r.animation === !1 && ((r.showClass = { backdrop: `swal2-noanimation` }), (r.hideClass = {})),
            r
          );
        },
        fi = (e) => {
          let t = {
            popup: E(),
            container: C(),
            actions: F(),
            confirmButton: N(),
            denyButton: te(),
            cancelButton: P(),
            loader: re(),
            closeButton: oe(),
            validationMessage: ee(),
            progressSteps: M(),
          };
          return (z.domCache.set(e, t), t);
        },
        pi = (e, t, n) => {
          let r = ae();
          (be(r),
            t.timer &&
              ((e.timeout = new Hr(() => {
                (n(`timer`), delete e.timeout);
              }, t.timer)),
              t.timerProgressBar &&
                r &&
                (ye(r),
                L(r, t, `timerProgressBar`),
                setTimeout(() => {
                  e.timeout && e.timeout.running && ke(t.timer);
                }))));
        },
        mi = (e, t) => {
          if (!t.toast) {
            if (!v(t.allowEnterKey)) {
              (_(`allowEnterKey`, `preConfirm: () => false`), e.popup.focus());
              return;
            }
            hi(e) || gi(e, t) || Wt(-1, 1);
          }
        },
        hi = (e) => {
          let t = Array.from(e.popup.querySelectorAll(`[autofocus]`));
          for (let e of t) if (e instanceof HTMLElement && we(e)) return (e.focus(), !0);
          return !1;
        },
        gi = (e, t) =>
          t.focusDeny && we(e.denyButton)
            ? (e.denyButton.focus(), !0)
            : t.focusCancel && we(e.cancelButton)
              ? (e.cancelButton.focus(), !0)
              : t.focusConfirm && we(e.confirmButton)
                ? (e.confirmButton.focus(), !0)
                : !1;
      ((li.prototype.disableButtons = Zn),
        (li.prototype.enableButtons = Xn),
        (li.prototype.getInput = qn),
        (li.prototype.disableInput = $n),
        (li.prototype.enableInput = Qn),
        (li.prototype.hideLoading = Gn),
        (li.prototype.disableLoading = Gn),
        (li.prototype.showValidationMessage = er),
        (li.prototype.resetValidationMessage = tr),
        (li.prototype.close = gn),
        (li.prototype.closePopup = gn),
        (li.prototype.closeModal = gn),
        (li.prototype.closeToast = gn),
        (li.prototype.rejectPromise = vn),
        (li.prototype.update = fr),
        (li.prototype._destroy = mr),
        Object.assign(li, Vr),
        Object.keys(vr).forEach((e) => {
          li[e] = function (...t) {
            if (si && si[e]) return si[e](...t);
          };
        }),
        (li.DismissReason = B),
        (li.version = `11.26.24`));
      let _i = li;
      return ((_i.default = _i), _i);
    }),
      e !== void 0 && e.Sweetalert2 && (e.swal = e.sweetAlert = e.Swal = e.SweetAlert = e.Sweetalert2),
      typeof document < `u` &&
        (function (e, t) {
          var n = e.createElement(`style`);
          if ((e.getElementsByTagName(`head`)[0].appendChild(n), n.styleSheet))
            n.styleSheet.disabled || (n.styleSheet.cssText = t);
          else
            try {
              n.innerHTML = t;
            } catch {
              n.innerText = t;
            }
        })(
          document,
          `:root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-icon-animations: true;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:auto}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem;container-name:swal2-popup}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:auto}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}@container swal2-popup style(--swal2-icon-animations:true){.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}`,
        ));
  }),
  Br = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim(),
  Vr = (e) => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase(),
  Hr = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => (n ? n.toUpperCase() : t.toLowerCase())),
  Ur = (e) => {
    let t = Hr(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  Wr = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    strokeWidth: 2,
    strokeLinecap: `round`,
    strokeLinejoin: `round`,
  },
  Gr = (e) => {
    for (let t in e) if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
  },
  Kr = (0, _.createContext)({}),
  qr = () => (0, _.useContext)(Kr),
  Jr = (0, _.forwardRef)(
    (
      { color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: i = ``, children: a, iconNode: o, ...s },
      c,
    ) => {
      let {
          size: l = 24,
          strokeWidth: u = 2,
          absoluteStrokeWidth: d = !1,
          color: f = `currentColor`,
          className: p = ``,
        } = qr() ?? {},
        m = (r ?? d) ? (Number(n ?? u) * 24) / Number(t ?? l) : (n ?? u);
      return (0, _.createElement)(
        `svg`,
        {
          ref: c,
          ...Wr,
          width: t ?? l ?? Wr.width,
          height: t ?? l ?? Wr.height,
          stroke: e ?? f,
          strokeWidth: m,
          className: Br(`lucide`, p, i),
          ...(!a && !Gr(s) && { 'aria-hidden': `true` }),
          ...s,
        },
        [...o.map(([e, t]) => (0, _.createElement)(e, t)), ...(Array.isArray(a) ? a : [a])],
      );
    },
  ),
  W = (e, t) => {
    let n = (0, _.forwardRef)(({ className: n, ...r }, i) =>
      (0, _.createElement)(Jr, { ref: i, iconNode: t, className: Br(`lucide-${Vr(Ur(e))}`, `lucide-${e}`, n), ...r }),
    );
    return ((n.displayName = Ur(e)), n);
  },
  Yr = W(`arrow-left`, [
    [`path`, { d: `m12 19-7-7 7-7`, key: `1l729n` }],
    [`path`, { d: `M19 12H5`, key: `x3x0zl` }],
  ]),
  Xr = W(`award`, [
    [
      `path`,
      {
        d: `m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526`,
        key: `1yiouv`,
      },
    ],
    [`circle`, { cx: `12`, cy: `8`, r: `6`, key: `1vp47v` }],
  ]),
  Zr = W(`bird`, [
    [`path`, { d: `M16 7h.01`, key: `1kdx03` }],
    [`path`, { d: `M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20`, key: `oj1oa8` }],
    [`path`, { d: `m20 7 2 .5-2 .5`, key: `12nv4d` }],
    [`path`, { d: `M10 18v3`, key: `1yea0a` }],
    [`path`, { d: `M14 17.75V21`, key: `1pymcb` }],
    [`path`, { d: `M7 18a6 6 0 0 0 3.84-10.61`, key: `1npnn0` }],
  ]),
  Qr = W(`book-open`, [
    [`path`, { d: `M12 7v14`, key: `1akyts` }],
    [
      `path`,
      {
        d: `M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z`,
        key: `ruj8y`,
      },
    ],
  ]),
  $r = W(`cat`, [
    [
      `path`,
      {
        d: `M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z`,
        key: `x6xyqk`,
      },
    ],
    [`path`, { d: `M8 14v.5`, key: `1nzgdb` }],
    [`path`, { d: `M16 14v.5`, key: `1lajdz` }],
    [`path`, { d: `M11.25 16.25h1.5L12 17l-.75-.75Z`, key: `12kq1m` }],
  ]),
  ei = W(`circle`, [[`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }]]),
  ti = W(`dog`, [
    [`path`, { d: `M11.25 16.25h1.5L12 17z`, key: `w7jh35` }],
    [`path`, { d: `M16 14v.5`, key: `1lajdz` }],
    [
      `path`,
      {
        d: `M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309`,
        key: `u7s9ue`,
      },
    ],
    [`path`, { d: `M8 14v.5`, key: `1nzgdb` }],
    [
      `path`,
      {
        d: `M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5`,
        key: `v8hric`,
      },
    ],
  ]),
  ni = W(`fish`, [
    [
      `path`,
      { d: `M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z`, key: `15baut` },
    ],
    [`path`, { d: `M18 12v.5`, key: `18hhni` }],
    [`path`, { d: `M16 17.93a9.77 9.77 0 0 1 0-11.86`, key: `16dt7o` }],
    [
      `path`,
      {
        d: `M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33`,
        key: `l9di03`,
      },
    ],
    [`path`, { d: `M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4`, key: `1kjonw` }],
    [`path`, { d: `m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98`, key: `1zlm23` }],
  ]),
  ri = W(`flame`, [
    [
      `path`,
      {
        d: `M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4`,
        key: `1slcih`,
      },
    ],
  ]),
  G = W(`frown`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `M16 16s-1.5-2-4-2-4 2-4 2`, key: `epbg0q` }],
    [`line`, { x1: `9`, x2: `9.01`, y1: `9`, y2: `9`, key: `yxxnd0` }],
    [`line`, { x1: `15`, x2: `15.01`, y1: `9`, y2: `9`, key: `1p4y9e` }],
  ]),
  ii = W(`grid-3x3`, [
    [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` }],
    [`path`, { d: `M3 9h18`, key: `1pudct` }],
    [`path`, { d: `M3 15h18`, key: `5xshup` }],
    [`path`, { d: `M9 3v18`, key: `fh3hqa` }],
    [`path`, { d: `M15 3v18`, key: `14nvp0` }],
  ]),
  ai = W(`heart`, [
    [
      `path`,
      {
        d: `M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`,
        key: `mvr1a0`,
      },
    ],
  ]),
  oi = W(`minus`, [[`path`, { d: `M5 12h14`, key: `1ays0h` }]]),
  si = W(`moon`, [
    [
      `path`,
      {
        d: `M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`,
        key: `kfwtm`,
      },
    ],
  ]),
  ci = W(`mouse`, [
    [`rect`, { x: `5`, y: `2`, width: `14`, height: `20`, rx: `7`, key: `11ol66` }],
    [`path`, { d: `M12 6v4`, key: `16clxf` }],
  ]),
  li = W(`party-popper`, [
    [`path`, { d: `M5.8 11.3 2 22l10.7-3.79`, key: `gwxi1d` }],
    [`path`, { d: `M4 3h.01`, key: `1vcuye` }],
    [`path`, { d: `M22 8h.01`, key: `1mrtc2` }],
    [`path`, { d: `M15 2h.01`, key: `1cjtqr` }],
    [`path`, { d: `M22 20h.01`, key: `1mrys2` }],
    [
      `path`,
      {
        d: `m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10`,
        key: `hbicv8`,
      },
    ],
    [`path`, { d: `m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17`, key: `1i94pl` }],
    [`path`, { d: `m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7`, key: `1cofks` }],
    [
      `path`,
      {
        d: `M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z`,
        key: `4kbmks`,
      },
    ],
  ]),
  ui = W(`paw-print`, [
    [`circle`, { cx: `11`, cy: `4`, r: `2`, key: `vol9p0` }],
    [`circle`, { cx: `18`, cy: `8`, r: `2`, key: `17gozi` }],
    [`circle`, { cx: `20`, cy: `16`, r: `2`, key: `1v9bxh` }],
    [
      `path`,
      {
        d: `M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z`,
        key: `1ydw1z`,
      },
    ],
  ]),
  di = W(`pen-tool`, [
    [
      `path`,
      {
        d: `M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z`,
        key: `nt11vn`,
      },
    ],
    [
      `path`,
      {
        d: `m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18`,
        key: `15qc1e`,
      },
    ],
    [`path`, { d: `m2.3 2.3 7.286 7.286`, key: `1wuzzi` }],
    [`circle`, { cx: `11`, cy: `11`, r: `2`, key: `xmgehs` }],
  ]),
  fi = W(`plus`, [
    [`path`, { d: `M5 12h14`, key: `1ays0h` }],
    [`path`, { d: `M12 5v14`, key: `s699le` }],
  ]),
  pi = W(`rabbit`, [
    [`path`, { d: `M13 16a3 3 0 0 1 2.24 5`, key: `1epib5` }],
    [`path`, { d: `M18 12h.01`, key: `yjnet6` }],
    [
      `path`,
      {
        d: `M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3`,
        key: `ue9ozu`,
      },
    ],
    [`path`, { d: `M20 8.54V4a2 2 0 1 0-4 0v3`, key: `49iql8` }],
    [`path`, { d: `M7.612 12.524a3 3 0 1 0-1.6 4.3`, key: `1e33i0` }],
  ]),
  mi = W(`rotate-ccw`, [
    [`path`, { d: `M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`, key: `1357e3` }],
    [`path`, { d: `M3 3v5h5`, key: `1xhq8a` }],
  ]),
  hi = W(`share-2`, [
    [`circle`, { cx: `18`, cy: `5`, r: `3`, key: `gq8acd` }],
    [`circle`, { cx: `6`, cy: `12`, r: `3`, key: `w7nqdw` }],
    [`circle`, { cx: `18`, cy: `19`, r: `3`, key: `1xt0gg` }],
    [`line`, { x1: `8.59`, x2: `15.42`, y1: `13.51`, y2: `17.49`, key: `47mynk` }],
    [`line`, { x1: `15.41`, x2: `8.59`, y1: `6.51`, y2: `10.49`, key: `1n3mei` }],
  ]),
  gi = W(`sparkles`, [
    [
      `path`,
      {
        d: `M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,
        key: `1s2grr`,
      },
    ],
    [`path`, { d: `M20 2v4`, key: `1rf3ol` }],
    [`path`, { d: `M22 4h-4`, key: `gwowj6` }],
    [`circle`, { cx: `4`, cy: `20`, r: `2`, key: `6kqj1y` }],
  ]),
  _i = W(`squirrel`, [
    [`path`, { d: `M15.236 22a3 3 0 0 0-2.2-5`, key: `21bitc` }],
    [`path`, { d: `M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4`, key: `oh0fg0` }],
    [`path`, { d: `M18 13h.01`, key: `9veqaj` }],
    [
      `path`,
      {
        d: `M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10`,
        key: `980v8a`,
      },
    ],
  ]),
  vi = W(`sun`, [
    [`circle`, { cx: `12`, cy: `12`, r: `4`, key: `4exip2` }],
    [`path`, { d: `M12 2v2`, key: `tus03m` }],
    [`path`, { d: `M12 20v2`, key: `1lh1kg` }],
    [`path`, { d: `m4.93 4.93 1.41 1.41`, key: `149t6j` }],
    [`path`, { d: `m17.66 17.66 1.41 1.41`, key: `ptbguv` }],
    [`path`, { d: `M2 12h2`, key: `1t8f8n` }],
    [`path`, { d: `M20 12h2`, key: `1q8mjw` }],
    [`path`, { d: `m6.34 17.66-1.41 1.41`, key: `1m8zz5` }],
    [`path`, { d: `m19.07 4.93-1.41 1.41`, key: `1shlcs` }],
  ]),
  yi = W(`swatch-book`, [
    [`path`, { d: `M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z`, key: `1ldrpk` }],
    [`path`, { d: `M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7`, key: `11i5po` }],
    [`path`, { d: `M 7 17h.01`, key: `1euzgo` }],
    [`path`, { d: `m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8`, key: `o2gii7` }],
  ]),
  bi = W(`thumbs-up`, [
    [
      `path`,
      {
        d: `M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z`,
        key: `emmmcr`,
      },
    ],
    [`path`, { d: `M7 10v12`, key: `1qc93n` }],
  ]),
  xi = W(`timer`, [
    [`line`, { x1: `10`, x2: `14`, y1: `2`, y2: `2`, key: `14vaq8` }],
    [`line`, { x1: `12`, x2: `15`, y1: `14`, y2: `11`, key: `17fdiu` }],
    [`circle`, { cx: `12`, cy: `14`, r: `8`, key: `1e1u0o` }],
  ]),
  Si = W(`trophy`, [
    [`path`, { d: `M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978`, key: `1n3hpd` }],
    [`path`, { d: `M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978`, key: `rfe1zi` }],
    [`path`, { d: `M18 9h1.5a1 1 0 0 0 0-5H18`, key: `7xy6bh` }],
    [`path`, { d: `M4 22h16`, key: `57wxv0` }],
    [`path`, { d: `M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z`, key: `1mhfuq` }],
    [`path`, { d: `M6 9H4.5a1 1 0 0 1 0-5H6`, key: `tex48p` }],
  ]),
  Ci = W(`turtle`, [
    [
      `path`,
      {
        d: `m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z`,
        key: `1lbbv7`,
      },
    ],
    [`path`, { d: `M4.82 7.9 8 10`, key: `m9wose` }],
    [`path`, { d: `M15.18 7.9 12 10`, key: `p8dp2u` }],
    [`path`, { d: `M16.93 10H20a2 2 0 0 1 0 4H2`, key: `12nsm7` }],
  ]),
  wi = W(`undo-2`, [
    [`path`, { d: `M9 14 4 9l5-5`, key: `102s5s` }],
    [`path`, { d: `M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11`, key: `f3b9sd` }],
  ]),
  Ti = W(`user`, [
    [`path`, { d: `M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2`, key: `975kel` }],
    [`circle`, { cx: `12`, cy: `7`, r: `4`, key: `17ys0d` }],
  ]),
  Ei = W(`users`, [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
    [`path`, { d: `M16 3.128a4 4 0 0 1 0 7.744`, key: `16gr8j` }],
    [`path`, { d: `M22 21v-2a4 4 0 0 0-3-3.87`, key: `kshegd` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
  ]),
  Di = W(`zap`, [
    [
      `path`,
      {
        d: `M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`,
        key: `1xq2db`,
      },
    ],
  ]),
  K = l(zr()),
  Oi = () =>
    (0, U.jsxs)(`svg`, {
      viewBox: `0 0 48 48`,
      className: `w-full h-full`,
      children: [
        (0, U.jsx)(`rect`, {
          x: `4`,
          y: `4`,
          width: `40`,
          height: `40`,
          fill: `none`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`text`, {
          x: `24`,
          y: `28`,
          textAnchor: `middle`,
          className: `text-lg font-bold`,
          fill: `currentColor`,
          children: `B`,
        }),
      ],
    }),
  ki = () =>
    (0, U.jsxs)(`svg`, {
      viewBox: `0 0 48 48`,
      className: `w-full h-full`,
      children: [
        (0, U.jsx)(`line`, {
          x1: `16`,
          y1: `4`,
          x2: `16`,
          y2: `44`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`line`, {
          x1: `32`,
          y1: `4`,
          x2: `32`,
          y2: `44`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`line`, {
          x1: `4`,
          y1: `16`,
          x2: `44`,
          y2: `16`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`line`, {
          x1: `4`,
          y1: `32`,
          x2: `44`,
          y2: `32`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`text`, { x: `10`, y: `14`, className: `text-lg font-bold`, fill: `currentColor`, children: `X` }),
        (0, U.jsx)(`text`, { x: `26`, y: `30`, className: `text-lg font-bold`, fill: `currentColor`, children: `O` }),
      ],
    }),
  Ai = () =>
    (0, U.jsxs)(`svg`, {
      viewBox: `0 0 48 48`,
      className: `w-full h-full`,
      children: [
        (0, U.jsx)(`rect`, {
          x: `2`,
          y: `2`,
          width: `20`,
          height: `20`,
          fill: `none`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`rect`, {
          x: `26`,
          y: `2`,
          width: `20`,
          height: `20`,
          fill: `none`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`rect`, {
          x: `2`,
          y: `26`,
          width: `20`,
          height: `20`,
          fill: `none`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`rect`, {
          x: `26`,
          y: `26`,
          width: `20`,
          height: `20`,
          fill: `none`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`text`, { x: `12`, y: `16`, className: `text-sm font-bold`, fill: `currentColor`, children: `X` }),
        (0, U.jsx)(`text`, { x: `36`, y: `40`, className: `text-sm font-bold`, fill: `currentColor`, children: `O` }),
      ],
    }),
  ji = () =>
    (0, U.jsxs)(`svg`, {
      viewBox: `0 0 48 48`,
      className: `w-full h-full`,
      children: [
        (0, U.jsx)(`circle`, { cx: `8`, cy: `8`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `24`, cy: `8`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `40`, cy: `8`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `8`, cy: `24`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `24`, cy: `24`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `40`, cy: `24`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `8`, cy: `40`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `24`, cy: `40`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`circle`, { cx: `40`, cy: `40`, r: `3`, fill: `currentColor` }),
        (0, U.jsx)(`line`, { x1: `8`, y1: `8`, x2: `24`, y2: `8`, stroke: `currentColor`, strokeWidth: `2` }),
        (0, U.jsx)(`line`, { x1: `8`, y1: `24`, x2: `8`, y2: `8`, stroke: `currentColor`, strokeWidth: `2` }),
        (0, U.jsx)(`line`, {
          x1: `24`,
          y1: `24`,
          x2: `40`,
          y2: `24`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`line`, { x1: `40`, y1: `24`, x2: `40`, y2: `8`, stroke: `currentColor`, strokeWidth: `2` }),
        (0, U.jsx)(`line`, {
          x1: `8`,
          y1: `40`,
          x2: `8`,
          y2: `24`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
      ],
    }),
  Mi = () =>
    (0, U.jsxs)(`svg`, {
      viewBox: `0 0 48 48`,
      className: `w-full h-full`,
      children: [
        (0, U.jsx)(`rect`, {
          x: `4`,
          y: `4`,
          width: `40`,
          height: `40`,
          fill: `none`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`text`, { x: `12`, y: `16`, className: `text-sm font-bold`, fill: `currentColor`, children: `S` }),
        (0, U.jsx)(`text`, { x: `24`, y: `28`, className: `text-sm font-bold`, fill: `currentColor`, children: `O` }),
        (0, U.jsx)(`text`, { x: `36`, y: `40`, className: `text-sm font-bold`, fill: `currentColor`, children: `S` }),
      ],
    }),
  Ni = () =>
    (0, U.jsxs)(`svg`, {
      viewBox: `0 0 48 48`,
      className: `w-full h-full`,
      children: [
        (0, U.jsx)(`rect`, {
          x: `4`,
          y: `8`,
          width: `40`,
          height: `32`,
          fill: `none`,
          stroke: `currentColor`,
          strokeWidth: `2`,
          strokeDasharray: `4 2`,
        }),
        (0, U.jsx)(`circle`, { cx: `12`, cy: `16`, r: `4`, fill: `#ef4444` }),
        (0, U.jsx)(`circle`, { cx: `24`, cy: `16`, r: `4`, fill: `#eab308` }),
        (0, U.jsx)(`circle`, { cx: `36`, cy: `16`, r: `4`, fill: `#ef4444` }),
        (0, U.jsx)(`circle`, { cx: `12`, cy: `28`, r: `4`, fill: `#eab308` }),
        (0, U.jsx)(`circle`, { cx: `24`, cy: `28`, r: `4`, fill: `#ef4444` }),
        (0, U.jsx)(`circle`, { cx: `36`, cy: `28`, r: `4`, fill: `#eab308` }),
      ],
    }),
  Pi = ({ title: e, description: t, onClick: n, icon: r, accentColor: i, badge: a }) =>
    (0, U.jsxs)(`div`, {
      onClick: n,
      className: `group relative cursor-pointer transition-all duration-300 hover:-translate-y-1`,
      children: [
        (0, U.jsx)(`div`, {
          className: `absolute -inset-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`,
        }),
        (0, U.jsxs)(`div`, {
          className: `relative glass rounded-2xl p-4 sm:p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors`,
          children: [
            (0, U.jsxs)(`div`, {
              className: `flex items-start gap-4`,
              children: [
                (0, U.jsx)(`div`, {
                  className: `w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 text-${i}-500`,
                  children: (0, U.jsx)(r, {}),
                }),
                (0, U.jsxs)(`div`, {
                  className: `flex-1 min-w-0`,
                  children: [
                    (0, U.jsxs)(`div`, {
                      className: `flex items-center gap-2 mb-1`,
                      children: [
                        (0, U.jsx)(`h3`, {
                          className: `text-base sm:text-xl font-bold hand-drawn text-gray-800`,
                          children: e,
                        }),
                        a &&
                          (0, U.jsx)(`span`, {
                            className: `text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-bold`,
                            children: a,
                          }),
                      ],
                    }),
                    (0, U.jsx)(`p`, {
                      className: `text-[10px] sm:text-sm paper-font text-gray-500 leading-relaxed`,
                      children: t,
                    }),
                  ],
                }),
              ],
            }),
            (0, U.jsxs)(`div`, {
              className: `mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-400 group-hover:text-gray-600 transition-colors`,
              children: [
                (0, U.jsx)(di, { size: 12 }),
                (0, U.jsx)(`span`, { children: `Click to play` }),
                (0, U.jsx)(`svg`, {
                  className: `w-4 h-4 transform group-hover:translate-x-1 transition-transform`,
                  viewBox: `0 0 24 24`,
                  fill: `none`,
                  stroke: `currentColor`,
                  strokeWidth: `2`,
                  children: (0, U.jsx)(`path`, { d: `M5 12h14M12 5l7 7-7 7` }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  Fi = () => {
    let { playerName: e, setPlayerName: t } = Lr(),
      n = Re();
    return (
      (0, _.useEffect)(() => {
        e ||
          K.default
            .fire({
              title: `Welcome to PaperParty!`,
              text: `What is your name, player?`,
              input: `text`,
              inputPlaceholder: `Enter your name...`,
              allowOutsideClick: !1,
              confirmButtonText: `Let's Play!`,
              customClass: {
                popup: `glass rounded-3xl paper-font`,
                title: `hand-drawn text-3xl`,
                confirmButton: `bg-blue-500/80 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all`,
              },
              buttonsStyling: !1,
              inputValidator: (e) => {
                if (!e || !e.trim()) return `We need a name to start the party!`;
              },
            })
            .then((e) => {
              e.isConfirmed && t(e.value.trim());
            });
      }, [e, t]),
      (0, U.jsxs)(`div`, {
        className: `min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden`,
        children: [
          (0, U.jsx)(`div`, {
            className: `absolute inset-0 opacity-[0.03]`,
            style: {
              backgroundImage: `repeating-linear-gradient(transparent, transparent 23px, #333 24px)`,
              backgroundSize: `100% 24px`,
            },
          }),
          (0, U.jsx)(`div`, {
            className: `absolute top-4 left-4 w-32 h-32 text-gray-300 transform -rotate-12`,
            children: (0, U.jsx)(Qr, { size: 128, strokeWidth: 0.5 }),
          }),
          (0, U.jsx)(`div`, {
            className: `absolute bottom-4 right-4 w-24 h-24 text-gray-300 transform rotate-12`,
            children: (0, U.jsx)(hi, { size: 96, strokeWidth: 0.5 }),
          }),
          (0, U.jsx)(`div`, {
            className: `absolute top-1/4 right-8 w-16 h-16 text-gray-200 transform rotate-45`,
            children: (0, U.jsx)(Di, { size: 64, strokeWidth: 0.5 }),
          }),
          (0, U.jsx)(`div`, {
            className: `absolute bottom-1/4 left-8 w-12 h-12 text-gray-200 transform -rotate-30`,
            children: (0, U.jsx)(ei, { size: 48, strokeWidth: 0.5 }),
          }),
          (0, U.jsxs)(`div`, {
            className: `relative text-center mb-8 sm:mb-16`,
            children: [
              (0, U.jsx)(`h1`, {
                className: `text-4xl sm:text-6xl md:text-7xl lg:text-8xl hand-drawn mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600`,
                children: `PaperParty`,
              }),
              (0, U.jsxs)(`div`, {
                className: `flex items-center justify-center gap-2 text-gray-500`,
                children: [
                  (0, U.jsx)(di, { size: 14 }),
                  (0, U.jsx)(`p`, {
                    className: `text-xs sm:text-base paper-font max-w-2xl`,
                    children: `Multiplayer games that feel like the back of your notebook.`,
                  }),
                ],
              }),
              (0, U.jsx)(`div`, {
                className: `mt-3 flex items-center justify-center gap-2`,
                children: [...[, , , , ,]].map((e, t) =>
                  (0, U.jsx)(`div`, { className: `w-1.5 h-1.5 rounded-full bg-gray-300` }, t),
                ),
              }),
            ],
          }),
          (0, U.jsxs)(`div`, {
            className: `relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full px-2`,
            children: [
              (0, U.jsx)(Pi, {
                title: `Bingo`,
                description: `The classic 5x5 numbers game. Race to cross out your lines and shout BINGO!`,
                icon: Oi,
                accentColor: `purple`,
                onClick: () => n(`/bingo`),
              }),
              (0, U.jsx)(Pi, {
                title: `Tic Tac Toe`,
                description: `Strategize and outsmart your opponent in this timeless 3x3 battle.`,
                icon: ki,
                accentColor: `blue`,
                onClick: () => n(`/tictactoe`),
              }),
              (0, U.jsx)(Pi, {
                title: `Ultimate Tic-Tac-Toe`,
                description: `The mind-bending 9x9 grid where every move sends your opponent to a new battlefield!`,
                icon: Ai,
                accentColor: `green`,
                onClick: () => n(`/uttt`),
              }),
              (0, U.jsx)(Pi, {
                title: `Dots & Boxes`,
                description: `Connect the dots and claim boxes in this classic strategy game!`,
                icon: ji,
                accentColor: `orange`,
                onClick: () => n(`/dab`),
              }),
              (0, U.jsx)(Pi, {
                title: `SOS`,
                description: `Place S or O to form SOS patterns. Quick to learn, hard to master!`,
                icon: Mi,
                accentColor: `red`,
                onClick: () => n(`/sos`),
              }),
              (0, U.jsx)(Pi, {
                title: `Connect 4`,
                description: `Drop discs to get 4 in a row. Classic gravity gameplay with smooth animations!`,
                icon: Ni,
                accentColor: `yellow`,
                onClick: () => n(`/connect4`),
              }),
            ],
          }),
          e &&
            (0, U.jsxs)(`div`, {
              className: `relative mt-8 sm:mt-12 paper-font text-gray-500 glass px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-xs sm:text-base`,
              children: [
                (0, U.jsx)(`div`, {
                  className: `absolute -left-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center`,
                  children: (0, U.jsx)(Ti, { size: 12, className: `text-white` }),
                }),
                (0, U.jsx)(`span`, { children: `Playing as` }),
                (0, U.jsx)(`span`, { className: `font-bold text-blue-600`, children: e }),
              ],
            }),
          (0, U.jsxs)(`div`, {
            className: `absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-gray-300 text-xs`,
            children: [(0, U.jsx)(ei, { size: 6 }), (0, U.jsx)(ei, { size: 6 }), (0, U.jsx)(ei, { size: 6 })],
          }),
        ],
      })
    );
  },
  q = ({ children: e, onClick: t, disabled: n, className: r = ``, type: i = `button` }) =>
    (0, U.jsx)(`button`, {
      type: i,
      onClick: t,
      disabled: n,
      className: `sketch-button ${n ? `opacity-50 cursor-not-allowed` : ``} ${r}`,
      children: e,
    }),
  Ii = ({ children: e, className: t = `` }) => (0, U.jsx)(`div`, { className: `sketch-card ${t}`, children: e }),
  J = `sketch-popup`,
  Li = ({ onComplete: e }) => {
    let [t, n] = (0, _.useState)(3),
      r = (0, _.useRef)(!0);
    return (
      (0, _.useEffect)(
        () => () => {
          r.current = !1;
        },
        [],
      ),
      (0, _.useEffect)(() => {
        if (t === 0) {
          r.current && e?.();
          return;
        }
        let i = setTimeout(() => n((e) => e - 1), 1e3);
        return () => clearTimeout(i);
      }, [t, e]),
      t === 0
        ? null
        : (0, U.jsx)(`div`, {
            className: `fixed inset-0 bg-ink/40 flex items-center justify-center z-50`,
            children: (0, U.jsx)(
              `span`,
              {
                className: `text-9xl font-sketch text-paper animate-ping`,
                style: { animationDuration: `0.8s`, animationIterationCount: 1 },
                children: t,
              },
              t,
            ),
          })
    );
  },
  Ri = {
    cat: $r,
    dog: ti,
    bird: Zr,
    fish: ni,
    monkey: ci,
    panda: ui,
    frog: pi,
    tiger: _i,
    lion: $r,
    bear: ti,
    koala: ni,
    fox: Ci,
  },
  zi = Object.keys(Ri),
  Bi = [`#2a2a3e`, `#c73e1d`, `#2d4a8f`, `#2f5233`, `#7b2d8f`, `#b5651d`],
  Y = ({ avatarIcon: e, color: t, onAvatarChange: n, onColorChange: r }) =>
    (0, U.jsxs)(`div`, {
      className: `space-y-3`,
      children: [
        (0, U.jsx)(`div`, {
          className: `flex gap-2 justify-center flex-wrap`,
          children: zi.map((r) => {
            let i = Ri[r];
            return (0, U.jsx)(
              `button`,
              {
                onClick: () => n(r),
                className: `w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                ${e === r ? `border-ink scale-110` : `border-transparent hover:border-ink/40`}`,
                style: { backgroundColor: t },
                children: (0, U.jsx)(i, { size: 20, className: `text-white/90` }),
              },
              r,
            );
          }),
        }),
        (0, U.jsx)(`div`, {
          className: `flex gap-2 justify-center`,
          children: Bi.map((e) =>
            (0, U.jsx)(
              `button`,
              {
                onClick: () => r(e),
                style: { background: e },
                className: `w-6 h-6 rounded-full border-2 transition-all
              ${t === e ? `border-ink scale-110` : `border-transparent`}`,
              },
              e,
            ),
          ),
        }),
      ],
    }),
  Vi = ({ avatarIcon: e, color: t, size: n = 20 }) => {
    let r = Ri[e] || $r;
    return (0, U.jsx)(`div`, {
      className: `rounded-full flex items-center justify-center`,
      style: { backgroundColor: t, width: n, height: n },
      children: (0, U.jsx)(r, { size: n * 0.7, className: `text-white/90` }),
    });
  },
  Hi = ({
    gameName: e = `Game`,
    roomId: t,
    players: n = [],
    spectators: r = [],
    isHost: i,
    minPlayers: a = 2,
    canStart: o,
    onStart: s,
    onLeave: c,
    onJoinSubmit: l,
    showJoinInput: u = !1,
    customizationSlot: d,
    startLabel: f = `Start Game`,
    waitingLabel: p = `Waiting for players…`,
    showCountdown: m = !1,
    onCountdownComplete: h,
    profile: g = { name: ``, avatarIcon: `cat`, color: `#2a2a3e` },
    onProfileChange: v,
  }) => {
    let [y, b] = (0, _.useState)(``),
      [x] = (0, _.useState)(() => !!navigator.share),
      [S, C] = (0, _.useState)(!1),
      w = (0, _.useRef)(null),
      T = o ?? n.length >= a;
    (0, _.useEffect)(() => {
      if (n.length >= a) return;
      let e = setInterval(() => {
        b((e) => (e.length >= 3 ? `` : e + `.`));
      }, 500);
      return () => clearInterval(e);
    }, [n.length, a]);
    let E = async () => {
        try {
          await navigator.share({
            title: `Join my ${e} room!`,
            text: `Use room code: ${t}`,
            url: window.location.href,
          });
        } catch {}
      },
      D = async () => {
        try {
          (await navigator.clipboard.writeText(t), C(!0), setTimeout(() => C(!1), 1500));
        } catch {}
      },
      O = (e, t) => {
        v && v({ ...g, [e]: t });
      };
    return (0, U.jsxs)(`div`, {
      className: `min-h-screen bg-paper flex items-center justify-center p-4`,
      children: [
        m && (0, U.jsx)(Li, { onComplete: h }),
        (0, U.jsxs)(`div`, {
          className: `sketch-card p-8 max-w-sm w-full space-y-6`,
          children: [
            (0, U.jsx)(`h2`, { className: `text-2xl font-sketch text-center text-ink`, children: e }),
            (0, U.jsxs)(`div`, {
              className: `text-center`,
              children: [
                (0, U.jsx)(`p`, { className: `text-sm text-ink/60 paper-font`, children: `Room Code` }),
                (0, U.jsx)(`p`, { className: `text-3xl font-sketch text-ink tracking-widest`, children: t }),
                (0, U.jsx)(q, {
                  onClick: D,
                  className: `mt-2 text-sm`,
                  children: S ? `✓ Copied!` : `📋 Copy Room Code`,
                }),
              ],
            }),
            d && (0, U.jsx)(`div`, { className: `space-y-2 pt-2 border-t border-ink/10`, children: d }),
            (0, U.jsxs)(`div`, {
              className: `space-y-2`,
              children: [
                (0, U.jsx)(`p`, { className: `paper-font text-sm text-ink/60`, children: `Player Name (optional)` }),
                (0, U.jsx)(`input`, {
                  type: `text`,
                  value: g.name,
                  onChange: (e) => O(`name`, e.target.value),
                  placeholder: `Enter your name`,
                  className: `w-full px-3 py-2 border border-ink/30 rounded sketch-font text-ink bg-white/80`,
                }),
              ],
            }),
            (0, U.jsx)(Y, {
              avatarIcon: g.avatarIcon,
              color: g.color,
              onAvatarChange: (e) => O(`avatarIcon`, e),
              onColorChange: (e) => O(`color`, e),
            }),
            (0, U.jsx)(`div`, {
              className: `sketch-border text-center py-3`,
              style: { animation: T ? `none` : `sketch-wiggle 2s ease-in-out infinite` },
              children: T
                ? (0, U.jsx)(`span`, {
                    className: `paper-font text-green-700 font-semibold`,
                    children: `✅ Ready to start!`,
                  })
                : (0, U.jsxs)(`span`, {
                    className: `paper-font text-ink/70`,
                    children: [p || `Waiting for players`, y],
                  }),
            }),
            (0, U.jsxs)(`div`, {
              className: `space-y-2`,
              children: [
                (0, U.jsxs)(`p`, {
                  className: `paper-font text-sm text-ink/60`,
                  children: [`Players (`, n.length, `/`, a, ` min)`],
                }),
                n.map((e, t) =>
                  (0, U.jsxs)(
                    `div`,
                    {
                      className: `flex items-center gap-2 player-badge`,
                      style: { transform: `none`, border: `none`, padding: `0.25rem 0` },
                      children: [
                        (0, U.jsx)(`span`, { className: `text-lg`, children: e.connected === !1 ? `☐` : `☑️` }),
                        (0, U.jsx)(`span`, { className: `paper-font text-ink`, children: e.name }),
                        t === 0 &&
                          (0, U.jsx)(`span`, { className: `text-xs text-ink/50 ml-auto paper-font`, children: `host` }),
                      ],
                    },
                    e.id || t,
                  ),
                ),
                Array.from({ length: Math.max(0, a - n.length) }).map((e, t) =>
                  (0, U.jsxs)(
                    `div`,
                    {
                      className: `flex items-center gap-2`,
                      style: { opacity: 0.4 },
                      children: [
                        (0, U.jsx)(`span`, { className: `text-lg`, children: `☐` }),
                        (0, U.jsx)(`span`, { className: `paper-font text-ink/50`, children: `Waiting...` }),
                      ],
                    },
                    `empty-${t}`,
                  ),
                ),
              ],
            }),
            r.length > 0 &&
              (0, U.jsxs)(`div`, {
                className: `space-y-2 pt-2 border-t border-ink/10`,
                children: [
                  (0, U.jsxs)(`p`, {
                    className: `paper-font text-sm text-ink/60`,
                    children: [`Spectators (`, r.length, `)`],
                  }),
                  r.map((e, t) =>
                    (0, U.jsxs)(
                      `div`,
                      {
                        className: `flex items-center gap-2`,
                        style: { padding: `0.25rem 0` },
                        children: [
                          (0, U.jsx)(`span`, { className: `text-lg`, children: `👁️` }),
                          (0, U.jsx)(`span`, { className: `paper-font text-ink/70`, children: e.name }),
                        ],
                      },
                      e.id || t,
                    ),
                  ),
                ],
              }),
            u &&
              l &&
              (0, U.jsxs)(`div`, {
                className: `space-y-2`,
                children: [
                  (0, U.jsx)(`p`, { className: `paper-font text-sm text-ink/60`, children: `Join Existing Room` }),
                  (0, U.jsxs)(`div`, {
                    className: `flex gap-2`,
                    children: [
                      (0, U.jsx)(`input`, {
                        type: `text`,
                        placeholder: `Enter Room ID`,
                        className: `flex-1 px-3 py-2 border border-ink/30 rounded sketch-font text-ink bg-white/80`,
                        id: `join-room-input`,
                        ref: w,
                      }),
                      (0, U.jsx)(q, {
                        onClick: () => {
                          w.current?.value && l(w.current.value.trim().toUpperCase());
                        },
                        className: `text-sm`,
                        children: `Join`,
                      }),
                    ],
                  }),
                ],
              }),
            (0, U.jsxs)(`div`, {
              className: `space-y-2`,
              children: [
                x && (0, U.jsx)(q, { onClick: E, className: `w-full`, children: `📤 Invite Friends` }),
                u &&
                  (0, U.jsx)(`p`, {
                    className: `paper-font text-sm text-ink/50 text-center`,
                    children: `Enter room ID above to join`,
                  }),
                i &&
                  s &&
                  (0, U.jsx)(q, {
                    onClick: s,
                    disabled: !T,
                    className: `w-full`,
                    style: { opacity: T ? 1 : 0.5, cursor: T ? `pointer` : `not-allowed` },
                    children: T ? `🚀 ${f}` : `Need ${a - n.length} more player(s)`,
                  }),
                !i &&
                  s &&
                  (0, U.jsx)(`p`, {
                    className: `paper-font text-center text-sm text-ink/50`,
                    children: `Waiting for host to start…`,
                  }),
                (0, U.jsx)(q, {
                  onClick: c,
                  className: `w-full`,
                  style: { background: `#fff0f0` },
                  children: `Leave Room`,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Ui = [`#2a2a3e`, `#c73e1d`, `#2d4a8f`, `#2f5233`, `#7b2d8f`, `#b5651d`],
  Wi = ({ players: e, scores: t, currentTurn: n, myPlayerIndex: r, lastMove: i, orientation: a = `horizontal` }) => {
    if (!e || e.length === 0) return null;
    let o = a === `vertical` ? `flex flex-col gap-3` : `flex gap-3`,
      s = Array.isArray(t)
        ? t
        : e.map((e, n) => {
            if (t && typeof t == `object`) {
              if (n === 0 && t.X !== void 0) return t.X;
              if (n === 1 && t.O !== void 0) return t.O;
            }
            return t?.[n] || 0;
          });
    return (0, U.jsx)(`div`, {
      className: `sketch-card p-4 ${o}`,
      children: e.map((e, t) => {
        let a = n === e.id,
          o = i && i.playerIndex === t,
          c = e.color || Ui[t % Ui.length];
        return (0, U.jsxs)(
          `div`,
          {
            className: `flex items-center gap-2 p-2 rounded-lg transition-all ${a ? `ring-2 ring-yellow-400 bg-yellow-50` : ``}`,
            style: { transform: a ? `scale(1.03)` : void 0 },
            children: [
              (0, U.jsx)(Vi, { avatarIcon: e.avatarIcon || `cat`, color: c, size: 20 }),
              (0, U.jsxs)(`span`, {
                className: `font-handwriting text-sm text-ink flex-1 truncate`,
                children: [
                  e.name,
                  t === r && (0, U.jsx)(`span`, { className: `text-xs ml-1 opacity-60`, children: `(You)` }),
                ],
              }),
              s &&
                (0, U.jsx)(`span`, {
                  className: `font-sketch text-lg font-bold`,
                  style: { color: c },
                  children: s[t] || 0,
                }),
              a && (0, U.jsx)(Si, { size: 16, className: `text-yellow-500 animate-pulse` }),
              o && !a && (0, U.jsx)(`span`, { className: `w-3 h-3 rounded-full bg-yellow-400 animate-pulse` }),
            ],
          },
          e.id,
        );
      }),
    });
  },
  Gi = (0, _.createContext)(),
  Ki = () => {
    let e = (0, _.useContext)(Gi);
    if (!e) throw Error(`useTheme must be used within a ThemeProvider`);
    return e;
  },
  qi = ({ children: e }) => {
    let [t, n] = (0, _.useState)(() => localStorage.getItem(`theme`) || `light`);
    (0, _.useEffect)(() => {
      (localStorage.setItem(`theme`, t), document.documentElement.setAttribute(`data-theme`, t));
    }, [t]);
    let r = {
      theme: t,
      setTheme: n,
      toggleTheme: () => {
        n((e) => (e === `light` ? `dark` : `light`));
      },
      isDark: t === `dark`,
    };
    return (0, U.jsx)(Gi.Provider, { value: r, children: e });
  },
  Ji = () => {
    let { theme: e, toggleTheme: t } = Ki();
    return (0, U.jsx)(`button`, {
      onClick: t,
      className: `sketch-button p-2 rounded-full`,
      title: `Switch to ${e === `light` ? `dark` : `light`} theme`,
      children: e === `light` ? (0, U.jsx)(si, { size: 18 }) : (0, U.jsx)(vi, { size: 18 }),
    });
  },
  Yi = [
    { id: `thumbsup`, Icon: bi, label: `Like` },
    { id: `sparkles`, Icon: gi, label: `Nice` },
    { id: `flame`, Icon: ri, label: `Fire` },
    { id: `heart`, Icon: ai, label: `Love` },
    { id: `zap`, Icon: Di, label: `Wow` },
    { id: `party`, Icon: li, label: `Party` },
  ],
  Xi = ({ socket: e, roomId: t, gamePrefix: n, players: r }) => {
    let [i, a] = (0, _.useState)(!1),
      [o, s] = (0, _.useState)([]),
      [c, l] = (0, _.useState)(null);
    ((0, _.useEffect)(() => {
      let e = localStorage.getItem(`playerProfile`);
      e && l(JSON.parse(e));
    }, []),
      (0, _.useEffect)(() => {
        if (!e) return;
        let t = (e) => {
          let t = r.find((t) => t.id === e.playerId);
          s((n) => [...n, { ...e, playerName: t?.name || `Someone`, avatarIcon: t?.avatarIcon, color: t?.color }]);
        };
        return (e.on(`${n}_reaction`, t), () => e.off(`${n}_reaction`, t));
      }, [e, n, r]),
      (0, _.useEffect)(() => {
        if (o.length === 0) return;
        let e = setTimeout(() => {
          s((e) => e.slice(1));
        }, 3e3);
        return () => clearTimeout(e);
      }, [o]));
    let u = (r) => {
      !e || !t || e.emit(`game_reaction`, { roomId: t, reaction: r, gamePrefix: n });
    };
    return (0, U.jsxs)(`div`, {
      className: `fixed bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300`,
      onMouseEnter: () => a(!0),
      onMouseLeave: () => a(!1),
      onTouchStart: () => a(!0),
      children: [
        (0, U.jsx)(`div`, {
          className: `sketch-card p-2 flex gap-1 transition-all duration-300 ${i ? `opacity-100 translate-y-0` : `opacity-60 translate-y-2`}`,
          children: Yi.map((e) =>
            (0, U.jsx)(
              `button`,
              {
                onClick: () => u(e.id),
                className: `p-2 rounded-full hover:bg-gray-100 transition-all`,
                title: e.label,
                children: (0, U.jsx)(e.Icon, { size: 18, className: `text-ink` }),
              },
              e.id,
            ),
          ),
        }),
        (0, U.jsx)(`div`, {
          className: `absolute bottom-full left-0 flex flex-col gap-2 mb-2`,
          children: o.map((e, t) => {
            let n = Yi.find((t) => t.id === e.reaction)?.Icon;
            return (0, U.jsx)(
              `div`,
              {
                className: `sketch-card px-3 py-1 rounded-full animate-fade-in-up`,
                style: { animationDelay: `${t * 0.1}s` },
                children: (0, U.jsxs)(`div`, {
                  className: `flex items-center gap-2`,
                  children: [
                    e.avatarIcon && e.color
                      ? (0, U.jsx)(Vi, { avatarIcon: e.avatarIcon, color: e.color, size: 16 })
                      : null,
                    (0, U.jsx)(`span`, { className: `font-handwriting text-xs text-ink`, children: e.playerName }),
                    n && (0, U.jsx)(n, { size: 14, className: `text-ink` }),
                  ],
                }),
              },
              t,
            );
          }),
        }),
      ],
    });
  },
  Zi = ({ players: e = [], children: t }) => {
    let n = Re(),
      { socket: r, roomId: i, clearRoomId: a, gamePrefix: o } = Lr(),
      [s, c] = (0, _.useState)(``);
    return (0, U.jsxs)(`div`, {
      className: `min-h-screen bg-paper flex flex-col`,
      children: [
        (0, U.jsxs)(`nav`, {
          className: `flex items-center justify-between px-4 py-2 border-b border-ink/10`,
          children: [
            (0, U.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, U.jsx)(`button`, {
                  onClick: async () => {
                    (
                      await K.default.fire({
                        title: `Leave Game?`,
                        text: `Your progress will be lost.`,
                        icon: `warning`,
                        showCancelButton: !0,
                        confirmButtonText: `Leave`,
                        cancelButtonText: `Stay`,
                        customClass: { popup: `sketch-popup` },
                      })
                    ).isConfirmed && (o && i && r?.emit(`${o}_leaveRoom`, i), a(i), n(`/`));
                  },
                  'aria-label': `Back`,
                  className: `sketch-button text-red-600 hover:bg-red-50`,
                  children: (0, U.jsx)(Yr, { size: 20 }),
                }),
                (0, U.jsx)(Ji, {}),
              ],
            }),
            (0, U.jsx)(`button`, {
              onClick: async () => {
                try {
                  (await navigator.clipboard.writeText(i), c(`Copied!`), setTimeout(() => c(``), 1500));
                } catch {
                  (c(`Copy failed`), setTimeout(() => c(``), 1500));
                }
              },
              className: `font-sketch text-sm px-3 py-1 sketch-border rounded cursor-pointer hover:bg-ink/5`,
              title: `Click to copy room ID`,
              children: i,
            }),
            s && (0, U.jsx)(`span`, { className: `text-xs text-ink/70 ml-1`, children: s }),
            (0, U.jsx)(`div`, {
              className: `flex gap-1`,
              children: e.map((e) =>
                (0, U.jsx)(
                  `span`,
                  {
                    className: `w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-sketch`,
                    children: e.name.slice(0, 2),
                  },
                  e.id,
                ),
              ),
            }),
          ],
        }),
        (0, U.jsx)(`main`, { className: `flex-1 flex items-center justify-center p-4`, children: t }),
      ],
    });
  },
  Qi = ({ playerName: e, isActive: t, isMyTurn: n, turnTimer: r, isCurrentPlayer: i = !1 }) => {
    if (!e) return null;
    let a = e.slice(0, 2),
      o = r === null ? void 0 : r / 30;
    return (0, U.jsxs)(`div`, {
      className: `flex flex-col items-center gap-1`,
      children: [
        (0, U.jsx)(`div`, {
          className: `
          flex items-center justify-center w-12 h-12 rounded-full bg-ink text-paper
          font-sketch text-sm
          ${t ? `opacity-100` : `opacity-50`}
          ${n ? `animate-pulse ring-2 ring-ink/20` : ``}
          ${i && !n ? `ring-2 ring-yellow-400` : ``}
        `,
          'data-timer': o,
          children: a,
        }),
        (0, U.jsx)(`span`, { className: `paper-font text-xs text-ink/80`, children: e }),
        i && (0, U.jsx)(`span`, { className: `paper-font text-xs text-yellow-600`, children: `(You)` }),
      ],
    });
  },
  $i = ({ playerName: e, isActive: t, isMyTurn: n, turnTimer: r, players: i, currentTurn: a }) =>
    i && Array.isArray(i)
      ? (0, U.jsx)(`div`, {
          className: `flex gap-2`,
          children: i.map((e, t) => {
            let n = typeof a == `number` ? t === a : e.id === a;
            return (0, U.jsx)(Qi, { playerName: e.name, isActive: n, isMyTurn: n, isCurrentPlayer: n }, e.id);
          }),
        })
      : (0, U.jsx)(Qi, { playerName: e, isActive: t, isMyTurn: n, turnTimer: r }),
  ea = (e, t = []) =>
    e
      ? Array.isArray(e)
        ? e.map((e, n) => {
            let r = e,
              i = typeof r == `number` ? r : (r?.value ?? r?.score ?? 0);
            return { name: (typeof r == `object` && r?.name) || t[n]?.name || `Player ${n + 1}`, score: i };
          })
        : Object.entries(e).map(([e, n], r) => ({
            name: e,
            score: typeof n == `number` ? n : (n?.value ?? 0),
            ...(t[r] ? { profileName: t[r].name } : {}),
          }))
      : [],
  ta = ({ winner: e, isWinner: t, stats: n = {}, scores: r, onRematch: i, onNewRoom: a, players: o = [] }) => {
    let s = ea(r, o);
    return (0, U.jsxs)(Ii, {
      className: `p-6 max-w-sm w-full text-center`,
      children: [
        (() => {
          if (!s.length) return null;
          if (s.length === 2) {
            let [e, t] = s;
            return (0, U.jsxs)(`div`, {
              className: `flex justify-center items-center gap-6 mb-4`,
              children: [
                (0, U.jsxs)(`div`, {
                  className: `flex flex-col items-center`,
                  children: [
                    (0, U.jsx)(`span`, { className: `paper-font text-sm text-ink/70`, children: e.name }),
                    (0, U.jsx)(`span`, {
                      className: `font-sketch text-3xl ${e.score > t.score ? `text-yellow-600` : ``}`,
                      children: e.score,
                    }),
                  ],
                }),
                (0, U.jsx)(Xr, { size: 24, className: `text-ink/50` }),
                (0, U.jsxs)(`div`, {
                  className: `flex flex-col items-center`,
                  children: [
                    (0, U.jsx)(`span`, { className: `paper-font text-sm text-ink/70`, children: t.name }),
                    (0, U.jsx)(`span`, {
                      className: `font-sketch text-3xl ${t.score > e.score ? `text-yellow-600` : ``}`,
                      children: t.score,
                    }),
                  ],
                }),
              ],
            });
          }
          return (0, U.jsxs)(`div`, {
            className: `space-y-3 mb-4`,
            children: [
              (0, U.jsxs)(`div`, {
                className: `flex items-center justify-center gap-2 text-ink/70 mb-1`,
                children: [
                  (0, U.jsx)(Ei, { size: 18 }),
                  (0, U.jsx)(`span`, { className: `paper-font text-sm`, children: `Standings` }),
                ],
              }),
              (0, U.jsx)(`div`, {
                className: `grid grid-cols-2 sm:grid-cols-3 gap-2 justify-items-center`,
                children: s.map((e, t) => {
                  let n = Math.max(...s.map((e) => e.score)),
                    r = s.length > 1 && e.score === n;
                  return (0, U.jsxs)(
                    `div`,
                    {
                      className: `flex flex-col items-center p-2 rounded-lg border-2 ${r ? `border-yellow-400/70 bg-yellow-50/60` : `border-gray-200/70 bg-white/60`}`,
                      children: [
                        (0, U.jsx)(`span`, {
                          className: `paper-font text-xs text-ink/70 truncate max-w-[7rem]`,
                          children: e.name,
                        }),
                        (0, U.jsx)(`span`, {
                          className: `font-sketch text-3xl ${r ? `text-yellow-700` : ``}`,
                          children: e.score,
                        }),
                      ],
                    },
                    `${e.name}-${t}`,
                  );
                }),
              }),
            ],
          });
        })(),
        (() => {
          if (!e && !t && s.length > 1) {
            let e = Math.max(...s.map((e) => e.score)),
              t = s.filter((t) => t.score === e);
            if (t.length > 1)
              return (0, U.jsxs)(U.Fragment, {
                children: [
                  (0, U.jsx)(`div`, {
                    className: `flex justify-center mb-2`,
                    children: (0, U.jsx)(G, { size: 40, className: `text-gray-400` }),
                  }),
                  (0, U.jsx)(`h2`, { className: `text-2xl font-sketch mb-1 text-ink`, children: `It's a Tie!` }),
                  (0, U.jsx)(`p`, {
                    className: `paper-font text-sm text-ink/70`,
                    children: t.map((e) => e.name).join(` & `),
                  }),
                ],
              });
          }
          if (r && s.length > 1) {
            let e = Math.max(...s.map((e) => e.score)),
              t = s.find((t) => t.score === e);
            if (t) {
              let e = t.profileName || t.name;
              return (0, U.jsxs)(U.Fragment, {
                children: [
                  (0, U.jsx)(`div`, {
                    className: `flex justify-center mb-2`,
                    children: (0, U.jsx)(Si, { size: 40, className: `text-yellow-500` }),
                  }),
                  (0, U.jsxs)(`h2`, { className: `text-2xl font-sketch mb-1 text-ink`, children: [e, ` Wins!`] }),
                ],
              });
            }
          }
          return !e && !t
            ? (0, U.jsxs)(U.Fragment, {
                children: [
                  (0, U.jsx)(`div`, {
                    className: `flex justify-center mb-2`,
                    children: (0, U.jsx)(G, { size: 40, className: `text-gray-400` }),
                  }),
                  (0, U.jsx)(`h2`, { className: `text-2xl font-sketch mb-1 text-ink`, children: `It's a Tie!` }),
                ],
              })
            : t
              ? (0, U.jsxs)(U.Fragment, {
                  children: [
                    (0, U.jsx)(`div`, {
                      className: `flex justify-center mb-2`,
                      children: (0, U.jsx)(Si, { size: 40, className: `text-yellow-500` }),
                    }),
                    (0, U.jsx)(`h2`, { className: `text-2xl font-sketch mb-1 text-ink`, children: `You Win!` }),
                  ],
                })
              : (0, U.jsxs)(U.Fragment, {
                  children: [
                    (0, U.jsx)(`div`, {
                      className: `flex justify-center mb-2`,
                      children: (0, U.jsx)(Si, { size: 40, className: `text-yellow-500` }),
                    }),
                    (0, U.jsxs)(`h2`, { className: `text-2xl font-sketch mb-1 text-ink`, children: [e, ` Wins!`] }),
                  ],
                });
        })(),
        (n.moves || n.time) &&
          (0, U.jsxs)(`div`, {
            className: `text-sm font-handwriting text-ink/70 mb-4 space-y-1`,
            children: [
              n.moves && (0, U.jsxs)(`div`, { children: [`Moves: `, n.moves] }),
              n.time && (0, U.jsxs)(`div`, { children: [`Time: `, n.time] }),
            ],
          }),
        (0, U.jsxs)(`div`, {
          className: `flex gap-3 justify-center mt-4`,
          children: [
            i && (0, U.jsx)(q, { onClick: i, children: `Rematch` }),
            a && (0, U.jsx)(q, { onClick: a, children: `New Room` }),
          ],
        }),
      ],
    });
  },
  na = ({ requesterId: e, players: t = [], currentTurn: n, myPlayerIndex: r, onRequest: i, onAllow: a, onDeny: o }) => {
    let s = t.find((t) => t.id === e)?.name || `Someone`,
      [c, l] = (0, _.useState)(15);
    if (
      ((0, _.useEffect)(() => {
        if (!e) {
          l(0);
          return;
        }
        l(15);
        let t = setInterval(() => {
          l((e) => (e <= 1 ? (clearInterval(t), 0) : e - 1));
        }, 1e3);
        return () => clearInterval(t);
      }, [e]),
      !e)
    )
      return null;
    let u = r === n,
      d = (c / 15) * 100;
    return (0, U.jsxs)(Ii, {
      className: `p-4 bg-yellow-50`,
      children: [
        (0, U.jsxs)(`p`, {
          className: `font-handwriting text-ink mb-3`,
          children: [(0, U.jsx)(`span`, { className: `font-bold`, children: s }), ` wants to undo the last move`],
        }),
        (0, U.jsx)(`div`, {
          className: `w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden`,
          children: (0, U.jsx)(`div`, {
            className: `bg-yellow-500 h-2 rounded-full transition-all`,
            style: { width: `${d}%` },
          }),
        }),
        u &&
          (0, U.jsxs)(`div`, {
            className: `flex gap-2`,
            children: [
              (0, U.jsx)(q, { onClick: a, className: `flex-1 bg-green-50`, children: `Allow` }),
              (0, U.jsx)(q, { onClick: o, className: `flex-1 bg-red-50`, children: `Deny` }),
            ],
          }),
      ],
    });
  },
  ra = `modulepreload`,
  ia = function (e) {
    return `/` + e;
  },
  aa = {},
  oa = function (e, t, n) {
    let r = Promise.resolve();
    if (t && t.length > 0) {
      let e = document.getElementsByTagName(`link`),
        i = document.querySelector(`meta[property=csp-nonce]`),
        a = i?.nonce || i?.getAttribute(`nonce`);
      function o(e) {
        return Promise.all(
          e.map((e) =>
            Promise.resolve(e).then(
              (e) => ({ status: `fulfilled`, value: e }),
              (e) => ({ status: `rejected`, reason: e }),
            ),
          ),
        );
      }
      r = o(
        t.map((t) => {
          if (((t = ia(t, n)), t in aa)) return;
          aa[t] = !0;
          let r = t.endsWith(`.css`),
            i = r ? `[rel="stylesheet"]` : ``;
          if (n)
            for (let n = e.length - 1; n >= 0; n--) {
              let i = e[n];
              if (i.href === t && (!r || i.rel === `stylesheet`)) return;
            }
          else if (document.querySelector(`link[href="${t}"]${i}`)) return;
          let o = document.createElement(`link`);
          if (
            ((o.rel = r ? `stylesheet` : ra),
            r || (o.as = `script`),
            (o.crossOrigin = ``),
            (o.href = t),
            a && o.setAttribute(`nonce`, a),
            document.head.appendChild(o),
            r)
          )
            return new Promise((e, n) => {
              (o.addEventListener(`load`, e),
                o.addEventListener(`error`, () => n(Error(`Unable to preload CSS for ${t}`))));
            });
        }),
      );
    }
    function i(e) {
      let t = new Event(`vite:preloadError`, { cancelable: !0 });
      if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented)) throw e;
    }
    return r.then((t) => {
      for (let e of t || []) e.status === `rejected` && i(e.reason);
      return e().catch(i);
    });
  };
function sa() {
  return (
    (sa = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    sa.apply(null, arguments)
  );
}
function ca(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue;
      n[r] = e[r];
    }
  return n;
}
function la(e) {
  (0, _.useEffect)(e, []);
}
var ua = [`id`, `volume`, `playbackRate`, `soundEnabled`, `interrupt`, `onload`];
function da(e, t) {
  var n = t === void 0 ? {} : t,
    r = n.volume,
    i = r === void 0 ? 1 : r,
    a = n.playbackRate,
    o = a === void 0 ? 1 : a,
    s = n.soundEnabled,
    c = s === void 0 ? !0 : s,
    u = n.interrupt,
    d = u === void 0 ? !1 : u,
    f = n.onload,
    p = ca(n, ua),
    m = _.useRef(null),
    h = _.useRef(!1),
    g = _.useState(null),
    v = g[0],
    y = g[1],
    b = _.useState(null),
    x = b[0],
    S = b[1],
    C = function () {
      (typeof f == `function` && f.call(this), h.current && y(this.duration() * 1e3), S(this));
    };
  return (
    la(function () {
      return (
        oa(
          () =>
            import(`./howler-CMikgJ_F.js`)
              .then((e) => l(e.default))
              .then(function (t) {
                h.current ||
                  ((m.current = t.Howl ?? t.default.Howl),
                  (h.current = !0),
                  new m.current(sa({ src: Array.isArray(e) ? e : [e], volume: i, rate: o, onload: C }, p)));
              }),
          [],
        ),
        function () {
          h.current = !1;
        }
      );
    }),
    _.useEffect(
      function () {
        m.current && x && S(new m.current(sa({ src: Array.isArray(e) ? e : [e], volume: i, onload: C }, p)));
      },
      [JSON.stringify(e)],
    ),
    _.useEffect(
      function () {
        x && (x.volume(i), p.sprite || x.rate(o));
      },
      [x, i, o],
    ),
    [
      _.useCallback(
        function (e) {
          (e === void 0 && (e = {}),
            !(!x || (!c && !e.forceSoundEnabled)) &&
              (d && x.stop(), e.playbackRate && x.rate(e.playbackRate), x.play(e.id)));
        },
        [x, c, d],
      ),
      {
        sound: x,
        stop: _.useCallback(
          function (e) {
            x && x.stop(e);
          },
          [x],
        ),
        pause: _.useCallback(
          function (e) {
            x && x.pause(e);
          },
          [x],
        ),
        duration: v,
      },
    ]
  );
}
var fa = {};
(function e(t, n, r, i) {
  var a = !!(
      t.Worker &&
      t.Blob &&
      t.Promise &&
      t.OffscreenCanvas &&
      t.OffscreenCanvasRenderingContext2D &&
      t.HTMLCanvasElement &&
      t.HTMLCanvasElement.prototype.transferControlToOffscreen &&
      t.URL &&
      t.URL.createObjectURL
    ),
    o = typeof Path2D == `function` && typeof DOMMatrix == `function`,
    s = (function () {
      if (!t.OffscreenCanvas) return !1;
      try {
        var e = new OffscreenCanvas(1, 1),
          n = e.getContext(`2d`);
        n.fillRect(0, 0, 1, 1);
        var r = e.transferToImageBitmap();
        n.createPattern(r, `no-repeat`);
      } catch {
        return !1;
      }
      return !0;
    })();
  function c() {}
  function l(e) {
    var r = n.exports.Promise,
      i = r === void 0 ? t.Promise : r;
    return typeof i == `function` ? new i(e) : (e(c, c), null);
  }
  var u = (function (e, t) {
      return {
        transform: function (n) {
          if (e) return n;
          if (t.has(n)) return t.get(n);
          var r = new OffscreenCanvas(n.width, n.height);
          return (r.getContext(`2d`).drawImage(n, 0, 0), t.set(n, r), r);
        },
        clear: function () {
          t.clear();
        },
      };
    })(s, new Map()),
    d = (function () {
      var e = 16,
        t,
        n,
        r = {},
        i = 0;
      return (
        typeof requestAnimationFrame == `function` && typeof cancelAnimationFrame == `function`
          ? ((t = function (t) {
              var n = Math.random();
              return (
                (r[n] = requestAnimationFrame(function a(o) {
                  i === o || i + e - 1 < o ? ((i = o), delete r[n], t()) : (r[n] = requestAnimationFrame(a));
                })),
                n
              );
            }),
            (n = function (e) {
              r[e] && cancelAnimationFrame(r[e]);
            }))
          : ((t = function (t) {
              return setTimeout(t, e);
            }),
            (n = function (e) {
              return clearTimeout(e);
            })),
        { frame: t, cancel: n }
      );
    })(),
    f = (function () {
      var t,
        n,
        i = {};
      function o(e) {
        function t(t, n) {
          e.postMessage({ options: t || {}, callback: n });
        }
        ((e.init = function (t) {
          var n = t.transferControlToOffscreen();
          e.postMessage({ canvas: n }, [n]);
        }),
          (e.fire = function (r, a, o) {
            if (n) return (t(r, null), n);
            var s = Math.random().toString(36).slice(2);
            return (
              (n = l(function (a) {
                function c(t) {
                  t.data.callback === s &&
                    (delete i[s], e.removeEventListener(`message`, c), (n = null), u.clear(), o(), a());
                }
                (e.addEventListener(`message`, c), t(r, s), (i[s] = c.bind(null, { data: { callback: s } })));
              })),
              n
            );
          }),
          (e.reset = function () {
            for (var t in (e.postMessage({ reset: !0 }), i)) (i[t](), delete i[t]);
          }));
      }
      return function () {
        if (t) return t;
        if (!r && a) {
          var n = [
            `var CONFETTI, SIZE = {}, module = {};`,
            `(` + e.toString() + `)(this, module, true, SIZE);`,
            `onmessage = function(msg) {`,
            `  if (msg.data.options) {`,
            `    CONFETTI(msg.data.options).then(function () {`,
            `      if (msg.data.callback) {`,
            `        postMessage({ callback: msg.data.callback });`,
            `      }`,
            `    });`,
            `  } else if (msg.data.reset) {`,
            `    CONFETTI && CONFETTI.reset();`,
            `  } else if (msg.data.resize) {`,
            `    SIZE.width = msg.data.resize.width;`,
            `    SIZE.height = msg.data.resize.height;`,
            `  } else if (msg.data.canvas) {`,
            `    SIZE.width = msg.data.canvas.width;`,
            `    SIZE.height = msg.data.canvas.height;`,
            `    CONFETTI = module.exports.create(msg.data.canvas);`,
            `  }`,
            `}`,
          ].join(`
`);
          try {
            t = new Worker(URL.createObjectURL(new Blob([n])));
          } catch (e) {
            return (
              typeof console < `u` && typeof console.warn == `function` && console.warn(`🎊 Could not load worker`, e),
              null
            );
          }
          o(t);
        }
        return t;
      };
    })(),
    p = {
      particleCount: 50,
      angle: 90,
      spread: 45,
      startVelocity: 45,
      decay: 0.9,
      gravity: 1,
      drift: 0,
      ticks: 200,
      x: 0.5,
      y: 0.5,
      shapes: [`square`, `circle`],
      zIndex: 100,
      colors: [`#26ccff`, `#a25afd`, `#ff5e7e`, `#88ff5a`, `#fcff42`, `#ffa62d`, `#ff36ff`],
      disableForReducedMotion: !1,
      scalar: 1,
    };
  function m(e, t) {
    return t ? t(e) : e;
  }
  function h(e) {
    return e != null;
  }
  function g(e, t, n) {
    return m(e && h(e[t]) ? e[t] : p[t], n);
  }
  function _(e) {
    return e < 0 ? 0 : Math.floor(e);
  }
  function v(e, t) {
    return Math.floor(Math.random() * (t - e)) + e;
  }
  function y(e) {
    return parseInt(e, 16);
  }
  function b(e) {
    return e.map(x);
  }
  function x(e) {
    var t = String(e).replace(/[^0-9a-f]/gi, ``);
    return (
      t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]),
      { r: y(t.substring(0, 2)), g: y(t.substring(2, 4)), b: y(t.substring(4, 6)) }
    );
  }
  function S(e) {
    var t = g(e, `origin`, Object);
    return ((t.x = g(t, `x`, Number)), (t.y = g(t, `y`, Number)), t);
  }
  function C(e) {
    ((e.width = document.documentElement.clientWidth), (e.height = document.documentElement.clientHeight));
  }
  function w(e) {
    var t = e.getBoundingClientRect();
    ((e.width = t.width), (e.height = t.height));
  }
  function T(e) {
    var t = document.createElement(`canvas`);
    return (
      (t.style.position = `fixed`),
      (t.style.top = `0px`),
      (t.style.left = `0px`),
      (t.style.pointerEvents = `none`),
      (t.style.zIndex = e),
      t
    );
  }
  function E(e, t, n, r, i, a, o, s, c) {
    (e.save(), e.translate(t, n), e.rotate(a), e.scale(r, i), e.arc(0, 0, 1, o, s, c), e.restore());
  }
  function D(e) {
    var t = e.angle * (Math.PI / 180),
      n = e.spread * (Math.PI / 180);
    return {
      x: e.x,
      y: e.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: e.startVelocity * 0.5 + Math.random() * e.startVelocity,
      angle2D: -t + (0.5 * n - Math.random() * n),
      tiltAngle: (Math.random() * 0.5 + 0.25) * Math.PI,
      color: e.color,
      shape: e.shape,
      tick: 0,
      totalTicks: e.ticks,
      decay: e.decay,
      drift: e.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: e.gravity * 3,
      ovalScalar: 0.6,
      scalar: e.scalar,
      flat: e.flat,
    };
  }
  function O(e, t) {
    ((t.x += Math.cos(t.angle2D) * t.velocity + t.drift),
      (t.y += Math.sin(t.angle2D) * t.velocity + t.gravity),
      (t.velocity *= t.decay),
      t.flat
        ? ((t.wobble = 0),
          (t.wobbleX = t.x + 10 * t.scalar),
          (t.wobbleY = t.y + 10 * t.scalar),
          (t.tiltSin = 0),
          (t.tiltCos = 0),
          (t.random = 1))
        : ((t.wobble += t.wobbleSpeed),
          (t.wobbleX = t.x + 10 * t.scalar * Math.cos(t.wobble)),
          (t.wobbleY = t.y + 10 * t.scalar * Math.sin(t.wobble)),
          (t.tiltAngle += 0.1),
          (t.tiltSin = Math.sin(t.tiltAngle)),
          (t.tiltCos = Math.cos(t.tiltAngle)),
          (t.random = Math.random() + 2)));
    var n = t.tick++ / t.totalTicks,
      r = t.x + t.random * t.tiltCos,
      i = t.y + t.random * t.tiltSin,
      a = t.wobbleX + t.random * t.tiltCos,
      s = t.wobbleY + t.random * t.tiltSin;
    if (
      ((e.fillStyle = `rgba(` + t.color.r + `, ` + t.color.g + `, ` + t.color.b + `, ` + (1 - n) + `)`),
      e.beginPath(),
      o && t.shape.type === `path` && typeof t.shape.path == `string` && Array.isArray(t.shape.matrix))
    )
      e.fill(
        ee(
          t.shape.path,
          t.shape.matrix,
          t.x,
          t.y,
          Math.abs(a - r) * 0.1,
          Math.abs(s - i) * 0.1,
          (Math.PI / 10) * t.wobble,
        ),
      );
    else if (t.shape.type === `bitmap`) {
      var c = (Math.PI / 10) * t.wobble,
        l = Math.abs(a - r) * 0.1,
        d = Math.abs(s - i) * 0.1,
        f = t.shape.bitmap.width * t.scalar,
        p = t.shape.bitmap.height * t.scalar,
        m = new DOMMatrix([Math.cos(c) * l, Math.sin(c) * l, -Math.sin(c) * d, Math.cos(c) * d, t.x, t.y]);
      m.multiplySelf(new DOMMatrix(t.shape.matrix));
      var h = e.createPattern(u.transform(t.shape.bitmap), `no-repeat`);
      (h.setTransform(m),
        (e.globalAlpha = 1 - n),
        (e.fillStyle = h),
        e.fillRect(t.x - f / 2, t.y - p / 2, f, p),
        (e.globalAlpha = 1));
    } else if (t.shape === `circle`)
      e.ellipse
        ? e.ellipse(
            t.x,
            t.y,
            Math.abs(a - r) * t.ovalScalar,
            Math.abs(s - i) * t.ovalScalar,
            (Math.PI / 10) * t.wobble,
            0,
            2 * Math.PI,
          )
        : E(
            e,
            t.x,
            t.y,
            Math.abs(a - r) * t.ovalScalar,
            Math.abs(s - i) * t.ovalScalar,
            (Math.PI / 10) * t.wobble,
            0,
            2 * Math.PI,
          );
    else if (t.shape === `star`)
      for (
        var g = (Math.PI / 2) * 3, _ = 4 * t.scalar, v = 8 * t.scalar, y = t.x, b = t.y, x = 5, S = Math.PI / x;
        x--;
      )
        ((y = t.x + Math.cos(g) * v),
          (b = t.y + Math.sin(g) * v),
          e.lineTo(y, b),
          (g += S),
          (y = t.x + Math.cos(g) * _),
          (b = t.y + Math.sin(g) * _),
          e.lineTo(y, b),
          (g += S));
    else
      (e.moveTo(Math.floor(t.x), Math.floor(t.y)),
        e.lineTo(Math.floor(t.wobbleX), Math.floor(i)),
        e.lineTo(Math.floor(a), Math.floor(s)),
        e.lineTo(Math.floor(r), Math.floor(t.wobbleY)));
    return (e.closePath(), e.fill(), t.tick < t.totalTicks);
  }
  function k(e, t, n, a, o) {
    var s = t.slice(),
      c = e.getContext(`2d`),
      f,
      p,
      m = l(function (t) {
        function l() {
          ((f = p = null), c.clearRect(0, 0, a.width, a.height), u.clear(), o(), t());
        }
        function m() {
          (r &&
            !(a.width === i.width && a.height === i.height) &&
            ((a.width = e.width = i.width), (a.height = e.height = i.height)),
            !a.width && !a.height && (n(e), (a.width = e.width), (a.height = e.height)),
            c.clearRect(0, 0, a.width, a.height),
            (s = s.filter(function (e) {
              return O(c, e);
            })),
            s.length ? (f = d.frame(m)) : l());
        }
        ((f = d.frame(m)), (p = l));
      });
    return {
      addFettis: function (e) {
        return ((s = s.concat(e)), m);
      },
      canvas: e,
      promise: m,
      reset: function () {
        (f && d.cancel(f), p && p());
      },
    };
  }
  function A(e, n) {
    var r = !e,
      i = !!g(n || {}, `resize`),
      o = !1,
      s = g(n, `disableForReducedMotion`, Boolean),
      c = a && g(n || {}, `useWorker`) ? f() : null,
      u = r ? C : w,
      d = e && c ? !!e.__confetti_initialized : !1,
      p = typeof matchMedia == `function` && matchMedia(`(prefers-reduced-motion)`).matches,
      m;
    function h(t, n, r) {
      for (
        var i = g(t, `particleCount`, _),
          a = g(t, `angle`, Number),
          o = g(t, `spread`, Number),
          s = g(t, `startVelocity`, Number),
          c = g(t, `decay`, Number),
          l = g(t, `gravity`, Number),
          d = g(t, `drift`, Number),
          f = g(t, `colors`, b),
          p = g(t, `ticks`, Number),
          h = g(t, `shapes`),
          y = g(t, `scalar`),
          x = !!g(t, `flat`),
          C = S(t),
          w = i,
          T = [],
          E = e.width * C.x,
          O = e.height * C.y;
        w--;
      )
        T.push(
          D({
            x: E,
            y: O,
            angle: a,
            spread: o,
            startVelocity: s,
            color: f[w % f.length],
            shape: h[v(0, h.length)],
            ticks: p,
            decay: c,
            gravity: l,
            drift: d,
            scalar: y,
            flat: x,
          }),
        );
      return m ? m.addFettis(T) : ((m = k(e, T, u, n, r)), m.promise);
    }
    function y(n) {
      var a = s || g(n, `disableForReducedMotion`, Boolean),
        f = g(n, `zIndex`, Number);
      if (a && p)
        return l(function (e) {
          e();
        });
      (r && m ? (e = m.canvas) : r && !e && ((e = T(f)), document.body.appendChild(e)), i && !d && u(e));
      var _ = { width: e.width, height: e.height };
      (c && !d && c.init(e), (d = !0), c && (e.__confetti_initialized = !0));
      function v() {
        if (c) {
          var t = {
            getBoundingClientRect: function () {
              if (!r) return e.getBoundingClientRect();
            },
          };
          (u(t), c.postMessage({ resize: { width: t.width, height: t.height } }));
          return;
        }
        _.width = _.height = null;
      }
      function y() {
        ((m = null),
          i && ((o = !1), t.removeEventListener(`resize`, v)),
          r && e && (document.body.contains(e) && document.body.removeChild(e), (e = null), (d = !1)));
      }
      return (i && !o && ((o = !0), t.addEventListener(`resize`, v, !1)), c ? c.fire(n, _, y) : h(n, _, y));
    }
    return (
      (y.reset = function () {
        (c && c.reset(), m && m.reset());
      }),
      y
    );
  }
  var j;
  function M() {
    return ((j ||= A(null, { useWorker: !0, resize: !0 })), j);
  }
  function ee(e, t, n, r, i, a, o) {
    var s = new Path2D(e),
      c = new Path2D();
    c.addPath(s, new DOMMatrix(t));
    var l = new Path2D();
    return (
      l.addPath(c, new DOMMatrix([Math.cos(o) * i, Math.sin(o) * i, -Math.sin(o) * a, Math.cos(o) * a, n, r])),
      l
    );
  }
  function N(e) {
    if (!o) throw Error(`path confetti are not supported in this browser`);
    var t, n;
    typeof e == `string` ? (t = e) : ((t = e.path), (n = e.matrix));
    var r = new Path2D(t),
      i = document.createElement(`canvas`).getContext(`2d`);
    if (!n) {
      for (var a = 1e3, s = a, c = a, l = 0, u = 0, d, f, p = 0; p < a; p += 2)
        for (var m = 0; m < a; m += 2)
          i.isPointInPath(r, p, m, `nonzero`) &&
            ((s = Math.min(s, p)), (c = Math.min(c, m)), (l = Math.max(l, p)), (u = Math.max(u, m)));
      ((d = l - s), (f = u - c));
      var h = 10,
        g = Math.min(h / d, h / f);
      n = [g, 0, 0, g, -Math.round(d / 2 + s) * g, -Math.round(f / 2 + c) * g];
    }
    return { type: `path`, path: t, matrix: n };
  }
  function P(e) {
    var t,
      n = 1,
      r = `#000000`,
      i = `"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif`;
    typeof e == `string`
      ? (t = e)
      : ((t = e.text),
        (n = `scalar` in e ? e.scalar : n),
        (i = `fontFamily` in e ? e.fontFamily : i),
        (r = `color` in e ? e.color : r));
    var a = 10 * n,
      o = `` + a + `px ` + i,
      s = new OffscreenCanvas(a, a),
      c = s.getContext(`2d`);
    c.font = o;
    var l = c.measureText(t),
      u = Math.ceil(l.actualBoundingBoxRight + l.actualBoundingBoxLeft),
      d = Math.ceil(l.actualBoundingBoxAscent + l.actualBoundingBoxDescent),
      f = 2,
      p = l.actualBoundingBoxLeft + f,
      m = l.actualBoundingBoxAscent + f;
    ((u += f + f),
      (d += f + f),
      (s = new OffscreenCanvas(u, d)),
      (c = s.getContext(`2d`)),
      (c.font = o),
      (c.fillStyle = r),
      c.fillText(t, p, m));
    var h = 1 / n;
    return { type: `bitmap`, bitmap: s.transferToImageBitmap(), matrix: [h, 0, 0, h, (-u * h) / 2, (-d * h) / 2] };
  }
  ((n.exports = function () {
    return M().apply(this, arguments);
  }),
    (n.exports.reset = function () {
      M().reset();
    }),
    (n.exports.create = A),
    (n.exports.shapeFromPath = N),
    (n.exports.shapeFromText = P));
})(
  (function () {
    return typeof window < `u` ? window : typeof self < `u` ? self : this || {};
  })(),
  fa,
  !1,
);
var pa = fa.exports;
fa.exports.create;
var ma = (e, t = {}) => {
    let n = (0, _.useRef)(t);
    ((n.current = t),
      (0, _.useEffect)(() => {
        if (!e) return;
        let t = {};
        return (
          Object.entries(n.current).forEach(([r]) => {
            let i = (...e) => {
              try {
                let t = n.current[r];
                if (!t) return;
                let i = t(...e);
                i && typeof i.then == `function` && i.catch((e) => Pr(`Socket event ${r}`, e));
              } catch (e) {
                Pr(`Socket event ${r}`, e);
              }
            };
            ((t[r] = i), e.on(r, i));
          }),
          () => {
            Object.entries(t).forEach(([t, n]) => {
              e.off(t, n);
            });
          }
        );
      }, [e]));
  },
  ha = ({ socket: e, gamePrefix: t, onRestore: n }) => {
    let r = (0, _.useRef)(!1);
    return (
      (0, _.useEffect)(() => {
        if (!e) return;
        let n = `${t}_reconnect`,
          i = sessionStorage.getItem(n);
        if (i && !r.current) {
          r.current = !0;
          try {
            let n = JSON.parse(i);
            e.emit(`${t}_reconnect`, { roomId: n.roomId, playerId: n.playerId });
          } catch {}
        }
      }, [e, t]),
      (0, _.useEffect)(() => {
        if (!e) return;
        let r = (t) => {
          if (e.id && t.players) {
            let r = t.players.find((t) => t.id === e.id) || t.players[t.currentTurn];
            r && n && n(t, r);
          }
        };
        return (e.on(`${t}_roomInfo`, r), () => e.off(`${t}_roomInfo`, r));
      }, [e, t, n]),
      {
        clearReconnect: () => {
          sessionStorage.removeItem(`${t}_reconnect`);
        },
      }
    );
  },
  ga = [`#2a2a3e`, `#c73e1d`, `#2d4a8f`, `#2f5233`],
  _a = () => {
    let { socket: e, roomId: t, setRoomId: n, clearRoomId: r, profile: i, setProfile: a, setGamePrefix: o } = Lr(),
      [s, c] = (0, _.useState)(Array.from({ length: 25 }, (e, t) => t + 1)),
      [l, u] = (0, _.useState)([]),
      [d, f] = (0, _.useState)(`waiting`),
      [p, m] = (0, _.useState)(null),
      [h, g] = (0, _.useState)(!1),
      [v, y] = (0, _.useState)(``),
      [b, x] = (0, _.useState)(30),
      S = Re(),
      C = (0, _.useRef)([]),
      w = (0, _.useRef)(null),
      [T] = da(`/sounds/pop.mp3`, { volume: 0.5 }),
      [E] = da(`/sounds/turn.mp3`, { volume: 0.6 }),
      D = (0, _.useCallback)((e) => {
        let t = [];
        for (let e = 0; e < 5; e++) t.push(Array.from({ length: 5 }, (t, n) => e * 5 + n));
        for (let e = 0; e < 5; e++) t.push(Array.from({ length: 5 }, (t, n) => e + n * 5));
        (t.push(Array.from({ length: 5 }, (e, t) => t * 5 + t)),
          t.push(Array.from({ length: 5 }, (e, t) => (t + 1) * 5 - (t + 1))));
        let n = t.filter((t) => t.every((t) => typeof e[t] == `string`)).length;
        return `BINGO`.slice(0, Math.min(n, 5));
      }, []),
      { clearReconnect: O } = ha({
        socket: e,
        gamePrefix: `bingo`,
        roomId: t,
        onRestore: (t) => {
          t && (n(t.id), u(t.players || []), f(t.gameState || `waiting`), m(t.currentTurn), g(t.creator === e.id));
        },
      });
    (ma(
      e,
      {
        bingo_roomInfo: ({ id: t, creator: r, players: i, gameState: a, currentTurn: o, strikedNumbers: s }) => {
          (n(t), u(i), f(a), m(o), g(r === e.id));
          try {
            let e = localStorage.getItem(`bingo_board_${t}`);
            e && c(JSON.parse(e));
          } catch {
            localStorage.removeItem(`bingo_board_${t}`);
          }
          s && (C.current = s);
        },
        bingo_playerBoard: ({ board: e }) => {
          let t = C.current;
          c(t.length > 0 ? e.map((e) => (t.includes(e) ? `X` : e)) : e);
        },
        bingo_gamePaused: ({ reason: e }) => {
          K.default.fire({ title: `Game Paused`, text: e, icon: `warning`, customClass: { popup: J } });
        },
        bingo_gameStarted: ({ firstPlayerId: t, playerBoards: n }) => {
          (f(`playing`),
            m(t),
            x(30),
            y(``),
            n?.[e.id] && c(n[e.id]),
            K.default.fire({
              title: `Eyes Down!`,
              text: `Bingo has started!`,
              timer: 1500,
              showConfirmButton: !1,
              customClass: { popup: J },
            }));
        },
        bingo_gameRestarted: () => {
          (f(`ready`), y(``), c(Array.from({ length: 25 }, (e, t) => t + 1)));
        },
        bingo_numberMarked: ({ nextTurn: e, strikedNumbers: t }) => {
          (c((e) => e.map((e) => (t.includes(e) ? `X` : e))), m(e), T());
        },
        bingo_nextTurn: ({ nextPlayerId: t, timestamp: n }) => {
          m(t);
          let r = Math.floor((Date.now() - n) / 1e3);
          (x(Math.max(0, 30 - r)), t === e.id && E());
        },
        bingo_playerWon: ({ winner: e }) => {
          pa({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: [l.find((t) => t.id === e)?.color || `#2a2a3e`],
          });
          let t = l.find((t) => t.id === e)?.name || `Someone`;
          (K.default.fire({
            title: `BINGO!`,
            text: `${t} has achieved Bingo!`,
            icon: `success`,
            customClass: { popup: J },
          }),
            f(`ended`),
            O());
        },
        bingo_playerLeft: (e) => {
          K.default.fire({
            title: `Player Left`,
            text: `A player has left the game.`,
            icon: `warning`,
            customClass: { popup: J },
          });
        },
        bingo_alert: ({ icon: e, title: t, text: n }) => {
          t === `Room Created`
            ? K.default.fire({
                icon: e,
                title: t,
                text: n,
                timer: 2e3,
                showConfirmButton: !1,
                customClass: { popup: J },
              })
            : K.default.fire({ icon: e, title: t, text: n, customClass: { popup: J } });
        },
        server_shutdown: ({ message: e }) => {
          K.default
            .fire({
              title: `Server Shutting Down`,
              text: e || `The server is going down for maintenance.`,
              icon: `info`,
              customClass: { popup: J },
            })
            .then(() => {
              (O(), r(t), S(`/`));
            });
        },
      },
      [t, l, T, E, n, O, r, S],
    ),
      (0, _.useEffect)(() => {
        if (!e) return;
        o(`bingo`);
        let r = sessionStorage.getItem(`bingo_reconnect`),
          i = r && !t;
        if (i) {
          let { roomId: t, playerId: i } = JSON.parse(r);
          (e.emit(`bingo_reconnect`, { roomId: t, playerId: i }), n(t));
        }
        t && !i && e.emit(`bingo_requestRoomInfo`, t);
      }, [e, t, o, n]),
      (0, _.useEffect)(() => {
        if (d !== `playing` || s.length !== 25) return;
        let n = D(s);
        n.length > v.length && (y(n), n === `BINGO` && e.emit(`bingo_achieved`, t));
      }, [e, s, d, v, D, t]),
      (0, _.useEffect)(
        () => (
          w.current && clearInterval(w.current),
          d === `playing` &&
            p === e?.id &&
            b > 0 &&
            (w.current = setInterval(() => {
              x((e) => e - 1);
            }, 1e3)),
          () => {
            w.current && clearInterval(w.current);
          }
        ),
        [d, p, e?.id],
      ));
    let k = (0, _.useCallback)(
        (n) => {
          d === `playing` &&
            p === e?.id &&
            typeof n != `string` &&
            e.emit(`bingo_markNumber`, { roomId: t, number: n });
        },
        [d, p, t, e],
      ),
      A = (0, _.useCallback)(() => {
        e.emit(`bingo_createRoom`, { creatorName: i.name, avatarIcon: i.avatarIcon, color: i.color });
      }, [e, i]),
      j = (0, _.useCallback)(async () => {
        let { value: t } = await K.default.fire({
          title: `Join Bingo Room`,
          input: `text`,
          inputPlaceholder: `Enter Room ID`,
          showCancelButton: !0,
          customClass: { popup: J },
        });
        t &&
          e.emit(`bingo_joinRoom`, {
            roomId: t.toUpperCase(),
            playerName: i.name,
            avatarIcon: i.avatarIcon,
            color: i.color,
          });
      }, [e, i]),
      M = (0, _.useCallback)(() => {
        if (l.length < 2) {
          K.default.fire({ title: `Wait!`, text: `Need at least 2 players!`, icon: `info` });
          return;
        }
        e.emit(`bingo_startGame`, t);
      }, [e, t, l.length]),
      ee = (0, _.useCallback)(async () => {
        (
          await K.default.fire({
            title: `Leave Game?`,
            text: `Are you sure you want to leave?`,
            icon: `warning`,
            showCancelButton: !0,
            confirmButtonText: `Yes, leave`,
            customClass: { popup: `sketch-popup` },
          })
        ).isConfirmed && (e.emit(`bingo_leaveRoom`, t), O(), r(t), S(`/`));
      }, [e, t, O, r, S]);
    return (0, U.jsxs)(Zi, {
      players: l,
      children: [
        (0, U.jsxs)(`div`, {
          className: `flex flex-col items-center justify-center p-4 w-full`,
          children: [
            (0, U.jsx)(`h1`, { className: `text-6xl font-sketch mb-8 text-ink`, children: `Bingo Party` }),
            t
              ? (0, U.jsxs)(`div`, {
                  className: `w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start`,
                  children: [
                    (0, U.jsxs)(`div`, {
                      className: `flex-1 w-full`,
                      children: [
                        (0, U.jsxs)(Ii, {
                          className: `p-4 mb-8 flex justify-between items-center`,
                          children: [
                            (0, U.jsxs)(`div`, {
                              className: `font-handwriting text-ink flex items-center gap-2`,
                              children: [
                                (0, U.jsx)(yi, { size: 18, className: `text-ink` }),
                                `Room: `,
                                (0, U.jsx)(`span`, { className: `font-bold text-ink uppercase`, children: t }),
                              ],
                            }),
                            (0, U.jsx)(`div`, {
                              className: `flex gap-2`,
                              children: `BINGO`.split(``).map((e, t) =>
                                (0, U.jsx)(
                                  `span`,
                                  {
                                    className: `w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all duration-500
                    ${t < v.length ? `bg-green-500 text-white scale-110 shadow-lg` : `bg-gray-200 text-gray-400`}`,
                                    children: e,
                                  },
                                  t,
                                ),
                              ),
                            }),
                          ],
                        }),
                        (0, U.jsx)(`div`, {
                          className: `grid grid-cols-5 gap-2 md:gap-4 aspect-square`,
                          children: s.map((t, n) =>
                            (0, U.jsx)(
                              `button`,
                              {
                                onClick: () => k(t),
                                disabled: typeof t == `string` || d !== `playing` || p !== e?.id,
                                className: `text-xl md:text-3xl font-handwriting flex items-center justify-center transition-all duration-300 rounded-xl
                    ${typeof t == `string` ? `bg-green-500 text-white rotate-12 animate-pulse` : `hover:bg-gray-100 cursor-pointer`}
                    ${d === `playing` && p === e?.id && typeof t != `string` ? `ring-2 ring-ink ring-offset-2` : ``}
                    sketch-border`,
                                style: {
                                  color: typeof t == `string` ? `#fff` : `#2a2a3e`,
                                  backgroundColor: typeof t == `string` ? `#22c55e` : `#fffef9`,
                                },
                                children: typeof t == `string` ? `★` : t,
                              },
                              n,
                            ),
                          ),
                        }),
                      ],
                    }),
                    (0, U.jsxs)(`div`, {
                      className: `w-full md:w-64 flex flex-col gap-6`,
                      children: [
                        (0, U.jsxs)(Ii, {
                          className: `p-6`,
                          children: [
                            (0, U.jsxs)(`h3`, {
                              className: `font-sketch text-2xl mb-4 flex items-center gap-2`,
                              children: [(0, U.jsx)(Ei, { size: 24, className: `text-ink` }), `Players`],
                            }),
                            (0, U.jsx)(`div`, {
                              className: `flex flex-col gap-3`,
                              children: l.map((t, n) =>
                                (0, U.jsx)(
                                  `div`,
                                  {
                                    className: `flex items-center justify-between p-2 rounded border-2 border-dashed ${t.id === p && d === `playing` ? `border-current bg-yellow-50` : `border-gray-300`}`,
                                    style: {
                                      color: l[n]?.color || ga[n % ga.length],
                                      transform: `rotate(${n % 2 ? 0.5 : -0.5}deg)`,
                                    },
                                    children: (0, U.jsx)(`div`, {
                                      className: `flex items-center gap-2`,
                                      children: (0, U.jsxs)(`span`, {
                                        className: `font-handwriting font-bold`,
                                        children: [t.name, t.id === e?.id && ` (You)`],
                                      }),
                                    }),
                                  },
                                  t.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                        h &&
                          d === `ready` &&
                          (0, U.jsx)(q, {
                            onClick: M,
                            className: `w-full text-xl py-4 animate-pulse flex items-center justify-center gap-2 bg-green-50`,
                            children: `Start Party!`,
                          }),
                        (d === `ready` || d === `playing`) &&
                          (0, U.jsx)(q, { onClick: ee, className: `w-full text-sm py-2 mt-2`, children: `Leave Room` }),
                        d === `playing` &&
                          (0, U.jsxs)(Ii, {
                            className: `p-6 text-center`,
                            children: [
                              (0, U.jsxs)(`div`, {
                                className: `text-sm font-handwriting text-gray-500 mb-1 flex items-center justify-center gap-1`,
                                children: [(0, U.jsx)(xi, { size: 14 }), `Time Remaining`],
                              }),
                              (0, U.jsxs)(`div`, {
                                className: `text-4xl font-bold font-handwriting ${b < 10 ? `text-red-500 animate-ping` : `text-ink`}`,
                                children: [b, `s`],
                              }),
                              p === e?.id &&
                                (0, U.jsxs)(`div`, {
                                  className: `mt-2 text-ink flex items-center justify-center gap-1 text-lg font-bold animate-bounce`,
                                  children: [(0, U.jsx)(Si, { size: 18 }), `Your Turn!`],
                                }),
                            ],
                          }),
                      ],
                    }),
                  ],
                })
              : (0, U.jsxs)(Ii, {
                  className: `p-8 max-w-md w-full`,
                  children: [
                    (0, U.jsx)(`input`, {
                      type: `text`,
                      value: i.name,
                      onChange: (e) => a((t) => ({ ...t, name: e.target.value })),
                      placeholder: `Enter your name`,
                      className: `w-full sketch-border font-handwriting text-ink px-3 py-2 rounded mb-4`,
                    }),
                    (0, U.jsx)(Y, {
                      avatarIcon: i.avatarIcon,
                      color: i.color,
                      onAvatarChange: (e) => a((t) => ({ ...t, avatarIcon: e })),
                      onColorChange: (e) => a((t) => ({ ...t, color: e })),
                    }),
                    (0, U.jsxs)(`div`, {
                      className: `flex gap-4 mt-4`,
                      children: [
                        (0, U.jsx)(q, { onClick: A, children: `Create Room` }),
                        (0, U.jsx)(q, { onClick: j, children: `Join Room` }),
                      ],
                    }),
                  ],
                }),
          ],
        }),
        d === `playing` && (0, U.jsx)(Xi, { socket: e, roomId: t, gamePrefix: `bingo`, players: l }),
      ],
    });
  },
  va = () => {
    let { socket: e, roomId: t, setRoomId: n, clearRoomId: r, setGamePrefix: i, profile: a, setProfile: o } = Lr(),
      [s, c] = (0, _.useState)(Array(9).fill(null)),
      [l, u] = (0, _.useState)([]),
      [d, f] = (0, _.useState)(null),
      [p, m] = (0, _.useState)(`waiting`),
      [h, g] = (0, _.useState)([]),
      [v, y] = (0, _.useState)(null),
      b = Re(),
      [x] = da(`/sounds/win.mp3`, { volume: 0.7 }),
      S = (0, _.useCallback)(() => {
        e && e.emit(`ttt_createRoom`, { playerName: a.name, avatarIcon: a.avatarIcon, color: a.color });
      }, [e, a]),
      C = (0, _.useCallback)(async () => {
        let { value: t } = await K.default.fire({
          title: `Join Room`,
          input: `text`,
          inputPlaceholder: `Enter Room ID`,
          showCancelButton: !0,
          customClass: { popup: J },
        });
        t &&
          e.emit(`ttt_joinRoom`, {
            roomId: t.toUpperCase(),
            playerName: a.name,
            avatarIcon: a.avatarIcon,
            color: a.color,
          });
      }, [e, a]),
      { clearReconnect: w } = ha({
        socket: e,
        gamePrefix: `ttt`,
        roomId: t,
        onRestore: (e) => {
          e && (n(e.id), u(e.players || []), m(e.gameState || `waiting`), f(e.currentTurn), e.board && c(e.board));
        },
      });
    (ma(
      e,
      {
        ttt_roomInfo: ({ id: t, players: r, gameState: i, currentTurn: a, board: o }) => {
          (n(t), u(r), m(i), f(a), o && c(o));
          let s = r.findIndex((t) => t.id === e.id);
          s !== -1 && sessionStorage.setItem(`ttt_reconnect`, JSON.stringify({ roomId: t, playerId: r[s].id }));
        },
        ttt_gameStarted: () => {
          (m(`playing`),
            g([]),
            y(null),
            K.default.fire({
              title: `Game Started!`,
              text: `Make your move!`,
              timer: 1500,
              showConfirmButton: !1,
              customClass: { popup: J },
            }));
        },
        ttt_gameRestarted: () => {
          (m(`waiting`), g([]), c(Array(9).fill(null)), y(null));
        },
        ttt_gameWon: ({ winningLine: e }) => {
          (x(), g(e), pa({ particleCount: 150, spread: 70, origin: { y: 0.6 } }), m(`ended`), w());
        },
        ttt_gameDraw: () => {
          (m(`ended`), w());
        },
        ttt_playerLeft: () => {
          (K.default.fire({
            title: `Player Left`,
            text: `The opponent has left the party.`,
            icon: `warning`,
            customClass: { popup: J },
          }),
            m(`waiting`),
            c(Array(9).fill(null)),
            y(null));
        },
        ttt_alert: ({ icon: e, title: t, text: n }) => {
          K.default.fire({ icon: e, title: t, text: n, customClass: { popup: J } });
        },
        server_shutdown: ({ message: e }) => {
          K.default
            .fire({
              title: `Server Shutting Down`,
              text: e || `The server is going down for maintenance.`,
              icon: `info`,
              customClass: { popup: J },
            })
            .then(() => {
              (w(), r(t), b(`/`));
            });
        },
      },
      [r, b, x, t],
    ),
      (0, _.useEffect)(() => {
        e && i(`ttt`);
      }, [e, i]));
    let T = (0, _.useCallback)(
        (n) => {
          p === `playing` && d === e?.id && !s[n] && e.emit(`ttt_makeMove`, { roomId: t, position: n });
        },
        [p, d, t, e, s],
      ),
      E = (0, _.useCallback)(() => {
        e.emit(`ttt_restartGame`, t);
      }, [t, e]),
      D = (0, _.useCallback)(async () => {
        (
          await K.default.fire({
            title: `Leave Game?`,
            text: `Your progress will be lost.`,
            icon: `warning`,
            showCancelButton: !0,
            confirmButtonText: `Leave`,
            cancelButtonText: `Stay`,
            customClass: { popup: `sketch-popup` },
          })
        ).isConfirmed && (e.emit(`ttt_leaveRoom`, t), w(), r(t), b(`/`));
      }, [t, e, w, r, b]);
    return t
      ? p === `waiting`
        ? (0, U.jsxs)(`div`, {
            className: `min-h-screen bg-paper flex items-center justify-center p-4`,
            children: [
              (0, U.jsxs)(Ii, {
                className: `p-6 mb-4`,
                children: [
                  (0, U.jsx)(`div`, {
                    className: `flex items-center justify-between mb-4`,
                    children: (0, U.jsxs)(`span`, {
                      className: `font-handwriting text-ink flex items-center gap-2`,
                      children: [
                        (0, U.jsx)(`span`, { children: `Room:` }),
                        (0, U.jsx)(`span`, { className: `font-bold uppercase`, children: t }),
                      ],
                    }),
                  }),
                  (0, U.jsx)(`div`, {
                    className: `flex flex-col gap-2`,
                    children: l.map((t, n) =>
                      (0, U.jsxs)(
                        `div`,
                        {
                          className: `flex items-center gap-2 sketch-border px-3 py-2`,
                          children: [
                            (0, U.jsx)(`span`, { className: `text-lg`, children: t.connected === !1 ? `☐` : `☑️` }),
                            (0, U.jsx)(`span`, {
                              className: `font-handwriting text-ink flex-1 truncate`,
                              children: t.name,
                            }),
                            t.id === e?.id &&
                              (0, U.jsx)(`span`, { className: `text-xs opacity-60`, children: `(You)` }),
                          ],
                        },
                        t.id,
                      ),
                    ),
                  }),
                ],
              }),
              (0, U.jsx)(q, {
                onClick: E,
                disabled: l.length < 2,
                className: `w-full`,
                children: l.length < 2 ? `Waiting for opponent...` : `Start Game`,
              }),
              (0, U.jsx)(q, {
                onClick: D,
                className: `w-full mt-2`,
                style: { background: `#fff0f0` },
                children: `Leave Room`,
              }),
            ],
          })
        : (0, U.jsxs)(Zi, {
            players: l,
            children: [
              (0, U.jsxs)(`div`, {
                className: `flex flex-col items-center justify-center p-2 sm:p-4 w-full`,
                children: [
                  (0, U.jsx)(`h1`, {
                    className: `text-3xl sm:text-5xl md:text-6xl font-sketch mb-4 sm:mb-8 text-ink`,
                    children: `Tic Tac Toe`,
                  }),
                  p !== `waiting` &&
                    (0, U.jsxs)(`div`, {
                      className: `w-full max-w-sm sm:max-w-md`,
                      children: [
                        p === `playing` &&
                          (0, U.jsx)(`div`, {
                            className: `mb-4 text-center`,
                            children: (0, U.jsx)(`div`, {
                              className: `flex items-center justify-center gap-2`,
                              children: (0, U.jsx)(`span`, {
                                className: `font-sketch text-xl text-ink`,
                                children: d === e?.id ? `Your turn!` : `Opponent's turn`,
                              }),
                            }),
                          }),
                        (0, U.jsx)(Ii, {
                          className: `p-3 sm:p-6`,
                          children: (0, U.jsx)(`div`, {
                            className: `grid grid-cols-3 gap-1 sm:gap-2 w-48 sm:w-64 md:w-80`,
                            children: s.map((t, n) => {
                              let r = v && v.position === n;
                              return (0, U.jsx)(
                                `button`,
                                {
                                  onClick: () => T(n),
                                  disabled: p !== `playing` || d !== e?.id || t,
                                  className: `
                aspect-square text-3xl sm:text-5xl md:text-6xl font-bold
                transition-all duration-200
                ${t ? `cursor-default` : `cursor-pointer hover:bg-gray-100`}
                ${t === `X` ? `text-blue-600` : t === `O` ? `text-red-600` : `text-transparent`}
                ${h.includes(n) ? `bg-yellow-300/50 ring-2 ring-yellow-500` : ``}
                ${r ? `ring-2 ring-sky-400 ring-offset-2` : ``}
                font-sketch
              `,
                                  children: t || ``,
                                },
                                n,
                              );
                            }),
                          }),
                        }),
                        (0, U.jsx)(`div`, {
                          className: `mt-4 flex justify-center`,
                          children: (0, U.jsx)(q, {
                            onClick: D,
                            className: `text-sm px-3 py-1`,
                            children: `Leave Room`,
                          }),
                        }),
                      ],
                    }),
                  p === `ended` &&
                    (0, U.jsx)(`div`, {
                      className: `mt-4 text-center`,
                      children: (0, U.jsx)(q, { onClick: E, className: `text-sm px-3 py-1`, children: `Play Again` }),
                    }),
                ],
              }),
              p === `playing` && (0, U.jsx)(Xi, { socket: e, roomId: t, gamePrefix: `ttt`, players: l }),
            ],
          })
      : (0, U.jsxs)(`div`, {
          className: `min-h-screen bg-paper flex flex-col items-center justify-center p-4`,
          children: [
            (0, U.jsx)(`h1`, { className: `text-3xl sm:text-5xl font-sketch mb-6 text-ink`, children: `Tic Tac Toe` }),
            (0, U.jsxs)(Ii, {
              className: `p-6 max-w-md w-full mb-4`,
              children: [
                (0, U.jsx)(`input`, {
                  type: `text`,
                  value: a.name,
                  onChange: (e) => o((t) => ({ ...t, name: e.target.value })),
                  placeholder: `Enter your name`,
                  className: `w-full px-3 py-2 border border-ink/30 rounded sketch-font text-ink bg-white/80`,
                }),
                (0, U.jsx)(Y, {
                  avatarIcon: a.avatarIcon,
                  color: a.color,
                  onAvatarChange: (e) => o((t) => ({ ...t, avatarIcon: e })),
                  onColorChange: (e) => o((t) => ({ ...t, color: e })),
                }),
              ],
            }),
            (0, U.jsx)(Ii, {
              className: `p-8 max-w-md w-full`,
              children: (0, U.jsxs)(`div`, {
                className: `flex gap-4 justify-center`,
                children: [
                  (0, U.jsx)(q, { onClick: S, children: `Create` }),
                  (0, U.jsx)(q, { onClick: C, children: `Join` }),
                ],
              }),
            }),
          ],
        });
  },
  ya = ({
    _gridIndex: e,
    gridData: t,
    macroWinner: n,
    isActive: r,
    isLastMoveGrid: i,
    lastMoveSquare: a,
    onSquareClick: o,
  }) => {
    let s = () => {
        let e = `relative rounded-lg transition-all duration-300 shadow-sm`;
        return n === `DEAD`
          ? `${e} bg-gray-100/90 border border-gray-300/50`
          : n
            ? `${e} ${n === `X` ? `bg-blue-50/80 border-blue-200/50` : `bg-red-50/80 border-red-200/50`} border-2`
            : r
              ? `${e} bg-white/95 ring-2 ring-blue-400 ring-offset-1 shadow-lg scale-[1.02]`
              : `${e} bg-white/60 border border-gray-300/30 opacity-70`;
      },
      c = (e) => {
        let n = t[e];
        return (0, U.jsx)(
          `button`,
          {
            onClick: () => o(e),
            disabled: !r || n !== null,
            className: `
          relative aspect-square flex items-center justify-center
          text-xs sm:text-base md:text-xl lg:text-2xl font-bold font-sketch transition-all duration-200
          ${!r || n !== null ? `cursor-not-allowed` : `hover:bg-blue-100/40 cursor-pointer active:scale-95 hover:scale-105`}
          ${i && a === e ? `bg-yellow-200/70 ring-2 ring-yellow-400 animate-pulse` : ``}
          ${n === `X` ? `text-[#1a1a2e]` : n === `O` ? `text-[#c73e1d]` : `text-transparent`}
        `,
            style: { textShadow: n ? `0 1px 2px rgba(0,0,0,0.1)` : `none` },
            children:
              n &&
              (0, U.jsxs)(`span`, {
                className: `relative`,
                children: [
                  n,
                  (0, U.jsx)(`span`, {
                    className: `absolute inset-0 opacity-20`,
                    style: { transform: `rotate(2deg)` },
                    children: n,
                  }),
                ],
              }),
          },
          e,
        );
      };
    return (0, U.jsxs)(`div`, {
      className: `${s()} p-0.5 sm:p-1 overflow-hidden`,
      children: [
        (0, U.jsxs)(`div`, {
          className: `relative grid grid-cols-3 gap-0`,
          children: [
            Array(9)
              .fill(null)
              .map((e, t) => c(t)),
            (0, U.jsxs)(U.Fragment, {
              children: [
                (0, U.jsx)(`div`, {
                  className: `absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent`,
                  style: { top: `calc(33.333% - 0.5px)`, boxShadow: `0 0.5px 0 rgba(0,0,0,0.05)` },
                }),
                (0, U.jsx)(`div`, {
                  className: `absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent`,
                  style: { top: `calc(66.666% - 0.5px)`, boxShadow: `0 0.5px 0 rgba(0,0,0,0.05)` },
                }),
                (0, U.jsx)(`div`, {
                  className: `absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent`,
                  style: { left: `calc(33.333% - 0.5px)`, boxShadow: `0.5px 0 0 rgba(0,0,0,0.05)` },
                }),
                (0, U.jsx)(`div`, {
                  className: `absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent`,
                  style: { left: `calc(66.666% - 0.5px)`, boxShadow: `0.5px 0 0 rgba(0,0,0,0.05)` },
                }),
              ],
            }),
          ],
        }),
        n === `DEAD`
          ? (0, U.jsx)(`div`, {
              className: `absolute inset-0 flex items-center justify-center pointer-events-none z-10`,
              children: (0, U.jsx)(`div`, {
                className: `grid grid-cols-3 gap-0.5 opacity-30`,
                children: Array(9)
                  .fill(null)
                  .map((e, t) =>
                    (0, U.jsx)(
                      `span`,
                      { className: `text-[6px] sm:text-[8px] md:text-xs text-gray-500 font-bold`, children: `×` },
                      t,
                    ),
                  ),
              }),
            })
          : n === `X` || n === `O`
            ? (0, U.jsx)(`div`, {
                className: `absolute inset-0 flex items-center justify-center pointer-events-none z-10`,
                children: (0, U.jsxs)(`div`, {
                  className: `relative`,
                  children: [
                    (0, U.jsx)(`span`, {
                      className: `text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sketch opacity-20 ${n === `X` ? `text-[#1a1a2e]` : `text-[#c73e1d]`}`,
                      children: n,
                    }),
                    (0, U.jsx)(`span`, {
                      className: `absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sketch opacity-10 ${n === `X` ? `text-[#1a1a2e]` : `text-[#c73e1d]`}`,
                      style: { transform: `rotate(-3deg) translateX(1px)` },
                      children: n,
                    }),
                  ],
                }),
              })
            : null,
        (0, U.jsx)(`div`, {
          className: `absolute inset-0 pointer-events-none opacity-5 mix-blend-multiply`,
          style: {
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: `100px 100px`,
          },
        }),
      ],
    });
  },
  ba = () => `relative rounded-xl transition-all duration-300 shadow-lg bg-white/95 border-2 border-gray-800/10`,
  xa = () =>
    (0, U.jsxs)(U.Fragment, {
      children: [
        (0, U.jsx)(`div`, {
          className: `absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent`,
          style: { top: `calc(33.333% - 0.5px)`, boxShadow: `0 0.5px 0 rgba(0,0,0,0.05)` },
        }),
        (0, U.jsx)(`div`, {
          className: `absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent`,
          style: { top: `calc(66.666% - 0.5px)`, boxShadow: `0 0.5px 0 rgba(0,0,0,0.05)` },
        }),
        (0, U.jsx)(`div`, {
          className: `absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent`,
          style: { left: `calc(33.333% - 0.5px)`, boxShadow: `0.5px 0 0 rgba(0,0,0,0.05)` },
        }),
        (0, U.jsx)(`div`, {
          className: `absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent`,
          style: { left: `calc(66.666% - 0.5px)`, boxShadow: `0.5px 0 0 rgba(0,0,0,0.05)` },
        }),
      ],
    }),
  Sa = ({ board: e, macroBoard: t, activeGrid: n, lastMove: r, onCellClick: i }) =>
    (0, U.jsxs)(`div`, {
      className: `${ba()} p-1.5 sm:p-2 md:p-3 overflow-hidden`,
      children: [
        (0, U.jsxs)(`div`, {
          className: `relative grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2`,
          children: [
            Array(9)
              .fill(null)
              .map((a, o) =>
                (0, U.jsx)(
                  ya,
                  {
                    gridIndex: o,
                    gridData: e[o],
                    macroWinner: t[o],
                    isActive: t[o] === null && (n === null || n === o || (n !== null && t[n] !== null)),
                    isLastMoveGrid: r?.gridIndex === o,
                    lastMoveSquare: r?.gridIndex === o ? r?.squareIndex : null,
                    onSquareClick: (e) => i(o, e),
                  },
                  o,
                ),
              ),
            xa(),
          ],
        }),
        (0, U.jsx)(`div`, {
          className: `absolute inset-0 pointer-events-none opacity-5 mix-blend-multiply`,
          style: {
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: `100px 100px`,
          },
        }),
      ],
    }),
  Ca = [`#1a1a2e`, `#c73e1d`],
  wa = () => {
    let { socket: e, roomId: t, setRoomId: n, clearRoomId: r, profile: i, setProfile: a, setGamePrefix: o } = Lr(),
      [s, c] = (0, _.useState)([]),
      [l, u] = (0, _.useState)([]),
      [d, f] = (0, _.useState)(null),
      [p, m] = (0, _.useState)(`waiting`),
      [h, g] = (0, _.useState)(
        Array(9)
          .fill(null)
          .map(() => Array(9).fill(null)),
      ),
      [v, y] = (0, _.useState)(Array(9).fill(null)),
      [b, x] = (0, _.useState)(null),
      [S, C] = (0, _.useState)({ X: 0, O: 0 }),
      [w, T] = (0, _.useState)(null),
      E = (0, _.useState)(null)[1],
      [D, O] = (0, _.useState)(-1),
      k = Re(),
      [A] = da(`/sounds/move.mp3`, { volume: 0.5 }),
      [j] = da(`/sounds/win.mp3`, { volume: 0.7 }),
      M = (0, _.useCallback)(() => {
        e &&
          (H.socket(`➡️`, `uttt_createRoom`, { playerName: i.name }),
          e.emit(`uttt_createRoom`, { playerName: i.name, avatarIcon: i.avatarIcon, color: i.color }));
      }, [e, i]),
      ee = (0, _.useCallback)(async () => {
        let { value: t } = await K.default.fire({
          title: `Join UTTT Room`,
          input: `text`,
          inputPlaceholder: `Enter Room ID`,
          showCancelButton: !0,
          customClass: { popup: J },
        });
        t &&
          (H.socket(`➡️`, `uttt_joinRoom`, { roomId: t.toUpperCase() }),
          e.emit(`uttt_joinRoom`, {
            roomId: t.toUpperCase(),
            playerName: i.name,
            avatarIcon: i.avatarIcon,
            color: i.color,
          }));
      }, [e, i]),
      { clearReconnect: N } = ha({
        socket: e,
        gamePrefix: `uttt`,
        roomId: t,
        onRestore: (e) => {
          if (!e) return;
          (n(e.id),
            c(e.players || []),
            m(e.gameState || `waiting`),
            f(e.currentTurn),
            e.board && g(e.board),
            e.macroBoard && y(e.macroBoard),
            e.activeGrid !== void 0 && x(e.activeGrid),
            e.scores && C(e.scores),
            e.lastMove && T(e.lastMove));
          let t = e.players.findIndex((t) => t.id === e.currentTurn);
          t !== -1 && (E(t === 0 ? `X` : `O`), O(t));
        },
      });
    ma(
      e,
      {
        uttt_roomInfo: (t) => {
          (H.socket(`⬅️`, `uttt_roomInfo`, { roomId: t.id, gameState: t.gameState }),
            n(t.id),
            c(t.players),
            u(t.spectators || []),
            m(t.gameState),
            f(t.currentTurn),
            t.board && g(t.board),
            t.macroBoard && y(t.macroBoard),
            t.activeGrid !== void 0 && x(t.activeGrid),
            t.scores && C(t.scores),
            t.lastMove && T(t.lastMove));
          let r = t.players.findIndex((t) => t.id === e.id);
          r !== -1 &&
            (E(r === 0 ? `X` : `O`),
            O(r),
            sessionStorage.setItem(`uttt_reconnect`, JSON.stringify({ roomId: t.id, playerId: t.players[r].id })));
        },
        uttt_gamePaused: ({ reason: e }) => {
          (H.socket(`⬅️`, `uttt_gamePaused`, { reason: e }),
            K.default.fire({ title: `Game Paused`, text: e, icon: `warning`, customClass: { popup: J } }));
        },
        uttt_gameState: (e) => {
          (H.socket(`⬅️`, `uttt_gameState`, { gameState: e.gameState }),
            m(e.gameState),
            f(e.currentTurn),
            g(e.board),
            y(e.macroBoard),
            x(e.activeGrid),
            C(e.scores),
            T(e.lastMove));
        },
        uttt_gameStarted: () => {
          (H.socket(`⬅️`, `uttt_gameStarted`, `Game started!`),
            m(`playing`),
            g(
              Array(9)
                .fill(null)
                .map(() => Array(9).fill(null)),
            ),
            y(Array(9).fill(null)),
            x(null),
            C({ X: 0, O: 0 }),
            T(null),
            K.default.fire({
              title: `Game Started!`,
              html: `<div class="font-handwriting">Ultimate Tic-Tac-Toe begins!</div>`,
              timer: 1500,
              showConfirmButton: !1,
              customClass: { popup: J },
            }));
        },
        uttt_gameOver: ({ winner: e, symbol: t, scores: n, reason: r }) => {
          (H.socket(`⬅️`, `uttt_gameOver`, { winner: e, symbol: t, scores: n, reason: r }),
            j(),
            r === `macro_win`
              ? (pa({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: [`#1a1a2e`, `#c73e1d`, `#2d4a8f`] }),
                setTimeout(() => {
                  pa({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
                }, 250),
                setTimeout(() => {
                  pa({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
                }, 400))
              : pa({ particleCount: 100, spread: 70, origin: { y: 0.6 } }));
          let i;
          i =
            r === `tiebreaker` && n.X === n.O
              ? `No one - it's a tie!`
              : e
                ? s.find((t) => t.id === e)?.name || `Someone`
                : t || `Someone`;
          let a = r === `macro_win` ? ` achieved a Macro Victory!` : ` won by grids (${n.X} - ${n.O})!`;
          (K.default.fire({
            title: `🏆 Victory! 🏆`,
            html: `<div class="font-handwriting text-lg">${i}${a}</div>`,
            icon: `success`,
            confirmButtonText: `Awesome!`,
            customClass: { popup: J },
          }),
            m(`ended`),
            N());
        },
        uttt_error: ({ message: e }) => {
          (H.socket(`⬅️`, `uttt_error`, { message: e }),
            K.default.fire({ title: `Oops!`, text: e, icon: `error`, customClass: { popup: J } }));
        },
        uttt_playerLeft: ({ playerId: e }) => {
          (H.socket(`⬅️`, `uttt_playerLeft`, { playerId: e }),
            K.default.fire({
              title: `Player Left`,
              text: `Your opponent has left the game.`,
              icon: `warning`,
              customClass: { popup: J },
            }),
            m(`waiting`),
            g(
              Array(9)
                .fill(null)
                .map(() => Array(9).fill(null)),
            ),
            y(Array(9).fill(null)),
            x(null));
        },
        uttt_alert: ({ icon: e, title: t, text: n }) => {
          K.default.fire({ title: t, text: n, icon: e, customClass: { popup: J } });
        },
        server_shutdown: ({ message: e }) => {
          K.default
            .fire({
              title: `Server Shutting Down`,
              text: e || `The server is going down for maintenance.`,
              icon: `info`,
              customClass: { popup: J },
            })
            .then(() => {
              (N(), r(t), k(`/`));
            });
        },
      },
      [r, N, k, j, s, t, n],
    );
    let P = (0, _.useCallback)(
        (n, r) => {
          if (p === `playing` && d === e?.id) {
            if ((b !== null && b !== n) || h[n][r] !== null) return;
            (A(),
              H.socket(`➡️`, `uttt_makeMove`, { roomId: t, gridIndex: n, squareIndex: r }),
              e.emit(`uttt_makeMove`, { roomId: t, gridIndex: n, squareIndex: r }));
          }
        },
        [p, d, e, b, h, A, t],
      ),
      te = (0, _.useCallback)(() => {
        !e || !t || (H.socket(`➡️`, `uttt_startGame`, { roomId: t }), e.emit(`uttt_startGame`, t));
      }, [e, t]),
      ne = (0, _.useCallback)(async () => {
        (
          await K.default.fire({
            title: `Leave Game?`,
            text: `Are you sure you want to leave?`,
            icon: `warning`,
            showCancelButton: !0,
            confirmButtonText: `Yes, leave`,
            customClass: { popup: `sketch-popup` },
          })
        ).isConfirmed && (e.emit(`uttt_leaveRoom`, t), N(), r(t), k(`/`));
      }, [t, e, N, r, k]),
      re = (0, _.useCallback)(() => {
        (H.socket(`➡️`, `uttt_restartGame`, { roomId: t }), e.emit(`uttt_restartGame`, t));
      }, [t, e]);
    ((0, _.useEffect)(() => {
      e && (o(`uttt`), H.info(`UTTT`, `Socket connected: ${e.id}`));
    }, [e, o]),
      l?.some((t) => t.id === e?.id));
    let F = s[0]?.id === e?.id;
    return p === `ended`
      ? (0, U.jsx)(ta, {
          winner: null,
          isWinner: !1,
          scores: [
            { name: s[0]?.name || `Player 1`, score: S.X || 0 },
            { name: s[1]?.name || `Player 2`, score: S.O || 0 },
          ],
          players: s,
          onRematch: re,
          onNewRoom: ne,
        })
      : t && p === `waiting`
        ? (0, U.jsx)(Hi, {
            gameName: `Ultimate Tic-Tac-Toe`,
            roomId: t,
            players: s,
            spectators: l || [],
            isHost: !!F,
            minPlayers: 2,
            onStart: te,
            onLeave: ne,
            showJoinInput: !0,
            startLabel: `Start Game`,
            profile: i,
            onProfileChange: (e) => a(e),
          })
        : (0, U.jsxs)(Zi, {
            players: s,
            children: [
              (0, U.jsxs)(`div`, {
                className: `flex flex-col items-center justify-center p-2 sm:p-4 w-full`,
                children: [
                  (0, U.jsxs)(`div`, {
                    className: `text-center mb-3 sm:mb-6`,
                    children: [
                      (0, U.jsxs)(`h1`, {
                        className: `text-2xl sm:text-3xl md:text-5xl font-sketch mb-1 sm:mb-2 text-ink flex items-center gap-2 sm:gap-3 justify-center`,
                        children: [
                          (0, U.jsx)(ii, { className: `w-6 h-6 sm:w-8 sm:h-8 text-ink` }),
                          (0, U.jsx)(`span`, { className: `hidden sm:inline`, children: `Ultimate Tic-Tac-Toe` }),
                          (0, U.jsx)(`span`, { className: `sm:hidden`, children: `UTTT` }),
                        ],
                      }),
                      (0, U.jsx)(`p`, {
                        className: `font-handwriting text-xs sm:text-sm text-gray-600 hidden sm:block`,
                        children: `Win three grids in a row to claim victory!`,
                      }),
                    ],
                  }),
                  t
                    ? (0, U.jsxs)(`div`, {
                        className: `w-full max-w-sm sm:max-w-2xl md:max-w-3xl`,
                        children: [
                          (0, U.jsxs)(Ii, {
                            className: `p-3 sm:p-4 mb-3 sm:mb-6 flex flex-col gap-3`,
                            style: { background: `#fffef9` },
                            children: [
                              (0, U.jsxs)(`div`, {
                                className: `flex justify-between items-center`,
                                children: [
                                  (0, U.jsxs)(`div`, {
                                    className: `font-handwriting text-ink flex items-center gap-1 sm:gap-2 text-xs sm:text-base`,
                                    children: [
                                      (0, U.jsx)(ii, { size: 14, className: `sm:w-[18px] text-ink` }),
                                      (0, U.jsx)(`span`, { className: `hidden sm:inline`, children: `Room:` }),
                                      (0, U.jsx)(`span`, {
                                        className: `font-bold text-ink uppercase tracking-wider`,
                                        children: t,
                                      }),
                                    ],
                                  }),
                                  (0, U.jsxs)(`div`, {
                                    className: `flex items-center gap-2 sm:gap-3 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-300/30`,
                                    children: [
                                      (0, U.jsxs)(`div`, {
                                        className: `flex items-center gap-1`,
                                        children: [
                                          (0, U.jsx)(`div`, {
                                            className: `w-2 h-2 rounded-full`,
                                            style: { background: Ca[0] },
                                          }),
                                          (0, U.jsx)(`span`, {
                                            className: `font-bold text-sm sm:text-lg`,
                                            style: { color: Ca[0] },
                                            children: S.X,
                                          }),
                                        ],
                                      }),
                                      (0, U.jsx)(`span`, { className: `text-gray-400 font-bold`, children: `:` }),
                                      (0, U.jsxs)(`div`, {
                                        className: `flex items-center gap-1`,
                                        children: [
                                          (0, U.jsx)(`span`, {
                                            className: `font-bold text-sm sm:text-lg`,
                                            style: { color: Ca[1] },
                                            children: S.O,
                                          }),
                                          (0, U.jsx)(`div`, {
                                            className: `w-2 h-2 rounded-full`,
                                            style: { background: Ca[1] },
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, U.jsx)(`div`, {
                                className: `flex gap-2 sm:gap-4 text-xs sm:text-sm justify-center`,
                                children: s.map((e, t) =>
                                  (0, U.jsxs)(
                                    `div`,
                                    {
                                      className: `flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 border ${e.id === d ? `bg-white border-2 scale-105 shadow-md` : `bg-white/30 border-gray-300/30 opacity-60`}`,
                                      style: { borderColor: e.id === d ? Ca[t] : void 0 },
                                      children: [
                                        e.id === d &&
                                          (0, U.jsx)(gi, {
                                            size: 12,
                                            className: `sm:w-4 text-yellow-500 animate-pulse`,
                                          }),
                                        (0, U.jsx)(`span`, {
                                          className: `font-bold font-handwriting text-xs sm:text-base`,
                                          style: { color: Ca[t] },
                                          children: e.name.length > 8 ? e.name.slice(0, 8) + `...` : e.name,
                                        }),
                                        (0, U.jsxs)(`span`, {
                                          className: `text-[10px] sm:text-xs opacity-60`,
                                          children: [`(`, t === 0 ? `X` : `O`, `)`],
                                        }),
                                        t === D &&
                                          (0, U.jsx)(`span`, {
                                            className: `text-[10px] bg-yellow-100 px-1.5 rounded text-yellow-700 font-bold`,
                                            children: `You`,
                                          }),
                                      ],
                                    },
                                    e.id,
                                  ),
                                ),
                              }),
                            ],
                          }),
                          (0, U.jsx)(`div`, {
                            className: `mb-4 sm:mb-6`,
                            children: (0, U.jsx)(Sa, {
                              board: h,
                              macroBoard: v,
                              activeGrid: b,
                              lastMove: w,
                              onCellClick: P,
                            }),
                          }),
                          (0, U.jsx)(`div`, {
                            className: `mb-4`,
                            children: (0, U.jsx)(Wi, {
                              players: s,
                              scores: { X: S.X || 0, O: S.O || 0 },
                              currentTurn: d,
                              myPlayerIndex: D,
                              lastMove: w,
                              orientation: `horizontal`,
                            }),
                          }),
                          (0, U.jsxs)(`div`, {
                            className: `text-center font-handwriting text-sm sm:text-lg text-ink flex flex-col items-center gap-3`,
                            children: [
                              p === `playing`
                                ? d === e?.id
                                  ? (0, U.jsxs)(`div`, {
                                      className: `flex items-center gap-2 sm:gap-3 text-ink animate-pulse bg-white/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 border-ink shadow-lg`,
                                      children: [
                                        (0, U.jsx)(Si, { size: 20, className: `sm:w-6 text-yellow-500` }),
                                        (0, U.jsx)(`span`, {
                                          className: `font-sketch text-base sm:text-xl`,
                                          children: `Your Turn!`,
                                        }),
                                      ],
                                    })
                                  : (0, U.jsx)(`div`, {
                                      className: `flex flex-col items-center gap-2 bg-white/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-300/30`,
                                      children: (0, U.jsxs)(`div`, {
                                        className: `flex items-center gap-2 text-ink`,
                                        children: [
                                          (0, U.jsx)(`div`, {
                                            className: `w-3 h-3 sm:w-4 sm:h-4 border-2 border-ink border-t-transparent rounded-full animate-spin`,
                                          }),
                                          (0, U.jsxs)(`span`, {
                                            className: `hidden sm:inline`,
                                            children: [
                                              `Waiting for `,
                                              s.find((e) => e.id === d)?.name || `opponent`,
                                              `...`,
                                            ],
                                          }),
                                          (0, U.jsx)(`span`, {
                                            className: `sm:hidden`,
                                            children: `Opponent's turn...`,
                                          }),
                                        ],
                                      }),
                                    })
                                : p === `waiting`
                                  ? (0, U.jsx)(`div`, {
                                      className: `bg-white/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-300/30`,
                                      children: (0, U.jsxs)(`span`, {
                                        className: `text-xs sm:text-base flex items-center gap-2`,
                                        children: [
                                          (0, U.jsx)(Ei, { size: 16, className: `text-gray-500` }),
                                          `Waiting for opponent...`,
                                        ],
                                      }),
                                    })
                                  : (0, U.jsx)(q, {
                                      onClick: re,
                                      className: `text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3`,
                                      children: `Play Again`,
                                    }),
                              (p === `waiting` || p === `playing`) &&
                                (0, U.jsx)(q, {
                                  onClick: ne,
                                  className: `mt-2 text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 opacity-70 hover:opacity-100`,
                                  children: `Leave Room`,
                                }),
                            ],
                          }),
                          b !== null &&
                            p === `playing` &&
                            (0, U.jsxs)(`div`, {
                              className: `text-center mt-4 font-handwriting text-xs sm:text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200/50`,
                              children: [`📍 You must play in grid `, b + 1],
                            }),
                        ],
                      })
                    : (0, U.jsxs)(Ii, {
                        className: `p-6 sm:p-8 max-w-md w-full`,
                        style: { background: `#fffef9` },
                        children: [
                          (0, U.jsxs)(`div`, {
                            className: `text-center mb-6`,
                            children: [
                              (0, U.jsx)(gi, { className: `w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-ink` }),
                              (0, U.jsx)(`h2`, {
                                className: `font-sketch text-xl sm:text-2xl text-ink mb-2`,
                                children: `Ready to Play?`,
                              }),
                              (0, U.jsx)(`p`, {
                                className: `font-handwriting text-sm text-gray-600`,
                                children: `Create a new game or join an existing one`,
                              }),
                            ],
                          }),
                          (0, U.jsx)(`input`, {
                            type: `text`,
                            value: i.name,
                            onChange: (e) => a((t) => ({ ...t, name: e.target.value })),
                            placeholder: `Enter your name`,
                            className: `w-full sketch-border font-handwriting text-ink px-3 py-2 rounded mb-4`,
                          }),
                          (0, U.jsx)(Y, {
                            avatarIcon: i.avatarIcon,
                            color: i.color,
                            onAvatarChange: (e) => a((t) => ({ ...t, avatarIcon: e })),
                            onColorChange: (e) => a((t) => ({ ...t, color: e })),
                          }),
                          (0, U.jsxs)(`div`, {
                            className: `flex gap-3 sm:gap-4 flex-col sm:flex-row mt-4`,
                            children: [
                              (0, U.jsx)(q, {
                                onClick: M,
                                className: `text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 flex-1`,
                                children: `Create Room`,
                              }),
                              (0, U.jsx)(q, {
                                onClick: ee,
                                className: `text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 flex-1`,
                                children: `Join Room`,
                              }),
                            ],
                          }),
                        ],
                      }),
                ],
              }),
              p === `playing` && (0, U.jsx)(Xi, { socket: e, roomId: t, gamePrefix: `uttt`, players: s }),
            ],
          });
  },
  Ta = function (e, t) {
    return Number(e.toFixed(t));
  },
  Ea = function (e, t) {
    return typeof e == `number` ? e : t;
  },
  X = function (e, t, n) {
    n && typeof n == `function` && n(e, t);
  },
  Da = {
    easeOut: function (e) {
      return -Math.cos(e * Math.PI) / 2 + 0.5;
    },
    linear: function (e) {
      return e;
    },
    easeInQuad: function (e) {
      return e * e;
    },
    easeOutQuad: function (e) {
      return e * (2 - e);
    },
    easeInOutQuad: function (e) {
      return e < 0.5 ? 2 * e * e : -1 + (4 - 2 * e) * e;
    },
    easeInCubic: function (e) {
      return e * e * e;
    },
    easeOutCubic: function (e) {
      return --e * e * e + 1;
    },
    easeInOutCubic: function (e) {
      return e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1;
    },
    easeInQuart: function (e) {
      return e * e * e * e;
    },
    easeOutQuart: function (e) {
      return 1 - --e * e * e * e;
    },
    easeInOutQuart: function (e) {
      return e < 0.5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e;
    },
    easeInQuint: function (e) {
      return e * e * e * e * e;
    },
    easeOutQuint: function (e) {
      return 1 + --e * e * e * e * e;
    },
    easeInOutQuint: function (e) {
      return e < 0.5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e;
    },
  },
  Oa = function (e) {
    typeof e == `number` && cancelAnimationFrame(e);
  },
  ka = function (e) {
    e.mounted && (Oa(e.animation), (e.isAnimating = !1), (e.animation = null), (e.velocity = null));
  };
function Aa(e, t, n, r) {
  if (e.mounted) {
    var i = new Date().getTime(),
      a = 1;
    (ka(e),
      (e.animation = function () {
        if (!e.mounted) return Oa(e.animation);
        var o = new Date().getTime() - i,
          s = o / n,
          c = Da[t],
          l = c(s);
        o >= n ? (r(a), (e.animation = null)) : e.animation && (r(l), requestAnimationFrame(e.animation));
      }),
      requestAnimationFrame(e.animation));
  }
}
function ja(e) {
  var t = e.scale,
    n = e.positionX,
    r = e.positionY;
  return !(Number.isNaN(t) || Number.isNaN(n) || Number.isNaN(r));
}
function Ma(e, t, n, r) {
  var i = ja(t);
  if (!(!e.mounted || !i)) {
    var a = e.setState,
      o = e.state,
      s = o.scale,
      c = o.positionX,
      l = o.positionY,
      u = t.scale - s,
      d = t.positionX - c,
      f = t.positionY - l;
    n === 0
      ? a(t.scale, t.positionX, t.positionY)
      : Aa(e, r, n, function (t) {
          (t === 1 ? (e.isAnimating = !1) : (e.isAnimating = !0), a(s + u * t, c + d * t, l + f * t));
        });
  }
}
function Na(e, t, n) {
  var r = e.offsetWidth,
    i = e.offsetHeight,
    a = t.offsetWidth,
    o = t.offsetHeight,
    s = a * n,
    c = o * n;
  return {
    wrapperWidth: r,
    wrapperHeight: i,
    newContentWidth: s,
    newDiffWidth: r - s,
    newContentHeight: c,
    newDiffHeight: i - c,
  };
}
var Pa = function (e, t, n, r, i, a, o) {
    var s = e > t ? n * (o ? 0.5 : 1) : 0,
      c = r > i ? a * (o ? 0.5 : 1) : 0;
    return {
      minPositionX: e - t - s,
      maxPositionX: s,
      minPositionY: r - i - c,
      maxPositionY: c,
      scaleWidthFactor: s,
      scaleHeightFactor: c,
    };
  },
  Fa = function (e, t) {
    var n = e.wrapperComponent,
      r = e.contentComponent,
      i = e.setup,
      a = i.centerZoomedOut,
      o = i.disablePadding;
    if (!n || !r) throw Error(`Components are not mounted`);
    var s = Na(n, r, t),
      c = s.wrapperWidth,
      l = s.wrapperHeight,
      u = s.newContentWidth,
      d = s.newContentHeight,
      f = s.newDiffWidth,
      p = s.newDiffHeight,
      m = Pa(c, u, f, l, d, p, !!a);
    o &&
      c >= u &&
      l >= d &&
      !a &&
      ((m.minPositionX = 0), (m.maxPositionX = 0), (m.minPositionY = 0), (m.maxPositionY = 0));
    var h = e.setup,
      g = h.minPositionX,
      _ = h.maxPositionX,
      v = h.minPositionY,
      y = h.maxPositionY;
    return (
      g != null && (m.minPositionX = c * (1 - t) + g * t),
      _ != null && (m.maxPositionX = _ * t),
      v != null && (m.minPositionY = l * (1 - t) + v * t),
      y != null && (m.maxPositionY = y * t),
      m
    );
  },
  Ia = function (e, t, n, r) {
    return Ta(r ? (e < t ? t : e > n ? n : e) : e, 2);
  },
  La = function (e, t) {
    var n = Fa(e, t);
    return ((e.bounds = n), n);
  };
function Ra(e, t, n, r, i, a, o) {
  var s = n.minPositionX,
    c = n.minPositionY,
    l = n.maxPositionX,
    u = n.maxPositionY,
    d = 0,
    f = 0;
  return (o && ((d = i), (f = a)), { x: Ia(e, s - d, l + d, r), y: Ia(t, c - f, u + f, r) });
}
function za(e, t, n, r, i, a) {
  var o = e.state,
    s = o.scale,
    c = o.positionX,
    l = o.positionY,
    u = r - s;
  return typeof t != `number` || typeof n != `number`
    ? (console.error(`Mouse X and Y position were not provided!`), { x: c, y: l })
    : Ra(c - t * u, l - n * u, i, a, 0, 0, null);
}
var Ba = 1e-7;
function Va(e, t, n, r, i) {
  var a = i ? r : 0,
    o = Math.max(t - a, Ba),
    s = n + a;
  return !Number.isNaN(n) && e >= s ? s : !Number.isNaN(t) && e <= o ? o : Math.max(e, Ba);
}
var Ha = function (e, t) {
    var n = e.setup.panning.excluded,
      r = e.isInitialized,
      i = e.wrapperComponent,
      a = t.target,
      o =
        `shadowRoot` in a && `composedPath` in t
          ? t.composedPath().some(function (e) {
              return e instanceof Element ? i?.contains(e) : !1;
            })
          : i?.contains(a);
    return !(
      !(r && a && o) ||
      Fo(a, n) ||
      a.getAttribute(`draggable`) === `true` ||
      a.getAttribute(`contenteditable`) === `true` ||
      a.isContentEditable
    );
  },
  Ua = function (e) {
    var t = e.isInitialized,
      n = e.isPanning,
      r = e.setup.panning.disabled;
    return !!(t && n && !r);
  },
  Wa = function (e, t) {
    var n = e.state,
      r = n.positionX,
      i = n.positionY;
    e.isPanning = !0;
    var a = t.clientX,
      o = t.clientY;
    e.startCoords = { x: a - r, y: o - i };
  },
  Ga = function (e, t) {
    var n = t.touches,
      r = e.state,
      i = r.positionX,
      a = r.positionY;
    if (((e.isPanning = !0), n.length === 1)) {
      var o = n[0].clientX,
        s = n[0].clientY;
      e.startCoords = { x: o - i, y: s - a };
    }
  };
function Ka(e) {
  var t = e.state,
    n = t.positionX,
    r = t.positionY,
    i = t.scale,
    a = e.setup,
    o = a.disabled,
    s = a.limitToBounds,
    c = a.centerZoomedOut,
    l = e.wrapperComponent;
  if (!(o || !l || !e.bounds)) {
    var u = e.bounds,
      d = u.maxPositionX,
      f = u.minPositionX,
      p = u.maxPositionY,
      m = u.minPositionY,
      h = n > d || n < f,
      g = r > p || r < m,
      _ = za(
        e,
        n > d ? l.offsetWidth : e.setup.minPositionX || 0,
        r > p ? l.offsetHeight : e.setup.minPositionY || 0,
        i,
        e.bounds,
        s || c,
      ),
      v = _.x,
      y = _.y;
    return { scale: i, positionX: h ? v : n, positionY: g ? y : r };
  }
}
function qa(e, t, n, r, i) {
  var a = e.setup.limitToBounds,
    o = e.wrapperComponent,
    s = e.bounds,
    c = e.state,
    l = c.scale,
    u = c.positionX,
    d = c.positionY;
  if (!(o === null || s === null || (t === u && n === d))) {
    var f = Ra(t, n, s, a, r, i, o),
      p = f.x,
      m = f.y;
    e.setState(l, p, m);
  }
}
var Ja = function (e, t, n) {
    var r = e.startCoords,
      i = e.state,
      a = e.setup.panning,
      o = a.lockAxisX,
      s = a.lockAxisY,
      c = i.positionX,
      l = i.positionY;
    if (!r) return { x: c, y: l };
    var u = t - r.x,
      d = n - r.y;
    return { x: o ? c : u, y: s ? l : d };
  },
  Ya = function (e, t, n) {
    var r = e.setup,
      i = e.state,
      a = r.minScale,
      o = r.disablePadding,
      s = r.centerZoomedOut,
      c = n ?? i.scale;
    return t > 0 && c >= a && !o && !s ? t : 0;
  },
  Xa;
(function (e) {
  ((e.TRACK_PAD = `track_pad`), (e.MOUSE = `mouse`), (e.TOUCH = `touch`));
})((Xa ||= {}));
var Za = function (e) {
    var t = e.mounted,
      n = e.wrapperComponent,
      r = e.contentComponent,
      i = e.setup,
      a = i.disabled,
      o = i.velocityAnimation,
      s = i.limitToBounds,
      c = e.state.scale;
    return o.disabled || a || !t || !n || !r
      ? !1
      : s
        ? n.offsetWidth < r.offsetWidth * c || n.offsetHeight < r.offsetHeight * c
        : !0;
  },
  Qa = function (e) {
    var t = e.mounted,
      n = e.velocity,
      r = e.bounds,
      i = e.setup,
      a = i.disabled;
    return !(!(!i.velocityAnimation.disabled && !a && t) || !n || !r);
  };
function $a(e, t) {
  var n = e.setup.velocityAnimation,
    r = n.animationTime,
    i = n.maxAnimationTime,
    a = n.inertia;
  return Math.min(r * Math.max(1, Math.abs(t / a)), i);
}
function eo(e, t, n, r, i, a, o, s, c, l) {
  if (i) {
    if (t > o && n > o) {
      var u = o + (e - o) * l;
      return u > c ? c : u < o ? o : u;
    }
    if (t < a && n < a) {
      var u = a + (e - a) * l;
      return u < s ? s : u > a ? a : u;
    }
  }
  return r ? t : Ia(e, a, o, i);
}
function to(e) {
  var t = 1,
    n = e.offsetWidth / window.innerWidth;
  return Number.isNaN(n) ? t : Math.min(t, n);
}
var no = function (e, t, n) {
  var r = 0,
    i = e * n;
  return Number.isNaN(i) ? r : e < 0 ? Math.max(i, -t) : Math.min(i, t);
};
function ro(e, t, n) {
  var r, i;
  if (Za(e)) {
    var a = e.lastMousePosition,
      o = e.velocityTime,
      s = e.setup,
      c = e.wrapperComponent,
      l = s.velocityAnimation,
      u = l.maxStrengthMouse,
      d = l.maxStrengthTouch,
      f = l.sensitivityTouch,
      p = l.sensitivityMouse,
      m = Date.now();
    if (a && o && c) {
      var h = to(c),
        g = ((r = {}), (r[Xa.TOUCH] = f), (r[Xa.MOUSE] = p), r)[n],
        _ = ((i = {}), (i[Xa.TOUCH] = d), (i[Xa.MOUSE] = u), i)[n],
        v = t.x - a.x,
        y = t.y - a.y,
        b = no(v / h, _, g),
        x = no(y / h, _, g),
        S = m - o,
        C = v * v + y * y;
      e.velocity = { velocityX: b, velocityY: x, total: no(Math.sqrt(C) / S, _, g) };
    }
    ((e.lastMousePosition = t), (e.velocityTime = m));
  }
}
function io(e) {
  var t = e.velocity,
    n = e.bounds,
    r = e.setup,
    i = e.wrapperComponent;
  if (!(!Qa(e) || !t || !n || !i)) {
    var a = t.velocityX,
      o = t.velocityY,
      s = t.total,
      c = n.maxPositionX,
      l = n.minPositionX,
      u = n.maxPositionY,
      d = n.minPositionY,
      f = r.limitToBounds,
      p = r.autoAlignment,
      m = r.zoomAnimation,
      h = r.panning,
      g = h.lockAxisY,
      _ = h.lockAxisX,
      v = m.animationType,
      y = p.sizeX,
      b = p.sizeY,
      x = p.velocityAlignmentTime,
      S = $a(e, s),
      C = Math.max(S, x),
      w = Ya(e, y),
      T = Ya(e, b),
      E = (w * i.offsetWidth) / 100,
      D = (T * i.offsetHeight) / 100,
      O = c + E,
      k = l - E,
      A = u + D,
      j = d - D,
      M = e.state,
      ee = new Date().getTime();
    Aa(e, v, C, function (t) {
      var n = e.state,
        r = n.scale,
        i = n.positionX,
        s = n.positionY,
        m = (new Date().getTime() - ee) / x,
        h = Da[p.animationType],
        v = 1 - h(Math.min(1, m)),
        y = 1 - t,
        b = i + a * y,
        S = s + o * y,
        C = eo(b, M.positionX, i, _, f, l, c, k, O, v),
        w = eo(S, M.positionY, s, g, f, d, u, j, A, v);
      if (i !== b || s !== S) {
        e.setState(r, C, w);
        var T = e.props.onPanning;
        T && T(Z(e), {});
      }
    });
  }
}
function ao(e, t) {
  var n = e.state,
    r = n.scale;
  ((e.panStartPosition = { x: n.positionX, y: n.positionY }),
    ka(e),
    La(e, r),
    window.TouchEvent !== void 0 && t instanceof TouchEvent ? Ga(e, t) : Wa(e, t));
}
function oo(e, t) {
  var n = e.state.scale,
    r = e.setup,
    i = r.minScale,
    a = r.autoAlignment,
    o = a.disabled,
    s = a.sizeX,
    c = a.sizeY,
    l = a.animationTime,
    u = a.animationType;
  if (!(o || n < i || (!s && !c))) {
    var d = Ka(e);
    d && Ma(e, d, t ?? l, u);
  }
}
function so(e, t, n, r) {
  var i = e.startCoords,
    a = e.setup.autoAlignment,
    o = a.sizeX,
    s = a.sizeY;
  if (i) {
    var c = Ja(e, t, n),
      l = c.x,
      u = c.y,
      d = Ya(e, o),
      f = Ya(e, s);
    (ro(e, { x: l, y: u }, r), qa(e, l, u, d, f));
  }
}
function co(e, t) {
  if (e.isPanning) {
    var n = e.velocity,
      r = e.wrapperComponent,
      i = e.contentComponent;
    e.isPanning = !1;
    var a = e.state,
      o = a.positionX,
      s = a.positionY,
      c = a.scale,
      l = e.panStartPosition;
    if (((e.panStartPosition = null), l)) {
      var u = o - l.x,
        d = s - l.y;
      if (u * u + d * d <= 25) return;
    }
    ((e.isAnimating = !1), (e.animation = null));
    var f = r?.offsetWidth || 0,
      p = r?.offsetHeight || 0,
      m = (i?.offsetWidth || 0) * c,
      h = (i?.offsetHeight || 0) * c,
      g = !e.setup.limitToBounds || f < m || p < h;
    !t && n && n.total > 0.1 && g ? io(e) : oo(e);
  }
}
function lo(e, t, n, r) {
  var i = e.setup,
    a = i.minScale,
    o = i.maxScale,
    s = i.limitToBounds,
    c = Va(Ta(t, 2), a, o, 0, !1),
    l = za(e, n, r, c, La(e, c), s);
  return { scale: c, positionX: l.x, positionY: l.y };
}
function uo(e, t, n) {
  var r = e.state.scale,
    i = e.wrapperComponent,
    a = e.setup,
    o = a.minScale,
    s = a.maxScale,
    c = a.limitToBounds,
    l = a.zoomAnimation,
    u = l.disabled,
    d = l.animationTime,
    f = l.animationType,
    p = u || (r >= o && r <= s);
  if (((r >= 1 || c) && oo(e), !(p || !i || !e.mounted))) {
    var m = t || i.offsetWidth / 2,
      h = n || i.offsetHeight / 2,
      g = lo(e, r < o ? o : s, m, h);
    g && Ma(e, g, d, f);
  }
}
var fo = function () {
  return (
    (fo =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
          for (var i in ((t = arguments[n]), t)) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }),
    fo.apply(this, arguments)
  );
};
function po(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, i = t.length, a; r < i; r++)
      (a || !(r in t)) && ((a ||= Array.prototype.slice.call(t, 0, r)), (a[r] = t[r]));
  return e.concat(a || Array.prototype.slice.call(t));
}
var mo = { previousScale: 1, scale: 1, positionX: 0, positionY: 0 },
  ho = {
    disabled: !1,
    minPositionX: null,
    maxPositionX: null,
    minPositionY: null,
    maxPositionY: null,
    minScale: 1,
    maxScale: 8,
    limitToBounds: !0,
    centerZoomedOut: !1,
    centerOnInit: !1,
    disablePadding: !1,
    smooth: !0,
    detached: !1,
    wheel: { step: 0.015, disabled: !1, wheelDisabled: !1, touchPadDisabled: !1, activationKeys: [], excluded: [] },
    trackPadPanning: {
      disabled: !0,
      velocityDisabled: !1,
      lockAxisX: !1,
      lockAxisY: !1,
      activationKeys: [],
      excluded: [],
    },
    panning: {
      disabled: !1,
      velocityDisabled: !1,
      lockAxisX: !1,
      lockAxisY: !1,
      allowLeftClickPan: !0,
      allowMiddleClickPan: !0,
      allowRightClickPan: !0,
      activationKeys: [],
      excluded: [],
    },
    pinch: { step: 5, disabled: !1, allowPanning: !0, excluded: [] },
    doubleClick: {
      disabled: !1,
      step: 0.7,
      mode: `zoomIn`,
      animationType: `easeOut`,
      animationTime: 200,
      excluded: [],
    },
    zoomAnimation: { disabled: !1, size: 0.4, animationTime: 200, animationType: `easeOut` },
    autoAlignment: {
      disabled: !1,
      sizeX: 100,
      sizeY: 100,
      animationTime: 200,
      velocityAlignmentTime: 400,
      animationType: `easeOut`,
    },
    velocityAnimation: {
      disabled: !1,
      sensitivityMouse: 1,
      sensitivityTouch: 1.2,
      maxStrengthMouse: 20,
      maxStrengthTouch: 40,
      inertia: 1,
      animationTime: 300,
      maxAnimationTime: 800,
      animationType: `easeOut`,
    },
  },
  go = { wrapperClass: `react-transform-wrapper`, contentClass: `react-transform-component` },
  _o = function (e) {
    var t = Math.max(e.minScale ?? ho.minScale, 1e-7),
      n = e.maxScale ?? ho.maxScale,
      r = e.initialScale ?? mo.scale,
      i = Math.min(Math.max(r, t), n);
    return {
      previousScale: i,
      scale: i,
      positionX: Ia(
        e.initialPositionX ?? mo.positionX,
        e.minPositionX ?? -1 / 0,
        e.maxPositionX ?? 1 / 0,
        e.minPositionX != null || e.maxPositionX != null,
      ),
      positionY: Ia(
        e.initialPositionY ?? mo.positionY,
        e.minPositionY ?? -1 / 0,
        e.maxPositionY ?? 1 / 0,
        e.minPositionY != null || e.maxPositionY != null,
      ),
    };
  },
  vo = function (e) {
    var t = fo({}, ho);
    return (
      Object.keys(e).forEach(function (n) {
        var r = n,
          i = e[r] !== void 0;
        if (ho[r] !== void 0 && i) {
          var a = Object.prototype.toString.call(ho[r]);
          a === `[object Object]`
            ? (t[r] = fo(fo({}, ho[r]), e[r]))
            : a === `[object Array]`
              ? (t[r] = po(po([], ho[r], !0), e[r], !0))
              : (t[r] = e[r]);
        }
      }),
      t.minScale <= 0 && (t.minScale = 1e-7),
      t
    );
  },
  yo = function (e, t, n) {
    var r = e.state.scale,
      i = e.wrapperComponent,
      a = e.setup,
      o = a.maxScale,
      s = a.minScale,
      c = a.zoomAnimation,
      l = a.smooth,
      u = c.size;
    if (!i) throw Error(`Wrapper is not mounted`);
    return Va(Ta(l ? r * Math.exp(t * n) : r + t * n, 3), s, o, u, !1);
  };
function bo(e, t, n, r, i) {
  var a = e.wrapperComponent,
    o = e.state,
    s = o.scale,
    c = o.positionX,
    l = o.positionY,
    u = e.setup.zoomAnimation;
  if (!a) return console.error(`No WrapperComponent found`);
  var d = u.disabled ? 0 : r,
    f = a.offsetWidth,
    p = a.offsetHeight,
    m = (f / 2 - c) / s,
    h = (p / 2 - l) / s,
    g = lo(e, yo(e, t, n), m, h);
  if (!g) return console.error(`Error during zoom event. New transformation state was not calculated.`);
  var _ = e.props,
    v = _.onZoomStart,
    y = _.onZoom,
    b = _.onZoomStop,
    x = new MouseEvent(`mousemove`, { bubbles: !0 }),
    S = Z(e);
  (X(S, x, v), X(S, x, y), Ma(e, g, d, i));
  var C = a.ownerDocument?.defaultView ?? (typeof window < `u` ? window : null);
  C &&
    C.setTimeout(function () {
      e.mounted && X(Z(e), x, b);
    }, d);
}
function xo(e, t, n, r) {
  var i = e.setup,
    a = e.wrapperComponent,
    o = e.contentComponent,
    s = i.limitToBounds,
    c = i.centerOnInit,
    l = _o(e.props),
    u = e.state,
    d = u.scale,
    f = u.positionX,
    p = u.positionY;
  if (a) {
    var m = l.positionX,
      h = l.positionY;
    if (c && o) {
      var g = zo(l.scale, a, o);
      ((m = g.positionX), (h = g.positionY));
    }
    var _ = Fa(e, l.scale),
      v = Ra(m, h, _, s, 0, 0, a),
      y = { scale: l.scale, positionX: v.x, positionY: v.y };
    if (!(d === l.scale && f === l.positionX && p === l.positionY)) {
      r?.();
      var b = e.props,
        x = b.onZoomStart,
        S = b.onZoom,
        C = b.onZoomStop,
        w = new MouseEvent(`mousemove`, { bubbles: !0 }),
        T = Z(e);
      (X(T, w, x), X(T, w, S), Ma(e, y, t, n));
      var E = a.ownerDocument?.defaultView ?? (typeof window < `u` ? window : null);
      E &&
        E.setTimeout(function () {
          e.mounted && X(Z(e), w, C);
        }, t);
    }
  }
}
function So(e, t, n, r) {
  var i = e.getBoundingClientRect(),
    a = t.getBoundingClientRect(),
    o = n.getBoundingClientRect(),
    s = a.x * r.scale,
    c = a.y * r.scale;
  return { x: (i.x - o.x + s) / r.scale, y: (i.y - o.y + c) / r.scale };
}
function Co(e, t, n, r, i) {
  (r === void 0 && (r = 0), i === void 0 && (i = 0));
  var a = e.wrapperComponent,
    o = e.contentComponent,
    s = e.state,
    c = e.setup,
    l = c.limitToBounds,
    u = c.minScale,
    d = c.maxScale;
  if (!a || !o) return s;
  var f = a.getBoundingClientRect(),
    p = t.getBoundingClientRect(),
    m = So(t, a, o, s),
    h = m.x,
    g = m.y,
    _ = p.width / s.scale,
    v = p.height / s.scale,
    y = a.offsetWidth / _,
    b = a.offsetHeight / v,
    x = Va(n || Math.min(y, b), u, d, 0, !1),
    S = (f.width - _ * x) / 2,
    C = (f.height - v * x) / 2,
    w = Ra((f.left - h) * x + S + r, (f.top - g) * x + C + i, Fa(e, x), l, 0, 0, a);
  return { positionX: w.x, positionY: w.y, scale: x };
}
var wo = function (e) {
    return function (t, n, r) {
      (t === void 0 && (t = 0.5), n === void 0 && (n = 300), r === void 0 && (r = `easeOut`), bo(e, 1, t, n, r));
    };
  },
  To = function (e) {
    return function (t, n, r) {
      (t === void 0 && (t = 0.5), n === void 0 && (n = 300), r === void 0 && (r = `easeOut`), bo(e, -1, t, n, r));
    };
  },
  Eo = function (e) {
    return function (t, n, r, i, a) {
      (i === void 0 && (i = 300), a === void 0 && (a = `easeOut`));
      var o = e.state,
        s = o.positionX,
        c = o.positionY,
        l = o.scale,
        u = e.wrapperComponent,
        d = e.contentComponent;
      e.setup.disabled ||
        !u ||
        !d ||
        Ma(
          e,
          { positionX: Number.isNaN(t) ? s : t, positionY: Number.isNaN(n) ? c : n, scale: Number.isNaN(r) ? l : r },
          i,
          a,
        );
    };
  },
  Do = function (e) {
    return function (t, n) {
      (t === void 0 && (t = 200), n === void 0 && (n = `easeOut`), xo(e, t, n));
    };
  },
  Oo = function (e) {
    return function (t, n, r) {
      (n === void 0 && (n = 200), r === void 0 && (r = `easeOut`));
      var i = e.state,
        a = e.wrapperComponent,
        o = e.contentComponent;
      a && o && Ma(e, zo(t || i.scale, a, o), n, r);
    };
  },
  ko = function (e) {
    return function (t, n, r, i, a, o) {
      (r === void 0 && (r = 600),
        i === void 0 && (i = `easeOut`),
        a === void 0 && (a = 0),
        o === void 0 && (o = 0),
        ka(e));
      var s = e.wrapperComponent,
        c = typeof t == `string` ? document.getElementById(t) : t;
      s && c && s.contains(c) && Ma(e, Co(e, c, n, a, o), r, i);
    };
  },
  Ao = function (e) {
    return {
      instance: e,
      state: e.state,
      zoomIn: wo(e),
      zoomOut: To(e),
      setTransform: Eo(e),
      resetTransform: Do(e),
      centerView: Oo(e),
      zoomToElement: ko(e),
    };
  },
  jo = function (e) {
    return { instance: e, state: e.state };
  },
  Z = function (e) {
    var t = {};
    return (Object.assign(t, jo(e)), Object.assign(t, Ao(e)), t);
  },
  Mo = !1;
function No() {
  try {
    return {
      get passive() {
        return ((Mo = !0), !1);
      },
    };
  } catch {
    return ((Mo = !1), Mo);
  }
}
var Po = `.${go.wrapperClass}`,
  Fo = function (e, t) {
    return t.some(function (t) {
      return e.matches(`${Po} ${t}, ${Po} .${t}, ${Po} ${t} *, ${Po} .${t} *`);
    });
  },
  Io = function (e) {
    e && clearTimeout(e);
  },
  Lo = function (e) {
    return Number.parseFloat(e.toFixed(8));
  },
  Ro = function (e, t, n) {
    return `translate(${e}px, ${t}px) scale(${Lo(n)})`;
  },
  zo = function (e, t, n) {
    var r = n.offsetWidth * e,
      i = n.offsetHeight * e;
    return { scale: e, positionX: (t.offsetWidth - r) / 2, positionY: (t.offsetHeight - i) / 2 };
  };
function Bo(e, t) {
  e != null && (typeof e == `function` ? e(t) : (e.current = t));
}
function Vo(e) {
  return function (t) {
    e.forEach(function (e) {
      typeof e == `function` ? e(t) : e != null && (e.current = t);
    });
  };
}
var Ho = function (e, t) {
    var n = e.setup.wheel,
      r = n.disabled,
      i = n.wheelDisabled,
      a = n.touchPadDisabled,
      o = n.excluded,
      s = e.isInitialized,
      c = e.isPanning,
      l = t.target;
    return !(
      !(s && !c && !r && l) ||
      (i && !t.ctrlKey) ||
      (a && t.ctrlKey) ||
      Fo(l, o) ||
      !e.isPressingKeys(e.setup.wheel.activationKeys)
    );
  },
  Uo = function (e, t) {
    var n = e.setup,
      r = n.disabled,
      i = n.trackPadPanning,
      a = i.activationKeys,
      o = i.excluded;
    if (!e.wrapperComponent || !e.contentComponent || r || i.disabled || t.ctrlKey || Ho(e, t)) return !1;
    var s = t.target;
    return !(Fo(s, o) || !e.isPressingKeys(a));
  },
  Wo = function (e) {
    return e ? (e.deltaY < 0 ? 1 : -1) : 0;
  };
function Go(e, t) {
  return Ea(t, Wo(e));
}
function Ko(e, t, n) {
  var r = t.getBoundingClientRect(),
    i = 0,
    a = 0;
  if (`clientX` in e) ((i = (e.clientX - r.left) / n), (a = (e.clientY - r.top) / n));
  else {
    var o = e.touches[0];
    ((i = (o.clientX - r.left) / n), (a = (o.clientY - r.top) / n));
  }
  return ((Number.isNaN(i) || Number.isNaN(a)) && console.error(`No mouse or touch offset found`), { x: i, y: a });
}
var qo = function (e, t, n, r, i) {
    var a = e.state.scale,
      o = e.wrapperComponent,
      s = e.setup,
      c = s.maxScale,
      l = s.minScale,
      u = s.zoomAnimation,
      d = s.disablePadding,
      f = u.size,
      p = u.disabled;
    if (!o) throw Error(`Wrapper is not mounted`);
    var m = a + t * n;
    return i ? m : Va(m, l, c, f, (r ? !1 : !p) && !d);
  },
  Jo = function (e, t) {
    var n = e.previousWheelEvent,
      r = e.state.scale,
      i = e.setup,
      a = i.maxScale,
      o = i.minScale;
    return n
      ? r < a ||
          r > o ||
          Math.sign(n.deltaY) !== Math.sign(t.deltaY) ||
          (n.deltaY > 0 && n.deltaY < t.deltaY) ||
          (n.deltaY < 0 && n.deltaY > t.deltaY) ||
          Math.sign(n.deltaY) !== Math.sign(t.deltaY)
      : !1;
  },
  Yo = function (e, t) {
    var n = e.setup.pinch,
      r = n.disabled,
      i = n.excluded,
      a = e.isInitialized,
      o = t.target;
    return !(!(a && !r && o) || Fo(o, i));
  },
  Xo = function (e) {
    var t = e.setup.pinch.disabled,
      n = e.isInitialized,
      r = e.pinchStartDistance;
    return !!(n && !t && r !== null);
  },
  Zo = function (e, t, n) {
    var r = n.getBoundingClientRect(),
      i = e.touches,
      a = i[0].clientX - r.left,
      o = i[0].clientY - r.top,
      s = i[1].clientX - r.left,
      c = i[1].clientY - r.top;
    return { x: (a + s) / 2 / t, y: (o + c) / 2 / t };
  },
  Qo = function (e) {
    return Math.sqrt((e.touches[0].pageX - e.touches[1].pageX) ** 2 + (e.touches[0].pageY - e.touches[1].pageY) ** 2);
  },
  $o = 5,
  es = function (e, t) {
    var n = e.pinchStartScale,
      r = e.pinchStartDistance,
      i = e.setup,
      a = i.maxScale,
      o = i.minScale,
      s = i.zoomAnimation,
      c = i.disablePadding,
      l = i.pinch,
      u = s.size,
      d = s.disabled,
      f = l.step;
    if (!n || r === null) throw Error(`Pinch touches distance was not provided`);
    if (t < 0) return e.state.scale;
    var p = n + ((t / r) * n - n) * (f / $o);
    return Va(p === 1 / 0 ? 0 : Ta(p, 10), o, a, u, !d && !c);
  },
  ts = 160,
  ns = 100,
  rs = function (e, t) {
    var n = e.props,
      r = n.onWheelStart,
      i = n.onZoomStart;
    e.wheelStopEventTimer || (ka(e), X(Z(e), t, r), X(Z(e), t, i));
  },
  is = function (e, t) {
    var n = e.props,
      r = n.onWheel,
      i = n.onZoom,
      a = e.contentComponent,
      o = e.setup,
      s = e.state.scale,
      c = o.limitToBounds,
      l = o.centerZoomedOut,
      u = o.zoomAnimation,
      d = o.wheel,
      f = o.disablePadding,
      p = o.smooth,
      m = u.size,
      h = u.disabled,
      g = d.step;
    if (!a) throw Error(`Component not mounted`);
    (t.preventDefault(), t.stopPropagation());
    var _ = qo(e, Go(t, null), p ? g * Math.abs(t.deltaY) : g, !t.ctrlKey);
    if (s !== _) {
      var v = La(e, _),
        y = Ko(t, a, s),
        b = c && (h || m === 0 || l || f),
        x = za(e, y.x, y.y, _, v, b),
        S = x.x,
        C = x.y;
      ((e.previousWheelEvent = t), e.setState(_, S, C), X(Z(e), t, r), X(Z(e), t, i));
    }
  },
  as = function (e, t) {
    var n = e.props,
      r = n.onWheelStop,
      i = n.onZoomStop;
    (Io(e.wheelAnimationTimer),
      (e.wheelAnimationTimer = setTimeout(function () {
        e.mounted && (uo(e, t.x, t.y), (e.wheelAnimationTimer = null));
      }, ns)),
      Jo(e, t) &&
        (Io(e.wheelStopEventTimer),
        (e.wheelStopEventTimer = setTimeout(function () {
          e.mounted && ((e.wheelStopEventTimer = null), X(Z(e), t, r), X(Z(e), t, i));
        }, ts))));
  },
  os = function (e, t) {
    var n = e.props,
      r = n.onWheelStart,
      i = n.onPanningStart;
    e.wheelStopEventTimer || (ka(e), X(Z(e), t, r), X(Z(e), t, i));
  },
  ss = function (e, t) {
    var n = e.props,
      r = n.onWheelStop,
      i = n.onPanningStop;
    (Io(e.wheelAnimationTimer),
      (e.wheelAnimationTimer = setTimeout(function () {
        e.mounted && (uo(e, t.x, t.y), (e.wheelAnimationTimer = null));
      }, ns)),
      Jo(e, t) &&
        (Io(e.wheelStopEventTimer),
        (e.wheelStopEventTimer = setTimeout(function () {
          e.mounted && ((e.wheelStopEventTimer = null), X(Z(e), t, r), X(Z(e), t, i));
        }, ts))));
  },
  cs = function (e) {
    for (var t = 0, n = 0, r = 0; r < 2; r += 1) ((t += e.touches[r].clientX), (n += e.touches[r].clientY));
    return { x: t / 2, y: n / 2 };
  },
  ls = function (e, t) {
    var n = Qo(t);
    ((e.pinchStartDistance = n),
      (e.lastDistance = n),
      (e.pinchStartScale = e.state.scale),
      (e.isPanning = !1),
      (e.isPinching = !0),
      (e.pinchPreviousCenter = cs(t)),
      ka(e));
  },
  us = function (e, t) {
    var n = e.contentComponent,
      r = e.pinchStartDistance,
      i = e.wrapperComponent,
      a = e.pinchPreviousCenter,
      o = e.state.scale,
      s = e.setup,
      c = s.limitToBounds,
      l = s.centerZoomedOut,
      u = s.zoomAnimation,
      d = s.autoAlignment,
      f = s.pinch,
      p = s.panning,
      m = u.disabled,
      h = u.size,
      g = f.allowPanning;
    if (!(r === null || !n)) {
      var _ = Zo(t, o, n);
      if (!(!Number.isFinite(_.x) || !Number.isFinite(_.y))) {
        var v = Qo(t),
          y = es(e, v),
          b = cs(t),
          x = o / y,
          S = (b.x - (a?.x || 0)) * x,
          C = (b.y - (a?.y || 0)) * x;
        if (!(y === o && S === 0 && C === 0)) {
          e.pinchPreviousCenter = b;
          var w = La(e, y),
            T = c && (m || h === 0 || l),
            E = za(e, _.x, _.y, y, w, T),
            D = E.x,
            O = E.y;
          if (((e.pinchMidpoint = _), (e.lastDistance = v), p.disabled || !g)) e.setState(y, D, O);
          else {
            var k = d.sizeX,
              A = d.sizeY,
              j = Ya(e, k, y),
              M = Ya(e, A, y),
              ee = Ra(D + S, O + C, w, c, j, M, i),
              N = ee.x,
              P = ee.y;
            e.setState(y, N, P);
          }
        }
      }
    }
  },
  ds = function (e) {
    var t = e.pinchMidpoint;
    ((e.velocity = null),
      (e.lastDistance = null),
      (e.pinchMidpoint = null),
      (e.pinchStartScale = null),
      (e.pinchStartDistance = null),
      (e.isPinching = !1),
      uo(e, t?.x, t?.y));
  },
  fs = function (e, t) {
    var n = e.props.onZoomStop,
      r = e.setup.doubleClick.animationTime;
    (Io(e.doubleClickStopEventTimer),
      (e.doubleClickStopEventTimer = setTimeout(function () {
        ((e.doubleClickStopEventTimer = null), X(Z(e), t, n));
      }, r)));
  },
  ps = function (e, t) {
    var n = e.props,
      r = n.onZoomStart,
      i = n.onZoom,
      a = e.setup.doubleClick,
      o = a.animationTime,
      s = a.animationType;
    (X(Z(e), t, r),
      xo(e, o, s, function () {
        return X(Z(e), t, i);
      }),
      fs(e, t));
  };
function ms(e, t) {
  return e === `toggle` ? (t === 1 ? 1 : -1) : e === `zoomOut` ? -1 : 1;
}
function hs(e, t) {
  var n = e.setup,
    r = e.doubleClickStopEventTimer,
    i = e.state,
    a = e.contentComponent,
    o = i.scale,
    s = e.props,
    c = s.onZoomStart,
    l = s.onZoom,
    u = n.doubleClick,
    d = u.disabled,
    f = u.mode,
    p = u.step,
    m = u.animationTime,
    h = u.animationType;
  if (!d && !r) {
    if (f === `reset`) return ps(e, t);
    if (!a) return console.error(`No ContentComponent found`);
    var g = yo(e, ms(f, e.state.scale), p);
    if (o !== g) {
      X(Z(e), t, c);
      var _ = Ko(t, a, o),
        v = lo(e, g, _.x, _.y);
      if (!v) return console.error(`Error during zoom event. New transformation state was not calculated.`);
      (X(Z(e), t, l), Ma(e, v, m, h), fs(e, t));
    }
  }
}
var gs = function (e, t) {
    var n = e.isInitialized,
      r = e.setup,
      i = e.wrapperComponent,
      a = r.doubleClick,
      o = a.disabled,
      s = a.excluded,
      c = t.target,
      l = i?.contains(c);
    return !(!(n && c && l && !o) || Fo(c, s));
  },
  _s = (function () {
    function e(e) {
      var t = this;
      ((this.mounted = !0),
        (this.onChangeCallbacks = new Set()),
        (this.onInitCallbacks = new Set()),
        (this.onTransformCallbacks = new Set()),
        (this.wrapperComponent = null),
        (this.contentComponent = null),
        (this.isInitialized = !1),
        (this.bounds = null),
        (this.previousWheelEvent = null),
        (this.wheelStopEventTimer = null),
        (this.wheelAnimationTimer = null),
        (this.isPanning = !1),
        (this.isWheelPanning = !1),
        (this.startCoords = null),
        (this.panStartPosition = null),
        (this.lastTouch = null),
        (this.isPinching = !1),
        (this.distance = null),
        (this.lastDistance = null),
        (this.pinchStartDistance = null),
        (this.pinchStartScale = null),
        (this.pinchMidpoint = null),
        (this.pinchPreviousCenter = null),
        (this.doubleClickStopEventTimer = null),
        (this.velocity = null),
        (this.velocityTime = null),
        (this.lastMousePosition = null),
        (this.isAnimating = !1),
        (this.animation = null),
        (this.pressedKeys = {}),
        (this.mount = function () {
          t.initializeWindowEvents();
        }),
        (this.unmount = function () {
          t.cleanupWindowEvents();
        }),
        (this.update = function (e) {
          ((t.props = e), t.wrapperComponent && t.contentComponent && La(t, t.state.scale), (t.setup = vo(e)));
        }),
        (this.initializeWindowEvents = function () {
          var e,
            n,
            r,
            i = No(),
            a = t.wrapperComponent?.ownerDocument,
            o = a?.defaultView;
          ((e = t.wrapperComponent) == null || e.addEventListener(`wheel`, t.onWheelPanning, i),
            (n = t.wrapperComponent) == null || n.addEventListener(`keyup`, t.setKeyUnPressed, i),
            (r = t.wrapperComponent) == null || r.addEventListener(`keydown`, t.setKeyPressed, i),
            o?.addEventListener(`mousedown`, t.onPanningStart, i),
            o?.addEventListener(`mousemove`, t.onPanning, i),
            o?.addEventListener(`mouseup`, t.onPanningStop, i),
            a?.addEventListener(`mouseleave`, t.clearPanning, i),
            o?.addEventListener(`keyup`, t.setKeyUnPressed, i),
            o?.addEventListener(`keydown`, t.setKeyPressed, i),
            o?.addEventListener(`blur`, t.handleWindowBlur));
        }),
        (this.cleanupWindowEvents = function () {
          var e,
            n,
            r,
            i,
            a = No(),
            o = t.wrapperComponent?.ownerDocument,
            s = o?.defaultView;
          (s?.removeEventListener(`mousedown`, t.onPanningStart, a),
            s?.removeEventListener(`mousemove`, t.onPanning, a),
            s?.removeEventListener(`mouseup`, t.onPanningStop, a),
            o?.removeEventListener(`mouseleave`, t.clearPanning, a),
            s?.removeEventListener(`keyup`, t.setKeyUnPressed, a),
            s?.removeEventListener(`keydown`, t.setKeyPressed, a),
            s?.removeEventListener(`blur`, t.handleWindowBlur),
            document.removeEventListener(`mouseleave`, t.clearPanning, a),
            (e = t.wrapperComponent) == null || e.removeEventListener(`wheel`, t.onWheelPanning, a),
            (n = t.wrapperComponent) == null || n.removeEventListener(`keyup`, t.setKeyUnPressed, a),
            (r = t.wrapperComponent) == null || r.removeEventListener(`keydown`, t.setKeyPressed, a),
            ka(t),
            (i = t.observer) == null || i.disconnect());
        }),
        (this.handleInitializeWrapperEvents = function (e) {
          var n = No();
          (e.addEventListener(`wheel`, t.onWheelZoom, n),
            e.addEventListener(`dblclick`, t.onDoubleClick, n),
            e.addEventListener(`touchstart`, t.onTouchPanningStart, n),
            e.addEventListener(`touchmove`, t.onTouchPanning, n),
            e.addEventListener(`touchend`, t.onTouchPanningStop, n));
        }),
        (this.handleInitialize = function (e) {
          var n = t.setup.centerOnInit;
          (t.applyTransformation(),
            t.onInitCallbacks.forEach(function (e) {
              return e(Z(t));
            }),
            n &&
              (t.setCenter(),
              (t.observer = new ResizeObserver(function () {
                var n,
                  r = e.offsetWidth,
                  i = e.offsetHeight;
                (r > 0 || i > 0) &&
                  (t.onInitCallbacks.forEach(function (e) {
                    return e(Z(t));
                  }),
                  t.setCenter(),
                  (n = t.observer) == null || n.disconnect());
              })),
              setTimeout(function () {
                var e;
                (e = t.observer) == null || e.disconnect();
              }, 5e3),
              t.observer.observe(e)));
        }),
        (this.onWheelZoom = function (e) {
          t.setup.disabled || (t.syncModifierKeys(e), Ho(t, e) && (rs(t, e), is(t, e), as(t, e)));
        }),
        (this.onWheelPanning = function (e) {
          var n = t.props.onPanning,
            r = t.setup.trackPadPanning,
            i = r.lockAxisX,
            a = r.lockAxisY;
          if ((t.syncModifierKeys(e), Uo(t, e))) {
            (e.preventDefault(), e.stopPropagation());
            var o = t.state,
              s = o.positionX,
              c = o.positionY,
              l = s - e.deltaX,
              u = c - e.deltaY,
              d = i ? s : l,
              f = a ? c : u,
              p = t.setup.autoAlignment,
              m = p.sizeX,
              h = p.sizeY,
              g = Ya(t, m),
              _ = Ya(t, h);
            (d === s && f === c) || (os(t, e), qa(t, d, f, g, _), X(Z(t), e, n), ss(t, e));
          }
        }),
        (this.onPanningStart = function (e) {
          var n = t.setup.disabled,
            r = t.props.onPanningStart;
          n ||
            (t.syncModifierKeys(e),
            Ha(t, e) &&
              t.isPressingKeys(t.setup.panning.activationKeys) &&
              ((e.button === 0 && !t.setup.panning.allowLeftClickPan) ||
                (e.button === 1 && !t.setup.panning.allowMiddleClickPan) ||
                (e.button === 2 && !t.setup.panning.allowRightClickPan) ||
                (e.preventDefault(), e.stopPropagation(), ka(t), ao(t, e), X(Z(t), e, r))));
        }),
        (this.onPanning = function (e) {
          var n = t.setup.disabled,
            r = t.props.onPanning;
          if (!n) {
            if ((t.syncModifierKeys(e), t.isPanning && e.buttons === 0)) {
              t.clearPanning(e);
              return;
            }
            Ua(t) &&
              t.isPressingKeys(t.setup.panning.activationKeys) &&
              (e.preventDefault(), e.stopPropagation(), so(t, e.clientX, e.clientY, Xa.MOUSE), X(Z(t), e, r));
          }
        }),
        (this.onPanningStop = function (e) {
          var n = t.setup.panning.velocityDisabled,
            r = t.props.onPanningStop;
          t.isPanning && (co(t, n), X(Z(t), e, r));
        }),
        (this.onPinchStart = function (e) {
          var n = t.setup.disabled,
            r = t.props.onPinchStart;
          n || (Yo(t, e) && (ls(t, e), ka(t), X(Z(t), e, r)));
        }),
        (this.onPinch = function (e) {
          var n = t.setup.disabled,
            r = t.props.onPinch;
          n || (Xo(t) && (e.preventDefault(), e.stopPropagation(), us(t, e), X(Z(t), e, r)));
        }),
        (this.onPinchStop = function (e) {
          var n = t.props.onPinchStop;
          t.pinchStartScale && (ds(t), X(Z(t), e, n));
        }),
        (this.onTouchPanningStart = function (e) {
          var n = t.setup,
            r = n.disabled,
            i = n.doubleClick,
            a = t.props.onPanningStart;
          if (!r) {
            var o = !i?.disabled,
              s = t.lastTouch && +new Date() - t.lastTouch < 200;
            if (o && s && e.touches.length === 1) t.onDoubleClick(e);
            else {
              ((t.lastTouch = +new Date()), ka(t));
              var c = e.touches,
                l = c.length === 1,
                u = c.length === 2,
                d = Ha(t, e);
              if (l) {
                if (!d) return;
                (ka(t), ao(t, e), X(Z(t), e, a));
              }
              u && t.onPinchStart(e);
            }
          }
        }),
        (this.onTouchPanning = function (e) {
          var n = t.setup.disabled,
            r = t.props.onPanning;
          if (t.isPanning && e.touches.length === 1) {
            if (n || !Ua(t)) return;
            (e.cancelable && e.preventDefault(), e.stopPropagation());
            var i = e.touches[0];
            (so(t, i.clientX, i.clientY, Xa.TOUCH), X(Z(t), e, r));
          } else e.touches.length > 1 && t.onPinch(e);
        }),
        (this.onTouchPanningStop = function (e) {
          (t.onPanningStop(e), t.onPinchStop(e));
        }),
        (this.onDoubleClick = function (e) {
          t.setup.disabled || (gs(t, e) && hs(t, e));
        }),
        (this.clearPanning = function (e) {
          t.isPanning && t.onPanningStop(e);
        }),
        (this.handleWindowBlur = function () {
          ((t.pressedKeys = {}), t.isPanning && ((t.isPanning = !1), (t.startCoords = null)));
        }),
        (this.syncModifierKeys = function (e) {
          var n = e.ctrlKey,
            r = e.metaKey,
            i = e.shiftKey,
            a = e.altKey;
          (typeof n == `boolean` && (t.pressedKeys.Control = n),
            typeof r == `boolean` && (t.pressedKeys.Meta = r),
            typeof i == `boolean` && (t.pressedKeys.Shift = i),
            typeof a == `boolean` && (t.pressedKeys.Alt = a));
        }),
        (this.setKeyPressed = function (e) {
          t.pressedKeys[e.key] = !0;
        }),
        (this.setKeyUnPressed = function (e) {
          t.pressedKeys[e.key] = !1;
        }),
        (this.isPressingKeys = function (e) {
          return typeof e == `function`
            ? e(
                Object.entries(t.pressedKeys)
                  .filter(function (e) {
                    return e[1];
                  })
                  .map(function (e) {
                    return e[0];
                  }),
              )
            : e.length
              ? !!e.every(function (e) {
                  return t.pressedKeys[e];
                })
              : !0;
        }),
        (this.setCenter = function () {
          if (t.wrapperComponent && t.contentComponent) {
            var e = zo(t.state.scale, t.wrapperComponent, t.contentComponent);
            t.setState(e.scale, e.positionX, e.positionY);
          }
        }),
        (this.handleTransformStyles = function (e, n, r) {
          return t.props.customTransform ? t.props.customTransform(e, n, r) : Ro(e, n, r);
        }),
        (this.getContext = function () {
          return Z(t);
        }),
        (this.applyTransformation = function () {
          if (!(!t.mounted || !t.contentComponent)) {
            var e = t.state,
              n = e.scale,
              r = e.positionX,
              i = e.positionY,
              a = t.handleTransformStyles(r, i, n);
            (t.props.detached || (t.contentComponent.style.transform = a),
              t.onTransformCallbacks.forEach(function (e) {
                return e({ scale: n, positionX: r, positionY: i, previousScale: t.state.previousScale, ref: Z(t) });
              }));
          }
        }),
        (this.setState = function (e, n, r) {
          var i = t.props.onTransform;
          if (!Number.isNaN(e) && !Number.isNaN(n) && !Number.isNaN(r)) {
            var a = Math.max(e, 1e-7);
            (a !== t.state.scale && ((t.state.previousScale = t.state.scale), (t.state.scale = a)),
              (t.state.positionX = n),
              (t.state.positionY = r),
              t.applyTransformation());
            var o = Z(t);
            (t.onChangeCallbacks.forEach(function (e) {
              return e(o);
            }),
              X(o, { scale: t.state.scale, positionX: n, positionY: r }, i));
          } else console.error(`Detected NaN set state values`);
        }),
        (this.onTransform = function (e) {
          return (
            t.onTransformCallbacks.has(e) || t.onTransformCallbacks.add(e),
            function () {
              t.onTransformCallbacks.delete(e);
            }
          );
        }),
        (this.onChange = function (e) {
          return (
            t.onChangeCallbacks.has(e) || t.onChangeCallbacks.add(e),
            function () {
              t.onChangeCallbacks.delete(e);
            }
          );
        }),
        (this.onInit = function (e) {
          return (
            t.onInitCallbacks.has(e) || t.onInitCallbacks.add(e),
            function () {
              t.onInitCallbacks.delete(e);
            }
          );
        }),
        (this.init = function (e, n) {
          (t.cleanupWindowEvents(),
            (t.wrapperComponent = e),
            (t.contentComponent = n),
            La(t, t.state.scale),
            t.handleInitializeWrapperEvents(e),
            t.handleInitialize(n),
            t.initializeWindowEvents(),
            (t.isInitialized = !0));
          var r = Z(t);
          (X(r, void 0, t.props.onInit), Bo(t.props.ref, r));
        }),
        (this.props = e),
        (this.setup = vo(this.props)),
        (this.state = _o(this.props)));
    }
    return e;
  })(),
  vs = _.createContext(null),
  ys = function (e, t) {
    return typeof e == `function` ? e(t) : e;
  },
  bs = _.forwardRef(function (e, t) {
    var n = (0, _.useRef)(new _s(e)).current,
      r = ys(e.children, Ao(n));
    return (
      (0, _.useImperativeHandle)(
        t,
        function () {
          return Ao(n);
        },
        [n],
      ),
      (0, _.useEffect)(
        function () {
          n.update(e);
        },
        [n, e],
      ),
      (0, U.jsx)(vs.Provider, fo({ value: n }, { children: r }))
    );
  });
_.forwardRef(function (e, t) {
  var n = (0, _.useRef)(null),
    r = (0, _.useContext)(vs);
  return (
    (0, _.useEffect)(
      function () {
        return r.onChange(function (e) {
          if (n.current) {
            var t = 0,
              i = 0;
            n.current.style.transform = r.handleTransformStyles(t, i, 1 / e.instance.state.scale);
          }
        });
      },
      [r],
    ),
    (0, U.jsx)(`div`, fo({}, e, { ref: Vo([n, t]) }))
  );
});
function xs(e, t) {
  t === void 0 && (t = {});
  var n = t.insertAt;
  if (!(!e || typeof document > `u`)) {
    var r = document.head || document.getElementsByTagName(`head`)[0],
      i = document.createElement(`style`);
    ((i.type = `text/css`),
      n === `top` && r.firstChild ? r.insertBefore(i, r.firstChild) : r.appendChild(i),
      i.styleSheet ? (i.styleSheet.cssText = e) : i.appendChild(document.createTextNode(e)));
  }
}
var Ss = `.transform-component-module_wrapper__SPB86 {
  position: relative;
  width: -moz-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: fit-content;
  overflow: hidden;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  margin: 0;
  padding: 0;
  transform: translate3d(0, 0, 0);
}
.transform-component-module_content__FBWxo {
  display: flex;
  flex-wrap: wrap;
  width: -moz-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: fit-content;
  margin: 0;
  padding: 0;
  transform-origin: 0% 0%;
}
.transform-component-module_content__FBWxo img {
  pointer-events: none;
}
.transform-component-module_infiniteGrid__Z-aP3 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.12) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  background-position: 0 0;
}
`,
  Cs = {
    wrapper: `transform-component-module_wrapper__SPB86`,
    content: `transform-component-module_content__FBWxo`,
    infiniteGrid: `transform-component-module_infiniteGrid__Z-aP3`,
  };
xs(Ss);
var ws = function (e) {
  var t = e.children,
    n = e.wrapperClass,
    r = n === void 0 ? `` : n,
    i = e.contentClass,
    a = i === void 0 ? `` : i,
    o = e.wrapperStyle,
    s = e.contentStyle,
    c = e.wrapperProps,
    l = c === void 0 ? {} : c,
    u = e.contentProps,
    d = u === void 0 ? {} : u,
    f = e.infinite,
    p = f === void 0 ? !1 : f,
    m = (0, _.useContext)(vs),
    h = m.init,
    g = m.cleanupWindowEvents,
    v = (0, _.useRef)(null),
    y = (0, _.useRef)(null),
    b = (0, _.useRef)(null);
  return (
    (0, _.useEffect)(function () {
      var e = v.current,
        t = y.current;
      return (
        e !== null && t !== null && h && h?.(e, t),
        function () {
          g?.();
        }
      );
    }, []),
    (0, _.useEffect)(
      function () {
        if (p) {
          var e = b.current;
          if (e) {
            var t = function () {
              var t = m.state,
                n = t.positionX,
                r = t.positionY;
              e.style.backgroundPosition = `${n}px ${r}px`;
            };
            return (t(), m.onChange(t));
          }
        }
      },
      [p, m],
    ),
    (0, U.jsxs)(
      `div`,
      fo(
        {},
        l,
        { ref: v, className: `${go.wrapperClass} ${Cs.wrapper} ${r}`, style: o },
        {
          children: [
            p && (0, U.jsx)(`div`, { ref: b, className: Cs.infiniteGrid, 'aria-hidden': !0 }),
            (0, U.jsx)(
              `div`,
              fo(
                {},
                d,
                {
                  ref: y,
                  className: `${go.contentClass} ${Cs.content} ${a}`,
                  style: fo(fo({}, s), { transform: Ro(m.state.positionX, m.state.positionY, m.state.scale) }),
                },
                { children: t },
              ),
            ),
          ],
        },
      ),
    )
  );
};
function Ts(e, t) {
  return (
    Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)) *
    Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y))
  );
}
function Es(e) {
  var t = e.elementX,
    n = e.elementY,
    r = e.elementWidth,
    i = e.elementHeight,
    a = e.scale,
    o = e.positionX,
    s = e.positionY,
    c = e.viewportWidth,
    l = e.viewportHeight,
    u = e.margin,
    d = u === void 0 ? 0 : u,
    f = e.threshold,
    p = f === void 0 ? 0 : f,
    m = { x: -d, y: -d, width: c + 2 * d, height: l + 2 * d },
    h = { x: t * a + o, y: n * a + s, width: r * a, height: i * a };
  if (p <= 0) {
    var g = h.x < m.x + m.width && h.x + h.width > m.x,
      _ = h.y < m.y + m.height && h.y + h.height > m.y;
    return g && _;
  }
  var v = h.width * h.height;
  return v <= 0 ? !1 : Ts(m, h) / v >= p;
}
_.forwardRef(function (e, t) {
  var n = e.x,
    r = e.y,
    i = e.width,
    a = e.height,
    o = e.margin,
    s = o === void 0 ? 0 : o,
    c = e.threshold,
    l = c === void 0 ? 0 : c,
    u = e.placeholder,
    d = u === void 0 ? null : u,
    f = e.onShow,
    p = e.onHide,
    m = e.children,
    h = e.className,
    g = e.style,
    v = (0, _.useContext)(vs),
    y = (0, _.useState)(!1),
    b = y[0],
    x = y[1],
    S = (0, _.useRef)(!1),
    C = (0, _.useRef)(f),
    w = (0, _.useRef)(p);
  return (
    (C.current = f),
    (w.current = p),
    (0, _.useEffect)(
      function () {
        var e = function () {
          var e,
            t,
            o = v.wrapperComponent;
          if (o) {
            var c = Es({
              elementX: n,
              elementY: r,
              elementWidth: i,
              elementHeight: a,
              scale: v.state.scale,
              positionX: v.state.positionX,
              positionY: v.state.positionY,
              viewportWidth: o.offsetWidth,
              viewportHeight: o.offsetHeight,
              margin: s,
              threshold: l,
            });
            c !== S.current &&
              ((S.current = c), x(c), c ? (e = C.current) == null || e.call(C) : (t = w.current) == null || t.call(w));
          }
        };
        e();
        var t = v.onChange(e),
          o;
        return (
          v.wrapperComponent ||
            (o = v.onInit(function () {
              return e();
            })),
          function () {
            (t(), o?.());
          }
        );
      },
      [v, n, r, i, a, s, l],
    ),
    b
      ? (0, U.jsx)(`div`, fo({ ref: t, className: h, style: g }, { children: m }))
      : d
        ? (0, U.jsx)(U.Fragment, { children: d })
        : null
  );
});
var Ds = ({
    profile: e,
    setProfile: t,
    mode: n,
    setMode: r,
    customRows: i,
    setCustomRows: a,
    customCols: o,
    setCustomCols: s,
    onStart: c,
    onJoin: l,
  }) => {
    let u = { classic: 9, extended: 14, marathon: 19 },
      d = n === `custom` ? i : u[n] || 9,
      f = n === `custom` ? o : u[n] || 9,
      p = (0, _.useCallback)(() => {
        c({ rows: d, cols: f });
      }, [d, f, c]),
      m = (0, _.useCallback)(async () => {
        let { value: e } = await K.default.fire({
          title: `Join DAB Room`,
          input: `text`,
          inputPlaceholder: `Enter Room ID`,
          showCancelButton: !0,
          customClass: { popup: J },
        });
        e && l(e.trim().toUpperCase());
      }, [l]);
    return (0, U.jsxs)(`div`, {
      className: `min-h-screen bg-paper flex flex-col items-center justify-center p-4`,
      children: [
        (0, U.jsxs)(Ii, {
          className: `p-6 max-w-md w-full mb-4`,
          children: [
            (0, U.jsx)(`input`, {
              type: `text`,
              value: e.name,
              onChange: (e) => t((t) => ({ ...t, name: e.target.value })),
              placeholder: `Enter your name`,
              className: `w-full sketch-border font-handwriting text-ink px-3 py-2 rounded mb-4`,
            }),
            (0, U.jsx)(Y, {
              avatarIcon: e.avatarIcon,
              color: e.color,
              onAvatarChange: (e) => t((t) => ({ ...t, avatarIcon: e })),
              onColorChange: (e) => t((t) => ({ ...t, color: e })),
            }),
          ],
        }),
        (0, U.jsxs)(Ii, {
          className: `p-8 max-w-md w-full space-y-4`,
          children: [
            (0, U.jsxs)(`div`, {
              children: [
                (0, U.jsx)(`p`, { className: `paper-font text-sm text-ink/60 mb-2`, children: `Game Mode` }),
                (0, U.jsxs)(`div`, {
                  className: `grid grid-cols-3 gap-2`,
                  children: [
                    (0, U.jsx)(q, {
                      onClick: () => r(`classic`),
                      className: n === `classic` ? `bg-ink text-white` : ``,
                      children: `Classic`,
                    }),
                    (0, U.jsx)(q, {
                      onClick: () => r(`extended`),
                      className: n === `extended` ? `bg-ink text-white` : ``,
                      children: `Extended`,
                    }),
                    (0, U.jsx)(q, {
                      onClick: () => r(`marathon`),
                      className: n === `marathon` ? `bg-ink text-white` : ``,
                      children: `Marathon`,
                    }),
                  ],
                }),
                (0, U.jsx)(q, {
                  onClick: () => r(`custom`),
                  className: `w-full mt-2 ${n === `custom` ? `bg-ink text-white` : ``}`,
                  children: `Custom Size`,
                }),
              ],
            }),
            n === `custom` &&
              (0, U.jsxs)(`div`, {
                className: `space-y-3`,
                children: [
                  (0, U.jsxs)(`div`, {
                    children: [
                      (0, U.jsxs)(`label`, { className: `paper-font text-sm text-ink/70`, children: [`Rows: `, i] }),
                      (0, U.jsx)(`input`, {
                        type: `range`,
                        min: `3`,
                        max: `30`,
                        value: i,
                        onChange: (e) => a(Number(e.target.value)),
                        className: `w-full`,
                      }),
                    ],
                  }),
                  (0, U.jsxs)(`div`, {
                    children: [
                      (0, U.jsxs)(`label`, { className: `paper-font text-sm text-ink/70`, children: [`Columns: `, o] }),
                      (0, U.jsx)(`input`, {
                        type: `range`,
                        min: `3`,
                        max: `30`,
                        value: o,
                        onChange: (e) => s(Number(e.target.value)),
                        className: `w-full`,
                      }),
                    ],
                  }),
                ],
              }),
            (0, U.jsxs)(`p`, {
              className: `paper-font text-xs text-ink/60`,
              children: [`Selected size: `, d, ` × `, f],
            }),
            (0, U.jsxs)(`div`, {
              className: `grid grid-cols-2 gap-3`,
              children: [
                (0, U.jsx)(q, { onClick: p, className: `w-full`, children: `Start Game` }),
                (0, U.jsx)(q, { onClick: m, className: `w-full`, children: `Join Room` }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Os = [`#1a1a2e`, `#c73e1d`, `#2d4a8f`, `#2f5233`],
  ks = (e, t, n, r, i = 0) => {
    let a = 1.5,
      o = [];
    for (let s = 0; s <= 8; s++) {
      let c = s / 8,
        l = e + (n - e) * c,
        u = t + (r - t) * c,
        d = Math.sin(i + s * 2.3) * a,
        f = Math.cos(i + s * 1.7) * a;
      o.push(`${l + d},${u + f}`);
    }
    return `M ${o[0]} ${o
      .slice(1)
      .map((e) => `L ${e}`)
      .join(` `)}`;
  },
  As = () => {
    let {
        socket: e,
        playerName: t,
        roomId: n,
        setRoomId: r,
        clearRoomId: i,
        setGamePrefix: a,
        profile: o,
        setProfile: s,
      } = Lr(),
      c = Re(),
      [l, u] = (0, _.useState)([]),
      [d, f] = (0, _.useState)(`waiting`),
      [p, m] = (0, _.useState)(0),
      [h, g] = (0, _.useState)(9),
      [v, y] = (0, _.useState)(9),
      [b, x] = (0, _.useState)([]),
      [S, C] = (0, _.useState)([]),
      [w, T] = (0, _.useState)([]),
      [E, D] = (0, _.useState)([]),
      [O, k] = (0, _.useState)(null),
      [A, j] = (0, _.useState)(`classic`),
      [M, ee] = (0, _.useState)(5),
      [N, P] = (0, _.useState)(5),
      [te, ne] = (0, _.useState)(-1),
      [re, F] = (0, _.useState)(!1),
      [ie, ae] = (0, _.useState)(null),
      [oe] = da(`/sounds/move.mp3`, { volume: 0.5 }),
      [se] = da(`/sounds/win.mp3`, { volume: 0.7 }),
      ce = (0, _.useCallback)(() => {
        K.default
          .fire({
            title: `Leave Game?`,
            text: `Are you sure you want to leave?`,
            icon: `warning`,
            showCancelButton: !0,
            confirmButtonText: `Yes, leave`,
            cancelButtonText: `Stay`,
            customClass: { popup: J },
          })
          .then((t) => {
            t.isConfirmed && (e.emit(`dab_leaveRoom`, n), sessionStorage.removeItem(`dab_reconnect`), i(n), c(`/`));
          });
      }, [e, i, c, n]),
      le = (0, _.useCallback)(
        ({ rows: t, cols: r }) => {
          (g(t), y(r), e.emit(`dab_startGame`, { roomId: n, rows: t, cols: r }));
        },
        [n, e],
      ),
      ue = (0, _.useCallback)(
        (n) => {
          e.emit(`dab_joinRoom`, { roomId: n, playerName: o.name || t, avatarIcon: o.avatarIcon, color: o.color });
        },
        [t, o, e],
      ),
      { clearReconnect: I } = ha({
        socket: e,
        gamePrefix: `dab`,
        roomId: n,
        onRestore: (t) => {
          t &&
            (r(t.id),
            u(t.players || []),
            f(t.gameState || `waiting`),
            m(t.currentTurn),
            g(t.rows),
            y(t.cols),
            x(t.horizontalLines || []),
            C(t.verticalLines || []),
            T(t.boxes || []),
            D(t.scores || []),
            k(t.lastMove || null),
            F(t.gameState === `paused`),
            ne((t.players || []).findIndex((t) => t.id === e?.id)),
            t.settings &&
              (j(t.settings.mode || `classic`), ee(t.settings.customRows || 5), P(t.settings.customCols || 5)));
        },
      });
    (ma(
      e,
      {
        dab_gameStarted: () => {
          (H.socket(`⬅️`, `dab_gameStarted`),
            f(`playing`),
            F(!1),
            K.default.fire({
              title: `Game Started!`,
              text: `Draw lines to claim boxes!`,
              timer: 1500,
              showConfirmButton: !1,
              customClass: { popup: J },
            }));
        },
        dab_gameRestarted: () => {
          (H.socket(`⬅️`, `dab_gameRestarted`),
            f(`waiting`),
            m(0),
            x(Array.from({ length: h }, () => Array(v).fill(null))),
            C(Array.from({ length: h }, () => Array(v + 1).fill(null))),
            T(Array.from({ length: h }, () => Array(v).fill(null))),
            D(Array(l.length).fill(0)),
            k(null),
            F(!1),
            K.default.fire({
              title: `Game Restarted`,
              text: `New game starting!`,
              timer: 1500,
              showConfirmButton: !1,
              customClass: { popup: J },
            }));
        },
        dab_moveResult: ({ lineType: e, r: t, c: n, claimedBoxes: r, scores: i, currentTurn: a, playerIndex: o }) => {
          (oe(),
            x((r) => {
              let i = r.map((e) => [...e]);
              return (e === `h` && (i[t][n] = o), i);
            }),
            C((r) => {
              let i = r.map((e) => [...e]);
              return (e === `v` && (i[t][n] = o), i);
            }),
            r &&
              r.length > 0 &&
              (se(),
              pa({
                particleCount: 25,
                spread: 35,
                origin: { y: 0.6 },
                colors: [l[o]?.color || Os[o] || `#2a2a3e`],
                decay: 0.85,
                gravity: 0.5,
              }),
              T((e) => {
                let t = e.map((e) => [...e]);
                for (let e of r) t[e.r][e.c] = o;
                return t;
              })),
            D(i),
            m(a),
            k({ lineType: e, r: t, c: n }));
        },
        dab_gameOver: ({ winner: e, scores: t }) => {
          (H.socket(`⬅️`, `dab_gameOver`),
            f(`ended`),
            D(t),
            sessionStorage.removeItem(`dab_reconnect`),
            pa({ particleCount: 150, spread: 70, origin: { y: 0.6 } }),
            e ||
              K.default.fire({
                title: `It's a Tie!`,
                text: `Multiple players share the top score!`,
                icon: `info`,
                customClass: { popup: J },
              }));
        },
        dab_playerLeft: ({ playerId: e }) => {
          u((t) => t.map((t) => (t.id === e ? { ...t, connected: !1 } : t)));
        },
        dab_playerReconnected: ({ playerId: e }) => {
          (u((t) => t.map((t) => (t.id === e ? { ...t, connected: !0 } : t))), F(!1));
        },
        dab_gamePaused: () => F(!0),
        dab_redoRequested: ({ requesterId: e }) => ae(e),
        dab_redoCancelled: () => ae(null),
        dab_moveUndone: ({ horizontalLines: e, verticalLines: t, boxes: n, scores: r, currentTurn: i }) => {
          (x(e), C(t), T(n), D(r), m(i), k(null), ae(null));
        },
      },
      [h, v, l, se, oe, n],
    ),
      ma(
        e,
        {
          dab_redoResponse: ({ accepted: e, reason: t, requesterId: n, requesterName: r }) => {
            if (e) ae(null);
            else if ((ae(null), t === `Requester disconnected.`))
              K.default.fire({
                title: `Redo Failed`,
                text: `The player who requested undo disconnected.`,
                icon: `info`,
                customClass: { popup: J },
              });
            else {
              let e = r || l.find((e) => e.id === n)?.name || `Someone`;
              K.default.fire({
                title: `Undo Denied`,
                text: `${e}'s undo request was denied.`,
                icon: `warning`,
                customClass: { popup: J },
              });
            }
          },
          server_shutdown: ({ message: e }) => {
            K.default
              .fire({
                title: `Server Shutting Down`,
                text: e || `The server is going down for maintenance.`,
                icon: `info`,
                customClass: { popup: J },
              })
              .then(() => {
                (sessionStorage.removeItem(`dab_reconnect`), i(n), c(`/`));
              });
          },
        },
        [l, i, n, c],
      ),
      (0, _.useEffect)(() => {
        e && (a(`dab`), H.socket(`➡️`, `dab_requestRoomInfo`, { roomId: n }), n && e.emit(`dab_requestRoomInfo`, n));
      }, [e, n, a]));
    let de = (0, _.useCallback)(() => {
        e.emit(`dab_restartGame`, n);
      }, [n, e]),
      fe = (0, _.useCallback)(() => {
        ce();
      }, [ce]),
      L = (0, _.useCallback)(() => {
        n && le({ rows: h, cols: v });
      }, [le, n, h, v]),
      pe = (0, _.useCallback)(() => {
        e.emit(`dab_requestRedo`, n);
      }, [n, e]),
      me = (0, _.useCallback)(
        (t) => {
          e.emit(`dab_respondRedo`, { roomId: n, accept: t });
        },
        [n, e],
      ),
      he = (0, _.useCallback)(
        (t, r, i) => {
          d !== `playing` ||
            re ||
            te !== p ||
            ((t === `h` ? b : S)[r]?.[i] === null && e.emit(`dab_makeMove`, { roomId: n, lineType: t, r, c: i }));
        },
        [d, re, te, p, b, S, n, e],
      ),
      R = n && l[0]?.id === e?.id,
      ge = (0, U.jsxs)(`div`, {
        className: `space-y-3`,
        children: [
          (0, U.jsx)(`p`, { className: `paper-font text-sm text-ink/60`, children: `Game Mode` }),
          (0, U.jsx)(`div`, {
            className: `grid grid-cols-3 gap-2`,
            children: [`classic`, `extended`, `marathon`].map((e) =>
              (0, U.jsx)(q, { onClick: () => j(e), className: A === e ? `bg-ink text-white` : ``, children: e }, e),
            ),
          }),
          (0, U.jsx)(q, {
            onClick: () => j(`custom`),
            className: A === `custom` ? `bg-ink text-white` : ``,
            children: `Custom Size`,
          }),
          A === `custom` &&
            (0, U.jsxs)(`div`, {
              className: `space-y-3`,
              children: [
                (0, U.jsxs)(`div`, {
                  children: [
                    (0, U.jsxs)(`label`, { className: `paper-font text-sm text-ink/70`, children: [`Rows: `, M] }),
                    (0, U.jsx)(`input`, {
                      type: `range`,
                      min: `3`,
                      max: `30`,
                      value: M,
                      onChange: (e) => ee(Number(e.target.value)),
                      className: `w-full`,
                    }),
                  ],
                }),
                (0, U.jsxs)(`div`, {
                  children: [
                    (0, U.jsxs)(`label`, { className: `paper-font text-sm text-ink/70`, children: [`Columns: `, N] }),
                    (0, U.jsx)(`input`, {
                      type: `range`,
                      min: `3`,
                      max: `30`,
                      value: N,
                      onChange: (e) => P(Number(e.target.value)),
                      className: `w-full`,
                    }),
                  ],
                }),
              ],
            }),
        ],
      }),
      _e = v * 60,
      ve = h * 60;
    return n
      ? d === `waiting`
        ? (0, U.jsx)(Hi, {
            gameName: `Dots & Boxes`,
            roomId: n,
            players: l,
            spectators: [],
            isHost: !!R,
            minPlayers: 2,
            onStart: L,
            onLeave: fe,
            showJoinInput: !0,
            customizationSlot: ge,
            startLabel: `Start Party!`,
            profile: o,
            onProfileChange: (e) => s(e),
          })
        : d === `ended`
          ? (0, U.jsx)(ta, {
              winner: null,
              isWinner: !1,
              scores: E.map((e, t) => ({
                name: l[t]?.name || `Player ${t + 1}`,
                score: typeof e == `number` ? e : (e?.value ?? 0),
              })),
              players: l,
              onRematch: de,
              onNewRoom: fe,
            })
          : (0, U.jsxs)(Zi, {
              players: l,
              children: [
                (0, U.jsx)(`div`, {
                  className: `w-full p-4`,
                  children: (0, U.jsxs)(`div`, {
                    className: `max-w-6xl mx-auto`,
                    children: [
                      (0, U.jsx)(`div`, {
                        className: `mb-4`,
                        children: (0, U.jsxs)(q, {
                          onClick: fe,
                          style: { background: `#fff0f0` },
                          children: [(0, U.jsx)(Yr, { className: `inline mr-1`, size: 20 }), `Leave Game`],
                        }),
                      }),
                      (0, U.jsxs)(`div`, {
                        className: `grid grid-cols-1 lg:grid-cols-3 gap-6`,
                        children: [
                          (0, U.jsxs)(`div`, {
                            className: `lg:col-span-1 space-y-4`,
                            children: [
                              (0, U.jsxs)(Ii, {
                                className: `p-4`,
                                children: [
                                  (0, U.jsxs)(`h3`, {
                                    className: `font-sketch text-2xl mb-3 text-ink flex items-center gap-2`,
                                    children: [(0, U.jsx)(Si, { size: 24 }), `Scoreboard`],
                                  }),
                                  (0, U.jsx)(`div`, {
                                    className: `space-y-2`,
                                    children: l.map((e, t) =>
                                      (0, U.jsxs)(
                                        `div`,
                                        {
                                          className: `flex items-center justify-between p-2 rounded border-2 border-dashed ${t === p && d === `playing` ? `border-current bg-yellow-50` : `border-gray-300`}`,
                                          style: {
                                            color: l[t]?.color || Os[t],
                                            transform: `rotate(${t % 2 ? 0.5 : -0.5}deg)`,
                                          },
                                          children: [
                                            (0, U.jsxs)(`div`, {
                                              className: `flex items-center gap-2`,
                                              children: [
                                                (0, U.jsx)(Vi, { avatarIcon: e.avatarIcon, color: e.color, size: 20 }),
                                                (0, U.jsxs)(`span`, {
                                                  className: `font-handwriting font-bold`,
                                                  children: [e.name, t === te && ` (You)`],
                                                }),
                                              ],
                                            }),
                                            (0, U.jsx)(`span`, {
                                              className: `font-sketch text-2xl font-bold`,
                                              children: typeof E[t] == `number` ? E[t] : 0,
                                            }),
                                          ],
                                        },
                                        e.id,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                              (0, U.jsx)(na, {
                                requesterId: ie,
                                players: l,
                                currentTurn: p,
                                myPlayerIndex: te,
                                onAllow: () => me(!0),
                                onDeny: () => me(!1),
                              }),
                              d === `playing` &&
                                (0, U.jsx)(Ii, {
                                  className: `p-4`,
                                  children:
                                    te === p
                                      ? (0, U.jsxs)(`div`, {
                                          className: `text-center`,
                                          children: [
                                            (0, U.jsx)(`div`, {
                                              className: `w-8 h-8 rounded-full mx-auto mb-2 border-2`,
                                              style: { backgroundColor: l[te]?.color || Os[te] },
                                            }),
                                            (0, U.jsx)(`p`, {
                                              className: `font-sketch text-xl text-ink font-bold`,
                                              children: `Your Turn!`,
                                            }),
                                            (0, U.jsx)(`p`, {
                                              className: `font-handwriting text-sm text-gray-600`,
                                              children: `Draw a line`,
                                            }),
                                          ],
                                        })
                                      : (0, U.jsxs)(`div`, {
                                          className: `text-center`,
                                          children: [
                                            (0, U.jsx)(`div`, {
                                              className: `w-8 h-8 rounded-full mx-auto mb-2 border-2`,
                                              style: { backgroundColor: l[p]?.color || Os[p] },
                                            }),
                                            (0, U.jsxs)(`p`, {
                                              className: `font-handwriting text-gray-600`,
                                              children: [
                                                `Waiting for `,
                                                (0, U.jsx)(`span`, {
                                                  className: `font-bold text-ink`,
                                                  children: l[p]?.name,
                                                }),
                                                `...`,
                                              ],
                                            }),
                                            O &&
                                              l.length > 1 &&
                                              te === (p + 1) % l.length &&
                                              (0, U.jsxs)(q, {
                                                onClick: pe,
                                                className: `mt-2 text-sm`,
                                                children: [
                                                  (0, U.jsx)(wi, { className: `inline`, size: 14 }),
                                                  ` Request Undo`,
                                                ],
                                              }),
                                          ],
                                        }),
                                }),
                              re &&
                                (0, U.jsxs)(Ii, {
                                  className: `p-4 bg-yellow-50`,
                                  children: [
                                    (0, U.jsx)(`p`, {
                                      className: `font-handwriting text-center text-ink font-bold`,
                                      children: `Game Paused`,
                                    }),
                                    (0, U.jsx)(`p`, {
                                      className: `font-handwriting text-sm text-center text-gray-600`,
                                      children: `Waiting for players to reconnect`,
                                    }),
                                  ],
                                }),
                            ],
                          }),
                          (0, U.jsx)(`div`, {
                            className: `lg:col-span-2`,
                            children: (0, U.jsx)(Ii, {
                              className: `p-4 overflow-hidden`,
                              children:
                                _e > 0 && ve > 0
                                  ? (0, U.jsx)(bs, {
                                      initialScale: Math.min(1, 600 / Math.max(_e, ve)),
                                      minScale: 0.3,
                                      maxScale: 3,
                                      limitToBounds: !0,
                                      centerOnInit: !0,
                                      children: ({ zoomIn: e, zoomOut: t, resetTransform: n }) =>
                                        (0, U.jsxs)(U.Fragment, {
                                          children: [
                                            (0, U.jsxs)(`div`, {
                                              className: `absolute top-2 right-2 z-10 flex gap-2`,
                                              children: [
                                                (0, U.jsx)(`button`, {
                                                  onClick: () => e(0.2),
                                                  className: `sketch-button p-2 bg-white`,
                                                  title: `Zoom In`,
                                                  children: (0, U.jsx)(fi, { size: 16 }),
                                                }),
                                                (0, U.jsx)(`button`, {
                                                  onClick: () => t(0.2),
                                                  className: `sketch-button p-2 bg-white`,
                                                  title: `Zoom Out`,
                                                  children: (0, U.jsx)(oi, { size: 16 }),
                                                }),
                                                (0, U.jsx)(`button`, {
                                                  onClick: () => n(),
                                                  className: `sketch-button p-2 bg-white`,
                                                  title: `Reset`,
                                                  children: (0, U.jsx)(mi, { size: 16 }),
                                                }),
                                              ],
                                            }),
                                            (0, U.jsx)(ws, {
                                              children: (0, U.jsx)(`div`, {
                                                className: `select-none pointer-events-none`,
                                                style: { touchAction: `none` },
                                                children: (0, U.jsxs)(`svg`, {
                                                  className: `pointer-events-auto block`,
                                                  width: _e,
                                                  height: ve,
                                                  viewBox: `-20 -20 ${_e + 40} ${ve + 40}`,
                                                  style: { background: `#fffef9`, borderRadius: `4px` },
                                                  children: [
                                                    (0, U.jsx)(`defs`, {
                                                      children: (0, U.jsxs)(`filter`, {
                                                        id: `paper-texture`,
                                                        children: [
                                                          (0, U.jsx)(`feTurbulence`, {
                                                            type: `fractalNoise`,
                                                            baseFrequency: `0.9`,
                                                            numOctaves: `4`,
                                                            result: `noise`,
                                                          }),
                                                          (0, U.jsx)(`feDiffuseLighting`, {
                                                            in: `noise`,
                                                            lightingColor: `#f5f1e8`,
                                                            surfaceScale: `1`,
                                                            children: (0, U.jsx)(`feDistantLight`, {
                                                              azimuth: `45`,
                                                              elevation: `60`,
                                                            }),
                                                          }),
                                                        ],
                                                      }),
                                                    }),
                                                    w.map((e, t) =>
                                                      e.map((e, n) =>
                                                        e === null
                                                          ? null
                                                          : (0, U.jsxs)(
                                                              `g`,
                                                              {
                                                                children: [
                                                                  (0, U.jsx)(`rect`, {
                                                                    x: n * 60,
                                                                    y: t * 60,
                                                                    width: 60,
                                                                    height: 60,
                                                                    fill: Os[e],
                                                                    opacity: 0.15,
                                                                  }),
                                                                  (0, U.jsx)(`path`, {
                                                                    d: `M ${n * 60} ${t * 60} L ${(n + 1) * 60} ${(t + 1) * 60} M ${(n + 1) * 60} ${t * 60} L ${n * 60} ${(t + 1) * 60}`,
                                                                    stroke: Os[e],
                                                                    strokeWidth: `1`,
                                                                    opacity: `0.3`,
                                                                    strokeDasharray: `3,3`,
                                                                  }),
                                                                ],
                                                              },
                                                              `box-${t}-${n}`,
                                                            ),
                                                      ),
                                                    ),
                                                    Array.from({ length: h + 1 }, (e, t) =>
                                                      Array.from({ length: v }, (e, n) => {
                                                        let r = b[t]?.[n],
                                                          i = t * 100 + n,
                                                          a = O && O.lineType === `h` && O.r === t && O.c === n;
                                                        return (0, U.jsxs)(
                                                          `g`,
                                                          {
                                                            children: [
                                                              r !== null &&
                                                                (0, U.jsx)(`path`, {
                                                                  d: ks(n * 60, t * 60, (n + 1) * 60, t * 60, i),
                                                                  stroke: Os[r],
                                                                  strokeWidth: 3,
                                                                  fill: `none`,
                                                                  strokeLinecap: `round`,
                                                                  vectorEffect: `non-scaling-stroke`,
                                                                  style: {
                                                                    filter: a ? `drop-shadow(0 0 4px #38bdf8)` : void 0,
                                                                  },
                                                                }),
                                                              (0, U.jsx)(`line`, {
                                                                x1: n * 60,
                                                                y1: t * 60,
                                                                x2: (n + 1) * 60,
                                                                y2: t * 60,
                                                                stroke: `transparent`,
                                                                strokeWidth: 20,
                                                                style: { cursor: `pointer`, pointerEvents: `stroke` },
                                                                onPointerDown: (e) => {
                                                                  (e.stopPropagation(), he(`h`, t, n));
                                                                },
                                                              }),
                                                            ],
                                                          },
                                                          `h-${t}-${n}`,
                                                        );
                                                      }),
                                                    ),
                                                    Array.from({ length: h }, (e, t) =>
                                                      Array.from({ length: v + 1 }, (e, n) => {
                                                        let r = S[t]?.[n],
                                                          i = t * 100 + n + 1e3,
                                                          a = O && O.lineType === `v` && O.r === t && O.c === n;
                                                        return (0, U.jsxs)(
                                                          `g`,
                                                          {
                                                            children: [
                                                              r !== null &&
                                                                (0, U.jsx)(`path`, {
                                                                  d: ks(n * 60, t * 60, n * 60, (t + 1) * 60, i),
                                                                  stroke: Os[r],
                                                                  strokeWidth: 3,
                                                                  fill: `none`,
                                                                  strokeLinecap: `round`,
                                                                  vectorEffect: `non-scaling-stroke`,
                                                                  style: {
                                                                    filter: a ? `drop-shadow(0 0 4px #38bdf8)` : void 0,
                                                                  },
                                                                }),
                                                              (0, U.jsx)(`line`, {
                                                                x1: n * 60,
                                                                y1: t * 60,
                                                                x2: n * 60,
                                                                y2: (t + 1) * 60,
                                                                stroke: `transparent`,
                                                                strokeWidth: 20,
                                                                style: { cursor: `pointer`, pointerEvents: `stroke` },
                                                                onPointerDown: (e) => {
                                                                  (e.stopPropagation(), he(`v`, t, n));
                                                                },
                                                              }),
                                                            ],
                                                          },
                                                          `v-${t}-${n}`,
                                                        );
                                                      }),
                                                    ),
                                                    Array.from({ length: h + 1 }, (e, t) =>
                                                      Array.from({ length: v + 1 }, (e, n) => {
                                                        let r = t * 1e3 + n,
                                                          i = Math.sin(r * 0.1) * 0.5,
                                                          a = Math.cos(r * 0.1) * 0.5;
                                                        return (0, U.jsx)(
                                                          `circle`,
                                                          {
                                                            cx: n * 60 + i,
                                                            cy: t * 60 + a,
                                                            r: 4,
                                                            fill: `#2a2a3e`,
                                                            vectorEffect: `non-scaling-stroke`,
                                                            style: { pointerEvents: `none` },
                                                          },
                                                          `dot-${t}-${n}`,
                                                        );
                                                      }),
                                                    ),
                                                  ],
                                                }),
                                              }),
                                            }),
                                          ],
                                        }),
                                    })
                                  : (0, U.jsx)(`div`, {
                                      className: `flex items-center justify-center p-8`,
                                      children: (0, U.jsx)(`p`, {
                                        className: `font-handwriting text-gray-400 slide-texture`,
                                        children: `Loading...`,
                                      }),
                                    }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                (0, U.jsx)(Xi, { socket: e, roomId: n, gamePrefix: `dab`, players: l }),
              ],
            })
      : (0, U.jsx)(Ds, {
          profile: o,
          setProfile: s,
          mode: A,
          setMode: j,
          customRows: M,
          setCustomRows: ee,
          customCols: N,
          setCustomCols: P,
          onStart: le,
          onJoin: ue,
        });
  },
  js = () => {
    let {
        socket: e,
        playerName: t,
        roomId: n,
        setRoomId: r,
        clearRoomId: i,
        setGamePrefix: a,
        profile: o,
        setProfile: s,
      } = Lr(),
      c = Re(),
      [l, u] = (0, _.useState)(`lobby`),
      [d, f] = (0, _.useState)([]),
      [p, m] = (0, _.useState)([]),
      [h, g] = (0, _.useState)(null),
      [v, y] = (0, _.useState)(`S`),
      [b, x] = (0, _.useState)([]),
      [S, C] = (0, _.useState)(6),
      [w, T] = (0, _.useState)([]),
      [E, D] = (0, _.useState)(-1),
      O = (0, _.useRef)(``),
      k = (0, _.useRef)(!1),
      A = (0, _.useCallback)(() => {
        e && e.emit(`sos_createRoom`, { playerName: o.name || t, avatarIcon: o.avatarIcon, color: o.color, size: S });
      }, [e, o, t, S]),
      j = (0, _.useCallback)(
        (n, r) => {
          e &&
            e.emit(`sos_joinRoom`, {
              roomId: n,
              playerName: o.name || t,
              avatarIcon: o.avatarIcon,
              color: o.color,
              asSpectator: r,
            });
        },
        [e, o, t],
      ),
      { clearReconnect: M } = ha({
        socket: e,
        gamePrefix: `sos`,
        roomId: n,
        onRestore: (e, t) => {
          e &&
            (r(e.id),
            f(e.players || []),
            m(e.spectators || []),
            u(e.gameState || `lobby`),
            g(e.currentTurn),
            T(e.board || []),
            D(t ? (e.players || []).findIndex((e) => e.id === t.id) : -1));
        },
      });
    (ma(
      e,
      {
        sos_roomInfo: (t) => {
          ((k.current = !0),
            r(t.id),
            f(t.players || []),
            m(t.spectators || []),
            u(t.gameState),
            g(t.currentTurn),
            T(t.board || []));
          let n = t.players?.find((t) => t.id === e.id);
          D(n ? t.players.findIndex((e) => e.id === n.id) : -1);
        },
        sos_gameStarted: () => {
          u(`playing`);
        },
        sos_moveMade: (e) => {
          (T(e.board || []),
            e.patterns &&
              e.patterns.length > 0 &&
              (x(e.patterns.flatMap((e) => e.cells.map((e) => `${e.row}-${e.col}`))), setTimeout(() => x([]), 2e3)));
        },
        sos_gameOver: () => {
          u(`ended`);
        },
        sos_gamePaused: () => {
          u(`paused`);
        },
        sos_gameRestarted: () => {
          (u(`waiting`), y(`S`), T([]));
        },
        sos_alert: ({ icon: e, title: t, text: n }) => {
          K.default.fire({ icon: e, title: t, text: n });
        },
        server_shutdown: ({ message: e }) => {
          K.default
            .fire({
              title: `Server Shutting Down`,
              text: e || `The server is going down for maintenance.`,
              icon: `info`,
              customClass: { popup: J },
            })
            .then(() => {
              (sessionStorage.removeItem(`sos_reconnect`), i(), c(`/`));
            });
        },
      },
      [i, c, r],
    ),
      (0, _.useEffect)(() => {
        if (!e) return;
        a(`sos`);
        let t = sessionStorage.getItem(`sos_reconnect`);
        if (t && !k.current) {
          k.current = !0;
          let n = JSON.parse(t);
          e.emit(`sos_reconnect`, n);
        }
      }, [e, a]));
    let ee = (0, _.useCallback)(() => {
        !e || !n || e.emit(`sos_startGame`, { roomId: n });
      }, [e, n]),
      N = (0, _.useCallback)(() => {
        !e || !n || e.emit(`sos_restartGame`, n);
      }, [e, n]),
      P = (0, _.useCallback)(() => {
        !e || !n || (e.emit(`sos_leaveRoom`, n), M(), i(), u(`lobby`), c(`/`));
      }, [e, n, M, i, c]),
      te = (0, _.useCallback)(
        (t, r) => {
          !n ||
            l !== `playing` ||
            (E === h && w[t]?.[r] === null && e.emit(`sos_makeMove`, { roomId: n, row: t, col: r, value: v }));
        },
        [n, l, E, h, w, v, e],
      ),
      ne = p.some((t) => t.id === e?.id),
      re = d[0]?.id === e?.id;
    if (l === `ended`)
      return (0, U.jsx)(ta, {
        winner: null,
        isWinner: !1,
        scores: d.map((e, t) => ({ name: e.name || `Player ${t + 1}`, score: e.score || 0 })),
        onRematch: N,
        onLeave: P,
      });
    if (n && l === `waiting`)
      return (0, U.jsx)(Hi, {
        gameName: `SOS`,
        roomId: n,
        players: d,
        spectators: p,
        isHost: !!re,
        minPlayers: 2,
        onStart: ee,
        onLeave: P,
        showJoinInput: !0,
        startLabel: `Start Game`,
        profile: o,
        onProfileChange: (e) => s(e),
      });
    if (n && l === `playing`) {
      let e = w.length || S;
      return (0, U.jsx)(Zi, {
        players: d,
        children: (0, U.jsxs)(`div`, {
          className: `flex flex-col items-center gap-4 p-4`,
          children: [
            ne &&
              (0, U.jsx)(`div`, {
                className: `sketch-card px-4 py-2 bg-blue-100`,
                children: (0, U.jsx)(`span`, {
                  className: `paper-font text-blue-700 font-semibold`,
                  children: `👁️ Spectating`,
                }),
              }),
            (0, U.jsx)($i, { players: d, currentTurn: h }),
            (0, U.jsxs)(`div`, {
              className: `paper-font text-sm text-ink/60`,
              children: [`Moves: `, w.flat().filter((e) => e).length, ` / `, e * e],
            }),
            (0, U.jsx)(`div`, {
              className: `grid gap-1 p-4 sketch-card`,
              style: { gridTemplateColumns: `repeat(${e}, minmax(32px, 1fr))` },
              children: w.map((e, t) =>
                e.map((e, n) => {
                  let r = b.includes(`${t}-${n}`);
                  return (0, U.jsx)(
                    `button`,
                    {
                      onClick: () => te(t, n),
                      disabled: E !== h,
                      className: `w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl font-sketch border-2 border-ink/20 hover:bg-paper-dark rounded sketch-transition ${r ? `bg-yellow-200` : ``}`,
                      children:
                        e &&
                        (0, U.jsx)(`span`, {
                          className: e.player === 0 ? `text-red-600` : `text-blue-600`,
                          children: e.value,
                        }),
                    },
                    `${t}-${n}`,
                  );
                }),
              ),
            }),
            !ne &&
              (0, U.jsxs)(`div`, {
                className: `flex gap-4`,
                children: [
                  (0, U.jsx)(q, {
                    onClick: () => y(`S`),
                    style: { background: v === `S` ? `#fee2e2` : `#fff` },
                    children: `S`,
                  }),
                  (0, U.jsx)(q, {
                    onClick: () => y(`O`),
                    style: { background: v === `O` ? `#dbeafe` : `#fff` },
                    children: `O`,
                  }),
                ],
              }),
            (0, U.jsx)(q, { onClick: P, style: { background: `#fff0f0` }, children: `Leave Room` }),
          ],
        }),
      });
    }
    return (0, U.jsx)(`div`, {
      className: `min-h-screen bg-paper flex items-center justify-center p-4`,
      children: (0, U.jsxs)(`div`, {
        className: `sketch-card p-8 max-w-sm w-full space-y-6`,
        children: [
          (0, U.jsx)(`h2`, { className: `text-2xl font-sketch text-center text-ink`, children: `SOS` }),
          (0, U.jsxs)(`div`, {
            children: [
              (0, U.jsx)(`label`, { className: `paper-font text-sm text-ink/60`, children: `Your Name` }),
              (0, U.jsx)(`input`, {
                type: `text`,
                value: o.name,
                onChange: (e) => s((t) => ({ ...t, name: e.target.value })),
                placeholder: `Enter name`,
                className: `sketch-input w-full mt-1`,
                maxLength: 20,
              }),
            ],
          }),
          (0, U.jsxs)(`div`, {
            children: [
              (0, U.jsx)(`label`, { className: `paper-font text-sm text-ink/60`, children: `Board Size` }),
              (0, U.jsxs)(`select`, {
                className: `sketch-input w-full mt-1`,
                value: S,
                onChange: (e) => C(Number(e.target.value)),
                children: [
                  (0, U.jsx)(`option`, { value: 4, children: `4x4 (Quick)` }),
                  (0, U.jsx)(`option`, { value: 5, children: `5x5` }),
                  (0, U.jsx)(`option`, { value: 6, children: `6x6 (Balanced)` }),
                  (0, U.jsx)(`option`, { value: 7, children: `7x7 (Deeper)` }),
                  (0, U.jsx)(`option`, { value: 8, children: `8x8 (Longest)` }),
                ],
              }),
            ],
          }),
          (0, U.jsx)(Y, {
            avatarIcon: o.avatarIcon,
            color: o.color,
            onAvatarChange: (e) => s((t) => ({ ...t, avatarIcon: e })),
            onColorChange: (e) => s((t) => ({ ...t, color: e })),
          }),
          (0, U.jsx)(q, { onClick: A, className: `w-full`, children: `Create Room` }),
          (0, U.jsxs)(`div`, {
            className: `border-t border-ink/20 pt-4`,
            children: [
              (0, U.jsx)(`label`, { className: `paper-font text-sm text-ink/60`, children: `Join Room` }),
              (0, U.jsx)(`input`, {
                type: `text`,
                placeholder: `Room Code`,
                className: `sketch-input w-full mt-1 mb-2`,
                maxLength: 6,
                ref: O,
                onKeyDown: (e) => {
                  if (e.key === `Enter`) {
                    let t = e.target.value.trim();
                    t && o.name && j(t);
                  }
                },
              }),
              (0, U.jsx)(q, {
                onClick: () => {
                  let e = O.current?.value || ``;
                  e && o.name && j(e.trim());
                },
                className: `w-full`,
                children: `Join as Player`,
              }),
              (0, U.jsx)(q, {
                onClick: () => {
                  let e = O.current?.value || ``;
                  e && o.name && j(e.trim(), !0);
                },
                className: `w-full mt-2`,
                style: { background: `#f0f8ff` },
                children: `Join as Spectator`,
              }),
            ],
          }),
        ],
      }),
    });
  },
  Ms = () => {
    let { socket: e, roomId: t, setRoomId: n, clearRoomId: r, setGamePrefix: i, profile: a, setProfile: o } = Lr(),
      s = Re(),
      [c, l] = (0, _.useState)(`lobby`),
      [u, d] = (0, _.useState)([]),
      [f, p] = (0, _.useState)([]),
      [m, h] = (0, _.useState)(null),
      [g, v] = (0, _.useState)(null),
      [y, b] = (0, _.useState)(null),
      [x, S] = (0, _.useState)(null),
      [C, w] = (0, _.useState)([]),
      T = (0, _.useRef)(null),
      [E] = da(`/sounds/move.mp3`, { volume: 0.5 }),
      [D] = da(`/sounds/win.mp3`, { volume: 0.7 }),
      O = (0, _.useCallback)(() => {
        e && e.emit(`c4_createRoom`, { playerName: a.name, avatarIcon: a.avatarIcon, color: a.color });
      }, [e, a]),
      k = (0, _.useCallback)(
        (t, n) => {
          e &&
            e.emit(`c4_joinRoom`, {
              roomId: t,
              playerName: a.name,
              avatarIcon: a.avatarIcon,
              color: a.color,
              asSpectator: n,
            });
        },
        [e, a],
      ),
      { clearReconnect: A } = ha({
        socket: e,
        gamePrefix: `c4`,
        roomId: t,
        onRestore: (e) => {
          e &&
            (n(e.id),
            d(e.players || []),
            p(e.spectators || []),
            l(e.gameState || `lobby`),
            h(e.currentTurn),
            w(e.board || []));
        },
      });
    (ma(
      e,
      {
        c4_roomInfo: (e) => {
          (n(e.id), d(e.players || []), p(e.spectators || []), l(e.gameState), h(e.currentTurn), w(e.board || []));
        },
        c4_gameStarted: () => {
          l(`playing`);
        },
        c4_moveMade: (e) => {
          (w(e.board || []), e.lastMove && (S(e.lastMove), E()));
        },
        c4_gameOver: (e) => {
          (l(`ended`), e.winLine && (b(e.winLine.map((e) => `${e.row}-${e.col}`)), D()));
        },
        c4_gamePaused: () => {
          l(`paused`);
        },
        c4_gameRestarted: () => {
          (l(`waiting`), b(null));
        },
        c4_alert: ({ icon: e, title: t, text: n }) => {
          K.default.fire({ icon: e, title: t, text: n });
        },
        server_shutdown: ({ message: e }) => {
          K.default
            .fire({
              title: `Server Shutting Down`,
              text: e || `The server is going down for maintenance.`,
              icon: `info`,
              customClass: { popup: J },
            })
            .then(() => {
              (A(), r(), l(`lobby`), s(`/`));
            });
        },
      },
      [r, s, E, D, n],
    ),
      (0, _.useEffect)(() => {
        if (!e) return;
        i(`c4`);
        let t = sessionStorage.getItem(`c4_reconnect`);
        if (t) {
          let n = JSON.parse(t);
          e.emit(`c4_reconnect`, n);
        }
      }, [e, i]));
    let j = (0, _.useCallback)(() => {
        !e || !t || e.emit(`c4_startGame`, { roomId: t });
      }, [e, t]),
      M = (0, _.useCallback)(() => {
        !e || !t || e.emit(`c4_restartGame`, t);
      }, [e, t]),
      ee = (0, _.useCallback)(() => {
        !e || !t || (e.emit(`c4_leaveRoom`, t), A(), r(), l(`lobby`), s(`/`));
      }, [e, t, A, r, s]),
      N = (0, _.useCallback)(
        (n) => {
          !t || c !== `playing` || (m === e?.id && e.emit(`c4_makeMove`, { roomId: t, column: n }));
        },
        [t, c, m, e],
      ),
      P = f.some((t) => t.id === e?.id),
      te = u[0]?.id === e?.id;
    if (c === `ended`)
      return (0, U.jsx)(ta, {
        winner: null,
        isWinner: !1,
        scores: u.map((e, t) => ({ name: e.name || `Player ${t + 1}`, score: 0 })),
        onRematch: M,
        onNewRoom: ee,
      });
    if (t && c === `waiting`)
      return (0, U.jsx)(Hi, {
        gameName: `Connect 4`,
        roomId: t,
        players: u,
        spectators: f,
        isHost: !!te,
        minPlayers: 2,
        onStart: j,
        onLeave: ee,
        showJoinInput: !0,
        startLabel: `Start Game`,
        profile: a,
        onProfileChange: (e) => o(e),
      });
    if (t && c === `playing`) {
      let n = m === e?.id && !P;
      return (0, U.jsxs)(Zi, {
        players: u,
        children: [
          (0, U.jsxs)(`div`, {
            className: `flex flex-col items-center gap-4 p-4`,
            children: [
              P &&
                (0, U.jsx)(`div`, {
                  className: `sketch-card px-4 py-2 bg-blue-100`,
                  children: (0, U.jsx)(`span`, {
                    className: `paper-font text-blue-700 font-semibold`,
                    children: `👁️ Spectating`,
                  }),
                }),
              (0, U.jsx)($i, { players: u, currentTurn: m }),
              (0, U.jsx)(`div`, {
                className: `grid grid-cols-7 gap-1 p-4 sketch-card bg-blue-50 relative`,
                onMouseLeave: () => v(null),
                children: C.map((e, t) =>
                  e.map((e, n) => {
                    let r = y && y.includes(`${t}-${n}`),
                      i = x && x.row === t && x.col === n;
                    return (0, U.jsx)(
                      `div`,
                      {
                        className: `w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-full flex items-center justify-center ${r ? `border-yellow-400 ring-2 ring-yellow-400` : `border-ink/20`} ${i ? `ring-2 ring-sky-400` : ``}`,
                        children:
                          e !== null &&
                          (0, U.jsx)(`div`, {
                            className: `w-8 h-8 rounded-full ${e === 0 ? `bg-red-500` : `bg-yellow-500`}`,
                          }),
                      },
                      `${t}-${n}`,
                    );
                  }),
                ),
              }),
              (0, U.jsx)(`div`, {
                className: `grid grid-cols-7 gap-1 w-64 sm:w-72 relative`,
                onMouseLeave: () => v(null),
                children: C[0]?.map((e, t) =>
                  (0, U.jsxs)(
                    `button`,
                    {
                      onClick: () => n && N(t),
                      disabled: !n,
                      className: `py-2 text-2xl font-sketch hover:bg-paper-dark rounded sketch-transition relative`,
                      onMouseEnter: () => n && v(t),
                      children: [
                        g === t &&
                          (0, U.jsx)(`div`, {
                            className: `absolute inset-0 flex items-center justify-center pointer-events-none ${m === 0 ? `bg-red-500/30` : `bg-yellow-500/30`} rounded-full`,
                          }),
                        `⬇️`,
                      ],
                    },
                    t,
                  ),
                ),
              }),
              (0, U.jsx)(q, { onClick: ee, style: { background: `#fff0f0` }, children: `Leave Room` }),
            ],
          }),
          c === `playing` && (0, U.jsx)(Xi, { socket: e, roomId: t, gamePrefix: `c4`, players: u }),
        ],
      });
    }
    return (0, U.jsx)(`div`, {
      className: `min-h-screen bg-paper flex items-center justify-center p-4`,
      children: (0, U.jsxs)(`div`, {
        className: `sketch-card p-8 max-w-sm w-full space-y-6`,
        children: [
          (0, U.jsx)(`h2`, { className: `text-2xl font-sketch text-center text-ink`, children: `Connect 4` }),
          (0, U.jsxs)(`div`, {
            children: [
              (0, U.jsx)(`label`, { className: `paper-font text-sm text-ink/60`, children: `Your Name` }),
              (0, U.jsx)(`input`, {
                type: `text`,
                value: a.name,
                onChange: (e) => o((t) => ({ ...t, name: e.target.value })),
                placeholder: `Enter name`,
                className: `sketch-input w-full mt-1`,
                maxLength: 20,
              }),
            ],
          }),
          (0, U.jsx)(Y, {
            avatarIcon: a.avatarIcon,
            color: a.color,
            onAvatarChange: (e) => o((t) => ({ ...t, avatarIcon: e })),
            onColorChange: (e) => o((t) => ({ ...t, color: e })),
          }),
          (0, U.jsx)(q, { onClick: O, className: `w-full`, children: `Create Room` }),
          (0, U.jsxs)(`div`, {
            className: `border-t border-ink/20 pt-4`,
            children: [
              (0, U.jsx)(`label`, { className: `paper-font text-sm text-ink/60`, children: `Join Room` }),
              (0, U.jsx)(`input`, {
                type: `text`,
                placeholder: `Room Code`,
                className: `sketch-input w-full mt-1 mb-2`,
                maxLength: 6,
                ref: T,
                onKeyDown: (e) => {
                  if (e.key === `Enter`) {
                    let t = e.target.value.trim();
                    t && k(t);
                  }
                },
              }),
              (0, U.jsx)(q, {
                onClick: () => {
                  let e = T.current?.value || ``;
                  e && k(e.trim());
                },
                className: `w-full`,
                children: `Join as Player`,
              }),
              (0, U.jsx)(q, {
                onClick: () => {
                  let e = T.current?.value || ``;
                  e && k(e.trim(), !0);
                },
                className: `w-full mt-2`,
                style: { background: `#f0f8ff` },
                children: `Join as Spectator`,
              }),
            ],
          }),
        ],
      }),
    });
  },
  Ns = ({ children: e, onClick: t, disabled: n, className: r = ``, variant: i = `primary` }) =>
    (0, U.jsx)(`button`, {
      onClick: t,
      disabled: n,
      className: `px-6 py-2 rounded-lg font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none glass ${{ primary: `bg-blue-500/40 hover:bg-blue-500/60 text-blue-900 border-blue-400/50`, secondary: `bg-purple-500/40 hover:bg-purple-500/60 text-purple-900 border-purple-400/50`, success: `bg-green-500/40 hover:bg-green-500/60 text-green-900 border-green-400/50`, danger: `bg-red-500/40 hover:bg-red-500/60 text-red-900 border-red-400/50` }[i]} ${r}`,
      children: e,
    }),
  Ps = () => {
    let e = Re();
    return (0, U.jsxs)(`div`, {
      className: `min-h-screen flex flex-col items-center justify-center p-4`,
      children: [
        (0, U.jsx)(`h1`, { className: `text-9xl hand-drawn text-red-500 mb-4 animate-bounce`, children: `404` }),
        (0, U.jsx)(`p`, {
          className: `text-2xl paper-font text-gray-600 mb-8`,
          children: `Oops! This page got lost in the notebook.`,
        }),
        (0, U.jsx)(Ns, { onClick: () => e(`/`), children: `Take me Home` }),
      ],
    });
  };
function Fs() {
  return (0, U.jsx)(dt, {
    children: (0, U.jsx)(`div`, {
      className: `min-h-screen`,
      children: (0, U.jsxs)(ot, {
        children: [
          (0, U.jsx)(it, { path: `/`, element: (0, U.jsx)(Fi, {}) }),
          (0, U.jsx)(it, { path: `/bingo`, element: (0, U.jsx)(_a, {}) }),
          (0, U.jsx)(it, { path: `/tictactoe`, element: (0, U.jsx)(va, {}) }),
          (0, U.jsx)(it, { path: `/uttt`, element: (0, U.jsx)(wa, {}) }),
          (0, U.jsx)(it, { path: `/dab`, element: (0, U.jsx)(As, {}) }),
          (0, U.jsx)(it, { path: `/sos`, element: (0, U.jsx)(js, {}) }),
          (0, U.jsx)(it, { path: `/connect4`, element: (0, U.jsx)(Ms, {}) }),
          (0, U.jsx)(it, { path: `*`, element: (0, U.jsx)(Ps, {}) }),
        ],
      }),
    }),
  });
}
var Is = class extends _.Component {
  constructor(e) {
    (super(e), (this.state = { hasError: !1, error: null, errorInfo: null }));
  }
  static getDerivedStateFromError() {
    return { hasError: !0 };
  }
  componentDidCatch(e, t) {
    (this.setState({ error: e, errorInfo: t }),
      Pr(`React error boundary`, e),
      console.error(`Error caught by ErrorBoundary:`, e, t));
  }
  handleReset = () => {
    this.setState({ hasError: !1, error: null, errorInfo: null });
  };
  render() {
    return this.state.hasError
      ? (0, U.jsxs)(`div`, {
          className: `flex flex-col items-center justify-center min-h-screen p-8 text-center bg-paper`,
          children: [
            (0, U.jsx)(`h1`, {
              className: `text-5xl font-hand-drawn text-red-600 mb-4`,
              children: `Oops! Something went wrong`,
            }),
            (0, U.jsx)(`p`, {
              className: `text-xl font-handwriting text-ink mb-8`,
              children: `We're sorry for the inconvenience. Please try refreshing the page.`,
            }),
            (0, U.jsx)(`button`, {
              onClick: this.handleReset,
              className: `sketch-button px-8 py-3 text-lg`,
              children: `Try Again`,
            }),
            !1,
          ],
        })
      : this.props.children;
  }
};
function Ls() {
  let { theme: e } = Ki();
  return (0, U.jsx)(jr, {
    theme: e,
    position: `top-right`,
    richColors: !0,
    closeButton: !0,
    expand: !0,
    toastOptions: {
      className: `sketch-card font-handwriting`,
      style: {
        background: e === `dark` ? `#1e1e1e` : `#fffef9`,
        color: e === `dark` ? `#e0e0e0` : `#2a2a3e`,
        border: `2px solid ${e === `dark` ? `#e0e0e0` : `#2a2a3e`}`,
        borderRadius: `4px`,
      },
    },
  });
}
function Rs({ children: e }) {
  return (
    (0, _.useEffect)(() => {
      let e = (e) => {
          Pr(`Window error`, e.error || e.message || `Unknown browser error`);
        },
        t = (e) => {
          Pr(`Unhandled promise rejection`, e.reason || `Unknown promise rejection`);
        };
      return (
        window.addEventListener(`error`, e),
        window.addEventListener(`unhandledrejection`, t),
        () => {
          (window.removeEventListener(`error`, e), window.removeEventListener(`unhandledrejection`, t));
        }
      );
    }, []),
    e
  );
}
v.createRoot(document.getElementById(`root`)).render(
  (0, U.jsx)(_.StrictMode, {
    children: (0, U.jsxs)(qi, {
      children: [
        (0, U.jsx)(Ls, {}),
        (0, U.jsx)(Rs, { children: (0, U.jsx)(Is, { children: (0, U.jsx)(Rr, { children: (0, U.jsx)(Fs, {}) }) }) }),
      ],
    }),
  }),
);
export { o as t };
