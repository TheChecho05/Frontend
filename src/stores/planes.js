import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"



export const useStorePlan = defineStore("plan", () =>{
    let loading = ref(false)
    let planes = ref([]);
    const useUsuario = useStoreUsuario()
    const listarPlanes = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/plan",{
            headers:{
                token:useUsuario.token
            }
          });
          planes.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de sedes:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    const postPlanes = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/plan/agregar", data, {
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
    const putPlanes = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/plan/actualizar/${id}`, data,{
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
    const putPlanesActivar = async(id)=>{
        try {
            loading.value=true
            console.log(useUsuario.token);
            const r = await axios.put(`api/plan/activar/${id}`,{},{
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
    const putPlanesDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/plan/desactivar/${id}`,{},{
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

    return {postPlanes, putPlanes, putPlanesActivar, putPlanesDesactivar, loading, listarPlanes, planes}
    
},{persist:true})