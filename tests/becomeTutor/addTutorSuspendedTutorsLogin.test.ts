it.each`
  username                             | password         | status
  ${"suspendedtutor@local.tutorme.com"} | ${"Ss22558800!"} | ${"Suspended"}
`(
  '$status tutor logs in and tries to switch to a tutor profile - "Looks like you’ve been locked out',
  async ({ username, password }) => {
    const { struct, page } = await createVisitor();
    //login with new password
    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.type(username);

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type(password);
    await page.waitForTimeout(500);

    await struct.authPages.signIn.recaptcha.waitForVisible();
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await struct.authPages.signIn.recaptcha.waitForVisible();
    await page.waitForTimeout(2000);
    await struct.authPages.signIn.signIn.click();
    await page.waitForTimeout(2000);


    // click on Continue
    await struct.authPages.authError.suspended.waitForVisible();
    expect(await struct.authPages.authError.support.text()).toBe('support-testing@tutor.peardeck.com');

    await struct.authPages.authError.button.waitForVisible();
    await struct.authPages.authError.button.click();

  }
);


