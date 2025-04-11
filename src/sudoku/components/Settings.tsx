import {
  SettingsContainer,
  SettingsGroup,
  SettingsSwitch,
} from '../../components/generics/Settings';
import { useSudokuState } from '@/sudoku/state';

const Settings: React.FC = () => {
  const {
    optAssistHighlight,
    optAssistRemaining,
    optAssistAutoRemove,
    optShowTime,
    setState,
  } = useSudokuState();

  return (
    <SettingsContainer>
      <SettingsGroup title="Assists">
        <SettingsSwitch
          name="Highlight same numbers"
          active={optAssistHighlight}
          change={() =>
            setState((s) => ({ optAssistHighlight: !s.optAssistHighlight }))
          }
        />
        <SettingsSwitch
          name="Show remaining number counts"
          active={optAssistRemaining}
          change={() =>
            setState((s) => ({ optAssistRemaining: !s.optAssistRemaining }))
          }
        />
        <SettingsSwitch
          name="Automatically remove notes"
          active={optAssistAutoRemove}
          change={() => setState((s) => ({ optAssistAutoRemove: !s.optAssistAutoRemove }))}
        />
      </SettingsGroup>
      <SettingsGroup title="Appearance">
        <SettingsSwitch
          name="Show time"
          active={optShowTime}
          change={() => setState((s) => ({ optShowTime: !s.optShowTime }))}
        />
      </SettingsGroup>
    </SettingsContainer>
  );
};

export default Settings;
