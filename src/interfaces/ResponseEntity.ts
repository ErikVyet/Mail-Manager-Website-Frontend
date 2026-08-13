
export interface ResponseEntity<T> {
    status: number,
    message: string | null,
    data: T | null
}