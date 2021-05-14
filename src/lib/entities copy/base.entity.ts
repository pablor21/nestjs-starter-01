export class BaseEntity<T = any> {
  public _id: any;
  private _original: any;

  public old(name: string) {
    return this._original[name];
  }

  public get isNewRecord() {
    return !this._id;
  }

  public getPK(): any {
    return this._id;
  }

  public setPK(value: any) {
    this._id = value;
  }

  serialize() {
    return this;
  }

  unserialize(input: any) {
    if (typeof input === 'string') {
      this._id = input;
      return this;
    }

    if (input) {
      if (input['_bsontype']) {
        this._id = input.toString();
        return this;
      }

      this._original = input._oringinal ?? input;

      Object.assign(this, input);
    }
    return this;
  }
}
