export async function mockOpenAI(question: string) {
  await new Promise(res => setTimeout(res, 800));

  return {
    text: `Mocked AI response to: ${question}`,
    tokens: Math.floor(Math.random() * 100) + 50,
  };
}
