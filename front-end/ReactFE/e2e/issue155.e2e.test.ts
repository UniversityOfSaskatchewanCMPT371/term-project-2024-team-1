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
import { skip } from "node:test";
describe("issue 155 UI testing with logout", () => {

    let assertionsExpected = 0;
    const loginBeforeEach = false

    beforeAll(async() => {
        await device.launchApp();

    });

    /*Test hook starting the login */
    beforeEach(async() => {
      assertionsExpected = 0
             await device.reloadReactNative();

             if(loginBeforeEach) {
              await login()
             }
    });

    /* testing hook for taking screenshot if triggered
  */
    afterEach(async() => {

        let assertionsPassed = jestExpect
            .getState()
            .numPassingAsserts

            
          
            if(assertionsPassed < assertionsExpected || (assertionsPassed ==0 && assertionsExpected !=0)) {
      
              console.log("ASSERTION COUNT NOT MET for:"+jestExpect.getState().currentTestName+ "\nEXPECTED:"+assertionsExpected+" RECEIVED:"+assertionsPassed)
              screenShot("issue155"+String(Date.now()))
              assertionsExpected = 0

            }


    })

    it("should have Navigation Button", async() => {
      assertionsExpected = 1
        const hasDrawer = await drawerExist()
        await jestExpect(hasDrawer).toEqual(true)

        /*test if drawer functions */
        await openDrawer()
    });

    it("Home page has Take survey button", async() => {

        await navigateToScreen("Home")

        await expect(element(by.id("takeSurveyButton"))).toExist()
        await element(by.id("takeSurveyButton")).tap()

        
        await expect(element(by.id("takeSurveyButton"))).not.toExist()
    });

    it('Surveys page has 4 quarters', async() => {
        await navigateToScreen("Surveys")
 
        await expect(element(by.text("Quarter 1"))).toExist()
        await expect(element(by.text("Quarter 2"))).toExist()
        await expect(element(by.id("surveyQuarter3ID"))).toExist()
        await expect(element(by.id("surveyQuarter3ID"))).toExist()

        await element(by.id("surveyQuarter3ID")).tap()
    });


    it("Clicking take survey in surveys should change to new screen", async()=> {
      await navigateToScreen("Surveys")
      await expect(element(by.id("SurveysID"))).toExist()
      await element(by.id("surveyQuarter3ID")).tap()
      await expect(element(by.id("SurveysID"))).not.toExist()
    })
   

    it('Notification screen functnality', async() => {
        await navigateToScreen("Notifications")
      
        await expect(element(by.text("Survey Completed"))).toExist()

        await expect(element(by.id("returnButton"))).toExist()

        await element(by.id("returnButton")).tap()
    });

    it('Contact us screen test', async() => {
      assertionsExpected = 0
        await navigateToScreen("Notifications")
        await expect(element(by.text("Contact Us"))).toExist()
        
    });

 

});