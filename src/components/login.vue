<template>
  <div class="back window-height window-width row justify-center items-center">
    <div class="q-pa-md">
      <div class="login-container">
        <div class="title">
          <h3>Iniciar Sesión</h3>
        </div>
        <!-- Eliminado el formulario -->
        <q-input label="Correo electrónico" v-model="correo"></q-input>
        <q-input label="Contraseña" type="password" v-model="contrasena"></q-input>
        <q-btn class="submit" type="submit" color="primary" @click="login()">Ingresar</q-btn>
      </div>
    </div>
  </div>
</template>
<script setup>
import {  ref } from 'vue';
import { useStoreUsuario } from '../stores/usuarios';
import { useRouter } from 'vue-router';
const router = useRouter();
const useUsuario = useStoreUsuario();
let correo = ref("")
let contrasena = ref("")


async function login() {
    const r = await useUsuario.login(correo.value,contrasena.value)
        .then((response) => {
            console.log(response);
            useUsuario.token=response.data.token
            router.push("/home2")
            console.log(useUsuario.token)
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}


</script>

<style>
body,h1,h2,h3{
  margin: 0;
}
.back{
  height: 100vh;
  background-image: url(../assets/fotologin.png);
  background-position: center;
  background-size: cover;
}
.login-container {
  width: 400px;
  height: 360px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: solid black 2px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}
.title{
  width: 100%;
  padding: 20px;
  border-radius: 8px;
}
.submit{
  margin-top: 30px;
  width: 80%;
}
.q-input {
  margin-top: 20px;
}
</style>