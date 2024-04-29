<template>
    <center>
      <div id="app" class="fondo_celeste">
        <!-- Imagen en la parte superior -->
        
        <!-- Contenido principal -->
        
        <div class="row justify-content-center">
          <div class="card-blanca">
            <div class="row justify-content-center">
              <img src="../assets/utalca.svg" alt="Logo" class="logo_utalca" style="max-width: 200px; max-height: 200px;">
              
            </div>
            <p class="texto">RUT: (xxxxxxx-x)</p>
            <input type="text" class="form-control" v-model="details" placeholder="Sin puntos con guión">
            <p class="texto" style="margin-top: 10%;">Contraseña :</p>
            
            <input type="text" class="contrasena" v-model="password" placeholder="Contraseña...">
            
            <div> 
              <button type="button" class="btn boton_celeste" :class="{ 'boton-amarillo': botonC }"  @click="Logearse" style="margin-top: 30%;">Login</button>
         
           </div>
          </div>
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
  Logearse() {
    // Aquí puedes agregar la ruta a la que deseas redirigir al usuario
    this.$router.push('/sala11-101');
  }
}
}
  </script>
  
  <style scoped>
  @import '../assets/estilos.css';

  .contrasena{
    -webkit-text-security: disc;
    -moz-text-security: disc;
    text-security: disc;
    
  }

  .texto{
    font-size: 16px;
    text-align: left;
  }
  .card-blanca {
    width: 300px;
    height: 600px;
    flex-grow: 0;
    margin: 5px 0;
    border-radius: 16px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    background-color: #fff;
  }
  
  </style>
  