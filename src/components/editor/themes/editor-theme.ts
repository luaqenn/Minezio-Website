import { EditorThemeClasses } from "lexical"

import "./editor-theme.css"

export const editorTheme: EditorThemeClasses = {
  ltr: "text-left",
  rtl: "text-right",
  heading: {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 dark:text-white",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-gray-900 dark:text-white border-gray-200 dark:border-white/10",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight text-gray-900 dark:text-white",
    h5: "scroll-m-20 text-lg font-semibold tracking-tight text-gray-900 dark:text-white",
    h6: "scroll-m-20 text-base font-semibold tracking-tight text-gray-900 dark:text-white",
  },
  paragraph: "leading-7 text-gray-800 dark:text-gray-200 [&:not(:first-child)]:mt-6",
  quote: "mt-6 border-l-2 pl-6 italic border-blue-400 dark:border-blue-600 text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20",
  link: "text-blue-600 dark:text-blue-400 hover:underline hover:cursor-pointer",
  list: {
    checklist: "relative",
    listitem: "mx-8 text-gray-800 dark:text-gray-200",
    listitemChecked:
      'relative mx-2 px-6 list-none outline-none line-through before:content-[" "] before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:bg-cover before:absolute before:border before:border-primary before:rounded before:bg-primary before:bg-no-repeat after:content-[" "] after:cursor-pointer after:border-white after:border-solid after:absolute after:block after:top-[6px] after:w-[3px] after:left-[7px] after:right-[7px] after:h-[6px] after:rotate-45 after:border-r-2 after:border-b-2 after:border-l-0 after:border-t-0',
    listitemUnchecked:
      'relative mx-2 px-6 list-none outline-none before:content-[" "] before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:bg-cover before:absolute before:border before:border-primary before:rounded',
    nested: {
      listitem: "list-none before:hidden after:hidden",
    },
    ol: "my-6 ml-6 list-decimal [&>li]:mt-2 text-gray-800 dark:text-gray-200",
    olDepth: [
      "list-outside !list-decimal",
      "list-outside !list-[upper-roman]",
      "list-outside !list-[lower-roman]",
      "list-outside !list-[upper-alpha]",
      "list-outside !list-[lower-alpha]",
    ],
    ul: "m-0 p-0 list-outside text-gray-800 dark:text-gray-200",
  },
  hashtag: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 rounded-md px-1",
  text: {
    bold: "font-bold text-gray-900 dark:text-white",
    code: "bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-pink-600 dark:text-pink-400",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "sub",
    superscript: "sup",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
  image: "relative inline-block user-select-none cursor-default editor-image",
  inlineImage:
    "relative inline-block user-select-none cursor-default inline-editor-image",
  keyword: "text-purple-900 dark:text-purple-300 font-bold",
  code: "EditorTheme__code bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700",
  codeHighlight: {
    atrule: "EditorTheme__tokenAttr",
    attr: "EditorTheme__tokenAttr",
    boolean: "EditorTheme__tokenProperty",
    builtin: "EditorTheme__tokenSelector",
    cdata: "EditorTheme__tokenComment",
    char: "EditorTheme__tokenSelector",
    class: "EditorTheme__tokenFunction",
    "class-name": "EditorTheme__tokenFunction",
    comment: "EditorTheme__tokenComment",
    constant: "EditorTheme__tokenProperty",
    deleted: "EditorTheme__tokenProperty",
    doctype: "EditorTheme__tokenComment",
    entity: "EditorTheme__tokenOperator",
    function: "EditorTheme__tokenFunction",
    important: "EditorTheme__tokenVariable",
    inserted: "EditorTheme__tokenSelector",
    keyword: "EditorTheme__tokenAttr",
    namespace: "EditorTheme__tokenVariable",
    number: "EditorTheme__tokenProperty",
    operator: "EditorTheme__tokenOperator",
    prolog: "EditorTheme__tokenComment",
    property: "EditorTheme__tokenProperty",
    punctuation: "EditorTheme__tokenPunctuation",
    regex: "EditorTheme__tokenVariable",
    selector: "EditorTheme__tokenSelector",
    string: "EditorTheme__tokenSelector",
    symbol: "EditorTheme__tokenProperty",
    tag: "EditorTheme__tokenProperty",
    url: "EditorTheme__tokenOperator",
    variable: "EditorTheme__tokenVariable",
  },
  characterLimit: "!bg-destructive/50 dark:!bg-destructive/30",
  table: "EditorTheme__table w-fit overflow-scroll border-collapse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
  tableCell:
    'EditorTheme__tableCell w-24 relative border px-4 py-2 text-left text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
  tableCellActionButton:
    "EditorTheme__tableCellActionButton bg-background block border-0 rounded-2xl w-5 h-5 text-foreground cursor-pointer",
  tableCellActionButtonContainer:
    "EditorTheme__tableCellActionButtonContainer block right-1 top-1.5 absolute z-10 w-5 h-5",
  tableCellEditing: "EditorTheme__tableCellEditing rounded-sm shadow-sm",
  tableCellHeader:
    "EditorTheme__tableCellHeader bg-muted border px-4 py-2 text-left font-bold text-gray-900 dark:text-white border-gray-200 dark:border-gray-700",
  tableCellPrimarySelected:
    "EditorTheme__tableCellPrimarySelected border border-primary border-solid block h-[calc(100%-2px)] w-[calc(100%-2px)] absolute -left-[1px] -top-[1px] z-10 ",
  tableCellResizer:
    "EditorTheme__tableCellResizer absolute -right-1 h-full w-2 cursor-ew-resize z-10 top-0",
  tableCellSelected: "EditorTheme__tableCellSelected bg-muted dark:bg-gray-800",
  tableCellSortedIndicator:
    "EditorTheme__tableCellSortedIndicator block opacity-50 absolute bottom-0 left-0 w-full h-1 bg-muted dark:bg-gray-800",
  tableResizeRuler:
    "EditorTheme__tableCellResizeRuler block absolute w-[1px] h-full bg-primary top-0",
  tableRowStriping:
    "EditorTheme__tableRowStriping m-0 border-t p-0 even:bg-muted dark:even:bg-gray-800",
  tableSelected: "EditorTheme__tableSelected ring-2 ring-primary ring-offset-2",
  tableSelection: "EditorTheme__tableSelection bg-transparent",
  layoutItem: "border border-dashed px-4 py-2 border-gray-200 dark:border-gray-700",
  layoutContainer: "grid gap-2.5 my-2.5 mx-0",
  autocomplete: "text-muted-foreground dark:text-gray-400",
  blockCursor: "",
  embedBlock: {
    base: "user-select-none",
    focus: "ring-2 ring-primary ring-offset-2",
  },
  hr: 'p-0.5 border-none my-1 mx-0 cursor-pointer after:content-[" "] after:block after:h-0.5 after:bg-muted dark:after:bg-gray-800 selected:ring-2 selected:ring-primary selected:ring-offset-2 selected:user-select-none',
  indent: "[--lexical-indent-base-value:40px]",
  mark: "",
  markOverlap: "",
}
