import React, { useState, useRef } from 'react';
import { Upload, HardDrive, Link2, Eye, HelpCircle, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface ImageSelectionWidgetProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  maxDim?: number; // Maximum width or height for local images
}

// Utility to convert general Google Drive sharing link to direct embed URL
const convertGoogleDriveUrl = (url: string): { fileId: string; directUrl: string } | null => {
  if (!url) return null;
  const cleaned = url.trim();

  const gdRegex1 = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdRegex2 = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const gdRegex3 = /docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdRegex4 = /drive\.google\.com\/uc\?.*?id=([a-zA-Z0-9_-]+)/;

  let fileId = '';
  if (gdRegex1.test(cleaned)) {
    fileId = cleaned.match(gdRegex1)?.[1] || '';
  } else if (gdRegex2.test(cleaned)) {
    fileId = cleaned.match(gdRegex2)?.[1] || '';
  } else if (gdRegex3.test(cleaned)) {
    fileId = cleaned.match(gdRegex3)?.[1] || '';
  } else if (gdRegex4.test(cleaned)) {
    fileId = cleaned.match(gdRegex4)?.[1] || '';
  }

  // If the input is just a plain 33-char alphanumeric Google Drive ID
  if (!fileId && /^[a-zA-Z0-9_-]{25,45}$/.test(cleaned)) {
    fileId = cleaned;
  }

  if (fileId) {
    return {
      fileId,
      directUrl: `https://lh3.googleusercontent.com/d/${fileId}`
    };
  }

  return null;
};

