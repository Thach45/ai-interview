import { useCallback, useEffect, useRef, useState } from "react";
import type { MicVAD } from "@ricky0123/vad-web";

interface UseVoiceActivityDetectionOptions {
  /** Tạm dừng phát hiện — dùng khi AI đang nói để không bắt nhầm tiếng vọng từ loa. */
  paused: boolean;
  onSpeechEnd: (audioBlob: Blob) => void;
}

/**
 * Mã hoá Float32Array PCM (16kHz, mono) mà Silero VAD trả về thành file WAV,
 * vì backend hiện chỉ nhận multipart file (không nhận PCM thô).
 */
function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Voice Activity Detection chạy hoàn toàn local trong trình duyệt (Silero VAD qua ONNX
 * Runtime Web) — tự phát hiện lúc ứng viên bắt đầu/ngừng nói để gửi audio, không cần
 * bấm nút. Khác AssemblyAI: chỉ đếm im lặng, không đọc ngữ nghĩa câu.
 */
export const useVoiceActivityDetection = ({
  paused,
  onSpeechEnd,
}: UseVoiceActivityDetectionOptions) => {
  const [isReady, setIsReady] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const vadRef = useRef<MicVAD | null>(null);
  const pausedRef = useRef(paused);
  const onSpeechEndRef = useRef(onSpeechEnd);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    onSpeechEndRef.current = onSpeechEnd;
  }, [onSpeechEnd]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const { MicVAD } = await import("@ricky0123/vad-web");

      const vad = await MicVAD.new({
        baseAssetPath: "/vad/",
        onnxWASMBasePath: "/vad/",
        model: "v5",

        onSpeechStart: () => {
          if (pausedRef.current) return;
          setIsUserSpeaking(true);
        },

        onSpeechEnd: (audio: Float32Array) => {
          setIsUserSpeaking(false);
          if (pausedRef.current) return;
          const wavBlob = encodeWav(audio, 16000);
          onSpeechEndRef.current(wavBlob);
        },

        onVADMisfire: () => {
          setIsUserSpeaking(false);
        },

        // Ứng viên phỏng vấn hay ngừng để nghĩ; nới ngưỡng để không cắt cụt câu.
        redemptionMs: 1200,
        preSpeechPadMs: 300,
      });

      if (cancelled) {
        vad.destroy();
        return;
      }

      vadRef.current = vad;
      vad.start();
      setIsReady(true);
    };

    void init();

    return () => {
      cancelled = true;
      vadRef.current?.destroy();
      vadRef.current = null;
    };
  }, []);

  // Khi AI bắt đầu nói: chủ động tạm dừng nghe hẳn để không bắt tiếng vọng loa.
  useEffect(() => {
    if (!vadRef.current) return;
    if (paused) {
      vadRef.current.pause();
      setIsUserSpeaking(false);
    } else {
      vadRef.current.start();
    }
  }, [paused]);

  const forceStop = useCallback(() => {
    vadRef.current?.pause();
  }, []);

  return { isReady, isUserSpeaking, forceStop };
};
