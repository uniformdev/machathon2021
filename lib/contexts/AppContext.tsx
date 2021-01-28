import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext<{
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}>(null);

export const AppContextProvider = ({ children }) => {
  const [state, setState] = useState({
    isCartOpen: false,
  });
  const updateState = (newState: any) => {
    setState({
      ...state,
      ...newState,
    });
  };

  const openCart = () => updateState({ isCartOpen: true });
  const closeCart = () => updateState({ isCartOpen: false });
  const toggleCart = () => updateState({ isCartOpen: !state.isCartOpen });

  const value = useMemo(
    () => ({
      ...state,
      openCart,
      closeCart,
      toggleCart,
    }),
    [state]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
