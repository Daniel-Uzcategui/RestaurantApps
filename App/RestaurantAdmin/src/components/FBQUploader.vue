<script>
import { QUploaderBase } from 'quasar'
export default {
  name: 'FBQUploader',

  mixins: [ QUploaderBase ],
  props: {
    meta: {
      type: Object
    },
    menuPic: {
      type: Boolean,
      default: () => false
    },
    onlyLink: {
      type: Boolean,
      default: () => false
    },
    prefixPath: {
      type: String
    },
    document: {
      type: String
    },
    myPath: {
      type: String,
      default: 'none'
    }
  },
  computed: {
    // [REQUIRED]
    // we're working on uploading files
    isUploading () {
      return this.uploading
    },

    // [optional]
    // shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    isBusy () {
      return this.uploading
    }
  },

  data () {
    return {
      uploading: false,
      filesUploading: [],
      uploadedFl: [],
      links: []
    }
  },

  methods: {
    // Required for QUploaderBase. Will not be
    // used. Use of isBusy Overlay instead
    abort () {},

    updateComponent (index, snapshot, status = 'uploading') {
      const file = this.files[index],
        uploadSize = (typeof snapshot === 'object') ? snapshot.bytesTransferred : 0

      // QUploaderBase private method to update file progress
      this.__updateFile(file, status, uploadSize)
    },

    upload () {
      if (this.canUpload === false) {
        return
      }

      this.uploading = true
      // console.log('ques', this.queuedFiles)
      let upl = this.queuedFiles.map(async file => {
        // // console.log('qued', file)
        let ff = await this.uploadFileToFirestore(file)
        return ff
      })

      Promise.all(upl)
        .then(() => {
          this.uploading = false
          // const { meta } = this
          // const { userRef } = this.$fb
          // for (let i of this.uploadedFl) {
          //   if (i.name.startsWith('small_')) {
          //     // eslint-disable-next-line no-undef
          //     userRef(this.document, meta.photoType).set({ photosmall: i.link }, { merge: true })
          //   } else {
          //     userRef(this.document, meta.photoType).set({ photo: i.link }, { merge: true })
          //   }
          // }
          // console.log(JSON.stringify(this.uploadedFl), 'otrfsd', upl)
          // if (this.menuPic) {
          this.$emit('uploaded', this.uploadedFl)
          // }
          // // console.log('quetapasando', this.uploadedFiles)
        })
        .catch(err => {
          this.$q.notify({
            color: 'negative',
            message: `One or more of your files failed to upload. ${err}`
          })
        })
    },

    async uploadFileToFirestore (file) {
      // // console.log(file)
      // eslint-disable-next-line no-unused-vars
      const { meta } = this,
        { storageRef } = this.$fb,
        index = this.filesUploading.length,
        fileSuffix = file.type.split('/')[1],
        filePreffix = file.name.split('.')[0],
        uploadImageStorageRef = this.myPath === 'none' ? storageRef(`${this.prefixPath}${fileSuffix}`) : storageRef(`${this.prefixPath}${filePreffix}`),
        profileImageStorageRef = uploadImageStorageRef.put(file),
        STATE_CHANGED = this.$fb.self().storage.TaskEvent.STATE_CHANGED
      // // console.log({ file })
      return new Promise((resolve, reject) => {
        // Firebase UploadTask Event
        profileImageStorageRef.on(
          STATE_CHANGED,
          (snapshot) => {
            this.updateComponent(index, snapshot)
            // console.log(index, snapshot, 'iluminame')
          },
          (err) => {
            this.$q.notify({
              color: 'negative',
              message: `There was a problem with the upload. ${err}`
            })
            this.updateComponent(index, 0, 'failed')
            reject()
          },
          async () => {
            try {
              this.uploadedFiles = this.uploadedFiles.concat(this.files)
              this.queuedFiles = []
              this.filesUploading = []
              // // console.log(111)
              let cry = await this.files.reduce(async (x, y) => {
                this.updateComponent(index, 0, 'uploaded')
                // console.log(index)
                let link = await profileImageStorageRef.snapshot.ref.getDownloadURL()
                if (!this.links.includes(link)) {
                  this.links.push(link)
                  this.uploadedFl.push({ file: profileImageStorageRef.snapshot.metadata.name, link })
                  x.push({ file: profileImageStorageRef.snapshot.metadata.name, link })
                // // console.log(profileImageStorageRef.snapshot, 'snap')
                } else {
                  return x
                }

              // if (index === 1) {
              //   this.uploadedFl.push({ files: [ file.name ], link })
              //   // console.log('upl', this.uploadedFl)
              // }
              // // console.log({ doc: this.document, meta: meta.photoType, link })
              // if (!this.onlyLink) {
              //   if (this.myPath === 'none') {
              //     userRef(this.document, meta.photoType).update({ [`photo`]: link })
              //   } else {
              //     userRef(this.document, 'photo').set({ [filePreffix]: link }, { merge: true })
              //   }
              //   this.$emit('uploaded', { files: [ file.name ] })
              // } else {
              //   if (!this.menuPic) {
              //     this.$emit('uploaded', { files: [ file.name ], link })
              //   } else if (index === 1) {
              //     // this.uploadedFl.push({ files: [ file.name ], link })
              //     // // console.log('upl', this.uploadedFl)
              //   }
              // }
              }, [])
              resolve(cry)
            } catch (err) {
              console.error(err)
              throw err
            }
          }
        )
      })
    }
  }
}
</script>
