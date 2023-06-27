let browserName = process.env.PLAYWRIGHT_PRODUCT;
it('"Incompatible Browser" popup should appear if a tutor logs in using a different browser than Chrome', async () => {

    const {
        struct,
        page
    } = await createVisitor();

    await  page.evaluate(() => window.open('https://testing.tutorme.com'));

    // sign in
    await struct.header.signIn.click();
    await struct.modals.signIn.waitForVisible();

    await struct.modals.signIn.content.email.waitForVisible();
    await struct.modals.signIn.content.email.fill('only_chrome@local.tutorme.com');

    await struct.modals.signIn.content.password.waitForVisible();
    await struct.modals.signIn.content.password.fill('Ff22558800!');

    await struct.modals.signIn.content.recaptcha.waitForVisible();
    await fillRecaptcha(struct.modals.signIn.content.recaptcha);
    await struct.modals.signIn.content.signIn.click();
    await page.waitForTimeout(3000);


    await page.setViewportSize({
        width: 1300,
        height: 900,
      });
    await page.reload();  

    await struct.header.userTools.username.waitForVisible(); 
    await struct.header.userTools.username.click(); 
    await page.waitForTimeout(3000);

    await struct.userMenu.switch.waitForVisible();
    await struct.userMenu.switch.click();
    await page.waitForTimeout(3000);

    await struct.modals.incompatibleBrowser.waitForVisible();
    await struct.modals.incompatibleBrowser.content.close.click();

    //tutor signs out
    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.click();

    });

