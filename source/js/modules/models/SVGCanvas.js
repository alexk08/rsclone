import { SVG, extend as SVGextend, Element as SVGElement } from '../../vendor/svg.js';

export class SVGCanvas {
    constructor(app, rootElement, svgWidth, svgHeight) {
        this.rootElement = rootElement;
        //this.type = 'circle';
        this.svgWidth = svgWidth;
        this.svgHeight = svgHeight;
        this.canvas = SVG().addTo(this.rootElement).size(this.svgWidth, this.svgHeight);
        this.app = app;
    }

    init() {
      //this.drawElem(this.type);
    }

    drawElem(type) {
        const canvas = this.canvas;
        let mouse = {
            getX: function(e) {
              return e.offsetX;
            },
            getY: function(e) {
              return e.offsetY;
            }
        };

        let isDraw = false;
        let x, y, line, circle, rect;
        console.log(this.app);
        const viewApp = this.app;
        this.canvas.mousedown(function(e) {
            isDraw = true;
            x = mouse.getX(e);
            y = mouse.getY(e);
            switch(type) {
                case 'line':
                    line = canvas.line(x, y, x, y).stroke('black');
                break;
                case 'circle':
                    circle = canvas.circle(0).move(x, y).stroke('black').fill('none');
                break;
                case 'rect':
                    rect = canvas.rect(0, 0).move(x, y).stroke('black').fill('none');
                break;
                case 'select':
                    const arrayObjectsSVG = canvas.children().filter((item) => item.inside(e.offsetX, e.offsetY));
                    if (arrayObjectsSVG.length === 1) {
                      viewApp.functionalAreaContainer.classList.remove('visibility');
                      viewApp.updateFunctionalArea(...arrayObjectsSVG);
                    } else {
                      viewApp.functionalAreaContainer.classList.add('visibility');
                    }
                break;
            }
        })

        this.canvas.mousemove(function(e) {
            if (isDraw) {
                switch(type) {
                    case 'line':
                        line.attr({
                            x2: mouse.getX(e),
                            y2: mouse.getY(e)
                        });
                    break;
                    case 'circle':
                        circle.attr({
                            r: Math.sqrt(((mouse.getX(e) - x) ** 2) + (mouse.getY(e) - y) ** 2),
                        });
                    break;
                    case 'rect':
                        let xNew, yNew;
                        if (mouse.getX(e) < x) {
                          xNew = mouse.getX(e);
                        } else if (mouse.getX(e) >= x) {
                          xNew = x;
                        }
                        if (mouse.getY(e) < y) {
                          yNew = mouse.getY(e);
                        } else if (mouse.getY(e) >= y) {
                          yNew = y;
                        }
                        rect.attr({
                            width: Math.abs(mouse.getX(e) - x),
                            height: Math.abs(mouse.getY(e) - y),
                            x: xNew,
                            y: yNew,
                            id: 'test',
                        });
                    break;
                }
            }
        })

        this.canvas.mouseup(function(e) {
            isDraw = false;
        })
    }

    removeLastEvent() {
        this.canvas.mousedown(null);
        this.canvas.mousemove(null);
    }

    fillElem(color) {
        const canvas = this.canvas;
        this.canvas.mousedown(function(e) {
            canvas.children().filter((item) => item.inside(e.offsetX, e.offsetY)).fill(color);
        })
    }
}
