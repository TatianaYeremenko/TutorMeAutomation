type StructSource = typeof import("@tutorme/sitestruct").source;
type StructRecord = import("@tutorme/sitestruct").StructRecord;
type Page = import("playwright").Page;
type ElementHandle = import("playwright").ElementHandle<HTMLElement>;

type WaitForSelectorOptions = ArgumentsOf;

declare type StructApi = ApiFor<StructSource>;

declare type QaUserKind = "student" | "studentWithBilling" | "studentWithUmbrella" | "tutor";

declare var qaUserButtons: Record<QaUserKind, string>;

declare function fillRecaptcha(element: IElementApi): Promise<void>;

declare function createQaUser(kind: keyof typeof qaUserButtons): Promise<{
  page: Page;
  user: UserData;
  struct: StructApi;
}>;

declare function getUserData(page: Page): Promise<UserData | undefined>;

declare function createVisitor(): Promise<{
  page: Page;
  struct: StructApi;
}>;

declare function createAdmin(): Promise<{
  page: Page;
}>;

declare function launchBrowser(url: string): Promise<Page>;

declare function sleep(ms: number): Promise<void>;

declare type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  shortName: string;
  email: string;
  mode: "student" | "tutor";
};

declare interface IElementApi {
  exists(): Promise<boolean>;
  waitForVisible(options?: { timeout: number }): Promise<ElementHandle>;
  waitForHidden(options?: { timeout: number }): Promise<ElementHandle>;
  text(): Promise<string>;
}

declare interface IButtonApi extends IElementApi {
  click(): Promise<void>;
  check(): Promise<void>;
  uncheck(): Promise<void>;
  isChecked(): Promise<boolean>;
}

declare interface IInputApi extends IElementApi {
  type(value: string): Promise<void>;
  fill(value: string): Promise<void>;
  press(key: string): Promise<void>;
  click(): Promise<void>;
  clear(): Promise<void>;
  selectFiles(files: string | string[]): Promise<void>;
  value(): Promise<string>;
  focus(): Promise<void>;
}

declare interface IModalApi<T> extends IElementApi {
  close(): Promise<void>;
  content: ApiFor<T>;
}

type RenameKey<K> = K extends `${infer ModalName}Modal`
  ? ModalName
  : K extends `${infer DynamicName}ById`
  ? DynamicName
  : K;

declare type ApiFor<T> = T extends "button"
  ? IButtonApi
  : T extends "div"
  ? IElementApi
  : T extends "input"
  ? IInputApi
  : T extends Record<string, any>
  ? {
      [K in keyof T as RenameKey<K>]: K extends `${infer _modalName}Modal`
        ? IModalApi<T[K]>
        : K extends `${infer _dynamicName}ById`
        ? (id: number | string) => ApiFor<T[K]>
        : ApiFor<T[K]>;
    }
  : never;
