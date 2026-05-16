import { useRef, useEffect } from "react";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { fetchApi } from "../api/client.js";

function Collection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const searchTerm = searchParams.get("search") || "";

  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState([]);

  const markAdded = (id) =>
    setAddedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [features, setFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    setPageError(null);
    const query = new URLSearchParams();
    if (categoryId) query.append("category", categoryId);
    if (searchTerm.trim()) query.append("search", searchTerm.trim());

    const url = query.toString()
      ? `/api/home/collection?${query.toString()}`
      : "/api/home/collection";

    fetchApi(url)
      .then((data) => {
        setCollectionProducts(data.collectionProducts || []);
        setFeatures(data.features || []);
      })
      .catch((err) => {
        console.error("[Collection] API failed:", err);
        setPageError(err.message || "Backend se data nahi mila.");
      });
  }, [categoryId, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, searchTerm]);

  const heroBanners = [
    { id: 1, image: "/src/assets/images/home/banner2.png" },
    { id: 2, image: "/src/assets/images/home/banner3.png" },
    { id: 3, image: "/src/assets/images/home/banner1.png" },
  ];
  const [currentHero, setCurrentHero] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) =>
        prev === heroBanners.length - 1 ? 0 : prev + 1,
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      size: product.size,
      rating: product.rating,
    });
    markAdded(product.id);
  };

  const itemsPerPage = 16;
  const totalItems = collectionProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return collectionProducts.slice(startIndex, endIndex);
  }, [currentPage, collectionProducts]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Featured");
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (e, id) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const dropdownRef = useRef();

  // click outside close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white">
      {pageError && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
          <strong>API error:</strong> {pageError}
        </div>
      )}
      {/* ===== HERO SECTION ===== */}
      <section>
        <div className="overflow-hidden">
          <img
            src={heroBanners[currentHero].image}
            alt="Hero Banner"
            className="h-[160px] w-full md:h-[250px] lg:h-[340px] object-cover"
          />
        </div>
      </section>

      <section className="py-5 md:py-2">
        <div className="mx-auto max-w-7xl px-4">
          {/* TOP BAR */}
          <div className="mb-3 flex flex-col gap-4 md:mb-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-[#8b95a7] md:text-base">
              Showing {totalItems} items
            </p>
            {searchTerm.trim() && (
              <p className="text-sm text-[#4b5563]">
                Search results for:{" "}
                <span className="font-semibold text-[#111827]">
                  {searchTerm}
                </span>
              </p>
            )}
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <article
                key={product.id}
                onClick={() =>
                  navigate(
                    product.slug ? `/details/${product.slug}` : "/details",
                  )
                }
                className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white cursor-pointer"
              >
                {/* IMAGE AREA */}
                <div className="relative bg-white pt-4 md:pt-5">
                  {product.doctorChoice && (
                    <div className="absolute left-2 top-2 z-10 rounded-full bg-white px-2 py-1 text-[9px] font-bold uppercase leading-none text-green-700 shadow-sm md:left-3 md:top-3 md:text-[10px]">
                      Doctor&apos;s
                      <br />
                      Choice
                    </div>
                  )}

                  {product.badge && (
                    <div className="absolute right-1 top-2 z-10 rounded-md bg-[#00607a] px-2 py-1 text-[10px] font-bold text-white md:right-3 md:top-3 md:px-3 md:py-2 md:text-xs">
                      {product.badge}
                    </div>
                  )}

                  <div className="flex h-[150px] items-center justify-center md:h-[130px]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="px-3 pb-2 pt-1 md:px-4 md:pb-2">
                  {/* <p className="text-xs font-semibold text-[#8b95a7] md:text-[15px]">
                    {product.category}
                  </p> */}
                  <h3 className="text-sm font-normal text-black md:text-lg line-clamp-2 min-h-[40px] md:min-h-[55px]">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[14px] md:text-[15px] font-bold">
                    <span className="tracking-[1px] text-[#f4c20d]">★★★★☆</span>
                    <span className="text-[#374151]">{product.rating}</span>
                  </div>

                  <div>
                    <p
                      onClick={(e) => toggleExpand(e, product.id)}
                      className="text-sm text-[#8b95a7] cursor-pointer md:text-md"
                      style={
                        !expandedIds[product.id]
                          ? {
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }
                          : {}
                      }
                    >
                      {product.description}
                    </p>
                  </div>

                  <div className=" flex items-center gap-2">
                    <span className="text-[18px] font-bold text-gray-800 md:text-[20px]">
                      ₹ {product.price}
                    </span>

                    <span className="text-[13px] text-[#9ca3af] line-through md:text-[16px]">
                      ₹ {product.oldPrice}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-1 flex gap-2">
                    {product.isSoldOut ? (
                      <button className="w-full rounded-lg border border-[#cfcfcf] bg-[#f5f5f5] px-4 py-2 text-[15px] font-semibold text-[#9ca3af] md:text-[16px]">
                        Sold Out
                      </button>
                    ) : product.showBuyNow ? (
                      <>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex-1 cursor-pointer rounded-lg border border-[#00607a] bg-white px-3 py-2 text-[15px] font-semibold text-[#00607a] transition md:text-[16px]"
                        >
                          {addedIds.includes(product.id)
                            ? "Added"
                            : "Add To Cart"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full cursor-pointer rounded-lg border border-[#00607a] bg-white px-4 py-2 text-[15px] font-semibold text-[#00607a] transition md:text-[16px]"
                      >
                        {addedIds.includes(product.id)
                          ? "Added"
                          : "Add To Cart"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3 md:mt-10 md:gap-4">
              {/* LEFT ARROW */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition md:h-14 md:w-10 cursor-pointer ${
                  currentPage === 1
                    ? "cursor-not-allowed text-gray-500"
                    : " hover:scale-105"
                }`}
              >
                <ChevronLeft className="h-6 w-6  stroke-[2.2] cursor-pointer" />
              </button>

              {/* PAGE 1 */}
              {totalPages >= 1 && (
                <button
                  onClick={() => handlePageClick(1)}
                  className={`text-lg font-medium transition cursor-pointer ${
                    currentPage === 1
                      ? "flex h-8 w-8 items-center justify-center rounded-xl bg-[#00607a] text-white md:h-10 md:w-10 cursor-pointer"
                      : "text-[#111827]"
                  }`}
                >
                  1
                </button>
              )}

              {/* PAGE 2 */}
              {totalPages >= 2 && (
                <button
                  onClick={() => handlePageClick(2)}
                  className={`text-lg font-medium transition cursor-pointer${
                    currentPage === 2
                      ? "flex h-8 w-8 items-center justify-center rounded-xl bg-[#00607a] text-white md:h-10 md:w-10 cursor-pointer"
                      : "text-[#111827]"
                  }`}
                >
                  2
                </button>
              )}

              {/* PAGE 3 */}
              {totalPages >= 3 && (
                <button
                  onClick={() => handlePageClick(3)}
                  className={`text-lg font-medium transition cursor-pointer ${
                    currentPage === 3
                      ? "flex h-12 w-12 items-center justify-center rounded-full bg-[#00607a] text-white md:h-14 md:w-14 cursor-pointer"
                      : "text-[#111827]"
                  }`}
                >
                  3
                </button>
              )}

              {/* PAGE 4 */}
              {totalPages >= 4 && (
                <button
                  onClick={() => handlePageClick(4)}
                  className={`text-lg font-medium transition cursor-pointer ${
                    currentPage === 4
                      ? "flex h-12 w-12 items-center justify-center rounded-full bg-[#00607a] text-white md:h-14 md:w-14 cursor-pointer"
                      : "text-[#111827]"
                  }`}
                >
                  4
                </button>
              )}

              {/* DOTS */}
              {totalPages > 5 && (
                <span className="px-1 text-lg font-medium text-[#111827]">
                  ...
                </span>
              )}

              {/* LAST PAGE */}
              {totalPages > 4 && (
                <button
                  onClick={() => handlePageClick(totalPages)}
                  className={`text-lg font-medium transition cursor-pointer ${
                    currentPage === totalPages
                      ? "flex h-12 w-12 items-center justify-center rounded-full bg-[#00607a] text-white md:h-14 md:w-14 cursor-pointer"
                      : "text-[#111827]"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              {/* RIGHT ARROW */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition md:h-14 md:w-10 cursor-pointer ${
                  currentPage === totalPages
                    ? "cursor-not-allowed text-gray-600"
                    : "hover:scale-105"
                }`}
              >
                <ChevronRight className="h-6 w-6 stroke-[2.2] cursor-pointer" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="w-full py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((item, index) => (
              <div
                key={item.id}
                className={`
                flex items-center gap-3 md:gap-4 px-2 md:px-3 py-3 md:py-2 border border-gray-300 rounded-lg
                ${index !== features.length - 1}
              `}
              >
                <div className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-10 w-10 sm:w-16 md:h-16 md:w-20 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base md:text-[18px] font-semibold text-[#222] leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm md:text-[15px] text-[#8d93a6] leading-tight">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Collection;
