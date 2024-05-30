<template>
    <div class="container-fluid  w-95 mt-3">
        <!-- panel superior del horario -->
        <HorarioDocenteEstados class="row d-flex justify-content-center p-0 m-0"></HorarioDocenteEstados>
        <VerHorarioDocente class="row d-flex justify-content-center mt-3"></VerHorarioDocente>
    </div>
</template>

<script>
import HorarioDocenteEstados from '@/components/HorarioDocenteEstados.vue';
import VerHorarioDocente from '@/components/VerHorarioDocente.vue';

export default {
    name: 'HorarioDocente',
    mounted() {

    },
    methods: {
        add() {
            console.log('Agregado');
        }
    }, components: {
        HorarioDocenteEstados, 
        VerHorarioDocente
    }
}
</script>