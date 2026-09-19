import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  profilePath
}) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
          end
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          )}
        </NavLink>

        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
          end
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>

      <div className={styles.logo}>
        <Logo className='' />
      </div>

      <NavLink
        to={profilePath}
        className={({ isActive }) =>
          `${styles.link_position_last} ${styles.link} ${isActive ? styles.link_active : ''}`
        }
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>{userName}</p>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
