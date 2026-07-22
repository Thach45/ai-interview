import React, { useState, useRef, useEffect } from 'react';

interface CvHtmlPreviewProps {
  html: string;
}

export const CvHtmlPreview: React.FC<CvHtmlPreviewProps> = ({ html }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(1131); // Default A4 height for 800px width

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && doc.body) {
          // Calculate the actual scroll height of the document inside the iframe
          const updateHeight = () => {
            const scrollHeight = Math.max(
              doc.documentElement.scrollHeight,
              doc.body.scrollHeight,
              doc.documentElement.offsetHeight,
              doc.body.offsetHeight
            );
            setIframeHeight(scrollHeight || 1131);
          };

          updateHeight();
          
          // Re-calculate after dynamic resources (Tailwind CDN, Google Fonts, images) load
          setTimeout(updateHeight, 300);
          setTimeout(updateHeight, 1000);
          setTimeout(updateHeight, 2000);
        }
      } catch (e) {
        console.error('Error reading iframe height:', e);
      }
    }
  };

  useEffect(() => {
    setIframeHeight(1131);
    const timer = setTimeout(() => {
      handleIframeLoad();
    }, 100);
    return () => clearTimeout(timer);
  }, [html]);

  // Inject responsive meta and CSS rules into the HTML document
  const getResponsiveHtml = (originalHtml: string) => {
    if (!originalHtml) return originalHtml;

    const responsiveStyles = `
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Force body to fit width and align elements correctly */
        html, body {
          width: 100% !important;
          max-width: 800px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          box-sizing: border-box !important;
        }
        
        /* Adjust margins and paddings dynamically */
        body {
          padding: 16px !important;
        }
        @media (min-width: 640px) {
          body {
            padding: 32px !important;
          }
        }
        @media (min-width: 800px) {
          body {
            padding: 48px !important;
          }
        }
        
        /* Stop images and other graphic components from overflowing */
        img {
          max-width: 100% !important;
          height: auto !important;
        }
      </style>
    `;

    if (originalHtml.includes('</head>')) {
      return originalHtml.replace('</head>', `${responsiveStyles}</head>`);
    }
    return responsiveStyles + originalHtml;
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        height: `${iframeHeight}px`,
      }}
      className="mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-white rounded-sm overflow-hidden"
    >
      <iframe
        ref={iframeRef}
        title="CV Preview"
        srcDoc={getResponsiveHtml(html)}
        onLoad={handleIframeLoad}
        className="w-full h-full border-none"
        sandbox="allow-same-origin allow-scripts"
        scrolling="no"
      />
    </div>
  );
};


