<template>
    <div class="primary-bg fullscreen d-flex justify-content-center align-items-center">
        <div class="secondary-bg login-container container">
            <div class="row mt-4 pb-3 d-flex justify-content-center">
                <div class="max-width-utalca">
                    <img src="@/assets/utalca-negro.svg" alt="UTalca Logo" class="img-fluid">
                </div>
            </div>
            <div class="row pb-4">
                <h2 class="text-center black-bold">Bienvenido al portal</h2>
                <h3 class="text-center black">{{ uppercase(userType) }}</h3>
            </div>
            <form @submit.prevent="handleLogin" class="container w-50 d-flex justify-content-center">
                <div class="row m-2 btn-size-120">
                    <button class="btn-gray" @click="cancelLogin">Cancelar</button>
                </div>
                <div class="row m-2 btn-size-120">
                    <button class="btn-primary" type="submit">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import ENDPOINTS from "../../../ENPOINTS.json";

export default {
    name: 'FakeLogin',
    data() {
        return {
            userType: null
        }
    },
    mounted() {
        this.userType = this.$route.params.userType
        document.title = 'UTalca | ' + this.userType + ' Login'
    },
    methods: {
        handleLogin() {
            if (this.userType === 'docente') {
                window.location.href = ENDPOINTS['login-docente']
            } else if (this.userType === 'administrador') {
                window.location.href = ENDPOINTS['login-admin']
            } else if (this.userType === 'webmaster') {
                window.location.href = ENDPOINTS['login-WM']
            }
        },
        uppercase(value) {
            if (!value) return ''
            value = value.toString()
            return value.toUpperCase()
        },
        cancelLogin() {
            this.$router.go(-1); // Navega a la página anterior
        }
    }
}
</script>

<style scoped>
.max-width-utalca {
    max-width: 100px;
}
</style>