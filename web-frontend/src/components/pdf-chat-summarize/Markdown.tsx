import ReactMarkdown from "react-markdown"

type Props = {
  markdown: string
}

function Markdown({ markdown }: Props) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
          code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-2">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-3 italic text-gray-700 mb-2">{children}</blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
