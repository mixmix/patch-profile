const nest = require('depnest')

module.exports = {
  patchProfile: nest({
    'about.page.edit': require('./about/page/edit'),
    'styles.mcss': require('./styles/mcss')
  })
}

