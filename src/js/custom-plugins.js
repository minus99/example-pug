/*
	Facebook redirect close popup
*/
if (window.location.search.indexOf('?redirect_uri=fcbk') != -1) window.close();

/*
	requestAnim shim layer by Paul Irish	
*/
window.requestAnimFrame = function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) { window.setTimeout(callback, 1E3 / 30) } }();
window.cancelRequestAnimFrame = function () { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout }();

/*
	SCROLL STOP
	ex: jQuery(window).bind('scrollstop', function(e){ onScroll(); });
*/
(function () {
    var special = jQuery.event.special, uid1 = "D" + +new Date, uid2 = "D" + (+new Date + 1); special.scrollstart = { setup: function () { var timer, handler = function (evt) { var _self = this, _args = arguments; if (timer) clearTimeout(timer); else { evt.type = "scrollstart"; jQuery.event.dispatch.apply(_self, _args) } timer = setTimeout(function () { timer = null }, special.scrollstop.latency) }; jQuery(this).bind("scroll", handler).data(uid1, handler) }, teardown: function () { jQuery(this).unbind("scroll", jQuery(this).data(uid1)) } }; special.scrollstop =
        { latency: 300, setup: function () { var timer, handler = function (evt) { var _self = this, _args = arguments; if (timer) clearTimeout(timer); timer = setTimeout(function () { timer = null; evt.type = "scrollstop"; jQuery.event.dispatch.apply(_self, _args) }, special.scrollstop.latency) }; jQuery(this).bind("scroll", handler).data(uid2, handler) }, teardown: function () { jQuery(this).unbind("scroll", jQuery(this).data(uid2)) } }
})();

/*
	RESIZE STOP
	ex: $(window).bind('resizestop', function (e) {  console.log(e.data.size); });
*/
(function ($, setTimeout) {
    var $window = $(window), cache = $([]), last = 0, timer = 0, size = {}; function onWindowResize() { last = $.now(); timer = timer || setTimeout(checkTime, 10) } function checkTime() { var now = $.now(); if (now - last < $.resizestop.threshold) timer = setTimeout(checkTime, 10); else { clearTimeout(timer); timer = last = 0; size.width = $window.width(); size.height = $window.height(); cache.trigger("resizestop") } } $.resizestop = { propagate: false, threshold: 500 }; $.event.special.resizestop = {
        setup: function (data, namespaces) {
            cache = cache.not(this);
            cache = cache.add(this); if (cache.length === 1) $window.bind("resize", onWindowResize)
        }, teardown: function (namespaces) { cache = cache.not(this); if (!cache.length) $window.unbind("resize", onWindowResize) }, add: function (handle) { var oldHandler = handle.handler; handle.handler = function (e) { if (!$.resizestop.propagate) e.stopPropagation(); e.data = e.data || {}; e.data.size = e.data.size || {}; $.extend(e.data.size, size); return oldHandler.apply(this, arguments) } }
    }
})(jQuery, setTimeout);

/*
	ENDSWITH
	ex: 'example,'.endsWith(',') son karekter , varsa true yoksa false
*/
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

/*
	IE8 TRIM FIX
*/
if (typeof String.prototype.trim !== "function") String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, "") };

/*
	IE8 FOREACH FIX
*/
if (typeof Array.prototype.forEach != "function") Array.prototype.forEach = function (callback) { for (var i = 0; i < this.length; i++)callback.apply(this, [this[i], i, this]) };

/*
	MOBILE DETECT
*/
var mobile = function () { return { detect: function () { var uagent = navigator.userAgent.toLowerCase(); var list = this.mobiles; var ismobile = false; for (var d = 0; d < list.length; d += 1)if (uagent.indexOf(list[d]) != -1) ismobile = true; return ismobile }, mobiles: ["midp", "240x320", "blackberry", "netfront", "nokia", "panasonic", "portalmmm", "sharp", "sie-", "sonyericsson", "symbian", "windows ce", "benq", "mda", "mot-", "opera mini", "philips", "pocket pc", "sagem", "samsung", "sda", "sgh-", "vodafone", "xda", "palm", "iphone", "ipod", "android", "ipad"] } }(),
    isMobile = mobile.detect();
if (isMobile) $('html').addClass('mobileVer');

/*
	URLREAD
*/
var minusLoc = {
    put: function (type, param, prop) {
        var hash = window.location.hash,
            path = window.location.pathname,
            query = window.location.search,
            host = window.location.host,
            url = window.location.href;
        if (type == "#") window.location.hash = this.encoder(param);
        else if (type == "?") {
            var a, b = false;
            a = query.substring(query.indexOf("?") + 1, query.length).split("&");
            for (var i = 0; i < a.length; i++)
                if (a[i].indexOf(prop + "=") != -1) b = a[i];
            if (b != false) url = url.replace(b, prop + "=" + param);
            else if (query != "") url = "http://" + host + path + query + "&" + prop +
                "=" + param + hash;
            else url = "http://" + host + path + "?" + prop + "=" + param + hash;
            // window.location.replace(url)

            return url;
        }
    },
    get: function (type, param, href) {
        var str, got = false;
        if (type == "#") str = window.location.hash.replace(/^#/, "");
        else if (type == "?") {
            str = href != undefined ? href : window.location.search;
            str = str.substring(str.indexOf("?") + 1, str.length).split("&");
            for (var i = 0; i < str.length; i++)
                if (str[i].indexOf(param + "=") != -1) {
                    str = str[i].replace(param + "=", "");
                    got = true
                }
            if (!got) str = ""
        }
        try {
            return $.browser.mozilla ? str : decodeURIComponent(str)
        } catch (error) {
            return str
        }
    },
    string: function (string, param) {
        var str;
        if (param == undefined) str = string.substring(string.indexOf("#") + 1, string.length);
        else {
            str = string.substring(string.indexOf("?") + 1, string.length).split("&");
            for (var i = 0; i < str.length; i++)
                if (str[i].indexOf(param + "=") != -1) str = str[i].replace(param + "=", "")
        }
        try {
            return $.browser.mozilla ? str : decodeURIComponent(str)
        } catch (error) {
            return str
        }
    },
    encoder: encodeURIComponent,
    remove: function (type, prop) {
        var query = window.location.search,
            url = window.location.href;
        if (type == "#") window.location.hash =
            "";
        else if (type == "?") {
            var a, b = false;
            a = query.substring(query.indexOf("?") + 1, query.length).split("&");
            for (var i = 0; i < a.length; i++)
                if (a[i].indexOf(prop + "=") != -1) b = a[i];
            if (b != false)
                if (url.substr(url.indexOf(prop) - 1, 1) == "&") url = url.replace("&" + b, "");
                else if (url.indexOf("&") != -1) url = url.replace(b + "&", "");
                else url = url.replace("?" + b, "");

            //window.location.replace(url)


            return url;
        }
    }
};

/*
	Jquery Easing Plugins
*/
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad", swing: function (x, t, b, c, d) { return jQuery.easing[jQuery.easing.def](x, t, b, c, d) }, easeInQuad: function (x, t, b, c, d) { return c * (t /= d) * t + b }, easeOutQuad: function (x, t, b, c, d) { return -c * (t /= d) * (t - 2) + b }, easeInOutQuad: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * (--t * (t - 2) - 1) + b }, easeInCubic: function (x, t, b, c, d) { return c * (t /= d) * t * t + b }, easeOutCubic: function (x, t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b }, easeInOutCubic: function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c /
            2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b
    }, easeInQuart: function (x, t, b, c, d) { return c * (t /= d) * t * t * t + b }, easeOutQuart: function (x, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b }, easeInOutQuart: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b; return -c / 2 * ((t -= 2) * t * t * t - 2) + b }, easeInQuint: function (x, t, b, c, d) { return c * (t /= d) * t * t * t * t + b }, easeOutQuint: function (x, t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b }, easeInOutQuint: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b }, easeInSine: function (x,
        t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b }, easeOutSine: function (x, t, b, c, d) { return c * Math.sin(t / d * (Math.PI / 2)) + b }, easeInOutSine: function (x, t, b, c, d) { return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b }, easeInExpo: function (x, t, b, c, d) { return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b }, easeOutExpo: function (x, t, b, c, d) { return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b }, easeInOutExpo: function (x, t, b, c, d) { if (t == 0) return b; if (t == d) return b + c; if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b; return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b },
    easeInCirc: function (x, t, b, c, d) { return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b }, easeOutCirc: function (x, t, b, c, d) { return c * Math.sqrt(1 - (t = t / d - 1) * t) + b }, easeInOutCirc: function (x, t, b, c, d) { if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b }, easeInElastic: function (x, t, b, c, d) {
        var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3; if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a); return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 *
            Math.PI) / p)) + b
    }, easeOutElastic: function (x, t, b, c, d) { var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * 0.3; if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a); return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b }, easeInOutElastic: function (x, t, b, c, d) {
        var s = 1.70158; var p = 0; var a = c; if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (0.3 * 1.5); if (a < Math.abs(c)) { a = c; var s = p / 4 } else var s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -0.5 * (a * Math.pow(2,
            10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b
    }, easeInBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; return c * (t /= d) * t * ((s + 1) * t - s) + b }, easeOutBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b }, easeInOutBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b; return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b }, easeInBounce: function (x, t,
        b, c, d) { return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b }, easeOutBounce: function (x, t, b, c, d) { if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b; else if (t < 2 / 2.75) return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b; else if (t < 2.5 / 2.75) return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b; else return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b }, easeInOutBounce: function (x, t, b, c, d) { if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b; return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b }
});

/*
	UNVEIL
*/
(function ($) {
    $.fn.unveil = function (threshold, callback) {
        var $w = $(window),
            th = threshold || 0,
            retina = window.devicePixelRatio > 1,
            attrib = retina ? "data-original-retina" : "data-original",
            images = this,
            loaded;
        this.one("unveil", function () {
            var source = this.getAttribute(attrib);
            source = source || this.getAttribute("data-original");
            if (source) {
                this.setAttribute("src", source);
                if (typeof callback === "function") callback.call(this);
                animate($(this));
            }
        });


        function animate(_this) {
            if (!_this.hasClass('loadedImg')) {
                _this.css({ 'opacity': 0 }).load(function () {
                    setTimeout(function () {
                        _this.addClass('loadedImg').stop().animate({ "opacity": 1 }, 333);
                    }, 100);
                })
            }
        }

        function unveil() {
            var inview = images.filter(function () {
                var $e = $(this);
                if ($e.is(":hidden")) return;
                var wt = $w.scrollTop(),
                    wb = wt + $w.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();
                return eb >= wt - th && et <= wb + th;
            });
            loaded = inview.trigger("unveil");
            images = images.not(loaded);
        }
        $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);
        unveil();
        return this
    }
})(window.jQuery || window.Zepto);

/*
	minusPopup
	ex:
		$('body').minusPopup({ 
				openWith: 'auto', 
				content: $('.content').html() || '', 
				customClass: 'ems-custom-class', 
				width: 920, 
				widthStyle: 'max-width', 
				height: 500 
			});	
*/
(function ($) {
    $.fn.extend({
        minusPopup: function (options, callback) {
            var defaults = {
                width: 0,						//Popupin genisligi (responsive için deger 0 verilmelidir)
                height: 0,						//Popupin yüksekligi (içerige göre yükseklik almasi gerekiyorsa deger 0 verilmelidir)
                timeout: 0,						//Popup otomatik kapanma süresi (0 ise otomatik kapanmaz)
                openWith: 'click',				//Popupin ne sekilde açilacagi (click | auto)
                closeWith: '.btnMinPpCl', 		//Kapat buttonu disinda baska herhangi bir yere tiklandiginda popupin kapanabilmesi
                customClass: '',				//Popupi Özellestirmek için özel bir class eklenebilir
                header: '',						//Popupin basligi
                content: '',					//Popupta yer alacak olan içerik (Not: Tek satirda olacak sekilde yazilmalidir.)
                type: 'content',				//Popup content tipi (content | iframe | image | object)
                href: '',						//"image" kullaniliyorsa ve linki varsa "href" i buraya yazilir. Url'de http var ise yeni pencerede a�ar
                target: 'self',					//"imageLink" targetini belirler
                callBack: '',					//Popupin açilmasi esnasinda herhangi baska bir kodun tetiklenmesi
                fire: '',					//Popupin kapanmasi sonrasinda herhangi baska bir kodun tetiklenmesi

                //
                cookie: null,                   //{ name: 'cookie-name', minutes: 5 }

                // plugin ekstra ozellik
                titleClass: '',
                columnClass: 'col-md-10 col-md-offset-1',
                closeIcon: true,
                closeIconClass: 'btnMinPpCl',
                containerFluid: false,
                theme: 'light',
                type: 'yellow',
                boxWidth: '50%'
            };
            var option = $.extend(defaults, options);
            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    uty = {
                        detectEl: function (ID) { return ID.length > 0 ? true : false; },
                        cookie: function (o) {
                            var typ = o['typ'] || '', name = o['name'] || '';
                            if (typ == 'set') {
                                var date = new Date(), minutes = o['minutes'] || 5;
                                date.setTime(date.getTime() + (minutes * 60 * 1000));
                                $.cookie(name, o['value'] || '', { expires: date, path: '/' });
                            } else if (typ == 'get')
                                return $.cookie(name) || '';
                        }
                    },
                    main = {
                        el: { wrp: '.jconfirm', container: '.jconfirm-box-container', content: '.jconfirm-content' },
                        dialog: null,
                        getContent: function () {
                            var _t = this, htm = opt['content'] || '', typ = opt['type'] || '';
                            if (typ == 'image') {
                                htm = '<img class="minPpImg" border="0" src="' + htm + '" />';
                                if (opt['href'] != '')
                                    htm = '<a target="_' + opt['target'] + '" class="minPpImgLink" href="' + opt['href'] + '">' + htm + '</a>';
                            } else if (typ == 'iframe')
                                htm = '<iframe class="minPpIframe" frameborder="0" name="minPpIframe" style="margin:0; padding:0; width:100%; height:100%;" data-src="' + htm + '">';
                            else if (typ == 'object')
                                htm = $(htm).html() || '';

                            return htm;
                        },
                        cookies: function (o) {
                            var _t = this, typ = o['typ'] || 'get', c = opt['cookie'] || '', b = false;
                            if (c != '') {
                                if (typ == 'get') {
                                    if (uty.cookie({ name: c['name'] || '', typ: 'get' }) == 'true')
                                        b = true;
                                } else
                                    uty.cookie({ name: c['name'] || '', typ: 'set', minutes: c['minutes'] || 5, value: 'true' });
                            }

                            return b;
                        },
                        set: function () {
                            var _t = main;

                            if (_t.cookies({ typ: 'get' }))
                                return false;

                            _t.dialog = $.dialog({
                                backgroundDismiss: true,
                                title: opt['header'],
                                titleClass: opt['titleClass'],
                                content: _t.getContent(),
                                columnClass: opt['columnClass'] + ' ' + opt['customClass'],
                                closeIcon: opt['closeIcon'],
                                closeIconClass: opt['closeIconClass'],
                                containerFluid: opt['containerFluid'],
                                theme: opt['theme'],
                                boxWidth: opt['boxWidth'],
                                onContentReady: function () {
                                    var frm = $(_t.el.wrp).find('iframe');
                                    if (uty.detectEl(frm))
                                        frm.attr('src', frm.attr('data-src') || '');

                                    _t.callBack({ typ: 'onContentReady' });
                                },
                                contentLoaded: function (data, status, xhr) {
                                    _t.callBack({ typ: 'contentLoaded' });
                                },
                                onOpenBefore: function () {
                                    $(_t.el.wrp)
                                        .addClass(opt['customClass'])
                                        .addClass('type-' + opt['type'])
                                        .find(_t.el.container)
                                        .css({ 'max-width': opt['width'] || '100%' })
                                        .end()
                                        .find(_t.el.content)
                                        .css({ 'min-height': opt['height'] || '100%' });
                                },
                                onOpen: function () {
                                    _t.cookies({ typ: 'set' });
                                    _t.runIt(opt['callBack'] || '');
                                    _t.callBack({ typ: 'onOpen' });
                                },
                                onClose: function () {
                                    _t.runIt(opt['fire'] || '');
                                    _t.callBack({ typ: 'onClose' });
                                    $(_t.el.wrp)
                                        .removeClass(opt['customClass'])
                                        .removeClass('type-' + opt['type']);
                                    if (uty.detectEl($(_t.el.wrp).find('iframe')))
                                        $(_t.el.wrp).find('iframe').removeAttr('src');
                                }
                            });
                        },
                        runIt: function (k) {
                            if (k != '')
                                $.globalEval(k);
                        },
                        callBack: function (o) {
                            if (typeof callback !== 'undefined')
                                callback(o);
                        },
                        addEvent: function () {
                            var _t = this;
                            if (opt.openWith == 'click')
                                ID
                                    .unbind('click', _t.set)
                                    .bind('click', _t.set);
                            else
                                _t.set();
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };
                main.init();


            });
        }
    });
})(jQuery);

/*
	Input Styler v2.2.8 www.minus99.com - 2013	
*/
(function ($) {
    $.fn.extend({
        iStyler: function (options) {
            var defaults = {
                wrapper: false,
                customClass: '',
                passiveIco: '',
                activeIco: ''
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    obj = $(this),
                    tag = obj.prop("tagName").toLowerCase(),
                    sClass = '',
                    name, check,
                    customIcon = opt.passiveIco + opt.activeIco;

                if (tag == "select") {
                    var selText = $("option:selected", obj).text();

                    if (!obj.hasClass("sSelect"))
                        if (!opt.wrapper)
                            obj.css({ opacity: 0, "-webkit-appearance": "none" }).addClass("sSelect").before('<div class="sStylerWrp"><span class="sStyleHolder"><span class="sStyler">' + selText + '</span>' + customIcon + '</span></div>');
                        else
                            obj.css({ opacity: 0, "-webkit-appearance": "none" }).addClass("sSelect").wrap('<span class="sStylerMainWrp ' + opt.customClass + ' sStylerWrp_select"></span>').before('<div class="sStylerWrp"><span class="sStyleHolder"><span class="sStyler">' + selText + '</span>' + customIcon + '</span></div>');

                    obj.change(function () {
                        selText = $('option:selected', obj).text();
                        obj.prev(".sStylerWrp").children(".sStyleHolder").children(".sStyler").text(selText);
                    });

                } else if (tag == "input" && obj.attr("type") == "checkbox") {

                    if (!obj.hasClass("sCheckbox")) {

                        sClass = (obj.is(":checked")) ? sClass + ' checked' : '';

                        if (!opt.wrapper)
                            obj.addClass("sCheckbox").before('<span class="cStyler' + sClass + '">' + customIcon + '</span>');
                        else
                            obj.addClass("sCheckbox").wrap('<span class="sStylerMainWrp ' + opt.customClass + ' sStylerWrp_checkbox"></span>').before('<span class="cStyler' + sClass + '">' + customIcon + '</span>');

                    }

                    obj.prev("span.cStyler").unbind('click').click(function () {

                        check = !obj.is(":checked");

                        if (obj.onclick != undefined) {
                            obj.attr("checked", check).click();
                            obj.attr("checked", check);
                        } else {
                            obj.click();
                        }

                        if (check) {
                            $(this).addClass("checked");
                        } else {
                            $(this).removeClass("checked");
                        }
                    });

                    obj.change(function () {
                        if (obj.is(":checked"))
                            obj.prev("span.cStyler").addClass("checked");
                        else
                            obj.prev("span.cStyler").removeClass("checked");
                    });

                } else if (tag == "input" && obj.attr("type") == "radio") {

                    if (!obj.hasClass("sRadio")) {
                        name = obj.attr("name");
                        var nameStr;

                        nameStr = (name == undefined) ? '' : ' name="' + name + '"';

                        if (obj.is(":checked")) sClass = sClass + ' checked'; else sClass = '';

                        if (!opt.wrapper)
                            obj.addClass("sRadio").before('<span' + nameStr + ' class="rStyler' + sClass + '">' + customIcon + '</span>');
                        else
                            obj.addClass("sRadio").wrap('<span class="sStylerMainWrp ' + opt.customClass + ' sStylerWrp_radio"></span>').before('<span' + nameStr + ' class="rStyler' + sClass + '">' + customIcon + '</span>');

                    }

                    obj.prev("span.rStyler").unbind('click').click(function () {
                        if (!obj.is(":checked")) {
                            check = !obj.is(":checked");

                            if (obj.onclick != undefined) {
                                obj.attr("checked", check).click();
                                obj.attr("checked", check);
                            } else {
                                obj.click();
                            }

                            if (name != undefined)
                                $('span.rStyler[name="' + name + '"]').removeClass("checked");

                            $(this).addClass("checked");
                        }
                    });

                    obj.change(function () {
                        if (obj.is(":checked")) {
                            if (name != undefined) $('span.rStyler[name="' + name + '"]').removeClass("checked");
                            obj.prev("span.rStyler").addClass("checked");
                        }
                    });

                }

            });
        }
    });
})(jQuery);

