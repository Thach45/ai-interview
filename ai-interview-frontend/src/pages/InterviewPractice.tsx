import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { InterviewHeader } from '../features/interviews/components/InterviewHeader';
import { InterviewChat } from '../features/interviews/components/InterviewChat';
import { InterviewInput } from '../features/interviews/components/InterviewInput';

const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'AI' as const,
    content: 'Chào mừng bạn đến với buổi phỏng vấn luyện tập cho vị trí Senior Frontend Developer. Tôi là trợ lý AI của bạn. Bạn đã sẵn sàng bắt đầu chưa?',
    timestamp: '14:30'
  },
  {
    id: '2',
    role: 'USER' as const,
    content: 'Tôi đã sẵn sàng, hãy bắt đầu đi.',
    timestamp: '14:31'
  },
  {
    id: '3',
    role: 'AI' as const,
    content: 'Rất tuyệt! Câu hỏi đầu tiên: Bạn hãy giới thiệu bản thân và chia sẻ về dự án React gần nhất mà bạn cảm thấy tâm đắc nhất nhé.',
    timestamp: '14:31'
  }
];

const InterviewPracticePage: React.FC = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'USER' as const,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response logic would go here
  };

  return (
    <MainLayout title="Luyện phỏng vấn AI">
      <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden">
        {/* Session Header */}
        <InterviewHeader 
          jobTitle="Senior Frontend Developer"
          duration="12:45"
          onEndSession={() => alert('Kết thúc phỏng vấn và chuyển sang trang kết quả...')}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-gray-100">
            <InterviewChat messages={messages} />
            <InterviewInput onSendMessage={handleSendMessage} />
          </div>

          {/* Right Sidebar: Tips & JD Context */}
          <aside className="hidden xl:flex w-80 flex-col bg-gray-50/50 p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                Tóm tắt JD
              </h3>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-4">
                  Phát triển ứng dụng Web quy mô lớn sử dụng React/TypeScript. Yêu cầu kiến thức sâu về Performance, State Management...
                </p>
                <button className="text-primary text-[12px] font-bold mt-3 hover:underline">Xem chi tiết</button>
              </div>
            </div>

            <div>
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">tips_and_updates</span>
                Gợi ý cho bạn
              </h3>
              <div className="space-y-3">
                {[
                  'Hãy tập trung vào kỹ thuật tối ưu render.',
                  'Đề cập đến kinh nghiệm phối hợp với team Design.',
                  'Nêu bật các dự án thực tế đã hoàn thành.'
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-primary font-bold text-[13px]">{i + 1}.</span>
                    <p className="text-[13px] text-text-secondary">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default InterviewPracticePage;
