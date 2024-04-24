import { useSelector } from 'react-redux';

function Profile () {
  const currentUser = useSelector(state => state.session.user);

  return (
    <h1>Profile page</h1>
  )
  

}

export default Profile;