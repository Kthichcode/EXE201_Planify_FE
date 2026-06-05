import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Plus, RefreshCw } from 'lucide-react';
import { planService } from '../services/planService';

const MyPlans: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const response = await planService.getAllPlans();
        const rawPlans = (response as any).data || (response as any).Data || response;
        if (Array.isArray(rawPlans) && rawPlans.length > 0) {
          // Navigate to the latest plan
          navigate(`/plans/${rawPlans[0].id}`, { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error fetching plans on MyPlans mount:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAndRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <RefreshCw className="animate-spin text-primary mb-4" size={36} />
        <p className="text-gray-500 font-bold tracking-wide animate-pulse">ĐANG TẢI KẾ HOẠCH...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="text-center py-16 bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-8 md:p-12 shadow-sm max-w-lg w-full animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6">
          <Layout size={40} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-3">Chưa có kế hoạch nào</h3>
        <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
          Bạn chưa có lộ trình nào đang hoạt động. Hãy tạo một kế hoạch mới để bắt đầu hành trình của bạn!
        </p>
        <Link 
          to="/planning" 
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-ai text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={22} />
          Tạo lộ trình đầu tiên
        </Link>
      </div>
    </div>
  );
};

export default MyPlans;
