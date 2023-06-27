import faker, {
    random
  } from "faker";

import {product } from "../../lib/shared";   

describe('Connect Us Form ', () => {
    it(' is avalable at Academic Partners page', async () => {
        const {
            struct,
            page
        } = await createVisitor();
        

        //click on k-12 partner
        await struct.footer.academicPartners.waitForVisible();
        await struct.footer.academicPartners.click();
        await page.waitForTimeout(1000);


        //click on Contact Us
        await struct.academicPartnerships.contactUs.waitForVisible();
        await struct.academicPartnerships.contactUs.click();
        await page.waitForTimeout(1000);
 
       expect(await (await page.waitForSelector('//span[contains(text(),"hundreds of schools")]')).textContent()).toBe('hundreds of schools');

    });
    it(' is avalable at Library Partners page', async () => {
        const {
            struct,
            page
        } = await createVisitor();
        

        //click on k-12 partner
        await struct.footer.libraryPartners.waitForVisible();
        await struct.footer.libraryPartners.click();
        await page.waitForTimeout(1000);


        //click on Contact Us
        await struct.libraryPartnerships.contactUs.waitForVisible();
        await struct.libraryPartnerships.contactUs.click();
        await page.waitForTimeout(1000);
 
       expect(await (await page.waitForSelector('//span[contains(text(),"library partners")]')).textContent()).toBe('library partners');

    });
    it(' is avalable at Corporate Partners page', async () => {
        const {
            struct,
            page
        } = await createVisitor();
        

        //click on k-12 partner
        await struct.footer.corpPartners.waitForVisible();
        await struct.footer.corpPartners.click();
        await page.waitForTimeout(1000);


        //click on Contact Us
        await struct.businessPartnerships.contactUs.waitForVisible();
        await struct.businessPartnerships.contactUs.click();
        await page.waitForTimeout(1000);
        
       expect(await (await page.waitForSelector('//span[contains(text(),"corporate partners")]')).textContent()).toBe('corporate partners');

    });
  }); 
  