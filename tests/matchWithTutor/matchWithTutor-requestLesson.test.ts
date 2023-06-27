import faker, {
    random
  } from "faker";
import {product } from "../../lib/shared";  

    it("student requests a lesson", async () => {

      //create student
      const s = await createQaUser('studentWithUmbrella');
      const studentId  = ''+  s.user.id.toString() + '';

      //connect with a tutor
      await s.struct.homepage.connectWithTutor.waitForVisible();
      await s.struct.homepage.connectWithTutor.click();

      //search for a subject
      await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
      await s.struct.homepage.mainSubjectSearch.input.type('');
      await s.struct.homepage.mainSubjectSearch.items(faker.datatype.number({max:10})).click();
      await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
      await s.struct.homepage.mainSubjectSearch.input.press('Enter');
      await s.struct.homepage.mainSubjectSearch.input.press('Enter');
      await s.page.waitForTimeout(1000);
      await s.page.waitForLoadState();

      // fill out the form
      // await s.struct.modals.requestLessonForm.waitForVisible();
      const text = `Lesson submitted from ${(product.toString()).toUpperCase()} ${faker.lorem.sentence(10).toString()}`;
      await s.struct.modals.requestLessonForm.content.description.type(text);

      //upload files and submit request 
      const examplesFile = ['./lib/files/example_1.gif', './lib/files/example_3.gif', './lib/files/example_3.gif']
      await s.struct.modals.requestLessonForm.content.addFiles.selectFiles(examplesFile);
      await s.struct.modals.requestLessonForm.content.submit.click();
      await s.page.waitForTimeout(1000);

      await s.struct.modals.notifyingTutors.content.cancel.waitForVisible();
      await s.struct.modals.notifyingTutors.content.cancel.click();
      await s.page.waitForTimeout(1000);


      await s.struct.modals.confirmCancel.content.cancel.waitForVisible();
      await s.struct.modals.confirmCancel.content.cancel.click();

    });
