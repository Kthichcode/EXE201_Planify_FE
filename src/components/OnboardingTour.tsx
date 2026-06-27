import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Map, Sparkles, LayoutDashboard, BookOpen, Users, Rocket, Bot, PenLine, UserCircle } from 'lucide-react';
import { userService } from '../services/userService';

// ── Tour Steps Definition ────────────────────────────────────────────────────
export interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string; // CSS selector của element cần highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Chào mừng đến với Planify! 🎉',
    description: 'Planify giúp bạn tạo và quản lý kế hoạch học tập, công việc một cách thông minh. Hãy để chúng tôi dẫn bạn qua các tính năng chính!',
    icon: <Rocket size={28} className="text-white" />,
    position: 'center',
  },
  {
    id: 'navbar-planning',
    title: 'Trang Lập Kế Hoạch',
    description: 'Nhấn vào "Ấn Này" trên thanh điều hướng để vào trang tạo lộ trình. Đây là nơi bạn sẽ bắt đầu xây dựng kế hoạch của mình!',
    icon: <Map size={28} className="text-white" />,
    targetSelector: '[data-tour="nav-planning"]',
    position: 'bottom',
  },
  {
    id: 'planning-ai-btn',
    title: 'Tạo kế hoạch bằng AI ✨',
    description: 'Chế độ "Trí Tuệ Nhân Tạo" — chỉ cần mô tả mục tiêu của bạn, AI sẽ tự động lên toàn bộ lộ trình chi tiết chỉ trong vài giây!',
    icon: <Bot size={28} className="text-white" />,
    targetSelector: '[data-tour="planning-ai-btn"]',
    position: 'bottom',
  },
  {
    id: 'planning-manual-btn',
    title: 'Tự lên kế hoạch ✏️',
    description: 'Chế độ "Tự Lên Kế Hoạch" — bạn toàn quyền quyết định từng bước, từng nhiệm vụ. Phù hợp khi bạn đã có sẵn ý tưởng rõ ràng.',
    icon: <PenLine size={28} className="text-white" />,
    targetSelector: '[data-tour="planning-manual-btn"]',
    position: 'bottom',
  },
  {
    id: 'navbar-my-plans',
    title: 'Kế hoạch của bạn',
    description: 'Tất cả lộ trình bạn đã tạo được lưu tại đây. Bạn có thể theo dõi tiến độ, tick hoàn thành từng nhiệm vụ và xem thống kê.',
    icon: <LayoutDashboard size={28} className="text-white" />,
    targetSelector: '[data-tour="nav-my-plans"]',
    position: 'bottom',
  },
  {
    id: 'navbar-community',
    title: 'Thư viện cộng đồng',
    description: 'Khám phá hàng trăm lộ trình được chia sẻ từ cộng đồng. Bạn có thể sao chép và chỉnh sửa theo ý muốn.',
    icon: <Users size={28} className="text-white" />,
    targetSelector: '[data-tour="nav-community"]',
    position: 'bottom',
  },
  {
    id: 'nav-user-profile',
    title: 'Hồ sơ & Lượt dùng AI 🧠',
    description: 'Nhấn vào tên của bạn ở góc phải để mở menu. Chọn "Hồ sơ của tôi" để xem số lượt tạo kế hoạch bằng AI còn lại, lịch sử dụng và thông tin tài khoản.',
    icon: <UserCircle size={28} className="text-white" />,
    targetSelector: '[data-tour="nav-user"]',
    position: 'bottom',
  },
  {
    id: 'ai-button',
    title: 'Trợ lý AI của bạn',
    description: 'Nút AI ở góc dưới phải màn hình — hỏi bất cứ điều gì về kế hoạch học tập, lộ trình phù hợp, hoặc cách quản lý thời gian hiệu quả!',
    icon: <Sparkles size={28} className="text-white" />,
    targetSelector: '[data-tour="ai-button"]',
    position: 'top',
  },
  {
    id: 'done',
    title: 'Bạn đã sẵn sàng! 🚀',
    description: 'Tuyệt vời! Bạn đã nắm được các tính năng cơ bản. Hãy bắt đầu bằng cách tạo kế hoạch đầu tiên của mình. Chúc bạn đạt được mọi mục tiêu!',
    icon: <BookOpen size={28} className="text-white" />,
    position: 'center',
  },
];

// ── Spotlight Hook ───────────────────────────────────────────────────────────
const useSpotlight = (selector?: string) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!selector) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(selector);
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [selector]);

  return rect;
};

