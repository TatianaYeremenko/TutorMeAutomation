it("Tutor is available to select Languages", async () => {
  //create tutor
  const { struct, page, user } =  await createQaTutor();

  await page.waitForTimeout(1000);
  await page.setViewportSize({ width: 1920, height: 1080 });

  // click on Edit Profile
  await struct.tutorDashboard.header.userTools.username.waitForVisible();
  await struct.tutorDashboard.header.userTools.username.click();

  await page.waitForTimeout(500);

  //check Curriculum Area
  await struct.userMenu.myAccount.click();
  await page.waitForTimeout(500);

  await page.getByRole("link", { name: "Subjects and Skills" }).click();
  await page.waitForTimeout(500);

  // check Header
  await (
    await page.waitForSelector(
      '//h2[contains(text(),"Besides English, can you provide tutoring in any other languages?")]'
    )
  ).isVisible();

  // check info link
  const [infoPage] = await Promise.all([
    page.waitForEvent("popup"),
    (
      await page.waitForSelector(
        '//a[contains(text(),"Want to learn more? Refer to Section 5 of the Handbook.")]'
      )
    ).click(),
  ]);
  expect(infoPage.url().toString()).toContain("handbook");
  await infoPage.close();

  await page
    .locator("label")
    .filter({ hasText: "Arabic" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Cantonese" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Farsi" })
    .locator("svg")
    .click();
  // await page.locator('label').filter({ hasText: 'French' }).locator('svg').click();
  await page
    .locator("label")
    .filter({ hasText: "Haitian Creole" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Hmong" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Korean" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Mandarin" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Pashto" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Portuguese" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Russian" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Somali" })
    .locator("svg")
    .click();
  // await page.locator('label').filter({ hasText: 'Spanish' }).locator('svg').click();
  await page
    .locator("label")
    .filter({ hasText: "Swahili" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Tagalog" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Urdu" })
    .locator("svg")
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Vietnamese" })
    .locator("svg")
    .click();

  await page.keyboard.down("PageDown");
  await page.keyboard.down("PageDown");

  // submit the changes
  await struct.account.subjects.save.waitForVisible();
  await struct.account.subjects.save.click();

  await page.waitForTimeout(100);

  // confirm the changes
  await struct.toast.success.waitForVisible();

  //tutor signs out
  await struct.tutorDashboard.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();
});
