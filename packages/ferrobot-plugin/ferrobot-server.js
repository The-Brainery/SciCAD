const {MicropedeClient} = require('@micropede/client/src/client.js');

const backbone = require('backbone');
const five = require("johnny-five");
const _ = require('lodash');

const board = new five.Board();

const OUTPUT = 1;

const ROWS = [2, 3, 4, 5, 6, 7];
const COLS = [8, 9, 10, 11, 12, 13];
const ROW = 0;
const COL = 1;

const APPNAME = 'scicad';
const PORT = 1884;

class FerroBotDriver extends MicropedeClient {
  constructor(appName=APPNAME, ...args){
    super(appName, undefined, PORT, ...args);
    _.extend(this, backbone.Events);
    this.prevRow = null;
    this.prevCol = null;
    this.prevElectrodes = [];
  }
  listen() {
    this.onStateMsg('electrodes-model', 'active-electrodes', (payload, params) => {
      this.turnOn(payload);
      console.log({payload, params});
    });
  }

  async pulseActiveElectrodes(electrodeIds) {
    let interval;
    await new Promise((res, rej) => {

      this.on("stop", () => {
        console.log("Clearing interval!!");
        if (interval) clearInterval(interval);
        res();
      });

      let k = 0;
      interval = setInterval(() => {

        _.each(_.range(0,6), (row) => {
          _.each(_.range(0,6), (col) => {
            board.digitalWrite(ROWS[row], 0);
            board.digitalWrite(COLS[col], 0);
          });
        });

        if (k >= electrodeIds.length) k = 0;
        const electrodeId = electrodeIds[k];
        const row = parseInt(electrodeId.split("electrode")[1][ROW]);
        const col = parseInt(electrodeId.split("electrode")[1][COL]);
        console.log({row, col});
        board.digitalWrite(ROWS[row], 1);
        board.digitalWrite(COLS[col], 1);
        k++;
      }, 40);

    });
  }

  async turnOn(electrodeIds) {

    this.trigger("stop");

    // Turn off all electrodes
    _.each(_.range(0,6), (row) => {
      _.each(_.range(0,6), (col) => {
        board.digitalWrite(ROWS[row], 0);
        board.digitalWrite(COLS[col], 0);
      });
    });

    if (electrodeIds.length > 0)
      // this.pulseActiveElectrodes(electrodeIds);

    _.each(electrodeIds, (electrodeId) => {
      const row = parseInt(electrodeId.split("electrode")[1][ROW]);
      const col = parseInt(electrodeId.split("electrode")[1][COL]);
      board.digitalWrite(ROWS[row], 1);
      board.digitalWrite(COLS[col], 1);
    });

  }

}

board.on("ready", function () {
  new FerroBotDriver();
});