/*
    Minus Swiper
*/
(function ($) {
    $.fn.extend({
        minusSwiper: function (options, callback) {
            var defaults = {
                innerClass: '> .swiper-inner',
                wrapperClass: '.swiper-wrapper',
                slideClass: '> .swiper-slide',
                lazy: '.lazy, .lazy-load, .lazy-back-load, .lazyload, .lazy-swiper, .lazy-mobi-swiper, .lazy-desktop-swiper',
                videoStretching: 'fill'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    duration = ID.attr('data-duration') || '',
                    _dispatch = function (obj) {
                        obj['current'] = main.current || {};
                        stage.dispatchEvent("CustomEvent", "SWIPER_ACTIVE_ELEMENT", $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj['current'] = main.current || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    _videos = {
                        el: {
                            con: '.slide-video',
                            button: '.slide-video-btn',
                            video: 'video',
                            activeVideo: '.swiper-slide-active .slide-video-btn'

                        },
                        cls: {
                            activeVideo: 'video-active',
                            isPause: 'isPause',
                            isPlay: 'isPlay'
                        },
                        arr: {},
                        activeted: function () {
                            var _t = this,
                                elm = ID.find(_t.el.activeVideo);

                            if (uty.detectEl(elm))
                                elm.get(0).click();
                        },
                        disabled: function () {
                            var _t = this;

                            ID
                                .find('.' + _t.cls['isPlay'])
                                .removeClass(_t.cls['isPlay'])
                                .removeClass(_t.cls['activeVideo']);

                            $.each(_t.arr, function (ind, item) {
                                item.pause();
                            });

                            _t.activeted();
                        },
                        playVideo: function (ths) {
                            var _t = this;
                            var order = ths.attr('data-order') || '',
                                prts = ths.parents('li').eq(0),
                                vid = _t.arr[order] || '';

                            if (vid != '') {
                                vid.play();
                                prts.addClass(_t.cls['isPlay']).addClass(_t.cls['activeVideo']);
                                _autoPlay({ type: 'stop' });
                            } else
                                console.error('swiper video html kontrol et');
                        },
                        addEvent: function () {
                            var _t = this;
                            ID
                                .find(_t.el.button)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    evt.preventDefault();
                                    _t.playVideo($(this));
                                });
                        },
                        setVideo: function (o) {
                            o = o || {};
                            var _t = this,
                                k = o['ID'],
                                ind = o['order'],
                                vid = new MediaElementPlayer(k, {
                                    stretching: opt['videoStretching'] || 'fill',
                                    success: function (player, node) {
                                        player.addEventListener('ended', function (e) {
                                            main.current.slideNext();
                                        });
                                    }
                                });
                            _t.arr[ind] = vid;
                        },
                        initPlugin: function () {
                            var _t = this;
                            ID
                                .find(_t.el.con)
                                .each(function (ind) {
                                    var ths = $(this),
                                        button = ths.siblings(_t.el.button);

                                    button.attr('data-order', ind);

                                    if (uty.detectEl(ths.find(_t.el.video)))
                                        _t.setVideo({ ID: ths.find(_t.el.video).get(0), order: ind });
                                });
                        },
                        init: function () {
                            var _t = this;
                            if (ID.find(_t.el.con).length > 0) {
                                _t.initPlugin();
                                _t.addEvent();
                            }

                        }
                    },

                    _progress = {
                        bar: null,
                        el: {
                            con: '#circleprogress',
                        },
                        set: function (percent) {
                            var _t = this;
                            if (_t.bar != null)
                                _t.bar.set(percent);
                        },
                        init: function () {
                            var _t = this,
                                con = ID.find(_t.el.con);
                            if (uty.detectEl(con)) {

                                if (_t.bar == null) {
                                    _t.bar = new ProgressBar.Circle(con.get(0), {
                                        color: '#FFF',
                                        strokeWidth: 1,
                                        trailWidth: 1,
                                        easing: 'easeInOut',
                                        duration: duration,
                                        text: {
                                            autoStyleContainer: false
                                        },
                                        from: { color: '#FFF', width: 1 },
                                        to: { color: '#FFF', width: 1 },
                                        step: function (state, circle) {
                                            circle.path.setAttribute('stroke', state.color);
                                            circle.path.setAttribute('stroke-width', state.width);

                                            //var value = Math.round(circle.value() * 100);
                                            var value = Math.round((duration - (circle.value() * duration)) / 1000);
                                            if (value === 0) {
                                                circle.setText('');
                                            } else {
                                                circle.setText(value);
                                            }
                                        }
                                    });

                                    _t.bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                                    _t.bar.text.style.fontSize = '2rem';
                                }

                                _t.bar.animate(1);
                            }
                        },
                        move: function () {
                            /* 
                                aktif bullet içerisine progress taşımak
                            */
                            var _t = this,
                                con = ID.find(_t.el.con);
                            if (uty.detectEl(con)) {
                                var elm = ID.find('.swiper-pagination-bullet-active');
                                if (uty.detectEl(elm))
                                    elm.append(con);
                            }
                        }
                    },

                    _autoControl = {
                        stm: null,
                        clear: function () {
                            var _t = this;
                            if (_t.stm != null) {
                                clearTimeout(_t.stm);
                                _progress.set(0);
                            }
                        },
                        animate: function () {
                            var _t = this;
                            _progress.init();
                        },
                        start: function () {
                            var _t = this;

                            if (duration != '' && duration != 0) {
                                _t.clear();
                                _t.animate();
                                _t.stm = setTimeout(function () {
                                    if (main.current !== null)
                                        main.current.slideNext();
                                }, duration);
                            }
                        }
                    },

                    _autoPlay = function (o) {
                        o = o || {};
                        var current = main['current'] || '',
                            type = o['type'] || 'start';

                        if (duration != 0 && duration != '' && current != '') {
                            if (type == 'start')
                                _autoControl.start();
                            else
                                _autoControl.clear();
                        }
                    },


                    _lazy = function (o) {
                        o = o || {};

                        var target = (o['target'] || '');

                        if (uty.detectEl(target))
                            target
                                .each(function () {
                                    var ths = $(this),
                                        order = ths.attr('data-order') || 0,
                                        lazy = ths.add(ID.find('[data-order="' + order + '"]')).find(opt['lazy']);

                                    if (uty.detectEl(lazy))
                                        lazy
                                            .each(function () {
                                                var ths = $(this);
                                                ths.removeClass('lazy-swiper lazy-mobi-swiper lazy-desktop-swiper');
                                                uty.lazyLoad({ ID: ths });
                                            });
                                });
                    },

                    _detectPosition = {
                        get: function (k) {
                            var b = false,
                                padding = 50,
                                con = uty.detectEl(ID.find(opt['innerClass'])) ? ID.find(opt['innerClass']) : ID,
                                o1 = { x: con.offset().left, y: con.offset().top, width: con.width() - padding, height: con.height() },
                                o2 = { x: k.offset().left, y: k.offset().top, width: k.width(), height: k.height() };
                            if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y)
                                b = true;

                            return b;
                        },
                        set: function () {
                            var _t = this,
                                wrp = ID.find(opt['wrapperClass']),
                                sld = wrp.find(opt['slideClass']);

                            if (uty.detectEl(sld))
                                setTimeout(function () {
                                    sld
                                        .removeClass(main.cls['active'])
                                        .each(function () {
                                            var ths = $(this);
                                            if (_t.get(ths))
                                                ths.addClass(main.cls['active']);
                                        });

                                    var active = wrp.find(opt['slideClass'] + '.' + main.cls['active']);
                                    _lazy({ target: active });
                                    _dispatch({ target: active });
                                    _callback({ type: 'lazyload', value: active });

                                }, 222);
                        }
                    },

                    main = {
                        cls: {
                            imageLoaded: 'image-loaded',
                            imageLazy: 'lazy-load',
                            active: 'slide-active',
                            noResult: 'no-result',
                            itemCount: 'item-',
                            noControls: 'no-controls'
                        },
                        current: null,
                        objAddEvent: function (obj) {
                            obj = obj || {};
                            var _t = this;

                            obj['on'] = {
                                init: function () {
                                    _detectPosition.set();

                                    setTimeout(function () {
                                        _videos.disabled();
                                    }, 333);
                                    setTimeout(function () {
                                        main.control();
                                        _progress.move();
                                        _autoPlay({ type: 'start' });
                                    }, 50);

                                    _callback({ type: 'init' });
                                    _dispatch({ type: 'init' });
                                },
                                touchStart: function () {
                                    _autoPlay({ type: 'stop' });
                                    _callback({ type: 'touchStart' });
                                    _dispatch({ type: 'touchStart' });
                                },
                                touchEnd: function () {
                                    _autoPlay({ type: 'start' });
                                    _callback({ type: 'touchEnd' });
                                    _dispatch({ type: 'touchEnd' });
                                },
                                slideChangeTransitionStart: function (s) {
                                    _autoPlay({ type: 'stop' });
                                    _callback({ type: 'slideChangeTransitionStart', value: s });
                                    _dispatch({ type: 'slideChangeTransitionStart', value: s });
                                },
                                slideChangeTransitionEnd: function (s) {
                                    _detectPosition.set();
                                    _autoPlay({ type: 'start' });
                                    _progress.move();
                                    _videos.disabled();
                                    _callback({ type: 'slideChangeTransitionEnd', value: s });
                                    _dispatch({ type: 'slideChangeTransitionEnd', value: s });
                                },
                                resize: function () {
                                    main.control();
                                }
                            };
                            return obj;
                        },
                        addOrder: function () {
                            var _t = this,
                                wrp = ID.find(opt['wrapperClass']),
                                sld = wrp.find(opt['slideClass']),
                                n = sld.length;

                            ID
                                .addClass(_t.cls['itemCount'] + n)
                                .find(opt['wrapperClass'])
                                .find(opt['slideClass'])
                                .each(function (i, k) {
                                    $(this).attr('data-order', i);
                                });

                            if (n == 0)
                                ID.addClass(_t.cls['noResult']);

                            return n;
                        },
                        control: function () {
                            var _t = this,
                                sp = ID.find('> .swiper-pagination');

                            /* 
                                pagination da tek bir eleman varsa navigation ve pagination gizlemek
                            */
                            if (uty.detectEl(sp)) {
                                if (sp.find('> span').length > 1)
                                    ID.removeClass(_t.cls['noControls']);
                                else
                                    ID.addClass(_t.cls['noControls']);
                            }
                        },
                        init: function () {
                            var _t = this,
                                n = _t.addOrder();

                            if (n > 1) {
                                var key = ID.attr('data-swiper') || 'main',
                                    prop = _t.objAddEvent((SITE_CONFIG['plugin']['swiper'] || {})[key] || SITE_CONFIG['plugin']['swiper']['main'] || {});
                                _t.current = new Swiper(ID, prop);
                            } else {
                                ID.addClass(_t.cls['noControls']).find('.swiper-slide').addClass('swiper-slide-active');
                                _lazy({ target: ID });
                                setTimeout(function () {
                                    _videos.disabled();
                                }, 333);
                            }
                        }
                    };
                main.init();
                _videos.init();



                this.getCurrent = function () {
                    if (main.current != null)
                        return main.current;
                };

                this.adjust = function () {
                    if (main.current != null)
                        _detectPosition.set();
                };

                this.update = function () {
                    if (main.current != null) {
                        var wrp = ID.find(opt['wrapperClass']),
                            sld = wrp.find(opt['slideClass']);
                        sld.css({ width: '' });
                        (function () { main.current.update(); }());
                    }
                };

                this.destroy = function () {
                    if (main.current != null)
                        main.current.destroy(false, true);
                };

                this.focused = function (index) {
                    if (main.current != null)
                        main.current.slideTo(index, 222);
                };

            });
        }
    });
})(jQuery);

/* 
    MINUS TAB MENU 
*/
(function ($) {
    $.fn.extend({
        minusTab: function (options, callback) {
            var defaults = {
                swiperWrapperClass: '.swiper-container',
                content: '> .ems-tab-content > [rel]', // content
                tabNav: '> .ems-tab-header > [rel]', // tab menu button
                accNav: '> .ems-tab-content > div > .ems-tab-inner-header', // accordion menu button
                begin: 0,
                target: '.emosInfinite',
                ajx: {
                    target: '.urnList .emosInfinite',
                    typ: 'append'
                }
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    content = ID.find(opt['content']),
                    tabNav = ID.find(opt['tabNav']),
                    accNav = ID.find(opt['accNav']),
                    main = {
                        cls: {
                            selected: 'selected',
                            ajx: 'ajx-loading',
                            loaded: 'ajx-loaded',
                            scrollerTrigger: 'scroller-trigger'
                        },
                        clicklable: true,
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                ID.addClass(_t.cls['ajx']);
                            else
                                ID.removeClass(_t.cls['ajx']);
                        },
                        getUri: function (o) {
                            /* 
                               ex: /usercontrols/urunDetay/ajxIlgiliUrun.aspx?lang={{lang}}&urn={{prdCode}}&kat={{prdCat}}&ps=100&rp=1 
                            */
                            var _t = this,
                                elm = o['ID'],
                                uri = uty.cleanText(elm.attr('data-ajx') || ''),
                                code = uty.cleanText(elm.attr('data-code') || ''),
                                cat = uty.cleanText(elm.attr('data-cat') || '');
                            return uri.replace(/{{lang}}/g, lang).replace(/{{prdCode}}/g, code).replace(/{{prdCat}}/g, cat);
                        },
                        ajx: function (o) {
                            var _t = this,
                                target = o['ID'],
                                uri = o['uri'] || '';

                            if (uty.detectEl(target) && !target.hasClass(_t.cls['loaded'])) {
                                _t.clicklable = false;
                                _t.loading('show');
                                uty.ajx({ uri: uri }, function (d) {
                                    var responseType = 'error';
                                    if (d['type'] == 'success') {
                                        responseType = 'success';
                                        target.addClass(_t.cls['loaded']);
                                        d = uty.clearScriptTag(d['val'] || '');
                                        d = $('<div>' + d + '</div>').find(opt.ajx.target).html() || '';
                                        if (opt.target !== '')
                                            target = target.find(opt.target);

                                        if (uty.detectEl(target)) {
                                            var typ = opt.ajx['typ'] || '';
                                            if (typ == 'append') target.append(d);
                                            else if (typ == 'prepend') target.append(d);
                                            else if (typ == 'before') target.before(d);
                                            else if (typ == 'after') target.after(d);
                                            else target.html(d);
                                        }
                                    }
                                    stage.dispatchEvent("CustomEvent", "AJX_TAB_LOADED", { ID: ID, target: target, type: responseType });
                                    _t.loading('hide');
                                    _t.clicklable = true;
                                });
                            }
                        },
                        updateSwiper: function (target) {
                            var _t = this,
                                elm = target.find(opt['swiperWrapperClass']);
                            if (uty.detectEl(elm)) {
                                elm = elm.get(0);
                                if (typeof elm.update !== 'undefined')
                                    elm.update();
                            }
                        },
                        addEvent: function () {
                            var _t = this;

                            tabNav
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        rel = ths.attr('rel') || '';

                                    if (rel != '' && _t.clicklable) {
                                        var target = ID.find(opt['content'] + '[rel="' + rel + '"]'),
                                            uri = _t.getUri({ ID: ths });

                                        target.add(ths).addClass(_t.cls['selected']).siblings().removeClass(_t.cls['selected']);

                                        if (uri != '')
                                            _t.ajx({ ID: target, uri: uri });

                                        _t.updateSwiper(target);
                                    }
                                });


                            accNav
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        rel = ths.parent().attr('rel') || '';

                                    if (rel != '' && _t.clicklable) {
                                        var target = ID.find(opt['content'] + '[rel="' + rel + '"]'),
                                            uri = _t.getUri({ ID: ths });

                                        if (target.hasClass(_t.cls['selected']))
                                            target.add(target.siblings()).removeClass(_t.cls['selected']);
                                        else
                                            target.add(ths).addClass(_t.cls['selected']).siblings().removeClass(_t.cls['selected']);

                                        if (uri != '')
                                            _t.ajx({ ID: target, uri: uri });

                                        _t.updateSwiper(target);
                                    }
                                });

                            if (!ID.hasClass(_t.cls['scrollerTrigger']))
                                _t.trigger();
                        },
                        trigger: function () {
                            var _t = this;

                            var elm = ID.find(opt['tabNav'] + '.' + _t.cls['selected']);
                            if (!uty.detectEl(elm))
                                elm = ID.find(opt['tabNav']).eq(0);
                            elm.click();

                        },
                        adjust: function () {
                            var _t = this;
                            if (ID.hasClass(_t.cls['scrollerTrigger'])) {
                                if (uty.detectPosition({ ID: ID })) {
                                    ID.removeClass(_t.cls['scrollerTrigger']);
                                    _t.trigger();
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(content) && (uty.detectEl(tabNav) || uty.detectEl(accNav)))
                                _t.addEvent();
                        }
                    };
                main.init();

                // public fonk
                this.adjust = function () {
                    main.adjust();
                };
            });
        }
    });
})(jQuery);

/* 
    MINUS SYSTEM WIDGET 
*/
(function ($) {
    $.fn.extend({
        minusSystemWidget: function (options, callback) {
            var defaults = {
                target: '.emosInfinite',
                ajx: {
                    target: '.urnList .emosInfinite',
                    itemTarget: '> li',
                    typ: 'append'
                }
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        cls: {
                            loading: 'ajx-loading',
                            noResult: 'no-result',
                            found: 'results-found',
                            active: 'widget-active',
                            items: 'items-',
                            scrollerTrigger: 'scroller-trigger',
                            slideClass: 'swiper-slide',
                            cartPrdCode: '.ems-grid-cart [data-prd-code]'
                        },
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                ID.addClass(_t.cls['loading']);
                            else
                                ID.removeClass(_t.cls['loading']);
                        },
                        getPrdCode: function () {
                            return uty.cleanText(ID.attr('data-code') || $('[id$="hdnURN_KOD"]').val() || $(opt['cartPrdCode']).map(function () { return $(this).attr('data-prd-code') || '' }).get().join(',') || '');
                        },
                        getCatCode: function () {
                            return uty.cleanText(ID.attr('data-cat') || uty.trimText(minusLoc.get('?', 'kat', urlString)) || '');
                        },
                        getUri: function () {
                            /* 
                               ex: /usercontrols/urunDetay/ajxIlgiliUrun.aspx?lang={{lang}}&urn={{prdCode}}&kat={{prdCat}}&ps=100&rp=1 
                            */
                            var _t = this,
                                uri = uty.cleanText(ID.attr('data-uri') || ''),
                                code = _t.getPrdCode(),
                                cat = _t.getCatCode();
                            return uri.replace(/{{lang}}/g, lang).replace(/{{prdCode}}/g, code).replace(/{{prdCat}}/g, cat);
                        },
                        set: function () {
                            var _t = this,
                                uri = _t.getUri();

                            _t.loading('show');
                            uty.ajx({ uri: uri }, function (d) {
                                var responseType = 'error';
                                if (d['type'] == 'success') {
                                    responseType = 'success';
                                    d = uty.clearScriptTag(d['val'] || '');

                                    var ajxTargetWrp = $('<div>' + d + '</div>'),
                                        ajxTarget = ajxTargetWrp.find(opt.ajx.target).html() || '',
                                        ajxTargetItem = ajxTargetWrp.find(opt.ajx.target).find(opt.ajx.itemTarget),
                                        target = ID.find(opt.target);

                                    if (uty.detectEl(target) && uty.detectEl(ajxTargetItem)) {
                                        var typ = opt.ajx['typ'] || '';
                                        if (typ == 'append') target.append(ajxTarget);
                                        else if (typ == 'prepend') target.append(ajxTarget);
                                        else if (typ == 'before') target.before(ajxTarget);
                                        else if (typ == 'after') target.after(ajxTarget);
                                        else target.html(ajxTarget);

                                        ID
                                            .addClass(_t.cls['items'] + ajxTargetItem.length)
                                            .addClass(_t.cls['found'])
                                            .addClass(_t.cls['active']);
                                    } else
                                        ID
                                            .addClass(_t.cls['noResult']);
                                }
                                stage.dispatchEvent("CustomEvent", "SYSTEM_WIDGET_LOADED", { ID: ID, type: responseType });
                                _t.loading('hide');
                            });
                        },
                        adjust: function () {
                            var _t = this;
                            if (ID.hasClass(_t.cls['scrollerTrigger'])) {
                                if (uty.detectPosition({ ID: ID })) {
                                    ID.removeClass(_t.cls['scrollerTrigger']);
                                    _t.set();
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (!ID.hasClass(_t.cls['scrollerTrigger']))
                                _t.set();
                        }
                    };
                main.init();

                // public fonk
                this.adjust = function () {
                    main.adjust();
                };
            });
        }
    });
})(jQuery);

