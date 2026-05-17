import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";


function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseCartQty,
    decreaseCartQty,
    removeFromCart,
  } = useCart();

  const totalMrp = cartItems.reduce(
    (total, item) =>
      total + (item.oldPrice || item.price) * item.qty,
    0
  );

  const savedAmount = totalMrp - cartTotal;
  const navigate = useNavigate();

  return (
    <section className="h-auto py-2">
      <div className="mx-auto max-w-7xl">  
        {/* FREE SHIPPING */}
        {cartItems.length > 0 && (
          <div className="mt-2 px-4 text-center text-md font-bold text-slate-900">
            CONGRATS! You get FREE SHIPPING 🎉
          </div>
        )}

        {/* MAIN GRID */}
        <div className={`mt-3 ${cartItems.length > 0 ? "grid gap-6 lg:grid-cols-[2fr_1fr]" : ""}`}>

          {/* LEFT - ITEMS */}
          <div
            className={cartItems.length === 0
              ? "flex min-h-[68vh] items-center justify-center px-4 py-8 sm:px-6"
              : "px-2"
            }
          >

            {cartItems.length === 0 ? (
              <div className="w-full max-w-md rounded-lg px-6 py-10 text-center">
                <div className="relative mx-auto mb-6 h-28 w-28">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-violet-50 shadow-inner">
                    <ShoppingBag className="h-12 w-12 text-[#00607a]" strokeWidth={1.8} />
                  </div>
                  <div className="absolute -right-1 -top-1 rounded-full bg-[#00607a] p-1.5 text-white shadow-md">
                    <Sparkles size={14} />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-slate-900">Your cart is empty</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Add your skincare favorites to continue. Your selected products will appear here.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-6 rounded-lg bg-[#00607a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#105365] cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-1 md:gap-3 py-1 px-2 border border-gray-300 rounded-lg">

                    {/* IMAGE */}
                    <div className="flex h-20 w-20 items-center justify-center bg-white">
                      <img
                        src={item.image}
                        className="h-20 object-contain"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col justify-between">

                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm md:text-lg font-semibold text-slate-900 line-clamp-2">
                            {item.name}
                          </h3>
                          {item.size && ( 
                            <p className="text-sm text-slate-500">
                              {item.size}
                            </p>
                          )}
                          <div className="md:mt-1 flex items-center gap-1 text-[12px] md:text-[14px]">
                            <span className="tracking-[1px] text-[#f4c20d]">★★★★☆</span>
                            <span className="text-[#374151] text-[14px]">{item.rating ? Number(item.rating).toFixed(1) : "4.5"}</span>
                          </div>
                        </div>

                        <button onClick={() => removeFromCart(item.cartId)} className="mt-1 flex-shrink-0 self-start">
                          <Trash2 className="text-gray-400 hover:text-red-300 h-4 md:h-5 cursor-pointer"/>
                        </button>
                      </div>

                      {/* QTY */}
                      <div className="flex items-center justify-between">

                        <div className="flex bg-gray-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => decreaseCartQty(item.id)}
                            className="px-1 py-1"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="px-1">{item.qty}</span>

                          <button
                            onClick={() => increaseCartQty(item.id)}
                            className="px-1 py-1"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="text-right">
                          <p className="text-[#207a6e] text-lg font-semibold">
                            ₹{item.price * item.qty}
                          </p>

                          {item.oldPrice && (
                            <p className="line-through text-gray-400 text-sm">
                              ₹{item.oldPrice * item.qty}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - SUMMARY (same design) */}
          {cartItems.length > 0 && (
            <div className="h-fit bg-[#f3edf7] px-4 md:px-6 md:mr-4 sticky top-6 rounded-lg">

              {/* SAVE BOX */}
              {/* <div className="rounded-2xl bg-green-50 mt-4 px-4 py-4 text-center text-lg font-medium text-slate-900">
                🪙 Wow! Saved ₹{savedAmount} on your order
              </div> */}

              {/* SUBTOTAL */}
              <div className="mt-5 flex justify-between text-lg font-normal">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal}</span>
              </div>

              {/* MRP */}
              {totalMrp > cartTotal && (
                <div className="flex justify-between text-gray-400 line-through mt-1">
                  <span>MRP</span>
                  <span>₹{totalMrp}</span>
                </div>
              )}

              {/* CHECKOUT */}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-lg bg-linear-to-r cursor-pointer from-[#00607a] to-[#044355] py-3 text-lg font-normal text-white">
                🔒 SECURE CHECKOUT
              </button>

              {/* TERMS */}
              <p className="mt-4 text-center text-sm text-slate-600">
                By Signing In, I agree to{" "}
                <span className="text-[#00607a] underline">
                  Term & Conditions
                </span>{" "}
                and{" "}
                <span className="text-[#00607a] underline">
                  Privacy Policy
                </span>
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Cart;