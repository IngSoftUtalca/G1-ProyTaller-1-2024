<template>
    <header class="header container-fluid">
        <div class="row h-100 ">
            <div class="col-3 d-flex justify-content-end">
                <img src="@/assets/utalca-blanco.svg" alt="logo" class="logo" />
            </div>
            <div class="col ms-3 container row d-flex align-items-end mb-0">
                <div class="col text-center">
                    <a href="https://www.utalca.cl/" class="pb-1">Universidad de Talca</a>
                </div>
                <div class="col text-center">
                    <a href="/docente/1" class="pb-1">Docentes</a>
                </div>
                <div class="col text-center">
                    <a href="/administrador/1" class="pb-1">Directores de Escuela</a>
                </div>
                <div class="col text-center">
                    <a href="/login/webmaster" class="pb-1">Decanos</a>
                </div>
            </div>
            <div class="col-3"></div>
        </div>
    </header>
    <section class="container-fluid">
        <div class="row">
            <div class="col ms-5 mt-3 d-flex jusify-content-center align-items-start">
                <div class="w-75 mx-auto">
                    <h1 class="text-center">
                    Plataforma de Gestión de asistencia docente
                    </h1>
                    <p>
                        Nos complace presentar nuestro innovador sistema de registro de asistencia universitaria, cuidadosamente diseñado para ofrecer una gestión eficiente y segura de la asistencia de docentes. Esta solución digital se integra a la perfección con la red universitaria, proporcionando herramientas avanzadas y amigables que facilitan la experiencia de nuestros usuarios.
                    </p>
                    <p>
                        Los accesos administrativos están meticulosamente estructurados en diferentes niveles, ofreciendo una gestión organizada y eficaz. Los reportes de asistencia son detallados y versátiles, permitiendo generar informes semanales y semestrales, así como un reporte global con opción detallada por curso. Estos informes contienen datos esenciales como horarios, nombres de cursos, carreras, número de estudiantes y nombres de profesores, ofreciendo una visión completa y precisa de la asistencia.
                    </p>
                    <p>
                        Para garantizar la integridad y seguridad en el registro de asistencias, hemos implementado múltiples mecanismos de validación, que incluyen QRs en las salas, verificación de geolocalización y una funcionalidad de verificación de red. Los docentes son responsables de registrar su asistencia al inicio y final de cada clase, con la flexibilidad de poder actualizarla dentro de un rango de 2 horas en caso de olvido.
                    </p>
                    <p>
                        En situaciones excepcionales, como fallos de red o problemas con los QR, mantenemos un método tradicional de firma en la dirección de escuela como respaldo. Además, se registra y detalla si la clase fue en línea, añadiendo un comentario específico para una mayor claridad.
                    </p>
                    <p>
                        En resumen, nuestro sistema representa una solución integral y moderna para la gestión de la asistencia universitaria, adaptada a las necesidades específicas de nuestra comunidad educativa. Esta iniciativa surge con el objetivo primordial de simplificar y optimizar la gestión de los datos actualmente registrados en papel, reemplazándolos por una solución digital que mejora la disponibilidad y precisión de la información.
                    </p>
                    <p>
                        Este proyecto se alinea con la visión de la Universidad de Talca de ser reconocida como una universidad pública por excelencia y un referente en educación. Se busca modernizar y mejorar la gestión de la asistencia del docente, superando el método actual de firma física en la dirección de escuela, que carece de vigilancia y precisión.
                    </p>
                    <p>
                        Con este proyecto, aspiramos a optimizar el proceso de documentación de asistencias, ofreciendo una solución técnica que sea fácil de usar para todos los usuarios involucrados. Además, nos comprometemos con el cuidado del medio ambiente al sustituir el documento en papel por un formato digital, y facilitamos a los profesores el registro de su asistencia desde las mismas aulas en las que imparten clases, eliminando desplazamientos innecesarios y agilizando el proceso.
                    </p>
                    <p>
                        Invitamos a nuestra comunidad educativa a ser parte de esta transformación digital, que busca mejorar continuamente y adaptarse a las necesidades cambiantes de nuestra universidad.
                    </p>
                </div>
                
            </div>
            <div class="col-4 d-flex justify-content-end m-0 p-0">
                <div class="limited-width-column secondary-bg">
                    <div class="d-flex justify-content-center align-items-center p-5 h-50">
                    <div class="row image-container">
                        <img src="@/assets/cont1.svg" alt="gato" />
                    </div>
                    </div>
                    <div class="d-flex justify-content-center align-items-center p-5 h-50">
                        <div class="row image-container">
                            <img src="@/assets/cont2.svg" alt="huasa" />
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </section>
    <MainFooter />
</template> 

<script>
    import MainFooter from '@/components/MainFooter.vue'

    export default {
        name: 'LandingPage',
        mounted() {
            document.title = 'UTalca | Asistencia Docente'
        },
        components: {
            MainFooter
        }
    }
</script>

<style>
    .image-container {
        max-width: 450px;
        width: 100%;
    }
    .image-container img {
        width: 100%;
        height: auto;
    }
    .limited-width-column {
        max-width: 500px;
        width: 100%;
    }
</style>