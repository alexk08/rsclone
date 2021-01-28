import {createElement} from '../../utils/createELement';
import {ColorPicker} from './ColorPicker';
import {toolsBottomBtnName, CONTEXTMENU_NAMES_EN, TOOLS_LEFT_NAMES_EN, FUNCTIONAL_AREA_ICONS, ALIGNMENT_ICONS} from '../../utils/btn-names';
import {MainMenu} from './MainMenu';
import {NewImageModal} from './NewImageModal';
import { SettingsModal } from './SettingsModal';
import { SvgCodeModal } from './SvgCodeModal';
import { SaveModal } from './SaveModal';
import { MainViewModel } from '../models/MainViewModel';

// const toolsBottomBtnName = ['red', 'green', 'blue'];
// const MENU_BUTTONS_NAMES_EN = ['New Image', 'Save SVG', 'Import SVG', 'Document Properties', 'Get SVG-code', 'Undo', 'Redo'];
// const CONTEXTMENU_NAMES_EN = ['Delete', 'Bring to Front', 'Send to Back'];
// const TOOLS_LEFT_NAMES_EN = ['select', 'rect', 'ellipse', 'line', 'text', 'polyline', 'path', 'color'];
// const MENU_BUTTONS_NAMES_RUS = ['Создать', 'Сохранить', 'Импортировать', 'Свойства документа', 'Получить код', 'Назад', 'Вперед'];
// const CONTEXTMENU_NAMES_RUS = ['Удалить', 'На передний план', 'На задний план'];
// const TOOLS_LEFT_NAMES_RUS = ['Выбрать элемент', 'Прямоугольник', 'Эллипс', 'Линия', 'Текст', 'Ломаная линия', 'Путь', 'Цвет'];

export class AppView {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.headerElement = null;
    this.headerContainer = null;
    this.footerElement = null;
    this.footerContainer = null;
    this.contentElement = null;
    this.contentContainer = null;

    this.toolsTopContainer = null;
    this.toolsBottomContainer = null;
    this.toolsLeftContainer = null;
    this.workAreaContainer = null;
    this.functionalAreaContainer = null;
    this.switcherContainer = null;
    this.sheet1 = null;
    this.sheet2 = null;
    this.sheets = [];
    this.sheetsNumber = 0;
    this.contextMenuWindow = null;

    this.menuButtonsDataAttribute = 'menu';
    this.saveElementsDataAttribute = 'modalSave';
    this.settingsElementsDataAttribute = 'modalSettings';
    this.propertiesDataAttribute = 'property';
    this.alignPanelDataAttribute = 'align';
    this.newImageDataAttribute = 'newImage';
    this.tabsDataAttribute = 'tab';

    this.menuContainer = null;
    this.newImageModal = null;
    this.settingsModal = null;
    this.svgCodeModal = null;
    this.saveModalInstance = null;
    this.saveModal = null;
    this.inputFileName = null;
    this.errorMessage = null;

    this.countFamily = 5;
    // this.countAnchor = 3;

    this.colorPicker = null;

