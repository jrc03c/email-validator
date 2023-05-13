# Installation

```bash
npm install --save https://github.com/jrc03c/email-validator
```

# Usage

In Node:

```js
const EmailValidator = require("@jrc03c/email-validator")
```

In the browser:

```html
<script src="path/to/dist/email-validator.js"></script>
```

Then:

```js
const validator = new EmailValidator()

validator.load().then(() => {
  const isValid = validator.validate("someone@example.com")

  if (isValid) {
    // Yay!
  } else {
    // Uh-oh!
  }
})
```

By default, the top-level domain list is fetched from [IANA](https://data.iana.org/TLD/tlds-alpha-by-domain.txt). However, if you prefer, you can pass your own URL from which to fetch the list:

```js
validator.load(myListUrl)
```

As I write this, the Fetch API has not yet been implemented in Node; so this library includes its own version written from scratch. My version definitely doesn't implement the full Fetch API; in fact, it's just useful enough to fetch a plain text file from a URL, and that's all. But I wrote it myself because I didn't want to rely on any third-party libraries. If for some reason you are working in Node _and_ you need to fetch the top-level domain list using a more complicated request (e.g., a POST request, or a request that requires certain headers, etc.), or if you just don't just the way I've written my own `fetch` function, then you'll need to write your own version or import a library like [`node-fetch`](https://github.com/node-fetch/node-fetch) and then do your own fetching:

```js
const EmailValidator = require("@jrc03c/email-validator")
const fetch = require("node-fetch")

fetch(myListUrl, myFancyOptions).then(response => {
  const myFancyList = await response.json()

  // parse the response to retrieve your list, and then:
  const validator = new EmailValidator()
  validator.topLevelDomainList = myFancyList

  const isValid = validator.validate("someone@example.com")
  // ...
})
```

# API

## EmailValidator

There are no constructor arguments.

### Properties

#### `isReady`

A read-only property that indicates whether or not a top-level domain list has been loaded into the validator.

#### `topLevelDomainList`

A list of top-level domains. (NOTE: I typically think of domains as something like "github.com". But "top-level domains" in this context refers to what I'd otherwise call the "extension" of the domain; i.e., the thing that comes at the end of the domain name, such as "com" in "github.com". So, this top-level domain list should be a list of all such domain name endings.)

### Methods

#### `load(url)`

Returns a `Promise` that resolves once a list of top-level domains has been downloaded. Passing a URL into the method is optional. When passed, the top-level domain list will be fetched from the given URL rather than from [the default IANA URL](https://data.iana.org/TLD/tlds-alpha-by-domain.txt). This method is identical to `fetchTopLevelDomainList`.

#### `fetchTopLevelDomainList(url)`

Returns a `Promise` that resolves once a list of top-level domains has been downloaded. Passing a URL into the method is optional. When passed, the top-level domain list will be fetched from the given URL rather than from [the default IANA URL](https://data.iana.org/TLD/tlds-alpha-by-domain.txt). This method is identical to `load`.

#### `isValid(email)`

Returns a boolean indicating whether or not the given email address is valid. This method is identical to `validate`.

#### `validate(email)`

Returns a boolean indicating whether or not the given email address is valid. This method is identical to `isValid`.
