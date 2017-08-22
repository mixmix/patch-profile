const nest = require('depnest')

exports.gives = nest('styles.mcss')

const editMcss = `
PatchProfileEdit {
  section.name {
    margin-bottom: 1rem

    div.name{ 
      margin-right: .5rem
    }
  }
  section.image {
    margin-bottom: 1rem
    img {
      max-width: 4rem
      max-height: 4rem
      margin-right: .5rem
    }
  }

  div.actions {}
}
`

exports.create = (api) => {
  return nest('styles.mcss', mcss)

  function mcss (sofar = {}) {
    sofar['patchProfile.about.page.edit'] = editMcss

    return sofar
  }
}

