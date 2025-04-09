import GenericSettingsButton from '@/components/SettingsButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMinesweeperState } from '@/minesweeper/state';

const SettingsButton: React.FC = () => {
  const {
    optFlagOnClick,
    optFlagOnDoubleClick,
    optFlagOnLongClick,
    optFlagOnRightClick,
    setState,
  } = useMinesweeperState();

  return (
    <GenericSettingsButton>
      <Label className="-mb-2 text-center text-base">Flag Behaviour</Label>
      <div className="grid w-[100%] grid-cols-2 items-center justify-items-center gap-2 p-2">
        <Label>Click</Label>
        <Switch
          checked={optFlagOnClick}
          onCheckedChange={() => setState({ optFlagOnClick: !optFlagOnClick })}
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
        <Label>Double click</Label>
        <Switch
          checked={optFlagOnDoubleClick}
          onCheckedChange={() =>
            setState({ optFlagOnDoubleClick: !optFlagOnDoubleClick })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
        <Label>Right click</Label>
        <Switch
          checked={optFlagOnRightClick}
          onCheckedChange={() =>
            setState({ optFlagOnRightClick: !optFlagOnRightClick })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
        <Label>Hold</Label>
        <Switch
          checked={optFlagOnLongClick}
          onCheckedChange={() =>
            setState({ optFlagOnLongClick: !optFlagOnLongClick })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
      </div>
      {/* <Label className="text-base -mb-2">Interface</Label>
        <div className="grid grid-cols-2 gap-2 w-[100%] justify-items-center items-center p-2">
          <Label>Show toggle flag button</Label>
          <Switch
            checked={optFlagOnLongClick}
            onCheckedChange={() =>
              setState({ optFlagOnLongClick: !optFlagOnLongClick })
            }
            className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
          />
        </div> */}
    </GenericSettingsButton>
  );
};

export default SettingsButton;
