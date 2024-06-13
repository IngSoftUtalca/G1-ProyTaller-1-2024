<template>
    <div class="container-fluid d-flex w-90">
        <div class="container-fluid  w-95 mt-3">
            <div class="row container-fluid my-14 d-flex justify-content-end">
                <div class="container-fluid">
                    <div class="row contaiter d-flex justify-content-center align-items-center primary-border h-60 r-18">
                        <div class="col container d-flex justify-content-start align-items-cente">
                            <button class="btn-primary-16 btn-size-120">
                            <span class="bold">
                            </span>
                            </button>
                        </div>
                    <div class="col d-flex justify-content-center align-items-center">
                        <p class="m-0 align-middle bold font-22">Semestre: {{ semestre }}</p>
                    </div>
            <div class="col d-flex justify-content-end align-items-center">
                <div class="size-170-45 r-16 d-flex align-items-center justify-content-center">
                    <div class="col container d-flex justify-content-start align-items-cente">
                <button class="btn-primary-16 btn-size-120">
                    <span class="bold">
                    </span>
                </button>
                </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <!-- Header -->
    <div class="row container-fluid" v-if="!loading">
        <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">
            <div class="col-2 text-center">
                Semana
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
        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center">
            <div class="col-2 text-center">
                11 de Marzo
            </div>
            <div class="col-2 text-center">
                50
            </div>
            <div class="col-2 text-center">
                10
            </div>
            <div class="col">
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
                <button class="btn-light-50 bold btn-size-150" >
                    Ver
                </button>
            </div>
        </div>



        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center">
            <div class="col-2 text-center">
                18 de Marzo
            </div>
            <div class="col-2 text-center">
                10
            </div>
            <div class="col-2 text-center">
                30
            </div>
            <div class="col">
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
                <button class="btn-light-50 bold btn-size-150" >
                    Ver
                </button>
            </div>
        </div>

        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center">
            <div class="col-2 text-center">
                25 de Marzo
            </div>
            <div class="col-2 text-center">
                30
            </div>
            <div class="col-2 text-center">
                20
            </div>
            <div class="col">
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
                <button class="btn-light-50 bold btn-size-150" >
                    Ver
                </button>
            </div>
        </div>

        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center">
            <div class="col-2 text-center">
                01 de Abril
            </div>
            <div class="col-2 text-center">
                50
            </div>
            <div class="col-2 text-center">
                10
            </div>
            <div class="col">
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
                <button class="btn-light-50 bold btn-size-150" >
                    Ver
                </button>
            </div>
        </div>

    
        
        <!--  Ver periodos  -->
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import ENDPOINTS from '../../../ENPOINTS.json';
</script>