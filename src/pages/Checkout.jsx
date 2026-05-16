import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Stethoscope,
  ShoppingBag,
  X,
  CheckCircle2,
  XCircle,
  Wallet,
  Landmark,
  CreditCard,
  BadgeIndianRupee,
  Trash2,
  Edit3,
  PlusCircle,
  MapPin,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { fetchApi } from "../api/client.js";
import toast from "react-hot-toast";

function Checkout() {
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  // Address Management State
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("user_addresses");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(addresses.length > 0 ? 0 : null);

  const [step, setStep] = useState(2);
  const [status, setStatus] = useState("idle");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
  });

  const saveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    localStorage.setItem("user_addresses", JSON.stringify(newAddresses));
  };

  const handleSaveAddress = () => {
    if (!validateAddressStep()) {
      toast.error("Please fill all details correctly.");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...addresses];
      updated[editingIndex] = formData;
      saveAddresses(updated);
      setEditingIndex(null);
    } else {
      const updated = [...addresses, formData];
      saveAddresses(updated);
      setSelectedAddressIndex(updated.length - 1);
    }
    setIsAddingNew(false);
    setFormData({ fullName: "", address1: "", pincode: "", city: "", state: "", email: "" });
  };

  const handleDeleteAddress = (index, e) => {
    e.stopPropagation();
    const updated = addresses.filter((_, i) => i !== index);
    saveAddresses(updated);
    if (selectedAddressIndex === index) setSelectedAddressIndex(null);
    else if (selectedAddressIndex > index) setSelectedAddressIndex(selectedAddressIndex - 1);
  };

  const handleEditAddress = (index, e) => {
    e.stopPropagation();
    setFormData(addresses[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index);
  };

  const fakeResult = "success";

  const totalMrp = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.oldPrice || item.price) * item.qty,
      0,
    );
  }, [cartItems]);

  const totalWeight = useMemo(() => {
    // Assuming average skincare product is 200g
    return cartItems.reduce((total, item) => total + (item.qty * 200), 0);
  }, [cartItems]);

  const shippingDetails = useMemo(() => {
    if (selectedAddressIndex === null) return { shipping: 0, tax: cartTotal * 0.18, totalWeight: 0, reason: "Select address" };
    
    const addr = addresses[selectedAddressIndex];
    let baseShipping = 40; // Base rate
    
    // Weight charge (₹20 per 500g)
    const weightCharge = Math.max(0, Math.ceil(totalWeight / 500) * 20);
    
    // Distance charge based on state (Store is in Delhi)
    let distanceCharge = 0;
    const isLocal = addr.state.toLowerCase().includes("delhi");
    const isNorth = ["haryana", "punjab", "uttar pradesh", "rajasthan", "uttarakhand"].some(s => addr.state.toLowerCase().includes(s));
    
    if (isLocal) distanceCharge = 0;
    else if (isNorth) distanceCharge = 40;
    else distanceCharge = 90;

    return { 
      shipping: baseShipping + weightCharge + distanceCharge,
      tax: cartTotal * 0.18, // 18% GST
      totalWeight,
      isLocal
    };
  }, [selectedAddressIndex, addresses, cartItems, cartTotal, totalWeight]);

  const totalSavings = totalMrp - cartTotal;

  const deliveryDate = useMemo(() => {
    if (selectedAddressIndex === null) return null;
    
    const today = new Date();
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    };

    if (shippingDetails.isLocal) {
      return `${addDays(today, 2)} - ${addDays(today, 3)}`;
    }
    return `${addDays(today, 5)} - ${addDays(today, 7)}`;
  }, [shippingDetails.isLocal, selectedAddressIndex]);

  const grandTotal = useMemo(() => {
    return cartTotal + (shippingDetails.shipping || 0) + (shippingDetails.tax || 0);
  }, [cartTotal, shippingDetails]);

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateAddressStep = () => {
    return (
      formData.fullName.trim() &&
      formData.address1.trim() &&
      formData.pincode.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.email.trim()
    );
  };

  const handleContinueToPayment = () => {
    if (selectedAddressIndex === null) {
      toast.error("Please select or add a delivery address.");
      return;
    }
    setStep(3);
  };

  const handlePayment = async () => {
    try {
      setStatus("processing");

      // 1) Create order on backend (this returns Razorpay order + key id)
      const data = await fetchApi("/api/payments/create-order", {
        method: "POST",
        body: {
          shipping: shippingDetails.shipping,
          tax: shippingDetails.tax
        }
      });

      // 2) Load Razorpay checkout script
      await new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
        document.body.appendChild(script);
      });

      // 3) Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "MEDIGLOW",
        description: "Order Payment",
        image: "https://res.cloudinary.com/duv9f7psv/image/upload/v1715865059/mediglow_placeholder.png",
        order_id: data.order.id,
        modal: {
          ondismiss: function() {
            setStatus("idle");
          },
          escape: true,
          backdropclose: false
        },
        prefill: {
          name: addresses[selectedAddressIndex].fullName,
          email: addresses[selectedAddressIndex].email,
        },
        handler: async function (response) {
          try {
            // 4) Verify payment on backend
            await fetchApi("/api/payments/verify", {
              method: "POST",
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            setStatus("success");
            clearCart();
          } catch (err) {
            console.error("Payment verification failed", err);
            toast.error(err?.message || "Payment verification failed");
            setStatus("failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function (response) {
        setStatus("failed");
      });
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err?.message || "Payment failed. See console for details");
      setStatus("failed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const paymentOptions = [
    {
      key: "upi",
      label: "UPI",
      icon: BadgeIndianRupee,
    },
    {
      key: "card",
      label: "Card/ Card EMI",
      icon: CreditCard,
    },
    {
      key: "wallet",
      label: "Wallets",
      icon: Wallet,
    },
    {
      key: "netbanking",
      label: "Net Banking",
      icon: Landmark,
    },
  ];

  if (status === "success") {
    return (
      <section className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="rounded-lg bg-white p-5 text-center shadow-2xl">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-4 text-3xl font-semibold text-[#111827]">
              Payment Successful
            </h2>
            <p className="mt-3 text-base text-[#6b7280]">
              Your order has been placed successfully.
            </p>
            {deliveryDate && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">Estimated Delivery</p>
                <p className="text-lg font-bold text-blue-900">{deliveryDate}</p>
              </div>
            )}
            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#00607a] to-[#025065] py-3 text-lg font-semibold text-white cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="min-h-screen bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-[28px] bg-white p-8 text-center shadow-lg">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-3xl font-semibold text-[#111827]">
              Payment Failed
            </h2>
            <p className="mt-3 text-base text-[#6b7280]">
              Something went wrong while processing your payment.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStatus("idle")}
                className="flex-1 rounded-xl border border-[#207a6e] py-3 text-base font-semibold text-[#207a6e]"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#207a6e] to-[#6d28d9] py-3 text-base font-semibold text-white"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-2 md:px-1 py-2">
      <div>
        <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* LEFT SUMMARY */}
          <aside className="border-b border-gray-200 lg:border-b-0 lg:border-r h-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#111827]">
                Order Summary
              </h2>
              <ShoppingBag className="h-6 w-6 text-[#6b7280]" />
            </div>

            <div className="mt-1">
              <div className="max-h-[330px] space-y-2 overflow-y-auto pr-1 scrollbar-hide">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-[#6b7280]">No items in cart.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-2 rounded-lg border border-gray-300 px-2 py-2"
                    >
                      <div className="flex h-[72px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[64px] w-auto object-contain"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <h3 className="text-[16px] leading-6 text-[#111827]">
                          {item.name}
                          {item.size ? ` - ${item.size}` : ""}
                        </h3>

                        <div className="mt-2 flex items-center justify-between text-sm font-bold text-[#111827]">
                          <span>Quantity: {item.qty}</span>
                          <span>
                            Price: ₹{(Number(item.price) * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  Shipping 
                  <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">
                    {shippingDetails.totalWeight}g
                  </span>
                </span>
                <span className="font-semibold text-gray-900">
                  {selectedAddressIndex !== null ? `₹${shippingDetails.shipping.toFixed(2)}` : "TBC"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>GST (18%)</span>
                <span className="font-semibold text-gray-900">₹{shippingDetails.tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-lg font-black text-gray-900">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="mt-4 rounded-xl bg-green-50 p-3 text-center text-xs font-bold text-green-700 border border-green-100 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Wow! You saved ₹{totalSavings.toFixed(2)} on this order
                </div>
              )}

              {deliveryDate && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                  Estimated delivery: <span className="text-gray-900 font-bold">{deliveryDate}</span>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="px-2 md:py-0 pt-8">
            {/* STEP LABELS */}
            <div className="mt-2 flex items-center justify-between text-[16px] text-[#111827] sm:text-[17px]">
              <span className={step >= 1 ? "font-medium" : ""}>1. Contact</span>
              <span className={step >= 2 ? "font-medium" : ""}>2. Address</span>
              <span className={step >= 3 ? "font-medium" : ""}>3. Payment</span>
            </div>

            {/* PROGRESS */}
            <div className="h-1 rounded-full bg-[#dddddd]">
              <div
                className={`h-1 rounded-full bg-gradient-to-r from-[#89d8ce] to-[#207a6e] transition-all duration-300 ${
                  step === 1 ? "w-1/3" : step === 2 ? "w-1/2" : "w-[92%]"
                }`}
              />
            </div>

            {/* ADDRESS STEP */}
            {step === 2 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="text-[#00607a]" />
                    Delivery Address
                  </h1>
                  {!isAddingNew && (
                    <button
                      onClick={() => {
                        setFormData({ fullName: "", address1: "", pincode: "", city: "", state: "", email: "" });
                        setEditingIndex(null);
                        setIsAddingNew(true);
                      }}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#00607a] hover:text-[#045065] transition-colors"
                    >
                      <PlusCircle size={18} />
                      Add New
                    </button>
                  )}
                </div>

                {!isAddingNew ? (
                  <div className="space-y-4">
                    {addresses.length > 0 ? (
                      addresses.map((addr, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectAddress(idx)}
                          className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 ${
                            selectedAddressIndex === idx
                              ? "border-[#00607a] bg-[#f0f9fa] shadow-md"
                              : "border-gray-100 bg-white hover:border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg text-gray-900">{addr.fullName}</span>
                                {selectedAddressIndex === idx && (
                                  <span className="bg-[#00607a] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed max-w-[80%]">
                                {addr.address1}, {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 font-medium">{addr.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => handleEditAddress(idx, e)}
                                className="p-2 text-gray-400 hover:text-[#00607a] hover:bg-[#00607a]/10 rounded-full transition-all"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteAddress(idx, e)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No addresses saved yet.</p>
                        <button
                          onClick={() => setIsAddingNew(true)}
                          className="mt-2 text-[#00607a] font-bold text-sm"
                        >
                          + Add your first address
                        </button>
                      </div>
                    )}

                    {addresses.length > 0 && (
                      <button
                        onClick={handleContinueToPayment}
                        className="mt-6 flex h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-black text-lg font-bold text-white shadow-xl hover:bg-gray-900 transition-all transform active:scale-[0.98]"
                      >
                        Deliver to this Address
                        <ArrowRight size={20} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                      {editingIndex !== null ? "Edit Address" : "Add New Address"}
                    </h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          placeholder="Full Name"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm focus:border-[#00607a] focus:ring-2 focus:ring-[#00607a]/10 outline-none transition-all"
                        />
                      </div>
                      <textarea
                        value={formData.address1}
                        onChange={(e) => updateField("address1", e.target.value)}
                        placeholder="House No, Street, Landmark..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm focus:border-[#00607a] focus:ring-2 focus:ring-[#00607a]/10 outline-none transition-all"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => updateField("pincode", e.target.value)}
                          placeholder="Pincode"
                          className="rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm focus:border-[#00607a] outline-none"
                        />
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          placeholder="City"
                          className="rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm focus:border-[#00607a] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          placeholder="State"
                          className="rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm focus:border-[#00607a] outline-none"
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="Email Address"
                          className="rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm focus:border-[#00607a] outline-none"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSaveAddress}
                          className="flex-1 h-[54px] rounded-2xl bg-[#00607a] text-white font-bold hover:bg-[#045065] transition-all"
                        >
                          {editingIndex !== null ? "Update Address" : "Save Address"}
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingIndex(null);
                          }}
                          className="flex-1 h-[54px] rounded-2xl border border-gray-300 bg-white text-gray-700 font-bold hover:bg-gray-100 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAYMENT STEP */}
            {step === 3 && (
              <div className="mt-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="max-w-md mx-auto text-center">
                  <div className="mb-8 p-6 bg-[#f0f9fa] rounded-3xl border border-[#00607a]/20">
                    <p className="text-gray-600 text-sm mb-1 uppercase tracking-widest font-bold">Amount to Pay</p>
                    <h2 className="text-5xl font-black text-[#00607a]">₹{grandTotal.toFixed(2)}</h2>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={status === "processing"}
                    className="group relative w-full h-[72px] overflow-hidden rounded-[24px] bg-black p-[2px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00607a] via-[#207a6e] to-[#00607a] animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex h-full w-full items-center justify-center rounded-[22px] bg-black group-hover:bg-transparent transition-colors">
                      <span className="flex items-center gap-3 text-xl font-black text-white">
                        {status === "processing" ? (
                          <>
                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-6 w-6 fill-white" />
                            Pay Securely Now
                          </>
                        )}
                      </span>
                    </div>
                  </button>

                  <div className="mt-8 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="PayPal" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
                    <div className="text-xs font-bold text-gray-400">RAZORPAY SECURE</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
