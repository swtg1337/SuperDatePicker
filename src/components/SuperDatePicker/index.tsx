import { type FC, useEffect, useState, useCallback } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { parse, isValid, format, subMinutes } from 'date-fns'

import DatePickerQuickSelect from './components/DatePickerQuickSelect'
import DatePickerPopoverField from './components/DatePickerPopoverField'

import './style.scss'
import {
    MdErrorOutline,
    CiCalendar,
    IoIosArrowDown,
    IoIosArrowRoundForward,
} from './utils/icons.ts'
import DatePickerButton from './components/DatePickerButton'

type UpdateButtonProps = {
    fill?: boolean
}

type OnTimeChangeProps = {
    start: Date
    end: Date
    isInvalid: boolean
}

type DateFormatType =
    | 'dd.MM.yyyy HH:mm'
    | 'dd.MM.yyyy HH:mm:ss'
    | 'dd.MM.yyyy'
    | 'HH:mm:ss'
    | 'dd.MM HH:mm'

type SuperDatePickerProps = {
    initialStart?: Date
    initialEnd?: Date
    onTimeChange: (props: OnTimeChangeProps) => void
    minDate?: Date
    maxDate?: Date
    disabled?: boolean
    showQuickSelect?: boolean
    showUpdateButton?: boolean | 'iconOnly'
    updateButtonProps?: UpdateButtonProps
    dateFormat?: DateFormatType
}

const validateDateInput = (
    inputValue: string,
    dateFormat: string,
    minDate?: Date,
    maxDate?: Date,
): { date?: Date; error?: string } => {
    const parsed = parse(inputValue, dateFormat, new Date())
    if (!isValid(parsed)) {
        return { error: `Неверный формат. Пример: ${dateFormat}`}
    }
    if (minDate && parsed < minDate) {
        return { error: `Не раньше ${format(minDate, dateFormat)}` }
    }
    if (maxDate && parsed > maxDate) {
        return { error: `Не позже ${format(maxDate, dateFormat)}` }
    }
    return { date: parsed }
}


