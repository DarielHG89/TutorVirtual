import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from './Button';

interface ImageCropperProps {
    imageUrl: string;
    onCrop: (croppedImageUrl: string) => void;
    onCancel: () => void;
}

const CROP_AREA_SIZE = 256;
const OUTPUT_SIZE = 256;

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCrop, onCancel }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [scale, setScale] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [baseScale, setBaseScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const image = imgRef.current;
        if (!image) return;

        const handleLoad = () => {
             if (image.naturalWidth > 0 && image.naturalHeight > 0) {
                // This is the "cover" scale. It makes the image's smaller dimension fit the crop area.
                const scaleToCover = Math.max(CROP_AREA_SIZE / image.naturalWidth, CROP_AREA_SIZE / image.naturalHeight);
                setBaseScale(scaleToCover);
                setScale(scaleToCover);
                setZoom(1);
                setOffset({ x: 0, y: 0 });
            }
        };

        if (image.complete) {
            handleLoad();
        } else {
            image.addEventListener('load', handleLoad);
        }

        return () => {
            image.removeEventListener('load', handleLoad);
        };
    }, [imageUrl]);

    useEffect(() => {
        setScale(baseScale * zoom);
    }, [zoom, baseScale]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !imgRef.current) return;
        e.preventDefault();
        
        const image = imgRef.current;
        const currentImgWidth = image.naturalWidth * scale;
        const currentImgHeight = image.naturalHeight * scale;

        const maxX = Math.max(0, (currentImgWidth - CROP_AREA_SIZE) / 2);
        const maxY = Math.max(0, (currentImgHeight - CROP_AREA_SIZE) / 2);
        
        let newX = e.clientX - dragStart.x;
        let newY = e.clientY - dragStart.y;

        newX = Math.max(-maxX, Math.min(maxX, newX));
        newY = Math.max(-maxY, Math.min(maxY, newY));

        setOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCrop = () => {
        const image = imgRef.current;
        if (!image || !image.complete || image.naturalWidth === 0) return;

        const canvas = document.createElement('canvas');
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // This is the size of the square we want to clip from the original, unscaled image.
        // It's the visual crop area's size, divided by the total scale factor.
        const sourceClipSize = CROP_AREA_SIZE / scale;

        // We start at the center of the original image...
        const sourceCenterX = image.naturalWidth / 2;
        const sourceCenterY = image.naturalHeight / 2;
        
        // ...then we adjust for the user's panning. The pan amount (offset) is in screen pixels,
        // so we need to convert it to source image pixels by dividing by the scale.
        // If the user pans right (+x offset), we need to clip from the left of center, so we subtract.
        const clippedSourceCenterX = sourceCenterX - (offset.x / scale);
        const clippedSourceCenterY = sourceCenterY - (offset.y / scale);
        
        // From the center of the clip area, find its top-left corner (sx, sy).
        const sx = clippedSourceCenterX - (sourceClipSize / 2);
        const sy = clippedSourceCenterY - (sourceClipSize / 2);

        // Use the 9-argument version of drawImage to clip and scale.
        ctx.drawImage(
            image,
            sx, // source x
            sy, // source y
            sourceClipSize, // source width
            sourceClipSize, // source height
            0, // destination x
            0, // destination y
            OUTPUT_SIZE, // destination width
            OUTPUT_SIZE  // destination height
        );

        onCrop(canvas.toDataURL('image/png'));
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">Recortar Avatar</h3>
                <div
                    className="relative w-full h-64 bg-slate-200 rounded-lg overflow-hidden cursor-move touch-none flex items-center justify-center"
                    style={{ width: CROP_AREA_SIZE, height: CROP_AREA_SIZE, margin: '0 auto' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                >
                    <img
                        ref={imgRef}
                        src={imageUrl}
                        alt="Previsualización para recortar"
                        style={{
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            maxWidth: 'none',
                            maxHeight: 'none',
                        }}
                        draggable={false}
                        className="pointer-events-none"
                    />
                </div>
                
                <div className="my-4">
                    <label className="block text-sm font-bold text-slate-600 mb-2 text-center">Zoom 🔎</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={onCancel} variant="secondary" className="!py-2 !px-4">Cancelar</Button>
                    <Button onClick={handleCrop} variant="primary" className="!py-2 !px-4">Recortar</Button>
                </div>
            </div>
        </div>
    );
};