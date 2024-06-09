import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario} from "./usuarios"



export const useStoreVenta = defineStore("venta", () =>{
    let loading = ref(false)
    let ventas = ref([]);
    const useUsuario = useStoreUsuario()
    const listarVentas = async () => {
        try {
          loading.value = true;
          console.log(useUsuario.token)
          const response = await axios.get("api/ventas",{
            headers:{
                token:useUsuario.token
            }
          });
          ventas.value = response.data; 
          return response;
        } catch (error) {
          console.error("Error al obtener la lista de ventas:", error);
          throw error;
        } finally {
          loading.value = false;
        }
      };
    const postVentas = async(data)=>{
        try {
            console.log(useUsuario.token);
            loading.value=true
            const r = await axios.post("api/ventas/agregar", data, {
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
    const putVentas = async(id, data)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/ventas/actualizar/${id}`, data,{
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
    const putVentasActivar = async(id)=>{
        try {
            loading.value=true
            console.log(useUsuario.token);
            const r = await axios.put(`api/ventas/activar/${id}`,{},{
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
    const putVentasDesactivar = async(id)=>{
        try {
            loading.value=true
            const r = await axios.put(`api/ventas/desactivar/${id}`,{},{
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

    return {postVentas, putVentas, putVentasActivar, putVentasDesactivar, loading, listarVentas, ventas}
    
},{persist:true})