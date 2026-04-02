import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ImageSlider from "../../components/ImageSlider";
import ReviewSlider from "../../components/ReviewSlider";
import SocialMediaIconSection from "../../components/SocialMediaIconSection";
import { useGetBannersQuery } from "../../redux/image/imageAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useInitFCM from "../../hooks/useInitFCM"; // ← ADDED


const Home: React.FC = () => {
  const { data, isLoading, isError } = useGetBannersQuery();
  const navigate = useNavigate();

  
  const userId = useSelector((state: any) => state.user.user?._id);
  useInitFCM(userId);

 
  const offerBanners =
    data?.banners?.filter((b: any) => b.type === "offer") || [];

  return (
    <div className="bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-5 py-10 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900">
              Connect, Discover, and
              <span className="font-bold bg-gradient-to-r from-Pink to-purple-600 bg-clip-text text-transparent">
                {" "}Build a Future
              </span>{" "}
              Together
            </h1>

            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              Create your proposal, explore profiles, and connect with genuine
              people looking for lifelong relationships.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                className="px-6 py-3 bg-gradient-to-r from-Pink to-Purple text-white rounded-xl shadow"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </button>

              <div className="p-[2px] rounded-xl bg-gradient-to-r from-Pink to-purple-600 inline-block">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-Pink to-Purple text-white rounded-xl shadow"
                  onClick={() => navigate("/feed")}
                >
                  Explore Feed
                </button>
              </div>
            </div>
          </div>

          {/* keep your existing slider */}
          <ImageSlider />

        </div>
      </section>

      {/* ================= REVIEW ================= */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-5 text-center">

          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-Pink to-purple-600 bg-clip-text text-transparent">
            Success Stories from Our Community
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Stories from couples who started their journey here.
          </p>

          {/* keep your existing review slider */}
          <ReviewSlider />

        </div>
      </section>

      {/* ================= OFFER ================= */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-5 text-center">

          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-Pink to-purple-600 bg-clip-text text-transparent">
            Limited Time Offer
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mb-5">
            Post Your Wedding Proposal for 50% OFF
          </p>

          {/* loading / error */}
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error loading banners</p>}

          {/* ✅ OFFER SWIPER */}
          {!isLoading && !isError && offerBanners.length > 0 && (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              loop={true}
              className="rounded-2xl"
            >
              {offerBanners.map((banner: any) => (
                <SwiperSlide key={banner._id}>
                  <img
                    src={banner.bannerImageUrl}
                    alt={banner.bannerTitle}
                    className="w-full h-[200px] sm:h-[260px] md:h-[320px] object-cover rounded-2xl shadow-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

        </div>
      </section>

      {/* ================= SOCIAL ================= */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <SocialMediaIconSection />
        </div>
      </section>

    </div>
  );
};

export default Home;
