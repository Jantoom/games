import React from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

const SettingsContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      className="flex max-h-[60svh] min-h-[20svh] w-full touch-pan-y flex-col gap-y-6 overflow-auto px-2"
      style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {children}
    </div>
  );
};

const SettingsGroup: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="grid w-full grid-cols-[1fr_min-content] items-center gap-2">
      <Label className="col-span-2 text-base">{title}</Label>
      {children}
    </div>
  );
};

const SettingsSwitch: React.FC<{
  name: string;
  active: boolean;
  change: () => void;
}> = ({ name, active, change }) => {
  return (
    <>
      <Label className="font-normal">{name}</Label>
      <Switch
        checked={active}
        onCheckedChange={change}
        className={`data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary`}
      />
    </>
  );
};

export { SettingsContainer, SettingsGroup, SettingsSwitch };
