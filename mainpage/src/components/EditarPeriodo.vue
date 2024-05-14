<template>
    <div class="container-fluid ligth-bg">
        <div class="row mt-24 mb-52">
            <p class="text-center font-24 bold">Gestión de periodos academicos</p>
        </div>
        <form @submit.prevent="addPeriodo" class="container-fluid">
            <div class="row d-flex justify-content-center align-items-center my-52">
                <div class="col">
                    <label for="Inicio" class="bold font-16">Fecha inicio:</label>
                </div>
                <div class="col">
                    <input type="date" id="Inicio" :min="minInicio" :max="termino" v-model="inicio" class="text-center text-input">
                </div>
                <div class="col">
                    <label for="Termino" class="bold font-16">Fecha termino:</label>
                </div>
                <div class="col">
                    <input type="date" id="Termino" :min="inicio" :max="maxTermino" v-model="termino" class="text-center text-input">
                </div>
            </div>
            <div class="row d-flex justify-conten-start align-items-center my-52">
                <div class="col w-190">
                    <label for="Feriado" class="font-16">Dias sin actividades:</label>
                </div>
                <div class="col w-150">
                    <input type="date" id="Feriado" :min="inicio" :max="termino" class="text-center text-input">
                </div>
                <div class="col w-120">
                    <button class="btn-primary-16 btn-size-120" @click.prevent="addFeriado">
                        <span class="bold">
                            Agregar
                        </span>
                        <img src="@/assets/plus.svg" alt="Agregar">
                    </button>
                </div>
            </div>
            <div class="row d-flex justify-conten-start align-items-center my-52">
                <div class="col w-190">
                    <label for="Horarios" class="font-16">Archivo horario:</label>
                </div>
                <div class="col">
                    <div class="row">
                        <div class="col w-120">
                            <input type="file" id="Horarios" class="text-input" @change="fileUpload" ref="fileInput"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                style="display: none;">
                            <button class="btn-primary-16 btn-size-120 d-flex align-items-center justify-content-center"
                                @click.prevent="selectFile">
                                <span class="bold">
                                    Subir
                                </span>
                                <div class="size-24 ms-2 ml-2">
                                    <img src="@/assets/upload.svg" alt="Subir">
                                </div>
                            </button>
                        </div>
                        <div class="col ms-3 d-flex justify-conten-start align-items-center">
                            <p class="font-16" v-if="Horarios !== null">{{ File }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-64">
                <div class="col d-flex justify-content-end">
                    <div class="row btn-size-120">
                        <button class="btn-primary-16 bold" @click.prevent="close">Cancelar</button>
                    </div>
                </div>
                <div class="col ms-5 d-flex justify-content-start">
                    <div class="row btn-size-120">
                        <button class="btn-primary-16 bold" type="submit">
                            <span>Guardar</span>
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
import axios from 'axios';
import moment from 'moment';
import ENDPOINTS from '../../../ENPOINTS.json';

export default {
    name: 'EditarPeriodo',
    data() {
        return {
            loading: false,
            feriados: [],
            inicio: null,
            termino: null,
            Horarios: null,
            File: null,
            maxTermino: null,
            minInicio: null
        }
    },
    watch: {
        inicio(value) {
            if (value) {
                this.inicio = moment(value).format('YYYY-MM-DD');
                this.maxTermino = moment(value).add(5, 'months').format('YYYY-MM-DD');
            }
        },
        termino(value) {
            if (value) {
                this.termino = moment(value).format('YYYY-MM-DD');
                this.minInicio = moment(value).subtract(5, 'months').format('YYYY-MM-DD');
            }
        },
    },
    methods: {
        addPeriodo() {
            this.inicio = document.getElementById('Inicio').value;
            this.termino = document.getElementById('Termino').value;
            this.loading = true;
            axios.post(ENDPOINTS['ms-registrohorarios'] + '/new', {
                fechaInicio: moment(this.inicio).format('YYYY-MM-DD'),
                fechaTermino: moment(this.termino).format('YYYY-MM-DD'),
                feriados: this.feriados.map(f => moment(f).format('YYYY-MM-DD')),
                horario_periodo: this.Horarios
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log(response);
                    this.loading = false;
                    this.$emit('close');
                })
                // eslint-disable-next-line no-unused-vars
                .catch(error => {
                    this.loading = false;
                });

        },
        close() {
            this.$emit('close');
        },
        addFeriado() {
            this.feriados.push(document.getElementById('Feriado').value);
            document.getElementById('Feriado').value = '';
        },
        selectFile() {
            this.$refs.fileInput.click();
        },
        fileUpload() {
            let file = this.$refs.fileInput.files[0];
            let reader = new FileReader();
            reader.onloadend = () => {
                // Eliminar 'data:;base64,' de la cadena
                this.Horarios = reader.result.split(',')[1];
                this.File = file.name;
            };
            reader.readAsDataURL(file);
        },
        forwardClick(event) {
            const dateInput = event.target.previousElementSibling;
            dateInput.focus();
            dateInput.click();
        },
    }
}
</script>