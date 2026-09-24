import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';

import {
  fetchFeed,
  selectFeed,
  selectIsFeedLoading
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed); // { orders, total, totalToday }
  const isLoading = useSelector(selectIsFeedLoading);

  // Запускаем загрузку ленты при монтировании
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Пока грузится — показываем прелоадер
  if (isLoading || !feed) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={feed.orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
