<template>
    <div class="container-fluid d-flex justify-content-center align-items-center fullscreen" v-if="loading">
            <div class="spinner-grow primary-normal div-size-72" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
    </div>
    <div v-if="!loading">
        <HeaderHome :usuario="this.rut" />
        <!--  Menú opciones  -->
        <div class="container-fluid mt-108 w-95">
            <div class="row h-55"
                v-if="userType == 'docente' || userType == 'administrador' || userType == 'webmaster'">
                <div class="col w-220 me-4 rt-50 p-0 d-flex justify-content-center align-items-center"
                    :class="asistencia ? 'secondary-bg' : 'primary-bg'" @click="selectAsistencia"
                    v-if="userType == 'docente'">
                    <div class="font-20 bold pt-3">Estado Asistencia</div>
                </div>
                <div class="col w-220 me-4 rt-50 p-0 d-flex justify-content-center align-items-center"
                    :class="horarios ? 'secondary-bg' : 'primary-bg'" @click="selectHorarios"
                    v-if="userType == 'docente'">
                    <div class="font-20 bold pt-3">Horario</div>
                </div>
                <div class="col w-220 me-4 rt-50 p-0 d-flex justify-content-center align-items-center"
                    :class="docentes ? 'secondary-bg' : 'primary-bg'" @click="selectDocente"
                    v-if="userType == 'administrador'">
                    <div class="font-20 bold pt-3">Docentes</div>
                </div>
                <div class="col w-220 me-4 rt-50 p-0 d-flex justify-content-center align-items-center"
                    :class="asistencia ? 'secondary-bg' : 'primary-bg'" @click="selectAsistencia"
                    v-if="userType == 'administrador'">
                    <div class="font-20 bold pt-3">Asistencia</div>
                </div>
                <div class="col w-220 me-4 rt-50 p-0 d-flex justify-content-center align-items-center"
                    :class="horarios ? 'secondary-bg' : 'primary-bg'" @click="selectHorarios"
                    v-if="userType == 'administrador'">
                    <div class="font-20 bold pt-3">horarios</div>
                </div>
                <div class="col w-220 me-4 rt-50 p-0 d-flex justify-content-center align-items-center"
                    :class="docentes ? 'secondary-bg' : 'primary-bg'" @click="selectDocente"
                    v-if="userType == 'webmaster'">
                    <div class="font-20 bold pt-3">Docentes</div>
                </div>
                <div class="col w-220 me-4 p-0 rt-50 d-flex justify-content-center align-items-center"
                    :class="admin ? 'secondary-bg' : 'primary-bg'" @click="selectAdmin" v-if="userType == 'webmaster'">
                    <div class="font-20 bold pt-3">Administradores</div>
                </div>
                <div class="col w-220 p-0 rt-50 d-flex justify-content-center align-items-center"
                    :class="periodos ? 'secondary-bg' : 'primary-bg'" @click="selectPeriodos"
                    v-if="userType == 'webmaster'">
                    <div class="font-20 bold pt-3">Periodos</div>
                </div>
            </div>
            <div class="row primary-bg r-4-ci h-12"></div>
        </div>
        <div class="d-flex justify-content-center" :class="{ 'background-color': isPeriodosSelected }">
            <HomeText v-if="home" />
            <DocentesWeb v-if="docentes" />
            <AdministradoresWeb v-if="admin" />
            <PeriodosWeb v-if="periodos" />
            <HorarioDocente v-if="horarios && userType == 'docente'" />
            <HorarioAdmin v-if="horarios && userType == 'administrador'" />
            <AsistenciaDocente v-if="asistencia && userType == 'docente'" />
            <AsistenciaAdmin v-if="asistencia && userType == 'administrador'" />
        </div>
        <MainFooter />
    </div>
</template>

<script>
import axios from 'axios';
import MainFooter from '@/components/MainFooter.vue';
import HeaderHome from '@/components/HeaderHome.vue';
import PeriodosWeb from '@/components/PeriodosWeb.vue';
import HomeText from '@/components/HomeText.vue';
import AdministradoresWeb from '@/components/AdministradoresWeb.vue';
import DocentesWeb from '@/components/DocentesWeb.vue';
import HorarioDocente from '@/components/HorarioDocente.vue';
import HorarioAdmin from '@/components/HorarioAdmin.vue';
import AsistenciaDocente from '@/components/AsistenciaDocente.vue';
import AsistenciaAdmin from '@/components/AsistenciaAdmin.vue';

export default {
    name: 'HomeWebMaster',
    data() {
        return {
            rut: 'xxxxxxxx',
            userType: null,
            home: true,
            docentes: false,
            admin: false,
            periodos: false,
            horarios: false,
            asistencia: false,
            valido: false,
            loading: true
        }
    },
    async mounted() {
        const ENDPOINTS = require('../../../ENPOINTS.json');
        const validacionrol = ENDPOINTS["ms-validacionrol"];
        //const validacionrol = 'http://localhost:3011';
        this.rut = this.$route.params.rut;
        this.userType = this.$route.params.userType;
        document.title = `UTalca | ${this.userType.toString().toUpperCase()}`;
        try {
            const response = await axios.post(`${validacionrol}/validar`, {
                rut: this.rut,
                rol: this.userType
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { Nombre, Valido } = response.data;
            this.rut = Nombre;
            this.valido = Valido;
        } catch (error) {
            console.log(error);
        }
        if (!this.valido) {
            this.$router.push({ name: 'landing' });
        }
        this.loading = false;
    },
    methods: {
        selectDocente() {
            this.home = !this.home;
            this.docentes = !this.docentes;
            if (this.docentes) {
                this.home = false;
                this.admin = false;
                this.periodos = false;
                this.asistencia = false;
            }
        },
        selectAdmin() {
            this.home = !this.home;
            this.admin = !this.admin;
            if (this.admin) {
                this.home = false;
                this.docentes = false;
                this.periodos = false;
                this.asistencia = false;
            }
        },
        selectPeriodos() {
            this.home = !this.home;
            this.periodos = !this.periodos;
            if (this.periodos) {
                this.home = false;
                this.docentes = false;
                this.admin = false;
                this.asistencia = false;
            }
        },
        selectHorarios() {
            this.home = !this.home;
            this.horarios = !this.horarios;
            if (this.horarios) {
                this.home = false;
                this.asistencia = false;
                this.docentes = false;
                this.admin = false;
                this.periodos = false;
            }
        },
        selectAsistencia() {
            this.home = !this.home;
            this.asistencia = !this.asistencia;
            if (this.asistencia) {
                this.home = false;
                this.horarios = false;
                this.docentes = false;
                this.admin = false;
                this.periodos = false;
            }
        }

    },
    components: {
        HeaderHome,
        MainFooter,
        PeriodosWeb,
        HomeText,
        AdministradoresWeb,
        DocentesWeb,
        HorarioDocente,
        HorarioAdmin,
        AsistenciaDocente,
        AsistenciaAdmin
    }
}
</script>