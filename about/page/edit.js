const nest = require('depnest')
const dataurl = require('dataurl-')
const hyperfile = require('hyperfile')
const hypercrop = require('hypercrop')
const hyperlightbox = require('hyperlightbox')
const pull = require('pull-stream')
const { h, Value, computed, when } = require('mutant')

exports.gives = nest('about.page.edit')

exports.needs = nest({
  'about.html.image': 'first',
  'about.obs.name': 'first',
  'about.obs.description': 'first',
  'blob.sync.url': 'first',
  'message.async.publish': 'first',
  'sbot.async.addBlob': 'first'
})

const DEFAULT_LABELS = {
  avatar: 'Avatar',
  name: 'Name',
  description: 'Description',
  instructionCrop: 'Click and drag to crop your avatar',
  okay: 'Okay',
  save: 'Save',
  cancel: 'Cancel'
}

exports.create = (api) => {
  return nest({
    'about.page.edit': editPage
  })

  function editPage ({ feed, labels = {} }, callback) {
    const { avatar, name, description, instructionCrop, okay, save, cancel } = Object.assign({}, DEFAULT_LABELS, labels)

    const nameCurrent = api.about.obs.name(feed)
    const nameNew = Value()

    const descCurrent = api.about.obs.description(feed)
    const descNew = Value()

    var avatarCurrent = api.about.html.image(feed)
    const avatarNewData = Value()
    const avatarToDisplay = computed(avatarNewData, data => {
      return data
        ? h('img', { src: api.blob.sync.url(data.link) })
        : avatarCurrent
    })

    const canSave = Value(false) // computed

    var lightbox = hyperlightbox()

    return h('PatchProfileEdit', [
      h('section -avatar', [
        lightbox,
        h('header', avatar),

        h('div.input', [
          avatarToDisplay,
          hyperfile.asDataURL(dataUrlCallback)
        ])
      ]),
      h('section -name', [
        h('header', name),
        computed(nameCurrent, name => {
          return h('input', { value: name, 'ev-input': e => nameNew.set(e.target.value) })
        })
      ]),
      h('section -description', [
        h('header', description),
        computed(descCurrent, desc => {
          return h('textarea', { value: desc, 'ev-input': e => descNew.set(e.target.value) })
        })
      ]),
      h('div.actions', [
        h('Button', { 'ev-click': () => callback(null, false) }, cancel),
        h('Button -primary',
          {
            'ev-click': handleSave,
            className: when(canSave, '', '-disabled')
          }
          , save
        )
      ])
    ])

    function handleSave () {
      const msg = {
        type: 'about',
        about: feed,
        image: avatarNewData(),
        name: nameNew(),
        description: descNew(),
      }

      if (!msg.image || !msg.image.link) delete msg.image
      if (!msg.name) delete msg.name
      if (!msg.description) delete msg.description

      api.message.async.publish(msg, (err, data) => {
        if (err) return callback(err)

        callback(null, true)
      })
    }

    function dataUrlCallback (data) {
      const cropCallback = (err, cropData) => {
        if (err) throw err
        if (!cropData) return lightbox.close()

        var _data = dataurl.parse(cropData)
        api.sbot.async.addBlob(pull.once(_data.data), (err, hash) => {
          if (err) throw err // TODO check if this is safely caught by error catcher

          avatarNewData.set({
            link: hash,
            size: _data.data.length,
            type: _data.mimetype,
            width: 512,
            height: 512
          })
        })
        lightbox.close()
      }

      const cropEl = Crop(data, cropCallback)
      lightbox.show(cropEl)
    }

    function Crop (data, cb) {
      var img = h('img', {src: data})

      var crop = Value()

      waitForImg()

      return h('div.cropper', [
        crop,
        h('div.background')
      ])

      function waitForImg () {
        // WEIRDNESS - if you invoke hypecrop before img is ready,
        // the canvas instantiates and draws nothing

        if (!img.height && !img.width) {
          return window.setTimeout(waitForImg, 100)
        }

        var canvas = hypercrop(img)
        crop.set(
          h('PatchProfileCrop', [
            h('header', instructionCrop),
            canvas,
            h('section.actions', [
              h('Button', { 'ev-click': () => cb() }, cancel),
              h('Button -primary', { 'ev-click': () => cb(null, canvas.selection.toDataURL()) }, okay)
            ])
          ])
        )
      }
    }
  }
}
