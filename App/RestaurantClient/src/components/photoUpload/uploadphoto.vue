<template>
  <div class="row">
    <q-dialog class="bg-transparent" :value="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
      <q-card class="q-cardGlass">
        <q-card-section>
          <p>Formatos recomendados: <span class="text-bold">jpg y png</span></p>
          <p>Las imágenes son comprimidas antes de la carga, si su imagen es muy grande puede tardar unos segundos.</p>
          <p v-if="$q.platform.is.mobile">Puedes mover la foto con el táctil y pinchar con dos dedos para acercar o alejar </p>
          <p v-else>Utilice el mouse y click para mover la imagen y la ruedita del mouse o los botones para hacer zoom</p>
        </q-card-section>
        <q-card-section class="column items-center relative-position">
          <div>
        <croppa v-model="myCroppa"
          :width="300"
          :height="300"
          placeholder="click aquí para subir foto"
          placeholder-color="#000"
          :placeholder-font-size="16"
          canvas-color="lightblue"
          :show-remove-button="true"
          remove-button-color="black"
          show-loading
          :quality="4"
          :loading-size="50"
          :loading-color="'#606060'"
          ref="croppa"
        />
          </div>
        <div class="col column items-center">
        <q-btn rounded class="col q-ma-sm" @click="croppaPic()" color="blue" no-caps>Subir Foto</q-btn>

        </div>
        <fbq-uploader
          v-show="showUploader"
          ref="fbq"
          @failed="(e) => conss(e, 'failed')"
          @finish="(e) => conss(e, 'Finish')"
          multiple
          noThumbnails
          onlyLink
          menuPic
          autoUpload
          class="q-my-lg absolute-center"
          label=""
          :meta="meta"
          @uploaded="(e) => {uploadComplete(e)}"
          document='menu'
          :prefixPath="`/Pagos/${ambiente}/Photos/`"
          myPath="something"
        />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { QUploaderBase } from 'quasar'
import imageCompression from 'browser-image-compression'
import { mapGetters } from 'vuex'
import Croppa from 'vue-croppa'
export default {
  name: 'multiphoto',
  props: ['row', 'photoUpload'],
  mixins: [ QUploaderBase ],
  computed: {
    ...mapGetters('user', ['currentUser']),
    meta () {
      if (!(this.currentUser && this.currentUser.id)) {
        return {
          id: '',
          photoType: this.photoType
        }
      }
      return {
        id: this.currentUser.id,
        photoType: this.photoType
      }
    }
  },
  components: {
    'fbq-uploader': () => import('./FBQUploader.vue'),
    'croppa': Croppa.component
  },
  data () {
    return {
      menuopciones: false,
      photoindex: null,
      ambiente: localStorage.getItem('amb'),
      showUploader: false,
      myCroppa: {},
      photoArray: this.row ?? ''
    }
  },
  watch: {
    photoArray (e) {
      this.$emit('updated', e)
    }
  },
  methods: {
    resetPhotoType () {
      this.photoType = ''
    },
    uploadComplete (info) {
      console.log('Upload complete', info)
      try {
        for (let i of info) {
          this.photoArray = i.link
        }
        // this.photoUpload = false
        this.$q.notify({
          message: `Foto cargada exitosamente`,
          color: 'green'
        })
        this.showUploader = false
      } catch (error) {
        this.showUploader = false
        console.error(error)
        this.$q.notify({
          message: `Oops hubo un error subiendo el archivo`,
          color: 'red'
        })
      } finally {
        this.$forceUpdate()
        console.log(this.appicons)
      }
    },
    conss () {},
    async croppaPic () {
      let file = this.$refs.croppa.getChosenFile()
      let blob = await this.$refs.croppa.promisedBlob(file.type)
      let imageFile = blob
      var re = /(?:\.([^.]+))?$/
      var ext = re.exec(file.name)[1]
      // // console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
      // // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)
      var options = [{
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: file.type
      }]
      try {
        let files = []
        for (let opt of options) {
          let compressedFile = await imageCompression(imageFile, opt)
          compressedFile.lastModifiedDate = new Date()
          let filename = compressedFile.lastModifiedDate.getTime()
          compressedFile.name = filename + ext
          compressedFile = new File([compressedFile], filename + ext, {
            type: file.type
          })
          files.push(compressedFile)
        }
        console.log(files, 'tha files')
        this.$refs.fbq.addFiles(files) // write your own logic
      } catch (error) {
        console.log(error)
        this.$q.notify({ message: 'Error en el archivo' })
        return
      }
      this.showUploader = true
    }
  }
}
</script>
<style lang="stylus">
.boxcontainer
  background-color transparent
  width 100px
  height 100px
.selectedPhoto
  background-color rgba(64, 163, 243,0.3)
// .croppa-container {
//    background-color: lightblue;
//    border: 2px solid grey;
//    border-radius: 8px;
//    overflow: hidden;
//    position relative
//  }
// .icon-remove {
//   position absolute
//   top 0
//   right 0
//   z-index 99999999
//   }
</style>
