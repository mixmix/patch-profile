# Patch-profile

A module for editing your (or other people's) profiles in patch-* family apps. Edits names or images.

You'll need to understand [depject](https://github.com/depject/depject) (a module for a different way of managing dependency injection), and for the example below, [depnest](https://github.com/depject/depnest) - a lazy way to write nested objects quickly.

## Example

```js
const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest('app.page.userEdit')

exports.needs = nest({
  'about.page.edit': 'first',
  'history.sync.push': 'first',
})

exports.create = (api) => {
  return nest('app.page.userEdit', userEdit)

  function userEdit (location) {
    // location is an object { feed, page: 'userEdit' } 

    const options = { feed: location.feed }
    const callback = (err, didEdit) => {
      if (err) throw new Error ('Error editing profile', err) 

      if (didEdit) console.log('Profile updated!')
      // go back to the users profile
      api.history.sync.push({ page: 'userShow', feed })
    }

    return h('Page -userEdit', {}, [
      h('div.container', [
        api.about.page.edit(options, callback)
      ])
    ])
  }
}
```


## API

## `about.page.edit`

`(options=object, callback=function)` 

Where `target` is of the form `{ feed='@....', labels=object }`

`labels` (optional) can be used to override labels for translations: `{ name, image, cancel, save }`
`callback` (optional) will be called after a user confirms or cancels changes. It has signature `(err, didEdit=boolean)`, where `didEdit == true` if an edit was published.


## `styles.mcss`

Patch-profile exports basic mcss styles. See Patchbay for examples of how this can be integrated into an app.

