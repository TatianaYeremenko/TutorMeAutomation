import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E VIPkids: ", () => {
 jest.setTimeout(1000000);

 const email ='tutor.vipkid@local.peardeck.com';
 const password = "VIPcheck1234!";

  it("Check VIPkids Tutor Dashboard", async () => {
    const { struct, page } = await createVisitor();
    // sign in

    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.type(email.toLowerCase());

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type(password);

    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await page.waitForTimeout(1000);

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(2000);
    await page.setViewportSize({ width: 1280, height: 720 });


    //messages
    await struct.tutorDashboard.header.notifications.chat.button.waitForVisible();
   
    //what is new
    await struct.header.notifications.tutorResources.button.waitForVisible();

    //available tutoring
    await struct.tutorDashboard.header.availableTutoring.waitForVisible();

    //past tutoring
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();

    //resources
    await struct.tutorDashboard.header.resources.waitForVisible();

    //heatmap, payment, backgroung check is not visiable
    await struct.tutorDashboard.header.heatmap.waitForHidden();
    await struct.tutorDashboard.header.earnings.waitForHidden();
    await struct.tutorDashboard.header.checkr.waitForHidden();

    //demo
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();
    // await struct.tutorDashboard.header.demoLessonSpace.click();
    // await struct.demoLessonSpace.header.exit.waitForVisible();
    // await struct.demoLessonSpace.header.exit.click();

    // help center
    await struct.tutorDashboard.header.helpCenter.waitForVisible();

    // user's menu
    await struct.tutorDashboard.header.userTools.username.waitForVisible();
    await struct.tutorDashboard.header.userTools.username.click();
    await page.waitForTimeout(1000);

    // switch should be avalable  (https://tutorme247.atlassian.net/browse/TM-2652)
    await struct.userMenu.switch.waitForVisible();
    
    //edit Profile is NOT avalable 
    await struct.userMenu.editProfile.waitForHidden();
    
    // Privacy Policy and Terms of Service links are available 
    await (await page.waitForSelector('//a[contains(text(),"Privacy Policy")]')).waitForElementState('visible');
    await (await page.waitForSelector('//a[contains(text(),"Terms of Service")]')).waitForElementState('visible');

    // edit and my account is visiable 
    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.myAccount.click();
    await page.waitForTimeout(1000);

    // change email should not available
    await struct.account.profile.changeEmail.waitForHidden();

   // my account and notification should be there
  
    await struct.account.account.waitForVisible();
    await (await page.waitForSelector('//a[contains(text(),"Notifications")]')).click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);

    await struct.account.notificationsOptions.sendDesktop.waitForVisible();
    await struct.account.notificationsOptions.sendDesktop.isChecked();

    await struct.account.notificationsOptions.missedMessages.waitForVisible();
    await struct.account.notificationsOptions.missedMessages.isChecked();

    await struct.account.notificationsOptions.sendEmails.waitForVisible();
    await struct.account.notificationsOptions.sendEmails.isChecked();

    // account menu
    await struct.tutorDashboard.header.userTools.username.click();
   

    // Privacy Policy and Terms of Service links are available 
     await (await page.waitForSelector('//a[contains(text(),"Privacy Policy")]')).waitForElementState('visible');
     await (await page.waitForSelector('//a[contains(text(),"Terms of Service")]')).waitForElementState('visible');

    //tutor signs out
    await struct.userMenu.signOut.click();
  });   
});
