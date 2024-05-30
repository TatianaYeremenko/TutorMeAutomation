import faker, {
  random
} from "faker";
import {product } from "../../lib/shared"; 

it("tutor cancels all multiple requests", async () => {

    for (let i = 0; i < 15; i++) {

      // create tutor
      const t = await createQaUser('tutor');

      await t.page.waitForTimeout(1000);

      // tutor click on "live lesson
      await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
      await t.struct.tutorDashboard.header.pastTutoring.click();

      await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
      await t.struct.tutorDashboard.header.availableTutoring.click();

      //claim the lesson
      await t.page.waitForSelector('text="Claim session"');
      await t.page.click('text="Claim session"');

      await t.struct.modals.claimLesson.content.claim.waitForVisible();
      await t.struct.modals.claimLesson.content.claim.click();

      // void it

      await t.struct.modals.firstTime.content.gotIt.click();
      await t.struct.lessonSpace.header.void.click();
      await t.struct.modals.voidLesson.content.void.click();

    }
 }
);

