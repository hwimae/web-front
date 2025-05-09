import openai

TOGETHER_API_KEY = "4e64b86828fc1a78f80a608642df389339ca93eb7b503afd7ad1e4e4ef4ecde7"

client = openai.OpenAI(
    api_key=TOGETHER_API_KEY,
    base_url="https://api.together.xyz/v1",
)

def get_code_completion(messages, max_tokens=512, model="meta-llama/Meta-Llama-3-70B-Instruct-Lite"):
    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model,
        max_tokens=max_tokens,
        stop=[
            "<step>"
        ],
        frequency_penalty=1,
        presence_penalty=1,
        top_p=0.7,
        n=10,
        temperature=0.7,
    )

    return chat_completion

def grammar_correction(text):
    messages = [
        {
            "role": "system",
            "content": "You are a grammar correction AI.",
        },
        {
            "role": "user",
            "content": "Từ câu nhận được, hãy sửa lỗi ngữ pháp thành câu hoàn chỉnh, có ý nghĩa, tự nhiên nhất, in ra 1 câu duy nhất, là tiếng việt không dấu, trả lời theo format mẫu ví dụ. Ví dụ: input: toi mau do thich, output: toi thich mau do ",
        },
        {
            "role": "user",
            "content": text,
        }
    ]
    chat_completion = get_code_completion(messages)
    return chat_completion.choices[0].message.content

print(grammar_correction("toi mau hong thich"))