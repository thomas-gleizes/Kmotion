import { useAsync } from "react-use";

const PlaylistPage: Page = () => {
  useAsync(async () => {
    // fetch playlists
  }, []);

  return (
    <div>
      <h1>Playlist page</h1>
    </div>
  );
};

export default PlaylistPage;
