import { useState } from "react";
import { Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setIsSubmitting(true);
      const data = await login(email, password);
      
      // Strict role validation
      if (data.user.role !== role) {
        logout();
        toast.error(`Unauthorized: This account is not authorized for the ${role} portal.`);
        return;
      }

      toast.success("Login successful!");
      
      if (data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-full mt-10 mb-10 flex items-center justify-center px-4">
      {/* CARD */}
      <div className="w-full max-w-md rounded-lg px-3 py-4">
        {/* LOGO */}
        <div className="flex justify-center mb-2">
          <img
            src="/src/assets/images/icons/logo1.png"
            alt="Clinikally"
            className="h-8 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold text-[#111827]">
          Welcome Back
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Login to continue your skincare journey
        </p>

        {/* ROLE SELECTION (Tab Switcher) */}
        <div className="mt-8 space-y-2 px-4">
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                role === "user"
                  ? "bg-white text-[#207a6e] shadow-sm"
                  : "text-gray-500 hover:text-[#207a6e]"
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
                  : "text-gray-500 hover:text-[#207a6e]"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Administrator
            </button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 px-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
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
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 outline-none focus:border-[#207a6e] focus:ring-1 focus:ring-[#207a6e]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* FORGOT */}
          <div className="text-right">
            <button type="button" className="text-sm font-medium text-[#207a6e] hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-[#207a6e] to-[#197064] py-3 text-white font-semibold hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-300"></div>
          </div>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer font-medium text-[#207a6e] hover:underline"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
