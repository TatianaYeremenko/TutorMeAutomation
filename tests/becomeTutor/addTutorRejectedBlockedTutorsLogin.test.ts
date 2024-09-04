it.each`
  username                             | password         | status
  ${"tutorrejected@local.tutorme.com"} | ${"Rr22558800!"} | ${"Rejected"}
  ${"blockedtutor@local.tutorme.com"}  | ${"Bb22558800!"} | ${"Blocked"}
`(
  '$status tutor logs in and tries to switch to a tutor profile - "Tutor Application Rejected" message is popped up',
  async ({ username, password }) => {
    const { struct, page } = await createVisitor();
    //login with new password
    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.type(username);

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type(password);
    await page.waitForTimeout(500);

    await struct.authPages.signIn.recaptcha.waitForVisible();
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await struct.authPages.signIn.recaptcha.waitForVisible();
    await page.waitForTimeout(2000);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      }),
      struct.authPages.signIn.signIn.click(),
    ]);

    //switch to a tutor mode
    await page.getByTestId("header.userTools.openMenu").click();
    await page
      .getByRole("menuitem", { name: "Switch to tutor mode" })
      .click();

    // click on Continue
    await struct.modals.tutorApplicationRejected.waitForVisible();
    await struct.modals.tutorApplicationRejected.content.close.waitForVisible();
    await struct.modals.tutorApplicationRejected.content.close.click();

    await page.waitForTimeout(1000);

    //tutor signs out
    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.click();
  }
);


<<<<<<< HEAD
//   // ${"blockedtutor@local.tutorme.com"}  | ${"Bb22558800!"} | ${"Blocked"}
=======
//   // ${"blockedtutor@local.tutorme.com"}  | ${"Bb22558800!"} | ${"Blocked"}
>>>>>>> a495ae5 (update all)
