// Must be the first import so DATABASE_URL is loaded before the Prisma client is created
import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma.js";

type SeedItem = {
  name: string;
  description: string;
  price: string; // string so Prisma stores the exact Decimal, no float rounding
  isAvailable?: boolean;
  image: string;
};

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  items: SeedItem[];
};

const menu: SeedCategory[] = [
  {
    name: "Kabob Express Dinner",
    slug: "kabob-express-dinner",
    description:
      "Our signature entrées, from juicy kabobs to slow-marinated favorites, grilled fresh to order and served with fluffy rice, warm bread, and house-made sauces.",
    items: [
      {
        name: "Chicken Tandory Kabob",
        description:
          "Boneless juicy chicken marinated in our seasoning and spices. Mild spicy Served with rice, salad and fresh bread.",
        price: "17.95",
        image: "/menuImages/chicken-tandoory-kabob.avif",
      },
      {
        name: "Chicken Breast Kabob",
        description:
          "Boneless chicken breast marinated in fresh grated spices.Served with rice, salad and fresh bread.",
        price: "17.95",
        image: "/menuImages/chicken-breast-kabob.avif",
      },
      {
        name: "Kofta Kabob",
        description: "Skewers of lean ground beef marinated in fresh grated spices.",
        price: "18.95",
        image: "/menuImages/kofta-kabob.avif",
      },
      {
        name: "Lamb Kabob",
        description: "Chunks of lamb marinated in fresh grated spices.Served with rice, salad and fresh bread.",
        price: "18.95",
        image: "/menuImages/lamb-kabob.avif",
      },
      {
        name: "Sultani Kabob",
        description: "Combination of Beef Tikka and Kofta. Served with rice, salad and fresh bread.",
        price: "19.95",
        image: "/menuImages/sultani-kabob.avif",
      },
      {
        name: "Chicken Sultani",
        description: "Combination Chicken Breast and Kofta. Served with rice, salad and fresh bread.",
        price: "18.95",
        image: "/menuImages/chicken-sultani.avif",
      },
      {
        name: "Chicken Beef Sultani",
        description: "Combination of Chicken Breast and Beef Tikka. Served with rice, salad and fresh bread.",
        price: "20.95",
        image: "/menuImages/chicken-beef-sultani.avif",
      },
      {
        name: "Grilled Chicken Salad",
        description: "Fresh garden salad topped with marinated chicken kebab.",
        price: "15.95",
        image: "/menuImages/grilled-chicken-salad.avif",
      },
      {
        name: "King Sultani",
        description: "Combination of Tikka, Kofta, and chicken. Served with rice, salad and fresh bread.",
        price: "23.95",
        image: "/menuImages/king-sultani.avif",
      },
      {
        name: "Broni Badenjan (Eggplant)",
        description: "Cooked eggplant with layers of fresh tomato and yogurt. Served with rice, salad and fresh bread.",
        price: "16.95",
        image: "/menuImages/eggplant.avif",
      },
      {
        name: "Fish Kabob",
        description: "Tilapia marinated in freshly grated spices and served with rice, salad and fresh bread.",
        price: "16.95",
        image: "/menuImages/fish-kabob.avif",
      },
      {
        name: "Afghan Style",
        description:
          "Juicy chicken breast tikka, savory beef tikka, and flavorful kofta paired with fluffy naan bread.",
        price: "22.95",
        image: "/menuImages/afghan-style-kabob.webp",
      },
      {
        name: "Chicken kofta",
        description: "Two skewers of succulent ground chicken wrapped along a skewer served with rice, salad and naan.",
        price: "14.95",
        image: "/menuImages/chicken-kofta.avif",
      },
      {
        name: "Pack of 4 afghan naan bread",
        description:
          "Pillowy, fresh Afghan naan bread, perfect for sharing. Pack of four. Made daily in a mud clay tandoor.",
        price: "10.95",
        image: "/menuImages/naan.webp",
      },
      {
        name: "Ultimate Family Feast",
        description:
          "A hearty feast with 15 skewers of flavorful chicken, beef, and kofta, paired with rice for 5-6 people, plus grilled tomatoes and jalapenos.",
        price: "104.95",
        image: "/menuImages/familyfeast.avif",
      },
      {
        name: "Beef Tika Kabob",
        description:
          "Chunks of beef tenderloin marinated in fresh grated spices. Served with rice, salad and fresh bread.",
        price: "18.95",
        image: "/menuImages/beef-tika.avif",
      },
    ],
  },
  {
    name: "Sandwiches",
    slug: "sandwiches",
    description: "Our grilled meats wrapped up for a meal on the go.",
    items: [
      {
        name: "Gyro",
        description: "Mixture of beef and lamb gyro meat with tzatziki",
        price: "14.95",
        image: "/menuImages/gyro.avif",
      },
      {
        name: "Chicken Shwarma",
        description: "Shredded chicken mixed with vegetables and tahini-tarator sauce in pita",
        price: "15.95",
        image: "/menuImages/chicken-shwarma.avif",
      },
      {
        name: "Beef Shwarma",
        description: "Shredded beef mixed with vegetables and tahini-tarator sauce in pita.",
        price: "13.95",
        image: "/menuImages/beef-shwarma.avif",
      },
      {
        name: "Fish Wrap",
        description: "Diced fish mixed with rice, vegetables, and tzatziki sauce in wrap.",
        price: "13.95",
        image: "/menuImages/fish-wrap.avif",
      },
      {
        name: "Beef Wrap",
        description: "Diced beef mixed with rice, vegetables, and tzatziki sauce in wrap.",
        price: "13.95",
        image: "/menuImages/beef-wrap.avif",
      },
      {
        name: "Chicken Wrap",
        description: "Diced chicken mixed with rice, vegetables, and tzatziki sauce in wrap.",
        price: "15.95",
        image: "/menuImages/chicken-wrap.avif",
      },
    ],
  },
  {
    name: "Side Orders",
    slug: "side-orders",
    description: "Round out your meal or build your own plate.",
    items: [
      {
        name: "Beef Tikka Side",
        description: "A mouth watering skewer of marinated beef tikka kabob served with naan made daily in our tandoor",
        price: "8.95",
        image: "/menuImages/beef-tika-side.webp",
      },
      {
        name: "Kofta",
        description:
          "Savor the rich, spiced flavors of our beef kobideh, also known as kofta, served on a single skewer.",
        price: "6.95",
        image: "/menuImages/kofta-side.webp",
      },
      {
        name: "Chicken Tikka Side",
        description:
          "Chicken, marinated and grilled to perfection on a skewer served with naan made daily in clay tandoor",
        price: "6.95",
        image: "/menuImages/chicken-tika-side.webp",
      },
      {
        name: "Lamb Side",
        description:
          "Chunks of lamb on a skewer marinated in fresh grated spices and grilled to perfection on an open flame served with naan",
        price: "7.95",
        image: "/menuImages/lamb-side.webp",
      },
      {
        name: "Fish",
        description: "Tilapia marinated in fresh grated spices.",
        price: "7.95",
        image: "/menuImages/fish.webp",
      },
      {
        name: "Falafel",
        description: "Fried ball made from beans.",
        price: "5.95",
        image: "/menuImages/falafel.avif",
      },
      {
        name: "B. Badenjan (Eggplant)",
        description: "Cooked eggplant with layers of fresh tomato and yogurt.",
        price: "7.95",
        image: "/menuImages/eggplant-side.avif",
      },
      {
        name: "Hummus",
        description: "Dip made from chickpeas.",
        price: "7.95",
        image: "/menuImages/hummus-side.avif",
      },
      {
        name: "Sabzi (Spinach)",
        description: "Tender spinach cooked with onions and tomatoes, served with slices of soft bread.",
        price: "7.95",
        image: "/menuImages/sabzi-side.avif",
      },
      {
        name: "Garden Salad",
        description: "Green salad with mixed vegetables.",
        price: "6.95",
        image: "/menuImages/garden-salad.avif",
      },
      {
        name: "Afghan Rice",
        description: "Fluffy basmati rice, cooked to perfection, ideal for complementing any main dish.",
        price: "5.95",
        image: "/menuImages/afghan-rice.avif",
      },
      {
        name: "Fries",
        description: "Fried Potatoes",
        price: "3.95",
        image: "/menuImages/fries.webp",
      },
      {
        name: "Baklava (Sweet Pastry)",
        description: "Layers of flaky pastry filled with finely chopped nuts and sweetened with syrup.",
        price: "4.95",
        image: "/menuImages/baklava.webp",
      },
      {
        name: "Maast Wa Khiar (Yogurt & Cucumber Dip)",
        description: "Creamy yogurt blended with diced cucumber, garnished with a sprinkle of dried herbs.",
        price: "5.95",
        image: "/menuImages/maast-wa-khiar.avif",
      },
      {
        name: "Extra Sauce",
        description:
          "A complementing blend of traditional Indian spices and ingredients, typically served to enhance the flavors of various main dishes.",
        price: "0.75",
        image: "/menuImages/extra-sauce.avif",
      },
      {
        name: "3 Grilled Tomatoes",
        description:
          "Savor three juicy tomatoes, perfectly grilled, offering a delightful burst of fresh, smoky flavor.",
        price: "4.95",
        image: "/menuImages/grilled-tomatoes.avif",
      },
      {
        name: "3 Grilled Jalapeños",
        description: "Smoky and vibrant, these three grilled jalapeños offer a spicy kick.",
        price: "4.95",
        image: "/menuImages/grilled-jalapenos.webp",
      },
      {
        name: "Naan Bread Piece",
        description: "Fluffy, house bread, perfect for dips and wraps.",
        price: "1.00",
        image: "/menuImages/naan-side.webp",
      },
      {
        name: "Large Pita",
        description:
          "Soft, leavened pita, traditionally baked, serving as a versatile accompaniment to various dishes.",
        price: "1.25",
        image: "/menuImages/large-pita.webp",
      },
    ],
  },
  {
    name: "Refreshments",
    slug: "refreshments",
    description: "Traditional Afghan drinks and everyday favorites.",
    items: [
      {
        name: "Fresh squeezed Pomegranate juice",
        description: "Rich, red pomegranate juice made from fresh pomegranates.",
        price: "7.95",
        image: "/menuImages/pomegranate.webp",
      },
      {
        name: "Bottled/Canned Drink",
        description: "You can choose from water bottles or non carbonated drinks",
        price: "2.95",
        image: "/menuImages/bottled-bevs.webp",
      },
      {
        name: "Home made yogurt drink “doogh”",
        description: "Refreshing Afghan yogurt drink topped with mint.",
        price: "5.95",
        image: "/menuImages/doogh.webp",
      },
      {
        name: "Afghan Tea",
        description:
          "Aromatic Afghan tea infused with traditional spices, offering a unique and delightful experience.",
        price: "2.95",
        image: "/menuImages/afghan-tea.webp",
      },
    ],
  },
];

