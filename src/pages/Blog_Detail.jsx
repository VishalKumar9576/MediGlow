import React, { useState, useEffect } from "react";
import blogImg1 from '/src/assets/images/blogs/next1.avif'
import blogImg2 from '/src/assets/images/blogs/next2.avif'
import SectionTitle from '../components/SectionTitle'
import { useSearchParams } from "react-router-dom";
import { fetchApi } from "../api/client.js";



// export const features = [
//   {
//     id: 1,
//     title: "COD Available",
//     subtitle: "Pan-India",
//     image: "/src/assets/images/collections/cod.png",
//   },
//   {
//     id: 2,
//     title: "Free Delivery",
//     subtitle: "Above ₹599",
//     image: "/src/assets/images/collections/free.png",
//   },
//   {
//     id: 3,
//     title: "100% Real",
//     subtitle: "Products",
//     image: "/src/assets/images/collections/certified.png",
//   },
//   {
//     id: 4,
//     title: "Dermatologist",
//     subtitle: "Written",
//     image: "/src/assets/images/collections/dermatologist.png",
//   },
// ];






function BlogHero() {

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [pageError, setPageError] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);

  const [features, setFeatures] = useState([]);
  const categoryId = searchParams.get("category");
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


  return (
    <div className='bg-white'>
      <section className="w-full">
        <div className="relative w-full min-h-[200px] md:min-h-[420px] flex items-center justify-center">

          {/* BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 bg-contain bg-center"
            style={{
              backgroundImage: "url('/src/assets/images/blogs/Coal_tar_banner.webp')",
            }}
          ></div>

          {/* OVERLAY (opacity control) */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* CENTER CONTENT */}
          <div className="relative z-10 px-6 text-center max-w-3xl">
            <h1 className="text-xl md:text-3xl xl:text-4xl font-semibold text-white leading-snug">
              Coal Tar In Haircare: Clearing the Myths with Real Facts
            </h1>
          </div>

        </div>
      </section>


      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

          {/* FULL WIDTH CONTENT */}
          <div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 md:text-xl text-sm text-[#207a6e] font-normal">
              <span>Coal Tar and Scalp</span>
              <span>|</span>
              <span>Busting Myths</span>
              <span>|</span>
              <span>Comparing Coal Tar Shampoos & Others</span>
              <span>|</span>
              <span>Uses of Coal Tar for Scalp Health</span>
              <span>|</span>
              <span>Side Effects & Safety Considerations of Coal Tar</span>
              <span>|</span>
              <span>FAQs</span>
            </div>

            {/* PARAGRAPH */}
            <p className="text-gray-700 leading-loose text-base md:text-xl">
              Coal tar in beauty products is still a hot topic that raises
              several doubts and misconceptions about the safety and efficiency
              of using this ingredient for scalp and hair care. Being widely
              available in coal tar shampoo formulations on the market, the role
              of this ingredient is most recognized for treating several scalp
              issues such as dandruff, scalp psoriasis, seborrheic dermatitis,
              and itch scalps. However, besides the various known advantages
              that these ingredients have already proven for scalp and skin
              ailments, there are also several misconceptions that surround the
              topic of using these ingredients for your scalp and hair care
              needs.
            </p>

          </div>

        </div>
      </section>


      <section className="w-full py-5 md:py-7">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
          {/* BLOCK 1 */}
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-md font-normal text-[#1e1f26] md:text-3xl">
              Understanding Coal Tar in Haircare
            </h2>

            <p className="mt-5 text-[16px] text-black md:text-xl md:leading-loose">
              Coal tar has been a trusted component in hair products,
              particularly in the treatment and management of scaling
              conditions on the scalp, including dandruff, psoriasis, and{" "}
              <span className="font-semibold text-[#207a6e]">
                seborrheic dermatitis
              </span>
              . Coal tar, obtained from the processing of coal, has been found
              effective in slowing down the rapid cellular growth and scaling on
              the scalp, alleviating irritation, pruritus, and inflammatory
              conditions. Even today, its commercial demand has not reduced as it
              is used in hair products as a therapeutic component in{" "}
              <span className="font-semibold text-[#207a6e]">
                managing scalp psoriasis
              </span>{" "}
              and dandruff. Refined and improved coal tar products are more
              convenient and can be applied on the scalp on a routine basis for
              maintaining a healthy scalp and regulating oil secretions. Coal tar
              hair products, in combination and as directed, have been found
              effective in enhancing the growth and conditioning of hair.
            </p>
          </div>

          {/* BLOCK 2 */}
          <div className="mx-auto mt-12 max-w-3xl md:mt-16 xl:mt-20">
            <h2 className="text-center text-md font-normal leading-tight text-[#1e1f26] md:text-4xl">
              What Coal Tar Is and How It Works on the Scalp
            </h2>

            <div className="mt-8 flex justify-center md:mt-7">
              <div className="w-full max-w-[500px] overflow-hidden">
                <img
                  src="/src/assets/images/blogs\und.webp"
                  alt="Coal Tar and Scalp Care"
                  className="mx-auto w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* BLOCK 3 */}
          <div className="mx-auto mt-10 max-w-3xl md:mt-10">
            <p className="text-ms leading-8 text-[#20222c] md:text-xl md:leading-loose">
              Coal tar is one of the long-established ingredients suggested for
              use by dermatologists, now found in most medicated shampoos for
              scalp, specifically for{" "}
              <span className="font-semibold text-[#207a6e]">
                treating dandruff
              </span>
              , scalp psoriasis, and seborrheic dermatitis. Although new
              ingredients are now very popular in the world of hair care, coal
              tar remains one of the most-inquired, long-established ingredients
              for treating scalp conditions.
            </p>

            <ul className="mt-5 text-[16px] leading-8 text-[#20222c] md:mt-8 md:text-[19px] md:leading-10 xl:text-[21px] xl:leading-[50px]">
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>A dark, thick product obtained in coal processing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>
                  Long used in medical shampoos and scalp preparations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>
                  Known as an antidotes/dermato-vegetable preparation, with
                  properties
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>
                  Formulations available over-the-counter and by prescription
                  only
                </span>
              </li>
            </ul>

            <h3 className="mt-10 text-[22px] font-normal leading-tight text-[#1e1f26] md:mt-12 md:text-[30px] xl:text-[36px]">
              The Role of Coal Tar in the Scalp Care is:
            </h3>

            <ul className="mt-8  text-md leading-8 text-[#20222c] md:mt-5 md:text-xl md:leading-[50px]">
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>
                  Controls excessive growth of skin cells, a major contributor to
                  flakes in psoriasis
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>Helps to reduce the scaling associated with dandruff</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>
                  Relieves itching and scales associated with dandruff and{" "}
                  <span className="font-semibold text-[#207a6e]">eczema</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>
                  Softens thick plaques and makes them easier to remove with soap
                </span>
              </li>
            </ul>
          </div>

          {/* BLOCK 4 */}
          <div className="mx-auto mt-10 max-w-3xl border-t border-[#dddddd] pt-8 md:mt-10 md:pt-8">
            <h3 className="text-md font-normal leading-tight text-[#1e1f26] md:text-3xl">
              The reason of popularity of coal tar in scalp care is:
            </h3>

            <ul className="mt-8  text-md leading-8 text-[#20222c] md:mt-8 md:text-xl md:leading-[50px]">
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>Proven clinically for scalp psoriasis treatment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>Assists in managing chronic dandruff effectively</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-3 h-2 w-2 rounded-full md:mt-5 shrink-0 bg-[#20222c]" />
                <span>
                  Recommended by dermatologists for maintenance of the scalp
                </span>
              </li>
            </ul>

            <p className="mt-8 text-[16px] leading-8 text-[#20222c] md:mt-10 md:text-[19px] md:leading-loose">
              In conclusion, coal tar offers a proven and very effective remedy
              for scalp conditions. Even if this remedy may not offer anything
              particularly novel or exciting within the realm of haircare, its
              effectiveness in treating scalps with itchiness, flakes, and
              inflammation makes coal tar shampoo a continually sought-after
              remedy by those with stubborn dandruff and psoriasis of the scalp.
            </p>
          </div>
        </div>
      </section>


      {/* ===== FROM THE DOCTOR'S DESK ===== */}
      <section className="py-10">
        <div className=" px-8">
          {/* TOP HEADER */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <SectionTitle title="What To Read Next" />

          </div>

          {/* CONTENT */}
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] cursor-pointer">
            {/* LEFT BIG CARDS */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* CARD 1 */}
              <article
                className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                <div className="h-[200px] w-full overflow-hidden">
                  <img
                    src={blogImg1}
                    alt="Coal Tar In Haircare"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[15px] font-semibold text-[#207a6e]">
                    January 07, 2026 .
                  </p>

                  <h3 className="mt-3 text-md font-normal text-black">
                    Coal Tar In Haircare: Clearing the Myths with Real Facts
                  </h3>

                  <p className="mt-3 text-[17px] text-[#8b95a7]">
                    Coal tar in beauty products is still a hot topic that raises
                    several doubts.
                  </p>

                  <button className="mt-6 rounded-lg border border-[#207a6e] px-6 py-3 text-[16px] font-medium text-[#207a6e] transition hover:bg-[#faf5ff]">
                    Read Article
                  </button>
                </div>
              </article>

              {/* CARD 2 */}
              <article
                className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
                <div className="h-[200px] w-full overflow-hidden">
                  <img
                    src={blogImg2}
                    alt="Thermal Water Benefits"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[15px] font-semibold text-[#207a6e]">
                    January 16, 2026 .
                  </p>

                  <h3 className="mt-3 text-md font-normal text-black">
                    9 Proven Benefits of Thermal Water for Healthier Skin
                  </h3>

                  <p className="mt-3 text-[17px] text-[#8b95a7]">
                    You require a breath of fresh air in your daily routine to refresh
                    and unleash the.
                  </p>

                  <button className="mt-6 rounded-lg border border-[#207a6e] px-6 py-3 text-[16px] font-medium text-[#207a6e] transition hover:bg-[#faf5ff]">
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
                  Understanding Haircare Labels: A Complete Guide to Healthy Hair
                </h3>

                <p className="mt-3 text-[17px] leading-[1.7] text-[#8b95a7]">
                  Reading hair care ingredient labels can be daunting, particularly
                  with the current t...
                </p>
              </article>

              {/* ITEM 2 */}
              <article className="border-b border-[#e5e7eb] py-6">
                <h3 className="text-lg font-normal text-black">
                  Gluten vs Gluten-Free Foods: A Complete Guide to Skin, Hair, and
                  Wellness
                </h3>

                <p className="mt-3 text-[17px] leading-[1.7] text-[#8b95a7]">
                  Gluten is a protein found in some cereals, including wheat, rye, and
                  barley. It help...
                </p>
              </article>

              {/* ITEM 3 */}
              <article className="border-b border-[#e5e7eb] py-6">
                <h3 className="text-lg font-normal text-black">
                  Why India is Shifting to Online Dermatologist Consultations in 2026
                </h3>

                <p className="mt-3 text-[17px] leading-[1.7] text-[#8b95a7]">
                  While skincare trends keep evolving, so do the habits of skincare
                  users. 2026 is see...
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>


      <section className="w-full py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((item, index) => (
              <div
                key={item.id}
                className={`
                      flex items-center gap-3 md:gap-4 px-3 md:px-3 py-4 md:py-2 border border-gray-300 rounded-lg
                      ${index !== features.length - 1}
                    `}
              >
                <div className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-14 w-14 sm:w-16 md:h-16 md:w-20 object-contain"
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

export default BlogHero;