# Insight Document Genie

## Project Overview

**Insight Document Genie** is an AI-powered document intelligence tool that enables users to extract structured data from complex documents. Leveraging advanced AI, OCR (Optical Character Recognition), and Vision-Language Models, users can simply describe what they want to extract in natural language, upload documents, and receive structured results.

## Features

- Upload documents (PDFs, images, etc.)
- Natural language query input for extraction requirements
- AI-driven extraction using models like OpenAI, Anthropic, Hugging Face, and Tesseract OCR
- Document type detection (e.g., legal contracts, invoices)
- Extraction of key entities (names, dates, amounts, addresses, etc.)
- Confidence scoring and processing status feedback
- Export of extracted data

## Intended Audience

Anyone needing to extract structured data from unstructured or semi-structured documents, such as legal professionals, accountants, researchers, or business analysts.

## Getting Started

### Prerequisites
- Node.js & npm (recommended to install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup
```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### API Key Configuration
To use AI extraction features, configure your API keys in `src/components/DocumentProcessor.tsx`:
- OpenAI API Key
- Anthropic API Key (optional)
- Hugging Face API Key (optional)

You can hardcode them or use environment variables/localStorage as needed.

## Usage
1. Open the web UI.
2. Configure extraction requirements and upload your document.
3. Enter a natural language query describing what you want to extract (e.g., "Extract all contract parties, dates, and monetary values").
4. View structured extraction results and export as needed.

## Technologies Used
- Vite
- React
- TypeScript
- shadcn-ui
- Tailwind CSS
- OpenAI, Anthropic, Hugging Face APIs
- Tesseract OCR

