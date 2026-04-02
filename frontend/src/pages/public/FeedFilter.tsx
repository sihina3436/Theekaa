import React, { useState, useRef, useEffect } from "react";
import { FiFilter, FiChevronDown, FiX, FiCheck } from "react-icons/fi";

export interface FeedFilters {
  district: string;
  ageRange: string;
  gender: string;
}

const SL_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

const AGE_RANGES = [
  { label: "18–20", value: "18-20" },
  { label: "20–25", value: "20-25" },
  { label: "25–30", value: "25-30" },
  { label: "30–35", value: "30-35" },
  { label: "35–40", value: "35-40" },
  { label: "40–45", value: "40-45" },
];

const GENDERS = ["Male", "Female"];
const EMPTY: FeedFilters = { district: "", ageRange: "", gender: "" };

/* ── District dropdown ── */
const SelectDropdown = ({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    // ✅ FIX: Calculate dropdown position on larger screens
    const handlePositionUpdate = () => {
      if (ref.current && open) {
        const rect = ref.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    if (open) {
      handlePositionUpdate();
      window.addEventListener("scroll", handlePositionUpdate);
      window.addEventListener("resize", handlePositionUpdate);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handlePositionUpdate);
      window.removeEventListener("resize", handlePositionUpdate);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-[200px]">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap
          ${value
            ? "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 text-white border-transparent shadow-md shadow-fuchsia-200"
            : "bg-white/80 text-gray-600 border-gray-300 hover:border-fuchsia-400 hover:bg-white"
          }`}
      >
        <span className="truncate flex-1">{value || placeholder}</span>
        {value ? (
          <FiX
            size={12}
            className="shrink-0 cursor-pointer hover:scale-110 transition-transform"
            onMouseDown={(e) => {
              e.stopPropagation();
              onChange("");
              setOpen(false);
            }}
          />
        ) : (
          <FiChevronDown
            size={12}
            className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* ✅ FIX: Dropdown positioned with fixed positioning on large screens */}
      {open && (
        <>
          {/* Backdrop - close on click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown - properly positioned */}
          <ul
            className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto py-2"
            style={
              dropdownPosition
                ? {
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    width: `${dropdownPosition.width}px`,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  }
                : {}
            }
          >
            {options.length > 0 ? (
              options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors
                      ${
                        value === opt
                          ? "bg-gradient-to-r from-rose-100 via-fuchsia-100 to-violet-100 text-fuchsia-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span>{opt}</span>
                    {value === opt && (
                      <FiCheck size={14} className="text-fuchsia-600 shrink-0" />
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-xs text-gray-400 text-center">
                No districts available
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

/* ── Pill toggle for Age & Gender ── */
const PillGroup = ({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(value === o.value ? "" : o.value)}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap
          ${
            value === o.value
              ? "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 text-white border-transparent shadow-md shadow-fuchsia-200"
              : "bg-white/80 text-gray-600 border-gray-300 hover:border-fuchsia-400 hover:bg-white"
          }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/* ── Main export ── */
interface FeedFilterProps {
  filters: FeedFilters;
  onChange: (f: FeedFilters) => void;
  totalVisible: number;
}

const FeedFilter: React.FC<FeedFilterProps> = ({
  filters,
  onChange,
  totalVisible,
}) => {
  const [expanded, setExpanded] = useState(false);
  const activeCount = [filters.district, filters.ageRange, filters.gender].filter(
    Boolean
  ).length;

  const set = (key: keyof FeedFilters) => (val: string) =>
    onChange({ ...filters, [key]: val });

  return (
    <div className="bg-white/95 border-b border-gray-100 shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setExpanded((o) => !o)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
              ${
                activeCount > 0
                  ? "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 text-white border-transparent shadow-md shadow-fuchsia-200"
                  : "bg-white text-gray-600 border-gray-300 hover:border-fuchsia-400"
              }`}
          >
            <FiFilter size={13} />
            Filters
            {activeCount > 0 && (
              <span className="bg-white/30 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
            <FiChevronDown
              size={12}
              className={`transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => onChange(EMPTY)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
              >
                <FiX size={13} /> Clear all
              </button>
            )}
            <span className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 font-medium">
              {totalVisible} profiles
            </span>
          </div>
        </div>

        {/* Expanded filter panel */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded
              ? "max-h-96 opacity-100 mt-3 pt-3 border-t border-gray-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start pb-2">
            {/* District Filter */}
            <div className="w-full sm:w-auto">
              <p className="text-[10px] font-bold text-fuchsia-500 uppercase tracking-widest mb-2.5">
                District
              </p>
              <SelectDropdown
                placeholder="All Districts"
                value={filters.district}
                options={SL_DISTRICTS}
                onChange={set("district")}
              />
            </div>

            {/* Age Range Filter */}
            <div className="w-full sm:w-auto">
              <p className="text-[10px] font-bold text-fuchsia-500 uppercase tracking-widest mb-2.5">
                Age Range
              </p>
              <PillGroup
                options={AGE_RANGES}
                value={filters.ageRange}
                onChange={set("ageRange")}
              />
            </div>

            {/* Gender Filter */}
            <div className="w-full sm:w-auto">
              <p className="text-[10px] font-bold text-fuchsia-500 uppercase tracking-widest mb-2.5">
                Gender
              </p>
              <PillGroup
                options={GENDERS.map((g) => ({ label: g, value: g }))}
                value={filters.gender}
                onChange={set("gender")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedFilter;
