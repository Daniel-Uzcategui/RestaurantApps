<template>
  <div>
       <q-card class="q-cardGlass" >
       <q-card-section>
       <q-input filled rounded placeholder="Nombre de su empresa" v-model="app_name" @input="(e) => app_short_name = e" label="Nombre de su empresa" />
       <q-input class="q-pt-md" type="textarea" filled rounded placeholder="Descripción" v-model="app_description" label="Descripción" />
       <q-input class="q-pt-md" type="textarea" filled rounded placeholder="keywords" v-model="keywords" label="Palabras Clave (Keywords)"
        />
        <p class="text-caption q-pa-xs">Palabras Clave separadas por coma, ellas identifican tu empresa por ejemplo: comida, retaurante, tacos. Esto ayuda a que las personas encuentren tu pagina por buscadores</p>
         <p class="q-pt-md text-center text-h5">Logo de Marca</p>
         <p class="text-caption text-center">(click en la imagen para subir foto)</p>
         <q-item class="column items-center" key="photo">
            <div class="text-center" @click="photoUpload = true">
            <div class=" column items-start" v-if="appicons.icon512x512 === ''">
                <q-avatar rounded class="q-mb-sm" icon="insert_photo" color="secondary" font-size="50px" size="180px" ></q-avatar></div>
            <div class="column items-start" v-else>
                <q-avatar rounded class="q-mb-sm shadow-5" size="180px" @click="photoUpload = true">
                    <q-img :src="appicons.icon512x512"></q-img>
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
                :width="resizableW"
                :height="resizableH"
                placeholder="click aqui"
                placeholder-color="#FFF"
                :placeholder-font-size="16"
                canvas-color="transparent"
                :show-remove-button="true"
                @file-choose="newimg"
                remove-button-color="black"
                show-loading
                :quality="4"
                :loading-size="50"
                :loading-color="'#606060'"
                ref="croppa"
              />
          </div>
        <div class="col column items-center">
          <div class="col full-width">
            <q-badge color="secondary">
              Ancho
            </q-badge>
            <q-slider v-model="resizableW" :min="10" :max="300"/>
            <q-badge color="secondary">
              Largo
            </q-badge>
            <q-slider v-model="resizableH" :min="10" :max="300"/>
          </div>
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
         <q-btn color="white" text-color="black" label="Standard" @click="newimg()" />

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
  name: 'savemanifest',
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    'croppa': Croppa.component
  },
  data () {
    return {
      resizableW: 300,
      resizableH: 300,
      ambiente: localStorage.getItem('amb'),
      photoUpload: false,
      showUploader: false,
      myCroppa: {},
      app_name: '',
      app_short_name: '',
      app_description: '',
      img: null,
      keywords: '',
      app_display: 'fullscreen',
      appicons: {
        favicon: '',
        icon128x128: '',
        icon192x192: '',
        icon256x256: '',
        icon384x384: '',
        icon512x512: ''
      }
    }
  },
  mounted () {
    this.bindManifest().then(e => {
      console.log({ manifest: e }, 'Manifest')
      if (typeof e !== 'undefined' && e !== null) {
        this.app_name = typeof e.name !== 'undefined' ? e.name : ''
        this.app_short_name = typeof e.short_name !== 'undefined' ? e.name : ''
        this.app_description = typeof e.description !== 'undefined' ? e.description : ''
        this.keywords = typeof e.keywords !== 'undefined' ? e.keywords : ''
        this.app_display = typeof e.display !== 'undefined' ? e.display : 'fullscreen'
        Vue.set(this.appicons, 'favicon', typeof e.icons && typeof e.icons.favicon !== 'undefined' ? e.icons.favicon : '')
        Vue.set(this.appicons, 'icon128x128', typeof e.icons && typeof e.icons.icon128x128 !== 'undefined' ? e.icons.icon128x128 : '')
        Vue.set(this.appicons, 'icon192x192', typeof e.icons && typeof e.icons.icon192x192 !== 'undefined' ? e.icons.icon192x192 : '')
        Vue.set(this.appicons, 'icon256x256', typeof e.icons && typeof e.icons.icon256x256 !== 'undefined' ? e.icons.icon256x256 : '')
        Vue.set(this.appicons, 'icon384x384', typeof e.icons && typeof e.icons.icon384x384 !== 'undefined' ? e.icons.icon384x384 : '')
        Vue.set(this.appicons, 'icon512x512', typeof e.icons && typeof e.icons.icon512x512 !== 'undefined' ? e.icons.icon512x512 : '')
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
    async newimg (e) {
      let file = this.$refs.croppa.generateDataUrl()
      this.img = new Image()
      this.img.src = file
      console.log('new img', e)
    },
    conss (e, y) {
      console.log(e, y)
    },
    resetPhotoType () {
      this.photoType = ''
    },
    uploadComplete (info) {
      console.log('Upload complete', info)
      try {
        for (let i of info) {
          this.appicons[i.file] = i.link
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
        maxWidthOrHeight: 32,
        useWebWorker: true,
        fileType: 'image/ico'
      },
      {
        maxSizeMB: 1,
        maxWidthOrHeight: 128,
        useWebWorker: true,
        fileType: file.type
      },
      {
        maxSizeMB: 1,
        maxWidthOrHeight: 192,
        useWebWorker: true,
        fileType: file.type
      },
      {
        maxSizeMB: 1,
        maxWidthOrHeight: 256,
        useWebWorker: true,
        fileType: file.type
      },
      {
        maxSizeMB: 1,
        maxWidthOrHeight: 384,
        useWebWorker: true,
        fileType: file.type
      },
      {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: file.type
      }]
      try {
        let files = []
        for (let opt of options) {
          let compressedFile = await imageCompression(imageFile, opt)
          compressedFile.lastModifiedDate = new Date()
          // let filename = compressedFile.lastModifiedDate.getTime()
          compressedFile.name = 'icon' + opt.maxWidthOrHeight
          if (opt.fileType === 'image/ico') {
            var filename = 'favicon.ico'
          } else {
            filename = 'icon' + opt.maxWidthOrHeight + 'x' + opt.maxWidthOrHeight + '.' + ext
          }
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
        'name': this.app_name,
        'short_name': this.app_short_name,
        'description': this.app_description,
        'display': this.app_display,
        'keywords': this.keywords,
        'start_url': '.',
        'icons': {
          favicon: this.appicons.favicon,
          icon128x128: this.appicons.icon128x128,
          icon192x192: this.appicons.icon192x192,
          icon256x256: this.appicons.icon256x256,
          icon384x384: this.appicons.icon384x384,
          icon512x512: this.appicons.icon512x512
        },
        'orientation': 'portrait',
        'background_color': '#ffffff',
        'theme_color': '#027be3'
      })
      if (saved) {
        this.$emit('saved')
      }
    }
  }
}
</script>
