import faker, { random } from "faker";
import { product } from "../../lib/shared";

describe("Become a Tutor Incomplete form:", () => {
  it.only(
    "User should be able to complete Incomplete form" + product,
    async () => {
      const { struct: struct, page } = await createVisitor();

      //click on Apply Today
      await struct.authPages.signIn.applyToTutor.waitForVisible();
      await struct.authPages.signIn.applyToTutor.click();

      // signup with Google is avalable
      await struct.authPages.applyToTutor.google.waitForVisible();

      const userFirstName = faker.name.firstName();
      const userLastName = faker.name.lastName();
      const userShortName = `${userFirstName} ${userLastName.slice(0, 1)}.`;

      await page.waitForTimeout(1000);
      await struct.authPages.applyToTutor.firstName.waitForVisible();
      await struct.authPages.applyToTutor.firstName.fill(userFirstName);
      await struct.authPages.applyToTutor.lastName.waitForVisible();
      await struct.authPages.applyToTutor.lastName.fill(userLastName);

      //create email and password
      const email = `${userFirstName}${userLastName}tutor@local.tutorme.com`;
      const password = "Tutor2023!";

      // const email = `${faker.datatype.hexaDecimal(12)}@local.tutorme.com`;
      // const password = faker.internet.password(12, false, /^\w+$/, "aA1");

      await struct.authPages.applyToTutor.email.waitForVisible();
      await struct.authPages.applyToTutor.email.fill(email.toLowerCase());
      await struct.authPages.applyToTutor.password.waitForVisible();
      await struct.authPages.applyToTutor.password.fill(password);

      await page.waitForTimeout(500);

      await struct.authPages.applyToTutor.recaptcha.waitForVisible();
      await fillRecaptcha(struct.authPages.applyToTutor.recaptcha);
      await struct.authPages.applyToTutor.recaptcha.waitForVisible();

      await Promise.all([
        page.waitForNavigation({
          waitUntil: "domcontentloaded",
          timeout: 10_000,
        }),
        struct.authPages.applyToTutor.createAccount.click(),
      ]);

      const malesExamples = [
        "./lib/tutors/males/5.jpg",
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

      //select where are you in life
      await struct.tutorApp.profile.life.select.click();
      await page.getByTestId('tutorApp.profile.life.option(career).option').click();

      //phone number
      let tutorPhone = faker.datatype.number(9) + "12345678901234";
      await struct.tutorApp.profile.phone.waitForVisible();
      await struct.tutorApp.profile.phone.type(tutorPhone);


      await struct.tutorApp.profile.submit.click();

      // log out and signin again
      await struct.header.userTools.username.click();
      await struct.userMenu.signOut.click();

      await page.waitForTimeout(500);

      const r = await createVisitor();

      //login with new password
      await r.struct.authPages.signIn.email.waitForVisible();
      await r.struct.authPages.signIn.email.type(email);

      await r.struct.authPages.signIn.password.waitForVisible();
      await r.struct.authPages.signIn.password.type(password);
      await r.page.waitForTimeout(500);

      await r.struct.authPages.signIn.recaptcha.waitForVisible();
      await fillRecaptcha(r.struct.authPages.signIn.recaptcha);
      await r.struct.authPages.signIn.recaptcha.waitForVisible();

      await Promise.all([
        r.page.waitForNavigation({
          waitUntil: "domcontentloaded",
          timeout: 10_000,
        }),
        r.struct.authPages.signIn.signIn.click(),
      ]);

      //click on Become a Tutor
      await r.struct.header.userTools.username.waitForVisible();
      await r.struct.header.userTools.username.click();
      await r.struct.userMenu.becomeATutor.click();

      // check if first and last name are correct
      expect(await r.struct.tutorApp.profile.firstName.value()).toBe(
        userFirstName
      );
      expect(await r.struct.tutorApp.profile.lastName.value()).toBe(
        userLastName
      );

      // check email and phone
      expect(await r.struct.tutorApp.profile.email.value()).toBe(
        email.toLowerCase()
      );
      expect(await r.struct.tutorApp.profile.phone.value()).toBe(tutorPhone);

      await r.struct.tutorApp.profile.submit.click();
      await r.page.waitForTimeout(500);

      // await (await page.waitForSelector('//div[contains(text(),"Account Saved")]')).isVisible();

      //enter head line
      const headLine = [
        "Experienced 10+ years Tutor",
        "Best K-12 Math Tutor",
        "20+ years in Teaching",
      ];
   

      await r.struct.tutorApp.tutorProfile.headline.waitForVisible();
      await r.struct.tutorApp.tutorProfile.headline.fill(
        headLine[faker.datatype.number(2)]
      );

      //select gender
      await r.struct.tutorApp.tutorProfile.gender.select.click();
      await r.struct.tutorApp.tutorProfile.gender.option(1).option.click();


      //type about
      await r.struct.tutorApp.tutorProfile.about.waitForVisible();
      await r.struct.tutorApp.tutorProfile.about.fill(
        "Apply from " + product + " " + faker.lorem.sentence(3)
      );

      //type about
      await r.struct.tutorApp.tutorProfile.teaching.waitForVisible();
      await r.struct.tutorApp.tutorProfile.teaching.fill(faker.lorem.sentence(3));

      //remove work experience
      await r.page.locator('//button[contains(text(),"Remove")]').click();
      

      // pagedown 
      await r.page.keyboard.down('End'); 


      //select college
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .college.select.waitForVisible();
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .college.select.type("Los Angeles City College");
      await r.page.waitForTimeout(500);
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("Enter");
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("ArrowDown");
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .college.select.press("Enter");

      //select major
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .major.select.waitForVisible();
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .major.select.type("Business");
        await r.page.waitForTimeout(500);
        await r.struct.tutorApp.tutorProfile
        .education(0)
        .major.select.press("ArrowDown");
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .major.select.press("Enter");

      //select degree
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.waitForVisible();
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.type("Bachelor's Degree");
        await r.page.waitForTimeout(500);
        await r.struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.press("ArrowDown");
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .degree.select.press("Enter");

      //select start date
      await r.struct.tutorApp.tutorProfile.education(0).start.select.fill("2010");
      await r.page.waitForTimeout(500);
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .start.select.press("ArrowDown");
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .start.select.press("Enter");

      //select end date
      await r.struct.tutorApp.tutorProfile.education(0).end.select.fill("2014");
      await r.struct.tutorApp.tutorProfile
        .education(0)
        .end.select.press("ArrowDown");
      await r.struct.tutorApp.tutorProfile.education(0).end.select.press("Enter");

      //save and go to the next page
      await r.page.locator('//button[contains(text(),"Next")]').click();

      // wait
      await r.page.waitForTimeout(500);

      //select category
      await r.struct.tutorApp.subjects.category(6).waitForVisible();
      await r.struct.tutorApp.subjects.category(6).click();


      await r.page.locator('label').filter({ hasText: 'Geometry' }).locator('svg').click();
      await r.page.locator('label').filter({ hasText: 'Linear Programming' }).locator('svg').click();
      await r.page.locator('label').filter({ hasText: 'Partial Differential Equations' }).locator('svg').click();
      await r.page.locator('label').filter({ hasText: 'Set Theory' }).locator('svg').click();
      
      await r.page.keyboard.press('PageDown'); 


      const drop_downs = r.page.locator('//div[@role="combobox"]');

      drop_downs.nth(0).click();
      await r.page.getByRole('option', { name: 'Geometry' }).click();
      drop_downs.nth(0).press('ArrowDown');
      drop_downs.nth(0).press('Enter');

      drop_downs.nth(1).click();
      await r.page.getByRole('option', { name: 'Linear Programming' }).click();
      drop_downs.nth(1).press('ArrowDown');
      drop_downs.nth(1).press('Enter');

      drop_downs.nth(2).click();
      await r.page.getByRole('option', { name: 'Set Theory' }).click();
      drop_downs.nth(2).press('ArrowDown');
      drop_downs.nth(2).press('Enter');

      await r.page.waitForTimeout(1000);

      await r.struct.tutorApp.subjects.save.click();

      //answer questions
      await r.struct.tutorApp.interview.question(1).waitForVisible();
      await r.struct.tutorApp.interview.question(1).fill(faker.lorem.sentence(5));
      await r.struct.tutorApp.interview.question(1).press("Enter");
      await r.struct.tutorApp.interview.answer(1).waitForVisible();
      await r.struct.tutorApp.interview.answer(1).fill(faker.lorem.sentence(5));
      await r.struct.tutorApp.interview.answer(1).press("Enter");

      await r.struct.tutorApp.interview.next.waitForVisible();
      await r.struct.tutorApp.interview.next.click();

      await r.struct.tutorApp.interview.question(2).waitForVisible();
      await r.struct.tutorApp.interview.question(2).fill(faker.lorem.sentence(5));
      await r.struct.tutorApp.interview.question(2).press("Enter");
      await r.struct.tutorApp.interview.answer(2).waitForVisible();
      await r.struct.tutorApp.interview.answer(2).fill(faker.lorem.sentence(5));
      await r.struct.tutorApp.interview.answer(2).press("Enter");

      await r.struct.tutorApp.interview.next.waitForVisible();
      await r.struct.tutorApp.interview.next.click();

      await r.struct.tutorApp.interview.question(3).waitForVisible();
      await r.struct.tutorApp.interview.question(3).fill(faker.lorem.sentence(5));
      await r.struct.tutorApp.interview.question(3).press("Enter");
      await r.struct.tutorApp.interview.answer(3).waitForVisible();
      await r.struct.tutorApp.interview.answer(3).fill(faker.lorem.sentence(5));
      await r.struct.tutorApp.interview.answer(3).press("Enter");

      await r.struct.tutorApp.interview.submit.waitForVisible();
      await r.struct.tutorApp.interview.submit.click();

      //tutorAppSubmitted
      await r.struct.modals.tutorAppSubmitted.content.okay.waitForVisible();
      await r.struct.modals.tutorAppSubmitted.content.okay.click();

      //tutor signs out
      await r.struct.header.userTools.username.click();
      await r.struct.userMenu.signOut.click();
    }
  );
});
