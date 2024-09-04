import faker, { random } from "faker";

it("A matchpal window is open and the invalid input entering check works, as well as messages are displayed", async () => {
    const { struct, page } = await createQaUser('studentWithUmbrella');

    await struct.homepage.requestATutor.waitForVisible();
    await struct.homepage.requestATutor.click();
    await page.waitForTimeout(1000);

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
    await struct.sessionRequest.refineSearch.waitForVisible();
    await struct.sessionRequest.refineSearch.click();

    // the Match Pal window is open
    await (await page.waitForSelector('//div[contains(text(),"help you get the best tutor match")]')).isVisible();

    // more than 255 should not be entered
    await struct.modals.matchPal.content.response.fill("Can you help me with my question"  + faker.lorem.words(50));
    await page.getByTestId("modals.matchPal.content.response").press("Enter");
    await page.waitForTimeout(1000);

    // warning message should be displayed
    await (await page.waitForSelector('//span[contains(text(),"The max number of characters for this field is 255.")]')).isVisible();

    //clean
    await struct.modals.matchPal.content.response.clear();
    await struct.modals.matchPal.content.response.fill('3 + 3x = 0');
    await page.getByTestId("modals.matchPal.content.response").press("Enter");
    await page.waitForTimeout(1000);

    // warning message should be removed
    await page.locator('//span[contains(text(),"The max number of characters for this field is 255.")]').isHidden();

    // pesonal info check
    await struct.modals.matchPal.content.response.fill("6501010101");
    await page.getByTestId("modals.matchPal.content.response").press("Enter");
    await page.waitForTimeout(1000);

    // remove personal info
    await struct.modals.matchPal.content.redoInput.waitForVisible();
    await struct.modals.matchPal.content.redoInput.click();

    await struct.modals.matchPal.content.response.fill("65009090909");
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
  
