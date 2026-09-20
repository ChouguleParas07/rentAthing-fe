import React, { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move } from "lucide-react";

interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => Promise<void>;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onSave,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!imageRef.current) return;
    setIsSaving(true);

    try {
      const canvas = document.createElement("canvas");
      const size = 300;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Fill white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, size, size);

        // Save state and translate to center for transformation
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);

        const img = imageRef.current;
        const aspect = img.naturalWidth / img.naturalHeight;
        let drawWidth = size;
        let drawHeight = size;

        if (aspect > 1) {
          drawHeight = size;
          drawWidth = size * aspect;
        } else {
          drawWidth = size;
          drawHeight = size / aspect;
        }

        // Apply pan offset
        const offsetX = (position.x / 150) * (size / 2);
        const offsetY = (position.y / 150) * (size / 2);

        ctx.drawImage(img, -drawWidth / 2 + offsetX, -drawHeight / 2 + offsetY, drawWidth, drawHeight);
        ctx.restore();

        // Create round mask preview export
        const resultDataUrl = canvas.toDataURL("image/jpeg", 0.88);
        await onSave(resultDataUrl);
      }
    } catch (err) {
      console.error("Failed to crop profile image:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-gray-900 font-bold">
          <Move className="w-5 h-5 text-green-600" /> Adjust Profile Photo
        </div>
      }
    >
      <div className="flex flex-col items-center gap-6">

        {/* Interactive Circle Crop Viewport */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-green-600 shadow-xl bg-gray-900 cursor-grab active:cursor-grabbing select-none flex items-center justify-center group"
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Profile Preview"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.15s ease-out",
            }}
            className="max-w-none w-full h-full object-cover pointer-events-none"
          />

          {/* Semi-transparent Grid Overlay Guide */}
          <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Drag to Reposition
          </div>
        </div>

        {/* Controls Bar */}
        <div className="w-full space-y-4 px-2">

          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-green-600 cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 min-w-[36px] text-right">
              {Math.round(scale * 100)}%
            </span>
          </div>

          {/* Action Buttons: Rotate & Reset */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={handleRotate}
              type="button"
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-gray-500" /> Rotate 90°
            </button>
            <button
              onClick={handleReset}
              type="button"
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Reset Adjustments
            </button>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-md shadow-green-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Apply & Save Photo
              </>
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
};
