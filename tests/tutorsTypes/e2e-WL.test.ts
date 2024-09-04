
describe("Check that WL handbook is avalable to WL tutors only: ", () => {
  jest.setTimeout(1000000);

  const nwemail = "dannygislason-no-wl-tutor@local.tutorme.com";
  const nwpassword = "Tutor12345";

  const email ='wl-tutor@local.tutorme.com	' 
  const password ='Ff22558800!' 

it('WL tutors can able to see the past lessons and avalable wl and wl handbook', async () => {
  //create tutor
  const {
    struct,
    page,
} =  await createVisitor();

    // the tutor signs in
    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.fill(email.toLowerCase());

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type(password);

    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await page.waitForTimeout(1000);

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(2000);  

  // click on availableTutoring and then Resources
  await struct.tutorDashboard.header.resources.waitForVisible();
  await struct.tutorDashboard.header.resources.click();
         
  // Check url
  expect(page.url()).toContain('/resources/');       
        
  //Read the entire Tutor Handbook
  //check HandBook link 
  const [pageHandbook] = await Promise.all([
      page.waitForEvent('popup'),
      struct.tutorDashboard.resources.handbook.waitForVisible(),
      struct.tutorDashboard.resources.handbook.click()
      ]);

  // Check url
  expect(pageHandbook.url()).toContain('handbook');

  //close page
  await pageHandbook.close();

  // Read the entire Writing Lab Handbook
  const [handbookWritingLab] = await Promise.all([
      page.waitForEvent('popup'),
      struct.tutorDashboard.resources.handbookWritingLab.waitForVisible(),
      struct.tutorDashboard.resources.handbookWritingLab.click()
      ]);
  expect(handbookWritingLab.url()).toContain('handbook-writing-lab/');
  await handbookWritingLab.close();

  // Enable Desktop Notifications
  await struct.tutorDashboard.resources.notifications.waitForVisible();
  await struct.tutorDashboard.resources.notifications.click();
  await page.goBack();

  // Get familiar with the Demo Lesson Space
  await struct.tutorDashboard.resources.demoLessonSpace.waitForVisible();
  await struct.tutorDashboard.resources.demoLessonSpace.click();
  await page.goBack();

  // Make sure your Tutor Profile and Subjects are current
  await struct.tutorDashboard.resources.subjects.waitForVisible();
  await struct.tutorDashboard.resources.subjects.click();
  await page.goBack();

  await struct.tutorDashboard.resources.tutorProfile.waitForVisible();
  await struct.tutorDashboard.resources.tutorProfile.click();
  await page.goBack();

  // Learn How to Make Margin Comments Job Aid
  await struct.tutorDashboard.resources.writingLabComments.waitForVisible();

  // Visit the Tutor Help Center. Still need help? Contact Us    
  await struct.tutorDashboard.resources.helpCenter.waitForVisible();
  await struct.tutorDashboard.resources.contactUs.waitForVisible();


//tutor signs out
  await struct.tutorDashboard.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();  
  
});


it('Wl handbook is hidden for NO WL tutors', async () => {
  //create tutor
  const {
    struct,
    page,
} =  await createVisitor();

     // the tutor signs in
     await struct.authPages.signIn.email.waitForVisible();
     await struct.authPages.signIn.email.fill(nwemail.toLowerCase());
 
     await struct.authPages.signIn.password.waitForVisible();
     await struct.authPages.signIn.password.type(nwpassword);
 
     await page.waitForTimeout(2000);
     await fillRecaptcha(struct.authPages.signIn.recaptcha);
     await page.waitForTimeout(1000);
 
     await struct.authPages.signIn.signIn.waitForVisible();
     await struct.authPages.signIn.signIn.click();
     await page.waitForTimeout(3000);

  // click on availableTutoring and then Resources
  await struct.tutorDashboard.header.resources.waitForVisible();
  await struct.tutorDashboard.header.resources.click();
         
  // Check url
  expect(page.url()).toContain('/resources/');       
        
  //Read the entire Tutor Handbook
  //check HandBook link 
  const [pageHandbook] = await Promise.all([
      page.waitForEvent('popup'),
      struct.tutorDashboard.resources.handbook.waitForVisible(),
      struct.tutorDashboard.resources.handbook.click()
      ]);

  // Check url
  expect(pageHandbook.url()).toContain('handbook');

  //close page
  await pageHandbook.close();

  // Writing Lab Handbook should be hidden

  await struct.tutorDashboard.resources.handbookWritingLab.waitForHidden();


  // Enable Desktop Notifications
  await struct.tutorDashboard.resources.notifications.waitForVisible();
  await struct.tutorDashboard.resources.notifications.click();
  await page.goBack();

  // Get familiar with the Demo Lesson Space
  await struct.tutorDashboard.resources.demoLessonSpace.waitForVisible();
  await struct.tutorDashboard.resources.demoLessonSpace.click();
  await page.goBack();

  // Make sure your Tutor Profile and Subjects are current
  await struct.tutorDashboard.resources.subjects.waitForVisible();
  await struct.tutorDashboard.resources.subjects.click();
  await page.goBack();

  await struct.tutorDashboard.resources.tutorProfile.waitForVisible();
  await struct.tutorDashboard.resources.tutorProfile.click();
  await page.goBack();

  // writingLabComments should be hidden
  await struct.tutorDashboard.resources.writingLabComments.waitForHidden();

  // Visit the Tutor Help Center. Still need help? Contact Us    
  await struct.tutorDashboard.resources.helpCenter.waitForVisible();
  await struct.tutorDashboard.resources.contactUs.waitForVisible();

//tutor signs out
  await struct.tutorDashboard.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();  
  
});
});
