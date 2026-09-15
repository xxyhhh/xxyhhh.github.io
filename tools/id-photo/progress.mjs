const PHASE_STEPS = Object.freeze({
  empty: 0,
  ready: 1,
  processing: 2,
  cutout: 3
})

export function stepForPhase(phase) {
  return PHASE_STEPS[phase] ?? 0
}
