import { CmrV0Page } from './app.po';

describe('cmr-v0 App', () => {
  let page: CmrV0Page;

  beforeEach(() => {
    page = new CmrV0Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
