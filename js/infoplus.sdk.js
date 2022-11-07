(function (window, undefined) {

    var packageName = 'InfoPlusSDK',
        DEBUG = false,
        SUB_DELAY = 5 * 1000,
        TIME_OUT = 17 * 60;

    if (window[packageName] !== undefined) {
        return;
    }


    var addEvent = function (html_element, event_name, event_function) {
        if (html_element.addEventListener) { // Modern
            html_element.addEventListener(event_name, event_function, false);
        } else if (html_element.attachEvent) { // Internet Explorer
            html_element.attachEvent("on" + event_name, event_function);
        } else { // others
            html_element["on" + event_name] = event_function;
        }
    };


    //json2 by douglascrockford
    //https://github.com/douglascrockford/JSON-js
    if (typeof JSON !== "object") {
        JSON = {};
    }

    (function () {
        "use strict";

        var rx_one = /^[\],:{}\s]*$/;
        var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
        var rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10
                ? "0" + n
                : n;
        }

        function this_value() {
            return this.valueOf();
        }

        if (typeof Date.prototype.toJSON !== "function") {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf())
                    ? this.getUTCFullYear() + "-" +
                    f(this.getUTCMonth() + 1) + "-" +
                    f(this.getUTCDate()) + "T" +
                    f(this.getUTCHours()) + ":" +
                    f(this.getUTCMinutes()) + ":" +
                    f(this.getUTCSeconds()) + "Z"
                    : null;
            };

            Boolean.prototype.toJSON = this_value;
            Number.prototype.toJSON = this_value;
            String.prototype.toJSON = this_value;
        }

        var gap;
        var indent;
        var meta;
        var rep;


        function quote(string) {

            rx_escapable.lastIndex = 0;
            return rx_escapable.test(string)
                ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
                : "\"" + string + "\"";
        }


        function str(key, holder) {

            var i;          // The loop counter.
            var k;          // The member key.
            var v;          // The member value.
            var length;
            var mind = gap;
            var partial;
            var value = holder[key];

            if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
                value = value.toJSON(key);
            }

            if (typeof rep === "function") {
                value = rep.call(holder, key, value);
            }

            switch (typeof value) {
                case "string":
                    return quote(value);
                case "number":
                    return isFinite(value)
                        ? String(value)
                        : "null";
                case "boolean":
                case "null":
                    return String(value);
                case "object":
                    if (!value) {
                        return "null";
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === "[object Array]") {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || "null";
                        }
                        v = partial.length === 0
                            ? "[]"
                            : gap
                                ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                                : "[" + partial.join(",") + "]";
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === "object") {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === "string") {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                        gap
                                            ? ": "
                                            : ":"
                                    ) + v);
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                        gap
                                            ? ": "
                                            : ":"
                                    ) + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0
                        ? "{}"
                        : gap
                            ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                            : "{" + partial.join(",") + "}";
                    gap = mind;
                    return v;
            }
        }

        if (typeof JSON.stringify !== "function") {
            meta = {    // table of character substitutions
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                "\"": "\\\"",
                "\\": "\\\\"
            };
            JSON.stringify = function (value, replacer, space) {
                var i;
                gap = "";
                indent = "";
                if (typeof space === "number") {
                    for (i = 0; i < space; i += 1) {
                        indent += " ";
                    }
                } else if (typeof space === "string") {
                    indent = space;
                }
                rep = replacer;
                if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                        typeof replacer.length !== "number")) {
                    throw new Error("JSON.stringify");
                }
                return str("", {"": value});
            };
        }
        if (typeof JSON.parse !== "function") {
            JSON.parse = function (text, reviver) {
                var j;

                function walk(holder, key) {
                    var k;
                    var v;
                    var value = holder[key];
                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }

                text = String(text);
                rx_dangerous.lastIndex = 0;
                if (rx_dangerous.test(text)) {
                    text = text.replace(rx_dangerous, function (a) {
                        return "\\u" +
                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                if (
                    rx_one.test(
                        text
                            .replace(rx_two, "@")
                            .replace(rx_three, "]")
                            .replace(rx_four, "")
                    )
                ) {
                    j = eval("(" + text + ")");
                    return (typeof reviver === "function")
                        ? walk({"": j}, "")
                        : j;
                }
                throw new SyntaxError("JSON.parse");
            };
        }
    }());


    var isFunction = function (obj) {
        return (obj !== undefined && Object.prototype.toString.call(obj) === '[object Function]');
    };

    var isNumber = function (obj) {
        return (obj !== undefined && Object.prototype.toString.call(obj) === '[object Number]');
    };

    var log = function (msg) {
        if (!DEBUG || window.console === undefined) {
            return;
        }
        var dateFormat = function (date, format) {
            var k;
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(), //day
                "h+": date.getHours(), //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1,
                    (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
            }
            for (k in o) {
                if (o.hasOwnProperty(k)) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1,
                            RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(o[k].toString().length));
                    }
                }
            }
            return format;
        };

        console.log(dateFormat(new Date(), "hh:mm:ss.S") + ":" + msg);

    };


    var JSONP = {

        callbacks: {},
        timeouts: {},

        buildQueryString: function (params, cached, cbId) {
            var key,
                qsArray = [];

            if (cached !== undefined && cached === true) {
                qsArray.push("r=" + Math.round(Math.random() * 10000001));
            }

            // Build query string from JSON
            for (key in params) {
                if (params.hasOwnProperty(key) && params[key] !== undefined) {
                    qsArray.push(key + "=" + encodeURIComponent(params[key]));
                }
            }

            // Append callback name
            qsArray.push('callback=' + packageName + '.message.JSONP.callbacks.' + cbId);
            qsArray.push('tick=' + packageName + '.message.JSONP.callbacks.tick');

            return qsArray.join('&');
        },

        // Cleanup script tags,callback & timeout handler
        cleanup: function (id) {
            var instance = this;
            var head = document.getElementsByTagName('head')[0];
            var el = document.getElementById(id);
            head.removeChild(el);
            if (instance.timeouts[id] !== undefined) {
                clearTimeout(instance.timeouts[id]);
            }
            setTimeout(function () {
                delete instance.callbacks[id];
                delete instance.timeouts[id];
            }, 0);
        },

        cancel: function (id) {
            var instance = this;
            var head = document.getElementsByTagName('head')[0];
            var el = document.getElementById(id);
            head.removeChild(el);

            if (instance.timeouts[id] !== undefined) {
                clearTimeout(instance.timeouts[id]);
            }

            instance.callbacks[id] = function () {
                delete instance.callbacks[id];
            };
            delete instance.timeouts[id];

        },

        get: function (config) {
            var instance = this;
            // Generate call ID
            var cbId = 'cb' + (new Date()).getTime() + '_' + Math.round(Math.random() * 100001);

            // Assign callback function
            instance.callbacks[cbId] = function (json) {
                config.success(json);
                instance.cleanup(cbId);
            };

            if (isFunction(config.tick)) {
                instance.callbacks.tick = function (json) {
                    config.tick(json);
                };
            }

            // Create script tag
            var el = document.createElement('script');
            el.src = config.url + '?' + instance.buildQueryString(config.params, config.cached, cbId);
            el.id = cbId;
            // try to handle errors, some browsers may not supported
            addEvent(el, "error", function (e) {
                if (isFunction(config.fail)) {
                    config.fail(e);
                    instance.cleanup(cbId);
                }
            });
            // Write into head tags
            var head = document.getElementsByTagName('head')[0];
            head.insertBefore(el, head.firstChild);

            if (isNumber(config.timeout) && isFunction(config.fail)) {
                instance.timeouts[cbId] = setTimeout(function () {
                    config.fail("timeout");
                    instance.cleanup(cbId);
                }, config.timeout * 1000);
            }

            return cbId;
        }

    };

    var Sub = function (uid, type, eid, callback) {
        this.uid = uid;
        this.type = String(type);
        this.eid = eid;
        this.callback = callback;
    };


    var Connection = function (uid, url) {
        this.uid = uid;
        this.url = url;
        this.subs = [];
        this.subTimer = undefined;
    };

    Connection.prototype = {

        _sub: function () {
            this.cancelLastSub();
            var instance = this,
                types = '',
                eids = '';
            for (var i = 0; i < this.subs.length; i++) {
                types = types + this.subs[i].type + ((i !== this.subs.length - 1) ? ',' : '');
                eids = eids + (this.subs[i].eid !== undefined ? this.subs[i].eid : '') + ((i !== this.subs.length - 1) ? ',' : '');
            }
            this.type = types;
            this.eid = eids === ',' ? '' : eids;

            var getSubLogHead = function () {
                return "subscribe(" + (instance.id === undefined ? "" : instance.id + ",") + instance.uid + ",[" +
                    instance.type + "]" + (instance.eid === undefined ? "" : ",[" + instance.eid + "]") +
                    (instance.since === undefined ? "" : "," + instance.since) + ")";
            };
            log(getSubLogHead());

            this.cbId = JSONP.get({
                url: this.url,
                cached: false,
                params: {id: this.id, uid: this.uid, eid: this.eid, tid: this.type, since: this.since},
                timeout: TIME_OUT,
                fail: function (error) {
                    log(getSubLogHead() + " error-->" + error);
                    instance.cbId = undefined;
                    //subscribe again 10s after failure,avoid request flood
                    setTimeout(function () {
                        instance._sub();
                    }, 10000);
                },
                success: function (result) {
                    log("subscribe returned from server successfully");
                    instance.cbId = undefined;
                    if (null == result.error || result.error.length === 0) {
                        if (result.id !== undefined) {
                            instance.id = result.id;
                        }
                        var lastTime = 0;
                        if (result.time !== undefined) {
                            lastTime = result.time;
                        }

                        // handle message callbacks if exists
                        if (result.messages !== undefined && result.messages.length > 0) {
                            for (var i = 0; i < result.messages.length; i++) {
                                var message = result.messages[i];
                                if (lastTime < message.time) {
                                    lastTime = message.time;
                                }
                                if (instance.receiveMessageCallback !== undefined) {
                                    instance.receiveMessageCallback(message);
                                }
                                log(getSubLogHead() + " return message-->" + message.uid + "," + message.type + "," + (message.eid != null ? message.eid + "," : "") + message.time);

                                for (var index = 0; index < instance.subs.length; index++) {
                                    if (instance.subs[index].type === message.type) {
                                        if (message.eid != null && instance.subs[index].eid !== message.eid) {
                                            continue;
                                        }
                                        instance.subs[index].callback(message);
                                    }
                                }
                            }
                        } else {
                            log(getSubLogHead() + " return no new message!");
                        }

                        //sub again
                        if (lastTime !== 0) {
                            instance.since = lastTime;
                        }
                        setTimeout(function () {
                            instance._sub();
                        }, 0);

                    } else {
                        instance.fail(result.error);
                    }

                }
            });
        },

        cancelLastSub: function () {
            if (this.cbId !== undefined) {
                JSONP.cancel(this.cbId);
                this.cbId = undefined;
            }
        },

        sub: function (type, eid, receiveMessageCallback) {
            if (this.subTimer !== undefined) {
                clearTimeout(this.subTimer);
                this.subTimer = undefined;
            }
            //第一次sub时候since取客户端的时间，以后since设置为服务器返回的时间,
            //第一次需要设置客户端时间是为了防止初始sub时，从第一次sub到最后一次sub以后SUB_DELAY毫秒内pub的消息丢失
            if (this.since === undefined) {
                this.since = (new Date()).getTime() - SUB_DELAY;
            }
            var subs = this.subs,
                types = type.split(","),
                i;
            if (isFunction(eid)) {
                //the second param is callback,without eid
                for (i = 0; i < types.length; i++) {
                    subs[subs.length] = new Sub(this.uid, types[i], undefined, eid);
                }
            } else {
                var eids = eid.split(",");
                if (isFunction(receiveMessageCallback)) {
                    for (i = 0; i < types.length; i++) {
                        subs[subs.length] = new Sub(this.uid, types[i], eids[i] === undefined ? "" : eids[i], receiveMessageCallback);
                    }
                }
            }
            this.cancelLastSub();
            var instance = this;
            this.subTimer = setTimeout(function () {
                instance._sub();
            }, SUB_DELAY);
            return this;
        }
    };

    var create = function (uid, url) {
        if (uid === undefined) {
            alert("uid required!");
            return;
        }
        //一个用户id一个长连接
        if (this.connections[uid] === undefined) {
            this.connections[uid] = new Connection(uid, url);
        }
        return this.connections[uid];
    };

    var checkBrowser = function (callback) {
        // UserAgent RegExp
        var rwebkit = /(webkit)[ \/]([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
        var userAgent = navigator.userAgent.toLowerCase();

        var match = rwebkit.exec(userAgent) ||
            ropera.exec(userAgent) ||
            rmsie.exec(userAgent) ||
            userAgent.indexOf("compatible") < 0 && rmozilla.exec(userAgent) ||
            [];

        var browser = {browser: match[1] || "", version: match[2] || "0"};

        var invalid = false;
        if (browser.browser == "") {
            invalid = true;
        } else {
            if (browser.browser == "msie") {
                var version = parseInt(browser.version, 10);
                if (version <= 6) {
                    invalid = true;
                } else {
                    if (version == 7) {
                        var fake = document.createElement("fake");
                        //borderSpacing这个CSS只在ie8以上有,ie7没有，排除设置了兼容模式的高版本IE也被误认为是ie7
                        if (fake.style["borderSpacing"] == null) {
                            invalid = true;
                        }
                    }
                }
            }
        }

        if (invalid === true) {
            if (callback != null && typeof callback === "function") {
                callback();
            } else {
                if (document.body != null) {
                    var height = window.innerHeight
                        || document.documentElement.clientHeight
                        || document.body.clientHeight,
                        width = window.innerWidth
                            || document.documentElement.clientWidth
                            || document.body.clientWidth;

                    var body = document.body;
                    var div = document.createElement("div");
                    div.setAttribute("id", "browserNotice");
                    div.style.setAttribute("marginTop", (height / 2 - 100) + "px");
                    div.style.setAttribute("color", "#c8d9dd");
                    div.style.setAttribute("backgroundColor", "#004d60");
                    div.style.setAttribute("position", "absolute");
                    div.style.setAttribute("zIndex", "100001");
                    div.style.setAttribute("height", "120px");
                    div.style.setAttribute("width", width + "px");
                    div.style.setAttribute("textAlign", "center");
                    div.style.setAttribute("padding", "10px 0");
                    div.style.setAttribute("fontSize", "14px");
                    div.style.setAttribute("fontWeight", "bolder");
                    div.style.setAttribute("display", "block");
                    div.innerHTML = "<br/><span style='font-family: SimHei; font-size: 20px; font-weight: bold'>浏览器不兼容</span><br/><br/>" +
                        "为了您能达到最佳浏览效果，请使用IE8及以上、最新版<a href='http://www.google.cn/chrome/eula.html?hl=zh-CN&platform=win' target='_blank'>Chrome</a>或<a href='http://firefox.com.cn/download/' target='_blank'>Firefox</a>浏览器访问。";
                    body.insertBefore(div, body.firstChild);

                    var overlay = document.createElement("div");
                    overlay.setAttribute("id", "browserOverlayer");
                    overlay.style.setAttribute("height", height + "px");
                    overlay.style.setAttribute("width", width + "px");
                    overlay.style.setAttribute("backgroundColor", "#000");
                    overlay.style.setAttribute("position", "absolute");
                    overlay.style.setAttribute("zIndex", "100000");
                    overlay.style.setAttribute("textAlign", "center");
                    overlay.style.setAttribute("display", "block");
                    overlay.style.setAttribute("-moz-opacity", ".80");
                    overlay.style.setAttribute("filter", "alpha(opacity=80)");
                    overlay.style.setAttribute("opacity", ".80");
                    overlay.style.setAttribute("display", "block");
                    body.insertBefore(overlay, div);
                }
            }
            return false;
        }
        return true;

    };

    window[packageName] = {
        message: {
            subscribe: function () {
                //do nothing
            },
            create: create,
            connections: [],
            JSONP: JSONP
        },
        checkBrowser: checkBrowser
    };

    (function (window, undefined) {


        var PARENT_HOST = null;
        var iframeId = null;
        var parentId = null;
        var onFlyoutClose = null;

        var guid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        var openFlyout = function (options, onClose) {
            sendMessage({
                command: 'openFlyout',
                options: options
            });
            if (options['onClose'] != null && isFunction(options['onClose'])) {
                onFlyoutClose = options['onClose'];
            } else {
                if (isFunction(onClose)) {
                    onFlyoutClose = onClose;
                }
            }
        };

        var closeFlyout = function (data) {
            if (onFlyoutClose != null && isFunction(onFlyoutClose)) {
                onFlyoutClose(data);
                onFlyoutClose = null;
            }
            sendMessage({
                command: 'closeFlyout',
                data: data
            });
        };

        var sendMessage = function (data) {
            if (data['cid'] == null) {
                data['cid'] = iframeId;
            }
            window.parent.postMessage(JSON.stringify(data), PARENT_HOST);
        };

        var receiveMessage = function (e) {
            if (PARENT_HOST != '*' && e.origin !== PARENT_HOST) return;
            var message;
            try {
                message = JSON.parse(e.data)
            } catch (e) {
            }
            if (message == null || message['command'] == null) return;
            switch (message['command']) {
                case 'query':
                case 'queryFlyout':
                    if (message['cid'] != null && message['pid'] != null) {
                        if (message['cid'] === iframeId) {
                            sendMessage({
                                command: message['command'] == 'query' ? 'confirm' : 'confirmFlyout',
                                cid: message['cid'],
                                pid: message['pid']
                            });
                            parentId = message['pid'];
                        }
                    }
                    break;
                case 'closeFlyout':
                    if (message['pid'] != null) {
                        if (message['pid'] == parentId) {
                            closeFlyout(message['data']);
                        }
                    }
                    break;
            }
        };

        var setPropertyValue = function (propName, propValue) {

            var getHashArray = function () {
                var oldHash = window.location.hash.substr(1),
                    paramArray = oldHash.split("&");
                var result = [];
                for (var i = 0, len = paramArray.length; i < len; i++) {
                    var paramString = paramArray[i];
                    var ei = paramString.indexOf("=");
                    if (ei === -1) {
                        result[i] = {key: paramString};
                    } else {
                        result[i] = {key: paramString.substring(0, ei), value: paramString.substring(ei + 1)};
                    }
                }
                return result;
            };

            if (propName === undefined || propName === '') {
                return;
            }
            propValue = propValue || '';
            if (window.location.hash !== '') {
                var hashArray = getHashArray();

                var hash = "",
                    found = false;
                for (var i = 0, len = hashArray.length; i < len; i++) {
                    if (hashArray[i].key === propName) {
                        hashArray[i].value = encodeURIComponent(propValue);
                        found = true;
                    }
                    hash += hashArray[i].key + "=" + hashArray[i].value;
                    if (i !== len - 1) {
                        hash += "&";
                    }
                }
                if (!found) {
                    hash += "&" + propName + "=" + encodeURIComponent(propValue);
                }
                window.location.hash = "#" + hash;

            } else {
                window.location.hash = "#" + propName + "=" + encodeURIComponent(propValue);
            }

        };

        var hashChange = function () {
            sendMessage({
                command: 'change',
                url: location.href
            });
        };


        var init = function (isFlyout) {
            return function (parentHost) {
                iframeId = guid();
                PARENT_HOST = parentHost;
                addEvent(window, "message", receiveMessage);
                if (!isFlyout) {
                    addEvent(window, "hashchange", hashChange);
                }
                sendMessage({
                    command: isFlyout === true ? 'createFlyout' : 'create'
                });
            }
        };

        window[packageName]['iframe'] = {
            init: init(false),
            initFlyout: init(true),
            openFlyout: openFlyout,
            closeFlyout: closeFlyout,
            setPropertyValue: setPropertyValue
        };
    })(window);


})(window);