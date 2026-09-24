import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  selectUserOrders,
  selectIsOrdersLoading,
  selectOrdersError,
  fetchUserOrders
} from '../../services/slices/orderListUserSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectIsOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;
  if (error) return <p>Ошибка: {error}</p>;

  return <ProfileOrdersUI orders={orders} />;
};
