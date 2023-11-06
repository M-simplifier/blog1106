import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
    h1: "h2",
    h2: "h3",
    h3: "h4",
    h4: "h5",
    h5: "h6",
    h6: "h6",
    code(props: any) {
        const { children, className, node, ...rest } = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
            <SyntaxHighlighter
                {...rest}
                style={atomDark}
                language={match[1]}
                PreTag="div"
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code {...rest} className={className}>
                {children}
            </code>
        )
    }
}

export default function Markdown({ children }: { children: string }) {
    return <ReactMarkdown components={components as any} remarkPlugins={[remarkGfm]} className="markdown">{children}</ReactMarkdown>
}