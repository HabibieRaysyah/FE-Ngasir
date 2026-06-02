import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export default function QrScannerComp({ barcode }) {
  const handleScan = (detectedCodes) => {
    console.log("Detected codes:", detectedCodes);

    detectedCodes.forEach((code) => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);


      barcode(code.rawValue);
    });
  };

  return (
    <Scanner
      onScan={(detectedCodes) => handleScan(detectedCodes)}
      constraints={{
        facingMode: "environment", // Use rear camera
        aspectRatio: 1, // Square aspect ratio
        // Advanced constraints
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      }}
      styles={{
        finderBorder: {
          color: "#3d59c7",
          stokeWidth: "5px",
        },
      }}
      className="rounded"
    />
  );
}
