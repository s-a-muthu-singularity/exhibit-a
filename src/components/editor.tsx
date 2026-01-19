'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Heading1, Heading2, ImageIcon, List, Quote } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
    const supabase = createClient()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-lg max-w-none focus:outline-none min-h-[300px]',
            },
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    const addImage = async () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async () => {
            if (input.files?.length) {
                const file = input.files[0]
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('article-images')
                    .upload(filePath, file)

                if (uploadError) {
                    console.error('Error uploading image:', uploadError)
                    return
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('article-images')
                    .getPublicUrl(filePath)

                editor.chain().focus().setImage({ src: publicUrl }).run()
            }
        }
        input.click()
    }

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black">
            <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                    type="button"
                >
                    <Bold className="w-5 h-5" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                    type="button"
                >
                    <Italic className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                    type="button"
                >
                    <Heading1 className="w-5 h-5" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                    type="button"
                >
                    <Heading2 className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                    type="button"
                >
                    <List className="w-5 h-5" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                    type="button"
                >
                    <Quote className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                <button
                    onClick={addImage}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    type="button"
                >
                    <ImageIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
