import * as migration_20261018_112208_initial from './20261018_112208_initial';

export const migrations = [
  {
    up: migration_20261018_112208_initial.up,
    down: migration_20261018_112208_initial.down,
    name: '20261018_112208_initial'
  },
];
