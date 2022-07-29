function createUnityInstance(e, r, t) {
  function n(e, t) {
    if (!n.aborted && r.showBanner)
      return "error" == t && (n.aborted = !0), r.showBanner(e, t);
    switch (t) {
      case "error":
        console.error(e);
        break;
      case "warning":
        console.warn(e);
        break;
      default:
        console.log(e);
    }
  }
  function o(e) {
    var r = e.reason || e.error,
      t = r ? r.toString() : e.message || e.reason || "",
      n = r && r.stack ? r.stack.toString() : "";
    if (
      (n.startsWith(t) && (n = n.substring(t.length)),
      (t += "\n" + n.trim()),
      t && c.stackTraceRegExp && c.stackTraceRegExp.test(t))
    ) {
      var o = e.filename || (r && (r.fileName || r.sourceURL)) || "",
        a = e.lineno || (r && (r.lineNumber || r.line)) || 0;
      s(t, o, a);
    }
  }
  function a(e) {
    e.preventDefault();
  }
  function s(e, r, t) {
    if (c.startupErrorHandler) return void c.startupErrorHandler(e, r, t);
    if (
      !(
        (c.errorHandler && c.errorHandler(e, r, t)) ||
        (console.log("Invoking error handler due to\n" + e),
        "function" == typeof dump &&
          dump("Invoking error handler due to\n" + e),
        e.indexOf("UnknownError") != -1 ||
          e.indexOf("Program terminated with exit(0)") != -1 ||
          s.didShowErrorMessage)
      )
    ) {
      var e =
        "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" +
        e;
      e.indexOf("DISABLE_EXCEPTION_CATCHING") != -1
        ? (e =
            "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.")
        : e.indexOf("Cannot enlarge memory arrays") != -1
        ? (e =
            "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.")
        : (e.indexOf("Invalid array buffer length") == -1 &&
            e.indexOf("Invalid typed array length") == -1 &&
            e.indexOf("out of memory") == -1 &&
            e.indexOf("could not allocate memory") == -1) ||
          (e =
            "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),
        alert(e),
        (s.didShowErrorMessage = !0);
    }
  }
  function i(e, r) {
    if ("symbolsUrl" != e) {
      var n = c.downloadProgress[e];
      n ||
        (n = c.downloadProgress[e] =
          {
            started: !1,
            finished: !1,
            lengthComputable: !1,
            total: 0,
            loaded: 0,
          }),
        "object" != typeof r ||
          ("progress" != r.type && "load" != r.type) ||
          (n.started ||
            ((n.started = !0),
            (n.lengthComputable = r.lengthComputable),
            (n.total = r.total)),
          (n.loaded = r.loaded),
          "load" == r.type && (n.finished = !0));
      var o = 0,
        a = 0,
        s = 0,
        i = 0,
        d = 0;
      for (var e in c.downloadProgress) {
        var n = c.downloadProgress[e];
        if (!n.started) return 0;
        s++,
          n.lengthComputable
            ? ((o += n.loaded), (a += n.total), i++)
            : n.finished || d++;
      }
      var l = s ? (s - d - (a ? (i * (a - o)) / a : 0)) / s : 0;
      t(0.9 * l);
    }
  }
  function d(e) {
    return new Promise(function (r, t) {
      i(e);
      var o =
        c.companyName && c.productName
          ? new c.XMLHttpRequest({
              companyName: c.companyName,
              productName: c.productName,
              cacheControl: c.cacheControl(c[e]),
            })
          : new XMLHttpRequest();
      o.open("GET", c[e]),
        (o.responseType = "arraybuffer"),
        o.addEventListener("progress", function (r) {
          i(e, r);
        }),
        o.addEventListener("load", function (t) {
          i(e, t), r(new Uint8Array(o.response));
        }),
        o.addEventListener("error", function (r) {
          var t = "Failed to download file " + c[e];
          "file:" == location.protocol
            ? n(
                t +
                  ". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.",
                "error"
              )
            : console.error(t);
        }),
        o.send();
    });
  }
  function l() {
    return new Promise(function (e, r) {
      var t = document.createElement("script");
      (t.src = c.frameworkUrl),
        (t.onload = function () {
          if ("undefined" == typeof unityFramework || !unityFramework) {
            var r = [
              ["br", "br"],
              ["gz", "gzip"],
            ];
            for (var o in r) {
              var a = r[o];
              if (c.frameworkUrl.endsWith("." + a[0])) {
                var s = "Unable to parse " + c.frameworkUrl + "!";
                if ("file:" == location.protocol)
                  return void n(
                    s +
                      " Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.",
                    "error"
                  );
                if (
                  ((s +=
                    ' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: ' +
                    a[1] +
                    '" present. Check browser Console and Devtools Network tab to debug.'),
                  "br" == a[0] && "http:" == location.protocol)
                ) {
                  var i =
                    ["localhost", "127.0.0.1"].indexOf(location.hostname) != -1
                      ? ""
                      : "Migrate your server to use HTTPS.";
                  s = /Firefox/.test(navigator.userAgent)
                    ? "Unable to parse " +
                      c.frameworkUrl +
                      '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. ' +
                      i +
                      ' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.'
                    : "Unable to parse " +
                      c.frameworkUrl +
                      '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.';
                }
                return void n(s, "error");
              }
            }
            n(
              "Unable to parse " +
                c.frameworkUrl +
                "! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)",
              "error"
            );
          }
          var d = unityFramework;
          (unityFramework = null), (t.onload = null), e(d);
        }),
        (t.onerror = function (e) {
          n(
            "Unable to load file " +
              c.frameworkUrl +
              "! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)",
            "error"
          );
        }),
        document.body.appendChild(t),
        c.deinitializers.push(function () {
          document.body.removeChild(t);
        });
    });
  }
  function u() {
    l().then(function (e) {
      e(c);
    });
    var e = d("dataUrl");
    c.preRun.push(function () {
      c.addRunDependency("dataUrl"),
        e.then(function (e) {
          var r = new DataView(e.buffer, e.byteOffset, e.byteLength),
            t = 0,
            n = "UnityWebData1.0\0";
          if (
            !String.fromCharCode.apply(null, e.subarray(t, t + n.length)) == n
          )
            throw "unknown data format";
          t += n.length;
          var o = r.getUint32(t, !0);
          for (t += 4; t < o; ) {
            var a = r.getUint32(t, !0);
            t += 4;
            var s = r.getUint32(t, !0);
            t += 4;
            var i = r.getUint32(t, !0);
            t += 4;
            var d = String.fromCharCode.apply(null, e.subarray(t, t + i));
            t += i;
            for (
              var l = 0, u = d.indexOf("/", l) + 1;
              u > 0;
              l = u, u = d.indexOf("/", l) + 1
            )
              c.FS_createPath(d.substring(0, l), d.substring(l, u - 1), !0, !0);
            c.FS_createDataFile(d, null, e.subarray(a, a + s), !0, !0, !0);
          }
          c.removeRunDependency("dataUrl");
        });
    });
  }
  t = t || function () {};
  var c = {
    canvas: e,
    webglContextAttributes: { preserveDrawingBuffer: !1 },
    cacheControl: function (e) {
      return e == c.dataUrl ? "must-revalidate" : "no-store";
    },
    streamingAssetsUrl: "StreamingAssets",
    downloadProgress: {},
    deinitializers: [],
    intervals: {},
    setInterval: function (e, r) {
      var t = window.setInterval(e, r);
      return (this.intervals[t] = !0), t;
    },
    clearInterval: function (e) {
      delete this.intervals[e], window.clearInterval(e);
    },
    preRun: [],
    postRun: [],
    print: function (e) {
      console.log(e);
    },
    printErr: function (e) {
      console.error(e),
        "string" == typeof e &&
          e.indexOf("wasm streaming compile failed") != -1 &&
          (e.toLowerCase().indexOf("mime") != -1
            ? n(
                'HTTP Response Header "Content-Type" configured incorrectly on the server for file ' +
                  c.codeUrl +
                  ' , should be "application/wasm". Startup time performance will suffer.',
                "warning"
              )
            : n(
                'WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file ' +
                  c.codeUrl +
                  ", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.",
                "warning"
              ));
    },
    locateFile: function (e) {
      return "build.wasm" == e ? this.codeUrl : e;
    },
    disabledCanvasEvents: ["contextmenu", "dragstart"],
  };
  for (var f in r) c[f] = r[f];
  c.streamingAssetsUrl = new URL(c.streamingAssetsUrl, document.URL).href;
  var h = c.disabledCanvasEvents.slice();
  h.forEach(function (r) {
    e.addEventListener(r, a);
  }),
    window.addEventListener("error", o),
    window.addEventListener("unhandledrejection", o);
  var p = "",
    m = "";
  document.addEventListener("webkitfullscreenchange", function (r) {
    var t = document.webkitCurrentFullScreenElement;
    t === e
      ? e.style.width &&
        ((p = e.style.width),
        (m = e.style.height),
        (e.style.width = "100%"),
        (e.style.height = "100%"))
      : p && ((e.style.width = p), (e.style.height = m), (p = ""), (m = ""));
  });
  var v = {
    Module: c,
    SetFullscreen: function () {
      return c.SetFullscreen
        ? c.SetFullscreen.apply(c, arguments)
        : void c.print("Failed to set Fullscreen mode: Player not loaded yet.");
    },
    SendMessage: function () {
      return c.SendMessage
        ? c.SendMessage.apply(c, arguments)
        : void c.print("Failed to execute SendMessage: Player not loaded yet.");
    },
    Quit: function () {
      return new Promise(function (r, t) {
        (c.shouldQuit = !0),
          (c.onQuit = r),
          h.forEach(function (r) {
            e.removeEventListener(r, a);
          }),
          window.removeEventListener("error", o),
          window.removeEventListener("unhandledrejection", o);
      });
    },
  };
  return (
    (c.SystemInfo = (function () {
      function e(e, r, t) {
        return (e = RegExp(e, "i").exec(r)), e && e[t];
      }
      for (
        var r,
          t,
          n,
          o,
          a,
          s,
          i = navigator.userAgent + " ",
          d = [
            ["Firefox", "Firefox"],
            ["OPR", "Opera"],
            ["Edg", "Edge"],
            ["SamsungBrowser", "Samsung Browser"],
            ["Trident", "Internet Explorer"],
            ["MSIE", "Internet Explorer"],
            ["Chrome", "Chrome"],
            ["CriOS", "Chrome on iOS Safari"],
            ["FxiOS", "Firefox on iOS Safari"],
            ["Safari", "Safari"],
          ],
          l = 0;
        l < d.length;
        ++l
      )
        if ((t = e(d[l][0] + "[/ ](.*?)[ \\)]", i, 1))) {
          r = d[l][1];
          break;
        }
      "Safari" == r && (t = e("Version/(.*?) ", i, 1)),
        "Internet Explorer" == r && (t = e("rv:(.*?)\\)? ", i, 1) || t);
      for (
        var u = [
            ["Windows (.*?)[;)]", "Windows"],
            ["Android ([0-9_.]+)", "Android"],
            ["iPhone OS ([0-9_.]+)", "iPhoneOS"],
            ["iPad.*? OS ([0-9_.]+)", "iPadOS"],
            ["FreeBSD( )", "FreeBSD"],
            ["OpenBSD( )", "OpenBSD"],
            ["Linux|X11()", "Linux"],
            ["Mac OS X ([0-9_.]+)", "macOS"],
            ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"],
          ],
          c = 0;
        c < u.length;
        ++c
      )
        if ((o = e(u[c][0], i, 1))) {
          (n = u[c][1]), (o = o.replace(/_/g, "."));
          break;
        }
      var f = {
        "NT 5.0": "2000",
        "NT 5.1": "XP",
        "NT 5.2": "Server 2003",
        "NT 6.0": "Vista",
        "NT 6.1": "7",
        "NT 6.2": "8",
        "NT 6.3": "8.1",
        "NT 10.0": "10",
      };
      (o = f[o] || o),
        (a = document.createElement("canvas")),
        a &&
          ((gl = a.getContext("webgl2")),
          (glVersion = gl ? 2 : 0),
          gl || ((gl = a && a.getContext("webgl")) && (glVersion = 1)),
          gl &&
            (s =
              (gl.getExtension("WEBGL_debug_renderer_info") &&
                gl.getParameter(37446)) ||
              gl.getParameter(7937)));
      var h = "undefined" != typeof SharedArrayBuffer,
        p =
          "object" == typeof WebAssembly &&
          "function" == typeof WebAssembly.compile;
      return {
        width: screen.width,
        height: screen.height,
        userAgent: i.trim(),
        browser: r || "Unknown browser",
        browserVersion: t || "Unknown version",
        mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
        os: n || "Unknown OS",
        osVersion: o || "Unknown OS Version",
        gpu: s || "Unknown GPU",
        language: navigator.userLanguage || navigator.language,
        hasWebGL: glVersion,
        hasCursorLock: !!document.body.requestPointerLock,
        hasFullscreen:
          !!document.body.requestFullscreen ||
          !!document.body.webkitRequestFullscreen,
        hasThreads: h,
        hasWasm: p,
        hasWasmThreads: !1,
      };
    })()),
    (c.abortHandler = function (e) {
      return s(e, "", 0), !0;
    }),
    (Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50)),
    (c.XMLHttpRequest = (function () {
      function e(e) {
        console.log("[UnityCache] " + e);
      }
      function r(e) {
        return (
          (r.link = r.link || document.createElement("a")),
          (r.link.href = e),
          r.link.href
        );
      }
      function t(e) {
        var r = window.location.href.match(/^[a-z]+:\/\/[^\/]+/);
        return !r || e.lastIndexOf(r[0], 0);
      }
      function n() {
        function r(r) {
          if ("undefined" == typeof n.database)
            for (
              n.database = r,
                n.database || e("indexedDB database could not be opened");
              n.queue.length;

            ) {
              var t = n.queue.shift();
              n.database
                ? n.execute.apply(n, t.arguments)
                : "function" == typeof t.onerror &&
                  t.onerror(new Error("operation cancelled"));
            }
        }
        function t() {
          var e = o.open(s.name, s.version);
          (e.onupgradeneeded = function (e) {
            var r = e.target.result;
            r.objectStoreNames.contains(d.name) || r.createObjectStore(d.name);
          }),
            (e.onsuccess = function (e) {
              r(e.target.result);
            }),
            (e.onerror = function () {
              r(null);
            });
        }
        var n = this;
        n.queue = [];
        try {
          var o =
              window.indexedDB ||
              window.mozIndexedDB ||
              window.webkitIndexedDB ||
              window.msIndexedDB,
            a = setTimeout(function () {
              "undefined" == typeof n.database && r(null);
            }, 2e3),
            l = o.open(s.name);
          (l.onupgradeneeded = function (e) {
            var r = e.target.result.createObjectStore(i.name, {
              keyPath: "url",
            });
            [
              "version",
              "company",
              "product",
              "updated",
              "revalidated",
              "accessed",
            ].forEach(function (e) {
              r.createIndex(e, e);
            });
          }),
            (l.onsuccess = function (e) {
              clearTimeout(a);
              var n = e.target.result;
              n.version < s.version ? (n.close(), t()) : r(n);
            }),
            (l.onerror = function () {
              clearTimeout(a), r(null);
            });
        } catch (e) {
          clearTimeout(a), r(null);
        }
      }
      function o(e, r, t, n, o) {
        var a = {
          url: e,
          version: i.version,
          company: r,
          product: t,
          updated: n,
          revalidated: n,
          accessed: n,
          responseHeaders: {},
          xhr: {},
        };
        return (
          o &&
            (["Last-Modified", "ETag"].forEach(function (e) {
              a.responseHeaders[e] = o.getResponseHeader(e);
            }),
            ["responseURL", "status", "statusText", "response"].forEach(
              function (e) {
                a.xhr[e] = o[e];
              }
            )),
          a
        );
      }
      function a(r) {
        (this.cache = { enabled: !1 }),
          r &&
            ((this.cache.control = r.cacheControl),
            (this.cache.company = r.companyName),
            (this.cache.product = r.productName)),
          (this.xhr = new XMLHttpRequest(r)),
          this.xhr.addEventListener(
            "load",
            function () {
              var r = this.xhr,
                t = this.cache;
              t.enabled &&
                !t.revalidated &&
                (304 == r.status
                  ? ((t.result.revalidated = t.result.accessed),
                    (t.revalidated = !0),
                    l.execute(i.name, "put", [t.result]),
                    e(
                      "'" +
                        t.result.url +
                        "' successfully revalidated and served from the indexedDB cache"
                    ))
                  : 200 == r.status
                  ? ((t.result = o(
                      t.result.url,
                      t.company,
                      t.product,
                      t.result.accessed,
                      r
                    )),
                    (t.revalidated = !0),
                    l.execute(
                      i.name,
                      "put",
                      [t.result],
                      function (r) {
                        e(
                          "'" +
                            t.result.url +
                            "' successfully downloaded and stored in the indexedDB cache"
                        );
                      },
                      function (r) {
                        e(
                          "'" +
                            t.result.url +
                            "' successfully downloaded but not stored in the indexedDB cache due to the error: " +
                            r
                        );
                      }
                    ))
                  : e(
                      "'" +
                        t.result.url +
                        "' request failed with status: " +
                        r.status +
                        " " +
                        r.statusText
                    ));
            }.bind(this)
          );
      }
      var s = { name: "UnityCache", version: 2 },
        i = { name: "XMLHttpRequest", version: 1 },
        d = { name: "WebAssembly", version: 1 };
      n.prototype.execute = function (e, r, t, n, o) {
        if (this.database)
          try {
            var a = this.database
              .transaction(
                [e],
                ["put", "delete", "clear"].indexOf(r) != -1
                  ? "readwrite"
                  : "readonly"
              )
              .objectStore(e);
            "openKeyCursor" == r && ((a = a.index(t[0])), (t = t.slice(1)));
            var s = a[r].apply(a, t);
            "function" == typeof n &&
              (s.onsuccess = function (e) {
                n(e.target.result);
              }),
              (s.onerror = o);
          } catch (e) {
            "function" == typeof o && o(e);
          }
        else
          "undefined" == typeof this.database
            ? this.queue.push({ arguments: arguments, onerror: o })
            : "function" == typeof o && o(new Error("indexedDB access denied"));
      };
      var l = new n();
      (a.prototype.send = function (r) {
        var n = this.xhr,
          o = this.cache,
          a = arguments;
        return (
          (o.enabled = o.enabled && "arraybuffer" == n.responseType && !r),
          o.enabled
            ? void l.execute(
                i.name,
                "get",
                [o.result.url],
                function (r) {
                  if (!r || r.version != i.version)
                    return void n.send.apply(n, a);
                  if (
                    ((o.result = r),
                    (o.result.accessed = Date.now()),
                    "immutable" == o.control)
                  )
                    (o.revalidated = !0),
                      l.execute(i.name, "put", [o.result]),
                      n.dispatchEvent(new Event("load")),
                      e(
                        "'" +
                          o.result.url +
                          "' served from the indexedDB cache without revalidation"
                      );
                  else if (
                    t(o.result.url) &&
                    (o.result.responseHeaders["Last-Modified"] ||
                      o.result.responseHeaders.ETag)
                  ) {
                    var s = new XMLHttpRequest();
                    s.open("HEAD", o.result.url),
                      (s.onload = function () {
                        (o.revalidated = ["Last-Modified", "ETag"].every(
                          function (e) {
                            return (
                              !o.result.responseHeaders[e] ||
                              o.result.responseHeaders[e] ==
                                s.getResponseHeader(e)
                            );
                          }
                        )),
                          o.revalidated
                            ? ((o.result.revalidated = o.result.accessed),
                              l.execute(i.name, "put", [o.result]),
                              n.dispatchEvent(new Event("load")),
                              e(
                                "'" +
                                  o.result.url +
                                  "' successfully revalidated and served from the indexedDB cache"
                              ))
                            : n.send.apply(n, a);
                      }),
                      s.send();
                  } else
                    o.result.responseHeaders["Last-Modified"]
                      ? (n.setRequestHeader(
                          "If-Modified-Since",
                          o.result.responseHeaders["Last-Modified"]
                        ),
                        n.setRequestHeader("Cache-Control", "no-cache"))
                      : o.result.responseHeaders.ETag &&
                        (n.setRequestHeader(
                          "If-None-Match",
                          o.result.responseHeaders.ETag
                        ),
                        n.setRequestHeader("Cache-Control", "no-cache")),
                      n.send.apply(n, a);
                },
                function (e) {
                  n.send.apply(n, a);
                }
              )
            : n.send.apply(n, a)
        );
      }),
        (a.prototype.open = function (e, t, n, a, s) {
          return (
            (this.cache.result = o(
              r(t),
              this.cache.company,
              this.cache.product,
              Date.now()
            )),
            (this.cache.enabled =
              ["must-revalidate", "immutable"].indexOf(this.cache.control) !=
                -1 &&
              "GET" == e &&
              this.cache.result.url.match("^https?://") &&
              ("undefined" == typeof n || n) &&
              "undefined" == typeof a &&
              "undefined" == typeof s),
            (this.cache.revalidated = !1),
            this.xhr.open.apply(this.xhr, arguments)
          );
        }),
        (a.prototype.setRequestHeader = function (e, r) {
          return (
            (this.cache.enabled = !1),
            this.xhr.setRequestHeader.apply(this.xhr, arguments)
          );
        });
      var u = new XMLHttpRequest();
      for (var c in u)
        a.prototype.hasOwnProperty(c) ||
          !(function (e) {
            Object.defineProperty(
              a.prototype,
              e,
              "function" == typeof u[e]
                ? {
                    value: function () {
                      return this.xhr[e].apply(this.xhr, arguments);
                    },
                  }
                : {
                    get: function () {
                      return this.cache.revalidated &&
                        this.cache.result.xhr.hasOwnProperty(e)
                        ? this.cache.result.xhr[e]
                        : this.xhr[e];
                    },
                    set: function (r) {
                      this.xhr[e] = r;
                    },
                  }
            );
          })(c);
      return a;
    })()),
    new Promise(function (e, r) {
      c.SystemInfo.hasWebGL
        ? 1 == c.SystemInfo.hasWebGL
          ? r(
              'Your browser does not support graphics API "WebGL 2.0" which is required for this content.'
            )
          : c.SystemInfo.hasWasm
          ? (1 == c.SystemInfo.hasWebGL &&
              c.print(
                'Warning: Your browser does not support "WebGL 2.0" Graphics API, switching to "WebGL 1.0"'
              ),
            (c.startupErrorHandler = r),
            t(0),
            c.postRun.push(function () {
              t(1), delete c.startupErrorHandler, e(v);
            }),
            u())
          : r("Your browser does not support WebAssembly.")
        : r("Your browser does not support WebGL.");
    })
  );
}
