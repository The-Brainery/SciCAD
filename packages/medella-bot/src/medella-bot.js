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
        </p>
        <p>y :
          <input type="number" name="y" min="0" value="0">
          <button onclick=${()=>this.moveTo(moveContainer, "y")}>Move</button>
        </p>
      </div>
    `;
    this.element.appendChild(moveContainer);
  }
  listen() {
    this.bindTriggerMsg('medella-bot-server', 'move', 'move');
    Key("left", this.moveLocal.bind(this, DIRECTIONS.LEFT));
    Key("right", this.moveLocal.bind(this, DIRECTIONS.RIGHT));
    Key("up", this.moveLocal.bind(this, DIRECTIONS.UP));
    Key("down", this.moveLocal.bind(this, DIRECTIONS.DOWN));
  }
  moveLocal(direction) {
    if (document.activeElement != this.element) return;
  }
  moveTo(container, axis){
    let value;
    let x = parseFloat(container.querySelector("[name='x']").value);
    let y = parseFloat(container.querySelector("[name='y']").value);
    if (axis == 'x') value = x;
    if (axis == 'y') value = y;

    this.trigger('move', {axis, value});
  }
}

module.exports = MedellaBot;
