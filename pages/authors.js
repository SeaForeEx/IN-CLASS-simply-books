import React, { useEffect, useState } from 'react';
import { getAuthors } from '../api/authorData';
import AuthorCard from '../components/AuthorCard';
import { useAuth } from '../utils/context/authContext';

export default function ShowAuthors() {
  const { user } = useAuth();
  const [authors, setAuthors] = useState([]);

  const getAllAuthors = () => {
    getAuthors(user.uid).then(setAuthors);
  };

  // useEffect(() => {
  //   getAllAuthors(user.uid).then(setAuthors);
  // }, []);
  // getAuthors(user.uid);

  useEffect(() => {
    getAllAuthors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ( // className d-flex flex-wrap puts cards in rows/columns instead of just one column down
    <div className="d-flex flex-wrap">
      {authors.map((author) => (
        <AuthorCard key={author.firebaseKey} authorObj={author} onUpdate={getAllAuthors} />
      ))}
    </div>
  );
}
