<template>
    <div class="container-fluid  w-95 mt-3">
        <!-- panel superior del horario -->
        <HorarioDocenteEstados class="row d-flex justify-content-center p-0 m-0" @refresh="refresh"></HorarioDocenteEstados>
        <!-- Horario de un docente -->
        <VerHorarioDocente class="row d-flex justify-content-center mt-3" :rut="this.$route.params.rut" :key="componentKey"></VerHorarioDocente>
    </div>
</template>

<script>
import HorarioDocenteEstados from '@/components/HorarioDocenteEstados.vue';
import VerHorarioDocente from '@/components/VerHorarioDocente.vue';

export default {
    name: 'HorarioDocente',
    data() {
        return {
            OverlayAgregar: false,
            componentKey: 0
        }
    },
    mounted() {
    },
    methods: {
        refresh() {
            this.componentKey += 1;
        }
    }, components: {
        HorarioDocenteEstados, 
        VerHorarioDocente
    }
}
</script>