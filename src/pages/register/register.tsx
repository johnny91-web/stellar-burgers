import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectUserError,
  selectUserLoading
} from '../../services/slices/userSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Переименовали под требования RegisterUI: userName вместо name
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) return;

    dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        const from = (location.state as { from?: string })?.from || '/';
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <RegisterUI
      errorText={error || ''}
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
