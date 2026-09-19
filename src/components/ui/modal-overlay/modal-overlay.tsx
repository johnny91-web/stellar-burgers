import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({
  onClick,
  children
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) => (
  <div className={styles.overlay} onClick={onClick}>
    {children}
  </div>
);
