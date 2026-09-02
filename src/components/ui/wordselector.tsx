import { Box, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  text: string;
};

export default function WordSelector({ text }: Props) {
  const words = text.split(" ");

  const [selectedWords, setSelectedWords] = useState<number[]>([]);

  function handleClick(index: number) {
    if (selectedWords.includes(index)) {
      setSelectedWords(
        selectedWords.filter((selected) => selected !== index)
      );
    } else {
      setSelectedWords([...selectedWords, index]);
    }
  }

  return (
    <div>
      {/* Text */}
      <div>
        {words.map((word, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              backgroundColor: selectedWords.includes(index)
                ? "yellow"
                : "transparent",
              border: "none",
              padding: "2px",
              cursor: "pointer",
            }}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Selected words */}
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "0px",
          padding: "16px",
          marginTop: "20px",
        }}
      >
        <h3>Selected words:</h3>

        {selectedWords.map((index) => (
          <div key={index}>{words[index]}</div>
        ))}
        </Box>
    </div>
  );
}
