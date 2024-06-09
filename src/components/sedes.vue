<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Sedes</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Sede" : "Editar Sede" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="nombre" label="Nombre de la Sede" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="direccion" label="direccion de la Sede" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="ciudad" label="Ciudad de la Sede" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="apertura" label="Hora de apertura" class="q-my-md q-mx-md" type="time" />
                    <q-input outlined v-model="cierre" label="Hora de Cierre" class="q-my-md q-mx-md" type="time" />
                    <q-input outlined v-model="telefono" type="tel" label="Telefono" required pattern="[0-9]+" maxlength="10" class="q-my-md q-mx-md" />
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useSede.loading">
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
            <q-table title="Sedes" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;" >
                <template v-slot:body-cell-fechas="props">
                    <q-td :props="props">
                        <p v-if="props.row.horario[0]">{{ props.row.horario[0].apertura }} - {{ props.row.horario[0].cierre }}</p>
                        <p v-else>-----</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <q-btn @click="traerSedes(props.row)">✏️</q-btn>
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
import { useStoreSede } from '../stores/sedes';
import { Notify } from 'quasar';

const useSede = useStoreSede();

let rows = ref([]);
let nombre = ref('');
let direccion = ref('');
let ciudad = ref('');
let apertura = ref('');
let cierre = ref('');
let telefono = ref('');
let alert = ref(false);
let accion = ref(1);
let id = ref('');

async function listarSedes() {
    const r = await useSede.listarSedes();
    rows.value = r.data.sede;
}


async function desactivar(sede) {
    const r = await useSede.putSedesDesactivar(sede._id)
        .then((response) => {
            console.log(response);
            listarSedes();
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        });
}

async function activar(sede) {
    const r = await useSede.putSedesActivar(sede._id)
        .then((response) => {
            console.log(response);
            listarSedes();
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        });
}

function validarcamposvacios() {
    if (nombre.value == "") {
        Notify.create({
            message: 'Se debe agregar un nombre!',
            position: "center",
            color: "red"
        });
    } else if (direccion.value == "") {
        Notify.create({
            message: 'Se debe agregar una direccion!',
            position: "center",
            color: "red"
        });
    } else if (ciudad.value == "") {
        Notify.create({
            message: 'Se debe agregar la ciudad de la Sede!',
            position: "center",
            color: "red"
        });
    } else if (apertura.value == "") {
        Notify.create({
            message: 'Se debe agregar hora de apertura de la sede!',
            position: "center",
            color: "red"
        });
    } else if (cierre.value == "") {
        Notify.create({
            message: 'Se debe agregar hora de cierre de la sede!',
            position: "center",
            color: "red"
        });
    } else if (telefono.value == "") {
        Notify.create({
            message: 'Se debe agregar un telefono!',
            position: "center",
            color: "red"
        });
    } else if (isNaN(telefono.value) == true) {
        Notify.create({
            message: 'El campo de telefono debe agregar solo numeros!',
            position: "center",
            color: "red"
        });
    } else if (telefono.value.length < 8) {
        Notify.create({
            message: 'Se debe agregar al menos 8 numeros!',
            position: "center",
            color: "red"
        });
    } else {
        if (accion.value === 1) {
            crearSedes();
        } else {
            editarSedes();
        }
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

async function crearSedes() {
    const r = await useSede.postSedes({
        nombre: nombre.value,
        direccion: direccion.value,
        ciudad: ciudad.value,
        horario: [{
            apertura: apertura.value,
            cierre: cierre.value
        }],
        telefono: telefono.value
    });
    console.log(r);
    listarSedes();
    limpiarCampos();
    cerrar();
}

function traerSedes(sede) {
    alert.value = true;
    accion.value = 2;
    id.value = sede._id;
    nombre.value = sede.nombre;
    direccion.value = sede.direccion;
    ciudad.value = sede.ciudad;
    telefono.value = sede.telefono;
    apertura.value = sede.horario[0].apertura;
    cierre.value = sede.horario[0].cierre;
}

async function editarSedes() {
    try {
        await useSede.putSedes(id.value, {
            nombre: nombre.value,
            direccion: direccion.value,
            ciudad: ciudad.value,
            telefono: telefono.value,
            horario: [{
                apertura: apertura.value,
                cierre: cierre.value
            }]
        });
        listarSedes();
        limpiarCampos();
        cerrar();
    } catch (error) {
        console.log('Error al modificar sede:', error);
    }
}

function limpiarCampos() {
    nombre.value = '';
    direccion.value = '';
    ciudad.value = '';
    apertura.value = '';
    cierre.value = '';
    telefono.value = '';
}

const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre Sede',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'ciudad',
        required: true,
        label: 'Ciudad',
        align: 'center',
        field: 'ciudad',
        sortable: true
    },
    {
        name: 'fechas',
        required: true,
        label: 'Horario',
        align: 'center',
        field: 'fechas',
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
        align: 'center'
    }
]);

onMounted(() => {
    listarSedes();
});
</script>

<style scoped>
.table {
    width: 90%;
    margin: 20px auto;
}

.btn-acciones {
    display: flex;
    justify-content: space-between;
}
</style>
