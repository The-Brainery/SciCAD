const os = require('os');
const path = require('path');

const _ = require('lodash');
const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter')
const {MicropedeClient} = require('@micropede/client/src/client.js');
const APPNAME = 'scicad';
const PORT = 1884;
const URL = 'http://localhost:3000';

class MedellaPortManager extends MicropedeClient {
  constructor(...args){
    let serialPorts = args.pop();
    args[5] = {storageUrl: URL};
    super(...args);
    this.serialPorts = serialPorts;
  }
  launchBot(serialPort) {
    const base = new SerialPort(serialPort.comName, {
      baudRate: 115200
    });

    const parser = base.pipe(new Delimiter({ delimiter: '\r\n' }));
    let bot;
    base.on('open', function(){
      let initialized = false;
      parser.on('data', function (data) {
        if (initialized == false) {
          bot = new MedellaBotServer(APPNAME, undefined, PORT, base);
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

    return base;
  }
  listen() {
    SerialPort.list().then(serialPorts => {
      this.setState("serial-ports", serialPorts);
    });
    let base, serialPort;
    this.onStateMsg("medella-port-manager", "port", (_serialPort) => {
      serialPort = _serialPort;
      if (base && base.isOpen) {
        console.log("Closing base...");
        base.close(() => {
          base = this.launchBot(serialPort);
        }, () => {
          base = this.launchBot(serialPort);
        });

      } else {
        base = this.launchBot(serialPort);
      }
    });
    this.onTriggerMsg("zero", (payload, ...args) => {
      base.close(() => {
        base = this.launchBot(serialPort);
      }, () => {
        base = this.launchBot(serialPort);
      });
    });
    this.onPutMsg("port", (payload, ...args) => {
      // Initialize MedellaBotServer
      this.setState("port", payload.port);
    });

  }
}
class MedellaBotServer extends MicropedeClient {
  constructor(...args) {
    let base = args.pop();
    args[5] = {storageUrl: URL};
    super(...args);
    this.base = base;
  }
  async listen() {
    this.onTriggerMsg('move', this.move.bind(this));
    this.onTriggerMsg('stop', this.stop.bind(this));
    this.onTriggerMsg('zero', this.zero.bind(this));
    this.on("position-changed", async (pos) => {
      let position = await this.getState("position");
      if (!_.isEqual(position, pos)) {
        this.setState("position", pos);
      }
    });
    this.base.write('X0 Y0 Z0\n');
  }
  stop(payload) {
    this.base.write('!\n');
  }
  move(payload){
    let {axis, value, position} = payload;
    let G;
    if (position == 'relative') G = 91;
    if (position == 'absolute') G = 90;
    // F180 = Set Feedrate (to 180)
    if (axis == 'x') {
      this.base.write(`$J=G${G} X${value} F180\n`);
    } else if (axis == 'y') {
      this.base.write(`$J=G${G} Y${value} Z${value} F180\n`);
    }
  }
  zero(payload) {
    this.base.write('0x18\n');
    console.log("Zeroing!");
  }
}

SerialPort.list().then(serialPorts => {
  let bot = new MedellaPortManager(APPNAME, undefined, PORT, serialPorts);
});
