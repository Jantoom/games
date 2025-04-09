import GenericSettingsButton from '@/components/SettingsButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSudokuState } from '@/sudoku/state';

const SettingsButton: React.FC = () => {
  const { optHighlightSame, optRemainingCounts, optAutoRemove, setState } =
    useSudokuState();

  return (
    <GenericSettingsButton>
      <Label className="-mb-2 text-center text-base">Assists</Label>
      <div className="grid w-[100%] grid-cols-2 items-center justify-items-center gap-2 p-2">
        <Label>Highlight same numbers</Label>
        <Switch
          checked={optHighlightSame}
          onCheckedChange={() =>
            setState({ optHighlightSame: !optHighlightSame })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
        <Label>Show remaining number counts</Label>
        <Switch
          checked={optRemainingCounts}
          onCheckedChange={() =>
            setState({ optRemainingCounts: !optRemainingCounts })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
        <Label>Automatically remove notes</Label>
        <Switch
          checked={optAutoRemove}
          onCheckedChange={() => setState({ optAutoRemove: !optAutoRemove })}
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
