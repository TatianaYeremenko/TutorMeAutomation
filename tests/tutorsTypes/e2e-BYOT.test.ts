import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E BYOT: ", () => {
 jest.setTimeout(1000000);

 const email ='tutor.byot@local.peardeck.com';
 const password = "BYOTcheck1234!";

 it("Check Tutor Dashboard", async () => {
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

    //CHECK DASHBOARD HERE:
    //https://tutorme247.atlassian.net/browse/TM-1175

    // check if the earning is not visible
    await struct.tutorDashboard.header.earnings.waitForHidden();

    // check if the Background Check and HeatMap is not visible
    await struct.tutorDashboard.header.checkr.waitForHidden();
    await struct.tutorDashboard.header.heatmap.waitForHidden();
    await page.waitForTimeout(1000);
        
    // check if the everything elase is avalble
    await struct.tutorDashboard.header.resources.waitForVisible();
    await struct.tutorDashboard.header.resources.click();
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await struct.tutorDashboard.header.pastTutoring.click();
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();

    await struct.tutorDashboard.header.userTools.username.click();

    await struct.userMenu.privacyPolicy.waitForVisible();
    await struct.userMenu.terms.waitForVisible();
    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.editProfile.waitForVisible();
    await struct.userMenu.switch.waitForVisible();

    //tutor signs out
    await struct.userMenu.signOut.click();

  }); 
});
