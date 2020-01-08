import { ReferenceType } from '../enums/ReferenceType';

import { ToMany } from './ToMany';
import { ToOne } from './ToOne';
import { ToOneOrMany } from './ToOneOrMany';
import { error } from 'datx-utils';

export function getBucketConstructor(type: ReferenceType.TO_ONE): typeof ToOne;
export function getBucketConstructor(type: ReferenceType.TO_ONE_OR_MANY): typeof ToOneOrMany;
export function getBucketConstructor(type: ReferenceType.TO_MANY): typeof ToMany;
export function getBucketConstructor(
  type: ReferenceType,
): typeof ToOne | typeof ToOneOrMany | typeof ToMany;
export function getBucketConstructor(
  type: ReferenceType,
): typeof ToOne | typeof ToOneOrMany | typeof ToMany {
  if (type === ReferenceType.TO_ONE) {
    return ToOne;
  } else if (type === ReferenceType.TO_ONE_OR_MANY) {
    return ToOneOrMany;
  } else if (type === ReferenceType.TO_MANY) {
    return ToMany;
  }

  throw error('Unknown reference type');
}

export { ToOne, ToOneOrMany, ToMany };
