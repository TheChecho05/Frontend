<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Planes</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Plan" : "Editar Plan" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="descripcion" label="Descripcion del Plan" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="valor" label="Precio" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="dias" label="Dias" class="q-my-md q-mx-md" type="text" />
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="usePlan.loading">
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

        <div style="display: flex; justify-content: center">
            <q-table title="Planes" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <q-btn @click="traerPlanes(props.row)">✏️</q-btn>
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
import { useStorePlan } from '../stores/planes.js';
import { Notify } from 'quasar'

const usePlan = useStorePlan();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref("");

let descripcion = ref('');
let valor = ref('');
let dias = ref('');

async function listarPlanes() {
    const r = await usePlan.listarPlanes()
    rows.value = r.data.planes
}

async function desactivar(planes) {
    const r = await usePlan.putPlanesDesactivar(planes._id)
        .then((response) => {
            console.log(response);
            listarPlanes()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}

async function activar(planes) {
    const r = await usePlan.putPlanesActivar(planes._id)
        .then((response) => {
            console.log(response);
            listarPlanes()
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
        })
    } else if (valor.value == "") {
        Notify.create({
            message: 'Se debe agregar un valor!',
            position: "center",
            color: "red"
        })
    } else if (dias.value == "") {
        Notify.create({
            message: 'Se debe agregar la cantidad de dias!',
            position: "center",
            color: "red"
        })
    } else {
        if (accion.value === 1) {
            crearPlanes();
        } else {
            editarPlanes();
        }
    }
}

async function crearPlanes() {
    const r = await usePlan.postPlanes({
        descripcion: descripcion.value,
        valor: valor.value,
        dias: dias.value,
    })
    console.log(r);
    console.log("Plan agregado exitosamente");
    listarPlanes()
    limpiarCampos()
    cerrar()
}

function traerPlanes(planes) {
    alert.value = true;
    accion.value = 2;
    id.value = planes._id;
    descripcion.value = planes.descripcion;
    valor.value = planes.valor;
    dias.value = planes.dias;
}

async function editarPlanes() {
    try {
        await usePlan.putPlanes(id.value, {
            descripcion: descripcion.value,
            valor: valor.value,
            dias: dias.value,
        });
        listarPlanes();
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
        label: 'Plan',
        align: 'center',
        field: 'descripcion',
        sortable: true
    },
    {
        name: 'valor',
        required: true,
        label: 'Precio',
        align: 'center',
        field: 'valor',
        sortable: true
    },
    {
        name: 'dias',
        required: true,
        label: 'Dias',
        align: 'center',
        field: 'dias',
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
    valor.value = '';
    dias.value = '';
}

onMounted(() => {
    listarPlanes()
})
</script>

<style></style>
