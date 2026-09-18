// src/components/order-info/order-info.tsx
import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderByNumber,
  selectOrderData,
  selectOrderIsRequested,
  selectOrderError
} from '../../services/slices/orderListUserSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number, id } = useParams();
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrderData);
  const ingredients = useSelector(selectIngredients) as TIngredient[];
  const isRequested = useSelector(selectOrderIsRequested);
  const error = useSelector(selectOrderError);

  const orderNumber = Number(number ?? id);

  useEffect(() => {
    if (Number.isInteger(orderNumber) && orderNumber > 0) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    // Если заказа нет вообще — ждём
    if (!orderData) return null;

    // Дата: безопасная инициализация
    let date: Date;
    try {
      date = new Date(orderData.createdAt || Date.now());
      if (isNaN(date.getTime())) date = new Date();
    } catch {
      date = new Date();
    }

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo: TIngredientsWithCount = {};
    const ingredientIds = orderData.ingredients || [];

    ingredientIds.forEach((ingredientId) => {
      const ingredient = ingredients?.find((ing) => ing._id === ingredientId);
      // Если ингредиента нет в списке — просто пропускаем, не ломаем весь заказ
      if (!ingredient) return;

      if (ingredientsInfo[ingredientId]) {
        ingredientsInfo[ingredientId].count++;
      } else {
        ingredientsInfo[ingredientId] = {
          ...ingredient,
          count: 1
        };
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + (item.price ?? 0) * (item.count ?? 0),
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Проверка номера
  if (!Number.isInteger(orderNumber) || orderNumber <= 0) {
    return <div>Некорректный номер заказа</div>;
  }

  // Пока грузится сам заказ — показываем прелоадер
  if (isRequested) {
    return <Preloader />;
  }

  // Если была ошибка — показываем её
  if (error) {
    return <div>{error}</div>;
  }

  // Если заказ есть, но данные ещё не сформировались (редкий кейс) — прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
