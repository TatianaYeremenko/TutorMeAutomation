
it('tutor can able to see the past lessons and wl', async () => {
    //create tutor
    const {
      struct,
      page,
      user
  } = await createQaUser('tutor');

  await page.waitForTimeout(1000);
            
  //update subjects
  await page.locator('//button[contains(text(),"Update my subjects")]').click();
  await page.waitForTimeout(500);

  await page.locator('label').filter({ hasText: 'Early MathSubjects include: Basic Math, Pre-Algebra, Algebra, Geometry' }).locator('svg').click();
  await page.keyboard.press('PageDown');
  await page.keyboard.press('PageDown');

  await struct.account.subjects.save.click();
  await page.getByRole('link', { name: 'Go to my account' }).click();

  
  // click on past records
  await struct.tutorDashboard.header.pastTutoring.waitForVisible();
  await struct.tutorDashboard.header.pastTutoring.click();
 

  //tutor signs out
  await struct.tutorDashboard.header.userTools.username.click();
  await struct.userMenu.signOut.click();  
});

