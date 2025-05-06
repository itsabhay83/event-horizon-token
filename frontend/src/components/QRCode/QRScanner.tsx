
import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (data: string) => void;
}

const QRScanner = ({ onScan }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startScanner = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanFrame);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const scanFrame = () => {
    if (!isScanning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      
      if (code) {
        onScan(code.data);
        stopScanner();
        return;
      }
    }
    
    requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${isScanning ? 'block' : 'hidden'}`}>
        <video 
          ref={videoRef} 
          className="rounded-lg shadow-md" 
          style={{ maxWidth: '100%', maxHeight: '70vh' }}
        />
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 invisible"
        />
        <div className="absolute inset-0 border-2 border-zkpop-indigo rounded-lg pointer-events-none"></div>
      </div>

      <Button 
        onClick={isScanning ? stopScanner : startScanner} 
        className="mt-4 flex items-center"
        variant={isScanning ? "destructive" : "default"}
      >
        <QrCode size={18} className="mr-2" />
        {isScanning ? "Cancel Scanning" : "Scan QR Code"}
      </Button>
    </div>
  );
};

export default QRScanner;
