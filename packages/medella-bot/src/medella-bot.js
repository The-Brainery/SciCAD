const Key = require('keyboard-shortcut');
const yo = require('yo-yo');
const UIPlugin = require('@scicad/ui-plugin');
const DIRECTIONS = {LEFT: "left", UP: "up", DOWN: "down", RIGHT: "right"};

class MedellaBot extends UIPlugin {
  constructor(elem, focusTracker, port, ...args) {
    super(elem, focusTracker, port, ...args);

    let moveContainer;
    moveContainer = yo`
      <div>
        <b>Move To: </b>
        <p>x :
          <input type="number" name="x" min="0" value="0">
          <button onclick=${()=>this.moveTo(moveContainer, "x")}>Move</button>
        <p>y :
          <input type="number" name="y" min="0" value="0">
          <button onclick=${()=>this.moveTo(moveContainer, "y")}>Move</button>
        </p>
        <b>Use Keyboard For Relative Controls</b>
      </div>
    `;
    this.element.appendChild(moveContainer);
  }
  listen() {
    this.bindTriggerMsg('medella-bot-server', 'move', 'move');
    this.onStateMsg("electrode-controls", "selected-electrode", this.selectedElectrodeChanged.bind(this));
    Key("left", this.moveLocal.bind(this, DIRECTIONS.LEFT));
    Key("right", this.moveLocal.bind(this, DIRECTIONS.RIGHT));
    Key("up", this.moveLocal.bind(this, DIRECTIONS.UP));
    Key("down", this.moveLocal.bind(this, DIRECTIONS.DOWN));
  }
  selectedElectrodeChanged(...args) {
    console.log("Selected Electrode Changed!");
    console.log(...args);
  }
  moveLocal(dir) {
    if (document.activeElement != this.element) return;
    const {LEFT, RIGHT, UP, DOWN} = DIRECTIONS;
    let value, axis;
    if (dir == LEFT)  {value = +1; axis = 'y'};
    if (dir == RIGHT) {value = -1; axis = 'y'};
    if (dir == UP) {value = +1; axis = 'x'};
    if (dir == DOWN) {value = -1; axis = 'x'};

    const position = 'relative';
    this.trigger('move', {axis, value, position});
  }
  moveTo(container, axis){
    let value;
    let x = parseFloat(container.querySelector("[name='x']").value);
    let y = parseFloat(container.querySelector("[name='y']").value);
    if (axis == 'x') value = x;
    if (axis == 'y') value = y;
    const position = 'absolute';
    this.trigger('move', {axis, value, position});
  }
}

module.exports = MedellaBot;
