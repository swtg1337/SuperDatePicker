import { type FC, useState, useCallback } from 'react'
import * as Popover from '@radix-ui/react-popover'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'

import 'react-datepicker/dist/react-datepicker.css'
import { MdOutlineDone as MdOutlineDoneIcon } from '../../utils/icons.ts'

type DatePickerPopoverFieldProps = {
    date: Date | null
    inputValue: string
    error?: string
    disabled?: boolean
    minDate?: Date
    maxDate?: Date
    onInputChange: (value: string) => void
    onPick: (date: Date) => void
    onConfirm: () => void
    dateFormat: string
}

const DatePickerPopoverField: FC<DatePickerPopoverFieldProps> = ({
    date,
    inputValue,
    error,
    disabled,
    minDate,
    maxDate,
    onInputChange,
    onPick,
    onConfirm,
    dateFormat
}) => {
    const [activeTab, setActiveTab] = useState<'absolute' | 'now'>('absolute')

    const handleNowClick = useCallback(() => {
        const now = new Date()
        onPick(now)
        onInputChange(format(now, dateFormat))
        onConfirm()
    }, [onPick, onInputChange, onConfirm, dateFormat])

    const absoluteTabContent = (
        <div className="super-datepicker-popup-content">
            <DatePicker
                selected={date}
                inline
                onChange={(date) => onPick(date as Date)}
                showTimeSelect
                timeFormat="HH:mm"
                dateFormat={dateFormat}
                minDate={minDate}
                maxDate={maxDate}
            />
            <div className="super-datepicker-input-row">
                <input
                    type="text"
                    value={inputValue}
                    placeholder={`пример: ${dateFormat}`}
                    onChange={(e) => onInputChange(e.target.value)}
                    className={`super-datepicker-input ${error ? 'super-datepicker-input-error' : ''}`}
                />
                <button
                    className="super-datepicker-confirm-btn"
                    onClick={onConfirm}
                >
                    <MdOutlineDoneIcon />
                </button>
            </div>
            {error && <div className="super-datepicker-error">{error}</div>}
        </div>
    )

    const nowTabContent = (
        <div className="super-datepicker-now-content">
            <p>Setting the time to "now" means that on every refresh this time will be set to the time of the refresh.</p>

            <div className="super-datepicker-now-wrapper">
                <button
                    className="super-datepicker-now-btn"
                    onClick={handleNowClick}
                    disabled={disabled}
                >
                    Set start date and time to now
                </button>
            </div>
        </div>

    )

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <div className={`super-datepicker-display ${disabled ? 'super-datepicker-disabled' : ''}`}>
                    {date ? format(date, dateFormat) : ''}
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="super-datepicker-popover" sideOffset={4}>
                    <div className="super-datepicker-tabs">
                        <button
                            className={activeTab === 'absolute' ? 'active' : ''}
                            onClick={() => setActiveTab('absolute')}
                        >
                            Absolute
                        </button>
                        <button
                            className={activeTab === 'now' ? 'active' : ''}
                            onClick={() => setActiveTab('now')}
                        >
                            Now
                        </button>
                    </div>


                    <div className="super-datepicker-popup-content">
                        {activeTab === 'absolute' ? absoluteTabContent : nowTabContent }
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}

export default DatePickerPopoverField
