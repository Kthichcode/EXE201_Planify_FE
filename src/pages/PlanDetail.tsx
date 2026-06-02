import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ListTree, RefreshCw, Clock, AlertCircle, 
  Trash2, Edit3, Send, User, Calendar, BookOpen, 
  ChevronRight, ChevronDown, CheckCircle, 
  Sparkles, Layers, X
} from 'lucide-react';
import { Plan, PlanTask, TaskStatus, TaskPriority } from '../types/plan.types';
import { planService } from '../services/planService';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

const PlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // States
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'kanban' | 'timeline'>('roadmap');
  const [selectedTask, setSelectedTask] = useState<PlanTask | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Workspace AI Chat States
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch plan details
  const fetchPlanDetails = useCallback(async () => {
    if (!id) return;
    try {
      const response = await planService.getPlanById(id);
      let planData: Plan | null = null;
      const rawData = (response as any).data || (response as any).Data || response;
      
      if (rawData && (rawData.id || rawData.Id)) {
        const mapTask = (t: any): PlanTask => ({
          ...t,
          id: t.id || t.Id,
          title: t.title || t.Title,
          description: t.description || t.Description,
          parentTaskId: t.parentTaskId || t.ParentTaskId,
          priority: (t.priority || t.Priority || 'medium').toLowerCase() as TaskPriority,
          status: (t.status || t.Status || 'todo').toLowerCase() as TaskStatus,
          progress: t.progress !== undefined ? t.progress : (t.Progress !== undefined ? t.Progress : 0),
          dueDate: t.dueDate || t.DueDate,
          startDate: t.startDate || t.StartDate,
          subTasks: (t.subTasks || t.SubTasks || []).map(mapTask)
        });

        const parsedPlan: Plan = {
          ...rawData,
          id: rawData.id || rawData.Id,
          title: rawData.title || rawData.Title,
          description: rawData.description || rawData.Description,
          goal: rawData.goal || rawData.Goal,
          progress: rawData.progress !== undefined ? rawData.progress : (rawData.Progress !== undefined ? rawData.Progress : 0),
          deadline: rawData.deadline || rawData.Deadline,
          isPublic: rawData.isPublic !== undefined ? rawData.isPublic : (rawData.IsPublic !== undefined ? rawData.IsPublic : false),
          tasks: (rawData.tasks || rawData.Tasks || []).map(mapTask)
        };
        planData = parsedPlan;
        
        if (parsedPlan.id) {
          localStorage.setItem('currentPlanId', parsedPlan.id);
        }

        // Initialize expanded state for categories if not set
        setExpandedCategories(prev => {
          const updated = { ...prev };
          parsedPlan.tasks.forEach(t => {
            if (!t.parentTaskId && updated[t.id] === undefined) {
              updated[t.id] = true;
            }
          });
          return updated;
        });
      }
      setPlan(planData);
    } catch (error: any) {
      console.error('Error fetching plan details:', error);
      if (!error.message.includes('405')) {
        localStorage.removeItem('currentPlanId');
        navigate('/my-plans');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  // Sync scroll for workspace AI chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Initial welcome message from AI based on Plan
  useEffect(() => {
    if (plan && chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          content: `Chào bạn! Tôi là Planify AI. Tôi đang hỗ trợ bạn thực hiện lộ trình "${plan.title}". Bạn cần tôi tối ưu hóa hay gợi ý thêm tài liệu học tập gì cho các nhiệm vụ bên phải không?`
        }
      ]);
    }
  }, [plan, chatMessages.length]);

  const handleUpdateTaskStatus = async (taskId: string, targetStatus: string) => {
    if (!plan?.id) return;
    try {
      await planService.updateTaskStatus(plan.id, taskId, targetStatus);
      showToast('Cập nhật trạng thái thành công!', 'success');
      
      // Refresh details
      await fetchPlanDetails();
      
      // Update selected task in drawer if open
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, status: targetStatus as TaskStatus } : null);
      }
    } catch (error: any) {
      showToast('Cập nhật trạng thái thất bại: ' + error.message, 'error');
    }
  };

  // HTML5 Drag and Drop Handlers for Kanban Board
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    // Find the task and check if status is already correct
    const allTasks = flatTasks();
    const task = allTasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      await handleUpdateTaskStatus(taskId, targetStatus);
    }
  };

  const handleSendWorkspaceMessage = async () => {
    if (!chatInput.trim() || isChatLoading || !plan) return;

    const userMsg = { role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    
    const originalInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Gửi prompt có kèm ngữ cảnh kế hoạch hiện tại để AI biết cách chỉnh sửa/nâng cấp
      const promptContext = `Tôi đang có kế hoạch: "${plan.title}". Mục tiêu ban đầu: "${plan.goal}". Yêu cầu chỉnh sửa chi tiết hơn: ${originalInput}`;
      
      const response = await aiService.generatePlan(promptContext);
      const newPlanId = response.planId || response.plan.id;

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Tôi đã tinh chỉnh lộ trình chi tiết hơn thành công! Đã tạo bản nháp mới: "${response.plan.title}". Hệ thống đang tự động chuyển bạn sang bản nháp mới để duyệt...` 
      }]);
      
      showToast('AI đã thiết kế lộ trình mới!', 'success');
      
      setTimeout(() => {
        navigate(`/plans/${newPlanId}`);
        setIsChatLoading(false);
      }, 2000);

    } catch (error: any) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Không thể xử lý yêu cầu chỉnh sửa kế hoạch. Vui lòng thử lại.' 
      }]);
      showToast('Lỗi khi tinh chỉnh lộ trình: ' + error.message, 'error');
      setIsChatLoading(false);
    }
  };

  const handleConfirmDraftPlan = async () => {
    if (!plan?.id) return;
    try {
      await planService.confirmPlan(plan.id);
      showToast('Kế hoạch đã được lưu thành công!', 'success');
      await fetchPlanDetails();
    } catch (error: any) {
      showToast('Lỗi khi xác nhận kế hoạch: ' + error.message, 'error');
    }
  };

  const handleDiscardDraftPlan = async () => {
    if (!plan?.id) return;
    try {
      await planService.deleteDraftPlan(plan.id);
      showToast('Đã hủy bản nháp kế hoạch.', 'info');
      localStorage.removeItem('currentPlanId');
      navigate('/my-plans');
    } catch (error: any) {
      showToast('Lỗi khi hủy bản nháp: ' + error.message, 'error');
    }
  };

  // Flatten tasks to display in Kanban/Timeline easily
  const flatTasks = (): PlanTask[] => {
    if (!plan) return [];
    const list: PlanTask[] = [];
    plan.tasks.forEach(parent => {
      // Add parent
      list.push(parent);
      // Add children
      if (parent.subTasks && parent.subTasks.length > 0) {
        list.push(...parent.subTasks);
      }
    });
    return list;
  };

  // Formatting date strings helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const getStatusColorClass = (status: TaskStatus) => {
    switch (status) {
      case 'done': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'done': return 'Đã xong';
      case 'in_progress': return 'Đang làm';
      default: return 'Cần làm';
    }
  };

  const getPriorityColorClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600';
      case 'medium': return 'bg-amber-50 text-amber-600';
      default: return 'bg-emerald-50 text-emerald-600';
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Vừa';
      default: return 'Thấp';
    }
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Render Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <RefreshCw className="animate-spin text-primary mb-4" size={36} />
        <p className="text-gray-500 font-bold tracking-wide animate-pulse">ĐANG TẢI LỘ TRÌNH CHI TIẾT...</p>
      </div>
    );
  }

  // Render Not Found
  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <AlertCircle size={64} className="text-red-400 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy lộ trình</h2>
        <p className="text-gray-500 mb-6">Có thể lộ trình đã bị xóa hoặc bạn không có quyền truy cập.</p>
        <Link to="/my-plans" className="px-8 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Quay lại danh sách</Link>
      </div>
    );
  }

  // Calculate statistics
  const doneTasks = flatTasks().filter(t => t.status === 'done').length;
  const inProgressTasks = flatTasks().filter(t => t.status === 'in_progress').length;
  const todoTasks = flatTasks().filter(t => t.status === 'todo').length;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-surface font-sans flex flex-col">
      {/* Top Banner and Summary Card */}
      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 mt-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-3">
              {plan.status === 'draft' && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                  Bản nháp AI (Tạm thời)
                </span>
              )}
              {plan.isAIGenerated && (
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={10} /> Trí tuệ nhân tạo
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">{plan.title}</h1>
            <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">{plan.description || plan.goal}</p>
            
            {/* Progress segment */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-grow max-w-md bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" 
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-black text-primary">{plan.progress}% hoàn thành</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {plan.status === 'draft' ? (
              <>
                <button 
                  onClick={handleDiscardDraftPlan}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <X size={14} /> Hủy bản nháp
                </button>
                <button 
                  onClick={handleConfirmDraftPlan}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 transition-all"
                >
                  <CheckCircle size={14} /> Lưu & Kích hoạt
                </button>
              </>
            ) : (
              <>
                <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">
                  <Edit3 size={14} /> Chỉnh sửa
                </button>
                <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 border border-red-100 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 active:scale-95 transition-all">
                  <Trash2 size={14} /> Xóa
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Split Pane */}
      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: AI Chat Co-Pilot (Cột trái 4 cột) */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* AI Header */}
          <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-primary/5 to-secondary/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-primary/20 overflow-hidden shadow-sm">
              <img src="/ai-bot.jpg" alt="AI Bot" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">Planify AI Co-Pilot</h3>
              <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Đang trực tuyến
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-gray-50/20">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 bg-white">
                    {msg.role === 'user' ? (
                      <div className="w-full h-full bg-primary text-white flex items-center justify-center">
                        <User size={14} />
                      </div>
                    ) : (
                      <img src="/ai-bot.jpg" alt="AI" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10' 
                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-100 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-gray-100 bg-white">
                    <img src="/ai-bot.jpg" alt="AI" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 bg-white text-gray-400 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm italic text-xs flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin text-primary" />
                    AI đang soạn câu trả lời...
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-50 bg-white">
            <div className="relative">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendWorkspaceMessage()}
                placeholder="Yêu cầu AI cập nhật hay hỏi về task..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary/20 transition-all text-xs"
              />
              <button 
                onClick={handleSendWorkspaceMessage}
                disabled={!chatInput.trim() || isChatLoading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                  chatInput.trim() && !isChatLoading ? 'bg-primary text-white shadow-md' : 'text-gray-300'
                }`}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive View Canvas (Cột phải 8 cột) */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 flex flex-col min-h-[500px]">
          
          {/* Tabs Selector & Quick Stats */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-50">
            <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'roadmap' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ListTree size={14} /> Lộ trình Sơ đồ
              </button>
              <button 
                onClick={() => setActiveTab('kanban')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'kanban' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Layers size={14} /> Bảng Kanban
              </button>
              <button 
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'timeline' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Calendar size={14} /> Dòng thời gian
              </button>
            </div>

            <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              <div>Cần làm: <span className="text-gray-700 font-black">{todoTasks}</span></div>
              <div className="w-px h-3.5 bg-gray-200"></div>
              <div>Đang làm: <span className="text-blue-500 font-black">{inProgressTasks}</span></div>
              <div className="w-px h-3.5 bg-gray-200"></div>
              <div>Đã xong: <span className="text-emerald-500 font-black">{doneTasks}</span></div>
            </div>
          </div>

          {/* TAB 1: ROADMAP TREE VIEW */}
          {activeTab === 'roadmap' && (
            <div className="flex-grow pt-6 space-y-6 overflow-y-auto max-h-[500px]">
              {plan.tasks.filter(t => !t.parentTaskId).map((category, idx) => {
                const subtasks = category.subTasks && category.subTasks.length > 0 
                  ? category.subTasks 
                  : plan.tasks.filter(t => t.parentTaskId === category.id);
                const isExpanded = expandedCategories[category.id] !== false;
                const completedSub = subtasks.filter(s => s.status === 'done').length;

                return (
                  <div key={category.id} className="border border-gray-100 rounded-3xl p-5 hover:border-gray-200 transition-all">
                    {/* Category Header Card */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleCategory(category.id)}
                          className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
                        >
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                          {idx + 1}
                        </div>
                        <h3 
                          className="font-black text-gray-800 text-sm hover:text-primary cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedTask(category);
                            setIsDrawerOpen(true);
                          }}
                        >
                          {category.title}
                        </h3>
                        {subtasks.length > 0 && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">
                            {completedSub}/{subtasks.length} Hoàn thành
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${getPriorityColorClass(category.priority)}`}>
                          {getPriorityLabel(category.priority)}
                        </span>
                        {subtasks.length === 0 && (
                          <button 
                            onClick={() => handleUpdateTaskStatus(category.id, category.status === 'done' ? 'todo' : 'done')}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              category.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 hover:border-primary'
                            }`}
                          >
                            {category.status === 'done' && <CheckCircle size={12} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subtasks List */}
                    {isExpanded && subtasks.length > 0 && (
                      <div className="mt-4 pl-9 space-y-2 border-l border-dashed border-gray-100 ml-4">
                        {subtasks.map((task) => (
                          <div 
                            key={task.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50/50 rounded-2xl group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleUpdateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  task.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 hover:border-emerald-500'
                                }`}
                              >
                                {task.status === 'done' && <CheckCircle size={12} />}
                              </button>
                              <span 
                                onClick={() => {
                                  setSelectedTask(task);
                                  setIsDrawerOpen(true);
                                }}
                                className={`text-xs font-bold hover:text-primary cursor-pointer transition-colors ${
                                  task.status === 'done' ? 'text-gray-300 line-through' : 'text-gray-600 font-bold'
                                }`}
                              >
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${getPriorityColorClass(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                              </span>
                              <span className={`px-2 py-0.5 border rounded-md text-[8px] font-black uppercase tracking-wider ${getStatusColorClass(task.status)}`}>
                                {getStatusLabel(task.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: KANBAN BOARD */}
          {activeTab === 'kanban' && (
            <div className="flex-grow pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto max-h-[500px]">
              {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => {
                const columnTasks = flatTasks().filter(t => t.status === status);
                
                return (
                  <div 
                    key={status}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                    className="bg-gray-50/50 border border-gray-100 rounded-3xl p-4 flex flex-col min-h-[400px]"
                  >
                    {/* Lane Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          status === 'done' ? 'bg-emerald-500' : status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></span>
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
                          {status === 'done' ? 'Đã xong' : status === 'in_progress' ? 'Đang làm' : 'Cần làm'}
                        </h4>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 bg-white border border-gray-100 w-5 h-5 rounded-full flex items-center justify-center">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Column Cards */}
                    <div className="flex-grow space-y-3 overflow-y-auto pr-1">
                      {columnTasks.length === 0 ? (
                        <div className="h-full border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center text-center p-6 text-gray-300">
                          <p className="text-[10px] font-bold">Kéo thả thẻ nhiệm vụ vào đây</p>
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => {
                              setSelectedTask(task);
                              setIsDrawerOpen(true);
                            }}
                            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-grab active:cursor-grabbing group relative"
                          >
                            <h5 className="text-xs font-black text-gray-800 leading-snug group-hover:text-primary transition-colors mb-2 truncate">
                              {task.title}
                            </h5>
                            
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${getPriorityColorClass(task.priority)}`}>
                                {getPriorityLabel(task.priority)}
                              </span>
                              {task.dueDate && (
                                <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">
                                  <Clock size={10} /> {formatDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: TIMELINE GANTT VIEW */}
          {activeTab === 'timeline' && (
            <div className="flex-grow pt-6 space-y-6 overflow-y-auto max-h-[500px]">
              {plan.tasks.filter(t => !t.parentTaskId).map((category, idx) => {
                const subtasks = category.subTasks && category.subTasks.length > 0 
                  ? category.subTasks 
                  : plan.tasks.filter(t => t.parentTaskId === category.id);
                const completed = subtasks.filter(s => s.status === 'done').length;
                const progressPercent = subtasks.length 
                  ? Math.round((completed / subtasks.length) * 100) 
                  : (category.status === 'done' ? 100 : 0);

                return (
                  <div key={category.id} className="grid grid-cols-12 items-center gap-4 p-4 border border-gray-50 hover:bg-gray-50/20 rounded-2xl transition-all">
                    {/* Phase number & name */}
                    <div className="col-span-12 md:col-span-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                          GĐ {idx + 1}
                        </span>
                        <h4 className="text-xs font-black text-gray-800 truncate" title={category.title}>
                          {category.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Calendar size={10} />
                        {category.startDate ? formatDate(category.startDate) : 'Chờ thiết lập'} - {category.dueDate ? formatDate(category.dueDate) : 'Chờ thiết lập'}
                      </p>
                    </div>

                    {/* Progress Slider Display */}
                    <div className="col-span-12 md:col-span-7 flex items-center gap-3">
                      <div className="flex-grow bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 w-8 text-right">{progressPercent}%</span>
                    </div>

                    {/* Target Button to Detail */}
                    <div className="col-span-12 md:col-span-2 text-right">
                      <button 
                        onClick={() => {
                          setSelectedTask(category);
                          setIsDrawerOpen(true);
                        }}
                        className="px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase text-gray-600 transition-all w-full text-center"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Task Details Side-Over Drawer */}
      {isDrawerOpen && selectedTask && (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
          {/* Overlay background */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            {/* Drawer Content */}
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Chi tiết nhiệm vụ
                  </span>
                  <h3 className="text-sm font-black text-gray-900 truncate max-w-[280px]">
                    {selectedTask.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                
                {/* Details Fields */}
                <div className="space-y-4">
                  {/* Status Dropdown selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Trạng thái</label>
                      <select 
                        value={selectedTask.status}
                        onChange={(e) => handleUpdateTaskStatus(selectedTask.id, e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-transparent hover:border-gray-200 rounded-2xl text-xs font-bold text-gray-700 outline-none transition-all appearance-none"
                      >
                        <option value="todo">Cần làm</option>
                        <option value="in_progress">Đang làm</option>
                        <option value="done">Đã xong</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Độ ưu tiên</label>
                      <div className={`p-3 rounded-2xl text-center text-xs font-black uppercase tracking-wider ${getPriorityColorClass(selectedTask.priority)}`}>
                        {getPriorityLabel(selectedTask.priority)}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-4 my-2">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Bắt đầu</span>
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" /> {selectedTask.startDate ? formatDate(selectedTask.startDate) : 'Chưa xếp lịch'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Hạn chót</span>
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" /> {selectedTask.dueDate ? formatDate(selectedTask.dueDate) : 'Chưa xếp lịch'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Mô tả công việc</label>
                    <div className="bg-gray-50/50 p-4 border border-gray-100 rounded-2xl text-xs text-gray-600 leading-relaxed min-h-[80px] whitespace-pre-wrap">
                      {selectedTask.description || 'Không có mô tả chi tiết cho nhiệm vụ này.'}
                    </div>
                  </div>
                </div>

                {/* AI Study Resources Section */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <BookOpen size={16} />
                    <h4 className="text-xs font-black uppercase tracking-wider">Tài liệu học tập gợi ý</h4>
                  </div>
                  
                  <p className="text-[11px] text-gray-400 font-bold leading-normal">
                    AI đã tổng hợp một số liên kết tham khảo uy tín dựa trên tên nhiệm vụ để giúp bạn bắt đầu:
                  </p>

                  <div className="space-y-3">
                    <a 
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent('Hướng dẫn tự học ' + selectedTask.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-red-50/20 hover:bg-red-50/50 border border-red-100/50 rounded-2xl transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        YT
                      </div>
                      <div className="flex-grow">
                        <h5 className="text-xs font-bold text-gray-700 group-hover:text-red-600 transition-colors">Video Youtube Hướng dẫn</h5>
                        <p className="text-[9px] text-gray-400 font-bold">Tìm kiếm các bài giảng video...</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent('Tài liệu tự học ' + selectedTask.title + ' pdf')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-blue-50/20 hover:bg-blue-50/50 border border-blue-100/50 rounded-2xl transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        GG
                      </div>
                      <div className="flex-grow">
                        <h5 className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Tìm giáo trình & tài liệu PDF</h5>
                        <p className="text-[9px] text-gray-400 font-bold">Tìm kiếm tài liệu học thuật trên Google...</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl text-xs hover:bg-gray-50 transition-all text-center"
                >
                  Đóng lại
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetail;
