import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ControlButton from '@/components/generics/ControlButton';
import { useGlobalStore } from '@/lib/state';
import { goToUrlSubpath, swapLastUrlSubpath } from '@/lib/utils';

const BackButton: React.FC = () => {
  const [backUrl, _setBackUrl] = useState(
    useLocation().pathname.split('/').pop() === 'create'
      ? goToUrlSubpath(useLocation().pathname, 2)
      : swapLastUrlSubpath(useLocation().pathname, 'create'),
  );
  const { setState } = useGlobalStore();

  return (
    <Link to={backUrl} className="h-full">
      <ControlButton
        Icon={ArrowLeft}
        isSelected={false}
        onClick={() => {
          setState({ navDirection: 'left' });
        }}
      />
    </Link>
  );
};

export default BackButton;
