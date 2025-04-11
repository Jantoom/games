import ThemeButton from '@/components/elements/ThemeButton';
import {
  SettingsContainer,
  SettingsGroup,
  SettingsSwitch,
} from '@/components/generics/Settings';
import { useMinesweeperState } from '@/minesweeper/state';

const Settings: React.FC = () => {
  const {
    optFlagOnClick,
    optFlagOnDoubleClick,
    optFlagOnLongClick,
    optFlagOnRightClick,
    optShowRemainingBombs,
    optShowTime,
    setState,
  } = useMinesweeperState();

  return (
    <SettingsContainer>
      <SettingsGroup title="Flags">
        <SettingsSwitch
          name="Click"
          active={optFlagOnClick}
          change={() =>
            setState((s) => ({ optFlagOnClick: !s.optFlagOnClick }))
          }
        />
        <SettingsSwitch
          name="Double click"
          active={optFlagOnDoubleClick}
          change={() =>
            setState((s) => ({ optFlagOnDoubleClick: !s.optFlagOnDoubleClick }))
          }
        />
        <SettingsSwitch
          name="Right click"
          active={optFlagOnRightClick}
          change={() =>
            setState((s) => ({ optFlagOnRightClick: !s.optFlagOnRightClick }))
          }
        />
        <SettingsSwitch
          name="Hold"
          active={optFlagOnLongClick}
          change={() =>
            setState((s) => ({ optFlagOnLongClick: !s.optFlagOnLongClick }))
          }
        />
      </SettingsGroup>
      <SettingsGroup title="Appearance">
        <SettingsSwitch
          name="Show remaining bombs"
          active={optShowRemainingBombs}
          change={() =>
            setState((s) => ({
              optShowRemainingBombs: !s.optShowRemainingBombs,
            }))
          }
        />
        <SettingsSwitch
          name="Show time"
          active={optShowTime}
          change={() => setState((s) => ({ optShowTime: !s.optShowTime }))}
        />
      </SettingsGroup>
      <ThemeButton />
    </SettingsContainer>
  );
};

export default Settings;
