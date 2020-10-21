var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
    return typeof a;
} : function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
}, e = "function" == typeof Symbol && "symbol" == a(Symbol.iterator) ? function(e) {
    return void 0 === e ? "undefined" : a(e);
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : void 0 === e ? "undefined" : a(e);
}, t = "function" == typeof Symbol && "symbol" == e(Symbol.iterator) ? function(a) {
    return void 0 === a ? "undefined" : e(a);
} : function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : void 0 === a ? "undefined" : e(a);
}, r = getApp(), i = r.requirejs("jquery"), n = r.requirejs("core"), o = r.requirejs("foxui");

module.exports = {
    getIndex: function(a, e) {
        if ("" == i.trim(a) || !i.isArray(e)) return [ 0, 0, 0 ];
        var t = a.split(" "), r = [ 0, 0, 0 ];
        for (var n in e) if (e[n].name == t[0]) {
            r[0] = Number(n);
            for (var o in e[n].city) if (e[n].city[o].name == t[1]) {
                r[1] = Number(o);
                for (var d in e[n].city[o].area) if (e[n].city[o].area[d].name == t[2]) {
                    r[2] = Number(d);
                    break;
                }
                break;
            }
            break;
        }
        return r;
    },
    onConfirm: function(a, e) {
        var t = a.data.pval, r = a.data.bindAreaField, n = i.isEmptyObject(a.data.diyform.f_data) ? {} : a.data.diyform.f_data, o = a.data.areas;
        if (n[r] = n[r] || {}, n[r].province = o[t[0]].name, n[r].city = o[t[0]].city[t[1]].name, 
        a.data.areaKey) {
            var d = a.data.areaDetail[a.data.areaKey];
            d.province = o[t[0]].name, d.city = o[t[0]].city[t[1]].name;
        }
        if (a.data.noArea || (n[r].area = o[t[0]].city[t[1]].area[t[2]].name, a.data.areaKey && (d.area = o[t[0]].city[t[1]].area[t[2]].name)), 
        a.setData({
            "diyform.f_data": n,
            showPicker: !1,
            bindAreaField: !1
        }), a.data.areaKey) {
            var f = a.data.areaDetail || {};
            f[a.data.areaKey] = d, a.setData({
                areaDetail: f
            });
        }
    },
    onCancel: function(a, e) {
        a.setData({
            showPicker: !1
        });
    },
    onChange: function(a, e) {
        var t = e.detail.value, r = n.pdata(e).type, o = a.data.postData;
        o[r] = i.trim(t), a.setData({
            postData: o
        });
    },
    bindChange: function(a, e) {
        var t = a.data.pvalOld, r = e.detail.value;
        t[0] != r[0] && (r[1] = 0), t[1] != r[1] && (r[2] = 0), a.setData({
            pval: r,
            pvalOld: r
        });
    },
    selectArea: function(a, e) {
        var t = e.currentTarget.dataset.area, r = e.currentTarget.dataset.field, i = 1 != e.currentTarget.dataset.hasarea, n = a.getIndex(t, a.data.areas), o = e.currentTarget.dataset.areakey, d = {
            pval: n,
            pvalOld: n,
            showPicker: !0,
            noArea: i,
            bindAreaField: r
        };
        o && (d.areaKey = o), a.setData(d);
    },
    DiyFormHandler: function(a, e) {
        var r = e.target.dataset, o = r.type, d = r.field, f = r.datatype, m = a.data.diyform.f_data;
        (i.isArray(m) || "object" != (void 0 === m ? "undefined" : t(m))) && (m = {});
        var l = a.data.diyform.fields;
        if ("input" == o || "textarea" == o || "checkbox" == o || "date" == o || "datestart" == o || "dateend" == o || "time" == o || "timestart" == o || "timeend" == o || "radio" == o) if ("datestart" == o || "timestart" == o) i.isArray(m[d]) || (m[d] = []), 
        m[d][0] = e.detail.value; else if ("dateend" == o || "timeend" == o) i.isArray(m[d]) || (m[d] = []), 
        m[d][1] = e.detail.value; else if ("checkbox" == o) {
            m[d] = {};
            for (var s in e.detail.value) {
                var u = e.detail.value[s];
                m[d][u] = 1;
            }
        } else "radio" == o ? m[d] = e.detail.value : 10 == f ? (i.isEmptyObject(m[d]) && (m[d] = {}), 
        m[d][r.name] = e.detail.value) : m[d] = e.detail.value; else if ("picker" == o) {
            for (var y in m) if (y == d) {
                for (var c in l) if (l[c].diy_type == d) {
                    m[d] = [ e.detail.value, l[c].tp_text[e.detail.value] ];
                    break;
                }
                break;
            }
        } else if ("image" == o) n.upload(function(e) {
            for (var t in m) if (t == d) {
                m[d] || (m[d] = {}), m[d].images || (m[d].images = []), m[d].images.push({
                    url: e.url,
                    filename: e.filename
                });
                break;
            }
            m[d].count = m[d].images.length, a.setData({
                "diyform.f_data": m
            });
        }); else if ("image-remove" == o) {
            for (var y in m) if (y == d) {
                var p = {
                    images: []
                };
                for (var c in m[d].images) m[d].images[c].filename != r.filename && p.images.push(m[d].images[c]);
                p.count = p.images.length, m[d] = p;
                break;
            }
        } else if ("image-preview" == o) for (var y in m) if (y == d) {
            var v = [];
            for (var c in m[d].images) v.push(m[d].images[c].url);
            wx.previewImage({
                current: v[r.index],
                urls: v
            });
            break;
        }
        a.setData({
            "diyform.f_data": m
        });
    },
    verify: function(a, e) {
        for (var t in e.fields) {
            var r = e.fields[t], n = r.diy_type;
            if (1 == r.tp_must) if (5 == r.data_type) {
                if (!e.f_data[n] || e.f_data[n].count < 1) return o.toast(a, "请选择" + r.tp_name), 
                !1;
            } else if (9 == r.data_type) {
                if (i.isEmptyObject(e.f_data[n]) || !e.f_data[n].province || !e.f_data[n].city) return o.toast(a, "请选择" + r.tp_name), 
                !1;
            } else if (10 == r.data_type) {
                if (i.isEmptyObject(e.f_data[n]) || !e.f_data[n].name1) return o.toast(a, "请填写" + r.tp_name), 
                !1;
                if (!e.f_data[n].name2 || "" == e.f_data[n].name2) return o.toast(a, "请填写" + r.tp_name2), 
                !1;
            } else if (!e.f_data[n]) return o.toast(a, "请填写" + r.tp_name), !1;
            if (6 == r.data_type && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(e.f_data[n])) return o.toast(a, "请填写正确的" + r.tp_name), 
            !1;
            if (10 == r.data_type && (i.isEmptyObject(e.f_data[n]) || e.f_data[n].name1 != e.f_data[n].name2)) return o.toast(a, r.tp_name + "与" + r.tp_name2 + "不一致"), 
            !1;
        }
        return !0;
    }
};