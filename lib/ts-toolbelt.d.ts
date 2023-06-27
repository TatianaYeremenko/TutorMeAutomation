// copy from ts-toolbelt

/**
 * Describes the match strategy when matching types
 * * `default`     : `extends->`
 * * `contains->`  : X contains   Y ([[Contains]]<X, Y>)
 * * `extends->`   : X extends    Y ([[Extends]]<X, Y>)
 * * `<-contains`  : Y contains   X ([[Contains]]<Y, X>)
 * * `<-extends`   : Y extends    X ([[Extends]]<Y, X>)
 * * `equals`      : X equals     Y (([[Equals]]<X, Y>))
 */
declare type _Match =
  | "default"
  | "contains->"
  | "extends->"
  | "<-contains"
  | "<-extends"
  | "equals";

/**
 * Check whether `A1` is part of `A2` or not. The difference with
 * `extends` is that it forces a [[Boolean]] return.
 * @param A1
 * @param A2
 * @returns [[Boolean]]
 * @example
 * ```ts
 * import {A} from 'ts-toolbelt'
 *
 * type test0 = A.Extends<'a' | 'b', 'b'> // Boolean
 * type test1 = A.Extends<'a', 'a' | 'b'> // True
 *
 * type test2 = A.Extends<{a: string}, {a: any}>      // True
 * type test3 = A.Extends<{a: any}, {a: any, b: any}> // False
 *
 * type test4 = A.Extends<never, never> // False
 * /// Nothing cannot extend nothing, use `A.Equals`
 * ```
 */
declare type _Extends<A1 extends any, A2 extends any> = [A1] extends [never]
  ? 0
  : A1 extends A2
  ? 1
  : 0;

/**
 * Check whether `A1` is equal to `A2` or not.
 * @param A1
 * @param A2
 * @returns [[Boolean]]
 * @example
 * ```ts
 * import {A} from 'ts-toolbelt'
 *
 * type test0 = A.Equals<42 | 0, 42 | 0>                    // true
 * type test1 = A.Equals<{a: string}, {b: string}>          // false
 * type test3 = A.Equals<{a: string}, {readonly a: string}> // false
 * ```
 */
declare type _Equals<A1 extends any, A2 extends any> = (<A>() => A extends A2 ? 1 : 0) extends <
  A
>() => A extends A1 ? 1 : 0
  ? 1
  : 0;

/**
 * Check whether `A1` is part of `A2` or not. It works like
 * [[Extends]] but [[Boolean]] results are narrowed to [[False]].
 * @param A1
 * @param A2
 * @returns [[Boolean]]
 * @example
 * ```ts
 * type test0 = A.Contains<'a' | 'b', 'b'> // False
 * type test1 = A.Contains<'a', 'a' | 'b'> // True
 *
 * type test2 = A.Contains<{a: string}, {a: string, b: number}> // False
 * type test3 = A.Contains<{a: string, b: number}, {a: string}> // True
 *
 * type test4 = A.Contains<never, never> // False
 * /// Nothing cannot contain nothing, use `A.Equals`
 * ```
 */
declare type _Contains<A1 extends any, A2 extends any> = _Extends<A1, A2> extends 1 ? 1 : 0;

/**
 * Check whether `A` is similar to `A1` or not. In other words, it is a compact
 * type that bundles [[Equals]], [[Extends]], [[Contains]], comparison types.
 * @param A to be compared
 * @param A1 to compare to
 * @param match (?=`'default'`) to change precision
 * @returns [[Boolean]]
 * @example
 * ```ts
 * import {A} from 'ts-toolbelt'
 *
 * type test0 = A.Is<'a', 'a' | 'b', 'extends->'> // True
 * type test1 = A.Is<'a' | 'b', 'a', 'extends->'> // Boolean
 *
 * type test2 = A.Is<'a', 'a' | 'b', '<-extends'> // Boolean
 * type test3 = A.Is<'a' | 'b', 'a', '<-extends'> // True
 *
 * type test4 = A.Is<'a', 'a' | 'b', 'contains->'> // True
 * type test5 = A.Is<'a' | 'b', 'a', 'contains->'> // False
 *
 * type test6 = A.Is<'a', 'a' | 'b', '<-contains'> // False
 * type test7 = A.Is<'a' | 'b', 'a', '<-contains'> // True
 *
 * type test8 = A.Is<'a', 'a' | 'b', 'equals'>      // False
 * type test9 = A.Is<'b' |'a', 'a' | 'b', 'equals'> // True
 * ```
 */
declare type _Is<A extends any, A1 extends any, match extends _Match = "default"> = {
  default: _Extends<A, A1>;
  "contains->": _Contains<A, A1>;
  "extends->": _Extends<A, A1>;
  "<-contains": _Contains<A1, A>;
  "<-extends": _Extends<A1, A>;
  equals: _Equals<A1, A>;
}[match];

/**
 * @hidden
 */
declare type _SelectKeys<O extends object, M extends any, match extends _Match> = {
  [K in keyof O]-?: {
    1: K;
    0: never;
  }[_Is<O[K], M, match>];
}[keyof O];
/**
 * Get the keys of `O` which fields match `M`
 * @param O to extract from
 * @param M to select fields
 * @param match (?=`'default'`) to change precision
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
declare type SelectKeys<
  O extends object,
  M extends any,
  match extends _Match = "default"
> = O extends unknown ? _SelectKeys<O, M, match> : never;
