export function formatDate(date: Date): string {
    const year: string = date.getFullYear().toString()
    const month: string = (date.getMonth() + 1).toString()
    const day: string = date.getDate().toString()
    const hour: string = date.getHours().toString()
    const minute: string = date.getMinutes().toString()
    return `${year}.${month}.${day} ${hour}:${minute.toString().padStart(2, '0')}`
}
