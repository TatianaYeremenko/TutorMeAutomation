import faker, { random } from "faker";

it("A matchpal window is open on the chat icon and a warning message is displayed for invalid email", async () => {
    const { struct, page } = await createVisitor();
    // await page.goto('https://aiasstv2.trial.tutorme.dev/sign-in/');
  
    //connect with a tutor
    // sign in
    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.fill("ai-user@local.tutor.peardeck.com");
  
    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type("AI@go!");
  
    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await page.waitForTimeout(1000);
  
    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();
  
    await page.waitForTimeout(3000);
  
    await struct.homepage.requestATutor.waitForVisible();
    await struct.homepage.requestATutor.click();
  
    await page.locator("label").filter({ hasText: "6th grade" }).click();
    await struct.sessionRequest.nextArrow.click();
    await page.waitForTimeout(2000);
  
    await page.locator("label").filter({ hasText: "Math" }).click();
    await struct.sessionRequest.nextArrow.click();
    await page.waitForTimeout(2000);
  
    await page.locator("label").filter({ hasText: "Basic Math" }).click();
    await struct.sessionRequest.nextArrow.click();
    await page.waitForTimeout(2000);
  
    await page.getByTestId("sessionRequest.description").click();
    await page
      .getByTestId("sessionRequest.description")
      .fill("If y(x-1)=z then x=");
    await page.waitForTimeout(1000);
  
    // check if Match Pal is open
    await struct.sessionRequest.matchPalCTA.waitForVisible();
    await struct.sessionRequest.matchPalCTA.click();

    // the Match Pal window is open
    await (await page.waitForSelector('//div[contains(text(),"help you get the best tutor match")]')).isVisible();

    // enter question
    await struct.modals.matchPal.content.response.fill('3 + 3x = 0');
    await page.getByTestId("modals.matchPal.content.response").press("Enter");
    await page.waitForTimeout(1000);

    // pesonal info check
    await struct.modals.matchPal.content.response.fill("tanya@tutorme.com");
    await page.getByTestId("modals.matchPal.content.response").press("Enter");
    await page.waitForTimeout(1000);

    // remove personal info
    await struct.modals.matchPal.content.redoInput.waitForVisible();
    await struct.modals.matchPal.content.redoInput.click();

    await struct.modals.matchPal.content.response.fill("6500101010");
    await page.getByTestId("modals.matchPal.content.response").press("Enter");
    await page.waitForTimeout(1000);

    //confirm that the info is not personal
    await struct.modals.matchPal.content.confirmNoPII.waitForVisible();
    await struct.modals.matchPal.content.confirmNoPII.click();

    await struct.modals.matchPal.content.response.waitForVisible();

    await struct.modals.matchPal.content.close.waitForVisible();
    await struct.modals.matchPal.content.close.click();

    await page.close();

  });
  
