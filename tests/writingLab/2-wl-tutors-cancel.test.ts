import faker, {
    random
  } from "faker";

  it('Three different tutors cancel WL', async () => {

    // 3 different tutors cancel WL

    for (let i = 0; i < 3; i++) {

        // create tutor
        const t = await createQaUser('tutor');

        // tutor click on "live lesson
        await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
        await t.struct.tutorDashboard.header.pastTutoring.click();

        await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
        await t.struct.tutorDashboard.header.availableTutoring.click();

        await (await t.page.waitForSelector('text="Writing Lab"')).click();


        // click on Claim
        await t.struct.modals.writingLabClaim.content.claim.waitForVisible();
        await t.struct.modals.writingLabClaim.content.claim.click();

        // cancel
        // await t.page.waitForSelector('text="Review & Download"');
        // await t.page.click('text="Close"');
        await t.page.waitForTimeout(1000);

        await t.page.waitForSelector('text="Review & Download"');
        await t.page.waitForSelector('text="Upload"');
        await (await t.page.waitForSelector('text="Cancel"')).click();
        await t.page.waitForTimeout(500);


        // pick the reason
        // await t.struct.modals.writingLabCancel.content.reason(faker.datatype.number(4)).waitForVisible();
        await t.struct.modals.writingLabCancel.content.reason(faker.datatype.number(3)).click();

        // cancel
        await t.struct.modals.writingLabCancel.content.yesCancel.waitForVisible();
        await t.struct.modals.writingLabCancel.content.yesCancel.click();

        await t.page.waitForTimeout(500);

    }

});

