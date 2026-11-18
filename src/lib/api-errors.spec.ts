import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { extractErrorMessage, toErrorToast } from './api-errors'

function serverError(status: number, message: string | string[]) {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data: { status, message },
  })
}

describe('extractErrorMessage', () => {
  it('menerjemahkan pesan backend yang dikenal ke bahasa Indonesia', () => {
    expect(extractErrorMessage(serverError(404, 'User not found'), 'fallback')).toBe('Email belum terdaftar di aplikasi')
    expect(
      extractErrorMessage(serverError(409, 'Status still has tasks, move them to another status first'), 'fallback'),
    ).toBe('Status masih dipakai task. Pindahkan task-nya ke status lain dulu.')
  })

  it('menampilkan pesan yang belum dikenal apa adanya', () => {
    expect(extractErrorMessage(serverError(400, 'Judul epic harus antara 3 hingga 100 karakter'), 'fallback')).toBe(
      'Judul epic harus antara 3 hingga 100 karakter',
    )
  })

  it('menerjemahkan tiap pesan validasi dalam array', () => {
    expect(extractErrorMessage(serverError(400, ['Project not found', 'pesan lain']), 'fallback')).toBe(
      'Project tidak ditemukan, pesan lain',
    )
  })

  it('memakai fallback bila bukan error dari server', () => {
    expect(extractErrorMessage(new Error('x'), 'Gagal menyimpan')).toBe('Gagal menyimpan')
  })
})

describe('toErrorToast', () => {
  it('membedakan server tidak terjangkau', () => {
    const offline = new AxiosError('Network Error', 'ERR_NETWORK', { headers: new AxiosHeaders() })
    expect(toErrorToast(offline, 'fallback')).toBe('Tidak dapat terhubung ke server')
  })
})
