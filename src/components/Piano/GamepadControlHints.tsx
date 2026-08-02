import { useTranslation } from 'react-i18next';

interface GamepadHintConfig {
  icons: string[];
  labelKey: string;
}

const GAMEPAD_HINT_COLUMNS: GamepadHintConfig[][] = [
  [
    { icons: ['xbox_lt'], labelKey: 'playLeft' },
    {
      icons: ['xbox_dpad_left', 'xbox_stick_l_left'],
      labelKey: 'semitoneDown',
    },
    {
      icons: ['xbox_dpad_right', 'xbox_stick_l_right'],
      labelKey: 'semitoneUp',
    },
    {
      icons: ['xbox_dpad_up', 'xbox_stick_l_up'],
      labelKey: 'octaveUp',
    },
    {
      icons: ['xbox_dpad_down', 'xbox_stick_l_down'],
      labelKey: 'octaveDown',
    },
    { icons: ['xbox_lb'], labelKey: 'temporaryOctaveUp' },
    { icons: ['xbox_ls'], labelKey: 'temporaryOctaveDown' },
  ],
  [
    { icons: ['xbox_rt'], labelKey: 'playRight' },
    {
      icons: ['xbox_button_x', 'xbox_stick_r_left'],
      labelKey: 'semitoneDown',
    },
    {
      icons: ['xbox_button_b', 'xbox_stick_r_right'],
      labelKey: 'semitoneUp',
    },
    {
      icons: ['xbox_button_y', 'xbox_stick_r_up'],
      labelKey: 'octaveUp',
    },
    {
      icons: ['xbox_button_a', 'xbox_stick_r_down'],
      labelKey: 'octaveDown',
    },
    { icons: ['xbox_rb'], labelKey: 'temporaryOctaveUp' },
    { icons: ['xbox_rs'], labelKey: 'temporaryOctaveDown' },
  ],
];

interface GamepadIconProps {
  name: string;
}

function GamepadIcon({ name }: GamepadIconProps) {
  return (
    <span
      className="size-8 shrink-0 bg-current"
      style={{
        mask: `url('/gamepads/${name}.svg') center / contain no-repeat`,
      }}
    />
  );
}

interface GamepadHintProps {
  icons: string[];
  label: string;
}

function GamepadHint({ icons, label }: GamepadHintProps) {
  return (
    <>
      <span className="flex">
        {icons.map((icon) => (
          <GamepadIcon key={icon} name={icon} />
        ))}
      </span>
      <span>{label}</span>
    </>
  );
}

function GamepadControlHints() {
  const { t } = useTranslation('app');

  return (
    <div className="mx-auto grid w-fit max-w-full gap-3 p-3 text-app-subtext sm:grid-cols-2 sm:gap-x-12 dark:text-app-subtext-dark">
      {GAMEPAD_HINT_COLUMNS.map((column) => (
        <div
          className="grid grid-cols-[4rem_auto] items-center gap-x-2 gap-y-2"
          key={column[0].icons[0]}
        >
          {column.map(({ icons, labelKey }) => (
            <GamepadHint
              icons={icons}
              key={icons.join('-')}
              label={t(`settings.gamepad.hints.${labelKey}`)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GamepadControlHints;
