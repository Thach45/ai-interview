import { useState, useEffect, useRef } from "react";
import { interviewAiApi } from "../api/interview-ai.api";

interface AudioItem {
  id: string;
  text: string; // Câu text tương ứng
  status: "pending" | "loading" | "ready" | "playing" | "done";
  audioUrl?: string; // Dạng data:audio/mp3;base64,...
}

export const useTTSPlayer = (sessionId: string, rawStreamText: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");

  // Dùng refs để giữ state không gây re-render quá nhiều
  const queueRef = useRef<AudioItem[]>([]);
  const isPlayingRef = useRef(false);
  const audioObjRef = useRef<HTMLAudioElement | null>(null);

  // Lưu index đã cắt để biết đâu là phần text mới
  const lastProcessedIndex = useRef(0);

  // Hàm nội bộ: Bắt đầu phát Audio trong hàng đợi
  const playNextInQueue = () => {
    if (isPlayingRef.current) return;

    // 1. Tìm file Audio đầu tiên chưa hoàn thành (khác 'done')
    const nextItemIndex = queueRef.current.findIndex(
      (item) => item.status !== "done",
    );
    if (nextItemIndex === -1) {
      // Đã phát hết hàng đợi
      setIsSpeaking(false);
      return;
    }

    const nextItem = queueRef.current[nextItemIndex];

    // 2. NẾU CHUNK TIẾP THEO ĐANG TẢI (chậm do dài hoặc do dính refresh token):
    // PHẢI CHỜ! Tuyệt đối không được nhảy cóc sang chunk sau hoặc tắt loa.
    if (nextItem.status === "loading" || nextItem.status === "pending") {
      // Không làm gì cả, cứ giữ nguyên trạng thái chờ.
      // Khi nào chunk này fetch xong, nó sẽ gọi lại playNextInQueue() và chạy tiếp.
      return;
    }

    // 3. Nếu chunk tiếp theo đã tải xong ('ready') thì mới phát
    if (nextItem.status === "ready") {
      isPlayingRef.current = true;
      setIsSpeaking(true);
      
      // Đánh dấu là đang phát
      queueRef.current[nextItemIndex].status = "playing";

    // Cập nhật Subtitle (đồng bộ text)
    // Nối thêm text mới vào spokenText hiện tại
    setSpokenText(
      (prev) =>
        prev +
        (prev.length > 0 && !prev.endsWith(" ") ? " " : "") +
        nextItem.text,
    );

    const audio = new Audio(nextItem.audioUrl);
    audioObjRef.current = audio;

    audio.play().catch((err) => {
      console.error("Lỗi phát Audio:", err);
      finishCurrentAudio(nextItemIndex);
    });

    audio.onended = () => {
      finishCurrentAudio(nextItemIndex);
    };
    }
  };

  const finishCurrentAudio = (index: number) => {
    queueRef.current[index].status = "done";
    isPlayingRef.current = false;
    audioObjRef.current = null;
    playNextInQueue(); // Gọi đệ quy phát cái tiếp theo
  };

  // Hàm gọi API lấy âm thanh
  const fetchTTS = async (textChunk: string) => {
    const id = Date.now().toString() + Math.random().toString();
    const newItem: AudioItem = {
      id,
      text: textChunk,
      status: "loading",
    };

    // Đẩy vào queue
    queueRef.current.push(newItem);

    try {
      const response = await interviewAiApi.generateTTS(sessionId, textChunk);

      // Tìm lại item trong queue và cập nhật audioUrl
      const itemToUpdate = queueRef.current.find((item) => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.status = "ready";
        itemToUpdate.audioUrl = `data:audio/mp3;base64,${response.audioBase64}`;
      }

      // Thử phát ngay nếu loa đang rảnh
      playNextInQueue();
    } catch (error) {
      console.error("Lỗi khi fetch TTS chunk:", error);
      // Đánh dấu lỗi để bỏ qua
      const itemToUpdate = queueRef.current.find((item) => item.id === id);
      if (itemToUpdate) itemToUpdate.status = "done";
      playNextInQueue();
    }
  };

  // Logic theo dõi rawStreamText và Cắt câu (Chunking)
  useEffect(() => {
    if (!rawStreamText) {
      // Reset khi bắt đầu câu trả lời mới
      if (lastProcessedIndex.current > 0) {
        lastProcessedIndex.current = 0;
        queueRef.current = [];
        setSpokenText("");
        setIsSpeaking(false);
        if (audioObjRef.current) {
          audioObjRef.current.pause();
          audioObjRef.current = null;
        }
        isPlayingRef.current = false;
      }
      return;
    }

    const newPart = rawStreamText.substring(lastProcessedIndex.current);

    // Biểu thức chính quy cắt câu dựa trên dấu chấm, phẩy, hỏi, than, hai chấm, xuống dòng
    // Nhóm match 1 bao gồm toàn bộ chuỗi cho đến hết dấu chấm câu (bao gồm cả khoảng trắng nếu có)
    const match = newPart.match(/([.?!,:\n]+)/);

    if (match) {
      const splitIndex = newPart.indexOf(match[0]) + match[0].length;
      const sentence = rawStreamText.substring(
        lastProcessedIndex.current,
        lastProcessedIndex.current + splitIndex,
      );

      // Di chuyển con trỏ lên
      lastProcessedIndex.current += splitIndex;

      // Gọi TTS
      if (sentence.trim().length > 0) {
        fetchTTS(sentence);
      }
    }
  }, [rawStreamText, sessionId]);

  return { isSpeaking, spokenText };
};
