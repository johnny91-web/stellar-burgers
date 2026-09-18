import { FC } from 'react';
import { useSelector } from '../../services/store'; // подставь свой путь к store
import { selectCurrentUser } from '../../services/slices/userSlice'; // подставь путь к слайсу
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector(selectCurrentUser);
  return <AppHeaderUI userName={user?.name ?? ''} />;
};
