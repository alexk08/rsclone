import {MENU_BUTTONS_NAMES_EN} from '../../utils/btn-names';
import {createElement} from '../../utils/createELement';

export class MainMenu {
  constructor(menuButtonsDataAttribute) {
    this.menuButtonsDataAttribute = menuButtonsDataAttribute;
  }

  createMenuContainer() {
    const menuContainer = createElement('div', ['tools-top__menu-area']);
    menuContainer.classList.add();

    MENU_BUTTONS_NAMES_EN.forEach((item) => {
      if (item !== 'Import SVG') {
        const button = createElement('button', false, {type: 'button'}, `${item}`);
        button.dataset[`${this.menuButtonsDataAttribute}`] = `${item}`;
        menuContainer.appendChild(button);
      } else {
        const inputFileUpload = createElement('input', false, {type: 'file', id: 'upload-file'});
        inputFileUpload.dataset[`${this.menuButtonsDataAttribute}`] = `${item}`;
        inputFileUpload.style.display = 'none';

        const labelFileUpload = createElement('label', false, {for: 'upload-file'}, `${item}`);
        menuContainer.append(labelFileUpload, inputFileUpload);
      }
    });

    return menuContainer;
  }
}
