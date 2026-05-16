import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchApi } from "../api/client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const data = await fetchApi("/api/cart");
      // Map backend cart data (cartId, productId, name, price, quantity)
      // to frontend format (id, name, price, qty, image, cartId)
      const formatted = data.map((item) => ({
        id: item.product_id,
        cartId: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
        image: item.image_url,
        rating: item.rating,
      }));
      setCartItems(formatted);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      // If not logged in, inform the user
      toast.error("Please login first to add items in cart");
      return;
    }

    try {
      const existingItem = cartItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Update quantity in backend
        await fetchApi("/api/cart/update", {
          method: "PUT",
          body: { cartId: existingItem.cartId, quantity: existingItem.qty + 1 },
        });
        // Optimistically update local state so UI reflects change immediately
        setCartItems((prev) =>
          prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i)),
        );
      } else {
        // Add new item in backend
        const resp = await fetchApi("/api/cart/add", {
          method: "POST",
          body: { productId: product.id, quantity: 1 },
        });
        // Backend returns { cartId } — use it to insert the new item locally
        const newCartId = resp?.cartId;
        const newItem = {
          id: product.id,
          cartId: newCartId,
          name: product.name,
          price: product.price,
          qty: 1,
          image: product.image,
          rating: product.rating,
        };
        setCartItems((prev) => [newItem, ...prev]);
      }
      // Re-fetch cart from backend to stay in sync
      await fetchCart();
      toast.success("Product added successfully");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await fetchApi(`/api/cart/${cartId}`, { method: "DELETE" });
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const updateQtyInBackend = async (cartId, newQty) => {
    if (newQty < 1) return removeFromCart(cartId);
    try {
      await fetchApi("/api/cart/update", {
        method: "PUT",
        body: { cartId, quantity: newQty },
      });
      await fetchCart();
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  const increaseCartQty = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) updateQtyInBackend(item.cartId, item.qty + 1);
  };

  const decreaseCartQty = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) updateQtyInBackend(item.cartId, item.qty - 1);
  };

  const clearCart = () => {
    // Usually backend clears cart after order creation, but we can also manually clear
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.qty,
      0,
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseCartQty,
        decreaseCartQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
