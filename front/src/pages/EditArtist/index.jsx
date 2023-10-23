import ImgUploader from "../../components/ImgUploader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { api } from "../../services/api";
import "./styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLogin } from "../../contexts/Login";
import { toBase64, base64toFile } from "../../services/base64";

const EditArtist = () => {
  const [nome, setNome] = useState("Nome");
  const [pais, setPais] = useState("País");
  const [genero, setGenero] = useState("Estilo Musical");
  const [image, setImage] = useState(undefined);
  const navigate = useNavigate();
  const { loggedUserId } = useLogin();

  useEffect(() => {
    const getData = async (string) => {
      const response = await api.get(string);
      const body = response.data;
      setNome(body.name);
      setPais(body.country);
      setGenero(body.genre);
      
      let test;
      if (body.image) {test = base64toFile(body.image, "test.png", "image/type")}
      else {test = body.image;}
      setImage(test);
    };

    try {
      const string = "/artists/" + loggedUserId;
      getData(string);
    } catch (error) {
      alert("Server problema");
    }
  }, [loggedUserId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const body = {
      name: nome,
      country: pais,
      genre: genero,
      image:  image ? await toBase64(image) : "",
    };
    try {
      await api.put("/artists/", body);
      alert("Deu certo");
      navigate("/artist", { replace: true });
    } catch (error) {
      alert("Algo deu errado");
    }
  };

  return (
    <div className="Back">
      <p className="Titulo">Editar suas informações</p>
      <form className="Formulario" onSubmit={onSubmit}>
        <ImgUploader
          id="Banner"
          value={image}
          onChange={(e) => {
            setImage(e.target.files[0]);
            console.log(e.target.files[0]);
          }}
        ></ImgUploader>
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          children={"Nome"}
        />
        <Input
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          children={"País"}
        />
        <Input
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          children={"Estilo Musical"}
        />
        <Button id="Edit-Salvar" type="submit" children={"Salvar"}></Button>
      </form>
    </div>
  );
};

export default EditArtist;
