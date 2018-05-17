import { browser, by, element } from 'protractor'

export class AppPage {
  navigateTo() {
    return browser.get('/')
  }

  getGenerateButton() {
    return element(by.css('button[type="button"]')).getText()
  }
}
