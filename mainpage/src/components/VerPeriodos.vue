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
                Año
            </div>
            <div class="col-2 text-center">
                Inicio
            </div>
            <div class="col-2 text-center">
                Termino
            </div>
            <div class="col text-end">
                Estado
            </div>
        </div>
        <!-- Body -->
        <div class="row h-100 secondary-bg text-center d-flex align-items-center" v-for="(periodo, index) in periodos"
            :key="index">
            <div class="col-2">
                {{ periodo.ID }}
            </div>
            <div class="col-2">
                {{ periodo.FechaInicio }}
            </div>
            <div class="col-2">
                {{ periodo.FechaTermino }}
            </div>
            <div class="col text-end">
                {{ periodo.Estado }}
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import ENPOINTS from '../../../ENPOINTS.json';

export default {
    name: 'VerPeriodos',
    data() {
        return {
            loading: true,
            periodos: null
        }
    },
    mounted() {
        this.getPeriodos();
    },
    methods: {
        async getPeriodos() {
            try {
                const response = await axios.get(ENPOINTS['bff-horarios'] + '/periodos');
                this.periodos = response.data;
                this.periodos.sort((a, b) => {
                    const startDateA = new Date(a.FechaInicio);
                    const startDateB = new Date(b.FechaInicio);
                    return startDateB - startDateA;
                });
                this.periodos = this.periodos.map(periodo => {
                    periodo.FechaInicio = periodo.FechaInicio.split('T')[0];
                    periodo.FechaTermino = periodo.FechaTermino.split('T')[0];
                    periodo.FechaInicio = moment(periodo.FechaInicio, "YYYY-MM-DD").format('DD/MM/YYYY');
                    periodo.FechaTermino = moment(periodo.FechaTermino, "YYYY-MM-DD").format('DD/MM/YYYY');

                    return periodo;
                });
                this.loading = false;
            } catch (error) {
                this.loading = false;
            }
        }
    }
}

</script>