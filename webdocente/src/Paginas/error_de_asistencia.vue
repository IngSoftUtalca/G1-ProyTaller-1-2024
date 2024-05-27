<template>
  <div id="app" class="fondo container-fluid d-flex align-items-center w-100 p-0">
    <div class="container row d-flex justify-content-center align-items-center m-0 p-0">
      <!-- Imagen en la parte superior -->
      <div class="row justify-content-center mb-5">
        <img src="../assets/error.svg" alt="Logo" class="img_error" style="max-width: 150px; max-height: 150px">
      </div>
      <!-- Contenido principal -->
      <div class="row text-center d-flex align-items-center my-3">
        <p class="font-24 bold"> Revisa tu horario, no se ha logrado marcar la asistencia</p>
      </div>
      <!-- Botones -->
      <div class="row container d-flex justify-content-center align-items-center w-100 p-0 v-100">
        <div class="row d-flex justify-content-center align-items-center m-0 p-0">
          <button type="button" class="btn boton_celeste size-200 bold" :class="{ 'boton-amarillo': botonC }"
            @click="reportarError">Reportar error</button>
        </div>
        <div class="row d-flex justify-content-center align-items-center">
          <button type="button" class="btn boton_celeste size-120 bold" :class="{ 'boton-amarillo': botonC }"
            @click="cambiarColor">Salir</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      botonC: false, // Variable para controlar el color del botón
      mensaje: "", // Mensaje de error
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
  },
  methods: {
    reportarError() {
      this.$router.push({
        name: 'ReporteError',
        params: {
          rut: this.rut,
          mensaje: this.mensaje,
          jusificable: this.justificable,
          ramo: this.ramo,
          sala: this.sala,
          clase_dia: this.clase_dia,
        }
      });
    },
    cambiarColor() {
      // Cambiar el estado del botón de rojo a otro color y viceversa
      this.botonC = !this.botonC;
      window.close();
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