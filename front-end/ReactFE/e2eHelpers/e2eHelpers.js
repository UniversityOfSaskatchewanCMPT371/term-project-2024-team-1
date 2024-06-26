
import path from "path";
import * as fs from "fs"
/*
    Preconditions: on login page, backend is running
    PostCOndition: logs in with given credentials, screen changes to a landing page of either user or admin
*/
export async function login(username, password) {

    console.log(`Logging in user with ${username} and ${password}`)
    await element(by.id('userIdEmailInput')).typeText(username);
    await element(by.id('passwordInput')).typeText(password);
    await element(by.id('loginButton')).tap();
  }
  

  /*
    return value: true if drawer exists, false otherwise
  */

  export async function drawerExist(){


  
    try {
      await expect( element(by.id('menuButton'))).toBeVisible();
      return true;
    } catch (e) {
      return false;
    }

   
  }


  /* Preecondition: drawer exists on the screen
    PostConditions: drawer is opened

  */
  export async function openDrawer() {
    await element(by.id('menuButton')).tap();


  }
  /*
  Preconditions: Screen exists for the current drawer
  Postconditions: changes the current screen to the given screen
  */
  export async function navigateToScreen(screenName) {
    

    await openDrawer()
    await element(by.text(screenName)).tap();
  }


  /*
    return value: true if user is logged in, false otherwise
  */
  export async function isUserLogedIn() {

    const passwordInputField = element(by.id('passwordInputID'));

    console.log(passwordInputField)

    try {
    const isOnLoginPage = await expect(passwordInputField).toBeVisible();
    return true

    }

    catch(e) {
      return false
    }

    
    

    

  }


  /*
    return value: true if on login page, false otherwise
  */
  export async function isOnLoginPage(){

    const loginScreen = element(by.id('loginPage'));
  
    try {
    const isOnLoginPage = await expect(loginScreen).toBeVisible();
    return true

    }

    catch(e) {
      throw e
      return false
    }

  }



  /*
    Makes a screenshot of the given screen
    PostConditions: a png file of the screenshot is saved to
  */
  export async function screenShot(name = String(Date.now())){
    
   

    try {
    const screenshot = await device.takeScreenshot(name);

   
    // Specify the destination directry for the screenshot
    const destinationPath = path.join(__dirname, 'screenshots', `name.png`);


    console.log(`Screenshot saved at: ${screenshot}`);

      return true
    }

    catch(e) {
      
      return false
    }
  }