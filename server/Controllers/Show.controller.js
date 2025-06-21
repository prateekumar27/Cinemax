import axios from "axios";
import dotenv from "dotenv";
import Movie from "../Models/Movie.model.js";
import Show from "../Models/Show.model.js";

dotenv.config();

//get now playing movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } }
    );

    const movies = data.results;
    res.json({ success: true, movies: movies });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findByOne({ id: movieId });

    if (!movie) {
      const [movieDetailsResponse, movieCreaditsResponse] = await Promise.all([
        //details
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),

        //creadits
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreaditsData = movieCreaditsResponse.data;

      const movieDetails = {
        id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genre_ids: movieApiData.genre_ids,
        release_date: movieApiData.release_date,
        vote_average: movieApiData.vote_average,
        vote_count: movieApiData.vote_count,
        runtime: movieApiData.runtime,
        casts: movieCreaditsData.cast,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
      };

      movie = await Movie.create(movieDetails);
    }

    const showToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showToCreate.push({
          movie: movie._id,
          showDatetime: new Date(dateTimeString),
          showPrice: showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showToCreate.length > 0) {
      await Show.insertMany(showToCreate);
    }
    res.json({ success: true, message: "Show added successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const uniqueShows = new Set(shows.map((show) => show.movie));
    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const show = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await movie.findById(movieId);
    const dateTime = {};

    show.forEach((show) => {
      const date = show.showDateTime.toDateString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};
