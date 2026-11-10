import Markdown from 'react-markdown';

export function RichText({ text }: { text: string }) {
  return <Markdown skipHtml components={{
    h1: ({ children }) => <h3>{children}</h3>,
    h2: ({ children }) => <h3>{children}</h3>,
    a: ({ href, children }) => <a href={href} rel="noopener noreferrer">{children}</a>,
  }}>{text}</Markdown>;
}
