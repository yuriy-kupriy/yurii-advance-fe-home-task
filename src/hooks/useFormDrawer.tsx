import ReactDOM from 'react-dom';
import React, {useMemo} from 'react';

import {useBoolean} from '@/hooks/useBoolean';
import DrawerWrapper, {
  drawerSizes,
} from '@components/DrawerWrapper/DrawerWrapper';

interface UseFormDrawerArgs {
  drawerWidth?: drawerSizes;
  // Receives the close callback so the form can dismiss the drawer on success.
  // Memoize this (useCallback) at the call site to keep the portal memoized.
  renderForm: (close: () => void) => React.ReactNode;
}

// Shared scaffolding for a drawer that hosts a single form: a portal +
// DrawerWrapper + dismiss action, with the form gated on `isOpen` so it
// remounts (and resets) each time the drawer is opened.
export const useFormDrawer = ({
  drawerWidth = 'sm',
  renderForm,
}: UseFormDrawerArgs) => {
  const {
    value: isOpen,
    onTrue: openDrawer,
    onFalse: closeDrawer,
  } = useBoolean();

  const Drawer = useMemo(() => {
    if (typeof window === 'undefined') return null;

    return ReactDOM.createPortal(
      <DrawerWrapper
        open={isOpen}
        removePaddingBottom
        onClose={closeDrawer}
        actions={[
          {
            icon: 'fluent--dismiss-24-regular',
            onClick: closeDrawer,
          },
        ]}
        drawerWidth={drawerWidth}
      >
        {isOpen && renderForm(closeDrawer)}
      </DrawerWrapper>,
      document.body,
    );
  }, [isOpen, closeDrawer, drawerWidth, renderForm]);

  return {isOpen, openDrawer, closeDrawer, Drawer};
};

export default useFormDrawer;
