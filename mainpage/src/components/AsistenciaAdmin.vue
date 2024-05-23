<template>
    <!-- loading-->
    <div class="container d-flex justify-content-center align-items-center h-450" v-if="loading">
        <div class="spinner-grow primary-normal div-size-72" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Header -->
    <div class="row container-fluid" v-if="!loading">
        <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">
            <div class="col-2 text-center">
                Ramos
            </div>
            <div class="col-2 text-center">
                Asistidos
            </div>
            <div class="col-2 text-center">
                Ausentes
            </div>
            <div class="col"></div>
            <div class="col-2 text-center">
                Detalle
            </div>
        </div>
        <!-- Body -->
        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center"
            v-for="(ramo, index) in ramos" :key="index">
            <div class="col-2 text-center">
                {{ getAño(ramo.ID) }}
            </div>
            <div class="col-2 text-center">
                {{ parseFecha(ramo.FechaInicio) }}
            </div>
            <div class="col-2 text-center">
                {{ parseFecha(ramo.FechaTermino) }}
            </div>
            <div class="col">
                <button class="btn-light-50 bold btn-size-150" @click="add(ramo)">
                    Modificar
                </button>
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
                <div class="pill-yellow pill-size-150" v-if="ramo.Estado == 'Pendiente'">
                    {{ ramo.Estado }}
                </div>
                <div class="pill-green pill-size-150" v-if="ramo.Estado == 'Activo'">
                    {{ ramo.Estado }}
                </div>
                <div class="pill-gray pill-size-150" v-if="ramo.Estado == 'Finalizado'">
                    {{ ramo.Estado }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
import moment from 'moment';
import EditarRamo from '@/components/EditarRamo.vue';
import ENDPOINTS from '../../../ENPOINTS.json';

export default {
    name: 'VerRamos',
    data() {
        return {
            loading: true,
            ramos: null,
            OverlayAgregar: false,
            ramo: null
        }
    },
    mounted() {
        this.getRamos();
    },
    methods: {
        async getRamos() {
            try {
                const response = await axios.get(ENDPOINTS['bff-horarios'] + '/ramos');
                this.ramos = response.data;
                this.ramos.sort((a, b) => {
                    const startDateA = new Date(a.FechaInicio);
                    const startDateB = new Date(b.FechaInicio);
                    return startDateB - startDateA;
                });
                this.ramos = this.ramos.map(ramo => {
                    ramo.FechaInicio = ramo.FechaInicio.split('T')[0];
                    ramo.FechaTermino = ramo.FechaTermino.split('T')[0];
                    ramo.FechaInicio = moment(ramo.FechaInicio, "YYYY-MM-DD").format('DD/MM/YYYY');
                    ramo.FechaTermino = moment(ramo.FechaTermino, "YYYY-MM-DD").format('DD/MM/YYYY');

                    return ramo;
                });
                this.loading = false;
            } catch (error) {
                this.loading = false;
            }
        },
        getAño(ramo) {
            return ramo.split('-')[1];
        },
        parseFecha(fecha) {
            moment.locale('es');
            return moment(fecha, 'DD/MM/YYYY').format('DD [de] MMMM');
        },
        add(ramo) {
            this.ramo = ramo;
            this.OverlayAgregar = true;
        },
        close() {
            this.OverlayAgregar = false;
        }
    },
    components: {
        
    }
}
</script>