import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getAuthors } from '../../api/authorData';
import { createBook, updateBook } from '../../api/bookData';

const initialState = { // default state for before you create
  description: '',
  image: '', // if any of these keys are null or undefined
  price: '', // initialState will be captured as default value
  sale: false, // otherwise it will be skipped
  title: '',
  author_id: '',
  firebaseKey: '',
};

function BookForm({ obj }) { // need object as our prop
  const [formInput, setFormInput] = useState(initialState); // everything on the form
  const [authors, setAuthors] = useState([]); // dependency array
  const router = useRouter();
  const { user } = useAuth(); // if user changes the info changes

  useEffect(() => {
    getAuthors(user.uid).then(setAuthors);

    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => { // setAnything(), previous state always in the ()s
    const { name, value } = e.target; // key value pairs (name: value) being deconstructed
    setFormInput((prevState) => ({ // any time we call setAnything, it has access to previous state
      ...prevState, // spread operator spreads prevstate object so name/value key/value pair can be patched
      [name]: value, // value is overwritten
    }));
  }; // any time there's a change, you spread out previous state and patch name and value of event
  // prevState is a taco, descriptive naming of previous state
  // handleChange overrides previous state with updated info

  const handleSubmit = (e) => { // handle API calls and push info to database
    e.preventDefault();
    if (obj.firebaseKey) { // if there is a firebaseKey it's update, if not, it's create
      updateBook(formInput)
        .then(() => router.push(`/book/${obj.firebaseKey}`)); // redirects user to the page of the updated book, push means different things based on what it attached to
    } else {
      const payload = { ...formInput, uid: user.uid }; // sets up new book as payload for specific user
      createBook(payload).then(() => {
        router.push('/'); // redirects user to root
      }); // next.js uses router to go to any page we need it to go to
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj.firebaseKey ? 'Update' : 'Create'} Book</h2>
      {/* If firebaseKey has a value then it's an update form, if not then it's a create form */}
      {/* TITLE INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Book Title" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter a title"
          name="title"
          value={formInput.title}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* IMAGE INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Book Image" className="mb-3">
        <Form.Control
          type="url"
          placeholder="Enter an image url"
          name="image"
          value={formInput.image}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* PRICE INPUT  */}
      <FloatingLabel controlId="floatingInput3" label="Book Price" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter price"
          name="price"
          value={formInput.price}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* AUTHOR SELECT  */}
      <FloatingLabel controlId="floatingSelect" label="Author">
        <Form.Select
          aria-label="Author"
          name="author_id"
          onChange={handleChange}
          className="mb-3"
          value={formInput.author_id}
          required
        >
          <option value="">Select an Author</option>
          {
            authors.map((author) => ( // add ternary before line 107 to not show select author option if there are no authors if you want to
              <option
                key={author.firebaseKey}
                value={author.firebaseKey}
              >
                {author.first_name} {author.last_name}
              </option>
            ))
          }
        </Form.Select>
      </FloatingLabel>

      {/* DESCRIPTION TEXTAREA  */}
      <FloatingLabel controlId="floatingTextarea" label="Description" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Description"
          style={{ height: '100px' }}
          name="description"
          value={formInput.description}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* A WAY TO HANDLE UPDATES FOR TOGGLES, RADIOS, ETC  */}
      <Form.Check
        className="text-white mb-3"
        type="switch"
        id="sale"
        name="sale"
        label="On Sale?"
        checked={formInput.sale}
        onChange={(e) => {
          setFormInput((prevState) => ({
            ...prevState,
            sale: e.target.checked,
          }));
        }}
      />

      {/* SUBMIT BUTTON  */}
      <Button type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Book</Button>
    </Form>
  );
}

BookForm.propTypes = {
  obj: PropTypes.shape({ // object = shape
    description: PropTypes.string, // all the ERD key-value pairs
    image: PropTypes.string,
    price: PropTypes.string,
    sale: PropTypes.bool,
    title: PropTypes.string,
    author_id: PropTypes.string,
    firebaseKey: PropTypes.string,
  }), // is NOT required because form is for new (create) and old (update)
}; // we need default props for before book is created

BookForm.defaultProps = {
  obj: initialState,
};

export default BookForm;

// difference between useState and useEffect
// useState stores and tracks state of data we have in application (e.g. authorData, etc)
// it keeps your info state up to date
// useEffect happens after component renders, used to mount and unmount components
// mount = replace
// React is a single page application, regardless how many .js files we have
// React dynamically adds stuff so computer reads it the same way everytime
