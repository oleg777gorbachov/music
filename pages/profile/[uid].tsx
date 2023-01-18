import Image from "next/image";
import Router, { NextRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import MainConteiner from "../../components/MainConteiner";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import s from "../../styles/pages/profile.module.scss";
import readUser from "../../utils/firebase/user/readUser";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { userReducer } from "../../redux/reducers/userReducer";
import ModalUserOptional from "../../components/modals/ModalUserOptional";
import { patches } from "../../utils/patches";
import A from "../../components/A";
import ModalCreatePlaylist from "../../components/modals/ModalCreatePlaylist";
import readPlaylistAll from "../../utils/firebase/playlist/readPlaylistAll";
import readAllSongs from "../../utils/firebase/songs/readAllSongs";
import { playlistReducer } from "../../redux/reducers/playlistReducer";
import SongItem from "../../components/SongItem";
import { likelistReducer } from "../../redux/reducers/likelistReducer";
import logoutUser from "../../utils/firebase/auth/logoutUser";
import ModalFollowers from "../../components/modals/ModalFollowers";
import followUserFB from "../../utils/firebase/follow/followUserFB";
import ModalToLogin from "../../components/modals/ModalToLogin";
import unfollowUserFB from "../../utils/firebase/follow/unfollowUserFB";
import Modal from "../../components/Modal";
import ModalHistorySongs from "../../components/modals/ModalHistorySongs";
import { AiFillSetting } from "react-icons/ai";
import { userOptionalI } from "../../types/userOptionalI";

export type croppedAreaPixelsI = {
  width: number;
  height: number;
  x: number;
  y: number;
};

function Profile(props: userOptionalI) {
  const {
    followers,
    following,
    image,
    likelist,
    username,
    playlists,
    uid,
    songHistory,
  } = props;

  const {
    uid: userUid,
    isAuth,
    following: userFollows,
  } = useTypedSelector((store) => store.user);
  const { playlists: playlist } = useTypedSelector((store) => store.playlists);
  const { likelistSongs } = useTypedSelector((store) => store.likelist);
  const { logout } = userReducer.actions;
  const { setPlaylistAction } = playlistReducer.actions;
  const { setLikelistSongsAction } = likelistReducer.actions;
  const { addToFollowing, removeFromFollowing } = userReducer.actions;

  const dispatch = useTypedDispatch();

  const isMyProfile = uid === userUid ? true : false;

  const [name, setName] = useState(username);

  const [followersModal, setFollowersModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isNeedToLogin, setIsNeedToLogin] = useState(false);
  const [isFollowing, setIsFollowing] = useState(userFollows.includes(uid));
  const [historyModal, setHistoryModal] = useState(false);

  const [playlistState, setPlaylistState] = useState(false);

  const modalOpen = () => {
    setName(username);
    setIsEdit(true);
  };

  const logoutAction = () => {
    logoutUser();
    Router.push("/").then(() => dispatch(logout()));
  };

  const showFollowers = () => setFollowersModal(true);

  const showFollowing = () => setFollowingModal(true);

  const openSongHistory = () => setHistoryModal(true);

  const followUser = () => {
    if (isAuth) {
      setIsFollowing(true);
      dispatch(addToFollowing(uid));
      followUserFB(userUid, uid);
    } else {
      setIsNeedToLogin(true);
    }
  };

  const unfollowUser = () => {
    if (isAuth) {
      setIsFollowing(false);
      dispatch(removeFromFollowing(uid));
      unfollowUserFB(userUid, uid);
    } else {
      setIsNeedToLogin(true);
    }
  };

  useEffect(() => {
    setIsFollowing(userFollows.includes(uid));
  }, [userFollows, uid]);

  useEffect(() => {
    readPlaylistAll(playlists).then((e) => dispatch(setPlaylistAction(e)));
  }, [playlists, dispatch, setPlaylistAction]);

  useEffect(() => {
    readAllSongs(likelist).then((e) => {
      dispatch(setLikelistSongsAction(e));
    });
  }, [likelist, dispatch, setLikelistSongsAction]);

  const playlistItems = useMemo(
    () =>
      playlist.map((e) => {
        const path = patches.PLAYLIST + e.id;
        return (
          <div key={e.id}>
            <A path={path}>{e.name}</A>
          </div>
        );
      }),
    [playlist]
  );

  const likelistItems = useMemo(() => {
    return likelistSongs.map((e) => (
      <SongItem
        author={e.author}
        name={e.songName}
        image={e.imageURL}
        id={e.id}
        key={e.id}
        type={"STRETCH"}
        duration={e.duration}
        listToPlay="LIKELIST"
        fileURL={e.fileURL}
        isHeart={{ isOnLikeList: true }}
        authorID={e.authorID}
      />
    ));
  }, [likelistSongs]);

  return (
    <MainConteiner title="Musio.io profile" image={image}>
      <Card>
        <div className={s.profile}>
          <div>
            <div className={s.item}>
              <h1 onClick={isMyProfile ? modalOpen : () => {}}>{username}</h1>
              {isMyProfile && (
                <A path={patches.USERSETTINGS + uid}>
                  <AiFillSetting style={{ fontSize: "3rem" }} />
                </A>
              )}
            </div>
            <div className={s.follows}>
              <p onClick={showFollowers}>
                {isFollowing ? followers.length + 1 : followers.length}{" "}
                followers
              </p>
              <p onClick={showFollowing}>{following.length} following</p>
              <p onClick={openSongHistory}>History</p>
            </div>
            {isMyProfile ? (
              <>
                <Button
                  text="Logout"
                  className="redbtn"
                  onClick={logoutAction}
                />

                <A path={patches.ADDSONG}>
                  <Button
                    text="Add new song"
                    className="greenbtn"
                    style={{ margin: "1rem" }}
                  />
                </A>
                <Button
                  text="Create playlist"
                  className="greenbtn"
                  onClick={() => setPlaylistState((prev) => !prev)}
                />
              </>
            ) : isFollowing ? (
              <Button
                text="Unfollow user"
                className="redbtn"
                onClick={unfollowUser}
              />
            ) : (
              <Button text="Follow user" onClick={followUser} />
            )}
          </div>
          <div className={isMyProfile ? s.avatar : s.avatar_no}>
            <Image
              src={image}
              alt="avatar"
              width={200}
              height={200}
              onClick={isMyProfile ? modalOpen : () => {}}
            />
          </div>
        </div>
      </Card>
      <br></br>
      <Card>
        <h2>Playlist</h2>
        <div>
          {playlistItems.length > 0 ? (
            playlistItems
          ) : isAuth ? (
            <p>You dont have playlists</p>
          ) : (
            <p>This user dont have any of playlists</p>
          )}
        </div>
      </Card>
      <br></br>
      <Card>
        <h2>Likelist</h2>
        {likelistItems.length > 0 ? (
          likelistItems
        ) : isAuth ? (
          <p>You dont have anything</p>
        ) : (
          <p>This user likelist is empty</p>
        )}
      </Card>
      <br></br>

      <ModalUserOptional
        user={props}
        isEdit={isEdit}
        name={name}
        setIsEdit={setIsEdit}
        setName={setName}
      />
      <ModalCreatePlaylist state={playlistState} setState={setPlaylistState} />
      <Modal
        closeAction={() => setFollowersModal(false)}
        state={followersModal}
      >
        <ModalFollowers
          followersArray={followers}
          title={"Followers"}
          key={new Date().getTime() - 500}
        />
      </Modal>
      <Modal
        closeAction={() => setFollowingModal(false)}
        state={followingModal}
      >
        <ModalFollowers
          followersArray={following}
          title={"Followings"}
          key={new Date().getTime() - 300}
        />
      </Modal>
      <ModalHistorySongs
        setState={setHistoryModal}
        songsArray={songHistory}
        state={historyModal}
        isMyProfile={isMyProfile}
      />
      <ModalToLogin setState={setIsNeedToLogin} state={isNeedToLogin} />
    </MainConteiner>
  );
}

export default Profile;

export async function getServerSideProps(uid: NextRouter) {
  const id = uid.query.uid;
  if (typeof id === "string") {
    const res = await readUser(id).catch((e) => {
      return { notFound: true };
    });
    if (res === undefined) return { notFound: true };
    return { props: res };
  }
  return { notFound: true };
}
