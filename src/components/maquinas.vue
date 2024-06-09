<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Maquinas</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Maquinas" : "Editar Maquina" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="descripcion" label="Descripcion de la Maquina" class="q-my-md q-mx-md"
                        type="text" />
                    <q-select outlined v-model="idsedes" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione una Sede">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useMaquina.loading">
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
            <q-table title="Maquinas" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <q-btn @click="traerMaquinas(props.row)">✏️</q-btn>
                        <q-btn @click="desactivar(props.row)" v-if="props.row.estado == 1">❌</q-btn>
                        <q-btn @click="activar(props.row)" v-else>✅</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>


<script setup>

import { onMounted, ref } from 'vue';
import { useStoreMaquina } from '../stores/maquinas.js';
import { useStoreSede } from '../stores/sedes.js';
import { Notify } from 'quasar';

const useMaquina = useStoreMaquina();
const useSede = useStoreSede();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref("")
let descripcion = ref('');
let nombre = ref("");

let idsedes = ref('');
let sedes = []
let datos = {}
let options = ref(sedes)

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = sedes.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}


async function listarMaquinas() {
    const r = await useMaquina.listarMaquinas()
    console.log(r.data.maquina);
    rows.value = r.data.maquina
}
async function listarSedes() {
    const data = await useSede.listarSedes()
    data.data.sede.forEach(item => {
        datos = {
            label: item.nombre,
            value: item._id
        }
        sedes.push(datos)
    })
    console.log(sedes);
}


async function desactivar(maquinas) {
    const r = await useMaquina.putMaquinasDesactivar(maquinas._id)
        .then((response) => {
            console.log(response);
            listarMaquinas()
        })
        .catch((error) => {
            console.log('Error de sede:', error);

        })
}
async function activar(maquinas) {
    const r = await useMaquina.putMaquinasActivar(maquinas._id)
        .then((response) => {
            console.log(response);
            listarMaquinas()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}



function validarcamposvacios() {
    if (descripcion.value == "") {
        Notify.create({
            message: 'Se debe agregar una descripcion!',
            position: "center",
            color: "red"
        });
    } else if (idsedes.value == "") {
        Notify.create({
            message: 'Se debe seleccionar una sede!',
            position: "center",
            color: "red"
        });
    } else {
        if (accion.value === 1) {
            crearMaquinas();
        } else {
            editarMaquinas();
        }
    }
}

async function crearMaquinas() {
    const r = await useMaquina.postMaquinas({
        idsedes: idsedes.value.value,
        descripcion: descripcion.value,
    })
    console.log(r);
    console.log("Maquina agregada exitosamente");
    listarMaquinas()
    limpiarCampos()
    cerrar()
}


function traerMaquinas(maquinas) {
    alert.value = true;
    accion.value = 2;
    id.value = maquinas._id;
    descripcion.value = maquinas.descripcion;
    idsedes.value = {
    label: maquinas.idsedes.nombre,
    value: maquinas.idsedes._id
    }
}



async function editarMaquinas() {
    try {
        await useMaquina.putMaquinas(id.value, {
            descripcion: descripcion.value,
            idsedes: idsedes.value.value
        });
        listarMaquinas();
        limpiarCampos();
        cerrar();
    } catch (error) {
        console.log('Error al modificar sede:', error);
    }
}


const columns = ref([
    {
        name: 'descripcion',
        required: true,
        label: 'Descripcion de la maquina',
        align: 'center',
        field: 'descripcion',
        sortable: true
    },
    {
        name: 'createdAt',
        required: true,
        label: 'Fecha de llegada de la maquina',
        align: 'center',
        field: 'createdAt',
        sortable: true,
        format: (val) => {
            const fechaIngreso = new Date(val)
            return fechaIngreso.toLocaleDateString()
        }
    },
    {
        name: 'idsedes',
        required: true,
        label: 'Sede',
        align: 'center',
        field: (row) => row.idsedes.nombre,
        sortable: true
    },
    {
        name: 'estado',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'estado',
        sortable: true
    },
    {
        name: 'opciones',
        required: true,
        label: 'Opciones',
        align: 'center',
        field: 'opciones',
        sortable: true
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
    descripcion.value = '';
    idsedes.value = '';
}

onMounted(() => {
    listarMaquinas()
    listarSedes()
})
//---------------------------------------------
</script>

<!--  -->
<style></style>