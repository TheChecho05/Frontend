import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"


export const useStoreIngreso = defineStore("ingreso", () =>{
    let loading = ref(false)
    let ingresos = ref([]);
    const useUsuario = useStoreUsuario()
    const listarIngresos = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/ingresos",{
            headers:{
                token:useUsuario.token
            }
          });
          ingresos.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de ingresos:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    const postIngresos = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/ingresos/agregar", data, {
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
    
    return {postIngresos, loading, listarIngresos, ingresos}
    
},{persist:true})