import PropTypes from 'prop-types'; // defines expected component types and props
// ensures component passes the correct props
// can also help catch bugs or errors during development
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading } = useAuth();

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // what the user should see if they are logged in (NavBar)
  if (user) {
    return (
      <>
        <NavBar user={user} /> {/* NavBar only visible if user is logged in and is in every view */}
        <div className="container">
          <Component {...pageProps} />
        </div>
      </>
    );
  }

  return <Signin />; // if user is false sign in component is rendered
};

// <Component {...pageProps} /> lets dev pass any additional props that might be needed
// without having to manually pass each prop individually
// only works if user is authenticated
// it renders passed component and pageProps is passed to it

// pageProps passed are specific to component
// component responsible for using them correctly

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

// ViewDirector component check's user's auth status
// renders correct view based on status (loading, signin, app)
// uses useAuth hook to access user auth state
// uses navBar component only visible if user is logged in
