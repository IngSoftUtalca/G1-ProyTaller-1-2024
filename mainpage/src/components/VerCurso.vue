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
                Bloque
            </div>
            <div class="col-2 text-center">
                Docente
            </div>
            <div class="col-2 text-center">
                Fecha
            </div>
            
            <div class="col-2 text-center">
                Estado
            </div>
            <div class="col-2 text-center">
                Fecha
            </div>
            <div class="col-2 text-center">
            
            </div>
            <div class="col-2 text-center">
                Justificacion
            </div>
            <div class="col-2 text-center">
            
            </div>
        </div>
        <!-- Body -->
        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center"
            v-for="(periodo, index) in periodos" :key="index">
            <div class="col-2 text-center">
                B1 8:30 - 10:00
            </div>
            <div class="col-2 text-center">
                Luis Silvestre
            </div>
            <div class="col-2 text-center">
                25/05/2023
            </div>
            <div class="col">
                <div class="pill-yellow pill-size-150" v-if="periodo.Estado == 'Pendiente'">
                    {{ periodo.Estado }}
                </div>
                <div class="pill-green pill-size-150" v-if="periodo.Estado == 'Activo'">
                    {{ periodo.Estado }}
                </div>
                <div class="pill-gray pill-size-150" v-if="periodo.Estado == 'Finalizado'">
                    {{ periodo.Estado }}
                </div>
            </div>
            <div class="col-2 text-center">
                25/05/2023
            </div>
            <div class="col-2 text-center">
                
            </div>
            <div class="col-2 text-center">
                Asistio bien
            </div>
            <div class="col-2 text-center">
            
            </div>
        </div>
    </div>
</template>

<script>
import constances from '@/shared/constances.json';
import ENDPOINTS from '../../../ENPOINTS.json';
import axios from 'axios';
</script>