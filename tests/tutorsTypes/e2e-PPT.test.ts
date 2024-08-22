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
  it("Part-Time Tutor are able to connect with a K-12 student", async () => {
    // create tutor
    const t = await createVisitor();

    // create tutor
    const s = await createQaUser('studentWithUmbrella');

     // the tutor signs in
    await t.struct.authPages.signIn.email.waitForVisible();
    await t.struct.authPages.signIn.email.fill(email.toLowerCase());

    await t.struct.authPages.signIn.password.waitForVisible();
    await t.struct.authPages.signIn.password.type(password);

    await t.page.waitForTimeout(2000);
    await fillRecaptcha(t.struct.authPages.signIn.recaptcha);
    await t.page.waitForTimeout(1000);

    await t.struct.authPages.signIn.signIn.waitForVisible();
    await t.struct.authPages.signIn.signIn.click();
    await t.page.waitForTimeout(3000);

    // submit the request
    await s.struct.homepage.requestATutor.waitForVisible();
    await s.struct.homepage.requestATutor.click();

    await s.page.locator('label').filter({ hasText: '5th grade' }).click();
    await s.struct.sessionRequest.nextArrow.click();
  
    await s.page.locator('label').filter({ hasText: 'Other' }).click();
    await s.struct.sessionRequest.nextArrow.click();
  
    await s.page.locator('label').filter({ hasText: 'Music' }).click();
    await s.struct.sessionRequest.nextArrow.click();
    
    let student_disc = 'automation testing K-12 student requests the tutoring and connects to Part-Time tutor';

    await s.page.getByTestId('sessionRequest.description').click();
    await s.page.getByTestId('sessionRequest.description').fill(student_disc);
    await s.page.waitForTimeout(2000);

    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(1000);

    await s.page.locator('label').filter({ hasText: 'I am so lost' }).click();

    await s.page.locator('label').filter({ hasText: 'Audio only' }).click();
    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(1000);    

    // move to the confirmation page
    await s.struct.sessionRequest.codeOfConduct.click();
    await s.struct.sessionRequest.requestTutor.click();
    await s.page.waitForTimeout(1000);

    // a tutor get in the queue
    await t.page.locator('//button[@aria-label="Enter the queue? off"]').click();
    await t.page.waitForTimeout(5000);

    //tutor review the request claims it
    await t.struct.modals.claimLesson.content.claim.waitForVisible();
    await t.struct.modals.claimLesson.content.claim.click();
    await t.page.waitForTimeout(1000);

    await t.struct.modals.firstTime.content.gotIt.waitForVisible();
    await t.struct.modals.firstTime.content.gotIt.click();
    await t.page.waitForTimeout(10000);


    // student ends the lesson
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();

    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();

    await s.struct.modals.somethingWentWrong.content.browseTutors.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.browseTutors.click();

    // click on user menu
    await s.struct.header.userTools.username.click();
    await s.struct.userMenu.signOut.click();

    //tutor return to the dashboard
    await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await t.struct.modals.somethingWentWrong.content.goToDashboard.click();
    await t.page.waitForTimeout(1000);    

    //tutor signs out
    await t.struct.tutorDashboard.header.userTools.username.click();
    await t.struct.userMenu.signOut.click();
  });
});

