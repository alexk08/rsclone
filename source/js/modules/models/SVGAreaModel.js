import { } from '../../vendor/svg.js';
import { } from '../../vendor/svg.select.js';
import { } from '../../vendor/svg.resize.js';

export class Model {
  constructor(app, rootElement) {
    this.rootElement = rootElement;
    this.svgArea = null;
    this.type = 'select';
    this.app = app;
    this.selectElements = [];
    this.setSelectElements = new Set();

    this.fillColor = 'transparent';
    this.strokeColor = 'rgba(0, 0, 0, 1)';

    this.rect = null;
    this.ellipse = null;
    this.line = null;
    this.text = null;

    this.cxLast = null;
    this.cyLast = null;
    this.x = null;
    this.y = null;

    this.onSVGAreaMouseDown = {
      select: (e) => this.selectElem(e),
      rect: (e) => this.createRect(e),
      ellipse: (e) => this.createEllipse(e),
      line: (e) => this.createLine(e),
      text: (e) => this.createText(e),
      polyline: (e) => this.createPolyline(e),
      path: (e) => this.createPath(e),
      fill: (e) => this.changeFillColor(e),
      stroke: (e) => this.changeStrokeColor(e),
    };

    this.onSVGAreaMouseMove = {
      select: (e) => this.moveElem(e),
      rect: (e) => this.drawRect(e),
      ellipse: (e) => this.drawEllipse(e),
      line: (e) => this.drawLine(e),
      text: (e) => this.drawText(e),
      polyline: (e) => this.drawPolyline(e),
      path: (e) => this.drawPath(e),
      //fill : (e) => this.colorElem(e),
    };

    this.history = [];
    this.historyPosition = -1;
    this.unDo = this.unDo.bind(this);
    this.reDo = this.reDo.bind(this);
  }

  init() {
    this.createSvgWorkArea('600', '400');
  }

  createSvgWorkArea(svgWidth, svgHeight) {
    this.svgArea = SVG(this.rootElement).size(svgWidth, svgHeight);
    this.svgArea.node.classList.add('svg-work-area');
  }

  selectElem(e) {
    const _that = this;
    this.svgArea.each(function (i, children) {
      if (this.inside(e.offsetX, e.offsetY) && this.node.tagName !== 'g') {
        _that.setSelectElements.add(this);
        _that.selectElements = [..._that.setSelectElements];
        this.addClass('selectedElem');
        this.selectize().resize();
        _that.onMouseMoveG();
        _that.cxLast = this.cx();
        _that.cyLast = this.cy();
      }
    });
    _that.app.removeVisibilityPanel(_that.selectElements);
    _that.app.updateFunctionalArea(_that.selectElements);
  }

