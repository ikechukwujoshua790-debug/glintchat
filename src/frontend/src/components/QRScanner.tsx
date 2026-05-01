/**
 * QR Scanner component using the browser BarcodeDetector API + camera stream.
 * Falls back gracefully on unsupported browsers.
 */
import { Camera, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
    }
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
      }

      // Use BarcodeDetector if available
      if ("BarcodeDetector" in window) {
        const detector = new (
          window as unknown as {
            BarcodeDetector: new (opts: { formats: string[] }) => {
              detect: (
                src: HTMLVideoElement,
              ) => Promise<{ rawValue: string }[]>;
            };
          }
        ).BarcodeDetector({ formats: ["qr_code"] });

        const scan = async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(scan);
            return;
          }
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              stopCamera();
              onScan(barcodes[0].rawValue);
              return;
            }
          } catch {
            // ignore detection errors
          }
          animFrameRef.current = requestAnimationFrame(scan);
        };
        animFrameRef.current = requestAnimationFrame(scan);
      } else {
        setError(
          "Your browser doesn't support QR scanning. Try Chrome or Safari on a modern device.",
        );
      }
    } catch {
      setError(
        "Camera access denied. Please allow camera permissions to scan QR codes.",
      );
    }
  }, [onScan, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div
      data-ocid="qr_scanner.dialog"
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">
              Scan QR Code
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Point your camera at a GlintChat QR code
            </p>
          </div>
          <button
            type="button"
            data-ocid="qr_scanner.close_button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close scanner"
          >
            <X size={16} />
          </button>
        </div>

        {/* Camera viewfinder */}
        <div className="relative bg-card rounded-2xl overflow-hidden aspect-square border border-border/50">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            aria-label="Camera viewfinder"
          />

          {/* Scanning overlay */}
          {scanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Corner brackets */}
              <div className="relative w-48 h-48">
                {/* Top-left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                {/* Top-right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                {/* Bottom-left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                {/* Bottom-right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                {/* Scan line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-primary/70 animate-bounce"
                  style={{ animationDuration: "2s" }}
                />
              </div>
            </div>
          )}

          {/* Error / no camera state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3 bg-card/90">
              <Camera size={32} className="text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">
                {error}
              </p>
              <Button
                data-ocid="qr_scanner.retry_button"
                size="sm"
                variant="outline"
                onClick={startCamera}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Scanning automatically when QR code is detected
        </p>
      </div>
    </div>
  );
}
