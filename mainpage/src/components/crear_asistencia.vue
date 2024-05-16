
<template> 
    <center>
    <div id="app" class="fondo" >
      <!-- Imagen en la parte superior -->
      <div class="row justify-content-center">
        <img src="https://cdn.utalca.cl/img_utal/ins/utal.png" alt="Logo" class="img-fluid" style="max-width: 200px; max-height: 200px;">
      </div>
      <!-- Contenido principal -->
      <div class="row justify-content-center">
            <div class="card-body">
              <h3 class="ramos"> Taller de software B1 8:30-9:30</h3>
            </div>
      </div>
      <!-- Botón de asistencia -->
      <div>
        <button type="button" class="btn btn-outline-warning">Confirmar</button>
      </div>
    </div>
  </center>
  </template>
  
  <script>
  export default {
    data() {
      return {
        texto: ''
      };
    },
    methods: {
      marcarAsistencia() {
        // Aquí puedes agregar la lógica para marcar la asistencia
        console.log('Asistencia marcada');
      }
    }
  };
  </script>
  
  <style>
  .fondo {
    width: 393px;
    height: 852px;
    flex-grow: 0;
    padding: 54px 46px 168px 47px;
    background-color: #f4f4f4;
  }
   .logo{
    width: 213px;
    height: 48px;
    margin: 56px 44px 90px 43px;
    padding: 0 0.4px 0 0;
  }
  
  .ramos{
    width: 254px;
    height: 30px;
    flex-grow: 0;
    margin: 100px 0 0;
    font-size: 32px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
  }
  
  
  .card-body {
  
    width: 300px;
    height: 300px;
    flex-grow: 0;
    margin: 5px 0;
    padding: 113px 23px;
    border-radius: 16px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background-color: #60cdcd;
  
  
  }
  
  .btn-outline-warning {
    width: 185px;
    height: 46px;
    margin: 90px 58px 0 57px;
    padding: 11px 32px 12px 33px;
    border-radius: 16px;
    color: orange;
    
  }
  
  .img-fluid {
    width: 213px;
    height: 48px;
    margin: 56px 44px 90px 43px;
    padding: 0 0.4px 0 0;
  }
  </style>
  