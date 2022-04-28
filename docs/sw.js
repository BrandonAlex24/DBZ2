const CacheStatic = "estatico-1";
const CacheDinamic = "dinamico-1";
const CacheInmutable = "inmutable-1";

self.addEventListener("install", (event) => {
	const cacheStatic = caches.open(CacheStatic).then((cache) => {
		cache.addAll([
			"/",
			"index.html",
			"css/style.css",
			"js/app.js",			
			"js/fontawesome.min.js",
			"images/androide17.jpg",
			"images/black.jpg",
			"images/black1.png",
			"images/buu3.jpg",
			"images/camara.png",
			"images/dende.jpg",
			"images/fondo.jpg",
			"images/goku0.jpg",
			"images/goku1.jpg",
			"images/goku2.jpg",
			"images/goku3.jpg",
			"images/goku4.jpg",
			"images/goku5.jpg",
			"images/goku6.jpg",
			"images/krilin.png",
			"images/majinboo.jpg",
			"images/majinboo1.png",
			"images/majinboo2.jpg",
			"images/picoro1.jpg",
			"images/picoro2.png",
			"images/picoro3.png",
			"images/picoro4.png",
			"images/shin.jpg",
			"images/trunks.jpg",
			"images/trunks1.png",
			"images/vegeta0.png",
			"images/vegeta1.png",
			"images/vegeta2.png",
			"images/vegeta3.png",
			"images/vegeta4.jpg"

		]);
	});
	const cacheInmutable = caches.open(CacheInmutable).then((cache) => {
		cache.addAll([
			"pages/error.html",
			"images/error.png",
			"js/jquery.min.js",
			"/manifest.json",
			"js/fontawesome.min.js",
			"js/bootstrap.bundle.min.js",			
			"css/bootstrap.min.css",
			"images/camara.png",
		]);
	});
	event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
	console.log("Instalado");
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("Evento activate");
	caches.keys().then((keys) => {
		keys.forEach((cache) => {
			if (cache.includes("estatico") && !cache.includes(CacheStatic)) {
				caches.delete(cache);
			}
		});
	});
});

self.addEventListener("fetch", (event) => {
	const respuesta = fetch(event.request)
		.then((res) => {
			if (res) {
				caches.match(event.request).then((cache) => {
					if (!cache) {
						caches.open(CacheDinamic).then((cache) => {
							cache.add(event.request.url);
						});
					}
				});
				return res;
			} else {
				return caches.match(event.request.url).then((newRes) => {
					if (newRes) {
						return newRes;
					} else {
						if (/\.(png|jpg)$/.test(event.request.url)) {
							return caches.match("/images/error.png");
						}
						return caches.match("/pages/error.html");
					}
				});
			}
		})
		.catch((error) => {
			return caches.match(event.request.url).then((newRes) => {
				if (newRes) {
					return newRes;
				} else {
					if (/\.(png|jpg)$/.test(event.request.url)) {
						return caches.match("/images/error.png");
					}
					return caches.match("/pages/error.html");
				}
			});
		});
	event.respondWith(respuesta);
});
