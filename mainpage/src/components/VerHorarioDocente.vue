<template>
    <!-- cargando -->
    <div class="container-fluid h-450 d-flex justify-content-center align-items-center" v-if="loading">
        <div class="spinner-grow primary-normal div-size-72" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Tabla de horario -->
    <div class="row container-fluid w-100 mx-0 mt-3" v-if="!loading" :key="componentKey">
        <!-- Header -->
        <div class="row rt-50 h-55 mx-0 font-20 bold primary-bg d-flex align-items-center">
            <div class="col-1 text-center">
                Hora
            </div>
            <div class="col text-center" v-for="(dia, index) in headers" :key="index">
                {{ dia }}
            </div>
        </div>
        <!-- Body -->
        <div class="row hover h-100 mx-0 font-16 bold secondary-bg mb-1 d-flex align-items-center"
            v-for="(bloque, index) in bloques" :key="index">
            <div class="col-1 px-0 text-center">
                {{ formatTime(bloque.inicio) }}-{{ formatTime(bloque.fin) }}
            </div>
            <div class="col container hover-scale text-center" v-for="(dia, i) in dias" :key="i"
                @click="ver(getAsignacion(dia, index + 1))">
                <p class="row">{{ (getAsignacion(dia, index + 1).Ramo || '').split(' ').slice(0, 6).join(' ') }}</p>
            </div>
        </div>
    </div>
    <!-- pop up detalle ramo -->
    <div class="underlay" v-if="OverlayDetalle" @click="close">
        <DetalleInstancia :instancia="instancia" :rut="rut" class="overlay" v-if="OverlayDetalle" @click.stop
            @close="close" />
    </div>
</template>

<script>
import constances from '@/shared/constances.json';
import DetalleInstancia from '@/components/DetalleInstancia.vue';
import ENDPOINTS from '../../../ENPOINTS.json';
import axios from 'axios';

export default {
    name: 'VerHorarioDocente',
    props: ['rut'],
    data() {
        return {
            bloques: constances.bloques,
            asignaciones: [],
            instancia: {},
            dias: [1, 2, 3, 4, 5, 6],
            headers: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
            loading: true,
            OverlayDetalle: false,
            componentKey: 0
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
        console.log(this.rut);
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
        },
        ver(instancia) {
            this.instancia = instancia;
            this.OverlayDetalle = true;
        },
        async close() {
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
            this.componentKey += 1;
            this.OverlayDetalle = false;
        }
    },
    components: {
        DetalleInstancia
    }
}

</script>