/**
 * Market growth data for the Pain Market section chart.
 * Values in millions.
 */
export interface MarketDataPoint {
  year: number;
  devs: number;
  jobs: number;
  label: string;
}

export const MARKET_DATA: MarketDataPoint[] = [
  { year: 2015, devs: 18.2, jobs: 4.5, label: '2015' },
  { year: 2016, devs: 19.8, jobs: 4.8, label: '2016' },
  { year: 2017, devs: 21.5, jobs: 5.2, label: '2017' },
  { year: 2018, devs: 23.6, jobs: 5.6, label: '2018' },
  { year: 2019, devs: 26.4, jobs: 5.9, label: '2019' },
  { year: 2020, devs: 31.1, jobs: 5.4, label: '2020' },
  { year: 2021, devs: 35.8, jobs: 7.2, label: '2021' },
  { year: 2022, devs: 41.2, jobs: 6.8, label: '2022' },
  { year: 2023, devs: 48.5, jobs: 4.9, label: '2023' },
  { year: 2024, devs: 55.8, jobs: 4.2, label: '2024' },
  { year: 2025, devs: 64.2, jobs: 3.8, label: '2025' },
];
