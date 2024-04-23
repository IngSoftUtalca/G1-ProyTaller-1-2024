
<template> 
    <center>
    <div id="app" class="fondo" >
      <!-- Imagen en la parte superior -->
      <div class="row justify-content-center">
        <img src="../assets/error.svg" alt="Logo" class="img-fluid" style="max-width: 200px; max-height: 200px;">
      </div>
      <!-- Contenido principal -->
      <div class="row justify-content-center">
        <h3 class="texto"> Revisa tu horario, no se ha logrado marcar la asistencia</h3>
      </div>
  
      <!-- Botones -->
      <div class="partebaja">
          <div class="button">
            <a href="/reporte" class="botonasistencia">Reportar Error</a>
          </div>
          <div class="button">
            <a href="ruta" class="botonasistencia">Salir</a>
          </div>
        </div>
      </div>
  </center>
  </template>
  
  <script>
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
    margin-bottom: -15%;
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
  
  
  
  .botonasistencia {
    width: 185px;
    height: 46px;
     /* Ajusta el margen del botón */
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
    background-color: #55C8C8;
    border: none; /* Elimina el borde */
    
  }
  .botonasistencia:active {
    background-color: #F89D1E; /* Cambia el color al hacer clic */
  }
  .partebaja{
    margin: 150px 0px ;
    
  }
  .button {
    margin-top: 40px; /* Espacio entre el texto y el botón */
  }
  
  
  
  .img-fluid {
    width: 213px;
    height: 150 px;
    margin: 56px 44px 90px 43px;
    padding: 0 0.4px 0 0;
    margin-bottom: -15%;
  }
  </style>
  