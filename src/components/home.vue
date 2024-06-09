<template>
    <q-layout view="hHh lpR fFf">
      <q-header bordered class="bg-red-5 text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
  
          <q-toolbar-title align="center">
            <q-avatar>
              <img src="https://cdn-icons-png.flaticon.com/512/38/38464.png">
            </q-avatar>
            Gyms
            <q-avatar>
              <img src="https://cdn-icons-png.flaticon.com/512/38/38464.png">
            </q-avatar>
          </q-toolbar-title>
          
        </q-toolbar>
      </q-header>
      
      <q-drawer show-if v-model="leftDrawerOpen" side="left" behavior="desktop" bordered>
      <q-list class="full-height">
        <router-link v-for="(item, i) in items" :key="i" :to="item.route">
          <q-item clickable v-ripple class="my-item">
            <q-item-section avatar>
              <q-icon :name="item.icon" class="my-icon" />
            </q-item-section>
            <q-item-section>
              {{ item.name }}
            </q-item-section>
          </q-item>
        </router-link>
        <q-item class="justify-center q-pt-md">
  <q-btn color="red" @click="cerrarsesion()">Cerrar Sesión</q-btn>
</q-item>
      </q-list>
  </q-drawer>
  
      <q-page-container class="">
        <router-view></router-view>
      </q-page-container>
  
    </q-layout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useStoreUsuario} from "../stores/usuarios"
  import { useRouter } from 'vue-router';

  let useUsuario = useStoreUsuario()

  

  let router = useRouter()



      const leftDrawerOpen = ref(false)
      const items = ref([
    { name: 'Home', icon: 'menu', route: '/home2' },
    { name: 'Usuarios', icon: 'group', route: '/usuarios' },
    { name: 'Clientes', icon: 'person', route: '/clientes' },
    { name: 'Ingresos', icon: 'attach_money', route: '/ingresos' },
    { name: 'Inventario', icon: 'inventory', route: '/inventario' },
    { name: 'Mantenimientos', icon: 'build', route: '/mantenimientos' },
    { name: 'Maquinas', icon: 'settings', route: '/maquinas' },
    { name: 'Pagos', icon: 'payment', route: '/pagos' },
    { name: 'Planes', icon: 'event_note', route: '/planes' },
    { name: 'Sedes', icon: 'location_city', route: '/sedes' },
    { name: 'Ventas', icon: 'shopping_cart', route: '/ventas' },
  ])
     
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value   
}


function cerrarsesion(){
  useUsuario.token=""
  useUsuario.usuarios=[]
  router.push("/")
} 

</script>
  
  <style>
  .q-page-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
  }
  .q-header {
    position: fixed;
    width: 100%;
    z-index: 2;
  }
  .my-item {
    font-size: 20px;
  }
  .my-icon {
    font-size: 1em;
  }
  
  </style>