import React, { useState, useRef, useEffect } from 'react';
import { Clock, CaretUp, CaretDown } from 'phosphor-react';

const TimePicker = ({ value, onChange, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const pickerRef = useRef(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      if (h !== undefined && m !== undefined) {
        if (h === 0) {
          setHours(12);
          setIsAM(true);
        } else if (h < 12) {
          setHours(h);
          setIsAM(true);
        } else if (h === 12) {
          setHours(12);
          setIsAM(false);
        } else {
          setHours(h - 12);
          setIsAM(false);
        }
        setMinutes(m || 0);
      }
    }
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (h, m, am) => {
    let hour24 = h;
    if (am && h === 12) hour24 = 0;
    else if (!am && h !== 12) hour24 = h + 12;
    
    return `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleTimeChange = (newHours, newMinutes, newIsAM) => {
    const timeString = formatTime(newHours, newMinutes, newIsAM);
    onChange(timeString);
  };

  const handleHoursChange = (newHours) => {
    setHours(newHours);
    handleTimeChange(newHours, minutes, isAM);
  };

  const handleMinutesChange = (newMinutes) => {
    setMinutes(newMinutes);
    handleTimeChange(hours, newMinutes, isAM);
  };

  const handleAMPMChange = (newIsAM) => {
    setIsAM(newIsAM);
    handleTimeChange(hours, minutes, newIsAM);
  };

  const displayValue = value 
    ? (() => {
        const [h, m] = value.split(':').map(Number);
        let displayHour = h;
        let ampm = 'AM';
        if (h === 0) {
          displayHour = 12;
          ampm = 'AM';
        } else if (h < 12) {
          displayHour = h;
          ampm = 'AM';
        } else if (h === 12) {
          displayHour = 12;
          ampm = 'PM';
        } else {
          displayHour = h - 12;
          ampm = 'PM';
        }
        return `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
      })()
    : '--:-- --';

  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i).filter(m => m % 5 === 0); // 0, 5, 10, 15, etc.

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#5E8B7E] focus:bg-white text-stone-900 text-lg font-semibold flex items-center justify-between hover:border-stone-300 transition-all"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-stone-600" />}
          <span>{displayValue}</span>
        </div>
        <Clock size={18} className="text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-center gap-6">
              {/* Hours Column */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Hour</div>
                <div className="relative h-48 overflow-y-auto scrollbar-hide">
                  <div className="flex flex-col gap-1">
                    {hourOptions.map((h) => (
                      <button
                        key={h}
                        onClick={() => handleHoursChange(h)}
                        className={`w-12 py-2 rounded-lg font-semibold transition-all ${
                          hours === h
                            ? 'bg-[#5E8B7E] text-white shadow-md'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {String(h).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minutes Column */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Min</div>
                <div className="relative h-48 overflow-y-auto scrollbar-hide">
                  <div className="flex flex-col gap-1">
                    {minuteOptions.map((m) => (
                      <button
                        key={m}
                        onClick={() => handleMinutesChange(m)}
                        className={`w-12 py-2 rounded-lg font-semibold transition-all ${
                          minutes === m
                            ? 'bg-[#5E8B7E] text-white shadow-md'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {String(m).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AM/PM Selector */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Period</div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAMPMChange(true)}
                    className={`w-16 py-3 rounded-xl font-bold transition-all ${
                      isAM
                        ? 'bg-[#5E8B7E] text-white shadow-md'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => handleAMPMChange(false)}
                    className={`w-16 py-3 rounded-xl font-bold transition-all ${
                      !isAM
                        ? 'bg-[#5E8B7E] text-white shadow-md'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200">
              <button
                onClick={() => {
                  const now = new Date();
                  const h = now.getHours();
                  const m = now.getMinutes();
                  const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                  onChange(timeString);
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm font-semibold text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
              >
                Now
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-[#5E8B7E] rounded-lg hover:bg-[#4a7a6d] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;

