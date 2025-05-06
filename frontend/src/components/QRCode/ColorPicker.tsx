
import { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  id?: string;
}

const ColorPicker = ({ color, onChange, id }: ColorPickerProps) => {
  const [localColor, setLocalColor] = useState(color);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className="w-8 h-8 rounded-md border overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ backgroundColor: localColor }}
            aria-label="Pick color"
          >
            <span className="sr-only">Pick color</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">
                Pick a color
              </label>
              <input
                ref={colorInputRef}
                type="color"
                value={localColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#6366f1'].map((presetColor) => (
                <button
                  key={presetColor}
                  className={`w-6 h-6 rounded-md border border-gray-300 cursor-pointer transition-transform hover:scale-110 ${
                    localColor === presetColor ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleColorChange(presetColor)}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm">Hex:</span>
              <input
                type="text"
                value={localColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex h-8 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <span className="text-sm text-muted-foreground">{localColor}</span>
    </div>
  );
};

export default ColorPicker;
