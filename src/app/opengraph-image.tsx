import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#F7F6F2",
          color: "#111315",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 160,
            letterSpacing: -6,
            lineHeight: 1,
          }}
        >
          GEEK
        </div>
        <div style={{ fontSize: 34, marginTop: 24, color: "#62645F" }}>
          Aashirwad Sharma — I tinker and write about AI, Computer Science,
          Finance and numbers.
        </div>
      </div>
    ),
    { ...size },
  );
}
