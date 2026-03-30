import React, { useState, useRef, useEffect } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface DateOfBirthPickerProps {
  value: string; 
  onChange: (v: string) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const todayRaw = new Date();
const TODAY_Y  = todayRaw.getFullYear();
const TODAY_M  = todayRaw.getMonth();  
const TODAY_D  = todayRaw.getDate();

const MAX_YEAR = TODAY_Y - 18; 
const MIN_YEAR = TODAY_Y - 80;



const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const firstDayOf  = (y: number, m: number) => new Date(y, m, 1).getDay();


const parseISO = (iso: string): { y: number; m: number; d: number } | null => {
  if (!iso) return null;
  const parts = iso.split("-");
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]) - 1; // convert to 0-indexed
  const d = Number(parts[2]);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return { y, m, d };
};


const calcAge = (iso: string): number | null => {
  const p = parseISO(iso);
  if (!p) return null;
  let age = TODAY_Y - p.y;
  if (TODAY_M < p.m || (TODAY_M === p.m && TODAY_D < p.d)) age--;
  return age;
};


const formatDisplay = (iso: string): string => {
  const p = parseISO(iso);
  if (!p) return "Select date of birth";
  return `${MONTHS[p.m]} ${p.d}, ${p.y}`;
};


const isDayDisabled = (y: number, m: number, d: number): boolean => {
  if (y > MAX_YEAR) return true;
  if (y === MAX_YEAR && m > TODAY_M) return true;
  if (y === MAX_YEAR && m === TODAY_M && d > TODAY_D) return true;
  return false;
};

/** True if we can navigate one month forward from (viewY, viewM). */
const canGoNext = (viewY: number, viewM: number): boolean => {
  const nextM = viewM === 11 ? 0 : viewM + 1;
  const nextY = viewM === 11 ? viewY + 1 : viewY;
  return !isDayDisabled(nextY, nextM, 1); // at least day-1 must be selectable
};

/** True if we can navigate one month backward from (viewY, viewM). */
const canGoPrev = (viewY: number, viewM: number): boolean => {
  return !(viewY <= MIN_YEAR && viewM === 0);
};



const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({ value, onChange }) => {
  const parsed = parseISO(value);

  const [open, setOpen] = useState(false);
  const [viewY, setViewY] = useState(parsed ? parsed.y : MAX_YEAR);
  const [viewM, setViewM] = useState(parsed ? parsed.m : 0);
  const [pickingYear, setPickingYear] = useState(false);

  const ref         = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setPickingYear(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  
  useEffect(() => {
    if (parsed) {
      setViewY(parsed.y);
      setViewM(parsed.m);
    }
  }, [value]);

  
  useEffect(() => {
    if (pickingYear && yearListRef.current) {
      const el = yearListRef.current.querySelector("[data-selected='true']");
      el?.scrollIntoView({ block: "center" });
    }
  }, [pickingYear]);

 

  const selectDay = (day: number) => {
    const iso = `${viewY}-${String(viewM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(iso);
    setOpen(false);
    setPickingYear(false);
  };

  const prevMonth = () => {
    if (!canGoPrev(viewY, viewM)) return;
    if (viewM === 0) { setViewM(11); setViewY(y => y - 1); }
    else setViewM(m => m - 1);
  };

  const nextMonth = () => {
    if (!canGoNext(viewY, viewM)) return;
    if (viewM === 11) { setViewM(0); setViewY(y => y + 1); }
    else setViewM(m => m + 1);
  };



  const days     = daysInMonth(viewY, viewM);
  const firstDay = firstDayOf(viewY, viewM);
  const age      = calcAge(value);

  
  const selDay = parsed && parsed.y === viewY && parsed.m === viewM ? parsed.d : null;

  const yearList = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i);

  return (
    <div ref={ref} className="relative">

    
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setPickingYear(false); }}
        className={`w-full flex items-center gap-3 border rounded-xl py-3 px-4 text-sm transition-all outline-none
          ${value
            ? "border-pink-300 text-gray-700 bg-white"
            : "border-gray-200 text-gray-400 bg-white"
          } hover:border-pink-300 focus:ring-2 focus:ring-pink-400`}
      >
        <FiCalendar className="text-pink-400 shrink-0" size={17} />
        <span className="flex-1 text-left">{formatDisplay(value)}</span>
        {age !== null && (
          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full
            bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
            {age} yrs
          </span>
        )}
      </button>

      
      {open && (
        <div className="absolute z-30 mt-1 left-0 w-[300px] bg-white border border-purple-100 rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Year picker ── */}
          {pickingYear ? (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Select Year</span>
                <button
                  type="button"
                  onClick={() => setPickingYear(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
              </div>
              {/* max-h-64 gives enough room for all ~62 years */}
              <div ref={yearListRef} className="grid grid-cols-4 gap-1.5 max-h-64 overflow-y-auto pr-0.5">
                {yearList.map(y => (
                  <button
                    key={y}
                    type="button"
                    data-selected={viewY === y}
                    onMouseDown={e => { e.preventDefault(); setViewY(y); setPickingYear(false); }}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all
                      ${viewY === y
                        ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-purple-50"
                      }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

          ) : (
            <>
              
              <div className="flex items-center justify-between px-4 py-3 border-b border-purple-50">

                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={!canGoPrev(viewY, viewM)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-purple-50
                    text-gray-400 transition-colors disabled:opacity-30"
                >
                  <FiChevronLeft size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setPickingYear(true)}
                  className="text-sm font-bold text-gray-700 hover:text-purple-500 transition-colors"
                >
                  {MONTHS[viewM]} <span className="text-purple-500">{viewY}</span>
                </button>

                <button
                  type="button"
                  onClick={nextMonth}
                  disabled={!canGoNext(viewY, viewM)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-purple-50
                    text-gray-400 transition-colors disabled:opacity-30"
                >
                  <FiChevronRight size={15} />
                </button>

              </div>

              {/* ── Day-of-week headers ── */}
              <div className="grid grid-cols-7 px-3 pt-2">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-purple-300 py-1">{d}</div>
                ))}
              </div>

              {/* ── Day grid ── */}
              <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  const disabled   = isDayDisabled(viewY, viewM, day);
                  const isSelected = day === selDay;
                  const isToday    = viewY === TODAY_Y && viewM === TODAY_M && day === TODAY_D;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={disabled}
                      onMouseDown={e => { e.preventDefault(); if (!disabled) selectDay(day); }}
                      className={`w-full aspect-square flex items-center justify-center rounded-xl
                        text-xs font-semibold transition-all
                        ${isSelected
                          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md shadow-purple-200"
                          : isToday
                          ? "bg-purple-50 text-purple-500 border border-purple-200"
                          : disabled
                          ? "text-gray-200 cursor-not-allowed"
                          : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* ── Clear ── */}
              {value && (
                <div className="px-4 pb-3 text-center">
                  <button
                    type="button"
                    onMouseDown={e => { e.preventDefault(); onChange(""); setOpen(false); }}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Clear date
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default DateOfBirthPicker;
