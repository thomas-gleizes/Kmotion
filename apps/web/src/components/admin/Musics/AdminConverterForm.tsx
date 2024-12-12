import { useForm } from "react-hook-form"
import { api } from "../../../utils/Api"
import { extractYouTubeId } from "../../../utils/helpers"

type Props = {
  refresh: () => void
}

const AdminConverterForm: Component<Props> = ({ refresh }) => {
  const form = useForm({ defaultValues: { youtubeVideoIdOrUrl: "" } })

  const handleSubmit = form.handleSubmit(async (values) => {
    const youtubeId = extractYouTubeId(values.youtubeVideoIdOrUrl)

    if (!youtubeId) {
      return form.setError("youtubeVideoIdOrUrl", { message: "Invalid YouTube URL or ID" })
    }

    await api.convertMusic(youtubeId)

    refresh()
    form.reset()
  })

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex">
        <input
          {...form.register("youtubeVideoIdOrUrl")}
          placeholder="https://www.youtube.com/watch?v=5NC8jgUCE2U"
          className="bg-white rounded-l w-[500px] px-5 py-2 text-xl shadow outline-none"
        />
        <button
          type="submit"
          className="bg-blue-800 text-white hover:bg-blue-900 disabled:bg-blue-600 shadow px-5 py-2 text-xl rounded-r flex items-center justify-center gap-5"
        >
          Convert
        </button>
      </div>
      <div>
        {form.formState.errors.youtubeVideoIdOrUrl && (
          <p className="text-red-500">{form.formState.errors.youtubeVideoIdOrUrl.message}</p>
        )}
      </div>
    </form>
  )
}

export default AdminConverterForm
