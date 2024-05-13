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
            <h3 class="ramos"> Clase iniciada {{ inicio }}</h3>
          </div>
        </div>
        <!-- Botón de asistencia -->
        <div>
          <button type="button" class="btn boton_gris" :class="{ 'boton-amarillo': botonC }" @click="claseiniciada">Finalizar Clase</button>
        </div>
      </div>
    </center>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import ENPOINTS from '../../../ENPOINTS.json';
  export default {
    setup() {
      const route = useRoute()
      console.log(route.params)

      let inicio = ref('');
      


      let idSala = ref(route.params.idSala)
      const botonC = ref(false); // Variable para controlar el color del botón
  
      onMounted(() => {
        // Fetch data for this sala here
        console.log('Fetching data for sala', idSala);
        console.log(route.params.Iniciado);
        inicio.value = (route.params.Iniciado);

        idSala = "Taller de Software"
      })
  
      const cambiarColor = () => {
        // Cambiar el estado del botón de rojo a otro color y viceversa
        botonC.value = !botonC.value;
      }
  
      return {
        idSala,
        botonC,
        inicio,
        cambiarColor
      }
    },
    methods: {
      claseiniciada() {
        // Aquí puedes agregar la lógica para marcar la asistencia
        axios.post(ENPOINTS['ms-registroasistencia']+'/registrarfinal',
      {
        "Rut": "33061234-1",
        "fecha": "2024-05-14",
        "test": true
      }, 
      {
          headers: {
              'Content-Type': 'application/json',
          }
      })
      .then(response => {
          console.log('Response: ',  response.data);
          this.$router.push({name:'InicioSesion'});
      })

      
      .catch(error => {

          console.error('Error:',   error.response);
          //return "malo";
          this.$router.push('/error');
      });







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
  