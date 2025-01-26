export interface ScanProfile {
  id: string;
  name: string;
  description?: string;
  sided: 'single' | 'double';
  color: 'color' | 'bw';
  format: 'a4' | 'letter' | 'legal';
}
