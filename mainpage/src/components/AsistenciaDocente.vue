<template>    
    <div class="background">
        <div class="row container-fluid" v-if="!loading">
            <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">

                <div class="col-2 text-center">
                    Curso
                    
                </div>
                
                <div class="col-2 text-center">
                    Fecha
                </div>
                
                <div class="col-2 text-center">
                    Bloque
                </div>
                
                <div class="col-2 text-center">
                    Estado
                </div>
                
                <div class="col-2 text-center">
                    Justificacion
                </div>
                
                <div class="col-2 text-center">
                    
                </div>


           
            </div>
        </div>

        <!--
        Tuplas
        -->
        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center" v-for="(asistencia, index) in asistencias" :key="index">
            
            <div class="col-2 text-center">
                {{ getCurso(asistencia.curso) }}
            </div>
            
            <div class="col-2 text-center">
                {{ parseFecha(asistecia.fecha) }}
            </div>
            
            <div class="col-2 text-center">
                {{ getBloque(asistencia.bloque) }}
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
                <div class="pill-yellow pill-size-150" v-if="asistecia.justificacion == null">
                    <div class="col-2 text-center">
                            <div class="col-1 container-fluid mt-24 d-flex justify-content-end" v-if="!loading">
                                <button class="btn-primary-16 btn-size-120" @click.prevent="add">
                                    <span class="bold">Agregar</span>
                                    <img src="@/assets/plus.svg" alt="Agregar">
                                </button>
                            </div>
                            <div class="underlay" v-if="OverlayJustificar" @click="close">
                                <JustificarInasistencia class="overlay" v-if="OverlayJustificar" @click.stop @close="close" />
                            </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    
</template>

<script>    
    import JustificarInasistencia from '@/components/JustificarInasistencia.vue';
    //import moment from 'moment';    
    //import axios from 'axios';
    //import ENDPOINTS from '../../../ENPOINTS.json';   
    export default {
        name: 'AsistenciaDocente',
        data() {
            return {
                loading: true,
                asistencias: null,
                OverlayJustificar: false,
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
            add() {
                
                this.OverlayJustificar = true;
            },
            close() {
                this.OverlayJustificar = false;
            }
            
        },
        components: {
        JustificarInasistencia
        }
    }
</script>