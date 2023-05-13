(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/ugly-fetch.js
  var require_ugly_fetch = __commonJS({
    "src/ugly-fetch.js"(exports, module) {
      var uglyFetch = (() => {
        if (typeof fetch !== "undefined") {
          return fetch;
        } else {
          try {
            const https = __require("https");
            class Response {
              constructor(data) {
                this.data = data;
              }
              async text() {
                return this.data;
              }
            }
            return function fetch2(url) {
              return new Promise((resolve, reject) => {
                try {
                  let data = "";
                  const request = https.get(url, (response) => {
                    response.on("data", (d) => {
                      data += d;
                    });
                    response.on("end", () => {
                      resolve(new Response(data));
                    });
                  });
                  request.on("error", (e) => {
                    reject(e);
                  });
                } catch (e) {
                  reject(e);
                }
              });
            };
          } catch (e) {
            throw new Error(
              "It doesn't seem like there's a `fetch` function available! This means that `EmailValidator` won't work since it needs to download a top-level domain list using a `fetch` function. Please import or define one before importing `EmailValidator`!"
            );
          }
        }
      })();
      module.exports = uglyFetch;
    }
  });

  // src/index.js
  var require_src = __commonJS({
    "src/index.js"(exports, module) {
      var uglyFetch = require_ugly_fetch();
      var EmailValidator = class {
        constructor() {
          this.topLevelDomainList = [];
        }
        get isReady() {
          return this.topLevelDomainList.length > 0;
        }
        async fetchTopLevelDomainList(url) {
          if (!url) {
            url = "https://data.iana.org/TLD/tlds-alpha-by-domain.txt";
          }
          const response = await uglyFetch(url);
          const raw = await response.text();
          const lines = raw.toLowerCase().split("\n");
          this.topLevelDomainList = lines.map((line) => line.trim()).filter((line) => !line.match(/\s/g));
          return this.topLevelDomainList;
        }
        isValid(email) {
          return this.validate(email);
        }
        validate(email) {
          if (this.topLevelDomainList.length === 0) {
            throw new Error(
              "Before using an `EmailValidator` instance's `validate` method, you must first ask it to download a current top-level domain list using its async `fetchTopLevelDomainList` method!"
            );
          }
          if (typeof email !== "string") {
            return false;
          }
          email = email.toLowerCase();
          if (!email.includes("@")) {
            return false;
          }
          const parts = email.split("@");
          if (parts.length > 2) {
            return false;
          }
          const handle = parts[0].trim();
          const domain = parts[1].trim();
          if (handle.length === 0) {
            return false;
          }
          if (handle.match(/\s/g)) {
            return false;
          }
          if (domain.length === 0) {
            return false;
          }
          if (!domain.includes(".")) {
            return false;
          }
          const domainParts = domain.split(".");
          if (domainParts.some((part) => part.trim().length === 0)) {
            return false;
          }
          const domainName = domainParts.slice(0, domainParts.length - 1).join(".").trim();
          if (domainName[0] === "." || domainName[domainName.length - 1] === ".") {
            return false;
          }
          if (domainName.match(/\s/g)) {
            return false;
          }
          const extension = domainParts[domainParts.length - 1].trim();
          if (this.topLevelDomainList.indexOf(extension) < 0) {
            return false;
          }
          return true;
        }
      };
      if (typeof module !== "undefined") {
        module.exports = EmailValidator;
      }
      if (typeof window !== "undefined") {
        window.EmailValidator = EmailValidator;
      }
    }
  });
  require_src();
})();
