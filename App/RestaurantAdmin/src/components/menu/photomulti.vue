<template>
  <div class="row">
    <q-img @click="opciones(index)" width="100px" v-for="(photo, index) in photoArray" :key="index" :src="photo" :class="{'selectedPhoto': index === photoindex}" />
    <q-card flat class="boxcontainer">
      <q-btn @click="photoUpload = true" color="blue" round icon="add" size="md" class="absolute-center"/>
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
          :width="300"
          :height="300"
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
          :prefixPath="`/Products/${ambiente}/Photos/`"
          myPath="something"
        />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="menuopciones">
      <q-card>
        <q-card-section class="row justify between">
        <q-btn label="Eliminar" color="red" @click="spliceArray()" v-close-popup />
        <q-btn label="Mover a la izquierda" color="blue" @click="moveArray(0)" />
        <q-btn label="Mover a la Derecha" color="blue" @click="moveArray(1)" />
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
  props: ['row'],
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
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    'croppa': Croppa.component
  },
  data () {
    return {
      menuopciones: false,
      photoindex: null,
      ambiente: localStorage.getItem('amb'),
      photoUpload: false,
      showUploader: false,
      myCroppa: {},
      photoArray: this.row ?? []
    }
  },
  watch: {
    photoArray (e) {
      this.$emit('updated', e)
    }
  },
  methods: {
    moveArray (position) {
      let arraylength = this.photoArray.length
      let oldindex = this.photoindex
      let oldvalue = this.photoArray[oldindex]
      if (position) {
        var newindex = oldindex + 1
      } else {
        newindex = oldindex - 1
      }
      if (!(newindex >= 0 && newindex <= (arraylength - 1))) {
        console.log('indice a mover no valido')
        return
      }
      let newvalue = this.photoArray[newindex]
      this.photoArray.splice(newindex, 1, oldvalue)
      this.photoArray.splice(oldindex, 1, newvalue)
      this.photoindex = newindex
    },
    spliceArray () {
      this.photoArray.splice(this.photoindex, 1)
    },
    opciones (index) {
      this.photoindex = index
      this.menuopciones = true
    },
    resetPhotoType () {
      this.photoType = ''
    },
    uploadComplete (info) {
      console.log('Upload complete', info)
      try {
        for (let i of info) {
          this.photoArray.push(i.link)
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
        maxWidthOrHeight: 400,
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
<style scoped lang="stylus">
.boxcontainer
  background-color transparent
  width 100px
  height 100px
.selectedPhoto
  background-color rgba(64, 163, 243,0.3)
</style>
