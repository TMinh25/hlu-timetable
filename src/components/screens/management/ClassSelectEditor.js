export default class ClassSelectEditor {
  init(params) {
    this.eGui = document.createElement("span");
    this.eGui.innerHTML = params.value;
  }

  getGui() {
    return this.eGui;
  }
}
