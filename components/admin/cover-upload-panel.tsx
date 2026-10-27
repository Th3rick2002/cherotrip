"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CoverPicker } from "@/components/admin/cover-picker"
import { COVER_DEFAULT_FOLDER, COVER_FOLDER_PATTERN } from "@/lib/admin/covers"

export function CoverUploadPanel() {
  const router = useRouter()
  const [folder, setFolder] = useState("")
  const [pickerKey, setPickerKey] = useState(0)
  const trimmed = folder.trim()
  const folderValid = trimmed === "" || COVER_FOLDER_PATTERN.test(trimmed)

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="cover-folder" className="text-sm font-medium text-foreground">
          Slug del lugar o evento <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="cover-folder"
          value={folder}
          onChange={(event) => setFolder(event.target.value.toLowerCase())}
          placeholder={COVER_DEFAULT_FOLDER}
          aria-invalid={!folderValid}
          aria-describedby="cover-folder-hint"
          className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
        />
        <p
          id="cover-folder-hint"
          className={`text-xs ${folderValid ? "text-muted-foreground" : "text-destructive"}`}
        >
          {folderValid
            ? "Agrupa las imágenes por listing. Sin slug van a «general»."
            : "Usa minúsculas, números y guiones (p. ej. playa-el-cuco)."}
        </p>
      </div>

      <CoverPicker
        key={pickerKey}
        folder={trimmed || undefined}
        label="Nueva imagen"
        disabled={!folderValid}
        onUploaded={() => {
          setPickerKey((key) => key + 1)
          router.refresh()
        }}
      />
    </div>
  )
}
