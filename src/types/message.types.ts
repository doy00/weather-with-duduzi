export interface MessageConditions {
  type: 'specificDate' | 'weather' | 'temperature' | 'default';
  date?: string;
  weatherMain?: string;
  feelsLike?: { min: number | null; max: number | null };
  temp?: { min: number | null; max: number | null };
}

export interface MessageData {
  id: number;
  text: string;
  conditions: MessageConditions;
  priority: number;
}

export interface MessagesConfig {
  messages: MessageData[];
}
