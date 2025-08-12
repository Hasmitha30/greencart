export function setToken(t){ localStorage.setItem('gc_token', t) }
export function getToken(){ return localStorage.getItem('gc_token') }
export function clearToken(){ localStorage.removeItem('gc_token') }
