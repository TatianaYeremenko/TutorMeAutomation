it.only("Match Pal is available", async () => {
  const { struct, page } = await createVisitor();
  // await page.goto('https://aiasstv2.trial.tutorme.dev/sign-in/');

  //connect with a tutor
  // sign in
  await struct.authPages.signIn.email.waitForVisible();
  await struct.authPages.signIn.email.fill("ai-user@local.tutor.peardeck.com");

  await struct.authPages.signIn.password.waitForVisible();
  await struct.authPages.signIn.password.type("AI@go!");

  await page.waitForTimeout(2000);
  await fillRecaptcha(struct.authPages.signIn.recaptcha);
  await page.waitForTimeout(1000);

  await struct.authPages.signIn.signIn.waitForVisible();
  await struct.authPages.signIn.signIn.click();
  await page.waitForTimeout(1000);

  await struct.homepage.requestATutor.click();
  await page.waitForTimeout(1000);

  await page.locator("label").filter({ hasText: "6th grade" }).click();
  await struct.sessionRequest.nextArrow.click();

  await page.locator("label").filter({ hasText: "Math" }).click();
  await struct.sessionRequest.nextArrow.click();

  await page.locator("label").filter({ hasText: "Basic Math" }).click();
  await struct.sessionRequest.nextArrow.click();

  await page.getByTestId("sessionRequest.description").click();
  await page
    .getByTestId("sessionRequest.description")
    .fill("If y(x-1)=z then x=");
  await page.waitForTimeout(2000);

  // Match Pal is available
  await struct.sessionRequest.refineSearch.waitForVisible();
  await struct.sessionRequest.matchPalCTA.waitForVisible();
  await page.waitForTimeout(1000);
  await struct.sessionRequest.nextArrow.click();

  // await s.page.locator('//div/p[contains(text(),"I am so lost")]').clear();
  await page.locator("label").filter({ hasText: "I am so lost" }).click();

  await page.locator("label").filter({ hasText: "Audio only" }).click();
  await struct.sessionRequest.nextArrow.click();

  // move to the confirmation page
  await struct.sessionRequest.codeOfConduct.click();
  await struct.sessionRequest.requestTutor.click();
  await page.waitForTimeout(1000);

  await struct.modals.notifyingTutors.content.cancel.click();
  await struct.modals.confirmCancel.content.cancel.click();

  //click on my Account and Sign Out
  await struct.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();
});

it("student should be able to continue with the request after five attempts", async () => {
  const { struct, page } = await createVisitor();
  // await page.goto('https://aiasstv2.trial.tutorme.dev/sign-in/');

  //connect with a tutor
  // sign in
  await struct.authPages.signIn.email.waitForVisible();
  await struct.authPages.signIn.email.fill("ai-user@local.tutor.peardeck.com");

  await struct.authPages.signIn.password.waitForVisible();
  await struct.authPages.signIn.password.type("AI@go!");

  await page.waitForTimeout(2000);
  await fillRecaptcha(struct.authPages.signIn.recaptcha);
  await page.waitForTimeout(1000);

  await struct.authPages.signIn.signIn.waitForVisible();
  await struct.authPages.signIn.signIn.click();
  await page.waitForTimeout(1000);

  await struct.homepage.requestATutor.click();
  await page.waitForTimeout(1000);

  await page.locator("label").filter({ hasText: "6th grade" }).click();
  await struct.sessionRequest.nextArrow.click();

  await page.locator("label").filter({ hasText: "Math" }).click();
  await struct.sessionRequest.nextArrow.click();

  await page.locator("label").filter({ hasText: "Basic Math" }).click();
  await struct.sessionRequest.nextArrow.click();

  await page.getByTestId("sessionRequest.description").click();
  await page
    .getByTestId("sessionRequest.description")
    .fill("If y(x-1)=z then x=");
  await page.waitForTimeout(5000);
  await struct.sessionRequest.refineSearch.waitForVisible();
  await struct.sessionRequest.refineSearch.click();
  await page.waitForTimeout(5000);

  await struct.modals.matchPal.waitForVisible();
  await struct.modals.matchPal.content.close.waitForVisible();

  //try 5 times
  for (let i = 0; i < 5; i++) {
    await page.getByTestId("modals.matchPal.content.response").fill("no");
    await page.getByTestId("modals.matchPal.content.response").press("Enter");
    await page.waitForTimeout(2000);
  }
  //last message
  await struct.modals.matchPal.content.message(10).text();
  await page.waitForTimeout(5000);

  await struct.modals.matchPal.content.continueRequest.click();
  await page.waitForTimeout(5000);

  // session goals should not be dispalyed
  await struct.sessionRequest.sessionGoals.waitForHidden();

  // still visiable
  await struct.sessionRequest.matchPalCTA.waitForVisible();
  await struct.sessionRequest.matchPalCTA.click();
  await struct.modals.matchPal.content.continueRequest.click();
  await struct.sessionRequest.close.click();
});
