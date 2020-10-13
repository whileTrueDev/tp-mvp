type SomeAnotherType = Array<string>;

export interface SomeExampleType {
  someProperty: string;

  someAnotherProperty: SomeAnotherType;

  // 여기에 class-validator 사용할 수 있습니다.
}
