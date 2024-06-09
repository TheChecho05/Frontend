import login from "../components/login.vue"
import sedes from "../components/sedes.vue"
import clientes from "../components/clientes.vue"
import ingresos from "../components/ingresos.vue"
import inventario from "../components/inventario.vue"
import mantenimientos from "../components/mantenimientos.vue"
import maquinas from "../components/maquinas.vue"
import pagos from "../components/pagos.vue"
import planes from "../components/planes.vue"
import usuarios from "../components/usuarios.vue"
import ventas from "../components/ventas.vue"
import home from "../components/home.vue"
import home2 from "../components/home2.vue"

import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    {path: "/",component:login,name:"login"},
    {path: "/home",component: home, children: [
            { path:"/sedes", component:sedes,name:"sedes" },
            { path:"/home2", component:home2,name:"home2" },
            { path:"/clientes", component:clientes,name:"clientes" },
            { path:"/ingresos", component:ingresos,name:"ingresos" },
            { path:"/inventario", component:inventario,name:"inventario" },
            { path:"/mantenimientos", component:mantenimientos,name:"mantenimientos" },
            { path:"/maquinas", component:maquinas,name:"maquinas" },
            { path:"/pagos", component:pagos,name:"pagos" },
            { path:"/planes", component:planes,name:"planes" },
            { path:"/usuarios", component:usuarios,name:"usuarios" },
            { path:"/ventas", component:ventas,name:"ventas" },
        ],
    }
];


export const router = createRouter({
    history:createWebHashHistory(),
    routes
})