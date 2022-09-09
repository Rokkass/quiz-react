import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <>
      <h1>Not Found</h1>
      <Link to="/">go back home</Link>
    </>
  );
}

export default NotFound;
