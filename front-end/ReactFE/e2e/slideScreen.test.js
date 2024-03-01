describe("Side-screen scroller test", () => {
    beforeAll(async () => {
      await device.launchApp();
    });
  
    beforeEach(async () => {
      await device.reloadReactNative();
    });

  
      it('Stack Screen for survey needs to appear after it clicked', async () => {
        await element(by.id('menuButton')).tap();
        await element(by.text('Survey')).tap();
        await element(by.id("TakeSurvey")).tap();
        await expect(element(by.text("First Item"))).toBeVisible();
      });

      it('Stack Screen new Screen need to appear after it is slided left', async () => {
        await element(by.id('menuButton')).tap();
        await element(by.text('Survey')).tap();
        await element(by.id("TakeSurvey")).tap();
        await element(by.id("surveyModalCard")).swipe("left")
        await expect(element(by.text("Second Item"))).toBeVisible()
      });
  });
  