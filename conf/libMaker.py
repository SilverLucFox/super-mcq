import json
import re

def txt_to_json(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]

    questions = []
    i = 0
    while i < len(lines):
        # Get question
        question_match = re.match(r'^Q\d+\.\s+(.*)', lines[i])
        if not question_match:
            i += 1
            continue

        question = question_match.group(1)
        options = {}
        for j in range(1, 5):
            opt_match = re.match(r'^([a-dA-D])[).]\s+(.*)', lines[i + j])
            if opt_match:
                key = opt_match.group(1).lower()
                value = opt_match.group(2)
                options[key] = value
            else:
                break

        # Get answer
        answer_match = re.match(r'^Answer:\s*([a-dA-D])[).]?\s*(.*)', lines[i + 5])
        if answer_match:
            key = answer_match.group(1).lower()
            answer = f"{key}) {options.get(key, '')}"
        else:
            answer = ""

        questions.append({
            "question": question,
            "options": options,
            "answer": answer
        })

        i += 6  # move to next block

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2)

    print(f"✔️ Converted {len(questions)} questions to {output_file}")

# Example usage
txt_to_json('input.txt', 'output.json')
