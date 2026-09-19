import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectCurrentUser } from '../../services/slices/userSlice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector(selectCurrentUser);
  const profilePath = user ? '/profile' : '/login';
  const displayName = user?.name ?? 'Личный кабинет';

  return <AppHeaderUI userName={displayName} profilePath={profilePath} />;
};
