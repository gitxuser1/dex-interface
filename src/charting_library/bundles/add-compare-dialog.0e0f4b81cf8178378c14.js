(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [731],
  {
    67891: function (e, t) {
      var n, o, r;
      (o = [t]),
        void 0 ===
          (r =
            "function" ==
            typeof (n = function (e) {
              "use strict";
              function t(e) {
                if (Array.isArray(e)) {
                  for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                  return n;
                }
                return Array.from(e);
              }
              Object.defineProperty(e, "__esModule", { value: !0 });
              var n = !1;
              if ("undefined" != typeof window) {
                var o = {
                  get passive() {
                    n = !0;
                  },
                };
                window.addEventListener("testPassive", null, o), window.removeEventListener("testPassive", null, o);
              }
              var r =
                  "undefined" != typeof window &&
                  window.navigator &&
                  window.navigator.platform &&
                  /iP(ad|hone|od)/.test(window.navigator.platform),
                a = [],
                l = !1,
                i = -1,
                c = void 0,
                s = void 0,
                d = function (e) {
                  return a.some(function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e));
                  });
                },
                u = function (e) {
                  var t = e || window.event;
                  return !!d(t.target) || 1 < t.touches.length || (t.preventDefault && t.preventDefault(), !1);
                },
                m = function () {
                  setTimeout(function () {
                    void 0 !== s && ((document.body.style.paddingRight = s), (s = void 0)),
                      void 0 !== c && ((document.body.style.overflow = c), (c = void 0));
                  });
                };
              (e.disableBodyScroll = function (e, o) {
                if (r) {
                  if (!e)
                    return void console.error(
                      "disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices."
                    );
                  if (
                    e &&
                    !a.some(function (t) {
                      return t.targetElement === e;
                    })
                  ) {
                    var m = { targetElement: e, options: o || {} };
                    (a = [].concat(t(a), [m])),
                      (e.ontouchstart = function (e) {
                        1 === e.targetTouches.length && (i = e.targetTouches[0].clientY);
                      }),
                      (e.ontouchmove = function (t) {
                        var n, o, r, a;
                        1 === t.targetTouches.length &&
                          ((o = e),
                          (a = (n = t).targetTouches[0].clientY - i),
                          !d(n.target) &&
                            ((o && 0 === o.scrollTop && 0 < a) ||
                            ((r = o) && r.scrollHeight - r.scrollTop <= r.clientHeight && a < 0)
                              ? u(n)
                              : n.stopPropagation()));
                      }),
                      l || (document.addEventListener("touchmove", u, n ? { passive: !1 } : void 0), (l = !0));
                  }
                } else {
                  (p = o),
                    setTimeout(function () {
                      if (void 0 === s) {
                        var e = !!p && !0 === p.reserveScrollBarGap,
                          t = window.innerWidth - document.documentElement.clientWidth;
                        e &&
                          0 < t &&
                          ((s = document.body.style.paddingRight), (document.body.style.paddingRight = t + "px"));
                      }
                      void 0 === c && ((c = document.body.style.overflow), (document.body.style.overflow = "hidden"));
                    });
                  var h = { targetElement: e, options: o || {} };
                  a = [].concat(t(a), [h]);
                }
                var p;
              }),
                (e.clearAllBodyScrollLocks = function () {
                  r
                    ? (a.forEach(function (e) {
                        (e.targetElement.ontouchstart = null), (e.targetElement.ontouchmove = null);
                      }),
                      l && (document.removeEventListener("touchmove", u, n ? { passive: !1 } : void 0), (l = !1)),
                      (a = []),
                      (i = -1))
                    : (m(), (a = []));
                }),
                (e.enableBodyScroll = function (e) {
                  if (r) {
                    if (!e)
                      return void console.error(
                        "enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices."
                      );
                    (e.ontouchstart = null),
                      (e.ontouchmove = null),
                      (a = a.filter(function (t) {
                        return t.targetElement !== e;
                      })),
                      l &&
                        0 === a.length &&
                        (document.removeEventListener("touchmove", u, n ? { passive: !1 } : void 0), (l = !1));
                  } else
                    1 === a.length && a[0].targetElement === e
                      ? (m(), (a = []))
                      : (a = a.filter(function (t) {
                          return t.targetElement !== e;
                        }));
                });
            })
              ? n.apply(t, o)
              : n) || (e.exports = r);
    },
    58644: (e) => {
      e.exports = {
        wrapper: "wrapper-2eXD4rIf",
        input: "input-2eXD4rIf",
        box: "box-2eXD4rIf",
        icon: "icon-2eXD4rIf",
        noOutline: "noOutline-2eXD4rIf",
        "intent-danger": "intent-danger-2eXD4rIf",
        check: "check-2eXD4rIf",
        dot: "dot-2eXD4rIf",
      };
    },
    14073: (e) => {
      e.exports = {
        button: "button-3vkvsUbb",
        bordersVisible: "bordersVisible-3vkvsUbb",
        selected: "selected-3vkvsUbb",
      };
    },
    84856: (e) => {
      e.exports = { footer: "footer-3r-9t_XG" };
    },
    86598: (e) => {
      e.exports = { wrap: "wrap-38TyPnxL", header: "header-38TyPnxL", item: "item-38TyPnxL" };
    },
    97617: (e) => {
      e.exports = { label: "label-AT0tDw0n" };
    },
    32526: (e) => {
      e.exports = {
        scrollable: "scrollable-1zurvWNw",
        spinnerWrap: "spinnerWrap-1zurvWNw",
        item: "item-1zurvWNw",
        heading: "heading-1zurvWNw",
        checkboxWrap: "checkboxWrap-1zurvWNw",
        checkbox: "checkbox-1zurvWNw",
        emptyState: "emptyState-1zurvWNw",
        image: "image-1zurvWNw",
        text: "text-1zurvWNw",
      };
    },
    32087: (e) => {
      e.exports = { dialog: "dialog-1o8lbzhQ", tablet: "tablet-1o8lbzhQ" };
    },
    64526: (e) => {
      e.exports = {
        wrap: "wrap-164vy-kj",
        positionBottom: "positionBottom-164vy-kj",
        backdrop: "backdrop-164vy-kj",
        drawer: "drawer-164vy-kj",
        positionLeft: "positionLeft-164vy-kj",
      };
    },
    66549: (e) => {
      e.exports = {
        "tablet-small-breakpoint": "screen and (max-width: 428px)",
        item: "item-2IihgTnv",
        hovered: "hovered-2IihgTnv",
        isDisabled: "isDisabled-2IihgTnv",
        isActive: "isActive-2IihgTnv",
        shortcut: "shortcut-2IihgTnv",
        toolbox: "toolbox-2IihgTnv",
        withIcon: "withIcon-2IihgTnv",
        icon: "icon-2IihgTnv",
        labelRow: "labelRow-2IihgTnv",
        label: "label-2IihgTnv",
        showOnHover: "showOnHover-2IihgTnv",
      };
    },
    53400: (e, t, n) => {
      "use strict";
      n.d(t, { CheckboxInput: () => s });
      var o = n(67294),
        r = n(94184),
        a = n(49775),
        l = n(44805),
        i = n(58644),
        c = n.n(i);
      function s(e) {
        const t = r(c().box, c()["intent-" + e.intent], {
            [c().check]: !Boolean(e.indeterminate),
            [c().dot]: Boolean(e.indeterminate),
            [c().noOutline]: -1 === e.tabIndex,
          }),
          n = r(c().wrapper, e.className);
        return o.createElement(
          "span",
          { className: n, title: e.title },
          o.createElement("input", {
            id: e.id,
            tabIndex: e.tabIndex,
            className: c().input,
            type: "checkbox",
            name: e.name,
            checked: e.checked,
            disabled: e.disabled,
            value: e.value,
            autoFocus: e.autoFocus,
            role: e.role,
            onChange: function () {
              e.onChange && e.onChange(e.value);
            },
            ref: e.reference,
          }),
          o.createElement("span", { className: t }, o.createElement(a.Icon, { icon: l, className: c().icon }))
        );
      }
    },
    79653: (e, t, n) => {
      "use strict";
      n.d(t, { SymbolSearchDialogFooter: () => i });
      var o = n(67294),
        r = n(94184),
        a = n.n(r),
        l = n(84856);
      function i(e) {
        const { className: t, children: n } = e;
        return o.createElement("div", { className: a()(l.footer, t) }, n);
      }
    },
    42857: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, { getCompareDialogRenderer: () => ce });
      var o = n(67294),
        r = n(79881),
        a = n(96404),
        l = n(27490),
        i = n(20480),
        c = n(94184),
        s = n.n(c),
        d = n(5383),
        u = n.n(d),
        m = n(16282),
        h = n(49775),
        p = n(73991),
        v = n(27278),
        f = n(25659),
        b = n(71577),
        g = n(14829),
        w = n(54324),
        S = n(311);
      const C = o.createContext(null);
      var x = n(11086),
        y = n(86615);
      const E = o.createContext(null);
      var I = n(95860),
        k = n(57374),
        D = n(94004),
        M = n(14073);
      function N(e) {
        const {
          theme: t = M,
          children: n,
          onClick: r,
          isSelected: a,
          areBordersVisible: l,
          isItemSelected: i,
          className: c,
          value: d,
          name: u,
        } = e;
        return o.createElement(
          "button",
          {
            type: "button",
            className: s()(c, t.button, a && t.selected, l && !a && !i && t.bordersVisible),
            name: u,
            value: d,
            onClick: r,
          },
          n
        );
      }
      function T(e) {
        const { value: t, onClick: n, ...r } = e,
          a = (0, o.useCallback)((e) => n(t, e), [t, n]);
        return o.createElement(N, { ...r, value: String(t), onClick: a });
      }
      var _ = n(40488),
        O = n(86598);
      const P = {
        sameScale: (0, r.t)("Same % scale"),
        newPriceScale: (0, r.t)("New price scale"),
        newPane: (0, r.t)("New pane"),
      };
      function z(e) {
        const { fullSymbolName: t, isSelected: n, className: a } = e,
          { isMobile: l, searchRef: c, setMode: d } = (0, y.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          {
            compareModel: u,
            selectedCompareOption: m,
            setHoveredItemId: h,
            clearInput: p,
            allowExtendTimeScale: v,
          } = (0, y.useEnsuredContext)(C),
          { callback: f } = (0, y.useEnsuredContext)(E);
        return l
          ? o.createElement(
              D.DrawerManager,
              null,
              o.createElement(
                k.Drawer,
                { position: "Bottom", onClose: b.bind(null, !1) },
                o.createElement("div", { className: O.header }, (0, r.t)("Add to")),
                o.createElement(I.PopupMenuItem, {
                  className: O.item,
                  onClick: g,
                  onClickArg: _.CompareOption.SameScale,
                  label: P.sameScale,
                }),
                o.createElement(I.PopupMenuItem, {
                  className: O.item,
                  onClick: g,
                  onClickArg: _.CompareOption.NewPriceScale,
                  label: P.newPriceScale,
                }),
                o.createElement(I.PopupMenuItem, {
                  className: O.item,
                  onClick: g,
                  onClickArg: _.CompareOption.NewPane,
                  label: P.newPane,
                })
              )
            )
          : o.createElement(
              "div",
              { className: s()(O.wrap, a), "data-name": "compare-buttons-group" },
              o.createElement(
                T,
                {
                  onClick: g,
                  value: _.CompareOption.SameScale,
                  isItemSelected: Boolean(n),
                  isSelected: n && m === _.CompareOption.SameScale,
                },
                P.sameScale
              ),
              o.createElement(
                T,
                {
                  onClick: g,
                  value: _.CompareOption.NewPriceScale,
                  isItemSelected: Boolean(n),
                  isSelected: n && m === _.CompareOption.NewPriceScale,
                },
                P.newPriceScale
              ),
              o.createElement(
                T,
                {
                  onClick: g,
                  value: _.CompareOption.NewPane,
                  isItemSelected: Boolean(n),
                  isSelected: n && m === _.CompareOption.NewPane,
                },
                P.newPane
              )
            );
        function b(e) {
          l && f && f(), p && e && p(c, d);
        }
        function g(e, n) {
          if ((n.preventDefault(), u && t && void 0 !== e)) {
            (0, i.getSymbolSearchCompleteOverrideFunction)()(t).then((t) => {
              u.applyStudy(t, e, v), h(""), b(!0);
            });
          }
        }
      }
      function A(e) {
        const { isSelected: t, fullSymbolName: n, onExpandClick: r, actions: l, id: c, isOffset: s } = e,
          {
            isMobile: d,
            toggleExpand: u,
            searchSpreads: m,
            searchRef: h,
            setMode: p,
            mode: v,
          } = (0, y.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          {
            compareModel: f,
            hoveredItemId: b,
            setHoveredItemId: g,
            clearInput: I,
            allowExtendTimeScale: k,
          } = (0, y.useEnsuredContext)(C),
          [D, M] = (0, o.useState)(!1),
          N = (0, o.useRef)(null),
          T = (0, x.useAccurateHover)(N),
          O = (0, o.useMemo)(() => ({ callback: B }), [B]),
          P = !Boolean(r) && !Boolean(l),
          A = c === b;
        return o.createElement(
          E.Provider,
          { value: O },
          o.createElement(S.SymbolSearchDialogContentItem, {
            hideMarkedListFlag: "compare" === v,
            ...e,
            reference: N,
            onClick: function (t) {
              if (Boolean(r) && c && !s) return t.preventDefault(), void u(c);
              if (!D && d) return void M(!0);
              if (m && e.onClick) return void e.onClick(t);
              if ((a.mobiletouch ? A : !D) && n) {
                (0, i.getSymbolSearchCompleteOverrideFunction)()(n).then((e) => {
                  f.applyStudy(e, _.CompareOption.SameScale, k);
                }),
                  g(""),
                  I && I(h, p);
              }
              a.mobiletouch && !d && !A && c && g(c);
            },
            hoverComponent: (function () {
              if (!P) return !1;
              if (d) return D;
              if (a.mobiletouch) return A;
              return Boolean(T || t);
            })()
              ? z
              : void 0,
          })
        );
        function B() {
          M(!1);
        }
      }
      var B = n(58726),
        R = n(51170),
        L = n(12343),
        W = n(32526);
      function H(e) {
        const { handleListWidth: t } = (0, m.ensureNotNull)((0, o.useContext)(w.SymbolSearchItemsDialogContext)),
          { compareModel: n, selectedCompareIndex: a, selectedItemRef: l } = (0, m.ensureNotNull)((0, o.useContext)(C)),
          i = (0, v.useWatchedValueReadonly)({
            watchedValue: n.isDataReady(),
          }),
          c = (0, v.useWatchedValueReadonly)({ watchedValue: n.studies() }),
          d = (0, v.useWatchedValueReadonly)({ watchedValue: n.highlightedSymbol() }),
          x = (0, o.useMemo)(() => c.filter((e) => e.checked), [c]),
          y = (0, o.useMemo)(() => c.filter((e) => !e.checked), [c]);
        return (
          (0, o.useEffect)(
            () => (
              n.chartModel().dataSourceCollectionChanged().subscribe(n, n.handleSourcesChange),
              () => n.chartModel().dataSourceCollectionChanged().unsubscribe(n, n.handleSourcesChange)
            ),
            [n]
          ),
          o.createElement(
            u(),
            {
              onMeasure: function (e) {
                t(e.width);
              },
            },
            o.createElement(
              p.TouchScrollContainer,
              { className: W.scrollable },
              (function () {
                if (!i) return o.createElement("div", { className: W.spinnerWrap }, o.createElement(f.Spinner, null));
                if (!Boolean(x.length) && !Boolean(y.length)) {
                  const e = g.watchedTheme.value() === b.StdTheme.Dark ? R : B;
                  return o.createElement(
                    "div",
                    { className: W.emptyState },
                    o.createElement(h.Icon, { className: W.image, icon: e }),
                    o.createElement("div", { className: W.text }, (0, r.t)("No symbols here yet — why not add some?"))
                  );
                }
                return o.createElement(
                  o.Fragment,
                  null,
                  Boolean(x.length) &&
                    o.createElement(
                      o.Fragment,
                      null,
                      o.createElement("div", { className: W.heading }, (0, r.t)("Added symbols")),
                      x.map((e, t) =>
                        o.createElement(S.SymbolSearchDialogContentItem, {
                          "data-role": "added-symbol-item",
                          className: W.item,
                          key: e.id,
                          id: e.id,
                          title: e.title,
                          dangerousDescriptionHTML: e.description,
                          exchangeName: e.exchangeName,
                          marketType: e.marketType,
                          country: e.country,
                          providerId: e.providerId,
                          onClick: E.bind(null, e),
                          isHighlighted: e.id === d,
                          isSelected: I(e),
                          itemRef: I(e) ? l : void 0,
                          actions: o.createElement(
                            "div",
                            { className: W.checkboxWrap },
                            o.createElement(
                              N,
                              { className: W.checkbox, onClick: E.bind(null, e), isSelected: I(e) },
                              o.createElement(h.Icon, { icon: L })
                            )
                          ),
                        })
                      )
                    ),
                  Boolean(y.length) &&
                    o.createElement(
                      o.Fragment,
                      null,
                      o.createElement("div", { className: W.heading }, (0, r.t)("Recent symbols")),
                      y.map((e) =>
                        o.createElement(A, {
                          "data-role": "recent-symbol-item",
                          className: s()(W.item, e.id === d && W.highlighted),
                          key: e.id,
                          id: e.id,
                          title: e.title,
                          dangerousDescriptionHTML: e.description,
                          exchangeName: e.exchangeName,
                          marketType: e.marketType,
                          country: e.country,
                          providerId: e.providerId,
                          fullSymbolName: e.symbol,
                          isSelected: I(e),
                          itemRef: I(e) ? l : void 0,
                        })
                      )
                    )
                );
              })()
            )
          )
        );
        function E(e, t) {
          t.preventDefault(), n.removeStudy(e);
        }
        function I(e) {
          return c.indexOf(e) === a;
        }
      }
      var F = n(64222);
      class V extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._selectedItemRef = o.createRef()),
            (this._getContextValue = () => {
              const { compareModel: e } = this.props,
                {
                  selectedCompareOption: t,
                  selectedCompareIndex: n,
                  hoveredItemId: o,
                  allowExtendTimeScale: r,
                } = this.state;
              return {
                compareModel: e,
                selectedCompareOption: t,
                setSelectedCompareOption: this._setSelectedCompareOption,
                hoveredItemId: o,
                setHoveredItemId: this._setHoveredItemId,
                selectedCompareIndex: n,
                setSelectedCompareIndex: this._setSelectedCompareIndex,
                selectedItemRef: this._selectedItemRef,
                clearInput: this._clearInput,
                allowExtendTimeScale: r,
                toggleAllowExtendTimeScale: this._toggleAllowExtendTimeScale,
              };
            }),
            (this._clearInput = (e, t) => {
              e && e.current && ((e.current.value = ""), t("compare"));
            }),
            (this._setSelectedCompareOption = (e) => {
              this.setState({ selectedCompareOption: e });
            }),
            (this._setHoveredItemId = (e) => {
              this.setState({ hoveredItemId: e });
            }),
            (this._setSelectedCompareIndex = (e, t) => {
              this.setState({ selectedCompareIndex: e }, t);
            }),
            (this._toggleAllowExtendTimeScale = () => {
              const e = !this.state.allowExtendTimeScale;
              F.setValue("showAddSymbolDialog.extendCheckboxState", e), this.setState({ allowExtendTimeScale: e });
            }),
            (this.state = {
              selectedCompareOption: 0,
              selectedCompareIndex: -1,
              hoveredItemId: void 0,
              allowExtendTimeScale: Boolean(F.getBool("showAddSymbolDialog.extendCheckboxState")),
            });
        }
        render() {
          const { children: e } = this.props;
          return o.createElement(C.Provider, { value: this._getContextValue() }, e);
        }
      }
      var j = n(42998),
        U = n(93590),
        q = n(32087);
      const X = Object.keys(_.CompareOption).length / 2;
      function Q(e) {
        const {
            openedItems: t,
            searchRef: n,
            feedItems: r,
            selectedIndex: a,
            toggleExpand: l,
            onSearchComplete: i,
            mode: s,
            setMode: d,
            setSelectedIndex: u,
            isMobile: m,
            isTablet: h,
            onClose: p,
            upperCaseEnabled: f,
          } = (0, y.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          {
            compareModel: b,
            hoveredItemId: g,
            setHoveredItemId: S,
            selectedCompareOption: x,
            setSelectedCompareOption: E,
            selectedCompareIndex: I,
            setSelectedCompareIndex: k,
            selectedItemRef: D,
            clearInput: M,
            allowExtendTimeScale: N,
          } = (0, y.useEnsuredContext)(C),
          T = (0, v.useWatchedValueReadonly)({ watchedValue: b.studies() }),
          _ = r[a],
          O = "compare" === s;
        return (
          (0, o.useEffect)(() => {
            g && S(""), I && k(-1);
          }, [s]),
          o.createElement(U.AdaptivePopupDialog, {
            ...e,
            className: c(q.dialog, !m && h && q.tablet),
            onKeyDown: function (e) {
              var o;
              const c = (0, j.hashFromEvent)(e),
                s = O ? I : a,
                u = O ? T : r;
              switch (c) {
                case 38:
                  if ((e.preventDefault(), 0 === s)) return;
                  if (-1 === s) return void P(0);
                  P(s - 1);
                  break;
                case 40:
                  if ((e.preventDefault(), s === u.length - 1)) return;
                  P(s + 1);
                  break;
                case 37: {
                  const n = A();
                  if (n && t.has(n)) return e.preventDefault(), void l(n);
                  if (!x || n) return;
                  e.preventDefault(), E(x - 1);
                  break;
                }
                case 39: {
                  const n = A();
                  if (n && !t.has(n)) return e.preventDefault(), void l(n);
                  if (x === X - 1 || n) return;
                  e.preventDefault(), E(x + 1);
                  break;
                }
                case 13: {
                  if (O)
                    return void (function () {
                      if (-1 === I) return;
                      const e = T[I];
                      e.checked ? b.removeStudy(e) : b.applyStudy(e.symbol, x, N);
                      k(-1);
                    })();
                  const t = A();
                  if (t) return e.preventDefault(), void l(t);
                  e.preventDefault();
                  const r = null === (o = null == n ? void 0 : n.current) || void 0 === o ? void 0 : o.value.trim();
                  r &&
                    M &&
                    (i([{ symbol: f ? r.toUpperCase() : r, resolved: !1, compareOption: x, allowExtendTimeScale: N }]),
                    M(n, d));
                  break;
                }
                case 27:
                  e.preventDefault(), p();
              }
            },
            dataName: "compare-dialog",
            draggable: !0,
          })
        );
        function P(e) {
          O ? k(e, z) : u(e);
        }
        function z() {
          var e;
          null === (e = D.current) || void 0 === e || e.scrollIntoView({ block: "nearest" });
        }
        function A() {
          if (!_) return;
          const { id: e, isOffset: t, onExpandClick: n } = _;
          return !t && Boolean(n) && e ? e : void 0;
        }
      }
      var G = n(73935),
        Y = n(89085),
        K = n(56161),
        J = (n(9772), n(58738));
      class Z extends J.DialogRenderer {
        constructor(e) {
          super(), (this._props = e);
        }
        show() {
          if (this.visible().value()) return;
          const e = o.createElement(
            Y.QuoteSessionContext.Provider,
            { value: null },
            o.createElement(K.SymbolSearchItemsDialog, {
              ...this._props,
              initialMode: this._props.initialMode || "symbolSearch",
              onClose: () => this.hide(),
            })
          );
          G.render(e, this._container), this._setVisibility(!0);
        }
        hide() {
          var e, t;
          G.unmountComponentAtNode(this._container),
            this._visibility.setValue(!1),
            null === (t = (e = this._props).onClose) || void 0 === t || t.call(e);
        }
      }
      var $ = n(3627),
        ee = n(40834),
        te = n(94905);
      function ne(e) {
        const { searchRef: t, setMode: n } = (0, y.useEnsuredContext)(w.SymbolSearchItemsDialogContext),
          { currentMode: r } = (0, y.useEnsuredContext)(te.SymbolSearchDialogBodyContext);
        return (
          (0, o.useEffect)(() => {
            const e = t.current;
            if (e)
              return (
                e.addEventListener("input", a),
                () => {
                  e && e.removeEventListener("input", a);
                }
              );
          }, []),
          o.createElement(ee.DialogSearch, { ...e })
        );
        function a() {
          var e, o, a, l;
          t.current &&
            r &&
            ("compare" !== r.current ||
            "" ===
              (null === (o = null === (e = null == t ? void 0 : t.current) || void 0 === e ? void 0 : e.value) ||
              void 0 === o
                ? void 0
                : o.trim())
              ? "symbolSearch" === r.current &&
                "" ===
                  (null === (l = null === (a = null == t ? void 0 : t.current) || void 0 === a ? void 0 : a.value) ||
                  void 0 === l
                    ? void 0
                    : l.trim()) &&
                n("compare")
              : n("symbolSearch"));
        }
      }
      var oe = n(53400),
        re = n(79653),
        ae = n(97617);
      function le(e) {
        const { allowExtendTimeScale: t, toggleAllowExtendTimeScale: n } = (0, m.ensureNotNull)((0, o.useContext)(C));
        return o.createElement(
          re.SymbolSearchDialogFooter,
          null,
          o.createElement(
            "label",
            null,
            o.createElement(oe.CheckboxInput, { checked: t, value: t ? "on" : "off", onChange: n }),
            o.createElement("span", { className: ae.label }, (0, r.t)("Allow extend time scale"))
          )
        );
      }
      const ie = l.enabled("secondary_series_extend_time_scale");
      function ce(e) {
        return new Z({
          wrapper: ((t = e), (e) => o.createElement(V, { ...e, compareModel: t })),
          dialog: Q,
          contentItem: A,
          initialScreen: H,
          searchInput: ne,
          footer: ie ? o.createElement(le) : void 0,
          initialMode: "compare",
          dialogTitle: (0, r.t)("Compare symbol"),
          autofocus: !a.mobiletouch,
          dialogWidth: "fixed",
          onSearchComplete: (t) => {
            const { compareOption: n, allowExtendTimeScale: o } = t[0];
            if (void 0 !== n) {
              (0, i.getSymbolSearchCompleteOverrideFunction)()(t[0].symbol).then((t) => {
                e.applyStudy(t, n, o);
              });
            }
          },
          symbolTypes: (0, $.getAvailableSymbolTypes)(),
          showSpreadActions: l.enabled("show_spread_operators") && l.enabled("compare_symbol_search_spread_operators"),
        });
        var t;
      }
    },
    40488: (e, t, n) => {
      "use strict";
      var o;
      n.d(t, { CompareOption: () => o }),
        (function (e) {
          (e[(e.SameScale = 0)] = "SameScale"),
            (e[(e.NewPriceScale = 1)] = "NewPriceScale"),
            (e[(e.NewPane = 2)] = "NewPane");
        })(o || (o = {}));
    },
    94004: (e, t, n) => {
      "use strict";
      n.d(t, { DrawerManager: () => r, DrawerContext: () => a });
      var o = n(67294);
      class r extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._addDrawer = () => {
              const e = this.state.currentDrawer + 1;
              return this.setState({ currentDrawer: e }), e;
            }),
            (this._removeDrawer = () => {
              const e = this.state.currentDrawer - 1;
              return this.setState({ currentDrawer: e }), e;
            }),
            (this.state = { currentDrawer: 0 });
        }
        render() {
          return o.createElement(
            a.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.currentDrawer,
              },
            },
            this.props.children
          );
        }
      }
      const a = o.createContext(null);
    },
    57374: (e, t, n) => {
      "use strict";
      n.d(t, { Drawer: () => h });
      var o = n(67294),
        r = n(16282),
        a = n(94184),
        l = n(67891),
        i = n(75761),
        c = n(4735),
        s = n(94004),
        d = n(43367),
        u = n(94884),
        m = n(64526);
      function h(e) {
        const { position: t = "Bottom", onClose: n, children: h, className: p, theme: v = m } = e,
          f = (0, r.ensureNotNull)((0, o.useContext)(s.DrawerContext)),
          [b, g] = (0, o.useState)(0),
          w = (0, o.useRef)(null),
          S = (0, o.useContext)(u.CloseDelegateContext);
        return (
          (0, o.useEffect)(() => {
            const e = (0, r.ensureNotNull)(w.current);
            return (
              e.focus({ preventScroll: !0 }),
              S.subscribe(f, n),
              (0, i.setFixedBodyState)(!0),
              d.CheckMobile.iOS() && (0, l.disableBodyScroll)(e),
              g(f.addDrawer()),
              () => {
                S.unsubscribe(f, n);
                const t = f.removeDrawer();
                d.CheckMobile.iOS() && (0, l.enableBodyScroll)(e), 0 === t && (0, i.setFixedBodyState)(!1);
              }
            );
          }, []),
          o.createElement(
            c.Portal,
            null,
            o.createElement(
              "div",
              { className: a(m.wrap, m["position" + t]) },
              b === f.currentDrawer && o.createElement("div", { className: m.backdrop, onClick: n }),
              o.createElement(
                "div",
                {
                  className: a(m.drawer, v.drawer, m["position" + t], p),
                  ref: w,
                  tabIndex: -1,
                  "data-name": e["data-name"],
                },
                h
              )
            )
          )
        );
      }
    },
    11086: (e, t, n) => {
      "use strict";
      n.d(t, { hoverMouseEventFilter: () => a, useAccurateHover: () => l, useHover: () => r });
      var o = n(67294);
      function r() {
        const [e, t] = (0, o.useState)(!1);
        return [
          e,
          {
            onMouseOver: function (e) {
              a(e) && t(!0);
            },
            onMouseOut: function (e) {
              a(e) && t(!1);
            },
          },
        ];
      }
      function a(e) {
        return !e.currentTarget.contains(e.relatedTarget);
      }
      function l(e) {
        const [t, n] = (0, o.useState)(!1);
        return (
          (0, o.useEffect)(() => {
            const t = (t) => {
              if (null === e.current) return;
              const o = e.current.contains(t.target);
              n(o);
            };
            return document.addEventListener("mouseover", t), () => document.removeEventListener("mouseover", t);
          }, []),
          t
        );
      }
    },
    68521: (e, t, n) => {
      "use strict";
      n.d(t, { MatchMedia: () => r });
      var o = n(67294);
      class r extends o.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate();
            }),
            (this.state = { query: window.matchMedia(this.props.rule) });
        }
        componentDidMount() {
          this._subscribe(this.state.query);
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query && (this._unsubscribe(t.query), this._subscribe(this.state.query));
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query);
        }
        render() {
          return this.props.children(this.state.query.matches);
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media ? { query: window.matchMedia(e.rule) } : null;
        }
        _subscribe(e) {
          e.addListener(this._handleChange);
        }
        _unsubscribe(e) {
          e.removeListener(this._handleChange);
        }
      }
    },
    95860: (e, t, n) => {
      "use strict";
      n.d(t, { DEFAULT_POPUP_MENU_ITEM_THEME: () => s, PopupMenuItem: () => m });
      var o = n(67294),
        r = n(94184),
        a = n(79424),
        l = n(87438),
        i = n(74818),
        c = n(66549);
      const s = c;
      function d(e) {
        const { reference: t, ...n } = e,
          r = { ...n, ref: t };
        return o.createElement(e.href ? "a" : "div", r);
      }
      function u(e) {
        e.stopPropagation();
      }
      function m(e) {
        const {
            id: t,
            role: n,
            "aria-selected": s,
            className: m,
            title: h,
            labelRowClassName: p,
            labelClassName: v,
            shortcut: f,
            forceShowShortcuts: b,
            icon: g,
            isActive: w,
            isDisabled: S,
            isHovered: C,
            appearAsDisabled: x,
            label: y,
            link: E,
            showToolboxOnHover: I,
            target: k,
            rel: D,
            toolbox: M,
            reference: N,
            onMouseOut: T,
            onMouseOver: _,
            suppressToolboxClick: O = !0,
            theme: P = c,
          } = e,
          z = (0, i.filterDataProps)(e),
          A = (0, o.useRef)(null);
        return o.createElement(
          d,
          {
            ...z,
            id: t,
            role: n,
            "aria-selected": s,
            className: r(m, P.item, g && P.withIcon, { [P.isActive]: w, [P.isDisabled]: S || x, [P.hovered]: C }),
            title: h,
            href: E,
            target: k,
            rel: D,
            reference: function (e) {
              (A.current = e), "function" == typeof N && N(e);
              "object" == typeof N && (N.current = e);
            },
            onClick: function (t) {
              const { dontClosePopup: n, onClick: o, onClickArg: r, trackEventObject: i } = e;
              if (S) return;
              i && (0, l.trackEvent)(i.category, i.event, i.label);
              o && o(r, t);
              n || (0, a.globalCloseMenu)();
            },
            onContextMenu: function (t) {
              const { trackEventObject: n, trackRightClick: o } = e;
              n && o && (0, l.trackEvent)(n.category, n.event, n.label + "_rightClick");
            },
            onMouseUp: function (t) {
              const { trackEventObject: n, trackMouseWheelClick: o } = e;
              if (1 === t.button && E && n) {
                let e = n.label;
                o && (e += "_mouseWheelClick"), (0, l.trackEvent)(n.category, n.event, e);
              }
            },
            onMouseOver: _,
            onMouseOut: T,
          },
          void 0 !== g && o.createElement("div", { className: P.icon, dangerouslySetInnerHTML: { __html: g } }),
          o.createElement(
            "div",
            { className: r(P.labelRow, p) },
            o.createElement("div", { className: r(P.label, v) }, y)
          ),
          (void 0 !== f || b) && o.createElement("div", { className: P.shortcut }, (B = f) && B.split("+").join(" + ")),
          void 0 !== M &&
            o.createElement("div", { onClick: O ? u : void 0, className: r(P.toolbox, { [P.showOnHover]: I }) }, M)
        );
        var B;
      }
    },
    94884: (e, t, n) => {
      "use strict";
      n.d(t, { CloseDelegateContext: () => a });
      var o = n(67294),
        r = n(79424);
      const a = o.createContext(r.globalCloseDelegate);
    },
    73991: (e, t, n) => {
      "use strict";
      n.d(t, { TouchScrollContainer: () => i });
      var o = n(67294),
        r = n(67891),
        a = n(16282),
        l = n(43367);
      function i(e) {
        const { reference: t, children: n, ...a } = e,
          i = (0, o.useRef)(null),
          s = (0, o.useCallback)(
            (e) => {
              t && (t.current = e),
                l.CheckMobile.iOS() &&
                  (null !== i.current && (0, r.enableBodyScroll)(i.current),
                  (i.current = e),
                  null !== i.current && (0, r.disableBodyScroll)(i.current, { allowTouchMove: c(i) }));
            },
            [t]
          );
        return o.createElement("div", { ref: s, ...a }, n);
      }
      function c(e) {
        return (t) => {
          const n = (0, a.ensureNotNull)(e.current),
            o = document.activeElement;
          return !n.contains(t) || (null !== o && n.contains(o) && o.contains(t));
        };
      }
    },
    44805: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>';
    },
    12343: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 15l5 5L23 9"/></svg>';
    },
    51170: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#D1D4DC" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#D1D4DC" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#1976D2" cx="97.5" cy="39" r="13"/><path fill="#D1D4DC" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>';
    },
    58726: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121 120" width="121" height="120"><path fill="#1E222D" d="M53.88 18.36a43.4 43.4 0 0 1 11.24 0 1 1 0 0 0 .26-1.98 45.42 45.42 0 0 0-11.76 0 1 1 0 1 0 .26 1.98zM43.04 21.26a1 1 0 0 0-.77-1.85A44.95 44.95 0 0 0 32.1 25.3a1 1 0 0 0 1.22 1.58 42.95 42.95 0 0 1 9.72-5.62zM75.42 19.96a1 1 0 0 1 1.3-.55A44.95 44.95 0 0 1 86.9 25.3a1 1 0 0 1-1.22 1.58 42.95 42.95 0 0 0-9.72-5.62 1 1 0 0 1-.54-1.3zM25.38 34.82a1 1 0 1 0-1.58-1.22 44.95 44.95 0 0 0-5.89 10.17 1 1 0 0 0 1.85.77 42.95 42.95 0 0 1 5.62-9.72zM16.86 55.38a1 1 0 0 0-1.98-.26 45.42 45.42 0 0 0 0 11.76 1 1 0 1 0 1.98-.26 43.4 43.4 0 0 1 0-11.24zM103 54.26a1 1 0 0 1 1.12.86 45.4 45.4 0 0 1 0 11.76 1 1 0 0 1-1.98-.26 43.37 43.37 0 0 0 0-11.24 1 1 0 0 1 .86-1.12zM19.76 77.46a1 1 0 0 0-1.85.77A44.95 44.95 0 0 0 23.8 88.4a1 1 0 0 0 1.58-1.22 42.95 42.95 0 0 1-5.62-9.72zM100.54 76.92a1 1 0 0 1 .54 1.3A44.95 44.95 0 0 1 95.2 88.4a1 1 0 0 1-1.58-1.22 42.95 42.95 0 0 0 5.62-9.72 1 1 0 0 1 1.3-.54zM33.32 95.12a1 1 0 1 0-1.22 1.58 44.94 44.94 0 0 0 10.17 5.88 1 1 0 0 0 .77-1.84 42.97 42.97 0 0 1-9.72-5.62zM87.08 95.3a1 1 0 0 1-.18 1.4 44.94 44.94 0 0 1-10.17 5.88 1 1 0 0 1-.77-1.84 42.98 42.98 0 0 0 9.72-5.62 1 1 0 0 1 1.4.18zM53.88 103.64a1 1 0 0 0-.26 1.98 45.4 45.4 0 0 0 11.76 0 1 1 0 0 0-.26-1.98 43.37 43.37 0 0 1-11.24 0zM62.81 53.17a1 1 0 0 0-.78 1.84 6.62 6.62 0 0 1 3.49 3.5 1 1 0 1 0 1.84-.78 8.62 8.62 0 0 0-4.55-4.56z"/><path fill="#1E222D" d="M45.5 61a14 14 0 1 1 24.28 9.5l7.92 7.92a1 1 0 0 1-1.42 1.42l-7.96-7.97A14 14 0 0 1 45.5 61zm14-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/><circle fill="#2196F3" cx="97.5" cy="39" r="13"/><path fill="#fff" d="M98.5 34a1 1 0 1 0-2 0v4h-4a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 0 0 0-2h-4v-4z"/></svg>';
    },
  },
]);
