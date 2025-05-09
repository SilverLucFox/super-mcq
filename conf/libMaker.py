import json
import re

def txt_to_json(input_file, output_file):
    # Read and process the input file
    with open(input_file, 'r') as f:
        content = f.read().strip()
    
    # Split questions by empty lines
    question_blocks = re.split(r'\n\s*\n', content)
    
    questions = []
    
    for block in question_blocks:
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        
        if len(lines) < 6:
            continue  # Skip invalid blocks
            
        # Extract components
        question = lines[0]
        options_lines = lines[1:5]
        answer_line = lines[5]
        
        # Process options
        options = {}
        for line in options_lines:
            match = re.match(r'^([a-d])[):]\s*(.*)', line, re.IGNORECASE)
            if match:
                key = match.group(1).lower()
                value = match.group(2).strip()
                options[key] = value
        
        # Process answer
        answer_key = re.search(r'([a-d])', answer_line, re.IGNORECASE).group(1).lower()
        answer_value = f"{answer_key}) {options[answer_key]}"
        
        # Build question dictionary
        questions.append({
            "question": question,
            "options": options,
            "answer": answer_value
        })
    
    # Write to JSON file
    with open(output_file, 'w') as f:
        json.dump(questions, f, indent=4)

# Example usage
txt_to_json('input.txt', 'output.json')