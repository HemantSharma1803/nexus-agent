import React from 'react';
import { Product, SandboxState } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import {
  Search,
  ShoppingCart,
  Star,
  Lock,
  X,
  Check,
  MousePointer,
  Minus,
  Plus,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';

interface SandboxBrowserProps {
  sandboxState: SandboxState;
  onUpdateState: (updater: (prev: SandboxState) => SandboxState) => void;
  onManualAddToCart: (product: Product) => void;
}

export const SandboxBrowser: React.FC<SandboxBrowserProps> = ({
  sandboxState,
  onUpdateState,
  onManualAddToCart,
}) => {
  // Real filtering & sorting
  const visibleProducts = INITIAL_PRODUCTS.filter((p) => {
    const matchesSearch =
      !sandboxState.searchQuery ||
      p.name.toLowerCase().includes(sandboxState.searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(sandboxState.searchQuery.toLowerCase()) ||
      p.switchType.toLowerCase().includes(sandboxState.searchQuery.toLowerCase());

    const matchesPrice = p.price <= sandboxState.priceCap;
    return matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sandboxState.sortBy === 'price_low') return a.price - b.price;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount;
  });

  const cartTotalItems = sandboxState.cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotalPrice = sandboxState.cart.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );

  return (
    <div className="border border-[#1e2230] rounded-xl bg-[#090b10] flex flex-col h-full overflow-hidden shadow-sm relative">
      {/* Autonomous Agent Cursor / Action HUD Overlay */}
      {sandboxState.currentActionLabel && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="bg-[#0e121d] border border-blue-500/60 text-white px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-mono backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block" />
            <span className="font-semibold text-blue-400 uppercase text-[10px]">NEXUS ACTION</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-200 text-xs font-sans font-medium">{sandboxState.currentActionLabel}</span>
          </div>
        </div>
      )}

      {/* Top Browser Bar */}
      <div className="h-9 bg-[#0e111a] border-b border-[#1e2230] px-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <span className="ml-2 text-[10px] font-mono text-gray-400 font-medium">
            NEXUS SANDBOX
          </span>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-sm bg-[#07080d] border border-[#1e2230] rounded px-2.5 py-0.5 flex items-center gap-2 text-xs font-mono text-gray-300">
          <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          <span className="text-gray-500 text-[11px]">https://</span>
          <span className="text-blue-400 text-[11px] font-medium">market.nexus.local</span>
          <span className="text-gray-400 text-[11px]">/keyboards</span>
        </div>

        <div className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          Safe Sandbox
        </div>
      </div>

      {/* Store Header */}
      <div className="bg-[#10131d] border-b border-[#1e2230] px-3.5 py-2 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
            N
          </div>
          <span className="font-semibold text-white text-xs tracking-tight">
            NEXUS MARKET
          </span>
        </div>

        {/* Search Input Box */}
        <div
          id="sandbox-search-box"
          className={`flex-1 max-w-xs relative rounded transition-all ${
            sandboxState.activeSelector === '#sandbox-search-box'
              ? 'ring-2 ring-blue-500 shadow-sm'
              : ''
          }`}
        >
          <Search className="w-3 h-3 absolute left-2.5 top-2 text-gray-400" />
          <input
            type="text"
            value={sandboxState.searchQuery}
            onChange={(e) =>
              onUpdateState((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Search products..."
            className="w-full bg-[#080a0f] border border-[#222738] rounded pl-7 pr-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Cart Trigger */}
        <button
          id="sandbox-cart-button"
          onClick={() =>
            onUpdateState((prev) => ({ ...prev, cartOpen: !prev.cartOpen }))
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
            sandboxState.activeSelector === '#sandbox-cart-button'
              ? 'bg-blue-600/20 text-blue-300 border-blue-500'
              : 'bg-[#141824] hover:bg-[#1a2030] text-gray-300 border-[#222738]'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px]">Cart</span>
          <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
            {cartTotalItems}
          </span>
        </button>
      </div>

      {/* Filter and Sorting Sub-bar */}
      <div className="bg-[#0c0f16] border-b border-[#1e2230] px-3.5 py-1.5 flex items-center justify-between gap-3 text-xs shrink-0">
        <div
          id="sandbox-budget-slider"
          className={`flex items-center gap-2 p-0.5 rounded transition-all ${
            sandboxState.activeSelector === '#sandbox-budget-slider'
              ? 'bg-blue-600/10 ring-1 ring-blue-500'
              : ''
          }`}
        >
          <span className="text-gray-400 text-[11px]">Budget:</span>
          <span className="font-semibold text-white font-mono text-xs">
            &le; ₹{sandboxState.priceCap.toLocaleString('en-IN')}
          </span>
          <input
            type="range"
            min="2000"
            max="4000"
            step="100"
            value={sandboxState.priceCap}
            onChange={(e) =>
              onUpdateState((prev) => ({ ...prev, priceCap: Number(e.target.value) }))
            }
            className="w-20 accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Adaptive Sort Control */}
        <div
          id="sandbox-sort-control"
          className={`flex items-center gap-1 p-0.5 rounded transition-all ${
            sandboxState.activeSelector === '#sandbox-sort-control'
              ? 'bg-blue-600/10 ring-1 ring-blue-500'
              : ''
          }`}
        >
          <span className="text-gray-400 text-[11px]">Sort:</span>
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3 text-gray-500" />
            <select
              value={sandboxState.sortBy}
              onChange={(e) => onUpdateState((prev) => ({ ...prev, sortBy: e.target.value as SandboxState['sortBy'] }))}
              className="bg-[#141824] text-gray-200 border border-[#222738] rounded px-2 py-0.5 text-[11px] outline-none"
            >
              <option value="featured">Featured</option>
              <option value="rating">Rating</option>
              <option value="price_low">Price: Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-3.5 overflow-y-auto max-h-[540px] bg-[#08090f]">
        <div className="flex items-center justify-between mb-2.5 text-xs text-gray-400">
          <span className="text-[11px]">
            Showing <strong className="text-white">{visibleProducts.length}</strong> keyboards
          </span>
          <span className="text-[11px] text-gray-500">
            Within ₹{sandboxState.priceCap.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {visibleProducts.map((product) => {
            const isSelected = sandboxState.selectedProductId === product.id;
            const isAddButtonTarget = sandboxState.activeSelector === `#btn-add-${product.id}`;

            return (
              <div
                key={product.id}
                id={`product-${product.id}`}
                className={`bg-[#0f121b] border rounded-lg p-3 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-[#121624] ring-1 ring-blue-500/40 shadow-sm'
                    : 'border-[#1e2230] hover:border-[#2b3145]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono uppercase text-gray-400 font-medium">
                      {product.brand}
                    </span>

                    {isSelected ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-blue-600 text-white shadow-sm">
                        SELECTED BY NEXUS
                      </span>
                    ) : product.price > 3000 ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-medium bg-red-950/40 text-red-400 border border-red-500/30">
                        &gt; ₹3,000
                      </span>
                    ) : null}
                  </div>

                  <h4 className="text-xs font-semibold text-white leading-snug">
                    {product.name}
                  </h4>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      ({product.reviewsCount.toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-400 mt-1">
                    {product.switchType}
                  </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="mt-3 pt-2 border-t border-[#1a1f2e] flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-white font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-gray-500 line-through font-mono">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      {product.inStock ? `In stock (${product.stockCount})` : 'Out of stock'}
                    </div>
                  </div>

                  <button
                    id={`btn-add-${product.id}`}
                    onClick={() => onManualAddToCart(product)}
                    disabled={!product.inStock}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                      isAddButtonTarget
                        ? 'bg-blue-600 text-white font-semibold ring-2 ring-blue-400'
                        : isSelected
                        ? 'bg-blue-600 text-white font-medium'
                        : product.inStock
                        ? 'bg-[#181d2a] hover:bg-[#202738] text-gray-200 border border-[#252c3d]'
                        : 'bg-[#10131d] text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <span>{product.inStock ? 'Add to Cart' : 'Sold Out'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Drawer */}
      {sandboxState.cartOpen && (
        <div className="absolute inset-y-0 right-0 w-64 bg-[#0d1017] border-l border-[#1e2230] shadow-xl p-3.5 flex flex-col justify-between z-30 animate-in slide-in-from-right-2 duration-150">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1e2230]">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                  Cart ({cartTotalItems})
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onUpdateState((prev) => ({ ...prev, cart: [] }))} className="text-gray-500 hover:text-rose-300 p-1" title="Clear cart"><Trash2 className="w-3.5 h-3.5" /></button>
                <button
                  onClick={() => onUpdateState((prev) => ({ ...prev, cartOpen: false }))}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="py-2.5 space-y-2 overflow-y-auto max-h-[360px]">
              {sandboxState.cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-2 rounded bg-[#121622] border border-[#202536] text-xs"
                >
                  <div className="font-semibold text-white truncate">{item.product.name}</div>
                  <div className="flex justify-between items-center text-gray-400 mt-1 gap-2">
                    <div className="flex items-center gap-1 rounded border border-[#222738] bg-[#0d1017]">
                      <button onClick={() => onUpdateState((prev) => ({ ...prev, cart: prev.cart.map((x) => x.product.id === item.product.id ? { ...x, quantity: Math.max(0, x.quantity - 1) } : x).filter((x) => x.quantity > 0) }))} className="p-1 hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="min-w-4 text-center text-[10px]">{item.quantity}</span>
                      <button onClick={() => onUpdateState((prev) => ({ ...prev, cart: prev.cart.map((x) => x.product.id === item.product.id ? { ...x, quantity: x.quantity + 1 } : x) }))} className="p-1 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="font-mono text-blue-400 font-semibold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1e2230]">
            <div className="flex justify-between items-center text-xs text-white mb-2">
              <span>Subtotal:</span>
              <span className="font-bold text-blue-400 font-mono">
                ₹{cartTotalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateState((prev) => ({ ...prev, cartOpen: false }))
              }
              className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
            >
              Close Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
