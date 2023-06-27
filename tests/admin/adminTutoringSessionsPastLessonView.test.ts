it("past lesson link is available for review", async () => {
    //create Admin
    const a = await createAdmin(); 
    await a.page.waitForTimeout(1000);
    await a.page.keyboard.down('PageDown');

    // click on Tutoring sessions
    await (await a.page.waitForSelector('//a[contains(text(),"Tutoring sessions")]')).click();
    await a.page.waitForTimeout(1000);
    let i=0;
    const tutors = await a.page.$$('//th/a');
        if( (await (await a.page.waitForSelector('//td[@class="field-duration"]')).innerText()).match('-'))
        {
            await tutors[i+1].click();
            const [pastView] = await Promise.all([
                a.page.waitForEvent('popup'),
                await (await a.page.waitForSelector('//li/a[contains(text(),"View")]')).click(),
                await a.page.waitForTimeout(2000)
                ]);
            expect(pastView.url()).toContain('history');
            // console.log(pastView.url());
            await a.page.waitForTimeout(2000)
            await pastView.close(); 
            }
        else
        {
            await tutors[i].click();
            const [pastView] = await Promise.all([
                a.page.waitForEvent('popup'),
                await (await a.page.waitForSelector('//li/a[contains(text(),"View")]')).click(),
                await a.page.waitForTimeout(2000)
                ]);
            expect(pastView.url()).toContain('history');
            // console.log(pastView.url());
            await a.page.waitForTimeout(2000)
            await pastView.close(); 

        }    
    await a.page.close();
});
