type Option = {
  initX: number;
  initY: number;
};

export class SubWindow {
  static windowList: {
    root: HTMLElement;
    id: string;
  }[] = [];
  readonly root: HTMLElement;
  readonly id: string;
  readonly option: Option;
  startX: number;
  startY: number;

  constructor(root: HTMLElement, option?: Partial<Option>) {
    this.root = root;
    this.id = crypto.randomUUID();
    this.option = {
      initX: 50,
      initY: 100,
      ...option,
    };
    this.x = this.option.initX;
    this.y = this.option.initY;
    this.startX = 0;
    this.startY = 0;

    this.setup();
  }

  setup() {
    const { root, id } = this;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'false');
    root.draggable = true;
    root.addEventListener('dragstart', (e) => this.moveStart(e));
    root.addEventListener('dragend', (e) => this.moveEnd(e));

    SubWindow.windowList.push({ root, id });
  }

  moveStart(e: DragEvent) {
    const { dataTransfer, screenX, screenY } = e;
    if (dataTransfer === null) return;
    dataTransfer.setData('text/html', this.root.innerHTML);
    dataTransfer.dropEffect = 'move';
    dataTransfer.effectAllowed = 'move';

    this.startX = screenX;
    this.startY = screenY;
  }

  moveEnd(e: DragEvent) {
    const { screenX, screenY } = e;
    const moveX = screenX - this.startX;
    const moveY = screenY - this.startY;
    this.x += moveX;
    this.y += moveY;
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
}