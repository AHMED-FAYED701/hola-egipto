import * as migration_20261018_112208_initial from './20261018_112208_initial';
import * as migration_20261018_113708_content_model from './20261018_113708_content_model';

export const migrations = [
  {
    up: migration_20261018_112208_initial.up,
    down: migration_20261018_112208_initial.down,
    name: '20261018_112208_initial',
  },
  {
    up: migration_20261018_113708_content_model.up,
    down: migration_20261018_113708_content_model.down,
    name: '20261018_113708_content_model'
  },
];
