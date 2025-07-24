import { type FC, useState, useCallback } from 'react'
import {
    startOfToday,
    startOfYesterday,
    startOfWeek,
    startOfMonth,
    startOfYear,
    addSeconds,
    addMinutes,
    addHours,
    addDays,
    addMonths,
    addYears,
    subSeconds,
    subMinutes,
    subHours,
    subDays,
    subMonths,
    subYears,
} from 'date-fns'

import './style.scss'
import { MdOutlineDone } from '../../utils/icons.ts'

type DatePickerQuickSelectProps = {
    onSelect: (range: { start: Date; end: Date }) => void
    disabled: boolean
}

type PeriodNumberType = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'

const DatePickerQuickSelect: FC<DatePickerQuickSelectProps> = ({ onSelect, disabled }) => {
    const [periodDirection, setPeriodDirection] = useState<'last' | 'next'>('last')
    const [periodNumber, setPeriodNumber] = useState<string>('30')
    const [periodUnit, setPeriodUnit] = useState<PeriodNumberType>('days')
    const [error, setError] = useState<string | null>(null)

    const addTime = (date: Date, number: number, unit: string) => {
        switch (unit) {
            case 'seconds':
                return addSeconds(date, number)
            case 'minutes':
                return addMinutes(date, number)
            case 'hours':
                return addHours(date, number)
            case 'days':
                return addDays(date, number)
            case 'months':
                return addMonths(date, number)
            case 'years':
                return addYears(date, number)
            default:
                return date
        }
    }

    const subtractTime = (date: Date, number: number, unit: string) => {
        switch (unit) {
            case 'seconds':
                return subSeconds(date, number)
            case 'minutes':
                return subMinutes(date, number)
            case 'hours':
                return subHours(date, number)
            case 'days':
                return subDays(date, number)
            case 'months':
                return subMonths(date, number)
            case 'years':
                return subYears(date, number)
            default:
                return date
        }
    }

    const handleCustomSelect = () => {
        const num = parseInt(periodNumber, 10)
        const now = new Date()

        if (isNaN(num) || num < 1) {
            setError('Введите число больше 0')
            return
        }

        setError(null)

        let start: Date
        let end: Date

        if (periodDirection === 'last') {
            end = now
            start = subtractTime(now, num, periodUnit)
        } else {
            start = now
            end = addTime(now, num, periodUnit)
        }

        onSelect({ start, end })
    }

    const handleNumberChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            if (value === '' || /^\d+$/.test(value)) {
                setPeriodNumber(value)
            }
        },
        []
    )

    const handleDirectionChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setPeriodDirection(e.target.value as 'last' | 'next')
        },
        []
    )

    const handleUnitChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setPeriodUnit(e.target.value as PeriodNumberType)
        },
        []
    )

    return (
        <div className={`quick-select-menu ${disabled ? 'quick-select-menu-disabled' : ''}`}>

            <div className="quick-select-frequent-label">Quick select</div>

            <div className="quick-select-custom">
                <div className="quick-select-inputs">
                    <select
                        className="quick-select-dropdown"
                        value={periodDirection}
                        onChange={handleDirectionChange}
                    >
                        <option value="last">Last</option>
                        <option value="next">Next</option>
                    </select>

                    <input
                        type="number"
                        min={1}
                        className="quick-select-number"
                        value={periodNumber}
                        onChange={handleNumberChange}
                    />

                    <select
                        className="quick-select-units"
                        value={periodUnit}
                        onChange={handleUnitChange}
                    >
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>

                    <button className="quick-select-confirm-btn" onClick={handleCustomSelect}>
                        <MdOutlineDone />
                    </button>
                </div>

                {error && <div className="quick-select-menu-error">{error}</div>}
            </div>

            <div className="quick-select-divider"></div>

            <div className="quick-select-frequent-label">Commonly used</div>

            <div className="quick-select-frequent-list">
                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfToday(), end: now })
                    }}
                >
                    Today
                </div>

                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfWeek(now, { weekStartsOn: 1 }), end: now })
                    }}
                >
                    This week
                </div>

                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfMonth(now), end: now })
                    }}
                >
                    This month
                </div>

                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfYear(now), end: now })
                    }}
                >
                    This year
                </div>

                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfYesterday(), end: now })
                    }}
                >
                    Yesterday
                </div>

                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfWeek(now, { weekStartsOn: 1 }), end: now })
                    }}
                >
                    Week to date
                </div>

                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfMonth(now), end: now })
                    }}
                >
                    Month to date
                </div>

                <div
                    className="quick-select-item"
                    onClick={() => {
                        const now = new Date()
                        onSelect({ start: startOfYear(now), end: now })
                    }}
                >
                    Year to date
                </div>
            </div>

        </div>
    )
}

export default DatePickerQuickSelect
