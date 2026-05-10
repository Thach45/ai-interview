import React from 'react';

interface Message {
  id: string;
  role: 'AI' | 'USER';
  content: string;
  timestamp: string;
}

interface InterviewChatProps {
  messages: Message[];
}

export const InterviewChat: React.FC<InterviewChatProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex ${msg.role === 'AI' ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`max-w-[80%] flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`size-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${
              msg.role === 'AI' 
                ? 'bg-primary/10 text-primary border-primary/20' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {msg.role === 'AI' ? 'smart_toy' : 'person'}
              </span>
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
              msg.role === 'AI' 
                ? 'bg-gray-50 text-text-primary rounded-tl-none border border-gray-100' 
                : 'bg-primary text-white rounded-tr-none'
            }`}>
              {msg.content}
              <div className={`mt-2 text-[10px] font-medium opacity-50 ${msg.role === 'USER' ? 'text-right' : ''}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Typing Indicator Placeholder */}
      <div className="flex justify-start">
        <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
          <span className="size-1.5 bg-gray-300 rounded-full animate-bounce"></span>
          <span className="size-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="size-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  );
};
