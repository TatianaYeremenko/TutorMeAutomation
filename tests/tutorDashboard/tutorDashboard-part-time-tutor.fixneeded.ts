it("tutor can able to see the past lessons and wl", async () => {
  //create tutor
  const { struct, page, user } =  await createQaTutor();
  
  // click on Past Records
  await struct.tutorDashboard.header.pastTutoring.waitForVisible();
  await struct.tutorDashboard.header.pastTutoring.click();

  // find lessons
  await struct.tutorDashboard.pastLessons.findLessons.click();

  // click on Past Records agian and check WL
  await struct.tutorDashboard.header.pastTutoring.click();
  await struct.tutorDashboard.pastLessons.pastWriting.click();

  await struct.tutorDashboard.pastWriting.findWriting.click();

  //tutor signs out
  await struct.tutorDashboard.header.userTools.openMenu.click();
  await struct.userMenu.signOut.click();
});
