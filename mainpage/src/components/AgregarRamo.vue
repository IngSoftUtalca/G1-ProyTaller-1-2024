<template>
    <div class="container-fluid ligth-bg">
        <div class="row mt-24 mb-52">
            <p class="text-center font-24 bold">Asignación de ramos Docente</p>
        </div>
        <form @submit.prevent="addRamo" class="container-fluid">
            <div class="container row d-flex justify-content-center">
                <div class="row w-75">
                    <label for="Ramo" class="bold font-16">Ramo:</label>
                </div>
                <div class="row w-75">
                    <input type="text" id="Ramo" v-model="Ramo" class="text-input" placeholder="Nombre del ramo a agregar..." list="ramos">
                    <datalist id="ramos">
                        <option v-for="(ramo, i) in ramos" :value="ramo.Nombre" :key="i"></option>
                    </datalist>
                </div>
            </div>
            <div class="row d-flex align-items-end mt-216">
                <div class="col d-flex justify-content-end">
                    <div class="row btn-size-120">
                        <button class="btn-primary-16 bold" @click.prevent="close">Cancelar</button>
                    </div>
                </div>
                <div class="col ms-5 d-flex justify-content-start">
                    <div class="row btn-size-120">
                        <button class="btn-primary-16 bold" type="submit">
                            <span>Tomar</span>
                            <span class="ms-1 spinner-border spinner-border-sm" aria-hidden="true"
                                v-if="loading"></span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import ENDPOINTS from '../../../ENDPOINTS.json';
import axios from 'axios';

export default {
    name: 'AgregarPeriodo',
    data() {
        return {
            loading: false,
            Ramo: '',
            ramos: [],
        }
    },
    async mounted() {
        await axios.get(
            ENDPOINTS["bff-horarios"] + "/ramos",
        ).then(response => {
            this.ramos = response.data;
        }).catch(error => {
            console.log(error);
        });
    },
    methods: {
        async addRamo() {
            this.loading = true;
            try {
                await axios.post( ENDPOINTS["ms-registrohorarios"] + "/asignar", {
                    Ramo: this.Ramo,
                    Docente: this.$route.params.rut
                }, {

                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                this.$emit('close');
            } catch (error) {
                console.error(error);
            }
            this.$emit('close'); 
        },
        close() {
            this.$emit('close');
        },
        forwardClick(event) {
            const dateInput = event.target.previousElementSibling;
            dateInput.focus();
            dateInput.click();
        },
    }
}
</script>