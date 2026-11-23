self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('burnout-self-care-cache').then((cache) => {
      return cache.addAll([
        '/',
        './index.html',
        './styles.css',
        './index.js',
        './icon.png'
      ])
    })
  )
});