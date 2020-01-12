var CONFIG = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {},
    GET_CONFIG = function (obj) {
        var group = obj['group'] || '',
            key = obj['key'] || '';
        return CONFIG[group][key] || [];
    };

var bdy = $('body'),
    win = $(window),
    doc = $(document),
    wt = parseFloat(win.width()),
    ht = parseFloat(win.height()),
    wst = parseFloat(win.scrollTop()),
    sRatio,
    isMobile = mobile.detect(),
    editableMode = $('.admin-wrapper').length > 0 || $('[editable]').length > 0 ? true : false,
    protocols = window.location.protocol,
    uty = {
        speed: 666,
        easing: 'easeInOutExpo',
        ani: function (o, callback) {
            var _t = this, ID = o['el'];
            if (_t.detectEl(ID)) {
                ID.stop().animate(o['prop'], o['speed'] || _t.speed, o['easing'] || _t.easing);
                setTimeout(function () {
                    if (typeof callback !== 'undefined')
                        callback();
                }, (o['speed'] || _t.speed) + 1);
            }
        },
        detectEl: function (ID) {
            return ID.length > 0 ? true : false;
        },
        ajx: function (o, callback) {
            $.ajax({
                type: o['type'] || 'GET',
                dataType: o['dataType'] || 'html',
                url: o['uri'] || '',
                data: o['param'] || {},
                contentType: o['contentType'] || '',
                error: function (e) {
                    if (typeof callback !== 'undefined')
                        callback({ type: 'error' });
                },
                timeout: 30000,
                success: function (d) {
                    if (typeof callback !== 'undefined')
                        callback({ type: 'success', val: d });
                }
            });
        },
        getScript: function (o, callback) {
            $.getScript(o['uri'], function () {
                if (typeof callback !== 'undefined')
                    callback();
            });
        },
        cssClass: function (o, callback) {
            var _t = this, ID = $(o['ID']), k = o['delay'], type = o['type'], cls;
            if (_t.detectEl(ID)) {
                if (type == 'add') {
                    cls = o['cls'] || ['ready', 'animate'];
                    ID.addClass(cls[0]).delay(k).queue('fx', function () { $(this).dequeue().addClass(cls[1]); if (typeof callback !== 'undefined') callback(); });
                } else {
                    cls = o['cls'] || ['animate', 'ready'];
                    ID.removeClass(cls[0]).delay(k).queue('fx', function () { $(this).dequeue().removeClass(cls[1]); if (typeof callback !== 'undefined') callback(); });
                }
            }
        },
        pageScroll: function (o, callback) {
            var _t = this;
            $('html, body').stop().animate({ scrollTop: o['scrollTop'] || 0 }, o['speed'] || _t.speed, o['easing'] || 'easeInOutExpo', function () {
                if (typeof callback !== 'undefined')
                    callback();
            });
        },
        unVeil: function (o) {
            o = o || {};
            var _t = this,
                target = o['target'] || '.lazyload',
                ID = $(o['ID']).find(target),
                trigger = o['trigger'] || false;
            if (_t.detectEl(ID)) {
                ID.unveil();
                if (trigger)
                    ID.trigger('unveil');
            }
        },
        clearScriptTag: function (k) {
            k = k || '';
            var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
            while (SCRIPT_REGEX.test(k))
                k = k.replace(SCRIPT_REGEX, '');
            return k;
        },
        trimText: function (k) {
            k = k || '';
            return k.replace(/(^\s+|\s+$)/g, '');
        },
        cleanText: function (k) {
            k = k || '';
            return k.replace(/\s+/g, '');
        },
        diff: function (arr1, arr2) {
            var newArr = [];
            var arr = arr1.concat(arr2);

            for (var i in arr) {
                var f = arr[i];
                var t = 0;
                for (j = 0; j < arr.length; j++) {
                    if (arr[j] === f) {
                        t++;
                    }
                }
                if (t === 1)
                    newArr.push(f);

            }
            return newArr;
        },
        getCat: function () {
            return minusLoc.get('?', 'kat', urlString) || '';
        },
        visibleControl: function () {
            var _t = this,
                responsive = GET_CONFIG({ group: 'general', key: 'responsive' }) || '(max-width: 960px)',
                b = false;
            if (window.matchMedia(responsive).matches)
                b = true;

            return b;
        },
        convertHttps: function (k) {
            if (protocols == 'https:')
                k = k.replace(/http:/g, 'https:');
            return k;
        },
        priceFormat: function (ths, n, x) {
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
            return ths.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
        },
        getPrc: function (ID) {
            var _t = this, k = ID.eq(0).text();
            return parseFloat(k.replace(/\./, '').replace(/\,/, '.'))
        },
        setPrc: function (o) {
            var ID = o['ID'], target = o['target'], m = o['multiplier'] || 1;
            if (uty.detectEl(ID) && uty.detectEl(target)) {
                var k = (uty.getPrc(ID) * m).toFixed(2);
                k = k.toString().split('.');
                target.html((translation['price'] || '{{p}}<span class="d">,{{d}}</span><span class="pb1"> TL</span>').replace(/{{p}}/g, uty.priceFormat(Math.abs(parseFloat(k[0] || 0)))).replace(/{{d}}/g, k[1] || '00'))
            }
        },
        lowerCase: function (k) {

            var letters = { "İ": "i", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç", "I": "ı" },
                n = '';
            for (var i = 0; i < k.length; ++i) {
                var j = k[i];
                n += (letters[j] || j);
            }

            return n.toLowerCase() || '';
        },
        upperCase: function (k) {

            var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" },
                n = '';
            for (var i = 0; i < k.length; ++i) {
                var j = k[i];
                n += (letters[j] || j);
            }

            return n.toUpperCase() || '';
        },
        isLogin: function () {
            var _t = this;
            return _t.detectEl($('.ems-login'));
        },
        detectPosition: function (o) {
            o = o || {};
            var ID = $(o['ID'] || ''),
                rate = o['rate'] || 1,
                threshold = o['threshold'] || 0,

                _min = ht,
                o1 = { x: 0, y: wst, width: wt, height: (ht * rate) || _min },
                o2 = { x: 0, y: ID.offset().top - threshold, width: wt, height: (ID.height() * rate) || _min },
                b = false;
            if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y)
                b = true;

            /* 
                özel durumlarda elementi geçtikten sonra tetiklenmesi için
                örneğin ürün liste loadmore
            */
            if (o['elementNext']) {
                if (o1.y >= o2.y + o2.height)
                    b = true;
            }

            return b;
        },
        lazyLoad: function (o) {
            o = o || {};
            var ID = o['ID'],
                cls = 'image-loaded',
                customCls = ID.attr('data-cls') || '',
                src = ID.attr('data-background') || '';

            /* 
                amaç swiperın sadece desktopta veya mobilde çalıştığı durumların tersi durumlarda swiperı tetiklemek
            */
            if (ID.hasClass('lazy-swiper')) return false; // sadece swiper tetiklesin
            if (ID.hasClass('lazy-mobi-swiper') && !uty.visibleControl()) return false; // ya swiper tetiklesin ya da sadece desktopda tetiklensin
            if (ID.hasClass('lazy-desktop-swiper') && uty.visibleControl()) return false; // ya swiper tetiklesin ya da sadece mobilde tetiklensin

            if (ID.hasClass(cls)) return false;

            if (src != '')
                ID.css('background-image', 'url("' + src + '")');

            src = ID.attr('data-srcset') || '';
            if (src != '')
                ID.attr('srcset', src);

            src = ID.attr('data-image-src') || ID.attr('data-original') || '';
            if (src != '')
                ID.attr('src', src);

            if (ID.hasClass('lazy-picture'))
                ID.attr('media', '(max-width:0)').removeClass('lazy-picture');

            ID.addClass(cls).addClass(customCls);
        },
        lazyImage: function (o) {
            /* 
                data-image-src
                data-background
                lazy-picture
            */
            o = o || {};
            var _t = this,
                ID = o['ID'],
                img = ID.find('[data-image-src], [data-background], .lazy-picture, [data-srcset]');

            if (uty.detectEl(img))
                img
                    .each(function () {
                        _t.lazyLoad({ ID: $(this) });
                    });
        },
        Cookies: function (o) {
            var typ = o['typ'] || '', name = o['name'] || '';
            if (typ == 'set') {
                var date = new Date(), minutes = o['minutes'] || 5;
                date.setTime(date.getTime() + (minutes * 60 * 1000));
                $.cookie(name, o['value'] || '', { expires: date, path: '/' });
            } else if (typ == 'get')
                return $.cookie(name);
        },
        addSwiperClass: function (ID) {
            /* 
                swiper-container yolla diğer classları halletsin
            */
            ID
                .find('ul')
                .addClass('swiper-wrapper')
                .find('> li')
                .addClass('swiper-slide');
        },
        convertHtmlDropdown: function (o) {
            o = o || {};
            var ID = $(o['ID']),
                cls = o['cls'] || 'opened',
                wrpCls = o['wrpCls'] || '', // kapsayıcısına verilecek ekstra class
                hdrCls = o['hdrCls'] || '', // header verilecek ekstra class
                activeCls = o['activeCls'] || '.selected'; //hedef nesne içerisinde seçili olan element

            /* 
                add html
            */
            ID
                .addClass('dropdown ' + wrpCls)
                .prepend('<div class="dropdown-header ' + hdrCls + '"></div>');

            var active = ID.find(activeCls).html() || '';
            ID
                .find('.dropdown-header')
                .html(active);

            /* 
                add event
            */
            ID
                .find('.dropdown-header')
                .unbind('click')
                .bind('click', function () {
                    ID.toggleClass(cls);
                })
                .find('a')
                .unbind('click')
                .bind('click', function (evt) {
                    evt.preventDefault();
                });
        }
    },
    management = {

        urlSelected: {
            cls: 'selected',
            arr: GET_CONFIG({ group: 'management', key: 'urlSelected' }),
            init: function () {
                var _t = this,
                    arr = _t.arr,
                    loc = window.location.href || '';
                for (var i = 0; i < arr.length; ++i) {
                    var ID = $(arr[i]['elm']),
                        key = arr[i]['uri'] || '',
                        cls = arr[i]['cls'] || _t.cls || '';
                    if (loc.indexOf(key) != -1) {
                        if (uty.detectEl(ID)) {
                            ID.addClass(cls);
                            //break;
                        }
                    }
                }
            }
        },

        form: {
            regex: GET_CONFIG({ group: 'general', key: 'regex' }),
            arr: GET_CONFIG({ group: 'management', key: 'form' }),
            set: function (o) {
                var _t = this,
                    el = $(o['el']);
                if (uty.detectEl(el)) {
                    var msk = o['mask'] || '',
                        rgx = o['regex'] || '',
                        prop = o['prop'] || '',
                        attr = o['attr'] || '',
                        removeAttr = o['removeAttr'] || '',
                        addClss = o['addClass'] || '',
                        removeClss = o['removeClass'] || '';

                    if (prop != '')
                        $.each(prop, function (i, k) {
                            el.prop(i, k);
                        });

                    if (attr != '')
                        $.each(attr, function (i, k) {
                            el.attr(i, k);
                        });

                    if (removeAttr != '')
                        $.each(removeAttr, function (i, k) {
                            el.removeAttr(k);
                        });

                    if (msk != '')
                        el.mask(msk);

                    if (addClss != '')
                        el.addClass(addClss);

                    if (removeClss != '')
                        el.removeClass(removeClss);

                    if (rgx != '')
                        el
                            .attr('data-regex', rgx)
                            .unbind('keypress paste', _t.events.onKeyPress)
                            .bind('keypress paste', _t.events.onKeyPress);
                }

            },
            events: {
                onKeyPress: function (evt) {
                    var _t = management.form,
                        theEvent = evt || window.event,
                        key = theEvent.keyCode || theEvent.which,
                        ths = $(this),
                        rgx = ths.attr('data-regex') || '',
                        regex = _t.regex[rgx] || '';

                    if (regex != '' && regex.test(String.fromCharCode(key))) {
                        theEvent.returnValue = false;
                        if (theEvent.preventDefault)
                            theEvent.preventDefault();
                    }
                }
            },
            init: function (k) {
                var _t = this, arr = k || _t.arr;
                for (var i = 0; i < arr.length; ++i)
                    _t.set(arr[i]);
            }
        },
        multiLanguages: {
            el: {
                con: '.ems-multi-languages [data-target]'
            },
            set: function (ID) {
                var _t = this;
                var target = $(ID.attr('data-target') || ''),
                    type = ID.attr('data-type') || 'html';
                if (uty.detectEl(target)) {
                    var htm = ID.html() || '';
                    if (type == 'append')
                        target.append(htm);
                    else if (type == 'prepend')
                        target.prepend(htm);
                    else if (type == 'before')
                        target.before(htm);
                    else if (type == 'after')
                        target.after(htm);
                    else
                        target.html(htm);
                }
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (uty.detectEl(con))
                    con
                        .each(function () {
                            _t.set($(this));
                        });
            }
        },
        append: {
            arr: GET_CONFIG({ group: 'management', key: 'append' }),
            set: function (o) {
                var main = $(o['main'] || ''), target = $(o['target'] || ''), clone = o['clone'] || '', type = o['add'] || '', htm = o['htm'] || '';
                if (uty.detectEl(main) && uty.detectEl(target)) {
                    main = main.eq(0);
                    var e = clone != '' ? main.clone() : main;
                    if (htm != '') e = htm;
                    if (type == 'prepend') target.prepend(e);
                    else if (type == 'before') target.before(e);
                    else if (type == 'after') target.after(e);
                    else if (type == 'html') target.html(e.html() || '');
                    else if (type == 'insideAppend') target.append(e.html() || '');
                    else target.append(e);
                }
            },
            init: function (k) {
                var _t = this, arr = k || _t.arr;
                for (var i = 0; i < arr.length; ++i)
                    _t.set(arr[i]);
            }
        },
        init: function () {
            var _t = this;
            _t.urlSelected.init();
            _t.form.init();
            _t.append.init();
            _t.multiLanguages.init();
        }
    },
    plugin = {

        /*multipleProductImage: {
            el: {
                con: '.swiper-multiple-product-image'
            },
            cls: {
                active: 'activeted'
            },
            add: function (ID) {
                var _t = this,
                    swiper = ID.find('.swiper-container'),
                    elm = ID.find('.swiper-slide'),
                    lngth = elm.length,
                    r = (100 / lngth).toFixed(2),
                    htm = elm
                        .map(function (order) {
                            return '<span style="width: ' + r + '%" data-order="' + order + '"></span>';
                        })
                        .get()
                        .join('');

                ID.prepend('<div class="hover-button">' + htm + '</div>');

                ID
                    .find('.hover-button > span')
                    .unbind('mouseenter')
                    .bind('mouseenter', function () {
                        var ths = $(this),
                            order = ths.attr('data-order') || 0;

                        if (uty.detectEl(swiper))
                            swiper.get(0).focused(order);
                    });

                ID
                    .find('.hover-button')
                    .unbind('mouseleave')
                    .bind('mouseleave', function () {

                        if (uty.detectEl(swiper))
                            swiper.get(0).focused(0);
                    });
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (!isMobile && uty.detectEl(con)) {
                    con
                        .each(function () {
                            var ths = $(this);
                            if (!ths.hasClass(_t.cls['active'])) {
                                ths.addClass(_t.cls['active']);
                                _t.add(ths);
                            }
                        });
                }
            },
        },*/

        multipleProductImage: {
            el: {
                con: '.swiper-multiple-product-image'
            },
            cls: {
                active: 'activeted'
            },
            add: function (ID) {
                var _t = this,
                    temp = 0,
                    swiper = ID.find('.swiper-container'),
                    length = ID.find('.swiper-slide').length;

                ID
                    .unbind('mousemove mouseleave')
                    .bind('mousemove', function (evt) {
                        var ths = $(this),
                            width = ths.width(),
                            offsetX = Math.abs(Math.round(evt.pageX - ths.offset().left)),
                            n = Math.floor(offsetX / Math.round(width / length));

                        if (n <= 0) n = 0;
                        if (n >= length) n = length - 1;

                        if (uty.detectEl(swiper) && temp != n)
                            swiper.get(0).focused(n);

                        temp = n;
                    })
                    .bind('mouseleave', function (evt) {
                        var ths = $(this),
                            swiper = ths.find('.swiper-container');

                        if (uty.detectEl(swiper))
                            swiper.get(0).focused(0);

                        temp = 0;
                    });
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (!isMobile && uty.detectEl(con)) {
                    con
                        .each(function () {
                            var ths = $(this);
                            if (!ths.hasClass(_t.cls['active'])) {
                                ths.addClass(_t.cls['active']);
                                _t.add(ths);
                            }
                        });
                }
            },
        },

        countdown: {
            el: {
                con: '[data-countdown]'
            },
            cls: {
                active: 'activeted'
            },
            initPlugins: function (o) {
                o = o || {};
                var _t = this,
                    ID = o['ID'],
                    time = o['time'],
                    update = function () {
                        var k = ID.parents('[data-swiper]');
                        if (uty.detectEl(k)) {
                            k = k.get(0);
                            if (typeof k.update !== 'undefined')
                                k.update();
                        }

                    };

                ID
                    .countdown({
                        padZeroes: true,
                        until: time,
                        alwaysExpire: true,
                        onExpiry: function () {
                            ID.parents('[data-countdown]').addClass('end-countdown');
                            update();
                        },
                        onTick: function () {
                            ID.parents('[data-countdown]').addClass('start-countdown');
                        }
                    });
            },
            control: function () {
                setTimeout(function () {
                    var el = $('.countdown-container');
                    if (uty.detectEl(el))
                        el
                            .each(function () {
                                var ths = $(this),
                                    c = ths.find('[data-countdown]'),
                                    k = ths.find('.end-countdown[data-countdown]');
                                if (c.length == k.length)
                                    ths.addClass('ems-none');
                            });
                }, 1000);
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (uty.detectEl(con))
                    con
                        .each(function () {
                            var ths = $(this),
                                c = (ths.attr('data-countdown') || '').trim(),
                                d = new Date(c),
                                cd = ths.find('.countdown');
                            if (uty.detectEl(cd) && c != '' && !ths.hasClass(_t.cls['active'])) {
                                ths.addClass(_t.cls['active']);
                                _t.initPlugins({ ID: cd, time: d });
                            }
                        });

                _t.control();
            }
        },

        toggleButton: {
            el: {
                btn: '.toggleButton'
            },
            cls: {
                ready: 'ems-ready',
                animate: 'ems-animate'
            },
            addEvent: function () {
                var _t = this,
                    ID = $(_t.el.btn),
                    animateCss = function (o) {
                        var target = o['target'],
                            ready = o['ready'],
                            animate = o['animate'],
                            type = o['type'];

                        if (type == 'add')
                            uty.cssClass({ 'ID': target, 'delay': 100, 'type': 'add', 'cls': [ready, animate] });
                        else
                            uty.cssClass({ 'ID': target, 'delay': 444, 'type': 'remove', 'cls': [animate, ready] });

                        stage.dispatchEvent("CustomEvent", "TOGGLE_BUTTON_CLICKED", { type: type, clickedItem: o['clickedItem'] || '' });
                    };

                ID
                    .unbind('click')
                    .bind('click', function () {
                        var ths = $(this),
                            target = $(ths.attr('data-target-mns') || '');
                        if (uty.detectEl(ID)) {
                            var ready = ths.attr('data-ready') || _t.cls['ready'],
                                animate = ths.attr('data-animate') || _t.cls['animate'],
                                type = ths.attr('data-type') || 'add'; // add, remove, toggle

                            if (type == 'toggle')
                                animateCss({ target: target, ready: ready, animate: animate, type: target.hasClass(ready) ? 'remove' : 'add', clickedItem: ths });
                            else
                                animateCss({ target: target, ready: ready, animate: animate, type: type, clickedItem: ths });
                        }
                    });


            },
            init: function () {
                var _t = this;
                if ($(_t.el.btn))
                    _t.addEvent();
            }
        },

        animate: {
            def: GET_CONFIG({ group: 'plugin', key: 'animate' }) || {},
            el: {
                target: '.ems-animated:not(".animated")'
            },
            cls: {
                animated: 'animated',
            },
            set: function (o) {
                o = o || {};
                var _t = this,
                    ID = $(o['ID'] || '');

                if (uty.detectPosition({ ID: ID, threshold: ID.attr('data-threshold') || _t.def['threshold'] || 0, elementNext: true }))
                    setTimeout(function () {
                        ID.addClass(_t.cls['animated'] + ' ' + (ID.attr('data-cls') || _t.def['animCls'] || 'slideInUp'));
                    }, ID.attr('data-delay') || _t.def['delay'] || 0);
            },
            adjust: function () {
                var _t = this,
                    target = $(_t.el.target);

                if (uty.detectEl(target))
                    target
                        .each(function () {
                            _t.set({ ID: $(this) });
                        });
            }
        },

        /* 
            zoom gallery
        */
        zoomGallery: {
            arr: GET_CONFIG({ group: 'plugin', key: 'zoomGallery' }),
            cls: { active: 'ems-zoomgallery-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusZoomGallery(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                _t.set(_t.arr);
            }
        },

        /* 
            social Share
        */
        socialShare: {
            arr: GET_CONFIG({ group: 'plugin', key: 'socialShare' }),
            cls: { active: 'ems-socialshare-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusSocialShare(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                _t.set(_t.arr);
            }
        },

        /* 
            load more button
        */
        loadMoreButton: {
            arr: GET_CONFIG({ group: 'plugin', key: 'loadMoreButton' }),
            cls: { active: 'ems-loadmorebutton-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusLoadMoreButton(o['prop'] || {});
                    }
                }
            },
            adjust: function () {
                var _t = this, el = $(_t.arr.ID)
                if (uty.detectEl(el))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.adjust !== 'undefined')
                                ths.adjust();
                        }
                    });
            },
            init: function () {
                var _t = this;
                _t.set(_t.arr);
            }
        },

        /* 
            counter
        */
        counter: {
            arr: GET_CONFIG({ group: 'plugin', key: 'counter' }),
            cls: { active: 'ems-counter-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusCounter(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                _t.set(_t.arr);
            }
        },

        /* 
            Minus HTML5 Video
        */
        html5Video: {
            el: {
                con: 'video'
            },
            cls: { active: 'ems-video-active' },
            set: function (ID) {
                var _t = this;
                if (!ID.hasClass(_t['cls']['active'])) {
                    ID.addClass(_t['cls']['active']);
                    ID.minusHTML5Video();
                }
            },
            adjust: function () {
                var _t = this, el = $(_t.el.con)
                if (uty.detectEl(el))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.adjust !== 'undefined')
                                ths.adjust();
                        }
                    });
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);

                if (uty.detectEl(con))
                    con
                        .each(function () {
                            _t.set($(this));
                        });
            }
        },

        /* 
            Minus Lazy Load
        */
        lazyLoad: {
            el: {
                not: '.not-trigger[data-swiper]',
                con: '[data-background]:visible:not(".image-loaded"):not(".lazy-swiper"), [data-image-src]:visible:not(".image-loaded"):not(".lazy-swiper"), [data-srcset]:visible:not(".image-loaded"):not(".lazy-swiper"), .lazy-picture:visible:not(".image-loaded"):not(".lazy-swiper")',
                lazy: '.lazy-minus'
            },
            cls: {
                active: 'ems-lazy-load-active',
                lazy: 'lazy-minus'
            },
            set: function (ID) {
                var _t = this;
                if (!ID.hasClass(_t['cls']['active'])) {
                    ID.addClass(_t['cls']['active']);
                    ID.minusLazyLoad();
                }
            },
            adjust: function () {
                var _t = this,
                    el = $(_t.el.lazy);
                if (uty.detectEl(el))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.adjust !== 'undefined')
                                ths.adjust();
                        }
                    });
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con),
                    not = $(_t.el.not);

                if (uty.detectEl(con))
                    con
                        .addClass(_t.cls['lazy'])
                        .each(function () {
                            _t.set($(this));
                        });


                /* 
                    swiper tetiklenmediği durumlarda içerisindeki resimlerde lazyload tetiklemek
                */
                if (uty.detectEl(not)) {
                    not
                        .find('.lazy-swiper')
                        .removeClass('lazy-swiper');

                    not
                        .find(_t.el.con)
                        .each(function () {
                            _t.set($(this));
                        });
                }
            }
        },

        /* 
            kategori filtre
        */
        categoryFilter: {
            arr: GET_CONFIG({ group: 'plugin', key: 'categoryFilter' }),
            cls: { active: 'ems-category-filter-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.MinusCategoryFilter(o['prop'] || {});
                    }
                }
            },
            setURI: function (o) {
                var _t = this, el = $(_t.arr['ID'])
                if (uty.detectEl(el))

                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.setURI !== 'undefined')
                                ths.setURI(o);
                        }
                    });
            },
            init: function () {
                var _t = this;
                _t.set(_t.arr);
            }
        },

        /* 
            list sorts
        */
        listSort: {
            arr: GET_CONFIG({ group: 'plugin', key: 'listSort' }),
            cls: { active: 'ems-list-sort-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusListSort(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                for (var i = 0; i < _t.arr.length; ++i)
                    _t.set(_t.arr[i]);
            }
        },


        /* 
            liste görünüm
        */
        viewer: {
            arr: GET_CONFIG({ group: 'plugin', key: 'viewer' }),
            cls: { active: 'ems-list-viewer-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusViewer(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                _t.set(_t.arr);
            }
        },

        /* 
            kategori swiper
        */
        catSwiper: {
            arr: GET_CONFIG({ group: 'plugin', key: 'catSwiper' }),
            cls: { active: 'ems-cat-swiper-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.MinusCategorySwiper(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                for (var i = 0; i < _t.arr.length; ++i)
                    _t.set(_t.arr[i]);
            }
        },

        /* 
            popular worlds
        */
        popularWorlds: {
            arr: GET_CONFIG({ group: 'plugin', key: 'popularWorlds' }),
            cls: { active: 'ems-popular-worlds-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusSearchPopularWorlds(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                for (var i = 0; i < _t.arr.length; ++i)
                    _t.set(_t.arr[i]);
            }
        },

        /* 
            customSearch
        */
        customSearch: {
            arr: GET_CONFIG({ group: 'plugin', key: 'customSearch' }),
            cls: { active: 'ems-custom-search-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusCustomSearch(o['prop'] || {});
                    }
                }
            },
            searchReady: function () {
                var _t = this, el = $(_t.arr['ID'])
                if (uty.detectEl(el))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.searchReady !== 'undefined')
                                ths.searchReady();
                        }
                    });
            },
            searchComplete: function () {
                var _t = this, el = $(_t.arr['ID'])
                if (uty.detectEl(el))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.searchComplete !== 'undefined')
                                ths.searchComplete();
                        }
                    });
            },
            init: function () {
                var _t = this;
                _t.set(_t.arr);
            }
        },

        /* 
            dropDown
        */
        dropDown: {
            arr: GET_CONFIG({ group: 'plugin', key: 'dropDown' }),
            cls: { active: 'ems-dropdown-active' },
            set: function (o) {
                var _t = this, ID = $(o['ID']);
                if (uty.detectEl(ID)) {
                    if (!ID.hasClass(_t['cls']['active'])) {
                        ID.addClass(_t['cls']['active']);
                        ID.minusDropDown(o['prop'] || {});
                    }
                }
            },
            init: function () {
                var _t = this;
                for (var i = 0; i < _t.arr.length; ++i)
                    _t.set(_t.arr[i]);
            }
        },

        /* 
            main menu
        */
        menu: {
            arr: GET_CONFIG({ group: 'plugin', key: 'menu' }),
            cls: { active: 'ems-menu-active' },
            set: function (o) {
                var _t = this,
                    ID = $(o['ID'] || ''),
                    custom = o['custom'] || '';
                if (uty.detectEl(ID) && !ID.hasClass(_t['cls']['active'])) {
                    ID.addClass(_t['cls']['active']);
                    ID.minusMenu(o['prop'] || {});
                    if (custom != '')
                        setTimeout(function () {
                            if (!uty.visibleControl()) {
                                ID
                                    .find(custom['elm'] || '')
                                    .each(function () {
                                        $(this)
                                            .find(custom['target'] || '')
                                            .addClass(custom['class'] || '');
                                    });

                                ID
                                    .find(custom['unbind'] || '')
                                    .unbind('mouseleave')
                            }
                        }, 100);
                }
            },
            init: function () {
                var _t = this;
                for (var i = 0; i < _t.arr.length; ++i)
                    _t.set(_t.arr[i]);
            }
        },

        /* 
            System widget
        */
        systemWidget: {
            el: {
                con: '.system-widget[data-uri]',
            },
            cls: { active: 'ems-system-widget-active' },
            set: function (ID) {
                var _t = this;
                if (!ID.hasClass(_t['cls']['active'])) {
                    ID.addClass(_t['cls']['active']);
                    ID.minusSystemWidget();
                }
            },
            adjust: function () {
                var _t = this, el = $(_t.el.con)
                if (uty.detectEl(el))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.adjust !== 'undefined')
                                ths.adjust();
                        }
                    });
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (uty.detectEl(con))
                    con
                        .each(function () {
                            _t.set($(this));
                        });
            }
        },

        /* 
            tab menu
        */
        tabMenu: {
            el: {
                con: '.ems-tab:not(".not-trigger")',
            },
            cls: { active: 'ems-tabmenu-active' },
            set: function (ID) {
                var _t = this;
                if (!ID.hasClass(_t['cls']['active'])) {
                    ID.addClass(_t['cls']['active']);
                    ID.minusTab();
                }
            },
            adjust: function () {
                var _t = this, el = $(_t.el.con)
                if (uty.detectEl(el))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            if (typeof ths.adjust !== 'undefined')
                                ths.adjust();
                        }
                    });
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (uty.detectEl(con))
                    con
                        .each(function () {
                            _t.set($(this));
                        });
            }
        },
        /* 
            swiper
        */
        swiper: {
            el: {
                con: '[data-swiper]:not(".not-trigger")',
                target: '.swiper-wrapper > .swiper-slide',
                mobiSwiper: '.mobi-swiper[data-swiper]', // mobilde swiper, desktopda liste şeklinde
                desktopSwiper: '.desktop-swiper[data-swiper]' // desktopda swiper, mobilde liste şeklinde
            },
            cls: {
                active: 'ems-swiper-active',
                mobiSwiper: 'mobi-swiper',
                desktopSwiper: 'desktop-swiper',
                noSwiper: 'not-swiper'
            },
            set: function (ID) {
                var _t = this;

                /* 
                    thumb gallery tipi için swiper burdan tetiklenmemeli
                */
                if (uty.detectEl(ID.parents('.swiper-thumbs-gallery-container')))
                    return false;

                if (!ID.hasClass(_t['cls']['active']) && !ID.hasClass(_t['cls']['noSwiper']) && uty.detectEl(ID.find(_t.el.target)) && (!ID.hasClass(_t.cls['mobiSwiper']) || (uty.visibleControl() && ID.hasClass(_t.cls['mobiSwiper'])))) {
                    var config = GET_CONFIG({ group: 'plugin', key: 'swiper' }) || {};
                    ID.addClass(_t['cls']['active']);
                    ID.minusSwiper(config['defaultOpt'] || {});
                }
            },
            adjust: function () {
                var _t = this, el = $(_t.el.con)
                if (uty.detectEl(el) && uty.detectEl(el.find(_t.el.target)))
                    el.each(function () {
                        var ths = $(this);
                        if (ths.hasClass(_t.cls['active'])) {
                            ths = ths.get(0);
                            /*if (typeof ths.adjust !== 'undefined')
                                ths.adjust();*/
                        }
                    });
            },
            destroy: function (ID) {
                var _t = this;
                if (uty.detectEl(ID)) {
                    ID.removeClass(_t.cls['active']);
                    ID = ID.get(0);
                    if (typeof ID.destroy !== 'undefined')
                        ID.destroy();
                }
            },
            control: function (o) {
                var _t = this,
                    typ = o['type'] || '',
                    mobiSwiper = $(_t.el.mobiSwiper),
                    desktopSwiper = $(_t.el.desktopSwiper);

                if (uty.detectEl(mobiSwiper))
                    mobiSwiper
                        .each(function () {
                            var ths = $(this);
                            if (typ == 'mobi')
                                _t.set(ths);
                            else
                                _t.destroy(ths);
                        });

                if (uty.detectEl(desktopSwiper))
                    desktopSwiper
                        .each(function () {
                            var ths = $(this);
                            if (typ == 'desktop')
                                _t.set(ths);
                            else
                                _t.destroy(ths);
                        });
            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (uty.detectEl(con))
                    con
                        .each(function () {
                            _t.set($(this));
                        });
            }
        },
        thumbsGallery: {
            el: {
                con: '.swiper-thumbs-gallery-container'
            },
            cls: {
                active: 'ems-swiper-thumb-gallery-active',
            },
            set: function (o) {
                var _t = this,
                    ID = o['ID'],
                    galleryTop = ID.find('.swiper-container-gallery'),
                    galleryThumbs = ID.find('.swiper-container-thumbs'),
                    dataHover = galleryThumbs.attr('data-hover') || 'true';

                if (ID.hasClass(_t.cls['active']))
                    return false;

                if (uty.detectEl(galleryTop) && uty.detectEl(galleryThumbs)) {

                    ID.addClass(_t.cls['active']);

                    var stm = null,
                        clearStm = function () {
                            if (stm != null)
                                clearTimeout(stm);
                        };

                    galleryThumbs.minusSwiper();

                    galleryThumbs
                        .find('[data-order]')
                        .unbind('click')
                        .bind('click', function () {
                            var ths = $(this),
                                order = ths.attr('data-order') || 0;

                            galleryTop.get(0).focused(order);
                        });

                    if (!isMobile && dataHover == 'true')
                        galleryThumbs
                            .find('[data-order]')
                            .unbind('mouseenter mouseleave')
                            .bind('mouseenter', function () {
                                var ths = $(this);
                                clearStm();
                                stm = setTimeout(function () {
                                    var order = ths.attr('data-order') || 0;
                                    galleryTop.get(0).focused(order);
                                }, 222);
                            })
                            .bind('mouseleave', function () {
                                clearStm();
                            });


                    galleryTop.minusSwiper({}, function (o) {
                        var type = o['type'] || '';
                        if (type == 'slideChangeTransitionEnd') {
                            var current = o['current'] || {},
                                activeIndex = current['activeIndex'] || 0;

                            galleryThumbs.get(0).focused(activeIndex - 1);
                            galleryThumbs.find('[data-order="' + activeIndex + '"]').addClass('selected').siblings().removeClass('selected');
                        } else if (type == 'init') {
                            galleryThumbs.find('[data-order="0"]').addClass('selected').siblings().removeClass('selected');
                        }
                    });
                }

            },
            init: function () {
                var _t = this,
                    con = $(_t.el.con);
                if (uty.detectEl(con))
                    con
                        .each(function () {
                            _t.set({ ID: $(this) });
                        });
            }
        },
        /* 
            styler
        */
        styler: {
            arr: GET_CONFIG({ group: 'plugin', key: 'styler' }),
            cls: { active: 'ems-styler-active' },
            set: function (o) {
                var _t = this,
                    ID = $(o['ID']),
                    prop = o['prop'] || {};
                ID.each(function () {
                    var ths = $(this);
                    if (uty.detectEl(ths) && !ths.hasClass(_t.cls['active']))
                        ths
                            .addClass(_t.cls['active'])
                            .iStyler(prop);
                })

            },
            init: function () {
                var _t = this, arr = _t.arr;
                for (var i = 0; i < arr.length; ++i)
                    _t.set(arr[i]);
            }
        },
        adjust: function () {
            var _t = this;
            _t.animate.adjust();
            _t.swiper.adjust();
            _t.html5Video.adjust();
            _t.lazyLoad.adjust();
            _t.loadMoreButton.adjust();
        },
        onScroll: function () {
            var _t = this;
            _t.animate.adjust();
            _t.html5Video.adjust();
            _t.lazyLoad.adjust();
            _t.systemWidget.adjust();
            _t.tabMenu.adjust();
            _t.loadMoreButton.adjust();
        },
        init: function () {
            var _t = this;
            _t.multipleProductImage.init();
            _t.countdown.init();
            _t.toggleButton.init();
            _t.html5Video.init();
            _t.zoomGallery.init();
            _t.socialShare.init();
            _t.loadMoreButton.init();
            _t.counter.init();
            _t.lazyLoad.init();
            _t.categoryFilter.init();
            _t.listSort.init();
            _t.viewer.init();
            _t.catSwiper.init();
            _t.popularWorlds.init();
            _t.customSearch.init();
            _t.dropDown.init();
            _t.menu.init();
            _t.systemWidget.init();
            _t.tabMenu.init();
            _t.swiper.init();
            _t.thumbsGallery.init();
            //_t.styler.init();
        }
    },
    modules = {
        adjust: function () {
            var _t = this;
        },
        init: function () {
            var _t = this;
        }
    },
    resetDom = {
        k: true,
        adjust: function () {
            var _t = this;
            if (!_t.k && uty.visibleControl()) {
                // mobi
                _t.k = true;
                plugin.swiper.control({ type: 'mobi' });
                stage.dispatchEvent("CustomEvent", "RESET_DOM_CONTENT", { type: 'mobi' });

            } else if (_t.k && !uty.visibleControl()) {
                // pc
                _t.k = false;
                plugin.swiper.control({ type: 'desktop' });
                stage.dispatchEvent("CustomEvent", "RESET_DOM_CONTENT", { type: 'pc' });
            }
        },
        init: function () {
            var _t = this;
            if (uty.visibleControl())
                _t.k = false;
        }
    },
    events = {
        loaded: function () {

        },

        ready: function () {

        },

        bdyClicked: function () {
            $('body, html').bind('click touchstart', function (e) {
                var m = $('.mobi-dropdown, .dropdown');
                if (!m.is(e.target) && m.has(e.target).length === 0)
                    m.removeClass('opened');
            });
        },

        onResize: function () {
            wt = parseFloat(win.width());
            ht = parseFloat(win.height());

            plugin.adjust();
            resetDom.adjust();
            stage.dispatchEvent("CustomEvent", "EVENTS_ON_RESIZE");
        },

        onResizeStop: function () {
            stage.dispatchEvent("CustomEvent", "EVENTS_ON_RESIZE_STOP");
        },

        onScroll: function () {
            wst = parseFloat(win.scrollTop());
            sRatio = wst / (doc.height() - ht);


            plugin.onScroll();
            stage.dispatchEvent("CustomEvent", "EVENTS_ON_SCROLL");
        },

        onScrollStop: function () {
            stage.dispatchEvent("CustomEvent", "EVENTS_ON_SCROLL_STOP");
        },
        init: function () {
            var _t = this;
            _t.bdyClicked();
            doc.ready(_t.ready);
            win.resize(_t.onResize).resize();
            win.bind('resizestop', _t.onResizeStop);
            win.bind('scrollstop', _t.onScrollStop);
            win.scroll(_t.onScroll).scroll();
        }
    },
    initialize = function () {
        management.init();
        plugin.init();
        resetDom.init();
        events.init();
    };

