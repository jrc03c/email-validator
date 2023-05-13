const { execSync } = require("child_process")
const uglyFetch = require("./ugly-fetch")

test("tests that the `uglyFetch` function works as expected", async () => {
  const ipTrue = execSync("curl https://api.ipify.org", { encoding: "utf8" })
  const response = await uglyFetch("https://api.ipify.org")
  const ipPred = await response.text()
  expect(ipPred).toBe(ipTrue)
})
