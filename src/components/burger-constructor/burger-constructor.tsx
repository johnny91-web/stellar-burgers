import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

// Из burgerSlice берём только то, что там осталось: заказ и модалку
import {
  selectOrderRequest,
  selectOrderModalData,
  closeOrderModal,
  createOrder
} from '../../services/slices/burgerSlice';

// А вот данные конструктора берём из constructorSlice
import {
  selectItems,
  selectBun,
  removeConstructorItemsAll
} from '../../services/slices/constructorSlice';

import { selectCurrentUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Читаем данные из ПРАВИЛЬНОГО слайса
  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectItems);

  // Данные заказа и модалки — из burgerSlice
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectCurrentUser);

  // Собираем структуру, которую ждёт BurgerConstructorUI
  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    // Проверка: есть булка, не идёт запрос, пользователь авторизован
    if (!bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(createOrder())
      .unwrap()
      .then(() => {
        // Очищаем конструктор ПОСЛЕ успешного заказа
        dispatch(removeConstructorItemsAll());
      })
      .catch(() => {});
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
