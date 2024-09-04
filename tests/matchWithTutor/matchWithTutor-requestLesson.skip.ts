import faker, { random } from "faker";
import { product } from "../../lib/shared";

it("student requests a lesson", async () => {
  //create student
  const { struct, page } = await createQaUser("studentWithUmbrella");

  //connect with a tutor
  await page.getByRole("link", { name: "Request a live tutor" }).click();
  await page
    .getByRole("heading", { name: "What subject area do you need help with?" })
    .click();

  //select main categories
  await page
    .locator("label")
    .filter({ hasText: "Math" })
    .locator("svg")
    .first()
    .click();
  await page.getByRole("button", { name: "Next" }).click();

  //select main sub-categories
  await page
    .locator("label")
    .filter({ hasText: "Basic Math" })
    .locator("svg")
    .click();
  await page.getByRole("button", { name: "Next" }).click();

  // fill out the Describe Problem form with a few words
  await page
    .getByRole("textbox", {
      name: "Let your tutor know how they can help you (optional)",
    })
    .click();
  await page
    .getByRole("textbox", {
      name: "Let your tutor know how they can help you (optional)",
    })
    .fill(faker.lorem.sentence(5));

  await page
    .getByText(
      "Example: I need help with my math homework. I don’t understand how to multiply 3"
    )
    .isVisible();
  await page
    .getByText(
      "Examples: a photo of your notes, a PDF of practice questions for an upcoming tes"
    )
    .isVisible();

  await page.getByRole("textbox", { name: "Upload a file (optional)" }).click();
  await page
    .getByRole("textbox", { name: "Upload a file (optional)" })
    .setInputFiles("./lib/files/example_1.gif");
  await page.waitForTimeout(2000);

  // go to the Next page
  await page.getByRole("button", { name: "Next" }).click();
  await page.waitForTimeout(2000);

  // move to the confermation page
  await page.getByRole("button", { name: "Request a tutor" }).click();

  // move to the waiting page
  await page
    .getByRole("heading", { name: "Finding you a tutor..." })
    .isVisible();
  await page
    .getByText(
      "Are you ready for your session? Please find a quiet place and prepare to share y"
    )
    .isVisible();
  await page.getByRole("button", { name: "Pause animation" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Resume animation" }).click();
  await page.waitForTimeout(1000);

  //cancell the request
  await struct.modals.notifyingTutors.content.cancel.click();

  // confirm cancelling
  await page.getByRole("heading", { name: "Cancel your request?" }).isVisible();
  // click on keep searching
  await struct.modals.confirmCancel.content.keepSearching.waitForVisible();
  await struct.modals.confirmCancel.content.keepSearching.click();
  // cancel again
  await struct.modals.notifyingTutors.content.cancel.waitForVisible();
  await struct.modals.notifyingTutors.content.cancel.click();

  // confirm cancelling
  await page
    .getByText(
      "We're looking for the right-match tutor, so you can start your session soon. If "
    )
    .isVisible();
  await struct.modals.confirmCancel.content.cancel.waitForVisible();
  await struct.modals.confirmCancel.content.cancel.click();

  await page
    .getByRole("heading", { name: "What can a tutor help you with today?" })
    .isVisible();
});
