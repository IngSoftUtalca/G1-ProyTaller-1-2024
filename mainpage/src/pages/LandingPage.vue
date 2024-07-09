<template>
  <div class="page-container">
    <header class="header container-fluid">
      <div class="row h-100">
        <div class="col-3 d-flex justify-content-end">
          <img src="@/assets/utalca-blanco.svg" alt="logo" class="logo" />
        </div>
        <div class="col ms-3 container row d-flex align-items-end mb-0">
          <div class="col text-center">
            <a href="https://www.utalca.cl/" class="pb-1">UTalca</a>
          </div>
          <div class="col text-center">
            <a href="/login/docente" class="pb-1">Docentes</a>
          </div>
          <div class="col text-center">
            <a href="/login/administrador" class="pb-1">Directores Escuela</a>
          </div>
          <div class="col text-center">
            <a href="/login/webmaster" class="pb-1">Decanos</a>
          </div>
        </div>
        <div class="col-3"></div>
      </div>
    </header>
    <main>
      
      <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="https://uchile.cl/dam/jcr:9d779d75-0c94-4d19-89b1-482f212af63c/foto-fachada-%20U-de-talca.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="https://s3.ingenieriautalca.cl/n9o3ax6f24dffce3nn5nhpcf9dydee/_MG_5122.JPG" class="d-block w-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div class="content">
        <div class="section news">
          <div class="news-item">
            <div class="photo">
              <img src="https://www.utalca.cl/content/uploads/2024/07/Diseno-sin-titulo-5.jpg" alt="">
              <span class="category">Vinculación</span>
            </div>
            <p><a href="https://www.utalca.cl/noticias/parque-de-las-esculturas-sumara-obra-inmersiva/">Parque de las Esculturas sumará obra inmersiva</a></p>
          </div>
          <div class="news-item">
            <div class="photo">
              <img src="https://www.utalca.cl/content/uploads/2024/07/Diseno-sin-titulo-1.png" alt="">
              <span class="category">Vinculación</span>
            </div>
            <p><a href="https://www.utalca.cl/noticias/clinica-tributaria-atendio-a-mas-de-800-contribuyentes-del-maule/">Clínica Tributaria atendió a más de 800 contribuyentes del Maule</a></p>
          </div>
          <div class="news-item">
            <div class="photo">
              <img src="https://www.utalca.cl/content/uploads/2024/07/Diseno-sin-titulo-4.jpg" alt="">
              <span class="category">Academia e Innovación</span>
            </div>
            <p><a href="https://www.utalca.cl/noticias/expertos-analizan-desafios-sobre-el-buen-trato-hacia-las-personas-mayores/">Expertos analizan desafíos sobre el buen trato hacia las personas mayores</a></p>
          </div>
        </div>
        
        <div class="section dates">
         
          <vue-cal
            class="calendar"
            default-view="month"
            :disable-views="['week', 'day','years','year']"
          />
        </div>
      </div>
    </main>
    <MainFooter />
  </div>
</template>

<script>
import MainFooter from '@/components/MainFooter.vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  name: 'LandingPage',
  components: {
    MainFooter,
    VueCal
  },
  mounted() {
    document.title = 'UTalca | Asistencia Docente'
  }
}
</script>

<style scoped>
.page-container {
  position: relative;
  min-height: 100vh;

  background-size: cover;
  background-position: center;
}

.page-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  filter: grayscale(100%);
  z-index: 1;
}

.header,
main,
MainFooter {
  position: relative;
  z-index: 2;
}

.logo {
  font-size: 24px;
}

.calendar {
  background-color: #630808;
  border: 1px solid #cccccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(1, 1, 183, 0.1);
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-right: 20px;
}

nav ul li a {
  color: white;
  text-decoration: none;
}

.carousel {
  text-align: center;
  margin: 20px 0;
}

.carousel .slide {
  position: relative;
}

.carousel img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.carousel .caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.section {
  width: 100%;
  margin-bottom: 20px;
}

.news {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.news-item {
  width: 30%;
  margin-bottom: 20px;
  position: relative;
}

.news .photo img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.news .category {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: orange;
  color: white;
  padding: 5px;
  border-radius: 5px;
}

.news-item p {
  margin-top: 10px;
}

.news-item a {
  color: #000;
  text-decoration: none;
}

.news-item a:hover {
  text-decoration: underline;
}

.multimedia .photo-list {
  display: flex;
  flex-direction: column;
}

.multimedia .photo-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.multimedia .photo {
  background-color: orange;
  height: 50px;
  width: 50px;
  margin-right: 10px;
}

.dates .calendar {
  background-color: white;
  height: auto;
}

.dates ul {
  list-style: none;
  padding: 0;
}

/* Additional styles to hide the navigation bar in vue-cal */
.vuecal__header,
.vuecal__header div {
  display: none !important;
}
</style>
