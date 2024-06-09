<template>
    <div class="container">
        <div class="bg">
        </div>
        <div class="bga">
            <div class="content">
                <h1>Gimnasios de Toji:</h1>
                <h2>"Transforma tu esfuerzo en poder."</h2>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap'); /* Importa la fuente Roboto */

body {
    margin: 0; /* Elimina márgenes del body */
    font-family: 'Roboto', sans-serif; /* Aplica la fuente Roboto al body */
}

.container {
    display: flex; /* Utiliza flexbox para alinear los hijos horizontalmente */
    height: 100vh;
    width: 100vw;
}

.bg {
    background-image: url(../assets/toji.jpg);
    background-size: cover; /* Asegura que la imagen de fondo cubra todo el div */
    background-position: center; /* Centra la imagen de fondo */
    height: 100%;
    width: 50%;
}

.bga {
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: center; 
    align-items: center; 
    padding: 20px; 
    background-color: rgba(254,253,251,255);
}

.content {
    text-align: center; 
}

h1 {
    font-size: 5.5em; 
    margin-bottom: 20px;
    font-weight: 700; 
    color: red;
}

h2 {
    font-size: 3.5em; 
    font-weight: 400; 
    margin: 0; 
    color: black
}
</style>

