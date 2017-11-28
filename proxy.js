var XHRProxy;
(function(window) {

    var OriginalXHR = XMLHttpRequest;

    var XHRProxy = function() {
        this.xhr = new OriginalXHR();

        function delegate(prop) {
            Object.defineProperty(this, prop, {
                get: function() {
                    return this.xhr[prop];
                },
                set: function(value) {
                    this.xhr.timeout = value;
                }
            });
        }
        delegate.call(this, 'timeout');
        delegate.call(this, 'responseType');
        delegate.call(this, 'withCredentials');
        delegate.call(this, 'onerror');
        delegate.call(this, 'onabort');
        delegate.call(this, 'onloadstart');
        delegate.call(this, 'onloadend');
        delegate.call(this, 'onprogress');
    };
    XHRProxy.prototype.open = function(method, url, async, username, password) {
        var ctx = this;

        function applyInterceptors(src) {
            ctx.responseText = ctx.xhr.responseText;
            for (var i=0; i < XHRProxy.interceptors.length; i++) {
                var applied = XHRProxy.interceptors[i](method, url, ctx.responseText, ctx.xhr.status);
                if (applied !== undefined) {
                    ctx.responseText = applied;
                }
            }
        }
        function setProps() {
            ctx.readyState = ctx.xhr.readyState;
            ctx.responseText = ctx.xhr.responseText;
            ctx.responseURL = ctx.xhr.responseURL;
            ctx.responseXML = ctx.xhr.responseXML;
            ctx.status = ctx.xhr.status;
            ctx.statusText = ctx.xhr.statusText;
        }

        this.xhr.open(method, url, async, username, password);

        this.xhr.onload = function(evt) {
            if (ctx.onload) {
                setProps();

                if (ctx.xhr.readyState === 4) {
                     applyInterceptors();
                }
                return ctx.onload(evt);
            }
        };
        this.xhr.onreadystatechange = function (evt) {
            if (ctx.onreadystatechange) {
                setProps();

                if (ctx.xhr.readyState === 4) {
                     applyInterceptors();
                }
                return ctx.onreadystatechange(evt);
            }
        };
    };
    XHRProxy.prototype.addEventListener = function(event, fn) {
        return this.xhr.addEventListener(event, fn);
    };
    XHRProxy.prototype.send = function(data) {
        return this.xhr.send(data);
    };
    XHRProxy.prototype.abort = function() {
        return this.xhr.abort();
    };
    XHRProxy.prototype.getAllResponseHeaders = function() {
        return this.xhr.getAllResponseHeaders();
    };
    XHRProxy.prototype.getResponseHeader = function(header) {
        return this.xhr.getResponseHeader(header);
    };
    XHRProxy.prototype.setRequestHeader = function(header, value) {
        return this.xhr.setRequestHeader(header, value);
    };
    XHRProxy.prototype.overrideMimeType = function(mimetype) {
        return this.xhr.overrideMimeType(mimetype);
    };

    XHRProxy.interceptors = [];
    XHRProxy.addInterceptor = function(fn) {
        this.interceptors.push(fn);
    };
  console.log(XHRProxy)
    window.XMLHttpRequest = XHRProxy;
  
})(window);

XHRProxy.addInterceptor(function(method, url, responseText, status) {
  return "<!-- HTML! -->" + responseText;
});