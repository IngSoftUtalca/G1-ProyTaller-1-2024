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
          <h3 class="ramos"> {{ramo}}<hr>{{ bloque }} {{inicio}}-{{ termino }}</h3>
          <!-- <h3 class="ramos"> {{ramo}}Taller de Software B1 8:30-9:30</h3> -->
          
        </div>
      </div>
      <!-- Botón de asistencia -->
      <div>
        <a  class="btn boton_gris" :class="{ 'boton-amarillo': botonC }">
          <button type="button" @click="marcarAsistencia">Confirmar</button>
        </a>
      </div>
    </div>
  </center>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios';

export default {
  setup() {
    const route = useRoute()
    let idSala = ref(route.params.idSala)

    let ramo = ref('');
    let bloque = ref('');
    let  inicio = ref('');
    let termino = ref('');


    const botonC = ref(false); // Variable para controlar el color del botón

    onMounted(() => {
      // Fetch data for this sala here
 
      console.log(route.params);

      if(route.params.Ramo){
        ramo.value = (route.params.Ramo).toUpperCase();
        ramo.value = ramo.value.substring(0,20) // tiene un maximo de letras en el nombre del ramo
        bloque.value = "B"+route.params.Bloque;
        inicio.value = route.params.Inicio.substring(0,5);
        termino.value = route.params.Termino.substring(0,5);
      }


      console.log('Fetching data for sala', idSala)
      idSala = "Taller de Software"
      
    })

    const cambiarColor = () => {
      // Cambiar el estado del botón de rojo a otro color y viceversa
      botonC.value = !botonC.value;
    }

    return {
      idSala,
      route,
      botonC,
      bloque,
      ramo,
      inicio,
      termino,
      cambiarColor
    }
  },
  methods: {
    marcarAsistencia() {
      // Aquí puedes agregar la lógica para marcar la asistencia

      axios.post('http://localhost:3009/registrarinicio', 
      {
    "Inicio" : "9:00:00",
    "diaS": "4",
    "semestreActual": "Semestre.1-2023",
    "Rut": "33061234-1",
    "test": true

      }, 
      {
          headers: {
              'Content-Type': 'application/json',
          }
      })
      .then(response => {
          console.log('Response: ',  response.data);
          this.route.params.Iniciado = response.data.Iniciado;
          console.log("data: ", this.route.params);
          this.$router.push({name:'ClaseIniciada',params:this.route.params});
      })

      
      .catch(error => {
          console.error('Error:', error.response);
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
