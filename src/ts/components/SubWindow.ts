// WebComponents
export default class SubWindow extends HTMLElement {
  static style = `
    *,*::before,*::after {
      margin: 0;
      padding: 0;
    }
    :host {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    [data-sub-window="root"] {
      position: absolute;
      top: 0;
      left: 0;
      width: fit-content;
      height: fit-content;
      border: solid 1px #333;
      background-color: #fff;
      padding: 10px 20px;
      z-index: 1;
      pointer-events: initial;
    }
  `;
  root: HTMLElement;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.root = document.createElement('div');
    this.setup();
    this.render();
  }

  private moveStart(e: DragEvent) {
    const { dataTransfer } = e;
    if (dataTransfer === null) return;
    if (this.shadowRoot === null) return;
    console.info('moveStart', e);

    dataTransfer.setData('text/html', this.shadowRoot.innerHTML);
    dataTransfer.dropEffect = 'move';
    dataTransfer.effectAllowed = 'move';
  }

  private moveEnd(e: DragEvent) {
    console.info('moveEnd', e);
  }

  private setup() {
    this.root.addEventListener('dragstart', (e) => this.moveStart(e));
    this.root.addEventListener('dragend', (e) => this.moveEnd(e));
    this.x = 0;
    this.y = 0;
  }

  private set x(px: number) {
    this.root.style.left = `${px}px`;
  }

  get x(): number {
    return parseInt(this.root.style.left.replace('px', ''));
  }

  private set y(px: number) {
    this.root.style.top = `${px}px`;
  }

  get y(): number {
    return parseInt(this.root.style.top.replace('px', ''));
  }

  render() {
    const style = document.createElement('style');
    style.innerHTML = SubWindow.style;
    this.shadowRoot?.appendChild(style);
    const html = `
      <slot />
    `;
    this.root.draggable = true;
    this.root.dataset.subWindow = 'root';
    this.root.innerHTML = html;
    this.shadowRoot?.appendChild(this.root);
  }
}

customElements.define('sub-window', SubWindow);
