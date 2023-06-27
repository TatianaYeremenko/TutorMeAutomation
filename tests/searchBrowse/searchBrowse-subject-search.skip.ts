describe('error message displays for invalid search', () => {
it.each `
input 
${'   '},
${'12345'},
${'!@#'}
`
    ('error message displays when $input is entered', async ({input}) => {

    //create student
    const v = await createQaUser('studentWithUmbrella');   

    await v.struct.header.subjectsMenu.subjectsButton.waitForVisible();
    await v.struct.header.subjectsMenu.subjectsButton.click();

    await v.struct.header.subjectsMenu.category(1).click();
   

    //search for a subject
    await v.struct.header.subjectSuggest.input.waitForVisible();
    await v.struct.header.subjectSuggest.input.click();
    await v.struct.header.subjectSuggest.input.type(input);
    await v.struct.header.subjectSuggest.input.press('Enter');


    });

});