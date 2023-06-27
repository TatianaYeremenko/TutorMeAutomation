import { isConditionalExpression } from "typescript";
import {
    suspendedUser,
    suspendedPassword
  } from "../../lib/test-config";  

describe('signIn as suspended user- ', () => {

it('suspended user should not be able to signIn, instead should get a warning message ', async () => {
    const {
        struct,
        page
    } = await createVisitor();

    // sign in

    await struct.authPages.signIn.email.type(suspendedUser);
    await struct.authPages.signIn.password.type(suspendedPassword);
   
    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);


    await struct.authPages.signIn.signIn.click();

    // Click support link support@tutorme.com
    await struct.authPages.authError.suspended.waitForVisible();
    expect(await struct.authPages.authError.support.text()).toBe('support@tutorme.com');

    await struct.authPages.authError.button.waitForVisible();
    await struct.authPages.authError.button.click();

    await page.waitForTimeout(1000);
    await struct.authPages.signIn.email.waitForVisible();    

});
});
