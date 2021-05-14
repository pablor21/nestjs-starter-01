export interface IHasOrderField {
  [name: string]: any;
  getOrderField();
  getCurrentOrder(): number;
  getOrder(): number;
  getOrderConfig(): { conditions: any; replacements: any };
}

export function HasOrderField(
  propertyName: string = 'dOrder',
  config: any = {},
) {
  return <T extends new (...args: any[]) => any>(Target: T) => {
    class WithOrderField extends Target implements IHasOrderField {
      //@AfterDestroy
      static async saveOrderOnDestroy(instance) {
        await this.ensureOrderSequence(instance);
      }

      //@BeforeSave
      static async saveOrderOnCreate(instance) {
        if (instance[propertyName] < 1) {
          instance[propertyName] = (await this.getMaxOrder(instance)) + 1;
        }
      }

      //@AfterUpdate
      static async updateOrder(instance) {
        const orderConfig = instance.getOrderConfig();

        let extraConditions = orderConfig.conditions || '';
        if (extraConditions) {
          extraConditions += ' AND ';
        }

        const previousOrder = instance.getCurrentOrder();
        if (instance[propertyName] < 1) {
          instance[propertyName] = 1;
        }
        const newOrder = instance[propertyName];

        const vars = {
          id: instance.id,
          old_order: previousOrder,
          new_order: newOrder,
        };
        if (orderConfig.replacements) {
          Object.assign(vars, orderConfig.replacements);
        }

        //previous order greater than current
        if (newOrder < previousOrder) {
        } else if (newOrder > previousOrder) {
        }
        await this.ensureOrderSequence(instance);
      }

      static async getMaxOrder(instance): Promise<number> {
        const orderConfig = instance.getOrderConfig();

        let extraConditions = orderConfig.conditions || '';
        if (extraConditions) {
          extraConditions += ' AND ';
        }
        const vars = { id: instance.id };
        if (orderConfig.replacements) {
          Object.assign(vars, orderConfig.replacements);
        }

        const result = await instance.sequelize.query(
          `SELECT MAX(${config.field}) as max_order FROM ${instance.constructor.tableName} WHERE ${extraConditions} 1=1`,
          { replacements: vars },
        );
        return result[0].max_order;
      }

      //@AfterCreate
      static async ensureOrderSequence(instance) {
        const orderConfig = instance.getOrderConfig();

        let extraConditions = orderConfig.conditions || '';
        if (extraConditions) {
          extraConditions += ' AND ';
        }

        const previousOrder = instance.getCurrentOrder();
        if (instance[propertyName] < 1) {
          instance[propertyName] = 1;
        }
        const newOrder = instance[propertyName];

        const vars = {
          id: instance.id,
          old_order: previousOrder,
          new_order: newOrder,
        };
        if (orderConfig.replacements) {
          Object.assign(vars, orderConfig.replacements);
        }
        return await instance.sequelize.query(
          `UPDATE ${instance.constructor.tableName} SET ${config.field}=(@i := @i + 1) WHERE ${extraConditions} 1=1 ORDER BY ${config.field}, @i:=0`,
          { replacements: vars },
        );
      }

      getOrderConfig() {
        return {
          conditions: null,
          replacements: null,
        };
      }

      getOrderField() {
        return propertyName;
      }
      getCurrentOrder(): number {
        return this.previous(this.getOrderField());
      }
      getOrder(): number {
        return this[this.getOrderField()];
      }
    }
    //define the propery get/set for the image
    // Object.defineProperty(WithOrderField.prototype, propertyName, {
    //   get: function(): string {
    //     return this[privatePropName];
    //   },
    //   set: function(value: string) {
    //     this[privatePropName] = value;
    //   },
    //   enumerable: true,
    //   configurable: true,
    // });

    // //add the column definition
    // WithOrderField.prototype[privatePropName] = Column({
    //   type: DataType.INTEGER({ unsigned: true }),
    //   ...config,
    // })(WithOrderField.prototype, propertyName);

    return WithOrderField;
  };
}
