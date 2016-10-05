import { BitacorasCdcNg2Page } from './app.po';

describe('bitacoras-cdc-ng2 App', function() {
  let page: BitacorasCdcNg2Page;

  beforeEach(() => {
    page = new BitacorasCdcNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
