import { expect, device, by, element } from "detox";
describe("NavigationTest", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have Navigation Button", async () => {
    await expect(element(by.id("menuButton"))).toBeVisible();
  });

  it("Navigation Button should open the Drawer where profile drawer item exists", async () => {
    await element(by.id("menuButton")).tap();
    await expect(element(by.text("Profile"))).toBeVisible();
  });

  it('Navigation Drawer Profile button should open the Profile Screen with "Your Profile" text', async () => {
    await element(by.id("menuButton")).tap();
    await element(by.text("Profile")).tap();
    await expect(element(by.text("Your Profile"))).toBeVisible();
  });
});
