## Компонент SuperDatePicker

## Запуск:
npm i && npm run dev

## Пример использования

Примеры использования находятся в файле App.tsx


## Props

| Prop                | Type                                                                                          | Default | Description                                                                                            |
|---------------------|-----------------------------------------------------------------------------------------------|-------|--------------------------------------------------------------------------------------------------------|
| `initialStart`      | `Date`                                                                                        | —     | Начальное значение даты начала.                                                                        |
| `initialEnd`        | `Date`                                                                                        | —     | Начальное значение даты окончания.                                                                     |
| `onTimeChange`      | `(props: { start: Date; end: Date; isInvalid: boolean }) => void`                             | —     | ***Обязательный пропс.*** Коллбэк при изменении диапазона времени. Возвращает даты и флаг `isInvalid`. |
| `minDate`           | `Date`                                                                                        | —     | Минимально допустимая дата.                                                                            |
| `maxDate`           | `Date`                                                                                        | —     | Максимально допустимая дата.                                                                           |
| `disabled`          | `boolean`                                                                                     | —  | Отключает компонент.                                                                                   |
| `showQuickSelect`   | `boolean`                                                                                     | `true` | Показывать ли блок быстрого выбора диапазона.                                                          |
| `showUpdateButton`  | `boolean \| 'iconOnly'`                                                                       | `true` | Показывает кнопку "Update" или только иконку, если `'iconOnly'`.                                       |
| `updateButtonProps` | `{ fill?: boolean }`                                                                          |   —     | Пропсы для настройки кнопки обновления.                                                                |
| `dateFormat`        | ` 'dd.MM.yyyy HH:mm' \| 'dd.MM.yyyy HH:mm:ss' \| 'dd.MM.yyyy' \| 'HH:mm:ss' \| 'dd.MM HH:mm'` |   dd.MM.yyyy HH:mm     | Формат отображения даты и времени                                                                      |