/* 
    MINUS MENU 
*/
(function ($) {
    $.fn.extend({
        minusMenu: function (options, callback) {
            var defaults = {
                closeElem: '',
                items: '> ul > li',
                siblings: 'li',
                controls: '> ul, > div',
                customClass: 'selected',
                openedDelay: 200,
                closedDelay: 555,
                eventType: 'hover',
                clickedElem: '> a',
                bdyClicked: false,
                isVisible: '',
                setPos: '', // menuyu kapsayan hedef alanının classı
                overlay: false,
                bdyCls: '',
                bdyCls2: '',
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var o = options,
                    el = $(this),
                    items = el.find(o.items),
                    lazyImage = function (obj) {
                        obj = obj || {};
                        var typ = obj['typ'] || '';
                        if (typ == 'opened')
                            uty.lazyImage({ ID: el.find('> ul > li' + '.' + o.customClass) });
                    },
                    cllbck = function (o) {
                        o = o || {};
                        if (typeof callback !== 'undefined') {
                            o['ID'] = el;
                            callback(o);
                        }
                    },
                    main = {
                        stm: null,
                        clearTm: function () {
                            var _t = this;
                            if (_t.stm != null)
                                clearTimeout(_t.stm);
                        },
                        detectEl: function (ID) { return ID.length > 0 ? true : false; },
                        isVisible: function () { return uty.visibleControl(); },
                        overlayControls: function (k) {
                            var _t = this;
                            if (o.overlay) {
                                if (k == 'opened') {
                                    bdy.addClass(o.bdyCls);
                                    setTimeout(function () {
                                        bdy.addClass(o.bdyCls2);
                                    }, 100);
                                }
                                else {
                                    var e = el.find('> ul > li' + '.' + o.customClass);
                                    if (!_t.detectEl(e)) {
                                        bdy.removeClass(o.bdyCls2);
                                        setTimeout(function () {
                                            bdy.removeClass(o.bdyCls);
                                        }, 100);
                                    }

                                }
                            }
                            lazyImage({ typ: k });
                            setTimeout(function () { cllbck({ typ: k }); }, 100);
                        },
                        setPos: function (ID) {
                            if (o.setPos != '') {
                                var _t = this,
                                    k = $(o.controls, ID),
                                    e = $(o.setPos);
                                if (_t.detectEl(k) && _t.detectEl(e)) {
                                    var x1 = ID.offset().left + 810, x2 = e.width() + e.offset().left;
                                    if (x1 >= x2) k.css({ 'left': x2 - x1 });
                                }
                            }
                        },
                        closeElem: function () {
                            if (o.closeElem != '')
                                $(o.closeElem).each(function () {
                                    var ths = $(this).get(0);
                                    if (typeof ths.closed !== 'undefined')
                                        ths.closed();
                                });
                        },
                        bootstrapMenuTrigger: function (o) {
                            var type = o['type'] || 'add',
                                ID = o['ID'];
                            /* 
                                bootstrap ozel yazıldı
                            */
                            el
                                .find('[aria-expanded]')
                                .attr('aria-expanded', 'false')
                                .end()
                                .find('.collapse')
                                .removeClass('show');

                            if (type == 'add') {
                                ID
                                    .find('[aria-expanded]')
                                    .attr('aria-expanded', 'true')
                                    .end()
                                    .find('.collapse')
                                    .addClass('show');
                            }
                        },
                        events: {
                            onMouseEnter: function () {
                                var _t = main, ths = $(this);

                                if (_t.isVisible()) return false;

                                if (_t.detectEl($(o.controls, ths))) {
                                    _t.clearTm();
                                    _t.stm = setTimeout(function () {
                                        _t.closeElem();
                                        ths.addClass(o.customClass).siblings(o.siblings).removeClass(o.customClass);
                                        _t.bootstrapMenuTrigger({ type: 'add', ID: ths });
                                        _t.setPos(ths);
                                        _t.overlayControls('opened');
                                    }, o.openedDelay);
                                }
                            },
                            onMouseLeave: function () {
                                var _t = main, ths = $(this);
                                if (_t.isVisible()) return false;
                                _t.clearTm();
                                _t.stm = setTimeout(function () {
                                    ths.add(ths.siblings(o.siblings)).removeClass(o.customClass);
                                    _t.bootstrapMenuTrigger({ type: 'remove' });
                                    _t.overlayControls('closed');
                                }, o.closedDelay);
                            },
                            onClick: function (e) {
                                var _t = main, ths = $(this).parent(o.siblings);
                                if (_t.detectEl($(o.controls, ths)) && !_t.isVisible()) {
                                    e.preventDefault();
                                    if (ths.hasClass(o.customClass)) {
                                        ths.removeClass(o.customClass).siblings(o.siblings).removeClass(o.customClass);
                                        _t.bootstrapMenuTrigger({ type: 'remove' });
                                        _t.overlayControls('closed');
                                    } else {
                                        ths.addClass(o.customClass).siblings(o.siblings).removeClass(o.customClass);
                                        _t.setPos(ths);
                                        _t.bootstrapMenuTrigger({ type: 'add', ID: ths });
                                        _t.overlayControls('opened');
                                    }
                                }
                            },
                            bdyClicked: function (e) {
                                var _t = main;
                                if (!el.is(e.target) && el.has(e.target).length === 0 && !_t.isVisible()) {
                                    el.find('> ul > li').removeClass(o.customClass);
                                    _t.bootstrapMenuTrigger({ type: 'remove' });
                                    _t.overlayControls('closed');
                                }
                            }
                        },
                        addEvent: function () {
                            var _t = this;

                            if (o.eventType == 'hover')
                                items.bind('mouseenter', _t.events.onMouseEnter).bind('mouseleave', _t.events.onMouseLeave);
                            else if (o.eventType == 'click')
                                $(o.clickedElem, items).bind('click', _t.events.onClick);

                            if (o.bdyClicked)
                                $('body, html').bind('click touchstart', _t.events.bdyClicked);
                        },
                        destroy: function () {
                            var _t = this;
                            $('.' + o.customClass, el).removeClass(o.customClass);
                            _t.overlayControls('closed');
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };


                this.closed = function () {
                    if (main.stm != null) clearTimeout(main.stm);
                    main.destroy()
                };

                main.init();
            })
        }
    })
})(jQuery, window);

/* 
    MINUS DROPDOWN 
*/
(function ($) {
    $.fn.extend({
        minusDropDown: function (options, callback) {
            var defaults = {
                closeElem: '',
                type: "hover",
                customClass: "hover",
                bdyCls: "",
                bdyCls2: "",
                delay: 555,
                openedDelay: 0,
                className: "",
                clicked: "",
                closedBtn: '',
                openedControl: "",
                hideDropDown: [],
                attachmentDiv: null,
                isVisible: null,
                overlay: null,
                parents: null,
                toggle: true,
                bdyClicked: true
            };
            var options = $.extend(defaults, options);
            return this.each(function () {

                var holder = $(this),
                    o = options,
                    attachmentDiv = o.attachmentDiv != null ? $(o.attachmentDiv) : null,
                    stm = null,
                    bdy = $('body');

                if (holder.hasClass('activePlug')) return false;

                function init() {
                    if (o.type == "hover") {
                        holder.mouseenter(events.mouseenter).mouseleave(events.mouseleave);
                        if (attachmentDiv != null) attachmentDiv.mouseenter(events.mouseenter).mouseleave(events.mouseleave)

                        $("body, html").bind('click touchstart', events.bodyClicked);
                    }
                    else if (o.type == "click") {
                        $(o.clicked, holder).bind('click', events.clicked);
                        if (o.bdyClicked)
                            $("body, html").bind('click touchstart', events.bodyClicked);
                    } else if (o.type == "hoverClick") {
                        holder.mouseenter(events.onMouseenter).mouseleave(events.onMouseleave);
                        $(o.clicked, holder).bind('click', events.onClicked);
                        if (o.bdyClicked)
                            $("body, html").bind('click touchstart', events.bodyClicked);
                    }

                    $(o.closedBtn)
                        .unbind('click')
                        .bind('click', function () {
                            animate.closed();
                        });
                }
                var animate = {
                    opened: function () {
                        controls();
                        if (attachmentDiv != null) attachmentDiv.addClass(o.customClass);
                        holder.addClass(o.customClass);
                        if (o.parents != null) holder.parents(o.parents).addClass(o.customClass);
                        overlayControls('opened');
                        if (callback != undefined) callback("opened")
                    },
                    closed: function () {
                        if (attachmentDiv != null) attachmentDiv.removeClass(o.customClass);
                        holder.removeClass(o.customClass);
                        if (o.parents != null) holder.parents(o.parents).removeClass(o.customClass);
                        overlayControls('closed');
                        if (callback != undefined) callback("closed");
                        bdy.removeClass(o.bdyCls2);
                    }
                };

                function closeElem() {
                    if (o.closeElem != '')
                        $(o.closeElem).each(function () {
                            var ths = $(this).get(0);
                            if (typeof ths.closed !== 'undefined')
                                ths.closed();
                        });
                }
                var events = {

                    onMouseenter: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        if (o.openedControl != "") {
                            var ID = o.openedControl;
                            if (ID.html() == "") return false
                        }
                        stm = setTimeout(function () {
                            closeElem();
                            overlayControls('opened');
                        }, o.openedDelay)
                    },
                    onMouseleave: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        stm = setTimeout(function () {
                            if (!holder.hasClass(o.customClass))
                                overlayControls('closed');

                        }, o.delay)
                    },
                    onClicked: function () {
                        animate.opened();
                        bdy.addClass(o.bdyCls2);
                    },
                    mouseenter: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        if (o.openedControl != "") {
                            var ID = o.openedControl;
                            if (ID.html() == "") return false
                        }
                        stm = setTimeout(function () {
                            animate.opened()
                        }, o.openedDelay)
                    },
                    mouseleave: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        stm = setTimeout(function () {
                            animate.closed()
                        }, o.delay)
                    },
                    clicked: function () {
                        if (o.toggle) {
                            if (holder.hasClass(o.customClass)) animate.closed();
                            else animate.opened()
                        } else
                            animate.opened()
                    },
                    bodyClicked: function (e) {
                        if (!holder.is(e.target) && holder.has(e.target).length === 0)
                            animate.closed();
                    }
                };

                var lazyImage = function (obj) {
                    obj = obj || {};
                    var typ = obj['typ'] || '';
                    if (typ == 'opened')
                        uty.lazyImage({ ID: holder });
                };

                function overlayControls(k) {
                    if (o.overlay != null) {
                        if (k == 'opened') {
                            bdy.addClass(o.bdyCls);
                            if (o.bdyCls2 != '')
                                setTimeout(function () { bdy.addClass(o.bdyCls2); }, 100);
                        }
                        else {
                            if (o.bdyCls2 != '') {
                                bdy.removeClass(o.bdyCls2);
                                setTimeout(function () { bdy.removeClass(o.bdyCls); }, 333);
                            } else
                                bdy.removeClass(o.bdyCls);
                        }
                    }

                    lazyImage({ typ: k });
                }

                function visibleControls() {
                    if (o.isVisible != null)
                        return uty.visibleControl();
                }

                function controls() {
                    if (o.hideDropDown.length > 0)

                        for (var i = 0; i < o.hideDropDown.length; ++i)
                            if (o.hideDropDown[i].length > 0) o.hideDropDown[i][0].closed()
                }

                this.opened =
                    function () {
                        animate.opened()
                    };
                this.closed = function () {
                    if (stm != null) clearTimeout(stm);
                    animate.closed()
                };
                this.dispose = function () {
                    if (o.type == "hover") holder.unbind("mouseenter").unbind("mouseleave");
                    else $(o.clicked, holder).unbind("click")
                };
                this.live = function () {
                    if (o.type == "hover") holder.mouseenter(events.mouseenter).mouseleave(events.mouseleave);
                    else $(o.clicked, holder).click(events.clicked)
                };

                init();
            })
        }
    })
})(jQuery, window);

/* 
    MINUS CUSTOM SEARCH
*/
(function ($) {
    $.fn.extend({
        minusCustomSearch: function (options, callback) {
            var defaults = {
                btn: '.mini-search-info', // trigger button
                clearButton: '.mini-search-sub .sub-close',
                closeBtn: '.mini-search-overlay', // search close button
                input: '[id$="txtARM_KEYWORD"]', // search input

                // cls
                ajx: 'mini-search-ajx-loading',
                ready: 'mini-search-ready',
                animate: 'mini-search-animate',
                focused: 'mini-search-focused',
                keyup: 'mini-search-keyup',
                result: 'mini-search-result-found',
                noResult: 'mini-search-no-result',
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                bdy.addClass(opt['ajx']);
                            else
                                bdy.removeClass(opt['ajx']);
                        },
                        animate: function (k) {
                            var _t = this;
                            if (k == 'show')
                                uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls': [opt['ready'], opt['animate']] });
                            else
                                uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls': [opt['animate'], opt['ready']] });

                            stage.dispatchEvent("CustomEvent", "CUSTOM_SEARCH_STATE", { type: k });
                        },
                        destroy: function () {
                            var _t = this,
                                input = $(opt['input']);

                            bdy.removeClass(opt['ready']).removeClass(opt['animate']).removeClass(opt['focused']).removeClass(opt['keyup']).removeClass(opt['noResult']).removeClass(opt['result']);
                            input.val('').blur();
                        },
                        addEvent: function () {
                            var _t = this,
                                input = $(opt['input']),
                                btn = $(opt['btn']),
                                closeBtn = $(opt['closeBtn']),
                                clearButton = $(opt['clearButton']);

                            if (uty.detectEl(btn))
                                btn
                                    .unbind('click')
                                    .bind('click', function () {
                                        var ths = $(this);
                                        /*
                                        if (bdy.hasClass(opt['ready'])) {
                                            _t.animate('hide');
                                            input.blur();
                                        } else {
                                            _t.animate('show');
                                            input.focus();
                                        }
                                        */

                                       if (!bdy.hasClass(opt['ready'])){
                                            _t.animate('show');
                                            input.focus();
                                            setTimeout(function(){
                                                input.focus();
                                            }, 100);
                                       }
                                    });

                            if (uty.detectEl(clearButton))
                                clearButton
                                    .unbind('click')
                                    .bind('click', function () {
                                        input.val('').focus();
                                        bdy.removeClass(opt['result']).removeClass(opt['noResult']);
                                    });

                            if (uty.detectEl(closeBtn))
                                closeBtn
                                    .unbind('click')
                                    .bind('click', function () {
                                        _t.animate('hide');
                                        setTimeout(function () {
                                            _t.destroy();
                                        }, 555);
                                    });

                            if (uty.detectEl(input))
                                input
                                    .bind('focus', function () {
                                        bdy.addClass(opt['focused']);
                                    })
                                    .bind('blur', function () {
                                        var ths = $(this),
                                            msg = uty.cleanText($('[id$="lbfARM_MESAJ"]').text() || ''),
                                            val = uty.cleanText(ths.val() || '').replace(msg, '');
                                        if (val.length == 0)
                                            bdy.removeClass(opt['focused']);
                                    })
                                    .bind('keyup', function () {
                                        var ths = $(this),
                                            val = uty.cleanText(ths.val() || '');
                                        if (val.length > 0)
                                            bdy.addClass(opt['keyup']);
                                        else
                                            bdy.removeClass(opt['keyup']);

                                        if (val.length < 3)
                                            bdy.removeClass(opt['result']).removeClass(opt['noResult']);
                                    });
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl($(opt['input']))) {
                                _t.addEvent();
                            }

                        }
                    };
                main.init();

                this.searchReady = function () {
                    main.loading('show');
                };
                this.searchComplete = function () {
                    main.loading('hide');
                };

            });
        }
    });
})(jQuery);

