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

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[150px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all
          ${value
            ? "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 text-white border-transparent shadow-md shadow-fuchsia-200"
            : "bg-white/80 text-gray-500 border-gray-200 hover:border-fuchsia-300"
          }`}
      >
        <span className="truncate max-w-[110px]">{value || placeholder}</span>
        {value ? (
          <FiX
            size={12}
            onMouseDown={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
          />
        ) : (
          <FiChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && (
        <ul className="absolute z-40 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl max-h-52 overflow-y-auto py-1">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors
                  ${value === opt
                    ? "bg-gradient-to-r from-rose-50 via-fuchsia-50 to-violet-50 text-fuchsia-600 font-semibold"
                    : "text-gray-600 hover:bg-fuchsia-50"
                  }`}
              >
                {opt}
                {value === opt && <FiCheck size={11} className="text-fuchsia-500" />}
              </button>
            </li>
          ))}
        </ul>
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
  <div className="flex flex-wrap gap-1.5">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(value === o.value ? "" : o.value)}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
          ${value === o.value
            ? "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 text-white border-transparent shadow-md shadow-fuchsia-200"
            : "bg-white/80 text-gray-500 border-gray-200 hover:border-fuchsia-300"
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

const FeedFilter: React.FC<FeedFilterProps> = ({ filters, onChange, totalVisible }) => {
  const [expanded, setExpanded] = useState(false);
  const activeCount = [filters.district, filters.ageRange, filters.gender].filter(Boolean).length;

  const set = (key: keyof FeedFilters) => (val: string) =>
    onChange({ ...filters, [key]: val });

  return (
    <div className="bg-white/95 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

        {/* Top row */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setExpanded((o) => !o)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
              ${activeCount > 0
                ? "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500 text-white border-transparent shadow-md shadow-fuchsia-200"
                : "bg-white text-gray-500 border-gray-200 hover:border-fuchsia-300"
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
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => onChange(EMPTY)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                <FiX size={12} /> Clear all
              </button>
            )}
            <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
              {totalVisible} profiles
            </span>
          </div>
        </div>

        {/* Expanded filter panel */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-96 opacity-100 mt-3 pt-3 border-t border-gray-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-wrap gap-5 items-start">

            <div>
              <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-1.5">District</p>
              <SelectDropdown
                placeholder="All Districts"
                value={filters.district}
                options={SL_DISTRICTS}
                onChange={set("district")}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-1.5">Age Range</p>
              <PillGroup
                options={AGE_RANGES}
                value={filters.ageRange}
                onChange={set("ageRange")}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-1.5">Gender</p>
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
