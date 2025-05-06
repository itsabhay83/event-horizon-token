
import { useState, useRef, useEffect } from 'react';
import QRCodeLib from 'qrcode';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Download, Copy, CheckCircle, Image, Settings, Save, Upload, Link, FileText, Wallet } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { validateQRValue, QRTypes } from './qrcode-utils';
import ColorPicker from './ColorPicker';
import LogoOverlay from './LogoOverlay';
import QRGradientPicker from './QRGradientPicker';
import { Separator } from '@/components/ui/separator';

export interface QRCodeSettings {
  value: string;
  size: number;
  margin: number;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  logo?: string | null;
  logoSize: number;
  useGradient: boolean;
  gradientType: 'linear' | 'radial';
  gradientColors: string[];
  gradientAngle: number;
  qrType: QRTypes;
  borderRadius: number;
}

const defaultSettings: QRCodeSettings = {
  value: '',
  size: 256,
  margin: 2,
  foregroundColor: '#6366f1',
  backgroundColor: '#FFFFFF',
  errorCorrectionLevel: 'M',
  logo: null,
  logoSize: 60,
  useGradient: false,
  gradientType: 'linear',
  gradientColors: ['#6366f1', '#8b5cf6'],
  gradientAngle: 45,
  qrType: 'text',
  borderRadius: 8,
};