initialize();


//////////////////////////////// özel caseler buraya yazılsın

/* 
    kredi kart
*/
var crediCart = {
    el: {
        wrp: '.ems-card-wrapper',
        container: '.card-wrapper',
        target: '.page-order-payment',
        card: '.jp-card-container .jp-card',

        inputName: '[id$="credit-cart-name"]',
        inputCVC: '[id$="credit-cart-cvc"]',
        inputNumber: '[id$="credit-cart-number"]',
        inputExpiry: '.credit-cart-date',

        targetInputName: '[id="card-name"]',
        targetInputCVC: '[id="card-cvc"]',
        targetInputNumber: '[id="card-number"]',
        targetInputExpiry: '[id="card-expiry"]'
    },
    cls: {
        flipped: 'jp-card-flipped'
    },
    template: '<div class="ems-card-wrapper"><div class="card-wrapper"></div><div class="d-none"><input type="text" name="number" id="card-number"><input type="text" name="first-name" id="card-name"/><input type="text" name="expiry" id="card-expiry"/><input type="text" name="cvc" id="card-cvc"/></div></div>',
    set: function (o) {
        var _t = this,
            ID = o['ID'],
            target = o['target'],
            evt = document.createEvent('HTMLEvents');
        evt.initEvent('keyup', false, true);

        setTimeout(function () {
            target
                .val(o['val'] || ID.val() || '')
                .get(0).dispatchEvent(evt);
        }, 1);
    },
    addEvent: function () {
        var _t = this;

        $(_t.el.inputName)
            .bind('keyup', function () {
                _t.set({
                    ID: $(this),
                    target: $(_t.el.targetInputName)
                });
            });

        $(_t.el.inputCVC)
            .bind('keyup', function () {
                _t.set({
                    ID: $(this),
                    target: $(_t.el.targetInputCVC)
                });
            })
            .bind('focus', function () {
                $(_t.el.card).addClass(_t.cls['flipped']);
            })
            .bind('blur', function () {
                $(_t.el.card).removeClass(_t.cls['flipped']);
            });

        $(_t.el.inputNumber)
            .bind('keyup', function () {
                _t.set({
                    ID: $(this),
                    target: $(_t.el.targetInputNumber)
                });
            });

        $(_t.el.inputExpiry)
            .bind('change', function () {
                _t.set({
                    val: $(_t.el.inputExpiry).val(),
                    target: $(_t.el.targetInputExpiry)
                });
            })
            .change();
    },
    initPlugins: function () {
        var _t = this;
        $.getScript('/js/libs/card.js', function () {
            $(_t.el.wrp).card({
                container: _t.el.container,
                formSelectors: {
                    numberInput: _t.el.targetInputNumber,
                    expiryInput: _t.el.targetInputExpiry,
                    cvcInput: _t.el.targetInputCVC,
                    nameInput: _t.el.targetInputName
                },
                placeholders: {
                    name: 'ADINIZ SOYADINIZ'
                }
            });
            _t.addEvent();
        });
    },
    add: function () {
        var _t = this;
        $('.credit-cart-container').append(_t.template);
    },
    init: function () {
        var _t = this;
        if (uty.detectEl($(_t.el.target)) && uty.detectEl($(_t.el.inputName))) {
            _t.add();
            _t.initPlugins();
        }
    }
};

