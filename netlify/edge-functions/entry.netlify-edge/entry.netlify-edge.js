/**
 * @license
 * @builder.io/qwik 0.10.0
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */ const isNode = (e) => e && typeof e.nodeType == "number",
  isDocument = (e) => e && e.nodeType === 9,
  isElement = (e) => e.nodeType === 1,
  isQwikElement = (e) => isNode(e) && (e.nodeType === 1 || e.nodeType === 111),
  isVirtualElement = (e) => e.nodeType === 111,
  isText = (e) => e.nodeType === 3,
  isComment = (e) => e.nodeType === 8,
  logError = (e, ...t) => {
    const r = e instanceof Error ? e : new Error(e);
    return (
      typeof globalThis._handleError == "function" && e instanceof Error
        ? globalThis._handleError(e, t)
        : console.error(
            "%cQWIK ERROR",
            "",
            r.message,
            ...printParams(t),
            r.stack
          ),
      r
    );
  },
  logErrorAndStop = (e, ...t) => logError(e, ...t),
  printParams = (e) => e,
  qError = (e, ...t) => {
    const r = codeToText(e);
    return logErrorAndStop(r, ...t);
  },
  codeToText = (e) => `Code(${e})`,
  isSerializableObject = (e) => {
    const t = Object.getPrototypeOf(e);
    return t === Object.prototype || t === null;
  },
  isObject = (e) => e && typeof e == "object",
  isArray = (e) => Array.isArray(e),
  isString = (e) => typeof e == "string",
  isFunction = (e) => typeof e == "function",
  QSlot = "q:slot",
  isPromise = (e) => e instanceof Promise,
  safeCall = (e, t, r) => {
    try {
      const s = e();
      return isPromise(s) ? s.then(t, r) : t(s);
    } catch (s) {
      return r(s);
    }
  },
  then = (e, t) => (isPromise(e) ? e.then(t) : t(e)),
  promiseAll = (e) => (e.some(isPromise) ? Promise.all(e) : e),
  isNotNullable = (e) => e != null,
  delay = (e) =>
    new Promise((t) => {
      setTimeout(t, e);
    });
let _context;
const tryGetInvokeContext = () => {
    if (!_context) {
      const e = typeof document < "u" && document && document.__q_context__;
      return e
        ? isArray(e)
          ? (document.__q_context__ = newInvokeContextFromTuple(e))
          : e
        : void 0;
    }
    return _context;
  },
  getInvokeContext = () => {
    const e = tryGetInvokeContext();
    if (!e) throw qError(14);
    return e;
  },
  useInvokeContext = () => {
    const e = getInvokeContext();
    if (e.$event$ !== "qRender") throw qError(20);
    return e.$hostElement$, e.$waitOn$, e.$renderCtx$, e.$subscriber$, e;
  },
  invoke = (e, t, ...r) => {
    const s = _context;
    let i;
    try {
      (_context = e), (i = t.apply(null, r));
    } finally {
      _context = s;
    }
    return i;
  },
  waitAndRun = (e, t) => {
    const r = e.$waitOn$;
    if (r.length === 0) {
      const s = t();
      isPromise(s) && r.push(s);
    } else r.push(Promise.all(r).then(t));
  },
  newInvokeContextFromTuple = (e) => {
    const t = e[0];
    return newInvokeContext(void 0, t, e[1], e[2]);
  },
  newInvokeContext = (e, t, r, s) => ({
    $seq$: 0,
    $hostElement$: e,
    $element$: t,
    $event$: r,
    $url$: s,
    $qrl$: void 0,
    $props$: void 0,
    $renderCtx$: void 0,
    $subscriber$: void 0,
    $waitOn$: void 0,
  }),
  getWrappingContainer = (e) => e.closest("[q\\:container]"),
  getDocument = (e) =>
    typeof document < "u" ? document : e.nodeType === 9 ? e : e.ownerDocument,
  isModule = (e) => isObject(e) && e[Symbol.toStringTag] === "Module";
let _platform = (() => {
  const e = new Map();
  return {
    isServer: !1,
    importSymbol(t, r, s) {
      const i = ((h, c, m) => {
          var v;
          const S = h.baseURI,
            u = new URL((v = c.getAttribute("q:base")) != null ? v : S, S);
          return new URL(m, u);
        })(t.ownerDocument, t, r).toString(),
        n = new URL(i);
      (n.hash = ""), (n.search = "");
      const a = n.href,
        o = e.get(a);
      return o
        ? o[s]
        : import(a).then((h) => {
            return (
              (c = h),
              (h = Object.values(c).find(isModule) || c),
              e.set(a, h),
              h[s]
            );
            var c;
          });
    },
    raf: (t) =>
      new Promise((r) => {
        requestAnimationFrame(() => {
          r(t());
        });
      }),
    nextTick: (t) =>
      new Promise((r) => {
        setTimeout(() => {
          r(t());
        });
      }),
    chunkForSymbol() {},
  };
})();
const setPlatform = (e) => (_platform = e),
  getPlatform = () => _platform,
  isServer$1 = () => _platform.isServer,
  EMPTY_ARRAY$1 = [],
  EMPTY_OBJ$1 = {},
  inlinedQrl = (e, t, r = EMPTY_ARRAY$1) =>
    createQRL(null, t, e, null, null, r, null),
  serializeQRL = (e, t = {}) => {
    var c;
    let r = e.$symbol$,
      s = e.$chunk$;
    const i = (c = e.$refSymbol$) != null ? c : r,
      n = getPlatform();
    if (n) {
      const m = n.chunkForSymbol(i);
      m && ((s = m[1]), e.$refSymbol$ || (r = m[0]));
    }
    if (!s) throw qError(31, e);
    s.startsWith("./") && (s = s.slice(2));
    const a = [s, "#", r],
      o = e.$capture$,
      h = e.$captureRef$;
    if (h && h.length) {
      if (t.$getObjId$) {
        const m = h.map(t.$getObjId$);
        a.push(`[${m.join(" ")}]`);
      } else if (t.$addRefMap$) {
        const m = h.map(t.$addRefMap$);
        a.push(`[${m.join(" ")}]`);
      }
    } else o && o.length > 0 && a.push(`[${o.join(" ")}]`);
    return a.join("");
  },
  serializeQRLs = (e, t) => {
    t.$element$;
    const r = {
      $element$: t.$element$,
      $addRefMap$: (s) => addToArray(t.$refMap$, s),
    };
    return e.map((s) => serializeQRL(s, r)).join(`
`);
  },
  parseQRL = (e, t) => {
    const r = e.length,
      s = indexOf(e, 0, "#"),
      i = indexOf(e, s, "["),
      n = Math.min(s, i),
      a = e.substring(0, n),
      o = s == r ? s : s + 1,
      h = i,
      c = o == h ? "default" : e.substring(o, h),
      m = i,
      S = r,
      u = m === S ? EMPTY_ARRAY$1 : e.substring(m + 1, S - 1).split(" "),
      v = createQRL(a, c, null, null, u, null, null);
    return t && v.$setContainer$(t), v;
  },
  indexOf = (e, t, r) => {
    const s = e.length,
      i = e.indexOf(r, t == s ? 0 : t);
    return i == -1 ? s : i;
  },
  addToArray = (e, t) => {
    const r = e.indexOf(t);
    return r === -1 ? (e.push(t), e.length - 1) : r;
  },
  directSetAttribute = (e, t, r) => e.setAttribute(t, r),
  directGetAttribute = (e, t) => e.getAttribute(t),
  ON_PROP_REGEX = /^(on|window:|document:)/,
  isOnProp = (e) => e.endsWith("$") && ON_PROP_REGEX.test(e),
  addQRLListener = (e, t) => {
    for (const r of t) {
      const s = r[0],
        i = r[1].$hash$;
      let n = !1;
      for (let a = 0; a < e.length; a++) {
        const o = e[a];
        if (o[0] === s && o[1].$hash$ === i) {
          e.splice(a, 1, r), (n = !0);
          break;
        }
      }
      n || e.push(r);
    }
  },
  groupListeners = (e) => {
    if (e.length === 0) return EMPTY_ARRAY$1;
    if (e.length === 1) {
      const r = e[0];
      return [[r[0], [r[1]]]];
    }
    const t = [];
    for (let r = 0; r < e.length; r++) {
      const s = e[r][0];
      t.includes(s) || t.push(s);
    }
    return t.map((r) => [r, e.filter((s) => s[0] === r).map((s) => s[1])]);
  },
  setEvent = (e, t, r, s) => {
    t.endsWith("$"), (t = normalizeOnProp(t.slice(0, -1)));
    const i = isArray(r)
      ? r.map((n) => [t, ensureQrl(n, s)])
      : [[t, ensureQrl(r, s)]];
    return addQRLListener(e, i), t;
  },
  ensureQrl = (e, t) => (e.$setContainer$(t), e),
  getDomListeners = (e, t) => {
    const r = e.$element$.attributes,
      s = [];
    for (let i = 0; i < r.length; i++) {
      const { name: n, value: a } = r.item(i);
      if (
        n.startsWith("on:") ||
        n.startsWith("on-window:") ||
        n.startsWith("on-document:")
      ) {
        const o = a.split(`
`);
        for (const h of o) {
          const c = parseQRL(h, t);
          c.$capture$ && inflateQrl(c, e), s.push([n, c]);
        }
      }
    }
    return s;
  },
  useSequentialScope = () => {
    const e = useInvokeContext(),
      t = e.$seq$,
      r = e.$hostElement$,
      s = getContext(r),
      i = s.$seq$ ? s.$seq$ : (s.$seq$ = []);
    return e.$seq$++, { get: i[t], set: (n) => (i[t] = n), i: t, ctx: e };
  },
  useOn = (e, t) => _useOn(`on-${e}`, t),
  useOnDocument = (e, t) => _useOn(`document:on-${e}`, t),
  _useOn = (e, t) => {
    const r = useInvokeContext(),
      s = getContext(r.$hostElement$);
    addQRLListener(s.li, [[normalizeOnProp(e), t]]),
      (s.$needAttachListeners$ = !0);
  },
  jsx = (e, t, r) => {
    const s = r == null ? null : String(r);
    return new JSXNodeImpl(e, t, s);
  };
class JSXNodeImpl {
  constructor(t, r, s = null) {
    (this.type = t), (this.props = r), (this.key = s);
  }
}
const isJSXNode = (e) => e instanceof JSXNodeImpl,
  Fragment = (e) => e.children,
  SkipRender = Symbol("skip render"),
  SSRComment = () => null,
  Virtual = (e) => e.children,
  InternalSSRStream = () => null,
  fromCamelToKebabCase = (e) => e.replace(/([A-Z])/g, "-$1").toLowerCase(),
  setAttribute = (e, t, r, s) => {
    e
      ? e.$operations$.push({ $operation$: _setAttribute, $args$: [t, r, s] })
      : _setAttribute(t, r, s);
  },
  _setAttribute = (e, t, r) => {
    if (r == null || r === !1) e.removeAttribute(t);
    else {
      const s = r === !0 ? "" : String(r);
      directSetAttribute(e, t, s);
    }
  },
  setProperty = (e, t, r, s) => {
    e
      ? e.$operations$.push({ $operation$: _setProperty, $args$: [t, r, s] })
      : _setProperty(t, r, s);
  },
  _setProperty = (e, t, r) => {
    try {
      e[t] = r;
    } catch (s) {
      logError(codeToText(6), { node: e, key: t, value: r }, s);
    }
  },
  createElement = (e, t, r) =>
    r ? e.createElementNS(SVG_NS, t) : e.createElement(t),
  insertBefore = (e, t, r, s) => (
    e.$operations$.push({
      $operation$: directInsertBefore,
      $args$: [t, r, s || null],
    }),
    r
  ),
  appendChild = (e, t, r) => (
    e.$operations$.push({ $operation$: directAppendChild, $args$: [t, r] }), r
  ),
  _setClasslist = (e, t, r) => {
    const s = e.classList;
    s.remove(...t), s.add(...r);
  },
  _appendHeadStyle = (e, t) => {
    const r = getDocument(e),
      s = r.documentElement === e,
      i = r.head,
      n = r.createElement("style");
    directSetAttribute(n, "q:style", t.styleId),
      (n.textContent = t.content),
      s && i ? directAppendChild(i, n) : directInsertBefore(e, n, e.firstChild);
  },
  removeNode = (e, t) => {
    e.$operations$.push({ $operation$: _removeNode, $args$: [t, e] });
  },
  _removeNode = (e, t) => {
    const r = e.parentElement;
    if (r) {
      if (e.nodeType === 1 || e.nodeType === 111) {
        const s = t.$containerState$.$subsManager$;
        cleanupTree(e, t, s, !0);
      }
      directRemoveChild(r, e);
    }
  },
  createTemplate = (e, t) => {
    const r = createElement(e, "q:template", !1);
    return (
      directSetAttribute(r, QSlot, t),
      directSetAttribute(r, "hidden", ""),
      directSetAttribute(r, "aria-hidden", "true"),
      r
    );
  },
  executeDOMRender = (e) => {
    for (const t of e.$operations$) t.$operation$.apply(void 0, t.$args$);
    resolveSlotProjection(e);
  },
  getKey = (e) => directGetAttribute(e, "q:key"),
  setKey = (e, t) => {
    t !== null && directSetAttribute(e, "q:key", t);
  },
  resolveSlotProjection = (e) => {
    const t = e.$containerState$.$subsManager$;
    e.$rmSlots$.forEach((r) => {
      const s = getKey(r),
        i = getChildren(r, "root");
      if (i.length > 0) {
        const n = r.getAttribute("q:sref"),
          a = e.$roots$.find((o) => o.$id$ === n);
        if (a) {
          const o = createTemplate(e.$doc$, s),
            h = a.$element$;
          for (const c of i) directAppendChild(o, c);
          directInsertBefore(h, o, h.firstChild);
        } else cleanupTree(r, e, t, !1);
      }
    }),
      e.$addSlots$.forEach(([r, s]) => {
        const i = getKey(r),
          n = Array.from(s.childNodes).find(
            (a) => isSlotTemplate(a) && a.getAttribute(QSlot) === i
          );
        n &&
          (getChildren(n, "root").forEach((a) => {
            directAppendChild(r, a);
          }),
          n.remove());
      });
  };
class VirtualElementImpl {
  constructor(t, r) {
    (this.open = t),
      (this.close = r),
      (this._qc_ = null),
      (this.nodeType = 111),
      (this.localName = ":virtual"),
      (this.nodeName = ":virtual");
    const s = (this.ownerDocument = t.ownerDocument);
    (this.template = createElement(s, "template", !1)),
      (this.attributes = ((i) => {
        if (!i) return new Map();
        const n = i.split(" ");
        return new Map(
          n.map((a) => {
            const o = a.indexOf("=");
            return o >= 0
              ? [a.slice(0, o), ((h = a.slice(o + 1)), h.replace(/\+/g, " "))]
              : [a, ""];
            var h;
          })
        );
      })(t.data.slice(3))),
      t.data.startsWith("qv "),
      (t.__virtual = this);
  }
  insertBefore(t, r) {
    const s = this.parentElement;
    if (s) {
      const i = r || this.close;
      s.insertBefore(t, i);
    } else this.template.insertBefore(t, r);
    return t;
  }
  remove() {
    const t = this.parentElement;
    if (t) {
      const r = Array.from(this.childNodes);
      this.template.childElementCount,
        t.removeChild(this.open),
        this.template.append(...r),
        t.removeChild(this.close);
    }
  }
  appendChild(t) {
    return this.insertBefore(t, null);
  }
  insertBeforeTo(t, r) {
    const s = Array.from(this.childNodes);
    t.insertBefore(this.open, r);
    for (const i of s) t.insertBefore(i, r);
    t.insertBefore(this.close, r), this.template.childElementCount;
  }
  appendTo(t) {
    this.insertBeforeTo(t, null);
  }
  removeChild(t) {
    this.parentElement
      ? this.parentElement.removeChild(t)
      : this.template.removeChild(t);
  }
  getAttribute(t) {
    var r;
    return (r = this.attributes.get(t)) != null ? r : null;
  }
  hasAttribute(t) {
    return this.attributes.has(t);
  }
  setAttribute(t, r) {
    this.attributes.set(t, r),
      (this.open.data = updateComment(this.attributes));
  }
  removeAttribute(t) {
    this.attributes.delete(t),
      (this.open.data = updateComment(this.attributes));
  }
  matches(t) {
    return !1;
  }
  compareDocumentPosition(t) {
    return this.open.compareDocumentPosition(t);
  }
  closest(t) {
    const r = this.parentElement;
    return r ? r.closest(t) : null;
  }
  querySelectorAll(t) {
    const r = [];
    return (
      getChildren(this, "elements").forEach((s) => {
        isQwikElement(s) &&
          (s.matches(t) && r.push(s),
          r.concat(Array.from(s.querySelectorAll(t))));
      }),
      r
    );
  }
  querySelector(t) {
    for (const r of this.childNodes)
      if (isElement(r)) {
        if (r.matches(t)) return r;
        const s = r.querySelector(t);
        if (s !== null) return s;
      }
    return null;
  }
  get firstChild() {
    if (this.parentElement) {
      const t = this.open.nextSibling;
      return t === this.close ? null : t;
    }
    return this.template.firstChild;
  }
  get nextSibling() {
    return this.close.nextSibling;
  }
  get previousSibling() {
    return this.open.previousSibling;
  }
  get childNodes() {
    if (!this.parentElement) return this.template.childNodes;
    const t = [];
    let r = this.open;
    for (; (r = r.nextSibling) && r !== this.close; ) t.push(r);
    return t;
  }
  get isConnected() {
    return this.open.isConnected;
  }
  get parentElement() {
    return this.open.parentElement;
  }
}
const updateComment = (e) =>
    `qv ${((t) => {
      const r = [];
      return (
        t.forEach((s, i) => {
          var n;
          s
            ? r.push(`${i}=${((n = s), n.replace(/ /g, "+"))}`)
            : r.push(`${i}`);
        }),
        r.join(" ")
      );
    })(e)}`,
  processVirtualNodes = (e) => {
    if (e == null) return null;
    if (isComment(e)) {
      const t = getVirtualElement(e);
      if (t) return t;
    }
    return e;
  },
  getVirtualElement = (e) => {
    const t = e.__virtual;
    if (t) return t;
    if (e.data.startsWith("qv ")) {
      const r = findClose(e);
      return new VirtualElementImpl(e, r);
    }
    return null;
  },
  findClose = (e) => {
    let t = e.nextSibling,
      r = 1;
    for (; t; ) {
      if (isComment(t)) {
        if (t.data.startsWith("qv ")) r++;
        else if (t.data === "/qv" && (r--, r === 0)) return t;
      }
      t = t.nextSibling;
    }
    throw new Error("close not found");
  },
  getRootNode = (e) => (e == null ? null : isVirtualElement(e) ? e.open : e),
  createContext$1 = (e) => (
    /^[\w/.-]+$/.test(e), Object.freeze({ id: fromCamelToKebabCase(e) })
  ),
  useContextProvider = (e, t) => {
    const { get: r, set: s, ctx: i } = useSequentialScope();
    if (r !== void 0) return;
    const n = i.$hostElement$,
      a = getContext(n);
    let o = a.$contexts$;
    o || (a.$contexts$ = o = new Map()), o.set(e.id, t), s(!0);
  },
  useContext = (e, t) => {
    const { get: r, set: s, ctx: i } = useSequentialScope();
    if (r !== void 0) return r;
    const n = resolveContext(e, i.$hostElement$, i.$renderCtx$);
    if (n !== void 0) return s(n);
    if (t !== void 0) return s(t);
    throw qError(13, e.id);
  },
  resolveContext = (e, t, r) => {
    const s = e.id;
    if (r) {
      const i = r.$localStack$;
      for (let n = i.length - 1; n >= 0; n--) {
        const a = i[n];
        if (((t = a.$element$), a.$contexts$)) {
          const o = a.$contexts$.get(s);
          if (o) return o;
        }
      }
    }
    if (t.closest) {
      const i = queryContextFromDom(t, s);
      if (i !== void 0) return i;
    }
  },
  queryContextFromDom = (e, t) => {
    var s;
    let r = e;
    for (; r; ) {
      let i = r,
        n;
      for (; i && (n = findVirtual(i)); ) {
        const a = (s = tryGetContext(n)) == null ? void 0 : s.$contexts$;
        if (a && a.has(t)) return a.get(t);
        i = n;
      }
      r = r.parentElement;
    }
  },
  findVirtual = (e) => {
    let t = e,
      r = 1;
    for (; (t = t.previousSibling); )
      if (isComment(t)) {
        if (t.data === "/qv") r++;
        else if (t.data.startsWith("qv ") && (r--, r === 0))
          return getVirtualElement(t);
      }
    return null;
  },
  ERROR_CONTEXT = createContext$1("qk-error"),
  handleError = (e, t, r) => {
    if (isServer$1()) throw e;
    {
      const s = resolveContext(ERROR_CONTEXT, t, r);
      if (s === void 0) throw e;
      s.error = e;
    }
  },
  executeComponent = (e, t) => {
    (t.$dirty$ = !1), (t.$mounted$ = !0), (t.$slots$ = []);
    const r = t.$element$,
      s = t.$componentQrl$,
      i = t.$props$,
      n = pushRenderContext(e, t),
      a = newInvokeContext(r, void 0, "qRender"),
      o = (a.$waitOn$ = []);
    (n.$cmpCtx$ = t),
      (a.$subscriber$ = r),
      (a.$renderCtx$ = e),
      s.$setContainer$(e.$static$.$containerState$.$containerEl$);
    const h = s.getFn(a);
    return safeCall(
      () => h(i),
      (c) =>
        o.length > 0
          ? Promise.all(o).then(() =>
              t.$dirty$ ? executeComponent(e, t) : { node: c, rCtx: n }
            )
          : t.$dirty$
          ? executeComponent(e, t)
          : { node: c, rCtx: n },
      (c) => (handleError(c, r, e), { node: SkipRender, rCtx: n })
    );
  },
  createRenderContext = (e, t) => ({
    $static$: {
      $doc$: e,
      $containerState$: t,
      $hostElements$: new Set(),
      $operations$: [],
      $postOperations$: [],
      $roots$: [],
      $addSlots$: [],
      $rmSlots$: [],
    },
    $cmpCtx$: void 0,
    $localStack$: [],
  }),
  pushRenderContext = (e, t) => ({
    $static$: e.$static$,
    $cmpCtx$: e.$cmpCtx$,
    $localStack$: e.$localStack$.concat(t),
  }),
  serializeClass = (e) => {
    if (isString(e)) return e;
    if (isObject(e)) {
      if (isArray(e)) return e.join(" ");
      {
        let t = "",
          r = !1;
        for (const s of Object.keys(e))
          e[s] && (r && (t += " "), (t += s), (r = !0));
        return t;
      }
    }
    return "";
  },
  parseClassListRegex = /\s/,
  parseClassList = (e) => (e ? e.split(parseClassListRegex) : EMPTY_ARRAY$1),
  stringifyStyle = (e) => {
    if (e == null) return "";
    if (typeof e == "object") {
      if (isArray(e)) throw qError(0, e, "style");
      {
        const t = [];
        for (const r in e)
          if (Object.prototype.hasOwnProperty.call(e, r)) {
            const s = e[r];
            s && t.push(fromCamelToKebabCase(r) + ":" + s);
          }
        return t.join(";");
      }
    }
    return String(e);
  },
  getNextIndex = (e) => intToStr(e.$static$.$containerState$.$elementIndex$++),
  setQId = (e, t) => {
    const r = getNextIndex(e);
    (t.$id$ = r), t.$element$.setAttribute("q:id", r);
  },
  SKIPS_PROPS = [QSlot, "children"],
  serializeSStyle = (e) => {
    const t = e.join(" ");
    if (t.length > 0) return t;
  },
  renderComponent = (e, t, r) => {
    const s = !t.$mounted$,
      i = t.$element$,
      n = e.$static$.$containerState$;
    return (
      n.$hostsStaging$.delete(i),
      n.$subsManager$.$clearSub$(i),
      then(executeComponent(e, t), (a) => {
        const o = e.$static$,
          h = a.rCtx,
          c = newInvokeContext(i);
        if (
          (o.$hostElements$.add(i),
          (c.$subscriber$ = i),
          (c.$renderCtx$ = h),
          s)
        ) {
          if (t.$appendStyles$)
            for (const v of t.$appendStyles$)
              (S = v),
                (m = o).$containerState$.$styleIds$.add(S.styleId),
                m.$postOperations$.push({
                  $operation$: _appendHeadStyle,
                  $args$: [m.$containerState$.$containerEl$, S],
                });
          if (t.$scopeIds$) {
            const v = serializeSStyle(t.$scopeIds$);
            v && i.setAttribute("q:sstyle", v);
          }
        }
        var m, S;
        const u = processData$1(a.node, c);
        return then(u, (v) => {
          const g = wrapJSX(i, v),
            y = getVdom(t);
          return then(visitJsxNode(h, y, g, r), () => {
            t.$vdom$ = g;
          });
        });
      })
    );
  },
  getVdom = (e) => (e.$vdom$ || (e.$vdom$ = domToVnode(e.$element$)), e.$vdom$);
class ProcessedJSXNodeImpl {
  constructor(t, r, s, i) {
    (this.$type$ = t),
      (this.$props$ = r),
      (this.$children$ = s),
      (this.$key$ = i),
      (this.$elm$ = null),
      (this.$text$ = ""),
      (this.$signal$ = null);
  }
}
const wrapJSX = (e, t) => {
    const r = t === void 0 ? EMPTY_ARRAY$1 : isArray(t) ? t : [t],
      s = new ProcessedJSXNodeImpl(":virtual", {}, r, null);
    return (s.$elm$ = e), s;
  },
  processData$1 = (e, t) => {
    if (e != null && typeof e != "boolean") {
      if (isPrimitive(e)) {
        const r = new ProcessedJSXNodeImpl(
          "#text",
          EMPTY_OBJ$1,
          EMPTY_ARRAY$1,
          null
        );
        return (r.$text$ = String(e)), r;
      }
      if (isJSXNode(e))
        return ((r, s) => {
          const i = r.key != null ? String(r.key) : null,
            n = r.type,
            a = r.props,
            o = a.children;
          let h = "";
          if (isString(n)) h = n;
          else {
            if (n !== Virtual) {
              if (isFunction(n)) {
                const m = invoke(s, n, a, r.key);
                return processData$1(m, s);
              }
              throw qError(25, n);
            }
            h = ":virtual";
          }
          let c = EMPTY_ARRAY$1;
          return o != null
            ? then(
                processData$1(o, s),
                (m) => (
                  m !== void 0 && (c = isArray(m) ? m : [m]),
                  new ProcessedJSXNodeImpl(h, a, c, i)
                )
              )
            : new ProcessedJSXNodeImpl(h, a, c, i);
        })(e, t);
      if (isSignal(e)) {
        const r = e.value,
          s = new ProcessedJSXNodeImpl(
            "#text",
            EMPTY_OBJ$1,
            EMPTY_ARRAY$1,
            null
          );
        return (s.$text$ = String(r)), (s.$signal$ = e), s;
      }
      if (isArray(e)) {
        const r = promiseAll(e.flatMap((s) => processData$1(s, t)));
        return then(r, (s) => s.flat(100).filter(isNotNullable));
      }
      return isPromise(e)
        ? e.then((r) => processData$1(r, t))
        : e === SkipRender
        ? new ProcessedJSXNodeImpl(
            ":skipRender",
            EMPTY_OBJ$1,
            EMPTY_ARRAY$1,
            null
          )
        : void 0;
    }
  },
  isPrimitive = (e) => isString(e) || typeof e == "number",
  CONTAINER_STATE = Symbol("ContainerState"),
  getContainerState = (e) => {
    let t = e[CONTAINER_STATE];
    return t || (e[CONTAINER_STATE] = t = createContainerState(e)), t;
  },
  createContainerState = (e) => {
    const t = {
      $containerEl$: e,
      $proxyMap$: new WeakMap(),
      $subsManager$: null,
      $opsNext$: new Set(),
      $watchNext$: new Set(),
      $watchStaging$: new Set(),
      $hostsNext$: new Set(),
      $hostsStaging$: new Set(),
      $renderPromise$: void 0,
      $hostsRendering$: void 0,
      $envData$: {},
      $elementIndex$: 0,
      $styleIds$: new Set(),
    };
    return (t.$subsManager$ = createSubscriptionManager(t)), t;
  },
  serializeSubscription = (e, t) => {
    const r = e[0],
      s = t(e[1]);
    if (!s) return;
    let i = r + " " + s;
    if (e[0] === 0) e[2] && (i += " " + e[2]);
    else {
      const n = typeof e[3] == "string" ? e[3] : must(t(e[3]));
      (i += ` ${must(t(e[2]))} ${n} ${e[4]}`), e[5] && (i += ` ${e[5]}`);
    }
    return i;
  },
  parseSubscription = (e, t) => {
    const r = e.split(" "),
      s = parseInt(r[0], 10);
    r.length;
    const i = [s, t(r[1])];
    return (
      s === 0
        ? (r.length, i.push(r[2]))
        : (r.length === 5 || r.length, i.push(t(r[2]), t(r[3]), r[4], r[5])),
      i
    );
  },
  createSubscriptionManager = (e) => {
    const t = new Map();
    return {
      $createManager$: (r) => new LocalSubscriptionManager(t, e, r),
      $clearSub$: (r) => {
        const s = t.get(r);
        if (s) {
          for (const i of s) i.$unsubGroup$(r);
          t.delete(r), (s.length = 0);
        }
      },
    };
  };
class LocalSubscriptionManager {
  constructor(t, r, s) {
    (this.$groupToManagers$ = t),
      (this.$containerState$ = r),
      (this.$subs$ = s || []);
    for (const i of this.$subs$) this.$addToGroup$(i[1], this);
  }
  $addToGroup$(t, r) {
    let s = this.$groupToManagers$.get(t);
    s || this.$groupToManagers$.set(t, (s = [])), s.includes(r) || s.push(r);
  }
  $unsubGroup$(t) {
    const r = this.$subs$;
    for (let s = 0; s < r.length; s++) r[s][1] === t && (r.splice(s, 1), s--);
  }
  $addSub$(t) {
    const r = this.$subs$,
      [s, i] = t,
      n = t[t.length - 1];
    (s === 0 && r.some(([a, o, h]) => a === s && o === i && h === n)) ||
      (r.push(t), this.$addToGroup$(i, this));
  }
  $notifySubs$(t) {
    const r = this.$subs$;
    for (const s of r) {
      const i = s[s.length - 1];
      (t && i && i !== t) || notifyChange(s, this.$containerState$);
    }
  }
}
const setRef = (e, t) => {
    if (isFunction(e)) return e(t);
    if (isObject(e)) {
      if ("current" in e) return (e.current = t);
      if ("value" in e) return (e.value = t);
    }
    throw qError(32, e);
  },
  must = (e) => {
    if (e == null) throw logError("must be non null", e);
    return e;
  },
  SVG_NS = "http://www.w3.org/2000/svg",
  CHILDREN_PLACEHOLDER = [],
  visitJsxNode = (e, t, r, s) => smartUpdateChildren(e, t, r, "root", s),
  smartUpdateChildren = (e, t, r, s, i) => {
    t.$elm$;
    const n = r.$children$;
    if (n.length === 1 && n[0].$type$ === ":skipRender") return;
    const a = t.$elm$;
    t.$children$ === CHILDREN_PLACEHOLDER &&
      a.nodeName === "HEAD" &&
      ((s = "head"), (i |= 2));
    const o = getVnodeChildren(t, s);
    return o.length > 0 && n.length > 0
      ? updateChildren(e, a, o, n, i)
      : n.length > 0
      ? addVnodes(e, a, null, n, 0, n.length - 1, i)
      : o.length > 0
      ? removeVnodes(e.$static$, o, 0, o.length - 1)
      : void 0;
  },
  getVnodeChildren = (e, t) => {
    const r = e.$children$,
      s = e.$elm$;
    return r === CHILDREN_PLACEHOLDER
      ? (e.$children$ = getChildrenVnodes(s, t))
      : r;
  },
  updateChildren = (e, t, r, s, i) => {
    let n = 0,
      a = 0,
      o = r.length - 1,
      h = r[0],
      c = r[o],
      m = s.length - 1,
      S = s[0],
      u = s[m],
      v,
      g,
      y;
    const E = [],
      l = e.$static$;
    for (; n <= o && a <= m; )
      if (h == null) h = r[++n];
      else if (c == null) c = r[--o];
      else if (S == null) S = s[++a];
      else if (u == null) u = s[--m];
      else if (sameVnode(h, S))
        E.push(patchVnode(e, h, S, i)), (h = r[++n]), (S = s[++a]);
      else if (sameVnode(c, u))
        E.push(patchVnode(e, c, u, i)), (c = r[--o]), (u = s[--m]);
      else if (sameVnode(h, u))
        h.$elm$,
          c.$elm$,
          E.push(patchVnode(e, h, u, i)),
          insertBefore(l, t, h.$elm$, c.$elm$.nextSibling),
          (h = r[++n]),
          (u = s[--m]);
      else if (sameVnode(c, S))
        h.$elm$,
          c.$elm$,
          E.push(patchVnode(e, c, S, i)),
          insertBefore(l, t, c.$elm$, h.$elm$),
          (c = r[--o]),
          (S = s[++a]);
      else {
        if (
          (v === void 0 && (v = createKeyToOldIdx(r, n, o)),
          (g = v[S.$key$]),
          g === void 0)
        ) {
          const p = createElm(e, S, i);
          E.push(
            then(p, (f) => {
              insertBefore(l, t, f, h == null ? void 0 : h.$elm$);
            })
          );
        } else if (((y = r[g]), isTagName(y, S.$type$)))
          E.push(patchVnode(e, y, S, i)),
            (r[g] = void 0),
            y.$elm$,
            insertBefore(l, t, y.$elm$, h.$elm$);
        else {
          const p = createElm(e, S, i);
          E.push(
            then(p, (f) => {
              insertBefore(l, t, f, h == null ? void 0 : h.$elm$);
            })
          );
        }
        S = s[++a];
      }
    if (a <= m) {
      const p = s[m + 1] == null ? null : s[m + 1].$elm$;
      E.push(addVnodes(e, t, p, s, a, m, i));
    }
    let d = promiseAll(E);
    return (
      n <= o &&
        (d = then(d, () => {
          removeVnodes(l, r, n, o);
        })),
      d
    );
  },
  getCh = (e, t) => {
    const r = isVirtualElement(e) ? e.close : null,
      s = [];
    let i = e.firstChild;
    for (
      ;
      (i = processVirtualNodes(i)) &&
      (t(i) && s.push(i), (i = i.nextSibling), i !== r);

    );
    return s;
  },
  getChildren = (e, t) => {
    switch (t) {
      case "root":
        return getCh(e, isChildComponent);
      case "head":
        return getCh(e, isHeadChildren);
      case "elements":
        return getCh(e, isQwikElement);
    }
  },
  getChildrenVnodes = (e, t) => getChildren(e, t).map(getVnodeFromEl),
  getVnodeFromEl = (e) => {
    var t, r;
    return isElement(e) &&
      (r = (t = tryGetContext(e)) == null ? void 0 : t.$vdom$) != null
      ? r
      : domToVnode(e);
  },
  domToVnode = (e) => {
    if (isQwikElement(e)) {
      const t = isVirtualElement(e) ? EMPTY_OBJ$1 : getProps(e),
        r = new ProcessedJSXNodeImpl(
          e.localName,
          t,
          CHILDREN_PLACEHOLDER,
          getKey(e)
        );
      return (r.$elm$ = e), r;
    }
    if (isText(e)) {
      const t = new ProcessedJSXNodeImpl(
        e.nodeName,
        {},
        CHILDREN_PLACEHOLDER,
        null
      );
      return (t.$text$ = e.data), (t.$elm$ = e), t;
    }
    throw new Error("invalid node");
  },
  getProps = (e) => {
    const t = {},
      r = e.attributes,
      s = r.length;
    for (let i = 0; i < s; i++) {
      const n = r.item(i),
        a = n.name.toLowerCase();
      a.includes(":") ||
        (t[a] = a === "class" ? parseDomClass(n.value) : n.value);
    }
    return t;
  },
  parseDomClass = (e) =>
    parseClassList(e)
      .filter((t) => !t.startsWith("\u2B50\uFE0F"))
      .join(" "),
  isHeadChildren = (e) => {
    const t = e.nodeType;
    return t === 1 ? e.hasAttribute("q:head") : t === 111;
  },
  isSlotTemplate = (e) => e.nodeName === "Q:TEMPLATE",
  isChildComponent = (e) => {
    const t = e.nodeType;
    if (t === 3 || t === 111) return !0;
    if (t !== 1) return !1;
    const r = e.nodeName;
    return r !== "Q:TEMPLATE" && (r !== "HEAD" || e.hasAttribute("q:head"));
  },
  patchVnode = (e, t, r, s) => {
    t.$type$, r.$type$;
    const i = t.$elm$,
      n = r.$type$,
      a = e.$static$,
      o = n === ":virtual",
      h = e.$cmpCtx$;
    if (((r.$elm$ = i), n === "#text")) {
      const y = r.$signal$;
      return (
        y && addSignalSub(2, h.$element$, y, i, "data"),
        void (t.$text$ !== r.$text$ && setProperty(a, i, "data", r.$text$))
      );
    }
    let c = !!(1 & s);
    c || n !== "svg" || ((s |= 1), (c = !0));
    const m = r.$props$,
      S = o && "q:renderFn" in m,
      u = getContext(i);
    if ((a.$containerState$.$containerEl$, !S)) {
      const y = h.li,
        E = u.li;
      if (
        ((E.length = 0),
        (r.$props$ = updateProperties(a, u, h.$element$, t.$props$, m)),
        y.length > 0 && (addQRLListener(E, y), (y.length = 0)),
        E.length > 0)
      ) {
        const l = groupListeners(E);
        for (const d of l) setAttribute(a, i, d[0], serializeQRLs(d[1], u));
      }
      return (
        c && r.$type$ === "foreignObject" && ((s &= -2), (c = !1)),
        o && "q:s" in m
          ? (h.$slots$, void h.$slots$.push(r))
          : m[dangerouslySetInnerHTML] !== void 0 || (o && "qonce" in m)
          ? void 0
          : smartUpdateChildren(e, t, r, "root", s)
      );
    }
    const v = m.props;
    let g = setComponentProps$1(u, e, v);
    return (
      g ||
        u.$componentQrl$ ||
        u.$element$.hasAttribute("q:id") ||
        (setQId(e, u),
        (u.$componentQrl$ = v["q:renderFn"]),
        u.$componentQrl$,
        (g = !0)),
      g
        ? then(renderComponent(e, u, s), () =>
            renderContentProjection(e, u, r, s)
          )
        : renderContentProjection(e, u, r, s)
    );
  },
  renderContentProjection = (e, t, r, s) => {
    const i = r.$children$,
      n = e.$static$,
      a = ((c) => {
        var S;
        const m = {};
        for (const u of c) {
          const v = getSlotName(u);
          ((S = m[v]) != null
            ? S
            : (m[v] = new ProcessedJSXNodeImpl(
                ":virtual",
                { "q:s": "" },
                [],
                v
              ))
          ).$children$.push(u);
        }
        return m;
      })(i),
      o = pushRenderContext(e, t),
      h = getSlotMap(t);
    for (const c of Object.keys(h.slots))
      if (!a[c]) {
        const m = h.slots[c],
          S = getChildrenVnodes(m, "root");
        if (S.length > 0) {
          const u = tryGetContext(m);
          u && u.$vdom$ && (u.$vdom$.$children$ = []),
            removeVnodes(n, S, 0, S.length - 1);
        }
      }
    for (const c of Object.keys(h.templates)) {
      const m = h.templates[c];
      m &&
        ((a[c] && !h.slots[c]) ||
          (removeNode(n, m), (h.templates[c] = void 0)));
    }
    return promiseAll(
      Object.keys(a).map((c) => {
        const m = a[c],
          S = getSlotElement(n, h, t.$element$, c),
          u = getContext(S),
          v = getVdom(u);
        return (
          (u.$vdom$ = m), (m.$elm$ = S), smartUpdateChildren(o, v, m, "root", s)
        );
      })
    );
  },
  addVnodes = (e, t, r, s, i, n, a) => {
    const o = [];
    let h = !1;
    for (; i <= n; ++i) {
      const c = s[i],
        m = createElm(e, c, a);
      o.push(m), isPromise(m) && (h = !0);
    }
    if (h)
      return Promise.all(o).then((c) => insertChildren(e.$static$, t, c, r));
    insertChildren(e.$static$, t, o, r);
  },
  insertChildren = (e, t, r, s) => {
    for (const i of r) insertBefore(e, t, i, s);
  },
  removeVnodes = (e, t, r, s) => {
    for (; r <= s; ++r) {
      const i = t[r];
      i && (i.$elm$, removeNode(e, i.$elm$));
    }
  },
  getSlotElement = (e, t, r, s) => {
    const i = t.slots[s];
    if (i) return i;
    const n = t.templates[s];
    if (n) return n;
    const a = createTemplate(e.$doc$, s);
    return (
      ((o, h, c) => {
        o.$operations$.push({
          $operation$: directInsertBefore,
          $args$: [h, c, h.firstChild],
        });
      })(e, r, a),
      (t.templates[s] = a),
      a
    );
  },
  getSlotName = (e) => {
    var t;
    return (t = e.$props$[QSlot]) != null ? t : "";
  },
  createElm = (e, t, r) => {
    const s = t.$type$,
      i = e.$static$.$doc$,
      n = e.$cmpCtx$;
    if (s === "#text") {
      const p = t.$signal$,
        f = ((b, x) => b.createTextNode(x))(i, t.$text$);
      return (
        p && n && addSignalSub(2, n.$element$, p, f, "data"), (t.$elm$ = f)
      );
    }
    let a,
      o = !!(2 & r),
      h = !!(1 & r);
    h || s !== "svg" || ((r |= 1), (h = !0));
    const c = s === ":virtual",
      m = t.$props$,
      S = "q:renderFn" in m,
      u = e.$static$;
    c
      ? (a = ((p) => {
          const f = p.createComment("qv "),
            b = p.createComment("/qv");
          return new VirtualElementImpl(f, b);
        })(i))
      : s === "head"
      ? ((a = i.head), (r |= 2), (o = !0))
      : ((a = createElement(i, s, h)), (r &= -3)),
      (t.$elm$ = a),
      h && s === "foreignObject" && ((h = !1), (r &= -2));
    const v = getContext(a);
    if (S) {
      setKey(a, t.$key$);
      const p = m["q:renderFn"];
      return (
        setComponentProps$1(v, e, m.props),
        setQId(e, v),
        (v.$componentQrl$ = p),
        then(renderComponent(e, v, r), () => {
          let f = t.$children$;
          if (f.length === 0) return a;
          f.length === 1 &&
            f[0].$type$ === ":skipRender" &&
            (f = f[0].$children$);
          const b = pushRenderContext(e, v),
            x = getSlotMap(v),
            $ = f.map((_) => createElm(b, _, r));
          return then(promiseAll($), () => {
            for (const _ of f)
              _.$elm$,
                appendChild(
                  u,
                  getSlotElement(u, x, a, getSlotName(_)),
                  _.$elm$
                );
            return a;
          });
        })
      );
    }
    const g = c && "q:s" in m,
      y = !c && "ref" in m,
      E = v.li;
    if (
      ((t.$props$ = setProperties(u, v, n == null ? void 0 : n.$element$, m)),
      n && !c)
    ) {
      const p = n.$scopeIds$;
      p &&
        p.forEach((f) => {
          a.classList.add(f);
        }),
        n.$needAttachListeners$ &&
          (addQRLListener(E, n.li), (n.$needAttachListeners$ = !1));
    }
    g
      ? (n.$slots$,
        setKey(a, t.$key$),
        directSetAttribute(a, "q:sref", n.$id$),
        n.$slots$.push(t),
        u.$addSlots$.push([a, n.$element$]))
      : setKey(a, t.$key$);
    {
      o && !c && directSetAttribute(a, "q:head", ""),
        (E.length > 0 || y) && setQId(e, v);
      const p = groupListeners(E);
      for (const f of p) setAttribute(u, a, f[0], serializeQRLs(f[1], v));
    }
    if (m[dangerouslySetInnerHTML] !== void 0) return a;
    let l = t.$children$;
    if (l.length === 0) return a;
    l.length === 1 && l[0].$type$ === ":skipRender" && (l = l[0].$children$);
    const d = l.map((p) => createElm(e, p, r));
    return then(promiseAll(d), () => {
      for (const p of l) p.$elm$, appendChild(e.$static$, a, p.$elm$);
      return a;
    });
  },
  getSlotMap = (e) => {
    var n, a;
    const t = ((o) =>
        o.$slots$ ||
        (o.$element$.parentElement, (o.$slots$ = readDOMSlots(o))))(e),
      r = {},
      s = {},
      i = Array.from(e.$element$.childNodes).filter(isSlotTemplate);
    for (const o of t) o.$elm$, (r[(n = o.$key$) != null ? n : ""] = o.$elm$);
    for (const o of i)
      s[(a = directGetAttribute(o, QSlot)) != null ? a : ""] = o;
    return { slots: r, templates: s };
  },
  readDOMSlots = (e) =>
    ((t, r, s) => {
      const i = ((o, h, c) =>
          o.ownerDocument.createTreeWalker(o, 128, {
            acceptNode(m) {
              const S = getVirtualElement(m);
              return S && directGetAttribute(S, "q:sref") === c ? 1 : 2;
            },
          }))(t, 0, s),
        n = [];
      let a = null;
      for (; (a = i.nextNode()); ) n.push(getVirtualElement(a));
      return n;
    })(e.$element$.parentElement, 0, e.$id$).map(domToVnode),
  checkBeforeAssign = (e, t, r, s) => (
    r in t && t[r] !== s && setProperty(e, t, r, s), !0
  ),
  forceAttribute = (e, t, r, s) => (setAttribute(e, t, r.toLowerCase(), s), !0),
  dangerouslySetInnerHTML = "dangerouslySetInnerHTML",
  PROP_HANDLER_MAP = {
    style: (e, t, r, s) => (
      setProperty(e, t.style, "cssText", stringifyStyle(s)), !0
    ),
    class: (e, t, r, s, i) => {
      const n = parseClassList(i),
        a = parseClassList(s);
      return (
        ((o, h, c, m) => {
          o
            ? o.$operations$.push({
                $operation$: _setClasslist,
                $args$: [h, c, m],
              })
            : _setClasslist(h, c, m);
        })(
          e,
          t,
          n.filter((o) => o && !a.includes(o)),
          a.filter((o) => o && !n.includes(o))
        ),
        !0
      );
    },
    value: checkBeforeAssign,
    checked: checkBeforeAssign,
    href: forceAttribute,
    list: forceAttribute,
    form: forceAttribute,
    tabIndex: forceAttribute,
    download: forceAttribute,
    [dangerouslySetInnerHTML]: (e, t, r, s) => (
      dangerouslySetInnerHTML in t
        ? setProperty(e, t, dangerouslySetInnerHTML, s)
        : "innerHTML" in t && setProperty(e, t, "innerHTML", s),
      !0
    ),
    innerHTML: () => !0,
  },
  updateProperties = (e, t, r, s, i) => {
    var c;
    const n = getKeys(s, i),
      a = {};
    if (n.length === 0) return a;
    const o = (c = i[_IMMUTABLE]) != null ? c : EMPTY_OBJ$1,
      h = t.$element$;
    for (let m of n) {
      if (m === "ref") {
        setRef(i[m], h);
        continue;
      }
      let S = isSignal(o[m]) ? o[m] : i[m];
      if (isOnProp(m)) {
        setEvent(t.li, m, S, e.$containerState$.$containerEl$);
        continue;
      }
      m === "className" && (m = "class"),
        isSignal(S) && (addSignalSub(1, r, S, h, m), (S = S.value)),
        m === "class" && (i.class = S = serializeClass(S));
      const u = m.toLowerCase(),
        v = s[u];
      (a[u] = S), v !== S && smartSetProperty(e, h, m, S, v);
    }
    return a;
  },
  smartSetProperty = (e, t, r, s, i) => {
    const n = PROP_HANDLER_MAP[r];
    (n && n(e, t, r, s, i)) ||
      (r in t ? setProperty(e, t, r, s) : setAttribute(e, t, r, s));
  },
  getKeys = (e, t) => {
    const r = Object.keys(t),
      s = r.map((n) => n.toLowerCase()),
      i = Object.keys(e);
    return (
      r.push(...i.filter((n) => !s.includes(n))),
      r.filter((n) => n !== "children")
    );
  },
  addGlobalListener = (e, t, r) => {
    try {
      window.qwikevents && window.qwikevents.push(getEventName(r));
    } catch {}
  },
  setProperties = (e, t, r, s) => {
    var h;
    const i = t.$element$,
      n = Object.keys(s),
      a = {};
    if (n.length === 0) return a;
    const o = (h = s[_IMMUTABLE]) != null ? h : EMPTY_OBJ$1;
    for (let c of n) {
      if (c === "children") continue;
      if (c === "ref") {
        setRef(s[c], i);
        continue;
      }
      let m = isSignal(o[c]) ? o[c] : s[c];
      isOnProp(c)
        ? addGlobalListener(
            0,
            0,
            setEvent(t.li, c, m, e.$containerState$.$containerEl$)
          )
        : (c === "className" && (c = "class"),
          r && isSignal(m) && (addSignalSub(1, r, m, i, c), (m = m.value)),
          c === "class" && (m = serializeClass(m)),
          (a[c.toLowerCase()] = m),
          smartSetProperty(e, i, c, m, void 0));
    }
    return a;
  },
  setComponentProps$1 = (e, t, r) => {
    const s = Object.keys(r);
    let i = e.$props$;
    i ||
      (e.$props$ = i =
        createProxy(
          { [QObjectFlagsSymbol]: QObjectImmutable },
          t.$static$.$containerState$
        ));
    const n = getPropsMutator(i);
    if (s.length === 0) return !1;
    for (const a of s) SKIPS_PROPS.includes(a) || n.set(a, r[a]);
    return e.$dirty$;
  },
  cleanupTree = (e, t, r, s) => {
    if (s && e.hasAttribute("q:s")) return void t.$rmSlots$.push(e);
    cleanupElement(e, r);
    const i = getChildren(e, "elements");
    for (const n of i) cleanupTree(n, t, r, s);
  },
  cleanupElement = (e, t) => {
    const r = tryGetContext(e);
    r && cleanupContext(r, t);
  },
  directAppendChild = (e, t) => {
    isVirtualElement(t) ? t.appendTo(e) : e.appendChild(t);
  },
  directRemoveChild = (e, t) => {
    isVirtualElement(t) ? t.remove() : e.removeChild(t);
  },
  directInsertBefore = (e, t, r) => {
    isVirtualElement(t)
      ? t.insertBeforeTo(e, getRootNode(r))
      : e.insertBefore(t, getRootNode(r));
  },
  createKeyToOldIdx = (e, t, r) => {
    const s = {};
    for (let i = t; i <= r; ++i) {
      const n = e[i].$key$;
      n != null && (s[n] = i);
    }
    return s;
  },
  sameVnode = (e, t) => e.$type$ === t.$type$ && e.$key$ === t.$key$,
  isTagName = (e, t) => e.$type$ === t,
  useLexicalScope = () => {
    const e = getInvokeContext();
    let t = e.$qrl$;
    if (t) t.$captureRef$;
    else {
      const r = e.$element$,
        s = getWrappingContainer(r),
        i = getContext(r);
      (t = parseQRL(decodeURIComponent(String(e.$url$)), s)),
        resumeIfNeeded(s),
        inflateQrl(t, i);
    }
    return t.$captureRef$;
  },
  notifyChange = (e, t) => {
    if (e[0] === 0) {
      const r = e[1];
      isQwikElement(r) ? notifyRender(r, t) : notifyWatch(r, t);
    } else notifySignalOperation(e, t);
  },
  notifyRender = (e, t) => {
    const r = isServer$1();
    r || resumeIfNeeded(t.$containerEl$);
    const s = getContext(e);
    if ((s.$componentQrl$, !s.$dirty$))
      if (((s.$dirty$ = !0), t.$hostsRendering$ !== void 0))
        t.$renderPromise$, t.$hostsStaging$.add(e);
      else {
        if (r) return;
        t.$hostsNext$.add(e), scheduleFrame(t);
      }
  },
  notifySignalOperation = (e, t) => {
    t.$hostsRendering$ !== void 0
      ? (t.$renderPromise$, t.$opsNext$.add(e))
      : (t.$opsNext$.add(e), scheduleFrame(t));
  },
  notifyWatch = (e, t) => {
    e.$flags$ & WatchFlagsIsDirty ||
      ((e.$flags$ |= WatchFlagsIsDirty),
      t.$hostsRendering$ !== void 0
        ? (t.$renderPromise$, t.$watchStaging$.add(e))
        : (t.$watchNext$.add(e), scheduleFrame(t)));
  },
  scheduleFrame = (e) => (
    e.$renderPromise$ === void 0 &&
      (e.$renderPromise$ = getPlatform().nextTick(() => renderMarked(e))),
    e.$renderPromise$
  ),
  _hW = () => {
    const [e] = useLexicalScope();
    notifyWatch(e, getContainerState(getWrappingContainer(e.$el$)));
  },
  renderMarked = async (e) => {
    const t = getDocument(e.$containerEl$);
    try {
      const r = createRenderContext(t, e),
        s = r.$static$,
        i = (e.$hostsRendering$ = new Set(e.$hostsNext$));
      e.$hostsNext$.clear(),
        await executeWatchesBefore(e),
        e.$hostsStaging$.forEach((a) => {
          i.add(a);
        }),
        e.$hostsStaging$.clear();
      const n = Array.from(i);
      sortNodes(n);
      for (const a of n)
        if (!s.$hostElements$.has(a)) {
          const o = getContext(a);
          if (o.$componentQrl$) {
            a.isConnected, s.$roots$.push(o);
            try {
              await renderComponent(r, o, getFlags(a.parentElement));
            } catch {}
          }
        }
      if (
        (e.$opsNext$.forEach((a) =>
          ((o, h) => {
            var S;
            const c = (S = h[5]) != null ? S : "value",
              m = h[2][c];
            switch (h[0]) {
              case 1: {
                const u = h[4],
                  v = h[3],
                  g = tryGetContext(v);
                let y;
                if (g && g.$vdom$) {
                  const E = u.toLowerCase();
                  (y = g.$vdom$.$props$[E]), (g.$vdom$.$props$[E] = m);
                }
                return smartSetProperty(o, v, u, m, y);
              }
              case 2:
                return setProperty(o, h[3], "data", m);
            }
          })(s, a)
        ),
        e.$opsNext$.clear(),
        s.$operations$.push(...s.$postOperations$),
        s.$operations$.length === 0)
      )
        return void (await postRendering(e, s));
      await getPlatform().raf(
        () => (
          (({ $static$: a }) => {
            executeDOMRender(a);
          })(r),
          postRendering(e, s)
        )
      );
    } catch (r) {
      logError(r);
    }
  },
  getFlags = (e) => {
    let t = 0;
    return (
      e &&
        (e.namespaceURI === SVG_NS && (t |= 1),
        e.tagName === "HEAD" && (t |= 2)),
      t
    );
  },
  postRendering = async (e, t) => {
    await executeWatchesAfter(
      e,
      (r, s) =>
        (r.$flags$ & WatchFlagsIsEffect) != 0 &&
        (!s || t.$hostElements$.has(r.$el$))
    ),
      e.$hostsStaging$.forEach((r) => {
        e.$hostsNext$.add(r);
      }),
      e.$hostsStaging$.clear(),
      (e.$hostsRendering$ = void 0),
      (e.$renderPromise$ = void 0),
      e.$hostsNext$.size + e.$watchNext$.size + e.$opsNext$.size > 0 &&
        scheduleFrame(e);
  },
  executeWatchesBefore = async (e) => {
    const t = e.$containerEl$,
      r = [],
      s = [],
      i = (a) => (a.$flags$ & WatchFlagsIsWatch) != 0,
      n = (a) => (a.$flags$ & WatchFlagsIsResource) != 0;
    e.$watchNext$.forEach((a) => {
      i(a) &&
        (s.push(then(a.$qrl$.$resolveLazy$(t), () => a)),
        e.$watchNext$.delete(a)),
        n(a) &&
          (r.push(then(a.$qrl$.$resolveLazy$(t), () => a)),
          e.$watchNext$.delete(a));
    });
    do
      if (
        (e.$watchStaging$.forEach((a) => {
          i(a)
            ? s.push(then(a.$qrl$.$resolveLazy$(t), () => a))
            : n(a)
            ? r.push(then(a.$qrl$.$resolveLazy$(t), () => a))
            : e.$watchNext$.add(a);
        }),
        e.$watchStaging$.clear(),
        s.length > 0)
      ) {
        const a = await Promise.all(s);
        sortWatches(a),
          await Promise.all(a.map((o) => runSubscriber(o, e))),
          (s.length = 0);
      }
    while (e.$watchStaging$.size > 0);
    if (r.length > 0) {
      const a = await Promise.all(r);
      sortWatches(a), a.forEach((o) => runSubscriber(o, e));
    }
  },
  executeWatchesAfter = async (e, t) => {
    const r = [],
      s = e.$containerEl$;
    e.$watchNext$.forEach((i) => {
      t(i, !1) &&
        (r.push(then(i.$qrl$.$resolveLazy$(s), () => i)),
        e.$watchNext$.delete(i));
    });
    do
      if (
        (e.$watchStaging$.forEach((i) => {
          t(i, !0)
            ? r.push(then(i.$qrl$.$resolveLazy$(s), () => i))
            : e.$watchNext$.add(i);
        }),
        e.$watchStaging$.clear(),
        r.length > 0)
      ) {
        const i = await Promise.all(r);
        sortWatches(i),
          await Promise.all(i.map((n) => runSubscriber(n, e))),
          (r.length = 0);
      }
    while (e.$watchStaging$.size > 0);
  },
  sortNodes = (e) => {
    e.sort((t, r) => (2 & t.compareDocumentPosition(getRootNode(r)) ? 1 : -1));
  },
  sortWatches = (e) => {
    e.sort((t, r) =>
      t.$el$ === r.$el$
        ? t.$index$ < r.$index$
          ? -1
          : 1
        : (2 & t.$el$.compareDocumentPosition(getRootNode(r.$el$))) != 0
        ? 1
        : -1
    );
  },
  WatchFlagsIsEffect = 1,
  WatchFlagsIsWatch = 2,
  WatchFlagsIsDirty = 4,
  WatchFlagsIsCleanup = 8,
  WatchFlagsIsResource = 16,
  useWatchQrl = (e, t) => {
    const { get: r, set: s, ctx: i, i: n } = useSequentialScope();
    if (r) return;
    const a = i.$hostElement$,
      o = i.$renderCtx$.$static$.$containerState$,
      h = new Watch(WatchFlagsIsDirty | WatchFlagsIsWatch, n, a, e, void 0),
      c = getContext(a);
    s(!0),
      e.$resolveLazy$(o.$containerEl$),
      c.$watches$ || (c.$watches$ = []),
      c.$watches$.push(h),
      waitAndRun(i, () => runSubscriber(h, o, i.$renderCtx$)),
      isServer$1() && useRunWatch(h, t == null ? void 0 : t.eagerness);
  },
  useClientEffectQrl = (e, t) => {
    var S;
    const { get: r, set: s, i, ctx: n } = useSequentialScope();
    if (r) return;
    const a = n.$hostElement$,
      o = new Watch(WatchFlagsIsEffect, i, a, e, void 0),
      h = (S = t == null ? void 0 : t.eagerness) != null ? S : "visible",
      c = getContext(a),
      m = n.$renderCtx$.$static$.$containerState$;
    s(!0),
      c.$watches$ || (c.$watches$ = []),
      c.$watches$.push(o),
      useRunWatch(o, h),
      isServer$1() || (e.$resolveLazy$(m.$containerEl$), notifyWatch(o, m));
  },
  isResourceWatch = (e) => !!e.$resource$,
  runSubscriber = async (e, t, r) => (
    e.$flags$, isResourceWatch(e) ? runResource(e, t) : runWatch(e, t, r)
  ),
  runResource = (e, t, r) => {
    (e.$flags$ &= ~WatchFlagsIsDirty), cleanupWatch(e);
    const s = e.$el$,
      i = newInvokeContext(s, void 0, "WatchEvent"),
      { $subsManager$: n } = t;
    e.$qrl$.$captureRef$;
    const a = e.$qrl$.getFn(i, () => {
        n.$clearSub$(e);
      }),
      o = [],
      h = e.$resource$,
      c = unwrapProxy(h),
      m = {
        track: (l, d) => {
          if (isFunction(l)) {
            const f = newInvokeContext();
            return (f.$subscriber$ = e), invoke(f, l);
          }
          const p = getProxyManager(l);
          return (
            p ? p.$addSub$([0, e, d]) : logErrorAndStop(codeToText(26), l),
            d ? l[d] : isSignal(l) ? l.value : l
          );
        },
        cleanup(l) {
          o.push(l);
        },
        previous: c.resolved,
      };
    let S,
      u,
      v = !1;
    const g = (l, d) =>
      !v &&
      ((v = !0),
      l
        ? ((v = !0),
          (h.state = "resolved"),
          (h.resolved = d),
          (h.error = void 0),
          S(d))
        : ((v = !0),
          (h.state = "rejected"),
          (h.resolved = void 0),
          (h.error = d),
          u(d)),
      !0);
    invoke(i, () => {
      (h.state = "pending"),
        (h.resolved = void 0),
        (h.promise = new Promise((l, d) => {
          (S = l), (u = d);
        }));
    }),
      (e.$destroy$ = noSerialize(() => {
        o.forEach((l) => l());
      }));
    const y = safeCall(
        () => then(r, () => a(m)),
        (l) => {
          g(!0, l);
        },
        (l) => {
          g(!1, l);
        }
      ),
      E = c.timeout;
    return E
      ? Promise.race([
          y,
          delay(E).then(() => {
            g(!1, "timeout") && cleanupWatch(e);
          }),
        ])
      : y;
  },
  runWatch = (e, t, r) => {
    (e.$flags$ &= ~WatchFlagsIsDirty), cleanupWatch(e);
    const s = e.$el$,
      i = newInvokeContext(s, void 0, "WatchEvent"),
      { $subsManager$: n } = t,
      a = e.$qrl$.getFn(i, () => {
        n.$clearSub$(e);
      }),
      o = [];
    e.$destroy$ = noSerialize(() => {
      o.forEach((c) => c());
    });
    const h = {
      track: (c, m) => {
        if (isFunction(c)) {
          const u = newInvokeContext();
          return (u.$subscriber$ = e), invoke(u, c);
        }
        const S = getProxyManager(c);
        return (
          S ? S.$addSub$([0, e, m]) : logErrorAndStop(codeToText(26), c),
          m ? c[m] : c
        );
      },
      cleanup(c) {
        o.push(c);
      },
    };
    return safeCall(
      () => a(h),
      (c) => {
        isFunction(c) && o.push(c);
      },
      (c) => {
        handleError(c, s, r);
      }
    );
  },
  cleanupWatch = (e) => {
    const t = e.$destroy$;
    if (t) {
      e.$destroy$ = void 0;
      try {
        t();
      } catch (r) {
        logError(r);
      }
    }
  },
  destroyWatch = (e) => {
    e.$flags$ & WatchFlagsIsCleanup
      ? ((e.$flags$ &= ~WatchFlagsIsCleanup), (0, e.$qrl$)())
      : cleanupWatch(e);
  },
  useRunWatch = (e, t) => {
    t === "visible"
      ? useOn("qvisible", getWatchHandlerQrl(e))
      : t === "load"
      ? useOnDocument("qinit", getWatchHandlerQrl(e))
      : t === "idle" && useOnDocument("qidle", getWatchHandlerQrl(e));
  },
  getWatchHandlerQrl = (e) => {
    const t = e.$qrl$;
    return createQRL(t.$chunk$, "_hW", _hW, null, null, [e], t.$symbol$);
  };
class Watch {
  constructor(t, r, s, i, n) {
    (this.$flags$ = t),
      (this.$index$ = r),
      (this.$el$ = s),
      (this.$qrl$ = i),
      (this.$resource$ = n);
  }
}
const _createResourceReturn = (e) => ({
    __brand: "resource",
    promise: void 0,
    resolved: void 0,
    error: void 0,
    state: "pending",
    timeout: e == null ? void 0 : e.timeout,
  }),
  QRLSerializer = {
    prefix: "",
    test: (e) => isQrl$1(e),
    collect: (e, t, r) => {
      if (e.$captureRef$) for (const s of e.$captureRef$) collectValue(s, t, r);
    },
    serialize: (e, t) => serializeQRL(e, { $getObjId$: t }),
    prepare: (e, t) => parseQRL(e, t.$containerEl$),
    fill: (e, t) => {
      e.$capture$ &&
        e.$capture$.length > 0 &&
        ((e.$captureRef$ = e.$capture$.map(t)), (e.$capture$ = null));
    },
  },
  WatchSerializer = {
    prefix: "",
    test: (e) => {
      return isObject((t = e)) && t instanceof Watch;
      var t;
    },
    collect: (e, t, r) => {
      collectValue(e.$qrl$, t, r),
        e.$resource$ && collectValue(e.$resource$, t, r);
    },
    serialize: (e, t) =>
      ((r, s) => {
        let i = `${intToStr(r.$flags$)} ${intToStr(r.$index$)} ${s(
          r.$qrl$
        )} ${s(r.$el$)}`;
        return isResourceWatch(r) && (i += ` ${s(r.$resource$)}`), i;
      })(e, t),
    prepare: (e) =>
      ((t) => {
        const [r, s, i, n, a] = t.split(" ");
        return new Watch(strToInt(r), strToInt(s), n, i, a);
      })(e),
    fill: (e, t) => {
      (e.$el$ = t(e.$el$)),
        (e.$qrl$ = t(e.$qrl$)),
        e.$resource$ && (e.$resource$ = t(e.$resource$));
    },
  },
  ResourceSerializer = {
    prefix: "",
    test: (e) => {
      return isObject((t = e)) && t.__brand === "resource";
      var t;
    },
    collect: (e, t, r) => {
      collectValue(e.promise, t, r), collectValue(e.resolved, t, r);
    },
    serialize: (e, t) =>
      ((r, s) => {
        const i = r.state;
        return i === "resolved"
          ? `0 ${s(r.resolved)}`
          : i === "pending"
          ? "1"
          : `2 ${s(r.error)}`;
      })(e, t),
    prepare: (e) =>
      ((t) => {
        const [r, s] = t.split(" "),
          i = _createResourceReturn(void 0);
        return (
          (i.promise = Promise.resolve()),
          r === "0"
            ? ((i.state = "resolved"), (i.resolved = s))
            : r === "1"
            ? ((i.state = "pending"), (i.promise = new Promise(() => {})))
            : r === "2" && ((i.state = "rejected"), (i.error = s)),
          i
        );
      })(e),
    fill: (e, t) => {
      if (e.state === "resolved")
        (e.resolved = t(e.resolved)), (e.promise = Promise.resolve(e.resolved));
      else if (e.state === "rejected") {
        const r = Promise.reject(e.error);
        r.catch(() => null), (e.error = t(e.error)), (e.promise = r);
      }
    },
  },
  URLSerializer = {
    prefix: "",
    test: (e) => e instanceof URL,
    serialize: (e) => e.href,
    prepare: (e) => new URL(e),
    fill: void 0,
  },
  DateSerializer = {
    prefix: "",
    test: (e) => e instanceof Date,
    serialize: (e) => e.toISOString(),
    prepare: (e) => new Date(e),
    fill: void 0,
  },
  RegexSerializer = {
    prefix: "\x07",
    test: (e) => e instanceof RegExp,
    serialize: (e) => `${e.flags} ${e.source}`,
    prepare: (e) => {
      const t = e.indexOf(" "),
        r = e.slice(t + 1),
        s = e.slice(0, t);
      return new RegExp(r, s);
    },
    fill: void 0,
  },
  ErrorSerializer = {
    prefix: "",
    test: (e) => e instanceof Error,
    serialize: (e) => e.message,
    prepare: (e) => {
      const t = new Error(e);
      return (t.stack = void 0), t;
    },
    fill: void 0,
  },
  DocumentSerializer = {
    prefix: "",
    test: (e) => isDocument(e),
    serialize: void 0,
    prepare: (e, t, r) => r,
    fill: void 0,
  },
  SERIALIZABLE_STATE = Symbol("serializable-data"),
  ComponentSerializer = {
    prefix: "",
    test: (e) => isQwikComponent(e),
    serialize: (e, t) => {
      const [r] = e[SERIALIZABLE_STATE];
      return serializeQRL(r, { $getObjId$: t });
    },
    prepare: (e, t) => {
      const r = e.indexOf("{"),
        s = r == -1 ? e : e.slice(0, r),
        i = parseQRL(s, t.$containerEl$);
      return componentQrl(i);
    },
    fill: (e, t) => {
      const [r] = e[SERIALIZABLE_STATE];
      r.$capture$ &&
        r.$capture$.length > 0 &&
        ((r.$captureRef$ = r.$capture$.map(t)), (r.$capture$ = null));
    },
  },
  serializers = [
    QRLSerializer,
    {
      prefix: "",
      test: (e) => e instanceof SignalImpl,
      collect: (e, t, r) => (
        collectValue(e.untrackedValue, t, r),
        r && collectSubscriptions(e[QObjectManagerSymbol], t),
        e
      ),
      serialize: (e, t) => t(e.untrackedValue),
      prepare: (e) => new SignalImpl(e, null),
      subs: (e, t, r) => {
        e[QObjectManagerSymbol] = r.$subsManager$.$createManager$(t);
      },
      fill: (e, t) => {
        e.untrackedValue = t(e.untrackedValue);
      },
    },
    {
      prefix: "",
      test: (e) => e instanceof SignalWrapper,
      collect: (e, t, r) => (collectValue(e.ref, t, r), e),
      serialize: (e, t) => `${t(e.ref)} ${e.prop}`,
      prepare: (e) => {
        const [t, r] = e.split(" ");
        return new SignalWrapper(t, r);
      },
      fill: (e, t) => {
        e.ref = t(e.ref);
      },
    },
    WatchSerializer,
    ResourceSerializer,
    URLSerializer,
    DateSerializer,
    RegexSerializer,
    ErrorSerializer,
    DocumentSerializer,
    ComponentSerializer,
    {
      prefix: "",
      test: (e) => typeof e == "function" && e.__qwik_serializable__ !== void 0,
      serialize: (e) => e.toString(),
      prepare: (e) => {
        const t = new Function("return " + e)();
        return (t.__qwik_serializable__ = !0), t;
      },
      fill: void 0,
    },
  ],
  collectorSerializers = serializers.filter((e) => e.collect),
  _pauseFromContexts = async (e, t) => {
    const r = createCollector(t),
      s = [];
    for (const l of e)
      if (l.$watches$) for (const d of l.$watches$) destroyWatch(d);
    for (const l of e) {
      const d = l.$element$,
        p = l.li;
      for (const f of p) {
        const b = f[0],
          x = f[1],
          $ = x.$captureRef$;
        if ($) for (const _ of $) collectValue(_, r, !0);
        isElement(d) &&
          s.push({ key: b, qrl: x, el: d, eventName: getEventName(b) });
      }
    }
    if (s.length === 0)
      return {
        state: { ctx: {}, objs: [], subs: [] },
        objs: [],
        listeners: [],
        mode: "static",
      };
    let i;
    for (; (i = r.$promises$).length > 0; )
      (r.$promises$ = []), await Promise.allSettled(i);
    const n = r.$elements$.length > 0;
    if (n) {
      for (const l of r.$elements$) collectElementData(tryGetContext(l), r);
      for (const l of e)
        if ((l.$props$ && collectProps(l, r), l.$contexts$))
          for (const d of l.$contexts$.values()) collectValue(d, r, !1);
    }
    for (; (i = r.$promises$).length > 0; )
      (r.$promises$ = []), await Promise.all(i);
    const a = new Map(),
      o = Array.from(r.$objSet$.keys()),
      h = new Map(),
      c = (l) => {
        let d = a.get(l);
        return (
          d === void 0 &&
            ((d = ((p) => {
              const f = tryGetContext(p);
              return f ? f.$id$ : null;
            })(l)),
            d ? (d = "#" + d) : console.warn("Missing ID", l),
            a.set(l, d)),
          d
        );
      },
      m = (l) => {
        let d = "";
        if (isPromise(l)) {
          const { value: f, resolved: b } = getPromiseValue(l);
          (l = f), (d += b ? "~" : "_");
        }
        if (isObject(l)) {
          const f = getProxyTarget(l);
          if (f) (d += "!"), (l = f);
          else if (isQwikElement(l)) {
            const b = c(l);
            return b ? b + d : null;
          }
        }
        const p = h.get(l);
        return p ? p + d : null;
      },
      S = (l) => {
        const d = m(l);
        if (d === null) throw qError(27, l);
        return d;
      },
      u = new Map();
    o.forEach((l) => {
      var b, x;
      const d = (b = getManager(l, t)) == null ? void 0 : b.$subs$;
      if (!d) return null;
      const p = (x = getProxyFlags(l)) != null ? x : 0,
        f = [];
      p > 0 && f.push(p);
      for (const $ of d) {
        const _ = $[1];
        ($[0] === 0 &&
          isNode(_) &&
          isVirtualElement(_) &&
          !r.$elements$.includes(_)) ||
          f.push($);
      }
      f.length > 0 && u.set(l, f);
    }),
      o.sort((l, d) => (u.has(l) ? 0 : 1) - (u.has(d) ? 0 : 1));
    let v = 0;
    for (const l of o) h.set(l, intToStr(v)), v++;
    if (r.$noSerialize$.length > 0) {
      const l = h.get(void 0);
      for (const d of r.$noSerialize$) h.set(d, l);
    }
    const g = [];
    for (const l of o) {
      const d = u.get(l);
      if (d == null) break;
      g.push(
        d
          .map((p) =>
            typeof p == "number" ? `_${p}` : serializeSubscription(p, m)
          )
          .filter(isNotNullable)
      );
    }
    g.length, u.size;
    const y = o.map((l) => {
        if (l === null) return null;
        const d = typeof l;
        switch (d) {
          case "undefined":
            return "";
          case "string":
          case "number":
          case "boolean":
            return l;
          default:
            const p = ((f, b, x) => {
              for (const $ of serializers)
                if ($.test(f)) {
                  let _ = $.prefix;
                  return $.serialize && (_ += $.serialize(f, b, x)), _;
                }
            })(l, S, t);
            if (p !== void 0) return p;
            if (d === "object") {
              if (isArray(l)) return l.map(S);
              if (isSerializableObject(l)) {
                const f = {};
                for (const b of Object.keys(l)) f[b] = S(l[b]);
                return f;
              }
            }
        }
        throw qError(3, l);
      }),
      E = {};
    return (
      e.forEach((l) => {
        const d = l.$element$,
          p = l.$refMap$,
          f = l.$props$,
          b = l.$contexts$,
          x = l.$watches$,
          $ = l.$componentQrl$,
          _ = l.$seq$,
          A = {},
          L = isVirtualElement(d) && r.$elements$.includes(d);
        let F = !1;
        if (p.length > 0) {
          const M = p.map(S).join(" ");
          M && ((A.r = M), (F = !0));
        }
        if (n) {
          if (
            (L && f && ((A.h = S(f) + " " + S($)), (F = !0)), x && x.length > 0)
          ) {
            const M = x.map(m).filter(isNotNullable).join(" ");
            M && ((A.w = M), (F = !0));
          }
          if (L && _ && _.length > 0) {
            const M = _.map(S).join(" ");
            (A.s = M), (F = !0);
          }
          if (b) {
            const M = [];
            b.forEach((V, T) => {
              M.push(`${T}=${S(V)}`);
            });
            const D = M.join(" ");
            D && ((A.c = D), (F = !0));
          }
        }
        if (F) {
          const M = c(d);
          E[M] = A;
        }
      }),
      {
        state: { ctx: E, objs: y, subs: g },
        objs: o,
        listeners: s,
        mode: n ? "render" : "listeners",
      }
    );
  },
  getManager = (e, t) => {
    if (!isObject(e)) return;
    if (e instanceof SignalImpl) return getProxyManager(e);
    const r = t.$proxyMap$.get(e);
    return r ? getProxyManager(r) : void 0;
  },
  reviveNestedObjects = (e, t, r) => {
    if (!r.fill(e) && e && typeof e == "object") {
      if (isArray(e)) for (let s = 0; s < e.length; s++) e[s] = t(e[s]);
      else if (isSerializableObject(e))
        for (const s of Object.keys(e)) e[s] = t(e[s]);
    }
  },
  OBJECT_TRANSFORMS = {
    "!": (e, t) => {
      var r;
      return (r = t.$proxyMap$.get(e)) != null ? r : getOrCreateProxy(e, t);
    },
    "~": (e) => Promise.resolve(e),
    _: (e) => Promise.reject(e),
  },
  collectProps = (e, t) => {
    var s;
    const r = e.$parent$;
    if (r && e.$props$ && t.$elements$.includes(r.$element$)) {
      const i = (s = getProxyManager(e.$props$)) == null ? void 0 : s.$subs$,
        n = e.$element$;
      i && i.some((a) => a[0] === 0 && a[1] === n) && collectElement(n, t);
    }
  },
  createCollector = (e) => ({
    $containerState$: e,
    $seen$: new Set(),
    $objSet$: new Set(),
    $noSerialize$: [],
    $elements$: [],
    $promises$: [],
  }),
  collectDeferElement = (e, t) => {
    t.$elements$.includes(e) || t.$elements$.push(e);
  },
  collectElement = (e, t) => {
    if (t.$elements$.includes(e)) return;
    const r = tryGetContext(e);
    r && (t.$elements$.push(e), collectElementData(r, t));
  },
  collectElementData = (e, t) => {
    if (
      (e.$props$ && collectValue(e.$props$, t, !1),
      e.$componentQrl$ && collectValue(e.$componentQrl$, t, !1),
      e.$seq$)
    )
      for (const r of e.$seq$) collectValue(r, t, !1);
    if (e.$watches$) for (const r of e.$watches$) collectValue(r, t, !1);
    if (e.$contexts$)
      for (const r of e.$contexts$.values()) collectValue(r, t, !1);
  },
  collectSubscriptions = (e, t) => {
    if (t.$seen$.has(e)) return;
    t.$seen$.add(e);
    const r = e.$subs$;
    for (const s of r) {
      const i = s[1];
      isNode(i) && isVirtualElement(i)
        ? s[0] === 0 && collectDeferElement(i, t)
        : collectValue(i, t, !0);
    }
  },
  PROMISE_VALUE = Symbol(),
  getPromiseValue = (e) => e[PROMISE_VALUE],
  collectValue = (e, t, r) => {
    if (e !== null) {
      const i = typeof e;
      switch (i) {
        case "function":
        case "object": {
          const n = t.$seen$;
          if (n.has(e)) return;
          if ((n.add(e), !fastShouldSerialize(e)))
            return t.$objSet$.add(void 0), void t.$noSerialize$.push(e);
          const a = e,
            o = getProxyTarget(e);
          if (o) {
            if (((e = o), n.has(e))) return;
            n.add(e), r && collectSubscriptions(getProxyManager(a), t);
          }
          if (
            ((c, m, S) => {
              for (const u of collectorSerializers)
                if (u.test(c)) return u.collect(c, m, S), !0;
              return !1;
            })(e, t, r)
          )
            return void t.$objSet$.add(e);
          if (isPromise(e))
            return void t.$promises$.push(
              ((s = e),
              s.then(
                (c) => {
                  const m = { resolved: !0, value: c };
                  return (s[PROMISE_VALUE] = m), c;
                },
                (c) => {
                  const m = { resolved: !1, value: c };
                  return (s[PROMISE_VALUE] = m), c;
                }
              )).then((c) => {
                collectValue(c, t, r);
              })
            );
          if (i === "object") {
            if (isNode(e)) return;
            if (isArray(e))
              for (let c = 0; c < e.length; c++) collectValue(e[c], t, r);
            else if (isSerializableObject(e))
              for (const c of Object.keys(e)) collectValue(e[c], t, r);
          }
          break;
        }
      }
    }
    var s;
    t.$objSet$.add(e);
  },
  isContainer = (e) => isElement(e) && e.hasAttribute("q:container"),
  hasQId = (e) => {
    const t = processVirtualNodes(e);
    return !!isQwikElement(t) && t.hasAttribute("q:id");
  },
  intToStr = (e) => e.toString(36),
  strToInt = (e) => parseInt(e, 36),
  getEventName = (e) => {
    const t = e.indexOf(":");
    return e.slice(t + 1).replace(/-./g, (r) => r[1].toUpperCase());
  },
  resumeIfNeeded = (e) => {
    directGetAttribute(e, "q:container") === "paused" &&
      (((t) => {
        if (!isContainer(t)) return;
        let r = 0;
        const s = getDocument(t),
          i = ((u) => {
            let v = u.lastElementChild;
            for (; v; ) {
              if (
                v.tagName === "SCRIPT" &&
                directGetAttribute(v, "type") === "qwik/json"
              )
                return v;
              v = v.previousElementSibling;
            }
          })(t === s.documentElement ? s.body : t);
        if (!i) return;
        i.remove();
        const n = getContainerState(t);
        ((u, v) => {
          const g = u.ownerDocument.head;
          u.querySelectorAll("style[q\\:style]").forEach((y) => {
            v.$styleIds$.add(directGetAttribute(y, "q:style")),
              g.appendChild(y);
          });
        })(t, n);
        const a = JSON.parse(
            (i.textContent || "{}").replace(/\\x3C(\/?script)/g, "<$1")
          ),
          o = new Map(),
          h = (u) =>
            ((v, g, y, E) => {
              if ((typeof v == "string" && v.length, v.startsWith("#")))
                return g.has(v), g.get(v);
              const l = strToInt(v);
              y.length;
              let d = y[l];
              for (let p = v.length - 1; p >= 0; p--) {
                const f = v[p],
                  b = OBJECT_TRANSFORMS[f];
                if (!b) break;
                d = b(d, E);
              }
              return d;
            })(u, o, a.objs, n),
          c = s.createTreeWalker(t, 129, {
            acceptNode(u) {
              if (isComment(u)) {
                const v = u.data;
                if (v.startsWith("qv ")) {
                  const g = findClose(u),
                    y = new VirtualElementImpl(u, g),
                    E = directGetAttribute(y, "q:id");
                  E &&
                    ((getContext(y).$id$ = E),
                    o.set("#" + E, y),
                    (r = Math.max(r, strToInt(E))));
                } else if (v.startsWith("t=")) {
                  const g = v.slice(2);
                  o.set(
                    "#" + v.slice(2),
                    ((y) => {
                      const E = y.nextSibling;
                      if (isText(E)) return E;
                      {
                        const l = y.ownerDocument.createTextNode("");
                        return y.parentElement.insertBefore(l, y), l;
                      }
                    })(u)
                  ),
                    (r = Math.max(r, strToInt(g)));
                }
                return 3;
              }
              return isContainer(u) ? 2 : u.hasAttribute("q:id") ? 1 : 3;
            },
          });
        let m = null;
        for (; (m = c.nextNode()); ) {
          const u = directGetAttribute(m, "q:id"),
            v = getContext(m);
          (v.$id$ = u),
            (v.$vdom$ = domToVnode(m)),
            o.set("#" + u, m),
            (r = Math.max(r, strToInt(u)));
        }
        n.$elementIndex$ = ++r;
        const S = ((u, v, g) => {
          const y = new Map(),
            E = new Map();
          return {
            prepare(l) {
              for (const d of serializers) {
                const p = d.prefix;
                if (l.startsWith(p)) {
                  const f = d.prepare(l.slice(p.length), v, g);
                  return d.fill && y.set(f, d), d.subs && E.set(f, d), f;
                }
              }
              return l;
            },
            subs(l, d) {
              const p = E.get(l);
              return !!p && (p.subs(l, d, v), !0);
            },
            fill(l) {
              const d = y.get(l);
              return !!d && (d.fill(l, u, v), !0);
            },
          };
        })(h, n, s);
        ((u, v) => {
          for (let g = 0; g < u.length; g++) {
            const y = u[g];
            isString(y) && (u[g] = y === "" ? void 0 : v.prepare(y));
          }
        })(a.objs, S),
          ((u, v, g, y, E) => {
            for (let l = 0; l < v.length; l++) {
              const d = u[l],
                p = v[l];
              if (p) {
                const f = [];
                let b = 0;
                for (const x of p)
                  x.startsWith("_")
                    ? (b = parseInt(x.slice(1), 10))
                    : f.push(parseSubscription(x, g));
                b > 0 && (d[QObjectFlagsSymbol] = b),
                  E.subs(d, f) || createProxy(d, y, f);
              }
            }
          })(a.objs, a.subs, h, n, S);
        for (const u of a.objs) reviveNestedObjects(u, h, S);
        for (const u of Object.keys(a.ctx)) {
          u.startsWith("#");
          const v = a.ctx[u],
            g = o.get(u),
            y = getContext(g),
            E = v.r,
            l = v.s,
            d = v.h,
            p = v.c,
            f = v.w;
          if (
            (E &&
              (isElement(g),
              (y.$refMap$ = E.split(" ").map(h)),
              (y.li = getDomListeners(y, t))),
            l && (y.$seq$ = l.split(" ").map(h)),
            f && (y.$watches$ = f.split(" ").map(h)),
            p)
          ) {
            y.$contexts$ = new Map();
            for (const b of p.split(" ")) {
              const [x, $] = b.split("=");
              y.$contexts$.set(x, h($));
            }
          }
          if (d) {
            const [b, x] = d.split(" "),
              $ = g.getAttribute("q:sstyle");
            (y.$scopeIds$ = $ ? $.split(" ") : null),
              (y.$mounted$ = !0),
              (y.$props$ = h(b)),
              (y.$componentQrl$ = h(x));
          }
        }
        directSetAttribute(t, "q:container", "resumed"),
          ((u, v, g, y) => {
            u &&
              typeof CustomEvent == "function" &&
              u.dispatchEvent(
                new CustomEvent("qresume", {
                  detail: void 0,
                  bubbles: !0,
                  composed: !0,
                })
              );
          })(t);
      })(e),
      appendQwikDevTools(e));
  },
  appendQwikDevTools = (e) => {
    e.qwik = {
      pause: () =>
        (async (t, r) => {
          const s = getDocument(t),
            i = s.documentElement,
            n = isDocument(t) ? i : t;
          if (directGetAttribute(n, "q:container") === "paused")
            throw qError(21);
          const a = n === s.documentElement ? s.body : n,
            o = await (async (c) => {
              const m = getContainerState(c),
                S = ((u, v) => {
                  v(u);
                  const g = u.ownerDocument.createTreeWalker(u, 129, {
                      acceptNode: (l) => (isContainer(l) ? 2 : v(l) ? 1 : 3),
                    }),
                    y = [];
                  let E = null;
                  for (; (E = g.nextNode()); ) y.push(processVirtualNodes(E));
                  return y;
                })(c, hasQId).map(tryGetContext);
              return _pauseFromContexts(S, m);
            })(n),
            h = s.createElement("script");
          return (
            directSetAttribute(h, "type", "qwik/json"),
            (h.textContent = JSON.stringify(o.state, void 0, void 0).replace(
              /<(\/?script)/g,
              "\\x3C$1"
            )),
            a.appendChild(h),
            directSetAttribute(n, "q:container", "paused"),
            o
          );
        })(e),
      state: getContainerState(e),
    };
  },
  tryGetContext = (e) => e._qc_,
  getContext = (e) => {
    let t = tryGetContext(e);
    return (
      t ||
        (e._qc_ = t =
          {
            $dirty$: !1,
            $mounted$: !1,
            $needAttachListeners$: !1,
            $id$: "",
            $element$: e,
            $refMap$: [],
            li: [],
            $watches$: null,
            $seq$: null,
            $slots$: null,
            $scopeIds$: null,
            $appendStyles$: null,
            $props$: null,
            $vdom$: null,
            $componentQrl$: null,
            $contexts$: null,
            $parent$: null,
          }),
      t
    );
  },
  cleanupContext = (e, t) => {
    var s;
    const r = e.$element$;
    (s = e.$watches$) == null ||
      s.forEach((i) => {
        t.$clearSub$(i), destroyWatch(i);
      }),
      e.$componentQrl$ && t.$clearSub$(r),
      (e.$componentQrl$ = null),
      (e.$seq$ = null),
      (e.$watches$ = null),
      (e.$dirty$ = !1),
      (r._qc_ = void 0);
  },
  PREFIXES = ["on", "window:on", "document:on"],
  SCOPED = ["on", "on-window", "on-document"],
  normalizeOnProp = (e) => {
    let t = "on";
    for (let r = 0; r < PREFIXES.length; r++) {
      const s = PREFIXES[r];
      if (e.startsWith(s)) {
        (t = SCOPED[r]), (e = e.slice(s.length));
        break;
      }
    }
    return (
      t +
      ":" +
      (e.startsWith("-") ? fromCamelToKebabCase(e.slice(1)) : e.toLowerCase())
    );
  },
  getPropsMutator = (e) => {
    const t = getProxyManager(e),
      r = getProxyTarget(e);
    return {
      set(s, i) {
        const n = r[s];
        (r[s] = i), n !== i && t.$notifySubs$(s);
      },
    };
  },
  inflateQrl = (e, t) => (
    e.$capture$,
    (e.$captureRef$ = e.$capture$.map((r) => {
      const s = parseInt(r, 10),
        i = t.$refMap$[s];
      return t.$refMap$.length, i;
    }))
  ),
  QObjectImmutable = 2,
  QOjectTargetSymbol = Symbol("proxy target"),
  QObjectFlagsSymbol = Symbol("proxy flags"),
  QObjectManagerSymbol = Symbol("proxy manager"),
  _IMMUTABLE = Symbol("IMMUTABLE"),
  getOrCreateProxy = (e, t, r = 0) =>
    t.$proxyMap$.get(e) ||
    (r !== 0 && (e[QObjectFlagsSymbol] = r), createProxy(e, t, void 0));
class SignalImpl {
  constructor(t, r) {
    (this.untrackedValue = t), (this[QObjectManagerSymbol] = r);
  }
  get value() {
    var r;
    const t = (r = tryGetInvokeContext()) == null ? void 0 : r.$subscriber$;
    return (
      t && this[QObjectManagerSymbol].$addSub$([0, t, void 0]),
      this.untrackedValue
    );
  }
  set value(t) {
    const r = this[QObjectManagerSymbol],
      s = this.untrackedValue;
    r && s !== t && ((this.untrackedValue = t), r.$notifySubs$());
  }
}
const isSignal = (e) => e instanceof SignalImpl || e instanceof SignalWrapper,
  addSignalSub = (e, t, r, s, i) => {
    const n =
      r instanceof SignalWrapper
        ? [
            e,
            t,
            getProxyTarget(r.ref),
            s,
            i,
            r.prop === "value" ? void 0 : r.prop,
          ]
        : [e, t, r, s, i, void 0];
    getProxyManager(r).$addSub$(n);
  },
  createProxy = (e, t, r) => {
    unwrapProxy(e), t.$proxyMap$.has(e);
    const s = t.$subsManager$.$createManager$(r),
      i = new Proxy(e, new ReadWriteProxyHandler(t, s));
    return t.$proxyMap$.set(e, i), i;
  };
class ReadWriteProxyHandler {
  constructor(t, r) {
    (this.$containerState$ = t), (this.$manager$ = r);
  }
  get(t, r) {
    var c, m;
    if (typeof r == "symbol")
      return r === QOjectTargetSymbol
        ? t
        : r === QObjectManagerSymbol
        ? this.$manager$
        : t[r];
    let s;
    const i = (c = t[QObjectFlagsSymbol]) != null ? c : 0,
      n = tryGetInvokeContext(),
      a = (1 & i) != 0,
      o = (i & QObjectImmutable) != 0;
    let h = t[r];
    if ((n && (s = n.$subscriber$), o)) {
      const S = t["$$" + r];
      (r in t && !S && !((m = t[_IMMUTABLE]) != null && m[r])) || (s = null),
        S && (h = S.value);
    }
    if (s) {
      const S = isArray(t);
      this.$manager$.$addSub$([0, s, S ? void 0 : r]);
    }
    return a ? wrap(h, this.$containerState$) : h;
  }
  set(t, r, s) {
    var a;
    if (typeof r == "symbol") return (t[r] = s), !0;
    const i = (a = t[QObjectFlagsSymbol]) != null ? a : 0;
    if ((i & QObjectImmutable) != 0) throw qError(17);
    const n = (1 & i) != 0 ? unwrapProxy(s) : s;
    return isArray(t)
      ? ((t[r] = n), this.$manager$.$notifySubs$(), !0)
      : (t[r] !== n && ((t[r] = n), this.$manager$.$notifySubs$(r)), !0);
  }
  has(t, r) {
    if (r === QOjectTargetSymbol) return !0;
    const s = Object.prototype.hasOwnProperty;
    return !!s.call(t, r) || !(typeof r != "string" || !s.call(t, "$$" + r));
  }
  ownKeys(t) {
    let r = null;
    const s = tryGetInvokeContext();
    return (
      s && (r = s.$subscriber$),
      r && this.$manager$.$addSub$([0, r, void 0]),
      Object.getOwnPropertyNames(t).map((i) =>
        i.startsWith("$$") ? i.slice(2) : i
      )
    );
  }
}
const wrap = (e, t) => {
    if (isQrl$1(e)) return e;
    if (isObject(e)) {
      if (Object.isFrozen(e)) return e;
      const r = unwrapProxy(e);
      return r !== e || isNode(r)
        ? e
        : shouldSerialize(r)
        ? t.$proxyMap$.get(e) || getOrCreateProxy(e, t, 1)
        : e;
    }
    return e;
  },
  noSerializeSet = new WeakSet(),
  shouldSerialize = (e) =>
    (!isObject(e) && !isFunction(e)) || !noSerializeSet.has(e),
  fastShouldSerialize = (e) => !noSerializeSet.has(e),
  noSerialize = (e) => (e != null && noSerializeSet.add(e), e),
  unwrapProxy = (e) => {
    var t;
    return isObject(e) && (t = getProxyTarget(e)) != null ? t : e;
  },
  getProxyTarget = (e) => e[QOjectTargetSymbol],
  getProxyManager = (e) => e[QObjectManagerSymbol],
  getProxyFlags = (e) => e[QObjectFlagsSymbol];
class SignalWrapper {
  constructor(t, r) {
    (this.ref = t), (this.prop = r);
  }
  get [QObjectManagerSymbol]() {
    return getProxyManager(this.ref);
  }
  get value() {
    return this.ref[this.prop];
  }
  set value(t) {
    this.ref[this.prop] = t;
  }
}
const _wrapSignal = (e, t) => {
    if (e instanceof SignalImpl || e instanceof SignalWrapper) return e;
    const r = getProxyTarget(e);
    if (r) {
      const s = r["$$" + t];
      return s || new SignalWrapper(e, t);
    }
    return e[t];
  },
  isQrl$1 = (e) => typeof e == "function" && typeof e.getSymbol == "function",
  createQRL = (e, t, r, s, i, n, a) => {
    let o;
    const h = (d) => {
        o || (o = d);
      },
      c = async (d) => {
        if ((d && h(d), r !== null)) return r;
        if (s !== null) return (r = s().then((p) => (r = p[t])));
        {
          if (!e) throw qError(31, t);
          if (!o) throw qError(30, e, t);
          const p = getPlatform().importSymbol(o, e, t);
          return (r = then(p, (f) => (r = f)));
        }
      },
      m = (d) => (r !== null ? r : c(d)),
      S =
        (d, p) =>
        (...f) => {
          const b = now(),
            x = m();
          return then(x, ($) => {
            if (isFunction($)) {
              if (p && p() === !1) return;
              const _ = { ...u(d), $qrl$: E };
              return emitUsedSymbol(t, _.$element$, b), invoke(_, $, ...f);
            }
            throw qError(10);
          });
        },
      u = (d) =>
        d == null
          ? newInvokeContext()
          : isArray(d)
          ? newInvokeContextFromTuple(d)
          : d,
      v = async function (...d) {
        return await S()(...d);
      },
      g = a != null ? a : t,
      y = getSymbolHash$1(g),
      E = v;
    return Object.assign(v, {
      getSymbol: () => g,
      getHash: () => y,
      resolve: c,
      $resolveLazy$: m,
      $setContainer$: h,
      $chunk$: e,
      $symbol$: t,
      $refSymbol$: a,
      $hash$: y,
      getFn: S,
      $capture$: i,
      $captureRef$: n,
      $dev$: null,
    });
  },
  getSymbolHash$1 = (e) => {
    const t = e.lastIndexOf("_");
    return t > -1 ? e.slice(t + 1) : e;
  },
  emitUsedSymbol = (e, t, r) => {
    emitEvent("qsymbol", { detail: { symbol: e, element: t, reqTime: r } });
  },
  emitEvent = (e, t) => {
    isServer$1() ||
      typeof document != "object" ||
      document.dispatchEvent(new CustomEvent(e, { bubbles: !1, detail: t }));
  },
  now = () =>
    isServer$1() ? 0 : typeof performance == "object" ? performance.now() : 0,
  componentQrl = (e) => {
    function t(r, s) {
      const i = e.$hash$ + ":" + (s || "");
      return jsx(
        Virtual,
        { "q:renderFn": e, children: r.children, props: r },
        i
      );
    }
    return (t[SERIALIZABLE_STATE] = [e]), t;
  },
  isQwikComponent = (e) =>
    typeof e == "function" && e[SERIALIZABLE_STATE] !== void 0,
  Slot = (e) => {
    var r;
    const t = (r = e.name) != null ? r : "";
    return jsx(Virtual, { "q:s": "" }, t);
  },
  renderSSR = async (e, t) => {
    var c;
    const r = t.containerTagName,
      s = createContext(1).$element$,
      i = createContainerState(s),
      n = createRenderContext({ nodeType: 9 }, i),
      a = (c = t.beforeContent) != null ? c : [],
      o = {
        rCtx: n,
        $contexts$: [],
        projectedChildren: void 0,
        projectedContext: void 0,
        hostCtx: null,
        invocationContext: void 0,
        headNodes: r === "html" ? a : [],
        $pendingListeners$: [],
      },
      h = {
        ...t.containerAttributes,
        "q:container": "paused",
        "q:version": "0.10.0",
        "q:render": "ssr",
        "q:base": t.base,
        children: r === "html" ? [e] : [a, e],
      };
    (i.$envData$ = { url: t.url, ...t.envData }),
      (e = jsx(r, h)),
      (i.$hostsRendering$ = new Set()),
      (i.$renderPromise$ = Promise.resolve().then(() =>
        renderRoot(e, o, t.stream, i, t)
      )),
      await i.$renderPromise$;
  },
  renderRoot = async (e, t, r, s, i) => {
    const n = i.beforeClose;
    return (
      await renderNode(
        e,
        t,
        r,
        0,
        n
          ? (a) => {
              const o = n(t.$contexts$, s);
              return processData(o, t, a, 0, void 0);
            }
          : void 0
      ),
      t.rCtx.$static$
    );
  },
  renderNodeVirtual = (e, t, r, s, i, n, a) => {
    var v;
    const o = e.props,
      h = o["q:renderFn"];
    if (h) return (t.$componentQrl$ = h), renderSSRComponent(s, i, t, e, n, a);
    let c = "<!--qv" + renderVirtualAttributes(o);
    const m = "q:s" in o,
      S = e.key != null ? String(e.key) : null;
    if (
      (m &&
        ((v = s.hostCtx) == null || v.$id$, (c += " q:sref=" + s.hostCtx.$id$)),
      S != null && (c += " q:key=" + S),
      (c += "-->"),
      i.write(c),
      r)
    )
      for (const g of r) renderNodeElementSync(g.type, g.props, i);
    const u = walkChildren(o.children, s, i, n);
    return then(u, () => {
      var y;
      if (!m && !a) return void i.write(CLOSE_VIRTUAL);
      let g;
      if (m) {
        const E = (y = s.projectedChildren) == null ? void 0 : y[S];
        E &&
          ((s.projectedChildren[S] = void 0),
          (g = processData(E, s.projectedContext, i, n)));
      }
      return (
        a && (g = then(g, () => a(i))),
        then(g, () => {
          i.write(CLOSE_VIRTUAL);
        })
      );
    });
  },
  CLOSE_VIRTUAL = "<!--/qv-->",
  renderVirtualAttributes = (e) => {
    let t = "";
    for (const r of Object.keys(e)) {
      if (r === "children") continue;
      const s = e[r];
      s != null && (t += " " + (s === "" ? r : r + "=" + s));
    }
    return t;
  },
  renderNodeElementSync = (e, t, r) => {
    if (
      (r.write(
        "<" +
          e +
          ((i) => {
            let n = "";
            for (const a of Object.keys(i)) {
              if (a === "dangerouslySetInnerHTML") continue;
              const o = i[a];
              o != null && (n += " " + (o === "" ? a : a + '="' + o + '"'));
            }
            return n;
          })(t) +
          ">"
      ),
      !!emptyElements[e])
    )
      return;
    const s = t.dangerouslySetInnerHTML;
    s != null && r.write(s), r.write(`</${e}>`);
  },
  renderSSRComponent = (e, t, r, s, i, n) => {
    const a = s.props;
    return (
      setComponentProps(e.rCtx, r, a.props),
      then(executeComponent(e.rCtx, r), (o) => {
        const h = r.$element$,
          c = o.rCtx,
          m = newInvokeContext(h, void 0);
        (m.$subscriber$ = h), (m.$renderCtx$ = c);
        const S = { ...e, rCtx: c },
          u = {
            ...e,
            projectedChildren: splitProjectedChildren(a.children, e),
            projectedContext: S,
            rCtx: c,
            invocationContext: m,
          },
          v = [];
        if (r.$appendStyles$) {
          const l = 4 & i ? e.headNodes : v;
          for (const d of r.$appendStyles$)
            l.push(
              jsx("style", {
                "q:style": d.styleId,
                dangerouslySetInnerHTML: d.content,
              })
            );
        }
        const g = getNextIndex(e.rCtx),
          y = r.$scopeIds$ ? serializeSStyle(r.$scopeIds$) : void 0,
          E = jsx(
            s.type,
            { "q:sstyle": y, "q:id": g, children: o.node },
            s.key
          );
        return (
          (r.$id$ = g),
          e.$contexts$.push(r),
          (u.hostCtx = r),
          renderNodeVirtual(
            E,
            r,
            v,
            u,
            t,
            i,
            (l) => (
              r.$needAttachListeners$,
              n
                ? then(renderQTemplates(u, l), () => n(l))
                : renderQTemplates(u, l)
            )
          )
        );
      })
    );
  },
  renderQTemplates = (e, t) => {
    const r = e.projectedChildren;
    if (r) {
      const s = Object.keys(r).map((i) => {
        const n = r[i];
        if (n)
          return jsx("q:template", {
            [QSlot]: i,
            hidden: "",
            "aria-hidden": "true",
            children: n,
          });
      });
      return processData(s, e, t, 0, void 0);
    }
  },
  splitProjectedChildren = (e, t) => {
    var i;
    const r = flatVirtualChildren(e, t);
    if (r === null) return;
    const s = {};
    for (const n of r) {
      let a = "";
      isJSXNode(n) && (a = (i = n.props[QSlot]) != null ? i : "");
      let o = s[a];
      o || (s[a] = o = []), o.push(n);
    }
    return s;
  },
  createContext = (e) => getContext({ nodeType: e, _qc_: null }),
  renderNode = (e, t, r, s, i) => {
    var o, h;
    const n = e.type;
    if (typeof n == "string") {
      const c = e.key,
        m = e.props,
        S = (o = m[_IMMUTABLE]) != null ? o : EMPTY_OBJ$1,
        u = createContext(1),
        v = u.$element$,
        g = n === "head",
        y = t.hostCtx;
      let E = "<" + n,
        l = !1;
      for (const $ of Object.keys(m)) {
        if (
          $ === "children" ||
          $ === "key" ||
          $ === "class" ||
          $ === "className" ||
          $ === "dangerouslySetInnerHTML"
        )
          continue;
        if ($ === "ref") {
          setRef(m[$], v);
          continue;
        }
        let _ = isSignal(S[$]) ? S[$] : m[$];
        if (isOnProp($)) {
          setEvent(u.li, $, _, void 0);
          continue;
        }
        const A = processPropKey($);
        if (isSignal(_)) {
          if (y) {
            const F = y.$element$;
            addSignalSub(1, F, _, v, A), (l = !0);
          }
          _ = _.value;
        }
        const L = processPropValue(A, _);
        L != null &&
          (E += " " + (_ === "" ? A : A + '="' + escapeAttr(L) + '"'));
      }
      const d = u.li,
        p = (h = m.class) != null ? h : m.className;
      let f = stringifyClass(p);
      if (
        (y &&
          (y.$scopeIds$ && (f = y.$scopeIds$.join(" ") + " " + f),
          y.$needAttachListeners$ &&
            (addQRLListener(d, y.li), (y.$needAttachListeners$ = !1))),
        g && (s |= 1),
        textOnlyElements[n] && (s |= 8),
        (f = f.trim()),
        f && (E += ' class="' + f + '"'),
        d.length > 0)
      ) {
        const $ = groupListeners(d);
        for (const _ of $)
          E += " " + _[0] + '="' + serializeQRLs(_[1], u) + '"';
      }
      if (
        (c != null && (E += ' q:key="' + c + '"'),
        "ref" in m || d.length > 0 || l)
      ) {
        const $ = getNextIndex(t.rCtx);
        (E += ' q:id="' + $ + '"'), (u.$id$ = $), t.$contexts$.push(u);
      }
      if ((1 & s && (E += " q:head"), (E += ">"), r.write(E), emptyElements[n]))
        return;
      const b = m.dangerouslySetInnerHTML;
      if (b != null) return r.write(String(b)), void r.write(`</${n}>`);
      g || (s &= -2), n === "html" ? (s |= 4) : (s &= -5);
      const x = processData(m.children, t, r, s);
      return then(x, () => {
        if (g) {
          for (const $ of t.headNodes)
            renderNodeElementSync($.type, $.props, r);
          t.headNodes.length = 0;
        }
        if (i)
          return then(i(r), () => {
            r.write(`</${n}>`);
          });
        r.write(`</${n}>`);
      });
    }
    if (n === Virtual) {
      const c = createContext(111);
      return (
        (c.$parent$ = t.hostCtx), renderNodeVirtual(e, c, void 0, t, r, s, i)
      );
    }
    if (n === SSRComment) return void r.write("<!--" + e.props.data + "-->");
    if (n === InternalSSRStream)
      return (async (c, m, S, u) => {
        S.write("<!--qkssr-f-->");
        const v = c.props.children;
        let g;
        if (isFunction(v)) {
          const y = v({
            write(E) {
              S.write(E), S.write("<!--qkssr-f-->");
            },
          });
          if (isPromise(y)) return y;
          g = y;
        } else g = v;
        for await (const y of g)
          await processData(y, m, S, u, void 0), S.write("<!--qkssr-f-->");
      })(e, t, r, s);
    const a = invoke(t.invocationContext, n, e.props, e.key);
    return processData(a, t, r, s, i);
  },
  processData = (e, t, r, s, i) => {
    var n;
    if (e != null && typeof e != "boolean")
      if (isString(e) || typeof e == "number") r.write(escapeHtml(String(e)));
      else {
        if (isJSXNode(e)) return renderNode(e, t, r, s, i);
        if (isArray(e)) return walkChildren(e, t, r, s);
        if (isSignal(e)) {
          const a = 8 & s,
            o = (n = t.hostCtx) == null ? void 0 : n.$element$;
          let h;
          if (o) {
            if (!a) {
              h = e.value;
              const c = getNextIndex(t.rCtx);
              return (
                addSignalSub(2, o, e, "#" + c, "data"),
                void r.write(`<!--t=${c}-->${escapeHtml(String(h))}<!---->`)
              );
            }
            h = invoke(t.invocationContext, () => e.value);
          }
          return void r.write(escapeHtml(String(h)));
        }
        if (isPromise(e))
          return (
            r.write("<!--qkssr-f-->"), e.then((a) => processData(a, t, r, s, i))
          );
      }
  };
function walkChildren(e, t, r, s) {
  if (e == null) return;
  if (!isArray(e)) return processData(e, t, r, s);
  if (e.length === 1) return processData(e[0], t, r, s);
  if (e.length === 0) return;
  let i = 0;
  const n = [];
  return e.reduce((a, o, h) => {
    const c = [];
    n.push(c);
    const m = processData(
        o,
        t,
        a
          ? {
              write(u) {
                i === h ? r.write(u) : c.push(u);
              },
            }
          : r,
        s
      ),
      S = () => {
        i++, n.length > i && n[i].forEach((u) => r.write(u));
      };
    return isPromise(m) && a
      ? Promise.all([m, a]).then(S)
      : isPromise(m)
      ? m.then(S)
      : a
      ? a.then(S)
      : void i++;
  }, void 0);
}
const flatVirtualChildren = (e, t) => {
    if (e == null) return null;
    const r = _flatVirtualChildren(e, t),
      s = isArray(r) ? r : [r];
    return s.length === 0 ? null : s;
  },
  stringifyClass = (e) => {
    if (!e) return "";
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return e.join(" ");
    const t = [];
    for (const r in e)
      Object.prototype.hasOwnProperty.call(e, r) && e[r] && t.push(r);
    return t.join(" ");
  },
  _flatVirtualChildren = (e, t) => {
    if (e == null) return null;
    if (isArray(e)) return e.flatMap((r) => _flatVirtualChildren(r, t));
    if (
      isJSXNode(e) &&
      isFunction(e.type) &&
      e.type !== SSRComment &&
      e.type !== InternalSSRStream &&
      e.type !== Virtual
    ) {
      const r = invoke(t.invocationContext, e.type, e.props, e.key);
      return flatVirtualChildren(r, t);
    }
    return e;
  },
  setComponentProps = (e, t, r) => {
    var a;
    const s = Object.keys(r),
      i = { [QObjectFlagsSymbol]: QObjectImmutable };
    if (
      ((t.$props$ = createProxy(i, e.$static$.$containerState$)),
      s.length === 0)
    )
      return;
    const n = (i[_IMMUTABLE] = (a = r[_IMMUTABLE]) != null ? a : EMPTY_OBJ$1);
    for (const o of s)
      o !== "children" &&
        (isSignal(n[o]) ? (i["$$" + o] = n[o]) : (i[o] = r[o]));
  };
function processPropKey(e) {
  return e === "htmlFor" ? "for" : e;
}
function processPropValue(e, t) {
  return e === "style"
    ? stringifyStyle(t)
    : t === !1 || t == null
    ? null
    : t === !0
    ? ""
    : String(t);
}
const textOnlyElements = {
    title: !0,
    style: !0,
    script: !0,
    noframes: !0,
    noscript: !0,
  },
  emptyElements = {
    area: !0,
    base: !0,
    basefont: !0,
    bgsound: !0,
    br: !0,
    col: !0,
    embed: !0,
    frame: !0,
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
  ESCAPE_HTML = /[&<>]/g,
  ESCAPE_ATTRIBUTES = /[&"]/g,
  escapeHtml = (e) =>
    e.replace(ESCAPE_HTML, (t) => {
      switch (t) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        default:
          return "";
      }
    }),
  escapeAttr = (e) =>
    e.replace(ESCAPE_ATTRIBUTES, (t) => {
      switch (t) {
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        default:
          return "";
      }
    }),
  useStore = (e, t) => {
    var a;
    const { get: r, set: s, ctx: i } = useSequentialScope();
    if (r != null) return r;
    const n = isFunction(e) ? e() : e;
    if ((t == null ? void 0 : t.reactive) === !1) return s(n), n;
    {
      const o = i.$renderCtx$.$static$.$containerState$,
        h = getOrCreateProxy(
          n,
          o,
          (a = t == null ? void 0 : t.recursive) != null && a ? 1 : 0
        );
      return s(h), h;
    }
  };
function useEnvData(e, t) {
  var r;
  return (r =
    useInvokeContext().$renderCtx$.$static$.$containerState$.$envData$[e]) !=
    null
    ? r
    : t;
}
const useStylesQrl = (e) => {
    _useStyles(e, (t) => t, !1);
  },
  _useStyles = (e, t, r) => {
    const { get: s, set: i, ctx: n, i: a } = useSequentialScope();
    if (s) return s;
    const o = n.$renderCtx$,
      h =
        ((c = a),
        `${((g, y = 0) => {
          if (g.length === 0) return y;
          for (let E = 0; E < g.length; E++)
            (y = (y << 5) - y + g.charCodeAt(E)), (y |= 0);
          return Number(Math.abs(y)).toString(36);
        })(e.$hash$)}-${c}`);
    var c;
    const m = o.$static$.$containerState$,
      S = getContext(n.$hostElement$);
    if (
      (i(h),
      S.$appendStyles$ || (S.$appendStyles$ = []),
      S.$scopeIds$ || (S.$scopeIds$ = []),
      r && S.$scopeIds$.push(((g) => "\u2B50\uFE0F" + g)(h)),
      ((g, y) => g.$styleIds$.has(y))(m, h))
    )
      return h;
    m.$styleIds$.add(h);
    const u = e.$resolveLazy$(m.$containerEl$),
      v = (g) => {
        S.$appendStyles$,
          S.$appendStyles$.push({ styleId: h, content: t(g, h) });
      };
    return isPromise(u) ? n.$waitOn$.push(u.then(v)) : v(u), h;
  },
  isServer = !0,
  isBrowser = !1,
  ContentContext = createContext$1("qc-c"),
  ContentInternalContext = createContext$1("qc-ic"),
  DocumentHeadContext = createContext$1("qc-h"),
  RouteLocationContext = createContext$1("qc-l"),
  RouteNavigateContext = createContext$1("qc-n"),
  RouterOutlet = componentQrl(
    inlinedQrl(() => {
      const { contents: e } = useContext(ContentInternalContext);
      if (e && e.length > 0) {
        const t = e.length;
        let r = null;
        for (let s = t - 1; s >= 0; s--) r = jsx(e[s].default, { children: r });
        return r;
      }
      return SkipRender;
    }, "RouterOutlet_component_nd8yk3KO22c")
  ),
  MODULE_CACHE$1 = new WeakMap(),
  loadRoute$1 = async (e, t, r, s) => {
    if (Array.isArray(e))
      for (const i of e) {
        const n = i[0].exec(s);
        if (n) {
          const a = i[1],
            o = getRouteParams$1(i[2], n),
            h = i[4],
            c = new Array(a.length),
            m = [],
            S = getMenuLoader$1(t, s);
          let u;
          return (
            a.forEach((v, g) => {
              loadModule$1(v, m, (y) => (c[g] = y), r);
            }),
            loadModule$1(S, m, (v) => (u = v == null ? void 0 : v.default), r),
            m.length > 0 && (await Promise.all(m)),
            [o, c, u, h]
          );
        }
      }
    return null;
  },
  loadModule$1 = (e, t, r, s) => {
    if (typeof e == "function") {
      const i = MODULE_CACHE$1.get(e);
      if (i) r(i);
      else {
        const n = e();
        typeof n.then == "function"
          ? t.push(
              n.then((a) => {
                s !== !1 && MODULE_CACHE$1.set(e, a), r(a);
              })
            )
          : n && r(n);
      }
    }
  },
  getMenuLoader$1 = (e, t) => {
    if (e) {
      const r = e.find(
        (s) => s[0] === t || t.startsWith(s[0] + (t.endsWith("/") ? "" : "/"))
      );
      if (r) return r[1];
    }
  },
  getRouteParams$1 = (e, t) => {
    const r = {};
    if (e) for (let s = 0; s < e.length; s++) r[e[s]] = t ? t[s + 1] : "";
    return r;
  },
  resolveHead = (e, t, r) => {
    const s = createDocumentHead(),
      i = { data: e ? e.body : null, head: s, ...t };
    for (let n = r.length - 1; n >= 0; n--) {
      const a = r[n] && r[n].head;
      a &&
        (typeof a == "function"
          ? resolveDocumentHead(s, a(i))
          : typeof a == "object" && resolveDocumentHead(s, a));
    }
    return i.head;
  },
  resolveDocumentHead = (e, t) => {
    typeof t.title == "string" && (e.title = t.title),
      mergeArray(e.meta, t.meta),
      mergeArray(e.links, t.links),
      mergeArray(e.styles, t.styles);
  },
  mergeArray = (e, t) => {
    if (Array.isArray(t))
      for (const r of t) {
        if (typeof r.key == "string") {
          const s = e.findIndex((i) => i.key === r.key);
          if (s > -1) {
            e[s] = r;
            continue;
          }
        }
        e.push(r);
      }
  },
  createDocumentHead = () => ({ title: "", meta: [], links: [], styles: [] }),
  useContent = () => useContext(ContentContext),
  useDocumentHead = () => useContext(DocumentHeadContext),
  useLocation = () => useContext(RouteLocationContext),
  useNavigate = () => useContext(RouteNavigateContext),
  useQwikCityEnv = () => noSerialize(useEnvData("qwikcity")),
  toPath = (e) => e.pathname + e.search + e.hash,
  toUrl = (e, t) => new URL(e, t.href),
  isSameOrigin = (e, t) => e.origin === t.origin,
  isSamePath = (e, t) => e.pathname + e.search === t.pathname + t.search,
  isSamePathname = (e, t) => e.pathname === t.pathname,
  isSameOriginDifferentPathname = (e, t) =>
    isSameOrigin(e, t) && !isSamePath(e, t),
  getClientEndpointPath = (e) =>
    e + (e.endsWith("/") ? "" : "/") + "q-data.json",
  getClientNavPath = (e, t) => {
    const r = e.href;
    if (typeof r == "string" && r.trim() !== "" && typeof e.target != "string")
      try {
        const s = toUrl(r, t),
          i = toUrl("", t);
        if (isSameOrigin(s, i)) return toPath(s);
      } catch (s) {
        console.error(s);
      }
    return null;
  },
  getPrefetchUrl = (e, t, r) => {
    if (e.prefetch && t) {
      const s = toUrl(t, r);
      if (!isSamePathname(s, toUrl("", r))) return s + "";
    }
    return null;
  },
  clientNavigate = (e, t) => {
    const r = e.location,
      s = toUrl(t.path, r);
    isSameOriginDifferentPathname(r, s) &&
      (handleScroll(e, r, s), e.history.pushState("", "", toPath(s))),
      e[CLIENT_HISTORY_INITIALIZED] ||
        ((e[CLIENT_HISTORY_INITIALIZED] = 1),
        e.addEventListener("popstate", () => {
          const i = e.location,
            n = toUrl(t.path, i);
          isSameOriginDifferentPathname(i, n) &&
            (handleScroll(e, n, i), (t.path = toPath(i)));
        }));
  },
  handleScroll = async (e, t, r) => {
    const s = e.document,
      i = r.hash;
    if (isSamePath(t, r))
      t.hash !== i &&
        (await domWait(), i ? scrollToHashId(s, i) : e.scrollTo(0, 0));
    else if (i)
      for (let n = 0; n < 24 && (await domWait(), !scrollToHashId(s, i)); n++);
    else await domWait(), e.scrollTo(0, 0);
  },
  domWait = () => new Promise((e) => setTimeout(e, 12)),
  scrollToHashId = (e, t) => {
    const r = t.slice(1),
      s = e.getElementById(r);
    return s && s.scrollIntoView(), s;
  },
  dispatchPrefetchEvent = (e) =>
    dispatchEvent(new CustomEvent("qprefetch", { detail: e })),
  CLIENT_HISTORY_INITIALIZED = Symbol(),
  loadClientData = async (e) => {
    const { cacheModules: t } = await Promise.resolve().then(
        () => _qwikCityPlan
      ),
      r = new URL(e).pathname,
      s = getClientEndpointPath(r),
      i = Date.now(),
      n = t ? 6e5 : 15e3,
      a = cachedClientPages.findIndex((h) => h.u === s);
    let o = cachedClientPages[a];
    if ((dispatchPrefetchEvent({ links: [r] }), !o || o.t + n < i)) {
      o = {
        u: s,
        t: i,
        c: new Promise((h) => {
          fetch(s).then(
            (c) => {
              const m = c.headers.get("content-type") || "";
              c.ok && m.includes("json")
                ? c.json().then(
                    (S) => {
                      dispatchPrefetchEvent({
                        bundles: S.prefetch,
                        links: [r],
                      }),
                        h(S);
                    },
                    () => h(null)
                  )
                : h(null);
            },
            () => h(null)
          );
        }),
      };
      for (let h = cachedClientPages.length - 1; h >= 0; h--)
        cachedClientPages[h].t + n < i && cachedClientPages.splice(h, 1);
      cachedClientPages.push(o);
    }
    return o.c.catch((h) => console.error(h)), o.c;
  },
  cachedClientPages = [],
  QwikCity = componentQrl(
    inlinedQrl(() => {
      const e = useQwikCityEnv();
      if (!(e != null && e.params))
        throw new Error("Missing Qwik City Env Data");
      const t = useEnvData("url");
      if (!t) throw new Error("Missing Qwik URL Env Data");
      const r = new URL(t),
        s = useStore({
          href: r.href,
          pathname: r.pathname,
          query: Object.fromEntries(r.searchParams.entries()),
          params: e.params,
        }),
        i = useStore({ path: toPath(r) }),
        n = useStore(createDocumentHead),
        a = useStore({ headings: void 0, menu: void 0 }),
        o = useStore({ contents: void 0 });
      return (
        useContextProvider(ContentContext, a),
        useContextProvider(ContentInternalContext, o),
        useContextProvider(DocumentHeadContext, n),
        useContextProvider(RouteLocationContext, s),
        useContextProvider(RouteNavigateContext, i),
        useWatchQrl(
          inlinedQrl(
            async ({ track: h }) => {
              const [c, m, S, u, v, g] = useLexicalScope(),
                {
                  routes: y,
                  menus: E,
                  cacheModules: l,
                } = await Promise.resolve().then(() => _qwikCityPlan),
                d = h(g, "path"),
                p = new URL(d, v.href),
                f = p.pathname,
                b = loadRoute$1(y, E, l, f),
                x = isServer ? u.response : loadClientData(p.href),
                $ = await b;
              if ($) {
                const [_, A, L] = $,
                  F = A,
                  M = F[F.length - 1];
                (v.href = p.href),
                  (v.pathname = f),
                  (v.params = { ..._ }),
                  (v.query = Object.fromEntries(p.searchParams.entries())),
                  (c.headings = M.headings),
                  (c.menu = L),
                  (m.contents = noSerialize(F));
                const D = await x,
                  V = resolveHead(D, v, F);
                (S.links = V.links),
                  (S.meta = V.meta),
                  (S.styles = V.styles),
                  (S.title = V.title),
                  isBrowser && clientNavigate(window, g);
              }
            },
            "QwikCity_component_useWatch_AaAlzKH0KlQ",
            [a, o, n, e, s, i]
          )
        ),
        jsx(Slot, {})
      );
    }, "QwikCity_component_z1nvHyEppoI")
  ),
  Link = componentQrl(
    inlinedQrl((e) => {
      const t = useNavigate(),
        r = useLocation(),
        s = e.href,
        i = { ...e },
        n = getClientNavPath(i, r),
        a = getPrefetchUrl(e, n, r);
      return (
        (i["preventdefault:click"] = !!n),
        (i.href = n || s),
        jsx("a", {
          ...i,
          onClick$: inlinedQrl(
            () => {
              const [o, h, c] = useLexicalScope();
              o && (c.path = h.href);
            },
            "Link_component_a_onClick_hA9UPaY8sNQ",
            [n, i, t]
          ),
          "data-prefetch": a,
          onMouseOver$: inlinedQrl(
            (o, h) => prefetchLinkResources(h),
            "Link_component_a_onMouseOver_skxgNVWVOT8"
          ),
          onQVisible$: inlinedQrl(
            (o, h) => prefetchLinkResources(h, !0),
            "Link_component_a_onQVisible_uVE5iM9H73c"
          ),
          children: jsx(Slot, {}),
        })
      );
    }, "Link_component_mYsiJcA4IBc")
  ),
  prefetchLinkResources = (e, t) => {
    var s;
    const r =
      (s = e == null ? void 0 : e.dataset) == null ? void 0 : s.prefetch;
    r &&
      (windowInnerWidth || (windowInnerWidth = window.innerWidth),
      (!t || (t && windowInnerWidth < 520)) && loadClientData(r));
  };
let windowInnerWidth = 0;
const swRegister =
    '((s,a,r,i)=>{r=(e,t)=>{t=document.querySelector("[q\\\\:base]"),t&&a.active&&a.active.postMessage({type:"qprefetch",base:t.getAttribute("q:base"),...e})},addEventListener("qprefetch",e=>{const t=e.detail;a?r(t):t.bundles&&s.push(...t.bundles)}),navigator.serviceWorker.register("/service-worker.js").then(e=>{i=()=>{a=e,r({bundles:s})},e.installing?e.installing.addEventListener("statechange",t=>{t.target.state=="activated"&&i()}):e.active&&i()}).catch(e=>console.error(e))})([])',
  ServiceWorkerRegister = () =>
    jsx("script", { dangerouslySetInnerHTML: swRegister }),
  styles$4 = `.menu{background:#eee;padding:20px 10px}.menu h5{margin:0}.menu ul{padding-left:20px;margin:5px 0 25px}
`,
  Menu = componentQrl(
    inlinedQrl(() => {
      var r;
      useStylesQrl(inlinedQrl(styles$4, "s_ZrG0y5LuqAA"));
      const { menu: e } = useContent(),
        t = useLocation();
      return jsx("aside", {
        class: "menu",
        children: e
          ? (r = e.items) == null
            ? void 0
            : r.map((s) => {
                var i;
                return jsx(Fragment, {
                  children: [
                    jsx("h5", { children: _wrapSignal(s, "text") }),
                    jsx("ul", {
                      children:
                        (i = s.items) == null
                          ? void 0
                          : i.map((n) =>
                              jsx("li", {
                                children: jsx(Link, {
                                  get href() {
                                    return n.href;
                                  },
                                  class: { "is-active": t.pathname === n.href },
                                  children: _wrapSignal(n, "text"),
                                  [_IMMUTABLE]: {
                                    href: _wrapSignal(n, "href"),
                                  },
                                }),
                              })
                            ),
                    }),
                  ],
                });
              })
          : null,
      });
    }, "s_H6QrlimhpZM")
  ),
  styles$3 = `.on-this-page{padding-bottom:20px;font-size:.9em}.on-this-page h6{margin:10px 0;font-weight:700;text-transform:uppercase}.on-this-page ul{margin:0;padding:0 0 20px;list-style:none}.on-this-page a{position:relative;display:block;border:0 solid #ddd;border-left-width:2px;padding:4px 2px 4px 8px;text-decoration:none}.on-this-page a.indent{padding-left:30px}.on-this-page a:hover{border-color:var(--theme-accent)}
`,
  OnThisPage = componentQrl(
    inlinedQrl(() => {
      useStylesQrl(inlinedQrl(styles$3, "s_Uhlbf9HjFFk"));
      const { headings: e } = useContent(),
        t =
          (e == null
            ? void 0
            : e.filter((i) => i.level === 2 || i.level === 3)) || [],
        { pathname: r } = useLocation(),
        s = `#update-your-edit-url-for-${r}`;
      return jsx("aside", {
        class: "on-this-page",
        children: [
          t.length > 0
            ? jsx(Fragment, {
                children: [
                  jsx("h6", { children: "On This Page" }),
                  jsx("ul", {
                    children: t.map((i) =>
                      jsx("li", {
                        children: jsx("a", {
                          href: `#${i.id}`,
                          class: { block: !0, indent: i.level > 2 },
                          children: _wrapSignal(i, "text"),
                        }),
                      })
                    ),
                  }),
                ],
              })
            : null,
          jsx("h6", { children: "More" }),
          jsx("ul", {
            children: [
              jsx("li", {
                children: jsx("a", {
                  href: s,
                  target: "_blank",
                  children: "Edit this page",
                }),
              }),
              jsx("li", {
                children: jsx("a", {
                  href: "https://qwik.builder.io/chat",
                  target: "_blank",
                  children: "Join our community",
                }),
              }),
              jsx("li", {
                children: jsx("a", {
                  href: "https://github.com/BuilderIO/qwik",
                  target: "_blank",
                  children: "Github",
                }),
              }),
              jsx("li", {
                children: jsx("a", {
                  href: "https://twitter.com/QwikDev",
                  target: "_blank",
                  children: "@QwikDev",
                }),
              }),
            ],
          }),
        ],
      });
    }, "s_IKqvySP21jk")
  ),
  styles$2 = `.docs{display:grid;grid-template-columns:210px auto 190px;grid-template-areas:"menu article on-this-page";gap:40px}.docs h1{margin-top:0}.docs .menu{grid-area:menu}.docs article{grid-area:article}.docs .on-this-page{grid-area:on-this-page}
`,
  layout$1 = componentQrl(
    inlinedQrl(
      () => (
        useStylesQrl(inlinedQrl(styles$2, "s_k3fdbEzYwTM")),
        jsx("div", {
          class: "docs",
          children: [
            jsx(Menu, {}),
            jsx("article", { children: jsx(Slot, {}) }),
            jsx(OnThisPage, {}),
          ],
        })
      ),
      "s_Xe6TbyozvWc"
    )
  ),
  head$5 = ({ head: e }) => ({ title: `${e.title} - Documentation` }),
  DocsLayout_ = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: layout$1, head: head$5 },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  styles$1 = `footer{border-top:.5px solid #ddd;margin-top:40px;padding:20px;text-align:center}footer a{color:#9e9e9e;font-size:12px}footer ul{list-style:none;margin:0;padding:0}footer li{display:inline-block;padding:6px 12px}
`,
  Footer = componentQrl(
    inlinedQrl(
      () => (
        useStylesQrl(inlinedQrl(styles$1, "s_0FKBfpkMNuY")),
        jsx("footer", {
          children: [
            jsx("ul", {
              children: [
                jsx("li", {
                  children: jsx("a", { href: "/docs", children: "Docs" }),
                }),
                jsx("li", {
                  children: jsx("a", {
                    href: "/about-us",
                    children: "About Us",
                  }),
                }),
                jsx("li", {
                  children: jsx("a", {
                    href: "https://qwik.builder.io/",
                    children: "Qwik",
                  }),
                }),
                jsx("li", {
                  children: jsx("a", {
                    href: "https://twitter.com/QwikDev",
                    children: "Twitter",
                  }),
                }),
                jsx("li", {
                  children: jsx("a", {
                    href: "https://github.com/BuilderIO/qwik",
                    children: "Github",
                  }),
                }),
                jsx("li", {
                  children: jsx("a", {
                    href: "https://qwik.builder.io/chat",
                    children: "Chat",
                  }),
                }),
              ],
            }),
            jsx("div", {
              children: jsx("a", {
                href: "https://www.builder.io/",
                target: "_blank",
                class: "builder",
                children: "Made with \u2661 by Builder.io",
              }),
            }),
          ],
        })
      ),
      "s_TPnltT6KZb4"
    )
  ),
  QwikLogo = () =>
    jsx("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 167 53",
      children: [
        jsx("path", {
          fill: "#000",
          d: "M81.95 46.59h-6.4V35.4a12.25 12.25 0 0 1-7.06 2.17c-3.47 0-6.06-.94-7.67-2.92-1.6-1.96-2.42-5.45-2.42-10.43 0-5.1.95-8.62 2.87-10.67 1.96-2.08 5.1-3.09 9.43-3.09 4.1 0 7.82.57 11.25 1.67V46.6Zm-6.4-30.31a16.6 16.6 0 0 0-4.85-.66c-2.17 0-3.73.56-4.6 1.7-.85 1.17-1.32 3.38-1.32 6.65 0 3.08.41 5.14 1.26 6.26.86 1.1 2.33 1.67 4.5 1.67 2.84 0 5.01-1.17 5.01-2.62v-13Zm15.58-5.14c2.27 6.3 4.2 12.6 5.86 18.95 2.22-6.5 4.1-12.8 5.55-18.95h5.61a187.5 187.5 0 0 1 5.3 18.95c2.52-6.9 4.5-13.21 5.95-18.95h6.31a285.68 285.68 0 0 1-8.92 25.76h-7.53c-.86-4.6-2.22-10.14-4.04-16.75a151.51 151.51 0 0 1-4.89 16.75H92.8a287.88 287.88 0 0 0-8.17-25.76h6.5Zm41.7-3.58c-2.83 0-3.63-.7-3.63-3.59 0-2.57.82-3.18 3.63-3.18 2.83 0 3.63.6 3.63 3.18 0 2.89-.8 3.59-3.63 3.59Zm-3.18 3.58h6.4V36.9h-6.4V11.14Zm36.65 0c-4.54 6.46-7.72 10.39-9.49 11.8 1.46.95 5.36 5.95 10.2 13.98h-7.38c-6.02-9.13-8.89-13.07-10.3-13.67v13.67h-6.4V0h6.4v23.23c1.45-1.06 4.63-5.1 9.54-12.09h7.43Z",
        }),
        jsx("path", {
          fill: "#18B6F6",
          d: "M40.97 52.54 32.1 43.7l-.14.02v-.1l-18.9-18.66 4.66-4.5-2.74-15.7L2 20.87a7.14 7.14 0 0 0-1.03 8.52l8.11 13.45a6.81 6.81 0 0 0 5.92 3.3l4.02-.05 21.96 6.46Z",
        }),
        jsx("path", {
          fill: "#AC7EF4",
          d: "m45.82 20.54-1.78-3.3-.93-1.68-.37-.66-.04.04-4.9-8.47a6.85 6.85 0 0 0-5.99-3.43l-4.28.12-12.8.04a6.85 6.85 0 0 0-5.85 3.37L1.1 21.99 15 4.73l18.24 20.04L30 28.04l1.94 15.68.02-.04v.04h-.04l.04.04 1.51 1.47 7.36 7.19c.3.29.81-.06.6-.43l-4.54-8.93 7.91-14.63.26-.3a6.73 6.73 0 0 0 .76-7.6Z",
        }),
        jsx("path", {
          fill: "#fff",
          d: "M33.3 24.69 15.02 4.75l2.6 15.62-4.66 4.51L31.91 43.7l-1.7-15.62 3.1-3.4Z",
        }),
      ],
    }),
  styles = `header{position:sticky;top:0;z-index:11;display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:30px;height:80px;width:100%;padding:10px;background-color:#fff;overflow:hidden}header a.logo{display:block}header a{text-decoration:none}header nav{text-align:right}header nav a{display:inline-block;padding:5px 15px}header nav a:hover{text-decoration:underline}
`,
  Header = componentQrl(
    inlinedQrl(() => {
      useStylesQrl(inlinedQrl(styles, "s_WvavldV6FCE"));
      const { pathname: e } = useLocation();
      return jsx("header", {
        children: [
          jsx("a", { class: "logo", href: "/", children: jsx(QwikLogo, {}) }),
          jsx("nav", {
            children: [
              jsx("a", {
                href: "/docs",
                class: { active: e.startsWith("/docs") },
                children: "Docs",
              }),
              jsx("a", {
                href: "/about-us",
                class: { active: e.startsWith("/about-us") },
                children: "About Us",
              }),
            ],
          }),
        ],
      });
    }, "s_bDzgF468T04")
  ),
  layout = componentQrl(
    inlinedQrl(
      () =>
        jsx(Fragment, {
          children: [
            jsx(Header, {}),
            jsx("main", { children: jsx(Slot, {}) }),
            jsx(Footer, {}),
          ],
        }),
      "s_jA8xa0BlYRo"
    )
  ),
  Layout_ = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: layout },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
var commonjsGlobal =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : typeof self < "u"
      ? self
      : {},
  lottie$1 = { exports: {} };
(function (module, exports) {
  typeof navigator < "u" &&
    (function (e, t) {
      module.exports = t();
    })(commonjsGlobal, function () {
      var svgNS = "http://www.w3.org/2000/svg",
        locationHref = "",
        _useWebWorker = !1,
        initialDefaultFrame = -999999,
        setWebWorker = function (t) {
          _useWebWorker = !!t;
        },
        getWebWorker = function () {
          return _useWebWorker;
        },
        setLocationHref = function (t) {
          locationHref = t;
        },
        getLocationHref = function () {
          return locationHref;
        };
      function createTag(e) {
        return document.createElement(e);
      }
      function extendPrototype(e, t) {
        var r,
          s = e.length,
          i;
        for (r = 0; r < s; r += 1) {
          i = e[r].prototype;
          for (var n in i)
            Object.prototype.hasOwnProperty.call(i, n) &&
              (t.prototype[n] = i[n]);
        }
      }
      function getDescriptor(e, t) {
        return Object.getOwnPropertyDescriptor(e, t);
      }
      function createProxyFunction(e) {
        function t() {}
        return (t.prototype = e), t;
      }
      var audioControllerFactory = (function () {
          function e(t) {
            (this.audios = []),
              (this.audioFactory = t),
              (this._volume = 1),
              (this._isMuted = !1);
          }
          return (
            (e.prototype = {
              addAudio: function (r) {
                this.audios.push(r);
              },
              pause: function () {
                var r,
                  s = this.audios.length;
                for (r = 0; r < s; r += 1) this.audios[r].pause();
              },
              resume: function () {
                var r,
                  s = this.audios.length;
                for (r = 0; r < s; r += 1) this.audios[r].resume();
              },
              setRate: function (r) {
                var s,
                  i = this.audios.length;
                for (s = 0; s < i; s += 1) this.audios[s].setRate(r);
              },
              createAudio: function (r) {
                return this.audioFactory
                  ? this.audioFactory(r)
                  : window.Howl
                  ? new window.Howl({ src: [r] })
                  : {
                      isPlaying: !1,
                      play: function () {
                        this.isPlaying = !0;
                      },
                      seek: function () {
                        this.isPlaying = !1;
                      },
                      playing: function () {},
                      rate: function () {},
                      setVolume: function () {},
                    };
              },
              setAudioFactory: function (r) {
                this.audioFactory = r;
              },
              setVolume: function (r) {
                (this._volume = r), this._updateVolume();
              },
              mute: function () {
                (this._isMuted = !0), this._updateVolume();
              },
              unmute: function () {
                (this._isMuted = !1), this._updateVolume();
              },
              getVolume: function () {
                return this._volume;
              },
              _updateVolume: function () {
                var r,
                  s = this.audios.length;
                for (r = 0; r < s; r += 1)
                  this.audios[r].volume(this._volume * (this._isMuted ? 0 : 1));
              },
            }),
            function () {
              return new e();
            }
          );
        })(),
        createTypedArray = (function () {
          function e(r, s) {
            var i = 0,
              n = [],
              a;
            switch (r) {
              case "int16":
              case "uint8c":
                a = 1;
                break;
              default:
                a = 1.1;
                break;
            }
            for (i = 0; i < s; i += 1) n.push(a);
            return n;
          }
          function t(r, s) {
            return r === "float32"
              ? new Float32Array(s)
              : r === "int16"
              ? new Int16Array(s)
              : r === "uint8c"
              ? new Uint8ClampedArray(s)
              : e(r, s);
          }
          return typeof Uint8ClampedArray == "function" &&
            typeof Float32Array == "function"
            ? t
            : e;
        })();
      function createSizedArray(e) {
        return Array.apply(null, { length: e });
      }
      function _typeof$6(e) {
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$6 = function (r) {
                return typeof r;
              })
            : (_typeof$6 = function (r) {
                return r &&
                  typeof Symbol == "function" &&
                  r.constructor === Symbol &&
                  r !== Symbol.prototype
                  ? "symbol"
                  : typeof r;
              }),
          _typeof$6(e)
        );
      }
      var subframeEnabled = !0,
        expressionsPlugin = null,
        idPrefix$1 = "",
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        bmPow = Math.pow,
        bmSqrt = Math.sqrt,
        bmFloor = Math.floor,
        bmMax = Math.max,
        bmMin = Math.min,
        BMMath = {};
      (function () {
        var e = [
            "abs",
            "acos",
            "acosh",
            "asin",
            "asinh",
            "atan",
            "atanh",
            "atan2",
            "ceil",
            "cbrt",
            "expm1",
            "clz32",
            "cos",
            "cosh",
            "exp",
            "floor",
            "fround",
            "hypot",
            "imul",
            "log",
            "log1p",
            "log2",
            "log10",
            "max",
            "min",
            "pow",
            "random",
            "round",
            "sign",
            "sin",
            "sinh",
            "sqrt",
            "tan",
            "tanh",
            "trunc",
            "E",
            "LN10",
            "LN2",
            "LOG10E",
            "LOG2E",
            "PI",
            "SQRT1_2",
            "SQRT2",
          ],
          t,
          r = e.length;
        for (t = 0; t < r; t += 1) BMMath[e[t]] = Math[e[t]];
      })(),
        (BMMath.random = Math.random),
        (BMMath.abs = function (e) {
          var t = _typeof$6(e);
          if (t === "object" && e.length) {
            var r = createSizedArray(e.length),
              s,
              i = e.length;
            for (s = 0; s < i; s += 1) r[s] = Math.abs(e[s]);
            return r;
          }
          return Math.abs(e);
        });
      var defaultCurveSegments = 150,
        degToRads = Math.PI / 180,
        roundCorner = 0.5519;
      function styleDiv(e) {
        (e.style.position = "absolute"),
          (e.style.top = 0),
          (e.style.left = 0),
          (e.style.display = "block"),
          (e.style.transformOrigin = "0 0"),
          (e.style.webkitTransformOrigin = "0 0"),
          (e.style.backfaceVisibility = "visible"),
          (e.style.webkitBackfaceVisibility = "visible"),
          (e.style.transformStyle = "preserve-3d"),
          (e.style.webkitTransformStyle = "preserve-3d"),
          (e.style.mozTransformStyle = "preserve-3d");
      }
      function BMEnterFrameEvent(e, t, r, s) {
        (this.type = e),
          (this.currentTime = t),
          (this.totalTime = r),
          (this.direction = s < 0 ? -1 : 1);
      }
      function BMCompleteEvent(e, t) {
        (this.type = e), (this.direction = t < 0 ? -1 : 1);
      }
      function BMCompleteLoopEvent(e, t, r, s) {
        (this.type = e),
          (this.currentLoop = r),
          (this.totalLoops = t),
          (this.direction = s < 0 ? -1 : 1);
      }
      function BMSegmentStartEvent(e, t, r) {
        (this.type = e), (this.firstFrame = t), (this.totalFrames = r);
      }
      function BMDestroyEvent(e, t) {
        (this.type = e), (this.target = t);
      }
      function BMRenderFrameErrorEvent(e, t) {
        (this.type = "renderFrameError"),
          (this.nativeError = e),
          (this.currentTime = t);
      }
      function BMConfigErrorEvent(e) {
        (this.type = "configError"), (this.nativeError = e);
      }
      var createElementID = (function () {
        var e = 0;
        return function () {
          return (e += 1), idPrefix$1 + "__lottie_element_" + e;
        };
      })();
      function HSVtoRGB(e, t, r) {
        var s, i, n, a, o, h, c, m;
        switch (
          ((a = Math.floor(e * 6)),
          (o = e * 6 - a),
          (h = r * (1 - t)),
          (c = r * (1 - o * t)),
          (m = r * (1 - (1 - o) * t)),
          a % 6)
        ) {
          case 0:
            (s = r), (i = m), (n = h);
            break;
          case 1:
            (s = c), (i = r), (n = h);
            break;
          case 2:
            (s = h), (i = r), (n = m);
            break;
          case 3:
            (s = h), (i = c), (n = r);
            break;
          case 4:
            (s = m), (i = h), (n = r);
            break;
          case 5:
            (s = r), (i = h), (n = c);
            break;
        }
        return [s, i, n];
      }
      function RGBtoHSV(e, t, r) {
        var s = Math.max(e, t, r),
          i = Math.min(e, t, r),
          n = s - i,
          a,
          o = s === 0 ? 0 : n / s,
          h = s / 255;
        switch (s) {
          case i:
            a = 0;
            break;
          case e:
            (a = t - r + n * (t < r ? 6 : 0)), (a /= 6 * n);
            break;
          case t:
            (a = r - e + n * 2), (a /= 6 * n);
            break;
          case r:
            (a = e - t + n * 4), (a /= 6 * n);
            break;
        }
        return [a, o, h];
      }
      function addSaturationToRGB(e, t) {
        var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255);
        return (
          (r[1] += t),
          r[1] > 1 ? (r[1] = 1) : r[1] <= 0 && (r[1] = 0),
          HSVtoRGB(r[0], r[1], r[2])
        );
      }
      function addBrightnessToRGB(e, t) {
        var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255);
        return (
          (r[2] += t),
          r[2] > 1 ? (r[2] = 1) : r[2] < 0 && (r[2] = 0),
          HSVtoRGB(r[0], r[1], r[2])
        );
      }
      function addHueToRGB(e, t) {
        var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255);
        return (
          (r[0] += t / 360),
          r[0] > 1 ? (r[0] -= 1) : r[0] < 0 && (r[0] += 1),
          HSVtoRGB(r[0], r[1], r[2])
        );
      }
      var rgbToHex = (function () {
          var e = [],
            t,
            r;
          for (t = 0; t < 256; t += 1)
            (r = t.toString(16)), (e[t] = r.length === 1 ? "0" + r : r);
          return function (s, i, n) {
            return (
              s < 0 && (s = 0),
              i < 0 && (i = 0),
              n < 0 && (n = 0),
              "#" + e[s] + e[i] + e[n]
            );
          };
        })(),
        setSubframeEnabled = function (t) {
          subframeEnabled = !!t;
        },
        getSubframeEnabled = function () {
          return subframeEnabled;
        },
        setExpressionsPlugin = function (t) {
          expressionsPlugin = t;
        },
        getExpressionsPlugin = function () {
          return expressionsPlugin;
        },
        setDefaultCurveSegments = function (t) {
          defaultCurveSegments = t;
        },
        getDefaultCurveSegments = function () {
          return defaultCurveSegments;
        },
        setIdPrefix = function (t) {
          idPrefix$1 = t;
        };
      function createNS(e) {
        return document.createElementNS(svgNS, e);
      }
      function _typeof$5(e) {
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$5 = function (r) {
                return typeof r;
              })
            : (_typeof$5 = function (r) {
                return r &&
                  typeof Symbol == "function" &&
                  r.constructor === Symbol &&
                  r !== Symbol.prototype
                  ? "symbol"
                  : typeof r;
              }),
          _typeof$5(e)
        );
      }
      var dataManager = (function () {
          var e = 1,
            t = [],
            r,
            s,
            i = {
              onmessage: function () {},
              postMessage: function (v) {
                r({ data: v });
              },
            },
            n = {
              postMessage: function (v) {
                i.onmessage({ data: v });
              },
            };
          function a(u) {
            if (window.Worker && window.Blob && getWebWorker()) {
              var v = new Blob(
                  ["var _workerSelf = self; self.onmessage = ", u.toString()],
                  { type: "text/javascript" }
                ),
                g = URL.createObjectURL(v);
              return new Worker(g);
            }
            return (r = u), i;
          }
          function o() {
            s ||
              ((s = a(function (v) {
                function g() {
                  function E(T, k) {
                    var C,
                      P,
                      w = T.length,
                      R,
                      I,
                      q,
                      N;
                    for (P = 0; P < w; P += 1)
                      if (((C = T[P]), "ks" in C && !C.completed)) {
                        if (
                          ((C.completed = !0),
                          C.tt && (T[P - 1].td = C.tt),
                          C.hasMask)
                        ) {
                          var O = C.masksProperties;
                          for (I = O.length, R = 0; R < I; R += 1)
                            if (O[R].pt.k.i) b(O[R].pt.k);
                            else
                              for (N = O[R].pt.k.length, q = 0; q < N; q += 1)
                                O[R].pt.k[q].s && b(O[R].pt.k[q].s[0]),
                                  O[R].pt.k[q].e && b(O[R].pt.k[q].e[0]);
                        }
                        C.ty === 0
                          ? ((C.layers = p(C.refId, k)), E(C.layers, k))
                          : C.ty === 4
                          ? f(C.shapes)
                          : C.ty === 5 && D(C);
                      }
                  }
                  function l(T, k) {
                    if (T) {
                      var C = 0,
                        P = T.length;
                      for (C = 0; C < P; C += 1)
                        T[C].t === 1 &&
                          ((T[C].data.layers = p(T[C].data.refId, k)),
                          E(T[C].data.layers, k));
                    }
                  }
                  function d(T, k) {
                    for (var C = 0, P = k.length; C < P; ) {
                      if (k[C].id === T) return k[C];
                      C += 1;
                    }
                    return null;
                  }
                  function p(T, k) {
                    var C = d(T, k);
                    return C
                      ? C.layers.__used
                        ? JSON.parse(JSON.stringify(C.layers))
                        : ((C.layers.__used = !0), C.layers)
                      : null;
                  }
                  function f(T) {
                    var k,
                      C = T.length,
                      P,
                      w;
                    for (k = C - 1; k >= 0; k -= 1)
                      if (T[k].ty === "sh")
                        if (T[k].ks.k.i) b(T[k].ks.k);
                        else
                          for (w = T[k].ks.k.length, P = 0; P < w; P += 1)
                            T[k].ks.k[P].s && b(T[k].ks.k[P].s[0]),
                              T[k].ks.k[P].e && b(T[k].ks.k[P].e[0]);
                      else T[k].ty === "gr" && f(T[k].it);
                  }
                  function b(T) {
                    var k,
                      C = T.i.length;
                    for (k = 0; k < C; k += 1)
                      (T.i[k][0] += T.v[k][0]),
                        (T.i[k][1] += T.v[k][1]),
                        (T.o[k][0] += T.v[k][0]),
                        (T.o[k][1] += T.v[k][1]);
                  }
                  function x(T, k) {
                    var C = k ? k.split(".") : [100, 100, 100];
                    return T[0] > C[0]
                      ? !0
                      : C[0] > T[0]
                      ? !1
                      : T[1] > C[1]
                      ? !0
                      : C[1] > T[1]
                      ? !1
                      : T[2] > C[2]
                      ? !0
                      : C[2] > T[2]
                      ? !1
                      : null;
                  }
                  var $ = (function () {
                      var T = [4, 4, 14];
                      function k(P) {
                        var w = P.t.d;
                        P.t.d = { k: [{ s: w, t: 0 }] };
                      }
                      function C(P) {
                        var w,
                          R = P.length;
                        for (w = 0; w < R; w += 1) P[w].ty === 5 && k(P[w]);
                      }
                      return function (P) {
                        if (x(T, P.v) && (C(P.layers), P.assets)) {
                          var w,
                            R = P.assets.length;
                          for (w = 0; w < R; w += 1)
                            P.assets[w].layers && C(P.assets[w].layers);
                        }
                      };
                    })(),
                    _ = (function () {
                      var T = [4, 7, 99];
                      return function (k) {
                        if (k.chars && !x(T, k.v)) {
                          var C,
                            P = k.chars.length;
                          for (C = 0; C < P; C += 1) {
                            var w = k.chars[C];
                            w.data &&
                              w.data.shapes &&
                              (f(w.data.shapes),
                              (w.data.ip = 0),
                              (w.data.op = 99999),
                              (w.data.st = 0),
                              (w.data.sr = 1),
                              (w.data.ks = {
                                p: { k: [0, 0], a: 0 },
                                s: { k: [100, 100], a: 0 },
                                a: { k: [0, 0], a: 0 },
                                r: { k: 0, a: 0 },
                                o: { k: 100, a: 0 },
                              }),
                              k.chars[C].t ||
                                (w.data.shapes.push({ ty: "no" }),
                                w.data.shapes[0].it.push({
                                  p: { k: [0, 0], a: 0 },
                                  s: { k: [100, 100], a: 0 },
                                  a: { k: [0, 0], a: 0 },
                                  r: { k: 0, a: 0 },
                                  o: { k: 100, a: 0 },
                                  sk: { k: 0, a: 0 },
                                  sa: { k: 0, a: 0 },
                                  ty: "tr",
                                })));
                          }
                        }
                      };
                    })(),
                    A = (function () {
                      var T = [5, 7, 15];
                      function k(P) {
                        var w = P.t.p;
                        typeof w.a == "number" && (w.a = { a: 0, k: w.a }),
                          typeof w.p == "number" && (w.p = { a: 0, k: w.p }),
                          typeof w.r == "number" && (w.r = { a: 0, k: w.r });
                      }
                      function C(P) {
                        var w,
                          R = P.length;
                        for (w = 0; w < R; w += 1) P[w].ty === 5 && k(P[w]);
                      }
                      return function (P) {
                        if (x(T, P.v) && (C(P.layers), P.assets)) {
                          var w,
                            R = P.assets.length;
                          for (w = 0; w < R; w += 1)
                            P.assets[w].layers && C(P.assets[w].layers);
                        }
                      };
                    })(),
                    L = (function () {
                      var T = [4, 1, 9];
                      function k(P) {
                        var w,
                          R = P.length,
                          I,
                          q;
                        for (w = 0; w < R; w += 1)
                          if (P[w].ty === "gr") k(P[w].it);
                          else if (P[w].ty === "fl" || P[w].ty === "st")
                            if (P[w].c.k && P[w].c.k[0].i)
                              for (q = P[w].c.k.length, I = 0; I < q; I += 1)
                                P[w].c.k[I].s &&
                                  ((P[w].c.k[I].s[0] /= 255),
                                  (P[w].c.k[I].s[1] /= 255),
                                  (P[w].c.k[I].s[2] /= 255),
                                  (P[w].c.k[I].s[3] /= 255)),
                                  P[w].c.k[I].e &&
                                    ((P[w].c.k[I].e[0] /= 255),
                                    (P[w].c.k[I].e[1] /= 255),
                                    (P[w].c.k[I].e[2] /= 255),
                                    (P[w].c.k[I].e[3] /= 255));
                            else
                              (P[w].c.k[0] /= 255),
                                (P[w].c.k[1] /= 255),
                                (P[w].c.k[2] /= 255),
                                (P[w].c.k[3] /= 255);
                      }
                      function C(P) {
                        var w,
                          R = P.length;
                        for (w = 0; w < R; w += 1)
                          P[w].ty === 4 && k(P[w].shapes);
                      }
                      return function (P) {
                        if (x(T, P.v) && (C(P.layers), P.assets)) {
                          var w,
                            R = P.assets.length;
                          for (w = 0; w < R; w += 1)
                            P.assets[w].layers && C(P.assets[w].layers);
                        }
                      };
                    })(),
                    F = (function () {
                      var T = [4, 4, 18];
                      function k(P) {
                        var w,
                          R = P.length,
                          I,
                          q;
                        for (w = R - 1; w >= 0; w -= 1)
                          if (P[w].ty === "sh")
                            if (P[w].ks.k.i) P[w].ks.k.c = P[w].closed;
                            else
                              for (q = P[w].ks.k.length, I = 0; I < q; I += 1)
                                P[w].ks.k[I].s &&
                                  (P[w].ks.k[I].s[0].c = P[w].closed),
                                  P[w].ks.k[I].e &&
                                    (P[w].ks.k[I].e[0].c = P[w].closed);
                          else P[w].ty === "gr" && k(P[w].it);
                      }
                      function C(P) {
                        var w,
                          R,
                          I = P.length,
                          q,
                          N,
                          O,
                          z;
                        for (R = 0; R < I; R += 1) {
                          if (((w = P[R]), w.hasMask)) {
                            var B = w.masksProperties;
                            for (N = B.length, q = 0; q < N; q += 1)
                              if (B[q].pt.k.i) B[q].pt.k.c = B[q].cl;
                              else
                                for (z = B[q].pt.k.length, O = 0; O < z; O += 1)
                                  B[q].pt.k[O].s &&
                                    (B[q].pt.k[O].s[0].c = B[q].cl),
                                    B[q].pt.k[O].e &&
                                      (B[q].pt.k[O].e[0].c = B[q].cl);
                          }
                          w.ty === 4 && k(w.shapes);
                        }
                      }
                      return function (P) {
                        if (x(T, P.v) && (C(P.layers), P.assets)) {
                          var w,
                            R = P.assets.length;
                          for (w = 0; w < R; w += 1)
                            P.assets[w].layers && C(P.assets[w].layers);
                        }
                      };
                    })();
                  function M(T) {
                    T.__complete ||
                      (L(T),
                      $(T),
                      _(T),
                      A(T),
                      F(T),
                      E(T.layers, T.assets),
                      l(T.chars, T.assets),
                      (T.__complete = !0));
                  }
                  function D(T) {
                    T.t.a.length === 0 && "m" in T.t.p;
                  }
                  var V = {};
                  return (
                    (V.completeData = M),
                    (V.checkColors = L),
                    (V.checkChars = _),
                    (V.checkPathProperties = A),
                    (V.checkShapes = F),
                    (V.completeLayers = E),
                    V
                  );
                }
                if (
                  (n.dataManager || (n.dataManager = g()),
                  n.assetLoader ||
                    (n.assetLoader = (function () {
                      function E(d) {
                        var p = d.getResponseHeader("content-type");
                        return (p &&
                          d.responseType === "json" &&
                          p.indexOf("json") !== -1) ||
                          (d.response && _typeof$5(d.response) === "object")
                          ? d.response
                          : d.response && typeof d.response == "string"
                          ? JSON.parse(d.response)
                          : d.responseText
                          ? JSON.parse(d.responseText)
                          : null;
                      }
                      function l(d, p, f, b) {
                        var x,
                          $ = new XMLHttpRequest();
                        try {
                          $.responseType = "json";
                        } catch {}
                        $.onreadystatechange = function () {
                          if ($.readyState === 4)
                            if ($.status === 200) (x = E($)), f(x);
                            else
                              try {
                                (x = E($)), f(x);
                              } catch (_) {
                                b && b(_);
                              }
                        };
                        try {
                          $.open("GET", d, !0);
                        } catch {
                          $.open("GET", p + "/" + d, !0);
                        }
                        $.send();
                      }
                      return { load: l };
                    })()),
                  v.data.type === "loadAnimation")
                )
                  n.assetLoader.load(
                    v.data.path,
                    v.data.fullPath,
                    function (E) {
                      n.dataManager.completeData(E),
                        n.postMessage({
                          id: v.data.id,
                          payload: E,
                          status: "success",
                        });
                    },
                    function () {
                      n.postMessage({ id: v.data.id, status: "error" });
                    }
                  );
                else if (v.data.type === "complete") {
                  var y = v.data.animation;
                  n.dataManager.completeData(y),
                    n.postMessage({
                      id: v.data.id,
                      payload: y,
                      status: "success",
                    });
                } else
                  v.data.type === "loadData" &&
                    n.assetLoader.load(
                      v.data.path,
                      v.data.fullPath,
                      function (E) {
                        n.postMessage({
                          id: v.data.id,
                          payload: E,
                          status: "success",
                        });
                      },
                      function () {
                        n.postMessage({ id: v.data.id, status: "error" });
                      }
                    );
              })),
              (s.onmessage = function (u) {
                var v = u.data,
                  g = v.id,
                  y = t[g];
                (t[g] = null),
                  v.status === "success"
                    ? y.onComplete(v.payload)
                    : y.onError && y.onError();
              }));
          }
          function h(u, v) {
            e += 1;
            var g = "processId_" + e;
            return (t[g] = { onComplete: u, onError: v }), g;
          }
          function c(u, v, g) {
            o();
            var y = h(v, g);
            s.postMessage({
              type: "loadAnimation",
              path: u,
              fullPath: window.location.origin + window.location.pathname,
              id: y,
            });
          }
          function m(u, v, g) {
            o();
            var y = h(v, g);
            s.postMessage({
              type: "loadData",
              path: u,
              fullPath: window.location.origin + window.location.pathname,
              id: y,
            });
          }
          function S(u, v, g) {
            o();
            var y = h(v, g);
            s.postMessage({ type: "complete", animation: u, id: y });
          }
          return { loadAnimation: c, loadData: m, completeAnimation: S };
        })(),
        ImagePreloader = (function () {
          var e = (function () {
            var l = createTag("canvas");
            (l.width = 1), (l.height = 1);
            var d = l.getContext("2d");
            return (d.fillStyle = "rgba(0,0,0,0)"), d.fillRect(0, 0, 1, 1), l;
          })();
          function t() {
            (this.loadedAssets += 1),
              this.loadedAssets === this.totalImages &&
                this.loadedFootagesCount === this.totalFootages &&
                this.imagesLoadedCb &&
                this.imagesLoadedCb(null);
          }
          function r() {
            (this.loadedFootagesCount += 1),
              this.loadedAssets === this.totalImages &&
                this.loadedFootagesCount === this.totalFootages &&
                this.imagesLoadedCb &&
                this.imagesLoadedCb(null);
          }
          function s(l, d, p) {
            var f = "";
            if (l.e) f = l.p;
            else if (d) {
              var b = l.p;
              b.indexOf("images/") !== -1 && (b = b.split("/")[1]), (f = d + b);
            } else (f = p), (f += l.u ? l.u : ""), (f += l.p);
            return f;
          }
          function i(l) {
            var d = 0,
              p = setInterval(
                function () {
                  var f = l.getBBox();
                  (f.width || d > 500) &&
                    (this._imageLoaded(), clearInterval(p)),
                    (d += 1);
                }.bind(this),
                50
              );
          }
          function n(l) {
            var d = s(l, this.assetsPath, this.path),
              p = createNS("image");
            isSafari
              ? this.testImageLoaded(p)
              : p.addEventListener("load", this._imageLoaded, !1),
              p.addEventListener(
                "error",
                function () {
                  (f.img = e), this._imageLoaded();
                }.bind(this),
                !1
              ),
              p.setAttributeNS("http://www.w3.org/1999/xlink", "href", d),
              this._elementHelper.append
                ? this._elementHelper.append(p)
                : this._elementHelper.appendChild(p);
            var f = { img: p, assetData: l };
            return f;
          }
          function a(l) {
            var d = s(l, this.assetsPath, this.path),
              p = createTag("img");
            (p.crossOrigin = "anonymous"),
              p.addEventListener("load", this._imageLoaded, !1),
              p.addEventListener(
                "error",
                function () {
                  (f.img = e), this._imageLoaded();
                }.bind(this),
                !1
              ),
              (p.src = d);
            var f = { img: p, assetData: l };
            return f;
          }
          function o(l) {
            var d = { assetData: l },
              p = s(l, this.assetsPath, this.path);
            return (
              dataManager.loadData(
                p,
                function (f) {
                  (d.img = f), this._footageLoaded();
                }.bind(this),
                function () {
                  (d.img = {}), this._footageLoaded();
                }.bind(this)
              ),
              d
            );
          }
          function h(l, d) {
            this.imagesLoadedCb = d;
            var p,
              f = l.length;
            for (p = 0; p < f; p += 1)
              l[p].layers ||
                (!l[p].t || l[p].t === "seq"
                  ? ((this.totalImages += 1),
                    this.images.push(this._createImageData(l[p])))
                  : l[p].t === 3 &&
                    ((this.totalFootages += 1),
                    this.images.push(this.createFootageData(l[p]))));
          }
          function c(l) {
            this.path = l || "";
          }
          function m(l) {
            this.assetsPath = l || "";
          }
          function S(l) {
            for (var d = 0, p = this.images.length; d < p; ) {
              if (this.images[d].assetData === l) return this.images[d].img;
              d += 1;
            }
            return null;
          }
          function u() {
            (this.imagesLoadedCb = null), (this.images.length = 0);
          }
          function v() {
            return this.totalImages === this.loadedAssets;
          }
          function g() {
            return this.totalFootages === this.loadedFootagesCount;
          }
          function y(l, d) {
            l === "svg"
              ? ((this._elementHelper = d),
                (this._createImageData = this.createImageData.bind(this)))
              : (this._createImageData = this.createImgData.bind(this));
          }
          function E() {
            (this._imageLoaded = t.bind(this)),
              (this._footageLoaded = r.bind(this)),
              (this.testImageLoaded = i.bind(this)),
              (this.createFootageData = o.bind(this)),
              (this.assetsPath = ""),
              (this.path = ""),
              (this.totalImages = 0),
              (this.totalFootages = 0),
              (this.loadedAssets = 0),
              (this.loadedFootagesCount = 0),
              (this.imagesLoadedCb = null),
              (this.images = []);
          }
          return (
            (E.prototype = {
              loadAssets: h,
              setAssetsPath: m,
              setPath: c,
              loadedImages: v,
              loadedFootages: g,
              destroy: u,
              getAsset: S,
              createImgData: a,
              createImageData: n,
              imageLoaded: t,
              footageLoaded: r,
              setCacheType: y,
            }),
            E
          );
        })();
      function BaseEvent() {}
      BaseEvent.prototype = {
        triggerEvent: function (t, r) {
          if (this._cbs[t])
            for (var s = this._cbs[t], i = 0; i < s.length; i += 1) s[i](r);
        },
        addEventListener: function (t, r) {
          return (
            this._cbs[t] || (this._cbs[t] = []),
            this._cbs[t].push(r),
            function () {
              this.removeEventListener(t, r);
            }.bind(this)
          );
        },
        removeEventListener: function (t, r) {
          if (!r) this._cbs[t] = null;
          else if (this._cbs[t]) {
            for (var s = 0, i = this._cbs[t].length; s < i; )
              this._cbs[t][s] === r &&
                (this._cbs[t].splice(s, 1), (s -= 1), (i -= 1)),
                (s += 1);
            this._cbs[t].length || (this._cbs[t] = null);
          }
        },
      };
      var markerParser = (function () {
          function e(t) {
            for (
              var r = t.split(`\r
`),
                s = {},
                i,
                n = 0,
                a = 0;
              a < r.length;
              a += 1
            )
              (i = r[a].split(":")),
                i.length === 2 && ((s[i[0]] = i[1].trim()), (n += 1));
            if (n === 0) throw new Error();
            return s;
          }
          return function (t) {
            for (var r = [], s = 0; s < t.length; s += 1) {
              var i = t[s],
                n = { time: i.tm, duration: i.dr };
              try {
                n.payload = JSON.parse(t[s].cm);
              } catch {
                try {
                  n.payload = e(t[s].cm);
                } catch {
                  n.payload = { name: t[s].cm };
                }
              }
              r.push(n);
            }
            return r;
          };
        })(),
        ProjectInterface = (function () {
          function e(t) {
            this.compositions.push(t);
          }
          return function () {
            function t(r) {
              for (var s = 0, i = this.compositions.length; s < i; ) {
                if (
                  this.compositions[s].data &&
                  this.compositions[s].data.nm === r
                )
                  return (
                    this.compositions[s].prepareFrame &&
                      this.compositions[s].data.xt &&
                      this.compositions[s].prepareFrame(this.currentFrame),
                    this.compositions[s].compInterface
                  );
                s += 1;
              }
              return null;
            }
            return (
              (t.compositions = []),
              (t.currentFrame = 0),
              (t.registerComposition = e),
              t
            );
          };
        })(),
        renderers = {},
        registerRenderer = function (t, r) {
          renderers[t] = r;
        };
      function getRenderer(e) {
        return renderers[e];
      }
      function _typeof$4(e) {
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$4 = function (r) {
                return typeof r;
              })
            : (_typeof$4 = function (r) {
                return r &&
                  typeof Symbol == "function" &&
                  r.constructor === Symbol &&
                  r !== Symbol.prototype
                  ? "symbol"
                  : typeof r;
              }),
          _typeof$4(e)
        );
      }
      var AnimationItem = function () {
        (this._cbs = []),
          (this.name = ""),
          (this.path = ""),
          (this.isLoaded = !1),
          (this.currentFrame = 0),
          (this.currentRawFrame = 0),
          (this.firstFrame = 0),
          (this.totalFrames = 0),
          (this.frameRate = 0),
          (this.frameMult = 0),
          (this.playSpeed = 1),
          (this.playDirection = 1),
          (this.playCount = 0),
          (this.animationData = {}),
          (this.assets = []),
          (this.isPaused = !0),
          (this.autoplay = !1),
          (this.loop = !0),
          (this.renderer = null),
          (this.animationID = createElementID()),
          (this.assetsPath = ""),
          (this.timeCompleted = 0),
          (this.segmentPos = 0),
          (this.isSubframeEnabled = getSubframeEnabled()),
          (this.segments = []),
          (this._idle = !0),
          (this._completedLoop = !1),
          (this.projectInterface = ProjectInterface()),
          (this.imagePreloader = new ImagePreloader()),
          (this.audioController = audioControllerFactory()),
          (this.markers = []),
          (this.configAnimation = this.configAnimation.bind(this)),
          (this.onSetupError = this.onSetupError.bind(this)),
          (this.onSegmentComplete = this.onSegmentComplete.bind(this)),
          (this.drawnFrameEvent = new BMEnterFrameEvent("drawnFrame", 0, 0, 0));
      };
      extendPrototype([BaseEvent], AnimationItem),
        (AnimationItem.prototype.setParams = function (e) {
          (e.wrapper || e.container) &&
            (this.wrapper = e.wrapper || e.container);
          var t = "svg";
          e.animType ? (t = e.animType) : e.renderer && (t = e.renderer);
          var r = getRenderer(t);
          (this.renderer = new r(this, e.rendererSettings)),
            this.imagePreloader.setCacheType(t, this.renderer.globalData.defs),
            this.renderer.setProjectInterface(this.projectInterface),
            (this.animType = t),
            e.loop === "" ||
            e.loop === null ||
            e.loop === void 0 ||
            e.loop === !0
              ? (this.loop = !0)
              : e.loop === !1
              ? (this.loop = !1)
              : (this.loop = parseInt(e.loop, 10)),
            (this.autoplay = "autoplay" in e ? e.autoplay : !0),
            (this.name = e.name ? e.name : ""),
            (this.autoloadSegments = Object.prototype.hasOwnProperty.call(
              e,
              "autoloadSegments"
            )
              ? e.autoloadSegments
              : !0),
            (this.assetsPath = e.assetsPath),
            (this.initialSegment = e.initialSegment),
            e.audioFactory &&
              this.audioController.setAudioFactory(e.audioFactory),
            e.animationData
              ? this.setupAnimation(e.animationData)
              : e.path &&
                (e.path.lastIndexOf("\\") !== -1
                  ? (this.path = e.path.substr(0, e.path.lastIndexOf("\\") + 1))
                  : (this.path = e.path.substr(0, e.path.lastIndexOf("/") + 1)),
                (this.fileName = e.path.substr(e.path.lastIndexOf("/") + 1)),
                (this.fileName = this.fileName.substr(
                  0,
                  this.fileName.lastIndexOf(".json")
                )),
                dataManager.loadAnimation(
                  e.path,
                  this.configAnimation,
                  this.onSetupError
                ));
        }),
        (AnimationItem.prototype.onSetupError = function () {
          this.trigger("data_failed");
        }),
        (AnimationItem.prototype.setupAnimation = function (e) {
          dataManager.completeAnimation(e, this.configAnimation);
        }),
        (AnimationItem.prototype.setData = function (e, t) {
          t && _typeof$4(t) !== "object" && (t = JSON.parse(t));
          var r = { wrapper: e, animationData: t },
            s = e.attributes;
          (r.path = s.getNamedItem("data-animation-path")
            ? s.getNamedItem("data-animation-path").value
            : s.getNamedItem("data-bm-path")
            ? s.getNamedItem("data-bm-path").value
            : s.getNamedItem("bm-path")
            ? s.getNamedItem("bm-path").value
            : ""),
            (r.animType = s.getNamedItem("data-anim-type")
              ? s.getNamedItem("data-anim-type").value
              : s.getNamedItem("data-bm-type")
              ? s.getNamedItem("data-bm-type").value
              : s.getNamedItem("bm-type")
              ? s.getNamedItem("bm-type").value
              : s.getNamedItem("data-bm-renderer")
              ? s.getNamedItem("data-bm-renderer").value
              : s.getNamedItem("bm-renderer")
              ? s.getNamedItem("bm-renderer").value
              : "canvas");
          var i = s.getNamedItem("data-anim-loop")
            ? s.getNamedItem("data-anim-loop").value
            : s.getNamedItem("data-bm-loop")
            ? s.getNamedItem("data-bm-loop").value
            : s.getNamedItem("bm-loop")
            ? s.getNamedItem("bm-loop").value
            : "";
          i === "false"
            ? (r.loop = !1)
            : i === "true"
            ? (r.loop = !0)
            : i !== "" && (r.loop = parseInt(i, 10));
          var n = s.getNamedItem("data-anim-autoplay")
            ? s.getNamedItem("data-anim-autoplay").value
            : s.getNamedItem("data-bm-autoplay")
            ? s.getNamedItem("data-bm-autoplay").value
            : s.getNamedItem("bm-autoplay")
            ? s.getNamedItem("bm-autoplay").value
            : !0;
          (r.autoplay = n !== "false"),
            (r.name = s.getNamedItem("data-name")
              ? s.getNamedItem("data-name").value
              : s.getNamedItem("data-bm-name")
              ? s.getNamedItem("data-bm-name").value
              : s.getNamedItem("bm-name")
              ? s.getNamedItem("bm-name").value
              : "");
          var a = s.getNamedItem("data-anim-prerender")
            ? s.getNamedItem("data-anim-prerender").value
            : s.getNamedItem("data-bm-prerender")
            ? s.getNamedItem("data-bm-prerender").value
            : s.getNamedItem("bm-prerender")
            ? s.getNamedItem("bm-prerender").value
            : "";
          a === "false" && (r.prerender = !1), this.setParams(r);
        }),
        (AnimationItem.prototype.includeLayers = function (e) {
          e.op > this.animationData.op &&
            ((this.animationData.op = e.op),
            (this.totalFrames = Math.floor(e.op - this.animationData.ip)));
          var t = this.animationData.layers,
            r,
            s = t.length,
            i = e.layers,
            n,
            a = i.length;
          for (n = 0; n < a; n += 1)
            for (r = 0; r < s; ) {
              if (t[r].id === i[n].id) {
                t[r] = i[n];
                break;
              }
              r += 1;
            }
          if (
            ((e.chars || e.fonts) &&
              (this.renderer.globalData.fontManager.addChars(e.chars),
              this.renderer.globalData.fontManager.addFonts(
                e.fonts,
                this.renderer.globalData.defs
              )),
            e.assets)
          )
            for (s = e.assets.length, r = 0; r < s; r += 1)
              this.animationData.assets.push(e.assets[r]);
          (this.animationData.__complete = !1),
            dataManager.completeAnimation(
              this.animationData,
              this.onSegmentComplete
            );
        }),
        (AnimationItem.prototype.onSegmentComplete = function (e) {
          this.animationData = e;
          var t = getExpressionsPlugin();
          t && t.initExpressions(this), this.loadNextSegment();
        }),
        (AnimationItem.prototype.loadNextSegment = function () {
          var e = this.animationData.segments;
          if (!e || e.length === 0 || !this.autoloadSegments) {
            this.trigger("data_ready"), (this.timeCompleted = this.totalFrames);
            return;
          }
          var t = e.shift();
          this.timeCompleted = t.time * this.frameRate;
          var r = this.path + this.fileName + "_" + this.segmentPos + ".json";
          (this.segmentPos += 1),
            dataManager.loadData(
              r,
              this.includeLayers.bind(this),
              function () {
                this.trigger("data_failed");
              }.bind(this)
            );
        }),
        (AnimationItem.prototype.loadSegments = function () {
          var e = this.animationData.segments;
          e || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
        }),
        (AnimationItem.prototype.imagesLoaded = function () {
          this.trigger("loaded_images"), this.checkLoaded();
        }),
        (AnimationItem.prototype.preloadImages = function () {
          this.imagePreloader.setAssetsPath(this.assetsPath),
            this.imagePreloader.setPath(this.path),
            this.imagePreloader.loadAssets(
              this.animationData.assets,
              this.imagesLoaded.bind(this)
            );
        }),
        (AnimationItem.prototype.configAnimation = function (e) {
          if (!!this.renderer)
            try {
              (this.animationData = e),
                this.initialSegment
                  ? ((this.totalFrames = Math.floor(
                      this.initialSegment[1] - this.initialSegment[0]
                    )),
                    (this.firstFrame = Math.round(this.initialSegment[0])))
                  : ((this.totalFrames = Math.floor(
                      this.animationData.op - this.animationData.ip
                    )),
                    (this.firstFrame = Math.round(this.animationData.ip))),
                this.renderer.configAnimation(e),
                e.assets || (e.assets = []),
                (this.assets = this.animationData.assets),
                (this.frameRate = this.animationData.fr),
                (this.frameMult = this.animationData.fr / 1e3),
                this.renderer.searchExtraCompositions(e.assets),
                (this.markers = markerParser(e.markers || [])),
                this.trigger("config_ready"),
                this.preloadImages(),
                this.loadSegments(),
                this.updaFrameModifier(),
                this.waitForFontsLoaded(),
                this.isPaused && this.audioController.pause();
            } catch (t) {
              this.triggerConfigError(t);
            }
        }),
        (AnimationItem.prototype.waitForFontsLoaded = function () {
          !this.renderer ||
            (this.renderer.globalData.fontManager.isLoaded
              ? this.checkLoaded()
              : setTimeout(this.waitForFontsLoaded.bind(this), 20));
        }),
        (AnimationItem.prototype.checkLoaded = function () {
          if (
            !this.isLoaded &&
            this.renderer.globalData.fontManager.isLoaded &&
            (this.imagePreloader.loadedImages() ||
              this.renderer.rendererType !== "canvas") &&
            this.imagePreloader.loadedFootages()
          ) {
            this.isLoaded = !0;
            var e = getExpressionsPlugin();
            e && e.initExpressions(this),
              this.renderer.initItems(),
              setTimeout(
                function () {
                  this.trigger("DOMLoaded");
                }.bind(this),
                0
              ),
              this.gotoFrame(),
              this.autoplay && this.play();
          }
        }),
        (AnimationItem.prototype.resize = function () {
          this.renderer.updateContainerSize();
        }),
        (AnimationItem.prototype.setSubframe = function (e) {
          this.isSubframeEnabled = !!e;
        }),
        (AnimationItem.prototype.gotoFrame = function () {
          (this.currentFrame = this.isSubframeEnabled
            ? this.currentRawFrame
            : ~~this.currentRawFrame),
            this.timeCompleted !== this.totalFrames &&
              this.currentFrame > this.timeCompleted &&
              (this.currentFrame = this.timeCompleted),
            this.trigger("enterFrame"),
            this.renderFrame(),
            this.trigger("drawnFrame");
        }),
        (AnimationItem.prototype.renderFrame = function () {
          if (!(this.isLoaded === !1 || !this.renderer))
            try {
              this.renderer.renderFrame(this.currentFrame + this.firstFrame);
            } catch (e) {
              this.triggerRenderFrameError(e);
            }
        }),
        (AnimationItem.prototype.play = function (e) {
          (e && this.name !== e) ||
            (this.isPaused === !0 &&
              ((this.isPaused = !1),
              this.trigger("_pause"),
              this.audioController.resume(),
              this._idle && ((this._idle = !1), this.trigger("_active"))));
        }),
        (AnimationItem.prototype.pause = function (e) {
          (e && this.name !== e) ||
            (this.isPaused === !1 &&
              ((this.isPaused = !0),
              this.trigger("_play"),
              (this._idle = !0),
              this.trigger("_idle"),
              this.audioController.pause()));
        }),
        (AnimationItem.prototype.togglePause = function (e) {
          (e && this.name !== e) ||
            (this.isPaused === !0 ? this.play() : this.pause());
        }),
        (AnimationItem.prototype.stop = function (e) {
          (e && this.name !== e) ||
            (this.pause(),
            (this.playCount = 0),
            (this._completedLoop = !1),
            this.setCurrentRawFrameValue(0));
        }),
        (AnimationItem.prototype.getMarkerData = function (e) {
          for (var t, r = 0; r < this.markers.length; r += 1)
            if (((t = this.markers[r]), t.payload && t.payload.name === e))
              return t;
          return null;
        }),
        (AnimationItem.prototype.goToAndStop = function (e, t, r) {
          if (!(r && this.name !== r)) {
            var s = Number(e);
            if (isNaN(s)) {
              var i = this.getMarkerData(e);
              i && this.goToAndStop(i.time, !0);
            } else
              t
                ? this.setCurrentRawFrameValue(e)
                : this.setCurrentRawFrameValue(e * this.frameModifier);
            this.pause();
          }
        }),
        (AnimationItem.prototype.goToAndPlay = function (e, t, r) {
          if (!(r && this.name !== r)) {
            var s = Number(e);
            if (isNaN(s)) {
              var i = this.getMarkerData(e);
              i &&
                (i.duration
                  ? this.playSegments([i.time, i.time + i.duration], !0)
                  : this.goToAndStop(i.time, !0));
            } else this.goToAndStop(s, t, r);
            this.play();
          }
        }),
        (AnimationItem.prototype.advanceTime = function (e) {
          if (!(this.isPaused === !0 || this.isLoaded === !1)) {
            var t = this.currentRawFrame + e * this.frameModifier,
              r = !1;
            t >= this.totalFrames - 1 && this.frameModifier > 0
              ? !this.loop || this.playCount === this.loop
                ? this.checkSegments(
                    t > this.totalFrames ? t % this.totalFrames : 0
                  ) || ((r = !0), (t = this.totalFrames - 1))
                : t >= this.totalFrames
                ? ((this.playCount += 1),
                  this.checkSegments(t % this.totalFrames) ||
                    (this.setCurrentRawFrameValue(t % this.totalFrames),
                    (this._completedLoop = !0),
                    this.trigger("loopComplete")))
                : this.setCurrentRawFrameValue(t)
              : t < 0
              ? this.checkSegments(t % this.totalFrames) ||
                (this.loop && !(this.playCount-- <= 0 && this.loop !== !0)
                  ? (this.setCurrentRawFrameValue(
                      this.totalFrames + (t % this.totalFrames)
                    ),
                    this._completedLoop
                      ? this.trigger("loopComplete")
                      : (this._completedLoop = !0))
                  : ((r = !0), (t = 0)))
              : this.setCurrentRawFrameValue(t),
              r &&
                (this.setCurrentRawFrameValue(t),
                this.pause(),
                this.trigger("complete"));
          }
        }),
        (AnimationItem.prototype.adjustSegment = function (e, t) {
          (this.playCount = 0),
            e[1] < e[0]
              ? (this.frameModifier > 0 &&
                  (this.playSpeed < 0
                    ? this.setSpeed(-this.playSpeed)
                    : this.setDirection(-1)),
                (this.totalFrames = e[0] - e[1]),
                (this.timeCompleted = this.totalFrames),
                (this.firstFrame = e[1]),
                this.setCurrentRawFrameValue(this.totalFrames - 0.001 - t))
              : e[1] > e[0] &&
                (this.frameModifier < 0 &&
                  (this.playSpeed < 0
                    ? this.setSpeed(-this.playSpeed)
                    : this.setDirection(1)),
                (this.totalFrames = e[1] - e[0]),
                (this.timeCompleted = this.totalFrames),
                (this.firstFrame = e[0]),
                this.setCurrentRawFrameValue(0.001 + t)),
            this.trigger("segmentStart");
        }),
        (AnimationItem.prototype.setSegment = function (e, t) {
          var r = -1;
          this.isPaused &&
            (this.currentRawFrame + this.firstFrame < e
              ? (r = e)
              : this.currentRawFrame + this.firstFrame > t && (r = t - e)),
            (this.firstFrame = e),
            (this.totalFrames = t - e),
            (this.timeCompleted = this.totalFrames),
            r !== -1 && this.goToAndStop(r, !0);
        }),
        (AnimationItem.prototype.playSegments = function (e, t) {
          if ((t && (this.segments.length = 0), _typeof$4(e[0]) === "object")) {
            var r,
              s = e.length;
            for (r = 0; r < s; r += 1) this.segments.push(e[r]);
          } else this.segments.push(e);
          this.segments.length &&
            t &&
            this.adjustSegment(this.segments.shift(), 0),
            this.isPaused && this.play();
        }),
        (AnimationItem.prototype.resetSegments = function (e) {
          (this.segments.length = 0),
            this.segments.push([this.animationData.ip, this.animationData.op]),
            e && this.checkSegments(0);
        }),
        (AnimationItem.prototype.checkSegments = function (e) {
          return this.segments.length
            ? (this.adjustSegment(this.segments.shift(), e), !0)
            : !1;
        }),
        (AnimationItem.prototype.destroy = function (e) {
          (e && this.name !== e) ||
            !this.renderer ||
            (this.renderer.destroy(),
            this.imagePreloader.destroy(),
            this.trigger("destroy"),
            (this._cbs = null),
            (this.onEnterFrame = null),
            (this.onLoopComplete = null),
            (this.onComplete = null),
            (this.onSegmentStart = null),
            (this.onDestroy = null),
            (this.renderer = null),
            (this.renderer = null),
            (this.imagePreloader = null),
            (this.projectInterface = null));
        }),
        (AnimationItem.prototype.setCurrentRawFrameValue = function (e) {
          (this.currentRawFrame = e), this.gotoFrame();
        }),
        (AnimationItem.prototype.setSpeed = function (e) {
          (this.playSpeed = e), this.updaFrameModifier();
        }),
        (AnimationItem.prototype.setDirection = function (e) {
          (this.playDirection = e < 0 ? -1 : 1), this.updaFrameModifier();
        }),
        (AnimationItem.prototype.setVolume = function (e, t) {
          (t && this.name !== t) || this.audioController.setVolume(e);
        }),
        (AnimationItem.prototype.getVolume = function () {
          return this.audioController.getVolume();
        }),
        (AnimationItem.prototype.mute = function (e) {
          (e && this.name !== e) || this.audioController.mute();
        }),
        (AnimationItem.prototype.unmute = function (e) {
          (e && this.name !== e) || this.audioController.unmute();
        }),
        (AnimationItem.prototype.updaFrameModifier = function () {
          (this.frameModifier =
            this.frameMult * this.playSpeed * this.playDirection),
            this.audioController.setRate(this.playSpeed * this.playDirection);
        }),
        (AnimationItem.prototype.getPath = function () {
          return this.path;
        }),
        (AnimationItem.prototype.getAssetsPath = function (e) {
          var t = "";
          if (e.e) t = e.p;
          else if (this.assetsPath) {
            var r = e.p;
            r.indexOf("images/") !== -1 && (r = r.split("/")[1]),
              (t = this.assetsPath + r);
          } else (t = this.path), (t += e.u ? e.u : ""), (t += e.p);
          return t;
        }),
        (AnimationItem.prototype.getAssetData = function (e) {
          for (var t = 0, r = this.assets.length; t < r; ) {
            if (e === this.assets[t].id) return this.assets[t];
            t += 1;
          }
          return null;
        }),
        (AnimationItem.prototype.hide = function () {
          this.renderer.hide();
        }),
        (AnimationItem.prototype.show = function () {
          this.renderer.show();
        }),
        (AnimationItem.prototype.getDuration = function (e) {
          return e ? this.totalFrames : this.totalFrames / this.frameRate;
        }),
        (AnimationItem.prototype.updateDocumentData = function (e, t, r) {
          try {
            var s = this.renderer.getElementByPath(e);
            s.updateDocumentData(t, r);
          } catch {}
        }),
        (AnimationItem.prototype.trigger = function (e) {
          if (this._cbs && this._cbs[e])
            switch (e) {
              case "enterFrame":
                this.triggerEvent(
                  e,
                  new BMEnterFrameEvent(
                    e,
                    this.currentFrame,
                    this.totalFrames,
                    this.frameModifier
                  )
                );
                break;
              case "drawnFrame":
                (this.drawnFrameEvent.currentTime = this.currentFrame),
                  (this.drawnFrameEvent.totalTime = this.totalFrames),
                  (this.drawnFrameEvent.direction = this.frameModifier),
                  this.triggerEvent(e, this.drawnFrameEvent);
                break;
              case "loopComplete":
                this.triggerEvent(
                  e,
                  new BMCompleteLoopEvent(
                    e,
                    this.loop,
                    this.playCount,
                    this.frameMult
                  )
                );
                break;
              case "complete":
                this.triggerEvent(e, new BMCompleteEvent(e, this.frameMult));
                break;
              case "segmentStart":
                this.triggerEvent(
                  e,
                  new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)
                );
                break;
              case "destroy":
                this.triggerEvent(e, new BMDestroyEvent(e, this));
                break;
              default:
                this.triggerEvent(e);
            }
          e === "enterFrame" &&
            this.onEnterFrame &&
            this.onEnterFrame.call(
              this,
              new BMEnterFrameEvent(
                e,
                this.currentFrame,
                this.totalFrames,
                this.frameMult
              )
            ),
            e === "loopComplete" &&
              this.onLoopComplete &&
              this.onLoopComplete.call(
                this,
                new BMCompleteLoopEvent(
                  e,
                  this.loop,
                  this.playCount,
                  this.frameMult
                )
              ),
            e === "complete" &&
              this.onComplete &&
              this.onComplete.call(
                this,
                new BMCompleteEvent(e, this.frameMult)
              ),
            e === "segmentStart" &&
              this.onSegmentStart &&
              this.onSegmentStart.call(
                this,
                new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)
              ),
            e === "destroy" &&
              this.onDestroy &&
              this.onDestroy.call(this, new BMDestroyEvent(e, this));
        }),
        (AnimationItem.prototype.triggerRenderFrameError = function (e) {
          var t = new BMRenderFrameErrorEvent(e, this.currentFrame);
          this.triggerEvent("error", t),
            this.onError && this.onError.call(this, t);
        }),
        (AnimationItem.prototype.triggerConfigError = function (e) {
          var t = new BMConfigErrorEvent(e, this.currentFrame);
          this.triggerEvent("error", t),
            this.onError && this.onError.call(this, t);
        });
      var animationManager = (function () {
          var e = {},
            t = [],
            r = 0,
            s = 0,
            i = 0,
            n = !0,
            a = !1;
          function o(k) {
            for (var C = 0, P = k.target; C < s; )
              t[C].animation === P &&
                (t.splice(C, 1), (C -= 1), (s -= 1), P.isPaused || S()),
                (C += 1);
          }
          function h(k, C) {
            if (!k) return null;
            for (var P = 0; P < s; ) {
              if (t[P].elem === k && t[P].elem !== null) return t[P].animation;
              P += 1;
            }
            var w = new AnimationItem();
            return u(w, k), w.setData(k, C), w;
          }
          function c() {
            var k,
              C = t.length,
              P = [];
            for (k = 0; k < C; k += 1) P.push(t[k].animation);
            return P;
          }
          function m() {
            (i += 1), L();
          }
          function S() {
            i -= 1;
          }
          function u(k, C) {
            k.addEventListener("destroy", o),
              k.addEventListener("_active", m),
              k.addEventListener("_idle", S),
              t.push({ elem: C, animation: k }),
              (s += 1);
          }
          function v(k) {
            var C = new AnimationItem();
            return u(C, null), C.setParams(k), C;
          }
          function g(k, C) {
            var P;
            for (P = 0; P < s; P += 1) t[P].animation.setSpeed(k, C);
          }
          function y(k, C) {
            var P;
            for (P = 0; P < s; P += 1) t[P].animation.setDirection(k, C);
          }
          function E(k) {
            var C;
            for (C = 0; C < s; C += 1) t[C].animation.play(k);
          }
          function l(k) {
            var C = k - r,
              P;
            for (P = 0; P < s; P += 1) t[P].animation.advanceTime(C);
            (r = k), i && !a ? window.requestAnimationFrame(l) : (n = !0);
          }
          function d(k) {
            (r = k), window.requestAnimationFrame(l);
          }
          function p(k) {
            var C;
            for (C = 0; C < s; C += 1) t[C].animation.pause(k);
          }
          function f(k, C, P) {
            var w;
            for (w = 0; w < s; w += 1) t[w].animation.goToAndStop(k, C, P);
          }
          function b(k) {
            var C;
            for (C = 0; C < s; C += 1) t[C].animation.stop(k);
          }
          function x(k) {
            var C;
            for (C = 0; C < s; C += 1) t[C].animation.togglePause(k);
          }
          function $(k) {
            var C;
            for (C = s - 1; C >= 0; C -= 1) t[C].animation.destroy(k);
          }
          function _(k, C, P) {
            var w = [].concat(
                [].slice.call(document.getElementsByClassName("lottie")),
                [].slice.call(document.getElementsByClassName("bodymovin"))
              ),
              R,
              I = w.length;
            for (R = 0; R < I; R += 1)
              P && w[R].setAttribute("data-bm-type", P), h(w[R], k);
            if (C && I === 0) {
              P || (P = "svg");
              var q = document.getElementsByTagName("body")[0];
              q.innerText = "";
              var N = createTag("div");
              (N.style.width = "100%"),
                (N.style.height = "100%"),
                N.setAttribute("data-bm-type", P),
                q.appendChild(N),
                h(N, k);
            }
          }
          function A() {
            var k;
            for (k = 0; k < s; k += 1) t[k].animation.resize();
          }
          function L() {
            !a && i && n && (window.requestAnimationFrame(d), (n = !1));
          }
          function F() {
            a = !0;
          }
          function M() {
            (a = !1), L();
          }
          function D(k, C) {
            var P;
            for (P = 0; P < s; P += 1) t[P].animation.setVolume(k, C);
          }
          function V(k) {
            var C;
            for (C = 0; C < s; C += 1) t[C].animation.mute(k);
          }
          function T(k) {
            var C;
            for (C = 0; C < s; C += 1) t[C].animation.unmute(k);
          }
          return (
            (e.registerAnimation = h),
            (e.loadAnimation = v),
            (e.setSpeed = g),
            (e.setDirection = y),
            (e.play = E),
            (e.pause = p),
            (e.stop = b),
            (e.togglePause = x),
            (e.searchAnimations = _),
            (e.resize = A),
            (e.goToAndStop = f),
            (e.destroy = $),
            (e.freeze = F),
            (e.unfreeze = M),
            (e.setVolume = D),
            (e.mute = V),
            (e.unmute = T),
            (e.getRegisteredAnimations = c),
            e
          );
        })(),
        BezierFactory = (function () {
          var e = {};
          e.getBezierEasing = r;
          var t = {};
          function r(d, p, f, b, x) {
            var $ =
              x ||
              ("bez_" + d + "_" + p + "_" + f + "_" + b).replace(/\./g, "p");
            if (t[$]) return t[$];
            var _ = new l([d, p, f, b]);
            return (t[$] = _), _;
          }
          var s = 4,
            i = 0.001,
            n = 1e-7,
            a = 10,
            o = 11,
            h = 1 / (o - 1),
            c = typeof Float32Array == "function";
          function m(d, p) {
            return 1 - 3 * p + 3 * d;
          }
          function S(d, p) {
            return 3 * p - 6 * d;
          }
          function u(d) {
            return 3 * d;
          }
          function v(d, p, f) {
            return ((m(p, f) * d + S(p, f)) * d + u(p)) * d;
          }
          function g(d, p, f) {
            return 3 * m(p, f) * d * d + 2 * S(p, f) * d + u(p);
          }
          function y(d, p, f, b, x) {
            var $,
              _,
              A = 0;
            do
              (_ = p + (f - p) / 2),
                ($ = v(_, b, x) - d),
                $ > 0 ? (f = _) : (p = _);
            while (Math.abs($) > n && ++A < a);
            return _;
          }
          function E(d, p, f, b) {
            for (var x = 0; x < s; ++x) {
              var $ = g(p, f, b);
              if ($ === 0) return p;
              var _ = v(p, f, b) - d;
              p -= _ / $;
            }
            return p;
          }
          function l(d) {
            (this._p = d),
              (this._mSampleValues = c ? new Float32Array(o) : new Array(o)),
              (this._precomputed = !1),
              (this.get = this.get.bind(this));
          }
          return (
            (l.prototype = {
              get: function (p) {
                var f = this._p[0],
                  b = this._p[1],
                  x = this._p[2],
                  $ = this._p[3];
                return (
                  this._precomputed || this._precompute(),
                  f === b && x === $
                    ? p
                    : p === 0
                    ? 0
                    : p === 1
                    ? 1
                    : v(this._getTForX(p), b, $)
                );
              },
              _precompute: function () {
                var p = this._p[0],
                  f = this._p[1],
                  b = this._p[2],
                  x = this._p[3];
                (this._precomputed = !0),
                  (p !== f || b !== x) && this._calcSampleValues();
              },
              _calcSampleValues: function () {
                for (var p = this._p[0], f = this._p[2], b = 0; b < o; ++b)
                  this._mSampleValues[b] = v(b * h, p, f);
              },
              _getTForX: function (p) {
                for (
                  var f = this._p[0],
                    b = this._p[2],
                    x = this._mSampleValues,
                    $ = 0,
                    _ = 1,
                    A = o - 1;
                  _ !== A && x[_] <= p;
                  ++_
                )
                  $ += h;
                --_;
                var L = (p - x[_]) / (x[_ + 1] - x[_]),
                  F = $ + L * h,
                  M = g(F, f, b);
                return M >= i
                  ? E(p, F, f, b)
                  : M === 0
                  ? F
                  : y(p, $, $ + h, f, b);
              },
            }),
            e
          );
        })(),
        pooling = (function () {
          function e(t) {
            return t.concat(createSizedArray(t.length));
          }
          return { double: e };
        })(),
        poolFactory = (function () {
          return function (e, t, r) {
            var s = 0,
              i = e,
              n = createSizedArray(i),
              a = { newElement: o, release: h };
            function o() {
              var c;
              return s ? ((s -= 1), (c = n[s])) : (c = t()), c;
            }
            function h(c) {
              s === i && ((n = pooling.double(n)), (i *= 2)),
                r && r(c),
                (n[s] = c),
                (s += 1);
            }
            return a;
          };
        })(),
        bezierLengthPool = (function () {
          function e() {
            return {
              addedLength: 0,
              percents: createTypedArray("float32", getDefaultCurveSegments()),
              lengths: createTypedArray("float32", getDefaultCurveSegments()),
            };
          }
          return poolFactory(8, e);
        })(),
        segmentsLengthPool = (function () {
          function e() {
            return { lengths: [], totalLength: 0 };
          }
          function t(r) {
            var s,
              i = r.lengths.length;
            for (s = 0; s < i; s += 1) bezierLengthPool.release(r.lengths[s]);
            r.lengths.length = 0;
          }
          return poolFactory(8, e, t);
        })();
      function bezFunction() {
        var e = Math;
        function t(u, v, g, y, E, l) {
          var d = u * y + v * E + g * l - E * y - l * u - g * v;
          return d > -0.001 && d < 0.001;
        }
        function r(u, v, g, y, E, l, d, p, f) {
          if (g === 0 && l === 0 && f === 0) return t(u, v, y, E, d, p);
          var b = e.sqrt(e.pow(y - u, 2) + e.pow(E - v, 2) + e.pow(l - g, 2)),
            x = e.sqrt(e.pow(d - u, 2) + e.pow(p - v, 2) + e.pow(f - g, 2)),
            $ = e.sqrt(e.pow(d - y, 2) + e.pow(p - E, 2) + e.pow(f - l, 2)),
            _;
          return (
            b > x
              ? b > $
                ? (_ = b - x - $)
                : (_ = $ - x - b)
              : $ > x
              ? (_ = $ - x - b)
              : (_ = x - b - $),
            _ > -1e-4 && _ < 1e-4
          );
        }
        var s = (function () {
          return function (u, v, g, y) {
            var E = getDefaultCurveSegments(),
              l,
              d,
              p,
              f,
              b,
              x = 0,
              $,
              _ = [],
              A = [],
              L = bezierLengthPool.newElement();
            for (p = g.length, l = 0; l < E; l += 1) {
              for (b = l / (E - 1), $ = 0, d = 0; d < p; d += 1)
                (f =
                  bmPow(1 - b, 3) * u[d] +
                  3 * bmPow(1 - b, 2) * b * g[d] +
                  3 * (1 - b) * bmPow(b, 2) * y[d] +
                  bmPow(b, 3) * v[d]),
                  (_[d] = f),
                  A[d] !== null && ($ += bmPow(_[d] - A[d], 2)),
                  (A[d] = _[d]);
              $ && (($ = bmSqrt($)), (x += $)),
                (L.percents[l] = b),
                (L.lengths[l] = x);
            }
            return (L.addedLength = x), L;
          };
        })();
        function i(u) {
          var v = segmentsLengthPool.newElement(),
            g = u.c,
            y = u.v,
            E = u.o,
            l = u.i,
            d,
            p = u._length,
            f = v.lengths,
            b = 0;
          for (d = 0; d < p - 1; d += 1)
            (f[d] = s(y[d], y[d + 1], E[d], l[d + 1])), (b += f[d].addedLength);
          return (
            g &&
              p &&
              ((f[d] = s(y[d], y[0], E[d], l[0])), (b += f[d].addedLength)),
            (v.totalLength = b),
            v
          );
        }
        function n(u) {
          (this.segmentLength = 0), (this.points = new Array(u));
        }
        function a(u, v) {
          (this.partialLength = u), (this.point = v);
        }
        var o = (function () {
          var u = {};
          return function (v, g, y, E) {
            var l = (
              v[0] +
              "_" +
              v[1] +
              "_" +
              g[0] +
              "_" +
              g[1] +
              "_" +
              y[0] +
              "_" +
              y[1] +
              "_" +
              E[0] +
              "_" +
              E[1]
            ).replace(/\./g, "p");
            if (!u[l]) {
              var d = getDefaultCurveSegments(),
                p,
                f,
                b,
                x,
                $,
                _ = 0,
                A,
                L,
                F = null;
              v.length === 2 &&
                (v[0] !== g[0] || v[1] !== g[1]) &&
                t(v[0], v[1], g[0], g[1], v[0] + y[0], v[1] + y[1]) &&
                t(v[0], v[1], g[0], g[1], g[0] + E[0], g[1] + E[1]) &&
                (d = 2);
              var M = new n(d);
              for (b = y.length, p = 0; p < d; p += 1) {
                for (
                  L = createSizedArray(b), $ = p / (d - 1), A = 0, f = 0;
                  f < b;
                  f += 1
                )
                  (x =
                    bmPow(1 - $, 3) * v[f] +
                    3 * bmPow(1 - $, 2) * $ * (v[f] + y[f]) +
                    3 * (1 - $) * bmPow($, 2) * (g[f] + E[f]) +
                    bmPow($, 3) * g[f]),
                    (L[f] = x),
                    F !== null && (A += bmPow(L[f] - F[f], 2));
                (A = bmSqrt(A)), (_ += A), (M.points[p] = new a(A, L)), (F = L);
              }
              (M.segmentLength = _), (u[l] = M);
            }
            return u[l];
          };
        })();
        function h(u, v) {
          var g = v.percents,
            y = v.lengths,
            E = g.length,
            l = bmFloor((E - 1) * u),
            d = u * v.addedLength,
            p = 0;
          if (l === E - 1 || l === 0 || d === y[l]) return g[l];
          for (var f = y[l] > d ? -1 : 1, b = !0; b; )
            if (
              (y[l] <= d && y[l + 1] > d
                ? ((p = (d - y[l]) / (y[l + 1] - y[l])), (b = !1))
                : (l += f),
              l < 0 || l >= E - 1)
            ) {
              if (l === E - 1) return g[l];
              b = !1;
            }
          return g[l] + (g[l + 1] - g[l]) * p;
        }
        function c(u, v, g, y, E, l) {
          var d = h(E, l),
            p = 1 - d,
            f =
              e.round(
                (p * p * p * u[0] +
                  (d * p * p + p * d * p + p * p * d) * g[0] +
                  (d * d * p + p * d * d + d * p * d) * y[0] +
                  d * d * d * v[0]) *
                  1e3
              ) / 1e3,
            b =
              e.round(
                (p * p * p * u[1] +
                  (d * p * p + p * d * p + p * p * d) * g[1] +
                  (d * d * p + p * d * d + d * p * d) * y[1] +
                  d * d * d * v[1]) *
                  1e3
              ) / 1e3;
          return [f, b];
        }
        var m = createTypedArray("float32", 8);
        function S(u, v, g, y, E, l, d) {
          E < 0 ? (E = 0) : E > 1 && (E = 1);
          var p = h(E, d);
          l = l > 1 ? 1 : l;
          var f = h(l, d),
            b,
            x = u.length,
            $ = 1 - p,
            _ = 1 - f,
            A = $ * $ * $,
            L = p * $ * $ * 3,
            F = p * p * $ * 3,
            M = p * p * p,
            D = $ * $ * _,
            V = p * $ * _ + $ * p * _ + $ * $ * f,
            T = p * p * _ + $ * p * f + p * $ * f,
            k = p * p * f,
            C = $ * _ * _,
            P = p * _ * _ + $ * f * _ + $ * _ * f,
            w = p * f * _ + $ * f * f + p * _ * f,
            R = p * f * f,
            I = _ * _ * _,
            q = f * _ * _ + _ * f * _ + _ * _ * f,
            N = f * f * _ + _ * f * f + f * _ * f,
            O = f * f * f;
          for (b = 0; b < x; b += 1)
            (m[b * 4] =
              e.round((A * u[b] + L * g[b] + F * y[b] + M * v[b]) * 1e3) / 1e3),
              (m[b * 4 + 1] =
                e.round((D * u[b] + V * g[b] + T * y[b] + k * v[b]) * 1e3) /
                1e3),
              (m[b * 4 + 2] =
                e.round((C * u[b] + P * g[b] + w * y[b] + R * v[b]) * 1e3) /
                1e3),
              (m[b * 4 + 3] =
                e.round((I * u[b] + q * g[b] + N * y[b] + O * v[b]) * 1e3) /
                1e3);
          return m;
        }
        return {
          getSegmentsLength: i,
          getNewSegment: S,
          getPointInSegment: c,
          buildBezierData: o,
          pointOnLine2D: t,
          pointOnLine3D: r,
        };
      }
      var bez = bezFunction(),
        PropertyFactory = (function () {
          var e = initialDefaultFrame,
            t = Math.abs;
          function r(E, l) {
            var d = this.offsetTime,
              p;
            this.propType === "multidimensional" &&
              (p = createTypedArray("float32", this.pv.length));
            for (
              var f = l.lastIndex,
                b = f,
                x = this.keyframes.length - 1,
                $ = !0,
                _,
                A,
                L;
              $;

            ) {
              if (
                ((_ = this.keyframes[b]),
                (A = this.keyframes[b + 1]),
                b === x - 1 && E >= A.t - d)
              ) {
                _.h && (_ = A), (f = 0);
                break;
              }
              if (A.t - d > E) {
                f = b;
                break;
              }
              b < x - 1 ? (b += 1) : ((f = 0), ($ = !1));
            }
            L = this.keyframesMetadata[b] || {};
            var F,
              M,
              D,
              V,
              T,
              k,
              C = A.t - d,
              P = _.t - d,
              w;
            if (_.to) {
              L.bezierData ||
                (L.bezierData = bez.buildBezierData(
                  _.s,
                  A.s || _.e,
                  _.to,
                  _.ti
                ));
              var R = L.bezierData;
              if (E >= C || E < P) {
                var I = E >= C ? R.points.length - 1 : 0;
                for (M = R.points[I].point.length, F = 0; F < M; F += 1)
                  p[F] = R.points[I].point[F];
              } else {
                L.__fnct
                  ? (k = L.__fnct)
                  : ((k = BezierFactory.getBezierEasing(
                      _.o.x,
                      _.o.y,
                      _.i.x,
                      _.i.y,
                      _.n
                    ).get),
                    (L.__fnct = k)),
                  (D = k((E - P) / (C - P)));
                var q = R.segmentLength * D,
                  N,
                  O =
                    l.lastFrame < E && l._lastKeyframeIndex === b
                      ? l._lastAddedLength
                      : 0;
                for (
                  T =
                    l.lastFrame < E && l._lastKeyframeIndex === b
                      ? l._lastPoint
                      : 0,
                    $ = !0,
                    V = R.points.length;
                  $;

                ) {
                  if (
                    ((O += R.points[T].partialLength),
                    q === 0 || D === 0 || T === R.points.length - 1)
                  ) {
                    for (M = R.points[T].point.length, F = 0; F < M; F += 1)
                      p[F] = R.points[T].point[F];
                    break;
                  } else if (q >= O && q < O + R.points[T + 1].partialLength) {
                    for (
                      N = (q - O) / R.points[T + 1].partialLength,
                        M = R.points[T].point.length,
                        F = 0;
                      F < M;
                      F += 1
                    )
                      p[F] =
                        R.points[T].point[F] +
                        (R.points[T + 1].point[F] - R.points[T].point[F]) * N;
                    break;
                  }
                  T < V - 1 ? (T += 1) : ($ = !1);
                }
                (l._lastPoint = T),
                  (l._lastAddedLength = O - R.points[T].partialLength),
                  (l._lastKeyframeIndex = b);
              }
            } else {
              var z, B, Q, G, U;
              if (((x = _.s.length), (w = A.s || _.e), this.sh && _.h !== 1))
                if (E >= C) (p[0] = w[0]), (p[1] = w[1]), (p[2] = w[2]);
                else if (E <= P)
                  (p[0] = _.s[0]), (p[1] = _.s[1]), (p[2] = _.s[2]);
                else {
                  var Y = n(_.s),
                    W = n(w),
                    K = (E - P) / (C - P);
                  i(p, s(Y, W, K));
                }
              else
                for (b = 0; b < x; b += 1)
                  _.h !== 1 &&
                    (E >= C
                      ? (D = 1)
                      : E < P
                      ? (D = 0)
                      : (_.o.x.constructor === Array
                          ? (L.__fnct || (L.__fnct = []),
                            L.__fnct[b]
                              ? (k = L.__fnct[b])
                              : ((z =
                                  _.o.x[b] === void 0 ? _.o.x[0] : _.o.x[b]),
                                (B = _.o.y[b] === void 0 ? _.o.y[0] : _.o.y[b]),
                                (Q = _.i.x[b] === void 0 ? _.i.x[0] : _.i.x[b]),
                                (G = _.i.y[b] === void 0 ? _.i.y[0] : _.i.y[b]),
                                (k = BezierFactory.getBezierEasing(
                                  z,
                                  B,
                                  Q,
                                  G
                                ).get),
                                (L.__fnct[b] = k)))
                          : L.__fnct
                          ? (k = L.__fnct)
                          : ((z = _.o.x),
                            (B = _.o.y),
                            (Q = _.i.x),
                            (G = _.i.y),
                            (k = BezierFactory.getBezierEasing(z, B, Q, G).get),
                            (_.keyframeMetadata = k)),
                        (D = k((E - P) / (C - P))))),
                    (w = A.s || _.e),
                    (U = _.h === 1 ? _.s[b] : _.s[b] + (w[b] - _.s[b]) * D),
                    this.propType === "multidimensional" ? (p[b] = U) : (p = U);
            }
            return (l.lastIndex = f), p;
          }
          function s(E, l, d) {
            var p = [],
              f = E[0],
              b = E[1],
              x = E[2],
              $ = E[3],
              _ = l[0],
              A = l[1],
              L = l[2],
              F = l[3],
              M,
              D,
              V,
              T,
              k;
            return (
              (D = f * _ + b * A + x * L + $ * F),
              D < 0 && ((D = -D), (_ = -_), (A = -A), (L = -L), (F = -F)),
              1 - D > 1e-6
                ? ((M = Math.acos(D)),
                  (V = Math.sin(M)),
                  (T = Math.sin((1 - d) * M) / V),
                  (k = Math.sin(d * M) / V))
                : ((T = 1 - d), (k = d)),
              (p[0] = T * f + k * _),
              (p[1] = T * b + k * A),
              (p[2] = T * x + k * L),
              (p[3] = T * $ + k * F),
              p
            );
          }
          function i(E, l) {
            var d = l[0],
              p = l[1],
              f = l[2],
              b = l[3],
              x = Math.atan2(2 * p * b - 2 * d * f, 1 - 2 * p * p - 2 * f * f),
              $ = Math.asin(2 * d * p + 2 * f * b),
              _ = Math.atan2(2 * d * b - 2 * p * f, 1 - 2 * d * d - 2 * f * f);
            (E[0] = x / degToRads),
              (E[1] = $ / degToRads),
              (E[2] = _ / degToRads);
          }
          function n(E) {
            var l = E[0] * degToRads,
              d = E[1] * degToRads,
              p = E[2] * degToRads,
              f = Math.cos(l / 2),
              b = Math.cos(d / 2),
              x = Math.cos(p / 2),
              $ = Math.sin(l / 2),
              _ = Math.sin(d / 2),
              A = Math.sin(p / 2),
              L = f * b * x - $ * _ * A,
              F = $ * _ * x + f * b * A,
              M = $ * b * x + f * _ * A,
              D = f * _ * x - $ * b * A;
            return [F, M, D, L];
          }
          function a() {
            var E = this.comp.renderedFrame - this.offsetTime,
              l = this.keyframes[0].t - this.offsetTime,
              d = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
            if (
              !(
                E === this._caching.lastFrame ||
                (this._caching.lastFrame !== e &&
                  ((this._caching.lastFrame >= d && E >= d) ||
                    (this._caching.lastFrame < l && E < l)))
              )
            ) {
              this._caching.lastFrame >= E &&
                ((this._caching._lastKeyframeIndex = -1),
                (this._caching.lastIndex = 0));
              var p = this.interpolateValue(E, this._caching);
              this.pv = p;
            }
            return (this._caching.lastFrame = E), this.pv;
          }
          function o(E) {
            var l;
            if (this.propType === "unidimensional")
              (l = E * this.mult),
                t(this.v - l) > 1e-5 && ((this.v = l), (this._mdf = !0));
            else
              for (var d = 0, p = this.v.length; d < p; )
                (l = E[d] * this.mult),
                  t(this.v[d] - l) > 1e-5 &&
                    ((this.v[d] = l), (this._mdf = !0)),
                  (d += 1);
          }
          function h() {
            if (
              !(
                this.elem.globalData.frameId === this.frameId ||
                !this.effectsSequence.length
              )
            ) {
              if (this.lock) {
                this.setVValue(this.pv);
                return;
              }
              (this.lock = !0), (this._mdf = this._isFirstFrame);
              var E,
                l = this.effectsSequence.length,
                d = this.kf ? this.pv : this.data.k;
              for (E = 0; E < l; E += 1) d = this.effectsSequence[E](d);
              this.setVValue(d),
                (this._isFirstFrame = !1),
                (this.lock = !1),
                (this.frameId = this.elem.globalData.frameId);
            }
          }
          function c(E) {
            this.effectsSequence.push(E),
              this.container.addDynamicProperty(this);
          }
          function m(E, l, d, p) {
            (this.propType = "unidimensional"),
              (this.mult = d || 1),
              (this.data = l),
              (this.v = d ? l.k * d : l.k),
              (this.pv = l.k),
              (this._mdf = !1),
              (this.elem = E),
              (this.container = p),
              (this.comp = E.comp),
              (this.k = !1),
              (this.kf = !1),
              (this.vel = 0),
              (this.effectsSequence = []),
              (this._isFirstFrame = !0),
              (this.getValue = h),
              (this.setVValue = o),
              (this.addEffect = c);
          }
          function S(E, l, d, p) {
            (this.propType = "multidimensional"),
              (this.mult = d || 1),
              (this.data = l),
              (this._mdf = !1),
              (this.elem = E),
              (this.container = p),
              (this.comp = E.comp),
              (this.k = !1),
              (this.kf = !1),
              (this.frameId = -1);
            var f,
              b = l.k.length;
            for (
              this.v = createTypedArray("float32", b),
                this.pv = createTypedArray("float32", b),
                this.vel = createTypedArray("float32", b),
                f = 0;
              f < b;
              f += 1
            )
              (this.v[f] = l.k[f] * this.mult), (this.pv[f] = l.k[f]);
            (this._isFirstFrame = !0),
              (this.effectsSequence = []),
              (this.getValue = h),
              (this.setVValue = o),
              (this.addEffect = c);
          }
          function u(E, l, d, p) {
            (this.propType = "unidimensional"),
              (this.keyframes = l.k),
              (this.keyframesMetadata = []),
              (this.offsetTime = E.data.st),
              (this.frameId = -1),
              (this._caching = {
                lastFrame: e,
                lastIndex: 0,
                value: 0,
                _lastKeyframeIndex: -1,
              }),
              (this.k = !0),
              (this.kf = !0),
              (this.data = l),
              (this.mult = d || 1),
              (this.elem = E),
              (this.container = p),
              (this.comp = E.comp),
              (this.v = e),
              (this.pv = e),
              (this._isFirstFrame = !0),
              (this.getValue = h),
              (this.setVValue = o),
              (this.interpolateValue = r),
              (this.effectsSequence = [a.bind(this)]),
              (this.addEffect = c);
          }
          function v(E, l, d, p) {
            this.propType = "multidimensional";
            var f,
              b = l.k.length,
              x,
              $,
              _,
              A;
            for (f = 0; f < b - 1; f += 1)
              l.k[f].to &&
                l.k[f].s &&
                l.k[f + 1] &&
                l.k[f + 1].s &&
                ((x = l.k[f].s),
                ($ = l.k[f + 1].s),
                (_ = l.k[f].to),
                (A = l.k[f].ti),
                ((x.length === 2 &&
                  !(x[0] === $[0] && x[1] === $[1]) &&
                  bez.pointOnLine2D(
                    x[0],
                    x[1],
                    $[0],
                    $[1],
                    x[0] + _[0],
                    x[1] + _[1]
                  ) &&
                  bez.pointOnLine2D(
                    x[0],
                    x[1],
                    $[0],
                    $[1],
                    $[0] + A[0],
                    $[1] + A[1]
                  )) ||
                  (x.length === 3 &&
                    !(x[0] === $[0] && x[1] === $[1] && x[2] === $[2]) &&
                    bez.pointOnLine3D(
                      x[0],
                      x[1],
                      x[2],
                      $[0],
                      $[1],
                      $[2],
                      x[0] + _[0],
                      x[1] + _[1],
                      x[2] + _[2]
                    ) &&
                    bez.pointOnLine3D(
                      x[0],
                      x[1],
                      x[2],
                      $[0],
                      $[1],
                      $[2],
                      $[0] + A[0],
                      $[1] + A[1],
                      $[2] + A[2]
                    ))) &&
                  ((l.k[f].to = null), (l.k[f].ti = null)),
                x[0] === $[0] &&
                  x[1] === $[1] &&
                  _[0] === 0 &&
                  _[1] === 0 &&
                  A[0] === 0 &&
                  A[1] === 0 &&
                  (x.length === 2 ||
                    (x[2] === $[2] && _[2] === 0 && A[2] === 0)) &&
                  ((l.k[f].to = null), (l.k[f].ti = null)));
            (this.effectsSequence = [a.bind(this)]),
              (this.data = l),
              (this.keyframes = l.k),
              (this.keyframesMetadata = []),
              (this.offsetTime = E.data.st),
              (this.k = !0),
              (this.kf = !0),
              (this._isFirstFrame = !0),
              (this.mult = d || 1),
              (this.elem = E),
              (this.container = p),
              (this.comp = E.comp),
              (this.getValue = h),
              (this.setVValue = o),
              (this.interpolateValue = r),
              (this.frameId = -1);
            var L = l.k[0].s.length;
            for (
              this.v = createTypedArray("float32", L),
                this.pv = createTypedArray("float32", L),
                f = 0;
              f < L;
              f += 1
            )
              (this.v[f] = e), (this.pv[f] = e);
            (this._caching = {
              lastFrame: e,
              lastIndex: 0,
              value: createTypedArray("float32", L),
            }),
              (this.addEffect = c);
          }
          function g(E, l, d, p, f) {
            var b;
            if (!l.k.length) b = new m(E, l, p, f);
            else if (typeof l.k[0] == "number") b = new S(E, l, p, f);
            else
              switch (d) {
                case 0:
                  b = new u(E, l, p, f);
                  break;
                case 1:
                  b = new v(E, l, p, f);
                  break;
              }
            return b.effectsSequence.length && f.addDynamicProperty(b), b;
          }
          var y = { getProp: g };
          return y;
        })();
      function DynamicPropertyContainer() {}
      DynamicPropertyContainer.prototype = {
        addDynamicProperty: function (t) {
          this.dynamicProperties.indexOf(t) === -1 &&
            (this.dynamicProperties.push(t),
            this.container.addDynamicProperty(this),
            (this._isAnimated = !0));
        },
        iterateDynamicProperties: function () {
          this._mdf = !1;
          var t,
            r = this.dynamicProperties.length;
          for (t = 0; t < r; t += 1)
            this.dynamicProperties[t].getValue(),
              this.dynamicProperties[t]._mdf && (this._mdf = !0);
        },
        initDynamicPropertyContainer: function (t) {
          (this.container = t),
            (this.dynamicProperties = []),
            (this._mdf = !1),
            (this._isAnimated = !1);
        },
      };
      var pointPool = (function () {
        function e() {
          return createTypedArray("float32", 2);
        }
        return poolFactory(8, e);
      })();
      function ShapePath() {
        (this.c = !1),
          (this._length = 0),
          (this._maxLength = 8),
          (this.v = createSizedArray(this._maxLength)),
          (this.o = createSizedArray(this._maxLength)),
          (this.i = createSizedArray(this._maxLength));
      }
      (ShapePath.prototype.setPathData = function (e, t) {
        (this.c = e), this.setLength(t);
        for (var r = 0; r < t; )
          (this.v[r] = pointPool.newElement()),
            (this.o[r] = pointPool.newElement()),
            (this.i[r] = pointPool.newElement()),
            (r += 1);
      }),
        (ShapePath.prototype.setLength = function (e) {
          for (; this._maxLength < e; ) this.doubleArrayLength();
          this._length = e;
        }),
        (ShapePath.prototype.doubleArrayLength = function () {
          (this.v = this.v.concat(createSizedArray(this._maxLength))),
            (this.i = this.i.concat(createSizedArray(this._maxLength))),
            (this.o = this.o.concat(createSizedArray(this._maxLength))),
            (this._maxLength *= 2);
        }),
        (ShapePath.prototype.setXYAt = function (e, t, r, s, i) {
          var n;
          switch (
            ((this._length = Math.max(this._length, s + 1)),
            this._length >= this._maxLength && this.doubleArrayLength(),
            r)
          ) {
            case "v":
              n = this.v;
              break;
            case "i":
              n = this.i;
              break;
            case "o":
              n = this.o;
              break;
            default:
              n = [];
              break;
          }
          (!n[s] || (n[s] && !i)) && (n[s] = pointPool.newElement()),
            (n[s][0] = e),
            (n[s][1] = t);
        }),
        (ShapePath.prototype.setTripleAt = function (e, t, r, s, i, n, a, o) {
          this.setXYAt(e, t, "v", a, o),
            this.setXYAt(r, s, "o", a, o),
            this.setXYAt(i, n, "i", a, o);
        }),
        (ShapePath.prototype.reverse = function () {
          var e = new ShapePath();
          e.setPathData(this.c, this._length);
          var t = this.v,
            r = this.o,
            s = this.i,
            i = 0;
          this.c &&
            (e.setTripleAt(
              t[0][0],
              t[0][1],
              s[0][0],
              s[0][1],
              r[0][0],
              r[0][1],
              0,
              !1
            ),
            (i = 1));
          var n = this._length - 1,
            a = this._length,
            o;
          for (o = i; o < a; o += 1)
            e.setTripleAt(
              t[n][0],
              t[n][1],
              s[n][0],
              s[n][1],
              r[n][0],
              r[n][1],
              o,
              !1
            ),
              (n -= 1);
          return e;
        });
      var shapePool = (function () {
        function e() {
          return new ShapePath();
        }
        function t(i) {
          var n = i._length,
            a;
          for (a = 0; a < n; a += 1)
            pointPool.release(i.v[a]),
              pointPool.release(i.i[a]),
              pointPool.release(i.o[a]),
              (i.v[a] = null),
              (i.i[a] = null),
              (i.o[a] = null);
          (i._length = 0), (i.c = !1);
        }
        function r(i) {
          var n = s.newElement(),
            a,
            o = i._length === void 0 ? i.v.length : i._length;
          for (n.setLength(o), n.c = i.c, a = 0; a < o; a += 1)
            n.setTripleAt(
              i.v[a][0],
              i.v[a][1],
              i.o[a][0],
              i.o[a][1],
              i.i[a][0],
              i.i[a][1],
              a
            );
          return n;
        }
        var s = poolFactory(4, e, t);
        return (s.clone = r), s;
      })();
      function ShapeCollection() {
        (this._length = 0),
          (this._maxLength = 4),
          (this.shapes = createSizedArray(this._maxLength));
      }
      (ShapeCollection.prototype.addShape = function (e) {
        this._length === this._maxLength &&
          ((this.shapes = this.shapes.concat(
            createSizedArray(this._maxLength)
          )),
          (this._maxLength *= 2)),
          (this.shapes[this._length] = e),
          (this._length += 1);
      }),
        (ShapeCollection.prototype.releaseShapes = function () {
          var e;
          for (e = 0; e < this._length; e += 1)
            shapePool.release(this.shapes[e]);
          this._length = 0;
        });
      var shapeCollectionPool = (function () {
          var e = { newShapeCollection: i, release: n },
            t = 0,
            r = 4,
            s = createSizedArray(r);
          function i() {
            var a;
            return t ? ((t -= 1), (a = s[t])) : (a = new ShapeCollection()), a;
          }
          function n(a) {
            var o,
              h = a._length;
            for (o = 0; o < h; o += 1) shapePool.release(a.shapes[o]);
            (a._length = 0),
              t === r && ((s = pooling.double(s)), (r *= 2)),
              (s[t] = a),
              (t += 1);
          }
          return e;
        })(),
        ShapePropertyFactory = (function () {
          var e = -999999;
          function t(l, d, p) {
            var f = p.lastIndex,
              b,
              x,
              $,
              _,
              A,
              L,
              F,
              M,
              D,
              V = this.keyframes;
            if (l < V[0].t - this.offsetTime)
              (b = V[0].s[0]), ($ = !0), (f = 0);
            else if (l >= V[V.length - 1].t - this.offsetTime)
              (b = V[V.length - 1].s
                ? V[V.length - 1].s[0]
                : V[V.length - 2].e[0]),
                ($ = !0);
            else {
              for (
                var T = f, k = V.length - 1, C = !0, P, w, R;
                C && ((P = V[T]), (w = V[T + 1]), !(w.t - this.offsetTime > l));

              )
                T < k - 1 ? (T += 1) : (C = !1);
              if (
                ((R = this.keyframesMetadata[T] || {}),
                ($ = P.h === 1),
                (f = T),
                !$)
              ) {
                if (l >= w.t - this.offsetTime) M = 1;
                else if (l < P.t - this.offsetTime) M = 0;
                else {
                  var I;
                  R.__fnct
                    ? (I = R.__fnct)
                    : ((I = BezierFactory.getBezierEasing(
                        P.o.x,
                        P.o.y,
                        P.i.x,
                        P.i.y
                      ).get),
                      (R.__fnct = I)),
                    (M = I(
                      (l - (P.t - this.offsetTime)) /
                        (w.t - this.offsetTime - (P.t - this.offsetTime))
                    ));
                }
                x = w.s ? w.s[0] : P.e[0];
              }
              b = P.s[0];
            }
            for (
              L = d._length, F = b.i[0].length, p.lastIndex = f, _ = 0;
              _ < L;
              _ += 1
            )
              for (A = 0; A < F; A += 1)
                (D = $ ? b.i[_][A] : b.i[_][A] + (x.i[_][A] - b.i[_][A]) * M),
                  (d.i[_][A] = D),
                  (D = $ ? b.o[_][A] : b.o[_][A] + (x.o[_][A] - b.o[_][A]) * M),
                  (d.o[_][A] = D),
                  (D = $ ? b.v[_][A] : b.v[_][A] + (x.v[_][A] - b.v[_][A]) * M),
                  (d.v[_][A] = D);
          }
          function r() {
            var l = this.comp.renderedFrame - this.offsetTime,
              d = this.keyframes[0].t - this.offsetTime,
              p = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
              f = this._caching.lastFrame;
            return (
              (f !== e && ((f < d && l < d) || (f > p && l > p))) ||
                ((this._caching.lastIndex =
                  f < l ? this._caching.lastIndex : 0),
                this.interpolateShape(l, this.pv, this._caching)),
              (this._caching.lastFrame = l),
              this.pv
            );
          }
          function s() {
            this.paths = this.localShapeCollection;
          }
          function i(l, d) {
            if (l._length !== d._length || l.c !== d.c) return !1;
            var p,
              f = l._length;
            for (p = 0; p < f; p += 1)
              if (
                l.v[p][0] !== d.v[p][0] ||
                l.v[p][1] !== d.v[p][1] ||
                l.o[p][0] !== d.o[p][0] ||
                l.o[p][1] !== d.o[p][1] ||
                l.i[p][0] !== d.i[p][0] ||
                l.i[p][1] !== d.i[p][1]
              )
                return !1;
            return !0;
          }
          function n(l) {
            i(this.v, l) ||
              ((this.v = shapePool.clone(l)),
              this.localShapeCollection.releaseShapes(),
              this.localShapeCollection.addShape(this.v),
              (this._mdf = !0),
              (this.paths = this.localShapeCollection));
          }
          function a() {
            if (this.elem.globalData.frameId !== this.frameId) {
              if (!this.effectsSequence.length) {
                this._mdf = !1;
                return;
              }
              if (this.lock) {
                this.setVValue(this.pv);
                return;
              }
              (this.lock = !0), (this._mdf = !1);
              var l;
              this.kf
                ? (l = this.pv)
                : this.data.ks
                ? (l = this.data.ks.k)
                : (l = this.data.pt.k);
              var d,
                p = this.effectsSequence.length;
              for (d = 0; d < p; d += 1) l = this.effectsSequence[d](l);
              this.setVValue(l),
                (this.lock = !1),
                (this.frameId = this.elem.globalData.frameId);
            }
          }
          function o(l, d, p) {
            (this.propType = "shape"),
              (this.comp = l.comp),
              (this.container = l),
              (this.elem = l),
              (this.data = d),
              (this.k = !1),
              (this.kf = !1),
              (this._mdf = !1);
            var f = p === 3 ? d.pt.k : d.ks.k;
            (this.v = shapePool.clone(f)),
              (this.pv = shapePool.clone(this.v)),
              (this.localShapeCollection =
                shapeCollectionPool.newShapeCollection()),
              (this.paths = this.localShapeCollection),
              this.paths.addShape(this.v),
              (this.reset = s),
              (this.effectsSequence = []);
          }
          function h(l) {
            this.effectsSequence.push(l),
              this.container.addDynamicProperty(this);
          }
          (o.prototype.interpolateShape = t),
            (o.prototype.getValue = a),
            (o.prototype.setVValue = n),
            (o.prototype.addEffect = h);
          function c(l, d, p) {
            (this.propType = "shape"),
              (this.comp = l.comp),
              (this.elem = l),
              (this.container = l),
              (this.offsetTime = l.data.st),
              (this.keyframes = p === 3 ? d.pt.k : d.ks.k),
              (this.keyframesMetadata = []),
              (this.k = !0),
              (this.kf = !0);
            var f = this.keyframes[0].s[0].i.length;
            (this.v = shapePool.newElement()),
              this.v.setPathData(this.keyframes[0].s[0].c, f),
              (this.pv = shapePool.clone(this.v)),
              (this.localShapeCollection =
                shapeCollectionPool.newShapeCollection()),
              (this.paths = this.localShapeCollection),
              this.paths.addShape(this.v),
              (this.lastFrame = e),
              (this.reset = s),
              (this._caching = { lastFrame: e, lastIndex: 0 }),
              (this.effectsSequence = [r.bind(this)]);
          }
          (c.prototype.getValue = a),
            (c.prototype.interpolateShape = t),
            (c.prototype.setVValue = n),
            (c.prototype.addEffect = h);
          var m = (function () {
              var l = roundCorner;
              function d(p, f) {
                (this.v = shapePool.newElement()),
                  this.v.setPathData(!0, 4),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.localShapeCollection.addShape(this.v),
                  (this.d = f.d),
                  (this.elem = p),
                  (this.comp = p.comp),
                  (this.frameId = -1),
                  this.initDynamicPropertyContainer(p),
                  (this.p = PropertyFactory.getProp(p, f.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(p, f.s, 1, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertEllToPath());
              }
              return (
                (d.prototype = {
                  reset: s,
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertEllToPath());
                  },
                  convertEllToPath: function () {
                    var f = this.p.v[0],
                      b = this.p.v[1],
                      x = this.s.v[0] / 2,
                      $ = this.s.v[1] / 2,
                      _ = this.d !== 3,
                      A = this.v;
                    (A.v[0][0] = f),
                      (A.v[0][1] = b - $),
                      (A.v[1][0] = _ ? f + x : f - x),
                      (A.v[1][1] = b),
                      (A.v[2][0] = f),
                      (A.v[2][1] = b + $),
                      (A.v[3][0] = _ ? f - x : f + x),
                      (A.v[3][1] = b),
                      (A.i[0][0] = _ ? f - x * l : f + x * l),
                      (A.i[0][1] = b - $),
                      (A.i[1][0] = _ ? f + x : f - x),
                      (A.i[1][1] = b - $ * l),
                      (A.i[2][0] = _ ? f + x * l : f - x * l),
                      (A.i[2][1] = b + $),
                      (A.i[3][0] = _ ? f - x : f + x),
                      (A.i[3][1] = b + $ * l),
                      (A.o[0][0] = _ ? f + x * l : f - x * l),
                      (A.o[0][1] = b - $),
                      (A.o[1][0] = _ ? f + x : f - x),
                      (A.o[1][1] = b + $ * l),
                      (A.o[2][0] = _ ? f - x * l : f + x * l),
                      (A.o[2][1] = b + $),
                      (A.o[3][0] = _ ? f - x : f + x),
                      (A.o[3][1] = b - $ * l);
                  },
                }),
                extendPrototype([DynamicPropertyContainer], d),
                d
              );
            })(),
            S = (function () {
              function l(d, p) {
                (this.v = shapePool.newElement()),
                  this.v.setPathData(!0, 0),
                  (this.elem = d),
                  (this.comp = d.comp),
                  (this.data = p),
                  (this.frameId = -1),
                  (this.d = p.d),
                  this.initDynamicPropertyContainer(d),
                  p.sy === 1
                    ? ((this.ir = PropertyFactory.getProp(d, p.ir, 0, 0, this)),
                      (this.is = PropertyFactory.getProp(
                        d,
                        p.is,
                        0,
                        0.01,
                        this
                      )),
                      (this.convertToPath = this.convertStarToPath))
                    : (this.convertToPath = this.convertPolygonToPath),
                  (this.pt = PropertyFactory.getProp(d, p.pt, 0, 0, this)),
                  (this.p = PropertyFactory.getProp(d, p.p, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(
                    d,
                    p.r,
                    0,
                    degToRads,
                    this
                  )),
                  (this.or = PropertyFactory.getProp(d, p.or, 0, 0, this)),
                  (this.os = PropertyFactory.getProp(d, p.os, 0, 0.01, this)),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertToPath());
              }
              return (
                (l.prototype = {
                  reset: s,
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertToPath());
                  },
                  convertStarToPath: function () {
                    var p = Math.floor(this.pt.v) * 2,
                      f = (Math.PI * 2) / p,
                      b = !0,
                      x = this.or.v,
                      $ = this.ir.v,
                      _ = this.os.v,
                      A = this.is.v,
                      L = (2 * Math.PI * x) / (p * 2),
                      F = (2 * Math.PI * $) / (p * 2),
                      M,
                      D,
                      V,
                      T,
                      k = -Math.PI / 2;
                    k += this.r.v;
                    var C = this.data.d === 3 ? -1 : 1;
                    for (this.v._length = 0, M = 0; M < p; M += 1) {
                      (D = b ? x : $), (V = b ? _ : A), (T = b ? L : F);
                      var P = D * Math.cos(k),
                        w = D * Math.sin(k),
                        R =
                          P === 0 && w === 0 ? 0 : w / Math.sqrt(P * P + w * w),
                        I =
                          P === 0 && w === 0
                            ? 0
                            : -P / Math.sqrt(P * P + w * w);
                      (P += +this.p.v[0]),
                        (w += +this.p.v[1]),
                        this.v.setTripleAt(
                          P,
                          w,
                          P - R * T * V * C,
                          w - I * T * V * C,
                          P + R * T * V * C,
                          w + I * T * V * C,
                          M,
                          !0
                        ),
                        (b = !b),
                        (k += f * C);
                    }
                  },
                  convertPolygonToPath: function () {
                    var p = Math.floor(this.pt.v),
                      f = (Math.PI * 2) / p,
                      b = this.or.v,
                      x = this.os.v,
                      $ = (2 * Math.PI * b) / (p * 4),
                      _,
                      A = -Math.PI * 0.5,
                      L = this.data.d === 3 ? -1 : 1;
                    for (
                      A += this.r.v, this.v._length = 0, _ = 0;
                      _ < p;
                      _ += 1
                    ) {
                      var F = b * Math.cos(A),
                        M = b * Math.sin(A),
                        D =
                          F === 0 && M === 0 ? 0 : M / Math.sqrt(F * F + M * M),
                        V =
                          F === 0 && M === 0
                            ? 0
                            : -F / Math.sqrt(F * F + M * M);
                      (F += +this.p.v[0]),
                        (M += +this.p.v[1]),
                        this.v.setTripleAt(
                          F,
                          M,
                          F - D * $ * x * L,
                          M - V * $ * x * L,
                          F + D * $ * x * L,
                          M + V * $ * x * L,
                          _,
                          !0
                        ),
                        (A += f * L);
                    }
                    (this.paths.length = 0), (this.paths[0] = this.v);
                  },
                }),
                extendPrototype([DynamicPropertyContainer], l),
                l
              );
            })(),
            u = (function () {
              function l(d, p) {
                (this.v = shapePool.newElement()),
                  (this.v.c = !0),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  (this.elem = d),
                  (this.comp = d.comp),
                  (this.frameId = -1),
                  (this.d = p.d),
                  this.initDynamicPropertyContainer(d),
                  (this.p = PropertyFactory.getProp(d, p.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(d, p.s, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(d, p.r, 0, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertRectToPath());
              }
              return (
                (l.prototype = {
                  convertRectToPath: function () {
                    var p = this.p.v[0],
                      f = this.p.v[1],
                      b = this.s.v[0] / 2,
                      x = this.s.v[1] / 2,
                      $ = bmMin(b, x, this.r.v),
                      _ = $ * (1 - roundCorner);
                    (this.v._length = 0),
                      this.d === 2 || this.d === 1
                        ? (this.v.setTripleAt(
                            p + b,
                            f - x + $,
                            p + b,
                            f - x + $,
                            p + b,
                            f - x + _,
                            0,
                            !0
                          ),
                          this.v.setTripleAt(
                            p + b,
                            f + x - $,
                            p + b,
                            f + x - _,
                            p + b,
                            f + x - $,
                            1,
                            !0
                          ),
                          $ !== 0
                            ? (this.v.setTripleAt(
                                p + b - $,
                                f + x,
                                p + b - $,
                                f + x,
                                p + b - _,
                                f + x,
                                2,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b + $,
                                f + x,
                                p - b + _,
                                f + x,
                                p - b + $,
                                f + x,
                                3,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b,
                                f + x - $,
                                p - b,
                                f + x - $,
                                p - b,
                                f + x - _,
                                4,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b,
                                f - x + $,
                                p - b,
                                f - x + _,
                                p - b,
                                f - x + $,
                                5,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b + $,
                                f - x,
                                p - b + $,
                                f - x,
                                p - b + _,
                                f - x,
                                6,
                                !0
                              ),
                              this.v.setTripleAt(
                                p + b - $,
                                f - x,
                                p + b - _,
                                f - x,
                                p + b - $,
                                f - x,
                                7,
                                !0
                              ))
                            : (this.v.setTripleAt(
                                p - b,
                                f + x,
                                p - b + _,
                                f + x,
                                p - b,
                                f + x,
                                2
                              ),
                              this.v.setTripleAt(
                                p - b,
                                f - x,
                                p - b,
                                f - x + _,
                                p - b,
                                f - x,
                                3
                              )))
                        : (this.v.setTripleAt(
                            p + b,
                            f - x + $,
                            p + b,
                            f - x + _,
                            p + b,
                            f - x + $,
                            0,
                            !0
                          ),
                          $ !== 0
                            ? (this.v.setTripleAt(
                                p + b - $,
                                f - x,
                                p + b - $,
                                f - x,
                                p + b - _,
                                f - x,
                                1,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b + $,
                                f - x,
                                p - b + _,
                                f - x,
                                p - b + $,
                                f - x,
                                2,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b,
                                f - x + $,
                                p - b,
                                f - x + $,
                                p - b,
                                f - x + _,
                                3,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b,
                                f + x - $,
                                p - b,
                                f + x - _,
                                p - b,
                                f + x - $,
                                4,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b + $,
                                f + x,
                                p - b + $,
                                f + x,
                                p - b + _,
                                f + x,
                                5,
                                !0
                              ),
                              this.v.setTripleAt(
                                p + b - $,
                                f + x,
                                p + b - _,
                                f + x,
                                p + b - $,
                                f + x,
                                6,
                                !0
                              ),
                              this.v.setTripleAt(
                                p + b,
                                f + x - $,
                                p + b,
                                f + x - $,
                                p + b,
                                f + x - _,
                                7,
                                !0
                              ))
                            : (this.v.setTripleAt(
                                p - b,
                                f - x,
                                p - b + _,
                                f - x,
                                p - b,
                                f - x,
                                1,
                                !0
                              ),
                              this.v.setTripleAt(
                                p - b,
                                f + x,
                                p - b,
                                f + x - _,
                                p - b,
                                f + x,
                                2,
                                !0
                              ),
                              this.v.setTripleAt(
                                p + b,
                                f + x,
                                p + b - _,
                                f + x,
                                p + b,
                                f + x,
                                3,
                                !0
                              )));
                  },
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertRectToPath());
                  },
                  reset: s,
                }),
                extendPrototype([DynamicPropertyContainer], l),
                l
              );
            })();
          function v(l, d, p) {
            var f;
            if (p === 3 || p === 4) {
              var b = p === 3 ? d.pt : d.ks,
                x = b.k;
              x.length ? (f = new c(l, d, p)) : (f = new o(l, d, p));
            } else
              p === 5
                ? (f = new u(l, d))
                : p === 6
                ? (f = new m(l, d))
                : p === 7 && (f = new S(l, d));
            return f.k && l.addDynamicProperty(f), f;
          }
          function g() {
            return o;
          }
          function y() {
            return c;
          }
          var E = {};
          return (
            (E.getShapeProp = v),
            (E.getConstructorFunction = g),
            (E.getKeyframedConstructorFunction = y),
            E
          );
        })();
      /*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */ var Matrix = (function () {
        var e = Math.cos,
          t = Math.sin,
          r = Math.tan,
          s = Math.round;
        function i() {
          return (
            (this.props[0] = 1),
            (this.props[1] = 0),
            (this.props[2] = 0),
            (this.props[3] = 0),
            (this.props[4] = 0),
            (this.props[5] = 1),
            (this.props[6] = 0),
            (this.props[7] = 0),
            (this.props[8] = 0),
            (this.props[9] = 0),
            (this.props[10] = 1),
            (this.props[11] = 0),
            (this.props[12] = 0),
            (this.props[13] = 0),
            (this.props[14] = 0),
            (this.props[15] = 1),
            this
          );
        }
        function n(C) {
          if (C === 0) return this;
          var P = e(C),
            w = t(C);
          return this._t(P, -w, 0, 0, w, P, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function a(C) {
          if (C === 0) return this;
          var P = e(C),
            w = t(C);
          return this._t(1, 0, 0, 0, 0, P, -w, 0, 0, w, P, 0, 0, 0, 0, 1);
        }
        function o(C) {
          if (C === 0) return this;
          var P = e(C),
            w = t(C);
          return this._t(P, 0, w, 0, 0, 1, 0, 0, -w, 0, P, 0, 0, 0, 0, 1);
        }
        function h(C) {
          if (C === 0) return this;
          var P = e(C),
            w = t(C);
          return this._t(P, -w, 0, 0, w, P, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function c(C, P) {
          return this._t(1, P, C, 1, 0, 0);
        }
        function m(C, P) {
          return this.shear(r(C), r(P));
        }
        function S(C, P) {
          var w = e(P),
            R = t(P);
          return this._t(w, R, 0, 0, -R, w, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(1, 0, 0, 0, r(C), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(w, -R, 0, 0, R, w, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function u(C, P, w) {
          return (
            !w && w !== 0 && (w = 1),
            C === 1 && P === 1 && w === 1
              ? this
              : this._t(C, 0, 0, 0, 0, P, 0, 0, 0, 0, w, 0, 0, 0, 0, 1)
          );
        }
        function v(C, P, w, R, I, q, N, O, z, B, Q, G, U, Y, W, K) {
          return (
            (this.props[0] = C),
            (this.props[1] = P),
            (this.props[2] = w),
            (this.props[3] = R),
            (this.props[4] = I),
            (this.props[5] = q),
            (this.props[6] = N),
            (this.props[7] = O),
            (this.props[8] = z),
            (this.props[9] = B),
            (this.props[10] = Q),
            (this.props[11] = G),
            (this.props[12] = U),
            (this.props[13] = Y),
            (this.props[14] = W),
            (this.props[15] = K),
            this
          );
        }
        function g(C, P, w) {
          return (
            (w = w || 0),
            C !== 0 || P !== 0 || w !== 0
              ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, C, P, w, 1)
              : this
          );
        }
        function y(C, P, w, R, I, q, N, O, z, B, Q, G, U, Y, W, K) {
          var j = this.props;
          if (
            C === 1 &&
            P === 0 &&
            w === 0 &&
            R === 0 &&
            I === 0 &&
            q === 1 &&
            N === 0 &&
            O === 0 &&
            z === 0 &&
            B === 0 &&
            Q === 1 &&
            G === 0
          )
            return (
              (j[12] = j[12] * C + j[15] * U),
              (j[13] = j[13] * q + j[15] * Y),
              (j[14] = j[14] * Q + j[15] * W),
              (j[15] *= K),
              (this._identityCalculated = !1),
              this
            );
          var H = j[0],
            te = j[1],
            ne = j[2],
            re = j[3],
            ee = j[4],
            se = j[5],
            ie = j[6],
            X = j[7],
            ae = j[8],
            oe = j[9],
            J = j[10],
            le = j[11],
            Z = j[12],
            he = j[13],
            ce = j[14],
            fe = j[15];
          return (
            (j[0] = H * C + te * I + ne * z + re * U),
            (j[1] = H * P + te * q + ne * B + re * Y),
            (j[2] = H * w + te * N + ne * Q + re * W),
            (j[3] = H * R + te * O + ne * G + re * K),
            (j[4] = ee * C + se * I + ie * z + X * U),
            (j[5] = ee * P + se * q + ie * B + X * Y),
            (j[6] = ee * w + se * N + ie * Q + X * W),
            (j[7] = ee * R + se * O + ie * G + X * K),
            (j[8] = ae * C + oe * I + J * z + le * U),
            (j[9] = ae * P + oe * q + J * B + le * Y),
            (j[10] = ae * w + oe * N + J * Q + le * W),
            (j[11] = ae * R + oe * O + J * G + le * K),
            (j[12] = Z * C + he * I + ce * z + fe * U),
            (j[13] = Z * P + he * q + ce * B + fe * Y),
            (j[14] = Z * w + he * N + ce * Q + fe * W),
            (j[15] = Z * R + he * O + ce * G + fe * K),
            (this._identityCalculated = !1),
            this
          );
        }
        function E() {
          return (
            this._identityCalculated ||
              ((this._identity = !(
                this.props[0] !== 1 ||
                this.props[1] !== 0 ||
                this.props[2] !== 0 ||
                this.props[3] !== 0 ||
                this.props[4] !== 0 ||
                this.props[5] !== 1 ||
                this.props[6] !== 0 ||
                this.props[7] !== 0 ||
                this.props[8] !== 0 ||
                this.props[9] !== 0 ||
                this.props[10] !== 1 ||
                this.props[11] !== 0 ||
                this.props[12] !== 0 ||
                this.props[13] !== 0 ||
                this.props[14] !== 0 ||
                this.props[15] !== 1
              )),
              (this._identityCalculated = !0)),
            this._identity
          );
        }
        function l(C) {
          for (var P = 0; P < 16; ) {
            if (C.props[P] !== this.props[P]) return !1;
            P += 1;
          }
          return !0;
        }
        function d(C) {
          var P;
          for (P = 0; P < 16; P += 1) C.props[P] = this.props[P];
          return C;
        }
        function p(C) {
          var P;
          for (P = 0; P < 16; P += 1) this.props[P] = C[P];
        }
        function f(C, P, w) {
          return {
            x:
              C * this.props[0] +
              P * this.props[4] +
              w * this.props[8] +
              this.props[12],
            y:
              C * this.props[1] +
              P * this.props[5] +
              w * this.props[9] +
              this.props[13],
            z:
              C * this.props[2] +
              P * this.props[6] +
              w * this.props[10] +
              this.props[14],
          };
        }
        function b(C, P, w) {
          return (
            C * this.props[0] +
            P * this.props[4] +
            w * this.props[8] +
            this.props[12]
          );
        }
        function x(C, P, w) {
          return (
            C * this.props[1] +
            P * this.props[5] +
            w * this.props[9] +
            this.props[13]
          );
        }
        function $(C, P, w) {
          return (
            C * this.props[2] +
            P * this.props[6] +
            w * this.props[10] +
            this.props[14]
          );
        }
        function _() {
          var C = this.props[0] * this.props[5] - this.props[1] * this.props[4],
            P = this.props[5] / C,
            w = -this.props[1] / C,
            R = -this.props[4] / C,
            I = this.props[0] / C,
            q =
              (this.props[4] * this.props[13] -
                this.props[5] * this.props[12]) /
              C,
            N =
              -(
                this.props[0] * this.props[13] -
                this.props[1] * this.props[12]
              ) / C,
            O = new Matrix();
          return (
            (O.props[0] = P),
            (O.props[1] = w),
            (O.props[4] = R),
            (O.props[5] = I),
            (O.props[12] = q),
            (O.props[13] = N),
            O
          );
        }
        function A(C) {
          var P = this.getInverseMatrix();
          return P.applyToPointArray(C[0], C[1], C[2] || 0);
        }
        function L(C) {
          var P,
            w = C.length,
            R = [];
          for (P = 0; P < w; P += 1) R[P] = A(C[P]);
          return R;
        }
        function F(C, P, w) {
          var R = createTypedArray("float32", 6);
          if (this.isIdentity())
            (R[0] = C[0]),
              (R[1] = C[1]),
              (R[2] = P[0]),
              (R[3] = P[1]),
              (R[4] = w[0]),
              (R[5] = w[1]);
          else {
            var I = this.props[0],
              q = this.props[1],
              N = this.props[4],
              O = this.props[5],
              z = this.props[12],
              B = this.props[13];
            (R[0] = C[0] * I + C[1] * N + z),
              (R[1] = C[0] * q + C[1] * O + B),
              (R[2] = P[0] * I + P[1] * N + z),
              (R[3] = P[0] * q + P[1] * O + B),
              (R[4] = w[0] * I + w[1] * N + z),
              (R[5] = w[0] * q + w[1] * O + B);
          }
          return R;
        }
        function M(C, P, w) {
          var R;
          return (
            this.isIdentity()
              ? (R = [C, P, w])
              : (R = [
                  C * this.props[0] +
                    P * this.props[4] +
                    w * this.props[8] +
                    this.props[12],
                  C * this.props[1] +
                    P * this.props[5] +
                    w * this.props[9] +
                    this.props[13],
                  C * this.props[2] +
                    P * this.props[6] +
                    w * this.props[10] +
                    this.props[14],
                ]),
            R
          );
        }
        function D(C, P) {
          if (this.isIdentity()) return C + "," + P;
          var w = this.props;
          return (
            Math.round((C * w[0] + P * w[4] + w[12]) * 100) / 100 +
            "," +
            Math.round((C * w[1] + P * w[5] + w[13]) * 100) / 100
          );
        }
        function V() {
          for (var C = 0, P = this.props, w = "matrix3d(", R = 1e4; C < 16; )
            (w += s(P[C] * R) / R), (w += C === 15 ? ")" : ","), (C += 1);
          return w;
        }
        function T(C) {
          var P = 1e4;
          return (C < 1e-6 && C > 0) || (C > -1e-6 && C < 0) ? s(C * P) / P : C;
        }
        function k() {
          var C = this.props,
            P = T(C[0]),
            w = T(C[1]),
            R = T(C[4]),
            I = T(C[5]),
            q = T(C[12]),
            N = T(C[13]);
          return (
            "matrix(" +
            P +
            "," +
            w +
            "," +
            R +
            "," +
            I +
            "," +
            q +
            "," +
            N +
            ")"
          );
        }
        return function () {
          (this.reset = i),
            (this.rotate = n),
            (this.rotateX = a),
            (this.rotateY = o),
            (this.rotateZ = h),
            (this.skew = m),
            (this.skewFromAxis = S),
            (this.shear = c),
            (this.scale = u),
            (this.setTransform = v),
            (this.translate = g),
            (this.transform = y),
            (this.applyToPoint = f),
            (this.applyToX = b),
            (this.applyToY = x),
            (this.applyToZ = $),
            (this.applyToPointArray = M),
            (this.applyToTriplePoints = F),
            (this.applyToPointStringified = D),
            (this.toCSS = V),
            (this.to2dCSS = k),
            (this.clone = d),
            (this.cloneFromProps = p),
            (this.equals = l),
            (this.inversePoints = L),
            (this.inversePoint = A),
            (this.getInverseMatrix = _),
            (this._t = this.transform),
            (this.isIdentity = E),
            (this._identity = !0),
            (this._identityCalculated = !1),
            (this.props = createTypedArray("float32", 16)),
            this.reset();
        };
      })();
      function _typeof$3(e) {
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$3 = function (r) {
                return typeof r;
              })
            : (_typeof$3 = function (r) {
                return r &&
                  typeof Symbol == "function" &&
                  r.constructor === Symbol &&
                  r !== Symbol.prototype
                  ? "symbol"
                  : typeof r;
              }),
          _typeof$3(e)
        );
      }
      var lottie = {};
      function setLocation(e) {
        setLocationHref(e);
      }
      function searchAnimations() {
        animationManager.searchAnimations();
      }
      function setSubframeRendering(e) {
        setSubframeEnabled(e);
      }
      function setPrefix(e) {
        setIdPrefix(e);
      }
      function loadAnimation(e) {
        return animationManager.loadAnimation(e);
      }
      function setQuality(e) {
        if (typeof e == "string")
          switch (e) {
            case "high":
              setDefaultCurveSegments(200);
              break;
            default:
            case "medium":
              setDefaultCurveSegments(50);
              break;
            case "low":
              setDefaultCurveSegments(10);
              break;
          }
        else !isNaN(e) && e > 1 && setDefaultCurveSegments(e);
      }
      function inBrowser() {
        return typeof navigator < "u";
      }
      function installPlugin(e, t) {
        e === "expressions" && setExpressionsPlugin(t);
      }
      function getFactory(e) {
        switch (e) {
          case "propertyFactory":
            return PropertyFactory;
          case "shapePropertyFactory":
            return ShapePropertyFactory;
          case "matrix":
            return Matrix;
          default:
            return null;
        }
      }
      (lottie.play = animationManager.play),
        (lottie.pause = animationManager.pause),
        (lottie.setLocationHref = setLocation),
        (lottie.togglePause = animationManager.togglePause),
        (lottie.setSpeed = animationManager.setSpeed),
        (lottie.setDirection = animationManager.setDirection),
        (lottie.stop = animationManager.stop),
        (lottie.searchAnimations = searchAnimations),
        (lottie.registerAnimation = animationManager.registerAnimation),
        (lottie.loadAnimation = loadAnimation),
        (lottie.setSubframeRendering = setSubframeRendering),
        (lottie.resize = animationManager.resize),
        (lottie.goToAndStop = animationManager.goToAndStop),
        (lottie.destroy = animationManager.destroy),
        (lottie.setQuality = setQuality),
        (lottie.inBrowser = inBrowser),
        (lottie.installPlugin = installPlugin),
        (lottie.freeze = animationManager.freeze),
        (lottie.unfreeze = animationManager.unfreeze),
        (lottie.setVolume = animationManager.setVolume),
        (lottie.mute = animationManager.mute),
        (lottie.unmute = animationManager.unmute),
        (lottie.getRegisteredAnimations =
          animationManager.getRegisteredAnimations),
        (lottie.useWebWorker = setWebWorker),
        (lottie.setIDPrefix = setPrefix),
        (lottie.__getFactory = getFactory),
        (lottie.version = "5.9.6");
      function checkReady() {
        document.readyState === "complete" &&
          (clearInterval(readyStateCheckInterval), searchAnimations());
      }
      function getQueryVariable(e) {
        for (var t = queryString.split("&"), r = 0; r < t.length; r += 1) {
          var s = t[r].split("=");
          if (decodeURIComponent(s[0]) == e) return decodeURIComponent(s[1]);
        }
        return null;
      }
      var queryString = "";
      {
        var scripts = document.getElementsByTagName("script"),
          index = scripts.length - 1,
          myScript = scripts[index] || { src: "" };
        (queryString = myScript.src
          ? myScript.src.replace(/^[^\?]+\??/, "")
          : ""),
          getQueryVariable("renderer");
      }
      var readyStateCheckInterval = setInterval(checkReady, 100);
      try {
        _typeof$3(exports) !== "object" && (window.bodymovin = lottie);
      } catch (e) {}
      var ShapeModifiers = (function () {
        var e = {},
          t = {};
        (e.registerModifier = r), (e.getModifier = s);
        function r(i, n) {
          t[i] || (t[i] = n);
        }
        function s(i, n, a) {
          return new t[i](n, a);
        }
        return e;
      })();
      function ShapeModifier() {}
      (ShapeModifier.prototype.initModifierProperties = function () {}),
        (ShapeModifier.prototype.addShapeToModifier = function () {}),
        (ShapeModifier.prototype.addShape = function (e) {
          if (!this.closed) {
            e.sh.container.addDynamicProperty(e.sh);
            var t = {
              shape: e.sh,
              data: e,
              localShapeCollection: shapeCollectionPool.newShapeCollection(),
            };
            this.shapes.push(t),
              this.addShapeToModifier(t),
              this._isAnimated && e.setAsAnimated();
          }
        }),
        (ShapeModifier.prototype.init = function (e, t) {
          (this.shapes = []),
            (this.elem = e),
            this.initDynamicPropertyContainer(e),
            this.initModifierProperties(e, t),
            (this.frameId = initialDefaultFrame),
            (this.closed = !1),
            (this.k = !1),
            this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
        }),
        (ShapeModifier.prototype.processKeys = function () {
          this.elem.globalData.frameId !== this.frameId &&
            ((this.frameId = this.elem.globalData.frameId),
            this.iterateDynamicProperties());
        }),
        extendPrototype([DynamicPropertyContainer], ShapeModifier);
      function TrimModifier() {}
      extendPrototype([ShapeModifier], TrimModifier),
        (TrimModifier.prototype.initModifierProperties = function (e, t) {
          (this.s = PropertyFactory.getProp(e, t.s, 0, 0.01, this)),
            (this.e = PropertyFactory.getProp(e, t.e, 0, 0.01, this)),
            (this.o = PropertyFactory.getProp(e, t.o, 0, 0, this)),
            (this.sValue = 0),
            (this.eValue = 0),
            (this.getValue = this.processKeys),
            (this.m = t.m),
            (this._isAnimated =
              !!this.s.effectsSequence.length ||
              !!this.e.effectsSequence.length ||
              !!this.o.effectsSequence.length);
        }),
        (TrimModifier.prototype.addShapeToModifier = function (e) {
          e.pathsData = [];
        }),
        (TrimModifier.prototype.calculateShapeEdges = function (e, t, r, s, i) {
          var n = [];
          t <= 1
            ? n.push({ s: e, e: t })
            : e >= 1
            ? n.push({ s: e - 1, e: t - 1 })
            : (n.push({ s: e, e: 1 }), n.push({ s: 0, e: t - 1 }));
          var a = [],
            o,
            h = n.length,
            c;
          for (o = 0; o < h; o += 1)
            if (((c = n[o]), !(c.e * i < s || c.s * i > s + r))) {
              var m, S;
              c.s * i <= s ? (m = 0) : (m = (c.s * i - s) / r),
                c.e * i >= s + r ? (S = 1) : (S = (c.e * i - s) / r),
                a.push([m, S]);
            }
          return a.length || a.push([0, 0]), a;
        }),
        (TrimModifier.prototype.releasePathsData = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1) segmentsLengthPool.release(e[t]);
          return (e.length = 0), e;
        }),
        (TrimModifier.prototype.processShapes = function (e) {
          var t, r;
          if (this._mdf || e) {
            var s = (this.o.v % 360) / 360;
            if (
              (s < 0 && (s += 1),
              this.s.v > 1
                ? (t = 1 + s)
                : this.s.v < 0
                ? (t = 0 + s)
                : (t = this.s.v + s),
              this.e.v > 1
                ? (r = 1 + s)
                : this.e.v < 0
                ? (r = 0 + s)
                : (r = this.e.v + s),
              t > r)
            ) {
              var i = t;
              (t = r), (r = i);
            }
            (t = Math.round(t * 1e4) * 1e-4),
              (r = Math.round(r * 1e4) * 1e-4),
              (this.sValue = t),
              (this.eValue = r);
          } else (t = this.sValue), (r = this.eValue);
          var n,
            a,
            o = this.shapes.length,
            h,
            c,
            m,
            S,
            u,
            v = 0;
          if (r === t)
            for (a = 0; a < o; a += 1)
              this.shapes[a].localShapeCollection.releaseShapes(),
                (this.shapes[a].shape._mdf = !0),
                (this.shapes[a].shape.paths =
                  this.shapes[a].localShapeCollection),
                this._mdf && (this.shapes[a].pathsData.length = 0);
          else if ((r === 1 && t === 0) || (r === 0 && t === 1)) {
            if (this._mdf)
              for (a = 0; a < o; a += 1)
                (this.shapes[a].pathsData.length = 0),
                  (this.shapes[a].shape._mdf = !0);
          } else {
            var g = [],
              y,
              E;
            for (a = 0; a < o; a += 1)
              if (
                ((y = this.shapes[a]),
                !y.shape._mdf && !this._mdf && !e && this.m !== 2)
              )
                y.shape.paths = y.localShapeCollection;
              else {
                if (
                  ((n = y.shape.paths),
                  (c = n._length),
                  (u = 0),
                  !y.shape._mdf && y.pathsData.length)
                )
                  u = y.totalShapeLength;
                else {
                  for (
                    m = this.releasePathsData(y.pathsData), h = 0;
                    h < c;
                    h += 1
                  )
                    (S = bez.getSegmentsLength(n.shapes[h])),
                      m.push(S),
                      (u += S.totalLength);
                  (y.totalShapeLength = u), (y.pathsData = m);
                }
                (v += u), (y.shape._mdf = !0);
              }
            var l = t,
              d = r,
              p = 0,
              f;
            for (a = o - 1; a >= 0; a -= 1)
              if (((y = this.shapes[a]), y.shape._mdf)) {
                for (
                  E = y.localShapeCollection,
                    E.releaseShapes(),
                    this.m === 2 && o > 1
                      ? ((f = this.calculateShapeEdges(
                          t,
                          r,
                          y.totalShapeLength,
                          p,
                          v
                        )),
                        (p += y.totalShapeLength))
                      : (f = [[l, d]]),
                    c = f.length,
                    h = 0;
                  h < c;
                  h += 1
                ) {
                  (l = f[h][0]),
                    (d = f[h][1]),
                    (g.length = 0),
                    d <= 1
                      ? g.push({
                          s: y.totalShapeLength * l,
                          e: y.totalShapeLength * d,
                        })
                      : l >= 1
                      ? g.push({
                          s: y.totalShapeLength * (l - 1),
                          e: y.totalShapeLength * (d - 1),
                        })
                      : (g.push({
                          s: y.totalShapeLength * l,
                          e: y.totalShapeLength,
                        }),
                        g.push({ s: 0, e: y.totalShapeLength * (d - 1) }));
                  var b = this.addShapes(y, g[0]);
                  if (g[0].s !== g[0].e) {
                    if (g.length > 1) {
                      var x = y.shape.paths.shapes[y.shape.paths._length - 1];
                      if (x.c) {
                        var $ = b.pop();
                        this.addPaths(b, E), (b = this.addShapes(y, g[1], $));
                      } else this.addPaths(b, E), (b = this.addShapes(y, g[1]));
                    }
                    this.addPaths(b, E);
                  }
                }
                y.shape.paths = E;
              }
          }
        }),
        (TrimModifier.prototype.addPaths = function (e, t) {
          var r,
            s = e.length;
          for (r = 0; r < s; r += 1) t.addShape(e[r]);
        }),
        (TrimModifier.prototype.addSegment = function (e, t, r, s, i, n, a) {
          i.setXYAt(t[0], t[1], "o", n),
            i.setXYAt(r[0], r[1], "i", n + 1),
            a && i.setXYAt(e[0], e[1], "v", n),
            i.setXYAt(s[0], s[1], "v", n + 1);
        }),
        (TrimModifier.prototype.addSegmentFromArray = function (e, t, r, s) {
          t.setXYAt(e[1], e[5], "o", r),
            t.setXYAt(e[2], e[6], "i", r + 1),
            s && t.setXYAt(e[0], e[4], "v", r),
            t.setXYAt(e[3], e[7], "v", r + 1);
        }),
        (TrimModifier.prototype.addShapes = function (e, t, r) {
          var s = e.pathsData,
            i = e.shape.paths.shapes,
            n,
            a = e.shape.paths._length,
            o,
            h,
            c = 0,
            m,
            S,
            u,
            v,
            g = [],
            y,
            E = !0;
          for (
            r
              ? ((S = r._length), (y = r._length))
              : ((r = shapePool.newElement()), (S = 0), (y = 0)),
              g.push(r),
              n = 0;
            n < a;
            n += 1
          ) {
            for (
              u = s[n].lengths,
                r.c = i[n].c,
                h = i[n].c ? u.length : u.length + 1,
                o = 1;
              o < h;
              o += 1
            )
              if (((m = u[o - 1]), c + m.addedLength < t.s))
                (c += m.addedLength), (r.c = !1);
              else if (c > t.e) {
                r.c = !1;
                break;
              } else
                t.s <= c && t.e >= c + m.addedLength
                  ? (this.addSegment(
                      i[n].v[o - 1],
                      i[n].o[o - 1],
                      i[n].i[o],
                      i[n].v[o],
                      r,
                      S,
                      E
                    ),
                    (E = !1))
                  : ((v = bez.getNewSegment(
                      i[n].v[o - 1],
                      i[n].v[o],
                      i[n].o[o - 1],
                      i[n].i[o],
                      (t.s - c) / m.addedLength,
                      (t.e - c) / m.addedLength,
                      u[o - 1]
                    )),
                    this.addSegmentFromArray(v, r, S, E),
                    (E = !1),
                    (r.c = !1)),
                  (c += m.addedLength),
                  (S += 1);
            if (i[n].c && u.length) {
              if (((m = u[o - 1]), c <= t.e)) {
                var l = u[o - 1].addedLength;
                t.s <= c && t.e >= c + l
                  ? (this.addSegment(
                      i[n].v[o - 1],
                      i[n].o[o - 1],
                      i[n].i[0],
                      i[n].v[0],
                      r,
                      S,
                      E
                    ),
                    (E = !1))
                  : ((v = bez.getNewSegment(
                      i[n].v[o - 1],
                      i[n].v[0],
                      i[n].o[o - 1],
                      i[n].i[0],
                      (t.s - c) / l,
                      (t.e - c) / l,
                      u[o - 1]
                    )),
                    this.addSegmentFromArray(v, r, S, E),
                    (E = !1),
                    (r.c = !1));
              } else r.c = !1;
              (c += m.addedLength), (S += 1);
            }
            if (
              (r._length &&
                (r.setXYAt(r.v[y][0], r.v[y][1], "i", y),
                r.setXYAt(
                  r.v[r._length - 1][0],
                  r.v[r._length - 1][1],
                  "o",
                  r._length - 1
                )),
              c > t.e)
            )
              break;
            n < a - 1 &&
              ((r = shapePool.newElement()), (E = !0), g.push(r), (S = 0));
          }
          return g;
        });
      function PuckerAndBloatModifier() {}
      extendPrototype([ShapeModifier], PuckerAndBloatModifier),
        (PuckerAndBloatModifier.prototype.initModifierProperties = function (
          e,
          t
        ) {
          (this.getValue = this.processKeys),
            (this.amount = PropertyFactory.getProp(e, t.a, 0, null, this)),
            (this._isAnimated = !!this.amount.effectsSequence.length);
        }),
        (PuckerAndBloatModifier.prototype.processPath = function (e, t) {
          var r = t / 100,
            s = [0, 0],
            i = e._length,
            n = 0;
          for (n = 0; n < i; n += 1) (s[0] += e.v[n][0]), (s[1] += e.v[n][1]);
          (s[0] /= i), (s[1] /= i);
          var a = shapePool.newElement();
          a.c = e.c;
          var o, h, c, m, S, u;
          for (n = 0; n < i; n += 1)
            (o = e.v[n][0] + (s[0] - e.v[n][0]) * r),
              (h = e.v[n][1] + (s[1] - e.v[n][1]) * r),
              (c = e.o[n][0] + (s[0] - e.o[n][0]) * -r),
              (m = e.o[n][1] + (s[1] - e.o[n][1]) * -r),
              (S = e.i[n][0] + (s[0] - e.i[n][0]) * -r),
              (u = e.i[n][1] + (s[1] - e.i[n][1]) * -r),
              a.setTripleAt(o, h, c, m, S, u, n);
          return a;
        }),
        (PuckerAndBloatModifier.prototype.processShapes = function (e) {
          var t,
            r,
            s = this.shapes.length,
            i,
            n,
            a = this.amount.v;
          if (a !== 0) {
            var o, h;
            for (r = 0; r < s; r += 1) {
              if (
                ((o = this.shapes[r]),
                (h = o.localShapeCollection),
                !(!o.shape._mdf && !this._mdf && !e))
              )
                for (
                  h.releaseShapes(),
                    o.shape._mdf = !0,
                    t = o.shape.paths.shapes,
                    n = o.shape.paths._length,
                    i = 0;
                  i < n;
                  i += 1
                )
                  h.addShape(this.processPath(t[i], a));
              o.shape.paths = o.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        });
      var TransformPropertyFactory = (function () {
        var e = [0, 0];
        function t(h) {
          var c = this._mdf;
          this.iterateDynamicProperties(),
            (this._mdf = this._mdf || c),
            this.a && h.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
            this.s && h.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
            this.sk && h.skewFromAxis(-this.sk.v, this.sa.v),
            this.r
              ? h.rotate(-this.r.v)
              : h
                  .rotateZ(-this.rz.v)
                  .rotateY(this.ry.v)
                  .rotateX(this.rx.v)
                  .rotateZ(-this.or.v[2])
                  .rotateY(this.or.v[1])
                  .rotateX(this.or.v[0]),
            this.data.p.s
              ? this.data.p.z
                ? h.translate(this.px.v, this.py.v, -this.pz.v)
                : h.translate(this.px.v, this.py.v, 0)
              : h.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
        }
        function r(h) {
          if (this.elem.globalData.frameId !== this.frameId) {
            if (
              (this._isDirty &&
                (this.precalculateMatrix(), (this._isDirty = !1)),
              this.iterateDynamicProperties(),
              this._mdf || h)
            ) {
              var c;
              if (
                (this.v.cloneFromProps(this.pre.props),
                this.appliedTransformations < 1 &&
                  this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                this.appliedTransformations < 2 &&
                  this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                this.sk &&
                  this.appliedTransformations < 3 &&
                  this.v.skewFromAxis(-this.sk.v, this.sa.v),
                this.r && this.appliedTransformations < 4
                  ? this.v.rotate(-this.r.v)
                  : !this.r &&
                    this.appliedTransformations < 4 &&
                    this.v
                      .rotateZ(-this.rz.v)
                      .rotateY(this.ry.v)
                      .rotateX(this.rx.v)
                      .rotateZ(-this.or.v[2])
                      .rotateY(this.or.v[1])
                      .rotateX(this.or.v[0]),
                this.autoOriented)
              ) {
                var m, S;
                if (
                  ((c = this.elem.globalData.frameRate),
                  this.p && this.p.keyframes && this.p.getValueAtTime)
                )
                  this.p._caching.lastFrame + this.p.offsetTime <=
                  this.p.keyframes[0].t
                    ? ((m = this.p.getValueAtTime(
                        (this.p.keyframes[0].t + 0.01) / c,
                        0
                      )),
                      (S = this.p.getValueAtTime(this.p.keyframes[0].t / c, 0)))
                    : this.p._caching.lastFrame + this.p.offsetTime >=
                      this.p.keyframes[this.p.keyframes.length - 1].t
                    ? ((m = this.p.getValueAtTime(
                        this.p.keyframes[this.p.keyframes.length - 1].t / c,
                        0
                      )),
                      (S = this.p.getValueAtTime(
                        (this.p.keyframes[this.p.keyframes.length - 1].t -
                          0.05) /
                          c,
                        0
                      )))
                    : ((m = this.p.pv),
                      (S = this.p.getValueAtTime(
                        (this.p._caching.lastFrame + this.p.offsetTime - 0.01) /
                          c,
                        this.p.offsetTime
                      )));
                else if (
                  this.px &&
                  this.px.keyframes &&
                  this.py.keyframes &&
                  this.px.getValueAtTime &&
                  this.py.getValueAtTime
                ) {
                  (m = []), (S = []);
                  var u = this.px,
                    v = this.py;
                  u._caching.lastFrame + u.offsetTime <= u.keyframes[0].t
                    ? ((m[0] = u.getValueAtTime(
                        (u.keyframes[0].t + 0.01) / c,
                        0
                      )),
                      (m[1] = v.getValueAtTime(
                        (v.keyframes[0].t + 0.01) / c,
                        0
                      )),
                      (S[0] = u.getValueAtTime(u.keyframes[0].t / c, 0)),
                      (S[1] = v.getValueAtTime(v.keyframes[0].t / c, 0)))
                    : u._caching.lastFrame + u.offsetTime >=
                      u.keyframes[u.keyframes.length - 1].t
                    ? ((m[0] = u.getValueAtTime(
                        u.keyframes[u.keyframes.length - 1].t / c,
                        0
                      )),
                      (m[1] = v.getValueAtTime(
                        v.keyframes[v.keyframes.length - 1].t / c,
                        0
                      )),
                      (S[0] = u.getValueAtTime(
                        (u.keyframes[u.keyframes.length - 1].t - 0.01) / c,
                        0
                      )),
                      (S[1] = v.getValueAtTime(
                        (v.keyframes[v.keyframes.length - 1].t - 0.01) / c,
                        0
                      )))
                    : ((m = [u.pv, v.pv]),
                      (S[0] = u.getValueAtTime(
                        (u._caching.lastFrame + u.offsetTime - 0.01) / c,
                        u.offsetTime
                      )),
                      (S[1] = v.getValueAtTime(
                        (v._caching.lastFrame + v.offsetTime - 0.01) / c,
                        v.offsetTime
                      )));
                } else (S = e), (m = S);
                this.v.rotate(-Math.atan2(m[1] - S[1], m[0] - S[0]));
              }
              this.data.p && this.data.p.s
                ? this.data.p.z
                  ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                  : this.v.translate(this.px.v, this.py.v, 0)
                : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
            }
            this.frameId = this.elem.globalData.frameId;
          }
        }
        function s() {
          if (!this.a.k)
            this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
              (this.appliedTransformations = 1);
          else return;
          if (!this.s.effectsSequence.length)
            this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
              (this.appliedTransformations = 2);
          else return;
          if (this.sk)
            if (
              !this.sk.effectsSequence.length &&
              !this.sa.effectsSequence.length
            )
              this.pre.skewFromAxis(-this.sk.v, this.sa.v),
                (this.appliedTransformations = 3);
            else return;
          this.r
            ? this.r.effectsSequence.length ||
              (this.pre.rotate(-this.r.v), (this.appliedTransformations = 4))
            : !this.rz.effectsSequence.length &&
              !this.ry.effectsSequence.length &&
              !this.rx.effectsSequence.length &&
              !this.or.effectsSequence.length &&
              (this.pre
                .rotateZ(-this.rz.v)
                .rotateY(this.ry.v)
                .rotateX(this.rx.v)
                .rotateZ(-this.or.v[2])
                .rotateY(this.or.v[1])
                .rotateX(this.or.v[0]),
              (this.appliedTransformations = 4));
        }
        function i() {}
        function n(h) {
          this._addDynamicProperty(h),
            this.elem.addDynamicProperty(h),
            (this._isDirty = !0);
        }
        function a(h, c, m) {
          if (
            ((this.elem = h),
            (this.frameId = -1),
            (this.propType = "transform"),
            (this.data = c),
            (this.v = new Matrix()),
            (this.pre = new Matrix()),
            (this.appliedTransformations = 0),
            this.initDynamicPropertyContainer(m || h),
            c.p && c.p.s
              ? ((this.px = PropertyFactory.getProp(h, c.p.x, 0, 0, this)),
                (this.py = PropertyFactory.getProp(h, c.p.y, 0, 0, this)),
                c.p.z &&
                  (this.pz = PropertyFactory.getProp(h, c.p.z, 0, 0, this)))
              : (this.p = PropertyFactory.getProp(
                  h,
                  c.p || { k: [0, 0, 0] },
                  1,
                  0,
                  this
                )),
            c.rx)
          ) {
            if (
              ((this.rx = PropertyFactory.getProp(h, c.rx, 0, degToRads, this)),
              (this.ry = PropertyFactory.getProp(h, c.ry, 0, degToRads, this)),
              (this.rz = PropertyFactory.getProp(h, c.rz, 0, degToRads, this)),
              c.or.k[0].ti)
            ) {
              var S,
                u = c.or.k.length;
              for (S = 0; S < u; S += 1)
                (c.or.k[S].to = null), (c.or.k[S].ti = null);
            }
            (this.or = PropertyFactory.getProp(h, c.or, 1, degToRads, this)),
              (this.or.sh = !0);
          } else
            this.r = PropertyFactory.getProp(
              h,
              c.r || { k: 0 },
              0,
              degToRads,
              this
            );
          c.sk &&
            ((this.sk = PropertyFactory.getProp(h, c.sk, 0, degToRads, this)),
            (this.sa = PropertyFactory.getProp(h, c.sa, 0, degToRads, this))),
            (this.a = PropertyFactory.getProp(
              h,
              c.a || { k: [0, 0, 0] },
              1,
              0,
              this
            )),
            (this.s = PropertyFactory.getProp(
              h,
              c.s || { k: [100, 100, 100] },
              1,
              0.01,
              this
            )),
            c.o
              ? (this.o = PropertyFactory.getProp(h, c.o, 0, 0.01, h))
              : (this.o = { _mdf: !1, v: 1 }),
            (this._isDirty = !0),
            this.dynamicProperties.length || this.getValue(!0);
        }
        (a.prototype = {
          applyToMatrix: t,
          getValue: r,
          precalculateMatrix: s,
          autoOrient: i,
        }),
          extendPrototype([DynamicPropertyContainer], a),
          (a.prototype.addDynamicProperty = n),
          (a.prototype._addDynamicProperty =
            DynamicPropertyContainer.prototype.addDynamicProperty);
        function o(h, c, m) {
          return new a(h, c, m);
        }
        return { getTransformProperty: o };
      })();
      function RepeaterModifier() {}
      extendPrototype([ShapeModifier], RepeaterModifier),
        (RepeaterModifier.prototype.initModifierProperties = function (e, t) {
          (this.getValue = this.processKeys),
            (this.c = PropertyFactory.getProp(e, t.c, 0, null, this)),
            (this.o = PropertyFactory.getProp(e, t.o, 0, null, this)),
            (this.tr = TransformPropertyFactory.getTransformProperty(
              e,
              t.tr,
              this
            )),
            (this.so = PropertyFactory.getProp(e, t.tr.so, 0, 0.01, this)),
            (this.eo = PropertyFactory.getProp(e, t.tr.eo, 0, 0.01, this)),
            (this.data = t),
            this.dynamicProperties.length || this.getValue(!0),
            (this._isAnimated = !!this.dynamicProperties.length),
            (this.pMatrix = new Matrix()),
            (this.rMatrix = new Matrix()),
            (this.sMatrix = new Matrix()),
            (this.tMatrix = new Matrix()),
            (this.matrix = new Matrix());
        }),
        (RepeaterModifier.prototype.applyTransforms = function (
          e,
          t,
          r,
          s,
          i,
          n
        ) {
          var a = n ? -1 : 1,
            o = s.s.v[0] + (1 - s.s.v[0]) * (1 - i),
            h = s.s.v[1] + (1 - s.s.v[1]) * (1 - i);
          e.translate(s.p.v[0] * a * i, s.p.v[1] * a * i, s.p.v[2]),
            t.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]),
            t.rotate(-s.r.v * a * i),
            t.translate(s.a.v[0], s.a.v[1], s.a.v[2]),
            r.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]),
            r.scale(n ? 1 / o : o, n ? 1 / h : h),
            r.translate(s.a.v[0], s.a.v[1], s.a.v[2]);
        }),
        (RepeaterModifier.prototype.init = function (e, t, r, s) {
          for (
            this.elem = e,
              this.arr = t,
              this.pos = r,
              this.elemsData = s,
              this._currentCopies = 0,
              this._elements = [],
              this._groups = [],
              this.frameId = -1,
              this.initDynamicPropertyContainer(e),
              this.initModifierProperties(e, t[r]);
            r > 0;

          )
            (r -= 1), this._elements.unshift(t[r]);
          this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
        }),
        (RepeaterModifier.prototype.resetElements = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1)
            (e[t]._processed = !1),
              e[t].ty === "gr" && this.resetElements(e[t].it);
        }),
        (RepeaterModifier.prototype.cloneElements = function (e) {
          var t = JSON.parse(JSON.stringify(e));
          return this.resetElements(t), t;
        }),
        (RepeaterModifier.prototype.changeGroupRender = function (e, t) {
          var r,
            s = e.length;
          for (r = 0; r < s; r += 1)
            (e[r]._render = t),
              e[r].ty === "gr" && this.changeGroupRender(e[r].it, t);
        }),
        (RepeaterModifier.prototype.processShapes = function (e) {
          var t,
            r,
            s,
            i,
            n,
            a = !1;
          if (this._mdf || e) {
            var o = Math.ceil(this.c.v);
            if (this._groups.length < o) {
              for (; this._groups.length < o; ) {
                var h = { it: this.cloneElements(this._elements), ty: "gr" };
                h.it.push({
                  a: { a: 0, ix: 1, k: [0, 0] },
                  nm: "Transform",
                  o: { a: 0, ix: 7, k: 100 },
                  p: { a: 0, ix: 2, k: [0, 0] },
                  r: {
                    a: 1,
                    ix: 6,
                    k: [
                      { s: 0, e: 0, t: 0 },
                      { s: 0, e: 0, t: 1 },
                    ],
                  },
                  s: { a: 0, ix: 3, k: [100, 100] },
                  sa: { a: 0, ix: 5, k: 0 },
                  sk: { a: 0, ix: 4, k: 0 },
                  ty: "tr",
                }),
                  this.arr.splice(0, 0, h),
                  this._groups.splice(0, 0, h),
                  (this._currentCopies += 1);
              }
              this.elem.reloadShapes(), (a = !0);
            }
            n = 0;
            var c;
            for (s = 0; s <= this._groups.length - 1; s += 1) {
              if (
                ((c = n < o),
                (this._groups[s]._render = c),
                this.changeGroupRender(this._groups[s].it, c),
                !c)
              ) {
                var m = this.elemsData[s].it,
                  S = m[m.length - 1];
                S.transform.op.v !== 0
                  ? ((S.transform.op._mdf = !0), (S.transform.op.v = 0))
                  : (S.transform.op._mdf = !1);
              }
              n += 1;
            }
            this._currentCopies = o;
            var u = this.o.v,
              v = u % 1,
              g = u > 0 ? Math.floor(u) : Math.ceil(u),
              y = this.pMatrix.props,
              E = this.rMatrix.props,
              l = this.sMatrix.props;
            this.pMatrix.reset(),
              this.rMatrix.reset(),
              this.sMatrix.reset(),
              this.tMatrix.reset(),
              this.matrix.reset();
            var d = 0;
            if (u > 0) {
              for (; d < g; )
                this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !1
                ),
                  (d += 1);
              v &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  v,
                  !1
                ),
                (d += v));
            } else if (u < 0) {
              for (; d > g; )
                this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !0
                ),
                  (d -= 1);
              v &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  -v,
                  !0
                ),
                (d -= v));
            }
            (s = this.data.m === 1 ? 0 : this._currentCopies - 1),
              (i = this.data.m === 1 ? 1 : -1),
              (n = this._currentCopies);
            for (var p, f; n; ) {
              if (
                ((t = this.elemsData[s].it),
                (r = t[t.length - 1].transform.mProps.v.props),
                (f = r.length),
                (t[t.length - 1].transform.mProps._mdf = !0),
                (t[t.length - 1].transform.op._mdf = !0),
                (t[t.length - 1].transform.op.v =
                  this._currentCopies === 1
                    ? this.so.v
                    : this.so.v +
                      (this.eo.v - this.so.v) *
                        (s / (this._currentCopies - 1))),
                d !== 0)
              ) {
                for (
                  ((s !== 0 && i === 1) ||
                    (s !== this._currentCopies - 1 && i === -1)) &&
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !1
                    ),
                    this.matrix.transform(
                      E[0],
                      E[1],
                      E[2],
                      E[3],
                      E[4],
                      E[5],
                      E[6],
                      E[7],
                      E[8],
                      E[9],
                      E[10],
                      E[11],
                      E[12],
                      E[13],
                      E[14],
                      E[15]
                    ),
                    this.matrix.transform(
                      l[0],
                      l[1],
                      l[2],
                      l[3],
                      l[4],
                      l[5],
                      l[6],
                      l[7],
                      l[8],
                      l[9],
                      l[10],
                      l[11],
                      l[12],
                      l[13],
                      l[14],
                      l[15]
                    ),
                    this.matrix.transform(
                      y[0],
                      y[1],
                      y[2],
                      y[3],
                      y[4],
                      y[5],
                      y[6],
                      y[7],
                      y[8],
                      y[9],
                      y[10],
                      y[11],
                      y[12],
                      y[13],
                      y[14],
                      y[15]
                    ),
                    p = 0;
                  p < f;
                  p += 1
                )
                  r[p] = this.matrix.props[p];
                this.matrix.reset();
              } else
                for (this.matrix.reset(), p = 0; p < f; p += 1)
                  r[p] = this.matrix.props[p];
              (d += 1), (n -= 1), (s += i);
            }
          } else
            for (n = this._currentCopies, s = 0, i = 1; n; )
              (t = this.elemsData[s].it),
                (r = t[t.length - 1].transform.mProps.v.props),
                (t[t.length - 1].transform.mProps._mdf = !1),
                (t[t.length - 1].transform.op._mdf = !1),
                (n -= 1),
                (s += i);
          return a;
        }),
        (RepeaterModifier.prototype.addShape = function () {});
      function RoundCornersModifier() {}
      extendPrototype([ShapeModifier], RoundCornersModifier),
        (RoundCornersModifier.prototype.initModifierProperties = function (
          e,
          t
        ) {
          (this.getValue = this.processKeys),
            (this.rd = PropertyFactory.getProp(e, t.r, 0, null, this)),
            (this._isAnimated = !!this.rd.effectsSequence.length);
        }),
        (RoundCornersModifier.prototype.processPath = function (e, t) {
          var r = shapePool.newElement();
          r.c = e.c;
          var s,
            i = e._length,
            n,
            a,
            o,
            h,
            c,
            m,
            S = 0,
            u,
            v,
            g,
            y,
            E,
            l;
          for (s = 0; s < i; s += 1)
            (n = e.v[s]),
              (o = e.o[s]),
              (a = e.i[s]),
              n[0] === o[0] && n[1] === o[1] && n[0] === a[0] && n[1] === a[1]
                ? (s === 0 || s === i - 1) && !e.c
                  ? (r.setTripleAt(n[0], n[1], o[0], o[1], a[0], a[1], S),
                    (S += 1))
                  : (s === 0 ? (h = e.v[i - 1]) : (h = e.v[s - 1]),
                    (c = Math.sqrt(
                      Math.pow(n[0] - h[0], 2) + Math.pow(n[1] - h[1], 2)
                    )),
                    (m = c ? Math.min(c / 2, t) / c : 0),
                    (E = n[0] + (h[0] - n[0]) * m),
                    (u = E),
                    (l = n[1] - (n[1] - h[1]) * m),
                    (v = l),
                    (g = u - (u - n[0]) * roundCorner),
                    (y = v - (v - n[1]) * roundCorner),
                    r.setTripleAt(u, v, g, y, E, l, S),
                    (S += 1),
                    s === i - 1 ? (h = e.v[0]) : (h = e.v[s + 1]),
                    (c = Math.sqrt(
                      Math.pow(n[0] - h[0], 2) + Math.pow(n[1] - h[1], 2)
                    )),
                    (m = c ? Math.min(c / 2, t) / c : 0),
                    (g = n[0] + (h[0] - n[0]) * m),
                    (u = g),
                    (y = n[1] + (h[1] - n[1]) * m),
                    (v = y),
                    (E = u - (u - n[0]) * roundCorner),
                    (l = v - (v - n[1]) * roundCorner),
                    r.setTripleAt(u, v, g, y, E, l, S),
                    (S += 1))
                : (r.setTripleAt(
                    e.v[s][0],
                    e.v[s][1],
                    e.o[s][0],
                    e.o[s][1],
                    e.i[s][0],
                    e.i[s][1],
                    S
                  ),
                  (S += 1));
          return r;
        }),
        (RoundCornersModifier.prototype.processShapes = function (e) {
          var t,
            r,
            s = this.shapes.length,
            i,
            n,
            a = this.rd.v;
          if (a !== 0) {
            var o, h;
            for (r = 0; r < s; r += 1) {
              if (
                ((o = this.shapes[r]),
                (h = o.localShapeCollection),
                !(!o.shape._mdf && !this._mdf && !e))
              )
                for (
                  h.releaseShapes(),
                    o.shape._mdf = !0,
                    t = o.shape.paths.shapes,
                    n = o.shape.paths._length,
                    i = 0;
                  i < n;
                  i += 1
                )
                  h.addShape(this.processPath(t[i], a));
              o.shape.paths = o.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        });
      function getFontProperties(e) {
        for (
          var t = e.fStyle ? e.fStyle.split(" ") : [],
            r = "normal",
            s = "normal",
            i = t.length,
            n,
            a = 0;
          a < i;
          a += 1
        )
          switch (((n = t[a].toLowerCase()), n)) {
            case "italic":
              s = "italic";
              break;
            case "bold":
              r = "700";
              break;
            case "black":
              r = "900";
              break;
            case "medium":
              r = "500";
              break;
            case "regular":
            case "normal":
              r = "400";
              break;
            case "light":
            case "thin":
              r = "200";
              break;
          }
        return { style: s, weight: e.fWeight || r };
      }
      var FontManager = (function () {
        var e = 5e3,
          t = { w: 0, size: 0, shapes: [], data: { shapes: [] } },
          r = [];
        r = r.concat([
          2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368,
          2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379,
          2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403,
        ]);
        var s = ["d83cdffb", "d83cdffc", "d83cdffd", "d83cdffe", "d83cdfff"],
          i = [65039, 8205];
        function n(f) {
          var b = f.split(","),
            x,
            $ = b.length,
            _ = [];
          for (x = 0; x < $; x += 1)
            b[x] !== "sans-serif" && b[x] !== "monospace" && _.push(b[x]);
          return _.join(",");
        }
        function a(f, b) {
          var x = createTag("span");
          x.setAttribute("aria-hidden", !0), (x.style.fontFamily = b);
          var $ = createTag("span");
          ($.innerText = "giItT1WQy@!-/#"),
            (x.style.position = "absolute"),
            (x.style.left = "-10000px"),
            (x.style.top = "-10000px"),
            (x.style.fontSize = "300px"),
            (x.style.fontVariant = "normal"),
            (x.style.fontStyle = "normal"),
            (x.style.fontWeight = "normal"),
            (x.style.letterSpacing = "0"),
            x.appendChild($),
            document.body.appendChild(x);
          var _ = $.offsetWidth;
          return (
            ($.style.fontFamily = n(f) + ", " + b), { node: $, w: _, parent: x }
          );
        }
        function o() {
          var f,
            b = this.fonts.length,
            x,
            $,
            _ = b;
          for (f = 0; f < b; f += 1)
            this.fonts[f].loaded
              ? (_ -= 1)
              : this.fonts[f].fOrigin === "n" || this.fonts[f].origin === 0
              ? (this.fonts[f].loaded = !0)
              : ((x = this.fonts[f].monoCase.node),
                ($ = this.fonts[f].monoCase.w),
                x.offsetWidth !== $
                  ? ((_ -= 1), (this.fonts[f].loaded = !0))
                  : ((x = this.fonts[f].sansCase.node),
                    ($ = this.fonts[f].sansCase.w),
                    x.offsetWidth !== $ &&
                      ((_ -= 1), (this.fonts[f].loaded = !0))),
                this.fonts[f].loaded &&
                  (this.fonts[f].sansCase.parent.parentNode.removeChild(
                    this.fonts[f].sansCase.parent
                  ),
                  this.fonts[f].monoCase.parent.parentNode.removeChild(
                    this.fonts[f].monoCase.parent
                  )));
          _ !== 0 && Date.now() - this.initTime < e
            ? setTimeout(this.checkLoadedFontsBinded, 20)
            : setTimeout(this.setIsLoadedBinded, 10);
        }
        function h(f, b) {
          var x = document.body && b ? "svg" : "canvas",
            $,
            _ = getFontProperties(f);
          if (x === "svg") {
            var A = createNS("text");
            (A.style.fontSize = "100px"),
              A.setAttribute("font-family", f.fFamily),
              A.setAttribute("font-style", _.style),
              A.setAttribute("font-weight", _.weight),
              (A.textContent = "1"),
              f.fClass
                ? ((A.style.fontFamily = "inherit"),
                  A.setAttribute("class", f.fClass))
                : (A.style.fontFamily = f.fFamily),
              b.appendChild(A),
              ($ = A);
          } else {
            var L = new OffscreenCanvas(500, 500).getContext("2d");
            (L.font = _.style + " " + _.weight + " 100px " + f.fFamily),
              ($ = L);
          }
          function F(M) {
            return x === "svg"
              ? (($.textContent = M), $.getComputedTextLength())
              : $.measureText(M).width;
          }
          return { measureText: F };
        }
        function c(f, b) {
          if (!f) {
            this.isLoaded = !0;
            return;
          }
          if (this.chars) {
            (this.isLoaded = !0), (this.fonts = f.list);
            return;
          }
          if (!document.body) {
            (this.isLoaded = !0),
              f.list.forEach(function (k) {
                (k.helper = h(k)), (k.cache = {});
              }),
              (this.fonts = f.list);
            return;
          }
          var x = f.list,
            $,
            _ = x.length,
            A = _;
          for ($ = 0; $ < _; $ += 1) {
            var L = !0,
              F,
              M;
            if (
              ((x[$].loaded = !1),
              (x[$].monoCase = a(x[$].fFamily, "monospace")),
              (x[$].sansCase = a(x[$].fFamily, "sans-serif")),
              !x[$].fPath)
            )
              (x[$].loaded = !0), (A -= 1);
            else if (x[$].fOrigin === "p" || x[$].origin === 3) {
              if (
                ((F = document.querySelectorAll(
                  'style[f-forigin="p"][f-family="' +
                    x[$].fFamily +
                    '"], style[f-origin="3"][f-family="' +
                    x[$].fFamily +
                    '"]'
                )),
                F.length > 0 && (L = !1),
                L)
              ) {
                var D = createTag("style");
                D.setAttribute("f-forigin", x[$].fOrigin),
                  D.setAttribute("f-origin", x[$].origin),
                  D.setAttribute("f-family", x[$].fFamily),
                  (D.type = "text/css"),
                  (D.innerText =
                    "@font-face {font-family: " +
                    x[$].fFamily +
                    "; font-style: normal; src: url('" +
                    x[$].fPath +
                    "');}"),
                  b.appendChild(D);
              }
            } else if (x[$].fOrigin === "g" || x[$].origin === 1) {
              for (
                F = document.querySelectorAll(
                  'link[f-forigin="g"], link[f-origin="1"]'
                ),
                  M = 0;
                M < F.length;
                M += 1
              )
                F[M].href.indexOf(x[$].fPath) !== -1 && (L = !1);
              if (L) {
                var V = createTag("link");
                V.setAttribute("f-forigin", x[$].fOrigin),
                  V.setAttribute("f-origin", x[$].origin),
                  (V.type = "text/css"),
                  (V.rel = "stylesheet"),
                  (V.href = x[$].fPath),
                  document.body.appendChild(V);
              }
            } else if (x[$].fOrigin === "t" || x[$].origin === 2) {
              for (
                F = document.querySelectorAll(
                  'script[f-forigin="t"], script[f-origin="2"]'
                ),
                  M = 0;
                M < F.length;
                M += 1
              )
                x[$].fPath === F[M].src && (L = !1);
              if (L) {
                var T = createTag("link");
                T.setAttribute("f-forigin", x[$].fOrigin),
                  T.setAttribute("f-origin", x[$].origin),
                  T.setAttribute("rel", "stylesheet"),
                  T.setAttribute("href", x[$].fPath),
                  b.appendChild(T);
              }
            }
            (x[$].helper = h(x[$], b)),
              (x[$].cache = {}),
              this.fonts.push(x[$]);
          }
          A === 0
            ? (this.isLoaded = !0)
            : setTimeout(this.checkLoadedFonts.bind(this), 100);
        }
        function m(f) {
          if (!!f) {
            this.chars || (this.chars = []);
            var b,
              x = f.length,
              $,
              _ = this.chars.length,
              A;
            for (b = 0; b < x; b += 1) {
              for ($ = 0, A = !1; $ < _; )
                this.chars[$].style === f[b].style &&
                  this.chars[$].fFamily === f[b].fFamily &&
                  this.chars[$].ch === f[b].ch &&
                  (A = !0),
                  ($ += 1);
              A || (this.chars.push(f[b]), (_ += 1));
            }
          }
        }
        function S(f, b, x) {
          for (var $ = 0, _ = this.chars.length; $ < _; ) {
            if (
              this.chars[$].ch === f &&
              this.chars[$].style === b &&
              this.chars[$].fFamily === x
            )
              return this.chars[$];
            $ += 1;
          }
          return (
            ((typeof f == "string" && f.charCodeAt(0) !== 13) || !f) &&
              console &&
              console.warn &&
              !this._warned &&
              ((this._warned = !0),
              console.warn(
                "Missing character from exported characters list: ",
                f,
                b,
                x
              )),
            t
          );
        }
        function u(f, b, x) {
          var $ = this.getFontByName(b),
            _ = f.charCodeAt(0);
          if (!$.cache[_ + 1]) {
            var A = $.helper;
            if (f === " ") {
              var L = A.measureText("|" + f + "|"),
                F = A.measureText("||");
              $.cache[_ + 1] = (L - F) / 100;
            } else $.cache[_ + 1] = A.measureText(f) / 100;
          }
          return $.cache[_ + 1] * x;
        }
        function v(f) {
          for (var b = 0, x = this.fonts.length; b < x; ) {
            if (this.fonts[b].fName === f) return this.fonts[b];
            b += 1;
          }
          return this.fonts[0];
        }
        function g(f, b) {
          var x = f.toString(16) + b.toString(16);
          return s.indexOf(x) !== -1;
        }
        function y(f, b) {
          return b ? f === i[0] && b === i[1] : f === i[1];
        }
        function E(f) {
          return r.indexOf(f) !== -1;
        }
        function l() {
          this.isLoaded = !0;
        }
        var d = function () {
          (this.fonts = []),
            (this.chars = null),
            (this.typekitLoaded = 0),
            (this.isLoaded = !1),
            (this._warned = !1),
            (this.initTime = Date.now()),
            (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
            (this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this));
        };
        (d.isModifier = g),
          (d.isZeroWidthJoiner = y),
          (d.isCombinedCharacter = E);
        var p = {
          addChars: m,
          addFonts: c,
          getCharData: S,
          getFontByName: v,
          measureText: u,
          checkLoadedFonts: o,
          setIsLoaded: l,
        };
        return (d.prototype = p), d;
      })();
      function RenderableElement() {}
      RenderableElement.prototype = {
        initRenderable: function () {
          (this.isInRange = !1),
            (this.hidden = !1),
            (this.isTransparent = !1),
            (this.renderableComponents = []);
        },
        addRenderableComponent: function (t) {
          this.renderableComponents.indexOf(t) === -1 &&
            this.renderableComponents.push(t);
        },
        removeRenderableComponent: function (t) {
          this.renderableComponents.indexOf(t) !== -1 &&
            this.renderableComponents.splice(
              this.renderableComponents.indexOf(t),
              1
            );
        },
        prepareRenderableFrame: function (t) {
          this.checkLayerLimits(t);
        },
        checkTransparency: function () {
          this.finalTransform.mProp.o.v <= 0
            ? !this.isTransparent &&
              this.globalData.renderConfig.hideOnTransparent &&
              ((this.isTransparent = !0), this.hide())
            : this.isTransparent && ((this.isTransparent = !1), this.show());
        },
        checkLayerLimits: function (t) {
          this.data.ip - this.data.st <= t && this.data.op - this.data.st > t
            ? this.isInRange !== !0 &&
              ((this.globalData._mdf = !0),
              (this._mdf = !0),
              (this.isInRange = !0),
              this.show())
            : this.isInRange !== !1 &&
              ((this.globalData._mdf = !0), (this.isInRange = !1), this.hide());
        },
        renderRenderable: function () {
          var t,
            r = this.renderableComponents.length;
          for (t = 0; t < r; t += 1)
            this.renderableComponents[t].renderFrame(this._isFirstFrame);
        },
        sourceRectAtTime: function () {
          return { top: 0, left: 0, width: 100, height: 100 };
        },
        getLayerSize: function () {
          return this.data.ty === 5
            ? { w: this.data.textData.width, h: this.data.textData.height }
            : { w: this.data.width, h: this.data.height };
        },
      };
      var MaskManagerInterface = (function () {
          function e(r, s) {
            (this._mask = r), (this._data = s);
          }
          Object.defineProperty(e.prototype, "maskPath", {
            get: function () {
              return (
                this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop
              );
            },
          }),
            Object.defineProperty(e.prototype, "maskOpacity", {
              get: function () {
                return (
                  this._mask.op.k && this._mask.op.getValue(),
                  this._mask.op.v * 100
                );
              },
            });
          var t = function (s) {
            var i = createSizedArray(s.viewData.length),
              n,
              a = s.viewData.length;
            for (n = 0; n < a; n += 1)
              i[n] = new e(s.viewData[n], s.masksProperties[n]);
            var o = function (c) {
              for (n = 0; n < a; ) {
                if (s.masksProperties[n].nm === c) return i[n];
                n += 1;
              }
              return null;
            };
            return o;
          };
          return t;
        })(),
        ExpressionPropertyInterface = (function () {
          var e = { pv: 0, v: 0, mult: 1 },
            t = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
          function r(a, o, h) {
            Object.defineProperty(a, "velocity", {
              get: function () {
                return o.getVelocityAtTime(o.comp.currentFrame);
              },
            }),
              (a.numKeys = o.keyframes ? o.keyframes.length : 0),
              (a.key = function (c) {
                if (!a.numKeys) return 0;
                var m = "";
                "s" in o.keyframes[c - 1]
                  ? (m = o.keyframes[c - 1].s)
                  : "e" in o.keyframes[c - 2]
                  ? (m = o.keyframes[c - 2].e)
                  : (m = o.keyframes[c - 2].s);
                var S =
                  h === "unidimensional" ? new Number(m) : Object.assign({}, m);
                return (
                  (S.time =
                    o.keyframes[c - 1].t / o.elem.comp.globalData.frameRate),
                  (S.value = h === "unidimensional" ? m[0] : m),
                  S
                );
              }),
              (a.valueAtTime = o.getValueAtTime),
              (a.speedAtTime = o.getSpeedAtTime),
              (a.velocityAtTime = o.getVelocityAtTime),
              (a.propertyGroup = o.propertyGroup);
          }
          function s(a) {
            (!a || !("pv" in a)) && (a = e);
            var o = 1 / a.mult,
              h = a.pv * o,
              c = new Number(h);
            return (
              (c.value = h),
              r(c, a, "unidimensional"),
              function () {
                return (
                  a.k && a.getValue(),
                  (h = a.v * o),
                  c.value !== h &&
                    ((c = new Number(h)),
                    (c.value = h),
                    r(c, a, "unidimensional")),
                  c
                );
              }
            );
          }
          function i(a) {
            (!a || !("pv" in a)) && (a = t);
            var o = 1 / a.mult,
              h = (a.data && a.data.l) || a.pv.length,
              c = createTypedArray("float32", h),
              m = createTypedArray("float32", h);
            return (
              (c.value = m),
              r(c, a, "multidimensional"),
              function () {
                a.k && a.getValue();
                for (var S = 0; S < h; S += 1)
                  (m[S] = a.v[S] * o), (c[S] = m[S]);
                return c;
              }
            );
          }
          function n() {
            return e;
          }
          return function (a) {
            return a ? (a.propType === "unidimensional" ? s(a) : i(a)) : n;
          };
        })(),
        TransformExpressionInterface = (function () {
          return function (e) {
            function t(a) {
              switch (a) {
                case "scale":
                case "Scale":
                case "ADBE Scale":
                case 6:
                  return t.scale;
                case "rotation":
                case "Rotation":
                case "ADBE Rotation":
                case "ADBE Rotate Z":
                case 10:
                  return t.rotation;
                case "ADBE Rotate X":
                  return t.xRotation;
                case "ADBE Rotate Y":
                  return t.yRotation;
                case "position":
                case "Position":
                case "ADBE Position":
                case 2:
                  return t.position;
                case "ADBE Position_0":
                  return t.xPosition;
                case "ADBE Position_1":
                  return t.yPosition;
                case "ADBE Position_2":
                  return t.zPosition;
                case "anchorPoint":
                case "AnchorPoint":
                case "Anchor Point":
                case "ADBE AnchorPoint":
                case 1:
                  return t.anchorPoint;
                case "opacity":
                case "Opacity":
                case 11:
                  return t.opacity;
                default:
                  return null;
              }
            }
            Object.defineProperty(t, "rotation", {
              get: ExpressionPropertyInterface(e.r || e.rz),
            }),
              Object.defineProperty(t, "zRotation", {
                get: ExpressionPropertyInterface(e.rz || e.r),
              }),
              Object.defineProperty(t, "xRotation", {
                get: ExpressionPropertyInterface(e.rx),
              }),
              Object.defineProperty(t, "yRotation", {
                get: ExpressionPropertyInterface(e.ry),
              }),
              Object.defineProperty(t, "scale", {
                get: ExpressionPropertyInterface(e.s),
              });
            var r, s, i, n;
            return (
              e.p
                ? (n = ExpressionPropertyInterface(e.p))
                : ((r = ExpressionPropertyInterface(e.px)),
                  (s = ExpressionPropertyInterface(e.py)),
                  e.pz && (i = ExpressionPropertyInterface(e.pz))),
              Object.defineProperty(t, "position", {
                get: function () {
                  return e.p ? n() : [r(), s(), i ? i() : 0];
                },
              }),
              Object.defineProperty(t, "xPosition", {
                get: ExpressionPropertyInterface(e.px),
              }),
              Object.defineProperty(t, "yPosition", {
                get: ExpressionPropertyInterface(e.py),
              }),
              Object.defineProperty(t, "zPosition", {
                get: ExpressionPropertyInterface(e.pz),
              }),
              Object.defineProperty(t, "anchorPoint", {
                get: ExpressionPropertyInterface(e.a),
              }),
              Object.defineProperty(t, "opacity", {
                get: ExpressionPropertyInterface(e.o),
              }),
              Object.defineProperty(t, "skew", {
                get: ExpressionPropertyInterface(e.sk),
              }),
              Object.defineProperty(t, "skewAxis", {
                get: ExpressionPropertyInterface(e.sa),
              }),
              Object.defineProperty(t, "orientation", {
                get: ExpressionPropertyInterface(e.or),
              }),
              t
            );
          };
        })(),
        LayerExpressionInterface = (function () {
          function e(c) {
            var m = new Matrix();
            if (c !== void 0) {
              var S = this._elem.finalTransform.mProp.getValueAtTime(c);
              S.clone(m);
            } else {
              var u = this._elem.finalTransform.mProp;
              u.applyToMatrix(m);
            }
            return m;
          }
          function t(c, m) {
            var S = this.getMatrix(m);
            return (
              (S.props[12] = 0),
              (S.props[13] = 0),
              (S.props[14] = 0),
              this.applyPoint(S, c)
            );
          }
          function r(c, m) {
            var S = this.getMatrix(m);
            return this.applyPoint(S, c);
          }
          function s(c, m) {
            var S = this.getMatrix(m);
            return (
              (S.props[12] = 0),
              (S.props[13] = 0),
              (S.props[14] = 0),
              this.invertPoint(S, c)
            );
          }
          function i(c, m) {
            var S = this.getMatrix(m);
            return this.invertPoint(S, c);
          }
          function n(c, m) {
            if (this._elem.hierarchy && this._elem.hierarchy.length) {
              var S,
                u = this._elem.hierarchy.length;
              for (S = 0; S < u; S += 1)
                this._elem.hierarchy[S].finalTransform.mProp.applyToMatrix(c);
            }
            return c.applyToPointArray(m[0], m[1], m[2] || 0);
          }
          function a(c, m) {
            if (this._elem.hierarchy && this._elem.hierarchy.length) {
              var S,
                u = this._elem.hierarchy.length;
              for (S = 0; S < u; S += 1)
                this._elem.hierarchy[S].finalTransform.mProp.applyToMatrix(c);
            }
            return c.inversePoint(m);
          }
          function o(c) {
            var m = new Matrix();
            if (
              (m.reset(),
              this._elem.finalTransform.mProp.applyToMatrix(m),
              this._elem.hierarchy && this._elem.hierarchy.length)
            ) {
              var S,
                u = this._elem.hierarchy.length;
              for (S = 0; S < u; S += 1)
                this._elem.hierarchy[S].finalTransform.mProp.applyToMatrix(m);
              return m.inversePoint(c);
            }
            return m.inversePoint(c);
          }
          function h() {
            return [1, 1, 1, 1];
          }
          return function (c) {
            var m;
            function S(y) {
              v.mask = new MaskManagerInterface(y, c);
            }
            function u(y) {
              v.effect = y;
            }
            function v(y) {
              switch (y) {
                case "ADBE Root Vectors Group":
                case "Contents":
                case 2:
                  return v.shapeInterface;
                case 1:
                case 6:
                case "Transform":
                case "transform":
                case "ADBE Transform Group":
                  return m;
                case 4:
                case "ADBE Effect Parade":
                case "effects":
                case "Effects":
                  return v.effect;
                case "ADBE Text Properties":
                  return v.textInterface;
                default:
                  return null;
              }
            }
            (v.getMatrix = e),
              (v.invertPoint = a),
              (v.applyPoint = n),
              (v.toWorld = r),
              (v.toWorldVec = t),
              (v.fromWorld = i),
              (v.fromWorldVec = s),
              (v.toComp = r),
              (v.fromComp = o),
              (v.sampleImage = h),
              (v.sourceRectAtTime = c.sourceRectAtTime.bind(c)),
              (v._elem = c),
              (m = TransformExpressionInterface(c.finalTransform.mProp));
            var g = getDescriptor(m, "anchorPoint");
            return (
              Object.defineProperties(v, {
                hasParent: {
                  get: function () {
                    return c.hierarchy.length;
                  },
                },
                parent: {
                  get: function () {
                    return c.hierarchy[0].layerInterface;
                  },
                },
                rotation: getDescriptor(m, "rotation"),
                scale: getDescriptor(m, "scale"),
                position: getDescriptor(m, "position"),
                opacity: getDescriptor(m, "opacity"),
                anchorPoint: g,
                anchor_point: g,
                transform: {
                  get: function () {
                    return m;
                  },
                },
                active: {
                  get: function () {
                    return c.isInRange;
                  },
                },
              }),
              (v.startTime = c.data.st),
              (v.index = c.data.ind),
              (v.source = c.data.refId),
              (v.height = c.data.ty === 0 ? c.data.h : 100),
              (v.width = c.data.ty === 0 ? c.data.w : 100),
              (v.inPoint = c.data.ip / c.comp.globalData.frameRate),
              (v.outPoint = c.data.op / c.comp.globalData.frameRate),
              (v._name = c.data.nm),
              (v.registerMaskInterface = S),
              (v.registerEffectsInterface = u),
              v
            );
          };
        })(),
        propertyGroupFactory = (function () {
          return function (e, t) {
            return function (r) {
              return (r = r === void 0 ? 1 : r), r <= 0 ? e : t(r - 1);
            };
          };
        })(),
        PropertyInterface = (function () {
          return function (e, t) {
            var r = { _name: e };
            function s(i) {
              return (i = i === void 0 ? 1 : i), i <= 0 ? r : t(i - 1);
            }
            return s;
          };
        })(),
        EffectsExpressionInterface = (function () {
          var e = { createEffectsInterface: t };
          function t(i, n) {
            if (i.effectsManager) {
              var a = [],
                o = i.data.ef,
                h,
                c = i.effectsManager.effectElements.length;
              for (h = 0; h < c; h += 1)
                a.push(r(o[h], i.effectsManager.effectElements[h], n, i));
              var m = i.data.ef || [],
                S = function (v) {
                  for (h = 0, c = m.length; h < c; ) {
                    if (v === m[h].nm || v === m[h].mn || v === m[h].ix)
                      return a[h];
                    h += 1;
                  }
                  return null;
                };
              return (
                Object.defineProperty(S, "numProperties", {
                  get: function () {
                    return m.length;
                  },
                }),
                S
              );
            }
            return null;
          }
          function r(i, n, a, o) {
            function h(v) {
              for (var g = i.ef, y = 0, E = g.length; y < E; ) {
                if (v === g[y].nm || v === g[y].mn || v === g[y].ix)
                  return g[y].ty === 5 ? m[y] : m[y]();
                y += 1;
              }
              throw new Error();
            }
            var c = propertyGroupFactory(h, a),
              m = [],
              S,
              u = i.ef.length;
            for (S = 0; S < u; S += 1)
              i.ef[S].ty === 5
                ? m.push(
                    r(
                      i.ef[S],
                      n.effectElements[S],
                      n.effectElements[S].propertyGroup,
                      o
                    )
                  )
                : m.push(s(n.effectElements[S], i.ef[S].ty, o, c));
            return (
              i.mn === "ADBE Color Control" &&
                Object.defineProperty(h, "color", {
                  get: function () {
                    return m[0]();
                  },
                }),
              Object.defineProperties(h, {
                numProperties: {
                  get: function () {
                    return i.np;
                  },
                },
                _name: { value: i.nm },
                propertyGroup: { value: c },
              }),
              (h.enabled = i.en !== 0),
              (h.active = h.enabled),
              h
            );
          }
          function s(i, n, a, o) {
            var h = ExpressionPropertyInterface(i.p);
            function c() {
              return n === 10 ? a.comp.compInterface(i.p.v) : h();
            }
            return (
              i.p.setGroupProperty &&
                i.p.setGroupProperty(PropertyInterface("", o)),
              c
            );
          }
          return e;
        })(),
        CompExpressionInterface = (function () {
          return function (e) {
            function t(r) {
              for (var s = 0, i = e.layers.length; s < i; ) {
                if (e.layers[s].nm === r || e.layers[s].ind === r)
                  return e.elements[s].layerInterface;
                s += 1;
              }
              return null;
            }
            return (
              Object.defineProperty(t, "_name", { value: e.data.nm }),
              (t.layer = t),
              (t.pixelAspect = 1),
              (t.height = e.data.h || e.globalData.compSize.h),
              (t.width = e.data.w || e.globalData.compSize.w),
              (t.pixelAspect = 1),
              (t.frameDuration = 1 / e.globalData.frameRate),
              (t.displayStartTime = 0),
              (t.numLayers = e.layers.length),
              t
            );
          };
        })(),
        ShapePathInterface = (function () {
          return function (t, r, s) {
            var i = r.sh;
            function n(o) {
              return o === "Shape" ||
                o === "shape" ||
                o === "Path" ||
                o === "path" ||
                o === "ADBE Vector Shape" ||
                o === 2
                ? n.path
                : null;
            }
            var a = propertyGroupFactory(n, s);
            return (
              i.setGroupProperty(PropertyInterface("Path", a)),
              Object.defineProperties(n, {
                path: {
                  get: function () {
                    return i.k && i.getValue(), i;
                  },
                },
                shape: {
                  get: function () {
                    return i.k && i.getValue(), i;
                  },
                },
                _name: { value: t.nm },
                ix: { value: t.ix },
                propertyIndex: { value: t.ix },
                mn: { value: t.mn },
                propertyGroup: { value: s },
              }),
              n
            );
          };
        })(),
        ShapeExpressionInterface = (function () {
          function e(g, y, E) {
            var l = [],
              d,
              p = g ? g.length : 0;
            for (d = 0; d < p; d += 1)
              g[d].ty === "gr"
                ? l.push(r(g[d], y[d], E))
                : g[d].ty === "fl"
                ? l.push(s(g[d], y[d], E))
                : g[d].ty === "st"
                ? l.push(a(g[d], y[d], E))
                : g[d].ty === "tm"
                ? l.push(o(g[d], y[d], E))
                : g[d].ty === "tr" ||
                  (g[d].ty === "el"
                    ? l.push(c(g[d], y[d], E))
                    : g[d].ty === "sr"
                    ? l.push(m(g[d], y[d], E))
                    : g[d].ty === "sh"
                    ? l.push(ShapePathInterface(g[d], y[d], E))
                    : g[d].ty === "rc"
                    ? l.push(S(g[d], y[d], E))
                    : g[d].ty === "rd"
                    ? l.push(u(g[d], y[d], E))
                    : g[d].ty === "rp"
                    ? l.push(v(g[d], y[d], E))
                    : g[d].ty === "gf"
                    ? l.push(i(g[d], y[d], E))
                    : l.push(n(g[d], y[d])));
            return l;
          }
          function t(g, y, E) {
            var l,
              d = function (b) {
                for (var x = 0, $ = l.length; x < $; ) {
                  if (
                    l[x]._name === b ||
                    l[x].mn === b ||
                    l[x].propertyIndex === b ||
                    l[x].ix === b ||
                    l[x].ind === b
                  )
                    return l[x];
                  x += 1;
                }
                return typeof b == "number" ? l[b - 1] : null;
              };
            (d.propertyGroup = propertyGroupFactory(d, E)),
              (l = e(g.it, y.it, d.propertyGroup)),
              (d.numProperties = l.length);
            var p = h(
              g.it[g.it.length - 1],
              y.it[y.it.length - 1],
              d.propertyGroup
            );
            return (
              (d.transform = p), (d.propertyIndex = g.cix), (d._name = g.nm), d
            );
          }
          function r(g, y, E) {
            var l = function (b) {
              switch (b) {
                case "ADBE Vectors Group":
                case "Contents":
                case 2:
                  return l.content;
                default:
                  return l.transform;
              }
            };
            l.propertyGroup = propertyGroupFactory(l, E);
            var d = t(g, y, l.propertyGroup),
              p = h(
                g.it[g.it.length - 1],
                y.it[y.it.length - 1],
                l.propertyGroup
              );
            return (
              (l.content = d),
              (l.transform = p),
              Object.defineProperty(l, "_name", {
                get: function () {
                  return g.nm;
                },
              }),
              (l.numProperties = g.np),
              (l.propertyIndex = g.ix),
              (l.nm = g.nm),
              (l.mn = g.mn),
              l
            );
          }
          function s(g, y, E) {
            function l(d) {
              return d === "Color" || d === "color"
                ? l.color
                : d === "Opacity" || d === "opacity"
                ? l.opacity
                : null;
            }
            return (
              Object.defineProperties(l, {
                color: { get: ExpressionPropertyInterface(y.c) },
                opacity: { get: ExpressionPropertyInterface(y.o) },
                _name: { value: g.nm },
                mn: { value: g.mn },
              }),
              y.c.setGroupProperty(PropertyInterface("Color", E)),
              y.o.setGroupProperty(PropertyInterface("Opacity", E)),
              l
            );
          }
          function i(g, y, E) {
            function l(d) {
              return d === "Start Point" || d === "start point"
                ? l.startPoint
                : d === "End Point" || d === "end point"
                ? l.endPoint
                : d === "Opacity" || d === "opacity"
                ? l.opacity
                : null;
            }
            return (
              Object.defineProperties(l, {
                startPoint: { get: ExpressionPropertyInterface(y.s) },
                endPoint: { get: ExpressionPropertyInterface(y.e) },
                opacity: { get: ExpressionPropertyInterface(y.o) },
                type: {
                  get: function () {
                    return "a";
                  },
                },
                _name: { value: g.nm },
                mn: { value: g.mn },
              }),
              y.s.setGroupProperty(PropertyInterface("Start Point", E)),
              y.e.setGroupProperty(PropertyInterface("End Point", E)),
              y.o.setGroupProperty(PropertyInterface("Opacity", E)),
              l
            );
          }
          function n() {
            function g() {
              return null;
            }
            return g;
          }
          function a(g, y, E) {
            var l = propertyGroupFactory($, E),
              d = propertyGroupFactory(x, l);
            function p(_) {
              Object.defineProperty(x, g.d[_].nm, {
                get: ExpressionPropertyInterface(y.d.dataProps[_].p),
              });
            }
            var f,
              b = g.d ? g.d.length : 0,
              x = {};
            for (f = 0; f < b; f += 1)
              p(f), y.d.dataProps[f].p.setGroupProperty(d);
            function $(_) {
              return _ === "Color" || _ === "color"
                ? $.color
                : _ === "Opacity" || _ === "opacity"
                ? $.opacity
                : _ === "Stroke Width" || _ === "stroke width"
                ? $.strokeWidth
                : null;
            }
            return (
              Object.defineProperties($, {
                color: { get: ExpressionPropertyInterface(y.c) },
                opacity: { get: ExpressionPropertyInterface(y.o) },
                strokeWidth: { get: ExpressionPropertyInterface(y.w) },
                dash: {
                  get: function () {
                    return x;
                  },
                },
                _name: { value: g.nm },
                mn: { value: g.mn },
              }),
              y.c.setGroupProperty(PropertyInterface("Color", l)),
              y.o.setGroupProperty(PropertyInterface("Opacity", l)),
              y.w.setGroupProperty(PropertyInterface("Stroke Width", l)),
              $
            );
          }
          function o(g, y, E) {
            function l(p) {
              return p === g.e.ix || p === "End" || p === "end"
                ? l.end
                : p === g.s.ix
                ? l.start
                : p === g.o.ix
                ? l.offset
                : null;
            }
            var d = propertyGroupFactory(l, E);
            return (
              (l.propertyIndex = g.ix),
              y.s.setGroupProperty(PropertyInterface("Start", d)),
              y.e.setGroupProperty(PropertyInterface("End", d)),
              y.o.setGroupProperty(PropertyInterface("Offset", d)),
              (l.propertyIndex = g.ix),
              (l.propertyGroup = E),
              Object.defineProperties(l, {
                start: { get: ExpressionPropertyInterface(y.s) },
                end: { get: ExpressionPropertyInterface(y.e) },
                offset: { get: ExpressionPropertyInterface(y.o) },
                _name: { value: g.nm },
              }),
              (l.mn = g.mn),
              l
            );
          }
          function h(g, y, E) {
            function l(p) {
              return g.a.ix === p || p === "Anchor Point"
                ? l.anchorPoint
                : g.o.ix === p || p === "Opacity"
                ? l.opacity
                : g.p.ix === p || p === "Position"
                ? l.position
                : g.r.ix === p ||
                  p === "Rotation" ||
                  p === "ADBE Vector Rotation"
                ? l.rotation
                : g.s.ix === p || p === "Scale"
                ? l.scale
                : (g.sk && g.sk.ix === p) || p === "Skew"
                ? l.skew
                : (g.sa && g.sa.ix === p) || p === "Skew Axis"
                ? l.skewAxis
                : null;
            }
            var d = propertyGroupFactory(l, E);
            return (
              y.transform.mProps.o.setGroupProperty(
                PropertyInterface("Opacity", d)
              ),
              y.transform.mProps.p.setGroupProperty(
                PropertyInterface("Position", d)
              ),
              y.transform.mProps.a.setGroupProperty(
                PropertyInterface("Anchor Point", d)
              ),
              y.transform.mProps.s.setGroupProperty(
                PropertyInterface("Scale", d)
              ),
              y.transform.mProps.r.setGroupProperty(
                PropertyInterface("Rotation", d)
              ),
              y.transform.mProps.sk &&
                (y.transform.mProps.sk.setGroupProperty(
                  PropertyInterface("Skew", d)
                ),
                y.transform.mProps.sa.setGroupProperty(
                  PropertyInterface("Skew Angle", d)
                )),
              y.transform.op.setGroupProperty(PropertyInterface("Opacity", d)),
              Object.defineProperties(l, {
                opacity: {
                  get: ExpressionPropertyInterface(y.transform.mProps.o),
                },
                position: {
                  get: ExpressionPropertyInterface(y.transform.mProps.p),
                },
                anchorPoint: {
                  get: ExpressionPropertyInterface(y.transform.mProps.a),
                },
                scale: {
                  get: ExpressionPropertyInterface(y.transform.mProps.s),
                },
                rotation: {
                  get: ExpressionPropertyInterface(y.transform.mProps.r),
                },
                skew: {
                  get: ExpressionPropertyInterface(y.transform.mProps.sk),
                },
                skewAxis: {
                  get: ExpressionPropertyInterface(y.transform.mProps.sa),
                },
                _name: { value: g.nm },
              }),
              (l.ty = "tr"),
              (l.mn = g.mn),
              (l.propertyGroup = E),
              l
            );
          }
          function c(g, y, E) {
            function l(f) {
              return g.p.ix === f ? l.position : g.s.ix === f ? l.size : null;
            }
            var d = propertyGroupFactory(l, E);
            l.propertyIndex = g.ix;
            var p = y.sh.ty === "tm" ? y.sh.prop : y.sh;
            return (
              p.s.setGroupProperty(PropertyInterface("Size", d)),
              p.p.setGroupProperty(PropertyInterface("Position", d)),
              Object.defineProperties(l, {
                size: { get: ExpressionPropertyInterface(p.s) },
                position: { get: ExpressionPropertyInterface(p.p) },
                _name: { value: g.nm },
              }),
              (l.mn = g.mn),
              l
            );
          }
          function m(g, y, E) {
            function l(f) {
              return g.p.ix === f
                ? l.position
                : g.r.ix === f
                ? l.rotation
                : g.pt.ix === f
                ? l.points
                : g.or.ix === f || f === "ADBE Vector Star Outer Radius"
                ? l.outerRadius
                : g.os.ix === f
                ? l.outerRoundness
                : g.ir &&
                  (g.ir.ix === f || f === "ADBE Vector Star Inner Radius")
                ? l.innerRadius
                : g.is && g.is.ix === f
                ? l.innerRoundness
                : null;
            }
            var d = propertyGroupFactory(l, E),
              p = y.sh.ty === "tm" ? y.sh.prop : y.sh;
            return (
              (l.propertyIndex = g.ix),
              p.or.setGroupProperty(PropertyInterface("Outer Radius", d)),
              p.os.setGroupProperty(PropertyInterface("Outer Roundness", d)),
              p.pt.setGroupProperty(PropertyInterface("Points", d)),
              p.p.setGroupProperty(PropertyInterface("Position", d)),
              p.r.setGroupProperty(PropertyInterface("Rotation", d)),
              g.ir &&
                (p.ir.setGroupProperty(PropertyInterface("Inner Radius", d)),
                p.is.setGroupProperty(PropertyInterface("Inner Roundness", d))),
              Object.defineProperties(l, {
                position: { get: ExpressionPropertyInterface(p.p) },
                rotation: { get: ExpressionPropertyInterface(p.r) },
                points: { get: ExpressionPropertyInterface(p.pt) },
                outerRadius: { get: ExpressionPropertyInterface(p.or) },
                outerRoundness: { get: ExpressionPropertyInterface(p.os) },
                innerRadius: { get: ExpressionPropertyInterface(p.ir) },
                innerRoundness: { get: ExpressionPropertyInterface(p.is) },
                _name: { value: g.nm },
              }),
              (l.mn = g.mn),
              l
            );
          }
          function S(g, y, E) {
            function l(f) {
              return g.p.ix === f
                ? l.position
                : g.r.ix === f
                ? l.roundness
                : g.s.ix === f || f === "Size" || f === "ADBE Vector Rect Size"
                ? l.size
                : null;
            }
            var d = propertyGroupFactory(l, E),
              p = y.sh.ty === "tm" ? y.sh.prop : y.sh;
            return (
              (l.propertyIndex = g.ix),
              p.p.setGroupProperty(PropertyInterface("Position", d)),
              p.s.setGroupProperty(PropertyInterface("Size", d)),
              p.r.setGroupProperty(PropertyInterface("Rotation", d)),
              Object.defineProperties(l, {
                position: { get: ExpressionPropertyInterface(p.p) },
                roundness: { get: ExpressionPropertyInterface(p.r) },
                size: { get: ExpressionPropertyInterface(p.s) },
                _name: { value: g.nm },
              }),
              (l.mn = g.mn),
              l
            );
          }
          function u(g, y, E) {
            function l(f) {
              return g.r.ix === f || f === "Round Corners 1" ? l.radius : null;
            }
            var d = propertyGroupFactory(l, E),
              p = y;
            return (
              (l.propertyIndex = g.ix),
              p.rd.setGroupProperty(PropertyInterface("Radius", d)),
              Object.defineProperties(l, {
                radius: { get: ExpressionPropertyInterface(p.rd) },
                _name: { value: g.nm },
              }),
              (l.mn = g.mn),
              l
            );
          }
          function v(g, y, E) {
            function l(f) {
              return g.c.ix === f || f === "Copies"
                ? l.copies
                : g.o.ix === f || f === "Offset"
                ? l.offset
                : null;
            }
            var d = propertyGroupFactory(l, E),
              p = y;
            return (
              (l.propertyIndex = g.ix),
              p.c.setGroupProperty(PropertyInterface("Copies", d)),
              p.o.setGroupProperty(PropertyInterface("Offset", d)),
              Object.defineProperties(l, {
                copies: { get: ExpressionPropertyInterface(p.c) },
                offset: { get: ExpressionPropertyInterface(p.o) },
                _name: { value: g.nm },
              }),
              (l.mn = g.mn),
              l
            );
          }
          return function (g, y, E) {
            var l;
            function d(f) {
              if (typeof f == "number")
                return (f = f === void 0 ? 1 : f), f === 0 ? E : l[f - 1];
              for (var b = 0, x = l.length; b < x; ) {
                if (l[b]._name === f) return l[b];
                b += 1;
              }
              return null;
            }
            function p() {
              return E;
            }
            return (
              (d.propertyGroup = propertyGroupFactory(d, p)),
              (l = e(g, y, d.propertyGroup)),
              (d.numProperties = l.length),
              (d._name = "Contents"),
              d
            );
          };
        })(),
        TextExpressionInterface = (function () {
          return function (e) {
            var t, r;
            function s(i) {
              switch (i) {
                case "ADBE Text Document":
                  return s.sourceText;
                default:
                  return null;
              }
            }
            return (
              Object.defineProperty(s, "sourceText", {
                get: function () {
                  e.textProperty.getValue();
                  var n = e.textProperty.currentData.t;
                  return (
                    n !== t &&
                      ((e.textProperty.currentData.t = t),
                      (r = new String(n)),
                      (r.value = n || new String(n))),
                    r
                  );
                },
              }),
              s
            );
          };
        })(),
        getBlendMode = (function () {
          var e = {
            0: "source-over",
            1: "multiply",
            2: "screen",
            3: "overlay",
            4: "darken",
            5: "lighten",
            6: "color-dodge",
            7: "color-burn",
            8: "hard-light",
            9: "soft-light",
            10: "difference",
            11: "exclusion",
            12: "hue",
            13: "saturation",
            14: "color",
            15: "luminosity",
          };
          return function (t) {
            return e[t] || "";
          };
        })();
      function SliderEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function AngleEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function ColorEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 1, 0, r);
      }
      function PointEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 1, 0, r);
      }
      function LayerIndexEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function MaskIndexEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function CheckboxEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function NoValueEffect() {
        this.p = {};
      }
      function EffectsManager(e, t) {
        var r = e.ef || [];
        this.effectElements = [];
        var s,
          i = r.length,
          n;
        for (s = 0; s < i; s += 1)
          (n = new GroupEffect(r[s], t)), this.effectElements.push(n);
      }
      function GroupEffect(e, t) {
        this.init(e, t);
      }
      extendPrototype([DynamicPropertyContainer], GroupEffect),
        (GroupEffect.prototype.getValue =
          GroupEffect.prototype.iterateDynamicProperties),
        (GroupEffect.prototype.init = function (e, t) {
          (this.data = e),
            (this.effectElements = []),
            this.initDynamicPropertyContainer(t);
          var r,
            s = this.data.ef.length,
            i,
            n = this.data.ef;
          for (r = 0; r < s; r += 1) {
            switch (((i = null), n[r].ty)) {
              case 0:
                i = new SliderEffect(n[r], t, this);
                break;
              case 1:
                i = new AngleEffect(n[r], t, this);
                break;
              case 2:
                i = new ColorEffect(n[r], t, this);
                break;
              case 3:
                i = new PointEffect(n[r], t, this);
                break;
              case 4:
              case 7:
                i = new CheckboxEffect(n[r], t, this);
                break;
              case 10:
                i = new LayerIndexEffect(n[r], t, this);
                break;
              case 11:
                i = new MaskIndexEffect(n[r], t, this);
                break;
              case 5:
                i = new EffectsManager(n[r], t);
                break;
              default:
                i = new NoValueEffect(n[r]);
                break;
            }
            i && this.effectElements.push(i);
          }
        });
      function BaseElement() {}
      BaseElement.prototype = {
        checkMasks: function () {
          if (!this.data.hasMask) return !1;
          for (var t = 0, r = this.data.masksProperties.length; t < r; ) {
            if (
              this.data.masksProperties[t].mode !== "n" &&
              this.data.masksProperties[t].cl !== !1
            )
              return !0;
            t += 1;
          }
          return !1;
        },
        initExpressions: function () {
          (this.layerInterface = LayerExpressionInterface(this)),
            this.data.hasMask &&
              this.maskManager &&
              this.layerInterface.registerMaskInterface(this.maskManager);
          var t = EffectsExpressionInterface.createEffectsInterface(
            this,
            this.layerInterface
          );
          this.layerInterface.registerEffectsInterface(t),
            this.data.ty === 0 || this.data.xt
              ? (this.compInterface = CompExpressionInterface(this))
              : this.data.ty === 4
              ? ((this.layerInterface.shapeInterface = ShapeExpressionInterface(
                  this.shapesData,
                  this.itemsData,
                  this.layerInterface
                )),
                (this.layerInterface.content =
                  this.layerInterface.shapeInterface))
              : this.data.ty === 5 &&
                ((this.layerInterface.textInterface =
                  TextExpressionInterface(this)),
                (this.layerInterface.text = this.layerInterface.textInterface));
        },
        setBlendMode: function () {
          var t = getBlendMode(this.data.bm),
            r = this.baseElement || this.layerElement;
          r.style["mix-blend-mode"] = t;
        },
        initBaseData: function (t, r, s) {
          (this.globalData = r),
            (this.comp = s),
            (this.data = t),
            (this.layerId = createElementID()),
            this.data.sr || (this.data.sr = 1),
            (this.effectsManager = new EffectsManager(
              this.data,
              this,
              this.dynamicProperties
            ));
        },
        getType: function () {
          return this.type;
        },
        sourceRectAtTime: function () {},
      };
      function FrameElement() {}
      FrameElement.prototype = {
        initFrame: function () {
          (this._isFirstFrame = !1),
            (this.dynamicProperties = []),
            (this._mdf = !1);
        },
        prepareProperties: function (t, r) {
          var s,
            i = this.dynamicProperties.length;
          for (s = 0; s < i; s += 1)
            (r ||
              (this._isParent &&
                this.dynamicProperties[s].propType === "transform")) &&
              (this.dynamicProperties[s].getValue(),
              this.dynamicProperties[s]._mdf &&
                ((this.globalData._mdf = !0), (this._mdf = !0)));
        },
        addDynamicProperty: function (t) {
          this.dynamicProperties.indexOf(t) === -1 &&
            this.dynamicProperties.push(t);
        },
      };
      function _typeof$2(e) {
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$2 = function (r) {
                return typeof r;
              })
            : (_typeof$2 = function (r) {
                return r &&
                  typeof Symbol == "function" &&
                  r.constructor === Symbol &&
                  r !== Symbol.prototype
                  ? "symbol"
                  : typeof r;
              }),
          _typeof$2(e)
        );
      }
      var FootageInterface = (function () {
        var e = function (s) {
            var i = "",
              n = s.getFootageData();
            function a() {
              return (i = ""), (n = s.getFootageData()), o;
            }
            function o(h) {
              if (n[h])
                return (i = h), (n = n[h]), _typeof$2(n) === "object" ? o : n;
              var c = h.indexOf(i);
              if (c !== -1) {
                var m = parseInt(h.substr(c + i.length), 10);
                return (n = n[m]), _typeof$2(n) === "object" ? o : n;
              }
              return "";
            }
            return a;
          },
          t = function (s) {
            function i(n) {
              return n === "Outline" ? i.outlineInterface() : null;
            }
            return (i._name = "Outline"), (i.outlineInterface = e(s)), i;
          };
        return function (r) {
          function s(i) {
            return i === "Data" ? s.dataInterface : null;
          }
          return (s._name = "Data"), (s.dataInterface = t(r)), s;
        };
      })();
      function FootageElement(e, t, r) {
        this.initFrame(),
          this.initRenderable(),
          (this.assetData = t.getAssetData(e.refId)),
          (this.footageData = t.imageLoader.getAsset(this.assetData)),
          this.initBaseData(e, t, r);
      }
      (FootageElement.prototype.prepareFrame = function () {}),
        extendPrototype(
          [RenderableElement, BaseElement, FrameElement],
          FootageElement
        ),
        (FootageElement.prototype.getBaseElement = function () {
          return null;
        }),
        (FootageElement.prototype.renderFrame = function () {}),
        (FootageElement.prototype.destroy = function () {}),
        (FootageElement.prototype.initExpressions = function () {
          this.layerInterface = FootageInterface(this);
        }),
        (FootageElement.prototype.getFootageData = function () {
          return this.footageData;
        });
      function AudioElement(e, t, r) {
        this.initFrame(),
          this.initRenderable(),
          (this.assetData = t.getAssetData(e.refId)),
          this.initBaseData(e, t, r),
          (this._isPlaying = !1),
          (this._canPlay = !1);
        var s = this.globalData.getAssetsPath(this.assetData);
        (this.audio = this.globalData.audioController.createAudio(s)),
          (this._currentTime = 0),
          this.globalData.audioController.addAudio(this),
          (this._volumeMultiplier = 1),
          (this._volume = 1),
          (this._previousVolume = null),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 }),
          (this.lv = PropertyFactory.getProp(
            this,
            e.au && e.au.lv ? e.au.lv : { k: [100] },
            1,
            0.01,
            this
          ));
      }
      (AudioElement.prototype.prepareFrame = function (e) {
        if (
          (this.prepareRenderableFrame(e, !0),
          this.prepareProperties(e, !0),
          this.tm._placeholder)
        )
          this._currentTime = e / this.data.sr;
        else {
          var t = this.tm.v;
          this._currentTime = t;
        }
        this._volume = this.lv.v[0];
        var r = this._volume * this._volumeMultiplier;
        this._previousVolume !== r &&
          ((this._previousVolume = r), this.audio.volume(r));
      }),
        extendPrototype(
          [RenderableElement, BaseElement, FrameElement],
          AudioElement
        ),
        (AudioElement.prototype.renderFrame = function () {
          this.isInRange &&
            this._canPlay &&
            (this._isPlaying
              ? (!this.audio.playing() ||
                  Math.abs(
                    this._currentTime / this.globalData.frameRate -
                      this.audio.seek()
                  ) > 0.1) &&
                this.audio.seek(this._currentTime / this.globalData.frameRate)
              : (this.audio.play(),
                this.audio.seek(this._currentTime / this.globalData.frameRate),
                (this._isPlaying = !0)));
        }),
        (AudioElement.prototype.show = function () {}),
        (AudioElement.prototype.hide = function () {
          this.audio.pause(), (this._isPlaying = !1);
        }),
        (AudioElement.prototype.pause = function () {
          this.audio.pause(), (this._isPlaying = !1), (this._canPlay = !1);
        }),
        (AudioElement.prototype.resume = function () {
          this._canPlay = !0;
        }),
        (AudioElement.prototype.setRate = function (e) {
          this.audio.rate(e);
        }),
        (AudioElement.prototype.volume = function (e) {
          (this._volumeMultiplier = e),
            (this._previousVolume = e * this._volume),
            this.audio.volume(this._previousVolume);
        }),
        (AudioElement.prototype.getBaseElement = function () {
          return null;
        }),
        (AudioElement.prototype.destroy = function () {}),
        (AudioElement.prototype.sourceRectAtTime = function () {}),
        (AudioElement.prototype.initExpressions = function () {});
      function BaseRenderer() {}
      (BaseRenderer.prototype.checkLayers = function (e) {
        var t,
          r = this.layers.length,
          s;
        for (this.completeLayers = !0, t = r - 1; t >= 0; t -= 1)
          this.elements[t] ||
            ((s = this.layers[t]),
            s.ip - s.st <= e - this.layers[t].st &&
              s.op - s.st > e - this.layers[t].st &&
              this.buildItem(t)),
            (this.completeLayers = this.elements[t] ? this.completeLayers : !1);
        this.checkPendingElements();
      }),
        (BaseRenderer.prototype.createItem = function (e) {
          switch (e.ty) {
            case 2:
              return this.createImage(e);
            case 0:
              return this.createComp(e);
            case 1:
              return this.createSolid(e);
            case 3:
              return this.createNull(e);
            case 4:
              return this.createShape(e);
            case 5:
              return this.createText(e);
            case 6:
              return this.createAudio(e);
            case 13:
              return this.createCamera(e);
            case 15:
              return this.createFootage(e);
            default:
              return this.createNull(e);
          }
        }),
        (BaseRenderer.prototype.createCamera = function () {
          throw new Error("You're using a 3d camera. Try the html renderer.");
        }),
        (BaseRenderer.prototype.createAudio = function (e) {
          return new AudioElement(e, this.globalData, this);
        }),
        (BaseRenderer.prototype.createFootage = function (e) {
          return new FootageElement(e, this.globalData, this);
        }),
        (BaseRenderer.prototype.buildAllItems = function () {
          var e,
            t = this.layers.length;
          for (e = 0; e < t; e += 1) this.buildItem(e);
          this.checkPendingElements();
        }),
        (BaseRenderer.prototype.includeLayers = function (e) {
          this.completeLayers = !1;
          var t,
            r = e.length,
            s,
            i = this.layers.length;
          for (t = 0; t < r; t += 1)
            for (s = 0; s < i; ) {
              if (this.layers[s].id === e[t].id) {
                this.layers[s] = e[t];
                break;
              }
              s += 1;
            }
        }),
        (BaseRenderer.prototype.setProjectInterface = function (e) {
          this.globalData.projectInterface = e;
        }),
        (BaseRenderer.prototype.initItems = function () {
          this.globalData.progressiveLoad || this.buildAllItems();
        }),
        (BaseRenderer.prototype.buildElementParenting = function (e, t, r) {
          for (
            var s = this.elements, i = this.layers, n = 0, a = i.length;
            n < a;

          )
            i[n].ind == t &&
              (!s[n] || s[n] === !0
                ? (this.buildItem(n), this.addPendingElement(e))
                : (r.push(s[n]),
                  s[n].setAsParent(),
                  i[n].parent !== void 0
                    ? this.buildElementParenting(e, i[n].parent, r)
                    : e.setHierarchy(r))),
              (n += 1);
        }),
        (BaseRenderer.prototype.addPendingElement = function (e) {
          this.pendingElements.push(e);
        }),
        (BaseRenderer.prototype.searchExtraCompositions = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1)
            if (e[t].xt) {
              var s = this.createComp(e[t]);
              s.initExpressions(),
                this.globalData.projectInterface.registerComposition(s);
            }
        }),
        (BaseRenderer.prototype.getElementByPath = function (e) {
          var t = e.shift(),
            r;
          if (typeof t == "number") r = this.elements[t];
          else {
            var s,
              i = this.elements.length;
            for (s = 0; s < i; s += 1)
              if (this.elements[s].data.nm === t) {
                r = this.elements[s];
                break;
              }
          }
          return e.length === 0 ? r : r.getElementByPath(e);
        }),
        (BaseRenderer.prototype.setupGlobalData = function (e, t) {
          (this.globalData.fontManager = new FontManager()),
            this.globalData.fontManager.addChars(e.chars),
            this.globalData.fontManager.addFonts(e.fonts, t),
            (this.globalData.getAssetData =
              this.animationItem.getAssetData.bind(this.animationItem)),
            (this.globalData.getAssetsPath =
              this.animationItem.getAssetsPath.bind(this.animationItem)),
            (this.globalData.imageLoader = this.animationItem.imagePreloader),
            (this.globalData.audioController =
              this.animationItem.audioController),
            (this.globalData.frameId = 0),
            (this.globalData.frameRate = e.fr),
            (this.globalData.nm = e.nm),
            (this.globalData.compSize = { w: e.w, h: e.h });
        });
      function TransformElement() {}
      TransformElement.prototype = {
        initTransform: function () {
          (this.finalTransform = {
            mProp: this.data.ks
              ? TransformPropertyFactory.getTransformProperty(
                  this,
                  this.data.ks,
                  this
                )
              : { o: 0 },
            _matMdf: !1,
            _opMdf: !1,
            mat: new Matrix(),
          }),
            this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
            this.data.ty;
        },
        renderTransform: function () {
          if (
            ((this.finalTransform._opMdf =
              this.finalTransform.mProp.o._mdf || this._isFirstFrame),
            (this.finalTransform._matMdf =
              this.finalTransform.mProp._mdf || this._isFirstFrame),
            this.hierarchy)
          ) {
            var t,
              r = this.finalTransform.mat,
              s = 0,
              i = this.hierarchy.length;
            if (!this.finalTransform._matMdf)
              for (; s < i; ) {
                if (this.hierarchy[s].finalTransform.mProp._mdf) {
                  this.finalTransform._matMdf = !0;
                  break;
                }
                s += 1;
              }
            if (this.finalTransform._matMdf)
              for (
                t = this.finalTransform.mProp.v.props,
                  r.cloneFromProps(t),
                  s = 0;
                s < i;
                s += 1
              )
                (t = this.hierarchy[s].finalTransform.mProp.v.props),
                  r.transform(
                    t[0],
                    t[1],
                    t[2],
                    t[3],
                    t[4],
                    t[5],
                    t[6],
                    t[7],
                    t[8],
                    t[9],
                    t[10],
                    t[11],
                    t[12],
                    t[13],
                    t[14],
                    t[15]
                  );
          }
        },
        globalToLocal: function (t) {
          var r = [];
          r.push(this.finalTransform);
          for (var s = !0, i = this.comp; s; )
            i.finalTransform
              ? (i.data.hasMask && r.splice(0, 0, i.finalTransform),
                (i = i.comp))
              : (s = !1);
          var n,
            a = r.length,
            o;
          for (n = 0; n < a; n += 1)
            (o = r[n].mat.applyToPointArray(0, 0, 0)),
              (t = [t[0] - o[0], t[1] - o[1], 0]);
          return t;
        },
        mHelper: new Matrix(),
      };
      function MaskElement(e, t, r) {
        (this.data = e),
          (this.element = t),
          (this.globalData = r),
          (this.storedData = []),
          (this.masksProperties = this.data.masksProperties || []),
          (this.maskElement = null);
        var s = this.globalData.defs,
          i,
          n = this.masksProperties ? this.masksProperties.length : 0;
        (this.viewData = createSizedArray(n)), (this.solidPath = "");
        var a,
          o = this.masksProperties,
          h = 0,
          c = [],
          m,
          S,
          u = createElementID(),
          v,
          g,
          y,
          E,
          l = "clipPath",
          d = "clip-path";
        for (i = 0; i < n; i += 1)
          if (
            (((o[i].mode !== "a" && o[i].mode !== "n") ||
              o[i].inv ||
              o[i].o.k !== 100 ||
              o[i].o.x) &&
              ((l = "mask"), (d = "mask")),
            (o[i].mode === "s" || o[i].mode === "i") && h === 0
              ? ((v = createNS("rect")),
                v.setAttribute("fill", "#ffffff"),
                v.setAttribute("width", this.element.comp.data.w || 0),
                v.setAttribute("height", this.element.comp.data.h || 0),
                c.push(v))
              : (v = null),
            (a = createNS("path")),
            o[i].mode === "n")
          )
            (this.viewData[i] = {
              op: PropertyFactory.getProp(
                this.element,
                o[i].o,
                0,
                0.01,
                this.element
              ),
              prop: ShapePropertyFactory.getShapeProp(this.element, o[i], 3),
              elem: a,
              lastPath: "",
            }),
              s.appendChild(a);
          else {
            (h += 1),
              a.setAttribute("fill", o[i].mode === "s" ? "#000000" : "#ffffff"),
              a.setAttribute("clip-rule", "nonzero");
            var p;
            if (
              (o[i].x.k !== 0
                ? ((l = "mask"),
                  (d = "mask"),
                  (E = PropertyFactory.getProp(
                    this.element,
                    o[i].x,
                    0,
                    null,
                    this.element
                  )),
                  (p = createElementID()),
                  (g = createNS("filter")),
                  g.setAttribute("id", p),
                  (y = createNS("feMorphology")),
                  y.setAttribute("operator", "erode"),
                  y.setAttribute("in", "SourceGraphic"),
                  y.setAttribute("radius", "0"),
                  g.appendChild(y),
                  s.appendChild(g),
                  a.setAttribute(
                    "stroke",
                    o[i].mode === "s" ? "#000000" : "#ffffff"
                  ))
                : ((y = null), (E = null)),
              (this.storedData[i] = {
                elem: a,
                x: E,
                expan: y,
                lastPath: "",
                lastOperator: "",
                filterId: p,
                lastRadius: 0,
              }),
              o[i].mode === "i")
            ) {
              S = c.length;
              var f = createNS("g");
              for (m = 0; m < S; m += 1) f.appendChild(c[m]);
              var b = createNS("mask");
              b.setAttribute("mask-type", "alpha"),
                b.setAttribute("id", u + "_" + h),
                b.appendChild(a),
                s.appendChild(b),
                f.setAttribute(
                  "mask",
                  "url(" + getLocationHref() + "#" + u + "_" + h + ")"
                ),
                (c.length = 0),
                c.push(f);
            } else c.push(a);
            o[i].inv &&
              !this.solidPath &&
              (this.solidPath = this.createLayerSolidPath()),
              (this.viewData[i] = {
                elem: a,
                lastPath: "",
                op: PropertyFactory.getProp(
                  this.element,
                  o[i].o,
                  0,
                  0.01,
                  this.element
                ),
                prop: ShapePropertyFactory.getShapeProp(this.element, o[i], 3),
                invRect: v,
              }),
              this.viewData[i].prop.k ||
                this.drawPath(o[i], this.viewData[i].prop.v, this.viewData[i]);
          }
        for (this.maskElement = createNS(l), n = c.length, i = 0; i < n; i += 1)
          this.maskElement.appendChild(c[i]);
        h > 0 &&
          (this.maskElement.setAttribute("id", u),
          this.element.maskedElement.setAttribute(
            d,
            "url(" + getLocationHref() + "#" + u + ")"
          ),
          s.appendChild(this.maskElement)),
          this.viewData.length && this.element.addRenderableComponent(this);
      }
      (MaskElement.prototype.getMaskProperty = function (e) {
        return this.viewData[e].prop;
      }),
        (MaskElement.prototype.renderFrame = function (e) {
          var t = this.element.finalTransform.mat,
            r,
            s = this.masksProperties.length;
          for (r = 0; r < s; r += 1)
            if (
              ((this.viewData[r].prop._mdf || e) &&
                this.drawPath(
                  this.masksProperties[r],
                  this.viewData[r].prop.v,
                  this.viewData[r]
                ),
              (this.viewData[r].op._mdf || e) &&
                this.viewData[r].elem.setAttribute(
                  "fill-opacity",
                  this.viewData[r].op.v
                ),
              this.masksProperties[r].mode !== "n" &&
                (this.viewData[r].invRect &&
                  (this.element.finalTransform.mProp._mdf || e) &&
                  this.viewData[r].invRect.setAttribute(
                    "transform",
                    t.getInverseMatrix().to2dCSS()
                  ),
                this.storedData[r].x && (this.storedData[r].x._mdf || e)))
            ) {
              var i = this.storedData[r].expan;
              this.storedData[r].x.v < 0
                ? (this.storedData[r].lastOperator !== "erode" &&
                    ((this.storedData[r].lastOperator = "erode"),
                    this.storedData[r].elem.setAttribute(
                      "filter",
                      "url(" +
                        getLocationHref() +
                        "#" +
                        this.storedData[r].filterId +
                        ")"
                    )),
                  i.setAttribute("radius", -this.storedData[r].x.v))
                : (this.storedData[r].lastOperator !== "dilate" &&
                    ((this.storedData[r].lastOperator = "dilate"),
                    this.storedData[r].elem.setAttribute("filter", null)),
                  this.storedData[r].elem.setAttribute(
                    "stroke-width",
                    this.storedData[r].x.v * 2
                  ));
            }
        }),
        (MaskElement.prototype.getMaskelement = function () {
          return this.maskElement;
        }),
        (MaskElement.prototype.createLayerSolidPath = function () {
          var e = "M0,0 ";
          return (
            (e += " h" + this.globalData.compSize.w),
            (e += " v" + this.globalData.compSize.h),
            (e += " h-" + this.globalData.compSize.w),
            (e += " v-" + this.globalData.compSize.h + " "),
            e
          );
        }),
        (MaskElement.prototype.drawPath = function (e, t, r) {
          var s = " M" + t.v[0][0] + "," + t.v[0][1],
            i,
            n;
          for (n = t._length, i = 1; i < n; i += 1)
            s +=
              " C" +
              t.o[i - 1][0] +
              "," +
              t.o[i - 1][1] +
              " " +
              t.i[i][0] +
              "," +
              t.i[i][1] +
              " " +
              t.v[i][0] +
              "," +
              t.v[i][1];
          if (
            (t.c &&
              n > 1 &&
              (s +=
                " C" +
                t.o[i - 1][0] +
                "," +
                t.o[i - 1][1] +
                " " +
                t.i[0][0] +
                "," +
                t.i[0][1] +
                " " +
                t.v[0][0] +
                "," +
                t.v[0][1]),
            r.lastPath !== s)
          ) {
            var a = "";
            r.elem &&
              (t.c && (a = e.inv ? this.solidPath + s : s),
              r.elem.setAttribute("d", a)),
              (r.lastPath = s);
          }
        }),
        (MaskElement.prototype.destroy = function () {
          (this.element = null),
            (this.globalData = null),
            (this.maskElement = null),
            (this.data = null),
            (this.masksProperties = null);
        });
      var filtersFactory = (function () {
          var e = {};
          (e.createFilter = t), (e.createAlphaToLuminanceFilter = r);
          function t(s, i) {
            var n = createNS("filter");
            return (
              n.setAttribute("id", s),
              i !== !0 &&
                (n.setAttribute("filterUnits", "objectBoundingBox"),
                n.setAttribute("x", "0%"),
                n.setAttribute("y", "0%"),
                n.setAttribute("width", "100%"),
                n.setAttribute("height", "100%")),
              n
            );
          }
          function r() {
            var s = createNS("feColorMatrix");
            return (
              s.setAttribute("type", "matrix"),
              s.setAttribute("color-interpolation-filters", "sRGB"),
              s.setAttribute(
                "values",
                "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"
              ),
              s
            );
          }
          return e;
        })(),
        featureSupport = (function () {
          var e = { maskType: !0 };
          return (
            (/MSIE 10/i.test(navigator.userAgent) ||
              /MSIE 9/i.test(navigator.userAgent) ||
              /rv:11.0/i.test(navigator.userAgent) ||
              /Edge\/\d./i.test(navigator.userAgent)) &&
              (e.maskType = !1),
            e
          );
        })(),
        registeredEffects = {},
        idPrefix = "filter_result_";
      function SVGEffects(e) {
        var t,
          r = "SourceGraphic",
          s = e.data.ef ? e.data.ef.length : 0,
          i = createElementID(),
          n = filtersFactory.createFilter(i, !0),
          a = 0;
        this.filters = [];
        var o;
        for (t = 0; t < s; t += 1) {
          o = null;
          var h = e.data.ef[t].ty;
          if (registeredEffects[h]) {
            var c = registeredEffects[h].effect;
            (o = new c(
              n,
              e.effectsManager.effectElements[t],
              e,
              idPrefix + a,
              r
            )),
              (r = idPrefix + a),
              registeredEffects[h].countsAsEffect && (a += 1);
          }
          o && this.filters.push(o);
        }
        a &&
          (e.globalData.defs.appendChild(n),
          e.layerElement.setAttribute(
            "filter",
            "url(" + getLocationHref() + "#" + i + ")"
          )),
          this.filters.length && e.addRenderableComponent(this);
      }
      SVGEffects.prototype.renderFrame = function (e) {
        var t,
          r = this.filters.length;
        for (t = 0; t < r; t += 1) this.filters[t].renderFrame(e);
      };
      function registerEffect(e, t, r) {
        registeredEffects[e] = { effect: t, countsAsEffect: r };
      }
      function SVGBaseElement() {}
      SVGBaseElement.prototype = {
        initRendererElement: function () {
          this.layerElement = createNS("g");
        },
        createContainerElements: function () {
          (this.matteElement = createNS("g")),
            (this.transformedElement = this.layerElement),
            (this.maskedElement = this.layerElement),
            (this._sizeChanged = !1);
          var t = null,
            r,
            s,
            i;
          if (this.data.td) {
            if (this.data.td == 3 || this.data.td == 1) {
              var n = createNS("mask");
              n.setAttribute("id", this.layerId),
                n.setAttribute(
                  "mask-type",
                  this.data.td == 3 ? "luminance" : "alpha"
                ),
                n.appendChild(this.layerElement),
                (t = n),
                this.globalData.defs.appendChild(n),
                !featureSupport.maskType &&
                  this.data.td == 1 &&
                  (n.setAttribute("mask-type", "luminance"),
                  (r = createElementID()),
                  (s = filtersFactory.createFilter(r)),
                  this.globalData.defs.appendChild(s),
                  s.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                  (i = createNS("g")),
                  i.appendChild(this.layerElement),
                  (t = i),
                  n.appendChild(i),
                  i.setAttribute(
                    "filter",
                    "url(" + getLocationHref() + "#" + r + ")"
                  ));
            } else if (this.data.td == 2) {
              var a = createNS("mask");
              a.setAttribute("id", this.layerId),
                a.setAttribute("mask-type", "alpha");
              var o = createNS("g");
              a.appendChild(o),
                (r = createElementID()),
                (s = filtersFactory.createFilter(r));
              var h = createNS("feComponentTransfer");
              h.setAttribute("in", "SourceGraphic"), s.appendChild(h);
              var c = createNS("feFuncA");
              c.setAttribute("type", "table"),
                c.setAttribute("tableValues", "1.0 0.0"),
                h.appendChild(c),
                this.globalData.defs.appendChild(s);
              var m = createNS("rect");
              m.setAttribute("width", this.comp.data.w),
                m.setAttribute("height", this.comp.data.h),
                m.setAttribute("x", "0"),
                m.setAttribute("y", "0"),
                m.setAttribute("fill", "#ffffff"),
                m.setAttribute("opacity", "0"),
                o.setAttribute(
                  "filter",
                  "url(" + getLocationHref() + "#" + r + ")"
                ),
                o.appendChild(m),
                o.appendChild(this.layerElement),
                (t = o),
                featureSupport.maskType ||
                  (a.setAttribute("mask-type", "luminance"),
                  s.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                  (i = createNS("g")),
                  o.appendChild(m),
                  i.appendChild(this.layerElement),
                  (t = i),
                  o.appendChild(i)),
                this.globalData.defs.appendChild(a);
            }
          } else
            this.data.tt
              ? (this.matteElement.appendChild(this.layerElement),
                (t = this.matteElement),
                (this.baseElement = this.matteElement))
              : (this.baseElement = this.layerElement);
          if (
            (this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
            this.data.cl &&
              this.layerElement.setAttribute("class", this.data.cl),
            this.data.ty === 0 && !this.data.hd)
          ) {
            var S = createNS("clipPath"),
              u = createNS("path");
            u.setAttribute(
              "d",
              "M0,0 L" +
                this.data.w +
                ",0 L" +
                this.data.w +
                "," +
                this.data.h +
                " L0," +
                this.data.h +
                "z"
            );
            var v = createElementID();
            if (
              (S.setAttribute("id", v),
              S.appendChild(u),
              this.globalData.defs.appendChild(S),
              this.checkMasks())
            ) {
              var g = createNS("g");
              g.setAttribute(
                "clip-path",
                "url(" + getLocationHref() + "#" + v + ")"
              ),
                g.appendChild(this.layerElement),
                (this.transformedElement = g),
                t
                  ? t.appendChild(this.transformedElement)
                  : (this.baseElement = this.transformedElement);
            } else
              this.layerElement.setAttribute(
                "clip-path",
                "url(" + getLocationHref() + "#" + v + ")"
              );
          }
          this.data.bm !== 0 && this.setBlendMode();
        },
        renderElement: function () {
          this.finalTransform._matMdf &&
            this.transformedElement.setAttribute(
              "transform",
              this.finalTransform.mat.to2dCSS()
            ),
            this.finalTransform._opMdf &&
              this.transformedElement.setAttribute(
                "opacity",
                this.finalTransform.mProp.o.v
              );
        },
        destroyBaseElement: function () {
          (this.layerElement = null),
            (this.matteElement = null),
            this.maskManager.destroy();
        },
        getBaseElement: function () {
          return this.data.hd ? null : this.baseElement;
        },
        createRenderableComponents: function () {
          (this.maskManager = new MaskElement(
            this.data,
            this,
            this.globalData
          )),
            (this.renderableEffectsManager = new SVGEffects(this));
        },
        setMatte: function (t) {
          !this.matteElement ||
            this.matteElement.setAttribute(
              "mask",
              "url(" + getLocationHref() + "#" + t + ")"
            );
        },
      };
      function HierarchyElement() {}
      HierarchyElement.prototype = {
        initHierarchy: function () {
          (this.hierarchy = []), (this._isParent = !1), this.checkParenting();
        },
        setHierarchy: function (t) {
          this.hierarchy = t;
        },
        setAsParent: function () {
          this._isParent = !0;
        },
        checkParenting: function () {
          this.data.parent !== void 0 &&
            this.comp.buildElementParenting(this, this.data.parent, []);
        },
      };
      function RenderableDOMElement() {}
      (function () {
        var e = {
          initElement: function (r, s, i) {
            this.initFrame(),
              this.initBaseData(r, s, i),
              this.initTransform(r, s, i),
              this.initHierarchy(),
              this.initRenderable(),
              this.initRendererElement(),
              this.createContainerElements(),
              this.createRenderableComponents(),
              this.createContent(),
              this.hide();
          },
          hide: function () {
            if (!this.hidden && (!this.isInRange || this.isTransparent)) {
              var r = this.baseElement || this.layerElement;
              (r.style.display = "none"), (this.hidden = !0);
            }
          },
          show: function () {
            if (this.isInRange && !this.isTransparent) {
              if (!this.data.hd) {
                var r = this.baseElement || this.layerElement;
                r.style.display = "block";
              }
              (this.hidden = !1), (this._isFirstFrame = !0);
            }
          },
          renderFrame: function () {
            this.data.hd ||
              this.hidden ||
              (this.renderTransform(),
              this.renderRenderable(),
              this.renderElement(),
              this.renderInnerContent(),
              this._isFirstFrame && (this._isFirstFrame = !1));
          },
          renderInnerContent: function () {},
          prepareFrame: function (r) {
            (this._mdf = !1),
              this.prepareRenderableFrame(r),
              this.prepareProperties(r, this.isInRange),
              this.checkTransparency();
          },
          destroy: function () {
            (this.innerElem = null), this.destroyBaseElement();
          },
        };
        extendPrototype(
          [RenderableElement, createProxyFunction(e)],
          RenderableDOMElement
        );
      })();
      function IImageElement(e, t, r) {
        (this.assetData = t.getAssetData(e.refId)),
          this.initElement(e, t, r),
          (this.sourceRect = {
            top: 0,
            left: 0,
            width: this.assetData.w,
            height: this.assetData.h,
          });
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        IImageElement
      ),
        (IImageElement.prototype.createContent = function () {
          var e = this.globalData.getAssetsPath(this.assetData);
          (this.innerElem = createNS("image")),
            this.innerElem.setAttribute("width", this.assetData.w + "px"),
            this.innerElem.setAttribute("height", this.assetData.h + "px"),
            this.innerElem.setAttribute(
              "preserveAspectRatio",
              this.assetData.pr ||
                this.globalData.renderConfig.imagePreserveAspectRatio
            ),
            this.innerElem.setAttributeNS(
              "http://www.w3.org/1999/xlink",
              "href",
              e
            ),
            this.layerElement.appendChild(this.innerElem);
        }),
        (IImageElement.prototype.sourceRectAtTime = function () {
          return this.sourceRect;
        });
      function ProcessedElement(e, t) {
        (this.elem = e), (this.pos = t);
      }
      function IShapeElement() {}
      IShapeElement.prototype = {
        addShapeToModifiers: function (t) {
          var r,
            s = this.shapeModifiers.length;
          for (r = 0; r < s; r += 1) this.shapeModifiers[r].addShape(t);
        },
        isShapeInAnimatedModifiers: function (t) {
          for (var r = 0, s = this.shapeModifiers.length; r < s; )
            if (this.shapeModifiers[r].isAnimatedWithShape(t)) return !0;
          return !1;
        },
        renderModifiers: function () {
          if (!!this.shapeModifiers.length) {
            var t,
              r = this.shapes.length;
            for (t = 0; t < r; t += 1) this.shapes[t].sh.reset();
            r = this.shapeModifiers.length;
            var s;
            for (
              t = r - 1;
              t >= 0 &&
              ((s = this.shapeModifiers[t].processShapes(this._isFirstFrame)),
              !s);
              t -= 1
            );
          }
        },
        searchProcessedElement: function (t) {
          for (var r = this.processedElements, s = 0, i = r.length; s < i; ) {
            if (r[s].elem === t) return r[s].pos;
            s += 1;
          }
          return 0;
        },
        addProcessedElement: function (t, r) {
          for (var s = this.processedElements, i = s.length; i; )
            if (((i -= 1), s[i].elem === t)) {
              s[i].pos = r;
              return;
            }
          s.push(new ProcessedElement(t, r));
        },
        prepareFrame: function (t) {
          this.prepareRenderableFrame(t),
            this.prepareProperties(t, this.isInRange);
        },
      };
      var lineCapEnum = { 1: "butt", 2: "round", 3: "square" },
        lineJoinEnum = { 1: "miter", 2: "round", 3: "bevel" };
      function SVGShapeData(e, t, r) {
        (this.caches = []),
          (this.styles = []),
          (this.transformers = e),
          (this.lStr = ""),
          (this.sh = r),
          (this.lvl = t),
          (this._isAnimated = !!r.k);
        for (var s = 0, i = e.length; s < i; ) {
          if (e[s].mProps.dynamicProperties.length) {
            this._isAnimated = !0;
            break;
          }
          s += 1;
        }
      }
      SVGShapeData.prototype.setAsAnimated = function () {
        this._isAnimated = !0;
      };
      function SVGStyleData(e, t) {
        (this.data = e),
          (this.type = e.ty),
          (this.d = ""),
          (this.lvl = t),
          (this._mdf = !1),
          (this.closed = e.hd === !0),
          (this.pElem = createNS("path")),
          (this.msElem = null);
      }
      SVGStyleData.prototype.reset = function () {
        (this.d = ""), (this._mdf = !1);
      };
      function DashProperty(e, t, r, s) {
        (this.elem = e),
          (this.frameId = -1),
          (this.dataProps = createSizedArray(t.length)),
          (this.renderer = r),
          (this.k = !1),
          (this.dashStr = ""),
          (this.dashArray = createTypedArray(
            "float32",
            t.length ? t.length - 1 : 0
          )),
          (this.dashoffset = createTypedArray("float32", 1)),
          this.initDynamicPropertyContainer(s);
        var i,
          n = t.length || 0,
          a;
        for (i = 0; i < n; i += 1)
          (a = PropertyFactory.getProp(e, t[i].v, 0, 0, this)),
            (this.k = a.k || this.k),
            (this.dataProps[i] = { n: t[i].n, p: a });
        this.k || this.getValue(!0), (this._isAnimated = this.k);
      }
      (DashProperty.prototype.getValue = function (e) {
        if (
          !(this.elem.globalData.frameId === this.frameId && !e) &&
          ((this.frameId = this.elem.globalData.frameId),
          this.iterateDynamicProperties(),
          (this._mdf = this._mdf || e),
          this._mdf)
        ) {
          var t = 0,
            r = this.dataProps.length;
          for (
            this.renderer === "svg" && (this.dashStr = ""), t = 0;
            t < r;
            t += 1
          )
            this.dataProps[t].n !== "o"
              ? this.renderer === "svg"
                ? (this.dashStr += " " + this.dataProps[t].p.v)
                : (this.dashArray[t] = this.dataProps[t].p.v)
              : (this.dashoffset[0] = this.dataProps[t].p.v);
        }
      }),
        extendPrototype([DynamicPropertyContainer], DashProperty);
      function SVGStrokeStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
          (this.w = PropertyFactory.getProp(e, t.w, 0, null, this)),
          (this.d = new DashProperty(e, t.d || {}, "svg", this)),
          (this.c = PropertyFactory.getProp(e, t.c, 1, 255, this)),
          (this.style = r),
          (this._isAnimated = !!this._isAnimated);
      }
      extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData);
      function SVGFillStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
          (this.c = PropertyFactory.getProp(e, t.c, 1, 255, this)),
          (this.style = r);
      }
      extendPrototype([DynamicPropertyContainer], SVGFillStyleData);
      function SVGNoStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          (this.style = r);
      }
      extendPrototype([DynamicPropertyContainer], SVGNoStyleData);
      function GradientProperty(e, t, r) {
        (this.data = t), (this.c = createTypedArray("uint8c", t.p * 4));
        var s = t.k.k[0].s
          ? t.k.k[0].s.length - t.p * 4
          : t.k.k.length - t.p * 4;
        (this.o = createTypedArray("float32", s)),
          (this._cmdf = !1),
          (this._omdf = !1),
          (this._collapsable = this.checkCollapsable()),
          (this._hasOpacity = s),
          this.initDynamicPropertyContainer(r),
          (this.prop = PropertyFactory.getProp(e, t.k, 1, null, this)),
          (this.k = this.prop.k),
          this.getValue(!0);
      }
      (GradientProperty.prototype.comparePoints = function (e, t) {
        for (var r = 0, s = this.o.length / 2, i; r < s; ) {
          if (((i = Math.abs(e[r * 4] - e[t * 4 + r * 2])), i > 0.01))
            return !1;
          r += 1;
        }
        return !0;
      }),
        (GradientProperty.prototype.checkCollapsable = function () {
          if (this.o.length / 2 !== this.c.length / 4) return !1;
          if (this.data.k.k[0].s)
            for (var e = 0, t = this.data.k.k.length; e < t; ) {
              if (!this.comparePoints(this.data.k.k[e].s, this.data.p))
                return !1;
              e += 1;
            }
          else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
          return !0;
        }),
        (GradientProperty.prototype.getValue = function (e) {
          if (
            (this.prop.getValue(),
            (this._mdf = !1),
            (this._cmdf = !1),
            (this._omdf = !1),
            this.prop._mdf || e)
          ) {
            var t,
              r = this.data.p * 4,
              s,
              i;
            for (t = 0; t < r; t += 1)
              (s = t % 4 === 0 ? 100 : 255),
                (i = Math.round(this.prop.v[t] * s)),
                this.c[t] !== i && ((this.c[t] = i), (this._cmdf = !e));
            if (this.o.length)
              for (r = this.prop.v.length, t = this.data.p * 4; t < r; t += 1)
                (s = t % 2 === 0 ? 100 : 1),
                  (i =
                    t % 2 === 0
                      ? Math.round(this.prop.v[t] * 100)
                      : this.prop.v[t]),
                  this.o[t - this.data.p * 4] !== i &&
                    ((this.o[t - this.data.p * 4] = i), (this._omdf = !e));
            this._mdf = !e;
          }
        }),
        extendPrototype([DynamicPropertyContainer], GradientProperty);
      function SVGGradientFillStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          this.initGradientData(e, t, r);
      }
      (SVGGradientFillStyleData.prototype.initGradientData = function (
        e,
        t,
        r
      ) {
        (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
          (this.s = PropertyFactory.getProp(e, t.s, 1, null, this)),
          (this.e = PropertyFactory.getProp(e, t.e, 1, null, this)),
          (this.h = PropertyFactory.getProp(e, t.h || { k: 0 }, 0, 0.01, this)),
          (this.a = PropertyFactory.getProp(
            e,
            t.a || { k: 0 },
            0,
            degToRads,
            this
          )),
          (this.g = new GradientProperty(e, t.g, this)),
          (this.style = r),
          (this.stops = []),
          this.setGradientData(r.pElem, t),
          this.setGradientOpacity(t, r),
          (this._isAnimated = !!this._isAnimated);
      }),
        (SVGGradientFillStyleData.prototype.setGradientData = function (e, t) {
          var r = createElementID(),
            s = createNS(t.t === 1 ? "linearGradient" : "radialGradient");
          s.setAttribute("id", r),
            s.setAttribute("spreadMethod", "pad"),
            s.setAttribute("gradientUnits", "userSpaceOnUse");
          var i = [],
            n,
            a,
            o;
          for (o = t.g.p * 4, a = 0; a < o; a += 4)
            (n = createNS("stop")), s.appendChild(n), i.push(n);
          e.setAttribute(
            t.ty === "gf" ? "fill" : "stroke",
            "url(" + getLocationHref() + "#" + r + ")"
          ),
            (this.gf = s),
            (this.cst = i);
        }),
        (SVGGradientFillStyleData.prototype.setGradientOpacity = function (
          e,
          t
        ) {
          if (this.g._hasOpacity && !this.g._collapsable) {
            var r,
              s,
              i,
              n = createNS("mask"),
              a = createNS("path");
            n.appendChild(a);
            var o = createElementID(),
              h = createElementID();
            n.setAttribute("id", h);
            var c = createNS(e.t === 1 ? "linearGradient" : "radialGradient");
            c.setAttribute("id", o),
              c.setAttribute("spreadMethod", "pad"),
              c.setAttribute("gradientUnits", "userSpaceOnUse"),
              (i = e.g.k.k[0].s ? e.g.k.k[0].s.length : e.g.k.k.length);
            var m = this.stops;
            for (s = e.g.p * 4; s < i; s += 2)
              (r = createNS("stop")),
                r.setAttribute("stop-color", "rgb(255,255,255)"),
                c.appendChild(r),
                m.push(r);
            a.setAttribute(
              e.ty === "gf" ? "fill" : "stroke",
              "url(" + getLocationHref() + "#" + o + ")"
            ),
              e.ty === "gs" &&
                (a.setAttribute("stroke-linecap", lineCapEnum[e.lc || 2]),
                a.setAttribute("stroke-linejoin", lineJoinEnum[e.lj || 2]),
                e.lj === 1 && a.setAttribute("stroke-miterlimit", e.ml)),
              (this.of = c),
              (this.ms = n),
              (this.ost = m),
              (this.maskId = h),
              (t.msElem = a);
          }
        }),
        extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData);
      function SVGGradientStrokeStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          (this.w = PropertyFactory.getProp(e, t.w, 0, null, this)),
          (this.d = new DashProperty(e, t.d || {}, "svg", this)),
          this.initGradientData(e, t, r),
          (this._isAnimated = !!this._isAnimated);
      }
      extendPrototype(
        [SVGGradientFillStyleData, DynamicPropertyContainer],
        SVGGradientStrokeStyleData
      );
      function ShapeGroupData() {
        (this.it = []), (this.prevViewData = []), (this.gr = createNS("g"));
      }
      function SVGTransformData(e, t, r) {
        (this.transform = { mProps: e, op: t, container: r }),
          (this.elements = []),
          (this._isAnimated =
            this.transform.mProps.dynamicProperties.length ||
            this.transform.op.effectsSequence.length);
      }
      var buildShapeString = function (t, r, s, i) {
          if (r === 0) return "";
          var n = t.o,
            a = t.i,
            o = t.v,
            h,
            c = " M" + i.applyToPointStringified(o[0][0], o[0][1]);
          for (h = 1; h < r; h += 1)
            c +=
              " C" +
              i.applyToPointStringified(n[h - 1][0], n[h - 1][1]) +
              " " +
              i.applyToPointStringified(a[h][0], a[h][1]) +
              " " +
              i.applyToPointStringified(o[h][0], o[h][1]);
          return (
            s &&
              r &&
              ((c +=
                " C" +
                i.applyToPointStringified(n[h - 1][0], n[h - 1][1]) +
                " " +
                i.applyToPointStringified(a[0][0], a[0][1]) +
                " " +
                i.applyToPointStringified(o[0][0], o[0][1])),
              (c += "z")),
            c
          );
        },
        SVGElementsRenderer = (function () {
          var e = new Matrix(),
            t = new Matrix(),
            r = { createRenderFunction: s };
          function s(S) {
            switch (S.ty) {
              case "fl":
                return o;
              case "gf":
                return c;
              case "gs":
                return h;
              case "st":
                return m;
              case "sh":
              case "el":
              case "rc":
              case "sr":
                return a;
              case "tr":
                return i;
              case "no":
                return n;
              default:
                return null;
            }
          }
          function i(S, u, v) {
            (v || u.transform.op._mdf) &&
              u.transform.container.setAttribute("opacity", u.transform.op.v),
              (v || u.transform.mProps._mdf) &&
                u.transform.container.setAttribute(
                  "transform",
                  u.transform.mProps.v.to2dCSS()
                );
          }
          function n() {}
          function a(S, u, v) {
            var g,
              y,
              E,
              l,
              d,
              p,
              f = u.styles.length,
              b = u.lvl,
              x,
              $,
              _,
              A,
              L;
            for (p = 0; p < f; p += 1) {
              if (((l = u.sh._mdf || v), u.styles[p].lvl < b)) {
                for (
                  $ = t.reset(),
                    A = b - u.styles[p].lvl,
                    L = u.transformers.length - 1;
                  !l && A > 0;

                )
                  (l = u.transformers[L].mProps._mdf || l), (A -= 1), (L -= 1);
                if (l)
                  for (
                    A = b - u.styles[p].lvl, L = u.transformers.length - 1;
                    A > 0;

                  )
                    (_ = u.transformers[L].mProps.v.props),
                      $.transform(
                        _[0],
                        _[1],
                        _[2],
                        _[3],
                        _[4],
                        _[5],
                        _[6],
                        _[7],
                        _[8],
                        _[9],
                        _[10],
                        _[11],
                        _[12],
                        _[13],
                        _[14],
                        _[15]
                      ),
                      (A -= 1),
                      (L -= 1);
              } else $ = e;
              if (((x = u.sh.paths), (y = x._length), l)) {
                for (E = "", g = 0; g < y; g += 1)
                  (d = x.shapes[g]),
                    d &&
                      d._length &&
                      (E += buildShapeString(d, d._length, d.c, $));
                u.caches[p] = E;
              } else E = u.caches[p];
              (u.styles[p].d += S.hd === !0 ? "" : E),
                (u.styles[p]._mdf = l || u.styles[p]._mdf);
            }
          }
          function o(S, u, v) {
            var g = u.style;
            (u.c._mdf || v) &&
              g.pElem.setAttribute(
                "fill",
                "rgb(" +
                  bmFloor(u.c.v[0]) +
                  "," +
                  bmFloor(u.c.v[1]) +
                  "," +
                  bmFloor(u.c.v[2]) +
                  ")"
              ),
              (u.o._mdf || v) && g.pElem.setAttribute("fill-opacity", u.o.v);
          }
          function h(S, u, v) {
            c(S, u, v), m(S, u, v);
          }
          function c(S, u, v) {
            var g = u.gf,
              y = u.g._hasOpacity,
              E = u.s.v,
              l = u.e.v;
            if (u.o._mdf || v) {
              var d = S.ty === "gf" ? "fill-opacity" : "stroke-opacity";
              u.style.pElem.setAttribute(d, u.o.v);
            }
            if (u.s._mdf || v) {
              var p = S.t === 1 ? "x1" : "cx",
                f = p === "x1" ? "y1" : "cy";
              g.setAttribute(p, E[0]),
                g.setAttribute(f, E[1]),
                y &&
                  !u.g._collapsable &&
                  (u.of.setAttribute(p, E[0]), u.of.setAttribute(f, E[1]));
            }
            var b, x, $, _;
            if (u.g._cmdf || v) {
              b = u.cst;
              var A = u.g.c;
              for ($ = b.length, x = 0; x < $; x += 1)
                (_ = b[x]),
                  _.setAttribute("offset", A[x * 4] + "%"),
                  _.setAttribute(
                    "stop-color",
                    "rgb(" +
                      A[x * 4 + 1] +
                      "," +
                      A[x * 4 + 2] +
                      "," +
                      A[x * 4 + 3] +
                      ")"
                  );
            }
            if (y && (u.g._omdf || v)) {
              var L = u.g.o;
              for (
                u.g._collapsable ? (b = u.cst) : (b = u.ost),
                  $ = b.length,
                  x = 0;
                x < $;
                x += 1
              )
                (_ = b[x]),
                  u.g._collapsable || _.setAttribute("offset", L[x * 2] + "%"),
                  _.setAttribute("stop-opacity", L[x * 2 + 1]);
            }
            if (S.t === 1)
              (u.e._mdf || v) &&
                (g.setAttribute("x2", l[0]),
                g.setAttribute("y2", l[1]),
                y &&
                  !u.g._collapsable &&
                  (u.of.setAttribute("x2", l[0]),
                  u.of.setAttribute("y2", l[1])));
            else {
              var F;
              if (
                ((u.s._mdf || u.e._mdf || v) &&
                  ((F = Math.sqrt(
                    Math.pow(E[0] - l[0], 2) + Math.pow(E[1] - l[1], 2)
                  )),
                  g.setAttribute("r", F),
                  y && !u.g._collapsable && u.of.setAttribute("r", F)),
                u.e._mdf || u.h._mdf || u.a._mdf || v)
              ) {
                F ||
                  (F = Math.sqrt(
                    Math.pow(E[0] - l[0], 2) + Math.pow(E[1] - l[1], 2)
                  ));
                var M = Math.atan2(l[1] - E[1], l[0] - E[0]),
                  D = u.h.v;
                D >= 1 ? (D = 0.99) : D <= -1 && (D = -0.99);
                var V = F * D,
                  T = Math.cos(M + u.a.v) * V + E[0],
                  k = Math.sin(M + u.a.v) * V + E[1];
                g.setAttribute("fx", T),
                  g.setAttribute("fy", k),
                  y &&
                    !u.g._collapsable &&
                    (u.of.setAttribute("fx", T), u.of.setAttribute("fy", k));
              }
            }
          }
          function m(S, u, v) {
            var g = u.style,
              y = u.d;
            y &&
              (y._mdf || v) &&
              y.dashStr &&
              (g.pElem.setAttribute("stroke-dasharray", y.dashStr),
              g.pElem.setAttribute("stroke-dashoffset", y.dashoffset[0])),
              u.c &&
                (u.c._mdf || v) &&
                g.pElem.setAttribute(
                  "stroke",
                  "rgb(" +
                    bmFloor(u.c.v[0]) +
                    "," +
                    bmFloor(u.c.v[1]) +
                    "," +
                    bmFloor(u.c.v[2]) +
                    ")"
                ),
              (u.o._mdf || v) && g.pElem.setAttribute("stroke-opacity", u.o.v),
              (u.w._mdf || v) &&
                (g.pElem.setAttribute("stroke-width", u.w.v),
                g.msElem && g.msElem.setAttribute("stroke-width", u.w.v));
          }
          return r;
        })();
      function SVGShapeElement(e, t, r) {
        (this.shapes = []),
          (this.shapesData = e.shapes),
          (this.stylesList = []),
          (this.shapeModifiers = []),
          (this.itemsData = []),
          (this.processedElements = []),
          (this.animatedContents = []),
          this.initElement(e, t, r),
          (this.prevViewData = []);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          IShapeElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        SVGShapeElement
      ),
        (SVGShapeElement.prototype.initSecondaryElement = function () {}),
        (SVGShapeElement.prototype.identityMatrix = new Matrix()),
        (SVGShapeElement.prototype.buildExpressionInterface = function () {}),
        (SVGShapeElement.prototype.createContent = function () {
          this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            this.layerElement,
            0,
            [],
            !0
          ),
            this.filterUniqueShapes();
        }),
        (SVGShapeElement.prototype.filterUniqueShapes = function () {
          var e,
            t = this.shapes.length,
            r,
            s,
            i = this.stylesList.length,
            n,
            a = [],
            o = !1;
          for (s = 0; s < i; s += 1) {
            for (
              n = this.stylesList[s], o = !1, a.length = 0, e = 0;
              e < t;
              e += 1
            )
              (r = this.shapes[e]),
                r.styles.indexOf(n) !== -1 &&
                  (a.push(r), (o = r._isAnimated || o));
            a.length > 1 && o && this.setShapesAsAnimated(a);
          }
        }),
        (SVGShapeElement.prototype.setShapesAsAnimated = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1) e[t].setAsAnimated();
        }),
        (SVGShapeElement.prototype.createStyleElement = function (e, t) {
          var r,
            s = new SVGStyleData(e, t),
            i = s.pElem;
          if (e.ty === "st") r = new SVGStrokeStyleData(this, e, s);
          else if (e.ty === "fl") r = new SVGFillStyleData(this, e, s);
          else if (e.ty === "gf" || e.ty === "gs") {
            var n =
              e.ty === "gf"
                ? SVGGradientFillStyleData
                : SVGGradientStrokeStyleData;
            (r = new n(this, e, s)),
              this.globalData.defs.appendChild(r.gf),
              r.maskId &&
                (this.globalData.defs.appendChild(r.ms),
                this.globalData.defs.appendChild(r.of),
                i.setAttribute(
                  "mask",
                  "url(" + getLocationHref() + "#" + r.maskId + ")"
                ));
          } else e.ty === "no" && (r = new SVGNoStyleData(this, e, s));
          return (
            (e.ty === "st" || e.ty === "gs") &&
              (i.setAttribute("stroke-linecap", lineCapEnum[e.lc || 2]),
              i.setAttribute("stroke-linejoin", lineJoinEnum[e.lj || 2]),
              i.setAttribute("fill-opacity", "0"),
              e.lj === 1 && i.setAttribute("stroke-miterlimit", e.ml)),
            e.r === 2 && i.setAttribute("fill-rule", "evenodd"),
            e.ln && i.setAttribute("id", e.ln),
            e.cl && i.setAttribute("class", e.cl),
            e.bm && (i.style["mix-blend-mode"] = getBlendMode(e.bm)),
            this.stylesList.push(s),
            this.addToAnimatedContents(e, r),
            r
          );
        }),
        (SVGShapeElement.prototype.createGroupElement = function (e) {
          var t = new ShapeGroupData();
          return (
            e.ln && t.gr.setAttribute("id", e.ln),
            e.cl && t.gr.setAttribute("class", e.cl),
            e.bm && (t.gr.style["mix-blend-mode"] = getBlendMode(e.bm)),
            t
          );
        }),
        (SVGShapeElement.prototype.createTransformElement = function (e, t) {
          var r = TransformPropertyFactory.getTransformProperty(this, e, this),
            s = new SVGTransformData(r, r.o, t);
          return this.addToAnimatedContents(e, s), s;
        }),
        (SVGShapeElement.prototype.createShapeElement = function (e, t, r) {
          var s = 4;
          e.ty === "rc"
            ? (s = 5)
            : e.ty === "el"
            ? (s = 6)
            : e.ty === "sr" && (s = 7);
          var i = ShapePropertyFactory.getShapeProp(this, e, s, this),
            n = new SVGShapeData(t, r, i);
          return (
            this.shapes.push(n),
            this.addShapeToModifiers(n),
            this.addToAnimatedContents(e, n),
            n
          );
        }),
        (SVGShapeElement.prototype.addToAnimatedContents = function (e, t) {
          for (var r = 0, s = this.animatedContents.length; r < s; ) {
            if (this.animatedContents[r].element === t) return;
            r += 1;
          }
          this.animatedContents.push({
            fn: SVGElementsRenderer.createRenderFunction(e),
            element: t,
            data: e,
          });
        }),
        (SVGShapeElement.prototype.setElementStyles = function (e) {
          var t = e.styles,
            r,
            s = this.stylesList.length;
          for (r = 0; r < s; r += 1)
            this.stylesList[r].closed || t.push(this.stylesList[r]);
        }),
        (SVGShapeElement.prototype.reloadShapes = function () {
          this._isFirstFrame = !0;
          var e,
            t = this.itemsData.length;
          for (e = 0; e < t; e += 1) this.prevViewData[e] = this.itemsData[e];
          for (
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              this.layerElement,
              0,
              [],
              !0
            ),
              this.filterUniqueShapes(),
              t = this.dynamicProperties.length,
              e = 0;
            e < t;
            e += 1
          )
            this.dynamicProperties[e].getValue();
          this.renderModifiers();
        }),
        (SVGShapeElement.prototype.searchShapes = function (
          e,
          t,
          r,
          s,
          i,
          n,
          a
        ) {
          var o = [].concat(n),
            h,
            c = e.length - 1,
            m,
            S,
            u = [],
            v = [],
            g,
            y,
            E;
          for (h = c; h >= 0; h -= 1) {
            if (
              ((E = this.searchProcessedElement(e[h])),
              E ? (t[h] = r[E - 1]) : (e[h]._render = a),
              e[h].ty === "fl" ||
                e[h].ty === "st" ||
                e[h].ty === "gf" ||
                e[h].ty === "gs" ||
                e[h].ty === "no")
            )
              E
                ? (t[h].style.closed = !1)
                : (t[h] = this.createStyleElement(e[h], i)),
                e[h]._render &&
                  t[h].style.pElem.parentNode !== s &&
                  s.appendChild(t[h].style.pElem),
                u.push(t[h].style);
            else if (e[h].ty === "gr") {
              if (!E) t[h] = this.createGroupElement(e[h]);
              else
                for (S = t[h].it.length, m = 0; m < S; m += 1)
                  t[h].prevViewData[m] = t[h].it[m];
              this.searchShapes(
                e[h].it,
                t[h].it,
                t[h].prevViewData,
                t[h].gr,
                i + 1,
                o,
                a
              ),
                e[h]._render &&
                  t[h].gr.parentNode !== s &&
                  s.appendChild(t[h].gr);
            } else
              e[h].ty === "tr"
                ? (E || (t[h] = this.createTransformElement(e[h], s)),
                  (g = t[h].transform),
                  o.push(g))
                : e[h].ty === "sh" ||
                  e[h].ty === "rc" ||
                  e[h].ty === "el" ||
                  e[h].ty === "sr"
                ? (E || (t[h] = this.createShapeElement(e[h], o, i)),
                  this.setElementStyles(t[h]))
                : e[h].ty === "tm" ||
                  e[h].ty === "rd" ||
                  e[h].ty === "ms" ||
                  e[h].ty === "pb"
                ? (E
                    ? ((y = t[h]), (y.closed = !1))
                    : ((y = ShapeModifiers.getModifier(e[h].ty)),
                      y.init(this, e[h]),
                      (t[h] = y),
                      this.shapeModifiers.push(y)),
                  v.push(y))
                : e[h].ty === "rp" &&
                  (E
                    ? ((y = t[h]), (y.closed = !0))
                    : ((y = ShapeModifiers.getModifier(e[h].ty)),
                      (t[h] = y),
                      y.init(this, e, h, t),
                      this.shapeModifiers.push(y),
                      (a = !1)),
                  v.push(y));
            this.addProcessedElement(e[h], h + 1);
          }
          for (c = u.length, h = 0; h < c; h += 1) u[h].closed = !0;
          for (c = v.length, h = 0; h < c; h += 1) v[h].closed = !0;
        }),
        (SVGShapeElement.prototype.renderInnerContent = function () {
          this.renderModifiers();
          var e,
            t = this.stylesList.length;
          for (e = 0; e < t; e += 1) this.stylesList[e].reset();
          for (this.renderShape(), e = 0; e < t; e += 1)
            (this.stylesList[e]._mdf || this._isFirstFrame) &&
              (this.stylesList[e].msElem &&
                (this.stylesList[e].msElem.setAttribute(
                  "d",
                  this.stylesList[e].d
                ),
                (this.stylesList[e].d = "M0 0" + this.stylesList[e].d)),
              this.stylesList[e].pElem.setAttribute(
                "d",
                this.stylesList[e].d || "M0 0"
              ));
        }),
        (SVGShapeElement.prototype.renderShape = function () {
          var e,
            t = this.animatedContents.length,
            r;
          for (e = 0; e < t; e += 1)
            (r = this.animatedContents[e]),
              (this._isFirstFrame || r.element._isAnimated) &&
                r.data !== !0 &&
                r.fn(r.data, r.element, this._isFirstFrame);
        }),
        (SVGShapeElement.prototype.destroy = function () {
          this.destroyBaseElement(),
            (this.shapesData = null),
            (this.itemsData = null);
        });
      function LetterProps(e, t, r, s, i, n) {
        (this.o = e),
          (this.sw = t),
          (this.sc = r),
          (this.fc = s),
          (this.m = i),
          (this.p = n),
          (this._mdf = { o: !0, sw: !!t, sc: !!r, fc: !!s, m: !0, p: !0 });
      }
      LetterProps.prototype.update = function (e, t, r, s, i, n) {
        (this._mdf.o = !1),
          (this._mdf.sw = !1),
          (this._mdf.sc = !1),
          (this._mdf.fc = !1),
          (this._mdf.m = !1),
          (this._mdf.p = !1);
        var a = !1;
        return (
          this.o !== e && ((this.o = e), (this._mdf.o = !0), (a = !0)),
          this.sw !== t && ((this.sw = t), (this._mdf.sw = !0), (a = !0)),
          this.sc !== r && ((this.sc = r), (this._mdf.sc = !0), (a = !0)),
          this.fc !== s && ((this.fc = s), (this._mdf.fc = !0), (a = !0)),
          this.m !== i && ((this.m = i), (this._mdf.m = !0), (a = !0)),
          n.length &&
            (this.p[0] !== n[0] ||
              this.p[1] !== n[1] ||
              this.p[4] !== n[4] ||
              this.p[5] !== n[5] ||
              this.p[12] !== n[12] ||
              this.p[13] !== n[13]) &&
            ((this.p = n), (this._mdf.p = !0), (a = !0)),
          a
        );
      };
      function TextProperty(e, t) {
        (this._frameId = initialDefaultFrame),
          (this.pv = ""),
          (this.v = ""),
          (this.kf = !1),
          (this._isFirstFrame = !0),
          (this._mdf = !1),
          (this.data = t),
          (this.elem = e),
          (this.comp = this.elem.comp),
          (this.keysIndex = 0),
          (this.canResize = !1),
          (this.minimumFontSize = 1),
          (this.effectsSequence = []),
          (this.currentData = {
            ascent: 0,
            boxWidth: this.defaultBoxWidth,
            f: "",
            fStyle: "",
            fWeight: "",
            fc: "",
            j: "",
            justifyOffset: "",
            l: [],
            lh: 0,
            lineWidths: [],
            ls: "",
            of: "",
            s: "",
            sc: "",
            sw: 0,
            t: 0,
            tr: 0,
            sz: 0,
            ps: null,
            fillColorAnim: !1,
            strokeColorAnim: !1,
            strokeWidthAnim: !1,
            yOffset: 0,
            finalSize: 0,
            finalText: [],
            finalLineHeight: 0,
            __complete: !1,
          }),
          this.copyData(this.currentData, this.data.d.k[0].s),
          this.searchProperty() || this.completeTextData(this.currentData);
      }
      (TextProperty.prototype.defaultBoxWidth = [0, 0]),
        (TextProperty.prototype.copyData = function (e, t) {
          for (var r in t)
            Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
          return e;
        }),
        (TextProperty.prototype.setCurrentData = function (e) {
          e.__complete || this.completeTextData(e),
            (this.currentData = e),
            (this.currentData.boxWidth =
              this.currentData.boxWidth || this.defaultBoxWidth),
            (this._mdf = !0);
        }),
        (TextProperty.prototype.searchProperty = function () {
          return this.searchKeyframes();
        }),
        (TextProperty.prototype.searchKeyframes = function () {
          return (
            (this.kf = this.data.d.k.length > 1),
            this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
            this.kf
          );
        }),
        (TextProperty.prototype.addEffect = function (e) {
          this.effectsSequence.push(e), this.elem.addDynamicProperty(this);
        }),
        (TextProperty.prototype.getValue = function (e) {
          if (
            !(
              (this.elem.globalData.frameId === this.frameId ||
                !this.effectsSequence.length) &&
              !e
            )
          ) {
            this.currentData.t = this.data.d.k[this.keysIndex].s.t;
            var t = this.currentData,
              r = this.keysIndex;
            if (this.lock) {
              this.setCurrentData(this.currentData);
              return;
            }
            (this.lock = !0), (this._mdf = !1);
            var s,
              i = this.effectsSequence.length,
              n = e || this.data.d.k[this.keysIndex].s;
            for (s = 0; s < i; s += 1)
              r !== this.keysIndex
                ? (n = this.effectsSequence[s](n, n.t))
                : (n = this.effectsSequence[s](this.currentData, n.t));
            t !== n && this.setCurrentData(n),
              (this.v = this.currentData),
              (this.pv = this.v),
              (this.lock = !1),
              (this.frameId = this.elem.globalData.frameId);
          }
        }),
        (TextProperty.prototype.getKeyframeValue = function () {
          for (
            var e = this.data.d.k,
              t = this.elem.comp.renderedFrame,
              r = 0,
              s = e.length;
            r <= s - 1 && !(r === s - 1 || e[r + 1].t > t);

          )
            r += 1;
          return (
            this.keysIndex !== r && (this.keysIndex = r),
            this.data.d.k[this.keysIndex].s
          );
        }),
        (TextProperty.prototype.buildFinalText = function (e) {
          for (var t = [], r = 0, s = e.length, i, n, a = !1; r < s; )
            (i = e.charCodeAt(r)),
              FontManager.isCombinedCharacter(i)
                ? (t[t.length - 1] += e.charAt(r))
                : i >= 55296 && i <= 56319
                ? ((n = e.charCodeAt(r + 1)),
                  n >= 56320 && n <= 57343
                    ? (a || FontManager.isModifier(i, n)
                        ? ((t[t.length - 1] += e.substr(r, 2)), (a = !1))
                        : t.push(e.substr(r, 2)),
                      (r += 1))
                    : t.push(e.charAt(r)))
                : i > 56319
                ? ((n = e.charCodeAt(r + 1)),
                  FontManager.isZeroWidthJoiner(i, n)
                    ? ((a = !0), (t[t.length - 1] += e.substr(r, 2)), (r += 1))
                    : t.push(e.charAt(r)))
                : FontManager.isZeroWidthJoiner(i)
                ? ((t[t.length - 1] += e.charAt(r)), (a = !0))
                : t.push(e.charAt(r)),
              (r += 1);
          return t;
        }),
        (TextProperty.prototype.completeTextData = function (e) {
          e.__complete = !0;
          var t = this.elem.globalData.fontManager,
            r = this.data,
            s = [],
            i,
            n,
            a,
            o = 0,
            h,
            c = r.m.g,
            m = 0,
            S = 0,
            u = 0,
            v = [],
            g = 0,
            y = 0,
            E,
            l,
            d = t.getFontByName(e.f),
            p,
            f = 0,
            b = getFontProperties(d);
          (e.fWeight = b.weight),
            (e.fStyle = b.style),
            (e.finalSize = e.s),
            (e.finalText = this.buildFinalText(e.t)),
            (n = e.finalText.length),
            (e.finalLineHeight = e.lh);
          var x = (e.tr / 1e3) * e.finalSize,
            $;
          if (e.sz)
            for (var _ = !0, A = e.sz[0], L = e.sz[1], F, M; _; ) {
              (M = this.buildFinalText(e.t)),
                (F = 0),
                (g = 0),
                (n = M.length),
                (x = (e.tr / 1e3) * e.finalSize);
              var D = -1;
              for (i = 0; i < n; i += 1)
                ($ = M[i].charCodeAt(0)),
                  (a = !1),
                  M[i] === " "
                    ? (D = i)
                    : ($ === 13 || $ === 3) &&
                      ((g = 0),
                      (a = !0),
                      (F += e.finalLineHeight || e.finalSize * 1.2)),
                  t.chars
                    ? ((p = t.getCharData(M[i], d.fStyle, d.fFamily)),
                      (f = a ? 0 : (p.w * e.finalSize) / 100))
                    : (f = t.measureText(M[i], e.f, e.finalSize)),
                  g + f > A && M[i] !== " "
                    ? (D === -1 ? (n += 1) : (i = D),
                      (F += e.finalLineHeight || e.finalSize * 1.2),
                      M.splice(i, D === i ? 1 : 0, "\r"),
                      (D = -1),
                      (g = 0))
                    : ((g += f), (g += x));
              (F += (d.ascent * e.finalSize) / 100),
                this.canResize && e.finalSize > this.minimumFontSize && L < F
                  ? ((e.finalSize -= 1),
                    (e.finalLineHeight = (e.finalSize * e.lh) / e.s))
                  : ((e.finalText = M), (n = e.finalText.length), (_ = !1));
            }
          (g = -x), (f = 0);
          var V = 0,
            T;
          for (i = 0; i < n; i += 1)
            if (
              ((a = !1),
              (T = e.finalText[i]),
              ($ = T.charCodeAt(0)),
              $ === 13 || $ === 3
                ? ((V = 0),
                  v.push(g),
                  (y = g > y ? g : y),
                  (g = -2 * x),
                  (h = ""),
                  (a = !0),
                  (u += 1))
                : (h = T),
              t.chars
                ? ((p = t.getCharData(
                    T,
                    d.fStyle,
                    t.getFontByName(e.f).fFamily
                  )),
                  (f = a ? 0 : (p.w * e.finalSize) / 100))
                : (f = t.measureText(h, e.f, e.finalSize)),
              T === " " ? (V += f + x) : ((g += f + x + V), (V = 0)),
              s.push({
                l: f,
                an: f,
                add: m,
                n: a,
                anIndexes: [],
                val: h,
                line: u,
                animatorJustifyOffset: 0,
              }),
              c == 2)
            ) {
              if (((m += f), h === "" || h === " " || i === n - 1)) {
                for ((h === "" || h === " ") && (m -= f); S <= i; )
                  (s[S].an = m), (s[S].ind = o), (s[S].extra = f), (S += 1);
                (o += 1), (m = 0);
              }
            } else if (c == 3) {
              if (((m += f), h === "" || i === n - 1)) {
                for (h === "" && (m -= f); S <= i; )
                  (s[S].an = m), (s[S].ind = o), (s[S].extra = f), (S += 1);
                (m = 0), (o += 1);
              }
            } else (s[o].ind = o), (s[o].extra = 0), (o += 1);
          if (((e.l = s), (y = g > y ? g : y), v.push(g), e.sz))
            (e.boxWidth = e.sz[0]), (e.justifyOffset = 0);
          else
            switch (((e.boxWidth = y), e.j)) {
              case 1:
                e.justifyOffset = -e.boxWidth;
                break;
              case 2:
                e.justifyOffset = -e.boxWidth / 2;
                break;
              default:
                e.justifyOffset = 0;
            }
          e.lineWidths = v;
          var k = r.a,
            C,
            P;
          l = k.length;
          var w,
            R,
            I = [];
          for (E = 0; E < l; E += 1) {
            for (
              C = k[E],
                C.a.sc && (e.strokeColorAnim = !0),
                C.a.sw && (e.strokeWidthAnim = !0),
                (C.a.fc || C.a.fh || C.a.fs || C.a.fb) &&
                  (e.fillColorAnim = !0),
                R = 0,
                w = C.s.b,
                i = 0;
              i < n;
              i += 1
            )
              (P = s[i]),
                (P.anIndexes[E] = R),
                ((w == 1 && P.val !== "") ||
                  (w == 2 && P.val !== "" && P.val !== " ") ||
                  (w == 3 && (P.n || P.val == " " || i == n - 1)) ||
                  (w == 4 && (P.n || i == n - 1))) &&
                  (C.s.rn === 1 && I.push(R), (R += 1));
            r.a[E].s.totalChars = R;
            var q = -1,
              N;
            if (C.s.rn === 1)
              for (i = 0; i < n; i += 1)
                (P = s[i]),
                  q != P.anIndexes[E] &&
                    ((q = P.anIndexes[E]),
                    (N = I.splice(Math.floor(Math.random() * I.length), 1)[0])),
                  (P.anIndexes[E] = N);
          }
          (e.yOffset = e.finalLineHeight || e.finalSize * 1.2),
            (e.ls = e.ls || 0),
            (e.ascent = (d.ascent * e.finalSize) / 100);
        }),
        (TextProperty.prototype.updateDocumentData = function (e, t) {
          t = t === void 0 ? this.keysIndex : t;
          var r = this.copyData({}, this.data.d.k[t].s);
          (r = this.copyData(r, e)),
            (this.data.d.k[t].s = r),
            this.recalculate(t),
            this.elem.addDynamicProperty(this);
        }),
        (TextProperty.prototype.recalculate = function (e) {
          var t = this.data.d.k[e].s;
          (t.__complete = !1),
            (this.keysIndex = 0),
            (this._isFirstFrame = !0),
            this.getValue(t);
        }),
        (TextProperty.prototype.canResizeFont = function (e) {
          (this.canResize = e),
            this.recalculate(this.keysIndex),
            this.elem.addDynamicProperty(this);
        }),
        (TextProperty.prototype.setMinimumFontSize = function (e) {
          (this.minimumFontSize = Math.floor(e) || 1),
            this.recalculate(this.keysIndex),
            this.elem.addDynamicProperty(this);
        });
      var TextSelectorProp = (function () {
        var e = Math.max,
          t = Math.min,
          r = Math.floor;
        function s(n, a) {
          (this._currentTextLength = -1),
            (this.k = !1),
            (this.data = a),
            (this.elem = n),
            (this.comp = n.comp),
            (this.finalS = 0),
            (this.finalE = 0),
            this.initDynamicPropertyContainer(n),
            (this.s = PropertyFactory.getProp(n, a.s || { k: 0 }, 0, 0, this)),
            "e" in a
              ? (this.e = PropertyFactory.getProp(n, a.e, 0, 0, this))
              : (this.e = { v: 100 }),
            (this.o = PropertyFactory.getProp(n, a.o || { k: 0 }, 0, 0, this)),
            (this.xe = PropertyFactory.getProp(
              n,
              a.xe || { k: 0 },
              0,
              0,
              this
            )),
            (this.ne = PropertyFactory.getProp(
              n,
              a.ne || { k: 0 },
              0,
              0,
              this
            )),
            (this.sm = PropertyFactory.getProp(
              n,
              a.sm || { k: 100 },
              0,
              0,
              this
            )),
            (this.a = PropertyFactory.getProp(n, a.a, 0, 0.01, this)),
            this.dynamicProperties.length || this.getValue();
        }
        (s.prototype = {
          getMult: function (a) {
            this._currentTextLength !==
              this.elem.textProperty.currentData.l.length && this.getValue();
            var o = 0,
              h = 0,
              c = 1,
              m = 1;
            this.ne.v > 0 ? (o = this.ne.v / 100) : (h = -this.ne.v / 100),
              this.xe.v > 0
                ? (c = 1 - this.xe.v / 100)
                : (m = 1 + this.xe.v / 100);
            var S = BezierFactory.getBezierEasing(o, h, c, m).get,
              u = 0,
              v = this.finalS,
              g = this.finalE,
              y = this.data.sh;
            if (y === 2)
              g === v
                ? (u = a >= g ? 1 : 0)
                : (u = e(0, t(0.5 / (g - v) + (a - v) / (g - v), 1))),
                (u = S(u));
            else if (y === 3)
              g === v
                ? (u = a >= g ? 0 : 1)
                : (u = 1 - e(0, t(0.5 / (g - v) + (a - v) / (g - v), 1))),
                (u = S(u));
            else if (y === 4)
              g === v
                ? (u = 0)
                : ((u = e(0, t(0.5 / (g - v) + (a - v) / (g - v), 1))),
                  u < 0.5 ? (u *= 2) : (u = 1 - 2 * (u - 0.5))),
                (u = S(u));
            else if (y === 5) {
              if (g === v) u = 0;
              else {
                var E = g - v;
                a = t(e(0, a + 0.5 - v), g - v);
                var l = -E / 2 + a,
                  d = E / 2;
                u = Math.sqrt(1 - (l * l) / (d * d));
              }
              u = S(u);
            } else
              y === 6
                ? (g === v
                    ? (u = 0)
                    : ((a = t(e(0, a + 0.5 - v), g - v)),
                      (u =
                        (1 + Math.cos(Math.PI + (Math.PI * 2 * a) / (g - v))) /
                        2)),
                  (u = S(u)))
                : (a >= r(v) &&
                    (a - v < 0
                      ? (u = e(0, t(t(g, 1) - (v - a), 1)))
                      : (u = e(0, t(g - a, 1)))),
                  (u = S(u)));
            if (this.sm.v !== 100) {
              var p = this.sm.v * 0.01;
              p === 0 && (p = 1e-8);
              var f = 0.5 - p * 0.5;
              u < f ? (u = 0) : ((u = (u - f) / p), u > 1 && (u = 1));
            }
            return u * this.a.v;
          },
          getValue: function (a) {
            this.iterateDynamicProperties(),
              (this._mdf = a || this._mdf),
              (this._currentTextLength =
                this.elem.textProperty.currentData.l.length || 0),
              a && this.data.r === 2 && (this.e.v = this._currentTextLength);
            var o = this.data.r === 2 ? 1 : 100 / this.data.totalChars,
              h = this.o.v / o,
              c = this.s.v / o + h,
              m = this.e.v / o + h;
            if (c > m) {
              var S = c;
              (c = m), (m = S);
            }
            (this.finalS = c), (this.finalE = m);
          },
        }),
          extendPrototype([DynamicPropertyContainer], s);
        function i(n, a, o) {
          return new s(n, a);
        }
        return { getTextSelectorProp: i };
      })();
      function TextAnimatorDataProperty(e, t, r) {
        var s = { propType: !1 },
          i = PropertyFactory.getProp,
          n = t.a;
        (this.a = {
          r: n.r ? i(e, n.r, 0, degToRads, r) : s,
          rx: n.rx ? i(e, n.rx, 0, degToRads, r) : s,
          ry: n.ry ? i(e, n.ry, 0, degToRads, r) : s,
          sk: n.sk ? i(e, n.sk, 0, degToRads, r) : s,
          sa: n.sa ? i(e, n.sa, 0, degToRads, r) : s,
          s: n.s ? i(e, n.s, 1, 0.01, r) : s,
          a: n.a ? i(e, n.a, 1, 0, r) : s,
          o: n.o ? i(e, n.o, 0, 0.01, r) : s,
          p: n.p ? i(e, n.p, 1, 0, r) : s,
          sw: n.sw ? i(e, n.sw, 0, 0, r) : s,
          sc: n.sc ? i(e, n.sc, 1, 0, r) : s,
          fc: n.fc ? i(e, n.fc, 1, 0, r) : s,
          fh: n.fh ? i(e, n.fh, 0, 0, r) : s,
          fs: n.fs ? i(e, n.fs, 0, 0.01, r) : s,
          fb: n.fb ? i(e, n.fb, 0, 0.01, r) : s,
          t: n.t ? i(e, n.t, 0, 0, r) : s,
        }),
          (this.s = TextSelectorProp.getTextSelectorProp(e, t.s, r)),
          (this.s.t = t.s.t);
      }
      function TextAnimatorProperty(e, t, r) {
        (this._isFirstFrame = !0),
          (this._hasMaskedPath = !1),
          (this._frameId = -1),
          (this._textData = e),
          (this._renderType = t),
          (this._elem = r),
          (this._animatorsData = createSizedArray(this._textData.a.length)),
          (this._pathData = {}),
          (this._moreOptions = { alignment: {} }),
          (this.renderedLetters = []),
          (this.lettersChangedFlag = !1),
          this.initDynamicPropertyContainer(r);
      }
      (TextAnimatorProperty.prototype.searchProperties = function () {
        var e,
          t = this._textData.a.length,
          r,
          s = PropertyFactory.getProp;
        for (e = 0; e < t; e += 1)
          (r = this._textData.a[e]),
            (this._animatorsData[e] = new TextAnimatorDataProperty(
              this._elem,
              r,
              this
            ));
        this._textData.p && "m" in this._textData.p
          ? ((this._pathData = {
              a: s(this._elem, this._textData.p.a, 0, 0, this),
              f: s(this._elem, this._textData.p.f, 0, 0, this),
              l: s(this._elem, this._textData.p.l, 0, 0, this),
              r: s(this._elem, this._textData.p.r, 0, 0, this),
              p: s(this._elem, this._textData.p.p, 0, 0, this),
              m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
            }),
            (this._hasMaskedPath = !0))
          : (this._hasMaskedPath = !1),
          (this._moreOptions.alignment = s(
            this._elem,
            this._textData.m.a,
            1,
            0,
            this
          ));
      }),
        (TextAnimatorProperty.prototype.getMeasures = function (e, t) {
          if (
            ((this.lettersChangedFlag = t),
            !(
              !this._mdf &&
              !this._isFirstFrame &&
              !t &&
              (!this._hasMaskedPath || !this._pathData.m._mdf)
            ))
          ) {
            this._isFirstFrame = !1;
            var r = this._moreOptions.alignment.v,
              s = this._animatorsData,
              i = this._textData,
              n = this.mHelper,
              a = this._renderType,
              o = this.renderedLetters.length,
              h,
              c,
              m,
              S,
              u = e.l,
              v,
              g,
              y,
              E,
              l,
              d,
              p,
              f,
              b,
              x,
              $,
              _,
              A,
              L,
              F;
            if (this._hasMaskedPath) {
              if (
                ((F = this._pathData.m),
                !this._pathData.n || this._pathData._mdf)
              ) {
                var M = F.v;
                this._pathData.r.v && (M = M.reverse()),
                  (v = { tLength: 0, segments: [] }),
                  (S = M._length - 1);
                var D;
                for (_ = 0, m = 0; m < S; m += 1)
                  (D = bez.buildBezierData(
                    M.v[m],
                    M.v[m + 1],
                    [M.o[m][0] - M.v[m][0], M.o[m][1] - M.v[m][1]],
                    [
                      M.i[m + 1][0] - M.v[m + 1][0],
                      M.i[m + 1][1] - M.v[m + 1][1],
                    ]
                  )),
                    (v.tLength += D.segmentLength),
                    v.segments.push(D),
                    (_ += D.segmentLength);
                (m = S),
                  F.v.c &&
                    ((D = bez.buildBezierData(
                      M.v[m],
                      M.v[0],
                      [M.o[m][0] - M.v[m][0], M.o[m][1] - M.v[m][1]],
                      [M.i[0][0] - M.v[0][0], M.i[0][1] - M.v[0][1]]
                    )),
                    (v.tLength += D.segmentLength),
                    v.segments.push(D),
                    (_ += D.segmentLength)),
                  (this._pathData.pi = v);
              }
              if (
                ((v = this._pathData.pi),
                (g = this._pathData.f.v),
                (p = 0),
                (d = 1),
                (E = 0),
                (l = !0),
                (x = v.segments),
                g < 0 && F.v.c)
              )
                for (
                  v.tLength < Math.abs(g) && (g = -Math.abs(g) % v.tLength),
                    p = x.length - 1,
                    b = x[p].points,
                    d = b.length - 1;
                  g < 0;

                )
                  (g += b[d].partialLength),
                    (d -= 1),
                    d < 0 && ((p -= 1), (b = x[p].points), (d = b.length - 1));
              (b = x[p].points),
                (f = b[d - 1]),
                (y = b[d]),
                ($ = y.partialLength);
            }
            (S = u.length), (h = 0), (c = 0);
            var V = e.finalSize * 1.2 * 0.714,
              T = !0,
              k,
              C,
              P,
              w,
              R;
            w = s.length;
            var I,
              q = -1,
              N,
              O,
              z,
              B = g,
              Q = p,
              G = d,
              U = -1,
              Y,
              W,
              K,
              j,
              H,
              te,
              ne,
              re,
              ee = "",
              se = this.defaultPropsArray,
              ie;
            if (e.j === 2 || e.j === 1) {
              var X = 0,
                ae = 0,
                oe = e.j === 2 ? -0.5 : -1,
                J = 0,
                le = !0;
              for (m = 0; m < S; m += 1)
                if (u[m].n) {
                  for (X && (X += ae); J < m; )
                    (u[J].animatorJustifyOffset = X), (J += 1);
                  (X = 0), (le = !0);
                } else {
                  for (P = 0; P < w; P += 1)
                    (k = s[P].a),
                      k.t.propType &&
                        (le && e.j === 2 && (ae += k.t.v * oe),
                        (C = s[P].s),
                        (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                        I.length
                          ? (X += k.t.v * I[0] * oe)
                          : (X += k.t.v * I * oe));
                  le = !1;
                }
              for (X && (X += ae); J < m; )
                (u[J].animatorJustifyOffset = X), (J += 1);
            }
            for (m = 0; m < S; m += 1) {
              if ((n.reset(), (Y = 1), u[m].n))
                (h = 0),
                  (c += e.yOffset),
                  (c += T ? 1 : 0),
                  (g = B),
                  (T = !1),
                  this._hasMaskedPath &&
                    ((p = Q),
                    (d = G),
                    (b = x[p].points),
                    (f = b[d - 1]),
                    (y = b[d]),
                    ($ = y.partialLength),
                    (E = 0)),
                  (ee = ""),
                  (re = ""),
                  (te = ""),
                  (ie = ""),
                  (se = this.defaultPropsArray);
              else {
                if (this._hasMaskedPath) {
                  if (U !== u[m].line) {
                    switch (e.j) {
                      case 1:
                        g += _ - e.lineWidths[u[m].line];
                        break;
                      case 2:
                        g += (_ - e.lineWidths[u[m].line]) / 2;
                        break;
                    }
                    U = u[m].line;
                  }
                  q !== u[m].ind &&
                    (u[q] && (g += u[q].extra),
                    (g += u[m].an / 2),
                    (q = u[m].ind)),
                    (g += r[0] * u[m].an * 0.005);
                  var Z = 0;
                  for (P = 0; P < w; P += 1)
                    (k = s[P].a),
                      k.p.propType &&
                        ((C = s[P].s),
                        (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                        I.length
                          ? (Z += k.p.v[0] * I[0])
                          : (Z += k.p.v[0] * I)),
                      k.a.propType &&
                        ((C = s[P].s),
                        (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                        I.length
                          ? (Z += k.a.v[0] * I[0])
                          : (Z += k.a.v[0] * I));
                  for (
                    l = !0,
                      this._pathData.a.v &&
                        ((g =
                          u[0].an * 0.5 +
                          ((_ -
                            this._pathData.f.v -
                            u[0].an * 0.5 -
                            u[u.length - 1].an * 0.5) *
                            q) /
                            (S - 1)),
                        (g += this._pathData.f.v));
                    l;

                  )
                    E + $ >= g + Z || !b
                      ? ((A = (g + Z - E) / y.partialLength),
                        (O = f.point[0] + (y.point[0] - f.point[0]) * A),
                        (z = f.point[1] + (y.point[1] - f.point[1]) * A),
                        n.translate(
                          -r[0] * u[m].an * 0.005,
                          -(r[1] * V) * 0.01
                        ),
                        (l = !1))
                      : b &&
                        ((E += y.partialLength),
                        (d += 1),
                        d >= b.length &&
                          ((d = 0),
                          (p += 1),
                          x[p]
                            ? (b = x[p].points)
                            : F.v.c
                            ? ((d = 0), (p = 0), (b = x[p].points))
                            : ((E -= y.partialLength), (b = null))),
                        b && ((f = y), (y = b[d]), ($ = y.partialLength)));
                  (N = u[m].an / 2 - u[m].add), n.translate(-N, 0, 0);
                } else
                  (N = u[m].an / 2 - u[m].add),
                    n.translate(-N, 0, 0),
                    n.translate(-r[0] * u[m].an * 0.005, -r[1] * V * 0.01, 0);
                for (P = 0; P < w; P += 1)
                  (k = s[P].a),
                    k.t.propType &&
                      ((C = s[P].s),
                      (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                      (h !== 0 || e.j !== 0) &&
                        (this._hasMaskedPath
                          ? I.length
                            ? (g += k.t.v * I[0])
                            : (g += k.t.v * I)
                          : I.length
                          ? (h += k.t.v * I[0])
                          : (h += k.t.v * I)));
                for (
                  e.strokeWidthAnim && (K = e.sw || 0),
                    e.strokeColorAnim &&
                      (e.sc
                        ? (W = [e.sc[0], e.sc[1], e.sc[2]])
                        : (W = [0, 0, 0])),
                    e.fillColorAnim &&
                      e.fc &&
                      (j = [e.fc[0], e.fc[1], e.fc[2]]),
                    P = 0;
                  P < w;
                  P += 1
                )
                  (k = s[P].a),
                    k.a.propType &&
                      ((C = s[P].s),
                      (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                      I.length
                        ? n.translate(
                            -k.a.v[0] * I[0],
                            -k.a.v[1] * I[1],
                            k.a.v[2] * I[2]
                          )
                        : n.translate(
                            -k.a.v[0] * I,
                            -k.a.v[1] * I,
                            k.a.v[2] * I
                          ));
                for (P = 0; P < w; P += 1)
                  (k = s[P].a),
                    k.s.propType &&
                      ((C = s[P].s),
                      (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                      I.length
                        ? n.scale(
                            1 + (k.s.v[0] - 1) * I[0],
                            1 + (k.s.v[1] - 1) * I[1],
                            1
                          )
                        : n.scale(
                            1 + (k.s.v[0] - 1) * I,
                            1 + (k.s.v[1] - 1) * I,
                            1
                          ));
                for (P = 0; P < w; P += 1) {
                  if (
                    ((k = s[P].a),
                    (C = s[P].s),
                    (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                    k.sk.propType &&
                      (I.length
                        ? n.skewFromAxis(-k.sk.v * I[0], k.sa.v * I[1])
                        : n.skewFromAxis(-k.sk.v * I, k.sa.v * I)),
                    k.r.propType &&
                      (I.length
                        ? n.rotateZ(-k.r.v * I[2])
                        : n.rotateZ(-k.r.v * I)),
                    k.ry.propType &&
                      (I.length
                        ? n.rotateY(k.ry.v * I[1])
                        : n.rotateY(k.ry.v * I)),
                    k.rx.propType &&
                      (I.length
                        ? n.rotateX(k.rx.v * I[0])
                        : n.rotateX(k.rx.v * I)),
                    k.o.propType &&
                      (I.length
                        ? (Y += (k.o.v * I[0] - Y) * I[0])
                        : (Y += (k.o.v * I - Y) * I)),
                    e.strokeWidthAnim &&
                      k.sw.propType &&
                      (I.length ? (K += k.sw.v * I[0]) : (K += k.sw.v * I)),
                    e.strokeColorAnim && k.sc.propType)
                  )
                    for (H = 0; H < 3; H += 1)
                      I.length
                        ? (W[H] += (k.sc.v[H] - W[H]) * I[0])
                        : (W[H] += (k.sc.v[H] - W[H]) * I);
                  if (e.fillColorAnim && e.fc) {
                    if (k.fc.propType)
                      for (H = 0; H < 3; H += 1)
                        I.length
                          ? (j[H] += (k.fc.v[H] - j[H]) * I[0])
                          : (j[H] += (k.fc.v[H] - j[H]) * I);
                    k.fh.propType &&
                      (I.length
                        ? (j = addHueToRGB(j, k.fh.v * I[0]))
                        : (j = addHueToRGB(j, k.fh.v * I))),
                      k.fs.propType &&
                        (I.length
                          ? (j = addSaturationToRGB(j, k.fs.v * I[0]))
                          : (j = addSaturationToRGB(j, k.fs.v * I))),
                      k.fb.propType &&
                        (I.length
                          ? (j = addBrightnessToRGB(j, k.fb.v * I[0]))
                          : (j = addBrightnessToRGB(j, k.fb.v * I)));
                  }
                }
                for (P = 0; P < w; P += 1)
                  (k = s[P].a),
                    k.p.propType &&
                      ((C = s[P].s),
                      (I = C.getMult(u[m].anIndexes[P], i.a[P].s.totalChars)),
                      this._hasMaskedPath
                        ? I.length
                          ? n.translate(0, k.p.v[1] * I[0], -k.p.v[2] * I[1])
                          : n.translate(0, k.p.v[1] * I, -k.p.v[2] * I)
                        : I.length
                        ? n.translate(
                            k.p.v[0] * I[0],
                            k.p.v[1] * I[1],
                            -k.p.v[2] * I[2]
                          )
                        : n.translate(
                            k.p.v[0] * I,
                            k.p.v[1] * I,
                            -k.p.v[2] * I
                          ));
                if (
                  (e.strokeWidthAnim && (te = K < 0 ? 0 : K),
                  e.strokeColorAnim &&
                    (ne =
                      "rgb(" +
                      Math.round(W[0] * 255) +
                      "," +
                      Math.round(W[1] * 255) +
                      "," +
                      Math.round(W[2] * 255) +
                      ")"),
                  e.fillColorAnim &&
                    e.fc &&
                    (re =
                      "rgb(" +
                      Math.round(j[0] * 255) +
                      "," +
                      Math.round(j[1] * 255) +
                      "," +
                      Math.round(j[2] * 255) +
                      ")"),
                  this._hasMaskedPath)
                ) {
                  if (
                    (n.translate(0, -e.ls),
                    n.translate(0, r[1] * V * 0.01 + c, 0),
                    this._pathData.p.v)
                  ) {
                    L = (y.point[1] - f.point[1]) / (y.point[0] - f.point[0]);
                    var he = (Math.atan(L) * 180) / Math.PI;
                    y.point[0] < f.point[0] && (he += 180),
                      n.rotate((-he * Math.PI) / 180);
                  }
                  n.translate(O, z, 0),
                    (g -= r[0] * u[m].an * 0.005),
                    u[m + 1] &&
                      q !== u[m + 1].ind &&
                      ((g += u[m].an / 2), (g += e.tr * 0.001 * e.finalSize));
                } else {
                  switch (
                    (n.translate(h, c, 0),
                    e.ps && n.translate(e.ps[0], e.ps[1] + e.ascent, 0),
                    e.j)
                  ) {
                    case 1:
                      n.translate(
                        u[m].animatorJustifyOffset +
                          e.justifyOffset +
                          (e.boxWidth - e.lineWidths[u[m].line]),
                        0,
                        0
                      );
                      break;
                    case 2:
                      n.translate(
                        u[m].animatorJustifyOffset +
                          e.justifyOffset +
                          (e.boxWidth - e.lineWidths[u[m].line]) / 2,
                        0,
                        0
                      );
                      break;
                  }
                  n.translate(0, -e.ls),
                    n.translate(N, 0, 0),
                    n.translate(r[0] * u[m].an * 0.005, r[1] * V * 0.01, 0),
                    (h += u[m].l + e.tr * 0.001 * e.finalSize);
                }
                a === "html"
                  ? (ee = n.toCSS())
                  : a === "svg"
                  ? (ee = n.to2dCSS())
                  : (se = [
                      n.props[0],
                      n.props[1],
                      n.props[2],
                      n.props[3],
                      n.props[4],
                      n.props[5],
                      n.props[6],
                      n.props[7],
                      n.props[8],
                      n.props[9],
                      n.props[10],
                      n.props[11],
                      n.props[12],
                      n.props[13],
                      n.props[14],
                      n.props[15],
                    ]),
                  (ie = Y);
              }
              o <= m
                ? ((R = new LetterProps(ie, te, ne, re, ee, se)),
                  this.renderedLetters.push(R),
                  (o += 1),
                  (this.lettersChangedFlag = !0))
                : ((R = this.renderedLetters[m]),
                  (this.lettersChangedFlag =
                    R.update(ie, te, ne, re, ee, se) ||
                    this.lettersChangedFlag));
            }
          }
        }),
        (TextAnimatorProperty.prototype.getValue = function () {
          this._elem.globalData.frameId !== this._frameId &&
            ((this._frameId = this._elem.globalData.frameId),
            this.iterateDynamicProperties());
        }),
        (TextAnimatorProperty.prototype.mHelper = new Matrix()),
        (TextAnimatorProperty.prototype.defaultPropsArray = []),
        extendPrototype([DynamicPropertyContainer], TextAnimatorProperty);
      function ITextElement() {}
      (ITextElement.prototype.initElement = function (e, t, r) {
        (this.lettersChangedFlag = !0),
          this.initFrame(),
          this.initBaseData(e, t, r),
          (this.textProperty = new TextProperty(
            this,
            e.t,
            this.dynamicProperties
          )),
          (this.textAnimator = new TextAnimatorProperty(
            e.t,
            this.renderType,
            this
          )),
          this.initTransform(e, t, r),
          this.initHierarchy(),
          this.initRenderable(),
          this.initRendererElement(),
          this.createContainerElements(),
          this.createRenderableComponents(),
          this.createContent(),
          this.hide(),
          this.textAnimator.searchProperties(this.dynamicProperties);
      }),
        (ITextElement.prototype.prepareFrame = function (e) {
          (this._mdf = !1),
            this.prepareRenderableFrame(e),
            this.prepareProperties(e, this.isInRange),
            (this.textProperty._mdf || this.textProperty._isFirstFrame) &&
              (this.buildNewText(),
              (this.textProperty._isFirstFrame = !1),
              (this.textProperty._mdf = !1));
        }),
        (ITextElement.prototype.createPathShape = function (e, t) {
          var r,
            s = t.length,
            i,
            n = "";
          for (r = 0; r < s; r += 1)
            t[r].ty === "sh" &&
              ((i = t[r].ks.k), (n += buildShapeString(i, i.i.length, !0, e)));
          return n;
        }),
        (ITextElement.prototype.updateDocumentData = function (e, t) {
          this.textProperty.updateDocumentData(e, t);
        }),
        (ITextElement.prototype.canResizeFont = function (e) {
          this.textProperty.canResizeFont(e);
        }),
        (ITextElement.prototype.setMinimumFontSize = function (e) {
          this.textProperty.setMinimumFontSize(e);
        }),
        (ITextElement.prototype.applyTextPropertiesToMatrix = function (
          e,
          t,
          r,
          s,
          i
        ) {
          switch (
            (e.ps && t.translate(e.ps[0], e.ps[1] + e.ascent, 0),
            t.translate(0, -e.ls, 0),
            e.j)
          ) {
            case 1:
              t.translate(
                e.justifyOffset + (e.boxWidth - e.lineWidths[r]),
                0,
                0
              );
              break;
            case 2:
              t.translate(
                e.justifyOffset + (e.boxWidth - e.lineWidths[r]) / 2,
                0,
                0
              );
              break;
          }
          t.translate(s, i, 0);
        }),
        (ITextElement.prototype.buildColor = function (e) {
          return (
            "rgb(" +
            Math.round(e[0] * 255) +
            "," +
            Math.round(e[1] * 255) +
            "," +
            Math.round(e[2] * 255) +
            ")"
          );
        }),
        (ITextElement.prototype.emptyProp = new LetterProps()),
        (ITextElement.prototype.destroy = function () {});
      var emptyShapeData = { shapes: [] };
      function SVGTextLottieElement(e, t, r) {
        (this.textSpans = []),
          (this.renderType = "svg"),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
          ITextElement,
        ],
        SVGTextLottieElement
      ),
        (SVGTextLottieElement.prototype.createContent = function () {
          this.data.singleShape &&
            !this.globalData.fontManager.chars &&
            (this.textContainer = createNS("text"));
        }),
        (SVGTextLottieElement.prototype.buildTextContents = function (e) {
          for (var t = 0, r = e.length, s = [], i = ""; t < r; )
            e[t] === String.fromCharCode(13) || e[t] === String.fromCharCode(3)
              ? (s.push(i), (i = ""))
              : (i += e[t]),
              (t += 1);
          return s.push(i), s;
        }),
        (SVGTextLottieElement.prototype.buildShapeData = function (e, t) {
          if (e.shapes && e.shapes.length) {
            var r = e.shapes[0];
            if (r.it) {
              var s = r.it[r.it.length - 1];
              s.s && ((s.s.k[0] = t), (s.s.k[1] = t));
            }
          }
          return e;
        }),
        (SVGTextLottieElement.prototype.buildNewText = function () {
          this.addDynamicProperty(this);
          var e,
            t,
            r = this.textProperty.currentData;
          (this.renderedLetters = createSizedArray(r ? r.l.length : 0)),
            r.fc
              ? this.layerElement.setAttribute("fill", this.buildColor(r.fc))
              : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"),
            r.sc &&
              (this.layerElement.setAttribute("stroke", this.buildColor(r.sc)),
              this.layerElement.setAttribute("stroke-width", r.sw)),
            this.layerElement.setAttribute("font-size", r.finalSize);
          var s = this.globalData.fontManager.getFontByName(r.f);
          if (s.fClass) this.layerElement.setAttribute("class", s.fClass);
          else {
            this.layerElement.setAttribute("font-family", s.fFamily);
            var i = r.fWeight,
              n = r.fStyle;
            this.layerElement.setAttribute("font-style", n),
              this.layerElement.setAttribute("font-weight", i);
          }
          this.layerElement.setAttribute("aria-label", r.t);
          var a = r.l || [],
            o = !!this.globalData.fontManager.chars;
          t = a.length;
          var h,
            c = this.mHelper,
            m = "",
            S = this.data.singleShape,
            u = 0,
            v = 0,
            g = !0,
            y = r.tr * 0.001 * r.finalSize;
          if (S && !o && !r.sz) {
            var E = this.textContainer,
              l = "start";
            switch (r.j) {
              case 1:
                l = "end";
                break;
              case 2:
                l = "middle";
                break;
              default:
                l = "start";
                break;
            }
            E.setAttribute("text-anchor", l),
              E.setAttribute("letter-spacing", y);
            var d = this.buildTextContents(r.finalText);
            for (
              t = d.length, v = r.ps ? r.ps[1] + r.ascent : 0, e = 0;
              e < t;
              e += 1
            )
              (h = this.textSpans[e].span || createNS("tspan")),
                (h.textContent = d[e]),
                h.setAttribute("x", 0),
                h.setAttribute("y", v),
                (h.style.display = "inherit"),
                E.appendChild(h),
                this.textSpans[e] ||
                  (this.textSpans[e] = { span: null, glyph: null }),
                (this.textSpans[e].span = h),
                (v += r.finalLineHeight);
            this.layerElement.appendChild(E);
          } else {
            var p = this.textSpans.length,
              f;
            for (e = 0; e < t; e += 1) {
              if (
                (this.textSpans[e] ||
                  (this.textSpans[e] = {
                    span: null,
                    childSpan: null,
                    glyph: null,
                  }),
                !o || !S || e === 0)
              ) {
                if (
                  ((h =
                    p > e
                      ? this.textSpans[e].span
                      : createNS(o ? "g" : "text")),
                  p <= e)
                ) {
                  if (
                    (h.setAttribute("stroke-linecap", "butt"),
                    h.setAttribute("stroke-linejoin", "round"),
                    h.setAttribute("stroke-miterlimit", "4"),
                    (this.textSpans[e].span = h),
                    o)
                  ) {
                    var b = createNS("g");
                    h.appendChild(b), (this.textSpans[e].childSpan = b);
                  }
                  (this.textSpans[e].span = h),
                    this.layerElement.appendChild(h);
                }
                h.style.display = "inherit";
              }
              if (
                (c.reset(),
                S &&
                  (a[e].n &&
                    ((u = -y), (v += r.yOffset), (v += g ? 1 : 0), (g = !1)),
                  this.applyTextPropertiesToMatrix(r, c, a[e].line, u, v),
                  (u += a[e].l || 0),
                  (u += y)),
                o)
              ) {
                f = this.globalData.fontManager.getCharData(
                  r.finalText[e],
                  s.fStyle,
                  this.globalData.fontManager.getFontByName(r.f).fFamily
                );
                var x;
                if (f.t === 1)
                  x = new SVGCompElement(f.data, this.globalData, this);
                else {
                  var $ = emptyShapeData;
                  f.data &&
                    f.data.shapes &&
                    ($ = this.buildShapeData(f.data, r.finalSize)),
                    (x = new SVGShapeElement($, this.globalData, this));
                }
                if (this.textSpans[e].glyph) {
                  var _ = this.textSpans[e].glyph;
                  this.textSpans[e].childSpan.removeChild(_.layerElement),
                    _.destroy();
                }
                (this.textSpans[e].glyph = x),
                  (x._debug = !0),
                  x.prepareFrame(0),
                  x.renderFrame(),
                  this.textSpans[e].childSpan.appendChild(x.layerElement),
                  f.t === 1 &&
                    this.textSpans[e].childSpan.setAttribute(
                      "transform",
                      "scale(" +
                        r.finalSize / 100 +
                        "," +
                        r.finalSize / 100 +
                        ")"
                    );
              } else
                S &&
                  h.setAttribute(
                    "transform",
                    "translate(" + c.props[12] + "," + c.props[13] + ")"
                  ),
                  (h.textContent = a[e].val),
                  h.setAttributeNS(
                    "http://www.w3.org/XML/1998/namespace",
                    "xml:space",
                    "preserve"
                  );
            }
            S && h && h.setAttribute("d", m);
          }
          for (; e < this.textSpans.length; )
            (this.textSpans[e].span.style.display = "none"), (e += 1);
          this._sizeChanged = !0;
        }),
        (SVGTextLottieElement.prototype.sourceRectAtTime = function () {
          if (
            (this.prepareFrame(this.comp.renderedFrame - this.data.st),
            this.renderInnerContent(),
            this._sizeChanged)
          ) {
            this._sizeChanged = !1;
            var e = this.layerElement.getBBox();
            this.bbox = {
              top: e.y,
              left: e.x,
              width: e.width,
              height: e.height,
            };
          }
          return this.bbox;
        }),
        (SVGTextLottieElement.prototype.getValue = function () {
          var e,
            t = this.textSpans.length,
            r;
          for (
            this.renderedFrame = this.comp.renderedFrame, e = 0;
            e < t;
            e += 1
          )
            (r = this.textSpans[e].glyph),
              r &&
                (r.prepareFrame(this.comp.renderedFrame - this.data.st),
                r._mdf && (this._mdf = !0));
        }),
        (SVGTextLottieElement.prototype.renderInnerContent = function () {
          if (
            (!this.data.singleShape || this._mdf) &&
            (this.textAnimator.getMeasures(
              this.textProperty.currentData,
              this.lettersChangedFlag
            ),
            this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)
          ) {
            this._sizeChanged = !0;
            var e,
              t,
              r = this.textAnimator.renderedLetters,
              s = this.textProperty.currentData.l;
            t = s.length;
            var i, n, a;
            for (e = 0; e < t; e += 1)
              s[e].n ||
                ((i = r[e]),
                (n = this.textSpans[e].span),
                (a = this.textSpans[e].glyph),
                a && a.renderFrame(),
                i._mdf.m && n.setAttribute("transform", i.m),
                i._mdf.o && n.setAttribute("opacity", i.o),
                i._mdf.sw && n.setAttribute("stroke-width", i.sw),
                i._mdf.sc && n.setAttribute("stroke", i.sc),
                i._mdf.fc && n.setAttribute("fill", i.fc));
          }
        });
      function ISolidElement(e, t, r) {
        this.initElement(e, t, r);
      }
      extendPrototype([IImageElement], ISolidElement),
        (ISolidElement.prototype.createContent = function () {
          var e = createNS("rect");
          e.setAttribute("width", this.data.sw),
            e.setAttribute("height", this.data.sh),
            e.setAttribute("fill", this.data.sc),
            this.layerElement.appendChild(e);
        });
      function NullElement(e, t, r) {
        this.initFrame(),
          this.initBaseData(e, t, r),
          this.initFrame(),
          this.initTransform(e, t, r),
          this.initHierarchy();
      }
      (NullElement.prototype.prepareFrame = function (e) {
        this.prepareProperties(e, !0);
      }),
        (NullElement.prototype.renderFrame = function () {}),
        (NullElement.prototype.getBaseElement = function () {
          return null;
        }),
        (NullElement.prototype.destroy = function () {}),
        (NullElement.prototype.sourceRectAtTime = function () {}),
        (NullElement.prototype.hide = function () {}),
        extendPrototype(
          [BaseElement, TransformElement, HierarchyElement, FrameElement],
          NullElement
        );
      function SVGRendererBase() {}
      extendPrototype([BaseRenderer], SVGRendererBase),
        (SVGRendererBase.prototype.createNull = function (e) {
          return new NullElement(e, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createShape = function (e) {
          return new SVGShapeElement(e, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createText = function (e) {
          return new SVGTextLottieElement(e, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createImage = function (e) {
          return new IImageElement(e, this.globalData, this);
        }),
        (SVGRendererBase.prototype.createSolid = function (e) {
          return new ISolidElement(e, this.globalData, this);
        }),
        (SVGRendererBase.prototype.configAnimation = function (e) {
          this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"),
            this.renderConfig.viewBoxSize
              ? this.svgElement.setAttribute(
                  "viewBox",
                  this.renderConfig.viewBoxSize
                )
              : this.svgElement.setAttribute(
                  "viewBox",
                  "0 0 " + e.w + " " + e.h
                ),
            this.renderConfig.viewBoxOnly ||
              (this.svgElement.setAttribute("width", e.w),
              this.svgElement.setAttribute("height", e.h),
              (this.svgElement.style.width = "100%"),
              (this.svgElement.style.height = "100%"),
              (this.svgElement.style.transform = "translate3d(0,0,0)"),
              (this.svgElement.style.contentVisibility =
                this.renderConfig.contentVisibility)),
            this.renderConfig.width &&
              this.svgElement.setAttribute("width", this.renderConfig.width),
            this.renderConfig.height &&
              this.svgElement.setAttribute("height", this.renderConfig.height),
            this.renderConfig.className &&
              this.svgElement.setAttribute(
                "class",
                this.renderConfig.className
              ),
            this.renderConfig.id &&
              this.svgElement.setAttribute("id", this.renderConfig.id),
            this.renderConfig.focusable !== void 0 &&
              this.svgElement.setAttribute(
                "focusable",
                this.renderConfig.focusable
              ),
            this.svgElement.setAttribute(
              "preserveAspectRatio",
              this.renderConfig.preserveAspectRatio
            ),
            this.animationItem.wrapper.appendChild(this.svgElement);
          var t = this.globalData.defs;
          this.setupGlobalData(e, t),
            (this.globalData.progressiveLoad =
              this.renderConfig.progressiveLoad),
            (this.data = e);
          var r = createNS("clipPath"),
            s = createNS("rect");
          s.setAttribute("width", e.w),
            s.setAttribute("height", e.h),
            s.setAttribute("x", 0),
            s.setAttribute("y", 0);
          var i = createElementID();
          r.setAttribute("id", i),
            r.appendChild(s),
            this.layerElement.setAttribute(
              "clip-path",
              "url(" + getLocationHref() + "#" + i + ")"
            ),
            t.appendChild(r),
            (this.layers = e.layers),
            (this.elements = createSizedArray(e.layers.length));
        }),
        (SVGRendererBase.prototype.destroy = function () {
          this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = ""),
            (this.layerElement = null),
            (this.globalData.defs = null);
          var e,
            t = this.layers ? this.layers.length : 0;
          for (e = 0; e < t; e += 1)
            this.elements[e] && this.elements[e].destroy();
          (this.elements.length = 0),
            (this.destroyed = !0),
            (this.animationItem = null);
        }),
        (SVGRendererBase.prototype.updateContainerSize = function () {}),
        (SVGRendererBase.prototype.buildItem = function (e) {
          var t = this.elements;
          if (!(t[e] || this.layers[e].ty === 99)) {
            t[e] = !0;
            var r = this.createItem(this.layers[e]);
            (t[e] = r),
              getExpressionsPlugin() &&
                (this.layers[e].ty === 0 &&
                  this.globalData.projectInterface.registerComposition(r),
                r.initExpressions()),
              this.appendElementInPos(r, e),
              this.layers[e].tt &&
                (!this.elements[e - 1] || this.elements[e - 1] === !0
                  ? (this.buildItem(e - 1), this.addPendingElement(r))
                  : r.setMatte(t[e - 1].layerId));
          }
        }),
        (SVGRendererBase.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var e = this.pendingElements.pop();
            if ((e.checkParenting(), e.data.tt))
              for (var t = 0, r = this.elements.length; t < r; ) {
                if (this.elements[t] === e) {
                  e.setMatte(this.elements[t - 1].layerId);
                  break;
                }
                t += 1;
              }
          }
        }),
        (SVGRendererBase.prototype.renderFrame = function (e) {
          if (!(this.renderedFrame === e || this.destroyed)) {
            e === null ? (e = this.renderedFrame) : (this.renderedFrame = e),
              (this.globalData.frameNum = e),
              (this.globalData.frameId += 1),
              (this.globalData.projectInterface.currentFrame = e),
              (this.globalData._mdf = !1);
            var t,
              r = this.layers.length;
            for (
              this.completeLayers || this.checkLayers(e), t = r - 1;
              t >= 0;
              t -= 1
            )
              (this.completeLayers || this.elements[t]) &&
                this.elements[t].prepareFrame(e - this.layers[t].st);
            if (this.globalData._mdf)
              for (t = 0; t < r; t += 1)
                (this.completeLayers || this.elements[t]) &&
                  this.elements[t].renderFrame();
          }
        }),
        (SVGRendererBase.prototype.appendElementInPos = function (e, t) {
          var r = e.getBaseElement();
          if (!!r) {
            for (var s = 0, i; s < t; )
              this.elements[s] &&
                this.elements[s] !== !0 &&
                this.elements[s].getBaseElement() &&
                (i = this.elements[s].getBaseElement()),
                (s += 1);
            i
              ? this.layerElement.insertBefore(r, i)
              : this.layerElement.appendChild(r);
          }
        }),
        (SVGRendererBase.prototype.hide = function () {
          this.layerElement.style.display = "none";
        }),
        (SVGRendererBase.prototype.show = function () {
          this.layerElement.style.display = "block";
        });
      function ICompElement() {}
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        ICompElement
      ),
        (ICompElement.prototype.initElement = function (e, t, r) {
          this.initFrame(),
            this.initBaseData(e, t, r),
            this.initTransform(e, t, r),
            this.initRenderable(),
            this.initHierarchy(),
            this.initRendererElement(),
            this.createContainerElements(),
            this.createRenderableComponents(),
            (this.data.xt || !t.progressiveLoad) && this.buildAllItems(),
            this.hide();
        }),
        (ICompElement.prototype.prepareFrame = function (e) {
          if (
            ((this._mdf = !1),
            this.prepareRenderableFrame(e),
            this.prepareProperties(e, this.isInRange),
            !(!this.isInRange && !this.data.xt))
          ) {
            if (this.tm._placeholder) this.renderedFrame = e / this.data.sr;
            else {
              var t = this.tm.v;
              t === this.data.op && (t = this.data.op - 1),
                (this.renderedFrame = t);
            }
            var r,
              s = this.elements.length;
            for (
              this.completeLayers || this.checkLayers(this.renderedFrame),
                r = s - 1;
              r >= 0;
              r -= 1
            )
              (this.completeLayers || this.elements[r]) &&
                (this.elements[r].prepareFrame(
                  this.renderedFrame - this.layers[r].st
                ),
                this.elements[r]._mdf && (this._mdf = !0));
          }
        }),
        (ICompElement.prototype.renderInnerContent = function () {
          var e,
            t = this.layers.length;
          for (e = 0; e < t; e += 1)
            (this.completeLayers || this.elements[e]) &&
              this.elements[e].renderFrame();
        }),
        (ICompElement.prototype.setElements = function (e) {
          this.elements = e;
        }),
        (ICompElement.prototype.getElements = function () {
          return this.elements;
        }),
        (ICompElement.prototype.destroyElements = function () {
          var e,
            t = this.layers.length;
          for (e = 0; e < t; e += 1)
            this.elements[e] && this.elements[e].destroy();
        }),
        (ICompElement.prototype.destroy = function () {
          this.destroyElements(), this.destroyBaseElement();
        });
      function SVGCompElement(e, t, r) {
        (this.layers = e.layers),
          (this.supports3d = !0),
          (this.completeLayers = !1),
          (this.pendingElements = []),
          (this.elements = this.layers
            ? createSizedArray(this.layers.length)
            : []),
          this.initElement(e, t, r),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 });
      }
      extendPrototype(
        [SVGRendererBase, ICompElement, SVGBaseElement],
        SVGCompElement
      ),
        (SVGCompElement.prototype.createComp = function (e) {
          return new SVGCompElement(e, this.globalData, this);
        });
      function SVGRenderer(e, t) {
        (this.animationItem = e),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.svgElement = createNS("svg"));
        var r = "";
        if (t && t.title) {
          var s = createNS("title"),
            i = createElementID();
          s.setAttribute("id", i),
            (s.textContent = t.title),
            this.svgElement.appendChild(s),
            (r += i);
        }
        if (t && t.description) {
          var n = createNS("desc"),
            a = createElementID();
          n.setAttribute("id", a),
            (n.textContent = t.description),
            this.svgElement.appendChild(n),
            (r += " " + a);
        }
        r && this.svgElement.setAttribute("aria-labelledby", r);
        var o = createNS("defs");
        this.svgElement.appendChild(o);
        var h = createNS("g");
        this.svgElement.appendChild(h),
          (this.layerElement = h),
          (this.renderConfig = {
            preserveAspectRatio:
              (t && t.preserveAspectRatio) || "xMidYMid meet",
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || "xMidYMid slice",
            contentVisibility: (t && t.contentVisibility) || "visible",
            progressiveLoad: (t && t.progressiveLoad) || !1,
            hideOnTransparent: !(t && t.hideOnTransparent === !1),
            viewBoxOnly: (t && t.viewBoxOnly) || !1,
            viewBoxSize: (t && t.viewBoxSize) || !1,
            className: (t && t.className) || "",
            id: (t && t.id) || "",
            focusable: t && t.focusable,
            filterSize: {
              width: (t && t.filterSize && t.filterSize.width) || "100%",
              height: (t && t.filterSize && t.filterSize.height) || "100%",
              x: (t && t.filterSize && t.filterSize.x) || "0%",
              y: (t && t.filterSize && t.filterSize.y) || "0%",
            },
            width: t && t.width,
            height: t && t.height,
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            defs: o,
            renderConfig: this.renderConfig,
          }),
          (this.elements = []),
          (this.pendingElements = []),
          (this.destroyed = !1),
          (this.rendererType = "svg");
      }
      extendPrototype([SVGRendererBase], SVGRenderer),
        (SVGRenderer.prototype.createComp = function (e) {
          return new SVGCompElement(e, this.globalData, this);
        });
      function CVContextData() {
        (this.saved = []),
          (this.cArrPos = 0),
          (this.cTr = new Matrix()),
          (this.cO = 1);
        var e,
          t = 15;
        for (
          this.savedOp = createTypedArray("float32", t), e = 0;
          e < t;
          e += 1
        )
          this.saved[e] = createTypedArray("float32", 16);
        this._length = t;
      }
      (CVContextData.prototype.duplicate = function () {
        var e = this._length * 2,
          t = this.savedOp;
        (this.savedOp = createTypedArray("float32", e)), this.savedOp.set(t);
        var r = 0;
        for (r = this._length; r < e; r += 1)
          this.saved[r] = createTypedArray("float32", 16);
        this._length = e;
      }),
        (CVContextData.prototype.reset = function () {
          (this.cArrPos = 0), this.cTr.reset(), (this.cO = 1);
        });
      function ShapeTransformManager() {
        (this.sequences = {}),
          (this.sequenceList = []),
          (this.transform_key_count = 0);
      }
      ShapeTransformManager.prototype = {
        addTransformSequence: function (t) {
          var r,
            s = t.length,
            i = "_";
          for (r = 0; r < s; r += 1) i += t[r].transform.key + "_";
          var n = this.sequences[i];
          return (
            n ||
              ((n = {
                transforms: [].concat(t),
                finalTransform: new Matrix(),
                _mdf: !1,
              }),
              (this.sequences[i] = n),
              this.sequenceList.push(n)),
            n
          );
        },
        processSequence: function (t, r) {
          for (var s = 0, i = t.transforms.length, n = r; s < i && !r; ) {
            if (t.transforms[s].transform.mProps._mdf) {
              n = !0;
              break;
            }
            s += 1;
          }
          if (n) {
            var a;
            for (t.finalTransform.reset(), s = i - 1; s >= 0; s -= 1)
              (a = t.transforms[s].transform.mProps.v.props),
                t.finalTransform.transform(
                  a[0],
                  a[1],
                  a[2],
                  a[3],
                  a[4],
                  a[5],
                  a[6],
                  a[7],
                  a[8],
                  a[9],
                  a[10],
                  a[11],
                  a[12],
                  a[13],
                  a[14],
                  a[15]
                );
          }
          t._mdf = n;
        },
        processSequences: function (t) {
          var r,
            s = this.sequenceList.length;
          for (r = 0; r < s; r += 1)
            this.processSequence(this.sequenceList[r], t);
        },
        getNewKey: function () {
          return (
            (this.transform_key_count += 1), "_" + this.transform_key_count
          );
        },
      };
      function CVEffects() {}
      CVEffects.prototype.renderFrame = function () {};
      function CVMaskElement(e, t) {
        (this.data = e),
          (this.element = t),
          (this.masksProperties = this.data.masksProperties || []),
          (this.viewData = createSizedArray(this.masksProperties.length));
        var r,
          s = this.masksProperties.length,
          i = !1;
        for (r = 0; r < s; r += 1)
          this.masksProperties[r].mode !== "n" && (i = !0),
            (this.viewData[r] = ShapePropertyFactory.getShapeProp(
              this.element,
              this.masksProperties[r],
              3
            ));
        (this.hasMasks = i), i && this.element.addRenderableComponent(this);
      }
      (CVMaskElement.prototype.renderFrame = function () {
        if (!!this.hasMasks) {
          var e = this.element.finalTransform.mat,
            t = this.element.canvasContext,
            r,
            s = this.masksProperties.length,
            i,
            n,
            a;
          for (t.beginPath(), r = 0; r < s; r += 1)
            if (this.masksProperties[r].mode !== "n") {
              this.masksProperties[r].inv &&
                (t.moveTo(0, 0),
                t.lineTo(this.element.globalData.compSize.w, 0),
                t.lineTo(
                  this.element.globalData.compSize.w,
                  this.element.globalData.compSize.h
                ),
                t.lineTo(0, this.element.globalData.compSize.h),
                t.lineTo(0, 0)),
                (a = this.viewData[r].v),
                (i = e.applyToPointArray(a.v[0][0], a.v[0][1], 0)),
                t.moveTo(i[0], i[1]);
              var o,
                h = a._length;
              for (o = 1; o < h; o += 1)
                (n = e.applyToTriplePoints(a.o[o - 1], a.i[o], a.v[o])),
                  t.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5]);
              (n = e.applyToTriplePoints(a.o[o - 1], a.i[0], a.v[0])),
                t.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5]);
            }
          this.element.globalData.renderer.save(!0), t.clip();
        }
      }),
        (CVMaskElement.prototype.getMaskProperty =
          MaskElement.prototype.getMaskProperty),
        (CVMaskElement.prototype.destroy = function () {
          this.element = null;
        });
      function CVBaseElement() {}
      (CVBaseElement.prototype = {
        createElements: function () {},
        initRendererElement: function () {},
        createContainerElements: function () {
          (this.canvasContext = this.globalData.canvasContext),
            (this.renderableEffectsManager = new CVEffects());
        },
        createContent: function () {},
        setBlendMode: function () {
          var t = this.globalData;
          if (t.blendMode !== this.data.bm) {
            t.blendMode = this.data.bm;
            var r = getBlendMode(this.data.bm);
            t.canvasContext.globalCompositeOperation = r;
          }
        },
        createRenderableComponents: function () {
          this.maskManager = new CVMaskElement(this.data, this);
        },
        hideElement: function () {
          !this.hidden &&
            (!this.isInRange || this.isTransparent) &&
            (this.hidden = !0);
        },
        showElement: function () {
          this.isInRange &&
            !this.isTransparent &&
            ((this.hidden = !1),
            (this._isFirstFrame = !0),
            (this.maskManager._isFirstFrame = !0));
        },
        renderFrame: function () {
          if (!(this.hidden || this.data.hd)) {
            this.renderTransform(),
              this.renderRenderable(),
              this.setBlendMode();
            var t = this.data.ty === 0;
            this.globalData.renderer.save(t),
              this.globalData.renderer.ctxTransform(
                this.finalTransform.mat.props
              ),
              this.globalData.renderer.ctxOpacity(
                this.finalTransform.mProp.o.v
              ),
              this.renderInnerContent(),
              this.globalData.renderer.restore(t),
              this.maskManager.hasMasks && this.globalData.renderer.restore(!0),
              this._isFirstFrame && (this._isFirstFrame = !1);
          }
        },
        destroy: function () {
          (this.canvasContext = null),
            (this.data = null),
            (this.globalData = null),
            this.maskManager.destroy();
        },
        mHelper: new Matrix(),
      }),
        (CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement),
        (CVBaseElement.prototype.show = CVBaseElement.prototype.showElement);
      function CVShapeData(e, t, r, s) {
        (this.styledShapes = []), (this.tr = [0, 0, 0, 0, 0, 0]);
        var i = 4;
        t.ty === "rc"
          ? (i = 5)
          : t.ty === "el"
          ? (i = 6)
          : t.ty === "sr" && (i = 7),
          (this.sh = ShapePropertyFactory.getShapeProp(e, t, i, e));
        var n,
          a = r.length,
          o;
        for (n = 0; n < a; n += 1)
          r[n].closed ||
            ((o = {
              transforms: s.addTransformSequence(r[n].transforms),
              trNodes: [],
            }),
            this.styledShapes.push(o),
            r[n].elements.push(o));
      }
      CVShapeData.prototype.setAsAnimated =
        SVGShapeData.prototype.setAsAnimated;
      function CVShapeElement(e, t, r) {
        (this.shapes = []),
          (this.shapesData = e.shapes),
          (this.stylesList = []),
          (this.itemsData = []),
          (this.prevViewData = []),
          (this.shapeModifiers = []),
          (this.processedElements = []),
          (this.transformsManager = new ShapeTransformManager()),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          IShapeElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVShapeElement
      ),
        (CVShapeElement.prototype.initElement =
          RenderableDOMElement.prototype.initElement),
        (CVShapeElement.prototype.transformHelper = { opacity: 1, _opMdf: !1 }),
        (CVShapeElement.prototype.dashResetter = []),
        (CVShapeElement.prototype.createContent = function () {
          this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            !0,
            []
          );
        }),
        (CVShapeElement.prototype.createStyleElement = function (e, t) {
          var r = {
              data: e,
              type: e.ty,
              preTransforms: this.transformsManager.addTransformSequence(t),
              transforms: [],
              elements: [],
              closed: e.hd === !0,
            },
            s = {};
          if (
            (e.ty === "fl" || e.ty === "st"
              ? ((s.c = PropertyFactory.getProp(this, e.c, 1, 255, this)),
                s.c.k ||
                  (r.co =
                    "rgb(" +
                    bmFloor(s.c.v[0]) +
                    "," +
                    bmFloor(s.c.v[1]) +
                    "," +
                    bmFloor(s.c.v[2]) +
                    ")"))
              : (e.ty === "gf" || e.ty === "gs") &&
                ((s.s = PropertyFactory.getProp(this, e.s, 1, null, this)),
                (s.e = PropertyFactory.getProp(this, e.e, 1, null, this)),
                (s.h = PropertyFactory.getProp(
                  this,
                  e.h || { k: 0 },
                  0,
                  0.01,
                  this
                )),
                (s.a = PropertyFactory.getProp(
                  this,
                  e.a || { k: 0 },
                  0,
                  degToRads,
                  this
                )),
                (s.g = new GradientProperty(this, e.g, this))),
            (s.o = PropertyFactory.getProp(this, e.o, 0, 0.01, this)),
            e.ty === "st" || e.ty === "gs")
          ) {
            if (
              ((r.lc = lineCapEnum[e.lc || 2]),
              (r.lj = lineJoinEnum[e.lj || 2]),
              e.lj == 1 && (r.ml = e.ml),
              (s.w = PropertyFactory.getProp(this, e.w, 0, null, this)),
              s.w.k || (r.wi = s.w.v),
              e.d)
            ) {
              var i = new DashProperty(this, e.d, "canvas", this);
              (s.d = i),
                s.d.k || ((r.da = s.d.dashArray), (r.do = s.d.dashoffset[0]));
            }
          } else r.r = e.r === 2 ? "evenodd" : "nonzero";
          return this.stylesList.push(r), (s.style = r), s;
        }),
        (CVShapeElement.prototype.createGroupElement = function () {
          var e = { it: [], prevViewData: [] };
          return e;
        }),
        (CVShapeElement.prototype.createTransformElement = function (e) {
          var t = {
            transform: {
              opacity: 1,
              _opMdf: !1,
              key: this.transformsManager.getNewKey(),
              op: PropertyFactory.getProp(this, e.o, 0, 0.01, this),
              mProps: TransformPropertyFactory.getTransformProperty(
                this,
                e,
                this
              ),
            },
          };
          return t;
        }),
        (CVShapeElement.prototype.createShapeElement = function (e) {
          var t = new CVShapeData(
            this,
            e,
            this.stylesList,
            this.transformsManager
          );
          return this.shapes.push(t), this.addShapeToModifiers(t), t;
        }),
        (CVShapeElement.prototype.reloadShapes = function () {
          this._isFirstFrame = !0;
          var e,
            t = this.itemsData.length;
          for (e = 0; e < t; e += 1) this.prevViewData[e] = this.itemsData[e];
          for (
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              !0,
              []
            ),
              t = this.dynamicProperties.length,
              e = 0;
            e < t;
            e += 1
          )
            this.dynamicProperties[e].getValue();
          this.renderModifiers(),
            this.transformsManager.processSequences(this._isFirstFrame);
        }),
        (CVShapeElement.prototype.addTransformToStyleList = function (e) {
          var t,
            r = this.stylesList.length;
          for (t = 0; t < r; t += 1)
            this.stylesList[t].closed || this.stylesList[t].transforms.push(e);
        }),
        (CVShapeElement.prototype.removeTransformFromStyleList = function () {
          var e,
            t = this.stylesList.length;
          for (e = 0; e < t; e += 1)
            this.stylesList[e].closed || this.stylesList[e].transforms.pop();
        }),
        (CVShapeElement.prototype.closeStyles = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1) e[t].closed = !0;
        }),
        (CVShapeElement.prototype.searchShapes = function (e, t, r, s, i) {
          var n,
            a = e.length - 1,
            o,
            h,
            c = [],
            m = [],
            S,
            u,
            v,
            g = [].concat(i);
          for (n = a; n >= 0; n -= 1) {
            if (
              ((S = this.searchProcessedElement(e[n])),
              S ? (t[n] = r[S - 1]) : (e[n]._shouldRender = s),
              e[n].ty === "fl" ||
                e[n].ty === "st" ||
                e[n].ty === "gf" ||
                e[n].ty === "gs")
            )
              S
                ? (t[n].style.closed = !1)
                : (t[n] = this.createStyleElement(e[n], g)),
                c.push(t[n].style);
            else if (e[n].ty === "gr") {
              if (!S) t[n] = this.createGroupElement(e[n]);
              else
                for (h = t[n].it.length, o = 0; o < h; o += 1)
                  t[n].prevViewData[o] = t[n].it[o];
              this.searchShapes(e[n].it, t[n].it, t[n].prevViewData, s, g);
            } else
              e[n].ty === "tr"
                ? (S || ((v = this.createTransformElement(e[n])), (t[n] = v)),
                  g.push(t[n]),
                  this.addTransformToStyleList(t[n]))
                : e[n].ty === "sh" ||
                  e[n].ty === "rc" ||
                  e[n].ty === "el" ||
                  e[n].ty === "sr"
                ? S || (t[n] = this.createShapeElement(e[n]))
                : e[n].ty === "tm" || e[n].ty === "rd" || e[n].ty === "pb"
                ? (S
                    ? ((u = t[n]), (u.closed = !1))
                    : ((u = ShapeModifiers.getModifier(e[n].ty)),
                      u.init(this, e[n]),
                      (t[n] = u),
                      this.shapeModifiers.push(u)),
                  m.push(u))
                : e[n].ty === "rp" &&
                  (S
                    ? ((u = t[n]), (u.closed = !0))
                    : ((u = ShapeModifiers.getModifier(e[n].ty)),
                      (t[n] = u),
                      u.init(this, e, n, t),
                      this.shapeModifiers.push(u),
                      (s = !1)),
                  m.push(u));
            this.addProcessedElement(e[n], n + 1);
          }
          for (
            this.removeTransformFromStyleList(),
              this.closeStyles(c),
              a = m.length,
              n = 0;
            n < a;
            n += 1
          )
            m[n].closed = !0;
        }),
        (CVShapeElement.prototype.renderInnerContent = function () {
          (this.transformHelper.opacity = 1),
            (this.transformHelper._opMdf = !1),
            this.renderModifiers(),
            this.transformsManager.processSequences(this._isFirstFrame),
            this.renderShape(
              this.transformHelper,
              this.shapesData,
              this.itemsData,
              !0
            );
        }),
        (CVShapeElement.prototype.renderShapeTransform = function (e, t) {
          (e._opMdf || t.op._mdf || this._isFirstFrame) &&
            ((t.opacity = e.opacity), (t.opacity *= t.op.v), (t._opMdf = !0));
        }),
        (CVShapeElement.prototype.drawLayer = function () {
          var e,
            t = this.stylesList.length,
            r,
            s,
            i,
            n,
            a,
            o,
            h = this.globalData.renderer,
            c = this.globalData.canvasContext,
            m,
            S;
          for (e = 0; e < t; e += 1)
            if (
              ((S = this.stylesList[e]),
              (m = S.type),
              !(
                ((m === "st" || m === "gs") && S.wi === 0) ||
                !S.data._shouldRender ||
                S.coOp === 0 ||
                this.globalData.currentGlobalAlpha === 0
              ))
            ) {
              for (
                h.save(),
                  a = S.elements,
                  m === "st" || m === "gs"
                    ? ((c.strokeStyle = m === "st" ? S.co : S.grd),
                      (c.lineWidth = S.wi),
                      (c.lineCap = S.lc),
                      (c.lineJoin = S.lj),
                      (c.miterLimit = S.ml || 0))
                    : (c.fillStyle = m === "fl" ? S.co : S.grd),
                  h.ctxOpacity(S.coOp),
                  m !== "st" && m !== "gs" && c.beginPath(),
                  h.ctxTransform(S.preTransforms.finalTransform.props),
                  s = a.length,
                  r = 0;
                r < s;
                r += 1
              ) {
                for (
                  (m === "st" || m === "gs") &&
                    (c.beginPath(),
                    S.da && (c.setLineDash(S.da), (c.lineDashOffset = S.do))),
                    o = a[r].trNodes,
                    n = o.length,
                    i = 0;
                  i < n;
                  i += 1
                )
                  o[i].t === "m"
                    ? c.moveTo(o[i].p[0], o[i].p[1])
                    : o[i].t === "c"
                    ? c.bezierCurveTo(
                        o[i].pts[0],
                        o[i].pts[1],
                        o[i].pts[2],
                        o[i].pts[3],
                        o[i].pts[4],
                        o[i].pts[5]
                      )
                    : c.closePath();
                (m === "st" || m === "gs") &&
                  (c.stroke(), S.da && c.setLineDash(this.dashResetter));
              }
              m !== "st" && m !== "gs" && c.fill(S.r), h.restore();
            }
        }),
        (CVShapeElement.prototype.renderShape = function (e, t, r, s) {
          var i,
            n = t.length - 1,
            a;
          for (a = e, i = n; i >= 0; i -= 1)
            t[i].ty === "tr"
              ? ((a = r[i].transform), this.renderShapeTransform(e, a))
              : t[i].ty === "sh" ||
                t[i].ty === "el" ||
                t[i].ty === "rc" ||
                t[i].ty === "sr"
              ? this.renderPath(t[i], r[i])
              : t[i].ty === "fl"
              ? this.renderFill(t[i], r[i], a)
              : t[i].ty === "st"
              ? this.renderStroke(t[i], r[i], a)
              : t[i].ty === "gf" || t[i].ty === "gs"
              ? this.renderGradientFill(t[i], r[i], a)
              : t[i].ty === "gr"
              ? this.renderShape(a, t[i].it, r[i].it)
              : t[i].ty;
          s && this.drawLayer();
        }),
        (CVShapeElement.prototype.renderStyledShape = function (e, t) {
          if (this._isFirstFrame || t._mdf || e.transforms._mdf) {
            var r = e.trNodes,
              s = t.paths,
              i,
              n,
              a,
              o = s._length;
            r.length = 0;
            var h = e.transforms.finalTransform;
            for (a = 0; a < o; a += 1) {
              var c = s.shapes[a];
              if (c && c.v) {
                for (n = c._length, i = 1; i < n; i += 1)
                  i === 1 &&
                    r.push({
                      t: "m",
                      p: h.applyToPointArray(c.v[0][0], c.v[0][1], 0),
                    }),
                    r.push({
                      t: "c",
                      pts: h.applyToTriplePoints(c.o[i - 1], c.i[i], c.v[i]),
                    });
                n === 1 &&
                  r.push({
                    t: "m",
                    p: h.applyToPointArray(c.v[0][0], c.v[0][1], 0),
                  }),
                  c.c &&
                    n &&
                    (r.push({
                      t: "c",
                      pts: h.applyToTriplePoints(c.o[i - 1], c.i[0], c.v[0]),
                    }),
                    r.push({ t: "z" }));
              }
            }
            e.trNodes = r;
          }
        }),
        (CVShapeElement.prototype.renderPath = function (e, t) {
          if (e.hd !== !0 && e._shouldRender) {
            var r,
              s = t.styledShapes.length;
            for (r = 0; r < s; r += 1)
              this.renderStyledShape(t.styledShapes[r], t.sh);
          }
        }),
        (CVShapeElement.prototype.renderFill = function (e, t, r) {
          var s = t.style;
          (t.c._mdf || this._isFirstFrame) &&
            (s.co =
              "rgb(" +
              bmFloor(t.c.v[0]) +
              "," +
              bmFloor(t.c.v[1]) +
              "," +
              bmFloor(t.c.v[2]) +
              ")"),
            (t.o._mdf || r._opMdf || this._isFirstFrame) &&
              (s.coOp = t.o.v * r.opacity);
        }),
        (CVShapeElement.prototype.renderGradientFill = function (e, t, r) {
          var s = t.style,
            i;
          if (
            !s.grd ||
            t.g._mdf ||
            t.s._mdf ||
            t.e._mdf ||
            (e.t !== 1 && (t.h._mdf || t.a._mdf))
          ) {
            var n = this.globalData.canvasContext,
              a = t.s.v,
              o = t.e.v;
            if (e.t === 1) i = n.createLinearGradient(a[0], a[1], o[0], o[1]);
            else {
              var h = Math.sqrt(
                  Math.pow(a[0] - o[0], 2) + Math.pow(a[1] - o[1], 2)
                ),
                c = Math.atan2(o[1] - a[1], o[0] - a[0]),
                m = t.h.v;
              m >= 1 ? (m = 0.99) : m <= -1 && (m = -0.99);
              var S = h * m,
                u = Math.cos(c + t.a.v) * S + a[0],
                v = Math.sin(c + t.a.v) * S + a[1];
              i = n.createRadialGradient(u, v, 0, a[0], a[1], h);
            }
            var g,
              y = e.g.p,
              E = t.g.c,
              l = 1;
            for (g = 0; g < y; g += 1)
              t.g._hasOpacity && t.g._collapsable && (l = t.g.o[g * 2 + 1]),
                i.addColorStop(
                  E[g * 4] / 100,
                  "rgba(" +
                    E[g * 4 + 1] +
                    "," +
                    E[g * 4 + 2] +
                    "," +
                    E[g * 4 + 3] +
                    "," +
                    l +
                    ")"
                );
            s.grd = i;
          }
          s.coOp = t.o.v * r.opacity;
        }),
        (CVShapeElement.prototype.renderStroke = function (e, t, r) {
          var s = t.style,
            i = t.d;
          i &&
            (i._mdf || this._isFirstFrame) &&
            ((s.da = i.dashArray), (s.do = i.dashoffset[0])),
            (t.c._mdf || this._isFirstFrame) &&
              (s.co =
                "rgb(" +
                bmFloor(t.c.v[0]) +
                "," +
                bmFloor(t.c.v[1]) +
                "," +
                bmFloor(t.c.v[2]) +
                ")"),
            (t.o._mdf || r._opMdf || this._isFirstFrame) &&
              (s.coOp = t.o.v * r.opacity),
            (t.w._mdf || this._isFirstFrame) && (s.wi = t.w.v);
        }),
        (CVShapeElement.prototype.destroy = function () {
          (this.shapesData = null),
            (this.globalData = null),
            (this.canvasContext = null),
            (this.stylesList.length = 0),
            (this.itemsData.length = 0);
        });
      function CVTextElement(e, t, r) {
        (this.textSpans = []),
          (this.yOffset = 0),
          (this.fillColorAnim = !1),
          (this.strokeColorAnim = !1),
          (this.strokeWidthAnim = !1),
          (this.stroke = !1),
          (this.fill = !1),
          (this.justifyOffset = 0),
          (this.currentRender = null),
          (this.renderType = "canvas"),
          (this.values = {
            fill: "rgba(0,0,0,0)",
            stroke: "rgba(0,0,0,0)",
            sWidth: 0,
            fValue: "",
          }),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
          ITextElement,
        ],
        CVTextElement
      ),
        (CVTextElement.prototype.tHelper =
          createTag("canvas").getContext("2d")),
        (CVTextElement.prototype.buildNewText = function () {
          var e = this.textProperty.currentData;
          this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
          var t = !1;
          e.fc
            ? ((t = !0), (this.values.fill = this.buildColor(e.fc)))
            : (this.values.fill = "rgba(0,0,0,0)"),
            (this.fill = t);
          var r = !1;
          e.sc &&
            ((r = !0),
            (this.values.stroke = this.buildColor(e.sc)),
            (this.values.sWidth = e.sw));
          var s = this.globalData.fontManager.getFontByName(e.f),
            i,
            n,
            a = e.l,
            o = this.mHelper;
          (this.stroke = r),
            (this.values.fValue =
              e.finalSize +
              "px " +
              this.globalData.fontManager.getFontByName(e.f).fFamily),
            (n = e.finalText.length);
          var h,
            c,
            m,
            S,
            u,
            v,
            g,
            y,
            E,
            l,
            d = this.data.singleShape,
            p = e.tr * 0.001 * e.finalSize,
            f = 0,
            b = 0,
            x = !0,
            $ = 0;
          for (i = 0; i < n; i += 1) {
            (h = this.globalData.fontManager.getCharData(
              e.finalText[i],
              s.fStyle,
              this.globalData.fontManager.getFontByName(e.f).fFamily
            )),
              (c = (h && h.data) || {}),
              o.reset(),
              d &&
                a[i].n &&
                ((f = -p), (b += e.yOffset), (b += x ? 1 : 0), (x = !1)),
              (u = c.shapes ? c.shapes[0].it : []),
              (g = u.length),
              o.scale(e.finalSize / 100, e.finalSize / 100),
              d && this.applyTextPropertiesToMatrix(e, o, a[i].line, f, b),
              (E = createSizedArray(g - 1));
            var _ = 0;
            for (v = 0; v < g; v += 1)
              if (u[v].ty === "sh") {
                for (
                  S = u[v].ks.k.i.length, y = u[v].ks.k, l = [], m = 1;
                  m < S;
                  m += 1
                )
                  m === 1 &&
                    l.push(
                      o.applyToX(y.v[0][0], y.v[0][1], 0),
                      o.applyToY(y.v[0][0], y.v[0][1], 0)
                    ),
                    l.push(
                      o.applyToX(y.o[m - 1][0], y.o[m - 1][1], 0),
                      o.applyToY(y.o[m - 1][0], y.o[m - 1][1], 0),
                      o.applyToX(y.i[m][0], y.i[m][1], 0),
                      o.applyToY(y.i[m][0], y.i[m][1], 0),
                      o.applyToX(y.v[m][0], y.v[m][1], 0),
                      o.applyToY(y.v[m][0], y.v[m][1], 0)
                    );
                l.push(
                  o.applyToX(y.o[m - 1][0], y.o[m - 1][1], 0),
                  o.applyToY(y.o[m - 1][0], y.o[m - 1][1], 0),
                  o.applyToX(y.i[0][0], y.i[0][1], 0),
                  o.applyToY(y.i[0][0], y.i[0][1], 0),
                  o.applyToX(y.v[0][0], y.v[0][1], 0),
                  o.applyToY(y.v[0][0], y.v[0][1], 0)
                ),
                  (E[_] = l),
                  (_ += 1);
              }
            d && ((f += a[i].l), (f += p)),
              this.textSpans[$]
                ? (this.textSpans[$].elem = E)
                : (this.textSpans[$] = { elem: E }),
              ($ += 1);
          }
        }),
        (CVTextElement.prototype.renderInnerContent = function () {
          var e = this.canvasContext;
          (e.font = this.values.fValue),
            (e.lineCap = "butt"),
            (e.lineJoin = "miter"),
            (e.miterLimit = 4),
            this.data.singleShape ||
              this.textAnimator.getMeasures(
                this.textProperty.currentData,
                this.lettersChangedFlag
              );
          var t,
            r,
            s,
            i,
            n,
            a,
            o = this.textAnimator.renderedLetters,
            h = this.textProperty.currentData.l;
          r = h.length;
          var c,
            m = null,
            S = null,
            u = null,
            v,
            g;
          for (t = 0; t < r; t += 1)
            if (!h[t].n) {
              if (
                ((c = o[t]),
                c &&
                  (this.globalData.renderer.save(),
                  this.globalData.renderer.ctxTransform(c.p),
                  this.globalData.renderer.ctxOpacity(c.o)),
                this.fill)
              ) {
                for (
                  c && c.fc
                    ? m !== c.fc && ((m = c.fc), (e.fillStyle = c.fc))
                    : m !== this.values.fill &&
                      ((m = this.values.fill),
                      (e.fillStyle = this.values.fill)),
                    v = this.textSpans[t].elem,
                    i = v.length,
                    this.globalData.canvasContext.beginPath(),
                    s = 0;
                  s < i;
                  s += 1
                )
                  for (
                    g = v[s],
                      a = g.length,
                      this.globalData.canvasContext.moveTo(g[0], g[1]),
                      n = 2;
                    n < a;
                    n += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      g[n],
                      g[n + 1],
                      g[n + 2],
                      g[n + 3],
                      g[n + 4],
                      g[n + 5]
                    );
                this.globalData.canvasContext.closePath(),
                  this.globalData.canvasContext.fill();
              }
              if (this.stroke) {
                for (
                  c && c.sw
                    ? u !== c.sw && ((u = c.sw), (e.lineWidth = c.sw))
                    : u !== this.values.sWidth &&
                      ((u = this.values.sWidth),
                      (e.lineWidth = this.values.sWidth)),
                    c && c.sc
                      ? S !== c.sc && ((S = c.sc), (e.strokeStyle = c.sc))
                      : S !== this.values.stroke &&
                        ((S = this.values.stroke),
                        (e.strokeStyle = this.values.stroke)),
                    v = this.textSpans[t].elem,
                    i = v.length,
                    this.globalData.canvasContext.beginPath(),
                    s = 0;
                  s < i;
                  s += 1
                )
                  for (
                    g = v[s],
                      a = g.length,
                      this.globalData.canvasContext.moveTo(g[0], g[1]),
                      n = 2;
                    n < a;
                    n += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      g[n],
                      g[n + 1],
                      g[n + 2],
                      g[n + 3],
                      g[n + 4],
                      g[n + 5]
                    );
                this.globalData.canvasContext.closePath(),
                  this.globalData.canvasContext.stroke();
              }
              c && this.globalData.renderer.restore();
            }
        });
      function CVImageElement(e, t, r) {
        (this.assetData = t.getAssetData(e.refId)),
          (this.img = t.imageLoader.getAsset(this.assetData)),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVImageElement
      ),
        (CVImageElement.prototype.initElement =
          SVGShapeElement.prototype.initElement),
        (CVImageElement.prototype.prepareFrame =
          IImageElement.prototype.prepareFrame),
        (CVImageElement.prototype.createContent = function () {
          if (
            this.img.width &&
            (this.assetData.w !== this.img.width ||
              this.assetData.h !== this.img.height)
          ) {
            var e = createTag("canvas");
            (e.width = this.assetData.w), (e.height = this.assetData.h);
            var t = e.getContext("2d"),
              r = this.img.width,
              s = this.img.height,
              i = r / s,
              n = this.assetData.w / this.assetData.h,
              a,
              o,
              h =
                this.assetData.pr ||
                this.globalData.renderConfig.imagePreserveAspectRatio;
            (i > n && h === "xMidYMid slice") ||
            (i < n && h !== "xMidYMid slice")
              ? ((o = s), (a = o * n))
              : ((a = r), (o = a / n)),
              t.drawImage(
                this.img,
                (r - a) / 2,
                (s - o) / 2,
                a,
                o,
                0,
                0,
                this.assetData.w,
                this.assetData.h
              ),
              (this.img = e);
          }
        }),
        (CVImageElement.prototype.renderInnerContent = function () {
          this.canvasContext.drawImage(this.img, 0, 0);
        }),
        (CVImageElement.prototype.destroy = function () {
          this.img = null;
        });
      function CVSolidElement(e, t, r) {
        this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVSolidElement
      ),
        (CVSolidElement.prototype.initElement =
          SVGShapeElement.prototype.initElement),
        (CVSolidElement.prototype.prepareFrame =
          IImageElement.prototype.prepareFrame),
        (CVSolidElement.prototype.renderInnerContent = function () {
          var e = this.canvasContext;
          (e.fillStyle = this.data.sc),
            e.fillRect(0, 0, this.data.sw, this.data.sh);
        });
      function CanvasRendererBase(e, t) {
        (this.animationItem = e),
          (this.renderConfig = {
            clearCanvas: t && t.clearCanvas !== void 0 ? t.clearCanvas : !0,
            context: (t && t.context) || null,
            progressiveLoad: (t && t.progressiveLoad) || !1,
            preserveAspectRatio:
              (t && t.preserveAspectRatio) || "xMidYMid meet",
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || "xMidYMid slice",
            contentVisibility: (t && t.contentVisibility) || "visible",
            className: (t && t.className) || "",
            id: (t && t.id) || "",
          }),
          (this.renderConfig.dpr = (t && t.dpr) || 1),
          this.animationItem.wrapper &&
            (this.renderConfig.dpr =
              (t && t.dpr) || window.devicePixelRatio || 1),
          (this.renderedFrame = -1),
          (this.globalData = {
            frameNum: -1,
            _mdf: !1,
            renderConfig: this.renderConfig,
            currentGlobalAlpha: -1,
          }),
          (this.contextData = new CVContextData()),
          (this.elements = []),
          (this.pendingElements = []),
          (this.transformMat = new Matrix()),
          (this.completeLayers = !1),
          (this.rendererType = "canvas");
      }
      extendPrototype([BaseRenderer], CanvasRendererBase),
        (CanvasRendererBase.prototype.createShape = function (e) {
          return new CVShapeElement(e, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createText = function (e) {
          return new CVTextElement(e, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createImage = function (e) {
          return new CVImageElement(e, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createSolid = function (e) {
          return new CVSolidElement(e, this.globalData, this);
        }),
        (CanvasRendererBase.prototype.createNull =
          SVGRenderer.prototype.createNull),
        (CanvasRendererBase.prototype.ctxTransform = function (e) {
          if (
            !(
              e[0] === 1 &&
              e[1] === 0 &&
              e[4] === 0 &&
              e[5] === 1 &&
              e[12] === 0 &&
              e[13] === 0
            )
          ) {
            if (!this.renderConfig.clearCanvas) {
              this.canvasContext.transform(
                e[0],
                e[1],
                e[4],
                e[5],
                e[12],
                e[13]
              );
              return;
            }
            this.transformMat.cloneFromProps(e);
            var t = this.contextData.cTr.props;
            this.transformMat.transform(
              t[0],
              t[1],
              t[2],
              t[3],
              t[4],
              t[5],
              t[6],
              t[7],
              t[8],
              t[9],
              t[10],
              t[11],
              t[12],
              t[13],
              t[14],
              t[15]
            ),
              this.contextData.cTr.cloneFromProps(this.transformMat.props);
            var r = this.contextData.cTr.props;
            this.canvasContext.setTransform(
              r[0],
              r[1],
              r[4],
              r[5],
              r[12],
              r[13]
            );
          }
        }),
        (CanvasRendererBase.prototype.ctxOpacity = function (e) {
          if (!this.renderConfig.clearCanvas) {
            (this.canvasContext.globalAlpha *= e < 0 ? 0 : e),
              (this.globalData.currentGlobalAlpha = this.contextData.cO);
            return;
          }
          (this.contextData.cO *= e < 0 ? 0 : e),
            this.globalData.currentGlobalAlpha !== this.contextData.cO &&
              ((this.canvasContext.globalAlpha = this.contextData.cO),
              (this.globalData.currentGlobalAlpha = this.contextData.cO));
        }),
        (CanvasRendererBase.prototype.reset = function () {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.restore();
            return;
          }
          this.contextData.reset();
        }),
        (CanvasRendererBase.prototype.save = function (e) {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.save();
            return;
          }
          e && this.canvasContext.save();
          var t = this.contextData.cTr.props;
          this.contextData._length <= this.contextData.cArrPos &&
            this.contextData.duplicate();
          var r,
            s = this.contextData.saved[this.contextData.cArrPos];
          for (r = 0; r < 16; r += 1) s[r] = t[r];
          (this.contextData.savedOp[this.contextData.cArrPos] =
            this.contextData.cO),
            (this.contextData.cArrPos += 1);
        }),
        (CanvasRendererBase.prototype.restore = function (e) {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.restore();
            return;
          }
          e &&
            (this.canvasContext.restore(),
            (this.globalData.blendMode = "source-over")),
            (this.contextData.cArrPos -= 1);
          var t = this.contextData.saved[this.contextData.cArrPos],
            r,
            s = this.contextData.cTr.props;
          for (r = 0; r < 16; r += 1) s[r] = t[r];
          this.canvasContext.setTransform(t[0], t[1], t[4], t[5], t[12], t[13]),
            (t = this.contextData.savedOp[this.contextData.cArrPos]),
            (this.contextData.cO = t),
            this.globalData.currentGlobalAlpha !== t &&
              ((this.canvasContext.globalAlpha = t),
              (this.globalData.currentGlobalAlpha = t));
        }),
        (CanvasRendererBase.prototype.configAnimation = function (e) {
          if (this.animationItem.wrapper) {
            this.animationItem.container = createTag("canvas");
            var t = this.animationItem.container.style;
            (t.width = "100%"), (t.height = "100%");
            var r = "0px 0px 0px";
            (t.transformOrigin = r),
              (t.mozTransformOrigin = r),
              (t.webkitTransformOrigin = r),
              (t["-webkit-transform"] = r),
              (t.contentVisibility = this.renderConfig.contentVisibility),
              this.animationItem.wrapper.appendChild(
                this.animationItem.container
              ),
              (this.canvasContext =
                this.animationItem.container.getContext("2d")),
              this.renderConfig.className &&
                this.animationItem.container.setAttribute(
                  "class",
                  this.renderConfig.className
                ),
              this.renderConfig.id &&
                this.animationItem.container.setAttribute(
                  "id",
                  this.renderConfig.id
                );
          } else this.canvasContext = this.renderConfig.context;
          (this.data = e),
            (this.layers = e.layers),
            (this.transformCanvas = {
              w: e.w,
              h: e.h,
              sx: 0,
              sy: 0,
              tx: 0,
              ty: 0,
            }),
            this.setupGlobalData(e, document.body),
            (this.globalData.canvasContext = this.canvasContext),
            (this.globalData.renderer = this),
            (this.globalData.isDashed = !1),
            (this.globalData.progressiveLoad =
              this.renderConfig.progressiveLoad),
            (this.globalData.transformCanvas = this.transformCanvas),
            (this.elements = createSizedArray(e.layers.length)),
            this.updateContainerSize();
        }),
        (CanvasRendererBase.prototype.updateContainerSize = function () {
          this.reset();
          var e, t;
          this.animationItem.wrapper && this.animationItem.container
            ? ((e = this.animationItem.wrapper.offsetWidth),
              (t = this.animationItem.wrapper.offsetHeight),
              this.animationItem.container.setAttribute(
                "width",
                e * this.renderConfig.dpr
              ),
              this.animationItem.container.setAttribute(
                "height",
                t * this.renderConfig.dpr
              ))
            : ((e = this.canvasContext.canvas.width * this.renderConfig.dpr),
              (t = this.canvasContext.canvas.height * this.renderConfig.dpr));
          var r, s;
          if (
            this.renderConfig.preserveAspectRatio.indexOf("meet") !== -1 ||
            this.renderConfig.preserveAspectRatio.indexOf("slice") !== -1
          ) {
            var i = this.renderConfig.preserveAspectRatio.split(" "),
              n = i[1] || "meet",
              a = i[0] || "xMidYMid",
              o = a.substr(0, 4),
              h = a.substr(4);
            (r = e / t),
              (s = this.transformCanvas.w / this.transformCanvas.h),
              (s > r && n === "meet") || (s < r && n === "slice")
                ? ((this.transformCanvas.sx =
                    e / (this.transformCanvas.w / this.renderConfig.dpr)),
                  (this.transformCanvas.sy =
                    e / (this.transformCanvas.w / this.renderConfig.dpr)))
                : ((this.transformCanvas.sx =
                    t / (this.transformCanvas.h / this.renderConfig.dpr)),
                  (this.transformCanvas.sy =
                    t / (this.transformCanvas.h / this.renderConfig.dpr))),
              o === "xMid" &&
              ((s < r && n === "meet") || (s > r && n === "slice"))
                ? (this.transformCanvas.tx =
                    ((e -
                      this.transformCanvas.w * (t / this.transformCanvas.h)) /
                      2) *
                    this.renderConfig.dpr)
                : o === "xMax" &&
                  ((s < r && n === "meet") || (s > r && n === "slice"))
                ? (this.transformCanvas.tx =
                    (e -
                      this.transformCanvas.w * (t / this.transformCanvas.h)) *
                    this.renderConfig.dpr)
                : (this.transformCanvas.tx = 0),
              h === "YMid" &&
              ((s > r && n === "meet") || (s < r && n === "slice"))
                ? (this.transformCanvas.ty =
                    ((t -
                      this.transformCanvas.h * (e / this.transformCanvas.w)) /
                      2) *
                    this.renderConfig.dpr)
                : h === "YMax" &&
                  ((s > r && n === "meet") || (s < r && n === "slice"))
                ? (this.transformCanvas.ty =
                    (t -
                      this.transformCanvas.h * (e / this.transformCanvas.w)) *
                    this.renderConfig.dpr)
                : (this.transformCanvas.ty = 0);
          } else
            this.renderConfig.preserveAspectRatio === "none"
              ? ((this.transformCanvas.sx =
                  e / (this.transformCanvas.w / this.renderConfig.dpr)),
                (this.transformCanvas.sy =
                  t / (this.transformCanvas.h / this.renderConfig.dpr)),
                (this.transformCanvas.tx = 0),
                (this.transformCanvas.ty = 0))
              : ((this.transformCanvas.sx = this.renderConfig.dpr),
                (this.transformCanvas.sy = this.renderConfig.dpr),
                (this.transformCanvas.tx = 0),
                (this.transformCanvas.ty = 0));
          (this.transformCanvas.props = [
            this.transformCanvas.sx,
            0,
            0,
            0,
            0,
            this.transformCanvas.sy,
            0,
            0,
            0,
            0,
            1,
            0,
            this.transformCanvas.tx,
            this.transformCanvas.ty,
            0,
            1,
          ]),
            this.ctxTransform(this.transformCanvas.props),
            this.canvasContext.beginPath(),
            this.canvasContext.rect(
              0,
              0,
              this.transformCanvas.w,
              this.transformCanvas.h
            ),
            this.canvasContext.closePath(),
            this.canvasContext.clip(),
            this.renderFrame(this.renderedFrame, !0);
        }),
        (CanvasRendererBase.prototype.destroy = function () {
          this.renderConfig.clearCanvas &&
            this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = "");
          var e,
            t = this.layers ? this.layers.length : 0;
          for (e = t - 1; e >= 0; e -= 1)
            this.elements[e] && this.elements[e].destroy();
          (this.elements.length = 0),
            (this.globalData.canvasContext = null),
            (this.animationItem.container = null),
            (this.destroyed = !0);
        }),
        (CanvasRendererBase.prototype.renderFrame = function (e, t) {
          if (
            !(
              (this.renderedFrame === e &&
                this.renderConfig.clearCanvas === !0 &&
                !t) ||
              this.destroyed ||
              e === -1
            )
          ) {
            (this.renderedFrame = e),
              (this.globalData.frameNum = e - this.animationItem._isFirstFrame),
              (this.globalData.frameId += 1),
              (this.globalData._mdf = !this.renderConfig.clearCanvas || t),
              (this.globalData.projectInterface.currentFrame = e);
            var r,
              s = this.layers.length;
            for (
              this.completeLayers || this.checkLayers(e), r = 0;
              r < s;
              r += 1
            )
              (this.completeLayers || this.elements[r]) &&
                this.elements[r].prepareFrame(e - this.layers[r].st);
            if (this.globalData._mdf) {
              for (
                this.renderConfig.clearCanvas === !0
                  ? this.canvasContext.clearRect(
                      0,
                      0,
                      this.transformCanvas.w,
                      this.transformCanvas.h
                    )
                  : this.save(),
                  r = s - 1;
                r >= 0;
                r -= 1
              )
                (this.completeLayers || this.elements[r]) &&
                  this.elements[r].renderFrame();
              this.renderConfig.clearCanvas !== !0 && this.restore();
            }
          }
        }),
        (CanvasRendererBase.prototype.buildItem = function (e) {
          var t = this.elements;
          if (!(t[e] || this.layers[e].ty === 99)) {
            var r = this.createItem(this.layers[e], this, this.globalData);
            (t[e] = r), r.initExpressions();
          }
        }),
        (CanvasRendererBase.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var e = this.pendingElements.pop();
            e.checkParenting();
          }
        }),
        (CanvasRendererBase.prototype.hide = function () {
          this.animationItem.container.style.display = "none";
        }),
        (CanvasRendererBase.prototype.show = function () {
          this.animationItem.container.style.display = "block";
        });
      function CVCompElement(e, t, r) {
        (this.completeLayers = !1),
          (this.layers = e.layers),
          (this.pendingElements = []),
          (this.elements = createSizedArray(this.layers.length)),
          this.initElement(e, t, r),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 });
      }
      extendPrototype(
        [CanvasRendererBase, ICompElement, CVBaseElement],
        CVCompElement
      ),
        (CVCompElement.prototype.renderInnerContent = function () {
          var e = this.canvasContext;
          e.beginPath(),
            e.moveTo(0, 0),
            e.lineTo(this.data.w, 0),
            e.lineTo(this.data.w, this.data.h),
            e.lineTo(0, this.data.h),
            e.lineTo(0, 0),
            e.clip();
          var t,
            r = this.layers.length;
          for (t = r - 1; t >= 0; t -= 1)
            (this.completeLayers || this.elements[t]) &&
              this.elements[t].renderFrame();
        }),
        (CVCompElement.prototype.destroy = function () {
          var e,
            t = this.layers.length;
          for (e = t - 1; e >= 0; e -= 1)
            this.elements[e] && this.elements[e].destroy();
          (this.layers = null), (this.elements = null);
        }),
        (CVCompElement.prototype.createComp = function (e) {
          return new CVCompElement(e, this.globalData, this);
        });
      function CanvasRenderer(e, t) {
        (this.animationItem = e),
          (this.renderConfig = {
            clearCanvas: t && t.clearCanvas !== void 0 ? t.clearCanvas : !0,
            context: (t && t.context) || null,
            progressiveLoad: (t && t.progressiveLoad) || !1,
            preserveAspectRatio:
              (t && t.preserveAspectRatio) || "xMidYMid meet",
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || "xMidYMid slice",
            contentVisibility: (t && t.contentVisibility) || "visible",
            className: (t && t.className) || "",
            id: (t && t.id) || "",
          }),
          (this.renderConfig.dpr = (t && t.dpr) || 1),
          this.animationItem.wrapper &&
            (this.renderConfig.dpr =
              (t && t.dpr) || window.devicePixelRatio || 1),
          (this.renderedFrame = -1),
          (this.globalData = {
            frameNum: -1,
            _mdf: !1,
            renderConfig: this.renderConfig,
            currentGlobalAlpha: -1,
          }),
          (this.contextData = new CVContextData()),
          (this.elements = []),
          (this.pendingElements = []),
          (this.transformMat = new Matrix()),
          (this.completeLayers = !1),
          (this.rendererType = "canvas");
      }
      extendPrototype([CanvasRendererBase], CanvasRenderer),
        (CanvasRenderer.prototype.createComp = function (e) {
          return new CVCompElement(e, this.globalData, this);
        });
      function HBaseElement() {}
      (HBaseElement.prototype = {
        checkBlendMode: function () {},
        initRendererElement: function () {
          (this.baseElement = createTag(this.data.tg || "div")),
            this.data.hasMask
              ? ((this.svgElement = createNS("svg")),
                (this.layerElement = createNS("g")),
                (this.maskedElement = this.layerElement),
                this.svgElement.appendChild(this.layerElement),
                this.baseElement.appendChild(this.svgElement))
              : (this.layerElement = this.baseElement),
            styleDiv(this.baseElement);
        },
        createContainerElements: function () {
          (this.renderableEffectsManager = new CVEffects()),
            (this.transformedElement = this.baseElement),
            (this.maskedElement = this.layerElement),
            this.data.ln && this.layerElement.setAttribute("id", this.data.ln),
            this.data.cl &&
              this.layerElement.setAttribute("class", this.data.cl),
            this.data.bm !== 0 && this.setBlendMode();
        },
        renderElement: function () {
          var t = this.transformedElement ? this.transformedElement.style : {};
          if (this.finalTransform._matMdf) {
            var r = this.finalTransform.mat.toCSS();
            (t.transform = r), (t.webkitTransform = r);
          }
          this.finalTransform._opMdf &&
            (t.opacity = this.finalTransform.mProp.o.v);
        },
        renderFrame: function () {
          this.data.hd ||
            this.hidden ||
            (this.renderTransform(),
            this.renderRenderable(),
            this.renderElement(),
            this.renderInnerContent(),
            this._isFirstFrame && (this._isFirstFrame = !1));
        },
        destroy: function () {
          (this.layerElement = null),
            (this.transformedElement = null),
            this.matteElement && (this.matteElement = null),
            this.maskManager &&
              (this.maskManager.destroy(), (this.maskManager = null));
        },
        createRenderableComponents: function () {
          this.maskManager = new MaskElement(this.data, this, this.globalData);
        },
        addEffects: function () {},
        setMatte: function () {},
      }),
        (HBaseElement.prototype.getBaseElement =
          SVGBaseElement.prototype.getBaseElement),
        (HBaseElement.prototype.destroyBaseElement =
          HBaseElement.prototype.destroy),
        (HBaseElement.prototype.buildElementParenting =
          BaseRenderer.prototype.buildElementParenting);
      function HSolidElement(e, t, r) {
        this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        HSolidElement
      ),
        (HSolidElement.prototype.createContent = function () {
          var e;
          this.data.hasMask
            ? ((e = createNS("rect")),
              e.setAttribute("width", this.data.sw),
              e.setAttribute("height", this.data.sh),
              e.setAttribute("fill", this.data.sc),
              this.svgElement.setAttribute("width", this.data.sw),
              this.svgElement.setAttribute("height", this.data.sh))
            : ((e = createTag("div")),
              (e.style.width = this.data.sw + "px"),
              (e.style.height = this.data.sh + "px"),
              (e.style.backgroundColor = this.data.sc)),
            this.layerElement.appendChild(e);
        });
      function HShapeElement(e, t, r) {
        (this.shapes = []),
          (this.shapesData = e.shapes),
          (this.stylesList = []),
          (this.shapeModifiers = []),
          (this.itemsData = []),
          (this.processedElements = []),
          (this.animatedContents = []),
          (this.shapesContainer = createNS("g")),
          this.initElement(e, t, r),
          (this.prevViewData = []),
          (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 });
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HSolidElement,
          SVGShapeElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        HShapeElement
      ),
        (HShapeElement.prototype._renderShapeFrame =
          HShapeElement.prototype.renderInnerContent),
        (HShapeElement.prototype.createContent = function () {
          var e;
          if (((this.baseElement.style.fontSize = 0), this.data.hasMask))
            this.layerElement.appendChild(this.shapesContainer),
              (e = this.svgElement);
          else {
            e = createNS("svg");
            var t = this.comp.data ? this.comp.data : this.globalData.compSize;
            e.setAttribute("width", t.w),
              e.setAttribute("height", t.h),
              e.appendChild(this.shapesContainer),
              this.layerElement.appendChild(e);
          }
          this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            this.shapesContainer,
            0,
            [],
            !0
          ),
            this.filterUniqueShapes(),
            (this.shapeCont = e);
        }),
        (HShapeElement.prototype.getTransformedPoint = function (e, t) {
          var r,
            s = e.length;
          for (r = 0; r < s; r += 1)
            t = e[r].mProps.v.applyToPointArray(t[0], t[1], 0);
          return t;
        }),
        (HShapeElement.prototype.calculateShapeBoundingBox = function (e, t) {
          var r = e.sh.v,
            s = e.transformers,
            i,
            n = r._length,
            a,
            o,
            h,
            c;
          if (!(n <= 1)) {
            for (i = 0; i < n - 1; i += 1)
              (a = this.getTransformedPoint(s, r.v[i])),
                (o = this.getTransformedPoint(s, r.o[i])),
                (h = this.getTransformedPoint(s, r.i[i + 1])),
                (c = this.getTransformedPoint(s, r.v[i + 1])),
                this.checkBounds(a, o, h, c, t);
            r.c &&
              ((a = this.getTransformedPoint(s, r.v[i])),
              (o = this.getTransformedPoint(s, r.o[i])),
              (h = this.getTransformedPoint(s, r.i[0])),
              (c = this.getTransformedPoint(s, r.v[0])),
              this.checkBounds(a, o, h, c, t));
          }
        }),
        (HShapeElement.prototype.checkBounds = function (e, t, r, s, i) {
          this.getBoundsOfCurve(e, t, r, s);
          var n = this.shapeBoundingBox;
          (i.x = bmMin(n.left, i.x)),
            (i.xMax = bmMax(n.right, i.xMax)),
            (i.y = bmMin(n.top, i.y)),
            (i.yMax = bmMax(n.bottom, i.yMax));
        }),
        (HShapeElement.prototype.shapeBoundingBox = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }),
        (HShapeElement.prototype.tempBoundingBox = {
          x: 0,
          xMax: 0,
          y: 0,
          yMax: 0,
          width: 0,
          height: 0,
        }),
        (HShapeElement.prototype.getBoundsOfCurve = function (e, t, r, s) {
          for (
            var i = [
                [e[0], s[0]],
                [e[1], s[1]],
              ],
              n,
              a,
              o,
              h,
              c,
              m,
              S,
              u = 0;
            u < 2;
            ++u
          )
            (a = 6 * e[u] - 12 * t[u] + 6 * r[u]),
              (n = -3 * e[u] + 9 * t[u] - 9 * r[u] + 3 * s[u]),
              (o = 3 * t[u] - 3 * e[u]),
              (a |= 0),
              (n |= 0),
              (o |= 0),
              (n === 0 && a === 0) ||
                (n === 0
                  ? ((h = -o / a),
                    h > 0 &&
                      h < 1 &&
                      i[u].push(this.calculateF(h, e, t, r, s, u)))
                  : ((c = a * a - 4 * o * n),
                    c >= 0 &&
                      ((m = (-a + bmSqrt(c)) / (2 * n)),
                      m > 0 &&
                        m < 1 &&
                        i[u].push(this.calculateF(m, e, t, r, s, u)),
                      (S = (-a - bmSqrt(c)) / (2 * n)),
                      S > 0 &&
                        S < 1 &&
                        i[u].push(this.calculateF(S, e, t, r, s, u)))));
          (this.shapeBoundingBox.left = bmMin.apply(null, i[0])),
            (this.shapeBoundingBox.top = bmMin.apply(null, i[1])),
            (this.shapeBoundingBox.right = bmMax.apply(null, i[0])),
            (this.shapeBoundingBox.bottom = bmMax.apply(null, i[1]));
        }),
        (HShapeElement.prototype.calculateF = function (e, t, r, s, i, n) {
          return (
            bmPow(1 - e, 3) * t[n] +
            3 * bmPow(1 - e, 2) * e * r[n] +
            3 * (1 - e) * bmPow(e, 2) * s[n] +
            bmPow(e, 3) * i[n]
          );
        }),
        (HShapeElement.prototype.calculateBoundingBox = function (e, t) {
          var r,
            s = e.length;
          for (r = 0; r < s; r += 1)
            e[r] && e[r].sh
              ? this.calculateShapeBoundingBox(e[r], t)
              : e[r] && e[r].it
              ? this.calculateBoundingBox(e[r].it, t)
              : e[r] &&
                e[r].style &&
                e[r].w &&
                this.expandStrokeBoundingBox(e[r].w, t);
        }),
        (HShapeElement.prototype.expandStrokeBoundingBox = function (e, t) {
          var r = 0;
          if (e.keyframes) {
            for (var s = 0; s < e.keyframes.length; s += 1) {
              var i = e.keyframes[s].s;
              i > r && (r = i);
            }
            r *= e.mult;
          } else r = e.v * e.mult;
          (t.x -= r), (t.xMax += r), (t.y -= r), (t.yMax += r);
        }),
        (HShapeElement.prototype.currentBoxContains = function (e) {
          return (
            this.currentBBox.x <= e.x &&
            this.currentBBox.y <= e.y &&
            this.currentBBox.width + this.currentBBox.x >= e.x + e.width &&
            this.currentBBox.height + this.currentBBox.y >= e.y + e.height
          );
        }),
        (HShapeElement.prototype.renderInnerContent = function () {
          if (
            (this._renderShapeFrame(),
            !this.hidden && (this._isFirstFrame || this._mdf))
          ) {
            var e = this.tempBoundingBox,
              t = 999999;
            if (
              ((e.x = t),
              (e.xMax = -t),
              (e.y = t),
              (e.yMax = -t),
              this.calculateBoundingBox(this.itemsData, e),
              (e.width = e.xMax < e.x ? 0 : e.xMax - e.x),
              (e.height = e.yMax < e.y ? 0 : e.yMax - e.y),
              this.currentBoxContains(e))
            )
              return;
            var r = !1;
            if (
              (this.currentBBox.w !== e.width &&
                ((this.currentBBox.w = e.width),
                this.shapeCont.setAttribute("width", e.width),
                (r = !0)),
              this.currentBBox.h !== e.height &&
                ((this.currentBBox.h = e.height),
                this.shapeCont.setAttribute("height", e.height),
                (r = !0)),
              r || this.currentBBox.x !== e.x || this.currentBBox.y !== e.y)
            ) {
              (this.currentBBox.w = e.width),
                (this.currentBBox.h = e.height),
                (this.currentBBox.x = e.x),
                (this.currentBBox.y = e.y),
                this.shapeCont.setAttribute(
                  "viewBox",
                  this.currentBBox.x +
                    " " +
                    this.currentBBox.y +
                    " " +
                    this.currentBBox.w +
                    " " +
                    this.currentBBox.h
                );
              var s = this.shapeCont.style,
                i =
                  "translate(" +
                  this.currentBBox.x +
                  "px," +
                  this.currentBBox.y +
                  "px)";
              (s.transform = i), (s.webkitTransform = i);
            }
          }
        });
      function HTextElement(e, t, r) {
        (this.textSpans = []),
          (this.textPaths = []),
          (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }),
          (this.renderType = "svg"),
          (this.isMasked = !1),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
          ITextElement,
        ],
        HTextElement
      ),
        (HTextElement.prototype.createContent = function () {
          if (((this.isMasked = this.checkMasks()), this.isMasked)) {
            (this.renderType = "svg"),
              (this.compW = this.comp.data.w),
              (this.compH = this.comp.data.h),
              this.svgElement.setAttribute("width", this.compW),
              this.svgElement.setAttribute("height", this.compH);
            var e = createNS("g");
            this.maskedElement.appendChild(e), (this.innerElem = e);
          } else
            (this.renderType = "html"), (this.innerElem = this.layerElement);
          this.checkParenting();
        }),
        (HTextElement.prototype.buildNewText = function () {
          var e = this.textProperty.currentData;
          this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
          var t = this.innerElem.style,
            r = e.fc ? this.buildColor(e.fc) : "rgba(0,0,0,0)";
          (t.fill = r),
            (t.color = r),
            e.sc &&
              ((t.stroke = this.buildColor(e.sc)),
              (t.strokeWidth = e.sw + "px"));
          var s = this.globalData.fontManager.getFontByName(e.f);
          if (!this.globalData.fontManager.chars)
            if (
              ((t.fontSize = e.finalSize + "px"),
              (t.lineHeight = e.finalSize + "px"),
              s.fClass)
            )
              this.innerElem.className = s.fClass;
            else {
              t.fontFamily = s.fFamily;
              var i = e.fWeight,
                n = e.fStyle;
              (t.fontStyle = n), (t.fontWeight = i);
            }
          var a,
            o,
            h = e.l;
          o = h.length;
          var c,
            m,
            S,
            u = this.mHelper,
            v,
            g = "",
            y = 0;
          for (a = 0; a < o; a += 1) {
            if (
              (this.globalData.fontManager.chars
                ? (this.textPaths[y]
                    ? (c = this.textPaths[y])
                    : ((c = createNS("path")),
                      c.setAttribute("stroke-linecap", lineCapEnum[1]),
                      c.setAttribute("stroke-linejoin", lineJoinEnum[2]),
                      c.setAttribute("stroke-miterlimit", "4")),
                  this.isMasked ||
                    (this.textSpans[y]
                      ? ((m = this.textSpans[y]), (S = m.children[0]))
                      : ((m = createTag("div")),
                        (m.style.lineHeight = 0),
                        (S = createNS("svg")),
                        S.appendChild(c),
                        styleDiv(m))))
                : this.isMasked
                ? (c = this.textPaths[y] ? this.textPaths[y] : createNS("text"))
                : this.textSpans[y]
                ? ((m = this.textSpans[y]), (c = this.textPaths[y]))
                : ((m = createTag("span")),
                  styleDiv(m),
                  (c = createTag("span")),
                  styleDiv(c),
                  m.appendChild(c)),
              this.globalData.fontManager.chars)
            ) {
              var E = this.globalData.fontManager.getCharData(
                  e.finalText[a],
                  s.fStyle,
                  this.globalData.fontManager.getFontByName(e.f).fFamily
                ),
                l;
              if (
                (E ? (l = E.data) : (l = null),
                u.reset(),
                l &&
                  l.shapes &&
                  l.shapes.length &&
                  ((v = l.shapes[0].it),
                  u.scale(e.finalSize / 100, e.finalSize / 100),
                  (g = this.createPathShape(u, v)),
                  c.setAttribute("d", g)),
                this.isMasked)
              )
                this.innerElem.appendChild(c);
              else {
                if ((this.innerElem.appendChild(m), l && l.shapes)) {
                  document.body.appendChild(S);
                  var d = S.getBBox();
                  S.setAttribute("width", d.width + 2),
                    S.setAttribute("height", d.height + 2),
                    S.setAttribute(
                      "viewBox",
                      d.x -
                        1 +
                        " " +
                        (d.y - 1) +
                        " " +
                        (d.width + 2) +
                        " " +
                        (d.height + 2)
                    );
                  var p = S.style,
                    f = "translate(" + (d.x - 1) + "px," + (d.y - 1) + "px)";
                  (p.transform = f),
                    (p.webkitTransform = f),
                    (h[a].yOffset = d.y - 1);
                } else S.setAttribute("width", 1), S.setAttribute("height", 1);
                m.appendChild(S);
              }
            } else if (
              ((c.textContent = h[a].val),
              c.setAttributeNS(
                "http://www.w3.org/XML/1998/namespace",
                "xml:space",
                "preserve"
              ),
              this.isMasked)
            )
              this.innerElem.appendChild(c);
            else {
              this.innerElem.appendChild(m);
              var b = c.style,
                x = "translate3d(0," + -e.finalSize / 1.2 + "px,0)";
              (b.transform = x), (b.webkitTransform = x);
            }
            this.isMasked ? (this.textSpans[y] = c) : (this.textSpans[y] = m),
              (this.textSpans[y].style.display = "block"),
              (this.textPaths[y] = c),
              (y += 1);
          }
          for (; y < this.textSpans.length; )
            (this.textSpans[y].style.display = "none"), (y += 1);
        }),
        (HTextElement.prototype.renderInnerContent = function () {
          var e;
          if (this.data.singleShape) {
            if (!this._isFirstFrame && !this.lettersChangedFlag) return;
            if (this.isMasked && this.finalTransform._matMdf) {
              this.svgElement.setAttribute(
                "viewBox",
                -this.finalTransform.mProp.p.v[0] +
                  " " +
                  -this.finalTransform.mProp.p.v[1] +
                  " " +
                  this.compW +
                  " " +
                  this.compH
              ),
                (e = this.svgElement.style);
              var t =
                "translate(" +
                -this.finalTransform.mProp.p.v[0] +
                "px," +
                -this.finalTransform.mProp.p.v[1] +
                "px)";
              (e.transform = t), (e.webkitTransform = t);
            }
          }
          if (
            (this.textAnimator.getMeasures(
              this.textProperty.currentData,
              this.lettersChangedFlag
            ),
            !(
              !this.lettersChangedFlag && !this.textAnimator.lettersChangedFlag
            ))
          ) {
            var r,
              s,
              i = 0,
              n = this.textAnimator.renderedLetters,
              a = this.textProperty.currentData.l;
            s = a.length;
            var o, h, c;
            for (r = 0; r < s; r += 1)
              a[r].n
                ? (i += 1)
                : ((h = this.textSpans[r]),
                  (c = this.textPaths[r]),
                  (o = n[i]),
                  (i += 1),
                  o._mdf.m &&
                    (this.isMasked
                      ? h.setAttribute("transform", o.m)
                      : ((h.style.webkitTransform = o.m),
                        (h.style.transform = o.m))),
                  (h.style.opacity = o.o),
                  o.sw && o._mdf.sw && c.setAttribute("stroke-width", o.sw),
                  o.sc && o._mdf.sc && c.setAttribute("stroke", o.sc),
                  o.fc &&
                    o._mdf.fc &&
                    (c.setAttribute("fill", o.fc), (c.style.color = o.fc)));
            if (
              this.innerElem.getBBox &&
              !this.hidden &&
              (this._isFirstFrame || this._mdf)
            ) {
              var m = this.innerElem.getBBox();
              this.currentBBox.w !== m.width &&
                ((this.currentBBox.w = m.width),
                this.svgElement.setAttribute("width", m.width)),
                this.currentBBox.h !== m.height &&
                  ((this.currentBBox.h = m.height),
                  this.svgElement.setAttribute("height", m.height));
              var S = 1;
              if (
                this.currentBBox.w !== m.width + S * 2 ||
                this.currentBBox.h !== m.height + S * 2 ||
                this.currentBBox.x !== m.x - S ||
                this.currentBBox.y !== m.y - S
              ) {
                (this.currentBBox.w = m.width + S * 2),
                  (this.currentBBox.h = m.height + S * 2),
                  (this.currentBBox.x = m.x - S),
                  (this.currentBBox.y = m.y - S),
                  this.svgElement.setAttribute(
                    "viewBox",
                    this.currentBBox.x +
                      " " +
                      this.currentBBox.y +
                      " " +
                      this.currentBBox.w +
                      " " +
                      this.currentBBox.h
                  ),
                  (e = this.svgElement.style);
                var u =
                  "translate(" +
                  this.currentBBox.x +
                  "px," +
                  this.currentBBox.y +
                  "px)";
                (e.transform = u), (e.webkitTransform = u);
              }
            }
          }
        });
      function HCameraElement(e, t, r) {
        this.initFrame(), this.initBaseData(e, t, r), this.initHierarchy();
        var s = PropertyFactory.getProp;
        if (
          ((this.pe = s(this, e.pe, 0, 0, this)),
          e.ks.p.s
            ? ((this.px = s(this, e.ks.p.x, 1, 0, this)),
              (this.py = s(this, e.ks.p.y, 1, 0, this)),
              (this.pz = s(this, e.ks.p.z, 1, 0, this)))
            : (this.p = s(this, e.ks.p, 1, 0, this)),
          e.ks.a && (this.a = s(this, e.ks.a, 1, 0, this)),
          e.ks.or.k.length && e.ks.or.k[0].to)
        ) {
          var i,
            n = e.ks.or.k.length;
          for (i = 0; i < n; i += 1)
            (e.ks.or.k[i].to = null), (e.ks.or.k[i].ti = null);
        }
        (this.or = s(this, e.ks.or, 1, degToRads, this)),
          (this.or.sh = !0),
          (this.rx = s(this, e.ks.rx, 0, degToRads, this)),
          (this.ry = s(this, e.ks.ry, 0, degToRads, this)),
          (this.rz = s(this, e.ks.rz, 0, degToRads, this)),
          (this.mat = new Matrix()),
          (this._prevMat = new Matrix()),
          (this._isFirstFrame = !0),
          (this.finalTransform = { mProp: this });
      }
      extendPrototype(
        [BaseElement, FrameElement, HierarchyElement],
        HCameraElement
      ),
        (HCameraElement.prototype.setup = function () {
          var e,
            t = this.comp.threeDElements.length,
            r,
            s,
            i;
          for (e = 0; e < t; e += 1)
            if (((r = this.comp.threeDElements[e]), r.type === "3d")) {
              (s = r.perspectiveElem.style), (i = r.container.style);
              var n = this.pe.v + "px",
                a = "0px 0px 0px",
                o = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
              (s.perspective = n),
                (s.webkitPerspective = n),
                (i.transformOrigin = a),
                (i.mozTransformOrigin = a),
                (i.webkitTransformOrigin = a),
                (s.transform = o),
                (s.webkitTransform = o);
            }
        }),
        (HCameraElement.prototype.createElements = function () {}),
        (HCameraElement.prototype.hide = function () {}),
        (HCameraElement.prototype.renderFrame = function () {
          var e = this._isFirstFrame,
            t,
            r;
          if (this.hierarchy)
            for (r = this.hierarchy.length, t = 0; t < r; t += 1)
              e = this.hierarchy[t].finalTransform.mProp._mdf || e;
          if (
            e ||
            this.pe._mdf ||
            (this.p && this.p._mdf) ||
            (this.px && (this.px._mdf || this.py._mdf || this.pz._mdf)) ||
            this.rx._mdf ||
            this.ry._mdf ||
            this.rz._mdf ||
            this.or._mdf ||
            (this.a && this.a._mdf)
          ) {
            if ((this.mat.reset(), this.hierarchy))
              for (r = this.hierarchy.length - 1, t = r; t >= 0; t -= 1) {
                var s = this.hierarchy[t].finalTransform.mProp;
                this.mat.translate(-s.p.v[0], -s.p.v[1], s.p.v[2]),
                  this.mat
                    .rotateX(-s.or.v[0])
                    .rotateY(-s.or.v[1])
                    .rotateZ(s.or.v[2]),
                  this.mat.rotateX(-s.rx.v).rotateY(-s.ry.v).rotateZ(s.rz.v),
                  this.mat.scale(1 / s.s.v[0], 1 / s.s.v[1], 1 / s.s.v[2]),
                  this.mat.translate(s.a.v[0], s.a.v[1], s.a.v[2]);
              }
            if (
              (this.p
                ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2])
                : this.mat.translate(-this.px.v, -this.py.v, this.pz.v),
              this.a)
            ) {
              var i;
              this.p
                ? (i = [
                    this.p.v[0] - this.a.v[0],
                    this.p.v[1] - this.a.v[1],
                    this.p.v[2] - this.a.v[2],
                  ])
                : (i = [
                    this.px.v - this.a.v[0],
                    this.py.v - this.a.v[1],
                    this.pz.v - this.a.v[2],
                  ]);
              var n = Math.sqrt(
                  Math.pow(i[0], 2) + Math.pow(i[1], 2) + Math.pow(i[2], 2)
                ),
                a = [i[0] / n, i[1] / n, i[2] / n],
                o = Math.sqrt(a[2] * a[2] + a[0] * a[0]),
                h = Math.atan2(a[1], o),
                c = Math.atan2(a[0], -a[2]);
              this.mat.rotateY(c).rotateX(-h);
            }
            this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v),
              this.mat
                .rotateX(-this.or.v[0])
                .rotateY(-this.or.v[1])
                .rotateZ(this.or.v[2]),
              this.mat.translate(
                this.globalData.compSize.w / 2,
                this.globalData.compSize.h / 2,
                0
              ),
              this.mat.translate(0, 0, this.pe.v);
            var m = !this._prevMat.equals(this.mat);
            if ((m || this.pe._mdf) && this.comp.threeDElements) {
              r = this.comp.threeDElements.length;
              var S, u, v;
              for (t = 0; t < r; t += 1)
                if (((S = this.comp.threeDElements[t]), S.type === "3d")) {
                  if (m) {
                    var g = this.mat.toCSS();
                    (v = S.container.style),
                      (v.transform = g),
                      (v.webkitTransform = g);
                  }
                  this.pe._mdf &&
                    ((u = S.perspectiveElem.style),
                    (u.perspective = this.pe.v + "px"),
                    (u.webkitPerspective = this.pe.v + "px"));
                }
              this.mat.clone(this._prevMat);
            }
          }
          this._isFirstFrame = !1;
        }),
        (HCameraElement.prototype.prepareFrame = function (e) {
          this.prepareProperties(e, !0);
        }),
        (HCameraElement.prototype.destroy = function () {}),
        (HCameraElement.prototype.getBaseElement = function () {
          return null;
        });
      function HImageElement(e, t, r) {
        (this.assetData = t.getAssetData(e.refId)), this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HSolidElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        HImageElement
      ),
        (HImageElement.prototype.createContent = function () {
          var e = this.globalData.getAssetsPath(this.assetData),
            t = new Image();
          this.data.hasMask
            ? ((this.imageElem = createNS("image")),
              this.imageElem.setAttribute("width", this.assetData.w + "px"),
              this.imageElem.setAttribute("height", this.assetData.h + "px"),
              this.imageElem.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href",
                e
              ),
              this.layerElement.appendChild(this.imageElem),
              this.baseElement.setAttribute("width", this.assetData.w),
              this.baseElement.setAttribute("height", this.assetData.h))
            : this.layerElement.appendChild(t),
            (t.crossOrigin = "anonymous"),
            (t.src = e),
            this.data.ln && this.baseElement.setAttribute("id", this.data.ln);
        });
      function HybridRendererBase(e, t) {
        (this.animationItem = e),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.renderConfig = {
            className: (t && t.className) || "",
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || "xMidYMid slice",
            hideOnTransparent: !(t && t.hideOnTransparent === !1),
            filterSize: {
              width: (t && t.filterSize && t.filterSize.width) || "400%",
              height: (t && t.filterSize && t.filterSize.height) || "400%",
              x: (t && t.filterSize && t.filterSize.x) || "-100%",
              y: (t && t.filterSize && t.filterSize.y) || "-100%",
            },
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            renderConfig: this.renderConfig,
          }),
          (this.pendingElements = []),
          (this.elements = []),
          (this.threeDElements = []),
          (this.destroyed = !1),
          (this.camera = null),
          (this.supports3d = !0),
          (this.rendererType = "html");
      }
      extendPrototype([BaseRenderer], HybridRendererBase),
        (HybridRendererBase.prototype.buildItem =
          SVGRenderer.prototype.buildItem),
        (HybridRendererBase.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var e = this.pendingElements.pop();
            e.checkParenting();
          }
        }),
        (HybridRendererBase.prototype.appendElementInPos = function (e, t) {
          var r = e.getBaseElement();
          if (!!r) {
            var s = this.layers[t];
            if (!s.ddd || !this.supports3d)
              if (this.threeDElements) this.addTo3dContainer(r, t);
              else {
                for (var i = 0, n, a, o; i < t; )
                  this.elements[i] &&
                    this.elements[i] !== !0 &&
                    this.elements[i].getBaseElement &&
                    ((a = this.elements[i]),
                    (o = this.layers[i].ddd
                      ? this.getThreeDContainerByPos(i)
                      : a.getBaseElement()),
                    (n = o || n)),
                    (i += 1);
                n
                  ? (!s.ddd || !this.supports3d) &&
                    this.layerElement.insertBefore(r, n)
                  : (!s.ddd || !this.supports3d) &&
                    this.layerElement.appendChild(r);
              }
            else this.addTo3dContainer(r, t);
          }
        }),
        (HybridRendererBase.prototype.createShape = function (e) {
          return this.supports3d
            ? new HShapeElement(e, this.globalData, this)
            : new SVGShapeElement(e, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createText = function (e) {
          return this.supports3d
            ? new HTextElement(e, this.globalData, this)
            : new SVGTextLottieElement(e, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createCamera = function (e) {
          return (
            (this.camera = new HCameraElement(e, this.globalData, this)),
            this.camera
          );
        }),
        (HybridRendererBase.prototype.createImage = function (e) {
          return this.supports3d
            ? new HImageElement(e, this.globalData, this)
            : new IImageElement(e, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createSolid = function (e) {
          return this.supports3d
            ? new HSolidElement(e, this.globalData, this)
            : new ISolidElement(e, this.globalData, this);
        }),
        (HybridRendererBase.prototype.createNull =
          SVGRenderer.prototype.createNull),
        (HybridRendererBase.prototype.getThreeDContainerByPos = function (e) {
          for (var t = 0, r = this.threeDElements.length; t < r; ) {
            if (
              this.threeDElements[t].startPos <= e &&
              this.threeDElements[t].endPos >= e
            )
              return this.threeDElements[t].perspectiveElem;
            t += 1;
          }
          return null;
        }),
        (HybridRendererBase.prototype.createThreeDContainer = function (e, t) {
          var r = createTag("div"),
            s,
            i;
          styleDiv(r);
          var n = createTag("div");
          if ((styleDiv(n), t === "3d")) {
            (s = r.style),
              (s.width = this.globalData.compSize.w + "px"),
              (s.height = this.globalData.compSize.h + "px");
            var a = "50% 50%";
            (s.webkitTransformOrigin = a),
              (s.mozTransformOrigin = a),
              (s.transformOrigin = a),
              (i = n.style);
            var o = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
            (i.transform = o), (i.webkitTransform = o);
          }
          r.appendChild(n);
          var h = {
            container: n,
            perspectiveElem: r,
            startPos: e,
            endPos: e,
            type: t,
          };
          return this.threeDElements.push(h), h;
        }),
        (HybridRendererBase.prototype.build3dContainers = function () {
          var e,
            t = this.layers.length,
            r,
            s = "";
          for (e = 0; e < t; e += 1)
            this.layers[e].ddd && this.layers[e].ty !== 3
              ? (s !== "3d" &&
                  ((s = "3d"), (r = this.createThreeDContainer(e, "3d"))),
                (r.endPos = Math.max(r.endPos, e)))
              : (s !== "2d" &&
                  ((s = "2d"), (r = this.createThreeDContainer(e, "2d"))),
                (r.endPos = Math.max(r.endPos, e)));
          for (t = this.threeDElements.length, e = t - 1; e >= 0; e -= 1)
            this.resizerElem.appendChild(
              this.threeDElements[e].perspectiveElem
            );
        }),
        (HybridRendererBase.prototype.addTo3dContainer = function (e, t) {
          for (var r = 0, s = this.threeDElements.length; r < s; ) {
            if (t <= this.threeDElements[r].endPos) {
              for (var i = this.threeDElements[r].startPos, n; i < t; )
                this.elements[i] &&
                  this.elements[i].getBaseElement &&
                  (n = this.elements[i].getBaseElement()),
                  (i += 1);
              n
                ? this.threeDElements[r].container.insertBefore(e, n)
                : this.threeDElements[r].container.appendChild(e);
              break;
            }
            r += 1;
          }
        }),
        (HybridRendererBase.prototype.configAnimation = function (e) {
          var t = createTag("div"),
            r = this.animationItem.wrapper,
            s = t.style;
          (s.width = e.w + "px"),
            (s.height = e.h + "px"),
            (this.resizerElem = t),
            styleDiv(t),
            (s.transformStyle = "flat"),
            (s.mozTransformStyle = "flat"),
            (s.webkitTransformStyle = "flat"),
            this.renderConfig.className &&
              t.setAttribute("class", this.renderConfig.className),
            r.appendChild(t),
            (s.overflow = "hidden");
          var i = createNS("svg");
          i.setAttribute("width", "1"),
            i.setAttribute("height", "1"),
            styleDiv(i),
            this.resizerElem.appendChild(i);
          var n = createNS("defs");
          i.appendChild(n),
            (this.data = e),
            this.setupGlobalData(e, i),
            (this.globalData.defs = n),
            (this.layers = e.layers),
            (this.layerElement = this.resizerElem),
            this.build3dContainers(),
            this.updateContainerSize();
        }),
        (HybridRendererBase.prototype.destroy = function () {
          this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = ""),
            (this.animationItem.container = null),
            (this.globalData.defs = null);
          var e,
            t = this.layers ? this.layers.length : 0;
          for (e = 0; e < t; e += 1) this.elements[e].destroy();
          (this.elements.length = 0),
            (this.destroyed = !0),
            (this.animationItem = null);
        }),
        (HybridRendererBase.prototype.updateContainerSize = function () {
          var e = this.animationItem.wrapper.offsetWidth,
            t = this.animationItem.wrapper.offsetHeight,
            r = e / t,
            s = this.globalData.compSize.w / this.globalData.compSize.h,
            i,
            n,
            a,
            o;
          s > r
            ? ((i = e / this.globalData.compSize.w),
              (n = e / this.globalData.compSize.w),
              (a = 0),
              (o =
                (t -
                  this.globalData.compSize.h *
                    (e / this.globalData.compSize.w)) /
                2))
            : ((i = t / this.globalData.compSize.h),
              (n = t / this.globalData.compSize.h),
              (a =
                (e -
                  this.globalData.compSize.w *
                    (t / this.globalData.compSize.h)) /
                2),
              (o = 0));
          var h = this.resizerElem.style;
          (h.webkitTransform =
            "matrix3d(" +
            i +
            ",0,0,0,0," +
            n +
            ",0,0,0,0,1,0," +
            a +
            "," +
            o +
            ",0,1)"),
            (h.transform = h.webkitTransform);
        }),
        (HybridRendererBase.prototype.renderFrame =
          SVGRenderer.prototype.renderFrame),
        (HybridRendererBase.prototype.hide = function () {
          this.resizerElem.style.display = "none";
        }),
        (HybridRendererBase.prototype.show = function () {
          this.resizerElem.style.display = "block";
        }),
        (HybridRendererBase.prototype.initItems = function () {
          if ((this.buildAllItems(), this.camera)) this.camera.setup();
          else {
            var e = this.globalData.compSize.w,
              t = this.globalData.compSize.h,
              r,
              s = this.threeDElements.length;
            for (r = 0; r < s; r += 1) {
              var i = this.threeDElements[r].perspectiveElem.style;
              (i.webkitPerspective =
                Math.sqrt(Math.pow(e, 2) + Math.pow(t, 2)) + "px"),
                (i.perspective = i.webkitPerspective);
            }
          }
        }),
        (HybridRendererBase.prototype.searchExtraCompositions = function (e) {
          var t,
            r = e.length,
            s = createTag("div");
          for (t = 0; t < r; t += 1)
            if (e[t].xt) {
              var i = this.createComp(e[t], s, this.globalData.comp, null);
              i.initExpressions(),
                this.globalData.projectInterface.registerComposition(i);
            }
        });
      function HCompElement(e, t, r) {
        (this.layers = e.layers),
          (this.supports3d = !e.hasMask),
          (this.completeLayers = !1),
          (this.pendingElements = []),
          (this.elements = this.layers
            ? createSizedArray(this.layers.length)
            : []),
          this.initElement(e, t, r),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 });
      }
      extendPrototype(
        [HybridRendererBase, ICompElement, HBaseElement],
        HCompElement
      ),
        (HCompElement.prototype._createBaseContainerElements =
          HCompElement.prototype.createContainerElements),
        (HCompElement.prototype.createContainerElements = function () {
          this._createBaseContainerElements(),
            this.data.hasMask
              ? (this.svgElement.setAttribute("width", this.data.w),
                this.svgElement.setAttribute("height", this.data.h),
                (this.transformedElement = this.baseElement))
              : (this.transformedElement = this.layerElement);
        }),
        (HCompElement.prototype.addTo3dContainer = function (e, t) {
          for (var r = 0, s; r < t; )
            this.elements[r] &&
              this.elements[r].getBaseElement &&
              (s = this.elements[r].getBaseElement()),
              (r += 1);
          s
            ? this.layerElement.insertBefore(e, s)
            : this.layerElement.appendChild(e);
        }),
        (HCompElement.prototype.createComp = function (e) {
          return this.supports3d
            ? new HCompElement(e, this.globalData, this)
            : new SVGCompElement(e, this.globalData, this);
        });
      function HybridRenderer(e, t) {
        (this.animationItem = e),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.renderConfig = {
            className: (t && t.className) || "",
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || "xMidYMid slice",
            hideOnTransparent: !(t && t.hideOnTransparent === !1),
            filterSize: {
              width: (t && t.filterSize && t.filterSize.width) || "400%",
              height: (t && t.filterSize && t.filterSize.height) || "400%",
              x: (t && t.filterSize && t.filterSize.x) || "-100%",
              y: (t && t.filterSize && t.filterSize.y) || "-100%",
            },
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            renderConfig: this.renderConfig,
          }),
          (this.pendingElements = []),
          (this.elements = []),
          (this.threeDElements = []),
          (this.destroyed = !1),
          (this.camera = null),
          (this.supports3d = !0),
          (this.rendererType = "html");
      }
      extendPrototype([HybridRendererBase], HybridRenderer),
        (HybridRenderer.prototype.createComp = function (e) {
          return this.supports3d
            ? new HCompElement(e, this.globalData, this)
            : new SVGCompElement(e, this.globalData, this);
        });
      var Expressions = (function () {
        var e = {};
        e.initExpressions = t;
        function t(r) {
          var s = 0,
            i = [];
          function n() {
            s += 1;
          }
          function a() {
            (s -= 1), s === 0 && h();
          }
          function o(c) {
            i.indexOf(c) === -1 && i.push(c);
          }
          function h() {
            var c,
              m = i.length;
            for (c = 0; c < m; c += 1) i[c].release();
            i.length = 0;
          }
          (r.renderer.compInterface = CompExpressionInterface(r.renderer)),
            r.renderer.globalData.projectInterface.registerComposition(
              r.renderer
            ),
            (r.renderer.globalData.pushExpression = n),
            (r.renderer.globalData.popExpression = a),
            (r.renderer.globalData.registerExpressionProperty = o);
        }
        return e;
      })();
      function _typeof$1(e) {
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof$1 = function (r) {
                return typeof r;
              })
            : (_typeof$1 = function (r) {
                return r &&
                  typeof Symbol == "function" &&
                  r.constructor === Symbol &&
                  r !== Symbol.prototype
                  ? "symbol"
                  : typeof r;
              }),
          _typeof$1(e)
        );
      }
      function seedRandom(e, t) {
        var r = this,
          s = 256,
          i = 6,
          n = 52,
          a = "random",
          o = t.pow(s, i),
          h = t.pow(2, n),
          c = h * 2,
          m = s - 1,
          S;
        function u(p, f, b) {
          var x = [];
          f = f === !0 ? { entropy: !0 } : f || {};
          var $ = E(y(f.entropy ? [p, d(e)] : p === null ? l() : p, 3), x),
            _ = new v(x),
            A = function () {
              for (var F = _.g(i), M = o, D = 0; F < h; )
                (F = (F + D) * s), (M *= s), (D = _.g(1));
              for (; F >= c; ) (F /= 2), (M /= 2), (D >>>= 1);
              return (F + D) / M;
            };
          return (
            (A.int32 = function () {
              return _.g(4) | 0;
            }),
            (A.quick = function () {
              return _.g(4) / 4294967296;
            }),
            (A.double = A),
            E(d(_.S), e),
            (
              f.pass ||
              b ||
              function (L, F, M, D) {
                return (
                  D &&
                    (D.S && g(D, _),
                    (L.state = function () {
                      return g(_, {});
                    })),
                  M ? ((t[a] = L), F) : L
                );
              }
            )(A, $, "global" in f ? f.global : this == t, f.state)
          );
        }
        t["seed" + a] = u;
        function v(p) {
          var f,
            b = p.length,
            x = this,
            $ = 0,
            _ = (x.i = x.j = 0),
            A = (x.S = []);
          for (b || (p = [b++]); $ < s; ) A[$] = $++;
          for ($ = 0; $ < s; $++)
            (A[$] = A[(_ = m & (_ + p[$ % b] + (f = A[$])))]), (A[_] = f);
          x.g = function (L) {
            for (var F, M = 0, D = x.i, V = x.j, T = x.S; L--; )
              (F = T[(D = m & (D + 1))]),
                (M =
                  M * s + T[m & ((T[D] = T[(V = m & (V + F))]) + (T[V] = F))]);
            return (x.i = D), (x.j = V), M;
          };
        }
        function g(p, f) {
          return (f.i = p.i), (f.j = p.j), (f.S = p.S.slice()), f;
        }
        function y(p, f) {
          var b = [],
            x = _typeof$1(p),
            $;
          if (f && x == "object")
            for ($ in p)
              try {
                b.push(y(p[$], f - 1));
              } catch {}
          return b.length ? b : x == "string" ? p : p + "\0";
        }
        function E(p, f) {
          for (var b = p + "", x, $ = 0; $ < b.length; )
            f[m & $] = m & ((x ^= f[m & $] * 19) + b.charCodeAt($++));
          return d(f);
        }
        function l() {
          try {
            var p = new Uint8Array(s);
            return (r.crypto || r.msCrypto).getRandomValues(p), d(p);
          } catch {
            var f = r.navigator,
              b = f && f.plugins;
            return [+new Date(), r, b, r.screen, d(e)];
          }
        }
        function d(p) {
          return String.fromCharCode.apply(0, p);
        }
        E(t.random(), e);
      }
      function initialize$2(e) {
        seedRandom([], e);
      }
      var propTypes = { SHAPE: "shape" };
      function _typeof(e) {
        return (
          typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
            ? (_typeof = function (r) {
                return typeof r;
              })
            : (_typeof = function (r) {
                return r &&
                  typeof Symbol == "function" &&
                  r.constructor === Symbol &&
                  r !== Symbol.prototype
                  ? "symbol"
                  : typeof r;
              }),
          _typeof(e)
        );
      }
      var ExpressionManager = (function () {
          var ob = {},
            Math = BMMath,
            window = null,
            document = null,
            XMLHttpRequest = null,
            fetch = null,
            frames = null;
          initialize$2(BMMath);
          function $bm_isInstanceOfArray(e) {
            return e.constructor === Array || e.constructor === Float32Array;
          }
          function isNumerable(e, t) {
            return (
              e === "number" ||
              e === "boolean" ||
              e === "string" ||
              t instanceof Number
            );
          }
          function $bm_neg(e) {
            var t = _typeof(e);
            if (t === "number" || t === "boolean" || e instanceof Number)
              return -e;
            if ($bm_isInstanceOfArray(e)) {
              var r,
                s = e.length,
                i = [];
              for (r = 0; r < s; r += 1) i[r] = -e[r];
              return i;
            }
            return e.propType ? e.v : -e;
          }
          var easeInBez = BezierFactory.getBezierEasing(
              0.333,
              0,
              0.833,
              0.833,
              "easeIn"
            ).get,
            easeOutBez = BezierFactory.getBezierEasing(
              0.167,
              0.167,
              0.667,
              1,
              "easeOut"
            ).get,
            easeInOutBez = BezierFactory.getBezierEasing(
              0.33,
              0,
              0.667,
              1,
              "easeInOut"
            ).get;
          function sum(e, t) {
            var r = _typeof(e),
              s = _typeof(t);
            if (
              r === "string" ||
              s === "string" ||
              (isNumerable(r, e) && isNumerable(s, t))
            )
              return e + t;
            if ($bm_isInstanceOfArray(e) && isNumerable(s, t))
              return (e = e.slice(0)), (e[0] += t), e;
            if (isNumerable(r, e) && $bm_isInstanceOfArray(t))
              return (t = t.slice(0)), (t[0] = e + t[0]), t;
            if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(t)) {
              for (
                var i = 0, n = e.length, a = t.length, o = [];
                i < n || i < a;

              )
                (typeof e[i] == "number" || e[i] instanceof Number) &&
                (typeof t[i] == "number" || t[i] instanceof Number)
                  ? (o[i] = e[i] + t[i])
                  : (o[i] = t[i] === void 0 ? e[i] : e[i] || t[i]),
                  (i += 1);
              return o;
            }
            return 0;
          }
          var add = sum;
          function sub(e, t) {
            var r = _typeof(e),
              s = _typeof(t);
            if (isNumerable(r, e) && isNumerable(s, t))
              return (
                r === "string" && (e = parseInt(e, 10)),
                s === "string" && (t = parseInt(t, 10)),
                e - t
              );
            if ($bm_isInstanceOfArray(e) && isNumerable(s, t))
              return (e = e.slice(0)), (e[0] -= t), e;
            if (isNumerable(r, e) && $bm_isInstanceOfArray(t))
              return (t = t.slice(0)), (t[0] = e - t[0]), t;
            if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(t)) {
              for (
                var i = 0, n = e.length, a = t.length, o = [];
                i < n || i < a;

              )
                (typeof e[i] == "number" || e[i] instanceof Number) &&
                (typeof t[i] == "number" || t[i] instanceof Number)
                  ? (o[i] = e[i] - t[i])
                  : (o[i] = t[i] === void 0 ? e[i] : e[i] || t[i]),
                  (i += 1);
              return o;
            }
            return 0;
          }
          function mul(e, t) {
            var r = _typeof(e),
              s = _typeof(t),
              i;
            if (isNumerable(r, e) && isNumerable(s, t)) return e * t;
            var n, a;
            if ($bm_isInstanceOfArray(e) && isNumerable(s, t)) {
              for (
                a = e.length, i = createTypedArray("float32", a), n = 0;
                n < a;
                n += 1
              )
                i[n] = e[n] * t;
              return i;
            }
            if (isNumerable(r, e) && $bm_isInstanceOfArray(t)) {
              for (
                a = t.length, i = createTypedArray("float32", a), n = 0;
                n < a;
                n += 1
              )
                i[n] = e * t[n];
              return i;
            }
            return 0;
          }
          function div(e, t) {
            var r = _typeof(e),
              s = _typeof(t),
              i;
            if (isNumerable(r, e) && isNumerable(s, t)) return e / t;
            var n, a;
            if ($bm_isInstanceOfArray(e) && isNumerable(s, t)) {
              for (
                a = e.length, i = createTypedArray("float32", a), n = 0;
                n < a;
                n += 1
              )
                i[n] = e[n] / t;
              return i;
            }
            if (isNumerable(r, e) && $bm_isInstanceOfArray(t)) {
              for (
                a = t.length, i = createTypedArray("float32", a), n = 0;
                n < a;
                n += 1
              )
                i[n] = e / t[n];
              return i;
            }
            return 0;
          }
          function mod(e, t) {
            return (
              typeof e == "string" && (e = parseInt(e, 10)),
              typeof t == "string" && (t = parseInt(t, 10)),
              e % t
            );
          }
          var $bm_sum = sum,
            $bm_sub = sub,
            $bm_mul = mul,
            $bm_div = div,
            $bm_mod = mod;
          function clamp(e, t, r) {
            if (t > r) {
              var s = r;
              (r = t), (t = s);
            }
            return Math.min(Math.max(e, t), r);
          }
          function radiansToDegrees(e) {
            return e / degToRads;
          }
          var radians_to_degrees = radiansToDegrees;
          function degreesToRadians(e) {
            return e * degToRads;
          }
          var degrees_to_radians = radiansToDegrees,
            helperLengthArray = [0, 0, 0, 0, 0, 0];
          function length(e, t) {
            if (typeof e == "number" || e instanceof Number)
              return (t = t || 0), Math.abs(e - t);
            t || (t = helperLengthArray);
            var r,
              s = Math.min(e.length, t.length),
              i = 0;
            for (r = 0; r < s; r += 1) i += Math.pow(t[r] - e[r], 2);
            return Math.sqrt(i);
          }
          function normalize(e) {
            return div(e, length(e));
          }
          function rgbToHsl(e) {
            var t = e[0],
              r = e[1],
              s = e[2],
              i = Math.max(t, r, s),
              n = Math.min(t, r, s),
              a,
              o,
              h = (i + n) / 2;
            if (i === n) (a = 0), (o = 0);
            else {
              var c = i - n;
              switch (((o = h > 0.5 ? c / (2 - i - n) : c / (i + n)), i)) {
                case t:
                  a = (r - s) / c + (r < s ? 6 : 0);
                  break;
                case r:
                  a = (s - t) / c + 2;
                  break;
                case s:
                  a = (t - r) / c + 4;
                  break;
              }
              a /= 6;
            }
            return [a, o, h, e[3]];
          }
          function hue2rgb(e, t, r) {
            return (
              r < 0 && (r += 1),
              r > 1 && (r -= 1),
              r < 1 / 6
                ? e + (t - e) * 6 * r
                : r < 1 / 2
                ? t
                : r < 2 / 3
                ? e + (t - e) * (2 / 3 - r) * 6
                : e
            );
          }
          function hslToRgb(e) {
            var t = e[0],
              r = e[1],
              s = e[2],
              i,
              n,
              a;
            if (r === 0) (i = s), (a = s), (n = s);
            else {
              var o = s < 0.5 ? s * (1 + r) : s + r - s * r,
                h = 2 * s - o;
              (i = hue2rgb(h, o, t + 1 / 3)),
                (n = hue2rgb(h, o, t)),
                (a = hue2rgb(h, o, t - 1 / 3));
            }
            return [i, n, a, e[3]];
          }
          function linear(e, t, r, s, i) {
            if (
              ((s === void 0 || i === void 0) &&
                ((s = t), (i = r), (t = 0), (r = 1)),
              r < t)
            ) {
              var n = r;
              (r = t), (t = n);
            }
            if (e <= t) return s;
            if (e >= r) return i;
            var a = r === t ? 0 : (e - t) / (r - t);
            if (!s.length) return s + (i - s) * a;
            var o,
              h = s.length,
              c = createTypedArray("float32", h);
            for (o = 0; o < h; o += 1) c[o] = s[o] + (i[o] - s[o]) * a;
            return c;
          }
          function random(e, t) {
            if (
              (t === void 0 &&
                (e === void 0 ? ((e = 0), (t = 1)) : ((t = e), (e = void 0))),
              t.length)
            ) {
              var r,
                s = t.length;
              e || (e = createTypedArray("float32", s));
              var i = createTypedArray("float32", s),
                n = BMMath.random();
              for (r = 0; r < s; r += 1) i[r] = e[r] + n * (t[r] - e[r]);
              return i;
            }
            e === void 0 && (e = 0);
            var a = BMMath.random();
            return e + a * (t - e);
          }
          function createPath(e, t, r, s) {
            var i,
              n = e.length,
              a = shapePool.newElement();
            a.setPathData(!!s, n);
            var o = [0, 0],
              h,
              c;
            for (i = 0; i < n; i += 1)
              (h = t && t[i] ? t[i] : o),
                (c = r && r[i] ? r[i] : o),
                a.setTripleAt(
                  e[i][0],
                  e[i][1],
                  c[0] + e[i][0],
                  c[1] + e[i][1],
                  h[0] + e[i][0],
                  h[1] + e[i][1],
                  i,
                  !0
                );
            return a;
          }
          function initiateExpression(elem, data, property) {
            var val = data.x,
              needsVelocity = /velocity(?![\w\d])/.test(val),
              _needsRandom = val.indexOf("random") !== -1,
              elemType = elem.data.ty,
              transform,
              $bm_transform,
              content,
              effect,
              thisProperty = property;
            (thisProperty.valueAtTime = thisProperty.getValueAtTime),
              Object.defineProperty(thisProperty, "value", {
                get: function () {
                  return thisProperty.v;
                },
              }),
              (elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate),
              (elem.comp.displayStartTime = 0);
            var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
              outPoint = elem.data.op / elem.comp.globalData.frameRate,
              width = elem.data.sw ? elem.data.sw : 0,
              height = elem.data.sh ? elem.data.sh : 0,
              name = elem.data.nm,
              loopIn,
              loop_in,
              loopOut,
              loop_out,
              smooth,
              toWorld,
              fromWorld,
              fromComp,
              toComp,
              fromCompToSurface,
              position,
              rotation,
              anchorPoint,
              scale,
              thisLayer,
              thisComp,
              mask,
              valueAtTime,
              velocityAtTime,
              scoped_bm_rt,
              expression_function = eval(
                "[function _expression_function(){" +
                  val +
                  ";scoped_bm_rt=$bm_rt}]"
              )[0],
              numKeys = property.kf ? data.k.length : 0,
              active = !this.data || this.data.hd !== !0,
              wiggle = function e(t, r) {
                var s,
                  i,
                  n = this.pv.length ? this.pv.length : 1,
                  a = createTypedArray("float32", n);
                t = 5;
                var o = Math.floor(time * t);
                for (s = 0, i = 0; s < o; ) {
                  for (i = 0; i < n; i += 1)
                    a[i] += -r + r * 2 * BMMath.random();
                  s += 1;
                }
                var h = time * t,
                  c = h - Math.floor(h),
                  m = createTypedArray("float32", n);
                if (n > 1) {
                  for (i = 0; i < n; i += 1)
                    m[i] =
                      this.pv[i] + a[i] + (-r + r * 2 * BMMath.random()) * c;
                  return m;
                }
                return this.pv + a[0] + (-r + r * 2 * BMMath.random()) * c;
              }.bind(this);
            thisProperty.loopIn &&
              ((loopIn = thisProperty.loopIn.bind(thisProperty)),
              (loop_in = loopIn)),
              thisProperty.loopOut &&
                ((loopOut = thisProperty.loopOut.bind(thisProperty)),
                (loop_out = loopOut)),
              thisProperty.smooth &&
                (smooth = thisProperty.smooth.bind(thisProperty));
            function loopInDuration(e, t) {
              return loopIn(e, t, !0);
            }
            function loopOutDuration(e, t) {
              return loopOut(e, t, !0);
            }
            this.getValueAtTime &&
              (valueAtTime = this.getValueAtTime.bind(this)),
              this.getVelocityAtTime &&
                (velocityAtTime = this.getVelocityAtTime.bind(this));
            var comp = elem.comp.globalData.projectInterface.bind(
              elem.comp.globalData.projectInterface
            );
            function lookAt(e, t) {
              var r = [t[0] - e[0], t[1] - e[1], t[2] - e[2]],
                s =
                  Math.atan2(r[0], Math.sqrt(r[1] * r[1] + r[2] * r[2])) /
                  degToRads,
                i = -Math.atan2(r[1], r[2]) / degToRads;
              return [i, s, 0];
            }
            function easeOut(e, t, r, s, i) {
              return applyEase(easeOutBez, e, t, r, s, i);
            }
            function easeIn(e, t, r, s, i) {
              return applyEase(easeInBez, e, t, r, s, i);
            }
            function ease(e, t, r, s, i) {
              return applyEase(easeInOutBez, e, t, r, s, i);
            }
            function applyEase(e, t, r, s, i, n) {
              i === void 0 ? ((i = r), (n = s)) : (t = (t - r) / (s - r)),
                t > 1 ? (t = 1) : t < 0 && (t = 0);
              var a = e(t);
              if ($bm_isInstanceOfArray(i)) {
                var o,
                  h = i.length,
                  c = createTypedArray("float32", h);
                for (o = 0; o < h; o += 1) c[o] = (n[o] - i[o]) * a + i[o];
                return c;
              }
              return (n - i) * a + i;
            }
            function nearestKey(e) {
              var t,
                r = data.k.length,
                s,
                i;
              if (!data.k.length || typeof data.k[0] == "number")
                (s = 0), (i = 0);
              else if (
                ((s = -1),
                (e *= elem.comp.globalData.frameRate),
                e < data.k[0].t)
              )
                (s = 1), (i = data.k[0].t);
              else {
                for (t = 0; t < r - 1; t += 1)
                  if (e === data.k[t].t) {
                    (s = t + 1), (i = data.k[t].t);
                    break;
                  } else if (e > data.k[t].t && e < data.k[t + 1].t) {
                    e - data.k[t].t > data.k[t + 1].t - e
                      ? ((s = t + 2), (i = data.k[t + 1].t))
                      : ((s = t + 1), (i = data.k[t].t));
                    break;
                  }
                s === -1 && ((s = t + 1), (i = data.k[t].t));
              }
              var n = {};
              return (
                (n.index = s), (n.time = i / elem.comp.globalData.frameRate), n
              );
            }
            function key(e) {
              var t, r, s;
              if (!data.k.length || typeof data.k[0] == "number")
                throw new Error("The property has no keyframe at index " + e);
              (e -= 1),
                (t = {
                  time: data.k[e].t / elem.comp.globalData.frameRate,
                  value: [],
                });
              var i = Object.prototype.hasOwnProperty.call(data.k[e], "s")
                ? data.k[e].s
                : data.k[e - 1].e;
              for (s = i.length, r = 0; r < s; r += 1)
                (t[r] = i[r]), (t.value[r] = i[r]);
              return t;
            }
            function framesToTime(e, t) {
              return t || (t = elem.comp.globalData.frameRate), e / t;
            }
            function timeToFrames(e, t) {
              return (
                !e && e !== 0 && (e = time),
                t || (t = elem.comp.globalData.frameRate),
                e * t
              );
            }
            function seedRandom(e) {
              BMMath.seedrandom(randSeed + e);
            }
            function sourceRectAtTime() {
              return elem.sourceRectAtTime();
            }
            function substring(e, t) {
              return typeof value == "string"
                ? t === void 0
                  ? value.substring(e)
                  : value.substring(e, t)
                : "";
            }
            function substr(e, t) {
              return typeof value == "string"
                ? t === void 0
                  ? value.substr(e)
                  : value.substr(e, t)
                : "";
            }
            function posterizeTime(e) {
              (time = e === 0 ? 0 : Math.floor(time * e) / e),
                (value = valueAtTime(time));
            }
            var time,
              velocity,
              value,
              text,
              textIndex,
              textTotal,
              selectorValue,
              index = elem.data.ind,
              hasParent = !!(elem.hierarchy && elem.hierarchy.length),
              parent,
              randSeed = Math.floor(Math.random() * 1e6),
              globalData = elem.globalData;
            function executeExpression(e) {
              return (
                (value = e),
                this.frameExpressionId === elem.globalData.frameId &&
                this.propType !== "textSelector"
                  ? value
                  : (this.propType === "textSelector" &&
                      ((textIndex = this.textIndex),
                      (textTotal = this.textTotal),
                      (selectorValue = this.selectorValue)),
                    thisLayer ||
                      ((text = elem.layerInterface.text),
                      (thisLayer = elem.layerInterface),
                      (thisComp = elem.comp.compInterface),
                      (toWorld = thisLayer.toWorld.bind(thisLayer)),
                      (fromWorld = thisLayer.fromWorld.bind(thisLayer)),
                      (fromComp = thisLayer.fromComp.bind(thisLayer)),
                      (toComp = thisLayer.toComp.bind(thisLayer)),
                      (mask = thisLayer.mask
                        ? thisLayer.mask.bind(thisLayer)
                        : null),
                      (fromCompToSurface = fromComp)),
                    transform ||
                      ((transform = elem.layerInterface(
                        "ADBE Transform Group"
                      )),
                      ($bm_transform = transform),
                      transform && (anchorPoint = transform.anchorPoint)),
                    elemType === 4 &&
                      !content &&
                      (content = thisLayer("ADBE Root Vectors Group")),
                    effect || (effect = thisLayer(4)),
                    (hasParent = !!(elem.hierarchy && elem.hierarchy.length)),
                    hasParent &&
                      !parent &&
                      (parent = elem.hierarchy[0].layerInterface),
                    (time =
                      this.comp.renderedFrame / this.comp.globalData.frameRate),
                    _needsRandom && seedRandom(randSeed + time),
                    needsVelocity && (velocity = velocityAtTime(time)),
                    expression_function(),
                    (this.frameExpressionId = elem.globalData.frameId),
                    (scoped_bm_rt =
                      scoped_bm_rt.propType === propTypes.SHAPE
                        ? scoped_bm_rt.v
                        : scoped_bm_rt),
                    scoped_bm_rt)
              );
            }
            return (
              (executeExpression.__preventDeadCodeRemoval = [
                $bm_transform,
                anchorPoint,
                time,
                velocity,
                inPoint,
                outPoint,
                width,
                height,
                name,
                loop_in,
                loop_out,
                smooth,
                toComp,
                fromCompToSurface,
                toWorld,
                fromWorld,
                mask,
                position,
                rotation,
                scale,
                thisComp,
                numKeys,
                active,
                wiggle,
                loopInDuration,
                loopOutDuration,
                comp,
                lookAt,
                easeOut,
                easeIn,
                ease,
                nearestKey,
                key,
                text,
                textIndex,
                textTotal,
                selectorValue,
                framesToTime,
                timeToFrames,
                sourceRectAtTime,
                substring,
                substr,
                posterizeTime,
                index,
                globalData,
              ]),
              executeExpression
            );
          }
          return (
            (ob.initiateExpression = initiateExpression),
            (ob.__preventDeadCodeRemoval = [
              window,
              document,
              XMLHttpRequest,
              fetch,
              frames,
              $bm_neg,
              add,
              $bm_sum,
              $bm_sub,
              $bm_mul,
              $bm_div,
              $bm_mod,
              clamp,
              radians_to_degrees,
              degreesToRadians,
              degrees_to_radians,
              normalize,
              rgbToHsl,
              hslToRgb,
              linear,
              random,
              createPath,
            ]),
            ob
          );
        })(),
        expressionHelpers = (function () {
          function e(a, o, h) {
            o.x &&
              ((h.k = !0),
              (h.x = !0),
              (h.initiateExpression = ExpressionManager.initiateExpression),
              h.effectsSequence.push(h.initiateExpression(a, o, h).bind(h)));
          }
          function t(a) {
            return (
              (a *= this.elem.globalData.frameRate),
              (a -= this.offsetTime),
              a !== this._cachingAtTime.lastFrame &&
                ((this._cachingAtTime.lastIndex =
                  this._cachingAtTime.lastFrame < a
                    ? this._cachingAtTime.lastIndex
                    : 0),
                (this._cachingAtTime.value = this.interpolateValue(
                  a,
                  this._cachingAtTime
                )),
                (this._cachingAtTime.lastFrame = a)),
              this._cachingAtTime.value
            );
          }
          function r(a) {
            var o = -0.01,
              h = this.getValueAtTime(a),
              c = this.getValueAtTime(a + o),
              m = 0;
            if (h.length) {
              var S;
              for (S = 0; S < h.length; S += 1) m += Math.pow(c[S] - h[S], 2);
              m = Math.sqrt(m) * 100;
            } else m = 0;
            return m;
          }
          function s(a) {
            if (this.vel !== void 0) return this.vel;
            var o = -0.001,
              h = this.getValueAtTime(a),
              c = this.getValueAtTime(a + o),
              m;
            if (h.length) {
              m = createTypedArray("float32", h.length);
              var S;
              for (S = 0; S < h.length; S += 1) m[S] = (c[S] - h[S]) / o;
            } else m = (c - h) / o;
            return m;
          }
          function i() {
            return this.pv;
          }
          function n(a) {
            this.propertyGroup = a;
          }
          return {
            searchExpressions: e,
            getSpeedAtTime: r,
            getVelocityAtTime: s,
            getValueAtTime: t,
            getStaticValueAtTime: i,
            setGroupProperty: n,
          };
        })();
      function addPropertyDecorator() {
        function e(u, v, g) {
          if (!this.k || !this.keyframes) return this.pv;
          u = u ? u.toLowerCase() : "";
          var y = this.comp.renderedFrame,
            E = this.keyframes,
            l = E[E.length - 1].t;
          if (y <= l) return this.pv;
          var d, p;
          g
            ? (v
                ? (d = Math.abs(l - this.elem.comp.globalData.frameRate * v))
                : (d = Math.max(0, l - this.elem.data.ip)),
              (p = l - d))
            : ((!v || v > E.length - 1) && (v = E.length - 1),
              (p = E[E.length - 1 - v].t),
              (d = l - p));
          var f, b, x;
          if (u === "pingpong") {
            var $ = Math.floor((y - p) / d);
            if ($ % 2 !== 0)
              return this.getValueAtTime(
                (d - ((y - p) % d) + p) / this.comp.globalData.frameRate,
                0
              );
          } else if (u === "offset") {
            var _ = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
              A = this.getValueAtTime(l / this.comp.globalData.frameRate, 0),
              L = this.getValueAtTime(
                (((y - p) % d) + p) / this.comp.globalData.frameRate,
                0
              ),
              F = Math.floor((y - p) / d);
            if (this.pv.length) {
              for (x = new Array(_.length), b = x.length, f = 0; f < b; f += 1)
                x[f] = (A[f] - _[f]) * F + L[f];
              return x;
            }
            return (A - _) * F + L;
          } else if (u === "continue") {
            var M = this.getValueAtTime(l / this.comp.globalData.frameRate, 0),
              D = this.getValueAtTime(
                (l - 0.001) / this.comp.globalData.frameRate,
                0
              );
            if (this.pv.length) {
              for (x = new Array(M.length), b = x.length, f = 0; f < b; f += 1)
                x[f] =
                  M[f] +
                  ((M[f] - D[f]) * ((y - l) / this.comp.globalData.frameRate)) /
                    5e-4;
              return x;
            }
            return M + (M - D) * ((y - l) / 0.001);
          }
          return this.getValueAtTime(
            (((y - p) % d) + p) / this.comp.globalData.frameRate,
            0
          );
        }
        function t(u, v, g) {
          if (!this.k) return this.pv;
          u = u ? u.toLowerCase() : "";
          var y = this.comp.renderedFrame,
            E = this.keyframes,
            l = E[0].t;
          if (y >= l) return this.pv;
          var d, p;
          g
            ? (v
                ? (d = Math.abs(this.elem.comp.globalData.frameRate * v))
                : (d = Math.max(0, this.elem.data.op - l)),
              (p = l + d))
            : ((!v || v > E.length - 1) && (v = E.length - 1),
              (p = E[v].t),
              (d = p - l));
          var f, b, x;
          if (u === "pingpong") {
            var $ = Math.floor((l - y) / d);
            if ($ % 2 === 0)
              return this.getValueAtTime(
                (((l - y) % d) + l) / this.comp.globalData.frameRate,
                0
              );
          } else if (u === "offset") {
            var _ = this.getValueAtTime(l / this.comp.globalData.frameRate, 0),
              A = this.getValueAtTime(p / this.comp.globalData.frameRate, 0),
              L = this.getValueAtTime(
                (d - ((l - y) % d) + l) / this.comp.globalData.frameRate,
                0
              ),
              F = Math.floor((l - y) / d) + 1;
            if (this.pv.length) {
              for (x = new Array(_.length), b = x.length, f = 0; f < b; f += 1)
                x[f] = L[f] - (A[f] - _[f]) * F;
              return x;
            }
            return L - (A - _) * F;
          } else if (u === "continue") {
            var M = this.getValueAtTime(l / this.comp.globalData.frameRate, 0),
              D = this.getValueAtTime(
                (l + 0.001) / this.comp.globalData.frameRate,
                0
              );
            if (this.pv.length) {
              for (x = new Array(M.length), b = x.length, f = 0; f < b; f += 1)
                x[f] = M[f] + ((M[f] - D[f]) * (l - y)) / 0.001;
              return x;
            }
            return M + ((M - D) * (l - y)) / 0.001;
          }
          return this.getValueAtTime(
            (d - (((l - y) % d) + l)) / this.comp.globalData.frameRate,
            0
          );
        }
        function r(u, v) {
          if (!this.k) return this.pv;
          if (((u = (u || 0.4) * 0.5), (v = Math.floor(v || 5)), v <= 1))
            return this.pv;
          var g = this.comp.renderedFrame / this.comp.globalData.frameRate,
            y = g - u,
            E = g + u,
            l = v > 1 ? (E - y) / (v - 1) : 1,
            d = 0,
            p = 0,
            f;
          this.pv.length
            ? (f = createTypedArray("float32", this.pv.length))
            : (f = 0);
          for (var b; d < v; ) {
            if (((b = this.getValueAtTime(y + d * l)), this.pv.length))
              for (p = 0; p < this.pv.length; p += 1) f[p] += b[p];
            else f += b;
            d += 1;
          }
          if (this.pv.length) for (p = 0; p < this.pv.length; p += 1) f[p] /= v;
          else f /= v;
          return f;
        }
        function s(u) {
          this._transformCachingAtTime ||
            (this._transformCachingAtTime = { v: new Matrix() });
          var v = this._transformCachingAtTime.v;
          if (
            (v.cloneFromProps(this.pre.props), this.appliedTransformations < 1)
          ) {
            var g = this.a.getValueAtTime(u);
            v.translate(
              -g[0] * this.a.mult,
              -g[1] * this.a.mult,
              g[2] * this.a.mult
            );
          }
          if (this.appliedTransformations < 2) {
            var y = this.s.getValueAtTime(u);
            v.scale(y[0] * this.s.mult, y[1] * this.s.mult, y[2] * this.s.mult);
          }
          if (this.sk && this.appliedTransformations < 3) {
            var E = this.sk.getValueAtTime(u),
              l = this.sa.getValueAtTime(u);
            v.skewFromAxis(-E * this.sk.mult, l * this.sa.mult);
          }
          if (this.r && this.appliedTransformations < 4) {
            var d = this.r.getValueAtTime(u);
            v.rotate(-d * this.r.mult);
          } else if (!this.r && this.appliedTransformations < 4) {
            var p = this.rz.getValueAtTime(u),
              f = this.ry.getValueAtTime(u),
              b = this.rx.getValueAtTime(u),
              x = this.or.getValueAtTime(u);
            v.rotateZ(-p * this.rz.mult)
              .rotateY(f * this.ry.mult)
              .rotateX(b * this.rx.mult)
              .rotateZ(-x[2] * this.or.mult)
              .rotateY(x[1] * this.or.mult)
              .rotateX(x[0] * this.or.mult);
          }
          if (this.data.p && this.data.p.s) {
            var $ = this.px.getValueAtTime(u),
              _ = this.py.getValueAtTime(u);
            if (this.data.p.z) {
              var A = this.pz.getValueAtTime(u);
              v.translate(
                $ * this.px.mult,
                _ * this.py.mult,
                -A * this.pz.mult
              );
            } else v.translate($ * this.px.mult, _ * this.py.mult, 0);
          } else {
            var L = this.p.getValueAtTime(u);
            v.translate(
              L[0] * this.p.mult,
              L[1] * this.p.mult,
              -L[2] * this.p.mult
            );
          }
          return v;
        }
        function i() {
          return this.v.clone(new Matrix());
        }
        var n = TransformPropertyFactory.getTransformProperty;
        TransformPropertyFactory.getTransformProperty = function (u, v, g) {
          var y = n(u, v, g);
          return (
            y.dynamicProperties.length
              ? (y.getValueAtTime = s.bind(y))
              : (y.getValueAtTime = i.bind(y)),
            (y.setGroupProperty = expressionHelpers.setGroupProperty),
            y
          );
        };
        var a = PropertyFactory.getProp;
        PropertyFactory.getProp = function (u, v, g, y, E) {
          var l = a(u, v, g, y, E);
          l.kf
            ? (l.getValueAtTime = expressionHelpers.getValueAtTime.bind(l))
            : (l.getValueAtTime =
                expressionHelpers.getStaticValueAtTime.bind(l)),
            (l.setGroupProperty = expressionHelpers.setGroupProperty),
            (l.loopOut = e),
            (l.loopIn = t),
            (l.smooth = r),
            (l.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(l)),
            (l.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(l)),
            (l.numKeys = v.a === 1 ? v.k.length : 0),
            (l.propertyIndex = v.ix);
          var d = 0;
          return (
            g !== 0 &&
              (d = createTypedArray(
                "float32",
                v.a === 1 ? v.k[0].s.length : v.k.length
              )),
            (l._cachingAtTime = {
              lastFrame: initialDefaultFrame,
              lastIndex: 0,
              value: d,
            }),
            expressionHelpers.searchExpressions(u, v, l),
            l.k && E.addDynamicProperty(l),
            l
          );
        };
        function o(u) {
          return (
            this._cachingAtTime ||
              (this._cachingAtTime = {
                shapeValue: shapePool.clone(this.pv),
                lastIndex: 0,
                lastTime: initialDefaultFrame,
              }),
            (u *= this.elem.globalData.frameRate),
            (u -= this.offsetTime),
            u !== this._cachingAtTime.lastTime &&
              ((this._cachingAtTime.lastIndex =
                this._cachingAtTime.lastTime < u ? this._caching.lastIndex : 0),
              (this._cachingAtTime.lastTime = u),
              this.interpolateShape(
                u,
                this._cachingAtTime.shapeValue,
                this._cachingAtTime
              )),
            this._cachingAtTime.shapeValue
          );
        }
        var h = ShapePropertyFactory.getConstructorFunction(),
          c = ShapePropertyFactory.getKeyframedConstructorFunction();
        function m() {}
        (m.prototype = {
          vertices: function (v, g) {
            this.k && this.getValue();
            var y = this.v;
            g !== void 0 && (y = this.getValueAtTime(g, 0));
            var E,
              l = y._length,
              d = y[v],
              p = y.v,
              f = createSizedArray(l);
            for (E = 0; E < l; E += 1)
              v === "i" || v === "o"
                ? (f[E] = [d[E][0] - p[E][0], d[E][1] - p[E][1]])
                : (f[E] = [d[E][0], d[E][1]]);
            return f;
          },
          points: function (v) {
            return this.vertices("v", v);
          },
          inTangents: function (v) {
            return this.vertices("i", v);
          },
          outTangents: function (v) {
            return this.vertices("o", v);
          },
          isClosed: function () {
            return this.v.c;
          },
          pointOnPath: function (v, g) {
            var y = this.v;
            g !== void 0 && (y = this.getValueAtTime(g, 0)),
              this._segmentsLength ||
                (this._segmentsLength = bez.getSegmentsLength(y));
            for (
              var E = this._segmentsLength,
                l = E.lengths,
                d = E.totalLength * v,
                p = 0,
                f = l.length,
                b = 0,
                x;
              p < f;

            ) {
              if (b + l[p].addedLength > d) {
                var $ = p,
                  _ = y.c && p === f - 1 ? 0 : p + 1,
                  A = (d - b) / l[p].addedLength;
                x = bez.getPointInSegment(
                  y.v[$],
                  y.v[_],
                  y.o[$],
                  y.i[_],
                  A,
                  l[p]
                );
                break;
              } else b += l[p].addedLength;
              p += 1;
            }
            return (
              x ||
                (x = y.c
                  ? [y.v[0][0], y.v[0][1]]
                  : [y.v[y._length - 1][0], y.v[y._length - 1][1]]),
              x
            );
          },
          vectorOnPath: function (v, g, y) {
            v == 1 ? (v = this.v.c) : v == 0 && (v = 0.999);
            var E = this.pointOnPath(v, g),
              l = this.pointOnPath(v + 0.001, g),
              d = l[0] - E[0],
              p = l[1] - E[1],
              f = Math.sqrt(Math.pow(d, 2) + Math.pow(p, 2));
            if (f === 0) return [0, 0];
            var b = y === "tangent" ? [d / f, p / f] : [-p / f, d / f];
            return b;
          },
          tangentOnPath: function (v, g) {
            return this.vectorOnPath(v, g, "tangent");
          },
          normalOnPath: function (v, g) {
            return this.vectorOnPath(v, g, "normal");
          },
          setGroupProperty: expressionHelpers.setGroupProperty,
          getValueAtTime: expressionHelpers.getStaticValueAtTime,
        }),
          extendPrototype([m], h),
          extendPrototype([m], c),
          (c.prototype.getValueAtTime = o),
          (c.prototype.initiateExpression =
            ExpressionManager.initiateExpression);
        var S = ShapePropertyFactory.getShapeProp;
        ShapePropertyFactory.getShapeProp = function (u, v, g, y, E) {
          var l = S(u, v, g, y, E);
          return (
            (l.propertyIndex = v.ix),
            (l.lock = !1),
            g === 3
              ? expressionHelpers.searchExpressions(u, v.pt, l)
              : g === 4 && expressionHelpers.searchExpressions(u, v.ks, l),
            l.k && u.addDynamicProperty(l),
            l
          );
        };
      }
      function initialize$1() {
        addPropertyDecorator();
      }
      function addDecorator() {
        function e() {
          return this.data.d.x
            ? ((this.calculateExpression =
                ExpressionManager.initiateExpression.bind(this)(
                  this.elem,
                  this.data.d,
                  this
                )),
              this.addEffect(this.getExpressionValue.bind(this)),
              !0)
            : null;
        }
        (TextProperty.prototype.getExpressionValue = function (t, r) {
          var s = this.calculateExpression(r);
          if (t.t !== s) {
            var i = {};
            return (
              this.copyData(i, t), (i.t = s.toString()), (i.__complete = !1), i
            );
          }
          return t;
        }),
          (TextProperty.prototype.searchProperty = function () {
            var t = this.searchKeyframes(),
              r = this.searchExpressions();
            return (this.kf = t || r), this.kf;
          }),
          (TextProperty.prototype.searchExpressions = e);
      }
      function initialize() {
        addDecorator();
      }
      function SVGComposableEffect() {}
      SVGComposableEffect.prototype = {
        createMergeNode: function e(t, r) {
          var s = createNS("feMerge");
          s.setAttribute("result", t);
          var i, n;
          for (n = 0; n < r.length; n += 1)
            (i = createNS("feMergeNode")),
              i.setAttribute("in", r[n]),
              s.appendChild(i),
              s.appendChild(i);
          return s;
        },
      };
      function SVGTintFilter(e, t, r, s, i) {
        this.filterManager = t;
        var n = createNS("feColorMatrix");
        n.setAttribute("type", "matrix"),
          n.setAttribute("color-interpolation-filters", "linearRGB"),
          n.setAttribute(
            "values",
            "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
          ),
          n.setAttribute("result", s + "_tint_1"),
          e.appendChild(n),
          (n = createNS("feColorMatrix")),
          n.setAttribute("type", "matrix"),
          n.setAttribute("color-interpolation-filters", "sRGB"),
          n.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"),
          n.setAttribute("result", s + "_tint_2"),
          e.appendChild(n),
          (this.matrixFilter = n);
        var a = this.createMergeNode(s, [i, s + "_tint_1", s + "_tint_2"]);
        e.appendChild(a);
      }
      extendPrototype([SVGComposableEffect], SVGTintFilter),
        (SVGTintFilter.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            var t = this.filterManager.effectElements[0].p.v,
              r = this.filterManager.effectElements[1].p.v,
              s = this.filterManager.effectElements[2].p.v / 100;
            this.matrixFilter.setAttribute(
              "values",
              r[0] -
                t[0] +
                " 0 0 0 " +
                t[0] +
                " " +
                (r[1] - t[1]) +
                " 0 0 0 " +
                t[1] +
                " " +
                (r[2] - t[2]) +
                " 0 0 0 " +
                t[2] +
                " 0 0 0 " +
                s +
                " 0"
            );
          }
        });
      function SVGFillFilter(e, t, r, s) {
        this.filterManager = t;
        var i = createNS("feColorMatrix");
        i.setAttribute("type", "matrix"),
          i.setAttribute("color-interpolation-filters", "sRGB"),
          i.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"),
          i.setAttribute("result", s),
          e.appendChild(i),
          (this.matrixFilter = i);
      }
      SVGFillFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
          var t = this.filterManager.effectElements[2].p.v,
            r = this.filterManager.effectElements[6].p.v;
          this.matrixFilter.setAttribute(
            "values",
            "0 0 0 0 " +
              t[0] +
              " 0 0 0 0 " +
              t[1] +
              " 0 0 0 0 " +
              t[2] +
              " 0 0 0 " +
              r +
              " 0"
          );
        }
      };
      function SVGStrokeEffect(e, t, r) {
        (this.initialized = !1),
          (this.filterManager = t),
          (this.elem = r),
          (this.paths = []);
      }
      (SVGStrokeEffect.prototype.initialize = function () {
        var e =
            this.elem.layerElement.children ||
            this.elem.layerElement.childNodes,
          t,
          r,
          s,
          i;
        for (
          this.filterManager.effectElements[1].p.v === 1
            ? ((i = this.elem.maskManager.masksProperties.length), (s = 0))
            : ((s = this.filterManager.effectElements[0].p.v - 1), (i = s + 1)),
            r = createNS("g"),
            r.setAttribute("fill", "none"),
            r.setAttribute("stroke-linecap", "round"),
            r.setAttribute("stroke-dashoffset", 1),
            s;
          s < i;
          s += 1
        )
          (t = createNS("path")),
            r.appendChild(t),
            this.paths.push({ p: t, m: s });
        if (this.filterManager.effectElements[10].p.v === 3) {
          var n = createNS("mask"),
            a = createElementID();
          n.setAttribute("id", a),
            n.setAttribute("mask-type", "alpha"),
            n.appendChild(r),
            this.elem.globalData.defs.appendChild(n);
          var o = createNS("g");
          for (
            o.setAttribute("mask", "url(" + getLocationHref() + "#" + a + ")");
            e[0];

          )
            o.appendChild(e[0]);
          this.elem.layerElement.appendChild(o),
            (this.masker = n),
            r.setAttribute("stroke", "#fff");
        } else if (
          this.filterManager.effectElements[10].p.v === 1 ||
          this.filterManager.effectElements[10].p.v === 2
        ) {
          if (this.filterManager.effectElements[10].p.v === 2)
            for (
              e =
                this.elem.layerElement.children ||
                this.elem.layerElement.childNodes;
              e.length;

            )
              this.elem.layerElement.removeChild(e[0]);
          this.elem.layerElement.appendChild(r),
            this.elem.layerElement.removeAttribute("mask"),
            r.setAttribute("stroke", "#fff");
        }
        (this.initialized = !0), (this.pathMasker = r);
      }),
        (SVGStrokeEffect.prototype.renderFrame = function (e) {
          this.initialized || this.initialize();
          var t,
            r = this.paths.length,
            s,
            i;
          for (t = 0; t < r; t += 1)
            if (
              this.paths[t].m !== -1 &&
              ((s = this.elem.maskManager.viewData[this.paths[t].m]),
              (i = this.paths[t].p),
              (e || this.filterManager._mdf || s.prop._mdf) &&
                i.setAttribute("d", s.lastPath),
              e ||
                this.filterManager.effectElements[9].p._mdf ||
                this.filterManager.effectElements[4].p._mdf ||
                this.filterManager.effectElements[7].p._mdf ||
                this.filterManager.effectElements[8].p._mdf ||
                s.prop._mdf)
            ) {
              var n;
              if (
                this.filterManager.effectElements[7].p.v !== 0 ||
                this.filterManager.effectElements[8].p.v !== 100
              ) {
                var a =
                    Math.min(
                      this.filterManager.effectElements[7].p.v,
                      this.filterManager.effectElements[8].p.v
                    ) * 0.01,
                  o =
                    Math.max(
                      this.filterManager.effectElements[7].p.v,
                      this.filterManager.effectElements[8].p.v
                    ) * 0.01,
                  h = i.getTotalLength();
                n = "0 0 0 " + h * a + " ";
                var c = h * (o - a),
                  m =
                    1 +
                    this.filterManager.effectElements[4].p.v *
                      2 *
                      this.filterManager.effectElements[9].p.v *
                      0.01,
                  S = Math.floor(c / m),
                  u;
                for (u = 0; u < S; u += 1)
                  n +=
                    "1 " +
                    this.filterManager.effectElements[4].p.v *
                      2 *
                      this.filterManager.effectElements[9].p.v *
                      0.01 +
                    " ";
                n += "0 " + h * 10 + " 0 0";
              } else
                n =
                  "1 " +
                  this.filterManager.effectElements[4].p.v *
                    2 *
                    this.filterManager.effectElements[9].p.v *
                    0.01;
              i.setAttribute("stroke-dasharray", n);
            }
          if (
            ((e || this.filterManager.effectElements[4].p._mdf) &&
              this.pathMasker.setAttribute(
                "stroke-width",
                this.filterManager.effectElements[4].p.v * 2
              ),
            (e || this.filterManager.effectElements[6].p._mdf) &&
              this.pathMasker.setAttribute(
                "opacity",
                this.filterManager.effectElements[6].p.v
              ),
            (this.filterManager.effectElements[10].p.v === 1 ||
              this.filterManager.effectElements[10].p.v === 2) &&
              (e || this.filterManager.effectElements[3].p._mdf))
          ) {
            var v = this.filterManager.effectElements[3].p.v;
            this.pathMasker.setAttribute(
              "stroke",
              "rgb(" +
                bmFloor(v[0] * 255) +
                "," +
                bmFloor(v[1] * 255) +
                "," +
                bmFloor(v[2] * 255) +
                ")"
            );
          }
        });
      function SVGTritoneFilter(e, t, r, s) {
        this.filterManager = t;
        var i = createNS("feColorMatrix");
        i.setAttribute("type", "matrix"),
          i.setAttribute("color-interpolation-filters", "linearRGB"),
          i.setAttribute(
            "values",
            "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
          ),
          e.appendChild(i);
        var n = createNS("feComponentTransfer");
        n.setAttribute("color-interpolation-filters", "sRGB"),
          n.setAttribute("result", s),
          (this.matrixFilter = n);
        var a = createNS("feFuncR");
        a.setAttribute("type", "table"), n.appendChild(a), (this.feFuncR = a);
        var o = createNS("feFuncG");
        o.setAttribute("type", "table"), n.appendChild(o), (this.feFuncG = o);
        var h = createNS("feFuncB");
        h.setAttribute("type", "table"),
          n.appendChild(h),
          (this.feFuncB = h),
          e.appendChild(n);
      }
      SVGTritoneFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
          var t = this.filterManager.effectElements[0].p.v,
            r = this.filterManager.effectElements[1].p.v,
            s = this.filterManager.effectElements[2].p.v,
            i = s[0] + " " + r[0] + " " + t[0],
            n = s[1] + " " + r[1] + " " + t[1],
            a = s[2] + " " + r[2] + " " + t[2];
          this.feFuncR.setAttribute("tableValues", i),
            this.feFuncG.setAttribute("tableValues", n),
            this.feFuncB.setAttribute("tableValues", a);
        }
      };
      function SVGProLevelsFilter(e, t, r, s) {
        this.filterManager = t;
        var i = this.filterManager.effectElements,
          n = createNS("feComponentTransfer");
        (i[10].p.k ||
          i[10].p.v !== 0 ||
          i[11].p.k ||
          i[11].p.v !== 1 ||
          i[12].p.k ||
          i[12].p.v !== 1 ||
          i[13].p.k ||
          i[13].p.v !== 0 ||
          i[14].p.k ||
          i[14].p.v !== 1) &&
          (this.feFuncR = this.createFeFunc("feFuncR", n)),
          (i[17].p.k ||
            i[17].p.v !== 0 ||
            i[18].p.k ||
            i[18].p.v !== 1 ||
            i[19].p.k ||
            i[19].p.v !== 1 ||
            i[20].p.k ||
            i[20].p.v !== 0 ||
            i[21].p.k ||
            i[21].p.v !== 1) &&
            (this.feFuncG = this.createFeFunc("feFuncG", n)),
          (i[24].p.k ||
            i[24].p.v !== 0 ||
            i[25].p.k ||
            i[25].p.v !== 1 ||
            i[26].p.k ||
            i[26].p.v !== 1 ||
            i[27].p.k ||
            i[27].p.v !== 0 ||
            i[28].p.k ||
            i[28].p.v !== 1) &&
            (this.feFuncB = this.createFeFunc("feFuncB", n)),
          (i[31].p.k ||
            i[31].p.v !== 0 ||
            i[32].p.k ||
            i[32].p.v !== 1 ||
            i[33].p.k ||
            i[33].p.v !== 1 ||
            i[34].p.k ||
            i[34].p.v !== 0 ||
            i[35].p.k ||
            i[35].p.v !== 1) &&
            (this.feFuncA = this.createFeFunc("feFuncA", n)),
          (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
            (n.setAttribute("color-interpolation-filters", "sRGB"),
            e.appendChild(n)),
          (i[3].p.k ||
            i[3].p.v !== 0 ||
            i[4].p.k ||
            i[4].p.v !== 1 ||
            i[5].p.k ||
            i[5].p.v !== 1 ||
            i[6].p.k ||
            i[6].p.v !== 0 ||
            i[7].p.k ||
            i[7].p.v !== 1) &&
            ((n = createNS("feComponentTransfer")),
            n.setAttribute("color-interpolation-filters", "sRGB"),
            n.setAttribute("result", s),
            e.appendChild(n),
            (this.feFuncRComposed = this.createFeFunc("feFuncR", n)),
            (this.feFuncGComposed = this.createFeFunc("feFuncG", n)),
            (this.feFuncBComposed = this.createFeFunc("feFuncB", n)));
      }
      (SVGProLevelsFilter.prototype.createFeFunc = function (e, t) {
        var r = createNS(e);
        return r.setAttribute("type", "table"), t.appendChild(r), r;
      }),
        (SVGProLevelsFilter.prototype.getTableValue = function (e, t, r, s, i) {
          for (
            var n = 0,
              a = 256,
              o,
              h = Math.min(e, t),
              c = Math.max(e, t),
              m = Array.call(null, { length: a }),
              S,
              u = 0,
              v = i - s,
              g = t - e;
            n <= 256;

          )
            (o = n / 256),
              o <= h
                ? (S = g < 0 ? i : s)
                : o >= c
                ? (S = g < 0 ? s : i)
                : (S = s + v * Math.pow((o - e) / g, 1 / r)),
              (m[u] = S),
              (u += 1),
              (n += 256 / (a - 1));
          return m.join(" ");
        }),
        (SVGProLevelsFilter.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            var t,
              r = this.filterManager.effectElements;
            this.feFuncRComposed &&
              (e ||
                r[3].p._mdf ||
                r[4].p._mdf ||
                r[5].p._mdf ||
                r[6].p._mdf ||
                r[7].p._mdf) &&
              ((t = this.getTableValue(
                r[3].p.v,
                r[4].p.v,
                r[5].p.v,
                r[6].p.v,
                r[7].p.v
              )),
              this.feFuncRComposed.setAttribute("tableValues", t),
              this.feFuncGComposed.setAttribute("tableValues", t),
              this.feFuncBComposed.setAttribute("tableValues", t)),
              this.feFuncR &&
                (e ||
                  r[10].p._mdf ||
                  r[11].p._mdf ||
                  r[12].p._mdf ||
                  r[13].p._mdf ||
                  r[14].p._mdf) &&
                ((t = this.getTableValue(
                  r[10].p.v,
                  r[11].p.v,
                  r[12].p.v,
                  r[13].p.v,
                  r[14].p.v
                )),
                this.feFuncR.setAttribute("tableValues", t)),
              this.feFuncG &&
                (e ||
                  r[17].p._mdf ||
                  r[18].p._mdf ||
                  r[19].p._mdf ||
                  r[20].p._mdf ||
                  r[21].p._mdf) &&
                ((t = this.getTableValue(
                  r[17].p.v,
                  r[18].p.v,
                  r[19].p.v,
                  r[20].p.v,
                  r[21].p.v
                )),
                this.feFuncG.setAttribute("tableValues", t)),
              this.feFuncB &&
                (e ||
                  r[24].p._mdf ||
                  r[25].p._mdf ||
                  r[26].p._mdf ||
                  r[27].p._mdf ||
                  r[28].p._mdf) &&
                ((t = this.getTableValue(
                  r[24].p.v,
                  r[25].p.v,
                  r[26].p.v,
                  r[27].p.v,
                  r[28].p.v
                )),
                this.feFuncB.setAttribute("tableValues", t)),
              this.feFuncA &&
                (e ||
                  r[31].p._mdf ||
                  r[32].p._mdf ||
                  r[33].p._mdf ||
                  r[34].p._mdf ||
                  r[35].p._mdf) &&
                ((t = this.getTableValue(
                  r[31].p.v,
                  r[32].p.v,
                  r[33].p.v,
                  r[34].p.v,
                  r[35].p.v
                )),
                this.feFuncA.setAttribute("tableValues", t));
          }
        });
      function SVGDropShadowEffect(e, t, r, s, i) {
        var n = t.container.globalData.renderConfig.filterSize,
          a = t.data.fs || n;
        e.setAttribute("x", a.x || n.x),
          e.setAttribute("y", a.y || n.y),
          e.setAttribute("width", a.width || n.width),
          e.setAttribute("height", a.height || n.height),
          (this.filterManager = t);
        var o = createNS("feGaussianBlur");
        o.setAttribute("in", "SourceAlpha"),
          o.setAttribute("result", s + "_drop_shadow_1"),
          o.setAttribute("stdDeviation", "0"),
          (this.feGaussianBlur = o),
          e.appendChild(o);
        var h = createNS("feOffset");
        h.setAttribute("dx", "25"),
          h.setAttribute("dy", "0"),
          h.setAttribute("in", s + "_drop_shadow_1"),
          h.setAttribute("result", s + "_drop_shadow_2"),
          (this.feOffset = h),
          e.appendChild(h);
        var c = createNS("feFlood");
        c.setAttribute("flood-color", "#00ff00"),
          c.setAttribute("flood-opacity", "1"),
          c.setAttribute("result", s + "_drop_shadow_3"),
          (this.feFlood = c),
          e.appendChild(c);
        var m = createNS("feComposite");
        m.setAttribute("in", s + "_drop_shadow_3"),
          m.setAttribute("in2", s + "_drop_shadow_2"),
          m.setAttribute("operator", "in"),
          m.setAttribute("result", s + "_drop_shadow_4"),
          e.appendChild(m);
        var S = this.createMergeNode(s, [s + "_drop_shadow_4", i]);
        e.appendChild(S);
      }
      extendPrototype([SVGComposableEffect], SVGDropShadowEffect),
        (SVGDropShadowEffect.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            if (
              ((e || this.filterManager.effectElements[4].p._mdf) &&
                this.feGaussianBlur.setAttribute(
                  "stdDeviation",
                  this.filterManager.effectElements[4].p.v / 4
                ),
              e || this.filterManager.effectElements[0].p._mdf)
            ) {
              var t = this.filterManager.effectElements[0].p.v;
              this.feFlood.setAttribute(
                "flood-color",
                rgbToHex(
                  Math.round(t[0] * 255),
                  Math.round(t[1] * 255),
                  Math.round(t[2] * 255)
                )
              );
            }
            if (
              ((e || this.filterManager.effectElements[1].p._mdf) &&
                this.feFlood.setAttribute(
                  "flood-opacity",
                  this.filterManager.effectElements[1].p.v / 255
                ),
              e ||
                this.filterManager.effectElements[2].p._mdf ||
                this.filterManager.effectElements[3].p._mdf)
            ) {
              var r = this.filterManager.effectElements[3].p.v,
                s = (this.filterManager.effectElements[2].p.v - 90) * degToRads,
                i = r * Math.cos(s),
                n = r * Math.sin(s);
              this.feOffset.setAttribute("dx", i),
                this.feOffset.setAttribute("dy", n);
            }
          }
        });
      var _svgMatteSymbols = [];
      function SVGMatte3Effect(e, t, r) {
        (this.initialized = !1),
          (this.filterManager = t),
          (this.filterElem = e),
          (this.elem = r),
          (r.matteElement = createNS("g")),
          r.matteElement.appendChild(r.layerElement),
          r.matteElement.appendChild(r.transformedElement),
          (r.baseElement = r.matteElement);
      }
      (SVGMatte3Effect.prototype.findSymbol = function (e) {
        for (var t = 0, r = _svgMatteSymbols.length; t < r; ) {
          if (_svgMatteSymbols[t] === e) return _svgMatteSymbols[t];
          t += 1;
        }
        return null;
      }),
        (SVGMatte3Effect.prototype.replaceInParent = function (e, t) {
          var r = e.layerElement.parentNode;
          if (!!r) {
            for (
              var s = r.children, i = 0, n = s.length;
              i < n && s[i] !== e.layerElement;

            )
              i += 1;
            var a;
            i <= n - 2 && (a = s[i + 1]);
            var o = createNS("use");
            o.setAttribute("href", "#" + t),
              a ? r.insertBefore(o, a) : r.appendChild(o);
          }
        }),
        (SVGMatte3Effect.prototype.setElementAsMask = function (e, t) {
          if (!this.findSymbol(t)) {
            var r = createElementID(),
              s = createNS("mask");
            s.setAttribute("id", t.layerId),
              s.setAttribute("mask-type", "alpha"),
              _svgMatteSymbols.push(t);
            var i = e.globalData.defs;
            i.appendChild(s);
            var n = createNS("symbol");
            n.setAttribute("id", r),
              this.replaceInParent(t, r),
              n.appendChild(t.layerElement),
              i.appendChild(n);
            var a = createNS("use");
            a.setAttribute("href", "#" + r),
              s.appendChild(a),
              (t.data.hd = !1),
              t.show();
          }
          e.setMatte(t.layerId);
        }),
        (SVGMatte3Effect.prototype.initialize = function () {
          for (
            var e = this.filterManager.effectElements[0].p.v,
              t = this.elem.comp.elements,
              r = 0,
              s = t.length;
            r < s;

          )
            t[r] &&
              t[r].data.ind === e &&
              this.setElementAsMask(this.elem, t[r]),
              (r += 1);
          this.initialized = !0;
        }),
        (SVGMatte3Effect.prototype.renderFrame = function () {
          this.initialized || this.initialize();
        });
      function SVGGaussianBlurEffect(e, t, r, s) {
        e.setAttribute("x", "-100%"),
          e.setAttribute("y", "-100%"),
          e.setAttribute("width", "300%"),
          e.setAttribute("height", "300%"),
          (this.filterManager = t);
        var i = createNS("feGaussianBlur");
        i.setAttribute("result", s),
          e.appendChild(i),
          (this.feGaussianBlur = i);
      }
      return (
        (SVGGaussianBlurEffect.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            var t = 0.3,
              r = this.filterManager.effectElements[0].p.v * t,
              s = this.filterManager.effectElements[1].p.v,
              i = s == 3 ? 0 : r,
              n = s == 2 ? 0 : r;
            this.feGaussianBlur.setAttribute("stdDeviation", i + " " + n);
            var a =
              this.filterManager.effectElements[2].p.v == 1
                ? "wrap"
                : "duplicate";
            this.feGaussianBlur.setAttribute("edgeMode", a);
          }
        }),
        registerRenderer("canvas", CanvasRenderer),
        registerRenderer("html", HybridRenderer),
        registerRenderer("svg", SVGRenderer),
        ShapeModifiers.registerModifier("tm", TrimModifier),
        ShapeModifiers.registerModifier("pb", PuckerAndBloatModifier),
        ShapeModifiers.registerModifier("rp", RepeaterModifier),
        ShapeModifiers.registerModifier("rd", RoundCornersModifier),
        setExpressionsPlugin(Expressions),
        initialize$1(),
        initialize(),
        registerEffect(20, SVGTintFilter, !0),
        registerEffect(21, SVGFillFilter, !0),
        registerEffect(22, SVGStrokeEffect, !1),
        registerEffect(23, SVGTritoneFilter, !0),
        registerEffect(24, SVGProLevelsFilter, !0),
        registerEffect(25, SVGDropShadowEffect, !0),
        registerEffect(28, SVGMatte3Effect, !1),
        registerEffect(29, SVGGaussianBlurEffect, !0),
        lottie
      );
    });
})(lottie$1, lottie$1.exports);
const lottie = lottie$1.exports,
  QwikLottie = componentQrl(
    inlinedQrl(({ options: e }) => {
      const t = useStore({ anim: {} }),
        r = inlinedQrl((s) => {
          const i = document.getElementById("lottie");
          lottie.loadAnimation({
            container: i || s.container,
            renderer: s.renderer || "svg",
            loop: s.loop || !0,
            autoplay: s.autoplay || !0,
            animationData: s.animationData,
            path: s.path,
            rendererSettings: s.rendererSettings,
            name: s.name,
          });
        }, "QwikLottie_component_loadAnimation_ub59PxeUkKA");
      return (
        useClientEffectQrl(
          inlinedQrl(
            () => {
              const [s, i, n] = useLexicalScope();
              n.anim = s(i);
            },
            "QwikLottie_component_useClientEffect_VNRJxDUu3FY",
            [r, e, t]
          )
        ),
        jsx("div", { id: "lottie" })
      );
    }, "QwikLottie_component_CTOsjDUban0")
  ),
  index = componentQrl(
    inlinedQrl(
      () =>
        jsx(Fragment, {
          children: [
            jsx("h1", {
              class: "text-3xl font-bold underline text-center",
              children: "Welcome to Qwik Design",
            }),
            jsx(QwikLottie, {
              options: {
                path: "https://assets7.lottiefiles.com/packages/lf20_M6jA5UNDHa.json",
              },
              [_IMMUTABLE]: { options: !0 },
            }),
          ],
        }),
      "s_kinAxFmotTw"
    )
  ),
  head$4 = { title: "Welcome to Qwik Docs Starter" },
  Index = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: index, head: head$4 },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  headings$3 = [
    { text: "About Qwik", id: "about-qwik", level: 1 },
    { text: "More info:", id: "more-info", level: 2 },
  ],
  head$3 = { title: "About Qwik", meta: [], styles: [], links: [] },
  frontmatter$3 = { title: "About Qwik" };
function _createMdxContent$3(e) {
  const t = Object.assign(
    {
      h1: "h1",
      a: "a",
      span: "span",
      p: "p",
      code: "code",
      h2: "h2",
      ul: "ul",
      li: "li",
    },
    e.components
  );
  return jsx(Fragment, {
    children: [
      jsx(t.h1, {
        id: "about-qwik",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#about-qwik",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "About Qwik",
        ],
      }),
      `
`,
      jsx(t.p, {
        children: [
          "This page is at the root level, so it only uses the ",
          jsx(t.code, { children: "/src/routes/layout.tsx" }),
          " layout to wrap the page content.",
        ],
      }),
      `
`,
      jsx(t.h2, {
        id: "more-info",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#more-info",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "More info:",
        ],
      }),
      `
`,
      jsx(t.ul, {
        children: [
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/layout/overview/",
              children: "Layouts",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/routing/overview/",
              children: "Routing",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/content/component/",
              children: "Authoring Content",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/adaptors/overview/",
              children: "Server Adaptors and Middleware",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/static-site-generation/overview/",
              children: "Static Site Generation (SSG)",
            }),
          }),
          `
`,
        ],
      }),
    ],
  });
}
function MDXContent$3(e = {}) {
  const { wrapper: t } = e.components || {};
  return t
    ? jsx(t, Object.assign({}, e, { children: jsx(_createMdxContent$3, e) }))
    : _createMdxContent$3(e);
}
const Aboutus = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        headings: headings$3,
        head: head$3,
        frontmatter: frontmatter$3,
        default: MDXContent$3,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  headings$2 = [
    { text: "Docs Site Overview", id: "docs-site-overview", level: 1 },
    { text: "Left Menu", id: "left-menu", level: 2 },
    { text: "More info:", id: "more-info", level: 2 },
  ],
  head$2 = { title: "Overview", meta: [], styles: [], links: [] },
  frontmatter$2 = { title: "Overview" };
function _createMdxContent$2(e) {
  const t = Object.assign(
    {
      h1: "h1",
      a: "a",
      span: "span",
      p: "p",
      code: "code",
      ul: "ul",
      li: "li",
      h2: "h2",
    },
    e.components
  );
  return jsx(Fragment, {
    children: [
      jsx(t.h1, {
        id: "docs-site-overview",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#docs-site-overview",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "Docs Site Overview",
        ],
      }),
      `
`,
      jsx(t.p, {
        children: [
          "This page is wrapped by two layouts because this source file ",
          jsx(t.code, { children: "src/routes/docs/index.md" }),
          " is nested. The applied layouts are:",
        ],
      }),
      `
`,
      jsx(t.ul, {
        children: [
          `
`,
          jsx(t.li, {
            children: jsx(t.code, { children: "src/routes/docs/layout.tsx" }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.code, { children: "src/routes/layout.tsx" }),
          }),
          `
`,
        ],
      }),
      `
`,
      jsx(t.h2, {
        id: "left-menu",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#left-menu",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "Left Menu",
        ],
      }),
      `
`,
      jsx(t.p, {
        children: [
          "The left menu ordering is created with the ",
          jsx(t.code, { children: "src/routes/docs/menu.md" }),
          " markdown file.",
        ],
      }),
      `
`,
      jsx(t.h2, {
        id: "more-info",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#more-info",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "More info:",
        ],
      }),
      `
`,
      jsx(t.ul, {
        children: [
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/layout/overview/",
              children: "Layouts",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/routing/overview/",
              children: "Routing",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/content/component/",
              children: "Authoring Content",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/adaptors/overview/",
              children: "Server Adaptors and Middleware",
            }),
          }),
          `
`,
          jsx(t.li, {
            children: jsx(t.a, {
              href: "https://qwik.builder.io/qwikcity/static-site-generation/overview/",
              children: "Static Site Generation (SSG)",
            }),
          }),
          `
`,
        ],
      }),
    ],
  });
}
function MDXContent$2(e = {}) {
  const { wrapper: t } = e.components || {};
  return t
    ? jsx(t, Object.assign({}, e, { children: jsx(_createMdxContent$2, e) }))
    : _createMdxContent$2(e);
}
const Docs = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        headings: headings$2,
        head: head$2,
        frontmatter: frontmatter$2,
        default: MDXContent$2,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  headings$1 = [
    { text: "Advanced", id: "advanced", level: 1 },
    { text: "Ferrari", id: "ferrari", level: 2 },
  ],
  head$1 = { title: "Advanced", meta: [], styles: [], links: [] },
  frontmatter$1 = { title: "Advanced" };
function _createMdxContent$1(e) {
  const t = Object.assign(
    { h1: "h1", a: "a", span: "span", p: "p", h2: "h2" },
    e.components
  );
  return jsx(Fragment, {
    children: [
      jsx(t.h1, {
        id: "advanced",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#advanced",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "Advanced",
        ],
      }),
      `
`,
      jsx(t.p, {
        children:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      }),
      `
`,
      jsx(t.h2, {
        id: "ferrari",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#ferrari",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "Ferrari",
        ],
      }),
      `
`,
      jsx(t.p, {
        children: [
          jsx(t.a, {
            href: "https://en.wikipedia.org/wiki/Ferrari",
            children: "Ferrari",
          }),
          " (/f\u0259\u02C8r\u0251\u02D0ri/; Italian: [fer\u02C8ra\u02D0ri]) is an Italian luxury sports car manufacturer based in Maranello, Italy. Founded by Enzo Ferrari (1898\u20131988) in 1939 from the Alfa Romeo racing division as Auto Avio Costruzioni, the company built its first car in 1940, and produced its first Ferrari-badged car in 1947.",
        ],
      }),
    ],
  });
}
function MDXContent$1(e = {}) {
  const { wrapper: t } = e.components || {};
  return t
    ? jsx(t, Object.assign({}, e, { children: jsx(_createMdxContent$1, e) }))
    : _createMdxContent$1(e);
}
const DocsAdvanced = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        headings: headings$1,
        head: head$1,
        frontmatter: frontmatter$1,
        default: MDXContent$1,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  headings = [
    { text: "Getting Started", id: "getting-started", level: 1 },
    { text: "Ford GT40", id: "ford-gt40", level: 2 },
  ],
  head = { title: "Getting Started", meta: [], styles: [], links: [] },
  frontmatter = { title: "Getting Started" };
function _createMdxContent(e) {
  const t = Object.assign(
    {
      h1: "h1",
      a: "a",
      span: "span",
      pre: "pre",
      code: "code",
      h2: "h2",
      p: "p",
    },
    e.components
  );
  return jsx(Fragment, {
    children: [
      jsx(t.h1, {
        id: "getting-started",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#getting-started",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "Getting Started",
        ],
      }),
      `
`,
      jsx(t.pre, {
        children: jsx(t.code, {
          children: `npm create qwik@latest
`,
        }),
      }),
      `
`,
      jsx(t.h2, {
        id: "ford-gt40",
        children: [
          jsx(t.a, {
            "aria-hidden": "true",
            tabIndex: "-1",
            href: "#ford-gt40",
            children: jsx(t.span, { className: "icon icon-link" }),
          }),
          "Ford GT40",
        ],
      }),
      `
`,
      jsx(t.p, {
        children: [
          "The ",
          jsx(t.a, {
            href: "https://en.wikipedia.org/wiki/Ford_GT40",
            children: "Ford GT40",
          }),
          ' is a high-performance endurance racing car commissioned by the Ford Motor Company. It grew out of the "Ford GT" (for Grand Touring) project, an effort to compete in European long-distance sports car races, against Ferrari, which won the prestigious 24 Hours of Le Mans race from 1960 to 1965. Ford succeeded with the GT40, winning the 1966 through 1969 races.',
        ],
      }),
    ],
  });
}
function MDXContent(e = {}) {
  const { wrapper: t } = e.components || {};
  return t
    ? jsx(t, Object.assign({}, e, { children: jsx(_createMdxContent, e) }))
    : _createMdxContent(e);
}
const DocsGettingstarted = Object.freeze(
    Object.defineProperty(
      { __proto__: null, headings, head, frontmatter, default: MDXContent },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  DocsMenu = {
    text: "Guide",
    items: [
      {
        text: "Guides",
        items: [{ text: "Getting Started", href: "/docs/getting-started" }],
      },
      {
        text: "Advanced",
        items: [{ text: "Overview", href: "/docs/advanced" }],
      },
      {
        text: "Examples",
        items: [
          {
            text: "Hello World",
            href: "https://qwik.builder.io/examples/introduction/hello-world/",
          },
          {
            text: "Tutorials",
            href: "https://qwik.builder.io/tutorial/welcome/overview/",
          },
          { text: "Playground", href: "https://qwik.builder.io/playground/" },
        ],
      },
      {
        text: "Community",
        items: [
          { text: "@QwikDev", href: "https://twitter.com/QwikDev" },
          { text: "Discord", href: "https://qwik.builder.io/chat" },
          { text: "Github", href: "https://github.com/BuilderIO/qwik" },
        ],
      },
    ],
  },
  DocsMenu$1 = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: DocsMenu },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  DocsLayout = () => DocsLayout_,
  Layout = () => Layout_,
  routes = [
    [
      /^\/$/,
      [Layout, () => Index],
      void 0,
      "/",
      ["q-44814418.js", "q-d6bfb140.js"],
    ],
    [
      /^\/about-us\/?$/,
      [Layout, () => Aboutus],
      void 0,
      "/about-us",
      ["q-44814418.js", "q-67950cf1.js"],
    ],
    [
      /^\/docs\/?$/,
      [Layout, DocsLayout, () => Docs],
      void 0,
      "/docs",
      ["q-44814418.js", "q-36ede21c.js", "q-f8d11d8c.js"],
    ],
    [
      /^\/docs\/advanced\/?$/,
      [Layout, DocsLayout, () => DocsAdvanced],
      void 0,
      "/docs/advanced",
      ["q-44814418.js", "q-36ede21c.js", "q-c6057980.js"],
    ],
    [
      /^\/docs\/getting-started\/?$/,
      [Layout, DocsLayout, () => DocsGettingstarted],
      void 0,
      "/docs/getting-started",
      ["q-44814418.js", "q-36ede21c.js", "q-150dc3fd.js"],
    ],
  ],
  menus = [["/docs", () => DocsMenu$1]],
  trailingSlash = !1,
  basePathname = "/",
  cacheModules = !0,
  _qwikCityPlan = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        routes,
        menus,
        trailingSlash,
        basePathname,
        cacheModules,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
var HEADERS = Symbol("headers"),
  _a,
  HeadersPolyfill = class {
    constructor() {
      this[_a] = {};
    }
    [((_a = HEADERS), Symbol.iterator)]() {
      return this.entries();
    }
    *keys() {
      for (const e of Object.keys(this[HEADERS])) yield e;
    }
    *values() {
      for (const e of Object.values(this[HEADERS])) yield e;
    }
    *entries() {
      for (const e of Object.keys(this[HEADERS])) yield [e, this.get(e)];
    }
    get(e) {
      return this[HEADERS][normalizeHeaderName(e)] || null;
    }
    set(e, t) {
      const r = normalizeHeaderName(e);
      this[HEADERS][r] = typeof t != "string" ? String(t) : t;
    }
    append(e, t) {
      const r = normalizeHeaderName(e),
        s = this.has(r) ? `${this.get(r)}, ${t}` : t;
      this.set(e, s);
    }
    delete(e) {
      if (!this.has(e)) return;
      const t = normalizeHeaderName(e);
      delete this[HEADERS][t];
    }
    all() {
      return this[HEADERS];
    }
    has(e) {
      return this[HEADERS].hasOwnProperty(normalizeHeaderName(e));
    }
    forEach(e, t) {
      for (const r in this[HEADERS])
        this[HEADERS].hasOwnProperty(r) && e.call(t, this[HEADERS][r], r, this);
    }
  },
  HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(e) {
  if (
    (typeof e != "string" && (e = String(e)),
    HEADERS_INVALID_CHARACTERS.test(e) || e.trim() === "")
  )
    throw new TypeError("Invalid character in header field name");
  return e.toLowerCase();
}
function createHeaders() {
  return new (typeof Headers == "function" ? Headers : HeadersPolyfill)();
}
var ErrorResponse = class extends Error {
  constructor(e, t) {
    super(t), (this.status = e);
  }
};
function notFoundHandler(e) {
  return errorResponse(e, new ErrorResponse(404, "Not Found"));
}
function errorHandler(e, t) {
  let s = "Server Error",
    i;
  t != null &&
    (typeof t == "object"
      ? (typeof t.message == "string" && (s = t.message),
        t.stack != null && (i = String(t.stack)))
      : (s = String(t)));
  const n = minimalHtmlResponse(500, s, i),
    a = createHeaders();
  return (
    a.set("Content-Type", "text/html; charset=utf-8"),
    e.response(
      500,
      a,
      async (o) => {
        o.write(n);
      },
      t
    )
  );
}
function errorResponse(e, t) {
  const r = minimalHtmlResponse(t.status, t.message, t.stack),
    s = createHeaders();
  return (
    s.set("Content-Type", "text/html; charset=utf-8"),
    e.response(
      t.status,
      s,
      async (i) => {
        i.write(r);
      },
      t
    )
  );
}
function minimalHtmlResponse(e, t, r) {
  const s = typeof t == "string" ? "600px" : "300px",
    i = e >= 500 ? COLOR_500 : COLOR_400;
  return (
    e < 500 && (r = ""),
    `<!DOCTYPE html>
<html data-qwik-city-status="${e}">
<head>
  <meta charset="utf-8">
  <title>${e} ${t}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { color: ${i}; background-color: #fafafa; padding: 30px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
    p { max-width: ${s}; margin: 60px auto 30px auto; background: white; border-radius: 4px; box-shadow: 0px 0px 50px -20px ${i}; overflow: hidden; }
    strong { display: inline-block; padding: 15px; background: ${i}; color: white; }
    span { display: inline-block; padding: 15px; }
    pre { max-width: 580px; margin: 0 auto; }
  </style>
</head>
<body>
  <p>
    <strong>${e}</strong>
    <span>${t}</span>
  </p>
  ${r ? `<pre><code>${r}</code></pre>` : ""}
</body>
</html>
`
  );
}
var COLOR_400 = "#006ce9",
  COLOR_500 = "#713fc2",
  MODULE_CACHE = new WeakMap(),
  loadRoute = async (e, t, r, s) => {
    if (Array.isArray(e))
      for (const i of e) {
        const n = i[0].exec(s);
        if (n) {
          const a = i[1],
            o = getRouteParams(i[2], n),
            h = i[4],
            c = new Array(a.length),
            m = [],
            S = getMenuLoader(t, s);
          let u;
          return (
            a.forEach((v, g) => {
              loadModule(v, m, (y) => (c[g] = y), r);
            }),
            loadModule(S, m, (v) => (u = v == null ? void 0 : v.default), r),
            m.length > 0 && (await Promise.all(m)),
            [o, c, u, h]
          );
        }
      }
    return null;
  },
  loadModule = (e, t, r, s) => {
    if (typeof e == "function") {
      const i = MODULE_CACHE.get(e);
      if (i) r(i);
      else {
        const n = e();
        typeof n.then == "function"
          ? t.push(
              n.then((a) => {
                s !== !1 && MODULE_CACHE.set(e, a), r(a);
              })
            )
          : n && r(n);
      }
    }
  },
  getMenuLoader = (e, t) => {
    if (e) {
      const r = e.find(
        (s) => s[0] === t || t.startsWith(s[0] + (t.endsWith("/") ? "" : "/"))
      );
      if (r) return r[1];
    }
  },
  getRouteParams = (e, t) => {
    const r = {};
    if (e) for (let s = 0; s < e.length; s++) r[e[s]] = t ? t[s + 1] : "";
    return r;
  },
  RedirectResponse = class {
    constructor(e, t, r) {
      (this.url = e),
        (this.location = e),
        (this.status = isRedirectStatus(t) ? t : 307),
        (this.headers = r || createHeaders()),
        this.headers.set("Location", this.location),
        this.headers.delete("Cache-Control");
    }
  };
function redirectResponse(e, t) {
  return e.response(t.status, t.headers, async () => {});
}
function isRedirectStatus(e) {
  return typeof e == "number" && e >= 301 && e <= 308;
}
async function loadUserResponse(e, t, r, s, i, n = "/") {
  if (r.length === 0) throw new ErrorResponse(404, "Not Found");
  const { request: a, url: o } = e,
    { pathname: h } = o,
    c = isLastModulePageRoute(r),
    m = c && a.headers.get("Accept") === "application/json",
    S = m ? "pagedata" : c ? "pagehtml" : "endpoint",
    u = {
      type: S,
      url: o,
      params: t,
      status: 200,
      headers: createHeaders(),
      resolvedBody: void 0,
      pendingBody: void 0,
      aborted: !1,
    };
  let v = !1;
  if (c && h !== n) {
    if (i) {
      if (!h.endsWith("/")) throw new RedirectResponse(h + "/" + o.search, 307);
    } else if (h.endsWith("/"))
      throw new RedirectResponse(h.slice(0, h.length - 1) + o.search, 307);
  }
  let g = -1;
  const y = () => {
      g = ABORT_INDEX;
    },
    E = (p, f) => new RedirectResponse(p, f, u.headers),
    l = (p, f) => new ErrorResponse(p, f),
    d = async () => {
      for (g++; g < r.length; ) {
        const p = r[g];
        let f;
        switch (a.method) {
          case "GET": {
            f = p.onGet;
            break;
          }
          case "POST": {
            f = p.onPost;
            break;
          }
          case "PUT": {
            f = p.onPut;
            break;
          }
          case "PATCH": {
            f = p.onPatch;
            break;
          }
          case "OPTIONS": {
            f = p.onOptions;
            break;
          }
          case "HEAD": {
            f = p.onHead;
            break;
          }
          case "DELETE": {
            f = p.onDelete;
            break;
          }
        }
        if (((f = f || p.onRequest), typeof f == "function")) {
          v = !0;
          const b = {
              get status() {
                return u.status;
              },
              set status(_) {
                u.status = _;
              },
              get headers() {
                return u.headers;
              },
              redirect: E,
              error: l,
            },
            x = {
              request: a,
              url: new URL(o),
              params: { ...t },
              response: b,
              platform: s,
              next: d,
              abort: y,
            },
            $ = f(x);
          if (typeof $ == "function") u.pendingBody = createPendingBody($);
          else if (
            $ !== null &&
            typeof $ == "object" &&
            typeof $.then == "function"
          ) {
            const _ = await $;
            typeof _ == "function"
              ? (u.pendingBody = createPendingBody(_))
              : (u.resolvedBody = _);
          } else u.resolvedBody = $;
        }
        g++;
      }
    };
  if (
    (await d(),
    (u.aborted = g >= ABORT_INDEX),
    !m && isRedirectStatus(u.status) && u.headers.has("Location"))
  )
    throw new RedirectResponse(u.headers.get("Location"), u.status, u.headers);
  if (S === "endpoint" && !v)
    throw new ErrorResponse(405, "Method Not Allowed");
  return u;
}
function createPendingBody(e) {
  return new Promise((t, r) => {
    try {
      const s = e();
      s !== null && typeof s == "object" && typeof s.then == "function"
        ? s.then(t, r)
        : t(s);
    } catch (s) {
      r(s);
    }
  });
}
function isLastModulePageRoute(e) {
  const t = e[e.length - 1];
  return t && typeof t.default == "function";
}
function updateRequestCtx(e, t) {
  let r = e.url.pathname;
  if (r.endsWith(QDATA_JSON)) {
    e.request.headers.set("Accept", "application/json");
    const s = r.length - QDATA_JSON_LEN + (t ? 1 : 0);
    (r = r.slice(0, s)), r === "" && (r = "/"), (e.url.pathname = r);
  }
}
var QDATA_JSON = "/q-data.json",
  QDATA_JSON_LEN = QDATA_JSON.length,
  ABORT_INDEX = 999999999;
function endpointHandler(e, t) {
  const { pendingBody: r, resolvedBody: s, status: i, headers: n } = t,
    { response: a } = e;
  if (r === void 0 && s === void 0) return a(i, n, asyncNoop);
  n.has("Content-Type") ||
    n.set("Content-Type", "application/json; charset=utf-8");
  const o = n.get("Content-Type").includes("json");
  return a(i, n, async ({ write: h }) => {
    const c = r !== void 0 ? await r : s;
    if (c !== void 0)
      if (o) h(JSON.stringify(c));
      else {
        const m = typeof c;
        h(
          m === "string" ? c : m === "number" || m === "boolean" ? String(c) : c
        );
      }
  });
}
var asyncNoop = async () => {};
function pageHandler(e, t, r, s, i) {
  const { status: n, headers: a } = t,
    { response: o } = e,
    h = t.type === "pagedata";
  return (
    h
      ? a.set("Content-Type", "application/json; charset=utf-8")
      : a.has("Content-Type") ||
        a.set("Content-Type", "text/html; charset=utf-8"),
    o(h ? 200 : n, a, async (c) => {
      const m = await r({
        stream: h ? noopStream : c,
        envData: getQwikCityEnvData(t),
        ...s,
      });
      h
        ? c.write(JSON.stringify(await getClientPageData(t, m, i)))
        : (typeof m).html === "string" && c.write(m.html),
        typeof c.clientData == "function" &&
          c.clientData(await getClientPageData(t, m, i));
    })
  );
}
async function getClientPageData(e, t, r) {
  const s = getPrefetchBundleNames(t, r);
  return {
    body: e.pendingBody ? await e.pendingBody : e.resolvedBody,
    status: e.status !== 200 ? e.status : void 0,
    redirect:
      (e.status >= 301 && e.status <= 308 && e.headers.get("location")) ||
      void 0,
    prefetch: s.length > 0 ? s : void 0,
  };
}
function getPrefetchBundleNames(e, t) {
  const r = [],
    s = (o) => {
      o && !r.includes(o) && r.push(o);
    },
    i = (o) => {
      if (Array.isArray(o))
        for (const h of o) {
          const c = h.url.split("/").pop();
          c && !r.includes(c) && (s(c), i(h.imports));
        }
    };
  i(e.prefetchResources);
  const n = e.manifest || e._manifest,
    a = e._symbols;
  if (n && a)
    for (const o of a) {
      const h = n.symbols[o];
      h && h.ctxName === "component$" && s(n.mapping[o]);
    }
  if (t) for (const o of t) s(o);
  return r;
}
function getQwikCityEnvData(e) {
  const { url: t, params: r, pendingBody: s, resolvedBody: i, status: n } = e;
  return {
    url: t.href,
    qwikcity: { params: { ...r }, response: { body: s || i, status: n } },
  };
}
var noopStream = { write: () => {} };
async function requestHandler(e, t, r, s) {
  try {
    updateRequestCtx(e, trailingSlash);
    const i = await loadRoute(routes, menus, cacheModules, e.url.pathname);
    if (i) {
      const [n, a, o, h] = i,
        c = await loadUserResponse(e, n, a, r, trailingSlash, basePathname);
      return c.aborted
        ? null
        : c.type === "endpoint"
        ? endpointHandler(e, c)
        : pageHandler(e, c, t, s, h);
    }
  } catch (i) {
    return i instanceof RedirectResponse
      ? redirectResponse(e, i)
      : i instanceof ErrorResponse
      ? errorResponse(e, i)
      : errorHandler(e, i);
  }
  return null;
}
function qwikCity(e, t) {
  async function r(s, { next: i }) {
    try {
      const n = {
          url: new URL(s.url),
          request: s,
          response: (h, c, m) =>
            new Promise((S) => {
              let u = !1;
              const { readable: v, writable: g } = new TransformStream(),
                y = g.getWriter(),
                E = new Response(v, { status: h, headers: c });
              m({
                write: (l) => {
                  if ((u || ((u = !0), S(E)), typeof l == "string")) {
                    const d = new TextEncoder();
                    y.write(d.encode(l));
                  } else y.write(l);
                },
              }).finally(() => {
                u || ((u = !0), S(E)), y.close();
              });
            }),
        },
        a = await requestHandler(n, e, {}, t);
      if (a) return a;
      const o = await i();
      if (o.status === 404) {
        const h = await requestHandler(n, e, {}, t);
        return h || (await notFoundHandler(n));
      }
      return o;
    } catch (n) {
      return new Response(String(n || "Error"), {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }
  return r;
}
/**
 * @license
 * @builder.io/qwik/server 0.10.0
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */ if (typeof global > "u") {
  const e =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
      ? window
      : typeof self < "u"
      ? self
      : {};
  e.global = e;
}
var __require = ((e) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
    ? new Proxy(e, { get: (t, r) => (typeof require < "u" ? require : t)[r] })
    : e)(function (e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + e + '" is not supported');
});
function createTimer() {
  if (typeof performance > "u") return () => 0;
  const e = performance.now();
  return () => (performance.now() - e) / 1e6;
}
function getBuildBase(e) {
  let t = e.base;
  return typeof t == "string" ? (t.endsWith("/") || (t += "/"), t) : "/build/";
}
function createPlatform(e, t) {
  const r = t == null ? void 0 : t.mapper,
    s = e.symbolMapper
      ? e.symbolMapper
      : (n) => {
          if (r) {
            const a = getSymbolHash(n),
              o = r[a];
            return o || console.error("Cannot resolve symbol", n, "in", r), o;
          }
        };
  return {
    isServer: !0,
    async importSymbol(n, a, o) {
      let h = String(a);
      h.endsWith(".js") || (h += ".js");
      const c = __require(h);
      if (!(o in c))
        throw new Error(`Q-ERROR: missing symbol '${o}' in module '${h}'.`);
      return c[o];
    },
    raf: () => (console.error("server can not rerender"), Promise.resolve()),
    nextTick: (n) =>
      new Promise((a) => {
        setTimeout(() => {
          a(n());
        });
      }),
    chunkForSymbol(n) {
      return s(n, r);
    },
  };
}
async function setServerPlatform(e, t) {
  const r = createPlatform(e, t);
  setPlatform(r);
}
var getSymbolHash = (e) => {
    const t = e.lastIndexOf("_");
    return t > -1 ? e.slice(t + 1) : e;
  },
  QWIK_LOADER_DEFAULT_MINIFIED =
    '((e,t)=>{const n="__q_context__",o=window,a=new Set,i=t=>e.querySelectorAll(t),r=(e,t,n=t.type)=>{i("[on"+e+"\\\\:"+n+"]").forEach((o=>c(o,e,t,n)))},s=(e,t)=>new CustomEvent(e,{detail:t}),l=(t,n)=>(t=t.closest("[q\\\\:container]"),new URL(n,new URL(t.getAttribute("q:base"),e.baseURI))),c=async(t,o,a,i=a.type)=>{const r="on"+o+":"+i;t.hasAttribute("preventdefault:"+i)&&a.preventDefault();const s=t._qc_,c=null==s?void 0:s.li.filter((e=>e[0]===r));if(c&&c.length>0){for(const e of c)await e[1].getFn([t,a],(()=>t.isConnected))(a,t);return}const u=t.getAttribute(r);if(u)for(const o of u.split("\\n")){const i=l(t,o),r=d(i),s=performance.now(),c=b(await import(i.href.split("#")[0]))[r],u=e[n];if(t.isConnected)try{e[n]=[t,a,i],f("qsymbol",{symbol:r,element:t,reqTime:s}),await c(a,t)}finally{e[n]=u}}},f=(t,n)=>{e.dispatchEvent(s(t,n))},b=e=>Object.values(e).find(u)||e,u=e=>"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag],d=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",p=e=>e.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),v=async e=>{let t=p(e.type),n=e.target;for(r("-document",e,t);n&&n.getAttribute;)await c(n,"",e,t),n=e.bubbles&&!0!==e.cancelBubble?n.parentElement:null},w=e=>{r("-window",e,p(e.type))},y=()=>{var n;const r=e.readyState;if(!t&&("interactive"==r||"complete"==r)&&(t=1,f("qinit"),(null!=(n=o.requestIdleCallback)?n:o.setTimeout).bind(o)((()=>f("qidle"))),a.has("qvisible"))){const e=i("[on\\\\:qvisible]"),t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),c(n.target,"",s("qvisible",n)))}));e.forEach((e=>t.observe(e)))}},q=(e,t,n,o=!1)=>e.addEventListener(t,n,{capture:o}),g=t=>{for(const n of t)a.has(n)||(q(e,n,v,!0),q(o,n,w),a.add(n))};if(!e.qR){const t=o.qwikevents;Array.isArray(t)&&g(t),o.qwikevents={push:(...e)=>g(e)},q(e,"readystatechange",y),y()}})(document);',
  QWIK_LOADER_DEFAULT_DEBUG = `(() => {
    ((doc, hasInitialized) => {
        const win = window;
        const events =  new Set;
        const querySelectorAll = query => doc.querySelectorAll(query);
        const broadcast = (infix, ev, type = ev.type) => {
            querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, ev, type)));
        };
        const createEvent = (eventName, detail) => new CustomEvent(eventName, {
            detail: detail
        });
        const qrlResolver = (element, qrl) => {
            element = element.closest("[q\\\\:container]");
            return new URL(qrl, new URL(element.getAttribute("q:base"), doc.baseURI));
        };
        const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {
            const attrName = "on" + onPrefix + ":" + eventName;
            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();
            const ctx = element._qc_;
            const qrls = null == ctx ? void 0 : ctx.li.filter((li => li[0] === attrName));
            if (qrls && qrls.length > 0) {
                for (const q of qrls) {
                    await q[1].getFn([ element, ev ], (() => element.isConnected))(ev, element);
                }
                return;
            }
            const attrValue = element.getAttribute(attrName);
            if (attrValue) {
                for (const qrl of attrValue.split("\\n")) {
                    const url = qrlResolver(element, qrl);
                    const symbolName = getSymbolName(url);
                    const reqTime = performance.now();
                    const handler = findModule(await import(url.href.split("#")[0]))[symbolName];
                    const previousCtx = doc.__q_context__;
                    if (element.isConnected) {
                        try {
                            doc.__q_context__ = [ element, ev, url ];
                            emitEvent("qsymbol", {
                                symbol: symbolName,
                                element: element,
                                reqTime: reqTime
                            });
                            await handler(ev, element);
                        } finally {
                            doc.__q_context__ = previousCtx;
                        }
                    }
                }
            }
        };
        const emitEvent = (eventName, detail) => {
            doc.dispatchEvent(createEvent(eventName, detail));
        };
        const findModule = module => Object.values(module).find(isModule) || module;
        const isModule = module => "object" == typeof module && module && "Module" === module[Symbol.toStringTag];
        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";
        const camelToKebab = str => str.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));
        const processDocumentEvent = async ev => {
            let type = camelToKebab(ev.type);
            let element = ev.target;
            broadcast("-document", ev, type);
            while (element && element.getAttribute) {
                await dispatch(element, "", ev, type);
                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;
            }
        };
        const processWindowEvent = ev => {
            broadcast("-window", ev, camelToKebab(ev.type));
        };
        const processReadyStateChange = () => {
            var _a;
            const readyState = doc.readyState;
            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {
                hasInitialized = 1;
                emitEvent("qinit");
                (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)((() => emitEvent("qidle")));
                if (events.has("qvisible")) {
                    const results = querySelectorAll("[on\\\\:qvisible]");
                    const observer = new IntersectionObserver((entries => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                observer.unobserve(entry.target);
                                dispatch(entry.target, "", createEvent("qvisible", entry));
                            }
                        }
                    }));
                    results.forEach((el => observer.observe(el)));
                }
            }
        };
        const addEventListener = (el, eventName, handler, capture = !1) => el.addEventListener(eventName, handler, {
            capture: capture
        });
        const push = eventNames => {
            for (const eventName of eventNames) {
                if (!events.has(eventName)) {
                    addEventListener(doc, eventName, processDocumentEvent, !0);
                    addEventListener(win, eventName, processWindowEvent);
                    events.add(eventName);
                }
            }
        };
        if (!doc.qR) {
            const qwikevents = win.qwikevents;
            Array.isArray(qwikevents) && push(qwikevents);
            win.qwikevents = {
                push: (...e) => push(e)
            };
            addEventListener(doc, "readystatechange", processReadyStateChange);
            processReadyStateChange();
        }
    })(document);
})();`,
  QWIK_LOADER_OPTIMIZE_MINIFIED =
    '((e,t)=>{const n="__q_context__",o=window,a=new Set,i=t=>e.querySelectorAll(t),r=(e,t,n=t.type)=>{i("[on"+e+"\\\\:"+n+"]").forEach((o=>c(o,e,t,n)))},s=(e,t)=>new CustomEvent(e,{detail:t}),l=(t,n)=>(t=t.closest("[q\\\\:container]"),new URL(n,new URL(t.getAttribute("q:base"),e.baseURI))),c=async(t,o,a,i=a.type)=>{const r="on"+o+":"+i;t.hasAttribute("preventdefault:"+i)&&a.preventDefault();const s=t._qc_,c=null==s?void 0:s.li.filter((e=>e[0]===r));if(c&&c.length>0){for(const e of c)await e[1].getFn([t,a],(()=>t.isConnected))(a,t);return}const u=t.getAttribute(r);if(u)for(const o of u.split("\\n")){const i=l(t,o),r=d(i),s=performance.now(),c=b(await import(i.href.split("#")[0]))[r],u=e[n];if(t.isConnected)try{e[n]=[t,a,i],f("qsymbol",{symbol:r,element:t,reqTime:s}),await c(a,t)}finally{e[n]=u}}},f=(t,n)=>{e.dispatchEvent(s(t,n))},b=e=>Object.values(e).find(u)||e,u=e=>"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag],d=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",p=e=>e.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),v=async e=>{let t=p(e.type),n=e.target;for(r("-document",e,t);n&&n.getAttribute;)await c(n,"",e,t),n=e.bubbles&&!0!==e.cancelBubble?n.parentElement:null},w=e=>{r("-window",e,p(e.type))},y=()=>{var n;const r=e.readyState;if(!t&&("interactive"==r||"complete"==r)&&(t=1,f("qinit"),(null!=(n=o.requestIdleCallback)?n:o.setTimeout).bind(o)((()=>f("qidle"))),a.has("qvisible"))){const e=i("[on\\\\:qvisible]"),t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),c(n.target,"",s("qvisible",n)))}));e.forEach((e=>t.observe(e)))}},q=(e,t,n,o=!1)=>e.addEventListener(t,n,{capture:o}),g=t=>{for(const n of t)a.has(n)||(q(e,n,v,!0),q(o,n,w),a.add(n))};if(!e.qR){const t=o.qwikevents;Array.isArray(t)&&g(t),o.qwikevents={push:(...e)=>g(e)},q(e,"readystatechange",y),y()}})(document);',
  QWIK_LOADER_OPTIMIZE_DEBUG = `(() => {
    ((doc, hasInitialized) => {
        const win = window;
        const events = new Set;
        const querySelectorAll = query => doc.querySelectorAll(query);
        const broadcast = (infix, ev, type = ev.type) => {
            querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, ev, type)));
        };
        const createEvent = (eventName, detail) => new CustomEvent(eventName, {
            detail: detail
        });
        const qrlResolver = (element, qrl) => {
            element = element.closest("[q\\\\:container]");
            return new URL(qrl, new URL(element.getAttribute("q:base"), doc.baseURI));
        };
        const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {
            const attrName = "on" + onPrefix + ":" + eventName;
            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();
            const ctx = element._qc_;
            const qrls = null == ctx ? void 0 : ctx.li.filter((li => li[0] === attrName));
            if (qrls && qrls.length > 0) {
                for (const q of qrls) {
                    await q[1].getFn([ element, ev ], (() => element.isConnected))(ev, element);
                }
                return;
            }
            const attrValue = element.getAttribute(attrName);
            if (attrValue) {
                for (const qrl of attrValue.split("\\n")) {
                    const url = qrlResolver(element, qrl);
                    const symbolName = getSymbolName(url);
                    const reqTime = performance.now();
                    const handler = findModule(await import(url.href.split("#")[0]))[symbolName];
                    const previousCtx = doc.__q_context__;
                    if (element.isConnected) {
                        try {
                            doc.__q_context__ = [ element, ev, url ];
                            emitEvent("qsymbol", {
                                symbol: symbolName,
                                element: element,
                                reqTime: reqTime
                            });
                            await handler(ev, element);
                        } finally {
                            doc.__q_context__ = previousCtx;
                        }
                    }
                }
            }
        };
        const emitEvent = (eventName, detail) => {
            doc.dispatchEvent(createEvent(eventName, detail));
        };
        const findModule = module => Object.values(module).find(isModule) || module;
        const isModule = module => "object" == typeof module && module && "Module" === module[Symbol.toStringTag];
        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";
        const camelToKebab = str => str.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));
        const processDocumentEvent = async ev => {
            let type = camelToKebab(ev.type);
            let element = ev.target;
            broadcast("-document", ev, type);
            while (element && element.getAttribute) {
                await dispatch(element, "", ev, type);
                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;
            }
        };
        const processWindowEvent = ev => {
            broadcast("-window", ev, camelToKebab(ev.type));
        };
        const processReadyStateChange = () => {
            var _a;
            const readyState = doc.readyState;
            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {
                hasInitialized = 1;
                emitEvent("qinit");
                (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)((() => emitEvent("qidle")));
                if (events.has("qvisible")) {
                    const results = querySelectorAll("[on\\\\:qvisible]");
                    const observer = new IntersectionObserver((entries => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                observer.unobserve(entry.target);
                                dispatch(entry.target, "", createEvent("qvisible", entry));
                            }
                        }
                    }));
                    results.forEach((el => observer.observe(el)));
                }
            }
        };
        const addEventListener = (el, eventName, handler, capture = !1) => el.addEventListener(eventName, handler, {
            capture: capture
        });
        const push = eventNames => {
            for (const eventName of eventNames) {
                if (!events.has(eventName)) {
                    addEventListener(doc, eventName, processDocumentEvent, !0);
                    addEventListener(win, eventName, processWindowEvent);
                    events.add(eventName);
                }
            }
        };
        if (!doc.qR) {
            const qwikevents = win.qwikevents;
            Array.isArray(qwikevents) && push(qwikevents);
            win.qwikevents = {
                push: (...e) => push(e)
            };
            addEventListener(doc, "readystatechange", processReadyStateChange);
            processReadyStateChange();
        }
    })(document);
})();`;
function getQwikLoaderScript(e = {}) {
  return Array.isArray(e.events) && e.events.length > 0
    ? (e.debug
        ? QWIK_LOADER_OPTIMIZE_DEBUG
        : QWIK_LOADER_OPTIMIZE_MINIFIED
      ).replace("window.qEvents", JSON.stringify(e.events))
    : e.debug
    ? QWIK_LOADER_DEFAULT_DEBUG
    : QWIK_LOADER_DEFAULT_MINIFIED;
}
function getPrefetchResources(e, t, r) {
  if (!r) return [];
  const s = t.prefetchStrategy,
    i = getBuildBase(t);
  if (s !== null) {
    if (!s || !s.symbolsToPrefetch || s.symbolsToPrefetch === "auto")
      return getAutoPrefetch(e, r, i);
    if (typeof s.symbolsToPrefetch == "function")
      try {
        return s.symbolsToPrefetch({ manifest: r.manifest });
      } catch (n) {
        console.error("getPrefetchUrls, symbolsToPrefetch()", n);
      }
  }
  return [];
}
function getAutoPrefetch(e, t, r) {
  const s = [],
    i = e == null ? void 0 : e.listeners,
    n = e == null ? void 0 : e.objs,
    { mapper: a, manifest: o } = t,
    h = new Set();
  if (Array.isArray(i))
    for (const c in a)
      i.some((S) => S.qrl.getHash() === c) && addBundle(o, h, s, r, a[c][1]);
  if (Array.isArray(n)) {
    for (const c of n)
      if (isQrl(c)) {
        const m = c.getHash(),
          S = a[m];
        S && addBundle(o, h, s, r, S[0]);
      }
  }
  return s;
}
function addBundle(e, t, r, s, i) {
  const n = s + i;
  if (!t.has(n)) {
    t.add(n);
    const a = e.bundles[i];
    if (a) {
      const o = { url: n, imports: [] };
      if ((r.push(o), Array.isArray(a.imports)))
        for (const h of a.imports) addBundle(e, t, o.imports, s, h);
    }
  }
}
var isQrl = (e) => typeof e == "function" && typeof e.getSymbol == "function",
  qDev = globalThis.qDev === !0,
  EMPTY_ARRAY = [],
  EMPTY_OBJ = {};
qDev &&
  (Object.freeze(EMPTY_ARRAY),
  Object.freeze(EMPTY_OBJ),
  (Error.stackTraceLimit = 9999));
[
  "click",
  "dblclick",
  "contextmenu",
  "auxclick",
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerover",
  "pointerenter",
  "pointerleave",
  "pointerout",
  "pointercancel",
  "gotpointercapture",
  "lostpointercapture",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "wheel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "search",
  "invalid",
  "beforeinput",
  "select",
  "focusin",
  "focusout",
  "focus",
  "blur",
  "submit",
  "reset",
  "scroll",
].map((e) => `on${e.toLowerCase()}$`);
[
  "useWatch$",
  "useClientEffect$",
  "useEffect$",
  "component$",
  "useStyles$",
  "useStylesScoped$",
].map((e) => e.toLowerCase());
function getValidManifest(e) {
  if (
    e != null &&
    e.mapping != null &&
    typeof e.mapping == "object" &&
    e.symbols != null &&
    typeof e.symbols == "object" &&
    e.bundles != null &&
    typeof e.bundles == "object"
  )
    return e;
}
function workerFetchScript() {
  let i = `const w=new Worker(URL.createObjectURL(new Blob(['onmessage=(e)=>{Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})}'],{type:"text/javascript"})));`;
  return (
    (i += "w.postMessage(u.map(u=>new URL(u,origin)+''));"),
    (i += "w.onmessage=()=>{w.terminate()};"),
    i
  );
}
function prefetchUrlsEventScript(e) {
  const t = {
    bundles: flattenPrefetchResources(e).map((r) => r.split("/").pop()),
  };
  return `document.dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(
    t
  )}}))`;
}
function flattenPrefetchResources(e) {
  const t = [],
    r = (s) => {
      if (Array.isArray(s))
        for (const i of s) t.includes(i.url) || (t.push(i.url), r(i.imports));
    };
  return r(e), t;
}
function applyPrefetchImplementation(e, t) {
  const r = normalizePrefetchImplementation(
      e == null ? void 0 : e.implementation
    ),
    s = [];
  return (
    r.prefetchEvent === "always" && prefetchUrlsEvent(s, t),
    r.linkInsert === "html-append" && linkHtmlImplementation(s, t, r),
    r.linkInsert === "js-append"
      ? linkJsImplementation(s, t, r)
      : r.workerFetchInsert === "always" && workerFetchImplementation(s, t),
    s.length > 0 ? jsx(Fragment, { children: s }) : null
  );
}
function prefetchUrlsEvent(e, t) {
  e.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: prefetchUrlsEventScript(t),
    })
  );
}
function linkHtmlImplementation(e, t, r) {
  const s = flattenPrefetchResources(t),
    i = r.linkRel || "prefetch";
  for (const n of s) {
    const a = {};
    (a.href = n),
      (a.rel = i),
      (i === "prefetch" || i === "preload") &&
        n.endsWith(".js") &&
        (a.as = "script"),
      e.push(jsx("link", a, void 0));
  }
}
function linkJsImplementation(e, t, r) {
  const s = r.linkRel || "prefetch";
  let i = "";
  r.workerFetchInsert === "no-link-support" &&
    (i += "let supportsLinkRel = true;"),
    (i += `const u=${JSON.stringify(flattenPrefetchResources(t))};`),
    (i += "u.map((u,i)=>{"),
    (i += "const l=document.createElement('link');"),
    (i += 'l.setAttribute("href",u);'),
    (i += `l.setAttribute("rel","${s}");`),
    r.workerFetchInsert === "no-link-support" &&
      ((i += "if(i===0){"),
      (i += "try{"),
      (i += `supportsLinkRel=l.relList.supports("${s}");`),
      (i += "}catch(e){}"),
      (i += "}")),
    (i += "document.body.appendChild(l);"),
    (i += "});"),
    r.workerFetchInsert === "no-link-support" &&
      ((i += "if(!supportsLinkRel){"), (i += workerFetchScript()), (i += "}")),
    r.workerFetchInsert === "always" && (i += workerFetchScript()),
    e.push(jsx("script", { type: "module", dangerouslySetInnerHTML: i }));
}
function workerFetchImplementation(e, t) {
  let r = `const u=${JSON.stringify(flattenPrefetchResources(t))};`;
  (r += workerFetchScript()),
    e.push(jsx("script", { type: "module", dangerouslySetInnerHTML: r }));
}
function normalizePrefetchImplementation(e) {
  if (typeof e == "string") {
    switch (e) {
      case "link-prefetch-html":
        return (
          deprecatedWarning(e, "linkInsert"),
          {
            linkInsert: "html-append",
            linkRel: "prefetch",
            workerFetchInsert: null,
            prefetchEvent: null,
          }
        );
      case "link-prefetch":
        return (
          deprecatedWarning(e, "linkInsert"),
          {
            linkInsert: "js-append",
            linkRel: "prefetch",
            workerFetchInsert: "no-link-support",
            prefetchEvent: null,
          }
        );
      case "link-preload-html":
        return (
          deprecatedWarning(e, "linkInsert"),
          {
            linkInsert: "html-append",
            linkRel: "preload",
            workerFetchInsert: null,
            prefetchEvent: null,
          }
        );
      case "link-preload":
        return (
          deprecatedWarning(e, "linkInsert"),
          {
            linkInsert: "js-append",
            linkRel: "preload",
            workerFetchInsert: "no-link-support",
            prefetchEvent: null,
          }
        );
      case "link-modulepreload-html":
        return (
          deprecatedWarning(e, "linkInsert"),
          {
            linkInsert: "html-append",
            linkRel: "modulepreload",
            workerFetchInsert: null,
            prefetchEvent: null,
          }
        );
      case "link-modulepreload":
        return (
          deprecatedWarning(e, "linkInsert"),
          {
            linkInsert: "js-append",
            linkRel: "modulepreload",
            workerFetchInsert: "no-link-support",
            prefetchEvent: null,
          }
        );
    }
    return (
      deprecatedWarning(e, "workerFetchInsert"),
      {
        linkInsert: null,
        linkRel: null,
        workerFetchInsert: "always",
        prefetchEvent: null,
      }
    );
  }
  return e && typeof e == "object" ? e : PrefetchImplementationDefault;
}
var PrefetchImplementationDefault = {
  linkInsert: null,
  linkRel: null,
  workerFetchInsert: null,
  prefetchEvent: "always",
};
function deprecatedWarning(e, t) {
  console.warn(
    `The Prefetch Strategy Implementation "${e}" has been deprecated and will be removed in an upcoming release. Please update to use the "prefetchStrategy.implementation.${t}" interface.`
  );
}
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(e, t) {
  var A, L, F, M, D, V;
  let r = t.stream,
    s = 0,
    i = 0,
    n = 0,
    a = 0;
  const o =
      (L = (A = t.streaming) == null ? void 0 : A.inOrder) != null
        ? L
        : { strategy: "auto", maximunInitialChunk: 5e4, maximunChunk: 3e4 },
    h = (F = t.containerTagName) != null ? F : "html",
    c = (M = t.containerAttributes) != null ? M : {};
  let m = "";
  const S = r,
    u = createTimer();
  function v() {
    m && (S.write(m), (m = ""), (s = 0), n++, n === 1 && (a = u()));
  }
  function g(T) {
    (s += T.length), (i += T.length), (m += T);
  }
  switch (o.strategy) {
    case "disabled":
      r = { write: g };
      break;
    case "direct":
      r = S;
      break;
    case "auto":
      let T = 0,
        k = !1;
      const C = (D = o.maximunChunk) != null ? D : 0,
        P = (V = o.maximunInitialChunk) != null ? V : 0;
      r = {
        write(w) {
          w === "<!--qkssr-f-->"
            ? k || (k = !0)
            : w === "<!--qkssr-pu-->"
            ? T++
            : w === "<!--qkssr-po-->"
            ? T--
            : g(w),
            T === 0 && (k || s >= (n === 0 ? P : C)) && ((k = !1), v());
        },
      };
      break;
  }
  h === "html"
    ? r.write(DOCTYPE)
    : t.qwikLoader
    ? (t.qwikLoader.include === void 0 && (t.qwikLoader.include = "never"),
      t.qwikLoader.position === void 0 && (t.qwikLoader.position = "bottom"))
    : (t.qwikLoader = { include: "never" }),
    t.manifest ||
      console.warn(
        "Missing client manifest, loading symbols in the client might 404"
      );
  const y = getBuildBase(t),
    E = resolveManifest(t.manifest);
  await setServerPlatform(t, E);
  let l = null;
  const d = E == null ? void 0 : E.manifest.injections,
    p = d
      ? d.map((T) => {
          var k;
          return jsx(T.tag, (k = T.attributes) != null ? k : EMPTY_OBJ);
        })
      : void 0,
    f = createTimer(),
    b = [];
  let x = 0,
    $ = 0;
  return (
    await renderSSR(e, {
      stream: r,
      containerTagName: h,
      containerAttributes: c,
      envData: t.envData,
      base: y,
      beforeContent: p,
      beforeClose: async (T, k) => {
        var z, B, Q;
        x = f();
        const C = createTimer();
        l = await _pauseFromContexts(T, k);
        const P = JSON.stringify(l.state, void 0, qDev ? "  " : void 0),
          w = [
            jsx("script", {
              type: "qwik/json",
              dangerouslySetInnerHTML: escapeText(P),
            }),
          ];
        if (t.prefetchStrategy !== null) {
          const G = getPrefetchResources(l, t, E);
          if (G.length > 0) {
            const U = applyPrefetchImplementation(t.prefetchStrategy, G);
            U && w.push(U);
          }
        }
        const R = !l || l.mode !== "static",
          I =
            (B = (z = t.qwikLoader) == null ? void 0 : z.include) != null
              ? B
              : "auto",
          q = I === "always" || (I === "auto" && R);
        if (q) {
          const G = getQwikLoaderScript({
            events: (Q = t.qwikLoader) == null ? void 0 : Q.events,
            debug: t.debug,
          });
          w.push(
            jsx("script", { id: "qwikloader", dangerouslySetInnerHTML: G })
          );
        }
        const N = new Set();
        l.listeners.forEach((G) => {
          N.add(JSON.stringify(G.eventName));
        });
        const O = Array.from(N);
        if (O.length > 0) {
          let G = `window.qwikevents.push(${O.join(", ")})`;
          q || (G = `window.qwikevents||=[];${G}`),
            w.push(jsx("script", { dangerouslySetInnerHTML: G }));
        }
        return (
          collectRenderSymbols(b, T), ($ = C()), jsx(Fragment, { children: w })
        );
      },
    }),
    v(),
    {
      prefetchResources: void 0,
      snapshotResult: l,
      flushes: n,
      manifest: E == null ? void 0 : E.manifest,
      size: i,
      timing: { render: x, snapshot: $, firstFlush: a },
      _symbols: b,
    }
  );
}
function resolveManifest(e) {
  if (!!e) {
    if ("mapper" in e) return e;
    if (((e = getValidManifest(e)), e)) {
      const t = {};
      return (
        Object.entries(e.mapping).forEach(([r, s]) => {
          t[getSymbolHash(r)] = [r, s];
        }),
        { mapper: t, manifest: e }
      );
    }
  }
}
var escapeText = (e) => e.replace(/<(\/?script)/g, "\\x3C$1");
function collectRenderSymbols(e, t) {
  var r;
  for (const s of t) {
    const i = (r = s.$componentQrl$) == null ? void 0 : r.getSymbol();
    i && !e.includes(i) && e.push(i);
  }
}
const manifest = {
    symbols: {
      s_hA9UPaY8sNQ: {
        origin: "../node_modules/@builder.io/qwik-city/index.qwik.mjs",
        displayName: "Link_component_a_onClick",
        canonicalFilename: "s_ha9upay8snq",
        hash: "hA9UPaY8sNQ",
        ctxKind: "event",
        ctxName: "onClick$",
        captures: !0,
        parent: "s_mYsiJcA4IBc",
      },
      s_skxgNVWVOT8: {
        origin: "../node_modules/@builder.io/qwik-city/index.qwik.mjs",
        displayName: "Link_component_a_onMouseOver",
        canonicalFilename: "s_skxgnvwvot8",
        hash: "skxgNVWVOT8",
        ctxKind: "event",
        ctxName: "onMouseOver$",
        captures: !1,
        parent: "s_mYsiJcA4IBc",
      },
      s_uVE5iM9H73c: {
        origin: "../node_modules/@builder.io/qwik-city/index.qwik.mjs",
        displayName: "Link_component_a_onQVisible",
        canonicalFilename: "s_uve5im9h73c",
        hash: "uVE5iM9H73c",
        ctxKind: "event",
        ctxName: "onQVisible$",
        captures: !1,
        parent: "s_mYsiJcA4IBc",
      },
      s_AaAlzKH0KlQ: {
        origin: "../node_modules/@builder.io/qwik-city/index.qwik.mjs",
        displayName: "QwikCity_component_useWatch",
        canonicalFilename: "s_aaalzkh0klq",
        hash: "AaAlzKH0KlQ",
        ctxKind: "function",
        ctxName: "useWatch$",
        captures: !0,
        parent: "s_z1nvHyEppoI",
      },
      s_VNRJxDUu3FY: {
        origin: "../node_modules/qwik-lottie/lib/index.qwik.mjs",
        displayName: "QwikLottie_component_useClientEffect",
        canonicalFilename: "s_vnrjxduu3fy",
        hash: "VNRJxDUu3FY",
        ctxKind: "function",
        ctxName: "useClientEffect$",
        captures: !0,
        parent: "s_CTOsjDUban0",
      },
      s_CTOsjDUban0: {
        origin: "../node_modules/qwik-lottie/lib/index.qwik.mjs",
        displayName: "QwikLottie_component",
        canonicalFilename: "s_ctosjduban0",
        hash: "CTOsjDUban0",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_H6QrlimhpZM: {
        origin: "components/menu/menu.tsx",
        displayName: "menu_component",
        canonicalFilename: "s_h6qrlimhpzm",
        hash: "H6QrlimhpZM",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_IKqvySP21jk: {
        origin: "components/on-this-page/on-this-page.tsx",
        displayName: "on_this_page_component",
        canonicalFilename: "s_ikqvysp21jk",
        hash: "IKqvySP21jk",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_Qp8cYiCcSYY: {
        origin: "root.tsx",
        displayName: "root_component",
        canonicalFilename: "s_qp8cyiccsyy",
        hash: "Qp8cYiCcSYY",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_TPnltT6KZb4: {
        origin: "components/footer/footer.tsx",
        displayName: "footer_component",
        canonicalFilename: "s_tpnltt6kzb4",
        hash: "TPnltT6KZb4",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_Xe6TbyozvWc: {
        origin: "routes/docs/layout.tsx",
        displayName: "layout_component",
        canonicalFilename: "s_xe6tbyozvwc",
        hash: "Xe6TbyozvWc",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_bDzgF468T04: {
        origin: "components/header/header.tsx",
        displayName: "header_component",
        canonicalFilename: "s_bdzgf468t04",
        hash: "bDzgF468T04",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_g9mSmefdhPM: {
        origin: "components/router-head/router-head.tsx",
        displayName: "RouterHead_component",
        canonicalFilename: "s_g9msmefdhpm",
        hash: "g9mSmefdhPM",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_jA8xa0BlYRo: {
        origin: "routes/layout.tsx",
        displayName: "layout_component",
        canonicalFilename: "s_ja8xa0blyro",
        hash: "jA8xa0BlYRo",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_kinAxFmotTw: {
        origin: "routes/index.tsx",
        displayName: "routes_component",
        canonicalFilename: "s_kinaxfmottw",
        hash: "kinAxFmotTw",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_mYsiJcA4IBc: {
        origin: "../node_modules/@builder.io/qwik-city/index.qwik.mjs",
        displayName: "Link_component",
        canonicalFilename: "s_mysijca4ibc",
        hash: "mYsiJcA4IBc",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_nd8yk3KO22c: {
        origin: "../node_modules/@builder.io/qwik-city/index.qwik.mjs",
        displayName: "RouterOutlet_component",
        canonicalFilename: "s_nd8yk3ko22c",
        hash: "nd8yk3KO22c",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_z1nvHyEppoI: {
        origin: "../node_modules/@builder.io/qwik-city/index.qwik.mjs",
        displayName: "QwikCity_component",
        canonicalFilename: "s_z1nvhyeppoi",
        hash: "z1nvHyEppoI",
        ctxKind: "function",
        ctxName: "component$",
        captures: !1,
        parent: null,
      },
      s_0FKBfpkMNuY: {
        origin: "components/footer/footer.tsx",
        displayName: "footer_component_useStyles",
        canonicalFilename: "s_0fkbfpkmnuy",
        hash: "0FKBfpkMNuY",
        ctxKind: "function",
        ctxName: "useStyles$",
        captures: !1,
        parent: "s_TPnltT6KZb4",
      },
      s_Uhlbf9HjFFk: {
        origin: "components/on-this-page/on-this-page.tsx",
        displayName: "on_this_page_component_useStyles",
        canonicalFilename: "s_uhlbf9hjffk",
        hash: "Uhlbf9HjFFk",
        ctxKind: "function",
        ctxName: "useStyles$",
        captures: !1,
        parent: "s_IKqvySP21jk",
      },
      s_WvavldV6FCE: {
        origin: "components/header/header.tsx",
        displayName: "header_component_useStyles",
        canonicalFilename: "s_wvavldv6fce",
        hash: "WvavldV6FCE",
        ctxKind: "function",
        ctxName: "useStyles$",
        captures: !1,
        parent: "s_bDzgF468T04",
      },
      s_ZrG0y5LuqAA: {
        origin: "components/menu/menu.tsx",
        displayName: "menu_component_useStyles",
        canonicalFilename: "s_zrg0y5luqaa",
        hash: "ZrG0y5LuqAA",
        ctxKind: "function",
        ctxName: "useStyles$",
        captures: !1,
        parent: "s_H6QrlimhpZM",
      },
      s_k3fdbEzYwTM: {
        origin: "routes/docs/layout.tsx",
        displayName: "layout_component_useStyles",
        canonicalFilename: "s_k3fdbezywtm",
        hash: "k3fdbEzYwTM",
        ctxKind: "function",
        ctxName: "useStyles$",
        captures: !1,
        parent: "s_Xe6TbyozvWc",
      },
      s_ub59PxeUkKA: {
        origin: "../node_modules/qwik-lottie/lib/index.qwik.mjs",
        displayName: "QwikLottie_component_loadAnimation",
        canonicalFilename: "s_ub59pxeukka",
        hash: "ub59PxeUkKA",
        ctxKind: "function",
        ctxName: "loadAnimation$",
        captures: !1,
        parent: "s_CTOsjDUban0",
      },
    },
    mapping: {
      s_hA9UPaY8sNQ: "q-b0d1e85d.js",
      s_skxgNVWVOT8: "q-b0d1e85d.js",
      s_uVE5iM9H73c: "q-b0d1e85d.js",
      s_AaAlzKH0KlQ: "q-0ad1561f.js",
      s_VNRJxDUu3FY: "q-66100b7e.js",
      s_CTOsjDUban0: "q-66100b7e.js",
      s_H6QrlimhpZM: "q-1f781c53.js",
      s_IKqvySP21jk: "q-8c405135.js",
      s_Qp8cYiCcSYY: "q-8b12705c.js",
      s_TPnltT6KZb4: "q-0ce14fe9.js",
      s_Xe6TbyozvWc: "q-f832f957.js",
      s_bDzgF468T04: "q-eeb9388b.js",
      s_g9mSmefdhPM: "q-216400bf.js",
      s_jA8xa0BlYRo: "q-f832f957.js",
      s_kinAxFmotTw: "q-68ec60cf.js",
      s_mYsiJcA4IBc: "q-b0d1e85d.js",
      s_nd8yk3KO22c: "q-d2a94832.js",
      s_z1nvHyEppoI: "q-0ad1561f.js",
      s_0FKBfpkMNuY: "q-0ce14fe9.js",
      s_Uhlbf9HjFFk: "q-8c405135.js",
      s_WvavldV6FCE: "q-eeb9388b.js",
      s_ZrG0y5LuqAA: "q-1f781c53.js",
      s_k3fdbEzYwTM: "q-f832f957.js",
      s_ub59PxeUkKA: "q-66100b7e.js",
    },
    bundles: {
      "q-0ad1561f.js": {
        size: 1489,
        imports: ["q-8b12705c.js", "q-b2df5566.js"],
        dynamicImports: ["q-cdf979a8.js"],
        origins: [
          "@builder.io/qwik/build",
          "src/entry_QwikCity.js",
          "src/s_aaalzkh0klq.js",
          "src/s_z1nvhyeppoi.js",
        ],
        symbols: ["s_AaAlzKH0KlQ", "s_z1nvHyEppoI"],
      },
      "q-0ce14fe9.js": {
        size: 1174,
        imports: ["q-b2df5566.js"],
        origins: [
          "src/components/footer/footer.css?used&inline",
          "src/entry_footer.js",
          "src/s_0fkbfpkmnuy.js",
          "src/s_tpnltt6kzb4.js",
        ],
        symbols: ["s_0FKBfpkMNuY", "s_TPnltT6KZb4"],
      },
      "q-143c7194.js": {
        size: 2180,
        origins: [
          "node_modules/@builder.io/qwik-city/service-worker.mjs",
          "src/routes/service-worker.js",
        ],
      },
      "q-150dc3fd.js": {
        size: 1422,
        imports: ["q-b2df5566.js"],
        origins: ["src/routes/docs/getting-started/index.md"],
      },
      "q-1f781c53.js": {
        size: 877,
        imports: ["q-8b12705c.js", "q-b2df5566.js"],
        origins: [
          "src/components/menu/menu.css?used&inline",
          "src/entry_menu.js",
          "src/s_h6qrlimhpzm.js",
          "src/s_zrg0y5luqaa.js",
        ],
        symbols: ["s_H6QrlimhpZM", "s_ZrG0y5LuqAA"],
      },
      "q-216400bf.js": {
        size: 1022,
        imports: ["q-8b12705c.js", "q-b2df5566.js"],
        origins: ["src/entry_RouterHead.js", "src/s_g9msmefdhpm.js"],
        symbols: ["s_g9mSmefdhPM"],
      },
      "q-36ede21c.js": {
        size: 216,
        imports: ["q-b2df5566.js"],
        dynamicImports: ["q-f832f957.js"],
        origins: ["src/routes/docs/layout.js"],
      },
      "q-3b47cbec.js": { size: 58, imports: ["q-b2df5566.js"] },
      "q-44814418.js": {
        size: 158,
        imports: ["q-b2df5566.js"],
        dynamicImports: ["q-f832f957.js"],
        origins: ["src/routes/layout.js"],
      },
      "q-66100b7e.js": {
        size: 906,
        imports: ["q-68ec60cf.js", "q-b2df5566.js"],
        origins: [
          "src/entry_QwikLottie.js",
          "src/s_ctosjduban0.js",
          "src/s_ub59pxeukka.js",
          "src/s_vnrjxduu3fy.js",
        ],
        symbols: ["s_CTOsjDUban0", "s_ub59PxeUkKA", "s_VNRJxDUu3FY"],
      },
      "q-67950cf1.js": {
        size: 1658,
        imports: ["q-b2df5566.js"],
        origins: ["src/routes/about-us/index.md"],
      },
      "q-68ec60cf.js": {
        size: 281491,
        imports: ["q-b2df5566.js"],
        dynamicImports: ["q-66100b7e.js"],
        origins: [
          "node_modules/qwik-lottie/lib/index.qwik.mjs",
          "src/entry_routes.js",
          "src/s_kinaxfmottw.js",
        ],
        symbols: ["s_kinAxFmotTw"],
      },
      "q-799d53f4.js": { size: 640, origins: ["src/routes/docs/menu.md"] },
      "q-86cf98e6.js": {
        size: 128,
        imports: ["q-b2df5566.js"],
        dynamicImports: ["q-143c7194.js"],
        origins: ["@qwik-city-entries"],
      },
      "q-8b12705c.js": {
        size: 4454,
        imports: ["q-b2df5566.js"],
        dynamicImports: [
          "q-0ad1561f.js",
          "q-216400bf.js",
          "q-b0d1e85d.js",
          "q-cdf979a8.js",
          "q-d2a94832.js",
        ],
        origins: [
          "node_modules/@builder.io/qwik-city/index.qwik.mjs",
          "src/components/router-head/router-head.js",
          "src/entry_root.js",
          "src/s_qp8cyiccsyy.js",
        ],
        symbols: ["s_Qp8cYiCcSYY"],
      },
      "q-8c405135.js": {
        size: 1622,
        imports: ["q-8b12705c.js", "q-b2df5566.js"],
        origins: [
          "src/components/on-this-page/on-this-page.css?used&inline",
          "src/entry_on_this_page.js",
          "src/s_ikqvysp21jk.js",
          "src/s_uhlbf9hjffk.js",
        ],
        symbols: ["s_IKqvySP21jk", "s_Uhlbf9HjFFk"],
      },
      "q-b0d1e85d.js": {
        size: 891,
        imports: ["q-8b12705c.js", "q-b2df5566.js"],
        origins: [
          "src/entry_Link.js",
          "src/s_ha9upay8snq.js",
          "src/s_mysijca4ibc.js",
          "src/s_skxgnvwvot8.js",
          "src/s_uve5im9h73c.js",
        ],
        symbols: [
          "s_hA9UPaY8sNQ",
          "s_mYsiJcA4IBc",
          "s_skxgNVWVOT8",
          "s_uVE5iM9H73c",
        ],
      },
      "q-b2df5566.js": {
        size: 37953,
        dynamicImports: ["q-8b12705c.js"],
        origins: [
          "\0vite/preload-helper",
          "node_modules/@builder.io/qwik/core.min.mjs",
          "src/global.css",
          "src/root.js",
        ],
      },
      "q-c6057980.js": {
        size: 1709,
        imports: ["q-b2df5566.js"],
        origins: ["src/routes/docs/advanced/index.md"],
      },
      "q-cdf979a8.js": {
        size: 805,
        imports: ["q-b2df5566.js"],
        dynamicImports: [
          "q-150dc3fd.js",
          "q-36ede21c.js",
          "q-44814418.js",
          "q-67950cf1.js",
          "q-799d53f4.js",
          "q-86cf98e6.js",
          "q-c6057980.js",
          "q-d6bfb140.js",
          "q-f8d11d8c.js",
        ],
        origins: ["@qwik-city-plan"],
      },
      "q-d2a94832.js": {
        size: 269,
        imports: ["q-8b12705c.js", "q-b2df5566.js"],
        origins: ["src/entry_RouterOutlet.js", "src/s_nd8yk3ko22c.js"],
        symbols: ["s_nd8yk3KO22c"],
      },
      "q-d6bfb140.js": {
        size: 217,
        imports: ["q-b2df5566.js"],
        dynamicImports: ["q-68ec60cf.js"],
        origins: ["src/routes/index.js"],
      },
      "q-eeb9388b.js": {
        size: 2706,
        imports: ["q-8b12705c.js", "q-b2df5566.js"],
        origins: [
          "src/components/header/header.css?used&inline",
          "src/components/icons/qwik.js",
          "src/entry_header.js",
          "src/s_bdzgf468t04.js",
          "src/s_wvavldv6fce.js",
        ],
        symbols: ["s_bDzgF468T04", "s_WvavldV6FCE"],
      },
      "q-f832f957.js": {
        size: 1097,
        imports: ["q-b2df5566.js"],
        dynamicImports: [
          "q-0ce14fe9.js",
          "q-1f781c53.js",
          "q-8c405135.js",
          "q-eeb9388b.js",
        ],
        origins: [
          "src/components/footer/footer.js",
          "src/components/header/header.js",
          "src/components/menu/menu.js",
          "src/components/on-this-page/on-this-page.js",
          "src/entry_layout.js",
          "src/routes/docs/docs.css?used",
          "src/s_ja8xa0blyro.js",
          "src/s_k3fdbezywtm.js",
          "src/s_xe6tbyozvwc.js",
        ],
        symbols: ["s_jA8xa0BlYRo", "s_k3fdbEzYwTM", "s_Xe6TbyozvWc"],
      },
      "q-f8d11d8c.js": {
        size: 2217,
        imports: ["q-b2df5566.js"],
        origins: ["src/routes/docs/index.md"],
      },
    },
    injections: [
      {
        tag: "link",
        location: "head",
        attributes: { rel: "stylesheet", href: "/build/q-7bd275bc.css" },
      },
      {
        tag: "link",
        location: "head",
        attributes: { rel: "stylesheet", href: "/build/q-d3e86d55.css" },
      },
    ],
    version: "1",
    options: {
      target: "client",
      buildMode: "production",
      forceFullBuild: !0,
      entryStrategy: { type: "smart" },
    },
    platform: {
      qwik: "0.10.0",
      vite: "",
      rollup: "2.78.1",
      env: "node",
      os: "darwin",
      node: "18.3.0",
    },
  },
  RouterHead = componentQrl(
    inlinedQrl(() => {
      const e = useDocumentHead(),
        t = useLocation();
      return jsx(Fragment, {
        children: [
          jsx("title", { children: _wrapSignal(e, "title") }),
          jsx("link", {
            rel: "canonical",
            get href() {
              return t.href;
            },
            [_IMMUTABLE]: { href: _wrapSignal(t, "href") },
          }),
          jsx("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          }),
          jsx("link", {
            rel: "icon",
            type: "image/svg+xml",
            href: "/favicon.svg",
          }),
          jsx("link", {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          }),
          jsx("link", {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "",
          }),
          jsx("link", {
            href: "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
            rel: "stylesheet",
          }),
          jsx("meta", { property: "og:site_name", content: "Qwik" }),
          jsx("meta", { name: "twitter:site", content: "@QwikDev" }),
          jsx("meta", { name: "twitter:title", content: "Qwik" }),
          e.meta.map((r) => jsx("meta", { ...r })),
          e.links.map((r) => jsx("link", { ...r })),
          e.styles.map((r) =>
            jsx("style", {
              ...r.props,
              get dangerouslySetInnerHTML() {
                return r.style;
              },
              [_IMMUTABLE]: {
                dangerouslySetInnerHTML: _wrapSignal(r, "style"),
              },
            })
          ),
        ],
      });
    }, "s_g9mSmefdhPM")
  ),
  global$1 = "",
  Root = componentQrl(
    inlinedQrl(
      () =>
        jsx(QwikCity, {
          children: [
            jsx("head", {
              children: [
                jsx("meta", { charSet: "utf-8" }),
                jsx(RouterHead, {}),
              ],
            }),
            jsx("body", {
              lang: "en",
              children: [jsx(RouterOutlet, {}), jsx(ServiceWorkerRegister, {})],
            }),
          ],
        }),
      "s_Qp8cYiCcSYY"
    )
  );
var __defProp = Object.defineProperty,
  __defProps = Object.defineProperties,
  __getOwnPropDescs = Object.getOwnPropertyDescriptors,
  __getOwnPropSymbols = Object.getOwnPropertySymbols,
  __hasOwnProp = Object.prototype.hasOwnProperty,
  __propIsEnum = Object.prototype.propertyIsEnumerable,
  __defNormalProp = (e, t, r) =>
    t in e
      ? __defProp(e, t, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: r,
        })
      : (e[t] = r),
  __spreadValues = (e, t) => {
    for (var r in t || (t = {}))
      __hasOwnProp.call(t, r) && __defNormalProp(e, r, t[r]);
    if (__getOwnPropSymbols)
      for (var r of __getOwnPropSymbols(t))
        __propIsEnum.call(t, r) && __defNormalProp(e, r, t[r]);
    return e;
  },
  __spreadProps = (e, t) => __defProps(e, __getOwnPropDescs(t));
function render(e) {
  return renderToStream(
    jsx(Root, {}),
    __spreadProps(__spreadValues({ manifest }, e), {
      containerAttributes: { lang: "en" },
      prefetchStrategy: {
        implementation: {
          linkInsert: null,
          workerFetchInsert: null,
          prefetchEvent: "always",
        },
      },
    })
  );
}
const qwikCityHandler = qwikCity(render);
export { qwikCityHandler as default };
