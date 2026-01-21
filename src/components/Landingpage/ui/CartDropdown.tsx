import { useCart } from "@/context/CartContext";

const CartDropdown = () => {
    const { cart, removeFromCart, toggleSelect } = useCart();

    const selectedItems = cart.filter(i => i.selected);

    const total = selectedItems.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
    );

    if (cart.length === 0) {
        return (
        <div className="p-5">
            <h3 className="font-semibold mb-2">Your Cart</h3>
            <p className="text-sm text-gray-500">Your cart is empty.</p>
        </div>
        );
    }

    return (
        <div className="p-4">
        <h3 className="font-semibold mb-3">Your Cart</h3>

        <div className="space-y-3 max-h-60 overflow-auto">
            {cart.map(item => (
            <div
                key={item.variantId}
                className="flex gap-3 items-start"
            >
                {/* CHECKBOX */}
                <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.variantId)}
                className="mt-2"
                />

                <img
                src={item.image}
                className="w-12 h-12 rounded object-cover"
                />

                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                        {item.attributes.size} · {item.attributes.color}
                    </p>
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">
                            Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-black">Qty : {item.qty}</p>
                    </div>
                </div>

                {/* REMOVE */}
                <button
                onClick={() => removeFromCart(item.variantId)}
                className="text-xs text-red-500 h-5 w-5 flex items-center justify-center rounded-full hover:bg-red-100"
                >
                ✕
                </button>
            </div>
            ))}
        </div>

        <div className="border-t mt-3 pt-3">
            <div className="flex justify-between text-sm font-semibold mb-3">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>

            <button
            disabled={selectedItems.length === 0}
            className="w-full bg-brandblue text-white py-2 rounded-lg disabled:opacity-50"
            >
            Checkout
            </button>
        </div>
        </div>
    );
};

export default CartDropdown;