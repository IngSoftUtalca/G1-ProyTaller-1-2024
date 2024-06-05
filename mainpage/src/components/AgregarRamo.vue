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
                    <input type="text" id="Ramo" class="text-input" placeholder="Nombre del ramo a agregar...">
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

export default {
    name: 'AgregarPeriodo',
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        addRamo() {
            console.log('Agregado');

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