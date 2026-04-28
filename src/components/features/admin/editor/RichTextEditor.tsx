"use client"

import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div className="rounded-md border border-border bg-background p-2">
      <CKEditor
        // CKEditor package types are currently mismatched with this project setup.
        // Runtime works correctly; this cast avoids a false-negative type error.
        // @ts-expect-error
        editor={ClassicEditor}
        data={value}
        onChange={(_, editor) => {
          onChange(editor.getData())
        }}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
        }}
      />
    </div>
  )
}
