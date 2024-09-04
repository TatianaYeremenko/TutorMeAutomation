import faker, { random } from "faker";

describe("request modal - ", () => {
  it("student can describe a problem and upload up to 3 files", async () => {
    const { struct, page } = await createQaUser("studentWithUmbrella");

    //connect with a tutor
    await page.getByRole("link", { name: "Request a live tutor" }).click();
    await page
      .getByRole("heading", {
        name: "What subject area do you need help with?",
      })
      .isVisible();

    //select main categories
    let main_categories = ["Math", "Natural Science", "Computer Science", "Other","Humanities", "Social Science","Spanish",] ;

    for (var item of main_categories) {
    await page
      .locator("label")
      .filter({ hasText: item})
      .locator("svg")
      .first()
      .click();
      }

    await page
      .locator("label")
      .filter({ hasText: "Math" })
      .locator("svg")
      .first()
      .click();
    await struct.sessionRequest.nextArrow.click();


    //select main sub-categories
    let sub_categories = ["Basic Math","Trigonometry","Linear Algebra","Discrete Math","Statistics"] ;

    for (var item of sub_categories) {
    await page
      .locator("label")
      .filter({ hasText: item})
      .locator("svg")
      .first()
      .click();
      }
    await struct.sessionRequest.nextArrow.click();

    // fill out the Describe Problem form with a few words
    await page.getByTestId('sessionRequest.description').isVisible();
    await page.getByTestId('sessionRequest.description').fill(faker.lorem.sentence(5));

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

    const fileExamples = [
      "./lib/files/example_1.gif",
      "./lib/files/example_2.jpeg",
      "./lib/files/example_3.gif",
    ];
    await page
      .getByRole("textbox", { name: "Upload a file (optional)" })
      .click();
    await page
      .getByRole("textbox", { name: "Upload a file (optional)" })
      .setInputFiles(fileExamples);
    await page.waitForTimeout(2000);

    // remove one file and check it its removed
    await page
      .getByRole("button", { name: "Download file:" })
      .first()
      .isVisible();
    await page
      .getByRole("button", { name: "Download file:" })
      .nth(1)
      .isVisible();
    await page
      .getByRole("button", { name: "Download file:" })
      .nth(2)
      .isVisible();

    await page.getByRole("button", { name: "Download file: " }).first().click();
    await page.waitForTimeout(1000);
    await page
      .getByRole("button", { name: "Download file:" })
      .nth(2)
      .isHidden();

    // go to the Next page
    await struct.sessionRequest.nextArrow.click();
    await page.waitForTimeout(2000);

    // move to the confermation page
    await page
      .getByRole("heading", {
        name: "Are you ready for your tutoring session?",
      })
      .click();

    await page
      .getByText(
        "When you click the button below, we'll find you a tutor who can help with your r"
      )
      .click();
    const [linkToPage] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .getByText(
          "Please remember that it's not allowed to ask for help on a test or quiz. Student"
        )
        .click(),
    ]);
    linkToPage.close();
    // await page.getByRole("button", { name: "Previous" }).click();
    await struct.sessionRequest.previousArrow.click();
    await struct.sessionRequest.close.waitForVisible();

    await struct.sessionRequest.previousArrow.click();
    await struct.sessionRequest.close.waitForVisible();

    await struct.sessionRequest.previousArrow.click();
    await struct.sessionRequest.close.waitForVisible();

    expect(await page.title()).toBe("On-demand one-on-one tutoring for schools and districts | Pear Deck Tutor");
  });
});
