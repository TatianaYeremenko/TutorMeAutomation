// using page : clean input field, 
//              checking Help Chat Box shows up

import {
  userEmail,
  userPassword,
  invalidPassword,
  wrongFormatEmail,
  invalidEmail
} from "../../lib/test-config";

describe('Ensure that validation messages appear for all invalid inputs', () => {

  it.each `
  username | password | field
  ${invalidEmail}| ${userPassword}| ${'email'},
  ${userEmail}|  ${invalidPassword}| ${'password'},
  ${invalidEmail}|  ${invalidPassword}| ${'password/email'}
`
      ('message appears when $field is invalid', async ({
          username,
          password
      }) => {
          const {
              struct,
              page
          } = await createVisitor();

         //sign in with email   
          //enter email and password
          await struct.authPages.signIn.email.waitForVisible();
          await struct.authPages.signIn.email.type(username);
          await struct.authPages.signIn.password.waitForVisible();
          await struct.authPages.signIn.password.type(password);

          //click on Recaptcha
          await struct.authPages.signIn.recaptcha.waitForVisible();
          await fillRecaptcha(struct.authPages.signIn.recaptcha);
          await page.waitForTimeout(200);


          // click on sign in and wait
          await  struct.authPages.signIn.signIn.waitForVisible(); 
          await  struct.authPages.signIn.signIn.click();
          await page.waitForTimeout(200);


          // check validation message
          await struct.authPages.signIn.passwordError.waitForVisible();
          expect(await struct.authPages.signIn.passwordError.text()).toBe('Email and/or password not recognized');
          await struct.authPages.signIn.signIn.waitForVisible();

      });
    });
