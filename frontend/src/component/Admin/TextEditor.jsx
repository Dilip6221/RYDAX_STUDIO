import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const TextEditor = ({ value, onChange }) => {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link,
      Image
    ],
    content: value || "<p>Write your blog content here...</p>",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && value) {
      const currentHTML = editor.getHTML();
      if (currentHTML !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = prompt("Enter Image URL:");
    if(url) editor.chain().focus().setImage({ src:url }).run();
  };

  return (
    <div className="text-white p-2 p-md-3 rounded">
      {/* Toolbar */}
      <div className="mb-3 d-flex flex-wrap gap-1 p-2 rounded bg-black bg-opacity-50 border border-secondary">
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <b>B</b>
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <i>I</i>
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={addImage}>
          <i className="bi bi-image me-1"></i>Image
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary text-light px-2 py-1" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          &lt;/&gt; Code
        </button>
        <button type="button" className="btn btn-sm btn-outline-danger px-2 py-1 ms-auto" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          Clear
        </button>
      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        style={{
          minHeight: "260px",
          background: "#0c0c0c",
          padding: "14px",
          borderRadius: "6px",
          border: "1px solid #333",
          color: "#fff"
        }} 
      />
    </div>
  );
};

export default TextEditor;
