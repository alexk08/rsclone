import {SignInModal} from '../views/SignInModal';
import {createElement} from '../../utils/createELement';

export class SignInModalController {
  constructor(appView, viewModel) {
    this.appView = appView;
    this.viewModel = viewModel;
    this.signInModalObject = new SignInModal(this.appView, this.appView.contentContainer);

    this.openSignInModal = this.openSignInModal.bind(this);
    this.onSignInModalClick = this.onSignInModalClick.bind(this);
    this.onSignUpModalClick = this.onSignUpModalClick.bind(this);
    this.onToolsRightProfileClick = this.onToolsRightProfileClick.bind(this);
  }

  addAllListeners() {
    this.appView.toolsRightContainer.addEventListener('click', this.openSignInModal);
  }

  openSignInModal({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign In') {
      this.appView.signInModal = this.signInModalObject.createSignInModal(true);
      this.appView.signInModal.addEventListener('click', this.onSignInModalClick);
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Out') {
      this.signInModalObject.changeButtonSign(false);
      const lengthContainer = this.appView.toolsRightContainer.childNodes.length - 1;
      for (let i = 0; i < lengthContainer; i += 1) {
        this.appView.toolsRightContainer.childNodes[1].remove();
      }
    }
  }

  onSignInModalClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign In') {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://rs-demo-back.herokuapp.com/auth/login');
      xhr.responseType = 'json';
      const email = this.appView.signInModal.childNodes[0].childNodes[0].value;
      const password = this.appView.signInModal.childNodes[0].childNodes[1].value;
      if (email !== '' && password !== '') {
        const json = {
          email,
          password,
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json));
        xhr.onload = () => {
          if (xhr.response.statusCode === 200) {
            this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
            this.appView.signInModal.remove();
            this.viewModel.idClient = xhr.response.id;
            this.signInModalObject.changeButtonSign(true);
            this.signInModalObject.createProfile();
            this.appView.toolsRightContainer.addEventListener('click', this.onToolsRightProfileClick);
          } else {
            this.appView.signInModal.childNodes[1].textContent = xhr.response.reason;
          }
        };
      }
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Up') {
      this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
      this.appView.signInModal = this.signInModalObject.createSignInModal(false);
      this.appView.signInModal.addEventListener('click', this.onSignUpModalClick);
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
      this.appView.signInModal.remove();
    }
  }

  onSignUpModalClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Up') {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://rs-demo-back.herokuapp.com/auth/register');
      xhr.responseType = 'json';
      const username = this.appView.signInModal.childNodes[0].childNodes[0].value;
      const email = this.appView.signInModal.childNodes[0].childNodes[1].value;
      const password = this.appView.signInModal.childNodes[0].childNodes[2].value;
      if (username !== '' && email !== '' && password !== '') {
        const json = {
          username,
          email,
          password,
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json));
        xhr.onload = () => {
          if (xhr.response.statusCode === 200) {
            this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
            this.appView.signInModal.remove();
          } else {
            this.appView.signInModal.childNodes[1].textContent = xhr.response.reason;
          }
        };
      }
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
      this.appView.signInModal.remove();
    }
  }

  onToolsRightProfileClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Open') {
      // let xhr = new XMLHttpRequest();
      // xhr.open('GET', `https://rs-demo-back.herokuapp.com/auth/login/${this.viewModel.idClient}`);
      // xhr.responseType = 'json';
      // xhr.setRequestHeader('Content-Type', 'application/json');
      // xhr.send();
      // xhr.onload = () => {
      //   console.log(xhr.response); // почему-то cors не работает
      //   this.signInModalObject.createModalOpen(['123', '123']);
      // };
      this.signInModalObject.createModalOpen(['123', '123', '123', '123', '123', '123', '123', '123']);
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Save') {
      this.viewModel.openModalSave('server');
    }
  }
}
