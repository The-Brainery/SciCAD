const os = require('os');
const path = require('path');

const _ = require('lodash');
const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter')
const {MicropedeClient} = require('@micropede/client/src/client.js');
const APPNAME = 'scicad';
const PORT = 1884;
const URL = 'http://localhost:3000';

var base = new SerialPort('COM12', {
  baudRate: 115200
});
const parser = base.pipe(new Delimiter({ delimiter: '\r\n' }));

class MedellaBotServer extends MicropedeClient {
  constructor(...args) {
    args[5] = {storageUrl: URL};
    super(...args);
    this.position = null;
  }
  listen() {
    this.onTriggerMsg('move', this.move.bind(this));
    this.onTriggerMsg('stop', this.stop.bind(this));
    this.onTriggerMsg('zero', this.zero.bind(this));
    this.on("position-changed", async (pos) => {
      let position = await this.getState("position");
      if (!_.isEqual(position, pos)) {
        this.setState("position", pos);
      }
    });
    base.write('X0 Y0 Z0\n');
  }
  stop(payload) {
    base.write('!\n');
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
  zero(payload) {
    console.log("Zeroing!");
  }
}

let bot;
base.on('open', function(){
  let initialized = false;
  parser.on('data', function (data) {
    if (initialized == false) {
      bot = new MedellaBotServer(APPNAME, undefined, PORT);
      setInterval(() => {
        base.write("?\n");
      }, 500);
    }
    const message = data.toString();
    if (_.includes(message, "MPos")) {
      let pos = message.split("MPos:")[1].split("|FS:")[0].split(",");
      bot.trigger("position-changed", _.map(pos, parseFloat));
    } else if (message != "ok"){
      console.log("msg: ", message);
    }
    initialized = true;
  });
});
