import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { makeMultipleApiCalls } from '../api/api';

const DetailPage = (props) => {
  const {
    history: {
      location: { state },
    },
  } = props;

  const [residentsList, setResidentsList] = useState([]);
  const [filmsList, setFilmsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { residents, films } = state;

  useEffect(() => {
    setLoading(true);
    makeMultipleApiCalls(residents, setResidentsList);
    makeMultipleApiCalls(films, setFilmsList);
    setLoading(false);
  }, [residents, films, setResidentsList, setFilmsList]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  // remove _ and spaces from string
  const humanize = (str) => {
    let i;
    const frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  };

  const renderList = (key) => {
    if (key === 'residents') {
      return residentsList.length > 0 ? (
        residentsList.map((resident) => (
          <p key={resident.data.name}>{resident.data.name}</p>
        ))
      ) : (
        <p>None</p>
      );
    }
    return filmsList.length > 0 ? (
      filmsList.map((film) => <p key={film.data.title}>{film.data.title}</p>)
    ) : (
      <p>None</p>
    );
  };

  const renderer = (key, value) => {
    if (Array.isArray(value)) {
      return <div className="list">{renderList(key)}</div>;
    }
    return <p>{value}</p>;
  };

  const planet = Object.entries(state)
    .splice(0, 11)
    .map(([key, value]) => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={key}
        className="details_list_block"
      >
        <h1>{[humanize(key)]}</h1>
        {renderer(key, value)}
      </motion.div>
    ));

  return <div className="detailsPageContainer">{planet}</div>;
};
export default DetailPage;
