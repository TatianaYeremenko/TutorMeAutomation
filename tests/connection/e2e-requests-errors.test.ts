it('Requests timing', async () => {
    const {
        struct,
        page
    } = await createVisitor();

const [request] = await Promise.all([
  page.waitForEvent('requestfinished'),
  page.goto('http://develop.testing.tutorme.dev/sign-in')
]);

console.log('Requests timing ' + request.redirectedFrom());
console.log('Request failure error' + request.failure());

});
