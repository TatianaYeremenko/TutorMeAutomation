import faker, {
    random
  } from "faker";
import {product } from "../../lib/shared"; 

it("tutor cancels all multiple requests", async () => {

    for (let i = 0; i < 5; i++) {

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
      
      //tutor is in the waiting room
      await t.page.waitForTimeout(1000);

      // tutor cancel the request
      await t.struct.waitingRoom.cancel.waitForVisible();
      await t.struct.waitingRoom.cancel.click();

      // select  reason "other"
      await t.struct.modals.waitingRoomUnassign.content.reason(6).waitForVisible();
      await t.struct.modals.waitingRoomUnassign.content.reason(6).click();

      // enter reason
      await t.struct.modals.waitingRoomUnassign.content.comments.waitForVisible();
      await t.struct.modals.waitingRoomUnassign.content.comments.fill('cleaning up');

      //cancel
      await t.struct.modals.waitingRoomUnassign.content.cancel.waitForVisible();
      await t.struct.modals.waitingRoomUnassign.content.cancel.click();

      //tutor signs out
      await t.struct.tutorDashboard.header.userTools.username.click();
      await t.struct.userMenu.signOut.click();      // student signs out

    }
 }
);

