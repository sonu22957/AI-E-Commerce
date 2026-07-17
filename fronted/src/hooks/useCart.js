import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateItemQuantity, clearCart } from "../redux/cartSlice";

/**
 * useCart – custom hook that abstracts cart interactions.
 * Provides:
 *   - cart: array of cart items from Redux state
 *   - addToCart(product, quantity = 1)
 *   - removeFromCart(itemId)
 *   - updateQuantity(itemId, quantity)
 *   - clearCartItems()
 *   - totalAmount: computed total price
 */
export default function useCart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items || []);

  const addToCart = (product, quantity = 1) => {
    dispatch(addItem({ ...product, quantity }));
  };

  const removeFromCart = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateItemQuantity({ id: itemId, quantity }));
  };

  const clearCartItems = () => dispatch(clearCart());

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCartItems,
    totalAmount,
  };
}
