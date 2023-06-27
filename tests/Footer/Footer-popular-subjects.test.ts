import faker from "faker";

describe('Visitor/Regular/Umbrella Footer - ', () => {
    it.each < {
        type: QaUserKind
    } > ([{
        type: "studentWithUmbrella"
    }])
        ('$type - popular subjects search ',
            async ({
                type
            }) => {
                const s = await createQaUser(type);

                // ONLINE TUTORS IN POPULAR SUBJECTS
                expect(await (await s.page.waitForSelector('#popular-subjects')).innerText()).toBe('ONLINE TUTORS IN POPULAR SUBJECTS');

                // check in 3 of 18 links 
                // Basic Math -145
                // Calculus -146
                // Linear Algebra -150

                
                
                let subjects = [145,146,150];
                for (var val of subjects) {   
                    await s.struct.footer.subject(val).click();

                    // match with the tutor is available
                    await s.struct.tutors.autoMatchTop.waitForVisible();
                    expect(await s.struct.tutors.autoMatchTop.text()).toBe('Match with a tutor');

                }
                s.struct.footer.subject(145).click;
                await s.struct.tutors.autoMatchTop.click();
                s.struct.modals.requestLessonForm.content.description.waitForVisible();

                await s.page.waitForTimeout(5000);

                
                 // fill out the form
                await s.struct.modals.requestLessonForm.waitForVisible();
                const text = `${type} request submitted from ${(process.env.PLAYWRIGHT_PRODUCT?.toString())?.toUpperCase()} ${faker.lorem.sentence(10).toString()}`;
                await s.struct.modals.requestLessonForm.content.description.fill(text);

                await s.struct.modals.requestLessonForm.content.submit.waitForVisible();
                await s.struct.modals.requestLessonForm.content.submit.click();

                await s.page.waitForTimeout(500);

                await s.struct.modals.notifyingTutors.content.cancel.waitForVisible();
                await s.struct.modals.notifyingTutors.content.cancel.click();

                await s.page.waitForTimeout(500);

                await s.struct.modals.confirmCancel.content.cancel.waitForVisible();
                await s.struct.modals.confirmCancel.content.cancel.click();

                await s.page.waitForTimeout(500);

                // student signs out
                await s.struct.header.userTools.username.click();
                await s.struct.userMenu.signOut.click();               
            })
     
        })