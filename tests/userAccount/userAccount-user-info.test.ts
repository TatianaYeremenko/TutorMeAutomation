import faker, { random } from "faker";
import { number } from "zod";
it.each<{
  type: QaUserKind;
}>([
  {
    type: "student",
  },
  {
    type: "studentWithUmbrella",
  },
])(
  "$type - Student can change personal info in Account and save it",
  async ({ type }) => {
    const { struct, page, user } = await createQaUser(type);

    //click on my Account
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.myAccount.click();

    //type a new Name
    const userName = faker.name.firstName();
    const userLast = faker.name.lastName();
    const userShortName = `${userName} ${userLast.slice(0, 1)}.`;
    const email = `${userName}${userLast}Test@local.tutorme.com`;

    //first name
    await struct.account.profile.firstName.clear();
    await struct.account.profile.firstName.type(userName);

    //last name
    await struct.account.profile.lastName.clear();
    await struct.account.profile.lastName.type(userLast);

    //select where are you in life
    await struct.account.profile.life.select.click();
    await page
      .getByTestId("account.profile.life.option(career).option")
      .click();

    //enter mobile phone
    await struct.account.profile.phone.click();
    await struct.account.profile.phone.type("000");
    await struct.account.profile.submit.click();
    await struct.account.profile.phoneError.waitForVisible();
    expect(await struct.account.profile.phoneError.text()).toBe(
      "Mobile phone number format is not valid."
    );

    //phone number
    await struct.account.profile.phone.clear();
    const phoneNumber = faker.datatype.number(9999999999);
    await struct.account.profile.phone.type("6502241234".toString());
    // await struct.account.profile.phone.type(phoneNumber.toString());
    await struct.account.profile.submit.click();
    await page.waitForTimeout(1000);

    //click on my Account again
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.myAccount.click();

    // check the phone number
    expect(await struct.account.profile.phone.value()).toBe(
      "6502241234".toString()
    );
    // console.log(await struct.account.profile.phone.value());

    // check the first name
    expect(await struct.account.profile.firstName.value()).toBe(userName);

    // check the last name
    expect(await struct.account.profile.lastName.value()).toBe(userLast);

    //click on my Account and Sign Out
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.signOut.click();
  }
);