const AdvancedQRGenerator = () => {
  const [settings, setSettings] = useState<QRCodeSettings>(defaultSettings);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  const savedConfigs = useRef<Record<string, QRCodeSettings>>(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('qrConfigs') || '{}') : {}
  );

  // Generate QR code when settings change
  useEffect(() => {
    if (!settings.value) return;
    generateQRCode();
  }, [
    settings.value, 
    settings.size, 
    settings.margin, 
    settings.foregroundColor, 
    settings.backgroundColor,
    settings.errorCorrectionLevel,
    settings.useGradient,
    settings.gradientType,
    settings.gradientColors,
    settings.gradientAngle,
    settings.borderRadius,
    isDarkMode
  ]);

  // Apply logo overlay after QR code is generated
  useEffect(() => {
    if (qrDataUrl && settings.logo && canvasRef.current) {
      applyLogoOverlay();
    }
  }, [qrDataUrl, settings.logo, settings.logoSize]);

  const validateInput = () => {
    const validationResult = validateQRValue(settings.value, settings.qrType);
    if (!validationResult.valid) {
      setError(validationResult.message);
      return false;
    }
    setError(null);
    return true;
  };

  const generateQRCode = async () => {
    if (!validateInput()) return;
    
    setIsGenerating(true);
    
    try {
      if (!canvasRef.current) return;
      
      const qrOptions: QRCodeLib.QRCodeRenderersOptions = {
        width: settings.size,
        margin: settings.margin,
        color: {
          dark: settings.foregroundColor,
          light: settings.backgroundColor
        },
        errorCorrectionLevel: settings.errorCorrectionLevel as QRCodeLib.QRCodeErrorCorrectionLevel
      };

      await QRCodeLib.toCanvas(canvasRef.current, settings.value, qrOptions);
      
      // Apply border radius
      if (settings.borderRadius > 0) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Save current canvas
          const imgData = ctx.getImageData(0, 0, settings.size, settings.size);
          // Clear canvas
          ctx.clearRect(0, 0, settings.size, settings.size);
          // Add rounded corners
          ctx.beginPath();
          ctx.moveTo(settings.borderRadius, 0);
          ctx.lineTo(settings.size - settings.borderRadius, 0);
          ctx.quadraticCurveTo(settings.size, 0, settings.size, settings.borderRadius);
          ctx.lineTo(settings.size, settings.size - settings.borderRadius);
          ctx.quadraticCurveTo(settings.size, settings.size, settings.size - settings.borderRadius, settings.size);
          ctx.lineTo(settings.borderRadius, settings.size);
          ctx.quadraticCurveTo(0, settings.size, 0, settings.size - settings.borderRadius);
          ctx.lineTo(0, settings.borderRadius);
          ctx.quadraticCurveTo(0, 0, settings.borderRadius, 0);
          ctx.closePath();
          ctx.clip();
          // Put back the saved image data
          ctx.putImageData(imgData, 0, 0);
        }
      }

      // Apply gradient if enabled
      if (settings.useGradient && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const qrData = ctx.getImageData(0, 0, settings.size, settings.size);
          let gradient;
          
          if (settings.gradientType === 'linear') {
            const angle = settings.gradientAngle * (Math.PI / 180);
            const x0 = settings.size / 2 - Math.cos(angle) * settings.size;
            const y0 = settings.size / 2 - Math.sin(angle) * settings.size;
            const x1 = settings.size / 2 + Math.cos(angle) * settings.size;
            const y1 = settings.size / 2 + Math.sin(angle) * settings.size;
            
            gradient = ctx.createLinearGradient(x0, y0, x1, y1);
          } else {
            gradient = ctx.createRadialGradient(
              settings.size / 2, settings.size / 2, 0,
              settings.size / 2, settings.size / 2, settings.size / 2
            );
          }
          
          settings.gradientColors.forEach((color, index) => {
            gradient.addColorStop(index / (settings.gradientColors.length - 1), color);
          });
          
          // Apply gradient only to QR code foreground
          for (let i = 0; i < qrData.data.length; i += 4) {
            // Check if this pixel is part of the QR code (black/dark color)
            if (qrData.data[i] < 128 && qrData.data[i+1] < 128 && qrData.data[i+2] < 128) {
              // This is a QR code pixel - make it transparent
              qrData.data[i+3] = 0;
            }
          }
          
          // Draw gradient background
          ctx.save();
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, settings.size, settings.size);
          ctx.globalCompositeOperation = 'destination-in';
          
          // Only where QR code is
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = settings.size;
          tempCanvas.height = settings.size;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.putImageData(qrData, 0, 0);
            ctx.drawImage(tempCanvas, 0, 0);
          }
          
          ctx.restore();
        }
      }

      // Generate data URL
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setQrDataUrl(dataUrl);

    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
      toast.error('Error generating QR code');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const applyLogoOverlay = () => {
    if (!canvasRef.current || !settings.logo) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      const logoSize = settings.logoSize;
      const logoX = (settings.size - logoSize) / 2;
      const logoY = (settings.size - logoSize) / 2;
      
      // Clear small area in the center
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(logoX, logoY, logoSize, logoSize);
      
      // Draw logo
      ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      
      // Update data URL
      setQrDataUrl(canvas.toDataURL('image/png'));
      toast.success('Logo applied to QR code');
    };
    img.src = settings.logo;
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (!canvasRef.current) return;
    
    let dataUrl: string;
    let filename: string;
    
    if (format === 'png') {
      dataUrl = canvasRef.current.toDataURL('image/png');
      filename = 'qrcode.png';
    } else {
      // Convert canvas to SVG
      const canvas = canvasRef.current;
      const svgns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgns, 'svg');
      svg.setAttribute('width', String(canvas.width));
      svg.setAttribute('height', String(canvas.height));
      svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`);
      
      const img = document.createElementNS(svgns, 'image');
      img.setAttribute('width', String(canvas.width));
      img.setAttribute('height', String(canvas.height));
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', canvas.toDataURL('image/png'));
      svg.appendChild(img);
      
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      filename = 'qrcode.svg';
    }
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`QR code downloaded as ${format.toUpperCase()}`);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(settings.value)
      .then(() => toast.success('QR code value copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const saveConfiguration = (configName: string) => {
    if (!configName.trim()) {
      toast.error('Please provide a name for this configuration');
      return;
    }
    
    savedConfigs.current[configName] = { ...settings };
    localStorage.setItem('qrConfigs', JSON.stringify(savedConfigs.current));
    toast.success(`Configuration "${configName}" saved`);
  };
  
  const loadConfiguration = (configName: string) => {
    const config = savedConfigs.current[configName];
    if (config) {
      setSettings(config);
      toast.success(`Configuration "${configName}" loaded`);
    }
  };

  const handleQRTypeChange = (type: string) => {
    setSettings(prev => ({
      ...prev,
      qrType: type as QRTypes,
      value: '' // Reset value when changing types
    }));
  };

  const getTypeInputPlaceholder = () => {
    switch (settings.qrType) {
      case 'url': return 'https://example.com';
      case 'text': return 'Enter plain text';
      case 'ethereum': return '0x...';
      case 'solana': return 'Solana wallet address';
      case 'event': return 'Event ID';
      case 'custom': return 'Custom data';
      default: return 'Enter value';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <h2 className="text-2xl font-bold tracking-tight">Advanced QR Code Generator</h2>
            <div className="ml-auto flex space-x-2">
              <Popover>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Save Configuration">
                          <Save className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save Configuration</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Save Configuration</h4>
                      <p className="text-sm text-muted-foreground">Save your current QR code settings.</p>
                    </div>
                    <div className="grid gap-2">
                      <Input id="config-name" placeholder="Configuration name" />
                      <Button onClick={() => saveConfiguration((document.getElementById('config-name') as HTMLInputElement).value)}>
                        Save
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Load Configuration">
                          <Upload className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Load Configuration</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Load Configuration</h4>
                      <p className="text-sm text-muted-foreground">Load a saved QR code configuration.</p>
                    </div>
                    <div className="grid gap-2">
                      <Select onValueChange={loadConfiguration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a saved configuration" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(savedConfigs.current).map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid grid-cols-3 md:w-[400px] mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="qr-type">QR Code Type</Label>
                  <Select value={settings.qrType} onValueChange={handleQRTypeChange}>
                    <SelectTrigger id="qr-type">
                      <SelectValue placeholder="Select QR code type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Plain Text
                        </span>
                      </SelectItem>
                      <SelectItem value="url">
                        <span className="flex items-center">
                          <Link className="w-4 h-4 mr-2" />
                          URL
                        </span>
                      </SelectItem>
                      <SelectItem value="ethereum">
                        <span className="flex items-center">
                          <Wallet className="w-4 h-4 mr-2" />
                          Ethereum Address
                        </span>
                      </SelectItem>
                      <SelectItem value="solana">
                        <span className="flex items-center">
                          <Wallet className="w-4 h-4 mr-2" />
                          Solana Address
                        </span>
                      </SelectItem>
                      <SelectItem value="event">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Event ID
                        </span>
                      </SelectItem>
                      <SelectItem value="custom">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Custom Data
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="qr-value">QR Code Value</Label>
                  <div className="flex gap-2">
                    <Input
                      id="qr-value"
                      placeholder={getTypeInputPlaceholder()}
                      value={settings.value}
                      onChange={(e) => setSettings({ ...settings, value: e.target.value })}
                      className={error ? "border-red-500" : ""}
                      aria-invalid={!!error}
                      aria-describedby={error ? "qr-error" : undefined}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={copyToClipboard} 
                            variant="outline"
                            size="icon" 
                            aria-label="Copy to clipboard"
                            disabled={!settings.value}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {error && (
                    <p id="qr-error" className="text-sm text-red-500">
                      {error}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={generateQRCode} 
                  disabled={isGenerating || !settings.value}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-300"
                >
                  {isGenerating ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="foreground-color">Foreground Color</Label>
                  <ColorPicker 
                    color={settings.foregroundColor} 
                    onChange={(color) => setSettings({ ...settings, foregroundColor: color })} 
                    id="foreground-color"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <ColorPicker 
                    color={settings.backgroundColor} 
                    onChange={(color) => setSettings({ ...settings, backgroundColor: color })} 
                    id="background-color"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="use-gradient">Use Gradient</Label>
                  <Switch 
                    id="use-gradient"
                    checked={settings.useGradient}
                    onCheckedChange={(checked) => setSettings({ ...settings, useGradient: checked })}
                  />
                </div>
              </div>

              {settings.useGradient && (
                <QRGradientPicker 
                  gradientType={settings.gradientType}
                  gradientColors={settings.gradientColors}
                  gradientAngle={settings.gradientAngle}
                  onGradientTypeChange={(type) => setSettings({ ...settings, gradientType: type })}
                  onGradientColorsChange={(colors) => setSettings({ ...settings, gradientColors: colors })}
                  onGradientAngleChange={(angle) => setSettings({ ...settings, gradientAngle: angle })}
                />
              )}

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="logo-upload">Logo Overlay</Label>
                <LogoOverlay
                  logo={settings.logo}
                  logoSize={settings.logoSize}
                  maxSize={settings.size}
                  onLogoChange={(logo) => setSettings({ ...settings, logo })}
                  onLogoSizeChange={(size) => setSettings({ ...settings, logoSize: size })}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="qr-size">QR Code Size</Label>
                  <div className="flex gap-2 items-center">
                    <Slider
                      id="qr-size"
                      min={128}
                      max={512}
                      step={8}
                      value={[settings.size]}
                      onValueChange={(value) => setSettings({ ...settings, size: value[0] })}
                      aria-label="QR Code Size"
                    />
                    <span className="text-sm w-12 text-right">{settings.size}px</span>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="qr-margin">Margin</Label>
                  <div className="flex gap-2 items-center">
                    <Slider
                      id="qr-margin"
                      min={0}
                      max={10}
                      step={1}
                      value={[settings.margin]}
                      onValueChange={(value) => setSettings({ ...settings, margin: value[0] })}
                      aria-label="QR Code Margin"
                    />
                    <span className="text-sm w-8 text-right">{settings.margin}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="border-radius">Border Radius</Label>
                <div className="flex gap-2 items-center">
                  <Slider
                    id="border-radius"
                    min={0}
                    max={50}
                    step={1}
                    value={[settings.borderRadius]}
                    onValueChange={(value) => setSettings({ ...settings, borderRadius: value[0] })}
                    aria-label="QR Code Border Radius"
                  />
                  <span className="text-sm w-8 text-right">{settings.borderRadius}px</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="error-correction">Error Correction Level</Label>
                <Select 
                  value={settings.errorCorrectionLevel} 
                  onValueChange={(value) => 
                    setSettings({ 
                      ...settings, 
                      errorCorrectionLevel: value as 'L' | 'M' | 'Q' | 'H' 
                    })
                  }
                >
                  <SelectTrigger id="error-correction">
                    <SelectValue placeholder="Select error correction level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Higher error correction allows the QR code to be readable even if partially damaged or obscured.
                  This is especially important when using logos or custom designs.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            className={`relative flex justify-center ${settings.value ? "" : "opacity-50"}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`
                relative rounded-xl overflow-hidden p-1
                bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400
                dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                shadow-lg hover:shadow-xl transition-shadow duration-300
              `}
            >
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={settings.size}
                  height={settings.size}
                  className="max-w-full h-auto"
                />
              </div>
            </div>
            
            {!settings.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Enter a value to generate QR code</p>
              </div>
            )}
          </motion.div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">QR Code Options</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleDownload('png')} 
                disabled={!qrDataUrl}
                className="flex items-center gap-2 transition-all duration-300"
                variant="outline"
              >
                <Download size={18} />
                Download PNG
              </Button>
              
              <Button 
                onClick={() => handleDownload('svg')} 
                disabled={!qrDataUrl}
                className="flex items-center gap-2 transition-all duration-300"
                variant="outline"
              >
                <Download size={18} />
                Download SVG
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">QR Code Information</h4>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-muted-foreground">Type:</dt>
                <dd>{settings.qrType}</dd>
                <dt className="text-muted-foreground">Size:</dt>
                <dd>{settings.size}px × {settings.size}px</dd>
                <dt className="text-muted-foreground">Error Correction:</dt>
                <dd>
                  {settings.errorCorrectionLevel === 'L' && 'Low (7%)'}
                  {settings.errorCorrectionLevel === 'M' && 'Medium (15%)'}
                  {settings.errorCorrectionLevel === 'Q' && 'Quartile (25%)'}
                  {settings.errorCorrectionLevel === 'H' && 'High (30%)'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedQRGenerator;
