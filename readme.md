# Install

```bash
npm install --save https://github.com/jrc03c/email-validator
```

# Use

In Node:

```js
const emailValidator = require("@jrc03c/email-validator")
```

In the browser:

```html
<script src="path/to/email-validator.js"></script>
```

Then:

```js
emailValidator.fetchTopLevelDomainList().then(() => {
  const isValid = emailValidator.validate("someone@example.com")

  if (isValid) {
    // Yay!
  } else {
    // Uh-oh!
  }
})
```

By default, the top-level domain list is fetched from [here](https://data.iana.org/TLD/tlds-alpha-by-domain.txt). However, if you prefer, you can pass your own URL from which to fetch the list:

```js
emailValidator.fetchTopLevelDomainList(myListUrl)
```

As I write this, the Fetch API has not yet been implemented in Node; so this library includes its own version written from scratch. My version definitely doesn't implement the full Fetch API; in fact, it's just useful enough to fetch a plain text file from a URL, and that's all. But I wrote it myself because I didn't want to rely on any third-party libraries. If for some reason you are working in Node _and_ you need to fetch the top-level domain list using a more complicated request (e.g., a POST request, or a request that requires certain headers, etc.), or if you just don't just the way I've written my own `fetch` function, then you'll need to write your own version or import a library like [`node-fetch`](https://github.com/node-fetch/node-fetch) and then do your own fetching:

```js
const emailValidator = require("@jrc03c/email-validator")
const fetch = require("node-fetch")

fetch(myListUrl, myFancyOptions).then(response => {
  // parse the response to retrieve your list, and then:
  emailValidator.topLevelDomainList = myFancyList

  const isValid = emailValidator.validate("someone@example.com")
  // ...
})
```
