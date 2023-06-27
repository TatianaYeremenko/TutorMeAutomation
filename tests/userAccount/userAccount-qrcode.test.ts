    it('QR Code is available for the umbrella student', async () => {
        const {
            page,
            struct
        } = await createQaUser('studentWithUmbrella');

        //click on User Menu
        await struct.header.userTools.avatar.click();
        await struct.userMenu.myAccount.waitForVisible();
        await struct.userMenu.myAccount.click();
        
        // click on QR Code tab
        await struct.account.qrCode.waitForVisible();
        await struct.account.qrCode.click();

        // check in QR Code is available
        await struct.account.qr.code.waitForVisible();

        // student signs out
        await struct.header.userTools.username.click();
        await struct.userMenu.signOut.click();

    });