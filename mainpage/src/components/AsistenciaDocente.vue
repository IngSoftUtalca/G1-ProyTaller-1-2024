<template>
    <!-- loading-->
    <div class="container d-flex justify-content-center align-items-center h-450" v-if="loading">
        
        <div class="spinner-grow primary-normal div-size-72" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    
    </div>
    
    <div class="background">
        <div class="row container-fluid" v-if="!loading">
            <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">

                <div class="col-2 text-center">
                    Bloque
                </div>
                
                <div class="col-2 text-center">
                    Curso
                </div>
                
                <div class="col-2 text-center">
                    Fecha
                </div>
                
                <div class="col-2 text-center">
                    Estado
                </div>
                
                <div class="col-2 text-center">
                    Justificacion
                </div>
                
                <div class="col-2 text-center">
                    <!--Columna para el botn justificar-->
                </div>

            </div>
        </div>

        <!--
        Tuplas
        -->
        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center" v-for="(asistencia, index) in asistencias" :key="index">
            <div class="col-2 text-center">
                {{ getBloque(asistencia.bloque) }}
            </div>
            
            <div class="col-2 text-center">
                {{ getCurso(asistencia.curso) }}
            </div>
            
            <div class="col-2 text-center">
                {{ parseFecha(asistecia.fecha) }}
            </div>
            
            <div class="col-2 d-flex justify-content-center align-items-center">

                <div class="pill-yellow pill-size-150" v-if="asistencia.Estado == 'No asistido'">
                    {{ asistencia.Estado }}
                </div>
                
                <div class="pill-green pill-size-150" v-if="asistencia.Estado == 'asistio'">
                    {{ asistencia.Estado }}
                </div>

            </div>
            
            <div class="col-2 text-center">

                <div class="pill-yellow pill-size-150" v-if="asistecia.justificacion == null">
                    No justificado
                </div>

                <div class="pill-yellow pill-size-150" v-if="asistecia.justificacion != null">
                    {{ getJustificacion(asistecia.justificacion) }}
                </div>
                
            </div>
            
            <div class="col">
                <button class="btn-light-50 bold btn-size-150" @click="add(justificacion)">
                    Justificar
                </button>
            </div>
            
        </div>
    </div>
</template>

<script>    
    //import moment from 'moment';    
    //import axios from 'axios';
    //import ENDPOINTS from '../../../ENPOINTS.json';   
    export default {
        name: 'AsistenciaDocente',
        data() {
            return {
                loading: true,
                asistencias: null,
                OverlayAgregar: false,
                periodo: null
            }
        },
        mounted() {
            this.getAsistencias();
        },
        methods: {
            async getAsistencias() {
                try {
                    //const response = await axios.get(ENDPOINTS['bff-datosasistencia'] + '/datosasistencias');    
                    this.loading = false;
                } catch (error) {
                    this.loading = false;
                }
            },
            add(justificacion) {
                this.justificacion = justificacion;
                this.OverlayJustificacion = true;
            },
            close() {
                this.OverlayJustificacion = false;
            }
        }
    }
</script>