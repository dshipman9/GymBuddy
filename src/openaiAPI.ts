import axios, { AxiosError, AxiosInstance } from 'axios';

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

class OpenAI {
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });
  }

  async getGPTResponse(prompt: string): Promise<string | undefined> {
    try {
      const response = await this.client.post('', {
        prompt,
        max_tokens: 500,
        temperature: 0.9,
      });

      return response.data.choices[0]?.text || '';
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Error calling GPT API:', axiosError.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
}

const openAI = new OpenAI(API_KEY);

export default openAI;
