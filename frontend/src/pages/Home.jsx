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
      title: "New Bill",
      description: "Create a fresh invoice with items",
      icon: <ShoppingCartIcon className="h-12 w-12 mb-4" />,
      path: "/billing",
      color: "from-purple-500 to-blue-500",
    },
    {
      title: "Add Items",
      description: "Expand your product catalog",
      icon: <PlusCircleIcon className="h-12 w-12 mb-4" />,
      path: "/add-items",
      color: "from-green-500 to-cyan-500",
    },
    {
      title: "View Bills",
      description: "Access billing history & reports",
      icon: <DocumentTextIcon className="h-12 w-12 mb-4" />,
      path: "/all-bills",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Inventory",
      description: "Manage product stock & details",
      icon: <ArchiveBoxIcon className="h-12 w-12 mb-4" />,
      path: "/all-items",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            InvoiceMaster Pro
          </h1>
          <p className="text-gray-400 text-xl">
            Streamlined billing and inventory management solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-indigo-400/30 hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}
              />
              <div className="flex flex-col items-center text-center">
                <div
                  className={`text-indigo-400 group-hover:text-${card.color
                    .split(" ")[0]
                    .replace("from-", "")} transition-colors`}
                >
                  {card.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-100 mb-2 group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Quick Navigation | Press{" "}
            <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">⌘</kbd>{" "}
            +{" "}
            <kbd className="px-2 py-1 bg-gray-700 rounded text-gray-300">
              1-4
            </kbd>{" "}
            for shortcuts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
