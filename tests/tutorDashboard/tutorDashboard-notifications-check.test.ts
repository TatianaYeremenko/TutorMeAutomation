it("Tutor should be able to setup the notification for recieving an email ", async () => {
    //create tutor
    const { struct, page, user } =   await createQaTutor();

    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 1920, height: 1080 });
  
    // click on Edit Profile
    await struct.tutorDashboard.header.userTools.username.waitForVisible();
    await struct.tutorDashboard.header.userTools.username.click();
  
    await page.waitForTimeout(500);
  
    //check Curriculum Area
    await struct.userMenu.myAccount.click();
    await page.waitForTimeout(500);
  
    // my account and notification should be there
    await struct.account.account.waitForVisible();
    await (
      await page.waitForSelector('//a[contains(text(),"Notifications")]')
    ).click();
    await page.waitForLoadState("load");
    await page.waitForTimeout(1000);
  
    await struct.account.notificationsOptions.sendDesktop.waitForVisible();
    await struct.account.notificationsOptions.sendDesktop.isChecked();
  
    await struct.account.notificationsOptions.missedMessages.waitForVisible();
    await struct.account.notificationsOptions.missedMessages.isChecked();
  
    await struct.account.notificationsOptions.sendEmails.waitForVisible();
    await struct.account.notificationsOptions.sendEmails.isChecked();
  
    // account menu
    await struct.tutorDashboard.header.userTools.username.click();
  
    // Privacy Policy and Terms of Service links are available
    await (
      await page.waitForSelector('//a[contains(text(),"Privacy Policy")]')
    ).waitForElementState("visible");
    await (
      await page.waitForSelector('//a[contains(text(),"Terms of Service")]')
    ).waitForElementState("visible");
  
    //tutor signs out
    await struct.userMenu.signOut.click();
  });
  it("Missed messages notification should NOT be avalable for students", async () => {
    //create tutor
    const { struct, page, user } = await createQaUser("studentWithUmbrella");
  
    await page.waitForTimeout(1000);
  
    // click on User Name
    await struct.header.userTools.username.waitForVisible();
    await struct.header.userTools.username.click();
  
    await page.waitForTimeout(500);
  
    //move to My Account
    await struct.userMenu.myAccount.click();
    await page.waitForTimeout(500);
  
    // my account and notification should be there
    await struct.account.notifications.waitForVisible();
    await struct.account.notifications.click();
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(1000);
  
    await struct.account.notificationsOptions.sendDesktop.waitForVisible();
    await struct.account.notificationsOptions.sendDesktop.isChecked();
  
    await struct.account.notificationsOptions.sendEmails.waitForVisible();
    await struct.account.notificationsOptions.sendEmails.isChecked();
  
    // missed Message should not be visible for students
    await struct.account.notificationsOptions.missedMessages.waitForHidden();
  
    // click on user menu
    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.click();
  });
  
