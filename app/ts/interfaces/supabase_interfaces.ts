export interface Category {
    id: number,
    value: string,
    label: string,
    svg?: string
}

export interface Location {
    id: number,
    name: string,
    address: string,
    hash: string,
    category?: Array<string>,
}