// ── Tooltip Position Calculator ──────────────────────────────────────────────
const getTooltipStyle = (
  rect: DOMRect | null,
  position: TourStep['position'],
  tooltipRef: React.RefObject<HTMLDivElement>
): React.CSSProperties => {
  if (!rect || position === 'center') {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10001,
    };
  }

  const PADDING = 16;
  const tooltipW = tooltipRef.current?.offsetWidth || 380;
  const tooltipH = tooltipRef.current?.offsetHeight || 200;

  let top: number, left: number;

  switch (position) {
    case 'bottom':
      top = rect.bottom + PADDING;
      left = rect.left + rect.width / 2 - tooltipW / 2;
      break;
    case 'top':
      top = rect.top - tooltipH - PADDING;
      left = rect.left + rect.width / 2 - tooltipW / 2;
      break;
    case 'left':
      top = rect.top + rect.height / 2 - tooltipH / 2;
      left = rect.left - tooltipW - PADDING;
      break;
    case 'right':
      top = rect.top + rect.height / 2 - tooltipH / 2;
      left = rect.right + PADDING;
      break;
    default:
      top = rect.bottom + PADDING;
      left = rect.left + rect.width / 2 - tooltipW / 2;
  }

  // Clamp to viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  left = Math.max(PADDING, Math.min(left, vw - tooltipW - PADDING));
  top = Math.max(PADDING, Math.min(top, vh - tooltipH - PADDING));

  return {
    position: 'fixed',
    top,
    left,
    zIndex: 10001,
  };
};

