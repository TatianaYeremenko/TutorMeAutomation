import { number } from "zod";

it("tutor Heatmap displays correctly and works", async () => {
  //create tutor
  const { struct, page, user } = await createQaUser("tutor");

  await page.waitForTimeout(1000);
    
  //update subjects
  await page.locator('//button[contains(text(),"Update my subjects")]').click();
  await page.waitForTimeout(500);

  await page.locator('label').filter({ hasText: 'Early MathSubjects include: Basic Math, Pre-Algebra, Algebra, Geometry' }).locator('svg').click();
  await page.keyboard.press('PageDown');
  await page.keyboard.press('PageDown');

  await struct.account.subjects.save.click();
  await page.getByRole('link', { name: 'Go to my account' }).click();

  // click on Background Check
  await struct.tutorDashboard.header.heatmap.waitForVisible();
  expect(await struct.tutorDashboard.header.heatmap.text()).toBe("Heatmap");
  await struct.tutorDashboard.header.heatmap.click();

  // check url
  expect(page.url()).toContain("heatmap");

  // click on  "your subjects" link
  await struct.tutorDashboard.heatmap.subjects.waitForVisible();
  expect(await struct.tutorDashboard.heatmap.subjects.text()).toBe(
    "your subjects"
  );
  await struct.tutorDashboard.heatmap.subjects.click();

  // check url
  expect(page.url()).toContain("subjects");
  await page.goBack();

  // check the chart
  await struct.tutorDashboard.heatmap.day(0.0).waitForVisible();
  await struct.tutorDashboard.heatmap.day(0.6).waitForVisible();
  await struct.tutorDashboard.heatmap.day(5.0).waitForVisible();
  await struct.tutorDashboard.heatmap.day(5.6).waitForVisible();

  // check the dates
  const current = new Date();
  const todayWeekDay = current.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const todayDay = current.toLocaleDateString("en-US", { day: "2-digit" });
  const todayMonth = current.toLocaleDateString("en-US", { month: "numeric" });
  const fullDay = todayWeekDay + " " + todayMonth + "/" + todayDay;

  expect(await struct.tutorDashboard.heatmap.day(0).text()).toBe(fullDay);
  // console.log(fullDay);

  const weekAhead = new Date(current.setDate(current.getDate() + 6));
  const weekAheadWeekDay = weekAhead.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const weekAheadDay = weekAhead.toLocaleDateString("en-US", {
    day: "2-digit",
  });
  const weekAheadMonth = weekAhead.toLocaleDateString("en-US", {
    month: "numeric",
  });
  const weekAheadFullDay =
    weekAheadWeekDay + " " + weekAheadMonth + "/" + weekAheadDay;

  expect(await struct.tutorDashboard.heatmap.day(6).text()).toBe(
    weekAheadFullDay
  );
  // console.log(weekAheadFullDay);

  //tutor signs out
  await struct.tutorDashboard.header.userTools.username.click();
  await struct.userMenu.signOut.click();
});
