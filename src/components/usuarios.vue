<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Usuarios</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Usuario" : "Editar usuario" }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="nombre" label="Nombre del Usuario" class="q-my-md q-mx-md" type="text" />
                    <q-input v-if="accion === 1" outlined v-model="correo" label="Correo del usuario" class="q-my-md q-mx-md" type="email" :disabled="accion !== 1" />
                    <q-select outlined v-model="rol" label="Rol del Usuario" :options="roles" class="q-my-md q-mx-md" />
                    <q-input v-if="accion === 1" outlined v-model="contrasena" label="Contraseña" class="q-my-md q-mx-md" type="password" :disabled="accion !== 1"  />
                    <q-input outlined v-model="telefono" type="tel" label="Telefono" required pattern="[0-9]+" maxlength="10" class="q-my-md q-mx-md" />
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
                        <q-btn @click="validarcamposvacios()" color="red" class="text-white" :loading="useUsuario.loading">
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
            <q-table title="Usuarios" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;" >
                <template v-slot:body-cell-fechas="props">
                    <q-td :props="props">
                        
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
                        <q-btn @click="traerUsuarios(props.row)">✏️</q-btn>
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
import { useStoreUsuario } from '../stores/usuarios.js';
import { useStoreSede } from '../stores/sedes.js';
import { Notify } from 'quasar';

const useUsuario = useStoreUsuario();
const useSede = useStoreSede();

let rows = ref([]);
let nombre = ref('');
let correo = ref('');
let contrasena = ref("")
let telefono = ref('')
const rol = ref('')
const roles = ['ADMINISTRADOR', 'RECEPCIONISTA', 'ENTRENADOR']
let alert = ref(false);
let accion = ref(1);
let id = ref("")

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

async function listarUsuarios() {
    const r = await useUsuario.listarUsuarios()
    console.log(r.data.usuario);
    rows.value = r.data.usuario
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

async function desactivar(usuario) {
    const r = await useUsuario.putusuariosDesactivar(usuario._id)
        .then((response) => {
            console.log(response);
            listarUsuarios()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(usuario) {
    const r = await useUsuario.putusuariosActivar(usuario._id)
        .then((response) => {
            console.log(response);
            listarUsuarios()
        })
        .catch((error) => {
            console.log('Error de sede:', error);

        })
}

function validarcamposvacios() {
    if (nombre.value === "") {
        Notify.create({
            message: 'Se debe agregar un nombre!',
            position: "center",
            color: "red"
        });
    } else if (correo.value === "") {
        Notify.create({
            message: 'Se debe agregar un correo!',
            position: "center",
            color: "red"
        });
    } else if (contrasena.value === "" ) {
        Notify.create({
            message: 'Se debe agregar una contraseña!',
            position: "center",
            color: "red"
        });
    } else if (telefono.value === "") {
        Notify.create({
            message: 'Se debe agregar un telefono!',
            position: "center",
            color: "red"
        });
    } else if (isNaN(telefono.value) === true) {
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
    } else if (idsedes.value === "") {
        console.log("");
        Notify.create({
            message: 'Se debe agregar una sede valida!',
            position: "center",
            color: "red"
        });
    } else {
        if (accion.value === 1) {
            crearUsuarios();
        } else {
            editarUsuarios();
        }
    }
}


async function crearUsuarios() {
    const r = await useUsuario.postusuarios({
        nombre: nombre.value,
        correo: correo.value,
        contrasena: contrasena.value,
        telefono: telefono.value,
        rol: rol.value,
        idsedes: idsedes.value.value
    });
    console.log(r);
    listarUsuarios();
    limpiarCampos();
    cerrar();
}


function traerUsuarios(usuario) {
    alert.value = true;
    accion.value = 2;
    id.value = usuario._id;
    nombre.value = usuario.nombre;
    correo.value = usuario.correo;
    contrasena.value = usuario.contrasena
    telefono.value = usuario.telefono;
    rol.value = usuario.rol;
    idsedes.value = {
    label: usuario.idsedes?.nombre || '',
    value: usuario.idsedes?._id || ''
  }
}

async function editarUsuarios() {
    try {
        await useUsuario.putusuarios(id.value, {
            nombre: nombre.value,
            telefono: telefono.value,
            rol: rol.value,
            idsedes: idsedes.value.value
        });
        listarUsuarios();
        limpiarCampos();
        cerrar();
    } catch (error) {
        console.log('Error al modificar el usuario:', error);
    }
}

const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'correo',
        required: true,
        label: 'Correo',
        align: 'center',
        field: 'correo',
        sortable: true
    },
    {
        name: 'telefono',
        required: true,
        label: 'Telefono',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'rol',
        required: true,
        label: 'Rol',
        align: 'center',
        field: 'rol',
        sortable: true
    },
    {
        name: 'idsedes',
        required: true,
        label: 'Sede',
        align: 'center',
        field: (row) => row.idsedes?.nombre || '',
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

//funciones bobas para el front ----------------------
function limpiarCampos() {
    nombre.value = '';
    correo.value = '';
    telefono.value = '';
    rol.value = '';
    idsedes.value ="";
    contrasena.value ="";
}
function abrir() {
    alert.value = true;
    limpiarCampos()
    accion.value = 1;
}
function cerrar() {
    alert.value = false;
}
onMounted(() => {
    listarSedes()
    listarUsuarios()
})
//---------------------------------------------------

</script>

<style></style>