// ── Welcome Modal ─────────────────────────────────────────────────────────────
interface WelcomeModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onAccept, onDecline }) => (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
       style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
    <div
      className="bg-white rounded-[32px] max-w-md w-full shadow-2xl overflow-hidden"
      style={{ animation: 'tourFadeIn 0.4s cubic-bezier(.22,1,.36,1)' }}
    >
      {/* Header gradient */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)' }}>
        <div className="absolute inset-0 opacity-20"
             style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
            <Rocket size={32} className="text-white" />
          </div>
          <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Planify Tour</span>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-3 text-center">
          Chào mừng bạn! 👋
        </h2>
        <p className="text-gray-500 text-center leading-relaxed mb-8">
          Bạn có muốn xem hướng dẫn nhanh về các tính năng chính của Planify không?
          Chỉ mất khoảng <span className="font-bold text-indigo-600">1 phút</span> thôi!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onAccept}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            🗺️ Bắt đầu hướng dẫn
          </button>
          <button
            onClick={onDecline}
            className="w-full py-3 rounded-2xl text-gray-400 font-medium text-sm hover:bg-gray-50 transition-all"
          >
            Để sau, tôi tự khám phá
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Main OnboardingTour Component ─────────────────────────────────────────────
interface OnboardingTourProps {
  isLoggedIn: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isLoggedIn }) => {
  const [phase, setPhase] = useState<'idle' | 'welcome' | 'touring' | 'done'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStep];
  const spotlightRect = useSpotlight(phase === 'touring' ? step?.targetSelector : undefined);
  const tooltipStyle = getTooltipStyle(spotlightRect, step?.position, tooltipRef);

  // ── Load onboarding status from BE ────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkOnboarding = async () => {
      try {
        const res = await userService.getOnboardingStatus();
        const data = res?.data ?? (res as any);

        if (data?.shouldShowTour || data?.status === 'not_started' || data?.status === 'in_progress') {
          // Resume từ bước đã dừng
          const resumeStep = data?.step ?? 0;
          setCurrentStep(Math.min(resumeStep, TOUR_STEPS.length - 1));
          setPhase(data?.status === 'in_progress' ? 'touring' : 'welcome');
        }
      } catch {
        // Nếu không gọi được BE (user chưa đăng nhập), không hiện tour
      }
    };

    checkOnboarding();
  }, [isLoggedIn]);

  // ── Save to BE ─────────────────────────────────────────────────────────────
  const saveToServer = useCallback(async (status: string, step: number) => {
    try {
      setIsSaving(true);
      await userService.updateOnboarding(status, step);
    } catch {
      // Lỗi network — vẫn tiếp tục tour
    } finally {
      setIsSaving(false);
    }
  }, []);

  // ── Scroll element into view when step changes ─────────────────────────────
  useEffect(() => {
    if (phase !== 'touring' || !step?.targetSelector) return;
    const el = document.querySelector(step.targetSelector);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [phase, currentStep, step]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAccept = async () => {
    setPhase('touring');
    setCurrentStep(0);
    await saveToServer('in_progress', 0);
  };

  const handleDecline = async () => {
    setPhase('done');
    await saveToServer('skipped', 0);
  };

  const handleNext = async () => {
    const nextStep = currentStep + 1;
    if (nextStep >= TOUR_STEPS.length) {
      setPhase('done');
      await saveToServer('completed', TOUR_STEPS.length);
      return;
    }
    setCurrentStep(nextStep);
    await saveToServer('in_progress', nextStep);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleStop = async () => {
    setPhase('done');
    await saveToServer('skipped', currentStep);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === 'idle' || phase === 'done') return null;

  if (phase === 'welcome') {
    return <WelcomeModal onAccept={handleAccept} onDecline={handleDecline} />;
  }

  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isCenterStep = step?.position === 'center' || !step?.targetSelector;
  const PADDING = 12;

  return (
    <>
      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
        }
        .tour-tooltip {
          animation: tourFadeIn 0.35s cubic-bezier(.22,1,.36,1);
        }
        .tour-highlight-ring {
          animation: tourPulse 2s infinite;
        }
      `}</style>

      {/* ── Dark Overlay with Spotlight cutout ── */}
      {!isCenterStep && spotlightRect ? (
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 9999 }}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={spotlightRect.x - PADDING}
                y={spotlightRect.y - PADDING}
                width={spotlightRect.width + PADDING * 2}
                height={spotlightRect.height + PADDING * 2}
                rx={12}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.65)"
            mask="url(#spotlight-mask)"
          />
          {/* Highlight border ring */}
          <rect
            x={spotlightRect.x - PADDING}
            y={spotlightRect.y - PADDING}
            width={spotlightRect.width + PADDING * 2}
            height={spotlightRect.height + PADDING * 2}
            rx={12}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="tour-highlight-ring"
          />
        </svg>
      ) : (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        />
      )}

      {/* 4-panel overlay — chặn click ngoài spotlight, nhưng cho phép click vào vùng highlight */}
      {spotlightRect && !isCenterStep ? (
        <>
          {/* Top panel */}
          <div className="fixed left-0 right-0" style={{ zIndex: 10000, top: 0, height: Math.max(0, spotlightRect.top - PADDING) }} />
          {/* Bottom panel */}
          <div className="fixed left-0 right-0" style={{ zIndex: 10000, top: spotlightRect.bottom + PADDING, bottom: 0 }} />
          {/* Left panel */}
          <div className="fixed" style={{ zIndex: 10000, top: Math.max(0, spotlightRect.top - PADDING), left: 0, width: Math.max(0, spotlightRect.left - PADDING), height: spotlightRect.height + PADDING * 2 }} />
          {/* Right panel */}
          <div className="fixed" style={{ zIndex: 10000, top: Math.max(0, spotlightRect.top - PADDING), left: spotlightRect.right + PADDING, right: 0, height: spotlightRect.height + PADDING * 2 }} />
        </>
      ) : (
        // Center step — block toàn màn hình (không có element cụ thể để click)
        <div className="fixed inset-0" style={{ zIndex: 10000 }} />
      )}

      {/* ── Tooltip Card ── */}
      <div
        ref={tooltipRef}
        className="tour-tooltip w-[380px] max-w-[calc(100vw-32px)]"
        style={tooltipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100">
          {/* Gradient header */}
          <div
            className="px-6 py-5 flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)' }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0 border border-white/30">
              {step?.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                Bước {currentStep + 1} / {TOUR_STEPS.length}
              </p>
              <h3 className="text-white font-black text-lg leading-tight">{step?.title}</h3>
            </div>
            <button
              onClick={handleStop}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              title="Dừng hướng dẫn"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-gray-600 leading-relaxed text-sm">{step?.description}</p>
          </div>

          {/* Progress dots */}
          <div className="px-6 pb-4 flex items-center justify-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === currentStep ? 20 : 6,
                  height: 6,
                  background: idx === currentStep
                    ? '#6366f1'
                    : idx < currentStep
                    ? '#a5b4fc'
                    : '#e5e7eb',
                }}
              />
            ))}
          </div>

          {/* Footer actions */}
          <div className="px-6 pb-6 flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                <ChevronLeft size={16} /> Quay lại
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {isLastStep ? (
                <>🎉 Hoàn tất!</>
              ) : (
                <>Tiếp theo <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>

        {/* Arrow pointer toward highlighted element */}
        {spotlightRect && step?.position === 'bottom' && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"
            style={{ zIndex: 10002 }}
          />
        )}
        {spotlightRect && step?.position === 'top' && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100"
            style={{ zIndex: 10002 }}
          />
        )}
      </div>
    </>
  );
};

export default OnboardingTour;
