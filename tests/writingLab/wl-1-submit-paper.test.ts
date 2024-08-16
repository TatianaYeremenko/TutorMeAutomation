import faker, { date, random } from "faker";
import { env } from "process";
import * as fs from "fs";
import { Alignment, Document, Packer, Paragraph, TextRun } from "docx";

describe("WL test", function () {
  function createDoc(wordsNums: number, docUrl: string) {
    //This function creates a .dosc file with different numbers words and saves it in the files folder
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("Creating Document"),
                new TextRun({
                  text: faker.lorem.words(wordsNums),
                  bold: true,
                }),
                new TextRun({
                  text: "\tDone",
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });
    // Used to export the file into a .docx file
    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(docUrl, buffer);
    });
  }

  // prepare valid and invalid paper
  let valid = createDoc(500, "./lib/files/myDoc.docx");
  let invalid = createDoc(10, "./lib/files/invalidDoc.docx");

  // discription of wl
  let wlDiscription =  "Description: " + faker.lorem.words(40).toString();
  let title = `Title: submitted from automation ${faker.lorem.words(1).toString()}`;


  it("Umbrella student submits WL and check the past records", async () => {
    const { page, struct } = await createQaUser("studentWithUmbrella");

    await struct.homepage.writingLab.waitForVisible();
    await struct.homepage.writingLab.click();
    //   await page.getByRole('button', { name: 'Submit your writing assignment' }).click();

    // modal pop-up
    await struct.modals.writingLab.content.goBack.waitForVisible();
    await struct.modals.writingLab.content.next.waitForVisible();

    await struct.modals.writingLab.content.next.click();
    await page.waitForTimeout(200);

    // check the validation message for required fields
    // empty title
    await struct.modals.writingLab.content.title.waitForVisible();
    await struct.modals.writingLab.content.title.type("");

    // empty description
    await struct.modals.writingLab.content.description.waitForVisible();
    await struct.modals.writingLab.content.description.type("");

    // Next should not be visiable
    await page.getByTestId("modals.writingLab.content.next").isHidden();

    //Close page button is visiable
    await struct.modals.writingLab.content.close.waitForVisible();

    // check title input validation
    await struct.modals.writingLab.content.title.fill(
      faker.lorem.words(20).toString()
    );

    // type WL description
    await struct.modals.writingLab.content.description.fill(
      faker.lorem.words(160).toString()
    );

    // message appears
    expect(await struct.modals.writingLab.content.titleError.text()).toBe(
      "The maximum characters for this field is 100 characters."
    );
    expect(await struct.modals.writingLab.content.descriptionError.text()).toBe(
      "The maximum characters for this field is 1,000 characters."
    );

    // enter valid data
    await struct.modals.writingLab.content.title.clear();
    await struct.modals.writingLab.content.title.fill(title);
    await struct.modals.writingLab.content.description.clear();
    await struct.modals.writingLab.content.description.fill(wlDiscription);

    // click on Next
    await struct.modals.writingLab.content.next.waitForVisible();
    await struct.modals.writingLab.content.next.click();

    await page.waitForTimeout(1000);

    // check Paper Style
    await page.getByText("APA (American Psychological Association)").click();

    // click on Next
    await struct.modals.writingLab.content.next.click();
    await page.waitForTimeout(1000);

    // upload invalid file
    
    await page.locator('//span[contains(text(),"Upload a Microsoft Word (.docx) file")]').check();
    // await page.setInputFiles('//input[@aria-label="Upload a Microsoft Word (.docx) file"]', "lib/files/invalidDoc.docx" );

    await struct.modals.writingLab.content.fileInput.selectFiles(
      "lib/files/invalidDoc.docx"
    );
    await page.waitForTimeout(1000);

    // error should be dispalyed
    expect(await struct.modals.writingLab.content.fileError.text()).toBe('Document must be more than 500 characters.');
    await struct.modals.writingLab.content.file("fileUpload-1").remove.click();

    // upload file
    await struct.modals.writingLab.content.fileInput.selectFiles(
      "lib/files/myDoc.docx"
    );
    await page.waitForTimeout(2000);

    //check estimation
    await struct.modals.writingLab.content.characters.waitForVisible();
    await struct.modals.writingLab.content.estimatedTime.waitForVisible();
    await struct.modals.writingLab.content.timeEstimate.waitForVisible();

    // click on Submit
    await struct.modals.writingLab.content.submit.waitForVisible();
    await struct.modals.writingLab.content.submit.click();
    await page.waitForTimeout(1000);

    //click on the link Code of Conduct
    const [pageHonorCode] = await Promise.all([
      page.waitForEvent("popup"),
      struct.modals.writingLab.content.honorCode.click(),
    ]);
    expect(pageHonorCode.url()).toContain(
      "https://www.peardeck.com/policies/pear-deck-tutor-code-of-conduct"
    );
    await pageHonorCode.close();

    // click on Submit
    await struct.modals.writingLab.content.submit.waitForVisible();
    await struct.modals.writingLab.content.submit.click();
    await page.waitForTimeout(1000);

    // click on Return Home
    await struct.modals.writingLab.content.returnToHomepage.waitForVisible();
    await struct.modals.writingLab.content.returnToHomepage.click();
    await page.waitForTimeout(1000);

    //click on User Usage again
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.myAccount.click();
    await struct.account.usage.click();

    // check the Limit again
    await struct.account.usageDetails.remaining.waitForVisible();
    expect(await struct.account.usageDetails.remaining.text()).toBe(
      "470/500 minutes remaining"
    );

    //click on User Past Lesson
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.pastLessons.waitForVisible();
    await struct.userMenu.pastLessons.click();

    await page.waitForTimeout(1000);

    // go to Writing Tab
    await struct.account.pastLessons.writing.link.waitForVisible();
    await struct.account.pastLessons.writing.link.click();

    // Wl is visible in Past WL
    const element = page.locator('text="Pending..."');
    const wlId = await element.getAttribute("data-testid");
    let pastId: string = "" + wlId?.replace(/\D/g, "") + ""; //exctract numbers only
    // console.log(pastId);

    // WL title and date is visible
    await struct.account.pastLessons.writing.title(pastId).waitForVisible();
    expect(await struct.account.pastLessons.writing.title(pastId).text()).toBe(
      title
    );

    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.click();
  });  
});
