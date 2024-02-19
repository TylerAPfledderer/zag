import * as nav-menu from "@zag-js/nav-menu"
import { normalizeProps, useMachine, mergeProps } from "@zag-js/vue"
import { computed, defineComponent, h, Fragment } from "vue"
import { nav-menuControls, nav-menuData } from "@zag-js/shared"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

export default defineComponent({
  name: "nav-menu",
  setup() {
    const controls = useControls(nav-menuControls)

    const [state, send] = useMachine(nav-menu.machine({ id: "1" }), {
      context: controls.context,
    })

    const apiRef = computed(() => nav-menu.connect(state.value, send, normalizeProps))

    return () => {
      const api = apiRef.value

      return (
        <>
          <main class="nav-menu">
            <div {...api.rootProps}>
            
            </div>
          </main>

          <Toolbar controls={controls.ui}>
            <StateVisualizer state={state} />
          </Toolbar>
        </>
      )
    }
  },
})
