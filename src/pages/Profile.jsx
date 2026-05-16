import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Hash,
  LogOut,
  Mail,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fullName = user?.full_name || user?.fullName || "Guest User";
  const email = user?.email || "Not available";
  const role = user?.role || "user";
  const userId = user?.id ? `#${user.id}` : "Not assigned";

  const memberSince = useMemo(() => {
    if (!user?.created_at) return "Recently joined";
    const date = new Date(user.created_at);

    if (Number.isNaN(date.getTime())) return "Recently joined";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [user?.created_at]);

  const initials = useMemo(() => {
    const parts = fullName
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2);

    if (!parts.length) return "GU";

    return parts
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  }, [fullName]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="px-4 py-2 md:px-6 md:py-7">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-lg border border-[#e9dcff] bg-white shadow-sm">
          <div className="h-28 bg-linear-to-r from-[#207a6e] via-[#32897e] to-[#2eb9a6] md:h-32" />

          <div className="px-5 pb-6 md:px-8 md:pb-8">
            <div className="-mt-12 flex flex-col gap-4 md:-mt-14 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#111827] text-2xl font-bold text-white shadow-md md:h-24 md:w-24 md:text-3xl">
                  {initials}
                </div>

                <div>
                  <h1 className="text-xl font-bold text-black md:text-3xl">
                    {fullName}
                  </h1>
                  <p className="text-sm text-white">{email}</p>

                  <span className="mt-3 inline-flex rounded-lg bg-[#207a6e] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {role} account
                  </span>
                </div>
              </div>

             
            </div>

            <div className="mt-6 grid gap-3 rounded-lg border border-gray-200 bg-[#fbfbfd] p-4 text-sm text-gray-600 sm:grid-cols-3 sm:gap-4 sm:p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#207a6e]" />
                Verified customer account
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#207a6e]" />
                Member since {memberSince}
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-[#207a6e]" />
                Customer ID {userId}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold text-[#111827]">Personal Information</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your account details synced with Clinikally.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Full Name
                </p>
                <p className="mt-2 flex items-center gap-2 text-[15px] font-semibold text-[#111827]">
                  <UserRound className="h-4 w-4 text-[#207a6e]" />
                  {fullName}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email Address
                </p>
                <p className="mt-2 flex items-center gap-2 text-[15px] font-semibold text-[#111827] break-all">
                  <Mail className="h-4 w-4 text-[#207a6e]" />
                  {email}
                </p>
              </div>
              
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Member Since
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#111827]">
                  {memberSince}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold text-[#111827]">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your shopping and account journey.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => navigate("/orders")}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left cursor-pointer"
              >
                <span className="flex items-center gap-2 font-semibold text-[#111827]">
                  <ShoppingBag className="h-4 w-4 text-[#207a6e]" />
                  View Order History
                </span>
                <ArrowRight className="h-4 w-4 text-[#207a6e]" />
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-3 text-left cursor-pointer"
              >
                <span className="font-semibold text-[#111827]">Continue to Checkout</span>
                <ArrowRight className="h-4 w-4 text-[#207a6e]" />
              </button>
               <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#207a6e] cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-linear-to-r from-[#207a6e] via-[#32897e] to-[#2eb9a6] p-4 text-white">
              <p className="text-sm font-semibold">Need help with your routine?</p>
              <p className="mt-1 text-sm text-white/90">
                Visit your recent orders and repeat trusted dermatologist picks in one tap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
