<template>

    <div class="container-fluid w-95 mx-0 mt-3" v-if="!loading">
        <div class="container-fluid">
            <div class="container-fluid">
                <div class="row contaiter d-flex justify-content-center align-items-center primary-border h-60 r-18">
                    <div class="col d-flex justify-content-center align-items-center">
                        <p class="m-0 align-middle bold font-22">{{ semestre }}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row px-5 rt-50 h-55 mt-3 font-20 bold primary-bg d-flex align-items-center" v-if="!verdocente">

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
                    {{ (value.Dia).slice(0, 10) }}
                </div>
                <div class="col-2 text-center">
                    {{value.Estado}}
                </div>
                <div class="col">
                </div>
                <div class="col-2 d-flex justify-content-center align-items-center">
                    <div class="text-center" v-if="value.Detalle == null">
                    No justificado
                </div>

                <div class="text-center" v-if="value.Detalle != null">
                   {{ value.Detalle }}
                </div>
                </div>
            </div>

        </div>

    
        
        <!--  Ver periodos  -->
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import ENDPOINTS from '../../../ENPOINTS.json';
    

export default {
    props: ["rut"],
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
            versemana: false,
            semestre: ""

        }
    },
    async mounted() {

        try {
            await axios.get(
                ENDPOINTS["bff-horarios"] + "/semestre/activo",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((response) => {
                this.semestre = response.data[0].ID;
                let parts = this.semestre.split('.');
                let yearAndSemester = parts[1].split('-');
                this.semestre = `${yearAndSemester[1]} | semestre ${yearAndSemester[0]}`;
            })
        } catch (error) {
            console.log(error);
        }

        await this.getDatosAsistencia();
        //this.getRamos();
        this.loading = false;
        console.log()
    },
    methods: {


        async getDatosAsistencia(){
            try {
                const response = await axios.post(ENDPOINTS['bff-datosasistencia'] + '/datosasistenciageneral',{
                    rut:this.rut
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
                    rut:this.rut,
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
                    rut:this.rut,
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