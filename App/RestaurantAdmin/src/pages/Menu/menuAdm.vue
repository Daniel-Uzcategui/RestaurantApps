<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
    <!-- :grid="$q.screen.lt.md" -->
   <q-table
      style="border-radius: 28px"
      :dense="$q.screen.lt.md"
      :data="elmenu"
      grid
      :columns="columns"
      :rows-per-page-options="[20, 30, 0]"
      row-key="id"
      ref="table"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No se encontraron registros"
    >
    <template v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      {{menucfg.dispName ? menucfg.dispName : 'Productos'}}
      <q-btn flat icon="edit" @click="promptNombre()" />
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
      <q-toggle v-if="quick && false" @input="(e) => saved3(e, menucfg.iconsactive, 'menu', 'iconsactive')" color="warning"
                :value="menucfg.iconsactive ? true : false" label="Activar iconos" left-label />
      <q-toggle v-if="quick && false" @input="(e) => saved3(e, menucfg.menuactive, 'menu', 'menuactive')" color="warning"
                :value="menucfg.menuactive ? true : false" label="Mostrar en la App" left-label />
      <div class="q-pa-md">
      <q-select options-selected-class="text-blue" filled rounded dense
        v-model="sede"
        :options="locList"
        style="width: 250px"
        emit-value
        map-options
        stack-label
        label="Seleccionar Sede"
      />
      </div>
        <q-btn-group flat push v-if="sede !== null && $q.screen.gt.xs">
          <q-btn push no-caps label="Agregar" color="blue" icon="add" @click="addrow"/>
          <q-btn push color="blue" no-caps label="Eliminar" icon="delete_outline" @click="softDelete"/>
          <!-- <q-btn flat icon="visibility" no-caps label="Vista en Cliente" @click="preview = !preview" /> -->
          <q-btn push color="blue" icon="visibility" type="a" :href="'https://' + amb + '.chopzi.com/#/menu/index'" no-caps label="Vista en Cliente" target="_blank" />
        </q-btn-group>
        <q-input filled dense  v-if="sede !== null" class="q-ma-md" style="min-width: 250px" v-model="searchBar" rounded outlined label="Buscar" >
          <template v-slot:prepend>
          <q-icon name="fas fa-search"/>
        </template>
        </q-input>
        <q-select options-selected-class="text-blue" filled rounded dense
         v-if="sede !== null"
          v-model="category"
          clearable
          :options="categorias"
          style="width: 250px"
          :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
          :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.id"
          emit-value
          map-options
          stack-label
          label="Filtrar por Categoría"
         />
      </template>
    <template v-slot:item="props">
        <div v-if="sede !== null" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-m-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section class="column items-start" key="photo" :props="props">
                  <div class="row justify-between no-wrap full-width">
                  <div style="min-width: 50px" class="text-center col-2 self-center" @click.stop="showPhotoUpload(props.row.id, props.row)">
                  <div class=" column items-start" v-if="showDefaultPhoto(props.row.photo)">
                      <q-avatar round class="q-mb-sm" icon="insert_photo" color="secondary" font-size="38px" size="50px" text-color="white"></q-avatar></div>
                  <div class="column items-start" v-else>
                      <q-avatar round class="q-mb-sm shadow-5" size="50px" @click.stop="showPhotoUpload(props.row.id, props.row)">
                          <q-img :src="props.row.photosmall ? props.row.photosmall : props.row.photo"></q-img>
                      </q-avatar></div>
                      </div>
                  <q-item-label class="col-5 self-center">{{props.row.name ? props.row.name: 'Nuevo Producto'}}</q-item-label>
                  <q-icon
                    @click.stop="(e) => {saved(
                        typeof props.row.estatus === 'undefined' ? { [sede]: true } : {...props.row.estatus,[sede]: !props.row.estatus[sede] },
                          props.row.estatus, props.row.id,
                          `estatus`);
                        typeof props.row.estatus === 'undefined' ? (props.row.estatus = [],props.row.estatus[sede] = true) : props.row.estatus[sede] = !props.row.estatus[sede]
                        }"
                      :color="props.row.estatus ? props.row.estatus[sede] ? 'blue' : 'red' : 'red'"
                   style="min-width: 25px" class="col-1 self-center full-height" size="md" :name="props.row.estatus ? props.row.estatus[sede] ? 'toggle_on' : 'toggle_off' : 'toggle_off'" />
                  <q-item-label class="col-3 self-center text-right" :style="$q.screen.lt.md ? 'max-width: 200px' : ''" caption>{{(props.row.price).toFixed(2)}}</q-item-label>
                  <q-btn class="col-1 self-center" flat push rounded icon="edit" @click.stop="props.expand = !props.expand; props.row.categoria ? selectedProdCat = props.row.categoria  : ''" />
                  </div>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
        </q-list>
          <q-dialog class="bg-transparent" v-model="props.expand">
            <q-list class="q-diag-glassMorph">
              <q-item class="column items-center">
                <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
              </q-item>
          <q-item class="column items-center" key="photo" :props="props">
            <p class="text-bold col-6">Foto primaria</p>
            <div class="text-center" @click="showPhotoUpload(props.row.id, props.row)">
            <div class=" column items-start" v-if="showDefaultPhoto(props.row.photo)">
                <q-avatar round class="q-mb-sm" icon="insert_photo" color="secondary" font-size="50px" size="180px" text-color="white"></q-avatar></div>
            <div class="column items-start" v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(props.row.id, props.row)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar></div>
                </div>
          </q-item>
          <q-item  :props="props">
                  <p class="text-bold">Activar</p>
                  <q-toggle
                      @input="(e) => {saved(
                        typeof props.row.estatus === 'undefined' ? { [sede]: e } : {...props.row.estatus,[sede]: e },
                          props.row.estatus, props.row.id,
                          `estatus`);
                        typeof props.row.estatus === 'undefined' ? (props.row.estatus = [],props.row.estatus[sede] = e) : props.row.estatus[sede] = e
                        }"
                      :value="props.row.estatus ? props.row.estatus[sede] ? true : false : false"
                      color="blue"
                    />
              </q-item>
          <q-item  :props="props" key="photomulti" class="column items-start">
            <div class="row justify-start">
                  <p class="text-bold col-6">Múltiples fotos</p>
                  <q-btn class="col-4" flat color="white" push icon="help">
                    <q-tooltip anchor="center right" self="center left">
                      <strong :class="{ 'text-h5': $q.screen.gt.xs }">Las fotos que montes aqui se mostrarán en el dialogo cuando un usuario le de click a tu producto, si quieres mostrar la foto primaria también, tendras que volverla a subir aquí, luego de subirlas puedes darle click para cambiar el orden o eliminar
                      </strong>
                    </q-tooltip>
                  </q-btn>
            </div>
                  <photomulti :row="props.row.photomulti" @updated="(e) => {saved(e, props.row.photomulti, props.row.id, 'photomulti'); props.row.photomulti = e}" />
              </q-item>
          <q-item class="column items-start" key="name" :props="props">
            <div class="col-12 label-expand">Nombre</div>
              <q-input filled dense
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              v-model="props.row.name"
              rounded
              class="col-12 full-width"
              outlined />
          </q-item>
          <q-item class="column items-start" key="categoria" :props="props">
            <q-td><label class="label-expand">Categorías</label></q-td>
              <q-select options-selected-class="text-blue" filled rounded dense
                v-model="prodCategory"
                @input="(e) => saved(selectedProdCat, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                class="col-12"
                multiple
                input-debounce="0"
                :options="categorias"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item"
                map-options
                emit-value
                stack-label
              >
              <template v-slot:append>
          <q-icon
            name="add"
            class="cursor-pointer"
            @click.stop.prevent="addcat = !addcat"
          />
        </template>
              </q-select>
          </q-item>
           <q-item class="column items-start" key="groupComp" :props="props">
             <div class="label-expand full-width row justify-between">
               <div class="text-h6">Grupos de Opciones</div>
               <q-btn
               rounded
                    label="Añadir"
                    color="blue"
                    no-caps
                    class="cursor-pointer"
                    @click="addopt = !addopt; propass = props"
                  />
             </div>

              <q-list>
               <q-item v-for="(item, index) in props.row.groupComp" :key="index">
                 <div>
                    <q-chip class="glossy" removable clickable @click="addoptView = true; viewId = getCompVal(item, 'group_id')" @remove="(e) => saved(delCompVal(props.row.groupComp, item), props.row.groupComp, props.row.id, 'groupComp')" color="green" text-color="white" icon="filter_frames">
                       {{getCompVal(item, 'name')}}
                    </q-chip>
                 </div>
               </q-item>
             </q-list>
          </q-item>
              <q-item class="column items-start"  :props="props">
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col" key="descripcion" :props="props">
                    <q-editor content-class="bg-blue-6"
                      :definitions="definitions" :toolbar="toolbar"
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      v-model="props.row.descripcion"
                      ref="editor_ref"
                      @paste.native="evt => pasteCapture(evt)"
                      min-height="5rem"
                      :content-style="{color: props.row.descripcioncolor}"

                    />
                          <q-dialog v-model="colorText">
                            <q-card class="q-cardGlass">
                              <q-card-section>
                                <p class="text-bold q-ma-md">Color del texto</p>
                                <q-color
                                v-model="props.row.descripcioncolor"
                                @input="(e) => saved(e, props.row.descripcioncolor, props.row.id, 'descripcioncolor')"
                                default-view="palette"
                                format-model="rgba"
                                :palette="[
                                  '#019A9D', '#D9B801', '#E8045A', '#B2028A',
                                  '#2A0449', '#019A9D'
                                ]"
                                class="my-picker"
                              />
                              </q-card-section>
                            </q-card>
                          </q-dialog>
                </q-td>
              </q-item>
              <q-item class="row justify-center"  :props="props">
                  <div class="col-6 q-pa-xs">
                    <p class="text-bold">Stock <span class="text-caption">(Cantidad disponible para venta) </span></p>
                    <q-input filled dense
                      rounded
                      outlined
                      @input="(e) => {saved(typeof props.row.stock === 'undefined' ? { [sede]: parseInt(e) } : {...props.row.stock,[sede]: parseInt(e) }, parseInt(props.row.stock), props.row.id, `stock`);
                        typeof props.row.stock === 'undefined' ? (props.row.stock = {},props.row.stock[sede] = e) : props.row.stock[sede] = e
                        }"
                      :value="props.row.stock ? props.row.stock[sede] : 0"
                      min="1" max="99999"
                      type="number"
                    />
                  </div>
                  <div class="col-6 q-pa-xs">
                    <p class="text-bold">Descuento</p>
                    <q-input filled dense
                      rounded
                      outlined
                      @input="(e) => saved(e, parseInt(props.row.discount), props.row.id, 'discount')"
                      v-model="props.row.discount"
                      label="%"
                      min="0" max="100"
                      type="number"
                    />
                  </div>
              </q-item>
              <q-item class="row justify-center"  :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Precio</p>
                  <q-decimal
                  dense
                  filled
                  :rules="[validate]"
                  rounded
                  outlined @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                  v-model="props.row.price"
                  input-style="text-align: right">
                  </q-decimal>
                </div>
                <div class="col-6 q-pa-xs">
                  <p class="text-bold">Prioridad</p>
                  <q-input filled dense
                  rounded
                  outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
                  v-model="props.row.priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
              <q-item class="column items-start" key="pricerange" :props="props">
                <div class="col-12 label-expand">Solapar precio</div>
                <div class="col-12 row justify-start">
                  <q-input filled dense
                  @input="(e) => saved(e, props.row.pricerange, props.row.id, 'pricerange')"
                  v-model="props.row.pricerange"
                  rounded
                  class="col-8"
                  outlined />
                  <q-btn class="col-4" flat color="white" push icon="help">
                    <q-tooltip anchor="center right" self="center left">
                      <strong :class="{ 'text-h5': $q.screen.gt.xs }">Este texto, sobreescribe el precio que el cliente ve en el menu, el mejor caso de uso
                        es para productos que tienen rangos de precios, variando las opciones seleccionadas.
                      </strong>
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-item>
              <q-item class="row justify-center"  :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Tipo de Display <span class="text-caption"> (Tenemos dos maneras de mostrar tu producto al cliente, activalos y mira como se ven en el cliente) </span></p>
                  <q-radio color="blue" v-model="props.row.disptype" @input="(e) => saved(e, parseInt(props.row.disptype), props.row.id, `disptype`)" :val="0" label="A" />
                  <q-radio color="red" v-model="props.row.disptype" @input="(e) => saved(e, parseInt(props.row.disptype), props.row.id, `disptype`)" :val="1" label="B" />
                </div>
              </q-item>
              <q-item class="column items-center">
                <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
              </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template>
    </q-table>
    <q-dialog
     v-model="addcat"
      full-width
      >
      <AddCat :isDiag="true" class="q-diag-glassMorph" />
    </q-dialog>
    <q-dialog
     v-model="addopt"
      >
      <div class="column items-start q-cardGlass q-ma-lg q-pa-lg" v-if="addopt">
        <div class="text-h6 q-mb-md">Grupos Existentes</div>
      <q-select options-selected-class="text-blue" filled rounded dense
                v-model="tempOpt"
                class="full-width q-ma-md"
                :options="groupCompFilter()"
                multiple
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                map-options
                emit-value
                stack-label
              />
      <div class="row justify-between full-width q-mt-md">
      <q-btn rounded label="Crear Nuevo" class="q-mr-md" @click="addopt = false; addopt2 = true" color="green" no-caps></q-btn>
      <q-btn rounded label="Agregar" color="blue" @click="tempOpt ? (addNewOpts(), addopt = false) : null" no-caps></q-btn>
      </div>
      </div>
    </q-dialog>
    <q-dialog full-width v-model="addopt2">
      <AddOpt v-if="addopt2" :isDiag="true" @saved="(e) => {tempOpt = e; addNewOpts(); addopt = false}" class="q-diag-glassMorph" />
      </q-dialog>
    <q-dialog full-width v-model="addoptView">
      <AddOpt :isDiagView="true" :viewId="viewId" class="q-diag-glassMorph" />
      </q-dialog>

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
          prefixPath="/Products/Photos/"
          myPath="something"
        />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="noSelect">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Eliminar Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar un producto a Eliminar
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-footer v-if="sede !== null && $q.screen.lt.sm" reveal>
    <q-tabs dense mobile-arrows indicator-color="transparent" no-caps>
      <q-tab flat push no-caps icon="delete_outline" @click="softDelete"/>
      <q-tab flat icon="label" text-color="white" no-caps @click="promptNombre()" />
      <q-tab flat icon="visibility" text-color="white" no-caps @click="preview = !preview" />
      <q-tab flat push no-caps icon="add" @click="addrow"/>
    </q-tabs>
  </q-footer>
  </div>
