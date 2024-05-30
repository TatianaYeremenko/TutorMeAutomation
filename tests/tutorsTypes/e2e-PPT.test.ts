import faker, { random } from "faker";
import { product } from "../../lib/shared";

describe("E2E PPT: ", () => {
  jest.setTimeout(1000000);

  const email ='tutor.ppt@local.peardeck.com';
  const password = "PTTcheck1234!";

  it("Check PT Tutor Dashboard", async () => {
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

    // messages
    await struct.tutorDashboard.header.notifications.chat.button.waitForVisible();

    //what is new
    await struct.header.notifications.tutorResources.button.waitForVisible();

    //available tutoring
    await struct.tutorDashboard.header.availableTutoring.waitForVisible();

    //past tutoring
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();

    //resources
    await struct.tutorDashboard.header.resources.waitForVisible();

    //heatmap should be hidden
    await struct.tutorDashboard.header.heatmap.waitForHidden();

    // payment, backgroung check is not visiable
    await struct.tutorDashboard.header.earnings.waitForHidden();
    await struct.tutorDashboard.header.checkr.waitForHidden();

    //demo
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();
    await struct.tutorDashboard.header.demoLessonSpace.click();
    await struct.demoLessonSpace.header.exit.waitForVisible();
    await struct.demoLessonSpace.header.exit.click();

    // help center
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