// Safe to run more than once: existing rows are updated instead of duplicated
async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  // Fail loudly instead of creating an admin with a missing email or password
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  // Hash like register does, otherwise login's bcrypt.compare will reject it
  const hashedPassword = await bcrypt.hash(password, 10);

  // email is @unique, so Prisma can upsert on it directly.
  // update keeps the existing admin in sync with .env if the password changes
  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "ADMIN" },
    create: { name: "Admin", email, password: hashedPassword, role: "ADMIN" },
  });

  console.log(`Seeded admin ${email}`);

  for (const category of menu) {
    // slug is @unique, so Prisma can upsert on it directly
    const savedCategory = await prisma.menuCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: { name: category.name, slug: category.slug, description: category.description },
    });

    for (const item of category.items) {
      const data = {
        name: item.name,
        description: item.description,
        price: item.price,
        isAvailable: item.isAvailable ?? true,
        image: item.image,
        categoryId: savedCategory.id,
      };

      // MenuItem has no unique field, so match on name within the category instead of upsert
      const existing = await prisma.menuItem.findFirst({
        where: { name: item.name, categoryId: savedCategory.id },
      });

      if (existing) {
        await prisma.menuItem.update({ where: { id: existing.id }, data });
      } else {
        await prisma.menuItem.create({ data });
      }
    }

    console.log(`Seeded ${category.name} (${category.items.length} items)`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
