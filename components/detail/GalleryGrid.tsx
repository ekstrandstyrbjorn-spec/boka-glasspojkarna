import Image from 'next/image'

export function GalleryGrid({ images }: { images: string[] }) {
  if (images.length === 0) return null
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Galleri</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-cream)]">
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
