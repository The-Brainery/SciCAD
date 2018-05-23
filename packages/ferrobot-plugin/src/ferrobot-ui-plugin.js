const UIPlugin = require('@scicad/ui-plugin');
const yo = require("yo-yo");

class FerrobotUIPlugin extends UIPlugin {
  constructor(elem, focusTracker, port, ...args) {
    super(elem, focusTracker, port, ...args);
    this.element.innerHTML = "";
    this.element.appendChild(yo`
      <b> Control from Process Plugin Manager</b>
    `);
  }
}

module.exports = FerrobotUIPlugin;