    this.rectContainerPanel = null;
    this.lineContainerPanel = null;
    this.ellipseContainerPanel = null;
    this.textContainerPanel = null;
    this.pencilContainerPanel = null;
    this.alignContainerPanel = null;
    this.selectProperty = null;
  }

  init() {
    this.menuContainer = new MainMenu(this.menuButtonsDataAttribute).createMenuContainer();
    this.newImageModal = new NewImageModal(this.newImageDataAttribute).createNewImageModal();
    this.settingsModal = new SettingsModal(this.settingsElementsDataAttribute).createSettingsModal();
    this.svgCodeModal = new SvgCodeModal().createSvgCodeModal();
    this.saveModalInstance = new SaveModal(this.saveElementsDataAttribute);
    this.saveModal = this.saveModalInstance.createSaveModal();
    this.inputFileName = this.saveModalInstance.createInputFileName();
    this.errorMessage = this.saveModalInstance.createErrorMessage();

    const wrapper = this.createWrapper();
    this.renderHeader();
    this.renderContent();
    this.renderFooter();
    this.rootElement.appendChild(wrapper);
    wrapper.append(this.headerElement, this.contentElement, this.footerElement);

    this.colorPicker = new ColorPicker(this.workAreaContainer);
    this.colorPicker.init();

    new MainViewModel(this).init(this.sheetsNumber);
  }

  getCurrentRotation(item) {
    const transform = item.attr().transform;
    if (typeof transform !== 'undefined') {
      const values = transform.split('(')[1].split(')')[0].split(',');
      const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
      return (angle < 0 ? angle + 360 : angle);
    }
    return 0;
  }

  createContextMenuModal() {
    const contextMenuModal = document.createElement('div');
    contextMenuModal.classList.add('modal-contextmenu', 'visibility-modal');

    CONTEXTMENU_NAMES_EN.forEach((item) => {
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.dataset[this.propertiesDataAttribute] = item;
      button.classList.add(`modal-contextmenu__btn-${item.toLowerCase().split(' ').join('-')}`);
      button.textContent = item;
      contextMenuModal.append(button);
    });

    return contextMenuModal;
  }

  deleteVisibilityContextMenu() {
    this.contextMenuWindow.classList.add('visibility-modal');
  }

  removeVisibilityPanel(selectElements) {
    if (selectElements.length === 0) {
      [...this.functionalAreaContainer.childNodes].forEach((item) => item.classList.add('visibility'));
    } else if (selectElements.length === 1) {
      [...this.functionalAreaContainer.childNodes].forEach((item) => item.classList.add('visibility'));
      switch (selectElements[0].type) {
        case 'rect':
          this.rectContainerPanel.classList.remove('visibility');
          break;
        case 'line':
          this.lineContainerPanel.classList.remove('visibility');
          break;
        case 'text':
          this.textContainerPanel.classList.remove('visibility');
          break;
        case 'ellipse':
          this.ellipseContainerPanel.classList.remove('visibility');
          break;
        case 'path':
          this.pencilContainerPanel.classList.remove('visibility');
          break;
      }
    } else {
      [...this.functionalAreaContainer.childNodes].forEach((item) => item.classList.add('visibility'));
      this.alignContainerPanel.classList.remove('visibility');
    }
  }

  updateFunctionalArea(selectElements) {
    if (selectElements.length === 1) {
      // const arrayChildFunctionalArea = [...this.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'LABEL');
      const attribute = selectElements[0].attr();
      switch (selectElements[0].type) {
        case 'rect':
          const arrayLabelRect = [...this.rectContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelRect[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelRect[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelRect[3].childNodes[1].setAttribute('placeholder', 1);
          arrayLabelRect[4].childNodes[1].setAttribute('placeholder', attribute.x);
          arrayLabelRect[5].childNodes[1].setAttribute('placeholder', attribute.y);
          arrayLabelRect[6].childNodes[1].setAttribute('placeholder', attribute.width);
          arrayLabelRect[7].childNodes[1].setAttribute('placeholder', attribute.height);
          break;
        case 'line':
          const arrayLabelLine = [...this.lineContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelLine[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelLine[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelLine[3].childNodes[1].setAttribute('placeholder', 1);
          arrayLabelLine[4].childNodes[1].setAttribute('placeholder', attribute.x1);
          arrayLabelLine[5].childNodes[1].setAttribute('placeholder', attribute.y1);
          arrayLabelLine[6].childNodes[1].setAttribute('placeholder', attribute.x2);
          arrayLabelLine[7].childNodes[1].setAttribute('placeholder', attribute.y1);
          break;
        case 'text':
          const arrayLabelText = [...this.textContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelText[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelText[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelText[3].childNodes[1].setAttribute('placeholder', 1);
          arrayLabelText[4].childNodes[1].setAttribute('placeholder', attribute.x);
          arrayLabelText[5].childNodes[1].setAttribute('placeholder', attribute.y);
          arrayLabelText[6].childNodes[1].setAttribute('placeholder', attribute['font-size']);
          // здесь долджно быть начертание
          break;
        case 'ellipse':
          const arrayLabelEllipse = [...this.ellipseContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelEllipse[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelEllipse[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelEllipse[3].childNodes[1].setAttribute('placeholder', 1);
          arrayLabelEllipse[4].childNodes[1].setAttribute('placeholder', attribute.cx);
          arrayLabelEllipse[5].childNodes[1].setAttribute('placeholder', attribute.cy);
          arrayLabelEllipse[6].childNodes[1].setAttribute('placeholder', attribute.rx);
          arrayLabelEllipse[7].childNodes[1].setAttribute('placeholder', attribute.ry);
          break;
        case 'path':
          const arrayLabelPencil = [...this.pencilContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelPencil[0].childNodes[1].setAttribute('placeholder', attribute.id); // id
          arrayLabelPencil[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelPencil[3].childNodes[1].setAttribute('placeholder', 1);
          break;
      }
    }
  }

  createArrayNameBtn(type) {
    if (type === 'rect') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'x', 'y', 'width', 'height'];
    } else if (type === 'line') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'x1', 'y1', 'x2', 'y2'];
    } else if (type === 'text') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'x', 'y', 'size', 'family', 'mark'];
    } else if (type === 'ellipse') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'cx', 'cy', 'rx', 'ry'];
    } else if (type === 'path') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke'];
    }

    return ['delete', 'convert', 'left', 'right', 'top', 'bottom', 'center', 'middle'];
  }

  createSelectElement(typeElement) {
    this.selectProperty = document.createElement('select');
    this.selectProperty.classList.add(`tools-top__functional-area__container--${typeElement}`);
    if (typeElement === 'family') {
      const familyClasses = ['serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'];
      for (let i = 0; i < this.countFamily; i += 1) {
        const option = document.createElement('option');
        option.textContent = familyClasses[i];
        this.selectProperty.append(option);
      }
    }

    return this.selectProperty;
  }

  createFunctionalAreaAlignmentElements(containerPanel) {
    ALIGNMENT_ICONS.forEach((item) => {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.dataset[this.alignPanelDataAttribute] = item;
      btn.classList.add('tools-top__functional-area__container__btn--click');
      btn.innerHTML = `<i class="material-icons">${item}</i>`;
      containerPanel.append(btn);
    });
  }

  createFunctionalAreaElements(containerPanel, arrayBtn) {
    let j = 0;
    for (let i = 0; i < arrayBtn.length; i += 1) {
      const containerButton = document.createElement('div');
      containerButton.classList.add('tools-top__functional-area__container');
      if (arrayBtn[i] === 'delete' || arrayBtn[i] === 'convert') {
        const button = document.createElement('button');
        button.dataset[this.propertiesDataAttribute] = arrayBtn[i];
        button.classList.add('tools-top__functional-area__container__btn--click');
        if (arrayBtn[i] === 'delete') {
          button.innerHTML = '<i class="material-icons">disabled_by_default</i>';
        } else {
          button.innerHTML = '<i class="material-icons">timeline</i>';
        }
        containerButton.append(button);
        containerPanel.append(containerButton);
      } else if (arrayBtn[i] === 'stroke' || arrayBtn[i] === 'angle' || arrayBtn[i] === 'width' || arrayBtn[i] === 'height') {
        const icon = document.createElement('img');
        icon.setAttribute('src', `../../img/content/${FUNCTIONAL_AREA_ICONS[j]}`);
        icon.setAttribute('alt', arrayBtn[i]);
        const button = document.createElement('input');
        button.setAttribute('input', 'text');
        button.dataset[this.propertiesDataAttribute] = arrayBtn[i];
        button.classList.add('tools-top__functional-area__container__btn--keyup');
        containerButton.append(icon, button);
        containerPanel.append(containerButton);
        j += 1;
      } else if (arrayBtn[i] === 'family') {
        containerButton.append(this.createSelectElement(arrayBtn[i]));
        containerPanel.append(containerButton);
      } else {
        const span = document.createElement('span');
        span.textContent = arrayBtn[i];
        const button = document.createElement('input');
        button.setAttribute('input', 'text');
        button.dataset[this.propertiesDataAttribute] = arrayBtn[i];
        button.classList.add('tools-top__functional-area__container__btn--keyup');
        containerButton.append(span, button);
        containerPanel.append(containerButton);
      }
    }
  }

  createFunctionalAreaPanels(functionalArea) {
    this.rectContainerPanel = document.createElement('div');
    this.rectContainerPanel.classList.add('tools-top__functional-area__rect', 'visibility');
    const arrayRectBtn = this.createArrayNameBtn('rect');
    this.createFunctionalAreaElements(this.rectContainerPanel, arrayRectBtn);

    this.lineContainerPanel = document.createElement('div');
    this.lineContainerPanel.classList.add('tools-top__functional-area__line', 'visibility');
    const arrayLineBtn = this.createArrayNameBtn('line');
    this.createFunctionalAreaElements(this.lineContainerPanel, arrayLineBtn);

    this.textContainerPanel = document.createElement('div');
    this.textContainerPanel.classList.add('tools-top__functional-area__text', 'visibility');
    const arrayTextBtn = this.createArrayNameBtn('text');
    this.createFunctionalAreaElements(this.textContainerPanel, arrayTextBtn);

    this.ellipseContainerPanel = document.createElement('div');
    this.ellipseContainerPanel.classList.add('tools-top__functional-area__ellipse', 'visibility');
    const arrayEllipseBtn = this.createArrayNameBtn('ellipse');
    this.createFunctionalAreaElements(this.ellipseContainerPanel, arrayEllipseBtn);

    this.pencilContainerPanel = document.createElement('div');
    this.pencilContainerPanel.classList.add('tools-top__functional-area__pencil', 'visibility');
    const arrayPencilBtn = this.createArrayNameBtn('path');
    this.createFunctionalAreaAlignmentElements(this.pencilContainerPanel, arrayPencilBtn);

    this.alignContainerPanel = document.createElement('div');
    this.alignContainerPanel.classList.add('tools-top__functional-area__align', 'visibility');
    this.createFunctionalAreaAlignmentElements(this.alignContainerPanel);

    functionalArea.append(this.rectContainerPanel, this.lineContainerPanel, this.textContainerPanel, this.ellipseContainerPanel, this.pencilContainerPanel, this.alignContainerPanel);
  }

  createFunctionalArea() {
    const functionalArea = createElement('div', ['tools-top__functional-area']);
    this.createFunctionalAreaPanels(functionalArea);

    return functionalArea;
  }

  createSwitcherContainer() {
    const switcherContainer = document.createElement('div');
    switcherContainer.classList.add('tools-top__switcher-area');

    this.checkSwitcher = document.createElement('input');
    const labelForSwitcher = document.createElement('label');
    this.checkSwitcher.classList.add('tools-top__switcher-area__switcher-lang');
    this.checkSwitcher.setAttribute('type', 'checkbox');
    this.checkSwitcher.setAttribute('id', 'switcher-lang');
    labelForSwitcher.setAttribute('for', 'switcher-lang');
    labelForSwitcher.textContent = 'RU';
    switcherContainer.append(this.checkSwitcher, labelForSwitcher);

    return switcherContainer;
  }

  createToolsTop() {
    const toolsTop = createElement('div', ['tools-top']);
    this.functionalAreaContainer = this.createFunctionalArea();
    this.switcherContainer = this.createSwitcherContainer();
    toolsTop.append(this.menuContainer, this.functionalAreaContainer, this.switcherContainer);

    return toolsTop;
  }

  createWorkArea() {
    const workAreaContainer = createElement('div', ['work-area']);
    // const field = createElement('div', false, {id: 'field'});

    // this.sheet1 = createElement('div', ['sheet'], {id: 'sheet1'});
    // workAreaContainer.append(this.sheet1);
    // field.append(this.sheet);

    return workAreaContainer;
  }

  createSheet(sheetId) {
    this.sheets = [...this.sheets, createElement('div', ['sheet'], {id: `sheet${sheetId}`})];
    // const sheet = createElement('div', ['sheet'], {id: `sheet${sheetId}`});
    // return sheet;
  }

  renderSheet() {
    this.createSheet(this.sheetsNumber);
    this.workAreaContainer.append(this.sheets[this.sheetsNumber]);
    this.sheetsNumber++;
  }

  createToolsBottom() {
    const toolsBottomContainer = createElement('div', ['tools-bottom']);
    /*
    toolsBottomBtnName.forEach((item) => {
      let btn = document.createElement('button');
      btn.id = `${item}`;
      btn.style.background = item;
      toolsBottomContainer.append(btn);
    });*/

    const buttonNewTab = createElement('button', ['tools-bottom__new-tab-button'], {type: 'button'}, '+');
    buttonNewTab.dataset[`${this.tabsDataAttribute}`] = 'new';

    const tabControl1 = this.createTabControl(this.sheetsNumber);

    toolsBottomContainer.append(buttonNewTab, tabControl1);

    return toolsBottomContainer;
  }

  createTabControl(tabNumber) {
    const tabControl = createElement('div', ['tools-bottom__tab-control'], false, `SVG ${tabNumber}`);
    tabControl.style.backgroundColor = 'lightgray';
    tabControl.style.border = '2px solid gray';
    tabControl.style.borderRadius = '5px';
    tabControl.style.cursor = 'pointer';
    tabControl.style.width = '170px';
    tabControl.dataset[`${this.tabsDataAttribute}`] = tabNumber;

    const closeButton = createElement('button', ['tools-bottom__tab-close'], {type: 'button'}, 'x');
    closeButton.style.marginLeft = '77px';
    tabControl.append(closeButton);

    return tabControl;
  }

  createToolsLeft() {
    const toolsLeftContainer = createElement('div', ['tools-left']);

    TOOLS_LEFT_NAMES_EN.forEach((item) => {
      const tooltip = createElement('span', ['tooltip', 'tooltip-right'], false, `${item}`);
      toolsLeftContainer.append(tooltip);

      let btn = createElement('button', false, {id: `${item}`}, `${item}`);
      btn.append(tooltip);

      toolsLeftContainer.append(btn);
    });

    return toolsLeftContainer;
  }

  createWrapper() {
    const wrapper = createElement('div', ['wrapper']);
    return wrapper;
  }

  renderHeader() {
    this.headerElement = document.createElement('header');
    this.headerElement.classList.add('header');
    this.headerContainer = document.createElement('div');
    this.headerContainer.classList.add('container');
    this.headerContainer.textContent = 'SVG EDITOR';
    this.headerElement.appendChild(this.headerContainer);
  }

  renderContent() {
    this.contextMenuWindow = this.createContextMenuModal();
    this.toolsTopContainer = this.createToolsTop();
    this.toolsBottomContainer = this.createToolsBottom();
    this.toolsLeftContainer = this.createToolsLeft();
    this.workAreaContainer = this.createWorkArea();
    this.renderSheet();

    this.contentElement = createElement('main', ['main']);
    this.contentContainer = createElement('div', ['container']);
    this.contentElement.appendChild(this.contentContainer);

    this.toolsRightContainer = createElement('div', ['tools-right']);
    this.contentContainer.append(this.toolsTopContainer, this.toolsLeftContainer, this.toolsRightContainer, this.toolsBottomContainer, this.workAreaContainer, this.saveModal, this.settingsModal, this.svgCodeModal, this.contextMenuWindow, this.newImageModal);
  }

  renderFooter() {
    const yearSpan = createElement('span', ['copyright__year'], false, '2020 ©');
    const by = createElement('span', false, false, 'by');

    const student1Link = createElement('a', ['copyright__student-link'], {href: 'https://github.com/alexk08', target: '__blank'}, 'Aleksandr Krasinikov');
    const student2Link = createElement('a', ['copyright__student-link'], {href: 'https://github.com/11alexey11', target: '__blank'}, 'Alexey Yanvarev');
    const student3Link = createElement('a', ['copyright__student-link'], {href: 'https://github.com/gtm003', target: '__blank'}, 'Tatyana Grigorovich');

    const logo = createElement('img', ['copyright__logo-rs'], {
      src: 'img/svg/rs_school_js.svg',
      alt: 'Logo RS School',
      width: '100px'
    });

    const courseLink = createElement('a', ['copyright__course-link'], {href: 'https://rs.school/js/', target: '__blank'});
    courseLink.appendChild(logo);

    const copyrightElement = createElement('div', ['copyright']);
    copyrightElement.append(yearSpan, by, student1Link, student2Link, student3Link, courseLink);

    this.footerElement = createElement('footer', ['footer']);
    this.footerContainer = createElement('div', ['container']);
    this.footerContainer.append(copyrightElement);
    this.footerElement.appendChild(this.footerContainer);
  }
}
