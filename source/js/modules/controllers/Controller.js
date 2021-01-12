import { SVGCanvas } from "../models/SVGCanvas";

export class Controller {
    constructor() {
        this.canvas = new SVGCanvas(document.querySelector('.sheet'));
        this.fill = 'none';
        this.stroke = 'black';
        this.activToolsLeftBtn = 'select';
        this.select = null;
        this.mouse = null;
    }

    init() {
        this.getActivToolsLeftBtn();
        this.canvas.init();
    }
  
    getActivToolsLeftBtn() {
        const toolsLeft = document.querySelector('.toolsLeft_container');
        toolsLeft.addEventListener('click', (event) => {
            let target = event.target;
            while (target !== toolsLeft) {
                if (target.nodeName === 'BUTTON') {
                    this.activToolsLeftBtn = target.id;   // Хочу получить это значение в класс SVGCanvas
                    console.log(this.activToolsLeftBtn);
                    this.canvas.removeLastEvent();
                    this.canvas.drawElem(target.id);
                    return;
                }
                target = target.parentNode;
            }
        })
    }
}