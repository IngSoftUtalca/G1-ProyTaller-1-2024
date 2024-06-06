<template>
  <div class="container-fluid d-flex w-90">
    <div class="col d-flex justify-content-end">
      <table
        class="w-90 mx-4 mt-3 text-center gray-border"
        v-if="!loading"
        :key="count"
      >
        <thead class="primary-bg h-40">
          <tr>
            <th>R.U.T</th>
            <th>Nombre</th>
            <th>Facultad</th>
            <th>Campus</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="secondary-bg">
          <tr class="h-36" v-for="(docente, index) in docentes" :key="index">
            <td class="gray-border">{{ formatearmiles(docente.RUT) }}</td>
            <td class="gray-border text-start px-3">{{ docente.Nombre }}</td>
            <td class="gray-border">{{ docente.Facultad }}</td>
            <td class="gray-border">{{ docente.Campus }}</td>
            <td
              class="gray-border h-36 px-3 d-flex justify-content-end align-items-center"
            >
              <button
                class="btn-gray btn-size-85 bold font-12"
                @click="deshabilitar(index)"
                v-if="docente.Estado === 'activo'"
              >
                Deshabilitar
              </button>
              <button
                class="btn-gray btn-size-85 bold font-12"
                @click="habilitar(index)"
                v-if="docente.Estado === 'inactivo'"
              >
                Habilitar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="col-1 container-fluid mt-24 d-flex justify-content-end"
      v-if="!loading"
    >
      <button class="btn-primary-16 btn-size-120" @click.prevent="add">
        <span class="bold"> Agregar </span>
        <img src="@/assets/plus.svg" alt="Agregar" />
      </button>
    </div>
    <div class="underlay" v-if="OverlayAgregar" @click="close">
      <AgregarDocente
        class="overlay"
        v-if="OverlayAgregar"
        @click.stop
        @close="close"
      />
    </div>
  </div>
  <!-- loading-->
  <div
    class="container d-flex justify-content-start align-items-center h-450"
    v-if="loading"
  >
    <div class="spinner-grow primary-normal div-size-72" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import AgregarDocente from "@/components/AgregarDocente.vue";
import ENDPOINTS from "../../../ENPOINTS.json";
import axios from "axios";
export default {
  name: "AdministradoresWeb",
  data() {
    return {
      OverlayAgregar: false,
      docentes: null,
      loading: true,
      count: 0,
    };
  },
  async mounted() {
    await this.getDocentes();
    this.loading = false;
  },
  methods: {
    async getDocentes() {
      await axios
        .get(ENDPOINTS["bff-datosdocentes"] + "/all-docentes")
        .then((response) => {
          this.docentes = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatearmiles(n) {
      return (
        n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
        "-" +
        this.calcularDV(n)
      );
    },
    calcularDV(rut) {
      var M = 0,
        S = 1;
      for (; rut; rut = Math.floor(rut / 10))
        S = (S + (rut % 10) * (9 - (M++ % 6))) % 11;
      return S ? S - 1 : "k";
    },
    add() {
      this.OverlayAgregar = true;
    },
    async close() {
      await this.getDocentes();
      this.OverlayAgregar = false;
      this.count += 1;
    },
    async habilitar(i) {
      this.loading = true;
      await axios.post(
        ENDPOINTS["ms-gestordocente"] + "/habilitar",
        {
          rut: this.docentes[i].RUT,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await this.getDocentes();
      this.loading = false;
      this.count += 1;
    },
    async deshabilitar(i) {
      this.loading = true;
      await axios.post(
        ENDPOINTS["ms-gestordocente"] + "/deshabilitar",
        {
          rut: this.docentes[i].RUT,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await this.getDocentes();
      this.loading = false;
      this.count += 1;
    },
  },
  components: {
    AgregarDocente,
  },
};
</script>