crediCart.init();

(function () {

    /* 
        page top button
    */
    var elm = $('.btn-page-top');
    if (uty.detectEl(elm))
        elm
            .unbind('click')
            .bind('click', function () {
                uty.pageScroll({ scrollTop: 0 });
            });

    /* 
        bootstrap tooltip trigger
    */
    elm = $('[data-toggle="tooltip"]');
    if (uty.detectEl(elm))
        elm.tooltip();


    /* 
        ürün liste desktop filtre açık gelsin
    */
    elm = $('[aria-expanded-lg="true"]');
    if (uty.detectEl(elm) && !uty.visibleControl())
        elm.click();

    /*
        sol menü açıkken header tıklanıldığında overlay kapansın
    */
    elm = $('.site-header');
    if (uty.detectEl(elm))
        elm.click(function() {
            $( ".dropdown-overlay" ).click();
        });

    /*elm = $('#filter-letters a');
    if (uty.detectEl(elm))
        elm
            .bind('click', function (evt) {
                evt.preventDefault();
                var ths = $(this),
                    hrf = ths.attr('href') || '',
                    ids = $('.letters ' + hrf);

                if (uty.detectEl(ids)) {
                    uty.pageScroll({ scrollTop: ids.offset().top - (uty.visibleControl() ? 52 : 170) });
                    window.location.hash = hrf;
                }
            });*/

    /* 
        belirtilen nesneye kayar
    */  
    elm = $('[data-targetscroll]');    
    if (uty.detectEl(elm))
        elm
        .unbind('click')    
        .bind('click', function (evt) {
            evt.preventDefault();
            var ths = $( this ),
                target = $( ths.attr('data-targetscroll') || '' ),
                offset = ths.attr('data-offset') || 20;
            if( uty.detectEl(target) ){
                target = target.eq(0);
                uty.pageScroll({ scrollTop: target.offset().top - ( uty.visibleControl() ? 70 : 169 ) - offset });
            }
                
        });    
}());

