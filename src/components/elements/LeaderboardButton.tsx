import { Trophy } from 'lucide-react';
import { useState } from 'react';
import DialogButton from '../generics/DialogButton';
import Leaderboard from '../generics/Leaderboard';

interface LeaderboardButtonProps<T extends string> {
  game: string;
  difficulties: T[];
  difficulty?: T;
}

const LeaderboardButton = <T extends string>({
  game,
  difficulties,
  difficulty = difficulties[0],
}: LeaderboardButtonProps<T>) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <DialogButton
      Icon={Trophy}
      title="Leaderboard"
      isOpen={isLeaderboardOpen}
      setIsOpen={setIsLeaderboardOpen}
    >
      <Leaderboard
        game={game}
        difficulty={difficulty}
        difficulties={difficulties}
      />
    </DialogButton>
  );
};

export default LeaderboardButton;
