import { create } from "zustand";
const id=localStorage?.getItem("Id");
export const productStore = create((set) => ({
  product: JSON.parse(localStorage.getItem(localStorage.getItem("Id"))) || [],

  addProduct: (data) =>
    set((state) => {
      const id = localStorage.getItem("Id"); 
      if (!id) return state;
      const isFav = state.product.some((p) => p?.id === data.id);
      let updatedProducts;
      if (isFav) {
        updatedProducts = state.product.filter((p) => p?.id !== data.id);
      } else {
        updatedProducts = [...state.product, data];
      }
      localStorage.setItem(`${id}`, JSON.stringify(updatedProducts));
      return { product: updatedProducts };
    }),
}));
