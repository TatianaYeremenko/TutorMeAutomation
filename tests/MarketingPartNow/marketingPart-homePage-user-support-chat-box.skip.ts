describe('Visitor/Regular/Umbrella Home Page - ', () => {
    it.each < {
            type: QaUserKind
        } >
        ([{
                type: "student"
            },
            {
                type: "studentWithUmbrella"
            }])
        ('$type - User Support Chat Box is available and working',
            async ({
                type
            }) => {
                const s = await createQaUser(type);
  
                // click on the box
                await s.page.click('[aria-label="Open Intercom Messenger"]');
  
                //click on message
                await s.page.frame({
                    name: 'intercom-messenger-frame'
                })?.click('[aria-label="Send a message…"]');
  
                // type the message
                await s.page.frame({
                    name: 'intercom-messenger-frame'
                })?.type('[aria-label="Send a message…"]', 'Hello I\'m having some technical difficulties. Please help me', {
                    delay: 100
                });
  
                // press Enter
                await s.page.frame({
                    name: 'intercom-messenger-frame'
                })?.press('[aria-label="Send a message…"]', 'Enter');
  
                // select gif image
                await s.page.frame({
                    name: 'intercom-messenger-frame'
                })?.click('[aria-label="Gif picker"]');
  
                // send gif image
                await s.page.frame({
                    name: 'intercom-messenger-frame'
                })?.click('[aria-label="Send gif"]');
  
                // select emoji
                await s.page.frame({
                    name: 'intercom-messenger-frame'
                })?.click('[aria-label="Emoji picker"]');
  
                // click on the first one
                await s.page.frame({
                    name: 'intercom-messenger-frame'
                })?.click('text=👍');
  
                // click on the box
                await s.page.frame({
                    name: 'intercom-launcher-frame'
                })?.click('[aria-label="Close Intercom Messenger"]');
                
            });
            it('visitor - User Support Chat Box is available and working', async () => {
              const s = await createVisitor();

                  // click on the box]
                  await s.struct.header.logo.waitForVisible();
                  await s.struct.header.logo.click();

                  await s.page.waitForTimeout(1000);

                //   await s.page.click('[aria-label="Open Intercom Messenger"]');
                  await s.page.click('//div[@class="_8beb7a"]');
    
                  //click on message
                  await s.page.frame({
                      name: 'intercom-messenger-frame'
                  })?.click('[aria-label="Send a message…"]');
    
                  // type the message
                  await s.page.frame({
                      name: 'intercom-messenger-frame'
                  })?.type('[aria-label="Send a message…"]', 'Hello I\'m having some technical difficulties. Please help me', {
                      delay: 100
                  });
    
                  // press Enter
                  await s.page.frame({
                      name: 'intercom-messenger-frame'
                  })?.press('[aria-label="Send a message…"]', 'Enter');
    
                  // select gif image
                  await s.page.frame({
                      name: 'intercom-messenger-frame'
                  })?.click('[aria-label="Gif picker"]');
    
                  // send gif image
                  await s.page.frame({
                      name: 'intercom-messenger-frame'
                  })?.click('[aria-label="Send gif"]');
    
                  // select emoji
                  await s.page.frame({
                      name: 'intercom-messenger-frame'
                  })?.click('[aria-label="Emoji picker"]');
    
                  // click on the first one
                  await s.page.frame({
                      name: 'intercom-messenger-frame'
                  })?.click('text=👍');
    
                  // click on the box
                  await s.page.frame({
                      name: 'intercom-launcher-frame'
                  })?.click('[aria-label="Close Intercom Messenger"]');
                  
              });
  
   
  });