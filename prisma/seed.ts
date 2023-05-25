import prisma from "../database/config";

async function main() {
  console.log("Starting to seed database...");

  const user1 = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@gmail.com",
      password: "alice123",
      postDonasi: {
        create: {
          title: "Donasi untuk pendikan",
          slug: "donasi-untuk-pendidikan",
          description: "Pendidikan adalah hal yang penting. Oleh karena itu, saya akan menyumbangkan sebagian uang saya untuk pendidikan. Dana yang saya berikan dapat digunakan untuk membeli buku, online course, dan lain-lain. Silahkan isi form di bawah ini untuk mendapatkan donasi.",
          linkForm: "https://forms.gle/1",
          published: true,
        }
      },
      postBlog: {
        create: {
          title: "Blog pertama saya",
          slug: "blog-pertama-saya",
          body: "Ini adalah blog pertama saya. Saya akan menulis blog ini setiap hari. Saya akan menulis tentang apa saja yang saya pelajari. Saya akan menulis tentang programming, entrepreneurship, dan lain-lain.",
          published: true,
        }
      }
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