/* 
    MINUS POPULAR WORLDS
*/
(function ($) {
    $.fn.extend({
        minusSearchPopularWorlds: function (options, callback) {
            var defaults = {
                input: '[id="txtARM_KEYWORD"]',
                btn: '[data-keyword]',
                attr: 'data-keyword'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        addEvent: function () {
                            var _t = this,
                                btn = ID.find(opt['btn']),
                                input = $(opt['input']);

                            if (uty.detectEl(btn))
                                btn
                                    .unbind('click')
                                    .bind('click', function (evt) {
                                        evt.preventDefault();
                                        var ths = $(this),
                                            keyword = uty.trimText(ths.attr(opt['attr']) || '');
                                        if (keyword != '') {
                                            input.val(keyword);
                                            generateSearchLink();
                                        }
                                    });
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);

/* 
    KATEGORI SWIPER
*/
(function ($) {
    $.fn.extend({
        MinusCategorySwiper: function (options, callback) {
            var defaults = {
                target: '.categories-append',
                activeElem: '.act',
                otherTarget: '.kutuKategori_icerik', // aktif elemanı bulamadığı zaman kullanılacak
                appendType: 'append', // append, prepend, before, after
                temp: '<div class="swiper-container swiper-categories not-trigger"><div class="swiper-inner">{{htm}}</div></div>',
                swiperTrigger: true,
                addAllBtn: null, // oluşturulan kategori ağacında tümü seçeneği isteniyorsa buraya eklenecek olan lbf belirtilir. 
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        getTemplate: function (o) {
                            var _t = this;
                            return opt['temp'].replace(/{{htm}}/g, o['htm'] || '');
                        },
                        add: function (o) {
                            var _t = this,
                                htm = o['htm'] || '',
                                typ = opt['appendType'] || '',
                                target = $(opt['target'] || '');

                            if (typ == 'append')
                                target.append(htm);
                            else if (typ == 'prepend')
                                target.append(htm);
                            else if (typ == 'before')
                                target.before(htm);
                            else if (typ == 'after')
                                target.after(htm);
                            else
                                target.html(htm);
                        },
                        getHtml: function (ID) {
                            var _t = this,
                                lbfAll = $(opt.addAllBtn),
                                btn = ID.find('> a');

                            /* tümü butonu eklenecek */
                            if (uty.detectEl(btn) && uty.detectEl(lbfAll)) {
                                btn.html(lbfAll.html());
                                btn = $('<li>' + (btn.get(0).outerHTML || '') + '</li>');
                                ID.find('ul').prepend(btn);
                            }

                            return ID.find('ul').get(0).outerHTML || '';
                        },
                        set: function () {
                            var _t = this,
                                act = uty.detectEl(ID.find(opt['activeElem'])) ? ID.find(opt['activeElem']) : $(opt['otherTarget']),
                                elm = uty.detectEl(act.find('> ul')) ? act : act.parents('li').eq(0);
                            if (uty.detectEl(elm.find('ul'))) {
                                _t.add({ htm: _t.getTemplate({ htm: _t.getHtml(elm.clone()) }) });
                                _t.initPlugins();
                            }

                        },
                        initPlugins: function () {
                            var _t = this;
                            if (opt['swiperTrigger']) {
                                var swiper = $(opt['target']).find('.swiper-container');
                                if (uty.detectEl(swiper)) {
                                    swiper
                                        .find('.swiper-inner > ul')
                                        .removeAttr('class')
                                        .removeAttr('style')
                                        .removeAttr('rel')
                                        .addClass('swiper-wrapper')
                                        .find('> li')
                                        .addClass('swiper-slide');

                                    var act = (swiper.find(opt['activeElem']).index() || 0) - 1;
                                    new Swiper(swiper, {
                                        initialSlide: act,
                                        slidesPerView: 'auto',
                                        slidesPerGroup: 1
                                    });
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            _t.set();
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);

/*
    Minus Filter
*/

(function ($) {
    $.fn.extend({
        MinusCategoryFilter: function (options, callback) {
            var defaults = {
                target: '.ems-page-product-list', // ajx ile htmlin dolacağı kapsayici div
                btn: '.urunKiyaslamaOzellik_ozellik a, .menuKategori li > a, .urunPaging_pageNavigation a', // ajx button olacak tüm nesneler buraya tanımlanır


                mobiBtn: '.btn-filter-popup', // mobilde filtre popup açma
                mobiCloseBtn: '.btn-filter-popup-close', // mobilde filtre popup açma

                // cls
                loading: 'ajx-loading', // ajx yüklenirken body class
                popupReady: 'ems-filter-ready', // mobile filtre açılması
                popupAnimate: 'ems-filter-animate'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'LIST_LOADED', $.extend({ ID: ID, con: opt['target'] }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID, target: opt['target'] }, obj));
                    },
                    main = {
                        el: {
                            target: opt['target'],
                            btn: opt['btn'],
                            mobiBtn: opt['mobiBtn'],
                            mobiCloseBtn: opt['mobiCloseBtn']
                        },
                        cls: {
                            loading: opt['loading'],
                            popupReady: opt['popupReady'],
                            popupAnimate: opt['popupAnimate']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        loading: function (k) {
                            var _t = this;
                            if (k == 'add')
                                bdy.addClass(_t['cls']['loading']);
                            else
                                bdy.removeClass(_t['cls']['loading']);
                        },
                        popup: function (k) {
                            var _t = this;
                            if (k == 'show') {
                                bdy.addClass(opt['popupReady']);
                                setTimeout(function () {
                                    bdy.addClass(opt['popupAnimate']);
                                }, 100);
                            } else {
                                bdy.removeClass(opt['popupAnimate']);
                                setTimeout(function () {
                                    bdy.removeClass(opt['popupReady']);
                                }, 300);
                            }
                        },
                        ajx: function (o) {
                            var _t = this, uri = o['uri'];
                            _t.loading('add');
                            uty.ajx({ uri: uri }, function (k) {
                                if (k['type'] == 'success')
                                    _t.ajxResult({ val: k['val'] || '', uri: uri });
                                _t.loading('remove');
                            });
                        },
                        ajxResult: function (o) {
                            var _t = this,
                                target = $(_t.el.target),
                                ajxTargetCon = $('<div>' + o['val'] + '</div>'), // ajx yüklenen sayfa
                                ajxTarget = ajxTargetCon.find(_t.el.target), // ajx yüklenen sayfanın içerisindeki hedef alan
                                ttl = ajxTargetCon.find('title').text() || document.title || '', // ajx yüklenen sayfanın title
                                uri = o['uri'],
                                type = 'error';

                            if (uty.detectEl(target) && uty.detectEl(ajxTarget)) {
                                type = 'success';
                                $('title').text(ttl); // ajx ile yüklenen sayfanın title mevcut title ile değiştirir
                                target.html(uty.clearScriptTag(ajxTarget.html() || ''));
                                history.pushState({ Url: uri, Page: ttl }, ttl, uri);
                                _t.trigger({ type: type });
                                _t.init(); // domdaki nesneler silindiği için filter tekrardan tetiklenir.
                            } else
                                _t.trigger({ type: type });
                        },
                        addEvent: function () {
                            var _t = this;
                            $(_t.el.btn)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    if (history.pushState) {
                                        evt.preventDefault();
                                        var ths = $(this), uri = ths.attr('href') || '';
                                        if (uri != '' && uri.indexOf('javascript') == -1)
                                            _t.ajx({ uri: uty.convertHttps(uri) });
                                    }
                                });


                            $(_t.el.mobiBtn)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    if (bdy.hasClass(_t.cls['popupReady']))
                                        _t.popup('hide');
                                    else
                                        _t.popup('show');
                                });

                            $(_t.el.mobiCloseBtn)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    _t.popup('hide');
                                });

                            if (history.pushState)
                                window.onpopstate = function (event) {
                                    setTimeout(function () {
                                        _t.ajx({ uri: uty.convertHttps(event.state ? event.state.Url : window.location.href) });
                                    }, 1);
                                };
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };
                main.init();

                this.setURI = function (o) {
                    o = o || {};
                    var uri = o['uri'] || '';
                    main.ajx({ uri: uty.convertHttps(uri) });
                };
            });
        }
    });
})(jQuery);

/* 
    liste görünüm
*/
(function ($) {
    $.fn.extend({
        minusViewer: function (options, callback) {
            var defaults = {
                btn: '[rel]',
                selected: 'selected',
                defaultSelected: {
                    mobi: 'view-2',
                    desktop: 'view-3'
                }
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'VIEW_TYPE_CLICKED', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        el: {
                            btn: opt['btn']
                        },
                        cls: {
                            selected: opt['selected']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        cookie: function (o) {
                            var _t = this,
                                typ = o['typ'] || '';

                            if (typ == 'set')
                                uty.Cookies({ name: 'viewType', typ: 'set', minutes: 14400, value: o['val'] || '' });
                            else if (typ == 'get')
                                return uty.Cookies({ name: 'viewType', typ: 'get' });
                        },
                        addEvent: function () {
                            var _t = this,
                                btn = ID.find(_t.el.btn),
                                cls = btn
                                    .map(function () {
                                        return $(this).attr('rel') || '';
                                    })
                                    .get()
                                    .join(' ');

                            btn
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        rel = ths.attr('rel') || '';

                                    btn
                                        .removeClass(_t.cls['selected']);

                                    ths.addClass(_t.cls['selected']);

                                    bdy.removeClass(cls).addClass(rel);

                                    _t.cookie({ typ: 'set', val: rel });

                                    setTimeout(function () {
                                        win.resize();
                                        _t.trigger({ type: 'clicked', target: ths });
                                    }, 10);
                                });
                        },
                        check: function () {
                            var _t = this,
                                btn = ID.find(_t.el.btn),
                                k = _t.cookie({ typ: 'get' }),
                                ds = opt['defaultSelected'] || {},
                                act = uty.visibleControl() ? ds['mobi'] : ds['desktop'] || '',
                                ind = uty.detectEl($(_t.el.btn + '[rel="' + act + '"]')) ? ($(_t.el.btn + '[rel="' + act + '"]').index() || 0) : ($(_t.el.btn + '.' + _t.cls['selected']).index() || 0);

                            if (k != '') {
                                k = $(_t.el.btn + '[rel="' + k + '"]');
                                if (uty.detectEl(k))
                                    ind = k.index();
                            }

                            btn
                                .eq(ind)
                                .click();
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(ID.find(_t.el.btn))) {
                                _t.addEvent();
                                _t.check();
                            }
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);

/* 
    liste sort
*/
(function ($) {
    $.fn.extend({
        minusListSort: function (options, callback) {
            var defaults = {
                drp: '[id$="drpSRT_SPR_AD"]',
                btn: '[rel]',

                clearBtn: '.btn-sort-clear',
                mobiBtn: '.btn-sort-popup',
                mobiCloseBtn: '.btn-sort-popup-close',

                // cls
                selected: 'link_selected',
                ready: 'ems-sort-ready',
                animate: 'ems-sort-animate'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'SORT_LIST_CLICKED', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        param: 'srt',
                        cls: {
                            selected: opt['selected'],
                            ready: opt['ready'],
                            animate: opt['animate']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        popup: function (k) {
                            var _t = this;
                            if (k == 'show') {
                                bdy.addClass(opt['ready']);
                                setTimeout(function () {
                                    bdy.addClass(opt['animate']);
                                }, 100);
                            } else {
                                bdy.removeClass(opt['animate']);
                                setTimeout(function () {
                                    bdy.removeClass(opt['ready']);
                                }, 300);
                            }
                        },
                        set: function (o) {
                            var _t = this,
                                rel = o['rel'] || '',
                                typ = o['typ'] || 'add',
                                uri = '';

                            if (rel != '') {
                                var loc = window.location.search;

                                if (typ == 'add') {
                                    if (loc.indexOf(_t.param + '=' + rel) != -1)
                                        uri = minusLoc.remove('?', _t.param);
                                    else
                                        uri = minusLoc.put('?', rel, _t.param);
                                } else
                                    uri = minusLoc.remove('?', _t.param);


                                _t.trigger({ type: 'change_uri', uri: uri });
                            }

                        },
                        addEvent: function () {
                            var _t = this;

                            ID
                                .find(opt['btn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.set({ rel: $(this).attr('rel') || '' });
                                });


                            $(opt['clearBtn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.set({ rel: 'srt', typ: 'remove' });
                                });

                            $(opt['drp'])
                                .removeAttr('onchange')
                                .unbind('change')
                                .bind('change', function () {
                                    _t.set({ rel: $(this).val() || '' });
                                })

                            $(opt['mobiBtn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.popup('show');
                                });

                            $(opt['mobiCloseBtn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.popup('hide');
                                });
                        },
                        check: function () {
                            var _t = this,
                                k = minusLoc.get('?', _t.param) || '';
                            if (k != '') {
                                k = ID.find('[rel="' + k + '"]');
                                if (uty.detectEl(k))
                                    k.addClass(_t.cls['selected']);
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(ID.find(opt['btn']))) {
                                _t.check();
                                _t.addEvent();
                            }
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);

/* 
    minus html5 video
*/

(function ($) {
    $.fn.extend({
        minusHTML5Video: function (options, callback) {
            var defaults = {
                button: '.open-video' // siblingsinde bulunan video çalıştırır.
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        cls: {
                            isPlay: 'is-play',
                            scrolling: 'is-scrolling' // scroll ile tetiklencek video class olarak eklenir
                        },
                        adjust: function () {
                            var _t = this;
                            if (uty.detectEl(ID)) {
                                ID
                                    .each(function () {
                                        var ths = $(this),
                                            k = ths.get(0);

                                        if (ths.hasClass(_t.cls['scrolling'])) {
                                            if (uty.detectPosition({ ID: ths })) {
                                                if (!ths.hasClass(_t.cls['isPlay'])) {
                                                    ths.addClass(_t.cls['isPlay']);
                                                    k.play();
                                                }
                                            } else {
                                                if (ths.hasClass(_t.cls['isPlay'])) {
                                                    ths.removeClass(_t.cls['isPlay']);
                                                    k.pause();
                                                }
                                            }
                                        }
                                    });
                            }

                        },
                        addEvent: function () {
                            var _t = this;
                            $(opt['button'])
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        vid = ths.siblings('video');
                                    if (uty.detectEl(vid)) {
                                        var k = vid.get(0);
                                        if (!vid.hasClass(_t.cls['isPlay'])) {
                                            vid.add(ths).addClass(_t.cls['isPlay']);
                                            k.play();
                                        } else {
                                            vid.add(ths).removeClass(_t.cls['isPlay']);
                                            k.pause();
                                        }
                                    }
                                });
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };

                main.init();

                setTimeout(function () {
                    main.adjust();
                }, 1000);

                this.adjust = function () {
                    main.adjust();
                };

            });
        }
    });
})(jQuery);

/* 
    Custom Lazy Load
*/
(function ($) {
    $.fn.extend({
        minusLazyLoad: function (options, callback) {
            var defaults = {
                loaded: 'loaded-image', // nesne yüklendikten sonra gelen class
                rate: .9,
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        stage.dispatchEvent("CustomEvent", "MINUS_LAZY_LOAD", $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        detectPosition: function (ID) {
                            var _t = this,
                                o1 = { x: 0, y: wst, width: wt, height: ht * (opt['rate'] || 1) },
                                o2 = { x: 0, y: ID.offset().top, width: wt, height: ID.height() * (opt['rate'] || 1) },
                                b = false;
                            if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y)
                                b = true;
                            return b;
                        },
                        adjust: function () {
                            var _t = this;
                            if (uty.detectEl(ID)) {
                                ID
                                    .each(function () {
                                        var ths = $(this);
                                        if (!ths.hasClass(opt['loaded']) && uty.detectPosition({ ID: ths })) {
                                            uty.lazyLoad({ ID: ths });

                                            ths.addClass(opt['loaded']);

                                            _dispatch({ target: ths });
                                            _callback({ target: ths });
                                        }
                                    });
                            }

                        }
                    };
                setTimeout(function () {
                    main.adjust();
                }, 1000);

                this.adjust = function () {
                    main.adjust();
                };

            });
        }
    });
})(jQuery);

/* 
    MINUS COUNTER
*/
(function ($) {
    $.fn.extend({
        minusCounter: function (options, callback) {
            var defaults = {
                btnBottom: '<a class="counter-btn bottom-btn" rel="dec" href="javascript:void(0);"><span><i class="icon-ico_minus"></i></span></a>',
                btnTop: '<a class="counter-btn top-btn" rel="inc" href="javascript:void(0);"><span><i class="icon-ico_plus"></i></span></a>'
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var el = $(this),
                    _min = el.attr('min') || 1,
                    _max = el.attr('max') || 0,
                    opt = options,
                    uty = {
                        cleanText: function (k) { return k.replace(/\s+/g, ''); },
                        cleanChar: function (k) { return k.replace(/[^0-9]/g, ''); }
                    },
                    main = {
                        template: {
                            bottom: opt['btnBottom'] || '',
                            top: opt['btnTop'] || ''
                        },
                        check: function () {
                            var _t = main,
                                ths = $(this),
                                rel = ths.attr('rel') || '',
                                val = parseFloat(uty.cleanChar(uty.cleanText(el.val())));

                            if (isNaN(val)) val = _min;

                            if (rel == 'inc') val++;
                            else if (rel == 'dec') val--;

                            if (_max != 0)
                                if (val >= _max) val = _max;

                            if (val <= _min) val = _min;

                            el.val(val).change();
                        },
                        addEvent: function () {
                            var _t = this;
                            el
                                .siblings('.counter-btn')
                                .bind('click', _t.check);

                            el
                                .unbind('keypress')
                                .bind('keypress', function (evt) {
                                    var theEvent = evt || window.event,
                                        key = theEvent.keyCode || theEvent.which,
                                        regex = /[0-9]|\./;

                                    if (!regex.test(String.fromCharCode(key))) {
                                        theEvent.returnValue = false;
                                        if (theEvent.preventDefault) theEvent.preventDefault();
                                    }
                                })
                                .bind('blur', _t.check);

                        },
                        add: function () {
                            var _t = this;
                            el
                                .before(_t.template.bottom)
                                .after(_t.template.top);
                        },
                        init: function () {
                            var _t = this;
                            _t.add();
                            _t.addEvent();
                        }
                    };

                main.init();
            })
        }
    })
})(jQuery, window);

/* 
    MINUS LOAD MORE
*/
(function ($) {
    $.fn.extend({
        minusLoadMoreButton: function (options, callback) {
            var defaults = {
                activePaging: '.urunPaging_pageNavigation [id$="ascPagingDataAlt_lblPaging"] span', // active
                target: '.urnList .emosInfinite', // hedef ul
                paging: '.urunPaging_pageNavigation', // hedef paging
                infiniteScroll: false,
                threshold: 200,

                // cls
                loading: 'ajx-loading', // ajx yüklenirken body class
                hidden: 'ems-none'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'LOAD_MORE_LOADED', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        param: 'srt',
                        clicklable: true,
                        cls: {
                            selected: opt['selected'],
                            ready: opt['ready'],
                            animate: opt['animate']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                bdy.addClass(opt['loading']);
                            else
                                bdy.removeClass(opt['loading']);
                        },
                        control: function () {
                            var _t = this, uri = $(opt['activePaging']).next('a').attr('href') || '';
                            if (uri == '')
                                ID.addClass(opt['hidden']);
                        },
                        ajxResult: function (o) {
                            var _t = this,
                                ajxTargetCon = $('<div>' + uty.clearScriptTag(o['val'] || '') + '</div>'),
                                ajxTarget = ajxTargetCon.find(opt['target']),
                                target = $(opt['target']),
                                type = 'error';

                            if (uty.detectEl(target) && uty.detectEl(ajxTarget)) {
                                type = 'success';
                                target.eq(0).append(ajxTarget.eq(0).html() || '');
                                $(opt['paging']).eq(0).html(ajxTargetCon.find(opt['paging']).eq(0).html() || '');
                            }

                            _t.trigger({ type: type });
                            _t.control();
                            _t.clicklable = true;
                        },
                        addEvent: function () {
                            var _t = this;

                            ID
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        uri = $(opt['activePaging']).next('a').attr('href') || '';
                                    if (uri != '' && _t.clicklable) {
                                        _t.clicklable = false;
                                        _t.loading('show');
                                        uty.ajx({ uri: uri }, function (k) {
                                            if (k['type'] == 'success')
                                                _t.ajxResult({ val: k['val'] || '' });

                                            _t.loading('hide');
                                        });
                                    }

                                });

                        },
                        adjust: function () {
                            var _t = this;
                            if (opt['infiniteScroll']) {
                                if (uty.detectPosition({ ID: ID, threshold: opt['threshold'], elementNext: true })) {
                                    ID.click();
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(ID)) {
                                _t.control();
                                _t.addEvent();
                            }
                        }
                    };
                main.init();

                this.adjust = function () {
                    main.adjust();
                };
            });
        }
    });
})(jQuery);

/* 
    MINUS SOCIAL SHARE
*/
(function ($) {
    $.fn.extend({
        minusSocialShare: function (options, callback) {
            var defaults = {
                template: {
                    'twitter': 'https://twitter.com/share?&url={{url}}&via={{name}}',
                    'pinterest': '//pinterest.com/pin/create/button/?description={{description}}&url={{url}}&media={{media}}',
                    'googlePlus': '//plus.google.com/share?url={{url}}',
                    'whatsapp': 'whatsapp://send?text={{url}}',
                    'facebook': '//www.facebook.com/sharer/sharer.php?u={{url}}',
                    'facebookMobi': '//m.facebook.com/sharer/sharer.php?u={{url}}',
                    'linkedin': '//www.linkedin.com/shareArticle?mini=true&url={{url}}'
                },
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'SOCIAL_SHARE', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        template: opt['template'],
                        getPos: function () {
                            var win = $(window), w = 550, h = 300;
                            return 'height=' + h + ',width=' + w + ',left=' + Math.round((win.width() - w) * .5) + ',top=' + Math.round((win.height() - h) * .5);
                        },
                        openWinPp: function (k) {
                            var _t = this, nw = window.open(k, $('title').text() || '', _t.getPos(), false);
                            if (window.focus) nw.focus();
                            return false;
                        },
                        getLnk: function (el) {
                            var _t = this, typ = el.attr('data-type') || '', ttl = el.attr('data-ttl') || $('title').text() || '', dsc = el.attr('data-dsc') || $('[name="description"]').attr('content') || '', media = el.attr('data-img') || $('[property="og:image"]').attr('content') || '', url = el.attr('data-uri') || window.location.href || '', lnk = _t.template[typ] || '';

                            if (isMobile && typ == 'facebook')
                                lnk = _t.template['facebookMobi'];

                            if (lnk != '')
                                lnk = lnk.replace(/{{url}}/g, url).replace(/{{source}}/g, url).replace(/{{media}}/g, media).replace(/{{name}}/g, ttl).replace(/{{caption}}/g, ttl).replace(/{{description}}/g, dsc);
                            else
                                lnk = el.attr('href') || '';

                            return lnk;
                        },
                        addEvent: function () {
                            var _t = this;
                            if (isMobile)
                                ID
                                    .each(function () {
                                        var ths = $(this);
                                        ths.removeAttr('onclick').attr('href', _t.getLnk(ths)).attr('target', '_blank').unbind();
                                    });
                            else
                                ID
                                    .unbind('click')
                                    .bind('click', function (evt) {
                                        evt.preventDefault();
                                        var ths = $(this),
                                            lnk = _t.getLnk(ths) || '';

                                        if (lnk != '')
                                            _t.openWinPp(lnk);
                                    })
                        },

                        init: function () {
                            this.addEvent();
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);

/* 
    Minus Zoom
*/
(function ($) {
    $.fn.extend({
        minusZoomGallery: function (options, callback) {
            var defaults = {
                title: '',
                closeButton: '<i class="icon-close"></i>',
                largeButtonPrev: '<i class="icon-ico_arrow-left"></i>',
                largeButtonNext: '<i class="icon-ico_arrow-right"></i>',
                thumbButtonPrev: '<i class="icon-ico_arrow-left"></i>',
                thumbButtonNext: '<i class="icon-ico_arrow-right"></i>',
                largeConfig: {
                    zoom: true,
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    preloadImages: false,
                    lazy: true,
                    keyboardControl: true,
                    navigation: {
                        nextEl: '.zoom-swiper-large-button-next',
                        prevEl: '.zoom-swiper-large-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets',
                    },
                    /*thumbs: {
                        swiper: {
                            el: '.zoom-gallery .thumbs-wrapper',
                            slidesPerView: 4
                        }
                    }*/
                },

                thumbConfig: {
                    slideToClickedSlide: true,
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                    onlyExternal: true,
                    spaceBetween: 20,
                    navigation: {
                        nextEl: '.zoom-swiper-thumb-button-next',
                        prevEl: '.zoom-swiper-thumb-button-prev',
                    },
                },

                thumbConfigMobi: {
                    slideToClickedSlide: true,
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    onlyExternal: true,
                    spaceBetween: 10,
                    direction:  'horizontal',
                    navigation: {
                        nextEl: '.zoom-swiper-thumb-button-next',
                        prevEl: '.zoom-swiper-thumb-button-prev',
                    }
                },

                ready: 'zoom-gallery-ready',
                animate: 'zoom-gallery-animate',


                /* 
                    template
                */
                template: {
                    wrp: '<div class="zoom-gallery"><div class="zoom-gallery-inner"><div class="zoom-gallery-header"><span class="title">{{title}}</span><a href="javascript:void(0);" class="close-btn">{{closeButton}}</a></div>{{large}}{{thumbs}}<div class="zoom-gallery-footer"></div></div></div>',
                    large: '<div class="large-wrapper swiper-container"><div class="swiper-inner"><ul class="swiper-wrapper">{{li}}</ul></div><div class="swiper-button-prev zoom-swiper-large-button-prev">{{largeButtonPrev}}</div><div class="swiper-button-next zoom-swiper-large-button-next">{{largeButtonNext}}</div><div class="swiper-pagination"></div></div>',
                    largeLi: '<li data-order="{{order}}" class="swiper-slide"><div class="swiper-zoom-container"><img data-src="{{src}}" class="swiper-lazy"></div><div class="swiper-lazy-preloader"></div></li>',
                    thumbs: '<div class="thumbs-wrapper swiper-container"><div class="swiper-inner"><ul class="swiper-wrapper">{{li}}</ul></div><div class="swiper-button-prev zoom-swiper-thumb-button-prev">{{thumbButtonPrev}}</div><div class="swiper-button-next zoom-swiper-thumb-button-next">{{thumbButtonNext}}</div></div>',
                    thumbsLi: '<li data-order="{{order}}" class="swiper-slide"><span><img src="{{src}}" border="0" /></span></li>'
                }
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var opt = options,
                    ID = $(this),
                    main = {
                        el: {
                            con: '.zoom-gallery',
                            large: '.zoom-gallery .large-wrapper',
                            thumbs: '.zoom-gallery .thumbs-wrapper'
                        },
                        cls: {
                            active: 'active',
                            ready: opt['ready'],
                            animate: opt['animate'],
                            zoom: 'swiper-slide-zoomed'
                        },
                        gallery: null,
                        thumbs: null,
                        template: {
                            wrp: opt['template']['wrp'],
                            large: opt['template']['large'],
                            largeLi: opt['template']['largeLi'],
                            thumbs: opt['template']['thumbs'],
                            thumbsLi: opt['template']['thumbsLi']
                        },
                        getTemplate: function () {
                            var _t = this, htm = { large: '', thumbs: '' };

                            ID
                                .find('[data-large]')
                                .each(function (i) {
                                    var ths = $(this),
                                        large = ths.attr('data-large') || '',
                                        thumbs = ths.attr('data-thumb') || '';

                                    ths.attr('data-order', i);

                                    if (large != '')
                                        htm['large'] += _t.template['largeLi']
                                            .replace(/{{order}}/g, i)
                                            .replace(/{{src}}/g, large);

                                    if (thumbs != '')
                                        htm['thumbs'] += _t.template['thumbsLi']
                                            .replace(/{{order}}/g, i)
                                            .replace(/{{src}}/g, thumbs);
                                });

                            htm['large'] = _t.template['large']
                                .replace(/{{li}}/g, htm['large'])
                                .replace(/{{largeButtonPrev}}/g, opt['largeButtonPrev'])
                                .replace(/{{largeButtonNext}}/g, opt['largeButtonNext']);

                            htm['thumbs'] = _t.template['thumbs']
                                .replace(/{{li}}/g, htm['thumbs'])
                                .replace(/{{thumbButtonPrev}}/g, opt['thumbButtonPrev'])
                                .replace(/{{thumbButtonNext}}/g, opt['thumbButtonNext']);

                            return _t.template['wrp']
                                .replace(/{{closeButton}}/g, opt['closeButton'])
                                .replace(/{{large}}/g, htm['large'])
                                .replace(/{{thumbs}}/g, htm['thumbs'])
                                .replace(/{{title}}/g, opt['title'] || '');
                        },
                        add: function () {
                            var _t = this;
                            ID.after(_t.getTemplate());
                        },
                        initPlugins: function () {
                            var _t = this,
                                largeConfig = opt['largeConfig'] || {},
                                thumbConfig = ( uty.visibleControl() || isMobile ) ? opt['thumbConfigMobi'] : opt['thumbConfig'],
                                activeted = function () {
                                    /* 
                                        aktif olan thumb atanır
                                    */
                                    var bullet = $(_t.el.con).find('.swiper-pagination-bullet-active'),
                                        k = uty.detectEl(bullet) ? (bullet.index() || 0) : 0;

                                    $('.zoom-gallery .thumbs-wrapper li').eq(k).addClass(_t.cls['active']).siblings().removeClass(_t.cls['active']);
                                    k = k - 1;
                                    if (k <= 0) k = 0;
                                    _t.thumbs.slideTo(k, 333);
                                };

                            largeConfig['on'] = {
                                slideChangeTransitionStart: function () {
                                    activeted();
                                    $(_t.el.con).find('.' + _t.cls['zoom']).removeClass(_t.cls['zoom']);
                                }
                            };

                            _t.gallery = new Swiper(_t.el.large, largeConfig);
                            _t.thumbs = new Swiper(_t.el.thumbs, thumbConfig);

                            activeted();
                        },
                        addEvents: function () {
                            var _t = this, con = $(_t.el.con);

                            con
                                .find('.thumbs-wrapper li')
                                .bind('click', function () {
                                    var ths = $(this),
                                        n = ths.attr('data-order') || 0;
                                    _t.gallery.slideTo(n, 333);

                                });

                            ID
                                .find('[data-large]')
                                .bind('click', function () {
                                    var ths = $(this),
                                        n = ths.attr('data-order') || 0;

                                    _t.popup('show');

                                    setTimeout(function () {
                                        _t.gallery.update();
                                        _t.thumbs.update();
                                        _t.gallery.slideTo(n, 333);
                                    }, 100);
                                });

                            con
                                .find('.close-btn')
                                .bind('click', function () {
                                    _t.popup('hide');
                                });
                        },
                        popup: function (k) {
                            var _t = this;
                            if (k == 'show')
                                uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls': [_t.cls['ready'], _t.cls['animate']] });
                            else
                                uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls': [_t.cls['animate'], _t.cls['ready']] });
                        },
                        init: function () {
                            var _t = this;
                            if( uty.detectEl( ID.find('[data-large]') )  ){
                                _t.add();
                                _t.initPlugins();
                                _t.addEvents();
                            }
                        }
                    };
                main.init();

                ///////// PUBLIC FUNC
                this.adjust = function (o) {

                };

                this.setThumbConfig = function( k ){
                    if( main.thumbs != null ){
                        main.thumbs.destroy();
                        setTimeout(function(){
                            main.thumbs = new Swiper(main.el.thumbs, ( k == 'mobi' ) ? opt['thumbConfigMobi'] : opt['thumbConfig'])    
                        }, 100);                        
                    }  
                };
            })
        }
    })
})(jQuery, window);

/*!
 * jquery-confirm v3.2.3 (http://craftpip.github.io/jquery-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2017 jquery-confirm
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */
if (typeof jQuery === "undefined") { throw new Error("jquery-confirm requires jQuery"); } var jconfirm, Jconfirm; (function ($, window) { $.fn.confirm = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false }; } $(this).each(function () { var $this = $(this); $this.on("click", function (e) { e.preventDefault(); var jcOption = $.extend({}, options); if ($this.attr("data-title")) { jcOption.title = $this.attr("data-title"); } if ($this.attr("data-content")) { jcOption.content = $this.attr("data-content"); } if (typeof jcOption.buttons == "undefined") { jcOption.buttons = {}; } jcOption["$target"] = $this; if ($this.attr("href") && Object.keys(jcOption.buttons).length == 0) { var buttons = $.extend(true, {}, jconfirm.pluginDefaults.defaultButtons, (jconfirm.defaults || {}).defaultButtons || {}); var firstBtn = Object.keys(buttons)[0]; jcOption.buttons = buttons; jcOption.buttons[firstBtn].action = function () { location.href = $this.attr("href"); }; } jcOption.closeIcon = false; $.confirm(jcOption); }); }); return $(this); }; $.confirm = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false }; } if (typeof options.buttons != "object") { options.buttons = {}; } if (Object.keys(options.buttons).length == 0) { var buttons = $.extend(true, {}, jconfirm.pluginDefaults.defaultButtons, (jconfirm.defaults || {}).defaultButtons || {}); options.buttons = buttons; } return jconfirm(options); }; $.alert = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false }; } if (typeof options.buttons != "object") { options.buttons = {}; } if (Object.keys(options.buttons).length == 0) { var buttons = $.extend(true, {}, jconfirm.pluginDefaults.defaultButtons, (jconfirm.defaults || {}).defaultButtons || {}); var firstBtn = Object.keys(buttons)[0]; options.buttons[firstBtn] = buttons[firstBtn]; } return jconfirm(options); }; $.dialog = function (options, option2) { if (typeof options === "undefined") { options = {}; } if (typeof options === "string") { options = { content: options, title: (option2) ? option2 : false, closeIcon: function () { } }; } options.buttons = {}; if (typeof options.closeIcon == "undefined") { options.closeIcon = function () { }; } options.confirmKeys = [13]; return jconfirm(options); }; jconfirm = function (options) { if (typeof options === "undefined") { options = {}; } var pluginOptions = $.extend(true, {}, jconfirm.pluginDefaults); if (jconfirm.defaults) { pluginOptions = $.extend(true, pluginOptions, jconfirm.defaults); } pluginOptions = $.extend(true, {}, pluginOptions, options); var instance = new Jconfirm(pluginOptions); jconfirm.instances.push(instance); return instance; }; Jconfirm = function (options) { $.extend(this, options); this._init(); }; Jconfirm.prototype = { _init: function () { var that = this; if (!jconfirm.instances.length) { jconfirm.lastFocused = $("body").find(":focus"); } this._id = Math.round(Math.random() * 99999); if (!this.lazyOpen) { setTimeout(function () { that.open(); }, 0); } }, _buildHTML: function () { var that = this; this._parseAnimation(this.animation, "o"); this._parseAnimation(this.closeAnimation, "c"); this._parseBgDismissAnimation(this.backgroundDismissAnimation); this._parseColumnClass(this.columnClass); this._parseTheme(this.theme); this._parseType(this.type); var template = $(this.template); template.find(".jconfirm-box").addClass(this.animationParsed).addClass(this.backgroundDismissAnimationParsed).addClass(this.typeParsed); if (this.typeAnimated) { template.find(".jconfirm-box").addClass("jconfirm-type-animated"); } if (this.useBootstrap) { template.find(".jc-bs3-row").addClass(this.bootstrapClasses.row); template.find(".jc-bs3-row").addClass("justify-content-md-center justify-content-sm-center justify-content-xs-center justify-content-lg-center"); template.find(".jconfirm-box-container").addClass(this.columnClassParsed); if (this.containerFluid) { template.find(".jc-bs3-container").addClass(this.bootstrapClasses.containerFluid); } else { template.find(".jc-bs3-container").addClass(this.bootstrapClasses.container); } } else { template.find(".jconfirm-box").css("width", this.boxWidth); } if (this.titleClass) { template.find(".jconfirm-title-c").addClass(this.titleClass); } template.addClass(this.themeParsed); var ariaLabel = "jconfirm-box" + this._id; template.find(".jconfirm-box").attr("aria-labelledby", ariaLabel).attr("tabindex", -1); template.find(".jconfirm-content").attr("id", ariaLabel); if (this.bgOpacity != null) { template.find(".jconfirm-bg").css("opacity", this.bgOpacity); } if (this.rtl) { template.addClass("jconfirm-rtl"); } this.$el = template.appendTo(this.container); this.$jconfirmBoxContainer = this.$el.find(".jconfirm-box-container"); this.$jconfirmBox = this.$body = this.$el.find(".jconfirm-box"); this.$jconfirmBg = this.$el.find(".jconfirm-bg"); this.$title = this.$el.find(".jconfirm-title"); this.$titleContainer = this.$el.find(".jconfirm-title-c"); this.$content = this.$el.find("div.jconfirm-content"); this.$contentPane = this.$el.find(".jconfirm-content-pane"); this.$icon = this.$el.find(".jconfirm-icon-c"); this.$closeIcon = this.$el.find(".jconfirm-closeIcon"); this.$btnc = this.$el.find(".jconfirm-buttons"); this.$scrollPane = this.$el.find(".jconfirm-scrollpane"); this._contentReady = $.Deferred(); this._modalReady = $.Deferred(); this.setTitle(); this.setIcon(); this._setButtons(); this._parseContent(); this.initDraggable(); if (this.isAjax) { this.showLoading(false); } $.when(this._contentReady, this._modalReady).then(function () { if (that.isAjaxLoading) { setTimeout(function () { that.isAjaxLoading = false; that.setContent(); that.setTitle(); that.setIcon(); setTimeout(function () { that.hideLoading(false); }, 100); if (typeof that.onContentReady == "function") { that.onContentReady(); } }, 50); } else { that.setContent(); that.setTitle(); that.setIcon(); if (typeof that.onContentReady == "function") { that.onContentReady(); } } if (that.autoClose) { that._startCountDown(); } }); that._contentHash = this._hash(that.$content.html()); that._contentHeight = this.$content.height(); this._watchContent(); this.setDialogCenter(); if (this.animation == "none") { this.animationSpeed = 1; this.animationBounce = 1; } this.$body.css(this._getCSS(this.animationSpeed, this.animationBounce)); this.$contentPane.css(this._getCSS(this.animationSpeed, 1)); this.$jconfirmBg.css(this._getCSS(this.animationSpeed, 1)); }, _typePrefix: "jconfirm-type-", typeParsed: "", _parseType: function (type) { this.typeParsed = this._typePrefix + type; }, setType: function (type) { var oldClass = this.typeParsed; this._parseType(type); this.$jconfirmBox.removeClass(oldClass).addClass(this.typeParsed); }, themeParsed: "", _themePrefix: "jconfirm-", setTheme: function (theme) { var previous = this.theme; this.theme = theme || this.theme; this._parseTheme(this.theme); if (previous) { this.$el.removeClass(previous); } this.$el.addClass(this.themeParsed); this.theme = theme; }, _parseTheme: function (theme) { var that = this; theme = theme.split(","); $.each(theme, function (k, a) { if (a.indexOf(that._themePrefix) == -1) { theme[k] = that._themePrefix + $.trim(a); } }); this.themeParsed = theme.join(" ").toLowerCase(); }, backgroundDismissAnimationParsed: "", _bgDismissPrefix: "jconfirm-hilight-", _parseBgDismissAnimation: function (bgDismissAnimation) { var animation = bgDismissAnimation.split(","); var that = this; $.each(animation, function (k, a) { if (a.indexOf(that._bgDismissPrefix) == -1) { animation[k] = that._bgDismissPrefix + $.trim(a); } }); this.backgroundDismissAnimationParsed = animation.join(" ").toLowerCase(); }, animationParsed: "", closeAnimationParsed: "", _animationPrefix: "jconfirm-animation-", setAnimation: function (animation) { this.animation = animation || this.animation; this._parseAnimation(this.animation, "o"); }, _parseAnimation: function (animation, which) { which = which || "o"; var animations = animation.split(","); var that = this; $.each(animations, function (k, a) { if (a.indexOf(that._animationPrefix) == -1) { animations[k] = that._animationPrefix + $.trim(a); } }); var a_string = animations.join(" ").toLowerCase(); if (which == "o") { this.animationParsed = a_string; } else { this.closeAnimationParsed = a_string; } return a_string; }, setCloseAnimation: function (closeAnimation) { this.closeAnimation = closeAnimation || this.closeAnimation; this._parseAnimation(this.closeAnimation, "c"); }, setAnimationSpeed: function (speed) { this.animationSpeed = speed || this.animationSpeed; }, columnClassParsed: "", setColumnClass: function (colClass) { if (!this.useBootstrap) { console.warn("cannot set columnClass, useBootstrap is set to false"); return; } this.columnClass = colClass || this.columnClass; this._parseColumnClass(this.columnClass); this.$jconfirmBoxContainer.addClass(this.columnClassParsed); }, setBoxWidth: function () { if (this.useBootstrap) { console.warn("cannot set boxWidth, useBootstrap is set to true"); return; } this.$jconfirmBox.css("width", this.boxWidth); }, _parseColumnClass: function (colClass) { colClass = colClass.toLowerCase(); var p; switch (colClass) { case "xl": case "xlarge": p = "col-md-12"; break; case "l": case "large": p = "col-md-8 col-md-offset-2"; break; case "m": case "medium": p = "col-md-6 col-md-offset-3"; break; case "s": case "small": p = "col-md-4 col-md-offset-4"; break; case "xs": case "xsmall": p = "col-md-2 col-md-offset-5"; break; default: p = colClass; }this.columnClassParsed = p; }, initDraggable: function () { var that = this; var $t = this.$titleContainer; this.resetDrag(); if (this.draggable) { $t.addClass("jconfirm-hand"); $t.on("mousedown", function (e) { that.mouseX = e.clientX; that.mouseY = e.clientY; that.isDrag = true; }); $(window).on("mousemove." + this._id, function (e) { if (that.isDrag) { that.movingX = e.clientX - that.mouseX + that.initialX; that.movingY = e.clientY - that.mouseY + that.initialY; that.setDrag(); } }); $(window).on("mouseup." + this._id, function () { if (that.isDrag) { that.isDrag = false; that.initialX = that.movingX; that.initialY = that.movingY; } }); } }, resetDrag: function () { this.isDrag = false; this.initialX = 0; this.initialY = 0; this.movingX = 0; this.movingY = 0; this.movingXCurrent = 0; this.movingYCurrent = 0; this.mouseX = 0; this.mouseY = 0; this.$jconfirmBoxContainer.css("transform", "translate(" + 0 + "px, " + 0 + "px)"); }, setDrag: function () { if (!this.draggable) { return; } this.alignMiddle = false; this._boxWidth = this.$jconfirmBox.outerWidth(); var ww = $(window).width(); var that = this; if (that.movingX % 2 == 0 || that.movingY % 2 == 0) { var tb = that._boxTopMargin - that.dragWindowGap; if (tb + that.movingY < 0) { that.movingY = -tb; } else { that.movingYCurrent = that.movingY; } var lb = (ww / 2) - that._boxWidth / 2; var rb = (ww / 2) + (that._boxWidth / 2) - that._boxWidth; rb -= that.dragWindowGap; lb -= that.dragWindowGap; if (lb + that.movingX < 0) { that.movingX = -lb; } else { if (rb - that.movingX < 0) { that.movingX = rb; } else { that.movingXCurrent = that.movingX; } } that.$jconfirmBoxContainer.css("transform", "translate(" + that.movingX + "px, " + that.movingY + "px)"); } }, _hash: function (a) { var string = a.toString(); var h = 0; if (string.length == 0) { return h; } for (var i = 0; i < string.length; i++) { var c = string.toString().charCodeAt(i); h = ((h << 5) - h) + c; h = h & h; } return h; }, _watchContent: function () { var that = this; if (this._timer) { clearInterval(this._timer); } this._timer = setInterval(function () { var now = that._hash(that.$content.html()); var nowHeight = that.$content.height(); if (that._contentHash != now || that._contentHeight != nowHeight) { that._contentHash = now; that._contentHeight = nowHeight; that.setDialogCenter(); that._imagesLoaded(); } }, this.watchInterval); }, _hilightAnimating: false, _hiLightModal: function () { var that = this; if (this._hilightAnimating) { return; } that.$body.addClass("hilight"); var duration = 2; this._hilightAnimating = true; setTimeout(function () { that._hilightAnimating = false; that.$body.removeClass("hilight"); }, duration * 1000); }, _bindEvents: function () { var that = this; this.boxClicked = false; this.$scrollPane.click(function (e) { if (!that.boxClicked) { var buttonName = false; var shouldClose = false; var str; if (typeof that.backgroundDismiss == "function") { str = that.backgroundDismiss(); } else { str = that.backgroundDismiss; } if (typeof str == "string" && typeof that.buttons[str] != "undefined") { buttonName = str; shouldClose = false; } else { if (typeof str == "undefined" || !!(str) == true) { shouldClose = true; } else { shouldClose = false; } } if (buttonName) { var btnResponse = that.buttons[buttonName].action.apply(that); shouldClose = (typeof btnResponse == "undefined") || !!(btnResponse); } if (shouldClose) { that.close(); } else { that._hiLightModal(); } } that.boxClicked = false; }); this.$jconfirmBox.click(function (e) { that.boxClicked = true; }); var isKeyDown = false; $(window).on("jcKeyDown." + that._id, function (e) { if (!isKeyDown) { isKeyDown = true; } }); $(window).on("keyup." + that._id, function (e) { if (isKeyDown) { that.reactOnKey(e); isKeyDown = false; } }); $(window).on("resize." + this._id, function () { that.setDialogCenter(true); setTimeout(function () { that.resetDrag(); }, 100); }); }, _cubic_bezier: "0.36, 0.55, 0.19", _getCSS: function (speed, bounce) { return { "-webkit-transition-duration": speed / 1000 + "s", "transition-duration": speed / 1000 + "s", "-webkit-transition-timing-function": "cubic-bezier(" + this._cubic_bezier + ", " + bounce + ")", "transition-timing-function": "cubic-bezier(" + this._cubic_bezier + ", " + bounce + ")" }; }, _imagesLoaded: function () { var that = this; if (that.imageLoadInterval) { clearInterval(that.imageLoadInterval); } $.each(this.$content.find("img:not(.loaded)"), function (i, a) { that.imageLoadInterval = setInterval(function () { var h = $(a).css("height"); if (h !== "0px") { $(a).addClass("loaded"); clearInterval(that.imageLoadInterval); that.setDialogCenter(); } }, 40); }); }, _setButtons: function () { var that = this; var total_buttons = 0; if (typeof this.buttons !== "object") { this.buttons = {}; } $.each(this.buttons, function (key, button) { total_buttons += 1; if (typeof button === "function") { that.buttons[key] = button = { action: button }; } that.buttons[key].text = button.text || key; that.buttons[key].btnClass = button.btnClass || "btn-default"; that.buttons[key].action = button.action || function () { }; that.buttons[key].keys = button.keys || []; that.buttons[key].isHidden = button.isHidden || false; that.buttons[key].isDisabled = button.isDisabled || false; $.each(that.buttons[key].keys, function (i, a) { that.buttons[key].keys[i] = a.toLowerCase(); }); var button_element = $('<button type="button" class="btn"></button>').html(that.buttons[key].text).addClass(that.buttons[key].btnClass).prop("disabled", that.buttons[key].isDisabled).css("display", that.buttons[key].isHidden ? "none" : "").click(function (e) { e.preventDefault(); var res = that.buttons[key].action.apply(that); that.onAction(key); that._stopCountDown(); if (typeof res === "undefined" || res) { that.close(); } }); that.buttons[key].el = button_element; that.buttons[key].setText = function (text) { button_element.html(text); }; that.buttons[key].addClass = function (className) { button_element.addClass(className); }; that.buttons[key].removeClass = function (className) { button_element.removeClass(className); }; that.buttons[key].disable = function () { that.buttons[key].isDisabled = true; button_element.prop("disabled", true); }; that.buttons[key].enable = function () { that.buttons[key].isDisabled = false; button_element.prop("disabled", false); }; that.buttons[key].show = function () { that.buttons[key].isHidden = false; button_element.css("display", ""); that.setDialogCenter(); }; that.buttons[key].hide = function () { that.buttons[key].isHidden = true; button_element.css("display", "none"); that.setDialogCenter(); }; that["$_" + key] = that["$$" + key] = button_element; that.$btnc.append(button_element); }); if (total_buttons === 0) { this.$btnc.hide(); } if (this.closeIcon === null && total_buttons === 0) { this.closeIcon = true; } if (this.closeIcon) { if (this.closeIconClass) { var closeHtml = '<i class="' + this.closeIconClass + '"></i>'; this.$closeIcon.html(closeHtml); } this.$closeIcon.click(function (e) { e.preventDefault(); var buttonName = false; var shouldClose = false; var str; if (typeof that.closeIcon == "function") { str = that.closeIcon(); } else { str = that.closeIcon; } if (typeof str == "string" && typeof that.buttons[str] != "undefined") { buttonName = str; shouldClose = false; } else { if (typeof str == "undefined" || !!(str) == true) { shouldClose = true; } else { shouldClose = false; } } if (buttonName) { var btnResponse = that.buttons[buttonName].action.apply(that); shouldClose = (typeof btnResponse == "undefined") || !!(btnResponse); } if (shouldClose) { that.close(); } }); this.$closeIcon.show(); } else { this.$closeIcon.hide(); } }, setTitle: function (string, force) { force = force || false; if (typeof string !== "undefined") { if (typeof string == "string") { this.title = string; } else { if (typeof string == "function") { if (typeof string.promise == "function") { console.error("Promise was returned from title function, this is not supported."); } var response = string(); if (typeof response == "string") { this.title = response; } else { this.title = false; } } else { this.title = false; } } } if (this.isAjaxLoading && !force) { return; } this.$title.html(this.title || ""); }, setIcon: function (iconClass, force) { force = force || false; if (typeof iconClass !== "undefined") { if (typeof iconClass == "string") { this.icon = iconClass; } else { if (typeof iconClass === "function") { var response = iconClass(); if (typeof response == "string") { this.icon = response; } else { this.icon = false; } } else { this.icon = false; } } } if (this.isAjaxLoading && !force) { return; } this.$icon.html(this.icon ? '<i class="' + this.icon + '"></i>' : ""); }, setContentPrepend: function (string, force) { this.contentParsed = string + this.contentParsed; if (this.isAjaxLoading && !force) { return; } this.$content.prepend(string); }, setContentAppend: function (string, force) { this.contentParsed = this.contentParsed + string; if (this.isAjaxLoading && !force) { return; } this.$content.append(string); }, setContent: function (string, force) { force = force || false; var that = this; this.contentParsed = (typeof string == "undefined") ? this.contentParsed : string; if (this.isAjaxLoading && !force) { return; } this.$content.html(this.contentParsed); this.setDialogCenter(); setTimeout(function () { that.$body.find("input[autofocus]:visible:first").focus(); }, 100); }, loadingSpinner: false, showLoading: function (disableButtons) { this.loadingSpinner = true; this.$jconfirmBox.addClass("loading"); if (disableButtons) { this.$btnc.find("button").prop("disabled", true); } this.setDialogCenter(); }, hideLoading: function (enableButtons) { this.loadingSpinner = false; this.$jconfirmBox.removeClass("loading"); if (enableButtons) { this.$btnc.find("button").prop("disabled", false); } this.setDialogCenter(); }, ajaxResponse: false, contentParsed: "", isAjax: false, isAjaxLoading: false, _parseContent: function () { var that = this; var e = "&nbsp;"; if (typeof this.content == "function") { var res = this.content.apply(this); if (typeof res == "string") { this.content = res; } else { if (typeof res == "object" && typeof res.always == "function") { this.isAjax = true; this.isAjaxLoading = true; res.always(function (data, status, xhr) { that.ajaxResponse = { data: data, status: status, xhr: xhr }; that._contentReady.resolve(data, status, xhr); if (typeof that.contentLoaded == "function") { that.contentLoaded(data, status, xhr); } }); this.content = e; } else { this.content = e; } } } if (typeof this.content == "string" && this.content.substr(0, 4).toLowerCase() === "url:") { this.isAjax = true; this.isAjaxLoading = true; var u = this.content.substring(4, this.content.length); $.get(u).done(function (html) { that.contentParsed = html; }).always(function (data, status, xhr) { that.ajaxResponse = { data: data, status: status, xhr: xhr }; that._contentReady.resolve(data, status, xhr); if (typeof that.contentLoaded == "function") { that.contentLoaded(data, status, xhr); } }); } if (!this.content) { this.content = e; } if (!this.isAjax) { this.contentParsed = this.content; this.setContent(this.contentParsed); that._contentReady.resolve(); } }, _stopCountDown: function () { clearInterval(this.autoCloseInterval); if (this.$cd) { this.$cd.remove(); } }, _startCountDown: function () { var that = this; var opt = this.autoClose.split("|"); if (opt.length !== 2) { console.error("Invalid option for autoClose. example 'close|10000'"); return false; } var button_key = opt[0]; var time = parseInt(opt[1]); if (typeof this.buttons[button_key] === "undefined") { console.error("Invalid button key '" + button_key + "' for autoClose"); return false; } var seconds = Math.ceil(time / 1000); this.$cd = $('<span class="countdown"> (' + seconds + ")</span>").appendTo(this["$_" + button_key]); this.autoCloseInterval = setInterval(function () { that.$cd.html(" (" + (seconds -= 1) + ") "); if (seconds <= 0) { that["$$" + button_key].trigger("click"); that._stopCountDown(); } }, 1000); }, _getKey: function (key) { switch (key) { case 192: return "tilde"; case 13: return "enter"; case 16: return "shift"; case 9: return "tab"; case 20: return "capslock"; case 17: return "ctrl"; case 91: return "win"; case 18: return "alt"; case 27: return "esc"; case 32: return "space"; }var initial = String.fromCharCode(key); if (/^[A-z0-9]+$/.test(initial)) { return initial.toLowerCase(); } else { return false; } }, reactOnKey: function (e) { var that = this; var a = $(".jconfirm"); if (a.eq(a.length - 1)[0] !== this.$el[0]) { return false; } var key = e.which; if (this.$content.find(":input").is(":focus") && /13|32/.test(key)) { return false; } var keyChar = this._getKey(key); if (keyChar === "esc" && this.escapeKey) { if (this.escapeKey === true) { this.$scrollPane.trigger("click"); } else { if (typeof this.escapeKey === "string" || typeof this.escapeKey === "function") { var buttonKey; if (typeof this.escapeKey === "function") { buttonKey = this.escapeKey(); } else { buttonKey = this.escapeKey; } if (buttonKey) { if (typeof this.buttons[buttonKey] === "undefined") { console.warn("Invalid escapeKey, no buttons found with key " + buttonKey); } else { this["$_" + buttonKey].trigger("click"); } } } } } $.each(this.buttons, function (key, button) { if (button.keys.indexOf(keyChar) != -1) { that["$_" + key].trigger("click"); } }); }, _boxTopMargin: 0, _boxBottomMargin: 0, _boxWidth: 0, setDialogCenter: function () { var contentHeight; var paneHeight; var style; contentHeight = 0; paneHeight = 0; if (this.$contentPane.css("display") != "none") { contentHeight = this.$content.outerHeight() || 0; paneHeight = this.$contentPane.height() || 0; } var children = this.$content.children(); if (children.length != 0) { var marginTopChild = parseInt(children.eq(0).css("margin-top")); if (marginTopChild) { contentHeight += marginTopChild; } } if (paneHeight == 0) { paneHeight = contentHeight; } var windowHeight = $(window).height(); var boxHeight; boxHeight = (this.$body.outerHeight() - paneHeight) + contentHeight; var topMargin = (windowHeight - boxHeight) / 2; if (boxHeight > (windowHeight - (this.offsetTop + this.offsetBottom)) || !this.alignMiddle) { style = { "margin-top": this.offsetTop, "margin-bottom": this.offsetBottom }; this._boxTopMargin = this.offsetTop; this._boxBottomMargin = this.offsetBottom; $("body").addClass("jconfirm-no-scroll-" + this._id); } else { style = { "margin-top": topMargin, "margin-bottom": this.offsetBottom }; this._boxTopMargin = topMargin; this._boxBottomMargin = this.offsetBottom; $("body").removeClass("jconfirm-no-scroll-" + this._id); } this.$contentPane.css({ height: contentHeight }).scrollTop(0); this.$body.css(style); this.setDrag(); }, _unwatchContent: function () { clearInterval(this._timer); }, close: function () { var that = this; if (typeof this.onClose === "function") { this.onClose(); } this._unwatchContent(); clearInterval(this.imageLoadInterval); $(window).unbind("resize." + this._id); $(window).unbind("keyup." + this._id); $(window).unbind("jcKeyDown." + this._id); if (this.draggable) { $(window).unbind("mousemove." + this._id); $(window).unbind("mouseup." + this._id); this.$titleContainer.unbind("mousedown"); } $("body").removeClass("jconfirm-no-scroll-" + this._id); this.$body.addClass(this.closeAnimationParsed); this.$jconfirmBg.addClass("jconfirm-bg-h"); var closeTimer = (this.closeAnimation == "none") ? 1 : this.animationSpeed; that.$el.removeClass(that.loadedClass); setTimeout(function () { that.$el.remove(); var l = jconfirm.instances; var i = jconfirm.instances.length - 1; for (i; i >= 0; i--) { if (jconfirm.instances[i]._id == that._id) { jconfirm.instances.splice(i, 1); } } if (!jconfirm.instances.length) { if (that.scrollToPreviousElement && jconfirm.lastFocused && jconfirm.lastFocused.length && $.contains(document, jconfirm.lastFocused[0])) { var $lf = jconfirm.lastFocused; if (that.scrollToPreviousElementAnimate) { var st = $(window).scrollTop(); var ot = jconfirm.lastFocused.offset().top; var wh = $(window).height(); if (!(ot > st && ot < (st + wh))) { var scrollTo = (ot - Math.round((wh / 3))); $("html, body").animate({ scrollTop: scrollTo }, that.animationSpeed, "swing", function () { $lf.focus(); }); } else { $lf.focus(); } } else { $lf.focus(); } jconfirm.lastFocused = false; } } if (typeof that.onDestroy == "function") { that.onDestroy(); } }, closeTimer * 0.4); return true; }, open: function () { if (this.isOpen()) { return false; } this._buildHTML(); this._bindEvents(); this._open(); return true; }, _open: function () { var that = this; if (typeof that.onOpenBefore == "function") { that.onOpenBefore(); } this.$body.removeClass(this.animationParsed); this.$jconfirmBg.removeClass("jconfirm-bg-h"); this.$body.focus(); setTimeout(function () { that.$body.css(that._getCSS(that.animationSpeed, 1)); that.$body.css({ "transition-property": that.$body.css("transition-property") + ", margin" }); that._modalReady.resolve(); if (typeof that.onOpen === "function") { that.onOpen(); } that.$el.addClass(that.loadedClass); }, this.animationSpeed); }, loadedClass: "jconfirm-open", isClosed: function () { return !this.$el || this.$el.css("display") === ""; }, isOpen: function () { return !this.isClosed(); }, toggle: function () { if (!this.isOpen()) { this.open(); } else { this.close(); } } }; jconfirm.instances = []; jconfirm.lastFocused = false; jconfirm.pluginDefaults = { template: '<div class="jconfirm"><div class="jconfirm-bg jconfirm-bg-h"></div><div class="jconfirm-scrollpane"><div class="jc-bs3-container"><div class="jc-bs3-row"><div class="jconfirm-box-container"><div class="jconfirm-box" role="dialog" aria-labelledby="labelled" tabindex="-1"><div class="jconfirm-closeIcon">&times;</div><div class="jconfirm-title-c"><span class="jconfirm-icon-c"></span><span class="jconfirm-title"></span></div><div class="jconfirm-content-pane"><div class="jconfirm-content"></div></div><div class="jconfirm-buttons"></div><div class="jconfirm-clear"></div></div></div></div></div></div></div>', title: "Hello", titleClass: "", type: "default", typeAnimated: true, draggable: false, alignMiddle: true, content: "Are you sure to continue?", buttons: {}, defaultButtons: { ok: { action: function () { } }, close: { action: function () { } } }, contentLoaded: function () { }, icon: "", lazyOpen: false, bgOpacity: null, theme: "light", animation: "zoom", closeAnimation: "scale", animationSpeed: 400, animationBounce: 1.2, escapeKey: true, rtl: false, container: "body", containerFluid: false, backgroundDismiss: false, backgroundDismissAnimation: "shake", autoClose: false, closeIcon: null, closeIconClass: false, watchInterval: 100, columnClass: "col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1", boxWidth: "50%", scrollToPreviousElement: true, scrollToPreviousElementAnimate: true, useBootstrap: true, offsetTop: 50, offsetBottom: 50, dragWindowGap: 15, bootstrapClasses: { container: "container", containerFluid: "container-fluid", row: "row" }, onContentReady: function () { }, onOpenBefore: function () { }, onOpen: function () { }, onClose: function () { }, onDestroy: function () { }, onAction: function () { } }; var keyDown = false; $(window).on("keydown", function (e) { if (!keyDown) { var $target = $(e.target); var pass = false; if ($target.closest(".jconfirm-box").length) { pass = true; } if (pass) { $(window).trigger("jcKeyDown"); } keyDown = true; } }); $(window).on("keyup", function (e) { keyDown = false; }); })(jQuery, window);

/* 
    toast 
*/
!function (e) { e(["jquery"], function (e) { return function () { function t(e, t, n) { return g({ type: O.error, iconClass: m().iconClasses.error, message: e, optionsOverride: n, title: t }) } function n(t, n) { return t || (t = m()), v = e("#" + t.containerId), v.length ? v : (n && (v = d(t)), v) } function o(e, t, n) { return g({ type: O.info, iconClass: m().iconClasses.info, message: e, optionsOverride: n, title: t }) } function s(e) { C = e } function i(e, t, n) { return g({ type: O.success, iconClass: m().iconClasses.success, message: e, optionsOverride: n, title: t }) } function a(e, t, n) { return g({ type: O.warning, iconClass: m().iconClasses.warning, message: e, optionsOverride: n, title: t }) } function r(e, t) { var o = m(); v || n(o), u(e, o, t) || l(o) } function c(t) { var o = m(); return v || n(o), t && 0 === e(":focus", t).length ? void h(t) : void (v.children().length && v.remove()) } function l(t) { for (var n = v.children(), o = n.length - 1; o >= 0; o--)u(e(n[o]), t) } function u(t, n, o) { var s = !(!o || !o.force) && o.force; return !(!t || !s && 0 !== e(":focus", t).length) && (t[n.hideMethod]({ duration: n.hideDuration, easing: n.hideEasing, complete: function () { h(t) } }), !0) } function d(t) { return v = e("<div/>").attr("id", t.containerId).addClass(t.positionClass), v.appendTo(e(t.target)), v } function p() { return { tapToDismiss: !0, toastClass: "toast", containerId: "toast-container", debug: !1, showMethod: "fadeIn", showDuration: 300, showEasing: "swing", onShown: void 0, hideMethod: "fadeOut", hideDuration: 1e3, hideEasing: "swing", onHidden: void 0, closeMethod: !1, closeDuration: !1, closeEasing: !1, closeOnHover: !0, extendedTimeOut: 1e3, iconClasses: { error: "toast-error", info: "toast-info", success: "toast-success", warning: "toast-warning" }, iconClass: "toast-info", positionClass: "toast-top-right", timeOut: 5e3, titleClass: "toast-title", messageClass: "toast-message", escapeHtml: !1, target: "body", closeHtml: '<button type="button">&times;</button>', closeClass: "toast-close-button", newestOnTop: !0, preventDuplicates: !1, progressBar: !1, progressClass: "toast-progress", rtl: !1 } } function f(e) { C && C(e) } function g(t) { function o(e) { return null == e && (e = ""), e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") } function s() { c(), u(), d(), p(), g(), C(), l(), i() } function i() { var e = ""; switch (t.iconClass) { case "toast-success": case "toast-info": e = "polite"; break; default: e = "assertive" }I.attr("aria-live", e) } function a() { E.closeOnHover && I.hover(H, D), !E.onclick && E.tapToDismiss && I.click(b), E.closeButton && j && j.click(function (e) { e.stopPropagation ? e.stopPropagation() : void 0 !== e.cancelBubble && e.cancelBubble !== !0 && (e.cancelBubble = !0), E.onCloseClick && E.onCloseClick(e), b(!0) }), E.onclick && I.click(function (e) { E.onclick(e), b() }) } function r() { I.hide(), I[E.showMethod]({ duration: E.showDuration, easing: E.showEasing, complete: E.onShown }), E.timeOut > 0 && (k = setTimeout(b, E.timeOut), F.maxHideTime = parseFloat(E.timeOut), F.hideEta = (new Date).getTime() + F.maxHideTime, E.progressBar && (F.intervalId = setInterval(x, 10))) } function c() { t.iconClass && I.addClass(E.toastClass).addClass(y) } function l() { E.newestOnTop ? v.prepend(I) : v.append(I) } function u() { if (t.title) { var e = t.title; E.escapeHtml && (e = o(t.title)), M.append(e).addClass(E.titleClass), I.append(M) } } function d() { if (t.message) { var e = t.message; E.escapeHtml && (e = o(t.message)), B.append(e).addClass(E.messageClass), I.append(B) } } function p() { E.closeButton && (j.addClass(E.closeClass).attr("role", "button"), I.prepend(j)) } function g() { E.progressBar && (q.addClass(E.progressClass), I.prepend(q)) } function C() { E.rtl && I.addClass("rtl") } function O(e, t) { if (e.preventDuplicates) { if (t.message === w) return !0; w = t.message } return !1 } function b(t) { var n = t && E.closeMethod !== !1 ? E.closeMethod : E.hideMethod, o = t && E.closeDuration !== !1 ? E.closeDuration : E.hideDuration, s = t && E.closeEasing !== !1 ? E.closeEasing : E.hideEasing; if (!e(":focus", I).length || t) return clearTimeout(F.intervalId), I[n]({ duration: o, easing: s, complete: function () { h(I), clearTimeout(k), E.onHidden && "hidden" !== P.state && E.onHidden(), P.state = "hidden", P.endTime = new Date, f(P) } }) } function D() { (E.timeOut > 0 || E.extendedTimeOut > 0) && (k = setTimeout(b, E.extendedTimeOut), F.maxHideTime = parseFloat(E.extendedTimeOut), F.hideEta = (new Date).getTime() + F.maxHideTime) } function H() { clearTimeout(k), F.hideEta = 0, I.stop(!0, !0)[E.showMethod]({ duration: E.showDuration, easing: E.showEasing }) } function x() { var e = (F.hideEta - (new Date).getTime()) / F.maxHideTime * 100; q.width(e + "%") } var E = m(), y = t.iconClass || E.iconClass; if ("undefined" != typeof t.optionsOverride && (E = e.extend(E, t.optionsOverride), y = t.optionsOverride.iconClass || y), !O(E, t)) { T++ , v = n(E, !0); var k = null, I = e("<div/>"), M = e("<div/>"), B = e("<div/>"), q = e("<div/>"), j = e(E.closeHtml), F = { intervalId: null, hideEta: null, maxHideTime: null }, P = { toastId: T, state: "visible", startTime: new Date, options: E, map: t }; return s(), r(), a(), f(P), E.debug && console && console.log(P), I } } function m() { return e.extend({}, p(), b.options) } function h(e) { v || (v = n()), e.is(":visible") || (e.remove(), e = null, 0 === v.children().length && (v.remove(), w = void 0)) } var v, C, w, T = 0, O = { error: "error", info: "info", success: "success", warning: "warning" }, b = { clear: r, remove: c, error: t, getContainer: n, info: o, options: {}, subscribe: s, success: i, version: "2.1.3", warning: a }; return b }() }) }("function" == typeof define && define.amd ? define : function (e, t) { "undefined" != typeof module && module.exports ? module.exports = t(require("jquery")) : window.toastr = t(window.jQuery) });


/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function (e, t) { "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t() }("undefined" != typeof window ? window : this, function () { function e() { } var t = e.prototype; return t.on = function (e, t) { if (e && t) { var i = this._events = this._events || {}, n = i[e] = i[e] || []; return n.indexOf(t) == -1 && n.push(t), this } }, t.once = function (e, t) { if (e && t) { this.on(e, t); var i = this._onceEvents = this._onceEvents || {}, n = i[e] = i[e] || {}; return n[t] = !0, this } }, t.off = function (e, t) { var i = this._events && this._events[e]; if (i && i.length) { var n = i.indexOf(t); return n != -1 && i.splice(n, 1), this } }, t.emitEvent = function (e, t) { var i = this._events && this._events[e]; if (i && i.length) { i = i.slice(0), t = t || []; for (var n = this._onceEvents && this._onceEvents[e], o = 0; o < i.length; o++) { var r = i[o], s = n && n[r]; s && (this.off(e, r), delete n[r]), r.apply(this, t) } return this } }, t.allOff = function () { delete this._events, delete this._onceEvents }, e }), function (e, t) { "use strict"; "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (i) { return t(e, i) }) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.imagesLoaded = t(e, e.EvEmitter) }("undefined" != typeof window ? window : this, function (e, t) { function i(e, t) { for (var i in t) e[i] = t[i]; return e } function n(e) { if (Array.isArray(e)) return e; var t = "object" == typeof e && "number" == typeof e.length; return t ? d.call(e) : [e] } function o(e, t, r) { if (!(this instanceof o)) return new o(e, t, r); var s = e; return "string" == typeof e && (s = document.querySelectorAll(e)), s ? (this.elements = n(s), this.options = i({}, this.options), "function" == typeof t ? r = t : i(this.options, t), r && this.on("always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(this.check.bind(this))) : void a.error("Bad element for imagesLoaded " + (s || e)) } function r(e) { this.img = e } function s(e, t) { this.url = e, this.element = t, this.img = new Image } var h = e.jQuery, a = e.console, d = Array.prototype.slice; o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function () { this.images = [], this.elements.forEach(this.addElementImages, this) }, o.prototype.addElementImages = function (e) { "IMG" == e.nodeName && this.addImage(e), this.options.background === !0 && this.addElementBackgroundImages(e); var t = e.nodeType; if (t && u[t]) { for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) { var o = i[n]; this.addImage(o) } if ("string" == typeof this.options.background) { var r = e.querySelectorAll(this.options.background); for (n = 0; n < r.length; n++) { var s = r[n]; this.addElementBackgroundImages(s) } } } }; var u = { 1: !0, 9: !0, 11: !0 }; return o.prototype.addElementBackgroundImages = function (e) { var t = getComputedStyle(e); if (t) for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) { var o = n && n[2]; o && this.addBackground(o, e), n = i.exec(t.backgroundImage) } }, o.prototype.addImage = function (e) { var t = new r(e); this.images.push(t) }, o.prototype.addBackground = function (e, t) { var i = new s(e, t); this.images.push(i) }, o.prototype.check = function () { function e(e, i, n) { setTimeout(function () { t.progress(e, i, n) }) } var t = this; return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function (t) { t.once("progress", e), t.check() }) : void this.complete() }, o.prototype.progress = function (e, t, i) { this.progressedCount++ , this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [this, e, t]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, e, t) }, o.prototype.complete = function () { var e = this.hasAnyBroken ? "fail" : "done"; if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) { var t = this.hasAnyBroken ? "reject" : "resolve"; this.jqDeferred[t](this) } }, r.prototype = Object.create(t.prototype), r.prototype.check = function () { var e = this.getIsImageComplete(); return e ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void (this.proxyImage.src = this.img.src)) }, r.prototype.getIsImageComplete = function () { return this.img.complete && this.img.naturalWidth }, r.prototype.confirm = function (e, t) { this.isLoaded = e, this.emitEvent("progress", [this, this.img, t]) }, r.prototype.handleEvent = function (e) { var t = "on" + e.type; this[t] && this[t](e) }, r.prototype.onload = function () { this.confirm(!0, "onload"), this.unbindEvents() }, r.prototype.onerror = function () { this.confirm(!1, "onerror"), this.unbindEvents() }, r.prototype.unbindEvents = function () { this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this) }, s.prototype = Object.create(r.prototype), s.prototype.check = function () { this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url; var e = this.getIsImageComplete(); e && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents()) }, s.prototype.unbindEvents = function () { this.img.removeEventListener("load", this), this.img.removeEventListener("error", this) }, s.prototype.confirm = function (e, t) { this.isLoaded = e, this.emitEvent("progress", [this, this.element, t]) }, o.makeJQueryPlugin = function (t) { t = t || e.jQuery, t && (h = t, h.fn.imagesLoaded = function (e, t) { var i = new o(this, e, t); return i.jqDeferred.promise(h(this)) }) }, o.makeJQueryPlugin(), o });


/*jslint browser: true */ /*global jQuery: true */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

// TODO JsDoc

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String key The key of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


// ProgressBar.js 1.1.0
// https://kimmobrunfeldt.github.io/progressbar.js
// License: MIT

!function (a) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else { var b; b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.ProgressBar = a() } }(function () { var a; return function () { function a(b, c, d) { function e(g, h) { if (!c[g]) { if (!b[g]) { var i = "function" == typeof require && require; if (!h && i) return i(g, !0); if (f) return f(g, !0); var j = new Error("Cannot find module '" + g + "'"); throw j.code = "MODULE_NOT_FOUND", j } var k = c[g] = { exports: {} }; b[g][0].call(k.exports, function (a) { return e(b[g][1][a] || a) }, k, k.exports, a, b, c, d) } return c[g].exports } for (var f = "function" == typeof require && require, g = 0; g < d.length; g++)e(d[g]); return e } return a }()({ 1: [function (b, c, d) { !function (b, e) { "object" == typeof d && "object" == typeof c ? c.exports = e() : "function" == typeof a && a.amd ? a("shifty", [], e) : "object" == typeof d ? d.shifty = e() : b.shifty = e() }(window, function () { return function (a) { function b(d) { if (c[d]) return c[d].exports; var e = c[d] = { i: d, l: !1, exports: {} }; return a[d].call(e.exports, e, e.exports, b), e.l = !0, e.exports } var c = {}; return b.m = a, b.c = c, b.d = function (a, c, d) { b.o(a, c) || Object.defineProperty(a, c, { enumerable: !0, get: d }) }, b.r = function (a) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a, "__esModule", { value: !0 }) }, b.t = function (a, c) { if (1 & c && (a = b(a)), 8 & c) return a; if (4 & c && "object" == typeof a && a && a.__esModule) return a; var d = Object.create(null); if (b.r(d), Object.defineProperty(d, "default", { enumerable: !0, value: a }), 2 & c && "string" != typeof a) for (var e in a) b.d(d, e, function (b) { return a[b] }.bind(null, e)); return d }, b.n = function (a) { var c = a && a.__esModule ? function () { return a.default } : function () { return a }; return b.d(c, "a", c), c }, b.o = function (a, b) { return Object.prototype.hasOwnProperty.call(a, b) }, b.p = "", b(b.s = 3) }([function (a, b, c) { "use strict"; (function (a) { function d(a, b) { for (var c = 0; c < b.length; c++) { var d = b[c]; d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d) } } function e(a) { return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (a) { return typeof a } : function (a) { return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a })(a) } function f(a) { for (var b = 1; b < arguments.length; b++) { var c = null != arguments[b] ? arguments[b] : {}, d = Object.keys(c); "function" == typeof Object.getOwnPropertySymbols && (d = d.concat(Object.getOwnPropertySymbols(c).filter(function (a) { return Object.getOwnPropertyDescriptor(c, a).enumerable }))), d.forEach(function (b) { g(a, b, c[b]) }) } return a } function g(a, b, c) { return b in a ? Object.defineProperty(a, b, { value: c, enumerable: !0, configurable: !0, writable: !0 }) : a[b] = c, a } function h() { var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, b = new u, c = b.tween(a); return c.tweenable = b, c } c.d(b, "e", function () { return p }), c.d(b, "c", function () { return r }), c.d(b, "b", function () { return s }), c.d(b, "a", function () { return u }), c.d(b, "d", function () { return h }); var i = c(1), j = "undefined" != typeof window ? window : a, k = j.requestAnimationFrame || j.webkitRequestAnimationFrame || j.oRequestAnimationFrame || j.msRequestAnimationFrame || j.mozCancelRequestAnimationFrame && j.mozRequestAnimationFrame || setTimeout, l = function () { }, m = null, n = null, o = f({}, i), p = function (a, b, c, d, e, f, g) { var h = a < f ? 0 : (a - f) / e; for (var i in b) { var j = g[i], k = j.call ? j : o[j], l = c[i]; b[i] = l + (d[i] - l) * k(h) } return b }, q = function (a, b) { var c = a._attachment, d = a._currentState, e = a._delay, f = a._easing, g = a._originalState, h = a._duration, i = a._step, j = a._targetState, k = a._timestamp, l = k + e + h, m = b > l ? l : b, n = h - (l - m); m >= l ? (i(j, c, n), a.stop(!0)) : (a._applyFilter("beforeTween"), m < k + e ? (m = 1, h = 1, k = 1) : k += e, p(m, d, g, j, h, k, f), a._applyFilter("afterTween"), i(d, c, n)) }, r = function () { for (var a = u.now(), b = m; b;) { var c = b._next; q(b, a), b = c } }, s = function (a) { var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "linear", c = {}, d = e(b); if ("string" === d || "function" === d) for (var f in a) c[f] = b; else for (var g in a) c[g] = b[g] || "linear"; return c }, t = function (a) { if (a === m) (m = a._next) ? m._previous = null : n = null; else if (a === n) (n = a._previous) ? n._next = null : m = null; else { var b = a._previous, c = a._next; b._next = c, c._previous = b } a._previous = a._next = null }, u = function () { function a() { var b = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, c = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0; !function (a, b) { if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function") }(this, a), this._currentState = b, this._configured = !1, this._filters = [], this._timestamp = null, this._next = null, this._previous = null, c && this.setConfig(c) } var b, c, e; return b = a, (c = [{ key: "_applyFilter", value: function (a) { var b = !0, c = !1, d = void 0; try { for (var e, f = this._filters[Symbol.iterator](); !(b = (e = f.next()).done); b = !0) { var g = e.value[a]; g && g(this) } } catch (a) { c = !0, d = a } finally { try { b || null == f.return || f.return() } finally { if (c) throw d } } } }, { key: "tween", value: function () { var b = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0, c = this._attachment, d = this._configured; return !b && d || this.setConfig(b), this._pausedAtTime = null, this._timestamp = a.now(), this._start(this.get(), c), this.resume() } }, { key: "setConfig", value: function () { var b = this, c = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, d = c.attachment, e = c.delay, g = void 0 === e ? 0 : e, h = c.duration, i = void 0 === h ? 500 : h, j = c.easing, k = c.from, m = c.promise, n = void 0 === m ? Promise : m, o = c.start, p = void 0 === o ? l : o, q = c.step, r = void 0 === q ? l : q, t = c.to; this._configured = !0, this._attachment = d, this._isPlaying = !1, this._pausedAtTime = null, this._scheduleId = null, this._delay = g, this._start = p, this._step = r, this._duration = i, this._currentState = f({}, k || this.get()), this._originalState = this.get(), this._targetState = f({}, t || this.get()); var u = this._currentState; this._targetState = f({}, u, this._targetState), this._easing = s(u, j); var v = a.filters; for (var w in this._filters.length = 0, v) v[w].doesApply(this) && this._filters.push(v[w]); return this._applyFilter("tweenCreated"), this._promise = new n(function (a, c) { b._resolve = a, b._reject = c }), this._promise.catch(l), this } }, { key: "get", value: function () { return f({}, this._currentState) } }, { key: "set", value: function (a) { this._currentState = a } }, { key: "pause", value: function () { if (this._isPlaying) return this._pausedAtTime = a.now(), this._isPlaying = !1, t(this), this } }, { key: "resume", value: function () { if (null === this._timestamp) return this.tween(); if (this._isPlaying) return this._promise; var b = a.now(); return this._pausedAtTime && (this._timestamp += b - this._pausedAtTime, this._pausedAtTime = null), this._isPlaying = !0, null === m ? (m = this, n = this, function a() { m && (k.call(j, a, 1e3 / 60), r()) }()) : (this._previous = n, n._next = this, n = this), this._promise } }, { key: "seek", value: function (b) { b = Math.max(b, 0); var c = a.now(); return this._timestamp + b === 0 ? this : (this._timestamp = c - b, this._isPlaying || q(this, c), this) } }, { key: "stop", value: function () { var a = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], b = this._attachment, c = this._currentState, d = this._easing, e = this._originalState, f = this._targetState; if (this._isPlaying) return this._isPlaying = !1, t(this), a ? (this._applyFilter("beforeTween"), p(1, c, e, f, 1, 0, d), this._applyFilter("afterTween"), this._applyFilter("afterTweenEnd"), this._resolve(c, b)) : this._reject(c, b), this } }, { key: "isPlaying", value: function () { return this._isPlaying } }, { key: "setScheduleFunction", value: function (b) { a.setScheduleFunction(b) } }, { key: "dispose", value: function () { for (var a in this) delete this[a] } }]) && d(b.prototype, c), e && d(b, e), a }(); u.setScheduleFunction = function (a) { return k = a }, u.formulas = o, u.filters = {}, u.now = Date.now || function () { return +new Date } }).call(this, c(2)) }, function (a, b, c) { "use strict"; c.r(b), c.d(b, "linear", function () { return d }), c.d(b, "easeInQuad", function () { return e }), c.d(b, "easeOutQuad", function () { return f }), c.d(b, "easeInOutQuad", function () { return g }), c.d(b, "easeInCubic", function () { return h }), c.d(b, "easeOutCubic", function () { return i }), c.d(b, "easeInOutCubic", function () { return j }), c.d(b, "easeInQuart", function () { return k }), c.d(b, "easeOutQuart", function () { return l }), c.d(b, "easeInOutQuart", function () { return m }), c.d(b, "easeInQuint", function () { return n }), c.d(b, "easeOutQuint", function () { return o }), c.d(b, "easeInOutQuint", function () { return p }), c.d(b, "easeInSine", function () { return q }), c.d(b, "easeOutSine", function () { return r }), c.d(b, "easeInOutSine", function () { return s }), c.d(b, "easeInExpo", function () { return t }), c.d(b, "easeOutExpo", function () { return u }), c.d(b, "easeInOutExpo", function () { return v }), c.d(b, "easeInCirc", function () { return w }), c.d(b, "easeOutCirc", function () { return x }), c.d(b, "easeInOutCirc", function () { return y }), c.d(b, "easeOutBounce", function () { return z }), c.d(b, "easeInBack", function () { return A }), c.d(b, "easeOutBack", function () { return B }), c.d(b, "easeInOutBack", function () { return C }), c.d(b, "elastic", function () { return D }), c.d(b, "swingFromTo", function () { return E }), c.d(b, "swingFrom", function () { return F }), c.d(b, "swingTo", function () { return G }), c.d(b, "bounce", function () { return H }), c.d(b, "bouncePast", function () { return I }), c.d(b, "easeFromTo", function () { return J }), c.d(b, "easeFrom", function () { return K }), c.d(b, "easeTo", function () { return L }); var d = function (a) { return a }, e = function (a) { return Math.pow(a, 2) }, f = function (a) { return -(Math.pow(a - 1, 2) - 1) }, g = function (a) { return (a /= .5) < 1 ? .5 * Math.pow(a, 2) : -.5 * ((a -= 2) * a - 2) }, h = function (a) { return Math.pow(a, 3) }, i = function (a) { return Math.pow(a - 1, 3) + 1 }, j = function (a) { return (a /= .5) < 1 ? .5 * Math.pow(a, 3) : .5 * (Math.pow(a - 2, 3) + 2) }, k = function (a) { return Math.pow(a, 4) }, l = function (a) { return -(Math.pow(a - 1, 4) - 1) }, m = function (a) { return (a /= .5) < 1 ? .5 * Math.pow(a, 4) : -.5 * ((a -= 2) * Math.pow(a, 3) - 2) }, n = function (a) { return Math.pow(a, 5) }, o = function (a) { return Math.pow(a - 1, 5) + 1 }, p = function (a) { return (a /= .5) < 1 ? .5 * Math.pow(a, 5) : .5 * (Math.pow(a - 2, 5) + 2) }, q = function (a) { return 1 - Math.cos(a * (Math.PI / 2)) }, r = function (a) { return Math.sin(a * (Math.PI / 2)) }, s = function (a) { return -.5 * (Math.cos(Math.PI * a) - 1) }, t = function (a) { return 0 === a ? 0 : Math.pow(2, 10 * (a - 1)) }, u = function (a) { return 1 === a ? 1 : 1 - Math.pow(2, -10 * a) }, v = function (a) { return 0 === a ? 0 : 1 === a ? 1 : (a /= .5) < 1 ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * --a)) }, w = function (a) { return -(Math.sqrt(1 - a * a) - 1) }, x = function (a) { return Math.sqrt(1 - Math.pow(a - 1, 2)) }, y = function (a) { return (a /= .5) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1) }, z = function (a) { return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375 }, A = function (a) { var b = 1.70158; return a * a * ((b + 1) * a - b) }, B = function (a) { var b = 1.70158; return (a -= 1) * a * ((b + 1) * a + b) + 1 }, C = function (a) { var b = 1.70158; return (a /= .5) < 1 ? a * a * ((1 + (b *= 1.525)) * a - b) * .5 : .5 * ((a -= 2) * a * ((1 + (b *= 1.525)) * a + b) + 2) }, D = function (a) { return -1 * Math.pow(4, -8 * a) * Math.sin((6 * a - 1) * (2 * Math.PI) / 2) + 1 }, E = function (a) { var b = 1.70158; return (a /= .5) < 1 ? a * a * ((1 + (b *= 1.525)) * a - b) * .5 : .5 * ((a -= 2) * a * ((1 + (b *= 1.525)) * a + b) + 2) }, F = function (a) { var b = 1.70158; return a * a * ((b + 1) * a - b) }, G = function (a) { var b = 1.70158; return (a -= 1) * a * ((b + 1) * a + b) + 1 }, H = function (a) { return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375 }, I = function (a) { return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 2 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : a < 2.5 / 2.75 ? 2 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 2 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375) }, J = function (a) { return (a /= .5) < 1 ? .5 * Math.pow(a, 4) : -.5 * ((a -= 2) * Math.pow(a, 3) - 2) }, K = function (a) { return Math.pow(a, 4) }, L = function (a) { return Math.pow(a, .25) } }, function (a, b) { var c; c = function () { return this }(); try { c = c || new Function("return this")() } catch (a) { "object" == typeof window && (c = window) } a.exports = c }, function (a, b, c) { "use strict"; function d(a) { return parseInt(a, 16) } function e(a) { var b = a._currentState;[b, a._originalState, a._targetState].forEach(z), a._tokenData = C(b) } function f(a) { var b = a._currentState, c = a._originalState, d = a._targetState, e = a._easing, f = a._tokenData; I(e, f), [b, c, d].forEach(function (a) { return D(a, f) }) } function g(a) { var b = a._currentState, c = a._originalState, d = a._targetState, e = a._easing, f = a._tokenData;[b, c, d].forEach(function (a) { return H(a, f) }), J(e, f) } function h(a, b, c) { return b in a ? Object.defineProperty(a, b, { value: c, enumerable: !0, configurable: !0, writable: !0 }) : a[b] = c, a } function i(a) { return function (a) { if (Array.isArray(a)) { for (var b = 0, c = new Array(a.length); b < a.length; b++)c[b] = a[b]; return c } }(a) || function (a) { if (Symbol.iterator in Object(a) || "[object Arguments]" === Object.prototype.toString.call(a)) return Array.from(a) }(a) || function () { throw new TypeError("Invalid attempt to spread non-iterable instance") }() } function j(a, b) { for (var c = 0; c < b.length; c++) { var d = b[c]; d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d) } } function k(a, b) { if (!b.has(a)) throw new TypeError("attempted to get private field on non-instance"); var c = b.get(a); return c.get ? c.get.call(a) : c.value } function l(a, b, c, d, e, f) { var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = function (a) { return ((g * a + h) * a + i) * a }, n = function (a) { return a >= 0 ? a : 0 - a }; return g = 1 - (i = 3 * b) - (h = 3 * (d - b) - i), j = 1 - (l = 3 * c) - (k = 3 * (e - c) - l), function (a, b) { return c = function (a, b) { var c, d, e, f, j, k, l; for (e = a, k = 0; k < 8; k++) { if (f = m(e) - a, n(f) < b) return e; if (n(j = (3 * g * (l = e) + 2 * h) * l + i) < 1e-6) break; e -= f / j } if ((e = a) < (c = 0)) return c; if (e > (d = 1)) return d; for (; c < d;) { if (f = m(e), n(f - a) < b) return e; a > f ? c = e : d = e, e = .5 * (d - c) + c } return e }(a, b), ((j * c + k) * c + l) * c; var c }(a, function (a) { return 1 / (200 * a) }(f)) } c.r(b); var m = {}; c.r(m), c.d(m, "doesApply", function () { return K }), c.d(m, "tweenCreated", function () { return e }), c.d(m, "beforeTween", function () { return f }), c.d(m, "afterTween", function () { return g }); var n, o, p = c(0), q = /(\d|-|\.)/, r = /([^\-0-9.]+)/g, s = /[0-9.-]+/g, t = (n = s.source, o = /,\s*/.source, new RegExp("rgb\\(".concat(n).concat(o).concat(n).concat(o).concat(n, "\\)"), "g")), u = /^.*\(/, v = /#([0-9]|[a-f]){3,6}/gi, w = function (a, b) { return a.map(function (a, c) { return "_".concat(b, "_").concat(c) }) }, x = function (a) { return "rgb(".concat((b = a, 3 === (b = b.replace(/#/, "")).length && (b = (b = b.split(""))[0] + b[0] + b[1] + b[1] + b[2] + b[2]), [d(b.substr(0, 2)), d(b.substr(2, 2)), d(b.substr(4, 2))]).join(","), ")"); var b }, y = function (a, b, c) { var d = b.match(a), e = b.replace(a, "VAL"); return d && d.forEach(function (a) { return e = e.replace("VAL", c(a)) }), e }, z = function (a) { for (var b in a) { var c = a[b]; "string" == typeof c && c.match(v) && (a[b] = y(v, c, x)) } }, A = function (a) { var b = a.match(s).map(Math.floor); return "".concat(a.match(u)[0]).concat(b.join(","), ")") }, B = function (a) { return a.match(s) }, C = function (a) { var b, c, d = {}; for (var e in a) { var f = a[e]; "string" == typeof f && (d[e] = { formatString: (b = f, c = void 0, c = b.match(r), c ? (1 === c.length || b.charAt(0).match(q)) && c.unshift("") : c = ["", ""], c.join("VAL")), chunkNames: w(B(f), e) }) } return d }, D = function (a, b) { var c = function (c) { B(a[c]).forEach(function (d, e) { return a[b[c].chunkNames[e]] = +d }), delete a[c] }; for (var d in b) c(d) }, E = function (a, b) { var c = {}; return b.forEach(function (b) { c[b] = a[b], delete a[b] }), c }, F = function (a, b) { return b.map(function (b) { return a[b] }) }, G = function (a, b) { return b.forEach(function (b) { return a = a.replace("VAL", +b.toFixed(4)) }), a }, H = function (a, b) { for (var c in b) { var d = b[c], e = d.chunkNames, f = d.formatString, g = G(f, F(E(a, e), e)); a[c] = y(t, g, A) } }, I = function (a, b) { var c = function (c) { var d = b[c].chunkNames, e = a[c]; if ("string" == typeof e) { var f = e.split(" "), g = f[f.length - 1]; d.forEach(function (b, c) { return a[b] = f[c] || g }) } else d.forEach(function (b) { return a[b] = e }); delete a[c] }; for (var d in b) c(d) }, J = function (a, b) { for (var c in b) { var d = b[c].chunkNames, e = a[d[0]]; a[c] = "string" == typeof e ? d.map(function (b) { var c = a[b]; return delete a[b], c }).join(" ") : e } }, K = function (a) { var b = a._currentState; return Object.keys(b).some(function (a) { return "string" == typeof b[a] }) }, L = new p.a, M = p.a.filters, N = function (a, b, c, d) { var e = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, f = function (a) { for (var b = 1; b < arguments.length; b++) { var c = null != arguments[b] ? arguments[b] : {}, d = Object.keys(c); "function" == typeof Object.getOwnPropertySymbols && (d = d.concat(Object.getOwnPropertySymbols(c).filter(function (a) { return Object.getOwnPropertyDescriptor(c, a).enumerable }))), d.forEach(function (b) { h(a, b, c[b]) }) } return a }({}, a), g = Object(p.b)(a, d); for (var i in L._filters.length = 0, L.set({}), L._currentState = f, L._originalState = a, L._targetState = b, L._easing = g, M) M[i].doesApply(L) && L._filters.push(M[i]); L._applyFilter("tweenCreated"), L._applyFilter("beforeTween"); var j = Object(p.e)(c, f, a, b, 1, e, g); return L._applyFilter("afterTween"), j }, O = function () { function a() { !function (a, b) { if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function") }(this, a), P.set(this, { writable: !0, value: [] }); for (var b = arguments.length, c = new Array(b), d = 0; d < b; d++)c[d] = arguments[d]; c.forEach(this.add.bind(this)) } var b, c, d; return b = a, (c = [{ key: "add", value: function (a) { return k(this, P).push(a), a } }, { key: "remove", value: function (a) { var b = k(this, P).indexOf(a); return ~b && k(this, P).splice(b, 1), a } }, { key: "empty", value: function () { return this.tweenables.map(this.remove.bind(this)) } }, { key: "isPlaying", value: function () { return k(this, P).some(function (a) { return a.isPlaying() }) } }, { key: "play", value: function () { return k(this, P).forEach(function (a) { return a.tween() }), this } }, { key: "pause", value: function () { return k(this, P).forEach(function (a) { return a.pause() }), this } }, { key: "resume", value: function () { return k(this, P).forEach(function (a) { return a.resume() }), this } }, { key: "stop", value: function (a) { return k(this, P).forEach(function (b) { return b.stop(a) }), this } }, { key: "tweenables", get: function () { return i(k(this, P)) } }, { key: "promises", get: function () { return k(this, P).map(function (a) { return a._promise }) } }]) && j(b.prototype, c), d && j(b, d), a }(), P = new WeakMap, Q = function (a, b, c, d, e) { var f = function (a, b, c, d) { return function (e) { return l(e, a, b, c, d, 1) } }(b, c, d, e); return f.displayName = a, f.x1 = b, f.y1 = c, f.x2 = d, f.y2 = e, p.a.formulas[a] = f }, R = function (a) { return delete p.a.formulas[a] }; c.d(b, "processTweens", function () { return p.c }), c.d(b, "Tweenable", function () { return p.a }), c.d(b, "tween", function () { return p.d }), c.d(b, "interpolate", function () { return N }), c.d(b, "Scene", function () { return O }), c.d(b, "setBezierFunction", function () { return Q }), c.d(b, "unsetBezierFunction", function () { return R }), p.a.filters.token = m }]) }) }, {}], 2: [function (a, b, c) { var d = a("./shape"), e = a("./utils"), f = function (a, b) { this._pathTemplate = "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}", this.containerAspectRatio = 1, d.apply(this, arguments) }; f.prototype = new d, f.prototype.constructor = f, f.prototype._pathString = function (a) { var b = a.strokeWidth; a.trailWidth && a.trailWidth > a.strokeWidth && (b = a.trailWidth); var c = 50 - b / 2; return e.render(this._pathTemplate, { radius: c, "2radius": 2 * c }) }, f.prototype._trailString = function (a) { return this._pathString(a) }, b.exports = f }, { "./shape": 7, "./utils": 9 }], 3: [function (a, b, c) { var d = a("./shape"), e = a("./utils"), f = function (a, b) { this._pathTemplate = "M 0,{center} L 100,{center}", d.apply(this, arguments) }; f.prototype = new d, f.prototype.constructor = f, f.prototype._initializeSvg = function (a, b) { a.setAttribute("viewBox", "0 0 100 " + b.strokeWidth), a.setAttribute("preserveAspectRatio", "none") }, f.prototype._pathString = function (a) { return e.render(this._pathTemplate, { center: a.strokeWidth / 2 }) }, f.prototype._trailString = function (a) { return this._pathString(a) }, b.exports = f }, { "./shape": 7, "./utils": 9 }], 4: [function (a, b, c) { b.exports = { Line: a("./line"), Circle: a("./circle"), SemiCircle: a("./semicircle"), Square: a("./square"), Path: a("./path"), Shape: a("./shape"), utils: a("./utils") } }, { "./circle": 2, "./line": 3, "./path": 5, "./semicircle": 6, "./shape": 7, "./square": 8, "./utils": 9 }], 5: [function (a, b, c) { var d = a("shifty"), e = a("./utils"), f = d.Tweenable, g = { easeIn: "easeInCubic", easeOut: "easeOutCubic", easeInOut: "easeInOutCubic" }, h = function a(b, c) { if (!(this instanceof a)) throw new Error("Constructor was called without new keyword"); c = e.extend({ delay: 0, duration: 800, easing: "linear", from: {}, to: {}, step: function () { } }, c); var d; d = e.isString(b) ? document.querySelector(b) : b, this.path = d, this._opts = c, this._tweenable = null; var f = this.path.getTotalLength(); this.path.style.strokeDasharray = f + " " + f, this.set(0) }; h.prototype.value = function () { var a = this._getComputedDashOffset(), b = this.path.getTotalLength(), c = 1 - a / b; return parseFloat(c.toFixed(6), 10) }, h.prototype.set = function (a) { this.stop(), this.path.style.strokeDashoffset = this._progressToOffset(a); var b = this._opts.step; if (e.isFunction(b)) { var c = this._easing(this._opts.easing); b(this._calculateTo(a, c), this._opts.shape || this, this._opts.attachment) } }, h.prototype.stop = function () { this._stopTween(), this.path.style.strokeDashoffset = this._getComputedDashOffset() }, h.prototype.animate = function (a, b, c) { b = b || {}, e.isFunction(b) && (c = b, b = {}); var d = e.extend({}, b), g = e.extend({}, this._opts); b = e.extend(g, b); var h = this._easing(b.easing), i = this._resolveFromAndTo(a, h, d); this.stop(), this.path.getBoundingClientRect(); var j = this._getComputedDashOffset(), k = this._progressToOffset(a), l = this; this._tweenable = new f, this._tweenable.tween({ from: e.extend({ offset: j }, i.from), to: e.extend({ offset: k }, i.to), duration: b.duration, delay: b.delay, easing: h, step: function (a) { l.path.style.strokeDashoffset = a.offset; var c = b.shape || l; b.step(a, c, b.attachment) } })/*.then(function (a) { e.isFunction(c) && c() })*/ }, h.prototype._getComputedDashOffset = function () { var a = window.getComputedStyle(this.path, null); return parseFloat(a.getPropertyValue("stroke-dashoffset"), 10) }, h.prototype._progressToOffset = function (a) { var b = this.path.getTotalLength(); return b - a * b }, h.prototype._resolveFromAndTo = function (a, b, c) { return c.from && c.to ? { from: c.from, to: c.to } : { from: this._calculateFrom(b), to: this._calculateTo(a, b) } }, h.prototype._calculateFrom = function (a) { return d.interpolate(this._opts.from, this._opts.to, this.value(), a) }, h.prototype._calculateTo = function (a, b) { return d.interpolate(this._opts.from, this._opts.to, a, b) }, h.prototype._stopTween = function () { null !== this._tweenable && (this._tweenable.stop(), this._tweenable = null) }, h.prototype._easing = function (a) { return g.hasOwnProperty(a) ? g[a] : a }, b.exports = h }, { "./utils": 9, shifty: 1 }], 6: [function (a, b, c) { var d = a("./shape"), e = a("./circle"), f = a("./utils"), g = function (a, b) { this._pathTemplate = "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0", this.containerAspectRatio = 2, d.apply(this, arguments) }; g.prototype = new d, g.prototype.constructor = g, g.prototype._initializeSvg = function (a, b) { a.setAttribute("viewBox", "0 0 100 50") }, g.prototype._initializeTextContainer = function (a, b, c) { a.text.style && (c.style.top = "auto", c.style.bottom = "0", a.text.alignToBottom ? f.setStyle(c, "transform", "translate(-50%, 0)") : f.setStyle(c, "transform", "translate(-50%, 50%)")) }, g.prototype._pathString = e.prototype._pathString, g.prototype._trailString = e.prototype._trailString, b.exports = g }, { "./circle": 2, "./shape": 7, "./utils": 9 }], 7: [function (a, b, c) { var d = a("./path"), e = a("./utils"), f = "Object is destroyed", g = function a(b, c) { if (!(this instanceof a)) throw new Error("Constructor was called without new keyword"); if (0 !== arguments.length) { this._opts = e.extend({ color: "#555", strokeWidth: 1, trailColor: null, trailWidth: null, fill: null, text: { style: { color: null, position: "absolute", left: "50%", top: "50%", padding: 0, margin: 0, transform: { prefix: !0, value: "translate(-50%, -50%)" } }, autoStyleContainer: !0, alignToBottom: !0, value: null, className: "progressbar-text" }, svgStyle: { display: "block", width: "100%" }, warnings: !1 }, c, !0), e.isObject(c) && void 0 !== c.svgStyle && (this._opts.svgStyle = c.svgStyle), e.isObject(c) && e.isObject(c.text) && void 0 !== c.text.style && (this._opts.text.style = c.text.style); var f, g = this._createSvgView(this._opts); if (!(f = e.isString(b) ? document.querySelector(b) : b)) throw new Error("Container does not exist: " + b); this._container = f, this._container.appendChild(g.svg), this._opts.warnings && this._warnContainerAspectRatio(this._container), this._opts.svgStyle && e.setStyles(g.svg, this._opts.svgStyle), this.svg = g.svg, this.path = g.path, this.trail = g.trail, this.text = null; var h = e.extend({ attachment: void 0, shape: this }, this._opts); this._progressPath = new d(g.path, h), e.isObject(this._opts.text) && null !== this._opts.text.value && this.setText(this._opts.text.value) } }; g.prototype.animate = function (a, b, c) { if (null === this._progressPath) throw new Error(f); this._progressPath.animate(a, b, c) }, g.prototype.stop = function () { if (null === this._progressPath) throw new Error(f); void 0 !== this._progressPath && this._progressPath.stop() }, g.prototype.pause = function () { if (null === this._progressPath) throw new Error(f); void 0 !== this._progressPath && this._progressPath._tweenable && this._progressPath._tweenable.pause() }, g.prototype.resume = function () { if (null === this._progressPath) throw new Error(f); void 0 !== this._progressPath && this._progressPath._tweenable && this._progressPath._tweenable.resume() }, g.prototype.destroy = function () { if (null === this._progressPath) throw new Error(f); this.stop(), this.svg.parentNode.removeChild(this.svg), this.svg = null, this.path = null, this.trail = null, this._progressPath = null, null !== this.text && (this.text.parentNode.removeChild(this.text), this.text = null) }, g.prototype.set = function (a) { if (null === this._progressPath) throw new Error(f); this._progressPath.set(a) }, g.prototype.value = function () { if (null === this._progressPath) throw new Error(f); return void 0 === this._progressPath ? 0 : this._progressPath.value() }, g.prototype.setText = function (a) { if (null === this._progressPath) throw new Error(f); null === this.text && (this.text = this._createTextContainer(this._opts, this._container), this._container.appendChild(this.text)), e.isObject(a) ? (e.removeChildren(this.text), this.text.appendChild(a)) : this.text.innerHTML = a }, g.prototype._createSvgView = function (a) { var b = document.createElementNS("http://www.w3.org/2000/svg", "svg"); this._initializeSvg(b, a); var c = null; (a.trailColor || a.trailWidth) && (c = this._createTrail(a), b.appendChild(c)); var d = this._createPath(a); return b.appendChild(d), { svg: b, path: d, trail: c } }, g.prototype._initializeSvg = function (a, b) { a.setAttribute("viewBox", "0 0 100 100") }, g.prototype._createPath = function (a) { var b = this._pathString(a); return this._createPathElement(b, a) }, g.prototype._createTrail = function (a) { var b = this._trailString(a), c = e.extend({}, a); return c.trailColor || (c.trailColor = "#eee"), c.trailWidth || (c.trailWidth = c.strokeWidth), c.color = c.trailColor, c.strokeWidth = c.trailWidth, c.fill = null, this._createPathElement(b, c) }, g.prototype._createPathElement = function (a, b) { var c = document.createElementNS("http://www.w3.org/2000/svg", "path"); return c.setAttribute("d", a), c.setAttribute("stroke", b.color), c.setAttribute("stroke-width", b.strokeWidth), b.fill ? c.setAttribute("fill", b.fill) : c.setAttribute("fill-opacity", "0"), c }, g.prototype._createTextContainer = function (a, b) { var c = document.createElement("div"); c.className = a.text.className; var d = a.text.style; return d && (a.text.autoStyleContainer && (b.style.position = "relative"), e.setStyles(c, d), d.color || (c.style.color = a.color)), this._initializeTextContainer(a, b, c), c }, g.prototype._initializeTextContainer = function (a, b, c) { }, g.prototype._pathString = function (a) { throw new Error("Override this function for each progress bar") }, g.prototype._trailString = function (a) { throw new Error("Override this function for each progress bar") }, g.prototype._warnContainerAspectRatio = function (a) { if (this.containerAspectRatio) { var b = window.getComputedStyle(a, null), c = parseFloat(b.getPropertyValue("width"), 10), d = parseFloat(b.getPropertyValue("height"), 10); e.floatEquals(this.containerAspectRatio, c / d) || (console.warn("Incorrect aspect ratio of container", "#" + a.id, "detected:", b.getPropertyValue("width") + "(width)", "/", b.getPropertyValue("height") + "(height)", "=", c / d), console.warn("Aspect ratio of should be", this.containerAspectRatio)) } }, b.exports = g }, { "./path": 5, "./utils": 9 }], 8: [function (a, b, c) { var d = a("./shape"), e = a("./utils"), f = function (a, b) { this._pathTemplate = "M 0,{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{strokeWidth}", this._trailTemplate = "M {startMargin},{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{halfOfStrokeWidth}", d.apply(this, arguments) }; f.prototype = new d, f.prototype.constructor = f, f.prototype._pathString = function (a) { var b = 100 - a.strokeWidth / 2; return e.render(this._pathTemplate, { width: b, strokeWidth: a.strokeWidth, halfOfStrokeWidth: a.strokeWidth / 2 }) }, f.prototype._trailString = function (a) { var b = 100 - a.strokeWidth / 2; return e.render(this._trailTemplate, { width: b, strokeWidth: a.strokeWidth, halfOfStrokeWidth: a.strokeWidth / 2, startMargin: a.strokeWidth / 2 - a.trailWidth / 2 }) }, b.exports = f }, { "./shape": 7, "./utils": 9 }], 9: [function (a, b, c) { function d(a, b, c) { a = a || {}, b = b || {}, c = c || !1; for (var e in b) if (b.hasOwnProperty(e)) { var f = a[e], g = b[e]; c && l(f) && l(g) ? a[e] = d(f, g, c) : a[e] = g } return a } function e(a, b) { var c = a; for (var d in b) if (b.hasOwnProperty(d)) { var e = b[d], f = "\\{" + d + "\\}", g = new RegExp(f, "g"); c = c.replace(g, e) } return c } function f(a, b, c) { for (var d = a.style, e = 0; e < p.length; ++e) { d[p[e] + h(b)] = c } d[b] = c } function g(a, b) { m(b, function (b, c) { null !== b && void 0 !== b && (l(b) && !0 === b.prefix ? f(a, c, b.value) : a.style[c] = b) }) } function h(a) { return a.charAt(0).toUpperCase() + a.slice(1) } function i(a) { return "string" == typeof a || a instanceof String } function j(a) { return "function" == typeof a } function k(a) { return "[object Array]" === Object.prototype.toString.call(a) } function l(a) { return !k(a) && ("object" == typeof a && !!a) } function m(a, b) { for (var c in a) if (a.hasOwnProperty(c)) { var d = a[c]; b(d, c) } } function n(a, b) { return Math.abs(a - b) < q } function o(a) { for (; a.firstChild;)a.removeChild(a.firstChild) } var p = "Webkit Moz O ms".split(" "), q = .001; b.exports = { extend: d, render: e, setStyle: f, setStyles: g, capitalize: h, isString: i, isFunction: j, isObject: l, forEachObject: m, floatEquals: n, removeChildren: o } }, {}] }, {}, [4])(4) });

  