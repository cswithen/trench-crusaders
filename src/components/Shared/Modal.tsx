import * as React from 'react';
import type { ReactNode } from 'react';
import { useDialog, useOverlay, useModal, OverlayContainer, FocusScope } from 'react-aria';
import styles from './Modal.module.scss';


type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay({ isOpen, onClose, isDismissable: true }, ref);
  const { modalProps } = useModal();
  const { dialogProps } = useDialog({}, ref);
  if (!isOpen) return null;
  return (
    <OverlayContainer>
      <div className={styles.overlay} {...overlayProps}>
        <FocusScope contain restoreFocus autoFocus>
          <div
            {...dialogProps}
            {...modalProps}
            ref={ref}
            className={styles.modal}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </div>
        </FocusScope>
      </div>
    </OverlayContainer>
  );
}
