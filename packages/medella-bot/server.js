const os = require('os');
const path = require('path');

const SerialPort = require('serialport');

const {MicropedeClient} = require('@micropede/client/src/client.js');
const APPNAME = 'scicad';
const PORT = 1884;

var base = new SerialPort('COM12', {
  baudRate: 115200
});

class MedellaBotServer extends MicropedeClient {
  constructor(...args) {
    super(...args);
  }
  listen() {
    this.onTriggerMsg('move', this.move.bind(this));
    base.write('X0 Y0 Z0\n');
  }
  move(payload){
    let {axis, value, position} = payload;
    let G;
    if (position == 'relative') G = 91;
    if (position == 'absolute') G = 90;
    // F180 = Set Feedrate (to 180)
    if (axis == 'x') {
      base.write(`$J=G${G} X${value} F180\n`);
    } else if (axis == 'y') {
      base.write(`$J=G${G} Y${value} Z${value} F180\n`);
    }
  }
}

base.on('open', function(){
  let initialized = false;
  console.log('Serial Port Opened');
  base.on('data', function (data) {
    if (initialized == false) {
      const bot = new MedellaBotServer(APPNAME, undefined, PORT);
    }
    const message = data.toString().replace('\r\n', '');
    console.log({message});
    initialized = true;
  });
});
