<template>
    <div class="background">
        <div class="row container-fluid" v-if="!loading">
            <div class="row px-5 rt-50 h-55 font-20 bold primary-bg d-flex align-items-center">
                <div class="col-2 text-center">
                    Bloque
                </div>
                <div class="col-2 text-center">
                    Curso
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
                    Justificacion
                </div>
                <div class="col-2 text-center">
                    s
                </div>
            </div>
        </div>

        <!--
        Tuplas
        -->
        <div class="row h-100 px-5 secondary-bg text-center bold d-flex align-items-center"
            v-for="(asistencia, index) in asistencia" :key="index">

            <div class="col-2 text-center">
                {{ getBloque(asistencia.bloque) }}
            </div>
            
            <div class="col-2 text-center">
                {{ getCurso(asistencia.curso) }}
            </div>
            
            <div class="col-2 text-center">
                {{ parseFecha(asistecia.fecha) }}
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
            
            <div class="col-2 text-center">
                {{ parseFecha2(asistecia.fechajustifucativo) }}
            </div>
            
            <div class="col-2 text-center">
                {{ getJustificacion(asistecia.justificacion) }}
            </div>
            
            <div class="col">
                <button class="btn-light-50 bold btn-size-150" @click="add(justificacion)">
                    Justificar
                </button>
            </div>
            
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AsistenciaDocente'
    }
</script>