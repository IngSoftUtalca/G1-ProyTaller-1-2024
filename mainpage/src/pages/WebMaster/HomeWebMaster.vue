<template>
    <HeaderHome :usuario="this.rut" />
    <!--  Menú opciones  -->
    <div class="container-fluid mt-108 w-95">
        <div class="row h-55">
            <div class="col w-220 rt-50 p-0 d-flex justify-content-center align-items-center" 
                :class="docentes ? 'secondary-bg' : 'primary-bg'"  
                @click="selectDocente">
                <div class="font-20 bold pt-3">Docentes</div>
            </div>
            <div class="col w-220 ms-4 p-0 rt-50 d-flex justify-content-center align-items-center" 
                :class="admin ? 'secondary-bg' : 'primary-bg'"  
                @click="selectAdmin">
                <div class="font-20 bold pt-3">Administradores</div>
            </div>
            <div class="col w-220 ms-4 p-0 rt-50 d-flex justify-content-center align-items-center" 
                :class="periodos ? 'secondary-bg' : 'primary-bg'"  
                @click="selectPeriodos">
                <div class="font-20 bold pt-3">Periodos</div>
            </div>
        </div>
        <div class="row primary-bg r-4-ci h-12"></div>
    </div>
    <div class="d-flex justify-content-center" :class="{ 'background-color': isPeriodosSelected }">
        <HomeText v-if="home" />
        <DocentesWeb v-if="docentes" />
        <AdministradoresWeb v-if="admin" />
        <PeriodosWeb v-if="periodos"/>
    </div>
    <MainFooter />
</template>

<script>
    import MainFooter from '@/components/MainFooter.vue';
    import HeaderHome from '@/components/HeaderHome.vue';
    import PeriodosWeb from '@/components/PeriodosWeb.vue';
    import HomeText from '@/components/HomeText.vue';
    import AdministradoresWeb from '@/components/AdministradoresWeb.vue';
    import DocentesWeb from '@/components/DocentesWeb.vue';

    export default {
        name: 'HomeWebMaster',
        data() {
            return {
                rut: 'xxxxxxxx',
                home: false,
                docentes: false,
                admin: false,
                periodos: true
            }
        },
        mounted() {
            this.rut = this.$route.params.rut;
            document.title = 'UTalca | WebMaster';
        },
        methods: {
            selectDocente() {
                this.home = !this.home;
                this.docentes = !this.docentes;
                if (this.docentes) {
                    this.home = false;
                    this.admin = false;
                    this.periodos = false;
                }
            },
            selectAdmin() {
                this.home = !this.home; 
                this.admin = !this.admin;
                if (this.admin) {
                    this.home = false;
                    this.docentes = false;
                    this.periodos = false;
                }
            },
            selectPeriodos() {
                this.home = !this.home;
                this.periodos = !this.periodos;
                if (this.periodos) {
                    this.home = false;
                    this.docentes = false;
                    this.admin = false;
                }
            }
        },
        components: {
            HeaderHome,
            MainFooter,
            PeriodosWeb,
            HomeText,
            AdministradoresWeb,
            DocentesWeb
        }
    }
</script>