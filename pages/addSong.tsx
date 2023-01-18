import React from "react";
import A from "../components/A";
import Card from "../components/Card";
import MainConteiner from "../components/MainConteiner";
import SongWrapper from "../components/SongWrapper";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { patches } from "../utils/patches";
import ErrorPage from "./404";

function AddSong() {
  const { isAuth, isVerified, uid } = useTypedSelector((store) => store.user);

  if (!isAuth) {
    return <ErrorPage />;
  }

  if (!isVerified) {
    return (
      <MainConteiner title="Musio.io Verify your email">
        <Card>
          <A path={patches.USERSETTINGS + uid}>
            <h2>Please verify your email to post a song</h2>
          </A>
        </Card>
      </MainConteiner>
    );
  }

  return (
    <MainConteiner title="Musio.io Add song">
      <SongWrapper></SongWrapper>
    </MainConteiner>
  );
}

export default AddSong;
