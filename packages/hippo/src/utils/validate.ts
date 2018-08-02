export interface PropertyMap {
  [key: string]: string | PropertyMap
}

/* validateTypes ensures that an object has the given properties with types. */
export function validateTypes(obj: {[key: string]: any}, properties: PropertyMap) {
  for (const key of Object.keys(properties)) {
    if (!obj.hasOwnProperty(key)) {
      throw new Error(`failed to deserialize: missing "${key}"`)
    }

    const type = properties[key]
    const value: any = obj[key]

    if (typeof type  === 'string' && !checkType(value, type)) {
      throw new Error(`failed to deserialize: "${key}" not ${type}`)
    } else if (typeof type === 'object') {
      validateTypes(value, type)
    }
  }
}

/* checkType checks that a particular value matches a given type. */
function checkType(value: any, type: string): boolean {
  switch (type) {
    case 'object':
      return value !== null && typeof value === 'object' && !Array.isArray(value)

    case 'array':
      return Array.isArray(value)

    case 'string':
      return typeof value === 'string'

    case 'number':
      return typeof value === 'number'

    case 'defined':
      return typeof value !== 'undefined' && value !== null

    default:
      throw new Error(`invalid type argument: "${type}"`)
  }
}
