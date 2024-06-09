<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Productos</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Producto" : "Editar producto" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="descripcion" label="Descripcion/Nombre del producto" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="valor" label="Precio" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="cantidad" label="Cantidad" class="q-my-md q-mx-md" type="text" />
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useInventario.loading">
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
            <q-table title="Inventario" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;" >
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <q-btn @click="traerInventarios(props.row)">✏️</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>


<script setup>

import { onMounted, ref } from 'vue';
import { useStoreInventario } from '../stores/inventario.js';
import { Notify } from 'quasar';

const useInventario = useStoreInventario();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref("")

let descripcion = ref('');
let valor = ref('');
let cantidad = ref('');


async function listarInventarios() {
    const r = await useInventario.listarInventarios()
    console.log(r.data.inventario);
    rows.value = r.data.inventario
}


function validarcamposvacios() {
    if (descripcion.value == "") {
        Notify.create({
            message: 'Se debe agregar una descripcion!',
            position: "center",
            color: "red"
        });
    } else if (valor.value == "") {
        Notify.create({
            message: 'Se debe agregar un precio!',
            position: "center",
            color: "red"
        });
    } else if (cantidad.value == "") {
        Notify.create({
            message: 'Se debe agregar la cantidad!',
            position: "center",
            color: "red"
        });
    } else {
        if (accion.value === 1) {
            crearInventarios();
        } else {
            editarInventarios();
        }
    }
}

async function crearInventarios() {
    const r = await useInventario.postInventarios({
        descripcion: descripcion.value,
        valor: valor.value,
        cantidad: cantidad.value,
    })
    console.log(r);
    console.log("Producto agregada exitosamente");
    listarInventarios()
    limpiarCampos()
    cerrar()
}


function traerInventarios(inventario) {
    alert.value = true;
    accion.value = 2;
    id.value = inventario._id;
    descripcion.value = inventario.descripcion;
    valor.value = inventario.valor;
    cantidad.value = inventario.cantidad;
}

async function editarInventarios() {
    try {
        await useInventario.putInventarios(id.value, {
            descripcion: descripcion.value,
            valor: valor.value,
            cantidad: cantidad.value,
        });
        listarInventarios();
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
        name: 'cantidad',
        required: true,
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad',
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
    cantidad.value = '';
}

onMounted(() => {
    listarInventarios()
})

</script>

<!--  -->
<style></style>