export const ImageSelectionWidget: React.FC<ImageSelectionWidgetProps> = ({
  value,
  onChange,
  label,
  placeholder = 'أدخل رابط الصورة أو صلة الملف المباشرة...',
  maxDim = 800
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'drive' | 'url'>('gallery');
  const [driveInput, setDriveInput] = useState('');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:image/') && !value.includes('lh3.googleusercontent.com/d/') ? value : '');
  const [showDriveInstructions, setShowDriveInstructions] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress and resize image using HTML5 Canvas to keep local Base64 values tiny (localStorage friendly)
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صور صالح فقط.');
      return;
    }

    setIsCompiling(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down maintaining aspect ratio
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context could not be acquired');
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Output compressed jpeg (quality 0.75-0.80 creates small but beautiful results)
          const base64Result = canvas.toDataURL('image/jpeg', 0.8);
          
          onChange(base64Result);
          setIsCompiling(false);
        } catch (err) {
          console.error(err);
          setErrorMessage('حدث خطأ أثناء معالجة ضغط الصورة.');
          setIsCompiling(false);
        }
      };

      img.onerror = () => {
        setErrorMessage('فشل في تحميل الصورة المحددة.');
        setIsCompiling(false);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setErrorMessage('فشل في قراءة ملف الصورة.');
      setIsCompiling(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDriveSubmit = () => {
    setErrorMessage('');
    const conversion = convertGoogleDriveUrl(driveInput);
    if (conversion) {
      onChange(conversion.directUrl);
      setDriveInput('');
    } else {
      setErrorMessage('الرابط المدخل لا يبدو كرابط Google Drive مشاركة صالح. يرجى مراجعة التعليمات أدناه.');
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const clearImage = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إزالة هذه الصورة؟')) {
      onChange('');
      setUrlInput('');
      setDriveInput('');
    }
  };

  const isLocalBase64 = value && value.startsWith('data:image/');
  const isGoogleDriveImage = value && value.includes('lh3.googleusercontent.com/d/');

  return (
    <div className="space-y-3 font-sans text-right" dir="rtl">
      {/* Label and preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-black text-gray-700">{label}</label>
        
        {value && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {isLocalBase64 ? 'صورة مرفوعة محلياً (مضغوطة)' : isGoogleDriveImage ? 'رابط ملف Google Drive مباشر' : 'رابط إنترنت خارجي'}
            </span>
            <button
              type="button"
              onClick={clearImage}
              className="text-[10px] text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
            >
              حذف الصورة
            </button>
          </div>
        )}
      </div>

      {/* Main interface with side previwer */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch bg-gray-50/50 p-3 rounded-2xl border border-gray-150">
        
        {/* Left/Middle Action Zone */}
        <div className="flex-1 space-y-3 flex flex-col justify-between">
          
          {/* Sub-Tabs Selector */}
          <div className="flex bg-neutral-200/50 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-1 px-1.5 text-xs font-black rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                activeTab === 'gallery'
                  ? 'bg-white text-royal-purple shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>معرض الصور</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drive')}
              className={`flex-1 py-1 px-1.5 text-xs font-black rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                activeTab === 'drive'
                  ? 'bg-white text-royal-purple shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Google Drive</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1 px-1.5 text-xs font-black rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-royal-purple shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>رابط مخصّص</span>
            </button>
          </div>

          {/* TAB 1: Gallery / Device Upload */}
          {activeTab === 'gallery' && (
            <div className="flex-1 flex flex-col justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLocalFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                disabled={isCompiling}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-purple hover:bg-neutral-50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  isCompiling ? 'opacity-60 cursor-wait' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-purple-soft flex items-center justify-center text-brand-purple">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-gray-700">اضغط هنا لتحميل صورة من جهازك</p>
                  <p className="text-[10px] text-gray-500 mt-1">سيتم تقليص حجمها تلقائياً لضمان حفظ فائض المساحة</p>
                </div>
              </button>
            </div>
          )}

          {/* TAB 2: Google Drive Embedder */}
          {activeTab === 'drive' && (
            <div className="flex-1 space-y-2 flex flex-col justify-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={driveInput}
                  onChange={(e) => {
                    setDriveInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="اصق رابط مشاركة الملف لـ Google Drive..."
                  className="flex-1 p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-mono bg-white text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleDriveSubmit}
                  className="bg-brand-purple hover:bg-royal-purple text-white text-xs font-bold px-3.5 rounded-xl cursor-pointer"
                >
                  تأكيد
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDriveInstructions(!showDriveInstructions)}
                  className="text-[10px] text-royal-purple font-bold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>كيف أحصل على رابط Google Drive صالح للصور؟</span>
                </button>
              </div>

              {showDriveInstructions && (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-[10px] text-gray-700 space-y-1.5 leading-relaxed">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1">📍 خطوات المشاركة لـ Google Drive:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-650 pr-1">
                    <li>افتح جوجل درايف ثم انقر بزر الفأرة الأيمن على الصورة.</li>
                    <li>اختر <strong>مشاركة (Share)</strong> ثم <strong>مشاركة مع أشخاص آخرين</strong>.</li>
                    <li>من "وصول عام" قم بتغيير الخيار من "حصري" إلى <strong>كل من لديه الرابط (Anyone with the link)</strong> بصفة عارض (Viewer).</li>
                    <li>انسخ الرابط والصقه في المربع أعلاه، وسنقوم تلقائياً بتحويله ليعمل مباشرة كصورة في موقعك!</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Custom Web Link (URL) */}
          {activeTab === 'url' && (
            <div className="flex-1 space-y-2 flex flex-col justify-center">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder={placeholder}
                  className="flex-1 p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-purple text-xs font-mono bg-white text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="bg-brand-purple hover:bg-royal-purple text-white text-xs font-bold px-3.5 rounded-xl cursor-pointer"
                >
                  تطبيق
                </button>
              </div>
              <p className="text-[10px] text-gray-500">لصق رابط مباشر ينتهي بـ png أو webp أو jpg.</p>
            </div>
          )}

          {/* Error Feedbacks */}
          {errorMessage && (
            <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Right Preview Zone */}
        <div className="w-full md:w-28 flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-gray-250 pt-3 md:pt-0 md:pr-4">
          <div className="w-20 h-20 rounded-xl border border-gray-250 bg-white flex items-center justify-center overflow-hidden shadow-xs relative group/preview">
            {value ? (
              <>
                <img
                  src={value}
                  alt="مستعرض"
                  className="w-full h-full object-contain p-1"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-all">
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-white text-gray-700 text-xs"
                    title="مشاهدة بالحجم الكامل"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>
              </>
            ) : (
              <div className="text-gray-400 flex flex-col items-center gap-1">
                <Eye className="w-5 h-5 opacity-40" />
                <span className="text-[9px] font-medium">بلا صورة</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
