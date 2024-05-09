<template>
    <div class="container-fluid w-90">
        <!--  Agregar Periodos  -->
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
        <!--  Ver periodos  -->
        <VerPeriodos />
    </div>
</template>

<script>
    import AgregarPeriodo from '@/components/AgregarPeriodo.vue';
    import VerPeriodos from '@/components/VerPeriodos.vue';

    export default {
        name: 'PeriodosWeb',
        data() {
            return {
                periodos: [1, 2, 3, 4, 5],
                OverlayAgregar: false
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
            AgregarPeriodo,
            VerPeriodos
        }
    }
</script>