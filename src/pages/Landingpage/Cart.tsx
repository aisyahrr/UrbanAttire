import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
    const {
        cart,
        updateQty,
        removeFromCart,
        toggleSelect,
    } = useCart();

    const selectedItems = cart.filter(i => i.selected);

    const subtotal = selectedItems.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
    );

    const shipping = subtotal > 0 ? 7000 : 0;
    const total = subtotal + shipping;

    return (
        <div className="pb-28 md:hidden">
        {/* Header */}
            <div className=" top-0 bg-white z-10 border-b border-gray-300 px-4 py-3 relative">

            {/* Title */}
            <h1 className="text-center font-semibold text-lg text-primary">
                Your Cart
            </h1>
            </div>

        {/* Cart Items */}
        <div className="px-4 py-4 space-y-4">
            {cart.map(item => (
            <div
                key={item.variantId}
                className="flex gap-3"
            >
                <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.variantId)}
                />
                <div className="flex-1 flex gap-3  border border-gray-200 shadow-sm rounded-lg p-3">
                    <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                    />

                    <div className="flex-1">
                        <div className="flex justify-between items-center ">
                            <div>
                                <h2 className="text-sm font-medium">{item.name}</h2>
                                <p className="text-xs text-gray-500">
                                    {item.attributes.size} · {item.attributes.color}
                                </p>

                                <p className="font-semibold mt-1">
                                    Rp {item.price.toLocaleString()}
                                </p>
                            </div>
                            {/* Qty Control */}
                            <div className="flex items-center justify-center p-2 h-10 w-20 border-2 border-gray-300 rounded-lg">
                                <button
                                onClick={() =>
                                    updateQty(item.variantId, item.qty - 1)
                                }
                                className="flex justify-center px-2 py-2 h-6 w-6 items-center bg-brandblue text-white rounded-md text-base font-bold"
                                >
                                -
                                </button>

                                <span className="text-sm px-2">{item.qty}</span>

                                <button
                                onClick={() =>
                                    updateQty(item.variantId, item.qty + 1)
                                }
                                className="flex justify-center px-2 py-2 h-6 w-6 items-center bg-brandblue text-white rounded-md text-base font-bold"
                                >
                                +
                                </button>
                            </div>
                        </div>
                    <div className="flex items-center gap-3">
                        <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="ml-auto text-red-500 text-xs"
                        >
                        Remove
                        </button>
                    </div>
                    </div>
                </div>
            </div>
            ))}
        </div>

        {/* Summary */}
        <div className="px-4 py-4 border-t border-gray-300 space-y-2">
            <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>Rp {shipping.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp {total.toLocaleString()}</span>
            </div>
        </div>

        {/* Checkout Button */}
        <div className=" bg-white border-t border-gray-300 p-4 md:hidden">
            <button
            disabled={selectedItems.length === 0}
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
            Proceed to Checkout
            </button>
        </div>
        </div>
    );
};

export default Cart;
