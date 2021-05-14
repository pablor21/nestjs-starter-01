/* eslint-disable no-var */
import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import { cast } from './functions';

dotenv.config();
declare var global;
global.env = function (name, defaultValue = null, as = 'string') {
  const value = _.get(process.env, name, defaultValue);
  if (undefined != value) {
    return cast(value, as);
  }
  return value;
}; 

export const env = global.env;
