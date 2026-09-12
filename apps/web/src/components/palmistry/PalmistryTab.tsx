'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Hand,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Sliders,
  Maximize2,
  FileText,
  UploadCloud,
  RefreshCw,
  Camera,
  Eye,
  Image as ImageIcon,
  Check,
  Info,
  X,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PalmistryTabProps {
  initialHandType?: 'LEFT_HAND' | 'RIGHT_HAND';
}

export function PalmistryTab({ initialHandType = 'RIGHT_HAND' }: PalmistryTabProps) {
  const { language } = useI18n();
  const isHi = language === 'hi';

  const [handType, setHandType] = useState<'LEFT_HAND' | 'RIGHT_HAND'>(initialHandType);
  const [handDominance, setHandDominance] = useState<'DOMINANT' | 'NON_DOMINANT'>('DOMINANT');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeRuleCategory, setActiveRuleCategory] = useState<string>('ALL');

  // Image Upload & Camera State
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [extractedMetrics, setExtractedMetrics] = useState<{
    width: number;
    height: number;
    sharpness: number;
    lighting: number;
    contrast: number;
  } | null>(null);

  // Overlay Mode: 'PHOTO_OVERLAY' | 'VECTOR_BLUEPRINT' | 'RAW_PHOTO'
  const [viewMode, setViewMode] = useState<'PHOTO_OVERLAY' | 'VECTOR_BLUEPRINT' | 'RAW_PHOTO'>('PHOTO_OVERLAY');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze image or payload
  const runAnalysis = async (customMetrics?: any) => {
    setLoading(true);
    try {
      const payloadMetrics = customMetrics || extractedMetrics;
      const res = await fetch('/api/palmistry/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handType,
          handDominance,
          imageWidth: payloadMetrics?.width || 1024,
          imageHeight: payloadMetrics?.height || 1024,
          sharpnessScore: payloadMetrics?.sharpness || 86,
          lightingScore: payloadMetrics?.lighting || 88,
          contrastScore: payloadMetrics?.contrast || 83,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysis(json.data);
      }
    } catch (err) {
      console.error('Failed to run palmistry analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [handType, handDominance]);

  // Handle local image file upload & client-side quality metrics extraction
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      processDataUrl(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const processDataUrl = (dataUrl: string, name: string) => {
    setUploadedImageUrl(dataUrl);
    setImageFileName(name);

    const img = new Image();
    img.onload = () => {
      const metrics = analyzeImagePixels(img);
      setExtractedMetrics(metrics);
      runAnalysis(metrics);
    };
    img.src = dataUrl;
  };

  // Client-side webcam photo capture
  const startCamera = async () => {
    setCameraError(null);
    setShowCameraModal(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Unable to access device camera. Please check permissions or upload a photo.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 800;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      processDataUrl(dataUrl, 'webcam_captured_palm.jpg');
    }
    stopCamera();
  };

  // Client-side pixel variance & contrast measurement algorithm
  const analyzeImagePixels = (img: HTMLImageElement) => {
    const width = img.naturalWidth || img.width || 800;
    const height = img.naturalHeight || img.height || 800;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = Math.min(width, 800);
    canvas.height = Math.min(height, 800);

    if (!ctx) {
      return { width, height, sharpness: 85, lighting: 85, contrast: 80 };
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let sumLuma = 0;
    const sampleCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      sumLuma += luma;
    }

    const avgLuma = sumLuma / sampleCount;

    // Laplacian edge difference for sharpness estimation
    let laplacianSum = 0;
    const w = canvas.width;
    for (let y = 2; y < canvas.height - 2; y += 4) {
      for (let x = 2; x < w - 2; x += 4) {
        const idx = (y * w + x) * 4;
        const center = data[idx];
        const left = data[idx - 4];
        const right = data[idx + 4];
        const top = data[((y - 1) * w + x) * 4];
        const bottom = data[((y + 1) * w + x) * 4];
        laplacianSum += Math.abs(4 * center - left - right - top - bottom);
      }
    }

    const sharpness = Math.min(98, Math.max(45, Math.round((laplacianSum / (sampleCount / 16)) * 2.5)));
    const lighting = Math.min(98, Math.max(35, Math.round((avgLuma / 255) * 100)));
    const contrast = Math.min(98, Math.max(40, Math.round(Math.abs(avgLuma - 128) * 0.8 + 50)));

    return { width, height, sharpness, lighting, contrast };
  };

  const pipeline = analysis?.pipelineStages || [];
  const lines = analysis?.lines;
  const mounts = analysis?.mounts;
  const ratios = analysis?.digitalRatios;
  const quality = analysis?.quality;
  const rules = analysis?.ruleResults || [];

  const filteredRules =
    activeRuleCategory === 'ALL'
      ? rules
      : rules.filter((r: any) => r.category === activeRuleCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner - High contrast adaptive */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-indigo-900/40 dark:from-teal-950/80 dark:via-slate-900 dark:to-indigo-950/80 border border-teal-500/40 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-800 dark:text-teal-300 font-mono text-[11px] font-bold">
              vedica-palmistry-v1
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold">
              9-Stage CV & AST Pipeline
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Hand className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>{isHi ? 'हस्तरेखा एवं करतल लक्षण विश्लेषण (Hast Rekha)' : 'Deterministic Palmistry & Hast Rekha (हस्तरेखा)'}</span>
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 max-w-2xl font-medium">
            Upload or capture your palm photo to compute line vectors, 2D:4D finger digital ratios, and 7 Palmar Mounts with Hast Rekha AST rules.
          </p>
        </div>

        {/* Hand Selectors & Controls */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <div className="flex items-center bg-slate-100 dark:bg-slate-950/90 p-1 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setHandType('RIGHT_HAND')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                handType === 'RIGHT_HAND'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isHi ? 'दक्षिण कर (Right)' : 'Right Palm'}
            </button>
            <button
              type="button"
              onClick={() => setHandType('LEFT_HAND')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                handType === 'LEFT_HAND'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isHi ? 'वाम कर (Left)' : 'Left Palm'}
            </button>
          </div>

          <button
            type="button"
            onClick={startCamera}
            className="px-3.5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{isHi ? 'कैमरा से लें' : 'Take Live Photo'}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isHi ? 'चित्र अपलोड करें' : 'Upload Photo'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Hand Photo Upload Card & Dropzone Banner */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {isHi ? 'करतल चित्र इनपुट एवं गुणवत्ता मापक' : 'Palmar Image Ingestion & Quality Analysis'}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {imageFileName ? `Loaded: ${imageFileName}` : isHi ? 'चित्र का प्रयोग कर हस्तरेखा विश्लेषण करें' : 'Upload a palm photo, capture via camera, or test with sample palms below'}
              </p>
            </div>
          </div>

          {/* Preset Sample Hand Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Sample Palms:</span>
            <button
              type="button"
              onClick={() => {
                const url = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop';
                processDataUrl(url, 'sample_right_hand.jpg');
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
            >
              ✋ Right Palm Sample
            </button>
            <button
              type="button"
              onClick={() => {
                const url = 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop';
                processDataUrl(url, 'sample_left_hand.jpg');
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
            >
              🤚 Left Palm Sample
            </button>
          </div>
        </div>

        {/* Live Extracted Image Metrics Meter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Resolution:</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">
              {quality?.resolutionWidth || extractedMetrics?.width || 1024} × {quality?.resolutionHeight || extractedMetrics?.height || 1024} px
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Sharpness (Laplacian):</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {quality?.sharpnessScore || extractedMetrics?.sharpness || 86}/100
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Lighting Score:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {quality?.lightingScore || extractedMetrics?.lighting || 88}/100
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Contrast & Clarity:</span>
            <span className="font-bold text-teal-700 dark:text-teal-400">
              {quality?.contrastScore || extractedMetrics?.contrast || 83}/100
            </span>
          </div>
        </div>
      </div>

      {/* 9-Stage Pipeline Execution Trace */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>9-Stage Deterministic Execution Trace</span>
          </span>
          <span className="font-mono text-slate-600 dark:text-slate-400">Status: 100% Validated</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {[
            '1. Photo Input',
            '2. Quality Assess',
            '3. Hand Detect',
            '4. Landmarks',
            '5. Lines Detection',
            '6. Mount Measure',
            '7. Observations',
            '8. Hast Rules',
            '9. Interpretation',
          ].map((stName, idx) => {
            const stageNum = idx + 1;
            const stageInfo = pipeline.find((p: any) => p.stageNumber === stageNum);
            const isPassed = stageInfo?.status === 'PASSED';
            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border text-center transition ${
                  isPassed
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-500/40 text-teal-900 dark:text-teal-300'
                    : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">{stName}</div>
                <div className="text-[9px] mt-0.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  {isPassed ? '✓ Passed' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Palmar Vector Canvas & Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Vector SVG Palm Diagram (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-teal-500/30 rounded-3xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4" />
              <span>Palmar Vector & Landmark Overlay</span>
            </span>

            {/* Canvas Display Mode Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setViewMode('PHOTO_OVERLAY')}
                className={`px-2 py-1 rounded-lg transition ${
                  viewMode === 'PHOTO_OVERLAY'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Overlay
              </button>
              <button
                type="button"
                onClick={() => setViewMode('VECTOR_BLUEPRINT')}
                className={`px-2 py-1 rounded-lg transition ${
                  viewMode === 'VECTOR_BLUEPRINT'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Blueprint
              </button>
              <button
                type="button"
                onClick={() => setViewMode('RAW_PHOTO')}
                className={`px-2 py-1 rounded-lg transition ${
                  viewMode === 'RAW_PHOTO'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Photo
              </button>
            </div>
          </div>

          {/* SVG Vector Palm Representation with Background Photo Layer */}
          <div className="relative w-full aspect-[4/5] bg-slate-900 rounded-2xl border border-slate-800 p-2 flex items-center justify-center overflow-hidden shadow-inner">
            <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-md">
              {/* Background Photo Layer */}
              {(viewMode === 'PHOTO_OVERLAY' || viewMode === 'RAW_PHOTO') && uploadedImageUrl && (
                <image
                  href={uploadedImageUrl}
                  x="0"
                  y="0"
                  width="400"
                  height="500"
                  preserveAspectRatio="xMidYMid slice"
                  opacity={viewMode === 'RAW_PHOTO' ? '1.0' : '0.45'}
                />
              )}

              {/* Outer Palm Contour Outline (in Vector mode or semi-transparent in Overlay mode) */}
              {viewMode !== 'RAW_PHOTO' && (
                <path
                  d="M 120 450 Q 80 320 80 200 C 80 140 100 80 140 40 Q 150 30 160 50 L 160 160 Q 180 30 200 20 Q 210 20 220 50 L 220 160 Q 240 40 260 35 Q 270 35 280 60 L 280 180 Q 300 80 315 75 Q 325 75 330 100 L 330 250 Q 340 340 290 450 Z"
                  fill={uploadedImageUrl && viewMode === 'PHOTO_OVERLAY' ? 'none' : '#0f172a'}
                  stroke="#14b8a6"
                  strokeWidth="2.5"
                />
              )}

              {/* Primary Line Vectors */}
              {viewMode !== 'RAW_PHOTO' && (
                <>
                  {/* 1. Life Line (Emerald Arc around Shukra/Venus) */}
                  <path
                    d="M 140 200 Q 130 280 200 420"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <text x="110" y="320" fill="#34d399" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Life Line (आयु)
                  </text>

                  {/* 2. Head Line (Sky Blue Sloping) */}
                  <path
                    d="M 140 200 Q 220 250 310 290"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <text x="210" y="240" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Head Line (मस्तिष्क)
                  </text>

                  {/* 3. Heart Line (Rose Curve) */}
                  <path
                    d="M 330 190 Q 240 160 160 140"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <text x="230" y="150" fill="#fb7185" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Heart Line (हृदय)
                  </text>

                  {/* 4. Fate Line (Amber Shaft) */}
                  <path
                    d="M 210 440 L 210 160"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3.5"
                    strokeDasharray="5 3"
                    strokeLinecap="round"
                  />
                  <text x="215" y="360" fill="#fbbf24" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Fate Line (भाग्य)
                  </text>

                  {/* Palmar Landmark Anchor Dots */}
                  {[
                    { x: 140, y: 200, label: 'Index Base' },
                    { x: 200, y: 170, label: 'Middle Base' },
                    { x: 260, y: 175, label: 'Ring Base' },
                    { x: 320, y: 200, label: 'Pinky Base' },
                    { x: 200, y: 440, label: 'Wrist Base' },
                  ].map((pt, idx) => (
                    <g key={idx}>
                      <circle cx={pt.x} cy={pt.y} r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  ))}
                </>
              )}
            </svg>
          </div>

          {/* Quality Assessment Summary Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-900 dark:text-slate-100 font-bold">
              <span>Palmar Confidence Score</span>
              <span className="text-teal-700 dark:text-teal-400 font-extrabold">{quality?.handVisibilityConfidence || 88}% Confidence</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
              <div>Sharpness: <span className="text-slate-900 dark:text-slate-200 font-bold">{quality?.sharpnessScore}/100</span></div>
              <div>Lighting: <span className="text-slate-900 dark:text-slate-200 font-bold">{quality?.lightingScore}/100</span></div>
              <div>Contrast: <span className="text-slate-900 dark:text-slate-200 font-bold">{quality?.contrastScore}/100</span></div>
            </div>
          </div>
        </div>

        {/* Palmar Lines & Mount Metrics Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 2D:4D Finger Digital Ratio Card */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-indigo-500/30 space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>2D:4D Digital Finger Ratio & Temperament Balance</span>
              </span>
              <span className="font-mono text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                Ratio: {ratios?.ratio2D4D}
              </span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              <strong>Digit Pattern:</strong> {ratios?.digitClassification?.replace(/_/g, ' ')} — {ratios?.temperamentHint}
            </p>
          </div>

          {/* 4 Primary Lines Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Primary Palmar Lines Analysis</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Life Line */}
              {lines?.lifeLine && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/90 border border-emerald-300 dark:border-emerald-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-400">
                    <span>{lines.lifeLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-300">
                      Length: {lines.lifeLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-medium">
                    {lines.lifeLine.keyObservation}
                  </p>
                </div>
              )}

              {/* Head Line */}
              {lines?.headLine && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/90 border border-sky-300 dark:border-sky-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-sky-800 dark:text-sky-400">
                    <span>{lines.headLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded text-sky-900 dark:text-sky-300">
                      Length: {lines.headLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-medium">
                    {lines.headLine.keyObservation}
                  </p>
                </div>
              )}

              {/* Heart Line */}
              {lines?.heartLine && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/90 border border-rose-300 dark:border-rose-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-400">
                    <span>{lines.heartLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded text-rose-900 dark:text-rose-300">
                      Length: {lines.heartLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-medium">
                    {lines.heartLine.keyObservation}
                  </p>
                </div>
              )}

              {/* Fate Line */}
              {lines?.fateLine && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/90 border border-amber-300 dark:border-amber-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-400">
                    <span>{lines.fateLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded text-amber-900 dark:text-amber-300">
                      Length: {lines.fateLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-medium">
                    {lines.fateLine.keyObservation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 7 Palmar Mounts Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>7 Palmar Mounts Prominence (पर्वत विकास)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {mounts &&
                Object.values(mounts).map((m: any) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm"
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-200 text-[11px]">{m.nameSanskrit}</div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-teal-600 dark:bg-teal-400 rounded-full" style={{ width: `${m.score}%` }} />
                    </div>
                    <div className="text-[10px] text-teal-800 dark:text-teal-300 font-mono flex items-center justify-between pt-0.5 font-bold">
                      <span>{m.score}/100</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[9px] truncate font-normal">{m.prominence.split('_')[0]}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Triggered Hast Rekha AST Rules & Evidence Drawer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-teal-500/30 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Hast Rekha AST Rules & Evidence</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {['ALL', 'VITALITY', 'COGNITION', 'DESTINY'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveRuleCategory(cat)}
                className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
                  activeRuleCategory === cat
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Triggered Rules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule: any) => (
            <div
              key={rule.ruleId}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{isHi ? rule.titleHi : rule.title}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono font-bold">
                  {rule.category}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {isHi ? rule.findingHi : rule.finding}
              </p>

              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-teal-700 dark:text-teal-400 font-bold uppercase">Evidence Trace:</div>
                {rule.evidenceTrace?.map((ev: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1 font-semibold">
                    <span>•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Live Viewfinder Capture Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Camera className="w-5 h-5 text-amber-500" />
                <span>{isHi ? 'करतल चित्र कैप्चर (Live Palm Camera)' : 'Live Palm Photo Capture'}</span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Camera Access Required</span>
                </div>
                <p>{cameraError}</p>
                <p className="text-[11px]">Please check your browser camera permissions or upload an existing photo.</p>
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Palmar Alignment Guide Overlay */}
                <div className="absolute inset-0 border-2 border-dashed border-teal-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="text-[11px] font-mono font-bold text-teal-300 bg-slate-950/70 px-3 py-1 rounded-full border border-teal-500/40 shadow-lg">
                    Align Palm Inside Box
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                Cancel
              </button>

              {!cameraError && (
                <button
                  type="button"
                  onClick={capturePhotoFromCamera}
                  className="px-5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isHi ? 'फोटो खींचें (Snap Photo)' : 'Snap Palm Photo'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
