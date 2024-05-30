it("Past Records Tutoting and Writing Lab pages are available for the umbrella student", async () => {
    const { page, struct } = await createQaUser("studentWithUmbrella");
  
    //click on User Menu
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.pastLessons.waitForVisible();
    await struct.userMenu.pastLessons.click();
    // expect(await page.title()).toBe("TutorMe | Past Lessons");
    await page
      .locator('//h3[contains(text(),"had any sessions yet")]')
      .isVisible();
  
    // click on wl tab
    await struct.account.pastLessons.writing.link.waitForVisible();
    await struct.account.pastLessons.writing.link.click();
    await page.locator('//h3[contains(text(),"writing labs yet")]').isVisible();
  
    // click on wl tab
    await struct.account.pastLessons.tutoring.link.waitForVisible();
    await struct.account.pastLessons.tutoring.link.click();
    // expect(await page.title()).toBe("TutorMe | Past Lessons");
  
    // student signs out
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.signOut.click();
  });
  