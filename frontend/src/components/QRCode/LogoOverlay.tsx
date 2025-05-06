
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Image, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { getFileDataUrl } from './qrcode-utils';

interface LogoOverlayProps {
  logo: string | null;
  logoSize: number;
  maxSize: number;
  onLogoChange: (logo: string | null) => void;
  onLogoSizeChange: (size: number) => void;
}

const LogoOverlay = ({
  logo,
  logoSize,
  maxSize,
  onLogoChange,
  onLogoSizeChange
}: LogoOverlayProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image is too large. Maximum size is 2MB.');
      return;
    }

    try {
      const dataUrl = await getFileDataUrl(file);
      onLogoChange(dataUrl);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    }
    
    // Reset file input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeLogo = () => {
    onLogoChange(null);
    toast.success('Logo removed');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image is too large. Maximum size is 2MB.');
      return;
    }

    try {
      const dataUrl = await getFileDataUrl(file);
      onLogoChange(dataUrl);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6
          flex flex-col items-center justify-center text-center
          transition-colors duration-200
          ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/20 hover:border-primary/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {logo ? (
          <div className="space-y-4 w-full">
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Logo overlay" 
                className="max-w-[120px] max-h-[120px] rounded-md shadow-sm"
              />
            </div>
            <Button 
              variant="destructive" 
              onClick={removeLogo} 
              className="w-full"
            >
              <Trash2 size={16} className="mr-2" /> Remove Logo
            </Button>
          </div>
        ) : (
          <>
            <Image className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG or JPG (max. 2MB)
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              Choose Logo
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload logo"
            />
          </>
        )}
      </div>
      
      {logo && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="logo-size">Logo Size</Label>
            <span className="text-sm text-muted-foreground">{logoSize}px</span>
          </div>
          <Slider
            id="logo-size"
            min={20}
            max={Math.min(maxSize / 2, 100)}
            step={1}
            value={[logoSize]}
            onValueChange={(value) => onLogoSizeChange(value[0])}
            aria-label="Logo size"
          />
        </div>
      )}
    </div>
  );
};

export default LogoOverlay;
