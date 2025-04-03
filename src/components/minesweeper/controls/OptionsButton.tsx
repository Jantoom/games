import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ControlButton from '../../ControlButton';
import { Lightbulb, Settings } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useMinesweeperState } from '@/states/minesweeperState';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const OptionsButton: React.FC = () => {
  const {
    flagOnClick,
    flagOnDoubleClick,
    flagOnLongClick,
    flagOnRightClick,
    update,
    setState,
  } = useMinesweeperState();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const close = () => setIsOptionsOpen(false);

  return (
    <Dialog onOpenChange={(isOpen) => (isOpen ? null : close())}>
      <DialogTrigger asChild>
        <ControlButton
          isSelected={isOptionsOpen}
          Icon={Settings}
          onClick={() => setIsOptionsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="border-border [&>button:last-child]:hidden max-w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-center">Options</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <Label className="text-base -mb-2">Flag Behaviour</Label>
        <div className="grid grid-cols-2 gap-2 w-[100%] justify-items-center items-center p-2">
          <Label>Click</Label>
          <Switch
            checked={flagOnClick}
            onCheckedChange={() => setState({ flagOnClick: !flagOnClick })}
            className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
          />
          <Label>Double click</Label>
          <Switch
            checked={flagOnDoubleClick}
            onCheckedChange={() =>
              setState({ flagOnDoubleClick: !flagOnDoubleClick })
            }
            className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
          />
          <Label>Right click</Label>
          <Switch
            checked={flagOnRightClick}
            onCheckedChange={() =>
              setState({ flagOnRightClick: !flagOnRightClick })
            }
            className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
          />
          <Label>Hold</Label>
          <Switch
            checked={flagOnLongClick}
            onCheckedChange={() =>
              setState({ flagOnLongClick: !flagOnLongClick })
            }
            className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
          />
        </div>
        {/* <Label className="text-base -mb-2">Interface</Label>
        <div className="grid grid-cols-2 gap-2 w-[100%] justify-items-center items-center p-2">
          <Label>Show toggle flag button</Label>
          <Switch
            checked={flagOnLongClick}
            onCheckedChange={() =>
              setState({ flagOnLongClick: !flagOnLongClick })
            }
            className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
          />
        </div> */}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full border border-border hover:bg-secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsButton;
