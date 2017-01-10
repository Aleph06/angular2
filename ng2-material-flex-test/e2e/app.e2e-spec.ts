import { Ng2MaterialFlexTestPage } from './app.po';

describe('ng2-material-flex-test App', function () {
  let page: Ng2MaterialFlexTestPage;

  beforeEach(() => {
    page = new Ng2MaterialFlexTestPage();
  });

  it('should display md-card with style card-demo', () => {
    page.navigateTo();
    expect(page.getCardClass()).toEqual('card-demo');
  });
});