export const SuperDatePicker: FC<SuperDatePickerProps> = ({
    initialStart,
    initialEnd,
    onTimeChange,
    minDate,
    maxDate,
    disabled,
    showQuickSelect = true,
    showUpdateButton = true,
    updateButtonProps,
    dateFormat = 'dd.MM.yyyy HH:mm'
}) => {
    const [start, setStart] = useState<Date>(initialStart ?? subMinutes(new Date(), 30))
    const [end, setEnd] = useState<Date>(initialEnd ?? new Date())
    const [startInputValue, setStartInputValue] = useState(() => format(start!, dateFormat))
    const [endInputValue, setEndInputValue] = useState(() => format(end!, dateFormat))
    const [error, setError] = useState<string | null>(null)
    const [startError, setStartError] = useState<string | null>(null)
    const [endError, setEndError] = useState<string | null>(null)

    // для реализации onTimeChange когда кнопка не отрисовывается
    const shouldDeferUpdate = !!showUpdateButton

    // вызов onTimeChange сразу если кнопка не передана
    const triggerOnTimeChangeSafely = useCallback(
        (nextStart: Date, nextEnd: Date, localError: string | null) => {
            if (!shouldDeferUpdate) {
                onTimeChange({
                    start: nextStart,
                    end: nextEnd,
                    isInvalid: !!(localError || error),
                })
            }
        },
        [shouldDeferUpdate, error, onTimeChange]
    )


    // подтверждение ввода в input для start
    const handleConfirmStart = () => {
        const { date, error: validationError } = validateDateInput(startInputValue, dateFormat, minDate, maxDate)
        setStartError(validationError ?? null)
        if (!validationError && date) {
            setStart(date)
            triggerOnTimeChangeSafely(date, end, null)
        }
    }

    // подтверждение ввода в input для end
    const handleConfirmEnd = () => {
        const { date, error: validationError } = validateDateInput(endInputValue, dateFormat, minDate, maxDate)
        setEndError(validationError ?? null)
        if (!validationError && date) {
            setEnd(date)
            triggerOnTimeChangeSafely(start, date, null)
        }
    }

    // выбор в календаре для start
    const handlePickStart = (date: Date) => {
        setStart(date)
        setStartInputValue(format(date, dateFormat))
        setStartError(null)
        triggerOnTimeChangeSafely(date, end, startError)
    }

    // выбор в календаре для end
    const handlePickEnd = (date: Date) => {
        setEnd(date)
        setEndInputValue(format(date, dateFormat))
        setEndError(null)
        triggerOnTimeChangeSafely(start, date, endError)
    }

    // проверка на start > end и на диапазон
    useEffect(() => {
        if (start && end) {
            if (start > end) {
                setError('Начальная дата не может быть больше чем конечная')
                return
            }
            if (minDate && maxDate) {
                if (start < minDate || start > maxDate || end < minDate || end > maxDate) {
                    setError(`Дата должна быть в диапазоне от ${format(minDate, dateFormat)} до ${format(maxDate, dateFormat)}`)
                    return
                }
            }
        }
        setError(null)
    }, [start, end, minDate, maxDate])

    // подтверждение выбора quick select или сэттинг ошибки диапазона при заданных minDate maxDate
    const handleQuickSelect = ({ start, end }: { start: Date; end: Date }) => {
        const isBeforeMin = minDate ? start < minDate || end < minDate : false
        const isAfterMax = maxDate ? start > maxDate || end > maxDate : false
        const isInvalid = isBeforeMin || isAfterMax

        if (isInvalid) {
            setError(`Дата должна быть в диапазоне от ${format(minDate!, dateFormat)} до ${format(maxDate!, dateFormat)}`)
        } else {
            setError(null)
        }

        setStart(start)
        setEnd(end)
        setStartInputValue(format(start, dateFormat))
        setEndInputValue(format(end, dateFormat))

        onTimeChange({ start, end, isInvalid })
    }

    const handleButtonClick = () => {
        const isInvalid = (error || startError || endError) ? true : false
        onTimeChange({ start, end, isInvalid })
    }

    return (
        <div className="super-datepicker-container">
            <div className={`super-datepicker-wrapper ${error ? 'super-datepicker-wrapper-error' : ''}`}>
                <div className="super-datepicker-row">
                    {showQuickSelect && (
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <div className="super-datepicker-quick-select">
                                    <CiCalendar className="super-datepicker-calendar" />
                                    <IoIosArrowDown />
                                </div>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content className="super-datepicker-popover" sideOffset={4}>
                                    <DatePickerQuickSelect
                                        onSelect={handleQuickSelect}
                                        disabled={!!disabled}
                                    />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    )}

                    <DatePickerPopoverField
                        date={start}
                        inputValue={startInputValue}
                        error={startError ?? undefined}
                        onInputChange={setStartInputValue}
                        onPick={handlePickStart}
                        onConfirm={handleConfirmStart}
                        disabled={disabled}
                        minDate={minDate}
                        maxDate={maxDate}
                        dateFormat={dateFormat}
                    />

                    <IoIosArrowRoundForward className="super-datepicker-arrow" />

                    <DatePickerPopoverField
                        date={end}
                        inputValue={endInputValue}
                        error={endError ?? undefined}
                        onInputChange={setEndInputValue}
                        onPick={handlePickEnd}
                        onConfirm={handleConfirmEnd}
                        disabled={disabled}
                        minDate={minDate}
                        maxDate={maxDate}
                        dateFormat={dateFormat}
                    />

                    {error &&
                        <div className="super-datepicker-error-icon-wrapper" data-tooltip={error}>
                            <MdErrorOutline className="super-datepicker-error-icon" />
                        </div>
                    }
                </div>
            </div>

            {showUpdateButton && (
                <DatePickerButton
                    show={showUpdateButton}
                    fill={updateButtonProps?.fill}
                    onClick={handleButtonClick}
                    disabled={disabled}
                />
            )}
        </div>
    )
}
