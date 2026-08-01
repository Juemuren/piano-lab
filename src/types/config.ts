export type ConfigValueChangeHandler<Config> = <Key extends keyof Config>(
  key: Key,
  value: Config[Key],
) => void;

export type IndexedConfigValueChangeHandler<Config> = <
  Key extends keyof Config,
>(
  index: number,
  key: Key,
  value: Config[Key],
) => void;
