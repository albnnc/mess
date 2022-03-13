// import Ajv from 'ajv';
// import { Schema } from '../models';
// import { clone } from './clone';
// import { isObject } from './guards';
// import { merge } from './merge';

// const ajv = new Ajv();

// export const getConditionals = (
//   schema: Schema,
//   value: any
// ): Schema['properties'] => {
//   if (value === undefined) {
//     return {};
//   }
//   return [schema, ...(schema.allOf ?? [])].reduce((prev, curr) => {
//     if (typeof curr !== 'object' || typeof curr.if !== 'object') {
//       return prev;
//     }
//     const validate = ajv.compile(curr.if);
//     const target = validate(value) ? curr.then : curr.else;
//     if (isObject(target)) {
//       merge(prev, clone(target.properties));
//     }
//     return prev;
//   }, {} as Schema['properties']);
// };
