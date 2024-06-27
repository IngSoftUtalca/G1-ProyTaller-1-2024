<template>
  <div>
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
      <h1>Plataforma de Gestión de asistencia docente</h1>
      <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="https://www.utalca.cl/content/uploads/2019/04/CAMPUS.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ36yItMYeOAspghICHdd-xOjS_h7SfAaC6dg&s" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="https://www.utalca.cl/content/uploads/2019/04/CAMPUS.jpg" class="d-block w-100" alt="...">
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
          <h2>Noticias de la plataforma</h2>
          <div class="photo">Foto</div>
          <p>Texto</p>
        </div>
        <div class="section multimedia">
          <h2>Multimedia</h2>
          <div class="photo-list">
            <div class="photo-item">
              <div class="photo">Foto</div>
              <a href="#">Enlaces</a>
            </div>
            <div class="photo-item">
              <div class="photo">Foto</div>
              <a href="#">Enlaces</a>
            </div>
            <div class="photo-item">
              <div class="photo">Foto</div>
              <a href="#">Enlaces</a>
            </div>
            <div class="photo-item">
              <div class="photo">Foto</div>
              <a href="#">Enlaces</a>
            </div>
          </div>
        </div>
        <div class="section dates">
          <h2>Fechas</h2>
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
  justify-content: space-between;
  padding: 20px;
}

.section {
  width: 30%;
}

.news .photo {
  background-color: orange;
  height: 150px;
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
