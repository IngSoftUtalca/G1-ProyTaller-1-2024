<template>
    <div class="error-page">
        <h1>Sala {{ idSala }}</h1>
        <p>esto es para probar la sala dinamica</p>
    </div>
</template>

<style scoped>
.error-page {
    text-align: center;
    margin-top: 100px;
}

h1 {
    font-size: 48px;
    color: #ff0000;
}

p {
    font-size: 24px;
    color: #333333;
}
</style>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const idSala = ref(route.params.idSala)

    onMounted(() => {
      // Fetch data for this sala here
    })

    return {
      idSala
    }
  }
}
</script>