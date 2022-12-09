const token = process.env.CONVERTER_TOKEN as string
const url = process.env.CONVERTER_URL as string

export const dlAudio = (id: string) => {
  return fetch(`${url}/static/${id}/${id}.mp3`, { headers: { authorization: token } })
}
