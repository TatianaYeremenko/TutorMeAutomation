
it('tutor can able to see the past lessons and wl', async () => {
    //create tutor
    const {
      struct,
      page,
      user
  } = await createQaUser('tutor');
  
  // click on past records
  await struct.tutorDashboard.header.pastTutoring.waitForVisible();
  await struct.tutorDashboard.header.pastTutoring.click();
 

  //tutor signs out
  await struct.tutorDashboard.header.userTools.username.click();
  await struct.userMenu.signOut.click();  
});

