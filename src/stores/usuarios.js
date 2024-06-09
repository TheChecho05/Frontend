import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";


export const useStoreUsuario = defineStore("usuarios", () =>{
    let loading = ref(false)
    let usuarios = ref([]);
    let token = ref("")

    const listarUsuarios = async () => {
        try {
          loading.value = true;
          console.log(token.value)
          const response = await axios.get("api/usuarios",{
            headers:{
                token:token.value
            }
          });
          usuarios.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de sedes:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    const postusuarios = async(data)=>{
        try {
            loading.value=true
            const r = await axios.post("api/usuarios/agregar", data, {
                headers:{
                    token:token.value
                }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);

        }finally{
            loading.value=false
        }
    }
    const putusuarios = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/usuarios/actualizar/${id}`, data,{
                headers:{
                    token:token.value
                }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);

        }finally{
            loading.value=false
        }
    }
    const putusuariosActivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/usuarios/activar/${id}`,{},{
                headers:{
                    token:token.value
                }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const putusuariosDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/usuarios/desactivar/${id}`,{},{
                headers:{
                    token:token.value
                }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    const login = async(correo,contrasena)=>{
        try {
            loading.value=true
            const r = await axios.post(`api/usuarios/login`,{
                correo:correo,
                contrasena:contrasena
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
        }finally{
            loading.value=false
        }
    }
    return { postusuarios, putusuarios, putusuariosActivar, putusuariosDesactivar, loading, listarUsuarios, login,token,usuarios}
}, {
    persist:true
})