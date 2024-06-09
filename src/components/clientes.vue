<template>
  <div style="height: 100vh; overflow-y: auto;">
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Cliente</q-btn>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Cliente" : "Editar Cliente" }}
            </div>
          </q-card-section>
          <q-input outlined v-model="nombre" label="Nombre" class="q-my-md q-mx-md" type="text" />
          <q-input outlined v-model="fechaNacimiento" label="Fecha de Nacimiento" class="q-my-md q-mx-md" type="date" />
          <q-input outlined v-model="direccion" label="Direccion" class="q-my-md q-mx-md" type="text" />
          <q-select outlined v-model="tipodocumento" label="Tipo de Documento" :options="tipos" class="q-my-md q-mx-md" />
          <q-input outlined v-model="numdocumento" label="Numero de Documento" class="q-my-md q-mx-md" type="text" />
          <q-input outlined v-model="foto" label="Foto (URL)" class="q-my-md q-mx-md" type="text" />
          <q-select outlined v-model="idplan" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione un Plan">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
          <q-input v-if="accion === 1" outlined v-model="peso" label="Peso (KG)" class="q-my-md q-mx-md" type="text" />
          <q-input v-if="accion === 1" outlined v-model="estatura" label="Altura (M)" class="q-my-md q-mx-md" type="text" />
          <q-input v-if="accion === 1" outlined v-model="brazo" label="brazo (CM)" class="q-my-md q-mx-md" type="text" />
          <q-input v-if="accion === 1" outlined v-model="cintura" label="cintura (CM)" class="q-my-md q-mx-md" type="text" />
          <q-input v-if="accion === 1" utlined v-model="pierna" label="pierna (CM)" class="q-my-md q-mx-md" type="text" />
          <q-card-actions align="right">
            <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useCliente.loading">
                            {{ accion == 1 ? "Agregar" : "Editar" }}
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar" />
          </q-card-actions>
        </q-card>
      </q-dialog>

 <q-dialog v-model="seguimientoAlert" persistent>
    <q-card style="width: 90vw; max-width: 1200px;">
      <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
        <div class="text-h6 text-white">
          Seguimientos de {{ nombre }}
        </div>
      </q-card-section>
      <q-card-section style="max-height: 70vh; overflow-y: auto;">
        <!-- Tabla para mostrar seguimientos -->
        <div style="display: flex; justify-content: center">
          <q-table 
            title="Seguimientos" 
            title-class="text-green text-weight-bolder text-h5" 
            table-header-class="text-black"
            :rows="seguimientosCliente" 
            :columns="columns" 
            row-key="fechainicio" 
            style="width: 100%; margin-bottom: 6%;">
          </q-table>
        </div>
        <!-- Formulario para agregar seguimiento -->
        <div class="seguimiento-form">
          <q-input v-model="nuevoSeguimiento.peso" label="Peso (KG)" type="number" class="q-my-md q-mx-md" />
          <q-input v-model="nuevoSeguimiento.estatura" label="Altura (M)" type="number" class="q-my-md q-mx-md" />
          <q-field filled :dense="false" disable class="q-my-md q-mx-md">
              <template v-slot:control >
                <div v-if="nuevoSeguimiento.peso && nuevoSeguimiento.estatura " class="self-center full-width no-outline">{{  nuevoSeguimiento.peso / (nuevoSeguimiento.estatura * nuevoSeguimiento.estatura)  }}</div>
              </template>
            </q-field>
          <q-input v-model="nuevoSeguimiento.brazo" label="Brazo (CM)" type="number" class="q-my-md q-mx-md" />
          <q-input v-model="nuevoSeguimiento.pierna" label="Pierna (CM)" type="number" class="q-my-md q-mx-md" />
          <q-input v-model="nuevoSeguimiento.cintura" label="Cintura (CM)" type="number" class="q-my-md q-mx-md" />
          <div class="q-my-md q-mx-md">
            <q-btn @click="agregarSeguimiento()" color="green" label="Añadir Seguimiento" class="q-mr-md" />
            <q-btn label="Cerrar" color="black" outline @click="seguimientoAlert = false" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

    </div>

  <div class="q-pa-md row items-start q-gutter-md scrollable-container" style="display: flex;">
    <q-card v-for="cliente in rows" :key="cliente._id" class="my-card">
      <q-img
        :src="cliente.foto || 'https://cdn.quasar.dev/img/parallax2.jpg'"
        class="card-image"
      ></q-img>
      <div class="card-content">
        <div class="text-h6">{{ cliente.nombre }}</div>
  
      </div>
      <q-card-actions class="card-actions">
        <q-btn flat @click="traerCliente(cliente)" class="edit-button">✏️</q-btn>
        <q-btn flat v-if="cliente.estado == 1" @click="desactivar(cliente)" class="delete-button">⛔</q-btn>
        <q-btn flat v-else @click="activar(cliente)" class="activate-button">✅</q-btn>
        <q-btn flat @click="seguimientos(cliente)" class="edit-button">📂</q-btn>
      </q-card-actions>
    </q-card>
  </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStoreCliente } from '../stores/clientes.js';
