
import { useRef, useEffect } from 'react';
import QRCodeLib from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QRGeneratorProps {
  value: string;
  size?: number;
}

const QRGenerator = ({ value, size = 256 }: QRGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCodeLib.toCanvas(
      canvasRef.current, 
      value, 
      {
        width: size,
        margin: 2,
        color: {
          dark: '#6366f1', // Indigo color
          light: '#FFFFFF'
        }
      },
      (error) => {
        if (error) console.error('Error generating QR code:', error);
      }
    );
  }, [value, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'zkpop-event-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <canvas ref={canvasRef} />
      </div>
      <Button 
        onClick={handleDownload} 
        className="mt-4 flex items-center"
        variant="outline"
      >
        <Download size={18} className="mr-2" />
        Download QR Code
      </Button>
    </div>
  );
};

export default QRGenerator;
