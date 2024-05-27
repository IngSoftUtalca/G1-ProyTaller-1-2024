<template>
  <div id="app" class="fondo container-fluid">
    <!-- Imagen en la parte superior -->
    <div class="row justify-content-center">
      <img src="../assets/utalca.svg" alt="Logo" class="logo_utalca" style="max-width: 200px; max-height: 200px" />
    </div>
    <!-- Contenido principal -->
    <div class="row d-flex justify-content-center align-items-center text-center" v-if="!loading">
      <div class="card-celeste container">
        <div class="row d-flex h-50 justify-content-center align-items-end m-0 py-0">
          <p class="ramos">Clase iniciada</p>
        </div>
        <div class="row d-flex h-50 justify-content-center align-items-start m-0 py-0">
          <p class="ramos">{{ inicio }}</p>
        </div>
        <!-- <h3 class="ramos"> {{ramo}}Taller de Software B1 8:30-9:30</h3> -->
      </div>
    </div>
    <div class="container h-75 d-flex align-items-center justify-content-center" v-if="loading">
      <div class="spinner-grow text-primaryC loading" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <!-- Botón de asistencia -->
    <div>
      <button class="btn boton_gris text-white bold" type="button" @click="claseiniciada" v-if="!loading">
        Finalizar Clase
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ENPOINTS from "../../../ENPOINTS.json";
import { useRoute } from "vue-router";
import constantes from "../shared/constances.json";

export default {
  data() {
    return {
      inicio: "",
      loading: true,
      botonC: false,
      rut: "",
      sala: "", 
      bloque: ""
    };
  },
  async mounted() {
    let routeError = false;
    let mensajeError = "";
    const route = useRoute();
    const moment = require("moment-timezone");
    this.inicio = moment().tz("America/Santiago").format("HH:mm");
    this.rut = route.params.id;
    let dia = new Date().getDay();
    const bloques = constantes.bloques;
    // en el arreglo json bloques buscaramos el bloque en el que su hora de inicio y termino esté dentro de la hora actual
    this.bloque = "12";
    for (let i = 0; i < bloques.length; i++) {
      const horaInicioBloque = moment(bloques[i].inicio, "HH:mm:ss");
      const horaFinBloque = moment(bloques[i].fin, "HH:mm:ss");
      const horaActual = moment(this.inicio, "HH:mm:ss");

      if (horaActual.isBetween(horaInicioBloque, horaFinBloque)) {
        this.bloque = bloques[i].id;
        break;
      }
    }

    this.sala = this.$route.query.sala;

    const res = await axios.get(
      ENPOINTS["bff-horarios"] +
      "/instancia?sala=" +
      this.sala +
      "&dia=" +
      dia +
      "&bloque=" +
      this.bloque
    );

    const Ramo = res.data.Ramo;

    console.log("ramo: ", Ramo);

    try {
      await axios.post(
        ENPOINTS["ms-validacionrol"] + "/validar",
        {
          rut: this.rut,
          rol: "docente",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      mensajeError = error.response.data.Nombre;
      routeError = true;
    }

    try {
      await axios.post(
        ENPOINTS["ms-validacionrol"] + "/validar/ramo",
        {
          Rut: this.rut,
          Ramo: Ramo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }catch (error) {
      mensajeError = error.response.data.mensaje;
      routeError = true;
    }

    await axios.post(ENPOINTS["ms-registroasistencia"] + "/registrarinicio", {
      Rut: this.rut,
      Ramo: Ramo,
      Sala: this.sala,
      Inicio: this.inicio
    },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        console.log("Response: ", response.data);
      })
      .catch((error) => {
        mensajeError = error.response.data.error;
        routeError = true;
      });

    routeError ? await this.$router.push({path: '/error', params: {mensaje: mensajeError}}) : this.loading = false;
  },
  methods: {
    claseiniciada() {
      // Aquí puedes agregar la lógica para marcar la asistencia
      axios
        .post(
          ENPOINTS["ms-registroasistencia"] + "/registrarfinal",
          {
            Rut: this.rut
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Response: ", response.data);
          window.location.href = ENPOINTS["webdocente"];
        })

        .catch((error) => {
          console.error("Error:", error.response);
          //return "malo";
          this.$router.push("/error");
        });

      console.log("Asistencia marcada");
    },
  },
};
</script>

<style scoped>
@import "../assets/estilos.css";
</style>
