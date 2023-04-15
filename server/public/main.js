const socket = io();

socket.on ('lap', (data) => {
    console.log(data);

    document.getElementById('rpm').innerHTML = 'RPM: ' + data.rpm + ' rpm';
    document.getElementById('speed').innerHTML = 'Velocidad: ' + data.speed + ' km/h';
    document.getElementById('totalDistance').innerHTML = 'Distancia total: ' + data.totalDistance + ' m';
    document.getElementById('steps').innerHTML = 'Número de pasos: ' + data.lapCounter;

    // Actualizar la barra de progreso
    progreso = data.lapCounter;
    actualizarProgreso();


});

// Selecciona la etiqueta progress
var progressBar = document.getElementById("myProgress");

// Define la variable para el progreso
var progreso = 0;

// Actualiza la barra de progreso cada vez que cambia el valor de la variable
function actualizarProgreso() {
  progressBar.value = progreso;

  if (progreso >= 50) {
    reproducirVideo();
  }
}

function reproducirVideo() {
    window.location.href = "https://www.youtube.com/watch?v=DCI1ZuAECQY&autoplay=1&fs=1";
}
