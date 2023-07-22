import faker, { random } from "faker";

it("tutor can edit the profile", async () => {
  //create tutor
  const { struct, page, user } = await createQaUser("tutor");

  //update subjects
  await page.locator('//button[contains(text(),"Update my subjects")]').click();
  await page.waitForTimeout(500);

  await page
    .locator("label")
    .filter({
      hasText:
        "Early MathSubjects include: Basic Math, Pre-Algebra, Algebra, Geometry",
    })
    .locator("svg")
    .click();
  await page.keyboard.press("PageDown");
  await page.keyboard.press("PageDown");

  await struct.account.subjects.save.click();
  await page.getByRole("link", { name: "Go to my account" }).click();

  // click on Edit Profile
  await struct.tutorDashboard.header.userTools.username.waitForVisible();
  await struct.tutorDashboard.header.userTools.username.click();

  await struct.userMenu.editProfile.waitForVisible();
  await struct.userMenu.editProfile.click();

  await page.waitForTimeout(1000);

  //enter head line
  const headLine = [
    "Experienced 10+ years Tutor",
    "Best K-12 Math Tutor",
    "20+ years in Teaching",
  ];
  await struct.account.tutorProfile.headline.waitForVisible();
  await struct.account.tutorProfile.headline.fill(
    headLine[faker.datatype.number(2)]
  );

  //select gender
  await struct.account.tutorProfile.gender.select.click();
  await struct.account.tutorProfile.gender.option(1).option.click();

  //type about
  let about = faker.lorem.sentence(3);
  await struct.account.tutorProfile.about.waitForVisible();
  await struct.account.tutorProfile.about.clear();
  await struct.account.tutorProfile.about.type(about);

  //type teaching expireance
  let exper = faker.lorem.sentence(3);
  await struct.account.tutorProfile.teaching.waitForVisible();
  await struct.account.tutorProfile.teaching.clear();
  await struct.account.tutorProfile.teaching.type(exper);

  // pagedown
  await page.keyboard.down("End");

  await struct.account.tutorProfile.addEducation.click();

  //select college
        //select college
        await struct.account.tutorProfile.education(0).college.select.waitForVisible();
        await struct.account.tutorProfile.education(0).college.select.type('Los Angeles City College');
        await struct.account.tutorProfile.education(0).college.select.press('ArrowDown');
        await struct.account.tutorProfile.education(0).college.select.press('Enter');

        //select major
        await struct.account.tutorProfile.education(0).major.select.waitForVisible();
        await struct.account.tutorProfile.education(0).major.select.type('Business');
        await struct.account.tutorProfile.education(0).major.select.press('ArrowDown');
        await struct.account.tutorProfile.education(0).major.select.press('Enter');

        //select degree
        await struct.account.tutorProfile.education(0).degree.select.waitForVisible();
        await struct.account.tutorProfile.education(0).degree.select.type("Bachelor's Degree");
        await struct.account.tutorProfile.education(0).degree.select.press('ArrowDown');
        await struct.account.tutorProfile.education(0).degree.select.press('Enter');

        //select start date
        await struct.account.tutorProfile.education(0).start.select.type('2010');
        await struct.account.tutorProfile.education(0).start.select.press('ArrowDown');;
        await struct.account.tutorProfile.education(0).start.select.press('Enter');

        //select end date
        await struct.account.tutorProfile.education(0).end.select.type('2014');
        await struct.account.tutorProfile.education(0).end.select.press('ArrowDown');;
        await struct.account.tutorProfile.education(0).end.select.press('Enter');

 

  //save and go to the next page
  await page.locator('//button[contains(text(),"Submit")]').click();


  await page.waitForTimeout(1000);

  //click on my Demo Lesson Space
  await struct.tutorDashboard.header.userTools.username.waitForVisible();
  await struct.tutorDashboard.header.userTools.username.click();

  // click on Edit Profile
  await struct.userMenu.editProfile.waitForVisible();
  await struct.userMenu.editProfile.click();
  await page.waitForTimeout(1000);

  // checked edited data
  expect(await struct.account.tutorProfile.about.text()).toBe(about);
  expect(await struct.account.tutorProfile.teaching.text()).toBe(exper);

  //tutor signs out
  await struct.tutorDashboard.header.userTools.username.click();
  await struct.userMenu.signOut.click();
});
