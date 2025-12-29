import { create } from "zustand";

export const CartStore = create((set) => {
  const id = localStorage?.getItem("Id"); // Get Id inside the store
  return {
    cart: JSON.parse(localStorage?.getItem(`cart-${id}`)) || [],
    addToCart: (data) =>
      set((state) => {
        const id = localStorage?.getItem("Id"); // Ensure latest id
        if (!id) return state; // Prevent errors if id is missing

        const isExist = state.cart.some((d) => d?.id === data.id);
        if (isExist) return { cart: state.cart };

        data.quantity = 1;
        let updatedCart = [...state.cart, data];
        localStorage.setItem(`cart-${id}`, JSON.stringify(updatedCart));
        return { cart: updatedCart };
      }),
    updateCart: (id, count) =>
      set((state) => {
        const storageId = localStorage?.getItem("Id");
        if (!storageId) return state;

        const isExist = state.cart.some((d) => d?.id === id);
        if (!isExist) return { cart: state.cart };

        let updatedCart = state.cart
          .map((item) => {
            if (item.id === id) {
              let qnty = item.quantity + count;
              return qnty >= 1 ? { ...item, quantity: qnty } : null;
            }
            return item;
          })
          .filter(Boolean);

        localStorage.setItem(`cart-${storageId}`, JSON.stringify(updatedCart));
        return { cart: updatedCart };
      }),
    deleteCart: () =>
      set(() => {
        const id = localStorage?.getItem("Id");
        if (!id) return { cart: [] };

        localStorage.removeItem(`cart-${id}`);
        return { cart: [] };
      }),
  };
});
