<template>
  <div>
       <q-card class="q-cardGlass" >
       <q-card-section>
         <p class="q-pt-md text-center text-h5">Imagen de Fondo</p>
         <p class="text-caption text-center">(click en la imagen para subir foto)</p>
         <q-item class="column items-center" key="photo">
            <div class="text-center" @click="photoUpload = true">
            <div class=" column items-start" v-if="bgimage === null">
                <q-avatar rounded class="q-mb-sm" icon="insert_photo" color="secondary" font-size="50px" size="180px" text-color="white"></q-avatar></div>
            <div class="column items-start" v-else>
                <q-avatar rounded class="q-mb-sm shadow-5" size="180px" @click="photoUpload = true">
                    <q-img :src="bgimage.desktop"></q-img>
                </q-avatar></div>
                </div>
          </q-item>
       </q-card-section>
       <q-card-section class="column items-center">
          <q-btn color="primary" @click="saveMan()" no-caps rounded label="Guardar" />
       </q-card-section>
       </q-card>
    <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
      <q-card class="q-cardGlass">
        <q-card-section>
          <p>Formatos recomendados: <span class="text-bold">jpg y png</span></p>
          <p>Las imágenes son comprimidas antes de la carga, si su imagen es muy grande puede tardar unos segundos.</p>
          <p>Chopzi soporta imagenes con fondos transparentes, primero recortemos la imagen</p>
          <p v-if="$q.platform.is.mobile">Puedes mover la foto con el táctil y pinchar con dos dedos para acercar o alejar </p>
          <p v-else>Utilice el mouse y click para mover la imagen y la ruedita del mouse o los botones para hacer zoom</p>
        </q-card-section>
        <q-card-section class="column items-center relative-position">
          <div>
        <croppa class="col" v-model="myCroppa"
          :width="480"
          :height="270"
          placeholder="click aqui"
          placeholder-color="#FFF"
          :placeholder-font-size="16"
          canvas-color="transparent"
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
         <q-btn-group class="col q-ma-sm" push>
        <q-btn @click="$refs.croppa.zoomIn()" color="blue" no-caps>Acercar</q-btn>
        <q-btn @click="$refs.croppa.zoomOut()" color="blue" no-caps>Alejar</q-btn>
        <q-btn @click="$refs.croppa.rotate()" color="blue" no-caps>Rotar 90deg</q-btn>
        <q-btn @click="$refs.croppa.rotate(2)" color="blue" no-caps>Rotar 180deg</q-btn>
         </q-btn-group>
         <q-btn-group class="col q-ma-sm" push>
        <q-btn @click="$refs.croppa.rotate(-1)" color="green" no-caps>Rotar -90deg</q-btn>
        <q-btn @click="$refs.croppa.flipX()" color="green" no-caps>Espejo horizontal</q-btn>
        <q-btn @click="$refs.croppa.flipY()" color="green" no-caps>Espejo vertical</q-btn>
         </q-btn-group>
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
          :prefixPath="`/manifest/${ambiente}/Photos/`"
          myPath="something"
        />
        </q-card-section>
      </q-card>
    </q-dialog>
    </div>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { QUploaderBase } from 'quasar'
import imageCompression from 'browser-image-compression'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'
export default {
  name: 'saveBg',
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    'croppa': Croppa.component
  },
  data () {
    return {
      ambiente: localStorage.getItem('amb'),
      bgimage: null,
      showUploader: false,
      myCroppa: {},
      photoUpload: false
    }
  },
  mounted () {
    this.bindManifest().then(e => {
      console.log({ manifest: e }, 'Manifest')
      if (typeof e !== 'undefined' && e !== null && typeof e.bgimage !== 'undefined' && e.bgimage !== null) {
        Vue.set(this.bgimage, 'desktop', typeof e.bgimage && typeof e.bgimage.desktop !== 'undefined' ? e.bgimage.desktop : '')
        Vue.set(this.bgimage, 'mobile', typeof e.bgimage && typeof e.bgimage.mobile !== 'undefined' ? e.bgimage.mobile : '')
      }
    })
  },
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
  methods: {
    conss (e, y) {
      console.log(e, y)
    },
    resetPhotoType () {
      this.photoType = ''
    },
    uploadComplete (info) {
      try {
        this.bgimage = {}
        for (let i of info) {
          this.bgimage[i.file] = i.link
        }
        this.photoUpload = false
        this.$q.notify({
          message: `Foto cargada exitosamente, recuerde guardar los cambios`,
          color: 'positive'
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
    ...mapActions('config', ['bindEnv', 'bindManifest', 'saveManifest']),
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
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        name: 'desktop',
        fileType: file.type
      },
      {
        maxSizeMB: 1,
        name: 'mobile',
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: file.type
      }
      ]
      try {
        let files = []
        for (let opt of options) {
          let compressedFile = await imageCompression(imageFile, opt)
          compressedFile.lastModifiedDate = new Date()
          // let filename = compressedFile.lastModifiedDate.getTime()
          compressedFile.name = opt.name
          let filename = opt.name + '.' + ext
          compressedFile = new File([compressedFile], filename, {
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
    },
    async saveMan () {
      let saved = await this.saveManifest({
        bgimage: this.bgimage
      })
      if (saved) {
        this.$emit('saved')
      }
    }
  }
}
</script>
