const fs = require('fs');

const raw = fs.readFileSync('API_DOCS.md', 'utf-8');
const lines = raw.split('\n');

const endpoints = [];
for (const line of lines) {
  if (line.startsWith('| **')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 4) {
      const method = parts[1].replace(/\*\*/g, '');
      const path = parts[2].replace(/`/g, '');
      const middlewares = parts[3];
      endpoints.push({ method, path, middlewares });
    }
  }
}

const groups = {
  Auth: [],
  User: [],
  CV: [],
  Job: [],
  Interview: [],
  Subscription: [],
  Notification: [],
  Admin: [],
  Other: []
};

endpoints.forEach(ep => {
  if (ep.path.startsWith('/api/v1/admin')) {
    groups.Admin.push(ep);
  } else if (ep.path.startsWith('/api/v1/auth')) {
    groups.Auth.push(ep);
  } else if (ep.path.startsWith('/api/v1/user')) {
    groups.User.push(ep);
  } else if (ep.path.startsWith('/api/v1/cvs') || ep.path.startsWith('/api/v1/analysis-cv')) {
    groups.CV.push(ep);
  } else if (ep.path.startsWith('/api/v1/job-templates') || ep.path.startsWith('/api/v1/categories')) {
    groups.Job.push(ep);
  } else if (ep.path.startsWith('/api/v1/interview-ai')) {
    groups.Interview.push(ep);
  } else if (ep.path.startsWith('/api/v1/subscriptions') || ep.path.startsWith('/api/v1/transactions')) {
    groups.Subscription.push(ep);
  } else if (ep.path.startsWith('/api/v1/notifications')) {
    groups.Notification.push(ep);
  } else {
    groups.Other.push(ep);
  }
});

let md = `# Tài liệu API Đầy Đủ (AI Interview)

Tài liệu này liệt kê toàn bộ API của dự án, được tự động phân tích và gom nhóm.

## THÔNG TIN CHUNG
- **Base URL:** \`http://localhost:3000/api/v1\`
- **Auth:** \`Authorization: Bearer <token>\`

`;

for (const [groupName, eps] of Object.entries(groups)) {
  if (eps.length === 0) continue;
  md += `## 📌 Nhóm: ${groupName}\n\n`;
  eps.forEach(ep => {
    md += `### \`[${ep.method}]\` ${ep.path}\n`;
    md += `- **Mô tả:** [Cần bổ sung]\n`;
    md += `- **Auth Required:** ${ep.middlewares.includes('auth') || ep.path.startsWith('/api/v1/admin') ? 'Yes' : 'No'}\n\n`;
  });
}

fs.writeFileSync('API_DOCS.md', md);
console.log('Formatted API_DOCS.md');
