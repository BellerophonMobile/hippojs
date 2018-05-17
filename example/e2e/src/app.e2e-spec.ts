import { AppPage } from './app.po'

describe('workspace-project App', () => {
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
  })

  it('should have a generate button', () => {
    page.navigateTo()
    expect(page.getGenerateButton()).toEqual('Generate Credentials')
  })
})
