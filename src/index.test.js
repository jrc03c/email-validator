const EmailValidator = require(".")

test("tests that the email validator works correctly", async () => {
  const validator = new EmailValidator()
  expect(validator.isReady).toBe(false)
  validator.isReady = true
  expect(validator.isReady).toBe(false)
  await validator.load()

  const items = [
    { email: "someone@example.com", shouldPass: true },
    { email: "s.o.m.e.o.n.e@e.x.a.m.p.l.e.com", shouldPass: true },
    { email: "someone+test@example.com", shouldPass: true },
    { email: "someone@example+test.com", shouldPass: true },
    { email: "someone@example", shouldPass: false },
    { email: "someone@雨.com", shouldPass: true },
    { email: "雨@example.com", shouldPass: true },
    { email: "雨@雨.雨", shouldPass: false },
    { email: "someone@1.2.3.4", shouldPass: false },
    { email: "@example.com", shouldPass: false },
    { email: "someone@", shouldPass: false },
    { email: "someone@example.thisshouldfail", shouldPass: false },
    { email: "someoneexamplecom", shouldPass: false },
    { email: "someone.example@com", shouldPass: false },
    { email: "someone@123.456.789", shouldPass: false },
    { email: "SOMEONE@EXAMPLE.COM", shouldPass: true },
    { email: "someone@.com", shouldPass: false },
    { email: "someone@example test.com", shouldPass: false },
  ]

  items.forEach(item => {
    expect(validator.validate(item.email)).toBe(item.shouldPass)
  })

  const wrongs = [
    0,
    1,
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    NaN,
    "foo",
    true,
    false,
    null,
    undefined,
    Symbol.for("Hello, world!"),
    [2, 3, 4],
    [
      [2, 3, 4],
      [5, 6, 7],
    ],
    x => x,
    function (x) {
      return x
    },
    { hello: "world" },
  ]

  wrongs.forEach(value => {
    expect(validator.isValid(value)).toBe(false)
    const temp = new EmailValidator()

    if (value instanceof Array) {
      temp.topLevelDomainList = value
      expect(temp.isReady).toBe(false)
    } else {
      expect(() => (temp.topLevelDomainList = value)).toThrow()
    }
  })
})
