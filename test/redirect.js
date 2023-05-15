function getRedirects(input) {
  const normalArgs = []
  const pattern = /(>[\s]*[^>\s]*[\s]*)/gm
  let redirects = input.match(pattern) ?? []
  if (redirects.length > 0) {
    redirects = redirects.map((elem) => elem.substring(1).trim())
  }
  const args = input.replace(pattern, ' ').split(" ").filter(elem => elem.length > 0)
  console.log(args)
  return { args, redirects }
}

getRedirects('echo hello >out.ts> hello.tx world')
getRedirects(' hello       world')
getRedirects('')
