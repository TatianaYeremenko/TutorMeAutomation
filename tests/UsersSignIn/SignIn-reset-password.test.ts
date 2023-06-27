import {
  userEmail,
  invalidPassword,
  wrongFormatEmail
} from "../../lib/test-config";

describe('reset password - ', () => {
  test('test', async () => {
    const {
        struct,
        page
    } = await createVisitor();

    // console.log(page.url().toString());
    // await page.getByTestId('authPages.signIn.forgotPassword').click();

      // click on Forgot Password and Reset Modal pops-up
      await struct.authPages.signIn.forgotPassword.waitForVisible();
      await struct.authPages.signIn.forgotPassword.click();
      await page.waitForTimeout(2000);

      // check validation message for required email
      await struct.authPages.resetPassword.sendResetLink.waitForVisible();
      await struct.authPages.resetPassword.sendResetLink.click();
      await page.waitForTimeout(1000);

      expect(await struct.authPages.resetPassword.emailError.text()).toBe('This field is required.');

      // enter invalid email and check validation message
      await struct.authPages.resetPassword.email.fill(wrongFormatEmail);
      await struct.authPages.resetPassword.sendResetLink.click();
      await page.waitForTimeout(1000);

      expect(await struct.authPages.resetPassword.emailError.text()).toBe('You have entered an invalid email address. Please try again.');

      // enter invalid email and check validation message
      await struct.authPages.resetPassword.email.type('test @gmail.com');
      await struct.authPages.resetPassword.sendResetLink.click();
      await page.waitForTimeout(1000);

      expect(await struct.authPages.resetPassword.emailError.text()).toBe('You have entered an invalid email address. Please try again.');

      //clean input field
      await struct.authPages.resetPassword.email.fill('');

      //re-type valid email
      await struct.authPages.resetPassword.email.type(userEmail);
      await struct.authPages.resetPassword.sendResetLink.click();
      await page.waitForTimeout(200);

      // Resent Modal pops-up
      await struct.authPages.resetPassword.successMessage.waitForVisible();
      await struct.authPages.resetPassword.support.waitForVisible();
      expect(await struct.authPages.resetPassword.support.text()).toBe('support@tutorme.com');
      await page.goBack();

      await struct.authPages.signIn.email.waitForVisible();
  });
});