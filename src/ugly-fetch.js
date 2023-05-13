const uglyFetch = (() => {
  if (typeof fetch !== "undefined") {
    return fetch
  } else {
    try {
      const https = require("https")

      class Response {
        constructor(data) {
          this.data = data
        }

        async text() {
          return this.data
        }
      }

      return function fetch(url) {
        return new Promise((resolve, reject) => {
          try {
            let data = ""

            const request = https.get(url, response => {
              response.on("data", d => {
                data += d
              })

              response.on("end", () => {
                resolve(new Response(data))
              })
            })

            request.on("error", e => {
              reject(e)
            })
          } catch (e) {
            reject(e)
          }
        })
      }
    } catch (e) {
      throw new Error(
        "It doesn't seem like there's a `fetch` function available! This means that `EmailValidator` won't work since it needs to download a top-level domain list using a `fetch` function. Please import or define one before importing `EmailValidator`!"
      )
    }
  }
})()

module.exports = uglyFetch
