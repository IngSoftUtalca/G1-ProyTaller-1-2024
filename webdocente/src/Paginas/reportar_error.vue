<template>
  <div id="app" class="fondo_celeste container-fluid d-flex justify-content-center align-items-center">
    <!-- Imagen en la parte superior -->

    <!-- Contenido principal -->

    <div class="row d-flex justify-content-center align-items-center">
      <div class="card-blanca">
        <div class="row justify-content-center">
          <img src="../assets/utalca.svg" alt="Logo" class="logo_utalca" style="max-width: 200px; max-height: 200px;">
        </div>
        <p class="texto">Cuentanos que pasó:</p>
        <select class="form-control" v-model="selectedOption">
          <option value="error_de_red">Error de red</option>
          <option value="error_de_gps">Error de GPS</option>
          <option value="no_hay_internet">No hay internet</option>
          <option value="fuera_de_tiempo">Fuera de tiempo</option>
          <option value="clase_fue_online">La clase fue online</option>
        </select>
        <p class="texto">Detalles (Opcional):</p>
        <textarea class="form-control h-25" v-model="details" placeholder="Detalles"></textarea>
        <button type="button" class="btn boton_rojo" @click="enviarReporte">Enviar reporte</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ENPOINTS from "../../../ENPOINTS.json";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      selectedOption: 'error_de_red',
      details: '',
      mensaje: '', // Mensaje de error
      justificable: false, // Variable para saber si el error es justificable
      ramo: "", // Nombre del ramo
      sala: "", // Nombre de la sala
      clase_dia: "", // Nombre de la clase
      rut: "", // Rut del usuario
    }
  },
  mounted() {
    const route = this.$route;
    const { rut, mensaje, jusificable, ramo, sala, clase_dia } = route.params;
    this.mensaje = mensaje;
    this.justificable = jusificable;
    this.ramo = ramo;
    this.sala = sala;
    this.clase_dia = clase_dia;
    this.rut = rut;
    console.log(route.params);
  },
  methods: {
    async enviarReporte() {
      // Aquí puedes agregar la lógica para enviar el reporte
      const detalle = this.selectedOption + ': ' + this.details;
      await axios.post(ENPOINTS['ms-erroresasistencia'] + '/error', {
        rut: this.rut,
        razon: this.mensaje,
        detalle: detalle,
        justificable: this.justificable === 'true' ? true : false,
        ramo_nombre: this.ramo,
        sala: this.sala,
        clase_dia: this.clase_dia
      }).then(() => {
        Swal.fire({
          title: 'Reporte enviado',
          text: 'Tu reporte ha sido enviado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            this.$router.push({ path: '/' });
          }
        });
      }).catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al enviar el reporte',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            this.$router.push({ path: '/' });
          }
        });
      })
    }
  }
}
</script>

<style scoped>
@import '../assets/estilos.css';

.texto {
  font-size: 16px;
  text-align: left;
}
</style>