<template>
    <div>
        <div class="col w-120">
            <button class="btn-primary-16 btn-size-120" @click.prevent="add">
                <span class="bold">Agregar</span>
                <img src="@/assets/plus.svg" alt="Agregar">
            </button>
        </div>
        <div class="underlay" v-if="OverlayAgregar" @click="close">
            <AgregarAdministrador class="overlay" v-if="OverlayAgregar" @click.stop @close="close"/>
        </div>
        <div class="container d-flex justify-content-center align-items-center h-450" v-if="loading">
            <div class="spinner-grow primary-normal div-size-72" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div class="row container-fluid" v-if="!loading">
            <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">
                <div class="col-2 text-center">R.U.T</div>
                <div class="col-2 text-center">Nombre</div>
                <div class="col-2 text-center">Facultad</div>
                <div class="col-2 text-center">Campus</div>
                <div class="col-2 text-center"></div>
            </div>
            <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center"
                 v-for="(admin, index) in administradores" :key="index">
                <div class="col-2 text-center">{{ admin.rut }}</div>
                <div class="col-2 text-center">{{ admin.nombre }}</div>
                <div class="col-2 text-center">{{ admin.facultad }}</div>
                <div class="col-2 text-center">{{ admin.campus }}</div>
                <div class="col">
                    <button class="btn-light-50 bold btn-size-150" @click="add">
                        Modificar
                    </button>
                </div>
            </div>
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
            loading: true
        }
    },
    methods: {
    add() {
        this.OverlayAgregar = true;
    },
    close() {
        this.OverlayAgregar = false;
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