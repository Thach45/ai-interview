import { ImageResponse } from 'next/og';

export const alt = 'Arion — Luyện phỏng vấn AI và tối ưu CV theo JD';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'stretch',
          background: '#ffffff',
          color: '#09090b',
          display: 'flex',
          height: '100%',
          padding: '64px',
          position: 'relative',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '57%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.04em' }}>
            <div style={{ alignItems: 'center', background: '#09090b', color: '#ffffff', display: 'flex', fontSize: '20px', fontWeight: 700, height: '38px', justifyContent: 'center', width: '38px' }}>A</div>
            ARION
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '62px', fontWeight: 700, letterSpacing: '-0.07em', lineHeight: 1.02 }}>
              <span>Luyện tốt hơn.</span>
              <span>Ứng tuyển tự tin hơn.</span>
            </div>
            <div style={{ color: '#52525b', fontSize: '25px', lineHeight: 1.35 }}>Luyện phỏng vấn với AI và tối ưu CV theo JD.</div>
          </div>
          <div style={{ color: '#71717a', display: 'flex', fontSize: '19px', gap: '18px' }}>
            <span>CV Optimization</span><span>•</span><span>Mock Interview</span><span>•</span><span>Feedback</span>
          </div>
        </div>
        <div style={{ alignItems: 'center', background: '#f4f4f5', border: '1px solid #e4e4e7', display: 'flex', flex: 1, justifyContent: 'center', marginLeft: '44px', padding: '28px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #d4d4d8', borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '20px', padding: '28px', width: '100%' }}>
            <div style={{ alignItems: 'center', borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}><span style={{ fontSize: '17px', fontWeight: 700 }}>Arion Interview</span><span style={{ color: '#71717a', fontSize: '14px' }}>Frontend Engineer</span></div>
              <span style={{ color: '#047857', fontSize: '14px', fontWeight: 700 }}>● Live</span>
            </div>
            <div style={{ background: '#f4f4f5', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
              <span style={{ fontSize: '16px', lineHeight: 1.4 }}>Hãy kể về một dự án bạn đã cải thiện đáng kể trải nghiệm người dùng.</span>
              <div style={{ background: '#09090b', borderRadius: '999px', height: '14px', width: '72%' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}><span style={{ background: '#09090b', borderRadius: '999px', height: '9px', width: '35%' }} /><span style={{ background: '#d4d4d8', borderRadius: '999px', height: '9px', width: '24%' }} /></div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
