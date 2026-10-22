// Must be the first import so DATABASE_URL is loaded before the Prisma client is created
import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";

type SeedItem = {
    name: string;
    description: string;
    price: string; // string so Prisma stores the exact Decimal, no float rounding
    isAvailable?: boolean;
};

type SeedCategory = {
    name: string;
    slug: string;
    items: SeedItem[];
};

const menu: SeedCategory[] = [
    {
        name: "Kabob Express Dinner",
        slug: "kabob-express-dinner",
        items: [
            {
                name: "Chicken Tandory Kabob",
                description: "Boneless juicy chicken marinated in our seasoning and spices. Mild spicy Served with rice, salad and fresh bread.",
                price: "17.95",
            },
            {
                name: "Chicken Breast Kabob",
                description: "Boneless chicken breast marinated in fresh grated spices.Served with rice, salad and fresh bread.",
                price: "17.95",
            },
            {
                name: "Kofta Kabob",
                description: "Skewers of lean ground beef marinated in fresh grated spices.",
                price: "18.95",
            },
            {
                name: "Lamb Kabob",
                description: "Chunks of lamb marinated in fresh grated spices.Served with rice, salad and fresh bread.",
                price: "18.95",
            },
            {
                name: "Sultani Kabob",
                description: "Combination of Beef Tikka and Kofta. Served with rice, salad and fresh bread.",
                price: "19.95",
            },
            {
                name: "Chicken Sultani",
                description: "Combination Chicken Breast and Kofta. Served with rice, salad and fresh bread.",
                price: "18.95",
            },
            {
                name: "Chicken Beef Sultani",
                description: "Combination of Chicken Breast and Beef Tikka. Served with rice, salad and fresh bread.",
                price: "20.95",
            },
            {
                name: "Grilled Chicken Salad",
                description: "Fresh garden salad topped with marinated chicken kebab.",
                price: "15.95",
            },
            {
                name: "King Sultani",
                description: "Combination of Tikka, Kofta, and chicken. Served with rice, salad and fresh bread.",
                price: "23.95",
            },
            {
                name: "Broni Badenjan (Eggplant)",
                description: "Cooked eggplant with layers of fresh tomato and yogurt. Served with rice, salad and fresh bread.",
                price: "16.95",
            },
            {
                name: "Fish Kabob",
                description: "Tilapia marinated in freshly grated spices and served with rice, salad and fresh bread.",
                price: "16.95",
            },
            {
                name: "Afghan Style",
                description: "Juicy chicken breast tikka, savory beef tikka, and flavorful kofta paired with fluffy naan bread.",
                price: "22.95",
            },
            {
                name: "Chicken kofta",
                description: "Two skewers of succulent ground chicken wrapped along a skewer served with rice, salad and naan.",
                price: "14.95",
            },
            {
                name: "Pack of 4 afghan naan bread",
                description: "Pillowy, fresh Afghan naan bread, perfect for sharing. Pack of four. Made daily in a mud clay tandoor.",
                price: "10.95",
            },
            {
                name: "Ultimate Family Feast",
                description: "A hearty feast with 15 skewers of flavorful chicken, beef, and kofta, paired with rice for 5-6 people, plus grilled tomatoes and jalapenos.",
                price: "104.95",
            },
            {
                name: "Beef Tika Kabob",
                description: "Chunks of beef tenderloin marinated in fresh grated spices. Served with rice, salad and fresh bread.",
                price: "18.95",
            },
        ],
    },
    { name: "Sandwiches", slug: "sandwiches", items: [] },
    { name: "Side Orders", slug: "side-orders", items: [] },
    { name: "Refreshments", slug: "refreshments", items: [] },
];

// Safe to run more than once: existing rows are updated instead of duplicated
async function main(): Promise<void> {
    for (const category of menu) {
        // slug is @unique, so Prisma can upsert on it directly
        const savedCategory = await prisma.menuCategory.upsert({
            where: { slug: category.slug },
            update: { name: category.name },
            create: { name: category.name, slug: category.slug },
        });

        for (const item of category.items) {
            const data = {
                name: item.name,
                description: item.description,
                price: item.price,
                isAvailable: item.isAvailable ?? true,
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
