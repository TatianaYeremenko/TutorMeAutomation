it("tutor is able to turn Enter the tutoring queue? on", async () => {
  //create tutor
  const { struct, page, user } = await createQaTutor();

  await page.waitForTimeout(1000);

  // click on Bell Available Tutoring
  await struct.tutorDashboard.header.availableTutoring.waitForVisible();
  await struct.tutorDashboard.header.availableTutoring.click();
  await page.waitForTimeout(1000);

  // Get matched with live tutoring requests
  await page
    .locator('//h3[contains(text(),"Get matched with live tutoring requests")]')
    .isVisible();

  // You are not currently accepting live tutoring requests
  await page
    .locator(
      '//div[contains(text(),"You are not currently accepting live tutoring requests")]'
    )
    .isVisible();

  // Enter the queue to be matched with live requests from students by using the toggle below.
  await page
    .locator(
      '//div[contains(text(),"Enter the queue to be matched with live requests from students by using the toggle below.")]'
    )
    .isVisible();

  // turon switch on
  await page
    .locator('//button[@aria-label="Enter the tutoring queue? off"]')
    .isVisible();
  await page
    .locator('//button[@aria-label="Enter the tutoring queue? off"]')
    .click();
  await page.waitForTimeout(1000);

  // "You are not currently accepting live tutoring requests" is hidden
  await page
    .locator(
      '//div[contains(text(),"You are not currently accepting live tutoring requests")]'
    )
    .isHidden();

  // "You are accepting live tutoring requests" is shown up now
  await page.locator("You are accepting live tutoring requests").isVisible();

  // "Sit back while we look for a student who needs your expertise" is shown up now
  await page
    .locator(
      '//div[contains(text(),"Sit back while we look for a student who needs your expertise")]'
    )
    .isVisible();

  // "Finding a request that matches your expertise..." is shown up now
  await page
    .locator(
      '//div[contains(text(),"Finding a request that matches your expertise...")]'
    )
    .isVisible();
  await struct.modals.notifyingTutors.content.pause.waitForVisible();

  const inputElement = page.locator(
    '//button[@data-testid="modals.notifyingTutors.content.pause"]'
  );
  expect(await inputElement.getAttribute("aria-label")).toBe("Pause animation");
  await page.waitForTimeout(1000);

  // pause animation
  await struct.modals.notifyingTutors.content.pause.click();
  expect(await inputElement.getAttribute("aria-label")).toBe(
    "Resume animation"
  );

  // RAISE Approach link
  await page.locator('//a[contains(text(),"RAISE Approach")]').isVisible();

  // RAISE Approach link is there
  const [RAISE_Approach] = await Promise.all([
    page.waitForEvent("popup"),
    await page.locator('//a[contains(text(),"RAISE Approach")]').isVisible(),
    await page.locator('//a[contains(text(),"RAISE Approach")]').click(),
  ]);
  expect(RAISE_Approach.url()).toContain("pdt-tutor/home");
  await RAISE_Approach.close();

  // turon switch off
  await page
    .locator('//button[@aria-label="Enter the tutoring queue? on"]')
    .isVisible();
  await page
    .locator('//button[@aria-label="Enter the tutoring queue? on"]')
    .click();
  await page.waitForTimeout(1000);

  // You are not currently accepting live tutoring requests
  await page
    .locator(
      '//div[contains(text(),"You are not currently accepting live tutoring requests")]'
    )
    .isVisible();

  //tutor signs out
  await struct.tutorDashboard.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();
});