/* 
    ana menu mobile, desktop ayrımı. mobile da bootstrap, desktopda bizim menu çalışsın
*/

function mainMenuState(k) {
    var elm = $('#lvl1Grp').find('[data-toggle]');
    if (uty.detectEl(elm)) {
        if (k == 'mobi')
            elm.attr('data-toggle', 'collapse');
        else
            elm.attr('data-toggle', 'passive');
    }
}
mainMenuState(uty.visibleControl() ? 'mobi' : 'desktop');

/* 
    markalar sayfası
*/

function brandMenuState(k) {
    var elm = $('.page-brand-list .letter-group'),
        targetDesktop = $('.page-brand-list .sticky-lg-top'),
        targetMobi = $('.page-brand-list .letters');

    if (uty.detectEl(elm) && uty.detectEl(targetDesktop) && uty.detectEl(targetMobi)) {
        if (k == 'mobi')
            targetMobi.prepend(elm);
        else
            targetDesktop.prepend(elm);
    }
}
brandMenuState(uty.visibleControl() ? 'mobi' : 'desktop');

/* 

*/

function zoomGallerySetThumbConfig(k) {
    var elm = $('.product-details .prdd-gallery');
    if (uty.detectEl(elm)) {
        elm = elm.get(0);
        if (typeof elm.setThumbConfig !== 'undefined')
            elm.setThumbConfig(k);
    }
}


