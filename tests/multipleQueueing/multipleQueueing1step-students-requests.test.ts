import faker, {
    random
  } from "faker";
import {product } from "../../lib/shared"; 

it.only("multiple students request a lesson at the same time", async () => {

    for (let i = 0; i < 5; i++) {

    //create student
    const s = await createQaUser('studentWithUmbrella');
    const studentId  = ''+  s.user.id.toString() + '';

    //connect with a tutor
    await s.struct.homepage.connectWithTutor.waitForVisible();
    await s.struct.homepage.connectWithTutor.click();

    //search for a subject
    await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
    await s.struct.homepage.mainSubjectSearch.input.type('');
    await s.struct.homepage.mainSubjectSearch.items(faker.datatype.number({max:5})).click();
    // await s.struct.homepage.mainSubjectSearch.items(faker.datatype.number(1)).click();
    await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
    await s.struct.homepage.mainSubjectSearch.input.press('Enter');
    await s.struct.homepage.mainSubjectSearch.input.press('Enter');
    await s.page.waitForTimeout(1000);

    // fill out the form
    await s.struct.modals.requestLessonForm.waitForVisible();
    const text = `Lesson submitted from ${(product.toString()).toUpperCase()} ${faker.lorem.sentence(10).toString()}`;
    await s.struct.modals.requestLessonForm.content.description.fill(text);

    // submit the request
    await s.struct.modals.requestLessonForm.content.submit.click();
    await s.page.waitForTimeout(2000);
    }
 }
);

