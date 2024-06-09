<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Ingresos</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Ingreso" : "Editar Mantenimiento" }}
                        </div>
                    </q-card-section>
                    <q-select v-if="accion === 1" outlined v-model="idsedes" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione una Sede">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select v-if="accion === 1" outlined v-model="idcliente" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opciones" @filter="filtarCliente" label="Seleccione un cliente">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useIngreso.loading">
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
            <q-table title="Ingresos" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;">
            </q-table>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useStoreSede } from '../stores/sedes.js';
import { useStoreCliente } from '../stores/clientes.js';
import { useStoreIngreso } from '../stores/ingresos.js';
import { Notify } from 'quasar';

const useCliente = useStoreCliente();
const useSede = useStoreSede();
const useIngreso = useStoreIngreso();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let idcliente = ref("")
let idsedes = ref("")


let sedes = [];
let clientes = [];
const options = ref(sedes)
const opciones = ref(clientes)




function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = sedes.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
function filtarCliente (val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = clientes.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}



async function listarIngresos() {
    const r = await useIngreso.listarIngresos()
    console.log(r.data.ingreso);
    rows.value = r.data.ingreso
    
}

const listarSedes = async () => {
    const data = await useSede.listarSedes();
    sedes.value = data.data.sede.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    options.value = sedes.value;
    console.log('Sedes:', sedes.value);
};

const listarClientes = async () => {
    const data = await useCliente.listarClientes();
    clientes.value = data.data.cliente.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    opciones.value = clientes.value;
    console.log('Clientes:', clientes.value);
};

function validarcamposvacios() {
    if (idcliente.value == "") {
        Notify.create({
            message: 'Se debe agregar un cliente!',
            position: "center",
            color: "red"
        });
    } else if (idsedes.value == "") {
        Notify.create({
            message: 'Se debe agregar una sede!',
            position: "center",
            color: "red"
        });
    }   else {
        if (accion.value === 1) {
            crearIngresos();
        } 
    }
}

async function crearIngresos() {
    const r = await useIngreso.postIngresos({
        idsedes: idsedes.value.value,
        idcliente: idcliente.value.value,
    })
    console.log(r);
    listarIngresos()
    cerrar()
}


const columns = ref([
    {
        name: 'idsedes',
        required: true,
        label: 'Sede',
        align: 'center',
        field: (row) => row.idsedes.nombre,
        sortable: true,
    },
    {
        name: 'idcliente',
        required: true,
        label: 'Nombre Cliente',
        align: 'center',
        field: (row) => row.idcliente.nombre,
        sortable: true,
    },
    {
        name: 'createdAt',
        required: true,
        label: 'Fecha del Ingreso',
        align: 'center',
        field: 'createdAt',
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
    accion.value = 1;
}
function cerrar() {
    alert.value = false;
}


//Esta funciones son para traer los nombres en vez de las id

onMounted(() => {
    listarIngresos()
    listarSedes()
    listarClientes()
})
//---------------------------------------------
</script>

<!--  -->
<style></style>