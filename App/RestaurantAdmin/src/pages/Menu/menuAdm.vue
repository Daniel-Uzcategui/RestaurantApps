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
          <q-btn flat push no-caps label="Agregar" icon="add" @click="addrow"/>
          <q-btn flat push no-caps label="Eliminar" icon="delete_outline" @click="softDelete"/>
          <q-btn flat icon="visibility" no-caps label="Vista en Cliente" @click="preview = !preview" />
          <q-btn flat icon="label" no-caps label="Cambio de Nombre" @click="promptNombre()" />
        </q-btn-group>
        <q-input filled dense  v-if="sede !== null" class="q-ma-md" style="min-width: 250px" v-model="searchBar" rounded outlined label="Buscar" >
          <template v-slot:prepend>
          <q-icon name="fas fa-search"/>
        </template>
        </q-input>
        <q-select options-selected-class="text-blue" filled rounded dense
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
      <!-- <template v-slot:body="props">
        <q-tr v-if="sede !== null" :props="props">
          <q-td  auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="photo" :props="props">
            <div class="text-center" @click="showPhotoUpload(props.row.id)">
            <div class=" column items-center" v-if="showDefaultPhoto(props.row.photo)">
                <q-avatar round class="q-mb-sm"  color="secondary" icon="insert_photo" font-size="50px" size="180px" text-color="white"></q-avatar></div>
            <div class="column items-center" v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(props.row.id)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar></div>
                </div>
          </q-td>
          <q-td key="desc" :props="props">
              <q-input filled dense
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              :value="props.row.name"
               style="width: 150px;"
              rounded
              outlined />
          </q-td>
          <q-td key="categoria" :props="props">
              <q-select options-selected-class="text-blue" filled rounded dense
                :value="CatExists(props.row.categoria)"
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="listcategorias"
                map-options
                emit-value
                stack-label
                style="max-width: 200px"
              />
          </q-td>
           <q-td key="groupComp" :props="props">
              <q-select options-selected-class="text-blue" filled rounded dense
                :value="props.row.groupComp"
                @input="(e) => saved(e, props.row.groupComp, props.row.id, 'groupComp')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="groupComp"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                map-options
                emit-value
                stack-label
                style="max-width: 200px"
              />
          </q-td>
          <q-td auto-width >
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
       </q-tr>
        <q-tr v-show="props.expand" :props="props">
           <q-td><label class="label-expand">Descripción</label></q-td>
           <q-td colspan="100%" key="descripcion" :props="props">
              <q-insert_photoor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"

                style="width: 450px"
              />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
           <q-td><label class="label-expand">Stock</label></q-td>
           <q-td colspan="100%" key="stock" :props="props">
               <q-input filled rounded outlined
                style="width: 100px"
                @input="(e) => saved(e, parseInt(props.row.stock), props.row.id, `stock.${sede}`)"
                :value="props.row.stock ? props.row.stock[sede] : 0"

                min="1" max="99999"
                type="number"
              />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Descuento</label></q-td>
          <q-td colspan="100%" key="discount" :props="props">
              <q-input filled dense  rounded outlined
                style="width: 100px"
                @input="(e) => saved(e, parseInt(props.row.discount), props.row.id, 'discount')"
                :value="props.row.discount"

                label="%"
                min="0" max="100"
                type="number"
              />
          </q-td>
         </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Precio</label></q-td>
          <q-td colspan="100%" key="price" :props="props">
             <q-decimal filled style="width: 150px"
             dense
             :rules="[validate]"
             rounded
             outlined @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
             :value="props.row.price"
             input-style="text-align: right">
             </q-decimal>
          </q-td>
        </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Prioridad</label></q-td>
          <q-td colspan="100%" key="priority" :props="props">
             <q-input filled  style="width: 100px" rounded
             outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
             :value="props.row.priority"

             min="1" max="999"
             type="number">
             </q-input>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Display Type</label></q-td>
          <q-td colspan="100%" key="disptype" :props="props">
             <q-input filled dense
                style="width: 100px"
                rounded
                outlined
                @input="(e) => saved(e, parseInt(props.row.disptype), props.row.id, `disptype`)"
                :value="props.row.disptype ? props.row.disptype : 0"

                min="1" max="99999"
                type="number"
              />
          </q-td>
        </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Activar</label></q-td>
          <q-td  key="estatus" :props="props" >
              <q-toggle
                @input="(e) => saved(e, props.row.status, props.row.id, `estatus.${sede}`)"
                :value="props.row.estatus ? props.row.estatus[sede] ? true : false : false"
                color="#3c8dbc"
              />
          </q-td>
          <q-td colspan="100%" >
          </q-td>
        </q-tr>
      </template> -->
      <!-- <template v-slot:item="props">
        <div v-if="sede !== null" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-m-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section class="column items-start" key="photo" :props="props">
                  <div class="row justify-between no-wrap full-width">
                  <div style="min-width: 50px" class="text-center col-2 self-center" @click="showPhotoUpload(props.row.id)">
                  <div class=" column items-start" v-if="showDefaultPhoto(props.row.photo)">
                      <q-avatar round class="q-mb-sm" icon="insert_photo" color="secondary" font-size="38px" size="50px" text-color="white"></q-avatar></div>
                  <div class="column items-start" v-else>
                      <q-avatar round class="q-mb-sm shadow-5" size="50px" @click="showPhotoUpload(props.row.id)">
                          <q-img :src="props.row.photo"></q-img>
                      </q-avatar></div>
                      </div>
                  <q-item-label class="col-5 self-center">{{props.row.name ? props.row.name: 'Dale a la flechita'}}</q-item-label>
                  <q-icon style="min-width: 25px" class="col-1 self-center" size="md" :name="props.row.estatus ? props.row.estatus[sede] ? 'toggle_on' : 'toggle_off' : 'toggle_off'" />
                  <q-item-label class="col-3 self-center text-right" :style="$q.screen.lt.md ? 'max-width: 200px' : ''" caption>{{(props.row.price).toFixed(2)}}</q-item-label>
                  <q-btn class="col-1 self-center" flat push rounded icon="edit" @click.stop="props.expand = !props.expand" />
                  </div>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
        </q-list>
          <q-dialog class="bg-transparent" v-model="props.expand">
            <q-list class="q-diag-glassMorph">
          <q-item class="column items-center" key="photo" :props="props">
            <div class="text-center" @click="showPhotoUpload(props.row.id)">
            <div class=" column items-start" v-if="showDefaultPhoto(props.row.photo)">
                <q-avatar round class="q-mb-sm" icon="insert_photo" color="secondary" font-size="50px" size="180px" text-color="white"></q-avatar></div>
            <div class="column items-start" v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(props.row.id)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar></div>
                </div>
          </q-item>
          <q-item v-show="props.expand" :props="props">
                  <p class="text-bold">Activar</p>
                  <q-toggle
                      @input="(e) => saved(e, props.row.status, props.row.id, `estatus.${sede}`)"
                      :value="props.row.estatus ? props.row.estatus[sede] ? true : false : false"
                      color="#3c8dbc"
                    />
              </q-item>
          <q-item class="column items-start" key="desc" :props="props">
            <q-td><label class="label-expand">Nombre</label></q-td>
              <q-input filled dense
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              :value="props.row.name"
              rounded
              outlined />
          </q-item>
          <q-item class="column items-start" key="categoria" :props="props">
            <q-td><label class="label-expand">Categorias</label></q-td>
              <q-select options-selected-class="text-blue" filled rounded dense
                :value="CatExists(props.row.categoria)"
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="listcategorias"
                map-options
                emit-value
                stack-label
              />
          </q-item>
           <q-item class="column items-start" key="groupComp" :props="props">
             <q-td><label class="label-expand">Opciones</label></q-td>
              <q-select options-selected-class="text-blue" filled rounded dense
                :value="props.row.groupComp"
                @input="(e) => saved(e, props.row.groupComp, props.row.id, 'groupComp')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="groupComp"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                map-options
                emit-value
                stack-label
              />
          </q-item>
              <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col" key="descripcion" :props="props">
                    <q-editor content-class="bg-blue-6"
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      :value="props.row.descripcion"
                      min-height="5rem"

                    />

                </q-td>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                  <div class="col-6 q-pa-xs">
                    <p class="text-bold">Stock</p>
                    <q-input filled dense
                      rounded
                      outlined
                      @input="(e) => saved(e, parseInt(props.row.stock), props.row.id, `stock.${sede}`)"
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
                      :value="props.row.discount"
                      label="%"
                      min="0" max="100"
                      type="number"
                    />
                  </div>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Precio</p>
                  <q-decimal
                  dense
                  filled
                  :rules="[validate]"
                  rounded
                  outlined @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                  :value="props.row.price"
                  input-style="text-align: right">
                  </q-decimal>
                </div>
                <div class="col-6 q-pa-xs">
                  <p class="text-bold">Prioridad</p>
                  <q-input filled dense
                  rounded
                  outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
                  :value="props.row.priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Tipo de Display</p>
                  <q-input filled dense
                      rounded
                      outlined
                      @input="(e) => saved(e, parseInt(props.row.disptype), props.row.id, `disptype`)"
                      :value="props.row.disptype ? props.row.disptype : 0"
                      min="1" max="99999"
                      type="number"
                    />
                </div>
              </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template> -->
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
                          <q-img :src="props.row.photo"></q-img>
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
                  <q-btn class="col-1 self-center" flat push rounded icon="edit" @click.stop="props.expand = !props.expand" />
                  </div>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
        </q-list>
          <q-dialog class="bg-transparent" v-model="props.expand">
            <q-list class="q-diag-glassMorph">
          <q-item class="column items-center" key="photo" :props="props">
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
          <q-item class="column items-start" key="desc" :props="props">
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
                v-model="props.row.categoria"
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                class="col-12"
                multiple
                input-debounce="0"
                :options="listcategorias"
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
              <!-- <q-select options-selected-class="text-blue" filled rounded dense
                v-model="props.row.groupComp"
                @input="(e) => saved(e, props.row.groupComp, props.row.id, 'groupComp')"
                use-input
                use-chips
                class="full-width"
                multiple
                input-debounce="0"
                :options="groupComp"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                map-options
                emit-value
                stack-label
              >
              <template v-slot:append>
          <q-icon
            name="add"
            class="cursor-pointer"
            @click.stop.prevent="addopt = !addopt"
          />
        </template>
              </q-select> -->
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
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      v-model="props.row.descripcion"
                      min-height="5rem"

                    />

                </q-td>
              </q-item>
              <q-item class="row justify-center"  :props="props">
                  <div class="col-6 q-pa-xs">
                    <p class="text-bold">Stock</p>
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
              <q-item class="row justify-center"  :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Tipo de Display</p>
                  <q-input filled dense
                      rounded
                      outlined
                      @input="(e) => saved(e, parseInt(props.row.disptype), props.row.id, `disptype`)"
                      v-model="props.row.disptype"
                      min="1" max="99999"
                      type="number"
                    />
                </div>
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
    <q-dialog
      v-model="preview"
      maximized
      @show="$q.dark.set(false)"
      @hide="$q.dark.set(true)"
      class="bg-white"
      >
      <q-card>
        <q-card-section side>
        <q-icon name="fas fa-chevron-left" color="black" v-close-popup></q-icon>
        </q-card-section>
        <q-card-section>
            <ClientMenu v-if="sede !== null" :Sede="sede" :dark="false"/>
      </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
        <fbq-uploader
          class="q-my-lg"
          label="Please Upload a Photo"
          :meta="meta"
          :prefixPath="prefixPath"
          @uploaded="(e) => {uploadComplete(e); saveTemp({ payload: { value: e.link, id: photoProp.id, key: 'photo' }, collection: 'menu' }); photoProp.photo = e.link }"
          :onlyLink="true"
          document='menu'
        />
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
  { name: 'estatus', align: 'left', field: 'estatus' }
]
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import ClientMenu from '../editor/components/client/pages/Menu/menu'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    ClientMenu,
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
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'groupComp']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configs']),
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
    },
    prefixPath () {
      const id = this.currentUser && this.currentUser.id ? this.currentUser.id : '',
        path = `${id}/${this.photoType}Photo/${this.photoType}Photo.`
      return path
    }
  },
  data () {
    return {
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
    this.bindConfigs()
    console.log({ cat: this.categorias, gr: this.groupComp })
  },
  methods: {
    validate (value) {
      return value >= 0 || 'error'
    },
    groupCompFilter () {
      if (this.propass.row.groupComp) {
        return this.groupComp.filter(x => {
          return !this.propass.row.groupComp.includes(x.id)
        })
      } else {
        return this.groupComp
      }
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
      console.log({ values })
      return values
    },
    resetPhotoType () {
      this.photoType = ''
    },
    showPopup (row, col) {
      this.popupinsert_photoData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log(this.temp1)
      console.log({ key })
      if (key === 'discount') { value = isNaN(parseInt(value)) ? 0 : parseInt(value) } else if (key === 'price') { value = parseFloat(value) }
      // else if (key.includes('stock')) { value = parseInt(value) }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
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
      this.$forceUpdate()
    },
    saved3 (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'config' })
    },
    saved2 (value, initialValue, id, key) {
      console.log({ key })
      if (value) { value = 1 } else { value = 0 }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'menu' })
    },
    executeSave () {
      for (let collection in this.temp1) {
        for (let document in this.temp1[collection]) {
          if (this.temp1[collection][document].isNew) {
            let data = this.temp1[collection][document]
            delete data.isNew
            delete data.id
            this.newAddRow({ collection, data })
          } else {
            for (let key in this.temp1[collection][document]) {
              var value = this.temp1[collection][document][key]
              console.log({ payload: { value, document, key }, collection: collection })
              this.setValue2({ payload: { value, id: document, key }, collection: collection })
            }
          }
        }
      }
      this.temp1 = {}
      this.$q.notify({ message: 'Cambios Guardados' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'setValue2', 'newAddRow', 'bindMenu', 'bindCategorias', 'bindGroupComp']),
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
      console.log(this.temp1)
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
      this.temp1.menu[rand] = { id: rand, isNew: true, price: 0, descripcion: '' }
      this.menuTemp.unshift({ id: rand, price: 0, descripcion: '' })
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
      console.log(this.prefixPath)
      console.log(this.currentUser)
      let fileNames = []
      info.files.forEach(file => fileNames.push(file))
      this.photoUpload = false
      this.$q.notify({
        message: `Successfully uploaded your photo: ${fileNames}`,
        color: 'positive'
      })
    }
  },
  watch: {
    // category (e) {
    //   console.log(e, 'jjjj')
    //   if (typeof e === 'undefined' || e === null) {
    //     this.elmenu = this.filteredMenu = this.origMenu.filter(x => {
    //       return x && x.categoria && x.categoria.includes(e)
    //     })
    //   } else {
    //     this.elmenu = this.filteredMenu = this.origMenu
    //   }
    //   console.log(this.filteredMenu, 'kkk')
    // }
  }
}
</script>

<style lang="stylus">
  .label-expand
    font-weight: bold
</style>
