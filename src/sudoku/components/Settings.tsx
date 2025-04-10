import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSudokuState } from '@/sudoku/state';

const Settings: React.FC = () => {
  const {
    optAssistHighlightSame,
    optAssistRemainingCounts,
    optAssistAutoRemove,
    setState,
  } = useSudokuState();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid w-full grid-cols-[1fr_max-content] items-center gap-y-2">
        <Label className="col-span-2 text-base">Assists</Label>
        <Label className="font-normal">Highlight same numbers</Label>
        <Switch
          checked={optAssistHighlightSame}
          onCheckedChange={() =>
            setState({ optAssistHighlightSame: !optAssistHighlightSame })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
        <Label className="font-normal">Show remaining number counts</Label>
        <Switch
          checked={optAssistRemainingCounts}
          onCheckedChange={() =>
            setState({ optAssistRemainingCounts: !optAssistRemainingCounts })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
        <Label className="font-normal">Automatically remove notes</Label>
        <Switch
          checked={optAssistAutoRemove}
          onCheckedChange={() =>
            setState({ optAssistAutoRemove: !optAssistAutoRemove })
          }
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
      </div>
      <div className="grid w-full grid-cols-[1fr_max-content] items-center gap-2">
        <Label className="col-span-2 text-base">Appearance</Label>
        <Label className="font-normal">Show time</Label>
        <Switch
          checked={false}
          className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
        />
      </div>
    </div>
  );
};

export default Settings;
