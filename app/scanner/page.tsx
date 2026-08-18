'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, Check, RotateCcw, Maximize2, Scan, Sun, Contrast, FileText, Image as ImageIcon, Filter } from 'lucide-react';

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionLoopRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [documentDetected, setDocumentDetected] = useState(false);
  const [corners, setCorners] = useState<{x: number, y: number}[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [flash, setFlash] = useState(false);
  const [filter, setFilter] = useState<'original' | 'bw' | 'enhance'>('enhance');
  const [zoom, setZoom] = useState(1);
  const [multiMode, setMultiMode] = useState(true);

  const startCamera = async () => {
    setErrorMsg('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
      setIsCameraOn(true);
      startDetection();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Camera permission denied. Click lock icon → Allow Camera.');
      } else {
        setErrorMsg('Camera error: ' + err.message);
      }
    }
  };

  const findCorners = useCallback((imageData: ImageData, w: number, h: number) => {
    const data = imageData.data;
    const threshold = 140;
    const brightPoints: {x: number, y: number}[] = [];
    
    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < w; x += 3) {
        const idx = (y * w + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        if (brightness > threshold) brightPoints.push({x, y});
      }
    }
    
    if (brightPoints.length < 500) return null;
    
    let minX = w, maxX = 0, minY = h, maxY = 0;
    brightPoints.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    
    const boxW = maxX - minX;
    const boxH = maxY - minY;
    if (boxW < w * 0.2 || boxH < h * 0.2) return null;
    if (boxW > w * 0.9 || boxH > h * 0.9) return null;
    
    const aspectRatio = boxW / boxH;
    if (aspectRatio < 0.4 || aspectRatio > 2.0) return null;
    
    return [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY }
    ];
  }, []);

  const startDetection = () => {
    const detect = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      
      if (!video || !canvas || !overlayCanvas || video.readyState !== 4 || video.videoWidth === 0) {
        detectionLoopRef.current = setTimeout(detect, 500);
        return;
      }

      const w = video.videoWidth;
      const h = video.videoHeight;
      
      canvas.width = w;
      canvas.height = h;
      overlayCanvas.width = w;
      overlayCanvas.height = h;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const oCtx = overlayCanvas.getContext('2d');
      
      if (!ctx || !oCtx) {
        detectionLoopRef.current = setTimeout(detect, 500);
        return;
      }
      
      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const foundCorners = findCorners(imageData, w, h);
      
      oCtx.clearRect(0, 0, w, h);
      
      if (foundCorners) {
        setCorners(foundCorners);
        setDocumentDetected(true);
        
        // Darken outside
        oCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        oCtx.fillRect(0, 0, w, h);
        
        // Clear inside paper area
        oCtx.save();
        oCtx.beginPath();
        oCtx.moveTo(foundCorners[0].x, foundCorners[0].y);
        oCtx.lineTo(foundCorners[1].x, foundCorners[1].y);
        oCtx.lineTo(foundCorners[2].x, foundCorners[2].y);
        oCtx.lineTo(foundCorners[3].x, foundCorners[3].y);
        oCtx.closePath();
        oCtx.clip();
        oCtx.clearRect(0, 0, w, h);
        oCtx.restore();
        
        // Draw border
        oCtx.strokeStyle = '#3B82F6';
        oCtx.lineWidth = 3;
        oCtx.beginPath();
        oCtx.moveTo(foundCorners[0].x, foundCorners[0].y);
        oCtx.lineTo(foundCorners[1].x, foundCorners[1].y);
        oCtx.lineTo(foundCorners[2].x, foundCorners[2].y);
        oCtx.lineTo(foundCorners[3].x, foundCorners[3].y);
        oCtx.closePath();
        oCtx.stroke();
        
        // Corner brackets
        const b = 25;
        oCtx.lineWidth = 4;
        oCtx.strokeStyle = '#3B82F6';
        
        oCtx.beginPath(); oCtx.moveTo(foundCorners[0].x, foundCorners[0].y + b); oCtx.lineTo(foundCorners[0].x, foundCorners[0].y); oCtx.lineTo(foundCorners[0].x + b, foundCorners[0].y); oCtx.stroke();
        oCtx.beginPath(); oCtx.moveTo(foundCorners[1].x - b, foundCorners[1].y); oCtx.lineTo(foundCorners[1].x, foundCorners[1].y); oCtx.lineTo(foundCorners[1].x, foundCorners[1].y + b); oCtx.stroke();
        oCtx.beginPath(); oCtx.moveTo(foundCorners[2].x, foundCorners[2].y - b); oCtx.lineTo(foundCorners[2].x, foundCorners[2].y); oCtx.lineTo(foundCorners[2].x - b, foundCorners[2].y); oCtx.stroke();
        oCtx.beginPath(); oCtx.moveTo(foundCorners[3].x + b, foundCorners[3].y); oCtx.lineTo(foundCorners[3].x, foundCorners[3].y); oCtx.lineTo(foundCorners[3].x, foundCorners[3].y - b); oCtx.stroke();
      } else {
        setCorners(null);
        setDocumentDetected(false);
      }
      
      detectionLoopRef.current = setTimeout(detect, 500);
    };
    
    detect();
  };

  const stopCamera = useCallback(() => {
    if (detectionLoopRef.current) clearTimeout(detectionLoopRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraOn(false);
    setDocumentDetected(false);
    setCorners(null);
  }, []);

  const applyFilter = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, filterType: string) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    if (filterType === 'bw') {
      // Black & White
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const value = brightness > 140 ? 255 : 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
      }
    } else if (filterType === 'enhance') {
      // Enhanced contrast
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.2 + 10);
        data[i + 1] = Math.min(255, data[i + 1] * 1.2 + 10);
        data[i + 2] = Math.min(255, data[i + 2] * 1.2 + 10);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.videoWidth === 0) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    if (corners && corners.length === 4) {
      const [tl, tr, br, bl] = corners;
      const cropX = tl.x;
      const cropY = tl.y;
      const cropW = tr.x - tl.x;
      const cropH = bl.y - tl.y;
      
      if (cropW > 100 && cropH > 100) {
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = cropW;
        croppedCanvas.height = cropH;
        const croppedCtx = croppedCanvas.getContext('2d');
        
        if (croppedCtx) {
          croppedCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          applyFilter(croppedCanvas, croppedCtx, filter);
          setCapturedImages(prev => [...prev, croppedCanvas.toDataURL('image/jpeg', 0.95)]);
          return;
        }
      }
    }
    
    applyFilter(canvas, ctx, filter);
    setCapturedImages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.95)]);
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      if (capabilities.torch) {
        await track.applyConstraints({ advanced: [{ torch: !flash } as any] });
        setFlash(!flash);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (detectionLoopRef.current) clearTimeout(detectionLoopRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan Document</h1>
          <p className="text-gray-600">Edge detection with filters</p>
        </div>
        
        {/* Filter Selector */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
          <button onClick={() => setFilter('enhance')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filter === 'enhance' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
            <Contrast className="w-3.5 h-3.5 inline mr-1" /> Enhance
          </button>
          <button onClick={() => setFilter('bw')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filter === 'bw' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
            <FileText className="w-3.5 h-3.5 inline mr-1" /> B&W
          </button>
          <button onClick={() => setFilter('original')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filter === 'original' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
            <ImageIcon className="w-3.5 h-3.5 inline mr-1" /> Original
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black rounded-2xl overflow-hidden" style={{ minHeight: '400px', position: 'relative' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover', display: isCameraOn ? 'block' : 'none' }}
            />
            
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 pointer-events-none z-10"
              style={{ width: '100%', height: '100%', display: isCameraOn ? 'block' : 'none' }}
            />
            
            {!isCameraOn && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                  <Camera className="w-20 h-20 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Camera off</p>
                </div>
              </div>
            )}

            {isCameraOn && documentDetected && (
              <div className="absolute top-4 left-4 z-20 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full">
                ✓ Paper Detected
              </div>
            )}

            {isCameraOn && flash && (
              <div className="absolute top-4 right-4 z-20 bg-yellow-400 rounded-full p-2">
                <Sun className="w-5 h-5 text-yellow-900" />
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {!isCameraOn ? (
              <button onClick={startCamera} className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700">
                <Camera className="w-6 h-6" />
                Start Scanner
              </button>
            ) : (
              <>
                <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-50 active:scale-95">
                  <div className="w-14 h-14 bg-blue-600 rounded-full"></div>
                </button>
                
                <button onClick={toggleFlash} className={`p-4 rounded-full border ${flash ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                  <Sun className="w-6 h-6" />
                </button>
                
                <button onClick={stopCamera} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700">
                  <X className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {isCameraOn && (
            <div className="mt-4 text-center">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                documentDetected ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${documentDetected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                {documentDetected ? 'Ready to capture' : 'Place paper on dark background'}
              </span>
            </div>
          )}
        </div>

        {/* Captured Pages with more features */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pages ({capturedImages.length})</h3>
              {capturedImages.length > 0 && (
                <button onClick={() => { alert('Saved!'); setCapturedImages([]); }} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm">
                  Save All
                </button>
              )}
            </div>
            
            {capturedImages.length === 0 ? (
              <div className="text-center py-8">
                <Maximize2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No pages scanned</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {capturedImages.map((img, index) => (
                  <div key={index} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                    <img src={img} alt={`Page ${index + 1}`} className="w-full h-40 object-contain" />
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">{index + 1}</span>
                    
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a href={img} download={`page-${index + 1}.jpg`} className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50">
                        <ImageIcon className="w-4 h-4" />
                      </a>
                      <button onClick={() => setCapturedImages(prev => prev.filter((_, i) => i !== index))} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setCapturedImages([])} className="flex items-center justify-center flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <RotateCcw className="w-4 h-4 mr-1" /> Clear All
                  </button>
                  <button onClick={() => { alert('Saved!'); setCapturedImages([]); }} className="flex items-center justify-center flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                    <Check className="w-4 h-4 mr-1" /> Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
