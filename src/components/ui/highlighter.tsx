import React from 'react'
import { Highlighter, SelectionProvider } from 'react-selection-highlighter'


type Props = {
  text: string;
};

const SimpleHighlighter = ({ text }: Props) => {
  return (
    <SelectionProvider>
      <Highlighter htmlString={text} />
    </SelectionProvider>
  )
}
export default SimpleHighlighter
