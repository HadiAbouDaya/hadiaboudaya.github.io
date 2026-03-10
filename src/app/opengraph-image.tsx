import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const alt = "Hadi Abou Daya | AI Engineer & Consultant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photoData = await readFile(
    join(process.cwd(), "public", "Media", "branding", "headshot.png"),
  );
  const photoSrc = `data:image/png;base64,${photoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Cyan glow — top right */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: 80,
            width: 500,
            height: 500,
            borderRadius: 250,
            background:
              "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Blue glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -100,
            width: 420,
            height: 420,
            borderRadius: 210,
            background:
              "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "40px 56px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left — text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              paddingRight: 40,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Hadi Abou Daya
            </div>

            {/* Accent bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 32,
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 4,
                  background: "#22d3ee",
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  width: 24,
                  height: 4,
                  background: "rgba(34,211,238,0.4)",
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 4,
                  background: "rgba(34,211,238,0.15)",
                  borderRadius: 2,
                }}
              />
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 500,
                color: "#22d3ee",
                marginTop: 28,
              }}
            >
              AI/ML Engineer &amp; Consultant
            </div>

            <div
              style={{
                fontSize: 24,
                color: "#94a3b8",
                marginTop: 16,
                lineHeight: 1.5,
              }}
            >
              Building intelligent systems from edge to cloud
            </div>

            {/* URL */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 40,
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  background: "#22d3ee",
                }}
              />
              <div
                style={{
                  fontSize: 28,
                  color: "#64748b",
                  letterSpacing: "0.03em",
                }}
              >
                hadi.aboudaya.com
              </div>
            </div>
          </div>

          {/* Right — photo ring */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              width: 420,
              height: 420,
              borderRadius: 210,
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(59,130,246,0.08) 100%)",
              border: "3px solid rgba(34,211,238,0.2)",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={photoSrc}
              width={610}
              height={538}
              style={{ borderRadius: 0, marginTop: -25 }}
            />
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 4,
            background:
              "linear-gradient(90deg, transparent 0%, #22d3ee 30%, #3b82f6 70%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
