import { browser, element, by } from 'protractor';

export class Ng2MaterialFlexTestPage {
  navigateTo() {
    return browser.get('/');
  }

  getCardClass() {
    return element(by.css('tst-root md-card')).getAttribute('class');
  }
}
