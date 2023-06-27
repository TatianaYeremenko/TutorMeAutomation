 
describe('sign in with google - ', () => {

it('user redirects to google account', async () => {
    const {
        struct,
        page
    } = await createVisitor();


    // select Sign In with Google Account
    await struct.authPages.signIn.google.waitForVisible();

    const [pageGoogle] = await Promise.all([
        page.waitForEvent('popup'),
        struct.authPages.signIn.google.click()
    ]);

    // Check url
    expect(pageGoogle.url()).toContain("https://accounts.google.com/");

    await pageGoogle.close();

});
});