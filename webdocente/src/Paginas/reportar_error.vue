<template>
    <center>
      <div id="app" class="fondo">
        <!-- Imagen en la parte superior -->
        
        <!-- Contenido principal -->
        
        <div class="row justify-content-center">
          <div class="card-body">
            <img src="../assets/utalca.svg" alt="Logo" class="img-fluid" style="max-width: 200px; max-height: 200px;">
            <p class="texto">Cuentanos que pasó:</p>
            <select class="form-control ramos" v-model="selectedOption">
              <option value="error_de_red">Error de red</option>
              <option value="error_de_gps">Error de GPS</option>
              <option value="no_hay_internet">No hay internet</option>
              <option value="fuera_de_tiempo">Fuera de tiempo</option>
              <option value="clase_fue_online">La clase fue online</option>
            </select>
            <p class="texto">Detalles (Opcional):</p>
            
            <input type="text" class="form-control" v-model="details" placeholder="Detalles">
            
            <button type="button" class="btn boton" @click="enviarReporte">Enviar reporte</button>
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
  .fondo {
    width: 393px;
    height: 852px;
    flex-grow: 0;
    padding: 54px 46px 168px 47px;
    background-color: #55C8C8;
  }
  
  .ramos {
    width: 100%; /* Cambiar el ancho al 100% */
    height: 40px; /* Ajustar la altura según sea necesario */
    flex-grow: 0;
    margin: 10px 0;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #000;
    background-color: #fff;
  }
  
  .card-body {
    width: 300px;
    height: auto;
    flex-grow: 0;
    margin: 5px 0;
    border-radius: 16px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background-color: #fff;
  }
  
  .boton {
    width: 185px;
    height: 46px;
    flex-grow: 0;
    margin: 20px 58px 0 57px;
    padding: 11px 32px 12px 33px;
    border-radius: 16px;
    margin-bottom: 5%;
    background-color: #FF4141;
    color:white;
  }
  
  .img-fluid {
    width: 150px;
    height: 100px8px;
    margin: 56px 44px 90px 43px;
    padding: 0 0.4px 0;
    margin-bottom: -15%;
  }
  
  .texto {
    text-align: left;
    font-size: medium;
  }
  .form-control{
    width: 300px;
    height: auto;
  }
  </style>
  