import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed do banco de dados...");

  // Não limpar dados - seed é idempotente e só cria se não existir

  // Criar email padrão para receber notificações
  const defaultEmailValue = "felipperabelodurans@gmail.com";
  const existingDefaultEmail = await prisma.emailRecipient.findUnique({
    where: { email: defaultEmailValue },
  });

  if (!existingDefaultEmail) {
    const defaultEmail = await prisma.emailRecipient.create({
      data: {
        email: defaultEmailValue,
        active: true,
      },
    });
    console.log(`Email padrao criado: ${defaultEmail.email}`);
  } else {
    console.log(`Email padrao ja existe: ${defaultEmailValue}`);
  }

  // Criar empresas de exemplo
  const companies = [
    {
      name: "KPMG Auditores Independentes",
      cnpj: "57317733000159",
      tradeName: "KPMG",
      address: "Av. Paulista, 2001 - Bela Vista, São Paulo - SP",
      favorite: true,
    },
    {
      name: "Google Brasil Internet LTDA",
      cnpj: "06990590000123",
      tradeName: "Google Brasil",
      address: "Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP",
      favorite: false,
    },
    {
      name: "Microsoft Informática Ltda",
      cnpj: "17163470000140",
      tradeName: "Microsoft Brasil",
      address: "Av. das Nações Unidas, 12995 - Brooklin, São Paulo - SP",
      favorite: false,
    },
    {
      name: "Nu Pagamentos S.A.",
      cnpj: "26087856000156",
      tradeName: "Nubank",
      address: "Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP",
      favorite: true,
    },
  ];

  for (const company of companies) {
    // Verificar se empresa já existe
    const cleanCnpj = company.cnpj.replace(/[^\d]/g, "");
    const existing = await prisma.company.findFirst({
      where: {
        OR: [{ cnpj: cleanCnpj }, { cnpj: company.cnpj }],
      },
    });

    if (!existing) {
      const created = await prisma.company.create({
        data: company,
      });
      console.log(`Empresa criada: ${created.name} (CNPJ: ${created.cnpj})`);
    } else {
      console.log(`Empresa ja existe: ${company.name} (CNPJ: ${company.cnpj})`);
    }
  }

  // Criar emails adicionais de exemplo
  const additionalEmails = [
    {
      email: "admin@kpmg.com",
      active: true,
    },
    {
      email: "contato@company.com",
      active: true,
    },
  ];

  for (const emailData of additionalEmails) {
    const existing = await prisma.emailRecipient.findUnique({
      where: { email: emailData.email },
    });

    if (!existing) {
      const created = await prisma.emailRecipient.create({
        data: emailData,
      });
      console.log(`Email criado: ${created.email}`);
    } else {
      console.log(`Email ja existe: ${emailData.email}`);
    }
  }

  console.log("Seed concluido com sucesso!");
  console.log(`Total de empresas: ${companies.length}`);
  console.log(`Total de emails: ${1 + additionalEmails.length}`);
}

main()
  .catch((e) => {
    console.error("Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
