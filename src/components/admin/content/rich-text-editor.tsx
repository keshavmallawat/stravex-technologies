"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  TextB,
  TextItalic,
  ListBullets,
  ListNumbers,
  Quotes,
  LinkSimple,
  ImageSquare,
  ArrowUUpLeft,
  ArrowUUpRight,
} from "@phosphor-icons/react";

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center border transition-colors ${
        active ? "border-brand bg-brand-soft text-brand" : "border-transparent text-ink/55 hover:border-ink/15"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the article body…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] max-w-none px-4 py-3 text-sm leading-relaxed text-ink focus:outline-none [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-brand/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink/60 [&_a]:text-brand [&_a]:underline [&_img]:my-2 [&_img]:max-w-full",
      },
    },
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt("Link URL");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("Image URL");
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="border border-ink/15 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 px-2 py-1.5">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <TextB size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalic size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quotes size={15} />
        </ToolbarButton>
        <ToolbarButton title="Link" onClick={addLink}>
          <LinkSimple size={15} />
        </ToolbarButton>
        <ToolbarButton title="Image" onClick={addImage}>
          <ImageSquare size={15} />
        </ToolbarButton>
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <ArrowUUpLeft size={15} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <ArrowUUpRight size={15} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
