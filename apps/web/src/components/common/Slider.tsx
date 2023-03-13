import { ChangeEvent, useState } from "react"

interface Props {
  value: number
  onChange: (value: number) => void
}

const Slider: Component<Props> = ({ value, onChange }) => {
  const [innerValue, setInnerValue] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setInnerValue(event.target.value)
  const handleValidChange = () => {
    onChange(Number(innerValue))
    setInnerValue(null)
  }

  return (
    <div className="w-full h-full relative bg-white/40 rounded-full transition">
      <div
        className="transform h-full bg-white/70 rounded-full"
        style={{ width: `${innerValue ?? value}%` }}
      />
      <input
        type="range"
        className="input-slider h-full focus:h-3 transform transition w-full outline-none absolute top-0"
        value={innerValue ?? value}
        onInput={handleChange}
        onMouseUp={handleValidChange}
        onTouchEnd={handleValidChange}
        onKeyDown={(event) => event.preventDefault()}
      />
    </div>
  )
}

export default Slider
