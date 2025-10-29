// DataPoint interface
export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

// DataService class
export class DataService {
  private data: DataPoint[] = [];
  private updateCallbacks: Array<(data: DataPoint[]) => void> = [];

  constructor() {
    this.generateMockData();
  }

  // Generate mock data
  generateMockData(): void {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

    this.data = labels.map((label, index) => ({
      label,
      value: Math.floor(Math.random() * 100) + 20,
      color: colors[index % colors.length],
    }));
  }

  // Get current data
  getData(): DataPoint[] {
    return [...this.data];
  }

  // Simulate real-time updates
  startRealTimeUpdates(interval: number = 3000): () => void {
    const intervalId = setInterval(() => {
      this.data = this.data.map(point => ({
        ...point,
        value: Math.max(10, Math.min(120, point.value + (Math.random() * 20 - 10))),
      }));

      this.notifySubscribers();
    }, interval);

    return () => clearInterval(intervalId);
  }

  // Subscribe to data updates
  subscribe(callback: (data: DataPoint[]) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers
  private notifySubscribers(): void {
    this.updateCallbacks.forEach(callback => callback(this.getData()));
  }

  // Filter data by minimum value
  filterByValue(minValue: number): DataPoint[] {
    return this.data.filter(point => point.value >= minValue);
  }

  // Get data sorted by value
  getSortedData(ascending: boolean = true): DataPoint[] {
    const sorted = [...this.data].sort((a, b) =>
      ascending ? a.value - b.value : b.value - a.value
    );
    return sorted;
  }

  // Get average value
  getAverage(): number {
    if (this.data.length === 0)
      return 0;
    const sum = this.data.reduce((acc, point) => acc + point.value, 0);
    return sum / this.data.length;
  }
// Get max value
  getMax(): number {
    if (this.data.length === 0) return 0;
    return Math.max(...this.data.map(point => point.value));
  }
// Get min value
  getMin(): number {
    if (this.data.length === 0) return 0;
    return Math.min(...this.data.map(point => point.value));
  }
// Reset data
  reset(): void {
    this.generateMockData();
    this.notifySubscribers();
  }
}
