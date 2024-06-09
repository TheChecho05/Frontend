import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"



export const useStoreInventario = defineStore("inventario", () =>{
    let loading = ref(false)
    let inventarios = ref([]);
    const useUsuario = useStoreUsuario()
    const listarInventarios = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/inventario",{
            headers:{
                token:useUsuario.token
            }
          });
          inventarios.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de sedes:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    const postInventarios = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/inventario/agregar", data, {
                headers:{
                    token:useUsuario.token
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
    const putInventarios = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/inventario/actualizar/${id}`, data,{
                headers:{
                    token:useUsuario.token
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
    const putInventariosActivar = async(id)=>{
        try {
            loading.value=true
            console.log(useUsuario.token);
            const r = await axios.put(`api/inventario/activar/${id}`,{},{
                headers:{
                    token:useUsuario.token
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
    const putInventariosDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/inventario/desactivar/${id}`,{},{
                headers:{
                    token:useUsuario.token
                }
            })
            return r
        } catch (error) {
            loading.value=true
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        }finally{
            loading.value=false
        }
    }

    return {postInventarios, putInventarios, putInventariosActivar, putInventariosDesactivar, loading, listarInventarios, inventarios}
    
},{persist:true})