import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
export type CartItem = {
  productId: string;
  variantId: string;

  name: string;
  image: string;

  price: number;
  stock: number;

  attributes: {
    size: string;
    color: string;
  };

  qty: number;
  selected: boolean;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  setCartFromDB: (items: CartItem[]) => void;
  updateQty: (variantId: string, qty: number) => void;
  toggleSelect: (variantId: string) => void;

  clearCart: () => void;
};


const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_KEY = "urban_cart_v1";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(loadCartFromStorage);
  const setCartFromDB = (items: CartItem[]) => {
    setCart(items);
  };

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exist = prev.find(i => i.variantId === item.variantId);

      if (exist) {
        const newQty = exist.qty + item.qty;

        if (newQty > exist.stock) {
          console.warn("Qty melebihi stok");
          return prev;
        }

        return prev.map(i =>
          i.variantId === item.variantId
            ? { ...i, qty: newQty }
            : i
        );
      }

      if (item.qty > item.stock) {
        console.warn("Qty melebihi stok");
        return prev;
      }

      return [...prev, item];
    });
  };

  const updateQty = (variantId: string, qty: number) => {
    setCart(prev =>
      prev.map(i => {
        if (i.variantId !== variantId) return i;

        if (qty < 1) return i;
        if (qty > i.stock) return i;

        return { ...i, qty };
      })
    );
  };

  const toggleSelect = (variantId: string) => {
    setCart(prev =>
      prev.map(i =>
        i.variantId === variantId
          ? { ...i, selected: !i.selected }
          : i
      )
    );
  };

  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(i => i.variantId !== variantId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        toggleSelect,
        clearCart,
        setCartFromDB,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
