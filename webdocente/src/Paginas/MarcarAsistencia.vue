<template>
  <div id="app" class="fondo container">
    <!-- Imagen en la parte superior -->
    <div class="row justify-content-center">
      <img
        src="../assets/utalca.svg"
        alt="Logo"
        class="logo_utalca"
        style="max-width: 200px; max-height: 200px"
      />
    </div>
    <!-- Contenido principal -->
    <div
      class="row d-flex justify-content-center align-items-center text-center"
      v-if="!loading"
    >
      <div class="card-celeste container">
        <div
          class="row d-flex h-50 justify-content-center align-items-end m-0 py-0"
        >
          <p class="ramos">
            {{ ramo }}
          </p>
        </div>
        <div
          class="row d-flex h-50 justify-content-center align-items-start m-0 py-0"
        >
          <p class="ramos">{{ bloque }} {{ inicio }} - {{ termino }}</p>
        </div>
        <!-- <h3 class="ramos"> {{ramo}}Taller de Software B1 8:30-9:30</h3> -->
      </div>
    </div>
    <div>
      <button
        class="btn boton_gris text-white bold"
        type="button"
        @click="marcarAsistencia"
        v-if="!loading"
      >
        Confirmar
      </button>
    </div>
    <div
      class="container h-75 d-flex align-items-center justify-content-center"
      v-if="loading"
    >
      <div class="spinner-grow text-primaryC loading" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <!-- Botón de asistencia -->
    <div :hidden="true">
      <a class="btn boton_gris" :class="{ 'boton-amarillo': botonC }">
        <button type="button" @click="marcarAsistencia">Confirmar</button>
      </a>
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
      ramo: "",
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
    this.loading = false;
  },
  methods: {
    marcarAsistencia() {
        window.location.href = ENPOINTS["login-WD"];
    },
  },
};
</script>

<style scoped>
@import "../assets/estilos.css";

.boton-amarillo {
  background-color: #f89d1e;
}
</style>
