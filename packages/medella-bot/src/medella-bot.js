const yo = require('yo-yo');
const UIPlugin = require('@scicad/ui-plugin');

class MedellaBot extends UIPlugin {
  constructor(elem, focusTracker, port, ...args) {
    super(elem, focusTracker, port, ...args);
    this.element.appendChild(yo`
      <b>Hello World!</b>
    `);
  }
}

module.exports = MedellaBot;
