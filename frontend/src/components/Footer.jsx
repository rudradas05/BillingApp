import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0b0f1a]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Invoice<span className="text-cyan-400">Master</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-sm">
              A modern billing & invoicing platform designed for speed,
              clarity, and control.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Product
              </span>
              <a className="text-gray-400 hover:text-white transition">
                Billing
              </a>
              <a className="text-gray-400 hover:text-white transition">
                Inventory
              </a>
              <a className="text-gray-400 hover:text-white transition">
                Reports
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-500">
                Company
              </span>
              <a className="text-gray-400 hover:text-white transition">
                About
              </a>
              <a className="text-gray-400 hover:text-white transition">
                Privacy
              </a>
              <a className="text-gray-400 hover:text-white transition">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} InvoiceMaster. All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            Built with care by{" "}
            <span className="text-gray-300 font-medium">Rudra Das</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
