// services/chatGptService.ts
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions'; // Replace with the actual endpoint if different
const API_KEY = process.env.REACT_APP_GPT_KEY; // Replace with your actual OpenAI API key

export const analyzeCode = async (code: string) => {
    const response = await axios.post(API_URL, {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `${code} 해당 코드파일의 구현 목적을 1줄로 요약설명해주고, 문제점이나 잠재적인 위험을 진단한 결과를 1줄로 간단히 피드백 해주고, 진단 결과에 대한 코드파일의 안전 위험성을 0~100%로 단답으로 작성해주고, 반드시 한국어로만 답변해줘` }],
        max_tokens: 1024, // Adjust as needed
        top_p: 1,
        temperature: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    console.log('Response:', response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
};
