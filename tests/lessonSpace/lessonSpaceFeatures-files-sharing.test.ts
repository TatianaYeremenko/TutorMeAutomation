import faker, { random } from "faker";
import { any } from "zod";

describe("live lesson - ", () => {
  it("student/tutor Lesson Tools: File Sharing is available for both student and tutor and both can share files", async () => {
    const s = await createQaUser("studentWithUmbrella");

    //connect with a tutor
    await s.struct.homepage.requestATutor.waitForVisible();
    await s.struct.homepage.requestATutor.click();

    await s.page.locator('label').filter({ hasText: '5th grade' }).click();
    await s.struct.sessionRequest.nextArrow.click();
  
    await s.page.locator('label').filter({ hasText: 'Math' }).click();
    await s.struct.sessionRequest.nextArrow.click();
  
    await s.page.locator('label').filter({ hasText: 'Basic Math' }).click();
    await s.struct.sessionRequest.nextArrow.click();
  
    await s.page.getByTestId('sessionRequest.description').click();
    await s.page.getByTestId('sessionRequest.description').fill('If y(x-1)=z then x=');
    await s.page.waitForTimeout(2000);

    // add files
    const fileExamples = [
      "./lib/files/example_1.gif",
      "./lib/files/example_2.jpeg",
      "./lib/files/example_3.gif",
    ];

    await s.struct.sessionRequest.uploadFile.input.click();
    await s.struct.sessionRequest.uploadFile.input.selectFiles(fileExamples[0]);
    await s.page.waitForTimeout(1000);

    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(1000);

    // await s.page.locator('//div/p[contains(text(),"I am so lost")]').clear();
    await s.page.locator('label').filter({ hasText: 'I am so lost' }).click();
    // await s.struct.sessionRequest.nextArrow.click();

    await s.page.locator('label').filter({ hasText: 'Audio only' }).click();
    await s.struct.sessionRequest.nextArrow.click();

    // move to the confirmation page
    await s.struct.sessionRequest.codeOfConduct.click();
    await s.struct.sessionRequest.requestTutor.click();
    await s.page.waitForTimeout(1000);

    const t = await createQaUser("tutor");
    await t.page.waitForTimeout(2000);

    // tutor click on "live lesson
    await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await t.struct.tutorDashboard.header.pastTutoring.click();

    await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
    await t.struct.tutorDashboard.header.availableTutoring.click();

    await t.page.waitForSelector('text="Claim session"');
    await t.page.click('text="Claim session"');
    await t.page.waitForTimeout(1000);

    // claim the lesson
    await (await t.page.waitForSelector('//button[contains(text(),"Claim session")]')).click();
    
    //student enter the lesson
    await s.struct.waitingRoom.enterLesson.waitForVisible();
    await s.struct.waitingRoom.enterLesson.click();
    await s.page.waitForTimeout(1000);

    //tutor confirm that a new student
    const new_student = await t.page.waitForSelector('text="Got it"');
    await new_student.click();

    // student click on File Sharing
    await s.struct.lessonSpace.fileUpload.click();
    await s.struct.lessonSpace.documents.dropTarget.waitForVisible();
    await s.page.waitForTimeout(500);

    //upload files and submit request
    await s.struct.lessonSpace.documents.uploadInput.selectFiles(
      fileExamples[1]
    );

    // tutor click on File Sharing
    await t.struct.lessonSpace.fileUpload.click();
    await t.page.waitForTimeout(500);

    // tutor click on File Sharing
    expect(
      (await t.struct.lessonSpace.documents.tutorFiles(0).name.text()).slice(
        0,
        9
      )
    ).toBe("example_1");
    expect(
      (await t.struct.lessonSpace.documents.tutorFiles(1).name.text()).slice(
        0,
        9
      )
    ).toBe("example_2");

    await t.struct.lessonSpace.documents
      .tutorFiles(0)
      .download.waitForVisible();
    await t.page.waitForTimeout(2000);

    //end the lesson
    await t.struct.lessonSpace.header.end.waitForHidden();
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();

    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.cancel.waitForVisible();
    await s.struct.modals.endLesson.content.close.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();

    //student return to the dashboard
    await s.struct.modals.somethingWentWrong.content.browseTutors.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.browseTutors.click();
    await s.page.waitForTimeout(2000);

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
