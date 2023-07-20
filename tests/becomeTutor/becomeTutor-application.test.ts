import faker, { random } from "faker";
import { product } from "../../lib/shared";

describe("Become a Tutor:", () => {
  let userFirstName = "";

  it.each`
    input
    ${"Male"}
  `(
    'new "$input" user can apply to complete Tutor Profile from ' + product,
    async ({ input }) => {
      const { struct, page } = await createVisitor();

      //click on Apply Today
      await struct.authPages.signIn.applyToTutor.waitForVisible();
      await struct.authPages.signIn.applyToTutor.click();

      // signup with Google is avalable
      await struct.authPages.applyToTutor.google.waitForVisible();

      const userFirstName = faker.name.firstName(0);
      const userLastName = faker.name.lastName();
      const userShortName = `${userFirstName} ${userLastName.slice(0, 1)}.`;

      await page.waitForTimeout(1000);
      await struct.authPages.applyToTutor.firstName.waitForVisible();
      await struct.authPages.applyToTutor.firstName.fill(userFirstName);
      await struct.authPages.applyToTutor.lastName.waitForVisible();
      await struct.authPages.applyToTutor.lastName.fill(userLastName);

      // create email and password
      const email = `${userFirstName}${userLastName}tutor@local.tutorme.com`;
      const password = "Tutor2023!";

      // const email = `tatiana.v.yeremenko+050301@gmail.com`;
      // const password = "Tutor2023!"; 

      // const email = `${faker.datatype.hexaDecimal(12)}@local.tutorme.com`;
      // const password = faker.internet.password(12, false, /^\w+$/, "aA1");

      await struct.authPages.applyToTutor.email.waitForVisible();
      await struct.authPages.applyToTutor.email.fill(email.toLowerCase());
      await struct.authPages.applyToTutor.password.waitForVisible();
      await struct.authPages.applyToTutor.password.fill(password);

      await page.waitForTimeout(1000);

      await struct.authPages.applyToTutor.recaptcha.waitForVisible();
      await fillRecaptcha(struct.authPages.applyToTutor.recaptcha);
      await struct.authPages.applyToTutor.recaptcha.waitForVisible();

      await Promise.all([
        page.waitForNavigation({
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        }),
        struct.authPages.applyToTutor.createAccount.click(),
      ]);
      await page.waitForTimeout(1000);


      //select where are you in life
      await struct.tutorApp.profile.life.select.click();
      await page.getByTestId('tutorApp.profile.life.option(career).option').click();

      //phone number
      await struct.tutorApp.profile.phone.waitForVisible();
      await struct.tutorApp.profile.phone.fill("650123456789012");

      await struct.tutorApp.profile.submit.click();

      // check photo message
      const photoInstruction =
        "You must upload an appropriate profile photo that clearly shows your face and no other people.";
      expect(await struct.tutorApp.profile.avatar.error.text()).toBe(
        photoInstruction
      );

      //upload picture
      const malesExamples = [
        "./lib/tutors/males/1.jpg",
        "./lib/tutors/males/2.jpg",
        "./lib/tutors/males/3.jpg",
        "./lib/tutors/males/4.jpg",
        "./lib/tutors/males/5.jpg",
      ];

      await struct.tutorApp.profile.avatar.changeButton.click();
      await struct.tutorApp.profile.avatar.input.selectFiles(
        malesExamples[faker.datatype.number(4)]
      );
      await page.waitForTimeout(500);
      await struct.modals.changeAvatar.content.crop.click();
      await page.waitForTimeout(500);

    

      // check if first and last name are correct
      expect(await struct.tutorApp.profile.firstName.value()).toBe(
        userFirstName
      );
      expect(await struct.tutorApp.profile.lastName.value()).toBe(userLastName);
      expect(await struct.tutorApp.profile.email.value()).toBe(
        email.toLowerCase()
      );

      await struct.tutorApp.profile.submit.click();
      await page.waitForTimeout(1000);

      // check for the success message
      await struct.toast.success.waitForVisible();
      await page.waitForTimeout(1000);

      //enter head line
      const headLine = [
        "Experienced 10+ years Tutor",
        "Best K-12 Math Tutor",
        "20+ years in Teaching",
      ];
      await struct.tutorApp.tutorProfile.headline.waitForVisible();
      await struct.tutorApp.tutorProfile.headline.fill(
        headLine[faker.datatype.number(2)]
      );

      //select gender
      await struct.tutorApp.tutorProfile.gender.select.click();
      await struct.tutorApp.tutorProfile.gender.option(1).option.click();


      //type about
      await struct.tutorApp.tutorProfile.about.waitForVisible();
      await struct.tutorApp.tutorProfile.about.fill(
        "Apply from " + product + " " + faker.lorem.sentence(3)
      );

      //type about
      await struct.tutorApp.tutorProfile.teaching.waitForVisible();
      await struct.tutorApp.tutorProfile.teaching.fill(faker.lorem.sentence(3));

      //remove work experience
      await page.locator('//button[contains(text(),"Remove")]').click();
      

      // pagedown 
      await page.keyboard.down('End'); 


      //select college
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.waitForVisible();
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.type("Los Angeles City College");
      await page.waitForTimeout(500);
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("Enter");
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("Enter");

      //select major
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.waitForVisible();
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.type("Business");
      await page.waitForTimeout(500);
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.press("Enter");

      //select degree
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.waitForVisible();
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.type("Bachelor's Degree");
      await page.waitForTimeout(500);
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.press("Enter");

      //select start date
      await struct.tutorApp.tutorProfile.education(0).start.select.fill("2010");
      await page.waitForTimeout(200);
      await struct.tutorApp.tutorProfile
        .education(0)
        .start.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .start.select.press("Enter");

      //select end date
      await struct.tutorApp.tutorProfile.education(0).end.select.fill("2014");
      await struct.tutorApp.tutorProfile
        .education(0)
        .end.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile.education(0).end.select.press("Enter");

      //save and go to the next page
      await page.locator('//button[contains(text(),"Next")]').click();

      // wait
      await page.waitForTimeout(1000);

      //select category
      await struct.tutorApp.subjects.category(6).waitForVisible();
      await struct.tutorApp.subjects.category(6).click();


      await page.locator('label').filter({ hasText: 'Geometry' }).locator('svg').click();
      await page.locator('label').filter({ hasText: 'Linear Programming' }).locator('svg').click();
      await page.locator('label').filter({ hasText: 'Partial Differential Equations' }).locator('svg').click();
      await page.locator('label').filter({ hasText: 'Set Theory' }).locator('svg').click();
      
      await page.keyboard.press('PageDown'); 


      const drop_downs = page.locator('//div[@role="combobox"]');

      drop_downs.nth(0).click();
      await page.getByRole('option', { name: 'Geometry' }).click();
      drop_downs.nth(0).press('ArrowDown');
      drop_downs.nth(0).press('Enter');

      drop_downs.nth(1).click();
      await page.getByRole('option', { name: 'Linear Programming' }).click();
      drop_downs.nth(1).press('ArrowDown');
      drop_downs.nth(1).press('Enter');

      drop_downs.nth(2).click();
      await page.getByRole('option', { name: 'Set Theory' }).click();
      drop_downs.nth(2).press('ArrowDown');
      drop_downs.nth(2).press('Enter');

      await page.waitForTimeout(1000);

      await struct.tutorApp.subjects.save.click();

      //answer questions
      await struct.tutorApp.interview.question(1).waitForVisible();
      await struct.tutorApp.interview.question(1).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.question(1).press("Enter");
      await struct.tutorApp.interview.answer(1).waitForVisible();
      await struct.tutorApp.interview.answer(1).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.answer(1).press("Enter");

      await struct.tutorApp.interview.next.waitForVisible();
      await struct.tutorApp.interview.next.click();

      await struct.tutorApp.interview.question(2).waitForVisible();
      await struct.tutorApp.interview.question(2).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.question(2).press("Enter");
      await struct.tutorApp.interview.answer(2).waitForVisible();
      await struct.tutorApp.interview.answer(2).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.answer(2).press("Enter");

      await struct.tutorApp.interview.next.waitForVisible();
      await struct.tutorApp.interview.next.click();

      await struct.tutorApp.interview.question(3).waitForVisible();
      await struct.tutorApp.interview.question(3).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.question(3).press("Enter");
      await struct.tutorApp.interview.answer(3).waitForVisible();
      await struct.tutorApp.interview.answer(3).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.answer(3).press("Enter");

      await struct.tutorApp.interview.submit.waitForVisible();
      await struct.tutorApp.interview.submit.click();

      //tutorAppSubmitted
      await struct.modals.tutorAppSubmitted.content.okay.waitForVisible();
      await struct.modals.tutorAppSubmitted.content.okay.click();

      //tutor signs out
      await struct.header.userTools.username.click();
      await struct.userMenu.signOut.click();
    }
  );
  it(
    'new "Female" user can apply to complete Tutor Profile from ' + product,
    async () => {
      const { struct, page } = await createVisitor();

      //click on Apply Today
      await struct.authPages.signIn.applyToTutor.waitForVisible();
      await struct.authPages.signIn.applyToTutor.click();

      // signup with Google is avalable
      await struct.authPages.applyToTutor.google.waitForVisible();

      const userFirstName = faker.name.firstName(1);
      const userLastName = faker.name.lastName();
      const userShortName = `${userFirstName} ${userLastName.slice(0, 1)}.`;

      await page.waitForTimeout(1000);
      await struct.authPages.applyToTutor.firstName.waitForVisible();
      await struct.authPages.applyToTutor.firstName.fill(userFirstName);
      await struct.authPages.applyToTutor.lastName.waitForVisible();
      await struct.authPages.applyToTutor.lastName.fill(userLastName);

      //create email and password
      const email = `${userFirstName}${userLastName}tutor@local.tutorme.com`;
      // const password = faker.internet.password(12, false, /^\w+$/, "aA1");
      const password = "Tutor2023!";

      // const email = `${faker.datatype.hexaDecimal(12)}@local.tutorme.com`;
      // const password = faker.internet.password(12, false, /^\w+$/, "aA1");

      await struct.authPages.applyToTutor.email.waitForVisible();
      await struct.authPages.applyToTutor.email.fill(email.toLowerCase());
      await struct.authPages.applyToTutor.password.waitForVisible();
      await struct.authPages.applyToTutor.password.type(password);

      await page.waitForTimeout(1000);

      await struct.authPages.applyToTutor.recaptcha.waitForVisible();
      await fillRecaptcha(struct.authPages.applyToTutor.recaptcha);
      await struct.authPages.applyToTutor.recaptcha.waitForVisible();

      await Promise.all([
        page.waitForNavigation({
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        }),
        struct.authPages.applyToTutor.createAccount.click(),
      ]);
      await page.waitForTimeout(1000);

      //select where are you in life
      await struct.tutorApp.profile.life.select.click();
      await page.getByTestId('tutorApp.profile.life.option(career).option').click();

      //phone number
      await struct.tutorApp.profile.phone.waitForVisible();
      await struct.tutorApp.profile.phone.fill("650123456789012");

      await struct.tutorApp.profile.submit.click();

      // check photo message
      const photoInstruction =
        "You must upload an appropriate profile photo that clearly shows your face and no other people.";
      expect(await struct.tutorApp.profile.avatar.error.text()).toBe(
        photoInstruction
      );

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
      ];

      await struct.tutorApp.profile.avatar.changeButton.click();
      await struct.tutorApp.profile.avatar.input.selectFiles(
        femalesExamples[faker.datatype.number(6)]
      );
      await page.waitForTimeout(500);
      await struct.modals.changeAvatar.content.crop.click();
      await page.waitForTimeout(500);

    

      // check if first and last name are correct
      expect(await struct.tutorApp.profile.firstName.value()).toBe(
        userFirstName
      );
      expect(await struct.tutorApp.profile.lastName.value()).toBe(userLastName);
      expect(await struct.tutorApp.profile.email.value()).toBe(
        email.toLowerCase()
      );

      await struct.tutorApp.profile.submit.click();
      await page.waitForTimeout(1000);

      // check for the success message
      await struct.toast.success.waitForVisible();
      await page.waitForTimeout(1000);

      //enter head line
      const headLine = [
        "Experienced 10+ years Tutor",
        "Best K-12 Math Tutor",
        "20+ years in Teaching",
      ];
      await struct.tutorApp.tutorProfile.headline.waitForVisible();
      await struct.tutorApp.tutorProfile.headline.fill(
        headLine[faker.datatype.number(2)]
      );

      //select gender
      await struct.tutorApp.tutorProfile.gender.select.click();
      await struct.tutorApp.tutorProfile.gender.option(2).option.click();
      // await struct.tutorApp.tutorProfile.gender.option(2).option.click();

      // await page.getByTestId('tutorApp.tutorProfile.gender.option(1).option').click();

      // await struct.tutorApp.tutorProfile.gender.select.press("ArrowDown");
      // await struct.tutorApp.tutorProfile.gender.select.press("Enter");

      //type about
      await struct.tutorApp.tutorProfile.about.waitForVisible();
      await struct.tutorApp.tutorProfile.about.fill(
        "Apply from " + product + " " + faker.lorem.sentence(3)
      );

      //type about
      await struct.tutorApp.tutorProfile.teaching.waitForVisible();
      await struct.tutorApp.tutorProfile.teaching.fill(faker.lorem.sentence(3));

      //remove work experience
      await page.locator('//button[contains(text(),"Remove")]').click();
      

      // pagedown 
      await page.keyboard.down('End'); 


      //select college
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.waitForVisible();
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.type("Los Angeles City College");
      await page.waitForTimeout(500);
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("Enter");
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("Enter");

      //select major
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.waitForVisible();
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.type("Business");
      await page.waitForTimeout(500);
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .major.select.press("Enter");

      //select degree
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.waitForVisible();
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.type("Bachelor's Degree");
      await page.waitForTimeout(500);
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.press("Enter");

      //select start date
      await struct.tutorApp.tutorProfile.education(0).start.select.fill("2010");
      await page.waitForTimeout(200);
      await struct.tutorApp.tutorProfile
        .education(0)
        .start.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile
        .education(0)
        .start.select.press("Enter");

      //select end date
      await struct.tutorApp.tutorProfile.education(0).end.select.fill("2014");
      await struct.tutorApp.tutorProfile
        .education(0)
        .end.select.press("ArrowDown");
      await struct.tutorApp.tutorProfile.education(0).end.select.press("Enter");

      //save and go to the next page
      await page.locator('//button[contains(text(),"Next")]').click();
      // await struct.tutorApp.tutorProfile.save.waitForVisible();
      // await struct.tutorApp.tutorProfile.save.click();

      // wait
      await page.waitForTimeout(1000);

      //select category
      await struct.tutorApp.subjects.category(6).waitForVisible();
      await struct.tutorApp.subjects.category(6).click();


      await page.locator('label').filter({ hasText: 'Geometry' }).locator('svg').click();
      await page.locator('label').filter({ hasText: 'Linear Programming' }).locator('svg').click();
      await page.locator('label').filter({ hasText: 'Partial Differential Equations' }).locator('svg').click();
      await page.locator('label').filter({ hasText: 'Set Theory' }).locator('svg').click();
      
      await page.keyboard.press('PageDown'); 


      const drop_downs = await page.locator('//div[@role="combobox"]');

      drop_downs.nth(0).click();
      await page.getByRole('option', { name: 'Geometry' }).click();
      drop_downs.nth(0).press('ArrowDown');
      drop_downs.nth(0).press('Enter');

      drop_downs.nth(1).click();
      await page.getByRole('option', { name: 'Linear Programming' }).click();
      drop_downs.nth(1).press('ArrowDown');
      drop_downs.nth(1).press('Enter');

      drop_downs.nth(2).click();
      await page.getByRole('option', { name: 'Set Theory' }).click();
      drop_downs.nth(2).press('ArrowDown');
      drop_downs.nth(2).press('Enter');

      await page.waitForTimeout(3000);

      await struct.tutorApp.subjects.save.click();

      //answer questions
      await struct.tutorApp.interview.question(1).waitForVisible();
      await struct.tutorApp.interview.question(1).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.question(1).press("Enter");
      await struct.tutorApp.interview.answer(1).waitForVisible();
      await struct.tutorApp.interview.answer(1).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.answer(1).press("Enter");

      await struct.tutorApp.interview.next.waitForVisible();
      await struct.tutorApp.interview.next.click();

      await struct.tutorApp.interview.question(2).waitForVisible();
      await struct.tutorApp.interview.question(2).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.question(2).press("Enter");
      await struct.tutorApp.interview.answer(2).waitForVisible();
      await struct.tutorApp.interview.answer(2).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.answer(2).press("Enter");

      await struct.tutorApp.interview.next.waitForVisible();
      await struct.tutorApp.interview.next.click();

      await struct.tutorApp.interview.question(3).waitForVisible();
      await struct.tutorApp.interview.question(3).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.question(3).press("Enter");
      await struct.tutorApp.interview.answer(3).waitForVisible();
      await struct.tutorApp.interview.answer(3).fill(faker.lorem.sentence(5));
      await struct.tutorApp.interview.answer(3).press("Enter");

      await struct.tutorApp.interview.submit.waitForVisible();
      await struct.tutorApp.interview.submit.click();

      //tutorAppSubmitted
      await struct.modals.tutorAppSubmitted.content.okay.waitForVisible();
      await struct.modals.tutorAppSubmitted.content.okay.click();

      //tutor signs out
      await struct.header.userTools.username.click();
      await struct.userMenu.signOut.click();
    }
  );
});


