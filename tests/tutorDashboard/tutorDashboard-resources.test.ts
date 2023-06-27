 
  it("tutor can see new updates and news notification", async () => {
  
        //create tutor
        const {
            struct,
            page,
            user
        } = await createQaUser('tutor');

        await page.waitForTimeout(1000);

        // click on Bell Notification
        await struct.tutorDashboard.header.notifications.tutorResources.amount.waitForVisible();
        await struct.header.notifications.tutorResources.button.waitForVisible();
        await struct.header.notifications.tutorResources.button.click();

        // select new from resourse presentation
        await struct.tutorDashboard.header.notifications.tutorResources.item(4).waitForVisible();
        await struct.tutorDashboard.header.notifications.tutorResources.item(4).click();
        expect(page.url()).toContain('/resources/');

        // check Bell Notification again
        await struct.header.notifications.tutorResources.amount.waitForHidden();

        // click on availableTutoring and then Resources
        await struct.tutorDashboard.header.availableTutoring.waitForVisible();
        await struct.tutorDashboard.header.availableTutoring.click();

        // click on availableTutoring and then Resources
        await struct.tutorDashboard.header.resources.waitForVisible();
        await struct.tutorDashboard.header.resources.click();
               
        // Check url
        expect(page.url()).toContain('/resources/');       
                
        //click on Bell again
        await struct.header.notifications.tutorResources.button.waitForVisible();
        await struct.header.notifications.tutorResources.button.click();
        await struct.tutorDashboard.header.notifications.tutorResources.item(0).waitForVisible();
        await struct.tutorDashboard.header.notifications.tutorResources.item(0).click();

        //Read the entire Tutor Handbook

        //check HandBook link 
        const [pageHandbook] = await Promise.all([
            page.waitForEvent('popup'),
            struct.tutorDashboard.resources.handbook.waitForVisible(),
            struct.tutorDashboard.resources.handbook.click()
            ]);

        // Check url
        expect(pageHandbook.url()).toContain('handbook');

        //close page
        await pageHandbook.close();

        // Read the entire Writing Lab Handbook
        const [handbookWritingLab] = await Promise.all([
            page.waitForEvent('popup'),
            struct.tutorDashboard.resources.handbookWritingLab.waitForVisible(),
            struct.tutorDashboard.resources.handbookWritingLab.click()
            ]);
        expect(handbookWritingLab.url()).toContain('handbook-writing-lab/');
        await handbookWritingLab.close();

        // Enable Desktop Notifications
        await struct.tutorDashboard.resources.notifications.waitForVisible();
        await struct.tutorDashboard.resources.notifications.click();
        await page.goBack();

        // Get familiar with the Demo Lesson Space
        await struct.tutorDashboard.resources.demoLessonSpace.waitForVisible();
        await struct.tutorDashboard.resources.demoLessonSpace.click();
        await page.goBack();

        // Make sure your Tutor Profile and Subjects are current
        await struct.tutorDashboard.resources.subjects.waitForVisible();
        await struct.tutorDashboard.resources.subjects.click();
        await page.goBack();

        await struct.tutorDashboard.resources.tutorProfile.waitForVisible();
        await struct.tutorDashboard.resources.tutorProfile.click();
        await page.goBack();

        // Read Writing Lab Review Tips
        await struct.tutorDashboard.resources.writingLabTips.waitForVisible();

        // Learn How to Make Margin Comments Job Aid
        await struct.tutorDashboard.resources.writingLabComments.waitForVisible();

        // Higher Order Concerns vs. Lower Order Concerns
        await struct.tutorDashboard.resources.concerns.waitForVisible();

        // Review Templated Writing Feedback
        await struct.tutorDashboard.resources.templatedWritingFeedback.waitForVisible();

        // Visit the Tutor Help Center. Still need help? Contact Us    
        await struct.tutorDashboard.resources.helpCenter.waitForVisible();
        await struct.tutorDashboard.resources.contactUs.waitForVisible();

        //tutor signs out
        await struct.tutorDashboard.header.userTools.username.click();
        await struct.userMenu.signOut.click();

    });
