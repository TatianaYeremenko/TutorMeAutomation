import faker, { random } from "faker";

it("Upon not finding an online tutor, Myles' penguin will assist", async () => {
  //create student
  const t = await createQaUser("tutor");

  // get tutor name and id
  let tutor_Id = t.user.id.toString();
  console.log(tutor_Id);
  await t.page.waitForTimeout(20000);
  await t.page.reload();


  //create student
  const s = await createQaUser("studentWithUmbrella");

  // go to browse tutors
  await s.struct.footer.browseTutors.waitForVisible();
  await s.struct.footer.browseTutors.click();
  await s.page.keyboard.down("PageDown");

  // check filter online available tutors
  await s.struct.tutors.filter.onlineNow.waitForVisible();
  await s.struct.tutors.filter.onlineNow.check();
  await s.page.waitForTimeout(1000);


  // check if the tutor is online available
  await s.struct.tutors.tutor(tutor_Id).avatar.waitForVisible();

  // check if online icon is popup
  await s.page.waitForSelector('//div[contains(text(),"Online")]');
  expect(
    await (
      await s.page.waitForSelector('//div[contains(text(),"Online")]')
    ).textContent()
  ).toBe("Online now");

  await s.struct.tutors.filter.female.waitForVisible();
  await s.struct.tutors.filter.female.click();

  // Myles's Penguin should be visiable
  await s.struct.tutors.noResults.waitForVisible();

  // student signs out
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
});