  createRect(e) {
    this.rect = this.svgArea.rect(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createEllipse(e) {
    this.ellipse = this.svgArea.ellipse(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
    //console.log(this.ellipse);
  }

  createLine(e) {
    this.line = this.svgArea.line(e.offsetX, e.offsetY, e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createText(e) {
    this.text = this.svgArea.text('input text').move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
    this.text.addClass('inputText');
    this.text.font({
      family: 'Helvetica',
      size: 16,
      anchor: 'left',
      leading: '0em',
    });
    let textInput = '';
    document.addEventListener('keydown', (event) => {
      if (this.text.hasClass('inputText') && event.key.length < 2) {
        textInput += event.key;
        this.text.plain(`${textInput}`);
      }
    });
  }

  changeFillColor(e) {
    const _that = this;
    this.svgArea.each(function () {
      if (this.inside(e.offsetX, e.offsetY)) {
        this.fill(_that.fillColor);
        _that.saveHistory();
      }
    });
  }

  changeStrokeColor(e) {
    const _that = this;
    this.svgArea.each(function () {
      if (this.inside(e.offsetX, e.offsetY)) {
        this.stroke(_that.strokeColor);
        _that.saveHistory();
      }
    });
  }

  moveElem(e) {
    const _that = this;
    if (!e.ctrlKey && _that.selectElements.length === 1) {
      _that.svgArea.each(function (i, children) {
        if (this.hasClass('selectedElem')) {
          this.cx(e.offsetX - _that.x + _that.cxLast);
          this.cy(e.offsetY - _that.y + _that.cyLast);
          _that.app.updateFunctionalArea(_that.selectElements);
          // _that.saveHistory();
        }
      });
    }
  }

  drawRect(e) {
    let xNew, yNew, xDelta, yDelta;
    xDelta = Math.abs(e.offsetX - this.x);
    yDelta = Math.abs(e.offsetY - this.y);
    if (e.shiftKey) {
      if (e.offsetX < this.x) {
        xNew = this.x - Math.max(xDelta, yDelta);
      } else if (e.offsetX >= this.x) {
        xNew = this.x;
      }
      if (e.offsetY < this.y) {
        yNew = this.y - Math.max(xDelta, yDelta);
      } else if (e.offsetY >= this.y) {
        yNew = this.y;
      }
      this.rect.attr({
        width: Math.max(Math.abs(e.offsetX - this.x), Math.abs(e.offsetY - this.y)),
        height: Math.max(Math.abs(e.offsetX - this.x), Math.abs(e.offsetY - this.y)),
        x: xNew,
        y: yNew,
      });
    } else {
      xNew = Math.min(e.offsetX, this.x);
      yNew = Math.min(e.offsetY, this.y);
      this.rect.attr({
        width: Math.abs(e.offsetX - this.x),
        height: Math.abs(e.offsetY - this.y),
        x: xNew,
        y: yNew,
      });
    }
  }

  drawEllipse(e) {
    if (e.shiftKey) {
      this.ellipse.attr({
        rx: Math.sqrt(((e.offsetX - this.x) ** 2) + (e.offsetY - this.y) ** 2),
        ry: Math.sqrt(((e.offsetX - this.x) ** 2) + (e.offsetY - this.y) ** 2),
      });
    } else {
      this.ellipse.attr({
        rx: Math.abs(e.offsetX - this.x),
        ry: Math.abs(e.offsetY - this.y),
      });
    }
  }

  drawLine(e) {

    if (e.shiftKey) {
      let xDelta = Math.abs(e.offsetX - this.x);
      let yDelta = Math.abs(e.offsetY - this.y);
      let xSign = (e.offsetX - this.x) / Math.abs(e.offsetX - this.x);
      let ySign = (e.offsetY - this.y) / Math.abs(e.offsetY - this.y);
      let xEnd, yEnd;
      if (Math.min(xDelta, yDelta) / Math.max(xDelta, yDelta) > 0.5) {
        xEnd = this.x + xSign * Math.max(xDelta, yDelta);
        yEnd = this.y + ySign * Math.max(xDelta, yDelta);
      } else {
        if (xDelta < yDelta) {
          xEnd = this.x;
          yEnd = e.offsetY
        } else {
          xEnd = e.offsetX;
          yEnd = this.y;
        }
      }
      this.line.attr({
        x2: xEnd,
        y2: yEnd,
      })
    } else {
      this.line.attr({
        x2: e.offsetX,
        y2: e.offsetY,
      });
    }
  }

  drawText(e) {
    this.text.font({
      family: 'Helvetica',
      size: Math.abs(e.offsetY - this.y),
    });
  }

  onSVGAreaEvent() {
    const _that = this;
    let isDraw = false;
    this.svgArea.mousedown((e) => {
      if (!e.ctrlKey) {
        this.removeSelect();
        this.app.removeVisibilityPanel(this.selectElements);
        this.svgArea.each(function (i, children) {
          if (this.hasClass('inputText') && !this.inside(e.offsetX, e.offsetY)) {
            this.removeClass('inputText');
          }
        });
      }
      isDraw = true;
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.onSVGAreaMouseDown[this.type](e);
    });
    this.svgArea.mousemove((e) => {
      if (isDraw) {
        this.onSVGAreaMouseMove[this.type](e);
      }
    });
    this.svgArea.mouseup(function (e) {
      isDraw = false;
      _that.saveHistory();
    });
  }

  removeLastEvent() {
    this.svgArea.mousedown(null);
    this.svgArea.mousemove(null);
    this.svgArea.mouseup(null);
  }

  removeSelect() {
    this.svgArea.each(function (i, children) {
      if (this.hasClass('selectedElem')) {
        this.removeClass('selectedElem');
        this.resize('stop').selectize(false);
      }
    })
    this.setSelectElements.clear();
    this.selectElements = [...this.setSelectElements];
  }

  onMouseMoveG() {
    const arrayG = [...[...this.app.sheet.childNodes][0].childNodes].filter((value) => value.tagName === 'g');
    const arrayElementG = [...arrayG[0].childNodes];
    arrayElementG.shift();
    for (let i = 0; i < arrayElementG.length; i += 1) {
      arrayElementG[i].addEventListener('mousemove', () => {
        if (this.selectElements.length === 1) {
          this.app.updateFunctionalArea(this.selectElements);
        }
      });
    }
  }

  saveHistory() {
    const svgInnerWithoutSelect = this.getSvgInnerWithoutSelect();
    this.history = this.history.slice(0, this.historyPosition + 1);
    this.history.push(svgInnerWithoutSelect);
    this.incrementPosition();
  }

  getSvgInnerWithoutSelect() {
    const svgWorkAreaNode = this.rootElement.childNodes[0];
    const tempDivElement = document.createElement('div');
    tempDivElement.innerHTML = svgWorkAreaNode.innerHTML;

    [...tempDivElement.childNodes].forEach(item => {
      if (item.tagName.toLowerCase() === 'g') item.remove();
      if (item.classList.contains('selectedElem')) item.classList.remove('selectedElem');
    })

    const svgInnerWithoutSelect = tempDivElement.innerHTML;
    tempDivElement.remove();

    return svgInnerWithoutSelect;
  }

  incrementPosition() {
    this.historyPosition += 1;
  }

  decrementPosition() {
    this.historyPosition -= 1;
  }

  unDo() {
    if (this.historyPosition < 0) return;
    this.decrementPosition();
    this.rootElement.innerHTML = '';
    this.init();
    this.svgArea.svg(this.history[this.historyPosition]);
  }

  reDo() {
    if (this.historyPosition > this.history.length - 2) return;
    this.incrementPosition();
    this.rootElement.innerHTML = '';
    this.init();
    this.svgArea.svg(this.history[this.historyPosition]);
  }
}
