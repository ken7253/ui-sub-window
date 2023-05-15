type Option = {
  initX: number;
  initY: number;
  stack: boolean;
};

/**
 * @TODO ドラッグ可能な領域を限定して内部のテキストが選択できるように
 * @TODO ALTを押しながらドラッグすることで近くのサブウインドウにスナップできるように
 * @TODO 要素の開閉ボタンを追加
 * @TODO 要素の削除ボタンを追加
 * @TODO 要素のサイズを可変にできるオプションの追加
 */
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
      stack: true,
      ...option,
    };
    this.x = this.option.initX;
    this.y = this.option.initY;
    this.startX = 0;
    this.startY = 0;

    SubWindow.windowList.push({ root: this.root, id: this.id });
    this.setup();
  }

  setup() {
    const { root } = this;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'false');
    root.draggable = true;
    root.addEventListener('dragstart', (e) => this.moveStart(e));
    root.addEventListener('dragend', (e) => this.moveEnd(e));
    root.style.zIndex = SubWindow.windowList
      .findIndex((v) => v.id === this.id)
      .toString();

    if (this.option.stack) {
      const stackIndex =
        SubWindow.windowList.findIndex((v) => v.id === this.id) + 1;
      this.x = this.option.initX * stackIndex;
      this.y = this.option.initY * stackIndex;
    }
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

    this.toTopLayer();
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

  private toTopLayer() {
    const index = SubWindow.windowList.findIndex((v) => v.id === this.id);
    console.log(SubWindow.windowList);
    SubWindow.windowList.splice(index, 1);
    SubWindow.windowList.push({ root: this.root, id: this.id });
    console.log(SubWindow.windowList);
    SubWindow.setIndex();
  }

  private static setIndex() {
    SubWindow.windowList.forEach((item, index) => {
      item.root.style.zIndex = index.toString();
    });
  }
}
