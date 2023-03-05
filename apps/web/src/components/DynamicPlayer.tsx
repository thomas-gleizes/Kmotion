const music = {
  id: 1,
  title: "Satellite Empire & DREAMOIR - Apocrypha I: Warrior's Vigil",
  artist: "MrSuicideSheep",
  youtubeId: "I_qskCKAlFA",
  downloaderId: 1,
  createdAt: "2023-03-05T14:33:05.418Z",
  updatedAt: "2023-03-05T14:33:05.418Z",
}

const DynamicPlayer: Component = () => {
  return (
    <div className="absolute bottom-0 right-0 w-full">
      <div className="h-[50px] bg-black">
        <div className="w">
          <img className="h-[40px] rounded-md" src={`/api/v1/musics/${music.id}/cover`} />
        </div>
      </div>
      <div className="h-[40px] bg-gray-300">
        <div></div>
      </div>
    </div>
  )
}

export default DynamicPlayer
