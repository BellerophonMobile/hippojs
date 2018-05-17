export function concatBuffers(...buffers: Array<ArrayBuffer>): ArrayBuffer {
  let total = 0

  for (const b of buffers) {
    total += b.byteLength
  }

  const final = new Uint8Array(total)

  let offset = 0
  for (const b of buffers) {
    final.set(new Uint8Array(b), offset)
    offset += b.byteLength
  }

  return final.buffer as ArrayBuffer
}
