import { GameStatus } from '@/lib/types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useStatusCheck = (
  game: string,
  status: GameStatus,
  isSolved: () => boolean,
  stop: () => void,
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'create') {
      navigate(`/games/${game}/create`);
    } else if (status === 'play' && isSolved()) {
      stop();
    }
  }, [status, navigate, isSolved, stop]);
};
