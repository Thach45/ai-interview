import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.cvTemplate.findMany();
  for (const template of templates) {
    let updatedHtml = template.htmlStructure;
    // Replace Google Fonts link
    updatedHtml = updatedHtml.replace(
      /https:\/\/fonts\.googleapis\.com\/css2\?family=[^"']+/g,
      "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500&display=swap"
    );
    // Replace font-family CSS
    updatedHtml = updatedHtml.replace(
      /font-family:\s*['"]?(?:Inter|Lora)['"]?,\s*(?:sans-serif|serif);/g,
      "font-family: 'Be Vietnam Pro', sans-serif;"
    );

    await prisma.cvTemplate.update({
      where: { id: template.id },
      data: { htmlStructure: updatedHtml },
    });
    console.log("Updated template:", template.name);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
