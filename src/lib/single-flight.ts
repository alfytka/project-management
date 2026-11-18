/**
 * Jalankan `fn` satu per satu: panggilan berikutnya diabaikan selama panggilan sebelumnya belum
 * selesai. Dipakai untuk submit form & tombol konfirmasi.
 *
 * Mengunci tombol lewat `isPending` saja tidak cukup: validasi vee-validate berjalan async dan
 * `isPending` TanStack baru berubah setelah notifikasi terjadwal, sehingga Enter/klik ganda bisa
 * lolos sebelum tombol sempat ter-disable dan membuat data ganda. Agar kunci bertahan sampai
 * request selesai, `fn` harus menunggu mutasinya (`mutateAsync`), bukan `mutate`.
 */
export function singleFlight<A extends unknown[]>(fn: (...args: A) => unknown) {
  let running = false

  return async (...args: A) => {
    // Submit yang diabaikan tetap harus mencegah submit native (reload halaman).
    const [first] = args
    if (first instanceof Event) first.preventDefault()
    if (running) return

    running = true
    try {
      await fn(...args)
    } finally {
      running = false
    }
  }
}
