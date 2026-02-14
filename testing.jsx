import React, { useState } from 'react';
import { Copy, ArrowRight, Loader2 } from 'lucide-react';

export default function CodeConverter() {
  const [sourceLanguage, setSourceLanguage] = useState('php');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [sourceCode, setSourceCode] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      setError('Please enter some code to convert');
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setError('Source and target languages must be different');
      return;
    }

    setLoading(true);
    setError('');
    setConvertedCode('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Convert the following ${sourceLanguage.toUpperCase()} code to ${targetLanguage.toUpperCase()}. Only return the converted code without any explanation or markdown formatting:\n\n${sourceCode}`
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        let convertedText = data.content[0].text.trim();
        // Remove markdown code blocks if present
        convertedText = convertedText.replace(/```[\w]*\n?/g, '').trim();
        setConvertedCode(convertedText);
      } else {
        setError('Failed to convert code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during conversion. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode);
  };

  const handleClear = () => {
    setSourceCode('');
    setConvertedCode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Code Language Converter</h1>
          <p className="text-gray-600">Convert code between different programming languages</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <ArrowRight className="text-gray-400" size={20} />

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleConvert}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Converting...
                  </>
                ) : (
                  'Convert'
                )}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Source Code</label>
              </div>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder={`Paste your ${sourceLanguage.toUpperCase()} code here...`}
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Converted Code</label>
                {convertedCode && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                )}
              </div>
              <textarea
                value={convertedCode}
                readOnly
                placeholder="Converted code will appear here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 text-center">
          AI-powered code conversion • Results may need review and testing
        </div>
      </div>
    </div>
  );
}
