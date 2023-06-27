let email = ''
it("The tutor gets approved", async () => { {email}
    //create Admin
    const a = await createAdmin();
    await a.page.waitForTimeout(1000);
    await a.page.keyboard.down("PageDown");

    await (
      await a.page.waitForSelector('//a[contains(text(),"Tutor profiles")]')
    ).click();
    await a.page.waitForTimeout(200);
    await (
      await a.page.waitForSelector('//input[@id="searchbar"]')
    ).fill(email.toLowerCase());
    await (await a.page.waitForSelector('//input[@type="submit"]')).click();
    await a.page.waitForTimeout(200);

    const tutors = await a.page.$$("//th/a");
    await tutors[0].click();

    await (
      await a.page.waitForSelector('//a[contains(text(),"Approve")]')
    ).click();
    await a.page.waitForTimeout(500);

    await a.page.waitForTimeout(5000);
    await a.page.keyboard.down("PageDown");
    await a.page.keyboard.down("PageDown");
    await (await a.page.waitForSelector('//input[@value="Save"]')).click();
    await a.page.waitForTimeout(500);
    await a.page.goBack();
    await a.page.close();
  });
