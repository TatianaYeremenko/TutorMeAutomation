import faker, {
    random
  } from "faker";

import {product } from "../../lib/shared";   

describe('Request a Quote form ', () => {
    it('can be submited from header with all fields required fields', async () => {
        const {
            struct,
            page
        } = await createVisitor();

        //click on "Request a Quote" form
        await struct.header.requestAQuote.waitForVisible();
        await struct.header.requestAQuote.click();
  
        // Check Title and H1
        expect(await page.title()).toBe('TutorMe - Online Tutoring | On-Demand Homework Help | Test Prep Courses');
        expect(await page.innerText('h1')).toBe('Request a Quote');

        // Check Page Discription
        expect(await page.innerText('p')).toBe('Ready to support your students – and your educators – with 24/7, on-demand online tutoring? Contact us today to schedule a demo, request a quote, and get started.');
        // console.log(await page.innerText('p'));

        let FirstName = faker.name.firstName();
        let LastName = faker.name.lastName();

        // Enter First Name
        await struct.requestAQuote.firstName.waitForVisible();
        await struct.requestAQuote.firstName.type(FirstName);

        // Enter Last Name
        await struct.requestAQuote.lastName.waitForVisible();
        await struct.requestAQuote.lastName.type(LastName);

        // Enter Email
        await struct.requestAQuote.email.waitForVisible();
        await struct.requestAQuote.email.type(`${FirstName.toLowerCase()}${LastName.toLowerCase()}test@local.tutorme.com`);
  
        // Enter Title
        await struct.requestAQuote.title.waitForVisible();
        await struct.requestAQuote.title.type("Request submitted from " + product + " ");

        // Enter School
        await struct.requestAQuote.schooolName.waitForVisible();
        await struct.requestAQuote.schooolName.type("Union");

        // Enter City
        await struct.requestAQuote.city.waitForVisible();
        await struct.requestAQuote.city.type(faker.address.city()); 

        // Enter State
        // await struct.requestAQuote.state.waitForVisible();
        // await struct.requestAQuote.state.fill(''); 
        const state = await page.waitForSelector('//input[@placeholder="State*"]');
        await state.type('California');
        await state.press('ArrowDown');
        await state.press('Enter');      

        // Enter Number
        await struct.requestAQuote.phone.waitForVisible();
        await struct.requestAQuote.phone.type('123456789012345'); 

        // Enter Student Number
        await struct.requestAQuote.numberStudents.waitForVisible();
        await struct.requestAQuote.numberStudents.type('100'); 

        // Enter Source
        await struct.requestAQuote.source.waitForVisible();
        await struct.requestAQuote.source.type(faker.company.companyName()); 

        // Enter Comments
        await struct.requestAQuote.comments.waitForVisible();
        await struct.requestAQuote.comments.type(faker.lorem.sentence(1)); 
     
        // Click on Checkbox for Marketing
        await struct.requestAQuote.addToMarketing.waitForVisible();
        await struct.requestAQuote.addToMarketing.click();

        await page.waitForTimeout(200);

        // Submit the form
        await struct.requestAQuote.submit.waitForVisible();
        await struct.requestAQuote.submit.click();

        await page.waitForTimeout(200);

        await struct.requestAQuote.submitted.waitForVisible();

    });
    it('Check all fields that are required', async () =>{
      const {
          struct,
          page
      } = await createVisitor();

        //click on "Request a Quote" form
        await struct.header.requestAQuote.waitForVisible();
        await struct.header.requestAQuote.click();

        // Submit the form
        await struct.requestAQuote.submit.waitForVisible();
        await struct.requestAQuote.submit.click();

        await struct.requestAQuote.submitted.waitForHidden();

  });
  }); 
  