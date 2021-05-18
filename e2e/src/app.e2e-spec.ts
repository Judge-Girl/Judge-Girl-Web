import { AppPage } from './app.po';
import { browser, by, element, logging, ExpectedConditions } from 'protractor';
import { ECANCELED } from 'constants';

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
    element(by.css('input[type=submit]')).click();
    browser.sleep(3000);
    element(by.css('nav ul li + li a')).click();
    element(by.css('tbody tr + tr td span')).click();

    expect(element(by.css('.content-title-font')).getText()).toBe('Problems');

    const problemName = element(by.css('tbody tr td + td')).getText();
    const quotaLeft = Number(element(by.css('tbody tr td + td + td + td + td')).getText());
    element(by.css('tbody tr td + td')).click();

    browser.sleep(1000);
    expect(element(by.css('h1')).getText()).toEqual(problemName);

    // do submit

    // see result 

    // back to exam

    // check quota - 1

    // browser.sleep(100000000);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
