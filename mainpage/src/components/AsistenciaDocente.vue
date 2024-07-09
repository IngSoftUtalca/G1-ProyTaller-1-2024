<template>    
    <div class="w-95 mt-5">
        <div class="container-fluid" v-if="!loading">
            <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">
                <div class="col-2 text-center">Curso</div>
                <div class="col-2 text-center">Fecha</div>
                <div class="col-2 text-center">Hora</div>
                <div class="col-2 text-center">Estado</div>
                <div class="col-2 text-center">Justificacion</div>
                <div class="col-2 text-center"></div>
            </div>
        </div>

        <div class="row h-100 mx-0 secondary-bg text-center bold d-flex align-items-center" v-for="asistencia in asistencias" :key="asistencia.Fecha">
            <div class="col-2 text-center">{{ asistencia.Curso }}</div>
            <div class="col-2 text-center">{{ formatFecha(asistencia.Fecha) }}</div>
            <div class="col-2 text-center">{{ formatHora(asistencia.Hora_Inicio) }} - {{ formatHora(asistencia.Hora_Termino) }}</div>            
            <div class="col-2 d-flex justify-content-center align-items-center">
                <div :class="getStatusClass(asistencia.Estado)" v-if="asistencia.Estado">
                    {{ asistencia.Estado }}
                </div>
            </div>
            <div class="col-2 text-center">
                <div :class="getJustificationClass(asistencia.Justificacion)">
                    {{ asistencia.Justificacion != "NULL"? asistencia.Justificacion : "No justificado"}}
                </div>
            </div>
            <div class="col" v-if="asistencia.Justificacion == NULL">
                <button class="btn-primary-16 btn-size-120" @click.prevent="add">
                    <span class="bold">Justificar</span>
                </button>
            </div>
        </div>
        <div class="underlay" v-if="OverlayJustificar" @click="close">
            <JustificarInasistencia class="overlay" v-if="OverlayJustificar" @click.stop @close="close" />
        </div>
    </div>
</template>

<script>    
    import JustificarInasistencia from '@/components/JustificarInasistencia.vue';
    import axios from 'axios';
    import moment from 'moment';
    import ENDPOINTS from '../../../ENPOINTS.json';   
    import 'moment/locale/es'

    moment.locale('es');

    export default {
        name: 'AsistenciaDocente',
        data() {
            return {
                loading: true,
                asistencias: [],
                OverlayJustificar: false,
                NULL: "NULL"
            }
        },
        async mounted() {
            await this.getAsistencias();
            this.loading = false;
        },
        methods: {
            async getAsistencias() {
                const rut = this.$route.params.rut;
                await axios.post(ENDPOINTS["bff-datosasistencia"] + "/getClases", { rut: rut }, { headers: { "Content-Type": "application/json" } })
                    .then((response) => {
                        this.asistencias = response.data.result;
                    });
            },
            add() {
                this.OverlayJustificar = true;
            },
            close() {
                this.OverlayJustificar = false;
            },
            getStatusClass(status) {
                return {
                    'pill-yellow': status === 'No asistido',
                    'pill-green': status === 'asistio',
                };
            },
            getJustificationClass(justification) {
                return {
                    '': justification == null || justification != null,
                };
            },
            formatFecha(fecha) {
                return moment(fecha).format('DD MMMM YYYY');
            },
            formatHora(hora) {
                const [horas, minutos] = hora.split(':');
                return `${horas}:${minutos}`;
            }
        },
        components: {
            JustificarInasistencia
        }
    }
</script>