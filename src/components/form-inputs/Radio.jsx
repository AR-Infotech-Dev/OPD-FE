import React from 'react'
import DefaultLabel from "./DefaultLabel";
import ValidationError from './ValidationError';
import { Monitor, Building2, CreditCard, Clock3 } from "lucide-react";
import DynamicIcon from '../ui/DynamicIcon';
function Radio({ field, value, onChange, className = '', error, ...rest }) {
    const isDisabled = Boolean(field.disabled || field.readOnly);
    const isCard = field.isCard || false;
    const emitChange = (name, value) => { onChange?.({ target: { name, value } }); };
    return (
        <div className="flex flex-col gap-1 p-0">
            <DefaultLabel label={field.label} required={field.required} />
            <div className="flex flex-wrap gap-2 pt-0">
                {(field.options || []).map((option) => {
                    const isActive = value === option.value;
                    
                    if (isCard) {
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => !isDisabled && emitChange(field.name, option.value)}
                                disabled={isDisabled}
                                className={`flex w-full items-start gap-2.5 rounded-md border px-3 py-2.5 text-left transition-all min-h-[40px] max-w-[160px]
                                ${isActive
                                        ? "border-[#0E9384] bg-[#F0FDFC] ring-1 ring-[#0E9384]"
                                        : "border-slate-200 bg-slate-50 "
                                    }`}
                            >
                                {field.showRadio && (
                                <div
                                    className={`mt-[2px] flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full border-2
                                   ${isActive ? "border-[#0E9384] bg-[#0E9384]" : "border-slate-300"}`}
                                >
                                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                </div>
                                )}
                                <div className="flex flex-1 items-start gap-2">
                                    
                                    {option.icon && (
                                        <DynamicIcon name={option.icon} size={16} />
                                    )}
                                    <div className="flex flex-col">
                                        <div className="text-[13px] font-semibold leading-4 text-slate-900">
                                            {option.label}
                                        </div>
                                        {option.description && (
                                            <div className="mt-0.5 text-[11px] leading-3 text-slate-500">
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                !isDisabled && emitChange(field.name, option.value)
                            }
                            disabled={isDisabled}
                            className={`rounded-md border px-4 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-70 ${isActive
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-200 bg-slate-100 text-slate-600"
                                }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
            {error && (
                <ValidationError error={error} />
            )}
        </div>
    )
}

export default Radio;
