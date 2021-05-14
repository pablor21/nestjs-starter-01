import { Filter } from "./filter";

export interface BooleanFieldComparisons {
  is?: boolean | null;
  isNot?: boolean | null;
  alias?: string;
}

/**
 * Field comparisons for all types that are NOT `null` or `boolean`.
 *
 * @typeparam FieldType - The TS type of the field.
 */
export interface CommonFieldComparisonType<FieldType> extends BooleanFieldComparisons {
  alias?: string;
  eq?: FieldType;
  neq?: FieldType;
  gt?: FieldType;
  gte?: FieldType;
  lt?: FieldType;
  lte?: FieldType;
  in?: FieldType[];
  notIn?: FieldType[];
  between?: [FieldType, FieldType];
  notBetween?: [FieldType, FieldType];
}

type SameFieldComparison<FieldType> = CommonFieldComparisonType<FieldType> & FieldType;

/**
 * Field comparisons for `string` types.
 */
export interface StringFieldComparisons extends CommonFieldComparisonType<string> {
  like?: string;
  notLike?: string;
  iLike?: string;
  notILike?: string;
}

type Types =
  | boolean
  | string
  | number
  | Date
  | RegExp
  | bigint
  | symbol
  | null
  | undefined
  | never
  | any;

// eslint-disable-next-line @typescript-eslint/ban-types
type FilterFieldComparisonType<FieldType, IsKeys extends true | false> = FieldType | (FieldType extends Object ? string | number : null) | (FieldType extends string | String
  ? StringFieldComparisons // eslint-disable-next-line @typescript-eslint/ban-types
  : FieldType extends boolean | Boolean
  ? BooleanFieldComparisons
  : FieldType extends null | undefined | never
  ? BooleanFieldComparisons // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : FieldType extends number | Date | RegExp | bigint | Types[] | symbol
  ? CommonFieldComparisonType<FieldType>
  : FieldType extends Array<infer U>
  ? CommonFieldComparisonType<U> | Filter<U> // eslint-disable-next-line @typescript-eslint/ban-types
  : IsKeys extends true
  ? CommonFieldComparisonType<FieldType> & StringFieldComparisons & Filter<FieldType>
  : CommonFieldComparisonType<FieldType> | Filter<FieldType>);

// eslint-disable-next-line @typescript-eslint/ban-types
export type FilterFieldComparison<FieldType> = FilterFieldComparisonType<FieldType, false>;
export type FilterComparisonOperators<FieldType> = keyof FilterFieldComparisonType<FieldType, true>;