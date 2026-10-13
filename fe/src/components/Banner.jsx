import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { api } from '../services/api'

const defaultBanners = [
  {
    id: 1,
    eyebrow: 'Featured collection',
    title: 'Discover something new.',
    description:
      'Explore our latest products and find something that fits your needs.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    buttonText: 'Shop now',
    link: '/products',
  },
  {
    id: 2,
    eyebrow: 'Explore',
    title: 'Everything in one place.',
    description:
      'Browse products from different categories with a simple experience.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop',
    buttonText: 'Explore products',
    link: '/products',
  },
  {
    id: 3,
    eyebrow: 'New arrivals',
    title: 'Something worth discovering.',
    description:
      'Check out our newest collection and find your next favorite product.',
    image:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop',
    buttonText: 'View collection',
    link: '/products',
  },
]


function Banner({
  banners: propBanners,
  autoPlay = true,
}) {
  const [apiBanners, setApiBanners] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (propBanners) return

    let isMounted = true
    async function loadBanners() {
      try {
        const res = await api.getBanners()
        if (res?.data && res.data.length > 0 && isMounted) {
          const mapped = res.data.map((b) => ({
            id: b.id,
            eyebrow: 'Featured collection',
            title: b.title,
            description: b.description,
            image: b.image_url,
            buttonText: b.button_text || 'Shop now',
            link: b.link_url || '/products',
          }))
          setApiBanners(mapped)
        }
      } catch {
        // use default
      }
    }

    loadBanners()

    return () => {
      isMounted = false
    }
  }, [propBanners])

  const banners = propBanners || apiBanners || defaultBanners
  const totalBanners = banners.length

  useEffect(() => {
    if (!autoPlay || totalBanners <= 1) {
      return
    }

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % totalBanners)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, totalBanners])

  if (!banners || banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  const previousSlide = () => {
    setCurrentIndex((current) =>
      current === 0 ? totalBanners - 1 : current - 1
    )
  }

  const nextSlide = () => {
    setCurrentIndex((current) => (current + 1) % totalBanners)
  }

  return (
    <section
      className="
        group relative
        h-[360px]
        w-full
        overflow-hidden
        rounded-[8px]
        bg-[var(--color-surface)]
      "
    >
      {/* Background image */}
      <img
        key={currentBanner.id}
        src={currentBanner.image}
        alt={currentBanner.title}
        className="
          absolute inset-0
          h-full w-full
          object-cover
          animate-[bannerFade_0.6s_ease-out]
        "
      />

      {/* Overall subtle overlay */}
      <div
        className="
          absolute inset-0
          bg-black/[0.08]
          dark:bg-black/[0.22]
        "
      />

      {/* Text gradient */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-black/70
          via-black/35
          to-transparent
        "
      />

      {/* Content */}
      <div
        key={`content-${currentBanner.id}`}
        className="
          relative z-10
          flex h-full
          max-w-[620px]
          flex-col
          justify-center
          px-7 py-8
          sm:px-10
          lg:px-14
          animate-[bannerContent_0.6s_ease-out]
        "
      >
        {/* Eyebrow */}
        <span
          className="
            mb-4
            text-[10px]
            font-medium
            uppercase
            tracking-[0.16em]
            text-white/65
          "
        >
          {currentBanner.eyebrow}
        </span>

        {/* Title */}
        <h2
          className="
            max-w-[540px]
            text-3xl
            font-medium
            leading-[1.05]
            tracking-[-0.045em]
            text-white
            sm:text-4xl
            lg:text-[46px]
          "
        >
          {currentBanner.title}
        </h2>

        {/* Description */}
        <p
          className="
            mt-5
            max-w-[440px]
            text-sm
            leading-6
            text-white/70
            sm:text-[14px]
          "
        >
          {currentBanner.description}
        </p>

        {/* CTA */}
        {currentBanner.buttonText && (
          <div className="mt-7">
            <a
              href={currentBanner.link || '#'}
              className="
                group/button
                inline-flex
                h-10
                items-center
                gap-2
                rounded-[5px]
                bg-white
                px-4
                text-[12px]
                font-medium
                text-[#20221f]
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:bg-white/90
                hover:shadow-md
              "
            >
              <span>
                {currentBanner.buttonText}
              </span>

              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-200
                  group-hover/button:translate-x-0.5
                "
              />
            </a>
          </div>
        )}
      </div>

      {/* Navigation */}
      {totalBanners > 1 && (
        <>
          {/* Previous */}
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous banner"
            className="
              absolute
              left-4
              top-1/2
              z-20
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/10
              text-white/75
              opacity-0
              backdrop-blur-sm
              transition-all
              duration-200
              hover:bg-black/25
              hover:text-white
              group-hover:opacity-100
              max-sm:opacity-100
            "
          >
            <ChevronLeft
              size={17}
              strokeWidth={1.6}
            />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next banner"
            className="
              absolute
              right-4
              top-1/2
              z-20
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/10
              text-white/75
              opacity-0
              backdrop-blur-sm
              transition-all
              duration-200
              hover:bg-black/25
              hover:text-white
              group-hover:opacity-100
              max-sm:opacity-100
            "
          >
            <ChevronRight
              size={17}
              strokeWidth={1.6}
            />
          </button>

          {/* Indicators */}
          <div
            className="
              absolute
              bottom-5
              left-7
              z-20
              flex
              items-center
              gap-1.5
              sm:left-10
              lg:left-14
            "
          >
            {banners.map((banner, index) => (
              <button
                key={banner.id ?? index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
                className="
                  flex
                  h-4
                  items-center
                "
              >
                <span
                  className={`
                    block
                    h-1
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      index === currentIndex
                        ? 'w-7 bg-white'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }
                  `}
                />
              </button>
            ))}
          </div>

          {/* Slide number */}
          <div
            className="
              absolute
              bottom-5
              right-7
              z-20
              text-[10px]
              font-medium
              tracking-[0.08em]
              text-white/55
              sm:right-10
            "
          >
            {String(currentIndex + 1).padStart(2, '0')}
            <span className="mx-1.5 text-white/25">
              /
            </span>
            {String(totalBanners).padStart(2, '0')}
          </div>
        </>
      )}
    </section>
  )
}

export default Banner

