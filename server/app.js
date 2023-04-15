const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

//Serial Communication
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

server.listen(process.env.PORT ||3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});

let path;
if (process.platform === 'win32') {
  path = 'COM6';
} else if (process.platform === 'linux') {
  path = '/dev/ttyUSB0';
} else if (process.platform === 'darwin') {
  path = '/dev/tty.usbserial';
}


const port = new SerialPort({path: path, baudRate: 9600 }, (err) => {
  if (err) {
    return console.error('Error: ', err.message)
  }
  console.log('Conexión con el puerto serie establecida');
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('open', () => {
    console.log('Puerto serie abierto');
});

parser.on('data', (message) => {
  console.log('Mensaje recibido desde el puerto serie:', message);
  if (message === 'Vuelta completada') {
    // Se ha completado una vuelta, realizar los cálculos
    const lapDistance = 1.5; // Distancia recorrida en cada vuelta (en metros)
    const lapTime = new Date() - lastLapTime; // Calcular el tiempo transcurrido desde la última vuelta
    const rpm = 60000.0 / lapTime; // Calcular las RPM
    const speed = (lapDistance / 1000) / (lapTime / 1000.0 / 3600.0); // Calcular la velocidad en km/h
    totalDistance += lapDistance; // Actualizar la distancia total recorrida

    lapCounter = lapCounter + 1;
    // Actualizar el tiempo de la última vuelta
    lastLapTime = new Date();

    // Enviar los datos al cliente
    io.emit('lap', { rpm, speed, totalDistance, lapCounter });
  }
});

let lapCounter = 0; // Almacenar el número de vueltas
let lastLapTime = new Date(); // Almacenar el tiempo de la última vuelta
let totalDistance = 0; // Almacenar la distancia total recorrida


parser.on('error', (err) => {
    console.error('Error:', err);
    });
