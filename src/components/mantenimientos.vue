<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Mantenimientos</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Mantenimiento" : "Editar Mantenimiento" }}
                        </div>
                    </q-card-section>
                    <q-select v-if="accion === 1" outlined v-model="idmaquina" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione una Maquina">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="descripcion" label="Descripcion del Mantenimiento" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="responsable" label="Responsable del Mantenimiento" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="valor" label="Precio del Mantenimiento" class="q-my-md q-mx-md" type="text" />
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useMantenimiento.loading">
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
            <q-table title="Mantenimientos" title-class="text-green text-weight-bolder text-h5"
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
                        <q-btn @click="traerMantenimientos(props.row)">✏️</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useStoreMantenimiento } from '../stores/mantenimientos.js';
import { useStoreMaquina } from '../stores/maquinas.js';
const useMaquina = useStoreMaquina();
const useMantenimiento = useStoreMantenimiento();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref("")

let responsable = ref('');
let valor = ref('');
let descripcion = ref('');
let idmaquina = ref('');
let maquinas = []
let datos = {}
let options = ref(maquinas)

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = maquinas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
async function listarMantenimientos() {
    const r = await useMantenimiento.listarMantenimientos()
    console.log(r.data.mantenimientos);
    rows.value = r.data.mantenimientos
}
async function listarMaquinas() {
    const data = await useMaquina.listarMaquinas()
    data.data.maquina.forEach(item => {
        datos = {
            label: item.descripcion,
            value: item._id
        }
        maquinas.push(datos)
    })
    console.log(maquinas);
}

function validarcamposvacios() {
    if (idmaquina.value == "") {
        Notify.create({
            message: 'Se debe agregar una maquina!',
            position: "center",
            color: "red"
        });
    } else if (descripcion.value == "") {
        Notify.create({
            message: 'Se debe agregar una descripcion del mantenimiento!',
            position: "center",
            color: "red"
        });
    } else if (responsable.value == "") {
        Notify.create({
            message: 'Se debe agregar quien realizo el mantenimiento!',
            position: "center",
            color: "red"
        });
    } else if (valor.value == "") {
        Notify.create({
            message: 'Se debe agregar el costo del mantenimiento!',
            position: "center",
            color: "red"
        });
    }   else {
        if (accion.value === 1) {
            crearMantenimientos();
        } else {
            editarMantenimientos();
        }
    }
}

async function crearMantenimientos() {
    const r = await useMantenimiento.postMantenimientos({
        idmaquina: idmaquina.value.value,
        descripcion: descripcion.value,
        responsable: responsable.value,
        valor: valor.value
    })
    console.log(r);
    console.log("Mantenimiento agregada exitosamente");
    listarMantenimientos()
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
        name: 'idmaquina',
        required: true,
        label: 'Maquina',
        align: 'center',
        field: (row) => row.idmaquina.descripcion,
        sortable: true,
    },
    {
        name: 'descripcion',
        required: true,
        label: 'Descripcion del Mantenimiento',
        align: 'center',
        field: 'descripcion',
        sortable: true
    },
    {
        name: 'responsable',
        required: true,
        label: 'Responsable del Mantenimiento',
        align: 'center',
        field: 'responsable',
        sortable: true
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
        name: 'createdAt',
        required: true,
        label: 'Fecha del Mantenimiento',
        align: 'center',
        field: 'createdAt',
        sortable: true,
        format: (val) => {
            const fechaIngreso = new Date(val)
            return fechaIngreso.toLocaleDateString()
        }
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
    
}
//Esta funciones son para traer los nombres en vez de las id

onMounted(() => {
    listarMantenimientos()
    listarMaquinas()
})
//---------------------------------------------
</script>

<!--  -->
<style></style>