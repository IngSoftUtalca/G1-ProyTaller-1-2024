<template>
  <div class="container-fluid ligth-bg">
    <div class="row mt-24 mb-52">
      <p class="text-center font-24 bold">Agregar Docentes</p>
    </div>
    <form @submit.prevent="cargarDocente" class="container-fluid">
      <div class="container row d-flex justify-content-center">
        <div class="row w-75">
          <label for="Docente" class="bold font-16">Docente:</label>
        </div>
        <div class="row w-75">
          <input
            type="text"
            id="Docente"
            v-model="Ramo"
            class="text-input"
            placeholder="Nombre del docente a agregar..."
            list="docentes"
          />
          <datalist id="docentes">
            <option
              v-for="(docente, i) in docentes"
              :value="docente.Nombre"
              :key="i"
            ></option>
          </datalist>
        </div>
      </div>
      <div class="row mt-216">
        <div class="col d-flex justify-content-end">
          <div class="row btn-size-120">
            <button class="btn-primary-16 bold" @click.prevent="close">
              Cancelar
            </button>
          </div>
        </div>
        <div class="col ms-5 d-flex justify-content-start">
          <div class="row btn-size-120">
            <button class="btn-primary-16 bold" type="submit">
              <span>Guardar</span>
              <span
                class="ms-1 spinner-border spinner-border-sm"
                aria-hidden="true"
                v-if="loading"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import ENDPOINTS from "../../../ENPOINTS.json";

export default {
  name: "AgregarPeriodo",
  data() {
    return {
      loading: false,
      docentes: [],
    };
  },
  async mounted() {
    await axios
      .get(ENDPOINTS["bff-datosdocentes"] + "/all-docentes")
      .then((response) => {
        this.docentes = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    cargarDocente() {
      console.log("Cargando docente");
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
    forwardClick(event) {
      const dateInput = event.target.previousElementSibling;
      dateInput.focus();
      dateInput.click();
    },
  },
};
</script>
