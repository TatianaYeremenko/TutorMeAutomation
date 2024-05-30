import { values } from "lodash";

it("Curriculum Areas is available and tutotrs able to edit", async () => {
  //create tutor
  const { struct, page, user } = await createQaUser("tutor");

  await page.waitForTimeout(1000);
  await page.setViewportSize({ width: 1920, height: 1080 });

  // click on Edit Profile
  await struct.tutorDashboard.header.userTools.username.waitForVisible();
  await struct.tutorDashboard.header.userTools.username.click();

  await struct.userMenu.editProfile.waitForVisible();
  await struct.userMenu.editProfile.click();

  await page.waitForTimeout(500);

  //check Curriculum Area
  await page.getByRole("link", { name: "Subjects and Skills" }).click();
  await page.keyboard.press("PageDown");

  // check check-box values - need to fix this part
  
  // check other subjects
  await (
    await page.waitForSelector(
      '//div[contains(text(),"General Computer Science")]'
    )
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Python Programming")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Java Programming")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"C Programming")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"C++ Programming")]')
  ).click();

  await (
    await page.waitForSelector('//div[contains(text(),"Spanish")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Education")]')
  ).click();
  await (await page.waitForSelector('//div[contains(text(),"Music")]')).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Microsoft Office")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Business")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Sociology")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Philosophy")]')
  ).click();
  await (
    await page.waitForSelector('//div[contains(text(),"Public Health")]')
  ).click();
  await (
    await page.waitForSelector(
      '//div[contains(text(),"Library and Information Science")]'
    )
  ).click();

  // check the information
  await (
    await page.waitForSelector(
      '//div[contains(text(),"Don\'t see a subject you used to tutor in? Click")]'
    )
  ).isVisible();

  const [page1] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "here" }).click(),
  ]);
  expect(page1.url().toString()).toContain("https://help.tutor.peardeck.com");
  await page1.close();

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
