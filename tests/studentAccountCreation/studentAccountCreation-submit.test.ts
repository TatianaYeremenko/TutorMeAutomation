import faker from "faker";

it('student can sign up via Student Account Creation Link', async () => {
    const {
        page,
        struct
    } = await createVisitor();

    // await page.evaluate(async () => {
    //     for (let i = 0; i < document.body.scrollHeight; i += 100) {
    //       window.scrollTo(0, i);
    //     }
    //   });
    
      // click on Student Account Creation Link
    await struct.authPages.signIn.joinOrg.waitForVisible();
    await struct.authPages.signIn.joinOrg.click();

      // fill out the form
    await struct.authPages.joinOrg.firstName.waitForVisible();
    await struct.authPages.joinOrg.firstName.fill(faker.name.firstName());

    await struct.authPages.joinOrg.lastName.waitForVisible();
    await struct.authPages.joinOrg.lastName.fill(faker.name.lastName());

    const email = `${faker.datatype.hexaDecimal(12)}@local.yeremenko.org`;

    await struct.authPages.joinOrg.email.waitForVisible();
    await struct.authPages.joinOrg.email.fill(email);
    //
    await struct.authPages.joinOrg.submit.waitForVisible();
    await struct.authPages.joinOrg.submit.click();
    await page.waitForTimeout(1000);

    //check the error
    console.log(await struct.authPages.joinOrg.emailError.text());
    expect(await struct.authPages.joinOrg.emailError.text()).toContain('The email address domain name does not match any current TutorMe partners. Please try a different email address or contact your TutorMe administrator.');  

    //check the error
    await struct.authPages.joinOrg.email.waitForVisible();
    await struct.authPages.joinOrg.email.fill("");
    await struct.authPages.joinOrg.email.fill(`${faker.datatype.hexaDecimal(12)}@yahooo.com`);
    //
    await struct.authPages.joinOrg.submit.waitForVisible();
    await struct.authPages.joinOrg.submit.click();
    await page.waitForTimeout(1000);

    //check the confirmation
    expect(await struct.authPages.joinOrg.success.text()).toContain('Check your email');  
    console.log(await struct.authPages.joinOrg.success.text());

});
