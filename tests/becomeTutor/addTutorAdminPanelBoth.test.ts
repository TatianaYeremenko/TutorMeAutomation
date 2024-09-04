import faker, { random } from "faker";
import { product } from "../../lib/shared";

describe("Create Tutor Accounts: ", () => {

// male_names
  const m_userFirstName = faker.name.firstName(0);
  const m_userLastName = faker.name.lastName();
  const m_userShortName = `${m_userFirstName} ${m_userLastName.slice(0, 1)}.`;

  // names
  const f_userFirstName = faker.name.firstName(1);
  const f_userLastName = faker.name.lastName();
  const f_userShortName = `${f_userFirstName} ${f_userLastName.slice(0, 1)}.`;

  // create email and password
  const m_email = `${m_userFirstName}${m_userLastName}tutor@local.tutorme.com`.toLowerCase();
  const f_email = `${f_userFirstName}${f_userLastName}tutor@local.tutorme.com`.toLowerCase();

  // console.log(email);
  const password = "Tutor12345!";
  // console.log(password);

  // upload picture
      const malesExamples = [
        "./lib/tutors/males/1.jpg",
        "./lib/tutors/males/2.jpg",
        "./lib/tutors/males/3.jpg",
        "./lib/tutors/males/4.jpg",
        "./lib/tutors/males/5.jpg",
      ];

      //upload picture
      const femalesExamples = [
        "./lib/tutors/females/1.jpg",
        "./lib/tutors/females/2.png",
        "./lib/tutors/females/3.png",
        "./lib/tutors/females/4.png",
        "./lib/tutors/females/5.png",
        "./lib/tutors/females/6.png",
        "./lib/tutors/females/7.png",
        "./lib/tutors/females/8.png",
      ] as const;    

 
  //enter head line
  const headLine = [
    "Experienced 10+ years Tutor",
    "Best K-12 Math Tutor",
    "20+ years in Teaching",
  ];     

it.each`
  gender     |    email   | avatar             | userFirstName      | userLastName
  ${'Male'}  | ${m_email} | ${malesExamples}   | ${m_userFirstName} | ${m_userLastName}| 
  ${'Female'}| ${f_email} | ${femalesExamples} | ${f_userFirstName} | ${f_userLastName}|
`
(
  '$gender Tutor is added through Admin Panel - user name is $email and password is $password',
  async ({ email, avatar, userFirstName, userLastName }) => {
    const a = await createAdmin();

    await a.page.waitForTimeout(1000);
    await a.page.keyboard.down("PageDown");

    await (
      await a.page.waitForSelector('//a[contains(text(),"Tutor profiles")]')
    ).click();
    await a.page.waitForTimeout(500);

    await (
      await a.page.waitForSelector('//a[contains(text(),"Add tutor profile")]')
    ).click();
    await a.page.waitForTimeout(500);


    await a.page.getByLabel("Email:").click();
    await a.page.getByLabel("Email:").fill(email);
    await a.page.getByLabel("First name:").click();
    await a.page.getByLabel("First name:").fill(userFirstName);
    await a.page.getByLabel("Last name:").click();
    await a.page.getByLabel("Last name:").fill(userLastName);

    // add subjects
    const subjects = [
      "Early Math",
      "Higher Math",
      "Advanced Math",
      "Statistics",
      "Biology",
      "Chemistry",
      "Earth Science",
      "Physics",
      "Social Studies",
      "Economics",
      "Psychology",
      "General Computer Science",
      "C++ Programming",
      "Spanish",
      "Business",
    ] as const;

    for (const item of subjects) {
      await a.page.getByLabel(item).check();
    }

    // education
    await (
      await a.page.waitForSelector(
        '//span[@aria-labelledby="select2-id_college-container"]'
      )
    ).click();
    await a.page.getByRole("searchbox").fill("Los Angeles City College");
    await a.page
      .getByRole("option", { name: "Los Angeles City College" })
      .click();
    await a.page.getByLabel("College start year:").click();
    await a.page.getByLabel("College start year:").fill("2021");
    await a.page.getByLabel("College end year:").click();
    await a.page.getByLabel("College end year:").fill("2023");
    await a.page.getByLabel("College end year:").click();
    await (
      await a.page.waitForSelector('//select[@id="id_college_degree"]')
    ).selectOption("1");
    await (
      await a.page.waitForSelector(
        '//span[@aria-labelledby="select2-id_college_major-container"]'
      )
    ).click();
    await a.page.waitForTimeout(500);

    await (
      await a.page.waitForSelector('//input[@type="search"]')
    ).fill("Business");
    await a.page.keyboard.press("Enter");

    // select BackgroundCheck
    await a.page
      .getByRole("listitem")
      .filter({ hasText: "BackgroundCheckTrait" })
      .getByRole("checkbox")
      .check();

      // select WritingLabTrait
      await a.page
        .getByRole("listitem")
        .filter({ hasText: "WritingLabTrait" })
        .getByRole("checkbox")
        .check();  

    // save
    await a.page.locator('input[name="_continue"]').click();

    // enter User Acount and add password
    await a.page.keyboard.down("PageDown");

    await (
      await a.page.waitForSelector('//a[contains(text(),"User Profile")]')
    ).click();
    await a.page.waitForTimeout(500);

    await (
      await a.page.waitForSelector('//a[contains(text(),"this form")]')
    ).click();
    await a.page.waitForTimeout(500);

    await a.page.locator('//input[@id="id_password1"]').fill(password);
    await a.page.locator('//input[@id="id_password2"]').fill(password);

    await a.page.locator('//input[@value="Change password"]').click();

    await (
      await a.page.waitForSelector('//a[contains(text(),"Login as")]')
    ).click();
    await a.page.waitForTimeout(2000);

    await a.page.getByTestId("header.userTools.openMenu").click();
    await a.page.getByTestId("userMenu.myAccount").click();


    await a.page.waitForTimeout(1000); 
    await (await a.page.waitForSelector('//div[contains(text(),"Change photo")]')).click();
    await a.page.waitForTimeout(1000);

    await a.page
      .locator('//input[@id="avatarChangeFileInput"]')
      .setInputFiles(avatar[faker.datatype.number(4)]);
    await a.page.waitForTimeout(1000);

    await (
      await a.page.waitForSelector(
        '//button[@data-testid="modals.changeAvatar.content.crop"]'
      )
    ).click();
    await a.page.waitForTimeout(1000);

    await a.page.keyboard.press("PageDown");
    await a.page.waitForTimeout(1000);

    await (
      await a.page.waitForSelector(
        '//div[@data-testid="account.profile.life.select"]'
      )
    ).click();
    await a.page
      .getByTestId("account.profile.life.option(career).option")
      .click();

    await a.page.getByTestId("account.profile.phone").click();
    await a.page.getByTestId("account.profile.phone").fill("124233254436436");
    await a.page.waitForTimeout(1000);

    await (
      await a.page.waitForSelector('//button[contains(text(),"Save changes")]')
    ).click();
    await a.page.waitForTimeout(1000);

    await a.page.getByTestId("header.userTools.openMenu").click();
    await a.page
      .getByRole("menuitem", { name: "Switch to tutor mode" })
      .click();


    await (await a.page.waitForSelector('//button[contains(text(),"Review your subjects")]')).click();
    await a.page.waitForTimeout(100);
    await a.page.getByRole("button", { name: "Save selections" }).click();
    await a.page.waitForTimeout(100);
    await (await a.page.waitForSelector('//a[contains(text(),"Go to your account")]')).click();
    

    await a.page
      .getByTestId("tutorDashboard.header.userTools.openMenu")
      .click();
    await a.page.getByTestId("userMenu.editProfile").click();
    await a.page.waitForTimeout(1000);

    await a.page.getByTestId("account.tutorProfile.headline").click();
    await a.page
      .getByTestId("account.tutorProfile.headline")
      .fill(headLine[faker.datatype.number(2)]);
    await a.page.waitForTimeout(1000);

    await a.page.getByTestId("account.tutorProfile.gender.select").click();
    await a.page
      .getByTestId("account.tutorProfile.gender.option(4).option")
      .click();
    await a.page.waitForTimeout(1000);

    // enter about
    await a.page.getByTestId("account.tutorProfile.about").click();
    await a.page
      .getByTestId("account.tutorProfile.about")
      .fill("About me: " + product + " " + faker.lorem.sentence(15));
    await a.page.waitForTimeout(1000);

    // add teaching experiance
    await a.page.getByTestId("account.tutorProfile.teaching").click();
    await a.page
      .getByTestId("account.tutorProfile.teaching")
      .fill(faker.lorem.sentence(10));
    await a.page.waitForTimeout(1000);

    await a.page.getByRole("button", { name: "Submit" }).click();
    await a.page.waitForTimeout(1000);

    await a.page
      .getByTestId("tutorDashboard.header.userTools.openMenu")
      .click();
    await a.page.getByTestId("userMenu.signOut").click();
  });
});
