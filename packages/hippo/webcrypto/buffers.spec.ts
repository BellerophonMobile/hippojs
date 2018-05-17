import { concatBuffers } from './buffers'

describe('concatBuffers', () => {
  it('should duplicate one buffer', () => {
    const a = new Uint8Array([0, 1])

    const buf = concatBuffers(a.buffer as ArrayBuffer)
    const b = new Uint8Array(buf)

    expect(b).toEqual(new Uint8Array([0, 1]))
  })

  it('should concatenate two buffers', () => {
    const a = new Uint8Array([0, 1])
    const b = new Uint8Array([2, 3])

    const buf = concatBuffers(
      a.buffer as ArrayBuffer,
      b.buffer as ArrayBuffer)
    const c = new Uint8Array(buf)

    expect(c).toEqual(new Uint8Array([0, 1, 2, 3]))
  })

  it('should concatenate two buffers', () => {
    const a = new Uint8Array([0, 1])
    const b = new Uint8Array([2, 3])
    const c = new Uint8Array([4, 5])

    const buf = concatBuffers(
      a.buffer as ArrayBuffer,
      b.buffer as ArrayBuffer,
      c.buffer as ArrayBuffer)
    const d = new Uint8Array(buf)

    expect(d).toEqual(new Uint8Array([0, 1, 2, 3, 4, 5]))
  })
})
