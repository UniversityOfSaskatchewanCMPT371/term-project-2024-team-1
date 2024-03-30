import { expect, device, by, element } from "detox";
import { isOnLoginPage, isUserLogedIn, openDrawer,navigateToScreen, login,screenShot, drawerExist } from "../e2eHelpers/e2eHelpers";
import {expect as jestExpect, } from '@jest/globals';
describe("Login test", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("isOnLogin function returns true", async () => {
   const isLogin = await isOnLoginPage()

   await jestExpect(isLogin).toBe(true)
  });

  it("drawerExist returns false", async () => {
    const hasDrawer = await drawerExist()
 
    await jestExpect(hasDrawer).toBe(false)
   });

});
