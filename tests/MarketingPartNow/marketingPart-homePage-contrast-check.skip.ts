describe("Home Page - ", () => {
    it.each<{
      type: QaUserKind;
    }>([
      {
        type: "student",
      },
      {
        type: "studentWithUmbrella",
      }])
      ('$type -  "Skip to content" and "Enable contrast version" options are available',
        async ({ type }) => {
        const s = await createQaUser(type);
  
        // click on logo the page
        await s.struct.header.logo.waitForVisible();
        await s.struct.header.logo.click();
  
        expect(s.page.url()).toBe("https://testing.tutorme.com/");
  
        // reload the page
        await s.page.reload();
        expect(s.page.url()).toBe("https://testing.tutorme.com/");
  
        // check Skip to content button
        await s.page.keyboard.press("Tab");
        await s.page.waitForSelector('//div[contains(text(),"Skip to content")]');
  
        // check Skip to content button
        await s.page.keyboard.press("Tab");
        await s.page.waitForSelector('//div[contains(text(),"Enable contrast version")]' );
        await s.page.keyboard.press("Enter");
  
        const pageWeb = await s.page.waitForSelector("#react-app");
  
        //check the background colors
        const bcColors = await pageWeb.evaluate((el) => {
          return window.getComputedStyle(el).getPropertyValue("background-color");
        });
        // console.log(bcColors);
        expect(bcColors).toBe("rgb(255, 255, 255)");
      }
    );
  });
  