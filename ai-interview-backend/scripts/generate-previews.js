const fs = require('fs');
const path = require('path');

const apiKey = 'AIzaSyClgTleBNFEcEVnPBucht87qPWkfSVde70';
const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

const personas = [
  {
    id: 'thao-chi',
    voice: 'vi-VN-Neural2-A',
    text: "Chào bạn. Tôi là Thảo Chi, chuyên viên phỏng vấn của bạn ngày hôm nay. Chúng ta sẽ cùng trao đổi chuyên sâu về các kỹ năng, kiến thức chuyên môn cũng như kinh nghiệm làm việc của bạn thông qua một số câu hỏi có cấu trúc. Hãy cố gắng trả lời một cách mạch lạc, đúng trọng tâm theo mô hình STAR nhé."
  },
  {
    id: 'nam-anh',
    voice: 'vi-VN-Wavenet-B',
    text: "Chào bạn nhé! Mình là Nam Anh. Bạn cứ bình tĩnh và thoải mái coi đây như một buổi trò chuyện trao đổi kinh nghiệm thông thường thôi nhé. Mình ở đây để giúp bạn thể hiện tốt nhất năng lực của bản thân, nên có gì cứ chia sẻ tự nhiên nha. Bạn đã sẵn sàng chưa nào?"
  },
  {
    id: 'quoc-hung',
    voice: 'vi-VN-Neural2-D',
    text: "Tôi là Quốc Hùng. Buổi phỏng vấn hôm nay sẽ đi thẳng vào các kiến thức thực tế và năng lực giải quyết vấn đề của bạn. Tôi hy vọng bạn sẽ trả lời ngắn gọn, thực tế, tránh nói lý thuyết suông và tập trung vào bản chất công việc. Chúng ta bắt đầu luôn nhé."
  },
  {
    id: 'linh-san',
    voice: 'vi-VN-Neural2-A',
    text: "Hi bạn! Mình là Linh San cực kỳ vui vẻ đây! Rất vui được gặp bạn trong phòng phỏng vấn hôm nay nha. Cứ thả lỏng tinh thần, chuẩn bị một ly nước ấm rồi chúng mình cùng nhau thảo luận những điều thú vị về chuyên môn của bạn nhé. Bắt đầu nha!"
  }
];

const outputDir = path.join(__dirname, '../../ai-interview-frontend/public/audio');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generate() {
  for (const p of personas) {
    console.log(`Đang tạo voice cho ${p.id}...`);
    const requestBody = {
      input: { text: p.text },
      voice: { languageCode: 'vi-VN', name: p.voice },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`Lỗi tạo voice cho ${p.id}:`, await response.text());
      continue;
    }

    const data = await response.json();
    const buffer = Buffer.from(data.audioContent, 'base64');
    fs.writeFileSync(path.join(outputDir, `${p.id}-preview.mp3`), buffer);
    console.log(`Đã lưu ${p.id}-preview.mp3 thành công!`);
  }
}

generate();
