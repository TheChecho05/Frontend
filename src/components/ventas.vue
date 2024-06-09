<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Agregar Ventas</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Venta" : "Editar Venta" }}
                        </div>
                    </q-card-section>
                    <q-select v-if="accion === 1" outlined v-model="idInventario" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione un Producto">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="valorUnitario" label="Precio Unitario" class="q-my-md q-mx-md" type="Number"/>
                    <q-input outlined v-model="cantidad" label="Cantidad" class="q-my-md q-mx-md" type="Number"/>
                    <q-card-actions align="right">
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useVenta.loading">
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
            <q-table title="Ventas" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;" >
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <q-btn @click="traerVentas(props.row)">✏️</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';
import { useStoreVenta } from '../stores/ventas.js';
import { useStoreInventario } from '../stores/inventario.js';

const useVenta = useStoreVenta();
const useInventario = useStoreInventario();

let rows = ref([]);
let alert = ref(false);
let accion = ref(1);
let id = ref("");

let idInventario = ref('');
let inventarios = [];
let datos = {};
let options = ref(inventarios);
let valorUnitario = ref('');
let cantidad = ref('');

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = inventarios.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}

async function listarVentas() {
    const r = await useVenta.listarVentas();
    rows.value = r.data.ventas;
}

async function listarInventarios() {
    const data = await useInventario.listarInventarios();
    data.data.inventario.forEach(item => {
        datos = {
            label: item.descripcion,
            value: item._id
        };
        inventarios.push(datos);
    });
}

function validarcamposvacios() {
    if (accion.value === 1 && idInventario.value == "") {
        Notify.create({
            message: 'Se debe agregar un producto!',
            position: "center",
            color: "red"
        });
    } else if (valorUnitario.value == "") {
        Notify.create({
            message: 'Se debe agregar un valor Unitario!',
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
            crearVentas();
        } else {
            editarVentas();
        }
    }
}

async function crearVentas() {
    const r = await useVenta.postVentas({
        idInventario: idInventario.value.value,
        valorUnitario: valorUnitario.value,
        cantidad: cantidad.value,
    });
    console.log(r);
    console.log("Producto agregado exitosamente");
    listarVentas();
    limpiarCampos();
    cerrar();
}

function traerVentas(ventas) {
    alert.value = true;
    accion.value = 2;
    id.value = ventas._id;
    valorUnitario.value = ventas.valorUnitario;
    cantidad.value = ventas.cantidad;
}

async function editarVentas() {
    try {
        await useVenta.putVentas(id.value, {
            valorUnitario: valorUnitario.value,
            cantidad: cantidad.value,
        });
        listarVentas();
        limpiarCampos();
        cerrar();
    } catch (error) {
        console.log('Error al modificar la venta:', error);
    }
}

const columns = ref([
    {
        name: 'idInventario',
        required: true,
        label: 'Producto',
        align: 'center',
        field: (row) => row.idInventario.descripcion,
        sortable: true,
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
        name: 'total',
        required: true,
        label: 'Total',
        align: 'center',
        field: 'total',
        sortable: true
    },
    {
        name: 'createAt',
        required: true,
        label: 'Fecha de la venta',
        align: 'center',
        field: 'createAt',
        sortable: true,
        format: (val) => {
            const fechaIngreso = new Date(val);
            return fechaIngreso.toLocaleDateString();
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
]);

function abrir() {
    alert.value = true;
    limpiarCampos();
    accion.value = 1;
}

function cerrar() {
    alert.value = false;
}

function limpiarCampos() {
    valorUnitario.value = '';
    cantidad.value = '';
    if (accion.value === 1) idInventario.value = '';
}

onMounted(() => {
    listarVentas();
    listarInventarios();
});
</script>

<style></style>
