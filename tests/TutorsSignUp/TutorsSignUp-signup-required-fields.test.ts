import {
    userEmail,
    userPassword,
    invalidPassword,
    wrongFormatEmail,
    invalidEmail
  } from "../../lib/test-config";
  
import faker from "faker";


describe('signup - ', () => {

it('check signup modal elements', async () => {
    const {
        struct,
        page
    } = await createVisitor();

    // click on Become A Tutor link

    //click on Apply Today  
    await struct.authPages.signIn.applyToTutor.waitForVisible();
    await struct.authPages.signIn.applyToTutor.click();

    //continue with Google is avalable
    await struct.authPages.applyToTutor.google.waitForVisible();

    //Sign In
    await struct.authPages.applyToTutor.signIn.waitForVisible();

});
it('checking sign-up required fields', async () => {
    const {
        struct,
        page
    } = await createVisitor();

    //click on Apply Today  
    await struct.authPages.signIn.applyToTutor.waitForVisible();
    await struct.authPages.signIn.applyToTutor.click();

  // Select Continue with Email
  // enter an empty space
  await struct.authPages.applyToTutor.firstName.type("");
  await struct.authPages.applyToTutor.lastName.type("");
  await struct.authPages.applyToTutor.email.type("");
  await struct.authPages.applyToTutor.password.type("");

   await struct.authPages.applyToTutor.createAccount.click();

  // check the messages
  expect(await struct.authPages.applyToTutor.firstNameError.text()).toBe('This field is required.');
  expect(await struct.authPages.applyToTutor.lastNameError.text()).toBe('This field is required.');
  expect(await struct.authPages.applyToTutor.emailError.text()).toBe('This field is required.');
  expect(await struct.authPages.applyToTutor.passwordError.text()).toBe('Password must be at least 8 characters.');
  expect(await struct.authPages.applyToTutor.recaptchaError.text()).toBe('Please prove you are not a robot.');

  await struct.authPages.applyToTutor.createAccount.click();
  await page.waitForTimeout(3000);

  await struct.authPages.applyToTutor.codeOfConduct.waitForVisible();
  await struct.authPages.applyToTutor.privacy.waitForVisible();
  await struct.authPages.applyToTutor.terms.waitForVisible();


    
});
});