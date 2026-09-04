import { Box } from "@mui/material";

type Props = {
  sentences: string[];
  height: number;
  setHeight: (height: number) => void;
};
export default function SelectedSentencesBox({
  sentences,
  height,
  setHeight,
}: Props) {
    function handleResize(event: React.PointerEvent) {
    const startY = event.clientY;
    const startHeight = height;

    function move(event: PointerEvent) {
      const newHeight = startHeight + (startY - event.clientY);

      setHeight(
        Math.min(
          Math.max(newHeight, 80),
          window.innerHeight * 0.7
        )
      );
    }
      function stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        backgroundColor: "white",
        borderTop: "1px solid #ccc",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {/* Drag handle */}
      <Box
        onPointerDown={handleResize}
        sx={{
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "ns-resize",
          touchAction: "none",
        }}
      >
        <Box
          sx={{
            width: "40px",
            height: "4px",
            borderRadius: "4px",
            backgroundColor: "#aaa",
          }}
        />
      </Box>

      <Box sx={{ px: 2 }}>
        <h3 style={{ margin: "0 0 8px" }}>
          Selected sentences:
        </h3>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: "8px",
            overflowY: "auto",
            maxHeight: `calc(${height}px - 60px)`,
          }}
        >
          {sentences.map((sentence, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#f0f0f0",
                padding: "6px 10px",
                borderRadius: "4px",
              }}
            >
              {sentence}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
