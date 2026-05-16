import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import { fetchApi } from "../api/client.js";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import blogImg1 from "/src/assets/images/blogs/img1.avif";
import blogImg2 from "/src/assets/images/blogs/img2.avif";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Home() {
  const [categories, setCategories] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [concernTabs, setConcernTabs] = useState([]);
  const [concernProducts, setConcernProducts] = useState({});
  const [promoBanners, setPromoBanners] = useState([]);
  const [essentialsProducts, setEssentialsProducts] = useState([]);
  const [dualPromoBanners, setDualPromoBanners] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState(null);

  const [activeConcern, setActiveConcern] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);

  const [currentDualBanner, setCurrentDualBanner] = useState(0);
  const [previousDualBanner, setPreviousDualBanner] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState("next");

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    setHomeLoading(true);
    setHomeError(null);
    fetchApi("/api/home")
      .then((data) => {
        setCategories(data.categories || []);
        setTopSellers(data.topSellers || []);
        setBrands(data.brands || []);
        setConcernTabs(data.concernTabs || []);
        setConcernProducts(data.concernProducts || {});
        setPromoBanners(data.promoBanners || []);
        setEssentialsProducts(data.essentialsProducts || []);
        setDualPromoBanners(data.dualPromoBanners || []);
        setTrendingProducts(data.trendingProducts || []);
        const first = data.concernTabs?.[0];
        if (first) setActiveConcern(first);
      })
      .catch((err) => {
        console.error("[Home] API /api/home failed:", err);
        setHomeError(err.message || "Backend se data nahi mila.");
      })
      .finally(() => setHomeLoading(false));
  }, []);

  const handleAddToCart = (item) => {
    if (!item) return;
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.gallery?.[0] || item.image,
      rating: item.rating,
    });
    setAddedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
  };

  const brandRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const container = brandRef.current;

    if (!container) return;

    const interval = setInterval(() => {
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        // end pe pahunch gaya → wapas start
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        // normal scroll right
        container.scrollBy({
          left: 200,
          behavior: "smooth",
        });
      }
    }, 2000); // 2 sec

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = categoryRef.current;
    // Auto-scroll disabled — user requested manual control only.
  }, [categories.length]);

  useEffect(() => {
    if (promoBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === promoBanners.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [promoBanners.length]);

  const handlePrevBanner = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? promoBanners.length - 1 : prev - 1,
    );
  };

  const handleNextBanner = () => {
    setCurrentBanner((prev) =>
      prev === promoBanners.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    if (dualPromoBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentDualBanner((prev) =>
        prev === dualPromoBanners.length - 1 ? 0 : prev + 1,
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [dualPromoBanners.length]);

  const trendingRef = useRef(null);

  const scrollTrendingLeft = () => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({
        left: -280,
        behavior: "smooth",
      });
    }
  };

  const scrollTrendingRight = () => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({
        left: 280,
        behavior: "smooth",
      });
    }
  };

  const essentialsRef = useRef(null);

  const scrollEssentialsRight = () => {
    if (essentialsRef.current) {
      essentialsRef.current.scrollBy({
        left: 260,
        behavior: "smooth",
      });
    }
  };

  const brandRef1 = useRef(null);

  const scrollBrandLeft = () => {
    if (brandRef1.current) {
      brandRef.current.scrollBy({
        left: -220,
        behavior: "smooth",
      });
    }
  };

  const scrollBrandRight = () => {
    if (brandRef1.current) {
      brandRef.current.scrollBy({
        left: 220,
        behavior: "smooth",
      });
    }
  };

  const topSellerRef = useRef(null);

  const scrollTopSellerLeft = () => {
    if (topSellerRef.current) {
      topSellerRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const scrollTopSellerRight = () => {
    if (topSellerRef.current) {
      topSellerRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  const [openIndex, setOpenIndex] = useState(0);

  // apni images yahan daal do
  const images = [
    "/src/assets/images/products/2000x1512_Foaming_Face_Wash.png",
    "/src/assets/images/products/hair.png",
    "/src/assets/images/products/foll.png",
  ];

  const accordionData = [
    {
      title: "How does DermaWala work?",
      content:
        "Backed by leading dermatologists and cutting-edge science, Dermawala's digital health platform is making personalised skincare accessible to all. We craft treatment plans that will work for you, and deliver them at your doorstep. Start an online visit - and enjoy all your skin and hair-related needs at your fingertips!",
    },
    {
      title: "Why is skin & hair care important?",
      content:
        "Healthy skin and hair are essential for overall confidence and wellbeing. Proper care helps prevent common issues, supports long-term health, and keeps your skin barrier and scalp in better condition.",
    },
    {
      title: "How do skincare products help?",
      content:
        "Skincare products help cleanse, protect, hydrate, and target specific concerns like acne, dryness, pigmentation, and aging. The right products improve skin texture and support healthier skin over time.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let index = 0;

    const interval = setInterval(() => {
      const childWidth = container.clientWidth;

      index = (index + 1) % container.children.length;

      container.scrollTo({
        left: index * childWidth,
        behavior: "smooth",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="bg-white">
      {homeLoading && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
          Loading products…
        </div>
      )}
      {homeError && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
          <strong>Backend connect nahi ho paya.</strong> Pehle terminal me{" "}
          <code className="rounded bg-red-100 px-1">cd backend</code> phir{" "}
          <code className="rounded bg-red-100 px-1">node server.js</code> chalao
          (port 5000). MySQL +{" "}
          <code className="rounded bg-red-100 px-1">schema.sql</code> +{" "}
          <code className="rounded bg-red-100 px-1">seed.sql</code> run ho chuke
          hon. Error: {homeError}
        </div>
      )}
      {/* ===== HERO SECTION (FULL IMAGE BANNER) ===== */}
      <section>
        <div className="overflow-hidden">
          <img
            src="src/assets/images/home/banner1.png"
            alt="Hero Banner"
            className="
            w-full
                h-[160px] 
                md:h-[370px]   
                md:object-fit
                object-cover
              "
          />
        </div>
      </section>

      {/* ===== CATEGORY SECTION ===== */}
      <section className="py-1 md:py-3">
        <div className="px-2">
          {/* Desktop / Tablet Horizontal Scroller */}
          <div
            ref={categoryRef}
            className="hidden sm:flex gap-4 pt-3 overflow-x-auto scrollbar-hide"
          >
            {categories.map((item, index) => (
              <div
                key={`cat-${item.id}-${index}`}
                onClick={() => navigate(`/collection?category=${item.id}`)}
                className="min-w-[160px] flex-shrink-0 cursor-pointer bg-white p-1 text-center border border-gray-300 rounded-lg"
              >
                <div className="mx-auto mb-4 flex h-29 items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-30 object-contain"
                  />
                </div>
                <h3 className="font-medium text-black md:text-xl">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="flex overflow-x-auto sm:hidden scrollbar-hide">
            {categories.map((item, index) => (
              <div
                key={`cat-mob-${item.id}-${index}`}
                onClick={() => navigate(`/collection?category=${item.id}`)}
                className="flex-shrink-0 cursor-pointer bg-white px-1 py-2 text-center"
              >
                <div className="mx-auto border border-gray-200 rounded-lg mb-2 flex h-20 items-center justify-center overflow-hidden p-1">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-18 w-18 object-contain"
                  />
                </div>
                <h3 className="text-sm font-bold text-black">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP SELLERS ===== */}
      <section>
        <div className="px-3 md:mt-6">
          <SectionTitle title="Top Sellers" />

          <div className="relative pt-2">
            {/* LEFT ICON */}
            <button
              onClick={scrollTopSellerLeft}
              className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:scale-105 hover:border-black hover:text-black md:flex"
            >
              <ChevronLeft className="h-5 w-5 stroke-[1.8]" />
            </button>

            {/* RIGHT ICON */}
            <button
              onClick={scrollTopSellerRight}
              className="absolute right-1 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:scale-105 hover:border-black hover:text-black md:flex"
            >
              <ChevronRight className="h-5 w-5 stroke-[1.8]" />
            </button>

            {/* PRODUCTS SLIDER */}
            <div
              ref={topSellerRef}
              className="scrollbar-hide flex gap-2 md:gap-5 overflow-x-auto scroll-smooth"
            >
              {topSellers.map((product, index) => (
                <div
                  key={`top-${product.id}-${index}`}
                  onClick={() =>
                    product.slug && navigate(`/details/${product.slug}`)
                  }
                  className="min-w-[180px] md:min-w-[250px] lg:min-w-[240px] xl:min-w-[245px] flex-shrink-0 cursor-pointer"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER SLIDER ===== */}
      <section className="md:pt-12 pt-6">
        <div className="px-2">
          <div className="overflow-hidden bg-white">
            <img
              src={promoBanners[currentBanner]?.image}
              alt={promoBanners[currentBanner]?.alt}
              className="h-[180px] w-full object-cover md:h-[250px] lg:h-[340px]"
            />
          </div>
        </div>
      </section>

      {/* ===== BRAND SECTION ===== */}
      <section>
        <div
          className="px-2 py-6 md:py-10
        "
        >
          <div className="flex justify-center gap-4">
            <SectionTitle title="Shop by Brands" />
          </div>

          <div className="relative">
            {/* BRANDS SLIDER */}
            <div
              ref={brandRef}
              className="scrollbar-hide flex pt-3 gap-4 overflow-x-auto scroll-smooth"
            >
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="min-w-[160px] sm:min-w-[180px] md:min-w-[190px] lg:min-w-[170px] xl:min-w-[180px] flex-shrink-0 rounded-2xl bg-white text-center"
                >
                  <div className="mx-auto flex h-20 items-center justify-center overflow-hidden rounded-xl">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="h-20 w-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLINIKALLY ESSENTIALS SECTION ===== */}
      <section className="md:py-3">
        <div className="px-2">
          <div className="overflow-hidden rounded-lg bg-[#f3edf7] p-2 lg:p-5">
            <div className="grid gap-2 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
              {/* LEFT CONTENT */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="hidden md:inline-flex bg-[#00607a] rounded-lg px-4 py-2 text-sm font-semibold text-white">
                    Dermatologist-Formulated
                  </span>

                  <h2
                    onClick={() => {
                      const p = essentialsProducts && essentialsProducts[0];
                      navigate(p?.slug ? `/details/${p.slug}` : "/details");
                    }}
                    role="button"
                    tabIndex={0}
                    className="md:mt-6 mt-1 max-w-[220px] md:text-2xl font-bold leading-tight text-[#0f172a] sm:text-4xl cursor-pointer"
                  >
                    Shop DeramWala Essentials
                  </h2>
                </div>

                {/* <div className="mt-8">
                  <button className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-base font-medium text-[#00607a] transition hover:bg-[#faf7ff]">
                    See All
                    <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div> */}
              </div>

              {/* RIGHT SLIDER AREA */}
              <div className="relative min-w-0">
                <div
                  ref={essentialsRef}
                  className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth"
                >
                  {essentialsProducts.map((item, index) => (
                    <div
                      key={`ess-${item.id}-${index}`}
                      onClick={() =>
                        item.slug && navigate(`/details/${item.slug}`)
                      }
                      role="button"
                      tabIndex={0}
                      className="w-[180px] md:min-w-[200px] flex-shrink-0 rounded-lg bg-white p-2 cursor-pointer"
                    >
                      {/* IMAGE */}
                      <div className="relative mb-3 rounded-lg">
                        {item.doctorChoice && (
                          <div className="absolute left-2 top-2 z-10 rounded-full bg-white px-2 py-[2px] text-[9px] font-bold leading-none text-green-700 shadow">
                            Doctor's
                            <br />
                            Choice
                          </div>
                        )}

                        {item.badge && (
                          <div className="absolute right-1 top-2 z-10 rounded-md bg-[#00607a] px-2 py-1 text-[10px] font-bold text-white">
                            {item.badge}
                          </div>
                        )}

                        <img
                          src={item.image}
                          alt={item.name}
                          className="mx-auto h-[110px] w-full object-contain p-2"
                        />
                      </div>

                      {/* TITLE (IMPORTANT CHANGE) */}
                      <h3 className="text-[14px] font-medium leading-5 text-[#111827] break-words">
                        {item.name}
                      </h3>

                      {/* RATING */}
                      <div className="flex items-center gap-1 text-[13px] text-[#111827]">
                        <span className="text-yellow-400 text-sm">★★★★★</span>
                        <span>{item.rating}</span>
                      </div>

                      {/* PRICE */}
                      <div className=" flex items-center gap-2">
                        <span className="text-[18px] font-semibold text-gray-800">
                          ₹ {item.price}
                        </span>
                        <span className="text-[15px] text-gray-400 line-through">
                          ₹ {item.oldPrice}
                        </span>
                      </div>

                      {/* BUTTON */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="mt-1 w-full rounded-lg border border-[#00607a] px-3 py-2 text-sm font-medium text-[#00607a]"
                      >
                        {addedIds.includes(item.id) ? "Added" : "Add To Cart"}
                      </button>
                    </div>
                  ))}
                </div>

                {/* RIGHT ARROW INSIDE BOX */}
                <button
                  onClick={scrollEssentialsRight}
                  className="absolute right-1 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm transition hover:scale-105 lg:flex cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6 stroke-[2.25]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONCERN SECTION ===== */}
      <section className="mt-5 md:mt-3 md:py-3 px-2">
        <div className="rounded-lg">
          <SectionTitle title="Shop by Concern" />

          <div className="flex flex-nowrap sm:flex-wrap gap-2 pt-2 overflow-x-auto scrollbar-hide">
            {concernTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveConcern(tab)}
                className={`flex-shrink-0 whitespace-nowrap rounded-lg px-4 py-1 text-sm font-medium transition-all duration-300 cursor-pointer ${activeConcern === tab
                    ? " text-[#00607a] border border-[#00607a]"
                    : "border border-gray-300 bg-white text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex sm:grid gap-2 md:gap-3 mt-2 overflow-x-auto scrollbar-hide sm:grid-cols-2 lg:grid-cols-4 py-3 rounded-lg bg-transparent sm:bg-white">
            {(concernProducts[activeConcern] || []).map((product, index) => (
              <div
                key={`concern-${product.id}-${index}`}
                onClick={() =>
                  product.slug && navigate(`/details/${product.slug}`)
                }
                className="min-w-[180px] sm:min-w-0 flex-shrink-0 sm:flex-shrink cursor-pointer"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DUAL PROMO BANNER SLIDER ===== */}
      <section>
        <div className="px-2">
          <div className="dual-banner-frame rounded-lg">
            <div className="relative h-[180px] w-full md:h-[250px] lg:h-[340px]">
              <div className="dual-banner-stage rounded-[24px]">
                {/* CURRENT BANNER */}
                <div className="dual-banner-panel z-10 rounded-lg overflow-hidden">
                  <img
                    src={dualPromoBanners[currentDualBanner]?.image}
                    alt={dualPromoBanners[currentDualBanner]?.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRENDING PRODUCTS ===== */}
      <section>
        <div className="px-2 md:py-8 py-4">
          <div className="md:mb-3">
            <SectionTitle title="Trending Products" />
          </div>

          <div className="relative">
            {/* LEFT ICON */}
            <button
              onClick={scrollTrendingLeft}
              className="absolute left-0 top-[38%] z-20 hidden -translate-y-1/2 items-center justify-center text-black transition hover:scale-110 lg:flex"
            >
              <ChevronLeft className="h-10 w-10 stroke-[1.6]" />
            </button>

            {/* RIGHT ICON */}
            <button
              onClick={scrollTrendingRight}
              className="absolute right-0 top-[38%] z-20 hidden -translate-y-1/2 items-center justify-center text-black transition hover:scale-110 lg:flex"
            >
              <ChevronRight className="h-10 w-10 stroke-[1.6]" />
            </button>

            {/* PRODUCTS SCROLLER */}
            <div
              ref={trendingRef}
              className="scrollbar-hide flex md:gap-2 overflow-x-auto scroll-smooth gap-2"
            >
              {trendingProducts.map((product, index) => (
                <div
                  key={`trend-${product.id}-${index}`}
                  onClick={() =>
                    product.slug && navigate(`/details/${product.slug}`)
                  }
                  className="w-[190px] h-full md:min-w-[240px] md:max-w-[240px] flex-shrink-0 cursor-pointer border border-gray-300 p-2 rounded-lg"
                >
                  <div className="flex h-full w-[170px] md:w-full min-w-0 flex-col">
                    {/* IMAGE */}
                    <div className="flex h-[110px] md:h-[170px] w-full items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* NAME */}
                    <div className="line-clamp-2 min-h-[40px] md:min-h-[50px] w-full min-w-0 overflow-hidden">
                      <h3 className="w-full break-words text-[14px] md:text-[17px] font-semibold leading-[1.45] text-gray-800">
                        {product.name}
                      </h3>
                    </div>

                    {/* RATING */}
                    <div className="flex flex-wrap items-center text-[14px] md:text-[15px]">
                      <span className="tracking-[1px] text-[#f4c20d]">
                        ★★★★☆
                      </span>
                      <span className="text-[#6b7280] text-[14px]">
                        ({product.reviews} Reviews)
                      </span>
                    </div>

                    {/* PRICE */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] md:text-[18px]  font-bold text-black">
                        ₹ {product.price}
                      </span>

                      {product.oldPrice && (
                        <span className="text-[13px] md:text-[16px] text-[#9ca3af] line-through">
                          ₹ {product.oldPrice}
                        </span>
                      )}
                    </div>

                    {/* BUTTON */}
                    <div className="mt-1">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full rounded-lg border-[#8b3dff] py-3 text-[16px] font-medium text-[#8b3dff] hover:bg-[#faf5ff]"
                      >
                        {addedIds.includes(product.id)
                          ? "Added"
                          : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-1 md:py-5 bg-[#f3edf7]">
        <div className="px-2 lg:px-2">
          <div className="grid items-start lg:grid-cols-[0.6fr_1.1fr] py-1">
            {/* LEFT SIDE IMAGE SCROLL */}
            <div className="w-full">
              <div ref={scrollRef} className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth overscroll-x-contain touch-pan-x">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="flex min-w-full mb-3 snap-center items-center justify-center"
                  >
                    <img
                      src={img}
                      alt={`product-${index + 1}`}
                      className="h-[190px] w-auto object-contain md:h-[430px] lg:h-[400px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE ACCORDION */}
            <div className="w-full">
              <h2 className="text-lg font-normal leading-[1.15] tracking-[-0.02em] text-[#111827] md:text-5xl">
                <span className="text-[#00607a]">India’s one-stop</span>{" "}
                dermatology destination.
              </h2>

              <div className="md:mt-2">
                {accordionData.map((item, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={index}
                      className="border-b border-[#d8d8d8] py-3 md:py-5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(index)}
                        className="flex w-full items-start justify-between gap-4 text-left"
                      >
                        <span className="text-md font-normal text-black md:text-xl">
                          {item.title}
                        </span>

                        <span className="mt-1 shrink-0 text-[#111827]">
                          {isOpen ? (
                            <Minus className="h-6 w-6 stroke-[2.5]" />
                          ) : (
                            <Plus className="h-6 w-6 stroke-[2.5]" />
                          )}
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-in-out ${isOpen
                            ? "grid-rows-[1fr] pt-5 opacity-100"
                            : "grid-rows-[0fr] pt-0 opacity-0"
                          }`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-[900px] text-sm leading-[1.7] text-[#8b95a7] md:text-lg">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-sm font-bold uppercase tracking-[0.12em] text-gray-700 md:mt-5 md:text-xs">
                OUR ASSURANCE: ALL OUR PRODUCTS ARE OF TOP GRADE QUALITY
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FROM THE DOCTOR'S DESK ===== */}
      <section className="py-8">
        <div className=" px-2">
          {/* TOP HEADER */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <SectionTitle title="From the Doctor's Desk" />
          </div>

          {/* CONTENT */}
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] cursor-pointer">
            {/* LEFT BIG CARDS */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* CARD 1 */}
              <article
                onClick={() => navigate("/blog")}
                className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white"
              >
                <div className="h-[200px] w-full overflow-hidden">
                  <img
                    src={blogImg1}
                    alt="Coal Tar In Haircare"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[15px] font-semibold text-[#00607a]">
                    January 07, 2026 .
                  </p>

                  <h3 className="mt-3 text-md font-normal text-black">
                    Coal Tar In Haircare: Clearing the Myths with Real Facts
                  </h3>

                  <p className="mt-3 text-[17px] text-[#8b95a7]">
                    Coal tar in beauty products is still a hot topic that raises
                    several doubts and misc...
                  </p>

                  <button className="mt-6 rounded-lg border border-[#00607a] px-6 py-3 text-[16px] font-medium text-[#00607a] transition hover:bg-[#faf5ff]">
                    Read Article
                  </button>
                </div>
              </article>

              {/* CARD 2 */}
              <article
                onClick={() => navigate("/blog")}
                className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white"
              >
                <div className="h-[200px] w-full overflow-hidden">
                  <img
                    src={blogImg2}
                    alt="Thermal Water Benefits"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[15px] font-semibold text-[#00607a]">
                    January 16, 2026 .
                  </p>

                  <h3 className="mt-3 text-md font-normal text-black">
                    9 Proven Benefits of Thermal Water for Healthier Skin
                  </h3>

                  <p className="mt-3 text-[17px] text-[#8b95a7]">
                    You require a breath of fresh air in your daily routine to
                    refresh and unleash the.
                  </p>

                  <button className="mt-6 rounded-lg border border-[#00607a] px-6 py-3 text-[16px] font-medium text-[#00607a] transition hover:bg-[#faf5ff]">
                    Read Article
                  </button>
                </div>
              </article>
            </div>

            {/* RIGHT SIDE LIST */}
            <div className="flex flex-col">
              {/* ITEM 1 */}
              <article className="border-b border-[#e5e7eb] pb-6">
                <h3 className="text-lg font-normal text-black">
                  Understanding Haircare Labels: A Complete Guide to Healthy
                  Hair
                </h3>

                <p className="mt-3 text-[17px] leading-[1.7] text-[#8b95a7]">
                  Reading hair care ingredient labels can be daunting,
                  particularly with the current t...
                </p>
              </article>

              {/* ITEM 2 */}
              <article className="border-b border-[#e5e7eb] py-6">
                <h3 className="text-lg font-normal text-black">
                  Gluten vs Gluten-Free Foods: A Complete Guide to Skin, Hair,
                  and Wellness
                </h3>

                <p className="mt-3 text-[17px] leading-[1.7] text-[#8b95a7]">
                  Gluten is a protein found in some cereals, including wheat,
                  rye, and barley. It help...
                </p>
              </article>

              {/* ITEM 3 */}
              <article className="border-b border-[#e5e7eb] py-6">
                <h3 className="text-lg font-normal text-black">
                  Why India is Shifting to Online Dermatologist Consultations in
                  2026
                </h3>

                <p className="mt-3 text-[17px] leading-[1.7] text-[#8b95a7]">
                  While skincare trends keep evolving, so do the habits of
                  skincare users. 2026 is see...
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
