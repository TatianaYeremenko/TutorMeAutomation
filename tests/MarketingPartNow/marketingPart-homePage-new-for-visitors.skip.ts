
    it('Check Visitor Home Page: sections, buttons, the slider', async () => {
        const {
            struct,
            page
        } = await createVisitor();

      // checking Headers  //

      //Subject Search
       await struct.header.subjectsMenu.subjectsButton.waitForVisible();
       await struct.header.subjectsMenu.subjectsButton.click();

       await struct.header.subjectsMenu.category(6).waitForVisible();
       await struct.header.subjectsMenu.category(6).click();

       await struct.tutors.header.waitForVisible()
       expect(await struct.tutors.header.text()).toBe("Math Tutors");

       await page.goBack();

       // Check Parntership menu

       const menuItems = ["k12","academic","libraries","corporate"] as
       const;

       for (const name of menuItems) {

       await struct.header.partnershipsMenu.button.waitForVisible();
       await struct.header.partnershipsMenu.button.click();
       await struct.header.partnershipsMenu[name].waitForVisible();
       await struct.header.partnershipsMenu[name].click(); 
    //    console.log( page.url());
       expect( page.url()).toContain(name);
       await page.goBack();

       }

       // Check Test Prep menu
       await struct.header.courses.waitForVisible();
       await struct.header.courses.click();
       expect( page.url()).toContain('courses');
       await page.goBack();


       // Check SignIn
       await struct.header.signIn.waitForVisible();
       await struct.header.signIn.click();
       await struct.modals.signIn.content.signIn.waitForVisible;
       await page.reload();

       // Check Request A Quote
       await struct.header.requestAQuote.waitForVisible();
       await struct.header.requestAQuote.click();
       expect( page.url()).toContain('request-a-quote');
       await page.goBack();

       // Check Learn More button
       await struct.homepage.k12Link.waitForVisible();
       await struct.homepage.k12Link.click();
       expect( page.url()).toContain('k12-partners');
       await page.goBack();


       // Check Request Quote button
       await struct.homepage.requestAQuoteTop.waitForVisible();
       await struct.homepage.requestAQuoteTop.click();
       expect( page.url()).toContain('request-a-quote');
       await page.goBack();


        // Check Press Learn More button
       await struct.homepage.pressLink.waitForVisible();
       await struct.homepage.pressLink.click();
       expect( page.url()).toContain('press');
       await page.goBack();


        // Check Request Quote button
       await struct.homepage.requestaQuoteBottom.waitForVisible();
       await struct.homepage.requestaQuoteBottom.click();
       expect( page.url()).toContain('request-a-quote');
       await page.goBack();

        // Check Slider arrows
        // await struct.homepage.testimonials.dot(2).waitForVisible();

        // for (let i = 0; i < 2; i++) {
        //     await struct.homepage.testimonials.prevArrow.waitForVisible();
        //     await struct.homepage.testimonials.prevArrow.click();
        //   }
        
        //   for (let i = 0; i < 2; i++) {
        //     await struct.homepage.testimonials.nextArrow.waitForVisible();
        //     await struct.homepage.testimonials.nextArrow.click();
        //   }

        //   for (let i = 0; i < 5; i++) {
        //     await struct.homepage.testimonials.dot(i).waitForVisible();
        //     await struct.homepage.testimonials.dot(i).click();
        //   }

        
        //close page
        await page.close();
    });

