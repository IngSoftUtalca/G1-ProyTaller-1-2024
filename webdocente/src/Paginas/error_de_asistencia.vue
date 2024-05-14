
<template> 
    <center>
    <div id="app" class="fondo" >

      <!-- Imagen en la parte superior -->
      <div class="row justify-content-center">
        <img src="../assets/error.svg" alt="Logo" class="img_error" style="max-width: 200px; max-height: 200px;">
      </div>

      <!-- Contenido principal -->
      <div class="row justify-content-center">
        <h3 class="texto"> Revisa tu horario, no se ha logrado marcar la asistencia</h3>
      </div>
  
      <!-- Botones -->
      <div> 
        <button type="button" class="btn boton_celeste" :class="{ 'boton-amarillo': botonC }" @click="reportarError" style="margin-top: 68%;">Reportar error</button>
        <button type="button" class="btn boton_celeste" :class="{ 'boton-amarillo': botonC }" @click="cambiarColor">Salir</button>
      </div>

    </div>
  </center>
  </template>
  
  <script>
  import { ref } from 'vue'

  
  export default {
    setup() {
      const botonC = ref(false); // Variable para controlar el color del botón

  
      const cambiarColor = () => {
        // Cambiar el estado del botón de rojo a otro color y viceversa
        botonC.value = !botonC.value;
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


  .texto{
    width: 254px;
    height: 30px;
    flex-grow: 0;
    margin: 100px 0 0;
    font-size: 32px;
    font-weight: 0.5px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
  }
  .boton-amarillo {
    background-color: #F89D1E;
  }
  
  
  </style>
  