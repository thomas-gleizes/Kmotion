import ScrollableContainer from "./ScrollableContainer"

const ScrollableLayout: ComponentWithChild = ({ children }) => {
  return (
    <ScrollableContainer className="max-h-screen mt-header pb-56">{children}</ScrollableContainer>
  )
}

export default ScrollableLayout
