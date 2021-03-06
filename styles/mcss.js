const nest = require('depnest')

exports.gives = nest('styles.mcss')

const editMcss = `
PatchProfileEdit {
  padding: 1rem
  background-color: #fff

  position: relative

  section {
    margin-bottom: 2rem
    header {
      font-weight: 600
      margin-bottom: 1rem
    }

    display: flex
    flex-direction: column
    
    -name {
      input { 
        font-size: 1.2rem

        padding: .5rem 
      }
    }

    -description {
      textarea { 
        font-size: 1.2rem

        padding: .5rem 
      }
    }

    -avatar {
      div.lightbox {
        div.lightbox__content {
          div.cropper {
            div.PatchProfileCrop {}
            div.background {
              position: fixed
              z-index: 98
              top: 0
              left: 0

              width: 100%
              height: 100%
              background-color: rgba(0, 0, 0, 0.5)
            }
          }
        }
      }

      div.input {
        $PatchProfileImageSize
        position: relative

        img {
          $PatchProfileImageSize
        }

        input[type="file"] {
          color: transparent

          ::-webkit-file-upload-button {
            visibility: hidden
          }

          ::before {
            $PatchProfileImageSize
            position: absolute
            top: 0
            display: flex
            justify-content: center
            align-items: center

            font-size: 4rem
            color: #fff
            text-shadow: black 0 0 10px

            transition: all .5s ease


            cursor: pointer
            content: '+'
            font-size: 4rem

            outline: none
            white-space: nowrap
            -webkit-user-select: none
          }
          :hover {
            ::before {
              text-shadow: #000 0 0 18px
              background: rgba(0,0,0,.3)
              box-shadow: inset rgba(0, 0, 0, 0.62) 0 0 20px
            }
          }

          :active, :focus {
            outline: none
            box-shadow: none
          }
        }
      }
    }
  }

  div.actions {
    margin-top: 2rem
    display: flex
    justify-content: space-between
  }
}

PatchProfileCrop {
  background: #f5f5f5

  position: absolute
  z-index: 99
  top: 0
  left: 0
  right: 0

  overflow: auto
  max-width: 100%
  padding: 1rem
  margin: auto
  border: 1px solid #eee
  border-radius: .2em

  header {
    font-weight: 600
    margin-bottom: .5rem
  }

  canvas { 
    margin: 0 auto 1rem auto
    max-height: 70vh
    max-width: 100%
  }

  section.actions {
    display: flex
    justify-content: space-between
  }
}

$PatchProfileImageSize {
  width: 20rem
  height: 20rem
}

`

exports.create = (api) => {
  return nest('styles.mcss', mcss)

  function mcss (sofar = {}) {
    sofar['patchProfile.about.page.edit'] = editMcss

    return sofar
  }
}
