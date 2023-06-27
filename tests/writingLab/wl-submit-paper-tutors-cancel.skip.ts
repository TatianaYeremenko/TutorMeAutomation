import faker, {
    random
  } from "faker";


  import * as fs from "fs";
  import { Alignment, Document, Packer, Paragraph, TextRun } from "docx";
  import {product } from "../../lib/shared";  

describe('WL:', function(){
    let  pastId = '';
    
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
 

it('Umbrella student submits the paper from '+product.toString().toUpperCase()+ ' and check the past records', async () => {
    const {
        page,
        struct
    } = await createQaUser('studentWithUmbrella');

    await struct.homepage.writingLab.waitForVisible();
    await struct.homepage.writingLab.click();

    // modal pop-up
    await struct.modals.writingLab.content.predropoff.waitForVisible();
    await struct.modals.writingLab.content.predropoff.content.understand.waitForVisible();
    await struct.modals.writingLab.content.predropoff.content.understand.click();

    await page.waitForTimeout(200);

    // check the validation message for required fields
    // empty title
    await struct.modals.writingLab.content.title.waitForVisible();
    await struct.modals.writingLab.content.title.fill(' ');


    // empty description
    await struct.modals.writingLab.content.description.waitForVisible();
    await struct.modals.writingLab.content.description.fill(' ');

    // check nativeEnglish box
    await struct.modals.writingLab.content.nativeEnglish.waitForVisible();
    await struct.modals.writingLab.content.nativeEnglish.click();

    // validation messages
    await struct.modals.writingLab.content.titleError.waitForVisible();
    expect(await struct.modals.writingLab.content.titleError.text()).toBe('Give your paper a title');
    // console.log(await struct.modals.writingLab.content.titleError.text());

    await struct.modals.writingLab.content.descriptionError.waitForVisible();
    expect(await struct.modals.writingLab.content.descriptionError.text()).toBe('Give the tutor some intro about your paper');
    // console.log(await struct.modals.writingLab.content.descriptionError.text());

    // check title input validation
    await struct.modals.writingLab.content.title.clear();
    await struct.modals.writingLab.content.title.fill(faker.lorem.words(20).toString());

    // type WL description
    await struct.modals.writingLab.content.description.clear();
    await struct.modals.writingLab.content.description.fill(faker.lorem.words(80).toString());

    // check nativeEnglish box
    await struct.modals.writingLab.content.nativeEnglish.waitForVisible();
    await struct.modals.writingLab.content.nativeEnglish.click(); 

    // message appears
    expect(await struct.modals.writingLab.content.titleError.text()).toBe('Maximum 100 characters');
    // console.log(await struct.modals.writingLab.content.titleError.text());

    // message appears
    expect(await struct.modals.writingLab.content.descriptionError.text()).toBe('Maximum 500 symbols');
    // console.log(await struct.modals.writingLab.content.descriptionError.text());

    const title = `Title: submitted from ${(process.env.PLAYWRIGHT_PRODUCT?.toString().toUpperCase())} ${faker.lorem.words(2).toString()}`;
    // const title = `Title: submitted from ${(product.toString().toUpperCase())} ${faker.lorem.words(2).toString()}`;
    await struct.modals.writingLab.content.title.clear();
    await struct.modals.writingLab.content.title.type(title);
    await struct.modals.writingLab.content.description.clear();
    await struct.modals.writingLab.content.description.fill("Description: "+ faker.lorem.words(40).toString());


    // check nativeEnglish box
    await struct.modals.writingLab.content.nativeEnglish.waitForVisible();
    await struct.modals.writingLab.content.nativeEnglish.click();
    await struct.modals.writingLab.content.nativeEnglish.isChecked();
    await struct.modals.writingLab.content.nativeEnglish.click();
    await struct.modals.writingLab.content.nativeEnglish.uncheck();
    await struct.modals.writingLab.content.nativeEnglish.click();
    
    // click on Next
    await struct.modals.writingLab.content.next.waitForVisible();
    await struct.modals.writingLab.content.next.click();

    await page.waitForTimeout(1000);

    // check Paper Style
    await struct.modals.writingLab.content.paperStyle(0).waitForVisible();
    await struct.modals.writingLab.content.paperStyle(faker.datatype.number(2)).click();
    // await page.locator('//div[@aria-label="Not Applicable"]').check();

    // click on Next
    await struct.modals.writingLab.content.next.waitForVisible();
    await struct.modals.writingLab.content.next.click();

    // // submit without the file 
    // // click on Submit
    // await struct.modals.writingLab.content.submit.waitForVisible();
    // await struct.modals.writingLab.content.submit.click();

    // // message displays
    // await struct.modals.writingLab.content.fileError.waitForVisible();
    // expect(await struct.modals.writingLab.content.fileError.text()).toBe('Oops! You forgot to upload a file!');
   
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

    //click on User Past Lesson
    await struct.header.userTools.avatar.click();
    await struct.userMenu.pastLessons.waitForVisible();
    await struct.userMenu.pastLessons.click();

    await page.waitForTimeout(1000);

    // go to Writing Tab
    await struct.account.pastLessons.writing.link.waitForVisible();
    await struct.account.pastLessons.writing.link.click();

    // Wl is visible in Past WL
    const element = page.locator('text="Pending..."');
    const wlId =  await element.getAttribute('data-testid');
    pastId = ''+  wlId?.slice(-5,-1)+ '';
    // console.log(pastId);

    // WL title and date is visible
    await struct.account.pastLessons.writing.title(pastId).waitForVisible();
    expect(await struct.account.pastLessons.writing.title(pastId).text()).toBe(title);

    await struct.account.pastLessons.writing.date(pastId).waitForVisible();
    // console.log(await struct.account.pastLessons.writing.date(pastId).text());

});

});