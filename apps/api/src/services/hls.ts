import * as path from "node:path"
import * as fs from "node:fs"
import * as ffmpeg from "fluent-ffmpeg"

import YtConverter from "./ytconverter"

class HlsService {
  private hlsDirectory = path.join(__dirname, "..", "..", "public", "hls")
  private hlsTmpDirectory = path.join(this.hlsDirectory, "tmp")

  constructor(private ytService: YtConverter) {
    fs.mkdirSync(this.hlsDirectory, { recursive: true })
    fs.mkdirSync(this.hlsTmpDirectory, { recursive: true })
  }

  private async saveTMPFile(youtubeId: string): Promise<void> {
    const buffer = await this.ytService
      .getAudio(youtubeId)
      .then((resp) => resp.arrayBuffer())
      .then((array) => Buffer.from(array))

    await fs.promises.writeFile(path.join(this.hlsTmpDirectory, `${youtubeId}.mp3`), buffer)
  }

  private async unlinkTMPFile(youtubeId: string): Promise<void> {
    await fs.promises.unlink(path.join(this.hlsTmpDirectory, `${youtubeId}.mp3`))
  }

  private async generateHLSFile(youtubeId: string): Promise<void> {
    const hlsPath = path.join(this.hlsDirectory, youtubeId)
    const videoPath = path.join(this.hlsTmpDirectory, `${youtubeId}.mp3`)

    await fs.promises.mkdir(hlsPath, { recursive: true })

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath, { timeout: 432000 })
        .addOptions([
          "-profile:v baseline",
          "-level 3.0",
          "-start_number 0",
          "-hls_time 10",
          "-hls_list_size 0",
          "-f hls",
        ])
        .output(path.join(hlsPath, "index.m3u8"))
        .on("end", resolve)
        .on("error", reject)
        .run()
    })
  }

  public async generateHLS(youtubeId: string): Promise<void> {
    try {
      await this.saveTMPFile(youtubeId)
      await this.generateHLSFile(youtubeId)
      await this.unlinkTMPFile(youtubeId)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default new HlsService(new YtConverter())
