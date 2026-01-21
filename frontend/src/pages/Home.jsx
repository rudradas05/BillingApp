import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Create Bill",
      description: "Generate a new invoice for a customer",
      icon: ShoppingCartIcon,
      path: "/billing",
      primary: true,
    },
    {
      title: "Add Item",
      description: "Add products to your inventory",
      icon: PlusCircleIcon,
      path: "/add-items",
    },
    {
      title: "View Bills",
      description: "Browse and manage past invoices",
      icon: DocumentTextIcon,
      path: "/all-bills",
    },
    {
      title: "Inventory",
      description: "Track stock and pricing",
      icon: ArchiveBoxIcon,
      path: "/all-items",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage billing, inventory, and transactions
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <button
                key={index}
                onClick={() => navigate(card.path)}
                className={`group flex items-start gap-4 rounded-xl border p-6 text-left transition ${
                  card.primary
                    ? "border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20"
                    : "border-white/10 bg-[#0f1424] hover:bg-white/5"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    card.primary
                      ? "bg-cyan-500 text-black"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3
                    className={`text-base font-semibold ${
                      card.primary ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {card.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