/* 
    MOBILE, DESKTOP AYRIMI
*/
function ONRESET_DOM_CONTENT(o) {
    var type = o['type'] || '';
    mainMenuState(type);
    brandMenuState(type);
    zoomGallerySetThumbConfig(type);
}
stage.addEventListener("CustomEvent", [{ type: "RESET_DOM_CONTENT", handler: "ONRESET_DOM_CONTENT" }]);

/* 
    Toggle Button Clicked
*/
function ONTOGGLE_BUTTON_CLICKED(o) {
    var type = o['type'] || '',
        clickedItem = $(o['clickedItem'] || '');

    if (type == 'add' && clickedItem.hasClass('trigger-menu'))
        uty.lazyImage({ ID: $('#lvl1Grp') });

}
stage.addEventListener("CustomEvent", [{ type: "TOGGLE_BUTTON_CLICKED", handler: "ONTOGGLE_BUTTON_CLICKED" }]);


function ONVIEW_TYPE_CLICKED(o) {
    var type = o['type'] || '';
    if (type == 'clicked') {
        var elm = $('.swiper-multiple-product-image .swiper-container');
        if (uty.detectEl(elm))
            elm
                .each(function () {
                    $(this).get(0).update();
                });
    }
}
stage.addEventListener("CustomEvent", [{ type: "VIEW_TYPE_CLICKED", handler: "ONVIEW_TYPE_CLICKED" }]);

