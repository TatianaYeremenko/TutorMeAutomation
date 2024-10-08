it.only("tutor can able to see the message : No earnings to report ", async () => {
  //create tutor
  const { struct, page, user } = await createQaTutor();

  await page.waitForTimeout(2000);

  // click on Background Check
  await struct.tutorDashboard.header.earnings.waitForVisible();
  // expect(await struct.tutorDashboard.header.earnings.text()).toBe('Earnings');
  await struct.tutorDashboard.header.earnings.click();

  // check url
  expect(page.url()).toContain("/earnings/");

  // check the earning
  await (await page.waitForSelector('text="current week"')).textContent();
  await page.waitForSelector('text="all time"');

  // check the earning
  await struct.tutorDashboard.earnings.currentWeekAmount.waitForVisible();
  await struct.tutorDashboard.earnings.cumulativeAmount.waitForVisible();
  await struct.tutorDashboard.earnings.info.waitForVisible();

  //tutor signs out
  await struct.tutorDashboard.header.userTools.username.click();
  await struct.userMenu.signOut.click();
});

it("tutor can able to see the current week and total earnings", async () => {
  //create tutor
  const { struct, page } = await createVisitor();

  // sign in
  await struct.authPages.signIn.email.waitForVisible();
  await struct.authPages.signIn.email.fill("tatiana.v.yeremenko@gmail.com");

  await struct.authPages.signIn.password.waitForVisible();
  await struct.authPages.signIn.password.type("Ff22558800!");
  await page.waitForTimeout(1000);

  await struct.authPages.signIn.recaptcha.waitForVisible();
  await fillRecaptcha(struct.authPages.signIn.recaptcha);
  await struct.authPages.signIn.recaptcha.waitForVisible();

  await struct.authPages.signIn.signIn.waitForVisible();
  await struct.authPages.signIn.signIn.click();
  await page.waitForTimeout(5000);

  // check the earning
  await struct.tutorDashboard.header.availableTutoring.waitForVisible();
  await struct.tutorDashboard.header.availableTutoring.click();

  await struct.tutorDashboard.header.earnings.waitForVisible();
  await struct.tutorDashboard.header.earnings.click();

  // check the earning
  await struct.tutorDashboard.earnings.currentWeekAmount.waitForVisible();
  await struct.tutorDashboard.earnings.cumulativeAmount.waitForVisible();
  await struct.tutorDashboard.earnings.info.waitForVisible();

  //tutor signs out
  await struct.tutorDashboard.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();
});
