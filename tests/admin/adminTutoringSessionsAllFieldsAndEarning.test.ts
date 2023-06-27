
    it("all fields are displayed correctly", async () => {
        //create Admin
        const a = await createAdmin(); 
        await a.page.waitForTimeout(1000);
        await a.page.keyboard.down('PageDown');

        // click on Tutoring sessions
        await (await a.page.waitForSelector('//a[contains(text(),"Tutoring sessions")]')).click();
        await a.page.waitForTimeout(1000);

        const colNames = ['field-subject_name','field-duration','field-student_duration','field-tutor_duration','field-umbrella','field-start_date','field-all_tutor_earnings','field-lesson_link'] as const;
        for (const name of colNames) {
            let path = '//td[@class="' + name + '"]';
            // console.log(await (await a.page.waitForSelector(path)).innerText());
            expect(await (await a.page.waitForSelector(path)).innerText()).not.toBeNull();
            a.page.keyboard.press('ArrowRight');
        }

        // select the first record
        // const tutors = await a.page.$$('//th/a');
        // await tutors[0].click();

        // // check all fields
        // const fieldNames = ['form-row field-duration','form-row field-student_duration','form-row field-tutor_duration','form-row field-all_tutor_earnings'] as
        // const;
        // for (const name of fieldNames) {
        //     let path = '//div[@class="' + name + '"]';
        //     // console.log(path);
        //     expect(await (await a.page.waitForSelector(path)).innerText()).not.toBeNull();
        //     console.log(await (await a.page.waitForSelector(path)).innerText());

        // }
        await a.page.keyboard.press('PageDown');
        await a.page.close();
    });
