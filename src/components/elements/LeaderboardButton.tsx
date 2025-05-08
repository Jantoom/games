import { Trophy } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ControlButton from '@/components/generics/ControlButton';
import { useGlobalStore } from '@/lib/state';
import { swapLastUrlSubpath } from '@/lib/utils';

interface LeaderboardButtonProps {
  className?: string;
}

const LeaderboardButton: React.FC<LeaderboardButtonProps> = ({ className }) => {
  const pathname = useLocation().pathname;
  const destination = swapLastUrlSubpath(pathname, '/leaderboard');
  const { setState } = useGlobalStore();

  return (
    <Link to={destination} className="h-full">
      <ControlButton
        Icon={Trophy}
        isSelected={false}
        onClick={() => {
          setState({ navDirection: 'right' });
        }}
        className={className}
      />
    </Link>
  );
};

export default LeaderboardButton;
