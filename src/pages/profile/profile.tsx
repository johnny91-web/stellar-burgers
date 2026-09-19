import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { ProfileUI } from '@ui-pages';
import { selectCurrentUser } from '../../services/slices/userSlice';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

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

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Собираем только изменённые поля
    const updates: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== user?.name) updates.name = formValue.name;
    if (formValue.email !== user?.email) updates.email = formValue.email;
    if (formValue.password) updates.password = formValue.password;

    try {
      await dispatch(updateUser(updates)).unwrap();
      // Очищаем поле пароля после успешного сохранения
      setFormValue((prevState) => ({ ...prevState, password: '' }));
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
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
