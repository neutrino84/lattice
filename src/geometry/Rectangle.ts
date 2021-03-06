export default class Rectangle extends DOMRect {
  constructor(rect: DOMRect = new DOMRect()) {
    super(rect.x, rect.y, rect.width, rect.height)
  }

  extend(rect: Rectangle): void {
		if (rect.x+rect.width > this.x+this.width) {
      this.width = rect.x+rect.width-this.x;
    }
		if (rect.y+rect.height > this.y+this.height) {
      this.height = rect.y+rect.height-this.y;
    }
		if (rect.x < this.x) {
      this.width += this.x-rect.x;
      this.x = rect.x;
    }
		if (rect.y < this.y) {
      this.height += this.y-rect.y;
      this.y = rect.y;
    }
  }

  contains(rect: Rectangle): boolean {
    if (rect.x >= this.x && rect.x+rect.width <= this.x+this.width) {
      if (rect.y >= this.y && rect.y+rect.height <= this.y+this.height) {
        return true
      } else {
        return false
      }
    } else return false
  }

  clone(): Rectangle {
    return new Rectangle(this)
  }

  copy(target: Rectangle) {
    this.x = target.x
    this.y = target.y
    this.width = target.width
    this.height = target.height
  }

  set(x: number, y: number, width: number, height: number): void {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  cloneZeroed(): Rectangle {
    let rect = new Rectangle(this)
        rect.width = 0
        rect.height = 0
    return rect
  }
}