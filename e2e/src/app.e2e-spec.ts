import { resolve } from 'path';

import { AppPage } from './app.po';
import { browser, by, element, logging, ExpectedConditions as until } from 'protractor';
import { hasUncaughtExceptionCaptureCallback } from 'process';

function getElementByTag(tag: string) {
  return element(by.css(`[data-test="${tag}"]`));
}

function waitForTestTag(tag: string) {
  browser.wait(until.presenceOf(getElementByTag(tag)));
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

    const form = getElementByTag('login-form');

    form.element(by.css('input[name=email]')).sendKeys('chaoyu@gmail.com');
    form.element(by.css('input[name=password]')).sendKeys('12345678');
    form.element(by.css('input[type=submit]')).click();

    waitForTestTag('nav-exam-link');

    getElementByTag('nav-exam-link').click();

    waitForTestTag('exam-list-table');

    getElementByTag('exam-list-table')
      .element(by.css('tbody'))
      .all(by.css('tr')).get(1)
      .all(by.css('td')).get(1)
      .element(by.css('span'))
      .click(); // click first exam name

    waitForTestTag('exam-questions-title');

    expect(getElementByTag('exam-questions-title').getText()).toBe('Problems');

    // Get the first problem
    const problemRow = getElementByTag('exam-questions-table').element(by.css('tbody')).all(by.css('tr')).get(1);

    const problemName = problemRow.all(by.css('td')).get(1).getText();
    const quotaLeft = Number(problemRow.all(by.css('td')).get(4).getText());
    problemRow.all(by.css('td')).get(1).click();

    waitForTestTag('problem-title');
    expect(getElementByTag('problem-title')).toEqual(problemName);

    const codeUploadForm = getElementByTag('code-upload-form');

    codeUploadForm.element(by.css('input[type=file]')).sendKeys(resolve(__dirname, '..', 'empty.c'));
    getElementByTag('code-upload-form-submit-btn').click();

    
    getElementByTag('ide-submission-tab-link').getAttribute('class').then(classes => {
      expect(classes.split(' ').includes('active')).toBe(true);
    });

    browser.sleep(10000); // wait for judge to finish

    expect(getElementByTag('submissions-table')
      .element(by.css('tbody'))
      .all(by.css('tr')).get(0)
      .all(by.css('td')).get(1)
      .element(by.css('span'))
      .getText()
    ).toEqual('CE');
    
    element(by.css('app-ide-banner span')).click(); // back to exam
    waitForTestTag('exam-questions-table');

    const newProblemRow = getElementByTag('exam-questions-table').element(by.css('tbody')).all(by.css('tr')).get(1);
    const newQuotaLeft = Number(newProblemRow.all(by.css('td')).get(4).getText());
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
