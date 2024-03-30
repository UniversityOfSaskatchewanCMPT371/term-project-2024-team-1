/*Tests heplper functions 
in programs environment*/

import { expect, device, by, element } from "detox";
import {expect as jExpect} from '@jest/globals';

import { isOnLoginPage, isUserLogedIn, openDrawer,navigateToScreen, login,screenShot, drawerExist } from "../../e2eHelpers/e2eHelpers";
describe("Helper functions test", () => {

  const skipLogin = true
  const screenShotTest =true


  beforeAll(async () => {
    await device.launchApp();
    
  });


  /*Test hook starting the login */
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  /* testing hook for logout
  */
  afterEach(async () =>{

  })


  afterAll(async () =>{

  })
  if(!skipLogin) {
  
  it("should not be logged in", async () => {


 
    
    await expect(element(by.id("passwordInput"))).toExist()

    const loginPage = await isOnLoginPage()
    const isLoggedIn = await isUserLogedIn()

      await drawerExist()
     await openDrawer()
    
     
  });
  }

  it("isOnLogin Test", async () => {


    const loginPage = await isOnLoginPage()
    
    if(!skipLogin){
    await expect(element(by.id("passwordInput"))).toExist()

    

    
    }

    else {
      console.log(loginPage)
      jExpect(loginPage).toBe(false)
    }
  });




  
  it("Screenshot test", async () =>{


    if(screenShotTest) {
      await navigateToScreen("Surveys")
      const result = await screenShot("SCREENSHOTTEST")

      await jExpect(result).toBe(true)

    }
  })


  

  
});