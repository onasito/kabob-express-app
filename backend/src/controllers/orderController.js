// src/controllers/orderController.js
import prisma from '../config/prismaClient.js';

// ============== ORDERS ==============

// GET /api/orders
export async function getOrders(req, res, next) {
  try {
    const { status, userId } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (userId) {
      where.userId = Number(userId);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

// GET /api/orders/:id
export async function getOrderById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// POST /api/orders
export async function createOrder(req, res, next) {
  try {
    const { customerName, customerPhone, userId, items } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and cannot be empty" });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.menuItemId || !item.quantity) {
        return res.status(400).json({ message: "Each item must have menuItemId and quantity" });
      }
    }

    // Fetch menu items to calculate prices
    const menuItemIds = items.map(item => Number(item.menuItemId));
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(404).json({ message: "One or more menu items not found" });
    }

    // Create a map for quick lookup
    const menuItemMap = new Map(menuItems.map(item => [item.id, item]));

    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItemsData = items.map(item => {
      const menuItem = menuItemMap.get(Number(item.menuItemId));
      const itemPrice = Number(menuItem.price);
      const quantity = Number(item.quantity);
      totalPrice += itemPrice * quantity;

      return {
        menuItemId: Number(item.menuItemId),
        quantity: quantity,
        price: itemPrice,
      };
    });

    // Create the order with items
    const order = await prisma.order.create({
      data: {
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        userId: userId ? Number(userId) : null,
        totalPrice: totalPrice,
        // Items only contains the data for the item on the order
        // like orderId and menuItemId but not the details of the menu item itself
        items: {
          create: orderItemsData,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // adds the menuItems details in the response
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/orders/:id
export async function updateOrder(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const { customerName, customerPhone, status } = req.body;
    const data = {};

    if (customerName !== undefined) data.customerName = customerName;
    if (customerPhone !== undefined) data.customerPhone = customerPhone;
    if (status !== undefined) {
      // Validate status is a valid OrderStatus enum value
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be one of: PENDING, IN_PROGRESS, READY, COMPLETED, CANCELLED"
        });
      }
      data.status = status;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: "Order not found" });
    }
    next(error);
  }
}

// PATCH /api/orders/:id/status
export async function updateOrderStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate status is a valid OrderStatus enum value
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: PENDING, IN_PROGRESS, READY, COMPLETED, CANCELLED"
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: "Order not found" });
    }
    next(error);
  }
}

// DELETE /api/orders/:id
export async function deleteOrder(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    // Delete order (cascade will handle order items)
    await prisma.order.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: "Order not found" });
    }
    next(error);
  }
}

// GET /api/orders/user/:userId
export async function getOrdersByUser(req, res, next) {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}
