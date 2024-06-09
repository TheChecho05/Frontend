import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"



export const useStorePago = defineStore("pago", () =>{
    let loading = ref(false)
    let pagos = ref([]);
    const useUsuario = useStoreUsuario()
    const listarPagos = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/pagos",{
            headers:{
                token:useUsuario.token
            }
          });
          pagos.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de pagos:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    
    const postPagos = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/pagos/agregar", data, {
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
    const putPagos  = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/pagos/actualizar/${id}`, data,{
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
    return {postPagos, putPagos, loading, listarPagos, pagos}
    
},{persist:true})