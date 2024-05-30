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
        <div class="row h-100 mx-0 font-20 bold secondary-bg mb-1 d-flex align-items-center"
            v-for="(bloque, index) in bloques" :key="index">
            <div class="col-1 px-0 text-center">
                {{ formatTime(bloque.inicio) }}-{{ formatTime(bloque.fin) }}
            </div>
            <div class="col text-center">
                <p>{{ getAsignacion(1, index + 1).Ramo }}</p>
            </div>
            <div class="col text-center">
                <p>{{ getAsignacion(2, index + 1).Ramo }}</p>
            </div>
            <div class="col text-center">
                <p>{{ getAsignacion(3, index + 1).Ramo }}</p>
            </div>
            <div class="col text-center">
                <p>{{ getAsignacion(4, index + 1).Ramo }}</p>
            </div>
            <div class="col text-center">
                <p>{{ getAsignacion(5, index + 1).Ramo }}</p>
            </div>
            <div class="col text-center">
                <p>{{ getAsignacion(6, index + 1).Ramo }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import constances from '@/shared/constances.json';
import ENDPOINTS from '../../../ENPOINTS.json';
import axios from 'axios';

export default {
    name: 'VerHorarioDocente',
    data() {
        return {
            bloques: constances.bloques,
            asignaciones: [],
            rut: this.$route.params.rut,
        }
    },
    async mounted() {
        try {
            await axios.get(
                ENDPOINTS["bff-horarios"] + "/asignaciones/" + this.rut,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((response) => {
                this.asignaciones = response.data;
            })
        } catch (error) {
            console.log(error);
        }
        console.log(this.asignaciones);
        this.loading = false;
    },
    methods: {
        formatTime(time) {
            let date = new Date(`1970-01-01T${time}Z`);
            let hours = date.getUTCHours();
            let minutes = date.getUTCMinutes();
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        },
        getAsignacion(dia, bloque) {
            try {
                let asignacion = this.asignaciones.find(asignacion => {
                    return asignacion.Dia_Semana === dia.toString() && asignacion.Bloque === bloque;
                });
                return asignacion ? asignacion : ' ';
            } catch (error) {
                return error.message;
            }
        }
    }
}

</script>