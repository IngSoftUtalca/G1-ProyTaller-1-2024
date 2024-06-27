<template> 
    <div class="container-fluid d-flex w-90">
        <div class="container-fluid  w-95 mt-3">
            <div class="row container-fluid my-14 d-flex justify-content-end">
                <div class="container-fluid">
                    <div class="row contaiter d-flex justify-content-center align-items-center primary-border h-60 r-18">
                        <div class="col container d-flex justify-content-start align-items-cente">
                            <button class="btn-primary-16 btn-size-120">
                            <span class="bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                                </svg>
                            </span>
                            </button>
                        </div>
                    <div class="col d-flex justify-content-center align-items-center">
                        <p class="m-0 align-middle bold font-22">Semestre: 2024-1 {{ semestre }}</p>
                    </div>
            <div class="col d-flex justify-content-end align-items-center">
                <div class="size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <div class="col container d-flex justify-content-start align-items-cente">
                <button class="btn-primary-16 btn-size-120">
                    <span class="bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                        </svg>
                    </span>
                </button>
                </div>
                    </div>
                </div>
            </div>

        </div>
    </div> 
    <!-- body -->
    <div class="row container-fluid" v-if="!loading">
        <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center" v-if="!verdocente">

            <div class="col-2 text-center" >
                Ramo
            </div>
            <div class="col-2 text-center">
                Asistidos
            </div>
            <div class="col-2 text-center">
                Ausentes
            </div>
            <div class="col">

            </div>
            <div class="col-2 text-center">
                Detalle
            </div>

        </div>
        <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center" v-if="verdocente">
            <div class="col-2 text-center">
                Docente
            </div>
            <div class="col-2 text-center">
                fecha
            </div>
            <div class="col-2 text-center">
                estado
            </div>
            <div class="col">

            </div>
            <div class="col-2 text-center">
                Justificativo
            </div>
        </div>





        <div v-if="!verdocente">
            <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center"  v-for="[key, value] of Object.entries(this.ramo2)" :key="key" >
                <div class="col-2 text-center">
                    {{value[0].Ramo || value[0].Semana}}
                </div>
                <div class="col-2 text-center" >
                    {{ (value[0].Asistido) }}
                </div>
                <div class="col-2 text-center">
                    {{ value[0].Ausente}}
                </div>
                <div class="col">
                </div>
                <div class="col-2 d-flex justify-content-center align-items-center">

                    <button class="btn-light-50 bold btn-size-150"  @click="getDatosAsistenciaSemanas(value[0].Ramo )" v-show="!versemana">
                        Ver
                    </button>
                    <button class="btn-light-50 bold btn-size-150"  @click="getDatosAsistenciaUnaSemana(ramoselect, key)" v-show="versemana">
                        Ver
                    </button>
                </div>
            </div>
        </div>
        <div v-if="verdocente">
            <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center" v-for="[key, value] of Object.entries(this.ramo2)" :key="key" >
                <div class="col-2 text-center">
                    {{value.Nombre}}
                </div>
                <div class="col-2 text-center" >
                    {{ (value.Dia) }}
                </div>
                <div class="col-2 text-center">
                    {{value.Estado}}
                </div>
                <div class="col">
                </div>
            </div>

        </div>
           </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import ENDPOINTS from '../../../ENPOINTS.json';
    

export default {
    name: 'VerRamos',
    data() {
        return {
            loading: true,
            ramos: null,
            OverlayAgregar: false,
            ramo: null,
            ramo2: null ,
            ramoselect: null,
            verdocente: false,
            versemana: false

        }
    },
    async mounted() {
        await this.getDatosAsistencia();
        //this.getRamos();
        this.loading = false;
    },
    methods: {


        async getDatosAsistencia(){
            try {
                const response = await axios.post(ENDPOINTS['bff-datosasistencia'] + '/datosasistenciageneral',{
                    rut:"20509736"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                this.ramo2  = response.data
            }catch (error) {
                console.log(error)
            }
        },

        async getDatosAsistenciaSemanas(ramo){
            this.ramoselect = ramo 
            this.versemana = true
            this.verdocente = false
            console.log(ramo)
            try {
                const response = await axios.post(ENDPOINTS['bff-datosasistencia'] + '/datosasistenciasemanas',{
                    rut:"20509736",
                    ramo: ramo
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                this.ramo2  = response.data
            }catch (error) {
                console.log(error)
            }
        },

        async getDatosAsistenciaUnaSemana(ramo,fecha){
            this.versemana = false
            this.verdocente = true
            var losta = fecha.split("-")
            
            var Nano = losta[0]
            var Nsemana = losta[1]
            console.log(Nsemana+" | "+Nano)
            try {
                const response = await axios.post(ENDPOINTS['bff-datosasistencia'] + '/datoEnsemana',{
                    rut:"20509736",
                    ramo: ramo,
                    Nano: parseInt(Nano),
                    NSemana: parseInt(Nsemana)
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                this.ramo2  = response.data.result
                console.log(this.ramo2)
            }catch (error) {
                console.log(error)
            }
        },

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