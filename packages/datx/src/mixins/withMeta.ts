import {computed} from 'mobx';

import {DECORATE_MODEL} from '../errors';
import {error} from '../helpers/format';
import {isModel} from '../helpers/mixin';
import {getRefId} from '../helpers/model/fields';
import {getModelCollection, getModelId, getModelType, getOriginalModel} from '../helpers/model/utils';
import {IMetaMixin} from '../interfaces/IMetaMixin';
import {IModelConstructor} from '../interfaces/IModelConstructor';
import {Model} from '../Model';
import {storage} from '../services/storage';

/**
 * Extends the model with the exposed meta data
 *
 * @export
 * @template T
 * @param {IModelConstructor<T>} Base Model to extend
 * @returns Extended model
 */
export function withMeta<T extends Model>(Base: IModelConstructor<T>) {
  const BaseClass = Base as typeof Model;

  if (!isModel(BaseClass)) {
    throw error(DECORATE_MODEL);
  }

  class WithMeta extends BaseClass implements IMetaMixin {
    @computed public get meta() {
      const refDefs = storage.getModelMetaKey(this, 'refs');
      const refs = {};
      Object.keys(refDefs).forEach((key) => {
        refs[key] = getRefId(this, key);
      });

      return Object.freeze({
        collection: getModelCollection(this),
        id: getModelId(this),
        original: storage.getModelMetaKey(this, 'originalId') && getOriginalModel(this) || undefined,
        refs,
        type: getModelType(this),
      });
    }
  }

  return WithMeta as typeof BaseClass & IModelConstructor<IMetaMixin<T> & T>;
}
