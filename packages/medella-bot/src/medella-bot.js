const yo = require('yo-yo');
const UIPlugin = require('@scicad/ui-plugin');

class MedellaBot extends UIPlugin {
  constructor(elem, focusTracker, port, ...args) {
    super(elem, focusTracker, port, ...args);

    let moveContainer;
    moveContainer = yo`
      <div>
        <b>Move To: </b>
        <p>x : <input type="number" name="x" min="0" value="0"></p>
        <p>y : <input type="number" name="y" min="0" value="0"></p>
        <button type="submit" onclick=${()=>this.moveTo(moveContainer)}>
          Move
        </button>
      </div>
    `;
    this.element.appendChild(moveContainer);
  }

  moveTo(container){
    let x = parseFloat(container.querySelector("[name='x']").value);
    let y = parseFloat(container.querySelector("[name='y']").value);
    // TODO: Update yac to support node plugins
  }
}

module.exports = MedellaBot;
