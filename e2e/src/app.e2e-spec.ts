import { resolve } from 'path';

import { AppPage } from './app.po';
import { browser, by, element, logging, ExpectedConditions as until } from 'protractor';
import { hasUncaughtExceptionCaptureCallback } from 'process';

function waitForTestTag(tag: string) {
  browser.wait(until.presenceOf(element(by.css(`[data-test="${tag}"]`))));
  browser.sleep(200);
}

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('User can navigate to exam and submit', done => {
    page.navigateTo();

    waitForTestTag('login-btn');

    element(by.css('form input[name=email]')).sendKeys('chaoyu@gmail.com');
    element(by.css('form input[name=password]')).sendKeys('12345678');
    element(by.css('input[type=submit]')).click(); // login

    waitForTestTag('nav-exam-link');

    element(by.css('nav ul li + li a')).click(); // click exam nav

    element(by.css('tbody tr + tr td span')).click(); // click first exam name

    expect(element(by.css('.content-title-font')).getText()).toBe('Problems');

    const problemName = element(by.css('tbody tr td + td')).getText();
    const quotaLeft = Number(element(by.css('tbody tr td + td + td + td + td')).getText());
    element(by.css('tbody tr td + td')).click(); // click first problem

    waitForTestTag('problem-title');
    expect(element(by.css('h1')).getText()).toEqual(problemName);

    element(by.css('form input[type=file]')).sendKeys(resolve(__dirname, '..', 'empty.c'));
    element(by.css('form div + div span')).click(); // submit

    element(by.css('div[id=tab-panel] ul li + li + li a')).getAttribute('class').then(classes => {
      expect(classes.split(' ').includes('active')).toBe(true);
    });

    browser.sleep(10000);
    expect(element(by.css('tbody tr td + td span')).getText()).toEqual('CE');
    
    element(by.css('app-ide-banner span')).click(); // back to exam
    waitForTestTag('exam-questions-table');

    const newQuotaLeft = Number(element(by.css('tbody tr td + td + td + td + td')).getText());
    expect(newQuotaLeft).toEqual(quotaLeft - 1);

    done();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    // const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    // expect(logs).not.toContain(jasmine.objectContaining({
    //   level: logging.Level.SEVERE,
    // } as logging.Entry));
  });
});
