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
	};
}