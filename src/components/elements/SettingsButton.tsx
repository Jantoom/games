import { Settings } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ControlButton from '@/components/generics/ControlButton';
import { useGlobalStore } from '@/lib/state';
import { swapLastUrlSubpath } from '@/lib/utils';

interface SettingsButtonProps {
  className?: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ className }) => {
  const pathname = useLocation().pathname;
  const destination = swapLastUrlSubpath(pathname, '/settings');
  const { setState } = useGlobalStore();

  return (
    <Link to={destination} className="h-full">
      <ControlButton
        Icon={Settings}
        isSelected={false}
        onClick={() => {
          setState({ navDirection: 'right' });
        }}
        className={className}
      />
    </Link>
  );
};

export default SettingsButton;
