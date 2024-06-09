import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"



export const useStoreMaquina = defineStore("maquina", () =>{
    let loading = ref(false)
    let maquinas = ref([]);
    const useUsuario = useStoreUsuario()
    const listarMaquinas = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/maquinas",{
            headers:{
                token:useUsuario.token
            }
          });
          maquinas.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de sedes:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    const postMaquinas = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/maquinas/agregar", data, {
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
    const putMaquinas  = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/maquinas/actualizar/${id}`, data,{
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
    const putMaquinasActivar = async(id)=>{
        try {
            loading.value=true
            console.log(useUsuario.token);
            const r = await axios.put(`api/maquinas/activar/${id}`,{},{
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
    const putMaquinasDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/maquinas/desactivar/${id}`,{},{
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

    return {postMaquinas, putMaquinas, putMaquinasActivar, putMaquinasDesactivar, loading, listarMaquinas, maquinas}
    
},{persist:true})