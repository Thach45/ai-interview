export const generateCvHtml = (data: any) => {
  if (!data) return '';
  
  const {
    fullName = '',
    jobTitle = '',
    objective = '',
    contact = {},
    education = [],
    computerSkills = [],
    languages = [],
    hardSkills = [],
    references = [],
    experiences = [],
    projects = [],
    certifications = [],
    activities = []
  } = data;

  return `
  <div class="relative overflow-hidden p-0 font-sans bg-white min-h-[900px] flex">
    <!-- Left background block -->
    <div class="absolute top-0 left-0 bottom-0 w-[35%] bg-[#1c385c] z-0"></div>

    <!-- Content Wrapper -->
    <div class="relative z-10 flex w-full">
      
      <!-- LEFT SIDEBAR -->
      <div class="w-[35%] px-8 text-white pt-12">
        <!-- Avatar -->
        <div class="flex justify-center mb-10">
          <div class="w-44 h-44 rounded-full p-1 bg-white">
            <img class="w-full h-full object-cover rounded-full" alt="Avatar" src="https://i.pravatar.cc/300?img=5">
          </div>
        </div>
        
        <!-- Contact -->
        <div class="mb-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Liên lạc</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <div class="flex flex-col gap-3">
            ${contact.phone ? `
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200">${contact.phone}</span>
            </div>` : ''}
            ${contact.email ? `
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200 break-all">${contact.email}</span>
            </div>` : ''}
            ${contact.birthday ? `
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200">${contact.birthday}</span>
            </div>` : ''}
            ${contact.address ? `
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 shrink-0 flex items-center justify-center rounded-sm bg-white/10 border border-white/20">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <span class="text-[11.5px] text-gray-200 leading-tight">${contact.address}</span>
            </div>` : ''}
          </div>
        </div>

        ${education && education.length > 0 ? `
        <!-- Education -->
        <div class="mb-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Học vấn</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          ${education.map((edu: any) => `
          <div class="mb-4">
            <p class="text-[11px] text-gray-300 italic mb-1">${edu.period}</p>
            <h3 class="text-[11px] font-bold text-white uppercase mb-1">${edu.school}</h3>
            ${edu.degree || edu.details?.length ? `
            <ul class="list-disc list-inside text-[11px] text-gray-200 space-y-0.5 ml-1">
              ${edu.degree ? `<li>${edu.degree}</li>` : ''}
              ${edu.details?.map((d: string) => `<li>${d}</li>`).join('') || ''}
            </ul>
            ` : ''}
          </div>
          `).join('')}
        </div>` : ''}

        ${computerSkills && computerSkills.length > 0 ? `
        <!-- Computer Skills -->
        <div class="mb-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Tin học</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          ${computerSkills.map((skill: any) => `
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11.5px] text-gray-200 flex items-center before:content-['•'] before:mr-2">${skill.name}</span>
            <span class="text-[11.5px] text-gray-200 font-bold flex items-center gap-1">${skill.level || ''} <svg class="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
          </div>
          `).join('')}
        </div>` : ''}

        ${languages && languages.length > 0 ? `
        <!-- Languages -->
        <div class="mb-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Ngoại ngữ</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          ${languages.map((lang: any) => `
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11.5px] text-gray-200 flex items-center before:content-['•'] before:mr-2">${lang.name}</span>
            <span class="text-[11.5px] text-white font-bold italic">${lang.level || ''}</span>
          </div>
          `).join('')}
        </div>` : ''}

        ${hardSkills && hardSkills.length > 0 ? `
        <!-- Professional Skills -->
        <div class="mb-8 mt-8">
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Kỹ năng chuyên môn</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          <ul class="list-none text-[11.5px] text-gray-200 space-y-2">
            ${hardSkills.map((skill: string) => `<li class="flex items-center before:content-['•'] before:mr-2">${skill}</li>`).join('')}
          </ul>
        </div>` : ''}

        ${references && references.length > 0 ? `
        <!-- References -->
        <div>
          <h2 class="text-[15px] font-bold text-white uppercase tracking-wider mb-2">Người tham chiếu</h2>
          <div class="w-full h-[1px] bg-white/40 mb-4"></div>
          ${references.map((ref: any) => `
          <div class="mb-3">
            <h3 class="text-[11.5px] font-bold text-white mb-0.5">${ref.name}</h3>
            <p class="text-[11.5px] text-gray-300 mb-1">${ref.role}</p>
            <p class="text-[11px] text-gray-300 flex items-center gap-2"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> ${ref.phone}</p>
          </div>
          `).join('')}
        </div>` : ''}
        
      </div>

      <!-- RIGHT MAIN CONTENT -->
      <div class="w-[65%] pl-10 pr-10 pt-16 text-left">
        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-[28px] text-gray-700 uppercase tracking-widest mb-1 font-light">${fullName}</h1>
          <h2 class="text-[13px] text-gray-500 font-bold uppercase tracking-[0.2em]">${jobTitle}</h2>
        </div>

        ${objective ? `
        <!-- Objective -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Mục tiêu nghề nghiệp</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-4"></div>
          <p class="text-[12px] leading-relaxed text-gray-700 text-justify">
            ${objective}
          </p>
        </div>` : ''}

        ${experiences && experiences.length > 0 ? `
        <!-- Experience -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Kinh nghiệm làm việc</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-6"></div>
          
          ${experiences.map((exp: any) => `
          <div class="relative pl-5 border-l-2 border-gray-300 mb-6 ml-1.5">
            <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1c385c] -left-[5.5px] top-1"></div>
            <div class="flex justify-between items-start mb-0.5">
              <h4 class="text-[13px] font-bold text-gray-800">${exp.company}</h4>
              <span class="text-[12px] text-gray-600">${exp.period}</span>
            </div>
            <p class="text-[12px] text-gray-600 font-bold mb-2">${exp.role}</p>
            <ul class="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-[1.6] space-y-1">
              ${exp.details.map((d: string) => `<li>${d}</li>`).join('')}
            </ul>
          </div>
          `).join('')}
        </div>` : ''}

        ${projects && projects.length > 0 ? `
        <!-- Projects -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Dự án thực tế</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-6"></div>
          
          ${projects.map((proj: any) => `
          <div class="relative pl-5 border-l-2 border-gray-300 mb-6 ml-1.5">
            <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1c385c] -left-[5.5px] top-1"></div>
            <div class="flex justify-between items-start mb-0.5">
              <h4 class="text-[13px] font-bold text-gray-800">${proj.name}</h4>
              <span class="text-[12px] text-gray-600">${proj.period}</span>
            </div>
            <p class="text-[12px] text-gray-600 font-bold mb-2">${proj.role}</p>
            <ul class="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-[1.6] space-y-1">
               ${proj.details.map((d: string) => `<li>${d}</li>`).join('')}
            </ul>
          </div>
          `).join('')}
        </div>` : ''}

        ${certifications && certifications.length > 0 ? `
        <!-- Certifications -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Chứng chỉ & Giải thưởng</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-4"></div>
          <div class="space-y-3">
            ${certifications.map((cert: any) => `
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-[13px] font-bold text-gray-800">${cert.name}</h4>
                <p class="text-[12px] text-gray-600">${cert.issuer}</p>
              </div>
              <span class="text-[12px] text-gray-600">${cert.year || ''}</span>
            </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${activities && activities.length > 0 ? `
        <!-- Activities -->
        <div class="mb-8">
          <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-widest mb-2">Hoạt động ngoại khóa</h3>
          <div class="w-full h-[1.5px] bg-gray-300 mb-4"></div>
          ${activities.map((act: any) => `
          <div class="mb-4">
            <div class="flex justify-between items-start mb-0.5">
              <h4 class="text-[13px] font-bold text-gray-800">${act.name}</h4>
              <span class="text-[12px] text-gray-600">${act.period}</span>
            </div>
            <p class="text-[12px] text-gray-600 italic mb-2">${act.role}</p>
            <ul class="list-disc list-outside ml-4 text-[12px] text-gray-700 leading-[1.6] space-y-1">
              ${act.details.map((d: string) => `<li>${d}</li>`).join('')}
            </ul>
          </div>
          `).join('')}
        </div>` : ''}
        
      </div>
    </div>
  </div>
  `;
};
