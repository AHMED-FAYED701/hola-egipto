import * as migration_20261018_112208_initial from './20261018_112208_initial';
import * as migration_20261018_113708_content_model from './20261018_113708_content_model';
import * as migration_20261018_121101_cabin_type_optional from './20261018_121101_cabin_type_optional';

export const migrations = [
  {
    up: migration_20261018_112208_initial.up,
    down: migration_20261018_112208_initial.down,
    name: '20261018_112208_initial',
  },
  {
    up: migration_20261018_113708_content_model.up,
    down: migration_20261018_113708_content_model.down,
    name: '20261018_113708_content_model',
  },
  {
    up: migration_20261018_121101_cabin_type_optional.up,
    down: migration_20261018_121101_cabin_type_optional.down,
    name: '20261018_121101_cabin_type_optional'
  },
];
