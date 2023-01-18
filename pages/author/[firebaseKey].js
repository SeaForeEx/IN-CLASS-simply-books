/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BookCard from '../../components/BookCard';
// import Image from 'next/image';
import { viewAuthorDetails } from '../../api/mergedData';

export default function ViewAuthor() {
  const router = useRouter();
  const [authorDetails, setAuthorDetails] = useState({});
  const { firebaseKey } = router.query;

  const sexyAuthorDetails = () => {
    viewAuthorDetails(firebaseKey).then(setAuthorDetails);
  };

  useEffect(() => {
    viewAuthorDetails(firebaseKey).then(setAuthorDetails);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseKey]);

  return (
    <>
      <div className="mt-5 d-flex flex-wrap">
        <div className="d-flex flex-column">
          <img src={authorDetails.image} alt={authorDetails.first_name} style={{ width: '300px' }} />
        </div>
        <div className="text-white ms-5 details">
          <h5>
            {authorDetails.first_name} {authorDetails.last_name}
            {authorDetails.favorite ? ' 🤍' : ''}
          </h5>
          Author Email: <a href={`mailto:${authorDetails.email}`}>{authorDetails.email}</a>
        </div>
      </div>
      <hr />
      <div className="d-flex flex-wrap">
        {authorDetails.books?.map((book) => (
          <BookCard key={book.firebaseKey} bookObj={book} onUpdate={sexyAuthorDetails} />
        ))}
      </div>
    </>
  );
}
