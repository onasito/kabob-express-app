// src/controllers/menuController.js
import prisma from '../config/prismaClient.js';

// ============== MENU CATEGORIES ==============

// GET /api/menu/categories
export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.menuCategory.findMany({
      include: {
        items: true,
      },
      orderBy: { id: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

// GET /api/menu/categories/:id
export async function getCategoryById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await prisma.menuCategory.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
}

// POST /api/menu/categories
export async function createCategory(req, res, next) {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const existingCategory = await prisma.menuCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(409).json({ message: "Category with this slug already exists" });
    }

    const category = await prisma.menuCategory.create({
      data: { name, slug },
      include: {
        items: true,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

// PUT /api/menu/categories/:id
export async function updateCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const { name, slug } = req.body;
    const data = {};

    if (name !== undefined) data.name = name;
    if (slug !== undefined) {
      // Check if slug is already taken by another category
      const existing = await prisma.menuCategory.findUnique({
        where: { slug },
      });
      if (existing && existing.id !== id) {
        return res.status(409).json({ message: "Slug already in use" });
      }
      data.slug = slug;
    }

    const updatedCategory = await prisma.menuCategory.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: "Category not found" });
    }
    next(error);
  }
}

// DELETE /api/menu/categories/:id
export async function deleteCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    await prisma.menuCategory.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: "Category not found" });
    }
    next(error);
  }
}

// ============== MENU ITEMS ==============

// GET /api/menu/items
export async function getItems(req, res, next) {
  try {
    const items = await prisma.menuItem.findMany({
      include: {
        category: true,
      },
      orderBy: { id: 'asc' },
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
}

// GET /api/menu/items/:id
export async function getItemById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
}

// POST /api/menu/items
export async function createItem(req, res, next) {
  try {
    const { name, description, price, isAvailable, categoryId } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({ message: "Name, price, and categoryId are required" });
    }

    // Validate that the category exists
    const category = await prisma.menuCategory.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description: description ?? null,
        price: Number(price),
        isAvailable: isAvailable ?? true,
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

// PUT /api/menu/items/:id
export async function updateItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const { name, description, price, isAvailable, categoryId } = req.body;
    const data = {};

    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (isAvailable !== undefined) data.isAvailable = isAvailable;

    if (categoryId !== undefined) {
      // Validate that the category exists
      const category = await prisma.menuCategory.findUnique({
        where: { id: Number(categoryId) },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      data.categoryId = Number(categoryId);
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: "Menu item not found" });
    }
    next(error);
  }
}

// DELETE /api/menu/items/:id
export async function deleteItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: "Menu item not found" });
    }
    next(error);
  }
}
