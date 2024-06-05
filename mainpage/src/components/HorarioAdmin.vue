<template>
    <div class="container-fluid w-95 mx-0 mt-5" v-if="allinfo && !loading">
        <!--- Header --->
        <div class="row rt-50 h-55 mx-0 font-20 bold primary-bg d-flex align-items-center"></div>
        <!--- Body --->
        <div class="row h-100 px-5 mx-0 font-20 bold secondary-bg d-flex align-items-center"
            v-for="(docente, index) in docentes" :key="index">
            <div class="col-2 text-start">
                {{ semestre }}
            </div>
            <div class="col-2 text-start">
                {{ docente.Nombre }}
            </div>
            <div class="col d-flex justify-content-center align-items-center"
                v-if="horarios[index] != 'pendiente' && horarios[index] != 'aprobado'">
                <div class="red-bg size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <p class="m-0 align-middle bold font-20">{{ horarios[index] }}</p>
                </div>
            </div>
            <div class="col d-flex justify-content-center align-items-center " v-if="horarios[index] === 'pendiente'">
                <div class="yellow-bg size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <p class="m-0 align-middle bold font-20">{{ horarios[index] }}</p>
                </div>
            </div>
            <div class="col d-flex justify-content-center align-items-center " v-if="horarios[index] === 'aprobado'">
                <div class="green-bg size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <p class="m-0 align-middle bold font-20">{{ horarios[index] }}</p>
                </div>
            </div>
            <div class="col d-flex justify-content-end">
                <button class="btn-gray btn-size-150 bold font-22" @click="VerHorarioDocente(docente, horarios[index])">
                    Ver
                </button>
            </div>
        </div>
    </div>
    <div class="container-fluid w-95 mx-0 mt-5" v-if="!allinfo && !loading">
        <div class="row contaiter d-flex justify-content-center align-items-center primary-border px-4 h-60 r-18">
            <div class="pointer col-1 container d-flex justify-content-start align-items-cente" @click="dejardever()">
                <img src="@/assets/backarrow.svg" alt="arrow-left">
            </div>
            <div class="col d-flex justify-content-center align-items-center">
                <p class="m-0 align-middle bold font-22">Horario {{ docente.Nombre }}</p>
            </div>
            <div class="col-3 container d-flex">
                <div class="col d-flex justify-content-end align-items-center" v-if="horario != 'aprobado'"
                    @click="cambiarEstado('aprobado')">
                    <div
                        class="pointer green-bg green-bg-hover size-170-45 r-16 d-flex align-items-center justify-content-center">
                        <p class="m-0 align-middle bold font-20">aprobar</p>
                    </div>
                </div>
                <div class="pointer col d-flex justify-content-end align-items-center" v-if="horario != 'rechazado'"
                    @click="cambiarEstado('rechazado')">
                    <div class="red-bg red-bg-hover size-170-45 r-16 d-flex align-items-center justify-content-center">
                        <p class="m-0 align-middle bold font-20">rechazar</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <VerHorarioDocente :rut="docente.RUT"></VerHorarioDocente>
        </div>
    </div>
    <div class="container-fluid h-450 d-flex justify-content-center align-items-center" v-if="loading">
        <div class="spinner-grow primary-normal div-size-72" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
import VerHorarioDocente from '@/components/VerHorarioDocente.vue';
import ENDPOINTS from '../../../ENPOINTS.json';
import axios from 'axios';
export default {
    name: 'HorarioAdmin',
    data() {
        return {
            docentes: [],
            semestre: '',
            horarios: [],
            allinfo: true,
            docente: {},
            horario: {},
            loading: true,
            load: false
        }
    },
    async mounted() {
        try {
            await axios.get(
                ENDPOINTS["bff-datosdocentes"] + "/cargo/" + this.$route.params.rut,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((response) => {
                this.docentes = response.data;
            })
        } catch (error) {
            console.log(error);
        }
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
        try {
            for (let i = 0; i < this.docentes.length; i++) {
                await axios.post(
                    ENDPOINTS["ms-validacionrol"] + "/horario",
                    {
                        Rut: this.docentes[i].RUT
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ).then((response) => {
                    this.horarios.push(response.data.Horario[0].Estado);
                })
            }
        } catch (error) {
            console.log(error);
        }
        this.loading = false;
    },
    methods: {
        VerHorarioDocente(docente, horario) {
            this.docente = docente;
            this.horario = horario
            console.log(this.docente);
            console.log(this.horario);
            this.allinfo = false;
        },
        dejardever() {
            this.allinfo = true;
        },
        async cambiarEstado(estado) {
            this.horario = estado;
            this.loading = true;
            const rut = this.docente.RUT;
            await axios.post(
                ENDPOINTS["ms-registrohorarios"] + "/cambiar-estado",
                {
                    rut: rut,
                    estado: estado
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((response) => {
                console.log(response.data);
            })
            try {
                await axios.get(
                    ENDPOINTS["bff-datosdocentes"] + "/cargo/" + this.$route.params.rut,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ).then((response) => {
                    this.docentes = response.data;
                })
            } catch (error) {
                console.log(error);
            }
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
            try {
                for (let i = 0; i < this.docentes.length; i++) {
                    await axios.post(
                        ENDPOINTS["ms-validacionrol"] + "/horario",
                        {
                            Rut: this.docentes[i].RUT
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    ).then((response) => {
                        this.horarios.push(response.data.Horario[0].Estado);
                    })
                }
            } catch (error) {
                console.log(error);
            }
            this.allinfo = false;
            this.loading = false;
            this.$emit('refresh');
        }
    },
    components: {
        VerHorarioDocente
    }
}
</script>