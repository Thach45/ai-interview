import React, { useState } from 'react';

interface InterviewInputProps {
  onSendMessage: (content: string) => void;
  isRecording?: boolean;
}

export const InterviewInput: React.FC<InterviewInputProps> = ({ onSendMessage, isRecording = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto flex items-end gap-3">
        {/* Voice Toggle Button */}
        <button 
          className={`size-12 rounded-xl flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-100 text-text-secondary hover:bg-primary/10 hover:text-primary'
          }`}
          title="Trả lời bằng giọng nói"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isRecording ? 'mic' : 'mic_none'}
          </span>
        </button>

        {/* Text Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập câu trả lời của bạn..."
            rows={1}
            className="w-full bg-gray-50 border-none rounded-2xl pl-4 pr-12 py-3.5 text-[14px] focus:ring-2 focus:ring-primary/20 resize-none outline-none custom-scrollbar"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 bottom-2 size-9 bg-primary text-white rounded-xl flex items-center justify-center hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>
      <p className="text-center text-[11px] text-text-secondary mt-3">
        Sử dụng <span className="font-bold text-primary">Enter</span> để gửi • Nhấn giữ <span className="font-bold text-primary">Space</span> để nói
      </p>
    </div>
  );
};
