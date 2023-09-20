import Axios from "axios";
import { ListMovies } from "containers/List/ListMovies";
import React, { useEffect, useState } from "react";

const List = () => {
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    fetchMovieList();
  }, []);

  useEffect(() => {
    fetchMovieFromYT();
  }, [movieList]);

  const fetchMovieList = async () => {
    Axios({
      method: "post",
      url: "https://netflixapi.azurewebsites.net/api/MovieList",
      data: {
        userId: `${localStorage.getItem("userId")}`,
      },
    }).then((res) => {
      console.log(res.data.moviesId);
      setMovieList(res.data.moviesId);
    });
  };

  const API = "AIzaSyC0F0SICC08z0od6qa28xVhU3sOuT8VkCs";
  // fetch youtube video from name
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=after&key=${API}`;

  const [video, setVideo] = useState([
    
  ]);

  const fetchMovieFromYT = async () => {
     movieList.map(async (item) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${item}&key=${API}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.items[0].id.videoId);
        setVideo((prev) => [...prev, data.items[0].id.videoId]);
     }
        )
  };

  return (
    <div
      style={{
        display: "flex",
        margin: "0 auto",

        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
            marginTop: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {video.map((item) => (
          <iframe
            key={item}
            width="400"
            height="315"
            src={`https://www.youtube.com/embed/${item}`}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        ))}
      </div>
    </div>
  );
};

export default List;
