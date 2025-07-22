import { SuperDatePicker } from './components/SuperDatePicker'


function App() {

const handleTimeChange = ({ start, end, isInvalid }: { start: Date; end: Date; isInvalid: boolean }) => {
    console.log('Выбран диапазон:')
    console.log('Start:', start.toString())
    console.log('End:', end.toString())

    if (isInvalid) {
        console.warn('❌ Диапазон невалиден')
    } else {
        console.log('✅ Диапазон валиден')
    }
}

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Super Date Picker</h1>
                Дизэйблд
            <SuperDatePicker disabled={true} onTimeChange={handleTimeChange} />
                обычная
            <SuperDatePicker
                updateButtonProps={{ fill: false }}
                onTimeChange={handleTimeChange}
            />
                начальные значения
            <SuperDatePicker
                initialStart={new Date('2025-03-19T10:00:00')}
                initialEnd={new Date('2025-05-13T18:00:00')}
                showUpdateButton={false}
                onTimeChange={handleTimeChange}
            />
                мин макс
            <SuperDatePicker
                minDate={new Date('2025-03-19T10:00:00')}
                maxDate={new Date('2025-05-13T18:00:00')}
                showUpdateButton="iconOnly"
                onTimeChange={handleTimeChange}
            />
                без куик селекта
            <SuperDatePicker
                showQuickSelect={false}
                onTimeChange={handleTimeChange}
            />

            <SuperDatePicker
                updateButtonProps={{ fill: false }}
                onTimeChange={handleTimeChange}
                dateFormat="dd.MM.yyyy"
            />
        </div>
)}

export default App
