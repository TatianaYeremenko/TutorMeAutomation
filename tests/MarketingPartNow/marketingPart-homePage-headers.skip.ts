describe("all headers in the top bar navigation are displayed correctly", () => {
    type HeaderButtons = FindButtons<StructApi["header"]>;
    it.each<{
      name: string;
      create: () => Promise<{ struct: StructApi }>;
      visible: HeaderButtons[];
      hidden: HeaderButtons[];
    }>([
      {
        name: "visitor",
        create: createVisitor,
        visible: ["signIn", "courses", "requestAQuote","logo"],
        hidden: [],
    
      },
      {
        name: "regular student",
        create: () => createQaUser("student"),
        visible: ["courses","requestAQuote","logo"],
        hidden: ["signIn"],
      },
      {
        name: "student with billing",
        create: () => createQaUser("studentWithBilling"),
        visible: ["courses","logo"],
        hidden: ["signIn","requestAQuote"],
      },
      {
        name: "umbrella student",
        create: () => createQaUser("studentWithUmbrella"),
        visible: ["courses", "logo","courses"],
        hidden: ["signIn", "requestAQuote"],
      },
      // {
      //   name: "tutor",
      //   create: () => createQaUser("tutor"),
      //   visible: ["logo"],
      //   hidden: ["signIn", "courses", "requestAQuote"],
      // },
    ])("for $name", async ({ create, visible, hidden }) => {
      const { struct } = await create();
      for (const key of visible) {
        await struct.header[key].waitForVisible();
      }
      for (const key of hidden) {
        await struct.header[key].waitForHidden();
      }
    });
  });