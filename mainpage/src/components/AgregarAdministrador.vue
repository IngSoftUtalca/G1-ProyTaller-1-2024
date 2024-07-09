<template>
    <div class="container-fluid ligth-bg">
      <div class="row mt-24 mb-3">
        <p class="text-center font-24 bold">Incripción de nuevos Administradores</p>
      </div>
      <form @submit.prevent="addAdmin" class="container-fluid">
        <div class="container row d-flex justify-content-center">
          <div class="row w-75">
            <label for="RUT" class="bold font-16">R.U.T:</label>
          </div>
          <div class="row mt-1 w-75">
            <input
              type="text"
              id="RUT"
              v-model="RUT"
              class="text-input"
              placeholder="R.U.T sin puntos con guion..."
            />
          </div>
          <div class="row mt-1 w-75">
            <label for="Nombre" class="bold font-16">Nombre:</label>
          </div>
          <div class="row w-75">
            <input
              type="text"
              id="Nombre"
              v-model="Nombre"
              class="text-input"
              placeholder="Nombre del docente a inscribir..."
            />
          </div>
          <div class="row mt-1 w-75">
            <label for="Facultad" class="bold font-16">Facultad:</label>
          </div>
          <div class="row w-75">
            <input
              type="text"
              id="Facultad"
              v-model="Facultad"
              class="text-input"
              placeholder="Facultad del docente a inscribir..."
            />
          </div>
          <div class="row mt-1 w-75">
            <label for="Campus" class="bold font-16">Campus:</label>
          </div>
          <div class="row mt-1 w-75">
            <input
              type="text"
              id="Campus"
              v-model="Campus"
              class="text-input"
              placeholder="Campus del docente a inscribir..."
            />
          </div>
        </div>
        <div class="row d-flex align-items-end mt-5">
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
                <span>Inscribir</span>
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
import ENDPOINTS from "../../../ENDPOINTS.json";

export default {
  name: "AgregarAdministrador",
  data() {
    return {
      loading: false,
      rawRUT: "",
    };
  },
  methods: {
    async addAdmin() {
      this.loading = true;
      /**
       * Validamos el rut
       * minimo 7 caracteres
       * dv valido
       * */
      if (this.RUT.length < 7) {
        this.loading = false;
        alert("RUT invalido");
        return;
      }
      if (
        this.calcularDV(this.desformatearRut(this.RUT)) !=
        this.RUT.split("-")[1]
      ) {
        this.loading = false;
        alert("RUT invalido");
        return;
      }
      await axios.post(
        ENDPOINTS["ms-gestoradmin"] + "/crear",
        {
          rut: this.desformatearRut(this.RUT),
          nombre: this.Nombre,
          facultad: this.Facultad,
          campus: this.Campus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      this.loading = false;
      this.$emit("close");
    },
    desformatearRut(rut) {
      rut += "-";
      return rut.split("-")[0].replace(/\./g, "");
    },
    calcularDV(rut) {
      var M = 0,
        S = 1;
      for (; rut; rut = Math.floor(rut / 10))
        S = (S + (rut % 10) * (9 - (M++ % 6))) % 11;
      return S ? S - 1 : "k";
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
