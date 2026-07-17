import React, { useMemo } from "react";
import { FiTruck, FiZap, FiPackage, FiCalendar, FiClock } from "react-icons/fi";
import { MdLocalShipping } from "react-icons/md";

/**
 * DeliveryEstimate Component
 * --------------------------
 * Displays estimated delivery date/window based on shipping method.
 * Props:
 *   - shippingMethod: "standard" | "express" | "overnight" (default: "standard")
 *   - orderDate: Date object or ISO string (default: now)
 *   - compact: boolean — show compact badge only (default: false)
 *   - showOptions: boolean — show all shipping options as a selector (default: false)
 *   - onMethodChange: (method) => void — callback when user selects a method
 */
export default function DeliveryEstimate({
  shippingMethod = "standard",
  orderDate,
  compact = false,
  showOptions = false,
  onMethodChange,
}) {
  const SHIPPING_OPTIONS = useMemo(() => ({
    standard: {
      label: "Standard Delivery",
      minDays: 5,
      maxDays: 7,
      price: 0,
      priceLabel: "FREE",
      color: "indigo",
      icon: FiTruck,
      description: "Delivered to your doorstep",
    },
    express: {
      label: "Express Delivery",
      minDays: 2,
      maxDays: 3,
      price: 99,
      priceLabel: "₹99",
      color: "amber",
      icon: FiPackage,
      description: "Priority handling & shipping",
    },
    overnight: {
      label: "Overnight Delivery",
      minDays: 1,
      maxDays: 1,
      price: 249,
      priceLabel: "₹249",
      color: "green",
      icon: FiZap,
      description: "Order before 8 PM for next day",
    },
  }), []);

  const selected = SHIPPING_OPTIONS[shippingMethod] || SHIPPING_OPTIONS.standard;

  // Calculate the delivery date window
  const { minDate, maxDate, daysLabel } = useMemo(() => {
    const base = orderDate ? new Date(orderDate) : new Date();
    // Skip weekends for min date
    const addBusinessDays = (date, days) => {
      const result = new Date(date);
      let added = 0;
      while (added < days) {
        result.setDate(result.getDate() + 1);
        const day = result.getDay();
        if (day !== 0 && day !== 6) added++; // skip Sunday (0) and Saturday (6)
      }
      return result;
    };

    const min = addBusinessDays(base, selected.minDays);
    const max = addBusinessDays(base, selected.maxDays);

    const formatDate = (d) =>
      d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    const today = new Date();
    const diffMin = Math.round((min - today) / (1000 * 60 * 60 * 24));

    let daysLabel;
    if (selected.minDays === 1) {
      daysLabel = "Tomorrow";
    } else if (diffMin <= 3) {
      daysLabel = `In ${selected.minDays}–${selected.maxDays} days`;
    } else {
      daysLabel = `In ${selected.minDays}–${selected.maxDays} business days`;
    }

    return { minDate: formatDate(min), maxDate: formatDate(max), daysLabel };
  }, [orderDate, selected]);

  const colorMap = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-200 dark:border-indigo-700",
      icon: "text-indigo-600 dark:text-indigo-400",
      badge: "bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300",
      ring: "ring-indigo-500",
      label: "text-indigo-600 dark:text-indigo-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-700",
      icon: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300",
      ring: "ring-amber-500",
      label: "text-amber-600 dark:text-amber-400",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-700",
      icon: "text-green-600 dark:text-green-400",
      badge: "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300",
      ring: "ring-green-500",
      label: "text-green-600 dark:text-green-400",
    },
  };

  const c = colorMap[selected.color] || colorMap.indigo;
  const Icon = selected.icon;

  // ── Compact badge mode (for cart items row etc.)
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.badge}`}
      >
        <Icon className="h-3 w-3" />
        {daysLabel}
      </span>
    );
  }

  // ── Full card with optional method selector
  return (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden`}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm`}>
          <MdLocalShipping className={`h-5 w-5 ${c.icon}`} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Estimated Delivery
          </p>
          <p className={`text-base font-bold ${c.label}`}>
            {daysLabel}
          </p>
        </div>
        <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
          {selected.minDays === selected.maxDays
            ? minDate
            : `${minDate} – ${maxDate}`}
        </span>
      </div>

      {/* Details row */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <FiCalendar className={`h-4 w-4 ${c.icon} flex-shrink-0`} />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">{selected.label}</span>
          {" · "}
          <span>{selected.description}</span>
        </p>
        <span className={`ml-auto text-sm font-bold ${c.label}`}>
          {selected.priceLabel}
        </span>
      </div>

      {/* Shipping Options Selector */}
      {showOptions && onMethodChange && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FiClock className="h-3.5 w-3.5" /> Choose Shipping Speed
          </p>
          {Object.entries(SHIPPING_OPTIONS).map(([key, opt]) => {
            const isSelected = key === shippingMethod;
            const OptionIcon = opt.icon;
            const oc = colorMap[opt.color] || colorMap.indigo;
            return (
              <label
                key={key}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? `${oc.border} ${oc.bg} ring-1 ${oc.ring}`
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value={key}
                  checked={isSelected}
                  onChange={() => onMethodChange(key)}
                  className="sr-only"
                />
                <div className={`p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
                  <OptionIcon className={`h-4 w-4 ${oc.icon}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {opt.minDays === opt.maxDays
                      ? `${opt.minDays} business day`
                      : `${opt.minDays}–${opt.maxDays} business days`}
                    {" · "}{opt.description}
                  </p>
                </div>
                <span className={`text-sm font-bold ${oc.label}`}>
                  {opt.priceLabel}
                </span>
                {isSelected && (
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center ${oc.badge}`}>
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
