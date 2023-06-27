it('check titles and meta', async () => {

    const {
        struct,
        page
    } = await createVisitor();


const pagesUrls = [

"https://testing.tutorme.com/",
"https://testing.tutorme.com/apply/",
"https://testing.tutorme.com/subjects/",
"https://testing.tutorme.com/k12-partners/",
"https://testing.tutorme.com/academic-partners-schools/",
"https://testing.tutorme.com/corporate-partners/",
"https://testing.tutorme.com/account/",
"https://testing.tutorme.com/parents/",
"https://testing.tutorme.com/courses/",
"https://testing.tutorme.com/academic-partners-libraries/",
"https://testing.tutorme.com/about/",
"https://testing.tutorme.com/accessibility/",
"https://testing.tutorme.com/demo/whiteboard/",
"https://testing.tutorme.com/press/",
"https://testing.tutorme.com/honor-code/",
"https://testing.tutorme.com/covid-19/",
"https://testing.tutorme.com/terms/",
"https://testing.tutorme.com/careers/",
"https://testing.tutorme.com/privacy/",
"https://act.tutorme.com/courses/ACT",
"https://act.tutorme.com/users/sign_in",
"https://act.tutorme.com/users/sign_up",
"https://gre.tutorme.com/courses/gre",
// "https://gre.tutorme.com/users/password/new",
"https://gre.tutorme.com/users/sign_in",
"https://gre.tutorme.com/users/sign_up"
]  as
const;

for (const name of pagesUrls) {
    await  page.goto(name);
    let url = page.url();
    let title = await page.title();
    let meta = await page.getAttribute('//meta[@name="description"]','content');

    console.log("Url: "+ url + '\n' + "Title: " + title + '\n'+ "Meta: " + meta);
  
}

});


//testing.tutorme.com/apply/