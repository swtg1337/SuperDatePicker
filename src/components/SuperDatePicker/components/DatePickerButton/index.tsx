import { type FC } from 'react'

import { LuRefreshCcw as LuRefreshCcwIcon } from '../../utils/icons.ts'
import './style.scss'

type DatePickerButtonProps = {
    fill?: boolean
    show: boolean | "iconOnly"
    disabled?: boolean
    onClick: () => void
}

const DatePickerButton: FC<DatePickerButtonProps> = ({ fill, show, disabled, onClick }) => {
    if (!show) return null

    return (
        <button
            className={`super-datepicker-confirm-btn ${fill === false ? 'no-fill' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            <LuRefreshCcwIcon />
            {show !== 'iconOnly' && 'Refresh'}
        </button>
    )
}

export default DatePickerButton
