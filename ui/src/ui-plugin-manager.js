class UIPluginManager extends UIPlugin {
  constructor(element, focusTracker) {
    super(element, focusTracker, "UIPluginManager");
    Object.assign(this, CardMixins);
    this.pluginCards = new Backbone.Model();
    this.listen();
  }
  listen() {
    this.pluginCards.on("all", this.onPluginCardsChanged.bind(this));
    this.bindTriggerMsg("web-server", "remove-plugin", "remove-plugin");
    this.bindTriggerMsg("web-server", "update-ui-plugin-state", "update-state");
    this.on("state-btn-clicked", this.onStateBtnClicked.bind(this));

    this.addGetRoute("microdrop/state/web-plugins", this.onWebPluginsChanged.bind(this));
    this.addGetRoute("microdrop/state/error/web-plugins", this.onChangeWebPluginsFailed.bind(this));
    this.addPostRoute("/add-web-plugin", "add-web-plugin");
  }
  get list(){return this._list}
  set list(item) {this.changeElement("list", item)}
  get controls(){return this._controls}
  set controls(item) {this.changeElement("controls", item)}

  onChangeWebPluginsFailed(payload) {
    console.error(`Failed to add webplugin:  ${payload}`);
  }
  onPluginCardsChanged(msg) {
    this.list = this.List(this.pluginCards);
  }
  onStateBtnClicked(plugin) {
    let newState = "";
    if (plugin.state == "enabled") plugin.state = "disabled";
    else plugin.state = "enabled";

    this.trigger("update-state", this.wrapData(null, plugin));
  }
  onWebPluginsChanged(payload) {
    const webPlugins = JSON.parse(payload);

    this.pluginCards.clear();
    for (const [filepath, plugin] of Object.entries(webPlugins)){
      this.pluginCards.set(filepath, plugin);
    }
  }
  ListItem(filepath, plugin) {
    const row = $(`<div class="row"></div>`);
    const col1 = $(`<div class="col-md-3"></div>`).appendTo(row);
    const col2 = $(`<div class="col-md-6"></div>`).appendTo(row);
    const col3 = $(`<div class="col-md-1"></div>`).appendTo(row);
    const col4 = $(`<div class="col-md-1"></div>`).appendTo(row);

    col1.append(`<label class="mr-2">${plugin.name}</label>`);

    // Input Field:
    col2.append(`
      <input type="text" class="form-control form-control-sm mt-1"
        value="${filepath}">
    `);

    let cls, txt = "";
    if (plugin.state == "disabled") {cls="btn-success"; txt="Enable"}
    if (plugin.state == "enabled") {cls="btn-danger"; txt="Disable"}

    const stateBtn = $(
      `<button type="submit" class="btn ${cls} btn-sm mt-1">
        ${txt}
      </button>
    `).appendTo(col3);
    stateBtn.on("click", () => {this.trigger("state-btn-clicked",plugin)})

    return row[0];
  }
  List(pluginCards) {
    const entries = Object.entries(pluginCards.attributes);
    const cards = $(`<div class="container"></div>`)[0];
    for (const [filepath, plugin] of entries)
      cards.appendChild(this.ListItem(filepath, plugin));
    return cards;
  }
}