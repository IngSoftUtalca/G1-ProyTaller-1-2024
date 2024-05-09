<template>
    <div class="primary-bg fullscreen d-flex justify-content-center align-items-center">
        <div class="secondary-bg login-container container">
            <div class="row mt-4 pb-3 d-flex justify-content-center">
                <div class="max-width-utalca">
                    <img src="@/assets/utalca-negro.svg" alt="UTalca Logo" class="img-fluid">
                </div>
            </div>
            <div class="row pb-4">
                <h3 class="text-center black-bold">{{ uppercase(userType)}}</h3>
            </div>
        <form @submit.prevent="handleLogin" class="container w-50">
            <div class="row">
                <label for="username">RUT: (xxxxxxxx-x)</label>
            </div>
            <div class="row">
                <input class="text-input" id="username" v-model="rut" @change="formatRut" placeholder="Sin puntos con guion" required>
            </div>
            <div class="row">
                <label for="password">Contraseña:</label>
            </div>
            <div class="row mb-4">
                <input class="text-input" id="password" v-model="password" type="password" placeholder="Contraseña..." required>
            </div>
            <div class="row container">
                <div class="col d-flex justify-content-start">
                    <div class="row btn-size-120">
                        <button class="btn-gray" @click="cancelLogin">Cancelar</button>
                    </div>
                </div>
                <div class="col d-flex justify-content-end">
                    <div class="row btn-size-120">
                        <button class="btn-gray" type="submit">Login</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    </div>
</template>

<script>
    export default {
        name: 'FakeLogin',
        data() {
            return {
                username: '',
                password: '',
                userType: null
            }
        },
        mounted() {
            this.userType = this.$route.params.userType
            document.title = 'UTalca | '+this.userType+' Login'
        },
        methods: {
            formatRut() {
                let rut = this.rut;
                if (typeof rut !== 'string') {
                    rut = rut.toString();
                }
                const rutParts = rut.split('-');
                let formattedNumber = rutParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                this.rut = `${formattedNumber}-${rutParts[1]}`;
            },
            handleLogin() {
                this.$router.push({ name: 'HomePage', params: {userType: this.userType, rut: this.rut } });
                this.username = '';
                this.password = '';
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