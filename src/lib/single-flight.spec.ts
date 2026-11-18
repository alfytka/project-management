import { describe, expect, it, vi } from 'vitest'
import { singleFlight } from './single-flight'

describe('singleFlight', () => {
  it('mengabaikan panggilan selama panggilan sebelumnya belum selesai', async () => {
    let finish!: () => void
    const pending = new Promise<void>((resolve) => (finish = resolve))
    const fn = vi.fn<() => Promise<void>>().mockReturnValueOnce(pending).mockResolvedValue(undefined)
    const run = singleFlight(fn)

    const first = run()
    await run()
    expect(fn).toHaveBeenCalledTimes(1)

    finish()
    await first
    await run()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('membuka kunci lagi walau panggilan gagal', async () => {
    const fn = vi.fn<() => Promise<void>>().mockRejectedValueOnce(new Error('gagal')).mockResolvedValue(undefined)
    const run = singleFlight(fn)

    await expect(run()).rejects.toThrow('gagal')
    await run()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('tetap mencegah submit native untuk event yang diabaikan', async () => {
    const run = singleFlight((_event: Event) => new Promise(() => {}))
    void run(new Event('submit', { cancelable: true }))

    const ignored = new Event('submit', { cancelable: true })
    await run(ignored)
    expect(ignored.defaultPrevented).toBe(true)
  })
})
