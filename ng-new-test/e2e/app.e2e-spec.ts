import { NgNewTestPage } from './app.po';

describe('ng-new-test App', function() {
  let page: NgNewTestPage;

  beforeEach(() => {
    page = new NgNewTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
