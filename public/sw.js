// Establish a cache name
//const cacheName = 'MyFancyCacheName_v1';
const ALHJAJIrEQUESTSWEB_CACH_NAME = 'AlhajajiRequstsWebCache_v1';

self.addEventListener('install', (event) => {
    console.log('installing service worker!!')
  event.waitUntil(
    caches.open(ALHJAJIrEQUESTSWEB_CACH_NAME).then(async cache => {
        await cache.addAll([
            `/`,
            `/index.html`,
        ]);
        return self.skipWaiting();
    })
    );
});

self.addEventListener('activate', event => {
    console.log('activating service worker')
    event.waitUntil(self.clients.claim());
})

self.addEventListener('fetch', async (event) => {
    console.log('fetching service worker')
    if (navigator.onLine) {
        var fetchRequest =event.request.clone();
        return fetch(fetchRequest).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }
        
            var responceToCashe = response.clone();

            caches.open(ALHJAJIrEQUESTSWEB_CACH_NAME)
                .then((cache) => {
                    cache.put(event.request, responceToCashe);
                });
            return response;
        
        }
     );
    } else {
        event.respondWith(
            caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
            })
        )
    }
})

/*
self.addEventListener('fetch', async (event) => {
    console.log('fetching service worker')
  // Is this a request for an image?
  if (event.request.destination === 'image') {
    // Open the cache
    event.respondWith(caches.open(cacheName).then((cache) => {
      // Respond with the image from the cache or from the network
      return cache.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request.url).then((fetchedResponse) => {
          // Add the network response to the cache for future visits.
          // Note: we need to make a copy of the response to save it in
          // the cache and use the original as the request response.
          cache.put(event.request, fetchedResponse.clone());

          // Return the network response
          return fetchedResponse;
        });
      });
    }));
  } else {
    return;
  }
});
*/