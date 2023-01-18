import { useTypedSelector } from "../hooks/useTypedSelector";
import ErrorPage from "./404";
import Profile from "./profile/[uid]";

function Myprofile() {
  const {
    followers,
    following,
    image,
    isAuth,
    likelist,
    playlists,
    username,
    uid,
    songHistory,
    isVerified,
  } = useTypedSelector((store) => store.user);

  if (!isAuth) {
    return <ErrorPage />;
  }

  return (
    <Profile
      followers={followers}
      following={following}
      image={image}
      likelist={likelist}
      playlists={playlists}
      username={username}
      uid={uid}
      songHistory={songHistory}
      isVerified={isVerified}
    />
  );
}

export default Myprofile;
