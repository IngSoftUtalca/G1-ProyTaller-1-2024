<template>
    <div class="container-fluid w-90">
        <div class="row container-fluid my-14 d-flex justify-content-end">
            <button class="btn-primary-16 btn-size-120" @click="add">
                <span class="bold">
                    Agregar
                </span>
                <img src="@/assets/plus.svg" alt="Agregar">
            </button>
        </div>
        <div class="underlay" v-if="OverlayAgregar" @click="close">
            <AgregarPeriodo class="overlay" v-if="OverlayAgregar" @click.stop @close="close"/>
        </div>
        <div class="row container-fluid">
            <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">
                <div class="col-2 text-center">
                    Año
                </div>
                <div class="col-2 text-center">
                    Inicio
                </div>
                <div class="col-2 text-center">
                    Termino
                </div>
                <div class="col text-end">
                    Estado
                </div>
            </div>
            <div class="row h-100 secondary-bg text-center d-flex align-items-center" 
            v-for="(periodo, index) in periodos" :key="index ">
                <h1>Periodo {{ periodo }}</h1>
            </div>
        </div>
    </div>
</template>

<script>
    import AgregarPeriodo from '@/components/AgregarPeriodo.vue';
    export default {
        name: 'PeriodosWeb',
        data() {
            return {
                periodos: [1, 2, 3, 4, 5],
                OverlayAgregar: true
            }
        },
        methods: {
            add() {
                this.OverlayAgregar = true;
            },
            close() {
                this.OverlayAgregar = false;
            }
        },
        components: {
            AgregarPeriodo
        }
    }
</script>