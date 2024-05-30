<template>
    <!-- cargando -->
    <div class="container-fluid h-450 d-flex justify-content-center align-items-center" v-if="loading">
        <div class="spinner-grow primary-normal div-size-72" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Tabla de horario -->
    <div class="row container-fluid w-100 mx-0 mt-3" v-if="!loading">
        <!-- Header -->
        <div class="row rt-50 h-55 mx-0 font-20 bold primary-bg d-flex align-items-center">
            <div class="col-1 text-center">
                Hora
            </div>
            <div class="col text-center">
                Lunes
            </div>
            <div class="col text-center">
                Martes
            </div>
            <div class="col text-center">
                Miercoles
            </div>
            <div class="col text-center">
                Jueves
            </div>
            <div class="col text-center">
                Viernes
            </div>
            <div class="col text-center">
                Sabado
            </div>
        </div>
        <!-- Body -->
        <div class="row h-100 mx-0 font-20 bold secondary-bg mb-1 d-flex align-items-center" v-for="(bloque, index) in bloques"
            :key="index">
            <div class="col-1 px-0 text-center">
                {{ formatTime(bloque.inicio) }}-{{ formatTime(bloque.fin) }}
            </div>
            <div class="col text-center">
                <p>Ramo 1</p>
            </div>
            <div class="col text-center">
                <p>Ramo 2</p>
            </div>
            <div class="col text-center">
                <p>Ramo 3</p>
            </div>
            <div class="col text-center">
                <p>Ramo 4</p>
            </div>
            <div class="col text-center">
                <p>Ramo 5</p>
            </div> 
            <div class="col text-center">
                <p>Ramo 6</p>
            </div>
        </div>
    </div>
</template>

<script>
import constances from '@/shared/constances.json';
export default {
    name: 'VerHorarioDocente',
    data() {
        return {
            bloques: constances.bloques,
            asignaciones: [],
        }
    },
    mounted() {
        console.log(this.asignaciones);
        this.loading = false;
    },
    methods: {
        formatTime(time) {
            let date = new Date(`1970-01-01T${time}Z`);
            let hours = date.getUTCHours();
            let minutes = date.getUTCMinutes();
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        }
    }
}

</script>