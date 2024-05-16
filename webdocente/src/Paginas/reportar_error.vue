<template>
  <center>
    <div id="app" class="fondo_celeste container-fluid d-flex justify-content-center align-items-center">
      <!-- Imagen en la parte superior -->

      <!-- Contenido principal -->

      <div class="row d-flex justify-content-center align-items-center">
        <div class="card-blanca">
          <div class="row justify-content-center">
            <img src="../assets/utalca.svg" alt="Logo" class="logo_utalca" style="max-width: 200px; max-height: 200px;">
          </div>
          <p class="texto">Cuentanos que pasó:</p>
          <select class="form-control" v-model="selectedOption">
            <option value="error_de_red">Error de red</option>
            <option value="error_de_gps">Error de GPS</option>
            <option value="no_hay_internet">No hay internet</option>
            <option value="fuera_de_tiempo">Fuera de tiempo</option>
            <option value="clase_fue_online">La clase fue online</option>
          </select>
          <p class="texto">Detalles (Opcional):</p>
          <textarea class="form-control h-25" v-model="details" placeholder="Detalles"></textarea>
          <button type="button" class="btn boton_rojo" @click="enviarReporte">Enviar reporte</button>
        </div>
      </div>
    </div>
  </center>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const selectedOption = ref('error_de_red')
    const details = ref('')

    const enviarReporte = () => {
      // Aquí puedes agregar la lógica para enviar el reporte
      console.log('Opción seleccionada:', selectedOption.value)
      console.log('Detalles:', details.value)
    }

    return {
      selectedOption,
      details,
      enviarReporte
    }
  }
}
</script>

<style scoped>
@import '../assets/estilos.css';

.texto {
  font-size: 16px;
  text-align: left;
}
</style>