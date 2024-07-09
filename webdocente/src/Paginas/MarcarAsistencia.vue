<template>
  <div id="app" class="fondo container">
    <!-- Imagen en la parte superior -->
    <div class="row justify-content-center">
      <img src="../assets/utalca.svg" alt="Logo" class="logo_utalca" style="max-width: 200px; max-height: 200px" />
    </div>
    <!-- Contenido principal -->
    <div class="row d-flex justify-content-center align-items-center text-center" v-if="!loading">
      <div class="card-celeste container">
        <div class="row d-flex h-50 justify-content-center align-items-end m-0 py-0">
          <p class="ramos">
            {{ ramo }}
          </p>
        </div>
        <div class="row d-flex h-50 justify-content-center align-items-start m-0 py-0">
          <p class="ramos">{{ bloque }} {{ inicio }} - {{ termino }}</p>
        </div>
        <!-- <h3 class="ramos"> {{ramo}}Taller de Software B1 8:30-9:30</h3> -->
      </div>
    </div>
    <div>
      <button class="btn boton_gris text-white bold" type="button" @click="marcarAsistencia" v-if="!loading && valido">
        Confirmar
      </button>
    </div>
    <div class="container h-75 d-flex align-items-center justify-content-center" v-if="loading">
      <div class="spinner-grow text-primaryC loading" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ENPOINTS from "../../../ENPOINTS.json";
import constantes from "../shared/constances.json";
import { useRoute } from "vue-router";
export default {
  data() {
    return {
      botonC: false,
      valido: false,
      ramo: "",
      errorRoute: false,
      errorMensaje: "",
      bloque: "",
      inicio: "",
      termino: "",
      idSala: "",
      loading: true,
    };
  },
  async mounted() {
    const route = useRoute();
    let dia = new Date().getDay();
    const moment = require("moment-timezone");
    const hora = moment().tz("America/Santiago").format("HH:mm:ss");
    const bloques = constantes.bloques;
    // en el arreglo json bloques buscaramos el bloque en el que su hora de inicio y termino esté dentro de la hora actual
    this.bloque = "12";
    for (let i = 0; i < bloques.length; i++) {
      const horaInicioBloque = moment(bloques[i].inicio, "HH:mm:ss");
      const horaFinBloque = moment(bloques[i].fin, "HH:mm:ss");
      const horaActual = moment(hora, "HH:mm:ss");

      if (horaActual.isBetween(horaInicioBloque, horaFinBloque)) {
        this.bloque = bloques[i].id;
        break;
      }
    }

    this.idSala = route.params.idSala;
    const res = await axios.get(
      ENPOINTS["bff-horarios"] +
      "/instancia?sala=" +
      this.idSala +
      "&dia=" +
      dia +
      "&bloque=" +
      this.bloque
    );
    this.ramo = res.data.Ramo;
    this.inicio = res.data.HoraInicio;
    this.termino = res.data.HoraTermino;
    // la hora debe ser formato HH:MM
    this.inicio = this.inicio.slice(0, 5);
    this.termino = this.termino.slice(0, 5);
    this.bloque = "B" + this.bloque;
    // ramo tiene un maximo de 20 caracteres
    if (this.ramo.length > 35) {
      this.ramo = this.ramo.slice(0, 35) + "...";
    }

    let permisogps = false
    let validaciongps = false;
    let validacionIP = false

    let ipusuario = ""

    await fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(response => { ipusuario = response.ip });


    let posicionG 
    if ( navigator.geolocation) {
      
        try{    
          const position = await this.ObtenerCoordenadas();
          permisogps = true;
          posicionG = position     
        }catch(error) {
          //this.errorRoute = true
          switch (error.code) {
            case error.PERMISSION_DENIED:
            this.errorMensaje = "Permiso denegado por el usuario.";
              break;
            case error.POSITION_UNAVAILABLE:
            this.errorMensaje = "La información de ubicación no está disponible.";
              break;
            case error.TIMEOUT:
            this.errorMensaje = "La solicitud de ubicación ha caducado.";
              break;
            case error.UNKNOWN_ERROR:
            this.errorMensaje = "Se ha producido un error desconocido.";
              break;
          }
          
        }
      
    }else {
      this.errorMensaje = ""
      //this.errorMensaje = "La geolocalización no es compatible con este navegador."; // comentar en desarrollo
    }

    try {
   
      const Vgps = await axios.post(

        ENPOINTS["ms-verificaciongps"] + "/verificar",
        {
          "sala": this.idSala,

          "longitud": posicionG.coords.longitude,
          "latitud": posicionG.coords.latitude,
          "IP": ipusuario

        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      console.log(posicionG.coords.latitude + "," + posicionG.coords.longitude + " => " + Vgps.data.validoGPS + " | ip:" + ipusuario + " => " + Vgps.data.validoIP);

      validaciongps = Vgps.data.validoGPS;
      validacionIP = Vgps.data.validoIP;

      

    } catch (err) {
      console.error(err)

    }

    // de momento siempre sera verdadero en desarrollo
    permisogps = true
    validacionIP = true;
    validaciongps = true;

    if (!(validacionIP && validaciongps) || !permisogps) {
      // si no es valido se hace
      this.errorRoute = true

      if((!validacionIP && !validaciongps)){
        this.errorMensaje += "| Geolocalizacion e IP no valida"
      }else{
        if(!validacionIP){
        this.errorMensaje += "| IP no valida"
        }
        if(!validaciongps){
          this.errorMensaje += "| Geolocalizacion no valida"
        }
        
      }

      
      //window.location.href = ENPOINTS["webdocente"]+"/error";

    }
    console.log(this.errorMensaje)
    this.valido = (this.ramo != "No hay clases en la sala") 
    this.valido = true

    
    console.log("valido: " + this.valido);

    
    this.loading = false;
  },
  methods: {

    async ObtenerCoordenadas(){
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      });
    },

    marcarAsistencia() {

      if(!this.errorRoute){
        window.location.href = ENPOINTS["login-WD"]+"/?sala="+this.idSala;
      }else{
        this.$router.push({
          name: 'ErrorAsistencia',
          params: {
            rut: "",
            mensaje: this.errorMensaje,
            jusificable: true,
            ramo: this.ramo,
            sala: this.idSala,
            clase_dia: new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })).toISOString().slice(0, 10),
          }
        });
      }
      



    },
  },
};
</script>

<style scoped>
@import "../assets/estilos.css";

.boton-amarillo {
  background-color: #f89d1e;
}

.disabled-cursor:disabled {
  cursor: not-allowed;
}
</style>
