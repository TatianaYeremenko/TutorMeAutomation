it("tutor is able to see WL page", async () => {
  //create tutor
  const { struct, page, user } = await createQaTutor();

  await page.waitForTimeout(1000);
  // click on Bell Available Tutoring
  await struct.tutorDashboard.header.availableTutoring.waitForVisible();
  await struct.tutorDashboard.header.availableTutoring.click();
  await page.waitForTimeout(1000);

  // WL Tab
  await page
    .locator(
      '//*[@id="react-app"]/div/div[4]/div/div/nav/div[2]/div[1]/div/a/span'
    )
    .isVisible();
  await page
    .locator(
      '//*[@id="react-app"]/div/div[4]/div/div/nav/div[2]/div[1]/div/a/span'
    )
    .click();

  // header Writing Labs
  await page.locator('//h2[contains(text(),"Writing Labs")]').isVisible();

  // Available Writing Lab requests
  await page
    .locator('//h3[contains(text(),"Available Writing Lab requests")]')
    .isVisible();

  // There are no active Writing Lab requests
  await page
    .locator(
      '//h3[contains(text(),"There are no active Writing Lab requests")]'
    )
    .isVisible();

  // This section will automatically update when a new request becomes available - no need to refresh your page.
  await page
    .locator(
      '//p[contains(text(),"This section will automatically update when a new request becomes available - no need to refresh your page.")]'
    )
    .isVisible();

  // red dot is no visible for empty page
  await page
    .locator('//*[@id="react-app"]/div/div[4]/div/nav/div[2]/div[1]/div/a/div')
    .isHidden();

  //tutor signs out
  await struct.tutorDashboard.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();
});
