import { Angular2FirstTestPage } from './app.po';

describe('angular2-first-test App', function() {
  let page: Angular2FirstTestPage;

  beforeEach(() => {
    page = new Angular2FirstTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
