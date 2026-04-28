"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ImagePlus, ChevronLeft, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"

const RichTextEditor = dynamic(
  () => import("@/components/features/admin/editor/RichTextEditor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-md bg-muted" />,
  }
)

interface AdminContentFormProps {
  entity: "berita" | "kategori" | "promo" | "users"
  mode: "create" | "edit"
  recordId?: string
  entityLabel: string
  submitLabel: string
  cancelHref: string
  initialData?: {
    title: string
    content: string
  }
  initialImageUrls?: string[]
}

export function AdminContentForm({
  entity,
  mode,
  recordId,
  entityLabel,
  submitLabel,
  cancelHref,
  initialData,
  initialImageUrls,
}: AdminContentFormProps) {
  const supabase = React.useMemo(() => createClient(), [])
  const router = useRouter()
  const [title, setTitle] = React.useState(initialData?.title ?? "")
  const [content, setContent] = React.useState(initialData?.content ?? "")
  const [imageUrls, setImageUrls] = React.useState<string[]>(initialImageUrls ?? [])
  const [activeImageIndex, setActiveImageIndex] = React.useState(0)
  const [isReadingImages, setIsReadingImages] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ""))
      reader.onerror = () => reject(new Error(`Gagal membaca file ${file.name}`))
      reader.readAsDataURL(file)
    })

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message
    if (typeof error === "object" && error !== null) {
      const message = "message" in error ? String(error.message ?? "") : ""
      const details = "details" in error ? String(error.details ?? "") : ""
      const hint = "hint" in error ? String(error.hint ?? "") : ""
      return [message, details, hint].filter(Boolean).join(" | ") || "Terjadi kesalahan saat menyimpan data"
    }
    return "Terjadi kesalahan saat menyimpan data"
  }

  const uploadDataUrlToStorage = async (dataUrl: string, folder: "berita" | "promo") => {
    const matchedMime = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/)
    if (!matchedMime) {
      throw new Error("Format gambar tidak valid")
    }

    const mimeType = matchedMime[1]
    const extension = mimeType.split("/")[1] || "jpg"
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`
    const fileBuffer = await fetch(dataUrl).then((response) => response.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(fileName, fileBuffer, { contentType: mimeType, upsert: false })

    if (uploadError) {
      throw new Error(
        `Upload gambar gagal. Pastikan bucket Storage "news-images" sudah dibuat dan punya policy upload. (${uploadError.message})`
      )
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(fileName)

    return publicUrl
  }

  const resolvePersistedImageUrls = async (urls: string[], folder: "berita" | "promo") => {
    const persistedUrls: string[] = []
    for (const url of urls) {
      if (url.startsWith("data:image/")) {
        const uploadedUrl = await uploadDataUrlToStorage(url, folder)
        persistedUrls.push(uploadedUrl)
        continue
      }
      persistedUrls.push(url)
    }
    return persistedUrls
  }

  const handleImageImport = async (files: FileList | null, allowMultiple: boolean) => {
    if (!files || files.length === 0) return

    setIsReadingImages(true)
    try {
      const importedUrls = (await Promise.all(Array.from(files).map(readFileAsDataUrl))).filter(Boolean)
      setImageUrls((prev) => {
        const nextImages = allowMultiple ? [...prev, ...importedUrls] : importedUrls.slice(0, 1)
        setActiveImageIndex(0)
        return nextImages
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengimpor gambar"
      toast.error(message)
    } finally {
      setIsReadingImages(false)
    }
  }

  const removeImageAt = (index: number) => {
    setImageUrls((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const goToPrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1))
  }

  const goToNextImage = () => {
    setActiveImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      if (entity === "berita") {
        if (imageUrls.length === 0) {
          throw new Error("Minimal satu gambar berita harus diimpor")
        }

        const persistedImageUrls = await resolvePersistedImageUrls(imageUrls, "berita")

        if (mode === "create") {
          const { data: insertedPost, error } = await supabase
            .from("Post")
            .insert({ title, content, status: "DRAFT" })
            .select("id")
            .single()
          if (error) throw error

          const { error: imageInsertError } = await supabase
            .from("Image")
            .insert(persistedImageUrls.map((url) => ({ postId: insertedPost.id, url })))
          if (imageInsertError) throw imageInsertError
        } else {
          const { error } = await supabase.from("Post").update({ title, content }).eq("id", recordId ?? "")
          if (error) throw error

          if (recordId) {
            const { error: deleteImageError } = await supabase.from("Image").delete().eq("postId", recordId)
            if (deleteImageError) throw deleteImageError

            const { error: imageInsertError } = await supabase
              .from("Image")
              .insert(persistedImageUrls.map((url) => ({ postId: recordId, url })))
            if (imageInsertError) throw imageInsertError
          }
        }
      }

      if (entity === "promo") {
        if (imageUrls.length === 0) {
          throw new Error("Gambar promo wajib diisi")
        }

        const [promoImageUrl] = await resolvePersistedImageUrls([imageUrls[0]], "promo")
        const promoTitle = title.trim() || initialData?.title?.trim() || "Promo Banner"
        const query =
          mode === "create"
            ? supabase.from("Promo").insert({
                title: promoTitle,
                imageUrl: promoImageUrl,
                isActive: true,
              })
            : supabase
                .from("Promo")
                .update({
                  title: promoTitle,
                  imageUrl: promoImageUrl,
                })
                .eq("id", recordId ?? "")
        const { error } = await query
        if (error) throw error
      }

      if (entity === "kategori") {
        const query =
          mode === "create"
            ? supabase.from("Category").insert({ name: title, slug: slugify(title) })
            : supabase
                .from("Category")
                .update({ name: title, slug: slugify(title) })
                .eq("id", recordId ?? "")
        const { error } = await query
        if (error) throw error
      }

      if (entity === "users") {
        const query =
          mode === "create"
            ? supabase.from("User").insert({ name: title, email: content, role: "USER" })
            : supabase.from("User").update({ name: title }).eq("id", recordId ?? "")
        const { error } = await query
        if (error) throw error
      }

      toast.success(`${entityLabel} berhasil diperbarui`)
      router.push(cancelHref)
      router.refresh()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      {(entity === "berita" || entity === "kategori" || entity === "users") && (
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Judul {entityLabel}</label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={`Masukkan judul ${entityLabel.toLowerCase()}`}
            required
          />
        </div>
      )}

      {entity === "berita" && (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Konten Berita</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          <div className="space-y-4 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">Gambar Berita</p>
                <p className="text-xs text-muted-foreground">Bisa impor lebih dari 1 gambar, nanti tampil sebagai slide.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
                <ImagePlus className="h-4 w-4" />
                {isReadingImages ? "Memproses..." : "Impor Gambar"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => handleImageImport(event.target.files, true)}
                  disabled={isReadingImages}
                />
              </label>
            </div>

            {imageUrls.length > 0 && (
              <div className="space-y-3">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
                  <img src={imageUrls[activeImageIndex]} alt="Preview slide berita" className="h-full w-full object-cover" />
                  {imageUrls.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goToPrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={goToNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative">
                      <button
                        type="button"
                        className={`h-14 w-20 overflow-hidden rounded-md border ${
                          index === activeImageIndex ? "border-blue-600" : "border-border"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={url} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImageAt(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
                        aria-label={`Hapus gambar ${index + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {entity === "promo" && (
        <div className="space-y-4 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Gambar Promo Banner</p>
              <p className="text-xs text-muted-foreground">Promo banner sekarang hanya butuh satu gambar.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
              <ImagePlus className="h-4 w-4" />
              {isReadingImages ? "Memproses..." : "Impor Gambar"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImageImport(event.target.files, false)}
                disabled={isReadingImages}
              />
            </label>
          </div>

          {imageUrls[0] ? (
            <div className="relative aspect-[16/6] overflow-hidden rounded-lg border border-border bg-muted">
              <img src={imageUrls[0]} alt="Preview promo" className="h-full w-full object-cover" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada gambar dipilih.</p>
          )}
        </div>
      )}

      {(entity === "kategori" || entity === "users") && (
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Konten {entityLabel}</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(cancelHref)} disabled={isSaving}>
          Batal
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
