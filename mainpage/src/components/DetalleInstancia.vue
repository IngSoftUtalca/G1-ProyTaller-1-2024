<template>
    <div class="container-fluid ligth-bg">
        <div class="row mt-24 mb-52">
            <p class="text-center font-24 bold">{{ Ramo }}</p>
        </div>
        <div class="row container d-flex justify-content-center">
            <div class="row w-75">
                <p><span class="bold">Edificio: </span>{{ getNombreEdificio(Sala.split('-')[0]) }}</p>
                <p><span class="bold">Sala: </span>{{ Sala.split('-')[1] }}</p>
                <p><span class="bold">Bloque: </span>{{ Bloque }}</p>
                <p><span class="bold">Dia: </span>{{ getNombreDia(Dia) }}</p>
                <p><span class="bold">Semestre: </span>{{ Semestre }}</p>
            </div>
        </div>
        <form @submit.prevent="sacar" class="container-fluid">
            <div class="row d-flex align-items-end mt-5">
                <div class="col d-flex justify-content-end">
                    <div class="row btn-size-120">
                        <button class="btn-primary-16 bold" @click.prevent="close">Cerrar</button>
                    </div>
                </div>
                <div class="col ms-5 d-flex justify-content-start">
                    <div class="row btn-size-120">
                        <button class="btn-primary-16 bold" type="submit">
                            <span>Quitar</span>
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
import constantes from '@/shared/constances.json';
import axios from 'axios';

export default {
    name: 'DetalleInstancia',
    props: ['instancia', 'rut'],
    data() {
        return {
            loading: false,
            Ramo: '',
            Sala: '',
            Bloque: '',
            Dia: '',
            Semestre: '',
            Edificio: '',
            Dias: constantes['dias'],
            Salas: constantes['salas']['Edificios']
        }
    },
    mounted() {
        this.Ramo = this.instancia.Ramo;
        this.Sala = this.instancia.Sala;
        this.Bloque = this.instancia.Bloque;
        this.Dia = this.instancia.Dia_Semana;
        this.Semestre = this.instancia.Semestre;
    },
    methods: {
        async sacar() {
            this.loading = true;
            try {
                await axios.post( ENDPOINTS["ms-registrohorarios"] + "/desasignar", {
                    Ramo: this.Ramo,
                    Docente: this.rut
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
        getNombreDia(dia) {
            for (let i = 0; i < this.Dias.length; i++) {
                if (this.Dias[i].id.toString() === dia) {
                    return this.Dias[i].nombre;
                }
            }
        },
        getNombreEdificio(codigo) {
            for (let i = 0; i < this.Salas.length; i++) {
                if (this.Salas[i].codigo.toString() === codigo) {
                    return this.Salas[i].nombre;
                }
            }
        },
    }
}
</script>