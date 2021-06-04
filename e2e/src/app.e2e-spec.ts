import { resolve } from 'path';

import { AppPage } from './app.po';
import { browser, by, element, logging, ExpectedConditions } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('User can navigate to exam and submit', () => {
    page.navigateTo();

    browser.sleep(10000);
    element(by.css('form input[name=email]')).sendKeys('chaoyu@gmail.com');
    element(by.css('form input[name=password]')).sendKeys('12345678');
    element(by.css('input[type=submit]')).click(); // login
    browser.sleep(3000);

    element(by.css('nav ul li + li a')).click(); // click exam nav

    element(by.css('tbody tr + tr + tr td span')).click(); // click first exam name

    expect(element(by.css('.content-title-font')).getText()).toBe('Problems');

    const problemName = element(by.css('tbody tr td + td')).getText();
    const quotaLeft = Number(element(by.css('tbody tr td + td + td + td + td')).getText());
    element(by.css('tbody tr td + td')).click(); // click first problem

    browser.sleep(1000);
    expect(element(by.css('h1')).getText()).toEqual(problemName);

    element(by.css('form input[type=file]')).sendKeys(resolve(__dirname, '..', 'empty.c'));
    browser.sleep(1000);
    element(by.css('form input[type=submit]')).click();
    browser.sleep(1000);

    element(by.css('div[id=tab-panel] ul li + li + li a')).getAttribute('class').then(classes => {
      expect(classes.split(' ').includes('acitve')).toBe(true);
    });

    expect(element(by.css('tbody tr td + td span')).getText()).toEqual('CE');
    
    element(by.css('question-banner span')).click(); // back to exam

    const newQuotaLeft = Number(element(by.css('tbody tr td + td + td + td + td')).getText());
    expect(newQuotaLeft).toEqual(quotaLeft - 1);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
