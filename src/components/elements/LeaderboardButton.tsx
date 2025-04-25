import { Trophy } from 'lucide-react';
import React, { useState } from 'react';
import DialogButton from '../generics/DialogButton';

interface LeaderboardButtonProps {
  leaderboard: React.ReactNode;
}

const LeaderboardButton: React.FC<LeaderboardButtonProps> = ({
  leaderboard,
}) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <DialogButton
      Icon={Trophy}
      title="Leaderboard"
      isOpen={isLeaderboardOpen}
      setIsOpen={setIsLeaderboardOpen}
    >
      {leaderboard}
    </DialogButton>
  );
};

export default LeaderboardButton;
