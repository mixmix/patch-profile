const nest = require('depnest')

exports.gives = nest('styles.mcss')

const editMcss = `
PatchProfileEdit {
  padding: 1rem
  background-color: #fff

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

    -avatar {
      $LightBox

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
  header {
    font-weight: 600
    margin-bottom: .5rem
  }

  canvas { 
    margin: 0 auto 1rem 0
    width: 100%
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

$LightBox {
  div.lightbox {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 50px;
    overflow: auto;
    width: 780px;
    max-width: 100%;
    padding: 25px;
    margin: auto;
    z-index: 2;
    background: #f5f5f5;
    border: 1px solid #eee;
    border-radius: .2em;
  }

}
`

exports.create = (api) => {
  return nest('styles.mcss', mcss)

  function mcss (sofar = {}) {
    sofar['patchProfile.about.page.edit'] = editMcss

    return sofar
  }
}
