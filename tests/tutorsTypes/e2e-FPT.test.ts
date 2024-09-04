import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E FPT: ", () => {
 jest.setTimeout(1000000);

 const email ='tutor.fp@local.peardeck.com';
 const password = "FPcheck1234!";

 it("Check FP Tutor Dashboard", async () => {
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

    // check all tutoring avalability, past tutorin, earnings, heatmap, background check and resorcies 
    await struct.tutorDashboard.header.availableTutoring.waitForVisible();
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await struct.tutorDashboard.header.earnings.waitForVisible();
    await struct.tutorDashboard.header.heatmap.waitForVisible();
    await struct.tutorDashboard.header.checkr.waitForVisible();
    await struct.tutorDashboard.header.resources.waitForVisible();
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();
    await struct.tutorDashboard.header.helpCenter.waitForVisible();

    // account menu
    await struct.tutorDashboard.header.userTools.username.click();

    // My Account should be visiable
    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.editProfile.waitForVisible();
    await struct.userMenu.switch.waitForVisible();    

    // Privacy Policy and Terms of Service links are available 
     await (await page.waitForSelector('//a[contains(text(),"Privacy Policy")]')).waitForElementState('visible');
     await (await page.waitForSelector('//a[contains(text(),"Terms of Service")]')).waitForElementState('visible');

    //tutor signs out
    await struct.userMenu.signOut.click();
  });
});
