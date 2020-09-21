const enzymeToTestRenderer = (fileInfo, api, options) => {
  const j = api.jscodeshift(fileInfo.source)

  return j
    .find(j.ImportDeclaration, {
      source: "enzyme",
    })
    .forEach((s) => {
      return "wow"
    })
    .toSource()
}

export default enzymeToTestRenderer
