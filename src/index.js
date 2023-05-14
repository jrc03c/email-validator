function flatten(x) {
  let out = []

  x.forEach(item => {
    if (isArray(item)) {
      const children = flatten(item)
      out = out.concat(children)
    } else {
      out.push(item)
    }
  })

  return out
}

function isArray(x) {
  return x instanceof Array
}

function isString(s) {
  return typeof s === "string"
}

class EmailValidator {
  _topLevelDomainList = []

  get isReady() {
    return this.topLevelDomainList.length > 0
  }

  get topLevelDomainList() {
    return this._topLevelDomainList
  }

  set topLevelDomainList(value) {
    if (!isArray(value)) {
      throw new Error(
        "The new value for `topLevelDomainList` must be an array!"
      )
    }

    this._topLevelDomainList = flatten(value).filter(v => isString(v))
  }

  async load(url) {
    return await this.fetchTopLevelDomainList(url)
  }

  async fetchTopLevelDomainList(url) {
    if (!url) {
      url = "https://data.iana.org/TLD/tlds-alpha-by-domain.txt"
    }

    const response = await fetch(url)
    const raw = await response.text()
    const lines = raw.toLowerCase().split("\n")

    this.topLevelDomainList = lines
      .map(line => line.trim())
      .filter(line => !line.match(/\s/g))

    return this.topLevelDomainList
  }

  isValid(email) {
    return this.validate(email)
  }

  validate(email) {
    if (this.topLevelDomainList.length === 0) {
      throw new Error(
        "Before using an `EmailValidator` instance's `validate` method, you must first ask it to download a current top-level domain list using its async `fetchTopLevelDomainList` method!"
      )
    }

    if (!isString(email)) {
      return false
    }

    email = email.toLowerCase()

    if (!email.includes("@")) {
      return false
    }

    const parts = email.split("@")

    if (parts.length > 2) {
      return false
    }

    const handle = parts[0].trim()
    const domain = parts[1].trim()

    if (handle.length === 0) {
      return false
    }

    if (handle.match(/\s/g)) {
      return false
    }

    if (domain.length === 0) {
      return false
    }

    if (!domain.includes(".")) {
      return false
    }

    const domainParts = domain.split(".")

    if (domainParts.some(part => part.trim().length === 0)) {
      return false
    }

    const domainName = domainParts
      .slice(0, domainParts.length - 1)
      .join(".")
      .trim()

    if (domainName[0] === "." || domainName[domainName.length - 1] === ".") {
      return false
    }

    if (domainName.match(/\s/g)) {
      return false
    }

    const extension = domainParts[domainParts.length - 1].trim()

    if (this.topLevelDomainList.indexOf(extension) < 0) {
      return false
    }

    return true
  }
}

if (typeof module !== "undefined") {
  module.exports = EmailValidator
}

if (typeof window !== "undefined") {
  window.EmailValidator = EmailValidator
}
