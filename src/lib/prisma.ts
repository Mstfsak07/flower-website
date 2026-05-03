import { PrismaClient } from "@prisma/client";
import type { Order, ReturnRequest } from "@/lib/types";

declare global {
  var __prisma__: PrismaClient | undefined;
  var __demoOrders__: Order[] | undefined;
  var __demoReturnRequests__: ReturnRequest[] | undefined;
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}

export const demoOrderStore = {
  list() {
    return global.__demoOrders__ ?? [];
  },
  add(order: Order) {
    global.__demoOrders__ = [order, ...(global.__demoOrders__ ?? [])];
    return order;
  },
  findByOrderNumber(orderNumber: string) {
    return (global.__demoOrders__ ?? []).find((order) => order.orderNumber === orderNumber) ?? null;
  },
};

export const demoReturnRequestStore = {
  list() {
    return global.__demoReturnRequests__ ?? [];
  },
  add(request: ReturnRequest) {
    global.__demoReturnRequests__ = [request, ...(global.__demoReturnRequests__ ?? [])];
    return request;
  },
};
