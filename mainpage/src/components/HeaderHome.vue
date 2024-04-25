<template>
    <div class="header container-fluid">
        <div class="row">
            <div class="col d-flex justify-content-center">
                <img src="@/assets/utalca-blanco.svg" alt="UTalca" class="img-fluid">
            </div>
            <div class="col d-flex align-items-center justify-content-end">
                <button class="btn-salir mx-5 btn-size-100 d-flex align-items-center justify-content-center" @click="logout">
                    <span>Salir</span>
                    <img class="icono ps-2" src="@/assets/salir-blanco.svg" alt="Salir">
                </button>
            </div>
        </div>
    </div>
    <div class="h-55 pt-3 secondary-bg-simple primary-semibold font-24 d-flex align-items-center justify-content-end">
        <p class="mx-5">usuario: {{ usuario }}</p>
    </div>
    <div class="d-flex justify-content-center"><div class="w-95 primary-bg h-12 r-4"></div></div>
    <div class="text-center mt-4 font-28">Plataforma de gestión de asistencia docente</div>
</template>

<style scoped lang="scss">
    @import "@/estilos/buttons.scss";
    .btn-salir {
        @extend .btn-primary;
    }
    .btn-salir:hover .icono{
        content: url('~@/assets/salir-negro.svg');
    }
</style>
<script>
    export default {
        name: 'HeaderHome',
        props: ['usuario'],
        methods: {
            logout() {
                this.$router.push({ name: 'landing' });
            }
        }
    }
</script>