<template>
    <!-- loading-->
    <div class="container d-flex justify-content-center align-items-center h-450" v-if="loading">
        <div class="spinner-grow primary-normal div-size-72" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <!-- Header -->
    <div class="row container-fluid" v-if="!loading">
        <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">
            <div class="col-2 text-center">
                Año
            </div>
            <div class="col-2 text-center">
                Inicio
            </div>
            <div class="col-2 text-center">
                Termino
            </div>
            <div class="col"></div>
            <div class="col-2 text-center">
                Estado
            </div>
        </div>
        <!-- Body -->
        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center"
            v-for="(periodo, index) in periodos" :key="index">
            <div class="col-2 text-center">
                {{ getAño(periodo.ID) }}
            </div>
            <div class="col-2 text-center">
                {{ parseFecha(periodo.FechaInicio) }}
            </div>
            <div class="col-2 text-center">
                {{ parseFecha(periodo.FechaTermino) }}
            </div>
            <div class="col">
                <button class="btn-light-50 bold btn-size-150" @click="add(periodo)">
                    Modificar
                </button>
            </div>
            <div class="col-2 d-flex justify-content-center align-items-center">
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
        </div>
        <!-- Modificar -->
        <div class="underlay" v-if="OverlayAgregar" @click="close">
            <EditarPeriodo :FechaInicio="periodo.FechaInicio" :FechaTermino="periodo.FechaTermino"
                :Semestre="periodo.ID" class="overlay" v-if="OverlayAgregar" @click.stop @close="close" />
        </div>
    </div>
</template>

<script>
</script>