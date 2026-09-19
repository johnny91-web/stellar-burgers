// ModalUI.tsx
import { FC, memo } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui'; // твой компонент

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => (
    <ModalOverlayUI onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={`${styles.title} text text_type_main-large`}>
            {title}
          </h3>
          <button
            className={styles.button}
            type='button'
            onClick={onClose}
            aria-label='Закрыть'
          >
            <CloseIcon type='primary' />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </ModalOverlayUI>
  )
);