import { Notify } from 'quasar';
import { useStorePlan } from '../stores/planes.js';
const usePlan = useStorePlan();
const useCliente = useStoreCliente();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref("");
let nombre = ref('');
let fechaNacimiento = ref('');
let direccion = ref('');
let tipodocumento = ref('');
const tipos = ['Cedula de Ciudadania', 'Tarjeta de Identidad', 'Tarjeta de recidencia permanente',"Tarjeta de recidencia Temporal"]
let numdocumento = ref('');
let foto = ref('');
let seguimientoDataBase = ref([]);
let peso = ref("")
let estatura = ref("")
let brazo = ref("")
let pierna = ref("")
let cintura = ref("")

let idplan = ref('');
let planes = []
let datos = {}
let options = ref(planes)

const seguimientosCliente = ref([]);
const nuevoSeguimiento = ref({
  peso: '',
  imc: '',
  brazo: '',
  pierna: '',
  cintura: '',
  estatura: ''
});

let seguimientoAlert = ref(false); 


const columns = [
  { name: 'fechainicio', label: 'Fecha de Inicio', field: 'fechainicio' },
  { name: 'peso', label: 'Peso (KG)', field: 'peso' },
  { name: 'imc', label: 'IMC', field: 'imc' },
  { name: 'brazo', label: 'Brazo (CM)', field: 'brazo' },
  { name: 'pierna', label: 'Pierna (CM)', field: 'pierna' },
  { name: 'cintura', label: 'Cintura (CM)', field: 'cintura' },
  { name: 'estatura', label: 'Estatura (M)', field: 'estatura' },
];


function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = planes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}

async function listarClientes() {
  try {
    const r = await useCliente.listarClientes();
    console.log(r.data.cliente);
    rows.value = r.data.cliente;
  } catch (error) {
    console.log(error);
    console.log('Error al listar los clientes')
  }
}
async function listarPlanes() {
    const data = await usePlan.listarPlanes()
    data.data.planes.forEach(item => {
        datos = {
            label: item.descripcion,
            value: item._id
        }
        planes.push(datos)
    })
    console.log(planes);
}



async function agregarSeguimiento() {
  try {
    let seguimiento = { 
      peso: nuevoSeguimiento.value.peso,
      estatura: nuevoSeguimiento.value.estatura,
      brazo: nuevoSeguimiento.value.brazo,
      pierna: nuevoSeguimiento.value.pierna,
      cintura: nuevoSeguimiento.value.cintura,
      imc: `${nuevoSeguimiento.value.peso / (nuevoSeguimiento.value.estatura * nuevoSeguimiento.value.estatura)}`
    };
    seguimientoDataBase.value.push(seguimiento);
    const response = await useCliente.putClientes(id.value, {
      seguimiento: seguimientoDataBase.value
    });
    await listarClientes();
    seguimientoAlert.value = false
    nuevoSeguimiento.value = {
      peso: '',
      imc: '',
      brazo: '',
      pierna: '',
      cintura: '',
      estatura: ''
    };
  } catch (error) {
    console.log('Error al agregar seguimiento matenme:', error);
  }
}

async function desactivar(cliente) {
    const r = await useCliente.putClientesDesactivar(cliente._id)
        .then((response) => {
            console.log(response);
            listarClientes()
        })
        .catch((error) => {
            console.log('Error de cliente:', error);

        })
}

async function activar(clientes) {
  try {
    await useCliente.putClienteActivar(clientes._id);
    listarClientes();
  } catch (error) {
    console.log(error);
  }
}

