import faker, {
  random
} from "faker";
import {product } from "../../lib/shared"; 

it("multiple students request a lesson at the same time for English Language Arts", async () => {

  for (let i = 0; i < 5; i++) {

    //create student
    const s = await createQaUser('studentWithUmbrella');
    const studentId  = ''+  s.user.id.toString() + '';
    
    //connect with a tutor
    await s.struct.homepage.requestATutor.waitForVisible();
    await s.struct.homepage.requestATutor.click();

    await s.page.locator('//span[contains(text(),"2nd grade")]').click();     
    await s.struct.sessionRequest.nextArrow.click();
    

   //select main categories
    await s.page
     .locator("label")
     .filter({ hasText: "English Language Arts" })
     .locator("svg")
     .first()
     .click();
    await s.struct.sessionRequest.nextArrow.click();

    function getRandomInt(max: number) {
       return Math.floor(Math.random() * max);
     }
    
    let sub_categories = ["English","English as a Second Language","Literature","ACT/SAT English/Reading","Writing","ACT/SAT writing"] ;
    // let one = getRandomInt(3);
    // console.log(sub_categories[one]);  
    await s.page
      .locator("label")
      .filter({ hasText: sub_categories[getRandomInt(5)]})
      .locator("svg")
      .first()
      .click();
    await s.page.waitForTimeout(500);

   // go to the Next page
    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(1000);

   // go to the Next page
    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(1000);

    // await s.page.locator('//div/p[contains(text(),"I am so lost")]').clear();
    await s.page.locator('label').filter({ hasText: 'I am so lost' }).click();

    await s.page.locator('label').filter({ hasText: 'Audio only' }).click();
    await s.struct.sessionRequest.nextArrow.click();


    // move to the confirmation page
    await s.struct.sessionRequest.codeOfConduct.click();
    await s.struct.sessionRequest.requestTutor.click();
    await s.page.waitForTimeout(200);
   }
}
);
it("multiple students request a lesson at the same time for Math", async () => {

for (let i = 0; i < 5; i++) {

//create student
const s = await createQaUser('studentWithUmbrella');
const studentId  = ''+  s.user.id.toString() + '';

//connect with a tutor
await s.struct.homepage.requestATutor.waitForVisible();
await s.struct.homepage.requestATutor.click();

await s.page.locator('//span[contains(text(),"2nd grade")]').click();     
await s.struct.sessionRequest.nextArrow.click();

//select main categories
await s.page
  .locator("label")
  .filter({ hasText: "Math" })
  .locator("svg")
  .first()
  .click();
  await s.struct.sessionRequest.nextArrow.click();

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  
let sub_categories = ["Basic Math","Algebra","Pre-Algebra","Geometry","Pre-Calculus","Calculus","Trigonometry","ACT/SAT Math","Applied Math","Linear Algebra","Statistic"] ;
  // let one = getRandomInt(3);
  // console.log(sub_categories[one]);  
  await s.page
    .locator("label")
    .filter({ hasText: sub_categories[getRandomInt(10)]})
    .locator("svg")
    .first()
    .click();
  await s.page.waitForTimeout(500);

// go to the Next page
await s.struct.sessionRequest.nextArrow.click();
await s.page.waitForTimeout(1000);

// go to the Next page
await s.struct.sessionRequest.nextArrow.click();
await s.page.waitForTimeout(1000);

// await s.page.locator('//div/p[contains(text(),"I am so lost")]').clear();
await s.page.locator('label').filter({ hasText: 'I am so lost' }).click();
// await s.struct.sessionRequest.confidence(3).click();

await s.page.locator('label').filter({ hasText: 'Audio only' }).click();
await s.struct.sessionRequest.nextArrow.click();


// move to the confirmation page
await s.struct.sessionRequest.codeOfConduct.click();
await s.struct.sessionRequest.requestTutor.click();
await s.page.waitForTimeout(200);
}
}
);
it("multiple students request a lesson at the same time for Spanish", async () => {

for (let i = 0; i < 5; i++) {

//create student
const s = await createQaUser('studentWithUmbrella');
const studentId  = ''+  s.user.id.toString() + '';

//connect with a tutor
await s.struct.homepage.requestATutor.waitForVisible();
await s.struct.homepage.requestATutor.click();

await s.page.locator('//span[contains(text(),"2nd grade")]').click();     
await s.struct.sessionRequest.nextArrow.click();

//select main categories
await s.page
  .locator("label")
  .filter({ hasText: "Spanish" })
  .locator("svg")
  .first()
  .click();

// go to the Next page
await s.struct.sessionRequest.nextArrow.click();
await s.page.waitForTimeout(1000);

// go to the Next page
await s.struct.sessionRequest.nextArrow.click();
await s.page.waitForTimeout(1000);

// await s.page.locator('//div/p[contains(text(),"I am so lost")]').clear();
await s.page.locator('label').filter({ hasText: 'I am so lost' }).click();

await s.page.locator('label').filter({ hasText: 'Audio only' }).click();
await s.struct.sessionRequest.nextArrow.click();


// move to the confirmation page
await s.struct.sessionRequest.codeOfConduct.click();
await s.struct.sessionRequest.requestTutor.click();
await s.page.waitForTimeout(200);
}
}
);

