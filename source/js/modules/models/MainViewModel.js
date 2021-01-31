import {Controller} from '../controllers/Controller';
import {SwitcherLanguageController} from '../controllers/SwitcherLanguageController';
import {TabsController} from '../controllers/TabsController';
import {LoadingController} from '../controllers/LoadingController';

export class MainViewModel {
  constructor(appView) {
    this.appView = appView;

    this.controllers = [];
    // this.appLastCondition = [];
  }

  init(tabsCount) {
    const lastConditions = JSON.parse(localStorage.getItem('SvgEditor_lastCondition'));
    console.log(lastConditions)

    // if (lastConditions && lastConditions.length !== 0) {
    //   this.appView.renderTab();
    //   this.appView.renderTabControl();

    //   new SwitcherLanguageController(this.appView, this).addAllListeners();
    //   new TabsController(this.appView, this).addAllListeners();
    //   new LoadingController(this).addAllListeners();

    //   lastConditions.forEach((lastCondition, i) => {
    //     this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[i], this, lastCondition)];
    //     this.controllers[tabsCount].init();
    //     this.setActiveController(i);
    //   });
    // }
    // if (lastConditions === null || (lastConditions.length === 1 && lastConditions[0].length === 0)) {
    new SwitcherLanguageController(this.appView, this).addAllListeners();
    new TabsController(this.appView, this).addAllListeners();
    new LoadingController(this).addAllListeners();

    if (lastConditions === null) {
      this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[tabsCount], this)];
      this.controllers[tabsCount].init();
      this.setActiveController(tabsCount);
    } else {
      lastConditions.forEach((lastCondition, i) => {
        if (i === 0) {
          this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[i], this, lastCondition)];
          this.controllers[i].init();
          this.setActiveController(i);
        } else {
          this.createNewTab(lastCondition);
        }
      });
    }
  }

  setActiveController(tabId) {
    this.activeController = +tabId;
  }

  callNewController(tabsCount, lastCondition) {
    this.controllers[this.activeController].removeAllListeners();
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[tabsCount], this, lastCondition)];
    this.controllers[this.controllers.length - 1].init();
    this.setActiveController(tabsCount);
  }

  changeController(tabId) {
    this.controllers[this.activeController].removeAllListeners();
    this.controllers[tabId].addAllListeners();
    this.setActiveController(tabId);
  }

  createNewTab(lastCondition) {
    this.removeActiveConditionTab();
    this.removeActiveConditionTabControl();

    this.appView.renderTab();
    this.appView.renderTabControl();

    this.callNewController(this.appView.tabs.length - 1, lastCondition);
  }

  openTab(tabId) {
    if (this.activeController === +tabId) return;

    this.changeController(tabId);

    this.removeActiveConditionTabControl();
    this.setActiveConditionTabControl(tabId);

    this.removeActiveConditionTab();
    this.setActiveConditionTab(tabId);
  }

  closeTab(tabId) {
    if (this.appView.tabs.length === 1) return;
    this.controllers[tabId].remove();
    this.controllers.splice(tabId, 1);
    this.removeTabControl(tabId);
    this.removeTab(tabId);
    this.setActiveTab();
  }

  setActiveConditionTabControl(tabId) {
    this.appView.tabControls[tabId].classList.add('tools-bottom__tab-control--active');
  }

  removeActiveConditionTabControl() {
    this.appView.tabControls.forEach(tabControl => {
      if (tabControl.classList.contains('tools-bottom__tab-control--active')) tabControl.classList.remove('tools-bottom__tab-control--active');
    });
  }

  setActiveConditionTab(tabId) {
    this.appView.tabs[tabId].classList.add('tab--active');
  }

  removeActiveConditionTab() {
    this.appView.tabs.forEach(tab => {
      if (tab.classList.contains('tab--active')) tab.classList.remove('tab--active');
    });
  }

  removeTabControl(tabId) {
    this.appView.tabControls[tabId].remove();
    this.appView.tabControls.splice(tabId, 1);
    this.appView.tabControls.forEach((tab, i) => {
      tab.dataset[`${this.appView.tabsDataAttribute}`] = i;
      tab.innerHTML = `SVG ${i}<button class="tools-bottom__tab-close" type="button">x</button>`;
    });
  }

  removeTab(tabId) {
    this.appView.tabs[tabId].remove();
    this.appView.tabs.splice(tabId, 1);
    this.appView.tabs.forEach((sheet, i) => {
      sheet.id = `sheet${i}`;
    });
  }

  setActiveTab() {
    let activeTabId;

    this.appView.tabControls.forEach(tabControl => {
      if (tabControl.classList.contains('tools-bottom__tab-control--active')) {
        activeTabId = +tabControl.dataset[`${this.appView.tabsDataAttribute}`];
      }
    });

    if (activeTabId === undefined) {
      activeTabId = 0;
      this.appView.tabControls[activeTabId].classList.add('tools-bottom__tab-control--active');
      this.appView.tabs[activeTabId].classList.add('tab--active');
      this.controllers[activeTabId].addAllListeners();
    }

    this.setActiveController(activeTabId);
  }

  saveLastCondition() {
    // debugger
    const appLastCondition = [];

    this.controllers.forEach(controller => {
      // debugger
      const tabLastCondition = controller.model.getLastCondition();
      // appLastCondition = [...appLastCondition, tabLastCondition];
      console.log(tabLastCondition)
      appLastCondition.push(tabLastCondition);
    });
    console.log(appLastCondition)
    localStorage.setItem('SvgEditor_lastCondition', JSON.stringify(appLastCondition));
  }
}
