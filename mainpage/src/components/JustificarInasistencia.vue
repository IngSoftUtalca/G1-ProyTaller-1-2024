<template>
  <div class="container-fluid ligth-bg text-center">
    <div class="row mt-24 mb-52">

      <h1 class="text-center font-24 bold">Justificar Inasistencia</h1>
    </div>

    <label class="bold" for="reason">Seleccione la Razón de la Inasistencia</label>
    <div class="mt-2">
      <select id="reason" v-model="selectedReason" @change="checkOtherReason">
        <option value="" disabled>Seleccione una razón</option>
        <option v-for="reason in reasons" :key="reason" :value="reason">{{ reason }}</option>
        <option value="Otro">Otro...</option>
      </select>
      <div class="mt-2" v-if="isOtherSelected">
        <textarea v-model="otherReason" placeholder="Ingrese la razón" />
      </div>
      <div class="mt-5">
        <button class="btn-primary-16 btn-size-120" @click="closeOverlay">Cerrar</button>
        <button class="btn-primary-16 btn-size-120" style="margin-left: 32px;" @click="submitReason">Enviar</button>
      </div>

    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      show: true,
      selectedReason: '',
      reasons: [
        'Enfermedad',
        'Cita médica',
        'Día Administrativo',
        'Problemas de transporte',

      ],
      isOtherSelected: false,
      otherReason: ''
    };
  },
  methods: {
    closeOverlay() {
      this.show = false;
      this.$emit('close');
    },
    checkOtherReason() {
      this.isOtherSelected = this.selectedReason === 'Otro';
    },
    submitReason() {
      const reason = this.isOtherSelected ? this.otherReason : this.selectedReason;
      if (reason) {
        alert(`Razón seleccionada: ${reason}`);
        this.closeOverlay();
      } else {
        alert('Por favor, seleccione una razón.');
      }
      this.$emit('close');
    }
  }
};
</script>