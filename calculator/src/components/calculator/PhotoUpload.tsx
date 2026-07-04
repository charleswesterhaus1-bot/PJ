// Photo documentation — before/after/damage shots attached to the saved
// estimate. Photos are compressed client-side (see utils/photo.ts) since
// everything lives in localStorage with no backend to offload to.

import { useRef } from 'react'
import { Camera, ImagePlus, X } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { fileToCompressedDataUrl } from '../../utils/photo'
import { useToast } from '../../hooks/useToast'
import type { EstimatePhoto, PhotoCategory } from '../../types'

interface PhotoUploadProps {
  photos: EstimatePhoto[]
  onAdd: (photo: EstimatePhoto) => void
  onRemove: (id: string) => void
}

const CATEGORIES: { id: PhotoCategory; label: string }[] = [
  { id: 'before', label: 'Before' },
  { id: 'after', label: 'After' },
  { id: 'damage', label: 'Damage' },
]

export function PhotoUpload({ photos, onAdd, onRemove }: PhotoUploadProps) {
  return (
    <GlassPanel className="p-6" delay={0.25}>
      <SectionHeading eyebrow="Step Eight" title="Photo Documentation" icon={<Camera className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <PhotoCategoryColumn
            key={category.id}
            category={category.id}
            label={category.label}
            photos={photos.filter((p) => p.category === category.id)}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </GlassPanel>
  )
}

function PhotoCategoryColumn({
  category,
  label,
  photos,
  onAdd,
  onRemove,
}: {
  category: PhotoCategory
  label: string
  photos: EstimatePhoto[]
  onAdd: (photo: EstimatePhoto) => void
  onRemove: (id: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    for (const file of Array.from(fileList)) {
      try {
        const dataUrl = await fileToCompressedDataUrl(file)
        onAdd({ id: crypto.randomUUID(), category, dataUrl, createdAt: new Date().toISOString() })
      } catch {
        showToast('Could not process that photo', 'error')
      }
    }
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
            <img src={photo.dataUrl} alt={`${label} photo`} className="h-full w-full object-cover" />
            <button
              onClick={() => onRemove(photo.id)}
              className="hh-focus-ring absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove photo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="hh-focus-ring flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/15 text-slate-500 transition hover:border-[#C9A227]/50 hover:text-[#E8CF83]"
          aria-label={`Add ${label.toLowerCase()} photo`}
        >
          <ImagePlus className="h-5 w-5" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
