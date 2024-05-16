<template>
  <div id="app" class="fondo container-fluid">
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
          <p class="ramos">Clase iniciada</p>
        </div>
        <div
          class="row d-flex h-50 justify-content-center align-items-start m-0 py-0"
        >
          <p class="ramos">{{ inicio }}</p>
        </div>
        <!-- <h3 class="ramos"> {{ramo}}Taller de Software B1 8:30-9:30</h3> -->
      </div>
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
    <div>
      <button
        class="btn boton_gris text-white bold"
        type="button"
        @click="claseiniciada"
        v-if="!loading"
      >
        Finalizar Clase
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ENPOINTS from "../../../ENPOINTS.json";
export default {
  data() {
    return {
      inicio: "",
      loading: true,
      botonC: false,
    };
  },
  async mounted() {
    const moment = require("moment-timezone");
    this.inicio = moment().tz("America/Santiago").format("HH:mm");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.loading = false;
  },
  methods: {
    claseiniciada() {
      // Aquí puedes agregar la lógica para marcar la asistencia
      axios
        .post(
          ENPOINTS["ms-registroasistencia"] + "/registrarfinal",
          {
            Rut: "33061234-1",
            fecha: "2024-05-14",
            test: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Response: ", response.data);
          this.$router.push({ name: "InicioSesion" });
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

.boton-amarillo {
  background-color: #f89d1e;
}
</style>
