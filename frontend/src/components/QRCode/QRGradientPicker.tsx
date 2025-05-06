
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import ColorPicker from './ColorPicker';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface QRGradientPickerProps {
  gradientType: 'linear' | 'radial';
  gradientColors: string[];
  gradientAngle: number;
  onGradientTypeChange: (type: 'linear' | 'radial') => void;
  onGradientColorsChange: (colors: string[]) => void;
  onGradientAngleChange: (angle: number) => void;
}

const QRGradientPicker = ({
  gradientType,
  gradientColors,
  gradientAngle,
  onGradientTypeChange,
  onGradientColorsChange,
  onGradientAngleChange
}: QRGradientPickerProps) => {
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...gradientColors];
    newColors[index] = color;
    onGradientColorsChange(newColors);
  };

  const addColor = () => {
    // Get the last color and a slightly modified version for a nice continuation
    const lastColor = gradientColors[gradientColors.length - 1];
    
    // Simple color modification - not perfect but gives some variation
    let newColor = lastColor;
    try {
      // Try to make a slightly different color
      const r = parseInt(lastColor.substring(1, 3), 16);
      const g = parseInt(lastColor.substring(3, 5), 16);
      const b = parseInt(lastColor.substring(5, 7), 16);
      
      const newR = Math.min(255, r + 20).toString(16).padStart(2, '0');
      const newG = Math.min(255, g + 30).toString(16).padStart(2, '0');
      const newB = Math.max(0, b - 15).toString(16).padStart(2, '0');
      
      newColor = `#${newR}${newG}${newB}`;
    } catch (e) {
      // If color parsing fails, use a default color
      newColor = '#6366f1';
    }
    
    onGradientColorsChange([...gradientColors, newColor]);
  };

  const removeColor = (index: number) => {
    if (gradientColors.length <= 2) return; // Keep at least 2 colors
    const newColors = gradientColors.filter((_, i) => i !== index);
    onGradientColorsChange(newColors);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="space-y-2">
        <Label>Gradient Type</Label>
        <RadioGroup 
          value={gradientType} 
          onValueChange={(value) => onGradientTypeChange(value as 'linear' | 'radial')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="linear" id="linear" />
            <Label htmlFor="linear">Linear</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="radial" id="radial" />
            <Label htmlFor="radial">Radial</Label>
          </div>
        </RadioGroup>
      </div>

      {gradientType === 'linear' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="gradient-angle">Angle</Label>
            <span className="text-sm text-muted-foreground">{gradientAngle}°</span>
          </div>
          <Slider
            id="gradient-angle"
            min={0}
            max={360}
            step={1}
            value={[gradientAngle]}
            onValueChange={(value) => onGradientAngleChange(value[0])}
            aria-label="Gradient Angle"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Gradient Colors</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColor}
            disabled={gradientColors.length >= 5}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Color
          </Button>
        </div>

        <div className="space-y-3">
          {gradientColors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ColorPicker
                color={color}
                onChange={(newColor) => handleColorChange(index, newColor)}
                id={`gradient-color-${index}`}
              />
              <span className="text-sm text-muted-foreground">Stop {index + 1}</span>
              {gradientColors.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeColor(index)}
                  className="ml-auto h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove color</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-6 w-full rounded-md"
        style={{
          background: gradientType === 'linear'
            ? `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`
            : `radial-gradient(circle, ${gradientColors.join(', ')})`
        }}
      />
    </div>
  );
};

export default QRGradientPicker;
