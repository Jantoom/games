import {
  SettingsContainer,
  SettingsGroup,
  SettingsSwitch,
} from '../../components/generics/Settings';
import { useSudokuState } from '@/sudoku/state';

const Settings: React.FC = () => {
  const {
    optHighlightSame,
    optRemainingCounts,
    optAutoRemove,
    optShowTime,
    setState,
  } = useSudokuState();

  return (
    <SettingsContainer>
      <SettingsGroup title="Assists">
        <SettingsSwitch
          name="Highlight same numbers"
          active={optHighlightSame}
          change={() =>
            setState((s) => ({ optHighlightSame: !s.optHighlightSame }))
          }
        />
        <SettingsSwitch
          name="Show remaining number counts"
          active={optRemainingCounts}
          change={() =>
            setState((s) => ({ optRemainingCounts: !s.optRemainingCounts }))
          }
        />
        <SettingsSwitch
          name="Automatically remove notes"
          active={optAutoRemove}
          change={() => setState((s) => ({ optAutoRemove: !s.optAutoRemove }))}
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
