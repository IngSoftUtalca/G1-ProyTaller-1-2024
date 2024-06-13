<template>
    <!-- pop up agregar ramo -->
    <div class="underlay" v-if="OverlayAgregar" @click="close">
        <AgregarRamo class="overlay" v-if="OverlayAgregar" @click.stop @close="close" />
    </div>
    <div class="container-fluid">
        <div class="row contaiter d-flex justify-content-center align-items-center primary-border h-60 r-18">
            <div class="col container d-flex justify-content-start align-items-cente">
                <button class="btn-primary-16 btn-size-120" @click.prevent="add">
                    <span class="bold">
                        Agregar
                    </span>
                    <img src="@/assets/plus.svg" alt="Agregar">
                </button>
            </div>
            <div class="col d-flex justify-content-center align-items-center">
                <p class="m-0 align-middle bold font-22">Horario {{ semestre }}</p>
            </div>
            <div class="col d-flex justify-content-end align-items-center"
                v-if="estado != 'pendiente' && estado != 'aprobado'">
                <div class="gray-bg size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <p class="m-0 align-middle bold font-20">{{ estado }}</p>
                </div>
            </div>
            <div class="col d-flex justify-content-end align-items-center " v-if="estado === 'pendiente'">
                <div class="yellow-bg size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <p class="m-0 align-middle bold font-20">{{ estado }}</p>
                </div>
            </div>
            <div class="col d-flex justify-content-end align-items-center " v-if="estado === 'aprobado'">
                <div class="green-bg size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <p class="m-0 align-middle bold font-20">{{ estado }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AgregarRamo from '@/components/AgregarRamo.vue';
import axios from "axios";
import ENPOINTS from "../../../ENPOINTS.json";

export default {
    name: 'HorarioDocenteEstados',
    data() {
        return {
            estado: 'Estado',
            semestre: 'Semestre',
            OverlayAgregar: false,
        }
    },
    async mounted() {
        const rut = this.$route.params.rut;
        try {
            await axios.post(
                ENPOINTS["ms-validacionrol"] + "/horario",
                {
                    Rut: rut
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((response) => {
                this.estado = response.data.Horario[0].Estado;
            })
        } catch (error) {
            console.log(error);
        }

        try {
            await axios.get(
                ENPOINTS["bff-horarios"] + "/semestre/activo",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((response) => {
                let semestre = response.data[0].ID;
                let parts = semestre.split('.');
                let yearAndSemester = parts[1].split('-');
                this.semestre = `${parts[0].toLowerCase()} ${yearAndSemester[1]}-${yearAndSemester[0]}`;
            })
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        // Aquí puedes agregar los métodos que necesites
        add() {
            this.OverlayAgregar = true;
        },
        close() {
            this.$emit('refresh');
            this.OverlayAgregar = false;
        }
    },
    components: {
        AgregarRamo
    }
}

</script>