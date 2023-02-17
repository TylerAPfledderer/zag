import * as carousel from "@zag-js/carousel"
import { useMachine, normalizeProps } from "@zag-js/react"
import { useId } from "react"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"

const images = [
  "https://tinyurl.com/5b6ka8jd",
  "https://tinyurl.com/7rmccdn5",
  "https://tinyurl.com/59jxz9uu",
  "https://tinyurl.com/6jurv23t",
  "https://tinyurl.com/yp4rfum7",
]

export default function Page() {
  const [state, send] = useMachine(carousel.machine({ id: useId() }))

  const api = carousel.connect(state, send, normalizeProps)

  return (
    <>
      <main className="carousel">
        <div {...api.rootProps}>
          <button {...api.previousTriggerProps}>Prev</button>
          <button {...api.nextTriggerProps}>Next</button>
          <div {...api.viewportProps}>
            <div {...api.slideGroupProps}>
              {images.map((image, index) => (
                <div {...api.getSlideProps({ index })} key={index}>
                  <img src={image} alt="" style={{ height: "300px", width: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Toolbar controls={null}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
