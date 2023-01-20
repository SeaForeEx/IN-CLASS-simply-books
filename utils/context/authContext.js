// Context API Docs: https://beta.reactjs.org/learn/passing-data-deeply-with-context

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { firebase } from '../client';

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext'; // Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context. https://reactjs.org/docs/context.html#contextdisplayname

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);

  // there are 3 states for the user:
  // null = application initial state, not yet loaded
  // false = user is not logged in, but the app has loaded
  // an object/value = user is logged in

  useEffect(() => {
    firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) {
        setUser(fbUser);
      } else {
        setUser(false);
      }
    }); // creates a single global listener for auth state changed
  }, []); // empty dependency array only renders once during initial render
  // useEffect will only run once even if component's state/props change

  const value = useMemo( // https://reactjs.org/docs/hooks-reference.html#usememo
    () => ({
      user,
      userLoading: user === null,
      // as long as user === null, will be true
      // As soon as the user value !== null, value will be false
    }),
    [user], // useMemo will run every time user state changes
  );
    // absent dependency arrays can cause infinite loops
    // function might also re-run during every render, slows the app
    // dependency arrays ensure that component only updates
    // when the necessary data changes, improves app performance

  return <AuthContext.Provider value={value} {...props} />;
}; // provides AuthContext context to children components
// {value} is the prop that came from useMemo to be sent to child components

// AC.Provider shares relevant authentication data to other components that need access
// separates auth logic from rest of app to make data sharing easier

const AuthConsumer = AuthContext.Consumer;

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthConsumer };
