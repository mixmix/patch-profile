const nest = require('depnest')
const { h, Value, computed, map, when } = require('mutant')

exports.gives = nest('about.page.edit')

exports.needs = nest({
  'about.obs.groupedValues': 'first',
  'about.obs.image': 'first',
  'about.obs.name': 'first',
  'blob.sync.url': 'first',
})

const DEFAULT_LABELS = {
  name: 'Name',
  image: 'Image',
  save: 'Save',
  cancel: 'Cancel'
}

exports.create = (api) => {
  var _settings

  return nest({
    'about.page.edit': editPage,
  })

  function editPage ({ feed, labels={} }, callback) {
    const { name, image, save, cancel } = Object.assign({}, DEFAULT_LABELS, labels)

    const canSave = Value(false) // computed

    const names = computed(api.about.obs.groupedValues(feed, 'name'), Object.keys)
    const nameCurrent = api.about.obs.name(feed)



    const images = computed(api.about.obs.groupedValues(feed, 'image'), Object.keys)
    const imageCurrent = api.about.obs.image(feed, 'image')

    return h('PatchProfileEdit', [
      h('section.name', [
        h('header', name),
        map(names, name => h('div.name', name)),
        '+'
      ]),
      h('section.image', [
        h('header', image),
        map(images, blob => h('img', {src: api.blob.sync.url(blob)})),
        '+'
      ]),
      h('div.actions', [
        h('Button', { 'ev-click': () => callback(null, false) }, cancel),
        h('Button -primary', 
          { 
            'ev-click': () => callback(null, true),
            className: when(canSave, '', '-disabled')
          }
          , save
        )
      ])
    ])
  }
}
