<template>
    <div class="container-fluid ligth-bg">
        <div class="row mt-24 mb-52">
            
            <p class="text-center font-24 bold">Seleccione el nuevo docente</p>
            
            <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Buscar..."  aria-describedby="basic-addon1">
            </div>
            
            <p class="text-left font-12 bold">Facultad</p>
            <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Escribir..."  aria-describedby="basic-addon1">
            </div>
            <p class="text-left font-12 bold">Campus</p>
            <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Escribir..."  aria-describedby="basic-addon1">
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
        
       </div>
    </div>
</template>

<script>

</script>