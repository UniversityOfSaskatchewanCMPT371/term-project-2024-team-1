import {expect, device, by, element} from "detox";
import {expect as jestExpect, jest, test} from '@jest/globals';

import {
    isOnLoginPage,
    isUserLogedIn,
    openDrawer,
    drawerExist,
    navigateToScreen,
    login,
    screenShot
} from "../e2eHelpers/e2eHelpers"
import {error} from "console";
describe("issue 155 UI testing with logout", () => {

    let testSummary;

    beforeAll(async() => {
        await device.launchApp();

    });

    /*Test hook starting the login */
    beforeEach(async() => {
        await device.reloadReactNative();
    });

    /* testing hook for taking screenshot if triggered
  */
    afterEach(async() => {

        testSummary.status = jestExpect
            .getState()
            .suppressedErrors

        console.log(testSummary.status)

    })

    it("should have Navigation Button", async() => {
        const hasDrawer = await drawerExist()
        await jestExpect(hasDrawer).toEqual(true)
    });

    it("Home page has Take survey button", async() => {
        await navigateToScreen("Home")

        await expect(element(by.id("takeSurveyButton"))).toExist()
        await element(by.id("takeSurveyButton")).tap()
    });

    it('Surveys page has 4 quarters', async() => {
        await navigateToScreen("Surveys")

        await expect(element(by.text("Quarter 1"))).toExist()
        await expect(element(by.text("Quarter 2"))).toExist()
        await expect(element(by.id("surveyQuarter3ID"))).toExist()
        await expect(element(by.id("surveyQuarter3ID"))).toExist()

        await element(by.id("surveyQuarter3ID")).tap()
    });

    it('Notification screen functnality', async() => {
        await navigateToScreen("Notifications")

        await expect(element(by.text("Survey Completed"))).toExist()

        await expect(element(by.id("returnButton"))).toExist()

        await element(by.id("returnButton")).tap()
    });

    it('Contact us screen test', async() => {
        await navigateToScreen("Notifications")
        await expect(element(by.text("Contact Us"))).toExist()
        await expect(element(by.text("Contact Us"))).toExist()
    });

    it('')

});