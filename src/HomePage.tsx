import React from "react";
import { Link } from "@reach/router";

import { Store } from "./Store";

import { IAction, IEpisode, IEpisodeProps } from "./interfaces";

export default function HomePage() {
  const EpisodesList = React.lazy(() => import("./EpisodesList"));

  const { state, dispatch } = React.useContext(Store);

  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });

  const fetchDataAction = async () => {
    const URL =
      "https://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes";
    const data = await fetch(URL);
    const dataJSON = await data.json();
    return dispatch({
      type: "FETCH_DATA",
      payload: dataJSON._embedded.episodes
    });
  };

  const toggleFavAction = (episode: IEpisode): IAction => {
    const episodeInFav = state.favourites.includes(episode);
    let dispatchObj = {
      type: "ADD_FAV",
      payload: episode
    };
    if (episodeInFav) {
      const favWithoutEpisode = state.favourites.filter(
        (fav: IEpisode) => fav.id !== episode.id
      );

      dispatchObj = {
        type: "REMOVE_FAV",
        payload: favWithoutEpisode
      };
    }
    return dispatch(dispatchObj);
  };
  const props: IEpisodeProps = {
    episodes: state.episodes,
    toggleFavAction,
    favourites: state.favourites
  };
  return (
    <>
      <React.Suspense fallback={<div>loading...</div>}>
        <section className="episode-layout">
          <EpisodesList {...props} />
        </section>
      </React.Suspense>
    </>
  );
}
