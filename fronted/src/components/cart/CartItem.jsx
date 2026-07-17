import React from "react";
import { useDispatch } from "react-redux";
import { updateItemQuantity, removeItem } from "../../redux/cartSlice";
import Button from "../common/Button";
import Input from "../common/Input";
import { FiTrash2 } from "react-icons/fi";

/**
 * CartItem component
 * -----------------
 * Displays a single product in the shopping cart with:
 *   • Product thumbnail, name, price.
 *   • Quantity input (numeric) with increment/decrement buttons.
 *   • Remove button.
 *   • Dispatches Redux actions to keep the global cart state in sync.
 *
 * Design goals:
 *   • Premium look using Tailwind CSS, dark‑mode aware.
 *   • Accessible (ARIA labels, keyboard‑friendly).
 *   • Micro‑animations for button presses.
 */
export default function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    const qty = Number(e.target.value);
    if (qty > 0) {
      dispatch(updateItemQuantity({ id: item.id, quantity: qty }));
    }
  };

  const increment = () => {
    dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const decrement = () => {
    if (item.quantity > 1) {
      dispatch(updateItemQuantity({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
      {/* Image */}
      <img
        src={
          (item.images && item.images.length > 0)
            ? item.images[0]
            : item.image || `https://picsum.photos/seed/${item._id || item.id}/150/150`
        }
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md mr-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://picsum.photos/seed/${item._id || item.id}/150/150`;
        }}
      />

      {/* Details */}
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{item.price}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center space-x-1 mr-4">
        <Button
          onClick={decrement}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
          aria-label="Decrease quantity"
        >
          –
        </Button>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-12 text-center border rounded"
          aria-label="Quantity"
        />
        <Button
          onClick={increment}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>

      {/* Remove button */}
      <Button
        onClick={handleRemove}
        className="p-2 text-red-600 hover:text-red-800"
        aria-label="Remove item"
      >
        <FiTrash2 size={20} />
      </Button>
    </div>
  );
}
