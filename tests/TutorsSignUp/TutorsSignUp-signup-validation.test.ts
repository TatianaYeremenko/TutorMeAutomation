describe('createAccount - ', () => {

    it.each `
    invalidData 
    ${'12324567'},
    ${'14124.com'},
    ${'invalidEmail'}
  `
        ('when $invalidData is entered into Email, a validation message appears', async ({
            invalidData
        }) => {
            const {
                struct,
                page
            } = await createVisitor();
        
    //click on Apply Today  
    await struct.authPages.signIn.applyToTutor.waitForVisible();
    await struct.authPages.signIn.applyToTutor.click();
        
            //enter email and password
            await struct.authPages.applyToTutor.email.waitForVisible();
            await struct.authPages.applyToTutor.email.type(invalidData);
  
            //click on Recaptcha
            await struct.authPages.applyToTutor.recaptcha.waitForVisible();
            await fillRecaptcha(struct.authPages.applyToTutor.recaptcha);
            await page.waitForTimeout(200);
  
  
            // click on sign in and wait
            await  struct.authPages.applyToTutor.createAccount.waitForVisible(); 
            await  struct.authPages.applyToTutor.createAccount.click();
            await page.waitForTimeout(200);
  
            // check validation message
            await struct.authPages.applyToTutor.emailError.waitForVisible();
            expect(await struct.authPages.applyToTutor.emailError.text()).toBe('You have entered an invalid email address. Please try again.');
  
        });
        it.each `
        invalidData 
        ${'12324567'},
        ${'FFFFFFFF'},
        ${'ffffffff'},
        ${'12345fff'},
        ${'12345FFFF'}
      `
            ('when $invalidData is entered into Password, a validation message appears', async ({
                invalidData
            }) => {
                const {
                    struct,
                    page
                } = await createVisitor();
            
        //click on Apply Today  
        await struct.authPages.signIn.applyToTutor.waitForVisible();
        await struct.authPages.signIn.applyToTutor.click();
      
                //enter email and password
                await struct.authPages.applyToTutor.password.waitForVisible();
                await struct.authPages.applyToTutor.password.type(invalidData);
      
                //click on Recaptcha
                await struct.authPages.applyToTutor.recaptcha.waitForVisible();
                await fillRecaptcha(struct.authPages.applyToTutor.recaptcha);
                await page.waitForTimeout(200);
      
      
                // click on sign in and wait
                await  struct.authPages.applyToTutor.createAccount.waitForVisible(); 
                await  struct.authPages.applyToTutor.createAccount.click();
                await page.waitForTimeout(200);
      
                // check validation message
                await struct.authPages.applyToTutor.emailError.waitForVisible();
                expect(await struct.authPages.applyToTutor.passwordError.text()).toContain('Password must include an uppercase letter, a lowercase letter, and a number.');
      
            });
});
