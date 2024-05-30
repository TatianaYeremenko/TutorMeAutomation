import faker, { random } from "faker";
import { readFileSync } from "fs";
import { max } from "lodash";
import { number } from "zod";

describe("live lesson - ", () => {
  it("student/tutor Void Survey is available ", async () => {
    //create tutor
    const t = await createQaUser("tutor");

    // get tutor name and id
    let tutorId = t.user.id.toString();
    let name = t.user.shortName.toString();

    //select subject
    // click on Edit Profile
    await t.struct.tutorDashboard.header.userTools.username.waitForVisible();
    await t.struct.tutorDashboard.header.userTools.username.click();

    await t.struct.userMenu.editProfile.waitForVisible();
    await t.struct.userMenu.editProfile.click();

    await t.page.waitForTimeout(500);

    //check Curriculum Area
    await t.page.getByRole("link", { name: "Subjects and Skills" }).click();
    // await t.page.getByRole("link", { name: "Subjects and Skills" }).click();

    await t.page.keyboard.press("ArrowDown");
    await t.page.keyboard.press("PageDown");

    // check check-box values
    let checked = await (await t.page.waitForSelector('//div[contains(text(),"Early Math")]')).isChecked();
    if (checked == false ) { 
      await (
        await t.page.waitForSelector('//div[contains(text(),"Early Math")]')
      ).click();
    }

    // submit the changes
    await t.struct.account.subjects.save.click();
    await t.page.waitForTimeout(2000);
    await t.page.reload();

    
    //create student
    const s = await createQaUser("studentWithUmbrella");
    const studentId = "" + s.user.id.toString() + "";

    // go to browse tutors
    await s.struct.footer.browseTutors.waitForVisible();
    await s.struct.footer.browseTutors.click();
    await s.page.keyboard.down("PageDown");
    await s.page.waitForTimeout(3000);

    // find available tutor
    await s.struct.tutors.tutor(tutorId).name.waitForVisible();
    await s.struct.tutors.tutor(tutorId).card.click();

    //click on Start Lesson
    await s.struct.tutorProfile.requestLesson.waitForVisible();
    await s.struct.tutorProfile.requestLesson.click();

    // select a subject form modal
    await s.struct.modals.connectTutor.content.subjectSelect.click();
    await s.struct.modals.connectTutor.content.option(10004).option.click();
    await s.page.keyboard.press("Enter");

    await s.page
      .getByRole("combobox", { name: "Select your grade level*" })
      .click();
    await s.page.getByRole("option", { name: "1st grade" }).click();

    //Describe your question
    await s.struct.sessionRequest.description.type("test");

    // close button is avalable
    await s.struct.modals.connectTutor.content.close.waitForVisible();

    // Code of Conduct
    await s.struct.sessionRequest.codeOfConduct.check();

    // await s.page.getByTestId('modals.connectTutor.content.option(10016).option').click();
    await s.page.getByRole("button", { name: "Send session request" }).click();

    // modal pops up
    await s.struct.modals.waitingForTutor.waitForVisible();

    // tutor accepts the request
    await t.struct.modals.request.waitForVisible();
    await t.struct.modals.request.content.accept.waitForVisible();
    await t.struct.modals.request.content.accept.click();
    await t.page.waitForTimeout(1000);
    await s.page.waitForTimeout(1000);

    //tutor confirm that a new student
    t.struct.modals.firstTime.content.gotIt.waitForVisible();
    t.struct.modals.firstTime.content.gotIt.click();

    // tutor click on Pause
    await t.struct.lessonSpace.header.pause.click();

    // pop-ups appears
    await t.struct.modals.pauseLesson.waitForVisible();

    // click on Resume Lesson
    await t.struct.modals.pauseLesson.content.resume.click();

    // click on void
    await t.struct.lessonSpace.header.void.click();

    //return back to the lesson
    await t.struct.modals.voidLesson.content.returnToLesson.waitForVisible();
    await t.struct.modals.voidLesson.content.returnToLesson.click();

    // click on void again
    await t.struct.lessonSpace.header.void.click();

    // five reasons should be available
    await t.page
      .locator("label")
      .filter({ hasText: "The student’s request didn’t make sense." })
      .locator("svg")
      .click();
    await t.page
      .locator("label")
      .filter({ hasText: "The student or I had technical difficulties." })
      .locator("svg")
      .click();
    await t.page
      .locator("label")
      .filter({ hasText: "The student behaved inappropriately." })
      .locator("svg")
      .click();
    await t.page
      .locator("label")
      .filter({
        hasText:
          "The student asked for help with an exam/test/quiz (Academic Dishonesty).",
      })
      .locator("svg")
      .click();
    await t.page
      .locator("label")
      .filter({ hasText: "Other, please explain below." })
      .locator("svg")
      .click();
    await t.page.getByTestId("modals.voidLesson.content.comments").click();
    await t.page
      .getByTestId("modals.voidLesson.content.comments")
      .fill("testing here");
    await t.page.waitForTimeout(500);
    await t.page.getByRole("button", { name: "Void session" }).press("Enter");
    await t.page
      .getByTestId("tutorDashboard.header.userTools.openMenu")
      .click();
    await t.page.getByTestId("userMenu.signOut").click();
  });
});
