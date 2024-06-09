import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"



export const useStoreSede = defineStore("sede", () =>{
    let loading = ref(false)
    let sedes = ref([]);
    const useUsuario = useStoreUsuario()
    const listarSedes = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/sedes",{
            headers:{
                token:useUsuario.token
            }
          });
          sedes.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de sedes:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    const postSedes = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/sedes/agregar", data, {
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
    const putSedes = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/sedes/actualizar/${id}`, data,{
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
    const putSedesActivar = async(id)=>{
        try {
            loading.value=true
            console.log(useUsuario.token);
            const r = await axios.put(`api/sedes/activar/${id}`,{},{
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
    const putSedesDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/sedes/desactivar/${id}`,{},{
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

    return {postSedes, putSedes, putSedesActivar, putSedesDesactivar, loading, listarSedes, sedes}
    
},{persist:true})