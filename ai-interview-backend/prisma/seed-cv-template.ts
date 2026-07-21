/**
 * Seed script: Thêm mẫu CV template Handlebars vào database
 * Chạy: npx tsx prisma/seed-cv-template.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEMPLATE_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Be Vietnam Pro', sans-serif; margin: 0; background: white; color: #333; }
    h1, h2, h3, h4, .serif { font-family: 'Be Vietnam Pro', sans-serif; }
    {{{cssStyles}}}
  </style>
</head>
<body class="bg-white min-h-[1131px] w-[800px] mx-auto p-12 box-border">

  <header class="flex justify-between items-start mb-10">
    <div class="max-w-[65%]">
      <h1 class="text-[36px] font-bold text-gray-900 mb-1 serif">{{fullName}}</h1>
      <h2 class="text-[18px] text-gray-800 font-semibold mb-3 serif">{{jobTitle}}</h2>
      {{#if objective}}
      <p class="text-[13.5px] text-gray-500 leading-[1.7] text-justify pr-4">{{objective}}</p>
      {{/if}}
    </div>
    <div class="text-right text-[12.5px] text-gray-500 leading-relaxed mt-2 flex flex-col gap-0.5 shrink-0">
      {{#if contact.address}}<div>{{contact.address}}</div>{{/if}}
      {{#if contact.phone}}<div>{{contact.phone}}</div>{{/if}}
      {{#if contact.email}}<div>{{contact.email}}</div>{{/if}}
      {{#if contact.birthday}}<div>Ngày sinh: {{contact.birthday}}</div>{{/if}}
    </div>
  </header>

  {{#if experiences}}
  <section class="mb-8">
    <h3 class="text-[20px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-5 serif">Work Experience</h3>
    <div class="flex flex-col gap-6">
      {{#each experiences}}
      <div class="flex">
        <div class="w-[28%] pr-4 shrink-0">
          <div class="text-[13px] text-gray-400 font-medium">{{this.period}}</div>
        </div>
        <div class="w-[72%]">
          <h4 class="text-[16px] font-bold text-gray-800 serif mb-0.5">{{this.role}}</h4>
          <div class="text-[14px] text-gray-600 mb-2">{{this.company}}</div>
          <ul class="list-disc list-outside ml-4 text-[13px] text-gray-500 leading-[1.7] space-y-1">
            {{#each this.details}}<li>{{this}}</li>{{/each}}
          </ul>
        </div>
      </div>
      {{/each}}
    </div>
  </section>
  {{/if}}

  {{#if projects}}
  <section class="mb-8">
    <h3 class="text-[20px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-5 serif">Projects</h3>
    <div class="flex flex-col gap-6">
      {{#each projects}}
      <div class="flex">
        <div class="w-[28%] pr-4 shrink-0">
          <div class="text-[13px] text-gray-400 font-medium">{{this.period}}</div>
        </div>
        <div class="w-[72%]">
          <h4 class="text-[16px] font-bold text-gray-800 serif mb-0.5">{{this.name}}</h4>
          <div class="text-[14px] text-gray-600 mb-2">{{this.role}}</div>
          <ul class="list-disc list-outside ml-4 text-[13px] text-gray-500 leading-[1.7] space-y-1">
            {{#each this.details}}<li>{{this}}</li>{{/each}}
          </ul>
        </div>
      </div>
      {{/each}}
    </div>
  </section>
  {{/if}}

  {{#if education}}
  <section class="mb-8">
    <h3 class="text-[20px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-5 serif">Education</h3>
    <div class="flex flex-col gap-6">
      {{#each education}}
      <div class="flex">
        <div class="w-[28%] pr-4 shrink-0">
          <div class="text-[13px] text-gray-400 font-medium">{{this.period}}</div>
        </div>
        <div class="w-[72%]">
          <h4 class="text-[16px] font-bold text-gray-800 serif mb-0.5">{{this.school}}</h4>
          <div class="text-[14px] text-gray-600 mb-1">{{this.degree}}</div>
          {{#if this.details}}
          <ul class="list-disc list-outside ml-4 text-[13px] text-gray-500 leading-[1.7] space-y-1 mt-1.5">
            {{#each this.details}}<li>{{this}}</li>{{/each}}
          </ul>
          {{/if}}
        </div>
      </div>
      {{/each}}
    </div>
  </section>
  {{/if}}

  {{#if activities}}
  <section class="mb-8">
    <h3 class="text-[20px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-5 serif">Activities</h3>
    <div class="flex flex-col gap-6">
      {{#each activities}}
      <div class="flex">
        <div class="w-[28%] pr-4 shrink-0">
          <div class="text-[13px] text-gray-400 font-medium">{{this.period}}</div>
        </div>
        <div class="w-[72%]">
          <h4 class="text-[16px] font-bold text-gray-800 serif mb-0.5">{{this.name}}</h4>
          <div class="text-[14px] text-gray-600 mb-2">{{this.role}}</div>
          <ul class="list-disc list-outside ml-4 text-[13px] text-gray-500 leading-[1.7] space-y-1">
            {{#each this.details}}<li>{{this}}</li>{{/each}}
          </ul>
        </div>
      </div>
      {{/each}}
    </div>
  </section>
  {{/if}}

  {{#if certifications}}
  <section class="mb-8">
    <h3 class="text-[20px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-5 serif">Certifications</h3>
    <div class="flex flex-col gap-4">
      {{#each certifications}}
      <div class="flex items-center">
        <div class="w-[28%] pr-4 shrink-0">
          <div class="text-[13px] text-gray-400 font-medium">{{this.year}}</div>
        </div>
        <div class="w-[72%]">
          <h4 class="text-[15px] font-bold text-gray-800 serif">{{this.name}}</h4>
          <div class="text-[13px] text-gray-500">{{this.issuer}}</div>
        </div>
      </div>
      {{/each}}
    </div>
  </section>
  {{/if}}

  <div class="grid grid-cols-3 gap-8 mb-8">
    {{#if hardSkills}}
    <div>
      <h3 class="text-[18px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-4 serif">Professional Skills</h3>
      <ul class="list-disc list-outside ml-4 text-[13.5px] text-gray-500 leading-[1.7] space-y-1">
        {{#each hardSkills}}<li>{{this}}</li>{{/each}}
      </ul>
    </div>
    {{/if}}
    {{#if computerSkills}}
    <div>
      <h3 class="text-[18px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-4 serif">Computer Skills</h3>
      <ul class="list-disc list-outside ml-4 text-[13.5px] text-gray-500 leading-[1.7] space-y-1">
        {{#each computerSkills}}<li>{{this.name}} <span class="italic text-gray-400 text-[11px] ml-1">({{this.level}})</span></li>{{/each}}
      </ul>
    </div>
    {{/if}}
    {{#if languages}}
    <div>
      <h3 class="text-[18px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-4 serif">Languages</h3>
      <ul class="list-disc list-outside ml-4 text-[13.5px] text-gray-500 leading-[1.7] space-y-1">
        {{#each languages}}<li>{{this.name}} <span class="italic text-gray-400 text-[11px] ml-1">({{this.level}})</span></li>{{/each}}
      </ul>
    </div>
    {{/if}}
  </div>

  {{#if references}}
  <section class="mb-8">
    <h3 class="text-[20px] font-bold text-gray-800 border-b-[1.5px] border-gray-400 pb-2 mb-5 serif">References</h3>
    <div class="grid grid-cols-2 gap-6">
      {{#each references}}
      <div>
        <h4 class="text-[15px] font-bold text-gray-800 serif mb-0.5">{{this.name}}</h4>
        <div class="text-[13px] text-gray-600 mb-1">{{this.role}}</div>
        <div class="text-[12.5px] text-gray-500">{{this.phone}}</div>
      </div>
      {{/each}}
    </div>
  </section>
  {{/if}}

</body>
</html>`;

async function main() {
  // Kiểm tra template đã tồn tại chưa
  const existing = await prisma.cvTemplate.findFirst();
  if (existing) {
    console.log(`ℹ️  Template "${existing.name}" đã tồn tại (id: ${existing.id}), bỏ qua seed.`);
    return;
  }

  const template = await prisma.cvTemplate.create({
    data: {
      name: "Classic Professional",
      thumbnailUrl: "https://placehold.co/640x800/f6f5f4/787671?text=Classic+Pro",
      htmlStructure: TEMPLATE_HTML,
      cssStyles: "",
      isActive: true,
    },
  });

  console.log(`✅ Template "${template.name}" (id: ${template.id}) đã được tạo!`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
