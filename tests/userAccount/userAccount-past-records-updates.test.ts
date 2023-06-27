import faker, {
    random
  } from "faker";


  import * as fs from "fs";
  import { Alignment, Document, Packer, Paragraph, TextRun } from "docx";
  
  // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
  // This simple example will only contain one section
  const doc = new Document({
      sections: [{
          properties: {},
          children: [
              new Paragraph({
                  children: [
                      new TextRun("Creating Document"),
                      new TextRun({
                          text: faker.lorem.sentence(500),
                          bold: true,
                      }),
                      new TextRun({
                          text: "\tDone",
                          bold: true,
                      }),
                  ],
              }),
          ],
      }],
  });
  
  // Used to export the file into a .docx file
  Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync("./lib/files/myDoc.docx", buffer);
  });  

it('Student submits WL and records get updated', async () => {
    const {
        page,
        struct
    } = await createQaUser('studentWithUmbrella');

    //click on User Usage
    await struct.header.userTools.avatar.click();
    await struct.userMenu.usage.waitForVisible();
    await struct.userMenu.usage.click();
    
    // check the Limit
    await struct.account.usageDetails.remaining.waitForVisible();
    expect(await struct.account.usageDetails.remaining.text()).toBe('3000/3000 minutes remaining');
    // console.log(await struct.account.usageDetails.remaining.text());

    // check reset date 
    await struct.account.usageDetails.resets.waitForVisible();
    const resetDate = (await struct.account.usageDetails.resets.text()).toString();
    // const tranResetDate = resetDate.slice(0,3) + " " + resetDate.slice(9,11) + " " +resetDate.slice(-12,-8);
    // console.log("Reset Day Week",tranResetDate.toString());

    // next monday calculation
    const date = new Date;
    const nextWeekFrom = new Date(date.setDate(date.getDate() - date.getDay() + 8)).toString();

    console.log(resetDate);
    // console.log(nextWeekFrom);
    // console.log("Tran",tranResetDate);
    await page.waitForTimeout(200);
    console.log("Next Week",nextWeekFrom.slice(4, 15));

    expect(nextWeekFrom.toString()).toContain((nextWeekFrom.slice(4, 15)).toString());


    // submit WL paper
    await struct.header.logo.waitForVisible();
    await struct.header.logo.click();

    await struct.homepage.writingLab.waitForVisible();
    await struct.homepage.writingLab.click();

    // modal pop-up
    await struct.modals.writingLab.content.predropoff.waitForVisible();
    await struct.modals.writingLab.content.predropoff.content.understand.waitForVisible();
    await struct.modals.writingLab.content.predropoff.content.understand.click();

    await page.waitForTimeout(1000);

    // type WL title
    await struct.modals.writingLab.content.logo.waitForVisible();
    await struct.modals.writingLab.content.title.clear();

    //
    const title = faker.lorem.sentence(2).toString();
    await struct.modals.writingLab.content.title.fill(title);
    // console.log(title.toString());

    // type WL description
    await struct.modals.writingLab.content.description.waitForVisible();
    await struct.modals.writingLab.content.description.fill(faker.lorem.sentence(3));

    // check nativeEnglish box
    await struct.modals.writingLab.content.nativeEnglish.waitForVisible();
    await struct.modals.writingLab.content.nativeEnglish.click();

    // click on Next
    await struct.modals.writingLab.content.next.waitForVisible();
    await struct.modals.writingLab.content.next.click();

    await page.waitForTimeout(1000);

    // check Paper Style
    await struct.modals.writingLab.content.paperStyle(2).waitForVisible();
    await struct.modals.writingLab.content.paperStyle(2).click();
    // await page.locator('//div[@aria-label="Not Applicable"]').check();

    // click on Next
    await struct.modals.writingLab.content.next.waitForVisible();
    await struct.modals.writingLab.content.next.click();

    // write to js file
    // const filePath = './lib/files/file_111.docx'

    //upload file 
    const fileExample = ['./lib/files/myDoc.docx'];
    // await struct.modals.writingLab.content.fileBrowse.waitForVisible();
    // await struct.modals.writingLab.content.fileBrowse.click();
    await struct.modals.writingLab.content.fileInput.selectFiles(fileExample);
    await page.waitForTimeout(1000);


    // click on Submit
    await struct.modals.writingLab.content.submit.waitForVisible();
    await struct.modals.writingLab.content.submit.click();

    await page.waitForTimeout(1000);
 
    // click on Return Home
    await struct.modals.writingLab.content.returnToHomepage.waitForVisible();
    await struct.modals.writingLab.content.returnToHomepage.click();

    await page.waitForTimeout(1000);

    //click on User Usage again
    await struct.header.userTools.avatar.click();
    await struct.userMenu.usage.waitForVisible();
    await struct.userMenu.usage.click();    

    // check the Limit again
    await struct.account.usageDetails.remaining.waitForVisible();
    expect(await struct.account.usageDetails.remaining.text()).toBe('2970/3000 minutes remaining');

    //click on User Past Lesson
    await struct.header.userTools.avatar.click();
    await struct.userMenu.pastLessons.waitForVisible();
    await struct.userMenu.pastLessons.click();

    await page.waitForTimeout(1000);

    // go to Writing Tab
    await struct.account.pastLessons.writing.link.waitForVisible();
    await struct.account.pastLessons.writing.link.click();
    await page.waitForTimeout(1000);

    // Wl is visible in Past WL
    const element = page.locator('text="Pending..."');
    const wlId =  (await element.getAttribute('data-testid'))?.toString();
    console.log(wlId);

    const pastId = ''+  wlId?.slice(-5,-1)+ '';
    console.log(pastId);

    // WL title and date is visible
    await page.waitForTimeout(500);

    await struct.account.pastLessons.writing.title(pastId).waitForVisible();
    console.log(await struct.account.pastLessons.writing.title(pastId).text());

    expect(await struct.account.pastLessons.writing.title(pastId).text()).toBe(title);

    await struct.account.pastLessons.writing.date(pastId).waitForVisible();
    // console.log(await struct.account.pastLessons.writing.date(pastId).text());

    // 3 different tutors cancel WL

    for (let i = 0; i < 3; i++) {

        // create tutor
        const t = await createQaUser('tutor');

        // tutor click on "live lesson
        await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
        await t.struct.tutorDashboard.header.pastTutoring.click();

        // click on Available Ones
        await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
        await t.struct.tutorDashboard.header.availableTutoring.click();
        await t.page.waitForTimeout(3000);

        // click on WL

        await t.struct.tutorDashboard.dashboard.writingLab(pastId).claim.waitForVisible();
        await t.struct.tutorDashboard.dashboard.writingLab(pastId).claim.click();


        // click on Claim
        await t.struct.modals.writingLabClaim.content.claim.waitForVisible();
        await t.struct.modals.writingLabClaim.content.claim.click();

        // cancel
        await t.struct.tutorDashboard.inProgress(pastId).cancel.waitForVisible();
        await t.struct.tutorDashboard.inProgress(pastId).cancel.click();

        await t.page.waitForTimeout(3000);

        // pick the reason
        await t.struct.modals.writingLabCancel.content.reason(0).waitForVisible();
        await t.struct.modals.writingLabCancel.content.reason(0).click();

        // cancel
        await t.struct.modals.writingLabCancel.content.yesCancel.waitForVisible();
        await t.struct.modals.writingLabCancel.content.yesCancel.click();

        await t.page.waitForTimeout(1000);

        //tutor signs out
        await t.page.close();
    }

        //click on my Account and Sign Out
        await struct.header.userTools.avatar.click();
        await struct.userMenu.signOut.click();


});

