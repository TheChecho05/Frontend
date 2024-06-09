import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useStoreUsuario } from "./usuarios";

export const useStoreCliente = defineStore("cliente", () => {
  let loading = ref(false);
  let clientes = ref([]);
  const useUsuario = useStoreUsuario();

  const listarClientes = async () => {
    try {
      loading.value = true;
      const response = await axios.get("api/clientes", {
        headers: {
          token: useUsuario.token,
        },
      });
      clientes.value = response.data;
      return response;
    } catch (error) {
      console.error("Error al obtener la lista de clientes:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getClientsById = async (id) => {
    try {
      console.log(id);
      loading.value = true; ;
      const response = await axios.get(`api/clientes/${id}`, {
        headers: {
          token: useUsuario.token,
        },
      });
      clientes.value = response.data;
      return response;
    } catch (error) {
      console.error("Error al obtener la lista de clientes:", error);
    } finally {
      loading.value = false;

    }
  }

  const postCliente = async (data) => {
    try {
      loading.value = true;
      const r = await axios.post("api/clientes/agregar", data, {
        headers: {
          token: useUsuario.token,
        },
      });
      return r;
    } catch (error) {
      console.error("Error al agregar el cliente:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  

  const putClientes = async (id, data) => {
    try {
      console.log(data);
      loading.value = true;
      const r = await axios.put(`api/clientes/actualizar/${id}`, data, {
        headers: {
          token: useUsuario.token,
        },
      });
      return r;
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getSeguimientos = async (id) => {
    try {
      loading.value = true;
      const response = await axios.get(`/api/clientes/seguimientos/${id}`, {
        headers: {
          token: useUsuario.token,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener los seguimientos del cliente:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const putClienteActivar = async (id) => {
    try {
      loading.value = true;
      const r = await axios.put(`api/clientes/activar/${id}`, {}, {
        headers: {
          token: useUsuario.token,
        },
      });
      return r;
    } catch (error) {
      console.error("Error al activar el cliente:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const putClientesDesactivar = async (id) => {
    try {
      loading.value = true;
      const r = await axios.put(`api/clientes/desactivar/${id}`, {}, {
        headers: {
          token: useUsuario.token,
        },
      });
      return r;
    } catch (error) {
      console.error("Error al desactivar el cliente:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    postCliente,
    putClientes,
    putClienteActivar,
    putClientesDesactivar,
    getClientsById,
    loading,
    listarClientes,
    getSeguimientos,
    clientes,
  };
}, { persist: true });
