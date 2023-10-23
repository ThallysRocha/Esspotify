import { Album } from "../models/album.js";
import { Song } from "../models/song.js";

export class AlbumsController {
  constructor() {}

  async createAlbum(request, response) {
    const { name, image, year, songs } = request.body;

    const userId = request.userId;
    const same = await Album.findOne({ name });
    if (same && same.artist == userId)
      return response.status(400).send({ error: "Album already exists" });
    if (!songs.length)
      return response.status(400).send({ error: "A album needs a song" });
    if (
      !songs.every((song) => {
        return song.name && song.url;
      })
    )
      return response
        .status(400)
        .send({ error: "A song is missing required an argument" });

    try {
      const album = await Album.create({ name, image, year, artist: userId });
      await Promise.all(
        songs.map(async (song) => {
          const albumSong = new Song({
            ...song,
            album: album._id,
            artist: userId,
          });

          await albumSong.save();

          album.songs.push(albumSong);
        })
      );

      await album.save();

      return response.send({ album });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .send({ message: "Something went wrong with the server", error });
    }
  }

  async getAlbums(request, response) {
    try {
      const albums = await Album.find();
      return response.send({ albums });
    } catch (error) {
      return response.status(400).send({ error: "Error loading albums" });
    }
  }

  async getAlbumById(request, response) {
    try {
      const album = await Album.findOne({ _id: request.params.albumId });
      if (album) return response.send(album);
      else
        return response
          .status(404)
          .send({ message: "Could not find the album" });
    } catch (error) {
      return response
        .status(500)
        .send({ message: "Something went wrong with the server", error });
    }
  }

  async getAlbumByArtistId(request, response) {
    try {
      const albums = await Album.find({ artist: request.params.artistId });
      if (albums) return response.send(albums);
      else
        return response
          .status(404)
          .send({
            message: "Artist does not exist or does not have any albums",
          });
    } catch (error) {
      return response
        .status(500)
        .send({ message: "Something went wrong with the server", error });
    }
  }

  async updateAlbum(request, response) {
    try {
      if (await Album.findOne({ _id: request.params.albumId })) {
        const body = request.body;
        delete body.createdAt;
        delete body._id;
        delete body.artist;
        const same = await Album.findOne({ name: body.name });
        if (same && same._id != request.params.albumId)
          return response
            .status(400)
            .send({ error: "Album name already exists" });
        if (!body.songs.length)
          return response.status(400).send({ error: "A album needs a song" });
        const album = await Album.updateOne(
          { _id: request.params.albumId },
          body
        );
        return response.send(album);
      } else {
        return response
          .status(404)
          .send({ message: "Could not find the album" });
      }
    } catch (error) {
      return response
        .status(500)
        .send({ message: "Something went wrong with the server", error });
    }
  }
}
