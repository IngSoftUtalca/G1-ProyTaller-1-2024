<template>
    <div class="container-fluid d-flex w-90">
      <div class="col d-flex justify-content-end">
        <table
          class="w-90 mx-4 mt-3 text-center gray-border"
          v-if="!loading"
          :key="count"
        >
          <thead class="primary-bg h-40">
            <tr>
              <th>R.U.T</th>
              <th>Nombre</th>
              <th>Facultad</th>
              <th>Campus</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="secondary-bg">
            <tr class="h-36" v-for="(admin, index) in administradores" :key="index">
              <td class="gray-border">{{ admin.RUT }}</td>
              <td class="gray-border text-start px-3">{{ admin.Nombre }}</td>
              <td class="gray-border">{{ admin.Facultad }}</td>
              <td class="gray-border">{{ admin.Campus }}</td>
              <td
                class="gray-border h-36 px-3 d-flex justify-content-end align-items-center"
              >
                <button
                  class="btn-gray btn-size-85 bold font-12"
                  @click="deleteAdmin(admin.RUT)">
                 
    
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col w-120">
            <button class="btn-primary-16 btn-size-120" @click.prevent="add">
                <span class="bold">Agregar</span>
                <img src="@/assets/plus.svg" alt="Agregar">
            </button>
        </div>
        <div class="underlay" v-if="OverlayAgregar" @click="close">
            <AgregarAdministrador class="overlay" v-if="OverlayAgregar" @click.stop @close="close"/>
        </div>
      

    </div>
    <!-- loading-->
    <div
      class="container d-flex justify-content-start align-items-center h-450"
      v-if="loading"
    >
      <div class="spinner-grow primary-normal div-size-72" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </template>
  
<script>
import AgregarAdministrador from '@/components/AgregarAdministrador.vue';
import axios from 'axios';
import ENDPOINTS from '../../../ENPOINTS.json';

export default {
    name: 'AdministradoresWeb',
    data() {
        return {
            OverlayAgregar: false,
            administradores: [],
            loading: false
        }
    },
    methods: {
    add() {
        this.OverlayAgregar = true;
    },
    close() {
        this.OverlayAgregar = false;
    },
    async deleteAdmin(RUT) {
     
        
      await axios.post(
        ENDPOINTS["ms-gestoradmin"] + "/quitar",
        {
          rut: RUT,
      
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.loading = false;
      this.$emit("close");
    },
    async getAdmins() {
      await axios
        .get(ENDPOINTS["bff-datosadministradores"] + "/all-admins")
        .then((response) => {
          this.administradores = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
},
    mounted() {
        this.getAdmins();
    },
    components: {
        AgregarAdministrador
    }
}
</script>