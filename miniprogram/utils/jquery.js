function n(t, r, o, i) {
    var u;
    if (d.isArray(r)) d.each(r, function(r, u) {
        o || p.test(t) ? i(t, u) : n(t + "[" + ("object" === (void 0 === u ? "undefined" : e(u)) ? r : "") + "]", u, o, i);
    }); else if (o || "object" !== d.type(r)) i(t, r); else for (u in r) n(t + "[" + u + "]", r[u], o, i);
}

function t(n) {
    var t = n.length, r = d.type(n);
    return !d.isWindow(n) && (!(1 !== n.nodeType || !t) || "array" === r || "function" !== r && (0 === t || "number" == typeof t && t > 0 && t - 1 in n));
}

var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
    return typeof n;
} : function(n) {
    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
}, o = "function" == typeof Symbol && "symbol" == r(Symbol.iterator) ? function(n) {
    return void 0 === n ? "undefined" : r(n);
} : function(n) {
    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : void 0 === n ? "undefined" : r(n);
}, e = "function" == typeof Symbol && "symbol" == o(Symbol.iterator) ? function(n) {
    return void 0 === n ? "undefined" : o(n);
} : function(n) {
    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : void 0 === n ? "undefined" : o(n);
}, i = {}, u = [], f = u.push, c = u.indexOf, l = i.toString, a = i.hasOwnProperty, s = "1.10.2".trim, y = /%20/g, p = /\[\]$/, d = {
    isFunction: function(n) {
        return "function" === d.type(n);
    },
    isArray: Array.isArray || function(n) {
        return "array" === d.type(n);
    },
    isWindow: function(n) {
        return null != n && n == n.window;
    },
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    type: function(n) {
        return null == n ? String(n) : "object" === (void 0 === n ? "undefined" : e(n)) || "function" == typeof n ? i[l.call(n)] || "object" : void 0 === n ? "undefined" : e(n);
    },
    isPlainObject: function(n) {
        var t;
        if (!n || "object" !== d.type(n) || n.nodeType || d.isWindow(n)) return !1;
        try {
            if (n.constructor && !a.call(n, "constructor") && !a.call(n.constructor.prototype, "isPrototypeOf")) return !1;
        } catch (n) {
            return !1;
        }
        if (d.support.ownLast) for (t in n) return a.call(n, t);
        for (t in n) ;
        return void 0 === t || a.call(n, t);
    },
    isEmptyObject: function(n) {
        var t;
        for (t in n) return !1;
        return !0;
    },
    each: function(n, r, o) {
        var e = 0, i = n.length, u = t(n);
        if (o) {
            if (u) for (;e < i && !1 !== r.apply(n[e], o); e++) ; else for (e in n) if (!1 === r.apply(n[e], o)) break;
        } else if (u) for (;e < i && !1 !== r.call(n[e], e, n[e]); e++) ; else for (e in n) if (!1 === r.call(n[e], e, n[e])) break;
        return n;
    },
    trim: s && !s.call("\ufeff ") ? function(n) {
        return null == n ? "" : s.call(n);
    } : function(n) {
        return null == n ? "" : (n + "").replace(rtrim, "");
    },
    makeArray: function(n, r) {
        var o = r || [];
        return null != n && (t(Object(n)) ? d.merge(o, "string" == typeof n ? [ n ] : n) : f.call(o, n)), 
        o;
    },
    inArray: function(n, t, r) {
        var o;
        if (t) {
            if (c) return c.call(t, n, r);
            for (o = t.length, r = r ? r < 0 ? Math.max(0, o + r) : r : 0; r < o; r++) if (r in t && t[r] === n) return r;
        }
        return -1;
    },
    merge: function(n, t) {
        var r = t.length, o = n.length, e = 0;
        if ("number" == typeof r) for (;e < r; e++) n[o++] = t[e]; else for (;void 0 !== t[e]; ) n[o++] = t[e++];
        return n.length = o, n;
    },
    isMobile: function(n) {
        return "" !== d.trim(n) && /^1[3|4|5|7|8|9][0-9]\d{8}$/.test(d.trim(n));
    },
    toFixed: function(n, t) {
        var r = parseInt(t) || 0;
        if (r < -20 || r > 100) throw new RangeError("Precision of " + r + " fractional digits is out of range");
        var o = Number(n);
        if (isNaN(o)) return "NaN";
        var e = "";
        if (o <= 0 && (e = "-", o = -o), o >= Math.pow(10, 21)) return e + o.toString();
        var i;
        if (t = Math.round(o * Math.pow(10, r)), i = 0 == t ? "0" : t.toString(), 0 == r) return e + i;
        var u = i.length;
        return u <= r && (i = Math.pow(10, r + 1 - u).toString().substring(1) + i, u = r + 1), 
        r > 0 && (i = i.substring(0, u - r) + "." + i.substring(u - r)), e + i;
    }
};

d.extend = function() {
    var n, t, r, o, i, u, f = arguments[0] || {}, c = 1, l = arguments.length, a = !1;
    for ("boolean" == typeof f && (a = f, f = arguments[1] || {}, c = 2), "object" === (void 0 === f ? "undefined" : e(f)) || d.isFunction(f) || (f = {}), 
    l === c && (f = this, --c); c < l; c++) if (null != (n = arguments[c])) for (t in n) r = f[t], 
    f !== (o = n[t]) && (a && o && (d.isPlainObject(o) || (i = d.isArray(o))) ? (i ? (i = !1, 
    u = r && d.isArray(r) ? r : []) : u = r && d.isPlainObject(r) ? r : {}, f[t] = d.extend(a, u, o)) : void 0 !== o && (f[t] = o));
    return f;
}, d.param = function(t, r) {
    var o, e = [], i = function(n, t) {
        t = d.isFunction(t) ? t() : null == t ? "" : t, e[e.length] = encodeURIComponent(n) + "=" + encodeURIComponent(t);
    };
    if (void 0 === r && (r = !1), d.isArray(t) || t.jquery && !d.isPlainObject(t)) d.each(t, function() {
        i(this.name, this.value);
    }); else for (o in t) n(o, t[o], r, i);
    return e.join("&").replace(y, "+");
}, module.exports = d;