/* 

*/

function ONCUSTOM_SEARCH_STATE(o) {
    var type = o['type'] || '';
    if (type == 'show') {
        if (bdy.hasClass('header-menu-ready'))
            uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls': ['header-menu-animate', 'header-menu-ready'] });
    }
}
stage.addEventListener("CustomEvent", [{ type: "CUSTOM_SEARCH_STATE", handler: "ONCUSTOM_SEARCH_STATE" }]);


var customProgressBar = {
    el: {
        con: '.custom-progress-card'
    },
    initPlugins: function( ID ){
        
        var duration = ID.attr('data-duration') || 30000,
            bar = new ProgressBar.Circle(ID.get(0), {
            color: '#000',
            strokeWidth: 3,
            trailWidth: 3,
            //easing: 'easeInOut',
            duration: duration,
            text: {
                autoStyleContainer: false
            },
            from: { 
                color: '#ddd', 
                width: 3 
            },
            to: { 
                color: '#ec6e00',
                width: 3 
            },
            step: function (state, circle) {
                circle.path.setAttribute('stroke', '#ec6e00');
                circle.path.setAttribute('stroke-width', state.width);

                var value = Math.round((duration - (circle.value() * duration)) / 1000);
                if (value === 0) {
                    circle.setText('');
                } else {
                    circle.setText(value);
                }
            }
        });

        bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        bar.text.style.fontSize = '2rem';


        bar.animate(1);
    },
    init: function(){
        var _t = this,
        con = $( _t.el.con);

        if( uty.detectEl( con ) )
            con
            .each(function(){
                _t.initPlugins( $( this ) );
            });
    } 
};


customProgressBar.init();

// LISTENER
/* 
    load more listener
*/
function onLoadMoreLoaded() {
    plugin.swiper.init();
    plugin.multipleProductImage.init()
}
stage.addEventListener("CustomEvent", [{ type: "ON_LOAD_MORE_LOADED", handler: "onLoadMoreLoaded" }]);