import faker, {
    random
  } from "faker";

import {product } from "../../lib/shared";   

describe('Request a Quote form ', () => {
    it('can be submited from header', async () => {
        const {
            struct,
            page
        } = await createVisitor();

        //click on "Request a Quote" form
        await struct.header.requestAQuote.waitForVisible();
        await struct.header.requestAQuote.click();
  
        // Check Title and H1
        expect(await page.title()).toBe('On-demand one-on-one tutoring for schools and districts | TutorMe');
        expect(await page.innerText('h1')).toBe('Request a Quote');

        // Check Page Discription
        expect(await page.innerText('p')).toBe('Ready to support your students – and your educators – with 24/7, on-demand online tutoring? Contact us today to schedule a demo, request a quote, and get started.');
        // console.log(await page.innerText('p'));

    });

    it('can be submited from footer', async () => {
        const {
            struct,
            page
        } = await createVisitor();

        //click on "Request a Quote" form
        await struct.footer.requestAQuote.waitForVisible();
        await struct.footer.requestAQuote.click();
  
        // Check Title and H1
        expect(await page.title()).toBe('On-demand one-on-one tutoring for schools and districts | TutorMe');
        expect(await page.innerText('h1')).toBe('Request a Quote');

        // Check Page Discription
        expect(await page.innerText('p')).toBe('Ready to support your students – and your educators – with 24/7, on-demand online tutoring? Contact us today to schedule a demo, request a quote, and get started.');
        // console.log(await page.innerText('p'));

    });
  }); 
  
