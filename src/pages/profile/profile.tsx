import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ProfileUI } from '@ui-pages';
// Подставь правильный путь к селектору текущего пользователя
import { selectCurrentUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  // Получаем данные текущего пользователя из стора
  const user = useSelector(selectCurrentUser);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Синхронизируем форму с данными пользователя, если они обновились (например, после рефреша или мутации)
  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // TODO: здесь будет dispatch(updateUser(...)) с formValue
    console.log('Отправляем обновление профиля:', formValue);
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
