<template>
    <HeaderHome :usuario="this.rut" />
    <div class="background">
    </div>
    <MainFooter />
</template>

<script>
    import MainFooter from '@/components/MainFooter.vue';
    import HeaderHome from '@/components/HeaderHome.vue';

    export default {
        name: 'HomeWebMaster',
        data() {
            return {
                rut: ''
            }
        },
        mounted() {
            this.rut = this.$route.params.rut;
            document.title = 'UTalca | WebMaster';
            console.log(this.rut);
        },
        components: {
            HeaderHome,
            MainFooter
        }
    }
</script>

<style scoped>
    .background {
        background-image: url('~@/assets/working.png');
        background-position: center;
        background-repeat: no-repeat;
        height: 100vh;
        width: 100vw;
    }
</style>