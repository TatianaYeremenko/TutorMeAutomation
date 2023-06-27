import faker, {
  random
} from "faker";

describe("request modal - ", () => {
  it("student can describe a problem and upload up to 3 files", async () => {

      const {
          struct,
          page
      } = await createQaUser('studentWithUmbrella');

      //connect with a tutor
      await struct.homepage.connectWithTutor.waitForVisible();
      await struct.homepage.connectWithTutor.click();

      //search for a subject
      await struct.homepage.mainSubjectSearch.search.waitForVisible();
      await struct.homepage.mainSubjectSearch.input.type('');
      await struct.homepage.mainSubjectSearch.items(1).click();
      await struct.homepage.mainSubjectSearch.input.press('Enter');
      await page.waitForTimeout(1000);


      //requestHeader

      // fill out the Describe Problem form with a few words
      // await struct.modals.requestLessonForm.waitForVisible();
      await struct.modals.requestLessonForm.content.description.type(faker.lorem.sentence(5));
      await page.waitForTimeout(500);
      await page.waitForLoadState();


      //upload files and submit request 
      const fileExamples = ['./lib/files/example_1.gif', './lib/files/example_2.jpeg', './lib/files/example_3.gif'];
      await struct.modals.requestLessonForm.content.addFiles.waitForVisible();
      await struct.modals.requestLessonForm.content.addFiles.selectFiles(fileExamples);

      //submit request 
      await struct.modals.requestLessonForm.content.submit.click();

      //check validation message for the input field
      await struct.modals.requestLessonForm.content.descError.waitForVisible();
      expect(await struct.modals.requestLessonForm.content.descError.text()).toBe('Please describe your problem in a minimum of 50 characters')

      // fill out the Describe Problem form correctly
      await struct.modals.requestLessonForm.waitForVisible();
      await struct.modals.requestLessonForm.content.description.fill(faker.lorem.sentence(15));

      //submit request 
      await struct.modals.requestLessonForm.content.submit.click();

      // cancel the request
      await struct.modals.notifyingTutors.waitForVisible();
      await struct.modals.notifyingTutors.content.cancel.click();

      // confirm the cancellation and then keep searching
      await struct.modals.confirmCancel.waitForVisible();
      await struct.modals.confirmCancel.content.cancel.click();
     


  });
});