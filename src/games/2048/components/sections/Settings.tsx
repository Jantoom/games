import {
  SettingsContainer,
  SettingsGroup,
  SettingsSwitch,
} from '@/components/generics/Settings';
import { use2048Store } from '@/games/2048/state';

const Settings: React.FC = () => {
  const { optShowScore, setState } = use2048Store();

  return (
    <SettingsContainer>
      <SettingsGroup title="Appearance">
        <SettingsSwitch
          name="Show score"
          active={optShowScore}
          change={() => setState((s) => ({ optShowScore: !s.optShowScore }))}
        />
      </SettingsGroup>
    </SettingsContainer>
  );
};

export default Settings;
