import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"



export const useStoreMantenimiento = defineStore("mantenimiento", () =>{
    let loading = ref(false)
    let mantenimientos = ref([]);
    const useUsuario = useStoreUsuario()
    const listarMantenimientos = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/mantenimientos",{
            headers:{
                token:useUsuario.token
            }
          });
          mantenimientos.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de sedes:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    
    const postMantenimientos = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/mantenimientos/agregar", data, {
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
    const putMantenimientos  = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/mantenimientos/actualizar/${id}`, data,{
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
    return {postMantenimientos, putMantenimientos, loading, listarMantenimientos, mantenimientos}
    
},{persist:true})