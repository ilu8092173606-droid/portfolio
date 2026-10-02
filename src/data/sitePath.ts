const basePath = import.meta.env.BASE_URL

export function sitePath(path = '') {
  return `${basePath}${path.replace(/^\/+/, '')}`
}

export function appPath(pathname: string) {
  if (basePath === '/') return pathname || '/'
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`
  if (!pathname.startsWith(normalizedBase)) return pathname || '/'
  return `/${pathname.slice(normalizedBase.length)}`
}
