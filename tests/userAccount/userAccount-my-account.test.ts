it("Usage, Notification are available for the umbrella student", async () => {
  const { page, struct } = await createQaUser("studentWithUmbrella");

  //click on User Menu
  await struct.header.userTools.openMenu.click();
  await struct.userMenu.myAccount.waitForVisible();
  await struct.userMenu.myAccount.click();

  // QR Code was removed 
  await struct.account.qrCode.waitForHidden();
  // await struct.account.qrCode.click();

  // click on Usage tab
  await struct.account.usage.waitForVisible();
  await struct.account.usage.click();
  expect(await struct.account.usageDetails.limit.text()).toBe(
    "500 minutes per week"
  );

  // notification
  await struct.account.notifications.waitForVisible();
  await struct.account.notifications.click();
  expect(await struct.account.notifications.text()).toBe("Notifications");

  // student signs out
  await struct.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();
});
