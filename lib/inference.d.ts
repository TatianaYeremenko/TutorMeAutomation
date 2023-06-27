declare type FindButtons<T> = T extends {} ? SelectKeys<T, IButtonApi, "equals"> : never;
declare type FindInputs<T> = T extends {} ? SelectKeys<T, IInputApi, "equals"> : never;
declare type FindElements<T> = T extends {} ? SelectKeys<T, IElementApi, "extends->"> : never;
