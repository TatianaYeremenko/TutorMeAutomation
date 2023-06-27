import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E PPT: ", () => {
 jest.setTimeout(1000000);

  const userFirstName = faker.name.firstName(0);
  const userLastName = faker.name.lastName();
  const email = `${userFirstName}${userLastName}tutor.ptt@local.tutorme.com`;
  const password = "Ptt1234!";

  it("Fill out Tutor Application for PTT", async () => {
    const { struct, page } = await createVisitor();

    //click on Apply Today
    await struct.authPages.signIn.applyToTutor.waitForVisible();
    await struct.authPages.signIn.applyToTutor.click();

    // signup with Google is avalable
    await struct.authPages.applyToTutor.google.waitForVisible();

    //   const userFirstName = faker.name.firstName(0);
    //   const userLastName = faker.name.lastName();
    const userShortName = `${userFirstName} ${userLastName.slice(0, 1)}.`;

    await page.waitForTimeout(1000);
    await struct.authPages.applyToTutor.firstName.waitForVisible();
    await struct.authPages.applyToTutor.firstName.fill(userFirstName);
    await struct.authPages.applyToTutor.lastName.waitForVisible();
    await struct.authPages.applyToTutor.lastName.fill(userLastName);

    //create email and password
    await struct.authPages.applyToTutor.email.waitForVisible();
    await struct.authPages.applyToTutor.email.fill(email.toLowerCase());
    await struct.authPages.applyToTutor.password.waitForVisible();
    await struct.authPages.applyToTutor.password.fill(password);

    await page.waitForTimeout(3000);

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
    await struct.tutorApp.profile.life.select.press("ArrowDown");
    await struct.tutorApp.profile.life.select.press("Enter");

    //phone number
    await struct.tutorApp.profile.phone.waitForVisible();
    await struct.tutorApp.profile.phone.type("650123456789012");

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
    await (
      await page.waitForSelector('//div[contains(text(),"Crop and Save")]')
    ).click();
    await page.waitForTimeout(500);

    // check if first and last name are correct
    expect(await struct.tutorApp.profile.firstName.value()).toBe(userFirstName);
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
    await struct.tutorApp.tutorProfile.gender.select.waitForVisible();
    await struct.tutorApp.tutorProfile.gender.select.fill("Male");
    await struct.tutorApp.tutorProfile.gender.select.press("ArrowDown");
    await struct.tutorApp.tutorProfile.gender.select.press("Enter");

    //type about
    await struct.tutorApp.tutorProfile.about.waitForVisible();
    await struct.tutorApp.tutorProfile.about.type(
      "Apply from " + product.toUpperCase() + " " + faker.lorem.sentence(3)
    );

    //type about
    await struct.tutorApp.tutorProfile.teaching.waitForVisible();
    await struct.tutorApp.tutorProfile.teaching.fill(faker.lorem.sentence(3));

    //remove work experience
    await struct.tutorApp.tutorProfile.work(0).remove.click();

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
    await struct.tutorApp.tutorProfile.education(0).major.select.press("Enter");

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
    await struct.tutorApp.tutorProfile.education(0).start.select.press("Enter");

    //select end date
    await struct.tutorApp.tutorProfile.education(0).end.select.fill("2014");
    await struct.tutorApp.tutorProfile
      .education(0)
      .end.select.press("ArrowDown");
    await struct.tutorApp.tutorProfile.education(0).end.select.press("Enter");

    //save and go to the next page
    await struct.tutorApp.tutorProfile.save.waitForVisible();
    await struct.tutorApp.tutorProfile.save.click();

    // wait
    await page.waitForTimeout(3000);

    //select category
    await struct.tutorApp.subjects.category(6).waitForVisible();
    await struct.tutorApp.subjects.category(6).click();

    //select subjects
    await struct.tutorApp.subjects.subject(143).click();
    await struct.tutorApp.subjects.subject(145).click();
    await struct.tutorApp.subjects.subject(146).click();

    //select from drop-down
    for (const i in [0, 1, 2]) {
      await struct.tutorApp.subjects.topThree(i).select.click();
      await struct.tutorApp.subjects.topThree(i).select.press("ArrowDown");
      await struct.tutorApp.subjects.topThree(i).select.press("Enter");
    }

    //save and go to the next page
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
  });
  it("The tutor get approved first", async () => {
    //create Admin
    const a = await createAdmin();
    await a.page.waitForTimeout(1000);
    await a.page.keyboard.down("PageDown");

    await (
      await a.page.waitForSelector('//a[contains(text(),"Tutor profiles")]')
    ).click();
    await a.page.waitForTimeout(200);
    await (
      await a.page.waitForSelector('//input[@id="searchbar"]')
    ).fill(email.toLowerCase());
    await (await a.page.waitForSelector('//input[@type="submit"]')).click();
    await a.page.waitForTimeout(200);

    const tutors = await a.page.$$("//th/a");
    await tutors[0].click();

    await (
      await a.page.waitForSelector('//a[contains(text(),"Approve")]')
    ).click();
    await a.page.waitForTimeout(500);

    await a.page.waitForTimeout(5000);
    await a.page.keyboard.down("PageDown");
    await a.page.keyboard.down("PageDown");
    await (await a.page.waitForSelector('//input[@value="Save"]')).click();
    await a.page.waitForTimeout(500);
    await a.page.goBack();
    await a.page.close();
  });
  it("PTT is able to login and switch to Tutor Mode", async () => {
    const { struct, page } = await createVisitor();

    // sign in

    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.type(email.toLowerCase());

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.fill(password);

    await page.waitForTimeout(1000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(1000);

    await struct.header.userTools.username.waitForVisible();
    await struct.header.userTools.username.click();

    await struct.userMenu.switch.waitForVisible();
    await struct.userMenu.switch.click();

    //tutor signs out
    await struct.tutorDashboard.header.userTools.username.click();
    await struct.userMenu.signOut.click();
  });

  it("The tutor is checked as PPT", async () => {
    //create Admin
    const a = await createAdmin();
    await a.page.waitForTimeout(1000);
    await a.page.keyboard.down("PageDown");

    //search
    await (
      await a.page.waitForSelector('//a[contains(text(),"Tutor profiles")]')
    ).click();
    await a.page.waitForTimeout(200);
    await (
      await a.page.waitForSelector('//input[@id="searchbar"]')

    ).fill(email.toLowerCase());
    await (await a.page.waitForSelector('//input[@type="submit"]')).click();
    await a.page.waitForTimeout(200);

    //open tutor profile
    const tutors = await a.page.$$("//th/a");
    await tutors[0].click();

    await a.page.waitForTimeout(5000);
    await a.page.keyboard.down("PageDown");
    await a.page.keyboard.down("PageDown");

    await a.page.getByRole('listitem').filter({ hasText: 'PartTimeTutorTrait' }).getByRole('checkbox').check();
    await a.page.waitForTimeout(200);

    await a.page.keyboard.down("PageDown");
    await (await a.page.waitForSelector('//input[@value="Save"]')).click();
    await a.page.waitForTimeout(500);
    await a.page.goBack();
    await a.page.close();
  });
  it("Check PTT Dashboard Setup", async () => {
    const { struct, page } = await createVisitor();

    // sign in

    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.type(email.toLowerCase());

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.fill(password);

    await page.waitForTimeout(1000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(1000);

    //logo
    // await struct.tutorDashboard.header.logo.waitForVisible();

    //messages
    await struct.tutorDashboard.header.notifications.chat.button.waitForVisible();
   
    //what is new
    await struct.header.notifications.tutorResources.button.waitForVisible();

    //available tutoring
    await struct.tutorDashboard.header.availableTutoring.waitForVisible();

    //past tutoring
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();

    //resources
    await struct.tutorDashboard.header.resources.waitForVisible();

    //heatmap, payment, backgroung check is not visiable
    await struct.tutorDashboard.header.heatmap.waitForHidden();
    await struct.tutorDashboard.header.earnings.waitForHidden();
    await struct.tutorDashboard.header.checkr.waitForHidden();

    //demo
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();
    await struct.tutorDashboard.header.demoLessonSpace.click();
    await struct.demoLessonSpace.header.exit.waitForVisible();
    await struct.demoLessonSpace.header.exit.click();

    // help center
    await struct.tutorDashboard.header.helpCenter.waitForVisible();

    // user's menu
    await struct.tutorDashboard.header.userTools.username.waitForVisible();
    await struct.tutorDashboard.header.userTools.username.click();
    await page.waitForTimeout(200);

    // switch is avalable 
    await struct.userMenu.editProfile.waitForVisible();

    // Privacy Policy and Terms of Service links are available 
    await (await page.waitForSelector('//a[contains(text(),"Privacy Policy")]')).waitForElementState('visible');
    await (await page.waitForSelector('//a[contains(text(),"Terms of Service")]')).waitForElementState('visible');

    //tutor signs out
    // await struct.tutorDashboard.header.userTools.username.click();
    await struct.userMenu.signOut.click();
  });  
  
});
