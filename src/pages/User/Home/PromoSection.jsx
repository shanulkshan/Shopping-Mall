export default function PromoSection() {
    // Placeholder images that will work reliably
    const promocImages = [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    ];

    const handleImageError = (e) => {
      // Fallback to a simple colored placeholder if image fails to load
      e.target.src = `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#6366f1"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="24">
            Shop Image
          </text>
        </svg>
      `)}`;
    };

    return (
      <div className="relative overflow-hidden bg-white dark:bg-gray-900">
        <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
          <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Discover Amazing Deals
              </h1>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
                Explore Serendib Plaza and find incredible promotions from top brands and local favorites.
              </p>
            </div>
            <div>
              <div className="mt-10">
                {/* Decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                >
                  <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-2xl sm:opacity-0 lg:opacity-100 shadow-lg">
                          <img
                            src={promocImages[0]}
                            alt="Shopping mall store"
                            className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={promocImages[1]}
                            alt="Shopping mall store"
                            className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={promocImages[2]}
                            alt="Shopping mall store"
                            className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={promocImages[3]}
                            alt="Shopping mall store"
                            className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={promocImages[4]}
                            alt="Shopping mall store"
                            className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                      </div>
                      <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="h-64 w-44 overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={promocImages[5]}
                            alt="Shopping mall store"
                            className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                        <div className="h-64 w-44 overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={promocImages[6]}
                            alt="Shopping mall store"
                            className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <a
                  href="/promotions"
                  className="inline-block rounded-2xl border border-transparent bg-indigo-600 dark:bg-indigo-500 px-8 py-3 text-center font-medium text-white shadow-lg hover:shadow-xl hover:bg-indigo-700 dark:hover:bg-indigo-400 transform hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  View Promotions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  