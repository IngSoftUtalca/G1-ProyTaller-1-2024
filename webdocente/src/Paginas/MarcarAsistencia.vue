<template> 
  <center>
    <div id="app" class="fondo" >
      <!-- Imagen en la parte superior -->
      <div class="row justify-content-center">
        <img src="../assets/utalca.svg" alt="Logo" class="logo_utalca" style="max-width: 200px; max-height: 200px;">
      </div>
      <!-- Contenido principal -->
      <div class="row justify-content-center">
        <div class="card-celeste">
          <h3 class="ramos"> {{ramo}}Taller de Software B1 8:30-9:30</h3>
        </div>
      </div>
      <!-- Botón de asistencia -->
      <div>
        <button type="button" class="btn boton_gris" :class="{ 'boton-amarillo': botonC }" @click="cambiarColor">Confirmar</button>
      </div>
    </div>
  </center>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    let idSala = ref(route.params.idSala)
    const botonC = ref(false); // Variable para controlar el color del botón

    onMounted(() => {
      // Fetch data for this sala here
      console.log('Fetching data for sala', idSala)
      idSala = "Taller de Software"
    })

    const cambiarColor = () => {
      // Cambiar el estado del botón de rojo a otro color y viceversa
      botonC.value = !botonC.value;
    }

    return {
      idSala,
      botonC,
      cambiarColor
    }
  },
  methods: {
    marcarAsistencia() {
      // Aquí puedes agregar la lógica para marcar la asistencia
      console.log('Asistencia marcada');
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
