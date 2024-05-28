<template>
    <div class="container-fluid w-90">
        <div class="row container-fluid my-14 d-flex justify-content-end">
            <button class="btn-primary-16 btn-size-120" @click.prevent="add">
                <span class="bold">
                    Agregar
                </span>
                <img src="@/assets/plus.svg" alt="Agregar">
            </button>
        </div>
        <div class="underlay" v-if="OverlayAgregar" @click="close">
            <AgregarDocente class="overlay" v-if="OverlayAgregar" @click.stop @close="close" />
        </div>
        <!-- loading-->
        <div class="container d-flex justify-content-center align-items-center h-450" v-if="loading">
            <div class="spinner-grow primary-normal div-size-72" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <!-- Header -->
        <table class="primary-bg text-center w-100">
            <thead>
                <tr>
                    <th>R.U.T</th>
                    <th>Nombre</th>
                    <th>Facultad</th>
                    <th>Campus</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(docente, index) in docentes" :key="index">
                    <td>{{ docente.Rut }}</td>
                    <td>{{ docente.Nombre }}</td>
                    <td>{{ docente.Facultad }}</td>
                    <td>{{ docente.Campus }}</td>
                    <td>
                        <button class="btn-light-50 bold btn-size-150" @click="borrar(index)">
                            Eliminar
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row" v-for="(docente, index) in docentes" :key="index">
            <p>{{ docente.Rut }}</p>
        </div>
    </div>
</template>

<script>
import AgregarDocente from '@/components/AgregarDocente.vue';
export default {
    name: 'AdministradoresWeb',
    data() {
        return {
            OverlayAgregar: false,
            docentes: null,
        }
    },
    async onmounted() {
        await this.getDocentes();
    },
    methods: {
        async getDocentes() {
            this.docentes = [
            {
                Rut: '12345678-9',
                Nombre: 'Juan Perez',
                Facultad: 'Facultad de Ingenieria',
                Campus: 'Santiago'
            },
            {
                Rut: '12345678-9',
                Nombre: 'Juan Perez',
                Facultad: 'Facultad de Ingenieria',
                Campus: 'Santiago'
            },
            {
                Rut: '12345678-9',
                Nombre: 'Juan Perez',
                Facultad: 'Facultad de Ingenieria',
                Campus: 'Santiago'
            }
        ];
        },
        add() {
            this.OverlayAgregar = true;
        },
        close() {
            this.OverlayAgregar = false;
        },
        borrar(i){
            this.docentes.splice(i, 1);
        }
    },
    components: {
        AgregarDocente
    }
}
</script>