import { CheckCircle, X } from "lucide-react";
import { useCart } from "../context/CartContext";

function Toast() {
  const { toast, setToast } = useCart();

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-[9999] w-[calc(100%-32px)] max-w-md -translate-x-1/2 transform transition-all duration-300 ${
        toast.show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-white px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-slate-800 sm:text-base">
            {toast.message}
          </p>
        </div>

        <button
          onClick={() => setToast({ show: false, message: "" })}
          className="shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Toast;