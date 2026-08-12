// Helper for Emotion styled(): block our custom style props from reaching the DOM.
// Needed when a custom prop name collides with a real HTML attribute (size, wrap, align, min, full…)
// or when the base is a component (Link, motion.*) that Emotion can't auto-filter.
export const blockProps = (...names: string[]) => ({
  shouldForwardProp: (prop: string) => !names.includes(prop),
})
