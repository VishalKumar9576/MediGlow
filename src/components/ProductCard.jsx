import Button from "./Button";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const handleAddToCart = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.gallery?.[0] || product.image,
      rating: product.rating,
    });
    setAdded(true);
  };

  return (
    <div className="group flex h-full w-[180px] md:w-full flex-col border border-gray-300 rounded-lg px-3 py-2 md:py-2">
      {/* IMAGE */}
      <div className="flex h-28 w-full items-center justify-center overflow-hidden">
        {product.image && product.image.trim() !== "" ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-28 md:h-30 w-full object-contain"
          />
        ) : null}
      </div>

      {/* TITLE */}
      <div className="w-full min-w-0">
        <div className="min-h-[28px] w-full overflow-hidden">
          <h3 className="break-words text-sm  font-medium leading-6 text-black md:text-md line-clamp-2 min-h-[48px] md:min-h-[30px]">
            {product.name}
          </h3>
        </div>
      </div>

      {/* RATING */}
      <p className="text-sm text-slate-500">
        ⭐⭐⭐⭐ {product.rating} ({product.reviews})
      </p>

      {/* PRICE */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[15px] md:text-xl font-bold text-black">
          ₹ {product.price}
        </span>

        {product.oldPrice && (
          <span className="text-[14px] md:text-lg text-slate-400 line-through">
            ₹ {product.oldPrice}
          </span>
        )}
      </div>

      {/* BUTTON */}
      <div className="mt-1">
        <Button
          onClick={handleAddToCart}
          variant="outline"
          className="w-[150px] md:w-full rounded-lg"
        >
          {added ? "Added" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
