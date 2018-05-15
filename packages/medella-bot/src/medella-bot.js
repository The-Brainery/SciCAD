const yo = require('yo-yo');
const UIPlugin = require('@scicad/ui-plugin');

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
