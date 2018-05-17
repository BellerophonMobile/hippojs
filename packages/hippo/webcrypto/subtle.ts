/* findSubtleCrypto finds the browser's implementation of SubtleCrypto. */
function findSubtleCrypto(): SubtleCrypto {
  if ('crypto' in window) {
    if ('subtle' in window.crypto) {
      return window.crypto.subtle
    } else if ('webkitSubtle' in window.crypto) {
      return (<any>window.crypto).webkitSubtle
    }
  } else if ('msCrypto' in window) {
    return (<any>window).msCrypto.subtle
  }

  throw new Error('cannot find WebCrypto implementation')
}

export const subtle: SubtleCrypto = findSubtleCrypto()

export function exportJWK(cryptoKey: CryptoKey): Promise<JsonWebKey> {
  return subtle.exportKey('jwk', cryptoKey) as Promise<JsonWebKey>
}

export const KEY_USAGE_ENCRYPT = ['encrypt']
export const KEY_USAGE_DECRYPT = ['decrypt']
export const KEY_USAGE_CIPHERER = ['encrypt', 'decrypt']

export const KEY_USAGE_SIGN = ['sign']
export const KEY_USAGE_VERIFY = ['verify']
export const KEY_USAGE_CREDENTIALER = ['sign', 'verify']

export const KEY_USAGE_DERIVE = ['deriveKey']
