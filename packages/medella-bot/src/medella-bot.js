const Key = require('keyboard-shortcut');
const yo = require('yo-yo');
const UIPlugin = require('@scicad/ui-plugin');
const DIRECTIONS = {LEFT: "left", UP: "up", DOWN: "down", RIGHT: "right"};

class MedellaBot extends UIPlugin {
  constructor(elem, focusTracker, port, ...args) {
    super(elem, focusTracker, port, ...args);

    this.toggleBox = yo`
      <input type="checkbox" onchange=${this.toggleTabDisable.bind(this)}>
    `;

    this.positionInfo = yo`<b></b>`;
    this.selectedElectrodeInfo = yo`<b></b>`;
    this.serialPortsInfo = yo`<div></div>`;

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
        <div>
          <label>Disable Tab Change?</label>
          ${this.toggleBox}
        </div>
        <button onclick=${()=>this.trigger("stop")}>Stop</button>
        <p>Position: ${this.positionInfo}</p>
        <p>Selected Electrode: ${this.selectedElectrodeInfo}</p>
        <button onclick=${this.setZero.bind(this)}>Set Zero</button>
        <p>
          ${this.serialPortsInfo}
          <button onclick=${this.changePort.bind(this)}> Update Port</button>
        </p>
      </div>
    `;
    this.element.appendChild(moveContainer);
  }
  listen() {
    this.bindPutMsg('medella-port-manager', 'port', 'put-port');
    this.bindTriggerMsg('medella-bot-server', 'stop', 'stop');
    this.bindTriggerMsg('medella-bot-server', 'move', 'move');
    this.bindTriggerMsg('medella-bot-server', 'zero', 'zero');
    this.bindTriggerMsg('global-ui-plugin', 'disable-tab-activation', 'disable-tab-activation');
    this.bindTriggerMsg('global-ui-plugin', 'enable-tab-activation', 'enable-tab-activation');
    this.onStateMsg("electrode-controls", "selected-electrode", this.selectedElectrodeChanged.bind(this));
    this.onStateMsg("global-ui-plugin", "tab-activation-enabled", (val) => {
      this.toggleBox.checked = !val;
    });
    this.onStateMsg("medella-bot-server", 'position', (pos) => {
      this.positionInfo.innerHTML = pos;
    });
    this.onStateMsg('medella-port-manager', 'serial-ports', (ports) => {
      // Create a DropDown list with available serail ports:
      this.serialPortsInfo.innerHTML = '';

      let select = yo`
        <select name="serial-ports">
          ${_.map(ports, (port)=> {
            let option = yo` <option value="${port.comName}">
                ${port.comName} | ${port.manufacturer}
            </option>`;
            option.port = port;
            return option;
          })}
        </select>
      `;
      this.serialPortsInfo.appendChild(select);
    });
    Key("left", this.moveLocal.bind(this, DIRECTIONS.LEFT));
    Key("right", this.moveLocal.bind(this, DIRECTIONS.RIGHT));
    Key("up", this.moveLocal.bind(this, DIRECTIONS.UP));
    Key("down", this.moveLocal.bind(this, DIRECTIONS.DOWN));
  }
  changePort(...args) {
    let select = this.serialPortsInfo.children[0];
    let port = _.get(select, 'selectedOptions[0].port');
    this.trigger('put-port', {port});
  }
  toggleTabDisable(e) {
    if (e.target.checked == true) this.trigger("disable-tab-activation");
    if (e.target.checked == false) this.trigger("enable-tab-activation");
  }
  selectedElectrodeChanged(electrode) {
    this.selectedElectrodeInfo.innerHTML = electrode.id;
  }
  setZero() {
    console.log("Setting Zero!");
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
