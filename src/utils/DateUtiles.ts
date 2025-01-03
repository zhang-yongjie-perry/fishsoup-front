export function getToday() {
    const now = new Date()
    return now.getFullYear() + '-' + (now.getMonth().toString().length == 1 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1)
    + '-' + (now.getDate().toString().length == 1 ? '0' + now.getDate() : now.getDate())
}