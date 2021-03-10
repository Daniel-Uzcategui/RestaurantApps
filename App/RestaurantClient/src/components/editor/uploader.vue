<template>
<div>
  <div class="q-ma-md column items-center">
    <q-img :src="value ? value : 'https://cdn.quasar.dev/img/parallax2.jpg'" @click="dialogUpl = true"  style="max-width: 200px" />
    <p> Click en la foto para editar</p>
  </div>
  <q-dialog v-model="dialogUpl">

  <q-card class="q-cardGlass">
        <q-card-section>
          <p>Formatos recomendados: <span class="text-bold">jpg y png</span></p>
          <p>{{more}}</p>
          <p>Las imágenes son comprimidas antes de la carga, si su imagen es muy grande puede tardar unos segundos.</p>
          <p>Chopzi soporta imagenes con fondos transparentes</p>
          <p v-if="$q.platform.is.mobile">Puedes mover la foto con el táctil y pinchar con dos dedos para acercar o alejar </p>
          <p v-else>Utilice el mouse y click para mover la imagen y la ruedita del mouse o los botones para hacer zoom</p>
        </q-card-section>
        <q-card-section class="column items-center relative-position">
          <div>
        <croppa class="col" v-model="myCroppa"
          :width="width"
          :height="height"
          placeholder="click aqui"
          placeholder-color="#000"
          :placeholder-font-size="16"
          canvas-color="transparent"
          :show-remove-button="true"
          remove-button-color="black"
          show-loading
          :quality="quality"
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
          document="images"
          prefixPath="/Editor/images/"
          myPath="something"
        />
        </q-card-section>
      </q-card>
  </q-dialog>
</div>
</template>
<script>
import Croppa from 'vue-croppa'
import { QUploaderBase } from 'quasar'
import imageCompression from 'browser-image-compression'
import 'vue-croppa/dist/vue-croppa.css'
export default {
  mixins: [ QUploaderBase ],
  props: ['value', 'height', 'width', 'quality', 'background', 'more'],
  components: {
    'fbq-uploader': () => import('./FBQUploader.vue'),
    'croppa': Croppa.component
  },
  data () {
    return {
      meta: { id: '123', photoType: '123' },
      showUploader: false,
      myCroppa: {},
      dialogUpl: false
    }
  },
  methods: {
    conss (e, y) {
      console.log(e, y)
    },
    uploadComplete (info) {
      console.log({ info })
      try {
        if (info.length > 1) {
          this.$emit('input', info)
          this.$q.notify({
            message: `Foto cargada exitosamente, recuerde guardar los cambios`,
            color: 'positive'
          })
          this.showUploader = false
          return
        }
        for (let i of info) {
          this.$emit('input', i.link)
          this.$q.notify({
            message: `Foto cargada exitosamente, recuerde guardar los cambios`,
            color: 'positive'
          })
        }
        this.showUploader = false
      } catch (error) {
        this.showUploader = false
        console.error(error)
        this.$q.notify({
          message: `Oops hubo un error subiendo el archivo`,
          color: 'red'
        })
      }
    },
    async croppaPic () {
      let file = this.$refs.croppa.getChosenFile()
      let blob = await this.$refs.croppa.promisedBlob(file.type)
      console.log(file, 'FILEEEEEE')
      let imageFile = blob
      var re = /(?:\.([^.]+))?$/
      var ext = re.exec(file.name)[1]
      // // console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
      // // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)

      var options = {
        maxSizeMB: 1,
        maxWidthOrHeight: this.width * 5,
        useWebWorker: true,
        fileType: file.type
      }
      var options2 = {
        maxSizeMB: 1,
        maxWidthOrHeight: this.width * 2,
        useWebWorker: true,
        fileType: file.type
      }
      try {
        let files
        let compressedFile = await imageCompression(imageFile, options)
        compressedFile.lastModifiedDate = new Date()
        let filename = compressedFile.lastModifiedDate.getTime()
        compressedFile.name = file.name
        compressedFile = new File([compressedFile], filename + '.' + ext, {
          type: file.type
        })
        if (this.background) {
          let compressedFile2 = await imageCompression(imageFile, options2)
          compressedFile2.lastModifiedDate = new Date()
          compressedFile2.name = 'small_' + file.name
          compressedFile2 = new File([compressedFile2], 'small_' + filename + '.' + ext, {
            type: file.type
          })
          files = [compressedFile, compressedFile2]
        } else {
          files = [compressedFile]
        }
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
