<template>
  <div id="app" class="fondo container-fluid d-flex align-items-center w-100 p-0">
    <div class="container row d-flex justify-content-center align-items-center m-0 p-0">
      <!-- Imagen en la parte superior -->
      <div class="row justify-content-center mb-5">
        <img src="../assets/error.svg" alt="Logo" class="img_error" style="max-width: 150px; max-height: 150px">
      </div>
      <!-- Contenido principal -->
      <div class="row text-center d-flex align-items-center my-3">
        <p class="font-24 bold"> Revisa tu horario, no se ha logrado marcar la asistencia</p>
      </div>
      <!-- Botones -->
      <div class="row container d-flex justify-content-center align-items-center w-100 p-0 v-100">
        <div class="row d-flex justify-content-center align-items-center m-0 p-0">
          <button type="button" class="btn boton_celeste size-200 bold" :class="{ 'boton-amarillo': botonC }"
            @click="reportarError">Reportar error</button>
        </div>
        <div class="row d-flex justify-content-center align-items-center">
          <button type="button" class="btn boton_celeste size-120 bold" :class="{ 'boton-amarillo': botonC }"
          @click="cambiarColor">Salir</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'


export default {
  setup() {
    const botonC = ref(false); // Variable para controlar el color del botón


    const cambiarColor = () => {
      // Cambiar el estado del botón de rojo a otro color y viceversa
      botonC.value = !botonC.value;
      window.close();
    }

    return {
      cambiarColor
    }
  },
  methods: {
    reportarError() {
      // Aquí puedes agregar la ruta a la que deseas redirigir al usuario
      this.$router.push('/reporte');
    }
  }
}
</script>



<style scoped>
@import '../assets/estilos.css';

.boton-amarillo {
  background-color: #F89D1E;
}
</style>