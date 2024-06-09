<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Pagos</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Pagos" : "Editar Pagos" }}
                        </div>
                    </q-card-section>
                    <q-select v-if="accion === 1" outlined v-model="idCliente" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione un Plan">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select v-if="accion === 1" outlined v-model="idPlan" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opciones" @filter="filtarCliente" label="Seleccione un Cliente">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="usePago.loading">
                            {{ accion == 1 ? "Agregar" : "Editar" }}
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>

        <div style="display: flex;  justify-content: center">
            <q-table title="Pagos" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;">
            </q-table>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useStorePago } from '../stores/pagos.js';
import { useStorePlan } from '../stores/planes.js';
import { useStoreCliente } from '../stores/clientes.js';

const usePago = useStorePago();
const usePlan= useStorePlan();
const useCliente = useStoreCliente();

let idPlan = ref("")
let idCliente = ref("")

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref("")

let valor = ref('');


let planes = [];
let clientes = [];
const options = ref(clientes)
const opciones = ref(planes)

let datos = {}


function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = planes.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
function filtarCliente (val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = clientes.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}


async function listarPagos() {
    const r = await usePago.listarPagos()
    console.log(r.data.pagos);
    rows.value = r.data.pagos
}


const listarPlanes = async () => {
    const data = await usePlan.listarPlanes();
    planes.value = data.data.planes.map(item => ({
        label: item.descripcion,
        value: item._id
    }));
    opciones.value = planes.value;
};

const listarClientes = async () => {
    const data = await useCliente.listarClientes();
    clientes.value = data.data.cliente.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    opciones.value = clientes.value;
};


function validarcamposvacios() {
    if (idCliente.value == "") {
        Notify.create({
            message: 'Se debe agregar un Cliente!',
            position: "center",
            color: "red"
        });
    } else if (idPlan.value == "") {
        Notify.create({
            message: 'Se debe agregar un Plan!',
            position: "center",
            color: "red"
        });
    }  else {
        if (accion.value === 1) {
            crearPagos();
        } 
}
}
async function crearPagos() {
    const r = await usePago.postPagos({
        idPlan: idPlan.value.value,
        idCliente: idCliente.value.value,
    })
    console.log(r);
    listarPagos()
    limpiarCampos()
    cerrar()
}


function traerMantenimientos(mantenimientos) {
    alert.value = true;
    accion.value = 2;
    id.value = mantenimientos._id;
    descripcion.value = mantenimientos.descripcion;
    responsable.value = mantenimientos.responsable;
    valor.value = mantenimientos.valor;
}

async function editarMantenimientos() {
    try {
        await useMantenimiento.putMantenimientos(id.value, {
            descripcion: descripcion.value,
            valor: valor.value,
            responsable: responsable.value
        });
        listarMantenimientos();
        limpiarCampos();
        cerrar();
    } catch (error) {
        console.log('Error al modificar sede:', error);
    }
}


const columns = ref([
    {
        name: 'idPlan',
        required: true,
        label: 'Plan',
        align: 'center',
        field: (row) => row.idPlan.descripcion,
        sortable: true,
    },
    {
        name: 'idCliente',
        required: true,
        label: 'Nombre',
        align: 'center',
        field: (row) => row.idCliente.nombre,
        sortable: true,
    },
    {
        name: 'valor',
        required: true,
        label: 'Costo del Mantenimiento:',
        align: 'center',
        field: 'valor',
        sortable: true
    },
    {
        name: 'createAt',
        required: true,
        label: 'Fecha del Pago',
        align: 'center',
        field: 'createAt',
        sortable: true,
        format: (val) => {
            const fechaIngreso = new Date(val)
            return fechaIngreso.toLocaleDateString()
        }
    },

])

//---------------------Funciones no tan importantes------------------------
function abrir() {
    alert.value = true;
    limpiarCampos()
    accion.value = 1;
}
function cerrar() {
    alert.value = false;
}

function limpiarCampos() {
    idCliente.value = '';
    idPlan.value = '';
}
//Esta funciones son para traer los nombres en vez de las id

onMounted(() => {
    listarPagos()
    listarClientes()
    listarPlanes()
})
//---------------------------------------------
</script>

<!--  -->
<style></style>