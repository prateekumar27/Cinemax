import React, { useEffect, useState } from "react";
import { Heart, PlayCircle, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import BlurCircle from "../Components/BlurCircle";
import { timeFormat } from "../Lib/TimeFormat";
import DateSelect from "../Components/DateSelect";
import MovieCard from "../Components/MovieCard";
import Loading from "../Components/Loading";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);

  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoritesMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to add to favorites");
      const { data } = await axios.post(
        "/api/user/favorites",
        { movieId: id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        await fetchFavoritesMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Poster */}
        <img
          src={image_base_url + show.movie.poster_path}
          alt={show.movie.title}
          className="max-md:mx-auto rounded-xl h-96 w-64 object-cover"
        />

        {/* Info */}
        <div className="relative flex flex-col gap-3 text-white">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary uppercase text-sm">English</p>
          <h1 className="text-4xl font-semibold max-w-xl">
            {show.movie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Star className="w-5 h-5 text-primary fill-primary" />
            {show.movie.vote_average.toFixed(1)} User Ratings
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>

          <p className="mt-4 text-sm text-gray-400">
            {timeFormat(show.movie.runtime)} •{" "}
            {show.movie.genres.map((g) => g.name).join(", ")} •{" "}
            {show.movie.release_date.split("-")[0]}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition">
              <PlayCircle className="w-5 h-5" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="px-6 py-2 bg-primary hover:bg-primary-dull rounded-md text-sm transition"
            >
              Buy Tickets
            </a>

            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition hover:bg-gray-600"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteMovies.find((movie) => movie._id)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="mt-20">
        <p className="text-lg font-semibold text-white mb-4">Cast</p>
        <div className="overflow-x-auto no-scrollbar pb-4">
          <div className="flex items-center gap-6 w-max px-4">
            {show.movie.casts.slice(0, 12).map((cast, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center text-white"
              >
                <img
                  src={image_base_url + cast.profile_path}
                  alt={cast.name}
                  className="rounded-full h-20 w-20 object-cover"
                />
                <p className="text-xs font-medium mt-2">{cast.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DateSelect dateTime={show.dateTime} id={id} />

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>

      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;
