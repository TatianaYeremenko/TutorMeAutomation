
import {
    userEmail,
    userPassword,
    invalidPassword,
    wrongFormatEmail,
    invalidEmail
  } from "../../lib/test-config";
  
   
  describe('sign in required fields- ', () => {
    it('user is not able to sign in without Recaptcha', async () => {
        const {
            struct,
            page
        } = await createVisitor();

        // sign in  
        await struct.authPages.signIn.email.waitForVisible();
        await struct.authPages.signIn.email.type('test.valid@local.tutorme.com');
  
        await struct.authPages.signIn.password.waitForVisible();
        await struct.authPages.signIn.password.type("TutorMe1000!");
  
        await struct.authPages.signIn.signIn.click();
  
        // check validation message
        await struct.authPages.signIn.recaptchaError.waitForVisible();
        expect(await struct.authPages.signIn.recaptchaError.text()).toBe('Please prove you are not a robot.');
  
        // click sign in again
        await struct.authPages.signIn.signIn.waitForVisible();
        await struct.authPages.signIn.signIn.click();
        await page.waitForTimeout(1000);

        await struct.header.userTools.avatar.waitForHidden();
  
    });
    it('check for required field: email', async () => {
        const {
            struct,
            page
        } = await createVisitor();
  
        // sign in 
        //enter only password
        await struct.authPages.signIn.password.type(userPassword);
        await fillRecaptcha(struct.authPages.signIn.recaptcha);
  
        // click on sign in and wait         
        await  struct.authPages.signIn.signIn.click();
        await page.waitForTimeout(200);
  
  
        // check validation message
        await struct.authPages.signIn.emailError.waitForVisible();
        expect(await struct.authPages.signIn.emailError.text()).toBe('This field is required.');
  
        // click on sign in again
        await struct.authPages.signIn.signIn.waitForVisible();
        await struct.authPages.signIn.signIn.click();
        await page.waitForTimeout(1000);

        await struct.header.userTools.avatar.waitForHidden();

    });
    it('check for required field: password', async () => {
      const {
          struct,
          page
      } = await createVisitor();
  
      // sign in 
       //enter only email
      await struct.authPages.signIn.email.type(userEmail);
      await fillRecaptcha(struct.authPages.signIn.recaptcha);
  
      // click on sign in and wait
      await struct.authPages.signIn.signIn.click();
  
      await page.waitForTimeout(200);
  
      // check validation message
      await struct.authPages.signIn.passwordError.waitForVisible();
      expect(await struct.authPages.signIn.passwordError.text()).toBe('This field is required.');
  
      // click on sign in again
      await struct.authPages.signIn.signIn.waitForVisible();
      await struct.authPages.signIn.signIn.click();
      await page.waitForTimeout(1000);

      await struct.header.userTools.avatar.waitForHidden(); 
  });
  }); 
  