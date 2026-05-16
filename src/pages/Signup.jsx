import { useState } from "react";
import { Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setIsSubmitting(true);
      await signup(fullName, email, password, role);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-10 mb-10 flex min-h-full items-center justify-center px-4">
      {/* CARD */}
      <div className="w-full max-w-md rounded-lg px-3 py-4">
        {/* LOGO */}
        <div className="mb-2 flex justify-center">
          <h1 
            className="text-4xl font-black tracking-tighter text-[#207a6e] cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            MEDIGLOW<span className="text-[#00607a]">.</span>
          </h1>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold text-[#111827]">
          Create Account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Sign up to start your skincare journey
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* FULL NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#207a6e] focus:ring-1 focus:ring-[#207a6e]"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#207a6e] focus:ring-1 focus:ring-[#207a6e]"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 outline-none focus:border-[#207a6e] focus:ring-1 focus:ring-[#207a6e]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 outline-none focus:border-[#207a6e] focus:ring-1 focus:ring-[#207a6e]"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* ROLE SELECTION (Tab Switcher) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">I am a:</label>
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  role === "user"
                    ? "bg-white text-[#207a6e] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <User className="h-4 w-4" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  role === "admin"
                    ? "bg-white text-[#207a6e] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Administrator
              </button>
            </div>
          </div>

          {/* SIGNUP BUTTON */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-[#207a6e] to-[#197064] py-3 font-semibold text-white transition hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-300"></div>
          </div>


          {/* LOGIN */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-medium text-[#207a6e] hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;
