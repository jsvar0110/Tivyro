let pending = 0
const listeners = new Set()

const emit = () => listeners.forEach((listener) => listener())

export const requestTracker = {
  start() { pending += 1; emit() },
  end() { pending = Math.max(0, pending - 1); emit() },
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
  getSnapshot() { return pending },
}

export function attachLoadingInterceptors(instance) {
  instance.interceptors.request.use(
    (config) => { requestTracker.start(); return config },
    (error) => { requestTracker.end(); return Promise.reject(error) }
  )
  instance.interceptors.response.use(
    (response) => { requestTracker.end(); return response },
    (error) => { requestTracker.end(); return Promise.reject(error) }
  )
}