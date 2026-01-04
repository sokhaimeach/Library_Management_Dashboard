export interface KpiI {
    label: string;
    value: string | number; 
    delta: number; 
    deltaText: string; 
    icon: string;
}

export interface AvaiVsBorI {
    available: number;
    borrowed: number;
    borrowedPct: number;
}