</template>
<script>
const columns = [
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'desc', style: 'width: 175px;', align: 'center', label: 'Nombre', field: 'name', sortable: true },
  { name: 'categoria', align: 'center', label: 'Categoria', field: 'categoria' },
  { name: 'groupComp', align: 'center', label: 'Opciones', field: 'groupComp' },
  { name: 'descripcion', align: 'left', field: 'descripcion' },
  { name: 'stock', align: 'center', field: 'stock' },
  { name: 'discount', align: 'center', field: 'discount' },
  { name: 'price', align: 'center', field: 'price' },
  { name: 'priority', align: 'center', field: 'priority' },
  { name: 'disptype', align: 'center', field: 'disptype' },
  { name: 'estatus', align: 'left', field: 'estatus' },
  { name: 'photomulti', align: 'left', field: 'photomulti' },
  { name: 'pricerange', align: 'left', field: 'pricerange' },
  { name: 'descripcioncolor', align: 'left', field: 'descripcioncolor' }
]
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import photomulti from '../../components/menu/photomulti.vue'
import Croppa from 'vue-croppa'
import imageCompression from 'browser-image-compression'
import 'vue-croppa/dist/vue-croppa.css'

// import ClientMenu from '../editor/components/client/pages/Menu/menu'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    // ClientMenu,
    photomulti,
    'croppa': Croppa.component,
    AddCat: () => import('./Categorias'),
    AddOpt: () => import('./gruposOpt')
  },
  props: {
    quick: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'groupComp', 'itemGroup']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configs', 'version']),
    prodCategory: {
      get () {
        let cats = this.selectedProdCat || {}
        let cate = []
        for (let keys of Object.keys(cats)) {
          cate.push(cats[keys])
        }
        return cate
      },
      set (e) {
        console.log(e)
        let cats = {}
        for (let cat of e) {
          cats[cat.id] = cat
        }
        this.selectedProdCat = cats
        console.log(cats, this.selectedProdCat)
        this.$forceUpdate()
      }
    },
    menucfg () {
      let men = this.configs.find(e => e.id === 'menu')
      if (typeof men === 'undefined') {
        return { menuactive: true }
      }
      return this.configs.find(e => e.id === 'menu')
    },
    elmenu: {
      get () {
        var sort = Array.from(this.menuTemp)
        var sorted = sort.sort((a, b) => {
          return b.DateIn - a.DateIn
        })
        if (this.searchBar !== null && typeof this.searchBar !== 'undefined' && this.searchBar !== '') {
          var filteredMenu = sorted.filter(x => {
            return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
          })
          sorted = filteredMenu
        }
        if (this.category !== null) {
          return sorted.filter(x => {
            return x && x.categoria && x.categoria.includes(this.category)
          })
        }
        return sorted
      },
      set (e) {
        this.menuTemp = e
      }
    },
    locList () {
      return this.localizations.map(x => {
        return {
          value: x.id,
          label: x.name
        }
      })
    },
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
  data () {
    return {
      selectedProdCat: null,
      colorText: false,
      definitions: {
        color: {
          tip: 'Cambiar color de fuente',
          icon: 'palette',
          label: 'Color',
          handler: () => { this.colorText = true }
        },
        'tamaño': { cmd: 'color', param: 'red', icon: this.$q.iconSet.editor.size1 || this.$q.iconSet.editor.size, tip: this.$q.lang.editor.size1, htmlTip: `<font class="fontsize-42">${this.$q.lang.editor.size1}</font>` }
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'color'],
        [{
          label: this.$q.lang.editor.fontSize,
          icon: this.$q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7'
          ]
        }]
      ],
      showUploader: false,
      myCroppa: {},
      viewId: null,
      addoptView: false,
      propass: null,
      category: null,
      addopt: false,
      addopt2: false,
      tempOpt: null,
      addcat: false,
      preview: false,
      searchBar: '',
      menuTemp: [],
      amb: localStorage.getItem('amb'),
      sede: null,
      columns,
      temp1: {},
      selected: [],
      popupeditorData: '',
      photoType: '',
      photoProp: null,
      photoUpload: false,
      noSelect: false
    }
  },
  created () {
    this.bindMenu().then((e) => {
      this.menuTemp = JSON.parse(JSON.stringify(e))
    })
    this.bindCategorias()
    this.bindLocalizations()
    this.bindGroupComp()
    this.bindItemGroup()
    this.bindConfigs()
    // console.log({ cat: this.categorias, gr: this.groupComp })
  },
  methods: {
    conss (e, y) {
      console.log(e, y)
    },
    pasteCapture (evt) {
      // Let inputs do their thing, so we don't break pasting of links.
      if (evt.target.nodeName === 'INPUT') return
      let text, onPasteStripFormattingIEPaste
      evt.preventDefault()
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData('text/plain')
        this.$refs.editor_ref.runCmd('insertText', text)
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData('text/plain')
        this.$refs.editor_ref.runCmd('insertText', text)
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true
          this.$refs.editor_ref.runCmd('ms-pasteTextOnly', text)
        }
        onPasteStripFormattingIEPaste = false
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
        maxWidthOrHeight: 375,
        useWebWorker: true,
        fileType: file.type
      }
      var options2 = {
        maxSizeMB: 1,
        maxWidthOrHeight: 190,
        useWebWorker: true,
        fileType: file.type
      }
      try {
        let compressedFile = await imageCompression(imageFile, options)
        let compressedFile2 = await imageCompression(imageFile, options2)
        // // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob) // true
        // // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`) // smaller than maxSizeMB
        compressedFile.lastModifiedDate = new Date()
        let filename = compressedFile.lastModifiedDate.getTime()
        compressedFile.name = this.photoType
        compressedFile2.lastModifiedDate = compressedFile.lastModifiedDate
        compressedFile2.name = 'small_' + this.photoType
        compressedFile = new File([compressedFile], filename + '.' + ext, {
          type: file.type
        })
        compressedFile2 = new File([compressedFile2], 'small_' + filename + '.' + ext, {
          type: file.type
        })
        console.log([compressedFile, compressedFile2], 'tha files')
        this.$refs.fbq.addFiles([compressedFile, compressedFile2]) // write your own logic
      } catch (error) {
        console.log(error)
        this.$q.notify({ message: 'Error en el archivo' })
        return
      }
      this.showUploader = true

      // this.$refs.croppa.generateBlob((blob) => {
      //   // console.log()
      //   blob.lastModifiedDate = new Date()
      //   blob.name = 'fileName'
      //   this.showUploader = true
      //   this.$refs.fbq.addFiles([blob])
      //   var url = URL.createObjectURL(blob)
      //   // console.log(url)
      //   var a = document.createElement('a')
      //   a.download = 'filename'
      //   a.href = url
      //   a.click()
      //   URL.revokeObjectURL(url)
      // }, file.type, compressionRate)
    },
    validate (value) {
      return value >= 0 || 'error'
    },
    groupCompFilter () {
      let grupo
      if (this.propass.row.groupComp) {
        grupo = this.groupComp.filter(x => {
          return !this.propass.row.groupComp.includes(x.id)
        })
        grupo = grupo.reduce((y, x) => {
          let name = this.findname(x.group_id, x.name)
          if (name !== null) {
            y.push({
              id: x.id,
              name: name
            })
          }
          return y
        }, [])
        return grupo
      } else {
        grupo = this.groupComp
        // grupo = grupo.map(x => {
        //   return {
        //     id: x.id,
        //     name: this.findname(x.group_id, x.name)
        //   }
        // })
        grupo = grupo.reduce((y, x) => {
          let name = this.findname(x.group_id, x.name)
          if (name !== null) {
            y.push({
              id: x.id,
              name: name
            })
          }
          return y
        }, [])
        return grupo
      }
    },
    findname (groupid, name) {
      let obj
      obj = this.itemGroup.find(x => x.id === groupid)
      if (obj && obj.name) {
        return obj.name
      }
      return null
    },
    addNewOpts () {
      let props = this.propass
      props.row.groupComp = props.row.groupComp ? [...props.row.groupComp, ...this.tempOpt] : this.tempOpt
      this.saved(props.row.groupComp, props.row.groupComp, props.row.id, 'groupComp')
      this.tempOpt = null
    },
    getCompVal (id, val) {
      let group = this.groupComp.find(x => x.id === id)
      if (typeof group === 'undefined') {
        return 'Valor no encontrado'
      } else {
        let value = group[val]
        return value
      }
    },
    delCompVal (oldval, delval) {
      let index = oldval.findIndex(x => x === delval)
      oldval.splice(index, 1)
      return oldval
    },
    promptNombre () {
      this.$q.dialog({
        title: '',
        message: '¿Qué nombre desea mostrar como Productos en el cliente?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.saved3(data, '', 'menu', 'dispName')
      })
    },
    search () {
      if (this.selectedCat !== null) {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
        this.filteredMenu = this.filteredMenu.filter(x => {
          return x.categoria.includes(this.selectedCat.id)
        })
      } else {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
      }
    },
    CatExists (values) {
      let cat = this.plaincategorias
      if (typeof values === 'undefined') { return [] }
      for (let i in values) {
        var filter = cat.filter(x => x.id === values[i])
        if (filter.length === 0) {
          values.splice(i, 1)
        }
      }
      // console.log({ values })
      return values
    },
    resetPhotoType () {
      this.photoType = ''
    },
    showPopup (row, col) {
      this.popupinsert_photoData = row[col]
    },
    saved (value, initialValue, id, key) {
      // console.log(this.temp1)
      // console.log({ key })
      if (key === 'discount') { value = isNaN(parseInt(value)) ? 0 : parseInt(value) } else if (key === 'price') { value = parseFloat(value) }
      // else if (key.includes('stock')) { value = parseInt(value) }
      // console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'menu' })
      // this.setValue({ payload: { value, id, key }, collection: 'menu' })
    },
    saveTemp (temp) {
      if (typeof this.temp1[temp.collection] === 'undefined') {
        this.temp1[temp.collection] = {}
      }
      if (typeof this.temp1[temp.collection][temp.payload.id] === 'undefined') {
        this.temp1[temp.collection][temp.payload.id] = {}
      }
      this.temp1[temp.collection][temp.payload.id][temp.payload.key] = temp.payload.value
      console.log({ temp1: this.temp1 })
      this.$forceUpdate()
    },
    saved3 (value, initialValue, id, key) {
      // console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'config' })
    },
    saved2 (value, initialValue, id, key) {
      // console.log({ key })
      if (value) { value = 1 } else { value = 0 }
      // console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'menu' })
    },
    async executeSave () {
      try {
        this.$q.loading.show({ message: 'Guardando los cambios' })
        let waitSaved = await this.asyncSave()
        if (waitSaved) {
          this.$q.notify({ message: 'Cambios Guardados', color: 'green' })
          this.temp1 = {}
          this.menuTemp = JSON.parse(JSON.stringify(this.menu))
          this.$forceUpdate()
        }
      } catch (error) {
        console.error(error)
        this.$q.notify({ message: 'Error guardando los cambios', color: 'red' })
      } finally {
        this.$q.loading.hide()
      }
    },
    async asyncSave () {
      for (let collection in this.temp1) {
        for (let document in this.temp1[collection]) {
          console.log(document, collection)
          if (this.temp1[collection][document].isNew) {
            let data = this.temp1[collection][document]
            delete data.isNew
            delete data.id
            await this.newAddRow({ collection, data })
          } else {
            await this.setMultiValue({ payload: { id: document, ...this.temp1[collection][document] }, collection: collection })
          }
        }
      }
      return true
    },
    canceled (val, initialValue) {
      // console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'setValue2', 'setMultiValue', 'newAddRow', 'bindMenu', 'bindCategorias', 'bindGroupComp', 'bindItemGroup']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindConfigs']),
    /* delrow () {
      this.delrows({ payload: this.selected, collection: 'menu' })
    }, */
    softDelete () {
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Eliminar producto',
          message: '¿Desea Eliminar el producto seleccionado ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.delrows({ payload: this.selected, collection: 'menu' })
        }).onCancel(() => {
        })
      }
    },
    delrows (payload) {
      this.$refs.table.clearSelection()
      for (const i in payload.payload) {
        let index = this.menuTemp.findIndex(x => x.id === payload.payload[i].id)
        this.menuTemp.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      // console.log(this.temp1)
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.elmenu.length}`
      return objSelectedString
    },
    addrow () {
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.menu === 'undefined') {
        this.temp1.menu = {}
      }
      this.temp1.menu[rand] = { id: rand, categoria: {}, isNew: true, price: 0, descripcion: '', estatus: { [`${this.sede}`]: true }, stock: { [`${this.sede}`]: 1000 }, disptype: 0 }
      this.menuTemp.unshift({ id: rand, price: 0, descripcion: '', estatus: { [`${this.sede}`]: true }, stock: { [`${this.sede}`]: 1000 }, disptype: 0 })
      this.$forceUpdate()
    },
    showPhotoUpload (type, prop) {
      this.photoProp = prop
      this.photoUpload = true
      this.photoType = type
    },
    showDefaultPhoto (e) {
      return e === '' ||
        e === null ||
        e === undefined
    },
    uploadComplete (info) {
      // console.log({ info })
      try {
        for (let i of info) {
          if (i.file.startsWith('small_')) {
            this.photoProp.photosmall = i.link
            this.saveTemp({ payload: { value: i.link, id: this.photoProp.id, key: 'photosmall' }, collection: 'menu' })
          } else {
            this.photoProp.photo = i.link
            this.saveTemp({ payload: { value: i.link, id: this.photoProp.id, key: 'photo' }, collection: 'menu' })
          }
        }
        let fileNames = []
        info.forEach(file => fileNames.push(file.file))
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
      }
    }
  },
  watch: {
    // category (e) {
    //   // console.log(e, 'jjjj')
    //   if (typeof e === 'undefined' || e === null) {
    //     this.elmenu = this.filteredMenu = this.origMenu.filter(x => {
    //       return x && x.categoria && x.categoria.includes(e)
    //     })
    //   } else {
    //     this.elmenu = this.filteredMenu = this.origMenu
    //   }
    //   // console.log(this.filteredMenu, 'kkk')
    // }
  }
}
</script>

<style lang="stylus">
  .label-expand
    font-weight: bold
  .croppa-container
    background-color: transparent
    border: 2px solid grey
    border-radius: 8px
 .croppa-container:hover
    opacity: 1
    background-color: #8ac9ef

</style>
