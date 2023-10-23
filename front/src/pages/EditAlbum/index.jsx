import "./styles.css";
import ImgUploader from "../../components/ImgUploader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Song from "../../components/Song";
import React, { useState, useEffect } from "react";
import { useAlbum } from "../../contexts/Album";
import { useNavigate, useLocation } from "react-router-dom";
import { base64toFile } from "../../services/base64";
const EditAlbum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [oldSongs, setOldSongs] = useState();
  const {
    name,
    setName,
    image,
    setImage,
    year,
    setYear,
    songs,
    setSongs,
    handleEditAlbum,
  } = useAlbum();
  useEffect(() => {
    if (location.state.songs) setOldSongs(location.state.songs);
    if (location.state.album.name) setName(location.state.album.name);
    if (location.state.album.image) {
      const teste = base64toFile(
        location.state.album.image,
        "test.png",
        "image/type"
      );
      setImage(teste);
    }
    if (!year) setYear(location.state.album.year);
  }, []);
  const deleteSong = (index, songs) => {
    const songsAux = [...songs];
    songsAux.splice(index, 1);
    setSongs(songsAux);
  };
  const addSong = () => {
    navigate("/createMusic");
  };
  const onSubmit = (e) => {
    e.preventDefault();
    handleEditAlbum(oldSongs);
  };
  return !(name && year && songs) ? (
    <p>Carregando...</p>
  ) : (
    <div className="CreateAlbum">
      <h1 className="title">Editar álbum</h1>
      <div className="CreateAlbum-Body">
        <form className="Form-Album">
          <ImgUploader
            id="ImgAlbum"
            value={image}
            onChange={(e) => setImage(e.target.files[0])}
          ></ImgUploader>
          <Input
            placeholder="Nome"
            value={name}
            id="inputAlbum"
            onChange={(e) => setName(e.target.value)}
          >
            Nome*
          </Input>
          <Input
            placeholder="aaaa"
            value={year}
            id="inputAlbum"
            onChange={(e) => setYear(e.target.value)}
          >
            Ano*
          </Input>
        </form>
        <div className="SongsAdded">
          {songs
            ? songs.map((song, index, songs) => {
                return (
                  <Song
                    number={index + 1}
                    name={song.name}
                    participation={song.participation ? song.participation : ""}
                    handleDelete={() => deleteSong(index, songs)}
                    key={song.name}
                  />
                );
              })
            : ""}
          <div
            className="AddSongs-Button"
            onClick={() => {
              addSong();
            }}
          >
            + Adicionar Músicas
          </div>
        </div>
      </div>
      <Button id="SaveAlbum" type="submit" onClick={onSubmit}>
        Salvar
      </Button>
    </div>
  );
};
export default EditAlbum;