function validarcamposvacios() {
  if (nombre.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Se debe agregar un nombre',
    });
  } else if (fechaNacimiento.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Se debe agregar la fecha de nacimiento',
    });
  }else if (direccion.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Se debe agregar una dirección',
    });
  } else if (tipodocumento.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Se debe agregar un tipo de documento',
    });
  } else if (numdocumento.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Se debe agregar un número de documento',
    });
  } else if (foto.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Se debe agregar una foto',
    });
  } else if (idplan.value === "") {
    Notify.create({
      type: 'negative',
      message: 'Se debe agregar un plan',
    });
  }
  else if (estatura.value === "") {
    Notify.create({
      type: 'negative',
      message: 'El Seguimiento debe estar lleno',
    });
  }
  else if (peso.value === "") {
    Notify.create({
      type: 'negative',
      message: 'El Seguimiento debe estar lleno',
    });
  }
  else if (brazo.value === "") {
    Notify.create({
      type: 'negative',
      message: 'El Seguimiento debe estar lleno',
    });
  }
  else if (pierna.value === "") {
    Notify.create({
      type: 'negative',
      message: 'El Seguimiento debe estar lleno',
    });
  }
  else if (cintura.value === "") {
    Notify.create({
      type: 'negative',
      message: 'El Seguimiento debe estar lleno',
    });
  }
  
  else {
        if (accion.value === 1) {
            crearCliente();
        } else {
            editarCliente();
        }
    }
}

async function crearCliente() {
  try {
    const imc = peso.value / (estatura.value * estatura.value);
    await useCliente.postCliente({
      idplan: idplan.value.value,
      nombre: nombre.value,
      fechaNacimiento: fechaNacimiento.value,
      direccion: direccion.value,
      tipodocumento: tipodocumento.value,
      numdocumento: numdocumento.value,
      foto: foto.value,
      seguimiento: [{
        peso: peso.value,
        estatura: estatura.value,
        imc: imc, 
        brazo: brazo.value,
        pierna: pierna.value,
        cintura: cintura.value
      }],
    });
    console.log("cliente creado");
    listarClientes();
    limpiarCampos();
    cerrar();
  } catch (error) {
    console.log(error);
    console.log("error al crear cliente asdads");
  }
}

function traerCliente(cliente) {
  alert.value = true;
  accion.value = 2;
  id.value = cliente._id;
  nombre.value = cliente.nombre;
  fechaNacimiento.value = cliente.fechaNacimiento.split("T")[0];
  direccion.value = cliente.direccion;
  tipodocumento.value = cliente.tipodocumento;
  numdocumento.value = cliente.numdocumento;
  foto.value = cliente.foto;
  peso.value = cliente.seguimiento[0].peso;
  estatura.value = cliente.seguimiento[0].estatura;
  brazo.value = cliente.seguimiento[0].brazo;
  pierna.value = cliente.seguimiento[0].pierna;
  cintura.value = cliente.seguimiento[0].cintura;
  idplan.value = {
    label: cliente.idplan.descripcion,
    value: cliente.idplan._id
}
  if (peso.value && estatura.value) {
    const imc = peso.value / (estatura.value * estatura.value);
    // Asignar el IMC calculado
    imc.value = imc;
  }
} 

async function seguimientos(cliente) {
  try {
    id.value = cliente._id;
    seguimientoDataBase.value = cliente.seguimiento
    const response = await useCliente.getClientsById(cliente._id);
    seguimientosCliente.value = response.data.clientes.seguimiento;
    nombre.value = response.data.clientes.nombre;
    seguimientoAlert.value = true;
  } catch (error) {
    console.log('Error al obtener seguimientos:', error);
  }
}

async function editarCliente() {
  try {
    const imc = peso.value / (estatura.value * estatura.value);
    await useCliente.putClientes(id.value, {
      nombre: nombre.value,
      fechaNacimiento: fechaNacimiento.value,
      direccion: direccion.value,
      tipodocumento: tipodocumento.value,
      numdocumento: numdocumento.value,
      foto: foto.value,
      idplan: idplan.value.value,
      seguimiento: [{
        peso: peso.value,
        estatura: estatura.value,
        imc: imc, 
        brazo: brazo.value,
        pierna: pierna.value,
        cintura: cintura.value
      }]
    });
    console.log('Cliente editado exitosamente');
    listarClientes();
    limpiarCampos();
    cerrar();
  } catch (error) {
    console.log(error);
    console.log('Error al modificar el cliente')
  }
}


function abrir() {
  alert.value = true;
  limpiarCampos();
  accion.value = 1;
}

function cerrar() {
  alert.value = false;
}

function limpiarCampos() {
  nombre.value = '';
  fechaNacimiento.value = '';
  direccion.value = '';
  tipodocumento.value = '';
  numdocumento.value = '';
  foto.value = '';
}



onMounted(() => {
  listarClientes();
  listarPlanes();
});
</script>

<style>
.my-card {
  position: relative;
  width: 230px;
  margin-bottom: 20px;
}

.card-image {
  height: 150px;
  object-fit: cover;
}



.card-content {
  padding: 10px;
}

.card-actions {
  position: absolute;
  bottom: -5px;
  right: 10px;
}

.edit-button,
.delete-button,
.activate-button {
  margin-left: 5px;
}
</style>
