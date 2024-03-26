/*Tests heplper functions 
in programs environment*/

import { expect, device, by, element } from "detox";
import { isOnLoginPage, isUserLogedIn, openDrawer,navigateToScreen, login,screenShot, drawerExist } from "../../e2eHelpers/e2eHelpers";
describe("Helper functions test", () => {




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
  
  
  it("should not be logged in", async () => {

    
    await expect(element(by.id("passwordInput"))).toExist()

    const loginPage = await isOnLoginPage()
    const isLoggedIn = await isUserLogedIn()

      await drawerExist()
     await openDrawer()
     
  });


  it("should not be logged in", async () => {
    await expect(element(by.id("passwordInput"))).toExist()

    const loginPage = await isOnLoginPage()

    expect(loginPage.props).toHaveText("success")
     console.log(loginPage)
  });


  

  
});