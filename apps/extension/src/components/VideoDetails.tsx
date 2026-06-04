import React, { useEffect, useState } from "react"
import { FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi"
import { api } from "../utils/api"
import { useMusicStore } from "../stores"

interface VideoDetailsProps {
  videoId: string
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({ videoId }) => {
  const [isLoadingMusic, setIsLoadingMusic] = useState(true)
  const { music, isLoading, error, setMusic, setLoading, setError, clearMusic } =
    useMusicStore()

  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoadingMusic(true)
      try {
        const result = await api.getMusicByYoutubeId(videoId)
        if (result) {
          setMusic(result)
        } else {
          clearMusic()
        }
      } catch (err) {
        setError("Failed to fetch video information")
      } finally {
        setIsLoadingMusic(false)
      }
    }

    fetchMusic()
  }, [videoId])

  const handleConvert = async () => {
    if (!music) return

    setLoading(true)
    try {
      await api.convertMusicToMp3(music.id)
      // Refresh music data after conversion
      const result = await api.getMusicByYoutubeId(videoId)
      if (result) {
        setMusic(result)
      }
    } catch (err: any) {
      setError(err.message || "Conversion failed")
    } finally {
      setLoading(false)
    }
  }

  if (isLoadingMusic) {
    return (
      <div className="w-full p-6 bg-white flex items-center justify-center gap-2">
        <FiLoader className="animate-spin" />
        <span className="text-gray-600">Loading video info...</span>
      </div>
    )
  }

  return (
    <div className="w-full p-6 bg-white">
      {music ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{music.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-1">
              {music.artist || "Unknown Artist"}
            </p>
          </div>

          {music.convertedAt ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Already converted</p>
                <p className="text-xs text-green-700">
                  Converted on {new Date(music.convertedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-md transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Converting...
                </>
              ) : (
                "Convert to MP3"
              )}
            </button>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm flex gap-2">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            This video is not in your library yet. Add it first.
          </p>
          <button
            onClick={async () => {
              setLoading(true)
              try {
                const result = await api.createMusicFromYoutube(videoId)
                setMusic(result)
              } catch (err: any) {
                setError(err.message || "Failed to add video")
              } finally {
                setLoading(false)
              }
            }}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-md transition"
          >
            {isLoading ? "Adding..." : "Add Video"}
          </button>
        </div>
      )}
    </div>
  )
}

