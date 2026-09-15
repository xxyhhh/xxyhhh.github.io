function erode(mask, width, height) {
  const result = new Uint8Array(mask.length)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let keep = 1
      for (let oy = -1; oy <= 1 && keep; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          if (!mask[(y + oy) * width + x + ox]) { keep = 0; break }
        }
      }
      result[y * width + x] = keep
    }
  }
  return result
}

function largestComponent(mask, width, height) {
  const visited = new Uint8Array(mask.length)
  let largest = []
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || visited[start]) continue
    const queue = [start]
    const component = []
    visited[start] = 1
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const index = queue[cursor]
      component.push(index)
      const x = index % width
      const y = Math.floor(index / width)
      const neighbours = [index - 1, index + 1, index - width, index + width]
      for (const next of neighbours) {
        if (next < 0 || next >= mask.length || visited[next] || !mask[next]) continue
        const nx = next % width
        const ny = Math.floor(next / width)
        if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue
        visited[next] = 1
        queue.push(next)
      }
    }
    if (component.length > largest.length) largest = component
  }
  const result = new Uint8Array(mask.length)
  for (const index of largest) result[index] = 1
  return result
}

function expand(mask, width, height, radius = 2) {
  const result = new Uint8Array(mask.length)
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let keep = 0
    for (let oy = -radius; oy <= radius && !keep; oy++) for (let ox = -radius; ox <= radius; ox++) {
      const nx = x + ox
      const ny = y + oy
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && mask[ny * width + nx]) { keep = 1; break }
    }
    result[y * width + x] = keep
  }
  return result
}

function smoothStep(value, low = 0.38, high = 0.78) {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)))
  return t * t * (3 - 2 * t)
}

function feather(alpha, allowed, width, height) {
  const result = new Uint8ClampedArray(alpha.length)
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const outputIndex = y * width + x
    if (alpha[outputIndex] < 96 || !allowed[outputIndex]) {
      result[outputIndex] = 0
      continue
    }
    let total = 0
    let samples = 0
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
      const nx = x + ox
      const ny = y + oy
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
      const index = ny * width + nx
      total += allowed[index] ? smoothStep(alpha[index] / 255) : 0
      samples++
    }
    result[outputIndex] = Math.round(total / samples * 255)
  }
  return result
}

export function refineAlphaMask(alpha, width, height) {
  const confident = Uint8Array.from(alpha, value => value >= 96 ? 1 : 0)
  const core = largestComponent(erode(confident, width, height), width, height)
  const allowed = expand(core, width, height, 2)
  return feather(alpha, allowed, width, height)
}
