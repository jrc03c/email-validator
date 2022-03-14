const emailValidator = require(".")

test("", () => {
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

  emailValidator.fetchTopLevelDomainList().then(() => {
    items.forEach(item => {
      expect(emailValidator.validate(item.email)).toBe(item.shouldPass)
    })
  })
})
