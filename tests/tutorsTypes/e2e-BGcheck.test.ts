import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E BGcheck: ", () => {
 jest.setTimeout(1000000);

  const email ='tutor.bg@local.peardeck.com';
  const password = "BGcheck1234!";

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

    // availableTutoring, past tutoring, earnings, heatmap, background check and resorcies should be avalable
    await struct.tutorDashboard.header.availableTutoring.waitForVisible();
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await struct.tutorDashboard.header.earnings.waitForVisible();
    await struct.tutorDashboard.header.heatmap.waitForVisible();
    await struct.tutorDashboard.header.checkr.waitForVisible();
    await struct.tutorDashboard.header.resources.waitForVisible();
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();
    await struct.tutorDashboard.header.helpCenter.waitForVisible();
    

    // on Resources page in Getting Started section only these links should be avalaible 
    await struct.tutorDashboard.header.resources.click();

    // Getting Started
    // Read the entire Tutor Handbook
    await struct.tutorDashboard.resources.handbook.waitForVisible();
    // Enable Desktop Notifications
    await struct.tutorDashboard.resources.notifications.waitForVisible();
    // Get familiar with the Demo Lesson Space
    await struct.tutorDashboard.resources.demoLessonSpace.waitForVisible();
    // Make sure your Tutor Profile and Subjects are current
    await struct.tutorDashboard.resources.tutorProfile.waitForVisible();
    // Visit the Tutor Help Center. Still need help? Contact Us
    await struct.tutorDashboard.resources.helpCenter.waitForVisible();

    //SHOUL NOT BE VISIBLE:
    await struct.tutorDashboard.resources.writingLabComments.waitForHidden();
    await struct.tutorDashboard.resources.writingLabTips.waitForHidden();
    await struct.tutorDashboard.resources.handbookWritingLab.waitForHidden();

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
