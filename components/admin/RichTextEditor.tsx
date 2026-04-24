"use client";

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';

import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';

import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Minus,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Unlink, ImageIcon, 
  Highlighter, Undo, Redo, Maximize, Minimize
} from 'lucide-react';

const NavButton = ({ onClick, isActive, icon: Icon, disabled = false, title }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 sm:p-2 rounded-md transition-colors flex-shrink-0 ${
      isActive ? 'bg-[#1868A5] text-white' : 'text-slate-600 hover:bg-slate-200'
    } disabled:opacity-50`}
  >
    <Icon size={18} />
  </button>
);

const Divider = () => <div className="w-px h-6 bg-slate-300 mx-1 flex-shrink-0" />;

const MenuBar = ({ editor, isFullscreen, toggleFullscreen }: { editor: any, isFullscreen: boolean, toggleFullscreen: () => void }) => {
  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target?.result as string;
          editor.chain().focus().setImage({ src: base64Url }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 bg-slate-50 sticky top-0 z-10">
      {/* History */}
      <NavButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" />
      <NavButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" />
      <Divider />

      {/* Colors & Highlights */}
      <div className="flex items-center gap-1 relative" title="Text Color">
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-7 h-7 p-0 border-0 rounded cursor-pointer bg-transparent"
        />
      </div>
      <NavButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={Highlighter} title="Highlight Text" />
      <Divider />

      {/* Formatting */}
      <NavButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
      <NavButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
      <NavButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
      <NavButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
      <NavButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} icon={SuperscriptIcon} title="Superscript" />
      <NavButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} icon={SubscriptIcon} title="Subscript" />
      <Divider />

      {/* Headings */}
      <NavButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
      <NavButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
      <NavButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />
      <Divider />

      {/* Alignment */}
      <NavButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
      <NavButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
      <NavButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
      <NavButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Justify" />
      <Divider />

      {/* Lists & Blocks */}
      <NavButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
      <NavButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Ordered List" />
      <NavButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
      <NavButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} title="Code Block" />
      <NavButton onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={Minus} title="Horizontal Divider" />
      <Divider />

      {/* Media & Links */}
      <NavButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Add Link" />
      <NavButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} icon={Unlink} title="Remove Link" />
      <NavButton onClick={addImage} isActive={false} icon={ImageIcon} title="Add Image" />
      
      {/* Fullscreen Toggle */}
      <div className="ml-auto flex items-center pl-2">
        <NavButton 
          onClick={toggleFullscreen} 
          isActive={isFullscreen} 
          icon={isFullscreen ? Minimize : Maximize} 
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
        />
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInitialContentSet, setIsInitialContentSet] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-[#1868A5] underline cursor-pointer',
        },
      }),
      ImageResize.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full my-4',
        },
      } as any),
    ],
    content: '', 
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-slate max-w-none focus:outline-none p-6 ${isFullscreen ? 'min-h-[calc(100vh-60px)]' : 'min-h-[350px]'}`,
      },
    },
  });


  useEffect(() => {
    if (editor && content && !isInitialContentSet) {
      editor.commands.setContent(content);
      setIsInitialContentSet(true);
    }
  }, [content, editor, isInitialContentSet]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className={
      isFullscreen 
        ? "fixed inset-0 z-[9999] bg-white flex flex-col w-screen h-screen overflow-hidden" 
        : "border border-slate-300 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#1868A5] transition-all"
    }>
      <MenuBar editor={editor} isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} />
      <div className={isFullscreen ? "flex-1 overflow-y-auto bg-slate-100" : ""}>
        <div className={isFullscreen ? "max-w-4xl mx-auto bg-white min-h-full border-x border-slate-200 shadow-sm" : ""}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}