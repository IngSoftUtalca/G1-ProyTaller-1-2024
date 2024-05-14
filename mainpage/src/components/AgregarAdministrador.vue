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